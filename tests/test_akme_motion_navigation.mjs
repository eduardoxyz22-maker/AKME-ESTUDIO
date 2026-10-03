import {chromium} from 'playwright';import {createServer} from 'node:http';import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const mime={'.mjs':'text/javascript','.js':'text/javascript','.json':'application/json','.css':'text/css','.html':'text/html','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4'};
const server=createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const p=path.join(process.cwd(),pathname.endsWith('/')?pathname+'index.html':pathname);try{const stat=fs.statSync(p);res.setHeader('Content-Type',mime[path.extname(p)]||'image/jpeg');if(req.headers.range){const [startText,endText]=req.headers.range.replace('bytes=','').split('-'),start=Number(startText),end=endText?Number(endText):stat.size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(p,{start,end}).pipe(res);}else{res.setHeader('Content-Length',stat.size);fs.createReadStream(p).pipe(res);}}catch{res.statusCode=404;res.end('Not found');}}).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
const base=process.env.AKME_LIVE?'https://eduardoxyz22-maker.github.io/AKME-ESTUDIO/':`http://127.0.0.1:${server.address().port}/`;
const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});let errors=[];page.on('pageerror',e=>errors.push(e.message));let mediaRequests=[];page.on('request',r=>{if(/\.mp4(?:\?|$)/.test(r.url()))mediaRequests.push(r.url());});
const go=async file=>{await page.goto(base+file,{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');};
try{
 for(const width of [1366,390]){
  await page.setViewportSize({width,height:844});
  for(const source of ['index.html','portafolio.html','servicios.html','planes.html']){
   await go(source);
   assert.equal(await page.locator('.nav a').filter({hasText:/^Paquetes$/}).getAttribute('href'),'planes.html');
   if(width<760){await page.locator('#menu-btn').click();await page.locator('#navigation-dialog a').filter({hasText:/^Paquetes$/}).click();}
   else await page.locator('.nav a').filter({hasText:/^Paquetes$/}).click();
   await page.waitForURL(/\/planes\.html$/);await page.waitForTimeout(150);
   assert(await page.locator('h1').evaluate(e=>e.getBoundingClientRect().top>=0));
   assert.equal(await page.evaluate(()=>location.hash),'');
   await page.reload();assert(await page.locator('h1').evaluate(e=>e.getBoundingClientRect().top>=0));
   await page.evaluate(()=>scrollTo(0,900));await page.evaluate(()=>scrollTo(0,0));assert.equal(await page.evaluate(()=>scrollY),0);
   if(source!=='planes.html'){await page.goBack();await page.goForward();assert(page.url().endsWith('/planes.html'));assert.equal(await page.evaluate(()=>getComputedStyle(document.body).overflow==='hidden'),false);}
   console.log('PASS Paquetes entry/reload/history/up '+width+' from '+source);
  }
 }
 await page.setViewportSize({width:1366,height:844});await page.emulateMedia({reducedMotion:'no-preference'});
 await page.addInitScript(()=>{window.motionLog=[];const animate=Element.prototype.animate;Element.prototype.animate=function(frames,options){const kind=this.matches('.impact-message i:first-child')?'letters':this.matches('.impact-logo img')?'footer':null;if(kind)window.motionLog.push({kind,t:performance.now(),options});return animate.call(this,frames,options)}});
 for(const [file,selector,kind] of [['index.html','.impact-message','letters'],['planes.html','.foot','footer']]){
  await go(file);await page.evaluate(async()=>{for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await document.fonts.ready;});
  assert.equal(await page.locator('.message-replay,.impact-replay').count(),0);
  await page.locator(selector).scrollIntoViewIfNeeded();if(kind==='footer')await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));
  const pos=await page.evaluate(()=>({y:scrollY,focus:document.activeElement.tagName}));
  await page.waitForTimeout(12800);
  const log=await page.evaluate(kind=>motionLog.filter(e=>e.kind===kind),kind);
  // Each word's first letter is instrumented; use one start per cycle.
  const times=log.map(e=>e.t).filter((t,i,a)=>i===0||t-a[i-1]>100);
  assert(times.length>=3,JSON.stringify(log));for(let i=1;i<3;i++)assert(Math.abs(times[i]-times[i-1]-6000)<300,JSON.stringify(times));
  if(kind==='letters')assert.equal(log[0].options.duration,2100);
  assert.deepEqual(await page.evaluate(()=>({y:scrollY,focus:document.activeElement.tagName})),pos);
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(100);const n=await page.evaluate(()=>motionLog.length);await page.waitForTimeout(6200);assert.equal(await page.evaluate(()=>motionLog.length),n,'Offscreen stops');
  await page.locator(selector).scrollIntoViewIfNeeded();if(kind==='footer')await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));await page.waitForTimeout(600);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});const hiddenN=await page.evaluate(()=>motionLog.length);await page.waitForTimeout(6200);assert.equal(await page.evaluate(()=>motionLog.length),hiddenN,'Hidden stops');
  await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);assert.equal(await page.locator(selector).evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length),0);await page.emulateMedia({reducedMotion:'no-preference'});
  console.log('PASS '+kind+' 3 real 6s cycles; offscreen/hidden/reduced; no scroll/focus theft');
 }
 await go('servicios.html');for(let i=0;i<4;i++){
  await page.locator('#concept-step-'+i+' .process-graphic').evaluate(e=>e.scrollIntoView({block:'center'}));await page.waitForTimeout(180);
  assert.equal(await page.locator('.process-step.motion-active').count(),1);
  assert(await page.locator('#concept-step-'+i).evaluate(e=>e.classList.contains('motion-active')));
  assert(await page.locator('#concept-step-'+i+' .process-graphic').evaluate(e=>e.getAnimations({subtree:true}).length>0));
 }
 await page.locator('#concept-step-2 .process-graphic').evaluate(e=>e.scrollIntoView({block:'center'}));await page.waitForTimeout(100);assert.equal(await page.locator('.process-block').count(),3);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>!document.querySelector('.motion-active'));assert.equal(await page.locator('.motion-active').count(),0);await page.evaluate(()=>scrollTo(0,0));await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(100);assert.equal(await page.locator('.motion-active').count(),0);
 for(const width of [320,390,768,1366]){await page.setViewportSize({width,height:844});for(const file of ['index.html','servicios.html','planes.html','portafolio.html']){await go(file);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow '+file+' '+width);assert.equal(await page.locator('.impact-replay,.message-replay').count(),0);}}
 assert.deepEqual(errors,[]);console.log('PASS conceptual assembly, responsive, no JS errors');
}finally{await browser.close();server.close();}
