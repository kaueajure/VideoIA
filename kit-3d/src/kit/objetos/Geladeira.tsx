// Geladeira low poly (duas portas, congelador em cima) com o circuito do gás por trás: base em y = 0, frente
// para +z, 1 unidade ≈ 1 m (0,9 de largura, 1,8 de altura, 0,72 de fundo). Bolinhas = o gás andando pelos
// canos: azul-claro frio, vermelho quente, azul-escuro quando vira líquido. O caminho é o de verdade: evapora
// nos canos do congelador (rouba o calor da comida), desce até o compressor (aperta e esquenta), solta o calor
// na grade de trás (condensador, vira líquido), passa espremido pelo tubo capilar (a pressão cai, ele gela) e
// volta ao congelador.
//
//   <Geladeira />                                                    fechada, com o gás andando
//   <Geladeira porta={progresso(frame, q, q + 20)} />                a porta de baixo abrindo
//   <Geladeira corte={1} gelo={0.6} />                               sem a parede direita: o lado de dentro
//   <Geladeira rotacao={[0, Math.PI, 0]} calor={1} vibrar={1} />     de costas: grade quente e motor ligado
//   <Geladeira partes={{canos: true, motor: true}} />                só o circuito (vista explodida)
//   <Geladeira bolinhas={0} />                                       sem o gás (ex.: linha do tempo)
//   <Geladeira fluxo={fluxoDoGas(frame, fps, (f) => (f < q ? 1 : 0))} />  motor desliga em q: o gás para aos poucos
//
// Para prender um rótulo 2D a uma peça: pontoNaGeladeira([0, 1.0, -0.42], {posicao, rotacao, escala}) dá o
// ponto no mundo; depois useProjetor/projetarNaTela (cenas prontas) o leva para a tela.
import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Color, Euler, IcosahedronGeometry, Quaternion, Vector3} from 'three';
import type {Vec3} from '../tema';
import {texturaBrilho} from '../texturas';
import type {PropsTransformacao} from './Animado';

const lim01 = (v: number) => Math.min(1, Math.max(0, v));
const misturarCor = (a: string, b: string, t: number) => `#${new Color(a).lerp(new Color(b), lim01(t)).getHexString()}`;

// Cores fixas (geladeira branca e cobre dos canos); a carcaça e a porta podem mudar por prop.
const CARCACA = '#f6f8fa';
const PORTA = '#d9e0e8';
const PUXADOR = '#454c5a';
const RODAPE = '#4a505c';
const COBRE = '#c8783f';
const GRADE = '#30353e';
const PRETO = '#22262d';
const QUENTE = '#ff3b2f';
const LARANJA = '#ff8f2a';
const FRIO = '#4fc3ff';
const MORNO = '#8fa9ff';
const LIQUIDO = '#2457ff';
const GELO = '#e3f5ff';

// Medidas (m): largura, altura, fundo, parede, altura da divisória do congelador e do rodapé.
export const MEDIDAS_GELADEIRA = {largura: 0.9, altura: 1.8, fundo: 0.72, parede: 0.05, divisoria: 1.27, rodape: 0.1} as const;
const G = {L: 0.9, A: 1.8, P: 0.72, e: 0.05, div: 1.27, rod: 0.1};
const ZT = -G.P / 2 - 0.06; // plano da grade de trás
const XE = -G.L / 2 + G.e + 0.03; // canos do congelador, na parede esquerda por dentro
const POS_COMPRESSOR: Vec3 = [0.2, 0, -0.5];
// Velocidade do gás (m/s) com o motor ligado.
const VEL_GAS = 0.9;

// ---------------------------------------------------------------------------------------------
// Trilho (caminho com bolinhas andando) e canos
// ---------------------------------------------------------------------------------------------

type Vertice = {p: Vec3; cor: string; t: number};
const v = (p: Vec3, cor: string, t = 0.03): Vertice => ({p, cor, t});
type Trilho = {pts: Vector3[]; acum: number[]; total: number; cores: Color[]; tams: number[]; fechado: boolean};

const criarTrilho = (vs: Vertice[], fechado: boolean): Trilho => {
  const lista = fechado ? [...vs, vs[0]] : vs;
  const pts = lista.map((x) => new Vector3(...x.p));
  const acum = [0];
  for (let i = 1; i < pts.length; i++) {
    acum.push(acum[i - 1] + pts[i].distanceTo(pts[i - 1]));
  }
  return {pts, acum, total: acum[acum.length - 1], cores: lista.map((x) => new Color(x.cor)), tams: lista.map((x) => x.t), fechado};
};

