import { validarMecanismo, estadoMecanismo, pintarMecanismo } from './mecanismos.js';
import { geoDaCena } from './geo.js';
import { partesSmooth, paletaSmooth } from './estilo-smooth.js';
import { validarUnidades, pintarUnidades } from './unidades-visuais.js';
import { validarCampo, pintarCampo, estadoCampo } from './campo-tatico.js';

// Composições declarativas do motor. Nenhum estado de animação sobrevive ao quadro.
export const FORMAS_RECURSO = ['comparacao', 'decomposicao', 'campo-tatico', 'linha-do-tempo', 'causa-efeito', 'documento', 'seguir-objeto', 'mecanismo'];
const clamp = n => Math.max(0, Math.min(1, n));
const suave = n => { const k = clamp(n); return k * k * (3 - 2 * k); };
const normalizar = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]/g, '');
const curto = (s, limite) => typeof s === 'string' && s.trim().length > 0 && s.length <= limite;

export function validarRecurso(el) {
  const erros = [];
  if (!FORMAS_RECURSO.includes(el.forma)) return ['recurso.forma: use ' + FORMAS_RECURSO.join(', ') + '.'];
  if (el.dur != null && !(Number.isFinite(el.dur) && el.dur > 0 && el.dur <= 30)) erros.push('recurso.dur: use segundos, de 0 a 30, sem zero.');
  if (el.entra != null && !(Number.isFinite(el.entra) && el.entra >= 0) && !curto(el.entra, 60)) erros.push('recurso.entra: use segundos ou uma palavra da fala.');
  if (el.visual != null && (el.forma !== 'comparacao' || el.visual !== 'unidades')) erros.push('recurso.visual: unidades é uma apresentação da comparação.');
  erros.push(...validarUnidades(el));
  if (el.forma === 'campo-tatico') erros.push(...validarCampo(el));
  if (['comparacao', 'decomposicao', 'linha-do-tempo', 'causa-efeito'].includes(el.forma)) {
    const limite = 3;
    if (!Array.isArray(el.itens) || el.itens.length < 2 || el.itens.length > limite) {
      erros.push(`recurso.itens: use de 2 a ${limite} itens.`);
    } else {
      for (const [i, item] of el.itens.entries()) {
        if (!item || !curto(item.rotulo, 32)) { erros.push(`item ${i + 1}: rotulo de até 32 caracteres.`); continue; }
        if (item.entra != null && !(Number.isFinite(item.entra) && item.entra >= 0) && !curto(item.entra, 60)) erros.push(`item ${i + 1}: entra precisa de segundos ou palavra.`);
        if (item.dur != null && !(Number.isFinite(item.dur) && item.dur > 0 && item.dur <= 30)) erros.push(`item ${i + 1}: dur deve ser maior que zero, até 30 segundos.`);
        if (el.forma === 'decomposicao' && item.dur != null) erros.push('decomposicao: dur pertence à separação do todo, não às partes.');
        if (['comparacao', 'decomposicao'].includes(el.forma) && !(Number.isFinite(item.valor) && item.valor >= 0 && item.valor <= 1e12)) erros.push(`item ${i + 1}: valor deve ser finito e não negativo, até 1 trilhão.`);
        if (el.forma === 'linha-do-tempo' && !curto(item.data, 18)) erros.push(`item ${i + 1}: data de até 18 caracteres.`);
      }
    }
    if (el.foco != null && !(Number.isInteger(el.foco) && el.foco >= 0 && el.foco < (el.itens?.length || 0))) erros.push('recurso.foco: índice de um item.');
    if (el.unidade != null && (typeof el.unidade !== 'string' || el.unidade.length > 12)) erros.push('recurso.unidade: até 12 caracteres.');
  }
  if (el.layout != null && !['vertical', 'horizontal'].includes(el.layout)) erros.push('recurso.layout: use vertical ou horizontal.');
  if (el.revelarLinhas != null && (el.forma !== 'documento' || el.arquivo || !Array.isArray(el.revelarLinhas)
      || el.revelarLinhas.length !== el.linhas?.length || el.revelarLinhas.some(t => !(Number.isFinite(t) && t >= 0) && !curto(t, 60)))) erros.push('documento.revelarLinhas: uma entrada em segundos ou palavra para cada linha.');
  if (el.forma === 'documento') {
    if (!curto(el.fonte, 70)) erros.push('documento.fonte: identifique a fonte em até 70 caracteres; registre a evidência em fontes.md.');
    if (el.arquivo) {
      if (!Array.isArray(el.area) || el.area.length !== 4 || !el.area.every(Number.isFinite)
        || el.area.some(n => n < 0 || n > 1) || el.area[2] <= 0 || el.area[3] <= 0
        || el.area[0] + el.area[2] > 1 || el.area[1] + el.area[3] > 1) erros.push('documento.area: [x, y, largura, altura] de 0 a 1, dentro da imagem.');
    } else {
      if (!Array.isArray(el.linhas) || !el.linhas.length || el.linhas.length > 4 || el.linhas.some(s => !curto(s, 42))) erros.push('documento.linhas: de 1 a 4 linhas de até 42 caracteres.');
      if (!Array.isArray(el.marcar) || !el.marcar.length || el.marcar.some(i => !Number.isInteger(i) || i < 0 || i >= (el.linhas?.length || 0))) erros.push('documento.marcar: índices das linhas a destacar.');
    }
  }
  if (el.forma === 'mecanismo') erros.push(...validarMecanismo(el));
  if (el.forma === 'seguir-objeto') {
    if (!curto(el.arquivo, 200)) erros.push('seguir-objeto.arquivo: imagem local do objeto.');
    if (!Array.isArray(el.trajeto) || el.trajeto.length < 2 || el.trajeto.length > 12
      || el.trajeto.some(p => !Array.isArray(p) || p.length !== 2 || p.some(n => !Number.isFinite(n) || Math.abs(n) > 3))) erros.push('seguir-objeto.trajeto: de 2 a 12 posições [x,y], de -3 a 3.');
    if (el.atrasoCamera != null && !(Number.isFinite(el.atrasoCamera) && el.atrasoCamera >= 0 && el.atrasoCamera <= .5)) erros.push('seguir-objeto.atrasoCamera: de 0 a 0,5 segundo.');
    if (el.zoom != null && !(Number.isFinite(el.zoom) && el.zoom >= 1 && el.zoom <= 1.6)) erros.push('seguir-objeto.zoom: de 1 a 1,6.');
  }
  return erros;
}

