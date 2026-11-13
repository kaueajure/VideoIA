// Poses dos bonecos. Cada pose é uma função do tempo (segundos), então pode ter movimento
// próprio (respirar, acenar, andar). Ângulos em radianos.
//
// Convenções (boneco de frente para a câmera):
//   "Esq" = membro do lado esquerdo da TELA (-X); "Dir" = lado direito da tela (+X).
//   braço X negativo = levanta para frente; braço Z = abre para o lado
//     (Dir: Z positivo abre; Esq: Z negativo abre; ±3.1 = braço reto para cima).
//   cotovelo X negativo = dobra o antebraço para frente/cima.
//   perna X negativo = perna para frente; joelho X positivo = dobra.
//   cabeça X negativo = olha para cima; Y gira; Z inclina.
import type {Vec3} from '../tema';

export type Pose = {
  altura: number;
  inclinacao: number;
  giroTronco: number;
  ladoTronco: number;
  cabeca: Vec3;
  bracoEsq: Vec3;
  cotoveloEsq: Vec3;
  bracoDir: Vec3;
  cotoveloDir: Vec3;
  pernaEsq: number;
  joelhoEsq: number;
  pernaDir: number;
  joelhoDir: number;
};

export const POSE_NEUTRA: Pose = {
  altura: 0,
  inclinacao: 0,
  giroTronco: 0,
  ladoTronco: 0,
  cabeca: [0, 0, 0],
  bracoEsq: [0, 0, -0.14],
  cotoveloEsq: [-0.18, 0, 0],
  bracoDir: [0, 0, 0.14],
  cotoveloDir: [-0.18, 0, 0],
  pernaEsq: 0,
  joelhoEsq: 0,
  pernaDir: 0,
  joelhoDir: 0,
};

// t = segundos desde o início da cena; tPose = segundos desde que esta pose começou.
type FuncaoPose = (t: number, tPose: number) => Partial<Pose>;

const respirar = (t: number): Partial<Pose> => ({
  inclinacao: Math.sin(t * 1.8) * 0.02,
  cabeca: [Math.sin(t * 1.1) * 0.03, Math.sin(t * 0.5) * 0.1, Math.sin(t * 0.7) * 0.04],
  bracoEsq: [Math.sin(t * 1.8) * 0.03, 0, -0.14 - Math.sin(t * 1.8) * 0.025],
  bracoDir: [Math.sin(t * 1.8 + 0.4) * 0.03, 0, 0.14 + Math.sin(t * 1.8) * 0.025],
});

const pulo = (tPose: number, altura = 0.18, duracao = 0.45) =>
  tPose < duracao ? Math.sin((tPose / duracao) * Math.PI) * altura : 0;

