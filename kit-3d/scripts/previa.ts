// npm run previa -- <slug> [--cena <id>]... [--momentos 0.2,0.6] [--quadros 30,95]
// npm run previa -- <slug> --limpa   (sem painel nem área segura: para mandar a um cliente)
// npm run previa -- kit-bonecos | kit-objetos | kit-objetos-2 | pro-<categoria>
// npm run previa -- pro-cenas | pro-vinhetas [--cena <id>] [--momentos 0.3,0.9]   (cenas prontas do Estúdio Pro)
// --estilo noite|papel|oceano|neon   testa outro estilo sem mexer na config (vídeos e vitrines)
//
// Renderiza quadros soltos (PNG) com o painel de prévia e a área segura,
// mais uma folha de contato com todos eles: saida/previa/folha.png.
import {renderStill, selectComposition} from '@remotion/renderer';
import {existsSync, mkdirSync, rmSync} from 'node:fs';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {caminhos, ErroDeUso, exigirSlug, lerVideo, linhaDoTempoDoDisco, RAIZ, rodar} from './lib/projeto';
import {OPCOES_CHROMIUM, prepararRender, propsDeEstilo, tempoDesde} from './lib/render';
import {densidadeVisual, DENSIDADE_MINIMA} from './lib/densidade';
import {montarFolhaDeContato} from './lib/saidas';

type Pedido = {quadro: number; nome: string};
type Trecho = {id: string; inicio: number; duracao: number};

// Quadros pedidos dentro de cada cena (ou de cada exemplo de uma vitrine de cenas).
const quadrosDosTrechos = (trechos: Trecho[], escolha: string[] | undefined, momentosPedidos: number[] | null): Pedido[] => {
  const escolhidas = escolha ? trechos.filter((c) => escolha.includes(c.id)) : trechos;
  if (escolha && escolhidas.length !== escolha.length) {
    throw new ErroDeUso(`Cena inexistente. Cenas: ${trechos.map((c) => c.id).join(', ')}`);
  }
  // Sem --cena: um quadro por cena. Com --cena: começo, meio e fim de cada cena pedida.
  const momentos = momentosPedidos ?? (escolha ? [0.12, 0.5, 0.92] : [0.6]);
  return escolhidas.flatMap((cena) =>
    momentos.map((m) => ({quadro: cena.inicio + Math.round(Math.min(1, Math.max(0, m)) * (cena.duracao - 1)), nome: cena.id})),
  );
};

const lerNumeros = (texto: string | undefined) =>
  texto
    ? texto
        .split(',')
        .map((v) => Number(v.trim()))
        .filter((v) => Number.isFinite(v))
    : null;

rodar(async () => {
  const {values, positionals} = parseArgs({
    allowPositionals: true,
    options: {
      cena: {type: 'string', multiple: true},
      momentos: {type: 'string'},
      quadros: {type: 'string'},
      limpa: {type: 'boolean', default: false},
      estilo: {type: 'string'},
    },
  });
  const alvo = positionals[0];
  // Vitrines (kit-bonecos, kit-objetos, kit-objetos-2, pro-<categoria>): um quadro só, sem vídeo.
  const ehKit = /^(kit|pro)-[a-z0-9-]+$/.test(alvo ?? '') && !existsSync(caminhos(alvo).pasta);
  const slug = ehKit ? alvo : exigirSlug(alvo);

  const pedidos: Pedido[] = [];
  let pasta: string;
  const estilo = values.estilo ? {estilo: values.estilo} : {};
  if (ehKit) {
    pasta = path.join(RAIZ, 'out', `previa-${slug}${values.estilo ? `-${values.estilo}` : ''}`);
  } else {
    pasta = caminhos(slug).previa;
    const linha = linhaDoTempoDoDisco(slug);
    const absolutos = lerNumeros(values.quadros);
    if (absolutos) {
      for (const q of absolutos) {
        const cena = linha.cenas.find((c) => q >= c.inicio && q < c.inicio + c.duracao);
        pedidos.push({quadro: Math.min(q, linha.duracao - 1), nome: cena?.id ?? 'fim'});
      }
    } else {
      pedidos.push(...quadrosDosTrechos(linha.cenas, values.cena, lerNumeros(values.momentos)));
    }
  }

  rmSync(pasta, {recursive: true, force: true});
  mkdirSync(pasta, {recursive: true});
  const inicio = Date.now();
  const {serveUrl, navegador} = await prepararRender();
  try {
    const inputProps = ehKit
      ? estilo
      : {slug, previa: !values.limpa, areaSegura: !values.limpa, ...propsDeEstilo(lerVideo(slug)), ...estilo};
    const composicao = await selectComposition({
      serveUrl,
      id: slug,
      inputProps,
      puppeteerInstance: navegador,
      chromiumOptions: OPCOES_CHROMIUM,
    });
    if (ehKit) {
      // Vitrines de cenas (pro-cenas, pro-vinhetas) trazem os trechos de cada exemplo nas props.
      const trechos = (composicao.props as {trechos?: Array<{nome: string; inicio: number; duracao: number}>}).trechos;
      if (trechos?.length) {
        const cenas = trechos.map((t) => ({id: t.nome, inicio: t.inicio, duracao: t.duracao}));
        pedidos.push(...quadrosDosTrechos(cenas, values.cena, lerNumeros(values.momentos)));
      } else {
        pedidos.push({quadro: 40, nome: slug});
      }
    }
    const arquivos = pedidos.map((p, i) => path.join(pasta, `${String(i + 1).padStart(2, '0')}-${p.nome}-q${p.quadro}.png`));

    // Até 4 quadros ao mesmo tempo.
    let proximo = 0;
    const trabalhador = async () => {
      while (proximo < pedidos.length) {
        const i = proximo++;
        await renderStill({
          composition: composicao,
          serveUrl,
          output: arquivos[i],
          frame: pedidos[i].quadro,
          inputProps,
          imageFormat: 'png',
          puppeteerInstance: navegador,
          chromiumOptions: OPCOES_CHROMIUM,
          overwrite: true,
        });
        console.log(`  ${path.relative(RAIZ, arquivos[i])}`);
      }
    };
    await Promise.all(Array.from({length: Math.min(4, pedidos.length)}, trabalhador));

    if (arquivos.length > 1) {
      const folha = path.join(pasta, 'folha.png');
      montarFolhaDeContato(arquivos, folha);
      console.log(`\nFolha de contato: ${path.relative(RAIZ, folha)}`);
    }
    console.log(`${pedidos.length} quadro(s) em ${tempoDesde(inicio)}`);

    // Tela vazia é o defeito que mais derruba a retenção: avisa com número.
    if (!ehKit) {
      const medidas = arquivos.map((arquivo, i) => ({pedido: pedidos[i], densidade: densidadeVisual(arquivo)}));
      const vazios = medidas.filter((m) => m.densidade < DENSIDADE_MINIMA);
      console.log(`\nDensidade visual (detalhe na área principal): ${medidas.map((m) => `${m.pedido.nome} ${m.densidade.toFixed(1)}%`).join(' · ')}`);
      if (vazios.length) {
        console.log(`⚠ Quadros quase vazios (< ${DENSIDADE_MINIMA}%): ${vazios.map((m) => `${m.pedido.nome} q${m.pedido.quadro}`).join(', ')}`);
        console.log('  Coloque o assunto em cena desde o quadro 0 e algo novo a cada ~1–1,5 s.');
      } else {
        console.log('✔ Nenhum quadro quase vazio.');
      }
    }
  } finally {
    await navegador.close({silent: true});
  }
});
