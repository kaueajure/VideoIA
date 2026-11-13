// Atalhos de animação. Tudo é função do quadro: nada de tempo real, nada de Math.random.
import {Easing, interpolate, spring, type SpringConfig} from 'remotion';
import type {Vec3} from './tema';

const LIMITAR = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 0 -> 1 com mola, começando no quadro `inicio`. Bom para "aparecer".
export const entrar = (frame: number, fps: number, inicio = 0, config: Partial<SpringConfig> = {}): number =>
  spring({frame: frame - inicio, fps, config: {damping: 13, mass: 0.6, stiffness: 140, ...config}});

// 1 -> 0 suave a partir do quadro `inicio`. Bom para "sumir".
export const sair = (frame: number, inicio: number, duracao = 8): number =>
  interpolate(frame, [inicio, inicio + Math.max(1, duracao)], [1, 0], {...LIMITAR, easing: Easing.in(Easing.cubic)});

// Interpolação com suavização nas pontas, sem extrapolar.
export const suave = (
  frame: number,
  [de, ate]: [number, number],
  [valorDe, valorAte]: [number, number],
  easing: (t: number) => number = Easing.inOut(Easing.cubic),
): number => interpolate(frame, [de, Math.max(de + 1, ate)], [valorDe, valorAte], {...LIMITAR, easing});

// Progresso 0 -> 1 entre dois quadros (suavizado).
export const progresso = (frame: number, de: number, ate: number, easing?: (t: number) => number): number =>
  suave(frame, [de, ate], [0, 1], easing);

// Onda senoidal: periodo em segundos.
export const oscilar = (frame: number, fps: number, periodo = 2, amplitude = 1, fase = 0): number =>
  Math.sin((frame / fps) * ((2 * Math.PI) / periodo) + fase) * amplitude;

export const misturar = (a: number, b: number, t: number): number => a + (b - a) * t;

export const misturarVec = (a: Vec3, b: Vec3, t: number): Vec3 => [
  misturar(a[0], b[0], t),
  misturar(a[1], b[1], t),
  misturar(a[2], b[2], t),
];
