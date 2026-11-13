import test from 'node:test';
import assert from 'node:assert/strict';
import { validarRecurso, avaliarRecurso } from '../src/video/engine/recursos-visuais.js';
import { estadoUnidades } from '../src/video/engine/unidades-visuais.js';
import { estadoCampo } from '../src/video/engine/campo-tatico.js';
import { analisarMontagem } from '../src/video/direcao-criativa.mjs';
import { prepararSpec } from '../src/video/preparar-spec.mjs';
import { autoPlano } from '../src/video/autoplano.mjs';
import { abrir, foto } from '../src/video/render.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const palavras = 'O total se divide em dois grupos distintos agora'.split(' ').map((w, i) => ({ w, t: i * .5, f: i * .5 + .4 }));
const falado = { palavras, duracao: 5 };
const recurso = () => ({ id: 'partes', tipo: 'recurso', forma: 'decomposicao', simbolo: 'bola',
  total: 8, rotuloTotal: 'Total ilustrativo', unidade: ' gols', separarEm: 'divide', entra: 0, dur: 1,
  itens: [{ rotulo: 'Grupo A', valor: 7 }, { rotulo: 'Grupo B', valor: 1 }] });
const cena = el => ({ estilo: 'editorial', efeitos: { abertura: false, cauda: false, grao: 0 },
  beats: [{ id: 'b0', palavras: [0, palavras.length - 1], elementos: [el] }] });
const area = { x0: 96, x1: 984, y0: 400, y1: 1160 };
const campo = () => ({ tipo: 'recurso', id: 'campo', forma: 'campo-tatico', entra: 0,
  jogadores: [{ id: 'a', rotulo: 'Apoio', time: 'a', pos: [.2, .7] },
    { id: 'b', rotulo: 'Ponta', time: 'a', pos: [.7, .65], destino: [.7, .2], moverEm: .2, dur: .7 },
    { id: 'c', rotulo: 'Defesa', time: 'b', pos: [.4, .3] }],
  passes: [{ de: 'a', para: 'b', em: .5, dur: .7 }, { de: 'b', para: 'a', em: 2, dur: .6 }] });

test('campo: bola chega ao receptor em movimento e não teleporta entre passes', () => {
  const el = campo(), beat = { de: 0, ate: 5 };
  assert.deepEqual(validarRecurso(el), []);
  const antes = estadoCampo(el, beat, .1), durante = estadoCampo(el, beat, .8), fim = estadoCampo(el, beat, 1.2);
  assert.deepEqual(antes.bola, antes.jogadores[0].atual);
  assert.equal(durante.ativo, null);
  assert.deepEqual(fim.bola, fim.jogadores[1].atual);
  assert.deepEqual(estadoCampo(el, beat, 1.99).bola, fim.bola);
  assert.deepEqual(estadoCampo(el, beat, .1), antes);
});

test('campo: rejeita jogadores ausentes, posições inválidas, teleporte e sobreposição', () => {
  for (const alterar of [el => { el.passes[1].de = 'c'; }, el => { el.passes[0].para = 'x'; },
    el => { el.passes[1].em = .6; }, el => { el.jogadores[0].pos = [-1, 0]; }]) {
    const el = campo(); alterar(el); assert.ok(validarRecurso(el).length);
  }
  assert.throws(() => prepararSpec(cena({ ...campo(), passes: [{ de: 'a', para: 'b', em: 4.5, dur: 1 }] }), falado, { pasta: os.tmpdir() }), /antes do corte/);
});

