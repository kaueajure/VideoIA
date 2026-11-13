// Converte os tempos que os provedores de voz devolvem em tempos por palavra.
import type {Palavra} from '../../src/esquema';

const LETRA_OU_NUMERO = /[\p{L}\p{N}]/u;
const arredondar = (s: number) => Math.round(s * 1000) / 1000;

// ElevenLabs /with-timestamps: um tempo de início e fim para cada caractere.
export type AlinhamentoElevenLabs = {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
};

export const palavrasDoAlinhamento = (alinhamento: AlinhamentoElevenLabs): Palavra[] => {
  const palavras: Palavra[] = [];
  let texto = '';
  let inicio: number | null = null;
  let fim = 0;
  const fechar = () => {
    if (texto) {
      if (inicio === null) {
        // Só pontuação ("—", "..."): gruda na palavra anterior.
        if (palavras.length > 0) {
          palavras[palavras.length - 1].texto += ` ${texto}`;
        }
      } else {
        palavras.push({texto, inicio: arredondar(inicio), fim: arredondar(Math.max(fim, inicio + 0.04))});
      }
    }
    texto = '';
    inicio = null;
    fim = 0;
  };
  // Tom da cena no perfil expressivo ("[excited] ..."): vai para a voz, mas não é palavra falada.
  let dentroDeTom = false;
  alinhamento.characters.forEach((c, i) => {
    if (c === '[') {
      fechar();
      dentroDeTom = true;
      return;
    }
    if (dentroDeTom) {
      dentroDeTom = c !== ']';
      return;
    }
    if (/\s/.test(c)) {
      fechar();
      return;
    }
    texto += c;
    if (LETRA_OU_NUMERO.test(c)) {
      if (inicio === null) {
        inicio = alinhamento.character_start_times_seconds[i];
      }
      fim = alinhamento.character_end_times_seconds[i];
    }
  });
  fechar();
  return palavras;
};
