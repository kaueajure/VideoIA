// Objetos do dia a dia: tecnologia, mídia e símbolos (computador, celular, microfone,
// claquete, engrenagem, coração, moeda, relógio). Todos low-poly, base em y=0 quando ficam em pé.
import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {ExtrudeGeometry, Shape} from 'three';
import {COR} from '../tema';
import type {PropsTransformacao} from './Animado';

const LINHAS_DE_CODIGO: Array<[number, number, string]> = [
  [0.0, 0.5, COR.rosa],
  [0.1, 0.36, COR.ciano],
  [0.1, 0.5, COR.destaque],
  [0.2, 0.28, COR.verde],
  [0.0, 0.42, COR.ciano],
  [0.1, 0.55, COR.branco],
];

// Monitor com teclado. A tela mostra "linhas de código" coloridas (ou só a cor da tela).
export const Computador: React.FC<PropsTransformacao & {corTela?: string; codigo?: boolean}> = ({
  corTela = '#13203d',
  codigo = true,
  posicao,
  rotacao,
  escala = 1,
}) => (
  <group position={posicao} rotation={rotacao} scale={escala}>
    <mesh position={[0, 0.03, 0.12]} castShadow receiveShadow>
      <boxGeometry args={[0.5, 0.06, 0.32]} />
      <meshStandardMaterial color="#2b3245" flatShading roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.25, 0.1]} castShadow>
      <cylinderGeometry args={[0.04, 0.05, 0.4, 8]} />
      <meshStandardMaterial color="#2b3245" flatShading />
    </mesh>
    {/* a moldura fica 4 mm atrás da tela (com 2 mm, de longe as duas piscavam) */}
    <mesh position={[0, 0.82, 0.098]} castShadow>
      <boxGeometry args={[1.5, 0.95, 0.07]} />
      <meshStandardMaterial color="#1a2033" flatShading roughness={0.5} />
    </mesh>
    <mesh position={[0, 0.84, 0.137]}>
      <planeGeometry args={[1.38, 0.82]} />
      <meshStandardMaterial color={corTela} emissive={corTela} emissiveIntensity={0.6} />
    </mesh>
    {codigo
      ? LINHAS_DE_CODIGO.map(([recuo, largura, cor], i) => (
          <mesh key={i} position={[-0.6 + recuo + largura / 2, 1.13 - i * 0.11, 0.14]}>
            <planeGeometry args={[largura, 0.045]} />
            <meshBasicMaterial color={cor} toneMapped={false} />
          </mesh>
        ))
      : null}
    <mesh position={[0, 0.03, 0.62]} castShadow receiveShadow>
      <boxGeometry args={[1.1, 0.05, 0.36]} />
      <meshStandardMaterial color="#d9dee9" flatShading roughness={0.7} />
    </mesh>
    {Array.from({length: 3}, (_, linha) =>
      Array.from({length: 10}, (_, coluna) => (
        <mesh key={`${linha}-${coluna}`} position={[-0.45 + coluna * 0.1, 0.065, 0.51 + linha * 0.1]}>
          <boxGeometry args={[0.08, 0.025, 0.08]} />
          <meshStandardMaterial color="#aab3c7" flatShading />
        </mesh>
      )),
    )}
  </group>
);

// Celular em pé. `corTela` pinta a tela; filhos aparecem "dentro" da tela (z ~ 0.035).
export const Celular: React.FC<PropsTransformacao & {corTela?: string; children?: React.ReactNode}> = ({
  corTela = '#3f8fe6',
  posicao,
  rotacao,
  escala = 1,
  children,
}) => (
  <group position={posicao} rotation={rotacao} scale={escala}>
    {/* o corpo fica 3 mm atrás da tela (com 1 mm, de longe as duas piscavam) */}
    <mesh position-z={-0.002} castShadow>
      <boxGeometry args={[0.52, 1.04, 0.06]} />
      <meshStandardMaterial color="#141a2b" flatShading roughness={0.4} metalness={0.2} />
    </mesh>
    <mesh position={[0, 0, 0.031]}>
      <planeGeometry args={[0.46, 0.96]} />
      <meshStandardMaterial color={corTela} emissive={corTela} emissiveIntensity={0.55} />
    </mesh>
    <mesh position={[0, 0.44, 0.033]}>
      <planeGeometry args={[0.14, 0.03]} />
      <meshBasicMaterial color="#0b0e18" />
    </mesh>
    <group position={[0, 0, 0.034]}>{children}</group>
  </group>
);

