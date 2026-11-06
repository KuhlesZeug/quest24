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
  if(sh.img&&sh.img!==curImg){curImg=sh.img;const d=el('div','fs'+(sh.pan?' pan':''),'<div class="bg" style="background-image:url('+A+'img/'+sh.img+'.jpg)"></div><div class="shade"></div>');f.appendChild(d);requestAnimationFrame(()=>requestAnimationFrame(()=>{[...f.children].forEach(x=>x.classList.toggle('on',x===d))}));setTimeout(()=>{[...f.children].forEach(x=>{if(x!==d&&!x.classList.contains('on'))x.remove()})},1500)}
  if(sh.card){const c=el('div','fs on','<div class="fcard"><img src="'+A+'ui/'+sh.card+'.png" alt=""></div>');f.appendChild(c)}
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

const FILMS={
 intro:{shots:[
  {black:1,sfx:'trommel',d:1600,mus:null},
  {img:'f_intro1',pan:1,mus:'intro',s:'SL',t:'In einer Zeit vor unserer Zeit …'},
  {img:'f_intro1',s:'SL',t:'… in einem Königreich voller Licht …'},
  {img:'f_intro2',s:'SL',t:'… feierte man jedes Jahr die Lichternacht.'},
  {img:'f_tisch',mus:null,sfx:'plattenkratzer',s:'SL',t:'Moment. Moment. Falsche Seite.'},
  {sfx:'pergament',s:'SL',t:'Das ist … mein Einkaufszettel.'},
  {sfx:'pergament',s:'SL',t:'So. Jetzt.'},
  {img:'f_intro3',mus:'intro_dunkel',s:'SL',t:'Doch seit sechzig Jahren ist der Lichternachtstern nicht mehr aufgegangen. Und in diesem Winter … verschwinden auch die Lichter in den Fenstern.'},
  {img:'f_intro4',s:'SL',t:'Vharkon. Der Aschenkönig. Jede Nacht holt er sich ein Licht. Und niemand weiß, warum.'},
  {img:'ort01',s:'SL',t:'In vierundzwanzig Nächten ist Lichternacht. Wenn bis dahin das letzte Licht erlischt … bleibt Eldmark für immer im Dunkeln.'},
  {img:'ort01',s:'SL',t:'Das Königreich braucht eine Heldin. Oder einen Helden. Jemand Mutigen. Jemand Starken. Jemand …'},
  {s:'SL',t:'… Verfügbaren.'},
  {img:'f_held1',pan:1,mus:'intro_dunkel',s:'SL',t:'Irgendwo in Morgentau liegt in dieser Nacht jemand wach. Jemand, den noch niemand kennt.'},
  {img:'f_held2',sfx:'tuer_knarzt',s:'SL',t:'Wie diese Gestalt aussieht? Wie sie heißt? Was sie kann? Das steht noch in keinem Buch.'},
  {img:'f_held3',sfx:'gegenstand',s:'SL',t:'Nur eins steht fest. Sie nimmt eine Laterne mit. Einen Rucksack. Und ziemlich viel Mut.'},
  {img:'f_held4',pan:1,mus:'intro',s:'SL',t:'Alles andere … entscheidest du.',gap:900},
  {img:'f_intro5',sfx:'wuerfel',d:1400},
  {sfx:'fanfare',card:'logo',d:2600},
  {s:'SL',t:'Na dann. Würfelt Initiative.'},
  {s:'SL',t:'Also du. Du würfelst.'},
  {sfx:'rohrpost',s:'WG',t:'Probezeit, Tag eins. Ich höre zu.'},
  {s:'SL',t:'Natürlich, Meisterin Wendelgard. Selbstverständlich. Danke. Danke. Ich fange an.'}
 ]}
};
