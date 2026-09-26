import test from 'node:test';
import assert from 'node:assert/strict';
import { stripDevUpgradeCSP } from './browser.mjs';
async function probe(url,type) {
  const events=[];
  const route={request:()=>({url:()=>url,resourceType:()=>type}),continue:async()=>events.push('continue'),fetch:async()=>({headers:()=>({'content-security-policy':"default-src 'self'; upgrade-insecure-requests; connect-src 'self'",'content-security-policy-report-only':"script-src 'self'; upgrade-insecure-requests"})}),fulfill:async value=>events.push(value.headers)};
  await stripDevUpgradeCSP(route);
  return events;
}
test('local WebP worker and documents lose only upgrade directive',async()=>{
  for(const [url,type] of [['http://localhost:3190/codecs/webp-converter/webp-worker.js','script'],['http://localhost:3190/tools/images/crop','document']]){
    const [headers]=await probe(url,type);
    assert.equal(headers['content-security-policy'],"default-src 'self'; connect-src 'self'");
    assert.equal(headers['content-security-policy-report-only'],"script-src 'self'");
  }
});
test('ordinary and external scripts retain their complete original policy',async()=>{
  for(const url of ['http://localhost:3190/app.js','https://external.invalid/codecs/webp-converter/webp-worker.js']) assert.deepEqual(await probe(url,'script'),['continue']);
});
