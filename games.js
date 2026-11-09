// Minispiele. Alle Grafiken gemalt (a/ui), Lichtstrahlen und Bewegung im Code.
const GAMES={};
// Eigene Kulisse je Minispiel: passend zum Ort, abgedunkelt und weichgezeichnet, damit die Karte gut lesbar bleibt
const GBG={spiegel:'ort05',irrlicht:'ort08_leer',takt:'ort10',sumpf:'ort11',trank:'hx1',karten:'ort14',schloss:'ort16',laden:'f_markt',plan:'ort23',schatz:'ort01',becher:'f_wirt1'};
function gameShell(title,help){const cd=$('#card');const k=window.GAMEKEY;cd.classList.toggle('gbg',!!(k&&GBG[k]));if(k&&GBG[k])cd.style.setProperty('--gbg','url('+A+'img/'+GBG[k]+'.jpg)');if(!/Reim/.test(help))setTimeout(()=>readAloud(help),350);const o=$('#card');o.innerHTML='<div class="c-card game"><div class="cc-k">Minispiel</div><h3>'+title+'</h3><p class="g-help">'+help+'</p><div class="g-area"></div><div class="g-foot"></div></div>';o.classList.add('on');return o.querySelector('.g-area')}
function gameEnd(){const cd=$('#card');cd.classList.remove('on');cd.classList.remove('gbg')}

// Tag 4: Licht in den Stollen. Drei Stollen nacheinander: Spiegel drehen, Felsen halten das Licht auf, im letzten Stollen müssen zwei Glutkristalle leuchten.
// Spielfeld 5 x 7 Felder. Spiegel: "/" lenkt von links nach oben, "\" von links nach unten.
const SP_LV=[
 {L:[0,0,1,0],G:[4,6],M:{'2,0':'\\','2,3':'\\','4,3':'\\'},R:['0,4','1,5','3,1'],C:[],say:['sp_1','SL','Erster Stollen. Das Zählen kommt von ganz hinten. Tippe die Spiegel an und lenk das Licht in die Kammer.'],ok:['sp_1ok','GR','Ist da jemand? Da hinten wird es hell!']},
 {L:[0,6,0,-1],G:[4,0],M:{'0,2':'/','2,2':'\\','2,5':'\\','4,5':'/','1,0':'/'},dec:['1,0'],R:['3,2','1,4','3,0'],C:[],say:['sp_2','SL','Zweiter Stollen. Hier liegen Felsbrocken im Weg. Licht geht nicht durch Stein. Ich habe es ausprobiert.'],ok:['sp_2ok','GR','Heller! Herbert, es wird heller!']},
 {L:[0,1,1,0],G:[4,6],M:{'3,1':'\\','3,3':'/','0,3':'/','0,6':'\\','1,5':'/','4,1':'\\'},dec:['1,5','4,1'],R:['2,5','4,4','1,0'],C:['1,1','1,3'],say:['sp_3','SL','Letzter Stollen. Siehst du die Glutkristalle? Das Licht muss durch beide hindurch, sonst bleibt die Kammer dunkel.']}];
GAMES.spiegel=()=>new Promise(async done=>{hideBox();
 const W=5,H=7,FACE={SL:'p_sl_2',GR:'p_gr_6'};
 const o=el('div','sp2','<div class="sp2-st"><div class="tk2-top"><div class="tk2-t">Licht in den Stollen</div><div class="sp2-pips"><i></i><i></i><i></i></div></div><div class="sp2-wrap"><div class="sp2-b"><canvas class="sp2-cv"></canvas><div class="sp2-pc"></div><canvas class="sp2-fx"></canvas></div></div><div class="sp2-help">Tippe auf einen Spiegel, um ihn zu drehen.</div><div class="sp2-foot"><button class="lnk sp2-easy">Leichter machen</button></div></div>');
 document.body.appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));
 const stg=o.querySelector('.sp2-st'),wrap=o.querySelector('.sp2-wrap'),bd=o.querySelector('.sp2-b'),cv=o.querySelector('.sp2-cv'),fxc=o.querySelector('.sp2-fx'),pc=o.querySelector('.sp2-pc'),pips=[...o.querySelectorAll('.sp2-pips i')];
 let cs=60,lv=0,LV,M,SOL,path=[],lit=new Set(),hit=false,won=false,easyUsed=0,t0=performance.now(),raf=0,warnK='';
 const key=(x,y)=>x+','+y;
 const speak=(id,who,t)=>new Promise(res=>{const b=el('div','rk-say sp2-say','<div class="rk-face"></div><p>'+t+'</p>');b.querySelector('.rk-face').style.backgroundImage='url('+A+'img/'+FACE[who]+'.jpg)';if(who==='GR')b.classList.add('dunkel');stg.appendChild(b);requestAnimationFrame(()=>b.classList.add('on'));
  const a=playVo(A+'vo/'+id+'.mp3');let f=0;const go=()=>{if(f)return;f=1;if(a&&!a.ended)stopVo();b.classList.remove('on');setTimeout(()=>b.remove(),250);res()};
  b.onpointerdown=e=>{e.stopPropagation();go()};const iv=setInterval(()=>{if(!a||a.ended){clearInterval(iv);setTimeout(go,a?400:t.length*55)}},120)});
 function layout(){const r=wrap.getBoundingClientRect();cs=Math.floor(Math.min(r.width/W,r.height/H));bd.style.width=cs*W+'px';bd.style.height=cs*H+'px';bd.style.setProperty('--cs',cs+'px');
  [cv,fxc].forEach(c=>{c.width=cs*W*2;c.height=cs*H*2});place();trace()}
 function piece(cls,x,y,html){const d=el('div','sp2-p '+cls,html||'');d.dataset.k=key(x,y);pc.appendChild(d);return d}
 function place(){pc.querySelectorAll('.sp2-p').forEach(d=>{const [x,y]=d.dataset.k.split(',').map(Number);d.style.left=x*cs+'px';d.style.top=y*cs+'px'})}
 function build(){pc.innerHTML='';LV=SP_LV[lv];SOL=LV.M;M={};for(const k in SOL)M[k]=(LV.dec||[]).includes(k)?(Math.random()<.5?'/':'\\'):(SOL[k]==='/'?'\\':'/');
  won=false;hit=false;warnK='';pips.forEach((p,i)=>p.className=i<lv?'ok':i===lv?'jetzt':'');
  const [lx,ly,dx,dy]=LV.L;const ln=piece('sp2-lat',lx,ly,'<img src="'+A+'ui/laterne.png" alt=""><b></b>');ln.style.setProperty('--rot',(Math.atan2(dy,dx)*180/Math.PI)+'deg');
  piece('sp2-door',LV.G[0],LV.G[1],'<img src="'+A+'ui/kammer.png" alt="">');
  LV.R.forEach((k,i)=>{const [x,y]=k.split(',').map(Number);piece('sp2-rock',x,y,'<img src="'+A+'ui/'+['sp_geroell','sp_fels','stein'][i%3]+'.png" alt="">')});
  LV.C.forEach(k=>{const [x,y]=k.split(',').map(Number);piece('sp2-kr',x,y,'<img class="aus" src="'+A+'ui/sp_kristall.png" alt=""><img class="an" src="'+A+'ui/sp_kristall_an.png" alt="">')});
  for(const k in M){const [x,y]=k.split(',').map(Number);const d=piece('sp2-mir',x,y,'<i></i><img src="'+A+'ui/sp_spiegel.png" alt="">');d.dataset.r=M[k]==='/'?0:90;d.style.setProperty('--r',d.dataset.r+'deg');
   d.onclick=()=>{if(won)return;M[k]=M[k]==='/'?'\\':'/';d.dataset.r=+d.dataset.r+90;d.style.setProperty('--r',d.dataset.r+'deg');d.classList.remove('tap');void d.offsetWidth;d.classList.add('tap');sfx('stein',.45);setTimeout(()=>sfx('licht_an',.18),120);trace()}}
  layout()}
 function trace(){const [lx,ly,dx0,dy0]=LV.L;let x=lx,y=ly,dx=dx0,dy=dy0;path=[[x+.5,y+.5]];lit=new Set();hit=false;const seen=new Set();
  for(let i=0;i<80;i++){x+=dx;y+=dy;const k=key(x,y);
   if(x<0||y<0||x>=W||y>=H){path.push([x+.5-dx*.5,y+.5-dy*.5]);break}
   if(LV.R.includes(k)){path.push([x+.5-dx*.32,y+.5-dy*.32]);break}
   if(x===lx&&y===ly){path.push([x+.5-dx*.4,y+.5-dy*.4]);break}
   const sk=k+dx+dy;if(seen.has(sk))break;seen.add(sk);
   path.push([x+.5,y+.5]);
   if(LV.C.includes(k))lit.add(k);
   if(x===LV.G[0]&&y===LV.G[1]){hit=true;break}
   const m=M[k];if(m==='/')[dx,dy]=[-dy,-dx];else if(m==='\\')[dx,dy]=[dy,dx]}
  pc.querySelectorAll('.sp2-kr').forEach(d=>d.classList.toggle('lit',lit.has(d.dataset.k)));
  pc.querySelectorAll('.sp2-mir').forEach(d=>d.classList.toggle('hot',path.some(p=>key(Math.floor(p[0]),Math.floor(p[1]))===d.dataset.k)));
  const allLit=LV.C.every(k=>lit.has(k));const door=pc.querySelector('.sp2-door');door.classList.toggle('lit',hit&&allLit);door.classList.toggle('halb',hit&&!allLit);
  if(hit&&!allLit){const wk=JSON.stringify(M);if(wk!==warnK){warnK=wk;toast('Die Kammer bleibt dunkel. Erst müssen beide Glutkristalle leuchten.',3200)}}
  if(hit&&allLit&&!won)win();drawBeam()}
 function drawBeam(){const cx=cv.getContext('2d');cx.clearRect(0,0,cv.width,cv.height);const s=cs*2;if(path.length<2)return;
  cx.lineCap='round';cx.lineJoin='round';
  [[s*.5,'rgba(255,170,60,.10)'],[s*.26,'rgba(255,190,90,.22)'],[s*.12,'rgba(255,215,130,.6)'],[s*.045,'#fffbe6']].forEach(([w,c])=>{cx.strokeStyle=c;cx.lineWidth=w;cx.beginPath();path.forEach((p,i)=>i?cx.lineTo(p[0]*s,p[1]*s):cx.moveTo(p[0]*s,p[1]*s));cx.stroke()});
  const e=path[path.length-1];const g=cx.createRadialGradient(e[0]*s,e[1]*s,0,e[0]*s,e[1]*s,s*.45);g.addColorStop(0,'rgba(255,240,190,.9)');g.addColorStop(1,'rgba(255,200,90,0)');cx.fillStyle=g;cx.beginPath();cx.arc(e[0]*s,e[1]*s,s*.45,0,7);cx.fill()}
 // Lichtfunken wandern den Strahl entlang, Staub schwebt im Licht
 const motes=Array.from({length:26},()=>({x:Math.random()*W,y:Math.random()*H,v:.05+Math.random()*.08,a:Math.random()*6}));
 function anim(){raf=requestAnimationFrame(anim);const cx=fxc.getContext('2d'),s=cs*2;cx.clearRect(0,0,fxc.width,fxc.height);const t=(performance.now()-t0)/1000;
  let L=0;const seg=[];for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i];const d=Math.hypot(b[0]-a[0],b[1]-a[1]);seg.push([a,b,L,d]);L+=d}
  cx.globalCompositeOperation='lighter';
  if(L>0)for(let n=0;n<Math.ceil(L*2.2);n++){const p=((t*2.4+n/2.2)%L+L)%L;const sg=seg.find(q=>p>=q[2]&&p<=q[2]+q[3]);if(!sg)continue;const u=(p-sg[2])/(sg[3]||1);const x=(sg[0][0]+(sg[1][0]-sg[0][0])*u)*s,y=(sg[0][1]+(sg[1][1]-sg[0][1])*u)*s;
   const g=cx.createRadialGradient(x,y,0,x,y,s*.11);g.addColorStop(0,'rgba(255,255,235,.95)');g.addColorStop(1,'rgba(255,200,100,0)');cx.fillStyle=g;cx.beginPath();cx.arc(x,y,s*.11,0,7);cx.fill()}
  motes.forEach(m=>{m.y-=m.v/60;m.x+=Math.sin(t+m.a)*.002;if(m.y<0){m.y=H;m.x=Math.random()*W}const near=path.some((p,i)=>i&&distSeg(m.x,m.y,path[i-1],p)<.35);cx.fillStyle='rgba(255,230,170,'+(near?.75:.12)+')';cx.beginPath();cx.arc(m.x*s,m.y*s,near?2.6:1.6,0,7);cx.fill()});
  cx.globalCompositeOperation='source-over'}
 const distSeg=(x,y,a,b)=>{const vx=b[0]-a[0],vy=b[1]-a[1],l=vx*vx+vy*vy||1;let u=((x-a[0])*vx+(y-a[1])*vy)/l;u=Math.max(0,Math.min(1,u));return Math.hypot(x-a[0]-vx*u,y-a[1]-vy*u)};
 async function win(){won=true;sfx('richtig');const door=pc.querySelector('.sp2-door');door.classList.add('auf');
  const r=door.getBoundingClientRect();fx('magic',door,cs*2.2);pips[lv].className='ok';await sleep(1300);
  if(LV.ok)await speak(...LV.ok);
  lv++;if(lv<SP_LV.length){stg.classList.add('wechsel');await sleep(450);build();stg.classList.remove('wechsel');await sleep(350);await speak(...SP_LV[lv].say);return}
  await sleep(300);cancelAnimationFrame(raf);removeEventListener('resize',layout);o.classList.remove('on');await sleep(450);o.remove();done()}
 o.querySelector('.sp2-easy').onclick=()=>{if(won)return;let n=0;for(const k in SOL)if(!(LV.dec||[]).includes(k)&&M[k]!==SOL[k]&&n<2){M[k]=SOL[k];const d=pc.querySelector('.sp2-mir[data-k="'+k+'"]');d.dataset.r=+d.dataset.r+90;d.style.setProperty('--r',d.dataset.r+'deg');n++}sfx('licht_an',.4);trace()};
 if(TEST){const tb=el('button','lnk','Test: lösen');o.querySelector('.sp2-foot').appendChild(tb);tb.onclick=()=>{for(const k in SOL)if(!(LV.dec||[]).includes(k))M[k]=SOL[k];trace()}}
 addEventListener('resize',layout);build();anim();await sleep(450);await speak(...SP_LV[0].say)});

