(()=>{
 const link=document.querySelector('.impact-logo');if(!link)return;
 const footer=link.closest('.foot'),logo=link.querySelector('img'),cracks=link.querySelector('.impact-cracks'),spark=link.querySelector('.impact-spark'),button=link.parentElement.querySelector('.impact-replay');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let played=false,animations=[],timer=0,run=0;
 const settle=()=>{run++;clearTimeout(timer);animations.forEach(a=>a.cancel());animations=[];link.classList.remove('impact-ready');link.classList.add('impact-played');};
 const available=()=>!reduce.matches&&!!logo.animate;
 const visible=()=>{const r=link.getBoundingClientRect(),f=footer.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&f.bottom<=innerHeight+2;};
 async function play(){clearTimeout(timer);if(!available()||document.hidden){settle();return;}settle();const current=run;played=true;link.classList.remove('impact-played');link.classList.add('impact-ready');
  animations=[logo.animate([{transform:'translateY(-44px)',offset:0},{transform:'translateY(-44px)',offset:.12,easing:'cubic-bezier(.5,0,.85,.5)'},{transform:'translateY(0)',offset:.55,easing:'ease-out'},{transform:'translateY(-9px)',offset:.74,easing:'ease-in'},{transform:'translateY(0)',offset:.9},{transform:'translateY(0)',offset:1}],{duration:1300}),cracks.animate([{opacity:0,offset:0},{opacity:0,offset:.53},{opacity:.75,offset:.62},{opacity:.6,offset:1}],{duration:1300,fill:'forwards'}),spark.animate([{opacity:0,offset:0},{opacity:0,offset:.53},{opacity:.65,offset:.6},{opacity:0,offset:.8},{opacity:0,offset:1}],{duration:1300})];
  for(const [i,element] of [...footer.querySelectorAll('.impact-phrase,.footer-contact')].entries()){animations.push(element.animate([{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:300,delay:700+i*80,fill:'both',easing:'ease-out'}));}
  await Promise.all(animations.map(a=>a.finished.catch(()=>{})));if(current===run)settle();
 }
 function schedule(){clearTimeout(timer);if(played||!available()||document.hidden||!visible())return;timer=setTimeout(()=>{if(visible()&&!played)play();},400);}
 const observer='IntersectionObserver' in window?new IntersectionObserver(schedule,{threshold:[.95,1]}):null;
 if(available()){link.classList.add('impact-ready');observer?.observe(footer);}else settle();
 if(button){button.hidden=!available();button.addEventListener('click',()=>play());}
 link.addEventListener('click',async e=>{if(e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||!available())return;e.preventDefault();await play();location.assign(link.href);});
 reduce.addEventListener('change',()=>{if(button)button.hidden=!available();if(reduce.matches)settle();else schedule();});
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('pagehide',settle);addEventListener('pageshow',schedule);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)settle();else schedule();});
})();
