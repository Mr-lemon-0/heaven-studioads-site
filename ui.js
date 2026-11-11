/* Heaven Studioads motion engine — every element moves */
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
/* scroll parallax for glossy backdrop blobs */
const blobs=qa('.blob');let braf=null;
addEventListener('scroll',()=>{if(!braf)braf=requestAnimationFrame(()=>{
  const k=scrollY/(document.documentElement.scrollHeight-innerHeight||1);
  blobs.forEach((b,i)=>{b.style.translate=`${b.classList.contains('b1')?'-50%':'0'} ${(k*(14+i*10)).toFixed(1)}vmax`});
  braf=null;});},{passive:true});
/* progress bar */
const pf=q('#pfill');
addEventListener('scroll',()=>{const d=document.documentElement;
  pf.style.width=(scrollY/(d.scrollHeight-innerHeight)*100)+'%';},{passive:true});
/* split hero into animated words */
const hh=q('#hero-h');
if(hh){const parts=[];hh.childNodes.forEach(n=>{
  if(n.nodeType===3){n.textContent.split(/\s+/).filter(Boolean).forEach(w=>parts.push(`<span class="w"><i>${w}</i></span>`))}
  else if(n.nodeType===1){parts.push(`<span class="w"><i>${n.outerHTML}</i></span>`)}});
  hh.innerHTML=parts.join(' ');
  hh.querySelectorAll('.w i em').forEach(e=>{e.style.background='linear-gradient(110deg,#8a5a2b 20%,#f1ebe2 42%,#b08d57 62%)';e.style.backgroundSize='220% 100%';e.style.webkitBackgroundClip='text';e.style.color='transparent';e.style.animation='shim 5s linear infinite'});
  requestAnimationFrame(()=>requestAnimationFrame(()=>hh.classList.add('go')));}