// Lieder von Zirpia (Suno), laufen über der Musik
let songEl=null;
function playSong(name,vol,max,onStart){stopSong();if(!st.sound)return Promise.resolve();ac();const me={stop:null,done:null};songEl=me;hush(true);
 return new Promise(r=>{let t=null,fin=false;const end=()=>{if(fin)return;fin=true;clearTimeout(t);clearTimeout(me._w);if(songEl===me){songEl=null;hush(false)}r()};me.done=end;
  loadVo(A+'songs/'+name+'.mp3').then(b=>{if(songEl!==me||fin)return end();if(!b)return end();const s=AC.createBufferSource();s.buffer=b;const g=AC.createGain();g.gain.value=vol??.9;s.connect(g);g.connect(voOut());s.onended=end;s.start();if(onStart)onStart();
   me.stop=()=>{try{g.gain.setTargetAtTime(0,AC.currentTime,.05);s.stop(AC.currentTime+.2)}catch(e){}end()};
   me._w=setTimeout(end,(b.duration+1.5)*1000);
   if(max)t=setTimeout(()=>{g.gain.setTargetAtTime(0,AC.currentTime,.5);setTimeout(()=>{try{s.stop()}catch(e){}end()},2200)},max*1000)})})}
// Untertitel zu Zirpias Liedern, Start im onStart von playSong
function songSubs(name,max){const L=(typeof SLYR!=='undefined'&&SLYR[name])||[];const host=document.querySelector('#s-scene')||document.body;const d=el('div','film-sub song-sub');host.appendChild(d);const tm=[];const lim=(max||999)+.6;
 L.forEach(([a,b,t])=>{if(a>=lim)return;tm.push(setTimeout(()=>{d.innerHTML='<i>Zirpia singt</i>'+t;d.classList.add('on')},a*1000));tm.push(setTimeout(()=>d.classList.remove('on'),Math.min(b,lim)*1000))});
 return ()=>{tm.forEach(clearTimeout);d.classList.remove('on');setTimeout(()=>d.remove(),500)}}
function stopSong(){if(songEl){const m=songEl;songEl=null;if(m.stop)m.stop();else if(m.done)m.done();hush(false)}}
function ballade(){if(!st.flags.ballade){st.flags.ballade=['zirpia_02','zirpia_03','zirpia_04','zirpia_05'][Math.floor(Math.random()*4)];save()}return st.flags.ballade}

// Tag 8: Lichtfolge merken. Drei Runden mit 4, 6 und 8 Lichtern.
GAMES.irrlicht=()=>new Promise(done=>{
 const area=gameShell('Lichtfolge merken','Schau genau hin, welche Irrlichter nacheinander leuchten. Dann tippe sie in derselben Reihenfolge an.');
 const N=5,TONES=[392,440,523,587,659],POS=[[15,60],[32,40],[50,30],[68,40],[85,60]],COL=['#9fdcff','#a6f08c','#ffe27a','#ffb3cf','#d6a6ff'];
 area.innerHTML='<div class="ir2"><div class="ir2-stage" style="background-image:url('+A+'img/ort08_leer.jpg)"><div class="ir2-mist"></div><div class="ir2-st"><b>Runde 1 von 3</b><span>Schau genau hin</span></div><div class="ir2-dots"></div></div></div>';
 const stage=area.querySelector('.ir2-stage'),dots=area.querySelector('.ir2-dots'),st2=area.querySelector('.ir2-st span');const L=[];
 for(let i=0;i<N;i++){const b=el('button','ir2-w','<i class="ir2-halo"></i><img src="'+A+'ui/wisp_'+(i+1)+'.png" alt="">');b.style.left=POS[i][0]+'%';b.style.top=POS[i][1]+'%';b.style.setProperty('--c',COL[i]);b.style.animationDelay=(-i*0.7)+'s';stage.appendChild(b);L.push(b)}
 const spark=i=>{for(let k=0;k<7;k++){const s=el('i','ir2-sp');const a=Math.random()*Math.PI*2,r=34+Math.random()*30;s.style.left=POS[i][0]+'%';s.style.top=POS[i][1]+'%';s.style.setProperty('--dx',Math.cos(a)*r+'px');s.style.setProperty('--dy',Math.sin(a)*r+'px');s.style.background=COL[i];stage.appendChild(s);setTimeout(()=>s.remove(),800)}};
 const flash=async(i,ms)=>{L[i].classList.add('on');spark(i);tone(TONES[i],ms/1000*.9);await sleep(ms);L[i].classList.remove('on');await sleep(ms*.35)};
 const showDots=n=>{dots.innerHTML=Array.from({length:seq.length},(_,k)=>'<i class="'+(k<n?'ok':'')+'"></i>').join('')};
 let round=0,fails=0,slow=1;const lens=[4,6,8];let seq=[];
 const play=async()=>{area.querySelector('.ir2-st b').textContent='Runde '+(round+1)+' von 3';st2.textContent='Schau genau hin';stage.classList.add('busy');showDots(0);await sleep(700);for(const i of seq)await flash(i,520*slow);stage.classList.remove('busy');st2.textContent='Jetzt du!';pos=0};
 let pos=0;L.forEach((b,i)=>b.onclick=async()=>{if(stage.classList.contains('busy'))return;await flash(i,260);
  if(seq[pos]!==i){sfx('falsch',.6);stage.classList.add('shake');setTimeout(()=>stage.classList.remove('shake'),450);fails++;if(fails>=2&&slow===1){slow=1.6;toast('Ich spiele sie jetzt langsamer.')}return play()}
  pos++;showDots(pos);if(pos===seq.length){sfx('richtig',.7);round++;fails=0;st2.textContent='Richtig!';if(round>=3){L.forEach((x,k)=>setTimeout(()=>{x.classList.add('on');spark(k)},k*120));await sleep(1200);gameEnd();return done()}seq=mk(lens[round]);await sleep(700);play()}});
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
 const area=gameShell('Trank brauen','Holundas Reim:<br><i>Die Frostbeere, kalt wie Eis,<br>gleich danach der Glutpilz, heiß.<br>Die Eulenfeder, leicht und sacht,<br>wird nicht zuerst, nicht zuletzt gebracht.<br>Der Schneckenschleim, so zäh und alt,<br>muss vor die Beere, sonst knallt\'s halt.</i>');
 area.innerHTML='<div class="tr-kessel"><img src="'+A+'ui/kessel.png" alt=""><div class="tr-in"></div></div><div class="tr-row"></div><div class="hints tr-h"></div>';
 const row=area.querySelector('.tr-row'),inn=area.querySelector('.tr-in');let got=[];
 const tips=['Frostbeere und Glutpilz gehören zusammen. Wo im Kessel kann dieses Paar stehen?','Vor der Frostbeere muss noch Platz für den Schneckenschleim sein.','Frostbeere und Glutpilz kommen ganz zum Schluss: Schneckenschleim, Eulenfeder, Frostbeere, Glutpilz.'];let nt=0;
 const hb=area.querySelector('.tr-h');const drawH=()=>{hb.innerHTML=tips.map((t,i)=>'<button class="hint'+(i<nt?' open':'')+'"><span>'+(i===2?'Lösung':'Tipp '+(i+1))+'</span>'+(i<nt?t:i===nt?'Antippen zum Aufdecken':'')+'</button>').join('');[...hb.children].forEach((b,i)=>b.onclick=()=>{if(i===nt){nt++;drawH();readAloud(tips[i])}})};drawH();
 const draw=()=>{row.innerHTML='';Z.forEach(([k,n])=>{if(got.includes(k))return;const b=el('button','tr-z','<img src="'+A+'ui/z_'+k+'.png" alt=""><span>'+n+'</span>');b.onclick=()=>add(k);row.appendChild(b)});inn.innerHTML=got.map((k,i)=>'<span>'+(i+1)+'. '+Z.find(z=>z[0]===k)[1]+'</span>').join('')};
 const add=async k=>{got.push(k);sfx('platsch',.4);draw();if(got.length===4){if(got.join()===SOL.join()){sfx('zauber');await sleep(900);gameEnd();done()}else{sfx('puff');await sleep(500);gameEnd();await say('HEX','Das wächst raus. Meistens.',A+'vo/d12_puff.mp3');got=[];$('#card').classList.add('on');draw()}}};draw()});

