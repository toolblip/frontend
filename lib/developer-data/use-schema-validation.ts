'use client';
import { useEffect, useState } from 'react';
import { browserWorkerURLs } from '../generated/browser-worker-urls';
import { runSchemaWorker, type SchemaResult } from './schema-worker-client';
export function useSchemaValidation(input: string, schema: string): SchemaResult {
    const key = JSON.stringify([input, schema]);
    const [state, setState] = useState<{ key: string; result: SchemaResult }>();
    useEffect(() => {
        if (!input.trim() || !schema.trim()) return;
        try {
            const worker = new Worker(browserWorkerURLs.schema);
            return runSchemaWorker(worker, input, schema, result => setState({ key, result }));
        } catch {
            setState({ key, result: { output: '', error: 'Schema validation worker unavailable.' } });
        }
    }, [input, schema, key]);
    if (!input.trim() && !schema.trim()) return { output: '', error: '' };
    if (!input.trim() || !schema.trim()) return { output: '', error: 'Both JSON and schema are required.' };
    return state?.key === key ? state.result : { output: '', error: '' };
}
