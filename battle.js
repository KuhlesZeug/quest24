// Rundenkampf: Elemente im Kreis, Gegner zeigen ihre Absicht, Niederlage heißt neu antreten
const ELEM={feuer:'Feuer',natur:'Natur',erde:'Erde',blitz:'Blitz',eis:'Eis',schatten:'Schatten'};
// Feuer schlägt Natur, Natur schlägt Erde, Erde schlägt Blitz, Blitz schlägt Eis, Eis schlägt Feuer
const BEATS={feuer:'natur',natur:'erde',erde:'blitz',blitz:'eis',eis:'feuer'};
function elemMul(a,d){if(!a||!d)return 1;if(BEATS[a]===d)return 2;if(BEATS[d]===a)return .5;return 1}

// Gefährten mit ihren Grundwerten
const COMP={
 gr:{n:'Grumbold',img:'k_gr',el:'erde',hp:24,atk:3,dmg:2,hit:'Steinfaust',skills:{steinwall:1}},
 zi:{n:'Zirpia',img:'k_zi',el:'natur',hp:11,atk:3,dmg:1,hit:'Geigenbogen',skills:{mutmach:1}},
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
 ratten:{t:'Riesenratten im Keller',bg:'ort03',mus:'kampf',foes:[{n:'Riesenratte',img:'g_ratte',hp:4,el:'natur',def:8,acts:[{n:'Knabbern',min:1,max:2}]},{n:'Riesenratte',img:'g_ratte',hp:4,el:'natur',def:8,acts:[{n:'Knabbern',min:1,max:2}]},{n:'Riesenratte',img:'g_ratte',hp:4,el:'natur',def:8,acts:[{n:'Knabbern',min:1,max:2}]}],tut:1},
 motten:{t:'Aschenmotten',bg:'ort05',mus:'kampf',foes:[{n:'Aschenmotte',img:'g_motte',hp:7,el:'feuer',def:9,acts:[{n:'Flügelschlag',min:2,max:3},{n:'Licht fressen',fear:1}]},{n:'Aschenmotte',img:'g_motte',hp:7,el:'feuer',def:9,acts:[{n:'Flügelschlag',min:2,max:3},{n:'Licht fressen',fear:1}]}]},
 spinne:{t:'Die Spinnenkönigin',bg:'ort09',mus:'boss',foes:[{n:'Spinnenkönigin',img:'g_spinne',hp:24,el:'natur',def:11,boss:1,acts:[{n:'Giftbiss',min:3,max:4},{n:'Netzwurf',web:1}]},{n:'Spinnling',img:'g_spinnling',hp:5,el:'natur',def:9,acts:[{n:'Zwicken',min:1,max:2}]},{n:'Spinnling',img:'g_spinnling',hp:5,el:'natur',def:9,acts:[{n:'Zwicken',min:1,max:2}]}]},
 krok:{t:'Der Krokodilkönig',bg:'ort13',mus:'boss',foes:[{n:'Krokodilkönig',img:'g_krok',hp:30,el:'erde',def:12,boss:1,acts:[{n:'Schnappen',min:4,max:5},{n:'Schlammrolle',all:2,warn:1}]}]},
 eis:{t:'Der Eiswächter',bg:'ort19',mus:'boss',foes:[{n:'Eiswächter',img:'g_eis',hp:36,el:'eis',def:13,boss:1,acts:[{n:'Eiszapfen',min:5,max:5},{n:'Frosthauch',all:2,warn:1,cold:1}]}]},
 asche:{t:'Die Aschenwächter',bg:'ort21',mus:'boss',foes:[{n:'Aschenwächter',img:'g_asche',hp:22,el:'feuer',def:13,acts:[{n:'Aschenschlag',min:4,max:4},{n:'Aschewolke',blind:2,warn:1}]},{n:'Aschenwächter',img:'g_asche',hp:22,el:'feuer',def:13,acts:[{n:'Aschenschlag',min:4,max:4},{n:'Aschewolke',blind:2,warn:1}]}]}
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
 st.party.forEach(id=>{const C=COMP[id];const ex=(st.flags['sk_'+id]||[]);u.push({id,n:C.n,img:C.img,el:C.el,hp:C.hp,max:C.hp,atk:C.atk,dmg:C.dmg,hit:C.hit,skills:[...Object.keys(C.skills),...ex]})});return u}

