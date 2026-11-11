import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { criarYoutube } from './youtube.mjs';

const executar = promisify(execFile);
const API = 'https://open.tiktokapis.com';
const MODOS = { direto: 'video.publish', aplicativo: 'video.upload' };
const NOME = /^[a-z0-9][a-z0-9-]{0,60}$/;
const PRIVACIDADES = ['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'FOLLOWER_OF_CREATOR', 'SELF_ONLY'];
const TERMINAIS = ['publicado', 'caixa-entrada', 'falhou'];

export class ErroTiktok extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
const recusar = (mensagem, status) => { throw new ErroTiktok(mensagem, status); };
function ler(arquivo) {
  try { return JSON.parse(fs.readFileSync(arquivo, 'utf8')); }
  catch (e) { if (e.code === 'ENOENT') return null; recusar('O registro local do TikTok está ilegível. Restaure o arquivo antes de continuar.', 409); }
}
function gravar(arquivo, dados) {
  fs.mkdirSync(path.dirname(arquivo), { recursive: true, mode: 0o700 });
  const tmp = `${arquivo}.${crypto.randomUUID()}.tmp`;
  try { fs.writeFileSync(tmp, JSON.stringify(dados, null, 2) + '\n', { mode: 0o600 }); fs.renameSync(tmp, arquivo); fs.chmodSync(arquivo, 0o600); }
  finally { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); }
}
function nomeValido(nome) { if (typeof nome !== 'string' || !NOME.test(nome)) recusar('Projeto inválido.'); return nome; }

// TikTok arredonda a quantidade de partes para baixo e incorpora a sobra na última.
export function planoPartes(tamanho) {
  if (!Number.isSafeInteger(tamanho) || tamanho <= 0 || tamanho > 4 * 1024 ** 3) recusar('O vídeo precisa ter entre 1 byte e 4 GB.');
  const parte = tamanho <= 64 * 1024 ** 2 ? tamanho : 32 * 1024 ** 2;
  return { source: 'FILE_UPLOAD', video_size: tamanho, chunk_size: parte, total_chunk_count: Math.max(1, Math.floor(tamanho / parte)) };
}
export function validarPost(dados, criador) {
  if (typeof dados.legenda !== 'string' || dados.legenda.length > 2200) recusar('A legenda deve ter até 2.200 caracteres.');
  if (!PRIVACIDADES.includes(dados.privacidade) || !criador.privacy_level_options?.includes(dados.privacidade)) recusar('Escolha uma visibilidade disponível para esta conta.');
  for (const [campo, remoto] of [['comentarios', 'comment_disabled'], ['dueto', 'duet_disabled'], ['costura', 'stitch_disabled']]) {
    if (typeof dados[campo] !== 'boolean') recusar('Confira as opções de interação antes de enviar.');
    if (dados[campo] && criador[remoto]) recusar('Uma interação escolhida está desativada na conta TikTok. Reabra a janela para atualizar.');
  }
  if (typeof dados.comercial !== 'boolean' || typeof dados.marcaPropria !== 'boolean' || typeof dados.parceria !== 'boolean' || typeof dados.ia !== 'boolean') recusar('Confira as declarações de conteúdo comercial e de IA.');
  if (dados.comercial && !dados.marcaPropria && !dados.parceria) recusar('Indique se o conteúdo promove sua marca, outra marca ou ambas.');
  if (!dados.comercial && (dados.marcaPropria || dados.parceria)) recusar('Ative a declaração de conteúdo comercial para indicar uma marca.');
  if (dados.parceria && !['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS'].includes(dados.privacidade)) recusar('Parcerias pagas exigem visibilidade pública ou para amigos.');
  return { title: dados.legenda, privacy_level: dados.privacidade, disable_comment: !dados.comentarios,
    disable_duet: !dados.dueto, disable_stitch: !dados.costura, brand_content_toggle: dados.parceria,
    brand_organic_toggle: dados.marcaPropria, is_aigc: dados.ia };
}
export async function medirVideo(arquivo) {
  try {
    const { stdout } = await executar('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height,r_frame_rate', '-of', 'json', arquivo], { timeout: 15000, maxBuffer: 100000 });
    const dados = JSON.parse(stdout), video = dados.streams?.find(s => s.codec_type === 'video');
    const duracao = Number(dados.format?.duration);
    const [n, d] = String(video?.r_frame_rate).split('/').map(Number), fps = n / d;
    if (!video || !['h264', 'hevc'].includes(video.codec_name) || !Number.isFinite(duracao) || duracao < 3 || !Number.isFinite(fps) || fps < 23 || fps > 60 || Math.min(video.width, video.height) < 360 || Math.max(video.width, video.height) > 4096) recusar('O MP4 precisa ter vídeo H.264/HEVC, duração mínima de 3 segundos, 23 a 60 quadros por segundo e dimensões entre 360 e 4096 pixels.');
    return { duracao };
  } catch (e) { if (e instanceof ErroTiktok) throw e; recusar('Não foi possível conferir o MP4 com o ffprobe. Confira o arquivo e a instalação do FFmpeg.'); }
}

