// Zwischensequenzen: gemalte Bilder mit Kamerafahrt, Stimme, Musik, Untertitel
// Jede Einstellung: {img, pan, s (Sprecher), t (Text), sfx, mus, card (Bild statt Text), d (Dauer ohne Stimme)}
let filmRun=0;
async function playFilm(key){const F=FILMS[key];if(!F)return;stopSfx(.4);show('#s-film');const run=++filmRun;const f=$('#film');f.innerHTML='';const sub=$('#film-sub');sub.classList.remove('on');
 let skip=false;$('#btn-skip').onclick=()=>{skip=true;stopVo();filmRun++};accents(null);
 let n=0,curImg=null;const FIMG={};F.shots.forEach(sh=>{if(sh.img&&!FIMG[sh.img]){FIMG[sh.img]=0;const im=new Image();im.onload=()=>FIMG[sh.img]=1;im.onerror=()=>FIMG[sh.img]=-1;im.src=A+'img/'+sh.img+'.jpg'}});await sleep(150);
 for(const sh of F.shots){if(skip||run!==filmRun)break;if(sh.img&&FIMG[sh.img]===-1&&!sh.t&&!sh.fn){continue}
  if(sh.mus!==undefined)music(sh.mus?A+'mus/'+sh.mus+'.mp3':null,sh.mv??.55);
  if(sh.atmo!==undefined)atmo(sh.atmo?A+'atmo/'+sh.atmo+'.mp3':null,.4);
  if(sh.sfx)sfx(sh.sfx,sh.v);
  const showImg=(sh)=>{const fit=false;const d=el('div','fs'+(sh.pan?' pan':'')+(sh.tilt?' tilt':'')+(fit?' fit':''),(fit?'<div class="bgb" style="background-image:url('+A+'img/'+sh.img+'.jpg)"></div>':'')+'<div class="bg" style="background-image:url('+A+'img/'+sh.img+'.jpg)"></div><div class="shade"></div>');d._t0=performance.now();d._pan=!!sh.pan;if(sh.fx)skyFx(d.querySelector('.bg'),sh.fx,sh.fxo);if(sh.fx2)skyFx(d.querySelector('.bg'),sh.fx2,{});f.appendChild(d);requestAnimationFrame(()=>requestAnimationFrame(()=>{[...f.children].forEach(x=>x.classList.toggle('on',x===d))}));setTimeout(()=>{[...f.children].forEach(x=>{if(x!==d&&!x.classList.contains('on'))x.remove()})},1500)};
  if(sh.img&&sh.img!==curImg&&FIMG[sh.img]!==-1){curImg=sh.img;showImg(sh)}
  if(sh.card){const c=el('div','fs on','<div class="fcard"><img src="'+A+'ui/'+sh.card+'.png" alt=""></div>');f.appendChild(c)}
  if(sh.fn==='titel'){sub.classList.remove('on');await titleReveal(f,()=>skip||run!==filmRun);curImg=null;continue}
  if(sh.fn==='ballade'){sub.classList.remove('on');const nm=ballade();const tm=[];const L=LYR[nm]||[];await playSong(nm,.95,LYRMAX[nm]||45,()=>{const cue=(a,b,h)=>{tm.push(setTimeout(()=>{if(run!==filmRun)return;sub.innerHTML=h;sub.classList.add('on')},a*1000));tm.push(setTimeout(()=>sub.classList.remove('on'),b*1000))};if(L[0])cue(.6,L[0][0]-.6,'<i>Zirpia singt</i>Die Ballade von Zirpia der Großen');const shw=im=>{const t=new Image();t.onload=()=>{if(run!==filmRun)return;curImg=im;showImg({img:im})};t.src=A+'img/'+im+'.jpg'};tm.push(setTimeout(()=>shw('bl0'),300));L.forEach(([a0,b0,i])=>tm.push(setTimeout(()=>shw(['bl1','bl2','bl3','bl4'][i]),Math.max(0,a0-.4)*1000)));L.forEach(([a,b,i])=>cue(a,b,'<i>Zirpia</i>'+BALLADE[i]))});tm.forEach(clearTimeout);sub.classList.remove('on');continue}
  if(sh.fn==='abspann'){sub.classList.remove('on');music(null);const lines=[['GR','Ich kann jetzt bis acht zählen. Herbert ist sehr stolz.'],['ZI','Nächstes Jahr: Welttournee. Erste Station: Pilzbühne.'],['HU','Ich hab übrigens noch was von euch allen in meiner Schürze. Holt es euch ab.'],['NA','Mir hat es nicht gefallen. Überhaupt nicht. Ich komme nächstes Jahr wieder. Um mich zu beschweren.'],['VH','Danke.']];
   const p=playSong('zirpia_13',.9);const AL=['f_intro2','ort01','f_tav_kap','f_wirt2','f_gr_licht','f_kiste4','f_z1c','f_schild_m','ort08','f_zi1','bl3','zs1','hx2','kr3','hu2','f_markt','zm3','hd2','f_z4b','zo2','et2','fl1','f_z5c','ph1','ph3','ph5','vh_warm','f_z7e','za1','za2','za8','f_final'];const ai=[];AL.forEach(n=>{const im=new Image();im.onload=()=>ai.push(n);im.src=A+'img/'+n+'.jpg'});let ak=0;const at=setInterval(()=>{if(run!==filmRun||!ai.length){if(run!==filmRun)clearInterval(at);return}const ord=AL.filter(n=>ai.includes(n));if(ak>=ord.length){clearInterval(at);return}curImg=ord[ak];showImg({img:curImg});ak++},2900);p.then(()=>clearInterval(at));await sleep(9000);for(const [k,t] of lines){if(skip)break;sub.innerHTML='<i>'+WHO[k].n+'</i>'+t;sub.classList.add('on');await sleep(Math.max(5000,t.length*70));sub.classList.remove('on');await sleep(2500)}await p;continue}
  if(sh.black){[...f.children].forEach(x=>x.classList.remove('on'))}
  if(sh.t){n++;const male=sh.tm&&st.hero&&!st.hero.f;const vo=A+'vo/f_'+key+'_'+String(n).padStart(3,'0')+(male?'m':'')+'.mp3';const who=WHO[sh.s]||WHO.SL;
   let wgBackImg=null;if(sh.s==='WG'&&!/^(f_wg|wgc)/.test(curImg||'')){wgBackImg=curImg;curImg=sh.wg||'wgc7';sfx('pergament',.5);showImg({img:curImg})}
   sub.classList.remove('on');await sleep(150);sub.innerHTML=(sh.s&&sh.s!=='SL'?'<i>'+who.n+'</i>':'')+T(male?sh.tm:sh.t);sub.classList.add('on');
   const a=playVo(vo);if(sh.fade){const fd=sh.fade;const doFade=()=>{if(run!==filmRun)return;sfx(fd.sfx||'wind_boe',.7);const base=[...f.children].reverse().find(x=>x._t0);const el0=base?performance.now()-base._t0:0;const d=el('div','fs slow'+(base&&base._pan?' pan':''),'<div class="bg" style="background-image:url('+A+'img/'+fd.img+'.jpg);animation-delay:-'+Math.round(el0)+'ms"></div><div class="shade"></div>');d._t0=base?base._t0:performance.now();d._pan=base&&base._pan;f.appendChild(d);curImg=fd.img;requestAnimationFrame(()=>requestAnimationFrame(()=>d.classList.add('on')))};const t0=performance.now();const wt=setInterval(()=>{if(run!==filmRun){clearInterval(wt);return}if((a&&a.s)||!a||a._err||performance.now()-t0>4000){clearInterval(wt);setTimeout(doFade,fd.at)}},50)}const ok=await Promise.race([voDone(a),sleep(400).then(()=>a&&!a._err?null:false)]);
   if(ok===null)await voDone(a);else if(ok===false)await sleep(Math.max(2200,sh.t.length*62));
   if(wgBackImg){curImg=wgBackImg;showImg({img:wgBackImg})}
   await sleep(sh.gap??350)}
  else await sleep(sh.d||1800);
 }
 sub.classList.remove('on');stopVo();stopSfx(.6);await sleep(400)}

