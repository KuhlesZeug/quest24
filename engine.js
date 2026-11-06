// Grundfunktionen: Zustand, Zeit, Ton, Bildschirme
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const rnd=n=>1+Math.floor(Math.random()*n);
const params=new URLSearchParams(location.search);
const KEY='kz_quest24_v1';
const A='a/';

const ST0=()=>({ok:0,intro:0,sound:true,auto:true,hero:null,party:[],inv:[],gold:0,xp:0,lvl:1,done:{},hint:{},flags:{},seen:{},log:[],start:0,insp:0});
let st=ST0();
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)st=Object.assign(st,s)}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
let GIFT=null; // {an,von,msg,ort,foto}

// Text mit Platzhaltern
const heroName=()=>esc((st.hero&&st.hero.name)||(GIFT&&GIFT.an)||'Held');
const T=t=>String(t||'').replace(/\{NAME\}/g,heroName()).replace(/\{VON\}/g,esc(GIFT&&GIFT.von||'jemand, der dich gut kennt'));

// Zeit: deutsche Zeit, Serverzeit wenn möglich
let PROBE=false,skew=0;
const timeReady=(async()=>{
 const q=params.get('probe');if(q&&await QZ.sha(q)===QZ.PROBE)PROBE=true;
 try{const r=await fetch(location.href.split('#')[0],{method:'HEAD',cache:'no-store'});const d=r.headers.get('date');if(d)skew=new Date(d).getTime()-Date.now()}catch(e){}
})();
function now(){return new Date(Date.now()+skew)}
function berlin(){const p=new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(now());const o={};p.forEach(x=>o[x.type]=+x.value);return o}
function unlocked(d){if(PROBE)return true;const b=berlin();if(b.month===12)return b.day>=d;if(b.month===1||b.month===2)return true;return false}
function maxDay(){let m=0;for(let d=1;d<=24;d++)if(unlocked(d))m=d;return m}
function nextDay(){for(let d=1;d<=24;d++)if(!st.done[d])return d;return 25}

// Ton: Musik, Atmosphäre, Effekte, Stimmen
let AC=null,master=null,musBus=null,atmoBus=null,sfxBus=null;
const BUF={};
function ac(){if(!AC){try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=st.sound?1:0;master.connect(AC.destination);
 musBus=AC.createGain();musBus.gain.value=.55;musBus.connect(master);atmoBus=AC.createGain();atmoBus.gain.value=.7;atmoBus.connect(master);sfxBus=AC.createGain();sfxBus.gain.value=.9;sfxBus.connect(master)}
 if(AC.state==='suspended')AC.resume();return AC}
async function loadBuf(src){if(BUF[src])return BUF[src];const p=fetch(src).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(a=>new Promise((ok,no)=>ac().decodeAudioData(a,ok,no))).catch(()=>null);BUF[src]=p;return p}
// Schleifen mit weicher Überblendung (Musik und Atmo)
function makeLooper(busName){let cur=null;
 return async function(src,vol){ac();if(cur&&cur.src===src){cur.g.gain.setTargetAtTime(vol??.5,AC.currentTime,.6);return}
  const old=cur;if(old){old.g.gain.setTargetAtTime(0,AC.currentTime,.7);setTimeout(()=>{try{old.s.stop()}catch(e){}},3500)}
  cur=null;if(!src)return;const b=await loadBuf(src);if(!b)return;const s=AC.createBufferSource();s.buffer=b;s.loop=true;const g=AC.createGain();g.gain.value=0;s.connect(g);g.connect(busName==='mus'?musBus:atmoBus);s.start();g.gain.setTargetAtTime(vol??.5,AC.currentTime,1.1);cur={src,s,g}}}
