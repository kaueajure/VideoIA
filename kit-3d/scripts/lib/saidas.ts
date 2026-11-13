// Arquivos que acompanham o MP4: legenda .srt, texto do post e folha de contato das prévias.
import {readFileSync, writeFileSync} from 'node:fs';
import {PNG} from 'pngjs';
import type {Video} from '../../src/esquema';
import type {LinhaDoTempo} from '../../src/video/linhaDoTempo';

const carimbo = (quadro: number, fps: number) => {
  const ms = Math.max(0, Math.round((quadro / fps) * 1000));
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const pad = (n: number, t = 2) => String(n).padStart(t, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms % 1000, 3)}`;
};

// Legenda para YouTube/TikTok: quebra nas pausas do texto (vírgula, ponto) e junta
// trechos até ~42 caracteres por bloco; trecho maior que isso é dividido ao meio.
export const gerarSrt = (linha: LinhaDoTempo, fps: number): string => {
  type Palavra = {texto: string; inicio: number; fim: number};
  type Bloco = {inicio: number; fim: number; texto: string[]};
  const LIMITE = 42;
  const tamanho = (ps: Palavra[]) => ps.map((p) => p.texto).join(' ').length;
  const dividir = (ps: Palavra[]): Palavra[][] => {
    if (tamanho(ps) <= LIMITE || ps.length < 2) {
      return [ps];
    }
    let melhor = 1;
    for (let i = 1; i < ps.length; i++) {
      if (Math.abs(tamanho(ps.slice(0, i)) - tamanho(ps.slice(i))) < Math.abs(tamanho(ps.slice(0, melhor)) - tamanho(ps.slice(melhor)))) {
        melhor = i;
      }
    }
    return [...dividir(ps.slice(0, melhor)), ...dividir(ps.slice(melhor))];
  };

  const blocos: Bloco[] = [];
  for (const cena of linha.cenas) {
    const trechos: Palavra[][] = [[]];
    for (const p of cena.palavras) {
      trechos[trechos.length - 1].push({texto: p.texto, inicio: cena.inicio + p.inicio, fim: cena.inicio + p.fim});
      if (/[.,!?…;:—]$/.test(p.texto)) {
        trechos.push([]);
      }
    }
    let atual: Palavra[] = [];
    for (const trecho of trechos.filter((t) => t.length > 0).flatMap(dividir)) {
      const fimDeFrase = atual.length > 0 && /[.!?…]$/.test(atual[atual.length - 1].texto);
      if (atual.length > 0 && (fimDeFrase || tamanho([...atual, ...trecho]) > LIMITE)) {
        blocos.push({inicio: atual[0].inicio, fim: atual[atual.length - 1].fim, texto: atual.map((p) => p.texto)});
        atual = [];
      }
      atual.push(...trecho);
    }
    if (atual.length > 0) {
      blocos.push({inicio: atual[0].inicio, fim: atual[atual.length - 1].fim, texto: atual.map((p) => p.texto)});
    }
  }
  return blocos
    .map((b, i) => {
      const proximo = blocos[i + 1];
      const fim = proximo ? Math.min(proximo.inicio, b.fim + fps * 0.3) : b.fim + fps * 0.3;
      return `${i + 1}\n${carimbo(b.inicio, fps)} --> ${carimbo(fim, fps)}\n${b.texto.join(' ')}\n`;
    })
    .join('\n');
};

// Legenda do post: texto, chamada para ação e hashtags. Sem fontes (ficam na ficha do arquivo).
export const gerarTextoDoPost = (video: Video): string => {
  const hashtags = video.post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ');
  return `${[video.post.texto, video.post.chamada, hashtags].filter((p) => p.trim()).join('\n\n')}\n`;
};

// Junta várias imagens (PNG) numa grade só, reduzidas, para revisar de uma vez.
// Imagens com transparência são compostas sobre `fundo` (o mesmo tom escuro das páginas).
export const montarFolhaDeContato = (
  arquivos: string[],
  destino: string,
  reducao = 3,
  colunas = 4,
  fundo: [number, number, number] = [11, 16, 32],
) => {
  if (arquivos.length === 0) {
    return;
  }
  const imagens = arquivos.map((a) => PNG.sync.read(readFileSync(a)));
  const w = Math.floor(imagens[0].width / reducao);
  const h = Math.floor(imagens[0].height / reducao);
  const cols = Math.min(colunas, imagens.length);
  const linhas = Math.ceil(imagens.length / cols);
  const margem = 12;
  const folha = new PNG({width: cols * w + (cols + 1) * margem, height: linhas * h + (linhas + 1) * margem});
  for (let i = 0; i < folha.data.length; i += 4) {
    folha.data[i] = 24;
    folha.data[i + 1] = 26;
    folha.data[i + 2] = 34;
    folha.data[i + 3] = 255;
  }
  imagens.forEach((img, n) => {
    const ox = margem + (n % cols) * (w + margem);
    const oy = margem + Math.floor(n / cols) * (h + margem);
    const escalaX = img.width / (w * reducao);
    const escalaY = img.height / (h * reducao);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let r = 0;
        let g = 0;
        let b = 0;
        for (let dy = 0; dy < reducao; dy++) {
          for (let dx = 0; dx < reducao; dx++) {
            const sx = Math.min(img.width - 1, Math.floor((x * reducao + dx) * escalaX));
            const sy = Math.min(img.height - 1, Math.floor((y * reducao + dy) * escalaY));
            const i = (sy * img.width + sx) * 4;
            const a = img.data[i + 3] / 255;
            r += img.data[i] * a + fundo[0] * (1 - a);
            g += img.data[i + 1] * a + fundo[1] * (1 - a);
            b += img.data[i + 2] * a + fundo[2] * (1 - a);
          }
        }
        const k = reducao * reducao;
        const o = ((oy + y) * folha.width + (ox + x)) * 4;
        folha.data[o] = r / k;
        folha.data[o + 1] = g / k;
        folha.data[o + 2] = b / k;
        folha.data[o + 3] = 255;
      }
    }
  });
  writeFileSync(destino, PNG.sync.write(folha));
};
