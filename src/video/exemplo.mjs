import fs from 'node:fs';
import path from 'node:path';

const modeloDeTeste = raiz => path.join(raiz, 'templates', 'primeiro-video', 'ceu-azul');

export function temExemplo(raiz) {
  return [path.join(raiz, 'projetos', 'exemplo'), modeloDeTeste(raiz)]
    .some(pasta => fs.existsSync(path.join(pasta, 'roteiro.md')));
}

// A pasta de projetos é local. Copie o exemplo distribuído somente quando ele for pedido.
export function prepararExemplo(raiz, pasta) {
  const roteiro = path.join(pasta, 'roteiro.md');
  if (fs.existsSync(roteiro)) return;
  const modelo = modeloDeTeste(raiz);
  if (!fs.existsSync(path.join(modelo, 'roteiro.md'))) return;
  fs.mkdirSync(pasta, { recursive: true });
  for (const nome of ['fontes.md', 'roteiro.md']) {
    try { fs.copyFileSync(path.join(modelo, nome), path.join(pasta, nome), fs.constants.COPYFILE_EXCL); }
    catch (erro) { if (erro.code !== 'EEXIST') throw erro; }
  }
}
