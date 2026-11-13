// Mede quanto "acontece" num quadro: % da área principal (dentro da área segura, acima da
// legenda) com bordas/detalhes. É uma rede de segurança para tela VAZIA (palco + poeira dá
// ~0,1–0,3%); cenas boas ficam entre ~1% (silhuetas, céu liso) e 5%+. Quem julga a riqueza
// da cena é a leitura da folha de contato.
import {readFileSync} from 'node:fs';
import {PNG} from 'pngjs';
import {AREA_SEGURA, LEGENDA} from '../../src/kit/tema';

// Abaixo disso a prévia avisa "quadro quase vazio".
export const DENSIDADE_MINIMA = 0.8;

export const densidadeVisual = (arquivo: string): number => {
  const {width: w, data} = PNG.sync.read(readFileSync(arquivo));
  const k = w / 1080;
  const x0 = Math.round((AREA_SEGURA.esquerda + 12) * k);
  const x1 = Math.round((1080 - AREA_SEGURA.direita - 12) * k);
  const y0 = Math.round((AREA_SEGURA.topo + 40) * k);
  const y1 = Math.round((LEGENDA.centroY - 120) * k);
  const passo = Math.max(1, Math.round(2 * k));
  const luz = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  };
  let bordas = 0;
  let total = 0;
  for (let y = y0; y < y1 - passo; y += passo) {
    for (let x = x0; x < x1 - passo; x += passo) {
      const l = luz(x, y);
      if (Math.abs(l - luz(x + passo, y)) + Math.abs(l - luz(x, y + passo)) > 24) {
        bordas++;
      }
      total++;
    }
  }
  return total ? (bordas / total) * 100 : 0;
};
