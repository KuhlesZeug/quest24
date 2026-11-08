// Tag 24: Minispiele der fünf Kampfphasen gegen Vharkon.
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
  await sleep(110);const b=el('div','g8-boom');b.style.left=(p.x*100)+'%';b.style.top=(p.y*100)+'%';c.appendChild(b);setTimeout(()=>b.remove(),700);
  for(let k=0;k<6;k++){const s=el('i','g8-sp');s.style.left=(p.x*100)+'%';s.style.top=(p.y*100)+'%';const a=Math.random()*Math.PI*2,r=40+Math.random()*60;s.style.setProperty('--dx',Math.cos(a)*r+'px');s.style.setProperty('--dy',Math.sin(a)*r+'px');c.appendChild(s);setTimeout(()=>s.remove(),700)}
  sfx(i===7?'kritisch':'stein',.9);sfx('treffer',.6);playVo(A+'vo/gr8_'+(i+1)+'.mp3');
  nb.textContent=W[i];nb.className='g8-n'+(i===7?' last':'');void nb.offsetWidth;nb.classList.add('on');
  bg.classList.remove('shk');void bg.offsetWidth;bg.classList.add(i===7?'shk2':'shk');
  await sleep(sp*.55);gr.src=A+'img/b_gr_0.png';await sleep(sp*.45)}
 await sleep(900);c.classList.add('out');await sleep(500);c.remove()}

GAMES.p_glut=()=>new Promise(async done=>{const W1=phWho(1);const T=W1.right?9:6;
 const o=await phShell('pg2','mg_schuppen','ort24',W1.name+' schlägt mit dem Glutstein','Tippe die glühenden Schuppen der Reihe nach an, von eins bis acht. Jeder Schlag bricht die Asche auf.');
 const pts=[];const R=()=>({x:.14+Math.random()*.72,y:.24+Math.random()*.56});for(let i=0;i<8;i++){let p,tr=0;do{p=R();tr++}while(tr<60&&pts.some(q=>Math.hypot((q.x-p.x)*1.6,q.y-p.y)<.16));pts.push(p)}
 let next=0,t0=performance.now(),run=true;const W=['Eins','Zwei','Drei','Vier','Fünf','Sechs','Sieben','Acht'];
 pts.forEach((p,i)=>{const b=el('button','pg2-s','<b>'+(i+1)+'</b>');b.style.left=(p.x*100)+'%';b.style.top=(p.y*100)+'%';o.appendChild(b);b.onpointerdown=e=>{e.preventDefault();if(!run)return;if(i!==next){b.classList.add('nope');sfx('falsch',.4);setTimeout(()=>b.classList.remove('nope'),300);return}next++;b.classList.add('ok');sfx('feuerball',.45);const w=el('div','pg2-w',W[i]+(i===7?'!':'.'));w.style.left=b.style.left;w.style.top=b.style.top;o.appendChild(w);setTimeout(()=>w.remove(),900);if(next===8)fin(true)}});
 const fin=async ok=>{if(!run)return;run=false;const t=(performance.now()-t0)/1000;if(ok)await grumbold8(o,pts);await phEnd(o,ok?'Acht! Grumbold hat bis acht gezählt. Die Schuppen sind offen.':'Die Asche ist zäh. Aber ein paar Schuppen sind gebrochen.');done(ok?Math.max(.4,1-Math.max(0,t-TT*.5)/TT-tries*.15):next/8)};
 let TT=T,tries=0;const again=()=>{tries++;TT=T*(1+.3*Math.min(2,tries));sfx('falsch',.5);toast(tries>1?'Zu langsam. Grumbold holt tief Luft. Noch einmal, du hast jetzt mehr Zeit.':'Zu langsam! Die Asche schließt sich wieder. Noch einmal von eins.',3200);next=0;o.querySelectorAll('.pg2-s').forEach(b=>b.classList.remove('ok'));setTimeout(()=>{t0=performance.now();run=true;tk()},1600)};
 const tk=()=>{if(!run)return;const left=TT-(performance.now()-t0)/1000;bar(o,'Zeit',left/TT);if(left<=0){run=false;return again()}requestAnimationFrame(tk)};tk()});