export function criarTiktok({ raiz, fetchImpl = globalThis.fetch, agora = Date.now, analisarVideo = medirVideo } = {}) {
  const pasta = path.join(raiz, '.estudio', 'tiktok');
  const clienteArq = path.join(pasta, 'cliente.json'), tokensArq = path.join(pasta, 'tokens.json');
  // Reaproveita a mesma seleção e as regras de entrega aprovada já usadas pelo YouTube.
  const entregas = criarYoutube({ raiz });
  const registroArq = nome => path.join(pasta, 'envios', `${nomeValido(nome)}.json`);
  let pendente = null, ocupado = false, ativo = null, tarefa = null, refresh = null, fechado = false;
  const aborto = new AbortController(), consultas = new Map();
  const salvar = r => { r.atualizado = new Date(agora()).toISOString(); gravar(registroArq(r.nome), r); };
  const livre = () => { if (ocupado || ativo || refresh || [...consultas.values()].some(c => c.promessa)) recusar('Espere a operação atual do TikTok terminar.', 409); if (fechado) recusar('Reabra o estúdio para continuar.', 503); };
  async function requisicao(url, opcoes = {}) {
    try { return await fetchImpl(url, { ...opcoes, redirect: 'manual', signal: AbortSignal.any([aborto.signal, AbortSignal.timeout(120000)]) }); }
    catch { recusar('A conexão com o TikTok foi interrompida. Consulte o andamento antes de continuar o mesmo envio.', 503); }
  }
  async function dadosResposta(r) { try { return await r.json(); } catch { return {}; } }
  function erroApi(code, status) {
    if (status >= 500 || !code || code === 'internal_error') recusar('O TikTok não confirmou o resultado do pedido. Consulte o andamento e seu perfil antes de recuperar o envio.', 503);
    const mensagens = {
      access_token_invalid: 'A autorização expirou ou foi revogada. Conecte a conta TikTok novamente.',
      invalid_grant: 'A autorização expirou ou foi revogada. Conecte a conta TikTok novamente.',
      invalid_client: 'O TikTok recusou as credenciais. Confira Client key e Client secret.',
      scope_not_authorized: 'A permissão não foi aprovada ou autorizada. Confira Login Kit e Content Posting API no portal e reconecte a conta.',
      unaudited_client_can_only_post_to_private_accounts: 'O aplicativo ainda não foi auditado. O TikTok permite testes apenas em contas privadas e com visibilidade Somente eu.',
      spam_risk_too_many_posts: 'O TikTok atingiu o limite de publicações desta conta. Tente mais tarde.',
      spam_risk_too_many_pending_share: 'Há muitos envios aguardando publicação no aplicativo TikTok. Finalize os anteriores.',
      rate_limit_exceeded: 'O TikTok pediu uma pausa por excesso de consultas. Aguarde antes de tentar novamente.',
      url_ownership_unverified: 'O TikTok exige a verificação do endereço de mídia. Esta integração deve usar FILE_UPLOAD.',
      invalid_publish_id: 'O TikTok não reconhece este envio. O registro foi preservado para evitar duplicação.',
    };
    recusar(mensagens[code] || (status === 401 ? mensagens.access_token_invalid : 'O TikTok recusou o pedido. Confira as permissões, os dados e os limites da conta no portal.'), status === 429 ? 429 : status === 401 ? 401 : 400);
  }
  async function token(parametros) {
    const c = ler(clienteArq); if (!c) recusar('Configure primeiro o aplicativo TikTok.');
    const r = await requisicao(API + '/v2/oauth/token/', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_key: c.clientKey, client_secret: c.clientSecret, ...parametros }) });
    const d = await dadosResposta(r);
    if (!r.ok || d.error || !d.access_token || !d.refresh_token || !d.open_id) erroApi(typeof d.error === 'string' ? d.error : d.error?.code, r.status);
    const scopes = String(d.scope || '').split(',').map(s => s.trim());
    if (!['user.info.basic', MODOS[c.modo]].every(s => scopes.includes(s))) recusar('Autorize o perfil e a permissão de envio escolhida. Confira os escopos aprovados no portal.', 403);
    if (!Number.isFinite(Number(d.expires_in)) || Number(d.expires_in) <= 0) recusar('O TikTok devolveu uma autorização inválida.', 502);
    return { access_token: d.access_token, refresh_token: d.refresh_token, open_id: d.open_id, scope: d.scope,
      expira: agora() + Number(d.expires_in) * 1000, refreshExpira: agora() + Number(d.refresh_expires_in || 0) * 1000 };
  }
  async function tokenAtual() {
    const t = ler(tokensArq); if (!t?.refresh_token) recusar('Conecte sua conta TikTok antes de enviar.', 401);
    if (t.expira > agora() + 60000) return t;
    if (!refresh) refresh = (async () => {
      const novos = await token({ grant_type: 'refresh_token', refresh_token: t.refresh_token });
      if (novos.open_id !== t.open_id) recusar('A conta retornada pelo TikTok mudou. Conecte novamente.', 401);
      const atualizado = { ...t, ...novos }; gravar(tokensArq, atualizado); return atualizado;
    })().finally(() => { refresh = null; });
    return refresh;
  }
  async function api(endpoint, corpo = {}, metodo = 'POST', acesso = null, conferir = null) {
    const t = acesso || await tokenAtual();
    conferir?.();
    const r = await requisicao(API + endpoint, { method: metodo, headers: { authorization: `Bearer ${t.access_token}`, ...(metodo === 'POST' ? { 'content-type': 'application/json; charset=UTF-8' } : {}) }, ...(metodo === 'POST' ? { body: JSON.stringify(corpo) } : {}) });
    const d = await dadosResposta(r);
    if (!r.ok || d.error?.code !== 'ok') erroApi(d.error?.code, r.status);
    return d.data || {};
  }
  function conta() {
    const c = ler(clienteArq), t = ler(tokensArq);
    return { configurado: !!c, modo: c?.modo || 'direto', conectado: !!t?.refresh_token, conta: t?.conta || null, ocupado: ocupado || !!ativo };
  }
  function configurar(d) {
    livre();
    if (!d || !/^[\w-]{4,200}$/.test(d.clientKey || '') || typeof d.clientSecret !== 'string' || !d.clientSecret.trim() || d.clientSecret.length > 500 || /\s/.test(d.clientSecret) || !MODOS[d.modo]) recusar('Informe Client key, Client secret e o modo de envio do aplicativo TikTok.');
    gravar(clienteArq, { clientKey: d.clientKey, clientSecret: d.clientSecret, modo: d.modo });
    fs.rmSync(tokensArq, { force: true }); pendente = null;
    return conta();
  }
  function autorizar(redirectUri) {
    livre(); const c = ler(clienteArq); if (!c) recusar('Configure o aplicativo TikTok antes de conectar.');
    if (!/^http:\/\/127\.0\.0\.1:\d+\/api\/tiktok\/callback\/$/.test(redirectUri)) recusar('Endereço de retorno local inválido.');
    const verifier = crypto.randomBytes(48).toString('base64url'), state = crypto.randomBytes(32).toString('hex');
    pendente = { verifier, state, redirectUri, expira: agora() + 10 * 60 * 1000 };
    const url = new URL('https://www.tiktok.com/v2/auth/authorize/');
    url.search = new URLSearchParams({ client_key: c.clientKey, response_type: 'code', scope: `user.info.basic,${MODOS[c.modo]}`, redirect_uri: redirectUri, state, code_challenge: crypto.createHash('sha256').update(verifier).digest('hex'), code_challenge_method: 'S256' }).toString();
    return { url: url.href };
  }
  async function callback(p) {
    const a = pendente;
    if (!a || a.expira < agora() || p.get('state') !== a.state) recusar('Esta autorização expirou ou é inválida. Conecte novamente pelo estúdio.');
    pendente = null; livre();
    if (p.get('error')) recusar('A conexão foi cancelada no TikTok. Você pode conectar novamente pelo estúdio.');
    const code = p.get('code'); if (!code || code.length > 4096) recusar('O TikTok não devolveu um código válido.');
    ocupado = true;
    try {
      const t = await token({ grant_type: 'authorization_code', code, redirect_uri: a.redirectUri, code_verifier: a.verifier });
      const perfil = await api('/v2/user/info/?fields=open_id,display_name', {}, 'GET', t);
      if (perfil.user?.open_id !== t.open_id || !perfil.user?.display_name) recusar('Não foi possível identificar a conta TikTok.', 502);
      t.conta = { id: t.open_id, nome: String(perfil.user.display_name).slice(0, 200) }; gravar(tokensArq, t);
      return conta();
    } finally { ocupado = false; }
  }
  async function desconectar() {
    livre(); ocupado = true;
    try {
      const c = ler(clienteArq), t = ler(tokensArq); fs.rmSync(tokensArq, { force: true }); pendente = null;
      let revogado = !t;
      if (c && t) try {
        const r = await requisicao(API + '/v2/oauth/revoke/', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_key: c.clientKey, client_secret: c.clientSecret, token: t.access_token }) });
        const d = await dadosResposta(r); revogado = r.ok && (!d.error || d.error.code === 'ok');
      } catch { /* A remoção local já foi concluída. */ }
      return { desconectado: true, revogado };
    } finally { ocupado = false; }
  }
  function publico(r) {
    if (!r) return null;
    const estado = ['preparando', 'enviando'].includes(r.estado) && ativo !== r.nome ? 'interrompido' : r.estado;
    return { nome: r.nome, estado, modo: r.modo, conta: r.conta, bytes: r.bytes || 0, tamanho: r.tamanho,
      progresso: r.bytes >= r.tamanho ? 100 : Math.floor((r.bytes || 0) * 100 / r.tamanho),
      erro: r.erro || null, legenda: r.postInfo?.title || '', atualizado: r.atualizado,
      continuar: !!r.publishId && !TERMINAIS.includes(r.estado),
      incerto: !r.publishId && r.inicializacaoTentada === true,
      postIds: r.postIds || [],
    };
  }
  async function criador() {
    const d = await api('/v2/post/publish/creator_info/query/');
    if (!d.creator_nickname || !Array.isArray(d.privacy_level_options) || !Number.isFinite(d.max_video_post_duration_sec) || d.max_video_post_duration_sec < 3) recusar('O TikTok não liberou publicação para esta conta neste momento.', 403);
    return { creator_nickname: String(d.creator_nickname).slice(0, 200), creator_username: String(d.creator_username || '').slice(0, 200),
      privacy_level_options: d.privacy_level_options.filter(v => PRIVACIDADES.includes(v)), max_video_post_duration_sec: d.max_video_post_duration_sec,
      comment_disabled: d.comment_disabled !== false, duet_disabled: d.duet_disabled !== false, stitch_disabled: d.stitch_disabled !== false };
  }
  async function preparar(nome) {
    nomeValido(nome); const validacao = entregas.preparar(nome), r = ler(registroArq(nome));
    let arquivo = validacao.arquivo, bloqueio = validacao.bloqueio, info = null, erroConta = null;
    if (arquivo) try { info = await analisarVideo(entregas.arquivo(nome)); planoPartes(arquivo.tamanho); arquivo = { ...arquivo, duracao: info.duracao }; } catch (e) { bloqueio = e.message; }
    const estado = conta(); let creator = null;
    if (estado.conectado && estado.modo === 'direto') try { creator = await criador(); } catch (e) { erroConta = e.message; }
    if (creator && arquivo?.duracao > creator.max_video_post_duration_sec) bloqueio = `O vídeo ultrapassa o limite de ${creator.max_video_post_duration_sec} segundos desta conta.`;
    return { ...estado, arquivo, bloqueio, criador: creator, erroConta, envio: publico(r), postInfo: r?.postInfo || null };
  }
  function urlUpload(url) {
    try { const u = new URL(url); if (u.protocol === 'https:' && !u.username && !u.password && !u.port && (u.hostname === 'open-upload.tiktokapis.com' || /^upload\.[a-z0-9-]+\.tiktokapis\.com$/.test(u.hostname)) && u.pathname === '/video/' && u.searchParams.has('upload_id') && u.searchParams.has('upload_token')) return u.href; } catch { /* Endpoint remoto não confiável. */ }
    recusar('O TikTok devolveu um endereço de upload inválido.', 502);
  }
  async function atualizarStatus(r) {
    const t = await tokenAtual(); if (t.open_id !== r.conta.id) recusar('Conecte a conta usada no envio original para consultar ou continuar.', 409);
    const d = await api('/v2/post/publish/status/fetch/', { publish_id: r.publishId });
    if (!['PROCESSING_UPLOAD', 'PROCESSING_DOWNLOAD', 'SEND_TO_USER_INBOX', 'PUBLISH_COMPLETE', 'FAILED'].includes(d.status)) recusar('O TikTok devolveu um andamento desconhecido. Consulte novamente antes de continuar.', 502);
    if (d.uploaded_bytes != null) {
      if (!Number.isSafeInteger(d.uploaded_bytes) || d.uploaded_bytes < 0 || d.uploaded_bytes > r.tamanho) recusar('O TikTok devolveu uma posição de upload inválida.', 502);
      r.bytes = d.uploaded_bytes;
    }
    r.statusRemoto = d.status;
    if (d.status === 'PUBLISH_COMPLETE') { r.estado = 'publicado'; r.bytes = r.tamanho; r.postIds = (d.publicaly_available_post_id || []).map(String).filter(v => /^\d{1,30}$/.test(v)); }
    else if (d.status === 'SEND_TO_USER_INBOX') { r.estado = 'caixa-entrada'; r.bytes = r.tamanho; }
    else if (d.status === 'FAILED') { r.estado = 'falhou'; r.erro = 'O TikTok recusou o processamento deste vídeo. Confira o formato, as permissões e os limites no aplicativo.'; }
    else r.estado = r.bytes >= r.tamanho ? 'processando' : 'interrompido';
    if (d.status !== 'FAILED') r.erro = null;
    salvar(r); return r;
  }
  async function consultar(nome) {
    const r = ler(registroArq(nomeValido(nome))); if (!r) return null;
    // Consulta de andamento nunca inicializa publicação nem envia bytes.
    if (r.publishId && r.estado !== 'falhou' && ativo !== nome && !ocupado) {
      const anterior = consultas.get(nome);
      if (anterior?.promessa) { await anterior.promessa; return publico(ler(registroArq(nome))); }
      if (!anterior || agora() - anterior.quando >= 5000) {
        const item = { quando: agora() };
        item.promessa = atualizarStatus(r).finally(() => { item.promessa = null; }); consultas.set(nome, item);
        await item.promessa;
      }
    }
    return publico(ler(registroArq(nome)));
  }
  async function hashArquivo(destino) { const h = crypto.createHash('sha256'); for await (const p of fs.createReadStream(destino)) { if (fechado) recusar('O estúdio foi fechado.', 503); h.update(p); } return h.digest('hex'); }
  async function executarEnvio(r, destino, statOriginal) {
    let arquivo;
    const conferir = () => {
      const atual = entregas.preparar(r.nome);
      if (atual.bloqueio) recusar(atual.bloqueio, 409);
      if (atual.arquivo?.sha256 !== r.sha256) recusar('A entrega mudou durante o envio. Confira a versão atual antes de continuar.', 409);
    };
    try {
      if (!r.publishId) {
        r.inicializacaoTentada = true; salvar(r);
        let init;
        try { init = await api(r.modo === 'direto' ? '/v2/post/publish/video/init/' : '/v2/post/publish/inbox/video/init/', { ...(r.modo === 'direto' ? { post_info: r.postInfo } : {}), source_info: r.plano }, 'POST', null, conferir); }
        catch (e) {
          // Sem resposta de rede não sabemos se o servidor criou a publicação.
          if (e instanceof ErroTiktok && e.status !== 503) r.inicializacaoTentada = false;
          throw e;
        }
        if (typeof init.publish_id !== 'string' || !init.publish_id || init.publish_id.length > 128) recusar('O TikTok não confirmou o identificador. Consulte seu perfil antes de recuperar o registro.', 502);
        r.publishId = init.publish_id;
        r.uploadUrl = urlUpload(init.upload_url); r.uploadExpira = agora() + 60 * 60 * 1000;
        r.estado = 'enviando'; salvar(r);
      } else {
        await atualizarStatus(r);
        if (TERMINAIS.includes(r.estado) || r.bytes >= r.tamanho) return;
      }
      if (!r.uploadUrl || agora() >= r.uploadExpira) recusar('O endereço de upload expirou. O registro foi preservado; confira o envio no TikTok antes de recuperar. Não foi criada outra publicação.', 409);
      urlUpload(r.uploadUrl);
      if (r.bytes % r.plano.chunk_size !== 0) recusar('O TikTok confirmou uma parte incompleta. Consulte novamente antes de continuar.', 409);
      arquivo = await fsp.open(destino, 'r');
      while (r.bytes < r.tamanho) {
        if (fechado) recusar('O estúdio foi fechado. Continue o envio pelo botão.', 503);
        const stat = await arquivo.stat();
        if (stat.size !== statOriginal.size || stat.mtimeMs !== statOriginal.mtimeMs) recusar('O MP4 mudou durante o envio. O upload foi interrompido.', 409);
        const parte = Math.floor(r.bytes / r.plano.chunk_size);
        const tamanho = parte === r.plano.total_chunk_count - 1 ? r.tamanho - r.bytes : r.plano.chunk_size;
        const inicio = r.bytes, buffer = Buffer.allocUnsafe(tamanho);
        const { bytesRead } = await arquivo.read(buffer, 0, tamanho, inicio);
        if (bytesRead !== tamanho) recusar('Não foi possível ler o MP4 inteiro.', 409);
        conferir();
        const resp = await requisicao(r.uploadUrl, { method: 'PUT', headers: { 'content-type': 'video/mp4', 'content-length': String(tamanho), 'content-range': `bytes ${inicio}-${inicio + tamanho - 1}/${r.tamanho}` }, body: buffer });
        if (![201, 206].includes(resp.status)) recusar('O TikTok não confirmou esta parte do vídeo. Consulte o andamento antes de continuar.', 503);
        r.bytes += tamanho; r.estado = r.bytes === r.tamanho ? 'processando' : 'enviando'; salvar(r);
      }
    } catch (e) {
      r.estado = 'interrompido'; r.erro = e instanceof ErroTiktok ? e.message : 'O envio foi interrompido. Confira o arquivo e o espaço em disco.';
      try { salvar(r); } catch { /* Nenhum segredo em logs. */ }
    } finally { await arquivo?.close().catch(() => {}); ativo = null; }
  }
  async function enviar(nome, d) {
    nomeValido(nome); livre();
    if (d?.confirmar !== true || d.aceitarMusica !== true) recusar('Revise o vídeo e aceite a confirmação de uso de música antes de enviar.');
    ocupado = true;
    try {
      const t = await tokenAtual(), c = ler(clienteArq);
      if (d.contaId !== t.open_id || d.modo !== c.modo) recusar('A conta ou o modo de envio mudou. Reabra a janela e revise antes de confirmar.', 409);
      const anterior = ler(registroArq(nome));
      if (anterior && (TERMINAIS.includes(anterior.estado) || (!anterior.publishId && anterior.inicializacaoTentada))) recusar('Este projeto já possui um envio registrado. Consulte o andamento e confira seu TikTok; nenhum novo envio será criado para evitar duplicação.', 409);
      if (anterior?.publishId && (anterior.conta.id !== t.open_id || anterior.modo !== c.modo)) recusar('Use a mesma conta e o mesmo modo do envio original para continuar.', 409);
      const validacao = entregas.preparar(nome);
      if (validacao.bloqueio) recusar(validacao.bloqueio);
      const destino = entregas.arquivo(nome), stat = fs.statSync(destino), info = await analisarVideo(destino);
      if (d.sha256 !== validacao.arquivo.sha256) recusar('O vídeo mudou. Reabra a janela para revisar a versão atual.', 409);
      const sha256 = await hashArquivo(destino);
      if (sha256 !== validacao.arquivo.sha256 || (anterior?.publishId && sha256 !== anterior.sha256)) recusar('O MP4 não corresponde à entrega aprovada ou ao envio original.', 409);
      let postInfo = null;
      if (c.modo === 'direto') {
        const creator = await criador();
        if (info.duracao > creator.max_video_post_duration_sec) recusar(`O vídeo ultrapassa o limite de ${creator.max_video_post_duration_sec} segundos desta conta.`);
        postInfo = anterior?.publishId ? anterior.postInfo : validarPost(d, creator);
        if (postInfo.brand_content_toggle && d.aceitarParceria !== true) recusar('Aceite a política de conteúdo de marca antes de enviar a parceria.');
      }
      const r = anterior?.publishId ? { ...anterior, erro: null } : { nome, conta: t.conta, modo: c.modo, tamanho: stat.size, bytes: 0,
        sha256, postInfo, plano: planoPartes(stat.size), criado: new Date(agora()).toISOString(), estado: 'preparando' };
      salvar(r); ativo = nome;
      tarefa = new Promise(resolve => setImmediate(resolve)).then(() => executarEnvio(r, destino, stat));
      return publico(r);
    } finally { ocupado = false; }
  }
  return { conta, configurar, autorizar, callback, desconectar, preparar, consultar, enviar,
    arquivo: nome => entregas.arquivo(nome), esperar: () => tarefa || Promise.resolve(),
    fechar() { fechado = true; pendente = null; aborto.abort(); entregas.fechar(); },
  };
}
