import assert from 'node:assert/strict';
import {plans,goals,initialNeeds,recommend,validateNeeds} from '../catalog.mjs';

// Catalog from AKME Site source e4aa8b6f97338fada47cc07544f52fb1100684bf.
assert.deepEqual(plans.map(p=>[p.name,p.price,p.videos,p.campaigns,p.arts,p.stories]),[
 ['SMART',1800,2,0,4,4],['ESENCIAL',2500,4,1,6,6],
 ['COMPLETO',3900,6,2,9,8],['PRO',4900,8,4,11,11],['ELITE',7000,11,6,15,15]
]);
for(const p of plans){
 const n={...initialNeeds,service:goals[p.level].id,videos:p.videos,campaigns:p.campaigns,arts:p.arts,stories:p.stories,budget:p.price};
 assert.equal(recommend(n).plan.id,p.id);
 assert.equal(recommend({...n,budget:p.price-1}).plan,null);
}
assert.equal(recommend({...initialNeeds,budget:0}).plan,null);
assert.equal(recommend({...initialNeeds,videos:16}).plan,null);
assert.equal(recommend({...initialNeeds,extras:['community']}).plan.id,'esencial');
for(const extra of ['photos','branding','oneoff'])assert.equal(recommend({...initialNeeds,extras:[extra]}).plan,null);
assert.throws(()=>validateNeeds({...initialNeeds,videos:-1}));
assert.throws(()=>validateNeeds({...initialNeeds,budget:Infinity}));
assert.throws(()=>validateNeeds({...initialNeeds,extras:['inventado']}));
console.log('AKME: catálogo vigente, límites de presupuesto, extras y validaciones correctos.');