// Der große Auftritt: Würfel rollt, kritische 20, Lichtschlag, Logo
const DRF=[0,1,2,3].map(i=>{const im=new Image();im.src=A+'ui/dr_s_'+i+'.png';return im});
async function titleReveal(f,stop){const w=t=>stop()?Promise.resolve():sleep(t);
 const o=el('div','ttl','<div class="ttl-bg" style="background-image:url('+A+'img/f_intro5.jpg)"><i class="ttl-glow"></i></div><div class="ttl-flash"></div><div class="ttl-rays"></div><div class="ttl-embers"></div><div class="ttl-logo"><div class="lg"><img class="lg-base" src="'+A+'ui/logo_leer.png" alt=""><img class="lg-dr" src="'+A+'ui/logo_drache.png" alt=""><i class="lg-glow"></i><img class="lg-fl" src="'+A+'ui/flamme.png" alt=""></div><div class="ttl-sub"></div></div>');
 f.appendChild(o);[...f.children].forEach(x=>{if(x!==o)x.classList.remove('on')});
 const em=o.querySelector('.ttl-embers');for(let i=0;i<34;i++){const e=el('i','');e.style.left=Math.random()*100+'%';e.style.animationDelay=(Math.random()*4)+'s';e.style.animationDuration=(3+Math.random()*3)+'s';const z=2+Math.random()*4;e.style.width=e.style.height=z+'px';em.appendChild(e)}
 music(null);sfx('trommel',.9);requestAnimationFrame(()=>o.classList.add('s1'));await w(500);
 sfx('wuerfel',1);await w(1500);
 // langsame Fahrt auf die 20, die Zahl beginnt golden zu glühen
 o.classList.add('s2');sfx('zauber',.5);await w(2100);
 // das Licht der 20 flutet das Bild
 sfx('kritisch',1);o.classList.add('s3');await w(900);
 // aus dem Licht erscheint das Logo
 o.classList.add('s4');sfx('fanfare',.9);music(A+'mus/titel.mp3',.55);await w(1700);
 sfx('drache',.5);o.classList.add('s5');
 const t='Der Hort des Aschenkönigs',sb=o.querySelector('.ttl-sub');for(const c of t){if(stop())break;sb.innerHTML+=c===' '?' ':'<span>'+c+'</span>';await sleep(55)}
 await w(2400);
 // Totale: der kleine Drache auf dem Schild dreht den Kopf, holt Luft und spuckt Feuer zu uns herunter
 const lg=o.querySelector('.lg'),dr=o.querySelector('.lg-dr');const ds=el('img','lg-ds');ds.src=A+'ui/dr_s_0.png';lg.appendChild(ds);
 try{await Promise.all(DRF.map(i=>i.decode()))}catch(e){}
 // weiche Überblendung vom gemalten Logo Drachen in die bewegten Bilder
 dr.style.transition='opacity .45s';ds.classList.add('on');dr.style.opacity=0;await w(650);
 ds.src=A+'ui/dr_s_1.png';ds.className='lg-ds on look';sfx('drachenknurren',.6);await w(1000);
 ds.src=A+'ui/dr_s_2.png';ds.className='lg-ds on breath';sfx('wind_boe',.7);await w(1150);
 ds.src=A+'ui/dr_s_3.png';ds.className='lg-ds on spit';sfx('feuerball',1);sfx('feuer_entfacht',.8);
 const r=ds.getBoundingClientRect(),R=f.getBoundingClientRect();
 const fb=el('div','fball','<img src="'+A+'ui/feuerball.png" alt="">');fb.style.left=(r.left-R.left+r.width*.17)+'px';fb.style.top=(r.top-R.top+r.height*.8)+'px';f.appendChild(fb);
 requestAnimationFrame(()=>requestAnimationFrame(()=>fb.classList.add('go')));
 await w(1150);o.remove();music(A+'mus/intro.mp3',.45);fb.classList.add('gone');setTimeout(()=>fb.remove(),1300)}

