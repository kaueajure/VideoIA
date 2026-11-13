// Onde está o "Meu Drive" do Google Drive para computador (o arquivo no Drive é opcional).
import {existsSync, readdirSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {ErroDeUso} from './projeto';

const NOMES = ['Meu Drive', 'My Drive'];

// null quando o Drive não está instalado/aberto e DRIVE_RAIZ não foi definido.
export const localizarDrive = (): string | null => {
  const pedida = process.env.DRIVE_RAIZ?.trim();
  if (pedida) {
    return existsSync(pedida) ? pedida : null;
  }
  if (process.platform === 'win32') {
    for (const letra of 'GHIJKLMNOPQRSTUVWXYZDEF') {
      for (const nome of NOMES) {
        const caminho = `${letra}:\\${nome}`;
        if (existsSync(caminho)) {
          return caminho;
        }
      }
    }
    return null;
  }
  // macOS: ~/Library/CloudStorage/GoogleDrive-<email>/Meu Drive
  const nuvem = path.join(os.homedir(), 'Library', 'CloudStorage');
  if (existsSync(nuvem)) {
    for (const conta of readdirSync(nuvem).filter((n) => n.startsWith('GoogleDrive-'))) {
      for (const nome of NOMES) {
        const caminho = path.join(nuvem, conta, nome);
        if (existsSync(caminho)) {
          return caminho;
        }
      }
    }
  }
  return null;
};

export const exigirDrive = (): string => {
  const pedida = process.env.DRIVE_RAIZ?.trim();
  if (pedida && !existsSync(pedida)) {
    throw new ErroDeUso(`DRIVE_RAIZ="${pedida}" não existe.`);
  }
  const raiz = localizarDrive();
  if (!raiz) {
    throw new ErroDeUso(
      'Não achei o Google Drive para computador (ex.: G:\\Meu Drive no Windows). Instale e abra o app, ou defina DRIVE_RAIZ no .env. Arquivar no Drive é opcional: o vídeo pronto continua em videos/<slug>/saida/.',
    );
  }
  return raiz;
};
