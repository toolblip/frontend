#!/usr/bin/env node
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium, webkit, expect } from '@playwright/test';
import { parseArgs, selectTools, serializeError, summarize, within, resolveDestination } from './core.mjs';
import { auditTool } from './browser.mjs';

import { validateExpectations, environmentObservations } from './runtime.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory,'../..');
const hash = data => createHash('sha256').update(data).digest('hex');
const save = (file,data) => writeFile(file,JSON.stringify(data,null,2)+'\n');

export async function loadFixtures() {
  const files = await readdir(path.join(directory,'cases')).catch(error=>{if(error.code === 'ENOENT') return []; throw error;});
  const fixtures = new Map();
  const revisions = {};
  for (const file of files.filter(name=>name.endsWith('.mjs')).sort()) {
    const full = path.join(directory,'cases',file);
    revisions[file] = hash(await readFile(full));
    const cases = (await import(pathToFileURL(full).href)).default;
    if (!Array.isArray(cases)) throw Error(`${file} must default-export an array`);
    for (const fixture of cases) {
      if (!fixture || !/^[a-z0-9][a-z0-9-]*$/.test(fixture.slug) || typeof fixture.test !== 'function') throw Error(`Invalid fixture in ${file}`);
      if (fixtures.has(fixture.slug)) throw Error(`Duplicate fixture: ${fixture.slug}`);
      validateExpectations(fixture);
      fixtures.set(fixture.slug,{...fixture,module:file});
    }
  }
  return {fixtures,revisions};
}

export async function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  if (!options.inventory) throw Error('--inventory PATH is required');
  const inventoryText = await readFile(path.resolve(options.inventory),'utf8');
  const inventory = JSON.parse(inventoryText);
  const selected = selectTools(inventory.tools,options);
  const destinations = new Map(selected.map(entry=>[entry.slug,resolveDestination(entry,inventory.tools)]));
  const {fixtures,revisions} = await loadFixtures();
  const out = path.resolve(options.out ?? path.join(root,'test-results','qa',new Date().toISOString().replace(/[:.]/g,'-')));
  await mkdir(path.dirname(out),{recursive:true});
  // An existing output directory is an error, never an implicit resume or overwrite.
  await mkdir(out);
  await mkdir(path.join(out,'tools'));
  let revision = null;
  let workingDiffHash = null;
  try {
    revision = execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
    workingDiffHash = hash(execFileSync('git',['diff','HEAD'],{cwd:root}));
  } catch { /* Source archives can lack Git metadata. */ }
  const harnessRevisions = {};
  for (const file of ['run.mjs','core.mjs','browser.mjs','runtime.mjs']) harnessRevisions[file] = hash(await readFile(path.join(directory,file)));
  const metadata = {startedAt:new Date().toISOString(),revision,workingDiffHash,harnessRevisions,fixtureRevisions:revisions,
    inventoryHash:hash(inventoryText),inventory:path.resolve(options.inventory),baseURL:options.base,engine:options.engine,
    webkitExecutable:options.engine === 'webkit' ? process.env.QA_WEBKIT_EXECUTABLE ?? null : null,
    options,selectedSlugs:selected.map(t=>t.slug),out,serviceWorkers:'allowed-in-fresh-contexts',resume:false};
  await save(path.join(out,'metadata.json'),metadata);
  const results = [];
  let server;
  let browser;
  let fatal;
  let stopped = false;
  const abort = () => {stopped=true; void browser?.close().catch(()=>{});};
  process.once('SIGINT',abort);
  process.once('SIGTERM',abort);
  try {
    const browserType = options.engine === 'chrome' ? chromium : webkit;
    server = await browserType.launchServer({headless:true,timeout:30_000,
      ...(options.engine === 'chrome' ? {channel:'chrome'} : process.env.QA_WEBKIT_EXECUTABLE ? {executablePath:process.env.QA_WEBKIT_EXECUTABLE} : {})});
    browser = await browserType.connect(server.wsEndpoint(),{timeout:30_000});
    let cursor = 0;
    const workers = await Promise.allSettled(Array.from({length:Math.min(options.concurrency,selected.length)},async()=>{
      while (!stopped && cursor < selected.length) {
        const entry = selected[cursor++];
        const fixture = fixtures.get(entry.slug) ?? fixtures.get(destinations.get(entry.slug).slug);
        const result = await auditTool({browser,entry,expectedEntry:destinations.get(entry.slug),fixture,options,expect,artifactsDir:path.join(out,'artifacts',entry.slug)});
        await save(path.join(out,'tools',`${entry.slug}.json`),result);
        results.push(result);
        console.log(`${entry.slug}: ${result.status} (functional: ${result.functional.status})`);
      }
    }));
    const rejected = workers.find(worker=>worker.status === 'rejected');
    if (rejected) throw rejected.reason;
    if (stopped) throw Error('Run interrupted');
  } catch(error) { fatal=serializeError(error); }
  finally {
    if (browser) await within(browser.close(),5000,'Browser close').catch(error=>{fatal ??= serializeError(error);});
    if (server) await within(server.close(),5000,'Browser server close').catch(async error=>{
      fatal ??= serializeError(error);
      await within(server.kill(),5000,'Browser server kill').catch(()=>{});
    });
    process.removeListener('SIGINT',abort);
    process.removeListener('SIGTERM',abort);
  }
  const missingFixtures = selected.filter(t=>!fixtures.has(t.slug) && !fixtures.has(destinations.get(t.slug).slug)).map(t=>t.slug);
  const summary = summarize(results);
  summary.needsFixture = missingFixtures.length;
  if (missingFixtures.length) summary.exitCode |= 2;
  if (fatal || results.length !== selected.length) summary.exitCode |= 1;
  const aggregate = {metadata,finishedAt:new Date().toISOString(),summary,fatal,
    incompleteSlugs:selected.filter(t=>!results.some(r=>r.slug === t.slug)).map(t=>t.slug),
    missingFixtures,environmentObservations:environmentObservations(results),
    results:results.sort((a,b)=>a.slug.localeCompare(b.slug))};
  await save(path.join(out,'aggregate.json'),aggregate);
  console.log(JSON.stringify({out,...summary,fatal},null,2));
  return summary.exitCode;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  main().then(code=>{process.exitCode=code;}).catch(error=>{console.error(error);process.exitCode=1;});
}
