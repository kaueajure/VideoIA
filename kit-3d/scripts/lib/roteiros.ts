// Banco de roteiros prontos (bônus "100 roteiros"): leitura e conferência das regras do método.
// Cada roteiro é um video.json sem voz nem trilha: banco-de-roteiros/<NN-categoria>/<NNN-slug>.json
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {DURACAO, FORMATO} from '../../src/config';
import {esquemaVideo, PADRAO_SLUG, type Video} from '../../src/esquema';
import {calcularLinhaDoTempo} from '../../src/video/linhaDoTempo';
import {RAIZ} from './projeto';

export const PASTA_BANCO = path.join(RAIZ, 'banco-de-roteiros');

export type ItemDoBanco = {numero: number; slug: string; categoria: string; arquivo: string};

const NOME_ARQUIVO = /^(\d{3})-([a-z0-9-]+)\.json$/;

export const listarBanco = (pasta = PASTA_BANCO): ItemDoBanco[] => {
  if (!existsSync(pasta)) {
    return [];
  }
  const itens: ItemDoBanco[] = [];
  // Aceita a pasta do banco (com as categorias dentro) ou a pasta de uma categoria só.
  const soUmaCategoria = readdirSync(pasta).some((n) => NOME_ARQUIVO.test(n));
  const categorias = soUmaCategoria
    ? [{name: path.basename(pasta), pai: path.dirname(pasta)}]
    : readdirSync(pasta, {withFileTypes: true})
        .filter((d) => d.isDirectory())
        .map((d) => ({name: d.name, pai: pasta}));
  for (const categoria of categorias) {
    const base = categoria.pai;
    for (const nome of readdirSync(path.join(base, categoria.name))) {
      const m = nome.match(NOME_ARQUIVO);
      if (m) {
        itens.push({
          numero: Number(m[1]),
          slug: m[2],
          categoria: categoria.name.replace(/^\d+-/, '').replace(/-/g, ' '),
          arquivo: path.join(base, categoria.name, nome),
        });
      }
    }
  }
  return itens.sort((a, b) => a.numero - b.numero);
};

export type Conferencia = {video: Video | null; erros: string[]; avisos: string[]; segundos: number; palavras: number};

const contarPalavras = (texto: string) => texto.split(/\s+/).filter(Boolean).length;

// As mesmas regras do CLAUDE.md, para o texto ser falado pela voz sem tropeço.
export const conferirRoteiro = (dados: unknown): Conferencia => {
  const erros: string[] = [];
  const avisos: string[] = [];
  const leitura = esquemaVideo.safeParse(dados);
  if (!leitura.success) {
    return {
      video: null,
      erros: leitura.error.issues.map((i) => `${i.path.map(String).join('.') || '(raiz)'}: ${i.message}`),
      avisos,
      segundos: 0,
      palavras: 0,
    };
  }
  const video = leitura.data;
  const falas = video.cenas.map((c) => c.narracao.trim());
  const palavras = falas.reduce((soma, f) => soma + contarPalavras(f), 0);
  const linha = calcularLinhaDoTempo({video, narracao: null, urlDoAudio: () => null, fps: FORMATO.fps});
  const segundos = linha.duracao / FORMATO.fps;

  if (segundos < DURACAO.minima + 2 || segundos > DURACAO.maxima - 5) {
    erros.push(`duração estimada ${segundos.toFixed(0)} s (precisa ficar entre ${DURACAO.minima + 2} e ${DURACAO.maxima - 5} s)`);
  }
  if (video.cenas.length < 12 || video.cenas.length > 20) {
    erros.push(`${video.cenas.length} cenas (use de 12 a 20)`);
  }
  if (video.cenas[0]?.id !== 'gancho') {
    erros.push('a primeira cena precisa ter id "gancho"');
  }
  video.cenas.forEach((cena, i) => {
    const fala = cena.narracao;
    const onde = `cena ${i + 1} (${cena.id})`;
    if (!fala.trim()) {
      erros.push(`${onde}: sem narração`);
    }
    if (/\d/.test(fala)) {
      erros.push(`${onde}: número em algarismo (escreva por extenso): "${fala.match(/\S*\d\S*/)?.[0]}"`);
    }
    if (/[()[\]{}]/.test(fala)) {
      erros.push(`${onde}: parênteses ou colchetes na fala`);
    }
    if (/\p{Extended_Pictographic}/u.test(fala)) {
      erros.push(`${onde}: emoji na fala`);
    }
    const sigla = fala.match(/\b\p{Lu}{2,}\b/u);
    if (sigla) {
      erros.push(`${onde}: sigla ou palavra em maiúsculas na fala ("${sigla[0]}"): escreva como se fala`);
    }
    if (/[%&$€#@/]/.test(fala)) {
      erros.push(`${onde}: símbolo na fala (escreva por extenso: "por cento", "e")`);
    }
    const n = contarPalavras(fala);
    if (n > 34) {
      erros.push(`${onde}: ${n} palavras (máximo 34; ideal 15 a 25)`);
    } else if (n > 28) {
      avisos.push(`${onde}: ${n} palavras (ideal 15 a 25)`);
    }
    if (!cena.visual.trim()) {
      erros.push(`${onde}: sem direção visual`);
    }
  });
  if (!video.cenas.some((c) => c.id === video.capa.cena)) {
    erros.push(`capa.cena "${video.capa.cena}" não existe`);
  }
  if (contarPalavras(video.capa.titulo) > 7) {
    erros.push('capa.titulo longo demais (até 7 palavras)');
  }
  if (video.capa.destaque && !video.capa.titulo.toLowerCase().includes(video.capa.destaque.toLowerCase())) {
    erros.push('capa.destaque precisa estar dentro de capa.titulo');
  }
  if (!video.post.texto.trim()) {
    erros.push('post.texto vazio');
  }
  if (!/^Mande para /.test(video.post.chamada) || !/\.$/.test(video.post.chamada)) {
    erros.push('post.chamada precisa começar com "Mande para " e terminar com ponto');
  }
  if (video.post.hashtags.length < 3 || video.post.hashtags.length > 7) {
    erros.push('post.hashtags: use de 3 a 7');
  }
  for (const h of video.post.hashtags) {
    if (!/^[a-z0-9]+$/.test(h)) {
      erros.push(`hashtag "${h}": só minúsculas e números, sem # e sem acento`);
    }
  }
  if (video.fontes.length < 2) {
    erros.push('pelo menos 2 fontes');
  }
  for (const f of video.fontes) {
    if (!f.url.startsWith('https://')) {
      erros.push(`fonte sem https: ${f.url}`);
    }
  }
  if (!video.resumo.trim()) {
    erros.push('resumo vazio');
  }
  if (video.roteiroAprovado) {
    erros.push('roteiroAprovado deve ser false (quem aprova é o dono do canal)');
  }
  return {video, erros, avisos, segundos, palavras};
};

export const lerDoBanco = (item: ItemDoBanco) => conferirRoteiro(JSON.parse(readFileSync(item.arquivo, 'utf8')));

export const slugValido = (slug: string) => PADRAO_SLUG.test(slug);