// Tag 14: Höher oder tiefer. Hulda zeigt mit der Stricknadel, was stimmt. Ideal: vier richtig, eins falsch.
// Kartendeck der Banditen: eigene Farben aus Eldmark, Bildkarten mit Ornamenten
const KT_SUITS={flamme:{c:'#b3261e',p:'<path d="M20 2C25 10 33 15 33 25a13 13 0 0 1-26 0c0-6 3-9 6-14 1 4 3 6 5 6 0-6 0-10 2-15z"/><path d="M20 20c3 3 5 5 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9z" fill="#f2b33d"/>'},
 krone:{c:'#c8902e',p:'<path d="M4 29 6 11l7 8 7-12 7 12 7-8 2 18z"/><rect x="4" y="30" width="32" height="5" rx="1"/><circle cx="20" cy="21" r="2.6" fill="#b3261e"/>'},
 schwert:{c:'#3a4048',p:'<path d="M18.6 2h2.8l2.2 23h-7.2z" fill="#cfd6dc"/><path d="M10 25h20v3.4H10z"/><path d="M18.4 28.4h3.2v6h-3.2z" fill="#6b4321"/><circle cx="20" cy="36.5" r="2.6"/>'},
 mond:{c:'#2d5d8a',p:'<path d="M25 3a17 17 0 1 0 12 29A13.5 13.5 0 1 1 25 3z"/><circle cx="30" cy="12" r="1.6" fill="#f2d27a"/><circle cx="34" cy="19" r="1.1" fill="#f2d27a"/>'}};
const KT_PIPS={1:[[50,50]],2:[[50,8],[50,92]],3:[[50,8],[50,50],[50,92]],4:[[20,8],[80,8],[20,92],[80,92]],5:[[20,8],[80,8],[50,50],[20,92],[80,92]],
 6:[[20,8],[80,8],[20,50],[80,50],[20,92],[80,92]],7:[[20,8],[80,8],[50,30],[20,50],[80,50],[20,92],[80,92]],8:[[20,8],[80,8],[50,30],[20,50],[80,50],[50,70],[20,92],[80,92]],
 9:[[20,8],[80,8],[20,37],[80,37],[50,50],[20,63],[80,63],[20,92],[80,92]],10:[[20,8],[80,8],[50,23],[20,37],[80,37],[20,63],[80,63],[50,77],[20,92],[80,92]]};
const ktSym=(k,cls)=>'<svg class="'+cls+'" viewBox="0 0 40 40"><g fill="'+KT_SUITS[k].c+'" stroke="#1a0f06" stroke-width="1.4" stroke-linejoin="round">'+KT_SUITS[k].p+'</g></svg>';
const KT_NAME={1:'A'};
function ktFace(v,k){const idx='<div class="kt-ix"><b>'+(KT_NAME[v]||v)+'</b>'+ktSym(k,'kt-is')+'</div>';
 const pips=v===1?'<div class="kt-ace">'+ktSym(k,'kt-big')+'</div>':KT_PIPS[v].map(([x,y])=>'<i style="left:'+x+'%;top:'+y+'%"'+(y>50?' class="dn"':'')+'>'+ktSym(k,'kt-p')+'</i>').join('');
 return '<div class="kt-face"><svg class="kt-orn" viewBox="0 0 100 140" preserveAspectRatio="none"><path d="M50 46l9 24-9 24-9-24z" fill="none" stroke="#b8862f" stroke-width=".6" opacity=".35"/><circle cx="50" cy="70" r="'+(v===1?30:20)+'" fill="none" stroke="#b8862f" stroke-width="'+(v===1?1.2:.5)+'" opacity="'+(v===1?.8:.3)+'"'+(v===1?' stroke-dasharray="2 2"':'')+'/><rect x="5" y="5" width="90" height="130" rx="6" fill="none" stroke="#b8862f" stroke-width="1.6"/><rect x="8" y="8" width="84" height="124" rx="4" fill="none" stroke="#b8862f" stroke-width=".7"/>'+[[8,8,1,1],[92,8,-1,1],[8,132,1,-1],[92,132,-1,-1]].map(([x,y,a,b])=>'<path d="M'+x+' '+(y+b*14)+'q0 '+(-b*14)+' '+(a*14)+' '+(-b*14)+'" fill="none" stroke="#b8862f" stroke-width="1.2"/><circle cx="'+(x+a*4)+'" cy="'+(y+b*4)+'" r="1.6" fill="#b8862f"/>').join('')+'</svg>'+idx+idx.replace('kt-ix','kt-ix r')+'<div class="kt-pips">'+pips+'</div></div>'}
const KT_BACK='<div class="kt-backf"><svg viewBox="0 0 100 140" preserveAspectRatio="none"><defs><pattern id="ktl" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 5h10M5 0v10" stroke="#d9a845" stroke-width=".6" opacity=".55"/></pattern><radialGradient id="ktr" cx="50%" cy="45%"><stop offset="0" stop-color="#8e2a20"/><stop offset="1" stop-color="#4a0f0b"/></radialGradient></defs><rect width="100" height="140" fill="url(#ktr)"/><rect width="100" height="140" fill="url(#ktl)"/><rect x="5" y="5" width="90" height="130" rx="6" fill="none" stroke="#e2b552" stroke-width="2"/><rect x="9" y="9" width="82" height="122" rx="4" fill="none" stroke="#e2b552" stroke-width=".8"/><ellipse cx="50" cy="70" rx="27" ry="34" fill="#3a0b08" stroke="#e2b552" stroke-width="1.8"/><ellipse cx="50" cy="70" rx="22" ry="29" fill="none" stroke="#e2b552" stroke-width=".7"/><path d="M50 44l4.5 17 16 9-16 9L50 96l-4.5-17-16-9 16-9z" fill="#f2cf6a" stroke="#7a4f16" stroke-width="1"/><path d="M50 56l2.5 9.5 9 4.5-9 4.5L50 84l-2.5-9.5-9-4.5 9-4.5z" fill="#fff3c4"/>'+[[14,16],[86,16],[14,124],[86,124]].map(([x,y])=>'<path d="M'+x+' '+(y-5)+'l3 5-3 5-3-5z" fill="#e2b552"/>').join('')+'</svg></div>';
GAMES.karten=()=>new Promise(async done=>{hideBox();
 // Fünf Runden mit Abwechslung: normal, normal, Knorz mischt (Karte selbst ziehen), Hulda niest (kein Zeichen), doppelter Einsatz
 const SK=Object.keys(KT_SUITS);const suit=()=>SK[rnd(4)-1];
 const o=el('div','kt2','<div class="kt2-st"><div class="tk2-top"><div class="tk2-t">Höher oder tiefer</div><div class="kt2-pips">'+'<i></i>'.repeat(5)+'</div></div>'
  +'<div class="kt2-ppl"><div class="kt2-p hu"><div class="kt2-face"></div><b>Oma Hulda</b></div>'
  +'<div class="kt2-mid"><div class="kt2-r"></div><div class="kt2-cap"></div></div>'
  +'<div class="kt2-p kn"><div class="kt2-face"></div><b>Knorz</b></div></div>'
  +'<div class="kt2-nadel"><img src="'+A+'items/stricknadel.png" alt=""></div><div class="kt2-say"></div><div class="kt2-tab"></div><div class="kt2-btns"><button class="kt2-b up" data-h="1"><i></i>Höher</button><button class="kt2-b dn" data-h="0"><i></i>Tiefer</button></div><div class="kt2-stamp"></div></div>');
 document.body.appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));
 const $o=q=>o.querySelector(q),tab=$o('.kt2-tab'),cap=$o('.kt2-cap'),rd=$o('.kt2-r'),pips=[...o.querySelectorAll('.kt2-pips i')],nad=$o('.kt2-nadel'),stamp=$o('.kt2-stamp'),sayB=$o('.kt2-say');
 const face=(who,i)=>$o('.kt2-p.'+who+' .kt2-face').style.backgroundImage='url('+A+'img/p_'+(who==='hu'?'hu':'kno')+'_'+i+'.jpg)';face('hu',7);face('kn',5);
 const say=(who,t,vo)=>{sayB.className='kt2-say on '+who;sayB.textContent=t;if(vo)playVo(A+'vo/'+vo+'.mp3');clearTimeout(sayB._t);sayB._t=setTimeout(()=>sayB.classList.remove('on'),3200)};
 const card=(v,k,up)=>'<div class="kt-card'+(up?' up':'')+'"><div class="kt-in">'+ktFace(v,k)+KT_BACK+'</div></div>';
 let cur=rnd(10),cs=suit(),right=0;
 const nxt=c=>{let n;do{n=rnd(10)}while(n===c);return n};
 const btns=[...o.querySelectorAll('.kt2-b')];const ask=()=>new Promise(r=>{btns.forEach(b=>{b.disabled=false;b.onclick=()=>{sfx('ui_klick',.6);btns.forEach(x=>x.disabled=true);r(+b.dataset.h)}})});btns.forEach(b=>b.disabled=true);
 const zeig=el('div','kt2-zeig','<i></i><span></span>');o.querySelector('.kt2-st').appendChild(zeig);
 const hint=(up,show)=>{nad.className='kt2-nadel'+(show?' on '+(up?'up':'dn'):'');zeig.className='kt2-zeig'+(show?' on '+(up?'up':'dn'):'');zeig.querySelector('span').textContent=up?'höher':'tiefer';if(show){sfx('pergament',.35);cap.innerHTML='Hulda tippt mit der Nadel nach <b>'+(up?'oben':'unten')+'</b>.'}};
 for(let r=0;r<5;r++){
  pips.forEach((p,i)=>p.classList.toggle('jetzt',i===r));
  const mode=r===2?'misch':r===3?'nies':r===4?'doppelt':'';
  rd.textContent=['Runde 1','Runde 2','Runde 3: Knorz mischt','Runde 4: Hulda muss niesen','Letzte Runde: doppelter Einsatz'][r];
  hint(0,false);cap.textContent='';
  let nx,ns=suit();
  nx=nxt(cur);
  tab.innerHTML='<div class="kt2-cards">'+card(cur,cs,1)+'<div class="kt2-slot">'+card(nx,ns,0)+'</div></div>';
  tab.classList.remove('neu');void tab.offsetWidth;tab.classList.add('neu');sfx('pergament',.5);
  if(mode==='misch'){face('kn',7);say('kn','Diesmal mische ich. Such dir eine Karte aus.','kt_misch');tab.querySelector('.kt2-cards').classList.add('misch');const slot=tab.querySelector('.kt2-slot');
   const vals=[nx,nxt(cur),nxt(cur)];slot.innerHTML='<div class="kt2-fan">'+vals.map((v,i)=>'<button class="kt2-fc" data-i="'+i+'">'+card(v,suit(),0)+'</button>').join('')+'</div>';cap.textContent='Tippe auf eine der drei Karten.';
   const pick=await new Promise(res=>slot.querySelectorAll('.kt2-fc').forEach(b=>b.onclick=()=>{sfx('ui_klick',.6);res(+b.dataset.i)}));
   nx=vals[pick];slot.querySelectorAll('.kt2-fc').forEach((b,i)=>b.classList.add(i===pick?'gew':'weg'));await sleep(600);slot.innerHTML=card(nx,ns,0);tab.querySelector('.kt2-cards').classList.remove('misch');await sleep(250);face('kn',5)}
  if(mode==='nies'){face('hu',4);say('hu','Hatschi! Oh, meine Nadel ist runtergefallen.','kt_nies');nad.className='kt2-nadel fall';cap.textContent='Diesmal kein Zeichen. Schau auf die Karte und rate selbst.';await sleep(1400);face('hu',5)}
  else{if(mode==='doppelt'){sfx('trommel',.7);face('kn',4);say('kn','Doppelter Einsatz. Jetzt gilt es.','kt_doppelt');await sleep(900);if(right===4){face('hu',7);await sleep(1600);say('hu','Kindchen, lass ihn doch auch mal gewinnen.','kt_hu_lass');await sleep(600)}}
   face('hu',7);await sleep(400);hint(nx>cur,true)}
  const h=await ask();const ok=h===(nx>cur?1:0);
  const slot=tab.querySelector('.kt2-slot .kt-card');slot.classList.add('up');sfx('pergament',.6);await sleep(650);
  if(ok){right++;stamp.className='kt2-stamp on gut';stamp.innerHTML='<b>Richtig!</b><span>'+nx+' ist '+(nx>cur?'höher':'tiefer')+' als '+cur+'</span>';sfx('muenzen',.7);face('kn',8);face('hu',2);pips[r].className='gut';
   if(right<5)say('kn',['Schon wieder.','Das kann doch nicht wahr sein.','Ich hasse Karten.','Nein. Nein, nein, nein.'][Math.min(3,right-1)],['kt_l1','kt_l2','kt_l3','kt_l4'][Math.min(3,right-1)])}
  else{stamp.className='kt2-stamp on falsch';stamp.innerHTML='<b>Daneben!</b><span>'+nx+' ist '+(nx>cur?'höher':'tiefer')+' als '+cur+'</span>';sfx('daneben',.7);face('kn',3);face('hu',2);pips[r].className='falsch';say('kn','Ja! Endlich! Ich hab gewonnen!','kt_w1');tab.querySelector('.kt2-slot').classList.add('wackel')}
  await sleep(1900);stamp.className='kt2-stamp';cur=nx;cs=ns}
 pips.forEach(p=>p.classList.remove('jetzt'));
 const end=el('div','kt2-end','<div class="kt2-endc"><div class="cc-k">Ergebnis</div><h3>'+right+' von 5 richtig</h3><p>'+(right===4?'Perfekt! Knorz durfte genau einmal gewinnen.':right===5?'Alles richtig. Knorz hat kein einziges Mal gewonnen.':'Knorz hat '+(5-right)+' Mal gewonnen. Er strahlt.')+'</p><button class="pbtn">Weiter</button></div>');o.querySelector('.kt2-st').appendChild(end);requestAnimationFrame(()=>end.classList.add('on'));sfx(right===4?'jubel_kurz':'richtig',.7);
 await new Promise(r=>end.querySelector('button').onclick=r);sfx('ui_klick',.5);
 st.flags.karten=right;save();o.classList.remove('on');await sleep(450);o.remove();done()});

