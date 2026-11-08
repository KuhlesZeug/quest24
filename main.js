// Ablauf: Start, Intro, Charakterbau, Karte
$('#sc-back').innerHTML=UI('karte_ic');
$('#sc-back').onclick=async()=>{const o=$('#card');o.classList.remove('gbg');o.innerHTML='<div class="c-card"><h3>Zurück zur Karte?</h3><p>Der heutige Tag beginnt dann beim nächsten Mal von vorn.</p><div class="hero-nav"><button class="pbtn" data-r="1">Zur Karte</button><button class="pbtn" data-r="0">Weiterspielen</button></div></div>';o.classList.add('on');
 const r=await new Promise(res=>o.querySelectorAll('button').forEach(b=>b.onclick=()=>res(+b.dataset.r)));o.classList.remove('on');
 if(r){SC.abort=1;stopVo();if(SC.tap)SC.tap();setTimeout(goMap,200)}};

async function loadGift(){const g=params.get('g')||(location.hash.startsWith('#g=')?location.hash.slice(3):null);if(g){GIFT=await QZ.unpack(g);if(GIFT){st.ok=1;save()}}}

async function goStart(){await timeReady;await loadGift();
 $('#codebox').style.display=st.ok?'none':'block';
 $('#giftline').innerHTML=GIFT?('Für <b>'+esc(GIFT.an)+'</b>. Ein Abenteuer von '+esc(GIFT.von)+'.'):'';
 $('#btn-start').textContent=st.hero?'Weiterspielen':'Abenteuer beginnen';show('#s-start')}
$('#btn-start').onclick=async()=>{ac();
 if(!st.ok){const h=await QZ.hash($('#code').value);if(h!==QZ.ACCESS){sfx('falsch');$('#code').animate([{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'none'}],{duration:300});return toast('Dieser Zugangscode stimmt nicht.')}st.ok=1}
 st.start=st.start||Date.now();save();sfx('ui_klick');
 if(!st.intro){await playFilm('intro');st.intro=1;save()}
 if(!st.hero){if(!unlocked(1)){return goMap()}return goDay1()}
 goMap()};
async function goDay1(){await playDay(1,false)}

// Musik startet erst nach der ersten Berührung (Vorgabe der Browser)
document.addEventListener('pointerdown',()=>{ac();if(curScreen==='#s-start'&&!st._m){st._m=1;music(A+'mus/titel.mp3',.45);atmo(A+'atmo/dorf_winter.mp3',.3)}},{once:false});
goStart();

// Drache schnauft: nach dem Einatmen kommt beim Ausatmen ein Rauchwölkchen aus den Nüstern
function puffSmoke(){if(curScreen!=='#s-start'||document.hidden)return;const sm=$('.lg-smoke');if(!sm)return;
 for(let k=0;k<2;k++){const i=el('img','');i.src=A+'ui/fx_smoke_'+(k+1)+'.png';i.style.left=(17.5+k*2)+'%';i.style.top=(30-k*3)+'%';i.style.animationDelay=(k*.25)+'s';sm.appendChild(i);setTimeout(()=>i.remove(),2900)}}
(()=>{const d=$('.lg-dr');if(!d)return;const go=()=>setTimeout(puffSmoke,1750);d.addEventListener('animationiteration',go);go()})();
