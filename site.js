(()=>{
 const wa=text=>'https://wa.me/59157385254?text='+encodeURIComponent(text);
 document.querySelectorAll('[data-wa]').forEach(a=>{a.href=wa(a.dataset.wa);a.target='_blank';a.rel='noopener';});
 const button=document.getElementById('menu-btn'),panel=document.getElementById('menu-panel');
 function menu(open){panel.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');}
 button?.addEventListener('click',()=>menu(button.getAttribute('aria-expanded')!=='true'));
 panel?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu(false)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&button?.getAttribute('aria-expanded')==='true'){menu(false);button.focus();}});
 const cmpButton=document.getElementById('compare-btn'),cmp=document.getElementById('compare');
 cmpButton?.addEventListener('click',()=>{cmp.hidden=!cmp.hidden;cmpButton.setAttribute('aria-expanded',String(!cmp.hidden));cmpButton.firstChild.textContent=cmp.hidden?'Comparar todos los detalles ':'Ocultar la comparativa ';if(!cmp.hidden)cmp.querySelector('.table-scroll').focus({preventScroll:true});});
 const form=document.getElementById('brief'),err=document.getElementById('f-err');
 form?.addEventListener('submit',e=>{e.preventDefault();const nombre=form.nombre.value.trim();if(!nombre){err.hidden=false;form.nombre.setAttribute('aria-invalid','true');form.nombre.focus();return;}err.hidden=true;form.nombre.removeAttribute('aria-invalid');const marca=form.marca.value.trim(),detalle=form.detalle.value.trim(),lines=['Hola AKME, soy '+nombre+(marca?' de '+marca:'')+'.','Necesito: '+form.necesidad.value+'.'];if(form.paquete.value)lines.push('Me interesa el paquete '+form.paquete.value+'.');if(detalle)lines.push(detalle);window.akmeAnalytics?.whatsapp('brief',form.paquete.selectedOptions[0]?.dataset.analyticsPackage||'none');window.open(wa(lines.join('\n')),'_blank','noopener');});
 const copy=document.getElementById('copy-mail');copy?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText('akmeestudio1@gmail.com');copy.textContent='Copiado';}catch{const range=document.createRange();range.selectNodeContents(document.getElementById('mail'));const selected=window.getSelection();selected.removeAllRanges();selected.addRange(range);copy.textContent='Seleccionado';}});
 if(document.body.dataset.page==='inicio'){
  const legacy={'#cotizador':'planes.html#cotizador','#paquetes':'planes.html#paquetes','#trabajos':'portafolio.html','#servicios':'servicios.html','#proceso':'servicios.html#proceso','#diferenciadores':'servicios.html','#faq':'servicios.html#faq'};
  const route=()=>{if(legacy[location.hash])location.replace(legacy[location.hash]);};window.addEventListener('hashchange',route);route();
 }
})();
