// Diagramas explicativos determinísticos. Distâncias e velocidades são ilustrativas.
const limitar = n => Math.max(0,Math.min(1,n));
export const MODELOS_MECANISMO = ['fases-lua','reflexao-luz'];
export function validarMecanismo(el) {
  const erros=[];
  if(!MODELOS_MECANISMO.includes(el.mecanismo))erros.push('mecanismo: use fases-lua ou reflexao-luz.');
  for(const k of ['anguloInicial','anguloFinal'])if(el[k]!=null&&(!Number.isFinite(el[k])||Math.abs(el[k])>720))erros.push(`${k}: use graus entre -720 e 720.`);
  if(el.periodo!=null&&(!Number.isFinite(el.periodo)||el.periodo<1||el.periodo>60))erros.push('periodo: use entre 1 e 60 segundos.');
  if(el.rotulo!=null&&(typeof el.rotulo!=='string'||el.rotulo.length>70))erros.push('rotulo: até 70 caracteres.');
  return erros;
}
export function estadoMecanismo(el,beat,t,inicio=beat.de) {
  const p=limitar((t-inicio)/Math.max(.1,el.periodo??beat.ate-inicio));
  const angulo=((el.anguloInicial??15)+((el.anguloFinal??345)-(el.anguloInicial??15))*p)*Math.PI/180;
  return {angulo,lua:[Math.cos(angulo),Math.sin(angulo)],fase:(1+Math.cos(angulo))/2,
    // Pulsos se deslocam sem depender de quadros anteriores.
    pulsos:Array.from({length:5},(_,i)=>((Math.max(0,t-inicio)*.48+i/5)%1))};
}
function esfera(ctx,x,y,r,tipo,luz=[-.65,-.35,.65]) {
  const g=ctx.createRadialGradient(x-r*.35,y-r*.35,r*.08,x,y,r);
  const cores=tipo==='sol'?['#FFF5BC','#FFC15B','#C65B18']:tipo==='terra'?['#88CDDF','#286C93','#153246']:['#E6E3D9','#92949A','#343640'];
  g.addColorStop(0,cores[0]);g.addColorStop(.7,cores[1]);g.addColorStop(1,cores[2]);
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,2*Math.PI);ctx.fill();
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,2*Math.PI);ctx.clip();
  if(tipo==='lua'){
    for(let i=0;i<22;i++){
      const a=i*2.39996323,ra=Math.sqrt((i+.5)/22)*r*.88,cx=x+Math.cos(a)*ra,cy=y+Math.sin(a)*ra;
      ctx.fillStyle='rgba(34,35,45,.25)';ctx.beginPath();ctx.ellipse(cx,cy,r*(.025+(i%4)*.012),r*.04,a,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(250,247,235,.15)';ctx.lineWidth=1.5;ctx.stroke();
    }
  }
  if(tipo==='terra'){
    ctx.fillStyle='#5E9A77';
    for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(x+Math.cos(i*2.7)*r*.4,y+Math.sin(i*2.7)*r*.5,r*.3,r*.16,i,0,Math.PI*2);ctx.fill();}
  }
  if(tipo!=='sol'){
    // Lambert por pequenas faixas de superfície; o lado escuro segue a luz.
    const passo=Math.max(2,r/32);
    for(let yy=-r;yy<r;yy+=passo)for(let xx=-r;xx<r;xx+=passo){
      const u=(xx+passo/2)/r,v=-(yy+passo/2)/r,q=1-u*u-v*v;if(q<0)continue;
      const intensidade=Math.max(0,u*luz[0]+v*luz[1]+Math.sqrt(q)*luz[2]);
      ctx.fillStyle=`rgba(5,8,17,${(.90*(1-intensidade)).toFixed(3)})`;ctx.fillRect(x+xx,y+yy,passo+.5,passo+.5);
    }
  }
  ctx.restore();ctx.strokeStyle='rgba(255,255,255,.15)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r,0,2*Math.PI);ctx.stroke();
}
function seta(ctx,a,b,cor,pulsos){
  const dx=b[0]-a[0],dy=b[1]-a[1],ang=Math.atan2(dy,dx),ponta=[b[0]-Math.cos(ang)*10,b[1]-Math.sin(ang)*10];
  ctx.strokeStyle=cor;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();
  ctx.beginPath();ctx.moveTo(...b);ctx.lineTo(ponta[0]+Math.sin(ang)*6,ponta[1]-Math.cos(ang)*6);ctx.moveTo(...b);ctx.lineTo(ponta[0]-Math.sin(ang)*6,ponta[1]+Math.cos(ang)*6);ctx.stroke();
  ctx.fillStyle=cor;for(const p of pulsos){ctx.beginPath();ctx.arc(a[0]+dx*p,a[1]+dy*p,4,0,2*Math.PI);ctx.fill();}
}
export function pintarMecanismo(ctx,el,beat,t,area,marca,txt,inicio) {
  const e=estadoMecanismo(el,beat,t,inicio),w=area.x1-area.x0,h=area.y1-area.y0,x=area.x0,y=area.y0;
  const horizontal=w>h*1.8,raio=Math.min(w*.075,h*.14),rotulo=horizontal?26:32;
  if(el.mecanismo==='reflexao-luz'){
    const sol=[x+w*.18,y+h*.24],lua=[x+w*.76,y+h*.43],terra=[x+w*.24,y+h*.75];
    seta(ctx,[sol[0]+raio,sol[1]],[lua[0]-raio,lua[1]-raio*.35],marca.destaque,e.pulsos);
    seta(ctx,[lua[0]-raio*.5,lua[1]+raio*.7],[terra[0]+raio,terra[1]],marca.apoio,e.pulsos);
    esfera(ctx,...sol,raio*1.2,'sol');esfera(ctx,...lua,raio*1.15,'lua',[-.82,.2,.5]);esfera(ctx,...terra,raio,'terra');
    txt('Sol',sol[0]-raio,sol[1]+raio*1.5,w*.25,rotulo);
    txt('Lua',lua[0]-raio,lua[1]+raio*1.5,w*.2,rotulo);
    txt('Terra',terra[0]-raio,terra[1]+raio*1.3,w*.25,rotulo);
    txt('Luz solar',x+w*.35,y+h*.17,w*.35,rotulo,marca.destaque);
    txt('Luz refletida',x+w*.38,y+h*.72,w*.44,rotulo,marca.apoio);
  }else{
    const cx=x+w*.46,cy=y+h*(horizontal?.43:.36),rx=w*.28,ry=Math.min(h*.22,rx*.72);
    ctx.strokeStyle=marca.sombra;ctx.lineWidth=3;ctx.setLineDash([7,9]);ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
    const sol=[x+w*.08,cy],lua=[cx+rx*e.lua[0],cy-ry*e.lua[1]];
    for(let i=-1;i<=1;i++)seta(ctx,[x+w*.13,cy+i*ry*.75],[x+w*.31,cy+i*ry*.75],marca.apoio,e.pulsos);
    esfera(ctx,...sol,raio*.65,'sol');esfera(ctx,cx,cy,raio*.75,'terra');esfera(ctx,...lua,raio*.48,'lua',[-1,0,0]);
    txt('Sol',x+w*.02,cy+raio,w*.16,rotulo);
    txt('Terra',cx-raio,cy+raio,w*.23,rotulo);
    const ix=horizontal?x+w*.85:cx,iy=horizontal?cy:y+h*.68,ir=Math.min(w*.14,h*(horizontal?.17:.14));
    // Base da projeção vista da Terra: direita=(sin θ,-cos θ,0), observador=(-cos θ,-sin θ,0).
    esfera(ctx,ix,iy,ir,'lua',[-Math.sin(e.angulo),0,Math.cos(e.angulo)]);
    txt('Vista da Terra',ix-ir*1.5,iy+ir*1.15,ir*3.2,rotulo);
  }
  txt(el.rotulo||'Esquema acelerado, fora de escala',x+12,y+h-35,w-24,horizontal?22:25,marca.apoio,2);
  return e;
}
