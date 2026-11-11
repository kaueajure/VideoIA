import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { gravarJson, substituirComCalma } from '../arquivo.mjs';
import { arquivoProjeto } from '../projeto-seguro.mjs';

const normal = s => String(s ?? '').replace(/\*/g,'').replace(/\s+/g,' ').trim();
const semTags = s => normal(String(s).replace(/\[[^\]\n]{1,40}\]/g,''));
const hash = v => crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const hashArquivo = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
function executar(programa,args) {
  const r=spawnSync(programa,args,{encoding:'utf8',maxBuffer:1024*1024,timeout:120000});
  if(r.status!==0)throw new Error(`${programa}: não foi possível preparar os blocos de áudio.`);
  return r.stdout;
}
export function dividirBlocos(texto,textoTags=texto,{idioma='pt',limite=900}={}) {
  if(!Number.isInteger(limite)||limite<100||limite>2000)throw new Error('Limite de bloco inválido.');
  const frases=[...new Intl.Segmenter(idioma,{granularity:'sentence'}).segment(String(textoTags))].map(s=>s.segment.trim()).filter(Boolean);
  const partes=[];let tags='';
  for(const frase of frases){
    let pendente=(tags+' '+frase).trim();tags='';
    if(!semTags(pendente)){tags=pendente;continue;}
    while(pendente.length>limite){
      const corte=pendente.lastIndexOf(' ',limite);
      if(corte<1)throw new Error('Há uma palavra maior que o limite do bloco.');
      const trecho=pendente.slice(0,corte);partes.push({texto:semTags(trecho),textoTags:normal(trecho)});pendente=pendente.slice(corte).trim();
    }
    if(semTags(pendente))partes.push({texto:semTags(pendente),textoTags:normal(pendente)});
  }
  if(tags&&partes.length)partes.at(-1).textoTags+=' '+tags;
  if(!partes.length||normal(partes.map(p=>p.texto).join(' '))!==normal(texto))throw new Error('As tags não puderam ser divididas sem alterar a fala. Use blocos:false para este roteiro.');
  return partes;
}
function amostrasWav(arquivo) {
  const r=JSON.parse(executar('ffprobe',['-v','error','-select_streams','a:0','-show_entries','stream=sample_rate,duration_ts,time_base','-of','json',arquivo])).streams?.[0];
  const amostras=Number(r?.duration_ts);
  if(r?.sample_rate!=='44100'||r?.time_base!=='1/44100'||!Number.isSafeInteger(amostras)||amostras<=0)throw new Error('Bloco PCM inválido.');
  return amostras;
}
function palavrasValidas(palavras,texto,duracao) {
  return Array.isArray(palavras)&&palavras.length>0&&normal(palavras.map(p=>p?.w).join(' '))===normal(texto)
    &&palavras.every((p,i)=>typeof p.w==='string'&&Number.isFinite(p.t)&&Number.isFinite(p.f)&&p.t>=0&&p.f>=p.t&&p.f<=duracao+.001&&(!i||p.t>=palavras[i-1].t));
}
export async function narrarEmBlocos({pasta,texto,textoTags=texto,saida,voz,identidade,config={},idioma='pt',refazer=false,sintetizar,alinhar,alinhamento={}}) {
  if(typeof sintetizar!=='function'||typeof alinhar!=='function')throw new Error('Configure síntese e alinhamento dos blocos.');
  const partes=dividirBlocos(texto,textoTags,{idioma,limite:config.limiteBloco??900});
  if(partes.length>200)throw new Error('Divida a produção em partes: máximo de 200 blocos por vídeo.');
  const cache=arquivoProjeto(pasta,'cache/narracao-blocos');fs.mkdirSync(cache,{recursive:true});
  const trabalho=fs.mkdtempSync(path.join(cache,'trabalho-'));
  const blocos=[],assinaturaAlinhamento=hash(alinhamento);let gerados=0,reutilizados=0;
  try{
    for(let i=0;i<partes.length;i++){
      const parte=partes[i],chave=hash({versao:1,voz,identidade,idioma,...parte,fade:.006});
      const wav=arquivoProjeto(pasta,`cache/narracao-blocos/${chave}.wav`),json=arquivoProjeto(pasta,`cache/narracao-blocos/${chave}.json`);
      let meta;
      if(!refazer)try{const m=JSON.parse(fs.readFileSync(json,'utf8'));if(m.chave===chave&&m.audioSha256===hashArquivo(wav)&&amostrasWav(wav)===m.amostras)meta=m;}catch{}
      if(!meta){
        const bruto=path.join(trabalho,`${i}.mp3`),normalizado=path.join(trabalho,`${i}.wav`);
        const r=await sintetizar({...parte,saida:bruto,config,refazer,idioma,textoAnterior:partes[i-1]?.texto,textoSeguinte:partes[i+1]?.texto});
        executar('ffmpeg',['-y','-v','error','-i',r.arquivo||bruto,'-ar','44100','-ac','1','-c:a','pcm_s16le',normalizado]);
        const amostras=amostrasWav(normalizado),duracao=amostras/44100;
        // Fades curtos só nas bordas, sem sobrepor/encurtar as palavras.
        const final=path.join(trabalho,`${i}-final.wav`),fade=Math.min(.006,duracao/4);
        executar('ffmpeg',['-y','-v','error','-i',normalizado,'-af',`afade=t=in:d=${fade},afade=t=out:st=${Math.max(0,duracao-fade)}:d=${fade}`,'-c:a','pcm_s16le',final]);
        meta={versao:1,chave,texto:parte.texto,textoTags:parte.textoTags,amostras,duracao,palavras:r.palavras,tempos:r.tempos,
          origem:palavrasValidas(r.palavras,parte.texto,duracao)?'provedor':'alinhador',assinaturaAlinhamento};
        substituirComCalma(final,wav);meta.audioSha256=hashArquivo(wav);gravarJson(json,meta);gerados++;
      }else reutilizados++;
      if(!palavrasValidas(meta.palavras,parte.texto,meta.duracao)||(meta.origem==='alinhador'&&meta.assinaturaAlinhamento!==assinaturaAlinhamento)){
        const r=await alinhar({audio:wav,texto:parte.texto,idioma});
        meta.palavras=r.palavras;meta.tempos=r.tempos;meta.leitura=r.leitura;meta.origem='alinhador';meta.assinaturaAlinhamento=assinaturaAlinhamento;
      }
      if(!palavrasValidas(meta.palavras,parte.texto,meta.duracao))throw new Error(`Bloco ${i+1}: alinhamento não corresponde à fala. Áudio anterior preservado.`);
      gravarJson(json,meta);blocos.push({...meta,arquivo:wav});
    }
    const lista=path.join(trabalho,'lista.txt');
    fs.writeFileSync(lista,blocos.map(b=>`file '${b.arquivo.replace(/'/g,"'\\''")}'`).join('\n'));
    const pronto=path.join(trabalho,'narracao.mp3');
    executar('ffmpeg',['-y','-v','error','-f','concat','-safe','0','-i',lista,'-ar','44100','-ac','1','-c:a','libmp3lame','-b:a','192k',pronto]);
    let amostras=0;const palavras=[],manifesto=[];
    for(const b of blocos){
      const inicio=amostras/44100,primeira=palavras.length;
      palavras.push(...b.palavras.map(p=>({...p,t:+(p.t+inicio).toFixed(4),f:+(p.f+inicio).toFixed(4)})));
      amostras+=b.amostras;
      manifesto.push({chave:b.chave,texto:b.texto,inicio,fim:amostras/44100,palavras:[primeira,palavras.length-1],audioSha256:b.audioSha256,tempos:b.tempos});
    }
    substituirComCalma(pronto,saida);
    const resumo={versao:1,referenciaTemporal:'PCM antes da compactação de silêncios; use palavras.json para a edição final',voz,identidade,gerados,reutilizados,amostras,duracao:amostras/44100,blocos:manifesto,
      limite:'A voz e os parâmetros são os mesmos; continuidade expressiva entre frases exige escuta. Contexto de síntese dos blocos reutilizados é preservado.'};
    gravarJson(arquivoProjeto(pasta,'narracao-blocos.json'),resumo);
    return{arquivo:saida,palavras,duracao:resumo.duracao,tempos:'alinhamento-por-blocos',blocos:resumo,leitura:blocos.some(b=>Number.isFinite(b.leitura?.confianca))?{confianca:Math.min(...blocos.map(b=>b.leitura?.confianca??1)),naoCasadas:blocos.flatMap(b=>b.leitura?.naoCasadas||[])}:undefined};
  }finally{fs.rmSync(trabalho,{recursive:true,force:true});}
}
