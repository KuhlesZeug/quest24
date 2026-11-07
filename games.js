// Minispiele. Alle Grafiken gemalt (a/ui), Lichtstrahlen und Bewegung im Code.
const GAMES={};
function gameShell(title,help){const o=$('#card');o.innerHTML='<div class="c-card game"><div class="cc-k">Minispiel</div><h3>'+title+'</h3><p class="g-help">'+help+'</p><div class="g-area"></div><div class="g-foot"></div></div>';o.classList.add('on');return o.querySelector('.g-area')}
function gameEnd(){$('#card').classList.remove('on')}

// Tag 4: Licht in den Stollen. Spiegel drehen, bis das Licht in die Kammer fällt.
GAMES.spiegel=()=>new Promise(done=>{
 const W=5,H=5,area=gameShell('Licht in den Stollen','Tippe auf die Spiegel, um sie zu drehen. Das Licht der Laterne muss bis in die Kammer unten rechts fallen.');
 const M={'3,0':'/','3,2':'\\','1,2':'\\','1,4':'/'};const SOL={'3,0':'\\','3,2':'/','1,2':'/','1,4':'\\'};
 area.innerHTML='<div class="sp-grid" style="--w:'+W+';--h:'+H+'"><canvas class="sp-beam"></canvas></div>';const g=area.querySelector('.sp-grid');
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const k=x+','+y;const c=el('div','sp-c');c.style.gridColumn=x+1;c.style.gridRow=y+1;
  if(x===0&&y===0)c.innerHTML='<img src="'+A+'ui/laterne.png" alt="">';
  else if(x===W-1&&y===H-1)c.innerHTML='<img class="sp-goal" src="'+A+'ui/kammer.png" alt="">';
  else if(M[k]){c.classList.add('mir');c.innerHTML='<img src="'+A+'ui/spiegel.png" alt="">';c.onclick=()=>{M[k]=M[k]==='/'?'\\':'/';sfx('stein',.5);draw()}}
  g.appendChild(c)}
 const cv=g.querySelector('canvas');
 const easy=el('button','lnk','Leichter machen');area.parentElement.querySelector('.g-foot').appendChild(easy);easy.onclick=()=>{let n=0;for(const k in SOL)if(M[k]!==SOL[k]&&n<2){M[k]=SOL[k];n++}easy.remove();draw()};
 function draw(){g.querySelectorAll('.mir').forEach(c=>{const k=(+c.style.gridColumn-1)+','+(+c.style.gridRow-1);c.querySelector('img').style.transform=M[k]==='/'?'rotate(0deg)':'scaleX(-1)'});
  const r=g.getBoundingClientRect();cv.width=r.width*2;cv.height=r.height*2;const cx=cv.getContext('2d');const cw=cv.width/W,ch=cv.height/H;
  let x=0,y=0,dx=1,dy=0;const pts=[[.5,.5]];let hit=false;
  for(let i=0;i<40;i++){x+=dx;y+=dy;if(x<0||y<0||x>=W||y>=H){pts.push([x+.5-dx*.5,y+.5-dy*.5]);break}pts.push([x+.5,y+.5]);
   const m=M[x+','+y];if(m==='/'){[dx,dy]=[-dy,-dx]}else if(m==='\\'){[dx,dy]=[dy,dx]}if(x===W-1&&y===H-1){hit=true;break}}
  cx.lineCap='round';[[18,'rgba(255,200,80,.25)'],[8,'rgba(255,220,120,.7)'],[3,'#fff6c8']].forEach(([w,c])=>{cx.strokeStyle=c;cx.lineWidth=w;cx.beginPath();pts.forEach((p,i)=>i?cx.lineTo(p[0]*cw,p[1]*ch):cx.moveTo(p[0]*cw,p[1]*ch));cx.stroke()});
  if(hit&&!g._won){g._won=1;g.classList.add('won');sfx('richtig');setTimeout(()=>{gameEnd();done()},1400)}}
 setTimeout(draw,60)});

// Lieder von Zirpia (Suno), laufen über der Musik
let songEl=null;
function playSong(name,vol,max,onStart){stopSong();if(!st.sound)return Promise.resolve();ac();const me={stop:null,done:null};songEl=me;hush(true);
 return new Promise(r=>{let t=null,fin=false;const end=()=>{if(fin)return;fin=true;clearTimeout(t);clearTimeout(me._w);if(songEl===me){songEl=null;hush(false)}r()};me.done=end;
  loadVo(A+'songs/'+name+'.mp3').then(b=>{if(songEl!==me||fin)return end();if(!b)return end();const s=AC.createBufferSource();s.buffer=b;const g=AC.createGain();g.gain.value=vol??.9;s.connect(g);g.connect(voOut());s.onended=end;s.start();if(onStart)onStart();
   me.stop=()=>{try{g.gain.setTargetAtTime(0,AC.currentTime,.05);s.stop(AC.currentTime+.2)}catch(e){}end()};
   me._w=setTimeout(end,(b.duration+1.5)*1000);
   if(max)t=setTimeout(()=>{g.gain.setTargetAtTime(0,AC.currentTime,.5);setTimeout(()=>{try{s.stop()}catch(e){}end()},2200)},max*1000)})})}
function stopSong(){if(songEl){const m=songEl;songEl=null;if(m.stop)m.stop();else if(m.done)m.done();hush(false)}}
function ballade(){if(!st.flags.ballade){st.flags.ballade=['zirpia_02','zirpia_03','zirpia_04','zirpia_05'][Math.floor(Math.random()*4)];save()}return st.flags.ballade}

// Tag 8: Lichtfolge merken. Drei Runden mit 4, 6 und 8 Lichtern.
GAMES.irrlicht=()=>new Promise(done=>{
 const area=gameShell('Lichtfolge merken','Schau genau hin, welche Irrlichter nacheinander leuchten. Dann tippe sie in derselben Reihenfolge an.');
 const N=5,TONES=[392,440,523,587,659];area.innerHTML='<div class="ir-wrap"><div class="ir-st">Runde 1 von 3</div><div class="ir-row"></div></div>';
 const row=area.querySelector('.ir-row');const L=[];for(let i=0;i<N;i++){const b=el('button','ir','<img src="'+A+'ui/irrlicht_'+(i+1)+'.png" alt="">');row.appendChild(b);L.push(b)}
 const flash=async(i,ms)=>{L[i].classList.add('on');tone(TONES[i],ms/1000*.9);await sleep(ms);L[i].classList.remove('on');await sleep(ms*.35)};
 let round=0,fails=0,slow=1;const lens=[4,6,8];let seq=[];
 const play=async()=>{area.querySelector('.ir-st').textContent='Runde '+(round+1)+' von 3';row.classList.add('busy');await sleep(700);for(const i of seq)await flash(i,520*slow);row.classList.remove('busy');pos=0};
 let pos=0;L.forEach((b,i)=>b.onclick=async()=>{if(row.classList.contains('busy'))return;await flash(i,260);
  if(seq[pos]!==i){sfx('falsch',.6);fails++;if(fails>=2&&slow===1){slow=1.6;toast('Ich spiele sie jetzt langsamer.')}return play()}
  pos++;if(pos===seq.length){sfx('richtig',.7);round++;fails=0;if(round>=3){gameEnd();return done()}seq=mk(lens[round]);await sleep(600);play()}});
 const mk=n=>Array.from({length:n},()=>Math.floor(Math.random()*N));seq=mk(4);setTimeout(play,500)});
