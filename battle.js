// Rundenkampf: Elemente im Kreis, Gegner zeigen ihre Absicht, Niederlage heißt neu antreten
const ELEM={feuer:'Feuer',natur:'Natur',erde:'Erde',blitz:'Blitz',eis:'Eis',schatten:'Schatten'};
// Feuer schlägt Natur, Natur schlägt Erde, Erde schlägt Blitz, Blitz schlägt Eis, Eis schlägt Feuer
const BEATS={feuer:'natur',natur:'erde',erde:'blitz',blitz:'eis',eis:'feuer'};
function elemMul(a,d){if(!a||!d)return 1;if(BEATS[a]===d)return 2;if(BEATS[d]===a)return .5;return 1}

// Gefährten mit ihren Grundwerten
const COMP={
 gr:{n:'Grumbold',img:'k_gr',el:'erde',hp:24,atk:3,dmg:2,hit:'Steinfaust',skills:{steinwall:1}},
 zi:{n:'Zirpia',img:'k_zi',el:'natur',hp:11,atk:3,dmg:1,hit:'Lautenschlag',skills:{mutmach:1}},
 hu:{n:'Oma Hulda',img:'k_hu',el:'blitz',hp:15,atk:4,dmg:2,hit:'Stricknadel',skills:{taschendieb:1}},
 na:{n:'Nachtigall',img:'k_na',el:'eis',hp:16,atk:4,dmg:2,hit:'Krallenhieb',skills:{schattensprung:1}}
};
// Fähigkeiten im Kampf (Gefährten und Heldenklassen)
const SK={
 steinwall:{n:'Steinwall',d:'Blockt den nächsten Angriff auf eine Figur komplett',once:1,ally:1},
 glutfaust:{n:'Glutfaust',d:'Feuerangriff, Schaden W10 halbe plus 3',once:0,atk:{el:'feuer',add:3}},
 waermherz:{n:'Wärmendes Herz',d:'Heilt alle Figuren um 4',once:1},
 mutmach:{n:'Mutmachlied',d:'Alle plus 2 auf den nächsten Angriff',once:1},
 schlaflied:{n:'Schlaflied',d:'Ein Gegner setzt eine Runde aus',once:1,foe:1},
 ballade:{n:'Heldenballade',d:'Der nächste Angriff einer Figur macht doppelten Schaden',once:1,ally:1},
 taschendieb:{n:'Taschendiebstahl',d:'Stiehlt dem Gegner etwas Nützliches',once:1,foe:1},
 stahlfalle:{n:'Stahlgarnfalle',d:'Ein Gegner kann eine Runde nicht angreifen',once:1,foe:1},
 plaetzchen:{n:'Plätzchenpause',d:'Alle plus 3 Lebenspunkte und plus 1 auf den nächsten Wurf',once:1},
 schattensprung:{n:'Schattensprung',d:'Weicht dem nächsten Angriff aus und greift aus dem Schatten an',once:1,atk:{add:1}},
 frostkralle:{n:'Frostkralle',d:'Eisangriff mit 8 Schaden',once:1,atk:{el:'eis',fixed:8}},
 neunleben:{n:'Neun Leben',d:'Holt eine besiegte Figur mit halben Lebenspunkten zurück',once:1,ally:1,down:1},
 // Heldenklassen
 schildwall:{n:'Schildwall',d:'Blockt den nächsten Angriff komplett',once:1,ally:1},
 doppelschuss:{n:'Doppelschuss',d:'Zwei Angriffe in dieser Runde',once:1},
 elementar:{n:'Elementarzauber',d:'Angriff mit frei wählbarem Element',once:0,elem:1},
 hinterhalt:{n:'Hinterhalt',d:'Der erste Treffer zählt doppelt',passive:1},
 kampfschrei:{n:'Kampfschrei',d:'Alle plus 1 auf Angriffe für eine Runde',once:1},
 eisernwille:{n:'Eiserner Wille',d:'Bleibt einmal mit 1 Lebenspunkt stehen',passive:1},
 wirbelhieb:{n:'Wirbelhieb',d:'Trifft alle Gegner mit halbem Schaden',once:1},
 schildstoss:{n:'Schildstoß',d:'Probe gegen 12, bei Erfolg setzt der Gegner aus',once:1,foe:1},
 beschuetzer:{n:'Beschützer',d:'Nimmt eine Runde den Schaden einer Figur',once:1,ally:1},
 kraftschlag:{n:'Kraftschlag',d:'Doppelter Schaden, danach eine Runde Pause',once:1,foe:1},
 unbeugsam:{n:'Unbeugsam',d:'Plus 5 Lebenspunkte, plus 1 gegen Kälte',passive:1},
 heldenhieb:{n:'Heldenhieb',d:'Schaden 3 W10',once:1,foe:1},
 faehrte:{n:'Fährtenleser',d:'Plus 2 auf Wahrnehmung',passive:1},
 giftpfeil:{n:'Giftpfeil',d:'2 Schaden pro Runde für drei Runden',once:1,foe:1},
 hoernchen:{n:'Eichhörnchenfreund',d:'Ein Gegner minus 3 auf seinen nächsten Angriff',once:1,foe:1},
 pfeilregen:{n:'Pfeilregen',d:'Trifft alle Gegner mit halbem Schaden',once:1},
 tarnung:{n:'Tarnung',d:'Wird eine Runde lang nicht angegriffen',once:1},
 zielschuss:{n:'Zielschuss',d:'Plus 5 auf diesen Angriff, kritisch ab 18',once:1,foe:1},
 waldsegen:{n:'Waldsegen',d:'Zu Beginn jedes Kampfs heilen sich alle um 3',passive:1},
 meisterschuss:{n:'Meisterschuss',d:'Doppelter Schaden, ignoriert Elementnachteile',once:1,foe:1},
 schutzkreis:{n:'Schutzkreis',d:'Alle nehmen eine Runde 2 Schaden weniger',once:1},
 funkenregen:{n:'Funkenregen',d:'3 Schaden an allen Gegnern',once:1},
 spiegelbild:{n:'Spiegelbild',d:'Der nächste Angriff auf dich verfehlt',once:1},
 elementwandel:{n:'Elementwandel',d:'Ändert das Element eines Gegners',once:1,foe:1,elem:1},
 heilzauber:{n:'Heilzauber',d:'Eine Figur plus 6 Lebenspunkte',once:1,ally:1},
 kettenblitz:{n:'Kettenblitz',d:'Blitzschaden an zwei Gegnern',once:1},
 zeitstopp:{n:'Zeitstopp',d:'Die Gruppe bekommt eine zusätzliche Runde',once:1},
 sternenfeuer:{n:'Sternenfeuer',d:'Schaden 4 W10 an einem Gegner',once:1,foe:1},
 schmutztrick:{n:'Schmutziger Trick',d:'Ein Gegner minus 3 auf seinen nächsten Angriff',once:1,foe:1},
 ausweichen:{n:'Ausweichen',d:'Einmal pro Kampf nur halber Schaden',passive:1},
 finger:{n:'Geschickte Finger',d:'Plus 4 auf Fallen und Schlösser',passive:1},
 rauchbombe:{n:'Rauchbombe',d:'Alle Gegner verfehlen eine Runde',once:1},
 giftklinge:{n:'Giftklinge',d:'2 Schaden pro Runde für drei Runden',once:1,foe:1},
 schattenpartner:{n:'Schattenpartner',d:'Mit Nachtigall zusammen doppelter Schaden',once:1,foe:1},
 glueckspilz:{n:'Glückspilz',d:'Ein Wurf zählt als natürliche Zwanzig',once:1,foe:1},
 meisterdieb:{n:'Meisterdieb',d:'Bei der Beute zweimal würfeln',passive:1}
};

