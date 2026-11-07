// Zwischensequenzen: gemalte Bilder mit Kamerafahrt, Stimme, Musik, Untertitel
// Jede Einstellung: {img, pan, s (Sprecher), t (Text), sfx, mus, card (Bild statt Text), d (Dauer ohne Stimme)}
let filmRun=0;
async function playFilm(key){const F=FILMS[key];if(!F)return;show('#s-film');const run=++filmRun;const f=$('#film');f.innerHTML='';const sub=$('#film-sub');sub.classList.remove('on');
 let skip=false;$('#btn-skip').onclick=()=>{skip=true;stopVo();filmRun++};accents(null);
 let n=0,curImg=null;
 for(const sh of F.shots){if(skip||run!==filmRun)break;
  if(sh.mus!==undefined)music(sh.mus?A+'mus/'+sh.mus+'.mp3':null,sh.mv??.55);
  if(sh.atmo!==undefined)atmo(sh.atmo?A+'atmo/'+sh.atmo+'.mp3':null,.4);
  if(sh.sfx)sfx(sh.sfx,sh.v);
  if(sh.img&&sh.img!==curImg){curImg=sh.img;const d=el('div','fs'+(sh.pan?' pan':'')+(sh.tilt?' tilt':''),'<div class="bg" style="background-image:url('+A+'img/'+sh.img+'.jpg)"></div><div class="shade"></div>');d._t0=performance.now();d._pan=!!sh.pan;if(sh.fx)skyFx(d.querySelector('.bg'),sh.fx,sh.fxo);if(sh.fx2)skyFx(d.querySelector('.bg'),sh.fx2,{});f.appendChild(d);requestAnimationFrame(()=>requestAnimationFrame(()=>{[...f.children].forEach(x=>x.classList.toggle('on',x===d))}));setTimeout(()=>{[...f.children].forEach(x=>{if(x!==d&&!x.classList.contains('on'))x.remove()})},1500)}
  if(sh.fade){const fd=sh.fade;setTimeout(()=>{if(run!==filmRun)return;sfx(fd.sfx||'wind_boe',.7);const base=[...f.children].reverse().find(x=>x._t0);const el0=base?performance.now()-base._t0:0;const d=el('div','fs slow'+(base&&base._pan?' pan':''),'<div class="bg" style="background-image:url('+A+'img/'+fd.img+'.jpg);animation-delay:-'+Math.round(el0)+'ms"></div><div class="shade"></div>');d._t0=base?base._t0:performance.now();d._pan=base&&base._pan;f.appendChild(d);curImg=fd.img;requestAnimationFrame(()=>requestAnimationFrame(()=>d.classList.add('on')))},fd.at)}
  if(sh.card){const c=el('div','fs on','<div class="fcard"><img src="'+A+'ui/'+sh.card+'.png" alt=""></div>');f.appendChild(c)}
  if(sh.fn==='titel'){sub.classList.remove('on');await titleReveal(f,()=>skip||run!==filmRun);curImg=null;continue}
  if(sh.fn==='ballade'){sub.classList.remove('on');await playSong(ballade(),.95,45);continue}
  if(sh.fn==='abspann'){sub.classList.remove('on');music(null);const lines=[['GR','Ich kann jetzt bis acht zählen. Herbert ist sehr stolz.'],['ZI','Nächstes Jahr: Welttournee. Erste Station: Pilzbühne.'],['HU','Ich hab übrigens noch was von euch allen in meiner Schürze. Holt es euch ab.'],['NA','Mir hat es nicht gefallen. Überhaupt nicht. Ich komme nächstes Jahr wieder. Um mich zu beschweren.'],['VH','Danke.']];
   const p=playSong('zirpia_13',.9);await sleep(9000);for(const [k,t] of lines){if(skip)break;sub.innerHTML='<i>'+WHO[k].n+'</i>'+t;sub.classList.add('on');await sleep(Math.max(5000,t.length*70));sub.classList.remove('on');await sleep(2500)}await p;continue}
  if(sh.black){[...f.children].forEach(x=>x.classList.remove('on'))}
  if(sh.t){n++;const male=sh.tm&&st.hero&&!st.hero.f;const vo=A+'vo/f_'+key+'_'+String(n).padStart(3,'0')+(male?'m':'')+'.mp3';const who=WHO[sh.s]||WHO.SL;
   sub.classList.remove('on');await sleep(150);sub.innerHTML=(sh.s&&sh.s!=='SL'?'<i>'+who.n+'</i>':'')+T(male?sh.tm:sh.t);sub.classList.add('on');
   const a=playVo(vo);const ok=await Promise.race([voDone(a),sleep(400).then(()=>a&&!a._err?null:false)]);
   if(ok===null)await voDone(a);else if(ok===false)await sleep(Math.max(2200,sh.t.length*62));
   await sleep(sh.gap??350)}
  else await sleep(sh.d||1800);
 }
 sub.classList.remove('on');stopVo();await sleep(400)}

