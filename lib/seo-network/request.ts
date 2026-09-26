/** Bounds cover response body reads as well as headers. Never use opaque success. */
export async function boundedFetch(url: string, signal: AbortSignal, options: { limit?: number; timeout?: number; method?: string; allowHttpError?: boolean } = {}) {
  const controller = new AbortController();
  const abort = () => controller.abort(signal.reason);
  if (signal.aborted) abort(); else signal.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(() => controller.abort(new Error('Request timed out.')), options.timeout ?? 10000);
  try {
    const response = await fetch(url, { signal: controller.signal, method: options.method ?? 'GET', cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
    if (response.type === 'opaque' || response.status === 0) throw new Error('Unknown status: browser CORS restrictions.');
    if (!response.ok && !options.allowHttpError) throw new Error(`HTTP ${response.status}. The service could not return this resource.`);
    const limit = options.limit ?? 1_000_000;
    if (Number(response.headers.get('content-length')) > limit) throw new Error('Response exceeds size limit.');
    const chunks: Uint8Array[] = [];
    let size = 0;
    const reader = response.body?.getReader();
    if (reader) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > limit) throw new Error('Response exceeds size limit.');
          chunks.push(value);
        }
      } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return { status: response.status, ok: response.ok, contentType: response.headers.get('content-type') ?? '', bytes, text: () => new TextDecoder().decode(bytes) };
  } catch (error) {
    controller.abort();
    if (signal.aborted) throw new Error('Request cancelled.');
    if (error instanceof Error && error.name === 'AbortError') throw new Error('Request timed out.');
    throw error;
  } finally { clearTimeout(timer); signal.removeEventListener('abort', abort); }
}
export async function pooled<T, R>(items: T[], signal: AbortSignal, run: (item: T) => Promise<R>, concurrency = 3) {
  let next = 0;
  const output: R[] = new Array(items.length);
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (next < items.length && !signal.aborted) { const i = next++; output[i] = await run(items[i]); }
  }));
  if (signal.aborted) throw new Error('Request cancelled.');
  return output;
}
export function downloadText(text: string, filename: string, type = 'text/plain;charset=utf-8') { downloadBlob(new Blob([text], { type }), filename); }
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = filename; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
