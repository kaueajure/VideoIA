import { compilar } from './plano.mjs';
import { variedadeEntradas } from './variedade-entradas.mjs';
import { embutirImagens } from './imagens-projeto.mjs';
import { embutirVideos } from './broll.mjs';
import { embutirPontos } from './pontos.mjs';
import { embutirLocais } from './locais.mjs';
import { embutirModelos } from './modelos3d.mjs';
import { embutirMarcas, registrarMarcas } from '../marcas.mjs';
import { validarRecursosCena, instanteRecurso } from './engine/recursos-visuais.js';
import { conferirStoryboard } from './protecao-storyboard.mjs';
import crypto from 'node:crypto';

export const assinaturaPreparacao = (cena, falado) => crypto.createHash('sha256')
  .update(JSON.stringify({ cena, falado })).digest('hex');

// Prévia e produção recebem os mesmos dados, ativos e regras de entrada.
// A preparação de b-roll pode popular o cache local; não baixa mídia remota.
export function prepararSpec(cena, falado, {
  pasta, plano = {}, locais, registrarUsoMarcas = false,
} = {}) {
  const erros = validarRecursosCena(cena);
  if (erros.length) throw new Error(erros.join('\n'));
  const spec = compilar(structuredClone(cena), falado, { plano });
  const protecao = conferirStoryboard(cena, spec, { compilado: true });
  if (protecao.length) throw new Error('Storyboard protegido: ' + protecao.join(' '));
  variedadeEntradas(spec);
  for (const beat of spec.beats) for (const el of beat.elementos || []) {
    if (el.tipo !== 'recurso') continue;
    // Este painel tem enquadramento próprio; o movimento 3D automático não
    // descreve o que é desenhado nele. Preserve uma câmera autoral explícita.
    if (!cena.beats.find(b => b.id === beat.id)?.camera) beat.camera = { plano: 'normal', mov: 'nenhum' };
    if (el.entra != null) el.t0 = instanteRecurso(el.entra, beat, spec.palavras) + (el.atraso || 0);
    // Uma entrada inexistente não pode virar um evento no instante errado.
    for (const item of [el, ...(el.itens || []), ...(el.revelarLinhas || []).map(entra => ({ entra }))]) {
      if (item.entra != null && instanteRecurso(item.entra, beat, spec.palavras) >= beat.ate) {
        throw new Error(`${beat.id}: entrada do recurso precisa ocorrer antes do fim do beat.`);
      }
    }
  }
  embutirImagens(spec, pasta);
  embutirVideos(spec, pasta);
  embutirPontos(spec, pasta);
  embutirLocais(spec, locais);
  embutirModelos(spec, pasta);
  const marcas = embutirMarcas(spec);
  if (registrarUsoMarcas) registrarMarcas(marcas, pasta);
  return spec;
}
