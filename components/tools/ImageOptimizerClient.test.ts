import { describe, expect, it } from 'vitest';
import {
  encodeImageOptimizerBlobWithSizeAwareness,
  getCanonicalOptimizerSourceFile,
  getImageOptimizerOutputDimensions,
  getImageOptimizerOutputPolicy,
  validateOptimizerDimensions,
} from './ImageOptimizerClient';

describe('validateOptimizerDimensions', () => {
  it('rejects non-integer, zero, per-axis oversized, and too-large pixel counts', () => {
    expect(validateOptimizerDimensions(1.5, 10).valid).toBe(false);
    expect(validateOptimizerDimensions(0, 10).valid).toBe(false);
    expect(validateOptimizerDimensions(8193, 10).valid).toBe(false);
    expect(validateOptimizerDimensions(8000, 5000).valid).toBe(false);
  });

  it('accepts positive integer dimensions inside the optimizer canvas limits', () => {
    expect(validateOptimizerDimensions(640, 427)).toEqual({
      valid: true,
      width: 640,
      height: 427,
      error: '',
    });
  });
});

describe('getImageOptimizerOutputDimensions', () => {
  it('aspect-fits without upscaling and keeps both axes at least one pixel', () => {
    expect(getImageOptimizerOutputDimensions({
      sourceWidth: 100,
      sourceHeight: 50,
      widthInput: 1000,
      heightInput: 1000,
      maintainAspectRatio: true,
    })).toEqual({ width: 100, height: 50 });

    expect(getImageOptimizerOutputDimensions({
      sourceWidth: 1000,
      sourceHeight: 250,
      widthInput: 1,
      heightInput: 1,
      maintainAspectRatio: true,
    })).toEqual({ width: 1, height: 1 });
  });

  it('uses explicit exact dimensions when aspect ratio is unlocked', () => {
    expect(getImageOptimizerOutputDimensions({
      sourceWidth: 1200,
      sourceHeight: 800,
      widthInput: 321,
      heightInput: 123,
      maintainAspectRatio: false,
    })).toEqual({ width: 321, height: 123 });
  });
});

describe('getImageOptimizerOutputPolicy', () => {
  it('retains original bytes for a same-format PNG when upload MIME was missing but detection found PNG', async () => {
    const original = new File([new Uint8Array([1, 2, 3])], 'tiny.weird', { type: '' });
    const canonical = getCanonicalOptimizerSourceFile(original, 'image/png');
    const encoded = new Blob([new Uint8Array(10)], { type: 'image/png' });

    await expect(canonical.arrayBuffer()).resolves.toEqual(await original.arrayBuffer());
    expect(canonical.type).toBe('image/png');
    expect(canonical.size).toBe(original.size);

    expect(getImageOptimizerOutputPolicy({
      original: canonical,
      encoded,
      originalName: 'tiny.weird',
      requestedMimeType: 'image/png',
      requestedFilename: 'tiny-optimized-1x1.png',
      originalDimensions: { width: 1, height: 1 },
      outputDimensions: { width: 1, height: 1 },
    })).toMatchObject({
      blob: canonical,
      fileName: 'tiny.png',
      keptOriginal: true,
    });
  });

  it('keeps original bytes only when format and dimensions are unchanged and encode is not smaller', () => {
    const original = new Blob([new Uint8Array(100)], { type: 'image/png' });
    const encoded = new Blob([new Uint8Array(120)], { type: 'image/png' });

    expect(getImageOptimizerOutputPolicy({
      original,
      encoded,
      originalName: 'photo.png',
      requestedMimeType: 'image/png',
      requestedFilename: 'photo-optimized.png',
      originalDimensions: { width: 640, height: 427 },
      outputDimensions: { width: 640, height: 427 },
    })).toMatchObject({
      blob: original,
      fileName: 'photo.png',
      keptOriginal: true,
    });
  });

  it('does not discard requested resize or format changes even when the encode is larger', () => {
    const original = new Blob([new Uint8Array(100)], { type: 'image/png' });
    const encoded = new Blob([new Uint8Array(120)], { type: 'image/jpeg' });

    expect(getImageOptimizerOutputPolicy({
      original,
      encoded,
      originalName: 'photo.png',
      requestedMimeType: 'image/jpeg',
      requestedFilename: 'photo-optimized.jpg',
      originalDimensions: { width: 640, height: 427 },
      outputDimensions: { width: 320, height: 214 },
    })).toMatchObject({
      blob: encoded,
      fileName: 'photo-optimized.jpg',
      keptOriginal: false,
    });
  });
});

describe('encodeImageOptimizerBlobWithSizeAwareness', () => {
  const blob = (size: number, type = 'image/jpeg') => new Blob([new Uint8Array(size)], { type });

  it('uses exact Blob.size and retries JPEG/WebP down to the 35 percent floor', async () => {
    const qualities: Array<number | undefined> = [];

    const result = await encodeImageOptimizerBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/webp',
      maxQuality: 55,
      encode: async (_mimeType, quality) => {
        qualities.push(quality);
        return quality === 0.35 ? blob(930, 'image/webp') : blob(1_050, 'image/webp');
      },
      isCancelled: () => false,
    });

    expect(qualities).toEqual([0.55, 0.45, 0.35]);
    expect(result).toMatchObject({
      actualQuality: 35,
      qualityAutoReduced: true,
      couldMakeSmaller: true,
      failed: false,
    });
    expect(result.blob?.size).toBe(930);
  });

  it('fails when the browser returns a different MIME type than requested', async () => {
    await expect(encodeImageOptimizerBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/webp',
      maxQuality: 80,
      encode: async () => blob(900, 'image/png'),
      isCancelled: () => false,
    })).resolves.toMatchObject({
      blob: null,
      failed: true,
      mimeMismatch: true,
    });
  });
});
