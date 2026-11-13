// Identidade visual do canal. O estilo e a cor de destaque vêm de src/config.ts (MARCA);
// as cores fixas ficam aqui. Mude lá e todos os vídeos acompanham.
import {getInputProps} from 'remotion';
import {MARCA} from '../config';
import {ESTILOS, type Estilo, type NomeEstilo} from './estilos';

export type Vec3 = [number, number, number];

// Outro visual sem mexer na config: `npm run estilo` (testes) e vídeos com "estilo" próprio no
// video.json (o render manda {estilo, destaque, assinatura} nas props).
const pedidoDaPrevia = (): {estilo?: unknown; destaque?: unknown; assinatura?: unknown} => {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    return getInputProps();
  } catch {
    return {};
  }
};

const pedido = pedidoDaPrevia();
const nomeDoEstilo: NomeEstilo =
  typeof pedido.estilo === 'string' && pedido.estilo in ESTILOS ? (pedido.estilo as NomeEstilo) : MARCA.estilo;

export const ESTILO: Estilo = ESTILOS[nomeDoEstilo];

// Nome da série no topo do vídeo e no rodapé da capa.
export const ASSINATURA = typeof pedido.assinatura === 'string' ? pedido.assinatura : MARCA.assinatura;

export const COR = {
  fundo: ESTILO.fundo,
  chao: ESTILO.chao,
  discoPalco: ESTILO.discoPalco,
  texto: ESTILO.texto,
  textoSuave: ESTILO.textoSuave,
  destaque: typeof pedido.destaque === 'string' ? pedido.destaque : (MARCA.destaque ?? ESTILO.destaque),
  ciano: '#38d9ff',
  azul: '#3b82ff',
  rosa: '#ff4d8d',
  verde: '#4ade80',
  laranja: '#ff8a3d',
  vermelho: '#ff4a4a',
  roxo: '#a06bff',
  branco: '#f4f6fb',
  cinza: '#8a93a8',
} as const;

// Tons de pele e combinações de roupa prontas para os bonecos.
export const PELE = ['#f2c7a5', '#e0a982', '#b97a55', '#7a4b33'] as const;

export const ROUPA = [
  {camiseta: COR.azul, calca: '#2b3245', cabelo: '#2a1d14'},
  {camiseta: COR.rosa, calca: '#262b3d', cabelo: '#141010'},
  {camiseta: COR.verde, calca: '#2e2a3a', cabelo: '#5a3418'},
  {camiseta: COR.laranja, calca: '#22324a', cabelo: '#d9b26a'},
  {camiseta: COR.roxo, calca: '#2b2f3a', cabelo: '#1c1c22'},
] as const;

// Área segura do Reels/Shorts/TikTok em 1080x1920 (px). Fora dela a interface do app cobre o vídeo.
export const AREA_SEGURA = {
  topo: 220,
  base: 420,
  esquerda: 60,
  direita: 140,
} as const;

export const LEGENDA = {
  tamanho: 80,
  maiusculas: true,
  // Centro vertical do bloco de legenda (px). Fica acima da interface inferior do app.
  centroY: 1300,
  larguraMaxima: 820,
  maxPalavras: 3,
  maxCaracteres: 16,
  // Quadros que a página segura depois da última palavra, quando há pausa.
  segura: 10,
  corAtiva: COR.destaque,
  contorno: 14,
} as const;