function tone(f,d){const c=ac(),o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=f;const t=c.currentTime;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.18,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(sfxBus);o.start(t);o.stop(t+d+.05)}

// Tag 10: Im Takt bleiben. Kein Scheitern möglich, je besser, desto mehr Applaus.
// Kleiner Schlagzeug Synthesizer für das Taktspiel
const DRUM={noise:null};
function drumOut(){const c=ac();return sfxBus||master||c.destination}
function kick(t){const c=ac(),o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+.18);g.gain.setValueAtTime(.9,t);g.gain.exponentialRampToValueAtTime(.001,t+.32);o.connect(g);g.connect(drumOut());o.start(t);o.stop(t+.35)}
function noiseBuf(){const c=ac();if(!DRUM.noise){const b=c.createBuffer(1,c.sampleRate*.5,c.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;DRUM.noise=b}return DRUM.noise}
function hit(t,f,dur,vol,type){const c=ac(),n=c.createBufferSource();n.buffer=noiseBuf();const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;const g=c.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);n.connect(fl);fl.connect(g);g.connect(drumOut());n.start(t);n.stop(t+dur+.02)}
function snare(t){hit(t,1800,.18,.5,'bandpass');const c=ac(),o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=190;g.gain.setValueAtTime(.25,t);g.gain.exponentialRampToValueAtTime(.001,t+.1);o.connect(g);g.connect(drumOut());o.start(t);o.stop(t+.12)}
function hat(t,v){hit(t,8000,.05,v||.18,'highpass')}
function bass(t,f,d){const c=ac(),o=c.createOscillator(),fl=c.createBiquadFilter(),g=c.createGain();o.type='sawtooth';o.frequency.value=f;fl.type='lowpass';fl.frequency.value=500;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.22,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(fl);fl.connect(g);g.connect(drumOut());o.start(t);o.stop(t+d+.05)}
// spielt ab Audiozeit t0 n Schläge im Abstand iv (Sekunden); Kick auf jedem Schlag, Snare auf 2 und 4, Hi Hat dazwischen, Basslinie
function beatLoop(t0,n,iv){const B=[55,55,65.4,49];for(let i=-4;i<n;i++){const t=t0+i*iv;if(t<ac().currentTime)continue;if(i<0){hat(t,.3);continue}kick(t);if(i%2===1)snare(t);hat(t+iv/2);hat(t+iv*.75,.08);bass(t,B[Math.floor(i/4)%4],iv*.9)}}
GAMES.takt=()=>new Promise(async done=>{
 const area=gameShell('Im Takt bleiben','Ein Ring fliegt von außen auf die Trommel zu. Tippe genau dann auf die Trommel, wenn er den weißen Rand erreicht. Die Trommel leuchtet dann auf und der Beat schlägt.');
 area.innerHTML='<div class="tk-wrap"><div class="tk-rings"></div><div class="tk-target"></div><button class="tk-drum"><img src="'+A+'ui/trommel.png" alt=""></button><div class="tk-pop"></div></div><div class="tk-score">Gleich geht es los</div>';
 const drum=area.querySelector('.tk-drum'),rings=area.querySelector('.tk-rings'),tgt=area.querySelector('.tk-target'),pop=area.querySelector('.tk-pop'),sc=area.querySelector('.tk-score');
 const beats=16,iv=700,lead=1400;let hits=0,perfect=0;const times=[];const used=new Set();
 const say=(t,c)=>{pop.textContent=t;pop.className='tk-pop on '+(c||'');clearTimeout(pop._t);pop._t=setTimeout(()=>pop.className='tk-pop',450)};
 drum.onclick=()=>{drum.classList.remove('hit');void drum.offsetWidth;drum.classList.add('hit');tone(196,.08);
  const now=performance.now();let best=-1,bd=1e9;times.forEach((t,i)=>{const d=Math.abs(now-t);if(d<bd&&!used.has(i)){bd=d;best=i}});
  if(best>=0&&bd<110){used.add(best);hits++;perfect++;say('Perfekt!','p');sfx('treffer',.3)}else if(best>=0&&bd<200){used.add(best);hits++;say('Gut!','g');sfx('treffer',.2)}else say('Daneben','d');
  sc.textContent=hits+' von '+beats+' Treffern'};
 // Einzählen
 const c=ac();const at0=c.currentTime+3*iv/1000+lead/1000;beatLoop(at0,beats,iv/1000);hush(true);
 for(const n of ['3','2','1']){say(n,'c');await sleep(iv)}
 const t0=performance.now()+lead;for(let i=0;i<beats;i++)times.push(t0+i*iv);
 times.forEach((t,i)=>{setTimeout(()=>{const r=el('i','tk-ring');r.style.animationDuration=lead+'ms';r.style.setProperty('--h',(i*47)%360);rings.appendChild(r);setTimeout(()=>r.remove(),lead+120)},t-lead-performance.now());
  setTimeout(()=>{tgt.classList.remove('beat');void tgt.offsetWidth;tgt.classList.add('beat')},t-performance.now())});
 await sleep(t0+beats*iv-performance.now()+600);
 drum.onclick=null;hush(false);gameEnd();toast(hits>12?'Tosender Applaus!':hits>6?'Die Schnecken wippen begeistert.':'Höflicher Applaus. Sehr langsamer Applaus.');sfx('sieg',.6);done()});

// Tag 11: Steinpfad im Nebelsumpf. Raster wie auf dem Druckblatt, oben Norden, unten Ufer.
GAMES.sumpf=()=>new Promise(done=>{
 const G=[[2,10,7,4,8],[3,9,8,7,7],[8,7,5,6,3],[3,1,4,10,8],[3,2,3,8,6],[3,1,9,3,1]];
 const area=gameShell('Der Steinpfad','Beginne am Ufer (unten) auf einer Eins. Tritt immer auf den Nachbarstein, der um eins höher ist, nie schräg. Ziel ist die Zehn am Nordrand.');
 area.innerHTML='<div class="sm-grid"></div><div class="g-row"><button class="lnk sm-reset">Von vorn</button></div>';const g=area.querySelector('.sm-grid');let path=[];
 const draw=()=>{g.innerHTML='';G.forEach((r,y)=>r.forEach((v,x)=>{const b=el('button','sm-s'+(path.some(p=>p[0]===x&&p[1]===y)?' on':''),'<img src="'+A+'ui/stein.png" alt=""><b>'+v+'</b>');b.onclick=()=>step(x,y);g.appendChild(b)}))};
 const fall=async()=>{sfx('platsch');path=[];draw();$('#card').classList.remove('on');await say('GR','Es ist nass. Aber Herbert ist trocken. Ich hab ihn hochgehalten.',A+'vo/d11_sumpf.mp3');$('#card').classList.add('on')};
 const step=async(x,y)=>{const v=G[y][x];if(!path.length){if(y!==5||v!==1)return fall();path.push([x,y]);sfx('stein',.5);return draw()}
  const [px,py]=path[path.length-1];if(Math.abs(px-x)+Math.abs(py-y)!==1||v!==G[py][px]+1)return fall();path.push([x,y]);sfx('stein',.5);draw();
  if(v===10&&y===0){sfx('richtig');await sleep(700);gameEnd();done()}};
 area.querySelector('.sm-reset').onclick=()=>{path=[];draw()};draw()});

