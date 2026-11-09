// Tag 24: Minispiele der fünf Kampfphasen gegen Vharkon.
const LAUTE_GEO={tx:.5,ty:.287,tw:.07,bw:.8};
// Jede Phase gehört laut Schlachtplan einer Figur. Steht die richtige Figur dort, ist das Spiel leichter.
const PHN={held:()=>heroName(),gr:()=>'Grumbold',zi:()=>'Zirpia',hu:()=>'Oma Hulda',na:()=>'Nachtigall'};
function phWho(i){const plan=st.flags.plan||{};const P=PHASEN[i];const w=plan[i]||P[1];return {w,name:PHN[w]?PHN[w]():'',right:w===P[1]}}
function phImgOk(src){return new Promise(r=>{const i=new Image();i.onload=()=>r(true);i.onerror=()=>r(false);i.src=src})}
// Gemeinsamer Rahmen: Vollbild mit eigenem Hintergrund, Titel, Anzeige und Hinweiszeile
async function phShell(cls,bg,fb,title,help,noRead){const sc=$('#s-scene');const src=A+'img/'+bg+'.jpg';const ok=await phImgOk(src);
 const o=el('div','pg bg-game '+cls,'<div class="pg-img" style="background-image:url('+(ok?src:A+'img/'+fb+'.jpg')+')"></div><div class="bg-dim"></div><div class="pg-top">'+title+'</div><div class="bg-hud"></div><div class="bg-help">'+help+'</div>');
 sc.appendChild(o);if(!noRead)setTimeout(()=>readAloud(help),400);return o}
function phEnd(o,msg){return new Promise(r=>{if(msg)toast(msg,3200);setTimeout(()=>{o.classList.add('out');setTimeout(()=>{o.remove();r()},500)},900)})}
function bar(o,label,v){o.querySelector('.bg-hud').innerHTML='<span>'+label+'</span><b class="bg-bar"><i style="width:'+Math.round(Math.max(0,Math.min(1,v))*100)+'%"></i></b>'}

// Erklärkarte vor einem Bossspiel: Spielleiter spricht, Spiel startet erst nach "Los geht's"
function phIntro(o,txt,vo){return new Promise(r=>{const c=el('div','ph-intro','<div class="phi-card"><span class="phi-f" style="background-image:url('+A+'img/p_sl.jpg)"></span><b>Der Spielleiter</b><p>'+esc(txt)+'</p><button class="pbtn">Los geht\'s</button></div>');o.appendChild(c);const a=vo?playVo(A+'vo/'+vo+'.mp3'):null;c.querySelector('button').onclick=e=>{e.stopPropagation();if(a)stopVo();sfx('ui_klick',.6);c.classList.add('out');setTimeout(()=>{c.remove();r()},300)}})}
function phRetry(o,txt){return new Promise(r=>{const c=el('div','ph-intro','<div class="phi-card"><span class="phi-f" style="background-image:url('+A+'img/p_sl.jpg)"></span><b>Der Spielleiter</b><p>'+esc(txt)+'</p><div class="phi-b"><button class="pbtn" data-a="1">Nochmal versuchen</button><button class="pbtn alt" data-a="0">So lassen</button></div></div>');o.appendChild(c);c.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.stopPropagation();sfx('ui_klick',.6);c.remove();r(b.dataset.a==='1')})})}