const music=makeLooper('mus');
const atmo=makeLooper('atmo');
function duck(on){if(!musBus)return;musBus.gain.setTargetAtTime(on?.22:.55,AC.currentTime,.25);atmoBus.gain.setTargetAtTime(on?.45:.7,AC.currentTime,.25)}
// Effekte: a und b Fassung abwechselnd, damit nichts mechanisch klingt
const SFXV={};const SFXA={glocke_fern:'glocke',tuer_knarzt:'tavernentuer',holz_knarzt:'tavernentuer'};
async function sfx(name,vol){if(!st.sound)return;ac();name=SFXA[name]||name;const v=SFXV[name]=(SFXV[name]||0)+1;const ab=v%2?'a':'b';
 let b=await loadBuf(A+'sfx/'+name+'_'+ab+'.mp3');if(!b)b=await loadBuf(A+'sfx/'+name+'.mp3');if(!b)return;
 const s=AC.createBufferSource();s.buffer=b;s.playbackRate.value=.97+Math.random()*.06;const g=AC.createGain();g.gain.value=vol??1;s.connect(g);g.connect(sfxBus);s.start()}
// Zufällige Akzente zur Atmo (Eule, Knistern, Tropfen)
let accTimer=null;
function accents(list,every){clearInterval(accTimer);if(!list||!list.length)return;accTimer=setInterval(()=>{if(Math.random()<.55)sfx(list[Math.floor(Math.random()*list.length)],.55)},(every||14)*1000)}

// Stimmen
let curVo=null;
// Stimmen laufen über Web Audio: einmal freigeschaltet, spielen sie auch ohne Berührung zuverlässig bis zum Ende
let voBus=null;
function voOut(){ac();if(!voBus){voBus=AC.createGain();voBus.gain.value=1;voBus.connect(master)}return voBus}
function loadVo(src){return fetch(src).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(a=>new Promise((ok,no)=>ac().decodeAudioData(a,ok,no))).catch(()=>null)}
function stopVo(){if(curVo){const a=curVo;curVo=null;a.stop();const u=a._ui;u&&u(false);duck(false)}}
function playVo(src,ui){stopVo();if(!src||!st.sound)return null;ac();const a={ended:false,_err:0,_ui:ui,s:null};
 a.stop=()=>{a.ended=true;clearTimeout(a._t);if(a.s){try{a.s.stop()}catch(e){}}};
 const end=()=>{if(a.ended&&curVo!==a)return;a.ended=true;clearTimeout(a._t);if(curVo===a){curVo=null;duck(false)}ui&&ui(false)};
 curVo=a;duck(true);ui&&ui(true);
 loadVo(src).then(b=>{if(curVo!==a||a.ended)return;if(!b){a._err=1;end();return}
  const s=AC.createBufferSource();s.buffer=b;s.connect(voOut());s.onended=end;a.s=s;if(AC.state!=='running')AC.resume();s.start();
  a._t=setTimeout(end,(b.duration+1.2)*1000)});
 return a}
function voDone(a){return new Promise(r=>{if(!a)return r(false);if(a._err)return r(false);const t=setInterval(()=>{if(a.ended||a._err||curVo!==a){clearInterval(t);r(!a._err)}},100)})}

function setSound(on){st.sound=on;save();if(master)master.gain.value=on?1:0;if(!on)stopVo();$$('.btn-snd').forEach(b=>b.classList.toggle('off',!on))}

// Bildschirme
let curScreen='#s-start';
function show(id){$$('.screen').forEach(s=>s.classList.remove('on'));const s=$(id);s.classList.add('on');window.scrollTo(0,0);curScreen=id;document.dispatchEvent(new CustomEvent('screen',{detail:id}))}
function toast(t,ms){const e=$('#toast');e.innerHTML=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),ms||2800)}

// Gemalte Symbole aus dem Ordner a/ui
const UI=n=>'<img class="ui-ic" src="'+A+'ui/'+n+'.png" alt="">';

// Gemalte Effekte als kurze Bildfolge (a/ui/fx_<art>_0 bis 3)
function fx(kind,target,size){if(!target)return;const r=target.getBoundingClientRect();const s=size||Math.max(90,Math.min(r.width,r.height)*1.1);
 const d=el('div','fx');d.style.cssText='left:'+(r.left+r.width/2-s/2)+'px;top:'+(r.top+r.height/2-s/2)+'px;width:'+s+'px;height:'+s+'px';document.body.appendChild(d);
 let i=0;const step=()=>{if(i>3){d.remove();return}d.style.backgroundImage='url('+A+'ui/fx_'+kind+'_'+i+'.png)';i++;setTimeout(step,95)};step()}
