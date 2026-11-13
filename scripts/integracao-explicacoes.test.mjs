import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { autoPlano } from '../src/video/autoplano.mjs';
import { aplicarDirecaoVisual } from '../src/video/direcao-visual.mjs';
import { prepararSpec } from '../src/video/preparar-spec.mjs';
import { abrir } from '../src/video/render.mjs';
import { verificarSmooth } from '../src/video/verificadores/estilo-smooth-verificar.mjs';
import { planejarExplicacoes } from '../src/video/planejar-explicacoes.mjs';
import { auditarFalaForma } from '../src/video/fala-forma.mjs';
import { conferirCena } from '../src/video/video.mjs';

function fala(texto) {
  const palavras = texto.split(/\s+/).map((w, i) => ({ w, t: i * .35, f: i * .35 + .3 }));
  return { palavras, duracao: palavras.length * .35 + .6 };
}
const recursos = cena => cena.beats.flatMap(b => b.elementos || []).filter(e => e.tipo === 'recurso');

test('produção automática: comparação explícita usa recurso executável nos estilos base e smooth', () => {
  for (const estilo of ['padrao', 'editorial', 'minimalista', 'papel', 'smooth-estrategia']) {
    const f = fala('O time A marcou dez gols. O time B marcou vinte gols. Veja a diferença entre os times.');
    const c = autoPlano({ tema: 'GOLS' }, f, { plano: { estilo } });
    const r = recursos(c).find(e => e.forma === 'comparacao');
    assert.ok(r, estilo);
    assert.deepEqual(r.itens.map(i => i.valor), [10, 20]);
    assert.deepEqual(r.itens.map(i => i.rotulo), ['O time A', 'O time B']);
    assert.equal(r.unidade, ' gols');
    assert.equal(r.essencial, true, 'QA não pode apagar a explicação para fazer a cena caber');
    assert.equal(c.estilo, estilo);
  }
});

test('planejamento: cronologia e relação causal explícitas deixam de ser decoração', () => {
  for (const [texto, forma] of [
    ['Em 2020, a obra começou. Em 2022, a obra terminou. Agora veja o resultado.', 'linha-do-tempo'],
    ['A água recebe calor. Por isso a água se expande. Observe a mudança.', 'causa-efeito'],
  ]) {
    for (const beatSeg of [undefined, [1, 3]]) {
      const c = autoPlano({ tema: 'EXPLICAÇÃO' }, fala(texto), { plano: { estilo: 'editorial', beatSeg } });
      assert.ok(recursos(c).some(e => e.forma === forma), texto);
    }
  }
});

test('planejamento: unidades incompatíveis, intervalos e ausência de dados não viram comparação', () => {
  for (const texto of [
    'O time A marcou dez gols. O time B recebeu vinte reais.',
    'O mercado cresceu muito. Depois o preço caiu rapidamente.',
    'O time A marcou entre dez e vinte gols. O time B marcou vinte gols.',
    'O time A marcou cerca de dez gols. O time B marcou vinte gols.',
    'O time A marcou dez gols? O time B marcou vinte gols.',
    'O time A marcou dez gols. O time B marcou vinte gols?',
    'O time A marcou 99999999999999 gols. O time B marcou vinte gols.',
  ]) {
    const c = autoPlano({ tema: 'CONTEXTO' }, fala(texto), { plano: { estilo: 'editorial', beatSeg: [1, 3] } });
    assert.ok(!recursos(c).some(e => e.forma === 'comparacao'), texto);
  }
});

test('planejamento: uma pergunta sobre data não vira acontecimento confirmado', () => {
  for (const beatSeg of [undefined, [1, 3]]) {
    const c = autoPlano({ tema: 'OBRA' }, fala('Em 2020, a obra começou? Em 2022, a obra terminou.'),
      { plano: { estilo: 'editorial', beatSeg } });
    assert.ok(!recursos(c).some(e => e.forma === 'linha-do-tempo'));
  }
});

test('planejamento: autoria, foto selecionada, elemento essencial e estilo não suportado são preservados', () => {
  const f = fala('O time A marcou dez gols. O time B marcou vinte gols.');
  const base = { estilo: 'editorial', beats: [
    { id: 'a', palavras: [0, 5], elementos: [] }, { id: 'b', palavras: [6, 11], elementos: [] },
  ] };
  for (const alterar of [
    c => { c.beats[1].sujeito = { conceito: 'Autoria' }; },
    c => { c.beats[1].direcao = { ganhoVisual: 'Autoria' }; },
    c => { c.beats[1].elementos = [{ tipo: 'imagem', arquivo: 'assets/foto.jpg' }]; },
    c => { c.beats[1].elementos = [{ tipo: 'peca', forma: 'bola', essencial: true }]; },
    c => { c.estilo = 'pontilhismo'; },
  ]) {
    const cena = structuredClone(base); alterar(cena);
    const antes = structuredClone(cena);
    assert.deepEqual(planejarExplicacoes(cena, f.palavras), []);
    assert.deepEqual(cena, antes);
  }
});

