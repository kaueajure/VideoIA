// npm run render -- <slug> [--concorrencia N] [--rascunho] [--sem-capa] [--sem-video]
//
// Gera em videos/<slug>/saida/: <slug>.mp4 (com master do áudio), capa.png, capa.jpg,
// storyboard.png, legenda.srt e post.txt.
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync, statSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {FORMATO} from '../src/config';
import {avaliarDuracao} from '../src/video/duracao';
import {
  caminhos,
  cenasImplementadas,
  ErroDeUso,
  exigirSlug,
  impressaoDoMp4,
  lerVideo,
  linhaDoTempoDoDisco,
  RAIZ,
  rodar,
  salvarJson,
  segundos,
} from './lib/projeto';
import {concorrenciaPadrao, OPCOES_CHROMIUM, OPCOES_VIDEO, prepararRender, propsDeEstilo, tempoDesde} from './lib/render';
import {descreverFlicker, detectarFlicker} from './lib/flicker';
import {masterizar} from './lib/master';
import {gerarSrt, gerarTextoDoPost} from './lib/saidas';
import {gerarStoryboard} from './lib/storyboard';

rodar(async () => {
  const {values, positionals} = parseArgs({
    allowPositionals: true,
    options: {
      concorrencia: {type: 'string'},
      rascunho: {type: 'boolean', default: false},
      'sem-capa': {type: 'boolean', default: false},
      // Refaz só capa, legenda e post (o MP4 existente fica como está).
      'sem-video': {type: 'boolean', default: false},
    },
  });
  const slug = exigirSlug(positionals[0]);
  const video = lerVideo(slug);
  const linha = linhaDoTempoDoDisco(slug, video);
  const dir = caminhos(slug);

  // Travas: o vídeo final só sai com voz gerada e todas as cenas programadas.
  if (!values.rascunho) {
    const semVoz = linha.cenas.filter((c) => c.narracao === 'estimada' || c.narracao === 'desatualizada');
    if (semVoz.length) {
      throw new ErroDeUso(
        `Voz faltando ou desatualizada em: ${semVoz.map((c) => c.id).join(', ')}.\n` +
          `Rode npm run voz -- ${slug}  (ou use --rascunho para renderizar mesmo assim).`,
      );
    }
    const duracao = avaliarDuracao(linha.duracao / FORMATO.fps, video.duracao);
    if (!duracao.ok) {
      throw new ErroDeUso(`Duração fora da faixa: ${duracao.resumo}. Ajuste o roteiro e rode npm run voz de novo.`);
    }
    const prontas = cenasImplementadas(slug);
    const faltando = video.cenas.filter((c) => !prontas.has(c.id));
    if (faltando.length) {
      throw new ErroDeUso(`Cenas sem código em cenas.tsx: ${faltando.map((c) => c.id).join(', ')}.`);
    }
  }

  mkdirSync(dir.saida, {recursive: true});
  const concorrencia = values.concorrencia ? Number(values.concorrencia) : concorrenciaPadrao();
  const inicio = Date.now();
  const {serveUrl, navegador} = await prepararRender();

  try {
    const inputProps = {slug, previa: false, areaSegura: false, ...propsDeEstilo(video)};
    const composicao = await selectComposition({
      serveUrl,
      id: slug,
      inputProps,
      puppeteerInstance: navegador,
      chromiumOptions: OPCOES_CHROMIUM,
    });

    const mp4 = path.join(dir.saida, `${slug}.mp4`);
    if (!values['sem-video']) {
    console.log(
      `Renderizando ${composicao.durationInFrames} quadros (${segundos(composicao.durationInFrames / composicao.fps)}) com ${concorrencia} abas...`,
    );
    let ultimoAviso = -1;
    const inicioVideo = Date.now();
    await renderMedia({
      composition: composicao,
      serveUrl,
      outputLocation: mp4,
      inputProps,
      ...OPCOES_VIDEO,
      concurrency: concorrencia,
      puppeteerInstance: navegador,
      chromiumOptions: OPCOES_CHROMIUM,
      overwrite: true,
      onProgress: ({progress}) => {
        const passo = Math.floor(progress * 10);
        if (passo > ultimoAviso) {
          ultimoAviso = passo;
          console.log(`  ${String(passo * 10).padStart(3)}%  (${tempoDesde(inicioVideo)})`);
        }
      },
    });
    const loudness = await masterizar(mp4);
    console.log(loudness ? `Master do áudio: ${loudness.antes.toFixed(1)} → ${loudness.depois.toFixed(1)} LUFS` : '! O vídeo saiu sem áudio (sem voz, trilha nem efeitos): master pulada.');
    const tamanho = statSync(mp4).size / 1024 / 1024;
    console.log(`Vídeo: ${path.relative(RAIZ, mp4)} (${tamanho.toFixed(1)} MB, ${tempoDesde(inicioVideo)})`);
    // Elemento piscando (flicker) não pode ir para o ar: confere o MP4 quadro a quadro.
    const flicker = await detectarFlicker(mp4, linha, FORMATO.fps);
    console.log(
      flicker.length
        ? `! FLICKER: ${flicker.length} trecho(s) com elemento piscando. Corrija antes de publicar:\n${descreverFlicker(flicker)}`
        : '✔ Sem flicker (nenhum elemento piscando).',
    );
    // De que roteiro saiu este MP4 (o arquivar e o status ignoram mudanças só de capa/post/carrossel).
    salvarJson(path.join(dir.saida, 'render.json'), {impressaoDoMp4: impressaoDoMp4(video)});
    }

    if (!values['sem-capa']) {
      const capa = await selectComposition({
        serveUrl,
        id: `${slug}-capa`,
        inputProps: {slug, ...propsDeEstilo(video)},
        puppeteerInstance: navegador,
        chromiumOptions: OPCOES_CHROMIUM,
      });
      for (const formato of ['png', 'jpeg'] as const) {
        const destino = path.join(dir.saida, formato === 'png' ? 'capa.png' : 'capa.jpg');
        await renderStill({
          composition: capa,
          serveUrl,
          output: destino,
          inputProps: {slug, ...propsDeEstilo(video)},
          imageFormat: formato,
          ...(formato === 'jpeg' ? {jpegQuality: 92} : {}),
          puppeteerInstance: navegador,
          chromiumOptions: OPCOES_CHROMIUM,
          overwrite: true,
        });
      }
      console.log(`Capa: ${path.relative(RAIZ, path.join(dir.saida, 'capa.png'))} (+ capa.jpg)`);
    }

    const storyboard = path.join(dir.saida, 'storyboard.png');
    await gerarStoryboard({serveUrl, navegador, slug, linha, destino: storyboard});
    console.log(`Storyboard: ${path.relative(RAIZ, storyboard)}`);
  } finally {
    await navegador.close({silent: true});
  }

  writeFileSync(path.join(dir.saida, 'legenda.srt'), gerarSrt(linha, FORMATO.fps), 'utf8');
  writeFileSync(path.join(dir.saida, 'post.txt'), gerarTextoDoPost(video), 'utf8');
  console.log(`Legenda: videos/${slug}/saida/legenda.srt · Texto do post: videos/${slug}/saida/post.txt`);
  console.log(`\nPronto em ${tempoDesde(inicio)}.${values.rascunho ? ' (RASCUNHO: pode ter voz estimada ou cenas faltando)' : ''}`);
});
