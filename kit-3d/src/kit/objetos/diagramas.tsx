import React, {useEffect, useLayoutEffect, useMemo, useRef} from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  AdditiveBlending,
  Color,
  Curve,
  InstancedMesh,
  Object3D,
  Quaternion,
  TubeGeometry,
  Vector3,
} from 'three';
import {COR, type Vec3} from '../tema';
import type {PropsTransformacao} from './Animado';

const EIXO_Y = new Vector3(0, 1, 0);

const orientar = (de: Vec3, para: Vec3) => {
  const a = new Vector3(...de);
  const b = new Vector3(...para);
  const direcao = b.clone().sub(a);
  const comprimento = direcao.length();
  const quaternion =
    comprimento > 0 ? new Quaternion().setFromUnitVectors(EIXO_Y, direcao.normalize()) : new Quaternion();
  return {quaternion, comprimento};
};

const limitar01 = (v: number) => Math.min(1, Math.max(0, v));

export type PropsSeta = {
  de: Vec3;
  para: Vec3;
  // 0 a 1: quanto da seta já foi "desenhado". Anime com progresso()/suave().
  progresso?: number;
  cor?: string;
  espessura?: number;
};

// Seta 3D de um ponto a outro que pode crescer (progresso 0 -> 1).
export const Seta: React.FC<PropsSeta> = ({de, para, progresso = 1, cor = COR.destaque, espessura = 0.05}) => {
  const {quaternion, comprimento} = useMemo(() => orientar(de, para), [de, para]);
  const total = comprimento * limitar01(progresso);
  if (total < 0.001) {
    return null;
  }
  const cabeca = Math.min(espessura * 5, total);
  const haste = Math.max(total - cabeca, 0.0001);
  return (
    <group position={de} quaternion={quaternion}>
      <mesh position-y={haste / 2} scale={[1, haste, 1]} castShadow>
        <cylinderGeometry args={[espessura, espessura, 1, 8]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.35} flatShading />
      </mesh>
      <mesh position-y={haste + cabeca / 2} scale={[1, cabeca / (espessura * 5), 1]} castShadow>
        <coneGeometry args={[espessura * 2.6, espessura * 5, 10]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.35} flatShading />
      </mesh>
    </group>
  );
};

export type PropsFeixe = {
  de: Vec3;
  para: Vec3;
  progresso?: number;
  cor?: string;
  espessura?: number;
  // Bolinhas de luz viajando pelo feixe (fótons, sinais, dados...).
  pulsos?: number;
  // Velocidade dos pulsos (percursos por segundo).
  velocidade?: number;
};

