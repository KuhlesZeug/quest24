// Karte, Kopfleiste, Rucksack, Gruppe, Karten für neue Gegenstände und Gefährten
const DAYN=['','Haus des Ältesten','Taverne Zum schiefen Kessel','Der Tavernenkeller','Graufels Mine','Die tiefen Stollen','Die alte Glutkammer','Rand des Flüsterwalds','Lichtung der Irrlichter','Die Spinnenhöhle','Die Pilzbühne','Der Nebelsumpf','Die Hexenhütte','Der Moorsee','Die Banditenschlucht','Goldhafen, der Markt','Huldas altes Versteck','Fuß der Eisgipfel','Die Eisbrücke','Der Frostturm','Der Gipfel der Winde','Das Aschenland','Lager der Drachenreiter','Vor dem Hort','Der Drachenhort'];
// Wegpunkte auf der Landkarte in Prozent (Bild 2352 mal 1760)
const WP=[null,[330,1440],[470,1490],[560,1350],[420,1030],[330,975],[255,900],[645,1200],[615,1045],[800,960],[945,1100],[915,1305],[1035,1400],[1250,990],[1470,1080],[1620,1320],[1800,1440],[1380,675],[990,435],[1140,270],[1320,420],[1725,780],[2070,690],[1875,570],[1995,420]].map(p=>p&&[p[0]/2352*100,p[1]/1760*100]);
const nights=()=>Math.max(0,24-Object.keys(st.done).length);

function heroImg(){const h=st.hero;return h?A+'img/h_'+h.cls+'_'+h.look+'.jpg':A+'img/p_sl.jpg'}

function renderHud(){const h=$('#hud');if(!h)return;const n=nights();
 h.innerHTML='<div class="hud-candle" title="Nächte bis zur Lichternacht"><div class="cd-wrap"><img class="cd-body" src="'+A+'ui/kerze.png" alt="" style="clip-path:inset('+(100-(18+n/24*82))+'% 0 0 0)"><img class="cd-flame" src="'+A+'ui/flamme.png" alt="" style="top:'+(100-(18+n/24*82)-14)+'%"></div><div><b>'+n+'</b><span>'+(n===1?'Nacht':'Nächte')+'</span></div></div>'+
 '<div class="hud-stat">'+UI('gold')+'<b>'+st.gold+'</b></div><div class="hud-stat">'+UI('stern')+'<b>'+st.lvl+'</b></div>'+
 '<div class="hud-btns"><button class="hb" id="hb-party" aria-label="Gruppe">'+UI('herz')+'</button><button class="hb" id="hb-inv" aria-label="Rucksack">'+UI('rucksack')+'</button><button class="hb" id="hb-log" aria-label="Tagebuch">'+UI('tagebuch')+'</button><button class="hb btn-snd'+(st.sound?'':' off')+'" id="hb-snd" aria-label="Ton">'+UI('horn')+'</button></div>';
 $('#hb-inv').onclick=openInv;$('#hb-party').onclick=openParty;$('#hb-log').onclick=openLog;$('#hb-snd').onclick=()=>{setSound(!st.sound);renderHud()}}

