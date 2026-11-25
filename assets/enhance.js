
(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const CY='#22d3ee',reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const onView=(el,fn,t=.35)=>{if(!el)return;const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){fn();io.disconnect();}}),{threshold:t});io.observe(el);};
/* auto-stepper: advances by itself, hover pauses, tap toggles, click a step jumps */
function stepper(root,n,apply,stepEls,ms=2800){
  let k=0,t=null,paused=false,running=false;
  const show=i=>{k=i;apply(i);stepEls.forEach((s,j)=>{s.classList.toggle('on',j===i-1);s.classList.toggle('past',j<i-1);});
    root.style.setProperty('--ms',ms+'ms');root.classList.remove('tick');void root.offsetWidth;root.classList.add('tick');};
  const next=()=>show(k>=n?0:k+1);
  const play=()=>{if(t||paused||!running)return;t=setInterval(next,ms);root.classList.remove('paused');};
  const stop=()=>{clearInterval(t);t=null;root.classList.add('paused');};
  root.addEventListener('mouseenter',()=>{paused=true;stop();});
  root.addEventListener('mouseleave',()=>{paused=false;play();});
  root.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){paused=!paused;paused?stop():play();}});
  stepEls.forEach((s,j)=>{s.tabIndex=0;s.addEventListener('click',()=>show(j+1));s.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(j+1);}});});
  if(reduce){show(n);return;}
  show(0);onView(root,()=>{running=true;root.classList.add('run');play();},.4);
}
window.stepper=stepper;

/* caio: the scattered -> ordered swipe sweeps by itself; hover or touch takes over */
(function(){
  const root=$('#swipe');if(!root)return;const sl=root.querySelector('img-comparison-slider');
  let ph=Math.PI/2,paused=false,running=false,last=0;const A=44,PERIOD=7000;
  const set=v=>{sl.value=v;};
  const frame=now=>{if(running&&!paused){const dt=last?now-last:16;ph+=dt/PERIOD*Math.PI*2;set(50-A*Math.cos(ph));}last=now;requestAnimationFrame(frame);};
  const resume=()=>{const v=+sl.value||50,c=Math.max(-1,Math.min(1,(50-v)/A));ph=Math.acos(c);paused=false;root.classList.remove('paused');};
  root.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){paused=true;root.classList.add('paused');clearTimeout(root._t);root._t=setTimeout(resume,4000);}});
  if(reduce){customElements.whenDefined('img-comparison-slider').then(()=>set(12));return;}
  customElements.whenDefined('img-comparison-slider').then(()=>onView(root,()=>{running=true;requestAnimationFrame(frame);},.4));
})();

/* questions: veil clears when the photo scrolls in */
onView($('.meeting'),()=>$('.meeting').classList.add('clear'),.4);

/* approach: waffle 24 -> 9 -> 4 -> 2 */
(function(){
  const box=$('#wafPlot');if(!box)return;
  const counts=[24,9,4,2],labels=['רעיונות על השולחן','עוברים את מבחן הערך העסקי','יש להם נתונים מוכנים','החלטות: אחת עכשיו, אחת ברבעון הבא'];
  const draw=k=>{const w=Math.min(box.clientWidth||600,620),keep=counts[k],data=[{c:'keep',v:keep},{c:'gone',v:24-keep}];
    const svg=Plot.plot({width:w,height:Math.round(Math.min(190,w*.34)),margin:4,style:{background:'transparent'},x:{axis:null},y:{axis:null},color:{type:'identity'},
      marks:[Plot.waffleX(data,{x:'v',fill:d=>d.c==='keep'?(k===3?CY:'#475569'):'#111827',stroke:d=>d.c==='keep'?(k===3?CY:'#64748b'):'#1e293b',unit:1,multiple:6,gap:6,rx:6})]});
    box.replaceChildren(svg);$('#wafN').textContent=keep;$('#wafL').textContent=labels[k];$('#waf').classList.toggle('done',k===3);};
  stepper($('#waf'),3,draw,$$('#waf .sb'));
})();

