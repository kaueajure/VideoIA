// Monta o vídeo final: cenas na ordem do roteiro, voz de cada cena, legenda e moldura.
import {Audio} from '@remotion/media';
import React, {useMemo} from 'react';
import {AbsoluteFill, Sequence, staticFile, useRemotionEnvironment, useVideoConfig} from 'remotion';
import {AreaSegura, BarraProgresso, EntradaCena, Marca, Vinheta} from '../kit/tela/moldura';
import {Legenda} from '../kit/tela/Legenda';
import {COR} from '../kit/tema';
import {AUDIO} from '../config';
import {ProvedorCena} from './contexto';
import {obterVideo, type VideoRegistrado} from './indice';
import {paginarLegendas} from './legendas';
import {calcularLinhaDoTempo, type LinhaDoTempo} from './linhaDoTempo';
import {CenaFaltando, PainelPrevia, TelaDeErro} from './paineis';

export type PropsVideo = {
  slug: string;
  // Liga o painel de informações e a área segura (usado por `npm run previa`).
  previa: boolean;
  areaSegura: boolean;
};

export const linhaDoRegistro = (registro: VideoRegistrado, fps: number): LinhaDoTempo | null =>
  registro.video
    ? calcularLinhaDoTempo({video: registro.video, narracao: registro.narracao, urlDoAudio: registro.urlDoAudio, fps})
    : null;

export const VideoCuriosidade: React.FC<PropsVideo> = ({slug, previa, areaSegura}) => {
  const {fps} = useVideoConfig();
  const {isRendering} = useRemotionEnvironment();
  const registro = obterVideo(slug);
  const linha = useMemo(() => linhaDoRegistro(registro, fps), [registro, fps]);
  const paginas = useMemo(() => (linha ? paginarLegendas(linha) : []), [linha]);

  if (!registro.video || !linha) {
    return <TelaDeErro titulo={`videos/${slug} tem problemas`} erros={registro.erros} />;
  }

  return (
    <AbsoluteFill style={{backgroundColor: COR.fundo}}>
      {linha.cenas.map((cena) => {
        const Componente = registro.cenas[cena.id];
        if (!Componente && isRendering && !previa) {
          throw new Error(`A cena "${cena.id}" de "${slug}" não tem código em cenas.tsx.`);
        }
        return (
          <Sequence key={cena.id} name={cena.id} from={cena.inicio} durationInFrames={cena.duracao} premountFor={15}>
            <ProvedorCena cena={cena} linha={linha}>
              {Componente ? <Componente /> : <CenaFaltando cena={cena} />}
              <EntradaCena tipo={cena.transicao} />
            </ProvedorCena>
            {cena.audio ? <Audio src={cena.audio} name={`voz: ${cena.id}`} /> : null}
          </Sequence>
        );
      })}

      <Vinheta />
      <Legenda paginas={paginas} />
      <Marca />
      <BarraProgresso />
      {registro.video.trilha === false ? null : (
        <Trilha
          arquivo={registro.video.trilha?.arquivo ?? AUDIO.trilhaPadrao}
          volume={registro.video.trilha?.volume ?? AUDIO.volumeTrilha}
          linha={linha}
        />
      )}
      {previa || areaSegura ? <AreaSegura /> : null}
      {previa ? <PainelPrevia linha={linha} /> : null}
    </AbsoluteFill>
  );
};

// Música de fundo que abaixa sozinha enquanto o narrador fala.
const Trilha: React.FC<{arquivo: string; volume: number; linha: LinhaDoTempo}> = ({arquivo, volume, linha}) => {
  const falas = useMemo(
    () =>
      linha.cenas
        .filter((c) => c.palavras.length > 0)
        .map((c) => [c.inicio + c.palavras[0].inicio, c.inicio + c.fimDaFala] as const),
    [linha],
  );
  const volumeNoQuadro = (frame: number) => {
    const rampa = 8;
    const distancia = falas.reduce((menor, [a, b]) => {
      if (frame >= a && frame <= b) {
        return 0;
      }
      return Math.min(menor, frame < a ? a - frame : frame - b);
    }, Infinity);
    const abafar = Math.max(0, 1 - distancia / rampa);
    const fadeIn = Math.min(1, frame / 15);
    const fadeOut = Math.min(1, (linha.duracao - frame) / 45);
    return volume * (1 - (1 - AUDIO.abafamento) * abafar) * Math.max(0, Math.min(fadeIn, fadeOut));
  };
  return <Audio src={staticFile(`trilhas/${arquivo}`)} loop name="trilha" volume={volumeNoQuadro} />;
};
