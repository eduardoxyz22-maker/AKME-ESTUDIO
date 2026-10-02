(()=>{
 const link=document.querySelector('.impact-logo');if(!link)return;
 const logo=link.querySelector('img'),cracks=link.querySelector('.impact-cracks'),spark=link.querySelector('.impact-spark');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),key='akme:footer-impact:v1:'+location.pathname;let played=false,animations=[];
 try{played=sessionStorage.getItem(key)==='1';}catch{}
 const settle=()=>{animations.forEach(a=>a.cancel());animations=[];link.classList.remove('impact-ready');link.classList.add('impact-played');};
 const remember=()=>{played=true;try{sessionStorage.setItem(key,'1');}catch{}};
 if(played||reduce.matches||!logo.animate){link.classList.add('impact-played');return;}
 link.classList.add('impact-ready');
 function play(){if(played||document.hidden)return;remember();observer?.disconnect();
  if(reduce.matches||link===document.activeElement){settle();return;}
  animations=[logo.animate([{transform:'translateY(-30px)',offset:0,easing:'cubic-bezier(.5,0,.85,.5)'},{transform:'translateY(0)',offset:.52,easing:'ease-out'},{transform:'translateY(-7px)',offset:.72,easing:'ease-in'},{transform:'translateY(0)',offset:.9},{transform:'translateY(0)',offset:1}],{duration:760}),cracks.animate([{opacity:0,offset:0},{opacity:0,offset:.5},{opacity:.75,offset:.58},{opacity:.6,offset:1}],{duration:760,fill:'forwards'}),spark.animate([{opacity:0,offset:0},{opacity:0,offset:.5},{opacity:.65,offset:.57},{opacity:0,offset:.85},{opacity:0,offset:1}],{duration:760})];
  Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(settle);
 }
 const visible=()=>{const r=link.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;};
 const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))play();},{threshold:1}):null;
 observer?.observe(link);if(!observer)link.classList.remove('impact-ready');
 reduce.addEventListener('change',()=>{if(reduce.matches){remember();observer?.disconnect();settle();}});
 link.addEventListener('focus',()=>{if(animations.length)settle();});
 addEventListener('pagehide',settle);addEventListener('pageshow',()=>{if(played)settle();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&animations.length)settle();else if(!document.hidden&&visible())play();});
})();