let B=null;
async function fight(key){const F=FOES[key];let tries=0;
 while(true){const r=await battle(F,key,tries);if(r)return true;tries++;
  const again=await choice([{t:'Noch einmal antreten'+(tries>=1?' (mit Tipp)':'')}]);}}

async function battle(F,key,tries){const ov=$('#battle');ov.innerHTML='';ov.classList.add('on');music(A+'mus/'+(F.mus||'kampf')+'.mp3',.5);
 B={F,key,round:0,foes:F.foes.map((f,i)=>({...f,i,max:f.hp,skip:0,minus:0,poison:0,intent:null})),party:partyUnits(),used:{},buff:{},first:true,log:[]};
 if(st.hero.skills.includes('waldsegen'))B.party.forEach(p=>p.hp=Math.min(p.max,p.hp+3));
 ov.innerHTML='<div class="bt-bg" style="background-image:url('+A+'img/'+F.bg+'.jpg)"></div><div class="bt-top"><div class="bt-t">'+esc(F.t)+'</div><div class="bt-r" id="bt-r"></div></div><div class="bt-foes" id="bt-foes"></div><div class="bt-log" id="bt-log"></div><div class="bt-party" id="bt-party"></div><div class="bt-act" id="bt-act"></div>';
 sfx('schwert_ziehen');if(tries&&TIPS[key])blog('Tipp: '+TIPS[key],1);
 if(F.tut&&!st.flags.tut_done)await tutorial();
 while(true){B.round++;$('#bt-r').textContent='Runde '+B.round;planFoes();render();
  for(const u of B.party){if(u.hp<=0)continue;if(u.web){u.web=0;blog(u.n+' hängt im Netz fest und setzt aus.');render();await sleep(900);continue}
   if(u.pause){u.pause=0;blog(u.n+' holt Luft.');continue}
   await partyTurn(u);render();if(B.foes.every(f=>f.hp<=0))return win();}
  for(const f of B.foes){if(f.hp<=0)continue;if(f.poison>0){f.poison--;hurtFoe(f,2,null,'Gift');if(f.hp<=0)continue}
   if(f.skip){f.skip--;blog(f.n+' setzt aus.');render();await sleep(700);continue}
   await foeTurn(f);render();if(B.party[0].hp<=0&&B.party.every(p=>p.hp<=0))return lose();if(B.party.every(p=>p.hp<=0))return lose()}
  if(B.party[0].hp<=0&&!B.party.slice(1).some(p=>p.hp>0))return lose();
  if(B.foes.every(f=>f.hp<=0))return win();
  B.buff.all=0;B.buff.shield=0;B.party.forEach(p=>{p.blind=Math.max(0,(p.blind||0)-1)})}
}
const TIPS={ratten:'Ratten haben wenig Lebenspunkte. Ein Treffer reicht oft.',motten:'Grumbolds Steinwall blockt einen ganzen Angriff. Setz ihn auf die Figur mit den wenigsten Lebenspunkten.',spinne:'Feuer schlägt Natur. Grumbolds Glutfaust macht doppelten Schaden.',krok:'Natur schlägt Erde. Zirpia trifft doppelt, ihr Schlaflied lässt ihn aussetzen.',eis:'Blitz schlägt Eis. Oma Hulda macht doppelten Schaden.',asche:'Eis schlägt Feuer. Nachtigall macht doppelten Schaden.'};
function blog(t,tip){const l=$('#bt-log');if(!l)return;const p=el('div',tip?'tip':'',esc(t));l.prepend(p);while(l.children.length>3)l.lastChild.remove()}
function planFoes(){B.foes.forEach(f=>{if(f.hp<=0)return;if(f.warned){f.intent=f.warned;f.warned=null;return}
 const a=f.acts[(B.round+f.i)%f.acts.length];if(a.warn&&!f.intent?.warn){f.intent={n:'holt aus',pre:a};f.warned=a;return}f.intent=a})}