function goMap(){stopVo();stopSfx(.5);SC.abort=0;show('#s-map');renderHud();renderMap();music(A+'mus/karte.mp3',.4);atmo(A+'atmo/bergwind.mp3',.35);accents(null);if(!st.flags.map_tut&&Object.keys(st.done).length<=1)setTimeout(mapTutorial,900)}
function renderMap(){const m=$('#map-in');m.querySelectorAll('.wp,.token,.trail,.map-urk').forEach(e=>e.remove());const nd=nextDay();
 if(st.done&&st.done[24]){const u=el('button','map-urk','<span class="mu-p" style="background-image:url('+A+'ui/urk_bg.jpg)"><img class="mu-s" src="'+A+'ui/siegel.png" alt=""></span><b>Heldenurkunde</b>');u.onclick=e=>{e.stopPropagation();sfx('pergament',.6);openUrkunde()};m.appendChild(u)}
 // Gezeichneter Weg: geschafft als feste Spur, kommend gestrichelt
 const last=Object.keys(st.done).length?Math.max(...Object.keys(st.done).map(Number)):1;
 const pts=d=>WP.slice(1,d+1).map(p=>(p[0]*23.52).toFixed(1)+','+(p[1]*17.6).toFixed(1)).join(' ');
 const sv=document.createElementNS('http://www.w3.org/2000/svg','svg');sv.setAttribute('class','trail');sv.setAttribute('viewBox','0 0 2352 1760');sv.setAttribute('preserveAspectRatio','none');
 sv.innerHTML='<polyline class="tr-all" points="'+pts(24)+'"/><polyline class="tr-done" points="'+pts(last)+'"/>';m.appendChild(sv);
 for(let d=1;d<=24;d++){const p=WP[d];const done=!!st.done[d],open=unlocked(d);
  const b=el('button','wp'+(done?' done':open?' open':' lock')+(d===nd&&open?' cur':''),'<img src="'+A+'ui/'+(done?'siegel':'marke')+'.png" alt=""><b>'+d+'</b>');
  b.style.left=p[0]+'%';b.style.top=p[1]+'%';b.onclick=()=>tapDay(d);m.appendChild(b)}
 const at=Math.max(1,Math.min(24,nd>24?24:(st.done[nd-1]?nd-1:Math.max(1,nd-1))));const tp=WP[Object.keys(st.done).length?Math.max(...Object.keys(st.done).map(Number)):1];
 const tk=el('div','token','<i class="tk-sh"></i><div class="tk-sp" style="background-image:url('+runImg(0)+')"></div>');tk.style.left=tp[0]+'%';tk.style.top=tp[1]+'%';m.appendChild(tk);standBeside(tk,Object.keys(st.done).length?Math.max(...Object.keys(st.done).map(Number)):1);for(let i=0;i<4;i++){const im=new Image();im.src=runImg(i)}
 const sc=$('#map');requestAnimationFrame(()=>{const w=m.offsetWidth;sc.scrollLeft=Math.max(0,tp[0]/100*w-sc.clientWidth/2)});
 $('#map-foot').innerHTML=(nd>24||st.done[24])?'Das Abenteuer ist bestanden. Du kannst jeden Tag noch einmal erleben.<button class="pbtn" onclick="openUrkunde()">Deine Heldenurkunde</button>':unlocked(nd)?'Tippe auf Wegpunkt '+nd+', um weiterzuspielen.':lockMsg(nd)}
// Mini Figur auf der Karte: steht, rennt von Punkt zu Punkt und bleibt stehen
const RUNF={schurke_1:[1,3],schurke_2:[1,3]};
// Steht neben dem Wegpunkt, auf der Seite weg vom nächsten Punkt, damit keine Zahl verdeckt wird
function standBeside(tk,d){const n=WP[Math.min(24,d+1)],c=WP[d];const right=n&&n!==c?n[0]>=c[0]:true;tk.style.setProperty('--dx',(right?-48:48)+'px');tk.classList.toggle('left',!right)}
function runImg(i){const h=st.hero;return h?A+'img/r_'+h.cls+'_'+h.look+'_'+i+'.png':A+'img/r_krieger_1_0.png'}
async function runTo(d){const tk=$('.token');if(!tk)return;const m=$('#map-in'),sc=$('#map'),sp=tk.querySelector('.tk-sp');
 const x0=parseFloat(tk.style.left),y0=parseFloat(tk.style.top),x1=WP[d][0],y1=WP[d][1];
 const W=m.offsetWidth,H=m.offsetHeight,dist=Math.hypot((x1-x0)/100*W,(y1-y0)/100*H);if(dist<4)return;
 const ms=Math.max(900,Math.min(2600,dist*7));tk.classList.toggle('left',x1<x0);tk.classList.add('run');
 const h=st.hero,fr=(h&&RUNF[h.cls+'_'+h.look])||[1,2,3];let k=0;const iv=setInterval(()=>{sp.style.backgroundImage='url('+runImg(fr[k++%fr.length])+')'},115);
 tk.style.transition='left '+ms+'ms linear,top '+ms+'ms linear,transform .35s ease-out';requestAnimationFrame(()=>{tk.style.left=x1+'%';tk.style.top=y1+'%'});
 sc.scrollTo({left:Math.max(0,x1/100*W-sc.clientWidth/2),behavior:'smooth'});
 const stp=sfx('schritte',.6);const pl=$('.tr-done');if(pl){const seg=document.createElementNS('http://www.w3.org/2000/svg','line');seg.setAttribute('class','tr-run');seg.setAttribute('x1',x0*23.52);seg.setAttribute('y1',y0*17.6);seg.setAttribute('x2',x1*23.52);seg.setAttribute('y2',y1*17.6);seg.style.setProperty('--len',Math.hypot((x1-x0)*23.52,(y1-y0)*17.6));seg.style.animationDuration=ms+'ms';pl.parentNode.appendChild(seg)}await sleep(ms);clearInterval(iv);tk.classList.remove('run');stp.then(h=>{if(h){try{h.g.gain.setTargetAtTime(0,AC.currentTime,.08);h.s.stop(AC.currentTime+.3)}catch(e){}}});standBeside(tk,d);sp.style.backgroundImage='url('+runImg(0)+')';await sleep(500)}