const amostrar = (tr: Trilho, s: number) => {
  let i = 1;
  while (i < tr.acum.length - 1 && tr.acum[i] < s) {
    i++;
  }
  const a = tr.acum[i - 1];
  const b = tr.acum[i];
  const t = b > a ? lim01((s - a) / (b - a)) : 0;
  return {
    p: tr.pts[i - 1].clone().lerp(tr.pts[i], t),
    c: tr.cores[i - 1].clone().lerp(tr.cores[i], t),
    tam: tr.tams[i - 1] + (tr.tams[i] - tr.tams[i - 1]) * t,
  };
};

const GEO_BOLA = new IcosahedronGeometry(1, 1);

// Bolinhas igualmente espaçadas andando pelo trilho. `distancia` = quanto o gás já andou.
const Bolinhas: React.FC<{trilho: Trilho; distancia: number; espaco?: number; escala?: number; brilho?: number}> = ({
  trilho,
  distancia,
  espaco = 0.12,
  escala = 1,
  brilho = 0.45,
}) => {
  if (escala <= 0.001) {
    return null;
  }
  const n = Math.max(1, Math.floor(trilho.total / espaco));
  const passo = trilho.total / n;
  const itens: React.ReactNode[] = [];
  for (let k = 0; k < n; k++) {
    const s = (((k * passo + distancia) % trilho.total) + trilho.total) % trilho.total;
    // Trilho aberto: a bolinha nasce e some encolhendo nas pontas (nada aparece de um quadro para o outro).
    const fade = trilho.fechado ? 1 : Math.min(1, s / (trilho.total * 0.1), (trilho.total - s) / (trilho.total * 0.1));
    const {p, c, tam} = amostrar(trilho, s);
    const r = tam * escala * fade;
    if (r < 0.002) {
      continue;
    }
    itens.push(
      <mesh key={k} geometry={GEO_BOLA} position={[p.x, p.y, p.z]} scale={r} dispose={null}>
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={brilho} flatShading />
      </mesh>,
    );
  }
  return <group>{itens}</group>;
};

// Cano reto em segmentos (cilindros) com juntas.
const Cano: React.FC<{pontos: Vec3[]; raio: number; cor: string; brilho?: string; intensidade?: number}> = ({pontos, raio, cor, brilho, intensidade = 0}) => {
  const segs = useMemo(
    () =>
      pontos.slice(1).map((b, i) => {
        const va = new Vector3(...pontos[i]);
        const vb = new Vector3(...b);
        const d = vb.clone().sub(va);
        const q = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), d.clone().normalize());
        const m = va.clone().add(vb).multiplyScalar(0.5);
        return {pos: [m.x, m.y, m.z] as Vec3, q, L: d.length()};
      }),
    [pontos],
  );
  const material = <meshStandardMaterial color={cor} emissive={brilho ?? cor} emissiveIntensity={intensidade} roughness={0.45} metalness={0.35} flatShading />;
  return (
    <group>
      {segs.map((s, i) => (
        <mesh key={i} position={s.pos} quaternion={s.q} castShadow>
          <cylinderGeometry args={[raio, raio, s.L, 8]} />
          {material}
        </mesh>
      ))}
      {pontos.slice(1, -1).map((p, i) => (
        <mesh key={`j${i}`} position={p}>
          <sphereGeometry args={[raio * 1.1, 8, 6]} />
          {material}
        </mesh>
      ))}
    </group>
  );
};

// Brilho (halo) atrás da grade quente.
const Halo: React.FC<{posicao: Vec3; escala: [number, number]; cor: string; opacidade: number}> = ({posicao, escala, cor, opacidade}) => {
  const tex = useMemo(() => texturaBrilho(), []);
  if (opacidade <= 0.01) {
    return null;
  }
  return (
    <sprite position={posicao} scale={[escala[0], escala[1], 1]} renderOrder={5}>
      <spriteMaterial map={tex} color={cor} transparent opacity={opacidade} depthWrite={false} toneMapped={false} />
    </sprite>
  );
};

