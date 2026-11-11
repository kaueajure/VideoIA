import fs from 'node:fs';
import path from 'node:path';
import { embutirTeologia } from './engine/estilo-teologia.js';

function lerImagemDoProjeto(arquivo, pasta) {
  const raiz = fs.realpathSync(pasta);
  if (!fs.realpathSync(arquivo).startsWith(raiz + path.sep)) {
    throw new Error('A imagem precisa estar dentro da pasta do projeto, inclusive o destino de links.');
  }
  return fs.readFileSync(arquivo);
}

export function embutirImagens(t, r) {
  const o = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };
  for (const n of t.beats)
    for (const i of n.elementos || []) {
      if (i.tipo !== "imagem" && !(i.tipo === 'recurso' && i.arquivo)) continue;
      const d = path.resolve(r, i.arquivo || "");
      if (!i.arquivo || !d.startsWith(path.resolve(r) + path.sep) || !fs.existsSync(d))
        throw new Error(
          `beat ${n.id}: imagem "${i.arquivo}" n\xE3o existe na pasta do projeto (use assets/nome.jpg).`,
        );
      const g = o[path.extname(d).toLowerCase()];
      if (!g)
        throw new Error(
          `beat ${n.id}: formato de imagem n\xE3o suportado (${path.extname(d)}). Use jpg, png, webp ou svg.`,
        );
      i.src = `data:${g};base64,${lerImagemDoProjeto(d, r).toString("base64")}`;
    }
  const a = t.sujeito?.dados?.retrato;
  if (a?.arquivo) {
    const n = path.resolve(r, a.arquivo);
    if (!n.startsWith(path.resolve(r) + path.sep) || !fs.existsSync(n))
      throw new Error(
        `retrato "${a.arquivo}" n\xE3o existe na pasta do projeto (use assets/nome.jpg, baixada com scripts/buscar-imagem.mjs).`,
      );
    const i = o[path.extname(n).toLowerCase()];
    if (!i || i === "image/svg+xml")
      throw new Error(
        `retrato: formato n\xE3o suportado (${path.extname(n)}). Use jpg, png ou webp.`,
      );
    t.retratoSrc = `data:${i};base64,${lerImagemDoProjeto(n, r).toString("base64")}`;
  }
  const m = (n, i) => {
    const d = path.resolve(r, i || "");
    if (!i || !d.startsWith(path.resolve(r) + path.sep) || !fs.existsSync(d))
      throw new Error(
        `beat ${n.id}: imagem "${i}" n\xE3o existe na pasta do projeto (use assets/nome.jpg, baixada com scripts/buscar-imagem.mjs).`,
      );
    const g = o[path.extname(d).toLowerCase()];
    if (!g || g === "image/svg+xml")
      throw new Error(
        `beat ${n.id}: formato de imagem n\xE3o suportado no estilo antiguidade (${path.extname(d)}). Use jpg, png ou webp.`,
      );
    return `data:${g};base64,${lerImagemDoProjeto(d, r).toString("base64")}`;
  };
  for (const n of t.beats)
    for (const i of n.elementos || [])
      i.tipo !== "stop-motion" ||
        i.forma !== "cena" ||
        ((i.src = m(n, i.arquivo)),
        i.profundidade && (i.srcProf = m(n, i.profundidade)));
  const l = {};
  for (const n of t.beats)
    for (const i of n.elementos || []) {
      if (i.tipo === "quadro-antigo") {
        (i.arquivo && (i.src = l[i.arquivo] ||= m(n, i.arquivo)),
          i.fundo && (i.srcFundo = l[i.fundo] ||= m(n, i.fundo)));
        continue;
      }
      i.tipo === "antiguidade" &&
        (i.arquivo && (i.src = m(n, i.arquivo)),
        Array.isArray(i.atras) && (i.srcs = i.atras.map((d) => m(n, d))),
        Array.isArray(i.trocas) &&
          (i.trocas = i.trocas.map((d) => ({ ...d, src: m(n, d.arquivo) }))));
    }
  embutirTeologia(t, m);
}
