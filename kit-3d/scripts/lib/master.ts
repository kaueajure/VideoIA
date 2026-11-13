// Master do áudio: normaliza o vídeo inteiro (voz + música + efeitos) para o padrão das redes
// (~-14 LUFS, pico -1,5 dBTP) em duas passadas do loudnorm. A imagem é copiada sem recodificar.
import {renameSync, rmSync} from 'node:fs';
import {AUDIO} from '../../src/config';
import {ffmpeg} from './ffmpeg';

type Medida = {input_i: string; input_tp: string; input_lra: string; input_thresh: string; target_offset: string};

const lerMedida = (saida: string): Medida => {
  const json = saida.slice(saida.lastIndexOf('{'), saida.lastIndexOf('}') + 1);
  return JSON.parse(json) as Medida;
};

// Vídeo sem nenhuma faixa de áudio (ex.: rascunho sem voz, sem trilha e sem efeitos): devolve null e não mexe.
export const masterizar = async (mp4: string): Promise<{antes: number; depois: number} | null> => {
  const alvo = `I=${AUDIO.loudnessAlvo}:TP=${AUDIO.picoMaximo}:LRA=11`;
  let medicao: string;
  try {
    medicao = await ffmpeg(['-i', mp4, '-vn', '-af', `loudnorm=${alvo}:print_format=json`, '-f', 'null', '-']);
  } catch (erro) {
    if (/does not contain any stream|matches no streams/i.test(String((erro as {stderr?: string}).stderr ?? erro))) {
      return null;
    }
    throw erro;
  }
  const medida = lerMedida(medicao);
  const temporario = mp4.replace(/\.mp4$/, '.master.mp4');
  const filtro =
    `loudnorm=${alvo}:measured_I=${medida.input_i}:measured_TP=${medida.input_tp}:measured_LRA=${medida.input_lra}` +
    `:measured_thresh=${medida.input_thresh}:offset=${medida.target_offset}:linear=true:print_format=json`;
  try {
    const saida = await ffmpeg([
      '-y',
      '-i',
      mp4,
      '-map',
      '0:v',
      '-map',
      '0:a',
      '-c:v',
      'copy',
      '-af',
      filtro,
      '-ar',
      '48000',
      '-c:a',
      'aac',
      '-b:a',
      '320k',
      '-movflags',
      '+faststart',
      temporario,
    ]);
    const final = JSON.parse(saida.slice(saida.lastIndexOf('{'), saida.lastIndexOf('}') + 1)) as {output_i: string};
    renameSync(temporario, mp4);
    return {antes: Number(medida.input_i), depois: Number(final.output_i)};
  } finally {
    rmSync(temporario, {force: true});
  }
};
