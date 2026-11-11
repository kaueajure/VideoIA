import https from 'node:https';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

export function ipPublico(ip) {
  if (isIP(ip) === 4) {
    const [a,b,c] = ip.split('.').map(Number);
    return !(a === 0 || a === 10 || a === 127 || a === 169 && b === 254
      || a === 172 && b >= 16 && b <= 31 || a === 192 && (b === 168 || b === 0 && [0,2].includes(c) || b === 88 && c === 99)
      || a === 100 && b >= 64 && b <= 127 || a >= 224
      || a === 198 && ([18,19].includes(b) || b === 51 && c === 100) || a === 203 && b === 0 && c === 113);
  }
  // Aceita somente unicast global IPv6, sem endereços IPv4 encapsulados.
  return isIP(ip) === 6 && /^[23][0-9a-f]{3}:/i.test(ip) && !/^2001:(?:[01]?[0-9a-f]{0,2}:|db8:)/i.test(ip) && !/^2002:|^3fff:/i.test(ip);
}
export function validarUrlFonte(valor) {
  let u; try { u = new URL(valor); } catch { throw new Error('URL inválida.'); }
  if (u.protocol !== 'https:' || u.username || u.password || u.port && u.port !== '443' || u.hostname.endsWith('.') || u.hostname === 'localhost' || !u.hostname.includes('.') || u.hostname.endsWith('.local') || (isIP(u.hostname.replace(/^\[|\]$/g,'')) && !ipPublico(u.hostname.replace(/^\[|\]$/g,'')))) throw new Error('Use uma página HTTPS pública, sem credenciais ou porta alternativa.');
  u.hash = ''; return u;
}
export async function baixarPagina(valor, { resolver = lookup, limite = 1024 * 1024, redirecionamentos = 3 } = {}) {
  const u = validarUrlFonte(valor);
  const ips = await resolver(u.hostname, { all: true, verbatim: true });
  if (!ips.length || ips.some(i => !ipPublico(i.address))) throw new Error('A fonte aponta para uma rede privada ou reservada.');
  const ip = ips[0];
  return new Promise((resolve, reject) => {
    const req = https.request(u, { method: 'GET', headers: { 'user-agent': 'Metodo-Video-Pesquisa/1.0', accept: 'text/html,text/plain;q=0.9', 'accept-encoding': 'identity' },
      // O DNS conferido fica fixo durante esta conexão (sem segunda resolução).
      lookup: (_host, opcoes, cb) => cb(null, ...(opcoes.all ? [ips] : [ip.address, ip.family])) }, res => {
      if ([301,302,303,307,308].includes(res.statusCode)) {
        res.resume();
        if (!res.headers.location || !redirecionamentos) return reject(new Error('Redirecionamento excessivo ou inválido.'));
        try { baixarPagina(new URL(res.headers.location, u).href, { resolver, limite, redirecionamentos: redirecionamentos - 1 }).then(resolve,reject); } catch { reject(new Error('Redirecionamento inválido.')); } return;
      }
      const tipo = String(res.headers['content-type'] || '').split(';')[0];
      if (res.statusCode !== 200 || !['text/html','text/plain','application/xhtml+xml'].includes(tipo) || res.headers['content-encoding'] && res.headers['content-encoding'] !== 'identity') { res.resume(); return reject(new Error('Página indisponível ou formato não suportado. Abra PDFs e páginas dinâmicas com o assistente.')); }
      let tamanho = 0; const partes = [];
      res.on('data', chunk => { tamanho += chunk.length; if (tamanho > limite) req.destroy(new Error('A página excede o limite de coleta.')); else partes.push(chunk); });
      res.on('error',reject); res.on('end',()=>resolve({ url: u.href, html: Buffer.concat(partes).toString('utf8'), tipo }));
    });
    const timer = setTimeout(() => req.destroy(new Error('Tempo de consulta esgotado.')), 15000);
    req.on('close',()=>clearTimeout(timer)); req.on('error',reject); req.end();
  });
}
const entidades = { amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' ',rsquo:'’',lsquo:'‘',rdquo:'”',ldquo:'“',ndash:'–',mdash:'—' };
export function textoDaPagina(html) {
  return String(html).replace(/<!--[\s\S]*?-->/g,' ').replace(/<(script|style|noscript|svg|nav|footer)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,' ')
    .replace(/<[^>]*>/g,' ').replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,(m,n)=>{
      if (n[0] !== '#') return entidades[n.toLowerCase()] || m;
      const c = n[1].toLowerCase() === 'x' ? parseInt(n.slice(2),16) : Number(n.slice(1));
      return c > 0 && c <= 0x10ffff ? String.fromCodePoint(c) : ' ';
    }).normalize('NFC').replace(/\s+/g,' ').trim().slice(0,120000);
}