/* proof: fitted headline number + quarterly line */
(function(){
  if(!$('#spark'))return;
  const box=$('#spark'),vals=[14.2,14.6,14.4,14.8,13.0,11.1,9.9,9.5],pts=vals.map((y,x)=>({x,y}));
  const draw=()=>{const w=box.clientWidth||600;
    const svg=Plot.plot({width:w,height:Math.round(Math.min(220,w*.4)),marginLeft:34,marginRight:14,marginTop:26,marginBottom:22,style:{background:'transparent',color:'#64748b',fontSize:'12px'},
      x:{axis:null},y:{domain:[8,16],ticks:[8,10,12,14,16],tickSize:0,label:null,grid:true},
      marks:[Plot.ruleX([3.5],{stroke:'#94a3b8',strokeDasharray:'3 4'}),
        Plot.text([{x:3.5,y:16}],{x:'x',y:'y',text:()=>'ההחלטה',dy:-12,fill:'#cbd5e1',fontSize:13,fontWeight:600}),
        Plot.areaY(pts.slice(3),{x:'x',y:'y',y1:8,fill:'rgba(34,211,238,.10)'}),
        Plot.line(pts.slice(0,4),{x:'x',y:'y',stroke:'#64748b',strokeWidth:2.5}),
        Plot.line(pts.slice(3),{x:'x',y:'y',stroke:CY,strokeWidth:3.5}),
        Plot.dot(pts,{x:'x',y:'y',r:4.5,fill:d=>d.x>3?CY:'#64748b'})]});
    box.replaceChildren(svg);};
  draw();let rw=box.clientWidth;addEventListener('resize',()=>{if(Math.abs(box.clientWidth-rw)>30){rw=box.clientWidth;draw();}});
})();

/* how: the beam travels from step to step; each step lights up when the beam reaches it */
(function(){
  const root=$('#howv');if(!root)return;
  const st=$$('#howv .stp'),wrap=root.querySelector('.stairs'),beam=root.querySelector('.beam'),fill=beam.firstElementChild;
  const nodes=[...st.map(x=>x.querySelector('.orb')),root.querySelector('.goal .tile')];
  const TRAVEL=2400,HOLD=800,EASE=`height ${TRAVEL}ms cubic-bezier(.45,0,.55,1)`;
  let ys=[],timer=null;
  const place=()=>{const r0=wrap.getBoundingClientRect(),c=o=>{const r=o.getBoundingClientRect();return r.top+r.height/2-r0.top;};
    const y=nodes.map(c);beam.style.top=y[0]+'px';beam.style.height=(y[y.length-1]-y[0])+'px';ys=y.map(v=>v-y[0]);};
  const light=i=>{st.forEach((x,j)=>{x.classList.toggle('on',j===i);x.classList.toggle('past',j<i);});root.classList.toggle('done',i===3);};
  const later=(fn,ms)=>{clearTimeout(timer);timer=setTimeout(fn,ms);};
  const jump=(h,i)=>{fill.style.transition='none';fill.style.height=h+'px';light(i);void fill.offsetHeight;fill.style.transition=EASE;};
  const go=i=>{place();beam.classList.add('moving');fill.style.height=ys[i]+'px';
    later(()=>{beam.classList.remove('moving');light(i);i<3?later(()=>go(i+1),HOLD):later(reset,2400);},i===0?0:TRAVEL);};
  const reset=()=>{jump(0,-1);later(()=>go(0),700);};
  place();addEventListener('resize',()=>{place();});
  fill.style.transition=EASE;
  st.forEach((x,j)=>{x.tabIndex=0;const f=()=>{place();beam.classList.remove('moving');jump(ys[j],j);later(()=>go(j+1),HOLD+1200);};
    x.addEventListener('click',f);x.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f();}});});
  if(reduce){place();jump(ys[3],3);return;}
  onView(root,()=>{root.classList.add('run');light(-1);go(0);},.4);
})();
})();