test('decomposição conserva objetos e muda suas posições sem depender da ordem dos quadros', () => {
  const el = recurso(), beat = { id: 'b0', de: 0, ate: 5, palavras: [0, 9] };
  assert.deepEqual(validarRecurso(el), []);
  const estado = t => avaliarRecurso(el, beat, t, palavras);
  const desenhar = t => estadoUnidades(el, estado(t), area, t, estado(t).separarEm);
  const inicio = desenhar(.5), meio = desenhar(2), fim = desenhar(4);
  assert.equal(inicio.objetos.length, 8);
  assert.equal(fim.objetos.length, 8);
  assert.deepEqual(fim.objetos.map(o => o.id), inicio.objetos.map(o => o.id));
  assert.notDeepEqual(inicio.objetos.map(o => [o.x, o.y]), meio.objetos.map(o => [o.x, o.y]));
  assert.equal(fim.objetos.filter(o => o.grupo === 0).length, 7);
  assert.ok(fim.objetos.every(o => o.opacidade === 1));
  assert.deepEqual(desenhar(.5), inicio, 'buscar o passado depois do fim reproduz o quadro');
});

test('unidades recusam somas incoerentes, frações, campos inválidos e símbolos desconhecidos', () => {
  for (const alterar of [
    el => { el.total = 9; }, el => { el.itens[0].valor = 7.5; },
    el => { el.itens[0].valor = 25; }, el => { el.simbolo = 'escudo'; },
    el => { el.itens = {}; }, el => { el.itens = [null, null]; },
    el => { delete el.separarEm; }, el => { el.itens[0].entra = 3; },
  ]) {
    const el = recurso(); alterar(el);
    assert.ok(validarRecurso(el).length);
  }
  const limite = { ...recurso(), total: 24, separarEm: 1,
    itens: [{ rotulo: 'A', valor: 12 }, { rotulo: 'B', valor: 12 }, { rotulo: 'Zero', valor: 0 }] };
  assert.deepEqual(validarRecurso(limite), []);
  for (const a of [area, { x0: 229, x1: 1690, y0: 442, y1: 768 }]) {
    const estado = { itens: limite.itens.map(i => ({ ...i, em: 0, progresso: 1 })) };
    const r = estadoUnidades(limite, estado, a, 3, 1);
    assert.equal(r.objetos.length, 24);
    assert.ok(r.objetos.every(o => o.grupo !== 2 && o.raio > 0));
    assert.ok(r.objetos.every(o => o.x - o.raio >= a.x0 && o.x + o.raio <= a.x1 && o.y - o.raio >= a.y0 && o.y + o.raio <= a.y1));
  }
});

test('render: três partes cabem em horizontal com título e handle', { timeout: 30000 }, async () => {
  const el = { ...recurso(), total: 12, itens: [{ rotulo: 'A', valor: 4 }, { rotulo: 'B', valor: 4 }, { rotulo: 'C', valor: 4 }] };
  const c = { ...cena(el), formato: 'horizontal', handle: '@teste' };
  c.beats[0].titulo = { texto: 'Divisão', entra: 0 };
  const motor = await abrir(prepararSpec(c, falado, { pasta: os.tmpdir() }), { escala: .35 });
  try {
    const r = await motor.paginas[0].evaluate(() => window.ilu.medir(3).recursos[0]);
    assert.deepEqual(r.problemas, []);
    assert.equal(r.movimento.length, 12);
    assert.ok(r.movimento.every(o => o.raio > 0 && o.y + o.raio <= r.y1 && o.y - o.raio >= r.y0));
  } finally { await motor.fechar(); }
});

test('a preparação rejeita separação fora da fala e ação que termina depois do corte', () => {
  for (const separarEm of ['inexistente', 4.8, 9]) {
    assert.throws(() => prepararSpec(cena({ ...recurso(), separarEm }), falado, { pasta: os.tmpdir() }),
      /não encontrada|antes do fim|antes do corte/);
  }
});

test('comparação automática de gols usa bolas contáveis e preserva valores grandes como barras', () => {
  for (const [valor, visual] of [[8, 'unidades'], [77, undefined]]) {
    const texto = `O time A marcou ${valor} gols. O time B marcou 7 gols. Veja a diferença.`;
    const ws = texto.split(' ').map((w, i) => ({ w, t: i * .35, f: i * .35 + .3 }));
    const c = autoPlano({ tema: 'Gols' }, { palavras: ws, duracao: ws.length * .35 }, { plano: { estilo: 'editorial' } });
    const r = c.beats.flatMap(b => b.elementos).find(e => e.tipo === 'recurso' && e.forma === 'comparacao');
    assert.ok(r);
    assert.equal(r.visual, visual);
    assert.deepEqual(r.itens.map(i => i.valor), [valor, 7]);
  }
});

