export interface SchemaResult { output: string; error: string }
export const SCHEMA_TIMEOUT_MS = 1000;
// Own the timer and worker together, including errors, input changes and unmounts.
export function runSchemaWorker(worker: Worker, input: string, schema: string, done: (result: SchemaResult) => void) {
    let active = true;
    const stop = () => { active = false; clearTimeout(timer); worker.terminate(); };
    const finish = (result: SchemaResult) => { if (!active) return; stop(); done(result); };
    const timer = setTimeout(() => finish({ output: '', error: 'Schema validation exceeded the 1,000 ms time limit.' }), SCHEMA_TIMEOUT_MS);
    worker.onmessage = event => finish(event.data);
    worker.onerror = () => finish({ output: '', error: 'Schema validation worker failed.' });
    worker.onmessageerror = () => finish({ output: '', error: 'Could not read schema validation result.' });
    try { worker.postMessage([input, schema]); }
    catch { finish({ output: '', error: 'Could not start schema validation.' }); }
    return stop;
}
