// Tag 10: Zirpias großer Auftritt. Rhythmusspiel auf der Pilzbühne.
// Noten fliegen von rechts auf die Trommel zu, jeder Treffer spielt die nächste Lautennote der Melodie.
function pluck(t,f,vol){const c=ac(),out=c.createGain(),d=c.createDelay(.05),fb=c.createGain(),lp=c.createBiquadFilter(),n=c.createBufferSource(),ng=c.createGain();
 d.delayTime.value=1/f;fb.gain.value=.965;lp.type='lowpass';lp.frequency.value=f*7;
 n.buffer=noiseBuf();ng.gain.setValueAtTime(vol||.5,t);ng.gain.exponentialRampToValueAtTime(.001,t+.025);
 n.connect(ng);ng.connect(d);d.connect(lp);lp.connect(fb);fb.connect(d);lp.connect(out);
 out.gain.setValueAtTime(.9,t);out.gain.exponentialRampToValueAtTime(.001,t+1.4);out.connect(drumOut());n.start(t);n.stop(t+.03);
 setTimeout(()=>{try{fb.disconnect();out.disconnect()}catch(e){}},1700+Math.max(0,(t-c.currentTime)*1000))}

GAMES.takt=()=>new Promise(async done=>{hideBox();
 const BPM=100,IV=60/BPM,LEAD=1.6;
 // Notenplan in Schlägen mit Seite: 0 links, 1 rechts. Erst im Wechsel, dann mit Pausen und Doppeln, am Ende schneller
 const CH=[[0,0],[1,1],[2,0],[3,1],[4,0],[5,1],[6,0],[8,1],[9,0],[10,1],[11,0],[12,0],[13,1],[14,1],
  [16,0],[17,1],[18,0],[18.5,0],[20,1],[21,0],[22,1],[22.5,1],[24,0],[25,1],[26,0],[26.5,1],[27,0],[28,1],[29,0],[30,1],
  [32,0],[32.5,1],[33,0],[34,1],[34.5,0],[35,1],[36,0],[36.5,0],[37,1],[38,0],[39,1],[40,1],[40.5,0],[41,1],[41.5,0],[42,1],[43,0],[44,1],[45,0],[46,1]];
 const C4=261.6,D4=293.7,E4=329.6,G4=392,A4=440,C5=523.3,D5=587.3,E5=659.3;
 const MEL=[E4,G4,A4,G4,E4,D4,C4,D4,E4,G4,A4,C5,A4,G4,
  E4,G4,A4,C5,D5,C5,A4,G4,A4,C5,D5,E5,D5,C5,A4,G4,
  C5,D5,E5,D5,C5,A4,G4,A4,C5,D5,E5,E5,D5,C5,A4,G4,A4,G4,E4,C5];
 const N=CH.length;const FR=[A+'ui/zi_koerper.png',A+'ui/zi_bein.png',A+'ui/zi_jubel.png'];FR.forEach(u=>{const i=new Image();i.src=u});
 const o=el('div','tk2');o.innerHTML='<div class="tk2-bg"></div><div class="tk2-st"><div class="tk2-top"><div class="tk2-t">Zirpias großer Auftritt</div><div class="tk2-meter"><i></i><b>Begeisterung</b></div></div>'+
  '<div class="tk2-zi"><div class="tk2-rig"><div class="tk2-leg l"><img src="'+A+'ui/zi_bein.png" alt=""></div><div class="tk2-leg r"><img src="'+A+'ui/zi_bein.png" alt=""></div><img class="tk2-body" src="'+A+'ui/zi_koerper.png" alt=""></div><img class="tk2-jub" src="'+FR[2]+'" alt=""></div><div class="tk2-snails"></div>'+
  '<div class="tk2-lanes"><div class="tk2-ln l"><div class="tk2-rail"></div><div class="tk2-hit"><img src="'+A+'ui/trommel.png" alt=""></div></div><div class="tk2-ln r"><div class="tk2-rail"></div><div class="tk2-hit"><img src="'+A+'ui/trommel.png" alt=""></div></div><div class="tk2-notes"></div></div>'+
  '<div class="tk2-combo"></div><div class="tk2-pop l"></div><div class="tk2-pop r"></div><div class="tk2-help">Linke Note: links tippen. Rechte Note: rechts tippen. Am besten mit beiden Daumen.</div><div class="tk2-count"></div></div>';
 document.body.appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));
 const $o=s=>o.querySelector(s),notesEl=$o('.tk2-notes'),hits=[...o.querySelectorAll('.tk2-hit')],pops=[$o('.tk2-pop.l'),$o('.tk2-pop.r')],comboEl=$o('.tk2-combo'),meter=$o('.tk2-meter i'),zi=$o('.tk2-zi'),lanes=$o('.tk2-lanes'),stg=$o('.tk2-st');
 const SN=[[4,0,1],[22,5,.9],[40,1,1.05],[60,6,.92],[80,0,1]];const snails=SN.map(([x,y,s],i)=>{const e=el('img','tk2-sn');e.src=A+'ui/schnecke.png';e.style.left=x+'%';e.style.bottom=(2+y)+'%';e.style.setProperty('--s',s*(i%2?-1:1));e.style.animationDelay=(i*.13)+'s';$o('.tk2-snails').appendChild(e);return e});
 if(TEST){const tb=el('button','pbn-test','Test: fertig');tb.style.cssText='position:absolute;right:8px;top:70px;z-index:9';tb.onclick=()=>{res.hits=N;res.perfect=N;finish()};stg.appendChild(tb)}
 const c=ac();const LAT=(c.outputLatency||c.baseLatency||0);
 let res={hits:0,perfect:0},combo=0,mood=20,fin=0,raf=0,jubel=0;
 const say=(L,t,k)=>{const p=pops[L];p.textContent=t;p.className='tk2-pop '+(L?'r':'l')+' on '+(k||'');clearTimeout(p._t);p._t=setTimeout(()=>p.className='tk2-pop '+(L?'r':'l'),380)};
 const setMood=v=>{mood=Math.max(0,Math.min(100,v));meter.style.width=mood+'%';o.classList.toggle('m1',mood>40);o.classList.toggle('m2',mood>75)};
 const spark=(L,gold)=>{for(let i=0;i<(gold?10:5);i++){const s=el('i','tk2-sp'+(gold?' g':''));s.style.setProperty('--a',(Math.random()*360)+'deg');s.style.setProperty('--d',(30+Math.random()*50)+'px');hits[L].appendChild(s);setTimeout(()=>s.remove(),600)}};
 const run=async()=>{
  res={hits:0,perfect:0};combo=0;setMood(20);notesEl.innerHTML='';comboEl.textContent='';fin=0;$o('.tk2-help').classList.remove('weg');
  const t0=c.currentTime+4*IV+.3;hush(true);
  for(let i=0;i<4;i++)hat(t0-(4-i)*IV,.35);
  const cnt=$o('.tk2-count');['4','3','2','1'].forEach((n,i)=>setTimeout(()=>{cnt.textContent=n;cnt.className='tk2-count on';setTimeout(()=>cnt.className='tk2-count',IV*800)},Math.max(0,(t0-(4-i)*IV-c.currentTime)*1000)));
  beatLoop(t0,48,IV);
  const notes=CH.map(([b,L],i)=>{const e=el('img','tk2-n');e.src=A+'ui/p_note_'+L+'.png';notesEl.appendChild(e);return {t:t0+b*IV,L,i,e,st:0}});
  let next=0;
  const tap=e=>{if(fin||e.target.closest('button'))return;e.preventDefault();const now=c.currentTime-LAT;
   const r=stg.getBoundingClientRect(),L=e.clientX<r.left+r.width/2?0:1,h=hits[L];
   h.classList.remove('hit');void h.offsetWidth;h.classList.add('hit');
   let k=-1,bd=9;for(let j=next;j<N&&notes[j].t<now+.3;j++){const n=notes[j];if(n.st||n.L!==L)continue;const d=Math.abs(now-n.t);if(d<bd){bd=d;k=j}}
   if(k<0||bd>.17){(L?snare:kick)(c.currentTime);say(L,'Zu früh','d');return}
   const n=notes[k];n.st=1;n.e.classList.add('hit');pluck(c.currentTime,MEL[k%MEL.length],.55);(L?snare:kick)(c.currentTime);
   res.hits++;combo++;if(res.hits===4)$o('.tk2-help').classList.add('weg');
   if(bd<=.085){res.perfect++;say(L,'Perfekt!','p');setMood(mood+4.5);spark(L,true)}else{say(L,'Gut!','g');setMood(mood+2.5);spark(L,false)}
   comboEl.textContent=combo>=3?combo+' in Folge':'';comboEl.classList.remove('bump');void comboEl.offsetWidth;comboEl.classList.add('bump');
   if(combo===10||combo===20||combo===30){jubel=performance.now()+1000;zi.classList.add('jub');setTimeout(()=>{if(!fin)zi.classList.remove('jub')},1000);sfx('lachen',.35);snails.forEach(s=>s.classList.add('cheer'));setTimeout(()=>snails.forEach(s=>s.classList.remove('cheer')),1200)}};
  o.addEventListener('pointerdown',tap);
  let lastBeat=-9;
  const loop=()=>{const now=c.currentTime-LAT;const lr=lanes.getBoundingClientRect();
   for(let j=next;j<N;j++){const n=notes[j];const dt=n.t-now;if(dt>LEAD+.2)break;
    if(!n.st&&dt<-.17){n.st=2;n.e.classList.add('miss');combo=0;comboEl.textContent='';setMood(mood-3.5)}
    const h=hits[n.L],hy=h.offsetTop+h.offsetHeight/2,hx=h.parentElement.offsetLeft+h.parentElement.offsetWidth/2;
    const y=hy-(hy+30)*(dt/LEAD);n.e.style.transform='translate('+(hx-26)+'px,'+(y-26)+'px) scale('+(n.st===1?1.7:1)+')';n.e.style.opacity=n.st===1?0:(dt>LEAD?0:1)}
   while(next<N&&notes[next].st&&notes[next].t<now-.4)next++;
   // Zirpia stampft im Wechsel auf jeden Schlag
   const bt=Math.floor((now-t0)/IV),ph=((now-t0)/IV)%1;
   if(now>t0-4*IV&&now<t0+48*IV){if(bt!==lastBeat){lastBeat=bt;zi.classList.toggle('b1',bt%2!==0);zi.classList.remove('stomp');void zi.offsetWidth;zi.classList.add('stomp');o.classList.remove('beat');void o.offsetWidth;o.classList.add('beat')}}
   if(now>t0+CH[N-1][0]*IV+1.2){o.removeEventListener('pointerdown',tap);finish();return}
   raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop)};
 async function finish(){if(fin)return;fin=1;cancelAnimationFrame(raf);hush(false);o.classList.add('ende');
  const q=res.hits/N,stars=q>=.85?3:q>=.6?2:q>=.3?1:0;zi.classList.add('jub');
  sfx(stars>=2?'fanfare':'sieg',.6);if(stars>=2)setTimeout(()=>sfx('lachen',.4),500);snails.forEach(s=>s.classList.add('cheer'));
  const msg=stars===3?'Tosender Applaus! Die Schnecken jubeln, bis ihnen die Fühler wackeln.':stars===2?'Die Schnecken wippen begeistert mit.':stars===1?'Höflicher Applaus. Sehr langsamer Applaus.':'Die Schnecken sind eingeschlafen. Aber freundlich.';
  const card=el('div','tk2-end','<div class="tk2-stars">'+[0,1,2].map(i=>'<img src="'+A+'ui/stern.png" class="'+(i<stars?'on':'')+'" style="animation-delay:'+(i*.25)+'s" alt="">').join('')+'</div><h3>'+res.hits+' von '+N+' Noten</h3><p>'+msg+'</p><div class="hero-nav">'+(stars<3?'<button class="pbtn tk2-again">Nochmal</button>':'')+'<button class="pbtn tk2-go">Weiter</button></div>');
  stg.appendChild(card);requestAnimationFrame(()=>card.classList.add('on'));
  const r=await new Promise(rs=>{card.querySelector('.tk2-go').onclick=()=>rs(0);const a=card.querySelector('.tk2-again');if(a)a.onclick=()=>rs(1)});
  sfx('ui_klick',.6);card.remove();o.classList.remove('ende');snails.forEach(s=>s.classList.remove('cheer'));zi.classList.remove('jub');
  if(r){await sleep(300);run();return}
  o.classList.remove('on');await sleep(450);o.remove();done()}
 await sleep(900);run()});
