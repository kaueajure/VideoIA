// Transforma roteiro (video.json) + narração (narracao.json) em quadros.
// Função pura: usada pelo Remotion e também pelos scripts Node (SRT, status).
import {RITMO, VOZ} from '../config';
import type {Narracao, Palavra, Transicao, Video} from '../esquema';

// Tempos em quadros, relativos ao início da cena.
export type PalavraNoTempo = {
  texto: string;
  inicio: number;
  fim: number;
};

export type EstadoNarracao =
  | 'gerada' // áudio existe e bate com o texto do roteiro
  | 'estimada' // ainda não há áudio: tempos estimados, cena muda
  | 'desatualizada' // há áudio, mas o texto do roteiro mudou depois
  | 'sem-fala'; // cena só visual

export type CenaNoTempo = {
  id: string;
  indice: number;
  // Quadro absoluto em que a cena começa no vídeo.
  inicio: number;
  duracao: number;
  // Quadro (relativo) em que termina a última palavra falada.
  fimDaFala: number;
  audio: string | null;
  palavras: PalavraNoTempo[];
  narracao: EstadoNarracao;
  transicao: Transicao;
  visual: string;
};

export type LinhaDoTempo = {
  cenas: CenaNoTempo[];
  duracao: number;
  // true quando todas as cenas com fala têm áudio gerado e atualizado.
  narracaoCompleta: boolean;
};

// Estima tempos de fala quando ainda não existe áudio (prévia antes da voz).
export const estimarPalavras = (
  texto: string,
  caracteresPorSegundo: number = RITMO.caracteresPorSegundo,
): {palavras: Palavra[]; duracao: number} => {
  const tokens = texto.trim().split(/\s+/).filter(Boolean);
  const palavras: Palavra[] = [];
  let t = 0.05;
  for (const token of tokens) {
    const dur = Math.max(0.14, (token.length + 1) / caracteresPorSegundo);
    palavras.push({texto: token, inicio: t, fim: t + dur * 0.9});
    t += dur;
    // Pausas da pontuação medidas em "caracteres", para acompanharem a velocidade da voz.
    if (/[.!?…]$/.test(token)) {
      t += 5 / caracteresPorSegundo;
    } else if (/[,;:—]$/.test(token)) {
      t += 2.5 / caracteresPorSegundo;
    }
  }
  return {palavras, duracao: t + 0.1};
};

export const calcularLinhaDoTempo = ({
  video,
  narracao,
  urlDoAudio,
  fps,
}: {
  video: Video;
  narracao: Narracao | null;
  // Converte o nome do arquivo de áudio numa URL utilizável (ou null se o arquivo sumiu).
  urlDoAudio: (arquivo: string) => string | null;
  fps: number;
}): LinhaDoTempo => {
  const emQuadros = (s: number) => Math.round(s * fps);
  const velocidadeVoz = video.voz.velocidade ?? VOZ.elevenlabs.configuracoes.speed;
  let cursor = 0;
  let narracaoCompleta = true;

  const cenas = video.cenas.map((cena, indice): CenaNoTempo => {
    const texto = cena.narracao.trim();
    const ultima = indice === video.cenas.length - 1;

    let estado: EstadoNarracao;
    let palavras: Palavra[] = [];
    let falaSegundos = 0;
    let audio: string | null = null;

    if (texto === '') {
      estado = 'sem-fala';
    } else {
      const gerada = narracao?.cenas.find((c) => c.id === cena.id) ?? null;
      const url = gerada ? urlDoAudio(gerada.arquivo) : null;
      if (gerada && url && gerada.texto === texto) {
        estado = 'gerada';
        palavras = gerada.palavras;
        falaSegundos = gerada.duracao;
        audio = url;
      } else {
        estado = gerada ? 'desatualizada' : 'estimada';
        narracaoCompleta = false;
        const estimativa = estimarPalavras(texto, RITMO.caracteresPorSegundo * velocidadeVoz);
        palavras = estimativa.palavras;
        falaSegundos = estimativa.duracao;
      }
    }

    let pausa = cena.pausaDepois ?? RITMO.respiroEntreCenas;
    if (ultima) {
      pausa = Math.max(pausa, RITMO.seguraFinal);
    }
    const duracao = Math.max(
      Math.ceil(falaSegundos * fps) + emQuadros(pausa),
      emQuadros(cena.duracaoMinima ?? 0),
      1,
    );

    const palavrasNoTempo = palavras.map((p) => {
      const inicio = emQuadros(p.inicio);
      return {texto: p.texto, inicio, fim: Math.max(inicio + 1, emQuadros(p.fim))};
    });

    const resultado: CenaNoTempo = {
      id: cena.id,
      indice,
      inicio: cursor,
      duracao,
      fimDaFala: palavrasNoTempo.length > 0 ? palavrasNoTempo[palavrasNoTempo.length - 1].fim : 0,
      audio,
      palavras: palavrasNoTempo,
      narracao: estado,
      transicao: cena.transicao,
      visual: cena.visual,
    };
    cursor += duracao;
    return resultado;
  });

  return {cenas, duracao: cursor, narracaoCompleta};
};
