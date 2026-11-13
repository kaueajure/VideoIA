// Política da identificação da página. Logos de terceiros usados como assunto não são removidos.
export function aplicarMarcaOpcional(spec) {
  if (!spec || (spec.handle !== false && !spec.semMarca)) return spec;
  const marca = spec.marca || {};
  const handle = marca.serie || marca.serieCta || '';
  if (spec.semMarca) {
    for (const beat of spec.beats || []) {
      const cta = beat.direcao?.funcao === 'cta' || beat.sujeito?.tipo === 'cta' ||
        (beat.elementos || []).some(el => /^(seguirperfil|botaoseguir|seguir-comentar)$/.test(el.forma || el.tipo || ''));
      if (!cta) continue;
      if (handle && beat.titulo?.texto) beat.titulo.texto = beat.titulo.texto.split(handle).join('a página');
      for (const el of beat.elementos || []) {
        if (el.dados && /^(seguirperfil|botaoseguir)$/.test(el.forma || '')) {
          el.dados = { ...el.dados, handle: '', nome: '', logo: '' };
        }
      }
    }
  }
  spec.marca = { ...marca, serie: '', serieCta: spec.semMarca ? '' : (marca.serieCta ?? handle) };
  return spec;
}
