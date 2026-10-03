// One short, silent preview at a time. Originals are fetched only on entry.
export function initPreviews(root, dialog) {
 const motion=matchMedia('(prefers-reduced-motion: reduce)'), connection=navigator.connection;
 const entries=new Map(); let active=null, timer=0, generation=0;
 const cards=[...root.querySelectorAll('.gallery-card[data-format="video"]')];
 const videos=cards.map(card=>{
  const video=document.createElement('video');video.className='portfolio-preview-video';
  video.muted=true;video.defaultMuted=true;video.playsInline=true;video.preload='none';
  video.setAttribute('aria-hidden','true');video.tabIndex=-1;video.dataset.src=card.getAttribute('href').replace('assets/clientes/','assets/previews/');
  card.querySelector('.gallery-canvas').append(video);
  video.addEventListener('ended',()=>finish(video));
  video.addEventListener('error',()=>finish(video));
  return video;
 });
 function halt(){generation++;clearTimeout(timer);if(active){active.pause();active.classList.remove('is-playing');active=null;}}
 function finish(video){video.dataset.previewDone='true';if(active===video)halt();choose();}
 function choose(){
  const allowed=!motion.matches&&!connection?.saveData&&!document.hidden&&!dialog.open&&!document.documentElement.classList.contains('gallery-is-open');
  const next=allowed?videos.filter(v=>(entries.get(v)||0)>=.55&&!v.dataset.previewDone).sort((a,b)=>entries.get(b)-entries.get(a))[0]:null;
  if(next===active)return;halt();if(!next)return;
  active=next;const token=generation;
  if(!next.src)next.src=next.dataset.src;
  next.currentTime=0;next.muted=true;
  next.play().then(()=>{
   if(token!==generation||active!==next){if(active!==next)next.pause();return;}
   next.classList.add('is-playing');timer=setTimeout(()=>finish(next),5000);
  }).catch(()=>{if(token===generation)finish(next);});
 }
 const observer=new IntersectionObserver(changes=>{for(const entry of changes){const video=entry.target.querySelector('video');entries.set(video,entry.intersectionRatio);if(!entry.isIntersecting)delete video.dataset.previewDone;}choose();},{threshold:[0,.55,.8,1]});
 cards.forEach(card=>observer.observe(card.querySelector('.gallery-canvas')));
 motion.addEventListener('change',choose);connection?.addEventListener?.('change',choose);
 document.addEventListener('visibilitychange',choose);
 document.addEventListener('akme:gallery-open',halt);
 dialog.addEventListener('close',()=>requestAnimationFrame(choose));
 addEventListener('pagehide',halt);
 return {pause:halt};
}
