// Texturas procedurais (geradas em canvas, sem arquivos). Cacheadas por aba do navegador.
import {CanvasTexture, SRGBColorSpace, type Texture} from 'three';

const cache = new Map<string, Texture>();

// Brilho radial: branco no centro, transparente na borda. Base para halos e glows.
export const texturaBrilho = (suavidade = 1): Texture => {
  const chave = `brilho-${suavidade}`;
  const pronta = cache.get(chave);
  if (pronta) {
    return pronta;
  }
  const tamanho = 256;
  const canvas = document.createElement('canvas');
  canvas.width = tamanho;
  canvas.height = tamanho;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D indisponível para gerar textura');
  }
  const g = ctx.createRadialGradient(tamanho / 2, tamanho / 2, 0, tamanho / 2, tamanho / 2, tamanho / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.18 * suavidade, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.12)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, tamanho, tamanho);
  const textura = new CanvasTexture(canvas);
  textura.colorSpace = SRGBColorSpace;
  cache.set(chave, textura);
  return textura;
};
