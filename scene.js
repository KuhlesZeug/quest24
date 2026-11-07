// Szenen: Hintergrund, Sprecher, Text, Stimme, Entscheidungen
const WHO={
 SL:{n:'Der Spielleiter',p:'p_sl'},
 WG:{n:'Meisterin Wendelgard',p:'p_wg'},
 GR:{n:'Grumbold',p:'p_gr'},
 ZI:{n:'Zirpia',p:'p_zi'},
 HU:{n:'Oma Hulda',p:'p_hu'},
 NA:{n:'Nachtigall',p:'p_na'},
 VH:{n:'Vharkon',p:'p_vh'},
 ALT:{n:'Dorfältester Aldric',p:'p_alt'},
 WIRT:{n:'Wirt Bertram',p:'p_wirt'},
 KAP:{n:'Kapuzengestalt',p:'p_kap'},
 HEX:{n:'Hexe Holunda',p:'p_hex'},
 KROK:{n:'Der Krokodilkönig',p:'p_krok'},
 KNO:{n:'Bandit Knorz',p:'p_kno'},
 BOB:{n:'Bob',p:'p_bob'},
 EIS:{n:'Der Eiswächter',p:'p_eis'},
 SPK:{n:'Spinnenkönigin',p:'p_spk'},
 KRU:{n:'Kapuzengestalt',p:'p_kap'},
 SCHL:{n:'Linkes Schild',p:'p_schild_l'},
 SCHM:{n:'Mittleres Schild',p:'p_schild_m'},
 SCHR:{n:'Rechtes Schild',p:'p_schild_r'},
 HELD:{n:'',p:''}
};
const EMO={neutral:0,talk:1,smile:2,laugh:3,shock:4,worried:5,angry:6,sly:7,sad:8};
const HASFACE=new Set(['p_sl','p_wg','p_gr','p_zi','p_hu','p_na','p_vh','p_alt','p_wirt','p_kap','p_hex','p_krok','p_kno','p_bob','p_eis','p_spk']);
const portrait=(k,e)=>{if(k==='HELD')return heroImg();const w=WHO[k];if(!w||!w.p)return '';return HASFACE.has(w.p)&&e!=null?A+'img/'+w.p+'_'+e+'.jpg':A+'img/'+w.p+'.jpg'};
// Gefühl einer Zeile: angegeben (e) oder aus dem Text geschätzt
function guessEmo(k,t,e){if(typeof e==='number')return e;if(e)return EMO[e]??0;if(k==='VH')return 0;if(/[Ee]ntschuldigung|Angst|Oh nein|zittert|k k kalt|schwer\b|traurig/.test(t))return EMO.worried;if(/^(Oh|Was|Moment|Halt)\b/.test(t)&&/[!.?]/.test(t))return EMO.shock;if(/!/.test(t))return EMO.smile;return EMO.neutral}
// Sprechen: Mund auf und zu, Gefühl bleibt
let faceTimer=null;
function animFace(k,emo,on){clearInterval(faceTimer);const f=$('#sc-box .sb-face');if(!f)return;const w=WHO[k];if(!w||!HASFACE.has(w.p)){f.classList.toggle('talking',on);return}
 const pair=emo===EMO.neutral?[0,1]:emo===EMO.smile?[2,3]:[emo,1];let i=0;f.style.backgroundImage='url('+portrait(k,emo)+')';f.classList.toggle('talking',on);
 if(!on)return;faceTimer=setInterval(()=>{i++;const fr=(emo===EMO.neutral||emo===EMO.smile)?pair[i%2]:(i%5===2?1:emo);f.style.backgroundImage='url('+portrait(k,fr)+')'},170)}

const SC={id:'',n:0,skip:false,tap:null};
function scBox(){return $('#sc-box')}
const BGOK={};
function setBg(src,fast){if(BGOK[src]===false)return;if(!BGOK[src]){const im=new Image();im.onload=()=>{BGOK[src]=true;setBg(src,fast)};im.onerror=()=>{BGOK[src]=false;if(fast&&typeof fast==='string')setBg(fast)};im.src=src;BGOK[src]=0;return}
 const a=$('#sc-bg');const cur=a.querySelector('.on');if(cur&&cur.dataset.src===src)return;
 const i=el('div','bgi');i.dataset.src=src;i.style.backgroundImage='url('+src+')';a.appendChild(i);requestAnimationFrame(()=>requestAnimationFrame(()=>i.classList.add('on')));
 if(cur){cur.classList.remove('on');setTimeout(()=>cur.remove(),fast?300:1300)}}
