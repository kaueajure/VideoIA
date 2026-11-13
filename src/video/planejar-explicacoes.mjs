import { validarRecursosCena } from './engine/recursos-visuais.js';

export const ESTILOS_EXPLICATIVOS = new Set(['padrao', 'editorial', 'minimalista', 'papel',
  'smooth', 'smooth-produto', 'smooth-estrategia', 'smooth-historia', 'smooth-vinheta', 'smooth-tipografia']);
const normal = s => String(s).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const limpar = s => s.trim().replace(/[.,;:!?]+$/g, '').trim();
const curtas = textos => textos.every(t => t && t.length <= 32);
const unidades = { gol: 'gols', gols: 'gols', ponto: 'pontos', pontos: 'pontos', real: 'reais', reais: 'reais',
  minuto: 'min', minutos: 'min', segundo: 's', segundos: 's', metro: 'm', metros: 'm',
  quilometro: 'km', quilometros: 'km', km: 'km', quilo: 'kg', quilos: 'kg', kg: 'kg',
  pessoa: 'pessoas', pessoas: 'pessoas', voto: 'votos', votos: 'votos', titulo: 'títulos', titulos: 'títulos' };
const numeros = { zero: 0, um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7,
  oito: 8, nove: 9, dez: 10, onze: 11, doze: 12, treze: 13, catorze: 14, quatorze: 14, quinze: 15,
  dezesseis: 16, dezessete: 17, dezoito: 18, dezenove: 19, vinte: 20, trinta: 30, quarenta: 40,
  cinquenta: 50, sessenta: 60, setenta: 70, oitenta: 80, noventa: 90, cem: 100, cento: 100,
  duzentos: 200, trezentos: 300, quatrocentos: 400, quinhentos: 500, seiscentos: 600,
  setecentos: 700, oitocentos: 800, novecentos: 900 };

function numero(texto) {
  const t = normal(texto).trim();
  // Subconjunto deliberado. Recusar ambiguidade é melhor que inventar uma escala.
  if (/^\d+(?:,\d+)?$/.test(t)) return Number(t.replace(',', '.'));
  if (Object.hasOwn(numeros, t)) return numeros[t];
  const partes = t.split(' e ');
  if (partes.length > 1 && partes.every(p => Object.hasOwn(numeros, p))) {
    const ns = partes.map(p => numeros[p]);
    if (ns.every((n, i) => i === 0 || n < ns[i - 1]) && ns[0] >= 20) return ns.reduce((a, b) => a + b, 0);
  }
  return null;
}

function dado(texto) {
  const m = /^(.+?)\s+(?:marcou|fez|tem|teve|recebeu|somou|mede|pesa|custou|custa|levou)\s+(.+?)\s+(\S+)$/iu.exec(limpar(texto));
  if (!m || !curtas([m[1]]) || /\b(nao|nunca|talvez|se|pode|poderia|menos|mais|cerca|entre|ate|quase)\b/.test(normal(m[1]))) return null;
  const valor = numero(m[2]), unidade = unidades[normal(m[3])];
  return valor == null || !Number.isFinite(valor) || valor < 0 || valor > 1e12 || !unidade
    ? null : { rotulo: m[1], valor, unidade };
}

function marco(texto) {
  const m = /^Em\s+((?:19|20)\d{2}),?\s+(.+)$/iu.exec(limpar(texto));
  return m && curtas([m[2]]) ? { data: m[1], rotulo: m[2] } : null;
}

const palavrasDoBeat = (beat, palavras) => palavras.slice(beat.palavras[0], beat.palavras[1] + 1);
const falaDoBeat = (beat, palavras) => palavrasDoBeat(beat, palavras).map(p => p.w).join(' ');
const preservado = beat => beat.protegido === true || beat.sujeito || beat.direcao
  || (beat.elementos || []).some(e => e.essencial || e.arquivo || e.tipo === 'recurso' || e.tipo === 'video');

export function instalarExplicacao(beat, recurso, estilo) {
  const el = { ...structuredClone(recurso), tipo: 'recurso', id: recurso.id || `${beat.id}-explicacao`,
    essencial: recurso.essencial ?? true, entra: recurso.entra ?? 0 };
  const candidata = { estilo, beats: [{ ...beat, modelo: undefined, titulo: undefined, elementos: [el] }] };
  const erros = validarRecursosCena(candidata);
  if (erros.length) throw new Error(erros.join(' '));
  beat.elementos = [el];
  for (const campo of ['modelo', 'titulo', 'cenario', '_ff', '_cand', '_formas']) delete beat[campo];
  beat.camera = { plano: 'normal', mov: 'nenhum' };
  return el;
}

