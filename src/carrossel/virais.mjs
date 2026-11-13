/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{simboloDa as U}from"../simbolo.mjs";import{icone as k,MAO as I,rosto as N,seloPagina as B,avatarPagina as T,sublinhadoUri as Q,ROSTOS_NOMES as q,ICONES_NOMES as E}from"./elementos.mjs";import{destaqueTexto as L,VISUAIS_NOMES as R,degradeSuave as X,ruidoFino as J}from"./visuais.mjs";const s=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),d=t=>s(t).replace(/\*([^*]+)\*/g,'<b class="d">$1</b>').replace(/~([^~]+)~/g,'<span class="risco">$1</span>').replace(/\n/g,"<br>"),y=t=>String(t??"").replace(/[*~]/g,""),u=(t,o,e="")=>t?`<img class="${e}" src="${t}" alt="" style="object-position:${s(o||"50% 50%")}">`:"",K=t=>typeof t=="number"?t.toLocaleString("pt-BR"):s(t),H=["janeiro","fevereiro","mar\xE7o","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"],Z=["Domingo","Segunda-feira","Ter\xE7a-feira","Quarta-feira","Quinta-feira","Sexta-feira","S\xE1bado"],tt=(t=new Date)=>`${Z[t.getDay()]}, ${t.getDate()} de ${H[t.getMonth()]} de ${t.getFullYear()}`,at=(t=new Date)=>`${t.getDate()} de ${H[t.getMonth()]} de ${t.getFullYear()}`,ot=t=>`<div class="prog">${Array.from({length:t.total},(o,e)=>`<i class="${e<=t.i?"on":""}"></i>`).join("")}</div>`,et=(t,o,e)=>e?`<div class="cab">${t.semMarca?"":`<div class="marca">${U(t,{tamanho:40})}<span>${s(t.curto||"ilustrando")}</span></div>`}<span class="tema">${s(o)}</span></div>`:'<div class="cab cab-vazio"></div>',it=(t,o,e)=>{const r=o.i===o.total-1;return`<div class="rodape">${e==="contador"?`<span class="handle">${o.i+1}/${o.total}</span>`:`<span class="col"><span class="handle">${s(t.handle)}</span>${r?`<span class="assina">${s(t.assinatura)}</span>`:""}</span>`}${r?"":'<span class="seta">arraste <span>\u2192</span></span>'}</div>`},x=(t,o,e,r,a={})=>`<div class="slide v ${a.classe||""}">${a.fundo||""}${ot(o)}${et(t,e,a.cab!==!1)}<div class="corpo ${a.corpo||""}">${r}</div>${it(t,o,a.rodape)}</div>`,C=(t,o="")=>`<div class="fundo-foto">${u(t.imagem,t.foco)}<div class="vela-topo"></div><div class="vela-baixo ${o}"></div></div>`,S=t=>t?`<div class="fonte-linha">Fonte: ${s(t)}</div>`:"",b=(t,o="")=>t?`<h2 class="${o}">${d(t)}</h2>`:"",nt=t=>typeof t.valor=="number"?t.valor:parseFloat(String(t.valor).replace(/\./g,"").replace(",","."))||0,j=(t,o)=>s(t.texto??`${K(t.valor)}${o||""}`);function rt(t){const o=t.dados||[],e=t.unidade||"",r=o.map(nt),a=Math.max(...r,0)||1,i=t.forma||"barras",l=t.destaque??(i==="barras"||i==="pizza"?r.indexOf(Math.max(...r)):o.length-1);if(i==="barras")return`<div class="gb">${o.map((h,v)=>`<div class="gb-r ${v===l?"on":""}"><span class="gb-l">${s(h.rotulo)}</span><span class="gb-t"><i style="width:${Math.max(2,r[v]/a*100).toFixed(1)}%"></i></span><b class="gb-v">${j(h,e)}</b></div>`).join("")}</div>`;if(i==="colunas")return`<div class="gc">${o.map((h,v)=>`<div class="gc-c ${v===l?"on":""}"><b>${j(h,e)}</b><span class="gc-b" style="height:${Math.max(2,r[v]/a*100).toFixed(1)}%"></span><span class="gc-l">${s(h.rotulo)}</span></div>`).join("")}</div>`;if(i==="linha"){const M=t.zero===!1?Math.min(...r):0,Y=a-M||1,z=w=>56+w*760/Math.max(1,o.length-1),A=w=>70+420*(1-(w-M)/Y),O=r.map((w,m)=>`${z(m).toFixed(1)},${A(w).toFixed(1)}`).join(" "),W=new Set([0,o.length-1,l]),G=o.map((w,m)=>W.has(m)?`<text x="${z(m)}" y="542" class="gl-x" text-anchor="${m===0?"start":m===o.length-1?"end":"middle"}">${s(w.rotulo)}</text><text x="${z(m)}" y="${A(r[m])-26}" class="gl-v ${m===l?"on":""}" text-anchor="${m===0?"start":m===o.length-1?"end":"middle"}">${j(w,e)}</text>`:"").join("");return`<svg class="gl" viewBox="0 0 872 560" width="872" height="560"><defs><linearGradient id="gla" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--d)" stop-opacity=".32"/><stop offset="1" stop-color="var(--d)" stop-opacity="0"/></linearGradient></defs>
      <line x1="56" x2="816" y1="490" y2="490" class="gl-eixo"/>
      <polygon points="${z(0)},490 ${O} ${z(o.length-1)},490" fill="url(#gla)"/>
      <polyline points="${O}" class="gl-linha"/>${r.map((w,m)=>`<circle cx="${z(m)}" cy="${A(w)}" r="${m===l?14:8}" class="gl-p ${m===l?"on":""}"/>`).join("")}${G}</svg>`}const g=r.reduce((h,v)=>h+v,0)||1,n=190,c=2*Math.PI*n,f=["var(--d)","var(--g1)","var(--g2)","var(--g3)","var(--g4)"];let $=0;const V=r.map((h,v)=>{const F=h/g*c,D=`<circle cx="250" cy="250" r="${n}" fill="none" stroke="${f[v%f.length]}" stroke-width="84" stroke-dasharray="${F.toFixed(2)} ${(c-F).toFixed(2)}" stroke-dashoffset="${(-$).toFixed(2)}" transform="rotate(-90 250 250)"/>`;return $+=F,D}).join(""),_=o[l]||o[0]||{};return`<div class="gp"><svg viewBox="0 0 500 500" class="gp-svg">${V}<text x="250" y="262" text-anchor="middle" class="gp-c">${j(_,e)}</text></svg><ul class="gp-leg">${o.map((h,v)=>`<li class="${v===l?"on":""}"><i style="background:${f[v%f.length]}"></i><span>${s(h.rotulo)}</span><b>${j(h,e)}</b></li>`).join("")}</ul></div>`}const lt=/\b(def|return|print|if|elif|else|for|while|in|import|from|as|function|const|let|var|class|new|true|false|True|False|None|null|async|await|public|static|void|int|echo)\b/g;function st(t){return String(t||"").split(`
`).map(o=>{const e=[];let r=o;const a=r.match(/(^|\s)(#|\/\/).*$/);let i="";const l=a?r.slice(0,a.index+a[1].length):"";return a&&(l.split('"').length-1)%2===0&&(l.split("'").length-1)%2===0&&(i=r.slice(a.index+a[1].length),r=r.slice(0,a.index+a[1].length)),r.split(/("[^"]*"|'[^']*')/).forEach(g=>{/^["']/.test(g)?e.push(`<span class="k-s">${s(g)}</span>`):e.push(s(g).replace(lt,'<span class="k-c">$1</span>').replace(/\b(\d+(?:[.,]\d+)?)\b/g,'<span class="k-n">$1</span>'))}),e.join("")+(i?`<span class="k-x">${s(i)}</span>`:"")}).join(`
`)}const P=t=>s(t.nome||t.curto||t.handle),pt=(t,o)=>`<span class="${o} av-letra">${s(String(t||"?").trim().charAt(0).toUpperCase())}</span>`,ct={tweet:(t,o,e,r)=>x(o,e,r,`<article class="tw">
      <header class="tw-cab">${T(o,"av tw-av")}<div class="tw-id"><div class="tw-nome"><span>${P(o)}</span>${t.selo===!1||o.selo===!1?"":B()}</div><div class="tw-at">${s(o.handle)}</div></div></header>
      <div class="tw-txt ${t.imagem?y(t.texto).length>110?"tw-l":"":y(t.texto).length<=110?"tw-g":y(t.texto).length<=190?"tw-m":""}">${d(t.texto)}</div>
      ${t.imagem?`<div class="tw-img">${u(t.imagem,t.foco)}</div>`:""}
      ${t.data?`<div class="tw-data">${s(t.data)}</div>`:""}
    </article>`,{classe:"liso",cab:!1,rodape:"contador"}),thread:(t,o,e,r)=>x(o,e,r,`<div class="th ${(t.posts||[]).some(a=>a.imagem)||(t.posts||[]).reduce((a,i)=>a+y(i.texto).length,0)>220?"":"th-g"}">${(t.posts||[]).map((a,i,l)=>`<article class="th-post ${i<l.length-1?"liga":""}">${T(o,"av th-av")}<div class="th-c"><div class="th-id"><b>${P(o)}</b>${t.selo===!1||o.selo===!1?"":B()}<span>${s(o.handle)}</span></div><div class="th-txt">${d(a.texto)}</div>${a.imagem?`<div class="th-img">${u(a.imagem,a.foco)}</div>`:""}</div></article>`).join("")}</div>`,{classe:"liso",cab:!1,rodape:"contador"}),manchete:(t,o,e,r,a)=>x(o,e,r,`<div class="jn">
      <div class="jn-topo"><div class="jn-titulo">${s(t.jornal||o.nome||o.curto)}</div><div class="jn-linha"><span>${s(t.data||tt(a.hoje))}</span><span>${s(t.editoria||r)}</span></div></div>
      ${t.chapeu?`<div class="jn-chapeu">${s(t.chapeu)}</div>`:""}
      <h2 class="jn-h">${d(t.titulo)}</h2>
      ${t.linhafina?`<p class="jn-fina">${d(t.linhafina)}</p>`:""}
      ${t.imagem?`<figure class="jn-foto">${u(t.imagem,t.foco)}${t.legendaFoto?`<figcaption>${s(t.legendaFoto)}</figcaption>`:""}</figure>`:""}
      ${S(t.fonte)}
    </div>`,{classe:"liso papel-fibra",cab:!1}),plantao:(t,o,e,r)=>x(o,e,r,`<div class="pl"><div class="pl-rot"><i></i>${s(t.rotulo||"Agora")}</div><h2 class="pl-h">${d(t.titulo)}</h2>${t.texto?`<p class="p pl-p">${d(t.texto)}</p>`:""}<div class="pl-meta">${[t.hora,t.fonte&&`Fonte: ${t.fonte}`].filter(Boolean).map(s).join("<i></i>")}</div></div>`,{classe:t.imagem?"liso sobre-foto":"",fundo:t.imagem?C(t,"forte"):"",corpo:t.imagem?"baixo":""}),chat:(t,o,e,r)=>{const a=t.contato||o.nome,i=t.contato?pt(a,"av ch-av"):T(o,"av ch-av");return x(o,e,r,`<div class="ch"><div class="ch-cab"><span class="ch-volta">\u2039</span>${i}<div class="ch-id"><b>${s(a)}</b><small>${s(t.status||"online")}</small></div></div>
      <div class="ch-msgs">${(t.mensagens||[]).map(l=>`<div class="bal ${l.de==="eu"?"eu":"ele"}"><span>${d(l.texto)}</span>${l.hora?`<i>${s(l.hora)}</i>`:""}</div>`).join("")}${t.digitando?'<div class="bal ele dig"><b></b><b></b><b></b></div>':""}</div></div>`)},nota:(t,o,e,r,a)=>x(o,e,r,`<div class="nt"><div class="nt-barra"><span class="nt-volta">\u2039 ${s(t.pasta||"Notas")}</span><span class="nt-ic">${k("documento")}<i>\u2022\u2022\u2022</i></span></div>
      <div class="nt-data">${s(t.data||at(a.hoje))}</div>
      <h2 class="nt-t">${d(t.titulo)}</h2>${t.texto?`<p class="nt-p">${d(t.texto)}</p>`:""}
      ${(t.itens||[]).length?`<ul class="nt-lista">${t.itens.map(i=>{const l=typeof i=="string"?{texto:i}:i;return`<li class="${l.feito?"ok":""}"><i>${l.feito?k("check"):""}</i><span>${d(l.texto)}</span></li>`}).join("")}</ul>`:""}</div>`,{classe:"liso",corpo:"topo"}),podio:(t,o,e,r)=>x(o,e,r,`${b(t.titulo)}<div class="pd">${[1,0,2].map(a=>{const i=(t.itens||[])[a]||{};return`<div class="pd-col p${a+1}">${i.imagem?`<span class="pd-foto">${u(i.imagem,i.foco)}</span>`:""}<div class="pd-nome">${d(i.nome)}</div><div class="pd-val">${s(i.valor)}</div><div class="pd-bloco"><span>${a+1}</span></div></div>`}).join("")}</div>`),veredito:(t,o,e,r)=>{const a={mito:["MITO","xis"],verdade:["VERDADE","visto"],meia:["EM PARTE",null]}[t.veredito]||["MITO","xis"];return x(o,e,r,`<div class="vd"><div class="vd-afirma">\u201C${s(y(t.afirmacao))}\u201D</div><div class="vd-carimbo ${s(t.veredito)}">${a[1]?I[a[1]]:""}<span>${a[0]}</span></div>${t.explicacao?`<p class="vd-exp">${d(t.explicacao)}</p>`:""}</div>`)},grafico:(t,o,e,r)=>x(o,e,r,`${b(t.titulo)}${t.texto?`<p class="p g-p">${d(t.texto)}</p>`:""}<div class="g g-${s(t.forma||"barras")}">${rt(t)}</div>${S(t.fonte)}`),reacao:(t,o,e,r)=>{const a=t.quadros||[];return a.length>=2?x(o,e,r,`${b(t.titulo,"rc-t")}<div class="rc2">${a.map(i=>`<div class="rc-l"><div class="rc-cx">${i.imagem?u(i.imagem,i.foco):N(i.rosto||"neutro")}</div><p>${d(i.texto)}</p></div>`).join("")}</div>`):x(o,e,r,`<p class="rc-topo">${d(t.topo||t.titulo)}</p><div class="rc-grande">${t.imagem?u(t.imagem,t.foco):N(t.rosto||"choque")}</div>${t.legenda?`<p class="rc-leg">${d(t.legenda)}</p>`:""}`)},citacao:(t,o,e,r)=>x(o,e,r,`<div class="ct"><span class="ct-aspas" data-qa="deco">\u201C</span><blockquote class="ct-f">${d(t.frase)}</blockquote><div class="ct-autor"><b>${s(t.autor)}</b>${t.cargo?`<span>${s(t.cargo)}</span>`:""}</div></div>`,t.imagem?{classe:"liso com-faixa sobre-foto",fundo:`<div class="faixa-foto ${t.cor===!0?"":"pb"}">${u(t.imagem,t.foco)}<div class="vela-topo"></div><div class="vela-faixa"></div></div>`,corpo:"baixo"}:{}),passo:(t,o,e,r,a)=>{const i=t.numero===void 0,l=i?a.ordem:t.numero;return x(o,e,r,`<div class="pa"><div class="pa-topo"><span class="pa-num" data-qa="deco">${s(/^\d+$/.test(String(l))?String(l).padStart(2,"0"):l)}</span>${i&&a.totalDoTipo>1?`<span class="pa-de">de ${String(a.totalDoTipo).padStart(2,"0")}</span>`:""}${t.icone?`<span class="pa-ic">${k(t.icone)}</span>`:""}</div><h2>${d(t.titulo)}</h2>${t.texto?`<p class="p">${d(t.texto)}</p>`:""}${t.imagem?`<div class="pa-img">${u(t.imagem,t.foco)}</div>`:""}</div>`)},tabela:(t,o,e,r)=>{const a=t.colunas||[],i=t.destaque??-1,l=g=>g===!0||g==="sim"?`<span class="tb-ok">${k("check")}</span>`:g===!1||g==="nao"||g==="n\xE3o"?`<span class="tb-no">${k("xis")}</span>`:d(g);return x(o,e,r,`${b(t.titulo)}<div class="tb" style="--n:${a.length}"><div class="tb-r tb-cab"><span></span>${a.map((g,n)=>`<span class="${n===i?"on":""}">${s(g)}</span>`).join("")}</div>${(t.linhas||[]).map(g=>`<div class="tb-r"><span class="tb-rot">${d(g.rotulo)}</span>${(g.valores||[]).map((n,c)=>`<span class="${c===i?"on":""}">${l(n)}</span>`).join("")}</div>`).join("")}</div>${S(t.fonte)}`)},vocesabia:(t,o,e,r)=>x(o,e,r,`<span class="adesivo">${s(t.rotulo||"Voc\xEA sabia?")}</span><h2 class="vs-h">${d(t.titulo)}</h2>${t.texto?`<p class="p vs-p">${d(t.texto)}</p>`:""}`,{classe:"liso sobre-foto",fundo:C(t),corpo:"baixo"}),capafoto:(t,o,e,r)=>x(o,e,r,`${t.rotulo?`<span class="cf-rot">${s(t.rotulo)}</span>`:""}<h1 class="cf-h">${d(t.titulo)}</h1>${t.sub?`<p class="p cf-p">${d(t.sub)}</p>`:""}`,{classe:"liso sobre-foto",fundo:C(t),corpo:"baixo"}),revista:(t,o,e,r)=>{const a=String(t.texto||""),i=a.charAt(0);return x(o,e,r,`<div class="rv">${t.imagem?`<div class="rv-foto">${u(t.imagem,t.foco)}</div>`:""}<div class="rv-sec"><span>${s(t.secao||r)}</span><span>${s(t.numero||String(e.i+1).padStart(2,"0"))}</span></div><h2 class="rv-h">${d(t.titulo)}</h2>${a?`<p class="rv-p"><span class="rv-cap">${s(i)}</span>${d(a.slice(1))}</p>`:""}</div>`,{classe:"liso papel-fibra",cab:!1})},colagem:(t,o,e,r)=>{const a=(t.fotos||[]).slice(0,3),i=a.length;return x(o,e,r,`<div class="cg cg${i}">${t.titulo?`<div class="cg-t">${d(t.titulo)}</div>`:""}${a.map((l,g)=>`<figure class="pol pol${g+1}"><span class="fita"></span>${u(l.imagem,l.foco)}${l.legenda?`<figcaption>${s(l.legenda)}</figcaption>`:""}</figure>`).join("")}${t.nota?`<div class="cg-nota">${d(t.nota)}</div>${I.seta.replace('class="mao-seta"','class="mao-seta cg-seta"')}`:""}${t.adesivo?`<span class="cg-ades">${s(t.adesivo)}</span>`:""}</div>`,{classe:"liso papel-grade",corpo:"cheio"})},tipografico:(t,o,e,r)=>x(o,e,r,`<div class="tp"><div class="tp-txt">${d(t.texto)}</div>${t.apoio?`<p class="tp-ap">${d(t.apoio)}</p>`:""}</div>`,{classe:`liso ${t.fundo==="destaque"?"fundo-d":""}`}),definicao:(t,o,e,r)=>x(o,e,r,`<div class="df"><div class="df-pal">${s(t.palavra)}</div><div class="df-fon">${[t.fonetica,t.classe].filter(Boolean).map(s).join(" <i>\xB7</i> ")}</div><ol class="df-sig">${[].concat(t.definicao||[]).map(a=>`<li>${d(a)}</li>`).join("")}</ol>${t.exemplo?`<p class="df-ex">\u201C${d(t.exemplo)}\u201D</p>`:""}${t.origem?`<p class="df-or"><b>Origem</b> ${d(t.origem)}</p>`:""}</div>`),linhatempo:(t,o,e,r)=>{const a=t.destaque??(t.marcos||[]).length-1;return x(o,e,r,`${b(t.titulo)}<div class="lt">${(t.marcos||[]).map((i,l)=>`<div class="lt-m ${l===a?"on":""}"><div class="lt-ano">${s(i.ano)}</div><div class="lt-pt"></div><p>${d(i.texto)}</p></div>`).join("")}</div>`)},quiz:(t,o,e,r)=>x(o,e,r,`<h2 class="qz-p">${d(t.pergunta)}</h2><div class="qz">${(t.opcoes||[]).map((a,i)=>`<div class="qz-o ${t.revelar?i===t.resposta?"certa":"apaga":""}"><i>${"ABCD"[i]}</i><span>${s(a)}</span>${t.revelar&&i===t.resposta?k("check","ic qz-ok"):""}</div>`).join("")}</div>${t.revelar&&t.explicacao?`<p class="p qz-exp">${d(t.explicacao)}</p>`:t.dica?`<p class="sub qz-dica">${s(t.dica)}</p>`:""}`),receita:(t,o,e,r)=>{const a=t.ingredientes||[];return x(o,e,r,`${t.imagem?`<div class="rcp-foto">${u(t.imagem,t.foco)}</div>`:""}${b(t.titulo)}<div class="rcp-info">${[["relogio",t.tempo],["pessoas",t.porcoes],["chapeu",t.dificuldade]].filter(i=>i[1]).map(([i,l])=>`<span>${k(i)}${s(l)}</span>`).join("")}</div><ul class="rcp-ing ${a.length>5?"duas":""}">${a.map(i=>`<li><i></i><span>${d(i)}</span></li>`).join("")}</ul>`)},placar:(t,o,e,r)=>{const a=t.casa||{},i=t.fora||{},l=Number(a.gols),g=Number(i.gols),n=c=>`<div class="pc-time"><span class="pc-sig">${s(c.sigla||String(c.nome||"").slice(0,3).toUpperCase())}</span><b>${s(c.nome)}</b></div>`;return x(o,e,r,`${t.competicao?`<div class="pc-comp">${s(t.competicao)}</div>`:""}<div class="pc">${n(a)}<div class="pc-gols"><span class="${l>g?"on":""}">${s(a.gols)}</span><i>x</i><span class="${g>l?"on":""}">${s(i.gols)}</span></div>${n(i)}</div>${t.info?`<div class="pc-info">${s(t.info)}</div>`:""}${(t.lances||[]).length?`<ul class="pc-lances">${t.lances.map(c=>`<li><b>${s(c.minuto)}</b><span>${d(c.texto)}</span></li>`).join("")}</ul>`:""}`)},codigo:(t,o,e,r)=>x(o,e,r,`${b(t.titulo,"cd-t")}<div class="cd"><div class="cd-barra"><i></i><i></i><i></i><span>${s(t.arquivo||t.linguagem||"")}</span></div><pre class="cd-pre">${st(t.codigo)}</pre></div>${t.legenda?`<p class="p">${d(t.legenda)}</p>`:""}`),versiculo:(t,o,e,r)=>x(o,e,r,`<div class="vr"><div class="vr-orn"><i></i><b></b><i></i></div><p class="vr-t">${d(t.texto)}</p><div class="vr-ref">${s(t.referencia)}</div>${t.versao?`<div class="vr-ver">${s(t.versao)}</div>`:""}</div>`,{classe:"liso vr-luz"}),informativo:(t,o,e,r)=>x(o,e,r,`${b(t.titulo)}<div class="if">${(t.linhas||[]).map(a=>`<div class="if-l"><span class="if-ic">${k(a.icone||"info")}</span><div><b>${d(a.rotulo)}</b>${a.texto?`<p>${d(a.texto)}</p>`:""}</div></div>`).join("")}</div>${t.nota?`<p class="sub">${s(t.nota)}</p>`:""}`),numeros:(t,o,e,r)=>{const a=t.itens||[],i=t.destaque??0;return x(o,e,r,`${b(t.titulo)}<div class="nm n${a.length}">${a.map((l,g)=>`<div class="nm-i ${g===i?"on":""}"><div class="nm-n">${s(l.numero)}</div><p>${d(l.legenda)}</p></div>`).join("")}</div>${S(t.fonte)}`)},anotada:(t,o,e,r)=>{let a=0;const i=l=>{const g=Number(l.x)||50,n=Number(l.y)||50,c=l.lado||(g>55?"esq":"dir"),f=l.tipo==="ponto",$=l.texto?`<span class="an-et an-${s(c)}">${s(l.texto)}</span>`:"";return f?`<span class="an-m an-ponto" style="left:${g}%;top:${n}%">${++a}${$}</span>`:`<span class="an-m an-circ" style="left:${g}%;top:${n}%;width:${Number(l.tamanho)||24}%">${I.circulo}${$}</span>`};return x(o,e,r,`${b(t.titulo,"an-t")}<div class="an" style="height:${Number(t.altura)||720}px"><div class="an-in">${u(t.imagem,t.foco)}${(t.marcas||[]).map(i).join("")}</div></div>${t.texto?`<p class="p an-p">${d(t.texto)}</p>`:""}`)},divisao:(t,o,e,r)=>{const a=t.antes||{},i=t.depois||{},l=Number(t.corte)||50;return x(o,e,r,`${b(t.titulo,"dv-t")}<div class="dv" style="height:${Number(t.altura)||700}px;--c:${l}%"><div class="dv-a">${u(a.imagem,a.foco)}</div><div class="dv-b">${u(i.imagem,i.foco)}</div><span class="dv-linha"></span><span class="dv-alca">\u2039 \u203A</span><span class="dv-rot e">${s(a.rotulo||"Antes")}</span><span class="dv-rot d">${s(i.rotulo||"Depois")}</span></div>${t.texto?`<p class="p dv-p">${d(t.texto)}</p>`:""}`)}},dt={tweet:{uso:"post da pr\xF3pria p\xE1gina no estilo rede de texto curto; carrossel inteiro em posts (claro ou escuro)",paginas:["curiosidades","aula","financas","negocio","tecnologia","fe"],campos:"texto, imagem?, data?, selo?, modo?"},thread:{uso:"fio com 2 ou 3 posts encadeados por slide, para explica\xE7\xE3o em sequ\xEAncia",paginas:["aula","historia","tecnologia","curiosidades"],campos:"posts[{texto, imagem?}] (2 a 3)"},manchete:{uso:"capa de jornal com a manchete do fato; not\xEDcia, ci\xEAncia, hist\xF3ria",paginas:["noticia","ciencia","historia","esporte"],visual:"papel",campos:"titulo, chapeu?, linhafina?, imagem?, legendaFoto?, fonte?, editoria?, data?, jornal?"},plantao:{uso:"not\xEDcia urgente com selo AGORA, foto opcional no fundo",paginas:["noticia","esporte","tecnologia"],visual:"escuro",campos:"titulo, texto?, rotulo?, hora?, fonte?, imagem?"},chat:{uso:"conversa de mensagens entre quem l\xEA (eu) e a p\xE1gina; d\xFAvida e resposta",paginas:["financas","saude","aula","negocio","curiosidades"],campos:"mensagens[{de: eu|pagina, texto, hora?}] (2 a 6), contato?, status?, digitando?"},nota:{uso:"bloco de notas do celular: lista, checklist, lembrete",paginas:["saude","receita","aula","negocio","fe"],visual:"claro",campos:"titulo, texto?, itens[texto | {texto, feito}]?, data?, pasta?"},podio:{uso:"p\xF3dio dos 3 primeiros, com foto opcional",paginas:["esporte","curiosidades","financas","historia"],campos:"titulo, itens[{nome, valor, imagem?}] (3, do 1\xBA ao 3\xBA)"},veredito:{uso:"mito ou verdade com carimbo; uma afirma\xE7\xE3o por slide",paginas:["saude","ciencia","curiosidades","financas","tecnologia"],campos:"afirmacao, veredito: mito|verdade|meia, explicacao"},grafico:{uso:"gr\xE1fico de dados: barras, colunas, linha (s\xE9rie no tempo) ou pizza (partes de um todo)",paginas:["financas","noticia","ciencia","esporte","saude"],campos:"titulo, forma: barras|colunas|linha|pizza, dados[{rotulo, valor, texto?}], unidade?, destaque?, fonte, texto?"},reacao:{uso:"quadro de rea\xE7\xE3o com rostos pr\xF3prios (ou foto livre): 1 quadro grande ou 2 em sequ\xEAncia",paginas:["curiosidades","tecnologia","financas","aula"],campos:"topo, rosto, legenda? | quadros[{rosto|imagem, texto}] (2)"},citacao:{uso:"cita\xE7\xE3o real conferida, com foto livre da pessoa em faixa",paginas:["historia","fe","ciencia","negocio","esporte"],campos:"frase, autor, cargo?, imagem?, cor?"},passo:{uso:"um passo por slide, com numeral grande, \xEDcone ou foto",paginas:["aula","receita","saude","tecnologia","negocio"],campos:"titulo, texto?, icone?, imagem?, numero?"},tabela:{uso:"comparativo em tabela com visto e xis (at\xE9 3 colunas e 6 linhas)",paginas:["tecnologia","financas","saude","negocio","aula"],campos:"titulo, colunas[...], linhas[{rotulo, valores[...]}], destaque?, fonte?"},vocesabia:{uso:'"voc\xEA sabia?" com foto grande de ponta a ponta',paginas:["curiosidades","ciencia","historia","fe"],visual:"escuro",foto:!0,campos:"imagem, titulo, texto?, rotulo?, foco?"},capafoto:{uso:"capa forte com foto de ponta a ponta e manchete embaixo",paginas:["curiosidades","noticia","esporte","historia","receita"],visual:"escuro",foto:!0,campos:"imagem, titulo, sub?, rotulo?, foco?"},revista:{uso:"editorial de revista: foto, manchete serifada e texto com capitular",paginas:["historia","ciencia","fe","negocio"],visual:"papel",campos:"titulo, texto, imagem?, secao?, numero?"},colagem:{uso:"scrapbook: polaroides com fita, nota \xE0 m\xE3o e adesivo",paginas:["historia","receita","curiosidades","negocio"],visual:"papel",campos:"fotos[{imagem, legenda?}] (1 a 3), titulo?, nota?, adesivo?"},tipografico:{uso:"minimalista tipogr\xE1fico: uma frase gigante (fundo da marca opcional)",paginas:["curiosidades","fe","financas","ciencia"],campos:"texto, apoio?, fundo?: destaque"},definicao:{uso:"verbete de dicion\xE1rio: palavra, pron\xFAncia, classe e significado",paginas:["aula","curiosidades","historia","ciencia"],campos:"palavra, definicao, fonetica?, classe?, exemplo?, origem?"},linhatempo:{uso:"linha do tempo com anos grandes (3 a 5 marcos)",paginas:["historia","tecnologia","esporte","noticia"],campos:"titulo, marcos[{ano, texto}], destaque?"},quiz:{uso:"pergunta com op\xE7\xF5es; repita o slide com revelar: true para a resposta",paginas:["curiosidades","aula","saude","esporte","fe"],campos:"pergunta, opcoes[...] (2 a 4), resposta, revelar?, explicacao?, dica?"},receita:{uso:"ficha de receita: foto, tempo, por\xE7\xF5es e ingredientes",paginas:["receita","negocio"],campos:"titulo, ingredientes[...], tempo?, porcoes?, dificuldade?, imagem?"},placar:{uso:"placar de jogo com siglas, gols e lances",paginas:["esporte"],campos:"casa{nome, sigla?, gols}, fora{...}, competicao?, info?, lances[{minuto, texto}]?"},codigo:{uso:"janela de c\xF3digo com cor nas palavras-chave",paginas:["tecnologia","aula"],campos:"codigo, linguagem?, arquivo?, titulo?, legenda?"},versiculo:{uso:"vers\xEDculo ou trecho sagrado com refer\xEAncia e vers\xE3o",paginas:["fe"],campos:"texto, referencia, versao?"},informativo:{uso:"linhas com \xEDcone: hor\xE1rio, endere\xE7o, prazos, contatos, direitos",paginas:["negocio","saude","noticia","aula"],campos:"titulo, linhas[{icone, rotulo, texto?}] (2 a 5), nota?"},numeros:{uso:"painel de 2 a 4 n\xFAmeros grandes com legenda",paginas:["financas","noticia","esporte","historia","ciencia"],campos:"titulo, itens[{numero, legenda}], destaque?, fonte?"},anotada:{uso:"foto com c\xEDrculos e etiquetas \xE0 m\xE3o apontando detalhes",paginas:["curiosidades","historia","ciencia","tecnologia"],foto:!0,campos:"imagem, marcas[{x, y, texto, tipo?: circulo|ponto, lado?, tamanho?}], titulo?, texto?, altura?"},divisao:{uso:"antes e depois em foto, cortadas na al\xE7a como um comparador",paginas:["ciencia","historia","noticia","negocio","saude"],foto:!0,campos:"antes{imagem, rotulo}, depois{imagem, rotulo}, titulo?, texto?, corte?"}},ht=Object.keys(ct),vt=(t,o)=>R.includes(t.modo)?t.modo:dt[t.tipo]?.visual||(R.includes(o)?o:"escuro"),p={tweet:280,tweetFoto:150,post:150,postsTotal:300,manchete:90,linhafina:140,plantao:80,msg:90,notaT:40,notaItem:48,notaTexto:160,nome:22,valor:12,afirmacao:90,explicacao:150,rotulo:18,frase:150,autor:40,cargo:60,passoT:44,passoX:150,tabCel:14,tabRot:22,vsT:70,vsX:140,capaT:60,revT:70,revX:240,legPol:22,nota:70,tipo:40,palavra:14,def:160,ano:6,marco:64,pergunta:80,opcao:32,ingr:34,time:16,lance:36,codLinha:32,codLinhas:12,versiculo:170,ref:30,ifRot:32,ifX:70,numero:8,numLeg:60,etiqueta:22,titulo:50};function bt(t,o,e,r){const a=(n,c,f)=>{y(c).length>f&&r.push(`slide ${o}, ${n}: ${y(c).length} caracteres (m\xE1ximo ${f}). Encurte o texto.`)},i=(n,c)=>{(c==null||c===""||Array.isArray(c)&&!c.length)&&e.push(`slide ${o}: falta "${n}".`)},l=(n,c,f,$)=>!Array.isArray(c)||c.length<f||c.length>$?(e.push(`slide ${o}: "${n}" precisa ter de ${f} a ${$} itens.`),!1):!0,g=(n,c)=>{c||e.push(`slide ${o}: "${n}" precisa de uma foto (assets/arquivo.jpg, de licen\xE7a livre, via scripts/buscar-imagem.mjs).`)};switch(t.tipo){case"tweet":i("texto",t.texto),a("texto",t.texto,t.imagem?p.tweetFoto:p.tweet);break;case"thread":if(l("posts",t.posts,2,3)){t.posts.forEach((c,f)=>{i(`posts[${f}].texto`,c.texto),a(`post ${f+1}`,c.texto,c.imagem?90:p.post)});const n=t.posts.reduce((c,f)=>c+y(f.texto).length+(f.imagem?140:0),0);n>p.postsTotal&&r.push(`slide ${o}: os posts somam ${n} caracteres (foto conta 140; m\xE1ximo ${p.postsTotal}). Divida em dois slides.`)}break;case"manchete":i("titulo",t.titulo),a("titulo",t.titulo,t.imagem?70:p.manchete),a("linhafina",t.linhafina,t.imagem?100:p.linhafina),a("chapeu",t.chapeu,24);break;case"plantao":i("titulo",t.titulo),a("titulo",t.titulo,p.plantao),a("texto",t.texto,120);break;case"chat":if(l("mensagens",t.mensagens,2,6)){t.mensagens.forEach((c,f)=>{i(`mensagens[${f}].texto`,c.texto),a(`mensagem ${f+1}`,c.texto,p.msg),c.de&&!["eu","pagina","ele","ela"].includes(c.de)&&r.push(`slide ${o}: mensagem ${f+1} com de "${c.de}": use eu (quem l\xEA, \xE0 direita) ou pagina (\xE0 esquerda).`)});const n=t.mensagens.reduce((c,f)=>c+y(f.texto).length,0);n>330&&r.push(`slide ${o}: a conversa soma ${n} caracteres (m\xE1ximo 330). Divida em dois slides.`)}break;case"nota":i("titulo",t.titulo),a("titulo",t.titulo,p.notaT),a("texto",t.texto,p.notaTexto),t.itens&&(t.itens.length>7&&e.push(`slide ${o}: nota com ${t.itens.length} itens (m\xE1ximo 7).`),t.itens.forEach(n=>a("item",typeof n=="string"?n:n.texto,p.notaItem))),!t.texto&&!(t.itens||[]).length&&e.push(`slide ${o}: a nota precisa de "texto" ou "itens".`);break;case"podio":i("titulo",t.titulo),a("titulo",t.titulo,40),l("itens",t.itens,3,3)&&t.itens.forEach(n=>{n.nome||e.push(`slide ${o}: item do p\xF3dio sem nome.`),a("nome",n.nome,p.nome),a("valor",n.valor,p.valor)});break;case"veredito":i("afirmacao",t.afirmacao),["mito","verdade","meia"].includes(t.veredito)||e.push(`slide ${o}: "veredito" precisa ser mito, verdade ou meia.`),a("afirmacao",t.afirmacao,p.afirmacao),a("explicacao",t.explicacao,p.explicacao);break;case"grafico":{const n=["barras","colunas","linha","pizza"];t.forma&&!n.includes(t.forma)&&e.push(`slide ${o}: forma "${t.forma}" n\xE3o existe (${n.join(", ")}).`);const c={barras:6,colunas:7,linha:12,pizza:5}[t.forma||"barras"]||6;l("dados",t.dados,2,c)&&t.dados.forEach(f=>{(f.rotulo===void 0||f.valor===void 0)&&e.push(`slide ${o}: dado do gr\xE1fico sem rotulo ou valor.`),a("rotulo",f.rotulo,t.forma==="colunas"?8:16)}),t.fonte||r.push(`slide ${o}: gr\xE1fico sem "fonte" na tela. Dado de gr\xE1fico sempre mostra de onde veio.`),a("titulo",t.titulo,p.titulo),a("texto",t.texto,90);break}case"reacao":(t.quadros||[]).length>=2?(l("quadros",t.quadros,2,2),t.quadros.forEach(n=>{a("texto do quadro",n.texto,60),n.rosto&&!q.includes(n.rosto)&&e.push(`slide ${o}: rosto "${n.rosto}" n\xE3o existe (${q.join(", ")}).`)}),a("titulo",t.titulo,40)):(i("topo",t.topo||t.titulo),a("topo",t.topo||t.titulo,70),a("legenda",t.legenda,60),t.rosto&&!q.includes(t.rosto)&&e.push(`slide ${o}: rosto "${t.rosto}" n\xE3o existe (${q.join(", ")}).`));break;case"citacao":i("frase",t.frase),i("autor",t.autor),a("frase",t.frase,t.imagem?110:p.frase),a("autor",t.autor,p.autor),a("cargo",t.cargo,p.cargo);break;case"passo":i("titulo",t.titulo),a("titulo",t.titulo,p.passoT),a("texto",t.texto,t.imagem?80:p.passoX),t.icone&&!E.includes(t.icone)&&e.push(`slide ${o}: \xEDcone "${t.icone}" n\xE3o existe (${E.join(", ")}).`);break;case"tabela":i("titulo",t.titulo),a("titulo",t.titulo,40),l("colunas",t.colunas,2,3)&&(t.colunas.forEach(n=>a("coluna",n,p.tabCel)),l("linhas",t.linhas,2,6)&&t.linhas.forEach((n,c)=>{a("r\xF3tulo da linha",n.rotulo,p.tabRot),!Array.isArray(n.valores)||n.valores.length!==t.colunas.length?e.push(`slide ${o}: linha ${c+1} precisa de ${t.colunas.length} valores.`):n.valores.forEach(f=>typeof f=="string"&&a("c\xE9lula",f,p.tabCel))}));break;case"vocesabia":g("imagem",t.imagem),i("titulo",t.titulo),a("titulo",t.titulo,p.vsT),a("texto",t.texto,p.vsX),a("rotulo",t.rotulo,p.rotulo);break;case"capafoto":g("imagem",t.imagem),i("titulo",t.titulo),a("titulo",t.titulo,p.capaT),a("sub",t.sub,110),a("rotulo",t.rotulo,p.rotulo);break;case"revista":i("titulo",t.titulo),a("titulo",t.titulo,t.imagem?50:p.revT),a("texto",t.texto,t.imagem?160:p.revX);break;case"colagem":l("fotos",t.fotos,1,3)&&t.fotos.forEach((n,c)=>{g(`fotos[${c}].imagem`,n.imagem),a("legenda da foto",n.legenda,p.legPol)}),a("nota",t.nota,p.nota),a("adesivo",t.adesivo,14),a("titulo",t.titulo,30);break;case"tipografico":i("texto",t.texto),a("texto",t.texto,p.tipo),a("apoio",t.apoio,90);break;case"definicao":i("palavra",t.palavra),i("definicao",t.definicao),a("palavra",t.palavra,p.palavra),[].concat(t.definicao||[]).forEach(n=>a("definicao",n,p.def)),a("exemplo",t.exemplo,90),a("origem",t.origem,90);break;case"linhatempo":a("titulo",t.titulo,40),l("marcos",t.marcos,3,5)&&t.marcos.forEach(n=>{(!n.ano||!n.texto)&&e.push(`slide ${o}: marco sem ano ou texto.`),a("ano",n.ano,p.ano),a("marco",n.texto,p.marco)});break;case"quiz":i("pergunta",t.pergunta),a("pergunta",t.pergunta,p.pergunta),l("opcoes",t.opcoes,2,4)&&t.opcoes.forEach(n=>a("op\xE7\xE3o",n,p.opcao)),t.revelar&&!(Number.isInteger(t.resposta)&&t.resposta>=0&&t.resposta<(t.opcoes||[]).length)&&e.push(`slide ${o}: quiz com revelar precisa de "resposta" (0 para A, 1 para B...).`),a("explicacao",t.explicacao,110);break;case"receita":i("titulo",t.titulo),a("titulo",t.titulo,40),l("ingredientes",t.ingredientes,2,t.imagem?6:10)&&t.ingredientes.forEach(n=>a("ingrediente",n,t.ingredientes.length>5?22:p.ingr));break;case"placar":["casa","fora"].forEach(n=>{!t[n]?.nome||t[n]?.gols===void 0?e.push(`slide ${o}: "${n}" precisa de nome e gols.`):a(`${n}.nome`,t[n].nome,p.time)}),(t.lances||[]).length>5&&e.push(`slide ${o}: no m\xE1ximo 5 lances.`),(t.lances||[]).forEach(n=>a("lance",n.texto,p.lance)),a("info",t.info,60);break;case"codigo":{i("codigo",t.codigo);const n=String(t.codigo||"").split(`
`);n.length>p.codLinhas&&r.push(`slide ${o}: c\xF3digo com ${n.length} linhas (m\xE1ximo ${p.codLinhas}).`),n.forEach((c,f)=>{c.length>p.codLinha&&r.push(`slide ${o}: linha ${f+1} do c\xF3digo com ${c.length} caracteres (m\xE1ximo ${p.codLinha}). Quebre a linha.`)}),a("legenda",t.legenda,110),a("titulo",t.titulo,40);break}case"versiculo":i("texto",t.texto),i("referencia",t.referencia),a("texto",t.texto,p.versiculo),a("referencia",t.referencia,p.ref),t.versao||r.push(`slide ${o}: diga a vers\xE3o (ex.: Almeida Revista e Corrigida). Trecho curto, citado com refer\xEAncia.`);break;case"informativo":i("titulo",t.titulo),a("titulo",t.titulo,40),l("linhas",t.linhas,2,5)&&t.linhas.forEach(n=>{n.rotulo||e.push(`slide ${o}: linha do informativo sem rotulo.`),a("rotulo",n.rotulo,p.ifRot),a("texto",n.texto,p.ifX),n.icone&&!E.includes(n.icone)&&e.push(`slide ${o}: \xEDcone "${n.icone}" n\xE3o existe (${E.join(", ")}).`)});break;case"numeros":i("titulo",t.titulo),a("titulo",t.titulo,40),l("itens",t.itens,2,4)&&t.itens.forEach(n=>{n.numero||e.push(`slide ${o}: item sem numero.`),a("numero",n.numero,p.numero),a("legenda",n.legenda,p.numLeg)});break;case"anotada":g("imagem",t.imagem),a("titulo",t.titulo,40),a("texto",t.texto,90),l("marcas",t.marcas,1,4)&&t.marcas.forEach(n=>{n.x>=0&&n.x<=100&&n.y>=0&&n.y<=100||e.push(`slide ${o}: marca precisa de x e y entre 0 e 100 (porcentagem da foto).`),a("etiqueta",n.texto,p.etiqueta)});break;case"divisao":["antes","depois"].forEach(n=>{g(`${n}.imagem`,t[n]?.imagem),a(`${n}.rotulo`,t[n]?.rotulo,14)}),a("titulo",t.titulo,40),a("texto",t.texto,90);break}}const $t=(t,o,e,r,a)=>{const i=(c,f,$="")=>f?`@font-face{font-family:'${c}';${$}src:url(data:font/ttf;base64,${f}) format('truetype')}`:"",l=r!=="escuro",g=L(o.destaque,t.fundo),n=a?.base?.fundo||"#0E0E13";return`
${i("IluSerif",e.serif,"font-style:normal;")}${i("IluSerif",e.serifItalico,"font-style:italic;")}${i("IluMono",e.mono)}${i("IluMao",e.mao)}${i("IluCond",e.cond)}
:root{--bg:${t.fundo};--sf:${t.superficie};--sf2:${t.superficie2};--tx:${t.texto};--tx2:${t.textoSuave};--tx3:${t.textoFraco};--ln:${t.linha};
  --dt:${g};--avbg:${n};--mt:${o.apoio}${l?"CC":"55"};
  --g1:${t.texto}B3;--g2:${t.texto}73;--g3:${t.texto}40;--g4:${t.texto}26;
  --serif:'IluSerif','Instrument Serif',Georgia,serif;--mono:'IluMono','JetBrains Mono',ui-monospace,monospace;--mao:'IluMao','Euphoria Script',cursive;--disp:'IluD','Ilu',system-ui,sans-serif}
.d{color:var(--dt)}
.seta{color:var(--dt)}
.p .d{color:${l?"var(--dt)":"var(--ap)"}}
.risco{background:${Q(o.destaque)} no-repeat 0 100%/100% .28em;padding-bottom:.08em}
.marca svg rect{fill:var(--tx)} .marca svg text{fill:var(--tx)}
.slide.liso::before,.slide.liso::after{display:none}
.slide>.fundo-foto,.slide>.faixa-foto{position:absolute;z-index:0}
.cab-vazio{height:40px}
.corpo.topo{justify-content:flex-start;padding-top:40px}
.corpo.baixo{justify-content:flex-end;padding-bottom:40px}
.corpo.cheio{justify-content:stretch;padding:24px 0 30px}
.v h2{text-wrap:balance}
.ic{width:1em;height:1em;flex:none}
.fonte-linha{margin-top:28px;font-size:26px;color:var(--tx3);letter-spacing:0}
img{display:block;width:100%;height:100%;object-fit:cover}

/* foto de ponta a ponta com v\xE9u para o texto */
.fundo-foto{inset:0}
.fundo-foto .vela-topo{position:absolute;left:0;right:0;top:0;height:300px;background:linear-gradient(#000000A6,#0000)}
.fundo-foto .vela-baixo{position:absolute;left:0;right:0;bottom:-1px;height:100%;background:${X(t.fundo.slice(0,7),{de:.3,ate:.8,curva:"in"})}}
.fundo-foto .vela-baixo.forte{background:${X(t.fundo.slice(0,7),{de:.12,ate:.8,curva:"in"})}}
.fundo-foto::after{content:"";position:absolute;left:0;right:0;top:45%;height:35%;background:${J(.1)};-webkit-mask-image:linear-gradient(transparent,#000 35%,#000 65%,transparent);mask-image:linear-gradient(transparent,#000 35%,#000 65%,transparent);pointer-events:none}
.sobre-foto .prog i{background:#FFFFFF40}.sobre-foto .prog i.on{background:var(--d)}
.sobre-foto .cab .marca{color:#fff}.sobre-foto .cab .marca svg rect,.sobre-foto .cab .marca svg text{fill:#fff}.sobre-foto .cab .tema{color:#FFFFFFB3}
.sobre-foto .corpo{color:${l?"var(--tx)":"#fff"}}

/* avatar */
.av{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;overflow:hidden;flex:none;background:var(--avbg);box-shadow:inset 0 0 0 3px ${l?"#0000":"#FFFFFF2E"}}
.av svg{width:82%;height:82%}
.av-letra{background:var(--sf2);color:var(--tx);font-family:var(--disp);font-weight:700}
.selo{width:1em;height:1em;flex:none}

/* tweet */
.tw-cab{display:flex;align-items:center;gap:28px}
.tw-av{width:124px;height:124px}
.tw-id{min-width:0}
.tw-nome{display:flex;align-items:center;gap:12px;font-size:42px;font-weight:700;letter-spacing:-.015em;line-height:1.1}
.tw-nome .selo{font-size:40px}
.tw-at{font-size:36px;color:var(--tx3);margin-top:6px;letter-spacing:0}
.tw-txt{margin-top:38px;font-size:50px;line-height:1.32;font-weight:400;letter-spacing:-.01em;text-wrap:pretty}
/* post curto ocupa o quadro: a letra cresce (nunca diminui) quando o texto \xE9 curto */
.tw-txt.tw-m{font-size:58px;line-height:1.28}
.tw-txt.tw-l+.tw-img{height:360px}
.tw-txt.tw-g{font-size:68px;line-height:1.22;letter-spacing:-.02em}
.tw-txt.tw-g~.tw-data,.tw-txt.tw-m~.tw-data{font-size:34px}
.tw-txt b.d{font-weight:600}
.tw-img{margin-top:38px;height:440px;border-radius:32px;overflow:hidden;border:2px solid var(--ln)}
.tw-data{margin-top:32px;font-size:32px;color:var(--tx3)}

/* thread */
.th-post{display:flex;gap:26px;position:relative;padding-bottom:46px}
.th-post:last-child{padding-bottom:0}
.th-post.liga::before{content:"";position:absolute;left:45px;top:108px;bottom:10px;width:4px;border-radius:2px;background:var(--ln)}
.th-av{width:94px;height:94px}
.th-c{flex:1;min-width:0}
.th-id{display:flex;align-items:center;gap:10px;font-size:34px;white-space:nowrap;line-height:1.2}
.th-id b{font-weight:700;letter-spacing:-.01em}
.th-id .selo{font-size:32px}
.th-id span{color:var(--tx3);overflow:hidden;text-overflow:ellipsis;min-width:0}
.th-txt{font-size:42px;line-height:1.3;margin-top:10px;text-wrap:pretty}
.th-g .th-txt{font-size:50px;line-height:1.26}
.th-g .th-post{padding-bottom:70px}
.th-g .th-av{width:110px;height:110px}
.th-g .th-post.liga::before{left:53px;top:124px}
.th-g .th-id{font-size:38px}
.th-img{margin-top:22px;height:280px;border-radius:26px;overflow:hidden;border:2px solid var(--ln)}

/* manchete (jornal) */
.papel-fibra{background-image:radial-gradient(${t.texto}0A 1px,transparent 1.2px);background-size:7px 7px}
.jn-topo{border-top:6px solid var(--tx);border-bottom:2px solid var(--tx);padding:18px 0 14px;text-align:center}
.jn-titulo{font-family:var(--serif);font-size:70px;line-height:1;letter-spacing:-.01em}
.jn-linha{display:flex;justify-content:space-between;margin-top:14px;padding-top:12px;border-top:2px solid var(--ln);font-size:26px;color:var(--tx2);letter-spacing:.02em}
.jn-chapeu{margin-top:44px;display:flex;align-items:center;gap:16px;font-size:30px;font-weight:700;color:var(--dt)}
.jn-chapeu::before{content:"";width:40px;height:8px;background:var(--d)}
.jn-h{font-family:var(--serif);font-weight:400;font-size:92px;line-height:1.02;letter-spacing:-.015em;margin-top:22px}
.jn-h .d{font-style:italic}
.jn-fina{margin-top:26px;font-size:36px;line-height:1.36;color:var(--tx2);text-wrap:pretty}
.jn-foto{margin-top:30px;height:400px;position:relative}
.jn-foto img{filter:grayscale(.15) contrast(1.05)}
.jn-foto figcaption{margin-top:12px;font-size:26px;color:var(--tx3)}
.jn-foto:has(figcaption){height:auto}.jn-foto:has(figcaption) img{height:340px}

/* plant\xE3o */
.pl-rot{align-self:flex-start;display:inline-flex;align-items:center;gap:16px;background:var(--d);color:var(--tinta);font-weight:700;font-size:32px;letter-spacing:.06em;text-transform:uppercase;padding:14px 28px 14px 22px;border-radius:12px}
.pl-rot i{width:20px;height:20px;border-radius:50%;background:var(--tinta);box-shadow:0 0 0 6px ${o.tinta}33}
.pl-h{font-size:86px;line-height:1;margin-top:36px}
.sobre-foto .pl-h{color:#fff}
.pl-meta{display:flex;align-items:center;gap:16px;margin-top:36px;font-size:28px;color:var(--tx3)}
.sobre-foto .pl-meta{color:#FFFFFFB3}
.pl-meta i{width:8px;height:8px;border-radius:50%;background:currentColor}

/* chat */
.ch{background:var(--sf);border:2px solid var(--ln);border-radius:44px;overflow:hidden}
.ch-cab{display:flex;align-items:center;gap:22px;padding:26px 34px;background:var(--sf2)}
.ch-volta{font-size:64px;line-height:.6;color:var(--dt);margin-top:-6px}
.ch-av{width:84px;height:84px;font-size:40px}
.ch-id b{display:block;font-size:36px;font-weight:700;letter-spacing:-.01em}
.ch-id small{font-size:26px;color:var(--tx3)}
.ch-msgs{display:flex;flex-direction:column;gap:18px;padding:36px 30px 40px}
.bal{max-width:80%;padding:22px 30px;border-radius:36px;font-size:38px;line-height:1.28;position:relative}
.bal.eu{align-self:flex-end;background:var(--d);color:var(--tinta);border-bottom-right-radius:10px}
.bal.eu .d{color:var(--tinta);font-weight:700}
.bal.ele{align-self:flex-start;background:var(--bg);border-bottom-left-radius:10px}
.bal i{display:block;text-align:right;font-style:normal;font-size:24px;opacity:.65;margin-top:4px}
.bal.dig{display:flex;gap:10px;padding:30px 32px}
.bal.dig b{width:18px;height:18px;border-radius:50%;background:var(--tx3)}
.bal.dig b:nth-child(2){opacity:.7}.bal.dig b:nth-child(3){opacity:.45}

/* nota */
.nt-barra{display:flex;justify-content:space-between;align-items:center;color:var(--dt);font-size:38px;font-weight:600}
.nt-ic{display:flex;align-items:center;gap:30px}
.nt-ic .ic{width:46px;height:46px}
.nt-ic i{font-style:normal;font-size:30px;letter-spacing:.06em;border:3px solid currentColor;border-radius:50%;width:56px;height:56px;display:inline-flex;align-items:center;justify-content:center;line-height:1}
.nt-data{text-align:center;font-size:26px;color:var(--tx3);margin-top:40px}
.nt-t{font-family:'Ilu',system-ui,sans-serif;font-size:66px;font-weight:700;letter-spacing:-.025em;line-height:1.08;margin-top:30px}
.nt .d{color:inherit;background:linear-gradient(transparent 56%,var(--mt) 56%,var(--mt) 92%,transparent 92%)}
.nt-p{font-size:40px;line-height:1.42;margin-top:26px;color:var(--tx);text-wrap:pretty}
.nt-lista{list-style:none;margin-top:30px;display:flex;flex-direction:column}
.nt-lista li{display:flex;gap:26px;align-items:flex-start;font-size:40px;line-height:1.3;padding:20px 0;border-bottom:2px solid var(--ln)}
.nt-lista li i{flex:none;width:48px;height:48px;border-radius:50%;border:3px solid var(--tx3);margin-top:2px;display:flex;align-items:center;justify-content:center}
.nt-lista li.ok i{background:var(--d);border-color:var(--d);color:var(--tinta)}
.nt-lista li.ok i .ic{width:32px;height:32px}
.nt-lista li.ok span{color:var(--tx3);text-decoration:line-through;text-decoration-thickness:3px}

/* p\xF3dio */
.pd{display:flex;align-items:flex-end;gap:22px;margin-top:56px}
.pd-col{flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;min-width:0}
.pd-foto{width:184px;height:184px;border-radius:50%;overflow:hidden;border:6px solid var(--sf2);margin-bottom:22px}
.p1 .pd-foto{width:224px;height:224px;border-color:var(--d)}
.pd-nome{font-size:36px;font-weight:700;letter-spacing:-.02em;line-height:1.1;text-wrap:balance}
.pd-val{font-size:32px;color:var(--tx2);margin-top:8px;font-variant-numeric:tabular-nums}
.p1 .pd-val{color:var(--dt);font-weight:700}
.pd-bloco{align-self:stretch;margin-top:22px;border-radius:26px 26px 0 0;background:var(--sf2);display:flex;justify-content:center;padding-top:22px}
.pd-bloco span{font-family:var(--disp);font-weight:800;font-size:110px;line-height:1;color:var(--tx3)}
.p1 .pd-bloco{background:var(--d);height:300px}.p1 .pd-bloco span{color:var(--tinta)}
.p2 .pd-bloco{height:220px}.p3 .pd-bloco{height:170px}
.p3 .pd-bloco span{font-size:88px}

/* veredito */
.vd-afirma{font-family:var(--disp);font-weight:700;font-size:70px;line-height:1.06;letter-spacing:-.03em;text-wrap:balance}
.vd-carimbo{position:relative;align-self:flex-start;display:inline-flex;align-items:center;gap:20px;margin-top:56px;transform:rotate(-6deg);border:8px solid currentColor;border-radius:22px;padding:10px 36px 10px 24px;color:var(--tx)}
.vd-carimbo.verdade{color:var(--dt)}
.vd-carimbo span{font-family:var(--disp);font-weight:800;font-size:104px;line-height:1;letter-spacing:.01em}
.vd-carimbo svg{width:96px;height:96px}
.vd-carimbo.meia{color:var(--tx2);padding-left:36px}
.vd{display:flex;flex-direction:column}
.vd-exp{margin-top:56px;font-size:40px;line-height:1.4;color:var(--tx2);text-wrap:pretty;max-width:34ch}

/* gr\xE1fico */
.g{margin-top:46px}
.g-p{margin-top:20px}
.gb{display:flex;flex-direction:column;gap:30px}
.gb-r{display:grid;grid-template-columns:250px 1fr auto;align-items:center;gap:22px}
.gb-l{font-size:32px;font-weight:600;line-height:1.15;color:var(--tx2)}
.gb-t{height:56px;border-radius:12px;background:var(--sf)}
.gb-t i{display:block;height:100%;border-radius:12px;background:var(--g3)}
.gb-v{font-size:34px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--tx2);min-width:110px;text-align:right}
.gb-r.on .gb-l{color:var(--tx)}.gb-r.on .gb-t i{background:var(--d)}.gb-r.on .gb-v{color:var(--dt)}
.gc{display:flex;align-items:flex-end;gap:18px;height:600px}
.gc-c{flex:1;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:14px;min-width:0}
.gc-c b{font-size:30px;font-weight:700;color:var(--tx2);font-variant-numeric:tabular-nums;white-space:nowrap}
.gc-b{width:100%;border-radius:14px 14px 4px 4px;background:var(--g3);max-height:470px}
.gc-l{font-size:28px;color:var(--tx3);white-space:nowrap}
.gc-c.on b{color:var(--dt)}.gc-c.on .gc-b{background:var(--d)}.gc-c.on .gc-l{color:var(--tx);font-weight:600}
.gl{display:block;overflow:visible}
.gl-eixo{stroke:var(--ln);stroke-width:3}
.gl-linha{fill:none;stroke:var(--d);stroke-width:8;stroke-linecap:round;stroke-linejoin:round}
.gl-p{fill:var(--bg);stroke:var(--d);stroke-width:5}.gl-p.on{fill:var(--d)}
.gl-x{font:500 28px 'Ilu',sans-serif;fill:var(--tx3)}
.gl-v{font:700 34px 'Ilu',sans-serif;fill:var(--tx2);paint-order:stroke;stroke:var(--bg);stroke-width:12px;stroke-linejoin:round}.gl-v.on{fill:var(--dt)}
.gp{display:flex;align-items:center;gap:40px}
.gp-svg{width:400px;height:400px;flex:none}
.gp-c{font:800 64px 'IluD','Ilu',sans-serif;fill:var(--dt);letter-spacing:-.03em}
.gp-leg{list-style:none;flex:1;display:flex;flex-direction:column;gap:22px;min-width:0}
.gp-leg li{display:grid;grid-template-columns:30px 1fr auto;align-items:center;gap:16px;font-size:32px;color:var(--tx2)}
.gp-leg li i{width:30px;height:30px;border-radius:8px}
.gp-leg li b{font-variant-numeric:tabular-nums}
.gp-leg li.on{color:var(--tx);font-weight:700}

/* rea\xE7\xE3o */
.rc-topo{font-family:var(--disp);font-weight:800;font-size:66px;line-height:1.06;letter-spacing:-.03em;text-wrap:balance}
.rc-topo .d{color:var(--dt)}
.rc-grande{margin:44px auto 0;width:520px;height:520px;color:var(--tx3)}
.rc-grande img{border-radius:40px}
.rosto{width:100%;height:100%;display:block}
.rc-leg{margin-top:34px;text-align:center;font-size:40px;color:var(--tx2)}
.rc-t{margin-bottom:40px}
.rc2{display:flex;flex-direction:column;border-radius:36px;overflow:hidden;border:2px solid var(--ln)}
.rc-l{display:grid;grid-template-columns:380px 1fr;align-items:center;background:var(--sf)}
.rc-l+.rc-l{border-top:2px solid var(--ln)}
.rc-cx{height:380px;background:var(--sf2);display:flex;align-items:center;justify-content:center;color:var(--tx3)}
.rc-cx .rosto{width:300px;height:300px}
.rc-l p{padding:0 40px;font-size:46px;font-weight:700;line-height:1.16;letter-spacing:-.02em;text-wrap:balance}

/* cita\xE7\xE3o */
.faixa-foto{left:0;right:0;top:0;height:660px;overflow:hidden}
.faixa-foto.pb img{filter:grayscale(1) contrast(1.08)}
.faixa-foto .vela-topo{position:absolute;inset:0 0 auto;height:260px;background:linear-gradient(#000000A6,#0000)}
.faixa-foto .vela-faixa{position:absolute;inset:auto 0 0;height:62%;background:linear-gradient(#0000,${t.fundo})}
.com-faixa .corpo{color:var(--tx)}
.ct{position:relative}
.ct-aspas{display:block;font-family:var(--serif);font-size:240px;line-height:.6;color:var(--dt);height:110px}
.ct-f{font-family:var(--serif);font-style:italic;font-size:66px;line-height:1.12;letter-spacing:-.01em;text-wrap:balance}
.ct-f .d{color:var(--dt)}
.ct-autor{margin-top:40px;display:flex;flex-direction:column;gap:6px;padding-left:28px;border-left:6px solid var(--d)}
.ct-autor b{font-size:38px;font-weight:700;letter-spacing:-.01em}
.ct-autor span{font-size:30px;color:var(--tx3)}

/* passo */
.pa-topo{display:flex;align-items:flex-end;gap:22px;margin-bottom:34px;position:relative}
.pa-num{font-family:var(--disp);font-weight:800;font-size:250px;line-height:.78;letter-spacing:-.04em;color:transparent;-webkit-text-stroke:5px var(--dt)}
.pa-de{font-size:32px;font-weight:600;color:var(--tx3);padding-bottom:8px}
.pa-ic{margin-left:auto;width:150px;height:150px;border-radius:50%;background:var(--d);color:var(--tinta);display:flex;align-items:center;justify-content:center}
.pa-ic .ic{width:84px;height:84px}
.pa-img{margin-top:38px;height:380px;border-radius:30px;overflow:hidden}

/* tabela */
.tb{margin-top:46px;display:flex;flex-direction:column}
.tb-r{display:grid;grid-template-columns:1.25fr repeat(var(--n),1fr);align-items:stretch}
.tb-r>span{display:flex;align-items:center;justify-content:center;text-align:center;padding:24px 12px;font-size:34px;font-weight:600;border-top:2px solid var(--ln);line-height:1.15}
.tb-r>span.tb-rot{justify-content:flex-start;text-align:left;padding-left:0;font-weight:600;color:var(--tx2)}
.tb-cab>span{border-top:none;font-size:30px;font-weight:700;color:var(--tx2);padding-top:18px;padding-bottom:18px}
.tb-r>span.on{background:color-mix(in srgb,var(--d) 13%,transparent)}
.tb-cab>span.on{background:var(--d);color:var(--tinta);border-radius:22px 22px 0 0}
.tb-r:last-child>span.on{border-radius:0 0 22px 22px}
.tb-ok,.tb-no{display:inline-flex;width:56px;height:56px;border-radius:50%;align-items:center;justify-content:center}
.tb-ok{background:var(--d);color:var(--tinta)}.tb-ok .ic{width:36px;height:36px}
.tb-no{color:var(--tx3);border:3px solid var(--ln)}.tb-no .ic{width:30px;height:30px}

/* voc\xEA sabia / capa com foto */
.adesivo{align-self:flex-start;display:inline-block;background:var(--d);color:var(--tinta);font-family:var(--disp);font-weight:800;font-size:44px;letter-spacing:-.02em;padding:14px 30px 16px;border-radius:18px;transform:rotate(-4deg);margin-bottom:34px}
.vs-h{font-size:78px;line-height:1.02;color:#fff}
.vs-p,.cf-p{color:#FFFFFFD9}
.vs-p .d,.cf-p .d{color:var(--ap)}
.cf-rot{align-self:flex-start;font-size:28px;font-weight:700;color:var(--tinta);background:var(--d);border-radius:999px;padding:10px 24px;margin-bottom:30px}
.cf-h{color:#fff;font-size:108px}

/* revista */
.rv-foto{height:430px;margin-bottom:34px}
.rv-sec{display:flex;justify-content:space-between;border-top:3px solid var(--tx);padding-top:14px;font-family:var(--serif);font-style:italic;font-size:34px;color:var(--tx2)}
.rv-h{font-family:var(--serif);font-weight:400;font-size:96px;line-height:.98;letter-spacing:-.015em;margin-top:22px}
.rv-h .d{font-style:italic}
.rv-p{margin-top:28px;font-size:38px;line-height:1.45;color:var(--tx2);text-wrap:pretty}
.rv-cap{float:left;font-family:var(--serif);font-size:150px;line-height:.82;margin:8px 16px 0 0;color:var(--dt)}

/* colagem */
.papel-grade{background-image:linear-gradient(${t.texto}12 2px,transparent 2px),linear-gradient(90deg,${t.texto}12 2px,transparent 2px);background-size:54px 54px;background-position:-2px -2px}
.cg{position:relative;flex:1;min-height:0}
.cg-t{position:absolute;left:0;top:0;font-family:var(--mao);font-size:92px;line-height:1;color:var(--dt);transform:rotate(-3deg);transform-origin:left}
.pol{position:absolute;background:#FFFDF8;padding:22px 22px 0;box-shadow:0 18px 40px #1C1A1726,0 2px 6px #1C1A171F}
.pol img{height:auto;aspect-ratio:1/1}
.pol figcaption{font-family:var(--mao);font-size:72px;line-height:1;color:#1C1A17;text-align:center;padding:16px 6px 22px}
.pol:not(:has(figcaption)){padding-bottom:22px}
.fita{position:absolute;left:50%;top:-24px;width:190px;height:52px;transform:translateX(-50%) rotate(-3deg);background:${o.apoio}B8;clip-path:polygon(0 8%,6% 0,12% 10%,20% 2%,30% 9%,42% 0,55% 8%,68% 1%,80% 9%,90% 0,100% 7%,100% 92%,93% 100%,82% 91%,70% 100%,58% 92%,45% 100%,32% 91%,20% 100%,9% 92%,0 100%)}
.cg1 .pol1{left:20px;top:110px;width:600px;transform:rotate(-4deg)}
.cg2 .pol1{left:0;top:120px;width:470px;transform:rotate(-6deg)}
.cg2 .pol2{right:0;top:300px;width:450px;transform:rotate(5deg)}
.cg3 .pol1{left:-10px;top:110px;width:420px;transform:rotate(-6deg)}
.cg3 .pol2{right:-10px;top:150px;width:400px;transform:rotate(5deg)}
.cg3 .pol3{left:200px;top:470px;width:400px;transform:rotate(-2deg)}
.cg-nota{position:absolute;left:10px;bottom:20px;max-width:520px;font-family:var(--mao);font-size:88px;line-height:1;color:var(--tx);transform:rotate(-3deg)}
.cg-nota .d{color:var(--dt)}
.cg1 .cg-nota{left:auto;right:0;bottom:60px;max-width:400px;text-align:right}
.cg-seta{position:absolute;width:150px;height:112px;color:var(--dt)}
.cg1 .cg-seta{right:250px;bottom:300px;transform:scaleX(-1) rotate(-20deg)}
.cg2 .cg-seta{display:none}
.cg2 .cg-nota{max-width:390px}
.cg3 .cg-seta{display:none}
.cg3 .cg-nota{display:none}
.cg-ades{position:absolute;right:20px;top:0;width:200px;height:200px;border-radius:50%;background:var(--d);color:var(--tinta);display:flex;align-items:center;justify-content:center;text-align:center;font-family:var(--disp);font-weight:800;font-size:40px;line-height:1;letter-spacing:-.02em;padding:24px;transform:rotate(10deg)}
.cg2 .cg-ades{right:40px;top:40px}
.cg3 .cg-ades{right:auto;left:640px;top:auto;bottom:40px}

/* tipogr\xE1fico */
.tp-txt{font-family:var(--disp);font-weight:800;font-size:168px;line-height:.92;letter-spacing:-.04em;text-wrap:balance}
.tp-txt .d{color:transparent;-webkit-text-stroke:5px var(--dt)}
.tp-ap{margin-top:48px;font-size:40px;line-height:1.4;color:var(--tx2);max-width:30ch;text-wrap:pretty}
.slide.fundo-d{background:var(--d);color:var(--tinta)}
.fundo-d .tp-txt .d{-webkit-text-stroke-color:var(--tinta)}
.fundo-d .tp-ap,.fundo-d .handle,.fundo-d .assina,.fundo-d .tema{color:${o.tinta}B3}
.fundo-d .prog i{background:${o.tinta}33}.fundo-d .prog i.on{background:var(--tinta)}
.fundo-d .seta{color:var(--tinta)}.fundo-d .seta span{background:var(--tinta);color:var(--d)}
.fundo-d .marca{color:var(--tinta)}.fundo-d .marca svg rect,.fundo-d .marca svg text{fill:var(--tinta)}.fundo-d .marca svg circle{fill:var(--tinta)}

/* defini\xE7\xE3o */
.df-pal{font-family:var(--disp);font-weight:800;font-size:116px;line-height:1;letter-spacing:-.04em}
.df-fon{margin-top:18px;font-family:var(--serif);font-style:italic;font-size:40px;color:var(--tx2)}
.df-fon i{font-style:normal;color:var(--tx3);padding:0 6px}
.df-sig{margin-top:40px;padding-top:36px;border-top:2px solid var(--ln);list-style:none;counter-reset:s}
.df-sig li{counter-increment:s;position:relative;padding-left:62px;font-size:44px;line-height:1.3;font-weight:600;letter-spacing:-.02em;text-wrap:pretty}
.df-sig li+li{margin-top:22px}
.df-sig li::before{content:counter(s) ".";position:absolute;left:0;top:0;color:var(--dt);font-weight:700}
.df-ex{margin-top:34px;font-family:var(--serif);font-style:italic;font-size:40px;line-height:1.3;color:var(--tx2);padding-left:62px}
.df-or{margin-top:30px;font-size:32px;line-height:1.4;color:var(--tx2);padding-left:62px}
.df-or b{color:var(--tx);margin-right:8px}

/* linha do tempo */
.lt{margin-top:48px;position:relative}
.lt::before{content:"";position:absolute;left:231px;top:20px;bottom:20px;width:4px;background:var(--ln);border-radius:2px}
.lt-m{display:grid;grid-template-columns:210px 46px 1fr;gap:0;align-items:start;padding:22px 0}
.lt-ano{font-family:var(--disp);font-weight:700;font-size:56px;line-height:1;letter-spacing:-.04em;font-variant-numeric:tabular-nums;color:var(--tx2)}
.lt-pt{width:26px;height:26px;margin:16px 0 0 10px;border-radius:50%;background:var(--bg);border:5px solid var(--tx3);position:relative;z-index:1}
.lt-m p{font-size:36px;line-height:1.3;font-weight:500;padding-left:14px;text-wrap:pretty}
.lt-m.on .lt-ano{color:var(--dt)}.lt-m.on .lt-pt{background:var(--d);border-color:var(--d)}.lt-m.on p{font-weight:700}

/* quiz */
.qz-p{font-size:74px}
.qz{display:flex;flex-direction:column;gap:20px;margin-top:48px}
.qz-o{display:flex;align-items:center;gap:26px;padding:22px 30px 22px 22px;border-radius:30px;background:var(--sf);border:2px solid var(--ln);font-size:40px;font-weight:600;letter-spacing:-.02em}
.qz-o i{flex:none;width:68px;height:68px;border-radius:50%;background:var(--sf2);display:flex;align-items:center;justify-content:center;font-style:normal;font-family:var(--disp);font-weight:800;font-size:34px}
.qz-o span{flex:1}
.qz-o.certa{background:var(--d);border-color:var(--d);color:var(--tinta)}
.qz-o.certa i{background:var(--tinta);color:var(--d)}
.qz-ok{width:52px;height:52px}
.qz-o.apaga{opacity:.42}
.qz-exp{margin-top:34px}

/* receita */
.rcp-foto{height:380px;border-radius:32px;overflow:hidden;margin-bottom:36px}
.rcp-info{display:flex;flex-wrap:wrap;gap:16px;margin-top:30px}
.rcp-info span{display:inline-flex;align-items:center;gap:12px;font-size:30px;font-weight:600;padding:12px 24px;border:2px solid var(--ln);border-radius:999px}
.rcp-info .ic{width:36px;height:36px;color:var(--dt)}
.rcp-ing{list-style:none;margin-top:34px}
.rcp-ing.duas{columns:2;column-gap:40px}
.rcp-ing li{display:flex;gap:20px;align-items:baseline;font-size:36px;line-height:1.3;padding:14px 0;break-inside:avoid}
.rcp-ing li i{flex:none;width:22px;height:22px;border-radius:50%;border:5px solid var(--d);transform:translateY(-2px)}

/* placar */
.pc-comp{font-size:30px;font-weight:600;color:var(--tx3);text-align:center;margin-bottom:28px}
.pc{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;background:var(--sf);border:2px solid var(--ln);border-radius:44px;padding:48px 30px}
.pc-time{display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center}
.pc-sig{width:150px;height:150px;border-radius:50%;background:var(--sf2);border:3px solid var(--ln);display:flex;align-items:center;justify-content:center;font-family:var(--disp);font-weight:800;font-size:46px;letter-spacing:-.01em}
.pc-time b{font-size:36px;font-weight:700;letter-spacing:-.02em}
.pc-gols{display:flex;align-items:center;gap:22px;padding:0 10px}
.pc-gols span{font-family:var(--disp);font-weight:800;font-size:176px;line-height:1;letter-spacing:-.05em;font-variant-numeric:tabular-nums;color:var(--tx2)}
.pc-gols span.on{color:var(--dt)}
.pc-gols i{font-style:normal;font-size:52px;color:var(--tx3);font-weight:600}
.pc-info{text-align:center;font-size:30px;color:var(--tx2);margin-top:26px}
.pc-lances{list-style:none;margin-top:36px}
.pc-lances li{display:flex;gap:24px;align-items:baseline;padding:16px 0;border-top:2px solid var(--ln);font-size:34px}
.pc-lances li b{flex:none;width:92px;font-family:var(--disp);font-weight:700;color:var(--dt);font-variant-numeric:tabular-nums}

/* c\xF3digo */
.cd-t{margin-bottom:40px}
.cd{border-radius:30px;overflow:hidden;background:#111118;border:2px solid #FFFFFF1A;color:#ECECF1}
.cd-barra{display:flex;align-items:center;gap:14px;padding:22px 28px;background:#1A1A23;border-bottom:2px solid #FFFFFF14}
.cd-barra i{width:22px;height:22px;border-radius:50%;background:#FFFFFF33}
.cd-barra span{margin-left:14px;font-family:var(--mono);font-size:26px;color:#FFFFFF99}
.cd-pre{font-family:var(--mono);font-size:38px;line-height:1.5;padding:30px 34px 36px;white-space:pre-wrap;word-break:break-word}
.k-s{color:${o.apoio}}.k-c{color:${L(o.destaque,"#111118",4.5)};font-weight:700}.k-n{color:${o.apoio}}.k-x{color:#8E8EA0;font-style:italic}

/* vers\xEDculo */
.vr-luz{background-image:radial-gradient(circle 560px at 50% 40%,${o.destaque}${l?"1A":"24"},transparent)}
.vr{text-align:center;display:flex;flex-direction:column;align-items:center}
.vr-orn{display:flex;align-items:center;gap:18px;margin-bottom:46px}
.vr-orn i{width:120px;height:2px;background:var(--tx3)}
.vr-orn b{width:18px;height:18px;background:var(--d);transform:rotate(45deg)}
.vr-t{font-family:var(--serif);font-size:68px;line-height:1.16;letter-spacing:-.01em;text-wrap:balance}
.vr-t .d{font-style:italic;color:var(--dt)}
.vr-ref{margin-top:48px;font-family:var(--disp);font-weight:700;font-size:40px;letter-spacing:-.01em;color:var(--dt)}
.vr-ver{margin-top:12px;font-size:28px;color:var(--tx3)}

/* informativo */
.if{margin-top:44px;display:flex;flex-direction:column}
.if-l{display:flex;gap:30px;align-items:center;padding:24px 0;border-top:2px solid var(--ln)}
.if-l:last-child{border-bottom:2px solid var(--ln)}
.if-ic{flex:none;width:100px;height:100px;border-radius:50%;background:color-mix(in srgb,var(--d) 18%,transparent);color:var(--dt);display:flex;align-items:center;justify-content:center}
.if-ic .ic{width:54px;height:54px}
.if-l b{display:block;font-size:44px;font-weight:700;letter-spacing:-.02em;line-height:1.15}
.if-l p{font-size:34px;line-height:1.32;color:var(--tx2);margin-top:6px}

/* n\xFAmeros */
.nm{margin-top:46px;display:grid;grid-template-columns:1fr 1fr;gap:0 40px}
.nm-i{padding:30px 0;border-top:2px solid var(--ln)}
.nm.n3 .nm-i:first-child{grid-column:1/-1}
.nm-n{font-family:var(--disp);font-weight:700;font-size:108px;line-height:1;letter-spacing:-.045em;font-variant-numeric:tabular-nums}
.nm.n3 .nm-i:first-child .nm-n,.nm.n2 .nm-n{font-size:140px}
.nm-i.on .nm-n{color:var(--dt)}
.nm-i p{margin-top:14px;font-size:32px;line-height:1.3;color:var(--tx2);text-wrap:pretty}
.nm.n2{grid-template-columns:1fr}

/* foto anotada */
.an-t{margin-bottom:36px}
.an{position:relative;display:flex;justify-content:center}
.an-in{position:relative;height:100%}
.an-in>img{height:100%;width:auto;max-width:872px;border-radius:30px}
.an-m{position:absolute;transform:translate(-50%,-50%)}
.an-circ{aspect-ratio:200/120;color:var(--d)}
.an-circ svg{width:100%;height:100%;display:block;filter:drop-shadow(0 2px 6px #0008)}
.an-ponto{width:64px;height:64px;border-radius:50%;background:var(--d);color:var(--tinta);display:flex;align-items:center;justify-content:center;font-family:var(--disp);font-weight:800;font-size:34px;box-shadow:0 0 0 6px #FFFFFFCC}
.an-et{position:absolute;width:max-content;max-width:340px;background:var(--d);color:var(--tinta);font-family:'Ilu',sans-serif;font-weight:700;font-size:34px;line-height:1.12;padding:12px 20px;border-radius:14px;box-shadow:0 6px 18px #0006;text-align:left}
.an-dir{left:calc(100% + 14px);top:50%;transform:translateY(-50%) rotate(-2deg)}
.an-esq{right:calc(100% + 14px);top:50%;transform:translateY(-50%) rotate(2deg)}
.an-cima{left:50%;bottom:calc(100% + 12px);transform:translateX(-50%) rotate(-2deg)}
.an-baixo{left:50%;top:calc(100% + 12px);transform:translateX(-50%) rotate(2deg)}
.an-p{margin-top:30px}

/* divis\xE3o antes e depois */
.dv-t{margin-bottom:36px}
.dv{position:relative;border-radius:30px;overflow:hidden}
.dv-a,.dv-b{position:absolute;inset:0}
.dv-a{clip-path:inset(0 calc(100% - var(--c)) 0 0)}
.dv-b{clip-path:inset(0 0 0 var(--c))}
.dv-linha{position:absolute;top:0;bottom:0;left:var(--c);width:6px;margin-left:-3px;background:#fff}
.dv-alca{position:absolute;left:var(--c);top:50%;transform:translate(-50%,-50%);width:100px;height:100px;border-radius:50%;background:#fff;color:#0E0E13;display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:700;letter-spacing:.06em;box-shadow:0 6px 20px #0007}
.dv-rot{position:absolute;top:26px;background:#0E0E13CC;color:#fff;font-size:32px;font-weight:700;padding:10px 22px;border-radius:999px}
.dv-rot.e{left:26px}.dv-rot.d{right:26px;background:var(--d);color:var(--tinta)}
.dv-p{margin-top:30px}
`};export{dt as META,ct as TIPOS_VIRAIS,ht as TIPOS_VIRAIS_OK,st as corDoCodigo,at as dataCurta,tt as dataLonga,s as esc,$t as estiloVirais,S as fonteLinha,C as fundoFoto,u as img,x as moldura,d as rico,b as titulo2,bt as validarViral,vt as visualDoSlide};
