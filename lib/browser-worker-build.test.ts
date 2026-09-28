import { beforeAll, expect, it } from 'vitest';
import { Worker } from 'node:worker_threads';
import { createHash } from 'node:crypto';
import { bundleWorkers } from '../scripts/build-browser-workers.mjs';
let bundles: Awaited<ReturnType<typeof bundleWorkers>>;
beforeAll(async () => { bundles = await bundleWorkers(); });
function execute(name: string, data: unknown) {
  const bundle = bundles.find(item => item.name === name)!;
  const thread = new Worker(`const {parentPort}=require('node:worker_threads');
    const vm=require('node:vm');
    const scope={console,setTimeout,clearTimeout,TextEncoder,TextDecoder,URL,performance};
    scope.self=scope;scope.postMessage=data=>parentPort.postMessage(data);
    vm.runInNewContext(${JSON.stringify(bundle?.contents ?? '')},scope);
    parentPort.on('message',data=>scope.onmessage({data}));`, { eval: true });
  return new Promise<any>((resolve, reject) => {
    const timeout = setTimeout(() => { void thread.terminate(); reject(Error('Bundle did not respond')); }, 5000);
    thread.once('message', value => { clearTimeout(timeout); void thread.terminate(); resolve(value); });
    thread.once('error', error => { clearTimeout(timeout); void thread.terminate(); reject(error); });
    thread.postMessage(data);
  });
}
it('emits self-contained content-hashed browser bundles, selecting Sass browser exports', () => {
  expect(bundles.map(item => item.name)).toEqual(['schema', 'sass']);
  for (const bundle of bundles) {
    const hash = createHash('sha256').update(bundle.contents).digest('hex').slice(0, 16);
    expect(bundle.filename).toBe(`${bundle.name}-${hash}.js`);
    expect(bundle.contents).not.toMatch(/turbopack-worker|#params=|importScripts\(/);
  }
  const inputs = bundles.find(item => item.name === 'sass')!.inputs.join('\n');
  expect(inputs).toContain('sass.default.js');
  expect(inputs).not.toMatch(/sass\.node|chokidar/);
});
it('executes the compiled schema bundle without bootstrap URL config or Node globals', async () => {
  expect(await execute('schema', ['"ABC"', '{"pattern":"^[A-Z]+$"}'])).toEqual({ output: 'Valid against the supported schema.', error: '' });
  expect((await execute('schema', ['"abc"', '{"pattern":"^[A-Z]+$"}'])).error).toContain('pattern');
});
it('executes real compiled Sass nesting, arithmetic, indented syntax, and errors in a browser-like worker', async () => {
  const result = await execute('sass', { input: '$n: 3; .card { width: $n * 4px; .title { color: red; } }', syntax: 'scss' });
  expect(result.error).toBeUndefined();
  expect(result.output).toContain('width: 12px');
  expect(result.output).toContain('.card .title');
  expect((await execute('sass', { input: '$c: red\n.card\n  color: $c', syntax: 'indented' })).output).toContain('color: red');
  expect((await execute('sass', { input: '.card { color:', syntax: 'scss' })).error).toBeTruthy();
});
