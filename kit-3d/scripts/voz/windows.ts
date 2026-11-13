// Voz provisória gratuita: SAPI do Windows (ex.: "Microsoft Maria Desktop", pt-BR).
// Serve para acertar ritmo e sincronia antes de gastar créditos no ElevenLabs.
// Os tempos por palavra são aproximados (pausas reais do áudio + tamanho das palavras).
import {execFile} from 'node:child_process';
import {mkdirSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {promisify} from 'node:util';
import type {Palavra} from '../../src/esquema';
import {ErroDeUso, RAIZ} from '../lib/projeto';
import {palavrasPorSilencio, trechosDeFala} from '../lib/silencio';

const executar = promisify(execFile);

export const gerarComWindows = async ({
  texto,
  voz,
  velocidade,
  arquivo,
}: {
  texto: string;
  voz: string;
  velocidade: number;
  arquivo: string;
}): Promise<{palavras: Palavra[]}> => {
  if (process.platform !== 'win32') {
    throw new ErroDeUso('A voz provisória usa o SAPI do Windows. Em outro sistema, use --provedor elevenlabs.');
  }
  const temporaria = path.join(RAIZ, '.tmp', `voz-${process.pid}-${Date.now()}`);
  mkdirSync(temporaria, {recursive: true});
  try {
    const entrada = path.join(temporaria, 'texto.txt');
    writeFileSync(entrada, texto, 'utf8');
    // SAPI vai de -10 a 10; cada passo muda ~10% da velocidade.
    const taxa = Math.max(-10, Math.min(10, Math.round((velocidade - 1) * 10 + 1e-9)));
    try {
      await executar('powershell.exe', [
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        path.join(__dirname, 'windows-sapi.ps1'),
        '-Entrada',
        entrada,
        '-Saida',
        arquivo,
        '-Voz',
        voz,
        '-Velocidade',
        String(taxa),
      ]);
    } catch (erro) {
      const saida = erro as {stderr?: string};
      throw new ErroDeUso(
        `A voz do Windows falhou (voz "${voz}"). Vozes instaladas: Configurações > Hora e idioma > Fala.\n${saida.stderr ?? erro}`,
      );
    }
    return {palavras: palavrasPorSilencio(texto, trechosDeFala(arquivo))};
  } finally {
    rmSync(temporaria, {recursive: true, force: true});
  }
};
