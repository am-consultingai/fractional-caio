
import {ShaderMount,ditheringFragmentShader,getShaderColorFromString as C} from 'https://cdn.jsdelivr.net/npm/@paper-design/shaders@0.0.82/+esm';
import {run} from 'https://cdn.jsdelivr.net/npm/@ertdfgcvb/play@2.0.0/src/run.js';
import {getStroke} from 'https://cdn.jsdelivr.net/npm/perfect-freehand@1.2.3/+esm';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const io=(el,fn,t=.35)=>{if(!el)return;const o=new IntersectionObserver(es=>{if(es[0].isIntersecting){fn();o.disconnect();}},{threshold:t});o.observe(el);};
const sizing={u_fit:1,u_scale:1,u_rotation:0,u_offsetX:0,u_offsetY:0,u_originX:.5,u_originY:.5,u_worldWidth:0,u_worldHeight:0};
const mount=(sel,u,speed)=>{const el=document.querySelector(sel);if(!el)return;try{new ShaderMount(el,ditheringFragmentShader,{...sizing,...u},undefined,reduce?0:speed);}catch(e){console.error(e);}};

/* hero: hand-drawn loop around שלכם */
{const avg=(a,b)=>(a+b)/2;
 const toPath=pts=>{const n=pts.length;if(n<4)return'';let a=pts[0],b=pts[1];const c=pts[2];
  let r=`M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${b[0].toFixed(1)},${b[1].toFixed(1)} ${avg(b[0],c[0]).toFixed(1)},${avg(b[1],c[1]).toFixed(1)} T`;
  for(let i=2;i<n-1;i++){a=pts[i];b=pts[i+1];r+=`${avg(a[0],b[0]).toFixed(1)},${avg(a[1],b[1]).toFixed(1)} `;}return r+'Z';};
 const svg=document.querySelector('#h1Ink');
 if(svg){let sd=7;const rnd=()=>(sd=(sd*9301+49297)%233280)/233280,pts=[],N=80;
  for(let i=0;i<=N;i++){const a=-2.6+i/N*Math.PI*2*1.12,j=1+(rnd()-.5)*.07;pts.push([100+Math.cos(a)*96*j,50+Math.sin(a)*44*j,.5]);}
  const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('fill','#22d3ee');svg.appendChild(p);
  const opt=t=>({size:5,thinning:.6,smoothing:.6,streamline:.4,start:{taper:18},end:{taper:t<1?0:36}});
  if(reduce)p.setAttribute('d',toPath(getStroke(pts,opt(1))));
  else setTimeout(()=>{const t0=performance.now(),ms=1100;const f=now=>{const t=Math.min(1,(now-t0)/ms),k=Math.max(4,Math.round(pts.length*t));
    p.setAttribute('d',toPath(getStroke(pts.slice(0,k),opt(t))));if(t<1)requestAnimationFrame(f);};requestAnimationFrame(f);},700);}}
/* (no sphere) */
mount('#heroShader',{u_scale:.92,u_colorBack:C('#0b0f19'),u_colorFront:C('#155e75'),u_shape:7,u_type:3,u_pxSize:3},.35);
/* questions: noisy veil (clears via CSS when in view) */
mount('#meetShader',{u_fit:2,u_colorBack:C('#000000'),u_colorFront:C('#94a3b8'),u_shape:1,u_type:1,u_pxSize:2},.6);

/* noise: social sources pour noise in from the right; the rook stops it; decisions pass */
const POOL='·:;+=*#%01<>/\\~^@&',hash=(x,y)=>{let h=x*374761393+y*668265263;h=(h^(h>>13))*1274126177;return (h^(h>>16))>>>0;};
const DEC=[[.22,0,7],[.5,.37,5.5],[.78,.71,6.5]];
const field={main(c,ctx){const {cols,rows}=ctx,t=ctx.time/1000,wx=Math.round(cols*.34);
  for(const [fy,off,v] of DEC){const y=Math.round(fy*(rows-1)),span=cols+12,x=Math.round(cols+4-((t*v+off*span)%span));
    if(c.y===y){if(c.x===x)return {char:'◆',color:x<wx?'#22d3ee':'#67e8f9',fontWeight:'700'};if(c.x>wx&&Math.abs(c.x-x)<=2)return ' ';}}
  if(c.x===wx)return {char:'│',color:'rgba(34,211,238,.35)'};
  if(c.x<wx)return ' ';
  const sp=4+(hash(0,c.y)%6),sx=c.x+Math.floor(t*sp),v=hash(sx,c.y),d=c.x-wx;
  const th=d<=3?9:d<=8?7:5.5;if(v%10>=th)return ' ';
  const g=d<=3?120:50+(v%60);return {char:d<=3?'#%@'[v%3]:POOL[v%POOL.length],color:`rgb(${g},${g+12},${g+30})`};}};
const asc=document.querySelector('#ascii');
io(asc,()=>run(field,{element:asc,fps:reduce?1:20}).catch(e=>console.error(e)),.2);

