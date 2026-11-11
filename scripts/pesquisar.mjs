import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { abrirProjeto, arquivoProjeto, lerProjeto } from '../src/video/projeto-seguro.mjs';
import { planejarPesquisa, coletarPesquisa, lerPesquisa } from '../src/video/pesquisa-assistida.mjs';
import { gravarJson } from '../src/video/arquivo.mjs';

export async function executar(args,{raiz=fileURLToPath(new URL('..',import.meta.url)),baixar}={}){
  const [nome,...opcoes]=args;
  if(opcoes.some(o=>!['--coletar','--conferir','--refazer'].includes(o)))throw new Error('Uso: npm run pesquisar -- <projeto> [--coletar|--conferir]');
  const pasta=abrirProjeto(raiz,nome),registro=lerProjeto(pasta,'fontes.json',{json:true});
  if(opcoes.includes('--coletar'))return coletarPesquisa(pasta,{baixar,refazer:opcoes.includes('--refazer')});
  if(opcoes.includes('--conferir')){
    const r=lerPesquisa(pasta,registro);
    if(!r.ativo)throw new Error('Inicie a coleta antes de conferir a pesquisa.');
    fs.mkdirSync(arquivoProjeto(pasta,'saida'),{recursive:true});gravarJson(arquivoProjeto(pasta,'saida/pesquisa-check.json'),r);return r;
  }
  const plano=planejarPesquisa(registro);
  fs.mkdirSync(arquivoProjeto(pasta,'saida'),{recursive:true});gravarJson(arquivoProjeto(pasta,'saida/pesquisa-plano.json'),plano);return plano;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{const r=await executar(process.argv.slice(2));console.log(JSON.stringify(r,null,2));process.exitCode=r.aprovado===false?1:0;}
  catch{console.error('Pesquisa: não foi possível concluir. Confira o projeto, fontes.json e docs/pesquisa-assistida.md.');process.exitCode=1;}
}
