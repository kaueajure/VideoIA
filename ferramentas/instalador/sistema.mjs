/** Dependências do sistema: verificação real, instalação apenas do que falta. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export function executar(cmd, args = [], opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (r.error || r.status !== 0) throw new Error(`${cmd} falhou: ${r.error?.message || `código ${r.status}`}`);
}
export function disponivel(cmd, args = ['--version']) {
  return spawnSync(cmd, args, { stdio: 'ignore', timeout: 30000 }).status === 0;
}
export function admin(cmd, args) {
  if (process.getuid?.() === 0) executar(cmd, args);
  else executar('sudo', [cmd, ...args]);
}
export function pacotesLinux(pacotes) {
  if (disponivel('apt-get')) { admin('apt-get', ['update']); admin('apt-get', ['install', '-y', ...pacotes]); }
  else if (disponivel('dnf')) admin('dnf', ['install', '-y', ...pacotes]);
  else if (disponivel('pacman')) admin('pacman', ['-S', '--needed', '--noconfirm', ...pacotes]);
  else if (disponivel('zypper')) admin('zypper', ['--non-interactive', 'install', ...pacotes]);
  else throw new Error('Linux sem gerenciador de pacotes suportado: apt, dnf, pacman ou zypper.');
}
function powershell(codigo) {
  executar('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', codigo]);
}
export function prepararGit({ simular = false, log = console.log, verificar = false } = {}) {
  if (process.platform === 'win32') {
    const dirs = [process.env.ProgramFiles, process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Programs')].filter(Boolean);
    for (const dir of dirs) for (const sub of ['cmd', 'bin']) {
      const bin = path.join(dir, 'Git', sub);
      if (fs.existsSync(bin)) process.env.PATH = `${bin}${path.delimiter}${process.env.PATH || ''}`;
    }
  }
  if (disponivel('git')) { log('Git já instalado e funcionando.'); return; }
  if (verificar) throw new Error('O Git não respondeu após a instalação.');
  if (simular) { log('Instalaria o Git ausente pelo gerenciador do sistema.'); return; }
  log('Instalando Git (pode solicitar autorização do sistema).');
  if (process.platform === 'linux') pacotesLinux(['git']);
  else if (process.platform === 'darwin') {
    let brew = ['/opt/homebrew/bin/brew', '/usr/local/bin/brew', 'brew'].find(p => disponivel(p));
    if (!brew) {
      // Instalador oficial do Homebrew; o próprio instalador prepara o Command Line Tools.
      const r = spawnSync('/usr/bin/curl', ['-fsSL', 'https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh'], { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 });
      if (r.status !== 0 || !r.stdout.trim()) throw new Error('Não foi possível baixar o instalador oficial do Homebrew.');
      executar('/bin/bash', ['-c', r.stdout]);
      brew = ['/opt/homebrew/bin/brew', '/usr/local/bin/brew'].find(p => disponivel(p));
    }
    if (!brew) throw new Error('Homebrew não ficou disponível.');
    executar(brew, ['install', 'git']);
    process.env.PATH = `${path.dirname(brew)}:${process.env.PATH || ''}`;
  } else {
    // Dispensa winget: baixa a distribuição oficial e exige assinatura Authenticode válida.
    powershell(`$ErrorActionPreference='Stop'; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12;
$r=Invoke-RestMethod 'https://api.github.com/repos/git-for-windows/git/releases/latest';
$a=$r.assets | Where-Object { $_.name -match '^Git-[0-9.]+-64-bit.exe$' } | Select-Object -First 1;
if (!$a) { throw 'Instalador oficial do Git não encontrado' };
$f=Join-Path $env:TEMP ([Guid]::NewGuid().ToString()+'.exe');
try { Invoke-WebRequest -UseBasicParsing $a.browser_download_url -OutFile $f;
$s=Get-AuthenticodeSignature -LiteralPath $f;
if ($s.Status -ne 'Valid' -or $s.SignerCertificate.Subject -notmatch 'Open Source Developer|Git for Windows') { throw 'Assinatura do Git não confere' };
$p=Start-Process -FilePath $f -ArgumentList '/VERYSILENT','/NORESTART','/CURRENTUSER' -PassThru -Wait;
if ($p.ExitCode -notin @(0,3010)) { throw 'Instalação do Git falhou' }
} finally { Remove-Item -LiteralPath $f -Force -ErrorAction SilentlyContinue }`);
    return prepararGit({ simular: false, log: (t) => log(t), /* verificação abaixo evita repetição */ verificar: true });
  }
  if (!disponivel('git')) throw new Error('O Git foi instalado, mas não responde a git --version.');
}

