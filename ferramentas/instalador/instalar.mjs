/*
 * 
 * 
 */
/**
 * Instalador de um clique do Estudio de videos (a parte que roda com Node). Quem chama é o
 * "Instalar (Mac).command" ou o "Instalar (Windows).cmd", depois de garantir um Node (o do computador, se for 20
 * ou mais, ou um Node portátil baixado para .programas/node). Tudo fica dentro da pasta do estúdio, em
 * .programas/. Dependências do sistema podem solicitar senha de administrador.
 *
 *   node ferramentas/instalador/instalar.mjs              instala o que falta (FFmpeg, peças, navegador, alinhador)
 *   node ferramentas/instalador/instalar.mjs --simular    só mostra o que faria (baixa e grava nada)
 *   opções: --sem-alinhador  --so=alinhador|ffmpeg  --forcar  --sem-atalho
 *
 * Cada arquivo baixado é conferido pelo SHA-256 travado em fontes.mjs; se não bater, nada é instalado.
 * Mensagens em português simples; a barra de progresso é texto puro (funciona em qualquer janela).
 */
import fs from 'node:fs';
import { prepararGit, bibliotecasChromium, prepararRuntimeWindows } from './sistema.mjs';
import { criarIniciador } from './iniciar.mjs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { spawn, spawnSync } from 'node:child_process';
import { pipeline } from 'node:stream/promises';
import { Readable, Transform } from 'node:stream';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { FFMPEG, FFMPEG_VERSAO, NODE_VERSAO, plataforma } from './fontes.mjs';
import { extrairTarGz } from './tar.mjs';
import { anotar, ARQUIVOS } from '../../src/estudio/registro.mjs';
import { nodeServe, escolherNodeFilho, nodeAbre } from '../../src/video/node-versao.mjs';

const STUDIO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PROG = process.env.ILU_PROGRAMAS || path.join(STUDIO, '.programas');
const WIN = process.platform === 'win32';
const MAC = process.platform === 'darwin';
const PLAT = plataforma();
const args = process.argv.slice(2);
const tem = (k) => args.includes(`--${k}`);
const opcao = (k) => (args.find((a) => a.startsWith(`--${k}=`)) || '').split('=').slice(1).join('=');
const SIMULAR = tem('simular');
const SO = opcao('so');
const TTY = process.stdout.isTTY;

/* ---------------- texto na tela ---------------- */
// as últimas linhas ficam guardadas para o relatório de erro (0.6.12), que vai junto do aviso de falha
const LINHAS = [];
const escrever = (t = '') => { if (String(t).trim()) { LINHAS.push(String(t).slice(0, 300)); if (LINHAS.length > 40) LINHAS.shift(); if (!SIMULAR && !process.env.NODE_TEST_CONTEXT) anotar(STUDIO, ARQUIVOS.instalacao, t); } return process.stdout.write(t + '\n'); };
const ok = (t) => escrever(`   ok  ${t}`);
const aviso = (t) => escrever(`   !   ${t}`);
let ultimaBarra = -1;
function barra(fracao, texto) {
  const pct = Math.max(0, Math.min(100, Math.round(fracao * 100)));
  const cheio = Math.round(pct / 5);
  const linha = `   [${'#'.repeat(cheio)}${'.'.repeat(20 - cheio)}] ${String(pct).padStart(3)}%  ${texto}`;
  if (TTY) { process.stdout.write('\r' + linha.padEnd(78).slice(0, 110)); if (pct >= 100) process.stdout.write('\n'); return; }
  // fora de um terminal (estúdio web, testes): uma linha a cada 10%
  const passo = Math.floor(pct / 10);
  if (passo !== ultimaBarra) { ultimaBarra = passo; escrever(linha.trimEnd()); }
}
class Falha extends Error {
  // codigo (0.6.40): rótulo curto para o aviso anônimo de falha (ex.: pecas-sem-rede); sem ele, sai pela mensagem
  constructor(msg, oQueFazer, codigo = null) { super(msg); this.oQueFazer = oQueFazer; if (codigo) this.codigo = codigo; }
}

/* ---------------- utilidades ---------------- */
const sha256Arquivo = (f) => new Promise((res, rej) => { const h = crypto.createHash('sha256'); fs.createReadStream(f).on('data', (d) => h.update(d)).on('end', () => res(h.digest('hex'))).on('error', rej); });
const existe = (f) => { try { fs.accessSync(f); return true; } catch { return false; } };
const mb = (b) => (b / 1e6).toFixed(0);

/** Baixa url para destino mostrando progresso; confere o SHA-256. Tenta 3 vezes; na última, usa o curl do sistema. */
export async function baixar(url, destino, { sha256, rotulo = 'baixando', tentativas = 3, fetch: f = globalThis.fetch } = {}) {
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  const parcial = destino + '.baixando';
  let ultimoErro = null;
  for (let i = 1; i <= tentativas; i++) {
    try {
      if (i < tentativas || tentativas < 2 || !temCurl()) {
        const r = await f(url, { redirect: 'follow', signal: AbortSignal.timeout(30 * 60 * 1000) });
        if (!r.ok || !r.body) throw new Error(`o servidor respondeu ${r.status}`);
        const total = +r.headers.get('content-length') || 0;
        let feito = 0;
        const contador = new Transform({ transform(c, _e, cb) { feito += c.length; if (total) barra(feito / total, `${rotulo} (${mb(feito)} de ${mb(total)} MB)`); cb(null, c); } });
        await pipeline(Readable.fromWeb(r.body), contador, fs.createWriteStream(parcial));
        if (total) barra(1, `${rotulo} (${mb(total)} MB)`); else escrever(`   ${rotulo}: ${mb(feito)} MB`);
      } else {
        escrever(`   ${rotulo} (pelo curl do sistema)…`);
        const c = spawnSync('curl', ['-fL', '--retry', '2', '-sS', '-o', parcial, url], { stdio: ['ignore', 'inherit', 'inherit'], timeout: 30 * 60 * 1000 });
        if (c.status !== 0) throw new Error('o curl não conseguiu baixar');
      }
      if (sha256) {
        const h = await sha256Arquivo(parcial);
        if (h !== sha256) { fs.rmSync(parcial, { force: true }); throw new Falha(`O arquivo baixado de ${new URL(url).host} não é o esperado (impressão digital diferente).`, 'Por segurança, nada foi instalado. Tente de novo mais tarde; se repetir, fale com a gente no direct do Instagram @kaueajure.'); }
      }
      fs.renameSync(parcial, destino);
      return destino;
    } catch (e) {
      ultimoErro = e;
      if (e instanceof Falha) throw e;
      if (i < tentativas) escrever(`\n   !   a internet falhou (${e.message}); tentando de novo (${i + 1} de ${tentativas})…`);
    }
  }
  fs.rmSync(parcial, { force: true });
  throw new Falha(`Não consegui baixar de ${new URL(url).host}: ${ultimoErro?.message || 'erro de rede'}.`, 'Confira a internet (abra um site qualquer no navegador) e dê dois cliques em Instalar de novo. O que já foi instalado nos passos anteriores fica.');
}
const temCurl = () => spawnSync('curl', ['--version'], { encoding: 'utf8' }).status === 0;

