import {noise2D} from '@remotion/noise';
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {COR} from '../tema';
import type {PropsTransformacao} from './Animado';

// Foguete (base do corpo em y=0, aponta para +Y). `motor` liga a chama.
export const Foguete: React.FC<PropsTransformacao & {cor?: string; motor?: boolean}> = ({
  cor = COR.vermelho,
  motor = true,
  posicao,
  rotacao,
  escala = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Chama "respirando": ruído lento (cada variação leva ~10 quadros). Rápido demais, ela tremia de quadro em quadro.
  const chama = 1 + noise2D('chama', (frame / fps) * 3, 0) * 0.22;
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <mesh position-y={0.5} castShadow>
        <cylinderGeometry args={[0.22, 0.24, 1, 8]} />
        <meshStandardMaterial color="#eef1f7" flatShading roughness={0.5} />
      </mesh>
      <mesh position-y={1.22} castShadow>
        <coneGeometry args={[0.22, 0.45, 8]} />
        <meshStandardMaterial color={cor} flatShading roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.66, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 12]} />
        <meshStandardMaterial color="#5fb4ff" emissive="#3d8bff" emissiveIntensity={0.6} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
          {/* 5 mm acima da base do corpo: com os fundos no mesmo plano, aleta e corpo piscam vistos de baixo */}
          <mesh position={[0.26, 0.165, 0]} castShadow>
            <boxGeometry args={[0.18, 0.32, 0.03]} />
            <meshStandardMaterial color={cor} flatShading />
          </mesh>
        </group>
      ))}
      {motor ? (
        <group position-y={-0.02} scale={[1, chama, 1]}>
          <mesh position-y={-0.24} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.16, 0.48, 8]} />
            <meshBasicMaterial color="#ff8a1f" toneMapped={false} transparent opacity={0.9} />
          </mesh>
          <mesh position-y={-0.16} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.09, 0.3, 8]} />
            <meshBasicMaterial color="#ffe98a" toneMapped={false} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
};

// Robô explorador (tipo o Curiosity), de lado, andando para +X. Base em y=0.
export const Rover: React.FC<PropsTransformacao & {andando?: boolean}> = ({andando = false, posicao, rotacao, escala = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const giroRoda = andando ? -(frame / fps) * 3 : 0;
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <mesh position-y={0.38} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.24, 0.6]} />
        <meshStandardMaterial color="#d9cfb8" flatShading roughness={0.6} />
      </mesh>
      <mesh position-y={0.53}>
        <boxGeometry args={[0.98, 0.04, 0.66]} />
        <meshStandardMaterial color="#25345a" metalness={0.4} roughness={0.35} flatShading />
      </mesh>
      {[-0.32, 0, 0.32].flatMap((x) =>
        [-0.36, 0.36].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.13, z]} rotation={[Math.PI / 2, giroRoda, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.13, 0.1, 10]} />
            <meshStandardMaterial color="#2a2d36" flatShading roughness={0.9} />
          </mesh>
        )),
      )}
      <mesh position={[0.3, 0.8, 0.15]}>
        <cylinderGeometry args={[0.025, 0.025, 0.5, 6]} />
        <meshStandardMaterial color="#b9bfcc" metalness={0.5} />
      </mesh>
      <mesh position={[0.32, 1.08, 0.15]} castShadow>
        <boxGeometry args={[0.18, 0.11, 0.14]} />
        <meshStandardMaterial color="#d9cfb8" flatShading />
      </mesh>
      {[-0.035, 0.035].map((z) => (
        <mesh key={z} position={[0.42, 1.09, 0.15 + z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.02, 10]} />
          <meshStandardMaterial color="#14141c" />
        </mesh>
      ))}
    </group>
  );
};
