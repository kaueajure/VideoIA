// npm run voz -- <slug> [--provedor elevenlabs|windows] [--cena <id>]... [--forcar] [--sem-aprovacao] [--ignorar-duracao]
//
// Gera um áudio por cena + os tempos de cada palavra (audio/narracao.json).
// Só refaz cenas cujo texto, voz ou configuração mudou (economiza créditos).
// Antes de gastar créditos, confere se o roteiro cabe na duração exigida (config.ts > DURACAO).
import {existsSync, mkdirSync, readdirSync, rmSync} from 'node:fs';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {DURACAO, FORMATO, VOZ} from '../src/config';
import type {Narracao, NarracaoCena} from '../src/esquema';
import {avaliarDuracao} from '../src/video/duracao';
import {duracaoDoAudio} from './lib/audio';
import {
  caminhos,
  carregarEnv,
  ErroDeUso,
  exigirSlug,
  lerNarracao,
  lerVideo,
  linhaDoTempoDoDisco,
  rodar,
  salvarJson,
  segundos,
} from './lib/projeto';
import {configDoPerfil, hashDaCena, resolverVoz, textoParaVoz} from './lib/vozConfig';
import {acelerarAudio, fatoresDoVideo, gerarComElevenLabs, ritmoDaFala} from './voz/elevenlabs';
import {gerarComWindows} from './voz/windows';