/* reveal on approach */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.18});
qa('.rv').forEach(el=>io.observe(el));
/* magnetic buttons */
qa('.btn').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();
  b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.22}px)`;});
  b.addEventListener('pointerleave',()=>b.style.transform='');});
/* card 3D tilt */
qa('.card').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  c.style.transform=`perspective(700px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-4px)`;});
  c.addEventListener('pointerleave',()=>c.style.transform='');});
/* soft mouse parallax on overlays */
const ovs=qa('.ov').map(o=>({o,d:Math.random()*.5+.4}));
let mx=0,my=0,raf=null;
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;
  if(!raf)raf=requestAnimationFrame(()=>{for(const{o,d}of ovs)o.style.translate=`${(mx*14*d).toFixed(1)}px ${(my*10*d).toFixed(1)}px`;raf=null;});},{passive:true});
/* scroll parallax for floating gallery cards */
const cards=qa('.float-card');
let sraf=null;
addEventListener('scroll',()=>{if(!sraf)sraf=requestAnimationFrame(()=>{
  for(const c of cards){const r=c.getBoundingClientRect();
    if(r.bottom>-100&&r.top<innerHeight+100){
      const off=(r.top+r.height/2-innerHeight/2)*parseFloat(c.dataset.speed||0.15);
      c.style.transform=`translateY(${off.toFixed(1)}px)`;}}
  sraf=null;});},{passive:true});
window.__uiReady=true;

/* ===== Nova-pattern premium motion: cursor, counters, color journey ===== */
/* cursor glow */
(function(){const cur=q('#cur');if(!cur||matchMedia('(hover:none)').matches)return;
let cx=-40,cy=-40,tx=-40,ty=-40,cr=null;
addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;
if(!cr)cr=requestAnimationFrame(()=>{cx+=(tx-cx)*.28;cy+=(ty-cy)*.28;
cur.style.left=cx+'px';cur.style.top=cy+'px';cr=null;});},{passive:true});
document.addEventListener('pointerover',e=>{cur.classList.toggle('big',!!e.target.closest('.btn,.card,a[href],video'))});
})();
/* count-up stat counters */
(function(){const els=qa('.stats dt[data-cnt]');
const io2=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io2.unobserve(e.target);
const el=e.target,end=+el.dataset.cnt,suf=el.dataset.suf||'',aft=el.dataset.aft||'';
const t0=performance.now(),dur=1400;
(function tick(t){const p=Math.min(1,(t-t0)/dur),ease=1-Math.pow(1-p,3);
const v=Math.round(end*ease);el.textContent=aft?(v+'+'+Math.round((+aft)*ease)):(v+suf);
if(p<1)requestAnimationFrame(tick);else el.textContent=aft?(end+'+'+aft):(end+suf);})(t0);}),{threshold:.6});
els.forEach(el=>io2.observe(el));})();
/* scroll-controlled color journey (subtle, palette-true) */
(function(){const stops=[[5,4,3],[10,8,6],[8,6,10],[5,4,3]];let jraf=null;
addEventListener('scroll',()=>{if(!jraf)jraf=requestAnimationFrame(()=>{
const k=scrollY/(document.documentElement.scrollHeight-innerHeight||1);
const f=k*(stops.length-1),i=Math.min(stops.length-2,Math.floor(f)),r=f-i;
const c=stops[i].map((v,n)=>Math.round(v+(stops[i+1][n]-v)*r));
document.body.style.background=`rgb(${c[0]},${c[1]},${c[2]})`;jraf=null;});},{passive:true});
})();
/* editorial rows micro-parallax */
(function(){const rows=qa('.ed-row');let rraf=null;
addEventListener('scroll',()=>{if(!rraf)rraf=requestAnimationFrame(()=>{
for(const r of rows){const b=r.getBoundingClientRect();
if(b.bottom<0||b.top>innerHeight)continue;
const p=(b.top+b.height/2-innerHeight/2)/innerHeight;
r.style.transform=`translateY(${(p*14).toFixed(1)}px)`;}rraf=null;});},{passive:true});})();



/* ===== booking: top drawer, everything in-site ===== */
(function(){
const f=q('#bookForm'),d=q('#bkd');
if(!f||!d)return;
const sel=f.querySelector('#bk-pkg'),cust=f.querySelector('#bk-custom'),note=q('#bk-note');
const open=()=>{d.classList.add('open');d.setAttribute('aria-hidden','false');d.removeAttribute('inert');document.body.style.overflow='hidden'};
const close=()=>{d.classList.remove('open');d.setAttribute('aria-hidden','true');d.setAttribute('inert','');document.body.style.overflow=''};
d.querySelector('.bk-back').addEventListener('click',close);
d.querySelector('.bk-x').addEventListener('click',close);
addEventListener('keydown',e=>{if(e.key==='Escape')close()});
function toggle(){const t=sel.options[sel.selectedIndex].text;cust.style.display=t.indexOf('Custom')>-1?'':'none';}
sel.addEventListener('change',toggle);
qa('.open-bk').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();open();
  if(a.dataset.pkg){[...sel.options].forEach(o=>{if(o.text.startsWith(a.dataset.pkg))sel.value=o.text;});toggle();}}));
f.addEventListener('submit',e=>{e.preventDefault();
const v=id=>{const el=f.querySelector(id);return el?el.value.trim():'';};
if(!v('#bk-brand')||!v('#bk-email')||!/.+@.+\..+/.test(v('#bk-email'))){note.hidden=false;note.className='bk-note bad';note.textContent='Please add your brand name and a valid email.';return;}
note.hidden=false;note.className='bk-note';note.textContent='Sending…';
const pkgT=sel.options[sel.selectedIndex].text;
const pkgKey=/trial/i.test(pkgT)?'trial':(/month/i.test(pkgT)?'monthly':'custom');const bkData={brand:v('#bk-brand'),name:v('#bk-name'),email:v('#bk-email'),pkg:pkgKey,phone:(v('#bk-phone')||''),note:(pkgT?'Package: '+pkgT+' | ':'')+(v('#bk-custom')?'Volume: '+v('#bk-custom')+' | ':'')+(v('#bk-msg')||'')};
const bkOK=()=>{f.classList.add('sent');note.className='bk-note ok';
  note.textContent='Booking request received. We will get back to you within a few business hours — no email needed.';};
const bkFAIL=()=>{const body=['Brand: '+v('#bk-brand'),'Name: '+v('#bk-name'),'Email: '+v('#bk-email'),'Package: '+pkgT,'Custom volume: '+v('#bk-custom'),'','Product / audience:',v('#bk-msg')].join('\n');const href='mailto:heavenstuido.ads@gmail.com?subject='+encodeURIComponent('Booking request - '+v('#bk-brand'))+'&body='+encodeURIComponent(body);note.className='bk-note';note.innerHTML='Your email app is opening with the details. If it does not open, write to '+'<a href="'+href+'" style="color:inherit;text-decoration:underline">heavenstuido.ads@gmail.com</a> and we confirm your slot.';f.classList.add('sent');try{window.location.href=href;}catch(e){}};
const viaBackend=fetch('https://ai-ugc-ads-a120260a.base44.app/functions/createBookingLead',{method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify(bkData)}).then(r=>r.json()).then(j=>{if(j&&j.ok===true){bkOK();return true;}throw 0;});
viaBackend.catch(()=>{const n=document.getElementById('bk-note');if(n){n.hidden=false;n.textContent='Could not send right now. Please message us on WhatsApp and we will reply within the hour.';}return false;});});
})();

/* Oracle-style contact widget */
(() => {
  const btn = document.getElementById('cw-btn'), card = document.getElementById('cw-card');
  if (!btn || !card) return;
  const cx = card.querySelector('.cx');
  const set = (open) => {
    card.classList.toggle('open', open);
    card.setAttribute('aria-hidden', open ? 'false' : 'true');
    if(open){card.removeAttribute('inert')}else{card.setAttribute('inert','')}
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  btn.addEventListener('click', (e) => { e.preventDefault(); set(!card.classList.contains('open')); });
  cx.addEventListener('click', () => set(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  document.addEventListener('click', (e) => { if (card.classList.contains('open') && !card.contains(e.target) && !btn.contains(e.target)) set(false); });
})();

// small screens: swap to the lighter cut before playback (mobile data + LCP)
(function(){var v=document.querySelector('video[data-src-mobile]');
 if(v && window.matchMedia('(max-width: 600px)').matches){v.src=v.getAttribute('data-src-mobile');v.load();}})();
