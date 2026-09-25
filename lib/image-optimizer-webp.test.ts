import { describe, expect, it, vi } from 'vitest';
import { encodeImageOptimizerWebp, isRiffWebpBytes, isRealWebpBlob } from './image-optimizer-webp';

const riffWebp = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50, 1]);
const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 1, 2, 3, 4, 5, 6, 7, 8]);
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

class FakeWorker {
  static instances: FakeWorker[] = [];
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;
  terminated = false;
  posted: unknown = null;

  constructor(public url: string) {
    FakeWorker.instances.push(this);
  }

  postMessage(message: unknown) {
    this.posted = message;
  }

  terminate() {
    this.terminated = true;
  }

  reply(data: unknown) {
    this.onmessage?.({ data } as MessageEvent);
  }
}

describe('image optimizer WebP helper', () => {
  it('detects real RIFF WEBP bytes and rejects mislabeled blobs', async () => {
    expect(isRiffWebpBytes(riffWebp)).toBe(true);
    await expect(isRealWebpBlob(new Blob([riffWebp], { type: 'image/webp' }))).resolves.toBe(true);
    await expect(isRealWebpBlob(new Blob([pngBytes], { type: 'image/webp' }))).resolves.toBe(false);
    await expect(isRealWebpBlob(new Blob([riffWebp], { type: 'image/png' }))).resolves.toBe(false);
  });

  it('uses native WebP when the browser returns verified WebP bytes', async () => {
    const getRgba = vi.fn(() => new Uint8ClampedArray([1, 2, 3, 4]));
    const workerFactory = vi.fn((url: string) => new FakeWorker(url) as unknown as Worker);

    const blob = await encodeImageOptimizerWebp({
      width: 1,
      height: 1,
      quality: 82,
      encodeNative: async () => new Blob([riffWebp], { type: 'image/webp' }),
      getRgba,
      signal: new AbortController().signal,
      workerFactory,
    });

    expect(blob?.type).toBe('image/webp');
    expect(getRgba).not.toHaveBeenCalled();
    expect(workerFactory).not.toHaveBeenCalled();
  });

  it('falls back to the local worker when native WebP is PNG, null, or throws and passes quality', async () => {
    FakeWorker.instances = [];
    const promise = encodeImageOptimizerWebp({
      width: 2,
      height: 1,
      quality: 45,
      encodeNative: async () => new Blob([pngBytes], { type: 'image/png' }),
      getRgba: () => new Uint8ClampedArray([1, 2, 3, 4, 5, 6, 7, 8]),
      signal: new AbortController().signal,
      workerFactory: (url) => new FakeWorker(url) as unknown as Worker,
    });

    await flushPromises();
    const worker = FakeWorker.instances[0];
    expect(worker.posted).toMatchObject({ width: 2, height: 1, quality: 45 });
    worker.reply({ ok: true, buffer: riffWebp.buffer.slice(0) });

    const blob = await promise;
    expect(blob?.type).toBe('image/webp');
    expect(worker.terminated).toBe(true);
  });

  it('does not publish worker output unless the worker returns real WebP bytes', async () => {
    FakeWorker.instances = [];
    const promise = encodeImageOptimizerWebp({
      width: 1,
      height: 1,
      quality: 80,
      encodeNative: async () => null,
      getRgba: () => new Uint8ClampedArray([1, 2, 3, 4]),
      signal: new AbortController().signal,
      workerFactory: (url) => new FakeWorker(url) as unknown as Worker,
    });

    await flushPromises();
    FakeWorker.instances[0].reply({ ok: true, buffer: pngBytes.buffer.slice(0) });

    await expect(promise).resolves.toBeNull();
    expect(FakeWorker.instances[0].terminated).toBe(true);
  });

  it('terminates the worker and resolves null on abort', async () => {
    FakeWorker.instances = [];
    const controller = new AbortController();
    const promise = encodeImageOptimizerWebp({
      width: 1,
      height: 1,
      quality: 80,
      encodeNative: async () => null,
      getRgba: () => new Uint8ClampedArray([1, 2, 3, 4]),
      signal: controller.signal,
      workerFactory: (url) => new FakeWorker(url) as unknown as Worker,
    });

    await flushPromises();
    const worker = FakeWorker.instances[0];
    controller.abort();

    await expect(promise).resolves.toBeNull();
    expect(worker.terminated).toBe(true);
  });

  it('does not return native WebP when cancellation happens during native validation', async () => {
    const controller = new AbortController();
    const nativeBlob = new Blob([riffWebp], { type: 'image/webp' });
    vi.spyOn(nativeBlob, 'slice').mockReturnValue({
      arrayBuffer: async () => {
        controller.abort();
        return riffWebp.buffer.slice(0);
      },
    } as Blob);

    const blob = await encodeImageOptimizerWebp({
      width: 1,
      height: 1,
      quality: 80,
      encodeNative: async () => nativeBlob,
      getRgba: () => {
        throw new Error('fallback should not run after abort');
      },
      signal: controller.signal,
      workerFactory: (url) => new FakeWorker(url) as unknown as Worker,
      timeoutMs: 10,
    });

    expect(blob).toBeNull();
  });

  it('does not return fallback WebP when cancellation happens during fallback validation', async () => {
    FakeWorker.instances = [];
    const controller = new AbortController();
    const promise = encodeImageOptimizerWebp({
      width: 1,
      height: 1,
      quality: 80,
      encodeNative: async () => null,
      getRgba: () => new Uint8ClampedArray([1, 2, 3, 4]),
      signal: controller.signal,
      workerFactory: (url) => new FakeWorker(url) as unknown as Worker,
    });

    await flushPromises();
    FakeWorker.instances[0].reply({ ok: true, buffer: riffWebp.buffer.slice(0) });
    controller.abort();

    await expect(promise).resolves.toBeNull();
  });
});
