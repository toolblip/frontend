import { describe, expect, it } from 'vitest';
import {
  createWebpConverterDecodeBlob,
  detectWebpConverterFormat,
  getWebpConverterOutputName,
  getWebpConverterSizeChange,
  getWebpConverterNativeOutputState,
  validateWebpConverterBlob,
  validateWebpConverterDimensions,
  validateWebpConverterOutputBlob,
} from './WebpConverterClient';

const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const jpegBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
const gifBytes = new TextEncoder().encode('GIF89a');
const webpBytes = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0x18, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50]);
const svgBytes = new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>');

describe('detectWebpConverterFormat', () => {
  it('detects supported image formats from bytes instead of filename trust', () => {
    expect(detectWebpConverterFormat(pngBytes)?.mime).toBe('image/png');
    expect(detectWebpConverterFormat(jpegBytes)?.mime).toBe('image/jpeg');
    expect(detectWebpConverterFormat(gifBytes)?.mime).toBe('image/gif');
    expect(detectWebpConverterFormat(webpBytes)?.mime).toBe('image/webp');
    expect(detectWebpConverterFormat(svgBytes)?.mime).toBe('image/svg+xml');
  });
});

describe('validateWebpConverterBlob', () => {
  it('rejects non-image bytes and upload MIME mismatches', async () => {
    await expect(validateWebpConverterBlob(new Blob([new TextEncoder().encode('hello')], { type: 'text/plain' }))).resolves.toEqual({
      ok: false,
      error: 'Upload a PNG, JPEG, WebP, GIF, or browser-decodable SVG image.',
    });
    await expect(validateWebpConverterBlob(new Blob([jpegBytes], { type: 'image/png' }))).resolves.toEqual({
      ok: false,
      error: 'The file is labeled PNG, but the bytes are JPEG.',
    });
  });

  it('accepts supported image bytes up to 20 MiB', async () => {
    await expect(validateWebpConverterBlob(new Blob([pngBytes], { type: 'image/png' }))).resolves.toEqual({
      ok: true,
      format: {
        extension: 'png',
        label: 'PNG',
        mime: 'image/png',
      },
    });
  });

  it('rejects source files larger than 20 MiB', async () => {
    const blob = new Blob([new Uint8Array(20 * 1024 * 1024 + 1)], { type: 'image/png' });
    await expect(validateWebpConverterBlob(blob)).resolves.toEqual({
      ok: false,
      error: 'Images are limited to 20 MiB.',
    });
  });
});

describe('createWebpConverterDecodeBlob', () => {
  it('uses the detected canonical MIME when the browser upload MIME is empty', () => {
    const source = new Blob([jpegBytes], { type: '' });
    const decodeBlob = createWebpConverterDecodeBlob(source, {
      mime: 'image/jpeg',
      extension: 'jpg',
      label: 'JPEG',
    });

    expect(decodeBlob.type).toBe('image/jpeg');
    expect(decodeBlob.size).toBe(source.size);
  });
});

describe('validateWebpConverterDimensions', () => {
  it('rejects oversized sides and total canvas area', () => {
    expect(validateWebpConverterDimensions(8193, 10).ok).toBe(false);
    expect(validateWebpConverterDimensions(6000, 6000)).toEqual({
      ok: false,
      error: 'Images are limited to 32 megapixels for browser conversion.',
    });
  });

  it('accepts source dimensions within the browser canvas limits', () => {
    expect(validateWebpConverterDimensions(1280, 853)).toEqual({ ok: true, error: '' });
  });
});

describe('validateWebpConverterOutputBlob', () => {
  it('requires a real image/webp blob with RIFF WEBP bytes before download is allowed', async () => {
    await expect(validateWebpConverterOutputBlob(null)).resolves.toEqual({
      ok: false,
      error: 'The browser could not encode a WebP image.',
    });
    await expect(validateWebpConverterOutputBlob(new Blob([pngBytes], { type: 'image/png' }))).resolves.toEqual({
      ok: false,
      error: 'The browser returned PNG instead of WebP.',
    });
    await expect(validateWebpConverterOutputBlob(new Blob([pngBytes], { type: 'image/webp' }))).resolves.toEqual({
      ok: false,
      error: 'The browser returned image/webp with non-WebP bytes.',
    });
    await expect(validateWebpConverterOutputBlob(new Blob([webpBytes], { type: 'image/webp' }))).resolves.toMatchObject({
      ok: true,
    });
  });
});

describe('getWebpConverterNativeOutputState', () => {
  it('uses native output only when both MIME and bytes are WebP', async () => {
    await expect(getWebpConverterNativeOutputState(new Blob([webpBytes], { type: 'image/webp' }))).resolves.toEqual({
      kind: 'usable',
    });
  });

  it('falls back for Safari-style PNG bytes, wrong MIME, or null native output', async () => {
    await expect(getWebpConverterNativeOutputState(null)).resolves.toEqual({ kind: 'fallback' });
    await expect(getWebpConverterNativeOutputState(new Blob([pngBytes], { type: 'image/png' }))).resolves.toEqual({ kind: 'fallback' });
    await expect(getWebpConverterNativeOutputState(new Blob([pngBytes], { type: 'image/webp' }))).resolves.toEqual({ kind: 'fallback' });
  });
});

describe('WebP converter output helpers', () => {
  it('uses the source basename with a .webp extension', () => {
    expect(getWebpConverterOutputName('mountain.sample.jpg')).toBe('mountain.sample.webp');
    expect(getWebpConverterOutputName('untitled')).toBe('untitled.webp');
  });

  it('reports exact byte changes without promising smaller output', () => {
    expect(getWebpConverterSizeChange(1000, 850)).toBe('150 bytes smaller (15.0%)');
    expect(getWebpConverterSizeChange(1000, 1250)).toBe('250 bytes larger (25.0%)');
  });
});