function render(){const fo=$('#bt-foes');fo.innerHTML='';B.foes.forEach(f=>{const d=el('div','bt-f'+(f.hp<=0?' down':'')+(f.boss?' boss':''),'<div class="bt-fi" style="background-image:url('+A+'img/'+f.img+'_'+(f.hp<=0?3:(f.fr||0))+'.png)"></div><div class="bt-hp"><i style="width:'+Math.max(0,f.hp/f.max*100)+'%"></i></div><div class="bt-fn">'+esc(f.n)+' <span class="el el-'+f.el+'"></span></div>'+(f.hp>0&&f.intent?'<div class="bt-int">'+esc(f.intent.pre?f.intent.pre.n+' kommt':f.intent.n)+'</div>':''));d.dataset.i=f.i;fo.appendChild(d)});
 const pa=$('#bt-party');pa.innerHTML='';B.party.forEach((u,k)=>{const d=el('div','bt-u'+(u.hp<=0?' down':'')+(B.cur===u?' cur':''),'<div class="bt-ui" style="background-image:url('+(u.hero?heroImg():A+'img/p_'+u.id+'_'+(u.hp<=0?8:(u.face??0))+'.jpg')+')"></div><div class="bt-hp p"><i style="width:'+Math.max(0,u.hp/u.max*100)+'%"></i></div><div class="bt-un">'+u.hp+'/'+u.max+'</div>');d.dataset.k=k;pa.appendChild(d)})}
function pick(sel,filter){return new Promise(r=>{const els=$$(sel);els.forEach(e=>{const ok=filter(e);e.classList.toggle('pickable',ok);if(ok)e.onclick=()=>{els.forEach(x=>{x.classList.remove('pickable');x.onclick=null});r(e)}})})}
async function partyTurn(u){B.cur=u;render();const act=$('#bt-act');
 const opts=[{k:'atk',t:u.hit}];u.skills.forEach(s=>{const S=SK[s];if(!S||S.passive)return;if(S.once&&B.used[u.id+s])return;opts.push({k:'sk',s,t:S.n,d:S.d})});
 const pots=st.inv.filter(x=>ITEMS[x.id]&&ITEMS[x.id].use);if(pots.length)opts.push({k:'item',t:'Gegenstand'});
 act.innerHTML='<div class="bt-who">'+esc(u.n)+' ist dran</div>';const row=el('div','bt-btns');act.appendChild(row);
 const ch=await new Promise(r=>opts.forEach(o=>{const b=el('button','bt-b'+(o.k==='sk'?' sk':''),'<b>'+esc(o.t)+'</b>'+(o.d?'<span>'+esc(o.d)+'</span>':''));b.onclick=()=>{sfx('ui_klick',.6);r(o)};row.appendChild(b)}));
 act.innerHTML='<div class="bt-who">'+esc(ch.k==='atk'?'Wähle ein Ziel':ch.t)+'</div>';
 if(ch.k==='atk'){const f=await pickFoe();await attack(u,f,{});}
 else if(ch.k==='item'){await useItemBattle(u)}
 else await useSkill(u,ch.s);
 act.innerHTML='';B.cur=null}
