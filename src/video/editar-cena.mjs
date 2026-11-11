import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { compilar } from './plano.mjs';
import { validarCena } from './validar.mjs';
import { validarRecursosCena, instanteRecurso } from './engine/recursos-visuais.js';
import { gravarJson } from './arquivo.mjs';
import { arquivoProjeto, lerProjeto, travarEdicao } from './projeto-seguro.mjs';

const hash = v => crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
export function lerEdicao(pasta) {
  const cena = lerProjeto(pasta, 'cena.json', { json: true });
  const falado = lerProjeto(pasta, 'palavras.json', { json: true });
  const roteiro = lerProjeto(pasta, 'roteiro.md');
  const fontes = lerProjeto(pasta, 'fontes.json', { opcional: true });
  const spec = compilar(structuredClone(cena), falado);
  if (!Array.isArray(cena.beats) || cena.beats.length !== spec.beats.length || cena.beats.some(b => spec.beats.filter(s => s.id === b.id).length !== 1)) throw new Error('Prepare cenas com IDs únicos antes de editar.');
  return { revisao: hash({ cena, falado, roteiro, fontes }), cena, falado, spec,
    cenas: cena.beats.map((b, i) => {
      const s = spec.beats[i], proxima = spec.beats[i + 1];
      return { id: b.id, inicio: s.de, fim: s.ate, palavras: s.palavras,
        fala: falado.palavras.slice(s.palavras[0], s.palavras[1] + 1).map(p => p.w).join(' '),
        titulo: b.titulo?.texto || '', recurso: b.elementos?.find(e => e.tipo === 'recurso') || null,
        camera: b.camera || null, intencao: b.sujeito || null,
        cortes: proxima ? falado.palavras.slice(s.palavras[0], proxima.palavras[1]).map((p, j) => ({ indice: s.palavras[0] + j, palavra: p.w, tempo: p.f })) : [] };
    }) };
}
export function resumoEdicao(pasta) {
  const { revisao, cenas } = lerEdicao(pasta);
  return { revisao, cenas, voz: 'A narração é preservada. Mover um corte muda as duas cenas vizinhas, sem acelerar a fala.' };
}
function alterar(d, id, mudancas) {
  if (!mudancas || typeof mudancas !== 'object' || Array.isArray(mudancas) || Object.keys(mudancas).some(k => !['titulo', 'recurso', 'camera', 'corteApos', 'mecanismo'].includes(k))) throw new Error('Use título, composição, câmera ou corte da cena.');
  const i = d.cena.beats.findIndex(b => b.id === id);
  if (i < 0) throw new Error('Cena não encontrada.');
  const b = d.cena.beats[i], s = d.spec.beats[i];
  const afetadas = [id];
  if ('titulo' in mudancas) {
    if (typeof mudancas.titulo !== 'string' || mudancas.titulo.length > 160) throw new Error('Título deve ter até 160 caracteres.');
    if (mudancas.titulo.trim()) b.titulo = { ...(b.titulo || {}), texto: mudancas.titulo.trim(), entra: b.titulo?.entra ?? 0 };
    else delete b.titulo;
  }
  if ('mecanismo' in mudancas) {
    if (!['fases-lua','reflexao-luz'].includes(mudancas.mecanismo)) throw new Error('Escolha um mecanismo disponível.');
    const refs=[...new Set((b.elementos||[]).flatMap(e=>e.afirmacoes||[]))];
    b.elementos=[{tipo:'recurso',forma:'mecanismo',mecanismo:mudancas.mecanismo,entra:0,...refs.length?{afirmacoes:refs}:{}}];
  }
  if ('recurso' in mudancas) {
    const recurso = b.elementos?.find(e => e.tipo === 'recurso');
    const campos = mudancas.recurso;
    if (!recurso || !campos || Array.isArray(campos) || typeof campos !== 'object' || Object.keys(campos).some(k => !['linhas', 'marcar', 'itens', 'dur', 'entra', 'foco', 'unidade', 'layout', 'revelarLinhas'].includes(k))) throw new Error('Composição não editável ou campos inválidos. Preserve o tipo e os ativos da cena.');
    Object.assign(recurso, structuredClone(campos));
  }
  if ('camera' in mudancas) {
    const c = mudancas.camera;
    if (!c || !['normal','aberto','fechado','topo','baixo','lateral','lateralEsq'].includes(c.plano) || !['deriva','avanca','recua','orbita','sobe','desce','panEsq','panDir','nenhum'].includes(c.mov) || Object.keys(c).some(k => !['plano','mov'].includes(k))) throw new Error('Câmera inválida.');
    b.camera = structuredClone(c);
  }
  if ('corteApos' in mudancas && mudancas.corteApos !== s.palavras[1]) {
    const n = d.cena.beats[i + 1], ns = d.spec.beats[i + 1], corte = mudancas.corteApos;
    if (!n || !Number.isInteger(corte) || corte < s.palavras[0] || corte >= ns.palavras[1]) throw new Error('O corte deve manter pelo menos uma palavra em cada cena vizinha.');
    b.palavras = [s.palavras[0], corte]; n.palavras = [corte + 1, ns.palavras[1]];
    delete b.frases; delete n.frases;
    if (d.cena.tempo === 'fixo') { const tempo = d.falado.palavras[corte + 1].t; b.em = [s.de, tempo]; n.em = [tempo, ns.ate]; }
    afetadas.push(n.id);
  }
  const depois = validarCenaEditada(d.cena, d.falado);
  return { afetadas, depois };
}
export function validarCenaEditada(cena, falado) {
  if (!cena || typeof cena !== 'object' || Array.isArray(cena) || !Array.isArray(cena.beats) || !cena.beats.length
      || !Array.isArray(falado?.palavras) || !falado.palavras.length) throw new Error('A versão da cena é inválida. O arquivo atual foi preservado.');
  const ids = cena.beats.map(b => b?.id);
  if (ids.some(id => typeof id !== 'string' || !id.trim()) || new Set(ids).size !== ids.length) throw new Error('A versão da cena tem IDs inválidos.');
  const erros = validarRecursosCena(cena);
  // Peças locais já existentes são aceitas sem executar o código do projeto.
  const locais = { pecas: cena.beats.flatMap(b => (b.elementos || []).filter(e => e.tipo === 'peca').map(e => e.forma)), cenarios: cena.beats.map(b => b.cenario).filter(Boolean) };
  const validacao = validarCena(cena, falado.palavras.length, locais);
  erros.push(...validacao.erros);
  const depois = compilar(structuredClone(cena), falado);
  for (const beat of depois.beats) {
    if (!Number.isFinite(beat.de) || !Number.isFinite(beat.ate) || beat.ate <= beat.de) erros.push(`${beat.id}: tempo inválido.`);
    for (const el of (beat.elementos || []).filter(e => e.tipo === 'recurso')) {
      for (const item of [el, ...(el.itens || []), ...(el.revelarLinhas || []).map(entra => ({ entra }))]) {
        if (item.entra == null) continue;
        try { if (instanteRecurso(item.entra, beat, depois.palavras) + (item.atraso || 0) >= beat.ate) erros.push(`${beat.id}: entrada depois do corte.`); }
        catch (e) { erros.push(e.message); }
      }
    }
  }
  if (erros.length) throw new Error(erros.slice(0, 8).join(' '));
  return depois;
}
export function editarCena(pasta, { revisao, cena: id, mudancas } = {}) {
  const soltar = travarEdicao(pasta);
  try {
    const atual = lerEdicao(pasta);
    if (!revisao || revisao !== atual.revisao) { const e = new Error('O projeto mudou. Reabra as cenas antes de salvar; seu texto permanece no formulário.'); e.status = 409; throw e; }
    const antes = structuredClone(atual.cena);
    const { afetadas, depois } = alterar(atual, id, mudancas);
    if (hash(antes) === hash(atual.cena)) return { alterou: false, ...resumoEdicao(pasta), afetadas: [], reaproveitarVoz: true };
    const pastaHistorico = arquivoProjeto(pasta, 'edicoes'); fs.mkdirSync(pastaHistorico, { recursive: true });
    const registro = { versao: 1, id: crypto.randomUUID(), em: new Date().toISOString(), revisaoAnterior: revisao, antes, depois: atual.cena, afetadas,
      render: afetadas.map(id => { const a = atual.spec.beats.find(b => b.id === id), b = depois.beats.find(b => b.id === id); return { cena: id, de: Math.max(0, Math.min(a.de,b.de) - .3), ate: Math.max(a.ate,b.ate) + .3 }; }) };
    gravarJson(arquivoProjeto(pasta, `edicoes/${registro.id}.json`), registro);
    gravarJson(arquivoProjeto(pasta, 'cena.json'), atual.cena);
    return { alterou: true, ...resumoEdicao(pasta), afetadas, historico: registro.id, reaproveitarVoz: true,
      aviso: 'Cena salva. Confira a prévia e gere uma entrega nova antes de publicar.' };
  } finally { soltar(); }
}
