import React, {useContext} from 'react';
import {Easing, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {ContextoCena} from '../../video/contexto';
import {PELE, ROUPA, type Vec3} from '../tema';
import {avaliarPose, misturarPoses, type NomePose, type Pose} from './poses';

export type PropsBoneco = {
  posicao?: Vec3;
  // Giro do corpo em graus: 0 = de frente para a câmera, 90 = virado para a direita da tela.
  giro?: number;
  escala?: number;
  // Pose fixa (com o movimento próprio dela).
  pose?: NomePose;
  // Ou uma sequência de poses no tempo (quadros relativos à cena; com `tempo`, quadros desse relógio).
  poses?: Array<{quadro: number; pose: NomePose}>;
  // Quadros para uma pose se misturar na seguinte.
  transicaoPose?: number;
  // Atalho para as combinações prontas de ROUPA (tema.ts).
  visual?: number;
  cor?: string;
  pele?: string;
  calca?: string;
  // Cor do cabelo, ou null para careca.
  cabelo?: string | null;
  // Mexe a boca enquanto o narrador fala nesta cena.
  falando?: boolean;
  // Muda o ritmo de piscar entre bonecos.
  semente?: string;
  // Relógio das poses, do balanço e do piscar (padrão: quadro da cena). Num mundo contínuo, passe
  // `tempo={useMundo().quadro}` e escreva os quadros das `poses` nesse relógio (useMundo().quando(...)):
  // o boneco segue o mesmo movimento através dos cortes, sem recomeçar a pose. A boca (`falando`) segue
  // sempre as palavras da cena atual.
  tempo?: number;
};

const SAPATO = '#171a24';
const OLHO = '#14141c';
const BOCA = '#4a1822';
// Abertura do olho em cada quadro de uma piscada: fecha rápido, segura e abre devagar.
const PISCADA = [0.55, 0.12, 0.12, 0.4, 0.78];

const Peca: React.FC<{
  posicao?: Vec3;
  rotacao?: Vec3;
  escala?: Vec3;
  cor: string;
  // Brilho próprio leve (pele), para o rosto não sumir na sombra.
  brilho?: number;
  children: React.ReactNode;
}> = ({posicao, rotacao, escala, cor, brilho = 0, children}) => (
  <mesh position={posicao} rotation={rotacao} scale={escala} castShadow receiveShadow>
    {children}
    <meshStandardMaterial
      color={cor}
      emissive={cor}
      emissiveIntensity={brilho}
      flatShading
      roughness={0.72}
      metalness={0.02}
    />
  </mesh>
);

const poseNoQuadro = (
  frame: number,
  fps: number,
  pose: NomePose,
  poses: PropsBoneco['poses'],
  transicao: number,
): Pose => {
  const t = frame / fps;
  if (!poses || poses.length === 0) {
    return avaliarPose(pose, t, t);
  }
  const ordenadas = [...poses].sort((a, b) => a.quadro - b.quadro);
  let i = 0;
  while (i < ordenadas.length - 1 && frame >= ordenadas[i + 1].quadro) {
    i++;
  }
  const atual = ordenadas[i];
  const tPose = Math.max(0, (frame - atual.quadro) / fps);
  const resultado = avaliarPose(atual.pose, t, tPose);
  const desde = frame - atual.quadro;
  if (i > 0 && desde < transicao) {
    const anterior = ordenadas[i - 1];
    const k = Easing.inOut(Easing.quad)(Math.max(0, desde) / transicao);
    return misturarPoses(avaliarPose(anterior.pose, t, (frame - anterior.quadro) / fps), resultado, k);
  }
  return resultado;
};

// Boneco low-poly articulado. Fica em pé em y=0 (o piso do palco) e mede ~2 unidades.
//   <Boneco poses={[{quadro: 0, pose: 'parado'}, {quadro: quando('azul'), pose: 'surpreso'}]} />
// Mundo contínuo (o mesmo boneco em várias cenas, sem a pose recomeçar no corte):
//   const {quadro, quando} = useMundo();
//   <Boneco tempo={quadro} poses={[{quadro: 0, pose: 'andando'}, {quadro: quando('chegada', 'parou'), pose: 'parado'}]} />
export const Boneco: React.FC<PropsBoneco> = ({
  posicao = [0, 0, 0],
  giro = 0,
  escala = 1,
  pose = 'parado',
  poses,
  transicaoPose = 8,
  visual = 0,
  cor,
  pele,
  calca,
  cabelo,
  falando = false,
  semente = 'boneco',
  tempo,
}) => {
  const frame = useCurrentFrame();
  // Relógio das poses e do piscar; a boca usa sempre o quadro da cena (as palavras são da cena).
  const relogio = tempo ?? frame;
  const {fps} = useVideoConfig();
  const cena = useContext(ContextoCena);

  const roupa = ROUPA[((visual % ROUPA.length) + ROUPA.length) % ROUPA.length];
  const corCamiseta = cor ?? roupa.camiseta;
  const corPele = pele ?? PELE[0];
  const corCalca = calca ?? roupa.calca;
  const corCabelo = cabelo === undefined ? roupa.cabelo : cabelo;

  const p = poseNoQuadro(relogio, fps, pose, poses, transicaoPose);

  // Piscar: um ciclo de ~3,4s com deslocamento próprio de cada boneco. O olho fecha e abre em curva
  // (5 quadros), sem saltar de aberto para fechado de um quadro para o outro.
  const cicloQ = Math.round(3.4 * fps);
  const qPiscada = (((Math.floor(relogio + random(`piscar-${semente}`) * cicloQ) % cicloQ) + cicloQ) % cicloQ) - (cicloQ - PISCADA.length);
  const olhoY = qPiscada >= 0 ? PISCADA[qPiscada] : 1;

  // Boca acompanha as palavras da narração da cena: abre e fecha em curva, ~5 vezes por segundo
  // (6 quadros), e só fecha de vez 3 quadros depois da palavra. Saltos de quadro em quadro parecem tremido.
  let boca = 0.18;
  if (falando && cena) {
    const palavra =
      cena.palavras.find((w) => frame >= w.inicio && frame < w.fim) ?? cena.palavras.find((w) => frame >= w.fim && frame < w.fim + 3);
    if (palavra) {
      const abertura = 0.5 - 0.5 * Math.cos(((frame - palavra.inicio) / 6) * 2 * Math.PI);
      const fechando = frame >= palavra.fim ? 1 - (frame - palavra.fim) / 3 : 1;
      boca = 0.18 + abertura * 0.75 * fechando;
    }
  }

  const braco = (lado: 1 | -1, rot: Vec3, cotovelo: Vec3) => (
    <group position={[0.33 * lado, 0.52, 0]} rotation={rot}>
      <Peca cor={corCamiseta}>
        <icosahedronGeometry args={[0.088, 0]} />
      </Peca>
      <Peca posicao={[0, -0.16, 0]} cor={corCamiseta}>
        <cylinderGeometry args={[0.078, 0.068, 0.32, 6]} />
      </Peca>
      <group position={[0, -0.32, 0]} rotation={cotovelo}>
        <Peca cor={corPele}>
          <icosahedronGeometry args={[0.064, 0]} />
        </Peca>
        <Peca posicao={[0, -0.14, 0]} cor={corPele}>
          <cylinderGeometry args={[0.062, 0.054, 0.28, 6]} />
        </Peca>
        <Peca posicao={[0, -0.32, 0]} cor={corPele}>
          <icosahedronGeometry args={[0.078, 0]} />
        </Peca>
      </group>
    </group>
  );

  const perna = (lado: 1 | -1, rot: number, joelho: number) => (
    <group position={[0.12 * lado, 0, 0]} rotation={[rot, 0, 0]}>
      <Peca posicao={[0, -0.23, 0]} cor={corCalca}>
        <cylinderGeometry args={[0.1, 0.086, 0.46, 6]} />
      </Peca>
      <group position={[0, -0.46, 0]} rotation={[joelho, 0, 0]}>
        <Peca posicao={[0, -0.22, 0]} cor={corCalca}>
          <cylinderGeometry args={[0.084, 0.07, 0.44, 6]} />
        </Peca>
        <Peca posicao={[0, -0.45, 0.05]} cor={SAPATO}>
          <boxGeometry args={[0.15, 0.08, 0.27]} />
        </Peca>
      </group>
    </group>
  );

  return (
    <group position={posicao} rotation={[0, (giro * Math.PI) / 180, 0]} scale={escala}>
      {/* quadril */}
      <group position={[0, 0.95 + p.altura, 0]}>
        <Peca posicao={[0, 0.03, 0]} cor={corCalca}>
          <boxGeometry args={[0.42, 0.18, 0.25]} />
        </Peca>
        {perna(-1, p.pernaEsq, p.joelhoEsq)}
        {perna(1, p.pernaDir, p.joelhoDir)}

        {/* tronco */}
        <group position={[0, 0.08, 0]} rotation={[p.inclinacao, p.giroTronco, p.ladoTronco]}>
          <Peca posicao={[0, 0.29, 0]} cor={corCamiseta}>
            <cylinderGeometry args={[0.27, 0.22, 0.58, 7]} />
          </Peca>
          {braco(-1, p.bracoEsq, p.cotoveloEsq)}
          {braco(1, p.bracoDir, p.cotoveloDir)}
          <Peca posicao={[0, 0.62, 0]} cor={corPele}>
            <cylinderGeometry args={[0.07, 0.08, 0.1, 6]} />
          </Peca>

          {/* cabeça */}
          <group position={[0, 0.66, 0]} rotation={p.cabeca}>
            <Peca posicao={[0, 0.24, 0]} cor={corPele} brilho={0.16}>
              <icosahedronGeometry args={[0.25, 1]} />
            </Peca>
            {corCabelo ? (
              <Peca posicao={[0, 0.27, -0.025]} rotacao={[-0.3, 0, 0]} cor={corCabelo}>
                <sphereGeometry args={[0.265, 8, 4, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              </Peca>
            ) : null}
            {([-1, 1] as const).map((lado) => (
              <group key={lado} position={[0.085 * lado, 0.27, 0.215]} scale={[1, olhoY, 1]}>
                <mesh>
                  <sphereGeometry args={[0.034, 8, 6]} />
                  <meshStandardMaterial color={OLHO} roughness={0.35} />
                </mesh>
                <mesh position={[0.011, 0.012, 0.027]}>
                  <sphereGeometry args={[0.0095, 6, 4]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
              </group>
            ))}
            <mesh position={[0, 0.145, 0.228]} rotation={[-0.35, 0, 0]} scale={[1, boca, 1]}>
              <boxGeometry args={[0.1, 0.05, 0.02]} />
              <meshStandardMaterial color={BOCA} roughness={0.6} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
