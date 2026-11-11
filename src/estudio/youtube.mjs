import { conferirFontesDaEntrega } from '../video/fontes-factuais.mjs';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const SCOPES = ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.readonly'];
const NOME = /^[a-z0-9][a-z0-9-]{0,60}$/;
const ESTADOS_ATIVOS = new Set(['preparando', 'enviando']);
const TAMANHO_PARTE = 8 * 1024 * 1024;

export class ErroYoutube extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
const recusar = (mensagem, status) => { throw new ErroYoutube(mensagem, status); };
const ler = arquivo => {
  try { return JSON.parse(fs.readFileSync(arquivo, 'utf8').replace(/^\uFEFF/, '')); }
  catch (e) { if (e.code === 'ENOENT') return null; throw new ErroYoutube('O registro local do YouTube está ilegível. Restaure o arquivo antes de continuar.', 409); }
};
function gravar(arquivo, valor) {
  fs.mkdirSync(path.dirname(arquivo), { recursive: true, mode: 0o700 });
  const temporario = `${arquivo}.${crypto.randomUUID()}.tmp`;
  try {
    fs.writeFileSync(temporario, JSON.stringify(valor, null, 2) + '\n', { mode: 0o600 });
    fs.renameSync(temporario, arquivo);
    fs.chmodSync(arquivo, 0o600);
  } finally { if (fs.existsSync(temporario)) fs.unlinkSync(temporario); }
}
function nomeValido(nome) {
  if (typeof nome !== 'string' || !NOME.test(nome)) recusar('Projeto inválido.');
  return nome;
}
export function validarMetadados(dados = {}) {
  const titulo = typeof dados.titulo === 'string' ? dados.titulo.trim() : '';
  const descricao = typeof dados.descricao === 'string' ? dados.descricao : '';
  const tags = Array.isArray(dados.tags) ? dados.tags.map(t => typeof t === 'string' ? t.trim() : '').filter(Boolean) : [];
  if (!titulo || [...titulo].length > 100 || /[<>]/.test(titulo)) recusar('Informe um título com até 100 caracteres, sem < ou >.');
  if (Buffer.byteLength(descricao, 'utf8') > 5000 || /[<>]/.test(descricao)) recusar('A descrição deve ter até 5.000 bytes, sem < ou >. Encurte o texto.');
  const totalTags = tags.reduce((n, t) => n + [...t].length + (/\s/.test(t) ? 2 : 0), Math.max(0, tags.length - 1));
  if (tags.length > 100 || totalTags > 500 || tags.some(t => /[<>\r\n]/.test(t))) recusar('As tags devem somar até 500 caracteres, incluindo vírgulas e aspas de termos com espaços.');
  if (!['private', 'unlisted', 'public'].includes(dados.privacidade)) recusar('Escolha a visibilidade do vídeo.');
  if (typeof dados.infantil !== 'boolean') recusar('Informe se o vídeo foi criado para crianças.');
  if (typeof dados.sintetico !== 'boolean') recusar('Informe se há conteúdo realista alterado ou sintético.');
  return {
    snippet: { title: titulo, description: descricao, tags, categoryId: '22' },
    status: { privacyStatus: dados.privacidade, selfDeclaredMadeForKids: dados.infantil, containsSyntheticMedia: dados.sintetico },
  };
}