// Lebendiger Himmel über den gemalten Bildern
function skyFx(d,kind,o){const L=el('div','sky '+kind);d.appendChild(L);o=o||{};if(o.clip)L.style.clipPath='polygon('+o.clip+')';
 if(kind.includes('twinkle'))for(let i=0;i<26;i++){const t=el('i','tw');t.style.left=Math.random()*100+'%';t.style.top=Math.random()*(o.sky||40)+'%';t.style.animationDelay=(Math.random()*3)+'s';t.style.animationDuration=(1.6+Math.random()*2.4)+'s';L.appendChild(t)}
 if(kind.includes('shoot')){const go=()=>{if(!L.isConnected)return;const s=el('i','sh');s.style.left=(10+Math.random()*70)+'%';s.style.top=(2+Math.random()*(o.sky||30)*.7)+'%';L.appendChild(s);setTimeout(()=>s.remove(),1400);setTimeout(go,900+Math.random()*1600)};setTimeout(go,400)}
 if(kind.includes('snow'))L.appendChild(el('div','sn'));
 if(kind.includes('lantern'))for(let i=0;i<16;i++){const t=el('i','ln');t.style.left=(5+Math.random()*90)+'%';t.style.animationDelay=(Math.random()*7)+'s';t.style.animationDuration=(7+Math.random()*5)+'s';L.appendChild(t)}
 if(kind.includes('flare')){const f=el('i','fl');f.style.left=(o.x||50)+'%';f.style.top=(o.y||15)+'%';L.appendChild(f)}}

