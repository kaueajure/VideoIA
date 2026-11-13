// Luz do dia em função da hora (0–24): cores do céu, do sol, da lua, da luz ambiente e da névoa.
// Usada pelo <Palco hora={...}> (luzes, fundo e névoa) e pelo CeuDoDia do Estúdio Pro (cúpula, sol, lua e
// estrelas). É função pura da hora: anime a hora pelo quadro e tudo acompanha, sem saltos.
//
// Caminho do sol (azimute 0): nasce ATRÁS da câmera (+z) às 6 h, passa alto (um pouco para +x) ao meio-dia e
// se põe DE FRENTE para a câmera (−z) às 18 h, então o pôr do sol cai dentro do quadro vertical. A lua faz um
// arco baixo de frente para a câmera durante a noite (dentro do quadro). `azimute` gira os dois caminhos.
import {Color} from 'three';
import type {Vec3} from '../tema';

export type LuzDaHora = {
  // Céu: cor no alto, no horizonte (a mesma da névoa) e do brilho em volta do sol no nascer e no pôr do sol.
  topo: string;
  horizonte: string;
  brilho: string;
  // 0–1: força do brilho em volta do sol.
  forcaDoBrilho: number;
  // Direções (unitárias) de onde vêm o sol e a lua; altura deles em graus (negativa = abaixo do horizonte).
  dirSol: Vec3;
  alturaSol: number;
  dirLua: Vec3;
  alturaLua: number;
  corSol: string;
  intensidadeSol: number;
  corLua: string;
  intensidadeLua: number;
  // Luz ambiente (hemisférica): cor que vem do céu, cor que vem do chão e intensidade.
  ambienteCeu: string;
  ambienteChao: string;
  intensidadeAmbiente: number;
  // Fator das luzes de preenchimento do Palco (contraluz, lateral e frontal): ~0,1 à noite, 1 de dia.
  preenchimento: number;
  // 0–1: estrelas visíveis.
  estrelas: number;
  // 0 = dia claro, 1 = noite fechada (janelas e postes acesos brilham mais).
  noite: number;
};

type Chave = {
  h: number;
  topo: string;
  horizonte: string;
  brilho: string;
  forcaDoBrilho: number;
  ambienteCeu: string;
  ambienteChao: string;
  intensidadeAmbiente: number;
  preenchimento: number;
  estrelas: number;
  noite: number;
};

const NOITE: Omit<Chave, 'h'> = {
  topo: '#050a1c',
  horizonte: '#16203c',
  brilho: '#16203c',
  forcaDoBrilho: 0,
  ambienteCeu: '#41558c',
  ambienteChao: '#0b0e18',
  intensidadeAmbiente: 0.5,
  preenchimento: 0.1,
  estrelas: 1,
  noite: 1,
};

const DIA: Omit<Chave, 'h'> = {
  topo: '#3a83d6',
  horizonte: '#a9d3f1',
  brilho: '#eef6ff',
  forcaDoBrilho: 0.15,
  ambienteCeu: '#cfe2ff',
  ambienteChao: '#6d6a5c',
  intensidadeAmbiente: 1.05,
  preenchimento: 1,
  estrelas: 0,
  noite: 0,
};

// Chaves do dia (hora → cores). Entre duas chaves a mistura é suave.
const CHAVES: Chave[] = [
  {h: 0, ...NOITE},
  {h: 4.6, ...NOITE},
  {
    h: 5.5,
    topo: '#1b2655',
    horizonte: '#6a5d86',
    brilho: '#d98a6a',
    forcaDoBrilho: 0.5,
    ambienteCeu: '#6670a8',
    ambienteChao: '#1a1622',
    intensidadeAmbiente: 0.6,
    preenchimento: 0.25,
    estrelas: 0.5,
    noite: 0.75,
  },
  {
    h: 6.2,
    topo: '#36589a',
    horizonte: '#f0a27a',
    brilho: '#ffae6e',
    forcaDoBrilho: 1,
    ambienteCeu: '#a9b6e0',
    ambienteChao: '#4a3b33',
    intensidadeAmbiente: 0.8,
    preenchimento: 0.55,
    estrelas: 0.05,
    noite: 0.25,
  },
  {
    h: 7.4,
    topo: '#4a84c8',
    horizonte: '#f1d0a8',
    brilho: '#ffd9a6',
    forcaDoBrilho: 0.6,
    ambienteCeu: '#c8d8f2',
    ambienteChao: '#615848',
    intensidadeAmbiente: 0.95,
    preenchimento: 0.85,
    estrelas: 0,
    noite: 0,
  },
  {h: 9.5, ...DIA},
  {h: 14.5, ...DIA},
  {
    h: 16.4,
    topo: '#4a80c4',
    horizonte: '#f0d4a6',
    brilho: '#ffd29a',
    forcaDoBrilho: 0.6,
    ambienteCeu: '#d6dcef',
    ambienteChao: '#665a48',
    intensidadeAmbiente: 1,
    preenchimento: 0.95,
    estrelas: 0,
    noite: 0,
  },
  {
    h: 17.4,
    topo: '#3a5494',
    horizonte: '#ffa25c',
    brilho: '#ff8a46',
    forcaDoBrilho: 1,
    ambienteCeu: '#e7b394',
    ambienteChao: '#4b3440',
    intensidadeAmbiente: 0.82,
    preenchimento: 0.75,
    estrelas: 0,
    noite: 0.1,
  },
  {
    h: 18.1,
    topo: '#2a3070',
    horizonte: '#d8706a',
    brilho: '#ff6f45',
    forcaDoBrilho: 0.85,
    ambienteCeu: '#a87e9a',
    ambienteChao: '#2c2134',
    intensidadeAmbiente: 0.65,
    preenchimento: 0.45,
    estrelas: 0.15,
    noite: 0.45,
  },
  {
    h: 18.8,
    topo: '#131a46',
    horizonte: '#55457a',
    brilho: '#a0566e',
    forcaDoBrilho: 0.45,
    ambienteCeu: '#5d6198',
    ambienteChao: '#141224',
    intensidadeAmbiente: 0.55,
    preenchimento: 0.22,
    estrelas: 0.55,
    noite: 0.8,
  },
  {h: 19.6, ...NOITE},
  {h: 24, ...NOITE},
];

