// npm run estilo                                  → prévia do estilo do canal (cena + capa)
// npm run estilo -- --todos                       → os 4 estilos lado a lado, para escolher
// npm run estilo -- --estilo neon --destaque "#ff4d8d"   → testa um visual sem mexer na config
//
// O estilo do canal fica em src/config.ts (MARCA). Resultado em saida/estilo/.
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync, rmSync} from 'node:fs';
import path from 'node:path';
import {MARCA} from '../src/config';
import {ESTILOS, NOMES_ESTILOS} from '../src/kit/estilos';
import {ErroDeUso, RAIZ} from './lib/projeto';
import {OPCOES_CHROMIUM, prepararRender, tempoDesde} from './lib/render';
import {montarFolhaDeContato} from './lib/saidas';

const QUADRO = 45;

const lerOpcao = (nome: string) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
};

const principal = async () => {
  const todos = process.argv.includes('--todos');
  const estilo = lerOpcao('estilo');
  const destaque = lerOpcao('destaque');
  if (estilo && !(estilo in ESTILOS)) {
    throw new ErroDeUso(`Estilo "${estilo}" não existe. Opções: ${NOMES_ESTILOS.join(', ')}.`);
  }
  if (destaque && !/^#[0-9a-fA-F]{6}$/.test(destaque)) {
    throw new ErroDeUso(`Cor "${destaque}" inválida. Use o formato #RRGGBB, por exemplo "#ff4d8d".`);
  }

  const pasta = path.join(RAIZ, 'saida', 'estilo');
  rmSync(pasta, {recursive: true, force: true});
  mkdirSync(pasta, {recursive: true});
  const inicio = Date.now();
  const {serveUrl, navegador} = await prepararRender();

  const quadro = async (id: 'estilo-amostra' | 'estilo-capa', nome: string, props: Record<string, unknown>) => {
    const inputProps = {modo: id === 'estilo-capa' ? 'capa' : 'cena', rotulo: false, ...props};
    const composition = await selectComposition({serveUrl, id, inputProps, puppeteerInstance: navegador, chromiumOptions: OPCOES_CHROMIUM});
    const saida = path.join(pasta, `${nome}.png`);
    await renderStill({
      composition,
      serveUrl,
      output: saida,
      frame: QUADRO,
      inputProps,
      imageFormat: 'png',
      puppeteerInstance: navegador,
      chromiumOptions: OPCOES_CHROMIUM,
      overwrite: true,
    });
    return saida;
  };

  try {
    if (todos) {
      const quadros: string[] = [];
      for (const nome of NOMES_ESTILOS) {
        quadros.push(await quadro('estilo-amostra', nome, {estilo: nome, rotulo: true}));
      }
      montarFolhaDeContato(quadros, path.join(pasta, 'estilos.png'), 3, 4);
      console.log(`\nOs 4 estilos lado a lado: saida/estilo/estilos.png (${tempoDesde(inicio)})`);
      console.log('Cada um também está sozinho em saida/estilo/<nome>.png.');
    } else {
      const props = {...(estilo ? {estilo} : {}), ...(destaque ? {destaque} : {})};
      const cena = await quadro('estilo-amostra', 'cena', props);
      const capa = await quadro('estilo-capa', 'capa', props);
      montarFolhaDeContato([cena, capa], path.join(pasta, 'previa.png'), 2, 2);
      const nome = ESTILOS[(estilo as keyof typeof ESTILOS) ?? MARCA.estilo].nome;
      const cor = destaque ?? MARCA.destaque ?? ESTILOS[(estilo as keyof typeof ESTILOS) ?? MARCA.estilo].destaque;
      console.log(`\nEstilo ${nome} · destaque ${cor} · série "${MARCA.assinatura}"`);
      console.log(`Prévia: saida/estilo/previa.png (cena e capa) (${tempoDesde(inicio)})`);
      if (estilo || destaque) {
        console.log('Isto foi só um teste: para adotar, ajuste MARCA em src/config.ts.');
      }
    }
  } finally {
    await navegador.close({silent: true});
  }
};

principal().catch((erro: unknown) => {
  if (erro instanceof ErroDeUso) {
    console.error(erro.message);
  } else {
    console.error(erro);
  }
  process.exit(1);
});