// Phase 1: Das Netz. Vharkon kreist am Himmel, tippe dorthin, wo er gleich sein wird.
GAMES.p_netz=()=>new Promise(async done=>{const W0=phWho(0);const hard=W0.right?1:1.4;const NETS=7;
 const o=await phShell('pn','mg_himmel','ort24',W0.name+' wirft das Netz','Tippe dorthin, wo Vharkon gleich sein wird. Drei Treffer holen ihn herunter.',1);
 const dr=el('img','pn-dr');dr.src=A+'img/vh_fly.png';dr.onerror=()=>{dr.src=A+'img/g_drache_0.png'};o.appendChild(dr);
 let hits=0,throws=0,t0=performance.now(),run=false,x=.5,y=.3;bar(o,'Treffer 0 von 3 · Netze übrig '+NETS,0);
 const tick=t=>{if(!o.isConnected)return;const s=(t-t0)/1000*hard*(run?1:.5);x=.5+.34*Math.sin(s*.9)+.05*Math.sin(s*2.3);y=.3+.11*Math.sin(s*1.4+1);const W=o.clientWidth,H=o.clientHeight;dr.style.left=(x*W)+'px';dr.style.top=(y*H)+'px';dr.style.transform='translate(-50%,-50%) scaleX('+(Math.cos(s*.9)>0?1:-1)+')';requestAnimationFrame(tick)};requestAnimationFrame(tick);
 await phIntro(o,'Vharkon kreist hoch über dem Gipfel. Tippe in den Himmel, dann fliegt dein Netz genau an diese Stelle. Das Netz braucht einen Moment, also ziel ein kleines Stück vor den Drachen, dorthin, wo er gleich sein wird. Drei Treffer, und er stürzt herunter. Du hast sieben Netze.','b24_netz');
 t0=performance.now();run=true;
 const start=()=>{hits=0;throws=0;dr.classList.remove('away');bar(o,'Treffer 0 von 3 · Netze übrig '+NETS,0);run=true};
 o.addEventListener('pointerdown',async e=>{if(!run||throws>=NETS||e.target.closest('.pg-top,.ph-intro'))return;throws++;const R=o.getBoundingClientRect();const tx=(e.clientX-R.left)/R.width,ty=(e.clientY-R.top)/R.height;
  const n=el('div','pn-net');n.style.left='50%';n.style.top='96%';o.appendChild(n);sfx('netz',.6);requestAnimationFrame(()=>{n.style.left=(tx*100)+'%';n.style.top=(ty*100)+'%';n.classList.add('fly')});
  await sleep(520);
  // Treffer richtet sich nach der echten Größe des Drachen auf diesem Gerät
  const D=dr.getBoundingClientRect();const cx=D.left+D.width/2,cy=D.top+D.height/2;const px=R.left+tx*R.width,py=R.top+ty*R.height;
  const rx=D.width*(W0.right?.42:.34),ry=D.height*(W0.right?.42:.34);const inside=((px-cx)/rx)**2+((py-cy)/ry)**2<=1;
  if(inside){hits++;n.classList.add('hit');sfx('treffer',.8);dr.classList.add('hurt');setTimeout(()=>dr.classList.remove('hurt'),500);toast(['','Getroffen! Noch zweimal!','Noch einmal! Er wird langsamer!','Er hängt im Netz!'][hits],1500)}else{n.classList.add('miss');sfx('wind_boe',.5)}
  setTimeout(()=>n.remove(),700);bar(o,'Treffer '+hits+' von 3 · Netze übrig '+(NETS-throws),hits/3);
  if(hits>=3){run=false;dr.classList.add('fall');sfx('drache',.7);await phEnd(o,'Vharkon stürzt ins Netz und landet auf dem Gipfel.');return done(1)}
  if(throws>=NETS){run=false;sfx('falsch',.6);const again=await phRetry(o,'Alle Netze sind verbraucht. '+(hits?hits+' von 3 Treffern, das ist schon was!':'Er war zu schnell.')+' Oma Hulda hat noch einen Korb voll Netze. Willst du es nochmal versuchen?');
   if(again){start();return}dr.classList.add('away');await phEnd(o,'Er entwischt. Aber er ist müde geworden und landet trotzdem.');done(Math.min(1,hits/3))}});
});

// Phase 2: Die Aschenschuppen. Grumbold zählt. Tippe die glühenden Schuppen von eins bis acht.
// Zwischensequenz: Grumbold schlägt acht Mal zu und zählt dabei laut mit
async function grumbold8(o,pts){const W=['Eins!','Zwei!','Drei!','Vier!','Fünf!','Sechs!','Sieben!','Acht!'];o.querySelectorAll('.pg2-s,.pg2-w').forEach(e=>e.style.opacity='0');
 const c=el('div','g8','<div class="g8-bg" style="background-image:url('+A+'img/mg_schuppen.jpg)"></div><div class="g8-vig"></div><img class="g8-gr" src="'+A+'img/b_gr_0.png" alt=""><div class="g8-n"></div>');o.appendChild(c);
 const gr=c.querySelector('.g8-gr'),nb=c.querySelector('.g8-n'),bg=c.querySelector('.g8-bg');await sleep(500);
 for(let i=0;i<8;i++){const p=pts[i]||{x:.5,y:.4};const sp=i<3?520:i<6?380:i<7?300:700;
  gr.src=A+'img/b_gr_1.png';gr.style.setProperty('--tx',((p.x-.5)*60)+'%');gr.classList.remove('hit');void gr.offsetWidth;gr.classList.add('hit');
  await sleep(110);const b=el('div','g8-boom');b.style.left=(p.x*100)+'%';b.style.top=(p.y*100)+'%';c.appendChild(b);setTimeout(()=>b.remove(),700);chips(c,p,i===7?26:10,i===7);
  for(let k=0;k<6;k++){const s=el('i','g8-sp');s.style.left=(p.x*100)+'%';s.style.top=(p.y*100)+'%';const a=Math.random()*Math.PI*2,r=40+Math.random()*60;s.style.setProperty('--dx',Math.cos(a)*r+'px');s.style.setProperty('--dy',Math.sin(a)*r+'px');c.appendChild(s);setTimeout(()=>s.remove(),700)}
  sfx(i===7?'kritisch':'stein',.9);sfx('treffer',.6);playVo(A+'vo/gr8_'+(i+1)+'.mp3');
  nb.textContent=W[i];nb.className='g8-n'+(i===7?' last':'');void nb.offsetWidth;nb.classList.add('on');
  bg.classList.remove('shk');void bg.offsetWidth;bg.classList.add(i===7?'shk2':'shk');
  await sleep(sp*.55);gr.src=A+'img/b_gr_0.png';await sleep(sp*.45)}
 await sleep(900);c.classList.add('out');await sleep(500);c.remove()}

