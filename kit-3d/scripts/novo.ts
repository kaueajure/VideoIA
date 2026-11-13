// npm run novo -- <slug> "Título do vídeo"
// npm run novo -- <slug> --roteiro <número>         (parte de um roteiro do banco-de-roteiros/)
// npm run novo -- <slug> --roteiro <arquivo.json>   (parte de um roteiro em arquivo, ex.: episódio de uma série)
// Cria videos/<slug>/ a partir de modelos/video/.
import {copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {PADRAO_SLUG} from '../src/esquema';
import {caminhos, ErroDeUso, RAIZ, rodar, salvarJson} from './lib/projeto';
import {conferirRoteiro, lerDoBanco, listarBanco} from './lib/roteiros';

rodar(async () => {
  const args = process.argv.slice(2);
  const iRoteiro = args.indexOf('--roteiro');
  const origemRoteiro = iRoteiro >= 0 ? (args[iRoteiro + 1] ?? '') : null;
  const [slug, ...resto] = args.filter((_, i) => iRoteiro < 0 || (i !== iRoteiro && i !== iRoteiro + 1));
  const titulo = resto.join(' ').trim();
  if (!slug || !PADRAO_SLUG.test(slug)) {
    throw new ErroDeUso(
      'Uso: npm run novo -- <slug> "Título"   ou   npm run novo -- <slug> --roteiro <número ou arquivo.json>   (slug: minúsculas, números e hífens)',
    );
  }
  const dir = caminhos(slug);
  if (existsSync(dir.pasta)) {
    throw new ErroDeUso(`videos/${slug}/ já existe.`);
  }

  let doBanco: ReturnType<typeof lerDoBanco> | null = null;
  if (origemRoteiro !== null) {
    if (/^\d+$/.test(origemRoteiro)) {
      const item = listarBanco().find((i) => i.numero === Number(origemRoteiro));
      if (!item) {
        throw new ErroDeUso(`Roteiro ${origemRoteiro} não encontrado em banco-de-roteiros/. Veja a lista com npm run roteiros.`);
      }
      doBanco = lerDoBanco(item);
    } else {
      const arquivo = path.resolve(RAIZ, origemRoteiro);
      if (!arquivo.endsWith('.json') || !existsSync(arquivo)) {
        throw new ErroDeUso(`Roteiro não encontrado: ${origemRoteiro} (use o número do banco ou o caminho de um arquivo .json).`);
      }
      doBanco = conferirRoteiro(JSON.parse(readFileSync(arquivo, 'utf8')));
    }
    if (!doBanco.video) {
      throw new ErroDeUso(`O roteiro ${origemRoteiro} está com problema:\n  - ${doBanco.erros.join('\n  - ')}`);
    }
  }

  const modelo = path.join(RAIZ, 'modelos', 'video');
  mkdirSync(dir.pasta, {recursive: true});
  for (const arquivo of readdirSync(modelo)) {
    const origem = path.join(modelo, arquivo);
    const destino = path.join(dir.pasta, arquivo);
    const nomeDoVideo = doBanco?.video?.titulo ?? (titulo || slug);
    if (/\.(json|tsx|md)$/.test(arquivo)) {
      writeFileSync(destino, readFileSync(origem, 'utf8').replaceAll('{{TITULO}}', nomeDoVideo), 'utf8');
    } else {
      copyFileSync(origem, destino);
    }
  }
  if (doBanco?.video) {
    // O roteiro pronto é um ponto de partida: quem aprova (e pode mudar) é o dono do canal.
    salvarJson(dir.video, {...doBanco.video, roteiroAprovado: false});
    // As cenas de exemplo do modelo não existem neste roteiro: cenas.tsx começa vazio, com os ids certos.
    writeFileSync(
      path.join(dir.pasta, 'cenas.tsx'),
      `// Cenas de "${doBanco.video.titulo}". Uma entrada em \`cenas\` para cada id do video.json:\n` +
        doBanco.video.cenas.map((c) => `//   ${c.id}`).join('\n') +
        `\n// Regras: anime só com o quadro (useCurrentFrame / useCena), 3D dentro do <Palco>,\n// textos 2D (Titulo, Rotulo, Numero) fora dele. Veja o CLAUDE.md.\nimport {type Cenas} from '../../src/kit';\n\nexport const cenas: Cenas = {};\n`,
      'utf8',
    );
    console.log(`Criado videos/${slug}/ com o roteiro ${origemRoteiro}: "${doBanco.video.titulo}" (${doBanco.video.cenas.length} cenas).`);
    console.log('Próximo: revisar o roteiro (adapte ao seu público), aprovar e gerar a voz.');
    return;
  }
  console.log(`Criado videos/${slug}/ (video.json + cenas.tsx).`);
  console.log('Próximo: escrever o roteiro em video.json e aprovar.');
});
