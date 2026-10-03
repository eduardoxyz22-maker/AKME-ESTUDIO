(()=>{const pet=document.querySelector('.quote-mascot');if(!pet)return;let scheduled=false;const area=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
function update(){scheduled=false;const modal=!!document.querySelector('dialog[open]');pet.classList.toggle('is-obstructed',modal);if(pet.getAttribute('aria-hidden')!==String(modal))pet.setAttribute('aria-hidden',String(modal));pet.tabIndex=modal?-1:0;if(modal||pet.matches(':hover,:focus'))return;
 const vp=window.visualViewport,left=vp?.offsetLeft||0,top=vp?.offsetTop||0,width=vp?.width||innerWidth,height=vp?.height||innerHeight;
 const rects=selector=>[...document.querySelectorAll(selector)].filter(e=>!pet.contains(e)&&e!==pet&&e.checkVisibility()).map(e=>e.getBoundingClientRect()).filter(r=>r.width&&r.bottom>top&&r.top<top+height);
 const controls=rects('a,button,input,select,textarea,summary,video'),content=rects('h1,h2,h3,p,img,.gallery-canvas,.sample-stage');
 function best(compact){pet.classList.toggle('camera-compact',compact);const r=pet.getBoundingClientRect(),bottom=Math.max(top+80,top+height-r.height-10),right=left+width-r.width-10;const candidates=[];const box=(x,y)=>({left:x,top:y,right:x+r.width,bottom:y+r.height});
  const ys=[bottom,...[...controls,...content].flatMap(c=>[c.top-r.height-8,c.bottom+8])].filter(y=>y>=top+80&&y<=bottom);
  for(const y of ys)candidates.push(box(right,y),box(left+10,y));
  const score=b=>controls.reduce((n,c)=>n+area(b,c)*10000,0)+content.reduce((n,c)=>n+area(b,c),0);
  const chosen=candidates.reduce((a,b)=>score(b)<score(a)?b:a,candidates[0]);return{...chosen,score:score(chosen),compact};
 }
 const chosen=best(false);
 pet.style.left='0';pet.style.top='0';pet.style.right='auto';pet.style.bottom='auto';pet.style.transform='translate('+chosen.left+'px,'+chosen.top+'px)';
}
const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}};for(const e of ['scroll','resize','load'])addEventListener(e,schedule,{passive:true});window.visualViewport?.addEventListener('resize',schedule);window.visualViewport?.addEventListener('scroll',schedule);document.addEventListener('focusin',schedule);document.addEventListener('focusout',schedule);pet.addEventListener('pointerleave',schedule);document.querySelectorAll('dialog').forEach(d=>new MutationObserver(schedule).observe(d,{attributes:true,attributeFilter:['open']}));document.addEventListener('akme:gallery-ready',schedule);update();})();
