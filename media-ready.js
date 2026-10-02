(()=>{
 const seen=new WeakSet(),reduce=matchMedia('(prefers-reduced-motion:reduce)');
 function observe(){document.querySelectorAll('.gallery-canvas img,.brand-signature img,.sample-stage img,.highlight img,.own-piece img').forEach(img=>{
  if(seen.has(img))return;seen.add(img);
  // Cached images and no-JS content remain immediately visible.
  if(img.complete)return;
  img.addEventListener('load',()=>{if(!reduce.matches){img.classList.add('media-ready');img.addEventListener('animationend',()=>img.classList.remove('media-ready'),{once:true});}},{once:true});
 });}
 observe();document.addEventListener('akme:gallery-ready',observe);
})();