export const POSES = {
  parado: (t) => respirar(t),

  acenando: (t) => ({
    ...respirar(t),
    cabeca: [0.02, 0.12, -0.1],
    bracoDir: [-0.2, 0, 2.35 + Math.sin(t * 9) * 0.1],
    cotoveloDir: [0, 0, 0.65 + Math.sin(t * 9) * 0.45],
  }),

  apontando: (t) => ({
    ...respirar(t),
    giroTronco: 0.18,
    cabeca: [0, 0.5, 0],
    bracoDir: [-0.55, 0, 1.45 + Math.sin(t * 2) * 0.03],
    cotoveloDir: [-0.08, 0, 0.05],
  }),

  pensando: (t) => ({
    ...respirar(t),
    cabeca: [-0.12, -0.25 + Math.sin(t * 0.8) * 0.05, 0.16],
    // ângulos calculados para a mão chegar ao queixo
    bracoDir: [-1.05, 0, -0.73],
    cotoveloDir: [-1.72, 0, -0.64],
    bracoEsq: [-0.35, 0, 0.08],
    cotoveloEsq: [-1.45, 0, 0],
  }),

  surpreso: (t, tPose) => ({
    ...respirar(t),
    altura: pulo(tPose, 0.2),
    inclinacao: -0.08,
    cabeca: [-0.18, 0, 0],
    bracoEsq: [-0.1, 0, -2.45],
    cotoveloEsq: [0, 0, -0.35],
    bracoDir: [-0.1, 0, 2.45],
    cotoveloDir: [0, 0, 0.35],
  }),

  comemorando: (t) => ({
    altura: Math.abs(Math.sin(t * 4.5)) * 0.12,
    cabeca: [-0.15, Math.sin(t * 2) * 0.15, 0],
    bracoEsq: [0, 0, -2.75 - Math.sin(t * 9) * 0.22],
    cotoveloEsq: [0, 0, -0.3],
    bracoDir: [0, 0, 2.75 + Math.sin(t * 9) * 0.22],
    cotoveloDir: [0, 0, 0.3],
  }),

  andando: (t) => {
    const c = t * Math.PI * 2 * 1.1;
    return {
      altura: Math.abs(Math.sin(c)) * 0.035,
      inclinacao: 0.05,
      cabeca: [0.02, 0, Math.sin(c) * 0.03],
      pernaEsq: Math.sin(c) * 0.45,
      joelhoEsq: Math.max(0, Math.sin(c - 1.2)) * 0.7,
      pernaDir: -Math.sin(c) * 0.45,
      joelhoDir: Math.max(0, -Math.sin(c - 1.2)) * 0.7,
      bracoEsq: [-Math.sin(c) * 0.4, 0, -0.12],
      cotoveloEsq: [-0.35, 0, 0],
      bracoDir: [Math.sin(c) * 0.4, 0, 0.12],
      cotoveloDir: [-0.35, 0, 0],
    };
  },

  correndo: (t) => {
    const c = t * Math.PI * 2 * 1.7;
    return {
      altura: Math.abs(Math.sin(c)) * 0.09,
      inclinacao: 0.2,
      cabeca: [-0.12, 0, 0],
      pernaEsq: Math.sin(c) * 0.8,
      joelhoEsq: 0.35 + Math.max(0, Math.sin(c - 1)) * 1.1,
      pernaDir: -Math.sin(c) * 0.8,
      joelhoDir: 0.35 + Math.max(0, -Math.sin(c - 1)) * 1.1,
      bracoEsq: [-Math.sin(c) * 0.8, 0, -0.18],
      cotoveloEsq: [-1.4, 0, 0],
      bracoDir: [Math.sin(c) * 0.8, 0, 0.18],
      cotoveloDir: [-1.4, 0, 0],
    };
  },

  olhandoCima: (t) => ({
    ...respirar(t),
    inclinacao: -0.07,
    cabeca: [-0.6, Math.sin(t * 0.6) * 0.15, 0.05],
  }),

  explicando: (t) => ({
    ...respirar(t),
    cabeca: [Math.sin(t * 3.1) * 0.05, Math.sin(t * 1.3) * 0.14, Math.sin(t * 0.9) * 0.05],
    bracoEsq: [-0.35, 0, -0.28],
    cotoveloEsq: [-1.15 + Math.sin(t * 4) * 0.18, 0, 0],
    bracoDir: [-0.35, 0, 0.28],
    cotoveloDir: [-1.15 + Math.sin(t * 4 + 1.3) * 0.18, 0, 0],
  }),

  deOmbros: (t, tPose) => ({
    ...respirar(t),
    altura: pulo(tPose, 0.04, 0.3),
    cabeca: [0.05, 0, 0.18],
    bracoEsq: [-0.25, 0, -0.5],
    cotoveloEsq: [-1.3, 0, 0.6],
    bracoDir: [-0.25, 0, 0.5],
    cotoveloDir: [-1.3, 0, -0.6],
  }),
} satisfies Record<string, FuncaoPose>;

export type NomePose = keyof typeof POSES;

export const NOMES_POSES = Object.keys(POSES) as NomePose[];

export const avaliarPose = (nome: NomePose, t: number, tPose: number): Pose => ({
  ...POSE_NEUTRA,
  ...POSES[nome](t, tPose),
});

const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const mixVec = (a: Vec3, b: Vec3, k: number): Vec3 => [mix(a[0], b[0], k), mix(a[1], b[1], k), mix(a[2], b[2], k)];

export const misturarPoses = (a: Pose, b: Pose, k: number): Pose => ({
  altura: mix(a.altura, b.altura, k),
  inclinacao: mix(a.inclinacao, b.inclinacao, k),
  giroTronco: mix(a.giroTronco, b.giroTronco, k),
  ladoTronco: mix(a.ladoTronco, b.ladoTronco, k),
  cabeca: mixVec(a.cabeca, b.cabeca, k),
  bracoEsq: mixVec(a.bracoEsq, b.bracoEsq, k),
  cotoveloEsq: mixVec(a.cotoveloEsq, b.cotoveloEsq, k),
  bracoDir: mixVec(a.bracoDir, b.bracoDir, k),
  cotoveloDir: mixVec(a.cotoveloDir, b.cotoveloDir, k),
  pernaEsq: mix(a.pernaEsq, b.pernaEsq, k),
  joelhoEsq: mix(a.joelhoEsq, b.joelhoEsq, k),
  pernaDir: mix(a.pernaDir, b.pernaDir, k),
  joelhoDir: mix(a.joelhoDir, b.joelhoDir, k),
});
