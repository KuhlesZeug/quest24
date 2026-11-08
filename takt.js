// Tag 10: Zirpias großer Auftritt. Rhythmusspiel auf der Pilzbühne.
// Noten fliegen von rechts auf die Trommel zu, jeder Treffer spielt die nächste Lautennote der Melodie.
function pluck(t,f,vol){const c=ac(),out=c.createGain(),d=c.createDelay(.05),fb=c.createGain(),lp=c.createBiquadFilter(),n=c.createBufferSource(),ng=c.createGain();
 d.delayTime.value=1/f;fb.gain.value=.965;lp.type='lowpass';lp.frequency.value=f*7;
 n.buffer=noiseBuf();ng.gain.setValueAtTime(vol||.5,t);ng.gain.exponentialRampToValueAtTime(.001,t+.025);
 n.connect(ng);ng.connect(d);d.connect(lp);lp.connect(fb);fb.connect(d);lp.connect(out);
 out.gain.setValueAtTime(.9,t);out.gain.exponentialRampToValueAtTime(.001,t+1.4);out.connect(drumOut());n.start(t);n.stop(t+.03);
 setTimeout(()=>{try{fb.disconnect();out.disconnect()}catch(e){}},1700+Math.max(0,(t-c.currentTime)*1000))}

// Rock Band Variante: Zirpias Schlagzeug von oben, vier Spuren, echte Instrumentalfassung von Zirpias Mittelalter Rock
GAMES.takt=()=>new Promise(async done=>{hideBox();
 const LANES=[{n:'rk_pauke',c:'#ff7a4a'},{n:'rk_trommel',c:'#ffd23f'},{n:'rk_tom',c:'#5fd16a'},{n:'rk_becken',c:'#5ab8ff'}];
 const LEAD=1.9,PADY=.735,TOPY=.33;
 const o=el('div','rk');o.innerHTML='<div class="tk2-bg rk-bgb"></div><div class="rk-st"><div class="tk2-top"><div class="tk2-t">Zirpias großer Auftritt</div><div class="tk2-meter"><i></i><b>Begeisterung</b></div></div>'+
  '<svg class="rk-hw" viewBox="0 0 100 100" preserveAspectRatio="none"></svg><div class="rk-notes"></div>'+
  LANES.map((l,i)=>'<div class="rk-pad" data-i="'+i+'"><img src="'+A+'ui/'+l.n+'.png" alt=""></div>').join('')+
  '<img class="rk-arm l" src="'+A+'ui/zi_arm.png" alt=""><img class="rk-arm r" src="'+A+'ui/zi_arm.png" alt="">'+
  '<div class="rk-combo"></div><div class="rk-pop"></div><div class="rk-help">Tippe auf die Spur, wenn eine Note unten am Instrument ankommt.</div><div class="tk2-count"></div><div class="rk-load">Die Bühne wird aufgebaut …</div></div>';
 document.body.appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));
 const $o=s=>o.querySelector(s),stg=$o('.rk-st'),notesEl=$o('.rk-notes'),pads=[...o.querySelectorAll('.rk-pad')],arms=[...o.querySelectorAll('.rk-arm')],pop=$o('.rk-pop'),comboEl=$o('.rk-combo'),meter=$o('.tk2-meter i');
 // Spurgeometrie: unten breit, oben schmal (Perspektive)
 const xb=i=>.14+i*.24,xt=i=>.38+i*.08;
 const lanePos=(i,u)=>({x:xt(i)+(xb(i)-xt(i))*u,y:TOPY+(PADY-TOPY)*u,s:.42+.58*u});
 // Fahrbahn zeichnen
 const hw=$o('.rk-hw');let svg='';const edge=k=>{const xb2=.02+k*.24,xt2=.34+k*.08;return [xb2,xt2]};
 for(let i=0;i<4;i++){const [b0,t0]=edge(i),[b1,t1]=edge(i+1);svg+='<polygon points="'+t0*100+','+TOPY*100+' '+t1*100+','+TOPY*100+' '+b1*100+','+(PADY+.06)*100+' '+b0*100+','+(PADY+.06)*100+'" fill="'+LANES[i].c+'" fill-opacity=".13" stroke="rgba(255,240,200,.5)" stroke-width=".35"/>'}
 svg+='<line x1="2" y1="'+PADY*100+'" x2="98" y2="'+PADY*100+'" stroke="#fff4c8" stroke-width=".5" stroke-opacity=".7"/>';hw.innerHTML=svg;
 const placePads=()=>{const W=stg.clientWidth,H=stg.clientHeight;pads.forEach((p,i)=>{p.style.left=(xb(i)*W)+'px';p.style.top=(PADY*H)+'px'})};placePads();addEventListener('resize',placePads);
 // Arme: Schulter unten außerhalb des Bildes, links für Spur 0 und 1, rechts für 2 und 3
 const armAim=(a,i,strike)=>{const W=stg.clientWidth,H=stg.clientHeight,sx=a===0?.3:.7,sy=1.22;const tx=xb(i),ty=PADY+(strike?0:-.05);
  const dx=(tx-sx)*W,dy=(ty-sy)*H,len=Math.hypot(dx,dy),ang=Math.atan2(dx,-dy)*180/Math.PI;const el2=arms[a];
  el2.style.left=(sx*W)+'px';el2.style.top=(sy*H)+'px';el2.style.height=(len*1.03)+'px';el2.style.transform='translate(-50%,-100%) rotate('+ang+'deg)'};
 const idle=()=>{armAim(0,.5,false);armAim(1,2.5,false)};idle();addEventListener('resize',idle);
 if(TEST){const tb=el('button','pbn-test','Test: fertig');tb.style.cssText='position:absolute;right:8px;top:70px;z-index:9';tb.onclick=()=>{res.hits=CH.length;finish()};stg.appendChild(tb)}
 const c=ac();const LAT=(c.outputLatency||c.baseLatency||0);
 const load=u=>loadVo(A+u).catch(()=>null);
 const [band,drums,CH]=await Promise.all([load('rock/band.mp3'),load('rock/drums.mp3'),fetch(A+'rock/chart.json').then(r=>r.json())]);
 const SMP={};await Promise.all(['tr_tief','tr_hoch','schelle'].map(n=>loadVo(A+'sfx/'+n+'.mp3').then(b=>SMP[n]=b).catch(()=>{})));
 const samp=(n,t,v)=>{const b=SMP[n];if(!b)return;const s=c.createBufferSource(),g=c.createGain();s.buffer=b;g.gain.value=v;s.connect(g);g.connect(drumOut());s.start(Math.max(t,c.currentTime))};
 $o('.rk-load').remove();
 const N=CH.length;let res={hits:0,perfect:0},combo=0,mood=25,fin=0,raf=0,srcs=[],dg=null;
 const setMood=v=>{mood=Math.max(0,Math.min(100,v));meter.style.width=mood+'%';o.classList.toggle('m2',mood>75)};
 const say=(t,k)=>{pop.textContent=t;pop.className='rk-pop on '+(k||'');clearTimeout(pop._t);pop._t=setTimeout(()=>pop.className='rk-pop',380)};
 const spark=(i,gold)=>{const p=pads[i];for(let k=0;k<(gold?12:6);k++){const s=el('i','tk2-sp'+(gold?' g':''));s.style.setProperty('--a',(Math.random()*360)+'deg');s.style.setProperty('--d',(35+Math.random()*55)+'px');p.appendChild(s);setTimeout(()=>s.remove(),600)}};
 const stopAll=()=>{srcs.forEach(s=>{try{s.stop()}catch(e){}});srcs=[]};
 const run=()=>{
  res={hits:0,perfect:0};combo=0;setMood(25);notesEl.innerHTML='';comboEl.textContent='';fin=0;$o('.rk-help').classList.remove('weg');
  const beat=.512,t0=c.currentTime+LEAD+4*beat+.3;hush(true);
  for(let i=0;i<4;i++)samp('schelle',t0-(4-i)*beat,.45);
  const cnt=$o('.tk2-count');['4','3','2','1'].forEach((n,i)=>setTimeout(()=>{cnt.textContent=n;cnt.className='tk2-count on';setTimeout(()=>cnt.className='tk2-count',380)},Math.max(0,(t0-(4-i)*beat-c.currentTime)*1000)));
  // Band und Schlagzeug getrennt starten, Schlagzeug wird bei Fehlern leiser
  dg=c.createGain();dg.gain.value=1;dg.connect(drumOut());const bg=c.createGain();bg.gain.value=.9;bg.connect(drumOut());
  [[band,bg],[drums,dg]].forEach(([b,g])=>{if(!b)return;const s=c.createBufferSource();s.buffer=b;s.connect(g);s.start(t0);srcs.push(s)});
  const notes=CH.map(([t,L],i)=>{const e=el('div','rk-n l'+L);notesEl.appendChild(e);return {t:t0+t,L,e,st:0}});
  let next=0;const end=t0+(band?band.duration:CH[N-1][0]+3);
  const hitLane=(L,ev)=>{if(fin)return;const now=c.currentTime-LAT;
   const p=pads[L];p.classList.remove('hit');void p.offsetWidth;p.classList.add('hit');
   const a=L<2?0:1;armAim(a,L,true);clearTimeout(arms[a]._t);arms[a]._t=setTimeout(()=>armAim(a,a?2.5:.5,false),110);
   let k=-1,bd=9;for(let j=next;j<N&&notes[j].t<now+.3;j++){const n=notes[j];if(n.st||n.L!==L)continue;const d=Math.abs(now-n.t);if(d<bd){bd=d;k=j}}
   if(k<0||bd>.16){samp(L===3?'schelle':L===1?'tr_hoch':'tr_tief',c.currentTime,.3);return}
   const n=notes[k];n.st=1;res.hits++;combo++;dg.gain.setTargetAtTime(1,c.currentTime,.02);if(res.hits===5)$o('.rk-help').classList.add('weg');
   if(bd<=.08){res.perfect++;say('Perfekt!','p');setMood(mood+2.2);spark(L,true)}else{say('Gut!','g');setMood(mood+1.3);spark(L,false)}
   comboEl.textContent=combo>=4?combo+' in Folge':'';comboEl.classList.remove('bump');void comboEl.offsetWidth;comboEl.classList.add('bump');
   if(combo%25===0){sfx('lachen',.35);say(combo+' in Folge!','p')}};
  const tap=e=>{if(e.target.closest('button'))return;e.preventDefault();const r=stg.getBoundingClientRect();const fx=(e.clientX-r.left)/r.width;hitLane(Math.max(0,Math.min(3,Math.floor(fx*4))),e)};
  const kb=e=>{const L='dfjk'.indexOf(e.key.toLowerCase());if(L>=0&&!e.repeat)hitLane(L)};
  o.addEventListener('pointerdown',tap);addEventListener('keydown',kb);
  const loop=()=>{const now=c.currentTime-LAT,W=stg.clientWidth,H=stg.clientHeight;
   for(let j=next;j<N;j++){const n=notes[j];const dt=n.t-now;if(dt>LEAD+.1)break;
    if(!n.st&&dt<-.16){n.st=2;combo=0;comboEl.textContent='';setMood(mood-2.5);dg.gain.setTargetAtTime(.2,c.currentTime,.02);setTimeout(()=>{if(dg)dg.gain.setTargetAtTime(1,c.currentTime,.08)},380)}
    const u=1-dt/LEAD,P=lanePos(n.L,Math.min(1.08,u));n.e.style.transform='translate('+(P.x*W)+'px,'+(P.y*H)+'px) translate(-50%,-50%) scale('+P.s*(n.st===1?1.6:1)+')';n.e.style.opacity=n.st?0:(u<0?0:Math.min(1,u*3))}
   while(next<N&&notes[next].st&&notes[next].t<now-.4)next++;
   if(now>end+.3||(next>=N&&now>CH[N-1][0]+t0+2.5)){o.removeEventListener('pointerdown',tap);removeEventListener('keydown',kb);finish();return}
   raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
  o._cleanup=()=>{o.removeEventListener('pointerdown',tap);removeEventListener('keydown',kb)}};
 async function finish(){if(fin)return;fin=1;cancelAnimationFrame(raf);if(o._cleanup)o._cleanup();
  srcs.forEach(s=>{try{s.stop(c.currentTime+1.2)}catch(e){}});if(dg)dg.gain.setTargetAtTime(0,c.currentTime,.4);hush(false);o.classList.add('ende');
  const q=res.hits/N,stars=q>=.8?3:q>=.55?2:q>=.3?1:0;
  sfx(stars>=2?'fanfare':'sieg',.6);if(stars>=2)setTimeout(()=>sfx('lachen',.4),500);
  const msg=stars===3?'Tosender Applaus! Die Schnecken jubeln, bis ihnen die Fühler wackeln.':stars===2?'Die Schnecken wippen begeistert mit.':stars===1?'Höflicher Applaus. Sehr langsamer Applaus.':'Die Schnecken sind eingeschlafen. Aber freundlich.';
  const card=el('div','tk2-end','<div class="tk2-stars">'+[0,1,2].map(i=>'<img src="'+A+'ui/stern.png" class="'+(i<stars?'on':'')+'" style="animation-delay:'+(i*.25)+'s" alt="">').join('')+'</div><h3>'+res.hits+' von '+N+' Schlägen</h3><p>'+msg+'</p><div class="hero-nav">'+(stars<3?'<button class="pbtn tk2-again">Nochmal</button>':'')+'<button class="pbtn tk2-go">Weiter</button></div>');
  stg.appendChild(card);requestAnimationFrame(()=>card.classList.add('on'));
  const r=await new Promise(rs=>{card.querySelector('.tk2-go').onclick=()=>rs(0);const a=card.querySelector('.tk2-again');if(a)a.onclick=()=>rs(1)});
  sfx('ui_klick',.6);card.remove();o.classList.remove('ende');stopAll();
  if(r){await sleep(300);run();return}
  removeEventListener('resize',placePads);removeEventListener('resize',idle);o.classList.remove('on');await sleep(450);o.remove();done()}
 await sleep(600);run()});