// Só chamado ao criar um autoplano novo. Não relê nem reescreve cenas autorais.
// A fala fornece os dados e a relação; evidência factual ainda passa pelo registro.
export function planejarExplicacoes(cena, palavras) {
  const escolhas = [];
  if (!ESTILOS_EXPLICATIVOS.has(cena.estilo || 'padrao')) return escolhas;
  const textos = cena.beats.map(b => falaDoBeat(b, palavras));
  for (const [i, beat] of cena.beats.entries()) {
    if (preservado(beat) || !Array.isArray(beat.palavras)) continue;
    // Não converter a pergunta (ou sua premissa) em um dado afirmado no gráfico.
    if (/\?/.test(textos[i]) || /\?/.test(textos[i - 1] || '')) continue;
    const texto = limpar(textos[i]);
    const anterior = i ? limpar(textos[i - 1]) : '';
    const ws = palavrasDoBeat(beat, palavras);
    const entradaDoTrecho = trecho => {
      const posicao = texto.indexOf(trecho);
      const indice = texto.slice(0, Math.max(0, posicao)).trim().split(/\s+/).filter(Boolean).length;
      return Math.max(0, (ws[indice]?.t ?? ws[0].t) - ws[0].t);
    };
    let recurso, motivo;
    // Duas afirmações completas, na mesma unidade, no beat ou na vizinha anterior.
    const clausulas = texto.split(/[.;!?]\s+|,?\s+enquanto\s+/iu).map(limpar).filter(Boolean);
    let pares = clausulas.slice(0, 2).map(dado);
    if (clausulas.length > 2 && dado(clausulas[2])) pares = [];
    let deAnterior = false;
    if (!pares.every(Boolean) || pares.length !== 2) {
      pares = [dado(anterior), dado(texto)]; deAnterior = true;
    }
    if (pares.every(Boolean) && pares.length === 2 && pares[0].unidade === pares[1].unidade
        && normal(pares[0].rotulo) !== normal(pares[1].rotulo)) {
      const segunda = deAnterior ? 0 : texto.indexOf(clausulas[1]);
      const indice = texto.slice(0, segunda).trim().split(/\s+/).filter(Boolean).length;
      recurso = { forma: 'comparacao', unidade: ' ' + pares[0].unidade,
        itens: pares.map((p, j) => ({ rotulo: p.rotulo, valor: p.valor,
          entra: j ? deAnterior ? .15 : Math.max(0, (ws[indice]?.t ?? ws[0].t) - ws[0].t) : 0 })) };
      // Gols pequenos são contáveis. Uma bola por gol comunica a diferença
      // sem transformar toda a produção esportiva em cartões de barras.
      if (pares[0].unidade === 'gols' && pares.every(p => Number.isInteger(p.valor) && p.valor <= 24)) {
        recurso.visual = 'unidades'; recurso.simbolo = 'bola';
      }
      motivo = 'Duas quantidades explícitas da fala, com a mesma unidade.';
    }
    if (!recurso) {
      const marcos = clausulas.slice(0, 2).map(marco);
      const mesmaCena = marcos.length === 2 && marcos.every(Boolean);
      const [antes, atual] = mesmaCena ? marcos : [marco(anterior), marco(texto)];
      if (atual && antes && Number(antes.data) < Number(atual.data)) {
        recurso = { forma: 'linha-do-tempo', itens: [{ ...antes, entra: 0 },
          { ...atual, entra: mesmaCena ? entradaDoTrecho(clausulas[1]) : .2 }] };
        motivo = 'Dois acontecimentos consecutivos com anos explícitos em ordem cronológica.';
      }
    }
    const causalLocal = clausulas.length >= 2 && /^Por isso\s+/iu.test(clausulas[1]);
    if (!recurso && (causalLocal || /^Por isso\s+/iu.test(texto))) {
      const causa = causalLocal ? clausulas[0] : anterior;
      const efeito = (causalLocal ? clausulas[1] : texto).replace(/^Por isso\s+/iu, '');
      if (curtas([causa, efeito]) && !(causalLocal ? /[!?]/.test(texto.slice(0, texto.indexOf(clausulas[1]))) : /[!?]/.test(textos[i - 1] || ''))
          && !/\b(nao|talvez|pode|poderia|sera)\b/.test(normal(causa + ' ' + efeito))
          && !/^se\b/.test(normal(causa)) && !/^se\b/.test(normal(efeito))) {
        recurso = { forma: 'causa-efeito', itens: [{ rotulo: causa, entra: 0 },
          { rotulo: efeito, entra: causalLocal ? entradaDoTrecho(efeito) : (ws[2]?.t ?? ws[0].t) - ws[0].t }] };
        motivo = 'A fala declara a consequência com “por isso”; a fonte ainda precisa sustentar a causalidade.';
      }
    }
    if (!recurso) continue;
    const duracao = palavras[beat.palavras[1]]?.f - palavras[beat.palavras[0]]?.t;
    if (!(duracao >= 1.4)) continue;
    // Uma entrada no fim da fala não deixa tempo para perceber o resultado.
    if ((recurso.itens || []).some(item => duracao - item.entra < .6)) continue;
    // A revelação acompanha o intervalo narrado de cada dado/etapa, em vez
    // de terminar toda a explicação em 0,4 s e esperar o resto da fala.
    recurso.itens.forEach((item, j, itens) => {
      const limite = itens[j + 1]?.entra ?? duracao;
      item.dur = +Math.max(.15, Math.min(2.4, limite - item.entra - .45)).toFixed(3);
    });
    recurso.dur = .4; // entrada do painel; cada ação possui duração própria
    instalarExplicacao(beat, recurso, beat.estilo || cena.estilo || 'padrao');
    escolhas.push({ beat: beat.id, forma: recurso.forma, motivo, revisao: 'pendente' });
  }
  if (escolhas.length) {
    cena.explicacoes = { versao: 1, escolhas, limite: 'Dados e relações extraídos da fala; revisar evidência, contexto e quadros.' };
    // O auditor lexical não consegue julgar um recurso composto. A relevância
    // já o identifica como não avaliado e exige revisão, sem nota artificial.
    if (cena.falaForma) cena.falaForma.beats = cena.falaForma.beats.filter(b => !escolhas.some(e => e.beat === b.beat));
  }
  return escolhas;
}
