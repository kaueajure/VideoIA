// Cenário de fundo para cenas AO AR LIVRE. Só elementos que fazem sentido no lugar
// (nuvens no céu, montanhas no horizonte, poeira no ar do fim de tarde) — nunca enfeite
// aleatório. Ficam atrás do assunto (z negativo) e a névoa os esmaece, dando profundidade.
import React from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Particulas} from '../objetos/diagramas';
import {Nuvem} from '../objetos/natureza';
import type {Vec3} from '../tema';

export type TipoAmbiente =
  | 'nuvens' // nuvens passando ao fundo (céu)
  | 'montanhas' // cordilheira no horizonte
  | 'poeira'; // partículas finas no ar (ar denso, fim de tarde, luz atravessando)

const NUVENS: Array<{pos: Vec3; escala: number}> = [
  {pos: [-2.2, 5.2, -9], escala: 1.1},
  {pos: [2.4, 6.2, -12], escala: 1.4},
  {pos: [0.2, 7.4, -15], escala: 1.6},
  {pos: [-3.6, 7.8, -16], escala: 1.5},
  {pos: [3.8, 4.6, -14], escala: 1.2},
];

const NuvensDeFundo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  return (
    <group>
      {NUVENS.map((n, i) => (
        <Nuvem key={i} posicao={[n.pos[0] + t * (0.06 + i * 0.015), n.pos[1], n.pos[2]]} escala={n.escala} />
      ))}
    </group>
  );
};

const MONTANHAS: Array<{x: number; z: number; altura: number; raio: number; neve: boolean}> = [
  {x: -6.5, z: -14, altura: 3.4, raio: 3.2, neve: false},
  {x: -3.2, z: -16, altura: 5.2, raio: 3.8, neve: true},
  {x: 0.4, z: -18, altura: 6.4, raio: 4.4, neve: true},
  {x: 3.6, z: -15, altura: 4.4, raio: 3.4, neve: true},
  {x: 6.8, z: -13, altura: 3.0, raio: 3.0, neve: false},
  {x: -1.6, z: -13, altura: 2.4, raio: 2.6, neve: false},
  {x: 2.0, z: -12, altura: 2.0, raio: 2.4, neve: false},
];

const Montanhas: React.FC<{cor?: string}> = ({cor = '#33476b'}) => (
  <group>
    {MONTANHAS.map((m, i) => (
      <group key={i} position={[m.x, -0.06, m.z]} rotation={[0, random(`montanha-${i}`) * Math.PI, 0]}>
        <mesh position-y={m.altura / 2} receiveShadow>
          <coneGeometry args={[m.raio, m.altura, 5]} />
          <meshStandardMaterial color={cor} flatShading roughness={0.95} />
        </mesh>
        {m.neve ? (
          // A neve fica um pouco PARA FORA da montanha: com o cone exatamente na superfície, as duas
          // brigam pela frente (z-fighting) e as faces piscam quadro a quadro.
          <mesh position-y={m.altura * 0.84}>
            <coneGeometry args={[m.raio * 0.32 * 1.06, m.altura * 0.32 * 1.03, 5]} />
            <meshStandardMaterial color="#eef3ff" flatShading roughness={0.9} />
          </mesh>
        ) : null}
      </group>
    ))}
  </group>
);

export const Ambiente: React.FC<{
  tipos: TipoAmbiente[];
  corDasMontanhas?: string;
  corDaPoeira?: string;
}> = ({tipos, corDasMontanhas, corDaPoeira = '#ffe2c0'}) => (
  <>
    {tipos.includes('nuvens') ? <NuvensDeFundo /> : null}
    {tipos.includes('montanhas') ? <Montanhas cor={corDasMontanhas} /> : null}
    {tipos.includes('poeira') ? (
      <Particulas
        posicao={[0, 2.6, -2]}
        quantidade={120}
        area={[7, 6, 9]}
        tamanho={0.014}
        cores={[corDaPoeira, '#ffffff']}
        brilhar
        opacidade={0.5}
        agitacao={0.3}
        velocidade={0.35}
        semente="poeira"
      />
    ) : null}
  </>
);
