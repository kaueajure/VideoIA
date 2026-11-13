import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { estadoMarca, gravarExibicaoMarca } from '../src/marca-opcional.mjs';
import { aplicarMarcaOpcional } from '../src/video/engine/marca-opcional.js';
import { resolverFormato, aplicarNaCena } from '../src/video/formato.mjs';
import { prepararSpec } from '../src/video/preparar-spec.mjs';
import { compilar } from '../src/video/plano.mjs';
import { baseGlobal } from '../src/video/render.mjs';

test('pessoa sem marca pode continuar; preferência é reversível e preserva identidade e configuração', () => {
  const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'marca-opcional-'));
  try {
    assert.deepEqual(estadoMarca(raiz), { configurada: false, exibir: false, opcional: true });
    assert.equal(gravarExibicaoMarca(raiz, false).exibir, false);
    assert.throws(() => gravarExibicaoMarca(raiz, true), /Configure/);
    assert.throws(() => gravarExibicaoMarca(raiz, 'false'), /Escolha/);
    fs.mkdirSync(path.join(raiz, 'marca'));
    const tokens = JSON.stringify({ paginas: { curiosidades: { handle: '@teste', nome: 'Teste', destaque: '#123456' } } });
    fs.writeFileSync(path.join(raiz, 'marca/tokens.json'), tokens);
    fs.writeFileSync(path.join(raiz, 'ilustrando.config.json'), JSON.stringify({ voz: 'elevenlabs', objetivoPadrao: 'esporte' }));
    assert.equal(estadoMarca(raiz).exibir, true, 'identidades existentes continuam ativas');
    assert.equal(gravarExibicaoMarca(raiz, false).exibir, false);
    assert.equal(fs.readFileSync(path.join(raiz, 'marca/tokens.json'), 'utf8'), tokens);
    assert.equal(JSON.parse(fs.readFileSync(path.join(raiz, 'ilustrando.config.json'))).voz, 'elevenlabs');
    assert.equal(gravarExibicaoMarca(raiz, true).exibir, true);
  } finally { fs.rmSync(raiz, { recursive: true, force: true }); }
});

test('sem @ funciona no vertical e no horizontal e sobrevive à compilação', () => {
  for (const formato of ['vertical', 'horizontal']) {
    const r = resolverFormato({ cena: { formato, handle: false } });
    assert.equal(r.handle, false);
    const cena = aplicarNaCena({ tema: 'Teste', beats: [{ id: 'a', palavras: [0, 0], elementos: [] }] }, r);
    const spec = compilar(cena, { duracao: 2, palavras: [{ w: 'Teste.', t: 0, f: 1 }] });
    assert.equal(spec.handle, false);
  }
  assert.equal(resolverFormato({}).handle, true, 'padrão legado mantido para marcas configuradas');
  assert.equal(resolverFormato({ opc: { handle: false } }).handle, false);
});

test('ocultar @ preserva CTA; sem marca também remove a identificação no CTA sem tocar no tema ou na fala', () => {
  const input = { handle: false, marca: { serie: '@teste', destaque: '#123456' }, beats: [
    { id: 'fato', titulo: { texto: '@teste faz parte do assunto' } },
    { id: 'fim', direcao: { funcao: 'cta' }, titulo: { texto: 'Segue @teste' }, elementos: [{ tipo: 'peca', forma: 'seguirperfil', dados: { handle: '@teste', nome: 'Teste', logo: 'meu-logo' } }] },
  ] };
  const soTopo = aplicarMarcaOpcional(structuredClone(input));
  assert.equal(soTopo.marca.serie, '');
  assert.equal(soTopo.marca.serieCta, '@teste');
  const semMarca = aplicarMarcaOpcional({ ...structuredClone(input), semMarca: true });
  assert.equal(semMarca.marca.serieCta, '');
  assert.equal(semMarca.beats[1].titulo.texto, 'Segue a página');
  assert.equal(semMarca.beats[0].titulo.texto, input.beats[0].titulo.texto);
  assert.equal(semMarca.marca.destaque, '#123456');
  assert.deepEqual(aplicarMarcaOpcional(structuredClone(semMarca)), semMarca, 'aplicação idempotente');
});

test('prévia e render de cena antiga obedecem à preferência atual e invalidam cache sem reescrever a autoria', () => {
  const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'marca-cache-'));
  try {
    fs.mkdirSync(path.join(raiz, 'marca'));
    fs.writeFileSync(path.join(raiz, 'marca/tokens.json'), JSON.stringify({ paginas: { curiosidades: { handle: '@teste' } } }));
    const pasta = path.join(raiz, 'projetos/teste'); fs.mkdirSync(pasta, { recursive: true });
    const cena = { tema: 'Teste', formato: 'horizontal', handle: true, beats: [{ id: 'a', palavras: [0, 0], elementos: [] }] };
    const falado = { duracao: 2, palavras: [{ w: 'Teste.', t: 0, f: 1.8 }] };
    const antes = JSON.stringify(cena);
    const com = prepararSpec(cena, falado, { pasta });
    gravarExibicaoMarca(raiz, false);
    const sem = prepararSpec(cena, falado, { pasta });
    assert.equal(sem.handle, false); assert.equal(sem.marca.serie, ''); assert.equal(sem.marca.serieCta, '');
    assert.notEqual(baseGlobal(com), baseGlobal(sem), 'não reaproveitar quadros com @ antigo');
    gravarExibicaoMarca(raiz, true);
    const reativada = prepararSpec(cena, falado, { pasta });
    assert.equal(reativada.handle, true);
    assert.equal(reativada.marca.serie, com.marca.serie);
    assert.equal(JSON.stringify(cena), antes);
    assert.deepEqual(sem.palavras, falado.palavras);
  } finally { fs.rmSync(raiz, { recursive: true, force: true }); }
});