export function validarRecursosCena(cena) {
  const erros = [];
  for (const beat of cena.beats || []) {
    const recursos = (beat.elementos || []).filter(el => el.tipo === 'recurso');
    if (!recursos.length) continue;
    if (recursos.length !== 1 || beat.elementos.length !== 1 || beat.modelo) {
      erros.push(`${beat.id}: use um recurso por beat, sem modelo ou outros elementos; o título é opcional.`);
    }
    if (!['padrao', 'editorial', 'minimalista', 'papel', 'smooth', 'smooth-produto', 'smooth-estrategia', 'smooth-historia', 'smooth-vinheta', 'smooth-tipografia'].includes(beat.estilo || cena.estilo || 'padrao')) {
      erros.push(`${beat.id}: recurso visual requer um estilo base ou smooth.`);
    }
    for (const el of recursos) erros.push(...validarRecurso(el).map(e => `${beat.id}: ${e}`));
  }
  return erros;
}

export function instanteRecurso(entra, beat, palavras, padrao = beat.de) {
  if (Number.isFinite(entra)) return beat.de + entra;
  if (typeof entra !== 'string') return padrao;
  const [termo, numero = '1'] = entra.split('#');
  const ocorrencia = Number(numero);
  const recorte = Array.isArray(beat.palavras) ? palavras.slice(beat.palavras[0], beat.palavras[1] + 1) : palavras;
  const encontradas = recorte.filter(p => p.t >= beat.de - .15 && p.t < beat.ate && normalizar(p.w) === normalizar(termo));
  if (!Number.isInteger(ocorrencia) || ocorrencia < 1 || !encontradas[ocorrencia - 1]) {
    throw new Error(`${beat.id}: entrada do recurso "${entra}" não encontrada na fala deste beat.`);
  }
  return encontradas[ocorrencia - 1].t;
}

