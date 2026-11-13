import test from 'node:test';
import assert from 'node:assert/strict';
import { lintarRoteiro, avaliarGancho } from '../src/video/lint-roteiro.mjs';
import { montarPrompt } from '../src/estudio/assistentes.mjs';

test('roteiro factual não recebe cobrança para acrescentar fontes ou ressalvas artificiais na voz', () => {
  const r = lintarRoteiro('O presidente e o Congresso analisam o projeto. São 513 deputados e 81 senadores. O governo propôs mudanças.');
  assert.ok(!r.avisos.some(a => /sem atribuição|nenhuma ressalva|diga de onde vem cada fato/.test(a)));
});

test('fontes faladas no meio do roteiro recebem orientação para sair da narração', () => {
  const r = lintarRoteiro('A Lua reflete a luz do Sol. Segundo a NASA, essa luz chega à Terra. De acordo com o estudo, o efeito varia.');
  assert.ok(r.avisos.some(a => /citação de fonte na narração/.test(a) && /fora|retire/.test(a)));
  assert.ok(!r.problemas.some(a => /citação de fonte/.test(a)), 'orientação editorial não altera fatos nem bloqueia a produção');
});

test('gancho que começa pela fonte não recebe instrução de transferir a fonte para outra frase', () => {
  const r = avaliarGancho('Segundo a NASA, a Lua reflete a luz do Sol.');
  const aviso = r.penas.find(a => /gancho abre pela fonte/.test(a.msg));
  assert.ok(aviso);
  assert.match(aviso.msg, /fora da narração/);
  assert.doesNotMatch(aviso.msg, /fonte logo depois|mesma frase|na seguinte/);
});

test('tempo em segundos e nome do órgão como assunto não são tratados como fontes faladas', () => {
  const r = lintarRoteiro('A NASA lançou a sonda. Em 10 segundos ela ganhou altura. O segundo estágio separou depois. A velocidade crescia segundo a segundo.');
  assert.ok(!r.avisos.some(a => /citação de fonte/.test(a)));
});

test('prompt do chat instrui a manter evidências fora da voz e preservar incertezas', () => {
  const pedido = 'Reescreva a narração.';
  const prompt = montarPrompt(pedido, process.cwd(), { projeto: 'exemplo', alvo: 'video' });
  assert.match(prompt, /sem ler fontes, links/);
  assert.match(prompt, /fontes\.md e fontes\.json/);
  assert.match(prompt, /Preserve hipóteses, estimativas e a condição de investigação/);
  assert.ok(prompt.endsWith(pedido));
});