// Tag 12: Trank brauen. Zutaten in der richtigen Reihenfolge in den Kessel.
GAMES.trank=()=>new Promise(done=>{
 const Z=[['schleim','Schneckenschleim'],['feder','Eulenfeder'],['frost','Frostbeere'],['glut','Glutpilz']];const SOL=['schleim','feder','frost','glut'];
 const area=gameShell('Trank brauen','Holundas Reim:<br><i>Der Glutpilz kommt direkt nach der Frostbeere.<br>Die Eulenfeder kommt nicht zuerst und nicht zuletzt.<br>Der Schneckenschleim kommt irgendwann vor der Frostbeere.</i>');
 area.innerHTML='<div class="tr-kessel"><img src="'+A+'ui/kessel.png" alt=""><div class="tr-in"></div></div><div class="tr-row"></div><div class="hints tr-h"></div>';
 const row=area.querySelector('.tr-row'),inn=area.querySelector('.tr-in');let got=[];
 const tips=['Frostbeere und Glutpilz gehören zusammen. Wo im Kessel kann dieses Paar stehen?','Vor der Frostbeere muss noch Platz für den Schneckenschleim sein.','Frostbeere und Glutpilz kommen ganz zum Schluss: Schneckenschleim, Eulenfeder, Frostbeere, Glutpilz.'];let nt=0;
 const hb=area.querySelector('.tr-h');const drawH=()=>{hb.innerHTML=tips.map((t,i)=>'<button class="hint'+(i<nt?' open':'')+'"><span>'+(i===2?'Lösung':'Tipp '+(i+1))+'</span>'+(i<nt?t:i===nt?'Antippen zum Aufdecken':'')+'</button>').join('');[...hb.children].forEach((b,i)=>b.onclick=()=>{if(i===nt){nt++;drawH()}})};drawH();
 const draw=()=>{row.innerHTML='';Z.forEach(([k,n])=>{if(got.includes(k))return;const b=el('button','tr-z','<img src="'+A+'ui/z_'+k+'.png" alt=""><span>'+n+'</span>');b.onclick=()=>add(k);row.appendChild(b)});inn.innerHTML=got.map((k,i)=>'<span>'+(i+1)+'. '+Z.find(z=>z[0]===k)[1]+'</span>').join('')};
 const add=async k=>{got.push(k);sfx('platsch',.4);draw();if(got.length===4){if(got.join()===SOL.join()){sfx('zauber');await sleep(900);gameEnd();done()}else{sfx('puff');await sleep(500);gameEnd();await say('HEX','Das wächst raus. Meistens.',A+'vo/d12_puff.mp3');got=[];$('#card').classList.add('on');draw()}}};draw()});

// Tag 14: Höher oder tiefer. Hulda zeigt mit der Stricknadel, was stimmt. Ideal: vier richtig, eins falsch.
GAMES.karten=()=>new Promise(done=>{
 const area=gameShell('Höher oder tiefer','Ist die nächste Karte höher oder tiefer? Oma Hulda gibt mit der Stricknadel Zeichen. Aber Knorz soll wenigstens einmal gewinnen.');
 let cur=rnd(10),round=0,right=0;const next=()=>{let n;do{n=rnd(10)}while(n===cur);return n};let nx=next();
 const draw=()=>{area.innerHTML='<div class="kt-row"><div class="kt-card"><b>'+cur+'</b></div><div class="kt-card back"></div><img class="kt-nadel'+(nx>cur?' up':'')+'" src="'+A+'items/stricknadel.png" alt=""></div><div class="kt-st">Runde '+(round+1)+' von 5</div><div class="hero-nav"><button class="pbtn" data-h="1">Höher</button><button class="pbtn" data-h="0">Tiefer</button></div>';
  area.querySelectorAll('[data-h]').forEach(b=>b.onclick=async()=>{const h=+b.dataset.h;const ok=h===(nx>cur?1:0);if(ok)right++;sfx('pergament',.6);const c=area.querySelector('.kt-card.back');c.classList.remove('back');c.innerHTML='<b>'+nx+'</b>';await sleep(900);cur=nx;nx=next();round++;if(round<5)draw();else finish()})};
 const finish=async()=>{gameEnd();st.flags.karten=right;save();done()};draw()});

