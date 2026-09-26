import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { verifyDeployment, assertSource, childEnvironment, verifyAggregate, selectGroup, waitForAudit, main } from './run.mjs';
const reviewed = JSON.parse(await readFile(new URL('./pilot.json', import.meta.url)));
const config = { ...reviewed, group: 'developer-data' };
const deployment = { id: config.deploymentId, sha: config.deployedMerge, environment: config.environment };
test('only exact latest successful production identity is accepted', () => {
  assert.doesNotThrow(() => verifyDeployment(config, deployment, [{ state: 'success' }]));
  for (const patch of [{ id: 1 }, { sha: 'other' }, { environment: 'preview' }]) assert.throws(() => verifyDeployment(config, { ...deployment, ...patch }, [{state:'success'}]));
  for (const state of ['pending', 'failure', 'inactive', 'error']) assert.throws(() => verifyDeployment(config, deployment, [{ state }]));
  assert.throws(() => verifyDeployment(config, null, []));
});
test('source must have exact deployed SHA/tree and no tracked changes', () => {
  assert.doesNotThrow(() => assertSource(config, config.source, config.tree, ''));
  assert.throws(() => assertSource(config, 'wrong', config.tree, ''));
  assert.throws(() => assertSource(config, config.source, 'wrong', ''));
  assert.throws(() => assertSource(config, config.source, config.tree, '', 'wrong-deployment-tree'));
  assert.throws(() => assertSource(config, config.source, config.tree, ' M app/layout.tsx'));
});
test('browser child receives no API/action credentials', () => {
  assert.deepEqual(childEnvironment({ PATH:'/bin', GH_TOKEN:'test', GITHUB_TOKEN:'test', ACTIONS_RUNTIME_TOKEN:'test', ACTIONS_ID_TOKEN_REQUEST_URL:'test', SECRET_KEY:'test' }), { PATH:'/bin' });
});
test('local launch is rejected before browser imports', async () => {
  if (process.env.GITHUB_ACTIONS !== 'true') await assert.rejects(main(), /only on a GitHub-hosted Linux runner/);
});
test('sanitized inventory includes the complete pilot and valid canonical targets', async () => {
  const { tools } = JSON.parse(await readFile(new URL('./inventory.json', import.meta.url)));
  assert(tools.some(t => t.group === config.group));
  assert.equal(new Set(tools.map(t => t.slug)).size, tools.length);
  for (const tool of tools) {
    assert.deepEqual(Object.keys(tool).filter(k => !['slug','name','category','url','historicallyApproved','canonicalAlias','group'].includes(k)), []);
    if (tool.canonicalAlias) assert(tools.some(t => t.slug === tool.canonicalAlias));
  }
});

test('aggregate cannot silently omit results or approve human-review failures', () => {
  const good = { metadata: { revision:config.source,engine:'chrome',workingDiffHash:'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',options:{group:config.group,'pending-only':true},selectedSlugs:['one'] }, summary:{exitCode:0}, results:[{slug:'one',status:'passed',functional:{status:'passed'}}],incompleteSlugs:[] };
  assert.doesNotThrow(() => verifyAggregate(good,config,'chrome',0,['one']));
  assert.throws(() => verifyAggregate({...good,results:[]},config,'chrome',0,['one']));
  assert.throws(() => verifyAggregate({...good,incompleteSlugs:['one']},config,'chrome',0,['one']));
  assert.throws(() => verifyAggregate({...good,results:[{slug:'one',status:'failed',functional:{status:'failed'}}]},config,'chrome',0,['one']));
  assert.throws(() => verifyAggregate(good,config,'webkit',0,['one']));
});

test('every pending tool belongs to exactly one nonempty reviewed group', async () => {
  const inventory = JSON.parse(await readFile(new URL('./inventory.json', import.meta.url)));
  const selected = reviewed.groups.flatMap(group => {
    const result = selectGroup(reviewed, inventory, group);
    assert.equal(result.config.group, group);
    return result.selectedSlugs;
  });
  assert.equal(new Set(selected).size, selected.length);
  assert.deepEqual([...selected].sort(), inventory.tools.filter(t => !t.historicallyApproved).map(t => t.slug).sort());
  assert.throws(() => selectGroup(reviewed, inventory, '--other'), /Unknown/);
  assert.throws(() => selectGroup(reviewed, {tools:[]}, reviewed.groups[0]), /empty/);
  assert.throws(() => selectGroup({...reviewed,auditTimeoutMs:Infinity}, inventory, reviewed.groups[0]), /bounded/);
});
test('matrix and artifact names cover exactly the reviewed groups on both engines', async () => {
  const { default: yaml } = await import('js-yaml');
  const workflow = yaml.load(await readFile(new URL('../../../.github/workflows/tool-qa.yml',import.meta.url),'utf8'));
  const job = workflow.jobs['production-audit'];
  assert.equal(job.strategy['max-parallel'],2);
  assert.equal(job.strategy['fail-fast'],false);
  assert.deepEqual(job.strategy.matrix.engine,['chrome','webkit']);
  assert.deepEqual([...job.strategy.matrix.group].sort(),[...reviewed.groups].sort());
  assert.equal(job.steps.find(step => step.id === 'artifact').with.name,'production-${{ matrix.group }}-${{ matrix.engine }}-${{ github.run_id }}-${{ github.run_attempt }}');
  assert(job['timeout-minutes']*60000 > reviewed.auditTimeoutMs+10000);
});
test('aggregate rejects a partial group, different group or narrowed slug selection', () => {
  const good = { metadata: { revision:config.source,engine:'chrome',workingDiffHash:'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',options:{group:config.group,'pending-only':true},selectedSlugs:['one'] }, summary:{exitCode:0}, results:[{slug:'one',status:'passed',functional:{status:'passed'}}],incompleteSlugs:[] };
  assert.throws(() => verifyAggregate(good,config,'chrome',0,['one','two']), /selection/);
  for (const options of [{group:'images','pending-only':true},{group:config.group,'pending-only':false},{group:config.group,'pending-only':true,slugs:['one']}]) {
    assert.throws(() => verifyAggregate({...good,metadata:{...good.metadata,options}},config,'chrome',0,['one']), /selection/);
  }
});

test('audit deadline stops a stalled child and cannot become a success', async () => {
  const { EventEmitter } = await import('node:events');
  const child = new EventEmitter(), signals = [];
  let timeout = false;
  child.kill = signal => { signals.push(signal); if (signal === 'SIGKILL') child.emit('exit', null); };
  assert.equal(await waitForAudit(child, 5, () => { timeout = true; }, 5), 1);
  assert.equal(timeout,true); assert.deepEqual(signals,['SIGTERM','SIGKILL']);
});
test('normal child completion preserves its failure code without a timeout', async () => {
  const { EventEmitter } = await import('node:events');
  const child = new EventEmitter();
  const pending = waitForAudit(child, 1000, () => assert.fail('unexpected timeout'));
  child.emit('exit',2);
  assert.equal(await pending,2);
});