async function pickFoe(){const alive=B.foes.filter(f=>f.hp>0);if(alive.length===1)return alive[0];const e=await pick('#bt-foes .bt-f',e=>B.foes[+e.dataset.i].hp>0);return B.foes[+e.dataset.i]}
async function pickAlly(down){const e=await pick('#bt-party .bt-u',e=>down?B.party[+e.dataset.k].hp<=0:B.party[+e.dataset.k].hp>0);return B.party[+e.dataset.k]}
async function attack(u,f,o){let bonus=u.atk+(B.buff.all||0)+(u.next||0)+(o.add||0)-(u.blind?2:0);u.next=0;
 let v;if(u.hero){const r=await rollD20({title:u.hit+' gegen '+f.n,sub:'W20 plus '+bonus+', Ziel '+f.def,bonus,ziel:f.def,force:o.crit?20:null});v=r}else{const x=rnd(20);v={v:x,total:x+bonus,crit:x===20,fumble:x===1}}
 if(v.fumble&&u.hero){await fumble();return}
 if(v.total<f.def&&!v.crit){blog(u.n+' verfehlt.');sfx('falsch',.5);await sleep(500);return}
 let dmg=o.fixed||(Math.ceil(d10()/2)+u.dmg+(o.dmgAdd||0));const el_=o.el||u.el;let m=o.ignore?Math.max(1,elemMul(el_,f.el)):elemMul(el_,f.el);
 if(v.crit)dmg*=2;if(u.hero&&B.first&&st.hero.cls==='schurke'){dmg*=2;B.first=false}if(u.ballad){dmg*=2;u.ballad=0}if(o.double)dmg*=2;
 dmg=Math.max(1,Math.round(dmg*m));u.face=m>1||v.crit?3:6;setTimeout(()=>{u.face=0;if(B)render()},800);hurtFoe(f,dmg,u,null,m);if(m>1)superEff(u,f);if(v.crit&&u.hero)critLine();await sleep(650)}
function hurtFoe(f,d,u,why,m){f.hp=Math.max(0,f.hp-d);sfx('treffer',.8);blog((u?u.n:why)+' trifft '+f.n+': '+d+' Schaden'+(m>1?', super effektiv':m<1?', nicht sehr wirksam':''));render();
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
 u.hp=Math.max(0,u.hp-d);sfx('au',.6);u.face=5;setTimeout(()=>{u.face=0;if(B)render()},700);blog(f.n+': '+an+' trifft '+u.n+', '+d+' Schaden.');
 if(u.hp<=0&&u.hero&&st.hero.skills.includes('eisernwille')&&!B.used.wille){B.used.wille=1;u.hp=1;blog('Eiserner Wille: '+u.n+' bleibt stehen.')}
 render();const e=$('#bt-party .bt-u[data-k="'+B.party.indexOf(u)+'"]');if(e){e.classList.add('hit');setTimeout(()=>e.classList.remove('hit'),400)}}