// Tag 16: Schlösser knacken wie ein Profi. Dietrich ansetzen, Zylinder drehen, nicht zu viel Druck.
// Drei Schlösser: Messing, Banditeneisen, Drachensilber. Mechanik bleibt gleich, nur das Aussehen wechselt.
const screw=(x,y,r,c1,c2,a)=>'<g transform="translate('+x+' '+y+') rotate('+a+')"><circle r="'+r+'" fill="'+c1+'" stroke="#1a0f06" stroke-width="2.5"/><circle r="'+(r*.72)+'" fill="'+c2+'" opacity=".55"/><path d="M-'+(r*.7)+' 0H'+(r*.7)+'" stroke="#1a0f06" stroke-width="'+(r*.32)+'" stroke-linecap="round"/></g>';
const rivet=(x,y,r,c)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'" stroke="#120a05" stroke-width="2"/><circle cx="'+(x-r*.3)+'" cy="'+(y-r*.3)+'" r="'+(r*.35)+'" fill="#fff" opacity=".35"/>';
const LKSK=[
{n:'Messing',bg:'messing',plate:'<svg viewBox="0 0 300 300" class="lk-plate"><defs><radialGradient id="lkg0" cx="38%" cy="30%"><stop offset="0" stop-color="#fbe3a0"/><stop offset=".45" stop-color="#d6a23e"/><stop offset="1" stop-color="#6e4612"/></radialGradient><linearGradient id="lkb0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2c4" stop-opacity=".7"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>'
 +'<path d="M150 10c56 0 98 32 110 74 14 46-6 76-6 114 0 42-48 90-104 90S46 240 46 198c0-38-20-68-6-114C52 42 94 10 150 10z" fill="url(#lkg0)" stroke="#1a0f06" stroke-width="8"/>'
 +'<path d="M150 24c48 0 84 28 94 64 12 40-6 68-6 108 0 36-40 76-88 76s-88-40-88-76c0-40-18-68-6-108 10-36 46-64 94-64z" fill="none" stroke="#7a4f16" stroke-width="2.5" opacity=".8"/>'
 +'<path d="M150 18c52 0 90 30 101 68" fill="none" stroke="url(#lkb0)" stroke-width="6"/>'
 +['M96 64c-14 6-22 18-20 32 4-10 12-16 22-18','M204 64c14 6 22 18 20 32-4-10-12-16-22-18','M84 214c4 18 18 30 34 34-10-8-16-18-16-30','M216 214c-4 18-18 30-34 34 10-8 16-18 16-30','M130 34c6-8 14-10 20-10s14 2 20 10c-8-4-14-4-20-4s-12 0-20 4z'].map(d=>'<path d="'+d+'" fill="none" stroke="#5a3a0e" stroke-width="3" stroke-linecap="round"/>').join('')
 +[[96,96],[204,96],[96,206],[204,206]].map(([x,y],i)=>'<circle cx="'+x+'" cy="'+y+'" r="4" fill="#5a3a0e"/>').join('')
 +screw(150,46,9,'#c9922f','#fbe3a0',20)+screw(150,258,9,'#c9922f','#fbe3a0',-35)+screw(66,152,8,'#c9922f','#fbe3a0',60)+screw(234,152,8,'#c9922f','#fbe3a0',5)+'</svg>',
 core:['#b9852e','#e6b860','#7a4f16'],pick:['#6b3f1c','#c9922f'],ring:'#e6b860'},
{n:'Banditeneisen',bg:'eisen',plate:'<svg viewBox="0 0 300 300" class="lk-plate"><defs><linearGradient id="lkg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7d858c"/><stop offset=".5" stop-color="#4a5056"/><stop offset="1" stop-color="#25292d"/></linearGradient><radialGradient id="lkr1" cx="50%" cy="50%"><stop offset="0" stop-color="#9a4b1c" stop-opacity=".9"/><stop offset="1" stop-color="#9a4b1c" stop-opacity="0"/></radialGradient></defs>'
 +'<rect x="26" y="26" width="248" height="248" rx="26" fill="url(#lkg1)" stroke="#120a05" stroke-width="8"/>'
 +'<rect x="40" y="40" width="220" height="220" rx="16" fill="none" stroke="#2a2e32" stroke-width="3"/><path d="M42 44h214" stroke="#a9b1b8" stroke-width="3" opacity=".5"/>'
 +[[70,230,22],[236,78,16],[214,248,12],[56,90,10],[250,190,14]].map(([x,y,r])=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="url(#lkr1)"/>').join('')
 +[[52,52],[150,44],[248,52],[52,150],[248,150],[52,248],[150,256],[248,248]].map(([x,y])=>rivet(x,y,9,'#5d646a')).join('')
 +'<path d="M150 64l18 22h-36z" fill="#2a2e32" stroke="#120a05" stroke-width="3"/><path d="M118 238h64" stroke="#2a2e32" stroke-width="6" stroke-linecap="round"/><path d="M128 250h44" stroke="#2a2e32" stroke-width="4" stroke-linecap="round"/>'
 +'<path d="M78 120l-10-8M80 132l-14-2M222 120l10-8M220 132l14-2" stroke="#1d2125" stroke-width="3" stroke-linecap="round"/></svg>',
 core:['#4f565c','#8b949b','#24282c'],pick:['#3b2a1c','#7d858c'],ring:'#8b949b'},
{n:'Drachensilber',bg:'drache',plate:'<svg viewBox="0 0 300 300" class="lk-plate"><defs><radialGradient id="lkg2" cx="40%" cy="32%"><stop offset="0" stop-color="#f4f8fb"/><stop offset=".5" stop-color="#a9bccb"/><stop offset="1" stop-color="#3f5566"/></radialGradient><pattern id="lks2" width="18" height="12" patternUnits="userSpaceOnUse"><path d="M0 12a9 9 0 0 1 18 0" fill="none" stroke="#3f5566" stroke-width="1.6" opacity=".6"/><path d="M-9 6a9 9 0 0 1 18 0M9 6a9 9 0 0 1 18 0" fill="none" stroke="#3f5566" stroke-width="1.6" opacity=".6"/></pattern></defs>'
 +'<path d="M150 6l40 30 50 4 12 48 34 36-22 44 6 50-44 22-26 40-50-14-50 14-26-40-44-22 6-50-22-44 34-36 12-48 50-4z" fill="url(#lkg2)" stroke="#16222c" stroke-width="7" stroke-linejoin="round"/>'
 +'<circle cx="150" cy="152" r="104" fill="url(#lks2)" stroke="#3f5566" stroke-width="3"/><circle cx="150" cy="152" r="104" fill="none" stroke="#e8f0f6" stroke-width="1.5" opacity=".6"/>'
 +'<path d="M150 18l10 16h-20z" fill="#b3261e" stroke="#16222c" stroke-width="3"/><circle cx="150" cy="36" r="9" fill="#d8342a" stroke="#16222c" stroke-width="3"/><circle cx="147" cy="33" r="3" fill="#fff" opacity=".7"/>'
 +'<path d="M60 112c-18-30-6-58 20-70-8 18-6 34 6 46-10-2-18 4-26 24zM240 112c18-30 6-58-20-70 8 18 6 34-6 46 10-2 18 4 26 24z" fill="#c9d6df" stroke="#16222c" stroke-width="3" stroke-linejoin="round"/>'
 +'<path d="M66 100l12-34M80 104l8-30M234 100l-12-34M220 104l-8-30" stroke="#3f5566" stroke-width="2"/>'
 +[[94,262],[206,262]].map(([x,y])=>rivet(x,y,8,'#9fb2c1')).join('')+'</svg>',
 core:['#8da2b2','#e8f0f6','#3f5566'],pick:['#5a2a1c','#c9d6df'],ring:'#e8f0f6'}];
const lkCore=k=>'<svg viewBox="0 0 100 100"><defs><radialGradient id="lkc'+k+'" cx="40%" cy="35%"><stop offset="0" stop-color="'+LKSK[k].core[1]+'"/><stop offset="1" stop-color="'+LKSK[k].core[0]+'"/></radialGradient></defs><circle cx="50" cy="50" r="47" fill="'+LKSK[k].core[2]+'" stroke="#1a0f06" stroke-width="5"/>'+Array.from({length:24},(_,i)=>{const a=i*15*Math.PI/180;return '<path d="M'+(50+Math.cos(a)*40).toFixed(1)+' '+(50+Math.sin(a)*40).toFixed(1)+'L'+(50+Math.cos(a)*45).toFixed(1)+' '+(50+Math.sin(a)*45).toFixed(1)+'" stroke="'+LKSK[k].ring+'" stroke-width="2"/>'}).join('')+'<circle cx="50" cy="50" r="38" fill="url(#lkc'+k+')" stroke="#1a0f06" stroke-width="3"/><circle cx="50" cy="50" r="30" fill="none" stroke="'+LKSK[k].ring+'" stroke-width="2" opacity=".8"/><path d="M50 22a12 12 0 0 1 7 22l5 30H38l5-30a12 12 0 0 1 7-22z" fill="#100802" stroke="#1a0f06" stroke-width="2"/><path d="M46 46l-3 24" stroke="#3a2a1a" stroke-width="2" opacity=".7"/></svg>';
const lkPick=k=>{const [h,f]=LKSK[k].pick;return '<svg viewBox="0 0 320 40" class="lk-pk"><defs><linearGradient id="lkst'+k+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f5f7"/><stop offset=".5" stop-color="#aab3ba"/><stop offset="1" stop-color="#6c757c"/></linearGradient><linearGradient id="lkh'+k+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+h+'" stop-opacity=".7"/><stop offset=".4" stop-color="'+h+'"/><stop offset="1" stop-color="#1a0f06"/></linearGradient></defs><rect x="0" y="9" width="112" height="22" rx="9" fill="url(#lkh'+k+')" stroke="#1a0f06" stroke-width="3.5"/>'+[18,34,50,66,82].map(x=>'<path d="M'+x+' 13c4 5 4 9 0 14" fill="none" stroke="#1a0f06" stroke-width="1.6" opacity=".45"/>').join('')+'<rect x="100" y="7" width="20" height="26" rx="4" fill="'+f+'" stroke="#1a0f06" stroke-width="3"/><path d="M104 11v18M110 11v18" stroke="#1a0f06" stroke-width="1.4" opacity=".5"/><rect x="118" y="15.5" width="180" height="9" rx="2" fill="url(#lkst'+k+')" stroke="#1a0f06" stroke-width="2.6"/><path d="M296 16 l14 -10 l4 4 l-12 14 z" fill="url(#lkst'+k+')" stroke="#1a0f06" stroke-width="2.6" stroke-linejoin="round"/><path d="M124 18h168" stroke="#fff" stroke-width="1.2" opacity=".7"/></svg>'};
const lkWr=k=>'<svg viewBox="0 0 160 60" class="lk-wr"><defs><linearGradient id="lkw'+k+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9dfe3"/><stop offset="1" stop-color="#7d868d"/></linearGradient></defs><path d="M4 8 h20 v34 h130 v12 H4z" fill="url(#lkw'+k+')" stroke="#1a0f06" stroke-width="3.5" stroke-linejoin="round"/>'+[40,52,64,76,88,100,112,124,136].map(x=>'<path d="M'+x+' 44v8" stroke="#1a0f06" stroke-width="1.6" opacity=".55"/>').join('')+'<path d="M8 12v28" stroke="#fff" stroke-width="1.5" opacity=".6"/></svg>';
function lockSnd(k){const c=ac(),t=c.currentTime;if(k==='tick')hit(t,5200,.03,.25,'bandpass');if(k==='pin'){hit(t,3400,.05,.5,'bandpass');hit(t+.045,2200,.05,.35,'bandpass')}if(k==='snap'){hit(t,6500,.12,.6,'highpass');hit(t,900,.2,.3,'lowpass')}if(k==='open'){hit(t,1500,.09,.5,'bandpass');hit(t+.11,420,.25,.5,'lowpass');hit(t+.3,260,.5,.35,'lowpass')}}
function lockpick(o){return new Promise(res=>{const STAGES=o.stages||3,SPAN=30,tol=o.easy?10:6;let picks=5,health=1,stage=0,rot=0,ang=0,hold=false,last=performance.now(),raf=0,sweet=[],openF=false,lastTick=0,shake=0;
 for(let i=0;i<STAGES;i++){let v;do{v=Math.round(Math.random()*130-65)}while(i&&Math.abs(v-sweet[i-1])<25);sweet.push(v)}
 const area=o.area;const sk=(o.skin??0)%LKSK.length;area.innerHTML='<div class="lk"><div class="lk-st" data-sk="'+LKSK[sk].bg+'"><div class="lk-wood"></div>'+LKSK[sk].plate+'<div class="lk-core">'+lkCore(sk)+'<div class="lk-wrw">'+lkWr(sk)+'</div></div><div class="lk-pv">'+lkPick(sk)+'</div><div class="lk-pins">'+Array.from({length:STAGES},()=>'<i></i>').join('')+'</div><div class="lk-msg"></div><div class="lk-box">'+o.label+'</div></div><div class="lk-ui"><div class="lk-c"><span>Dietriche</span><b class="lk-n"></b></div><button class="lk-turn">Halten<br><small>zum Drehen</small></button><div class="lk-c"><span>Stifte</span><b class="lk-s"></b></div></div></div>';
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
 for(let i=0;i<3;i++){await lockpick({area,stages:L[i],easy,skin:i,label:'Kiste '+(i+1)+' von 3'})}
 gameEnd();done()});

// Tag 15: Der Laden in Goldhafen
GAMES.laden=()=>new Promise(done=>{
 const W=[['htklein',6],['htmittel',12],['htgross',20],['mut',8],['rauch',10],['wetzstein',9],['stange',5]];const sold=st.flags.ladenSold||(st.flags.ladenSold=[]);
 const area=gameShell('Frostkauf<small class="shop-slogan">Alles außer Drachennahrung</small>','Tippe an, was du kaufen möchtest. Jede Ware gibt es nur einmal.');
 const draw=()=>{const left=W.filter(([id])=>!sold.includes(id));area.innerHTML='<div class="inv-gold">'+UI('gold')+' '+st.gold+' Gold</div><div class="shop">'+(left.length?left.map(([id,p])=>'<button class="shop-it" data-id="'+id+'" data-p="'+p+'"'+(st.gold<p?' disabled':'')+'><img src="'+A+'items/'+id+'.png" alt=""><b>'+ITEMS[id].n+'</b><span>'+p+' Gold</span></button>').join(''):'<p class="shop-leer">Ausverkauft. Bob ist sehr zufrieden.</p>')+'</div><button class="pbtn big shop-done">Fertig</button>';
  area.querySelectorAll('.shop-it').forEach(b=>b.onclick=()=>{const p=+b.dataset.p,id=b.dataset.id;if(st.gold<p||b.classList.contains('weg'))return;st.gold-=p;const ex=st.inv.find(x=>x.id===id);if(ex)ex.n=(ex.n||1)+1;else st.inv.push({id,n:1});sold.push(id);save();sfx('muenzen',.7);toast(ITEMS[id].n+' gekauft');renderHud();b.classList.add('weg');setTimeout(draw,520)});
  area.querySelector('.shop-done').onclick=()=>{gameEnd();done()}};draw()});

// Tag 20: Der Sturm. Die Gruppe läuft in einer Reihe hinter Grumbold den Grat hinauf. Windböen fegen von oben durch vier Spuren, tippe eine Spur an, um auszuweichen.
GAMES.sturm=(s)=>new Promise(done=>{const sc=$('#s-scene');const L=[.14,.38,.62,.86];
 const mem=['gr','hu','zi','na'].filter(k=>k==='gr'||(st.party||[]).includes(k));const line=[...mem.map(k=>({k,src:A+'img/b_'+k+'_0.png'})),{k:'held',src:A+'img/b_'+st.hero.cls+'_'+st.hero.look+'_0.png'}];
 const o=el('div','pg sw','<div class="sw-bg"></div><div class="sw-lanes">'+L.map((x,i)=>'<div class="sw-lane" data-l="'+i+'" style="left:'+(x*100)+'%"></div>').join('')+'</div><div class="pg-top">Weiche den Windböen aus</div><div class="sw-hud"><span class="sw-c">Böe 0 von 18</span><span class="sw-life"></span></div><div class="sw-help">Tippe eine Spur an. Die ganze Gruppe folgt Grumbold.</div>');sc.appendChild(o);
 const bg=o.querySelector('.sw-bg');{const im=new Image();im.onload=()=>{bg.style.backgroundImage='url('+A+'img/sw_grat.jpg)'};im.onerror=()=>{bg.style.backgroundImage='url('+A+'img/ort20.jpg)'};im.src=A+'img/sw_grat.jpg'}o.appendChild(el('div','sw-snow'));
 const P=line.map((m,i)=>{const d=el('div','sw-m'+(i===0?' lead':''),'<img src="'+m.src+'" alt="">');o.appendChild(d);return {d,lane:1,y:.5+i*.095,sc:i===0?1.25:.78+i*.04}});
 let lane=1,lives=3,hits=0,n=0,total=18,speed=.42,run=true,gusts=[],last=performance.now(),spawnT=0,inv=0;
 const life=()=>{o.querySelector('.sw-life').innerHTML='<i class="on"></i><i class="'+(lives>1?'on':'')+'"></i><i class="'+(lives>2?'on':'')+'"></i>'};life();
 const place=()=>{const W=o.clientWidth,H=o.clientHeight;P.forEach((p,i)=>{const s=Math.min(W*.26,H*.14)*p.sc;p.d.style.width=s+'px';p.d.style.left=(L[p.lane]*W)+'px';p.d.style.top=(p.y*H)+'px';p.d.style.zIndex=10+i})};
 const move=l=>{if(!run||l===lane)return;lane=l;sfx('schritte_schnee',.4);P.forEach((p,i)=>setTimeout(()=>{p.lane=l;place()},i*90))};
 o.querySelectorAll('.sw-lane').forEach(e=>e.addEventListener('pointerdown',ev=>{ev.preventDefault();move(+e.dataset.l)}));
 let sx=null;o.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});o.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)move(Math.max(0,Math.min(3,lane+(dx>0?1:-1))));sx=null},{passive:true});
 const spawn=()=>{n++;o.querySelector('.sw-c').textContent='Böe '+Math.min(n,total)+' von '+total;let ls=[Math.floor(Math.random()*4)];if(n>6&&Math.random()<.45){let b;do{b=Math.floor(Math.random()*4)}while(b===ls[0]);ls.push(b)}if(n>12&&Math.random()<.3){let c;do{c=Math.floor(Math.random()*4)}while(ls.includes(c));ls.push(c)}
  ls.forEach(l=>{const w=el('div','sw-g','<img src="'+A+'img/sw_gust.png" alt="">');o.appendChild(w);const warn=el('div','sw-warn');warn.style.left=(L[l]*100)+'%';o.appendChild(warn);setTimeout(()=>warn.remove(),900);gusts.push({w,l,y:-.18,hit:false})});sfx('wind_boe',.45)};
 const lay=()=>place();addEventListener('resize',lay);place();
 const tick=t=>{if(!run)return;const dt=Math.min(.05,(t-last)/1000);last=t;spawnT-=dt;const W=o.clientWidth,H=o.clientHeight;if(bg.classList.contains('tile'))bg.style.backgroundPositionY=((t/30)%(W*16/9))+'px';
  if(spawnT<=0&&n<total){spawn();spawnT=Math.max(1.05,1.9-n*.05)}
  gusts.forEach(g=>{g.y+=speed*dt*(1+n*.02);g.w.style.left=(L[g.l]*W)+'px';g.w.style.top=(g.y*H)+'px';
   if(!g.hit&&g.l===P[0].lane&&g.y>P[0].y-.09&&g.y<P[0].y+.02&&inv<=0){g.hit=true;hits++;lives--;inv=.9;life();sfx('wind_boe',.9);o.classList.add('hit');setTimeout(()=>o.classList.remove('hit'),450);toast(['Zirpia: Ich fliiiege!','Hulda: Meine Frisur!','Nachtigall: Ich hasse Wetter.','Grumbold: Ich stehe. Ich stehe noch.'][hits%4],1800)}});
  inv-=dt;gusts=gusts.filter(g=>{if(g.y>1.1){g.w.remove();return false}return true});
  if(lives<=0){run=false;fin(false);return}
  if(n>=total&&!gusts.length){run=false;fin(true);return}
  requestAnimationFrame(tick)};
 const fin=async ok=>{removeEventListener('resize',lay);gusts.forEach(g=>g.w.remove());if(ok){sfx('richtig');toast(hits?'Geschafft! Nur '+hits+(hits===1?' Böe':' Böen')+' erwischt.':'Geschafft! Keine einzige Böe hat euch erwischt.',4000);await sleep(900);o.classList.add('out');setTimeout(()=>o.remove(),500);done(hits)}
  else{sfx('falsch',.6);toast('Grumbold: Noch einmal. Ich stelle mich breiter hin.',3500);await sleep(1800);lives=3;hits=0;n=0;speed=Math.max(.3,speed-.05);gusts=[];spawnT=1.2;life();run=true;last=performance.now();requestAnimationFrame(tick)}};
 setTimeout(()=>{last=performance.now();spawnT=1.4;requestAnimationFrame(tick)},900)});

