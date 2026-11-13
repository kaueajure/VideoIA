/* Ponte do kit 3D embutido (Remotion) dentro do Estudio de Videos. */
import fs from 'node:fs';
import path from 'node:path';
import { valorDoEnv } from './configlocal.mjs';
import { NOME, STUDIO } from './rotas/comum.mjs';

export const ARQ_PEDIDO_3D = 'PEDIDO-DO-ESTUDIO.md';
export const PASTA_KIT = 'kit-3d';

export function pastaKit(raiz = STUDIO) {
  return path.join(raiz, PASTA_KIT);
}

export function pastaVideos(raiz = STUDIO) {
  return path.join(pastaKit(raiz), 'videos');
}

export function pastaSlug(raiz, slug) {
  return path.join(pastaVideos(raiz), slug);
}

export function kitPresente(raiz = STUDIO) {
  const pkg = path.join(pastaKit(raiz), 'package.json');
  const scripts = path.join(pastaKit(raiz), 'scripts');
  return fs.existsSync(pkg) && fs.existsSync(scripts);
}

/** Copia chaves de voz do .env do estúdio para o kit-3d (sem sobrescrever se o kit já tiver). */
export function sincronizarEnvKit(raiz = STUDIO, { forcar = false } = {}) {
  const kit = pastaKit(raiz);
  if (!fs.existsSync(kit)) return { ok: false, motivo: 'kit-ausente' };
  const dest = path.join(kit, '.env');
  const exemplo = path.join(kit, '.env.example');
  const chaves = ['ELEVENLABS_API_KEY', 'ELEVENLABS_VOICE_ID', 'DRIVE_RAIZ'];
  let linhas = [];
  if (fs.existsSync(dest)) {
    linhas = fs.readFileSync(dest, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/);
  } else if (fs.existsSync(exemplo)) {
    linhas = fs.readFileSync(exemplo, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/);
  } else {
    linhas = ['# Chaves do kit 3D (sincronizadas do Estudio de Videos)'];
  }
  const mapa = new Map();
  for (const linha of linhas) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(linha);
    if (m) mapa.set(m[1], m[2]);
  }
  let mudou = false;
  for (const k of chaves) {
    const v = valorDoEnv(k, raiz);
    if (!v) continue;
    const atual = (mapa.get(k) || '').replace(/^["']|["']$/g, '').trim();
    const vazio = !atual || /^(cole|sua|seu|xxx|<)/i.test(atual);
    if (forcar || vazio || !mapa.has(k)) {
      mapa.set(k, v);
      mudou = true;
    }
  }
  if (!mudou && fs.existsSync(dest)) return { ok: true, mudou: false };
  const out = [];
  const usados = new Set();
  for (const linha of linhas) {
    const m = /^\s*([A-Z0-9_]+)\s*=/.exec(linha);
    if (m && mapa.has(m[1])) {
      out.push(`${m[1]}=${mapa.get(m[1])}`);
      usados.add(m[1]);
    } else out.push(linha);
  }
  for (const [k, v] of mapa) {
    if (!usados.has(k)) out.push(`${k}=${v}`);
  }
  fs.writeFileSync(dest, out.join('\n').replace(/\n*$/, '\n'), { mode: 0o600 });
  return { ok: true, mudou: true };
}

function limpar(txt) {
  return String(txt || '').replace(/\s+/g, ' ').trim();
}

export function nomeDoTema3d(tema) {
  const o = String(tema || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/, '');
  if (!NOME.test(o)) return 'video-3d';
  if (/^(con|prn|aux|nul|com\d|lpt\d)$/.test(o)) return `${o}-3d`;
  return o;
}

export function nomeLivre3d(base, ocupados = new Set()) {
  if (!ocupados.has(base)) return base;
  for (let i = 2; i < 1000; i++) {
    const e = `${base.slice(0, 56)}-${i}`;
    if (!ocupados.has(e)) return e;
  }
  return `${base.slice(0, 40)}-${Date.now()}`;
}

/** Prompt específico do modo 3D (kit Remotion embutido). */
export function pedidoKit3d({
  tema,
  nome,
  idioma = '',
  gancho = '',
  titulo = '',
  virada = '',
  pergunta = '',
  pasta = '',
} = {}) {
  const idiomaTxt = { en: ' em inglês', es: ' em espanhol' }[idioma] || '';
  const s = limpar(tema)
    .replace(/[.?!]+$/, '')
    .replace(/^(Por|Como|Quem|Quando|Onde|Qual|Quais|Quanto|Quantos|Quantas|O|A|Os|As|Um|Uma|Se|E|De|Do|Da|Porque|Curiosidades?)(?=\s)/, (n) => n.toLowerCase());
  const N = limpar(gancho);
  const H = limpar(titulo);
  const j = limpar(virada);
  const C2 = limpar(pergunta);
  const y = [];
  if (N) y.push(`- Gancho (primeira frase do video.json, sem trocar): "${N}"`);
  if (H) y.push(`- Título (capa e post): "${H}"`);
  if (j) y.push(`- Virada (fato do meio): "${j}"`);
  if (C2) y.push(`- Pergunta / CTA final (última fala): "${C2}"`);
  const S = y.length
    ? `\n\nTextos que a pessoa pediu (use estes; não troque por versão genérica):\n${y.join('\n')}`
    : '';
  const p = pasta ? ` A pasta do estúdio aberta é ${pasta}.` : '';

  return `Quero um vídeo 3D${idiomaTxt} sobre ${s}.${p}

MODO: kit-3d embutido no Estudio de Videos. Trabalhe SOMENTE dentro da pasta kit-3d/ (não use projetos/, cena.json nem o motor src/video/ do VideoIA para este pedido).

Leia kit-3d/CLAUDE.md e a skill .claude/skills/video-3d/SKILL.md (ou kit-3d/.claude/skills/video/SKILL.md). Pipeline: pesquisa → video.json → voz → cenas.tsx → prévia → render → arquivar (se houver Drive).

Slug deste vídeo: ${nome}
Pasta: kit-3d/videos/${nome}/

O tema digitado pela pessoa é exatamente este e não muda: "${s}". Não troque, não generalize e não desvie.${S}

Regras do kit (obrigatórias):
- Duração 1min10s a 2min (~300 palavras faladas, 14–20 cenas).
- Fatos conferidos; fontes em video.json (campo fontes), nunca no post.
- Elementos 3D com sentido; nada de enfeite aleatório; assunto desde o quadro 0.
- Animação só por useCurrentFrame/useCena; sem Math.random/Date.now/useFrame do R3F.
- Som sem AI slop (só sons/trilhas licenciados do kit).
- Post com chamada "Mande para quem …" + hashtags.

Fluxo a partir do estúdio web (autônomo):
1. npm run novo -- ${nome} "${H || s}"  (rode com cwd kit-3d; se a pasta já existir com PEDIDO-DO-ESTUDIO.md, edite o video.json dela).
2. Pesquise, escreva o video.json completo (cenas, capa, post, emocao em blocos).
3. Como o pedido veio do estúdio web com tema/gancho já definidos, NÃO pare para "aprovado": ponha roteiroAprovado: true e siga.
4. npm run voz -- ${nome} (ElevenLabs; chave já sincronizada no kit-3d/.env).
5. Escreva kit-3d/videos/${nome}/cenas.tsx sincronizado com quando('palavra').
6. npm run checar && npm run previa -- ${nome} --momentos 0.06,0.5,0.94; leia a folha e corrija.
7. npm run render -- ${nome}.
8. Se o status mostrar Drive: npm run arquivar -- ${nome}.

Não use skills pauta/roteiro/cena/video do VideoIA neste pedido. Não renderize com node src/video/cli.mjs. Não abra nem controle o navegador: a tela do estúdio se atualiza sozinha quando o MP4 existir em kit-3d/videos/${nome}/saida/.

<!-- kit-3d:v1 -->`;
}

function acharMp4(dir) {
  if (!fs.existsSync(dir)) return null;
  const lista = fs.readdirSync(dir).filter((f) => f.endsWith('.mp4') && f !== 'previa.mp4');
  if (!lista.length) {
    const previa = path.join(dir, 'previa.mp4');
    return fs.existsSync(previa) ? { arquivo: 'previa.mp4', st: fs.statSync(previa) } : null;
  }
  const ordenados = lista
    .map((f) => ({ arquivo: f, st: fs.statSync(path.join(dir, f)) }))
    .sort((a, b) => b.st.mtimeMs - a.st.mtimeMs);
  return ordenados[0];
}

export function estadoVideo3d(raiz, slug) {
  if (!NOME.test(slug || '')) return null;
  const pasta = pastaSlug(raiz, slug);
  const saida = path.join(pasta, 'saida');
  const videoJson = path.join(pasta, 'video.json');
  const cenas = path.join(pasta, 'cenas.tsx');
  const pedido = path.join(pasta, ARQ_PEDIDO_3D);
  const narracao = path.join(pasta, 'audio', 'narracao.json');
  let meta = null;
  try {
    meta = JSON.parse(fs.readFileSync(videoJson, 'utf8'));
  } catch {
    meta = null;
  }
  const mp4 = acharMp4(saida);
  const capa = ['capa.png', 'capa.jpg'].find((f) => fs.existsSync(path.join(saida, f)));
  let produzindo = false;
  try {
    const lock = path.join(pasta, '.produzindo-3d.lock');
    if (fs.existsSync(lock)) {
      const o = JSON.parse(fs.readFileSync(lock, 'utf8'));
      if (o?.pid && Date.now() - Date.parse(o.inicio) < 12 * 36e5) {
        try {
          process.kill(o.pid, 0);
          produzindo = true;
        } catch (e) {
          produzindo = e.code === 'EPERM';
        }
      }
    }
  } catch {
    produzindo = false;
  }
  return {
    existe: fs.existsSync(pasta),
    slug,
    titulo: meta?.titulo || meta?.capa?.titulo || slug,
    videoJson: !!meta,
    roteiroAprovado: !!meta?.roteiroAprovado,
    cenas: fs.existsSync(cenas),
    voz: fs.existsSync(narracao),
    pedido: fs.existsSync(pedido),
    produzindo,
    video: mp4
      ? {
          arquivo: mp4.arquivo,
          mb: +(mp4.st.size / 1e6).toFixed(1),
          data: mp4.st.mtime.toISOString(),
        }
      : null,
    capa: capa || null,
    pronto: !!mp4,
  };
}

export function listarVideos3d(raiz = STUDIO) {
  const base = pastaVideos(raiz);
  if (!fs.existsSync(base)) return [];
  const out = [];
  for (const nome of fs.readdirSync(base)) {
    if (!NOME.test(nome)) continue;
    const st = estadoVideo3d(raiz, nome);
    if (!st?.existe) continue;
    out.push(st);
  }
  return out.sort((a, b) => {
    const da = a.video?.data || '';
    const db = b.video?.data || '';
    return db.localeCompare(da) || a.slug.localeCompare(b.slug);
  });
}

export function ehVideo3d(raiz, slug) {
  if (!NOME.test(slug || '')) return false;
  return fs.existsSync(pastaSlug(raiz, slug));
}

export function lerPost3d(raiz, slug) {
  const caminhos = [
    path.join(pastaSlug(raiz, slug), 'saida', 'post.txt'),
    path.join(pastaSlug(raiz, slug), 'post.txt'),
    path.join(pastaSlug(raiz, slug), 'post.md'),
  ];
  for (const c of caminhos) {
    try {
      const t = fs.readFileSync(c, 'utf8').trim();
      if (t) return t;
    } catch {
      /* tenta o próximo */
    }
  }
  try {
    const meta = JSON.parse(fs.readFileSync(path.join(pastaSlug(raiz, slug), 'video.json'), 'utf8'));
    const p = meta?.post;
    if (!p) return null;
    const tags = Array.isArray(p.hashtags) ? p.hashtags.map((h) => (String(h).startsWith('#') ? h : `#${h}`)).join(' ') : '';
    return [p.texto, p.chamada, tags].filter(Boolean).join('\n\n').trim() || null;
  } catch {
    return null;
  }
}

export function pacoteYoutube3d(raiz, slug) {
  const arq = path.join(pastaSlug(raiz, slug), 'youtube.json');
  try {
    const j = JSON.parse(fs.readFileSync(arq, 'utf8'));
    if (j && typeof j === 'object') return j;
  } catch {
    /* monta a partir do post */
  }
  let meta = null;
  try {
    meta = JSON.parse(fs.readFileSync(path.join(pastaSlug(raiz, slug), 'video.json'), 'utf8'));
  } catch {
    meta = null;
  }
  const titulo = meta?.titulo || meta?.capa?.titulo || slug;
  const post = meta?.post || {};
  const textoPost = lerPost3d(raiz, slug) || post.texto || titulo;
  const tags = Array.isArray(post.hashtags)
    ? post.hashtags.map((h) => String(h).replace(/^#/, ''))
    : [];
  const hashtags = tags.map((h) => `#${h}`);
  const fontes = Array.isArray(meta?.fontes)
    ? meta.fontes
        .map((f) => (typeof f === 'string' ? f : [f.titulo, f.url].filter(Boolean).join(' — ')))
        .filter(Boolean)
        .join('\n')
    : '';
  const desc = [textoPost, fontes ? `\nFontes:\n${fontes}` : ''].join('').trim();
  return {
    titulos: [titulo, post.texto || titulo, `${titulo} | curiosidade`].filter(Boolean).slice(0, 3),
    descricoes: [desc, textoPost, [post.texto, post.chamada].filter(Boolean).join('\n\n')].filter(Boolean).slice(0, 3),
    tags: tags.length ? tags : ['curiosidades', '3d', 'shorts'],
    hashtags: hashtags.length ? hashtags : ['#curiosidades', '#shorts'],
    formato: 'shorts',
    kit: true,
  };
}

export function gravarPacoteYoutube3d(raiz, slug, pacote) {
  const arq = path.join(pastaSlug(raiz, slug), 'youtube.json');
  fs.writeFileSync(arq, JSON.stringify(pacote, null, 2) + '\n');
  return pacote;
}

export function caminhoMp4_3d(raiz, slug) {
  const st = estadoVideo3d(raiz, slug);
  if (!st?.video) return null;
  return path.join(pastaSlug(raiz, slug), 'saida', st.video.arquivo);
}

/** Formato da aba Meus vídeos (/api/videos), só com MP4 pronto. */
export function listarVideos3dParaMeus(raiz = STUDIO) {
  return listarVideos3d(raiz)
    .filter((v) => v.pronto && v.video)
    .map((v) => {
      const tituloBruto = String(v.titulo || v.slug).replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
      const tit = tituloBruto ? tituloBruto[0].toUpperCase() + tituloBruto.slice(1) : v.slug;
      const post = !!lerPost3d(raiz, v.slug);
      const ytArq = path.join(pastaSlug(raiz, v.slug), 'youtube.json');
      let yt = fs.existsSync(ytArq);
      if (!yt && post) {
        try {
          gravarPacoteYoutube3d(raiz, v.slug, pacoteYoutube3d(raiz, v.slug));
          yt = true;
        } catch {
          yt = false;
        }
      }
      return {
        nome: v.slug,
        titulo: tit,
        arquivo: v.video.arquivo,
        rapido: v.video.arquivo === 'previa.mp4',
        mb: v.video.mb,
        data: v.video.data,
        capa: !!v.capa,
        legenda: post,
        youtube: yt,
        voz: v.voz ? 'elevenlabs' : null,
        aprovado: true,
        teste: false,
        publicavel: true,
        kit: true,
        tipo: '3d',
        estilo: 'kit-3d',
        proximo: null,
      };
    });
}

export function lerPedido3d(raiz, slug) {
  try {
    return fs.readFileSync(path.join(pastaSlug(raiz, slug), ARQ_PEDIDO_3D), 'utf8');
  } catch {
    return null;
  }
}
