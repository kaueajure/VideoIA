import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { arquivoProjeto, lerProjeto } from './projeto-seguro.mjs';
import { gravarJson } from './arquivo.mjs';
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const entradas = ['roteiro.md','cena.json','palavras.json','fontes.json','fontes.md','pesquisa-revisao.json','saida/pesquisa-fontes.json','narracao-blocos.json'];
const idValido = id => typeof id==='string' && /^[a-f0-9]{24}$/.test(id);
function lerVersao(pasta,id) {
  if(!idValido(id))throw new Error('Versão inválida.');
  const v=lerProjeto(pasta,`versoes/${id}/versao.json`,{json:true});
  if(v.id!==id||!Array.isArray(v.cenas))throw new Error('Registro de versão inválido.');
  return v;
}
export function registrarVersao({pasta,mp4,spec,entrega,relatorio}) {
  // A cópia independente preserva o histórico mesmo se o render seguinte truncar o MP4 ativo.
  const base=arquivoProjeto(pasta,'versoes');fs.mkdirSync(base,{recursive:true});
  const video=arquivoProjeto(pasta,path.relative(pasta,mp4));
  const videoSha256=hash(fs.readFileSync(video));
  const arquivos={};for(const nome of entradas){const f=arquivoProjeto(pasta,nome);if(fs.existsSync(f))arquivos[nome]=fs.readFileSync(f);}
  const hashes=Object.fromEntries(Object.entries(arquivos).map(([n,b])=>[n,hash(b)]));
  const {beats:ignorarBeats,palavras:ignorarPalavras,...globais}=spec;
  const cenas=(spec.beats||[]).map(b=>({id:b.id,inicio:b.de,fim:b.ate,fala:(spec.palavras||[]).slice(b.palavras?.[0],(b.palavras?.[1]??-1)+1).map(p=>p.w).join(' '),assinatura:hash(JSON.stringify({beat:b,globais})),titulo:b.titulo?.texto||''}));
  const qa={falhas:relatorio?.falhas||[],avisos:relatorio?.avisos||[]};
  const id=hash(JSON.stringify({videoSha256,hashes,cenas,qa,publicavel:entrega.publicavel})).slice(0,24);
  const destino=arquivoProjeto(pasta,`versoes/${id}`);
  if(fs.existsSync(destino)){lerVersao(pasta,id);return id;}
  const temp=fs.mkdtempSync(path.join(base,'preparando-'));
  try{
    fs.copyFileSync(video,path.join(temp,'video.mp4'),fs.constants.COPYFILE_FICLONE);
    if(hash(fs.readFileSync(path.join(temp,'video.mp4')))!==videoSha256)throw new Error('O vídeo mudou durante o registro da versão.');
    for(const [nome,b] of Object.entries(arquivos)){
      if(hash(fs.readFileSync(arquivoProjeto(pasta,nome)))!==hashes[nome])throw new Error('O projeto mudou durante o registro da versão.');
      fs.mkdirSync(path.dirname(path.join(temp,nome)),{recursive:true});
      fs.writeFileSync(path.join(temp,nome),b);
    }
    gravarJson(path.join(temp,'versao.json'),{versao:1,id,em:new Date().toISOString(),videoSha256,bytes:fs.statSync(video).size,hashes,cenas,qa,voz:entrega.voz,aprovado:entrega.aprovado,publicavel:entrega.publicavel,blocos:arquivos['narracao-blocos.json']?JSON.parse(arquivos['narracao-blocos.json'].toString()):null});
    fs.renameSync(temp,destino);return id;
  }finally{fs.rmSync(temp,{recursive:true,force:true});}
}
export function listarVersoes(pasta) {
  const base=arquivoProjeto(pasta,'versoes');if(!fs.existsSync(base))return[];
  return fs.readdirSync(base).filter(idValido).map(id=>lerVersao(pasta,id)).sort((a,b)=>b.em.localeCompare(a.em));
}
export function videoVersao(pasta,id) { lerVersao(pasta,id);return arquivoProjeto(pasta,`versoes/${id}/video.mp4`); }
const chaveAviso = a => JSON.stringify([a.tipo,a.beat??a.cena??null,a.msg]);
export function compararVersoes(pasta,antes,depois) {
  const a=lerVersao(pasta,antes),b=lerVersao(pasta,depois),ids=[...new Set([...a.cenas,...b.cenas].map(c=>c.id))];
  const cenas=ids.map(id=>{const x=a.cenas.find(c=>c.id===id),y=b.cenas.find(c=>c.id===id);return{id,antes:x||null,depois:y||null,alterou:!x||!y||x.assinatura!==y.assinatura||x.fala!==y.fala};});
  const diferenca=(x,y)=>x.filter(v=>!y.some(w=>chaveAviso(v)===chaveAviso(w)));
  const qa={};for(const tipo of ['falhas','avisos'])qa[tipo]={novos:diferenca(b.qa[tipo],a.qa[tipo]),resolvidos:diferenca(a.qa[tipo],b.qa[tipo])};
  return{antes:a,depois:b,cenas,arquivos:entradas.filter(n=>a.hashes[n]!==b.hashes[n]),qa,aviso:'A aprovação registrada pertence àquela versão. Confira a entrega atual antes de publicar.'};
}