// Schuppen platzen ab: dunkle Schuppensplitter mit glühender Kante fliegen weg, ein Glutriss bleibt zurück
function chips(host,p,n,big){const r0=host.getBoundingClientRect();
 for(let k=0;k<n;k++){const c=el('i','g8-chip'+(Math.random()<.35?' gl':''));const sz=(big?22:14)+Math.random()*(big?26:16);c.style.width=sz+'px';c.style.height=(sz*1.15)+'px';c.style.left=(p.x*100)+'%';c.style.top=(p.y*100)+'%';
  const a=-Math.PI/2+(Math.random()-.5)*Math.PI*1.5,v=(big?120:80)+Math.random()*(big?160:110);c.style.setProperty('--dx',Math.cos(a)*v+'px');c.style.setProperty('--dy',Math.sin(a)*v+'px');c.style.setProperty('--fall',(120+Math.random()*160)+'px');c.style.setProperty('--rt',((Math.random()-.5)*900)+'deg');c.style.animationDuration=(.8+Math.random()*.5)+'s';host.appendChild(c);setTimeout(()=>c.remove(),1400)}
 const cr=el('div','g8-crack'+(big?' big':''),'<svg viewBox="-50 -50 100 100"><path d="'+Array.from({length:big?7:4},()=>{let x=0,y=0,d='M0 0';const a=Math.random()*Math.PI*2;for(let j=0;j<4;j++){x+=Math.cos(a+(Math.random()-.5)*.9)*(9+Math.random()*7);y+=Math.sin(a+(Math.random()-.5)*.9)*(9+Math.random()*7);d+=' L'+x.toFixed(1)+' '+y.toFixed(1)}return d}).join(' ')+'"/></svg>');cr.style.left=(p.x*100)+'%';cr.style.top=(p.y*100)+'%';host.appendChild(cr)}
// Grumbold springt zur angetippten Schuppe, schlägt zu und ruft die Zahl
function grJump(o,p,i){let g=o.querySelector('.g8-gr2');if(!g){g=el('img','g8-gr2');g.src=A+'img/b_gr_0.png';o.appendChild(g)}
 g.style.left=(p.x*100)+'%';g.style.top=(p.y*100)+'%';g.src=A+'img/b_gr_1.png';g.classList.remove('punch');void g.offsetWidth;g.classList.add('punch');
 setTimeout(()=>{const b=el('div','g8-boom');b.style.left=(p.x*100)+'%';b.style.top=(p.y*100)+'%';o.appendChild(b);setTimeout(()=>b.remove(),700);chips(o,p,i===7?26:10,i===7);
  for(let k=0;k<6;k++){const s=el('i','g8-sp');s.style.left=(p.x*100)+'%';s.style.top=(p.y*100)+'%';const a=Math.random()*Math.PI*2,r=40+Math.random()*50;s.style.setProperty('--dx',Math.cos(a)*r+'px');s.style.setProperty('--dy',Math.sin(a)*r+'px');o.appendChild(s);setTimeout(()=>s.remove(),700)}
  sfx(i===7?'kritisch':'stein',.8);o.classList.remove('hit');void o.offsetWidth;o.classList.add('hit');setTimeout(()=>{g.src=A+'img/b_gr_0.png'},260)},180);
 try{const a=new Audio(A+'vo/gr8_'+(i+1)+'.mp3');a.volume=st.sound===false?0:1;a.play().catch(()=>{})}catch(e){}}

GAMES.p_glut=()=>new Promise(async done=>{const W1=phWho(1);const T=W1.right?9:6;
 const o=await phShell('pg2','mg_schuppen','ort24',W1.name+' schlägt mit dem Glutstein','Tippe die glühenden Schuppen der Reihe nach an, von eins bis acht. Jeder Schlag bricht die Asche auf.');
 const pts=[];const R=()=>({x:.14+Math.random()*.72,y:.24+Math.random()*.56});for(let i=0;i<8;i++){let p,tr=0;do{p=R();tr++}while(tr<60&&pts.some(q=>Math.hypot((q.x-p.x)*1.6,q.y-p.y)<.16));pts.push(p)}
 let next=0,t0=performance.now(),run=true;const W=['Eins','Zwei','Drei','Vier','Fünf','Sechs','Sieben','Acht'];
 pts.forEach((p,i)=>{const b=el('button','pg2-s','<b>'+(i+1)+'</b>');b.style.left=(p.x*100)+'%';b.style.top=(p.y*100)+'%';o.appendChild(b);b.onpointerdown=e=>{e.preventDefault();if(!run)return;if(i!==next){b.classList.add('nope');sfx('falsch',.4);setTimeout(()=>b.classList.remove('nope'),300);return}next++;b.classList.add('ok');grJump(o,p,i);const w=el('div','pg2-w',W[i]+(i===7?'!':'.'));w.style.left=b.style.left;w.style.top=b.style.top;o.appendChild(w);setTimeout(()=>w.remove(),900);if(next===8)setTimeout(()=>fin(true),900)}});
 const fin=async ok=>{if(!run)return;run=false;const t=(performance.now()-t0)/1000;await phEnd(o,ok?'Acht! Grumbold hat bis acht gezählt. Die Schuppen sind offen.':'Die Asche ist zäh. Aber ein paar Schuppen sind gebrochen.');done(ok?Math.max(.4,1-Math.max(0,t-TT*.5)/TT-tries*.15):next/8)};
 let TT=T,tries=0;const again=()=>{tries++;TT=T*(1+.3*Math.min(2,tries));sfx('falsch',.5);toast(tries>1?'Zu langsam. Grumbold holt tief Luft. Noch einmal, du hast jetzt mehr Zeit.':'Zu langsam! Die Asche schließt sich wieder. Noch einmal von eins.',3200);next=0;o.querySelectorAll('.pg2-s').forEach(b=>b.classList.remove('ok'));setTimeout(()=>{t0=performance.now();run=true;tk()},1600)};
 const tk=()=>{if(!run)return;const left=TT-(performance.now()-t0)/1000;bar(o,'Zeit',left/TT);if(left<=0){run=false;return again()}requestAnimationFrame(tk)};tk()});

