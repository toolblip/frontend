// Production supplemental evidence only; never registers automatic approvals.
import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

if (process.env.GITHUB_ACTIONS !== 'true' || process.env.RUNNER_OS !== 'Linux' || process.env.RUNNER_ENVIRONMENT !== 'github-hosted')
  throw Error('Supplemental QA requires a GitHub-hosted Linux runner.');
const [source, out, engine] = process.argv.slice(2);
if (!source || !out || !['chrome', 'webkit'].includes(engine)) throw Error('Usage: hosted-supplemental.mjs SOURCE OUT ENGINE');
const checkout = path.resolve(source), output = path.resolve(out), directory = path.dirname(fileURLToPath(import.meta.url));
if (output === checkout || output.startsWith(checkout + path.sep)) throw Error('Evidence must be outside checkout.');
await mkdir(output, { recursive: true });
const { verifyDeployment, assertSource, childEnvironment, waitForAudit } = await import('./cloud/run.mjs');
const config = JSON.parse(await readFile(path.join(directory, 'cloud/pilot.json'), 'utf8'));
if (config.repository !== 'toolblip/frontend' || config.baseURL !== 'https://toolblip.com') throw Error('Unexpected reviewed production target');
const slugs = ['lorem-ipsum-generator', 'json-to-markdown-table', 'reading-time-calculator', 'paragraph-counter', 'random-color-generator'];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const git = (...args) => execFileSync('git', args, { cwd: checkout, encoding: 'utf8' }).trim();
const sourceState = () => ({ sha: git('rev-parse', 'HEAD'), tree: git('rev-parse', 'HEAD^{tree}'), status: git('status', '--porcelain', '--untracked-files=no') });
const save = (file, value) => writeFile(path.join(output, file), JSON.stringify(value, null, 2) + '\n');
const provenance = { purpose: 'supplemental-only-not-automatic-approval', config, engine, slugs, workflowRevision: process.env.QA_WORKFLOW_REVISION, runId: process.env.GITHUB_RUN_ID, runAttempt: process.env.GITHUB_RUN_ATTEMPT, runURL: `https://github.com/${config.repository}/actions/runs/${process.env.GITHUB_RUN_ID}`, startedAt: new Date().toISOString(), sourceBefore: sourceState(), deployedTree: git('rev-parse', `${config.deployedMerge}^{tree}`), cspOverride: false };
const files = ['scripts/qa/run.mjs', 'scripts/qa/browser.mjs', 'scripts/qa/runtime.mjs', 'scripts/qa/helpers/images-real-capabilities.mjs', 'scripts/qa/cases/historical-regressions.mjs'];
const sourceHashes = async () => Object.fromEntries(await Promise.all(files.map(async file => [file, hash(await readFile(path.join(checkout, file)))])));
provenance.sourceFilesBefore = await sourceHashes();
provenance.inventorySha256 = hash(await readFile(path.join(directory, 'cloud/inventory.json')));
const api = async route => {
  const response = await fetch(`https://api.github.com/repos/${config.repository}/${route}`, { headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${process.env.GH_TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28' }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw Error(`Deployment API returned HTTP ${response.status}`);
  return response.json();
};
async function deployment(phase) {
  const latest = (await api(`deployments?environment=${encodeURIComponent(config.environment)}&per_page=1`))[0];
  const statuses = latest ? await api(`deployments/${latest.id}/statuses?per_page=1`) : [];
  const snapshot = { checkedAt: new Date().toISOString(), deployment: latest, statuses };
  await save(`deployment-${phase}.json`, snapshot);
  verifyDeployment(config, latest, statuses);
  return { id: latest.id, sha: latest.sha, status: statuses[0].state, checkedAt: snapshot.checkedAt };
}
async function execute(args, name) {
  const env = { ...childEnvironment(process.env), QA_BASE: config.baseURL };
  const child = spawn(process.execPath, args, { cwd: checkout, env, stdio: 'inherit' });
  return waitForAudit(child, 10 * 60 * 1000, () => { provenance[`${name}TimedOut`] = true; });
}
async function manifest(root, prefix = '') {
  const hashes = {};
  for (const entry of await readdir(path.join(root, prefix), { withFileTypes: true })) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) Object.assign(hashes, await manifest(root, relative));
    else if (entry.isFile() && relative !== 'files.sha256.json') hashes[relative] = hash(await readFile(path.join(root, relative)));
  }
  return hashes;
}
try {
  assertSource(config, provenance.sourceBefore.sha, provenance.sourceBefore.tree, provenance.sourceBefore.status, provenance.deployedTree);
  provenance.before = await deployment('before');
  await save('provenance.json', provenance);
  // Separate verdicts ensure a failed historical tool does not skip the real provider.
  try {
    provenance.historicalExitCode = await execute(['scripts/qa/run.mjs', '--inventory', path.join(directory, 'cloud/inventory.json'), '--base', config.baseURL, '--slugs', slugs.join(','), '--engine', engine, '--concurrency', '1', '--out', path.join(output, 'historical')], 'historical');
    const aggregate = JSON.parse(await readFile(path.join(output, 'historical/aggregate.json'), 'utf8'));
    const metadata = aggregate.metadata;
    if (metadata.baseURL !== config.baseURL || metadata.engine !== engine || metadata.revision !== config.source || metadata.workingDiffHash !== hash('') || metadata.options['strip-dev-upgrade-csp'] || metadata.options['smoke-only'] || metadata.selectedSlugs.length !== slugs.length || slugs.some(slug => !metadata.selectedSlugs.includes(slug))) throw Error('Historical audit provenance mismatch');
    const observed = [...aggregate.results.map(result => result.slug), ...aggregate.incompleteSlugs];
    if (metadata.inventoryHash !== provenance.inventorySha256 || observed.length !== slugs.length || new Set(observed).size !== slugs.length || slugs.some(slug => !observed.includes(slug))) throw Error('Historical audit selection is incomplete or duplicated');
    provenance.historicalSummary = aggregate.summary;
    if (aggregate.summary.exitCode !== provenance.historicalExitCode) throw Error('Historical audit exit mismatch');
  } catch (error) { provenance.historicalError = String(error.stack ?? error); }
  try {
    provenance.tweetExitCode = await execute(['scripts/qa/helpers/images-real-capabilities.mjs', engine, 'x', path.join(output, 'tweet')], 'tweet');
    const observations = JSON.parse(await readFile(path.join(output, 'tweet/x.json'), 'utf8'));
    const bytes = await readFile(path.join(output, 'tweet/x-result.png'));
    const validPNG = bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) && bytes.toString('ascii', 12, 16) === 'IHDR' && bytes.readUInt32BE(16) > 0 && bytes.readUInt32BE(20) > 0;
    if (!validPNG || !observations.some(item => item.kind === 'drawnText' && item.text.includes('just setting up my twttr')) || observations.some(item => item.kind === 'error')) throw Error('Real provider output evidence failed');
    provenance.tweetOutput = { sha256: hash(bytes), width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), functionalOnly: true, runtimeVerdict: 'Raw observations retained; independent runtime review required' };
  } catch (error) { provenance.tweetError = String(error.stack ?? error); }
} catch (error) { provenance.error = String(error.stack ?? error); }
finally {
  try { provenance.after = await deployment('after'); } catch (error) { provenance.afterError = String(error.stack ?? error); }
  try {
    provenance.sourceAfter = sourceState();
    assertSource(config, provenance.sourceAfter.sha, provenance.sourceAfter.tree, provenance.sourceAfter.status, git('rev-parse', `${config.deployedMerge}^{tree}`));
    provenance.sourceFilesAfter = await sourceHashes();
    if (JSON.stringify(provenance.sourceFilesBefore) !== JSON.stringify(provenance.sourceFilesAfter)) throw Error('Source files changed during supplemental audit');
  } catch (error) { provenance.sourceError = String(error.stack ?? error); }
  provenance.finishedAt = new Date().toISOString();
  provenance.exitCode = provenance.historicalExitCode === 0 && provenance.tweetExitCode === 0 && !Object.keys(provenance).some(key => key.endsWith('Error') || key.endsWith('TimedOut') || key === 'error') ? 0 : 1;
  await save('provenance.json', provenance);
  await save('files.sha256.json', await manifest(output));
  process.exitCode = provenance.exitCode;
}
