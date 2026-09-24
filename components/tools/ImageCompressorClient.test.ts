import { describe, expect, it } from 'vitest';
import {
  encodeImageCompressorBlobWithSizeAwareness,
  getImageCompressorOutputPolicy,
  getImageCompressorPlan,
  getImageCompressorResultSummary,
  validateCompressorDimensions,
} from './ImageCompressorClient';

describe('validateCompressorDimensions', () => {
  it('rejects zero and oversized canvas dimensions before allocation', () => {
    expect(validateCompressorDimensions(0, 853).valid).toBe(false);
    expect(validateCompressorDimensions(9000, 853).valid).toBe(false);
    expect(validateCompressorDimensions(8192, 4883).valid).toBe(false);
  });

  it('accepts the bundled sample dimensions without resizing them', () => {
    expect(validateCompressorDimensions(1280, 853)).toEqual({
      valid: true,
      error: '',
    });
  });
});

describe('getImageCompressorPlan', () => {
  it('uses JPEG quality controls and an honest filename', () => {
    expect(getImageCompressorPlan('jpeg', 'mountain.sample.png')).toMatchObject({
      requestedMimeType: 'image/jpeg',
      requestedExtension: 'jpg',
      qualityApplies: true,
      filename: 'mountain.sample-compressed.jpg',
    });
  });

  it('marks PNG as not quality controlled', () => {
    expect(getImageCompressorPlan('png', 'logo.png')).toMatchObject({
      requestedMimeType: 'image/png',
      qualityApplies: false,
      filename: 'logo-compressed.png',
    });
  });
});

describe('getImageCompressorOutputPolicy', () => {
  it('keeps original bytes and original name when encoding does not reduce size', () => {
    const original = new Blob([new Uint8Array(100)], { type: 'image/png' });
    const encoded = new Blob([new Uint8Array(120)], { type: 'image/jpeg' });

    expect(getImageCompressorOutputPolicy({
      original,
      encoded,
      originalName: 'logo.png',
      compressedName: 'logo-compressed.jpg',
      requestedMimeType: 'image/jpeg',
    })).toMatchObject({
      blob: original,
      fileName: 'logo.png',
      formatLabel: 'PNG',
      keptOriginal: true,
      note: 'No smaller export was available with these settings. The original file was kept unchanged.',
    });
  });

  it('reports browser MIME fallback using the actual encoded format', () => {
    const original = new Blob([new Uint8Array(100)], { type: 'image/jpeg' });
    const encoded = new Blob([new Uint8Array(60)], { type: 'image/png' });

    expect(getImageCompressorOutputPolicy({
      original,
      encoded,
      originalName: 'photo.jpg',
      compressedName: 'photo-compressed.webp',
      requestedMimeType: 'image/webp',
    })).toMatchObject({
      blob: encoded,
      fileName: 'photo-compressed.png',
      formatLabel: 'PNG',
      keptOriginal: false,
      note: 'Your browser exported PNG instead of WebP.',
    });
  });
});

