// Malen nach Zahlen (Tag 1): Ausmalbild mit nummerierten Feldern, Farbtöpfe unten, Zoomen mit zwei Fingern
// Daten aus tools/pbn.py: a/pbn/<name>/bild.jpg, linie.png, felder.png, umriss.png, felder.json
GAMES.malen=(s)=>new Promise(async done=>{hideBox();
 const B=A+'pbn/'+(s.bild||'krieger')+'/';
 const o=el('div','pbn');o.innerHTML='<div class="pbn-top"><div class="pbn-t">Male dein Abenteuer</div><div class="pbn-bar"><i></i></div><button class="pbn-lupe" aria-label="Hinweis"><img src="'+A+'ui/pbn_lupe.png" alt=""><b>6</b></button></div><div class="pbn-stage"><canvas></canvas><div class="pbn-load">Pinsel werden ausgepackt …</div></div><div class="pbn-pal"></div>';
 document.body.appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));
 const stage=o.querySelector('.pbn-stage'),cv=o.querySelector('canvas'),cx=cv.getContext('2d');
 const load=src=>new Promise((r,j)=>{const i=new Image();i.crossOrigin='anonymous';i.onload=()=>r(i);i.onerror=j;i.src=src});
 let D,imB,imL,imF,imU;
 try{[D,imB,imL,imF,imU]=await Promise.all([fetch(B+'felder.json').then(r=>r.json()),load(B+'bild.jpg'),load(B+'linie.png'),load(B+'felder.png'),load(B+'umriss.png')])}catch(e){o.remove();toast('Das Malbild konnte nicht geladen werden.');return done()}
 const W=D.w,H=D.h,N=D.r.length;
 const px=im=>{const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,0,W,H);return g.getImageData(0,0,W,H).data};
 const orig=px(imB),lin=px(imL),fe=px(imF);
 // Feldnummer je Pixel und Pixellisten je Feld
 const reg=new Uint16Array(W*H),cnt=new Uint32Array(N+2);
 for(let i=0,p=0;i<W*H;i++,p+=4){const r=fe[p]+(fe[p+1]<<8);reg[i]=r;cnt[r]++}
 const off=new Uint32Array(N+2);for(let r=1;r<=N+1;r++)off[r]=off[r-1]+cnt[r-1];
 const pos=off.slice(),list=new Uint32Array(W*H);for(let i=0;i<W*H;i++)list[pos[reg[i]]++]=i;
 const bb=D.r.map(()=>[W,H,0,0]);for(let r=1;r<=N;r++){const b=bb[r-1];for(let k=off[r];k<off[r+1];k++){const i=list[k],x=i%W,y=(i/W)|0;if(x<b[0])b[0]=x;if(y<b[1])b[1]=y;if(x>b[2])b[2]=x;if(y>b[3])b[3]=y}}
 // Arbeitsbild
 const work=document.createElement('canvas');work.width=W;work.height=H;const wg=work.getContext('2d');const wd=wg.createImageData(W,H),w=wd.data;
 for(let i=0,p=0;i<W*H;i++,p+=4){if(reg[i]===0){w[p]=orig[p]*.25+lin[p]*.75;w[p+1]=orig[p+1]*.25+lin[p+1]*.75;w[p+2]=orig[p+2]*.25+lin[p+2]*.75}else{w[p]=lin[p];w[p+1]=lin[p+1];w[p+2]=lin[p+2]}w[p+3]=255}
 wg.putImageData(wd,0,0);
 const filled=new Uint8Array(N+1),left=D.pal.map(()=>0);D.r.forEach(r=>left[r[0]]++);
 let sel=-1,nFill=0;
 const paintReg=(r,mode,cx0,cy0,rad)=>{ // mode 0 leer, 1 markiert, 2 gefüllt
  const b=bb[r-1];for(let k=off[r];k<off[r+1];k++){const i=list[k],p=i*4;
   if(mode===2){if(rad!=null){const x=i%W-cx0,y=(i/W|0)-cy0;if(x*x+y*y>rad*rad)continue}w[p]=orig[p];w[p+1]=orig[p+1];w[p+2]=orig[p+2]}
   else if(mode===1){const x=i%W,y=(i/W)|0;const h=((x+y)%16)<7;const l=lin[p];if(h){w[p]=l*.52;w[p+1]=l*.52;w[p+2]=l*.56}else{w[p]=l*.86;w[p+1]=l*.86;w[p+2]=l*.88}}
   else{w[p]=lin[p];w[p+1]=lin[p+1];w[p+2]=lin[p+2]}}
  wg.putImageData(wd,0,0,b[0],b[1],b[2]-b[0]+1,b[3]-b[1]+1)};
 const mark=(c,on)=>{for(let r=1;r<=N;r++)if(!filled[r]&&D.r[r-1][0]===c)paintReg(r,on?1:0)};
 // Farbtöpfe
 const pal=o.querySelector('.pbn-pal');
 const lum=h=>{const n=parseInt(h.slice(1),16);return .3*(n>>16)+.59*(n>>8&255)+.11*(n&255)};
 const potI=await load(A+'ui/pbn_topf.png').catch(()=>null),potF=await load(A+'ui/pbn_topf_farbe.png').catch(()=>null);
 const potPx=im=>{const c=document.createElement('canvas');c.width=c.height=160;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,0,160,160);return g.getImageData(0,0,160,160)};
 const PB=potI&&potPx(potI),PF=potF&&potPx(potF);
 const potFor=hex=>{const c=document.createElement('canvas');c.width=c.height=160;if(!PB)return c;const g=c.getContext('2d');const id=new ImageData(new Uint8ClampedArray(PB.data),160,160),d=id.data,f=PF.data;const n=parseInt(hex.slice(1),16),C=[n>>16,n>>8&255,n&255];
  for(let p=0;p<d.length;p+=4){const ma=f[p+3]/255;if(!ma)continue;const k=f[p]/243;for(let j=0;j<3;j++){const t=k<=1?C[j]*(.55+.45*k):C[j]+(255-C[j])*Math.min(1,(k-1)*6);d[p+j]=d[p+j]*(1-ma)+t*ma}}
  g.putImageData(id,0,0);return c};
 D.pal.forEach((c,i)=>{const b=el('button','pbn-c','<span style="color:'+(lum(c)>150?'#2a1a0c':'#fff6e0')+'">'+(i+1)+'</span><svg class="pbn-ring" viewBox="0 0 60 60"><circle cx="30" cy="30" r="27"/></svg><img class="pbn-ok" src="'+A+'ui/pbn_siegel.png" alt="">');b.insertBefore(potFor(c),b.firstChild);b.onclick=()=>pick(i);pal.appendChild(b)});
 const ring=c=>{const tot=D.r.filter(r=>r[0]===c).length,b=pal.children[c];b.querySelector('circle').style.strokeDashoffset=170*(left[c]/tot)};
 const pick=c=>{if(left[c]===0)return;sfx('ui_klick',.5);if(sel>=0){mark(sel,false);pal.children[sel].classList.remove('on')}sel=c;mark(c,true);const b=pal.children[c];b.classList.add('on');b.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});draw()};
 D.pal.forEach((c,i)=>ring(i));
 // Ansicht: Zoom und Verschieben
 let vw,vh,dpr,fit,sc,tx,ty;
 const size=()=>{dpr=Math.min(2,devicePixelRatio||1);vw=stage.clientWidth;vh=stage.clientHeight;cv.width=vw*dpr;cv.height=vh*dpr;cv.style.width=vw+'px';cv.style.height=vh+'px';fit=Math.min(vw/W,vh/H)*.96;if(!sc){sc=fit;tx=(vw-W*sc)/2;ty=(vh-H*sc)/2}clamp();draw()};
 const clamp=()=>{sc=Math.max(fit,Math.min(fit*5,sc));const mw=W*sc,mh=H*sc;tx=mw<vw?(vw-mw)/2:Math.min(0,Math.max(vw-mw,tx));ty=mh<vh?(vh-mh)/2:Math.min(0,Math.max(vh-mh,ty))};
 let raf=0,pulse=null;
 const draw=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,vw,vh);
  cx.save();cx.shadowColor='rgba(0,0,0,.45)';cx.shadowBlur=18;cx.fillStyle='#fff';cx.fillRect(tx,ty,W*sc,H*sc);cx.restore();
  cx.imageSmoothingEnabled=true;cx.imageSmoothingQuality='high';cx.drawImage(work,tx,ty,W*sc,H*sc);
  cx.globalAlpha=Math.min(1,.35+sc/fit*.15);cx.drawImage(imU,tx,ty,W*sc,H*sc);cx.globalAlpha=1;
  cx.textAlign='center';cx.textBaseline='middle';
  cx.lineJoin='round';for(let r=1;r<=N;r++){if(filled[r])continue;const R=D.r[r-1],rr=R[3]*D.s*sc;if(rr<5)continue;const x=tx+R[1]*D.s*sc,y=ty+R[2]*D.s*sc;if(x<-20||y<-20||x>vw+20||y>vh+20)continue;
   const on=R[0]===sel,fs=Math.max(10,Math.min(on?22:19,rr*1.15));cx.font='700 '+fs+'px Georgia,serif';cx.lineWidth=Math.max(3,fs*.28);cx.strokeStyle='rgba(255,255,255,.95)';cx.strokeText(R[0]+1,x,y);cx.fillStyle=on?'#000':'#3d3630';cx.fillText(R[0]+1,x,y)}
  if(pulse){const t=(performance.now()-pulse.t)/1400;if(t<1){const R=D.r[pulse.r-1];cx.strokeStyle='rgba(255,200,60,'+(1-t)+')';cx.lineWidth=4;cx.beginPath();cx.arc(tx+R[1]*D.s*sc,ty+R[2]*D.s*sc,(R[3]*D.s*sc)+10+t*40,0,7);cx.stroke();draw()}else pulse=null}
 })};
 addEventListener('resize',size);size();o.querySelector('.pbn-load').remove();
 const anim=(s2,x2,y2,ms)=>new Promise(res=>{const s0=sc,x0=tx,y0=ty,t0=performance.now();const f=()=>{const t=Math.min(1,(performance.now()-t0)/ms),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;sc=s0+(s2-s0)*e;tx=x0+(x2-x0)*e;ty=y0+(y2-y0)*e;draw();if(t<1)requestAnimationFrame(f);else{clamp();draw();res()}};f()});
 const zoomTo=(r,z)=>{const R=D.r[r-1],s2=Math.max(sc,fit*z),x=R[1]*D.s,y=R[2]*D.s;let x2=vw/2-x*s2,y2=vh/2-y*s2;const ss=sc,xs=tx,ys=ty;sc=s2;tx=x2;ty=y2;clamp();const t={s:sc,x:tx,y:ty};sc=ss;tx=xs;ty=ys;return anim(t.s,t.x,t.y,600)};
 // Antippen
 const P=new Map();let moved=0,pinch=null,t0=0,last=null;
 cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);P.set(e.pointerId,{x:e.clientX,y:e.clientY});if(P.size===1){moved=0;t0=performance.now();last={x:e.clientX,y:e.clientY}}if(P.size===2){const [a,b]=[...P.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),s:sc,mx:(a.x+b.x)/2,my:(a.y+b.y)/2,tx,ty};moved=99}});
 cv.addEventListener('pointermove',e=>{if(!P.has(e.pointerId))return;P.set(e.pointerId,{x:e.clientX,y:e.clientY});const rc=cv.getBoundingClientRect();
  if(P.size>=2&&pinch){const [a,b]=[...P.values()];const d=Math.hypot(a.x-b.x,a.y-b.y),mx=(a.x+b.x)/2,my=(a.y+b.y)/2;const ns=Math.max(fit,Math.min(fit*5,pinch.s*d/pinch.d));const ix=(pinch.mx-rc.left-pinch.tx)/pinch.s,iy=(pinch.my-rc.top-pinch.ty)/pinch.s;sc=ns;tx=mx-rc.left-ix*ns;ty=my-rc.top-iy*ns;clamp();draw()}
  else if(P.size===1&&last){const dx=e.clientX-last.x,dy=e.clientY-last.y;moved+=Math.abs(dx)+Math.abs(dy);if(moved>8){tx+=dx;ty+=dy;clamp();draw()}last={x:e.clientX,y:e.clientY}}});
 const up=e=>{if(!P.has(e.pointerId))return;P.delete(e.pointerId);if(P.size<2)pinch=null;if(P.size===1){const v=[...P.values()][0];last={x:v.x,y:v.y}}
  if(P.size===0&&moved<=8&&performance.now()-t0<600){const rc=cv.getBoundingClientRect();tap((e.clientX-rc.left-tx)/sc,(e.clientY-rc.top-ty)/sc)}};
 cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 cv.addEventListener('wheel',e=>{e.preventDefault();const rc=cv.getBoundingClientRect(),mx=e.clientX-rc.left,my=e.clientY-rc.top,ix=(mx-tx)/sc,iy=(my-ty)/sc;sc=Math.max(fit,Math.min(fit*5,sc*Math.exp(-e.deltaY*.0018)));tx=mx-ix*sc;ty=my-iy*sc;clamp();draw()},{passive:false});
 const findReg=(x,y)=>{x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=W||y>=H)return 0;let r=reg[y*W+x];if(r)return r;
  for(let d=1;d<=Math.ceil(6/sc);d++)for(let a=0;a<8;a++){const xx=x+Math.round(Math.cos(a*.785)*d),yy=y+Math.round(Math.sin(a*.785)*d);if(xx>=0&&yy>=0&&xx<W&&yy<H&&reg[yy*W+xx])return reg[yy*W+xx]}return 0};
 let idle=performance.now();
 const tap=(x,y)=>{const r=findReg(x,y);if(!r||filled[r])return;const c=D.r[r-1][0];
  if(sel<0){toast('Wähle unten zuerst eine Farbe.');return}
  if(c!==sel){sfx('falsch',.35);const b=pal.children[sel];b.classList.remove('wob');void b.offsetWidth;b.classList.add('wob');toast('Hier gehört die Farbe '+(c+1)+' hin.',1600);return}
  fill(r,x,y)};
 const fill=(r,x,y)=>{filled[r]=1;nFill++;idle=performance.now();const c=D.r[r-1][0];left[c]--;ring(c);sfx('pinsel',.7);
  const b=bb[r-1],maxR=Math.hypot(Math.max(x-b[0],b[2]-x),Math.max(y-b[1],b[3]-y))+2;const t0=performance.now();
  const step=()=>{const t=Math.min(1,(performance.now()-t0)/320);paintReg(r,2,x,y,maxR*t);draw();if(t<1)requestAnimationFrame(step)};step();
  o.querySelector('.pbn-bar i').style.width=(nFill/N*100)+'%';
  if(left[c]===0){const pb=pal.children[c];pb.classList.add('done');pb.classList.remove('on');sfx('richtig',.5);sel=-1;const nx=left.findIndex((v,i)=>v>0&&i>c),n2=nx>=0?nx:left.findIndex(v=>v>0);if(n2>=0)setTimeout(()=>pick(n2),350)}
  if(nFill===N)setTimeout(finish,500)};
 // Lupe
 let hints=6;const lb=o.querySelector('.pbn-lupe');
 lb.onclick=async()=>{if(sel<0){const n=left.findIndex(v=>v>0);if(n>=0)pick(n)}if(hints<=0){toast('Die Lupe ist erschöpft. Schau genau hin, du schaffst das.');return}
  let best=0,bs=1e9;for(let r=1;r<=N;r++)if(!filled[r]&&D.r[r-1][0]===sel){const R=D.r[r-1];const sx=tx+R[1]*D.s*sc-vw/2,sy=ty+R[2]*D.s*sc-vh/2;const d=sx*sx+sy*sy-R[4]*.01;if(d<bs){bs=d;best=r}}
  if(!best)return;hints--;lb.querySelector('b').textContent=hints;if(hints<=0)lb.classList.add('leer');sfx('licht_an',.5);
  const z=Math.max(1.4,Math.min(3.2,45/(D.r[best-1][3]*D.s*fit)));await zoomTo(best,z);pulse={r:best,t:performance.now()};draw()};
 const nag=setInterval(()=>{if(performance.now()-idle>45000){lb.classList.add('nudge');idle=performance.now()}},5000);
 if(TEST){const tb=el('button','pbn-test','Test: fertig malen');tb.onclick=()=>{for(let r=1;r<=N;r++)if(!filled[r]){filled[r]=1;paintReg(r,2)}nFill=N;draw();finish()};o.querySelector('.pbn-top').appendChild(tb)}
 // Fertig
 let fin=0;async function finish(){if(fin)return;fin=1;clearInterval(nag);o.classList.add('fertig');await anim(fit,(vw-W*fit)/2,(vh-H*fit)/2,700);
  const sh=el('div','pbn-show','<img src="'+B+'bild.jpg" alt=""><div class="pbn-glanz"></div><div class="pbn-done">Dein Abenteuer</div>');o.appendChild(sh);
  sfx('kritisch',.8);setTimeout(()=>sfx('fanfare',.7),500);requestAnimationFrame(()=>sh.classList.add('on'));
  const sp=sh.querySelector('.pbn-glanz');for(let i=0;i<36;i++){const e=el('i','');e.style.left=Math.random()*100+'%';e.style.top=Math.random()*100+'%';e.style.animationDelay=(Math.random()*1.6)+'s';sp.appendChild(e)}
  await sleep(2600);await Promise.race([new Promise(r=>sh.onclick=r),sleep(3200)]);
  removeEventListener('resize',size);o.classList.remove('on');await sleep(450);o.remove();done()}
});
