#!/usr/bin/env node
/**
 * Roda um comando npm do kit-3d embutido, com .env sincronizado do estúdio.
 * Uso: node scripts/kit-3d-run.mjs <script> [-- args...]
 * Ex.: node scripts/kit-3d-run.mjs status
 *      node scripts/kit-3d-run.mjs render -- meu-slug
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pastaKit, sincronizarEnvKit, kitPresente } from '../src/estudio/kit3d.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kit = pastaKit(raiz);

if (!kitPresente(raiz)) {
  console.error('kit-3d não está instalado nesta pasta do estúdio.');
  process.exit(1);
}

sincronizarEnvKit(raiz, { forcar: false });

const argv = process.argv.slice(2);
if (!argv.length) {
  console.error('Uso: node scripts/kit-3d-run.mjs <script-npm> [-- args...]');
  process.exit(1);
}

const sep = argv.indexOf('--');
const script = sep === -1 ? argv[0] : argv.slice(0, sep).join(' ');
const extras = sep === -1 ? argv.slice(1) : argv.slice(sep + 1);

if (!fs.existsSync(path.join(kit, 'node_modules'))) {
  console.error('Falta npm install no kit-3d. Rode: npm --prefix kit-3d install');
  process.exit(1);
}

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const args = ['run', script, ...(extras.length ? ['--', ...extras] : [])];

const filho = spawn(npm, args, {
  cwd: kit,
  env: { ...process.env },
  stdio: 'inherit',
  windowsHide: true,
});

filho.on('exit', (code) => process.exit(code ?? 1));
filho.on('error', (err) => {
  console.error(err.message || err);
  process.exit(1);
});
