/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{simboloDa as A}from"../simbolo.mjs";import{esc as s,rico as l,img as x,moldura as f,titulo2 as b}from"./virais.mjs";import{selo3d as D,avatarPagina as j}from"./elementos.mjs";import{contraste as q,misturar as h,degradeSuave as u,ruidoFino as S}from"./visuais.mjs";const d=(a,o,e,r)=>({fundo:a,superficie:e,superficie2:r,texto:o,textoSuave:o+"C7",textoFraco:o+"94",linha:o+"26"}),B=a=>q("#FFFFFF",a.destaque)>=4.5?"#FFFFFF":(a.tinta||"#111111").slice(0,7),$=a=>{const o=B(a);return d(a.destaque.slice(0,7),o,h(a.destaque,"#000000",.12),h(a.destaque,"#000000",.22))},O=a=>d(a.apoio.slice(0,7),"#141414",h(a.apoio,"#000000",.06),h(a.apoio,"#000000",.12)),F=(a=.5)=>`url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${a} 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`)}")`,E=a=>`${String(a.i+1).padStart(2,"0")}/${String(a.total).padStart(2,"0")}`,C=(a,o,e)=>`<div class="meta"><span>${s(a.curto||a.nome)}</span><span>${s(a.handle)}</span><span>${E(o)}</span></div>`,w=(a,o)=>`<div class="meta"><span>${s(a.handle)}</span><span>${E(o)}</span></div>`,T=a=>a.semMarca?"":`<div class="meta meta-logo"><span class="ml">${A(a,{tamanho:52})}<b>${s(a.curto||a.nome)}</b></span></div>`,L=(a,o,e)=>`<div class="meta meta-cantos"><span>${s(a.handle)}</span><span><b>${s(String(a.curto||a.nome).split(" ")[0])}</b> ${s(String(a.curto||a.nome).split(" ").slice(1).join(" "))}</span></div><div class="meta-pe"><span>${s(e)}</span><span>${o.i<o.total-1?"arraste \u2192":s(E(o))}</span></div>`,k={editorial:{paletas:{escuro:()=>d("#0B0B17","#F4F1EA","#16162A","#22223C"),claro:()=>d("#F4F1EA","#0B0B17","#E8E3D8","#DCD5C7"),destaque:$,apoio:O},ritmo:["escuro","claro","escuro","claro","destaque","claro","escuro","apoio"],meta:C},condensado:{paletas:{escuro:()=>d("#0E0E0E","#F6F3EE","#1C1C1C","#2A2A2A"),claro:()=>d("#F3EFE9","#111111","#E6E1D8","#D9D2C6"),destaque:$},ritmo:["escuro","claro","escuro","destaque","claro","escuro","claro","escuro"],meta:w},interface:{paletas:{escuro:()=>d("#0D0D0D","#EFE9DF","#211E1B","#2E2A26"),claro:()=>d("#EFE9DF","#141210","#FFFFFF","#E3DCD0")},ritmo:["escuro","claro","escuro","claro"],meta:w},recorte:{paletas:{claro:()=>d("#EEE7DA","#141414","#E2DACB","#D5CCBA"),escuro:()=>d("#151515","#F2ECE1","#222222","#2E2E2E"),destaque:$},ritmo:["claro","claro","claro","escuro","claro","destaque","claro","escuro"],meta:w},serifado:{paletas:{escuro:()=>d("#0A0A0A","#F3EDD3","#171612","#23211B"),claro:()=>d("#FAF8F2","#141414","#EFEBE1","#E3DED1")},ritmo:["escuro","claro","escuro","claro","escuro","claro"],meta:C},marcatexto:{paletas:{escuro:()=>d("#111214","#F5F5F5","#1B1C1F","#26272B")},ritmo:["escuro"],meta:T},limpo:{paletas:{claro:()=>d("#FFFFFF","#111111","#F3F3F3","#E6E6E6"),escuro:()=>d("#111111","#FFFFFF","#1E1E1E","#2A2A2A")},ritmo:["claro"],meta:()=>""},grao:{paletas:{claro:()=>d("#EEEDEA","#121212","#F8F7F5","#DEDDD9"),escuro:()=>d("#0F0F0F","#F2F2F0","#1C1C1C","#292929"),destaque:$},ritmo:["claro","claro","escuro","claro","destaque","claro","claro","escuro"],meta:L}},Q=Object.keys(k);function U(a,o,e){const r=k[a];return r?o.cor&&r.paletas[o.cor]?o.cor:r.ritmo[e%r.ritmo.length]:null}const X=(a,o,e)=>k[a].paletas[o](e);function H(a,o,e,r,t,n){const p=k[o];return a.replace('<div class="slide',`<div style="--av:${((t.i+1)/t.total).toFixed(3)}" class="slide fam fam-${o} cor-${e}`).replace('<div class="prog">',`${p.meta(r,t,n)}<div class="prog">`)}const z=a=>[].concat(a||[]).flatMap(o=>String(o).split(/\n\n+/)).filter(Boolean).map(o=>`<p class="pp">${l(o)}</p>`).join(""),M=["domingo","segunda-feira","ter\xE7a-feira","quarta-feira","quinta-feira","sexta-feira","s\xE1bado"],R={notificacao:(a,o,e,r,t)=>f(o,e,r,`<div class="nf"><div class="nf-dia">${s(a.dia||M[(t.hoje||new Date).getDay()])}</div><div class="nf-hora">${s(a.hora||"9:41")}</div>
    <div class="nf-pilha">${(a.notificacoes||[]).map((n,p)=>`<div class="nf-card ${p?"menor":""}"><div class="nf-app">${j(o,"av nf-av")}<span>${s(n.app||o.curto||o.nome)} \xB7 ${s(n.quando||(p?"2 min":"agora"))}</span></div>${n.titulo?`<div class="nf-t">${l(n.titulo)}</div>`:""}${n.texto?`<div class="nf-x">${l(n.texto)}</div>`:""}</div>`).join("")}</div></div>`,{classe:"liso sobre-foto nf-slide",fundo:a.imagem?`<div class="fundo-foto nf-foto">${x(a.imagem,a.foco)}<div class="nf-vela"></div></div>`:"",corpo:"cheio"}),painel:(a,o,e,r)=>f(o,e,r,`${a.rotulo?`<div class="pn-rot">${s(a.rotulo)}</div>`:""}${b(a.titulo,"pn-h")}${a.sub?`<p class="pn-sub">${l(a.sub)}</p>`:""}<div class="pn n${(a.cards||[]).length}">${(a.cards||[]).map(t=>`<div class="pn-c"><div class="pn-cr">${s(t.rotulo)}</div><div class="pn-n">${s(t.numero)}</div><div class="pn-x">${l(t.texto)}</div></div>`).join("")}</div>${a.nota?`<p class="pn-nota">${l(a.nota)}</p>`:""}`),dialogo:(a,o,e,r)=>f(o,e,r,`${a.titulo?`<h2 class="dl-h"><span>${l(a.titulo)}</span></h2>`:""}${a.texto?`<p class="dl-x"><span>${l(a.texto)}</span></p>`:""}<div class="dl"><div class="dl-p">${l(a.pergunta)}</div><div class="dl-b"><span class="sim">${s(a.sim||"Sim")}</span><span class="nao">${s(a.nao||"Ainda n\xE3o")}</span></div></div>`,{classe:a.imagem?"liso sobre-foto":"",fundo:a.imagem?`<div class="fundo-foto dl-foto">${x(a.imagem,a.foco)}<div class="dl-vela"></div></div>`:"",corpo:"dl-corpo"}),fototopo:(a,o,e,r)=>f(o,e,r,`${a.titulo?a.capa?`<h1 class="ft-h">${l(a.titulo)}</h1>`:b(a.titulo,"ft-h"):""}${z(a.texto)}`,{classe:`liso ft-slide ${a.capa?"ft-capa":""}`,fundo:`<div class="ft-foto">${x(a.imagem,a.foco)}<div class="ft-vela"></div></div>`,corpo:"ft-corpo"}),fotobloco:(a,o,e,r)=>{const t=a.ordem==="foto-texto";return f(o,e,r,`${a.numero?`<div class="fb-n">${s(a.numero)}</div>`:""}${b(a.titulo,"fb-h")}${z(a.texto)}`,{classe:`liso fb-slide ${t?"fb-cima sobre-foto":"fb-baixo"}`,fundo:`<div class="fb-foto">${x(a.imagem,a.foco)}${a.legendaFoto?`<span class="fb-leg">${s(a.legendaFoto)}</span>`:""}</div>`,corpo:t?"baixo fb-corpo":"topo fb-corpo"})},errocerto:(a,o,e,r)=>{const t=(n,p)=>`<div class="ec-l ec-${n}"><div class="ec-t">${n==="e"?s(a.rotuloErrado||"Errado"):s(a.rotuloCerto||"Certo")} ${D(n==="e"?"nao":"sim",{cls:"selo3d ec-s"})}</div><div class="ec-x">${l(p?.texto)}</div>${p?.nota?`<div class="ec-nota">${s(p.nota)}</div>`:""}</div>`;return f(o,e,r,`<div class="ec">${t("e",a.errado)}<div class="ec-linha"></div>${t("c",a.certo)}</div>`,{classe:"liso",corpo:"cheio"})},versus:(a,o,e,r)=>f(o,e,r,`<div class="vsx"><span class="vsx-s">${A(o,{tamanho:76})}</span><h1 class="vsx-a">${l(a.a)}</h1><div class="vsx-vs"><span>VS</span><i></i></div><h1 class="vsx-b">${l(a.b)}</h1>${a.sub?`<p class="vsx-sub">${l(a.sub)}</p>`:""}</div>`,{classe:"liso"}),celular:(a,o,e,r)=>f(o,e,r,`${a.marca?`<div class="cl-marca">${l(a.marca)}</div>`:""}<div class="cl ${a.lado==="dir"?"cl-dir":""}"><div class="cl-fone"><div class="cl-tela">${x(a.imagem,a.foco)}<span class="cl-ilha"></span><span class="cl-hora">9:41</span></div></div><div class="cl-txt">${b(a.titulo,"cl-h")}${a.texto?`<p class="cl-x">${l(a.texto)}</p>`:""}</div></div>`),marcados:(a,o,e,r)=>f(o,e,r,`${b(a.titulo)}${a.sub?`<p class="p mk-sub">${l(a.sub)}</p>`:""}<ul class="mk">${(a.itens||[]).map(t=>{const n=typeof t=="string"?{texto:t}:t,p=n.marca||a.marca||"seta";return`<li>${D(p,{cls:"selo3d mk-s",cor:["sim","nao"].includes(p)?null:o.destaque})}<span>${l(n.texto)}</span></li>`}).join("")}</ul>${a.nota?`<p class="mk-nota">${l(a.nota)}</p>`:""}`),recorte:(a,o,e,r)=>f(o,e,r,`${a.titulo?`<h2 class="rc-tarja"><span>${l(a.titulo)}</span></h2>`:""}<figure class="rcf ${a.lado==="baixo",""}"><span class="rcf-fita"></span>${x(a.imagem,a.foco)}</figure>${a.texto?`<p class="rcf-x">${l(a.texto)}</p>`:""}`,{classe:"liso",corpo:"rcf-corpo"})},J={notificacao:{uso:"tela de bloqueio com hora e 1 ou 2 notifica\xE7\xF5es da pr\xF3pria p\xE1gina; capa da fam\xEDlia interface",paginas:["curiosidades","tecnologia","saude","financas","noticia"],foto:!0,campos:"imagem, notificacoes[{titulo, texto, app, quando}] (1 a 2), hora, dia"},painel:{uso:"painel com 2 a 4 cart\xF5es de n\xFAmero (r\xF3tulo, n\xFAmero, explica\xE7\xE3o)",paginas:["financas","saude","esporte","noticia","tecnologia"],campos:"titulo, cards[{rotulo, numero, texto}], rotulo, sub, nota"},dialogo:{uso:"caixa de di\xE1logo do sistema com duas respostas, para provocar o leitor",paginas:["curiosidades","saude","financas","aula"],campos:"pergunta, sim, nao, titulo, texto, imagem"},fototopo:{uso:"foto no topo que some no fundo escuro e texto corrido embaixo com marca-texto",paginas:["noticia","historia","curiosidades","esporte"],foto:!0,campos:"imagem, texto (par\xE1grafos com linha em branco), titulo, capa (t\xEDtulo grande de capa), foco"},fotobloco:{uso:"n\xFAmero grande e texto num bloco de cor com a foto sangrando at\xE9 a borda",paginas:["esporte","noticia","historia","negocio"],foto:!0,campos:"imagem, titulo, texto, numero, ordem: texto-foto|foto-texto, legendaFoto"},errocerto:{uso:"errado em cima e certo embaixo, com selos em relevo",paginas:["aula","saude","negocio","financas","curiosidades"],campos:"errado{texto, nota}, certo{texto, nota}, rotuloErrado, rotuloCerto"},versus:{uso:'capa "isto VS aquilo" com a seta longa',paginas:["aula","negocio","curiosidades","financas"],campos:"a, b, sub"},celular:{uso:"celular gen\xE9rico com a foto do assunto na tela e o texto ao lado",paginas:["tecnologia","curiosidades","negocio","aula"],foto:!0,campos:"imagem, titulo, texto, marca, lado: esq|dir"},marcados:{uso:"lista com selo em relevo em cada item: visto, xis ou seta",paginas:["saude","aula","curiosidades","financas","negocio"],campos:"titulo, itens[texto | {texto, marca: sim|nao|seta}] (2 a 6), marca, sub, nota"},recorte:{uso:"t\xEDtulo em tarjas e foto rasgada com fita sobre papel",paginas:["historia","curiosidades","negocio","receita"],foto:!0,campos:"imagem, titulo, texto, foco"}},W=Object.keys(R),Y=["escuro","claro","destaque","apoio"],y=a=>String(a??"").replace(/[*~]/g,"");function Z(a,o,e,r){const t=(i,c,m)=>{y(c).length>m&&r.push(`slide ${o}, ${i}: ${y(c).length} caracteres (m\xE1ximo ${m}). Encurte o texto.`)},n=(i,c)=>{(c==null||c===""||Array.isArray(c)&&!c.length)&&e.push(`slide ${o}: falta "${i}".`)},p=(i,c,m,I)=>!Array.isArray(c)||c.length<m||c.length>I?(e.push(`slide ${o}: "${i}" precisa ter de ${m} a ${I} itens.`),!1):!0,g=i=>{i||e.push(`slide ${o}: "imagem" precisa de uma foto (assets/arquivo.jpg, de licen\xE7a livre).`)},v=i=>[].concat(i||[]).reduce((c,m)=>c+y(m).length,0);switch(a.tipo){case"notificacao":g(a.imagem),p("notificacoes",a.notificacoes,1,2)&&a.notificacoes.forEach((i,c)=>{!i.titulo&&!i.texto&&e.push(`slide ${o}: notifica\xE7\xE3o ${c+1} sem titulo nem texto.`),t("titulo da notifica\xE7\xE3o",i.titulo,70),t("texto da notifica\xE7\xE3o",i.texto,90),t("app",i.app,22)});break;case"painel":n("titulo",a.titulo),t("titulo",a.titulo,40),t("sub",a.sub,60),t("nota",a.nota,90),p("cards",a.cards,2,4)&&a.cards.forEach(i=>{i.numero||e.push(`slide ${o}: cart\xE3o sem numero.`),t("rotulo do cart\xE3o",i.rotulo,26),t("numero do cart\xE3o",i.numero,7),t("texto do cart\xE3o",i.texto,50)});break;case"dialogo":n("pergunta",a.pergunta),t("pergunta",a.pergunta,80),t("titulo",a.titulo,70),t("texto",a.texto,140),t("sim",a.sim,16),t("nao",a.nao,16);break;case"fototopo":g(a.imagem),a.capa||n("texto",a.texto),t("titulo",a.titulo,50),v(a.texto)>260&&r.push(`slide ${o}: texto com ${v(a.texto)} caracteres (m\xE1ximo 260). Divida em dois slides.`);break;case"fotobloco":g(a.imagem),n("titulo",a.titulo),t("titulo",a.titulo,60),t("numero",a.numero,7),t("legendaFoto",a.legendaFoto,70),v(a.texto)>(a.numero?170:220)&&r.push(`slide ${o}: texto com ${v(a.texto)} caracteres (m\xE1ximo ${a.numero?170:220}).`),a.ordem&&!["texto-foto","foto-texto"].includes(a.ordem)&&e.push(`slide ${o}: ordem "${a.ordem}" n\xE3o existe (texto-foto, foto-texto).`);break;case"errocerto":["errado","certo"].forEach(i=>{a[i]?.texto?(t(`${i}.texto`,a[i].texto,80),t(`${i}.nota`,a[i].nota,40)):e.push(`slide ${o}: falta "${i}.texto".`)});break;case"versus":n("a",a.a),n("b",a.b),t("a",a.a,36),t("b",a.b,36),t("sub",a.sub,70);break;case"celular":g(a.imagem),n("titulo",a.titulo),t("titulo",a.titulo,40),t("texto",a.texto,130),t("marca",a.marca,18);break;case"marcados":n("titulo",a.titulo),t("titulo",a.titulo,50),t("sub",a.sub,90),t("nota",a.nota,110),p("itens",a.itens,2,6)&&a.itens.forEach(i=>{const c=typeof i=="string"?{texto:i}:i;t("item",c.texto,70),c.marca&&!["sim","nao","seta"].includes(c.marca)&&e.push(`slide ${o}: marca "${c.marca}" n\xE3o existe (sim, nao, seta).`)});break;case"recorte":g(a.imagem),t("titulo",a.titulo,60),t("texto",a.texto,180);break}}const aa=(a,o,e)=>{const r=(t,n,p="")=>n?`@font-face{font-family:'${t}';${p}src:url(data:font/ttf;base64,${n}) format('truetype')}`:"";return`
