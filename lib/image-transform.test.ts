import { describe, expect, it } from 'vitest';
import {
  getImageTransformPlan,
  getImageTransformOutputFormat,
  mapImageTransformPixel,
  validateImageTransformDimensions,
  validateImageTransformFile,
  verifyImageTransformOutputSignature,
} from './image-transform';

const PNG_HEADER = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_HEADER = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);

describe('image transform output format', () => {
  it('keeps PNG and JPEG sources in their format and rasterizes other formats to PNG', () => {
    expect(getImageTransformOutputFormat('image/png')).toMatchObject({ mimeType: 'image/png', extension: 'png', label: 'PNG' });
    expect(getImageTransformOutputFormat('image/jpeg')).toMatchObject({ mimeType: 'image/jpeg', extension: 'jpg', label: 'JPEG', quality: 0.9 });
    expect(getImageTransformOutputFormat('image/webp')).toMatchObject({ mimeType: 'image/png', extension: 'png', label: 'PNG' });
  });

  it('requires the output signature to match its MIME type', () => {
    expect(verifyImageTransformOutputSignature(PNG_HEADER, 'image/png')).toBe(true);
    expect(verifyImageTransformOutputSignature(JPEG_HEADER, 'image/jpeg')).toBe(true);
    expect(verifyImageTransformOutputSignature(PNG_HEADER, 'image/jpeg')).toBe(false);
    expect(verifyImageTransformOutputSignature(JPEG_HEADER, 'image/png')).toBe(false);
  });
});

describe('image transform dimensions', () => {
  it('swaps width and height only for quarter-turn rotations', () => {
    expect(getImageTransformPlan(3, 2, { type: 'rotate', angle: 0 })).toEqual({ width: 3, height: 2, translateX: 0, translateY: 0, rotateRadians: 0, scaleX: 1, scaleY: 1 });
    expect(getImageTransformPlan(3, 2, { type: 'rotate', angle: 90 })).toMatchObject({ width: 2, height: 3 });
    expect(getImageTransformPlan(3, 2, { type: 'rotate', angle: 180 })).toMatchObject({ width: 3, height: 2 });
    expect(getImageTransformPlan(3, 2, { type: 'rotate', angle: 270 })).toMatchObject({ width: 2, height: 3 });
    expect(getImageTransformPlan(3, 2, { type: 'flip', direction: 'horizontal' })).toMatchObject({ width: 3, height: 2 });
    expect(getImageTransformPlan(3, 2, { type: 'flip', direction: 'both' })).toMatchObject({ width: 3, height: 2 });
  });

  it('rejects impossible source dimensions before drawing', () => {
    expect(validateImageTransformDimensions(0, 10).valid).toBe(false);
    expect(validateImageTransformDimensions(8193, 10).valid).toBe(false);
    expect(validateImageTransformDimensions(8000, 4100).valid).toBe(false);
    expect(validateImageTransformDimensions(640, 427)).toEqual({ valid: true, width: 640, height: 427, error: '' });
  });
});

describe('image transform pixel coordinates', () => {
  it('maps clockwise rotations to exact integer output pixels', () => {
    expect(mapImageTransformPixel(3, 2, 0, 0, { type: 'rotate', angle: 0 })).toEqual({ x: 0, y: 0 });
    expect(mapImageTransformPixel(3, 2, 2, 1, { type: 'rotate', angle: 0 })).toEqual({ x: 2, y: 1 });
    expect(mapImageTransformPixel(3, 2, 0, 0, { type: 'rotate', angle: 90 })).toEqual({ x: 1, y: 0 });
    expect(mapImageTransformPixel(3, 2, 2, 1, { type: 'rotate', angle: 90 })).toEqual({ x: 0, y: 2 });
    expect(mapImageTransformPixel(3, 2, 0, 0, { type: 'rotate', angle: 180 })).toEqual({ x: 2, y: 1 });
    expect(mapImageTransformPixel(3, 2, 2, 1, { type: 'rotate', angle: 270 })).toEqual({ x: 1, y: 0 });
  });

  it('returns to the original coordinates after four clockwise quarter turns', () => {
    const point = { x: 1, y: 1 };
    let width = 3;
    let height = 2;
    let mapped = point;
    for (let turn = 0; turn < 4; turn++) {
      mapped = mapImageTransformPixel(width, height, mapped.x, mapped.y, { type: 'rotate', angle: 90 });
      [width, height] = [height, width];
    }
    expect(mapped).toEqual(point);
  });

  it('maps flips without changing dimensions', () => {
    expect(mapImageTransformPixel(4, 3, 0, 1, { type: 'flip', direction: 'horizontal' })).toEqual({ x: 3, y: 1 });
    expect(mapImageTransformPixel(4, 3, 2, 0, { type: 'flip', direction: 'vertical' })).toEqual({ x: 2, y: 2 });
    expect(mapImageTransformPixel(4, 3, 1, 2, { type: 'flip', direction: 'both' })).toEqual({ x: 2, y: 0 });
  });
});

describe('image transform validation', () => {
  it('allows a missing declared MIME when bytes identify a supported image', () => {
    const file = new File([PNG_HEADER], 'upload', { type: '' });
    expect(validateImageTransformFile(file, 'image/png')).toBe('');
  });

  it('rejects known declared MIME conflicts and unsupported bytes', () => {
    const conflict = new File([PNG_HEADER], 'photo.jpg', { type: 'image/jpeg' });
    expect(validateImageTransformFile(conflict, 'image/png')).toContain('looks like PNG');
    expect(validateImageTransformFile(new File([new Uint8Array([1, 2, 3])], 'photo.bin'), '')).toBe('This does not look like a supported image file.');
  });

});
