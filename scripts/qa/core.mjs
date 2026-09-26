import { parseArgs as nodeParseArgs } from 'node:util';

export function parseArgs(argv) {
  const { values } = nodeParseArgs({ args: argv, options: {
    base: {type:'string',default:'https://toolblip.com'}, engine:{type:'string',default:'chrome'},
    inventory:{type:'string'}, group:{type:'string'}, slugs:{type:'string'}, out:{type:'string'},
    concurrency:{type:'string',default:'2'}, 'smoke-only':{type:'boolean',default:false},
    'pending-only':{type:'boolean',default:false},
    'strip-dev-upgrade-csp':{type:'boolean',default:false},
  }});
  if (Object.values(values).some(value => typeof value === 'string' && value.startsWith('--'))) throw Error('Missing option value');
  if (!['chrome','webkit'].includes(values.engine)) throw Error('engine must be chrome or webkit');
  const concurrency = Number(values.concurrency);
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 4) throw Error('concurrency must be an integer from 1 to 4');
  const base = new URL(values.base);
  if (!['http:','https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) throw Error('base must be an HTTP(S) URL without credentials, query or fragment');
  if (values['strip-dev-upgrade-csp'] && (base.protocol !== 'http:' || /(^|\.)toolblip\.com$/i.test(base.hostname))) throw Error('CSP override is only allowed on development HTTP origins');
  return {...values,base:base.href.replace(/\/$/,''),concurrency,slugs:values.slugs?.split(',').map(s=>s.trim()).filter(Boolean)};
}

export function selectTools(tools, options) {
  if (!Array.isArray(tools)) throw Error('inventory.tools must be an array');
  const seen = new Set();
  for (const tool of tools) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(tool.slug) || seen.has(tool.slug)) throw Error(`Invalid or duplicate inventory slug: ${tool.slug}`);
    seen.add(tool.slug);
  }
  for (const slug of options.slugs ?? []) if (!seen.has(slug)) throw Error(`Unknown slug: ${slug}`);
  const selected = tools.filter(t => (!options['pending-only'] || !t.historicallyApproved) && (!options.group || t.group === options.group) && (!options.slugs || options.slugs.includes(t.slug)));
  if (!selected.length) throw Error('Filters selected no tools');
  return selected;
}

export function toolURL(tool, baseURL) {
  const path = tool.url ? new URL(tool.url, 'https://toolblip.com').pathname : `/tools/${tool.category === 'Image' ? 'images/' : ''}${tool.slug}`;
  return `${baseURL.replace(/\/$/,'')}/${path.replace(/^\//,'')}`;
}

export const serializeError = error => ({name:error?.name ?? 'Error',message:String(error?.message ?? error),stack:error?.stack});

export async function executeFixture(fixture, context, timeout = 60_000) {
  const evidence = [];
  if (!fixture) return {status:'needs-fixture',evidence};
  let timer;
  let accepting = true;
  try {
    await Promise.race([
      Promise.resolve().then(() => fixture.test({...context,check:(value,message) => {
        if (!accepting) throw Error('Fixture already finished');
        const passed = value === true;
        evidence.push({passed,message:String(message),at:new Date().toISOString()});
        if (!passed) throw Error(`Functional assertion failed: ${message}`);
      }})),
      new Promise((_,reject) => { timer = setTimeout(() => reject(Error(`Fixture timeout after ${timeout}ms`)), timeout); }),
    ]);
    if (!evidence.length) throw Error('Fixture recorded no independent check assertions');
    if (evidence.some(item => !item.passed)) throw Error('Fixture recorded a failed assertion');
    return {status:'passed',evidence};
  } catch (error) {
    return {status:'failed',evidence,error:serializeError(error)};
  } finally { accepting = false; clearTimeout(timer); }
}

export function actionProblems(fixture, actions) {
  const problems = [];
  if (fixture?.requiresExample !== false && !actions.examples.some(a=>a.visible && a.enabled)) problems.push('Missing visible enabled Examples action');
  // Empty forms commonly disable Clear. Presence is required; enabling it is fixture-specific.
  if (fixture?.requiresClear !== false && !actions.clear.some(a=>a.visible)) problems.push('Missing visible Clear action');
  return problems;
}

export function summarize(results) {
  const failed = results.filter(r=>r.status === 'failed').length;
  const needsFixture = results.filter(r=>r.functional.status === 'needs-fixture').length;
  const smokeOnly = results.filter(r=>r.functional.status === 'not-run').length;
  return {total:results.length,passed:results.filter(r=>r.status === 'passed').length,failed,needsFixture,smokeOnly,
    exitCode:(failed ? 1 : 0) | (needsFixture || smokeOnly ? 2 : 0)};
}


export async function within(promise, timeout, label) {
  let timer;
  try {
    return await Promise.race([promise,new Promise((_,reject)=>{
      timer = setTimeout(()=>reject(Error(`${label} timeout after ${timeout}ms`)),timeout);
    })]);
  } finally { clearTimeout(timer); }
}

export function resolveDestination(entry, inventory) {
  const visited = new Set();
  while (entry.canonicalAlias) {
    if (visited.has(entry.slug)) throw Error(`Cyclic canonical alias: ${entry.slug}`);
    visited.add(entry.slug);
    const destination = inventory.find(t=>t.slug === entry.canonicalAlias);
    if (!destination) throw Error(`Missing canonical alias destination: ${entry.canonicalAlias}`);
    entry = destination;
  }
  return entry;
}