export function avaliarRecurso(el, beat, t, palavras = []) {
  // Os encaixes gerais do compilador podem antecipar um elemento para evitar
  // tela vazia. Uma entrada explícita do recurso pertence à direção autoral.
  const inicio = el.entra != null
    ? instanteRecurso(el.entra, beat, palavras) + (el.atraso || 0) : el.t0 ?? beat.de;
  const dur = el.dur ?? Math.max(.3, Math.min(1.2, beat.ate - inicio));
  const progresso = suave((t - inicio) / dur);
  const itens = (el.itens || []).map((item, i) => {
    const em = instanteRecurso(item.entra, beat, palavras, inicio + i * .4);
    const duracao = item.dur ?? el.dur ?? Math.min(dur, .7);
    return { ...item, em, duracao, progresso: suave((t - em) / duracao) };
  });
  if (el.forma === 'comparacao') {
    const max = Math.max(...itens.map(i => i.valor), 1e-12);
    for (const item of itens) item.fracao = item.valor / max * item.progresso;
  }
  const linhas = (el.revelarLinhas || []).map((entra, i) => {
    const em = instanteRecurso(entra, beat, palavras, inicio);
    return { rotulo: el.linhas[i], em, progresso: suave((t - em) / (el.dur ?? Math.min(dur, .7))) };
  });
  const estado = { visivel: t >= inicio, progresso, itens, linhas };
  if (el.forma === 'campo-tatico') estado.campo = estadoCampo(el, beat, t, inicio);
  if (el.forma === 'decomposicao') estado.separarEm = instanteRecurso(el.separarEm, beat, palavras);
  if (el.forma === 'mecanismo') { const m = estadoMecanismo(el,beat,t,inicio); estado.objeto = [...m.lua,m.fase,...m.pulsos]; }
  if (el.forma === 'seguir-objeto') {
    const posicao = tempo => {
      const q = suave((tempo - inicio) / (el.dur ?? Math.max(.3, beat.ate - inicio))) * (el.trajeto.length - 1);
      const i = Math.min(el.trajeto.length - 2, Math.floor(q)), k = q - i;
      return el.trajeto[i].map((n, eixo) => n + (el.trajeto[i + 1][eixo] - n) * k);
    };
    estado.objeto = posicao(t);
    estado.camera = posicao(t - (el.atrasoCamera ?? .12));
  }
  return estado;
}

function painelDaCena(spec, beat) {
  const geo = geoDaCena(spec);
  if (String(beat?.estilo || spec.estilo || '').startsWith('smooth')) {
    return geo.horizontal ? { x0: geo.util.x0 + 24, x1: geo.util.x1 - 24, y0: 270, y1: 740 }
      : { x0: 96, x1: 984, y0: 400, y1: 1160 };
  }
  const x0 = Math.max(geo.util.x0, geo.zona.lados) + 12;
  const x1 = Math.min(geo.util.x1, geo.W - geo.zona.lados) - 12;
  return { x0, x1, y0: (beat?.titulo ? geo.zona.cena : geo.zona.cenaLivre)[0] + 16, y1: geo.zona.cena[1] - 16 };
}
const linha = (ctx, x, y, dx, dy, cor, largura = 3) => {
  ctx.beginPath(); ctx.strokeStyle = cor; ctx.lineWidth = largura;
  ctx.moveTo(x, y); ctx.lineTo(dx, dy); ctx.stroke();
};
function caixa(ctx, x, y, w, h, cor, raio = 10) {
  ctx.beginPath(); ctx.fillStyle = cor; ctx.roundRect(x, y, Math.max(0, w), h, raio); ctx.fill();
}
function texto(ctx, valor, x, y, largura, tamanho, cor, problemas, maxLinhas = 2) {
  ctx.font = `600 ${tamanho}px Ilu, sans-serif`; ctx.fillStyle = cor;
  ctx.textBaseline = 'top'; ctx.textAlign = 'left';
  const linhas = [''];
  for (const palavra of String(valor).split(/\s+/)) {
    const indice = linhas.length - 1;
    const candidata = linhas[indice] ? linhas[indice] + ' ' + palavra : palavra;
    if (ctx.measureText(candidata).width > largura && linhas[indice]) linhas.push(palavra);
    else linhas[indice] = candidata;
  }
  if (linhas.length > maxLinhas || linhas.some(l => ctx.measureText(l).width > largura)) {
    problemas.push(`Texto não cabe no recurso: "${valor}". Encurte o texto.`);
  }
  linhas.forEach((l, i) => ctx.fillText(l, x, y + i * tamanho * 1.2));
}