// Raio de luz brilhante de um ponto a outro.
export const Feixe: React.FC<PropsFeixe> = ({
  de,
  para,
  progresso = 1,
  cor = COR.destaque,
  espessura = 0.035,
  pulsos = 0,
  velocidade = 0.6,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {quaternion, comprimento} = useMemo(() => orientar(de, para), [de, para]);
  const total = comprimento * limitar01(progresso);
  if (total < 0.001) {
    return null;
  }
  const t = frame / fps;
  return (
    <group position={de} quaternion={quaternion}>
      <mesh position-y={total / 2} scale={[1, total, 1]}>
        <cylinderGeometry args={[espessura, espessura, 1, 10]} />
        <meshBasicMaterial color={cor} toneMapped={false} />
      </mesh>
      {/* brilho: tampas no plano das do núcleo; o polygonOffset o põe sempre à frente (sem piscar) */}
      <mesh position-y={total / 2} scale={[1, total, 1]}>
        <cylinderGeometry args={[espessura * 3.2, espessura * 3.2, 1, 16]} />
        <meshBasicMaterial
          color={cor}
          transparent
          opacity={0.22}
          blending={AdditiveBlending}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>
      {Array.from({length: pulsos}, (_, i) => {
        const u = (t * velocidade + i / pulsos) % 1;
        const y = u * comprimento;
        if (y > total) {
          return null;
        }
        // Cresce ao sair da ponta e encolhe ao chegar (sem pular do fim para o começo num quadro só).
        const s = Math.max(0.001, Math.min(1, u * 8, (1 - u) * 8));
        return (
          <mesh key={i} position-y={y} scale={s}>
            <icosahedronGeometry args={[espessura * 1.6, 1]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

class CurvaOnda extends Curve<Vector3> {
  constructor(
    private comprimento: number,
    private amplitude: number,
    private comprimentoDeOnda: number,
    private fase: number,
  ) {
    super();
  }
  getPoint(u: number, alvo = new Vector3()): Vector3 {
    const x = u * this.comprimento;
    return alvo.set(x, this.amplitude * Math.sin((2 * Math.PI * x) / this.comprimentoDeOnda - this.fase), 0);
  }
}

export type PropsOnda = PropsTransformacao & {
  // Comprimento total desenhado (unidades 3D), a partir da origem para +X.
  comprimento?: number;
  amplitude?: number;
  // Distância entre duas cristas. Menor = onda "mais curta" (azul); maior = "mais longa" (vermelho).
  comprimentoDeOnda?: number;
  // Ciclos por segundo da onda andando.
  velocidade?: number;
  progresso?: number;
  cor?: string;
  espessura?: number;
  // 0 a 1 (para apagar ou destacar uma onda entre várias).
  opacidade?: number;
};

// Onda senoidal em 3D que anda no tempo. Ótima para luz, som, sinais.
export const Onda: React.FC<PropsOnda> = ({
  comprimento = 3,
  amplitude = 0.25,
  comprimentoDeOnda = 0.8,
  velocidade = 1,
  progresso = 1,
  cor = COR.ciano,
  espessura = 0.03,
  opacidade = 1,
  posicao,
  rotacao,
  escala = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fase = (frame / fps) * velocidade * Math.PI * 2;
  const desenhado = comprimento * limitar01(progresso);
  const geometria = useMemo(() => {
    if (desenhado < 0.01) {
      return null;
    }
    const segmentos = Math.max(8, Math.round((desenhado / comprimentoDeOnda) * 40));
    return new TubeGeometry(new CurvaOnda(desenhado, amplitude, comprimentoDeOnda, fase), segmentos, espessura, 6, false);
  }, [desenhado, amplitude, comprimentoDeOnda, fase, espessura]);
  useEffect(() => () => geometria?.dispose(), [geometria]);

  if (!geometria || opacidade <= 0.01) {
    return null;
  }
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <mesh geometry={geometria}>
        <meshBasicMaterial color={cor} toneMapped={false} transparent={opacidade < 1} opacity={opacidade} />
      </mesh>
      {/* brilho: o mesmo tubo esticado em z coincide com o de cima e de baixo do núcleo; o polygonOffset o põe
          sempre à frente nesses trechos (sem ele, o brilho entra e sai de quadro em quadro) */}
      <mesh geometry={geometria} scale={[1, 1, 3]}>
        <meshBasicMaterial
          color={cor}
          transparent
          opacity={0.2 * opacidade}
          blending={AdditiveBlending}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>
    </group>
  );
};

export type PropsParticulas = PropsTransformacao & {
  quantidade?: number;
  // Tamanho da caixa onde as partículas ficam [largura, altura, profundidade].
  area?: Vec3;
  tamanho?: number;
  cores?: string[];
  // Quão rápido cada partícula balança.
  velocidade?: number;
  // Quanto cada partícula se afasta da posição base.
  agitacao?: number;
  // Brilho próprio (não depende de luz).
  brilhar?: boolean;
  // 0 a 1. Abaixo de 1 vira "poeira" translúcida.
  opacidade?: number;
  semente?: string;
};

// Nuvem de partículas (moléculas, poeira, estrelas, células...). Determinística.
export const Particulas: React.FC<PropsParticulas> = ({
  quantidade = 80,
  area = [4, 3, 2],
  tamanho = 0.06,
  cores = [COR.branco],
  velocidade = 1,
  agitacao = 0.15,
  brilhar = false,
  opacidade = 1,
  semente = 'particulas',
  posicao,
  rotacao,
  escala = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ref = useRef<InstancedMesh>(null);
  const auxiliar = useMemo(() => new Object3D(), []);
  // Chaves em texto: arrays passados inline mudam de identidade a cada quadro.
  const chaveArea = area.join(',');
  const chaveCores = cores.join(',');
  const dados = useMemo(
    () =>
      Array.from({length: quantidade}, (_, i) => ({
        base: [
          (random(`${semente}-x-${i}`) - 0.5) * area[0],
          (random(`${semente}-y-${i}`) - 0.5) * area[1],
          (random(`${semente}-z-${i}`) - 0.5) * area[2],
        ] as Vec3,
        fase: random(`${semente}-f-${i}`) * Math.PI * 2,
        escala: 0.6 + random(`${semente}-s-${i}`) * 0.8,
        cor: cores[Math.floor(random(`${semente}-c-${i}`) * cores.length) % cores.length],
      })),
    [quantidade, chaveArea, chaveCores, semente],
  );

  useLayoutEffect(() => {
    const malha = ref.current;
    if (!malha) {
      return;
    }
    const cor = new Color();
    dados.forEach((d, i) => malha.setColorAt(i, cor.set(d.cor)));
    if (malha.instanceColor) {
      malha.instanceColor.needsUpdate = true;
    }
  }, [dados]);

  useLayoutEffect(() => {
    const malha = ref.current;
    if (!malha) {
      return;
    }
    const t = (frame / fps) * velocidade;
    dados.forEach((d, i) => {
      auxiliar.position.set(
        d.base[0] + Math.sin(t * 1.3 + d.fase) * agitacao,
        d.base[1] + Math.cos(t * 1.1 + d.fase * 1.7) * agitacao,
        d.base[2] + Math.sin(t * 0.9 + d.fase * 2.3) * agitacao * 0.6,
      );
      auxiliar.scale.setScalar(tamanho * d.escala);
      auxiliar.updateMatrix();
      malha.setMatrixAt(i, auxiliar.matrix);
    });
    malha.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <instancedMesh ref={ref} args={[undefined, undefined, quantidade]} frustumCulled={false} castShadow={!brilhar}>
        <icosahedronGeometry args={[1, 1]} />
        {brilhar ? (
          <meshBasicMaterial color="#ffffff" toneMapped={false} transparent={opacidade < 1} opacity={opacidade} depthWrite={opacidade >= 1} />
        ) : (
          <meshStandardMaterial color="#ffffff" flatShading roughness={0.5} transparent={opacidade < 1} opacity={opacidade} />
        )}
      </instancedMesh>
    </group>
  );
};
