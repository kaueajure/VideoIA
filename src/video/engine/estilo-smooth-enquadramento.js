// Composições verticais: o assunto ocupa o centro, a fala permanece abaixo.
// As versões horizontais continuam usando as composições próprias do estilo.
import { svgIcone, esc } from './estilo-smooth-kit.js';

function fala(k) {
  if (k.P.falaNaTela) k.fala('fr', { y: 1260 });
}

function camera(k, y = 800) {
  k.camera({ x: 540, y, zoom: 1, rx: 2, ry: -2 });
}

function itens(k) {
  return (k.e.itens || []).slice(0, 3).map(item => typeof item === 'string' ? { texto: item } : item);
}

function icone(k) {
  const { e, c } = k;
  const id = k.vic('ic', e.icone || 'estrela', { x: 290, y: 480, tam: 500, raio: 130 });
  k.entra(id, c.t, { y: 36 });
  k.medir(id, 'peca', 'icone', [290, 480, 790, 980]);
  const chips = (e.chips || []).slice(0, 3);
  chips.forEach((chip, i) => {
    const idChip = k.id(`ch${i}`), texto = String(chip.texto ?? chip);
    const largura = Math.min(760, 96 + texto.length * 22);
    const x = 540 - largura / 2, y = 1040 + i * 76;
    k.add(`<div class="sm-chip" id="${idChip}" style="left:${x}px;top:${y}px"><span class="sm-chip-in"><i>${svgIcone(chip.icone || 'check')}</i>${esc(texto)}</span></div>`);
    k.entra(idChip, k.w(chip.em, -.1, .3 + i * .2), { y: 18 });
    k.medir(idChip, 'texto', 'chip', [x, y, x + largura, y + 72]);
    k.som('pop', k.w(chip.em, 0, .3 + i * .2), .26);
  });
  k.pulsa(id, k.w(e.chave, 0, .5), { escala: 1.06 });
  fala(k); camera(k, 800);
  k.som('vidro', c.t + .05, .26); k.som('brilho', k.w(e.chave, 0, .5), .24);
  k.perto(e.icone || 'estrela');
}

function notificacao(k) {
  const lista = itens(k), unica = lista.length === 1;
  const altura = unica ? 600 : 660 / Math.max(1, lista.length) - 20;
  lista.forEach((item, i) => {
    const id = k.id(`n${i}`), y = 450 + i * (altura + 24);
    const entrada = i === 0 ? k.c.t : k.w(item.em, -.1, .2 + i * .25);
    k.add(`<div class="sm-vidro sm-notif" id="${id}" style="left:190px;top:${y}px;width:700px;height:${altura}px;${unica ? 'flex-direction:column;justify-content:center;text-align:center;gap:36px;padding:48px' : ''}"><i class="sm-notif-ic" style="${unica ? 'width:180px;height:180px;padding:38px;border-radius:48px' : ''}">${svgIcone(item.icone || 'bell')}</i><div><small>${esc(item.titulo ?? '')}</small>${esc(item.texto ?? '')}</div></div>`);
    k.entra(id, entrada, { y: -36 });
    k.medir(id, 'peca', 'notificacao', [190, y, 890, y + altura], { moldura: true });
    k.som(i % 2 ? 'notificacao-aguda' : 'notificacao', entrada + .05, .32);
  });
  fala(k); camera(k); k.perto('bell');
}