// Microfone de estúdio no pedestal.
export const Microfone: React.FC<PropsTransformacao & {cor?: string}> = ({cor = '#2b3245', posicao, rotacao, escala = 1}) => (
  <group position={posicao} rotation={rotacao} scale={escala}>
    <mesh position-y={0.04} castShadow receiveShadow>
      <cylinderGeometry args={[0.32, 0.36, 0.08, 10]} />
      <meshStandardMaterial color={cor} flatShading />
    </mesh>
    <mesh position-y={0.55} castShadow>
      <cylinderGeometry args={[0.035, 0.035, 1.0, 8]} />
      <meshStandardMaterial color="#9aa3b8" metalness={0.6} roughness={0.3} flatShading />
    </mesh>
    <mesh position-y={1.13} castShadow>
      <cylinderGeometry args={[0.15, 0.13, 0.32, 10]} />
      <meshStandardMaterial color={cor} flatShading />
    </mesh>
    <mesh position-y={1.42} castShadow>
      <icosahedronGeometry args={[0.2, 1]} />
      <meshStandardMaterial color="#b9c1d4" metalness={0.5} roughness={0.35} flatShading />
    </mesh>
    <mesh position-y={1.28}>
      <torusGeometry args={[0.17, 0.025, 6, 16]} />
      <meshStandardMaterial color={COR.destaque} emissive={COR.destaque} emissiveIntensity={0.3} />
    </mesh>
  </group>
);

// Claquete de cinema. `abertura` em radianos (0 = fechada).
export const Claquete: React.FC<PropsTransformacao & {abertura?: number}> = ({abertura = 0.35, posicao, rotacao, escala = 1}) => (
  <group position={posicao} rotation={rotacao} scale={escala}>
    <mesh position-y={0.32} castShadow>
      <boxGeometry args={[1.0, 0.64, 0.05]} />
      <meshStandardMaterial color="#1a1f2e" flatShading roughness={0.6} />
    </mesh>
    {[0.42, 0.28, 0.14].map((y) => (
      <mesh key={y} position={[0, y, 0.029]}>
        <planeGeometry args={[0.86, 0.015]} />
        <meshBasicMaterial color="#cfd6e6" />
      </mesh>
    ))}
    <group position={[-0.5, 0.66, 0]} rotation={[0, 0, abertura]}>
      {Array.from({length: 6}, (_, i) => (
        <mesh key={i} position={[0.085 + i * 0.167, 0.06, 0]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.12, 0.13, 0.052]} />
          <meshStandardMaterial color={i % 2 ? '#f4f6fb' : '#1a1f2e'} flatShading />
        </mesh>
      ))}
    </group>
  </group>
);

// Engrenagem (gire com <Animado girar>). Fica de frente para a câmera.
export const Engrenagem: React.FC<PropsTransformacao & {cor?: string; dentes?: number}> = ({
  cor = COR.cinza,
  dentes = 10,
  posicao,
  rotacao,
  escala = 1,
}) => (
  <group position={posicao} rotation={rotacao} scale={escala}>
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.14, 20]} />
        <meshStandardMaterial color={cor} metalness={0.5} roughness={0.35} flatShading />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.13, 0.13, 0.16, 12]} />
        <meshStandardMaterial color="#1a1f2e" flatShading />
      </mesh>
      {Array.from({length: dentes}, (_, i) => {
        const a = (i / dentes) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.48, 0, Math.sin(a) * 0.48]} rotation={[0, -a, 0]} castShadow>
            <boxGeometry args={[0.14, 0.14, 0.13]} />
            <meshStandardMaterial color={cor} metalness={0.5} roughness={0.35} flatShading />
          </mesh>
        );
      })}
    </group>
  </group>
);

