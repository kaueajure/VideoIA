import { fileURLToPath } from 'node:url';
import { criarTiktok, ErroTiktok } from '../tiktok.mjs';

const servico = contexto => contexto.tiktok ||= criarTiktok({ raiz: contexto.raiz });
const falha = e => [{ erro: { causa: e instanceof ErroTiktok ? e.message : 'Não foi possível concluir a operação do TikTok.', acao: 'Confira os dados e a conexão. Consulte o andamento antes de continuar um envio.' } }, e instanceof ErroTiktok ? e.status : 500];
const executar = (fn, status = 200) => async (c, d) => { try { return [await fn(servico(c), c, d), status]; } catch (e) { return falha(e); } };
export const POST = {
  '/api/tiktok/configurar': executar((t, c, d) => t.configurar(d)),
  '/api/tiktok/conectar': executar((t, c) => t.autorizar(c.tiktokRedirect)),
  '/api/tiktok/desconectar': executar(t => t.desconectar()),
  '/api/tiktok/enviar': executar((t, c, d) => t.enviar(d.nome, d), 202),
};
async function responder(c, res, fn) { try { c.json(res, await fn(servico(c))); } catch (e) { const [d, status] = falha(e); c.json(res, d, status); } }
export const conta = (c, { res }) => responder(c, res, t => ({ ...t.conta(), redirectUri: c.tiktokRedirect, redirectPortal: 'http://127.0.0.1:*/api/tiktok/callback/' }));
export const projeto = (c, { res, m }) => responder(c, res, async t => ({ ...await t.preparar(m[1]), redirectUri: c.tiktokRedirect, redirectPortal: 'http://127.0.0.1:*/api/tiktok/callback/' }));
export const envio = (c, { res, m }) => responder(c, res, t => t.consultar(m[1]));
export const script = (c, { req, res }) => c.arquivo(req, res, fileURLToPath(new URL('../tiktok-ui.js', import.meta.url)));
export const previa = (c, { req, res, m }) => {
  try { return c.arquivo(req, res, servico(c).arquivo(m[1])); }
  catch (e) { const [d, status] = falha(e); return c.json(res, d, status); }
};
export async function callback(c, { res, url }) {
  let texto = 'Conta TikTok conectada. Volte à janela do estúdio para revisar e confirmar o envio. Nenhum vídeo foi enviado.', status = 200;
  try { await servico(c).callback(url.searchParams); }
  catch (e) { texto = e instanceof ErroTiktok ? e.message : 'Não foi possível conectar a conta. Volte ao estúdio e tente novamente.'; status = 400; }
  const seguro = texto.replace(/[&<>"']/g, v => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[v]));
  res.writeHead(status, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'referrer-policy': 'no-referrer', 'content-security-policy': "default-src 'none'; base-uri 'none'; frame-ancestors 'none'", 'x-content-type-options': 'nosniff' });
  res.end(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Conectar TikTok</title><h1>Conectar TikTok</h1><p>${seguro}</p><p><a href="/">Voltar ao estúdio</a></p></html>`);
}
