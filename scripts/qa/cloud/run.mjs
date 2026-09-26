import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync, spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export function verifyDeployment(config, deployment, statuses) {
  if (deployment?.id !== config.deploymentId || deployment.sha !== config.deployedMerge || deployment.environment !== config.environment)
    throw Error('Latest production deployment differs from the pinned deployment; do not record approval.');
  if (statuses[0]?.state !== 'success') throw Error('Latest production deployment is not currently successful.');
}
export function assertSource(config, sha, tree, status, deployedTree = config.tree) {
  if (sha !== config.source || tree !== config.tree || deployedTree !== config.tree || status.trim()) throw Error('Source SHA/tree or tracked working tree differs from the pinned deployed source.');
}
export function childEnvironment(env) {
  const clean = { ...env };
  for (const key of Object.keys(clean)) if (/TOKEN|SECRET|PASSWORD|CREDENTIAL/i.test(key) || key.startsWith('ACTIONS_')) delete clean[key];
  return clean;
}
export function verifyAggregate(aggregate, config, engine, exitCode) {
  if (aggregate.metadata.revision !== config.source || aggregate.metadata.engine !== engine || aggregate.metadata.workingDiffHash !== hash('') || aggregate.summary.exitCode !== exitCode)
    throw Error('Aggregate provenance or exit code does not match the pinned run.');
  const selected = aggregate.metadata.selectedSlugs;
  const observed = [...aggregate.results.map(result => result.slug), ...aggregate.incompleteSlugs];
  if (new Set(selected).size !== selected.length || new Set(observed).size !== observed.length ||
      selected.length !== observed.length || selected.some(slug => !observed.includes(slug)))
    throw Error('Aggregate results and incomplete slugs do not partition selected tools.');
  if (exitCode === 0 && (aggregate.fatal || aggregate.incompleteSlugs.length || aggregate.results.some(result => result.status !== 'passed' || result.functional.status !== 'passed')))
    throw Error('Failed, incomplete, or human-review cases cannot count as a successful run.');
}
const hash = value => createHash('sha256').update(value).digest('hex');
async function fileHashes(root, relative = '') {
  const result = {};
  for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
    const name = path.join(relative, entry.name);
    if (entry.isDirectory()) Object.assign(result, await fileHashes(root, name));
    else if (entry.isFile() && name !== 'files.sha256.json') result[name] = hash(await readFile(path.join(root, name)));
  }
  return result;
}
export async function main() {
  // This guard makes accidental local invocation fail before importing any browser code.
  if (process.env.GITHUB_ACTIONS !== 'true' || process.env.RUNNER_OS !== 'Linux' || process.env.RUNNER_ENVIRONMENT !== 'github-hosted') throw Error('Cloud QA may run only on a GitHub-hosted Linux runner.');
  const [source, out, engine] = process.argv.slice(2);
  if (!source || !out || !['chrome', 'webkit'].includes(engine)) throw Error('Usage: run.mjs SOURCE OUT chrome|webkit');
  const directory = path.dirname(fileURLToPath(import.meta.url));
  const config = JSON.parse(await readFile(path.join(directory, 'pilot.json'), 'utf8'));
  const output = path.resolve(out), checkout = path.resolve(source);
  if (output === checkout || output.startsWith(checkout + path.sep)) throw Error('Artifacts must be outside checkout.');
  await mkdir(output, { recursive: true });
  const save = (name, value) => writeFile(path.join(output, name), JSON.stringify(value, null, 2) + '\n');
  const git = (...args) => execFileSync('git', args, { cwd: checkout, encoding: 'utf8' }).trim();
  const sourceState = () => ({ sha: git('rev-parse', 'HEAD'), tree: git('rev-parse', 'HEAD^{tree}'), status: git('status', '--porcelain', '--untracked-files=no') });
  const provenance = { config, engine, workflowRevision: process.env.QA_WORKFLOW_REVISION, runId: process.env.GITHUB_RUN_ID,
    runAttempt: process.env.GITHUB_RUN_ATTEMPT, runURL: `https://github.com/${config.repository}/actions/runs/${process.env.GITHUB_RUN_ID}`,
    inventorySha256: hash(await readFile(path.join(directory, 'inventory.json'))), startedAt: new Date().toISOString(), sourceBefore: sourceState(), deployedTree: git('rev-parse', `${config.deployedMerge}^{tree}`) };
  const api = async route => {
    const response = await fetch(`https://api.github.com/repos/${config.repository}/${route}`, {
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${process.env.GH_TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28' }, signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw Error(`GitHub deployment check returned HTTP ${response.status}`);
    return response.json();
  };
  const deployment = async phase => {
    // Check the latest deployment, including pending/failed deployments, rather than finding an older success.
    const deployments = await api(`deployments?environment=${encodeURIComponent(config.environment)}&per_page=1`);
    const latest = deployments[0];
    const statuses = latest ? await api(`deployments/${latest.id}/statuses?per_page=1`) : [];
    const snapshot = { checkedAt: new Date().toISOString(), deployment: latest, statuses };
    await save(`deployment-${phase}.json`, snapshot);
    verifyDeployment(config, latest, statuses);
    return { id: latest.id, sha: latest.sha, status: statuses[0].state, checkedAt: snapshot.checkedAt };
  };
  let exitCode = 1;
  try {
    assertSource(config, provenance.sourceBefore.sha, provenance.sourceBefore.tree, provenance.sourceBefore.status, provenance.deployedTree);
    provenance.before = await deployment('before');
    await save('provenance.json', provenance);
    exitCode = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ['scripts/qa/run.mjs', '--inventory', path.join(directory, 'inventory.json'), '--base', config.baseURL,
        '--group', config.group, '--pending-only', '--engine', engine, '--concurrency', '1', '--out', path.join(output, 'audit')],
      { cwd: checkout, env: childEnvironment(process.env), stdio: 'inherit' });
      child.once('error', reject); child.once('exit', code => resolve(code ?? 1));
    });
    provenance.auditExitCode = exitCode;
    const aggregate = JSON.parse(await readFile(path.join(output, 'audit/aggregate.json'), 'utf8'));
    verifyAggregate(aggregate, config, engine, exitCode);
  } catch (error) { provenance.error = String(error.stack ?? error); exitCode = 1; }
  finally {
    try { provenance.after = await deployment('after'); } catch (error) { provenance.afterError = String(error.stack ?? error); exitCode = 1; }
    try { provenance.sourceAfter = sourceState(); assertSource(config, provenance.sourceAfter.sha, provenance.sourceAfter.tree, provenance.sourceAfter.status, git('rev-parse', `${config.deployedMerge}^{tree}`)); }
    catch (error) { provenance.sourceError = String(error.stack ?? error); exitCode = 1; }
    provenance.finishedAt = new Date().toISOString(); provenance.exitCode = exitCode;
    await save('provenance.json', provenance);
    await save('files.sha256.json', await fileHashes(output));
  }
  return exitCode;
}
if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url)
  main().then(code => { process.exitCode = code; }).catch(error => { console.error(error); process.exitCode = 1; });