describe('encodeImageCompressorBlobWithSizeAwareness', () => {
  const blob = (size: number, type = 'image/jpeg') => new Blob([new Uint8Array(size)], { type });

  it('accepts the first JPEG/WebP encode when actual bytes are already smaller', async () => {
    const qualities: Array<number | undefined> = [];

    const result = await encodeImageCompressorBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/jpeg',
      maxQuality: 80,
      encode: async (_mimeType, quality) => {
        qualities.push(quality);
        return blob(900);
      },
      isCancelled: () => false,
    });

    expect(qualities).toEqual([0.8]);
    expect(result).toMatchObject({
      actualQuality: 80,
      qualityAutoReduced: false,
      couldMakeSmaller: true,
      failed: false,
      cancelled: false,
    });
    expect(result.blob?.size).toBe(900);
  });

  it('retries JPEG/WebP below the selected maximum until a smaller encode is found', async () => {
    const qualities: Array<number | undefined> = [];

    const result = await encodeImageCompressorBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/webp',
      maxQuality: 80,
      encode: async (_mimeType, quality) => {
        qualities.push(quality);
        return quality === 0.8 ? blob(1_050, 'image/webp') : blob(940, 'image/webp');
      },
      isCancelled: () => false,
    });

    expect(qualities).toEqual([0.8, 0.7]);
    expect(result).toMatchObject({
      actualQuality: 70,
      qualityAutoReduced: true,
      couldMakeSmaller: true,
    });
    expect(result.blob?.size).toBe(940);
  });

  it('uses ten-point retries down to the quality floor and keeps the lowest-byte candidate', async () => {
    const qualities: Array<number | undefined> = [];
    const sizes: Record<number, number> = {
      35: 1_120,
      25: 1_090,
      15: 1_105,
      10: 1_080,
    };

    const result = await encodeImageCompressorBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/jpeg',
      maxQuality: 35,
      encode: async (_mimeType, quality) => {
        qualities.push(quality);
        return blob(sizes[Math.round((quality ?? 0) * 100)] ?? 2_000);
      },
      isCancelled: () => false,
    });

    expect(qualities).toEqual([0.35, 0.25, 0.15, 0.1]);
    expect(result.blob?.size).toBe(1_080);
    expect(result.actualQuality).toBe(10);
    expect(result.qualityAutoReduced).toBe(true);
    expect(result.couldMakeSmaller).toBe(false);
  });

  it('does not retry PNG because quality does not apply', async () => {
    const qualities: Array<number | undefined> = [];

    const result = await encodeImageCompressorBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/png',
      maxQuality: 80,
      encode: async (_mimeType, quality) => {
        qualities.push(quality);
        return blob(1_200, 'image/png');
      },
      isCancelled: () => false,
    });

    expect(qualities).toEqual([undefined]);
    expect(result).toMatchObject({
      actualQuality: null,
      qualityAutoReduced: false,
      couldMakeSmaller: false,
    });
  });

  it('stops retrying when the browser falls back to another MIME type', async () => {
    const qualities: Array<number | undefined> = [];

    const result = await encodeImageCompressorBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/webp',
      maxQuality: 80,
      encode: async (_mimeType, quality) => {
        qualities.push(quality);
        return blob(900, 'image/png');
      },
      isCancelled: () => false,
    });

    expect(qualities).toEqual([0.8]);
    expect(result).toMatchObject({
      actualQuality: null,
      qualityAutoReduced: false,
      couldMakeSmaller: true,
      fellBackMimeType: true,
    });
  });

  it('returns failed when encode returns null or throws', async () => {
    await expect(encodeImageCompressorBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/jpeg',
      maxQuality: 80,
      encode: async () => null,
      isCancelled: () => false,
    })).resolves.toMatchObject({ blob: null, failed: true });

    await expect(encodeImageCompressorBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/jpeg',
      maxQuality: 80,
      encode: async () => {
        throw new Error('encoder failed');
      },
      isCancelled: () => false,
    })).resolves.toMatchObject({ blob: null, failed: true });
  });

  it('checks cancellation before a retry and returns no blob', async () => {
    let attempts = 0;

    const result = await encodeImageCompressorBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/jpeg',
      maxQuality: 80,
      encode: async () => {
        attempts += 1;
        return blob(1_100);
      },
      isCancelled: () => attempts > 0,
    });

    expect(attempts).toBe(1);
    expect(result).toMatchObject({ blob: null, cancelled: true });
  });
});

describe('getImageCompressorResultSummary', () => {
  it('treats a smaller browser fallback as compressed even when it has an explanatory note', () => {
    expect(getImageCompressorResultSummary(false, 94)).toEqual({
      title: '94% smaller',
      sizeWord: 'compressed',
    });
  });

  it('uses the original-kept copy only when the explicit policy flag says so', () => {
    expect(getImageCompressorResultSummary(true, -12)).toEqual({
      title: 'Original kept · no size reduction',
      sizeWord: 'unchanged',
    });
  });
});
