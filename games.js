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
function playSong(name,vol,max){stopSong();if(!st.sound)return Promise.resolve();ac();const a=new Audio(A+'songs/'+name+'.mp3');a.volume=vol??.9;songEl=a;duck(true);
 return new Promise(r=>{let t=null;const end=()=>{clearTimeout(t);if(songEl===a){songEl=null;duck(false)}r()};a.onended=end;a.onerror=end;a.play().catch(end);if(max)t=setTimeout(()=>{fadeOut(a).then(end)},max*1000)})}
function fadeOut(a){return new Promise(r=>{const iv=setInterval(()=>{a.volume=Math.max(0,a.volume-.06);if(a.volume<=.01){clearInterval(iv);a.pause();r()}},60)})}
function stopSong(){if(songEl){try{songEl.pause()}catch(e){}songEl=null;duck(false)}}
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
GAMES.takt=()=>new Promise(async done=>{
 const area=gameShell('Im Takt bleiben','Tippe auf die Trommel, wenn der Ring sie erreicht. Je genauer, desto lauter jubeln die Schnecken.');
 area.innerHTML='<div class="tk-wrap"><div class="tk-ring"></div><button class="tk-drum"><img src="'+A+'ui/trommel.png" alt=""></button><div class="tk-score">0 Treffer</div></div>';
 const drum=area.querySelector('.tk-drum'),ring=area.querySelector('.tk-ring');const beats=16,iv=650;let hits=0,beatAt=0;
 drum.onclick=()=>{const d=Math.abs(performance.now()-beatAt);drum.classList.remove('hit');void drum.offsetWidth;drum.classList.add('hit');if(d<170){hits++;area.querySelector('.tk-score').textContent=hits+' Treffer';sfx('treffer',.25)}};
 for(let i=0;i<beats;i++){ring.classList.remove('go');void ring.offsetWidth;ring.classList.add('go');await sleep(iv);beatAt=performance.now();tone(110,.12)}
 await sleep(500);gameEnd();toast(hits>12?'Tosender Applaus!':hits>6?'Die Schnecken wippen begeistert.':'Höflicher Applaus. Sehr langsamer Applaus.');sfx('sieg',.6);done()});

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

// Tag 16: Schlösser knacken. Tippen, wenn der Stift oben glänzt.
GAMES.schloss=()=>new Promise(done=>{
 const area=gameShell('Schlösser knacken','Tippe genau dann, wenn der Stift oben glänzt. Ein Fehler setzt nur den aktuellen Stift zurück.');
 const easy=st.hero.skills.includes('finger');const locks=[3,4,5];let li=0,pin=0,errs=0;
 area.innerHTML='<div class="sl-box"><img class="sl-img" src="'+A+'ui/schloss.png" alt=""><div class="sl-pins"></div></div><div class="kt-st sl-st"></div><div class="g-row"><button class="pbtn sl-go">Jetzt!</button></div><div class="g-row sl-help"></div>';
 const pins=area.querySelector('.sl-pins');let shine=false,t=null;
 const draw=()=>{pins.innerHTML='';for(let i=0;i<locks[li];i++)pins.appendChild(el('i',i<pin?'set':i===pin?'cur':''));area.querySelector('.sl-st').textContent='Kiste '+(li+1)+' von 3';};
 const tick=()=>{clearTimeout(t);shine=!shine;const c=pins.querySelector('.cur');if(c)c.classList.toggle('shine',shine);t=setTimeout(tick,shine?(easy?620:430):700+Math.random()*700)};
 const ok=async()=>{pin++;sfx('stein',.5);if(pin>=locks[li]){sfx('truhe');pin=0;li++;if(li>=3){clearTimeout(t);gameEnd();return done()}}draw()};
 area.querySelector('.sl-go').onclick=async()=>{if(shine)return ok();sfx('falsch',.5);errs++;if(errs>=3&&!area.querySelector('.sl-hu')){const b=el('button','lnk sl-hu','Oma Hulda machen lassen');b.onclick=()=>{clearTimeout(t);gameEnd();toast('Hulda: Kindchen, gib mal her.');done()};area.querySelector('.sl-help').appendChild(b)}};
 draw();tick()});

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
async function keyProbe(i){const P=PHASEN[i];const plan=st.flags.plan||{};
 const right=plan[i]===P[1];const unitN={held:heroName(),gr:'Grumbold',zi:'Zirpia',hu:'Oma Hulda',na:'Nachtigall'};
 let ziel=right&&has(P[2])?8:16;if(i===2&&st.flags.traum)return true;
 for(let tries=0;tries<6;tries++){const bonus=(P[1]==='held'?Math.max(st.hero.str,st.hero.dex,st.hero.wis):4)+(st.flags.trust>0&&P[1]!=='held'?3:0);
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
