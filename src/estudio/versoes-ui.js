/* Histórico somente de leitura: cada render conserva vídeo, entradas e QA. */
async function montarComparacaoVersoes(painel,nome) {
  const carga=document.createElement('p');carga.setAttribute('role','status');carga.textContent='Carregando versões…';painel.replaceChildren(carga);
  let lista;try{lista=await api('/api/versoes/'+encodeURIComponent(nome));}catch{lista={erro:'Não foi possível carregar as versões. Reabra a aba para tentar novamente.'};}
  if(!painel.isConnected||painel.firstElementChild!==carga)return;
  if(lista.erro){painel.textContent=lista.erro;return;}
  if(lista.versoes.length<2){painel.textContent='Gere duas entregas para comparar. O histórico começa a ser guardado a partir desta atualização.';return;}
  const opcoes=selecionada=>lista.versoes.map(v=>`<option value="${esc(v.id)}" ${v.id===selecionada?'selected':''}>${esc(new Date(v.em).toLocaleString('pt-BR'))} · ${esc(v.id.slice(0,8))} · ${v.publicavel?'publicável na geração':'revisão'}</option>`).join('');
  painel.innerHTML=`<div class="bloco"><h3>Comparar versões</h3><p class="dica">Cada vídeo preserva o arquivo e a avaliação daquela entrega. ${Math.round(lista.versoes.reduce((n,v)=>n+v.bytes,0)/1024/1024)} MB em vídeos no histórico.</p><label class="campo"><span>Antes</span><select id="versaoAntes">${opcoes(lista.versoes[1].id)}</select></label><label class="campo"><span>Depois</span><select id="versaoDepois">${opcoes(lista.versoes[0].id)}</select></label><div id="versaoResultado" aria-live="polite"></div></div>`;
  const resultado=painel.querySelector('#versaoResultado');let pedido=0;
  async function carregar(){
    const n=++pedido,a=painel.querySelector('#versaoAntes').value,b=painel.querySelector('#versaoDepois').value;
    resultado.textContent='Comparando…';
    let d;try{d=await api(`/api/versoes/${encodeURIComponent(nome)}/${a}/${b}`);}catch{d={erro:'Não foi possível comparar. Escolha as versões novamente.'};}
    if(!resultado.isConnected||n!==pedido)return;
    if(d.erro){resultado.textContent=d.erro;return;}
    const resumo=v=>`${v.qa.falhas.length} falha(s), ${v.qa.avisos.length} aviso(s). Voz: ${v.voz}.`;
    resultado.innerHTML=`<p>${esc(d.aviso)}</p><label class="campo"><span>Cena para conferir</span><select id="versaoCena">${d.cenas.map((c,i)=>`<option value="${i}">${esc(c.id)} · ${c.alterou?'alterada':'preservada'}</option>`).join('')}</select></label><div class="acoes"><button class="btn sec" id="versaoInicio">Ir ao início da cena nas duas versões</button><button class="btn sec" id="versaoSincronizar">Sincronizar posição na cena</button></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:16px">${[['Antes',a,d.antes],['Depois',b,d.depois]].map(([nomeVersao,id,v])=>`<section><h4>${nomeVersao}</h4><video data-versao="${id}" controls preload="metadata" style="display:block;width:100%;max-height:540px;background:#080d14" src="/api/versoes/${encodeURIComponent(nome)}/${id}/video"></video><p class="dica">${esc(resumo(v))}</p></section>`).join('')}</div><p id="versaoCenaInfo" role="status"></p><p>Arquivos alterados: ${esc(d.arquivos.join(', ')||'nenhum')}.</p><p>QA: ${d.qa.falhas.novos.length} nova(s) falha(s), ${d.qa.falhas.resolvidos.length} resolvida(s); ${d.qa.avisos.novos.length} novo(s) aviso(s), ${d.qa.avisos.resolvidos.length} resolvido(s).</p><ul>${['falhas','avisos'].flatMap(tipo=>['novos','resolvidos'].flatMap(estado=>d.qa[tipo][estado].map(item=>`<li>${esc(tipo+' '+estado+': '+item.msg)}</li>`))).join('')}</ul>`;
    const videos=[...resultado.querySelectorAll('video')],cena=resultado.querySelector('#versaoCena'),info=resultado.querySelector('#versaoCenaInfo');
    const ir=(v,t)=>{v.pause();if(v.readyState>=1)v.currentTime=t;else v.addEventListener('loadedmetadata',()=>{v.currentTime=t;},{once:true});};
    const atualizar=()=>{const c=d.cenas[Number(cena.value)];info.textContent=`Antes: ${c.antes?.fala||'cena ausente'}. Depois: ${c.depois?.fala||'cena ausente'}.`;};
    resultado.querySelector('#versaoInicio').onclick=()=>{const c=d.cenas[Number(cena.value)];[c.antes,c.depois].forEach((s,i)=>{if(s&&Number.isFinite(s.inicio))ir(videos[i],s.inicio);});atualizar();};
    resultado.querySelector('#versaoSincronizar').onclick=()=>{const c=d.cenas[Number(cena.value)];if(!c.antes||!c.depois)return;const p=Math.max(0,Math.min(1,(videos[0].currentTime-c.antes.inicio)/Math.max(.001,c.antes.fim-c.antes.inicio)));ir(videos[1],c.depois.inicio+p*(c.depois.fim-c.depois.inicio));};
    cena.onchange=atualizar;atualizar();
  }
  painel.querySelector('#versaoAntes').onchange=carregar;painel.querySelector('#versaoDepois').onchange=carregar;await carregar();
}
