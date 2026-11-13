import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { analisarFontesProjeto } from '../src/video/fontes-factuais.mjs';
import { estadoPublicacao } from '../src/video/estado-publicacao.mjs';
import { statusProjeto } from '../src/video/status.mjs';
import { listarVideos } from '../src/estudio/servidor.mjs';
import { planoCamera, cameraEm, checarCamera } from '../src/video/engine/camera.js';
import { montarSmooth } from '../src/video/engine/estilo-smooth.js';
import { medirCamera } from '../src/video/verificadores/estilo-smooth-verificar.mjs';
import { compilar } from '../src/video/plano.mjs';
import { abrir } from '../src/video/render.mjs';
import { enquadrarFotosIsoladas } from '../src/video/engine/enquadramento-base.js';

// Fixture autocontida: esta regressão também roda sem a pasta local test/.
function projetoFactual(pasta) {
  fs.mkdirSync(pasta, { recursive: true });
  const roteiro = 'Observe a Lua.';
  const arquivos = {
    'roteiro.md': roteiro,
    'fontes.md': '# Pesquisa sintética para teste de software',
    'palavras.json': { duracao: 2, palavras: roteiro.split(' ').map((w, i) => ({ w, t: i * .4, f: i * .4 + .3 })) },
    'cena.json': { tema: 'LUA', beats: [{ id: 'lua', palavras: [0, 2], elementos: [] }] },
    'fontes.json': { versao: 1, fontes: [], afirmacoes: [], trechos: [{ id: 'convite', texto: roteiro, tipo: 'editorial', justificativa: 'Convite à observação.' }] },
  };
  for (const [nome, dados] of Object.entries(arquivos)) fs.writeFileSync(path.join(pasta, nome), typeof dados === 'string' ? dados : JSON.stringify(dados));
  const factual = analisarFontesProjeto(pasta, { exigirVideo: true });
  assert.equal(factual.aprovado, true);
  return { factual };
}

test('publicação: lista e decisão compartilhada recusam aprovação técnica com pendência visual', t => {
  const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-publicacao-'));
  t.after(() => fs.rmSync(raiz, { recursive: true, force: true }));
  const pasta = path.join(raiz, 'projetos', 'lua'), { factual } = projetoFactual(pasta);
  fs.writeFileSync(path.join(pasta, 'fontes.md'), '# Fontes\nFonte sintética de teste.\n');
  const saida = path.join(pasta, 'saida'); fs.mkdirSync(saida);
  fs.writeFileSync(path.join(saida, 'lua.mp4'), 'video-fixture');
  const entrega = { voz: 'elevenlabs', gerado: new Date(Date.now() + 1000).toISOString(), aprovado: true, publicavel: true, factual, avisosAltos: [] };
  const salvar = () => fs.writeFileSync(path.join(saida, 'entrega.json'), JSON.stringify(entrega));
  salvar(); assert.equal(listarVideos(raiz)[0].publicavel, true);
  fs.writeFileSync(path.join(saida, 'previa.mp4'), 'previa');
  const futuro = new Date(Date.now() + 5000); fs.utimesSync(path.join(saida, 'previa.mp4'), futuro, futuro);
  assert.equal(statusProjeto('lua', { raiz }).video, 'lua.mp4');
  assert.equal(statusProjeto('lua', { raiz }).publicavel, listarVideos(raiz)[0].publicavel);
  fs.writeFileSync(path.join(pasta, 'fontes.md'), '- PENDENTE: conferir imagem.');
  assert.equal(listarVideos(raiz)[0].publicavel, false);
  assert.equal(statusProjeto('lua', { raiz }).publicavel, false);
  fs.writeFileSync(path.join(pasta, 'fontes.md'), '# Fontes conferidas');
  entrega.publicavel = false; entrega.avisosAltos.push({ tipo: 'composicao', msg: 'Amplie o protagonista.' }); salvar();
  const video = listarVideos(raiz)[0];
  assert.equal(video.aprovado, true); assert.equal(video.publicavel, false);
  assert.equal(video.rotuloPublicacao, 'Com pendências');
  assert.equal(video.proximo, 'Amplie o protagonista.');
  assert.equal(estadoPublicacao(pasta, entrega, { video: 'lua.mp4' }).publicavel, video.publicavel);
  entrega.publicavel = true; entrega.avisosAltos = []; salvar();
  fs.unlinkSync(path.join(pasta, 'fontes.json'));
  assert.equal(listarVideos(raiz)[0].publicavel, false, 'fontes removidas invalidam aprovação anterior');
});

