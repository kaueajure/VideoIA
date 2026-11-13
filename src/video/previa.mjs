import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pastaProjetos } from '../programas.mjs';
import { servir } from './servidor.mjs';
import { prepararSpec, assinaturaPreparacao } from './preparar-spec.mjs';
import { lerLocais } from './locais.mjs';

export async function previa(nome, { projetosDir = pastaProjetos(), cena: cenaId } = {}) {
  if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(nome || '')) {
    throw new Error('Nome de projeto inválido para a prévia.');
  }
  const pasta = path.join(projetosDir, nome);
  const cena = path.join(pasta, 'cena.json');
  const palavras = path.join(pasta, 'palavras.json');
  if (!fs.existsSync(cena) || !fs.existsSync(palavras)) {
    throw new Error(`Este vídeo ainda não tem as cenas prontas. No estúdio web, marque "prévia rápida" e clique em Produzir vídeo, ou peça ao assistente para preparar as cenas (ele roda npm run video -- ${nome} --voz=mock --sem-render).`);
  }
  const ler = arquivo => JSON.parse(fs.readFileSync(arquivo, 'utf8').replace(/^\uFEFF/, ''));
  const original = ler(cena), falado = ler(palavras);
  let ajustada;
  try { ajustada = ler(path.join(pasta, 'saida', 'preparacao-previa.json')); } catch {}
  const valida = ajustada?.assinatura === assinaturaPreparacao(original, falado);
  const spec = prepararSpec(valida ? ajustada.cena : original, falado, {
    pasta, locais: await lerLocais(pasta), plano: valida ? ajustada.plano : {}, preservarEnquadramento: valida,
  });
  if (cenaId != null && !spec.beats.some(b => b.id === cenaId)) throw new Error('Cena não encontrada na prévia.');
  const servidor = await servir(spec, { '/audio.mp3': path.join(pasta, 'narracao.mp3') });
  return { url: `http://127.0.0.1:${servidor.porta}/previa${cenaId != null ? `?cena=${encodeURIComponent(cenaId)}` : ''}`, fechar: servidor.fechar };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const nome = process.argv[2];
    if (!nome) throw new Error('Uso: node src/video/previa.mjs <projeto>');
    const servidor = await previa(nome);
    console.log(`Prévia em ${servidor.url}\nCtrl+C para fechar.`);
  } catch (erro) {
    console.error(erro.message);
    process.exitCode = 1;
  }
}
