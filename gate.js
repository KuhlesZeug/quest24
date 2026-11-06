// Zugang, Geschenklinks und Codeprüfung. Lösungen stehen nur als Hash im Code.
window.QZ={
 SALT:'c2bd46e506ffbf2b47aa3784e4a94548',
 ACCESS:'14619744af83d6fa45c80c9893ed64ca110e581ff6cabc7734c017123edf2feb',
 PROBE:'59825fe7ba29e46e9264bc22548c66cdedf6b7700894fd3e0a8c67cd9a98d9a7'
};
QZ.sha=async s=>{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')};
QZ.norm=s=>(s||'').toUpperCase().replace(/Ä/g,'AE').replace(/Ö/g,'OE').replace(/Ü/g,'UE').replace(/ß/g,'SS').replace(/[^A-Z0-9]/g,'');
QZ.hash=s=>QZ.sha(QZ.SALT+'|'+QZ.norm(s));
// Geschenklink: Daten im Link, leicht verschleiert und signiert
QZ.key=()=>{const h=QZ.SALT+QZ.ACCESS;const k=[];for(let i=0;i<h.length;i+=2)k.push(parseInt(h.substr(i,2),16)||7);return k};
QZ.hide=s=>{const b=new TextEncoder().encode(s),k=QZ.key();let r='';b.forEach((x,i)=>r+=String.fromCharCode(x^k[i%k.length]^(i*13&255)));return btoa(r).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
QZ.show=s=>{try{const r=atob(s.replace(/-/g,'+').replace(/_/g,'/')),k=QZ.key(),b=new Uint8Array(r.length);for(let i=0;i<r.length;i++)b[i]=r.charCodeAt(i)^k[i%k.length]^(i*13&255);return new TextDecoder().decode(b)}catch(e){return ''}};
QZ.sig=async o=>(await QZ.sha(QZ.ACCESS+'|'+JSON.stringify(o))).slice(0,10);
QZ.pack=async o=>{const s=await QZ.sig(o);return QZ.hide(JSON.stringify({o,s}))};
QZ.unpack=async g=>{try{const j=JSON.parse(QZ.show(g));if(!j||!j.o)return null;if(await QZ.sig(j.o)!==j.s)return null;return j.o}catch(e){return null}};
