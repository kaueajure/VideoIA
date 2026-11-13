import test from 'node:test';
import assert from 'node:assert/strict';
import { avaliarRecurso, validarRecurso } from '../src/video/engine/recursos-visuais.js';
import { estadoUnidades } from '../src/video/engine/unidades-visuais.js';
import { analisarRitmoVisual, registrarRitmoVisual } from '../src/video/ritmo-visual.mjs';
import { publicavelEntrega } from '../src/video/qa-gravidade.mjs';
import { planejarExplicacoes } from '../src/video/planejar-explicacoes.mjs';
import { prepararSpec } from '../src/video/preparar-spec.mjs';
import os from 'node:os';
import { abrir } from '../src/video/render.mjs';

const beat = { id: 'explicacao', de: 0, ate: 9 };
const area = { x0: 96, x1: 984, y0: 400, y1: 1160 };
const comparacao = () => ({ tipo: 'recurso', forma: 'comparacao', entra: 0, dur: 3,
  itens: [{ rotulo: 'Antes', valor: 4, entra: 0 }, { rotulo: 'Depois', valor: 8, entra: 4 }] });

test('duração dirigida não é reduzida a 0,7 s em barras, cronologias e consequências', () => {
  for (const forma of ['comparacao', 'linha-do-tempo', 'causa-efeito']) {
    const el = { ...comparacao(), forma };
    const meio = avaliarRecurso(el, beat, 1.5);
    assert.equal(meio.itens[0].progresso, .5, forma);
    assert.equal(meio.itens[1].progresso, 0);
    assert.equal(avaliarRecurso(el, beat, 3).itens[0].progresso, 1);
  }
});

test('cada etapa pode ocupar seu intervalo de fala sem modificar dados finais', () => {
  const el = comparacao(); el.itens[1].dur = 2;
  assert.equal(avaliarRecurso(el, beat, 5).itens[1].progresso, .5);
  const fim = avaliarRecurso(el, beat, 7);
  assert.deepEqual(fim.itens.map(i => i.valor), [4, 8]);
  assert.deepEqual(fim.itens.map(i => i.fracao), [.5, 1]);
});

test('objetos contáveis distribuem a revelação pelo tempo dirigido e conservam a quantidade', () => {
  const el = { ...comparacao(), visual: 'unidades', simbolo: 'caixa' };
  const estado = t => estadoUnidades(el, avaliarRecurso(el, beat, t), area, t);
  const antes = estado(.2), meio = estado(1.5), fim = estado(8);
  assert.ok(meio.objetos.some(o => o.grupo === 0 && o.opacidade < 1));
  assert.notDeepEqual(antes.objetos, meio.objetos);
  assert.equal(fim.objetos.length, 12);
  assert.ok(fim.objetos.every(o => o.opacidade === 1));
  assert.deepEqual(estado(.2), antes, 'busca fora de ordem é determinística');
});

test('duração por item é validada, inclusive NaN, zero, texto e infinito', () => {
  for (const dur of [0, -1, NaN, Infinity, '3', 31]) {
    const el = comparacao(); el.itens[0].dur = dur;
    assert.ok(validarRecurso(el).some(e => /dur/.test(e)), String(dur));
  }
});

test('duração herdada não permite cortar uma barra antes de atingir a proporção final', () => {
  const el = { ...comparacao(), dur: 5, itens: [{ rotulo: 'A', valor: 10, entra: 0 }, { rotulo: 'B', valor: 20, entra: 2 }] };
  const c = { tempo: 'fixo', duracao: 5, beats: [{ id: 'b', em: [0, 5], elementos: [el] }] };
  assert.throws(() => prepararSpec(c, { duracao: 5, palavras: [] }, { pasta: os.tmpdir() }), /duração do item.*antes do corte/);
});

test('ritmo encontra a espera depois de uma entrada rápida, mesmo com câmera e legenda', () => {
  const b = { ...beat, elementos: [{ ...comparacao(), dur: .4,
    itens: comparacao().itens.map(i => ({ ...i, entra: 0 })) }], camera: { mov: 'avanca' } };
  const r = analisarRitmoVisual({ beats: [b] }, { beats: [b], palavras: [] });
  assert.ok(r.alertas.some(a => a.severidade === 'alta' && a.duracao >= 8));
  assert.equal(publicavelEntrega({ voz: 'elevenlabs', factual: { aprovado: true, escopo: 'video' }, avisos: r.alertas }), false);
});