async function useSkill(u,s){const S=SK[s];if(S.once)B.used[u.id+s]=1;sfx('zauber',.7);fx('magic',$('#bt-party .bt-u[data-k="'+B.party.indexOf(u)+'"]'),110);
 switch(s){
 case 'steinwall':case 'schildwall':{const a=await pickAlly();a.block=1;blog(u.n+' stellt sich vor '+a.n+'.');break}
 case 'glutfaust':{const f=await pickFoe();await attack(u,f,{el:'feuer',dmgAdd:1});break}
 case 'waermherz':B.party.forEach(p=>{if(p.hp>0)p.hp=Math.min(p.max,p.hp+4)});blog('Wärmendes Herz: alle plus 4.');break;
 case 'mutmach':B.party.forEach(p=>p.next=(p.next||0)+2);blog('Zirpia spielt das Mutmachlied. Alle plus 2.');break;
 case 'schlaflied':{const f=await pickFoe();f.skip=1;blog(f.n+' gähnt und schläft ein.');break}
 case 'ballade':{const a=await pickAlly();a.ballad=1;blog('Heldenballade für '+a.n+'.');break}
 case 'taschendieb':{const f=await pickFoe();const g=3+rnd(6);addGold(g);f.minus=2;blog('Oma Hulda klaut '+g+' Gold und eine Zahnbürste. '+f.n+' ist verwirrt.');break}
 case 'stahlfalle':{const f=await pickFoe();f.skip=1;blog(f.n+' verheddert sich im Stahlgarn.');break}
 case 'plaetzchen':B.party.forEach(p=>{if(p.hp>0){p.hp=Math.min(p.max,p.hp+3);p.next=(p.next||0)+1}});blog('Plätzchenpause! Alle plus 3.');break;
 case 'schattensprung':{u.dodge=1;const f=await pickFoe();await attack(u,f,{add:1});break}
 case 'frostkralle':{const f=await pickFoe();await attack(u,f,{el:'eis',fixed:8});break}
 case 'neunleben':{const down=B.party.filter(p=>p.hp<=0);if(!down.length){blog('Niemand muss gerettet werden.');B.used[u.id+s]=0;return partyTurn(u)}const a=await pickAlly(true);a.hp=Math.ceil(a.max/2);blog(a.n+' ist wieder da.');break}
 case 'doppelschuss':{for(let i=0;i<2;i++){const f=await pickFoe();if(f)await attack(u,f,{})}break}
 case 'elementar':{const e=await pickElem();const f=await pickFoe();await attack(u,f,{el:e,dmgAdd:1});break}
 case 'kampfschrei':B.buff.all=1;blog('Kampfschrei! Alle plus 1.');break;
 case 'wirbelhieb':case 'pfeilregen':for(const f of B.foes.filter(f=>f.hp>0))hurtFoe(f,Math.max(1,Math.ceil((Math.ceil(d10()/2)+1)/2)),u);break;
 case 'schildstoss':{const f=await pickFoe();const r=await rollD20({title:'Schildstoß',sub:'Ziel 12',bonus:st.hero.str,ziel:12});if(r.total>=12){f.skip=1;blog(f.n+' taumelt.')}break}
 case 'beschuetzer':{const a=await pickAlly();a.block=1;break}
 case 'kraftschlag':{const f=await pickFoe();await attack(u,f,{double:1});u.pause=1;break}
 case 'heldenhieb':{const f=await pickFoe();hurtFoe(f,d10()+d10()+d10(),u);break}
 case 'giftpfeil':case 'giftklinge':{const f=await pickFoe();f.poison=3;blog(f.n+' ist vergiftet.');break}
 case 'hoernchen':case 'schmutztrick':{const f=await pickFoe();f.minus=3;blog(f.n+' ist abgelenkt.');break}
 case 'tarnung':u.hidden=1;setTimeout(()=>u.hidden=0,0);blog(u.n+' verschwindet im Gebüsch.');u.dodge=1;break;
 case 'zielschuss':{const f=await pickFoe();await attack(u,f,{add:5});break}
 case 'meisterschuss':{const f=await pickFoe();await attack(u,f,{double:1,ignore:1});break}
 case 'schutzkreis':B.buff.circle=1;blog('Ein Schutzkreis leuchtet auf.');break;
 case 'funkenregen':for(const f of B.foes.filter(f=>f.hp>0))hurtFoe(f,3,u);break;
 case 'spiegelbild':u.mirror=1;blog('Drei '+u.n+' stehen plötzlich da.');break;
 case 'elementwandel':{const f=await pickFoe();f.el=await pickElem();blog(f.n+' ist jetzt '+ELEM[f.el]+'.');break}
 case 'heilzauber':{const a=await pickAlly();a.hp=Math.min(a.max,a.hp+6);break}
 case 'kettenblitz':B.foes.filter(f=>f.hp>0).slice(0,2).forEach(f=>hurtFoe(f,Math.max(1,Math.round((Math.ceil(d10()/2)+2)*elemMul('blitz',f.el))),u));break;
 case 'zeitstopp':blog('Die Zeit steht still. Noch eine Runde für euch.');for(const p of B.party)if(p.hp>0&&p!==u)await partyTurn(p);break;
 case 'sternenfeuer':{const f=await pickFoe();hurtFoe(f,d10()+d10()+d10()+d10(),u);break}
 case 'rauchbombe':B.buff.smoke=1;setTimeout(()=>{},0);blog('Puff! Alles voller Rauch.');break;
 case 'schattenpartner':{const f=await pickFoe();await attack(u,f,{double:B.party.some(p=>p.id==='na'&&p.hp>0)?1:0});break}
 case 'glueckspilz':{const f=await pickFoe();await attack(u,f,{crit:1});break}
 }
 render();await sleep(500)}