// Tag 23: Schlachtplan. Wer geht in welcher Phase voran, mit welchem Gegenstand?
const PHASEN=[['Der Drache erhebt sich','hu','stahlnetz'],['Die Aschenschuppen','gr','glutstein'],['Der Aschesturm','zi','wiegenlied'],['Der Schatten','na','schattenschluessel'],['Das Herz','held','sonnenkerze']];
GAMES.plan=()=>new Promise(done=>{hideBox();
 // Nachtigall legt den Plan auf den Tisch: Figur antippen, dann die Phase, in der sie vorangeht
 const who=[['held',heroName(),heroImg()],['gr','Grumbold',A+'img/k_gr.jpg'],['zi','Zirpia',A+'img/k_zi.jpg'],['hu','Oma Hulda',A+'img/k_hu.jpg'],['na','Nachtigall',A+'img/k_na.jpg']];
 const W=Object.fromEntries(who.map(w=>[w[0],w]));const plan={...(st.flags.plan||{})};let sel=null;
 const help='Tippe eine Figur an und dann die Phase, in der sie vorangeht. Trag ein, was auf deinem Druckblatt steht.';
 const o=el('div','pg plt plt2','<div class="pg-img" style="background-image:url('+A+'img/ort23.jpg)"></div><div class="plt-board" style="background-image:url('+A+'img/plan_tisch.jpg)">'
  +'<div class="plt-hb"></div><div class="plt-trayw"><div class="plt-tl">Wer geht voran?</div><div class="plt-tray">'+who.map(w=>'<button class="plt-tok" data-k="'+w[0]+'"><i style="background-image:url('+w[2]+')"></i><span>'+esc(w[1])+'</span></button>').join('')+'</div></div>'
  +'<div class="plt-paper"><div class="plt-h">Schlachtplan<small>für die Lichternacht</small></div>'+PHASEN.map((p,i)=>'<button class="plt-row" data-i="'+i+'"><span class="plt-n"><b>'+(i+1)+'.</b> '+esc(p[0])+'</span><span class="plt-dots"></span><span class="plt-slot"></span></button>').join('')
  +'</div>'
  +'<div class="plt-foot"><button class="pbtn big pl-go">Plan festlegen</button></div></div><div class="bg-help plt-help">'+help+'</div>');
 $('#s-scene').appendChild(o);setTimeout(()=>readAloud(help),400);
 const tips=['Jeder Gefährte hat genau einen besonderen Gegenstand bekommen. Wer hat welchen?','Lies Nachtigalls Hinweise: Welcher Gegenstand passt zu welcher Phase?','Hulda mit dem Netz, Grumbold mit dem Glutstein, Zirpia mit dem Wiegenlied, Nachtigall mit dem Schattenschlüssel, du mit Sonnenkerze und Herzjuwel.'];let nt=0;
 const hb=o.querySelector('.plt-hb');const dH=()=>{hb.innerHTML=tips.map((t,i)=>'<button class="plt-tip'+(i<nt?' open':'')+'"'+(i>nt?' disabled':'')+'>'+(i===2?'Lösung':'Tipp '+(i+1))+'</button>').join('');[...hb.children].forEach((b,i)=>b.onclick=()=>{if(i>nt)return;if(i===nt){nt++;dH()}toast(tips[i],6000);readAloud(tips[i])})};dH();
 const draw=()=>{o.querySelectorAll('.plt-row').forEach(r=>{const k=plan[r.dataset.i];const sl=r.querySelector('.plt-slot');sl.innerHTML=k?'<i style="background-image:url('+W[k][2]+')"></i><span>'+esc(W[k][1])+'</span>':'<em>wer?</em>';r.classList.toggle('set',!!k);r.classList.toggle('aim',!!sel)});
  const used=Object.values(plan);o.querySelectorAll('.plt-tok').forEach(t=>{t.classList.toggle('sel',t.dataset.k===sel);t.classList.toggle('used',used.includes(t.dataset.k))})};
 o.querySelectorAll('.plt-tok').forEach(t=>t.onclick=()=>{sfx('ui_klick',.5);sel=sel===t.dataset.k?null:t.dataset.k;draw()});
 o.querySelectorAll('.plt-row').forEach(r=>r.onclick=()=>{const i=r.dataset.i;if(sel){Object.keys(plan).forEach(j=>{if(plan[j]===sel)delete plan[j]});plan[i]=sel;sel=null;sfx('pergament',.5)}else if(plan[i]){delete plan[i];sfx('ui_klick',.4)}else{toast('Tippe zuerst oben eine Figur an.');return}draw()});
 draw();
 o.querySelector('.pl-go').onclick=async()=>{if(PHASEN.some((x,i)=>!plan[i]))return toast('Bitte jede Phase besetzen.');
  const p={};PHASEN.forEach((x,i)=>p[i]=plan[i]);st.flags.plan=p;save();sfx('buch_zu',.6);const ok=PHASEN.every((x,i)=>p[i]===x[1]);o.classList.add('out');await sleep(500);o.remove();if(!ok)await say('SL','Bist du sicher? Ich frag ja nur.',A+'vo/d23_plan.mp3');done()}});

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

