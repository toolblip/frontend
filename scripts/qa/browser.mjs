import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { actionProblems, executeFixture, serializeError, toolURL, within } from './core.mjs';

import { classifyRuntime } from './runtime.mjs';

const examplesName = /^[^\p{L}\p{N}]*(?:load\s+|try\s+)?examples?(?:\s*\d+)?$/iu;
const clearName = /^[^\p{L}\p{N}]*clear(?:\s+all)?$/iu;

async function buttonStates(locator) {
  return Promise.all((await locator.all()).map(async item => ({
    text:(await item.innerText()).trim(),visible:await item.isVisible(),enabled:await item.isEnabled(),
  })));
}

export async function snapshot(tool) {
  return tool.evaluate(root => ({
    controls:Array.from(root.querySelectorAll('input,textarea,select,button,[role="button"]')).map(el => ({
      tag:el.tagName,type:el.getAttribute('type'),role:el.getAttribute('role'),
      label:el.getAttribute('aria-label') || el.labels?.[0]?.textContent?.trim() || (el.tagName === 'BUTTON' ? el.textContent?.trim().slice(0,200) : null),
      disabled:!!el.disabled,
      // Keep structure and lengths, never raw field values or file paths.
      valueLength:el.type === 'password' ? undefined : typeof el.value === 'string' ? el.value.length : undefined,
      checked:el.type === 'checkbox' || el.type === 'radio' ? el.checked : undefined,
      options:el.tagName === 'SELECT' ? el.options.length : undefined,
      files:el.files ? Array.from(el.files).map(f=>({bytes:f.size,type:f.type})) : undefined,
    })),
    outputs:Array.from(root.querySelectorAll('output,pre,canvas,img,a[download],[role="status"],[role="alert"]')).map(el=>({
      tag:el.tagName,role:el.getAttribute('role'),textLength:el.textContent?.length,
      width:el.width,height:el.height,download:el.hasAttribute('download'),
    })),
    textLength:root.textContent?.length,
  }));
}

export async function stripDevUpgradeCSP(route, onError = () => {}) {
  try {
    const request = route.request();
    const url = new URL(request.url());
    const localCodecWorker = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) && url.pathname === '/codecs/webp-converter/webp-worker.js';
    if (request.resourceType() !== 'document' && !localCodecWorker) return await route.continue();
    const response = await route.fetch({maxRedirects:0,timeout:30_000});
    const headers = response.headers();
    for (const key of ['content-security-policy','content-security-policy-report-only']) {
      if (headers[key]) headers[key] = headers[key].split(';').filter(part=>!/^\s*upgrade-insecure-requests\s*$/i.test(part)).join(';');
    }
    await route.fulfill({response,headers});
  } catch (error) {
    onError(error);
    // Fail the navigation, retaining the route error without crashing other cases.
    await route.abort('failed').catch(() => {});
  }
}