// Phase 3: Der Aschesturm. Zirpia spielt das Wiegenlied auf den vier Saiten ihrer Walnusslaute.
function pluck(f,vol){const c=ac(),t=c.currentTime;const o=c.createOscillator(),g=c.createGain(),fl=c.createBiquadFilter();o.type='triangle';o.frequency.setValueAtTime(f,t);fl.type='lowpass';fl.frequency.setValueAtTime(3200,t);fl.frequency.exponentialRampToValueAtTime(700,t+.6);g.gain.setValueAtTime(vol||.35,t);g.gain.exponentialRampToValueAtTime(.001,t+1.1);o.connect(fl);fl.connect(g);g.connect(sfxBus);o.start(t);o.stop(t+1.2)}
GAMES.p_lied=()=>new Promise(async done=>{hideBox();const W2=phWho(2);const LEAD=W2.right?2.1:1.75;
 const C=['g','r','y','b'],COL=['#4fe36a','#ff5a6a','#ffd23f','#5ab8ff'];
 // Gleicher Aufbau wie Zirpias Schlagzeug: Begeisterung oben, Lichter, Treffer, Zähler, Endkarte
 const o=el('div','rk pl5');o.innerHTML='<div class="tk2-bg" style="background-image:url('+A+'img/mg_laute2.jpg)"></div><div class="rk-st"><div class="tk2-top"><div class="tk2-t">'+W2.name+' rockt das Wiegenlied</div><div class="tk2-meter"><i></i><b>Begeisterung</b></div></div>'+
  '<svg class="pl4-str" preserveAspectRatio="none"></svg><div class="rk-notes"></div>'+
  '<div class="pl4-rings">'+C.map((c,i)=>'<button class="pl4-ring '+c+'" data-s="'+i+'" style="--c:'+COL[i]+'"><img src="'+A+'ui/lpad_'+c+'.png" alt=""><i></i><b></b></button>').join('')+'</div>'+
  '<div class="rk-fx"></div><div class="rk-combo"></div><div class="rk-help">Tippe das Pad, sobald ein Licht in seinem Ring ist.</div><div class="tk2-count"></div><div class="rk-load">Die Laute wird gestimmt …</div></div>';
 document.body.appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));
 const $o=q=>o.querySelector(q),stg=$o('.rk-st'),svg=$o('.pl4-str'),notesEl=$o('.rk-notes'),rings=[...o.querySelectorAll('.pl4-ring')],fx=$o('.rk-fx'),comboEl=$o('.rk-combo'),meter=$o('.tk2-meter i'),cnt=$o('.tk2-count');
 // Bildgeometrie mg_laute2 (1440x2560)
 const IW=1440,IH=2560,HY=.83;let G=null;
 const layout=()=>{const W=stg.clientWidth,H=stg.clientHeight,sc=Math.max(W/IW,H/IH),iw=IW*sc,ih=IH*sc,ox=(W-iw)/2,oy=(H-ih)/2;
  const tx=ox+LAUTE_GEO.tx*iw,ty=oy+LAUTE_GEO.ty*ih,tw=LAUTE_GEO.tw*iw,hy=H*HY,bw=Math.min(W*.86,iw*LAUTE_GEO.bw);
  const L=[0,1,2,3].map(i=>{const f=(i+.5)/4-.5;return {x0:tx+f*tw,y0:ty,x1:W/2+f*bw,y1:hy}});const pw=Math.min(132,bw/4*.98);G={W,H,L,hy,pw,ph:pw*.56};
  svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.innerHTML=L.map((l,i)=>{const ex=l.x1,ey=l.y1;return '<line x1="'+l.x0+'" y1="'+l.y0+'" x2="'+ex+'" y2="'+ey+'" stroke="'+COL[i]+'" stroke-opacity=".35" stroke-width="7" stroke-linecap="round"/><line x1="'+l.x0+'" y1="'+l.y0+'" x2="'+ex+'" y2="'+ey+'" stroke="#fff4d8" stroke-width="2.2" stroke-linecap="round"/>'}).join('');
  stg.style.setProperty('--lbg','url('+A+'img/mg_laute2.jpg)');rings.forEach((r,i)=>{r.style.left=L[i].x1+'px';r.style.top=hy+'px';r.style.width=G.pw+'px';r.style.height=G.ph+'px'})};
 layout();addEventListener('resize',layout);
 // Bewegung: hinten klein, vorne groß, und kurz vor dem Pad deutlich langsamer (wie beim Schlagzeug)
 const curve=u=>{if(u>1)return 1+(u-1)*.4;u=Math.max(0,u);const ss=u*u*(3-2*u);return .72*ss+.28*u};
 const pos=(L,u)=>{const t=curve(u),l=G.L[L];return {x:l.x0+(l.x1-l.x0)*t,y:l.y0+(l.y1-l.y0)*t,k:.22+.78*Math.min(1.15,t)}};
 const inZone=(P,f)=>Math.abs(P.y-G.hy)<=G.ph*.62*f;
 const c=ac(),LAT=(c.outputLatency||c.baseLatency||0);
 const ld=u=>loadVo(A+u).catch(()=>null);
 const [band,lute,CH]=await Promise.all([ld('rock/wiegenrock_band.mp3'),ld('rock/wiegenrock_laute.mp3'),fetch(A+'rock/wiegenrock.json').then(r=>r.json())]);
 $o('.rk-load').remove();
 const N=CH.length;let res={hits:0,perfect:0},combo=0,mood=25,fin=0,raf=0,srcs=[],lg=null,jubelT=0;
 const setMood=v=>{const was=mood;mood=Math.max(0,Math.min(100,v));meter.style.width=mood+'%';o.classList.toggle('m2',mood>75);o.classList.toggle('voll',mood>=100);if(mood>=100&&was<100&&performance.now()>jubelT){jubelT=performance.now()+9000;sfx('jubel_voll',.7);const j=el('div','rk-jubel','Die Menge tobt!');stg.appendChild(j);setTimeout(()=>j.remove(),2200)}};
 const burst=(L,perf)=>{hitFx(fx,G.L[L].x1,G.hy,COL[L],perf,G.pw/100,G.hy-G.ph*.5-34);
  const ln=svg.querySelectorAll('line')[L*2];if(ln){ln.classList.remove('zap');void ln.getBoundingClientRect();ln.classList.add('zap')}
  if(perf&&combo>=10){stg.classList.remove('shake');void stg.offsetWidth;stg.classList.add('shake')}
  o.classList.toggle('feuer',combo>=10)};
 const missFx=L=>{const m=el('div','rk-miss');m.style.left=G.L[L].x1+'px';m.style.top=G.hy+'px';fx.appendChild(m);setTimeout(()=>m.remove(),450);o.classList.remove('feuer')};
 const stopAll=()=>{srcs.forEach(s=>{try{s.stop()}catch(e){}});srcs=[]};
 const run=()=>{
  res={hits:0,perfect:0};combo=0;setMood(25);notesEl.innerHTML='';comboEl.textContent='';fin=0;$o('.rk-help').classList.remove('weg');
  const beat=60/103.4,t0=c.currentTime+LEAD+4*beat+.3;hush(true);
  ['4','3','2','1'].forEach((n,i)=>setTimeout(()=>{cnt.textContent=n;cnt.className='tk2-count on';pluck(392,.16);setTimeout(()=>cnt.className='tk2-count',380)},Math.max(0,(t0-(4-i)*beat-c.currentTime)*1000)));
  lg=c.createGain();lg.gain.value=1.15;lg.connect(drumOut());const bg=c.createGain();bg.gain.value=1;bg.connect(drumOut());
  [[band,bg],[lute,lg]].forEach(([b,g])=>{if(!b)return;const s=c.createBufferSource();s.buffer=b;s.connect(g);s.start(t0);srcs.push(s)});
  const notes=CH.map(([t,L])=>({t:t0+t,L,e:null,st:0}));// Lichter werden erst kurz vor ihrem Auftritt erzeugt und danach wieder entfernt (weniger Last auf dem Handy)
  let next=0;const end=t0+(band?band.duration:CH[N-1][0]+3);
  const hit=L=>{if(fin)return;const r=rings[L];r.classList.remove('on');void r.offsetWidth;r.classList.add('on');const now=c.currentTime-LAT;
   let k=-1,bd=9;for(let j=next;j<N&&notes[j].t<now+LEAD;j++){const n=notes[j];if(n.st||n.L!==L)continue;if(!inZone(pos(L,1-(n.t-now)/LEAD),1.12))continue;const d=Math.abs(now-n.t);if(d<bd){bd=d;k=j}}
   if(k<0){pluck(262*[1,1.25,1.5,2][L]*.94,.07);fireFx(fx,G.L[L].x1,G.hy,COL[L],G.pw/100,0);return}
   const n=notes[k];n.st=1;res.hits++;combo++;lg.gain.setTargetAtTime(1.15,c.currentTime,.02);if(res.hits===5)$o('.rk-help').classList.add('weg');
   if(bd<=.09){res.perfect++;burst(L,true);setMood(mood+2.2)}else{burst(L,false);setMood(mood+1.3)}
   comboEl.textContent=combo>=4?combo+' in Folge':'';comboEl.classList.remove('bump');void comboEl.offsetWidth;comboEl.classList.add('bump');
   if(combo%20===0)sfx('jubel_kurz',.55)};
  // Tippen: die Saite, die an dieser Stelle am nächsten liegt
  const tap=e=>{if(e.target.closest('.pbn-test'))return;const R=stg.getBoundingClientRect(),x=e.clientX-R.left,y=e.clientY-R.top;if(y<G.hy-G.ph*2.4)return;e.preventDefault();
   let b=0,bd=1e9;G.L.forEach((l,i)=>{const t=Math.max(0,Math.min(1.25,(y-l.y0)/(l.y1-l.y0)));const d=Math.abs(l.x0+(l.x1-l.x0)*t-x);if(d<bd){bd=d;b=i}});hit(b)};
  const kb=e=>{const i='asdf'.indexOf(e.key.toLowerCase());if(i>=0&&!e.repeat)hit(i)};
  o.addEventListener('pointerdown',tap);addEventListener('keydown',kb);
  const loop=()=>{const now=c.currentTime-LAT;
   for(let j=next;j<N;j++){const n=notes[j];const dt=n.t-now;if(dt>LEAD+.1)break;
    if(!n.e){n.e=wispEl(COL[n.L],[2,4,3,1][n.L]);notesEl.appendChild(n.e)}
    const u=1-dt/LEAD,P=pos(n.L,Math.min(1.6,u));
    if(!n.st&&dt<0&&(!inZone(P,1.12)||dt<-.5)){n.st=2;n.mt=now;n.e.classList.add('miss');missFx(n.L);combo=0;comboEl.textContent='';setMood(mood-2.5);lg.gain.setTargetAtTime(.2,c.currentTime,.02);setTimeout(()=>{if(lg)lg.gain.setTargetAtTime(1.15,c.currentTime,.08)},380)}
    const sz=G.pw*.72*P.k;n.e.style.width=n.e.style.height=sz+'px';
    n.e.style.transform='translate('+P.x+'px,'+P.y+'px) translate(-50%,-50%)';n.e.style.opacity=n.st===1?0:n.st===2?Math.max(0,1-(now-n.mt)/.5):(u<0?0:Math.min(1,u*3))}
   while(next<N&&notes[next].st&&(notes[next].st===1?notes[next].t<now-.4:now-notes[next].mt>.55)){if(notes[next].e){notes[next].e.remove();notes[next].e=null}next++}
   if(now>end+.3||(next>=N&&now>CH[N-1][0]+t0+2.5)){finish();return}
   raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
  o._cleanup=()=>{o.removeEventListener('pointerdown',tap);removeEventListener('keydown',kb)};
  if(TEST)window.__pl={c,LAT,CH,T0:t0,get hits(){return res.hits}}};
 async function finish(){if(fin)return;fin=1;cancelAnimationFrame(raf);if(o._cleanup)o._cleanup();
  srcs.forEach(s=>{try{s.stop(c.currentTime+1.2)}catch(e){}});if(lg)lg.gain.setTargetAtTime(0,c.currentTime,.4);hush(false);o.classList.add('ende');
  const q=res.hits/N,stars=q>=.8?3:q>=.55?2:q>=.3?1:0;
  sfx(stars>=2?'fanfare':'sieg',.6);setTimeout(()=>sfx('applaus',stars>=2?.7:.35),400);
  const msg=stars===3?'Die Laute kreischt, die Funken fliegen. Vharkon gähnt trotzdem.':stars===2?'Ein paar Töne daneben, aber der Sturm wird schwächer.':stars===1?'Schief, aber mit Herz. Der Sturm flaut trotzdem ab.':'Mehr Krach als Lied. Aber Vharkon blinzelt schon.';
  const card=el('div','tk2-end','<div class="tk2-stars">'+[0,1,2].map(i=>'<img src="'+A+'ui/stern.png" class="'+(i<stars?'on':'')+'" style="animation-delay:'+(i*.25)+'s" alt="">').join('')+'</div><h3>'+res.hits+' von '+N+' Tönen</h3><p>'+msg+'</p><div class="hero-nav">'+(stars<3?'<button class="pbtn tk2-again">Nochmal</button>':'')+'<button class="pbtn tk2-go">Weiter</button></div>');
  stg.appendChild(card);requestAnimationFrame(()=>card.classList.add('on'));
  const r=await new Promise(rs=>{card.querySelector('.tk2-go').onclick=()=>rs(0);const a=card.querySelector('.tk2-again');if(a)a.onclick=()=>rs(1)});
  sfx('ui_klick',.6);card.remove();o.classList.remove('ende');stopAll();
  if(r){await sleep(300);run();return}
  removeEventListener('resize',layout);o.classList.remove('on');await sleep(450);o.remove();done(q)}
 if(TEST){const tb=el('button','pbn-test','Test: fertig');tb.style.cssText='position:absolute;right:8px;top:70px;z-index:12';tb.onclick=e=>{e.stopPropagation();res.hits=N;finish()};stg.appendChild(tb)}
 // Zirpia erklärt das Lautenspiel (beim ersten Mal), antippen überspringt
 const speak=(id,t)=>new Promise(res=>{const b=el('div','rk-say','<div class="rk-face"></div><p>'+t+'</p>');b.querySelector('.rk-face').style.backgroundImage='url('+A+'img/p_zi_2.jpg)';stg.appendChild(b);requestAnimationFrame(()=>b.classList.add('on'));
  const a=playVo(A+'vo/'+id+'.mp3');let f2=0;const go=()=>{if(f2)return;f2=1;if(a&&!a.ended)stopVo();b.classList.remove('on');setTimeout(()=>b.remove(),250);res()};
  b.onpointerdown=e=>{e.stopPropagation();go()};const iv=setInterval(()=>{if(!a||a.ended){clearInterval(iv);setTimeout(go,a?300:t.length*55)}},120)});
 await sleep(500);
 if(!st.flags.lied_erkl){await speak('pl_e1','Jetzt spielst du meine Laute! Die Irrlichter fliegen auf den vier Saiten nach unten zu den Pads.');await speak('pl_e2','Sobald ein Licht im Ring auf seinem Pad ist, tippst du genau dieses Pad an. Je mehr du triffst, desto lauter tobt die Menge.');st.flags.lied_erkl=1;save()}
 run()});