test('produção automática: números por extenso com pessoas reais viram comparação sem modelo genérico', () => {
  for (const estilo of ['editorial', 'smooth-estrategia']) {
    const f = fala('Neymar marcou setenta e sete gols. Ronaldinho marcou trinta e três gols. Compare os números.');
    const c = autoPlano({ tema: 'GOLS' }, f, { plano: { estilo } });
    const r = recursos(c).find(e => e.forma === 'comparacao');
    assert.ok(r, estilo);
    assert.deepEqual(r.itens.map(i => [i.rotulo, i.valor]), [['Neymar', 77], ['Ronaldinho', 33]]);
    assert.equal(c.beats.find(b => b.elementos?.includes(r)).modelo, undefined);
  }
});

test('curadoria: foto selecionada substitui sugestão automática sem formar composição inválida', () => {
  for (const estilo of ['editorial', 'smooth-estrategia']) {
    const f = fala('O time A marcou dez gols. O time B marcou vinte gols.');
    const c = autoPlano({ tema: 'GOLS' }, f, { plano: { estilo } });
    const beat = c.beats.find(b => b.elementos?.some(e => e.tipo === 'recurso'));
    assert.ok(beat);
    const r = aplicarDirecaoVisual(c, { avisos: [], planos: [{
      plano: { trecho: 'O time B marcou vinte gols', imagem: { arquivo: 'assets/time.jpg' } },
      foto: { arquivo: 'assets/time.jpg', entidade: 'Time B', classe: 'contexto' },
    }] }, f.palavras);
    assert.deepEqual(r.avisos, []);
    assert.equal(beat.elementos.length, 1);
    assert.equal(beat.elementos[0].tipo, 'imagem');
    assert.equal(c.explicacoes.escolhas.some(e => e.beat === beat.id), false);
  }
});

test('auditoria: recurso composto exige revisão sem receber aprovação lexical fictícia', () => {
  const cena = { estilo: 'smooth-estrategia', beats: [{ id: 'a', palavras: [0, 1], elementos: [
    { tipo: 'recurso', forma: 'causa-efeito' },
  ] }] };
  const r = auditarFalaForma(cena, fala('Observe isto.').palavras);
  assert.deepEqual(r.falhas, []);
  assert.equal(r.beats[0].naoAvaliado, true);
  assert.equal(r.beats[0].representa, false);
});

test('direção visual: recurso explícito chega ao beat sem alterar outro trecho', () => {
  const f = fala('A água recebe calor. A água se expande.');
  const c = { estilo: 'smooth-estrategia', beats: [
    { id: 'a', palavras: [0, 3], elementos: [{ tipo: 'smooth', forma: 'icone' }] },
    { id: 'b', palavras: [4, 7], elementos: [{ tipo: 'smooth', forma: 'icone' }] },
  ] };
  const anterior = structuredClone(c.beats[0]);
  const r = aplicarDirecaoVisual(c, { avisos: [], planos: [{ plano: {
    trecho: 'A água se expande', recurso: { forma: 'causa-efeito', itens: [
      { rotulo: 'Recebe calor', entra: 0 }, { rotulo: 'Expansão', entra: 'expande' },
    ] },
  } }] }, f.palavras);
  assert.deepEqual(r.avisos, []);
  assert.deepEqual(c.beats[0], anterior);
  assert.equal(c.beats[1].elementos[0].tipo, 'recurso');
  assert.equal(c.beats[1].elementos[0].id, 'b-explicacao');
  assert.equal(r.recursos[0].revisao, 'pendente');
});

test('direção visual: plano de recurso inválido ou conflito com foto é reportado sem trocar conteúdo', () => {
  for (const extra of [{ recurso: { forma: 'comparacao', itens: [] } },
    { imagem: { arquivo: 'assets/x.jpg' }, recurso: { forma: 'mecanismo', mecanismo: 'fases-lua' } }]) {
    const c = { estilo: 'editorial', beats: [{ id: 'a', palavras: [0, 1], elementos: [] }] };
    const antes = structuredClone(c);
    const r = aplicarDirecaoVisual(c, { avisos: [], planos: [{ plano: { trecho: 'A água', ...extra } }] }, fala('A água').palavras);
    assert.ok(r.avisos.length);
    assert.deepEqual(c, antes);
  }
});