// O circuito do gás (coordenadas da geladeira).
const corNoCondensador = (c: number) => (c < 0.5 ? misturarCor(QUENTE, LARANJA, c * 2) : misturarCor(LARANJA, LIQUIDO, (c - 0.5) * 2));
const CONDENSADOR_Y = [1.66, 1.46, 1.26, 1.06, 0.86, 0.66, 0.46];
const DESCARGA: Vertice[] = [v([0.2, 0.26, -0.5], QUENTE, 0.03), v([0.4, 0.3, -0.44], QUENTE, 0.031), v([0.4, 1.66, ZT], QUENTE, 0.032)];
const CONDENSADOR: Vertice[] = CONDENSADOR_Y.flatMap((y, i) => {
  const n = CONDENSADOR_Y.length;
  const x0 = i % 2 === 0 ? 0.34 : -0.34;
  return [v([x0, y, ZT], corNoCondensador(i / n), 0.032 - 0.01 * (i / n)), v([-x0, y, ZT], corNoCondensador((i + 1) / n), 0.032 - 0.01 * ((i + 1) / n))];
});
const CAPILAR: Vertice[] = [v([-0.39, 0.46, ZT], LIQUIDO, 0.02), v([-0.39, 1.38, ZT], LIQUIDO, 0.02), v([XE, 1.38, -0.25], FRIO, 0.026)];
const EVAPORADOR: Vertice[] = [
  v([XE, 1.38, 0.25], FRIO),
  v([XE, 1.49, 0.25], FRIO),
  v([XE, 1.49, -0.25], FRIO),
  v([XE, 1.6, -0.25], FRIO),
  v([XE, 1.6, 0.25], FRIO),
  v([XE, 1.71, 0.25], FRIO),
  v([XE, 1.71, -0.25], FRIO),
];
const SUCCAO: Vertice[] = [
  v([-0.3, 1.71, -0.47], MORNO),
  v([0.08, 1.71, -0.47], MORNO),
  v([0.08, 0.3, -0.47], MORNO),
  v([0.12, 0.2, -0.5], MORNO),
  v([0.2, 0.14, -0.5], misturarCor(MORNO, QUENTE, 0.5)),
];
const TRILHO_GELADEIRA = criarTrilho([...DESCARGA, ...CONDENSADOR, ...CAPILAR, ...EVAPORADOR, ...SUCCAO], true);
const pts = (vs: Vertice[]) => vs.map((x) => x.p);
const CANO_DESCARGA = [...pts(DESCARGA), CONDENSADOR[0].p];
const CANO_CONDENSADOR = pts(CONDENSADOR);
const CANO_CAPILAR = [CONDENSADOR[CONDENSADOR.length - 1].p, ...pts(CAPILAR), EVAPORADOR[0].p];
const CANO_EVAPORADOR = [CAPILAR[CAPILAR.length - 1].p, ...pts(EVAPORADOR)];
const CANO_SUCCAO = [EVAPORADOR[EVAPORADOR.length - 1].p, ...pts(SUCCAO)];
const ARAMES_X = [-0.3, -0.15, 0, 0.15, 0.3];

// Pontos das peças (coordenadas da geladeira), para rótulos e setas: use com pontoNaGeladeira.
export const PECAS_GELADEIRA = {
  // grade de trás (condensador), no meio
  condensador: [0, 1.06, ZT - 0.05] as Vec3,
  // compressor (o motor), em cima dele
  compressor: [POS_COMPRESSOR[0], 0.3, POS_COMPRESSOR[2]] as Vec3,
  // canos do congelador (evaporador), por dentro, na parede esquerda
  evaporador: [XE, 1.55, 0] as Vec3,
  // tubo capilar, atrás e à esquerda
  capilar: [-0.39, 0.9, ZT] as Vec3,
  // congelador e geladeira, no meio de cada um
  congelador: [0, 1.53, 0.05] as Vec3,
  comida: [0, 0.75, 0.05] as Vec3,
};

