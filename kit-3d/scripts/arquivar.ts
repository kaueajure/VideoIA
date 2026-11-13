// npm run arquivar -- <slug> [--manter]
//
// Guarda o vídeo pronto no Google Drive (pasta do "Google Drive para computador"), organizado:
//   <Meu Drive>/<ARQUIVO.pastaNoDrive>/
//     Índice de vídeos.md
//     Sistema/                         cópia do código do projeto (sem node_modules e segredos)
//     Vídeos/<data> · <título>/
//       01 Publicação/  02 Roteiro/  03 Projeto/  04 Prévia/  Ficha técnica.md
// Confere o tamanho de cada cópia e, sem --manter, apaga do computador os resultados de
// render (videos/<slug>/saida/), que podem ser refeitos. Roteiro, cenas e áudio ficam.
import {copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {ARQUIVO, FORMATO} from '../src/config';
import {avaliarDuracao, formatarTempo} from '../src/video/duracao';
import {atualizarIndice, gerarFichaTecnica, gerarRoteiroLegivel} from './lib/documentos';
import {exigirDrive} from './lib/drive';
import {
  caminhos,
  carregarEnv,
  ErroDeUso,
  exigirSlug,
  impressaoDoMp4,
  lerNarracao,
  lerVideo,
  linhaDoTempoDoDisco,
  RAIZ,
  rodar,
  salvarJson,
  ultimaMudancaDoMp4,
} from './lib/projeto';
import {configDoPerfil, resolverVoz} from './lib/vozConfig';

// Registro local de onde o vídeo foi arquivado (mantém a mesma pasta em arquivamentos futuros).
type RegistroArquivo = {
  pasta: string;
  arquivadoEm: string;
  // De que roteiro saiu o MP4 arquivado (ver impressaoDoMp4).
  impressaoDoMp4?: string;
  arquivos: Array<{caminho: string; bytes: number}>;
};

const nomeSeguro = (texto: string) =>
  texto
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const hoje = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const ARQUIVOS_DO_SISTEMA = [
  'src',
  'scripts',
  'modelos',
  '.claude',
  'public',
  'CLAUDE.md',
  'README.md',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'remotion.config.ts',
  '.gitignore',
];

rodar(async () => {
  const {values, positionals} = parseArgs({
    allowPositionals: true,
    options: {manter: {type: 'boolean', default: false}},
  });
  const slug = exigirSlug(positionals[0]);
  carregarEnv();
  const video = lerVideo(slug);
  const linha = linhaDoTempoDoDisco(slug, video);
  const narracao = lerNarracao(slug);
  const dir = caminhos(slug);

  const mp4 = path.join(dir.saida, `${slug}.mp4`);
  const arquivoRegistro = path.join(dir.pasta, 'arquivo.json');
  const anterior = existsSync(arquivoRegistro) ? (JSON.parse(readFileSync(arquivoRegistro, 'utf8')) as RegistroArquivo) : null;
  const registroDoRender = path.join(dir.saida, 'render.json');
  const impressaoDoRender = existsSync(registroDoRender)
    ? (JSON.parse(readFileSync(registroDoRender, 'utf8')) as {impressaoDoMp4?: string}).impressaoDoMp4
    : undefined;
  // Sem MP4 local: só vale se o vídeo já está no Drive e nada que entra no MP4 mudou
  // (atualiza capa, post, carrossel, documentos...).
  const mp4JaNoDrive = anterior !== null && Date.parse(anterior.arquivadoEm) >= ultimaMudancaDoMp4(slug, video, anterior.impressaoDoMp4);
  if (!existsSync(mp4) && !mp4JaNoDrive) {
    throw new ErroDeUso(`Ainda não há vídeo renderizado. Rode npm run render -- ${slug}`);
  }
  if (existsSync(mp4) && statSync(mp4).mtimeMs < ultimaMudancaDoMp4(slug, video, impressaoDoRender)) {
    throw new ErroDeUso(`O MP4 está desatualizado (algo mudou depois do render). Rode npm run render -- ${slug}`);
  }
  const duracao = avaliarDuracao(linha.duracao / FORMATO.fps, video.duracao);
  if (!duracao.ok) {
    throw new ErroDeUso(`Duração fora da faixa: ${duracao.resumo}.`);
  }

  const raizDrive = exigirDrive();
  const canal = path.join(raizDrive, ARQUIVO.pastaNoDrive);
  const data = anterior?.pasta.slice(0, 10) ?? hoje();
  const pasta = anterior?.pasta ?? `${data} · ${nomeSeguro(video.titulo)}`;
  const destino = path.join(canal, 'Vídeos', pasta);

  const voz = resolverVoz(video);
  const cfgVoz = configDoPerfil(voz.perfil);
  const aceleracao = cfgVoz.ritmo ? `até ${cfgVoz.ritmo.palavrasPorSegundo} palavras/s` : `${cfgVoz.aceleracao ?? 1}x`;
  const vozDescricao =
    voz.provedor === 'elevenlabs'
      ? `ElevenLabs · ${voz.vozId} · velocidade ${voz.velocidade} · ${cfgVoz.modelo}${voz.perfil === 'expressiva' ? ` (expressiva, acelerada ${aceleracao})` : ''}`
      : `Windows (${voz.vozId}) · rascunho`;

  // [origem (ou conteúdo gerado), destino relativo à pasta do vídeo]
  const copias: Array<[string, string]> = [];
  const gerados: Array<[string, string]> = [];
  if (existsSync(mp4)) {
    copias.push([mp4, `01 Publicação/${slug}.mp4`]);
  } else {
    console.log('MP4 já está no Drive e nada mudou desde então: atualizando só os demais arquivos.');
  }
  for (const arquivo of ['capa.jpg', 'capa.png', 'legenda.srt', 'post.txt']) {
    if (existsSync(path.join(dir.saida, arquivo))) {
      copias.push([path.join(dir.saida, arquivo), `01 Publicação/${arquivo}`]);
    }
  }
  // Peças do Estúdio Pro (npm run carrossel): lâminas, capa do YouTube, story e legenda.
  const carrossel = path.join(dir.saida, 'carrossel');
  if (existsSync(carrossel)) {
    for (const arquivo of readdirSync(carrossel)) {
      copias.push([path.join(carrossel, arquivo), `01 Publicação/Carrossel/${arquivo}`]);
    }
  }
  gerados.push([gerarRoteiroLegivel(video, linha), '02 Roteiro/roteiro.md']);
  copias.push([dir.video, '03 Projeto/video.json'], [dir.cenas, '03 Projeto/cenas.tsx']);
  // Código extra do vídeo (ex.: mundo.tsx de um episódio POV) também vai, para o projeto reabrir inteiro.
  for (const extra of readdirSync(dir.pasta).filter((a) => /\.(tsx?|json)$/.test(a) && !['cenas.tsx', 'video.json', 'arquivo.json'].includes(a))) {
    copias.push([path.join(dir.pasta, extra), `03 Projeto/${extra}`]);
  }
  if (existsSync(dir.audio)) {
    for (const arquivo of readdirSync(dir.audio)) {
      copias.push([path.join(dir.audio, arquivo), `03 Projeto/audio/${arquivo}`]);
    }
  }
  const storyboard = path.join(dir.saida, 'storyboard.png');
  if (existsSync(storyboard)) {
    copias.push([storyboard, '04 Prévia/storyboard.png']);
  }
  gerados.push([gerarFichaTecnica({slug, video, linha, narracao, data, vozDescricao}), 'Ficha técnica.md']);

  console.log(`Arquivando "${video.titulo}" em ${destino}\n`);
  const registro: RegistroArquivo = {pasta, arquivadoEm: new Date().toISOString(), impressaoDoMp4: impressaoDoMp4(video), arquivos: []};
  const copiar = (gravar: (alvo: string) => void, relativo: string, bytesEsperados: number) => {
    const alvo = path.join(destino, relativo);
    mkdirSync(path.dirname(alvo), {recursive: true});
    gravar(alvo);
    const bytes = statSync(alvo).size;
    if (bytes !== bytesEsperados) {
      throw new Error(`Cópia incompleta de ${relativo}: ${bytes} de ${bytesEsperados} bytes.`);
    }
    registro.arquivos.push({caminho: relativo, bytes});
    console.log(`  ✔ ${relativo.padEnd(38)} ${(bytes / 1024 / 1024).toFixed(2).padStart(7)} MB`);
  };
  for (const [origem, relativo] of copias) {
    copiar((alvo) => copyFileSync(origem, alvo), relativo, statSync(origem).size);
  }
  for (const [conteudo, relativo] of gerados) {
    copiar((alvo) => writeFileSync(alvo, conteudo, 'utf8'), relativo, Buffer.byteLength(conteudo, 'utf8'));
  }
  // Mantém no registro o que já estava no Drive e não foi recopiado agora (ex.: o MP4).
  for (const item of anterior?.arquivos ?? []) {
    if (!registro.arquivos.some((a) => a.caminho === item.caminho)) {
      registro.arquivos.push(item);
    }
  }
  salvarJson(arquivoRegistro, registro);

  // Índice geral do canal.
  const indice = path.join(canal, 'Índice de vídeos.md');
  writeFileSync(
    indice,
    atualizarIndice(existsSync(indice) ? readFileSync(indice, 'utf8') : null, {
      data,
      titulo: video.titulo,
      duracao: formatarTempo(linha.duracao / FORMATO.fps),
      pasta,
      slug,
    }),
    'utf8',
  );

  // Cópia do sistema (código do projeto), sem dependências nem segredos.
  const sistema = path.join(canal, 'Sistema');
  let arquivosDoSistema = 0;
  const copiarSistema = (relativo: string) => {
    const origem = path.join(RAIZ, relativo);
    if (!existsSync(origem)) {
      return;
    }
    if (statSync(origem).isDirectory()) {
      for (const filho of readdirSync(origem)) {
        copiarSistema(path.join(relativo, filho));
      }
      return;
    }
    const alvo = path.join(sistema, relativo);
    mkdirSync(path.dirname(alvo), {recursive: true});
    copyFileSync(origem, alvo);
    arquivosDoSistema++;
  };
  ARQUIVOS_DO_SISTEMA.forEach(copiarSistema);
  writeFileSync(path.join(sistema, 'VERSAO.txt'), `Cópia do sistema feita em ${new Date().toISOString()} (vídeo: ${slug}).\n`, 'utf8');

  const total = registro.arquivos.reduce((s, a) => s + a.bytes, 0) / 1024 / 1024;
  console.log(`\n${registro.arquivos.length} arquivos (${total.toFixed(1)} MB) + índice + Sistema (${arquivosDoSistema} arquivos de código).`);

  if (values.manter) {
    console.log('Arquivos locais mantidos (--manter).');
  } else {
    rmSync(dir.saida, {recursive: true, force: true});
    console.log(`Espaço liberado: videos/${slug}/saida/ apagada (refaça com npm run render -- ${slug}).`);
  }
  console.log('O Google Drive para computador envia para a nuvem em segundo plano.');
});
