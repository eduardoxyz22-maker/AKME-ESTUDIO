import {chromium} from 'playwright';import {createServer} from 'node:http';import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const mime={'.mjs':'text/javascript','.js':'text/javascript','.json':'application/json','.css':'text/css','.html':'text/html','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4'};
const server=createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const p=path.join(process.cwd(),pathname.endsWith('/')?pathname+'index.html':pathname);try{const stat=fs.statSync(p);res.setHeader('Content-Type',mime[path.extname(p)]||'image/jpeg');if(req.headers.range){const [startText,endText]=req.headers.range.replace('bytes=','').split('-'),start=Number(startText),end=endText?Number(endText):stat.size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(p,{start,end}).pipe(res);}else{res.setHeader('Content-Length',stat.size);fs.createReadStream(p).pipe(res);}}catch{res.statusCode=404;res.end('Not found');}}).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
const base=process.env.AKME_LIVE?'https://eduardoxyz22-maker.github.io/AKME-ESTUDIO/':`http://127.0.0.1:${server.address().port}/`;
const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});let errors=[];page.on('pageerror',e=>errors.push(e.message));let mediaRequests=[];page.on('request',r=>{if(/\.mp4(?:\?|$)/.test(r.url()))mediaRequests.push(r.url());});
const go=async file=>{await page.goto(base+file,{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');};
try{
for(const width of [1920,1366,320,390,430]){
 await page.setViewportSize({width,height:900});
 for(const file of ['index.html','portafolio.html','servicios.html','planes.html']){
  await go(file);assert.equal(await page.locator('.nav [aria-current=page]').count(),1);assert.equal(await page.locator('#menu-panel [aria-current=page]').count(),1);
  assert.equal(await page.locator('.impact-phrase').textContent(),'TU MARCA. NUESTRO PRÓXIMO IMPACTO.');
  if(width<761){assert(await page.locator('.mobile-location').isVisible());await page.locator('#menu-btn').click();assert(await page.locator('#menu-panel [aria-current=page]').isVisible());await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('#gallery-viewer')?.open);}
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 await go('portafolio.html#proyecto-mirna');await page.locator('.magazine-brand .gallery-heading').first().waitFor();
 assert.equal(await page.locator('.magazine-brand .gallery-heading').count(),5);assert.equal(await page.locator('#proyecto-canelitas .brand-signature').count(),0);
 await page.locator('#proyecto-mirna img').evaluateAll(async es=>{await Promise.all(es.map(e=>{e.loading='eager';return e.decode()}))});
 const heading=await page.locator('#title-mirna').boundingBox(),header=await page.locator('.top').boundingBox();assert(heading.y>=header.height,'Anchor heading visible');
 await page.screenshot({path:'qa-output/identidad-mirna-'+width+'.png'});
 await page.locator('#proyecto-spadental .gallery-card[data-index="0"]').click();await page.locator('#gallery-media img').evaluate(e=>e.decode());
 assert.equal(await page.locator('#gallery-count').textContent(),'1 de 5');
 const media=await page.locator('#gallery-media').boundingBox(),nav=await page.locator('.gallery-nav').boundingBox(),toolbar=await page.locator('.gallery-toolbar').boundingBox();assert(nav.y>=media.y+media.height-1);assert(toolbar.y+toolbar.height<=media.y+1);
 assert.equal(await page.locator('#gallery-media img').evaluate(e=>getComputedStyle(e).objectFit),'contain');
 await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#gallery-count').textContent(),'2 de 5');
 await page.screenshot({path:'qa-output/identidad-modal-'+width+'.png'});
 await page.goBack();await page.waitForFunction(()=>!document.querySelector('#gallery-viewer').open);assert(await page.locator('#proyecto-spadental .gallery-card[data-index="0"]').evaluate(e=>document.activeElement===e));
 await page.goForward();await page.waitForFunction(()=>document.querySelector('#gallery-viewer').open);assert.equal(await page.locator('#gallery-count').textContent(),'2 de 5');await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('#gallery-viewer')?.open);await page.waitForFunction(()=>!document.documentElement.classList.contains('gallery-is-open'));
 await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.screenshot({path:'qa-output/identidad-footer-'+width+'.png'});
}
const touchContext=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'}),tp=await touchContext.newPage();await tp.goto(base+'portafolio.html',{waitUntil:'domcontentloaded'});await tp.locator('#proyecto-spadental .gallery-card[data-index="0"]').click();await tp.locator('#gallery-media img').evaluate(e=>e.decode());const cdp=await touchContext.newCDPSession(tp),box=await tp.locator('#gallery-media').boundingBox();
async function swipe(dx,dy=0){const x=box.x+box.width*(dx<0?.8:.2),y=box.y+box.height*.5;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=6;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/6,y:y+dy*i/6}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
await swipe(-180);assert.equal(await tp.locator('#gallery-count').textContent(),'2 de 5');await swipe(180);assert.equal(await tp.locator('#gallery-count').textContent(),'1 de 5');await swipe(10,100);assert.equal(await tp.locator('#gallery-count').textContent(),'1 de 5');await tp.locator('.gallery-close').click();await touchContext.close();
const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),np=await nojs.newPage();await np.goto(base+'portafolio.html',{waitUntil:'domcontentloaded'});assert.equal(await np.locator('.magazine-brand .gallery-heading').count(),5);assert.equal(await np.locator('#proyecto-mirna .gallery-card').count(),3);assert.equal(await np.locator('#menu-panel [aria-current=page]').textContent(),'Portafolio');await nojs.close();assert.deepEqual(errors,[]);console.log('PASS identity: 5 widths, 4 pages, published gallery composition, active nav, anchors, dark complete media, controls outside art, native touch swipes, vertical gesture ignored, back/forward/escape/focus, no-JS. Browser '+await browser.version());
}finally{await browser.close();server.close();}
