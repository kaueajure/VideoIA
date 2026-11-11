/* Configuração local e envio manual. Nenhuma consulta inicia publicação. */
async function abrirEnvioTiktok(nome) {
  abrirDlg('<h2>Enviar ao TikTok</h2><p role="status">Conferindo o vídeo e a conta…</p>');
  const carregamento = $('#dlgCorpo').firstElementChild;
  let dados;
  try { dados = await api('/api/tiktok/projeto/' + encodeURIComponent(nome)); }
  catch { dados = { erro: 'O estúdio não respondeu. Abra esta janela novamente.' }; }
  if (!$('#dlg').open || $('#dlgCorpo').firstElementChild !== carregamento) return;
  if (!dados || dados.erro) { abrirDlg(`<h2>Enviar ao TikTok</h2>${caixaErro(dados?.erro || 'Não foi possível carregar o vídeo.', { botoes: false })}`); return; }
  const privacidades = { PUBLIC_TO_EVERYONE: 'Todos', MUTUAL_FOLLOW_FRIENDS: 'Amigos que se seguem', FOLLOWER_OF_CREATOR: 'Seguidores', SELF_ONLY: 'Somente eu' };
  const direto = dados.modo === 'direto', creator = dados.criador;
  const salvo = dados.postInfo;
  abrirDlg(`<section class="yt-envio tk-envio" aria-labelledby="tkTitulo">
    <h2 id="tkTitulo">Enviar ao TikTok</h2>
    <p class="dica">${direto ? 'Publique pela integração após revisar e confirmar.' : 'Envie para a caixa de entrada e finalize a publicação no aplicativo TikTok.'} Nenhum vídeo é enviado automaticamente.</p>
    <div id="tkConta"></div>
    ${dados.bloqueio ? `<p class="caixa-nota" role="alert">${esc(dados.bloqueio)}</p>` : `<video controls playsinline preload="none" src="/api/tiktok/previa/${encodeURIComponent(nome)}" aria-label="Prévia do vídeo a enviar ao TikTok"></video><p class="dica">${esc(dados.arquivo.nome)} · ${(dados.arquivo.tamanho / 1e6).toFixed(1)} MB · ${Math.ceil(dados.arquivo.duracao)} segundos</p>`}
    <form id="tkEnviarForm" novalidate>
      ${direto ? `<fieldset id="tkDados"><legend>Publicação no TikTok</legend>
        <label class="yt-campo" for="tkLegenda">Legenda<textarea id="tkLegenda" rows="4" maxlength="2200">${esc(salvo?.title || '')}</textarea></label>
        <label class="yt-campo" for="tkPrivacidade">Quem pode assistir<select id="tkPrivacidade"><option value="">Escolha a visibilidade</option>${(creator?.privacy_level_options || []).filter(v => privacidades[v]).map(v => `<option value="${v}">${privacidades[v]}</option>`).join('')}</select></label>
        <label><input type="checkbox" id="tkComentarios" ${creator?.comment_disabled !== false ? 'disabled' : ''}>Permitir comentários</label>
        <label><input type="checkbox" id="tkDueto" ${creator?.duet_disabled !== false ? 'disabled' : ''}>Permitir dueto</label>
        <label><input type="checkbox" id="tkCostura" ${creator?.stitch_disabled !== false ? 'disabled' : ''}>Permitir costura</label>
        <p class="dica">Opções indisponíveis estão desativadas nas configurações da sua conta.</p>
        <label><input type="checkbox" id="tkComercial">Este vídeo promove uma marca, produto ou serviço</label>
        <div id="tkMarcas" hidden>
          <label><input type="checkbox" id="tkMarcaPropria">Minha marca ou negócio</label>
          <label><input type="checkbox" id="tkParceria">Outra marca, em parceria paga</label>
          <p class="dica" id="tkRotuloComercial"></p>
        </div>
        <label><input type="checkbox" id="tkIA">Identificar como conteúdo gerado por IA</label>
      </fieldset>` : '<p class="caixa-nota">Você escolherá legenda, privacidade e demais opções no aplicativo TikTok após receber a notificação na caixa de entrada.</p>'}
      <div id="tkProgresso" role="status" aria-live="polite"></div>
      <div id="tkErro" class="tk-erro" role="alert" tabindex="-1"></div>
      <label><input type="checkbox" id="tkMusica">Ao enviar, concordo com a <a href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en" target="_blank" rel="noopener noreferrer">confirmação de uso de música do TikTok</a>.</label>
      <label id="tkAceiteParceriaLinha" hidden><input type="checkbox" id="tkAceiteParceria">Concordo com a <a href="https://www.tiktok.com/legal/page/global/bc-policy/en" target="_blank" rel="noopener noreferrer">política de conteúdo de marca do TikTok</a>.</label>
      <label><input type="checkbox" id="tkConfirmar">Revisei o vídeo e autorizo o envio para a conta acima.</label>
      <div class="acoes"><button type="submit" class="btn" id="tkEnviar">${direto ? 'Publicar no TikTok' : 'Enviar para o aplicativo TikTok'}</button><button type="button" class="btn sec" id="tkConsultar">Consultar andamento</button></div>
      <p class="dica">Mantenha o estúdio aberto até terminar. O TikTok pode levar alguns minutos para processar o vídeo.</p>
    </form>
  </section>`);
  const form = $('#tkEnviarForm'), vivo = () => $('#dlg').open && $('#tkEnviarForm') === form;
  let timer = null, solicitando = false;
  const erro = e => { if (!vivo()) return; $('#tkErro').textContent = e ? msgErro(e).causa : ''; if (e) $('#tkErro').focus(); };
  function agendar(fn) { clearTimeout(timer); if (vivo()) timer = setTimeout(() => { if (vivo()) fn(); }, 6000); }
  function estadoEnvio(r) {
    dados.envio = r;
    const ativo = r && ['preparando', 'enviando'].includes(r.estado);
    const consulta = r && ['processando', 'caixa-entrada', 'publicado', 'falhou'].includes(r.estado);
    const bloqueado = !!ativo || !!consulta || !!r?.incerto;
    if ($('#tkDados')) $('#tkDados').disabled = solicitando || bloqueado || !!r?.continuar;
    const comercialIncompleto = direto && $('#tkComercial').checked && !$('#tkMarcaPropria').checked && !$('#tkParceria').checked;
    const parceriaIncompativel = direto && $('#tkParceria').checked && !['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS'].includes($('#tkPrivacidade').value);
    $('#tkEnviar').disabled = solicitando || bloqueado || !!dados.bloqueio || !dados.conectado || comercialIncompleto || parceriaIncompativel || (direto && (!creator || !!dados.erroConta));
    $('#tkEnviar').textContent = solicitando ? 'Conferindo o envio…' : ativo ? 'Enviando…' : r?.continuar ? 'Continuar envio ao TikTok' : direto ? 'Publicar no TikTok' : 'Enviar para o aplicativo TikTok';
    for (const id of ['tkMusica', 'tkConfirmar', 'tkAceiteParceria']) $('#' + id).disabled = solicitando || bloqueado;
    if (!r) return;
    const mensagens = { preparando: 'Preparando envio.', enviando: 'Enviando vídeo.', processando: 'Vídeo recebido. Aguardando o processamento do TikTok.', 'caixa-entrada': 'Vídeo entregue à caixa de entrada. Abra a notificação no aplicativo TikTok para editar e publicar.', publicado: 'Publicação concluída pelo TikTok.', falhou: 'O TikTok não concluiu a publicação.', interrompido: 'Envio interrompido. Consulte o andamento e continue o mesmo envio.' };
    const progresso = Number.isFinite(r.progresso) ? Math.max(0, Math.min(100, r.progresso)) : 0;
    const links = (r.postIds || []).filter(id => /^\d{1,30}$/.test(id)).map(id => `<a class="btn sec pequeno" href="https://www.tiktok.com/@_/video/${id}" target="_blank" rel="noopener noreferrer">Abrir vídeo no TikTok</a>`).join('');
    $('#tkProgresso').innerHTML = `<p>${esc(mensagens[r.estado] || 'Consulte o andamento no TikTok.')}</p><progress max="100" value="${progresso}" aria-label="Progresso do envio ao TikTok"></progress>${links}`;
    if (r.erro) erro(r.erro);
    if (r.incerto) erro('A resposta de criação do envio não chegou. Confira seu TikTok antes de recuperar o registro. O sistema bloqueou um novo envio para evitar duplicação.');
  }
  function opcoesComerciais() {
    if (!direto) return;
    const comercial = $('#tkComercial').checked;
    $('#tkMarcas').hidden = !comercial;
    if (!comercial) { $('#tkMarcaPropria').checked = false; $('#tkParceria').checked = false; }
    const parceria = comercial && $('#tkParceria').checked;
    const privacidade = $('#tkPrivacidade');
    for (const opcao of Array.from(privacidade.options || [])) {
      opcao.disabled = parceria && ['SELF_ONLY', 'FOLLOWER_OF_CREATOR'].includes(opcao.value);
    }
    if (parceria && ['SELF_ONLY', 'FOLLOWER_OF_CREATOR'].includes(privacidade.value)) privacidade.value = '';
    $('#tkAceiteParceriaLinha').hidden = !parceria;
    if (!parceria) $('#tkAceiteParceria').checked = false;
    $('#tkRotuloComercial').textContent = parceria ? 'O vídeo será identificado como Parceria paga.' : $('#tkMarcaPropria').checked ? 'O vídeo será identificado como Conteúdo promocional.' : 'Escolha ao menos uma opção de marca.';
    estadoEnvio(dados.envio);
  }
  function desenharConta() {
    const ocupado = dados.envio && ['preparando', 'enviando'].includes(dados.envio.estado);
    $('#tkConta').innerHTML = `<div class="caixa-nota">${dados.conectado ? `<b>Conta: ${esc(creator?.creator_nickname || dados.conta.nome)}</b>${creator?.creator_username ? `<p>@${esc(creator.creator_username)}</p>` : ''}<button type="button" class="btn sec pequeno" id="tkDesconectar" ${ocupado ? 'disabled' : ''}>Desconectar TikTok</button>` : `<b>Conecte sua conta TikTok</b><p>Configure o aplicativo abaixo e autorize o acesso à sua conta.</p>${dados.configurado ? '<button type="button" class="btn sec pequeno" id="tkConectar">Conectar TikTok</button><div id="tkAutorizar"></div>' : ''}`}</div>
      ${dados.erroConta ? `<p role="alert">${esc(dados.erroConta)}</p>` : ''}
      <details class="yt-config" ${dados.configurado ? '' : 'open'}><summary>Configurar aplicativo TikTok</summary>
        <p class="dica">No TikTok for Developers, crie seu aplicativo, adicione Login Kit para Desktop e Content Posting API. Copie o endereço abaixo para o Redirect URI do Login Kit.</p>
        <label class="yt-campo" for="tkRedirect">Redirect URI para cadastrar no portal<input id="tkRedirect" readonly value="${esc(dados.redirectPortal || '')}"></label>
        <p class="dica">Endereço desta sessão: ${esc(dados.redirectUri || '')}. O asterisco no endereço do portal permite que a porta local mude.</p>
        <label class="yt-campo" for="tkClientKey">Client key<input id="tkClientKey" autocomplete="off" spellcheck="false" ${ocupado ? 'disabled' : ''}></label>
        <label class="yt-campo" for="tkClientSecret">Client secret<input id="tkClientSecret" type="password" autocomplete="new-password" spellcheck="false" ${ocupado ? 'disabled' : ''}></label>
        <button type="button" class="btn sec pequeno" id="tkMostrarSegredo" aria-pressed="false">Mostrar Client secret</button>
        <label class="yt-campo" for="tkModo">Modo de envio<select id="tkModo" ${ocupado ? 'disabled' : ''}><option value="direto">Publicar diretamente (video.publish)</option><option value="aplicativo">Finalizar no aplicativo (video.upload)</option></select></label>
        <p class="dica">Permissões: user.info.basic e a permissão do modo escolhido. Sem auditoria, a publicação direta fica restrita a testes privados. Aprovação e limites são definidos pelo TikTok.</p>
        <p class="dica">Salvar novas credenciais desconecta a conta atual. As credenciais ficam neste computador e não devem ser enviadas no chat.</p>
        <button type="button" class="btn sec pequeno" id="tkSalvarConfig" ${ocupado ? 'disabled' : ''}>Salvar configuração TikTok</button>
      </details>`;
    $('#tkModo').value = dados.modo;
    $('#tkMostrarSegredo').onclick = () => { const campo = $('#tkClientSecret'), mostrar = campo.type === 'password'; campo.type = mostrar ? 'text' : 'password'; $('#tkMostrarSegredo').textContent = mostrar ? 'Ocultar Client secret' : 'Mostrar Client secret'; $('#tkMostrarSegredo').setAttribute('aria-pressed', String(mostrar)); };
    $('#tkSalvarConfig').onclick = async () => {
      const botao = $('#tkSalvarConfig'); botao.disabled = true; erro('');
      try {
        const r = await post('/api/tiktok/configurar', { clientKey: $('#tkClientKey').value.trim(), clientSecret: $('#tkClientSecret').value.trim(), modo: $('#tkModo').value });
        if (!vivo()) return;
        $('#tkClientSecret').value = '';
        if (r.erro) { erro(r.erro); return; }
        await abrirEnvioTiktok(nome);
      } catch { erro('Não foi possível salvar as credenciais. Confira os campos e tente novamente.'); }
      finally { if (vivo()) botao.disabled = false; }
    };
    if ($('#tkConectar')) $('#tkConectar').onclick = async () => {
      const botao = $('#tkConectar'); botao.disabled = true; erro('');
      try {
        const r = await post('/api/tiktok/conectar'); if (!vivo()) return;
        if (r.erro) { erro(r.erro); return; }
        const url = new URL(r.url); if (url.origin !== 'https://www.tiktok.com') throw new Error();
        $('#tkAutorizar').innerHTML = `<p><a class="btn pequeno" href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">Autorizar no TikTok</a></p><p class="dica">Depois de autorizar, volte a esta janela.</p><button type="button" class="btn sec pequeno" id="tkVerificarConta">Já autorizei, verificar conexão</button>`;
        $('#tkVerificarConta').onclick = verificarConta; agendar(verificarConta);
      } catch { erro('Não foi possível iniciar a autorização. Confira as credenciais e o Redirect URI no portal.'); }
      finally { if (vivo()) botao.disabled = false; }
    };
    if ($('#tkDesconectar')) $('#tkDesconectar').onclick = async () => {
      $('#tkDesconectar').disabled = true;
      try {
        const r = await post('/api/tiktok/desconectar'); if (!vivo()) return;
        if (r.erro) { erro(r.erro); $('#tkDesconectar').disabled = false; return; }
        if (!r.revogado) { dados.conectado = false; desenharConta(); estadoEnvio(dados.envio); erro('Conta desconectada localmente. A revogação remota não foi confirmada; remova o aplicativo nas permissões da sua conta TikTok.'); }
        else await abrirEnvioTiktok(nome);
      } catch { erro('Não foi possível confirmar a desconexão. Consulte a conta e tente novamente.'); if (vivo()) $('#tkDesconectar').disabled = false; }
    };
  }
  async function verificarConta() {
    try {
      const r = await api('/api/tiktok/conta'); if (!vivo()) return;
      if (r.erro) { erro(r.erro); return; }
      if (r.conectado) { clearTimeout(timer); await abrirEnvioTiktok(nome); return; }
      agendar(verificarConta);
    } catch { erro('Não foi possível verificar a conta. Clique em verificar conexão para tentar novamente.'); }
  }
  async function consultar() {
    try {
      const r = await api('/api/tiktok/envio/' + encodeURIComponent(nome)); if (!vivo()) return;
      if (r?.erro && !r.estado) { erro(r.erro); return; }
      estadoEnvio(r);
      if (r && ['preparando', 'enviando', 'processando'].includes(r.estado)) agendar(consultar);
    } catch { erro('Não foi possível consultar o andamento. Nenhum novo envio foi criado. Tente consultar novamente.'); }
  }
  if (direto) {
    if (salvo) {
      $('#tkPrivacidade').value = salvo.privacy_level;
      $('#tkComentarios').checked = !salvo.disable_comment; $('#tkDueto').checked = !salvo.disable_duet; $('#tkCostura').checked = !salvo.disable_stitch;
      $('#tkComercial').checked = !!salvo.brand_content_toggle || !!salvo.brand_organic_toggle;
      $('#tkMarcaPropria').checked = !!salvo.brand_organic_toggle; $('#tkParceria').checked = !!salvo.brand_content_toggle; $('#tkIA').checked = !!salvo.is_aigc;
    }
    for (const id of ['tkComercial', 'tkMarcaPropria', 'tkParceria']) $('#' + id).onchange = opcoesComerciais;
    $('#tkPrivacidade').onchange = () => estadoEnvio(dados.envio);
    opcoesComerciais();
  }
  $('#tkConsultar').onclick = consultar;
  form.onsubmit = async e => {
    e.preventDefault(); if (solicitando || $('#tkEnviar').disabled) return; erro('');
    if (!$('#tkConfirmar').checked || !$('#tkMusica').checked) { erro('Revise o vídeo, aceite o uso de música e marque a autorização antes de enviar.'); return; }
    const parceria = direto && $('#tkParceria').checked;
    if (parceria && !$('#tkAceiteParceria').checked) { erro('Aceite a política de conteúdo de marca para enviar a parceria.'); return; }
    const pedido = { nome, confirmar: true, aceitarMusica: true, aceitarParceria: $('#tkAceiteParceria').checked, contaId: dados.conta?.id, modo: dados.modo, sha256: dados.arquivo?.sha256,
      ...(direto ? { legenda: $('#tkLegenda').value, privacidade: $('#tkPrivacidade').value, comentarios: $('#tkComentarios').checked,
        dueto: $('#tkDueto').checked, costura: $('#tkCostura').checked, comercial: $('#tkComercial').checked,
        marcaPropria: $('#tkMarcaPropria').checked, parceria, ia: $('#tkIA').checked } : {}) };
    if (direto && !dados.envio?.continuar) {
      if (!pedido.privacidade) { erro('Escolha quem pode assistir ao vídeo.'); $('#tkPrivacidade').focus(); return; }
      if (pedido.comercial && !pedido.marcaPropria && !pedido.parceria) { erro('Escolha qual marca é promovida.'); return; }
      if (pedido.parceria && !['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS'].includes(pedido.privacidade)) { erro('Parcerias pagas exigem visibilidade pública ou para amigos.'); return; }
    }
    solicitando = true; estadoEnvio(dados.envio);
    try {
      const r = await post('/api/tiktok/enviar', pedido); if (!vivo()) return;
      if (r.erro && !r.estado) { erro(r.erro); return; }
      dados.envio = r; desenharConta(); agendar(consultar);
    } catch { erro('A resposta do envio não chegou. Consulte o andamento antes de tentar continuar.'); agendar(consultar); }
    finally { solicitando = false; if (vivo()) estadoEnvio(dados.envio); }
  };
  desenharConta(); estadoEnvio(dados.envio);
  if (dados.envio && ['preparando', 'enviando', 'processando'].includes(dados.envio.estado)) agendar(consultar);
  $('#dlg').addEventListener('close', () => { clearTimeout(timer); const segredo = $('#tkClientSecret'); if (segredo) segredo.value = ''; }, { once: true });
}