function lockMsg(d){const b=berlin();return b.month===12?'Wegpunkt '+d+' öffnet sich am '+d+'. Dezember.':'Das Abenteuer beginnt am 1. Dezember.'}
async function tapDay(d){sfx('ui_klick',.6);
 if(!unlocked(d)){await rollPercent({title:'Tageswurf',sub:'Noch nicht',locked:'Nachtigall: Geduld ist auch eine Tugend. Angeblich.'});return}
 if(d>nextDay()&&!TEST){toast('Erst Wegpunkt '+nextDay()+'. Die Reise geht der Reihe nach.');return}
 if(TEST)testPrep(d);
 if(st.done[d]){const o=$('#card');o.classList.remove('gbg');o.innerHTML='<div class="cd-card"><h3>Tag '+d+' · '+DAYN[d]+'</h3><p>Diesen Tag hast du schon erlebt. Möchtest du ihn noch einmal spielen?</p><button class="pbtn" data-r="1">Noch einmal spielen</button><button class="pbtn alt" data-r="0">Zurück zur Karte</button></div>';o.classList.add('on');const r=await new Promise(res=>o.querySelectorAll('button').forEach(b=>b.onclick=()=>{sfx('ui_klick',.6);res(+b.dataset.r)}));o.classList.remove('on');if(!r)return;return playDay(d,true)}
 await rollPercent({title:'Tageswurf',sub:'W100 und W10 zeigen die Zahl des Tages',fixed:d,after:v=>'Auf zu Wegpunkt '+v+': '+DAYN[v]});
 // Figur zieht weiter
 await runTo(d)
 playDay(d,false)}

async function playDay(d,again){const D=DAYS[d];if(!D){toast('Dieser Tag wird gerade gebaut.');return}stopSfx(.4);
 show('#s-scene');SC.id='d'+String(d).padStart(2,'0');if(!D._n)D._n=numberSteps(SC.id,D.steps)||1;SC.abort=0;SC.wgPrev=null;$('#s-scene').classList.remove('real');$('#sc-bg').innerHTML='';BGWANT=null;const fg=$('#sc-fig');if(fg)fg.classList.remove('on');$('#sc-title').textContent='Tag '+d+' · '+DAYN[d];renderHud();
 await run(D.steps);if(SC.abort){SC.abort=0;return goMap()}
 hideBox();if(!again){st.done[d]=Date.now();save()}
 if(d===24&&!again){goMap();setTimeout(()=>openUrkunde(),1200);return}await countdownCard(d);goMap()}
async function countdownCard(d){const n=nights();const o=$('#card');o.classList.remove('gbg');o.innerHTML='<div class="cd-card"><div class="cd-big"><img class="cd-body" src="'+A+'ui/kerze.png" alt=""><img class="cd-flame" src="'+A+'ui/flamme.png" alt=""></div><h3>'+(n?'Noch '+n+' '+(n===1?'Nacht':'Nächte')+' bis zur Lichternacht':'Lichternacht!')+'</h3><p>'+(DAYS[d].end?T(DAYS[d].end):'Morgen geht die Reise weiter.')+'</p><button class="pbtn">Zur Karte</button></div>';
 o.classList.add('on');sfx('kerze',.6);await new Promise(r=>o.querySelector('button').onclick=r);o.classList.remove('on')}