// Compressor (o motor da geladeira): cápsula preta com base. Base em y = 0, ~0,33 de altura. `vibrar` 0–1
// (tremidinha lenta de 4 mm, sem piscar), `quente` 0–1 (avermelha e brilha).
export const Compressor: React.FC<PropsTransformacao & {vibrar?: number; quente?: number}> = ({vibrar = 0, quente = 0, posicao, rotacao, escala = 1}) => {
  const frame = useCurrentFrame();
  const dx = Math.sin((frame / 10) * Math.PI * 2) * 0.004 * vibrar;
  const corpo = misturarCor(PRETO, '#5a1c16', quente);
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <mesh position-y={0.015} castShadow receiveShadow>
        <boxGeometry args={[0.28, 0.03, 0.24]} />
        <meshStandardMaterial color="#5b616d" flatShading />
      </mesh>
      <group position-x={dx}>
        <mesh position-y={0.135} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.2, 14]} />
          <meshStandardMaterial color={corpo} emissive={QUENTE} emissiveIntensity={0.5 * quente} roughness={0.5} metalness={0.3} flatShading />
        </mesh>
        <mesh position-y={0.235} castShadow>
          <sphereGeometry args={[0.1, 14, 7, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={corpo} emissive={QUENTE} emissiveIntensity={0.5 * quente} roughness={0.5} metalness={0.3} flatShading />
        </mesh>
        <mesh position={[0.11, 0.12, 0]}>
          <boxGeometry args={[0.04, 0.07, 0.07]} />
          <meshStandardMaterial color="#3a3f48" flatShading />
        </mesh>
      </group>
    </group>
  );
};

export type PartesGeladeira = {carcaca?: boolean; portas?: boolean; interior?: boolean; canos?: boolean; motor?: boolean};
const TODAS: PartesGeladeira = {carcaca: true, portas: true, interior: true, canos: true, motor: true};

export type PropsGeladeira = PropsTransformacao & {
  // 0–1: porta de baixo (geladeira) aberta. `portaDeCima`: a do congelador.
  porta?: number;
  portaDeCima?: number;
  // Lado das dobradiças (vista de frente).
  dobradica?: 'esquerda' | 'direita';
  // 0–1: corte — a parede direita (+x) sai (afasta e encolhe) e mostra o lado de dentro (prateleiras,
  // comida, gelo e os canos do congelador).
  corte?: number;
  // 0–1: grade de trás (condensador) quente, avermelhada e brilhando.
  calor?: number;
  // 0–1: canos do congelador (evaporador) cobertos de gelo.
  gelo?: number;
  // 0–1: compressor tremendo (motor ligado) · `motorQuente` 0–1: compressor esquentando.
  vibrar?: number;
  motorQuente?: number;
  // Quanto o gás já andou nos canos (m). Padrão: andando sempre (0,9 m/s). Para o motor ligar e desligar
  // sem saltos, use fluxoDoGas(frame, fps, ligado).
  fluxo?: number;
  // Tamanho das bolinhas do gás (0 = sem gás).
  bolinhas?: number;
  // Só algumas partes (vista explodida): {carcaca, portas, interior, canos, motor}. Padrão: todas.
  partes?: PartesGeladeira;
  cor?: string;
  corPorta?: string;
  children?: React.ReactNode;
};

// Distância andada pelo gás com o motor ligando e desligando: `ligado(quadro)` 0–1 (soma quadro a quadro, sem
// saltos). Ex.: o motor desliga em q → fluxoDoGas(frame, fps, (f) => 1 - progresso(f, q, q + 20)).
export const fluxoDoGas = (frame: number, fps: number, ligado: (quadro: number) => number = () => 1) => {
  let d = 0;
  for (let f = 0; f < frame; f++) {
    d += (VEL_GAS / fps) * ligado(f);
  }
  return d;
};

// Ponto local da geladeira (como em PECAS_GELADEIRA) → mundo, com a mesma posição, rotação e escala do objeto.
export const pontoNaGeladeira = (local: Vec3, {posicao = [0, 0, 0], rotacao = [0, 0, 0], escala = 1}: PropsTransformacao = {}): Vec3 => {
  const p = new Vector3(...local).multiplyScalar(escala).applyEuler(new Euler(...rotacao));
  return [posicao[0] + p.x, posicao[1] + p.y, posicao[2] + p.z];
};

