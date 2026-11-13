import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {entrar, sair} from '../animacao';
import type {Vec3} from '../tema';

export type PropsTransformacao = {
  posicao?: Vec3;
  // Rotação em radianos.
  rotacao?: Vec3;
  escala?: number;
};

export type PropsAnimado = PropsTransformacao & {
  children: React.ReactNode;
  // Quadro (relativo à cena) em que surge com uma mola. Sem valor: já está lá.
  entrada?: number;
  // Quadro em que começa a sumir.
  saida?: number;
  // Amplitude de flutuação vertical (unidades 3D).
  flutuar?: number;
  // Giro contínuo em Y (radianos por segundo).
  girar?: number;
  // Pulsação de escala (0.05 = ±5%).
  pulsar?: number;
};

// Envolve qualquer objeto 3D com entrada, saída, flutuação, giro e pulsação.
export const Animado: React.FC<PropsAnimado> = ({
  children,
  posicao = [0, 0, 0],
  rotacao = [0, 0, 0],
  escala = 1,
  entrada,
  saida,
  flutuar = 0,
  girar = 0,
  pulsar = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const fatorEntrada = entrada === undefined ? 1 : entrar(frame, fps, entrada);
  const fatorSaida = saida === undefined ? 1 : sair(frame, saida, 10);
  const fatorPulso = 1 + Math.sin(t * Math.PI * 2 * 0.8) * pulsar;
  const s = escala * fatorEntrada * fatorSaida * fatorPulso;

  return (
    <group
      visible={s > 0.001}
      position={[posicao[0], posicao[1] + Math.sin(t * Math.PI * 2 * 0.33) * flutuar, posicao[2]]}
      rotation={[rotacao[0], rotacao[1] + t * girar, rotacao[2]]}
      scale={Math.max(s, 0.0001)}
    >
      {children}
    </group>
  );
};
