import { isDeepStrictEqual } from 'node:util';

// Só o encaixe pode mudar sozinho. Texto, dados, ativos e intenção são autoria.
const ENCAIXE = new Set(['pos', 'escala', 'fator', 'tamanho', 'largura', 'altura']);
const TEMPOS_COMPILADOS = new Set(['entra', 'atraso', 't0', 'tConta']);
function conteudo(elemento, compilado) {
  return Object.fromEntries(Object.entries(elemento).filter(([chave]) =>
    !ENCAIXE.has(chave) && !(compilado && TEMPOS_COMPILADOS.has(chave))));
}
const contem = (esperado, atual) => esperado && typeof esperado === 'object'
  ? atual && typeof atual === 'object' && Object.entries(esperado)
    .every(([chave, valor]) => contem(valor, atual[chave]))
  : isDeepStrictEqual(esperado, atual);

export function beatProtegido(cena, beat) {
  return cena.automatica !== true || beat.protegido === true
    || (beat.elementos || []).some(el => el.essencial === true);
}

export function conferirStoryboard(antes, depois, { compilado = false, protegerTudo = false } = {}) {
  const falhas = [];
  for (const beat of antes.beats || []) {
    // A compilação expande modelos, logos e outros atalhos. Nesse limite,
    // garantias explícitas usam ids; o reparo de autoria protege tudo por padrão.
    const inteiro = protegerTudo || beat.protegido === true || (!compilado && antes.automatica !== true);
    const essenciais = (beat.elementos || []).filter(el => inteiro || el.essencial === true);
    if (!inteiro && !essenciais.length) continue;
    const candidatos = (depois.beats || []).filter(b => b.id === beat.id);
    if (candidatos.length !== 1) {
      falhas.push(`${beat.id}: beat protegido removido, dividido ou duplicado.`);
      continue;
    }
    const atual = candidatos[0];
    if (inteiro) {
      for (const campo of ['titulo', 'sujeito', 'modelo', 'camera', 'palavras', 'frases', 'em']) {
        if (beat[campo] !== undefined && !(compilado
          ? contem(beat[campo], atual[campo]) : isDeepStrictEqual(beat[campo], atual[campo]))) {
          falhas.push(`${beat.id}: ${campo} protegido foi alterado.`);
        }
      }
    }
    const disponiveis = [...(atual.elementos || [])];
    for (const el of essenciais) {
      const assinatura = conteudo(el, compilado);
      const indice = disponiveis.findIndex(e => el.id && e.id !== el.id ? false
        : compilado ? contem(assinatura, conteudo(e, true))
          : isDeepStrictEqual(assinatura, conteudo(e, false)));
      if (indice < 0) falhas.push(`${beat.id}: elemento protegido ${el.id || el.forma || el.tipo} removido ou alterado.`);
      else disponiveis.splice(indice, 1);
    }
  }
  return falhas;
}

export function tentarReparoStoryboard(cena, reparar) {
  const candidata = structuredClone(cena);
  const alterou = !!reparar(candidata);
  const falhas = conferirStoryboard(cena, candidata);
  return { cena: falhas.length ? cena : candidata, alterou: alterou && !falhas.length, falhas };
}
