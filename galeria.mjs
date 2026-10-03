import {initGalleryDetail} from './gallery-detail.mjs?v=20261003-detail1';
import {initPreviews} from './portfolio-preview.mjs?v=20261003-preview1';
import {galleryMarkup} from './portfolio-view.mjs?v=20261003-portfolio2';
const data=await fetch('portfolio.json?v=20261003-portfolio2').then(r=>{if(!r.ok)throw Error('No se pudo cargar el portafolio');return r.json();});
const root=document.getElementById('brand-galleries');
root.innerHTML=galleryMarkup(data);
document.dispatchEvent(new Event('akme:gallery-ready'));
const dlg=document.getElementById('gallery-viewer'),media=document.getElementById('gallery-media'),title=document.getElementById('gallery-title'),description=document.getElementById('gallery-description'),count=document.getElementById('gallery-count'),thumbs=document.getElementById('gallery-thumbs');
const historyToken='akme-gallery-'+Date.now();
initPreviews(root,dlg);
const detail=initGalleryDetail(dlg,media,title);
let current,idx=0,opener,touch;
const stop=()=>{const video=media.querySelector('video');if(video){video.pause();video.removeAttribute('src');video.load();}};
function show(autoplay=false){
 stop();const item=current.items[idx];title.textContent=current.name+' · '+item.title;description.textContent=item.description||current.context;count.textContent=`${idx+1} de ${current.items.length}`;media.replaceChildren();
 const element=document.createElement(item.type==='video'?'video':'img');
 if(item.type==='video'){element.controls=true;element.playsInline=true;element.preload='metadata';element.poster=item.poster;element.setAttribute('aria-label',item.title);}else{element.alt=item.alt;}
 element.src=item.src;media.append(element);detail.prepare(element,current);
 if(item.type==='video'&&autoplay){element.muted=false;element.play().catch(()=>{/* Native controls remain available if playback is restricted. */});}
 thumbs.replaceChildren(...current.items.map((item,i)=>{const b=document.createElement('button');b.type='button';b.textContent=String(i+1).padStart(2,'0');b.setAttribute('aria-label',`Ver pieza ${i+1}: ${item.title}`);b.setAttribute('aria-current',String(idx===i));b.addEventListener('click',()=>{idx=i;show(true);thumbs.children[i].focus();});return b;}));
}
function open(brand,index,source){current=brand;idx=index;opener=source;document.dispatchEvent(new Event('akme:gallery-open'));show(true);history.pushState({...history.state,akmeGallery:historyToken},'',location.href);document.documentElement.classList.add('gallery-is-open');dlg.showModal();detail.enter(source);dlg.querySelector('.gallery-close').focus();}
function move(step){idx=(idx+step+current.items.length)%current.items.length;show(true);}
root.addEventListener('click',e=>{const b=e.target.closest('[data-brand]');if(!b||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();open(data.find(x=>x.id===b.dataset.brand),Number(b.dataset.index),b);});
// Touch navigation must also work immediately after a captured pan gesture.
function bindStep(id,step){const button=document.getElementById(id);let lastTouch=-Infinity;
 button.addEventListener('pointerup',e=>{if(!['touch','pen'].includes(e.pointerType))return;e.preventDefault();lastTouch=performance.now();move(step);});
 button.addEventListener('click',e=>{if(e.detail!==0&&performance.now()-lastTouch<700)return;move(step);});
}
bindStep('gallery-prev',-1);bindStep('gallery-next',1);
function close(){if(history.state?.akmeGallery===historyToken)history.back();else dlg.close();}
dlg.querySelector('.gallery-close').addEventListener('click',close);
dlg.addEventListener('cancel',e=>{e.preventDefault();close();});
dlg.addEventListener('click',e=>{if(e.target===dlg)close();});
dlg.addEventListener('close',()=>{stop();touch=null;media.replaceChildren();document.documentElement.classList.remove('gallery-is-open');opener?.focus({preventScroll:true});});
addEventListener('popstate',()=>{if(history.state?.akmeGallery!==historyToken){if(dlg.open){dlg.close();requestAnimationFrame(()=>opener?.focus({preventScroll:true}));}}else if(current&&!dlg.open){document.dispatchEvent(new Event('akme:gallery-open'));show();document.documentElement.classList.add('gallery-is-open');dlg.showModal();dlg.querySelector('.gallery-close').focus();}});
dlg.addEventListener('keydown',e=>{if(e.target.tagName==='VIDEO')return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
media.addEventListener('pointerdown',e=>{
 if(detail.zoomed||!e.isPrimary||!['touch','pen'].includes(e.pointerType))return;
 // Leave native video seek/volume/fullscreen controls to the browser.
 if(e.target.tagName==='VIDEO'&&e.clientY>e.target.getBoundingClientRect().bottom-64)return;
 touch={id:e.pointerId,x:e.clientX,y:e.clientY};
});
media.addEventListener('pointerup',e=>{if(detail.zoomed){touch=null;return;}if(!touch||touch.id!==e.pointerId)return;const dx=e.clientX-touch.x,dy=e.clientY-touch.y;touch=null;if(Math.abs(dx)>=50&&Math.abs(dx)>Math.abs(dy)*1.5)move(dx<0?1:-1);});
media.addEventListener('pointercancel',()=>{touch=null;});
document.querySelectorAll('[data-own-images]').forEach(button=>button.addEventListener('click',()=>{const items=button.dataset.ownImages.split(',').map(src=>({type:'image',src,title:button.dataset.title,alt:button.dataset.title,description:'Pieza de comunicación de AKME Estudio.'}));open({name:'Dentro de AKME',items},0,button);}));
if(location.hash.startsWith('#proyecto-'))document.getElementById(location.hash.slice(1))?.scrollIntoView();
