import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyRuntime } from './runtime.mjs';
const base = 'https://toolblip.com';
const http = (pathname,status=401,method='GET') => ({url:base+pathname,status,method});
const console401 = url => ({text:'Failed to load resource: the server responded with a status of 401 (Unauthorized)',source:{url}});
const runtime = (httpErrors=[],consoleErrors=[],pageErrors=[])=>({httpErrors,consoleErrors,pageErrors,failedRequests:[]});

test('anonymous GET 401 and explicitly linked browser console retain raw evidence',()=>{
  const r=runtime([http('/api/auth/me')],[console401(base+'/api/auth/me')]);
  classifyRuntime(r,base);
  assert.equal(r.status,'passed');
  assert.equal(r.httpErrors[0].blocking,false);
  assert.equal(r.consoleErrors[0].httpEvidence,'httpErrors[0]');
  assert.match(r.httpErrors[0].reason,/anonymous/i);
});

test('no blanket HTTP or console filtering, even alongside a known probe',()=>{
  for (const bad of [http('/other'),http('/api/auth/me',500),http('/api/auth/me',401,'POST'),{...http('/api/auth/me'),url:'https://other.invalid/api/auth/me'}]) {
    const r=runtime([http('/api/auth/me'),bad]); classifyRuntime(r,base); assert.equal(r.status,'failed');
  }
  for (const bad of [console401(''),console401(base+'/other'),{text:'tool failure',source:{url:base+'/api/auth/me'}}]) {
    const r=runtime([http('/api/auth/me')],[bad]); classifyRuntime(r,base); assert.equal(r.status,'failed');
  }
});

test('only the precise analytics script CSP observation is shared and nonblocking',()=>{
  const text="Refused to load the script 'https://static.cloudflareinsights.com/beacon.min.js/v123' because it violates the following Content Security Policy directive: script-src 'self'";
  const r=runtime([], [{text}]); classifyRuntime(r,base);
  assert.equal(r.status,'passed'); assert.equal(r.consoleErrors[0].classification,'shared-environment');
  for (const bad of [text.replace('beacon.min.js/v123','other.js'),text.replace('load the script','connect to'), 'tool error https://static.cloudflareinsights.com/beacon.min.js']) {
    const r=runtime([], [{text:bad}]); classifyRuntime(r,base); assert.equal(r.status,'failed');
  }
  const broken=runtime([], [{text}], [{message:'actual tool failure'}]); classifyRuntime(broken,base); assert.equal(broken.status,'failed');
});

test('fixture exceptions require exact pathname/status and console text plus linked response',()=>{
  const fixture={expectedHttpErrors:[{pathname:'/api/test',status:503,reason:'Intentional failure case'}],expectedConsoleErrors:[{pathname:'/api/test',status:503,text:'Failed to load resource: the server responded with a status of 503 (Service Unavailable)'}]};
  const c={text:fixture.expectedConsoleErrors[0].text,source:{url:base+'/api/test'}};
  const r=runtime([http('/api/test',503)],[c]); classifyRuntime(r,base,fixture); assert.equal(r.status,'passed');
  for(const r of [runtime([], [c]),runtime([http('/api/test/extra',503)],[c]),runtime([http('/api/test',500)],[c]),runtime([http('/api/test',503)],[{...c,text:'actual tool error'}])]) {
    classifyRuntime(r,base,fixture); assert.equal(r.status,'failed');
  }
  assert.throws(()=>classifyRuntime(runtime(),base,{expectedConsoleErrors:[{text:'.*'}]}),/expectedConsoleErrors/);
});

test('WebKit unquoted script CSP wording is recognized without relaxing other directives',()=>{
  const text='Refused to load https://static.cloudflareinsights.com/beacon.min.js/v123 because it does not appear in the script-src directive of the Content Security Policy.';
  const r=runtime([], [{text}]); classifyRuntime(r,base); assert.equal(r.status,'passed');
  const bad=runtime([], [{text:text.replace('script-src','connect-src')}]); classifyRuntime(bad,base); assert.equal(bad.status,'failed');
});

test('environment summary retains unresolved observations and raw evidence links', async()=>{
  const { environmentObservations } = await import('./runtime.mjs');
  const text='Refused to load https://static.cloudflareinsights.com/beacon.min.js/v123 because it does not appear in the script-src directive of the Content Security Policy.';
  const r=runtime([http('/api/auth/me')],[{text},console401(base+'/api/auth/me')]);
  classifyRuntime(r,base);
  const summary=environmentObservations([{slug:'test',runtime:r}]);
  assert.equal(summary.count,1);
  assert.equal(summary.status,'observed-unresolved');
  assert.deepEqual(summary.affectedTools,['test']);
  assert.equal(summary.observations[0].evidence,'tools/test.json#runtime.consoleErrors[0]');
  assert.equal(summary.observations[0].text,text);
  assert.equal(r.httpErrors.length,1);
  assert.equal(r.consoleErrors.length,2);
});

