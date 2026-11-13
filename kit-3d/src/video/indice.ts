// Descobre automaticamente todos os vídeos em videos/<slug>/ (sem lista manual).
// Cada pasta pode ter: video.json, cenas.tsx, audio/narracao.json e audio/*.mp3|wav.
import type React from 'react';
import {esquemaNarracao, esquemaVideo, type Narracao, type Video} from '../esquema';

// Mapa id-da-cena -> componente React. É o que videos/<slug>/cenas.tsx exporta como `cenas`.
export type Cenas = Record<string, React.FC>;

export type VideoRegistrado = {
  slug: string;
  video: Video | null;
  narracao: Narracao | null;
  cenas: Cenas;
  urlDoAudio: (arquivo: string) => string | null;
  // Problemas de validação (video.json inválido, narracao.json corrompido...).
  erros: string[];
};

const ctxVideo = require.context('../../videos', true, /^\.\/[a-z0-9-]+\/video\.json$/);
const ctxCenas = require.context('../../videos', true, /^\.\/[a-z0-9-]+\/cenas\.tsx$/);
const ctxNarracao = require.context('../../videos', true, /^\.\/[a-z0-9-]+\/audio\/narracao\.json$/);
const ctxAudio = require.context('../../videos', true, /^\.\/[a-z0-9-]+\/audio\/[^/]+\.(mp3|wav)$/);

const slugDaChave = (chave: string) => chave.split('/')[1];

const valorPadrao = <T,>(modulo: unknown): T =>
  (modulo && typeof modulo === 'object' && 'default' in modulo ? (modulo as {default: T}).default : modulo) as T;

const formatarErroZod = (prefixo: string, issues: {path: PropertyKey[]; message: string}[]) =>
  issues.map((i) => `${prefixo}${i.path.length ? ` > ${i.path.map(String).join('.')}` : ''}: ${i.message}`);

const carregar = (): VideoRegistrado[] => {
  const audios = new Map<string, string>();
  for (const chave of ctxAudio.keys()) {
    const partes = chave.split('/');
    audios.set(`${partes[1]}/${partes[3]}`, valorPadrao<string>(ctxAudio(chave)));
  }

  return ctxVideo
    .keys()
    .map((chave): VideoRegistrado => {
      const slug = slugDaChave(chave);
      const erros: string[] = [];

      const leituraVideo = esquemaVideo.safeParse(valorPadrao(ctxVideo(chave)));
      if (!leituraVideo.success) {
        erros.push(...formatarErroZod('video.json', leituraVideo.error.issues));
      }

      let narracao: Narracao | null = null;
      const chaveNarracao = `./${slug}/audio/narracao.json`;
      if (ctxNarracao.keys().includes(chaveNarracao)) {
        const leitura = esquemaNarracao.safeParse(valorPadrao(ctxNarracao(chaveNarracao)));
        if (leitura.success) {
          narracao = leitura.data;
        } else {
          erros.push(...formatarErroZod('audio/narracao.json', leitura.error.issues));
        }
      }

      let cenas: Cenas = {};
      const chaveCenas = `./${slug}/cenas.tsx`;
      if (ctxCenas.keys().includes(chaveCenas)) {
        const modulo = ctxCenas(chaveCenas) as {cenas?: Cenas};
        if (modulo.cenas) {
          cenas = modulo.cenas;
        } else {
          erros.push('cenas.tsx precisa exportar `export const cenas: Cenas = {...}`');
        }
      }

      return {
        slug,
        video: leituraVideo.success ? leituraVideo.data : null,
        narracao,
        cenas,
        urlDoAudio: (arquivo) => audios.get(`${slug}/${arquivo}`) ?? null,
        erros,
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
};

export const VIDEOS = carregar();

export const obterVideo = (slug: string): VideoRegistrado => {
  const registro = VIDEOS.find((v) => v.slug === slug);
  if (!registro) {
    throw new Error(`Vídeo "${slug}" não encontrado em videos/. Existem: ${VIDEOS.map((v) => v.slug).join(', ')}`);
  }
  return registro;
};