const limitar = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const curva = (t: number) => t * t * (3 - 2 * t);
const degrau = (a: number, b: number, v: number) => curva(limitar((v - a) / (b - a)));
const misturar = (a: number, b: number, t: number) => a + (b - a) * t;
const RAD = Math.PI / 180;

const corA = new Color();
const corB = new Color();
const misturarCor = (a: string, b: string, t: number) => `#${corA.set(a).lerp(corB.set(b), t).getHexString()}`;

const girarY = ([x, y, z]: Vec3, graus: number): Vec3 => {
  const a = graus * RAD;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
};

// Cor e força da luz do sol pela altura dele no céu (graus).
const solPelaAltura = (altura: number) => {
  const cor =
    altura < 12 ? misturarCor('#ff6a3a', '#ffc68a', degrau(0, 12, altura)) : misturarCor('#ffc68a', '#fff3e2', degrau(12, 40, altura));
  const intensidade = 3.2 * degrau(-1.5, 6, altura) * (0.4 + 0.6 * degrau(2, 35, altura));
  return {cor, intensidade};
};

// Tudo o que muda com a hora (0–24; fora disso dá a volta no relógio).
export const luzDaHora = (hora: number, azimute = 0): LuzDaHora => {
  const h = ((hora % 24) + 24) % 24;
  let i = 0;
  while (i < CHAVES.length - 2 && h >= CHAVES[i + 1].h) {
    i++;
  }
  const a = CHAVES[i];
  const b = CHAVES[i + 1];
  const t = curva(limitar((h - a.h) / (b.h - a.h)));

  // Sol num grande círculo: nasce em +z, passa a 65° de altura (inclinado para +x) e se põe em −z.
  const teta = (Math.PI * (h - 6)) / 12;
  const inclinacao = 25 * RAD;
  const dirSol = girarY([Math.sin(teta) * Math.sin(inclinacao), Math.sin(teta) * Math.cos(inclinacao), Math.cos(teta)], azimute);
  const alturaSol = Math.asin(limitar(dirSol[1], -1, 1)) / RAD;

  // Lua: arco baixo de frente para a câmera entre 18 h e 6 h (de −10° a +10° de lado, até ~18° de altura).
  const u = (((h - 18) % 24) + 24) % 24 / 12;
  const lado = (-10 + 20 * (1 - Math.cos(Math.PI * u)) / 2) * RAD;
  const alturaLua = 5 + 13 * Math.sin(Math.PI * u);
  const al = alturaLua * RAD;
  const dirLua = girarY([Math.sin(lado) * Math.cos(al), Math.sin(al), -Math.cos(lado) * Math.cos(al)], azimute);

  const sol = solPelaAltura(alturaSol);
  const noite = misturar(a.noite, b.noite, t);
  return {
    topo: misturarCor(a.topo, b.topo, t),
    horizonte: misturarCor(a.horizonte, b.horizonte, t),
    brilho: misturarCor(a.brilho, b.brilho, t),
    forcaDoBrilho: misturar(a.forcaDoBrilho, b.forcaDoBrilho, t),
    dirSol,
    alturaSol,
    dirLua,
    alturaLua,
    corSol: sol.cor,
    intensidadeSol: sol.intensidade,
    corLua: '#9fb4ff',
    intensidadeLua: 0.55 * noite * degrau(-2, 4, alturaLua),
    ambienteCeu: misturarCor(a.ambienteCeu, b.ambienteCeu, t),
    ambienteChao: misturarCor(a.ambienteChao, b.ambienteChao, t),
    intensidadeAmbiente: misturar(a.intensidadeAmbiente, b.intensidadeAmbiente, t),
    preenchimento: misturar(a.preenchimento, b.preenchimento, t),
    estrelas: misturar(a.estrelas, b.estrelas, t),
    noite,
  };
};
