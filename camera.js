(()=>{
 const pet=document.querySelector('.quote-mascot'),figure=pet?.querySelector('.camera-figure'),flash=pet?.querySelector('.camera-glint'),label=pet?.querySelector('span');if(!figure||!flash)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let timer=0,animations=[],visible=true;
 const stop=()=>{clearTimeout(timer);animations.forEach(a=>a.cancel());animations=[];};
 const available=()=>!reduce.matches&&!document.hidden&&visible&&pet.getAttribute('aria-hidden')!=='true'&&!pet.matches(':hover,:focus')&&!document.activeElement?.matches('input,textarea,select');
 function schedule(){stop();if(available())timer=setTimeout(play,14000);}
 function play(){if(!available()){schedule();return;}
  animations=[figure.animate([{transform:'translateY(0) rotate(0)'},{transform:'translateY(-1px) rotate(-1deg)',offset:.4},{transform:'translateY(0) rotate(0)'}],{duration:800,easing:'ease-in-out'}),flash.animate([{opacity:0,transform:'scale(.65)'},{opacity:.65,transform:'scale(1)',offset:.4},{opacity:0,transform:'scale(1.15)'}],{duration:620,easing:'ease-in-out'}),label.animate([{boxShadow:'0 0 0 0 rgba(162,212,11,0)'},{boxShadow:'0 0 0 4px rgba(162,212,11,.18)',offset:.5},{boxShadow:'0 0 0 6px rgba(162,212,11,0)'}],{duration:1000,easing:'ease-out'})];
  Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(schedule);
 }
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();}).observe(pet);
 new MutationObserver(schedule).observe(pet,{attributes:true,attributeFilter:['aria-hidden']});
 for(const name of ['pointerenter','pointerleave','focus','blur'])pet.addEventListener(name,schedule);
 for(const name of ['visibilitychange','focusin','focusout'])document.addEventListener(name,schedule);
 reduce.addEventListener('change',schedule);addEventListener('pagehide',stop);addEventListener('pageshow',schedule);schedule();
})();
