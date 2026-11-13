// Empacota o projeto e abre o navegador de render uma única vez por comando.
// Mantenha estas opções em sincronia com remotion.config.ts (Studio e CLI).
import {bundle} from '@remotion/bundler';
import {openBrowser, type ChromiumOptions} from '@remotion/renderer';
import os from 'node:os';
import path from 'node:path';
import type {Video} from '../../src/esquema';
import {RAIZ} from './projeto';

// WebGL acelerado pela GPU (ANGLE usa Direct3D no Windows; Metal no Mac).
// 3D preto ou falhando (driver de vídeo)? RENDER_GL=swangle desenha por software: mais lento, funciona sempre.
export const OPCOES_CHROMIUM: ChromiumOptions = {gl: process.env.RENDER_GL === 'swangle' ? 'swangle' : 'angle'};

export const OPCOES_VIDEO = {
  codec: 'h264',
  crf: 18,
  imageFormat: 'jpeg',
  jpegQuality: 92,
  pixelFormat: 'yuv420p',
  // Cores fiéis no Instagram/YouTube (o padrão do Remotion 4 sai em faixa "cheia", yuvj420p).
  colorSpace: 'bt709',
  audioBitrate: '320k',
} as const;

// Estilo próprio do vídeo (video.json > estilo) vira props do render: o tema lê de lá.
export const propsDeEstilo = (video: Video): Record<string, string> =>
  video.estilo
    ? {
        estilo: video.estilo.base,
        ...(video.estilo.destaque ? {destaque: video.estilo.destaque} : {}),
        // "" também vale: tira a assinatura do topo (ex.: story, onde o nome do perfil cobre o topo).
        ...(video.estilo.assinatura !== undefined ? {assinatura: video.estilo.assinatura.trim()} : {}),
      }
    : {};

// Abas de render em paralelo. Cenas 3D pesam na GPU: metade dos núcleos costuma ser o ponto bom.
export const concorrenciaPadrao = () => Math.max(2, Math.floor(os.availableParallelism() / 2));

export const prepararRender = async () => {
  const inicio = Date.now();
  let ultimo = -1;
  const serveUrl = await bundle({
    entryPoint: path.join(RAIZ, 'src', 'index.ts'),
    rootDir: RAIZ,
    // RENDER_SEM_CACHE=1: empacota sem o cache do webpack (várias prévias ao mesmo tempo corrompem o cache).
    enableCaching: process.env.RENDER_SEM_CACHE !== '1',
    onProgress: (p) => {
      const passo = Math.floor(p / 25);
      if (passo > ultimo) {
        ultimo = passo;
        process.stdout.write(passo === 0 ? 'Empacotando o projeto... ' : `${p}% `);
      }
    },
  });
  console.log(`ok (${((Date.now() - inicio) / 1000).toFixed(1)}s)`);
  const navegador = await openBrowser('chrome', {chromiumOptions: OPCOES_CHROMIUM});
  return {serveUrl, navegador};
};

export const tempoDesde = (inicio: number) => `${((Date.now() - inicio) / 1000).toFixed(1)}s`;
