(()=>{
 const pet=document.querySelector('.quote-mascot'),figure=pet?.querySelector('.camera-figure'),flash=pet?.querySelector('.camera-glint'),label=pet?.querySelector('span');if(!figure||!flash)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),period=10000;let timer=0,animations=[],visible=true,generation=0,pendingResolve;
 const stop=()=>{generation++;clearTimeout(timer);pendingResolve?.(false);pendingResolve=null;animations.forEach(a=>a.cancel());animations=[];};
 const available=()=>!reduce.matches&&!document.hidden&&visible&&pet.getAttribute('aria-hidden')!=='true'&&!pet.matches(':hover,:focus')&&!document.activeElement?.matches('input,textarea,select');
 function arm(delay=period){stop();if(available())timer=setTimeout(play,Math.max(0,delay));}
 const schedule=()=>arm();
 const pause=ms=>new Promise(resolve=>{pendingResolve=resolve;timer=setTimeout(()=>{pendingResolve=null;resolve(true);},ms);});
 async function play(){
  if(!available()){schedule();return;}stop();const run=generation,started=performance.now();
  animations=[figure.animate([{transform:'translateY(0) rotate(0)'},{transform:'translateY(-4px) rotate(-4deg)',offset:.3},{transform:'translateY(-1px) rotate(2deg)',offset:.52},{transform:'translateY(0) rotate(0)',offset:.8},{transform:'translateY(0) rotate(0)'}],{duration:1000,easing:'ease-in-out'})];
  await animations[0].finished.catch(()=>{});if(run!==generation)return;animations=[];
  if(!await pause(350)||run!==generation)return;if(!available()){schedule();return;}
  // The figure is fully at rest before taking the photo.
  animations=[flash.animate([{opacity:0,transform:'scale(.65)'},{opacity:1,transform:'scale(1)',offset:.35},{opacity:1,transform:'scale(1)',offset:.48},{opacity:0,transform:'scale(1.15)'}],{duration:1000,easing:'ease-in-out'}),label.animate([{boxShadow:'0 0 0 0 rgba(162,212,11,0)'},{boxShadow:'0 0 0 4px rgba(162,212,11,.18)',offset:.5},{boxShadow:'0 0 0 6px rgba(162,212,11,0)'}],{duration:1000,easing:'ease-out'})];
  await Promise.all(animations.map(a=>a.finished.catch(()=>{})));if(run===generation)arm(period-(performance.now()-started));
 }
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();}).observe(pet);
 new MutationObserver(schedule).observe(pet,{attributes:true,attributeFilter:['aria-hidden']});
 for(const name of ['pointerenter','pointerleave','focus','blur'])pet.addEventListener(name,schedule);
 for(const name of ['visibilitychange','focusin','focusout'])document.addEventListener(name,schedule);
 reduce.addEventListener('change',schedule);addEventListener('pagehide',stop);addEventListener('pageshow',schedule);schedule();
})();