function waitTap(){return new Promise(r=>{SC.tap=()=>{SC.tap=null;r()}})}
$('#s-scene').addEventListener('click',e=>{if(e.target.closest('button,input,.sc-choices,.ovl'))return;if(SC.tap)SC.tap()});

async function say(k,text,vo,e){const b=scBox(),w=WHO[k]||WHO.SL;const name=k==='HELD'?heroName():w.n;const emo=guessEmo(k,text,e);

 b.classList.add('on');b.classList.toggle('noface',!portrait(k));
 b.querySelector('.sb-face').style.backgroundImage=portrait(k)?'url('+portrait(k,emo)+')':'none';b.querySelector('.sb-face').classList.remove('pop');void b.offsetWidth;b.querySelector('.sb-face').classList.add('pop');
 b.querySelector('.sb-name').textContent=name;const tx=b.querySelector('.sb-text');tx.innerHTML='';b.classList.remove('done');
 const full=T(text);const a=vo?playVo(vo,on=>animFace(k,emo,on)):null;if(!a)animFace(k,emo,true);
 // Schreiben wie mit der Feder
 let typing=true;const words=full.split(/(\s+)/);SC.tap=()=>{typing=false};
 for(const wd of words){if(!typing)break;tx.innerHTML+=wd;await sleep(wd.trim()?28+wd.length*9:0)}
 tx.innerHTML=full;b.classList.add('done');if(!a)setTimeout(()=>animFace(k,emo,false),300);
 if(st.auto&&a){const ok=await Promise.race([voDone(a),waitTap().then(()=>'tap')]);if(ok==='tap'){stopVo();return}if(ok){await Promise.race([sleep(650),waitTap()]);SC.tap=null;return}}
 await waitTap();stopVo()}

function hideBox(){scBox().classList.remove('on')}

async function choice(opts){hideBox();const c=$('#sc-choices');c.innerHTML='';c.classList.add('on');
 return new Promise(r=>{opts.forEach((o,i)=>{if(o.need&&!o.need())return;const b=el('button','ch-btn',T(o.t));b.onclick=()=>{sfx('ui_klick',.7);c.classList.remove('on');c.innerHTML='';r(i)};c.appendChild(b)})})}

