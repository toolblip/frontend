// Candidate evidence only. Never registers production approvals.
import { spawn, execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile, open } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

if (process.env.GITHUB_ACTIONS !== 'true' || process.env.RUNNER_OS !== 'Linux' || process.env.RUNNER_ENVIRONMENT !== 'github-hosted')
  throw Error('Candidate QA requires a GitHub-hosted Linux runner.');
const [out] = process.argv.slice(2);
if (!out || !/^[0-9a-f]{40}$/.test(process.env.QA_REVIEWED_HEAD ?? '')) throw Error('Output directory and reviewed SHA are required.');
const source = process.cwd(), output = path.resolve(out);
if (output === source || output.startsWith(source + path.sep)) throw Error('Evidence must be outside checkout.');
await mkdir(output); // Never overwrite earlier evidence.
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
if (git('rev-parse', 'HEAD') !== process.env.QA_REVIEWED_HEAD || git('status', '--porcelain', '--untracked-files=no')) throw Error('Candidate checkout is not the clean reviewed SHA.');
const env = { ...process.env };
for (const key of Object.keys(env)) if (/TOKEN|SECRET|PASSWORD|CREDENTIAL/i.test(key) || key.startsWith('ACTIONS_')) delete env[key];
const slugs = ['english-dictionary', 'shell-command-reference', 'notebook-to-html', 'base64-encoder-decoder', 'binary-converter', 'markdown-to-pdf', 'json-schema-validator', 'favicon-grabber', 'batch-favicon-downloader'];
const report = { purpose: 'candidate-only-not-production-approval', source: git('rev-parse', 'HEAD'), sourceTree: git('rev-parse', 'HEAD^{tree}'), reviewedHead: process.env.QA_REVIEWED_HEAD, startedAt: new Date().toISOString(), baseURL: 'http://127.0.0.1:3190', slugs, csp: 'Only upgrade-insecure-requests removed by existing explicit local-HTTP QA option; all other CSP directives retained.', engines: [] };
const sourceFiles = ['scripts/qa/hosted-candidate.mjs', 'scripts/qa/hosted-notebook-scroll.mjs', 'scripts/qa/run.mjs', 'scripts/qa/browser.mjs', 'scripts/qa/runtime.mjs', 'scripts/qa/cases/developer-data.mjs', 'scripts/qa/cases/developer-general.mjs', 'scripts/qa/cases/developer-security.mjs', 'scripts/qa/cases/utility-design.mjs', 'scripts/qa/cases/seo-network.mjs', 'lib/blog.ts', 'lib/utility-design/dictionary.ts', 'lib/developer-data/use-schema-validation.ts', 'components/tools/EnglishDictionaryClient.tsx', 'components/tools/ShellCommandReferenceClient.tsx'];
const hashSources = async () => Object.fromEntries(await Promise.all(sourceFiles.map(async file => [file, createHash('sha256').update(await readFile(file)).digest('hex')])));
report.sourceFilesBefore = await hashSources();
const save = () => writeFile(path.join(output, 'candidate.json'), JSON.stringify(report, null, 2) + '\n');
function run(command, args, timeout, log) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { env, detached: true, stdio: ['ignore', log, log] });
    let killTimer;
    const signal = value => { try { process.kill(-child.pid, value); } catch {} };
    const timer = setTimeout(() => { signal('SIGTERM'); killTimer = setTimeout(() => signal('SIGKILL'), 10000); }, timeout);
    child.once('error', error => { clearTimeout(timer); clearTimeout(killTimer); reject(error); });
    child.once('exit', code => { clearTimeout(timer); clearTimeout(killTimer); signal('SIGKILL'); resolve(code ?? 1); });
  });
}
const serverLog = await open(path.join(output, 'server.log'), 'wx');
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3190'], { env, detached: true, stdio: ['ignore', serverLog.fd, serverLog.fd] });
let serverError;
server.on('error', error => { serverError = error; });
try {
  let ready = false;
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline && server.exitCode === null && !serverError) {
    try { const response = await fetch(report.baseURL, { signal: AbortSignal.timeout(2000) }); await response.body?.cancel(); if (response.ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  if (!ready) throw serverError ?? Error('Candidate production server did not become ready within 60 seconds.');
  for (const engine of ['chrome', 'webkit']) {
    const log = await open(path.join(output, `${engine}.log`), 'wx');
    const entry = { engine, startedAt: new Date().toISOString() };
    report.engines.push(entry);
    try {
      entry.exitCode = await run(process.execPath, ['scripts/qa/run.mjs', '--inventory', 'scripts/qa/cloud/inventory.json', '--base', report.baseURL, '--slugs', slugs.join(','), '--engine', engine, '--concurrency', '1', '--strip-dev-upgrade-csp', '--out', path.join(output, engine)], 12 * 60 * 1000, log.fd);
      const aggregate = JSON.parse(await readFile(path.join(output, engine, 'aggregate.json'), 'utf8'));
      entry.summary = aggregate.summary;
      entry.failures = aggregate.results.filter(result => result.status !== 'passed').map(result => ({ slug: result.slug, functional: result.functional, runtime: result.runtime, route: result.route, layouts: result.layouts, errors: result.errors }));
      entry.incompleteSlugs = aggregate.incompleteSlugs;
      entry.fatal = aggregate.fatal;
      if (entry.exitCode !== 0 || aggregate.summary.exitCode !== 0) process.exitCode = 1;
    } catch (error) { entry.error = String(error.stack ?? error); process.exitCode = 1; }
    finally { await log.close(); entry.finishedAt = new Date().toISOString(); await save(); }
    const diagnosticLog = await open(path.join(output, `${engine}-scroll.log`), 'wx');
    try {
      entry.scrollDiagnosticExitCode = await run(process.execPath, ['scripts/qa/hosted-notebook-scroll.mjs', path.join(output, `${engine}-scroll`), engine, report.baseURL], 3 * 60 * 1000, diagnosticLog.fd);
    } catch (error) { entry.scrollDiagnosticError = String(error.stack ?? error); }
    finally { await diagnosticLog.close(); await save(); }
    // Diagnostic observations never grant acceptance or overwrite the core audit verdict.
  }
} catch (error) { report.error = String(error.stack ?? error); process.exitCode = 1; }
finally {
  try { process.kill(-server.pid, 'SIGKILL'); } catch {}
  await serverLog.close();
  report.finishedAt = new Date().toISOString();
  report.sourceFilesAfter = await hashSources();
  if (JSON.stringify(report.sourceFilesAfter) !== JSON.stringify(report.sourceFilesBefore)) process.exitCode = 1;
  report.sourceAfter = git('rev-parse', 'HEAD');
  report.trackedChangesAfter = git('status', '--porcelain', '--untracked-files=no');
  if (report.sourceAfter !== report.source || report.trackedChangesAfter) process.exitCode = 1;
  await save();
}