// Phase 3: Der Aschesturm. Zirpia spielt das Wiegenlied auf den vier Saiten ihrer Walnusslaute.
function pluck(f,vol){const c=ac(),t=c.currentTime;const o=c.createOscillator(),g=c.createGain(),fl=c.createBiquadFilter();o.type='triangle';o.frequency.setValueAtTime(f,t);fl.type='lowpass';fl.frequency.setValueAtTime(3200,t);fl.frequency.exponentialRampToValueAtTime(700,t+.6);g.gain.setValueAtTime(vol||.35,t);g.gain.exponentialRampToValueAtTime(.001,t+1.1);o.connect(fl);fl.connect(g);g.connect(sfxBus);o.start(t);o.stop(t+1.2)}
GAMES.p_lied=()=>new Promise(async done=>{const W2=phWho(2);const dur=W2.right?1.9:1.45;
 const o=await phShell('pl pl2','mg_laute','ort24',W2.name+' spielt das Wiegenlied','Die Töne gleiten über die Saiten der Walnusslaute auf dich zu. Drück unten den Knopf in der gleichen Farbe, sobald ein Ton im Ring liegt.');
 const C=['g','r','y','b'];const F=[262,330,392,523];
 // Saiten im Bild (Anteile der Bildbreite und Bildhöhe, gemessen an mg_laute 1536x2720): x = a + k*y
 const IW=1536,IH=2720,Y0=.31,Y1=.80;const S=[[.464,.4,.396,.8],[.487,.4,.463,.8],[.511,.4,.536,.8],[.536,.4,.607,.8]].map(([x0,y0,x1,y1])=>{const k=(x1-x0)/(y1-y0);return y=>x0+k*(y-y0)});
 const map=()=>{const W=o.clientWidth,H=o.clientHeight,s=Math.max(W/IW,H/IH),iw=IW*s,ih=IH*s;return {ox:(W-iw)/2,oy:(H-ih)/2,iw,ih}};
 const pt=(si,y)=>{const m=map();return {x:m.ox+S[si](y)*m.iw,y:m.oy+y*m.ih}};
 const rings=C.map((c,i)=>{const r=el('div','pl2-ring '+c,'<b></b>');o.appendChild(r);return r});
 const placeRings=()=>rings.forEach((r,i)=>{const p=pt(i,Y1);r.style.left=p.x+'px';r.style.top=p.y+'px'});placeRings();addEventListener('resize',placeRings);
 o.insertAdjacentHTML('beforeend','<div class="pl-btns pl3">'+C.map((c,i)=>'<button class="'+c+'" data-s="'+i+'"><i></i></button>').join('')+'</div><div class="pl-streak"></div>');
 // Leitlinie von jedem Ring zu seinem Knopf, damit klar ist, welcher Knopf zu welcher Saite gehört
 const guides=C.map(c=>{const g=el('div','pl3-guide '+c);o.appendChild(g);return g});
 const placeGuides=()=>{const R=o.getBoundingClientRect();const bs=[...o.querySelectorAll('.pl-btns button')];guides.forEach((g,i)=>{const p=pt(i,Y1);const b=bs[i].getBoundingClientRect();const bx=b.left+b.width/2-R.left,by=b.top+b.height*.2-R.top;const dx=bx-p.x,dy=by-p.y;g.style.left=p.x+'px';g.style.top=p.y+'px';g.style.height=Math.hypot(dx,dy)+'px';g.style.transform='rotate('+(Math.atan2(-dx,dy)*180/Math.PI)+'deg)'})};
 requestAnimationFrame(placeGuides);addEventListener('resize',placeGuides);
 // Wiegenlied: Saite und Zeitpunkt in Schlägen
 const SONG=[[2,0],[1,1],[0,2],[1,3],[2,4],[2,5],[2,6],[1,8],[1,9],[1,10],[2,12],[3,13],[3,14],[2,16],[1,17],[0,18],[1,19],[2,20],[2,21],[2,22],[1,23],[1,24],[2,25],[1,26],[0,28]];
 const beat=.55,lead=2.2;let t0=null,hits=0,streak=0,run=true;const notes=SONG.map(([s,b])=>({s,t:b*beat+lead,el:null,done:false}));
 notes.forEach(n=>{n.el=el('div','pl-gem '+C[n.s]);n.el.style.opacity=0;o.appendChild(n.el)});
 const flame=si=>{const r=rings[si];r.classList.remove('fire');void r.offsetWidth;r.classList.add('fire')};
 const press=si=>{if(!run||t0===null)return;const now=(performance.now()-t0)/1000;const r=rings[si];r.classList.add('on');setTimeout(()=>r.classList.remove('on'),130);const bb=o.querySelectorAll('.pl-btns button')[si];bb.classList.add('on');setTimeout(()=>bb.classList.remove('on'),130);
  let best=null;notes.forEach(n=>{if(!n.done&&n.s===si&&Math.abs(n.t-now)<.25&&(!best||Math.abs(n.t-now)<Math.abs(best.t-now)))best=n});
  if(best){best.done=true;hits++;streak++;pluck(F[si]);best.el.classList.add('hit');flame(si);const fb=el('div','pl-fb',Math.abs(best.t-now)<.09?'Perfekt':'Gut');o.appendChild(fb);setTimeout(()=>fb.remove(),600)}else{streak=0;pluck(F[si]*.94,.12)}
  o.querySelector('.pl-streak').textContent=streak>2?streak+' in Folge':''};
 o.querySelectorAll('.pl-btns button').forEach(b=>b.onpointerdown=e=>{e.preventDefault();press(+b.dataset.s)});
 const kb=e=>{const i='asdf'.indexOf(e.key);if(i>=0)press(i)};addEventListener('keydown',kb);
 const tick=()=>{if(!run)return;const now=(performance.now()-t0)/1000;const m=map();
  notes.forEach(n=>{if(!n.el)return;const u=1-(n.t-now)/dur;if(u<0){n.el.style.opacity=0;return}
   // Perspektive: am Kopf langsam und klein, zum Körper hin schneller und größer
   const e=Math.pow(Math.min(u,1.25),1.8),y=Y0+(Y1-Y0)*e;const x=m.ox+S[n.s](y)*m.iw,yy=m.oy+y*m.ih;const sz=8+30*Math.min(1.2,e);
   n.el.style.left=x+'px';n.el.style.top=yy+'px';n.el.style.width=sz+'px';n.el.style.opacity=u>1.2?0:1;
   if(!n.done&&now-n.t>.26){n.done=true;streak=0;n.el.classList.add('miss')}if(n.done&&now-n.t>.45&&n.el){n.el.remove();n.el=null}});
  bar(o,'Wiegenlied',hits/notes.length);
  if(now>notes[notes.length-1].t+1){run=false;removeEventListener('keydown',kb);removeEventListener('resize',placeRings);const q=hits/notes.length;phEnd(o,q>.75?'Vharkon gähnt. Der Aschesturm legt sich.':q>.4?'Ein paar Töne sind daneben, aber der Sturm wird schwächer.':'Schief, aber mit Herz. Der Sturm flaut trotzdem ab.').then(()=>done(q));return}
  requestAnimationFrame(tick)};
 setTimeout(()=>{t0=performance.now();tick()},700)});

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
  if(pos>=1){run=false;removeEventListener('pointerup',up);removeEventListener('pointercancel',up);removeEventListener('resize',place);phEnd(o,'Geschafft. Der Schattenschlüssel öffnet die Kruste über dem Herzen.').then(()=>done(Math.max(.3,1-caught*.2)));return}
  requestAnimationFrame(tick)};requestAnimationFrame(tick)});
