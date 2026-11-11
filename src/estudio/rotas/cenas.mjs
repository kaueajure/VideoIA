import path from 'node:path';
import { abrirProjeto, arquivoProjeto, lerProjeto, travarEdicao } from '../../video/projeto-seguro.mjs';
import { lerEdicao, resumoEdicao, editarCena, validarCenaEditada } from '../../video/editar-cena.mjs';
import { planejarDirecao } from '../../video/direcao-visual.mjs';
import { planejarPesquisa, lerPesquisa } from '../../video/pesquisa-assistida.mjs';
import { gravarJson } from '../../video/arquivo.mjs';

const falha = e => [{ erro: e.code === 'ENOENT' ? 'Prepare o roteiro, as cenas e a voz antes de abrir a edição.' : e.message }, e.status || 400];
const ocupado = ctx => ctx.job && !ctx.job.fim;
export function script(ctx,{req,res}) { return ctx.arquivo(req,res,path.join(ctx.raiz,'src/estudio/cenas-ui.js')); }
export function cenas(ctx,{res,m}) {
  try { const pasta=abrirProjeto(ctx.raiz,m[1]),d=lerEdicao(pasta); return ctx.json(res,{...resumoEdicao(pasta),direcao:planejarDirecao(d.cena,d.falado)}); }
  catch(e){const [r,s]=falha(e);return ctx.json(res,r,s);}
}
export function pesquisa(ctx,{res,m}) {
  try { const pasta=abrirProjeto(ctx.raiz,m[1]),registro=lerProjeto(pasta,'fontes.json',{json:true,opcional:true}); return ctx.json(res,{plano:registro?planejarPesquisa(registro):null,pesquisa:lerPesquisa(pasta,registro)}); }
  catch(e){const [r,s]=falha(e);return ctx.json(res,r,s);}
}
export const POST={
  async '/api/cenas/salvar'(ctx,corpo){
    if(ocupado(ctx))return[{erro:'Espere a tarefa atual terminar antes de editar cenas.'},409];
    try{return[editarCena(abrirProjeto(ctx.raiz,corpo.nome),corpo)];}catch(e){return falha(e);}
  },
  async '/api/cenas/ritmo'(ctx,corpo){
    if(ocupado(ctx))return[{erro:'Espere a tarefa atual terminar antes de editar cenas.'},409];
    try{
      const pasta=abrirProjeto(ctx.raiz,corpo.nome),d=lerEdicao(pasta),p=planejarDirecao(d.cena,d.falado).cenas.find(c=>c.id===corpo.cena);
      if(!p?.proposta)throw new Error('Esta composição exige direção autoral; peça o ajuste no chat.');
      return[editarCena(pasta,{...corpo,mudancas:p.proposta})];
    }catch(e){return falha(e);}
  },
  async '/api/cenas/desfazer'(ctx,corpo){
    if(ocupado(ctx))return[{erro:'Espere a tarefa atual terminar antes de desfazer.'},409];
    let soltar;
    try{
      const pasta=abrirProjeto(ctx.raiz,corpo.nome);soltar=travarEdicao(pasta);
      const d=lerEdicao(pasta);
      if(d.revisao!==corpo.revisao) return[{erro:'O projeto mudou. Reabra as cenas antes de desfazer.'},409];
      if(!/^[a-f0-9-]{36}$/.test(corpo.historico||''))throw new Error('Histórico inválido.');
      const h=lerProjeto(pasta,`edicoes/${corpo.historico}.json`,{json:true});
      if(JSON.stringify(h.depois)!==JSON.stringify(d.cena))return[{erro:'Há uma edição posterior. Preserve a versão atual antes de desfazer.'},409];
      validarCenaEditada(h.antes,d.falado);
      gravarJson(arquivoProjeto(pasta,'cena.json'),h.antes);
      return[{...resumoEdicao(pasta),desfez:true}];
    }catch(e){return falha(e);}finally{soltar?.();}
  },
};
