/* Rotas do modo Vídeo 3D (kit Remotion embutido). */
import fs from 'node:fs';
import path from 'node:path';
import { traduzirErro } from '../../video/erros.mjs';
import { NOME } from './comum.mjs';
import { vozDoTeste } from './voz.mjs';
import {
  ARQ_PEDIDO_3D,
  estadoVideo3d,
  kitPresente,
  listarVideos3d,
  lerPedido3d,
  nomeDoTema3d,
  nomeLivre3d,
  pastaKit,
  pastaSlug,
  pastaVideos,
  pedidoKit3d,
  sincronizarEnvKit,
} from '../kit3d.mjs';

const PRODUZINDO = '.produzindo-3d.lock';

function lockAtivo(arquivo) {
  try {
    const o = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
    if (!o?.pid || !o.inicio || Date.now() - Date.parse(o.inicio) > 12 * 36e5) return false;
    try {
      process.kill(o.pid, 0);
      return true;
    } catch (e) {
      return e.code === 'EPERM';
    }
  } catch {
    try {
      return Date.now() - fs.statSync(arquivo).mtimeMs < 5000;
    } catch {
      return false;
    }
  }
}

function escreverLock(pasta) {
  fs.writeFileSync(
    path.join(pasta, PRODUZINDO),
    JSON.stringify({ pid: process.pid, inicio: new Date().toISOString() }),
  );
}

function limparLock(pasta) {
  try {
    fs.unlinkSync(path.join(pasta, PRODUZINDO));
  } catch {
    /* ok */
  }
}

async function vozOk(ctx) {
  return vozDoTeste(ctx);
}

function etapasKitEsm(raiz, slug, { comVoz = true, comRender = true } = {}) {
  const run = path.join(raiz, 'scripts', 'kit-3d-run.mjs');
  const etapas = [
    {
      rotulo: 'preparando o kit 3D',
      fn: async (_job, log) => {
        if (!kitPresente(raiz)) {
          log('kit-3d ausente');
          return 1;
        }
        sincronizarEnvKit(raiz, { forcar: false });
        const nm = path.join(pastaKit(raiz), 'node_modules');
        if (fs.existsSync(nm)) return 0;
        log('instalando dependências do kit-3d (primeira vez)…');
        const { spawn } = await import('node:child_process');
        const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
        return await new Promise((resolve) => {
          const p = spawn(npm, ['install'], {
            cwd: pastaKit(raiz),
            env: process.env,
            windowsHide: true,
          });
          p.stdout?.on('data', (b) => String(b).split(/\r?\n/).filter(Boolean).forEach(log));
          p.stderr?.on('data', (b) => String(b).split(/\r?\n/).filter(Boolean).forEach(log));
          p.on('close', (c) => resolve(c ?? 1));
          p.on('error', (e) => {
            log(e.message);
            resolve(1);
          });
        });
      },
    },
  ];
  if (comVoz) {
    etapas.push({ rotulo: 'gerando a voz 3D', args: [run, 'voz', '--', slug], aceita: [0] });
  }
  if (comRender) {
    etapas.push({ rotulo: 'renderizando o vídeo 3D', args: [run, 'render', '--', slug], aceita: [0] });
  }
  return etapas;
}

