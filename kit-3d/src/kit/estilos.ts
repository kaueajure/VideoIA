// Estilos visuais prontos. O canal escolhe um em src/config.ts (MARCA.estilo) e pode trocar
// só a cor de destaque (MARCA.destaque). Tudo o que é "do canal" sai daqui: fundo, chão,
// luzes, legenda, assinatura e capa. As cores dos objetos de cada cena continuam nas cenas.
// Para ver todos lado a lado: `npm run estilo -- --todos`.

export type Estilo = {
  nome: string;
  descricao: string;
  // Fundo do palco (e cor da névoa ao longe).
  fundo: string;
  chao: string;
  discoPalco: string;
  // Aro iluminado em volta do disco do palco.
  aro: string;
  // Linhas no chão (estilo "grade de neon"), ou null.
  grade: string | null;
  // Luzes: contraluz (contorno dos objetos), luz ambiente vinda do céu e do chão.
  contraluz: string;
  luzDoCeu: string;
  luzDoChao: string;
  luzAmbiente: number;
  // Multiplicador do holofote principal.
  holofote: number;
  // Cone de luz do holofote (0 = sem cone).
  feixe: string;
  feixeIntensidade: number;
  // Textos por cima do vídeo (legenda, títulos, números).
  texto: string;
  textoSuave: string;
  contornoTexto: string;
  sombraTexto: string;
  destaque: string;
  // Texto dentro de etiquetas pintadas com a cor de destaque.
  textoNoDestaque: string;
  // Escurecimento nas bordas: cor (r,g,b) e força.
  vinheta: string;
  forcaVinheta: number;
  // Assinatura no topo e trilho da barra de progresso.
  marca: string;
  trilhoBarra: string;
  // Degradê da capa por trás do título (r,g,b).
  degradeCapa: string;
  // Cor do "fade" de entrada de cena.
  fade: string;
};

export const ESTILOS = {
  noite: {
    nome: 'Noite',
    descricao: 'Palco escuro de teatro, holofote e legenda amarela. O clássico dos vídeos de curiosidade.',
    fundo: '#05070d',
    chao: '#0d1220',
    discoPalco: '#151c2e',
    aro: '#38d9ff',
    grade: null,
    contraluz: '#7aa2ff',
    luzDoCeu: '#a9bbff',
    luzDoChao: '#2a2638',
    luzAmbiente: 0.9,
    holofote: 1,
    feixe: '#cfe0ff',
    feixeIntensidade: 0.16,
    texto: '#ffffff',
    textoSuave: '#c9d1e6',
    contornoTexto: '#000000',
    sombraTexto: '0 8px 26px rgba(0,0,0,0.55)',
    destaque: '#ffd23f',
    textoNoDestaque: '#10131c',
    vinheta: '0,0,0',
    forcaVinheta: 1,
    marca: 'rgba(255,255,255,0.55)',
    trilhoBarra: 'rgba(255,255,255,0.12)',
    degradeCapa: '5,7,13',
    fade: '#000000',
  },
  papel: {
    nome: 'Papel',
    descricao: 'Fundo claro cor de papel, sombras suaves e destaque coral. Leve, didático, cara de livro ilustrado.',
    fundo: '#f2ece1',
    chao: '#e9e1d2',
    discoPalco: '#ddd2bf',
    aro: '#e4572e',
    grade: null,
    contraluz: '#ffd9b5',
    luzDoCeu: '#ffffff',
    luzDoChao: '#cbbda6',
    luzAmbiente: 1.35,
    holofote: 0.5,
    feixe: '#fff4e0',
    feixeIntensidade: 0,
    texto: '#1b1e2b',
    textoSuave: '#5b5f6e',
    contornoTexto: '#ffffff',
    sombraTexto: '0 6px 18px rgba(90,64,30,0.22)',
    destaque: '#e4572e',
    textoNoDestaque: '#ffffff',
    vinheta: '120,92,58',
    forcaVinheta: 0.4,
    marca: 'rgba(27,30,43,0.5)',
    trilhoBarra: 'rgba(27,30,43,0.12)',
    degradeCapa: '242,236,225',
    fade: '#f2ece1',
  },
  oceano: {
    nome: 'Oceano',
    descricao: 'Azul profundo, luz de água e destaque turquesa. Calmo e misterioso, bom para natureza e ciência.',
    fundo: '#031620',
    chao: '#05222d',
    discoPalco: '#0a3341',
    aro: '#3ff0d4',
    grade: null,
    contraluz: '#3fb8ff',
    luzDoCeu: '#a6f0ff',
    luzDoChao: '#0b2a33',
    luzAmbiente: 0.95,
    holofote: 1,
    feixe: '#c4f7ff',
    feixeIntensidade: 0.18,
    texto: '#ffffff',
    textoSuave: '#bfe4ee',
    contornoTexto: '#011018',
    sombraTexto: '0 8px 26px rgba(0,10,16,0.6)',
    destaque: '#3ff0d4',
    textoNoDestaque: '#032029',
    vinheta: '0,10,16',
    forcaVinheta: 1,
    marca: 'rgba(214,248,255,0.55)',
    trilhoBarra: 'rgba(255,255,255,0.12)',
    degradeCapa: '3,22,32',
    fade: '#000a10',
  },
  neon: {
    nome: 'Neon',
    descricao: 'Roxo quase preto, chão quadriculado, aro ciano e legenda rosa brilhante. Energia de games e tecnologia.',
    fundo: '#09051a',
    chao: '#110a26',
    discoPalco: '#1a1036',
    aro: '#2ff3ff',
    grade: '#7b3cff',
    contraluz: '#a855ff',
    luzDoCeu: '#c8a6ff',
    luzDoChao: '#1d0f33',
    luzAmbiente: 0.85,
    holofote: 1,
    feixe: '#f0b8ff',
    feixeIntensidade: 0.2,
    texto: '#ffffff',
    textoSuave: '#d6c9f2',
    contornoTexto: '#0a0418',
    sombraTexto: '0 0 30px rgba(255,61,242,0.55)',
    destaque: '#ff3df2',
    textoNoDestaque: '#16041f',
    vinheta: '5,0,15',
    forcaVinheta: 1,
    marca: 'rgba(255,200,250,0.6)',
    trilhoBarra: 'rgba(255,255,255,0.12)',
    degradeCapa: '9,5,26',
    fade: '#000000',
  },
} as const satisfies Record<string, Estilo>;

export type NomeEstilo = keyof typeof ESTILOS;
export const NOMES_ESTILOS = Object.keys(ESTILOS) as NomeEstilo[];
