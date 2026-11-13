import React, {useEffect, useMemo} from 'react';
import {CatmullRomCurve3, CylinderGeometry, EdgesGeometry, TubeGeometry, Vector3} from 'three';
import {COR} from '../tema';
import type {PropsTransformacao} from './Animado';

// Contorno do "?" (base do pingo em y=0, altura total ~1.3).
const pontosInterrogacao = (): Vector3[] => {
  const pontos: Vector3[] = [];
  for (let graus = 165; graus >= -75; graus -= 15) {
    const a = (graus * Math.PI) / 180;
    pontos.push(new Vector3(0.36 * Math.cos(a), 0.92 + 0.36 * Math.sin(a), 0));
  }
  pontos.push(new Vector3(0.025, 0.47, 0), new Vector3(0, 0.36, 0));
  return pontos;
};

// Ponto de interrogação 3D: o símbolo do canal para ganchos e perguntas.
export const Interrogacao: React.FC<PropsTransformacao & {cor?: string; espessura?: number}> = ({
  cor = COR.destaque,
  espessura = 0.085,
  posicao,
  rotacao,
  escala = 1,
}) => {
  const {geometria, inicio, fim} = useMemo(() => {
    const curva = new CatmullRomCurve3(pontosInterrogacao());
    return {
      geometria: new TubeGeometry(curva, 72, espessura, 8, false),
      inicio: curva.getPoint(0),
      fim: curva.getPoint(1),
    };
  }, [espessura]);
  useEffect(() => () => geometria.dispose(), [geometria]);

  const material = <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.45} flatShading roughness={0.35} />;
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <mesh geometry={geometria} castShadow>
        {material}
      </mesh>
      <mesh position={inicio} castShadow>
        <icosahedronGeometry args={[espessura, 1]} />
        {material}
      </mesh>
      <mesh position={fim} castShadow>
        <icosahedronGeometry args={[espessura, 1]} />
        {material}
      </mesh>
      <mesh position={[0, 0.11, 0]} castShadow>
        <icosahedronGeometry args={[0.11, 1]} />
        {material}
      </mesh>
    </group>
  );
};

// Prisma de vidro triangular (dispersão da luz, óptica).
export const Prisma: React.FC<PropsTransformacao & {tamanho?: number; profundidade?: number; cor?: string}> = ({
  tamanho = 0.7,
  profundidade = 0.6,
  cor = '#bfe9ff',
  posicao,
  rotacao,
  escala = 1,
}) => {
  const {geometria, arestas} = useMemo(() => {
    const g = new CylinderGeometry(tamanho, tamanho, profundidade, 3);
    return {geometria: g, arestas: new EdgesGeometry(g)};
  }, [tamanho, profundidade]);
  useEffect(
    () => () => {
      geometria.dispose();
      arestas.dispose();
    },
    [geometria, arestas],
  );
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={geometria}>
          <meshStandardMaterial color={cor} transparent opacity={0.38} roughness={0.08} metalness={0.1} flatShading />
        </mesh>
        <lineSegments geometry={arestas}>
          <lineBasicMaterial color="#eaf8ff" toneMapped={false} />
        </lineSegments>
      </group>
    </group>
  );
};

// Pedestal de exposição. Os filhos ficam em cima dele.
export const Pedestal: React.FC<
  PropsTransformacao & {raio?: number; altura?: number; cor?: string; children?: React.ReactNode}
> = ({raio = 0.8, altura = 0.35, cor = COR.ciano, posicao, rotacao, escala = 1, children}) => (
  <group position={posicao} rotation={rotacao} scale={escala}>
    <mesh position-y={altura / 2} castShadow receiveShadow>
      <cylinderGeometry args={[raio, raio * 1.08, altura, 32]} />
      <meshStandardMaterial color="#1b2338" roughness={0.55} metalness={0.25} />
    </mesh>
    {/* aro 4 mm acima do tampo (com 2 mm, de longe os dois piscavam) */}
    <mesh position-y={altura + 0.004} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[raio * 0.9, raio, 64]} />
      <meshBasicMaterial color={cor} toneMapped={false} />
    </mesh>
    <group position-y={altura}>{children}</group>
  </group>
);

