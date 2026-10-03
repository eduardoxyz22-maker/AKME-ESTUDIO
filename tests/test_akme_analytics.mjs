import {chromium} from 'playwright';
import {createServer} from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const mime={'.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json'};
const server=createServer((req,res)=>{const file=path.join(process.cwd(),new URL(req.url,'http://localhost').pathname);try{res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404).end();}}).listen(0,'127.0.0.1');
await new Promise(r=>server.once('listening',r));
const base=`http://127.0.0.1:${server.address().port}/`;
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const realTag=process.env.AKME_REAL_GA==='1';
const requests=[],payloads=[],errors=[],allCommands=[];
await context.route('**/*',async route=>{
 const req=route.request(),url=req.url();
 if(/google-analytics\.com|googletagmanager\.com/.test(url))requests.push(url);
 if(/google-analytics\.com|\/g\/collect/.test(url)){
   payloads.push(url+'\n'+(req.postData()||''));await route.fulfill({status:204});
 }else if(url.startsWith('https://www.googletagmanager.com/gtag/js?')&&!realTag)await route.fulfill({contentType:'text/javascript',body:'/* Offline test: Google execution is deliberately not simulated. */'});
 else if(url.startsWith(base)||url.startsWith('https://www.googletagmanager.com/gtag/js?'))await route.continue();
 else await route.abort();
});
const page=await context.newPage();page.on('requestfailed',r=>{if(/googletagmanager/.test(r.url()))console.log(r.url(),r.failure())});page.on('pageerror',e=>errors.push(e.message));
const pause=()=>page.waitForTimeout(800);
const commands=()=>page.frame({url:/analytics-frame.html/}).evaluate(()=>window.dataLayer.filter(x=>x&&typeof x[0]==='string').map(x=>Array.from(x)));
const count=async name=>(await commands()).filter(x=>x[0]==='event'&&x[1]===name).length;
try{
 await page.goto(base+'index.html?email=SECRET_EMAIL&utm_campaign=SECRET_CAMPAIGN#SECRET_HASH');await pause();
 assert.equal(requests.length,0);assert.equal((await context.cookies()).filter(x=>x.name.startsWith('_ga')).length,0);
 await page.locator('[data-consent="rejected"]').click();await page.reload();await pause();assert.equal(requests.length,0);assert(await page.locator('#analytics-preferences').isHidden());
 for(const file of ['planes.html','portafolio.html','servicios.html','index.html']){await page.goto(base+file);await pause();assert.equal(requests.length,0);assert(await page.locator('#analytics-preferences').isHidden());}
 await page.locator('[data-analytics-preferences]').click();await page.locator('[data-consent="accepted"]').click();
 await page.waitForFunction(()=>document.querySelector('iframe[src="analytics-frame.html"]')?.contentWindow.dataLayer?.length>3);
 await page.waitForTimeout(3500);
 assert(requests.some(x=>x.includes('gtag/js')),'Real tag requested');
 if(realTag)assert(payloads.length>0,'Real GA transport captured');
 assert.equal(await count('page_view'),1);
 assert.equal((await commands()).find(x=>x[0]==='config')[2].send_page_view,false);
 await page.evaluate(()=>document.querySelector('.quote-mascot').addEventListener('click',e=>e.preventDefault()));
 await page.locator('.quote-mascot').click();await pause();assert.equal(await count('whatsapp_click'),1);
 await page.evaluate(()=>{window.akmeAnalytics.whatsapp('SECRET_PLACEMENT','smart');window.akmeAnalytics.whatsapp('brief','SECRET_PACKAGE');});assert.equal(await count('whatsapp_click'),1);
 await page.locator('.brief-disclosure summary').click();
 await page.evaluate(()=>{window.open=()=>null;document.querySelector('#brief').requestSubmit();});assert.equal(await count('whatsapp_click'),1);
 await page.locator('[name="nombre"]').fill('SECRET_NAME');await page.locator('[name="marca"]').fill('SECRET_BRAND');await page.locator('[name="detalle"]').fill('SECRET_DETAIL');await page.locator('[name="paquete"]').selectOption({index:2});
 await page.evaluate(()=>document.querySelector('#brief').requestSubmit());await pause();assert.equal(await count('whatsapp_click'),2);
 await page.evaluate(()=>{scrollTo(0,document.documentElement.scrollHeight);});await pause();assert.equal(await count('scroll'),1);
 await page.evaluate(()=>dispatchEvent(new Event('scroll')));assert.equal(await count('scroll'),1);
 allCommands.push(...await commands());const commandText=JSON.stringify(await commands());assert.equal((await commands()).filter(x=>x[1]==='whatsapp_click').at(-1)[2].package,'esencial');assert(!/SECRET_|wa\.me|59157385254/.test(commandText));
 await page.locator('[data-analytics-preferences]').click();await page.locator('[data-consent="accepted"]').click();assert.equal(await count('page_view'),1);
 await context.addCookies([{name:'_ga',value:'test-cookie',url:base},{name:'_ga_JLTP3YSG40',value:'test-session',url:base}]);
 await page.locator('[data-analytics-preferences]').click();await page.locator('[data-consent="rejected"]').click();await pause();
 assert.equal(page.frames().length,1);assert.equal((await context.cookies()).filter(x=>x.name.startsWith('_ga')).length,0);
 const stopped=requests.length;await page.locator('.quote-mascot').click();await pause();assert.equal(requests.length,stopped);
 await page.reload();await pause();assert.equal(requests.length,stopped);
 await page.locator('[data-analytics-preferences]').click();await page.locator('[data-consent="accepted"]').click();await pause();
 for(const file of ['portafolio.html','servicios.html','planes.html']){
  await page.goto(base+file+'?email=SECRET_EMAIL#SECRET_HASH');await pause();assert.equal(await count('page_view'),1);allCommands.push(...await commands());
 }
 await page.evaluate(()=>document.querySelectorAll('#quote-wa,#quote-custom-wa,[data-analytics-wa="package"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault())));
 await page.locator('#quote-wa').click();await pause();assert.equal(await count('whatsapp_click'),1);
 await page.locator('#quote-open-custom').click();await page.locator('#quote-note').fill('SECRET_QUOTE_EMAIL');await page.locator('#quote-custom-wa').click();await pause();assert.equal(await count('whatsapp_click'),2);
 await page.locator('[data-analytics-wa="package"]').first().click();await pause();assert.equal(await count('whatsapp_click'),3);
 allCommands.push(...await commands());const events=(await commands()).filter(x=>x[1]==='whatsapp_click');assert.deepEqual(events.map(x=>x[2].package),['smart','custom','smart']);
 // Cross-tab withdrawal stops already loaded measurement contexts.
 const other=await context.newPage();await other.goto(base+'servicios.html');await pause();
 await other.locator('[data-analytics-preferences]').click();await other.locator('[data-consent="rejected"]').click();await pause();assert.equal(page.frames().length,1);await other.close();
 await page.goto(base+'index.html');
 for(const width of [320,390,768,1440]){
  await page.emulateMedia({reducedMotion:width===390?'no-preference':'reduce'});
  await page.setViewportSize({width,height:900});await page.locator('[data-analytics-preferences]').click();
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  const box=await page.locator('#analytics-preferences').boundingBox();assert(box.x>=0&&box.x+box.width<=width);
  assert(await page.locator('[data-consent="accepted"]').isVisible());assert(await page.locator('[data-consent="rejected"]').isVisible());
  await page.screenshot({path:`qa-output/analytics-${width}.png`});
  await page.locator('[data-consent="rejected"]').click();
 }
 await page.goto(base+'servicios.html#privacidad');await page.screenshot({path:'qa-output/analytics-privacy.png'});
 // Browser storage unavailable: choosing still works, no error blocks the site.
 await page.addInitScript(()=>{Storage.prototype.setItem=()=>{throw Error('blocked')};Storage.prototype.getItem=()=>{throw Error('blocked')};});
 await page.reload();await page.locator('[data-consent="rejected"]').click();assert(await page.locator('#analytics-preferences').isHidden());
 assert(!/SECRET_|SECRET%|wa\.me|59157385254/.test(payloads.join('\n')+JSON.stringify(allCommands)),'Sensitive values absent from real transport');
 const actualEvents=payloads.flatMap(p=>p.split('\n').map(line=>{try{return new URL(line).searchParams.get('en')}catch{return new URLSearchParams(line).get('en')}})).filter(Boolean);
 assert(!actualEvents.some(x=>/^(click|form_start|form_submit|view_search_results|video_|file_download)/.test(x)),actualEvents.join(','));
 assert.deepEqual(errors,[]);
 fs.writeFileSync('qa-output/analytics-network.json',JSON.stringify({mode:realTag?'real':'offline-tag-intercepted',requests:requests.length,collectRequests:payloads.length,actualEvents,payloads,allCommands},null,2));
 console.log(JSON.stringify({result:'PASS',mode:realTag?'real':'offline-tag-intercepted',requests:requests.length,collectRequests:payloads.length,actualEvents,checks:'opt-in/reject/revoke/reload/cross-tab/four pages/form/quote/enums/90% scroll/no PII/320-1440/reduced motion/storage blocked'},null,2));
}finally{await browser.close();server.close();}
