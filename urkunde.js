// Heldenurkunde in der App: ansehen, eigenes Foto einsetzen (nur auf diesem Gerät gespeichert), als PDF speichern
const URK_FOTO='quest24_urkunde_foto';
function urkFoto(){try{return localStorage.getItem(URK_FOTO)}catch(e){return null}}
function urkDatum(){const t=st.done&&st.done[24];return new Date(typeof t==='number'&&t>1e12?t:Date.now()).toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'})}
function urkHtml(){const h=st.hero||{};const C=(typeof CLS!=='undefined'&&CLS[h.cls])||null;const kl=C?(h.f?C.nf:C.n):'Held';
 const foto=urkFoto()||heroImg();
 const comp=[['gr','Grumbold'],['zi','Zirpia die Große'],['hu','Oma Hulda'],['na','Nachtigall']].map(([k,n])=>'<div class="uk-c"><img src="'+A+'img/k_'+k+'.jpg" alt=""><b>'+n+'</b></div>').join('');
 return '<div class="uk" id="uk"><img class="uk-bg" src="'+A+'ui/urk_bg.jpg" alt="">'
 +'<div class="uk-por"><img src="'+foto+'" alt=""></div>'
 +'<p class="uk-t1">Die Ehrwürdige Gilde der Erzähler bestätigt hiermit feierlich, dass</p>'
 +'<div class="uk-name"><span>'+heroName()+'</span></div><small class="uk-cap">Name der Heldin oder des Helden</small>'
 +'<p class="uk-t2">in der Lichternacht dem Hüter Vharkon sein Herz zurückgegeben und ganz Eldmark wieder Licht gebracht hat.</p>'
 +'<div class="uk-cf"><div><span>'+esc(kl)+'</span><small>Klasse</small></div><div><span>'+(st.lvl||5)+'</span><small>Stufe</small></div><div><span>'+urkDatum()+'</span><small>Datum</small></div></div>'
 +'<p class="uk-t3">Gemeinsam mit den treuesten Gefährten, die man sich wünschen kann:</p><div class="uk-comp">'+comp+'</div>'
 +'<div class="uk-sig"><div><span></span><small>Der Spielleiter</small></div><div><span></span><small>Meisterin Wendelgard</small></div></div>'
 +'</div>'}
function urkFit(){const o=$('#urk');if(!o)return;const w=o.querySelector('.uk-wrap');const uk=o.querySelector('.uk');const s=Math.min(w.clientWidth/688,w.clientHeight/930);uk.style.transform='scale('+s+')';w.style.setProperty('--uh',(930*s)+'px')}
function openUrkunde(){let o=$('#urk');if(!o){o=el('div','ovl urk-ovl');o.id='urk';document.body.appendChild(o)}
 const has=!!urkFoto();
 o.innerHTML='<div class="uk-wrap">'+urkHtml()+'</div><div class="uk-bar"><button class="pbtn" data-a="foto">'+(has?'Anderes Foto':'Eigenes Foto')+'</button>'+(has?'<button class="pbtn" data-a="weg">Foto entfernen</button>':'')+'<button class="pbtn" data-a="pdf">Als PDF speichern</button><button class="pbtn" data-a="zu">Zur Karte</button></div><p class="uk-hint">Dein Foto bleibt nur auf diesem Gerät gespeichert.</p><input type="file" accept="image/*" capture="user" hidden>';
 o.classList.add('on');sfx('pergament',.6);requestAnimationFrame(urkFit);
 const inp=o.querySelector('input');
 o.querySelector('[data-a="foto"]').onclick=()=>inp.click();
 inp.onchange=async()=>{const f=inp.files[0];if(!f)return;try{const d=await urkCrop(f);localStorage.setItem(URK_FOTO,d);openUrkunde();toast('Foto eingesetzt')}catch(e){toast('Das Foto konnte nicht geladen werden.')}};
 const weg=o.querySelector('[data-a="weg"]');if(weg)weg.onclick=()=>{try{localStorage.removeItem(URK_FOTO)}catch(e){}openUrkunde()};
 o.querySelector('[data-a="zu"]').onclick=()=>{o.classList.remove('on');sfx('ui_klick',.5)};
 o.querySelector('[data-a="pdf"]').onclick=e=>urkPdf(e.currentTarget)}
addEventListener('resize',urkFit);
// Foto quadratisch zuschneiden und verkleinern, damit es klein im Gerätespeicher liegt
function urkCrop(file){return new Promise((res,rej)=>{const r=new FileReader();r.onerror=rej;r.onload=()=>{const im=new Image();im.onerror=rej;im.onload=()=>{const s=Math.min(im.width,im.height),c=document.createElement('canvas');c.width=c.height=480;c.getContext('2d').drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,480,480);res(c.toDataURL('image/jpeg',.85))};im.src=r.result};r.readAsDataURL(file)})}
function urkLoad(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
async function urkPdf(btn){const t=btn.textContent;btn.disabled=true;btn.textContent='Einen Moment …';
 try{if(!window.html2canvas)await urkLoad('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
  if(!window.jspdf)await urkLoad('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  await document.fonts.ready;
  const host=el('div','uk-render');host.innerHTML=urkHtml();document.body.appendChild(host);
  await Promise.all([...host.querySelectorAll('img')].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r})));
  const cv=await html2canvas(host.firstChild,{scale:2.6,useCORS:true,backgroundColor:null,logging:false});host.remove();
  const pdf=new jspdf.jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  pdf.addImage(cv.toDataURL('image/jpeg',.92),'JPEG',(210-182)/2,(297-246)/2,182,246);
  const nm=((st.hero&&st.hero.name)||'Held').replace(/[^\wäöüÄÖÜß]+/g,'_');pdf.save('Heldenurkunde_'+nm+'.pdf');sfx('richtig',.6)}
 catch(e){toast('Das PDF konnte gerade nicht erstellt werden. Prüfe die Internetverbindung.')}
 btn.disabled=false;btn.textContent=t}
