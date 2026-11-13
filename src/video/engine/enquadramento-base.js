const ESTILOS = new Set(['padrao', 'editorial', 'minimalista', 'papel']);
const principais = beat => (beat.elementos || []).filter(e => ['peca', 'imagem', 'video', 'pontos', 'contador', 'recurso'].includes(e.tipo));
const estiloBase = (spec, beat) => spec.formato !== 'horizontal' && ESTILOS.has(beat.estilo || spec.estilo || 'padrao');

// Ajustes de encaixe no plano compilado; o roteiro e os ativos não mudam.
export function enquadrarFotosIsoladas(spec) {
  if (spec.enquadramentoRevisado === true) return spec;
  for (const beat of spec.beats || []) {
    if (!estiloBase(spec, beat)) continue;
    const elementos = principais(beat);
    if (elementos.length !== 1 || elementos[0].tipo !== 'imagem') continue;
    const foto = elementos[0], largura = foto.largura || 560;
    const altura = foto.forma === 'circulo' ? largura : foto.altura || largura;
    if (altura >= 600) continue;
    const fator = Math.min(600 / altura, 800 / largura);
    if (fator <= 1) continue;
    foto.largura = Math.round(largura * fator);
    foto.altura = Math.round(altura * fator);
  }
  return spec;
}

export function instalarEnquadramentoBase(ilu) {
  const { carregar, medir } = ilu;
  let paineis = [];
  ilu.carregar = async (spec, opcoes) => {
    paineis = [];
    const info = await carregar(enquadrarFotosIsoladas(spec), opcoes);
    let css = document.getElementById('ilu-enquadramento-base');
    if (!css) {
      css = document.createElement('style'); css.id = 'ilu-enquadramento-base';
      css.textContent = `.cont.ilu-numero-protagonista{left:88px!important;top:600px!important;width:904px!important;height:600px;box-sizing:border-box;padding:32px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:34px;background:rgba(14,14,19,.9);border:2px solid rgba(255,255,255,.16)}.cont.ilu-numero-protagonista em{position:static;white-space:normal;max-width:660px}`;
      document.head.appendChild(css);
    }
    const contadores = [...document.querySelectorAll('#contadores > .cont')];
    let indice = 0;
    for (const beat of spec.beats || []) {
      const elementos = principais(beat);
      for (const el of beat.elementos || []) {
        if (el.tipo !== 'contador') continue;
        const dom = contadores[indice++];
        // Posição explícita é direção autoral. O painel não pode ocultar um
        // posicionamento ruim e fazer o QA aprovar uma composição diferente.
        if (!dom || !estiloBase(spec, beat) || elementos.length !== 1 || el.pos != null) continue;
        dom.classList.add('ilu-numero-protagonista'); paineis.push({ beat, dom });
      }
    }
    return info;
  };
  ilu.medir = (t, opcoes) => {
    const m = medir(t, opcoes);
    for (const { beat, dom } of paineis) {
      if (t < beat.de || t >= beat.ate || Number(dom.style.opacity) <= .5) continue;
      const r = dom.getBoundingClientRect();
      // Mede o painel realmente desenhado, além dos algarismos medidos pelo motor.
      m.pecas.push({ id: beat.id, forma: 'painel-contador', sobre: true, x0: r.left, y0: r.top, x1: r.right, y1: r.bottom });
    }
    return m;
  };
}
