import { beforeAll, expect, it } from 'vitest';
import { Worker as NodeWorker } from 'node:worker_threads';
import { bundleWorkers } from '../../scripts/build-browser-workers.mjs';
let bundledSource = '';
beforeAll(async () => { bundledSource = (await bundleWorkers(['schema']))[0].contents; });
import { runSchemaWorker, type SchemaResult } from './schema-worker-client';

// Execute the production worker handler in a real isolated thread without a browser/server.
function worker() {
    const thread = new NodeWorker(`const {parentPort} = require('node:worker_threads');
        const vm = require('node:vm');
        const scope = {console, TextEncoder, TextDecoder, URL};
        scope.self = scope; scope.postMessage = data => parentPort.postMessage(data);
        vm.runInNewContext(${JSON.stringify(bundledSource)}, scope);
        parentPort.on('message', data => scope.onmessage({data}));`, { eval: true });
    let terminated = false;
    const adapter = {
        onmessage: null as ((event: { data: SchemaResult }) => void) | null,
        onerror: null as (() => void) | null,
        postMessage: (data: unknown) => thread.postMessage(data),
        terminate: () => { terminated = true; void thread.terminate(); },
    };
    thread.on('message', data => adapter.onmessage?.({ data }));
    thread.on('error', () => adapter.onerror?.());
    return { adapter: adapter as unknown as Worker, terminated: () => terminated };
}
it('returns pattern results from the actual schema worker', async () => {
    const w = worker();
    const result = await new Promise<SchemaResult>(resolve => runSchemaWorker(w.adapter, '"ABC"', '{"pattern":"^[A-Z]+$"}', resolve));
    expect(result).toEqual({ output: 'Valid against the supported schema.', error: '' });
    expect(w.terminated()).toBe(true);
});
it('terminates catastrophic backtracking and allows a subsequent validation', async () => {
    const w = worker();
    const result = await new Promise<SchemaResult>(resolve => runSchemaWorker(w.adapter, JSON.stringify('a'.repeat(5000) + '!'), '{"pattern":"(a+)+$"}', resolve));
    expect(result.error).toContain('time limit');
    expect(result.output).toBe('');
    expect(w.terminated()).toBe(true);
    const next = worker();
    const valid = await new Promise<SchemaResult>(resolve => runSchemaWorker(next.adapter, '"a@example.com"', '{"format":"email"}', resolve));
    expect(valid.error).toBe('');
});
it('cancels obsolete work without publishing its result', async () => {
    const w = worker();
    let published = false;
    const cancel = runSchemaWorker(w.adapter, '1', '{}', () => { published = true; });
    cancel();
    // Even a result queued before termination cannot publish stale output.
    w.adapter.onmessage?.({ data: { output: 'obsolete', error: '' } } as MessageEvent);
    expect(w.terminated()).toBe(true);
    expect(published).toBe(false);
});
