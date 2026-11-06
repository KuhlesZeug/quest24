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

function goMap(){stopVo();SC.abort=0;show('#s-map');renderHud();renderMap();music(A+'mus/karte.mp3',.4);atmo(A+'atmo/bergwind.mp3',.35);accents(null)}
function renderMap(){const m=$('#map-in');m.querySelectorAll('.wp,.token').forEach(e=>e.remove());const nd=nextDay();
 for(let d=1;d<=24;d++){const p=WP[d];const done=!!st.done[d],open=unlocked(d);
  const b=el('button','wp'+(done?' done':open?' open':' lock')+(d===nd&&open?' cur':''),'<img src="'+A+'ui/'+(done?'siegel':'marke')+'.png" alt=""><b>'+d+'</b>');
  b.style.left=p[0]+'%';b.style.top=p[1]+'%';b.onclick=()=>tapDay(d);m.appendChild(b)}
 const at=Math.max(1,Math.min(24,nd>24?24:(st.done[nd-1]?nd-1:Math.max(1,nd-1))));const tp=WP[Object.keys(st.done).length?Math.max(...Object.keys(st.done).map(Number)):1];
 const tk=el('div','token','<div style="background-image:url('+heroImg()+')"></div>');tk.style.left=tp[0]+'%';tk.style.top=tp[1]+'%';m.appendChild(tk);
 const sc=$('#map');requestAnimationFrame(()=>{const w=m.offsetWidth;sc.scrollLeft=Math.max(0,tp[0]/100*w-sc.clientWidth/2)});
 $('#map-foot').innerHTML=nd>24?'Das Abenteuer ist bestanden. Du kannst jeden Tag noch einmal erleben.':unlocked(nd)?'Tippe auf Wegpunkt '+nd+', um weiterzuspielen.':lockMsg(nd)}
function lockMsg(d){const b=berlin();return b.month===12?'Wegpunkt '+d+' öffnet sich am '+d+'. Dezember.':'Das Abenteuer beginnt am 1. Dezember.'}
async function tapDay(d){sfx('ui_klick',.6);
 if(!unlocked(d)){await rollPercent({title:'Tageswurf',sub:'Noch nicht',locked:'Nachtigall: Geduld ist auch eine Tugend. Angeblich.'});return}
 if(d>nextDay()){toast('Erst Wegpunkt '+nextDay()+'. Die Reise geht der Reihe nach.');return}
 if(st.done[d]){const r=await choice([{t:'Tag '+d+' noch einmal erleben'},{t:'Zurück zur Karte'}]);if(r===1)return;return playDay(d,true)}
 await rollPercent({title:'Tageswurf',sub:'W100 und W10 zeigen die Zahl des Tages',fixed:d,after:v=>'Auf zu Wegpunkt '+v+': '+DAYN[v]});
 // Figur zieht weiter
 const tk=$('.token');if(tk){tk.style.left=WP[d][0]+'%';tk.style.top=WP[d][1]+'%';sfx('schritte',.6);await sleep(1300)}
 playDay(d,false)}

async function playDay(d,again){const D=DAYS[d];if(!D){toast('Dieser Tag wird gerade gebaut.');return}
 show('#s-scene');SC.id='d'+String(d).padStart(2,'0');if(!D._n)D._n=numberSteps(SC.id,D.steps)||1;SC.abort=0;$('#sc-bg').innerHTML='';const fg=$('#sc-fig');if(fg)fg.classList.remove('on');$('#sc-title').textContent='Tag '+d+' · '+DAYN[d];renderHud();
 await run(D.steps);if(SC.abort){SC.abort=0;return goMap()}
 hideBox();if(!again){st.done[d]=Date.now();save()}
 await countdownCard(d);goMap()}
async function countdownCard(d){const n=nights();const o=$('#card');o.innerHTML='<div class="cd-card"><div class="cd-big"><img class="cd-body" src="'+A+'ui/kerze.png" alt=""><img class="cd-flame" src="'+A+'ui/flamme.png" alt=""></div><h3>'+(n?'Noch '+n+' '+(n===1?'Nacht':'Nächte')+' bis zur Lichternacht':'Lichternacht!')+'</h3><p>'+(DAYS[d].end?T(DAYS[d].end):'Morgen geht die Reise weiter.')+'</p><button class="pbtn">Zur Karte</button></div>';
 o.classList.add('on');sfx('kerze',.6);await new Promise(r=>o.querySelector('button').onclick=r);o.classList.remove('on')}

// Gegenstand erhalten
async function gainItem(id,n){const I=ITEMS[id];if(!I)return;const ex=st.inv.find(x=>x.id===id);if(ex)ex.n=(ex.n||1)+(n||1);else st.inv.push({id,n:n||1});
 if(I.stat){Object.entries(I.stat).forEach(([k,v])=>{if(k==='hp')st.flags.drachenhaut=1;else st.hero[k]+=v})}if(id==='schal')st.flags.schal=1;save();
 await showCard('<img class="cc-img" src="'+A+'items/'+id+'.png" alt=""><div class="cc-k">'+(I.key?'Schlüsselgegenstand':'Neuer Gegenstand')+'</div><h3>'+esc(I.n)+(n>1?' ('+n+')':'')+'</h3><p>'+esc(I.d)+'</p>',I.key?'fanfare':'gegenstand')}
