// Esquema editorial. As posições não pretendem reconstruir uma partida real.
const ponto = p => Array.isArray(p) && p.length === 2 && p.every(n => Number.isFinite(n) && n >= 0 && n <= 1);
const suave = t => { const p = Math.max(0, Math.min(1, t)); return p * p * (3 - 2 * p); };
export function validarCampo(el) {
  const erros = [];
  if (!Array.isArray(el.jogadores) || el.jogadores.length < 2 || el.jogadores.length > 8) return ['campo-tatico.jogadores: de 2 a 8 jogadores.'];
  const ids = new Set();
  for (const j of el.jogadores) {
    if (!j || typeof j.id !== 'string' || !j.id || ids.has(j.id)) { erros.push('campo-tatico: id único por jogador.'); continue; }
    ids.add(j.id);
    if (!ponto(j.pos) || j.destino != null && !ponto(j.destino)) erros.push('campo-tatico: pos e destino são [x,y] entre 0 e 1.');
    if (!['a', 'b'].includes(j.time)) erros.push('campo-tatico: time deve ser a ou b.');
    if (typeof j.rotulo !== 'string' || !j.rotulo.trim() || j.rotulo.length > 14) erros.push('campo-tatico: rotulo de até 14 caracteres.');
    if (j.destino && !(Number.isFinite(j.moverEm) && j.moverEm >= 0)) erros.push('campo-tatico.moverEm: segundos a partir do beat.');
    if (j.dur != null && !(Number.isFinite(j.dur) && j.dur > 0 && j.dur <= 10)) erros.push('campo-tatico.dur: maior que zero, até 10 segundos.');
  }
  if (!Array.isArray(el.passes) || el.passes.length < 1 || el.passes.length > 6) return [...erros, 'campo-tatico.passes: de 1 a 6 passes.'];
  let ultimo = -1, fim = -1, receptor;
  for (const p of el.passes) {
    if (!p || !ids.has(p.de) || !ids.has(p.para) || p.de === p.para) { erros.push('campo-tatico: passe exige de e para com jogadores distintos existentes.'); continue; }
    if (!(Number.isFinite(p.em) && p.em >= 0) || p.em < ultimo || p.em < fim) erros.push('campo-tatico: passes em segundos, ordenados e sem sobreposição.');
    if (!(Number.isFinite(p.dur) && p.dur >= .3 && p.dur <= 5)) erros.push('campo-tatico: duração de passe entre 0,3 e 5 segundos.');
    if (receptor && p.de !== receptor) erros.push('campo-tatico: a bola precisa sair de quem recebeu o passe anterior.');
    ultimo = p.em; fim = p.em + p.dur; receptor = p.para;
  }
  return erros;
}

export function estadoCampo(el, beat, t, inicio = beat.de) {
  const posicao = (j, tempo) => {
    const k = j.destino ? suave((tempo - beat.de - j.moverEm) / (j.dur ?? 1)) : 0;
    return j.pos.map((v, i) => v + ((j.destino || j.pos)[i] - v) * k);
  };
  const jogadores = el.jogadores.map(j => ({ ...j, atual: posicao(j, t) }));
  const jogador = id => el.jogadores.find(j => j.id === id);
  const primeiro = el.passes[0];
  let bola = posicao(jogador(primeiro.de), t), ativo = primeiro.de;
  const rastros = [];
  for (const p of el.passes) {
    const em = beat.de + p.em;
    if (t < em) break;
    const k = suave((t - em) / p.dur);
    const a = posicao(jogador(p.de), em), b = posicao(jogador(p.para), em + p.dur);
    if (t < em + p.dur) { bola = a.map((n, i) => n + (b[i] - n) * k); ativo = null; }
    else { bola = posicao(jogador(p.para), t); ativo = p.para; }
    rastros.push({ de: a, para: b, progresso: k });
  }
  return { jogadores, bola, ativo, rastros, visivel: t >= inicio };
}

export function pintarCampo(ctx, el, beat, t, inicio, area, marca, txt) {
  const estado = estadoCampo(el, beat, t, inicio);
  const x = area.x0 + 44, y = area.y0 + 65, w = area.x1 - area.x0 - 88, h = area.y1 - area.y0 - 110;
  const tela = p => [x + 45 + p[0] * (w - 90), y + 36 + p[1] * (h - 72)];
  const reta = (a, b) => { ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); };
  txt('ESQUEMA ILUSTRATIVO', x, area.y0 + 12, w, 26, marca.apoio, 1);
  ctx.fillStyle = marca.sombra; ctx.beginPath(); ctx.roundRect(x, y, w, h, 18); ctx.fill();
  ctx.strokeStyle = marca.apoio; ctx.lineWidth = 3; ctx.stroke();
  reta([x, y + h / 2], [x + w, y + h / 2]);
  ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) * .17, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeRect(x + w * .28, y, w * .44, h * .16);
  ctx.strokeRect(x + w * .28, y + h * .84, w * .44, h * .16);
  ctx.save(); ctx.strokeStyle = marca.destaque; ctx.lineWidth = 5; ctx.setLineDash([10, 10]);
  for (const r of estado.rastros) {
    const a = tela(r.de), b = tela(r.para);
    reta(a, a.map((v, i) => v + (b[i] - v) * r.progresso));
  }
  ctx.restore();
  for (const j of estado.jogadores) {
    const [jx, jy] = tela(j.atual), raio = Math.min(34, h * .07);
    ctx.save(); ctx.shadowColor = '#00000066'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 5;
    ctx.fillStyle = j.time === 'a' ? marca.destaque : marca.frente;
    ctx.beginPath(); ctx.arc(jx, jy, raio, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    if (estado.ativo === j.id) {
      ctx.strokeStyle = marca.destaque; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(jx, jy, raio + 10, 0, Math.PI * 2); ctx.stroke();
    }
    const ly = jy + raio + 68 > area.y1 ? jy - raio - 62 : jy + raio + 10;
    txt(j.rotulo, Math.max(area.x0 + 4, Math.min(area.x1 - 168, jx - 82)), ly, 164, 24, marca.frente, 2);
  }
  const [bx, by] = tela(estado.bola);
  ctx.fillStyle = marca.frente; ctx.strokeStyle = marca.fundo; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(bx + 18, by - 22, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  return estado;
}
