window.S=ms=>new Promise(r=>setTimeout(r,ms));
window.tap=(x,y)=>{const el=document.elementFromPoint(x,y);if(!el)return null;const o={bubbles:true,cancelable:true,clientX:x,clientY:y,button:0,pointerId:1,pointerType:'mouse',isPrimary:true,view:window};el.dispatchEvent(new PointerEvent('pointerover',o));el.dispatchEvent(new PointerEvent('pointerdown',o));el.dispatchEvent(new MouseEvent('mousedown',o));el.dispatchEvent(new PointerEvent('pointerup',o));el.dispatchEvent(new MouseEvent('mouseup',o));el.dispatchEvent(new MouseEvent('click',o));return el};
window.tapEl=b=>{const q=b.getBoundingClientRect();return tap(q.x+q.width/2,q.y+q.height/2)};
window.btnTxt=t=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&b.innerText.trim()===t);
window.ED=()=>document.querySelector('[contenteditable]');
window.clearP=()=>{const e=ED();e.focus();const r=document.createRange();r.selectNodeContents(e);const s=getSelection();s.removeAllRanges();s.addRange(r);e.dispatchEvent(new InputEvent('beforeinput',{inputType:'deleteContentBackward',bubbles:true,cancelable:true}));return e.innerText.trim().length};
window.paste=t=>{const e=ED();e.focus();const dt=new DataTransfer();dt.setData('text/plain',t);e.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dt,bubbles:true,cancelable:true}));return e.innerText.trim().length};
window.rmRefs=async()=>{let b,k=0;while((b=document.querySelector('button[aria-label="Remove attachment"]'))&&k<8){tapEl(b);await S(500);k++}};
window.openRefs=async()=>{if(!document.querySelector('input[type=file]')){const b=document.querySelector('button[aria-label="References"]');if(b)tapEl(b);await S(1500)}const u=btnTxt('Uploads')[0];if(u)tapEl(u);await S(1000);return !!document.querySelector('input[type=file]')};
window.upFile=async(path)=>{const r=await fetch('https://raw.githubusercontent.com/KuhlesZeug/quest24/main/'+path+'?t='+Date.now());const b=await r.blob();const f=new File([b],path.split('/').pop(),{type:'image/jpeg'});const inp=document.querySelector('input[type=file]');const dt=new DataTransfer();dt.items.add(f);inp.files=dt.files;inp.dispatchEvent(new Event('change',{bubbles:true}));return b.size};
window.umTile=()=>{const um=[...document.querySelectorAll('body *')].filter(e=>e.children.length===0&&e.textContent.trim()==='Upload media').pop();if(!um)return null;let t=um;for(let i=0;i<6;i++){if(t.getBoundingClientRect().width>80)break;t=t.parentElement}return t};
window.selFirst=()=>{const t=umTile();if(!t)return false;const r=t.getBoundingClientRect();tap(r.right+r.width/2+6,r.y+r.height/2);return true};
window.closeP=()=>{const b=document.querySelector('button[aria-label="Close assets picker"]');if(b)tapEl(b);return !!b};
window.busy=()=>[...document.querySelectorAll('body *')].some(e=>e.children.length<4&&/^\s*Generating\s*$/.test(e.innerText||'')&&e.offsetParent);
window.goBtn=()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&/^(UNLIMITED|GENERATE)/.test(b.innerText.trim())).pop();
window.refN=()=>document.querySelectorAll('button[aria-label="Remove attachment"]').length;
window.setAR=async(ar)=>{if(btnTxt(ar).length)return true;const a=[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&/^(Auto|1:1|4:3|3:4|16:9|9:16|2:3|3:2|21:9)$/.test(b.innerText.trim())).pop();if(!a)return false;tapEl(a);await S(800);const m=[...document.querySelectorAll('[role=menuitemcheckbox]')].find(e=>e.innerText.trim()===ar);if(m){tapEl(m);await S(600)}return btnTxt(ar).length>0};
window.lock=async()=>{for(let k=0;k<120;k++){const v=+localStorage.getItem('hfUpLock')||0;if(Date.now()-v>40000){localStorage.setItem('hfUpLock',Date.now());return true}await S(1000)}return false};
window.unlock=()=>localStorage.removeItem('hfUpLock');
window.attach=async(path)=>{await lock();try{await rmRefs();await openRefs();await upFile(path);let k=0;while(k<40){await S(1500);const t=umTile();if(t&&!document.body.innerText.includes('Uploading'))break;k++}await S(1500);selFirst();await S(1800);closeP();await S(1200);return refN()}finally{unlock()}};
window.RUN={log:[],done:[],stop:false,cur:null};
window.runJobs=async(jobs,ar)=>{let curRef=null;while(jobs.length&&!RUN.stop){const j=jobs[0];try{let k=0;while(busy()&&k<400){await S(2000);k++}await S(2000);
 if(j.path!==curRef||refN()!==1){let ok=0;for(let t=0;t<3&&ok!==1;t++){ok=await attach(j.path)}if(ok!==1){RUN.log.push(j.n+' ref '+ok);curRef=null;await S(5000);continue}curRef=j.path}
 clearP();await S(400);await setAR(ar);paste(j.p);await S(900);
 let g=goBtn();if(g)tapEl(g);let w=0;while(!busy()&&w<12){await S(1000);w++}
 if(!busy()){g=goBtn();if(g)tapEl(g);w=0;while(!busy()&&w<12){await S(1000);w++}}
 if(busy()){RUN.done.push([j.n,Date.now()]);RUN.log.push(j.n+' gestartet');jobs.shift()}else{RUN.log.push(j.n+' nicht gestartet');await S(5000)}
 }catch(e){RUN.log.push(j.n+' ERR '+e.message);await S(5000)}}RUN.log.push('ENDE')};

