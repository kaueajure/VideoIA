// Objetos de futebol: bola, gol e pé (para mostrar peito × externa na trivela).
import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Quaternion, Vector3} from 'three';
import type {PropsTransformacao} from './Animado';

const MANCHAS: Array<[number, number, number]> = [
  [0.55, 0.35, 0.2],
  [-0.5, 0.4, 0.15],
  [0.15, -0.55, 0.25],
  [-0.25, 0.1, -0.58],
  [0.4, -0.2, -0.45],
  [-0.45, -0.35, 0.35],
];

const EIXO_Z = new Vector3(0, 0, 1);

// Bola low-poly. `girando` = radianos por segundo no eixo vertical (giro lateral da trivela).
export const BolaFutebol: React.FC<
  PropsTransformacao & {girando?: number; molhada?: boolean; raio?: number}
> = ({posicao, rotacao = [0, 0, 0], escala = 1, girando = 0, molhada = false, raio = 0.28}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const y = rotacao[1] + t * girando;
  const branca = molhada ? '#d4dce8' : '#f4f6fb';
  const preta = molhada ? '#2a3144' : '#151a28';
  const manchas = useMemo(
    () =>
      MANCHAS.map((p) => {
        const dir = new Vector3(p[0], p[1], p[2]).normalize();
        const quat = new Quaternion().setFromUnitVectors(EIXO_Z, dir);
        return {
          posicao: [dir.x * raio * 1.06, dir.y * raio * 1.06, dir.z * raio * 1.06] as [number, number, number],
          quat,
        };
      }),
    [raio],
  );
  return (
    <group position={posicao} rotation={[rotacao[0], y, rotacao[2]]} scale={escala}>
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[raio, 1]} />
        <meshStandardMaterial color={branca} flatShading roughness={molhada ? 0.25 : 0.55} metalness={molhada ? 0.15 : 0} />
      </mesh>
      {manchas.map((m, i) => (
        <mesh key={i} position={m.posicao} quaternion={m.quat} castShadow>
          <circleGeometry args={[raio * 0.26, 5]} />
          <meshStandardMaterial
            color={preta}
            flatShading
            roughness={0.8}
            depthWrite
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>
      ))}
      {molhada ? (
        <mesh scale={1.04}>
          <icosahedronGeometry args={[raio, 1]} />
          <meshStandardMaterial color="#8ec8ff" transparent opacity={0.22} roughness={0.15} metalness={0.2} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  );
};

// Trave vista de frente (abertura para a câmera). Base no chão em y=0.
export const Gol: React.FC<PropsTransformacao & {largura?: number; altura?: number}> = ({
  posicao,
  rotacao,
  escala = 1,
  largura = 2.4,
  altura = 1.35,
}) => {
  const meio = largura / 2;
  const poste = 0.07;
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <mesh position={[-meio, altura / 2, 0]} castShadow>
        <boxGeometry args={[poste, altura, poste]} />
        <meshStandardMaterial color="#eef2ff" flatShading />
      </mesh>
      <mesh position={[meio, altura / 2, 0]} castShadow>
        <boxGeometry args={[poste, altura, poste]} />
        <meshStandardMaterial color="#eef2ff" flatShading />
      </mesh>
      <mesh position={[0, altura, 0]} castShadow>
        <boxGeometry args={[largura + poste, poste, poste]} />
        <meshStandardMaterial color="#eef2ff" flatShading />
      </mesh>
      <mesh position={[0, altura / 2, -0.4]}>
        <boxGeometry args={[largura * 0.96, altura * 0.92, 0.02]} />
        <meshStandardMaterial color="#9aa6c4" transparent opacity={0.18} flatShading depthWrite={false} />
      </mesh>
    </group>
  );
};

// Pé estilizado (chuteira) para comparar peito × parte externa. Aponta para +Z.
export const PeChute: React.FC<
  PropsTransformacao & {lado?: 'interno' | 'externo'; cor?: string}
> = ({posicao, rotacao, escala = 1, lado = 'interno', cor = '#1e6b3a'}) => {
  const inclinacao = lado === 'interno' ? 0.35 : -0.55;
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <group rotation={[0.15, inclinacao, 0]}>
        <mesh position={[0, 0.08, 0.05]} castShadow>
          <boxGeometry args={[0.22, 0.12, 0.42]} />
          <meshStandardMaterial color={cor} flatShading roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.1, 0.28]} castShadow>
          <boxGeometry args={[0.2, 0.1, 0.16]} />
          <meshStandardMaterial color={cor} flatShading />
        </mesh>
        <mesh position={[lado === 'interno' ? 0.08 : -0.08, 0.12, 0.12]} castShadow>
          <boxGeometry args={[0.08, 0.06, 0.22]} />
          <meshStandardMaterial color="#ffd23f" emissive="#ffd23f" emissiveIntensity={0.4} flatShading />
        </mesh>
      </group>
    </group>
  );
};

// Faixa de gramado com linhas. Use sob a bola/gol (não substitui o chão do Palco).
export const FaixaCampo: React.FC<PropsTransformacao & {largura?: number; profundidade?: number}> = ({
  posicao = [0, 0.04, 0],
  rotacao,
  escala = 1,
  largura = 3.2,
  profundidade = 4.5,
}) => (
  <group position={posicao} rotation={rotacao} scale={escala}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
      <planeGeometry args={[largura, profundidade]} />
      <meshStandardMaterial color="#1f6b3a" flatShading roughness={0.9} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
    </mesh>
    <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.06, profundidade * 0.9]} />
      <meshBasicMaterial color="#eef2ff" toneMapped={false} depthWrite={false} />
    </mesh>
    <mesh position={[0, 0.02, profundidade * 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.35, 0.42, 24]} />
      <meshBasicMaterial color="#eef2ff" toneMapped={false} depthWrite={false} />
    </mesh>
  </group>
);
