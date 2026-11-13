import {DURACAO} from '../config';

export type LimitesDuracao = {minima: number; maxima: number};

export type AvaliacaoDuracao = {
  segundos: number;
  ok: boolean;
  // Mensagem curta para o terminal ("1min32s, dentro de 1min10s–2min").
  resumo: string;
  // Quanto falta (negativo) ou sobra (positivo) em relação à faixa, em segundos.
  desvio: number;
};

export const formatarTempo = (s: number): string => {
  const total = Math.round(s);
  const min = Math.floor(total / 60);
  const seg = total % 60;
  return min > 0 ? `${min}min${String(seg).padStart(2, '0')}s` : `${seg}s`;
};

export const faixaDuracao = (limites: LimitesDuracao = DURACAO) => `${formatarTempo(limites.minima)}–${formatarTempo(limites.maxima)}`;

export const FAIXA_DURACAO = faixaDuracao();

// `limites`: a faixa própria do vídeo (`duracao` no video.json, ex.: anúncio de story) ou a do canal.
export const avaliarDuracao = (segundos: number, limites: LimitesDuracao = DURACAO): AvaliacaoDuracao => {
  const desvio = segundos < limites.minima ? segundos - limites.minima : segundos > limites.maxima ? segundos - limites.maxima : 0;
  const ok = desvio === 0;
  const faixa = faixaDuracao(limites);
  const resumo = ok
    ? `${formatarTempo(segundos)}, dentro de ${faixa}`
    : `${formatarTempo(segundos)}, ${desvio < 0 ? `faltam ${Math.ceil(-desvio)}s` : `sobram ${Math.ceil(desvio)}s`} para ${faixa}`;
  return {segundos, ok, resumo, desvio};
};
