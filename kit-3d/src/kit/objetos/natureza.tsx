import React from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Vec3} from '../tema';
import type {PropsTransformacao} from './Animado';

const BOLHAS: Array<[number, number, number, number]> = [
  [0, 0, 0, 0.55],
  [0.56, -0.06, 0.04, 0.42],
  [-0.56, -0.08, 0, 0.4],
  [0.24, 0.3, -0.06, 0.42],
  [-0.26, 0.26, 0.06, 0.38],
];

export const Nuvem: React.FC<PropsTransformacao & {cor?: string}> = ({cor = '#f2f6ff', posicao, rotacao, escala = 1}) => (
  <group position={posicao} rotation={rotacao} scale={[escala, escala * 0.85, escala]}>
    {BOLHAS.map(([x, y, z, r], i) => (
      <mesh key={i} position={[x, y, z]} castShadow>
        <icosahedronGeometry args={[r, 1]} />
        <meshStandardMaterial color={cor} flatShading roughness={1} emissive="#1c2438" />
      </mesh>
    ))}
  </group>
);

export type PropsArvore = PropsTransformacao & {
  tipo?: 'pinheiro' | 'redonda';
  cor?: string;
  corTronco?: string;
};

export const Arvore: React.FC<PropsArvore> = ({
  tipo = 'pinheiro',
  cor = '#2f9e57',
  corTronco = '#6b4429',
  posicao,
  rotacao,
  escala = 1,
}) => {
  const copas: Array<{pos: Vec3; r: number; h: number}> =
    tipo === 'pinheiro'
      ? [
          {pos: [0, 0.78, 0], r: 0.55, h: 0.7},
          {pos: [0, 1.12, 0], r: 0.44, h: 0.6},
          {pos: [0, 1.42, 0], r: 0.31, h: 0.5},
        ]
      : [];
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.09, 0.12, 0.6, 6]} />
        <meshStandardMaterial color={corTronco} flatShading roughness={0.9} />
      </mesh>
      {tipo === 'pinheiro' ? (
        copas.map((c, i) => (
          <mesh key={i} position={c.pos} castShadow receiveShadow>
            <coneGeometry args={[c.r, c.h, 7]} />
            <meshStandardMaterial color={cor} flatShading roughness={0.85} />
          </mesh>
        ))
      ) : (
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial color={cor} flatShading roughness={0.85} />
        </mesh>
      )}
    </group>
  );
};

// Pedra low-poly. Cada semente dá um formato diferente.
export const Pedra: React.FC<PropsTransformacao & {cor?: string; semente?: string}> = ({
  cor = '#6b6f7a',
  semente = 'pedra',
  posicao,
  rotacao,
  escala = 1,
}) => (
  <group position={posicao} rotation={rotacao} scale={escala}>
    <mesh
      position-y={0.18}
      rotation={[random(`${semente}-a`) * 3, random(`${semente}-b`) * 3, 0]}
      scale={[1 + random(`${semente}-x`) * 0.5, 0.65 + random(`${semente}-y`) * 0.3, 1 + random(`${semente}-z`) * 0.4]}
      castShadow
      receiveShadow
    >
      <dodecahedronGeometry args={[0.26, 0]} />
      <meshStandardMaterial color={cor} flatShading roughness={0.95} />
    </mesh>
  </group>
);

// Passarinho low-poly batendo asas (voando para +X). Mova a `posicao` para fazê-lo atravessar a cena.
export const Passaro: React.FC<PropsTransformacao & {cor?: string; semente?: string}> = ({
  cor = '#1d2233',
  semente = 'passaro',
  posicao,
  rotacao,
  escala = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const asa = Math.sin((frame / fps) * 11 + random(semente) * 6) * 0.7;
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.05, 0.24, 5]} />
        <meshStandardMaterial color={cor} flatShading />
      </mesh>
      {([-1, 1] as const).map((lado) => (
        <group key={lado} rotation={[lado * asa, 0, 0]}>
          <mesh position={[0, 0, lado * 0.14]}>
            <boxGeometry args={[0.12, 0.01, 0.26]} />
            <meshStandardMaterial color={cor} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
};
