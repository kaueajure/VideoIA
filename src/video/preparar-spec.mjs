import path from 'node:path';
import { estadoMarca } from '../marca-opcional.mjs';
import { aplicarMarcaOpcional } from './engine/marca-opcional.js';
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
import { enquadrarFotosIsoladas } from './engine/enquadramento-base.js';

export const assinaturaPreparacao = (cena, falado) => crypto.createHash('sha256')
  .update(JSON.stringify({ cena, falado })).digest('hex');

// Prévia e produção recebem os mesmos dados, ativos e regras de entrada.
// A preparação de b-roll pode popular o cache local; não baixa mídia remota.
export function prepararSpec(cena, falado, {
  pasta, plano = {}, locais, registrarUsoMarcas = false, preservarEnquadramento = false,
} = {}) {
  const erros = validarRecursosCena(cena);
  if (erros.length) throw new Error(erros.join('\n'));
  const spec = compilar(structuredClone(cena), falado, { plano });
  const protecao = conferirStoryboard(cena, spec, { compilado: true });
  if (protecao.length) throw new Error('Storyboard protegido: ' + protecao.join(' '));
  variedadeEntradas(spec);
  if (preservarEnquadramento) spec.enquadramentoRevisado = true;
  enquadrarFotosIsoladas(spec);
  for (const beat of spec.beats) for (const el of beat.elementos || []) {
    if (el.tipo !== 'recurso') continue;
    // Este painel tem enquadramento próprio; o movimento 3D automático não
    // descreve o que é desenhado nele. Preserve uma câmera autoral explícita.
    if (!cena.beats.find(b => b.id === beat.id)?.camera) beat.camera = { plano: 'normal', mov: 'nenhum' };
    if (el.entra != null) el.t0 = instanteRecurso(el.entra, beat, spec.palavras) + (el.atraso || 0);
    // Uma entrada inexistente não pode virar um evento no instante errado.
    for (const item of [el, ...(el.itens || []), ...(el.revelarLinhas || []).map(entra => ({ entra })),
      ...(el.forma === 'decomposicao' ? [{ entra: el.separarEm }] : [])]) {
      if (item.entra != null && instanteRecurso(item.entra, beat, spec.palavras) >= beat.ate) {
        throw new Error(`${beat.id}: entrada do recurso precisa ocorrer antes do fim do beat.`);
      }
    }
    for (const [i, item] of (el.itens || []).entries()) {
      if (!['comparacao', 'linha-do-tempo', 'causa-efeito'].includes(el.forma)) continue;
      const duracao = item.dur ?? el.dur;
      if (duracao == null) continue;
      const em = instanteRecurso(item.entra, beat, spec.palavras, el.t0 + i * .4);
      if (em < el.t0 || em + duracao + .3 > beat.ate + .001) {
        throw new Error(`${beat.id}: duração do item ${i + 1} deve caber após a entrada e deixar 0,3 s de leitura antes do corte.`);
      }
    }
    if (el.forma === 'decomposicao') {
      const separar = instanteRecurso(el.separarEm, beat, spec.palavras);
      if (separar < el.t0 || separar + (el.dur ?? 1.1) + .3 > beat.ate) {
        throw new Error(`${beat.id}: a decomposição precisa começar após a entrada e terminar com 0,3 s para ler o resultado antes do corte.`);
      }
    }
    if (el.forma === 'campo-tatico') {
      const inicio = el.t0 ?? beat.de;
      for (const p of el.passes) {
        if (beat.de + p.em < inicio || beat.de + p.em + p.dur + .3 > beat.ate) {
          throw new Error(`${beat.id}: o passe deve ocorrer após a entrada e terminar com 0,3 s de leitura antes do corte.`);
        }
      }
      for (const j of el.jogadores.filter(j => j.destino)) {
        if (beat.de + j.moverEm < inicio || beat.de + j.moverEm + (j.dur ?? 1) + .3 > beat.ate) {
          throw new Error(`${beat.id}: deslocamento do jogador precisa caber entre a entrada e o corte.`);
        }
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
  // A preferência atual também vale para prévias preparadas antes de ela mudar.
  if (pasta && !estadoMarca(path.resolve(pasta, '..', '..')).exibir) {
    spec.semMarca = true;
    spec.handle = false;
  }
  return aplicarMarcaOpcional(spec);
}