// Gegenstand erhalten
async function gainItem(id,n){const I=ITEMS[id];if(!I)return;const ex=st.inv.find(x=>x.id===id);if(ex)ex.n=(ex.n||1)+(n||1);else st.inv.push({id,n:n||1});
 if(I.stat){Object.entries(I.stat).forEach(([k,v])=>{if(k==='hp')st.flags.drachenhaut=1;else st.hero[k]+=v})}if(id==='schal')st.flags.schal=1;save();
 await showCard('<img class="cc-img" src="'+A+'items/'+id+'.png" alt=""><div class="cc-k">'+(I.key?'Schlüsselgegenstand':'Neuer Gegenstand')+'</div><h3>'+esc(I.n)+(n>1?' ('+n+')':'')+'</h3><p>'+esc(I.d)+'</p>',I.key?'fanfare':'gegenstand')}
function dropItem(id,n){const i=st.inv.findIndex(x=>x.id===id);if(i<0)return;st.inv[i].n=(st.inv[i].n||1)-(n||1e9);if(st.inv[i].n<=0)st.inv.splice(i,1);save()}
function addGold(g){st.gold+=g;save();renderHud();sfx('muenzen',.7);toast(UI('gold')+' plus '+g+' Gold')}
function addXp(x){st.xp+=x;save()}
async function showCard(h,snd){const o=$('#card');o.classList.remove('gbg');o.innerHTML='<div class="c-card">'+h+'<button class="pbtn">Weiter</button></div>';o.classList.add('on');if(snd)sfx(snd,.8);setTimeout(()=>fx('magic',o.querySelector('.cc-img,.cc-port'),220),250);await new Promise(r=>o.querySelector('button').onclick=r);sfx('ui_klick',.5);o.classList.remove('on')}
const STECK={gr:['Herbert (ein Kiesel)','Dunkelheit','Entschuldigung, bevor ich zuschlage.'],zi:['Ihr Federhut','Leere Ränge','Applaus ist auch eine Mahlzeit.'],hu:['Ihr Strickzeug','Langeweile','Kindchen, das schließen wir ganz anders auf.'],na:['Sein Zylinder','Gefühle zeigen','Ich schnurre nicht.']};
async function joinParty(id){if(!st.party.includes(id))st.party.push(id);save();const C=COMP[id],s=STECK[id];
 await showCard('<div class="cc-port" style="background-image:url('+A+'img/k_'+id+'.jpg)"></div><div class="cc-k">Neuer Gefährte</div><h3>'+C.n+'</h3><dl class="steck"><dt>Lieblingsding</dt><dd>'+s[0]+'</dd><dt>Größte Angst</dt><dd>'+s[1]+'</dd><dt>Spruch</dt><dd>'+s[2]+'</dd><dt>Element</dt><dd>'+ELEM[C.el]+'</dd></dl>','fanfare')}
async function learnSkill(x){const [id,s]=x.split(':');const arr=st.flags['sk_'+id]||[];if(!arr.includes(s))arr.push(s);st.flags['sk_'+id]=arr;save();
 await showCard('<div class="cc-port" style="background-image:url('+A+'img/k_'+id+'.jpg)"></div><div class="cc-k">'+COMP[id].n+' lernt</div><h3 class="sk-h">'+skIcon(s)+SK[s].n+'</h3><p>'+SK[s].d+'</p>','stufenaufstieg')}