function dropItem(id,n){const i=st.inv.findIndex(x=>x.id===id);if(i<0)return;st.inv[i].n=(st.inv[i].n||1)-(n||1e9);if(st.inv[i].n<=0)st.inv.splice(i,1);save()}
function addGold(g){st.gold+=g;save();renderHud();sfx('muenzen',.7);toast(UI('gold')+' plus '+g+' Gold')}
function addXp(x){st.xp+=x;save()}
async function showCard(h,snd){const o=$('#card');o.innerHTML='<div class="c-card">'+h+'<button class="pbtn">Weiter</button></div>';o.classList.add('on');if(snd)sfx(snd,.8);setTimeout(()=>fx('magic',o.querySelector('.cc-img,.cc-port'),220),250);await new Promise(r=>o.querySelector('button').onclick=r);sfx('ui_klick',.5);o.classList.remove('on')}
const STECK={gr:['Herbert (ein Kiesel)','Dunkelheit','Entschuldigung, bevor ich zuschlage.'],zi:['Ihr Federhut','Leere Ränge','Applaus ist auch eine Mahlzeit.'],hu:['Ihr Strickzeug','Langeweile','Kindchen, das schließen wir ganz anders auf.'],na:['Sein Zylinder','Gefühle zeigen','Ich schnurre nicht.']};
async function joinParty(id){if(!st.party.includes(id))st.party.push(id);save();const C=COMP[id],s=STECK[id];
 await showCard('<div class="cc-port" style="background-image:url('+A+'img/k_'+id+'.jpg)"></div><div class="cc-k">Neuer Gefährte</div><h3>'+C.n+'</h3><dl class="steck"><dt>Lieblingsding</dt><dd>'+s[0]+'</dd><dt>Größte Angst</dt><dd>'+s[1]+'</dd><dt>Spruch</dt><dd>'+s[2]+'</dd><dt>Element</dt><dd>'+ELEM[C.el]+'</dd></dl>','fanfare')}
async function learnSkill(x){const [id,s]=x.split(':');const arr=st.flags['sk_'+id]||[];if(!arr.includes(s))arr.push(s);st.flags['sk_'+id]=arr;save();
 await showCard('<div class="cc-port" style="background-image:url('+A+'img/k_'+id+'.jpg)"></div><div class="cc-k">'+COMP[id].n+' lernt</div><h3>'+SK[s].n+'</h3><p>'+SK[s].d+'</p>','stufenaufstieg')}
async function levelUp(lv){st.lvl=lv;save();sfx('stufenaufstieg');const [a,b]=LVL_SK[st.hero.cls][lv-2];
 const o=$('#card');o.innerHTML='<div class="c-card lv"><img class="cc-img" src="'+A+'ui/stern.png" alt=""><div class="cc-k">Stufenaufstieg</div><h3>Stufe '+lv+'</h3><p>Plus 3 Lebenspunkte. Wähle eine neue Fähigkeit:</p><div class="lv-ch"></div></div>';o.classList.add('on');
 await new Promise(r=>[a,b].forEach(s=>{const bt=el('button','lv-b','<b>'+SK[s].n+'</b><span>'+SK[s].d+'</span>');bt.onclick=()=>{st.hero.skills.push(s);save();r()};o.querySelector('.lv-ch').appendChild(bt)}));
 o.classList.remove('on');renderHud()}
async function lootRoll(){const v=await rollPercent({title:'Beutetabelle',sub:'W100 und W10. Schau auf dein Druckblatt.',after:x=>'Nummer '+x});
 let r=LOOT[v];if(st.hero.skills.includes('meisterdieb')){const v2=rnd(100);const r2=LOOT[v2];if(typeof r2==='number'&&typeof r==='number'?r2>r:false)r=r2}
 if(typeof r==='number')return addGold(r);await gainItem(r)}

// Rucksack, Gruppe, Tagebuch
function sheet(h){const o=$('#sheet');o.innerHTML='<div class="sh-in"><button class="sh-x" aria-label="Schließen">'+UI('schloss')+'</button>'+h+'</div>';o.classList.add('on');o.querySelector('.sh-x').onclick=()=>o.classList.remove('on');o.onclick=e=>{if(e.target===o)o.classList.remove('on')};sfx('pergament',.5)}
function openInv(){const keys=st.inv.filter(x=>ITEMS[x.id].key),rest=st.inv.filter(x=>!ITEMS[x.id].key);
 const row=x=>{const I=ITEMS[x.id];return '<div class="inv-it"><img src="'+A+'items/'+x.id+'.png" alt=""><div><b>'+esc(I.n)+(x.n>1?' ×'+x.n:'')+'</b><span>'+esc(I.d)+'</span></div></div>'};
 sheet('<h2>Rucksack</h2><div class="inv-gold">'+UI('gold')+' '+st.gold+' Gold</div>'+(keys.length?'<h4>Schlüsselgegenstände</h4>'+keys.map(row).join(''):'')+'<h4>Gegenstände</h4>'+(rest.length?rest.map(row).join(''):'<p class="mute">Noch leer. Das ändert sich schnell.</p>'))}