${r("IluLarga",e.larga,"font-weight:700;")}${r("IluLarga",e.largaMeia,"font-weight:600;")}
/* ---- foto do tema atr\xE1s do slide ("fundo") ---- */
.slide>.fundo-tema{position:absolute;inset:0;z-index:0}
.fundo-tema img{filter:contrast(1.12) saturate(1.05)}
.vela-tema{position:absolute;inset:-1px 0;background:${u("var(--bg)",{de:0,ate:1,alfa0:.62,alfa1:.97,curva:"in"})},radial-gradient(ellipse 80% 45% at 50% 48%,color-mix(in srgb,var(--bg) 35%,transparent),transparent)}
.fundo-claro .vela-tema,.cor-claro .vela-tema,.fam-limpo .vela-tema,.fam-grao.cor-claro .vela-tema{background:${u("var(--bg)",{de:0,ate:1,alfa0:.76,alfa1:.96,curva:"in"})}}
/* reportagem escura: a foto de fundo do CTA fica com o contraste dela e s\xF3 escurece para baixo */
.fam-marcatexto .vela-tema{background:${u("var(--bg)",{de:0,ate:1,alfa0:.3,alfa1:.97,curva:"in"})},radial-gradient(ellipse 75% 45% at 50% 46%,color-mix(in srgb,var(--bg) 40%,transparent),transparent)}
.com-fundo::before,.com-fundo::after{display:none}
.cor-destaque .vela-tema,.cor-apoio .vela-tema{background:${u("var(--bg)",{de:0,ate:1,alfa0:.86,alfa1:.96})}}
.fam-grao .corpo>.num,.fam-grao .corpo>.leg{text-align:center;align-self:center}
/* ---- moldura comum \xE0s fam\xEDlias ---- */
.slide.fam{padding:0 72px}
.slide.fam::before{display:none}
.slide.fam::after{display:none}
.fam .cab{display:none}
.fam .meta{position:absolute;z-index:3;top:44px;left:72px;right:72px;display:flex;justify-content:space-between;align-items:center;font:500 22px/1 'Ilu',sans-serif;letter-spacing:.01em;color:var(--tx3)}
.fam.sobre-foto .meta{color:#FFFFFFCC}
.fam .prog{position:absolute;z-index:3;left:72px;right:72px;bottom:150px;margin:0;gap:6px;opacity:.9}
.fam .prog i{height:4px}
.fam .corpo{padding-top:110px;padding-bottom:30px}
.fam .rodape{height:140px}
.fam .handle{font-size:24px}
.fam:not(.fam-marcatexto):not(.fam-limpo) .rodape .col{visibility:hidden} /* o @ j\xE1 est\xE1 nos r\xF3tulos do topo */
.fam .rodape .col:has(.assina){visibility:visible} /* no \xFAltimo slide, a frase da p\xE1gina volta */
.fam .seta{font-size:24px}.fam .seta span{width:56px;height:56px;font-size:28px}
.fam .p{max-width:none;font-size:42px;line-height:1.36;color:var(--tx2)}
.cor-destaque .d,.cor-destaque .p .d{color:var(--tx);text-decoration:underline;text-decoration-thickness:.08em;text-underline-offset:.12em}
.cor-destaque .seta span{background:var(--tx);color:var(--bg)}.cor-destaque .seta{color:var(--tx)}
.cor-destaque .prog i.on{background:var(--tx)}
.fam .vd-exp{font-size:46px;max-width:none}
.fam .pp{font-size:38px;line-height:1.42;color:var(--tx);text-wrap:pretty}
.fam .pp+.pp{margin-top:26px}

/* ---- editorial: blocos de cor, grotesca m\xE9dia ---- */
.fam-editorial h1{font:600 96px/1 'Ilu',sans-serif;letter-spacing:-.035em}
.fam-editorial h2{font:600 88px/1.02 'Ilu',sans-serif;letter-spacing:-.03em}
.fam-editorial .num,.fam-editorial .fb-n,.fam-editorial .nm-n{font-family:'IluLarga','IluD',sans-serif;letter-spacing:-.02em}
.fam-editorial .prog{display:none}
.fam-editorial .p{color:var(--tx)}

/* ---- condensado: caixa alta condensada ---- */
.fam-condensado h1,.fam-condensado h2,.fam-condensado .cf-h,.fam-condensado .vs-h{font-family:'IluCond','Ilu',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:0;text-wrap:balance}
.fam-condensado h1{font-size:112px;line-height:.94}
.fam-condensado h2{font-size:108px;line-height:.95}
.fam-condensado .vd-afirma{font-family:'IluCond','Ilu',sans-serif;text-transform:uppercase;font-size:100px;line-height:.96;letter-spacing:0}
.fam-condensado .meta{text-transform:uppercase;letter-spacing:.14em;font-weight:600;font-size:20px}
.fam-condensado .prog{bottom:140px;display:block;height:4px;background:var(--ln)}
.fam-condensado .prog i{display:none}
.fam-condensado .prog::after{content:"";display:block;height:4px;width:calc(var(--av) * 100%);background:var(--tx)}
.fam-condensado .p{font-size:36px}

/* ---- interface: o celular como cen\xE1rio ---- */
.fam-interface h1{font:700 92px/1 'Ilu',sans-serif;letter-spacing:-.035em}
.fam-interface h2{font:700 88px/1.02 'Ilu',sans-serif;letter-spacing:-.035em}
.fam-interface .meta{text-transform:uppercase;font-weight:600;letter-spacing:.06em}
.fam-interface .d{color:var(--tinta);background:var(--d);padding:0 .12em;border-radius:.08em;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.fam-interface .p .d{color:var(--tinta)}
.fam-interface .prog{display:none}

/* ---- recorte: papel com gr\xE3o, tarja preta ---- */
.fam-recorte{background-image:${F(.26)}}
.fam-recorte.cor-escuro,.fam-recorte.cor-destaque{background-image:${F(.3)}}
.fam-recorte h1,.fam-recorte h2{font:700 92px/1.08 'Ilu',sans-serif;letter-spacing:-.035em}
.fam-recorte h1{font-size:96px;line-height:1.12}
.fam-recorte .vd-afirma{font-size:84px}
.fam-recorte h1,.fam-recorte .rc-tarja span{background:var(--tx);color:var(--bg);padding:.02em .16em .06em;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.fam-recorte h1{display:inline;align-self:flex-start}
.fam-recorte h1 .d,.fam-recorte .rc-tarja .d{color:var(--d)}
.fam-recorte .p .d,.fam-recorte .rcf-x .d{color:var(--dt);font-weight:700}
.fam-recorte .prog{display:none}
.fam-recorte .p{color:var(--tx)}

/* ---- serifado: revista ---- */
.fam-serifado h1{font:400 108px/.98 var(--serif);letter-spacing:-.01em}
.fam-serifado h2{font:400 104px/.98 var(--serif);letter-spacing:-.01em}
.fam-serifado h1 .d,.fam-serifado h2 .d{font-style:italic}
.fam-serifado .p,.fam-serifado .pp{font-family:var(--serif);font-size:44px;line-height:1.24;color:var(--tx)}
.fam-serifado .p .d{color:var(--dt);font-weight:400}
.fam-serifado .prog{display:none}

/* ---- marcatexto: reportagem escura ---- */
.fam-marcatexto .meta-logo{top:60px;color:var(--tx)}
.fam-marcatexto .ml{display:flex;align-items:center;gap:12px;font:700 38px/1 'Ilu',sans-serif;letter-spacing:-.03em}
.fam-marcatexto .ml svg{width:52px;height:52px}.fam-marcatexto .ml svg rect,.fam-marcatexto .ml svg text{fill:var(--tx)}
.fam-marcatexto h1{font:600 92px/1.02 'Ilu',sans-serif;letter-spacing:-.035em}
.fam-marcatexto h2{font:600 84px/1.04 'Ilu',sans-serif;letter-spacing:-.03em}
.fam-marcatexto .d,.fam-marcatexto .p .d,.fam-marcatexto .pp .d{color:var(--tinta);background:var(--d);padding:0 .12em;font-weight:600;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.fam-marcatexto .prog{display:none}
.fam-marcatexto .seta{color:transparent;gap:0}
.fam-marcatexto .seta span{width:190px;height:56px;border-radius:14px;background:none;border:3px solid var(--tx);color:var(--d);font-size:40px;font-weight:400}
.fam-marcatexto .p{color:var(--tx)}

/* ---- limpo: branco total ---- */
.fam-limpo h1{font:700 104px/.94 'Ilu',sans-serif;letter-spacing:-.04em;text-transform:uppercase}
.fam-limpo h2{font:700 96px/.96 'Ilu',sans-serif;letter-spacing:-.04em}
.fam-limpo .prog{display:none}
.fam-limpo .seta{color:var(--tx);border:2px solid var(--tx);border-radius:999px;padding:8px 10px 8px 26px}
.fam-limpo .seta span{width:44px;height:44px;font-size:24px}
.fam-limpo .p{color:var(--tx2);font-weight:600;letter-spacing:-.02em}

/* ---- grao: papel cinza, cantos ---- */
.fam-grao{background-image:${F(.34)}}
.fam-grao .meta-cantos,.fam-grao .meta-pe{position:absolute;z-index:3;left:72px;right:72px;display:flex;justify-content:space-between;font:400 30px/1 'Ilu',sans-serif;letter-spacing:-.02em;color:var(--tx)}
.fam-grao .meta-cantos{top:60px}.fam-grao .meta-pe{bottom:62px}
.fam-grao .rodape{visibility:hidden}
.fam-grao .prog{display:none}
.fam-grao h1{font:700 128px/.94 'Ilu',sans-serif;letter-spacing:-.04em;text-align:center}
.fam-grao h2{font:700 92px/.98 'Ilu',sans-serif;letter-spacing:-.04em}
.fam-grao .corpo>h1,.fam-grao .corpo>h2,.fam-grao .corpo>.p,.fam-grao .corpo>.cta,.fam-grao .corpo>.sub{text-align:center;align-self:center;margin-left:auto;margin-right:auto}
/* 0.6.3: no grao tudo no corpo segue o mesmo eixo do t\xEDtulo (centro). Antes o n\xFAmero grande do fotobloco, o par\xE1grafo
   e a lista ficavam \xE0 esquerda com o t\xEDtulo centrado; o QA do carrossel agora reprova alinhamento misto */
.fam-grao .corpo>.fb-n,.fam-grao .corpo>.pp,.fam-grao .corpo>.mk-nota,.fam-grao .corpo>.mk-sub{text-align:center;align-self:center;margin-left:auto;margin-right:auto}
.fam-grao .corpo>.mk{align-self:center;margin-left:auto;margin-right:auto}
.fam-grao.fb-baixo .corpo{justify-content:center;padding-top:150px}
.fam-grao .p,.fam-grao .cl-x{font-family:'IluD',sans-serif;font-weight:300;font-size:46px;line-height:1.08;letter-spacing:-.03em;color:var(--tx);font-variation-settings:'opsz' 48}
.fam-grao .d{color:var(--dt)}

/* ---- notifica\xE7\xE3o ---- */
.nf-foto img{filter:saturate(.9)}
.nf-vela{position:absolute;inset:0;background:linear-gradient(#0000004D,#00000026 40%,#00000059)}
.nf{position:relative;height:100%;display:flex;flex-direction:column}
.nf-dia{text-align:center;color:#F4EFE6;font:500 40px/1 'Ilu',sans-serif;margin-top:20px}
.nf-hora{text-align:center;color:#F4EFE6;font:600 200px/1 'Ilu',sans-serif;letter-spacing:-.04em;margin-top:6px;text-shadow:0 4px 30px #0004}
.nf-pilha{margin-top:auto;display:flex;flex-direction:column;gap:26px;padding-bottom:10px}
.nf-card{background:#F2ECE2EB;color:#141210;border-radius:42px;padding:34px 40px 40px;box-shadow:0 18px 50px #0005;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
.nf-app{display:flex;align-items:center;gap:18px;font:600 28px/1 'Ilu',sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#141210B3}
.nf-av{width:54px;height:54px;border-radius:14px;box-shadow:none}
.nf-t{margin-top:22px;font:700 70px/1.04 'Ilu',sans-serif;letter-spacing:-.035em}
.nf-t .d{color:var(--dt);background:none;padding:0}
.nf-x{margin-top:16px;font:500 38px/1.25 'Ilu',sans-serif;letter-spacing:-.01em}
.nf-card.menor .nf-x{margin-top:18px}

/* ---- painel ---- */
.pn-rot{font:600 28px/1.2 'Ilu',sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--tx3);margin-bottom:18px}
.pn-sub{margin-top:18px;font:400 40px/1.25 'Ilu',sans-serif;color:var(--tx2)}
.pn{margin-top:46px;display:grid;grid-template-columns:1fr 1fr;gap:22px}
.pn.n2{grid-template-columns:1fr}
.pn.n3 .pn-c:first-child{grid-column:1/-1}
.pn-c{background:var(--sf);border-radius:34px;padding:30px 32px 34px;box-shadow:inset 0 1px 0 #FFFFFF14,0 10px 30px #0000001F;border:1px solid var(--ln)}
.pn-cr{font:600 26px/1.2 'Ilu',sans-serif;letter-spacing:.05em;text-transform:uppercase;color:var(--tx3)}
.pn-n{margin-top:12px;font:800 96px/1 'Ilu',sans-serif;letter-spacing:-.04em;color:var(--dt);font-variant-numeric:tabular-nums}
.pn-x{margin-top:12px;font:500 30px/1.25 'Ilu',sans-serif;color:var(--tx)}
.pn-x .d{background:none;color:var(--dt);padding:0}
.pn-nota{margin-top:40px;font:700 38px/1.25 'Ilu',sans-serif;letter-spacing:-.02em}

/* ---- di\xE1logo ---- */
.dl-vela{position:absolute;inset:0;background:#0000008C}
.dl-corpo{align-items:center;text-align:center}
.dl-h{max-width:none}
.dl-h span{background:var(--bg);color:var(--tx);padding:.04em .2em .08em;border-radius:14px;-webkit-box-decoration-break:clone;box-decoration-break:clone;line-height:1.28}
.sobre-foto .dl-h span{background:#F2ECE2;color:#141210}
.sobre-foto .dl-h span .d{background:none;color:var(--dt);padding:0}
.dl-x{margin-top:40px;font:600 34px/1.5 'Ilu',sans-serif}
.dl-x span{background:#0E0E0EE6;color:#F4F1EA;padding:.08em .3em;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.dl{margin-top:56px;width:780px;background:#FFFFFF;color:#111;border-radius:44px;box-shadow:0 24px 60px #0006;overflow:hidden}
.dl-p{padding:40px 44px 34px;font:700 40px/1.22 'Ilu',sans-serif;letter-spacing:-.02em}
.dl-p .d{background:none;color:var(--dt);padding:0}
.dl-b{display:grid;grid-template-columns:1fr 1fr;border-top:2px solid #0000001A}
.dl-b span{padding:30px 10px;font:700 40px/1 'Ilu',sans-serif;letter-spacing:-.02em}
.dl-b .sim{color:${_(o)}}.dl-b .nao{color:#8A8A8A;border-left:2px solid #0000001A}

/* ---- foto no topo ---- */
.ft-foto{position:absolute;z-index:0;left:0;right:0;top:0;height:63%;overflow:hidden;background:var(--bg)}
.ft-foto img{width:100%;height:100%;object-fit:cover}
.ft-capa .ft-foto{height:100%}
/* degrad\xEA longo: come\xE7a a 35% da foto e chega ao fundo numa curva ease; vinheta nas laterais; ru\xEDdo fino contra faixas */
.ft-vela{position:absolute;inset:-1px 0;background:${u("var(--bg)",{de:.5,ate:.97,curva:"in"})},linear-gradient(rgba(0,0,0,.28),rgba(0,0,0,0) 13%)}
.ft-capa .ft-vela{background:${u("var(--bg)",{de:.42,ate:.92,curva:"in"})},linear-gradient(rgba(0,0,0,.28),rgba(0,0,0,0) 13%)}
/* ru\xEDdo s\xF3 na zona do degrad\xEA, s\xF3 escurecendo, contra faixas de cor */
.slide.ft-slide::after{content:"";display:block!important;position:absolute;left:0;right:0;top:36%;height:30%;bottom:auto;width:auto;z-index:1;pointer-events:none;border-radius:0;background:${S(.1)};-webkit-mask-image:linear-gradient(transparent,#000 35%,#000 65%,transparent);mask-image:linear-gradient(transparent,#000 35%,#000 65%,transparent)}
.slide.ft-capa::after{top:45%;height:45%}
.fam .corpo.ft-corpo{justify-content:flex-start;padding-top:790px}
.ft-corpo .pp,.ft-corpo .ft-h{text-shadow:0 2px 18px rgba(0,0,0,.55)}.ft-corpo .d{text-shadow:none}
.ft-corpo .pp{font-size:44px;line-height:1.4}
.ft-corpo .pp+.pp{margin-top:30px}
.fam.ft-capa .corpo.ft-corpo{padding-top:640px}
.ft-capa .ft-h{font-size:104px;line-height:1}
.ft-h{margin-bottom:26px}

/* ---- foto em bloco ---- */
.fb-foto{position:absolute;z-index:0;left:0;right:0;height:560px}
.fb-baixo .fb-foto{bottom:0}.fb-cima .fb-foto{top:0;height:620px}
.fb-cima .fb-foto::after{content:"";position:absolute;inset:0;background:linear-gradient(#00000066,#0000 30%)}
.fb-leg{position:absolute;left:72px;bottom:150px;font:500 24px/1.3 'Ilu',sans-serif;color:#fff;text-shadow:0 1px 8px #000a}
.fb-baixo .rodape{position:relative;z-index:2}
.fb-baixo .handle{color:#FFFFFFD9;text-shadow:0 1px 8px #0009}
.fb-baixo .corpo{justify-content:flex-start;padding-top:120px;padding-bottom:450px}
.fb-cima .corpo{padding-top:640px}
.fb-n{font:700 220px/.86 'IluLarga','IluD',sans-serif;letter-spacing:-.03em;color:var(--tx);margin-bottom:12px}
.fb-h{font-size:58px!important;line-height:1.08!important;margin-bottom:22px}
.fb-slide .pp{font-size:34px;line-height:1.4}

/* ---- errado x certo ---- */
.ec{flex:1;display:flex;flex-direction:column;margin:0 -72px}
.ec-l{flex:1;padding:70px 72px 40px;display:flex;flex-direction:column}
.ec-t{display:flex;align-items:center;gap:18px;font:800 116px/1 'Ilu',sans-serif;letter-spacing:-.045em;text-transform:uppercase;color:var(--tx)}
.ec-s{width:108px;height:108px}
.ec-x{margin-top:44px;font:700 72px/1 'Ilu',sans-serif;letter-spacing:-.04em;text-wrap:balance}
.ec-e .ec-x{color:#E3241B}.ec-c .ec-x{color:#1E9A40}
.ec-x .d{color:inherit;text-decoration:underline;text-decoration-thickness:.07em}
.ec-nota{margin-top:auto;padding-top:24px;font:700 28px/1.2 'Ilu',sans-serif;letter-spacing:-.01em;text-transform:uppercase;color:var(--tx3)}
.ec-linha{height:6px;background:#8A8A8A}

/* ---- versus ---- */
.vsx-s svg{width:76px;height:76px}.vsx-s svg rect,.vsx-s svg text{fill:var(--tx)}
.vsx-a,.vsx-b{margin-top:30px;font:700 116px/.94 'Ilu',sans-serif!important;letter-spacing:-.04em!important;text-transform:uppercase}
.vsx-vs{display:flex;align-items:center;gap:20px;margin:56px 0 46px;color:#9A9A9A}
.vsx-vs span{font:italic 800 72px/1 'Ilu',sans-serif;letter-spacing:-.04em}
.vsx-vs i{flex:none;width:340px;height:4px;background:currentColor;position:relative}
.vsx-vs i::after{content:"";position:absolute;right:-2px;top:-9px;border:11px solid transparent;border-left:18px solid currentColor;border-right:0}
.vsx-sub{margin-top:40px;font:600 34px/1.3 'Ilu',sans-serif;color:var(--tx2)}

/* ---- celular ---- */
.cl-marca{text-align:center;font:700 116px/1 'Ilu',sans-serif;letter-spacing:-.045em;margin-bottom:46px}
.cl-marca .d{font-weight:300;font-style:italic;color:var(--tx)}
.cl{display:flex;align-items:center;gap:46px}
.cl-dir{flex-direction:row-reverse}
.cl-fone{flex:none;width:420px;height:840px;border-radius:70px;padding:16px;background:linear-gradient(145deg,#3A3A3C,#0E0E10 45%,#2A2A2C);box-shadow:0 30px 60px #0000004D,inset 0 0 0 3px #5A5A5E,inset 0 0 0 6px #111}
.cl-tela{position:relative;width:100%;height:100%;border-radius:56px;overflow:hidden;background:#111}
.cl-tela::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,#FFFFFF1F 0,#FFFFFF00 38%);pointer-events:none}
.cl-ilha{position:absolute;top:18px;left:50%;transform:translateX(-50%);width:120px;height:36px;border-radius:20px;background:#000}
.cl-hora{position:absolute;top:22px;left:40px;font:600 26px/1 'Ilu',sans-serif;color:#fff;text-shadow:0 1px 6px #0008}
.cl-txt{flex:1;min-width:0}
.cl-h{font-size:60px!important;line-height:1!important}
.cl-x{margin-top:30px;font-size:40px}

/* ---- marcados ---- */
.mk{list-style:none;margin-top:56px;display:flex;flex-direction:column;gap:34px}
.mk li{display:flex;align-items:center;gap:26px;font:500 44px/1.22 'Ilu',sans-serif;letter-spacing:-.01em}
.mk li b.d{font-weight:700}
.mk-s{flex:none;width:88px;height:88px}
.mk-sub{margin-top:22px}
.mk-nota{margin-top:44px;font:400 34px/1.4 'Ilu',sans-serif;color:var(--tx2)}

/* ---- recorte ---- */
.rcf-corpo{justify-content:flex-start;padding-top:120px}
.rc-tarja{font:700 74px/1.2 'Ilu',sans-serif!important;letter-spacing:-.035em}
.rc-tarja span{background:var(--tx);color:var(--bg);padding:.02em .18em .06em;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.rcf{position:relative;margin:44px -72px 0;height:520px;filter:drop-shadow(0 12px 18px #0003)}
.rcf img{clip-path:polygon(0 3%,4% 1%,9% 3.5%,15% 0,22% 2.5%,30% .5%,37% 3%,45% 1%,52% 3.5%,60% .5%,67% 2.5%,74% 0,81% 3%,88% 1%,95% 3.5%,100% 1.5%,100% 97%,95% 99.5%,88% 97%,81% 100%,74% 97.5%,67% 99.5%,60% 97%,52% 100%,45% 97.5%,37% 99.5%,30% 97%,22% 100%,15% 97.5%,9% 99.5%,4% 97%,0 99%);filter:contrast(1.05) saturate(.92)}
.rcf::after{content:"";position:absolute;inset:0;background-image:${F(.35)};mix-blend-mode:multiply;pointer-events:none;clip-path:inherit}
.rcf-fita{position:absolute;z-index:2;top:-22px;left:9%;width:200px;height:56px;transform:rotate(-4deg);background:${o.apoio}C4;clip-path:polygon(0 10%,7% 0,14% 9%,22% 1%,31% 8%,40% 0,50% 7%,60% 1%,70% 9%,80% 0,90% 8%,100% 2%,100% 90%,92% 100%,82% 91%,72% 100%,61% 92%,50% 100%,40% 92%,29% 100%,19% 91%,9% 100%,0 92%)}
.rcf-x{margin-top:40px;font:400 38px/1.42 'Ilu',sans-serif;color:var(--tx)}
`},_=a=>{let o=a.destaque.slice(0,7);for(let e=0;e<1&&q(o,"#FFFFFF")<3.2;e+=.05)o=h(a.destaque,"#000000",e);return o};export{Y as CORES_SLIDE,k as FAMILIAS,Q as FAMILIAS_NOMES,J as META_REF,R as TIPOS_REF,W as TIPOS_REF_OK,X as baseDaFamilia,U as corDoSlide,aa as estiloFamilias,Z as validarRef,H as vestirSlide};
