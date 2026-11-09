// Tag 10: Zirpias großer Auftritt. Rhythmusspiel auf der Pilzbühne.
// Noten fliegen von rechts auf die Trommel zu, jeder Treffer spielt die nächste Lautennote der Melodie.
function pluck(t,f,vol){const c=ac(),out=c.createGain(),d=c.createDelay(.05),fb=c.createGain(),lp=c.createBiquadFilter(),n=c.createBufferSource(),ng=c.createGain();
 d.delayTime.value=1/f;fb.gain.value=.965;lp.type='lowpass';lp.frequency.value=f*7;
 n.buffer=noiseBuf();ng.gain.setValueAtTime(vol||.5,t);ng.gain.exponentialRampToValueAtTime(.001,t+.025);
 n.connect(ng);ng.connect(d);d.connect(lp);lp.connect(fb);fb.connect(d);lp.connect(out);
 out.gain.setValueAtTime(.9,t);out.gain.exponentialRampToValueAtTime(.001,t+1.4);out.connect(drumOut());n.start(t);n.stop(t+.03);
 setTimeout(()=>{try{fb.disconnect();out.disconnect()}catch(e){}},1700+Math.max(0,(t-c.currentTime)*1000))}


// Irrlicht als Note: Bild plus starker Leuchthof
const WISP={'#ff7a4a':4,'#ffd23f':3,'#5fd16a':2,'#5ab8ff':1,'#4fe36a':2,'#ff5a6a':4,'#ffd23f ':3};
// Leuchtkern je Irrlichtbild (gemessen), damit Lichthof und Kern genau auf dem Irrlicht sitzen
const WISPK={1:[.534,.693],2:[.489,.703],3:[.538,.672],4:[.485,.659],5:[.528,.625]};
function wispEl(col,wi){const k=WISPK[wi]||[.5,.66];const e=el('div','rk-w','<b></b><i></i><img src="'+A+'ui/wisp_'+wi+'.png" alt="" style="left:'+(50-k[0]*128).toFixed(1)+'%;top:'+(50-k[1]*128).toFixed(1)+'%">');e.style.setProperty('--c',col);return e}

// Flamme wie bei Guitar Hero. Stufe 0: nur draufgehauen (kleines Flämmchen), 1: Treffer, 2: perfekt
function fireFx(fx,x,y,col,sc,lv){const S=[.45,1,1.35][lv];const f=el('div','rk-fire');f.style.left=x+'px';f.style.top=y+'px';f.style.setProperty('--c',col);f.style.setProperty('--s',sc*S);fx.appendChild(f);setTimeout(()=>f.remove(),700);
 const nT=[3,5,7][lv];for(let k=0;k<nT;k++){const t=el('span');const off=(k-(nT-1)/2);t.style.setProperty('--x',(off*9)+'px');t.style.setProperty('--h',(0.55+Math.random()*.45+(Math.abs(off)<1?.35:0)).toFixed(2));t.style.setProperty('--r',((Math.random()-.5)*16+off*5).toFixed(1)+'deg');t.style.animationDelay=(Math.random()*.06).toFixed(2)+'s';if(!lv)t.style.animationDuration='.38s';f.appendChild(t)}
 f.appendChild(el('em'));
 for(let k=0;k<[1,6,12][lv];k++){const e=el('div','rk-ember');e.style.left=x+'px';e.style.top=y+'px';e.style.setProperty('--c',col);e.style.setProperty('--s',sc);e.style.setProperty('--dx',((Math.random()-.5)*60*sc*S)+'px');e.style.setProperty('--dy',(-(90+Math.random()*120)*sc*S)+'px');e.style.animationDelay=(Math.random()*.15).toFixed(2)+'s';fx.appendChild(e);setTimeout(()=>e.remove(),1100)}}
