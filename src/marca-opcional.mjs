import fs from 'node:fs';
import path from 'node:path';

const ler = arquivo => {
  try { return JSON.parse(fs.readFileSync(arquivo, 'utf8').replace(/^\uFEFF/, '')); }
  catch (erro) { if (erro.code === 'ENOENT') return {}; throw erro; }
};

export function estadoMarca(raiz, config = ler(path.join(raiz, 'ilustrando.config.json'))) {
  const pagina = ler(path.join(raiz, 'marca', 'tokens.json')).paginas?.curiosidades || {};
  const configurada = Boolean(pagina.handle && pagina.handle !== '@suapagina');
  return { configurada, exibir: configurada && config.exibirMarca !== false, opcional: true };
}

export function gravarExibicaoMarca(raiz, exibir) {
  if (typeof exibir !== 'boolean') throw new Error('Escolha se deseja exibir a marca.');
  if (exibir && !estadoMarca(raiz).configurada) throw new Error('Configure o nome e o @ antes de exibir a marca. Você pode continuar sem marca.');
  const arquivo = path.join(raiz, 'ilustrando.config.json');
  const config = ler(arquivo);
  fs.writeFileSync(arquivo, JSON.stringify({ ...config, exibirMarca: exibir }, null, 2) + '\n');
  return estadoMarca(raiz);
}
