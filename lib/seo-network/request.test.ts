import { afterEach, expect, it, vi } from 'vitest';
import { boundedFetch, pooled } from './request';
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });
it('rejects HTTP errors and never turns them into empty success', async () => {
  vi.stubGlobal('fetch', async () => new Response('bad', { status: 503 }));
  await expect(boundedFetch('https://example.com', new AbortController().signal)).rejects.toThrow('HTTP 503');
});
it('caps streamed bodies even without Content-Length', async () => {
  vi.stubGlobal('fetch', async () => new Response(new ReadableStream({ start(c) { c.enqueue(new Uint8Array(8)); c.enqueue(new Uint8Array(8)); c.close(); } })));
  await expect(boundedFetch('https://example.com', new AbortController().signal, { limit: 10 })).rejects.toThrow('size limit');
});
it('honors cancellation while a body is pending', async () => {
  const outer = new AbortController();
  vi.stubGlobal('fetch', async (_url: string, { signal }: { signal: AbortSignal }) => new Response(new ReadableStream({ start(c) { signal.addEventListener('abort', () => c.error(new DOMException('aborted', 'AbortError'))); } })));
  const pending = boundedFetch('https://example.com', outer.signal);
  outer.abort();
  await expect(pending).rejects.toThrow('cancelled');
});
it('bounds the entire body read by the timeout', async () => {
  vi.useFakeTimers();
  vi.stubGlobal('fetch', async (_url: string, { signal }: { signal: AbortSignal }) => new Response(new ReadableStream({ start(c) { signal.addEventListener('abort', () => c.error(new DOMException('aborted', 'AbortError'))); } })));
  const pending = expect(boundedFetch('https://example.com', new AbortController().signal, { timeout: 25 })).rejects.toThrow('timed out');
  await vi.advanceTimersByTimeAsync(30); await pending;
});
it('limits concurrency and stops scheduling on cancel', async () => {
  const controller = new AbortController(); let active = 0, peak = 0, calls = 0;
  const result = await pooled([1,2,3,4,5], controller.signal, async n => { active++; peak = Math.max(peak, active); await Promise.resolve(); active--; return n * 2; }, 2);
  expect(peak).toBe(2); expect(result).toEqual([2,4,6,8,10]);
  await expect(pooled([1,2,3,4,5], controller.signal, async () => { calls++; controller.abort(); return 1; }, 1)).rejects.toThrow('cancelled');
  expect(calls).toBe(1);
});
