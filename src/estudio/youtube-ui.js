/* Envio manual. Abrir a janela, conectar e consultar progresso não enviam vídeos. */
async function abrirEnvioYoutube(nome) {
  abrirDlg('<h2>Enviar ao YouTube</h2><p role="status">Carregando os dados do vídeo…</p>');
  const carregamento = $('#dlgCorpo').firstElementChild;
  let dados;
  try { dados = await api('/api/youtube/projeto/' + encodeURIComponent(nome)); }
  catch { dados = { erro: 'O estúdio não respondeu. Tente abrir esta janela novamente.' }; }
  if (!$('#dlg').open || $('#dlgCorpo').firstElementChild !== carregamento) return;
  if (dados?.erro || !dados) {
    abrirDlg(`<h2>Enviar ao YouTube</h2>${caixaErro(dados?.erro || 'Não foi possível carregar o vídeo.', { botoes: false })}`);
    return;
  }
  const pacote = dados.pacote || {}, salvo = dados.metadados;
  const titulo = salvo?.snippet?.title || pacote.titulos?.[0] || nome.replace(/-/g, ' ');
  let descricao = salvo?.snippet?.description ?? pacote.descricoes?.[0] ?? '';
  if (!salvo) {
    const hashtags = (pacote.hashtags || []).filter(h => typeof h === 'string' && !descricao.includes(h));
    if (hashtags.length) descricao += '\n\n' + hashtags.join(' ');
  }
  abrirDlg(`<section class="yt-envio" aria-labelledby="ytEnvioTitulo">
    <h2 id="ytEnvioTitulo">Enviar ao YouTube</h2>
    <p class="dica">Revise o vídeo e os dados. O envio só começa quando você confirma e clica no botão abaixo.</p>
    <div id="ytConta" aria-live="polite"></div>
    ${dados.bloqueio ? `<p class="caixa-nota" role="alert">${esc(dados.bloqueio)}</p>` : `<video controls playsinline preload="none" src="/api/youtube/previa/${encodeURIComponent(nome)}" aria-label="Prévia do vídeo a enviar"></video><p class="dica">Arquivo final: ${esc(dados.arquivo.nome)} · ${(dados.arquivo.tamanho / 1e6).toFixed(1)} MB</p>`}
    <form id="ytEnviarForm" novalidate>
      <fieldset id="ytDados"><legend>Dados do vídeo</legend>
        <label class="yt-campo" for="ytEnvTitulo">Título<input id="ytEnvTitulo" name="titulo" maxlength="100" value="${esc(titulo)}" required></label>
        <label class="yt-campo" for="ytEnvDescricao">Descrição<textarea id="ytEnvDescricao" name="descricao" rows="6">${esc(descricao)}</textarea></label>
        <label class="yt-campo" for="ytEnvTags">Tags, separadas por vírgula<input id="ytEnvTags" name="tags" value="${esc((salvo?.snippet?.tags || pacote.tags || []).join(', '))}"></label>
        <label class="yt-campo" for="ytEnvPrivacidade">Visibilidade<select id="ytEnvPrivacidade" name="privacidade" required>
          <option value="">Escolha a visibilidade</option><option value="private">Privado</option><option value="unlisted">Não listado</option><option value="public">Público</option>
        </select></label>
        <label class="yt-campo" for="ytEnvInfantil">Este vídeo foi criado para crianças?<select id="ytEnvInfantil" name="infantil" required>
          <option value="">Escolha uma opção</option><option value="nao">Não, não foi criado para crianças</option><option value="sim">Sim, foi criado para crianças</option>
        </select></label>
        <label class="yt-campo" for="ytEnvSintetico">Há conteúdo realista alterado ou sintético?<select id="ytEnvSintetico" name="sintetico" required aria-describedby="ytSinteticoAjuda">
          <option value="">Escolha uma opção</option><option value="nao">Não</option><option value="sim">Sim</option>
        </select></label>
        <p class="dica" id="ytSinteticoAjuda">Por exemplo: uma pessoa real dizendo algo que não disse, um evento real alterado ou uma cena realista que não aconteceu.</p>
      </fieldset>
      <div id="ytEnvProgresso" role="status" aria-live="polite"></div>
      <div id="ytEnvErro" role="alert" tabindex="-1"></div>
      <label><input type="checkbox" id="ytEnvConfirmar">Revisei o vídeo e autorizo este envio para o canal acima.</label>
      <div class="acoes"><button type="submit" class="btn" id="ytEnvEnviar">Enviar ao YouTube</button></div>
      <p class="dica">Mantenha o estúdio aberto até o envio terminar. O YouTube ainda processará o vídeo depois de recebê-lo.</p>
    </form>
  </section>`);
  const form = $('#ytEnviarForm');
  const vivo = () => $('#dlg').open && $('#ytEnviarForm') === form;
  let enviandoPedido = false, timer = null;
  const erro = mensagem => {
    const alvo = $('#ytEnvErro');
    if (alvo) { alvo.textContent = msgErro(mensagem).causa; if (mensagem) alvo.focus(); }
  };
  if (salvo) {
    $('#ytEnvPrivacidade').value = salvo.status.privacyStatus;
    $('#ytEnvInfantil').value = salvo.status.selfDeclaredMadeForKids ? 'sim' : 'nao';
    $('#ytEnvSintetico').value = salvo.status.containsSyntheticMedia ? 'sim' : 'nao';
  }
  function atualizarEnvio(envio) {
    dados.envio = envio;
    const ocupado = envio && ['preparando', 'enviando'].includes(envio.estado);
    const enviado = envio?.estado === 'enviado' || !!envio?.videoId;
    $('#ytDados').disabled = !!ocupado || !!enviado || !!envio?.retomavel;
    $('#ytEnvConfirmar').disabled = !!ocupado || !!enviado;
    $('#ytEnvEnviar').disabled = enviandoPedido || !!dados.bloqueio || !dados.conectado || !!ocupado || !!enviado;
    $('#ytEnvEnviar').textContent = enviado ? 'Vídeo enviado' : ocupado ? 'Enviando…' : envio?.retomavel ? 'Continuar envio ao YouTube' : 'Enviar ao YouTube';
    const alvo = $('#ytEnvProgresso');
    if (enviado) {
      // O endereço é montado com o ID validado pelo servidor, nunca com HTML remoto.
      const visibilidade = { private: 'Privado', unlisted: 'Não listado', public: 'Público' }[envio.privacidadeEfetiva];
      alvo.innerHTML = `<p class="ok-txt">Vídeo recebido pelo YouTube. O processamento pode levar alguns minutos.${visibilidade ? ` Visibilidade confirmada: ${visibilidade}.` : ''}</p><a class="btn sec pequeno" href="https://www.youtube.com/watch?v=${encodeURIComponent(envio.videoId)}" target="_blank" rel="noopener noreferrer">Abrir vídeo no YouTube</a>`;
    } else if (envio) {
      const progresso = Number.isFinite(envio.progresso) ? Math.max(0, Math.min(100, envio.progresso)) : 0;
      const mensagem = ocupado ? `Enviando: ${progresso}% confirmado pelo YouTube.` : envio.retomavel ? 'Envio interrompido. Continue o mesmo envio com os dados originais.' : 'O envio não foi concluído.';
      const anterior = alvo.querySelector('progress');
      if (anterior && ocupado) { anterior.value = progresso; alvo.querySelector('p').textContent = mensagem; }
      else alvo.innerHTML = `<p>${esc(mensagem)}</p><progress max="100" value="${progresso}" aria-label="Progresso do envio ao YouTube"></progress>`;
      if (envio.erro) erro(envio.erro);
    }
  }
  function configurarConta() {
    const ativo = dados.envio && ['preparando', 'enviando'].includes(dados.envio.estado);
    $('#ytConta').innerHTML = `<div class="caixa-nota">${dados.conectado ? `<b>Canal conectado: ${esc(dados.canal.titulo)}</b><p>Destino: ${esc(dados.canal.id)}</p><button type="button" class="btn sec pequeno" id="ytDesconectar" ${ativo ? 'disabled' : ''}>Desconectar canal</button>` : `<b>${dados.configurado ? 'Conecte seu canal' : 'Configure o acesso ao YouTube'}</b><p>${dados.configurado ? 'Autorize o Google e confira qual canal será usado. Conectar não envia vídeos.' : 'Na primeira vez, importe o JSON de credenciais do Google. Depois conecte o canal.'}</p>${dados.configurado ? '<button type="button" class="btn sec pequeno" id="ytConectar">Conectar canal Google</button><div id="ytAutorizar"></div>' : ''}`}</div>
      <details class="yt-config"><summary>${dados.configurado ? 'Configuração do aplicativo Google' : 'Como configurar e importar o JSON'}</summary>
        <ol><li>No <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noopener noreferrer">Google Cloud</a>, crie ou escolha um projeto e habilite a YouTube Data API v3.</li>
        <li>Configure a tela de consentimento OAuth. Se estiver em teste, adicione sua conta como usuário de teste.</li>
        <li>Crie um cliente OAuth do tipo <b>Aplicativo para computador</b> e baixe o JSON.</li>
        <li>Selecione esse arquivo abaixo e conecte o canal. <a href="https://developers.google.com/identity/protocols/oauth2/native-app" target="_blank" rel="noopener noreferrer">Guia do Google</a>.</li></ol>
        <label class="yt-campo" for="ytCredenciais">JSON de credenciais do Google<input id="ytCredenciais" type="file" accept=".json,application/json" ${ativo ? 'disabled' : ''}></label>
        <p class="dica">O arquivo e a autorização ficam no computador, na pasta privada do estúdio. Importar outro JSON desconecta o canal atual.</p>
      </details>`;
    const conectar = $('#ytConectar');
    if (conectar) conectar.onclick = async () => {
      conectar.disabled = true; erro('');
      try {
        const r = await post('/api/youtube/conectar');
        if (!vivo()) return;
        if (r.erro) { erro(r.erro); return; }
        const url = new URL(r.url);
        if (url.origin !== 'https://accounts.google.com') throw new Error();
        $('#ytAutorizar').innerHTML = `<p><a class="btn pequeno" href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">Autorizar no Google</a></p><p class="dica">Após autorizar, volte a esta janela. Ela reconhecerá o canal conectado.</p><button type="button" class="btn sec pequeno" id="ytVerificarConta">Já autorizei, verificar conexão</button>`;
        $('#ytVerificarConta').onclick = verificarConta;
        agendar(verificarConta);
      } catch { if (vivo()) erro('Não foi possível iniciar a conexão. Tente novamente.'); }
      finally { if (vivo()) conectar.disabled = false; }
    };
    const desconectar = $('#ytDesconectar');
    if (desconectar) desconectar.onclick = async () => {
      desconectar.disabled = true;
      try {
        const r = await post('/api/youtube/desconectar');
        if (!vivo()) return;
        if (r.erro) { erro(r.erro); return; }
        dados.conectado = false; dados.canal = null; configurarConta(); atualizarEnvio(dados.envio);
        if (!r.revogado) erro('Canal desconectado deste estúdio. Sem internet, a revogação no Google pode ficar pendente; remova o acesso nas permissões da sua Conta Google.');
      } catch { if (vivo()) erro('O estúdio não respondeu ao pedido de desconexão. Tente novamente.'); }
      finally { if (vivo()) desconectar.disabled = false; }
    };
    $('#ytCredenciais').onchange = async event => {
      const campo = event.target, arquivo = campo.files?.[0];
      if (!arquivo) return;
      campo.disabled = true; erro('');
      try {
        if (arquivo.size > 16000) { erro('Escolha o JSON de credenciais do Google, com até 16 KB.'); return; }
        const credenciais = JSON.parse(await arquivo.text());
        const r = await post('/api/youtube/configurar', { credenciais });
        if (!vivo()) return;
        if (r.erro) { erro(r.erro); return; }
        Object.assign(dados, r); configurarConta(); atualizarEnvio(dados.envio);
      } catch { if (vivo()) erro('Não foi possível importar. Escolha o JSON de um cliente OAuth para computador baixado do Google Cloud.'); }
      finally { campo.value = ''; campo.disabled = false; }
    };
  }
  function agendar(fn) { clearTimeout(timer); if (vivo()) timer = setTimeout(() => { if (vivo()) fn(); }, 2000); }
  async function verificarConta() {
    try {
      const r = await api('/api/youtube/conta');
      if (!vivo()) return;
      if (r.erro) { erro(r.erro); return; }
      if (r.conectado) { Object.assign(dados, r); configurarConta(); atualizarEnvio(dados.envio); erro(''); return; }
      agendar(verificarConta);
    } catch { if (vivo()) erro('Não foi possível verificar o canal. Clique em verificar conexão para tentar novamente.'); }
  }
  async function verificarEnvio() {
    try {
      const r = await api('/api/youtube/envio/' + encodeURIComponent(nome));
      if (!vivo()) return;
      if (r?.erro && !r.estado) { erro(r.erro); return; }
      atualizarEnvio(r);
      if (r && ['preparando', 'enviando'].includes(r.estado)) agendar(verificarEnvio);
      else configurarConta();
    } catch {
      if (!vivo()) return;
      erro('Não foi possível consultar o andamento. O envio pode continuar no estúdio. Esta janela tentará consultar novamente.');
      agendar(verificarEnvio);
    }
  }
  form.onsubmit = async event => {
    event.preventDefault();
    if (enviandoPedido || $('#ytEnvEnviar').disabled) return;
    erro('');
    if (!$('#ytEnvConfirmar').checked) { erro('Marque a confirmação após revisar o vídeo e o canal.'); $('#ytEnvConfirmar').focus(); return; }
    const retomar = dados.envio?.retomavel;
    if (!retomar) {
      for (const id of ['ytEnvTitulo', 'ytEnvPrivacidade', 'ytEnvInfantil', 'ytEnvSintetico']) {
        if (!$('#' + id).value.trim()) { erro('Preencha o título, a visibilidade e as duas declarações antes de enviar.'); $('#' + id).focus(); return; }
      }
    }
    const pedido = { nome, confirmar: true, sha256: dados.arquivo?.sha256, canalId: dados.canal?.id, titulo: $('#ytEnvTitulo').value, descricao: $('#ytEnvDescricao').value,
      tags: $('#ytEnvTags').value.split(',').map(t => t.trim()).filter(Boolean), privacidade: $('#ytEnvPrivacidade').value,
      infantil: $('#ytEnvInfantil').value === 'sim', sintetico: $('#ytEnvSintetico').value === 'sim' };
    enviandoPedido = true; atualizarEnvio(dados.envio);
    $('#ytEnvEnviar').textContent = 'Conferindo o arquivo…';
    try {
      const r = await post('/api/youtube/enviar', pedido);
      if (!vivo()) return;
      if (r.erro && !r.estado) { erro(r.erro); return; }
      dados.envio = r; configurarConta(); agendar(verificarEnvio);
    } catch {
      if (vivo()) { erro('A resposta do envio não chegou. Consulte o andamento antes de tentar novamente.'); agendar(verificarEnvio); }
    } finally { enviandoPedido = false; if (vivo()) atualizarEnvio(dados.envio); }
  };
  configurarConta(); atualizarEnvio(dados.envio);
  if (dados.envio && ['preparando', 'enviando'].includes(dados.envio.estado)) agendar(verificarEnvio);
  $('#dlg').addEventListener('close', () => clearTimeout(timer), { once: true });
}