const formaCoracao = () => {
  const s = new Shape();
  s.moveTo(0, -0.5);
  s.bezierCurveTo(-0.55, -0.12, -0.6, 0.35, -0.3, 0.45);
  s.bezierCurveTo(-0.12, 0.5, 0, 0.38, 0, 0.26);
  s.bezierCurveTo(0, 0.38, 0.12, 0.5, 0.3, 0.45);
  s.bezierCurveTo(0.6, 0.35, 0.55, -0.12, 0, -0.5);
  return s;
};

// Coração (curtidas, saúde, amor).
export const Coracao: React.FC<PropsTransformacao & {cor?: string}> = ({cor = COR.rosa, posicao, rotacao, escala = 1}) => {
  const geometria = useMemo(() => {
    const g = new ExtrudeGeometry(formaCoracao(), {depth: 0.18, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 2, curveSegments: 10});
    g.center();
    return g;
  }, []);
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <mesh geometry={geometria} castShadow>
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.25} flatShading roughness={0.4} />
      </mesh>
    </group>
  );
};

// Moeda dourada de pé (dinheiro, economia, preço).
export const Moeda: React.FC<PropsTransformacao & {cor?: string}> = ({cor = '#f2b928', posicao, rotacao, escala = 1}) => (
  <group position={posicao} rotation={rotacao} scale={escala}>
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.08, 24]} />
        <meshStandardMaterial color={cor} metalness={0.7} roughness={0.3} flatShading />
      </mesh>
      <mesh position-y={0.045}>
        <torusGeometry args={[0.34, 0.025, 6, 24]} />
        <meshStandardMaterial color="#c98f12" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
    <mesh position={[0, 0, 0.05]}>
      <boxGeometry args={[0.07, 0.36, 0.02]} />
      <meshStandardMaterial color="#c98f12" metalness={0.6} roughness={0.3} />
    </mesh>
  </group>
);

// Relógio de parede. Sem `hora`, os ponteiros andam com o vídeo.
export const Relogio: React.FC<PropsTransformacao & {hora?: number; cor?: string}> = ({hora, cor = COR.azul, posicao, rotacao, escala = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const h = hora ?? 10.1 + (frame / fps) * 0.5;
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.1, 24]} />
          <meshStandardMaterial color={cor} flatShading roughness={0.5} />
        </mesh>
        <mesh position-y={0.051}>
          <cylinderGeometry args={[0.43, 0.43, 0.01, 24]} />
          <meshStandardMaterial color="#f4f6fb" />
        </mesh>
      </group>
      {Array.from({length: 12}, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(a) * 0.36, Math.cos(a) * 0.36, 0.06]}>
            <boxGeometry args={[0.025, 0.06, 0.01]} />
            <meshBasicMaterial color="#1a1f2e" />
          </mesh>
        );
      })}
      <group position-z={0.07} rotation={[0, 0, -((h % 12) / 12) * Math.PI * 2]}>
        <mesh position-y={0.11}>
          <boxGeometry args={[0.04, 0.22, 0.01]} />
          <meshBasicMaterial color="#1a1f2e" />
        </mesh>
      </group>
      <group position-z={0.075} rotation={[0, 0, -((h % 1) * Math.PI * 2)]}>
        <mesh position-y={0.16}>
          <boxGeometry args={[0.025, 0.32, 0.01]} />
          <meshBasicMaterial color={COR.vermelho} />
        </mesh>
      </group>
    </group>
  );
};