// Gegner
const FOES={
 ratten:{t:'Riesenratten im Keller',bg:'arena_ratten',mus:'kampf',foes:[{n:'Riesenratte',img:'g_ratte',hp:4,el:'natur',def:8,acts:[{n:'Knabbern',min:1,max:2}]},{n:'Riesenratte',img:'g_ratte',hp:4,el:'natur',def:8,acts:[{n:'Knabbern',min:1,max:2}]},{n:'Riesenratte',img:'g_ratte',hp:4,el:'natur',def:8,acts:[{n:'Knabbern',min:1,max:2}]}],tut:1},
 motten:{t:'Aschenmotten',bg:'arena_motten',mus:'kampf',foes:[{n:'Aschenmotte',img:'g_motte',hp:7,el:'feuer',def:9,acts:[{n:'Flügelschlag',min:2,max:3},{n:'Licht fressen',fear:1}]},{n:'Aschenmotte',img:'g_motte',hp:7,el:'feuer',def:9,acts:[{n:'Flügelschlag',min:2,max:3},{n:'Licht fressen',fear:1}]}]},
 spinne:{t:'Die Spinnenkönigin',bg:'arena_spinne',mus:'boss',foes:[{n:'Spinnenkönigin',img:'g_spinne',hp:24,el:'natur',def:11,boss:1,acts:[{n:'Giftbiss',min:3,max:4},{n:'Netzwurf',web:1}]},{n:'Spinnling',img:'g_spinnling',hp:5,el:'natur',def:9,acts:[{n:'Zwicken',min:1,max:2}]},{n:'Spinnling',img:'g_spinnling',hp:5,el:'natur',def:9,acts:[{n:'Zwicken',min:1,max:2}]}]},
 krok:{t:'Der Krokodilkönig',bg:'arena_krok',mus:'boss',foes:[{n:'Krokodilkönig',img:'g_krok',hp:30,el:'erde',def:12,boss:1,acts:[{n:'Schnappen',min:4,max:5},{n:'Schlammrolle',all:2,warn:1}]}]},
 eis:{t:'Der Eiswächter',bg:'arena_eis',mus:'boss',foes:[{n:'Eiswächter',img:'g_eis',hp:36,el:'eis',def:13,boss:1,acts:[{n:'Eiszapfen',min:5,max:5},{n:'Frosthauch',all:2,warn:1,cold:1}]}]},
 drache:{t:'Vharkon, der Aschenkönig',bg:'arena_drache',mus:'boss',phases:[.8,.6,.4,.2,0],foes:[{n:'Vharkon',img:'g_drache',hp:60,el:'feuer',def:12,boss:1,acts:[{n:'Klauenhieb',min:3,max:5},{n:'Kalter Ascheatem',all:2,warn:1,cold:1},{n:'Ascheregen',blind:2,warn:1}]}]},
 asche:{t:'Die Aschenwächter',bg:'arena_asche',mus:'boss',foes:[{n:'Aschenwächter',img:'g_asche',hp:22,el:'feuer',def:13,acts:[{n:'Aschenschlag',min:4,max:4},{n:'Aschewolke',blind:2,warn:1}]},{n:'Aschenwächter',img:'g_asche',hp:22,el:'feuer',def:13,acts:[{n:'Aschenschlag',min:4,max:4},{n:'Aschewolke',blind:2,warn:1}]}]}
};

const CLS={
 krieger:{n:'Krieger',nf:'Kriegerin',stat:'str',start:'schildwall',hit:'Schwerthieb'},
 waldlaeufer:{n:'Waldläufer',nf:'Waldläuferin',stat:'dex',start:'doppelschuss',hit:'Pfeilschuss'},
 magier:{n:'Magier',nf:'Magierin',stat:'wis',start:'elementar',hit:'Zauberstab'},
 schurke:{n:'Schurke',nf:'Schurkin',stat:'dex',start:'hinterhalt',hit:'Dolchstich'}
};
const LVL_SK={krieger:[['kampfschrei','eisernwille'],['wirbelhieb','schildstoss'],['beschuetzer','kraftschlag'],['unbeugsam','heldenhieb']],
 waldlaeufer:[['faehrte','giftpfeil'],['hoernchen','pfeilregen'],['tarnung','zielschuss'],['waldsegen','meisterschuss']],
 magier:[['schutzkreis','funkenregen'],['spiegelbild','elementwandel'],['heilzauber','kettenblitz'],['zeitstopp','sternenfeuer']],
 schurke:[['schmutztrick','ausweichen'],['finger','rauchbombe'],['giftklinge','schattenpartner'],['glueckspilz','meisterdieb']]};

function heroMaxHp(){const h=st.hero;return 10+h.str*2+(st.lvl-1)*3+(h.skills.includes('unbeugsam')?5:0)+(st.flags.drachenhaut?3:0)}
function partyUnits(){const h=st.hero,c=CLS[h.cls];
 const u=[{id:'held',n:h.name,img:null,hero:1,el:h.cls==='magier'?null:null,hp:heroMaxHp(),max:heroMaxHp(),atk:h[c.stat],stat:c.stat,dmg:1,hit:c.hit,skills:[c.start,...h.skills.filter(s=>!SK[s].passive)]}];
 st.party.filter(id=>!(window.FIGHTKEY==='eis'&&id==='na')).forEach(id=>{const C=COMP[id];const ex=(st.flags['sk_'+id]||[]);u.push({id,n:C.n,img:C.img,el:C.el,hp:C.hp,max:C.hp,atk:C.atk,dmg:C.dmg,hit:C.hit,skills:[...Object.keys(C.skills),...ex]})});return u}

let B=null;
const ACIC={krieger:'ac_schwert',waldlaeufer:'ac_bogen',magier:'ac_stab',schurke:'ac_dolch',gr:'ac_steinfaust',zi:'ac_laute',hu:'ac_stricknadel',na:'ac_kralle'};
function weapIc(u){return A+'ui/'+(ACIC[u.hero?st.hero.cls:u.id]||'ac_schwert')+'.png'}
function unitFace(u){return u.hero?heroImg():A+'img/p_'+u.id+'_0.jpg'}
async function fight(key){window.FIGHTKEY=key;const F=FOES[key];let tries=0;
 while(true){const r=await battle(F,key,tries);if(r)return true;tries++;
  await koScreen(key,tries);}}
// Niederlage: Held liegt am Boden, Spruch vom Spielleiter, großer Knopf in der Mitte
const KO=['Du bist nicht besiegt. Du machst nur eine sehr gründliche Bodenprüfung.','Game Over? Nicht bei mir. Hier gibt es unendlich viele Versuche und man braucht nicht mal Münzen.','Die Prinzessin ist übrigens in einem anderen Schloss. Ach nein, falsche Geschichte. Steh auf!','Zum Glück habe ich gespeichert. Ich speichere immer. Ich bin der Spielleiter.','Kleine Pause auf dem Boden. Der Boden ist kalt, aber er läuft wenigstens nicht weg.'];
function koScreen(key,tries){return new Promise(r=>{const h=st.hero;const i=(tries-1)%KO.length;const tip=TIPS[key];
 const o=el('div','ovl ko-ovl on','<div class="ko-bg" style="background-image:url('+A+'img/ko_'+h.cls+'_'+h.look+'.jpg)"></div><div class="ko-in"><div class="ko-t">Besiegt!</div><div class="ko-sl"><span class="ko-f" style="background-image:url('+A+'img/p_sl.jpg)"></span><p>'+esc(KO[i])+'</p></div>'+(tip?'<div class="ko-tip"><b>Tipp</b>'+esc(tip)+'</div>':'')+'</div><button class="ko-go"><span>Nochmal versuchen</span></button>');
 document.body.appendChild(o);sfx('niederlage',.5);const a=playVo(A+'vo/ko_'+(i+1)+'.mp3');
 o.querySelector('.ko-go').onclick=()=>{if(a)stopVo();sfx('schwert_ziehen',.7);o.classList.add('out');setTimeout(()=>{o.remove();r()},450)}})}

