// Live acceptance only: no response mocks. WebKit strips only local document upgrade-insecure-requests.
import {chromium,webkit} from '@playwright/test';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {stripDevUpgradeCSP} from '../browser.mjs';
const engine=process.argv[2]||'chrome';const dir=process.argv[4];if(!dir)throw Error('Usage: node scripts/qa/helpers/images-real-capabilities.mjs chrome|webkit x|ai NEW_OUTPUT_DIRECTORY');await mkdir(dir,{recursive:false});let failed=false;
const server=await (engine==='chrome'?chromium:webkit).launchServer({headless:true,...(engine==='chrome'?{channel:'chrome'}:{executablePath:process.env.QA_WEBKIT_EXECUTABLE})});
const browser=await (engine==='chrome'?chromium:webkit).connect(server.wsEndpoint());
for(const mode of [process.argv[3]||'x']){
 const page=await browser.newPage();const records=[];const started=Date.now();
 const record=entry=>records.push({elapsedMs:Date.now()-started,...entry});
 page.on('console',m=>record({kind:'console',type:m.type(),text:m.text()}));
 page.on('pageerror',e=>record({kind:'pageerror',text:e.message}));
 page.on('response',r=>record({kind:'http',url:r.url(),status:r.status()}));
 page.on('requestfinished',r=>record({kind:'requestfinished',url:r.url(),resourceType:r.resourceType()}));
 page.on('requestfailed',r=>record({kind:'requestfailed',url:r.url(),resourceType:r.resourceType(),failure:r.failure()}));
 page.on('framenavigated',f=>{if(f===page.mainFrame())record({kind:'navigation',url:f.url()});});
 if(engine==='webkit')await page.route('**/*',route=>stripDevUpgradeCSP(route,error=>record({kind:'csp-override-error',text:error.message})));
 try{
 await page.goto('http://localhost:3190/tools/images/'+(mode==='x'?'tweet-to-image-converter':'image-background-remover'),{waitUntil:'domcontentloaded'});const tool=page.locator('.tb-v2-tool-card').first();await tool.waitFor();await page.waitForFunction(()=>[...document.querySelectorAll('.tb-v2-tool-card button')].some(el=>Object.keys(el).some(k=>k.startsWith('__reactProps$')&&typeof el[k]?.onClick==='function')),{},{timeout:30000});await page.getByRole('button',{name:'Decline',exact:true}).click({timeout:1500}).catch(()=>{});
 if(mode==='x'){await page.evaluate(()=>{window.__qaDrawnText=[];const original=CanvasRenderingContext2D.prototype.fillText;CanvasRenderingContext2D.prototype.fillText=function(text,...args){window.__qaDrawnText.push(text);return original.call(this,text,...args)}});await tool.getByLabel('Tweet URL',{exact:true}).fill('https://x.com/jack/status/20');await tool.getByRole('button',{name:'Fetch tweet',exact:true}).click();await page.waitForFunction(()=>/Tweet loaded|Couldn't load/.test(document.querySelector('.tb-v2-tool-card')?.textContent),{},{timeout:30000});const link=tool.getByRole('link',{name:'Download as PNG',exact:true}).last();await link.waitFor({timeout:30000});const [dl]=await Promise.all([page.waitForEvent('download'),link.click()]);await dl.saveAs(dir+'/x-result.png');const drawn=await page.evaluate(()=>window.__qaDrawnText);records.push({kind:'drawnText',text:drawn});if(!drawn.includes('just setting up my twttr')||drawn.some(t=>/\d{1,2}:\d{2}.*·/.test(t)))throw Error('Public post text or unverified timestamp regression');}
 else {await tool.locator('input[type=file]').first().setInputFiles('public/samples/png-to-jpg-photo.png');await tool.getByLabel('AI Remove',{exact:true}).check();await tool.getByRole('button',{name:'Remove Background',exact:true}).click();await waitForAIResult(page,tool);
 const [dl]=await Promise.all([page.waitForEvent('download'),tool.getByRole('button',{name:'Download PNG',exact:true}).click()]);await dl.saveAs(dir+'/ai-result.png');
 const bytes=await readFile(dir+'/ai-result.png');
 const stats=await page.evaluate(async b64=>{const img=await createImageBitmap(new Blob([Uint8Array.from(atob(b64),c=>c.charCodeAt(0))]));const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const x=c.getContext('2d');x.drawImage(img,0,0);const rgba=x.getImageData(0,0,c.width,c.height).data;let transparent=0,foreground=0;for(let i=3;i<rgba.length;i+=4){if(rgba[i]<10)transparent++;if(rgba[i]>240)foreground++;}return{width:c.width,height:c.height,transparent,foreground}},bytes.toString('base64'));
 record({kind:'outputPixels',...stats});if(stats.width!==640||stats.height!==427||!stats.transparent||!stats.foreground)throw Error('AI output lacks expected dimensions or foreground/background alpha separation');await verifyAICancel(page,tool,record);}
 records.push({kind:'ui',text:await tool.innerText()});
 }catch(e){failed=true;records.push({kind:'error',text:e.message});}finally{await page.screenshot({path:dir+'/'+mode+'.png',fullPage:true,timeout:10000}).catch(e=>records.push({kind:'screenshot-error',text:e.message}));await writeFile(dir+'/'+mode+'.json',JSON.stringify(records,null,2));console.log(engine,mode,records.filter(r=>['error','ui'].includes(r.kind)));await page.close();}
}
await browser.close();await server.close();if(failed)process.exitCode=1;

// One wait observes both success and the actual error surface, so an inference
// failure cannot silently turn into a download timeout.
async function waitForAIResult(page,tool){
 await page.waitForFunction(()=>{
  const card=document.querySelector('.tb-v2-tool-card');
  return !!card?.querySelector('[role="alert"]')||[...card?.querySelectorAll('button')||[]].some(button=>button.textContent.trim()==='Download PNG');
 },{},{timeout:180000});
 const alert=tool.getByRole('alert');
 if(await alert.count())throw Error(await alert.innerText());
}

async function verifyAICancel(page,tool,record){
 // Keep inference and PNG encoding real. Hold only delivery of the encoded
 // output to deterministically cancel before the component receives it.
 await page.evaluate(()=>{
  const prototype=OffscreenCanvas.prototype;
  const original=prototype.convertToBlob;
  const state=window.__qaAICancel={ready:false,released:false,returned:false};
  let release;
  const gate=new Promise(resolve=>{release=resolve;});
  state.release=()=>{state.released=true;release();};
  state.restore=()=>{prototype.convertToBlob=original;state.release();};
  prototype.convertToBlob=async function(options){
   const blob=await original.call(this,options);
   state.ready=true;state.size=blob.size;state.type=blob.type;
   await gate;
   state.returned=true;
   return blob;
  };
 });
 try{
  await tool.getByRole('button',{name:'Remove Background',exact:true}).click();
  await page.waitForFunction(()=>window.__qaAICancel?.ready||document.querySelector('.tb-v2-tool-card [role="alert"]'),{},{timeout:180000});
  const alert=tool.getByRole('alert');
  if(await alert.count())throw Error(await alert.innerText());
  const encoded=await page.evaluate(()=>({size:window.__qaAICancel.size,type:window.__qaAICancel.type}));
  if(!encoded.size||encoded.type!=='image/png')throw Error('Canceled inference did not encode a real PNG');
  await tool.getByRole('button',{name:'Cancel result',exact:true}).click();
  if(await tool.getByRole('button',{name:'Download PNG',exact:true}).count())throw Error('Cancel left a downloadable output');
  await page.evaluate(()=>window.__qaAICancel.release());
  await page.waitForFunction(()=>window.__qaAICancel?.returned);
  // Wait across paint tasks after the genuine output promise has resolved.
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  if(await tool.getByRole('button',{name:'Download PNG',exact:true}).count())throw Error('Canceled inference published a stale output');
  if(await tool.getByRole('button',{name:'Cancel result',exact:true}).count())throw Error('Cancel left the UI busy');
  if(!(await tool.getByRole('button',{name:'Remove Background',exact:true}).isEnabled()))throw Error('Cancel did not restore processing controls');
  record({kind:'cancel',passed:true,realInference:true,deliveryHeld:true,...encoded});
 }finally{
  await page.evaluate(()=>window.__qaAICancel?.restore()).catch(()=>{});
 }
}