// Der große Auftritt: Würfel rollt, kritische 20, Lichtschlag, Logo
async function titleReveal(f,stop){const w=t=>stop()?Promise.resolve():sleep(t);
 const o=el('div','ttl','<div class="ttl-bg" style="background-image:url('+A+'img/f_intro5.jpg)"></div><div class="ttl-flash"></div><div class="ttl-rays"></div><div class="ttl-embers"></div><div class="ttl-logo"><div class="lg"><img class="lg-base" src="'+A+'ui/logo_base.png" alt=""><img class="lg-dr" src="'+A+'ui/logo_drache.png" alt=""><i class="lg-glow"></i><img class="lg-fl" src="'+A+'ui/flamme.png" alt=""></div><div class="ttl-sub"></div></div>');
 f.appendChild(o);[...f.children].forEach(x=>{if(x!==o)x.classList.remove('on')});
 const em=o.querySelector('.ttl-embers');for(let i=0;i<34;i++){const e=el('i','');e.style.left=Math.random()*100+'%';e.style.animationDelay=(Math.random()*4)+'s';e.style.animationDuration=(3+Math.random()*3)+'s';const z=2+Math.random()*4;e.style.width=e.style.height=z+'px';em.appendChild(e)}
 music(null);sfx('trommel',.9);requestAnimationFrame(()=>o.classList.add('s1'));await w(700);
 sfx('wuerfel',1);await w(1500);
 o.classList.add('s2');await w(900);
 sfx('kritisch',1);o.classList.add('s3');await w(260);
 o.classList.add('s4');sfx('fanfare',.9);music(A+'mus/titel.mp3',.55);await w(1300);
 sfx('drache',.5);o.classList.add('s5');
 const t='Der Hort des Aschenkönigs',sb=o.querySelector('.ttl-sub');for(const c of t){if(stop())break;sb.innerHTML+=c===' '?' ':'<span>'+c+'</span>';await sleep(55)}
 await w(2400);
 // Nahaufnahme: der kleine Drache dreht den Kopf, holt Luft und spuckt Feuer auf uns zu
 const dv=el('div','drv');o.appendChild(dv);const fr=[1,2,3,5,6].map(i=>{const d=el('div','drf','');d.style.backgroundImage='url('+A+'img/f_dr'+i+'.jpg)';dv.appendChild(d);return d});
 const showF=i=>fr.forEach((d,k)=>d.classList.toggle('on',k===i));
 o.classList.add('zoomin');await w(450);dv.classList.add('on');showF(0);await w(900);
 showF(1);fr[1].classList.add('turn');sfx('drachenknurren',.6);await w(1000);
 showF(2);fr[2].classList.add('inhale');sfx('wind_boe',.7);await w(1100);
 showF(3);fr[3].classList.add('glow');sfx('feuer_entfacht',.7);await w(650);
 showF(4);fr[4].classList.add('rush');sfx('feuerball',1);await w(420);
 const fb=el('div','fball','<img src="'+A+'ui/feuerball.png" alt="">');const R=f.getBoundingClientRect();fb.style.left=(R.width/2)+'px';fb.style.top=(R.height/2)+'px';f.appendChild(fb);
 requestAnimationFrame(()=>requestAnimationFrame(()=>fb.classList.add('go')));
 await w(1000);o.remove();music(A+'mus/intro.mp3',.45);fb.classList.add('gone');setTimeout(()=>fb.remove(),1300)}

// Lebendiger Himmel über den gemalten Bildern
function skyFx(d,kind,o){const L=el('div','sky '+kind);d.appendChild(L);o=o||{};if(o.clip)L.style.clipPath='polygon('+o.clip+')';
 if(kind.includes('twinkle'))for(let i=0;i<26;i++){const t=el('i','tw');t.style.left=Math.random()*100+'%';t.style.top=Math.random()*(o.sky||40)+'%';t.style.animationDelay=(Math.random()*3)+'s';t.style.animationDuration=(1.6+Math.random()*2.4)+'s';L.appendChild(t)}
 if(kind.includes('shoot')){const go=()=>{if(!L.isConnected)return;const s=el('i','sh');s.style.left=(10+Math.random()*70)+'%';s.style.top=(2+Math.random()*(o.sky||30)*.7)+'%';L.appendChild(s);setTimeout(()=>s.remove(),1400);setTimeout(go,900+Math.random()*1600)};setTimeout(go,400)}
 if(kind.includes('snow'))L.appendChild(el('div','sn'));
 if(kind.includes('lantern'))for(let i=0;i<16;i++){const t=el('i','ln');t.style.left=(5+Math.random()*90)+'%';t.style.animationDelay=(Math.random()*7)+'s';t.style.animationDuration=(7+Math.random()*5)+'s';L.appendChild(t)}
 if(kind.includes('flare')){const f=el('i','fl');f.style.left=(o.x||50)+'%';f.style.top=(o.y||15)+'%';L.appendChild(f)}}

