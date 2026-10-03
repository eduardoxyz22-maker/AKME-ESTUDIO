import {chromium} from 'playwright';import {createServer} from 'node:http';import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const mime={'.mjs':'text/javascript','.js':'text/javascript','.json':'application/json','.css':'text/css','.html':'text/html','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4'};
const server=createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const p=path.join(process.cwd(),pathname.endsWith('/')?pathname+'index.html':pathname);try{const stat=fs.statSync(p);res.setHeader('Content-Type',mime[path.extname(p)]||'image/jpeg');if(req.headers.range){const [startText,endText]=req.headers.range.replace('bytes=','').split('-'),start=Number(startText),end=endText?Number(endText):stat.size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(p,{start,end}).pipe(res);}else{res.setHeader('Content-Length',stat.size);fs.createReadStream(p).pipe(res);}}catch{res.statusCode=404;res.end('Not found');}}).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
const base=process.env.AKME_LIVE?'https://eduardoxyz22-maker.github.io/AKME-ESTUDIO/':`http://127.0.0.1:${server.address().port}/`;
const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});let errors=[];page.on('pageerror',e=>errors.push(e.message));let mediaRequests=[];page.on('request',r=>{if(/\.mp4(?:\?|$)/.test(r.url()))mediaRequests.push(r.url());});
const go=async file=>{await page.goto(base+file,{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');};
try{
 for(const width of [1920,1366,820,320,390,430]){
  await page.setViewportSize({width,height:900});await go('portafolio.html');await page.locator('.portfolio-preview-video').first().waitFor({state:'attached'});
  assert.equal(await page.locator('.proposal').count(),0);
  for(const id of ['mirna','spadental','cosmetic']){
   const section=page.locator('#proyecto-'+id);await section.scrollIntoViewIfNeeded();await section.locator('img').evaluateAll(es=>Promise.all(es.map(e=>{e.loading='eager';return e.decode()})));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);
   const stage=await section.locator('.gallery-preview').boundingBox();
   for(const card of await section.locator('.gallery-card,.gallery-caption').all()){const box=await card.boundingBox();assert(box.y+box.height<=stage.y+stage.height+2,'clipped card '+width+' '+id);}
   if([390,1366].includes(width))await section.screenshot({path:`qa-output/portfolio-${id}-${width}.png`});
  }
 }
 await page.setViewportSize({width:390,height:844});await page.goto('about:blank');await page.emulateMedia({reducedMotion:'no-preference'});mediaRequests=[];await go('portafolio.html');await page.locator('.portfolio-preview-video').first().waitFor({state:'attached'});assert.equal(mediaRequests.length,0,'No initial video downloads');
 const preview=page.locator('#proyecto-cosmetic .portfolio-preview-video');await preview.locator('..').scrollIntoViewIfNeeded();await page.waitForFunction(()=>[...document.querySelectorAll('.portfolio-preview-video')].some(v=>!v.paused&&v.currentTime>.1));
 assert(await preview.evaluate(v=>v.muted&&!v.controls));assert.equal(await page.locator('.portfolio-preview-video').evaluateAll(es=>es.filter(e=>!e.paused).length),1);
 await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(250);assert(await preview.evaluate(v=>v.paused));
 await preview.locator('..').scrollIntoViewIfNeeded();await page.waitForTimeout(5700);assert(await preview.evaluate(v=>v.paused),'Short preview ends');
 assert(mediaRequests.every(s=>s.includes('/assets/previews/')),'Only light clips fetched');
 await page.locator('#proyecto-cosmetic .gallery-card[data-format=video]').click();await page.waitForFunction(()=>{const v=document.querySelector('#gallery-media video');return v&&!v.paused&&v.currentTime>.1});
 assert(await page.locator('#gallery-media video').evaluate(v=>v.controls&&!v.muted&&v.src.includes('/clientes/')));
 assert(await page.locator('.portfolio-preview-video').evaluateAll(es=>es.every(v=>v.paused)));
 await page.locator('#gallery-media video').evaluate(v=>window.oldVideo=v);await page.locator('#gallery-next').click();assert(await page.evaluate(()=>oldVideo.paused&&!oldVideo.getAttribute('src')));
 await page.locator('#gallery-prev').click();await page.locator('#gallery-media video').evaluate(v=>window.oldVideo=v);await page.locator('.gallery-close').click();await page.waitForFunction(()=>!document.querySelector('#gallery-viewer').open);assert(await page.evaluate(()=>oldVideo.paused&&!oldVideo.getAttribute('src')));
 await page.emulateMedia({reducedMotion:'reduce'});mediaRequests=[];await go('portafolio.html#proyecto-mirna');await page.waitForTimeout(500);assert.equal(mediaRequests.length,0,'Reduced motion avoids previews');
 for(let i=0;i<3;i++){
  const opener=page.locator('#proyecto-spadental .gallery-card[data-index="0"]');await opener.click();assert(await page.locator('.gallery-client-identity').isVisible());await page.getByRole('button',{name:'Acercar imagen',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Restablecer zoom',exact:true}).textContent(),'150%');await page.locator('#gallery-next').click();assert.equal(await page.getByRole('button',{name:'Restablecer zoom',exact:true}).textContent(),'100%');await page.goBack();await page.waitForFunction(()=>!document.querySelector('#gallery-viewer').open);assert(await opener.evaluate(e=>document.activeElement===e));
 }
 const blocked=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});await blocked.addInitScript(()=>{HTMLMediaElement.prototype.play=function(){return Promise.reject(new DOMException('Playback blocked','NotAllowedError'))}});const bp=await blocked.newPage();await bp.goto(base+'portafolio.html#proyecto-cosmetic');await bp.locator('#proyecto-cosmetic .gallery-card[data-format=video]').scrollIntoViewIfNeeded();await bp.waitForTimeout(350);assert.equal(await bp.locator('.portfolio-preview-video.is-playing').count(),0);assert(await bp.locator('#proyecto-cosmetic .gallery-play-label').isVisible());await bp.locator('#proyecto-cosmetic .gallery-card[data-format=video]').tap();assert(await bp.locator('#gallery-media video').evaluate(v=>v.controls&&!!v.poster));await blocked.close();
 assert.deepEqual(errors,[]);console.log('PASS portfolio: 6 widths, full card bounds, one silent short preview, lazy lightweight clips, offscreen pause, full audible viewer, stop on change/close, reduced motion, autoplay denial fallback, repeated back/focus, zoom reset, no JS errors. '+await browser.version());
}finally{await browser.close();server.close();}
