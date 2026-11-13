// npm run status [-- <slug>]
// Mostra em que etapa do pipeline cada vídeo está e qual é o próximo passo.
import {existsSync, readFileSync, statSync} from 'node:fs';
import path from 'node:path';
import {ARQUIVO, FORMATO} from '../src/config';
import {avaliarDuracao} from '../src/video/duracao';
import {
  caminhos,
  carregarEnv,
  cenasImplementadas,
  ErroDeUso,
  exigirSlug,
  lerNarracao,
  lerVideo,
  linhaDoTempoDoDisco,
  listarSlugs,
  rodar,
  ultimaMudancaDoMp4,
} from './lib/projeto';
import {localizarDrive} from './lib/drive';
import {hashDaCena, resolverVoz, textoParaVoz} from './lib/vozConfig';

const modificado = (arquivo: string) => (existsSync(arquivo) ? statSync(arquivo).mtimeMs : 0);

const avaliar = (slug: string) => {
  const dir = caminhos(slug);
  let video;
  try {
    video = lerVideo(slug);
  } catch (erro) {
    return {slug, linhas: [`  ✖ ${(erro as Error).message}`], proximo: 'corrigir o video.json'};
  }
  const linha = linhaDoTempoDoDisco(slug, video);
  const comFala = linha.cenas.filter((c) => c.narracao !== 'sem-fala');
  const vozOk = comFala.filter((c) => c.narracao === 'gerada').length;
  // Voz gerada com outra configuração (velocidade, modelo, voz): o texto bate, mas vale refazer.
  const voz = resolverVoz(video);
  const narracao = lerNarracao(slug);
  const configAntiga = video.cenas.filter((c) => {
    const gerada = narracao?.cenas.find((n) => n.id === c.id);
    return gerada && gerada.texto === c.narracao.trim() && gerada.hash !== hashDaCena(textoParaVoz({narracao: gerada.texto, emocao: c.emocao}, voz), voz);
  });
  const prontas = cenasImplementadas(slug);
  const codigoOk = video.cenas.filter((c) => prontas.has(c.id)).length;
  const mp4 = path.join(dir.saida, `${slug}.mp4`);
  const ultimaMudanca = Math.max(modificado(dir.video), modificado(dir.cenas), modificado(dir.narracao));
  const duracao = avaliarDuracao(linha.duracao / FORMATO.fps, video.duracao);
  // Depois de `npm run arquivar` o MP4 sai do computador: vale o registro do arquivo no Drive.
  const registroArquivo = path.join(dir.pasta, 'arquivo.json');
  const arquivo = existsSync(registroArquivo)
    ? (JSON.parse(readFileSync(registroArquivo, 'utf8')) as {pasta: string; arquivadoEm: string; impressaoDoMp4?: string})
    : null;
  // Drive em dia: nada mudou depois do arquivo (nem um carrossel novo em saida/carrossel/).
  const arquivadoAtual =
    arquivo !== null && Date.parse(arquivo.arquivadoEm) >= Math.max(ultimaMudanca, modificado(path.join(dir.saida, 'carrossel')));
  // MP4 em dia: nada que entra no vídeo mudou (mudar só capa, post ou carrossel não pede render).
  const registroDoRender = path.join(dir.saida, 'render.json');
  const impressaoDoRender = existsSync(registroDoRender)
    ? (JSON.parse(readFileSync(registroDoRender, 'utf8')) as {impressaoDoMp4?: string}).impressaoDoMp4
    : undefined;
  const mp4NoDrive = arquivo !== null && Date.parse(arquivo.arquivadoEm) >= ultimaMudancaDoMp4(slug, video, arquivo.impressaoDoMp4);
  const renderOk = (existsSync(mp4) && modificado(mp4) >= ultimaMudancaDoMp4(slug, video, impressaoDoRender)) || mp4NoDrive;

  // Arquivar no Drive é opcional: a linha só aparece para quem tem o Drive no computador (ou já arquivou).
  const usaDrive = arquivo !== null || localizarDrive() !== null;
  const marca = (ok: boolean) => (ok ? '✔' : '·');
  const linhas = [
    `  ${marca(video.roteiroAprovado)} roteiro   ${video.roteiroAprovado ? 'aprovado' : 'aguardando sua aprovação'} (${video.cenas.length} cenas)`,
    `  ${marca(vozOk === comFala.length && configAntiga.length === 0)} voz       ${vozOk}/${comFala.length} cenas${vozOk < comFala.length ? ` — faltam: ${comFala.filter((c) => c.narracao !== 'gerada').map((c) => c.id).join(', ')}` : ''}${configAntiga.length ? ` — ${configAntiga.length} com configuração de voz antiga` : ''}`,
    `  ${marca(codigoOk === video.cenas.length)} cenas 3D  ${codigoOk}/${video.cenas.length} programadas`,
    `  ${marca(renderOk)} render    ${existsSync(mp4) ? (renderOk ? 'atualizado' : 'desatualizado (algo mudou depois)') : mp4NoDrive ? 'feito (MP4 no Drive)' : 'ainda não'}`,
    `  ${marca(duracao.ok)} duração   ${duracao.resumo}${linha.narracaoCompleta ? '' : ' (estimada, sem voz)'}`,
    ...(usaDrive
      ? [
          `  ${marca(arquivadoAtual)} drive     ${arquivo ? `${arquivadoAtual ? '' : 'DESATUALIZADO · '}${ARQUIVO.pastaNoDrive}/Vídeos/${arquivo.pasta}` : 'ainda não arquivado'}`,
        ]
      : []),
  ];
  const proximo = !duracao.ok
    ? `ajustar o tamanho do roteiro (${duracao.resumo})`
    : !video.roteiroAprovado
    ? 'revisar e aprovar o roteiro (roteiroAprovado: true)'
    : vozOk < comFala.length || configAntiga.length > 0
      ? `npm run voz -- ${slug}`
      : codigoOk < video.cenas.length
        ? 'programar as cenas que faltam em cenas.tsx'
        : !renderOk
          ? `npm run previa -- ${slug}  e depois  npm run render -- ${slug}`
          : !usaDrive
            ? `publicar! (videos/${slug}/saida/)`
            : !arquivadoAtual
              ? `npm run arquivar -- ${slug}`
              : 'publicar! (Drive > 01 Publicação)';
  return {slug, linhas, proximo};
};

rodar(async () => {
  carregarEnv();
  const pedido = process.argv[2];
  const slugs = pedido ? [exigirSlug(pedido)] : listarSlugs();
  if (slugs.length === 0) {
    throw new ErroDeUso('Nenhum vídeo ainda. Crie um com: npm run novo -- <slug> "Título"');
  }
  for (const slug of slugs) {
    const {linhas, proximo} = avaliar(slug);
    console.log(`\n${slug}`);
    console.log(linhas.join('\n'));
    console.log(`  → próximo: ${proximo}`);
  }
});
