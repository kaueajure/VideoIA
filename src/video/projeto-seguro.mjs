import fs from 'node:fs';
import path from 'node:path';
import { travar } from './arquivo.mjs';

export function abrirProjeto(raiz, nome) {
  if (typeof nome !== 'string' || !/^[a-z0-9][a-z0-9-]{0,60}$/.test(nome)) throw new Error('Projeto inválido.');
  const base = fs.realpathSync(path.join(raiz, 'projetos'));
  const pasta = path.join(base, nome);
  if (fs.lstatSync(pasta).isSymbolicLink() || fs.realpathSync(pasta) !== pasta || !fs.statSync(pasta).isDirectory()) throw new Error('Projeto precisa estar na pasta de projetos, sem links simbólicos.');
  return pasta;
}

export function arquivoProjeto(pasta, nome) {
  if (typeof nome !== 'string' || path.isAbsolute(nome) || nome.split(/[\\/]/).some(p => !p || p === '..' || p === '.' || p.startsWith('.env'))) throw new Error('Arquivo de projeto inválido.');
  let atual = fs.realpathSync(pasta);
  for (const parte of nome.split('/')) {
    atual = path.join(atual, parte);
    try { if (fs.lstatSync(atual).isSymbolicLink()) throw new Error('Links simbólicos não são permitidos nesta operação.'); }
    catch (e) { if (e.code !== 'ENOENT') throw e; }
  }
  return atual;
}
export function lerProjeto(pasta, nome, { opcional = false, json = false, limite = 5 * 1024 ** 2 } = {}) {
  const arquivo = arquivoProjeto(pasta, nome);
  try {
    if (!fs.statSync(arquivo).isFile() || fs.statSync(arquivo).size > limite) throw new Error(`${nome}: arquivo inválido ou grande demais.`);
    const texto = fs.readFileSync(arquivo, 'utf8').replace(/^\uFEFF/, '');
    try { return json ? JSON.parse(texto) : texto; } catch { throw new Error(`${nome}: JSON inválido.`); }
  } catch (e) { if (opcional && e.code === 'ENOENT') return null; throw e; }
}
export function travarEdicao(pasta) {
  const lock = arquivoProjeto(pasta, '.produzindo.lock');
  try {
    const registro = JSON.parse(fs.readFileSync(lock, 'utf8'));
    if (registro.pid === process.pid) { const e = new Error('Este projeto está em uso. Espere a produção ou edição terminar.'); e.status = 409; throw e; }
  } catch (e) { if (e.status === 409) throw e; }
  try { return travar(pasta); }
  catch (e) { if (e.code === 'ILU_TRAVADO') e.status = 409; throw e; }
}
