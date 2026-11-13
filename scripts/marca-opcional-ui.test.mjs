import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../src/estudio/pagina.html', import.meta.url), 'utf8');
const handler = html.slice(html.indexOf("$('#mExibir').onchange = async (evento) => {"), html.indexOf('    const imgs = (pasta) =>'));
function tela(post) {
  const nodes = { '#mExibir': { checked: false, disabled: false }, '#resExibicao': {} };
  const ctx = { mostrarMarca: true, post, api: async () => ({ pronto: { marca: true } }),
    $: key => nodes[key] || null, $q: key => nodes[key] || {}, desenhaPassos() {},
    caixaErro: erro => erro.causa, prev() { ctx.previas++; }, previas: 0 };
  vm.runInNewContext(handler, ctx);
  return { nodes, ctx, salvar: () => nodes['#mExibir'].onchange({ target: nodes['#mExibir'] }) };
}

test('controle de marca: só confirma sucesso quando a API aceita a escolha', async () => {
  const t = tela(async () => ({ ok: true, exibir: false }));
  await t.salvar();
  assert.equal(t.ctx.mostrarMarca, false);
  assert.equal(t.nodes['#mExibir'].checked, false);
  assert.equal(t.nodes['#mExibir'].disabled, false);
  assert.match(t.nodes['#resExibicao'].textContent, /sem identificação/);
});

test('controle de marca: resposta 400 em JSON mantém escolha anterior e explica o erro', async () => {
  const t = tela(async () => ({ erro: { causa: 'Configure o nome e o @ antes de exibir.' } }));
  await t.salvar();
  assert.equal(t.ctx.mostrarMarca, true);
  assert.equal(t.nodes['#mExibir'].checked, true);
  assert.equal(t.nodes['#mExibir'].disabled, false);
  assert.match(t.nodes['#resExibicao'].innerHTML, /Configure/);
});

test('controle de marca: sair do painel durante a gravação não quebra a interface', async () => {
  let terminar;
  const t = tela(() => new Promise(resolve => { terminar = resolve; }));
  const salvar = t.salvar();
  delete t.nodes['#mExibir']; delete t.nodes['#resExibicao'];
  terminar({ ok: true, exibir: false });
  await assert.doesNotReject(salvar);
  assert.equal(t.ctx.previas, 0);
});
