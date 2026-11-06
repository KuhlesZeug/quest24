// Würfel: W20 für Proben und Angriffe, W100 und W10 für Tageswurf und Beute
// Die Würfel sind gemalt (a/ui/w20.png usw.), die Zahl steht in Schrift darauf.
function diceOvl(){let o=$('#dice');if(!o){o=el('div','ovl dice-ovl');o.id='dice';document.body.appendChild(o)}return o}
// Drehbilder je Würfel (gemalt): w20 acht Stück, w10 und w100 je vier
const DFR={w20:8,w10:4,w100:4};
function dieEl(kind,cls){const d=el('div','die '+kind+(cls?' '+cls:''),'<img src="'+A+'ui/'+kind+'.png" alt=""><b></b>');d.dataset.k=kind;
 if(DFR[kind])for(let i=0;i<DFR[kind];i++){const im=new Image();im.src=A+'ui/'+kind+'_r'+i+'.png'}return d}
async function tumble(d,final,fmt){const k=d.dataset.k,n=DFR[k]||0,img=d.querySelector('img'),b=d.querySelector('b');d.classList.add('roll');const t0=performance.now();let i=0;
 while(performance.now()-t0<1150){if(n){img.src=A+'ui/'+k+'_r'+(i%n)+'.png';b.style.opacity=0}else b.textContent=fmt(null);i++;await sleep(55+i*5)}
 img.src=A+'ui/'+k+'.png';b.style.opacity=1;d.classList.remove('roll');d.classList.add('land');b.textContent=fmt(final);setTimeout(()=>d.classList.remove('land'),500)}

// Eigene Würfel: Ergebnis selbst eintippen
function ownDice(max,label){return new Promise(r=>{const o=diceOvl();const f=el('div','own','<p>'+label+'</p><input type="number" inputmode="numeric" min="1" max="'+max+'" placeholder="1 bis '+max+'"><button class="pbtn">Übernehmen</button>');o.appendChild(f);
 const i=f.querySelector('input');i.focus();f.querySelector('button').onclick=()=>{const v=+i.value;if(v>=1&&v<=max){f.remove();r(v)}else toast('Bitte eine Zahl von 1 bis '+max)}})}

// W20 Probe: zeigt Ziel, Bonus, Ergebnis
async function rollD20(o){const ov=diceOvl();ov.innerHTML='<div class="dice-card"><div class="dc-t">'+esc(o.title)+'</div><div class="dc-s">'+esc(o.sub||'')+'</div><div class="dc-row"></div><div class="dc-res"></div><button class="pbtn dc-go">Würfeln</button>'+(st.flags.own?'':'<button class="lnk dc-own">Ich würfle mit eigenen Würfeln</button>')+'</div>';
 ov.classList.add('on');const row=ov.querySelector('.dc-row');const d=dieEl('w20');row.appendChild(d);d.querySelector('b').textContent='20';
 await new Promise(r=>{ov.querySelector('.dc-go').onclick=r;d.onclick=r;const ob=ov.querySelector('.dc-own');if(ob)ob.onclick=async()=>{ov._own=1;r()}});
 ov.querySelector('.dc-go').remove();const ob=ov.querySelector('.dc-own');if(ob)ob.remove();
 let v;if(ov._own||st.flags.own){v=await ownDice(20,'Was zeigt dein W20?');sfx('wuerfel');d.querySelector('b').textContent=v}else{sfx('wuerfel');v=o.force||rnd(20);await tumble(d,v,x=>x==null?rnd(20):x)}
 const total=v+(o.bonus||0);const res=ov.querySelector('.dc-res');
 const crit=v===20,fumble=v===1;let ok=o.ziel!=null?total>=o.ziel:null;
 res.innerHTML='<span class="n">'+v+'</span>'+(o.bonus?'<span class="p">plus '+o.bonus+'</span><span class="eq">= '+total+'</span>':'')+(o.ziel!=null?'<span class="v '+(ok?'ok':'no')+'">'+(crit?'Natürliche Zwanzig!':fumble?'Patzer!':ok?'Geschafft':'Daneben')+'</span>':'');
 if(crit){sfx('kritisch');d.classList.add('crit')}else if(ok===true)sfx('richtig',.8);else if(ok===false)sfx('falsch',.7);
 await sleep(1500);await new Promise(r=>{ov.onclick=r;setTimeout(r,2600)});ov.onclick=null;ov.classList.remove('on');
 return{v,total,crit,fumble}}

// W100 und W10: Tageswurf (zeigt die Tageszahl) und Beute (1 bis 100)
async function rollPercent(o){const ov=diceOvl();ov.innerHTML='<div class="dice-card"><div class="dc-t">'+esc(o.title)+'</div><div class="dc-s">'+esc(o.sub||'')+'</div><div class="dc-row"></div><div class="dc-res"></div><button class="pbtn dc-go">Würfeln</button></div>';
 ov.classList.add('on');const row=ov.querySelector('.dc-row');const d1=dieEl('w100'),d2=dieEl('w10');row.append(d1,d2);d1.querySelector('b').textContent='00';d2.querySelector('b').textContent='0';
 await new Promise(r=>{ov.querySelector('.dc-go').onclick=r;row.onclick=r});ov.querySelector('.dc-go').remove();
 let val;
 if(o.locked){sfx('wuerfel');const sk=dieEl('w20s');d1.replaceWith(sk);await tumble(d2,'?',x=>x==null?rnd(10)-1:x);ov.querySelector('.dc-res').innerHTML='<span class="msg">'+o.locked+'</span>';await sleep(800);await new Promise(r=>{ov.onclick=r});ov.onclick=null;ov.classList.remove('on');return null}
 if(o.fixed!=null){val=o.fixed}else if(st.flags.own){val=await ownDice(100,'Was zeigen W100 und W10 zusammen? (00 und 0 ist 100)')}else val=rnd(100);
 const tens=Math.floor((val%100)/10)*10,ones=val%10;sfx('wuerfel');
 await Promise.all([tumble(d1,tens,x=>String(x==null?(rnd(10)-1)*10:x).padStart(2,'0')),sleep(160).then(()=>tumble(d2,ones,x=>String(x==null?rnd(10)-1:x)))]);
 ov.querySelector('.dc-res').innerHTML='<span class="n">'+val+'</span>'+(o.after?'<span class="msg">'+o.after(val)+'</span>':'');sfx('richtig',.6);
 await sleep(1200);await new Promise(r=>{ov.onclick=r;setTimeout(r,3500)});ov.onclick=null;ov.classList.remove('on');return val}

// Schadenswurf W10 (kurz, ohne eigenes Fenster)
const d10=()=>rnd(10);
