// Caminhos, leitura/escrita dos arquivos de cada vídeo e utilidades dos scripts.
import {createHash} from 'node:crypto';
import {existsSync, readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {FORMATO} from '../../src/config';
import {esquemaNarracao, esquemaVideo, PADRAO_SLUG, type Narracao, type Video} from '../../src/esquema';
import {calcularLinhaDoTempo, type LinhaDoTempo} from '../../src/video/linhaDoTempo';

export const RAIZ = path.resolve(__dirname, '..', '..');
export const PASTA_VIDEOS = path.join(RAIZ, 'videos');

// Erro "esperado" (uso errado, etapa faltando): mostra só a mensagem, sem stack trace.
export class ErroDeUso extends Error {}

export const caminhos = (slug: string) => {
  const pasta = path.join(PASTA_VIDEOS, slug);
  return {
    pasta,
    video: path.join(pasta, 'video.json'),
    cenas: path.join(pasta, 'cenas.tsx'),
    audio: path.join(pasta, 'audio'),
    narracao: path.join(pasta, 'audio', 'narracao.json'),
    saida: path.join(pasta, 'saida'),
    previa: path.join(pasta, 'saida', 'previa'),
  };
};

export const carregarEnv = () => {
  const arquivo = path.join(RAIZ, '.env');
  if (existsSync(arquivo)) {
    process.loadEnvFile(arquivo);
  }
};

export const listarSlugs = (): string[] =>
  existsSync(PASTA_VIDEOS)
    ? readdirSync(PASTA_VIDEOS, {withFileTypes: true})
        .filter((d) => d.isDirectory() && existsSync(path.join(PASTA_VIDEOS, d.name, 'video.json')))
        .map((d) => d.name)
        .sort()
    : [];

export const exigirSlug = (slug: string | undefined): string => {
  if (!slug) {
    const existentes = listarSlugs();
    throw new ErroDeUso(
      `Informe o vídeo: npm run <comando> -- <slug>\nVídeos: ${existentes.length ? existentes.join(', ') : '(nenhum ainda — crie com npm run novo)'}`,
    );
  }
  if (!PADRAO_SLUG.test(slug)) {
    throw new ErroDeUso(`Slug inválido "${slug}": use minúsculas, números e hífens (ex.: por-que-o-ceu-e-azul).`);
  }
  if (!existsSync(caminhos(slug).video)) {
    throw new ErroDeUso(`videos/${slug}/video.json não existe. Vídeos: ${listarSlugs().join(', ') || '(nenhum)'}`);
  }
  return slug;
};

const lerJson = (arquivo: string): unknown => JSON.parse(readFileSync(arquivo, 'utf8'));

export const lerVideo = (slug: string): Video => {
  const leitura = esquemaVideo.safeParse(lerJson(caminhos(slug).video));
  if (!leitura.success) {
    const erros = leitura.error.issues.map((i) => `  - ${i.path.map(String).join('.') || '(raiz)'}: ${i.message}`);
    throw new ErroDeUso(`videos/${slug}/video.json inválido:\n${erros.join('\n')}`);
  }
  return leitura.data;
};

export const lerNarracao = (slug: string): Narracao | null => {
  const arquivo = caminhos(slug).narracao;
  if (!existsSync(arquivo)) {
    return null;
  }
  const leitura = esquemaNarracao.safeParse(lerJson(arquivo));
  if (!leitura.success) {
    throw new ErroDeUso(`videos/${slug}/audio/narracao.json corrompido. Apague-o e rode npm run voz -- ${slug}.`);
  }
  return leitura.data;
};

export const salvarJson = (arquivo: string, dados: unknown) => {
  writeFileSync(arquivo, `${JSON.stringify(dados, null, 2)}\n`, 'utf8');
};

// Mesma linha do tempo que o Remotion calcula, mas lida do disco.
export const linhaDoTempoDoDisco = (slug: string, video = lerVideo(slug)): LinhaDoTempo =>
  calcularLinhaDoTempo({
    video,
    narracao: lerNarracao(slug),
    urlDoAudio: (arquivo) => (existsSync(path.join(caminhos(slug).audio, arquivo)) ? arquivo : null),
    fps: FORMATO.fps,
  });

// Ids de cena exportados em cenas.tsx (`export const cenas: Cenas = { gancho: ..., 'luz-branca': ... }`).
export const cenasImplementadas = (slug: string): Set<string> => {
  const arquivo = caminhos(slug).cenas;
  if (!existsSync(arquivo)) {
    return new Set();
  }
  const codigo = readFileSync(arquivo, 'utf8');
  const bloco = codigo.match(/export const cenas[^=]*=\s*{([\s\S]*?)}/);
  if (!bloco) {
    return new Set();
  }
  return new Set([...bloco[1].matchAll(/['"]?([a-z0-9-]+)['"]?\s*:/g)].map((m) => m[1]));
};

export const impressaoDigital = (dados: unknown): string =>
  createHash('sha1').update(JSON.stringify(dados)).digest('hex').slice(0, 12);

// Partes do video.json que entram no MP4. Capa, post, carrossel, fontes e resumo ficam de fora:
// mudar só eles (ex.: escrever o carrossel depois do render) não pede render novo.
export const impressaoDoMp4 = (video: Video): string =>
  impressaoDigital({cenas: video.cenas, voz: video.voz, estilo: video.estilo ?? null, trilha: video.trilha ?? null});

// Última mudança em algo que entra no MP4 (roteiro falado, cenas.tsx, voz). `impressao` é a
// impressaoDoMp4 registrada no render (saida/render.json) ou no arquivo (arquivo.json): se ainda
// bate, a data do video.json não conta.
export const ultimaMudancaDoMp4 = (slug: string, video: Video, impressao?: string): number => {
  const dir = caminhos(slug);
  const data = (arquivo: string) => (existsSync(arquivo) ? statSync(arquivo).mtimeMs : 0);
  return Math.max(impressao === impressaoDoMp4(video) ? 0 : data(dir.video), data(dir.cenas), data(dir.narracao));
};

export const segundos = (s: number) => `${s.toFixed(1)}s`;

export const rodar = (principal: () => Promise<void>) => {
  principal().catch((erro: unknown) => {
    if (erro instanceof ErroDeUso) {
      console.error(`\n✖ ${erro.message}`);
    } else {
      console.error('\n✖ Erro inesperado:', erro);
    }
    process.exit(1);
  });
};
