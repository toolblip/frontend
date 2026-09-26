import test from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs, selectTools, toolURL, executeFixture, actionProblems, summarize } from './core.mjs';

test('CLI defaults, filters and strict validation', () => {
  const args = parseArgs(['--inventory', 'inventory.json', '--group', 'images', '--slugs', 'sharpen,unblur', '--out', '/tmp/qa']);
  assert.equal(args.base, 'https://toolblip.com');
  assert.equal(args.concurrency, 2);
  const rows = [{slug:'sharpen',group:'images'}, {slug:'unblur',group:'images',canonicalAlias:'sharpen'}, {slug:'other',group:'text'}];
  assert.equal(selectTools(rows, args).length, 2);
  assert.throws(() => selectTools(rows, {...args,slugs:['typo']}), /Unknown slug/);
  for (const value of ['0','5','2.5','NaN']) assert.throws(() => parseArgs(['--concurrency',value]), /concurrency/);
  assert.throws(() => parseArgs(['--engine','firefox']), /engine/);
  assert.throws(() => parseArgs(['--resume']), /Unknown option/);
  assert.throws(() => parseArgs(['--group','--out','foo']), /value|argument/);
});

test('inventory paths and aliases preserve preview base paths', () => {
  assert.equal(toolURL({slug:'x',category:'Image'}, 'http://localhost:3000/preview'), 'http://localhost:3000/preview/tools/images/x');
  assert.equal(toolURL({slug:'old',url:'https://toolblip.com/tools/images/old',canonicalAlias:'new'}, 'https://toolblip.com'), 'https://toolblip.com/tools/images/old');
});

test('historical approval and absent fixtures never pass', async () => {
  const result = await executeFixture(undefined, {historicallyApproved:true});
  assert.equal(result.status, 'needs-fixture');
});

test('zero checks, failed checks even when caught, and expect errors never pass', async () => {
  assert.equal((await executeFixture({test:async()=>{}}, {})).status, 'failed');
  const failed = await executeFixture({test:async({check})=>{try {check(false,'wrong bytes');} catch {} check(true,'rendered');}}, {});
  assert.equal(failed.status, 'failed');
  assert.equal(failed.evidence.length, 2);
  assert.equal((await executeFixture({test:async({check})=>{check(true,'answer'); throw Error('expect mismatch');}}, {})).status, 'failed');
  assert.equal((await executeFixture({test:async({check})=>check(true,'independent known answer')}, {})).status, 'passed');
});

test('fixture timeout is bounded', async () => {
  const result = await executeFixture({test:()=>new Promise(()=>{})}, {}, 10);
  assert.equal(result.status, 'failed');
  assert.match(result.error.message, /timeout/);
});

test('Examples and Clear are required; disabled empty Clear is allowed', () => {
  assert.equal(actionProblems(undefined, {examples:[],clear:[]}).length, 2);
  assert.deepEqual(actionProblems(undefined, {examples:[{visible:true,enabled:true}],clear:[{visible:true,enabled:false}]}), []);
  assert.deepEqual(actionProblems({requiresExample:false,requiresClear:false,exceptionReason:'Reference table'}, {examples:[],clear:[]}), []);
});

test('summary distinguishes missing fixtures from failures, including both together', () => {
  const summary = summarize([{status:'needs-fixture',functional:{status:'needs-fixture'}},{status:'failed',functional:{status:'needs-fixture'}},{status:'passed',functional:{status:'passed'}}]);
  assert.equal(summary.needsFixture, 2);
  assert.equal(summary.failed, 1);
  assert.equal(summary.exitCode, 3);
  assert.equal(summarize([{status:'needs-fixture',functional:{status:'needs-fixture'}}]).exitCode, 2);
});

test('cleanup deadlines reject hung operations', async () => {
  const { within } = await import('./core.mjs');
  await assert.rejects(within(new Promise(()=>{}),10,'close'), /close timeout/);
  assert.equal(await within(Promise.resolve('closed'),10,'close'),'closed');
});

test('pending-only excludes human approved rows only when requested', () => {
  const rows = [{slug:'old',historicallyApproved:true},{slug:'pending'}];
  assert.deepEqual(selectTools(rows,parseArgs(['--pending-only'])).map(t=>t.slug),['pending']);
  assert.equal(selectTools(rows,{}).length,2);
});

test('alias destinations come from the full inventory across categories', async () => {
  const { resolveDestination } = await import('./core.mjs');
  const rows = [{slug:'old',category:'Image',canonicalAlias:'new'},{slug:'new',category:'Text',url:'/tools/custom/new'}];
  assert.equal(toolURL(resolveDestination(rows[0],rows),'https://toolblip.com'),'https://toolblip.com/tools/custom/new');
  assert.throws(()=>resolveDestination(rows[0],[rows[0]]),/alias/i);
});
