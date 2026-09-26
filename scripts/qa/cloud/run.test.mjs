import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { verifyDeployment, assertSource, childEnvironment, verifyAggregate, main } from './run.mjs';
const config = JSON.parse(await readFile(new URL('./pilot.json', import.meta.url)));
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
  const good = { metadata: { revision:config.source,engine:'chrome',workingDiffHash:'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',selectedSlugs:['one'] }, summary:{exitCode:0}, results:[{slug:'one',status:'passed',functional:{status:'passed'}}],incompleteSlugs:[] };
  assert.doesNotThrow(() => verifyAggregate(good,config,'chrome',0));
  assert.throws(() => verifyAggregate({...good,results:[]},config,'chrome',0));
  assert.throws(() => verifyAggregate({...good,incompleteSlugs:['one']},config,'chrome',0));
  assert.throws(() => verifyAggregate({...good,results:[{slug:'one',status:'failed',functional:{status:'failed'}}]},config,'chrome',0));
  assert.throws(() => verifyAggregate(good,config,'webkit',0));
});