// Bildmaße und Weg über den Drachenkörper (relativ zum Bild, unten Schwanz, oben Brust)
const PS_IMG=[1536,2720];const PS_EYE=[.34,.225];const PS_PATH=[[.72,.86],[.5,.9],[.3,.88],[.17,.8],[.2,.72],[.38,.66],[.52,.58],[.55,.48],[.5,.4],[.57,.31]];

// Phase 5: Das Herz. Halte die Sonnenkerze ruhig in der warmen Zone, bis die Asche schmilzt.
GAMES.p_herz=()=>new Promise(async done=>{const W4=phWho(4);const zone=W4.right?.26:.18;
 const o=await phShell('ph','mg_herz','ort24',W4.name+' mit der Sonnenkerze','Halte gedrückt, damit die Flamme steigt, lass los, damit sie sinkt. Bleib im goldenen Bereich, bis die Asche geschmolzen ist.');
 o.insertAdjacentHTML('beforeend','<div class="ph-glow"></div><div class="ph-meter"><i class="z"></i><i class="f"></i></div><img class="ph-k" src="'+A+'items/sonnenkerze.png" alt="">');
 const btn=el('button','pbtn big ps-go','Kerze heben');o.appendChild(btn);
 let v=.3,vel=0,hold=false,prog=0,zc=.5,run=true,last=performance.now();
 const down=e=>{e.preventDefault();hold=true},up=()=>{hold=false};btn.addEventListener('pointerdown',down);addEventListener('pointerup',up);
 const z=o.querySelector('.ph-meter .z'),f=o.querySelector('.ph-meter .f'),gl=o.querySelector('.ph-glow');
 const tick=t=>{if(!run)return;const dt=Math.min(.05,(t-last)/1000);last=t;const s=t/1000;
  zc=.5+.28*Math.sin(s*.8)+.08*Math.sin(s*2.1);vel+=(hold?1.5:-1.3)*dt;vel*=.9;v=Math.max(0,Math.min(1,v+vel*dt*2.2));
  const inZ=Math.abs(v-zc)<zone/2;if(inZ)prog+=dt*.11;else prog=Math.max(0,prog-dt*.02);
  z.style.bottom=((zc-zone/2)*100)+'%';z.style.height=(zone*100)+'%';f.style.bottom=(v*100)+'%';f.classList.toggle('in',inZ);gl.style.opacity=.15+prog*.85;bar(o,'Wärme',prog);
  if(prog>=1){run=false;removeEventListener('pointerup',up);sfx('feuer_entfacht',.8);phEnd(o,'Die Asche schmilzt. Darunter glimmt etwas.').then(()=>done(1));return}
  requestAnimationFrame(tick)};requestAnimationFrame(tick)});
