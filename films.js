// Zwischensequenzen: gemalte Bilder mit Kamerafahrt, Stimme, Musik, Untertitel
// Jede Einstellung: {img, pan, s (Sprecher), t (Text), sfx, mus, card (Bild statt Text), d (Dauer ohne Stimme)}
let filmRun=0;
async function playFilm(key){const F=FILMS[key];if(!F)return;stopSfx(.4);show('#s-film');const run=++filmRun;const f=$('#film');f.innerHTML='';const sub=$('#film-sub');sub.classList.remove('on');
 let skip=false;$('#btn-skip').onclick=()=>{skip=true;stopVo();stopSong();filmRun++};accents(null);
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
  if(sh.fn==='abspann'){sub.classList.remove('on');music(null);
   // Abspann: Bilder der Reise, darüber laufen die Mitwirkenden mit Anspielungen; danach Überblendung auf das Logo
   const p=playSong('zirpia_13',.9);const AL=['f_intro2','ort01','f_tav_kap','f_wirt2','f_gr_licht','f_kiste4','f_z1c','f_schild_m','ort08','f_zi1','bl3','zs1','hx2','kr3','hu2','f_markt','zm3','hd2','f_z4b','zo2','et4','fl1','f_z5c','ph1','ph3','zw4','vh_warm','f_z7e','za1','za2','f_z7d'];const ai=[];AL.forEach(n=>{const im=new Image();im.onload=()=>ai.push(n);im.src=A+'img/'+n+'.jpg'});let ak=0;const at=setInterval(()=>{if(run!==filmRun||!ai.length){if(run!==filmRun)clearInterval(at);return}const ord=AL.filter(n=>ai.includes(n));if(ak>=ord.length){clearInterval(at);return}curImg=ord[ak];showImg({img:curImg});ak++},2900);
   const CR=[['Quest 24','Die Lichternacht von Eldmark',1],['In der Hauptrolle',heroName()],['Erzählt vom','Spielleiter (erstes Abenteuer, bestanden)'],['Bewertet von','Meisterin Wendelgard (Stempel inklusive)'],['Grumbold','Grumbold (zählt jetzt bis acht)'],['Herbert','Herbert, als Kiesel'],['Zirpia die Große','Zirpia (Welttournee in Planung)'],['Oma Hulda','Oma Hulda (Meisterdiebin im Ruhestand)'],['Nachtigall','Nachtigall (kein Vogel)'],['Vharkon','Vharkon, der Hüter (wieder warm)'],['Der Krokodilkönig','Der Krokodilkönig (hört immer zu)'],['Hexe Holunda','Hexe Holunda und ihre Hütte (die Beine gehören der Hütte)'],['Die drei Schilder','Die drei Schilder (zwei davon lügen)'],['Bob und Bob','Bob und Bob (einer betrügt, keiner gibt es zu)'],['Bandit Knorz','Bandit Knorz (weint beim Rap)'],['Wirt Bertram','Wirt Bertram (Krüge gespült: alle)'],['Dorfältester Aldric','Dorfältester Aldric (hat das Butterbrot geschmiert)'],['Besonderer Dank','Das Butterbrot. Bis heute unerklärt.'],['Hinweis','Bei diesem Abenteuer wurde kein Drache verletzt. Ein paar Schuppen vielleicht.'],['Gesucht','Die zweite Strophe des Wiegenlieds. Zuletzt gesehen in Zirpias Kopf.'],['Einkaufszettel','Milch, Eier, Drachen'],['Gedreht in','Eldmark. Gewürfelt am Küchentisch.'],['Und vor allem','Danke fürs Mitspielen.',1]];
   const cr=el('div','credits','<div class="cr-in">'+CR.map(([a,b,big])=>'<div class="cr-row'+(big?' big':'')+'"><i>'+esc(a)+'</i><b>'+esc(b)+'</b></div>').join('')+'</div>');(sub.parentNode||f).appendChild(cr);const ci=cr.firstChild;
   const DUR=84;requestAnimationFrame(()=>{const H=cr.clientHeight,last=ci.lastElementChild;last.style.marginTop=H+'px';const ty=H/2-last.offsetHeight/2-H-last.offsetTop;ci.style.transition='transform '+DUR+'s cubic-bezier(.3,0,.55,1)';ci.style.transform='translateY('+ty+'px)'});
   await Promise.race([p,new Promise(r=>{const iv=setInterval(()=>{if(skip||run!==filmRun){clearInterval(iv);r()}},300)})]);clearInterval(at);
   // Überblendung auf das Logo
   cr.classList.add('out');[...f.children].forEach(x=>{if(x!==cr)x.classList.remove('on')});await sleep(1200);cr.remove();
   if(run===filmRun){const lg=el('div','fs on logo-end','<div class="le-rays"></div><div class="le-emb"></div><div class="lg le-lg"><img class="lg-base" src="'+A+'ui/logo_leer.png" alt=""><img class="lg-dr" src="'+A+'ui/logo_drache.png" alt=""><i class="lg-glow"></i><img class="lg-fl" src="'+A+'ui/flamme.png" alt=""></div><p>Frohe Lichternacht</p>');f.appendChild(lg);
    const em=lg.querySelector('.le-emb');for(let i=0;i<30;i++){const e=el('i','');e.style.left=Math.random()*100+'%';e.style.animationDelay=(Math.random()*4)+'s';e.style.animationDuration=(3+Math.random()*3)+'s';const z=2+Math.random()*4;e.style.width=e.style.height=z+'px';em.appendChild(e)}
    sfx('trommel',.6);setTimeout(()=>{sfx('feuer_entfacht',.7);lg.classList.add('lit')},1300);await sleep(skip?1500:6000);
    if(!skip&&run===filmRun){
     // Der kleine Drache auf dem Logo holt Luft und spuckt einen Feuerstoß, der in die Karte überleitet
     const L=lg.querySelector('.lg'),dr=L.querySelector('.lg-dr');const ds=el('img','lg-ds');ds.src=A+'ui/dr_s_0.png';L.appendChild(ds);
     try{await Promise.all(DRF.map(i=>i.decode()))}catch(e){}
     dr.style.animation='none';dr.style.transition='opacity .45s';ds.classList.add('on');dr.style.opacity=0;await sleep(650);
     ds.src=A+'ui/dr_s_1.png';ds.className='lg-ds on look';sfx('drachenknurren',.6);await sleep(900);
     ds.src=A+'ui/dr_s_2.png';ds.className='lg-ds on breath';sfx('wind_boe',.7);await sleep(1100);
     ds.src=A+'ui/dr_s_3.png';ds.className='lg-ds on spit';sfx('feuerball',1);sfx('feuer_entfacht',.8);
     const r=ds.getBoundingClientRect();const fb=el('div','fball','<img src="'+A+'ui/feuerball.png" alt="">');fb.style.position='fixed';fb.style.zIndex=9999;fb.style.left=(r.left+r.width*.27)+'px';fb.style.top=(r.top+r.height*.64)+'px';document.body.appendChild(fb);
     requestAnimationFrame(()=>requestAnimationFrame(()=>{fb.classList.add('go');fb.style.left=(innerWidth/2)+'px';fb.style.top=(innerHeight*.55)+'px'}));await sleep(1150);
     // nach dem Film erscheint die Karte, der Feuerschein blendet darüber aus
     setTimeout(()=>{fb.classList.add('gone');setTimeout(()=>fb.remove(),1400)},700);lg.remove()}
    else{lg.classList.add('gone');await sleep(1400)}}
   continue}
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
 const fb=el('div','fball','<img src="'+A+'ui/feuerball.png" alt="">');fb.style.left=(r.left-R.left+r.width*.27)+'px';fb.style.top=(r.top-R.top+r.height*.64)+'px';f.appendChild(fb);
 requestAnimationFrame(()=>requestAnimationFrame(()=>{fb.classList.add('go');fb.style.left=(R.width/2)+'px';fb.style.top=(R.height*.55)+'px'}));
 await w(1150);o.remove();music(A+'mus/intro.mp3',.45);fb.classList.add('gone');setTimeout(()=>fb.remove(),1300)}