// Trefferfeedback für Schlagzeug und Laute: Blitz, Lichtsäule, Schockwellen, Funken, Text
function hitFx(fx,x,y,col,perf,sc,txtY){sc=sc||1;
 const add=(cls,w,ms)=>{const d=el('div',cls);d.style.left=x+'px';d.style.top=y+'px';d.style.setProperty('--c',col);d.style.setProperty('--s',sc);fx.appendChild(d);setTimeout(()=>d.remove(),ms);return d};
 add('rk-flash'+(perf?' p':''),0,420);
 fireFx(fx,x,y,col,sc,perf?2:1);
 for(let k=0;k<(perf?26:12);k++){const sp=add('rk-sp'+(k%4===0?' big':''),0,700);sp.style.setProperty('--c',k%3?col:'#fffbe6');sp.style.setProperty('--a',(Math.random()*360)+'deg');sp.style.setProperty('--d',((45+Math.random()*(perf?110:60))*sc)+'px')}
 const t=el('div','rk-txt '+(perf?'p':'g'),perf?'Perfekt!':'Gut!');t.style.left=x+'px';t.style.top=(txtY!=null?txtY:y-60*sc)+'px';fx.appendChild(t);setTimeout(()=>t.remove(),750);
 try{navigator.vibrate&&navigator.vibrate(perf?18:10)}catch(e){}}