// Tag 16: Schlösser knacken wie ein Profi. Dietrich ansetzen, Zylinder drehen, nicht zu viel Druck.
const LOCKSVG='<svg viewBox="0 0 300 300" class="lk-plate"><defs><radialGradient id="lkg" cx="40%" cy="35%"><stop offset="0" stop-color="#f6d27a"/><stop offset=".6" stop-color="#c8902e"/><stop offset="1" stop-color="#7a4f16"/></radialGradient></defs><path d="M150 18c52 0 92 30 104 70 14 44-6 74-6 110 0 40-46 84-98 84S52 238 52 198c0-36-20-66-6-110C58 48 98 18 150 18z" fill="url(#lkg)" stroke="#1a0f06" stroke-width="9"/><circle cx="150" cy="58" r="10" fill="#7a4f16" stroke="#1a0f06" stroke-width="6"/><circle cx="150" cy="250" r="10" fill="#7a4f16" stroke="#1a0f06" stroke-width="6"/><circle cx="84" cy="150" r="9" fill="#7a4f16" stroke="#1a0f06" stroke-width="6"/><circle cx="216" cy="150" r="9" fill="#7a4f16" stroke="#1a0f06" stroke-width="6"/></svg>';
const COREHTML='<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#b9852e" stroke="#1a0f06" stroke-width="6"/><circle cx="50" cy="50" r="36" fill="none" stroke="#e6b860" stroke-width="3"/><path d="M50 22a12 12 0 0 1 7 22l5 30H38l5-30a12 12 0 0 1 7-22z" fill="#140a03" stroke="#1a0f06" stroke-width="2"/></svg>';
const PICKSVG='<svg viewBox="0 0 320 40" class="lk-pk"><rect x="0" y="12" width="120" height="16" rx="6" fill="#5a3415" stroke="#1a0f06" stroke-width="4"/><rect x="118" y="16" width="180" height="8" fill="#cfd6dc" stroke="#1a0f06" stroke-width="3"/><path d="M296 16 l14 -10 l4 4 l-12 14 z" fill="#cfd6dc" stroke="#1a0f06" stroke-width="3"/></svg>';
const WRSVG='<svg viewBox="0 0 160 60" class="lk-wr"><path d="M4 8 h20 v34 h130 v12 H4z" fill="#9aa3aa" stroke="#1a0f06" stroke-width="4" stroke-linejoin="round"/></svg>';
function lockSnd(k){const c=ac(),t=c.currentTime;if(k==='tick')hit(t,5200,.03,.25,'bandpass');if(k==='pin'){hit(t,3400,.05,.5,'bandpass');hit(t+.045,2200,.05,.35,'bandpass')}if(k==='snap'){hit(t,6500,.12,.6,'highpass');hit(t,900,.2,.3,'lowpass')}if(k==='open'){hit(t,1500,.09,.5,'bandpass');hit(t+.11,420,.25,.5,'lowpass');hit(t+.3,260,.5,.35,'lowpass')}}
function lockpick(o){return new Promise(res=>{const STAGES=o.stages||3,SPAN=30,tol=o.easy?10:6;let picks=5,health=1,stage=0,rot=0,ang=0,hold=false,last=performance.now(),raf=0,sweet=[],openF=false,lastTick=0,shake=0;
 for(let i=0;i<STAGES;i++){let v;do{v=Math.round(Math.random()*130-65)}while(i&&Math.abs(v-sweet[i-1])<25);sweet.push(v)}
 const area=o.area;area.innerHTML='<div class="lk"><div class="lk-st"><div class="lk-wood"></div>'+LOCKSVG+'<div class="lk-core">'+COREHTML+'<div class="lk-wrw">'+WRSVG+'</div></div><div class="lk-pv">'+PICKSVG+'</div><div class="lk-pins">'+Array.from({length:STAGES},()=>'<i></i>').join('')+'</div><div class="lk-msg"></div><div class="lk-box">'+o.label+'</div></div><div class="lk-ui"><div class="lk-c"><span>Dietriche</span><b class="lk-n"></b></div><button class="lk-turn">Halten<br><small>zum Drehen</small></button><div class="lk-c"><span>Stifte</span><b class="lk-s"></b></div></div></div>';
 const q=x=>area.querySelector(x);const stg=q('.lk-st'),core=q('.lk-core'),pv=q('.lk-pv'),tb=q('.lk-turn');
 const ui=()=>{q('.lk-n').textContent=picks;q('.lk-s').textContent=stage+' / '+STAGES;area.querySelectorAll('.lk-pins i').forEach((e,i)=>e.classList.toggle('on',i<stage))};ui();
 let px=null;const setAng=a=>{ang=Math.max(-85,Math.min(85,a))};
 stg.addEventListener('pointerdown',e=>{px=e.clientX;try{stg.setPointerCapture(e.pointerId)}catch(_){}});stg.addEventListener('pointermove',e=>{if(px===null||openF)return;const r=stg.getBoundingClientRect();setAng(ang+(e.clientX-px)/r.width*190);px=e.clientX});
 stg.addEventListener('pointerup',()=>px=null);stg.addEventListener('pointercancel',()=>px=null);
 const hs=e=>{e.preventDefault();ac();hold=true;tb.classList.add('on')},he=()=>{hold=false;tb.classList.remove('on')};
 tb.addEventListener('pointerdown',hs);tb.addEventListener('pointerup',he);tb.addEventListener('pointerleave',he);tb.addEventListener('pointercancel',he);tb.addEventListener('contextmenu',e=>e.preventDefault());
 const msg=(t,c)=>{const m=q('.lk-msg');m.textContent=t;m.className='lk-msg on '+(c||'');clearTimeout(m._t);m._t=setTimeout(()=>m.classList.remove('on'),1600)};
 const buzz=ms=>{try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}};
 window.__lk={s:()=>({sweet,stage,rot,picks}),a:v=>setAng(v),h:v=>{hold=v}};
 const loop=now=>{const dt=Math.min(.05,(now-last)/1000);last=now;if(!stg.isConnected){cancelAnimationFrame(raf);return}
  const base=stage*SPAN,d=Math.abs(ang-sweet[stage]),qq=d<=tol?1:Math.max(0,1-(d-tol)/34),target=hold?base+SPAN*qq:base;
  if(hold){if(rot<target)rot=Math.min(target,rot+95*dt);else rot=Math.max(target,rot-160*dt)}else rot=Math.max(base,rot-200*dt);
  const stuck=hold&&qq<1&&rot>=target-.5;
  if(stuck){health-=dt*(0.4+0.7*(1-qq));shake=Math.min(1,shake+dt*6);if(now-lastTick>140){buzz(12);lockSnd('tick');lastTick=now}}else shake=Math.max(0,shake-dt*5);
  if(!hold&&d<12&&now-lastTick>260){lockSnd('tick');lastTick=now}
  if(health<=0){picks--;health=1;rot=base;he();lockSnd('snap');buzz([60,40,120]);stg.classList.add('brk');setTimeout(()=>stg.classList.remove('brk'),500);
   if(picks<=0){msg('Alle Dietriche verbogen. Hulda reicht dir neue.','bad');setTimeout(()=>{picks=5;ui()},1800)}else msg('Dietrich verbogen','bad');ui()}
  if(rot>=base+SPAN-.3&&qq===1&&hold){stage++;health=1;he();lockSnd('pin');buzz(35);ui();if(stage>=STAGES){finish();return}msg('Stift gesetzt, neu ansetzen')}
  const sx=(Math.random()-.5)*shake*3;core.style.transform='translate(-50%,-50%) rotate('+rot+'deg)';pv.style.transform='translate(-50%,-50%) rotate('+(ang+rot*.35+sx)+'deg)';
  raf=requestAnimationFrame(loop)};
 raf=requestAnimationFrame(loop);
 function finish(){openF=true;core.style.transition='transform .6s cubic-bezier(.3,1.4,.5,1)';core.style.transform='translate(-50%,-50%) rotate(95deg)';lockSnd('open');sfx('truhe',.6);buzz([30,60,90]);stg.classList.add('open');msg('Offen!');setTimeout(res,1300)}
})}
GAMES.schloss=()=>new Promise(async done=>{
 const area=gameShell('Huldas Kisten','Wisch über das Schloss, um den Dietrich zu bewegen. Halte den runden Knopf, um den Zylinder zu drehen. Klickt es leise, bist du nah dran. Dreht er sich kaum, liegt der Dietrich falsch: loslassen und neu ansetzen. Zu viel Druck verbiegt den Dietrich.');
 const easy=st.hero.skills.includes('finger');const L=[2,3,3];
 for(let i=0;i<3;i++){await lockpick({area,stages:L[i],easy,label:'Kiste '+(i+1)+' von 3'})}
 gameEnd();done()});