// Tag 24: Der Schatz mit der Nachricht des Schenkenden. Erst der Hort mit funkelndem Gold, dann der Brief, dann das Abzeichen mit Frohe Weihnachten.
GAMES.schatz=()=>new Promise(async done=>{hideBox();const g=GIFT||{};
 const msg=g.msg?esc(g.msg).replace(/\n/g,'<br>'):'Frohe Lichternacht! Du hast Eldmark gerettet.';
 const o=el('div','sz','<div class="sz-st"><div class="sz-img"></div><div class="sz-licht"></div><canvas class="sz-cv"></canvas><div class="sz-t"><b>Der Schatz des Hüters</b><span>Tippe auf die Truhe</span></div></div>');
 document.body.appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));sfx('truhe',.8);
 const stg=o.querySelector('.sz-st'),cv=o.querySelector('.sz-cv'),cx=cv.getContext('2d');
 // Goldstaub und Funken, beim Antippen ein Münzregen aus der Truhe
 const P=[];let raf=0,t0=performance.now();const CH={x:.56,y:.6};
 const size=()=>{cv.width=stg.clientWidth*2;cv.height=stg.clientHeight*2};size();addEventListener('resize',size);
 for(let i=0;i<70;i++)P.push({k:'d',x:Math.random(),y:Math.random(),v:.01+Math.random()*.03,a:Math.random()*6,r:1+Math.random()*2.4});
 const coin=n=>{for(let i=0;i<n;i++){const a=-Math.PI/2+(Math.random()-.5)*1.6,v=.35+Math.random()*.5;P.push({k:'c',x:CH.x,y:CH.y,vx:Math.cos(a)*v*.5,vy:Math.sin(a)*v,rot:Math.random()*6,vr:(Math.random()-.5)*14,life:1.6+Math.random()*.8,r:6+Math.random()*7})}};
 let last=t0;const tick=t=>{raf=requestAnimationFrame(tick);const dt=Math.min(.05,(t-last)/1000);last=t;const W=cv.width,H=cv.height;cx.clearRect(0,0,W,H);
  for(let i=P.length-1;i>=0;i--){const q=P[i];
   if(q.k==='d'){q.y-=q.v*dt;q.x+=Math.sin(t/900+q.a)*.0006;if(q.y<-.02){q.y=1.02;q.x=Math.random()}const tw=.5+.5*Math.sin(t/300+q.a*3);cx.globalCompositeOperation='lighter';const gr=cx.createRadialGradient(q.x*W,q.y*H,0,q.x*W,q.y*H,q.r*5);gr.addColorStop(0,'rgba(255,236,170,'+(.55*tw)+')');gr.addColorStop(1,'rgba(255,200,90,0)');cx.fillStyle=gr;cx.beginPath();cx.arc(q.x*W,q.y*H,q.r*5,0,7);cx.fill();cx.globalCompositeOperation='source-over'}
   else{q.life-=dt;if(q.life<=0){P.splice(i,1);continue}q.vy+=1.1*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.rot+=q.vr*dt;const sx=Math.abs(Math.cos(q.rot));cx.save();cx.translate(q.x*W,q.y*H);cx.scale(Math.max(.15,sx),1);cx.fillStyle='#f6c64a';cx.strokeStyle='#8a5a12';cx.lineWidth=2.5;cx.beginPath();cx.arc(0,0,q.r*2,0,7);cx.fill();cx.stroke();cx.fillStyle='rgba(255,250,220,.8)';cx.beginPath();cx.arc(-q.r*.6,-q.r*.6,q.r*.6,0,7);cx.fill();cx.restore()}}};
 raf=requestAnimationFrame(tick);
 await new Promise(r=>{stg.onclick=()=>{stg.onclick=null;r()}});
 o.querySelector('.sz-t').classList.add('weg');sfx('muenzen',.9);coin(40);setTimeout(()=>{coin(30);sfx('muenzen',.7)},350);setTimeout(()=>sfx('fanfare',.6),500);stg.classList.add('glanz');
 await sleep(1400);
 // Der Brief entrollt sich
 const br=el('div','sz-brief','<div class="sz-rolle"><div class="cc-k">Für '+heroName()+'</div><div class="brief">'+msg+(g.von?'<p class="sig">'+esc(g.von)+'</p>':'')+'</div>'+(g.ort?'<div class="cc-k" style="margin-top:12px">Im zweiten Fach liegt ein Zettel</div><p>'+esc(g.ort)+'</p>':'')+'<button class="pbtn">Weiter</button></div>');stg.appendChild(br);requestAnimationFrame(()=>br.classList.add('on'));sfx('pergament',.7);
 await new Promise(r=>br.querySelector('button').onclick=r);sfx('ui_klick',.5);br.classList.remove('on');await sleep(400);br.remove();
 // Abzeichen: Retter der Lichternacht, Schnee, Lichtstrahlen, Frohe Weihnachten
 const kl=st.hero.f?CLS[st.hero.cls].nf:CLS[st.hero.cls].n;
 const md=el('div','sz-md','<div class="sz-rays"></div><div class="sz-schnee"></div><div class="sz-in"><img class="sz-med" src="'+A+'ui/medaille_neu.png" alt="" onerror="this.onerror=null;this.src=\''+A+'ui/medaille.png\'"><div class="cc-k">Abzeichen</div><h2>Retter der Lichternacht</h2><p>'+heroName()+', '+kl+' der Stufe '+st.lvl+'</p><div class="sz-ppl">'+['held','gr','zi','hu','na'].map(k=>'<i style="background-image:url('+(k==='held'?heroImg():A+'img/k_'+k+'.jpg')+')"></i>').join('')+'</div><div class="sz-fw">Frohe Weihnachten!</div><button class="pbtn">Weiter</button></div>');
 stg.appendChild(md);const sn=md.querySelector('.sz-schnee');for(let i=0;i<40;i++){const f=el('i');f.style.left=Math.random()*100+'%';f.style.animationDelay=(-Math.random()*8)+'s';f.style.animationDuration=(5+Math.random()*5)+'s';f.style.width=f.style.height=(3+Math.random()*5)+'px';sn.appendChild(f)}
 requestAnimationFrame(()=>md.classList.add('on'));sfx('stufenaufstieg',.8);setTimeout(()=>{fx('magic',md.querySelector('.sz-med'),300);sfx('jubel_kurz',.5)},900);
 st.flags.badge=1;save();
 await new Promise(r=>md.querySelector('button').onclick=r);sfx('ui_klick',.5);
 cancelAnimationFrame(raf);removeEventListener('resize',size);o.classList.remove('on');await sleep(500);o.remove();done()});

