import { criarYoutube, ErroYoutube } from '../youtube.mjs';
import { fileURLToPath } from 'node:url';

const servico = contexto => contexto.youtube ||= criarYoutube({ raiz: contexto.raiz });
const falha = erro => [{ erro: {
  causa: erro instanceof ErroYoutube ? erro.message : 'Não foi possível concluir a operação do YouTube.',
  acao: 'Confira a conexão e os dados nesta janela. Nenhum novo envio começa sem sua confirmação.',
} }, erro instanceof ErroYoutube ? erro.status : 500];
const executar = fn => async (contexto, dados) => {
  try { return [await fn(servico(contexto), contexto, dados)]; } catch (erro) { return falha(erro); }
};

export const POST = {
  '/api/youtube/configurar': executar((youtube, contexto, dados) => youtube.configurar(dados.credenciais)),
  '/api/youtube/conectar': executar((youtube, contexto) => youtube.autorizar(contexto.youtubeRedirect)),
  '/api/youtube/desconectar': executar(youtube => youtube.desconectar()),
  '/api/youtube/enviar': async (contexto, dados) => {
    try { return [await servico(contexto).enviar(dados.nome, dados), 202]; }
    catch (erro) { return falha(erro); }
  },
};

function responder(contexto, resposta, fn) {
  try { contexto.json(resposta, fn(servico(contexto))); }
  catch (erro) { const [dados, status] = falha(erro); contexto.json(resposta, dados, status); }
}
export const conta = (contexto, { res }) => responder(contexto, res, youtube => youtube.estado());
export const projeto = (contexto, { res, m }) => responder(contexto, res, youtube => youtube.preparar(m[1]));
export const envio = (contexto, { res, m }) => responder(contexto, res, youtube => youtube.envio(m[1]));
export const script = (contexto, { req, res }) => contexto.arquivo(req, res, fileURLToPath(new URL('../youtube-ui.js', import.meta.url)));
export const previa = (contexto, { req, res, m }) => {
  try { return contexto.arquivo(req, res, servico(contexto).arquivo(m[1])); }
  catch (erro) { const [dados, status] = falha(erro); return contexto.json(res, dados, status); }
};

export async function callback(contexto, { res, url }) {
  let texto = 'Canal conectado. Volte à janela do estúdio para revisar o vídeo e clicar em Enviar ao YouTube. Nenhum vídeo foi enviado.';
  let status = 200;
  try { await servico(contexto).callback(url.searchParams); }
  catch (erro) { texto = erro instanceof ErroYoutube ? erro.message : 'Não foi possível conectar o canal. Volte ao estúdio e tente conectar novamente.'; status = 400; }
  const seguro = texto.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  res.writeHead(status, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'referrer-policy': 'no-referrer', 'content-security-policy': "default-src 'none'; base-uri 'none'; frame-ancestors 'none'", 'x-content-type-options': 'nosniff' });
  res.end(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Conectar YouTube</title><h1>Conectar YouTube</h1><p>${seguro}</p><p><a href="/">Voltar ao estúdio</a></p></html>`);
}
