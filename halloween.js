(()=>{
 const config=window.AKME_SEASON;if(!config?.enabled||config.theme!=='halloween')return;
 const asset=config.ghostAsset;document.documentElement.classList.add('akme-halloween');
 const web=()=>{const e=document.createElement('div');e.className='seasonal-web';e.setAttribute('aria-hidden','true');e.innerHTML='<svg viewBox="0 0 180 180"><path d="M0 0L170 20M0 0L145 80M0 0L85 145M0 0L20 170M45 5Q36 25 5 45M86 10Q70 25 72 40Q44 48 40 72Q20 72 10 86M127 15Q101 40 108 59Q69 75 59 108Q35 99 15 127M166 20Q133 51 144 79Q93 98 79 144Q47 134 20 166"/></svg>';return e;};
 const showreel=document.querySelector('.showreel');
 if(showreel){
  const section=document.createElement('section');section.className='halloween-special';section.id='halloween';section.setAttribute('aria-labelledby','halloween-title');
  section.innerHTML='<div class="wrap halloween-grid"><div class="halloween-copy"><p class="october-label"><span></span> OCTUBRE EN AKME</p><h2 id="halloween-title">QUE TU MARCA<br>NO SEA UN<br><em>FANTASMA.</em></h2><p class="halloween-subtitle">Hacemos que te vean.</p><a class="btn halloween-cta" data-analytics-wa="halloween" href="https://wa.me/59157385254?text=Hola%20AKME%2C%20quiero%20darle%20vida%20a%20mi%20marca" target="_blank" rel="noopener">Dale vida a tu marca</a></div><div class="halloween-art"><img width="512" height="640" alt="El gato de AKME disfrazado de fantasma sostiene su cámara frontal"></div></div>';
  const image=section.querySelector('img');image.src=asset;image.decoding='async';image.loading='lazy';section.append(web());showreel.before(section);
 }else{const intro=document.querySelector('.page-intro');if(intro){intro.classList.add('seasonal-corner');intro.append(web());}}
 const footer=document.querySelector('.foot');if(footer){footer.classList.add('seasonal-footer');footer.append(web());}
 const pet=document.querySelector('.quote-mascot'),image=pet?.querySelector('.camera-figure img'),cue=pet?.querySelector('.camera-cue');
 if(image){const original=image.getAttribute('src');image.addEventListener('error',()=>{image.src=original;pet.classList.remove('seasonal-pet');if(cue)cue.textContent='Sonríe';},{once:true});image.src=asset;image.width=88;image.height=108;pet.classList.add('seasonal-pet');if(cue)cue.textContent='¡Boo! Sonreí';}
})();