test('HTTP rules cannot suppress arbitrary console errors or broaden to other origins',()=>{
  const fixture={expectedHttpErrors:[{pathname:'/api/test',status:503,reason:'Intentional failure'}]};
  const c={text:'Failed to load resource: the server responded with a status of 503 (Service Unavailable)',source:{url:base+'/api/test'}};
  const r=runtime([http('/api/test',503)],[c]); classifyRuntime(r,base,fixture); assert.equal(r.status,'failed');
  const external=runtime([{...http('/api/test',503),url:'https://other.invalid/api/test'}]); classifyRuntime(external,base,fixture); assert.equal(external.status,'failed');
  for (const pathname of ['*','/api/*','//other.invalid/api','/api/test?all=true']) assert.throws(()=>classifyRuntime(runtime(),base,{expectedHttpErrors:[{pathname,status:503,reason:'Invalid broad rule'}]}),/expectedHttpErrors/);
});

const injectedFailure = (extra={}) => ({url:base+'/lookup',requestId:'request-1',sequence:4,failure:{errorText:'net::ERR_FAILED'},injectedAbort:{requestId:'request-1',sequence:2,errorCode:'failed',reason:'Controlled lookup failure'},...extra});
const abortConsole = (extra={}) => ({text:'Failed to load resource: net::ERR_FAILED',source:{url:base+'/lookup'},sequence:3,...extra});
test('explicit injected abort links strict resource console evidence to the exact failed request',()=>{
  for (const text of ['Failed to load resource: net::ERR_FAILED','Failed to load resource: An error occurred while loading the resource.']) {
    const r=runtime([], [abortConsole({text})]); r.failedRequests=[injectedFailure()];
    classifyRuntime(r,base); assert.equal(r.status,'passed');
    assert.equal(r.consoleErrors[0].failedRequestEvidence,'failedRequests[0]');
    assert.equal(r.failedRequests[0].classification,'expected-fixture-abort');
  }
});
test('abort allowance rejects earlier same-URL errors, arbitrary text, missing evidence, and mismatched identity',()=>{
  for (const [c,f] of [
    [abortConsole({sequence:1}),injectedFailure()],
    [abortConsole({text:'tool failure'}),injectedFailure()],
    [abortConsole({source:{url:base+'/other'}}),injectedFailure()],
    [abortConsole(),injectedFailure({injectedAbort:undefined})],
    [abortConsole(),injectedFailure({requestId:'other'})],
    [abortConsole(),injectedFailure({failure:{errorText:'net::ERR_CONNECTION_REFUSED'}})],
  ]) { const r=runtime([], [c]); r.failedRequests=[f]; classifyRuntime(r,base); assert.equal(r.status,'failed'); }
});
test('ambiguous same-URL real failures and duplicate console records remain blocking',()=>{
  const r=runtime([], [abortConsole()]); r.failedRequests=[injectedFailure(),{url:base+'/lookup',requestId:'real',sequence:1,failure:{errorText:'net::ERR_FAILED'}}];
  classifyRuntime(r,base); assert.equal(r.status,'failed');
  const duplicate=runtime([], [abortConsole(),abortConsole({sequence:5})]); duplicate.failedRequests=[injectedFailure()];
  classifyRuntime(duplicate,base); assert.equal(duplicate.status,'failed');
});

test('earlier same-URL console remains blocking alongside an allowed later injected error',()=>{
  const r=runtime([], [abortConsole({sequence:1}),abortConsole()]); r.failedRequests=[injectedFailure()];
  classifyRuntime(r,base); assert.equal(r.status,'failed');
  assert.equal(r.consoleErrors[0].blocking,true); assert.equal(r.consoleErrors[1].blocking,false);
});
test('sequential explicit failures pair one-to-one while overlapping injections are ambiguous',()=>{
  const second=injectedFailure({requestId:'request-2',sequence:8,injectedAbort:{requestId:'request-2',sequence:6,errorCode:'failed',reason:'Second controlled failure'}});
  const r=runtime([], [abortConsole(),abortConsole({sequence:7})]); r.failedRequests=[injectedFailure(),second];
  classifyRuntime(r,base); assert.equal(r.status,'passed');
  assert.equal(r.consoleErrors[1].failedRequestEvidence,'failedRequests[1]');
  const ambiguous=runtime([], [abortConsole({sequence:7})]); ambiguous.failedRequests=[injectedFailure(),second];
  classifyRuntime(ambiguous,base); assert.equal(ambiguous.status,'failed');
});
