import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { abrirProjeto } from '../src/video/projeto-seguro.mjs';
import { resumoEdicao, editarCena, lerEdicao } from '../src/video/editar-cena.mjs';
import { planejarDirecao } from '../src/video/direcao-visual.mjs';

export function executar(args,{raiz=fileURLToPath(new URL('..',import.meta.url))}={}){
  const [nome,id,arquivo]=args,pasta=abrirProjeto(raiz,nome);
  if(!id)return resumoEdicao(pasta);
  if(id==='--direcao'){const d=lerEdicao(pasta);return planejarDirecao(d.cena,d.falado);}
  if(!arquivo || args.length!==3)throw new Error('Uso: npm run cena -- <projeto> [<id> <pedido.json>|--direcao]');
  const abs=path.resolve(arquivo);
  if(path.basename(abs).startsWith('.env')||fs.lstatSync(abs).isSymbolicLink()||!fs.statSync(abs).isFile()||fs.statSync(abs).size>100000)throw new Error('Pedido inválido.');
  const pedido=JSON.parse(fs.readFileSync(abs,'utf8'));return editarCena(pasta,{...pedido,cena:id});
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{console.log(JSON.stringify(executar(process.argv.slice(2)),null,2));}
  catch(e){console.error('Edição: '+e.message);process.exitCode=1;}
}
