export function initGalleryDetail(dialog,media,title){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let scale=1,x=0,y=0,image=null,transition=null,pinch=null;const points=new Map();
 const identity=document.createElement('img');identity.className='gallery-client-identity';identity.alt='';identity.width=48;identity.height=48;identity.hidden=true;title.before(identity);
 const controls=document.createElement('div');controls.className='gallery-zoom';controls.setAttribute('role','group');controls.setAttribute('aria-label','Zoom de la imagen');
 const button=(text,label,action)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.setAttribute('aria-label',label);b.addEventListener('click',action);controls.append(b);return b;};
 const minus=button('−','Alejar imagen',()=>set(scale-.5)),reset=button('100%','Restablecer zoom',()=>set(1)),plus=button('+','Acercar imagen',()=>set(scale+.5));title.after(controls);controls.hidden=true;
 function paint(){if(!image)return;const w=image.offsetWidth,h=image.offsetHeight;x=Math.max(-w*(scale-1)/2,Math.min(w*(scale-1)/2,x));y=Math.max(-h*(scale-1)/2,Math.min(h*(scale-1)/2,y));image.style.transform=`translate(${x}px,${y}px) scale(${scale})`;media.classList.toggle('is-zoomed',scale>1);reset.textContent=Math.round(scale*100)+'%';minus.disabled=scale===1;plus.disabled=scale===3;}
 function set(value){scale=Math.max(1,Math.min(3,value));if(scale===1)x=y=0;paint();}
 function clear(){points.clear();pinch=null;scale=1;x=y=0;if(image)image.style.transform='';image=null;media.classList.remove('is-zoomed');controls.hidden=true;}
 function prepare(element,brand){clear();identity.hidden=!brand.id;if(brand.id)identity.src=`assets/clientes/${brand.id}-marca.webp`;if(element.tagName==='IMG'){image=element;image.draggable=false;image.classList.add('gallery-zoom-image');controls.hidden=false;paint();}}
 media.addEventListener('pointerdown',e=>{if(!image||e.target!==image)return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});if(scale>1||points.size===2)image.setPointerCapture(e.pointerId);if(points.size===2){const [a,b]=[...points.values()];pinch={distance:Math.hypot(a.x-b.x,a.y-b.y),scale};}});
 media.addEventListener('pointermove',e=>{if(!points.has(e.pointerId)||!image)return;const old=points.get(e.pointerId);points.set(e.pointerId,{x:e.clientX,y:e.clientY});if(points.size===2&&pinch){const [a,b]=[...points.values()];set(pinch.scale*Math.hypot(a.x-b.x,a.y-b.y)/Math.max(1,pinch.distance));}else if(scale>1){x+=e.clientX-old.x;y+=e.clientY-old.y;paint();}});
 const release=e=>{points.delete(e.pointerId);if(points.size<2)pinch=null;};media.addEventListener('pointerup',release);media.addEventListener('pointercancel',release);
 dialog.addEventListener('keydown',e=>{if(!image||e.target.matches('input,select,textarea,video'))return;if(['+','=','-','0'].includes(e.key)){e.preventDefault();set(e.key==='0'?1:scale+(e.key==='-'?-.5:.5));}});
 function enter(source){transition?.cancel();if(reduce.matches||!source)return;const a=source.getBoundingClientRect(),b=dialog.getBoundingClientRect();const s=Math.max(.25,Math.min(.7,a.width/b.width));transition=dialog.animate([{transform:`translate(${a.x+a.width/2-b.x-b.width/2}px,${a.y+a.height/2-b.y-b.height/2}px) scale(${s})`,opacity:.35},{transform:'none',opacity:1}],{duration:240,easing:'cubic-bezier(.2,.7,.2,1)'});}
 dialog.addEventListener('close',()=>{transition?.cancel();clear();});reduce.addEventListener('change',()=>{if(reduce.matches)transition?.cancel();});
 return {prepare,enter,get zoomed(){return scale>1||points.size>1;}};
}
