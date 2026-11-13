import React, {useEffect, useMemo} from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {AdditiveBlending, Quaternion, TorusGeometry, Vector3} from 'three';
import {texturaBrilho} from '../texturas';
import {COR, type Vec3} from '../tema';
import type {PropsTransformacao} from './Animado';

const ELEMENTOS = {
  N: {cor: '#4d7cff', raio: 0.16},
  O: {cor: '#ff5050', raio: 0.15},
  H: {cor: '#f4f6fb', raio: 0.1},
  C: {cor: '#3a3f4b', raio: 0.17},
} as const;

type Atomo = [keyof typeof ELEMENTOS, Vec3];

// O primeiro átomo é o central: as ligações saem dele para os demais.
const FORMULAS: Record<'N2' | 'O2' | 'H2O' | 'CO2', Atomo[]> = {
  N2: [
    ['N', [-0.15, 0, 0]],
    ['N', [0.15, 0, 0]],
  ],
  O2: [
    ['O', [-0.14, 0, 0]],
    ['O', [0.14, 0, 0]],
  ],
  H2O: [
    ['O', [0, 0, 0]],
    ['H', [-0.19, -0.14, 0]],
    ['H', [0.19, -0.14, 0]],
  ],
  CO2: [
    ['C', [0, 0, 0]],
    ['O', [-0.3, 0, 0]],
    ['O', [0.3, 0, 0]],
  ],
};

const EIXO_Y = new Vector3(0, 1, 0);

// Molécula de bolinhas (N₂, O₂, H₂O, CO₂). Gire com <Animado girar>.
export const Molecula: React.FC<PropsTransformacao & {formula?: keyof typeof FORMULAS}> = ({
  formula = 'N2',
  posicao,
  rotacao,
  escala = 1,
}) => {
  const atomos = FORMULAS[formula];
  const ligacoes = atomos.slice(1).map(([, p]) => {
    const a = new Vector3(...atomos[0][1]);
    const b = new Vector3(...p);
    const d = b.clone().sub(a);
    return {
      meio: a.clone().add(b).multiplyScalar(0.5),
      giro: new Quaternion().setFromUnitVectors(EIXO_Y, d.clone().normalize()),
      comprimento: d.length(),
    };
  });
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      {atomos.map(([elemento, p], i) => (
        <mesh key={i} position={p} castShadow>
          <icosahedronGeometry args={[ELEMENTOS[elemento].raio, 1]} />
          <meshStandardMaterial
            color={ELEMENTOS[elemento].cor}
            emissive={ELEMENTOS[elemento].cor}
            emissiveIntensity={0.25}
            flatShading
            roughness={0.35}
          />
        </mesh>
      ))}
      {ligacoes.map((l, i) => (
        <mesh key={i} position={l.meio} quaternion={l.giro}>
          <cylinderGeometry args={[0.035, 0.035, l.comprimento, 6]} />
          <meshStandardMaterial color="#c9d1e6" flatShading />
        </mesh>
      ))}
    </group>
  );
};

export type PropsOlho = PropsTransformacao & {
  corIris?: string;
  // -1 a 1. Sem valor, o olho passeia o olhar sozinho.
  olharX?: number;
  olharY?: number;
  piscar?: boolean;
};

// Abertura do olho em cada quadro de uma piscada: fecha rápido, segura e abre devagar.
const PISCADA = [0.5, 0.08, 0.08, 0.35, 0.75];