async function battle(F,key,tries){const ov=$('#battle');ov.innerHTML='';ov.classList.add('on');music(A+'mus/'+(F.mus||'kampf')+'.mp3',.5);
 B={F,key,phI:F.phases?(st.flags.dph||0):0,round:0,foes:F.foes.map((f,i)=>({...f,i,max:f.hp,skip:0,minus:0,poison:0,intent:null})),party:partyUnits(),used:{},buff:{},first:true,log:[]};
 if(F.phases&&B.phI){const f=B.foes.find(x=>x.boss);if(f)f.hp=Math.max(1,Math.ceil(F.phases[B.phI-1]*f.max)-2)}
 if(st.hero.skills.includes('waldsegen'))B.party.forEach(p=>p.hp=Math.min(p.max,p.hp+3));
 ov.innerHTML='<div class="bt-bg" style="background-image:url('+A+'img/'+F.bg+'.jpg)"></div><div class="bt-top"><div class="bt-t">'+esc(F.t)+'</div><div class="bt-r" id="bt-r"></div><button class="bt-ekb" id="bt-ekb" aria-label="Elementkreis"></button><button class="bt-help" id="bt-help" aria-label="Erklärung">?</button></div><div class="bt-foes" id="bt-foes"></div><div class="bt-log" id="bt-log"></div><div class="bt-party" id="bt-party"></div><div class="bt-act" id="bt-act"></div>';
 preloadSprites();sfx('schwert_ziehen');setTimeout(()=>{if(B){B._fszLock=0;fitFoes(true);B._fszLock=1}},700);if(tries&&TIPS[key])blog('Tipp: '+TIPS[key],1);
 B.tut=!!(F.tut&&!st.flags.tut_done);$('#bt-help').onclick=()=>{sfx('ui_klick',.5);tutHelp()};$('#bt-ekb').classList.toggle('on',!!st.flags.tut_t11);$('#bt-ekb').onclick=()=>{sfx('pergament',.5);ekShow()};
 while(true){B.round++;const rr=$('#bt-r');rr.innerHTML='<img src="'+A+'ui/sanduhr.png" alt=""><span>Runde</span><b>'+B.round+'</b>';rr.classList.remove('pop');void rr.offsetWidth;rr.classList.add('pop');planFoes();render();
  if(B.tut&&B.round===1){await sleep(400);await tutorial()}
  for(const u of B.party){if(u.hp<=0)continue;if(u.web){u.web=0;blog(u.n+' hängt im Netz fest und setzt aus.');render();await sleep(900);continue}
   if(u.pause){u.pause=0;blog(u.n+' holt Luft.');continue}
   await partyTurn(u);render();await phaseCheck();if(B.foes.every(f=>f.hp<=0))return win();}
  for(const f of B.foes){if(f.hp<=0)continue;if(f.poison>0){f.poison--;hurtFoe(f,2,null,'Gift');if(f.hp<=0)continue}
   if(f.skip){f.skip--;blog(f.n+' setzt aus.');render();await sleep(700);continue}
   await foeTurn(f);render();if(B.tut&&B.foes.filter(x=>x.hp>0).slice(-1)[0]===f)await tutOnce('t10');if(B.party[0].hp<=0&&B.party.every(p=>p.hp<=0))return lose();if(B.party.every(p=>p.hp<=0))return lose()}
  if(B.party[0].hp<=0&&!B.party.slice(1).some(p=>p.hp>0))return lose();
  if(B.foes.every(f=>f.hp<=0))return win();
  B.buff.all=0;B.buff.shield=0;B.party.forEach(p=>{p.blind=Math.max(0,(p.blind||0)-1)})}
}
const TIPS={ratten:'Ratten haben wenig Lebenspunkte. Ein Treffer reicht oft.',motten:'Grumbolds Steinwall blockt einen ganzen Angriff. Setz ihn auf die Figur mit den wenigsten Lebenspunkten.',spinne:'Feuer schlägt Natur. Grumbolds Glutfaust macht doppelten Schaden.',krok:'Natur schlägt Erde. Zirpia trifft doppelt, ihr Schlaflied lässt ihn aussetzen.',eis:'Blitz schlägt Eis. Oma Hulda macht doppelten Schaden.',asche:'Eis schlägt Feuer. Nachtigall macht doppelten Schaden.'};
function blog(t,tip){const l=$('#bt-log');if(!l)return;const p=el('div',tip?'tip':'',esc(t));l.prepend(p);while(l.children.length>3)l.lastChild.remove()}
function planFoes(){B.foes.forEach(f=>{if(f.hp<=0)return;if(f.warned){f.intent=f.warned;f.warned=null;return}
 const a=f.acts[(B.round+f.i)%f.acts.length];if(a.warn&&!f.intent?.warn){f.intent={n:'holt aus',pre:a};f.warned=a;return}f.intent=a})}
// Neuzeichnen ohne den DOM jedes Mal neu zu bauen: Elemente bleiben, nur Werte ändern sich (flüssiger auf dem Handy)
function setBI(e,u){if(e._u!==u){e._u=u;e.style.backgroundImage='url('+u+')'}}
function render(){const fo=$('#bt-foes');$('#battle').classList.toggle('myturn',!!B.cur);fo.classList.toggle('many',B.foes.length>=3);
 B.foes.forEach(f=>{let d=fo.querySelector('.bt-f[data-i="'+f.i+'"]');
  if(!d){d=el('div','bt-f'+(f.boss?' boss':''),'<div class="bt-fi"></div><div class="bt-hp"><i></i></div><div class="bt-fn">'+esc(f.n)+' <span class="el el-'+f.el+'"></span></div><div class="bt-int"></div>');d.dataset.i=f.i;fo.appendChild(d)}
  d.classList.toggle('down',f.hp<=0);setBI(d.querySelector('.bt-fi'),A+'img/'+f.img+'_'+(f.hp<=0?3:(f.fr||0))+'.png');d.querySelector('.bt-hp i').style.width=Math.max(0,f.hp/f.max*100)+'%';
  const it=d.querySelector('.bt-int');const txt=f.hp>0&&f.intent?(f.intent.pre?f.intent.pre.n+' kommt':f.intent.n):'';if(it.textContent!==txt)it.textContent=txt;it.style.display=txt?'':'none'});
 fitFoes();const pa=$('#bt-party');const vw=Math.min(innerWidth,480);const pw=Math.round(Math.min(150,innerHeight*.17/1.35*1.35,(vw-16)/(B.party.length+(B.party.some(p=>p.id==='gr')?.25:0))*(B.party.length>2?1.18:1)-6))+'px';if(pa._pw!==pw){pa._pw=pw;pa.style.setProperty('--pw',pw)}
 B.party.forEach((u,k)=>{const pose=u.hp<=0?3:(u.pose||0);let d=pa.querySelector('.bt-u[data-k="'+k+'"]');
  if(!d){d=el('div','bt-u'+(u.id==='gr'?' big':'')+(u.id==='hu'||u.id==='zi'?' small':''),'<div class="bt-sp"></div><div class="bt-hp p"><i></i></div><div class="bt-un"><span class="bt-mini"></span><b></b>'+(u.el?'<span class="el el-'+u.el+'"></span>':'')+'</div>');d.dataset.k=k;pa.appendChild(d)}
  d.classList.toggle('down',u.hp<=0);d.classList.toggle('cur',B.cur===u);d.classList.toggle('atk',pose===1);d.classList.toggle('hurt',pose===2);
  setBI(d.querySelector('.bt-sp'),spriteSrc(u,pose));d.querySelector('.bt-hp i').style.width=Math.max(0,u.hp/u.max*100)+'%';
  setBI(d.querySelector('.bt-mini'),u.hero?heroImg():A+'img/p_'+u.id+'_'+(u.hp<=0?8:(u.face??0))+'.jpg');const t=u.hp+'/'+u.max;const bb=d.querySelector('.bt-un b');if(bb.textContent!==t)bb.textContent=t});markPick()}
