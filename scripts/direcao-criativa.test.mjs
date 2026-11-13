import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { analisarStoryboard, conferirDirecaoDoAgente, executar } from './storyboard-lint.mjs';
import { pedidoPrimeiro } from '../src/estudio/servidor.mjs';
import { compilar } from '../src/video/plano.mjs';

function exemplo() {
  const palavras = ['Uma', 'moeda', 'cai', 'na', 'mesa', 'aqui'].map((w, i) => ({ w, t: i, f: i + .8 }));
  const cena = {
    direcao: { versao: 2, pergunta: 'Onde a moeda termina?', resposta: 'Ela cai e fica apoiada na mesa.' },
    beats: [0, 1, 2].map(i => ({
      id: `b${i}`, palavras: [i * 2, i * 2 + 1],
      sujeito: { conceito: 'Queda da moeda', acao: 'Mostrar a queda', proposito: 'Explicar o destino',
        chave: palavras[i * 2].w, angulo: 'lateral', estado: ['Moeda acima da mesa', 'Moeda apoiada'] },
      direcao: { funcao: i ? 'mecanismo' : 'gancho', ganhoVisual: 'A trajetória mostra onde a moeda termina.',
        elementosChave: ['moeda'], continuaDe: i ? `b${i - 1}` : null },
      elementos: [{ id: 'moeda', tipo: 'peca', forma: 'moeda', entra: 0, papel: 'destaque' }],
    })),
  };
  return { cena, falado: { palavras, duracao: 6 } };
}

test('produção: novo pedido ativa direção criativa e mantém o protocolo estrutural', () => {
  const pedido = pedidoPrimeiro({ tema: 'Queda da moeda', nome: 'moeda' });
  assert.match(pedido, /<!-- direcao-criativa:v2 -->/);
  assert.match(pedido, /<!-- direcao-agente:v1 -->/);
  assert.match(pedido, /docs\/producao-criativa.md/);
});

test('produção: intenção criativa exige pergunta, resposta e ligação com elementos reais', () => {
  const { cena, falado } = exemplo();
  assert.equal(analisarStoryboard(cena, falado, { estrito: true }).aprovado, true);
  cena.beats[1].direcao.elementosChave = ['inventado'];
  const r = analisarStoryboard(cena, falado, { estrito: true });
  assert.equal(r.aprovado, false);
  assert.match(r.falhas.join(' '), /inventado.*plano efetivo/);
});

test('produção: continuidade declarada exige objeto compartilhado e beat anterior', () => {
  for (const alterar of [
    cena => { cena.beats[1].direcao.continuaDe = 'b2'; },
    cena => { cena.beats[1].elementos[0].id = 'outra'; cena.beats[1].direcao.elementosChave = ['outra']; },
  ]) {
    const { cena, falado } = exemplo();
    alterar(cena);
    const r = analisarStoryboard(cena, falado, { estrito: true });
    assert.equal(r.aprovado, false);
    assert.match(r.falhas.join(' '), /continuidade/);
  }
});

test('produção: sequência repetida gera alerta sem forçar troca de forma em uma explicação contínua', () => {
  const { cena, falado } = exemplo();
  const r = analisarStoryboard(cena, falado, { estrito: true });
  assert.equal(r.aprovado, true);
  assert.ok(r.criatividade.alertas.some(a => a.tipo === 'composicao-repetida' && a.beats.length === 3));
  assert.equal(r.criatividade.revisao, 'pendente');
});

test('produção: dados criativos incompletos não passam por conter apenas a versão', () => {
  for (const alterar of [
    cena => { delete cena.direcao.pergunta; },
    cena => { delete cena.beats[0].direcao; },
    cena => { cena.beats[0].direcao.funcao = 'qualquer'; },
    cena => { cena.beats[0].direcao.elementosChave = []; },
    cena => { delete cena.beats[1].direcao.continuaDe; },
    cena => { cena.beats[1].direcao.elementosChave = 'moeda'; },
  ]) {
    const { cena, falado } = exemplo();
    alterar(cena);
    assert.equal(analisarStoryboard(cena, falado, { estrito: true }).aprovado, false);
  }
});

test('produção: identifica letreiro smooth e interface genérica em uma explicação', () => {
  const { cena, falado } = exemplo();
  cena.beats[0].elementos = [{ id: 'moeda', tipo: 'smooth', forma: 'titulo', texto: 'Queda' }];
  cena.beats[1].elementos = [{ id: 'moeda', tipo: 'smooth', forma: 'botao', texto: 'Caiu' }];
  const r = analisarStoryboard(cena, falado, { estrito: true });
  assert.ok(r.criatividade.alertas.some(a => a.tipo === 'somente-texto' && a.beats.includes('b0')));
  assert.ok(r.criatividade.alertas.some(a => a.tipo === 'interface-como-ilustracao' && a.beats.includes('b1')));
});

test('produção: valida contra o plano efetivo após QA, sem modificar cena nem spec', () => {
  const { cena, falado } = exemplo();
  const spec = compilar(structuredClone(cena), falado);
  spec.beats[1].elementos = [];
  const antes = JSON.stringify({ cena, spec });
  const r = analisarStoryboard(cena, falado, { estrito: true, spec });
  assert.equal(r.aprovado, false);
  assert.match(r.falhas.join(' '), /moeda.*plano efetivo/);
  assert.equal(JSON.stringify({ cena, spec }), antes);
});

test('produção: diagnóstico aponta composição só textual e diferencia isso de falha técnica', () => {
  const { cena, falado } = exemplo();
  cena.beats.forEach(b => { b.elementos = [{ id: 'moeda', tipo: 'titulo', texto: 'Moeda' }]; });
  const r = analisarStoryboard(cena, falado, { estrito: true });
  assert.ok(r.criatividade.alertas.some(a => a.tipo === 'somente-texto'));
  assert.equal(r.criatividade.revisao, 'pendente');
});

test('produção: pedido v2 impede omissão do contrato no CLI e no plano após QA; pedido antigo continua válido', () => {
  const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-criativa-'));
  try {
    const pasta = path.join(raiz, 'projetos', 'teste');
    fs.mkdirSync(pasta, { recursive: true });
    const { cena, falado } = exemplo();
    delete cena.direcao;
    cena.beats.forEach(b => { delete b.direcao; });
    fs.writeFileSync(path.join(pasta, 'cena.json'), JSON.stringify(cena));
    fs.writeFileSync(path.join(pasta, 'palavras.json'), JSON.stringify(falado));
    const pedido = path.join(pasta, 'PEDIDO-DO-ESTUDIO.md');
    fs.writeFileSync(pedido, '<!-- direcao-agente:v1 -->\n<!-- direcao-criativa:v2 -->');
    assert.equal(executar(['teste', '--estrito'], raiz).aprovado, false);
    assert.equal(conferirDirecaoDoAgente(pasta, cena, falado).aprovado, false);
    const completa = exemplo().cena;
    fs.writeFileSync(path.join(pasta, 'cena.json'), JSON.stringify(completa));
    assert.equal(executar(['teste', '--estrito'], raiz).aprovado, true);
    assert.equal(conferirDirecaoDoAgente(pasta, completa, falado).aprovado, true);
    fs.writeFileSync(path.join(pasta, 'cena.json'), JSON.stringify(cena));
    fs.writeFileSync(pedido, '<!-- direcao-agente:v1 -->');
    assert.equal(executar(['teste', '--estrito'], raiz).aprovado, true);
    assert.equal(conferirDirecaoDoAgente(pasta, cena, falado).aprovado, true);
  } finally { fs.rmSync(raiz, { recursive: true, force: true }); }
});
