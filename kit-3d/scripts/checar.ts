// npm run checar  (roda depois do `tsc --noEmit`)
// Pega os erros que mais estragam um render 3D antes de gastar minutos renderizando.
import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs';
import path from 'node:path';
import {FORMATO} from '../src/config';
import {avaliarDuracao} from '../src/video/duracao';
import {normalizarPalavra} from '../src/video/palavras';
import {caminhos, cenasImplementadas, lerVideo, linhaDoTempoDoDisco, listarSlugs, RAIZ, rodar} from './lib/projeto';
import {chamadasDeQuando, textoLiteral} from './lib/quando';

// Tudo que anima sozinho (fora do quadro atual) pisca ou varia entre renders.
const PROIBIDOS: Array<[RegExp, string]> = [
  [/\bMath\.random\s*\(/, 'use random("semente") do remotion'],
  [/\buseFrame\s*\(/, 'use useCurrentFrame(); useFrame() do R3F não sincroniza com o render'],
  [/\bDate\.now\s*\(|\bnew Date\s*\(/, 'nada de relógio real; use o quadro atual'],
  [/\bperformance\.now\s*\(/, 'nada de relógio real; use o quadro atual'],
  [/\b(setTimeout|setInterval|requestAnimationFrame)\s*\(/, 'anime pelo quadro, não por timers'],
];

const arquivosTsx = (pasta: string): string[] =>
  existsSync(pasta)
    ? readdirSync(pasta).flatMap((nome) => {
        const caminho = path.join(pasta, nome);
        if (statSync(caminho).isDirectory()) {
          return nome === 'saida' || nome === 'audio' ? [] : arquivosTsx(caminho);
        }
        return /\.tsx?$/.test(nome) ? [caminho] : [];
      })
    : [];

rodar(async () => {
  const erros: string[] = [];
  const avisos: string[] = [];

  for (const arquivo of [...arquivosTsx(path.join(RAIZ, 'src')), ...arquivosTsx(path.join(RAIZ, 'videos'))]) {
    readFileSync(arquivo, 'utf8')
      .split('\n')
      .forEach((linha, i) => {
        if (/^\s*(\/\/|\*)/.test(linha)) {
          return;
        }
        for (const [padrao, dica] of PROIBIDOS) {
          if (padrao.test(linha)) {
            erros.push(`${path.relative(RAIZ, arquivo)}:${i + 1} — ${dica}`);
          }
        }
      });
  }

  for (const slug of listarSlugs()) {
    let video;
    try {
      video = lerVideo(slug);
    } catch (erro) {
      erros.push((erro as Error).message);
      continue;
    }
    const linha = linhaDoTempoDoDisco(slug, video);
    const duracao = avaliarDuracao(linha.duracao / FORMATO.fps, video.duracao);
    if (!duracao.ok) {
      avisos.push(`${slug}: duração ${duracao.resumo}${linha.narracaoCompleta ? '' : ' (estimada)'}`);
    }
    if (!video.post.chamada.trim() || video.post.chamada.includes('[')) {
      avisos.push(`${slug}: post.chamada vazia ou com marcador — escreva "Mande para quem ..." ligado ao tema`);
    }
    const prontas = cenasImplementadas(slug);
    const faltando = video.cenas.filter((c) => !prontas.has(c.id)).map((c) => c.id);
    if (faltando.length) {
      avisos.push(`${slug}: cenas sem código: ${faltando.join(', ')}`);
    }
    const sobrando = [...prontas].filter((id) => !video.cenas.some((c) => c.id === id));
    if (sobrando.length) {
      avisos.push(`${slug}: cenas.tsx tem cenas que não estão no roteiro: ${sobrando.join(', ')}`);
    }
    // quando('...') precisa citar palavras que existem na narração.
    //   quando('trecho') / quando('trecho', 2) / quandoTermina('trecho')  (useCena): o trecho está em alguma narração.
    //   quando('idCena', 'trecho')                                          (useMundo): a cena existe e o trecho
    //                                                                        está na narração DELA.
    const arquivoCenas = caminhos(slug).cenas;
    if (existsSync(arquivoCenas)) {
      const normalizar = (texto: string) => texto.split(/\s+/).map(normalizarPalavra).filter(Boolean).join(' ');
      const narracaoDa = new Map(video.cenas.map((c) => [c.id, normalizar(c.narracao)]));
      const narrado = [...narracaoDa.values()].join(' | ');
      const temTrecho = (texto: string, trecho: string) => ` ${texto} `.includes(` ${trecho} `);
      // Sem comentários: o modelo de cenas.tsx traz um exemplo de quando('palavra') num comentário.
      const codigo = readFileSync(arquivoCenas, 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');
      for (const chamada of chamadasDeQuando(codigo)) {
        const [primeiro, segundo] = chamada.argumentos.map(textoLiteral);
        if (primeiro === null || primeiro === undefined) {
          continue; // quando(variavel): não dá para conferir aqui
        }
        if (segundo !== null && segundo !== undefined) {
          const cena = narracaoDa.get(primeiro);
          if (cena === undefined) {
            erros.push(`${slug}/cenas.tsx: ${chamada.nome}("${primeiro}", "${segundo}") cita a cena "${primeiro}", que não existe no roteiro`);
          } else if (!temTrecho(cena, normalizar(segundo))) {
            erros.push(`${slug}/cenas.tsx: ${chamada.nome}("${primeiro}", "${segundo}"): o trecho não aparece na narração da cena "${primeiro}"`);
          }
          continue;
        }
        if (!temTrecho(narrado, normalizar(primeiro))) {
          erros.push(`${slug}/cenas.tsx: ${chamada.nome}("${primeiro}") não aparece em nenhuma narração do roteiro`);
        }
      }
    }
  }

  avisos.forEach((a) => console.log(`! ${a}`));
  erros.forEach((e) => console.log(`✖ ${e}`));
  if (erros.length) {
    console.log(`\n${erros.length} problema(s).`);
    process.exit(1);
  }
  console.log(`✔ Checagem ok${avisos.length ? ` (${avisos.length} aviso(s))` : ''}.`);
});
