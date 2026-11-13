import React from 'react';
import {random} from 'remotion';
import type {PropsTransformacao} from './Animado';

// Montanha low-poly (base em y=0), com ou sem neve no pico.
export const Montanha: React.FC<PropsTransformacao & {altura?: number; raio?: number; cor?: string; neve?: boolean}> = ({
  altura = 2.2,
  raio = 1.6,
  cor = '#4b6a5a',
  neve = true,
  posicao,
  rotacao,
  escala = 1,
}) => (
  <group position={posicao} rotation={rotacao} scale={escala}>
    <mesh position-y={altura / 2} castShadow receiveShadow>
      <coneGeometry args={[raio, altura, 6]} />
      <meshStandardMaterial color={cor} flatShading roughness={0.95} />
    </mesh>
    {neve ? (
      // Um pouco para fora da montanha: na mesma superfície, as duas piscariam (z-fighting).
      <mesh position-y={altura * 0.84}>
        <coneGeometry args={[raio * 0.33 * 1.06, altura * 0.33 * 1.03, 6]} />
        <meshStandardMaterial color="#eef3ff" flatShading roughness={0.9} />
      </mesh>
    ) : null}
  </group>
);

// Casinha (base em y=0, mede ~1,5 de altura). Janelas acesas brilham à noite.
export const Casa: React.FC<
  PropsTransformacao & {corParede?: string; corTelhado?: string; janelasAcesas?: boolean}
> = ({corParede = '#e8dcc8', corTelhado = '#c0503a', janelasAcesas = false, posicao, rotacao, escala = 1}) => {
  const janela = janelasAcesas ? '#ffd36b' : '#7fb2e6';
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <mesh position-y={0.4} castShadow receiveShadow>
        <boxGeometry args={[1, 0.8, 0.9]} />
        <meshStandardMaterial color={corParede} flatShading roughness={0.85} />
      </mesh>
      <mesh position-y={0.986} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 0.6]} castShadow>
        <cylinderGeometry args={[0.66, 0.66, 1.0, 3]} />
        <meshStandardMaterial color={corTelhado} flatShading roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.2, 0.455]}>
        <boxGeometry args={[0.22, 0.4, 0.02]} />
        <meshStandardMaterial color="#6b4429" flatShading />
      </mesh>
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, 0.5, 0.455]}>
          <boxGeometry args={[0.2, 0.18, 0.02]} />
          <meshStandardMaterial color={janela} emissive={janela} emissiveIntensity={janelasAcesas ? 1.2 : 0.15} />
        </mesh>
      ))}
    </group>
  );
};

// Prédio (base em y=0) com janelas; parte delas acesas.
export const Predio: React.FC<
  PropsTransformacao & {andares?: number; cor?: string; acesas?: number; semente?: string}
> = ({andares = 6, cor = '#2b3550', acesas = 0.45, semente = 'predio', posicao, rotacao, escala = 1}) => {
  const altura = andares * 0.36 + 0.1;
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <mesh position-y={altura / 2} castShadow receiveShadow>
        <boxGeometry args={[0.85, altura, 0.8]} />
        <meshStandardMaterial color={cor} flatShading roughness={0.7} />
      </mesh>
      {Array.from({length: andares}, (_, andar) =>
        [-0.24, 0, 0.24].map((x, coluna) => {
          const acesa = random(`${semente}-${andar}-${coluna}`) < acesas;
          return (
            <mesh key={`${andar}-${coluna}`} position={[x, 0.26 + andar * 0.36, 0.405]}>
              <boxGeometry args={[0.14, 0.17, 0.01]} />
              <meshStandardMaterial
                color={acesa ? '#ffd36b' : '#1a2133'}
                emissive={acesa ? '#ffc23a' : '#000000'}
                emissiveIntensity={acesa ? 1.1 : 0}
              />
            </mesh>
          );
        }),
      )}
    </group>
  );
};