function calendario(k) {
  const { e, c } = k;
  const celulas = (Array.isArray(e.celulas) && e.celulas.length ? e.celulas : Array.from({ length: 15 }, (_, i) => String(i + 1))).slice(0, 21);
  const colunas = celulas.length > 15 ? 7 : 5;
  const escolhido = Math.max(0, Math.min(celulas.length - 1, Number.isFinite(Number(e.luz)) ? Number(e.luz) : Math.floor(celulas.length / 2)));
  if (e.titulo) {
    const titulo = k.numero('t', { y: 340, px: 100, ate: null, t: c.t, entra: c.t, classe: 'dst', medir: false });
    k.T.texto(titulo, -1, () => e.titulo);
    k.medir(titulo, 'texto', 'titulo', [140, 340, 940, 440]);
  }
  const id = k.id('cal');
  k.add(`<div class="sm-vidro sm-cal" id="${id}" style="left:170px;top:500px;width:740px;height:560px;grid-template-columns:repeat(${colunas},1fr)">${celulas.map((valor, i) => `<b id="${k.id('d' + i)}">${esc(valor)}</b>`).join('')}</div>`);
  k.entra(id, c.t, { y: 36 });
  k.medir(id, 'peca', 'calendario', [170, 500, 910, 1060]);
  const t = k.w(e.chave, 0, .5);
  if (e.marcaTodos) celulas.forEach((_, i) => k.T.tw(k.id('d' + i), t + i / 12, .01, null, { fundo: 'var-dst', cor: 'var-sobre' }, 'linear'));
  else k.T.tw(k.id('d' + escolhido), t, .4, null, { s: 1.08, fundo: 'var-dst', cor: 'var-sobre' }, 'fluida');
  if (e.chip) {
    const chip = k.id('chip');
    k.add(`<div class="sm-chip" id="${chip}" style="left:0;width:1080px;justify-content:center;top:1110px"><span class="sm-chip-in"><i>${svgIcone(e.chipIcone || 'bell')}</i>${esc(e.chip)}</span></div>`);
    k.entra(chip, k.w(e.chipEm, -.1, .75), { y: 24 });
    k.som('notificacao', k.w(e.chipEm, 0, .75), .32);
  }
  fala(k); camera(k, 810);
  k.som('clique', t, .34); k.som('vidro', c.t + .1, .24); k.perto(e.icone || 'calendario');
}

function lista(k) {
  const dados = itens(k), titulo = k.e.titulo;
  if (titulo) {
    const id = k.numero('t', { y: 340, px: 100, ate: null, t: k.c.t, entra: k.c.t, classe: 'dst', medir: false });
    k.T.texto(id, -1, () => titulo); k.medir(id, 'texto', 'titulo', [140, 340, 940, 440]);
  }
  const altura = (600 - Math.max(0, dados.length - 1) * 24) / Math.max(1, dados.length);
  const painel = k.id('painel');
  k.add(`<div class="sm-vidro" id="${painel}" style="left:170px;top:460px;width:740px;height:640px"></div>`);
  k.entra(painel, k.c.t, { y: 24 }); k.medir(painel, 'peca', 'painel-lista', [170, 460, 910, 1100], { moldura: true });
  dados.forEach((item, i) => {
    const id = k.id(`i${i}`), y = 480 + i * (altura + 24);
    const t = i === 0 ? k.c.t : k.w(item.em ?? item.texto?.split(' ')[0], -.25, .15 + i * .25);
    k.add(`<div class="sm-vidro sm-item" id="${id}" style="left:190px;top:${y}px;width:700px;height:${altura}px;${dados.length === 1 ? 'flex-direction:column;justify-content:center;text-align:center;gap:36px' : ''}"><b>${i + 1}</b><span>${esc(item.texto)}</span></div>`);
    k.entra(id, t, { x: i % 2 ? 24 : -24 });
    k.medir(id, 'peca', 'lista', [190, y, 890, y + altura]); k.som(i % 2 ? 'tique' : 'pop', t + .1, .28);
  });
  fala(k); camera(k); k.perto(k.e.icone || 'check');
}

function botao(k) {
  const { e, c } = k, id = k.id('card'), t = k.w(e.chave, 0, .55);
  k.add(`<div class="sm-vidro" id="${id}" style="left:190px;top:470px;width:700px;height:600px;padding:48px 50px"><div class="sm-vic" style="position:relative;width:160px;height:160px;border-radius:44px;margin:0 auto 34px"><i style="width:86px;height:86px">${svgIcone(e.icone || 'celular')}</i></div>${e.rotulo ? `<div class="sm-rot dst" style="position:relative;text-align:center">${esc(e.rotulo)}</div>` : ''}<div class="sm-botao" id="${k.id('bt')}" style="margin-top:40px">${esc(e.botao || 'Continuar')}</div></div>`);
  k.entra(id, c.t, { y: 36 }); k.medir(id, 'peca', 'botao', [190, 470, 890, 1070]);
  const y = e.rotulo ? 878 : 816;
  if (e.risca) {
    const risco = k.id('x');
    k.add(`<div class="sm-risco" id="${risco}" style="left:240px;top:${y}px;width:600px"></div>`);
    k.T.tw(risco, t, .34, { sx: 0 }, { sx: 1 }, 'fluida'); k.som('baque', t, .32);
  } else {
    k.mao('mao', { x: 540, y, t }); k.onda('onda', { x: 540, y, t: t + .02 });
    k.T.tw(k.id('bt'), t, .18, null, { s: .92 }, 'fluida');
    k.T.tw(k.id('bt'), t + .18, .3, null, { s: 1 }, 'pousa'); k.som('botao', t + .03, .32);
  }
  fala(k); camera(k); k.som('vidro', c.t + .1, .26); k.perto(e.icone || 'carrinho');
}

