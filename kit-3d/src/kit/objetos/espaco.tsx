import {noise3D} from '@remotion/noise';
import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {AdditiveBlending, BackSide, BufferAttribute, Color, DoubleSide, IcosahedronGeometry} from 'three';
import {texturaBrilho} from '../texturas';
import type {PropsTransformacao} from './Animado';

// Pinta cada face de um icosaedro (visual low-poly) com uma função de cor.
const icosaedroColorido = (
  raio: number,
  detalhe: number,
  corDaFace: (x: number, y: number, z: number) => Color,
): IcosahedronGeometry => {
  const g = new IcosahedronGeometry(raio, detalhe);
  const pos = g.getAttribute('position');
  const cores = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i += 3) {
    const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3 / raio;
    const cy = (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3 / raio;
    const cz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3 / raio;
    const c = corDaFace(cx, cy, cz);
    for (let k = 0; k < 3; k++) {
      cores[(i + k) * 3] = c.r;
      cores[(i + k) * 3 + 1] = c.g;
      cores[(i + k) * 3 + 2] = c.b;
    }
  }
  g.setAttribute('color', new BufferAttribute(cores, 3));
  return g;
};

export type PropsGlobo = PropsTransformacao & {
  raio?: number;
  // Rotação em radianos por segundo.
  girar?: number;
  detalhe?: number;
  semente?: string;
  atmosfera?: boolean;
};

// Planeta Terra low-poly com oceanos, continentes, gelo nos polos e atmosfera.
export const Globo: React.FC<PropsGlobo> = ({
  raio = 1,
  girar = 0.25,
  detalhe = 3,
  semente = 'terra',
  atmosfera = true,
  posicao,
  rotacao,
  escala = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const geometria = useMemo(() => {
    const oceano = new Color('#1d5fc4');
    const raso = new Color('#2f86e0');
    const terra = new Color('#3aa655');
    const mata = new Color('#2a8a48');
    const deserto = new Color('#d1aa62');
    const gelo = new Color('#eef6ff');
    return icosaedroColorido(raio, detalhe, (x, y, z) => {
      const n = noise3D(semente, x * 1.5, y * 1.5, z * 1.5) + 0.45 * noise3D(`${semente}-2`, x * 3.2, y * 3.2, z * 3.2);
      const lat = Math.abs(y);
      if (lat > 0.86) {
        return gelo;
      }
      if (n > 0.16) {
        if (lat < 0.4 && noise3D(`${semente}-d`, x * 2, y * 2, z * 2) > 0.25) {
          return deserto;
        }
        return n > 0.5 ? mata : terra;
      }
      return n > -0.05 ? raso : oceano;
    });
  }, [raio, detalhe, semente]);
  const brilho = useMemo(() => texturaBrilho(), []);

  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <group rotation={[0, 0, 0.41]}>
        <mesh geometry={geometria} rotation={[0, (frame / fps) * girar, 0]} castShadow receiveShadow>
          <meshStandardMaterial vertexColors flatShading roughness={0.85} />
        </mesh>
      </group>
      {atmosfera ? (
        <>
          <mesh scale={1.07}>
            <icosahedronGeometry args={[raio, 3]} />
            <meshBasicMaterial
              color="#5fb4ff"
              transparent
              opacity={0.16}
              side={BackSide}
              depthWrite={false}
              blending={AdditiveBlending}
            />
          </mesh>
          <sprite scale={raio * 3.4}>
            <spriteMaterial
              map={brilho}
              color="#3d8bff"
              transparent
              opacity={0.45}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        </>
      ) : null}
    </group>
  );
};

export type PropsSol = PropsTransformacao & {
  raio?: number;
  cor?: string;
  // Cor do brilho e do halo (ex.: azulado para o Sol visto de Marte).
  corBrilho?: string;
  raios?: boolean;
  // Tamanho do halo (1 = normal).
  brilho?: number;
  // Emite luz de verdade na cena (ilumina objetos próximos).
  luz?: boolean;
};

export const Sol: React.FC<PropsSol> = ({
  raio = 0.8,
  cor = '#ffc23a',
  corBrilho = '#ff9a1a',
  raios = true,
  brilho = 1,
  luz = false,
  posicao,
  rotacao,
  escala = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const halo = useMemo(() => texturaBrilho(), []);
  const pulso = 1 + Math.sin(t * 3) * 0.03;

  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <mesh scale={pulso} rotation={[t * 0.2, t * 0.3, 0]}>
        <icosahedronGeometry args={[raio, 1]} />
        <meshStandardMaterial color={cor} emissive={corBrilho} emissiveIntensity={1.5} flatShading fog={false} />
      </mesh>
      {raios
        ? Array.from({length: 12}, (_, i) => {
            const a = (i / 12) * Math.PI * 2 + t * 0.25;
            const d = raio * (1.5 + Math.sin(t * 4 + i) * 0.06);
            return (
              <mesh key={i} position={[Math.cos(a) * d, Math.sin(a) * d, 0]} rotation={[0, 0, a - Math.PI / 2]}>
                <coneGeometry args={[raio * 0.15, raio * 0.45, 4]} />
                <meshStandardMaterial color={cor} emissive={corBrilho} emissiveIntensity={1.3} flatShading fog={false} />
              </mesh>
            );
          })
        : null}
      <sprite scale={raio * 6 * brilho}>
        <spriteMaterial map={halo} color={corBrilho} transparent opacity={0.85} blending={AdditiveBlending} depthWrite={false} fog={false} />
      </sprite>
      {luz ? <pointLight intensity={3} decay={0} color="#ffd59a" /> : null}
    </group>
  );
};

export type PropsPlaneta = PropsTransformacao & {
  raio?: number;
  cor?: string;
  corSecundaria?: string;
  // "faixas" (Júpiter, Saturno) ou "manchas" (Lua, Marte).
  estilo?: 'faixas' | 'manchas';
  // Cor do anel, ou false.
  anel?: string | false;
  girar?: number;
  detalhe?: number;
  semente?: string;
};

export const Planeta: React.FC<PropsPlaneta> = ({
  raio = 1,
  cor = '#c98b5b',
  corSecundaria = '#e8c08a',
  estilo = 'faixas',
  anel = false,
  girar = 0.2,
  detalhe = 2,
  semente = 'planeta',
  posicao,
  rotacao,
  escala = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const geometria = useMemo(() => {
    const a = new Color(cor);
    const b = new Color(corSecundaria);
    return icosaedroColorido(raio, detalhe, (x, y, z) => {
      const n = noise3D(semente, x * 2, y * 2, z * 2);
      const k =
        estilo === 'faixas'
          ? Math.round((Math.sin(y * 9 + n * 1.2) * 0.5 + 0.5) * 3) / 3
          : n > 0.2
            ? 1
            : n > -0.2
              ? 0.4
              : 0;
      return a.clone().lerp(b, k);
    });
  }, [raio, detalhe, cor, corSecundaria, estilo, semente]);

  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <mesh geometry={geometria} rotation={[0, (frame / fps) * girar, 0]} castShadow receiveShadow>
        <meshStandardMaterial vertexColors flatShading roughness={0.9} />
      </mesh>
      {anel ? (
        <mesh rotation={[-Math.PI / 2 + 0.45, 0, 0.2]}>
          <ringGeometry args={[raio * 1.35, raio * 2.1, 48, 1]} />
          <meshStandardMaterial color={anel} side={DoubleSide} transparent opacity={0.8} flatShading roughness={0.8} />
        </mesh>
      ) : null}
    </group>
  );
};
