import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { chromium, webkit, expect } from '@playwright/test';
import { within, resolveDestination } from './core.mjs';
import { auditTool } from './browser.mjs';

let server, browser, artifacts;
before(async () => {
  artifacts = await mkdtemp(path.join(os.tmpdir(),'qa-harness-tests-'));
  const engine = process.env.QA_TEST_ENGINE === 'webkit' ? webkit : chromium;
  server = await engine.launchServer({...(engine === chromium ? {channel:'chrome'} : process.env.QA_WEBKIT_EXECUTABLE ? {executablePath:process.env.QA_WEBKIT_EXECUTABLE} : {}),headless:true,timeout:30_000});
  browser = await engine.connect(server.wsEndpoint());
});
after(async () => {
  try { if (browser) await within(browser.close(),5000,'Test browser close'); }
  finally { if (server) await within(server.close(),5000,'Test server close').catch(()=>server.kill()); }
});

async function audit(name,{buttons=true,fixture,script='',httpStatus=200,canonical='https://toolblip.com/tools/test',entry={slug:'test',category:'Math',historicallyApproved:true},expectedEntry=entry,network}={}) {
  // Controlled harness pages only; production audits never mock tool responses.
  const html = `<html><head><meta charset="utf-8">${canonical === null ? '' : `<link rel="canonical" href="${canonical}">`}</head>
  <body><button aria-label="Decline analytics cookies" onclick="this.remove()">Decline</button><header><button>Examples</button><button>Clear</button></header>
  <div class="tb-v2-tool-card"><input aria-label="Answer">
  ${buttons ? '<button onclick="document.querySelector(\'input\').value=\'42\'">📋 Examples</button><button disabled>Clear</button>':''}
  <output>Ready</output></div><script>document.querySelector('input')['__reactProps$qa']={};${entry.canonicalAlias ? `history.replaceState(null,'','/tools/custom/new');` : ''}${script}</script></body></html>`;
  const wrapped = {newContext:async options=>{
    assert.equal(options.serviceWorkers,'allow');
    const context = await browser.newContext(options);
    await context.route('https://qa.invalid/**',async route=>{
      const url = new URL(route.request().url());
      if (network && url.pathname === network.pathname) return route.fulfill({status:network.status,body:'controlled network failure'});
      return route.fulfill({status:httpStatus,contentType:'text/html',body:html});
    });
    return context;
  }};
  return auditTool({browser:wrapped,entry,expectedEntry,fixture,
    options:{base:'https://qa.invalid'},expect,artifactsDir:path.join(artifacts,name)});
}

test('real browser: discovery cannot pass without a fixture and captures three layouts', async () => {
  const result = await audit('absent');
  assert.equal(result.status,'needs-fixture');
  assert.equal(result.functional.status,'needs-fixture');
  assert.equal(result.ui.status,'passed');
  assert.equal(result.cookies,'declined');
  assert.equal(result.ui.actions.clear[0].enabled,false);
  assert.equal(result.discovery.metadataChanged,true);
  assert.deepEqual(result.layouts.map(x=>x.width),[1280,390,320]);
  assert.equal((await readdir(path.join(artifacts,'absent'))).filter(x=>x.endsWith('.png')).length,3);
});

test('real browser: header actions cannot satisfy missing tool Examples/Clear', async () => {
  const result = await audit('missing-actions',{buttons:false});
  assert.equal(result.status,'failed');
  assert.equal(result.ui.problems.length,2);
  assert.equal(result.discovery.exampleClicked,false);
});

test('real browser: fixture interface exercises tool UI and known output', async () => {
  const result = await audit('passing',{fixture:{slug:'test',test:async({page,tool,check,expect,baseURL,artifactsDir})=>{
    assert.equal(page.url(),`${baseURL}/tools/test`);
    assert.ok(artifactsDir.endsWith('passing'));
    await tool.getByRole('button',{name:/Examples/}).click();
    await expect(tool.getByLabel('Answer')).toHaveValue('42');
    check(await tool.getByLabel('Answer').inputValue() === '42','Known answer is 42');
  }}});
  assert.equal(result.functional.status,'passed');
  assert.equal(result.status,'passed');
});

test('real browser: failed assertion stays failed', async () => {
  const result = await audit('assertion',{fixture:{slug:'test',test:async({check})=>check(false,'Incorrect output')}});
  assert.equal(result.status,'failed');
  assert.equal(result.functional.evidence[0].passed,false);
});

test('real browser: page errors and HTTP errors prevent overall success', async () => {
  const broken = await audit('page-error',{script:'throw Error("controlled product failure")',fixture:{slug:'test',test:async({check})=>check(true,'Independent answer')}});
  assert.equal(broken.status,'failed');
  assert.equal(broken.runtime.pageErrors.length,1);
  assert.equal(broken.runtime.pageErrors[0].phase,'navigation');
  const http = await audit('http-error',{httpStatus:500});
  assert.equal(http.status,'failed');
  assert.equal(http.http.code,500);
  assert.equal(http.functional.status,'needs-fixture');
});