test('render: explicação smooth aparece, preserva voz visual e mede o desenho nos dois formatos', { timeout: 120000 }, async () => {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-integracao-'));
  try {
    for (const estilo of ['smooth', 'smooth-estrategia', 'smooth-historia', 'smooth-produto', 'smooth-vinheta', 'smooth-tipografia']) for (const formato of ['vertical', 'horizontal']) {
      const f = fala('Primeiro são dez gols. Depois são vinte gols.');
      const cena = { estilo, formato, efeitos: { abertura: false, cauda: false, grao: 0 }, beats: [
        { id: 'explica', palavras: [0, f.palavras.length - 1], elementos: [
          { id: 'gols', tipo: 'recurso', forma: 'comparacao', entra: 0, dur: .4, unidade: ' gols', itens: [
            { rotulo: 'Time A', valor: 10, entra: 0 }, { rotulo: 'Time B', valor: 20, entra: 'vinte' },
          ] },
        ] },
      ] };
      const spec = prepararSpec(cena, f, { pasta });
      assert.deepEqual(verificarSmooth(spec).falhas, []);
      const motor = await abrir(spec, { escala: .35 });
      try {
        const medida = await motor.paginas[0].evaluate(t => window.ilu.medir(t), f.duracao - .7);
        assert.equal(medida.recursos[0].forma, 'comparacao');
        assert.equal(medida.recursos[0].itens.length, 2);
        assert.equal(medida.recursos[0].itens[0].fracao, .5);
        assert.equal(medida.recursos[0].itens[1].fracao, 1);
        assert.deepEqual(medida.recursos[0].problemas, []);
        assert.ok(medida.legenda || medida.textos?.length, 'fala continua visível');
        assert.ok(medida.legenda.y0 > medida.recursos[0].y1 + 16, 'recurso não cobre a fala projetada');
        const canvas = await motor.paginas[0].evaluate(() => {
          const el = document.getElementById('recursos-visuais');
          return { z: getComputedStyle(el).zIndex, pixels: [...el.getContext('2d').getImageData(0, 0, el.width, el.height).data].some((v, i) => i % 4 === 3 && v > 0) };
        });
        assert.ok(canvas.pixels);
        assert.ok(Number(canvas.z) > 49);
      } finally { await motor.fechar(); }
    }
  } finally { fs.rmSync(pasta, { recursive: true, force: true }); }
});

test('produção: os seis recursos atravessam QA rígido no smooth sem alterar a autoria', { timeout: 180000 }, async () => {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-qa-explicacoes-'));
  fs.mkdirSync(path.join(pasta, 'assets'));
  fs.mkdirSync(path.join(pasta, 'saida'));
  fs.writeFileSync(path.join(pasta, 'assets/objeto.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><circle cx="200" cy="200" r="150" fill="#fff"/></svg>');
  const modelos = [
    { forma: 'comparacao', itens: [{ rotulo: 'A', valor: 10 }, { rotulo: 'B', valor: 20 }] },
    { forma: 'linha-do-tempo', itens: [{ data: '2020', rotulo: 'Início' }, { data: '2022', rotulo: 'Fim' }] },
    { forma: 'causa-efeito', itens: [{ rotulo: 'Recebe calor' }, { rotulo: 'Expansão' }] },
    { forma: 'documento', fonte: 'Fixture de teste', linhas: ['Uma explicação por cena.'], marcar: [0] },
    { forma: 'seguir-objeto', arquivo: 'assets/objeto.svg', trajeto: [[-1, 0], [1, 0]], dur: 2 },
    { forma: 'mecanismo', mecanismo: 'fases-lua' },
  ];
  const palavras = modelos.flatMap((_, i) => ['Veja', 'a', 'explicação', 'aqui.'].map((w, j) => ({ w, t: i * 3 + j * .6, f: i * 3 + j * .6 + .5 })));
  const falado = { palavras, duracao: 18 };
  const cena = { estilo: 'smooth-estrategia', efeitos: { abertura: false, cauda: false, grao: 0 },
    beats: modelos.map((el, i) => ({ id: `e${i}`, palavras: [i * 4, i * 4 + 3],
      elementos: [{ ...el, id: `recurso${i}`, tipo: 'recurso', entra: 0 }] })),
  };
  try {
    for (const formato of ['vertical', 'horizontal']) {
    cena.formato = formato;
    const original = JSON.stringify(cena);
    fs.writeFileSync(path.join(pasta, 'cena.json'), original);
    const relatorio = { falhas: [], avisos: [] };
    const r = await conferirCena({ pasta, cena, falado, plano: {}, config: { qa: 'rigido' },
      relatorio, locais: {}, saida: path.join(pasta, 'saida') });
    assert.deepEqual(r.qa.falhas, []);
    assert.equal(r.modo, 'rigido');
    assert.equal(relatorio.relevancia.naoAvaliados, 6);
    assert.equal(JSON.stringify(cena), original);
    assert.equal(fs.readFileSync(path.join(pasta, 'cena.json'), 'utf8'), original);
    }
  } finally { fs.rmSync(pasta, { recursive: true, force: true }); }
});
