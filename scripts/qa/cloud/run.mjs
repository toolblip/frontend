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
export function selectGroup(config, inventory, group) {
  if (!config.groups.includes(group) || !/^[a-z][a-z-]+$/.test(group)) throw Error('Unknown reviewed QA group');
  const selectedSlugs = inventory.tools.filter(tool => tool.group === group && !tool.historicallyApproved).map(tool => tool.slug);
  if (!selectedSlugs.length || new Set(selectedSlugs).size !== selectedSlugs.length) throw Error('Group selection is empty or duplicated');
  if (!Number.isInteger(config.auditTimeoutMs) || config.auditTimeoutMs < 1000 || config.auditTimeoutMs > 25 * 60 * 1000) throw Error('Audit timeout must be bounded to 25 minutes');
  return { config: { ...config, group }, selectedSlugs };
}
export function verifyAggregate(aggregate, config, engine, exitCode, expectedSlugs) {
  if (aggregate.metadata.revision !== config.source || aggregate.metadata.engine !== engine || aggregate.metadata.workingDiffHash !== hash('') || aggregate.summary.exitCode !== exitCode)
    throw Error('Aggregate provenance or exit code does not match the pinned run.');
  const selected = aggregate.metadata.selectedSlugs;
  if (aggregate.metadata.options.group !== config.group || aggregate.metadata.options['pending-only'] !== true || aggregate.metadata.options.slugs ||
      selected.length !== expectedSlugs.length || expectedSlugs.some(slug => !selected.includes(slug)))
    throw Error('Aggregate selection does not match the complete reviewed pending group');
  const observed = [...aggregate.results.map(result => result.slug), ...aggregate.incompleteSlugs];
  if (new Set(selected).size !== selected.length || new Set(observed).size !== observed.length ||
      selected.length !== observed.length || selected.some(slug => !observed.includes(slug)))
    throw Error('Aggregate results and incomplete slugs do not partition selected tools.');
  if (exitCode === 0 && (aggregate.fatal || aggregate.incompleteSlugs.length || aggregate.results.some(result => result.status !== 'passed' || result.functional.status !== 'passed')))
    throw Error('Failed, incomplete, or human-review cases cannot count as a successful run.');
}
export function waitForAudit(child, timeoutMs, onTimeout, killGraceMs = 10000) {
  return new Promise((resolve, reject) => {
    let timedOut = false, killTimer;
    const deadline = setTimeout(() => {
      timedOut = true; onTimeout();
      killTimer = setTimeout(() => child.kill('SIGKILL'), killGraceMs);
      child.kill('SIGTERM');
    }, timeoutMs);
    const cleanup = () => { clearTimeout(deadline); clearTimeout(killTimer); };
    child.once('error', error => { cleanup(); reject(error); });
    child.once('exit', code => { cleanup(); resolve(timedOut ? 1 : code ?? 1); });
  });
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
  const [source, out, engine, group] = process.argv.slice(2);
  if (!source || !out || !['chrome', 'webkit'].includes(engine) || !group) throw Error('Usage: run.mjs SOURCE OUT chrome|webkit GROUP');
  const directory = path.dirname(fileURLToPath(import.meta.url));
  const inventoryText = await readFile(path.join(directory, 'inventory.json'), 'utf8');
  const { config, selectedSlugs } = selectGroup(JSON.parse(await readFile(path.join(directory, 'pilot.json'), 'utf8')), JSON.parse(inventoryText), group);
  const output = path.resolve(out), checkout = path.resolve(source);
  if (output === checkout || output.startsWith(checkout + path.sep)) throw Error('Artifacts must be outside checkout.');
  await mkdir(output, { recursive: true });
  const save = (name, value) => writeFile(path.join(output, name), JSON.stringify(value, null, 2) + '\n');
  const git = (...args) => execFileSync('git', args, { cwd: checkout, encoding: 'utf8' }).trim();
  const sourceState = () => ({ sha: git('rev-parse', 'HEAD'), tree: git('rev-parse', 'HEAD^{tree}'), status: git('status', '--porcelain', '--untracked-files=no') });
  const provenance = { config, group, engine, selectedSlugs, workflowRevision: process.env.QA_WORKFLOW_REVISION, runId: process.env.GITHUB_RUN_ID,
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
    const child = spawn(process.execPath, ['scripts/qa/run.mjs', '--inventory', path.join(directory, 'inventory.json'), '--base', config.baseURL,
      '--group', config.group, '--pending-only', '--engine', engine, '--concurrency', '1', '--out', path.join(output, 'audit')],
    { cwd: checkout, env: childEnvironment(process.env), stdio: 'inherit' });
    exitCode = await waitForAudit(child, config.auditTimeoutMs, () => { provenance.auditTimedOut = true; });
    provenance.auditExitCode = exitCode;
    const aggregate = JSON.parse(await readFile(path.join(output, 'audit/aggregate.json'), 'utf8'));
    verifyAggregate(aggregate, config, engine, exitCode, selectedSlugs);
  } catch (error) { provenance.error = String(error.stack ?? error); exitCode = 1; }
  finally {
    if (group === 'developer-data') {
      provenance.diagnostics = [];
      for (const name of ['notebook', 'schema']) {
        const diagnostic = { script: `diagnose-${name}.mjs`, startedAt: new Date().toISOString() };
        provenance.diagnostics.push(diagnostic);
        try {
          const diagnosticOut = path.join(output, 'diagnostics', name);
          await mkdir(diagnosticOut, { recursive: true });
          const child = spawn(process.execPath, [path.join(directory, diagnostic.script), checkout, diagnosticOut, engine],
            { cwd: checkout, env: childEnvironment(process.env), stdio: 'inherit' });
          diagnostic.exitCode = await waitForAudit(child, 120000, () => { diagnostic.timedOut = true; });
        } catch (error) { diagnostic.error = String(error.stack ?? error); }
        diagnostic.finishedAt = new Date().toISOString();
        // Diagnostics never replace the audit verdict or count as tool acceptance.
      }
    }
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