// Tag 15: Der Laden in Goldhafen
GAMES.laden=()=>new Promise(done=>{
 const W=[['htklein',6],['htmittel',12],['htgross',20],['mut',8],['rauch',10],['wetzstein',9],['stange',5]];
 const area=gameShell('Der Markt von Goldhafen','Tippe an, was du kaufen möchtest.');
 const draw=()=>{area.innerHTML='<div class="inv-gold">'+UI('gold')+' '+st.gold+' Gold</div><div class="shop">'+W.map(([id,p])=>'<button class="shop-it" data-id="'+id+'" data-p="'+p+'"'+(st.gold<p?' disabled':'')+'><img src="'+A+'items/'+id+'.png" alt=""><b>'+ITEMS[id].n+'</b><span>'+p+' Gold</span></button>').join('')+'</div><button class="pbtn big shop-done">Fertig</button>';
  area.querySelectorAll('.shop-it').forEach(b=>b.onclick=()=>{const p=+b.dataset.p,id=b.dataset.id;if(st.gold<p)return;st.gold-=p;const ex=st.inv.find(x=>x.id===id);if(ex)ex.n=(ex.n||1)+1;else st.inv.push({id,n:1});save();sfx('muenzen',.7);toast(ITEMS[id].n+' gekauft');draw();renderHud()});
  area.querySelector('.shop-done').onclick=()=>{gameEnd();done()}};draw()});

// Tag 20: Der Sturm. Böen kommen von links oder rechts, rechtzeitig ducken.
GAMES.sturm=()=>new Promise(async done=>{
 const area=gameShell('Der Sturm','Schneewirbel kündigen jede Böe an. Tippe auf Ducken, sobald die Böe kommt, dann duckt sich die Gruppe hinter Grumbold.');
 area.innerHTML='<div class="st-field"><div class="st-wh l"></div><img class="st-gr" src="'+A+'img/p_gr_5.jpg" alt=""><div class="st-wh r"></div></div><div class="kt-st st-c">Böe 1 von 10</div><button class="pbtn big st-duck">Ducken</button>';
 const f=area.querySelector('.st-field');let miss=0,ducked=false;area.querySelector('.st-duck').onclick=()=>{ducked=true;f.classList.add('duck');setTimeout(()=>f.classList.remove('duck'),500)};
 for(let i=0;i<10;i++){area.querySelector('.st-c').textContent='Böe '+(i+1)+' von 10';const side=Math.random()<.5?'l':'r';const wh=area.querySelector('.st-wh.'+side);wh.classList.add('on');await sleep(miss>=3?1500:1000);ducked=false;sfx('wind_boe',.7);f.classList.add('gust-'+side);await sleep(miss>=3?750:520);if(!ducked){miss++;toast('Zirpia: Ich fliiiege!');}wh.classList.remove('on');f.classList.remove('gust-'+side);await sleep(600)}
 gameEnd();done()});

// Tag 23: Schlachtplan. Wer geht in welcher Phase voran, mit welchem Gegenstand?
const PHASEN=[['Der Drache erhebt sich','hu','stahlnetz'],['Die Aschenschuppen','gr','glutstein'],['Der Aschesturm','zi','wiegenlied'],['Der Schatten','na','schattenschluessel'],['Das Herz','held','sonnenkerze']];
GAMES.plan=()=>new Promise(done=>{
 const area=gameShell('Der Schlachtplan','Trag ein, was auf deinem Druckblatt steht: Wer geht in welcher Phase voran?');
 const who=[['held',heroName()],['gr','Grumbold'],['zi','Zirpia'],['hu','Oma Hulda'],['na','Nachtigall']];const plan=st.flags.plan||{};
 area.innerHTML=PHASEN.map((p,i)=>'<div class="pl-row"><b>'+(i+1)+'. '+p[0]+'</b><select data-i="'+i+'"><option value="">Wer?</option>'+who.map(w=>'<option value="'+w[0]+'"'+(plan[i]===w[0]?' selected':'')+'>'+esc(w[1])+'</option>').join('')+'</select></div>').join('')+'<div class="hints pl-h"></div><button class="pbtn big pl-go">Plan festlegen</button>';
 const tips=['Jeder Gefährte hat genau einen besonderen Gegenstand bekommen. Wer hat welchen?','Lies Nachtigalls Hinweise: Welcher Gegenstand passt zu welcher Phase?','Hulda mit dem Netz, Grumbold mit dem Glutstein, Zirpia mit dem Wiegenlied, Nachtigall mit dem Schattenschlüssel, du mit Sonnenkerze und Herzjuwel.'];let nt=0;const hb=area.querySelector('.pl-h');
 const dH=()=>{hb.innerHTML=tips.map((t,i)=>'<button class="hint'+(i<nt?' open':'')+'"><span>'+(i===2?'Lösung':'Tipp '+(i+1))+'</span>'+(i<nt?t:i===nt?'Antippen zum Aufdecken':'')+'</button>').join('');[...hb.children].forEach((b,i)=>b.onclick=()=>{if(i===nt){nt++;dH()}})};dH();
 area.querySelector('.pl-go').onclick=async()=>{const p={};area.querySelectorAll('select').forEach(s=>p[s.dataset.i]=s.value);if(Object.values(p).some(v=>!v))return toast('Bitte jede Phase besetzen.');
  st.flags.plan=p;save();const ok=PHASEN.every((x,i)=>p[i]===x[1]);gameEnd();if(!ok)await say('SL','Bist du sicher? Ich frag ja nur.',A+'vo/d23_plan.mp3');done()}});

// Tag 24: Schlüsselprobe einer Phase im Drachenkampf
// Schnelle Reaktion im Drachenkampf: Ring fliegt auf das Ziel, rechtzeitig tippen gibt Bonus
function qte(title){return new Promise(res=>{const o=el('div','qte','<div class="qte-t">'+title+'</div><div class="qte-a"><i class="qte-ring"></i><button class="qte-b">JETZT</button></div><div class="qte-h">Tippe, wenn der Ring den Knopf erreicht</div>');$('#s-scene').appendChild(o);
 const r=o.querySelector('.qte-ring'),b=o.querySelector('.qte-b');const dur=1500;let t0=0,done=false,rounds=0;
 const start=()=>{t0=performance.now()+400;r.style.animation='none';void r.offsetWidth;r.style.animation='qtein '+dur+'ms linear 400ms forwards'};
 const fin=q=>{if(done)return;done=true;clearTimeout(to);o.querySelector('.qte-h').textContent=q>.8?'Perfekt!':q>.4?'Gut!':'Knapp daneben';o.classList.add(q>.8?'p':q>.4?'g':'d');sfx(q>.4?'treffer':'falsch',.5);setTimeout(()=>{o.remove();res(q)},700)};
 let to=0;const arm=()=>{to=setTimeout(()=>{if(++rounds<2){start();arm()}else fin(0)},dur+900)};
 b.onclick=()=>{const d=Math.abs(performance.now()-(t0+dur));fin(d<120?1:d<260?.6:.1)};start();arm()})}
