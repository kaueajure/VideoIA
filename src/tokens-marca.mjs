import fs from 'node:fs';
import path from 'node:path';

const padrao = JSON.parse(fs.readFileSync(new URL('./tokens-marca-padrao.json', import.meta.url), 'utf8'));

export const arquivoTokensMarca = raiz => path.join(raiz, 'marca', 'tokens.json');

export function lerTokensMarca(raiz, arquivo = arquivoTokensMarca(raiz)) {
  let local;
  try {
    local = JSON.parse(fs.readFileSync(arquivo, 'utf8').replace(/^\uFEFF/, ''));
  } catch (erro) {
    if (erro.code !== 'ENOENT') throw erro;
    return structuredClone(padrao);
  }
  if (!local || typeof local !== 'object' || Array.isArray(local)) {
    throw new Error('marca/tokens.json precisa conter um objeto JSON.');
  }
  const tokens = structuredClone(padrao);
  return {
    ...tokens,
    ...local,
    base: { ...tokens.base, ...local.base },
    paginas: Object.keys(local.paginas || {}).length ? local.paginas : tokens.paginas,
  };
}
