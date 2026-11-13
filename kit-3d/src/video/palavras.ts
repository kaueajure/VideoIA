import type {PalavraNoTempo} from './linhaDoTempo';

// "Azul?" -> "azul", "Pôr" -> "por". Usado para casar palavras do código com a narração.
export const normalizarPalavra = (texto: string): string =>
  texto
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');

// Acha a n-ésima ocorrência de um trecho ("pôr do sol") na lista de palavras.
export const acharTrecho = (
  palavras: PalavraNoTempo[],
  trecho: string,
  ocorrencia = 1,
): {primeira: PalavraNoTempo; ultima: PalavraNoTempo} | null => {
  const alvo = trecho.split(/\s+/).map(normalizarPalavra).filter(Boolean);
  if (alvo.length === 0) {
    return null;
  }
  const normalizadas = palavras.map((p) => normalizarPalavra(p.texto));
  let achadas = 0;
  for (let i = 0; i + alvo.length <= normalizadas.length; i++) {
    if (alvo.every((t, j) => normalizadas[i + j] === t)) {
      achadas++;
      if (achadas === ocorrencia) {
        return {primeira: palavras[i], ultima: palavras[i + alvo.length - 1]};
      }
    }
  }
  return null;
};