// Einzelne Schritte ausführen
async function run(steps,ctx){ctx=ctx||{};for(let i=0;i<steps.length;i++){const s=steps[i];if(SC.abort)return;if(SC.wgPrev&&s.s!=='WG'&&!s.note){if(s.bg){SC.wgPrev=null;$('#s-scene').classList.remove('real')}else wgBack()}SC.nextBg=!!(steps[i+1]&&steps[i+1].bg)||(i===steps.length-1);await step(s,ctx)}}
// Meisterin Wendelgard: Schnitt aus der Geschichte an den echten Spieltisch
const WGC=['wgc1','wgc2','wgc3','wgc4','wgc5','wgc6','wgc7','wgc8','wgc9','wgc10'];let wgI=0;
function wgCut(img){const cur=$('#sc-bg .on');if(!SC.wgPrev)SC.wgPrev=cur?cur.dataset.src:null;img=img||WGC[(wgI++)%WGC.length];sfx('pergament',.5);setBg(A+'img/'+img+'.jpg',true);$('#s-scene').classList.add('real')}
function wgBack(){const p=SC.wgPrev;SC.wgPrev=null;$('#s-scene').classList.remove('real');if(p)setBg(p,true)}
async function step(s,ctx){
 if(s.bg){const src=A+'img/'+s.bg+'.jpg',cur=$('#sc-bg .on');const neu=!cur||cur.dataset.src!==src;setBg(src,s.alt?A+'img/'+s.alt+'.jpg':undefined);
  // neues Bild erst einmal in Ruhe zeigen, bevor Text darüber kommt
  if(neu&&s.look!==0){hideBox();await Promise.race([sleep(s.look||2200),waitTap()]);SC.tap=null}}
 if(s.fig!==undefined){let f=$('#sc-fig');if(!f){f=el('div','sc-fig');f.id='sc-fig';$('#s-scene').insertBefore(f,$('#sc-box'))}f.classList.toggle('on',!!s.fig);if(s.fig)f.style.backgroundImage='url('+A+'img/'+s.fig+'.png)'}
 if(s.mus!==undefined)music(s.mus?A+'mus/'+s.mus+'.mp3':null,s.mv??.45);
 if(s.atmo!==undefined){atmo(s.atmo?A+'atmo/'+s.atmo+'.mp3':null,s.av??.6);accents(s.acc,s.every)}
 if(s.sfx)sfx(s.sfx,s.v);
 if(s.wait)await sleep(s.wait);
 if(s.s){const male=s.tm&&st.hero&&!st.hero.f;const vo=s.s==='HELD'||s.novo?null:A+'vo/'+s._vo+(male?'m':'')+'.mp3';
  if(s.note){sfx('rohrpost');await rohrpost();await sleep(900)}
  if(s.s==='WG')wgCut(s.wg);
  await say(s.s,male?s.tm:s.t,vo,s.e)}
 if(s.choice){const i=await choice(s.choice);const o=s.choice[i];if(o.flag)flag(o.flag);if(o.go)await run(o.go,ctx)}
 if(s.probe){const r=await probe(s.probe);await run(r?s.ok||[]:s.fail||[],ctx)}
 if(s.code){const r=await codeInput(s.code);await run(r?s.ok||[]:s.fail||[],ctx)}
 if(s.fight){hideBox();const r=await fight(s.fight);if(!r)SC.abort=1;else{$('#sc-bg').innerHTML=''}}
 if(s.game){hideBox();await GAMES[s.game](s)}
 if(s.item){hideBox();await gainItem(s.item,s.n)}
 if(s.drop)dropItem(s.drop);
 if(s.gold){addGold(s.gold)}
 if(s.xp){addXp(s.xp)}
 if(s.join){hideBox();await joinParty(s.join)}
 if(s.learn){hideBox();await learnSkill(s.learn)}
 if(s.levelup){hideBox();await levelUp(s.levelup)}
 if(s.loot){hideBox();await lootRoll()}
 if(s.film){hideBox();await playFilm(s.film)}
 if(s.song){hideBox();await songShow(s.song,s.imgs||[],Object.assign({},s,{keep:s.keep||SC.nextBg}))}
 if(s.flag)flag(s.flag);
 if(s.if){const t=typeof s.if==='function'?s.if():st.flags[s.if];await run(t?s.then||[]:s.else||[],ctx)}
 if(s.fn)await s.fn(ctx);
 if(s.hide)hideBox();
}
const flag=f=>{st.flags[f]=1;save()};
const has=id=>st.inv.some(x=>x.id===id);

// Rohrpost von Wendelgard: Zettel fällt ins Bild
async function rohrpost(){const n=el('div','rohr');n.innerHTML='<img src="'+A+'ui/rohrpost.png" alt=""><span class="rp-tag">Feedback</span>';$('#s-scene').appendChild(n);await sleep(700);setTimeout(()=>{n.classList.add('out');setTimeout(()=>n.remove(),600)},2600)}

// Probe: W20 plus Wert gegen Ziel
const STATN={str:'Stärke',dex:'Geschick',wis:'Weisheit'};
async function probe(p){hideBox();const bonus=(st.hero[p.stat]||0)+(p.bonus?p.bonus():0)+itemBonus(p);
 const r=await rollD20({title:(p.name||'Probe auf '+STATN[p.stat]),sub:'W20 plus '+STATN[p.stat]+' '+bonus+', Ziel '+p.ziel,bonus,ziel:p.ziel});
 return r.total>=p.ziel}
function itemBonus(p){let b=0;if(p.tag)st.inv.forEach(x=>{const I=ITEMS[x.id];if(I&&I.bonus&&I.bonus[p.tag])b+=I.bonus[p.tag]});return b}

// Sprechzeilen fest durchnummerieren (auch in Verzweigungen), damit jede Zeile ihre Aufnahme hat
function numberSteps(id,steps){let n=0;const walk=a=>{(a||[]).forEach(s=>{if(s.s)s._vo=id+'_'+String(++n).padStart(3,'0');['ok','fail','then','else','wrong'].forEach(k=>walk(s[k]));if(s.choice)s.choice.forEach(o=>walk(o.go));if(s.code){walk(s.code.wrongSteps)}})};walk(steps);return n}