// Fähigkeiten Icon (a/ui/sk/<id>.png), falls keins da ist: allgemeines Buch
const skIcon=s=>'<img class="sk-ic" src="'+A+'ui/sk/'+s+'.png" alt="" onerror="this.onerror=null;this.src=\''+A+'ui/ac_faehigkeit.png\'">';
const skChips=a=>'<div class="sk-chips">'+a.map(s=>'<span class="sk-chip">'+skIcon(s)+'<b>'+SK[s].n+'</b></span>').join('')+'</div>';
const skArt=s=>SK[s].passive?'Immer aktiv':SK[s].once?'Einmal pro Kampf':'Beliebig oft';
// Stufenaufstieg: eigener Bildschirm mit Lichtstrahlen, Emblem, Lebenspunkten und zwei Fähigkeiten zur Wahl
async function levelUp(lv){const old=heroMaxHp();st.lvl=lv;save();const neu=heroMaxHp();const [a,b]=LVL_SK[st.hero.cls][lv-2];
 const o=el('div','lvup','<div class="lvup-st"><div class="lvup-rays"></div><div class="lvup-glanz"></div><div class="lvup-in">'
  +'<div class="lvup-em"><img src="'+A+'ui/lvl_emblem.png" alt=""><b>'+lv+'</b></div>'
  +'<div class="lvup-k">Stufenaufstieg</div><h2 class="lvup-h">Stufe '+lv+'</h2>'
  +'<div class="lvup-hp"><img src="'+A+'ui/herz.png" alt=""><span>Lebenspunkte</span><s>'+old+'</s><i>▸</i><em>'+neu+'</em><small>plus '+(neu-old)+'</small></div>'
  +'<div class="lvup-w">Wähle eine neue Fähigkeit</div><div class="lvup-ch"></div></div></div>');
 document.body.appendChild(o);const sp=o.querySelector('.lvup-st');for(let i=0;i<28;i++){const f=el('i','lvup-f');f.style.left=Math.random()*100+'%';f.style.animationDelay=(Math.random()*4)+'s';f.style.animationDuration=(3+Math.random()*3)+'s';sp.appendChild(f)}
 requestAnimationFrame(()=>o.classList.add('on'));
 // Fanfare passend zum Erzähler: Stufe 2 volle Fanfare, Stufe 3 kürzer, Stufe 4 ganz ohne, Stufe 5 wieder die volle
 if(lv!==4)sfx('stufenaufstieg');setTimeout(()=>{fx('magic',o.querySelector('.lvup-em'),260);if(lv===2||lv===5)sfx('fanfare',.5)},650);
 const ch=o.querySelector('.lvup-ch');
 const s=await new Promise(r=>[a,b].forEach((k,i)=>{const bt=el('button','lvup-c',skIcon(k)+'<div><b>'+SK[k].n+'</b><span>'+SK[k].d+'</span><em>'+skArt(k)+'</em></div>');bt.style.animationDelay=(1.1+i*.18)+'s';bt.onclick=()=>{sfx('ui_klick',.6);r(k)};ch.appendChild(bt)}));
 st.hero.skills.push(s);save();
 ch.querySelectorAll('.lvup-c').forEach(c=>{c.onclick=null;c.classList.add(c.querySelector('b').textContent===SK[s].n?'gewaehlt':'weg')});
 const g=ch.querySelector('.gewaehlt');sfx('richtig',.7);fx('magic',g.querySelector('.sk-ic'),180);
 const ok=el('div','lvup-ok','<span>Neue Fähigkeit gelernt</span><button class="pbtn">Weiter</button>');o.querySelector('.lvup-in').appendChild(ok);requestAnimationFrame(()=>ok.classList.add('on'));
 await new Promise(r=>ok.querySelector('button').onclick=r);sfx('ui_klick',.5);
 o.classList.remove('on');await sleep(450);o.remove();renderHud()}
async function lootRoll(){const v=await rollPercent({title:'Beutetabelle',sub:'W100 und W10. Schau auf dein Druckblatt.',after:x=>'Nummer '+x});
 let r=LOOT[v];if(st.hero.skills.includes('meisterdieb')){const v2=rnd(100);const r2=LOOT[v2];if(typeof r2==='number'&&typeof r==='number'?r2>r:false)r=r2}
 if(typeof r==='number')return addGold(r);await gainItem(r)}

// Rucksack, Gruppe, Tagebuch
function sheet(h){const o=$('#sheet');o.innerHTML='<div class="sh-in"><button class="sh-x" aria-label="Schließen">'+UI('schloss')+'</button>'+h+'</div>';o.classList.add('on');o.querySelector('.sh-x').onclick=()=>o.classList.remove('on');o.onclick=e=>{if(e.target===o)o.classList.remove('on')};sfx('pergament',.5)}
function openInv(){const keys=st.inv.filter(x=>ITEMS[x.id].key),rest=st.inv.filter(x=>!ITEMS[x.id].key);
 const row=x=>{const I=ITEMS[x.id];return '<div class="inv-it"><img src="'+A+'items/'+x.id+'.png" alt=""><div><b>'+esc(I.n)+(x.n>1?' ×'+x.n:'')+'</b><span>'+esc(I.d)+'</span></div></div>'};
 sheet('<h2>Rucksack</h2><div class="inv-gold">'+UI('gold')+' '+st.gold+' Gold</div>'+(keys.length?'<h4>Schlüsselgegenstände</h4>'+keys.map(row).join(''):'')+'<h4>Gegenstände</h4>'+(rest.length?rest.map(row).join(''):'<p class="mute">Noch leer. Das ändert sich schnell.</p>'))}
