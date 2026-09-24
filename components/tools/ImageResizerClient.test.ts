import { describe, expect, it } from 'vitest';
import { getImageResizerExportPlan, validateResizeDimensions } from './ImageResizerClient';

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
  it('uses the validated integer dimensions in the PNG filename', () => {
    expect(getImageResizerExportPlan(200, 100)).toEqual({
      width: 200,
      height: 100,
      filename: 'resized-200x100.png',
    });
  });
});