function titulo(k) {
  const id = k.id('titulo-painel'), texto = k.e.rotulo || k.ws.map(p => p.w).join(' ');
  k.add(`<div class="sm-vidro" id="${id}" style="left:190px;top:470px;width:700px;height:600px;padding:56px;display:flex;flex-direction:column;justify-content:center;gap:40px"><div style="font:700 72px/1.12 'SmGrotesk',sans-serif;color:var(--fr-cor);text-align:center;overflow-wrap:break-word">${esc(texto)}</div><div style="height:4px;width:160px;background:var(--dst-txt);margin:0 auto"></div></div>`);
  k.entra(id, k.c.t, { y: 24 }); k.medir(id, 'peca', 'titulo', [190, 470, 890, 1070]);
  // O título sintetiza a ideia; a narração continua nos tempos originais.
  k.fala('fr', { y: 1260 }); camera(k);
  k.som('subida', k.c.t, .24); k.som('baque', k.w(k.e.chave, 0, .45), .3);
}

function comparacao(k) {
  const lados = [k.e.a || {}, k.e.b || {}], tempos = [k.c.t, k.w(lados[1].em, 0, .55)];
  lados.forEach((lado, i) => {
    const id = k.id(i ? 'b' : 'a'), x = i ? 560 : 140;
    const numero = Number.isFinite(Number(lado.valor)) ? `<div class="sm-comp-n" id="${id}-n">0</div>` : '';
    k.add(`<div class="sm-vidro sm-comp ${k.e.vence === (i ? 'b' : 'a') ? 'vence' : ''}" id="${id}" style="left:${x}px;top:470px;width:380px;height:600px;padding:44px 28px;display:flex;flex-direction:column;justify-content:center"><div class="sm-vic" style="position:relative;width:140px;height:140px;border-radius:36px;margin:0 auto"><i style="width:78px;height:78px">${svgIcone(lado.icone || (i ? 'check' : 'x'))}</i></div><b>${esc(lado.rotulo ?? '')}</b>${numero}<small>${esc(lado.texto ?? '')}</small></div>`);
    k.entra(id, tempos[i], { y: 24 }); k.medir(id, 'peca', 'comparacao', [x, 470, x + 380, 1070]);
    if (i === 0) {
      k.T.set(id, -1, { x: 210 });
      k.T.tw(id, tempos[1] - .35, .7, { x: 210 }, { x: 0 }, 'macia');
      k.transito.push([tempos[1] - .4, tempos[1] + .65]);
    }
    if (numero) k.contador(`${id}-n`, tempos[i], { ate: Number(lado.valor), d: .6, prefixo: lado.prefixo ?? '', sufixo: lado.sufixo ?? '' });
    k.som('pop', tempos[i], .28);
  });
  fala(k); camera(k); k.perto(lados[1].icone || 'check');
}

function chat(k) {
  const { e, c } = k, painel = k.id('chat'), mensagem = k.id('mensagem');
  k.add(`<div class="sm-vidro" id="${painel}" style="left:190px;top:470px;width:700px;height:600px;padding:48px;display:flex;flex-direction:column;justify-content:center;gap:36px"><div style="display:flex;align-items:center;gap:28px"><i class="sm-notif-ic" style="display:block;width:130px;height:130px;padding:28px;flex:none">${svgIcone(e.icone || 'chat')}</i><b style="font:700 44px/1.2 'SmGrotesk',sans-serif">${esc(e.rotulo ?? '')}</b></div><div id="${mensagem}" style="font:600 44px/1.3 'SmInter',sans-serif;min-height:180px;overflow-wrap:break-word"></div></div>`);
  k.entra(painel, c.t, { y: 24 }); k.medir(painel, 'peca', 'chat', [190, 470, 890, 1070]);
  const t = k.w(e.chave, -.25, .35);
  k.digita(mensagem, t, String(e.texto ?? '')); k.som('notificacao', t, .3);
  fala(k); camera(k); k.perto(e.icone || 'chat');
}

function cta(k) {
  botao({ ...k, e: { ...k.e, icone: k.e.icone || 'chat' } });
}

export const FORMAS_RETRATO = { icone, notificacao, calendario, lista, botao, titulo, comparacao, chat, cta };