// Phase 4: Der Schatten. Nachtigall schleicht über Vharkons Rücken. Halten zum Schleichen, loslassen, wenn das Auge aufgeht.
GAMES.p_schatten=()=>new Promise(async done=>{const W3=phWho(3);const fast=W3.right?1:1.35;
 // Draufsicht: Vharkon schläft eingerollt, Nachtigall schleicht über Schwanz und Rücken bis zur Brust. Das Auge gehört zum Bild (zweites Bild mit offenem Auge).
 const o=await phShell('ps2','mg_schleich_zu','mg_ruecken',W3.name+' schleicht zum Herzen','Halte gedrückt, um zu schleichen. Lass sofort los, wenn Vharkons Auge aufgeht. Erreiche sein Herz.');
 const ok2=await phImgOk(A+'img/mg_schleich_auf.jpg');o.querySelector('.pg-img').insertAdjacentHTML('afterend','<div class="pg-img ps2-auf" style="background-image:url('+A+'img/'+(ok2?'mg_schleich_auf':'mg_schleich_zu')+'.jpg)"></div><div class="ps2-eyeglow"></div>');
 const IW=PS_IMG[0],IH=PS_IMG[1];const P=PS_PATH;const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot((P[i][0]-P[i-1][0])*IW,(P[i][1]-P[i-1][1])*IH));const TOT=L[L.length-1];
 const map=(u,v)=>{const W=o.clientWidth,H=o.clientHeight,sc=Math.max(W/IW,H/IH);return [(W-IW*sc)/2+u*IW*sc,(H-IH*sc)/2+v*IH*sc,sc]};
 const at=q=>{const d=q*TOT;let i=1;while(i<L.length-1&&L[i]<d)i++;const f=(d-L[i-1])/(L[i]-L[i-1]||1);const u=P[i-1][0]+(P[i][0]-P[i-1][0])*f,v=P[i-1][1]+(P[i][1]-P[i-1][1])*f;const ang=Math.atan2((P[i][1]-P[i-1][1])*IH,(P[i][0]-P[i-1][0])*IW)*180/Math.PI;return [u,v,ang]};
 const top=W3.w==='na';const csrc=A+'img/'+(top?'na_top':'r_'+(W3.w==='held'?st.hero.cls+'_'+st.hero.look:W3.w)+'_0')+'.png';const cat=el('div','ps2-cat'+(top?' top':''),top?'<div class="ps2-c"><img class="t" src="'+csrc+'" alt=""><img class="b" src="'+csrc+'" alt=""></div>':'<div class="ps2-c"><img src="'+csrc+'" alt=""></div>');o.appendChild(cat);const ci=cat.firstChild;
 const goal=el('div','ps2-goal');o.appendChild(goal);const alarm=el('div','ps2-alarm','');o.appendChild(alarm);

 const eg=o.querySelector('.ps2-eyeglow');
 const place=()=>{const [x,y]=map(PS_EYE[0],PS_EYE[1]);eg.style.left=x+'px';eg.style.top=y+'px';const g=map(P[P.length-1][0],P[P.length-1][1]);goal.style.left=g[0]+'px';goal.style.top=g[1]+'px'};place();addEventListener('resize',place);
 const btn=el('div','ps2-hold','Gedrückt halten zum Schleichen');o.appendChild(btn);
 // Erst erklären, dann geht es los. Danach verschwindet der Hinweistext, damit die Katze unten frei bleibt.
 await phIntro(o,'Nachtigall schleicht über Vharkons Rücken bis zu seinem Herzen. Halte den Bildschirm gedrückt, dann schleicht sie. Wenn Vharkon sich regt, sofort loslassen, denn wenn sein Auge aufgeht, darf sie sich nicht bewegen.','ps_erkl');o.querySelector('.bg-help').classList.add('weg');
 let hold=false,pos=0,state='zu',tState=performance.now(),dur=2.2+Math.random()*1.6,caught=0,run=true,last=performance.now(),fr=0;
 const down=e=>{e.preventDefault();hold=true;btn.classList.add('on')},up=()=>{hold=false;btn.classList.remove('on')};o.addEventListener('pointerdown',down);addEventListener('pointercancel',up);addEventListener('pointerup',up);
 const tick=t=>{if(!run)return;const dt=Math.min(.05,(t-last)/1000);last=t;const el0=(t-tState)/1000;
  if(state==='zu'&&el0>dur){state='warn';tState=t;o.classList.add('warn');sfx('drachenknurren',.8);alarm.textContent='Er regt sich …';try{navigator.vibrate&&navigator.vibrate(80)}catch(e){}}
  else if(state==='warn'&&el0>.9/fast){state='auf';tState=t;o.classList.remove('warn');o.classList.add('auf');sfx('drache',.5);alarm.textContent='Auge auf! Nicht bewegen!';try{navigator.vibrate&&navigator.vibrate([60,40,60])}catch(e){}}
  else if(state==='auf'&&el0>1.4){state='zu';tState=t;dur=(1.6+Math.random()*1.8)/fast;o.classList.remove('auf');alarm.textContent=''}
  if(hold){pos+=dt*.075;fr++;
   if(state==='auf'){caught++;hold=false;btn.classList.remove('on');pos=Math.max(0,pos-.15);sfx('katze',.6);toast(['Erwischt! Zurück in den Schatten.','Fast! Noch mal leise.','Er blinzelt nur. Weiter.'][Math.min(2,caught-1)],1400);o.classList.add('hit');setTimeout(()=>o.classList.remove('hit'),400)}}
  pos=Math.min(1,pos);const [u,v,ang]=at(pos);const [x,y,sc]=map(u,v);const sz=Math.max(72,Math.min(110,IW*sc*.1));
  cat.style.width=sz+'px';cat.style.transform='translate('+x+'px,'+y+'px) translate(-50%,-50%) rotate('+(top?ang+90:0)+'deg)';cat.classList.toggle('walk',hold);
  cat.classList.toggle('hide',!hold&&state!=='zu');bar(o,'Weg zum Herzen',pos);
  if(pos>=1){run=false;removeEventListener('pointerup',up);removeEventListener('pointercancel',up);removeEventListener('resize',place);
   // Ziel erreicht: goldene Lichtringe, Funken und ein großes Am Herzen!
   o.classList.remove('auf','warn');alarm.textContent='';btn.remove();const w=el('div','ps2-win','<i></i><i></i><i></i><b>Am Herzen!</b>');w.style.left=goal.style.left;w.style.top=goal.style.top;o.appendChild(w);cat.classList.add('jubel');fx('magic',goal,280);sfx('zauber',.8);setTimeout(()=>sfx('richtig',.8),250);try{navigator.vibrate&&navigator.vibrate([40,30,80])}catch(e){}
   setTimeout(()=>phEnd(o,'Geschafft. Der Schattenschlüssel öffnet die Kruste über dem Herzen.').then(()=>done(Math.max(.3,1-caught*.2))),1700);return}
  requestAnimationFrame(tick)};requestAnimationFrame(tick)});
