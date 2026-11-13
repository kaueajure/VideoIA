// O CLI do Remotion traz um ffmpeg pronto (`remotion ffmpeg ...`), em qualquer sistema: o kit não
// precisa de ffmpeg instalado. Devolve o stderr (onde o ffmpeg escreve medidas e avisos).
import {execFile} from 'node:child_process';
import path from 'node:path';
import {promisify} from 'node:util';

const executar = promisify(execFile);

export const ffmpeg = async (args: string[]): Promise<string> => {
  // O pacote não exporta o arquivo do CLI; ele fica na raiz do pacote, ao lado de dist/.
  const cli = path.join(path.dirname(require.resolve('@remotion/cli')), '..', 'remotion-cli.js');
  const {stderr} = await executar(process.execPath, [cli, 'ffmpeg', '-hide_banner', '-nostats', ...args], {
    maxBuffer: 64 * 1024 * 1024,
  });
  return stderr;
};
