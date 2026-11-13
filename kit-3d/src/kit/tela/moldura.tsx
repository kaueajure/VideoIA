// Camadas fixas do vídeo: vinheta, assinatura, barra de progresso, transições e área segura.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Transicao} from '../../esquema';
import {FONTE} from '../fontes';
import {AREA_SEGURA, ASSINATURA, COR, ESTILO} from '../tema';

export const Vinheta: React.FC<{forca?: number}> = ({forca = 0.6}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 75% 60% at 50% 42%, rgba(${ESTILO.vinheta},0) 55%, rgba(${ESTILO.vinheta},${forca * ESTILO.forcaVinheta}) 100%)`,
    }}
  />
);

export const Marca: React.FC<{y?: number}> = ({y = 150}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div
      style={{
        position: 'absolute',
        top: y,
        width: '100%',
        textAlign: 'center',
        fontFamily: FONTE,
        fontWeight: 800,
        fontSize: 26,
        letterSpacing: 7,
        color: ESTILO.marca,
      }}
    >
      {ASSINATURA}
    </div>
  </AbsoluteFill>
);

export const BarraProgresso: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 0, left: 0, height: 8, width: '100%', background: ESTILO.trilhoBarra}} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 8,
          width: `${(frame / Math.max(1, durationInFrames - 1)) * 100}%`,
          background: COR.destaque,
        }}
      />
    </AbsoluteFill>
  );
};

// Efeito no início de cada cena (o padrão "corte" não desenha nada).
export const EntradaCena: React.FC<{tipo: Transicao}> = ({tipo}) => {
  const frame = useCurrentFrame();
  if (tipo === 'corte') {
    return null;
  }
  const opacidade =
    tipo === 'flash'
      ? interpolate(frame, [0, 7], [0.95, 0], {extrapolateRight: 'clamp'})
      : interpolate(frame, [0, 12], [1, 0], {extrapolateRight: 'clamp'});
  if (opacidade <= 0) {
    return null;
  }
  return <AbsoluteFill style={{backgroundColor: tipo === 'flash' ? '#ffffff' : ESTILO.fade, opacity: opacidade, pointerEvents: 'none'}} />;
};

// Mostra onde a interface do Reels/Shorts cobre o vídeo (só em prévia).
export const AreaSegura: React.FC = () => {
  const {width, height} = useVideoConfig();
  const faixa = 'rgba(255, 40, 80, 0.22)';
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width, height: AREA_SEGURA.topo, background: faixa}} />
      <div style={{position: 'absolute', left: 0, bottom: 0, width, height: AREA_SEGURA.base, background: faixa}} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: AREA_SEGURA.topo,
          width: AREA_SEGURA.esquerda,
          height: height - AREA_SEGURA.topo - AREA_SEGURA.base,
          background: faixa,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: AREA_SEGURA.topo,
          width: AREA_SEGURA.direita,
          height: height - AREA_SEGURA.topo - AREA_SEGURA.base,
          background: faixa,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: AREA_SEGURA.esquerda,
          top: AREA_SEGURA.topo,
          right: AREA_SEGURA.direita,
          bottom: AREA_SEGURA.base,
          border: '3px dashed rgba(255, 80, 110, 0.9)',
        }}
      />
    </AbsoluteFill>
  );
};