// Zirpias Auftritt: Lied läuft, Bilder der Vorstellung wechseln, Tippen beendet
async function songShow(name,imgs,o){const cur=$('#sc-bg .on');const prev=cur?cur.dataset.src:null;let skip=false;
 const hint=el('div','song-hint','Tippen zum Weiterspielen');$('#s-scene').appendChild(hint);setTimeout(()=>hint.classList.add('on'),1600);
 let i=0;const next=()=>{if(!imgs.length||skip||i>=imgs.length)return;setBg(A+'img/'+imgs[i]+'.jpg');i++};
 let sk=null,unsub=null;const p=st.sound?playSong(name,o.v??.9,o.max,()=>{unsub=songSubs(name,o.max)}):new Promise(r=>{sk=r;setTimeout(r,Math.max(1,imgs.length)*2600)});next();
 const per=(o.per||0)||null;const dur=st.sound?await songDur(name,o.max):Math.max(1,imgs.length)*2.6;const step=per||Math.max(3500,dur*1000/Math.max(1,imgs.length));
 const tm=setInterval(next,step);
 SC.tap=()=>{skip=true;stopSong();if(sk)sk()};await p;if(unsub)unsub();SC.tap=null;clearInterval(tm);hint.remove();if(prev&&!o.keep)setBg(prev)}
const SDUR={zirpia_01:21.8,zirpia_02:82,zirpia_03:96.8,zirpia_04:93,zirpia_05:78.4,zirpia_06:27.5,zirpia_07:28,zirpia_08:13,zirpia_09:27.3,zirpia_10:27.2,zirpia_11:50.5,zirpia_12:30,zirpia_13:92.8};
async function songDur(n,max){const d=SDUR[n]||30;return max?Math.min(d,max):d}

// Abschlussbewertung als Urkunde: Zeilen erscheinen nacheinander, am Ende der Stempel
function zeugnis(phase){let z=$('#zeugnis');
 if(phase==='hide'){if(z){z.classList.add('out');setTimeout(()=>z.remove(),700)}return}
 if(!z){z=el('div','zeugnis','<div class="zg-k">Ehrwürdige Gilde der Erzähler</div><h3>Abschlussbewertung</h3><div class="zg-s">Probezeit des Spielleiters, vierundzwanzig Nächte</div><div class="zg-rows"></div><div class="zg-sig"><i>M. Wendelgard</i><span>Meisterin der Gilde</span></div><div class="zg-stamp">Bestanden</div><div class="zg-conf"></div>');z.id='zeugnis';$('#s-scene').appendChild(z);requestAnimationFrame(()=>z.classList.add('on'))}
 const rows=z.querySelector('.zg-rows');const star=n=>'<span class="zg-st">'+'<b>★</b>'.repeat(n)+'<b class="o">★</b>'.repeat(5-n)+'</span>';
 const add=(l,v,r,d)=>setTimeout(()=>{const e=el('div','zg-r','<span class="zg-l">'+l+'</span><span class="zg-v">'+v+'</span>'+r);rows.appendChild(e);sfx('pergament',.4)},d);
 if(phase===1){add('Erzählung','lebendig',star(4),400);add('Witze','zahlreich, teilweise gut',star(3),2400);add('Das Butterbrot','weiterhin unerklärt','<span class="zg-st q">?</span>',4600)}
 if(phase===2){add('Herz','vorhanden',star(5),300);add('Mitspieler',heroName(),'<span class="zg-st">'+'<b>★</b>'.repeat(5)+'</span>',1800);
  setTimeout(()=>{z.classList.add('stamp');sfx('treffer',1);sfx('fanfare',.7);const c=z.querySelector('.zg-conf');for(let i=0;i<40;i++){const e=el('i','');e.style.left=Math.random()*100+'%';e.style.background=['#ffd76a','#ff5ad1','#7ad7ff','#9cff7a','#ff8a5a'][i%5];e.style.animationDelay=(Math.random()*.6)+'s';e.style.animationDuration=(1.8+Math.random()*1.6)+'s';c.appendChild(e)}},3600)}}
