import { describe, expect, it } from 'vitest';
import {
  encodeImageResizerBlobWithSizeAwareness,
  formatImageResizerBytes,
  getImageResizerExportPlan,
  getImageResizerSizeChange,
  validateResizeDimensions,
} from './ImageResizerClient';

describe('validateResizeDimensions', () => {
  it('rejects fractional and non-finite output dimensions', () => {
    expect(validateResizeDimensions(1.5, 10).valid).toBe(false);
    expect(validateResizeDimensions(Number.NaN, 10).valid).toBe(false);
    expect(validateResizeDimensions(200, Number.POSITIVE_INFINITY).valid).toBe(false);
  });

  it('rejects dimensions that are too large for the browser canvas', () => {
    expect(validateResizeDimensions(12000, 12000).valid).toBe(false);
  });

  it('accepts positive integer dimensions inside the canvas limits', () => {
    expect(validateResizeDimensions(200, 100)).toEqual({
      valid: true,
      width: 200,
      height: 100,
      error: '',
    });
  });
});

describe('getImageResizerExportPlan', () => {
  it('keeps JPEG input as JPEG when format is Auto', () => {
    expect(getImageResizerExportPlan(200, 100, 'image/jpeg', 'photo.jpeg', 'auto')).toMatchObject({
      width: 200,
      height: 100,
      requestedMimeType: 'image/jpeg',
      extension: 'jpg',
      filename: 'photo-resized-200x100.jpg',
      unsupportedSourceFormat: false,
    });
  });

  it('uses PNG with a note when Auto receives an unsupported image format', () => {
    expect(getImageResizerExportPlan(320, 240, 'image/gif', 'spinner.gif', 'auto')).toMatchObject({
      requestedMimeType: 'image/png',
      extension: 'png',
      filename: 'spinner-resized-320x240.png',
      unsupportedSourceFormat: true,
      note: 'GIF is not exportable here, so Auto will create a PNG.',
    });
  });

  it('infers a supported source format from the filename when browser MIME is empty', () => {
    expect(getImageResizerExportPlan(100, 75, '', 'camera.JPG', 'auto')).toMatchObject({
      requestedMimeType: 'image/jpeg',
      extension: 'jpg',
      filename: 'camera-resized-100x75.jpg',
      unsupportedSourceFormat: false,
    });
  });

  it('names unknown extension fallbacks honestly when browser MIME is empty', () => {
    expect(getImageResizerExportPlan(100, 75, '', 'vector.svg', 'auto')).toMatchObject({
      requestedMimeType: 'image/png',
      extension: 'png',
      note: 'SVG is not exportable here, so Auto will create a PNG.',
    });
  });

  it('uses explicit WebP selection in the filename and requested encoder type', () => {
    expect(getImageResizerExportPlan(400, 300, 'image/png', 'logo.png', 'webp')).toMatchObject({
      requestedMimeType: 'image/webp',
      extension: 'webp',
      filename: 'logo-resized-400x300.webp',
    });
  });
});

describe('formatImageResizerBytes', () => {
  it('formats actual blob byte counts as bytes and KB', () => {
    expect(formatImageResizerBytes(512)).toBe('512 bytes (0.5 KB)');
    expect(formatImageResizerBytes(11_264)).toBe('11,264 bytes (11.0 KB)');
  });
});

describe('getImageResizerSizeChange', () => {
  it('reports a signed byte and percent increase when the resized file grows', () => {
    expect(getImageResizerSizeChange(3_072, 11_264)).toEqual({
      bytes: 8_192,
      percent: 266.7,
      label: '+8,192 bytes (+266.7%)',
      grew: true,
    });
  });

  it('reports a signed byte and percent decrease when the resized file shrinks', () => {
    expect(getImageResizerSizeChange(11_264, 3_072)).toEqual({
      bytes: -8_192,
      percent: -72.7,
      label: '-8,192 bytes (-72.7%)',
      grew: false,
    });
  });
});