export const Geladeira: React.FC<PropsGeladeira> = ({
  posicao,
  rotacao,
  escala = 1,
  porta = 0,
  portaDeCima = 0,
  dobradica = 'esquerda',
  corte = 0,
  calor = 0,
  gelo = 0,
  vibrar = 0,
  motorQuente = 0,
  fluxo,
  bolinhas = 1,
  partes = TODAS,
  cor = CARCACA,
  corPorta = PORTA,
  children,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {L, A, P, e, div, rod} = G;
  const dist = fluxo ?? (frame / fps) * VEL_GAS;
  const zPorta = P / 2 + 0.027;
  const hBaixo = div - 0.02 - (rod + 0.012);
  const hCima = A - (div + 0.03);
  const giroPorta = (k: number) => lim01(k) * 1.75 * (dobradica === 'esquerda' ? -1 : 1);
  const sx = dobradica === 'esquerda' ? 1 : -1;
  const corEvap = misturarCor(COBRE, GELO, gelo);
  const lado = lim01(corte);
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      {partes.carcaca ? (
        <group>
          {/* rodapé recuado (grade do pé) */}
          <mesh position={[0, rod / 2, -0.01]} receiveShadow>
            <boxGeometry args={[L - 0.04, rod, P - 0.08]} />
            <meshStandardMaterial color={RODAPE} flatShading />
          </mesh>
          {/* paredes */}
          <mesh position={[-L / 2 + e / 2, rod + (A - rod) / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[e, A - rod, P]} />
            <meshStandardMaterial color={cor} roughness={0.6} flatShading />
          </mesh>
          {lado < 0.97 ? (
            <mesh position={[L / 2 - e / 2 + lado * 0.9, rod + (A - rod) / 2 + lado * 0.25, 0]} scale={1 - lado} castShadow receiveShadow>
              <boxGeometry args={[e, A - rod, P]} />
              <meshStandardMaterial color={cor} roughness={0.6} flatShading />
            </mesh>
          ) : null}
          <mesh position={[0, A - e / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[L - 2 * e, e, P]} />
            <meshStandardMaterial color={cor} roughness={0.6} flatShading />
          </mesh>
          <mesh position={[0, rod + (A - rod - e) / 2, -P / 2 + e / 2]} castShadow receiveShadow>
            <boxGeometry args={[L - 2 * e, A - rod - e, e]} />
            <meshStandardMaterial color={cor} roughness={0.6} flatShading />
          </mesh>
          <mesh position={[0, rod + e / 2, e / 2]} receiveShadow>
            <boxGeometry args={[L - 2 * e, e, P - e]} />
            <meshStandardMaterial color={cor} roughness={0.6} flatShading />
          </mesh>
          {/* divisória congelador / geladeira */}
          <mesh position={[0, div, e / 2]} receiveShadow castShadow>
            <boxGeometry args={[L - 2 * e, 0.05, P - e]} />
            <meshStandardMaterial color="#e8edf2" roughness={0.6} flatShading />
          </mesh>
        </group>
      ) : null}
      {partes.portas ? (
        <group>
          {/* porta do congelador, presa na dobradiça */}
          <group position={[-sx * (L / 2), 0, zPorta - 0.025]} rotation-y={giroPorta(portaDeCima)}>
            <mesh position={[sx * (L / 2), div + 0.03 + hCima / 2, 0.025]} castShadow>
              <boxGeometry args={[L, hCima, 0.05]} />
              <meshStandardMaterial color={corPorta} roughness={0.35} metalness={0.25} flatShading />
            </mesh>
            <mesh position={[sx * (L - 0.08), div + 0.2, 0.075]}>
              <boxGeometry args={[0.035, 0.22, 0.03]} />
              <meshStandardMaterial color={PUXADOR} />
            </mesh>
          </group>
          {/* porta de baixo, presa na dobradiça */}
          <group position={[-sx * (L / 2), 0, zPorta - 0.025]} rotation-y={giroPorta(porta)}>
            <mesh position={[sx * (L / 2), rod + 0.012 + hBaixo / 2, 0.025]} castShadow>
              <boxGeometry args={[L, hBaixo, 0.05]} />
              <meshStandardMaterial color={corPorta} roughness={0.35} metalness={0.25} flatShading />
            </mesh>
            {/* prateleira da porta, por dentro */}
            <mesh position={[sx * (L / 2), 0.75, -0.04]}>
              <boxGeometry args={[L - 0.16, 0.12, 0.05]} />
              <meshStandardMaterial color="#e9eef3" flatShading />
            </mesh>
            <mesh position={[sx * (L - 0.08), div - 0.32, 0.075]}>
              <boxGeometry args={[0.035, 0.4, 0.03]} />
              <meshStandardMaterial color={PUXADOR} />
            </mesh>
          </group>
        </group>
      ) : null}
      {partes.interior ? (
        <group>
          {[0.5, 0.86].map((y) => (
            <mesh key={y} position={[0, y, 0.02]}>
              <boxGeometry args={[L - 2 * e - 0.02, 0.02, P - e - 0.12]} />
              <meshStandardMaterial color="#cfe3ee" roughness={0.3} flatShading />
            </mesh>
          ))}
          {/* comida: garrafa, pote, maçã e caixa de leite */}
          <group position={[-0.2, 0.51, 0.1]}>
            <mesh position-y={0.11}>
              <cylinderGeometry args={[0.045, 0.045, 0.22, 10]} />
              <meshStandardMaterial color="#3aa655" flatShading />
            </mesh>
            <mesh position-y={0.25}>
              <cylinderGeometry args={[0.018, 0.03, 0.07, 8]} />
              <meshStandardMaterial color="#3aa655" flatShading />
            </mesh>
          </group>
          <group position={[0.12, 0.51, -0.05]}>
            <mesh position-y={0.045}>
              <boxGeometry args={[0.18, 0.09, 0.13]} />
              <meshStandardMaterial color="#fafafa" flatShading />
            </mesh>
            <mesh position-y={0.1}>
              <boxGeometry args={[0.19, 0.022, 0.14]} />
              <meshStandardMaterial color="#e5383b" flatShading />
            </mesh>
          </group>
          <mesh position={[0.15, 0.925, 0.13]} castShadow>
            <icosahedronGeometry args={[0.055, 1]} />
            <meshStandardMaterial color="#d62828" flatShading />
          </mesh>
          <group position={[-0.16, 0.87, -0.08]}>
            <mesh position-y={0.1}>
              <boxGeometry args={[0.09, 0.2, 0.09]} />
              <meshStandardMaterial color="#ffffff" flatShading />
            </mesh>
            <mesh position-y={0.08}>
              <boxGeometry args={[0.092, 0.06, 0.092]} />
              <meshStandardMaterial color="#2f7dff" flatShading />
            </mesh>
          </group>
          {/* gelo no congelador */}
          {[
            [0.05, 0],
            [0.17, 0.02],
            [0.11, -0.1],
          ].map(([x, z], i) => (
            <mesh key={i} position={[x, div + 0.075, z]} rotation-y={i * 0.5}>
              <boxGeometry args={[0.09, 0.08, 0.09]} />
              <meshStandardMaterial color={GELO} emissive="#9fdcff" emissiveIntensity={0.2} flatShading />
            </mesh>
          ))}
        </group>
      ) : null}
      {partes.canos ? (
        <group>
          <Cano pontos={CANO_DESCARGA} raio={0.016} cor={COBRE} brilho={QUENTE} intensidade={0.15} />
          <Cano pontos={CANO_CONDENSADOR} raio={0.016} cor={misturarCor(GRADE, '#7a2a12', calor)} brilho={LARANJA} intensidade={0.9 * calor} />
          {ARAMES_X.map((x) => (
            <mesh key={x} position={[x, 1.04, ZT - 0.03]}>
              <cylinderGeometry args={[0.006, 0.006, 1.28, 5]} />
              <meshStandardMaterial color={misturarCor(GRADE, '#7a2a12', calor)} emissive={LARANJA} emissiveIntensity={0.6 * calor} />
            </mesh>
          ))}
          <Cano pontos={CANO_CAPILAR} raio={0.008} cor={COBRE} />
          <Cano pontos={CANO_EVAPORADOR} raio={0.016} cor={corEvap} brilho={FRIO} intensidade={0.45 * gelo} />
          <Cano pontos={CANO_SUCCAO} raio={0.016} cor={COBRE} />
          <Halo posicao={[0, 1.05, ZT - 0.12]} escala={[1.25, 1.75]} cor={LARANJA} opacidade={0.5 * calor} />
          <Bolinhas trilho={TRILHO_GELADEIRA} distancia={dist} escala={bolinhas} />
        </group>
      ) : null}
      {partes.motor ? <Compressor posicao={POS_COMPRESSOR} vibrar={vibrar} quente={motorQuente} /> : null}
      {children}
    </group>
  );
};
