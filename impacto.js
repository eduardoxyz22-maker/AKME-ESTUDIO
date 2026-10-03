(()=>{
 const link=document.querySelector('.impact-logo');if(!link)return;
 const footer=link.closest('.foot'),logo=link.querySelector('img'),cracks=link.querySelector('.impact-cracks'),spark=link.querySelector('.impact-spark');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let animations=[],timer=0,run=0,active=false;
 const settle=()=>{animations.forEach(a=>a.cancel());animations=[];link.classList.remove('impact-ready');link.classList.add('impact-played');};
 const stop=()=>{run++;clearTimeout(timer);timer=0;active=false;settle();};
 const visible=()=>{const r=link.getBoundingClientRect(),f=footer.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&f.bottom<=innerHeight+2;};
 const available=()=>!reduce.matches&&!!logo.animate&&!document.hidden&&visible();
 async function play(){timer=0;if(!available()){stop();return;}settle();const current=run,started=performance.now();link.classList.remove('impact-played');link.classList.add('impact-ready');
  animations=[logo.animate([{transform:'translateY(-44px)',offset:0},{transform:'translateY(-44px)',offset:.12,easing:'cubic-bezier(.5,0,.85,.5)'},{transform:'translateY(0)',offset:.55,easing:'ease-out'},{transform:'translateY(-9px)',offset:.74,easing:'ease-in'},{transform:'translateY(0)',offset:.9},{transform:'translateY(0)',offset:1}],{duration:1300}),cracks.animate([{opacity:0,offset:0},{opacity:0,offset:.53},{opacity:.75,offset:.62},{opacity:.6,offset:1}],{duration:1300,fill:'forwards'}),spark.animate([{opacity:0,offset:0},{opacity:0,offset:.53},{opacity:.65,offset:.6},{opacity:0,offset:.8},{opacity:0,offset:1}],{duration:1300})];
  for(const [i,element] of [...footer.querySelectorAll('.impact-phrase,.footer-contact')].entries()){animations.push(element.animate([{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:300,delay:700+i*80,fill:'both',easing:'ease-out'}));}
  await Promise.all(animations.map(a=>a.finished.catch(()=>{})));if(current!==run)return;settle();if(available())timer=setTimeout(play,Math.max(0,6000-(performance.now()-started)));else stop();
 }
 function schedule(){if(!available()){stop();return;}if(!active){active=true;timer=setTimeout(play,400);}}
 const observer='IntersectionObserver' in window?new IntersectionObserver(schedule,{threshold:[0,.95,1]}):null;observer?.observe(footer);
 reduce.addEventListener('change',schedule);addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('pagehide',stop);addEventListener('pageshow',schedule);document.addEventListener('visibilitychange',schedule);schedule();
})();
