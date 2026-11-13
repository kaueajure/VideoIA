import {useThree} from '@react-three/fiber';
import {noise2D} from '@remotion/noise';
import React, {useContext, useLayoutEffect} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {PerspectiveCamera} from 'three';
import {ContextoCena} from '../../video/contexto';
import {misturar, misturarVec} from '../animacao';
import type {Vec3} from '../tema';

export type PontoDeCamera = {posicao: Vec3; alvo?: Vec3; fov?: number};

export type Curva = 'suave' | 'linear' | 'acelera' | 'freia';

// Quadros (`inicio`, `fim`, `quadro`) são relativos ao início da cena.
// Sem `inicio`/`fim`, o movimento dura a cena inteira.
export type MovimentoCamera = (
  | ({tipo: 'fixa'} & PontoDeCamera)
  | {
      tipo: 'mover';
      de: PontoDeCamera;
      para: PontoDeCamera;
      alvo?: Vec3;
      inicio?: number;
      fim?: number;
      curva?: Curva;
    }
  | {
      tipo: 'orbita';
      alvo?: Vec3;
      raio: number;
      altura: number;
      // Ângulos em graus. 0 = de frente (eixo +Z), 90 = pela direita.
      de: number;
      ate: number;
      fov?: number;
      inicio?: number;
      fim?: number;
      curva?: Curva;
    }
  | {tipo: 'chaves'; chaves: Array<PontoDeCamera & {quadro: number}>; curva?: Curva}
) & {
  // Balanço de "câmera na mão", em unidades 3D. Padrão 0.03; 0 desliga.
  tremor?: number;
};

export const ALVO_PADRAO: Vec3 = [0, 1.1, 0];
export const FOV_PADRAO = 38;
// Distância máxima que a câmera enxerga (far) e a mínima (near) que vai junto com ela.
export const ALCANCE_PADRAO = 400;
const PERTO_PADRAO = 0.1;

// Empurrão lento para frente: o movimento padrão de toda cena.
export const CAMERA_PADRAO: MovimentoCamera = {
  tipo: 'mover',
  de: {posicao: [0, 1.8, 8.6]},
  para: {posicao: [0, 1.6, 7.4]},
};

const CURVAS: Record<Curva, (t: number) => number> = {
  suave: Easing.inOut(Easing.cubic),
  linear: (t) => t,
  acelera: Easing.in(Easing.cubic),
  freia: Easing.out(Easing.cubic),
};

const avanco = (frame: number, inicio: number, fim: number, curva: Curva) =>
  interpolate(frame, [inicio, Math.max(inicio + 1, fim)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVAS[curva],
  });

export const pontoDaCamera = (mov: MovimentoCamera, frame: number, duracao: number): Required<PontoDeCamera> => {
  switch (mov.tipo) {
    case 'fixa':
      return {posicao: mov.posicao, alvo: mov.alvo ?? ALVO_PADRAO, fov: mov.fov ?? FOV_PADRAO};
    case 'mover': {
      const t = avanco(frame, mov.inicio ?? 0, mov.fim ?? duracao, mov.curva ?? 'suave');
      return {
        posicao: misturarVec(mov.de.posicao, mov.para.posicao, t),
        alvo: misturarVec(mov.de.alvo ?? mov.alvo ?? ALVO_PADRAO, mov.para.alvo ?? mov.alvo ?? ALVO_PADRAO, t),
        fov: misturar(mov.de.fov ?? FOV_PADRAO, mov.para.fov ?? FOV_PADRAO, t),
      };
    }
    case 'orbita': {
      const t = avanco(frame, mov.inicio ?? 0, mov.fim ?? duracao, mov.curva ?? 'suave');
      const angulo = (misturar(mov.de, mov.ate, t) * Math.PI) / 180;
      const alvo = mov.alvo ?? ALVO_PADRAO;
      return {
        posicao: [alvo[0] + Math.sin(angulo) * mov.raio, mov.altura, alvo[2] + Math.cos(angulo) * mov.raio],
        alvo,
        fov: mov.fov ?? FOV_PADRAO,
      };
    }
    case 'chaves': {
      if (mov.chaves.length === 0) {
        throw new Error('Movimento de câmera "chaves" precisa de pelo menos uma chave.');
      }
      const chaves = [...mov.chaves].sort((a, b) => a.quadro - b.quadro);
      let i = 0;
      while (i < chaves.length - 1 && frame >= chaves[i + 1].quadro) {
        i++;
      }
      const a = chaves[i];
      const b = chaves[Math.min(i + 1, chaves.length - 1)];
      const t = a === b ? 0 : avanco(frame, a.quadro, b.quadro, mov.curva ?? 'suave');
      const alvoA = a.alvo ?? ALVO_PADRAO;
      const fovA = a.fov ?? FOV_PADRAO;
      return {
        posicao: misturarVec(a.posicao, b.posicao, t),
        alvo: misturarVec(alvoA, b.alvo ?? alvoA, t),
        fov: misturar(fovA, b.fov ?? fovA, t),
      };
    }
  }
};

// Posiciona a câmera do <Palco> a cada quadro. Use via prop `camera` do Palco.
// `alcance` (far): com mais de 400, o near sobe na mesma proporção (a razão far/near, que decide a precisão
// da profundidade, fica a mesma do padrão).
export const Camera: React.FC<{movimento: MovimentoCamera; alcance?: number}> = ({movimento, alcance = ALCANCE_PADRAO}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const cena = useContext(ContextoCena);
  const camera = useThree((estado) => estado.camera) as PerspectiveCamera;
  const duracao = cena?.duracao ?? durationInFrames;

  useLayoutEffect(() => {
    const ponto = pontoDaCamera(movimento, frame, duracao);
    const tremor = movimento.tremor ?? 0.03;
    const t = frame / fps;
    const dx = noise2D('camera-x', t * 0.35, 0) * tremor;
    const dy = noise2D('camera-y', t * 0.35, 10) * tremor;
    const dz = noise2D('camera-z', t * 0.25, 20) * tremor;
    camera.position.set(ponto.posicao[0] + dx, ponto.posicao[1] + dy, ponto.posicao[2] + dz);
    camera.fov = ponto.fov;
    camera.far = alcance;
    camera.near = PERTO_PADRAO * Math.max(1, alcance / ALCANCE_PADRAO);
    camera.updateProjectionMatrix();
    camera.lookAt(ponto.alvo[0] + dx * 0.4, ponto.alvo[1] + dy * 0.4, ponto.alvo[2]);
  });

  return null;
};
