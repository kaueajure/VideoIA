// Agrupa as palavras da narração em "páginas" curtas de legenda (estilo Reels/TikTok).
import {LEGENDA} from '../kit/tema';
import type {LinhaDoTempo} from './linhaDoTempo';

// Quadros absolutos (do vídeo inteiro).
export type PalavraLegenda = {texto: string; inicio: number; fim: number};

export type PaginaLegenda = {
  inicio: number;
  fim: number;
  palavras: PalavraLegenda[];
};

type Opcoes = {
  maxPalavras?: number;
  maxCaracteres?: number;
  segura?: number;
};

const TERMINA_FRASE = /[.,!?…;:—]$/;

export const paginarLegendas = (
  linha: LinhaDoTempo,
  {maxPalavras = LEGENDA.maxPalavras, maxCaracteres = LEGENDA.maxCaracteres, segura = LEGENDA.segura}: Opcoes = {},
): PaginaLegenda[] => {
  const paginas: Array<PaginaLegenda & {limite: number}> = [];

  for (const cena of linha.cenas) {
    const limite = cena.inicio + cena.duracao;
    let atual: PalavraLegenda[] = [];
    const fechar = () => {
      if (atual.length > 0) {
        paginas.push({inicio: atual[0].inicio, fim: 0, palavras: atual, limite});
      }
      atual = [];
    };
    for (const p of cena.palavras) {
      const palavra = {texto: p.texto, inicio: cena.inicio + p.inicio, fim: cena.inicio + p.fim};
      const anterior = atual[atual.length - 1];
      const caracteres = atual.reduce((soma, w) => soma + w.texto.length + 1, 0) + palavra.texto.length;
      if (
        anterior &&
        (atual.length >= maxPalavras ||
          caracteres > maxCaracteres ||
          TERMINA_FRASE.test(anterior.texto) ||
          palavra.inicio - anterior.fim > 15)
      ) {
        fechar();
      }
      atual.push(palavra);
    }
    fechar();
  }

  return paginas.map(({limite, ...pagina}, i) => {
    const ultima = pagina.palavras[pagina.palavras.length - 1];
    const proxima = paginas[i + 1];
    let fim = ultima.fim + segura;
    if (proxima) {
      fim = Math.min(fim, proxima.inicio);
    }
    fim = Math.max(Math.min(fim, limite), ultima.fim);
    return {...pagina, fim};
  });
};
