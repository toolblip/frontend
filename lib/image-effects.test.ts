import { describe, expect, it } from 'vitest';
import { applyImageEffect, encodeEffectPreview, validateEffectDimensions } from './image-effects';

const pixels = (...values: number[]) => new Uint8ClampedArray(values);
const run = (data: Uint8ClampedArray, width: number, kind: 'grayscale' | 'pixelate' | 'sharpen' | 'unblur', value: number) =>
  applyImageEffect({ data, width, height: data.length / 4 / width }, { kind, value });

describe('image effects', () => {
  it('uses weighted RGB luma and keeps alpha', async () => {
    expect(await run(pixels(255, 0, 0, 255, 0, 255, 0, 128, 0, 0, 255, 0), 3, 'grayscale', 0))
      .toEqual(pixels(76, 76, 76, 255, 150, 150, 150, 128, 29, 29, 29, 0));
  });

  it('keeps the original bytes for block size one and zero sharpening', async () => {
    const source = pixels(20, 80, 130, 255, 45, 15, 22, 0, 100, 120, 90, 120);
    for (const [kind, value] of [['pixelate', 1], ['sharpen', 0], ['unblur', 0]] as const) {
      expect(await run(source, 3, kind, value)).toEqual(source);
    }
  });

  it('averages square blocks with alpha weighting and includes partial edges', async () => {
    const source = pixels(200, 0, 0, 255, 0, 200, 0, 255, 20, 40, 60, 255,
      0, 0, 200, 0, 0, 0, 200, 0, 40, 80, 120, 255);
    expect(await run(source, 3, 'pixelate', 2)).toEqual(pixels(
      100, 100, 0, 255, 100, 100, 0, 255, 30, 60, 90, 255,
      100, 100, 0, 0, 100, 100, 0, 0, 30, 60, 90, 255));
    expect(source[0]).toBe(200);
    expect(await run(pixels(240, 0, 0, 128, 0, 120, 0, 64), 2, 'pixelate', 2))
      .toEqual(pixels(160, 40, 0, 128, 160, 40, 0, 64));
  });

  it('keeps uniform brightness at maximum strengths, including tiny images', async () => {
    for (const [kind, value] of [['sharpen', 3], ['unblur', 100]] as const) {
      for (const width of [1, 2, 3]) {
        const source = pixels(...Array.from({ length: width * 2 }, () => [60, 130, 180, 100]).flat());
        expect(await run(source, width, kind, value)).toEqual(source);
      }
      expect(await run(pixels(90, 80, 70, 255), 1, kind, value)).toEqual(pixels(90, 80, 70, 255));
    }
  });

  it('uses a clamped four-neighbor sharpen and a distinct softer unsharp mask', async () => {
    const source = pixels(100, 100, 100, 255, 120, 120, 120, 255, 100, 100, 100, 255);
    expect(await run(source, 3, 'sharpen', 1)).toEqual(pixels(80, 80, 80, 255, 160, 160, 160, 255, 80, 80, 80, 255));
    expect(await run(source, 3, 'unblur', 100)).toEqual(pixels(87, 87, 87, 255, 147, 147, 147, 255, 87, 87, 87, 255));
    expect(await run(pixels(0, 0, 0, 255, 255, 255, 255, 255), 2, 'sharpen', 3))
      .toEqual(pixels(0, 0, 0, 255, 255, 255, 255, 255));
  });

  it('does not create dark halos from invisible neighbors or alter alpha', async () => {
    for (const [kind, value] of [['sharpen', 3], ['unblur', 100]] as const) {
      const source = pixels(110, 140, 170, 128, 0, 0, 0, 0);
      const result = await run(source, 2, kind, value);
      expect(result?.slice(0, 4)).toEqual(pixels(110, 140, 170, 128));
      expect(result?.[7]).toBe(0);
    }
    expect(await run(pixels(20, 30, 40, 0), 1, 'pixelate', 64)).toEqual(pixels(20, 30, 40, 0));
  });

  it('yields and cancels instead of returning a stale large-image result', async () => {
    let cancelled = false;
    const result = await applyImageEffect({ data: new Uint8ClampedArray(256 * 256 * 4), width: 256, height: 256 },
      { kind: 'unblur', value: 100 }, { isCancelled: () => cancelled, yieldControl: async () => { cancelled = true; } });
    expect(cancelled).toBe(true);
    expect(result).toBeNull();
  });

  it('rejects dimensions before pixel allocation', () => {
    expect(validateEffectDimensions(4000, 4000).valid).toBe(true);
    for (const [width, height] of [[4001, 4000], [8193, 1], [0, 1], [1.5, 2], [NaN, 1]]) {
      expect(validateEffectDimensions(width, height).valid).toBe(false);
    }
  });

  it('rejects failed or incorrectly encoded previews without retrying internally', async () => {
    const encoders = [
      async () => null,
      async () => { throw new Error('Encoder failed'); },
      async () => new Blob([new Uint8Array([0xff, 0xd8, 0xff])], { type: 'image/jpeg' }),
      async () => new Blob(['wrong bytes'], { type: 'image/png' }),
    ];
    for (const encode of encoders) {
      let calls = 0;
      await expect(encodeEffectPreview(async () => { calls++; return encode(); }, 'image/png', () => false)).rejects.toThrow();
      expect(calls).toBe(1);
    }
    const blob = new Blob([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], { type: 'image/png' });
    expect(await encodeEffectPreview(async () => blob, 'image/png', () => false)).toBe(blob);
  });

  it('discards an encode that finishes after cancellation', async () => {
    let cancelled = false;
    const blob = new Blob([new Uint8Array([0xff, 0xd8, 0xff])], { type: 'image/jpeg' });
    expect(await encodeEffectPreview(async () => { cancelled = true; return blob; }, 'image/jpeg', () => cancelled)).toBeNull();
  });
});