function pickElem(){return new Promise(r=>{const act=$('#bt-act');const row=el('div','bt-btns el-pick');act.appendChild(row);['feuer','natur','erde','blitz','eis'].forEach(e=>{const b=el('button','bt-b','<span class="el el-'+e+'"></span><b>'+ELEM[e]+'</b>');b.onclick=()=>{row.remove();r(e)};row.appendChild(b)})})}
async function useItemBattle(u){const pots=st.inv.filter(x=>ITEMS[x.id]&&ITEMS[x.id].use);const act=$('#bt-act');const row=el('div','bt-btns its');act.appendChild(row);
 const it=await new Promise(r=>pots.forEach(x=>{const I=ITEMS[x.id];const b=el('button','bt-b it','<img src="'+A+'items/'+x.id+'.png" alt=""><b>'+esc(I.n)+'</b><span>'+esc(I.d)+'</span>');b.onclick=()=>r(x);row.appendChild(b)}));
 row.remove();const I=ITEMS[it.id];const U=I.use;
 if(U.heal){const a=U.all?null:await pickAlly();(U.all?B.party.filter(p=>p.hp>0):[a]).forEach(p=>{p.hp=Math.min(p.max,p.hp+U.heal);fx('heal',$('#bt-party .bt-u[data-k="'+B.party.indexOf(p)+'"]'),110)});sfx('trank')}
 if(U.next)(U.all?B.party:[u]).forEach(p=>p.next=(p.next||0)+U.next);
 if(U.blind){const f=await pickFoe();f.minus=2}
 if(U.miss){const f=await pickFoe();f.skip=1;fx('smoke',$('#bt-foes .bt-f[data-i="'+f.i+'"]'))}
 dropItem(it.id,1);blog(u.n+' benutzt '+I.n+'.');render()}
async function fumble(){const F=FUMBLE[B.key]||'Du rutschst auf einem Käse aus. Natürlich. Es ist immer ein Käse.';blog('Patzer! '+F);sfx('patzer',.8);await sleep(1400)}
const FUMBLE={ratten:'Du rutschst auf einem Käse aus. Es ist immer ein Käse.',spinne:'Du klebst am Netz fest.',krok:'Die Krone fällt ins Wasser, alle schauen hinterher, auch du.',eis:'Du frierst kurz am Boden fest. Oma Hulda: Kindchen, Socken.',asche:'Du niest in die Asche. Gesundheit, Kindchen.'};
let effSaid={};
function superEff(u,f){if(effSaid[B.key])return;effSaid[B.key]=1;blog(ELEM[u.el||'feuer']+' gegen '+ELEM[f.el]+': super effektiv!',1)}
function critLine(){blog('Natürliche Zwanzig! Der Spielleiter muss sich kurz setzen.',1)}
async function win(){render();sfx('sieg');await sleep(900);$('#battle').classList.remove('on');B=null;effSaid={};return true}
async function lose(){blog('Die Gruppe ist am Boden.');sfx('niederlage');await sleep(1600);$('#battle').classList.remove('on');B=null;return false}
async function tutorial(){st.flags.tut_done=1;save();const t=el('div','bt-tut','<h3>So funktioniert der Kampf</h3><p>Du bist dran: Tippe auf einen Angriff und dann auf einen Gegner.</p><p>Du würfelst mit dem W20 und zählst deinen Wert dazu. Erreichst du das Ziel, triffst du. Der Schaden wird mit dem W10 bestimmt.</p><p>Über jedem Gegner steht, was er als Nächstes vorhat. Eine 20 ist ein kritischer Treffer, eine 1 ein Patzer.</p><button class="pbtn">Verstanden</button>');$('#battle').appendChild(t);await new Promise(r=>t.querySelector('button').onclick=r);t.remove()}