async function keyProbe(i){const P=PHASEN[i];const plan=st.flags.plan||{};
 hideBox();const q=await qte(P[0]);const qb=q>.8?6:q>.4?3:0;
 const right=plan[i]===P[1];const unitN={held:heroName(),gr:'Grumbold',zi:'Zirpia',hu:'Oma Hulda',na:'Nachtigall'};
 let ziel=right&&has(P[2])?8:16;if(i===2&&st.flags.traum)return true;
 for(let tries=0;tries<6;tries++){const bonus=(P[1]==='held'?Math.max(st.hero.str,st.hero.dex,st.hero.wis):4)+(st.flags.trust>0&&P[1]!=='held'?3:0)+(tries===0?qb:0);
  const r=await rollD20({title:'Phase '+(i+1)+': '+P[0],sub:esc(unitN[plan[i]||P[1]])+' mit '+ITEMS[P[2]].n+'. W20 plus '+bonus+', Ziel '+ziel,bonus,ziel});
  if(st.flags.trust>0&&P[1]!=='held'){st.flags.trust--;save()}
  if(r.total>=ziel)return true;
  sfx('drache');await say('VH',tries%2?'Klauenhieb!':'Kalter Ascheatem!',null,3);await say('SL','Noch einmal. Der Kampf ist immer gewinnbar. Versprochen.',A+'vo/d24_nochmal.mp3');}
 return true}

// Tag 24: Der Schatz mit der Nachricht des Schenkenden
GAMES.schatz=()=>new Promise(async done=>{sfx('truhe');const g=GIFT||{};
 const msg=g.msg?esc(g.msg).replace(/\n/g,'<br>'):'Frohe Lichternacht! Du hast Eldmark gerettet.';
 await showCard('<img class="cc-img" src="'+A+'ui/truhe.png" alt=""><div class="cc-k">Der Schatz des Hüters</div><h3>Für '+heroName()+'</h3><div class="brief">'+msg+(g.von?'<p class="sig">'+esc(g.von)+'</p>':'')+'</div>'+(g.ort?'<div class="cc-k" style="margin-top:12px">Im zweiten Fach liegt ein Zettel</div><p>'+esc(g.ort)+'</p>':''),'fanfare');
 await showCard('<img class="cc-img" src="'+A+'ui/medaille.png" alt=""><div class="cc-k">Abzeichen</div><h3>Retter der Lichternacht</h3><p>'+heroName()+', '+(st.hero.f?CLS[st.hero.cls].nf:CLS[st.hero.cls].n)+' der Stufe '+st.lvl+', mit Grumbold, Zirpia, Oma Hulda und Nachtigall.</p>','stufenaufstieg');
 st.flags.badge=1;save();done()});

// Tag 2: Hütchenspiel des Wirts. Kompass unter einem Becher, drei Runden, immer schneller.
GAMES.becher=()=>new Promise(done=>{
 const area=gameShell('Das Becherspiel','Merk dir, unter welchem Becher der Kompass liegt. Der Wirt mischt. Dann tippe auf den richtigen Becher. Dreimal hintereinander.');
 area.innerHTML='<div class="bc-wrap"><div class="bc-st">Runde 1 von 3</div><div class="bc-table"><img class="bc-k" src="'+A+'ui/kompass_klein.png" alt=""></div><div class="bc-msg"></div></div>';
 const tb=area.querySelector('.bc-table'),kp=area.querySelector('.bc-k'),msg=area.querySelector('.bc-msg'),st_=area.querySelector('.bc-st');
 const X=[18,50,82];const cups=[0,1,2].map(i=>{const c=el('button','bc-c','<img src="'+A+'ui/becher.png" alt="">');c.dataset.i=i;c.style.left=X[i]+'%';tb.appendChild(c);return {el:c,slot:i}});
 const R=[{n:5,ms:560},{n:8,ms:400},{n:12,ms:280}];let round=0,miss=0,slow=1,prize=null,busy=true;
 const place=c=>{c.el.style.left=X[c.slot]+'%'};
 const lift=(c,on)=>c.el.classList.toggle('up',on);
 async function swap(a,b,ms){a.el.style.transitionDuration=b.el.style.transitionDuration=ms+'ms';a.el.classList.add('arcA');b.el.classList.add('arcB');const t=a.slot;a.slot=b.slot;b.slot=t;place(a);place(b);sfx('krug',.25);await sleep(ms+30);a.el.classList.remove('arcA');b.el.classList.remove('arcB')}
 async function play(){busy=true;st_.textContent='Runde '+(round+1)+' von 3';msg.textContent='';const r=R[round];
  prize=cups[Math.floor(Math.random()*3)];kp.style.left=X[prize.slot]+'%';kp.style.opacity=1;
  cups.forEach(c=>{c.el.style.transitionDuration='300ms'});lift(prize,true);await sleep(1300);lift(prize,false);await sleep(450);kp.style.opacity=0;
  for(let k=0;k<r.n;k++){let a=Math.floor(Math.random()*3),b=(a+1+Math.floor(Math.random()*2))%3;await swap(cups[a],cups[b],Math.round(r.ms*slow))}
  msg.textContent='Wo ist der Kompass?';busy=false}
 cups.forEach(c=>c.el.onclick=async()=>{if(busy)return;busy=true;kp.style.left=X[prize.slot]+'%';kp.style.opacity=1;cups.forEach(x=>x.el.style.transitionDuration='300ms');lift(c,true);
  if(c===prize){sfx('richtig',.7);msg.textContent=['Richtig!','Wieder richtig!','Dreimal richtig!'][round];await sleep(1200);lift(c,false);await sleep(400);round++;miss=0;slow=1;if(round>=3){gameEnd();return done()}play()}
  else{sfx('falsch',.6);st.flags.becher_leer=1;save();msg.textContent='Leer.';await sleep(700);lift(prize,true);await sleep(1300);lift(c,false);lift(prize,false);miss++;if(miss>=2&&slow===1){slow=1.5;toast('Der Wirt mischt jetzt etwas langsamer.')}await sleep(500);play()}});
 setTimeout(play,500)});

