import { resumoEdicao } from '../../video/editar-cena.mjs';
/* Estudio de videos: APIs de Configurar IA e chat embutido. */
import fs from 'node:fs';
import path from 'node:path';
import { NOME } from './comum.mjs';
import {
  situacao,
  gravarEscolha,
  gravarChaveCursor,
  prepararAssistentes,
  instalarAssistente,
  depsFaltandoPara,
  lerCacheIa,
  loginCursorAgent,
  autoConectar,
  atualizarPathProcesso,
  rodarChat,
  cancelarChat,
  NOMES,
} from '../assistentes.mjs';

function getIa(ctx, { res }) {
  atualizarPathProcesso(ctx.raiz);
  return ctx.json(res, situacao(ctx.raiz));
}

function contextoDoVideo(raiz, contexto) {
  const { projeto, alvo } = contexto;
  if (typeof projeto !== 'string' || !NOME.test(projeto) || !['video', 'youtube', 'pesquisa', 'cena'].includes(alvo)) return null;
  try {
    const projetos = fs.realpathSync(path.join(raiz, 'projetos'));
    const pasta = fs.realpathSync(path.join(projetos, projeto));
    if (path.relative(projetos, pasta) !== projeto || !fs.statSync(pasta).isDirectory()) return null;
    if (alvo === 'cena') {
      if (typeof contexto.cena !== 'string' || !contexto.cena.trim() || contexto.cena.length > 100
          || !/^[a-f0-9]{64}$/.test(contexto.revisao || '')) return null;
      const { revisao, cenas } = resumoEdicao(pasta);
      if (revisao !== contexto.revisao || !cenas.some(c => c.id === contexto.cena)) return null;
      return { projeto, alvo, cena: contexto.cena, revisao };
    }
    return { projeto, alvo };
  } catch {
    return null;
  }
}

