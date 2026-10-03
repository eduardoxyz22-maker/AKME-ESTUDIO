(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let letterAnimations=[],gesture;
 let updatePhrase=()=>{},stopPhrase=()=>{};
 const title=document.querySelector('.impact-message h2');
 if(title){let timer=0,active=false,inView=false;
  for(const word of title.children){const text=word.textContent;word.textContent='';for(const letter of text){const span=document.createElement('i');span.textContent=letter;span.setAttribute('aria-hidden','true');word.append(span)}}
  stopPhrase=()=>{clearTimeout(timer);timer=0;active=false;letterAnimations.forEach(a=>a.cancel());letterAnimations=[];};
  function align(){if(!inView||reduce.matches||document.hidden){stopPhrase();return}letterAnimations.forEach(a=>a.cancel());letterAnimations=[...title.querySelectorAll('i')].map((e,i)=>e.animate([{transform:'translate('+(i%3-1)*5+'px,'+(i%2?9:-7)+'px) rotate('+(i%2?3:-3)+'deg)',opacity:.82},{transform:'none',opacity:1}],{duration:2100,delay:i*18,easing:'cubic-bezier(.22,.55,.3,1)'}));timer=setTimeout(align,6000);}
  updatePhrase=()=>{if(!inView||reduce.matches||document.hidden){stopPhrase();return}if(!active){active=true;align()}};
  const observer=new IntersectionObserver(es=>{inView=es[0].isIntersecting&&es[0].intersectionRatio>=.65;updatePhrase()},{threshold:[0,.65]});observer.observe(title);
  reduce.addEventListener('change',updatePhrase);document.addEventListener('visibilitychange',updatePhrase);addEventListener('pageshow',updatePhrase);
 }
 const process=document.querySelector('.creative-process');if(process){const steps=[...process.querySelectorAll('.process-step')],tabs=[...process.querySelectorAll('.process-tabs span')];process.classList.add('process-enhanced');let queued=false;function highlight(){queued=false;const best=steps.map((e,i)=>({i,d:Math.abs(e.getBoundingClientRect().top+e.offsetHeight/2-innerHeight*.52)})).sort((a,b)=>a.d-b.d)[0].i;steps.forEach((e,i)=>e.classList.toggle('is-current',i===best));tabs.forEach((e,i)=>e.setAttribute('aria-current',String(i===best)))}function schedule(){if(!queued){queued=true;requestAnimationFrame(highlight)}}addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);highlight();}
 if(process){
  const steps=[...process.querySelectorAll('.process-step')];let queued=false;
  function motion(){queued=false;const candidates=steps.filter(e=>{const r=e.querySelector('.process-graphic').getBoundingClientRect();return r.top<innerHeight*.9&&r.bottom>innerHeight*.1});const selected=candidates.sort((a,b)=>Math.abs(a.getBoundingClientRect().top+a.offsetHeight/2-innerHeight*.52)-Math.abs(b.getBoundingClientRect().top+b.offsetHeight/2-innerHeight*.52))[0];steps.forEach(e=>e.classList.toggle('motion-active',!document.hidden&&!reduce.matches&&e===selected));}
  function scheduleMotion(){if(!queued){queued=true;requestAnimationFrame(motion)}}
  addEventListener('scroll',scheduleMotion,{passive:true});addEventListener('resize',scheduleMotion);document.addEventListener('visibilitychange',motion);reduce.addEventListener('change',motion);addEventListener('pagehide',()=>steps.forEach(e=>e.classList.remove('motion-active')));addEventListener('pageshow',motion);motion();
 }
 const selector='.home-character,.character-intro .intro-character,.services-intro-art';
 document.querySelectorAll(selector).forEach(img=>{const src=img.getAttribute('src');const animal=src.includes('zorro')?'zorro':src.includes('panda')?'panda':src.includes('mapache')?'mapache':'conejo';img.classList.add('mascot-reactive');img.setAttribute('role','button');img.tabIndex=0;img.setAttribute('aria-label','Animar '+animal);function play(){gesture?.cancel();if(reduce.matches||document.hidden)return;const frames={zorro:['rotate(0)','rotate(-7deg)','rotate(2deg)','rotate(0)'],panda:['translateY(0) rotate(0)','translateY(-5px) rotate(5deg)','translateY(-2px) rotate(-3deg)','none'],mapache:['rotate(0)','rotate(6deg)','rotate(-2deg)','none'],conejo:['translateY(0)','translateY(-10px)','translateY(2px)','none']}[animal];gesture=img.animate(frames.map(transform=>({transform})),{duration:650,easing:'ease-in-out'});}img.addEventListener('click',play);img.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();play()}});});
 function stop(){stopPhrase();gesture?.cancel();}reduce.addEventListener('change',()=>{if(reduce.matches)stop()});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});addEventListener('pagehide',stop);
})();
