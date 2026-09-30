#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const selected = {
  all: ['fixed', 'site', 'core', 'blog', 'tools'],
  'blog-core': ['site', 'core', 'blog'],
  tools: ['fixed', 'site', 'tools'],
  fixed: ['fixed', 'site'],
  performance: ['site'],
};
const paths = {
  fixed: 'test-results/gsc-recovery', site: 'test-results/gsc-site-performance',
  core: 'test-results/gsc-sitemap-inspection-core',
  blog: 'test-results/gsc-sitemap-inspection-blog',
  tools: 'test-results/gsc-sitemap-inspection',
};

export async function runWorkflow({ group = 'all', event = 'workflow_dispatch', execute }) {
  if (event === 'schedule' || group === 'schedule') group = 'all';
  if (!Object.hasOwn(selected, group)) throw new Error('Invalid inspection_group');
  const reports = {}, skipped = {}, lines = ['# GSC collection summary', ''];
  let quotaSource;
  for (const name of ['fixed', 'site', 'core', 'blog', 'tools']) {
    if (!selected[group].includes(name)) { skipped[name] = 'not selected'; continue; }
    if (quotaSource && name !== 'site') { skipped[name] = `quota exhausted by ${quotaSource}`; continue; }
    try { reports[name] = await execute(name); }
    catch { reports[name] = { status: 'failed', error: 'COLLECTOR_FAILED' }; }
    if (name !== 'site' && reports[name]?.stopReason === 'HTTP_429') quotaSource = name;
  }
  for (const name of ['fixed', 'site', 'core', 'blog', 'tools']) {
    if (skipped[name]?.startsWith('quota')) lines.push(`${name}: skipped due to HTTP_429 (${skipped[name]}). No URL Inspection request started.`);
    else if (skipped[name]) lines.push(`${name}: skipped by selection.`);
    else lines.push(`${name}: ${reports[name]?.status ?? 'failed'}${reports[name]?.stopReason ? `; stopped ${reports[name].stopReason}` : ''}.`);
  }
  lines.push('', 'Skipped inspections have no index verdict. Search Analytics is collected independently.');
  return { status: Object.values(reports).every(report => report?.status === 'complete') ? 'complete' : 'partial-failure', reports, skipped, summary: `${lines.join('\n')}\n` };
}

export async function executeCollector(name, { reportPath = `${paths[name]}/report.json`, spawn = spawnSync } = {}) {
  const args = name === 'fixed' ? ['scripts/gsc-recovery.mjs']
    : name === 'site' ? ['scripts/gsc-site-performance.mjs']
      : ['scripts/gsc-sitemap-inspection.mjs', '--sitemap', name];
  // Clear this collector's generated artifacts before spawning the child.
  for (const path of [reportPath, reportPath.replace(/\.json$/, '.md')]) {
    try { await unlink(path); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  let child;
  try { child = spawn(process.execPath, args, { stdio: 'inherit', env: process.env }); }
  catch { return { status: 'failed', error: 'COLLECTOR_FAILED' }; }
  const failed = child.error || child.signal || child.status !== 0;
  try {
    const report = JSON.parse(await readFile(reportPath, 'utf8'));
    if (failed && report?.status === 'complete') return { status: 'failed', error: 'COLLECTOR_FAILED' };
    return report;
  } catch { return { status: 'failed', error: failed ? 'COLLECTOR_FAILED' : 'REPORT_UNAVAILABLE' }; }
}

export async function main(group = process.env.INSPECTION_GROUP || 'all') {
  const result = await runWorkflow({ group, event: process.env.GITHUB_EVENT_NAME || 'workflow_dispatch', execute: executeCollector });
  await mkdir('test-results/gsc-workflow', { recursive: true });
  await writeFile('test-results/gsc-workflow/report.json', `${JSON.stringify({ status: result.status, skipped: result.skipped }, null, 2)}\n`);
  await writeFile('test-results/gsc-workflow/report.md', result.summary);
  return result.status === 'complete' ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { process.exitCode = await main(); }
  catch { console.error('GSC workflow: invalid selection or orchestration failure.'); process.exitCode = 1; }
}
