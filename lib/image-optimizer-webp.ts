export const IMAGE_OPTIMIZER_WEBP_WORKER_URL = '/codecs/webp-converter/webp-worker.js';
export const IMAGE_OPTIMIZER_WEBP_TIMEOUT_MS = 60_000;

type WebpWorkerSuccess = { ok: true; buffer: ArrayBuffer };
type WebpWorkerFailure = { ok: false; error?: string };
type WebpWorkerMessage = WebpWorkerSuccess | WebpWorkerFailure;

export type WebpWorkerFactory = (url: string) => Worker;

export function isRiffWebpBytes(bytes: Uint8Array) {
  return bytes.length >= 12
    && bytes[0] === 0x52
    && bytes[1] === 0x49
    && bytes[2] === 0x46
    && bytes[3] === 0x46
    && bytes[8] === 0x57
    && bytes[9] === 0x45
    && bytes[10] === 0x42
    && bytes[11] === 0x50;
}

export async function isRealWebpBlob(blob: Blob | null) {
  if (!blob || blob.type.toLowerCase() !== 'image/webp') return false;
  const header = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
  return isRiffWebpBytes(header);
}

export async function encodeImageOptimizerWebp({
  width,
  height,
  quality,
  encodeNative,
  getRgba,
  signal,
  workerFactory = (url) => new Worker(url, { type: 'module' }),
  workerUrl = IMAGE_OPTIMIZER_WEBP_WORKER_URL,
  timeoutMs = IMAGE_OPTIMIZER_WEBP_TIMEOUT_MS,
}: {
  width: number;
  height: number;
  quality: number;
  encodeNative: () => Promise<Blob | null>;
  getRgba: () => Uint8ClampedArray;
  signal: AbortSignal;
  workerFactory?: WebpWorkerFactory;
  workerUrl?: string;
  timeoutMs?: number;
}): Promise<Blob | null> {
  if (signal.aborted) return null;

  let nativeBlob: Blob | null = null;
  try {
    nativeBlob = await encodeNative();
  } catch {
    nativeBlob = null;
  }

  if (signal.aborted) return null;
  const nativeIsRealWebp = await isRealWebpBlob(nativeBlob);
  if (signal.aborted) return null;
  if (nativeIsRealWebp) return nativeBlob;
  if (signal.aborted) return null;

  const rgba = getRgba();
  if (signal.aborted) return null;

  const fallbackBlob = await encodeWebpWithWorker({
    rgba: rgba.buffer.slice(rgba.byteOffset, rgba.byteOffset + rgba.byteLength),
    width,
    height,
    quality,
    signal,
    workerFactory,
    workerUrl,
    timeoutMs,
  });

  if (signal.aborted) return null;
  const fallbackIsRealWebp = await isRealWebpBlob(fallbackBlob);
  if (signal.aborted) return null;
  return fallbackIsRealWebp ? fallbackBlob : null;
}

function encodeWebpWithWorker({
  rgba,
  width,
  height,
  quality,
  signal,
  workerFactory,
  workerUrl,
  timeoutMs,
}: {
  rgba: ArrayBuffer;
  width: number;
  height: number;
  quality: number;
  signal: AbortSignal;
  workerFactory: WebpWorkerFactory;
  workerUrl: string;
  timeoutMs: number;
}): Promise<Blob | null> {
  if (signal.aborted) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    let settled = false;
    const worker = workerFactory(workerUrl);
    const cleanup = () => {
      clearTimeout(timer);
      signal.removeEventListener('abort', abort);
      worker.onmessage = null;
      worker.onerror = null;
      worker.terminate();
    };
    const settle = (callback: () => void) => {
      if (settled) return;
      settled = true;
      cleanup();
      callback();
    };
    const abort = () => settle(() => resolve(null));
    const timer = setTimeout(() => {
      settle(() => reject(new Error('The local WebP encoder timed out after 60 seconds. Try again.')));
    }, timeoutMs);

    signal.addEventListener('abort', abort, { once: true });
    worker.onmessage = (event: MessageEvent<WebpWorkerMessage>) => {
      const message = event.data;
      if (signal.aborted) {
        abort();
        return;
      }
      if (message?.ok) {
        settle(() => resolve(new Blob([message.buffer], { type: 'image/webp' })));
        return;
      }
      settle(() => reject(new Error(message?.error || 'The local WebP encoder failed.')));
    };
    worker.onerror = () => {
      settle(() => reject(new Error('The local WebP encoder failed.')));
    };

    try {
      worker.postMessage({ rgba, width, height, quality }, [rgba]);
    } catch (err) {
      settle(() => reject(err instanceof Error ? err : new Error('The local WebP encoder failed.')));
    }
  });
}