function pintar(ctx, spec, beat, el, t, imagens) {
  const estado = avaliarRecurso(el, beat, t, spec.palavras || []);
  if (!estado.visivel) return null;
  if (el.forma !== 'decomposicao' && estado.itens.length && !estado.itens.some(item => t >= item.em)) return null;
  const area = painelDaCena(spec, beat), { x0: x, y0: y } = area;
  const w = area.x1 - x, h = area.y1 - y, geo = geoDaCena(spec);
  const fonte = geo.horizontal ? 32 : 38;
  let marca = spec.marca;
  if (String(beat.estilo || spec.estilo || '').startsWith('smooth')) {
    const parte = partesSmooth(spec).find(p => p.b.id === beat.id), paleta = paletaSmooth(spec.marca?.destaque);
    marca = parte?.claro ? { fundo: paleta.claro, frente: paleta.tinta, apoio: paleta.tinta3, sombra: paleta.claro2, destaque: paleta.dstClaro }
      : { fundo: paleta.escuro, frente: paleta.texto, apoio: paleta.claro2, sombra: paleta.escuro3, destaque: paleta.dst };
  }
  const cor = marca.frente, destaque = marca.destaque, apoio = marca.apoio;
  const problemas = [];
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  caixa(ctx, x, y, w, h, marca.fundo, 18);
  const txt = (s, tx, ty, tw = w - 48, tam = fonte, c = cor, max = 2) => texto(ctx, s, tx, ty, tw, tam, c, problemas, max);
  const n = estado.itens.length;
  let unidades, campo;
  if (el.forma === 'campo-tatico') {
    campo = pintarCampo(ctx, el, beat, t, el.entra != null
      ? instanteRecurso(el.entra, beat, spec.palavras) + (el.atraso || 0) : el.t0 ?? beat.de, area, marca, txt);
  } else if (el.forma === 'decomposicao' || el.visual === 'unidades') {
    unidades = pintarUnidades(ctx, el, estado, area, t, estado.separarEm, marca, txt);
  } else if (el.forma === 'mecanismo') {
    pintarMecanismo(ctx,el,beat,t,area,marca,txt,el.entra != null ? instanteRecurso(el.entra,beat,spec.palavras) + (el.atraso || 0) : el.t0 ?? beat.de);
  } else if (el.forma === 'comparacao') {
    const fila = h / n;
    estado.itens.forEach((item, i) => {
      if (t < item.em) return;
      const topo = y + i * fila + 8;
      // No horizontal os rótulos cabem numa linha; três filas também
      // precisam caber quando o @ reserva espaço no topo do vídeo.
      const barraY = topo + fonte * (geo.horizontal ? 1.6 : 2.5);
      const tom = (el.foco ?? 0) === i ? destaque : apoio;
      txt(item.rotulo, x + 20, topo, w - 40);
      const larguraBarra = w * .58;
      caixa(ctx, x + 20, barraY, larguraBarra, 24, marca.sombra, 4);
      // Zero é zero; valores pequenos não recebem uma largura fictícia.
      if (item.fracao > 0) caixa(ctx, x + 20, barraY, larguraBarra * item.fracao, 24, tom, 4);
      txt(item.valor.toLocaleString('pt-BR') + (el.unidade || ''), x + w * .65, barraY - 10, w * .33, fonte, tom);
    });
  } else if (el.forma === 'linha-do-tempo' || el.forma === 'causa-efeito') {
    if (el.layout === 'horizontal') {
      const passo = w / n, centro = y + h * .45;
      estado.itens.forEach((item, i) => {
        if (t < item.em) return;
        const ix = x + i * passo + 12, iw = passo - 24;
        ctx.globalAlpha = .35 + .65 * item.progresso;
        caixa(ctx, ix, centro - 42, iw, 5, i === (el.foco ?? n - 1) ? destaque : apoio, 2);
        if (el.forma === 'linha-do-tempo') txt(item.data, ix + 6, centro - fonte * 3, iw - 12, fonte * .85, apoio, 2);
        txt(item.rotulo, ix + 6, centro, iw - 12, fonte, cor, 3);
        ctx.globalAlpha = 1;
        if (i > 0) {
          const setaX = ix - 12, ponta = centro - 40;
          const fim = setaX - 8 + 14 * item.progresso;
          linha(ctx, setaX - 8, ponta, fim, ponta, destaque, 3);
          linha(ctx, fim, ponta, fim - 6, ponta - 6, destaque, 3);
          linha(ctx, fim, ponta, fim - 6, ponta + 6, destaque, 3);
        }
      });
    } else {
    const fila = h / n, eixo = x + 36;
    linha(ctx, eixo, y + 30, eixo, y + h - 40, marca.sombra, 4);
    estado.itens.forEach((item, i) => {
      if (t < item.em) return;
      const topo = y + fila * i + 12;
      caixa(ctx, eixo - 9, topo + 9, 18, 18, i === (el.foco ?? n - 1) ? destaque : apoio, 9);
      ctx.globalAlpha = .3 + .7 * item.progresso;
      if (el.forma === 'linha-do-tempo') {
        txt(item.data, eixo + 38, topo, w - 112, fonte, destaque, 1);
        txt(item.rotulo, eixo + 38, topo + fonte * 1.35, w - 112);
      } else {
        txt(item.rotulo, eixo + 38, topo + 3, w - 112);
        if (i < n - 1 && t >= estado.itens[i + 1].em) {
          const ponta = topo + 36 + (fila - 42) * estado.itens[i + 1].progresso;
          linha(ctx, eixo, topo + 36, eixo, ponta, destaque, 4);
          linha(ctx, eixo, ponta, eixo - 8, ponta - 12, destaque, 4);
          linha(ctx, eixo, ponta, eixo + 8, ponta - 12, destaque, 4);
        }
      }
      ctx.globalAlpha = 1;
    });
    }
  } else if (el.forma === 'documento') {
    const rodape = fonte * 2.8, altura = h - rodape;
    if (el.arquivo) {
      const img = imagens.get(el.src), k = Math.min((w - 40) / img.width, altura / img.height);
      const iw = img.width * k, ih = img.height * k, ix = x + (w - iw) / 2, iy = y + (altura - ih) / 2;
      ctx.drawImage(img, ix, iy, iw, ih);
      const [ax, ay, aw, ah] = el.area;
      ctx.globalAlpha = .3 * estado.progresso;
      caixa(ctx, ix + ax * iw, iy + ay * ih, aw * iw, ah * ih, destaque, 0);
      ctx.globalAlpha = 1;
    } else {
      el.linhas.forEach((s, i) => {
        const revelacao = estado.linhas[i];
        if (revelacao && t < revelacao.em) return;
        const progressoLinha = revelacao ? revelacao.progresso : estado.progresso;
        const ly = y + 16 + i * altura / el.linhas.length;
        if (el.marcar.includes(i)) {
          ctx.globalAlpha = .25 * progressoLinha;
          caixa(ctx, x + 14, ly - 4, (w - 28) * progressoLinha, fonte * 2.5, destaque, 4);
          ctx.globalAlpha = 1;
        }
        txt(s, x + 24, ly, w - 48);
      });
    }
    txt('FONTE: ' + el.fonte, x + 20, y + h - rodape + 8, w - 40, fonte * .8, apoio, 3);
  } else {
    const zoom = el.zoom ?? 1.2;
    const tela = ponto => [x + w / 2 + (ponto[0] - estado.camera[0]) * w * .22 * zoom,
      y + h / 2 + (ponto[1] - estado.camera[1]) * h * .22 * zoom];
    // As referências de mundo tornam visível o travelling em torno do objeto.
    for (let i = -4; i <= 4; i++) {
      const a = tela([i, -4]), b = tela([i, 4]), c = tela([-4, i]), d = tela([4, i]);
      linha(ctx, ...a, ...b, marca.sombra, 2); linha(ctx, ...c, ...d, marca.sombra, 2);
    }
    const [ox, oy] = tela(estado.objeto), img = imagens.get(el.src);
    const k = Math.min(w * .3 / img.width, h * .42 / img.height) * zoom;
    ctx.drawImage(img, ox - img.width * k / 2, oy - img.height * k / 2, img.width * k, img.height * k);
  }
  ctx.restore();
  return { ...area, tipo: 'recurso', forma: el.forma, id: el.id, problemas,
    valor: estado.progresso,
    movimento: campo ? [...campo.jogadores.map(j => j.atual), campo.bola] : unidades?.objetos || estado.objeto, camera: estado.camera,
    itens: [...estado.itens, ...estado.linhas].map(i => ({ rotulo: i.rotulo, em: i.em, fracao: i.fracao, progresso: i.progresso })) };
}

