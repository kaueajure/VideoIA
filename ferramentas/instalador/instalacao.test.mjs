import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { criarIniciador } from './iniciar.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'metodo-instalacao-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

test('distribuição oferece exatamente um instalador por sistema', () => {
  const nomes = fs.readdirSync(raiz).filter(n => /\.(bat|cmd|sh|command)$/.test(n) && !n.startsWith('Iniciar'));
  assert.deepEqual(nomes.sort(), ['Instalar (Linux).sh', 'Instalar (Mac).command', 'Instalar (Windows).cmd']);
  assert.equal(fs.existsSync(path.join(raiz, 'ferramentas/rodar.cmd')), false);
});

test('instalação gera só um Iniciar, substitui outro sistema e preserva os instaladores', () => {
  const pasta = path.join(tmp, 'Estúdio com espaços');
  fs.mkdirSync(pasta);
  fs.writeFileSync(path.join(pasta, 'Instalar (Mac).command'), 'preservar');
  for (const [plataforma, nome] of [['win32', 'Iniciar (Windows).cmd'], ['linux', 'Iniciar (Linux).sh'], ['darwin', 'Iniciar (Mac).command']]) {
    assert.equal(criarIniciador({ studio: pasta, plataforma }), nome);
    assert.deepEqual(fs.readdirSync(pasta).filter(n => n.startsWith('Iniciar')), [nome]);
    const conteudo = fs.readFileSync(path.join(pasta, nome), 'utf8');
    if (plataforma === 'win32') {
      assert.ok(!/(^|[^\r])\n/.test(conteudo));
      assert.match(conteudo, /%~dp0/);
      assert.match(conteudo, /ILU_SEM_MUDANCA=1/);
    } else {
      assert.ok(!conteudo.includes('\r'));
      if (process.platform !== 'win32') assert.ok(fs.statSync(path.join(pasta, nome)).mode & 0o100);
    }
  }
  assert.equal(fs.readFileSync(path.join(pasta, 'Instalar (Mac).command'), 'utf8'), 'preservar');
});

test('Iniciar continua funcionando após mover pasta com espaços e acentos', { skip: process.platform === 'win32' }, () => {
  const pasta = path.join(tmp, 'Vídeos "Maria"');
  fs.mkdirSync(path.join(pasta, 'ferramentas/instalador'), { recursive: true });
  fs.writeFileSync(path.join(pasta, 'ferramentas/instalador/abrir-unix'), '#!/bin/bash\nprintf "%s" "$PWD"\n');
  criarIniciador({ studio: pasta, plataforma: 'linux' });
  const movida = pasta + ' movida'; fs.renameSync(pasta, movida);
  const r = spawnSync('bash', [path.join(movida, 'Iniciar (Linux).sh')], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout, movida);
});

test('simulação não instala nem configura assistente pessoal', () => {
  const prog = path.join(tmp, 'programas-simulados');
  const r = spawnSync(process.execPath, [path.join(raiz, 'ferramentas/instalador/instalar.mjs'), '--simular', '--so=ia'], {
    encoding: 'utf8', timeout: 15000, env: { ...process.env, ILU_PROGRAMAS: prog, ILU_TELEMETRIA: '0' },
  });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /instalados pelo usuário/);
  assert.equal(fs.existsSync(prog), false);
});

test('Git instalado é reutilizado; Git ausente em simulação não chama gerenciador', { skip: process.platform === 'win32' }, () => {
  const bin = path.join(tmp, 'bin'); fs.mkdirSync(bin);
  const git = path.join(bin, 'git'); fs.writeFileSync(git, '#!/bin/sh\necho git-test\n', { mode: 0o755 });
  const modulo = new URL('./sistema.mjs', import.meta.url).href;
  const executar = () => spawnSync(process.execPath, ['--input-type=module', '-e', `import { prepararGit } from ${JSON.stringify(modulo)}; prepararGit({simular:true});`], {
    encoding: 'utf8', timeout: 15000, env: { ...process.env, PATH: bin },
  });
  const existente = executar(); assert.equal(existente.status, 0, existente.stderr); assert.match(existente.stdout, /já instalado/);
  fs.rmSync(git);
  const ausente = executar(); assert.equal(ausente.status, 0, ausente.stderr); assert.match(ausente.stdout, /Instalaria o Git ausente/);
});

test('scripts Unix passam na validação de sintaxe', { skip: process.platform === 'win32' }, () => {
  for (const nome of ['Instalar (Linux).sh', 'Instalar (Mac).command', 'ferramentas/instalador/bootstrap-unix', 'ferramentas/instalador/sistema-unix', 'ferramentas/instalador/node-unix', 'ferramentas/instalador/abrir-unix', 'ferramentas/rodar']) {
    const r = spawnSync('bash', ['-n', path.join(raiz, nome)], { encoding: 'utf8' });
    assert.equal(r.status, 0, nome + ': ' + r.stderr);
  }
});
