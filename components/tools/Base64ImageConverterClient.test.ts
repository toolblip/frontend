import { describe, expect, it } from 'vitest';
import {
  bytesToBase64ImageDataUrl,
  decodeBase64ImageInput,
  detectImageFormat,
  normalizeBase64ImageDataUrl,
  validateImageFileBytes,
} from './Base64ImageConverterClient';

const pngBytes = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  0x00, 0x00, 0x00, 0x0d,
]);
const jpegBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
const gifBytes = new TextEncoder().encode('GIF89a');
const webpBytes = new Uint8Array([
  0x52, 0x49, 0x46, 0x46, 0x18, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
]);
const svgBytes = new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>');
const maxImageBytes = 10 * 1024 * 1024;

describe('detectImageFormat', () => {
  it('detects PNG, JPEG, GIF, WebP, and SVG from bytes', () => {
    expect(detectImageFormat(pngBytes)?.mime).toBe('image/png');
    expect(detectImageFormat(jpegBytes)?.mime).toBe('image/jpeg');
    expect(detectImageFormat(gifBytes)?.mime).toBe('image/gif');
    expect(detectImageFormat(webpBytes)?.mime).toBe('image/webp');
    expect(detectImageFormat(svgBytes)?.mime).toBe('image/svg+xml');
  });
});

describe('decodeBase64ImageInput', () => {
  it('round-trips bytes, MIME, and extension for every supported image format', () => {
    const cases = [
      { bytes: pngBytes, mime: 'image/png', extension: 'png' },
      { bytes: jpegBytes, mime: 'image/jpeg', extension: 'jpg' },
      { bytes: gifBytes, mime: 'image/gif', extension: 'gif' },
      { bytes: webpBytes, mime: 'image/webp', extension: 'webp' },
      { bytes: svgBytes, mime: 'image/svg+xml', extension: 'svg' },
    ] as const;

    for (const item of cases) {
      expect(decodeBase64ImageInput(bytesToBase64ImageDataUrl(item.bytes, item.mime))).toEqual({
        ok: true,
        bytes: item.bytes,
        mime: item.mime,
        extension: item.extension,
        dataUrl: bytesToBase64ImageDataUrl(item.bytes, item.mime),
      });
    }
  });

  it('rejects valid Base64 text that is not an image', () => {
    expect(decodeBase64ImageInput('aGVsbG8=')).toEqual({
      ok: false,
      error: 'Decoded bytes are not a supported image.',
    });
  });

  it('detects raw wrapped JPEG Base64 without assuming PNG', () => {
    const raw = bytesToBase64ImageDataUrl(jpegBytes, 'image/jpeg').split(',')[1];
    const wrapped = `${raw.slice(0, 6)}\n ${raw.slice(6)}`;

    expect(decodeBase64ImageInput(wrapped)).toEqual({
      ok: true,
      bytes: jpegBytes,
      mime: 'image/jpeg',
      extension: 'jpg',
      dataUrl: `data:image/jpeg;base64,${raw}`,
    });
  });

  it('accepts image data URLs with charset and preserves decoded bytes', () => {
    const base64 = bytesToBase64ImageDataUrl(webpBytes, 'image/webp').split(',')[1];

    expect(decodeBase64ImageInput(`data:image/webp;charset=utf-8;base64,${base64}`)).toEqual({
      ok: true,
      bytes: webpBytes,
      mime: 'image/webp',
      extension: 'webp',
      dataUrl: `data:image/webp;base64,${base64}`,
    });
  });

  it('rejects data URLs whose declared MIME does not match the actual image bytes', () => {
    const base64 = bytesToBase64ImageDataUrl(jpegBytes, 'image/jpeg').split(',')[1];

    expect(decodeBase64ImageInput(`data:image/png;base64,${base64}`)).toEqual({
      ok: false,
      error: 'The data URL says PNG, but the bytes are JPEG.',
    });
  });

  it('accepts exactly 10 MiB of image bytes even when Base64 padding is present', () => {
    const bytes = new Uint8Array(maxImageBytes);
    bytes.set(pngBytes);
    const dataUrl = bytesToBase64ImageDataUrl(bytes, 'image/png');

    const decoded = decodeBase64ImageInput(dataUrl);

    expect(decoded).toMatchObject({
      ok: true,
      mime: 'image/png',
      extension: 'png',
    });
    expect(decoded.ok && decoded.bytes.length).toBe(maxImageBytes);
  });

  it('rejects decoded image bytes larger than 10 MiB', () => {
    const bytes = new Uint8Array(maxImageBytes + 1);
    bytes.set(pngBytes);

    expect(decodeBase64ImageInput(bytesToBase64ImageDataUrl(bytes, 'image/png'))).toEqual({
      ok: false,
      error: 'Images are limited to 10 MiB before Base64 encoding.',
    });
  });
});

describe('normalizeBase64ImageDataUrl', () => {
  it('emits a canonical data URL with the detected MIME', () => {
    const raw = bytesToBase64ImageDataUrl(gifBytes, 'image/gif').split(',')[1];

    expect(normalizeBase64ImageDataUrl(raw)).toBe(`data:image/gif;base64,${raw}`);
  });
});

describe('validateImageFileBytes', () => {
  it('rejects non-image uploads before encoding', () => {
    const text = new TextEncoder().encode('plain text');

    expect(validateImageFileBytes(text, 'text/plain')).toEqual({
      ok: false,
      error: 'Upload a PNG, JPEG, GIF, WebP, or browser-decodable SVG image.',
    });
  });

  it('rejects uploaded image MIME mismatches', () => {
    expect(validateImageFileBytes(jpegBytes, 'image/png')).toEqual({
      ok: false,
      error: 'The uploaded file is labeled PNG, but the bytes are JPEG.',
    });
  });

  it('infers image format when the upload MIME is missing', () => {
    expect(validateImageFileBytes(pngBytes, '')).toEqual({
      ok: true,
      format: {
        mime: 'image/png',
        extension: 'png',
        label: 'PNG',
      },
    });
  });
});