export function instalarRecursos(ilu) {
  const { carregar, quadro, capa, medir } = ilu;
  let spec, canvas, imagens = new Map();
  function desenhar(t) {
    if (!canvas) return [];
    const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);
    const beat = spec.beats.find(b => t >= b.de && t < b.ate);
    return (beat?.elementos || []).filter(el => el.tipo === 'recurso')
      .map(el => pintar(ctx, spec, beat, el, t, imagens)).filter(Boolean);
  }
  ilu.carregar = async (cena, opcoes) => {
    canvas?.remove(); canvas = null; imagens = new Map(); spec = cena;
    const elementos = cena.beats.flatMap(b => (b.elementos || []).filter(e => e.tipo === 'recurso'));
    const erros = elementos.flatMap(validarRecurso);
    if (erros.length) throw new Error(erros.join(' '));
    const info = await carregar(cena, opcoes);
    if (!elementos.length) return info;
    await Promise.all([...new Set(elementos.filter(e => e.arquivo).map(e => e.src))].map(async src => {
      if (!src?.startsWith('data:image/')) throw new Error('Recurso visual sem imagem preparada.');
      const img = new Image(); img.src = src; await img.decode(); imagens.set(src, img);
    }));
    const raiz = document.getElementById('raiz');
    canvas = document.createElement('canvas'); canvas.id = 'recursos-visuais';
    canvas.width = raiz.clientWidth; canvas.height = raiz.clientHeight;
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:50';
    raiz.insertBefore(canvas, document.getElementById('traco'));
    desenhar(0);
    return info;
  };
  ilu.quadro = t => { const r = quadro(t); desenhar(t); return r; };
  ilu.capa = (t, ...args) => { const r = capa(t, ...args); desenhar(t); return r; };
  ilu.medir = (t, opcoes) => {
    const medida = medir(t, opcoes), recursos = desenhar(t);
    medida.recursos = recursos;
    medida.tracos.push(...recursos);
    return medida;
  };
}