// Rückansicht im Kampf: 0 bereit, 1 Angriff, 2 getroffen, 3 besiegt
function fitFoes(force){const fo=$('#bt-foes');if(!fo)return;if(B&&B._fszLock&&B._fsz&&!force&&B._fszN===B.foes.length){fo.style.setProperty('--fsz',B._fsz);return}const n=Math.max(1,B.foes.length);const h=fo.clientHeight,w=fo.clientWidth;if(!h)return;const byH=h-86,byW=(w-12)/n*.92;const big=n===1&&B.foes[0].boss;const v=Math.round(Math.max(80,Math.min(byH,big?(w-8)*.98:byW,big?420:300)))+'px';fo.style.setProperty('--fsz',v);if(B){B._fsz=v;B._fszN=B.foes.length}}
addEventListener('resize',()=>{if(B)fitFoes(true)});
function spriteSrc(u,p){return A+'img/b_'+(u.hero?st.hero.cls+'_'+st.hero.look:u.id)+'_'+p+'.png'}
function poseFor(u,p,ms){u.pose=p;clearTimeout(u._pt);if(B)render();u._pt=setTimeout(()=>{u.pose=0;if(B)render()},ms)}
const PRE=[];function preImg(src){const i=new Image();i.decoding='async';i.src=src;PRE.push(i);if(PRE.length>200)PRE.shift()}
function preloadSprites(){B.party.forEach(u=>{for(let p=0;p<4;p++)preImg(spriteSrc(u,p))});
 B.foes.forEach(f=>{for(let p=0;p<4;p++)preImg(A+'img/'+f.img+'_'+p+'.png')});
 Object.values(PROJ).flat().forEach(n=>preImg(A+'ui/'+n+'.png'));['hit','magic','smoke'].forEach(k=>{for(let i=0;i<4;i++)preImg(A+'ui/fx_'+k+'_'+i+'.png')});
 preSfx([...new Set(Object.values(PSFX))].concat(['falsch','daneben','wurf_fail','treffer','sieg','niederlage','patzer','kritisch','wuerfel','trank','au','ui_klick']));markPick()}
function pick(sel,filter){return new Promise(r=>{B.picking={sel,filter,r};markPick()})}
// Auswahl übersteht jedes Neuzeichnen: Markierung wird nach render erneut gesetzt, Klick über den Container
function markPick(){const P=B&&B.picking;if(!P)return;$$(P.sel).forEach(e=>{const ok=P.filter(e);e.classList.toggle('pickable',ok);e.onclick=ok?()=>{const Q=B.picking;if(!Q)return;B.picking=null;$$(Q.sel).forEach(x=>{x.classList.remove('pickable');x.onclick=null});Q.r(e)}:null})}
async function partyTurn(u){B.cur=u;render();const act=$('#bt-act');
 const sks=[];[...new Set(u.skills)].forEach(s=>{const S=SK[s];if(!S||S.passive)return;if(S.once&&B.used[u.id+s])return;sks.push({k:'sk',s,t:S.n,d:S.d,ic:A+'ui/sk/'+s+'.png'})});
 const pots=st.inv.filter(x=>ITEMS[x.id]&&ITEMS[x.id].use);
 const choose=(title,opts,cls,back)=>new Promise(r=>{act.className='bt-act'+(cls?' '+cls:'');act.innerHTML='<div class="bt-who"><span class="bt-wf" style="background-image:url('+unitFace(u)+')"></span>'+esc(title)+'</div>';const row=el('div','bt-btns'+(cls?' list':''));act.appendChild(row);
  opts.forEach(o=>{const b=el('button','bt-b'+(o.k==='sk'?' sk':'')+(o.it?' it':'')+(o.ic?' ic':''),(o.it?'<img src="'+A+'items/'+o.it.id+'.png" alt="">':'')+(o.ic?'<img class="bt-ic" src="'+o.ic+'" alt="">':'')+'<b>'+esc(o.t)+'</b>'+(o.d?'<span>'+esc(o.d)+'</span>':''));b.onclick=()=>{sfx('ui_klick',.6);r(o)};row.appendChild(b)});
  if(back){const b=el('button','bt-back','Zurück');b.onclick=()=>{sfx('ui_klick',.5);r(null)};act.appendChild(b)}});
 let ch=null;
 for(;;){ch=null;
 while(!ch){const main=[{k:'atk',t:u.hit,ic:weapIc(u)}];if(sks.length)main.push({k:'skm',t:'Fähigkeiten',d:sks.length+' zur Auswahl',ic:A+'ui/ac_faehigkeit.png'});if(pots.length)main.push({k:'itm',t:'Gegenstand',d:pots.length+' im Gepäck',ic:A+'ui/ac_gegenstand.png'});
  const mp=choose(u.n+' ist dran',main);if(u.hero&&B.tut)await tutOnce('t07');const m=await mp;
  if(m.k==='atk'){const f=await pickFoeBack(act);if(f){ch=m;ch.f=f}continue}
  if(m.k==='skm'){const s=await choose('Fähigkeit wählen',sks,'sheet',1);if(s)ch=s;continue}
  if(m.k==='itm'){const it=await choose('Gegenstand wählen',pots.map(x=>({k:'item',it:x,t:ITEMS[x.id].n,d:ITEMS[x.id].d})),'sheet',1);if(it)ch=it;continue}}
 act.className='bt-act';act.innerHTML='<div class="bt-who">'+esc(ch.k==='atk'?u.hit:ch.t)+'</div>';
 if(ch.k==='atk'){if(await attack(u,ch.f,{back:1})==='back')continue;}
 else if(ch.k==='item'){await useItemBattle(u,ch.it)}
 else await useSkill(u,ch.s);
 break}
 act.innerHTML='';if(B&&B._elT){B._elT=0;await coach('t11');const k=$('#bt-ekb');if(k){k.classList.add('on','new');setTimeout(()=>k.classList.remove('new'),4000)}}B.cur=null}
async function pickFoeBack(act){const alive=B.foes.filter(f=>f.hp>0);if(alive.length===1)return alive[0];
 act.className='bt-act';act.innerHTML='<div class="bt-who">Wähle ein Ziel</div><p class="bt-hint">Tippe auf einen Gegner.</p>';const b=el('button','bt-back','Zurück');act.appendChild(b);
 const back=new Promise(r=>{b.onclick=()=>{sfx('ui_klick',.5);const Q=B.picking;B.picking=null;if(Q)$$(Q.sel).forEach(x=>{x.classList.remove('pickable');x.onclick=null});r(null)}});
 const f=await Promise.race([pickFoe(),back]);return f}