test('montagem identifica slides repetidos apesar de títulos, entrada e câmera diferentes', () => {
  const beats = Array.from({ length: 4 }, (_, i) => ({ id: `b${i}`, de: i * 4, ate: (i + 1) * 4,
    titulo: { texto: String(i) }, camera: { mov: 'deriva' },
    elementos: [{ id: 'grafico', tipo: 'imagem', arquivo: 'assets/grafico.svg', entrada: 'cresce' }] }));
  const r = analisarMontagem({ beats }, { beats });
  assert.equal(r.falhas.length, 1);
  assert.equal(r.trechos[0].duracao, 16);
  assert.equal(r.proporcaoImagem, 1);
  beats[2].elementos = [recurso()];
  assert.deepEqual(analisarMontagem({ beats }, { beats }).falhas, []);
});

test('foto de contexto isolada e animação real não são rejeitadas como slides', () => {
  const beats = [{ id: 'foto', de: 0, ate: 4, elementos: [{ tipo: 'imagem', arquivo: 'foto.jpg' }] },
    { id: 'acao', de: 4, ate: 8, elementos: [recurso()] }];
  assert.deepEqual(analisarMontagem({ beats }, { beats }).falhas, []);
});

test('render: unidades e decomposição desenham movimento real nos formatos e estilos suportados', { timeout: 120000 }, async () => {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-unidades-'));
  try {
    for (const estilo of ['editorial', 'smooth-estrategia']) for (const formato of ['vertical', 'horizontal']) {
      for (const el of [recurso(), { ...recurso(), forma: 'comparacao', visual: 'unidades', total: undefined }, campo()]) {
        const c = { ...cena(el), estilo, formato };
        const spec = prepararSpec(c, falado, { pasta });
        const motor = await abrir(spec, { escala: .35 });
        try {
          const medir = t => motor.paginas[0].evaluate(t => window.ilu.medir(t).recursos[0], t);
          const inicial = await medir(.35), final = await medir(3.5);
          assert.deepEqual(final.problemas, []);
          assert.equal(final.movimento.length, el.forma === 'campo-tatico' ? 4 : 8);
          assert.notDeepEqual(inicial.movimento, final.movimento);
          assert.deepEqual(await medir(.35), inicial);
          for (const o of el.forma === 'campo-tatico' ? [] : final.movimento) {
            assert.ok(o.x - o.raio >= final.x0 && o.x + o.raio <= final.x1);
            assert.ok(o.y - o.raio >= final.y0 && o.y + o.raio <= final.y1);
          }
          if (process.env.ILU_EVIDENCIA_MOVIMENTO && estilo === 'editorial' && formato === 'vertical' && el.forma === 'campo-tatico') {
            for (const [i, t] of [.1, .8, 1.4, 2.8].entries()) await foto(motor.paginas[0], t, path.join(process.env.ILU_EVIDENCIA_MOVIMENTO, `campo-${i}.jpg`));
          }
          if (process.env.ILU_EVIDENCIA_MOVIMENTO && estilo === 'editorial' && formato === 'vertical' && el.forma === 'decomposicao') {
            fs.mkdirSync(process.env.ILU_EVIDENCIA_MOVIMENTO, { recursive: true });
            for (const [i, t] of [.5, 1.7, 2.1, 3.5].entries()) await foto(motor.paginas[0], t, path.join(process.env.ILU_EVIDENCIA_MOVIMENTO, `decomposicao-${i}.jpg`));
          }
        } finally { await motor.fechar(); }
      }
    }
  } finally { fs.rmSync(pasta, { recursive: true, force: true }); }
});
