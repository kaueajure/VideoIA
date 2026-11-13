// Capa do vídeo: um quadro congelado de uma cena + título grande.
import React, {useMemo} from 'react';
import {AbsoluteFill, Freeze, useVideoConfig} from 'remotion';
import {Marca, Vinheta} from '../kit/tela/moldura';
import {estiloTextoForte} from '../kit/tela/Legenda';
import {COR, ESTILO} from '../kit/tema';
import type {Video} from '../esquema';
import {ContextoCapa, ProvedorCena} from './contexto';
import {obterVideo} from './indice';
import type {CenaNoTempo, LinhaDoTempo} from './linhaDoTempo';
import {normalizarPalavra} from './palavras';
import {CenaFaltando, TelaDeErro} from './paineis';
import {linhaDoRegistro} from './VideoCuriosidade';

// Qual cena e qual quadro dela viram o fundo da capa.
export const momentoDaCapa = (video: Video, linha: LinhaDoTempo): {cena: CenaNoTempo; quadro: number} => {
  const cena = linha.cenas.find((c) => c.id === video.capa.cena) ?? linha.cenas[0];
  return {cena, quadro: Math.round(video.capa.momento * (cena.duracao - 1))};
};

// Atenção: o Remotion limita o quadro à duração da composição. Por isso a capa é
// registrada com `quadro + 1` quadros (Root.tsx) e não como <Still> de 1 quadro —
// senão o <Freeze> abaixo veria sempre o quadro 0.
export const Capa: React.FC<{slug: string}> = ({slug}) => {
  const {fps} = useVideoConfig();
  const registro = obterVideo(slug);
  const linha = useMemo(() => linhaDoRegistro(registro, fps), [registro, fps]);
  if (!registro.video || !linha) {
    return <TelaDeErro titulo={`videos/${slug} tem problemas`} erros={registro.erros} />;
  }
  const {capa} = registro.video;
  const {cena, quadro} = momentoDaCapa(registro.video, linha);
  const Componente = registro.cenas[cena.id];

  return (
    <AbsoluteFill style={{backgroundColor: COR.fundo}}>
      <ContextoCapa.Provider value>
        <ProvedorCena cena={cena} linha={linha}>
          <Freeze frame={quadro}>{Componente ? <Componente /> : <CenaFaltando cena={cena} />}</Freeze>
        </ProvedorCena>
      </ContextoCapa.Provider>
      <SobreposicaoCapa titulo={capa.titulo} destaque={capa.destaque} />
    </AbsoluteFill>
  );
};

// Degradê, vinheta, título e assinatura da capa (também usados na amostra de estilo).
export const SobreposicaoCapa: React.FC<{titulo: string; destaque?: string}> = ({titulo, destaque}) => {
  const destaques = new Set((destaque ?? '').split(/\s+/).map(normalizarPalavra).filter(Boolean));
  const c = ESTILO.degradeCapa;
  return (
    <>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(${c},0.25) 0%, rgba(${c},0) 28%, rgba(${c},0) 50%, rgba(${c},0.88) 82%)`,
        }}
      />
      <Vinheta forca={0.7} />
      {/* Título dentro do recorte 3:4 que o Instagram mostra na grade do perfil. */}
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 440}}>
        <div
          style={{
            width: 960,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            columnGap: 30,
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          {titulo
            .split(/\s+/)
            .filter(Boolean)
            .map((palavra, i) => (
              <span key={i} style={estiloTextoForte(132, destaques.has(normalizarPalavra(palavra)) ? COR.destaque : COR.texto, 20)}>
                {palavra}
              </span>
            ))}
        </div>
      </AbsoluteFill>
      <Marca y={1540} />
    </>
  );
};