// Tag 7: Die sprechenden Wegweiser. Schilder antippen, zuhören, dann einem Weg folgen.
// Logik: Nur ein Schild sagt die Wahrheit, und das ehrliche Schild steht vor dem Weg nach Norden. Lösung: Mitte.
GAMES.schilder=(s)=>new Promise(done=>{const sc=$('#s-scene');const IW=1080,IH=1920;
 const SG=[{k:'l',x:.355,top:0.337,bot:0.631,t:'Der rechte Weg führt nach Norden!',dir:'Links lang'},{k:'m',x:.52,top:0.344,bot:0.691,t:'Der linke Weg führt nicht nach Norden.',dir:'Geradeaus'},{k:'r',x:.68,top:0.344,bot:0.631,t:'Das mittlere Schild lügt.',dir:'Rechts lang'}];
 const HINTS=['Das ehrliche Schild steht vor dem richtigen Weg. Prüf jeden Weg: Würde dann genau dieses eine Schild die Wahrheit sagen?','Links? Dann müsste das linke Schild ehrlich sein. Es sagt aber, rechts sei Norden. Passt nicht.','Rechts? Dann wäre das rechte ehrlich, die Mitte würde lügen, also wäre links Norden. Widerspruch. Es bleibt: geradeaus.'];
 const o=el('div','pg','<div class="pg-img" style="background-image:url('+A+'img/f_schild_weg.jpg)"></div><div class="pg-top">Tippe die Schilder an</div><button class="pg-tip"><img src="'+A+'ui/tipp.png" alt="Tipp"></button>');sc.appendChild(o);
 const box=()=>{const W=o.clientWidth,H=o.clientHeight,k=Math.max(W/IW,H/IH);return {k,ox:(W-IW*k)/2,oy:(H-IH*k)/2}};
 let hint=0,walking=false;
 const spots=SG.map((g,i)=>{const b=el('button','pg-spot','<i class="pg-bub"></i><i class="pg-ring"></i>');o.appendChild(b);const go=el('button','pg-go',g.dir);o.appendChild(go);return {g,b,go}});
 const lay=()=>{const {k,ox,oy}=box();spots.forEach(({g,b,go})=>{const x=ox+g.x*IW*k,y0=oy+g.top*IH*k,y1=oy+g.bot*IH*k;b.style.left=(x-IW*k*.075)+'px';b.style.top=y0+'px';b.style.width=(IW*k*.15)+'px';b.style.height=(y1-y0)+'px';go.style.left=(o.clientWidth*[.2,.5,.8][SG.indexOf(g)])+'px';go.style.top=(oy+.80*IH*k)+'px'})};
 lay();addEventListener('resize',lay);
 spots.forEach(sp=>{sp.b.onclick=async()=>{if(walking)return;stopVo();spots.forEach(x=>{x.b.classList.remove('talk','on')});sp.b.classList.add('on','talk');
  sp.b.querySelector('.pg-bub').textContent=sp.g.t;sp.go.classList.add('on');
  const a=playVo(A+'vo/d07_s'+sp.g.k+'.mp3');await voDone(a);sp.b.classList.remove('talk');
  if(spots.every(x=>x.go.classList.contains('on')))o.querySelector('.pg-top').textContent='Welchem Weg folgst du?'};
  sp.go.onclick=async()=>{if(walking)return;walking=true;stopVo();sfx('schritte_schnee',.7);spots.forEach(x=>x.b.classList.remove('talk'));
   if(sp.g.k==='m'){o.classList.add('out');setTimeout(()=>o.remove(),500);removeEventListener('resize',lay);return done()}
   o.style.display='none';await run(s.wrong||[]);hideBox();o.style.display='';walking=false}});
 o.querySelector('.pg-tip').onclick=()=>{toast(HINTS[Math.min(hint,2)],7000);hint++};
});

// Tag 15: Vier Händler stehen nebeneinander. Antippen, zuhören, den Betrüger entlarven.
GAMES.haendler=(s)=>new Promise(done=>{const sc=$('#s-scene');const IW=1080,IH=1920;
 const SG=[{k:'bob',n:'Bob',x:.13,top:.59,bot:.84,t:'Berta betrügt nicht.'},{k:'bob2',n:'Bob der Zweite',x:.40,top:.58,bot:.86,t:'Ferdinand betrügt.'},{k:'berta',n:'Berta',x:.63,top:.62,bot:.86,t:'Einer der beiden Bobs betrügt.'},{k:'ferd',n:'Ferdinand',x:.87,top:.59,bot:.82,t:'Bob der Zweite lügt.'}];
 const HINTS=['Genau einer betrügt, und der lügt immer. Die anderen drei sagen immer die Wahrheit. Nimm nacheinander an, jeder wäre der Betrüger.','Bob der Zweite und Ferdinand widersprechen sich direkt. Einer von beiden muss der Betrüger sein.','Wäre Ferdinand der Betrüger, müsste Berta lügen. Berta ist aber ehrlich. Also betrügt Bob der Zweite.'];
 const o=el('div','pg hd','<div class="pg-img" style="background-image:url('+A+'img/f_markt.jpg),url('+A+'img/ort15.jpg)"></div><div class="pg-top">Tippe die Händler an</div><button class="pg-tip"><img src="'+A+'ui/tipp.png" alt="Tipp"></button>');sc.appendChild(o);
 const box=()=>{const W=o.clientWidth,H=o.clientHeight,k=W/IW;return {k,ox:0,oy:H-IH*k}};
 let hint=0,busy=false;
 const spots=SG.map((g,i)=>{const b=el('button','pg-spot'+(i===0?' el':i===3?' er':''),'<i class="pg-bub"></i><i class="pg-ring"></i>');o.appendChild(b);const go=el('button','pg-go hd-go','Betrüger!');o.appendChild(go);return {g,b,go}});
 const lay=()=>{const {k,ox,oy}=box();const W=o.clientWidth;spots.forEach(({g,b,go},i)=>{const x=ox+g.x*IW*k,y0=oy+g.top*IH*k,y1=oy+g.bot*IH*k;const w=Math.min(IW*k*.2,W/4.4);b.style.left=(x-w/2)+'px';b.style.top=y0+'px';b.style.width=w+'px';b.style.height=(y1-y0)+'px';go.style.left=Math.min(W-6-W/8,Math.max(6+W/8,x))+'px';go.style.top=Math.min(o.clientHeight-60,y1+18)+'px'})};
 lay();addEventListener('resize',lay);
 spots.forEach(sp=>{sp.b.onclick=async()=>{if(busy)return;stopVo();spots.forEach(x=>x.b.classList.remove('talk','on'));sp.b.classList.add('on','talk');
  sp.b.querySelector('.pg-bub').innerHTML='<b>'+sp.g.n+'</b>'+sp.g.t;sp.go.classList.add('on');
  const a=playVo(A+'vo/h15_'+sp.g.k+'.mp3');await voDone(a);sp.b.classList.remove('talk');
  if(spots.every(x=>x.go.classList.contains('on')))o.querySelector('.pg-top').textContent='Wer ist der Betrüger?'};
  sp.go.onclick=async()=>{if(busy)return;busy=true;stopVo();
   if(sp.g.k==='bob2'){sfx('richtig');o.classList.add('out');setTimeout(()=>o.remove(),500);removeEventListener('resize',lay);return done(true)}
   sfx('falsch');o.style.display='none';await run(s.wrong||[]);hideBox();o.style.display='';busy=false}});
 o.querySelector('.pg-tip').onclick=()=>{toast(HINTS[Math.min(hint,2)],7000);hint++};
});