const FILMS={
 intro:{shots:[
  {black:1,sfx:'trommel',d:1600,mus:null},
  {img:'f_intro1',tilt:1,mus:'intro',fx2:'snow',fx:'twinkle shoot',fxo:{sky:20,clip:'0 0,100% 0,100% 22%,90% 24%,80% 23%,72% 27%,60% 26%,48% 22%,40% 20%,34% 17%,28% 21%,18% 22%,8% 25%,0 26%'},s:'SL',t:'In einer Zeit vor unserer Zeit …'},
  {img:'f_intro1',s:'SL',t:'… in einem Königreich voller Licht …'},
  {img:'f_intro2',pan:0,fx2:'lantern',fx:'twinkle shoot flare',fxo:{sky:40,x:50,y:26.7,clip:'0 0,100% 0,100% 49%,88% 49%,82% 51%,74% 54%,62% 55%,48% 54%,36% 52%,26% 48%,18% 46%,10% 48%,0 50%'},s:'SL',t:'… feierte man jedes Jahr die Lichternacht.'},
  {img:'f_tisch',mus:null,sfx:'plattenkratzer',s:'SL',t:'Moment. Moment. Falsche Seite.'},
  {sfx:'pergament',s:'SL',t:'Das ist … mein Einkaufszettel.'},
  {sfx:'pergament',s:'SL',t:'So. Jetzt.'},
  {img:'f_wg1',mus:null,s:'WG',t:'Wir warten.'},
  {s:'SL',t:'Ach so. Darf ich vorstellen: Meisterin Wendelgard. Sie hat schon tausend Abenteuer geleitet. Ich bisher … keins.'},
  {s:'WG',t:'Null. Er hat null Abenteuer geleitet.'},
  {s:'SL',t:'Heute beginnt meine Probezeit. Vierundzwanzig Nächte. Wenn sie am Ende zufrieden ist, bin ich ein echter Spielleiter.'},
  {img:'f_wg2',s:'WG',t:'Und wenn nicht, sortiert er wieder Würfel. Nach Farben.'},
  {img:'f_wg3',sfx:'rohrpost',s:'SL',t:'Sie schreibt alles mit. Und wenn ihr etwas auffällt, schickt sie mir einen Zettel. Per Rohrpost.'},
  {img:'f_wg4',s:'WG',t:'Fang an.'},
  {img:'f_tisch',s:'SL',t:'Ja. Natürlich. Also.'},
  {img:'f_intro3',mus:'intro_dunkel',s:'SL',t:'Doch seit sechzig Jahren ist der Lichternachtstern nicht mehr aufgegangen. Und in diesem Winter … verschwinden auch die Lichter in den Fenstern.'},
  {img:'f_intro4',s:'SL',t:'Vharkon. Der Aschenkönig. Jede Nacht holt er sich ein Licht. Und niemand weiß, warum.'},
  {img:'ort01',s:'SL',t:'In vierundzwanzig Nächten ist Lichternacht. Wenn bis dahin das letzte Licht erlischt … bleibt Eldmark für immer im Dunkeln.',fade:{img:'ort01_dunkel',at:5200,sfx:'laterne_zischt'}},
  {img:'ort01_dunkel',s:'SL',t:'Das Königreich braucht eine Heldin. Oder einen Helden. Jemand Mutigen. Jemand Starken. Jemand …'},
  {s:'SL',t:'… Verfügbaren.'},
  {img:'f_held1',pan:1,mus:'intro_dunkel',s:'SL',t:'Irgendwo in Morgentau liegt in dieser Nacht jemand wach. Jemand, den noch niemand kennt.'},
  {img:'f_held2',sfx:'tuer_knarzt',s:'SL',t:'Wie diese Gestalt aussieht? Wie sie heißt? Was sie kann? Das steht noch in keinem Buch.'},
  {img:'f_held3',sfx:'gegenstand',s:'SL',t:'Nur eins steht fest. Sie nimmt eine Laterne mit. Einen Rucksack. Und ziemlich viel Mut.'},
  {img:'f_held4',pan:1,mus:'intro',s:'SL',t:'Alles andere … entscheidest du.',gap:900},
  {fn:'titel'},
  {img:'f_tisch',s:'SL',t:'Gut. Dann beginnt das Abenteuer. Und zwar mit dir.'}
 ]}
};