const passingFixture = {slug:'test',test:async({check})=>check(true,'Known synthetic answer')};
test('canonical must be the absolute production URL even on a different base', async () => {
  for (const [name,canonical] of [['missing',null],['malformed','https://['],['relative','/tools/test'],['wrong','https://qa.invalid/tools/test']]) {
    const result = await audit(`canonical-${name}`,{canonical,fixture:passingFixture});
    assert.equal(result.canonical.status,'failed');
    assert.equal(result.status,'failed');
    assert.equal(result.functional.status,'passed');
  }
  const inventory = [{slug:'old',category:'Image',canonicalAlias:'new'},{slug:'new',category:'Text',url:'/tools/custom/new'}];
  const result = await audit('canonical-cross-category',{entry:inventory[0],expectedEntry:resolveDestination(inventory[0],inventory),canonical:'https://toolblip.com/tools/custom/new',fixture:passingFixture});
  assert.equal(result.route.status,'passed',JSON.stringify(result.errors));
  assert.equal(result.canonical.status,'passed');
  assert.equal(result.status,'passed');
});

test('browser resource errors have exact source URLs and HTTP evidence; real tool errors still fail',async()=>{
  const fixture = {slug:'test',test:async({page,check})=>{
    await page.evaluate(()=>fetch('/api/auth/me'));
    check(true,'Intentional anonymous request completed');
  }};
  const result = await audit('anonymous',{network:{pathname:'/api/auth/me',status:401},fixture});
  assert.equal(result.status,'passed',JSON.stringify(result.runtime));
  assert.equal(result.runtime.httpErrors[0].blocking,false);
  assert.ok(result.runtime.consoleErrors.length > 0);
  assert.ok(result.runtime.consoleErrors.every(r=>r.source.url === 'https://qa.invalid/api/auth/me' && r.httpEvidence === 'httpErrors[0]'));
  const broken = await audit('anonymous-and-tool-error',{network:{pathname:'/api/auth/me',status:401},fixture,script:'throw Error("real tool error")'});
  assert.equal(broken.runtime.status,'failed');
  assert.equal(broken.status,'failed');
});

test('intentional HTTP failure preserves evidence and requires an independent assertion',async()=>{
  const fixture = {
    slug:'test',
    expectedHttpErrors:[{pathname:'/api/controlled',status:503,reason:'Intentional network failure'}],
    expectedConsoleErrors:[{pathname:'/api/controlled',status:503,text:'Failed to load resource: the server responded with a status of 503 (Service Unavailable)'}],
    test:async({page,check})=>check(await page.evaluate(async()=> (await fetch('/api/controlled')).status) === 503,'Known controlled failure status'),
  };
  const result=await audit('expected-http',{network:{pathname:'/api/controlled',status:503},fixture});
  assert.equal(result.status,'passed',JSON.stringify(result.runtime));
  assert.equal(result.runtime.httpErrors[0].classification,'expected-fixture-http');
  assert.equal(result.runtime.consoleErrors[0].httpEvidence,'httpErrors[0]');
  const empty=await audit('expected-http-no-assertion',{network:{pathname:'/api/controlled',status:503},fixture:{...fixture,test:async({page})=>page.evaluate(()=>fetch('/api/controlled').then(r=>r.status))}});
  assert.equal(empty.status,'failed');
  assert.equal(empty.functional.status,'failed');
});

test('framework resource completion does not prove tool hydration', async () => {
  const result = await audit('delayed-hydration', {
    script: `delete document.querySelector('input')['__reactProps$qa'];
      fetch('/_next/static/delayed.js').then(() => setTimeout(() => {
        document.querySelector('input')['__reactProps$qa'] = {};
      }, 1500));`,
    fixture: {slug:'test',test:async({page,check}) => {
      check(await page.evaluate(() => '__reactProps$qa' in document.querySelector('input')), 'Tool hydration completed before fixture actions');
    }},
  });
  assert.equal(result.functional.status, 'passed');
  assert.equal(result.hydration.evidence, 'react-tool-descendants');
});

test('streamed canonical metadata is awaited after tool hydration', async () => {
  const result = await audit('streamed-canonical', {
    canonical: null,
    script: `delete document.querySelector('input')['__reactProps$qa'];
      setTimeout(() => {
        const link = document.createElement('link');
        link.rel = 'canonical'; link.href = 'https://toolblip.com/tools/test';
        document.head.append(link);
        document.querySelector('input')['__reactProps$qa'] = {};
      }, 2200);`,
    fixture: {slug:'test',test:async({tool,check,expect})=>{
      await tool.getByRole('button',{name:/Examples/}).click();
      await expect(tool.getByLabel('Answer')).toHaveValue('42');
      check(true,'Known answer after streamed metadata');
    }},
  });
  assert.equal(result.canonical.status,'passed');
  assert.equal(result.status,'passed');
});


test('real browser: intentional request abort retains exact evidence without masking application errors', async () => {
  const result = await audit('injected-abort', {fixture:{slug:'test',test:async({page,abortExpectedRequest,check})=>{
    await page.route('https://qa.invalid/injected-failure', route=>abortExpectedRequest(route, 'Controlled rejection exercises application error state'));
    const rejected = await page.evaluate(async()=> {try {await fetch('/injected-failure');return false;} catch {return true;}});
    check(rejected, 'Actual intercepted request rejects in browser');
  }}});
  assert.equal(result.functional.status,'passed');
  assert.equal(result.runtime.status,'passed');
  const failure = result.runtime.failedRequests.find(request=>request.url.endsWith('/injected-failure'));
  assert.ok(failure.injectedAbort.requestId);
  assert.equal(failure.requestId,failure.injectedAbort.requestId);
});
