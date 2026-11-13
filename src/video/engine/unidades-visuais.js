// Objetos contáveis e persistentes: revelar quantidades e separar um todo.
// É um esquema editorial de dados, nunca uma reconstituição de lances reais.
export const SIMBOLOS_UNIDADE = ['bola', 'moeda', 'pessoa', 'caixa'];
const clamp = n => Math.max(0, Math.min(1, n));
const ease = n => { const p = clamp(n); return p * p * (3 - 2 * p); };

export function validarUnidades(el) {
  if (el.visual !== 'unidades' && el.forma !== 'decomposicao') return [];
  const erros = [];
  if (!SIMBOLOS_UNIDADE.includes(el.simbolo)) erros.push('unidades.simbolo: use bola, moeda, pessoa ou caixa.');
  if (!Array.isArray(el.itens) || !el.itens.every(i => i && Number.isInteger(i.valor) && i.valor >= 0 && i.valor <= 24)) {
    erros.push('unidades: cada valor deve ser inteiro de 0 a 24; não arredonde nem use um símbolo por múltiplo.');
  }
  if (el.forma === 'decomposicao') {
    if (Array.isArray(el.itens) && el.itens.some(i => i?.entra != null)) {
      erros.push('decomposicao: use separarEm para a ação; não defina entra nas partes do todo.');
    }
    const soma = Array.isArray(el.itens) ? el.itens.reduce((n, i) => n + (i?.valor ?? NaN), 0) : NaN;
    if (!Number.isInteger(el.total) || el.total < 1 || el.total > 24 || soma !== el.total) {
      erros.push('decomposicao.total: inteiro de 1 a 24, igual à soma das partes.');
    }
    if (typeof el.rotuloTotal !== 'string' || !el.rotuloTotal.trim() || el.rotuloTotal.length > 32) {
      erros.push('decomposicao.rotuloTotal: identifique o todo em até 32 caracteres.');
    }
    if (!(Number.isFinite(el.separarEm) && el.separarEm >= 0) && !(typeof el.separarEm === 'string' && el.separarEm.trim())) {
      erros.push('decomposicao.separarEm: indique segundos ou a palavra que separa o todo.');
    }
  }
  return erros;
}

function grade(i, quantidade, area) {
  const colunas = Math.min(4, Math.max(1, quantidade));
  const linhas = Math.max(1, Math.ceil(quantidade / colunas));
  const passo = Math.min(area.w / (colunas + .3), area.h / (linhas + .5), 155);
  const nestaLinha = Math.min(colunas, quantidade - Math.floor(i / colunas) * colunas);
  return { x: area.x + area.w / 2 + (i % colunas - (nestaLinha - 1) / 2) * passo,
    y: area.y + area.h / 2 + (Math.floor(i / colunas) - (linhas - 1) / 2) * passo,
    raio: passo * .38 };
}

export function estadoUnidades(el, estado, area, t, separarEm) {
  const { x0: x, y0: y, x1, y1 } = area, w = x1 - x, h = y1 - y;
  const decompor = el.forma === 'decomposicao';
  const fase = decompor ? ease((t - separarEm) / (el.dur ?? 1.1)) : 1;
  const n = el.itens.length, fila = (h - (decompor ? 100 : 0)) / n;
  const horizontal = w > h * 1.5;
  const cabecalho = decompor ? (horizontal ? 70 : 100) : 0;
  const grupos = el.itens.map((_, i) => horizontal
    ? { x: x + i * w / n + 12, y: y + cabecalho, w: w / n - 24, h: h - cabecalho }
    : { x: x + 20, y: y + cabecalho + i * (h - cabecalho) / n, w: w - 40, h: (h - cabecalho) / n });
  const alturaRotulo = horizontal ? 76 : 64;
  let indice = 0;
  const objetos = [];
  estado.itens.forEach((item, grupo) => {
    for (let j = 0; j < item.valor; j++, indice++) {
      const g = grupos[grupo];
      const destino = grade(j, item.valor, { x: g.x, y: g.y + alturaRotulo, w: g.w, h: g.h - alturaRotulo - 12 });
      const origem = decompor ? grade(indice, el.total, { x: x + 20, y: y + cabecalho + 20, w: w - 40, h: h - cabecalho - 40 }) : destino;
      // Toda a quantidade existe desde o início da decomposição. Só muda de lugar.
      // A direção pode distribuir a contagem pela frase inteira. O antigo
      // limite fixo encerrava qualquer quantidade em menos de um segundo.
      const dirigida = item.dur ?? el.dur;
      const transicao = dirigida == null ? .42 : item.valor === 1 ? dirigida : Math.min(.42, dirigida / 2);
      const intervalo = dirigida == null ? Math.min(.055, .45 / Math.max(1, item.valor))
        : Math.max(0, dirigida - transicao) / Math.max(1, item.valor - 1);
      const revelacao = decompor ? 1 : ease((t - item.em - j * intervalo) / transicao);
      objetos.push({ id: `unidade-${grupo}-${j}`, grupo,
        x: origem.x + (destino.x - origem.x) * fase,
        y: origem.y + (destino.y - origem.y) * fase + (decompor ? -Math.sin(fase * Math.PI) * 32 : (1 - revelacao) * 55),
        raio: origem.raio + (destino.raio - origem.raio) * fase,
        escala: decompor ? 1 : .65 + .35 * revelacao,
        opacidade: revelacao, rotacao: decompor ? fase * Math.PI * 2 : (1 - revelacao) * -.8 });
    }
  });
  return { objetos, fase, fila, grupos, horizontal };
}

