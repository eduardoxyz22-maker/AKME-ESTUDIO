(()=>{
 const config=window.AKME_SEASON,section=document.querySelector('.halloween-special'),hero=document.querySelector('.hero');if(!config?.enabled||config.theme!=='halloween'||!config.soundAsset||!section||!hero)return;
 const choiceKey='akme:halloween-sound-choice',playKey='akme:halloween-laugh-played';
 const read=key=>{try{return sessionStorage.getItem(key)}catch{return null}};
 const save=(key,value)=>{try{sessionStorage.setItem(key,value)}catch{}};
 let choice=read(choiceKey),phase=read(playKey)?'used':'idle',inView=false,attempted=false,request=0,pending=false,blocked=false;
 const audio=new Audio();audio.preload='none';audio.volume=.35;audio.loop=false;
 const panel=document.createElement('div');panel.className='halloween-laugh';panel.innerHTML='<button type="button" class="halloween-laugh-play">Oír la risita</button><p class="halloween-laugh-status" role="status"></p>';section.querySelector('.halloween-copy').append(panel);
 const button=panel.querySelector('button'),status=panel.querySelector('p');
 const control=document.createElement('button');control.type='button';control.className='halloween-sound-control';control.hidden=true;document.body.append(control);
 function render(){
  const paused=phase==='paused',playing=phase==='playing',finished=phase==='done'||phase==='used';button.hidden=finished||(!playing&&!paused&&!pending&&!blocked&&choice!=='silent');button.disabled=pending;
  button.textContent=playing?'Silenciar risita':paused?'Reanudar risita':pending?'Cargando risita…':choice==='silent'?'Activar y oír risita':'Oír la risita';
  status.textContent=playing?'¡Boo! Sonando una vez.':paused?'Risita pausada.':finished?'La risita ya se inició en esta visita.':blocked?'Tocá el botón para iniciar el sonido.':choice==='silent'?'Sonido desactivado.':'';
  control.hidden=!playing&&!paused;control.textContent=paused?'Reanudar risita':'Silenciar risita';document.dispatchEvent(new Event('akme:gallery-ready'));
 }
 function pause(explicit=false){if(explicit){choice='silent';save(choiceKey,choice);}request++;pending=false;audio.pause();if(phase==='playing')phase='paused';render();}
 async function play(){
  if(pending||phase==='playing'||phase==='done'||phase==='used'||document.hidden)return;
  const current=++request;pending=true;blocked=false;if(!audio.getAttribute('src'))audio.src=config.soundAsset;render();
  try{await audio.play();if(current!==request||document.hidden){audio.pause();return;}pending=false;phase='playing';save(playKey,'started');render();}
  catch{if(current!==request)return;pending=false;blocked=true;render();}
 }
 function maybePlay(){if(inView&&choice!=='silent'&&phase==='idle'&&!attempted&&!document.hidden){attempted=true;play();}}
 function activate(){if(phase==='playing'){pause(true);return;}choice='sound';save(choiceKey,choice);attempted=true;play();}
 button.addEventListener('click',activate);control.addEventListener('click',activate);
 // Observe the character itself: on mobile it appears below the copy.
 const target=section.querySelector('.halloween-art');
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting&&entries[0].intersectionRatio>=.4;maybePlay();},{threshold:[0,.4]}).observe(target);
 audio.addEventListener('ended',()=>{phase='done';save(playKey,'done');render();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&(pending||phase==='playing'))pause();else if(!document.hidden)maybePlay();});addEventListener('pagehide',()=>{if(pending||phase==='playing')pause();});render();
})();