test('publicação: prévia, voz mock, roteiro alterado e entrega antiga não recebem sucesso', t => {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-estado-'));
  t.after(() => fs.rmSync(pasta, { recursive: true, force: true }));
  const { factual } = projetoFactual(pasta);
  const base = { voz: 'elevenlabs', gerado: new Date(Date.now() + 1000).toISOString(), aprovado: true, publicavel: true, factual };
  for (const [entrega, video] of [[base, 'previa.mp4'], [{ ...base, voz: 'mock' }, 'lua.mp4'], [{ ...base, gerado: '2000-01-01' }, 'lua.mp4'], [{ ...base, gerado: undefined }, 'lua.mp4'], [{ ...base, publicavel: false }, 'lua.mp4']]) {
    assert.equal(estadoPublicacao(pasta, entrega, { video }).publicavel, false);
  }
});

test('publicação na interface: aprovado sozinho nunca exibe selo de sucesso', () => {
  const html = fs.readFileSync(new URL('../src/estudio/pagina.html', import.meta.url), 'utf8');
  const inicio = html.indexOf('function seloPublicacao('), fim = html.indexOf('async function carregarVideos(', inicio);
  const ctx = vm.createContext({ I: () => '' }); vm.runInContext(html.slice(inicio, fim), ctx);
  assert.match(ctx.seloPublicacao({ aprovado: true, publicavel: false }), /Com pendências/);
  assert.doesNotMatch(ctx.seloPublicacao({ aprovado: true }), /etq ok|Pronto para publicar/);
  assert.match(ctx.seloPublicacao({ publicavel: true }), /Pronto para publicar/);
  assert.match(ctx.seloPublicacao({ teste: true }), /sem voz/);
});

function exemplo(estilo, forma = 'icone') {
  const palavras = Array.from({ length: 36 }, (_, i) => ({ w: i % 5 ? 'claro' : 'Luz', t: i * .3, f: i * .3 + .25 }));
  const cena = { tema: 'LUZ', estilo, efeitos: { abertura: false, cauda: false, grao: 0 }, beats: [0, 1, 2].map(i => ({
    id: `b${i}`, palavras: [i * 12, i * 12 + 11], titulo: { texto: '*Luz* em movimento' },
    elementos: estilo.startsWith('smooth') ? [{ tipo: 'smooth', forma, icone: 'coracao', chave: 'movimento', itens: [{ titulo: 'Aviso', texto: 'Observe o movimento', em: 'movimento' }], titulo: 'SEMANA' }]
      : [{ tipo: 'peca', forma: 'esfera' }],
  })) };
  return compilar(cena, { palavras, duracao: 11 });
}

test('câmera: velocidade final limitada em todos os estilos base, determinística ao buscar no tempo', () => {
  for (const estilo of ['padrao', 'editorial', 'minimalista', 'papel', 'pontilhismo', 'cartoes']) {
    const spec = exemplo(estilo), plano = planoCamera(spec);
    assert.deepEqual(checarCamera(plano, spec).filter(a => a.tipo === 'camera-rapida'), [], estilo);
    const a = cameraEm(plano, 4.3); cameraEm(plano, 9); cameraEm(plano, .1);
    assert.deepEqual(cameraEm(plano, 4.3), a);
  }
});

