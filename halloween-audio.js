(()=>{
 const config=window.AKME_SEASON;if(!config?.enabled||config.theme!=='halloween'||!config.soundAsset)return;
 const hero=document.querySelector('.hero');if(!hero)return;
 const key='akme:halloween-sound-choice';try{if(sessionStorage.getItem(key))return;}catch{}
 const welcome=document.createElement('section');welcome.className='halloween-welcome';welcome.setAttribute('aria-label','Bienvenida de Halloween');
 welcome.innerHTML='<div class="wrap"><p><strong>¡Boo! Octubre en AKME.</strong><span>Una risita de bienvenida, si querés.</span></p><div class="halloween-sound-actions"><button type="button" class="sound-yes">Entrar con sonido</button><button type="button" class="sound-no">Entrar sin sonido</button></div><p class="sound-status" role="status"></p></div>';hero.before(welcome);
 const audio=new Audio();audio.preload='none';audio.volume=.35;audio.loop=false;
 const control=document.createElement('button');control.type='button';control.className='halloween-sound-control';control.hidden=true;control.setAttribute('aria-pressed','false');control.textContent='Silenciar risita';document.body.append(control);
 const status=welcome.querySelector('.sound-status');let started=false,request=0;
 const remember=value=>{try{sessionStorage.setItem(key,value);}catch{}};
 function pause(){audio.pause();control.textContent='Reanudar risita';control.setAttribute('aria-pressed','true');}
 async function play(){
  const current=++request;try{await audio.play();if(current!==request||document.hidden){audio.pause();return;}started=true;remember('sound');welcome.hidden=true;control.hidden=false;control.textContent='Silenciar risita';control.setAttribute('aria-pressed','false');document.dispatchEvent(new Event('akme:gallery-ready'));}
  catch{welcome.hidden=false;status.textContent='No se pudo iniciar el audio. Podés continuar sin sonido o volver a intentarlo.';}
 }
 welcome.querySelector('.sound-yes').addEventListener('click',()=>{if(!started)audio.src=config.soundAsset;play();});
 welcome.querySelector('.sound-no').addEventListener('click',()=>{request++;remember('silent');audio.pause();welcome.hidden=true;control.hidden=true;hero.querySelector('a,button')?.focus({preventScroll:true});document.dispatchEvent(new Event('akme:gallery-ready'));});
 control.addEventListener('click',()=>{if(audio.paused)play();else pause();});
 audio.addEventListener('ended',()=>{control.hidden=true;document.dispatchEvent(new Event('akme:gallery-ready'));});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&!audio.paused)pause();});addEventListener('pagehide',()=>{if(started)pause();});
})();