// Tag 2: Hütchenspiel des Wirts. Kompass unter einem Becher, drei Runden, immer schneller.
GAMES.becher=()=>new Promise(done=>{
 const area=gameShell('Das Becherspiel','Merk dir, unter welchem Becher der Kompass liegt. Der Wirt mischt. Dann tippe auf den richtigen Becher. Dreimal hintereinander.');
 area.innerHTML='<div class="bc-wrap"><div class="bc-st">Runde 1 von 3</div><div class="bc-table"><img class="bc-k" src="'+A+'ui/kompass_klein.png" alt=""></div><div class="bc-msg"></div></div>';
 const tb=area.querySelector('.bc-table'),kp=area.querySelector('.bc-k'),msg=area.querySelector('.bc-msg'),st_=area.querySelector('.bc-st');
 const X=[20,50,82];const cups=[0,1,2].map(i=>{const c=el('button','bc-c','<img src="'+A+'ui/becher.png" alt="">');c.dataset.i=i;c.style.left=X[i]+'%';tb.appendChild(c);return {el:c,slot:i}});
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

GAMES.becher2=()=>new Promise(done=>{hideBox();const sc=$('#s-scene');const IW=1080,IH=1920;
 // Bildkoordinaten auf dem Tavernentisch (bc_tisch.jpg): Becherplätze, Kerzenlicht
 const CFG={X:[.27,.5,.73],Y:.665,H:.15,candle:[.1,.62],slow:1};
 const o=el('div','pg bc2','<div class="pg-img" style="background-image:url('+A+'img/bc_tisch.jpg),url('+A+'img/f_wirt2.jpg)"></div><div class="bc2-glow"></div><div class="pg-top">Das Becherspiel</div><div class="bc2-coins"><i></i><i></i><i></i></div><div class="bc2-say"><b>Wirt</b><span></span></div><div class="bc2-msg"></div><div class="bc2-help">Merk dir, unter welchem Becher der Kompass liegt. Dreimal hintereinander richtig, dann gehört er dir.</div>');sc.appendChild(o);
 const say=o.querySelector('.bc2-say'),sayT=say.querySelector('span'),msg=o.querySelector('.bc2-msg'),coins=[...o.querySelectorAll('.bc2-coins i')],glow=o.querySelector('.bc2-glow');
 const M=()=>{const W=o.clientWidth,H=o.clientHeight,k=Math.max(W/IW,H/IH),iw=IW*k,ih=IH*k;return{W,H,iw,ih,ox:(W-iw)/2,oy:(H-ih)/2}};
 // Becher: Schatten, darunter liegender Gegenstand (Kompass oder Korken) und der Becher selbst. Der Gegenstand wandert mit dem Becher.
 const cups=[0,1,2].map(i=>{const c=el('button','bc2-c','<i class="bc2-sh"></i><img class="bc2-u" alt=""><img class="bc2-cup" src="'+A+'ui/becher.png" alt="">');o.appendChild(c);return {el:c,slot:i,u:c.querySelector('.bc2-u')}});
 const slotXY=(m,s)=>{const w=Math.min(m.W/3.6,CFG.H*m.ih*.92);const x=Math.min(m.W-w/2-6,Math.max(w/2+6,m.ox+CFG.X[s]*m.iw));return[x,m.oy+CFG.Y*m.ih,w]};
 const lay=()=>{const m=M();cups.forEach(c=>{const [x,y,w]=slotXY(m,c.slot);c.el.style.width=w+'px';c.el.style.left=x+'px';c.el.style.top=y+'px'});glow.style.left=(m.ox+CFG.candle[0]*m.iw)+'px';glow.style.top=(m.oy+CFG.candle[1]*m.ih)+'px'};
 lay();addEventListener('resize',lay);
 const wirt=async(t,id,wait)=>{sayT.textContent=t;say.classList.remove('on');void say.offsetWidth;say.classList.add('on');const a=playVo(A+'vo/'+id+'.mp3');if(wait&&a)await Promise.race([voDone(a),sleep(4500)])};
 const lift=(c,on)=>c.el.classList.toggle('up',on);
 const puff=c=>{const r=c.el.getBoundingClientRect(),R=o.getBoundingClientRect();for(let k=0;k<2;k++){const p=el('i','bc2-dust');p.style.left=(r.left-R.left+r.width*(k?.85:.15))+'px';p.style.top=(r.bottom-R.top-6)+'px';p.style.setProperty('--d',(k?1:-1)*18+'px');o.appendChild(p);setTimeout(()=>p.remove(),600)}};
 // Tauschen: ein Becher läuft hinten herum (kleiner), der andere vorne (größer), beide leicht gekippt
 async function swap(a,b,ms){const m=M();const [ax,ay]=slotXY(m,a.slot),[bx,by]=slotXY(m,b.slot);const lift_=m.ih*.035;
  const ka=a.el.animate([{left:ax+'px',top:ay+'px',transform:'translate(-50%,-100%) scale(1) rotate(0)'},{left:(ax+bx)/2+'px',top:(ay-lift_)+'px',transform:'translate(-50%,-100%) scale(.9) rotate('+(bx>ax?6:-6)+'deg)',offset:.5},{left:bx+'px',top:by+'px',transform:'translate(-50%,-100%) scale(1) rotate(0)'}],{duration:ms,easing:'ease-in-out'});
  const kb=b.el.animate([{left:bx+'px',top:by+'px',transform:'translate(-50%,-100%) scale(1) rotate(0)'},{left:(ax+bx)/2+'px',top:(by+lift_*.6)+'px',transform:'translate(-50%,-100%) scale(1.08) rotate('+(ax>bx?6:-6)+'deg)',offset:.5},{left:ax+'px',top:ay+'px',transform:'translate(-50%,-100%) scale(1) rotate(0)'}],{duration:ms,easing:'ease-in-out'});
  a.el.style.zIndex=6;b.el.style.zIndex=8;sfx('krug',.22);
  const t=a.slot;a.slot=b.slot;b.slot=t;lay();await Promise.all([ka.finished,kb.finished]);a.el.style.zIndex=b.el.style.zIndex=7;if(ms>330)puff(Math.random()<.5?a:b)}
 const R=[{n:5,ms:560},{n:8,ms:420},{n:12,ms:300}];let round=0,miss=0,slow=1,prize=null,busy=true;
 async function play(){busy=true;msg.classList.remove('on');o.querySelector('.pg-top').textContent='Das Becherspiel · Runde '+(round+1)+' von 3';const r=R[round];
  prize=cups[Math.floor(Math.random()*3)];cups.forEach(c=>{c.u.src=A+'items/'+(c===prize?'kompass':'korken')+'.png';c.u.classList.toggle('k',c===prize)});
  await sleep(300);lift(prize,true);sfx('gegenstand',.35);await wirt(round===0?'Schau gut hin. Hier liegt er noch.':'Und jetzt wird gemischt!',round===0?'bc_w1':'bc_w2',true);await sleep(round===0?200:500);lift(prize,false);await sleep(500);
  if(round===0){await wirt('Und jetzt wird gemischt!','bc_w2',false);await sleep(500)}
  o.classList.add('mischt');for(let k=0;k<r.n;k++){let a=Math.floor(Math.random()*3),b=(a+1+Math.floor(Math.random()*2))%3;await swap(cups[a],cups[b],Math.round(r.ms*slow))}o.classList.remove('mischt');
  msg.textContent='Wo ist der Kompass?';msg.classList.add('on');wirt('Na? Wo ist er?','bc_w3',false);busy=false}
 cups.forEach(c=>c.el.onclick=async()=>{if(busy)return;busy=true;msg.classList.remove('on');lift(c,true);
  if(c===prize){sfx('richtig',.7);fx('magic',c.u,c.el.offsetWidth*1.3);c.el.classList.add('win');coins[round].classList.add('an');sfx('muenzen',.5);
   if(round<2)await wirt(round===0?'Hm. Glück gehabt.':'Schon wieder? Jetzt mische ich richtig.',round===0?'bc_ok1':'bc_ok2',true);else{sfx('jubel_kurz',.6);await sleep(1600)}
   lift(c,false);c.el.classList.remove('win');await sleep(450);round++;miss=0;slow=1;if(round>=3){o.classList.add('out');removeEventListener('resize',lay);setTimeout(()=>{o.remove();done()},500);return}play()}
  else{sfx('falsch',.5);st.flags.becher_leer=1;save();c.el.classList.add('leer');await wirt(miss?'Daneben. Noch mal, ich hab ja Zeit.':'Leer! Aber der Korken ist auch was wert. Ein bisschen.',miss?'bc_no2':'bc_no1',false);await sleep(900);lift(prize,true);await sleep(1600);lift(c,false);lift(prize,false);c.el.classList.remove('leer');miss++;
   if(miss>=2&&slow===1){slow=1.5;await sleep(400);await wirt('Na gut, ich mische etwas langsamer. Aber nur, weil Dezember ist.','bc_lang',true)}await sleep(500);play()}});
 setTimeout(play,700)});

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
   o.style.display='none';await run((sp.g.k==='r'&&s.wrongR)||s.wrong||[]);hideBox();o.style.display='';walking=false}});
 o.querySelector('.pg-tip').onclick=()=>{const h=HINTS[Math.min(hint,2)];toast(h,7000);readAloud(h);hint++};
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
 o.querySelector('.pg-tip').onclick=()=>{const h=HINTS[Math.min(hint,2)];toast(h,7000);readAloud(h);hint++};
});