// Rock Band Variante: Zirpias Schlagzeug von oben, vier Spuren, echte Instrumentalfassung von Zirpias Mittelalter Rock
GAMES.takt=()=>new Promise(async done=>{hideBox();
 const LANES=[{n:'rk_pauke2',c:'#ff7a4a'},{n:'rk_trommel',c:'#ffd23f'},{n:'rk_tom',c:'#5fd16a'},{n:'rk_becken',c:'#5ab8ff'}];
 const LEAD=1.9,PADY=.735,TOPY=.33;
 const o=el('div','rk');o.innerHTML='<div class="tk2-bg rk-bgb"></div><div class="rk-st"><div class="tk2-top"><div class="tk2-t">Zirpias großer Auftritt</div><div class="tk2-meter"><i></i><b>Begeisterung</b></div></div>'+
  '<svg class="rk-hw" viewBox="0 0 100 100" preserveAspectRatio="none"></svg><div class="rk-notes"></div>'+
  '<div class="rk-stand"></div>'+LANES.map((l,i)=>'<div class="rk-pad p'+i+'" data-i="'+i+'"><img src="'+A+'ui/'+l.n+'.png" alt=""></div><div class="rk-ring r'+i+'"></div>').join('')+
  '<div class="rk-arm l"><img src="'+A+'ui/zi_arm2.png" alt=""></div><div class="rk-arm r"><img src="'+A+'ui/zi_arm2.png" alt=""></div>'+
  '<div class="rk-fx"></div><div class="rk-combo"></div><div class="rk-pop"></div><div class="rk-help">Tippe die Trommel, sobald ein Licht in ihrem Kreis ist.</div><div class="tk2-count"></div><div class="rk-load">Die Bühne wird aufgebaut …</div></div>';
 document.body.appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));
 const $o=s=>o.querySelector(s),stg=$o('.rk-st'),notesEl=$o('.rk-notes'),pads=[...o.querySelectorAll('.rk-pad')],arms=[...o.querySelectorAll('.rk-arm')],pop=$o('.rk-pop'),comboEl=$o('.rk-combo'),meter=$o('.tk2-meter i');
 // Ego Ansicht: Instrumente im Bogen vor Zirpia, Spuren laufen von oben auf die Trommelfelle zu
 const INS=[{cx:.17,cy:.805,w:.46,hx:.603,hy:.526,rx:.328,ry:.403,ar:324/360},{cx:.445,cy:.715,w:.21,hx:.504,hy:.157,rx:.405,ry:.132,ar:360/274},{cx:.645,cy:.735,w:.21,hx:.503,hy:.157,rx:.399,ry:.132,ar:360/276},{cx:.845,cy:.585,w:.3,hx:.498,hy:.495,rx:.48,ry:.478,ar:330/360}];
 const rings=[...o.querySelectorAll('.rk-ring')],stand=$o('.rk-stand'),hw=$o('.rk-hw');let TG=[],OR=[];
 const layout=()=>{const W=stg.clientWidth,H=stg.clientHeight;
  TG=INS.map((d,i)=>{const w=d.w*W,h=w*d.ar,l=d.cx*W-w/2,t=d.cy*H-h/2;const p=pads[i];p.style.left=l+'px';p.style.top=t+'px';p.style.width=w+'px';p.style.height=h+'px';return {x:l+d.hx*w,y:t+d.hy*h,rx:d.rx*w,ry:d.ry*h,r:Math.min(d.rx*w,d.ry*h)}});
  OR=TG.map((g,i)=>({x:(.39+i*.074)*W,y:.33*H}));
  TG.forEach((g,i)=>{const r=rings[i];r.style.left=g.x+'px';r.style.top=g.y+'px';r.style.width=(g.rx*2)+'px';r.style.height=(g.ry*2)+'px'});
  const c3=TG[3];stand.style.left=c3.x+'px';stand.style.top=c3.y+'px';stand.style.height=(H-c3.y)+'px';
  hw.setAttribute('viewBox','0 0 '+W+' '+H);let sv='';TG.forEach((g,i)=>{const o2=OR[i],wb=g.rx*.9,wt=W*.026;sv+='<polygon points="'+(o2.x-wt)+','+o2.y+' '+(o2.x+wt)+','+o2.y+' '+(g.x+wb)+','+g.y+' '+(g.x-wb)+','+g.y+'" fill="'+LANES[i].c+'" fill-opacity=".16" stroke="rgba(255,240,200,.45)" stroke-width="1.2"/>'});hw.innerHTML=sv};
 layout();addEventListener('resize',layout);
 // Trefferzone: mindestens so hoch wie breit, damit schmale Felle (von oben gesehen) nicht schwerer sind
 const zd=(L,P,f)=>{const g=TG[L];const ry=Math.max(g.ry,g.rx*.8);const dx=(P.x-g.x)/(g.rx*f),dy=(P.y-g.y)/(ry*f);return dx*dx+dy*dy};
 const inside=(L,P,f)=>zd(L,P,f)<=1;
 const ease=u=>u<=1?(u=Math.max(0,u),.45*u+.55*(2*u-u*u)):1+(u-1)*.45;
 const lanePos=(i,u)=>{u=ease(u);const o2=OR[i],g=TG[i];return {x:o2.x+(g.x-o2.x)*u,y:o2.y+(g.y-o2.y)*u,s:.4+.6*u}};
 // Arme: Schultern unten links und rechts außerhalb des Bildes
 const SH=[{x:.1,y:1.1},{x:.9,y:1.1}];
 const armAim=(a,tx,ty)=>{const W=stg.clientWidth,H=stg.clientHeight,sx=SH[a].x*W,sy=SH[a].y*H;const dx=tx-sx,dy=ty-sy,len=Math.hypot(dx,dy),ang=Math.atan2(dx,-dy)*180/Math.PI;const e=arms[a];
  e.style.left=sx+'px';e.style.top=sy+'px';e.style.height=(len*1.02)+'px';e.style.transform='translate(-50%,-100%) rotate('+ang+'deg)'};
 const rest=a=>{const g1=TG[a*2],g2=TG[a*2+1];armAim(a,(g1.x+g2.x)/2,(g1.y+g2.y)/2-stg.clientHeight*.07)};
 const idle=()=>{rest(0);rest(1)};idle();addEventListener('resize',idle);
 if(TEST){const tb=el('button','pbn-test','Test: fertig');tb.style.cssText='position:absolute;right:8px;top:70px;z-index:9';tb.onclick=()=>{res.hits=CH.length;finish()};stg.appendChild(tb)}
 const c=ac();const LAT=(c.outputLatency||c.baseLatency||0);
 const load=u=>loadVo(A+u).catch(()=>null);
 const [band,drums,CH]=await Promise.all([load('rock/band.mp3'),load('rock/drums.mp3'),fetch(A+'rock/chart.json').then(r=>r.json())]);
 const SMP={};await Promise.all(['tr_tief','tr_hoch','schelle'].map(n=>loadVo(A+'sfx/'+n+'.mp3').then(b=>SMP[n]=b).catch(()=>{})));
 const samp=(n,t,v)=>{const b=SMP[n];if(!b)return;const s=c.createBufferSource(),g=c.createGain();s.buffer=b;g.gain.value=v;s.connect(g);g.connect(drumOut());s.start(Math.max(t,c.currentTime))};
 $o('.rk-load').remove();
 const N=CH.length;let res={hits:0,perfect:0},combo=0,mood=25,fin=0,raf=0,srcs=[],dg=null;
 let jubelT=0;const setMood=v=>{const was=mood;mood=Math.max(0,Math.min(100,v));meter.style.width=mood+'%';o.classList.toggle('m2',mood>75);o.classList.toggle('voll',mood>=100);if(mood>=100&&was<100&&performance.now()>jubelT){jubelT=performance.now()+9000;sfx('jubel_voll',.7);const j=el('div','rk-jubel','Die Menge tobt!');stg.appendChild(j);setTimeout(()=>j.remove(),2200)}};
 const say=(t,k)=>{pop.textContent=t;pop.className='rk-pop on '+(k||'');clearTimeout(pop._t);pop._t=setTimeout(()=>pop.className='rk-pop',380)};
 const spark=(i,gold)=>{const p=pads[i];for(let k=0;k<(gold?12:6);k++){const s=el('i','tk2-sp'+(gold?' g':''));s.style.setProperty('--a',(Math.random()*360)+'deg');s.style.setProperty('--d',(35+Math.random()*55)+'px');p.appendChild(s);setTimeout(()=>s.remove(),600)}};
 // Trefferfeedback: Lichtblitz, Schockwelle, Funken in Spurfarbe, schwebender Text über dem Instrument
 const fx=$o('.rk-fx');
 const burst=(L,perf)=>{const g=TG[L];hitFx(fx,g.x,g.y,LANES[L].c,perf,Math.max(.8,g.r/60),g.y-g.r*1.2);
  if(perf&&combo>=10){stg.classList.remove('shake');void stg.offsetWidth;stg.classList.add('shake')}
  o.classList.toggle('feuer',combo>=10)};
 const missFx=L=>{const g=TG[L];const m=el('div','rk-miss');m.style.left=g.x+'px';m.style.top=g.y+'px';fx.appendChild(m);setTimeout(()=>m.remove(),450);o.classList.remove('feuer')};
 const stopAll=()=>{srcs.forEach(s=>{try{s.stop()}catch(e){}});srcs=[]};
 const run=()=>{
  res={hits:0,perfect:0};combo=0;setMood(25);notesEl.innerHTML='';comboEl.textContent='';fin=0;$o('.rk-help').classList.remove('weg');
  const beat=.512,t0=c.currentTime+LEAD+4*beat+.3;hush(true);
  for(let i=0;i<4;i++)samp('schelle',t0-(4-i)*beat,.45);
  const cnt=$o('.tk2-count');['4','3','2','1'].forEach((n,i)=>setTimeout(()=>{cnt.textContent=n;cnt.className='tk2-count on';setTimeout(()=>cnt.className='tk2-count',380)},Math.max(0,(t0-(4-i)*beat-c.currentTime)*1000)));
  // Band und Schlagzeug getrennt starten, Schlagzeug wird bei Fehlern leiser
  dg=c.createGain();dg.gain.value=1;dg.connect(drumOut());const bg=c.createGain();bg.gain.value=.9;bg.connect(drumOut());
  [[band,bg],[drums,dg]].forEach(([b,g])=>{if(!b)return;const s=c.createBufferSource();s.buffer=b;s.connect(g);s.start(t0);srcs.push(s)});
  const notes=CH.map(([t,L],i)=>({t:t0+t,L,e:null,st:0}));// Lichter erst kurz vor dem Auftritt erzeugen, danach entfernen
  let next=0;const end=t0+(band?band.duration:CH[N-1][0]+3);
  const hitLane=(L,ev)=>{if(fin)return;const now=c.currentTime-LAT;
   const p=pads[L];p.classList.remove('hit');void p.offsetWidth;p.classList.add('hit');
   const a=L<2?0:1;armAim(a,TG[L].x,TG[L].y);clearTimeout(arms[a]._t);arms[a]._t=setTimeout(()=>rest(a),120);const rg=rings[L];rg.classList.remove('hit');void rg.offsetWidth;rg.classList.add('hit');
   let k=-1,bd=9;for(let j=next;j<N&&notes[j].t<now+LEAD;j++){const n=notes[j];if(n.st||n.L!==L)continue;const P=lanePos(L,1-(n.t-now)/LEAD);if(!inside(L,P,1.12))continue;const d=Math.abs(now-n.t);if(d<bd){bd=d;k=j}}
   if(k<0){samp(L===3?'schelle':L===1?'tr_hoch':'tr_tief',c.currentTime,.3);fireFx(fx,TG[L].x,TG[L].y,LANES[L].c,Math.max(.8,TG[L].r/60),0);return}
   const n=notes[k];n.st=1;res.hits++;combo++;dg.gain.setTargetAtTime(1,c.currentTime,.02);if(res.hits===5)$o('.rk-help').classList.add('weg');
   if(bd<=.09){res.perfect++;burst(L,true);setMood(mood+2.2)}else{burst(L,false);setMood(mood+1.3)}
   comboEl.textContent=combo>=4?combo+' in Folge':'';comboEl.classList.remove('bump');void comboEl.offsetWidth;comboEl.classList.add('bump');
   if(combo%20===0){sfx('jubel_kurz',.55)}};
  const tap=e=>{if(e.target.closest('button'))return;e.preventDefault();const r=stg.getBoundingClientRect();const fx=(e.clientX-r.left)/r.width;{const x=e.clientX-r.left,y=e.clientY-r.top;let b=-1,bz=1;TG.forEach((g,i)=>{const z=zd(i,{x,y},1.25);if(z<=bz){bz=z;b=i}});if(b<0){let bd=1e9;TG.forEach((g,i)=>{const d=Math.abs(g.x-x);if(d<bd){bd=d;b=i}})}hitLane(b,e)}};
  const kb=e=>{const L='dfjk'.indexOf(e.key.toLowerCase());if(L>=0&&!e.repeat)hitLane(L)};
  o.addEventListener('pointerdown',tap);addEventListener('keydown',kb);
  const loop=()=>{const now=c.currentTime-LAT,W=stg.clientWidth,H=stg.clientHeight;
   for(let j=next;j<N;j++){const n=notes[j];const dt=n.t-now;if(dt>LEAD+.1)break;
    if(!n.e){n.e=wispEl(LANES[n.L].c,[4,3,2,1][n.L]);notesEl.appendChild(n.e)}
    const Pq=lanePos(n.L,Math.min(1.8,1-dt/LEAD));if(!n.st&&dt<0&&(!inside(n.L,Pq,1.12)||dt<-.6)){n.st=2;n.mt=now;n.e.classList.add('miss');missFx(n.L);combo=0;comboEl.textContent='';setMood(mood-2.5);dg.gain.setTargetAtTime(.2,c.currentTime,.02);setTimeout(()=>{if(dg)dg.gain.setTargetAtTime(1,c.currentTime,.08)},380)}
    const u=1-dt/LEAD,P=lanePos(n.L,Math.min(1.8,u));n.e.style.transform='translate('+P.x+'px,'+P.y+'px) translate(-50%,-50%) scale('+P.s+')';n.e.style.opacity=n.st===1?0:n.st===2?Math.max(0,1-(now-n.mt)/.5):(u<0?0:Math.min(1,u*3))}
   while(next<N&&notes[next].st&&(notes[next].st===1?notes[next].t<now-.4:now-notes[next].mt>.55)){if(notes[next].e){notes[next].e.remove();notes[next].e=null}next++}
   if(now>end+.3||(next>=N&&now>CH[N-1][0]+t0+2.5)){o.removeEventListener('pointerdown',tap);removeEventListener('keydown',kb);finish();return}
   raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
  o._cleanup=()=>{o.removeEventListener('pointerdown',tap);removeEventListener('keydown',kb)}};
 async function finish(){if(fin)return;fin=1;cancelAnimationFrame(raf);if(o._cleanup)o._cleanup();
  srcs.forEach(s=>{try{s.stop(c.currentTime+1.2)}catch(e){}});if(dg)dg.gain.setTargetAtTime(0,c.currentTime,.4);hush(false);o.classList.add('ende');
  const q=res.hits/N,stars=q>=.8?3:q>=.55?2:q>=.3?1:0;
  sfx(stars>=2?'fanfare':'sieg',.6);setTimeout(()=>sfx('applaus',stars>=2?.7:.35),400);
  const msg=stars===3?'Tosender Applaus! Die Schnecken jubeln, bis ihnen die Fühler wackeln.':stars===2?'Die Schnecken wippen begeistert mit.':stars===1?'Höflicher Applaus. Sehr langsamer Applaus.':'Die Schnecken sind eingeschlafen. Aber freundlich.';
  const card=el('div','tk2-end','<div class="tk2-stars">'+[0,1,2].map(i=>'<img src="'+A+'ui/stern.png" class="'+(i<stars?'on':'')+'" style="animation-delay:'+(i*.25)+'s" alt="">').join('')+'</div><h3>'+res.hits+' von '+N+' Schlägen</h3><p>'+msg+'</p><div class="hero-nav">'+(stars<3?'<button class="pbtn tk2-again">Nochmal</button>':'')+'<button class="pbtn tk2-go">Weiter</button></div>');
  stg.appendChild(card);requestAnimationFrame(()=>card.classList.add('on'));
  const r=await new Promise(rs=>{card.querySelector('.tk2-go').onclick=()=>rs(0);const a=card.querySelector('.tk2-again');if(a)a.onclick=()=>rs(1)});
  sfx('ui_klick',.6);card.remove();o.classList.remove('ende');stopAll();
  if(r){await sleep(300);run();return}
  removeEventListener('resize',layout);removeEventListener('resize',idle);o.classList.remove('on');await sleep(450);o.remove();done()}
 // Zirpia erklärt das Spiel (nur beim ersten Öffnen)
 const speak=(id,t)=>new Promise(res=>{const b=el('div','rk-say','<div class="rk-face"></div><p>'+t+'</p>');b.querySelector('.rk-face').style.backgroundImage='url('+A+'img/p_zi_2.jpg)';stg.appendChild(b);requestAnimationFrame(()=>b.classList.add('on'));
  const a=playVo(A+'vo/'+id+'.mp3');let fin2=0;const go=()=>{if(fin2)return;fin2=1;if(a&&!a.ended)stopVo();b.classList.remove('on');setTimeout(()=>b.remove(),250);res()};
  b.onpointerdown=e=>{e.stopPropagation();go()};const iv=setInterval(()=>{if(!a||a.ended){clearInterval(iv);setTimeout(go,a?300:t.length*55)}},120)});
 await sleep(500);
 if(!st.flags.takt_erkl){await speak('d10_t1','Du sitzt an meinem Schlagzeug! Ich singe, du trommelst. Das wird legendär.');await speak('d10_t2','Siehst du die Lichter? Sie fliegen auf die Trommeln zu. Sobald ein Licht im Kreis auf seiner Trommel ist, tippst du genau diese Trommel an.');await speak('d10_t3','Links die große Trommel, dann die kleine, die Tom und ganz rechts das Becken. Und wenn du mal danebenhaust: Das nennt man dann Jazz.');st.flags.takt_erkl=1;save()}
 run()});
