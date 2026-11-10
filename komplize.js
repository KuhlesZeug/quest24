// Seite für den Schenkenden: Name, Nachricht im Drachenschatz, Hinweis auf das echte Geschenk, Geschenklink
(function(){
const sec=el('section','screen','');sec.id='s-komp';document.body.insertBefore(sec,$('#battle'));
window.openKomplize=function(){
 const I=A+'items/',U=A+'ui/';
 const card=(n,ic,t,h,inner,opt)=>'<div class="kp-card'+(opt?' opt':'')+'" data-n="'+n+'"><div class="kp-ch"><span class="kp-seal"><img src="'+U+'siegel.png" alt=""><b>'+n+'</b></span><img class="kp-ic" src="'+ic+'" alt=""><div><h3>'+t+'</h3><p>'+h+'</p></div></div>'+inner+'</div>';
 sec.innerHTML='<div class="kp">'+
 '<div class="kp-hero" style="background-image:linear-gradient(180deg,rgba(10,8,20,.15),rgba(10,8,20,.35) 55%,var(--night) 100%),url('+A+'img/f_intro3.jpg)"><div class="kp-snow"></div>'+
 '<span class="kp-only">Nur für dich, nicht für den Beschenkten</span><div class="lg kp-lg"><img class="lg-base" src="'+U+'logo_base.png" alt="Quest 24"><img class="lg-dr" src="'+U+'logo_drache.png" alt=""><i class="lg-glow"></i><img class="lg-fl" src="'+U+'flamme.png" alt=""><div class="lg-smoke"></div></div><h2>Das Abenteuer verschenken</h2><p>In fünf Minuten eingerichtet. Am 24. Dezember wartet deine Nachricht im Drachenschatz.</p></div>'+
 '<div class="kp-how"><div><img src="'+I+'feder.png" alt=""><b>Einrichten</b><span>Name, Nachricht und Hinweis eintragen</span></div><i></i><div><img src="'+I+'liebesbrief.png" alt=""><b>Verschicken</b><span>Link senden oder QR Code in die Akte legen</span></div><i></i><div><img src="'+U+'truhe.png" alt=""><b>Staunen</b><span>Am 24. öffnet sich der Drachenschatz</span></div></div>'+
 '<div class="kp-in">'+
 card(1,I+'schluessel.png','Dein Zugangscode','Er steht in deiner Abenteuerakte und in der Spielleitung.','<input id="kp-code" autocapitalize="characters" autocomplete="off" placeholder="Zugangscode">')+
 card(2,I+'spielfigur.png','Wer wird zur Heldin oder zum Helden?','Die App begrüßt sie oder ihn jeden Tag mit diesem Namen.','<input id="kp-an" maxlength="24" placeholder="zum Beispiel Jonas">')+
 card(3,A+'img/p_alt.jpg','Von wem kommt das Abenteuer?','Der Dorfälteste grüßt am Ende von dir.','<input id="kp-von" maxlength="40" placeholder="zum Beispiel Papa oder Oma Inge">')+
 card(4,U+'truhe.png','Deine Nachricht im Drachenschatz','Sie bleibt versiegelt, bis Vharkon besiegt ist.','<div class="kp-letter"><textarea id="kp-msg" maxlength="600" rows="6" placeholder="Schreib hier, was du der Heldin oder dem Helden am Ende sagen möchtest."></textarea><span class="kp-cnt">0 von 600</span></div>')+
 card(5,I+'karte_x.png','Wo liegt das echte Geschenk?','Ein Hinweis, der nach dem Drachenkampf erscheint.','<input id="kp-ort" maxlength="160" placeholder="zum Beispiel: Schau hinter die Bücher im Regal.">',1)+
 '<div class="kp-prev"><div class="kp-pk">So sieht es am 24. Dezember aus</div><div class="kp-pv" style="background-image:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.45)),url('+A+'img/schatz_hort.jpg)"><div class="kp-glint"></div><div class="kp-scroll"><div class="kp-to">Für <b id="kp-p-an">deine Heldin oder deinen Helden</b></div><p id="kp-p-msg">Hier erscheint deine Nachricht.</p><div class="kp-from" id="kp-p-von"></div><div class="kp-hint" id="kp-p-ort"></div><img class="kp-wax" src="'+U+'siegel.png" alt=""></div></div></div>'+
 '<button class="pbtn big kp-go" id="kp-go">Geschenklink erstellen</button><p class="small kp-err" id="kp-err"></p><div id="kp-out"></div></div></div>';
 const upd=()=>{const v=id=>($(id).value||'').trim();$('#kp-p-an').textContent=v('#kp-an')||'deine Heldin oder deinen Helden';$('#kp-p-msg').textContent=v('#kp-msg')||'Hier erscheint deine Nachricht.';$('#kp-p-von').textContent=v('#kp-von')?'Von '+v('#kp-von'):'';$('#kp-p-ort').textContent=v('#kp-ort')?'Dein echtes Geschenk: '+v('#kp-ort'):'';$('.kp-cnt').textContent=$('#kp-msg').value.length+' von 600';
  [['#kp-code',1],['#kp-an',2],['#kp-von',3],['#kp-msg',4],['#kp-ort',5]].forEach(([i,n])=>sec.querySelector('.kp-card[data-n="'+n+'"]').classList.toggle('done',!!v(i)))};
 ['#kp-code','#kp-an','#kp-von','#kp-msg','#kp-ort'].forEach(i=>$(i).addEventListener('input',upd));
 show('#s-komp');
 // Logo wie auf dem Startbildschirm: Drache atmet, Flamme flackert, Rauch steigt aus den Nüstern
 {const L=sec.querySelector('.kp-lg'),d=L.querySelector('.lg-dr'),sm=L.querySelector('.lg-smoke');const puff=()=>{if(!sec.classList.contains('on')||document.hidden)return;for(let k=0;k<2;k++){const i=el('img','');i.src=A+'ui/fx_smoke_'+(k+1)+'.png';i.style.left=(17.5+k*2)+'%';i.style.top=(30-k*3)+'%';i.style.animationDelay=(k*.25)+'s';sm.appendChild(i);setTimeout(()=>i.remove(),2900)}};
  const go=()=>setTimeout(puff,1750);d.addEventListener('animationiteration',go);go()}
 $('#kp-go').onclick=async()=>{const e=$('#kp-err');e.textContent='';
  if(await QZ.hash($('#kp-code').value)!==QZ.ACCESS){sfx('falsch');return e.textContent='Dieser Zugangscode stimmt nicht. Er steht in deiner Abenteuerakte.'}
  const an=$('#kp-an').value.trim();if(!an)return e.textContent='Bitte einen Namen eintragen.';
  const o={an,von:$('#kp-von').value.trim(),msg:$('#kp-msg').value.trim(),ort:$('#kp-ort').value.trim()};
  const link=location.href.split('#')[0].split('?')[0]+'#g='+await QZ.pack(o);sfx('richtig');
  $('#kp-out').innerHTML='<div class="kp-res"><div class="kp-rays"></div><div class="kp-rk">Dein Abenteuer ist bereit</div><h3>Für '+esc(an)+'</h3><div id="kp-qr"></div><p class="kp-link">'+esc(link)+'</p><div class="kp-btns"><button class="pbtn" id="kp-cp">Link kopieren</button>'+(navigator.share?'<button class="pbtn" id="kp-sh">Teilen</button>':'')+'</div></div>';
  setTimeout(()=>{const r=$('.kp-res');r&&r.scrollIntoView({behavior:'smooth',block:'start'});if(window.fx)try{fx('magic',r.querySelector('h3'),220)}catch(e){}},80);
  try{const q=qrcode(0,'M');q.addData(link);q.make();const n=q.getModuleCount(),c=8,m=4,W=(n+2*m)*c;const cv=document.createElement('canvas');cv.width=W;cv.height=W+70;const x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,W,W+70);x.fillStyle='#1a0d04';for(let r=0;r<n;r++)for(let k=0;k<n;k++)if(q.isDark(r,k))x.fillRect((k+m)*c,(r+m)*c,c,c);x.font='bold 30px Georgia,serif';x.textAlign='center';x.fillText('Quest 24 · Scan mich',W/2,W+44);
   const url=cv.toDataURL('image/png');$('#kp-qr').innerHTML='<div class="kp-qrf"><img src="'+url+'" alt="QR Code zum Geschenklink"></div><a class="pbtn kp-qrs" download="Quest24_Geschenk_QR.png" href="'+url+'">QR Code speichern</a><p class="small">Ausdrucken und in die Abenteuerakte legen, zum Beispiel aufs Titelblatt.</p>'}catch(err){$('#kp-qr').innerHTML='<p class="small">Die Nachricht ist zu lang für einen QR Code. Schick den Link einfach per Nachricht.</p>'}
  const sh=$('#kp-sh');if(sh)sh.onclick=()=>navigator.share({title:'Quest 24',text:'Ein Abenteuer für dich, '+an+'!',url:link}).catch(()=>{});
  $('#kp-cp').onclick=()=>{(navigator.clipboard?navigator.clipboard.writeText(link):Promise.reject()).then(()=>toast('Link kopiert')).catch(()=>toast('Bitte den Link markieren und kopieren'))}}};
if(location.hash.startsWith('#komplize'))setTimeout(()=>openKomplize(),300);
})();