test('cena automática sem contrato v2 também leva o risco de repouso até a publicação', () => {
  const b = { ...beat, elementos: [{ tipo: 'imagem', arquivo: 'registro.jpg', t0: 0 }] };
  const c = { automatica: true, beats: [b] }, r = { avisos: [{ tipo: 'outro', msg: 'Preservado' }] };
  registrarRitmoVisual(c, { beats: [b] }, r);
  registrarRitmoVisual(c, { beats: [b] }, r);
  assert.equal(r.avisos.filter(a => a.tipo === 'ritmo-sem-progressao').length, 1);
  assert.equal(r.avisos[0].tipo, 'outro');
  assert.equal(publicavelEntrega({ voz: 'elevenlabs', factual: { aprovado: true, escopo: 'video' }, avisos: r.avisos }), false);
});

test('ações distribuídas deixam respiro; vídeo e peça desconhecidos não recebem aprovação falsa', () => {
  const b = { ...beat, elementos: [comparacao()] };
  const r = analisarRitmoVisual({ beats: [b] }, { beats: [b], palavras: [] });
  assert.equal(r.alertas.filter(a => a.severidade === 'alta').length, 0);
  const desconhecido = { ...beat, elementos: [{ id: 'peca-local', tipo: 'peca', forma: 'objeto-autoral' }] };
  const d = analisarRitmoVisual({ beats: [desconhecido] }, { beats: [desconhecido], palavras: [] });
  assert.deepEqual(d.cenas[0].naoAvaliados, ['peca-local']);
  assert.equal(d.cenas[0].repousos.length, 0);
  const contador = { ...beat, elementos: [{ id: 'numero', tipo: 'contador', valor: 100, dur: 7 }] };
  assert.deepEqual(analisarRitmoVisual({ beats: [contador] }, { beats: [contador] }).cenas[0].naoAvaliados, ['numero']);
});

test('foto longa é identificada e leitura de documento pede revisão sem forçar movimento decorativo', () => {
  const foto = { ...beat, elementos: [{ id: 'foto', tipo: 'imagem', arquivo: 'arquivo.jpg', t0: 0 }] };
  const doc = { ...beat, elementos: [{ id: 'doc', tipo: 'recurso', forma: 'documento', fonte: 'Exemplo',
    linhas: ['Um trecho documental para ler.'], marcar: [0], dur: .8 }] };
  assert.ok(analisarRitmoVisual({ beats: [foto] }, { beats: [foto] }).alertas.some(a => a.severidade === 'alta'));
  const r = analisarRitmoVisual({ beats: [doc] }, { beats: [doc] });
  assert.ok(r.alertas.length);
  assert.ok(r.alertas.every(a => a.severidade === 'normal' && /leitura/.test(a.msg)));
});

test('planejamento usa duração da fala em assuntos distintos sem alterar valores nem criar novos dados', () => {
  for (const fala of [
    'O pacote A pesa dez quilos. O pacote B pesa vinte quilos.',
    'O serviço A custa vinte reais. O serviço B custa quarenta reais.',
    'Em 2020, a obra começou. Em 2022, a obra terminou.',
    'A água recebe calor. Por isso a água se expande.',
  ]) {
    const palavras = fala.split(' ').map((w, i) => ({ w, t: i * .5, f: i * .5 + .45 }));
    const c = { estilo: 'editorial', automatica: true,
      beats: [{ id: 'a', palavras: [0, palavras.length - 1], elementos: [] }] };
    assert.equal(planejarExplicacoes(c, palavras).length, 1, fala);
    const itens = c.beats[0].elementos[0].itens;
    assert.ok(itens.every(i => i.dur > .7), fala);
    assert.ok(itens.every(i => i.entra + i.dur < palavras.at(-1).f));
  }
});

test('render e QA respeitam a duração dirigida em editorial/smooth, vertical/horizontal', { timeout: 60000 }, async () => {
  const palavras = Array.from({ length: 9 }, (_, i) => ({ w: 'Exemplo', t: i, f: i + .8 }));
  for (const estilo of ['editorial', 'smooth-estrategia']) for (const formato of ['vertical', 'horizontal']) {
    const c = { estilo, formato, tempo: 'fixo', duracao: 9,
      efeitos: { abertura: false, cauda: false, grao: 0 },
      beats: [{ id: 'a', em: [0, 9], palavras: [0, 8], elementos: [comparacao()] }] };
    const motor = await abrir(prepararSpec(c, { palavras, duracao: 9 }, { pasta: os.tmpdir() }), { escala: .25 });
    try {
      const medir = t => motor.paginas[0].evaluate(t => window.ilu.medir(t).recursos[0], t);
      const meio = await medir(1.5), fim = await medir(7.2);
      assert.deepEqual(meio.problemas, []);
      assert.equal(meio.itens[0].progresso, .5);
      assert.equal(meio.itens[0].fracao, .25);
      assert.deepEqual(fim.itens.map(i => i.fracao), [.5, 1]);
      assert.deepEqual(await medir(1.5), meio, 'mesmo instante depois do fim reproduz o estado');
    } finally { await motor.fechar(); }
  }
});