const rotasPost = {
  async '/api/ia'(ctx, corpo) {
    atualizarPathProcesso(ctx.raiz);
    if (corpo && typeof corpo.chave === 'string' && !corpo.id) {
      const r = gravarChaveCursor(corpo.chave, ctx.raiz);
      if (!r.erro) autoConectar(ctx.raiz);
      return r.erro ? [r, 400] : [{ ...situacao(ctx.raiz), ok: true }];
    }
    const id = String(corpo?.id || '').trim();
    if (corpo && typeof corpo.chave === 'string' && id === 'cursor') {
      const k = gravarChaveCursor(corpo.chave, ctx.raiz);
      if (k.erro) return [k, 400];
    }
    if (!id) {
      return [{ ok: true, ...autoConectar(ctx.raiz) }];
    }
    const r = gravarEscolha(id, ctx.raiz);
    return r.erro ? [r, 400] : [r];
  },

  async '/api/ia/chave'(ctx, corpo) {
    const r = gravarChaveCursor(corpo?.chave ?? '', ctx.raiz);
    if (!r.erro) autoConectar(ctx.raiz);
    return r.erro ? [r, 400] : [{ ok: true, ...situacao(ctx.raiz) }];
  },

  async '/api/ia/preparar'(ctx, corpo) {
    const forcar = !!corpo?.forcar;
    if (!forcar && lerCacheIa(ctx.raiz)) {
      const rapido = await prepararAssistentes(ctx.raiz, { onLinha: () => {}, forcar: false });
      return [{
        ok: true,
        cache: true,
        conectado: rapido.conectado,
        escolhido: rapido.escolhido,
        nome: rapido.nome,
        opcoes: rapido.opcoes,
      }];
    }
    if (ctx.job && !ctx.job.fim) {
      return [{ erro: { causa: `Espere terminar: ${ctx.job.titulo.toLowerCase()} ainda está em andamento.`, acao: 'Espere a tarefa atual acabar.' } }, 409];
    }
    const r = ctx.tarefas.iniciar('ia-preparar', 'Procurando IAs no PC', [{
      rotulo: 'detectando no computador',
      aceita: true,
      fn: async (job, log) => {
        const final = await prepararAssistentes(ctx.raiz, { onLinha: log, forcar: true });
        job.ia = {
          conectado: final.conectado,
          escolhido: final.escolhido,
          nome: final.nome,
        };
        return final.conectado || final.opcoes.some((o) => o.instalado || o.encontrado) ? 0 : 1;
      },
    }]);
    if (r.erro) return [{ erro: { causa: r.erro, acao: 'Espere a outra tarefa terminar.' } }, r.status || 409];
    return [{ ok: true, id: r.id, cache: false }];
  },

  async '/api/ia/instalar'(ctx, corpo) {
    const id = String(corpo?.id || '').trim();
    if (!['claude', 'codex', 'cursor'].includes(id)) {
      return [{ erro: { causa: 'Assistente desconhecido.', acao: 'Escolha Claude Code, Codex ou Cursor.' } }, 400];
    }
    if (ctx.job && !ctx.job.fim) {
      return [{ erro: { causa: `Espere terminar: ${ctx.job.titulo.toLowerCase()} ainda está em andamento.`, acao: 'Espere a tarefa atual acabar.' } }, 409];
    }
    const aprovarDeps = !!corpo?.aprovarDeps;
    const deps = depsFaltandoPara(id);
    if (deps.length && !aprovarDeps) {
      return [{
        ok: false,
        precisaAprovacao: true,
        deps,
        assistente: id,
        nome: NOMES[id] || id,
      }];
    }
    const nome = NOMES[id] || id;
    const titulo = deps.length && aprovarDeps
      ? `Instalar ${deps.map((d) => d.nome).join(', ')} + ${nome}`
      : `Instalar ${nome}`;
    const r = ctx.tarefas.iniciar('ia-instalar', titulo, [{
      rotulo: deps.length && aprovarDeps ? 'dependências e assistente' : `instalando ${nome}`,
      aceita: true,
      fn: async (job, log) => {
        const final = await instalarAssistente(id, { raiz: ctx.raiz, onLinha: log, aprovarDeps });
        job.ia = {
          conectado: final.conectado,
          escolhido: final.escolhido,
          nome: final.nome,
          ok: !!final.ok,
          id,
        };
        return final.ok ? 0 : 1;
      },
    }]);
    if (r.erro) return [{ erro: { causa: r.erro, acao: 'Espere a outra tarefa terminar.' } }, r.status || 409];
    return [{ ok: true, id: r.id }];
  },

  async '/api/ia/cursor-login'(ctx) {
    if (ctx.job && !ctx.job.fim) {
      return [{ erro: { causa: `Espere terminar: ${ctx.job.titulo.toLowerCase()} ainda está em andamento.`, acao: 'Espere a tarefa atual acabar.' } }, 409];
    }
    const r = ctx.tarefas.iniciar('ia-cursor-login', 'Entrar com o Cursor', [{
      rotulo: 'login do Cursor Agent',
      aceita: true,
      fn: async (job, log) => {
        const final = await loginCursorAgent({ raiz: ctx.raiz, onLinha: log });
        job.ia = {
          conectado: final.conectado,
          escolhido: final.escolhido,
          nome: final.nome,
          ok: !!final.ok,
        };
        return final.ok ? 0 : 1;
      },
    }]);
    if (r.erro) return [{ erro: { causa: r.erro, acao: 'Espere a outra tarefa terminar.' } }, r.status || 409];
    return [{ ok: true, id: r.id }];
  },

  async '/api/ia/chat'(ctx, corpo) {
    const msg = String(corpo?.mensagem || '').trim();
    if (!msg) {
      return [{ erro: { causa: 'Escreva uma mensagem.', acao: 'Digite o que você quer (um vídeo, um carrossel, uma correção).' } }, 400];
    }
    if (msg.length > 20000) {
      return [{ erro: { causa: 'Mensagem longa demais.', acao: 'Encurte o pedido.' } }, 400];
    }
    const contexto = corpo?.contexto == null ? null : contextoDoVideo(ctx.raiz, corpo.contexto);
    if (corpo?.contexto != null && !contexto) {
      return [{ erro: { causa: 'Não encontrei o vídeo deste pedido.', acao: 'Abra o vídeo de novo em Meus vídeos e tente enviar.' } }, 400];
    }
    atualizarPathProcesso(ctx.raiz);
    let st = situacao(ctx.raiz);
    if (!st.conectado) st = autoConectar(ctx.raiz);
    if (!st.conectado || !st.escolhido) {
      return [{ erro: { causa: 'Nenhuma IA conectada.', acao: 'Abra Configurações > Configurar IA (a busca roda sozinha) e, no Cursor, use "Entrar com o Cursor" ou a API Key do painel.' } }, 400];
    }
    if (ctx.job && !ctx.job.fim) {
      return [{ erro: { causa: `Espere terminar: ${ctx.job.titulo.toLowerCase()} ainda está em andamento.`, acao: 'Cancele o chat ou espere a tarefa atual acabar.' } }, 409];
    }
    const sinal = {};
    ctx.chatSinal = sinal;
    const nome = NOMES[st.escolhido] || st.escolhido;
    const r = ctx.tarefas.iniciar('ia-chat', `Chat · ${nome}`, [{
      rotulo: 'assistente trabalhando',
      aceita: true,
      fn: async (job, log) => {
        const codigo = await rodarChat(st.escolhido, msg, {
          raiz: ctx.raiz,
          contexto,
          log,
          sinal,
        });
        ctx.chatSinal = null;
        return codigo === 0 ? 0 : (codigo ?? 1);
      },
    }]);
    if (r.erro) return [{ erro: { causa: r.erro, acao: 'Espere a outra tarefa terminar.' } }, r.status || 409];
    return [{ ok: true, id: r.id, assistente: st.escolhido, nome }];
  },

  async '/api/ia/chat/cancel'(ctx) {
    const ok = cancelarChat(ctx.chatSinal);
    if (ctx.chatSinal) ctx.chatSinal = null;
    if (ctx.job && !ctx.job.fim && ctx.job.tipo === 'ia-chat') {
      ctx.job.linhas.push('(pedido de cancelamento)');
    }
    return [{ ok: !!ok }];
  },
};

export { getIa, rotasPost as POST };