// Arroba (@) em 3D, de frente para a câmera (plano XY), centrada na origem, ~1,1 de largura e de altura:
// o anel de fora aberto embaixo à direita, o "a" de dentro e a haste que liga os dois. Para pôr em pé no
// chão, suba ~0,6 (posicao={[0, 0.6, 0]}).
// - `brilho` (0–1+): quanto o símbolo acende (ex.: 0,2 → 1 quando a narração diz "arroba").
// - `espessura`: grossura do traço (0,075 padrão; 0,1 fica mais encorpada de longe).
// - `desenho` (0–1): o traço sendo escrito, na ordem da mão (o "a", a haste e o anel de fora), com uma
//   bolinha na ponta. 1 = completa (padrão). Anime pelo quadro: desenho={progresso(frame, q, q + 30)}.
//   <Animado posicao={[0, 1.1, 0]} entrada={quando('arroba')}><Arroba brilho={0.4} /></Animado>
export const Arroba: React.FC<PropsTransformacao & {cor?: string; brilho?: number; espessura?: number; desenho?: number}> = ({
  cor = COR.destaque,
  brilho = 0.2,
  espessura = 0.075,
  desenho = 1,
  posicao,
  rotacao,
  escala = 1,
}) => {
  const inicio = -0.26;
  const ARCO_ANEL = 5.5;
  const a: [number, number, number] = [0.27, -0.2, 0];
  const b: [number, number, number] = [Math.cos(inicio) * 0.5, Math.sin(inicio) * 0.5, 0];
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const ligacao = Math.hypot(dx, dy) + 0.06;
  // Partes do traço, na ordem em que a mão escreve: "a" (0–0,35), haste (0,35–0,45), ligação (0,45–0,5), anel.
  const d = Math.min(1, Math.max(0, desenho));
  const parte = (de: number, ate: number) => Math.min(1, Math.max(0, (d - de) / (ate - de)));
  const kA = d >= 1 ? 1 : parte(0, 0.35);
  const kHaste = d >= 1 ? 1 : parte(0.35, 0.45);
  const kLigacao = d >= 1 ? 1 : parte(0.45, 0.5);
  const kAnel = d >= 1 ? 1 : parte(0.5, 1);
  const material = <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={brilho} flatShading roughness={0.45} metalness={0.1} />;
  // Ponta do traço enquanto escreve (fecha o tubo aberto e mostra onde a "caneta" está).
  let ponta: [number, number, number] | null = null;
  if (d > 0.001 && d < 1) {
    if (kA < 1) {
      ponta = [Math.cos(kA * Math.PI * 2) * 0.2, Math.sin(kA * Math.PI * 2) * 0.2, 0];
    } else if (kHaste < 1) {
      ponta = [0.27, 0.23 - 0.44 * kHaste, 0];
    } else if (kLigacao < 1) {
      ponta = [a[0] + dx * kLigacao, a[1] + dy * kLigacao, 0];
    } else {
      const ang = inicio + ARCO_ANEL * kAnel;
      ponta = [Math.cos(ang) * 0.5, Math.sin(ang) * 0.5, 0];
    }
  }
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      {kAnel > 0.001 ? (
        <mesh rotation-z={inicio} castShadow>
          <torusGeometry args={[0.5, espessura, 8, 44, ARCO_ANEL * kAnel]} />
          {material}
        </mesh>
      ) : null}
      {kA > 0.001 ? (
        <mesh castShadow>
          <torusGeometry args={[0.2, espessura, 8, 26, Math.PI * 2 * kA]} />
          {material}
        </mesh>
      ) : null}
      {kHaste > 0.001 ? (
        <mesh position={[0.27, 0.23 - 0.22 * kHaste, 0]} scale={[1, kHaste, 1]} castShadow>
          <boxGeometry args={[espessura * 1.8, 0.44, espessura * 1.8]} />
          {material}
        </mesh>
      ) : null}
      {kLigacao > 0.001 ? (
        <mesh position={[a[0] + (dx * kLigacao) / 2, a[1] + (dy * kLigacao) / 2, 0]} rotation-z={Math.atan2(dy, dx)} scale={[kLigacao, 1, 1]} castShadow>
          <boxGeometry args={[ligacao, espessura * 1.8, espessura * 1.8]} />
          {material}
        </mesh>
      ) : null}
      {ponta ? (
        <mesh position={ponta}>
          <icosahedronGeometry args={[espessura * 1.05, 1]} />
          {material}
        </mesh>
      ) : null}
    </group>
  );
};