rodar(async () => {
  const {values, positionals} = parseArgs({
    allowPositionals: true,
    options: {
      provedor: {type: 'string'},
      cena: {type: 'string', multiple: true},
      forcar: {type: 'boolean', default: false},
      'sem-aprovacao': {type: 'boolean', default: false},
      'ignorar-duracao': {type: 'boolean', default: false},
    },
  });
  const slug = exigirSlug(positionals[0]);
  const video = lerVideo(slug);
  const dir = caminhos(slug);
  carregarEnv();

  if (!video.roteiroAprovado && !values['sem-aprovacao']) {
    throw new ErroDeUso(
      `O roteiro de "${slug}" ainda não foi aprovado (roteiroAprovado: false no video.json).\n` +
        'Aprove o roteiro antes de gerar a voz, ou use --sem-aprovacao para um teste.',
    );
  }

  const voz = resolverVoz(video, values.provedor);
  const {provedor, vozId, velocidade} = voz;
  if (provedor !== 'elevenlabs' && provedor !== 'windows') {
    throw new ErroDeUso(`Provedor desconhecido "${provedor}". Use elevenlabs ou windows.`);
  }
  if (!vozId) {
    throw new ErroDeUso(
      'Escolha a voz do canal: liste as vozes com `npm run vozes` e coloque o voice_id em src/config.ts > VOZ.vozDoCanal (ou voz.vozId no video.json).',
    );
  }

  const somente = values.cena ? new Set(values.cena) : null;
  if (somente) {
    const desconhecidas = [...somente].filter((id) => !video.cenas.some((c) => c.id === id));
    if (desconhecidas.length) {
      throw new ErroDeUso(`Cena(s) inexistente(s): ${desconhecidas.join(', ')}`);
    }
  }

  // A estimativa erra uns 10% para mais ou para menos: só barra o que está claramente fora.
  const estimada = avaliarDuracao(linhaDoTempoDoDisco(slug, video).duracao / FORMATO.fps, video.duracao);
  const limites = video.duracao ?? DURACAO;
  const claramenteFora = estimada.segundos < limites.minima * 0.9 || estimada.segundos > limites.maxima * 1.08;
  if (claramenteFora && !values['ignorar-duracao']) {
    throw new ErroDeUso(
      `Duração estimada do roteiro: ${estimada.resumo}.\n` +
        'Ajuste o texto (ou as cenas) antes de gastar créditos de voz — ou use --ignorar-duracao.',
    );
  }
  console.log(`Duração estimada antes da voz: ${estimada.resumo}`);

  mkdirSync(dir.audio, {recursive: true});
  const anterior = lerNarracao(slug);
  const cenas: NarracaoCena[] = [];
  let caracteresEnviados = 0;
  // Perfis com `ritmo` (voz expressiva): as cenas novas saem no ritmo natural e são aceleradas juntas no fim.
  const aceleraNoFim = provedor === 'elevenlabs' && Boolean(configDoPerfil(voz.perfil).ritmo);
  const novas: Array<{entrada: NarracaoCena; caminho: string}> = [];

  const ritmo =
    provedor === 'elevenlabs' && voz.perfil === 'expressiva'
      ? `perfil expressiva (${configDoPerfil(voz.perfil).modelo}, acelerada ${configDoPerfil(voz.perfil).ritmo ? `até ${configDoPerfil(voz.perfil).ritmo?.palavrasPorSegundo} palavras/s` : `${configDoPerfil(voz.perfil).aceleracao ?? 1}x`})`
      : `velocidade ${velocidade}`;
  console.log(`Voz de "${video.titulo}" — ${provedor} (${vozId}), ${ritmo}\n`);

  for (const [i, cena] of video.cenas.entries()) {
    const texto = cena.narracao.trim();
    if (!texto) {
      continue;
    }
    const hash = hashDaCena(textoParaVoz(cena, voz), voz);
    const existente = anterior?.cenas.find((c) => c.id === cena.id) ?? null;
    const arquivoExiste = existente ? existsSync(path.join(dir.audio, existente.arquivo)) : false;
    const pedida = somente ? somente.has(cena.id) : true;
    const precisa = !existente || !arquivoExiste || existente.hash !== hash || (values.forcar && pedida);

    if (!precisa || !pedida) {
      if (existente && arquivoExiste) {
        cenas.push(existente);
        console.log(`  = ${cena.id.padEnd(22)} ${segundos(existente.duracao).padStart(6)}  ${existente.hash === hash ? 'sem mudanças' : 'mantida (fora de --cena)'}`);
      }
      continue;
    }

    const arquivo = `${cena.id}.${provedor === 'elevenlabs' ? 'mp3' : 'wav'}`;
    const caminho = path.join(dir.audio, arquivo);
    const inicio = Date.now();
    const {palavras} =
      provedor === 'elevenlabs'
        ? await gerarComElevenLabs({
            texto: textoParaVoz(cena, voz),
            anterior: video.cenas[i - 1]?.narracao.trim() || null,
            proximo: video.cenas[i + 1]?.narracao.trim() || null,
            vozId,
            velocidade,
            cfg: configDoPerfil(voz.perfil),
            arquivo: caminho,
            // Com `ritmo`, o vídeo inteiro é acelerado de uma vez no fim (mesmo andamento em todas as cenas).
            acelerar: !aceleraNoFim,
          })
        : await gerarComWindows({texto, voz: vozId, velocidade, arquivo: caminho});
    if (palavras.length === 0) {
      throw new Error(`Nenhuma palavra reconhecida no áudio da cena "${cena.id}".`);
    }
    caracteresEnviados += texto.length;
    const entrada = {id: cena.id, arquivo, provedor, voz: vozId, hash, texto, duracao: 1, duracaoArquivo: 1, palavras, taxaBruta: ritmoDaFala(palavras)?.geral, taxaArticulacao: ritmoDaFala(palavras)?.articulacao};
    cenas.push(entrada);
    if (aceleraNoFim) {
      novas.push({entrada, caminho});
    } else {
      entrada.duracaoArquivo = await duracaoDoAudio(caminho);
      entrada.duracao = Math.min(entrada.duracaoArquivo, palavras[palavras.length - 1].fim + VOZ.margemFinal);
    }
    console.log(`  + ${cena.id.padEnd(22)} ${palavras.length} palavras (${((Date.now() - inicio) / 1000).toFixed(1)}s)`);
  }

  // Aceleração do vídeo inteiro: um fator tirado do ritmo natural de TODAS as cenas (as novas e as
  // mantidas, que guardam `taxaBruta`), com no máximo ±6% de diferença entre cenas.
  if (novas.length) {
    const ritmos = cenas.flatMap((c) => (c.taxaBruta && c.taxaArticulacao ? [{geral: c.taxaBruta, articulacao: c.taxaArticulacao}] : []));
    const fatorDe = fatoresDoVideo(configDoPerfil(voz.perfil), ritmos);
    for (const {entrada, caminho} of novas) {
      const fator = fatorDe(entrada.taxaBruta && entrada.taxaArticulacao ? {geral: entrada.taxaBruta, articulacao: entrada.taxaArticulacao} : null);
      await acelerarAudio(caminho, entrada.palavras, fator);
      entrada.duracaoArquivo = await duracaoDoAudio(caminho);
      entrada.duracao = Math.min(entrada.duracaoArquivo, entrada.palavras[entrada.palavras.length - 1].fim + VOZ.margemFinal);
      console.log(`  ↗ ${entrada.id.padEnd(22)} ${segundos(entrada.duracao).padStart(6)}  acelerada ${fator}x`);
    }
  }

  const narracao: Narracao = {versao: 1, atualizadoEm: new Date().toISOString(), cenas};
  salvarJson(dir.narracao, narracao);

  // Remove áudios que nenhuma cena usa mais.
  const usados = new Set(cenas.map((c) => c.arquivo));
  for (const arquivo of readdirSync(dir.audio)) {
    if (/\.(mp3|wav)$/i.test(arquivo) && !usados.has(arquivo)) {
      rmSync(path.join(dir.audio, arquivo));
      console.log(`  - ${arquivo} removido (não é mais usado)`);
    }
  }

  const linha = linhaDoTempoDoDisco(slug, video);
  const pendentes = linha.cenas.filter((c) => c.narracao === 'estimada' || c.narracao === 'desatualizada');
  const real = avaliarDuracao(linha.duracao / FORMATO.fps, video.duracao);
  console.log(`\n${real.ok ? '✔' : '⚠'} Duração do vídeo: ${real.resumo} · ${video.cenas.length} cenas`);
  if (!real.ok) {
    console.log(
      real.desvio < 0
        ? '  Acrescente narração (ou use pausaDepois/duracaoMinima nas cenas): o render final vai recusar.'
        : '  Corte narração (ou aumente a velocidade da voz): o render final vai recusar.',
    );
  }
  if (provedor === 'elevenlabs') {
    console.log(`Caracteres enviados ao ElevenLabs nesta execução: ${caracteresEnviados}`);
  }
  if (pendentes.length) {
    console.log(`Ainda sem voz atualizada: ${pendentes.map((c) => c.id).join(', ')}`);
  }
  console.log(`Tempos por palavra: videos/${slug}/audio/narracao.json`);
});