// Tag 18: Die Eisbrücke. Seitenansicht, Figuren mit der Laterne hinüberschicken.
GAMES.bruecke=(s)=>new Promise(done=>{const sc=$('#s-scene');
 const h=st.hero;const P=[{k:'held',n:heroName(),w:50,img:heroImg(),run:A+'img/r_'+h.cls+'_'+h.look+'_'},{k:'gr',n:'Grumbold',w:90,img:A+'img/p_gr.jpg',run:A+'img/r_gr_'},{k:'hu',n:'Oma Hulda',w:30,img:A+'img/p_hu.jpg',run:A+'img/r_hu_'},{k:'zi',n:'Zirpia',w:5,img:A+'img/p_zi.jpg',run:A+'img/r_zi_'}];
 const side={held:0,gr:0,hu:0,zi:0};let lamp=0,sel=new Set(),moves=0,busy=false;const BY=.50,FEET=.488;
 const o=el('div','pg bz','<div class="pg-img" style="background-image:url('+A+'img/ort18.jpg)"></div><div class="bz-crack"></div><div class="pg-top">Wer geht mit der Laterne hinüber?</div><div class="bz-info"><b class="bz-w">0 von 100 Stein</b><span class="bz-m">Überquerungen: 0</span></div><button class="pbtn bz-go">Losgehen</button><button class="pg-tip"><img src="'+A+'ui/tipp.png" alt="Tipp"></button><div class="bz-rule">Die Brücke trägt höchstens 100 Stein. Wer geht, nimmt die Laterne mit. Grumbold trägt die Laterne nie allein und bleibt nie allein im Dunkeln.</div>');sc.appendChild(o);
 const lampEl=el('img','bz-lamp');lampEl.src=A+'items/laterne.png';o.appendChild(lampEl);
 const bar=el('div','bz-bar');o.appendChild(bar);const T=P.map(p=>{const t=el('button','bz-t','<i style="background-image:url('+p.img+')"></i><img class="bz-sp" src="'+p.run+'0.png" alt=""><u class="bz-hit"></u><b>'+esc(p.n)+'</b><span>'+p.w+' Stein</span>');const sp=t.querySelector('.bz-sp');sp.onload=()=>{t.classList.add('has-sp');setTimeout(()=>{try{lay()}catch(e){}},0)};sp.onerror=()=>sp.remove();t._sp=sp;t._run=p.run;o.appendChild(t);t.onclick=()=>{if(busy||side[p.k]!==lamp)return;sel.has(p.k)?sel.delete(p.k):sel.size<3&&sel.add(p.k);sfx('ui_klick',.5);lay()};const c=el('button','bz-chip','<i style="background-image:url('+p.img+')"></i><b>'+esc(p.n)+'</b><span>'+p.w+' Stein</span>');c.onclick=t.onclick;bar.appendChild(c);t._chip=c;return {p,t}});
 const HINTS=['Grumbold ist so schwer, dass er nur mit einer einzigen Figur zusammen gehen kann. Mit wem?','Grumbold und Zirpia gehen in der Mitte hinüber, nicht am Anfang und nicht am Ende.','Du und Hulda hin, Hulda zurück, Grumbold mit Zirpia hin, Zirpia zurück, dann Zirpia und Hulda hin.'];let hint=0;
 o.querySelector('.pg-tip').onclick=()=>{const h=HINTS[Math.min(hint,2)];toast(h,8000);readAloud(h);hint++};
 // Bildkoordinaten (ort18, 1080x1920, cover) in Bildschirm umrechnen, damit alle auf jedem Gerät auf dem Fels stehen
 const IM=()=>{const W=o.clientWidth,H=o.clientHeight,k=Math.max(W/1080,H/1920),iw=1080*k,ih=1920*k;return{W,H,iw,ih,ox:(W-iw)/2,oy:(H-ih)/2}};
 const PX=(m,ix,iy)=>[Math.min(m.W-18,Math.max(18,m.ox+ix*m.iw)),m.oy+iy*m.ih];
 // Feste Plätze je Seite: hintere Reihe höher und dahinter, vordere Reihe vorn. Keiner steht auf der Brücke.
 const SL={gr:[[.17,.462],[.85,.453]],hu:[[.27,.461],[.75,.448]],held:[[.14,.507],[.875,.507]],zi:[[.232,.509],[.812,.509]]};
 const BACK={gr:1,hu:1};const SH={gr:.12,held:.072,hu:.064,zi:.046};const LANE=.483,BL=.30,BR=.775;
 const spH=(m,k)=>Math.round(SH[k]*m.ih);
 const place=(m,k,ix,iy)=>{let [x,y]=PX(m,ix,iy);const t=T.find(q=>q.p.k===k).t;const sh=t.classList.contains('has-sp')?spH(m,k):62;const hw=sh*.42+4;x=Math.min(m.W-hw,Math.max(hw,x));return[x,y-sh]};
 const lay=()=>{const m=IM();
  T.forEach(({p,t})=>{const sd=side[p.k];if(t._sp)t._sp.style.height=spH(m,p.k)+'px';const [x,y]=place(m,p.k,...SL[p.k][sd]);t.style.left=x+'px';t.style.top=y+'px';const back=!!BACK[p.k];t.style.zIndex=back?6:8;t.classList.toggle('back',back);t.classList.toggle('sel',sel.has(p.k));t.classList.toggle('off',sd!==lamp);if(t._chip){t._chip.classList.toggle('sel',sel.has(p.k));t._chip.classList.toggle('off',sd!==lamp);t._chip.classList.toggle('drueben',!!sd)}});
  const [lx,ly]=PX(m,lamp?BR:BL,LANE);lampEl.style.left=lx+'px';lampEl.style.top=(ly-44)+'px';
  const w=[...sel].reduce((a,k)=>a+P.find(p=>p.k===k).w,0);const wb=o.querySelector('.bz-w');wb.textContent=w+' von 100 Stein';wb.classList.toggle('bad',w>100);
  o.querySelector('.bz-m').textContent='Überquerungen: '+moves;o.querySelector('.bz-go').disabled=!sel.size};
 // Laufweg: vom Platz zum Brückenkopf, über die Brücke (versetzt hintereinander), zum neuen Platz
 const walk=(x,i,from,to,mid)=>{const m=IM(),k=x.p.k,dy=(i%2?.009:0);const a=from?BR:BL,b=from?BL:BR;
  const pts=[SL[k][from],[a,LANE+dy],[mid?.5-i*.08*(from?-1:1):b,LANE+dy]];if(!mid)pts.push(SL[k][to]);
  const xy=pts.map(q=>place(m,k,...q));let L=[0];for(let j=1;j<xy.length;j++)L.push(L[j-1]+Math.hypot(xy[j][0]-xy[j-1][0],xy[j][1]-xy[j-1][1]));const tot=L[L.length-1]||1;
  x.t.style.zIndex=12-i;return x.t.animate(xy.map((q,j)=>({left:q[0]+'px',top:q[1]+'px',offset:L[j]/tot})),{duration:mid?1100:1900,delay:i*320,easing:'linear',fill:'forwards'})};
 lay();addEventListener('resize',lay);
 const say1=t=>{toast(t,4500)};
 o.querySelector('.bz-go').onclick=async()=>{if(busy||!sel.size)return;const g=[...sel];const w=g.reduce((a,k)=>a+P.find(p=>p.k===k).w,0);
  if(g.length===1&&g[0]==='gr'){sfx('falsch',.6);return say1('Grumbold trägt die Laterne nicht allein. Er würde sie vor Aufregung fallen lassen.')}
  const after={...side};g.forEach(k=>after[k]=1-lamp);const nl=1-lamp;
  if(after.gr!==nl&&!Object.keys(after).some(k=>k!=='gr'&&after[k]===after.gr)){sfx('falsch',.6);return say1('Dann stünde Grumbold allein im Dunkeln. Das macht er nicht. Er fürchtet sich.')}
  busy=true;const W=o.clientWidth;const dir=lamp?-1:1;sfx('schritte_schnee',.7);
  const mv=T.filter(x=>sel.has(x.p.k)).sort((p,q)=>(q.p.k==='held')-(p.p.k==='held'));const dur=1900+(mv.length-1)*320;let fr=1;const runI=setInterval(()=>{mv.forEach(x=>{if(x.t._sp&&x.t.classList.contains('has-sp'))x.t._sp.src=x.t._run+(1+fr%3)+'.png'});fr++},120);mv.forEach(x=>x.t.classList.toggle('left',dir<0));const stopRun=()=>{clearInterval(runI);mv.forEach(x=>{if(x.t._sp)x.t._sp.src=x.t._run+'0.png'})};
  mv.forEach(x=>x.t.classList.add('walk'));const an=mv.map((x,i)=>walk(x,i,lamp,1-lamp,w>100));
  {const m=IM();const [l1]=PX(m,lamp?BR:BL,LANE),[l2]=PX(m,w>100?.5:(lamp?BL:BR),LANE);lampEl.style.transition='none';lampEl.animate([{left:l1+'px'},{left:l2+'px'}],{duration:w>100?1100:1900,easing:'linear',fill:'forwards'})}
  if(w>100){await sleep(1100+(mv.length-1)*320);stopRun();sfx('eis_knackt',1);o.classList.add('crack');await sleep(500);mv.forEach((x,i)=>{const r=x.t.getBoundingClientRect(),ro=o.getBoundingClientRect();x.t.style.left=(r.left-ro.left+r.width/2)+'px';x.t.style.top=(r.top-ro.top)+'px';an[i].cancel();x.t.style.transition='top .9s ease-in';requestAnimationFrame(()=>requestAnimationFrame(()=>x.t.style.top=(o.clientHeight+100)+'px'))});sfx('platsch',.6);await sleep(1300);
   o.style.display='none';await run(s.wrong||[]);hideBox();o.style.display='';o.classList.remove('crack');Object.keys(side).forEach(k=>side[k]=0);lamp=0;moves=0;sel.clear();
   T.forEach(x=>{x.t.style.transition='none';x.t.classList.remove('walk')});lampEl.getAnimations().forEach(a=>a.cancel());lay();busy=false;return}
  await sleep(dur+40);stopRun();mv.forEach(x=>{x.t.classList.remove('walk')});g.forEach(k=>side[k]=nl);lamp=nl;moves++;sel.clear();T.forEach(x=>x.t.style.transition='none');lay();an.forEach(a=>a.cancel());lampEl.getAnimations().forEach(a=>a.cancel());requestAnimationFrame(()=>requestAnimationFrame(()=>T.forEach(x=>x.t.style.transition='left .5s,top .5s')));busy=false;
  if(Object.values(side).every(v=>v===1)){sfx('richtig');await sleep(600);toast(moves<=5?'Alle drüben! In '+moves+' Überquerungen, besser geht es nicht.':'Alle drüben! In '+moves+' Überquerungen. Mit fünf wäre es auch gegangen.',5000);
   o.classList.add('out');setTimeout(()=>o.remove(),500);removeEventListener('resize',lay);done(moves)}};
});
