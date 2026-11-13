// Storyboard do vídeo final: um quadro limpo por cena (sem painel de prévia), numa imagem só.
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync, rmSync} from 'node:fs';
import path from 'node:path';
import type {LinhaDoTempo} from '../../src/video/linhaDoTempo';
import {lerVideo} from './projeto';
import {OPCOES_CHROMIUM, propsDeEstilo} from './render';
import {montarFolhaDeContato} from './saidas';

export const gerarStoryboard = async ({
  serveUrl,
  navegador,
  slug,
  linha,
  destino,
}: {
  serveUrl: string;
  navegador: Awaited<ReturnType<typeof openBrowser>>;
  slug: string;
  linha: LinhaDoTempo;
  destino: string;
}) => {
  const inputProps = {slug, previa: false, areaSegura: false, ...propsDeEstilo(lerVideo(slug))};
  const composicao = await selectComposition({serveUrl, id: slug, inputProps, puppeteerInstance: navegador, chromiumOptions: OPCOES_CHROMIUM});
  const temporaria = `${destino}.quadros`;
  mkdirSync(temporaria, {recursive: true});
  try {
    const arquivos = linha.cenas.map((_, i) => path.join(temporaria, `${String(i + 1).padStart(2, '0')}.png`));
    let proximo = 0;
    const trabalhador = async () => {
      while (proximo < linha.cenas.length) {
        const i = proximo++;
        const cena = linha.cenas[i];
        await renderStill({
          composition: composicao,
          serveUrl,
          output: arquivos[i],
          frame: cena.inicio + Math.round(0.6 * (cena.duracao - 1)),
          inputProps,
          imageFormat: 'png',
          puppeteerInstance: navegador,
          chromiumOptions: OPCOES_CHROMIUM,
          overwrite: true,
        });
      }
    };
    await Promise.all(Array.from({length: Math.min(4, arquivos.length)}, trabalhador));
    montarFolhaDeContato(arquivos, destino);
  } finally {
    rmSync(temporaria, {recursive: true, force: true});
  }
};