// Olho grande e expressivo (visão, percepção, "repare...").
export const Olho: React.FC<PropsOlho> = ({corIris = COR.azul, olharX, olharY, piscar = true, posicao, rotacao, escala = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const x = olharX ?? Math.sin(t * 0.8) * 0.5;
  const y = olharY ?? Math.sin(t * 0.55 + 1) * 0.3;
  // Pisca a cada 3 s: a pálpebra fecha e abre em curva (5 quadros), sem saltar num quadro só.
  const cicloQ = Math.round(3 * fps);
  const qPiscada = (Math.floor(frame + random('olho') * cicloQ) % cicloQ) - (cicloQ - PISCADA.length);
  const fechado = piscar && qPiscada >= 0 ? PISCADA[qPiscada] : 1;
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <group scale={[1, fechado, 1]}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.5, 2]} />
          <meshStandardMaterial color="#f3f4f8" flatShading roughness={0.3} />
        </mesh>
        <group rotation={[-y * 0.5, x * 0.6, 0]}>
          <mesh position={[0, 0, 0.47]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.21, 0.21, 0.05, 20]} />
            <meshStandardMaterial color={corIris} emissive={corIris} emissiveIntensity={0.3} flatShading />
          </mesh>
          <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.03, 16]} />
            <meshStandardMaterial color="#0b0b10" roughness={0.2} />
          </mesh>
          <mesh position={[0.07, 0.08, 0.52]}>
            <sphereGeometry args={[0.035, 8, 6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// Lâmpada (ideia, eletricidade). `acesa` de 0 a 1 para acender aos poucos.
// `halo={false}` tira o brilho em volta (necessário em fundo transparente).
export const Lampada: React.FC<PropsTransformacao & {acesa?: number; cor?: string; halo?: boolean}> = ({
  acesa = 1,
  cor = '#ffd25a',
  halo = true,
  posicao,
  rotacao,
  escala = 1,
}) => {
  const brilho = useMemo(() => texturaBrilho(), []);
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <mesh position-y={0.62}>
        <icosahedronGeometry args={[0.4, 2]} />
        <meshStandardMaterial
          color="#fff6d8"
          emissive={cor}
          emissiveIntensity={acesa * 1.4}
          transparent
          opacity={0.55 + acesa * 0.3}
          flatShading
          roughness={0.1}
        />
      </mesh>
      <mesh position-y={0.26}>
        <cylinderGeometry args={[0.2, 0.15, 0.22, 10]} />
        <meshStandardMaterial color="#fff6d8" emissive={cor} emissiveIntensity={acesa * 0.8} transparent opacity={0.7} flatShading />
      </mesh>
      {[0.1, 0.02, -0.06].map((y, i) => (
        <mesh key={i} position-y={y}>
          <cylinderGeometry args={[0.15, 0.15, 0.07, 10]} />
          <meshStandardMaterial color={i % 2 ? '#8d93a3' : '#b9bfcc'} metalness={0.6} roughness={0.35} flatShading />
        </mesh>
      ))}
      {halo && acesa > 0.01 ? (
        <sprite position-y={0.62} scale={2.4 * acesa}>
          <spriteMaterial map={brilho} color={cor} transparent opacity={0.8 * acesa} blending={AdditiveBlending} depthWrite={false} />
        </sprite>
      ) : null}
    </group>
  );
};

// Lupa (olhar de perto, investigar).
export const Lupa: React.FC<PropsTransformacao & {cor?: string}> = ({cor = '#2b3245', posicao, rotacao, escala = 1}) => (
  <group position={posicao} rotation={rotacao} scale={escala}>
    <mesh castShadow>
      <torusGeometry args={[0.4, 0.06, 8, 28]} />
      <meshStandardMaterial color={cor} metalness={0.5} roughness={0.35} flatShading />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.38, 0.38, 0.03, 28]} />
      <meshStandardMaterial color="#cfeeff" transparent opacity={0.3} roughness={0.05} />
    </mesh>
    <mesh position={[0.43, -0.43, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
      <cylinderGeometry args={[0.06, 0.07, 0.6, 8]} />
      <meshStandardMaterial color="#6b4429" flatShading roughness={0.7} />
    </mesh>
  </group>
);

// Livro fechado (deitado) ou aberto.
export const Livro: React.FC<PropsTransformacao & {cor?: string; aberto?: boolean}> = ({
  cor = COR.vermelho,
  aberto = false,
  posicao,
  rotacao,
  escala = 1,
}) => (
  <group position={posicao} rotation={rotacao} scale={escala}>
    {aberto ? (
      ([-1, 1] as const).map((lado) => (
        <group key={lado} rotation={[0, 0, lado * -0.22]}>
          <mesh position={[lado * 0.27, 0.015, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.54, 0.03, 0.74]} />
            <meshStandardMaterial color={cor} flatShading roughness={0.7} />
          </mesh>
          <mesh position={[lado * 0.25, 0.06, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.06, 0.68]} />
            <meshStandardMaterial color="#f4efe2" flatShading roughness={0.9} />
          </mesh>
        </group>
      ))
    ) : (
      <>
        <mesh position-y={0.07} castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.14, 0.96]} />
          <meshStandardMaterial color={cor} flatShading roughness={0.7} />
        </mesh>
        <mesh position={[0.03, 0.07, 0]} castShadow>
          <boxGeometry args={[0.68, 0.11, 0.92]} />
          <meshStandardMaterial color="#f4efe2" flatShading roughness={0.9} />
        </mesh>
      </>
    )}
  </group>
);

export const CORES_ARCO_IRIS = ['#ff3b3b', '#ff8a1f', '#ffe12e', '#3ddc6a', '#2f7dff', '#8b4dff'];

// Arco-íris em arco (base em y=0). `progresso` desenha o arco da esquerda para a direita.
export const ArcoIris: React.FC<PropsTransformacao & {raio?: number; espessura?: number; progresso?: number; opacidade?: number}> = ({
  raio = 1.6,
  espessura = 0.1,
  progresso = 1,
  opacidade = 0.9,
  posicao,
  rotacao,
  escala = 1,
}) => {
  const arco = Math.max(0.001, Math.min(1, progresso)) * Math.PI;
  const geometrias = useMemo(
    () => CORES_ARCO_IRIS.map((_, i) => new TorusGeometry(raio - i * espessura, espessura / 2, 6, 48, arco)),
    [raio, espessura, arco],
  );
  useEffect(() => () => geometrias.forEach((g) => g.dispose()), [geometrias]);
  if (progresso <= 0.001) {
    return null;
  }
  return (
    // Gira 180° em Y para o arco nascer na esquerda e subir.
    <group position={posicao} rotation={rotacao} scale={escala}>
      <group rotation={[0, Math.PI, 0]}>
        {geometrias.map((g, i) => (
          <mesh key={i} geometry={g}>
            <meshBasicMaterial color={CORES_ARCO_IRIS[i]} toneMapped={false} transparent opacity={opacidade} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