// Uma instância por servidor. Nenhuma leitura, conexão ou callback inicia uploads.
export function criarYoutube({ raiz, fetchImpl = globalThis.fetch, agora = Date.now, tamanhoParte = TAMANHO_PARTE } = {}) {
  const pasta = path.join(raiz, '.estudio', 'youtube');
  const credenciaisArq = path.join(pasta, 'cliente.json');
  const tokensArq = path.join(pasta, 'tokens.json');
  let pendente = null, ativo = null, tarefa = null, fechado = false, mutando = false;
  const abortar = new AbortController();
  const registroArq = nome => path.join(pasta, 'envios', `${nomeValido(nome)}.json`);
  const salvarRegistro = registro => gravar(registroArq(registro.nome), registro);
  const livre = () => { if (ativo || mutando) recusar('Espere a operação atual do YouTube terminar.', 409); };

  async function requisicao(url, opcoes = {}) {
    try {
      return await fetchImpl(url, { ...opcoes, redirect: 'manual', signal: AbortSignal.any([abortar.signal, AbortSignal.timeout(120000)]) });
    } catch { throw new ErroYoutube('A conexão com o YouTube foi interrompida. Confira a internet e continue o envio pelo botão.', 503); }
  }
  async function jsonResposta(resposta) { try { return await resposta.json(); } catch { return {}; } }
  async function erroRemoto(resposta) {
    const dados = await jsonResposta(resposta);
    const motivo = dados.error?.errors?.[0]?.reason || dados.error;
    if (resposta.status === 401 || motivo === 'invalid_grant') {
      recusar('A autorização do Google expirou ou foi revogada. Conecte o canal novamente.', 401);
    }
    if (motivo === 'quotaExceeded' || motivo === 'dailyLimitExceeded' || resposta.status === 429) {
      recusar('O limite de uso da API do YouTube foi atingido. Aguarde a renovação da cota antes de continuar.', 429);
    }
    if (motivo === 'accessNotConfigured' || motivo === 'serviceDisabled') recusar('Ative a YouTube Data API v3 no projeto Google das credenciais.', 403);
    if (resposta.status === 403) recusar('O Google recusou a permissão. Confira a API habilitada e reconecte o canal com as permissões solicitadas.', 403);
    recusar(resposta.status >= 500 ? 'O YouTube está indisponível. Aguarde e continue o envio pelo botão.' : 'O YouTube recusou o pedido. Confira os dados, a conta e os limites do canal.', 502);
  }
  async function trocarToken(parametros) {
    const c = ler(credenciaisArq);
    if (!c) recusar('Configure primeiro as credenciais do Google.');
    const r = await requisicao('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: c.client_id, client_secret: c.client_secret, ...parametros }),
    });
    if (!r.ok) await erroRemoto(r);
    const dados = await jsonResposta(r);
    if (typeof dados.access_token !== 'string' || !dados.access_token) recusar('O Google não devolveu uma autorização válida.', 502);
    if (dados.scope && !SCOPES.every(s => dados.scope.split(' ').includes(s))) recusar('Autorize o envio de vídeos e a leitura do canal ao conectar o Google.', 403);
    return { ...dados, expira: agora() + (Number(dados.expires_in) || 3600) * 1000 };
  }
  async function tokenAtual() {
    const tokens = ler(tokensArq);
    if (!tokens?.refresh_token) recusar('Conecte seu canal do YouTube antes de enviar.', 401);
    if (tokens.expira > agora() + 60000) return tokens.access_token;
    const novos = await trocarToken({ grant_type: 'refresh_token', refresh_token: tokens.refresh_token });
    gravar(tokensArq, { ...tokens, ...novos });
    return novos.access_token;
  }
  async function autenticada(url, opcoes = {}, conferir = null) {
    const token = await tokenAtual();
    conferir?.();
    const r = await requisicao(url, { ...opcoes, headers: { ...opcoes.headers, authorization: `Bearer ${token}` } });
    return r;
  }
  function publico(registro) {
    if (!registro) return null;
    const estado = ESTADOS_ATIVOS.has(registro.estado) && ativo?.nome !== registro.nome ? 'interrompido' : registro.estado;
    return {
      nome: registro.nome, estado, bytes: registro.bytes || 0, tamanho: registro.tamanho,
      progresso: registro.estado === 'enviado' ? 100 : Math.min(99, Math.floor((registro.bytes || 0) * 100 / (registro.tamanho || 1))),
      canal: registro.canal, titulo: registro.metadados?.snippet?.title, privacidade: registro.metadados?.status?.privacyStatus,
      videoId: registro.videoId || null, url: registro.videoId ? `https://www.youtube.com/watch?v=${registro.videoId}` : null,
      privacidadeEfetiva: registro.privacidadeEfetiva || null,
      erro: registro.erro || null, atualizado: registro.atualizado,
      retomavel: !!registro.sessao,
    };
  }
  function estado() {
    const tokens = ler(tokensArq);
    return { configurado: !!ler(credenciaisArq), conectado: !!tokens?.refresh_token, canal: tokens?.canal || null, ocupado: !!ativo || mutando };
  }
  function configurar(documento) {
    livre();
    const c = documento?.installed;
    if (!c || typeof c.client_id !== 'string' || !/^[\w.-]+\.apps\.googleusercontent\.com$/.test(c.client_id) || typeof c.client_secret !== 'string' || !c.client_secret || c.client_secret.length > 500) {
      recusar('Escolha o JSON de um cliente OAuth do tipo Aplicativo para computador, baixado do Google Cloud.');
    }
    gravar(credenciaisArq, { client_id: c.client_id, client_secret: c.client_secret });
    fs.rmSync(tokensArq, { force: true });
    pendente = null;
    return estado();
  }
  function autorizar(redirectUri) {
    livre();
    const c = ler(credenciaisArq);
    if (!c) recusar('Importe o JSON de credenciais do Google antes de conectar.');
    if (!/^http:\/\/127\.0\.0\.1:\d+\/api\/youtube\/callback$/.test(redirectUri)) recusar('Endereço local de autorização inválido.');
    const verifier = crypto.randomBytes(48).toString('base64url');
    const state = crypto.randomBytes(32).toString('hex');
    pendente = { verifier, state, redirectUri, expira: agora() + 10 * 60 * 1000 };
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.search = new URLSearchParams({ client_id: c.client_id, redirect_uri: redirectUri, response_type: 'code', scope: SCOPES.join(' '), state,
      access_type: 'offline', prompt: 'consent select_account', code_challenge_method: 'S256', code_challenge: crypto.createHash('sha256').update(verifier).digest('base64url') }).toString();
    return { url: url.href };
  }
  async function callback(parametros) {
    const p = pendente;
    if (!p || p.expira < agora() || parametros.get('state') !== p.state) recusar('Esta autorização expirou ou é inválida. Volte ao estúdio e clique em Conectar canal novamente.');
    pendente = null;
    livre();
    if (parametros.get('error')) recusar('A conexão foi cancelada no Google. Você pode conectar novamente pelo estúdio.');
    const code = parametros.get('code');
    if (!code || code.length > 4096) recusar('O Google não devolveu o código de autorização.');
    mutando = true;
    try {
      const tokens = await trocarToken({ code, code_verifier: p.verifier, redirect_uri: p.redirectUri, grant_type: 'authorization_code' });
      if (!tokens.refresh_token) recusar('O Google não liberou acesso offline. Conecte novamente e aceite as permissões.', 401);
      const r = await requisicao('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', { headers: { authorization: `Bearer ${tokens.access_token}` } });
      if (!r.ok) await erroRemoto(r);
      const dados = await jsonResposta(r), canal = dados.items?.[0];
      if (!canal?.id || !canal.snippet?.title) recusar('Esta conta não tem um canal do YouTube disponível. Escolha a conta do seu canal.');
      gravar(tokensArq, { ...tokens, canal: { id: canal.id, titulo: canal.snippet.title } });
      return { canal: { id: canal.id, titulo: canal.snippet.title } };
    } finally { mutando = false; }
  }
  async function desconectar() {
    livre();
    mutando = true;
    try {
      const tokens = ler(tokensArq);
      // Remover primeiro garante que o estúdio deixa de usar o acesso mesmo sem internet.
      fs.rmSync(tokensArq, { force: true });
      pendente = null;
      let revogado = !tokens?.refresh_token;
      if (tokens?.refresh_token) {
        try {
          const r = await requisicao('https://oauth2.googleapis.com/revoke', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ token: tokens.refresh_token }) });
          revogado = r.ok;
        } catch { /* A desconexão local já foi concluída. */ }
      }
      return { desconectado: true, revogado };
    } finally { mutando = false; }
  }
  function dadosProjeto(nome) {
    nomeValido(nome);
    const projeto = path.join(raiz, 'projetos', nome), saida = path.join(projeto, 'saida');
    const entrega = ler(path.join(saida, 'entrega.json'));
    const arquivo = entrega?.arquivos?.video?.arquivo;
    if (!entrega || entrega.publicavel !== true || entrega.aprovado !== true || !entrega.voz || entrega.voz === 'mock') recusar('Este vídeo ainda não está liberado para publicação. Conclua a voz real, as fontes e o QA.');
    if (typeof arquivo !== 'string' || path.basename(arquivo) !== arquivo || !/\.mp4$/i.test(arquivo) || /previa/i.test(arquivo)) recusar('A entrega não identifica um MP4 final. Gere o vídeo final antes de enviar.');
    let fontes;
    try { fontes = fs.readFileSync(path.join(projeto, 'fontes.md'), 'utf8'); } catch { recusar('Confirme as fontes do vídeo antes de enviar.'); }
    if (!fontes.trim() || /PENDENTE/.test(fontes) || entrega.pendencias?.length) recusar('Resolva as fontes pendentes antes de enviar.');
    const factual = conferirFontesDaEntrega(projeto, entrega);
    if (!factual.aprovado) recusar('Pendências factuais: ' + factual.pendencias.slice(0, 3).map(p => p.msg).join(' '), 409);
    const destino = path.join(saida, arquivo);
    try {
      const base = fs.realpathSync(path.join(raiz, 'projetos'));
      const real = fs.realpathSync(destino);
      const relativo = path.relative(base, real);
      if (relativo.startsWith('..') || path.isAbsolute(relativo) || fs.lstatSync(projeto).isSymbolicLink() || fs.lstatSync(saida).isSymbolicLink() || fs.lstatSync(destino).isSymbolicLink()) recusar('O arquivo de vídeo precisa estar dentro do projeto.');
      const stat = fs.statSync(destino);
      if (!stat.isFile() || stat.size === 0) recusar('O arquivo final está vazio ou inválido.');
      return { destino, arquivo, tamanho: stat.size, mtimeMs: stat.mtimeMs, hashEntrega: entrega.arquivos.video.sha256 };
    } catch (e) { if (e instanceof ErroYoutube) throw e; recusar('O MP4 final não está disponível. Gere o vídeo novamente.'); }
  }
  function preparar(nome) {
    nomeValido(nome);
    const registro = ler(registroArq(nome));
    let arquivo = null, bloqueio = null;
    try { const dados = dadosProjeto(nome); arquivo = { nome: dados.arquivo, tamanho: dados.tamanho, sha256: dados.hashEntrega }; } catch (e) { bloqueio = e.message; }
    const pacote = ler(path.join(raiz, 'projetos', nome, 'youtube.json')) || {};
    return { ...estado(), arquivo, bloqueio, pacote, envio: publico(registro), metadados: registro?.metadados || null };
  }
  async function hashArquivo(arquivo) {
    const hash = crypto.createHash('sha256');
    for await (const parte of fs.createReadStream(arquivo)) { if (fechado) recusar('O estúdio foi fechado.', 503); hash.update(parte); }
    return hash.digest('hex');
  }
  function validarSessao(sessao) {
    try {
      const u = new URL(sessao);
      if (u.protocol === 'https:' && u.hostname === 'www.googleapis.com' && !u.username && !u.password && !u.port && u.pathname === '/upload/youtube/v3/videos' && u.searchParams.has('upload_id')) return u.href;
    } catch { /* Nunca enviar tokens para um endereço arbitrário. */ }
    recusar('O YouTube devolveu um endereço de envio inválido.', 502);
  }
  async function concluirResposta(registro, r) {
    if (r.status === 200 || r.status === 201) {
      const dados = await jsonResposta(r);
      if (typeof dados.id !== 'string' || !/^[\w-]{1,128}$/.test(dados.id)) recusar('O YouTube recebeu o pedido, mas não confirmou o identificador. Continue para verificar o mesmo envio.', 502);
      registro.estado = 'enviado'; registro.videoId = dados.id; registro.bytes = registro.tamanho;
      registro.privacidadeEfetiva = dados.status?.privacyStatus || null;
      registro.sessao = null;
      return true;
    }
    if (r.status === 308) {
      const range = r.headers.get('range');
      const m = range?.match(/^bytes=0-(\d+)$/);
      if (range && !m) recusar('O YouTube devolveu uma posição de envio inválida.', 502);
      const bytes = m ? Number(m[1]) + 1 : 0;
      if (!Number.isSafeInteger(bytes) || bytes < registro.bytes || bytes > registro.tamanho) recusar('O progresso confirmado pelo YouTube é inválido.', 502);
      registro.bytes = bytes;
      return false;
    }
    if (r.status === 404 || r.status === 410) recusar('A sessão de envio expirou. Confira seu canal no YouTube antes de tentar um novo envio. O estúdio preservou o registro para evitar duplicação.', 409);
    await erroRemoto(r);
  }
  async function executar(registro, dados) {
    let arquivo;
    const conferir = () => {
      const atual = dadosProjeto(registro.nome);
      if (atual.hashEntrega !== registro.sha256) recusar('A entrega mudou durante o envio. Confira a versão atual antes de continuar.', 409);
    };
    try {
      if (!registro.sessao) {
        const r = await autenticada('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
          method: 'POST', headers: { 'content-type': 'application/json; charset=UTF-8', 'x-upload-content-type': 'video/mp4', 'x-upload-content-length': String(registro.tamanho) },
          body: JSON.stringify(registro.metadados),
        }, conferir);
        if (!r.ok) await erroRemoto(r);
        registro.sessao = validarSessao(r.headers.get('location'));
        registro.estado = 'enviando'; salvarRegistro(registro);
      } else {
        validarSessao(registro.sessao);
        const r = await autenticada(registro.sessao, { method: 'PUT', headers: { 'content-length': '0', 'content-range': `bytes */${registro.tamanho}` } });
        const terminou = await concluirResposta(registro, r);
        salvarRegistro(registro);
        if (terminou) return;
      }
      arquivo = await fsp.open(dados.destino, 'r');
      let semAvanco = 0;
      while (registro.bytes < registro.tamanho) {
        if (fechado) recusar('O envio foi interrompido ao fechar o estúdio.', 503);
        const stat = await arquivo.stat();
        if (stat.size !== dados.tamanho || stat.mtimeMs !== dados.mtimeMs) recusar('O MP4 mudou durante o envio. O envio foi interrompido.', 409);
        const inicio = registro.bytes;
        const tamanho = Math.min(tamanhoParte, registro.tamanho - inicio);
        const buffer = Buffer.allocUnsafe(tamanho);
        const { bytesRead } = await arquivo.read(buffer, 0, tamanho, inicio);
        if (bytesRead !== tamanho) recusar('Não foi possível ler o MP4 final inteiro.', 409);
        const r = await autenticada(registro.sessao, { method: 'PUT', headers: { 'content-type': 'video/mp4', 'content-length': String(tamanho), 'content-range': `bytes ${inicio}-${inicio + tamanho - 1}/${registro.tamanho}` }, body: buffer }, conferir);
        const terminou = await concluirResposta(registro, r);
        registro.atualizado = new Date(agora()).toISOString(); salvarRegistro(registro);
        if (terminou) return;
        semAvanco = registro.bytes === inicio ? semAvanco + 1 : 0;
        if (semAvanco >= 2) recusar('O YouTube não confirmou avanço. Aguarde e continue o mesmo envio.', 503);
      }
      // Todos os bytes foram aceitos, mas ainda precisamos da confirmação com o ID.
      const r = await autenticada(registro.sessao, { method: 'PUT', headers: { 'content-length': '0', 'content-range': `bytes */${registro.tamanho}` } });
      if (!await concluirResposta(registro, r)) recusar('O YouTube ainda não confirmou o vídeo. Continue o mesmo envio para verificar.', 503);
      salvarRegistro(registro);
    } catch (e) {
      registro.estado = 'erro';
      registro.erro = e instanceof ErroYoutube ? e.message : 'O envio foi interrompido. Confira o espaço em disco e continue o mesmo envio.';
      registro.atualizado = new Date(agora()).toISOString();
      try { salvarRegistro(registro); } catch { /* Evita expor erros e credenciais em logs. */ }
    } finally { await arquivo?.close().catch(() => {}); ativo = null; }
  }
  async function enviar(nome, dados) {
    nomeValido(nome); livre();
    if (fechado) recusar('Reabra o estúdio para enviar.', 503);
    if (dados?.confirmar !== true) recusar('Confirme o envio manual antes de continuar.');
    const tokens = ler(tokensArq);
    if (!tokens?.refresh_token || !tokens.canal?.id) recusar('Conecte seu canal do YouTube antes de enviar.', 401);
    const anterior = ler(registroArq(nome));
    if (anterior?.estado === 'enviado' || anterior?.videoId) recusar('Este projeto já foi enviado ao YouTube. Abra o link do envio existente.', 409);
    const metadados = anterior?.sessao ? anterior.metadados : validarMetadados(dados);
    if (anterior?.sessao && anterior.canal.id !== tokens.canal.id) recusar('Reconecte o canal usado no envio original para continuar.', 409);
    const projeto = dadosProjeto(nome);
    if (dados.canalId !== tokens.canal.id) recusar('O canal conectado mudou. Reabra esta janela e confira o destino antes de confirmar.', 409);
    if (!anterior?.sessao && dados.sha256 !== projeto.hashEntrega) recusar('O vídeo aprovado mudou. Reabra esta janela e revise a versão atual antes de confirmar.', 409);
    ativo = { nome };
    try {
      const sha256 = await hashArquivo(projeto.destino);
      if (!/^[a-f0-9]{64}$/i.test(projeto.hashEntrega || '') || sha256 !== projeto.hashEntrega) recusar('O MP4 não corresponde à entrega aprovada. Gere e confira o vídeo novamente.', 409);
      if (anterior?.sessao && (anterior.sha256 !== sha256 || anterior.tamanho !== projeto.tamanho)) recusar('O vídeo mudou desde o envio interrompido. Preserve o arquivo original para continuar.', 409);
      const registro = anterior?.sessao ? { ...anterior, estado: 'enviando', erro: null } : {
        nome, estado: 'preparando', arquivo: projeto.arquivo, sha256, tamanho: projeto.tamanho, bytes: 0,
        metadados, canal: tokens.canal, criado: new Date(agora()).toISOString(),
      };
      registro.atualizado = new Date(agora()).toISOString();
      salvarRegistro(registro);
      // Só este método, chamado pelo POST de confirmação, agenda o trabalho.
      tarefa = new Promise(resolve => setImmediate(resolve)).then(() => executar(registro, projeto));
      return publico(registro);
    } catch (e) { ativo = null; throw e; }
  }
  return { estado, configurar, autorizar, callback, desconectar, preparar, enviar,
    arquivo: nome => dadosProjeto(nome).destino,
    envio: nome => publico(ler(registroArq(nomeValido(nome)))) ,
    esperar: () => tarefa || Promise.resolve(),
    fechar() { fechado = true; pendente = null; abortar.abort(); },
  };
}
