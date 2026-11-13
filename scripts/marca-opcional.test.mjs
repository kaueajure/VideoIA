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
import { lerTokensMarca } from '../src/tokens-marca.mjs';
import { prepararExemplo, temExemplo } from '../src/video/exemplo.mjs';

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

test('clone sem tokens prepara o vídeo com a paleta padrão e o CTA sem identificação', () => {
  const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'marca-ausente-'));
  try {
    gravarExibicaoMarca(raiz, false);
    const pasta = path.join(raiz, 'projetos', 'teste');
    const cena = { tema: 'Teste', beats: [{ id: 'a', palavras: [0, 0], elementos: [
      { tipo: 'peca', forma: 'seguirperfil', dados: { handle: '@antiga', nome: 'Antiga' } },
    ] }] };
    const spec = prepararSpec(cena, { duracao: 2, palavras: [{ w: 'Teste.', t: 0, f: 1 }] }, { pasta });
    assert.equal(spec.semMarca, true);
    assert.equal(spec.handle, false);
    assert.equal(spec.marca.destaque, '#FF7A2F');
    assert.equal(spec.marca.serieCta, '');
    assert.equal(spec.beats[0].elementos[0].dados.handle, '');
    assert.equal(fs.existsSync(path.join(raiz, 'marca')), false);

    fs.mkdirSync(path.join(raiz, 'marca'));
    const tokens = path.join(raiz, 'marca', 'tokens.json');
    fs.writeFileSync(tokens, '{"paginas":{}}');
    assert.equal(lerTokensMarca(raiz).base.fundo, '#0E0E13');
    fs.writeFileSync(tokens, '{');
    assert.throws(() => lerTokensMarca(raiz), SyntaxError);
  } finally { fs.rmSync(raiz, { recursive: true, force: true }); }
});

test('prova em clone limpo instala o exemplo distribuído sem substituir um roteiro local', () => {
  const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'marca-prova-'));
  try {
    const modelo = path.join(raiz, 'templates', 'primeiro-video', 'ceu-azul');
    const pasta = path.join(raiz, 'projetos', 'exemplo');
    fs.mkdirSync(modelo, { recursive: true });
    fs.writeFileSync(path.join(modelo, 'roteiro.md'), 'Roteiro do estúdio');
    fs.writeFileSync(path.join(modelo, 'fontes.md'), 'Fontes do estúdio');
    assert.equal(temExemplo(raiz), true);
    assert.equal(fs.existsSync(pasta), false);
    prepararExemplo(raiz, pasta);
    assert.equal(fs.readFileSync(path.join(pasta, 'roteiro.md'), 'utf8'), 'Roteiro do estúdio');
    assert.equal(fs.readFileSync(path.join(pasta, 'fontes.md'), 'utf8'), 'Fontes do estúdio');
    fs.writeFileSync(path.join(pasta, 'roteiro.md'), 'Roteiro local');
    prepararExemplo(raiz, pasta);
    assert.equal(fs.readFileSync(path.join(pasta, 'roteiro.md'), 'utf8'), 'Roteiro local');
  } finally { fs.rmSync(raiz, { recursive: true, force: true }); }
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
    assert.equal(com.marca.serie, '@teste');
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
