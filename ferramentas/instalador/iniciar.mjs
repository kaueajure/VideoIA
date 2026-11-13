/** Gera somente o iniciador do sistema instalado, sem duplicar atalhos na área de trabalho. */
import fs from 'node:fs';
import path from 'node:path';

const NOMES = ['Iniciar (Linux).sh', 'Iniciar (Mac).command', 'Iniciar (Windows).cmd'];
export function criarIniciador({ studio, plataforma = process.platform } = {}) {
  const nome = { linux: NOMES[0], darwin: NOMES[1], win32: NOMES[2] }[plataforma];
  if (!nome) throw new Error(`Sistema não suportado: ${plataforma}`);
  const alvo = path.join(studio, nome);
  const conteudo = plataforma === 'win32'
    ? '@echo off\r\nsetlocal\r\ncd /d "%~dp0"\r\nset "ILU_SEM_MUDANCA=1"\r\npowershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0ferramentas\\instalador\\abrir.ps1" %*\r\nset "CODIGO=%ERRORLEVEL%"\r\nif not "%CODIGO%"=="0" pause\r\nexit /b %CODIGO%\r\n'
    : '#!/bin/bash\ncd "$(dirname "$0")" || exit 1\nexec /bin/bash ferramentas/instalador/abrir-unix "$@"\n';
  // Grava o novo antes de remover os antigos: uma falha não apaga o iniciador anterior.
  const tmp = alvo + '.tmp';
  fs.writeFileSync(tmp, conteudo, { mode: 0o755 });
  fs.renameSync(tmp, alvo);
  if (plataforma !== 'win32') fs.chmodSync(alvo, 0o755);
  for (const n of NOMES) if (n !== nome) fs.rmSync(path.join(studio, n), { force: true });
  for (const n of ['Abrir Estúdio (Mac).command', 'Abrir Estúdio (Windows).bat', 'Diagnóstico (Mac).command', 'Diagnóstico (Windows).bat', 'Iniciar (Linux).desktop']) fs.rmSync(path.join(studio, n), { force: true });
  return nome;
}