function openParty(){if(!st.hero)return;const h=st.hero,c=CLS[h.cls];
 const hero='<div class="pt-c"><div class="pt-p" style="background-image:url('+heroImg()+')"></div><div><b>'+heroName()+'</b><span>'+(h.f?c.nf:c.n)+', Stufe '+st.lvl+'</span><div class="pt-st">'+UI('st_str')+h.str+' '+UI('st_dex')+h.dex+' '+UI('st_wis')+h.wis+' '+UI('herz')+heroMaxHp()+'</div><span class="sk">'+[c.start,...h.skills].map(s=>SK[s].n).join(', ')+'</span></div></div>';
 sheet('<h2>Die Gruppe</h2>'+hero+st.party.map(id=>{const C=COMP[id];return '<div class="pt-c"><div class="pt-p" style="background-image:url('+A+'img/k_'+id+'.jpg)"></div><div><b>'+C.n+'</b><span>Element '+ELEM[C.el]+'</span><div class="pt-st">'+UI('herz')+C.hp+'</div><span class="sk">'+[...Object.keys(C.skills),...(st.flags['sk_'+id]||[])].map(s=>SK[s].n).join(', ')+'</span></div></div>'}).join('')+(st.party.length<4?'<p class="mute">Unterwegs wartet noch jemand auf dich.</p>':''))}
function openLog(){const days=Object.keys(st.done).map(Number).sort((a,b)=>a-b);
 sheet('<h2>Tagebuch</h2>'+(days.length?days.map(d=>'<button class="log-d" data-d="'+d+'"><b>Tag '+d+'</b><span>'+DAYN[d]+'</span></button>').join(''):'<p class="mute">Hier sammeln sich deine Abenteuer.</p>')+'<h4>Einstellungen</h4><label class="set"><input type="checkbox" id="set-auto"'+(st.auto?' checked':'')+'> Text läuft nach der Stimme automatisch weiter</label><label class="set"><input type="checkbox" id="set-own"'+(st.flags.own?' checked':'')+'> Ich würfle mit eigenen Würfeln</label>');
 $$('.log-d').forEach(b=>b.onclick=()=>{$('#sheet').classList.remove('on');playDay(+b.dataset.d,true)});
 $('#set-auto').onchange=e=>{st.auto=e.target.checked;save()};$('#set-own').onchange=e=>{st.flags.own=e.target.checked;save()}}

// Rätsel mit Eingabe oder Auswahl und drei Tipps
async function codeInput(c){hideBox();const o=$('#card');const key=SC.id+'_'+(c.id||'c');
 return new Promise(res=>{const draw=()=>{const n=st.hint[key]||0;
  o.innerHTML='<div class="c-card code"><div class="cc-k">'+esc(c.k||'Rätsel')+'</div><h3>'+T(c.q)+'</h3>'+(c.opts?'<div class="code-opts">'+c.opts.map((x,i)=>'<button class="code-o" data-i="'+i+'">'+T(x)+'</button>').join('')+'</div>':'<input class="code-in" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="'+(c.ph||'Lösung')+'"><button class="pbtn code-go">Prüfen</button>')+
  '<div class="hints">'+c.hints.map((h,i)=>'<button class="hint'+(i<n?' open':'')+'" data-i="'+i+'"><span>'+(i===2?'Lösung':'Tipp '+(i+1))+'</span>'+(i<n?T(h):i===n?'Antippen zum Aufdecken':'')+'</button>').join('')+'</div></div>';
  o.classList.add('on');
  $$('#card .hint').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(i!==(st.hint[key]||0))return;st.hint[key]=i+1;save();sfx('pergament',.5);draw()});
  const test=async v=>{const ok=c.opts?v===c.a:[].concat(c.h).includes(await QZ.hash(v));if(ok){sfx('richtig');o.classList.remove('on');res(true)}else{sfx('falsch');if(c.wrongSteps){o.classList.remove('on');await run(c.wrongSteps.filter(x=>!x.onlyOnce||!st.flags[key+'_w']));st.flags[key+'_w']=1;save();if(c.once)return res(false);draw()}else toast('Das stimmt noch nicht.')}};
  $$('#card .code-o').forEach(b=>b.onclick=()=>test(+b.dataset.i));const g=o.querySelector('.code-go');if(g){const i=o.querySelector('.code-in');g.onclick=()=>test(i.value);i.onkeydown=e=>{if(e.key==='Enter')test(i.value)}}};draw()})}
