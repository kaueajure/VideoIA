// Detector de flicker no MP4 final: um pedaço da imagem que muda num quadro e volta no seguinte
// (A → B → A). É a marca de elemento piscando: superfícies brigando pela frente (z-fighting),
// objeto que aparece ou some por 1 quadro, transparência trocando de ordem, textura que não carregou.
// Lê o vídeo reduzido em tons de cinza pelo ffmpeg do Remotion, quadro a quadro, sem guardar tudo
// na memória.
import {spawn} from 'node:child_process';
import path from 'node:path';
import type {LinhaDoTempo} from '../../src/video/linhaDoTempo';

const L = 216; // 1080 / 5
const A = 384; // 1920 / 5
const BLOCO = 12;
const COLUNAS = L / BLOCO;
const LINHAS = A / BLOCO;
// Diferença média (0–255) para um bloco contar como "mudou".
const LIMIAR = 10;

export type TrechoComFlicker = {
  cena: string;
  inicio: number; // segundos no vídeo
  fim: number;
  quadros: number; // quantos quadros piscaram
  regiao: {x: [number, number]; y: [number, number]}; // em px do vídeo (1080 × 1920)
};

type Piscada = {quadro: number; blocos: number[]};

const diferencaPorBloco = (a: Uint8Array, b: Uint8Array): Float32Array => {
  const d = new Float32Array(COLUNAS * LINHAS);
  for (let y = 0; y < A; y++) {
    const linha = ((y / BLOCO) | 0) * COLUNAS;
    for (let x = 0; x < L; x++) {
      const i = y * L + x;
      d[linha + ((x / BLOCO) | 0)] += Math.abs(a[i] - b[i]);
    }
  }
  for (let k = 0; k < d.length; k++) d[k] /= BLOCO * BLOCO;
  return d;
};

const lerQuadros = async (mp4: string, aCada: (quadro: Uint8Array, n: number) => void): Promise<void> => {
  const cli = path.join(path.dirname(require.resolve('@remotion/cli')), '..', 'remotion-cli.js');
  const processo = spawn(
    process.execPath,
    [cli, 'ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', mp4, '-vf', `scale=${L}:${A}:flags=area,format=gray`, '-f', 'image2pipe', '-c:v', 'rawvideo', '-pix_fmt', 'gray', 'pipe:1'],
    {stdio: ['ignore', 'pipe', 'pipe']},
  );
  const tamanho = L * A;
  let resto: Buffer = Buffer.alloc(0);
  let n = 0;
  let erro = '';
  processo.stderr.on('data', (d: Buffer) => (erro += d.toString()));
  processo.stdout.on('data', (d: Buffer) => {
    resto = resto.length ? Buffer.concat([resto, d]) : d;
    while (resto.length >= tamanho) {
      aCada(Uint8Array.from(resto.subarray(0, tamanho)), n++);
      resto = resto.subarray(tamanho);
    }
  });
  await new Promise<void>((ok, falha) =>
    processo.on('close', (codigo) => (codigo === 0 ? ok() : falha(new Error(`ffmpeg não leu ${mp4}: ${erro.trim().slice(0, 300)}`)))),
  );
};

export const detectarFlicker = async (mp4: string, linha: LinhaDoTempo, fps: number): Promise<TrechoComFlicker[]> => {
  // Cortes e transições trocam a imagem inteira de propósito: ficam de fora (±3 quadros).
  const cortes = linha.cenas.map((c) => c.inicio);
  const pertoDeCorte = (q: number) => cortes.some((c) => Math.abs(q - c) <= 3);
  const cenaDoQuadro = (q: number) => [...linha.cenas].reverse().find((c) => q >= c.inicio)?.id ?? '?';

  const piscadas: Piscada[] = [];
  let q0: Uint8Array | null = null;
  let q1: Uint8Array | null = null;
  let d01: Float32Array | null = null;
  await lerQuadros(mp4, (q2, n) => {
    const d12 = q1 ? diferencaPorBloco(q1, q2) : null;
    if (q0 && q1 && d01 && d12 && !pertoDeCorte(n - 1)) {
      const d02 = diferencaPorBloco(q0, q2);
      const blocos: number[] = [];
      for (let k = 0; k < d02.length; k++) {
        const ida = d01[k];
        const volta = d12[k];
        if (ida > LIMIAR && volta > LIMIAR && d02[k] < 0.35 * Math.min(ida, volta)) blocos.push(k);
      }
      if (blocos.length) piscadas.push({quadro: n - 1, blocos});
    }
    q0 = q1;
    q1 = q2;
    d01 = d12;
  });

  // Um objeto rápido (um braço acenando) cruza um bloco em 1 quadro só e imita o A → B → A. O flicker
  // de verdade se repete no mesmo lugar: só conta o bloco que pisca de novo em até 8 quadros.
  const confirmadas = piscadas
    .map((p, i) => ({
      ...p,
      blocos: p.blocos.filter((b) => piscadas.some((o, j) => j !== i && Math.abs(o.quadro - p.quadro) <= 8 && o.blocos.includes(b))),
    }))
    .filter((p) => p.blocos.length > 0);

  if (process.env.FLICKER_DEBUG) {
    for (const p of confirmadas) console.log(`  quadro ${p.quadro} (${(p.quadro / fps).toFixed(2)} s): ${p.blocos.length} bloco(s)`);
  }
  // Junta piscadas próximas (até 1 s) da mesma cena num trecho.
  const trechos: Array<TrechoComFlicker & {ultimo: number}> = [];
  for (const p of confirmadas) {
    const cena = cenaDoQuadro(p.quadro);
    const xs = p.blocos.map((b) => (b % COLUNAS) * BLOCO * 5);
    const ys = p.blocos.map((b) => Math.floor(b / COLUNAS) * BLOCO * 5);
    const atual = trechos[trechos.length - 1];
    if (atual && atual.cena === cena && p.quadro - atual.ultimo <= fps) {
      atual.fim = (p.quadro + 1) / fps;
      atual.ultimo = p.quadro;
      atual.quadros++;
      atual.regiao.x = [Math.min(atual.regiao.x[0], ...xs), Math.max(atual.regiao.x[1], ...xs.map((x) => x + BLOCO * 5))];
      atual.regiao.y = [Math.min(atual.regiao.y[0], ...ys), Math.max(atual.regiao.y[1], ...ys.map((y) => y + BLOCO * 5))];
    } else {
      trechos.push({
        cena,
        inicio: p.quadro / fps,
        fim: (p.quadro + 1) / fps,
        ultimo: p.quadro,
        quadros: 1,
        regiao: {x: [Math.min(...xs), Math.max(...xs) + BLOCO * 5], y: [Math.min(...ys), Math.max(...ys) + BLOCO * 5]},
      });
    }
  }
  return trechos.map(({ultimo: _ultimo, ...t}) => t);
};

export const descreverFlicker = (trechos: TrechoComFlicker[]): string =>
  trechos
    .map(
      (t) =>
        `  ${t.cena.padEnd(22)} ${t.inicio.toFixed(2)}–${t.fim.toFixed(2)} s · ${t.quadros} quadro(s) piscando · x ${t.regiao.x[0]}–${t.regiao.x[1]}, y ${t.regiao.y[0]}–${t.regiao.y[1]} px`,
    )
    .join('\n');