/* 0.6.40: programas filhos vivos. Se a janela fecha ou a pessoa aperta Ctrl+C, a árvore inteira cai junto (npm e os filhos dele) */
const FILHOS = new Set();
let sinaisLigados = false;
/** Mata o processo e tudo o que ele abriu: no Windows, taskkill /T; no Mac e no Linux, o grupo de processos inteiro. */
export function matarArvore(p, win = WIN) {
  if (!p?.pid) return;
  try {
    if (win) spawnSync('taskkill', ['/PID', String(p.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
    else process.kill(-p.pid, 'SIGKILL');
  } catch { try { p.kill('SIGKILL'); } catch { /* já tinha saído */ } }
}
function ligarSinais() {
  if (sinaisLigados) return;
  sinaisLigados = true;
  const limpar = () => { for (const p of FILHOS) matarArvore(p); FILHOS.clear(); };
  process.on('exit', limpar);
  for (const [s, c] of [['SIGINT', 130], ['SIGTERM', 143], ['SIGHUP', 129]]) process.on(s, () => { limpar(); process.exit(c); });
}

/**
 * Roda um programa mostrando a saída dele, linha a linha (indentada). Resolve com { codigo, linhas, travou }.
 *  parado: ms sem NENHUMA saída antes de matar o processo (a árvore toda); resolve com { codigo: 124, travou: true }.
 *  limite: ms no total, com o mesmo resultado. 0 = sem limite (o comportamento de antes).
 *  envBase: ambiente de partida (padrão: o deste processo); env é somado por cima.
 */
export function rodar(cmd, argv, { cwd = STUDIO, env = {}, envBase = process.env, filtro = null, silencioso = false, parado = 0, limite = 0 } = {}) {
  return new Promise((res) => {
    const grupo = !WIN && (parado > 0 || limite > 0);
    let p;
    const linhas = [];
    let feito = false, travou = false, motivo = null;
    const timers = [];
    const fim = (r) => { if (feito) return; feito = true; timers.forEach(clearTimeout); FILHOS.delete(p); res(r); };
    try { p = spawn(cmd, argv, { cwd, env: { ...envBase, ...env }, shell: false, windowsHide: true, detached: grupo }); } catch (e) { linhas.push(String(e.message)); return fim({ codigo: 1, linhas, travou: false }); }
    if (grupo) { FILHOS.add(p); ligarSinais(); }
    const matar = (porque) => {
      if (feito || travou) return;
      travou = true; motivo = porque;
      linhas.push(porque === 'parado' ? `(o programa ficou ${Math.round(parado / 1000)} s sem responder e foi encerrado)` : `(o programa passou de ${Math.round(limite / 1000)} s e foi encerrado)`);
      matarArvore(p);
      // a saída do "close" pode não vir (neto segurando a saída): resolve mesmo assim
      timers.push(setTimeout(() => fim({ codigo: 124, linhas, travou: true, motivo }), 5000));
    };
    let vigia = null;
    const rearmar = () => { if (!parado) return; if (vigia) clearTimeout(vigia); vigia = setTimeout(() => matar('parado'), parado); timers.push(vigia); };
    rearmar();
    if (limite) timers.push(setTimeout(() => matar('limite'), limite));
    const junta = (b) => {
      rearmar();
      b.toString().split(/\r?\n|\r/).filter((l) => l.trim()).forEach((l) => {
        linhas.push(l);
        if (linhas.length > 4000) linhas.splice(0, 1000);
        if (silencioso) return;
        const t = filtro ? filtro(l) : l;
        if (t) escrever('   ' + t.slice(0, 160));
      });
    };
    p.stdout.on('data', junta); p.stderr.on('data', junta);
    p.on('error', (e) => { linhas.push(String(e.message)); fim({ codigo: 1, linhas, travou: false }); });
    p.on('close', (c) => fim(travou ? { codigo: 124, linhas, travou: true, motivo } : { codigo: c ?? 1, linhas, travou: false }));
  });
}

/** npm do próprio Node que está rodando (o portátil ou o do sistema). */
export function npmCli(execPath = process.execPath, win = WIN) {
  const cands = win
    ? [path.join(path.dirname(execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js')]
    : [path.join(path.dirname(execPath), '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js'), path.join(path.dirname(fs.realpathSync(execPath)), '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js'), '/usr/share/nodejs/npm/bin/npm-cli.js', '/usr/lib/node_modules/npm/bin/npm-cli.js'];
  return cands.find(existe) || null;
}
/**
 * PATH com a pasta do Node em uso na frente, no nome que o sistema usa (no Windows a variável costuma ser "Path", e
 * duas variáveis "PATH" e "Path" no mesmo ambiente deixam a escolha por conta do Windows).
 */
export function comNodeNoPath(env = process.env, execPath = process.execPath, sep = path.delimiter) {
  const chave = Object.keys(env).find((k) => k.toUpperCase() === 'PATH') || 'PATH';
  const dir = path.dirname(execPath);
  const atual = env[chave] || '';
  return { [chave]: atual.split(sep).includes(dir) ? atual : [dir, atual].filter(Boolean).join(sep) };
}
/**
 * 0.6.40: configuração do npm SÓ do estúdio (.programas/npmrc). O ~/.npmrc da pessoa (registro privado da empresa,
 * offline=true, ignore-scripts, token) e o npmrc global não entram: o npm lê este arquivo nos dois lugares. Proxy e
 * certificado da empresa vêm das variáveis de ambiente (HTTPS_PROXY, HTTP_PROXY, NO_PROXY, NODE_EXTRA_CA_CERTS), nunca do
 * ~/.npmrc. Devolve o caminho do arquivo.
 */
export function escreverNpmrc(dir = PROG, env = process.env) {
  const v = (k) => env[k] || env[k.toLowerCase()] || '';
  const linhas = ['registry=https://registry.npmjs.org/', 'fetch-retries=5', 'fetch-retry-mintimeout=2000', 'fetch-retry-maxtimeout=20000', 'fetch-timeout=60000', 'prefer-online=true', 'offline=false', 'audit=false', 'fund=false', 'update-notifier=false', 'ignore-scripts=false', 'progress=false'];
  if (v('HTTPS_PROXY')) linhas.push(`https-proxy=${v('HTTPS_PROXY')}`);
  if (v('HTTP_PROXY')) linhas.push(`proxy=${v('HTTP_PROXY')}`);
  if (v('NO_PROXY')) linhas.push(`noproxy=${v('NO_PROXY')}`);
  if (env.NODE_EXTRA_CA_CERTS && existe(env.NODE_EXTRA_CA_CERTS)) linhas.push(`cafile=${env.NODE_EXTRA_CA_CERTS}`);
  fs.mkdirSync(dir, { recursive: true });
  const arq = path.join(dir, 'npmrc');
  const conteudo = '# Configuração do npm só do Estudio de videos (o instalador regrava a cada vez).\n' + linhas.join('\n') + '\n';
  fs.writeFileSync(arq, conteudo);
  // o npm recusa o mesmo arquivo como configuração da pessoa e global: a global é uma cópia ao lado
  fs.writeFileSync(path.join(dir, 'npmrc-global'), conteudo);
  return arq;
}

/**
 * Ambiente completo do npm do instalador: sem nenhuma variável npm_config_* herdada (o "npm run" de quem chamou passa a
 * configuração da pessoa por elas), com a configuração própria, o cache dentro da pasta e o IPv4 primeiro (rede com IPv6
 * que não responde deixava o npm parado). Fica só npm_config_registry, quando alguém o põe de propósito (suporte, testes).
 * O cache fica na pasta do estúdio: quem já rodou "sudo npm" tem ~/.npm com dono root (EACCES).
 * 0.6.2: o Node que roda o instalador vai na frente do PATH (os scripts de instalação dos pacotes acham o node).
 */
export function ambienteNpm({ prog = PROG, env = process.env, execPath = process.execPath } = {}) {
  const base = {};
  for (const [k, val] of Object.entries(env)) if (!/^npm_config_/i.test(k) || k === 'npm_config_registry') base[k] = val;
  const npmrc = escreverNpmrc(prog, env);
  const nodeOpt = String(env.NODE_OPTIONS || '');
  return {
    ...base,
    ...(env.ILU_NPM_REGISTRO ? { npm_config_registry: env.ILU_NPM_REGISTRO } : {}),
    npm_config_userconfig: npmrc,
    npm_config_globalconfig: path.join(prog, 'npmrc-global'),
    npm_config_cache: path.join(prog, 'npm-cache'),
    npm_config_update_notifier: 'false',
    NODE_OPTIONS: /--dns-result-order/.test(nodeOpt) ? nodeOpt : [nodeOpt, '--dns-result-order=ipv4first'].filter(Boolean).join(' '),
    ...comNodeNoPath(env, execPath),
  };
}

/** Nome do pacote numa linha "http fetch GET 200 https://registro/<pacote>/-/<arquivo>.tgz" do npm (ou null). */
export function pacoteDoFetch(linha) {
  const m = /http fetch GET 2\d\d https?:\/\/\S+?\/((?:@[^/\s]+\/)?[^/\s@][^/\s]*)\/-\/\S+\.tgz/.exec(String(linha));
  return m ? decodeURIComponent(m[1]) : null;
}

/** Tira das linhas o que pode identificar a pessoa: pasta pessoal, usuário e senha em endereço, e-mail, token. */
export function sanearLinhas(linhas = [], casa = os.homedir()) {
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const reCasa = casa && casa.length > 3 ? new RegExp(esc(casa), 'gi') : null;
  return linhas.map((l) => {
    let t = String(l).slice(0, 300);
    if (reCasa) t = t.replace(reCasa, '~');
    return t.replace(/\/\/[^/\s:@]+:[^/\s@]+@/g, '//***@').replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '<e-mail>').replace(/(_auth(Token)?|token|authorization|bearer)([=:\s]+)\S+/gi, '$1$3***').replace(/([\\/])(Users|home)([\\/])[^\\/\s]+/gi, '$1$2$3~');
  });
}

/**
 * 0.6.40: por que o npm não baixou (as peças do estúdio ou o alinhador), pelas linhas dele. Função pura.
 * Devolve { codigo, causa, oQueFazer }; codigo é `${prefixo}-sem-rede`, `-dns`, `-proxy`, `-certificado`, `-registro`,
 * `-permissao`, `-disco`, `-travou` ou `-outro`, o mesmo rótulo que vai no aviso anônimo de falha.
 */
export function causaPecas(linhas = [], { travou = false, prefixo = 'pecas', oque = 'as peças do estúdio' } = {}) {
  const t = linhas.join('\n');
  const outraRede = 'Tente em outra rede (o 4G do celular roteado serve) e dê dois cliques em Instalar de novo.';
  const r = (s, causa, oQueFazer) => ({ codigo: `${prefixo}-${s}`, causa, oQueFazer });
  // 0.6.45 (telemetria `alinhador-permissao` com "ENOENT stat ...\_cacache\content-v2"): o cache do download perdeu arquivo no
  // meio (antivírus ou pasta sincronizada). Não é permissão da pasta: apagar o cache e baixar de novo resolve
  if (RE_CACHE_NPM.test(t) && !/ENOSPC|no space left/i.test(t)) return r('cache', `Os arquivos temporários do download de ${oque} estragaram no meio (o antivírus ou a sincronização da pasta mexeu neles).`, 'Dê dois cliques em Instalar de novo: eu apago esses arquivos sozinho e baixo outra vez. Se repetir, mova a pasta do estúdio para fora do OneDrive, iCloud e Downloads.');
  if (/EACCES|EPERM|EBUSY|operation not permitted|permission denied/i.test(t)) return r('permissao', `O computador (ou o antivírus) não deixou gravar ${oque} na pasta.`, 'Mova a pasta do estúdio para a sua pasta pessoal (fora de Downloads, OneDrive e iCloud) e dê dois cliques em Instalar de novo.');
  if (/ENOSPC|no space left/i.test(t)) return r('disco', `O disco encheu enquanto eu baixava ${oque}.`, 'Libere uns 5 GB (lixeira, downloads antigos) e dê dois cliques em Instalar de novo.');
  if (/SELF_SIGNED|UNABLE_TO_VERIFY|UNABLE_TO_GET_ISSUER|CERT_|certificate|unable to get local issuer/i.test(t)) return r('certificado', `A rede (de empresa, escola ou um antivírus que confere a internet) trocou o certificado de segurança e bloqueou ${oque}.`, outraRede);
  if (/proxy|\b407\b|ECONNREFUSED.*:(3128|8080|8888)\b/i.test(t)) return r('proxy', `O proxy da rede (de empresa ou escola) bloqueou ${oque}.`, outraRede);
  if (/ENOTFOUND|EAI_AGAIN|getaddrinfo/i.test(t)) return r('dns', `O computador não achou o endereço de onde vêm ${oque} (a internet caiu ou a rede bloqueia o site).`, 'Confira se a internet abre um site qualquer. ' + outraRede);
  if (/\bE40[134]\b|40[134] (Not Found|Unauthorized|Forbidden)|ETARGET|EINTEGRITY|No matching version/i.test(t)) return r('registro', `O site que guarda ${oque} recusou o download.`, 'Espere uns minutos e dê dois cliques em Instalar de novo. Se repetir, mande as últimas linhas desta janela no direct do Instagram @kaueajure.');
  if (/ECONNREFUSED|ETIMEDOUT|ECONNRESET|ENETUNREACH|EHOSTUNREACH|ENETDOWN|socket hang up|network|fetch failed|ERR_SOCKET/i.test(t)) return r('sem-rede', `A internet não deixou baixar ${oque} (caiu, está lenta ou a rede bloqueia).`, 'Confira se a internet abre um site qualquer. ' + outraRede);
  if (travou) return r('travou', `O download de ${oque} parou sem resposta (a rede segurou a conexão).`, outraRede);
  return r('outro', `Não consegui baixar ${oque}.`, 'Dê dois cliques em Instalar de novo. Se repetir, mande as últimas linhas desta janela no direct do Instagram @kaueajure.');
}

/** cache do npm estragado: arquivo que sumiu ou não confere dentro do _cacache (ou da pasta npm-cache do estúdio; o _logs, que o npm cita em toda falha, não conta) */
export const RE_CACHE_NPM = /_cacache|[\\/]npm-cache[\\/](?!_logs)|ECOMPROMISED|EINTEGRITY|integrity checksum failed|Integrity check failed/i;
/**
 * 0.6.45: apaga o cache do npm do estúdio. Se o antivírus ou a sincronização segurar o arquivo (EPERM/EBUSY), não para a
 * instalação: devolve uma pasta de cache nova, vazia, para a próxima tentativa. Devolve { cache, apagou }.
 */
export function limparCacheNpm(prog = PROG, { rm = fs.rmSync, agora = Date.now } = {}) {
  const atual = path.join(prog, 'npm-cache');
  try { rm(atual, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); return { cache: atual, apagou: true }; } catch {
    return { cache: path.join(prog, `npm-cache-${agora().toString(36)}`), apagou: false };
  }
}
/** 0.6.45: com as peças que vêm junto do estúdio (plano B), o npm usa o que já tem no cache sem conferir na internet (--prefer-offline) */
export const argumentosNpm = (argv, { planoB = false } = {}) => (planoB && !argv.includes('--prefer-offline') ? [...argv, '--prefer-offline'] : argv);
/** 0.6.45: com plano B, uma tentativa a mais só (limpa o cache e repete uma vez); sem ele, as 3 de sempre */
export const tentativasNpm = ({ planoB = false } = {}) => (planoB ? 2 : 3);

const msEnv = (k, padrao) => { const n = Number(process.env[k]); return Number.isFinite(n) && n >= 0 && process.env[k] !== '' && process.env[k] != null ? n : padrao; };
/**
 * npm ci com a configuração isolada, até 3 tentativas, sem nunca ficar parado: cada tentativa morre se ficar 2 minutos sem
 * nenhuma saída (ILU_NPM_PARADO_MS) ou passar de 10 minutos (ILU_NPM_LIMITE_MS); pausa de 3 e 6 s entre elas
 * (ILU_NPM_PAUSA_MS); na 2ª, apaga o cache e o que ficou pela metade (limpar). Mostra "baixando <pacote> (n de N)" e, a cada
 * 20 s sem novidade, "ainda baixando…". Devolve { ok, linhas (todas as tentativas), travou (a última) }.
 */
async function npmComTentativas(argv, { cwd = STUDIO, env = {}, total = 0, limpar = [], confere = () => true, planoB = false } = {}) {
  const parado = msEnv('ILU_NPM_PARADO_MS', 120000), limite = msEnv('ILU_NPM_LIMITE_MS', 600000), pausa = msEnv('ILU_NPM_PAUSA_MS', 3000);
  const todas = [], maxT = tentativasNpm({ planoB });
  argv = argumentosNpm(argv, { planoB });
  let ult = { travou: false, linhas: [] };
  for (let i = 1; i <= maxT; i++) {
    if (i > 1) {
      const cache = RE_CACHE_NPM.test((ult.linhas || []).join('\n'));
      escrever(`   ${cache ? 'os arquivos temporários do download estavam estragados; vou apagar e baixar de novo' : ult.travou ? 'o download parou sem resposta' : 'a internet falhou'}; tentando de novo (${i} de ${maxT})…`);
      await esperar(pausa * (i - 1));
      if (i === 2) {
        // 0.6.45: cache estragado ou preso pelo antivírus nunca para a instalação: apaga; se não der, usa uma pasta de cache nova
        const c = limparCacheNpm(PROG);
        if (!c.apagou) env = { ...env, npm_config_cache: c.cache };
        for (const d of limpar) try { fs.rmSync(d, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch { /* o npm ci refaz a pasta */ }
      }
    }
    const vistos = new Set();
    let ultimo = null, novidade = Date.now();
    const vida = setInterval(() => { if (Date.now() - novidade >= 20000) { novidade = Date.now(); escrever(`   ainda baixando…${ultimo ? ` (último: ${ultimo})` : ''}`); } }, 2000);
    const filtro = (l) => {
      const p = pacoteDoFetch(l);
      if (p) {
        if (vistos.has(p)) return null;
        vistos.add(p); ultimo = p; novidade = Date.now();
        return `baixando ${p} (${vistos.size} de ${Math.max(total, vistos.size)})`;
      }
      if (/^npm (http|timing|verbose|info|notice)\b/.test(l)) return null;
      // na tela, só o código do erro (uma linha por tentativa); as linhas completas ficam para a causa e o aviso de falha
      const cod = /^npm (?:ERR!|error) code (\S+)/.exec(l);
      return cod ? `motivo técnico: ${cod[1]}` : null;
    };
    try { ult = await npm(argv, { cwd, env, filtro, parado, limite }); } finally { clearInterval(vida); }
    todas.push(...ult.linhas);
    if (ult.codigo === 0 && confere()) return { ok: true, linhas: todas, travou: false };
    if (ult.codigo === 0) { todas.push('o npm terminou, mas as peças não carregam'); ult = { ...ult, travou: false }; }
  }
  return { ok: false, linhas: todas, travou: !!ult.travou };
}

async function npm(argv, opc = {}) {
  opc = { ...opc, envBase: ambienteNpm(), env: opc.env || {} };
  const cli = npmCli();
  if (cli) return rodar(process.execPath, [cli, ...argv], opc);
  // Windows: Node 20.12.2+ recusa rodar .cmd sem shell (spawn EINVAL); sem o npm do Node portátil, a pasta está incompleta
  if (WIN) throw new Falha('O Node usado pelo estúdio está incompleto (falta o npm).', 'Apague a pasta .programas dentro do estúdio e dê dois cliques em Instalar de novo. Se repetir, fale com a gente no direct do Instagram @kaueajure.');
  return rodar('npm', argv, opc);
}

/** FFmpeg utilizável (com libx264, loudnorm e ffprobe ao lado)? */
export function ffmpegServe(ffmpeg = 'ffmpeg', ffprobe = 'ffprobe') {
  const e = spawnSync(ffmpeg, ['-hide_banner', '-encoders'], { encoding: 'utf8' });
  if (e.status !== 0 || !/libx264/.test(e.stdout)) return false;
  const f = spawnSync(ffmpeg, ['-hide_banner', '-filters'], { encoding: 'utf8' });
  if (!/loudnorm/.test(f.stdout)) return false;
  return spawnSync(ffprobe, ['-version'], { encoding: 'utf8' }).status === 0;
}

/** Pasta dentro de OneDrive, iCloud, Google Drive ou Dropbox? (o render fica lento e pode travar) */
export const pastaSincronizada = (p) => /OneDrive|Mobile Documents|iCloud|Google ?Drive|Dropbox|CloudStorage/i.test(p);
/** Windows abriu o zip sem extrair? (a pasta fica num temporário e some) */
export const dentroDoZip = (p) => /[\\/]AppData[\\/]Local[\\/]Temp[\\/]/i.test(p) || /\.zip[\\/]/i.test(p);

/* ---------------- passos ---------------- */
const PASSOS = [];
const passo = (id, titulo, fn) => PASSOS.push({ id, titulo, fn });
const estado = { ffmpeg: null, alinhador: false, navegador: null, navegadorPasta: null, avisos: [] };

passo('computador', 'Conferindo o computador', async () => {
  if (!['darwin-arm64', 'darwin-x64', 'win32-x64', 'win32-arm64', 'linux-x64'].includes(PLAT)) throw new Falha(`Este computador (${PLAT}) não é suportado pelo estúdio.`, 'O estúdio funciona em Mac (Intel ou Apple) e Windows 10 ou 11 de 64 bits.');
  ok(`${{ darwin: 'Mac', win32: 'Windows', linux: 'Linux' }[process.platform]} (${process.arch}), Node ${process.versions.node}`);
  if (dentroDoZip(STUDIO)) throw new Falha('A pasta do estúdio ainda está dentro do .zip.', 'Feche esta janela. Clique com o botão direito no arquivo .zip, escolha "Extrair tudo" e depois dê dois cliques em Instalar dentro da pasta extraída.');
  if (pastaSincronizada(STUDIO)) { aviso('a pasta está dentro do OneDrive, iCloud, Google Drive ou Dropbox: o vídeo vai demorar muito mais.'); estado.avisos.push('Mova a pasta para a sua pasta pessoal (fora do OneDrive ou iCloud) quando puder.'); }
  try {
    const st = fs.statfsSync(STUDIO);
    const gb = (Number(st.bavail) * Number(st.bsize)) / 1e9;
    const minimo = +(process.env.ILU_DISCO_MIN_GB || 1.5);
    if (gb < minimo && SIMULAR) aviso(`só ${gb.toFixed(1)} GB livres no disco: a instalação de verdade pararia aqui (precisa de ${minimo} GB).`);
    else if (gb < minimo) throw new Falha(`Só ${gb.toFixed(1)} GB livres no disco.`, 'Libere pelo menos 3 GB (apague downloads e vídeos antigos, esvazie a lixeira) e dê dois cliques em Instalar de novo.');
    else if (gb < 3) { aviso(`${gb.toFixed(1)} GB livres: dá para instalar, mas os vídeos precisam de mais espaço. Libere uns 5 GB.`); estado.avisos.push('Libere espaço no disco (uns 5 GB) antes de fazer vídeos longos.'); } else ok(`${gb.toFixed(0)} GB livres no disco`);
  } catch (e) { if (e instanceof Falha) throw e; }
  try { fs.mkdirSync(PROG, { recursive: true }); fs.writeFileSync(path.join(PROG, '.teste'), 'ok'); fs.rmSync(path.join(PROG, '.teste')); } catch {
    throw new Falha('Não consigo gravar na pasta do estúdio.', 'Mova a pasta para a sua pasta pessoal (no Mac, a da casinha; no Windows, C:\\Users\\seu-nome) e dê dois cliques em Instalar de novo.');
  }
});

passo('git', 'Git e dependências do sistema', async () => { prepararGit({ simular: SIMULAR, log: escrever }); prepararRuntimeWindows({ simular: SIMULAR, log: escrever }); });

passo('ffmpeg', 'FFmpeg, o programa que junta imagem e som', async () => {
  const dir = path.join(PROG, 'ffmpeg');
  const exe = (n) => path.join(dir, n + (WIN ? '.exe' : ''));
  if (!tem('forcar') && existe(exe('ffmpeg')) && ffmpegServe(exe('ffmpeg'), exe('ffprobe'))) { estado.ffmpeg = 'portatil'; return ok('FFmpeg já instalado na pasta do estúdio'); }
  if (!tem('forcar') && !existe(exe('ffmpeg')) && ffmpegServe()) { estado.ffmpeg = 'sistema'; return ok('o FFmpeg deste computador serve; vou usar ele'); }
  const fonte = FFMPEG[PLAT];
  if (!fonte) throw new Falha(`Não há FFmpeg pronto para ${PLAT}.`, 'Fale com a gente no direct do Instagram @kaueajure.');
  if (SIMULAR) { for (const [n, a] of Object.entries(fonte)) escrever(`   baixaria ${n} ${FFMPEG_VERSAO}: ${a.url}\n     SHA-256 ${a.sha256} -> ${exe(n)}`); return; }
  for (const [n, a] of Object.entries(fonte)) {
    const gz = path.join(PROG, 'baixados', path.basename(new URL(a.url).pathname));
    if (!existe(gz)) await baixar(a.url, gz, { sha256: a.sha256, rotulo: `baixando o ${n}` });
    else if ((await sha256Arquivo(gz)) !== a.sha256) { fs.rmSync(gz); await baixar(a.url, gz, { sha256: a.sha256, rotulo: `baixando o ${n}` }); }
    fs.mkdirSync(dir, { recursive: true });
    const tmp = exe(n) + '.novo';
    await pipeline(fs.createReadStream(gz), zlib.createGunzip(), fs.createWriteStream(tmp, { mode: 0o755 }));
    fs.renameSync(tmp, exe(n));
    fs.chmodSync(exe(n), 0o755);
  }
  if (!ffmpegServe(exe('ffmpeg'), exe('ffprobe'))) {
    // 0.6.41 (telemetria de 08/11, Windows 11): dizia só "não abriu"; o código do Windows (0xC0000142 etc.) mostra o motivo e o caminho certo
    const t = spawnSync(exe('ffmpeg'), ['-version'], { encoding: 'utf8' });
    const cod = typeof t.status === 'number' && t.status > 0 ? `0x${(t.status < 0 ? t.status + 4294967296 : t.status).toString(16).toUpperCase()}` : t.error?.code || '';
    const msg = `O FFmpeg baixado não abriu neste computador${cod ? ` (erro ${cod})` : ''}.`;
    if (WIN) throw new Falha(msg, 'Passo 1: instale o "Visual C++ Redistributable x64" (aka.ms/vs/17/release/vc_redist.x64.exe) e reinicie o computador. Passo 2: libere a pasta do estúdio no antivírus (Segurança do Windows > Proteção contra vírus > Exclusões > adicionar a pasta "ilustrando"). Passo 3: dê dois cliques em Instalar de novo.', 'ffmpeg');
    throw new Falha(msg, MAC ? 'Feche esta janela, abra Ajustes do Sistema > Privacidade e Segurança, clique em "Abrir Mesmo Assim" se aparecer o ffmpeg, e dê dois cliques em Instalar de novo.' : 'Dê dois cliques em Instalar de novo. Se repetir, fale com a gente no direct do Instagram @kaueajure e diga que o FFmpeg não abriu.');
  }
  fs.rmSync(path.join(PROG, 'baixados'), { recursive: true, force: true });
  estado.ffmpeg = 'portatil';
  ok(`FFmpeg ${FFMPEG_VERSAO} instalado em .programas/ffmpeg`);
});

/** playwright e three carregam de verdade nesta pasta? (package.json certo não basta: npm ci interrompido deixa só ele) */
export const pecasCarregam = (studio = STUDIO) => spawnSync(process.execPath, ['--input-type=module', '-e', "await import('playwright'); await import('three');"], { cwd: studio, encoding: 'utf8', timeout: 60000 }).status === 0;
/** Peças de produção do package-lock.json (as opcionais só quando são deste sistema, como o fsevents do Mac). */
export function pecasDoLock(lock, plataforma = process.platform) {
  return Object.entries(lock.packages || {}).filter(([k, v]) => k.startsWith('node_modules/') && !v.dev && (!v.optional || !v.os || v.os.includes(plataforma)));
}
const sha256Buf = (b) => crypto.createHash('sha256').update(b).digest('hex');
/** As peças que vêm junto do estúdio (ferramentas/instalador/pecas), ou null se este pacote não as trouxer. */
export function lerEmbutidas(dir = path.join(STUDIO, 'ferramentas', 'instalador', 'pecas')) {
  try { const j = JSON.parse(fs.readFileSync(path.join(dir, 'pecas.json'), 'utf8')); return existe(path.join(dir, 'pecas.tgz')) && /^[0-9a-f]{64}$/.test(j.sha256) ? { ...j, dir } : null; } catch { return null; }
}

/**
 * 0.6.40, plano B sem internet: instala playwright, playwright-core e three a partir do pecas.tgz que vem no zip. Confere o
 * sha256 e as versões contra o package-lock.json, extrai numa pasta à parte (tar do sistema; sem ele, o leitor em Node puro),
 * troca as pastas em node_modules e confirma que playwright e three carregam. Devolve { ok, motivo, via }.
 */
export async function instalarPecasEmbutidas({ studio = STUDIO, prog = PROG, dir = path.join(studio, 'ferramentas', 'instalador', 'pecas'), usarTarDoSistema = true } = {}) {
  const emb = lerEmbutidas(dir);
  if (!emb) return { ok: false, motivo: 'este pacote não traz as peças embutidas' };
  const tgz = path.join(dir, 'pecas.tgz');
  if (sha256Buf(fs.readFileSync(tgz)) !== emb.sha256) return { ok: false, motivo: 'as peças embutidas não conferem (impressão digital diferente)' };
  let lock = {};
  try { lock = JSON.parse(fs.readFileSync(path.join(studio, 'package-lock.json'), 'utf8')); } catch { /* sem lock: confere só o carregamento */ }
  for (const [p, v] of Object.entries(emb.versoes || {})) {
    const pede = lock.packages?.[`node_modules/${p}`]?.version;
    if (pede && pede !== v) return { ok: false, motivo: `as peças embutidas são de outra versão (${p} ${v}; o estúdio pede ${pede})` };
  }
  const tmp = path.join(prog, 'pecas-extraidas');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  let via = null;
  if (usarTarDoSistema) {
    // Windows 10 e 11 trazem o tar.exe (bsdtar) em System32; pelo caminho completo, para não pegar o tar do Git ("C:" vira servidor)
    const tar = WIN ? path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe') : 'tar';
    const r = spawnSync(tar, ['-xzf', tgz, '-C', tmp], { windowsHide: true, timeout: 180000, stdio: 'ignore' });
    if (r.status === 0 && existe(path.join(tmp, 'node_modules', 'three', 'package.json'))) via = 'tar';
  }
  if (!via) {
    try { fs.rmSync(tmp, { recursive: true, force: true }); extrairTarGz(tgz, tmp); via = 'node'; } catch (e) { return { ok: false, motivo: `não consegui abrir as peças embutidas (${e.message})` }; }
  }
  try {
    fs.mkdirSync(path.join(studio, 'node_modules'), { recursive: true });
    for (const p of Object.keys(emb.versoes || {})) {
      const de = path.join(tmp, 'node_modules', p), para = path.join(studio, 'node_modules', p);
      if (!existe(de)) return { ok: false, motivo: `as peças embutidas não trazem ${p}` };
      fs.rmSync(para, { recursive: true, force: true });
      try { fs.renameSync(de, para); } catch { fs.cpSync(de, para, { recursive: true }); }
    }
  } catch (e) { return { ok: false, motivo: `não consegui gravar as peças na pasta (${e.code || e.message})` }; } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  if (!pecasCarregam(studio)) return { ok: false, motivo: 'as peças embutidas foram copiadas, mas não carregam' };
  return { ok: true, via };
}

/** Aviso anônimo de falha que NÃO para a instalação (plano B usado, alinhador que não veio). Nunca atrasa mais de 8 s. */
async function avisoAnonimo(etapa, codigo, linhas = []) {
  if (process.env.ILU_TELEMETRIA_PAI === '1' || SIMULAR || process.env.NODE_TEST_CONTEXT) return;
  try {
    const { registrarFalha } = await import('../../src/telemetria.mjs');
    const diagnostico = `Diagnóstico do Estudio de videos\nEtapa: ${etapa}\nCódigo: ${codigo}\n` + sanearLinhas(linhas.slice(-15)).join('\n');
    await Promise.race([registrarFalha({ raiz: STUDIO, etapa, codigo, diagnostico }), esperar(8000)]);
  } catch { /* o aviso nunca atrapalha */ }
}

passo('pecas', 'Peças do estúdio (three.js e o motor do navegador)', async () => {
  const lock = JSON.parse(fs.readFileSync(path.join(STUDIO, 'package-lock.json'), 'utf8'));
  const doLock = pecasDoLock(lock);
  const faltam = doLock.filter(([k, v]) => !v.optional).filter(([k, v]) => {
    try { return JSON.parse(fs.readFileSync(path.join(STUDIO, k, 'package.json'), 'utf8')).version !== v.version; } catch { return true; }
  });
  // npm ci interrompido (janela fechada, internet caiu) deixa o package.json e falta o resto: confere carregando de verdade
  if (!faltam.length && !tem('forcar') && pecasCarregam()) return ok('peças já instaladas');
  const emb = lerEmbutidas();
  if (SIMULAR) return escrever(`   rodaria: npm ci --omit=dev${emb ? ' --prefer-offline' : ''} (${faltam.length ? `${faltam.length} pacote(s) faltando ou diferentes do package-lock.json` : tem('forcar') ? 'reinstalação pedida com --forcar' : 'peças instaladas pela metade'}), com a configuração do npm só do estúdio (.programas/npmrc), até ${tentativasNpm({ planoB: !!emb })} tentativas (na 2ª, apaga o cache do download)\n   se a internet não deixar: ${emb ? `usaria as peças que vêm junto do estúdio (${Object.entries(emb.versoes || {}).map(([k, v]) => `${k} ${v}`).join(', ')})` : 'este pacote não traz as peças embutidas'}`);
  escrever('   baixando as peças (pode demorar até 3 minutos na primeira vez)…');
  const r = await npmComTentativas(['ci', '--omit=dev', '--no-audit', '--no-fund', '--loglevel=http', '--no-progress'], { total: doLock.length, limpar: [path.join(STUDIO, 'node_modules')], confere: () => pecasCarregam(), planoB: !!emb });
  if (r.ok) return ok('peças instaladas');
  const causa = causaPecas(r.linhas, { travou: r.travou });
  // plano B: as peças que vêm no zip (a internet ou o npm da pessoa não deixaram)
  escrever('   a internet não deixou baixar as peças; vou usar as que vêm junto do estúdio…');
  const b = await instalarPecasEmbutidas();
  if (b.ok) {
    await avisoAnonimo('instalador-pecas', `${causa.codigo}-plano-b`, r.linhas);
    return ok('a internet não deixou baixar; usei as peças que vêm junto do estúdio');
  }
  escrever(`   ${b.motivo}`);
  const ultimas = sanearLinhas(r.linhas.filter((l) => !/^npm (http fetch GET 2|timing|verbose|info)/.test(l)).slice(-12));
  throw Object.assign(new Falha(causa.causa, causa.oQueFazer, causa.codigo), { linhas: [...ultimas, `plano B: ${b.motivo}`] });
});

/**
 * Pasta onde o Playwright guarda o Chromium: a do ambiente, ou a padrão do sistema (Windows: %LOCALAPPDATA%\ms-playwright;
 * Mac: ~/Library/Caches/ms-playwright; Linux: ~/.cache/ms-playwright).
 */
export function pastaPadraoNavegadores({ plataforma = process.platform, env = process.env, casa = os.homedir() } = {}) {
  if (env.PLAYWRIGHT_BROWSERS_PATH) return env.PLAYWRIGHT_BROWSERS_PATH;
  if (plataforma === 'win32') return path.win32.join(env.LOCALAPPDATA || path.win32.join(casa, 'AppData', 'Local'), 'ms-playwright');
  if (plataforma === 'darwin') return path.join(casa, 'Library', 'Caches', 'ms-playwright');
  return path.join(env.XDG_CACHE_HOME || path.join(casa, '.cache'), 'ms-playwright');
}
/** Dá para criar e gravar um arquivo nesta pasta? (empresa e perfil travado às vezes não deixam) */
export function gravavel(dir) {
  try { fs.mkdirSync(dir, { recursive: true }); const f = path.join(dir, `.ilu-teste-${process.pid}`); fs.writeFileSync(f, 'ok'); fs.rmSync(f); return true; } catch { return false; }
}

/**
 * Por que o navegador não veio: a causa mais provável e o que fazer, pelas linhas do download e pelo disco. Nunca manda
 * repetir o mesmo passo para sempre: aponta o Google Chrome (que o estúdio usa sozinho) como saída.
 */
export function causaNavegador(linhas = [], { baixou = false, gbLivres = null, plataforma = process.platform } = {}) {
  const t = linhas.join('\n');
  const chrome = 'instale o Google Chrome (google.com/chrome) ou atualize o Microsoft Edge: o estúdio usa um deles sozinho, sem baixar mais nada';
  if (plataforma === 'linux' && baixou) return new Falha('O navegador baixou, mas não abre neste Linux.', 'Rode uma vez: sudo npx playwright install-deps chromium (instala as bibliotecas do sistema).');
  if ((gbLivres != null && gbLivres < 1) || /ENOSPC|no space left/i.test(t)) return new Falha('O disco está quase cheio, e o navegador interno (cerca de 210 MB) não coube.', 'Libere uns 5 GB (lixeira, downloads antigos) e tente de novo. Ou ' + chrome + '.');
  if (/EPERM|EBUSY|EACCES|operation not permitted|access is denied|acesso negado|virus|quarantin/i.test(t) || baixou) return new Falha(baixou ? 'O navegador interno baixou, mas o computador (provavelmente o antivírus) não deixou ele abrir.' : 'O computador (provavelmente o antivírus) bloqueou o navegador interno durante o download.', `O mais fácil: ${chrome}. Ou libere a pasta do estúdio no antivírus e tente de novo.`);
  if (/ENOTFOUND|ETIMEDOUT|ECONNRESET|ECONNREFUSED|EAI_AGAIN|socket hang up|getaddrinfo|network|certificate|SELF_SIGNED|UNABLE_TO_VERIFY|proxy|Download failed|server returned/i.test(t)) return new Falha('A internet caiu ou a rede (de empresa, escola ou com proxy) bloqueou o download do navegador interno.', `Tente em outra rede (o 4G do celular roteado serve) ou ${chrome}.`);
  return new Falha('Não consegui baixar o navegador interno, e não há Google Chrome nem Microsoft Edge neste computador.', `O mais fácil: ${chrome} e tente de novo. Se preferir esperar, tente mais tarde ou em outra rede.`);
}

const ARGS_NAV = ['--use-angle=swiftshader', '--use-gl=angle', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
/** O navegador abre com 3D? Usa o mesmo critério do motor: o Chromium do estúdio ou, sem ele, o Chrome ou o Edge. */
async function navegadorAbre() {
  try {
    const { chromium } = await import(pathToFileURL(path.join(STUDIO, 'node_modules', 'playwright', 'index.mjs')).href);
    const { conferirNavegador, esquecerEscolha } = await import(pathToFileURL(path.join(STUDIO, 'src', 'navegador.mjs')).href);
    esquecerEscolha();
    return await conferirNavegador(chromium, { args: ARGS_NAV, timeout: 60000 });
  } catch (e) { return { ok: false, webgl: false, escolhido: null, erro: e?.message || String(e) }; }
}
const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms));

passo('navegador', 'Navegador interno (Chromium), que desenha os quadros do vídeo', async () => {
  // 0.6.2: a pasta padrão do Playwright precisa deixar gravar; se não deixar, o Chromium vai para dentro da pasta do estúdio
  const local = path.join(PROG, 'ms-playwright');
  if (!process.env.PLAYWRIGHT_BROWSERS_PATH && (existe(local) || (!SIMULAR && !gravavel(pastaPadraoNavegadores())))) {
    process.env.PLAYWRIGHT_BROWSERS_PATH = local;
    if (!existe(local)) escrever('   a pasta padrão do navegador não deixa gravar; vou guardar ele dentro da pasta do estúdio (.programas/ms-playwright)');
  }
  const temPw = existe(path.join(STUDIO, 'node_modules', 'playwright'));
  const antes = temPw ? await navegadorAbre() : { ok: false };
  if (SIMULAR && process.platform === 'linux') bibliotecasChromium('', { simular: true, log: escrever });
  if (SIMULAR) return escrever(antes.ok && !antes.escolhido.reserva ? '   o navegador já abre: nada a fazer' : `   rodaria: playwright install chromium (cerca de 210 MB, até 3 tentativas)${antes.ok ? `; enquanto isso, a reserva é o ${antes.escolhido.nome} do computador` : ''}`);
  if (!tem('forcar') && antes.ok && antes.webgl && !antes.escolhido.reserva) return ok('o navegador já abre, com 3D');
  // download com até 3 tentativas e progresso (a barra aparece também no estúdio web)
  const linhas = [];
  let baixou = false;
  const filtro = (l) => {
    const m = /(\d+)% of ([\d.]+ ?[KMG]i?B)/.exec(l);
    if (m) { barra(+m[1] / 100, `baixando o navegador interno (${m[2].replace('MiB', 'MB')})`); return null; }
    if (/^\s*(errno|code|syscall|address|port|at )\b/.test(l)) return null; // detalhes do Node: ficam no registro, não na tela
    return /Downloading|Downloaded|downloaded|ERR|error|Failed/i.test(l) ? l.replace(/\s*\|[^|]*\|\s*/, ' ').replace(/ from https?:\S+/, '') : null;
  };
  for (let i = 1; i <= 3 && !baixou; i++) {
    escrever(i === 1 ? '   baixando o navegador interno (cerca de 210 MB)…' : `   a internet falhou; tentando de novo (${i} de 3)…`);
    const env = { ...(process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD ? { PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '' } : {}), ...(process.env.PLAYWRIGHT_BROWSERS_PATH ? { PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH } : {}) };
    const r = await rodar(process.execPath, [path.join(STUDIO, 'node_modules', 'playwright', 'cli.js'), 'install', 'chromium'], { env, filtro });
    linhas.push(...r.linhas);
    baixou = r.codigo === 0;
    if (!baixou && i < 3) await esperar(+(process.env.ILU_PAUSA_NAVEGADOR_MS ?? 5000) * i);
  }
  estado.navegadorPasta = process.env.PLAYWRIGHT_BROWSERS_PATH || pastaPadraoNavegadores();
  if (baixou && process.platform === 'linux') {
    const { chromium } = await import(pathToFileURL(path.join(STUDIO, 'node_modules/playwright/index.mjs')).href);
    bibliotecasChromium(chromium.executablePath(), { log: escrever });
  }
  const depois = await navegadorAbre();
  if (depois.ok && depois.webgl && !depois.escolhido.reserva) return ok('navegador instalado e abrindo com 3D');
  if (depois.ok && depois.webgl) {
    // o interno não veio, mas o Chrome ou o Edge do computador desenha igual: segue, com um aviso só
    estado.navegador = depois.escolhido.id;
    estado.avisos.push(`O navegador interno não ${baixou ? 'abriu' : 'baixou'}; o estúdio vai usar o ${depois.escolhido.nome} do computador, e os vídeos saem iguais. Nada a fazer.`);
    return aviso(`o navegador interno não ${baixou ? 'abriu' : 'baixou'}; vou usar o ${depois.escolhido.nome} do computador (os vídeos saem iguais)`);
  }
  if (depois.ok && !depois.webgl) throw new Falha('O navegador abriu, mas sem 3D (WebGL).', 'Feche programas pesados e reinicie o computador; depois tente de novo. Se repetir, mande o diagnóstico no direct do Instagram @kaueajure.');
  let gb = null;
  try { const st = fs.statfsSync(STUDIO); gb = (Number(st.bavail) * Number(st.bsize)) / 1e9; } catch { /* sem medida */ }
  throw causaNavegador([...linhas, depois.erro || ''], { baixou, gbLivres: gb });
});

passo('alinhador', 'Alinhador de voz (legenda no tempo exato da fala, sem Python)', async () => {
  if (tem('sem-alinhador')) return escrever('   pulado (--sem-alinhador). Sem ele, a legenda usa as pausas da fala.');
  const dir = path.join(PROG, 'alinhador');
  const pronto = () => existe(path.join(dir, 'node_modules', '@huggingface', 'transformers', 'package.json')) && spawnSync(process.execPath, [path.join(STUDIO, 'ferramentas', 'alinhar-voz.mjs'), '--conferir']).status === 0;
  const lockNovo = fs.readFileSync(path.join(STUDIO, 'ferramentas', 'alinhador', 'package-lock.json'), 'utf8');
  const mesmo = existe(path.join(dir, 'package-lock.json')) && fs.readFileSync(path.join(dir, 'package-lock.json'), 'utf8') === lockNovo;
  if (!tem('forcar') && mesmo && pronto()) { estado.alinhador = true; return ok('alinhador já instalado'); }
  if (SIMULAR) return escrever('   rodaria: npm ci em .programas/alinhador (@huggingface/transformers 4.2.0, travado pelo package-lock) e baixaria o modelo whisper-base (cerca de 80 MB)');
  fs.mkdirSync(dir, { recursive: true });
  for (const f of ['package.json', 'package-lock.json']) fs.copyFileSync(path.join(STUDIO, 'ferramentas', 'alinhador', f), path.join(dir, f));
  escrever('   baixando as peças do alinhador (cerca de 120 MB; pode demorar alguns minutos)…');
  // ONNXRUNTIME_NODE_INSTALL=skip: o motor de IA já vem no pacote para Mac e Windows; no Linux evita baixar a versão de placa de vídeo (CUDA)
  // 0.6.40: mesma configuração isolada, limite de tempo e 3 tentativas das peças; o alinhador é opcional: falhar não para a instalação
  const lockAl = JSON.parse(lockNovo);
  const r = await npmComTentativas(['ci', '--omit=dev', '--no-audit', '--no-fund', '--loglevel=http', '--no-progress'], { cwd: dir, env: { ONNXRUNTIME_NODE_INSTALL: 'skip' }, total: pecasDoLock(lockAl).length, limpar: [path.join(dir, 'node_modules')] });
  if (!r.ok) {
    const c = causaPecas(r.linhas, { travou: r.travou, prefixo: 'alinhador', oque: 'as peças do alinhador de voz' });
    throw new Falha(c.causa, c.oQueFazer, c.codigo);
  }
  const b = await rodar(process.execPath, [path.join(STUDIO, 'ferramentas', 'alinhar-voz.mjs'), '--baixar'], { silencioso: false, parado: msEnv('ILU_NPM_PARADO_MS', 120000) * 1.5, limite: 1800000, filtro: (l) => { const m = /^PROGRESSO (\d+) (\d+) (\d+)/.exec(l); if (m) { barra(+m[1] / 100, `baixando o modelo de voz (${m[2]} de ${m[3]} MB)`); return null; } return /PRONTO/.test(l) ? null : l; } });
  if (b.codigo !== 0 || !pronto()) throw new Falha('O alinhador de voz ou seu modelo não ficou pronto.', 'Confira a conexão e execute Instalar novamente para completar a instalação.');
  estado.alinhador = true;
  ok('alinhador de voz instalado');
});

passo('ia', 'Assistentes pessoais (instalação pelo usuário)', async () => {
  if (SIMULAR) return escrever('   preservaria a configuração de IA existente. Claude Code, Codex e Cursor são instalados pelo usuário.');
  // O instalador não instala, troca nem autentica assistentes pessoais.
  ok('Configuração de IA preservada. Instale seu assistente e conecte-o nas Configurações do estúdio.');
});

/** Compatibilidade para consumidores antigos; gera somente o iniciador da pasta. */
export function criarAtalho({ studio = STUDIO, plataforma = process.platform } = {}) {
  return criarIniciador({ studio, plataforma });
}

passo('conferencia', 'Conferência final', async () => {
  if (SIMULAR) return escrever('   rodaria a conferência completa (a mesma do diagnóstico do estúdio)');
  const { checarAmbiente } = await import(pathToFileURL(path.join(STUDIO, 'src', 'video', 'ambiente.mjs')).href);
  const r = await checarAmbiente({ voz: 'mock', navegador: true });
  const graves = r.itens.filter((i) => !i.ok && i.grave);
  for (const i of r.itens.filter((x) => ['node', 'ffmpeg', 'chromium', 'webgl', 'three', 'whisper'].includes(x.id))) (i.ok ? ok : aviso)(i.msg);
  if (graves.length) throw new Falha(`Ainda falta: ${graves.map((g) => g.msg).join('; ')}.`, graves[0].dica);
});

/** Erro que não é uma Falha nossa vira uma explicação em português (o código técnico fica entre parênteses para o suporte). */
export function explicar(e) {
  if (e instanceof Falha) return e;
  const c = e?.code || '';
  if (['EPERM', 'EBUSY', 'EACCES'].includes(c)) return new Falha(`O computador (ou o antivírus) não deixou mexer em um arquivo da pasta do estúdio (${c}).`, 'Espere 1 minuto e dê dois cliques em Instalar de novo. Se repetir, mova a pasta do estúdio para a sua pasta pessoal, fora do OneDrive.');
  if (c === 'ENOSPC') return new Falha('O disco encheu durante a instalação.', 'Libere uns 5 GB e dê dois cliques em Instalar de novo.');
  return new Falha(`Erro inesperado (${c || e?.message || e}).`, 'Dê dois cliques em Instalar de novo. Se repetir, mande uma foto desta janela no direct do Instagram @kaueajure.');
}

/* ---------------- falha: aviso com o relatório de erro e tela de ajuda (0.6.4; relatório desde a 0.6.12) ---------------- */
/** Código curto da falha do instalador, a partir da mensagem (nunca manda o texto). */
export function codigoInstalador(msg) {
  const t = String(msg || '');
  const regras = [[/disco encheu|ENOSPC/i, 'disco-cheio'], [/internet|ENOTFOUND|ETIMEDOUT|ECONNRESET|EAI_AGAIN|fetch failed/i, 'sem-internet'], [/n[ãa]o consegui baixar|curl n[ãa]o conseguiu/i, 'download-falhou'], [/certificad|CERT|antivírus.*HTTPS/i, 'https-bloqueado'], [/Visual C\+\+|MSVCP|VCRUNTIME/i, 'vcredist'], [/permiss|EACCES|EPERM|acesso negado/i, 'sem-permissao'], [/impressão digital|SHA-256|sha256/i, 'download-diferente'], [/npm/i, 'npm'], [/Chromium|navegador/i, 'navegador'], [/FFmpeg/i, 'ffmpeg'], [/alinhador|whisper/i, 'alinhador']];
  const base = (regras.find(([re]) => re.test(t)) || [null, 'inesperado'])[1];
  // 0.6.8: o download que falha diz de qual servidor e com que resposta (só rótulos fechados, nunca o endereço)
  if (base === 'download-falhou') {
    const host = (t.match(/baixar de ([a-z0-9.-]+)/i) || [])[1] || '';
    const quem = /github/i.test(host) ? 'github' : /nodejs/i.test(host) ? 'node' : /astral/i.test(host) ? 'astral' : /gyan|evermeet|vansickle|ffmpeg/i.test(host) ? 'ffmpeg' : /npm/i.test(host) ? 'npm' : 'outro';
    const st = (t.match(/respondeu (\d{3})/) || [])[1];
    return `download-falhou-${quem}${st ? '-' + st : /curl/i.test(t) ? '-curl' : ''}`;
  }
  return base;
}
async function avisarFalha(passo, e) {
  try {
    const etapa = `instalador-${passo?.id || 'passo'}`, codigo = e?.codigo || codigoInstalador(e?.message);
    // dentro do estúdio web (ILU_TELEMETRIA_PAI), o estúdio manda o aviso e mostra os botões; nos dois cliques, a tela de ajuda abre
    if (process.env.ILU_TELEMETRIA_PAI === '1' || SIMULAR) return;
    const { abrirSocorro } = await import('../../src/estudio/socorro.mjs');
    // o relatório de erro leva as últimas linhas da instalação e o começo do erro (abrirSocorro saneia antes de mandar)
    // 0.6.40: a Falha do npm traz as últimas linhas dele, já saneadas (sem pasta pessoal, e-mail, senha de proxy nem token)
    const linhas = [...LINHAS.slice(-20), ...(e?.linhas || []), ...String(e?.stack || '').split('\n').slice(1, 6).map((l) => l.trim())].filter(Boolean);
    const r = await abrirSocorro({ raiz: STUDIO, abrir: !process.argv.includes('--assistente'), etapa, codigo, linhas, causa: `A instalação parou: ${e?.message || 'erro inesperado'}`, acao: e?.oQueFazer || 'Dê dois cliques em Instalar de novo.' });
    if (r?.aviso) escrever(`  ${r.aviso}`);
    escrever('  Abri uma página de ajuda no navegador, com "Copiar diagnóstico" e "Abrir o direct" (https://ig.me/m/kaueajure).');
    escrever('');
  } catch { /* o aviso nunca atrapalha a mensagem de erro */ }
}

/* ---------------- execução ---------------- */
export async function instalar() {
  // 0.6.19: registro local da instalação (.estudio/instalacao.log), que o "Copiar diagnóstico" inclui mesmo se o estúdio nunca abriu
  if (!SIMULAR) { anotar(STUDIO, ARQUIVOS.instalacao, `instalador iniciado; Node ${process.version}; ${process.platform} ${process.arch}`); }
  const lista = SO ? PASSOS.filter((p) => p.id === SO || (SO === 'alinhador' && p.id === 'computador')) : PASSOS;
  escrever('');
  escrever('  Estudio de videos: instalação');
  escrever('  Não precisa digitar nada. É rapidinho.');
  if (SIMULAR) escrever('  MODO SIMULAÇÃO: só mostra o que faria. Nada é baixado nem gravado.');
  escrever('');
  const ini = Date.now();
  for (const [i, p] of lista.entries()) {
    escrever(`  Passo ${i + 1} de ${lista.length}: ${p.titulo}`);
    try { await p.fn(); } catch (erro) {
      const e = explicar(erro);
      if (!SIMULAR) anotar(STUDIO, ARQUIVOS.instalacao, `ERRO no passo ${p.id}: ${erro?.code || ''} ${String(erro?.message || erro).slice(0, 300)}\n${String(erro?.stack || '').split('\n').slice(1, 4).join('\n')}`);
      escrever('');
      escrever('  A instalação parou.');
      escrever(`  O que houve: ${e.message}`);
      escrever(`  O que fazer: ${e.oQueFazer || 'Dê dois cliques em Instalar de novo. Se repetir, mande uma foto desta janela no direct do Instagram @kaueajure.'}`);
      // 0.6.40: o estúdio web lê este código (explicarInstalador) e manda o mesmo rótulo no aviso de falha
      if (e.codigo) escrever(`  Código: ${e.codigo}`);
      escrever('');
      await avisarFalha(p, e);
      return 1;
    }
    escrever('');
  }
  if (!SIMULAR) {
    const info = { versaoKit: (() => { try { return fs.readFileSync(path.join(STUDIO, 'VERSAO'), 'utf8').trim(); } catch { return null; } })(), instalado: new Date().toISOString(), node: process.versions.node, nodePortatil: process.execPath.startsWith(PROG), nodeAlvo: NODE_VERSAO, ffmpeg: estado.ffmpeg, alinhador: estado.alinhador, ...(estado.navegadorPasta ? { navegadorPasta: estado.navegadorPasta } : {}), ...(SO ? {} : { navegadorReserva: estado.navegador }) };
    let antes = {};
    try { antes = JSON.parse(fs.readFileSync(path.join(PROG, 'instalado.json'), 'utf8')); } catch { /* primeira vez */ }
    if (SO) for (const k of ['ffmpeg', 'alinhador']) if (info[k] == null || info[k] === false) info[k] = antes[k] ?? info[k];
    fs.writeFileSync(path.join(PROG, 'instalado.json'), JSON.stringify({ ...antes, ...info }, null, 1));
  }
  if (!SIMULAR && !SO) ok(`Arquivo gerado: ${criarIniciador({ studio: STUDIO })}`);
  const min = Math.max(1, Math.round((Date.now() - ini) / 60000));
  escrever(SIMULAR ? '  Simulação concluída.' : `  Pronto! Tudo instalado em ${min} minuto(s).`);
  for (const a of estado.avisos) escrever(`  Atenção: ${a}`);
  escrever('');
  return 0;
}

/**
 * 0.6.26 (telemetria de 02/11: "sem-traducao-c1-navegador" em atualizar-instalador e preparar-instalador, 5 casos no Windows 11):
 * o estúdio aberto no Node 24 do computador (atalho antigo, versão antiga do estúdio) lançava ESTE instalador com o mesmo Node 24,
 * e a conferência final o recusava ("novo demais para o Windows"). Agora o instalador percebe sozinho e se relança no Node 22 da
 * pasta (.programas/node) ou, sem ele, pelo instalar.ps1, que baixa o Node 22. Funciona seja qual for o programa que o chamou,
 * inclusive um estúdio antigo ainda aberto durante a atualização. Devolve o código de saída do relançamento, ou null quando este
 * Node serve (segue a instalação normal).
 */
export function relancarSeNodeNaoServe({ versao = process.versions.node, plataforma = process.platform, env = process.env, executar = spawnSync, existeArq = existe, abre = nodeAbre, simular = SIMULAR, argumentos = args, execPath = process.execPath } = {}) {
  if (simular || env.ILU_INSTALADOR_REEXEC === '1' || nodeServe(versao, plataforma)) return null;
  const escolha = escolherNodeFilho({ raiz: STUDIO, versao, plataforma, execPath, existe: existeArq, abre });
  if (escolha.via === 'atual') return null;
  const mjs = fileURLToPath(import.meta.url), ps1 = path.join(STUDIO, 'ferramentas', 'instalador', 'instalar.ps1');
  escrever(escolha.via === 'portatil'
    ? `   o Node ${versao} do computador não serve neste Windows; continuo com o Node 22 da pasta do estúdio`
    : `   o Node ${versao} do computador não serve neste Windows; vou baixar o Node 22 para a pasta do estúdio e continuar`);
  const cmd = escolha.via === 'ps1'
    ? { cmd: 'powershell.exe', args: ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', ps1, '-Assistente', ...argumentos] }
    : { cmd: escolha.cmd, args: [mjs, ...argumentos] };
  const r = executar(cmd.cmd, cmd.args, { stdio: 'inherit', windowsHide: true, env: { ...env, ILU_INSTALADOR_REEXEC: '1' } });
  return Number.isInteger(r?.status) ? r.status : 1;
}

// realpath dos dois lados: pasta com link no caminho (/var e /private/var no Mac, pasta movida com atalho) não pode impedir a instalação
const real = (f) => { try { return fs.realpathSync(f); } catch { return path.resolve(f); } };
if (process.argv[1] && real(process.argv[1]) === real(fileURLToPath(import.meta.url))) {
  const relancado = relancarSeNodeNaoServe();
  if (relancado !== null) process.exitCode = relancado;
  else instalar().then(codigo => { process.exitCode = codigo; }).catch(erro => {
    console.error('Não foi possível concluir a instalação:', erro.message);
    process.exitCode = 1;
  });
}
