import fs from 'node:fs';
import crypto from 'node:crypto';
import { gravarJson } from './arquivo.mjs';
import { arquivoProjeto, lerProjeto, travarEdicao } from './projeto-seguro.mjs';
import { baixarPagina, textoDaPagina } from './coletar-fonte.mjs';

const normal = s => String(s ?? '').normalize('NFC').replace(/\s+/g,' ').trim();
export const hashPesquisa = valor => crypto.createHash('sha256').update(JSON.stringify(valor)).digest('hex');
const carregar = (pasta,nome) => lerProjeto(pasta,nome,{json:true,opcional:true});
export function planejarPesquisa(registro) {
  if (registro?.versao !== 1 || !Array.isArray(registro.afirmacoes) || !Array.isArray(registro.fontes)) throw new Error('Prepare fontes.json antes de pesquisar.');
  return { versao:1, assinatura:hashPesquisa(registro), tarefas:registro.afirmacoes.map(a=>({
    id:a.id, texto:a.texto, estado:a.estado,
    buscas:[a.texto,`${a.texto} limitações controvérsia refutação`,`${a.texto} fonte original evidência`,`${a.texto} reportagem contexto data`,`${a.texto} análise especializada histórico`],
    fontes:[...new Set((a.evidencias || []).map(e=>e.fonte))],
    verificar:['Equivalência da frase e contexto, inclusive ressalvas.','Data e validade do fato.','Independência editorial dos publicadores.','Evidências contrárias e resultados parciais.'],
  })) };
}
export async function coletarPesquisa(pasta,{baixar=baixarPagina,agora=()=>new Date(),refazer=false}={}) {
  const soltar=travarEdicao(pasta);
  try {
    const registro=carregar(pasta,'fontes.json'),plano=planejarPesquisa(registro);
    const ids=new Set(plano.tarefas.flatMap(t=>t.fontes));
    const fontes=registro.fontes.filter(f=>ids.has(f.id));
    const pastaSaida=arquivoProjeto(pasta,'saida');fs.mkdirSync(pastaSaida,{recursive:true});
    const anterior=carregar(pasta,'saida/pesquisa-fontes.json');
    const coletadas=[];
    for(const fonte of fontes){
      const guardada=!refazer && anterior?.fontes?.find(f=>f.id===fonte.id && f.url===fonte.url && f.texto && Date.parse(f.coletadaEm)>agora().getTime()-86400000);
      if(guardada){coletadas.push(guardada);continue;}
      try{
        const resposta=await baixar(fonte.url),texto=textoDaPagina(resposta.html);
        if(texto.length<100) throw new Error('Texto insuficiente; consulte a página com o assistente.');
        coletadas.push({id:fonte.id,url:fonte.url,urlFinal:resposta.url,coletadaEm:agora().toISOString(),sha256:hashPesquisa(texto),texto});
      }catch{coletadas.push({id:fonte.id,url:fonte.url,coletadaEm:agora().toISOString(),erro:'Coleta indisponível. Consulte a fonte original com o assistente ou escolha outra fonte acessível.'});}
    }
    if(hashPesquisa(carregar(pasta,'fontes.json'))!==plano.assinatura) throw new Error('As afirmações mudaram durante a coleta. Pesquise novamente.');
    const cache={versao:1,assinaturaRegistro:plano.assinatura,fontes:coletadas};
    gravarJson(arquivoProjeto(pasta,'saida/pesquisa-plano.json'),plano);
    gravarJson(arquivoProjeto(pasta,'saida/pesquisa-fontes.json'),cache);
    const revisao=carregar(pasta,'pesquisa-revisao.json');
    if(!revisao) gravarJson(arquivoProjeto(pasta,'pesquisa-revisao.json'),{versao:1,assinaturaRegistro:plano.assinatura,
      afirmacoes:plano.tarefas.map(t=>({id:t.id,resultado:'inconclusiva',justificativa:'',independencia:'',contradicoes:[],ressalvas:[],citacoes:[]}))});
    return analisarPesquisa(registro,cache,carregar(pasta,'pesquisa-revisao.json'),{hoje:agora().toISOString().slice(0,10)});
  }finally{soltar();}
}
export function analisarPesquisa(registro,cache,revisao,{hoje=new Date().toISOString().slice(0,10),usadas=null}={}) {
  const pendencias=[],afirmacoes=[];
  const problema=(codigo,msg,afirmacao)=>pendencias.push({codigo,msg,afirmacao});
  if(!cache && !revisao)return{ativo:false,aprovado:true,pendencias,afirmacoes};
  if(!registro || !cache || cache.versao!==1 || !Array.isArray(cache.fontes) || !revisao || revisao.versao!==1 || !Array.isArray(revisao.afirmacoes)){
    problema('pesquisa-incompleta','Complete a coleta e a revisão da pesquisa.');return{ativo:true,aprovado:false,pendencias,afirmacoes};
  }
  const assinatura=hashPesquisa(registro);
  if(cache.assinaturaRegistro!==assinatura || revisao.assinaturaRegistro!==assinatura) problema('pesquisa-desatualizada','As afirmações ou fontes mudaram. Atualize a coleta e revise a pesquisa atual.');
  const lista=Array.isArray(registro.afirmacoes)?registro.afirmacoes:[];
  for(const fato of lista.filter(a=>!usadas || usadas.includes(a.id))){
    const avaliacoes=revisao.afirmacoes.filter(a=>a?.id===fato.id),r=avaliacoes[0];
    const p=(codigo,msg)=>problema(codigo,`${fato.id}: ${msg}`,fato.id);
    if(avaliacoes.length!==1 || !r){p('pesquisa-sem-revisao','registre uma revisão única da afirmação.');continue;}
    afirmacoes.push({id:fato.id,resultado:r.resultado,justificativa:r.justificativa,independencia:r.independencia,ressalvas:r.ressalvas,contradicoes:r.contradicoes,citacoes:Array.isArray(r.citacoes)?r.citacoes.map(c=>({fonte:c?.fonte,trecho:c?.trecho})):[]});
    if(r.resultado!=='sustenta')p('pesquisa-nao-sustenta',`a revisão está ${r.resultado || 'inconclusiva'}; ajuste a alegação ou pesquise mais.`);
    if(!normal(r.justificativa) || !normal(r.independencia))p('pesquisa-sem-justificativa','explique a equivalência com a fonte e a independência dos publicadores.');
    if(!Array.isArray(r.contradicoes) || r.contradicoes.some(c=>typeof c!=='string') || !Array.isArray(r.ressalvas) || r.ressalvas.some(c=>typeof c!=='string'))p('pesquisa-ressalvas-invalidas','registre contradições e ressalvas como listas de textos.');
    if(r.contradicoes?.length)p('pesquisa-contradicao','há evidências contrárias registradas; resolva a formulação antes de publicar.');
    if(!Array.isArray(r.citacoes)||!r.citacoes.length){p('pesquisa-sem-citacao','associe a conclusão aos trechos efetivamente consultados.');continue;}
    const evidencias=Array.isArray(fato.evidencias)?fato.evidencias:[];
    for(const evidencia of evidencias){
      const cita=r.citacoes.find(c=>c?.fonte===evidencia.fonte && normal(c.trecho)===normal(evidencia.trecho));
      if(!cita)p('pesquisa-evidencia-sem-revisao','uma evidência do registro não foi coberta pela revisão.');
    }
    for(const c of r.citacoes){
      const f=cache.fontes.find(f=>f?.id===c?.fonte),fonte=registro.fontes?.find(f=>f.id===c?.fonte);
      if(typeof f?.texto !== 'string' || !f.texto || f.erro || !fonte || f.url!==fonte.url || !normal(c?.trecho) || !normal(f.texto).includes(normal(c.trecho)) || f.sha256!==hashPesquisa(f.texto) || c.sha256!==f.sha256){p('pesquisa-citacao-nao-localizada','citação ausente ou diferente da página coletada; não marque como conferida.');continue;}
      const data=Date.parse(f.coletadaEm),idade=Date.parse(hoje+'T23:59:59Z')-data;
      if(!Number.isFinite(data)||idade<0||idade>30*86400000)p('pesquisa-coleta-expirada','reconsulte a fonte: coleta inválida ou mais antiga que 30 dias.');
    }
  }
  return{ativo:true,aprovado:!pendencias.length,pendencias,afirmacoes,limite:'Trechos são conferidos literalmente. A conclusão semântica é declarada pelo pesquisador, não uma prova automática de verdade.'};
}
export function lerPesquisa(pasta,registro,opcoes={}) {
  try{return analisarPesquisa(registro,carregar(pasta,'saida/pesquisa-fontes.json'),carregar(pasta,'pesquisa-revisao.json'),opcoes);}
  catch{return{ativo:true,aprovado:false,pendencias:[{codigo:'pesquisa-invalida',msg:'Arquivos de pesquisa inválidos ou inacessíveis.'}],afirmacoes:[]};}
}