export async function auditTool({browser, entry, expectedEntry = entry, fixture, options, expect, artifactsDir}) {
  const result = {
    slug:entry.slug,group:entry.group,history:{historicallyApproved:!!entry.historicallyApproved},
    fixture:fixture ? {slug:fixture.slug,module:fixture.module,requiresExample:fixture.requiresExample !== false,requiresClear:fixture.requiresClear !== false,exceptionReason:fixture.exceptionReason ?? null} : null,
    startedAt:new Date().toISOString(),status:'failed',
    route:{status:'not-run',requestedURL:toolURL(entry,options.base)},
    canonical:{status:'not-run'},http:{status:'not-run'},hydration:{status:'not-run'},ui:{status:'not-run'},
    functional:{status:fixture ? 'not-run' : 'needs-fixture',evidence:[]},
    runtime:{status:'not-run',pageErrors:[],consoleErrors:[],failedRequests:[],httpErrors:[],dialogs:[]},
    layouts:[],errors:[],snapshots:{},
  };
  let context;
  let page;
  let active = true;
  let phase = 'navigation';
  let sequence = 0;
  let requestNumber = 0;
  const requestIds = new WeakMap();
  const injectedAborts = new WeakMap();
  const requestId = request => {
    if (!requestIds.has(request)) requestIds.set(request, `request-${++requestNumber}`);
    return requestIds.get(request);
  };
  const stamp = () => ({at:new Date().toISOString(),phase,pageURL:page?.url(),sequence:++sequence});
  const abortExpectedRequest = async (route, reason) => {
    if (typeof reason !== 'string' || !reason.trim()) throw new Error('Expected request abort requires an evidence reason');
    const request = route.request();
    injectedAborts.set(request, {...stamp(),requestId:requestId(request),errorCode:'failed',reason});
    try { await route.abort('failed'); }
    catch (error) { injectedAborts.delete(request); throw error; }
  };
  try {
    await mkdir(artifactsDir,{recursive:true});
    context = await browser.newContext({viewport:{width:1280,height:900},acceptDownloads:true,serviceWorkers:'allow'});
    // A fulfilled local document loses Chrome's network address classification.
    // Allow its real loopback HMR connection only for the explicit local audit.
    if (options.engine === 'chrome' && options['strip-dev-upgrade-csp'] && ['localhost','127.0.0.1','[::1]'].includes(new URL(options.base).hostname)) {
      await context.grantPermissions(['local-network-access'], {origin:new URL(options.base).origin});
    }
    context.setDefaultTimeout(8_000);
    context.setDefaultNavigationTimeout(30_000);
    if (options['strip-dev-upgrade-csp']) await context.route('**/*', route => stripDevUpgradeCSP(route, error => result.errors.push({phase:'csp-override',...serializeError(error)})));
    page = await context.newPage();
    page.on('pageerror',error=>{if(active) result.runtime.pageErrors.push({...stamp(),...serializeError(error)});});
    page.on('console',message=>{if(active && message.type() === 'error') result.runtime.consoleErrors.push({...stamp(),text:message.text(),source:message.location()});});
    page.on('requestfailed',request=>{if(active) result.runtime.failedRequests.push({...stamp(),requestId:requestId(request),url:request.url(),method:request.method(),resourceType:request.resourceType(),failure:request.failure(),injectedAbort:injectedAborts.get(request)});});
    page.on('response',response=>{if(active && response.status() >= 400) result.runtime.httpErrors.push({...stamp(),url:response.url(),status:response.status(),resourceType:response.request().resourceType(),method:response.request().method()});});
    page.on('dialog',async dialog=>{if(active) result.runtime.dialogs.push({...stamp(),type:dialog.type(),message:dialog.message()}); await dialog.dismiss().catch(()=>{});});
    const response = await page.goto(result.route.requestedURL,{waitUntil:'domcontentloaded'});
    result.http = {status:response?.ok() ? 'passed':'failed',code:response?.status() ?? null};
    const chain = [];
    for (let request = response?.request(); request; request = request.redirectedFrom()) {
      const hop = await request.response();
      chain.unshift({url:request.url(),status:hop?.status() ?? null});
    }
    result.route = {...result.route,finalURL:page.url(),redirects:chain};
    const expectedURL = toolURL(expectedEntry,options.base);
    result.route.expectedURL = expectedURL;
    const normalize = value => new URL(value).origin + new URL(value).pathname.replace(/\/$/,'');
    result.route.status = normalize(page.url()) === normalize(expectedURL) ? 'passed':'failed';
    if (!response?.ok()) throw Error(`Document HTTP status ${response?.status() ?? 'unavailable'}`);
    phase = 'hydration';
    const tool = page.locator('.tb-v2-tool-card').first();
    await tool.waitFor({state:'visible',timeout:15_000});
    const hydration = await page.waitForFunction(() => {
      const root = document.querySelector('.tb-v2-tool-card');
      if (!root) return false;
      if (Array.from(root.querySelectorAll('*')).some(el=>Object.keys(el).some(key=>key.startsWith('__reactProps$') || key.startsWith('__reactFiber$')))) return 'react-tool-descendants';
      return false;
    },undefined,{timeout:45_000});
    result.hydration = {status:'passed',evidence:await hydration.jsonValue()};
    await hydration.dispose();
    // Next can stream metadata after the initial document shell. Inspect it
    // after hydration, without relaxing canonical identity or missing-link checks.
    result.route.canonical = await page.locator('link[rel="canonical"]').first().getAttribute('href',{timeout:8000}).catch(()=>null);
    const expectedCanonical = toolURL(expectedEntry,'https://toolblip.com');
    const actualCanonical = result.route.canonical;
    let canonicalReason = null;
    try {
      if (!actualCanonical) throw Error('Missing canonical');
      const parsed = new URL(actualCanonical);
      if (!['https:','http:'].includes(parsed.protocol)) throw Error('Malformed canonical');
      if (actualCanonical !== expectedCanonical) throw Error('Wrong canonical');
    } catch (error) { canonicalReason = error.message; }
    result.canonical = {status:canonicalReason ? 'failed':'passed',actual:actualCanonical,expected:expectedCanonical,reason:canonicalReason};
    const decline = page.getByRole('button',{name:/^decline(?: analytics cookies)?$/i}).first();
    await decline.click({timeout:2000}).then(()=>{result.cookies='declined';}).catch(()=>{result.cookies='decline-not-available';});
    phase = 'baseline';
    const examples = tool.getByRole('button',{name:examplesName});
    const clear = tool.getByRole('button',{name:clearName});
    if (fixture?.requiresExample !== false) await examples.first().waitFor({state:'visible',timeout:3000}).catch(()=>{});
    const actions = {examples:await buttonStates(examples),clear:await buttonStates(clear)};
    const problems = actionProblems(fixture,actions);
    result.ui = {status:problems.length ? 'failed':'passed',actions,problems};
    result.snapshots.before = await snapshot(tool);
    phase = 'fixture';
    if (fixture && !options['smoke-only']) {
      result.functional = await executeFixture(fixture,{page,tool,expect,baseURL:options.base,artifactsDir,abortExpectedRequest});
    } else {
      phase = 'smoke-discovery';
      // Discovery only. Neither changed text nor a successful click proves correctness.
      const index = actions.examples.findIndex(a=>a.visible && a.enabled);
      if (index >= 0) {
        await examples.nth(index).click();
        result.discovery = {exampleClicked:true};
      } else result.discovery = {exampleClicked:false};
    }
    result.snapshots.after = await snapshot(tool);
    result.ui.actionsAfter = {examples:await buttonStates(examples),clear:await buttonStates(clear)};
    result.alerts = await tool.getByRole('alert').allTextContents();
    if (result.discovery) result.discovery.metadataChanged = JSON.stringify(result.snapshots.before) !== JSON.stringify(result.snapshots.after);
    phase = 'layout';
    for (const width of [1280,390,320]) {
      await page.setViewportSize({width,height:900});
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      const layout = await tool.evaluate(root => {
        const rect = root.getBoundingClientRect();
        const viewport = document.documentElement.clientWidth;
        return {left:rect.left,right:rect.right,toolWidth:rect.width,clientWidth:root.clientWidth,scrollWidth:root.scrollWidth,viewport,
          overflow:rect.left < -1 || rect.right > viewport + 1 || root.scrollWidth > root.clientWidth + 1};
      });
      const screenshot = path.join(artifactsDir,`${width}.png`);
      await tool.scrollIntoViewIfNeeded();
      await page.screenshot({path:screenshot,timeout:10_000});
      result.layouts.push({width,status:layout.overflow ? 'failed':'passed',...layout,screenshot});
    }
  } catch(error) {
    result.errors.push({phase,...serializeError(error)});
    if (phase === 'hydration') result.hydration.status = 'failed';
    if (page && !page.isClosed()) {
      result.route.finalURL = page.url();
      await page.screenshot({path:path.join(artifactsDir,'error.png'),timeout:5000}).catch(()=>{});
    }
  } finally {
    // Stop collecting before teardown. Every tool has its own context and page listeners.
    active = false;
    if (context) await within(context.close(),5000,'Context close').catch(error=>result.errors.push({phase:'context-close',...serializeError(error)}));
    try { classifyRuntime(result.runtime,options.base,fixture); }
    catch (error) { result.runtime.status='failed'; result.errors.push({phase:'classification',...serializeError(error)}); }
    const failed = result.errors.length || [result.route,result.canonical,result.http,result.hydration,result.ui,result.runtime,result.functional,...result.layouts].some(r=>r.status === 'failed');
    result.status = failed ? 'failed' : result.functional.status === 'passed' ? 'passed' : result.functional.status === 'needs-fixture' ? 'needs-fixture':'smoke-only';
    result.finishedAt = new Date().toISOString();
  }
  return result;
}