async function pickFoe(){const alive=B.foes.filter(f=>f.hp>0);if(alive.length===1)return alive[0];const e=await pick('#bt-foes .bt-f',e=>B.foes[+e.dataset.i].hp>0);return B.foes[+e.dataset.i]}
async function pickAlly(down){const e=await pick('#bt-party .bt-u',e=>down?B.party[+e.dataset.k].hp<=0:B.party[+e.dataset.k].hp>0);return B.party[+e.dataset.k]}
async function attack(u,f,o){let bonus=u.atk+(B.buff.all||0)+(u.next||0)+(o.add||0)-(u.blind?2:0);u.next=0;
 let v;if(u.hero){if(B.tut){await tutOnce('t08');await tutOnce('t09')}const r=await rollD20({title:u.hit+' gegen '+f.n,sub:'W20 plus '+bonus+', Ziel '+f.def,bonus,ziel:f.def,force:o.crit?20:null,back:o.back});if(!r){u.next=bonus-u.atk-(B.buff.all||0)-(o.add||0)+(u.blind?2:0);return 'back'}v=r}else{const x=rnd(20);v={v:x,total:x+bonus,crit:x===20,fumble:x===1}}
 poseFor(u,1,700);const pk=projKind(u,o);if(pk&&!(v.fumble&&u.hero))await shoot(u,f,pk,v.total<f.def&&!v.crit);else if(!u.hero)await sleep(250);
 if(v.fumble&&u.hero){popFx(foeEl(f),'fumble','Patzer!','Eine 1 gewürfelt');await fumble();return}
 if(v.total<f.def&&!v.crit){popFx(foeEl(f),'miss','Daneben!',u.hero?v.total+' reicht nicht, Ziel '+f.def:'');blog(u.n+' verfehlt.');sfx('daneben',.7);await sleep(500);return}
 let dmg=o.fixed||(Math.ceil(d10()/2)+u.dmg+(o.dmgAdd||0));const el_=o.el||u.el;let m=o.ignore?Math.max(1,elemMul(el_,f.el)):elemMul(el_,f.el);
 if(v.crit)dmg*=2;if(u.hero&&B.first&&st.hero.cls==='schurke'){dmg*=2;B.first=false}if(u.ballad){dmg*=2;u.ballad=0}if(o.double)dmg*=2;
 dmg=Math.max(1,Math.round(dmg*m));u.face=m>1||v.crit?3:6;setTimeout(()=>{u.face=0;if(B)render()},800);hurtFoe(f,dmg,u,null,m);if(v.crit)setTimeout(()=>popFx(foeEl(f),'crit','Kritischer Treffer!','Doppelter Schaden'),200);if(m>1&&el_&&f.el)setTimeout(()=>popFx(foeEl(f),'super','Super effektiv!','Doppelter Schaden',[el_,f.el],v.crit?110:0),v.crit?700:200);else if(m<1&&el_&&f.el)setTimeout(()=>popFx(foeEl(f),'weak','Nicht sehr wirksam','Halber Schaden',[el_,f.el]),200);if(m>1)superEff(u,f,el_);if(v.crit&&u.hero)critLine();await sleep(650)}
