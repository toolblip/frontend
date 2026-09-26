import { validateSchema } from './schema';
self.onmessage = (event: MessageEvent<[string, string]>) => {
    try {
        const errors = validateSchema(...event.data);
        self.postMessage({ output: errors.length ? '' : 'Valid against the supported schema.', error: errors.join('\n') });
    } catch (error) {
        self.postMessage({ output: '', error: error instanceof Error ? error.message : String(error) });
    }
};
