/*
 * 
 * 
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { estudio } from '../src/estudio/servidor.mjs';

/**
 * Estúdio web como painel sem Terminal: chaves entram e nunca saem, só o endereço local fala com ele, cada POST
 * exige o token, e os erros chegam em português com o que fazer. Usa uma pasta temporária como raiz (nada do
 * estúdio de verdade é alterado).
 */
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-est-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

function raizFalsa(nome) {
  const r = path.join(tmp, nome);
  fs.mkdirSync(path.join(r, 'marca'), { recursive: true });
  fs.copyFileSync(path.join(RAIZ, '.env.exemplo'), path.join(r, '.env.exemplo'));
  fs.copyFileSync(path.join(RAIZ, 'marca', 'tokens.json'), path.join(r, 'marca', 'tokens.json'));
  fs.cpSync(path.join(RAIZ, 'modelos'), path.join(r, 'modelos'), { recursive: true, filter: (f) => !f.includes(`${path.sep}meus`) });
  fs.mkdirSync(path.join(r, 'templates', 'identidades'), { recursive: true });
  fs.copyFileSync(path.join(RAIZ, 'templates', 'identidades', 'presets.json'), path.join(r, 'templates', 'identidades', 'presets.json'));
  fs.writeFileSync(path.join(r, 'ilustrando.config.json'), JSON.stringify({ voz: 'mock', modeloPadrao: 'curiosidades', perguntarModelo: true, linhaEditorial: { politica: 'neutra', intensidade: 'leve', perguntar: true } }, null, 2));
  fs.writeFileSync(path.join(r, 'VERSAO'), '9.9.9\n');
  fs.writeFileSync(path.join(r, 'LICENCA.md'), 'Termos de teste.\n');
  return r;
}

function pedir(porta, rota, { metodo = 'GET', corpo = null, token = null, host = `127.0.0.1:${porta}` } = {}) {
  return new Promise((ok, falha) => {
    const dados = corpo == null ? null : Buffer.from(JSON.stringify(corpo));
    const req = http.request({ host: '127.0.0.1', port: porta, path: rota, method: metodo, headers: { host, ...(token ? { 'x-token': token } : {}), ...(dados ? { 'content-type': 'application/json', 'content-length': dados.length } : {}) } }, (res) => {
      let t = ''; res.on('data', (c) => (t += c)); res.on('end', () => ok({ status: res.statusCode, texto: t, json: (() => { try { return JSON.parse(t); } catch { return null; } })() }));
    });
    req.on('error', falha);
    if (dados) req.write(dados);
    req.end();
  });
}

test('marca opcional: API permite pular a identidade, exige token e salva a escolha sem apagar dados', async () => {
  const raiz = raizFalsa('marca-opcional-api');
  const arquivo = path.join(raiz, 'marca/tokens.json');
  const tokens = JSON.parse(fs.readFileSync(arquivo));
  tokens.paginas.curiosidades.handle = '@suapagina';
  fs.writeFileSync(arquivo, JSON.stringify(tokens));
  const original = fs.readFileSync(arquivo, 'utf8');
  const srv = await estudio({ raiz });
  try {
    const pg = await pedir(srv.porta, '/');
    const token = /const TOKEN = '([0-9a-f]{32})'/.exec(pg.texto)[1];
    const conf = (await pedir(srv.porta, '/api/configuracao')).json;
    assert.equal(conf.pronto.marca, true);
    assert.equal(conf.marca.opcional, true);
    assert.equal(conf.marca.exibir, false);
    assert.equal((await pedir(srv.porta, '/api/marca/exibicao', { metodo: 'POST', corpo: { exibir: false } })).status, 403);
    assert.equal((await pedir(srv.porta, '/api/marca/exibicao', { metodo: 'POST', corpo: { exibir: 'false' }, token })).status, 400);
    const salvo = await pedir(srv.porta, '/api/marca/exibicao', { metodo: 'POST', corpo: { exibir: false }, token });
    assert.equal(salvo.status, 200); assert.equal(salvo.json.exibir, false);
    assert.equal(fs.readFileSync(arquivo, 'utf8'), original);
    assert.equal(JSON.parse(fs.readFileSync(path.join(raiz, 'ilustrando.config.json'))).exibirMarca, false);
    assert.equal((await pedir(srv.porta, '/api/marca/exibicao', { metodo: 'POST', corpo: { exibir: true }, token })).status, 400);
    tokens.paginas.curiosidades.handle = '@minhapagina'; fs.writeFileSync(arquivo, JSON.stringify(tokens));
    assert.equal((await pedir(srv.porta, '/api/marca/exibicao', { metodo: 'POST', corpo: { exibir: true }, token })).json.exibir, true);
  } finally { srv.fechar(); }
});
