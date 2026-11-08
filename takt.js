// Tag 10: Zirpias großer Auftritt. Rhythmusspiel auf der Pilzbühne.
// Noten fliegen von rechts auf die Trommel zu, jeder Treffer spielt die nächste Lautennote der Melodie.
function pluck(t,f,vol){const c=ac(),out=c.createGain(),d=c.createDelay(.05),fb=c.createGain(),lp=c.createBiquadFilter(),n=c.createBufferSource(),ng=c.createGain();
 d.delayTime.value=1/f;fb.gain.value=.965;lp.type='lowpass';lp.frequency.value=f*7;
 n.buffer=noiseBuf();ng.gain.setValueAtTime(vol||.5,t);ng.gain.exponentialRampToValueAtTime(.001,t+.025);
 n.connect(ng);ng.connect(d);d.connect(lp);lp.connect(fb);fb.connect(d);lp.connect(out);
 out.gain.setValueAtTime(.9,t);out.gain.exponentialRampToValueAtTime(.001,t+1.4);out.connect(drumOut());n.start(t);n.stop(t+.03);
 setTimeout(()=>{try{fb.disconnect();out.disconnect()}catch(e){}},1700+Math.max(0,(t-c.currentTime)*1000))}

GAMES.takt=()=>new Promise(async done=>{hideBox();
 const BPM=100,IV=60/BPM,LEAD=1.7;
 // Notenplan in Schlägen: ruhig, dann mit Pausen und Doppelschlägen, am Ende schneller
 const CH=[0,1,2,3,4,5,6,8,9,10,11,12,13,14,
  16,17,18,18.5,20,21,22,22.5,24,25,26,26.5,27,28,29,30,
  32,32.5,33,34,34.5,35,36,36.5,37,38,39,40,40.5,41,41.5,42,43,44,45,46];
 const C4=261.6,D4=293.7,E4=329.6,G4=392,A4=440,C5=523.3,D5=587.3,E5=659.3;
 const MEL=[E4,G4,A4,G4,E4,D4,C4,D4,E4,G4,A4,C5,A4,G4,
  E4,G4,A4,C5,D5,C5,A4,G4,A4,C5,D5,E5,D5,C5,A4,G4,
  C5,D5,E5,D5,C5,A4,G4,A4,C5,D5,E5,E5,D5,C5,A4,G4,A4,G4,E4,C5];
 const N=CH.length;
 const o=el('div','tk2');o.innerHTML='<div class="tk2-bg"></div><div class="tk2-st"><div class="tk2-top"><div class="tk2-t">Zirpias großer Auftritt</div><div class="tk2-meter"><i></i><b>Begeisterung</b></div></div>'+
  '<img class="tk2-zi" src="'+A+'ui/zi_spiel.png" alt=""><div class="tk2-lane"><div class="tk2-glow"></div><div class="tk2-hit"><img src="'+A+'ui/trommel.png" alt=""></div><div class="tk2-notes"></div></div>'+
  '<div class="tk2-combo"></div><div class="tk2-pop"></div><div class="tk2-snails"></div><div class="tk2-help">Tippe irgendwo hin, wenn eine Note die Trommel erreicht.</div><div class="tk2-count"></div></div>';
 document.body.appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));
 const $o=s=>o.querySelector(s),notesEl=$o('.tk2-notes'),hitEl=$o('.tk2-hit'),pop=$o('.tk2-pop'),comboEl=$o('.tk2-combo'),meter=$o('.tk2-meter i'),zi=$o('.tk2-zi'),lane=$o('.tk2-lane');
 // Schnecken im Publikum
 const SN=[[8,0,1],[24,6,.9],[42,2,1.05],[60,7,.92],[78,1,1]];const snails=SN.map(([x,y,s],i)=>{const e=el('img','tk2-sn');e.src=A+'ui/schnecke.png';e.style.left=x+'%';e.style.bottom=(4+y)+'%';e.style.setProperty('--s',s*(i%2?-1:1));e.style.animationDelay=(i*.13)+'s';$o('.tk2-snails').appendChild(e);return e});
 if(TEST){const tb=el('button','pbn-test','Test: fertig');tb.style.cssText='position:absolute;right:8px;top:70px;z-index:9';tb.onclick=()=>{res.hits=N;res.perfect=N;finish()};$o('.tk2-st').appendChild(tb)}
 const c=ac();const LAT=(c.outputLatency||c.baseLatency||0);
 let res={hits:0,perfect:0},combo=0,best=0,mood=20,fin=0,raf=0;
 const say=(t,k)=>{pop.textContent=t;pop.className='tk2-pop on '+(k||'');clearTimeout(pop._t);pop._t=setTimeout(()=>pop.className='tk2-pop',380)};
 const setMood=v=>{mood=Math.max(0,Math.min(100,v));meter.style.width=mood+'%';o.classList.toggle('m1',mood>40);o.classList.toggle('m2',mood>75)};setMood(20);
 const run=async()=>{
  res={hits:0,perfect:0};combo=0;best=0;setMood(20);$o('.tk2-help').classList.remove('weg');notesEl.innerHTML='';comboEl.textContent='';fin=0;
  const t0=c.currentTime+4*IV+.3;hush(true);
  // Einzählen mit Hi Hats
  for(let i=0;i<4;i++)hat(t0-(4-i)*IV,.35);
  const cnt=$o('.tk2-count');['4','3','2','1'].forEach((n,i)=>setTimeout(()=>{cnt.textContent=n;cnt.className='tk2-count on';setTimeout(()=>cnt.className='tk2-count',IV*800)},Math.max(0,(t0-(4-i)*IV-c.currentTime)*1000)));
  beatLoop(t0,48,IV);
  const notes=CH.map((b,i)=>{const e=el('img','tk2-n');e.src=A+'ui/p_note_'+(i%2)+'.png';notesEl.appendChild(e);return {t:t0+b*IV,i,e,st:0}});
  let next=0;
  const tap=e=>{if(fin||e.target.closest('button'))return;e.preventDefault();const now=c.currentTime-LAT;
   hitEl.classList.remove('hit');void hitEl.offsetWidth;hitEl.classList.add('hit');
   let k=-1,bd=9;for(let j=next;j<N&&notes[j].t<now+.3;j++){if(notes[j].st)continue;const d=Math.abs(now-notes[j].t);if(d<bd){bd=d;k=j}}
   if(k<0||bd>.17){snare(c.currentTime);say('Zu früh','d');return}
   const n=notes[k];n.st=1;n.e.classList.add('hit');pluck(c.currentTime,MEL[k%MEL.length],.55);if(n.i%2===0)kick(c.currentTime);
   res.hits++;combo++;best=Math.max(best,combo);if(res.hits===4)$o('.tk2-help').classList.add('weg');
   if(bd<=.085){res.perfect++;say('Perfekt!','p');setMood(mood+4.5);spark(true)}else{say('Gut!','g');setMood(mood+2.5);spark(false)}
   comboEl.textContent=combo>=3?combo+' in Folge':'';comboEl.classList.remove('bump');void comboEl.offsetWidth;comboEl.classList.add('bump');
   if(combo===10||combo===20||combo===30){zi.src=A+'ui/zi_jubel.png';setTimeout(()=>zi.src=A+'ui/zi_spiel.png',900);sfx('lachen',.35);snails.forEach(s=>s.classList.add('cheer'));setTimeout(()=>snails.forEach(s=>s.classList.remove('cheer')),1200);say(combo+' in Folge!','p')}};
  o.addEventListener('pointerdown',tap);
  const spark=gold=>{for(let i=0;i<(gold?10:5);i++){const s=el('i','tk2-sp'+(gold?' g':''));s.style.setProperty('--a',(Math.random()*360)+'deg');s.style.setProperty('--d',(30+Math.random()*50)+'px');hitEl.appendChild(s);setTimeout(()=>s.remove(),600)}};
  const loop=()=>{const now=c.currentTime-LAT;const W=lane.clientWidth,hx=hitEl.offsetLeft+hitEl.offsetWidth/2;
   for(let j=next;j<N;j++){const n=notes[j];const dt=n.t-now;if(dt>LEAD+.2)break;
    if(!n.st&&dt<-.17){n.st=2;n.e.classList.add('miss');if(combo>=5)say('Verpasst','d');combo=0;comboEl.textContent='';setMood(mood-3.5)}
    const x=hx+(W-hx+40)*(dt/LEAD);n.e.style.transform='translate('+(x-24)+'px,-50%) scale('+(n.st===1?1.6:1)+')';n.e.style.opacity=n.st===1?0:(dt>LEAD?0:1)}
   while(next<N&&notes[next].st&&notes[next].t<now-.4)next++;
   const ph=((now-t0)/IV)%1,b=Math.max(0,1-ph*3);if(now>t0-4*IV&&now<t0+48*IV){zi.style.transform='translateX(-50%) translateY('+(-b*7)+'px) rotate('+((Math.floor((now-t0)/IV)%2?1:-1)*b*3)+'deg)';$o('.tk2-glow').style.opacity=.25+b*.6}
   if(now>t0+CH[N-1]*IV+1.2){o.removeEventListener('pointerdown',tap);finish();return}
   raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop)};
 async function finish(){if(fin)return;fin=1;cancelAnimationFrame(raf);hush(false);o.classList.add('ende');
  const q=res.hits/N,stars=q>=.85?3:q>=.6?2:q>=.3?1:0;zi.src=A+'ui/zi_jubel.png';
  sfx(stars>=2?'fanfare':'sieg',.6);if(stars>=2)setTimeout(()=>sfx('lachen',.4),500);snails.forEach(s=>s.classList.add('cheer'));
  const msg=stars===3?'Tosender Applaus! Die Schnecken jubeln, bis ihnen die Fühler wackeln.':stars===2?'Die Schnecken wippen begeistert mit.':stars===1?'Höflicher Applaus. Sehr langsamer Applaus.':'Die Schnecken sind eingeschlafen. Aber freundlich.';
  const card=el('div','tk2-end','<div class="tk2-stars">'+[0,1,2].map(i=>'<img src="'+A+'ui/stern.png" class="'+(i<stars?'on':'')+'" style="animation-delay:'+(i*.25)+'s" alt="">').join('')+'</div><h3>'+res.hits+' von '+N+' Noten</h3><p>'+msg+'</p><div class="hero-nav">'+(stars<3?'<button class="pbtn tk2-again">Nochmal</button>':'')+'<button class="pbtn tk2-go">Weiter</button></div>');
  $o('.tk2-st').appendChild(card);requestAnimationFrame(()=>card.classList.add('on'));
  const r=await new Promise(rs=>{card.querySelector('.tk2-go').onclick=()=>rs(0);const a=card.querySelector('.tk2-again');if(a)a.onclick=()=>rs(1)});
  sfx('ui_klick',.6);card.remove();o.classList.remove('ende');snails.forEach(s=>s.classList.remove('cheer'));zi.src=A+'ui/zi_spiel.png';
  if(r){await sleep(300);run();return}
  o.classList.remove('on');await sleep(450);o.remove();done()}
 await sleep(900);run()});
