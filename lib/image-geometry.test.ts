import { describe, expect, it } from 'vitest';
import {
  MAX_IMAGE_GEOMETRY_PIXELS,
  MAX_IMAGE_GEOMETRY_SIDE,
  calculateBorderGeometry,
  calculateContainGeometry,
  calculateCoverGeometry,
  calculateStretchGeometry,
  encodeGeometryBlobWithJpegRetry,
  getDefaultGeometryFormat,
  getGeometryDownloadName,
  verifyGeometryOutputSignature,
  parseGeometryInteger,
  validateGeometryDimensions,
} from './image-geometry';

describe('image geometry dimensions', () => {
  it('rejects blank, fractional, coerced, oversized, and too-large pixel values', () => {
    expect(parseGeometryInteger('')).toMatchObject({ valid: false });
    expect(parseGeometryInteger('640px')).toMatchObject({ valid: false });
    expect(parseGeometryInteger('10.5')).toMatchObject({ valid: false });
    expect(validateGeometryDimensions(0, 10).valid).toBe(false);
    expect(validateGeometryDimensions(MAX_IMAGE_GEOMETRY_SIDE + 1, 10).valid).toBe(false);
    expect(validateGeometryDimensions(8000, Math.ceil(MAX_IMAGE_GEOMETRY_PIXELS / 8000) + 1).valid).toBe(false);
  });

  it('accepts positive whole-pixel dimensions inside canvas limits', () => {
    expect(parseGeometryInteger('640')).toEqual({ valid: true, value: 640, error: '' });
    expect(validateGeometryDimensions(640, 427)).toEqual({ valid: true, width: 640, height: 427, error: '' });
  });
});

describe('image geometry draw placement', () => {
  it('centers a cover crop and preserves exact canvas dimensions', () => {
    expect(calculateCoverGeometry({ sourceWidth: 400, sourceHeight: 200, targetWidth: 100, targetHeight: 100 })).toEqual({
      canvasWidth: 100,
      canvasHeight: 100,
      drawX: -50,
      drawY: 0,
      drawWidth: 200,
      drawHeight: 100,
    });
  });

  it('centers contain output with padding space left outside the image', () => {
    expect(calculateContainGeometry({ sourceWidth: 400, sourceHeight: 200, targetWidth: 100, targetHeight: 100 })).toEqual({
      canvasWidth: 100,
      canvasHeight: 100,
      drawX: 0,
      drawY: 25,
      drawWidth: 100,
      drawHeight: 50,
    });
  });

  it('stretches to the exact target rectangle', () => {
    expect(calculateStretchGeometry({ targetWidth: 321, targetHeight: 123 })).toEqual({
      canvasWidth: 321,
      canvasHeight: 123,
      drawX: 0,
      drawY: 0,
      drawWidth: 321,
      drawHeight: 123,
    });
  });

  it('adds border outside the source without changing the interior placement', () => {
    expect(calculateBorderGeometry({ sourceWidth: 80, sourceHeight: 60, borderWidth: 10 })).toEqual({
      canvasWidth: 100,
      canvasHeight: 80,
      drawX: 10,
      drawY: 10,
      drawWidth: 80,
      drawHeight: 60,
    });
  });
});

describe('image geometry export policy', () => {
  it('defaults JPEG input to JPEG and other supported input to PNG', () => {
    expect(getDefaultGeometryFormat('image/jpeg')).toBe('image/jpeg');
    expect(getDefaultGeometryFormat('image/png')).toBe('image/png');
    expect(getDefaultGeometryFormat('image/webp')).toBe('image/png');
  });

  it('builds safe output names with dimensions and border labels', () => {
    expect(getGeometryDownloadName('my photo.JPG', 'resized', 'image/jpeg', { width: 640, height: 427 })).toBe('my-photo-resized-640x427.jpg');
    expect(getGeometryDownloadName('avatar.png', 'border-10px', 'image/png', { width: 120, height: 120 })).toBe('avatar-border-10px-120x120.png');
  });

  it('verifies encoded PNG and JPEG bytes instead of trusting the blob MIME', () => {
    expect(verifyGeometryOutputSignature(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), 'image/png')).toBe(true);
    expect(verifyGeometryOutputSignature(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]), 'image/jpeg')).toBe(true);
    expect(verifyGeometryOutputSignature(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), 'image/jpeg')).toBe(false);
    expect(verifyGeometryOutputSignature(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]), 'image/png')).toBe(false);
  });

  it('retries JPEG below the 85 percent ceiling only when same-size output is larger', async () => {
    const qualities: Array<number | undefined> = [];
    const sameSize = await encodeGeometryBlobWithJpegRetry({
      originalBytes: 1_000,
      requestedMimeType: 'image/jpeg',
      maxQuality: 95,
      allowRetryWhenLarger: true,
      encode: async (_mimeType, quality) => {
        qualities.push(quality);
        return new Blob([new Uint8Array(quality === 0.65 ? 900 : 1_100)], { type: 'image/jpeg' });
      },
      isCancelled: () => false,
    });

    expect(qualities).toEqual([0.85, 0.75, 0.65]);
    expect(sameSize).toMatchObject({ actualQuality: 65, qualityAutoReduced: true, failed: false });
    expect(sameSize.blob?.size).toBe(900);

    const resizedQualities: Array<number | undefined> = [];
    const resized = await encodeGeometryBlobWithJpegRetry({
      originalBytes: 1_000,
      requestedMimeType: 'image/jpeg',
      maxQuality: 85,
      allowRetryWhenLarger: false,
      encode: async (_mimeType, quality) => {
        resizedQualities.push(quality);
        return new Blob([new Uint8Array(1_100)], { type: 'image/jpeg' });
      },
      isCancelled: () => false,
    });

    expect(resizedQualities).toEqual([0.85]);
    expect(resized).toMatchObject({ actualQuality: 85, qualityAutoReduced: false, failed: false });
  });
});
