// Diagnóstico de planejamento e repetição, sem atribuir nota artística automática.
import { analisarRitmoVisual } from './ritmo-visual.mjs';

export const MARCA_DIRECAO_CRIATIVA = '<!-- direcao-criativa:v2 -->';
const FUNCOES = new Set(['gancho', 'contexto', 'evidencia', 'comparacao', 'mecanismo', 'consequencia', 'sintese', 'cta']);
const texto = valor => typeof valor === 'string' && valor.trim().length > 0;
const somenteTexto = el => ['titulo', 'legenda'].includes(el.tipo)
  || (el.tipo === 'smooth' && ['titulo', 'frase'].includes(el.forma));
const interfaceSimbolica = el => el.tipo === 'smooth'
  && ['icone', 'botao', 'notificacao', 'chat'].includes(el.forma);
const assinatura = beat => (beat.elementos || [])
  .filter(el => !['titulo', 'legenda', 'traco'].includes(el.tipo))
  .map(el => [el.tipo, el.forma || '', el.layout || ''].join(':')).sort().join('|');

// Entrar com fade, mudar a legenda ou mover a câmera não anima o conteúdo
// de um gráfico rasterizado. Avaliar a duração real, não o número de cortes.
export function analisarMontagem(cena, spec) {
  const trechos = [], alertas = [], falhas = [];
  const planos = (spec.beats || []).map(b => {
    const original = cena.beats.find(o => o.id === b.id);
    const els = b.elementos || [];
    const imagens = els.filter(e => e.tipo === 'imagem');
    const soImagem = imagens.length > 0 && els.every(e => e.tipo === 'imagem' || somenteTexto(e));
    const arquivos = imagens.map(e => e.arquivo || e.src || '').sort();
    const vetores = soImagem && imagens.every(e => /\.svg(?:$|[?#])/i.test(e.arquivo || '') || /^data:image\/svg\+xml/.test(e.src || ''));
    return { beat: b.id, de: b.de, ate: b.ate, soImagem, vetores,
      assinatura: soImagem ? arquivos.join('|') : '', funcao: original?.direcao?.funcao };
  });
  for (let i = 0; i < planos.length;) {
    if (!planos[i].soImagem) { i++; continue; }
    let fim = i + 1;
    while (fim < planos.length && planos[fim].soImagem && planos[fim].assinatura === planos[i].assinatura) fim++;
    const duracao = planos[fim - 1].ate - planos[i].de;
    if (fim - i >= 2 && duracao >= 6) {
      const trecho = { tipo: 'imagem-congelada', beats: planos.slice(i, fim).map(p => p.beat),
        de: planos[i].de, ate: planos[fim - 1].ate, duracao,
        motivo: 'A mesma imagem ocupa a sequência; legenda, título e entrada não demonstram mudança dentro dela.' };
      trechos.push(trecho); alertas.push(trecho);
    }
    i = fim;
  }
  for (let i = 0; i < planos.length;) {
    if (!planos[i].vetores) { i++; continue; }
    let fim = i + 1;
    while (fim < planos.length && planos[fim].vetores) fim++;
    const duracao = planos[fim - 1].ate - planos[i].de;
    if (fim - i >= 3 && duracao >= 10) {
      const ids = planos.slice(i, fim).map(p => p.beat);
      falhas.push(`${ids.join(', ')}: ${duracao.toFixed(1)} s de ilustrações SVG estáticas em sequência. Implemente a transformação com recurso, peça ou vídeo; exportar gráficos como imagens não implementa a animação.`);
    }
    i = fim;
  }
  const total = planos.reduce((n, p) => n + Math.max(0, p.ate - p.de), 0);
  const imagens = planos.filter(p => p.soImagem).reduce((n, p) => n + Math.max(0, p.ate - p.de), 0);
  const ritmo = analisarRitmoVisual(cena, spec);
  alertas.push(...ritmo.alertas);
  return { falhas, alertas, trechos, segundosImagem: imagens, duracao: total,
    proporcaoImagem: total ? imagens / total : 0, ritmo };
}

export function analisarDirecaoCriativa(cena, spec, { exigir = false } = {}) {
  if (!exigir && cena.direcao?.versao !== 2) return null;
  const falhas = [], alertas = [];
  if (cena.direcao?.versao !== 2) falhas.push('Novos vídeos exigem direcao.versao: 2; consulte docs/producao-criativa.md.');
  for (const campo of ['pergunta', 'resposta']) {
    if (!texto(cena.direcao?.[campo])) falhas.push(`Falta direcao.${campo}: defina a pergunta e o que o vídeo entrega.`);
  }
  const cenas = (cena.beats || []).map((beat, i, beats) => {
    const d = beat.direcao || {};
    const efetivo = spec.beats.find(b => b.id === beat.id);
    const elementos = efetivo?.elementos || [];
    if (!FUNCOES.has(d.funcao)) falhas.push(`${beat.id}: direcao.funcao inválida ou ausente.`);
    if (!texto(d.ganhoVisual)) falhas.push(`${beat.id}: descreva direcao.ganhoVisual, o que a imagem acrescenta à fala.`);
    const chaves = d.elementosChave;
    const idsChave = Array.isArray(chaves) ? chaves : [];
    if (!Array.isArray(chaves) || !chaves.length || chaves.some(id => !texto(id))) {
      falhas.push(`${beat.id}: direcao.elementosChave precisa indicar ids executáveis.`);
    } else {
      for (const id of chaves) {
        if (!elementos.some(el => el.id === id)) falhas.push(`${beat.id}: elemento-chave ${id} ausente no plano efetivo.`);
      }
    }
    if (d.continuaDe !== null) {
      const anterior = beats[i - 1];
      if (!anterior || d.continuaDe !== anterior.id) {
        falhas.push(`${beat.id}: continuidade exige continuaDe: null para corte ou o id do beat anterior.`);
      } else {
        const anteriorEfetivo = spec.beats.find(b => b.id === anterior.id);
        if (!idsChave.some(id => elementos.some(el => el.id === id)
            && anteriorEfetivo?.elementos.some(el => el.id === id))) {
          falhas.push(`${beat.id}: continuidade declarada sem elemento-chave compartilhado com ${anterior.id}.`);
        }
      }
    }
    if (elementos.length && elementos.every(somenteTexto)) {
      alertas.push({ tipo: 'somente-texto', beats: [beat.id],
        motivo: 'Confira se o texto é a evidência ou apenas repete a narração; planeje uma demonstração quando ajudar.' });
    }
    if (['evidencia', 'mecanismo', 'consequencia'].includes(d.funcao)
        && elementos.some(interfaceSimbolica) && elementos.every(el => interfaceSimbolica(el) || somenteTexto(el))) {
      alertas.push({ tipo: 'interface-como-ilustracao', beats: [beat.id],
        motivo: 'Confira se a interface executa a ação ou mostra evidência real. Um botão, mensagem ou ícone temático pode apenas decorar a fala.' });
    }
    return { beat: beat.id, ...d, assinatura: assinatura(efetivo || {}),
      conferirEm: efetivo ? [efetivo.de, (efetivo.de + efetivo.ate) / 2, Math.max(efetivo.de, efetivo.ate - 1 / 30)] : [] };
  });
  for (let i = 0; i < cenas.length;) {
    let fim = i + 1;
    while (fim < cenas.length && cenas[fim].assinatura === cenas[i].assinatura) fim++;
    if (cenas[i].assinatura && fim - i >= 3) alertas.push({ tipo: 'composicao-repetida',
      beats: cenas.slice(i, fim).map(b => b.beat),
      motivo: 'Mesma família de composição em sequência. Confira se os estados progridem; não troque formas só para variar.' });
    i = fim;
  }
  const montagem = analisarMontagem(cena, spec);
  falhas.push(...montagem.falhas); alertas.push(...montagem.alertas);
  return { falhas, alertas, cenas, montagem, revisao: 'pendente',
    limite: 'Valida o planejamento e localiza riscos. Só os quadros e a reprodução com som comprovam ação, ritmo e ganho explicativo.' };
}
