// Supplemental group-only diagnostics. Does not replace central runner acceptance.
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium, webkit, expect } from '@playwright/test';
import cases from '../cases/utility-design.mjs';
import { executeFixture } from '../core.mjs';
const [engine, out, slugs] = process.argv.slice(2);
if (!['chrome','webkit'].includes(engine) || !out) throw Error('Usage: utility-design-integration.mjs chrome|webkit OUT [comma-separated-slugs]');
await fs.mkdir(out,{recursive:true});
const browser = await (engine === 'chrome' ? chromium : webkit).launch({headless:true,
  ...(engine === 'chrome' ? {channel:'chrome'} : {executablePath:process.env.QA_WEBKIT_EXECUTABLE})});
// Reuse HTTP cache, but clear origin storage between cases. Central runner uses fresh contexts.
const context = await browser.newContext({viewport:{width:1280,height:900},acceptDownloads:true});
context.setDefaultTimeout(10000);
context.setDefaultNavigationTimeout(120000);
if (engine === 'webkit') await context.route('**/*',async route=>{
  if(route.request().resourceType()!=='document') return route.continue();
  try {
    const response=await route.fetch({timeout:120000,maxRedirects:0});const headers=response.headers();
    for(const key of ['content-security-policy','content-security-policy-report-only']) if(headers[key]) headers[key]=headers[key].split(';').filter(x=>!/^\s*upgrade-insecure-requests\s*$/i.test(x)).join(';');
    await route.fulfill({response,headers});
  } catch { await route.abort().catch(()=>{}); }
});
const results=[];
try {
  for(const fixture of cases.filter(c=>!slugs||slugs.split(',').includes(c.slug))) {
    const page=await context.newPage(),start=Date.now();const runtime=[];
    page.on('pageerror',e=>runtime.push({type:'pageerror',message:e.message}));
    page.on('console',m=>{if(m.type()==='error')runtime.push({type:'console',message:m.text()});});
    const artifactsDir=path.join(out,fixture.slug);await fs.mkdir(artifactsDir,{recursive:true});
    let result;
    try {
      console.log(fixture.slug,'navigating');
      await page.goto(`http://localhost:3190/tools/${fixture.slug}`,{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>[...document.querySelectorAll('.tb-v2-tool-card *')].some(e=>Object.keys(e).some(k=>k.startsWith('__reactProps$')||k.startsWith('__reactFiber$'))),null,{timeout:120000});
      const hydrationMs=Date.now()-start;
      console.log(fixture.slug,'hydrated',hydrationMs);
      await page.evaluate(()=>{localStorage.clear();sessionStorage.clear();});
      await page.getByRole('button',{name:/^Decline(?: analytics cookies)?$/i}).click({timeout:1000}).catch(()=>{});
      const tool=page.locator('.tb-v2-tool-card').first();
      result={slug:fixture.slug,hydrationMs,...await executeFixture(fixture,{page,tool,expect,baseURL:'http://localhost:3190',artifactsDir},180000)};
      result.alerts=await tool.getByRole('alert').allTextContents();
      result.visibleText=await tool.innerText();
      await page.setViewportSize({width:320,height:900});
      await tool.scrollIntoViewIfNeeded();
      await page.screenshot({path:path.join(artifactsDir,'320.png')}).catch(e=>{result.screenshotError=e.message;});
    } catch(e) {result={slug:fixture.slug,status:'blocked',error:{message:e.message}};}
    result.runtime=runtime;results.push(result);
    await fs.writeFile(path.join(out,`${fixture.slug}.json`),JSON.stringify(result,null,2));
    console.log(fixture.slug,result.status,result.error?.message?.slice(0,250)||'');
    await page.close();await context.clearCookies();
  }
} finally {
  await fs.writeFile(path.join(out,'aggregate.json'),JSON.stringify({engine,mode:'supplemental-warm-context-120s-hydration; not central acceptance',results},null,2));
  await browser.close();
}