export function bibliotecasChromium(executavel, { simular = false, log = console.log } = {}) {
  if (process.platform !== 'linux') return;
  if (simular) { log('Conferiria e instalaria somente as bibliotecas ausentes do Chromium.'); return; }
  const r = spawnSync('ldd', [executavel], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`Não consegui conferir as bibliotecas do Chromium: ${r.stderr || r.error?.message || ''}`);
  if (!/not found/.test(r.stdout)) { log('Bibliotecas do Chromium já instaladas.'); return; }
  log('Instalando bibliotecas ausentes do Chromium (pode solicitar senha do sistema).');
  if (disponivel('apt-get')) {
    const cli = path.resolve('node_modules/playwright/cli.js');
    // Playwright conhece os pacotes necessários à versão do navegador instalada.
    admin(process.execPath, [cli, 'install-deps', 'chromium']);
  } else if (disponivel('dnf')) pacotesLinux(['nss', 'atk', 'at-spi2-atk', 'cups-libs', 'libdrm', 'libXcomposite', 'libXdamage', 'libXfixes', 'libXrandr', 'mesa-libgbm', 'libxkbcommon', 'alsa-lib', 'pango', 'cairo', 'google-noto-sans-fonts']);
  else if (disponivel('pacman')) pacotesLinux(['nss', 'atk', 'at-spi2-core', 'cups', 'libdrm', 'libxcomposite', 'libxdamage', 'libxfixes', 'libxrandr', 'mesa', 'libxkbcommon', 'alsa-lib', 'pango', 'cairo', 'noto-fonts']);
  else if (disponivel('zypper')) pacotesLinux(['mozilla-nss', 'libatk-1_0-0', 'at-spi2-core', 'libcups2', 'libdrm2', 'libXcomposite1', 'libXdamage1', 'libXfixes3', 'libXrandr2', 'libgbm1', 'libxkbcommon0', 'libasound2', 'pango', 'cairo', 'google-noto-sans-fonts']);
  else throw new Error('Gerenciador de pacotes não suportado para instalar as bibliotecas do Chromium.');
  const depois = spawnSync('ldd', [executavel], { encoding: 'utf8' });
  if (depois.status !== 0 || /not found/.test(depois.stdout)) throw new Error(`Ainda faltam bibliotecas do Chromium: ${depois.stdout}`);
}

export function prepararRuntimeWindows({ simular = false, log = console.log } = {}) {
  if (process.platform !== 'win32') return;
  const sys = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32');
  if (['vcruntime140.dll', 'msvcp140.dll', 'vcruntime140_1.dll'].every(n => fs.existsSync(path.join(sys, n)))) { log('Runtime Visual C++ já instalado.'); return; }
  if (simular) { log('Instalaria Microsoft Visual C++ Runtime x64 ausente.'); return; }
  log('Instalando Microsoft Visual C++ Runtime x64 (pode solicitar autorização do Windows).');
  powershell(`$ErrorActionPreference='Stop'; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12;
$f=Join-Path $env:TEMP ([Guid]::NewGuid().ToString()+'.exe');
try { Invoke-WebRequest -UseBasicParsing 'https://aka.ms/vs/17/release/vc_redist.x64.exe' -OutFile $f;
$s=Get-AuthenticodeSignature -LiteralPath $f;
if ($s.Status -ne 'Valid' -or $s.SignerCertificate.Subject -notmatch 'Microsoft Corporation') { throw 'Assinatura do runtime Microsoft não confere' };
$p=Start-Process -FilePath $f -ArgumentList '/install','/quiet','/norestart' -Verb RunAs -PassThru -Wait;
if ($p.ExitCode -notin @(0,1638,3010)) { throw ('Runtime falhou: '+$p.ExitCode) }
if ($p.ExitCode -eq 3010) { Write-Host 'O Windows pode precisar ser reiniciado para carregar o runtime.' }
} finally { Remove-Item -LiteralPath $f -Force -ErrorAction SilentlyContinue }`);
}
