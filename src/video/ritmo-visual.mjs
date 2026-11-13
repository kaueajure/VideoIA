import { avaliarRecurso } from './engine/recursos-visuais.js';
import { estadoUnidades } from './engine/unidades-visuais.js';

const area = { x0: 0, y0: 0, x1: 1000, y1: 800 };
const arredondar = (_, v) => typeof v === 'number' ? Math.round(v * 1000) / 1000 : v;

// Observa estados do mesmo avaliador usado pelo render. Não conta legenda,
// grão, rotação decorativa nem câmera como progresso da explicação.
function estadoConteudo(el, beat, t, palavras) {
  if (el.tipo !== 'recurso') {
    if (!['imagem', 'titulo', 'rotulo', 'legenda'].includes(el.tipo)) return null;
    return t < (el.t0 ?? beat.de) ? false : [el.id, el.valor, el.arquivo];
  }
  const e = avaliarRecurso(el, beat, t, palavras);
  if (!e.visivel) return false;
  if (el.forma === 'decomposicao' || el.visual === 'unidades') {
    return estadoUnidades(el, e, area, t, e.separarEm).objetos
      .map(o => [o.id, o.x, o.y, o.escala, o.opacidade]);
  }
  if (el.forma === 'campo-tatico') return [e.campo.jogadores.map(j => j.atual), e.campo.bola];
  if (el.forma === 'seguir-objeto' || el.forma === 'mecanismo') return e.objeto;
  if (el.forma === 'documento') {
    return el.arquivo || !e.linhas.length ? e.progresso : e.linhas.map(l => l.progresso);
  }
  return e.itens.map(i => [i.rotulo, i.fracao ?? i.progresso]);
}

export function analisarRitmoVisual(cena, spec, { passo = .1, repousoMinimo = 3, repousoAlto = 4 } = {}) {
  const cenas = [], alertas = [];
  for (const beat of spec.beats || []) {
    const elementos = (beat.elementos || []).filter(e => !['titulo', 'rotulo', 'legenda', 'traco'].includes(e.tipo));
    const conhecidos = elementos.filter(e => {
      try { return estadoConteudo(e, beat, beat.de, spec.palavras || []) !== null; }
      catch { return false; } // plano preliminar sem palavras/tempos suficientes
    });
    const naoAvaliados = elementos.filter(e => !conhecidos.includes(e)).map(e => e.id || e.forma || e.tipo);
    const repousos = [];
    // Estado desconhecido (peça local, vídeo, outro estilo) exige inspeção;
    // não recebe movimento fictício nem diagnóstico de imobilidade dos pixels.
    if (!naoAvaliados.length && conhecidos.length) {
      let anterior, inicio = beat.de;
      const guardar = fim => {
        if (fim - inicio >= repousoMinimo) repousos.push({ de: +inicio.toFixed(2), ate: +fim.toFixed(2),
          duracao: +(fim - inicio).toFixed(2) });
      };
      const passos = Math.ceil((beat.ate - beat.de) / passo);
      for (let i = 0; i <= passos; i++) {
        const t = Math.min(beat.ate - .001, beat.de + i * passo);
        const estado = JSON.stringify(conhecidos.map(e => estadoConteudo(e, beat, t, spec.palavras || [])), arredondar);
        if (estado !== anterior) { guardar(t); inicio = t; anterior = estado; }
      }
      guardar(beat.ate);
    }
    const leitura = conhecidos.length > 0 && conhecidos.every(e => e.forma === 'documento');
    const original = cena.beats?.find(b => b.id === beat.id);
    for (const pausa of repousos) {
      alertas.push({ tipo: 'ritmo-sem-progressao', beat: beat.id, t: pausa.de,
        severidade: !leitura && pausa.duracao >= repousoAlto ? 'alta' : 'normal',
        ...pausa, funcao: original?.direcao?.funcao,
        msg: `${beat.id}: ${pausa.duracao.toFixed(1)} s sem mudança no conteúdo executável (${pausa.de.toFixed(1)}–${pausa.ate.toFixed(1)} s). `
          + (leitura ? 'Confira tempo e legibilidade da leitura do documento.'
            : 'Redistribua a demonstração pela fala, mostre outra evidência pertinente ou encurte o trecho; câmera e legenda não substituem a ação.') });
    }
    cenas.push({ beat: beat.id, repousos, naoAvaliados,
      maiorRepouso: Math.max(0, ...repousos.map(p => p.duracao)) });
  }
  return { versao: 1, cenas, alertas,
    segundosRepouso: +cenas.flatMap(c => c.repousos).reduce((s, p) => s + p.duracao, 0).toFixed(2),
    limite: 'Amostra estados executáveis conhecidos; não mede retenção nem aprova criatividade. Peças, vídeo e estilos não avaliados exigem revisão temporal dos quadros.' };
}

// Comum a cenas autorais e automáticas, inclusive sem contrato de direção v2.
export function registrarRitmoVisual(cena, spec, relatorio) {
  const ritmo = analisarRitmoVisual(cena, spec);
  relatorio.ritmoVisual = ritmo;
  relatorio.avisos = [...(relatorio.avisos || []).filter(a => a.tipo !== 'ritmo-sem-progressao'), ...ritmo.alertas];
  return ritmo;
}
