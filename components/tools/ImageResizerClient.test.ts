import { describe, expect, it } from 'vitest';
import {
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