function openParty(){if(!st.hero)return;const h=st.hero,c=CLS[h.cls];
 const hero='<div class="pt-c"><div class="pt-p" style="background-image:url('+heroImg()+')"></div><div><b>'+heroName()+'</b><span>'+(h.f?c.nf:c.n)+', Stufe '+st.lvl+'</span><div class="pt-st">'+UI('st_str')+h.str+' '+UI('st_dex')+h.dex+' '+UI('st_wis')+h.wis+' '+UI('herz')+heroMaxHp()+'</div>'+skChips([c.start,...h.skills])+'</div></div>';
 sheet('<h2>Die Gruppe</h2>'+hero+st.party.map(id=>{const C=COMP[id];return '<div class="pt-c"><div class="pt-p" style="background-image:url('+A+'img/k_'+id+'.jpg)"></div><div><b>'+C.n+'</b><span>Element '+ELEM[C.el]+'</span><div class="pt-st">'+UI('herz')+C.hp+'</div>'+skChips([...Object.keys(C.skills),...(st.flags['sk_'+id]||[])])+'</div></div>'}).join('')+(st.party.length<4?'<p class="mute">Unterwegs wartet noch jemand auf dich.</p>':''))}
function openLog(){const days=Object.keys(st.done).map(Number).sort((a,b)=>a-b);
 sheet('<h2>Tagebuch</h2>'+(days.length?days.map(d=>'<button class="log-d" data-d="'+d+'"><b>Tag '+d+'</b><span>'+DAYN[d]+'</span></button>').join(''):'<p class="mute">Hier sammeln sich deine Abenteuer.</p>')+'<h4>Einstellungen</h4><label class="set"><input type="checkbox" id="set-auto"'+(st.auto?' checked':'')+'> Text läuft nach der Stimme automatisch weiter</label><label class="set"><input type="checkbox" id="set-own"'+(st.flags.own?' checked':'')+'> Ich würfle mit echten Würfeln am Tisch und tippe das Ergebnis selbst ein</label>');
 $$('.log-d').forEach(b=>b.onclick=()=>{$('#sheet').classList.remove('on');playDay(+b.dataset.d,true)});
 $('#set-auto').onchange=e=>{st.auto=e.target.checked;save()};$('#set-own').onchange=e=>{st.flags.own=e.target.checked;save()}}

// Rätsel mit Eingabe oder Auswahl und drei Tipps
async function codeInput(c){hideBox();const o=$('#card');o.classList.remove('gbg');const key=SC.id+'_'+(c.id||'c');
 setTimeout(()=>readAloud(c.q),350);return new Promise(res=>{const draw=()=>{const n=st.hint[key]||0;
  o.innerHTML='<div class="c-card code"><div class="cc-k">'+esc(c.k||'Rätsel')+'</div><h3>'+T(c.q)+'</h3>'+(c.opts?'<div class="code-opts">'+c.opts.map((x,i)=>'<button class="code-o" data-i="'+i+'">'+T(x)+'</button>').join('')+'</div>':'<input class="code-in" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="'+(c.ph||'Lösung')+'"><button class="pbtn code-go">Prüfen</button>')+
  '<div class="hints">'+c.hints.map((h,i)=>'<button class="hint'+(i<n?' open':'')+'" data-i="'+i+'"><span>'+(i===2?'Lösung':'Tipp '+(i+1))+'</span>'+(i<n?T(h):i===n?'Antippen zum Aufdecken':'')+'</button>').join('')+'</div></div>';
  if(TEST){const tb=el('button','pbtn test-sol','Test: Rätsel als gelöst werten');tb.onclick=()=>{sfx('richtig');o.classList.remove('on');res(true)};o.querySelector('.c-card').appendChild(tb)}
  o.classList.add('on');
  $$('#card .hint').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(i!==(st.hint[key]||0))return;st.hint[key]=i+1;save();sfx('pergament',.5);draw();readAloud(c.hints[i])});
  const test=async v=>{const ok=c.opts?v===c.a:[].concat(c.h).includes(await QZ.hash(v));if(ok){sfx('richtig');o.classList.remove('on');res(true)}else{sfx('falsch');if(c.wrongSteps){o.classList.remove('on');await run(c.wrongSteps.filter(x=>!x.onlyOnce||!st.flags[key+'_w']));st.flags[key+'_w']=1;save();if(c.once)return res(false);draw()}else toast('Das stimmt noch nicht.')}};
  $$('#card .code-o').forEach(b=>b.onclick=()=>test(+b.dataset.i));const g=o.querySelector('.code-go');if(g){const i=o.querySelector('.code-in');g.onclick=()=>test(i.value);i.onkeydown=e=>{if(e.key==='Enter')test(i.value)}}};draw()})}