test('smooth: composições verticais ganham altura e câmera respeita o teto', () => {
  for (const forma of ['icone', 'notificacao', 'calendario', 'lista', 'botao', 'titulo', 'comparacao', 'chat', 'cta']) {
    const montado = montarSmooth(exemplo('smooth-estrategia', forma));
    for (const { k } of montado.cenas) {
      const caixas = k.qa.filter(q => q.tipo === 'peca' && q.caixa).map(q => q.caixa);
      assert.ok(Math.max(...caixas.map(c => c[3])) - Math.min(...caixas.map(c => c[1])) >= 500, forma);
      assert.ok(medirCamera(k).vMax <= 450, forma);
      assert.ok(k.frente.length, 'a fala não reduz o enquadramento do protagonista');
    }
  }
});

test('enquadramento: foto isolada cresce sem distorcer nem mudar grupos ou formato horizontal', () => {
  const spec = { estilo: 'editorial', beats: [{ elementos: [{ tipo: 'imagem', largura: 520, altura: 470 }] }] };
  enquadrarFotosIsoladas(spec);
  const foto = spec.beats[0].elementos[0];
  assert.ok(foto.altura >= 600 && foto.largura <= 800);
  assert.ok(Math.abs(foto.largura / foto.altura - 520 / 470) < .002);
  const horizontal = { ...structuredClone(spec), formato: 'horizontal' }, antes = structuredClone(horizontal);
  enquadrarFotosIsoladas(horizontal); assert.deepEqual(horizontal, antes);
  const grupo = { estilo: 'editorial', beats: [{ elementos: [{ tipo: 'imagem', largura: 300 }, { tipo: 'peca', forma: 'esfera' }] }] };
  enquadrarFotosIsoladas(grupo); assert.equal(grupo.beats[0].elementos[0].largura, 300);
});

test('render: contador isolado tem painel real, preserva o valor e fica acima da legenda', async () => {
  const palavras = 'Em dois mil e dois o Brasil venceu.'.split(' ').map((w, i) => ({ w, t: i * .4, f: i * .4 + .3 }));
  const spec = compilar({ tema: 'ANO', estilo: 'editorial', beats: [{ id: 'ano', palavras: [0, palavras.length - 1], elementos: [{ tipo: 'contador', valor: 2002, formato: 'ano', entra: 0 }] }] }, { palavras, duracao: 4 });
  const motor = await abrir(spec, { escala: .35, workers: 1 });
  try {
    const dados = await motor.paginas[0].evaluate(() => {
      const m = window.ilu.medir(3);
      return { ...m, valor: document.querySelector('.ilu-numero-protagonista b')?.textContent };
    });
    const painel = dados.pecas.find(p => p.forma === 'painel-contador');
    assert.ok(painel && painel.y1 - painel.y0 >= 560);
    assert.ok(painel.x0 >= 72 && painel.x1 <= 1008 && painel.y1 <= 1300);
    assert.equal(dados.valor, '2002');
    assert.ok(!dados.legenda || painel.y1 < dados.legenda.y0);
  } finally { await motor.fechar(); }
});

test('render: o motor do navegador usa a composição atual, sem cortar o ícone nem a fala', async () => {
  const spec = exemplo('smooth-estrategia');
  const motor = await abrir(spec, { escala: .35, workers: 1 });
  try {
    const m = await motor.paginas[0].evaluate(() => window.ilu.medir(2.4));
    const icone = m.pecas.find(p => p.forma === 'smooth:icone');
    assert.ok(icone, 'ícone medido no render real');
    assert.ok(icone.y1 - icone.y0 >= 420, JSON.stringify(icone));
    assert.ok(icone.x0 >= 72 && icone.x1 <= 1008 && icone.y0 >= 250 && icone.y1 <= 1300);
    assert.ok(m.legenda && m.legenda.y1 < 1400);
  } finally { await motor.fechar(); }
});
