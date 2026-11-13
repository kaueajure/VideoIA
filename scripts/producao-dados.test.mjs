import test from 'node:test';
import assert from 'node:assert/strict';
import { planejarSmooth, combinaSmooth } from '../src/video/autoplano-smooth.mjs';
import { figurasDaFala } from '../src/video/fala-forma/figuras.mjs';
import { montarSmooth, validarSmooth } from '../src/video/engine/estilo-smooth.js';
import { compilar } from '../src/video/plano.mjs';
import { abrir } from '../src/video/render.mjs';
import { enquadrarFotosIsoladas } from '../src/video/engine/enquadramento-base.js';

test('planejamento: crescer e cair não geram séries numéricas inventadas', () => {
  for (const texto of ['O mercado cresceu rapidamente neste período.', 'A receita caiu muito durante a crise.']) {
    const palavras = texto.split(' ').map((w, i) => ({ w, t: i * .4, f: i * .4 + .3 }));
    const beats = [{ id: 'a', palavras: [0, palavras.length - 1], elementos: [] }];
    planejarSmooth(beats, palavras);
    assert.ok(!beats[0].elementos.some(e => ['curva', 'grafico'].includes(e.forma)), JSON.stringify(beats[0]));
  }
});

test('fala: adversário esportivo, proteção e simultaneidade não exigem gráfico comparativo', () => {
  for (const texto of ['Jogou contra a Austrália em setembro.', 'Vacina contra a gripe.', 'Enquanto esperava, ele se recuperava.']) {
    const palavras = texto.split(' ');
    assert.ok(!figurasDaFala(palavras).figuras.some(f => f.fig === 'comparacao'), texto);
    assert.equal(combinaSmooth('calendario', palavras).ok, true, texto);
  }
  for (const texto of ['A versus B.', 'A diferença foi grande.', 'Mais gols que o rival.', 'Trinta contra vinte pontos.']) {
    assert.ok(figurasDaFala(texto.split(' ')).figuras.some(f => f.fig === 'comparacao'), texto);
  }
});

function exemplo(formato = 'vertical') {
  const palavras = 'Zero um cem representam valores diferentes'.split(' ').map((w, i) => ({ w, t: i * .5, f: i * .5 + .4 }));
  return compilar({ estilo: 'smooth-estrategia', formato,
    efeitos: { abertura: false, cauda: false, grao: 0 },
    beats: [{ id: 'barras', palavras: [0, palavras.length - 1], elementos: [
      { tipo: 'smooth', forma: 'barras', itens: [
        { rotulo: 'Zero', valor: 0 }, { rotulo: 'Pequeno', valor: 1 }, { rotulo: 'Grande', valor: 100 },
      ] },
    ] }],
  }, { palavras, duracao: 4 });
}

test('smooth: valores negativos e séries ausentes são recusados', () => {
  assert.ok(validarSmooth({ forma: 'barras', itens: [{ valor: -1 }, { valor: 10 }] }).length);
  for (const forma of ['curva', 'grafico']) {
    assert.ok(validarSmooth({ forma }).length, forma);
    assert.ok(validarSmooth({ forma, valores: [1, NaN] }).length, forma);
    assert.deepEqual(validarSmooth({ forma, valores: [0, 10, 100] }), []);
  }
});

test('smooth: colunas preservam zero e a razão de dados acima de cem', () => {
  const spec = exemplo();
  spec.beats[0].elementos = [{ tipo: 'smooth', forma: 'grafico', valores: [0, 200, 1000] }];
  const html = montarSmooth(spec).cenas[0].k.html.join('');
  const alturas = [...html.matchAll(/class="(?:pk)?" style="height:([\d.]+)%"/g)].map(m => Number(m[1]));
  assert.deepEqual(alturas, [0, 20, 100]);
});

test('prévia: enquadramento já revisado não recebe nova ampliação automática', () => {
  const spec = { enquadramentoRevisado: true, estilo: 'editorial', beats: [{ elementos: [{ tipo: 'imagem', largura: 400 }] }] };
  enquadrarFotosIsoladas(spec);
  assert.equal(spec.beats[0].elementos[0].largura, 400);
});

test('enquadramento: contador com posição autoral não é movido pelo painel automático', { timeout: 60000 }, async () => {
  const palavras = [{ w: 'Duzentos', t: 0, f: 3 }];
  const spec = compilar({ estilo: 'minimalista', beats: [{ id: 'numero', palavras: [0, 0], elementos: [
    { tipo: 'contador', valor: 200, entra: 0, pos: [.5, .05] },
  ] }] }, { palavras, duracao: 4 });
  const motor = await abrir(spec, { escala: .35 });
  try {
    assert.equal(await motor.paginas[0].evaluate(() => document.querySelectorAll('.ilu-numero-protagonista').length), 0);
  } finally { await motor.fechar(); }
});

test('smooth: barras mantêm zero, proporção e rótulos independentes no motor carregado', { timeout: 120000 }, async () => {
  for (const formato of ['vertical', 'horizontal']) {
    const spec = exemplo(formato);
    const montagem = montarSmooth(spec);
    assert.match(montagem.cenas[0].k.html.join(''), /data-sm-bar-fill/);
    const motor = await abrir(spec, { escala: .35 });
    try {
      const medir = async tempo => motor.paginas[0].evaluate(t => {
        window.ilu.quadro(t);
        return [...document.querySelectorAll('[data-sm-bar-fill]')].map(el => ({
          largura: parseFloat(el.style.width),
          trilho: parseFloat(el.parentElement.style.width),
        }));
      }, tempo);
      const barras = await medir(3.3);
      assert.equal(barras.length, 3);
      assert.equal(barras[0].largura, 0);
      assert.ok(Math.abs(barras[1].largura / barras[2].largura - .01) < 1e-6);
      assert.equal(barras[2].largura, barras[2].trilho);
      await medir(.2);
      assert.deepEqual(await medir(3.3), barras);
      const textos = await motor.paginas[0].evaluate(() => [...document.querySelectorAll('[data-sm-bar-row]')].map(el => el.textContent));
      assert.ok(textos.every(Boolean));
    } finally { await motor.fechar(); }
  }
});
