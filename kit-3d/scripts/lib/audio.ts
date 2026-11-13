import {ALL_FORMATS, FilePathSource, Input} from 'mediabunny';

// Duração exata de um MP3/WAV em segundos.
export const duracaoDoAudio = async (arquivo: string): Promise<number> => {
  const entrada = new Input({source: new FilePathSource(arquivo), formats: ALL_FORMATS});
  try {
    return await entrada.computeDuration();
  } finally {
    entrada.dispose();
  }
};