// Lebendiger Himmel über den gemalten Bildern
function skyFx(d,kind,o){const L=el('div','sky '+kind);d.appendChild(L);o=o||{};if(o.clip)L.style.clipPath='polygon('+o.clip+')';
 if(kind.includes('twinkle'))for(let i=0;i<26;i++){const t=el('i','tw');t.style.left=Math.random()*100+'%';t.style.top=Math.random()*(o.sky||40)+'%';t.style.animationDelay=(Math.random()*3)+'s';t.style.animationDuration=(1.6+Math.random()*2.4)+'s';L.appendChild(t)}
 if(kind.includes('shoot')){const go=()=>{if(!L.isConnected)return;const s=el('i','sh');s.style.left=(10+Math.random()*70)+'%';s.style.top=(2+Math.random()*(o.sky||30)*.7)+'%';L.appendChild(s);setTimeout(()=>s.remove(),1400);setTimeout(go,900+Math.random()*1600)};setTimeout(go,400)}
 if(kind.includes('snow'))L.appendChild(el('div','sn'));
 if(kind.includes('lantern'))for(let i=0;i<16;i++){const t=el('i','ln');t.style.left=(5+Math.random()*90)+'%';t.style.animationDelay=(Math.random()*7)+'s';t.style.animationDuration=(7+Math.random()*5)+'s';L.appendChild(t)}
 if(kind.includes('flare')){const f=el('i','fl');L.appendChild(f);
  // Stern im Bild: Position in Bildkoordinaten (1080x1920) auf die tatsächliche Darstellung mit cover umrechnen
  const ix=(o.x||50)/100,iy=(o.y||15)/100,IW=1080,IH=1920;const lay=()=>{if(!L.isConnected){removeEventListener('resize',lay);return}const W=d.clientWidth,H=d.clientHeight;if(!W)return requestAnimationFrame(lay);const k=Math.max(W/IW,H/IH);f.style.left=((W-IW*k)/2+ix*IW*k)+'px';f.style.top=((H-IH*k)/2+iy*IH*k)+'px';f.style.width=(IW*k*.44)+'px'};requestAnimationFrame(lay);addEventListener('resize',lay)}}

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
  {img:'f_intro2',pan:0,fx2:'lantern',fx:'twinkle shoot flare',fxo:{sky:45,x:50,y:31.7,clip:'0 0,100% 0,100% 51.6%,88% 51.6%,82% 53.1%,74% 55.3%,62% 56.1%,48% 55.3%,36% 53.8%,26% 50.9%,18% 49.4%,10% 50.9%,0 52.4%'},s:'SL',t:'… feierte man jedes Jahr die Lichternacht.'},
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
