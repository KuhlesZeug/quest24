// Seite für den Schenkenden: Name, Nachricht im Drachenschatz, Hinweis auf das echte Geschenk, Geschenklink
(function(){
const sec=el('section','screen','');sec.id='s-komp';document.body.insertBefore(sec,$('#battle'));
window.openKomplize=function(){
 sec.innerHTML='<div class="hero-in"><div class="step">Nur für dich, nicht für den Beschenkten</div><h2>Das Abenteuer verschenken</h2><p class="say">Hier richtest du das Abenteuer ein. Am Ende bekommst du einen Geschenklink, den du per Nachricht schickst oder als QR Code in die Abenteuerakte legst.</p>'+
 '<div class="field"><label>Zugangscode aus deiner Bestellung</label><input id="kp-code" autocapitalize="characters" autocomplete="off"></div>'+
 '<div class="field"><label>Name der Heldin oder des Helden</label><input id="kp-an" maxlength="24" placeholder="zum Beispiel Jonas"></div>'+
 '<div class="field"><label>Von wem? So grüßt dich der Dorfälteste am Ende</label><input id="kp-von" maxlength="40" placeholder="dein Vorname"></div>'+
 '<div class="field"><label>Deine Nachricht im Drachenschatz</label><textarea id="kp-msg" maxlength="600" rows="6" class="name-in" style="font-size:1rem;text-align:left"></textarea></div>'+
 '<div class="field"><label>Hinweis auf das echte Geschenk (freiwillig)</label><input id="kp-ort" maxlength="160" placeholder="zum Beispiel: Schau hinter die Bücher im Regal."></div>'+
 '<button class="pbtn big" id="kp-go">Geschenklink erstellen</button><p class="small" id="kp-err" style="color:var(--red)"></p><div id="kp-out"></div></div>';
 show('#s-komp');
 $('#kp-go').onclick=async()=>{const e=$('#kp-err');e.textContent='';
  if(await QZ.hash($('#kp-code').value)!==QZ.ACCESS){sfx('falsch');return e.textContent='Dieser Zugangscode stimmt nicht. Er steht in deiner Abenteuerakte.'}
  const an=$('#kp-an').value.trim();if(!an)return e.textContent='Bitte einen Namen eintragen.';
  const o={an,von:$('#kp-von').value.trim(),msg:$('#kp-msg').value.trim(),ort:$('#kp-ort').value.trim()};
  const link=location.href.split('#')[0].split('?')[0]+'#g='+await QZ.pack(o);sfx('richtig');
  $('#kp-out').innerHTML='<div class="c-card" style="margin-top:16px;animation:none"><div class="cc-k">Dein Geschenklink</div><p style="word-break:break-all;font-size:.85rem">'+esc(link)+'</p><button class="pbtn" id="kp-cp">Link kopieren</button></div>';
  $('#kp-cp').onclick=()=>{(navigator.clipboard?navigator.clipboard.writeText(link):Promise.reject()).then(()=>toast('Link kopiert')).catch(()=>toast('Bitte den Link markieren und kopieren'))}}};
if(location.hash.startsWith('#komplize'))setTimeout(()=>openKomplize(),300);
})();