// Zirpias Ballade: Text und Einsätze der vier Fassungen (Sekunden ab Liedbeginn)
const BALLADE=['Ich bin nicht größer als ein Daumen, nicht mehr,<br>doch sing ich lauter als ein ganzer Bär.','Nach meinem Auftritt wirft man mir nie Hosen,<br>man wirft mir duftende, rote Rosen.','Zirpia, Zirpia, die Größte im Land,<br>mit Walnussgeige und Federhut in der Hand.','Die Spinne hielt mich fest, ich sang ganz laut,<br>da hat sie mich verliebt angeschaut.','Und ist mein Lied auch viel zu lang, juchhei,<br>es ist erst morgen früh vorbei.'];
const LYR={zirpia_02:[[4.5,14.9,0],[15.1,23.9,1],[25.7,33.7,2],[34.1,42.9,3]],zirpia_03:[[21.3,29.8,0],[30,38.2,1],[38.8,45.8,2]],zirpia_04:[[18.1,26.8,0],[27,35,1],[36,44.6,2]],zirpia_05:[[7.9,17.6,0],[17.8,26.1,1],[26.2,34.5,2],[34.8,43.1,3]]};
const LYRMAX={zirpia_02:44,zirpia_03:47.5,zirpia_04:46,zirpia_05:44.5};
const FILMS={
 intro:{shots:[
  {black:1,sfx:'trommel',d:1600,mus:null},
  {img:'f_mk1',mus:'intro',fx2:'snow',s:'SL',t:'In einer Zeit vor unserer Zeit … zog ein einsamer Held aus, um das Unmögliche zu wagen.'},
  {img:'f_mk2',s:'SL',t:'Vor ihm lagen die Hallen der tausend Regale. Endlos. Gnadenlos. Gut klimatisiert.'},
  {img:'f_mk3',s:'SL',t:'Sein erstes Ziel: die heilige Milch. Drei Komma fünf Prozent. Nur für die Tapfersten.'},
  {img:'f_mk4',s:'SL',t:'Dann die zwölf Eier der Prophezeiung. Er öffnete die Schachtel. Er prüfte jedes einzelne.'},
  {img:'f_mk5',s:'SL',t:'Und dann kam die letzte Prüfung. Die Kasse. Nur eine hatte geöffnet. Und vor ihm stand ein Mann, der mit Kleingeld bezahlte.'},
  {img:'f_tisch',mus:null,sfx:'plattenkratzer',s:'SL',t:'Moment.'},
  {sfx:'pergament',s:'SL',t:'Das ist … mein Einkaufszettel.'},
  {sfx:'buch_zu',s:'SL',t:'So. Jetzt aber richtig.'},
  {img:'f_wg1',mus:null,s:'WG',t:'Wir warten.'},
  {s:'SL',t:'Ach so. Darf ich vorstellen: Meisterin Wendelgard. Sie hat schon tausend Abenteuer geleitet. Ich bisher … keins.'},
  {s:'WG',t:'Null. Er hat null Abenteuer geleitet.'},
  {s:'SL',t:'Heute beginnt meine Probezeit. Vierundzwanzig Nächte. Wenn sie am Ende zufrieden ist, bin ich ein echter Spielleiter.'},
  {img:'f_wg2',s:'WG',t:'Und wenn nicht, sortiert er wieder Würfel. Nach Farben.'},
  {img:'f_wg3',sfx:'rohrpost',s:'SL',t:'Sie schreibt alles mit. Und wenn ihr etwas auffällt, schickt sie mir einen Zettel. Per Rohrpost.'},
  {img:'f_wg4',s:'WG',t:'Fang an.'},
  {img:'f_tisch',s:'SL',t:'Ja. Natürlich. Also.'},
  {img:'f_intro1',tilt:1,mus:'intro',fx2:'snow',fx:'twinkle shoot',fxo:{sky:23,clip:'0 0,100% 0,100% 24.6%,90% 26.1%,80% 25.4%,72% 28.4%,60% 27.6%,48% 24.6%,40% 23.1%,34% 20.9%,28% 23.9%,18% 24.6%,8% 26.9%,0 27.6%'},s:'SL',t:'In einer Zeit vor unserer Zeit …'},
  {img:'f_intro1',s:'SL',t:'… in einem Königreich voller Licht …'},
  {img:'f_intro2',pan:0,fx2:'lantern',fx:'twinkle shoot flare',fxo:{sky:45,x:50,y:35.0,clip:'0 0,100% 0,100% 51.6%,88% 51.6%,82% 53.1%,74% 55.3%,62% 56.1%,48% 55.3%,36% 53.8%,26% 50.9%,18% 49.4%,10% 50.9%,0 52.4%'},s:'SL',t:'… feierte man jedes Jahr die Lichternacht.'},
  {img:'f_intro3',mus:'intro_dunkel',s:'SL',t:'Doch seit sechzig Jahren ist der Lichternachtstern nicht mehr aufgegangen. Und in diesem Winter … verschwinden auch die Lichter in den Fenstern.'},
  {img:'f_intro4',s:'SL',t:'Vharkon. Der Aschenkönig. Jede Nacht holt er sich ein Licht. Und niemand weiß, warum.'},
  {img:'ort01',s:'SL',t:'In vierundzwanzig Nächten ist Lichternacht. Wenn bis dahin das letzte Licht erlischt … bleibt Eldmark für immer im Dunkeln.',fade:{img:'ort01_dunkel',at:4900,sfx:'laterne_zischt'}},
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
