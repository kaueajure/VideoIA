import { GEO } from './zona.js';
import { esc, fmtBR } from './estilo-smooth-kit.js';

export function serieNumerica(valores) {
  if (!Array.isArray(valores) || valores.length < 2 || valores.some(v =>
    v == null || typeof v === 'boolean' || String(v).trim() === '' || !Number.isFinite(Number(v)))) {
    throw new Error('Gráfico precisa de pelo menos dois valores numéricos explícitos.');
  }
  return valores.map(Number);
}

// A largura representa o dado; rótulo e valor ficam fora dela, inclusive em zero.
export function barrasProporcionais(k) {
  const { e, c } = k;
  const itens = (e.itens || []).slice(0, 3);
  const valores = itens.map(item => Number(item.valor));
  if (!valores.length || valores.some(v => !Number.isFinite(v) || v < 0)) {
    throw new Error('Barras precisam de valores finitos e não negativos.');
  }
  const maximo = Math.max(...valores, 1e-12);
  const x = GEO.horizontal ? -160 : 140, largura = GEO.horizontal ? 1400 : 800;
  const topo = 440, passo = 200;
  e.rotulo && k.rotulo('ex', e.rotulo, { x, y: 340, larg: largura, alinhar: 'left' });
  itens.forEach((item, i) => {
    const id = k.id(`barra${i}`), fill = k.id(`fill${i}`), y = topo + i * passo;
    const valor = valores[i], larguraDado = largura * valor / maximo;
    const textoValor = `${item.prefixo || ''}${fmtBR(valor, item.casas ?? (Number.isInteger(valor) ? 0 : 1))}${item.sufixo || ''}`;
    k.add(`<div id="${id}" data-sm-bar-row style="position:absolute;left:${x}px;top:${y}px;width:${largura}px;height:160px;color:var(--fr-cor)">
      <div style="display:flex;justify-content:space-between;gap:24px;align-items:baseline;font:600 34px/1.2 'SmInter',sans-serif">
        <span>${esc(item.rotulo || '')}</span><b style="font:700 54px/1 'SmGrotesk',sans-serif">${esc(textoValor)}</b>
      </div>
      <div class="sm-barra-trilho" style="position:absolute;left:0;top:76px;width:${largura}px;height:64px;background:color-mix(in srgb,var(--fr-cor) 12%,transparent);border-radius:8px">
        <div id="${fill}" data-sm-bar-fill style="width:${larguraDado}px;height:64px;background:var(--dst-txt);border-radius:8px;transform-origin:left center"></div>
      </div>
    </div>`);
    const em = k.w(item.em ?? String(item.valor), -.1, .15 + i * .2);
    k.T.tw(id, em, .3, { o: 0, y: 12 }, { o: 1, y: 0 }, 'fluida');
    k.T.tw(fill, em, .55, { sx: 0 }, { sx: 1 }, 'fluida');
    k.medir(id, 'peca', 'barras', [x, y, x + largura, y + 160]);
    k.som('tique', em, .2);
  });
  if (e.total != null) {
    const t = k.w(e.totalEm ?? null, -.1, .65);
    k.numero('tot', { y: topo + itens.length * passo + 10, px: 120, ate: Number(e.total), de: Number(e.total),
      t, prefixo: e.prefixo || '', sufixo: e.sufixo || '', casas: e.casas || 0 });
  }
  k.P.falaNaTela && k.fala('fr', {});
  k.camera({ x: 540, y: 800, zoom: 1, rx: 2, ry: -2 });
}