describe('encodeImageResizerBlobWithSizeAwareness', () => {
  const blob = (size: number, type = 'image/jpeg') => new Blob([new Uint8Array(size)], { type });

  it('retries JPEG/WebP below the selected maximum when the first result is not smaller', async () => {
    const qualities: Array<number | undefined> = [];
    const result = await encodeImageResizerBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/jpeg',
      maxQuality: 86,
      encode: async (_mimeType, quality) => {
        qualities.push(quality);
        return quality === 0.86 ? blob(1_050) : blob(900);
      },
      isCancelled: () => false,
    });

    expect(qualities).toEqual([0.86, 0.76]);
    expect(result).toMatchObject({
      blob: expect.any(Blob),
      actualQuality: 76,
      qualityAutoReduced: true,
      couldMakeSmaller: true,
    });
    expect(result.blob?.size).toBe(900);
  });

  it('keeps the lowest-byte candidate when no tested quality is strictly smaller', async () => {
    const sizes: Record<number, number> = {
      86: 1_060,
      76: 1_030,
      66: 1_080,
      56: 1_020,
      46: 1_040,
      36: 1_025,
      26: 1_050,
      16: 1_070,
      10: 1_035,
    };

    const result = await encodeImageResizerBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/webp',
      maxQuality: 86,
      encode: async (_mimeType, quality) => blob(sizes[Math.round((quality ?? 0) * 100)] ?? 2_000, 'image/webp'),
      isCancelled: () => false,
    });

    expect(result.blob?.size).toBe(1_020);
    expect(result.actualQuality).toBe(56);
    expect(result.qualityAutoReduced).toBe(true);
    expect(result.couldMakeSmaller).toBe(false);
  });

  it('uses bounded ten-point retries down to the quality floor', async () => {
    const qualities: Array<number | undefined> = [];

    await encodeImageResizerBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/jpeg',
      maxQuality: 35,
      encode: async (_mimeType, quality) => {
        qualities.push(quality);
        return blob(1_100);
      },
      isCancelled: () => false,
    });

    expect(qualities).toEqual([0.35, 0.25, 0.15, 0.1]);
  });

  it('does not retry PNG because the quality slider does not apply', async () => {
    const qualities: Array<number | undefined> = [];

    const result = await encodeImageResizerBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/png',
      maxQuality: 86,
      encode: async (_mimeType, quality) => {
        qualities.push(quality);
        return blob(1_200, 'image/png');
      },
      isCancelled: () => false,
    });

    expect(qualities).toEqual([undefined]);
    expect(result.actualQuality).toBeNull();
    expect(result.qualityAutoReduced).toBe(false);
    expect(result.couldMakeSmaller).toBe(false);
  });

  it('stops quality search when the browser falls back to another MIME type', async () => {
    const qualities: Array<number | undefined> = [];

    const result = await encodeImageResizerBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/webp',
      maxQuality: 86,
      encode: async (_mimeType, quality) => {
        qualities.push(quality);
        return blob(1_200, 'image/png');
      },
      isCancelled: () => false,
    });

    expect(qualities).toEqual([0.86]);
    expect(result.blob?.type).toBe('image/png');
    expect(result.actualQuality).toBeNull();
    expect(result.fellBackMimeType).toBe(true);
  });

  it('returns a failed result when encode returns null or rejects', async () => {
    await expect(encodeImageResizerBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/jpeg',
      maxQuality: 86,
      encode: async () => null,
      isCancelled: () => false,
    })).resolves.toMatchObject({ blob: null, failed: true });

    await expect(encodeImageResizerBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/jpeg',
      maxQuality: 86,
      encode: async () => {
        throw new Error('encoder failed');
      },
      isCancelled: () => false,
    })).resolves.toMatchObject({ blob: null, failed: true });
  });

  it('cancels before additional attempts and returns no result', async () => {
    let attempts = 0;

    const result = await encodeImageResizerBlobWithSizeAwareness({
      originalBytes: 1_000,
      requestedMimeType: 'image/jpeg',
      maxQuality: 86,
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
