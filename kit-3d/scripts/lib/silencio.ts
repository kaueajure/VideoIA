// Alinhamento aproximado para áudios sem tempos por palavra (voz do Windows):
// acha as pausas reais no WAV, casa as maiores com a pontuação do texto e
// distribui as palavras de cada frase pelo tamanho delas.
import {readFileSync} from 'node:fs';
import type {Palavra} from '../../src/esquema';

type Trecho = {inicio: number; fim: number};

const lerWavPcm16 = (arquivo: string): {taxa: number; amostras: Int16Array} => {
  const b = readFileSync(arquivo);
  if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error(`${arquivo} não é um WAV`);
  }
  let taxa = 0;
  let canais = 1;
  let bits = 16;
  let i = 12;
  while (i + 8 <= b.length) {
    const id = b.toString('ascii', i, i + 4);
    const tamanho = b.readUInt32LE(i + 4);
    if (id === 'fmt ') {
      canais = b.readUInt16LE(i + 10);
      taxa = b.readUInt32LE(i + 12);
      bits = b.readUInt16LE(i + 22);
    } else if (id === 'data') {
      if (bits !== 16) {
        throw new Error(`WAV de ${bits} bits não suportado (esperado 16)`);
      }
      const total = Math.floor(tamanho / 2 / canais);
      const amostras = new Int16Array(total);
      for (let k = 0; k < total; k++) {
        amostras[k] = b.readInt16LE(i + 8 + k * 2 * canais);
      }
      return {taxa, amostras};
    }
    i += 8 + tamanho + (tamanho % 2);
  }
  throw new Error(`${arquivo}: bloco de dados não encontrado`);
};

// Trechos com voz (separados por silêncios de pelo menos `silencioMinimo` segundos).
export const trechosDeFala = (arquivo: string, silencioMinimo = 0.09): Trecho[] => {
  const {taxa, amostras} = lerWavPcm16(arquivo);
  const janela = Math.round(taxa * 0.01);
  const energia: number[] = [];
  for (let w = 0; w * janela < amostras.length; w++) {
    let soma = 0;
    const fim = Math.min(amostras.length, (w + 1) * janela);
    for (let k = w * janela; k < fim; k++) {
      soma += amostras[k] * amostras[k];
    }
    energia.push(Math.sqrt(soma / Math.max(1, fim - w * janela)));
  }
  const limiar = Math.max(250, Math.max(...energia) * 0.05);
  const trechos: Trecho[] = [];
  let inicio: number | null = null;
  let silencio = 0;
  energia.forEach((e, w) => {
    const t = w * 0.01;
    if (e >= limiar) {
      if (inicio === null) {
        inicio = t;
      }
      silencio = 0;
    } else if (inicio !== null) {
      silencio += 0.01;
      if (silencio >= silencioMinimo) {
        trechos.push({inicio, fim: t - silencio + 0.01});
        inicio = null;
        silencio = 0;
      }
    }
  });
  if (inicio !== null) {
    trechos.push({inicio, fim: energia.length * 0.01 - silencio});
  }
  return trechos;
};

const PAUSA_NO_TEXTO = /[,.;:!?…—]$/;

export const palavrasPorSilencio = (texto: string, trechos: Trecho[]): Palavra[] => {
  const tokens = texto.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0 || trechos.length === 0) {
    return [];
  }
  const peso = (t: string) => t.replace(/[^\p{L}\p{N}]/gu, '').length + 1.5;
  const pesoTotal = tokens.reduce((s, t) => s + peso(t), 0);

  // Fronteiras de frase no texto, com a fração do texto já lida até ali.
  const fronteiras: Array<{depoisDe: number; fracao: number}> = [];
  let acumulado = 0;
  tokens.forEach((t, i) => {
    acumulado += peso(t);
    if (i < tokens.length - 1 && PAUSA_NO_TEXTO.test(t)) {
      fronteiras.push({depoisDe: i, fracao: acumulado / pesoTotal});
    }
  });

  // Pausas entre trechos de voz, com a fração de fala já ocorrida antes delas.
  const falaTotal = trechos.reduce((s, t) => s + (t.fim - t.inicio), 0);
  let falaAntes = 0;
  const pausas = trechos.slice(1).map((t, i) => {
    falaAntes += trechos[i].fim - trechos[i].inicio;
    return {inicio: trechos[i].fim, fim: t.inicio, duracao: t.inicio - trechos[i].fim, fracao: falaAntes / falaTotal};
  });

  // Casa as pausas mais longas com a fronteira de frase mais próxima (em proporção).
  const usadas = new Set<number>();
  const pares: Array<{depoisDe: number; inicio: number; fim: number}> = [];
  for (const pausa of [...pausas].sort((a, b) => b.duracao - a.duracao)) {
    let melhor: (typeof fronteiras)[number] | null = null;
    for (const f of fronteiras) {
      if (!usadas.has(f.depoisDe) && Math.abs(f.fracao - pausa.fracao) < 0.15) {
        if (!melhor || Math.abs(f.fracao - pausa.fracao) < Math.abs(melhor.fracao - pausa.fracao)) {
          melhor = f;
        }
      }
    }
    if (melhor) {
      usadas.add(melhor.depoisDe);
      pares.push({depoisDe: melhor.depoisDe, inicio: pausa.inicio, fim: pausa.fim});
    }
  }
  pares.sort((a, b) => a.depoisDe - b.depoisDe);
  const coerentes = pares.filter((p, i) => i === 0 || p.inicio > pares[i - 1].inicio);

  // Distribui as palavras de cada bloco no intervalo de tempo dele.
  const palavras: Palavra[] = [];
  const arredondar = (s: number) => Math.round(s * 1000) / 1000;
  let primeiro = 0;
  let inicioBloco = trechos[0].inicio;
  for (let b = 0; b <= coerentes.length; b++) {
    const ultimo = b < coerentes.length ? coerentes[b].depoisDe : tokens.length - 1;
    const fimBloco = b < coerentes.length ? coerentes[b].inicio : trechos[trechos.length - 1].fim;
    const bloco = tokens.slice(primeiro, ultimo + 1);
    const pesoBloco = bloco.reduce((s, t) => s + peso(t), 0);
    let t = inicioBloco;
    for (const token of bloco) {
      const fatia = ((fimBloco - inicioBloco) * peso(token)) / pesoBloco;
      palavras.push({texto: token, inicio: arredondar(t), fim: arredondar(t + fatia * 0.94)});
      t += fatia;
    }
    primeiro = ultimo + 1;
    inicioBloco = b < coerentes.length ? coerentes[b].fim : fimBloco;
  }
  return palavras;
};
