import {plans,goals,initialNeeds,extraLabels,formatPrice,gaps,recommend,validateNeeds} from './catalog.mjs';
const root=document.getElementById('cotizador');
const $=id=>document.getElementById(id);
const fields=[['videos','Reels',16],['campaigns','Campañas Meta Ads',8],['arts','Artes comerciales',20],['stories','Historias',20]];
let needs=structuredClone(initialNeeds),inspected='',custom=false;
$('quote-goals').innerHTML=goals.map(g=>`<label><input type="radio" name="quote-goal" value="${g.id}"><span><strong>${g.title}</strong><small>${g.desc}</small></span></label>`).join('');
$('quote-quantities').innerHTML=fields.map(([key,label,max])=>`<div class="quote-quantity"><label for="quote-${key}">${label}</label><div class="quote-stepper"><button type="button" data-key="${key}" data-delta="-1" aria-label="Reducir ${label.toLowerCase()}">−</button><output id="quote-count-${key}" for="quote-${key}">0</output><button type="button" data-key="${key}" data-delta="1" aria-label="Aumentar ${label.toLowerCase()}">+</button></div><input id="quote-${key}" data-key="${key}" type="range" min="0" max="${max}" step="1"><div class="quote-limits"><span>0</span><span>${max}</span></div></div>`).join('');
$('quote-extras').innerHTML=Object.entries(extraLabels).map(([key,label])=>`<label><input type="checkbox" value="${key}">${label}</label>`).join('');
plans.forEach(p=>{const o=document.createElement('option');o.value=p.id;o.textContent=`${p.name} · ${formatPrice(p.price)} / mes`;$('quote-inspect').append(o);});
function selection(){const result=recommend(needs),selected=plans.find(p=>p.id===inspected)||result.plan;return{result,selected,valid:!!selected&&!gaps(selected,needs).length};}
function summary(personal=false){const {selected,valid}=selection();return `AKME ESTUDIO · ${!personal&&valid?selected.name:'Propuesta personalizada'}\nObjetivo: ${goals.find(g=>g.id===needs.service).title} · Plan mensual\nNecesidades: ${needs.videos} reels, ${needs.campaigns} campañas, ${needs.arts} artes, ${needs.stories} historias.\n${needs.budget!==null?`Presupuesto: ${formatPrice(needs.budget)}\n`:''}${needs.extras.length?`Servicios adicionales: ${needs.extras.map(x=>extraLabels[x]).join(', ')}\n`:''}${!personal&&valid?`Entregables: ${selected.details.join(' · ')}\nPrecio: ${formatPrice(selected.price)} / mes\n`:'Precio: a cotizar según alcance.\n'}${$('quote-note').value.trim()?`Detalle: ${$('quote-note').value.trim()}\n`:''}La inversión publicitaria se paga aparte. Estimación orientativa. Confirmar alcance y disponibilidad con AKME.`;}
function updateLinks(){const wa=text=>'https://wa.me/59157385254?text='+encodeURIComponent(text);$('quote-wa').href=wa(summary());$('quote-custom-wa').href=wa(summary(true));}
function render(){
 const {result,selected,valid}=selection();
 root.querySelectorAll('[name="quote-goal"]').forEach(r=>r.checked=r.value===needs.service);
 fields.forEach(([key,,max])=>{const range=$('quote-'+key);range.value=needs[key];$('quote-count-'+key).textContent=needs[key];root.querySelectorAll(`[data-delta][data-key="${key}"]`).forEach(b=>b.disabled=Number(b.dataset.delta)<0?needs[key]===0:needs[key]===max);});
 $('quote-budget').value=needs.budget??'';
 $('quote-extras').querySelectorAll('input').forEach(c=>c.checked=needs.extras.includes(c.value));
 $('quote-inspect').value=inspected;
 $('quote-status').textContent=inspected?'PAQUETE EN COMPARACIÓN':result.plan?'TU RECOMENDACIÓN':'SEGÚN TU ALCANCE';
 $('quote-name').textContent=selected?selected.name:'A tu medida.';
 $('quote-focus').textContent=selected?selected.focus:'Propuesta personalizada';
 $('quote-price').textContent=selected?formatPrice(selected.price)+' / mes':'A cotizar';
 $('quote-reason').textContent=inspected?(valid?`${selected.name} cubre tu selección.${result.plan?.id!==selected.id?` La opción de menor precio que encaja es ${result.plan.name}.`:''}`:`Este paquete no cubre toda tu selección: ${gaps(selected,needs).join('; ').toLowerCase()}.`):result.reason;
 $('quote-details').replaceChildren(...(selected?selected.details:[]).map(d=>{const li=document.createElement('li');li.textContent=d;return li;}));
 $('quote-details').hidden=!selected;
 $('quote-wa').hidden=!valid;$('quote-copy').hidden=!valid;
 $('quote-custom').hidden=!(custom||!result.plan);
 $('quote-custom-selection').textContent=`${needs.videos} reels · ${needs.campaigns} campañas · ${needs.arts} artes · ${needs.stories} historias${needs.extras.length?' · '+needs.extras.map(x=>extraLabels[x]).join(' · '):''}`;
 $('quote-copy-status').textContent='';$('quote-fallback').hidden=true;
 updateLinks();
}
function update(patch){needs=validateNeeds({...needs,...patch});inspected='';render();}
root.addEventListener('input',e=>{const t=e.target;if(t.matches('input[type="range"]'))update({[t.dataset.key]:Number(t.value)});if(t.id==='quote-budget')update({budget:t.value===''?null:Math.max(0,Number(t.value)||0)});if(t.id==='quote-note'){updateLinks();$('quote-copy-status').textContent='';$('quote-fallback').hidden=true;}});
root.addEventListener('change',e=>{const t=e.target;if(t.name==='quote-goal')update({service:t.value});if(t.closest('#quote-extras'))update({extras:[...$('quote-extras').querySelectorAll('input:checked')].map(c=>c.value)});if(t.id==='quote-inspect'){inspected=t.value;render();}});
root.addEventListener('click',e=>{const b=e.target.closest('[data-delta]');if(b)update({[b.dataset.key]:needs[b.dataset.key]+Number(b.dataset.delta)});});
$('quote-reset').addEventListener('click',()=>{needs=structuredClone(initialNeeds);inspected='';custom=false;$('quote-note').value='';render();});
$('quote-open-custom').addEventListener('click',()=>{custom=true;render();$('quote-custom').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});$('quote-note').focus({preventScroll:true});});
async function copy(personal){const text=summary(personal);try{await navigator.clipboard.writeText(text);$('quote-copy-status').textContent='Resumen copiado.';}catch{$('quote-fallback').hidden=false;$('quote-fallback-text').value=text;$('quote-fallback-text').focus();$('quote-fallback-text').select();$('quote-copy-status').textContent='Podés copiar el resumen seleccionado.';}}
$('quote-copy').addEventListener('click',()=>copy(false));$('quote-custom-copy').addEventListener('click',()=>copy(true));
render();
