const rascunhosCenas = new Map();
/* Controles por cena, usando os formulários e o chat existentes do estúdio. */
function htmlEditorCena(d, indice = 0) {
  const c = d.cenas[indice];
  if (!c) return '<p>Prepare as cenas e a voz para editar este vídeo.</p>';
  const r = c.recurso, direcao = d.direcao?.cenas?.find(p => p.id === c.id);
  return `<form id="cenaFormulario" class="bloco" aria-labelledby="cenaTitulo">
    <h3 id="cenaTitulo">Corrigir uma cena</h3>
    <label class="campo"><span>Cena</span><select id="cenaEscolha">${d.cenas.map((b,i)=>`<option value="${i}" ${i===indice?'selected':''}>${i+1}. ${esc(b.id)} · ${b.inicio.toFixed(1)} a ${b.fim.toFixed(1)} s</option>`).join('')}</select></label>
    <p class="dica">${esc(d.voz)}</p><blockquote>${esc(c.fala)}</blockquote>
    <label class="campo"><span>Texto do título</span><input type="text" id="cenaTexto" maxlength="160" value="${esc(c.titulo)}"></label>
    ${r?.linhas && !r.arquivo ? `<label class="campo"><span>Texto da composição, uma linha por trecho</span><textarea id="cenaLinhas" rows="4">${esc(r.linhas.join('\n'))}</textarea></label>` : ''}
    ${r?.itens ? r.itens.map((item,i)=>`<label class="campo"><span>Rótulo ${i+1}</span><input type="text" data-cena-rotulo="${i}" maxlength="32" value="${esc(item.rotulo)}"></label>`).join('') : ''}
    ${r ? `<label class="campo"><span>Duração da entrada ou destaque, em segundos</span><input id="cenaDur" type="number" min="0.1" max="30" step="0.1" value="${r.dur ?? .7}"></label>` : ''}
    ${r && ['causa-efeito','linha-do-tempo'].includes(r.forma) ? `<label class="campo"><span>Organização</span><select id="cenaLayout"><option value="vertical" ${r.layout!=='horizontal'?'selected':''}>De cima para baixo</option><option value="horizontal" ${r.layout==='horizontal'?'selected':''}>Da esquerda para a direita</option></select></label>` : ''}
    ${c.cortes.length ? `<label class="campo"><span>Terminar esta cena após a palavra</span><select id="cenaCorte">${c.cortes.map(p=>`<option value="${p.indice}" ${p.indice===c.palavras[1]?'selected':''}>${p.indice+1}. ${esc(p.palavra)} · ${p.tempo.toFixed(2)} s</option>`).join('')}</select></label><p class="dica">Mover o corte também altera o início da próxima cena. A duração do áudio permanece igual.</p>` : '<p class="dica">Esta é a última cena. O fim acompanha a narração.</p>'}
    <label class="campo"><span>Diagrama explicativo</span><select id="cenaMecanismo"><option value="">Preservar composição atual</option><option value="fases-lua">Fases da Lua: órbita e vista da Terra</option><option value="reflexao-luz">Luz solar refletida pela Lua</option></select></label><p class="dica">Use apenas quando a fala tratar deste mecanismo. Ao escolher, a composição desta cena será substituída; o título, a voz e o histórico são preservados. Esquema acelerado e fora de escala, sem simular eclipses.</p>
    <div class="acoes"><button class="btn" type="submit">Salvar cena</button><button class="btn sec" type="button" id="cenaPrevia">Conferir prévia</button>
    ${direcao?.proposta ? '<button class="btn sec" type="button" id="cenaRitmo">Aplicar ritmo sugerido</button>' : ''}
    <button class="btn sec" type="button" id="cenaAssistente">Pedir ajuste desta cena</button>
    <button class="btn sec" type="button" id="cenaDesfazer" ${d.historico?'':'hidden'}>Desfazer última edição</button></div>
    ${direcao?.motivos?.length ? `<p class="dica">${esc(direcao.motivos.join(' '))}</p>` : ''}
    <p id="cenaMensagem" role="status" aria-live="polite" style="min-height:2.8em"></p>
    <p class="dica">Salvar preserva a voz e invalida a entrega anterior. Confira a prévia e produza uma entrega nova para publicar. O render reutiliza os quadros cujo conteúdo continua válido.</p>
  </form>`;
}
async function montarEditorCenas(painel, nome) {
  const carregamento = document.createElement('p'); carregamento.setAttribute('role','status'); carregamento.textContent='Carregando as cenas…'; painel.replaceChildren(carregamento);
  let d;
  try { d = await api('/api/cenas/' + encodeURIComponent(nome)); } catch { d = { erro: 'Não foi possível carregar as cenas. Reabra esta aba para tentar novamente.' }; }
  if (!painel.isConnected || painel.firstElementChild !== carregamento) return;
  if (d.erro) { painel.textContent = d.erro; return; }
  let indice = 0;
  const desenhar = () => {
    painel.innerHTML = htmlEditorCena(d, indice);
    const form = painel.querySelector('form'); if (!form) return;
    const $c = s => form.querySelector(s), mensagem = $c('#cenaMensagem');
    const c = d.cenas[indice], chave = nome + ':' + c.id;
    const rascunho = rascunhosCenas.get(chave);
    for (const e of form.querySelectorAll('input,textarea,select')) {
      if (e.id !== 'cenaEscolha' && rascunho?.[e.id || e.dataset.cenaRotulo] != null) e.value = rascunho[e.id || e.dataset.cenaRotulo];
    }
    form.oninput = () => rascunhosCenas.set(chave, Object.fromEntries([...form.querySelectorAll('input,textarea,select')].filter(e=>e.id!=='cenaEscolha').map(e=>[e.id || e.dataset.cenaRotulo,e.value])));
    $c('#cenaEscolha').onchange = e => { indice = Number(e.target.value); desenhar(); painel.querySelector('#cenaEscolha')?.focus(); };
    const salvar = async (rota, mudancas) => {
      if (form.getAttribute('aria-busy') === 'true') return;
      const controles = [...form.querySelectorAll('button,input,select,textarea')]; controles.forEach(e=>e.disabled=true);
      form.setAttribute('aria-busy','true'); mensagem.textContent='Salvando…';
      try {
        const r = await post(rota,{nome,cena:c.id,revisao:d.revisao,mudancas,historico:d.historico});
        if (!form.isConnected) return;
        if (r.erro) { mensagem.textContent = typeof r.erro==='string'?r.erro:r.erro.causa; return; }
        const atual = await api('/api/cenas/' + encodeURIComponent(nome));
        if (atual.erro) { mensagem.textContent='A edição foi salva. Reabra a aba para carregar a versão atual.'; return; }
        if (!form.isConnected) return;
        rascunhosCenas.delete(chave); d={...atual,historico:r.desfez ? undefined : r.historico || d.historico}; desenhar();
        painel.querySelector('#cenaMensagem').textContent=r.desfez?'Última edição desfeita. Confira a prévia.':r.aviso||'Cena salva. Confira a prévia.';
        painel.querySelector('#cenaTexto')?.focus();
      } catch { mensagem.textContent='O estúdio não respondeu. Seu texto foi preservado. Confira a conexão e tente novamente.'; }
      finally { controles.forEach(e=>e.disabled=false); form.removeAttribute('aria-busy'); }
    };
    form.onsubmit = e => {
      e.preventDefault(); const mudancas={};
      if ($c('#cenaTexto').value !== c.titulo) mudancas.titulo=$c('#cenaTexto').value;
      if ($c('#cenaCorte')) mudancas.corteApos=Number($c('#cenaCorte').value);
      if(c.recurso){
        mudancas.recurso={};
        if (Number($c('#cenaDur').value) !== (c.recurso.dur ?? .7)) mudancas.recurso.dur=Number($c('#cenaDur').value);
        if($c('#cenaLinhas')){
          const linhas=$c('#cenaLinhas').value.split('\n').map(s=>s.trim()).filter(Boolean);
          mudancas.recurso.linhas=linhas;
          // Uma mudança no número de linhas precisa de um novo plano de revelação.
          if(linhas.length!==c.recurso.linhas.length){mudancas.recurso.marcar=[Math.max(0,linhas.length-1)];mudancas.recurso.revelarLinhas=linhas.map((_,i)=>i*.6);}
        }
        if(c.recurso.itens)mudancas.recurso.itens=c.recurso.itens.map((item,i)=>({...item,rotulo:$c(`[data-cena-rotulo="${i}"]`).value}));
        if($c('#cenaLayout'))mudancas.recurso.layout=$c('#cenaLayout').value;
      }
      if($c('#cenaMecanismo').value){delete mudancas.recurso;mudancas.mecanismo=$c('#cenaMecanismo').value;}
      salvar('/api/cenas/salvar',mudancas);
    };
    $c('#cenaRitmo')?.addEventListener('click',()=>salvar('/api/cenas/ritmo'));
    $c('#cenaDesfazer').onclick=()=>salvar('/api/cenas/desfazer');
    $c('#cenaPrevia').onclick=async()=>{
      const botao=$c('#cenaPrevia');botao.disabled=true;mensagem.textContent='Preparando a prévia da cena salva…';
      try {const r=await post('/api/previa',{nome,cena:c.id});if(r.url){window.open(r.url,'_blank','noopener');mensagem.textContent='Prévia aberta na cena selecionada.';}else mensagem.textContent=r.erro||'Não foi possível abrir a prévia.';}
      catch{mensagem.textContent='O estúdio não respondeu. Tente abrir a prévia novamente.';}finally{botao.disabled=false;}
    };
    $c('#cenaAssistente').onclick=()=>definirContextoChat({projeto:nome,titulo:nome.replace(/-/g,' '),alvo:'cena',cena:c.id,revisao:d.revisao},'Ajuste esta cena e confira início, meio, fim e o corte seguinte. Preserve a voz e os trechos que não precisam mudar.');
  };
  desenhar();
}