// Tag 18: Die Eisbrücke. Seitenansicht, Figuren mit der Laterne hinüberschicken.
GAMES.bruecke=(s)=>new Promise(done=>{const sc=$('#s-scene');
 const h=st.hero;const P=[{k:'held',n:heroName(),w:50,img:heroImg(),run:A+'img/r_'+h.cls+'_'+h.look+'_'},{k:'gr',n:'Grumbold',w:90,img:A+'img/p_gr.jpg',run:A+'img/r_gr_'},{k:'hu',n:'Oma Hulda',w:30,img:A+'img/p_hu.jpg',run:A+'img/r_hu_'},{k:'zi',n:'Zirpia',w:5,img:A+'img/p_zi.jpg',run:A+'img/r_zi_'}];
 const side={held:0,gr:0,hu:0,zi:0};let lamp=0,sel=new Set(),moves=0,busy=false;const BY=.58;
 const o=el('div','pg bz','<div class="pg-img" style="background-image:url('+A+'img/f_brueckespiel.jpg),url('+A+'img/ort18.jpg)"></div><div class="bz-crack"></div><div class="pg-top">Wer geht mit der Laterne hinüber?</div><div class="bz-info"><b class="bz-w">0 von 100 Stein</b><span class="bz-m">Überquerungen: 0</span></div><button class="pbtn bz-go">Losgehen</button><button class="pg-tip"><img src="'+A+'ui/tipp.png" alt="Tipp"></button><div class="bz-rule">Die Brücke trägt höchstens 100 Stein. Wer geht, nimmt die Laterne mit. Grumbold trägt die Laterne nie allein und bleibt nie allein im Dunkeln.</div>');sc.appendChild(o);
 const lampEl=el('img','bz-lamp');lampEl.src=A+'items/laterne.png';o.appendChild(lampEl);
 const T=P.map(p=>{const t=el('button','bz-t','<i style="background-image:url('+p.img+')"></i><img class="bz-sp" src="'+p.run+'0.png" alt=""><b>'+esc(p.n)+'</b><span>'+p.w+' Stein</span>');const sp=t.querySelector('.bz-sp');sp.onload=()=>t.classList.add('has-sp');sp.onerror=()=>sp.remove();t._sp=sp;t._run=p.run;o.appendChild(t);t.onclick=()=>{if(busy||side[p.k]!==lamp)return;sel.has(p.k)?sel.delete(p.k):sel.size<3&&sel.add(p.k);sfx('ui_klick',.5);lay()};return {p,t}});
 const HINTS=['Grumbold ist so schwer, dass er nur mit einer einzigen Figur zusammen gehen kann. Mit wem?','Grumbold und Zirpia gehen in der Mitte hinüber, nicht am Anfang und nicht am Ende.','Du und Hulda hin, Hulda zurück, Grumbold mit Zirpia hin, Zirpia zurück, dann Zirpia und Hulda hin.'];let hint=0;
 o.querySelector('.pg-tip').onclick=()=>{toast(HINTS[Math.min(hint,2)],8000);hint++};
 const lay=()=>{const W=o.clientWidth,H=o.clientHeight,y=H*BY;const cnt=[0,0];
  T.forEach(({p,t})=>{const sd=side[p.k];const i=cnt[sd]++;const col=i%2,row=Math.floor(i/2);const x=sd?W*(.70+col*.15):W*(.08+col*.15);t.style.left=x+'px';t.style.top=(y-150-row*92)+'px';t.classList.toggle('sel',sel.has(p.k));t.classList.toggle('off',sd!==lamp)});
  lampEl.style.left=(lamp?W*.88:W*.05)+'px';lampEl.style.top=(y-48)+'px';
  const w=[...sel].reduce((a,k)=>a+P.find(p=>p.k===k).w,0);const wb=o.querySelector('.bz-w');wb.textContent=w+' von 100 Stein';wb.classList.toggle('bad',w>100);
  o.querySelector('.bz-m').textContent='Überquerungen: '+moves;o.querySelector('.bz-go').disabled=!sel.size};
 lay();addEventListener('resize',lay);
 const say1=t=>{toast(t,4500)};
 o.querySelector('.bz-go').onclick=async()=>{if(busy||!sel.size)return;const g=[...sel];const w=g.reduce((a,k)=>a+P.find(p=>p.k===k).w,0);
  if(g.length===1&&g[0]==='gr'){sfx('falsch',.6);return say1('Grumbold trägt die Laterne nicht allein. Er würde sie vor Aufregung fallen lassen.')}
  const after={...side};g.forEach(k=>after[k]=1-lamp);const nl=1-lamp;
  if(after.gr!==nl&&!Object.keys(after).some(k=>k!=='gr'&&after[k]===after.gr)){sfx('falsch',.6);return say1('Dann stünde Grumbold allein im Dunkeln. Das macht er nicht. Er fürchtet sich.')}
  busy=true;const W=o.clientWidth;const dir=lamp?-1:1;sfx('schritte_schnee',.7);
  const mv=T.filter(x=>sel.has(x.p.k));let fr=1;const runI=setInterval(()=>{mv.forEach(x=>{if(x.t._sp&&x.t.classList.contains('has-sp'))x.t._sp.src=x.t._run+(1+fr%3)+'.png'});fr++},120);mv.forEach(x=>x.t.classList.toggle('left',dir<0));setTimeout(()=>{clearInterval(runI);mv.forEach(x=>{if(x.t._sp)x.t._sp.src=x.t._run+'0.png'})},1850);mv.forEach((x,i)=>{x.t.classList.add('walk');x.t.style.transition='left 1.8s linear';x.t.style.left=(W*(lamp?.30:.55)-i*30*dir)+'px'});lampEl.style.transition='left 1.8s linear';lampEl.style.left=(W*(lamp?.33:.58))+'px';
  if(w>100){await sleep(1100);sfx('eis_knackt',1);o.classList.add('crack');await sleep(500);mv.forEach(x=>{x.t.style.transition='top .9s ease-in';x.t.style.top=(o.clientHeight+100)+'px'});sfx('platsch',.6);await sleep(1300);
   o.style.display='none';await run(s.wrong||[]);hideBox();o.style.display='';o.classList.remove('crack');Object.keys(side).forEach(k=>side[k]=0);lamp=0;moves=0;sel.clear();
   T.forEach(x=>{x.t.style.transition='none';x.t.classList.remove('walk')});lampEl.style.transition='none';lay();busy=false;return}
  await sleep(1850);mv.forEach(x=>{x.t.classList.remove('walk')});g.forEach(k=>side[k]=nl);lamp=nl;moves++;sel.clear();T.forEach(x=>x.t.style.transition='left .5s,top .5s');lampEl.style.transition='left .5s';lay();busy=false;
  if(Object.values(side).every(v=>v===1)){sfx('richtig');await sleep(600);toast(moves<=5?'Alle drüben! In '+moves+' Überquerungen, besser geht es nicht.':'Alle drüben! In '+moves+' Überquerungen. Mit fünf wäre es auch gegangen.',5000);
   o.classList.add('out');setTimeout(()=>o.remove(),500);removeEventListener('resize',lay);done(moves)}};
});