// Bildmaße und Weg über den Drachenkörper (relativ zum Bild, unten Schwanz, oben Brust)
const PS_IMG=[1536,2720];const PS_EYE=[.34,.225];const PS_PATH=[[.72,.86],[.5,.9],[.3,.88],[.17,.8],[.2,.72],[.38,.66],[.52,.58],[.55,.48],[.5,.4],[.57,.31]];

// Phase 5: Das Herz. Halte die Sonnenkerze ruhig in der warmen Zone, bis die Asche schmilzt.
GAMES.p_herz=()=>new Promise(async done=>{const W4=phWho(4);const zone=W4.right?.26:.18;
 const o=await phShell('ph','mg_herz','ort24',W4.name+' mit der Sonnenkerze','Halte gedrückt, damit die Flamme steigt, lass los, damit sie sinkt. Bleib im goldenen Bereich, bis die Asche geschmolzen ist.');
 // Die Asche schmilzt sichtbar: drei weitere Bilder blenden nacheinander über das Herz
 let prevL=o.querySelector('.pg-img');const STG=['mg_herz_2','mg_herz_1','mg_herz_3'].map(n=>{const d=el('div','pg-img ph-stg');d.style.backgroundImage='url('+A+'img/'+n+'.jpg)';d.style.opacity=0;prevL.after(d);prevL=d;return d});
 let stgSeen=0;const stgUp=p=>{STG.forEach((d,i)=>{const a=Math.max(0,Math.min(1,(p-i/3)*3));d.style.opacity=a});const k=Math.min(3,Math.floor(p*3+.0001));if(k>stgSeen){stgSeen=k;sfx('feuer_entfacht',.35);fx('magic',o.querySelector('.ph-kw'),160);}};
 o.insertAdjacentHTML('beforeend','<div class="ph-glow"></div><div class="ph-band"><span>warm</span></div><div class="ph-meter"><i class="z"></i><i class="f"></i></div><div class="ph-kw"><i class="ph-fl"></i><img class="ph-k" src="'+A+'items/sonnenkerze.png" alt=""></div>');
 const btn=el('button','pbtn big ps-go','Kerze heben');o.appendChild(btn);
 let v=.3,vel=0,hold=false,prog=0,zc=.5,run=true,last=performance.now();
 const down=e=>{e.preventDefault();hold=true},up=()=>{hold=false};btn.addEventListener('pointerdown',down);addEventListener('pointerup',up);
 const z=o.querySelector('.ph-meter .z'),f=o.querySelector('.ph-meter .f'),gl=o.querySelector('.ph-glow'),band=o.querySelector('.ph-band'),kw=o.querySelector('.ph-kw');const Y0=.16,Y1=.74;const yOf=t=>Y1-(Y1-Y0)*t;let spT=0;
 const tick=t=>{if(!run)return;const dt=Math.min(.05,(t-last)/1000);last=t;const s=t/1000;
  zc=.5+.28*Math.sin(s*.8)+.08*Math.sin(s*2.1);vel+=(hold?1.5:-1.3)*dt;vel*=.9;v=Math.max(0,Math.min(1,v+vel*dt*2.2));
  const inZ=Math.abs(v-zc)<zone/2;if(inZ)prog+=dt*.11;else prog=Math.max(0,prog-dt*.02);
  z.style.bottom=((zc-zone/2)*100)+'%';z.style.height=(zone*100)+'%';f.style.bottom=(v*100)+'%';f.classList.toggle('in',inZ);gl.style.opacity=.15+prog*.85;bar(o,'Wärme',prog);stgUp(prog);
  band.style.top=(yOf(zc+zone/2)*100)+'%';band.style.height=((Y1-Y0)*zone*100)+'%';band.classList.toggle('in',inZ);kw.style.top=(yOf(v)*100)+'%';kw.classList.toggle('in',inZ);
  if(inZ&&(spT-=dt)<0){spT=.12;const sp=el('i','ph-sp');sp.style.left=(46+Math.random()*8)+'%';sp.style.top=(yOf(v)*100-4)+'%';o.appendChild(sp);setTimeout(()=>sp.remove(),900)}
  if(prog>=1){run=false;removeEventListener('pointerup',up);sfx('feuer_entfacht',.8);phEnd(o,'Die Asche schmilzt. Darunter glimmt etwas.').then(()=>done(1));return}
  requestAnimationFrame(tick)};requestAnimationFrame(tick)});
