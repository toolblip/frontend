import { describe, expect, it } from 'vitest';
import {
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