// Großes Banner in der Bildmitte mit Strahlenkranz, Elementsymbolen und Schmuckschrift
function popBig(kind,main,sub,els,dy){const ov=$('#battle');if(!ov)return;
 const d=el('div','bt-big '+kind,'<div class="bb-rays"></div>'+(els?'<div class="bb-els"><span class="bb-el"><span class="el el-'+els[0]+'"></span><i>'+ELEM[els[0]]+'</i></span><span class="bb-arr"></span><span class="bb-el"><span class="el el-'+els[1]+'"></span><i>'+ELEM[els[1]]+'</i></span></div>':'')+'<div class="bb-rib"><b>'+esc(main)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</div>');
 const fo=$('#bt-foes'),o=ov.getBoundingClientRect(),r=fo?fo.getBoundingClientRect():o;d.style.top=(r.top-o.top+r.height*.55+(dy?90:0))+'px';ov.appendChild(d);
 if(kind==='super'||kind==='crit')sparkle(d);ov.classList.add('bigfx');clearTimeout(ov._bf);ov._bf=setTimeout(()=>ov.classList.remove('bigfx'),2600);setTimeout(()=>d.remove(),2700)}
function sparkle(d){for(let i=0;i<14;i++){const s=el('i','bb-sp');const a=Math.random()*Math.PI*2,r=70+Math.random()*90;s.style.setProperty('--dx',Math.cos(a)*r+'px');s.style.setProperty('--dy',Math.sin(a)*r*.7+'px');s.style.animationDelay=(Math.random()*.25)+'s';d.appendChild(s)}}
// Große Einblendungen im Kampf: Schaden, super effektiv, Treffer und Patzer
function popFx(target,kind,main,sub,els,dy){if(!target||!$('#battle'))return;if(kind==='super'||kind==='weak'||kind==='crit')return popBig(kind,main,sub,els,dy);const ov=$('#battle'),r=target.getBoundingClientRect(),o=ov.getBoundingClientRect();
 const d=el('div','bt-pop '+kind,(els?'<div class="bp-els"><span class="el el-'+els[0]+'"></span><i class="bp-arr"></i><span class="el el-'+els[1]+'"></span></div>':'')+'<b>'+esc(main)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':''));
 d.style.left=(r.left-o.left+r.width/2)+'px';d.style.top=(r.top-o.top+r.height*(kind==='dmg'||kind==='heal'?.35:.25)+(dy||0))+'px';ov.appendChild(d);const hw=d.offsetWidth/2+8,cx=r.left-o.left+r.width/2;d.style.left=Math.max(hw,Math.min(o.width-hw,cx))+'px';setTimeout(()=>d.remove(),kind==='dmg'||kind==='heal'?1300:2300)}
function foeEl(f){return $('#bt-foes .bt-f[data-i="'+f.i+'"] .bt-fi')}
function unitEl(u){return $('#bt-party .bt-u[data-k="'+B.party.indexOf(u)+'"] .bt-sp')}
// Fliegende Angriffe: Pfeil, Zauber, Stein, Noten
const PROJ={feuer:['p_feuer_0','p_feuer_1'],eis:['p_eis_0','p_eis_1'],blitz:['p_blitz_0','p_blitz_1'],pfeil:['p_pfeil'],gift:['p_giftpfeil'],stein:['p_stein_0','p_stein_1'],noten:['p_note_0','p_note_1'],dolch:['p_dolch'],stern:['p_stern'],natur:['p_blatt'],erde:['p_stein_0','p_stein_1'],bombe:['p_bombe']};
const PSFX={feuer:'feuerball',eis:'eis_knackt',blitz:'donner',pfeil:'wuerfel',gift:'wuerfel',stein:'stein',noten:'zauber',stern:'zauber',natur:'zauber',erde:'stein',bombe:'puff',dolch:'schwert_ziehen'};
function projKind(u,o){if(o&&o.proj)return o.proj;if(u.hero){const c=st.hero.cls;if(c==='waldlaeufer')return 'pfeil';if(c==='magier')return (o&&o.el)||'stern';return null}
 if(u.id==='gr')return o&&o.el==='feuer'?'feuer':'stein';if(u.id==='zi')return 'noten';if(u.id==='hu')return 'blitz';if(u.id==='na')return o&&o.el==='eis'?'eis':null;return null}
async function shoot(u,f,kind,miss){const ov=$('#battle');const ue=$('#bt-party .bt-u[data-k="'+B.party.indexOf(u)+'"] .bt-sp'),fe=$('#bt-foes .bt-f[data-i="'+f.i+'"] .bt-fi');if(!ue||!fe||!PROJ[kind])return;
 const R=ov.getBoundingClientRect(),a=ue.getBoundingClientRect(),b=fe.getBoundingClientRect();
 const x0=a.left+a.width*.5-R.left,y0=a.top+a.height*.3-R.top,x1=b.left+b.width*.5-R.left+(miss?b.width*.7:0),y1=b.top+b.height*.5-R.top+(miss?-b.height*.4:0);
 const fr=PROJ[kind],p=el('div','proj'+(kind==='stein'||kind==='erde'||kind==='dolch'?' spin':''),'<img src="'+A+'ui/'+fr[0]+'.png" alt="">');ov.appendChild(p);const im=p.firstChild;
 const ang=Math.atan2(y1-y0,x1-x0)*180/Math.PI;const arc=(kind==='stein'||kind==='erde'||kind==='bombe')?-Math.min(140,Math.abs(y1-y0)*.6+60):-30;
 sfx(PSFX[kind]||'zauber',.6);const T=kind==='blitz'?320:kind==='pfeil'||kind==='gift'?480:700;const t0=performance.now();let k=0;
 await new Promise(res=>{const step=t=>{const q=Math.min(1,(t-t0)/T);const x=x0+(x1-x0)*q,y=y0+(y1-y0)*q+arc*4*q*(1-q);const dy=(y1-y0)+arc*4*(1-2*q);const rot=Math.atan2(dy,x1-x0)*180/Math.PI;
  const sc=.55+.45*q;p.style.transform='translate('+x+'px,'+y+'px) translate(-50%,-50%) rotate('+(p.classList.contains('spin')?q*720:rot)+'deg) scale('+sc+')';
  if(fr.length>1&&(k++%4===0))im.src=A+'ui/'+fr[(k>>2)%fr.length]+'.png';
  if(kind==='noten'||kind==='stern'||kind==='feuer'||kind==='eis'||kind==='natur'){if(k%3===0){const t2=el('i','ptrail '+kind);t2.style.left=x+'px';t2.style.top=y+'px';ov.appendChild(t2);setTimeout(()=>t2.remove(),450)}}
  if(q<1)requestAnimationFrame(step);else res()};requestAnimationFrame(step)});
 p.remove();if(!miss){const fxk=kind==='feuer'?'hit':kind==='eis'||kind==='blitz'||kind==='stern'||kind==='noten'||kind==='natur'?'magic':kind==='bombe'?'smoke':'hit';fx(fxk,fe)}}
// Mehrere Ziele auf einmal
async function shootAll(u,kind){const al=B.foes.filter(f=>f.hp>0);await Promise.all(al.map((f,i)=>sleep(i*120).then(()=>shoot(u,f,kind,false))))}
function hurtFoe(f,d,u,why,m){f.hp=Math.max(0,f.hp-d);if(B&&B.F.phases&&f.boss){const th=B.F.phases[B.phI];if(th!==undefined&&th>0)f.hp=Math.max(f.hp,Math.ceil(th*f.max))}sfx('treffer',.8);popFx(foeEl(f),'dmg',String(d),'Schaden');blog((u?u.n:why)+' trifft '+f.n+': '+d+' Schaden'+(m>1?', super effektiv':m<1?', nicht sehr wirksam':''));render();
 f.fr=2;setTimeout(()=>{f.fr=0;if(B)render()},450);render();const e=$('#bt-foes .bt-f[data-i="'+f.i+'"]');if(e){fx('hit',e.querySelector('.bt-fi'));e.classList.add('hit');const n=el('div','dmg',''+d);e.appendChild(n);setTimeout(()=>e.classList.remove('hit'),400)}if(f.hp<=0)blog(f.n+' ist besiegt.')}
async function foeTurn(f){const a=f.intent;if(!a||a.pre){blog(f.n+' holt aus. Achtung, nächste Runde kommt '+a.pre.n+'.');await sleep(800);return}
 const alive=B.party.filter(p=>p.hp>0&&!p.hidden);if(!alive.length)return;
 if(B.buff.smoke){blog(f.n+' tappt im Rauch und verfehlt.');await sleep(700);return}
 f.fr=1;render();setTimeout(()=>{f.fr=0;if(B)render()},600);const e=$('#bt-foes .bt-f[data-i="'+f.i+'"]');e&&e.classList.add('lunge');setTimeout(()=>e&&e.classList.remove('lunge'),400);
 if(a.all){for(const p of alive)hurtUnit(p,a.all-(a.cold&&st.flags.schal?1:0)-(B.buff.circle?2:0),f,a.n);await sleep(800);return}
 if(a.blind){alive.forEach(p=>p.blind=2);blog(f.n+': '+a.n+'. Alle minus '+a.blind+' auf den nächsten Wurf.');await sleep(800);return}
 const t=alive[Math.floor(Math.random()*alive.length)];
 if(a.web){t.web=1;blog(f.n+' wirft ein Netz auf '+t.n+'.');sfx('netz',.7);await sleep(800);return}
 if(a.fear){const g=B.party.find(p=>p.id==='gr');if(g&&g.hp>0){g.next=-1;blog(f.n+' frisst eine Laterne. Grumbold bekommt Angst: minus 1.')}else blog(f.n+' frisst eine Laterne. Es wird dunkler.');await sleep(800);return}
 let d=a.min+Math.floor(Math.random()*(a.max-a.min+1))-(f.minus||0)-(B.buff.circle?2:0);f.minus=0;hurtUnit(t,Math.max(0,d),f,a.n);await sleep(800)}
function hurtUnit(u,d,f,an){if(u.block){u.block=0;blog(an+' prallt am Steinwall ab.');sfx('stein',.7);return}
 if(u.dodge){u.dodge=0;blog(u.n+' springt in den Schatten. Daneben.');return}
 if(u.mirror){u.mirror=0;blog(an+' trifft nur ein Spiegelbild.');return}
 if(u.hero&&st.hero.skills.includes('ausweichen')&&!B.used.ausw){B.used.ausw=1;d=Math.ceil(d/2)}
 u.hp=Math.max(0,u.hp-d);sfx('au',.6);popFx(unitEl(u),'dmg pdmg',String(d),'Schaden');u.face=5;if(u.hp>0)poseFor(u,2,650);setTimeout(()=>{u.face=0;if(B)render()},700);blog(f.n+': '+an+' trifft '+u.n+', '+d+' Schaden.');
 if(u.hp<=0&&u.hero&&st.hero.skills.includes('eisernwille')&&!B.used.wille){B.used.wille=1;u.hp=1;blog('Eiserner Wille: '+u.n+' bleibt stehen.')}
 render();const e=$('#bt-party .bt-u[data-k="'+B.party.indexOf(u)+'"]');if(e){e.classList.add('hit');setTimeout(()=>e.classList.remove('hit'),400)}}
async function useSkill(u,s){const S=SK[s];if(S.once)B.used[u.id+s]=1;sfx('zauber',.7);poseFor(u,1,800);fx('magic',$('#bt-party .bt-u[data-k="'+B.party.indexOf(u)+'"]'),110);
 switch(s){
 case 'steinwall':case 'schildwall':{const a=await pickAlly();a.block=1;blog(u.n+' stellt sich vor '+a.n+'.');break}
 case 'glutfaust':{const f=await pickFoe();await attack(u,f,{el:'feuer',dmgAdd:1});break}
 case 'waermherz':B.party.forEach(p=>{if(p.hp>0)p.hp=Math.min(p.max,p.hp+4)});blog('Wärmendes Herz: alle plus 4.');break;
 case 'mutmach':B.party.forEach(p=>p.next=(p.next||0)+2);blog('Zirpia spielt das Mutmachlied. Alle plus 2.');break;
 case 'schlaflied':{const f=await pickFoe();await shoot(u,f,'noten',false);f.skip=1;blog(f.n+' gähnt und schläft ein.');break}
 case 'ballade':{const a=await pickAlly();a.ballad=1;blog('Heldenballade für '+a.n+'.');break}
 case 'taschendieb':{const f=await pickFoe();const g=3+rnd(6);addGold(g);f.minus=2;blog('Oma Hulda klaut '+g+' Gold und eine Zahnbürste. '+f.n+' ist verwirrt.');break}
 case 'stahlfalle':{const f=await pickFoe();await shoot(u,f,'blitz',false);f.skip=1;blog(f.n+' verheddert sich im Stahlgarn.');break}
 case 'plaetzchen':B.party.forEach(p=>{if(p.hp>0){p.hp=Math.min(p.max,p.hp+3);p.next=(p.next||0)+1}});blog('Plätzchenpause! Alle plus 3.');break;
 case 'schattensprung':{u.dodge=1;const f=await pickFoe();await attack(u,f,{add:1});break}
 case 'frostkralle':{const f=await pickFoe();await attack(u,f,{el:'eis',fixed:8});break}
 case 'neunleben':{const down=B.party.filter(p=>p.hp<=0);if(!down.length){blog('Niemand muss gerettet werden.');B.used[u.id+s]=0;return partyTurn(u)}const a=await pickAlly(true);a.hp=Math.ceil(a.max/2);blog(a.n+' ist wieder da.');break}
 case 'doppelschuss':{for(let i=0;i<2;i++){const f=await pickFoe();if(f)await attack(u,f,{})}break}
 case 'elementar':{const e=await pickElem();const f=await pickFoe();await attack(u,f,{el:e,dmgAdd:1});break}
 case 'kampfschrei':B.buff.all=1;blog('Kampfschrei! Alle plus 1.');break;
 case 'wirbelhieb':case 'pfeilregen':if(s==='pfeilregen')await shootAll(u,'pfeil');for(const f of B.foes.filter(f=>f.hp>0))hurtFoe(f,Math.max(1,Math.ceil((Math.ceil(d10()/2)+1)/2)),u);break;
 case 'schildstoss':{const f=await pickFoe();const r=await rollD20({title:'Schildstoß',sub:'Ziel 12',bonus:st.hero.str,ziel:12});if(r.total>=12){f.skip=1;blog(f.n+' taumelt.')}break}
 case 'beschuetzer':{const a=await pickAlly();a.block=1;break}
 case 'kraftschlag':{const f=await pickFoe();await attack(u,f,{double:1});u.pause=1;break}
 case 'heldenhieb':{const f=await pickFoe();poseFor(u,1,700);await sleep(250);hurtFoe(f,d10()+d10()+d10(),u);break}
 case 'giftpfeil':case 'giftklinge':{const f=await pickFoe();if(s==='giftpfeil')await shoot(u,f,'gift',false);f.poison=3;blog(f.n+' ist vergiftet.');break}
 case 'hoernchen':case 'schmutztrick':{const f=await pickFoe();f.minus=3;blog(f.n+' ist abgelenkt.');break}
 case 'tarnung':u.hidden=1;setTimeout(()=>u.hidden=0,0);blog(u.n+' verschwindet im Gebüsch.');u.dodge=1;break;
 case 'zielschuss':{const f=await pickFoe();await attack(u,f,{add:5});break}
 case 'meisterschuss':{const f=await pickFoe();await attack(u,f,{double:1,ignore:1});break}
 case 'schutzkreis':B.buff.circle=1;blog('Ein Schutzkreis leuchtet auf.');break;
 case 'funkenregen':await shootAll(u,'feuer');for(const f of B.foes.filter(f=>f.hp>0))hurtFoe(f,3,u);break;
 case 'spiegelbild':u.mirror=1;blog('Drei '+u.n+' stehen plötzlich da.');break;
 case 'elementwandel':{const f=await pickFoe();f.el=await pickElem();blog(f.n+' ist jetzt '+ELEM[f.el]+'.');break}
 case 'heilzauber':{const a=await pickAlly();a.hp=Math.min(a.max,a.hp+6);break}
 case 'kettenblitz':{const t2=B.foes.filter(f=>f.hp>0).slice(0,2);for(const f of t2)await shoot(u,f,'blitz',false)}B.foes.filter(f=>f.hp>0).slice(0,2).forEach(f=>hurtFoe(f,Math.max(1,Math.round((Math.ceil(d10()/2)+2)*elemMul('blitz',f.el))),u));break;
 case 'zeitstopp':blog('Die Zeit steht still. Noch eine Runde für euch.');for(const p of B.party)if(p.hp>0&&p!==u)await partyTurn(p);break;
 case 'sternenfeuer':{const f=await pickFoe();await shoot(u,f,'stern',false);hurtFoe(f,d10()+d10()+d10()+d10(),u);break}
 case 'rauchbombe':await shootAll(u,'bombe');B.buff.smoke=1;setTimeout(()=>{},0);blog('Puff! Alles voller Rauch.');break;
 case 'schattenpartner':{const f=await pickFoe();await attack(u,f,{double:B.party.some(p=>p.id==='na'&&p.hp>0)?1:0});break}
 case 'glueckspilz':{const f=await pickFoe();await attack(u,f,{crit:1});break}
 }
 render();await sleep(500)}
function pickElem(){return new Promise(r=>{const act=$('#bt-act');const row=el('div','bt-btns el-pick');act.appendChild(row);['feuer','natur','erde','blitz','eis'].forEach(e=>{const b=el('button','bt-b','<span class="el el-'+e+'"></span><b>'+ELEM[e]+'</b>');b.onclick=()=>{row.remove();r(e)};row.appendChild(b)})})}
async function useItemBattle(u,it){const I=ITEMS[it.id];const U=I.use;
 if(U.heal){const a=U.all?null:await pickAlly();(U.all?B.party.filter(p=>p.hp>0):[a]).forEach(p=>{p.hp=Math.min(p.max,p.hp+U.heal);fx('heal',$('#bt-party .bt-u[data-k="'+B.party.indexOf(p)+'"]'),110)});sfx('trank')}
 if(U.next)(U.all?B.party:[u]).forEach(p=>p.next=(p.next||0)+U.next);
 if(U.blind){const f=await pickFoe();f.minus=2}
 if(U.miss){const f=await pickFoe();f.skip=1;fx('smoke',$('#bt-foes .bt-f[data-i="'+f.i+'"]'))}
 dropItem(it.id,1);blog(u.n+' benutzt '+I.n+'.');render()}
async function fumble(){const F=FUMBLE[B.key]||'Du rutschst auf einem Käse aus. Natürlich. Es ist immer ein Käse.';blog('Patzer! '+F);sfx('patzer',.8);await sleep(1400)}
const FUMBLE={ratten:'Du rutschst auf einem Käse aus. Es ist immer ein Käse.',spinne:'Du klebst am Netz fest.',krok:'Die Krone fällt ins Wasser, alle schauen hinterher, auch du.',eis:'Du frierst kurz am Boden fest. Oma Hulda: Kindchen, Socken.',asche:'Du niest in die Asche. Gesundheit, Kindchen.'};
let effSaid={};
function superEff(u,f,e){if(!st.flags.tut_t11){st.flags.tut_t11=1;save();B._elT=1}if(effSaid[B.key])return;effSaid[B.key]=1;blog(ELEM[e||u.el||'feuer']+' gegen '+ELEM[f.el]+': super effektiv!',1)}
function critLine(){blog('Natürliche Zwanzig! Der Spielleiter muss sich kurz setzen.',1)}
async function phaseCheck(){const F=B&&B.F;if(!F||!F.phases)return;const f=B.foes.find(x=>x.boss);if(!f)return;
 while(B.phI<F.phases.length&&f.hp<=Math.ceil(F.phases[B.phI]*f.max)){const i=B.phI;const ov=$('#battle');ov.classList.remove('on');ov.style.visibility='hidden';
  if(window.PHASE_RUN)await window.PHASE_RUN(i);B.phI++;st.flags.dph=B.phI<F.phases.length?B.phI:0;save();ov.style.visibility='';ov.classList.add('on');music(A+'mus/boss.mp3',.5);
  const nt=F.phases[B.phI];f.hp=nt===undefined?0:Math.max(0,Math.min(f.hp,Math.ceil(F.phases[i]*f.max))-2);render();if(nt!==undefined)blog('Phase '+(B.phI+1)+' von '+F.phases.length+': '+PHASEN[B.phI][0],1)}}
async function win(){render();sfx('sieg');await sleep(900);$('#battle').classList.remove('on');B=null;effSaid={};return true}
async function lose(){blog('Die Gruppe ist am Boden.');sfx('niederlage');await sleep(1600);$('#battle').classList.remove('on');B=null;return false}
// Geführte Erklärung beim ersten Kampf: der Spielleiter zeigt auf jedes Element der Anzeige und spricht dazu
const TUT={
 t01:[null,'Jetzt wird gekämpft! Keine Sorge, ich erkläre dir alles in Ruhe. Ein Kampf läuft in Runden ab. In jeder Runde ist zuerst deine Gruppe dran, danach die Gegner.'],
 t02:['#bt-foes','Hier oben stehen deine Gegner. Der rote Balken unter jedem Gegner zeigt seine Lebenspunkte. Mit jedem Treffer wird er kürzer. Ist er leer, ist der Gegner besiegt.'],
 t03:['.bt-f .bt-int','Auf diesem Schild steht, was der Gegner als Nächstes vorhat. So weißt du schon vorher, was auf dich zukommt.'],
 t04:['.bt-f .el','Das kleine Zeichen neben dem Namen ist sein Element. Manche Elemente sind gegen andere besonders stark. Das erkläre ich dir, sobald es wichtig wird.'],
 t05:['#bt-party','Unten steht deine Gruppe. Der grüne Balken und die Zahlen zeigen eure Lebenspunkte: vorne, wie viele ihr gerade habt, hinten, wie viele ihr höchstens haben könnt. Wer auf null fällt, ist erst einmal außer Gefecht.'],
 t06:['#bt-r','Hier siehst du, in welcher Runde ihr gerade seid.'],
 t12:['#bt-help','Wenn du etwas vergessen hast, tippe einfach auf das Fragezeichen. Dann erkläre ich dir alles noch einmal.'],
 t07:['#bt-act','Jetzt bist du dran. Wer am Zug ist, leuchtet. Tippe hier auf deinen Angriff. Fähigkeiten und Gegenstände findest du gleich daneben. Danach tippst du auf den Gegner, den du treffen willst.'],
 t08:[null,'Jetzt entscheidet der Würfel. Das ist ein W20, ein Würfel mit zwanzig Seiten. Zu deinem Wurf kommt dein Angriffswert dazu. Ist das Ergebnis mindestens so hoch wie die Zielzahl des Gegners, triffst du. Wie viel Schaden ein Treffer macht, rechnet das Spiel für dich aus.'],
 t09:[null,'Zwei Zahlen sind besonders. Eine Zwanzig ist ein kritischer Treffer und macht doppelten Schaden. Eine Eins ist ein Patzer, dann geht leider etwas schief.'],
 t10:['#bt-party','Jetzt waren die Gegner dran. Ihre Treffer ziehen euch Lebenspunkte ab. Gewonnen habt ihr, wenn alle Gegner besiegt sind. Und keine Angst: Verliert ihr, dürft ihr den Kampf einfach noch einmal versuchen.'],
 t11:[null,'Super effektiv! Jedes Element ist gegen ein anderes besonders stark. Feuer schlägt Natur, Natur schlägt Erde, Erde schlägt Blitz, Blitz schlägt Eis, und Eis schlägt Feuer. Trifft das starke Element, gibt es doppelten Schaden. Andersherum gibt es nur halben Schaden.']};
// Elementkreis als Grafik: jedes Element schlägt das nächste im Uhrzeigersinn
function elKreis(){const O=['feuer','natur','erde','blitz','eis'],R=92,C=120;const pt=i=>{const a=-Math.PI/2+i*2*Math.PI/5;return[C+R*Math.cos(a),C+R*Math.sin(a)]};
 let arr='';for(let i=0;i<5;i++){const a0=-Math.PI/2+i*2*Math.PI/5+.36,a1=-Math.PI/2+(i+1)*2*Math.PI/5-.36;const x0=C+R*Math.cos(a0),y0=C+R*Math.sin(a0),x1=C+R*Math.cos(a1),y1=C+R*Math.sin(a1);arr+='<path d="M'+x0.toFixed(1)+' '+y0.toFixed(1)+' A'+R+' '+R+' 0 0 1 '+x1.toFixed(1)+' '+y1.toFixed(1)+'" marker-end="url(#ekp)"/>'}
 const ic=O.map((e,i)=>{const[x,y]=pt(i);return '<div class="ek-i" style="left:'+(x/2.4)+'%;top:'+(y/2.4)+'%"><span class="el el-'+e+'"></span><b>'+ELEM[e]+'</b></div>'}).join('');
 return '<div class="ek"><svg viewBox="0 0 240 240"><defs><marker id="ekp" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#b8741a"/></marker></defs><g fill="none" stroke="#b8741a" stroke-width="5" stroke-linecap="round">'+arr+'</g></svg>'+ic+'<div class="ek-m">schlägt</div></div>'}
function ekShow(){const ov=$('#battle');if(!ov||ov.querySelector('.ek-big'))return;const c=el('div','ek-big','<div class="bt-ekbox">'+elKreis()+'</div><p>Jedes Element schlägt das nächste in Pfeilrichtung: doppelter Schaden. Andersherum gibt es nur halben Schaden.</p><button class="pbtn">Schließen</button>');ov.appendChild(c);c.onclick=e=>{if(e.target.closest('.ek'))return;sfx('ui_klick',.5);c.remove()}}
async function coach(id){const T0=TUT[id];if(!T0||!$('#battle'))return;const [sel,txt]=T0;const ov=$('#battle');
 const c=el('div','bt-coach');const tg=sel?ov.querySelector(sel):null;let top=false;
 if(tg){const r=tg.getBoundingClientRect(),o=ov.getBoundingClientRect();const pad=6;const sp=el('div','bt-spot');sp.style.cssText='left:'+(r.left-o.left-pad)+'px;top:'+(r.top-o.top-pad)+'px;width:'+(r.width+pad*2)+'px;height:'+(r.height+pad*2)+'px';c.appendChild(sp);top=(r.top+r.height/2-o.top)>o.height/2}else c.classList.add('dim');
 const bx=el('div','bt-cb'+(top?' top':''),'<div class="bt-cf" style="background-image:url('+A+'img/p_sl.jpg)"></div><div class="bt-ct"><b>Der Spielleiter</b><p>'+esc(txt)+'</p><button class="pbtn">Weiter</button></div>');if(id==='t11'){c.classList.add('ekc');c.insertAdjacentHTML('beforeend','<div class="bt-ekbox">'+elKreis()+'</div>')}c.appendChild(bx);ov.appendChild(c);
 const a=playVo(A+'vo/tut_'+id+'.mp3',on=>bx.classList.toggle('talk',on));
 await new Promise(r=>bx.querySelector('button').onclick=()=>{sfx('ui_klick',.5);r()});if(a)stopVo();c.remove()}
async function tutorial(){st.flags.tut_done=1;save();for(const k of ['t01','t02','t03','t04','t05','t06','t12'])await coach(k)}
async function tutHelp(){if(!B||B._help)return;B._help=1;for(const k of ['t01','t02','t03','t04','t05','t07','t08','t09','t10','t11'])await coach(k);B._help=0}
async function tutOnce(k){if(!B||!B.tut)return;const f='tut_'+k;if(st.flags[f])return;st.flags[f]=1;save();await coach(k)}
