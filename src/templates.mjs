/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{simboloDa as c}from"./simbolo.mjs";const r=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),n=t=>r(t).replace(/\*([^*]+)\*/g,'<b class="d">$1</b>').replace(/\n/g,"<br>"),m=(t,e,i)=>{const o=p=>p?`@font-face{font-family:'IluD';font-weight:200 800;src:url(data:font/woff2;base64,${p}) format('woff2')}`:"",s=(p,d)=>d?`@font-face{font-family:'Ilu';font-weight:${p};src:url(data:font/woff2;base64,${d}) format('woff2')}`:"",a=t.base;return`
${s(400,i.regular)}${s(600,i.semibold)}${s(700,i.bold)}${o(i.display)}
*{box-sizing:border-box;margin:0;padding:0}
:root{--d:${e.destaque};--ap:${e.apoio};--tinta:${e.tinta}}
body{width:1080px;height:1350px;background:${a.fundo};color:${a.texto};
  font-family:'Ilu',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow:hidden}
.slide{position:relative;width:1080px;height:1350px;overflow:hidden;padding:0 104px;display:flex;flex-direction:column}
/* fundo: grade de pontos que some nas bordas + brilho de canto */
.slide::before{content:"";position:absolute;inset:0;
  background-image:radial-gradient(${a.texto}1F 2px,transparent 2.5px);background-size:60px 60px;background-position:30px 30px;
  -webkit-mask-image:radial-gradient(ellipse 75% 60% at 78% 18%,#000 0,transparent 72%);mask-image:radial-gradient(ellipse 75% 60% at 78% 18%,#000 0,transparent 72%)}
.slide::after{content:"";position:absolute;width:900px;height:900px;left:-420px;bottom:-520px;border-radius:50%;
  background:radial-gradient(closest-side,${e.destaque}12,transparent)}
.slide>*{position:relative;z-index:1}

/* progresso: um segmento por slide */
.prog{display:flex;gap:10px;margin-top:64px}
.prog i{flex:1;height:6px;border-radius:3px;background:${a.texto}26}
.prog i.on{background:var(--d)}
.cab{display:flex;align-items:center;justify-content:space-between;margin-top:34px}
.marca{display:flex;align-items:center;gap:14px;font-weight:700;font-size:30px;letter-spacing:-.02em}
.marca svg{width:40px;height:40px}
.tema{font-size:22px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${a.textoFraco}}

.corpo{flex:1;display:flex;flex-direction:column;justify-content:center;padding-bottom:70px}
.rot{align-self:flex-start;font-size:24px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;
  color:var(--d);border:2px solid var(--d)55;border-radius:999px;padding:10px 24px;margin-bottom:40px}
h1,h2,.num,.leg,.cta,.item i,.rk .pos,.ad .ano{font-family:'IluD','Ilu',system-ui,sans-serif;font-variation-settings:'opsz' 96}
h1{font-size:116px;line-height:.98;font-weight:800;letter-spacing:-.035em;text-wrap:balance}
h2{font-size:80px;line-height:1.03;font-weight:800;letter-spacing:-.03em;text-wrap:balance}
.d{color:var(--d);font-weight:inherit}
.p{text-wrap:pretty;max-width:34ch;font-size:40px;line-height:1.42;color:${a.textoSuave};margin-top:36px;font-weight:400;letter-spacing:-.01em}
.p .d{color:var(--ap);font-weight:600}

.rodape{height:150px;display:flex;align-items:center;justify-content:space-between}
.col{display:flex;flex-direction:column;gap:6px}
.assina{font-size:22px;color:${a.textoFraco};letter-spacing:0}
.handle{font-size:26px;font-weight:600;color:${a.textoFraco};letter-spacing:.02em}
.seta{display:flex;align-items:center;gap:16px;font-size:26px;font-weight:600;color:var(--d)}
.seta span{width:68px;height:68px;border-radius:50%;background:var(--d);color:var(--tinta);display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:700}

/* dado */
.num{font-size:270px;line-height:.9;font-weight:700;letter-spacing:-.05em;font-variant-numeric:tabular-nums;color:var(--d)}
.num small{font-size:120px;letter-spacing:-.03em}
.barra{display:none}
.leg{margin-top:26px;font-size:46px;font-weight:700;letter-spacing:-.03em;line-height:1.15;text-wrap:balance}

/* lista: linhas com fio, numeral grande (sem cart\xF5es) */
.itens{display:flex;flex-direction:column;margin-top:44px}
.item{display:flex;align-items:baseline;gap:34px;padding:30px 0;border-top:2px solid ${a.linha}}
.item:last-child{border-bottom:2px solid ${a.linha}}
.item i{flex:none;width:64px;font-style:normal;font-weight:700;font-size:64px;letter-spacing:-.04em;line-height:1;color:var(--d);font-variant-numeric:tabular-nums}
.item p{font-size:42px;font-weight:600;line-height:1.2;letter-spacing:-.02em;text-wrap:balance}
.item .d{color:var(--d)}

/* compara\xE7\xE3o */
.vs{display:flex;flex-direction:column;gap:20px;margin-top:48px;position:relative}
.card{background:${a.superficie};border:2px solid ${a.linha};border-radius:34px;padding:38px 42px}
.card.b{background:linear-gradient(135deg,${e.destaque}26,${e.destaque}0D);border-color:${e.destaque}80}
.card .k{font-size:24px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:${a.textoFraco};margin-bottom:16px}
.card.b .k{color:var(--d)}
.card p{font-size:42px;font-weight:700;letter-spacing:-.03em;line-height:1.15}
.chip{align-self:center;margin:-34px 0;z-index:2;background:${a.fundo};border:2px solid ${a.linha};border-radius:999px;padding:8px 22px;font-size:24px;font-weight:700;color:${a.textoFraco};letter-spacing:.12em}

/* ranking: linhas com fio e barra proporcional */
.rank{display:flex;flex-direction:column;margin-top:40px}
.rk{display:flex;align-items:center;gap:28px;padding:26px 0;border-top:2px solid ${a.linha};position:relative}
.rk:last-child{border-bottom:2px solid ${a.linha}}
.rk .pos{flex:none;width:60px;font-size:56px;font-weight:700;letter-spacing:-.04em;color:${a.textoFraco};font-variant-numeric:tabular-nums}
.rk.top .pos{color:var(--d)}
.rk .nome{flex:1;font-size:40px;font-weight:700;letter-spacing:-.03em;line-height:1.1}
.rk .val{font-size:40px;font-weight:700;color:${a.textoSuave};letter-spacing:-.03em;white-space:nowrap;font-variant-numeric:tabular-nums}
.rk.top .val{color:var(--d)}
.rk .fx{position:absolute;left:0;bottom:-2px;height:4px;background:var(--d);opacity:.7}

/* passos: linha do tempo vertical */
.pass{display:flex;flex-direction:column;margin-top:44px;position:relative}
.pass::before{content:"";position:absolute;left:33px;top:34px;bottom:34px;width:4px;background:${a.linha}}
.ps{display:flex;gap:30px;align-items:flex-start;padding:26px 0;position:relative}
.ps i{flex:none;width:68px;height:68px;border-radius:50%;background:var(--d);color:var(--tinta);display:flex;align-items:center;justify-content:center;font-style:normal;font-weight:700;font-size:32px;box-shadow:0 0 0 10px ${a.fundo}}
.ps .t{font-size:46px;font-weight:700;letter-spacing:-.03em;line-height:1.12}
.ps p{font-size:36px;color:${a.textoSuave};line-height:1.3;margin-top:6px}

/* mito e fato */
.mf{display:flex;flex-direction:column;gap:20px;margin-top:48px}
.mf .m,.mf .f{border-radius:34px;padding:38px 44px;border:2px solid ${a.linha};background:${a.superficie}}
.mf .f{background:linear-gradient(135deg,${e.destaque}2E,${e.destaque}0F);border-color:${e.destaque}90}
.mf small{display:block;font-size:24px;font-weight:700;letter-spacing:.18em;margin-bottom:14px;color:${a.textoFraco}}
.mf .f small{color:var(--d)}
.mf .m p{font-size:42px;font-weight:600;line-height:1.18;letter-spacing:-.03em;color:${a.textoSuave};text-decoration:line-through;text-decoration-color:${a.textoFraco};text-decoration-thickness:4px}
.mf .f p{font-size:46px;font-weight:700;line-height:1.16;letter-spacing:-.03em}

/* antes e depois */
.ad{display:flex;flex-direction:column;gap:0;margin-top:48px;position:relative}
.ad .a,.ad .d2{padding:38px 44px;border:2px solid ${a.linha}}
.ad .a{background:${a.superficie};border-radius:34px 34px 0 0;border-bottom:none}
.ad .d2{background:linear-gradient(135deg,${e.destaque}2E,${e.destaque}0F);border-color:${e.destaque}90;border-radius:0 0 34px 34px}
.ad small{display:block;font-size:24px;font-weight:700;letter-spacing:.18em;margin-bottom:12px;color:${a.textoFraco}}
.ad .d2 small{color:var(--d)}
.ad .ano{font-size:96px;font-weight:700;letter-spacing:-.06em;line-height:1}
.ad .d2 .ano{color:var(--d)}
.ad p{font-size:36px;font-weight:600;line-height:1.22;margin-top:10px;letter-spacing:-.02em;color:${a.textoSuave}}
.ad .seta2{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:3;width:76px;height:76px;border-radius:50%;background:var(--d);color:var(--tinta);display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:700;box-shadow:0 0 0 10px ${a.fundo}}

/* fecho */
.cta{align-self:flex-start;margin-top:52px;background:var(--d);color:var(--tinta);border-radius:999px;padding:30px 54px;font-size:40px;font-weight:700;letter-spacing:-.03em}
.sub{margin-top:26px;font-size:30px;color:${a.textoFraco}}
`},x=(t,e,i)=>`
  <div class="prog">${Array.from({length:e.total},(o,s)=>`<i class="${s<=e.i?"on":""}"></i>`).join("")}</div>
  <div class="cab">${t.semMarca?"":`<div class="marca">${c(t,{tamanho:40})}<span>${r(t.curto||"ilustrando")}</span></div>`}<span class="tema">${r(i)}</span></div>`,g=(t,e)=>`
  <div class="rodape"><span class="col"><span class="handle">${r(t.handle)}</span>${e.i===e.total-1?`<span class="assina">${r(t.assinatura)}</span>`:""}</span>
  ${e.i<e.total-1?'<span class="seta">arraste <span>\u2192</span></span>':""}</div>`,l=(t,e,i,o)=>`<div class="slide">${x(t,e,i)}<div class="corpo">${o}</div>${g(t,e)}</div>`,h={capa:(t,e,i,o)=>l(e,i,o,`<h1>${n(t.titulo)}</h1>${t.sub?`<p class="p">${n(t.sub)}</p>`:""}`),texto:(t,e,i,o)=>l(e,i,o,`<h2>${n(t.titulo)}</h2>${t.texto?`<p class="p">${n(t.texto)}</p>`:""}`),dado:(t,e,i,o)=>l(e,i,o,`<div class="num">${r(t.numero)}</div><div class="barra"></div><div class="leg">${n(t.legenda)}</div>${t.texto?`<p class="p">${n(t.texto)}</p>`:""}`),lista:(t,e,i,o)=>l(e,i,o,`<h2>${n(t.titulo)}</h2><div class="itens">${(t.itens||[]).map((s,a)=>`<div class="item"><i>${a+1}</i><p>${n(s)}</p></div>`).join("")}</div>`),comparacao:(t,e,i,o)=>l(e,i,o,`<h2>${n(t.titulo)}</h2><div class="vs"><div class="card"><div class="k">${r(t.esquerda?.rotulo)}</div><p>${n(t.esquerda?.texto)}</p></div><span class="chip">VS</span><div class="card b"><div class="k">${r(t.direita?.rotulo)}</div><p>${n(t.direita?.texto)}</p></div></div>`),ranking:(t,e,i,o)=>{const s=Math.max(...(t.itens||[]).map(a=>parseFloat(String(a.valor).replace(/[^\d,.]/g,"").replace(",","."))||0),1);return l(e,i,o,`<h2>${n(t.titulo)}</h2><div class="rank">${(t.itens||[]).map((a,p)=>{const d=parseFloat(String(a.valor).replace(/[^\d,.]/g,"").replace(",","."))||0;return`<div class="rk${p===0?" top":""}"><span class="pos">${p+1}</span><span class="nome">${n(a.nome)}</span><span class="val">${r(a.valor)}</span><span class="fx" style="width:${Math.round(d/s*100)}%"></span></div>`}).join("")}</div>`)},passos:(t,e,i,o)=>l(e,i,o,`<h2>${n(t.titulo)}</h2><div class="pass">${(t.itens||[]).map((s,a)=>`<div class="ps"><i>${a+1}</i><div><div class="t">${n(s.titulo)}</div>${s.texto?`<p>${n(s.texto)}</p>`:""}</div></div>`).join("")}</div>`),mitofato:(t,e,i,o)=>l(e,i,o,`<h2>${n(t.titulo||"")}</h2><div class="mf"><div class="m"><small>MITO</small><p>${r(t.mito)}</p></div><div class="f"><small>FATO</small><p>${n(t.fato)}</p></div></div>`),antesdepois:(t,e,i,o)=>l(e,i,o,`<h2>${n(t.titulo)}</h2><div class="ad"><div class="a"><small>${r(t.antes?.rotulo||"ANTES")}</small><div class="ano">${r(t.antes?.marco)}</div><p>${n(t.antes?.texto)}</p></div><span class="seta2">\u2193</span><div class="d2"><small>${r(t.depois?.rotulo||"DEPOIS")}</small><div class="ano">${r(t.depois?.marco)}</div><p>${n(t.depois?.texto)}</p></div></div>`),fecho:(t,e,i,o)=>l(e,i,o,`<h2>${n(t.titulo)}</h2>${t.texto?`<p class="p">${n(t.texto)}</p>`:""}<div class="cta">${r(String(t.botao||"Segue "+(e.handle||"a página")).replace(/@exemplo/gi,e.handle||"a página"))}</div>`)};export{h as TIPOS,m as estilo};