const POST = {
  async '/api/kit3d'(ctx, body) {
    const { raiz, job } = ctx;
    if (!kitPresente(raiz)) {
      return [
        {
          erro: {
            causa: 'O kit 3D ainda não está nesta pasta do estúdio.',
            acao: 'Confira se a pasta kit-3d existe na raiz do estúdio.',
          },
        },
        400,
      ];
    }
    const tema = String(body.tema || '').replace(/\s+/g, ' ').trim();
    if (tema.length < 3) {
      return [
        {
          erro: {
            causa: 'Escreva o tema do vídeo 3D.',
            acao: 'Ex.: por que a bola faz curva na trivela.',
          },
        },
        400,
      ];
    }
    if (job && !job.fim) {
      return [
        {
          erro: {
            causa: `Espere terminar: ${job.titulo.toLowerCase()} ainda está em andamento.`,
            acao: 'Quando a tarefa da direita terminar, clique de novo.',
          },
        },
        409,
      ];
    }
    const voz = await vozOk(ctx);
    if (voz.erro) return [{ erro: voz.erro, irPara: voz.irPara }, 400];

    sincronizarEnvKit(raiz, { forcar: false });

    const baseVideos = pastaVideos(raiz);
    fs.mkdirSync(baseVideos, { recursive: true });
    const ocupados = new Set(fs.readdirSync(baseVideos));
    const slug =
      (NOME.test(body.nome || '') && ocupados.has(body.nome) && fs.existsSync(path.join(pastaSlug(raiz, body.nome), ARQ_PEDIDO_3D))
        ? body.nome
        : null) || nomeLivre3d(nomeDoTema3d(tema), ocupados);

    const pasta = pastaSlug(raiz, slug);
    try {
      fs.mkdirSync(pasta, { recursive: true });
    } catch (e) {
      return [
        {
          erro: traduzirErro(e.message) || {
            causa: 'Não consegui criar a pasta do vídeo 3D.',
            acao: 'Mova o estúdio para uma pasta local e tente de novo.',
          },
        },
        400,
      ];
    }

    const pedido = pedidoKit3d({
      tema,
      nome: slug,
      idioma: body.idioma,
      gancho: body.gancho,
      titulo: body.titulo,
      virada: body.virada,
      pergunta: body.pergunta,
      pasta: raiz,
    });

    try {
      fs.writeFileSync(
        path.join(pasta, ARQ_PEDIDO_3D),
        `# Pedido do estúdio web (aba 3D)

${pedido}
`,
      );
    } catch {
      /* segue com o pedido na resposta */
    }

    const { iniciar, etapasInstalacao, etapasVoz } = ctx.tarefas;
    const prep = iniciar(
      'preparar-3d',
      'Preparando o kit 3D',
      [
        ...etapasInstalacao(),
        ...etapasVoz(voz),
        {
          rotulo: 'sincronizando chaves do kit 3D',
          fn: async () => {
            sincronizarEnvKit(raiz, { forcar: true });
            return 0;
          },
        },
      ],
      { nome: slug, voz: voz.voz },
    );
    if (prep.erro) {
      return [{ erro: { causa: prep.erro, acao: 'Espere a outra tarefa terminar.' } }, prep.status];
    }
    return [{ ...prep, nome: slug, modo: 'tema', pedido, voz: voz.voz, kit: true }];
  },

  async '/api/kit3d/produzir'(ctx, body) {
    const { raiz } = ctx;
    if (!NOME.test(body.nome || '')) return [{ erro: 'slug inválido' }, 400];
    const st = estadoVideo3d(raiz, body.nome);
    if (!st?.videoJson) {
      return [
        {
          erro: {
            causa: 'Ainda não há video.json neste slug 3D.',
            acao: 'Cole o pedido no Chat / assistente e espere ele escrever o roteiro e as cenas.',
          },
        },
        400,
      ];
    }
    if (st.produzindo || lockAtivo(path.join(pastaSlug(raiz, body.nome), PRODUZINDO))) {
      return [
        {
          erro: {
            causa: 'Este vídeo 3D já está sendo produzido.',
            acao: 'Espere: ele aparece quando o MP4 ficar pronto.',
          },
        },
        409,
      ];
    }
    if (ctx.job && !ctx.job.fim) {
      return [
        {
          erro: {
            causa: `Espere terminar: ${ctx.job.titulo.toLowerCase()} ainda está em andamento.`,
            acao: 'O render começa quando a tarefa atual terminar.',
          },
        },
        409,
      ];
    }
    const voz = await vozOk(ctx);
    if (voz.erro) return [{ erro: voz.erro, irPara: voz.irPara }, 400];

    const pasta = pastaSlug(raiz, body.nome);
    escreverLock(pasta);
    const comVoz = !st.voz || body.refazerVoz === true;
    const { iniciar } = ctx.tarefas;
    const job = iniciar(
      'kit3d',
      'Vídeo 3D',
      [
        ...etapasKitEsm(raiz, body.nome, { comVoz, comRender: true }),
        {
          rotulo: 'limpando trava',
          fn: async () => {
            limparLock(pasta);
            return 0;
          },
        },
      ],
      { nome: body.nome, voz: voz.voz },
    );
    if (job.erro) {
      limparLock(pasta);
      return [{ erro: { causa: job.erro, acao: 'Espere a outra tarefa terminar.' } }, job.status];
    }
    return [{ ...job, nome: body.nome, voz: voz.voz, kit: true }];
  },

  async '/api/kit3d/mostrar'(ctx, body) {
    if (!NOME.test(body.nome || '')) return [{ erro: 'slug inválido' }, 400];
    const pasta = pastaSlug(ctx.raiz, body.nome);
    if (!fs.existsSync(pasta)) return [{ erro: 'vídeo 3D não encontrado' }, 404];
    const { abrirNoSistema } = await import('../servidor.mjs');
    abrirNoSistema(pasta);
    return [{ ok: true }];
  },
};

function statusGet(ctx, { res, m }) {
  return ctx.json(res, estadoVideo3d(ctx.raiz, m[1]));
}

function listaGet(ctx, { res }) {
  return ctx.json(res, {
    presente: kitPresente(ctx.raiz),
    videos: listarVideos3d(ctx.raiz),
  });
}

function pedidoGet(ctx, { res, m }) {
  const txt = lerPedido3d(ctx.raiz, m[1]);
  if (txt == null) return ctx.json(res, { erro: 'pedido não encontrado' }, 404);
  return ctx.json(res, { pedido: txt, nome: m[1] });
}

function midiaGet(ctx, { req, res, m }) {
  const slug = m[1];
  const tipo = m[2];
  const st = estadoVideo3d(ctx.raiz, slug);
  if (!st?.existe) {
    res.writeHead(404);
    return res.end('não achei');
  }
  const saida = path.join(pastaSlug(ctx.raiz, slug), 'saida');
  let arquivo = null;
  if (tipo === 'video') {
    if (!st.video) {
      res.writeHead(404);
      return res.end('sem vídeo');
    }
    arquivo = path.join(saida, st.video.arquivo);
  } else if (tipo === 'capa') {
    const capa = st.capa || (fs.existsSync(path.join(saida, 'capa.png')) ? 'capa.png' : null);
    if (!capa) {
      res.writeHead(404);
      return res.end('sem capa');
    }
    arquivo = path.join(saida, capa);
  } else {
    res.writeHead(404);
    return res.end('tipo inválido');
  }
  return ctx.arquivo(req, res, arquivo);
}

function baixarGet(ctx, { req, res, m }) {
  const st = estadoVideo3d(ctx.raiz, m[1]);
  if (!st?.video) {
    res.writeHead(404);
    return res.end('sem vídeo');
  }
  const arquivo = path.join(pastaSlug(ctx.raiz, m[1]), 'saida', st.video.arquivo);
  return ctx.arquivo(req, res, arquivo, {
    'content-disposition': `attachment; filename="${m[1]}.mp4"`,
  });
}

export { POST, statusGet as estado, listaGet as lista, pedidoGet as pedido, midiaGet as midia, baixarGet as baixar };