function simbolo(ctx, tipo, obj, cor, fundo) {
  ctx.save(); ctx.translate(obj.x, obj.y); ctx.scale(obj.escala, obj.escala); ctx.rotate(obj.rotacao);
  const r = obj.raio;
  ctx.shadowColor = '#00000055'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 6;
  ctx.fillStyle = cor; ctx.strokeStyle = fundo; ctx.lineWidth = Math.max(2, r * .07);
  ctx.beginPath();
  if (tipo === 'caixa') ctx.roundRect(-r, -r, r * 2, r * 2, r * .15);
  else if (tipo === 'pessoa') { ctx.arc(0, -r * .65, r * .35, 0, Math.PI * 2); }
  else ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill(); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  if (tipo === 'bola') {
    ctx.fillStyle = fundo; ctx.beginPath();
    for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5 - Math.PI / 2;
      const px = Math.cos(a) * r * .39, py = Math.sin(a) * r * .39;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.closePath(); ctx.fill();
    for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5 - Math.PI / 2;
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * .38, Math.sin(a) * r * .38);
      ctx.lineTo(Math.cos(a) * r * .94, Math.sin(a) * r * .94); ctx.stroke(); }
  } else if (tipo === 'moeda') {
    ctx.beginPath(); ctx.arc(0, 0, r * .73, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-r * .15, -r * .35); ctx.lineTo(r * .15, r * .35); ctx.stroke();
  } else if (tipo === 'pessoa') {
    ctx.beginPath(); ctx.roundRect(-r * .58, -r * .12, r * 1.16, r * 1.18, r * .3); ctx.fill();
  } else {
    ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke();
  }
  ctx.restore();
}

export function pintarUnidades(ctx, el, estado, area, t, separarEm, marca, txt) {
  const a = estadoUnidades(el, estado, area, t, separarEm);
  const x = area.x0, y = area.y0, w = area.x1 - x;
  const decompor = el.forma === 'decomposicao';
  if (decompor) txt(`${el.rotuloTotal}: ${el.total}${el.unidade || ''}`, x + 20, y + 12, w - 40, a.horizontal ? 32 : 42);
  estado.itens.forEach((item, i) => {
    if (!decompor && t < item.em) return;
    ctx.globalAlpha = decompor ? a.fase : item.progresso;
    const tom = i === (el.foco ?? 0) ? marca.destaque : marca.frente;
    const g = a.grupos[i];
    txt(`${item.rotulo}: ${item.valor}`, g.x, g.y + 8, g.w, a.horizontal ? 30 : 38, tom);
  });
  for (const obj of a.objetos) {
    ctx.globalAlpha = obj.opacidade;
    const tom = obj.grupo === (el.foco ?? 0) ? marca.destaque : marca.frente;
    simbolo(ctx, el.simbolo, obj, tom, marca.fundo);
  }
  ctx.globalAlpha = 1;
  return a;
}
