(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const seen=new WeakSet();
 const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{for(const {target,isIntersecting} of entries){if(!isIntersecting)continue;observer.unobserve(target);if(!reduce.matches&&target.animate)target.animate([{opacity:.35,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:480,easing:'cubic-bezier(.2,.7,.3,1)'});}},{threshold:.08}):null;
 function observe(){document.querySelectorAll('.section-topline,.gallery-heading,.gallery-card,.service-grid article,.plan,.showreel-heading').forEach(el=>{if(!seen.has(el)){seen.add(el);observer?.observe(el);}});}
 observe();document.addEventListener('akme:gallery-ready',observe);
 reduce.addEventListener('change',()=>{if(reduce.matches)document.getAnimations().forEach(a=>a.cancel());});
 function syncPlans(){const id=document.getElementById('quote-inspect')?.value;let name='';document.querySelectorAll('.plan-select').forEach(other=>{const selected=other.dataset.plan===id;other.setAttribute('aria-pressed',String(selected));other.closest('.plan').classList.toggle('is-selected',selected);other.textContent=(selected?'Seleccionado: ':'Seleccionar ')+other.dataset.name;if(selected)name=other.dataset.name;});const status=document.getElementById('plan-selection-status');if(status)status.textContent=name?name+' seleccionado para comparar en el cotizador.':'Seleccioná un plan para compararlo con tus necesidades.';}
 document.querySelectorAll('.plan-select').forEach(button=>button.addEventListener('click',()=>{
  const inspect=document.getElementById('quote-inspect');if(inspect){inspect.value=button.dataset.plan;inspect.dispatchEvent(new Event('change',{bubbles:true}));}
  syncPlans();
 }));
 const quote=document.getElementById('cotizador');for(const event of ['input','change','click'])quote?.addEventListener(event,()=>queueMicrotask(syncPlans));
 document.querySelectorAll('[data-reel-play]').forEach(button=>{const video=document.getElementById(button.getAttribute('aria-controls'));if(!video)return;video.controls=false;button.hidden=false;
  button.addEventListener('click',async()=>{video.controls=true;try{await video.play();video.focus({preventScroll:true});}catch{video.controls=true;video.focus();}});
  video.addEventListener('play',()=>button.hidden=true);video.addEventListener('pause',()=>button.hidden=false);video.addEventListener('ended',()=>button.hidden=false);
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)document.querySelectorAll('.showreel video').forEach(v=>v.pause());});
})();