// Testmodus: Tage frei wählbar, Gruppe und Stufe passend zum Tag
function testPrep(d){if(!st.hero)st.hero={cls:'krieger',look:1,f:true,str:3,dex:2,wis:1,name:'Testheldin',skills:[]};
 const p=[];if(d>4)p.push('gr');if(d>9)p.push('zi');if(d>14)p.push('hu');if(d>19)p.push('na');for(const x of p)if(!st.party.includes(x))st.party.push(x);
 st.lvl=Math.max(st.lvl||1,1+(d>5)+(d>10)+(d>15)+(d>20));save()}

// Erklärung der Karte beim ersten Besuch: der Spielleiter zeigt auf Wegpunkte, Kerze und Knöpfe
const MAPTUT=[['.wp','Das hier ist die Karte von Eldmark. Jeder dieser roten Wegpunkte ist eine Nacht im Dezember. Vierundzwanzig Stück, von deinem Dorf bis hinauf zum Drachen.'],
 [null,'Jeden Tag im Dezember öffnet sich um Mitternacht genau ein neuer Wegpunkt. Vorher bleibt er verschlossen. Auch wenn du sehr neugierig bist. Ich bin es übrigens auch.'],
 ['.hud-candle','Die Kerze hier oben zeigt dir, wie viele Nächte es noch bis zur Lichternacht sind. Jeden Tag brennt sie ein Stückchen weiter herunter.'],
 ['.hud-btns','Hier oben rechts findest du deine Gruppe, deinen Rucksack, das Tagebuch mit allen Hinweisen und den Ton.'],
 ['.token','Und das hier bist du. Unterwegs warten Rätsel, Kämpfe und neue Gefährten auf dich. In der Lichternacht wollen wir gemeinsam die Lichter von Eldmark wieder zum Leuchten bringen. Sobald sich der nächste Wegpunkt öffnet, tippst du einfach darauf, und das Abenteuer geht weiter.']];
async function mapTutorial(){if(st.flags.map_tut)return;st.flags.map_tut=1;save();const sc=$('#s-map');
 for(let i=0;i<MAPTUT.length;i++){const [sel,txt]=MAPTUT[i];const tg=sel?sc.querySelector(sel):null;if(tg&&tg.scrollIntoView&&sel!=='.hud-candle'&&sel!=='.hud-btns')tg.scrollIntoView({block:'center',inline:'center',behavior:'smooth'});await sleep(sel?450:50);
  const c=el('div','bt-coach map-coach');const o=sc.getBoundingClientRect();let top=false;
  if(tg){const r=tg.getBoundingClientRect(),pad=8;const sp=el('div','bt-spot');sp.style.cssText='left:'+(r.left-o.left-pad)+'px;top:'+(r.top-o.top-pad)+'px;width:'+(r.width+pad*2)+'px;height:'+(r.height+pad*2)+'px';c.appendChild(sp);top=(r.top+r.height/2-o.top)>o.height/2}else c.classList.add('dim');
  const bx=el('div','bt-cb'+(top?' top':''),'<div class="bt-cf" style="background-image:url('+A+'img/p_sl.jpg)"></div><div class="bt-ct"><b>Der Spielleiter</b><p>'+esc(txt)+'</p><button class="pbtn">'+(i<MAPTUT.length-1?'Weiter':'Los geht\'s')+'</button></div>');c.appendChild(bx);sc.appendChild(c);
  const a=playVo(A+'vo/maptut_'+(i+1)+'.mp3',on=>bx.classList.toggle('talk',on));
  await new Promise(r=>bx.querySelector('button').onclick=()=>{sfx('ui_klick',.5);r()});if(a)stopVo();c.remove()}}
