import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runWorkflow, executeCollector } from './gsc-workflow.mjs';

const expected = {
  schedule: ['fixed', 'site', 'core', 'blog', 'tools'],
  all: ['fixed', 'site', 'core', 'blog', 'tools'],
  'blog-core': ['site', 'core', 'blog'],
  tools: ['fixed', 'site', 'tools'],
  fixed: ['fixed', 'site'],
  performance: ['site'],
};

test('schedule and every manual selection run the intended collectors', async () => {
  for (const [group, names] of Object.entries(expected)) {
    const calls = [];
    const result = await runWorkflow({ group, execute: async name => { calls.push(name); return { status: 'complete' }; } });
    assert.deepEqual(calls, names);
    assert.equal(result.status, 'complete');
  }
  for (const group of ['all', 'blog-core', 'tools', 'fixed', 'performance']) {
    const calls = [];
    await runWorkflow({ event: 'schedule', group, execute: async name => { calls.push(name); return { status: 'complete' }; } });
    assert.deepEqual(calls, expected.all);
  }
});

test('performance selection runs only sitewide analytics and records inspection skips', async () => {
  const calls = [];
  const result = await runWorkflow({ group: 'performance', execute: async name => {
    calls.push(name);
    return { status: 'complete' };
  } });
  assert.deepEqual(calls, ['site']);
  assert.equal(result.status, 'complete');
  for (const name of ['fixed', 'core', 'blog', 'tools']) {
    assert.equal(result.skipped[name], 'not selected');
    assert.equal(result.reports[name], undefined);
  }
  assert.equal(result.skipped.site, undefined);
  const failed = await runWorkflow({ group: 'performance', execute: async () => ({ status: 'partial-failure' }) });
  assert.equal(failed.status, 'partial-failure');
  assert.equal(failed.skipped.fixed, 'not selected');
});

test('collector does not accept a stale success report after child failure', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gsc-workflow-test-'));
  const reportPath = join(dir, 'report.json');
  try {
    writeFileSync(reportPath, JSON.stringify({ status: 'complete' }));
    writeFileSync(join(dir, 'report.md'), 'old summary');
    const report = await executeCollector('site', { reportPath, spawn: () => ({ status: 1 }) });
    assert.equal(report.status, 'failed');
    assert.notEqual(report.error, undefined);
    assert.equal(existsSync(reportPath), false);
    assert.equal(existsSync(join(dir, 'report.md')), false);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('collector retains a fresh partial report from a nonzero child', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gsc-workflow-test-'));
  const reportPath = join(dir, 'report.json');
  try {
    const report = await executeCollector('site', { reportPath, spawn: () => {
      writeFileSync(reportPath, JSON.stringify({ status: 'partial-failure', stopReason: 'HTTP_429' }));
      return { status: 1 };
    } });
    assert.deepEqual(report, { status: 'partial-failure', stopReason: 'HTTP_429' });
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('collector treats spawn errors and nonzero exits with complete reports as failures', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gsc-workflow-test-'));
  const reportPath = join(dir, 'report.json');
  try {
    for (const result of [{ status: null, error: new Error('private data') }, { status: 1 }]) {
      const report = await executeCollector('site', { reportPath, spawn: () => {
        writeFileSync(reportPath, JSON.stringify({ status: 'complete' }));
        return result;
      } });
      assert.deepEqual(report, { status: 'failed', error: 'COLLECTOR_FAILED' });
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('429 from fixed, core or blog suppresses later URL Inspection but not site analytics', async () => {
  for (const source of ['fixed', 'core', 'blog']) {
    const calls = [];
    const result = await runWorkflow({ group: 'all', execute: async name => {
      calls.push(name);
      return name === source ? { status: 'partial-failure', stopReason: 'HTTP_429' } : { status: 'complete' };
    } });
    assert.ok(calls.includes('site'));
    assert.deepEqual(calls, source === 'fixed' ? ['fixed', 'site'] : source === 'core' ? ['fixed', 'site', 'core'] : ['fixed', 'site', 'core', 'blog']);
    assert.equal(result.skipped.tools, `quota exhausted by ${source}`);
    assert.match(result.summary, /skipped due to HTTP_429/);
  }
});

test('selection and quota skips are distinct and never called', async () => {
  const result = await runWorkflow({ group: 'fixed', execute: async () => ({ status: 'complete' }) });
  assert.equal(result.skipped.core, 'not selected');
  assert.doesNotMatch(result.summary, /quota exhausted/);
});
