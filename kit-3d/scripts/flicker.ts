// npm run flicker -- <slug> [--arquivo <video.mp4>]
// npm run flicker -- <vitrine> [--cena <nome>]      (ex.: pro-cenas, pro-vinhetas, kit-objetos)
// Procura elementos piscando (flicker) no MP4: trechos em que um pedaço da imagem muda num quadro e
// volta no seguinte. O `npm run render` já roda isto no fim; use à parte para conferir um MP4 antigo
// (ex.: o do Drive, com --arquivo) ou as vitrines do kit (renderiza a vitrine e confere cada cena).
import {renderMedia, selectComposition} from '@remotion/renderer';
import {existsSync, mkdirSync} from 'node:fs';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {FORMATO} from '../src/config';
import type {LinhaDoTempo} from '../src/video/linhaDoTempo';
import {caminhos, ErroDeUso, exigirSlug, linhaDoTempoDoDisco, RAIZ, rodar} from './lib/projeto';
import {descreverFlicker, detectarFlicker} from './lib/flicker';
import {concorrenciaPadrao, OPCOES_CHROMIUM, OPCOES_VIDEO, prepararRender} from './lib/render';

// Renderiza a vitrine inteira (ou só um trecho dela) e devolve o MP4 e a "linha do tempo" dos trechos.
const renderizarVitrine = async (id: string, so?: string): Promise<{mp4: string; linha: LinhaDoTempo}> => {
  const mp4 = path.join(RAIZ, 'out', `flicker-${id}${so ? `-${so}` : ''}.mp4`);
  mkdirSync(path.dirname(mp4), {recursive: true});
  const {serveUrl, navegador} = await prepararRender();
  try {
    const composition = await selectComposition({serveUrl, id, puppeteerInstance: navegador, chromiumOptions: OPCOES_CHROMIUM});
    const trechos = (composition.props as {trechos?: Array<{nome: string; inicio: number; duracao: number}>}).trechos ?? [
      {nome: id, inicio: 0, duracao: composition.durationInFrames},
    ];
    const escolhidos = so ? trechos.filter((t) => t.nome === so) : trechos;
    if (!escolhidos.length) {
      throw new ErroDeUso(`A vitrine ${id} não tem a cena "${so}". Cenas: ${trechos.map((t) => t.nome).join(', ')}`);
    }
    const de = escolhidos[0].inicio;
    const ate = escolhidos[escolhidos.length - 1].inicio + escolhidos[escolhidos.length - 1].duracao - 1;
    console.log(`Renderizando ${id}${so ? ` (${so})` : ''}: ${ate - de + 1} quadros...`);
    await renderMedia({
      composition,
      serveUrl,
      outputLocation: mp4,
      ...OPCOES_VIDEO,
      frameRange: [de, ate],
      concurrency: concorrenciaPadrao(),
      puppeteerInstance: navegador,
      chromiumOptions: OPCOES_CHROMIUM,
      overwrite: true,
      muted: true,
    });
    const cenas = escolhidos.map((t) => ({id: t.nome, inicio: t.inicio - de, duracao: t.duracao})) as unknown as LinhaDoTempo['cenas'];
    return {mp4, linha: {cenas, duracao: ate - de + 1, narracaoCompleta: true}};
  } finally {
    await navegador.close({silent: true});
  }
};

rodar(async () => {
  const {values, positionals} = parseArgs({allowPositionals: true, options: {arquivo: {type: 'string'}, cena: {type: 'string'}}});
  const alvo = positionals[0] ?? '';
  const ehVitrine = /^(kit|pro)-[a-z0-9-]+$/.test(alvo) && !existsSync(caminhos(alvo).pasta);

  let mp4: string;
  let linha: LinhaDoTempo;
  if (ehVitrine) {
    ({mp4, linha} = await renderizarVitrine(alvo, values.cena));
  } else {
    const slug = exigirSlug(alvo);
    mp4 = values.arquivo ? path.resolve(values.arquivo) : path.join(caminhos(slug).saida, `${slug}.mp4`);
    if (!existsSync(mp4)) {
      throw new ErroDeUso(`Não achei ${mp4}. Renderize antes (npm run render -- ${slug}) ou passe --arquivo.`);
    }
    linha = linhaDoTempoDoDisco(slug);
  }

  console.log(`Procurando flicker em ${path.relative(process.cwd(), mp4) || mp4}...`);
  const trechos = await detectarFlicker(mp4, linha, FORMATO.fps);
  if (!trechos.length) {
    console.log('✔ Nenhum elemento piscando.');
    return;
  }
  console.log(`! ${trechos.length} trecho(s) com elemento piscando:\n${descreverFlicker(trechos)}`);
  console.log('\nConfira com npm run previa -- <slug> --quadros N-1,N,N+1 --limpa. Causas comuns: superfícies na mesma');
  console.log('posição (z-fighting: afaste uma da outra uns 2–6%), valor que salta de quadro em quadro (contador, ponteiro,');
  console.log('tremor), objeto que atravessa a tela em 1–2 quadros, transparências cruzadas (renderOrder/depthWrite).');
  process.exitCode = 1;
});
