import fs from 'node:fs';
import path from 'node:path';
import { conferirFontesDaEntrega } from './fontes-factuais.mjs';

// Listas e detalhes usam a mesma decisão. Aprovação técnica não libera publicação.
export function estadoPublicacao(pasta, entrega, { video, factual, pendencias = [] } = {}) {
  const motivos = [...pendencias];
  const adicionar = texto => { if (!motivos.includes(texto)) motivos.push(texto); };
  try {
    for (const linha of fs.readFileSync(path.join(pasta, 'fontes.md'), 'utf8').split(/\r?\n/)) {
      if (linha.includes('PENDENTE')) adicionar(linha.replace(/^[-*\s]+/, '').slice(0, 160));
    }
  } catch { adicionar('falta a lista de fontes (fontes.md)'); }
  let desatualizada = false;
  if (entrega) {
    try {
      const gerado = Date.parse(entrega.gerado);
      desatualizada = !Number.isFinite(gerado) || fs.statSync(path.join(pasta, 'roteiro.md')).mtimeMs > gerado;
    }
    catch { desatualizada = true; }
  }
  if (!video) adicionar('Gere o vídeo.');
  if (video === 'previa.mp4') adicionar('Renderize o vídeo final; esta é uma prévia rápida.');
  if (!entrega?.voz || entrega.voz === 'mock') adicionar('Gere a narração com voz real.');
  if (video && !entrega) adicionar('Gere novamente o vídeo para conferir a entrega.');
  if (entrega) {
    if (desatualizada) adicionar('O roteiro mudou depois do vídeo: gere novamente.');
    if (entrega.aprovado !== true) adicionar('Corrija as falhas do controle de qualidade.');
    for (const aviso of entrega.avisosAltos || []) adicionar(aviso.msg || 'Revise a qualidade visual.');
    for (const item of entrega.pendencias || []) adicionar(typeof item === 'string' ? item : item.msg || 'Resolva as pendências da entrega.');
    const fontes = factual || conferirFontesDaEntrega(pasta, entrega);
    for (const item of fontes.pendencias || []) adicionar(item.msg);
    if (!fontes.aprovado && !(fontes.pendencias || []).length) adicionar('Confira as fontes da entrega.');
    if (entrega.publicavel !== true && !motivos.length) adicionar('Gere novamente a entrega após a revisão.');
  }
  const publicavel = !!(video && entrega?.publicavel === true && !motivos.length);
  return {
    publicavel,
    estadoPublicacao: publicavel ? 'pronto' : video ? 'pendente' : 'nao-gerado',
    rotuloPublicacao: publicavel ? 'Pronto para publicar' : video ? 'Com pendências' : 'Não gerado',
    motivosPublicacao: motivos,
    proximo: publicavel ? 'Pronto para publicar.' : motivos[0] || 'Gere e confira a entrega.',
  };
}
