import { describe, expect, it } from 'vitest';
import { clampCropPosition } from './CircleCropClient';

describe('clampCropPosition', () => {
  it('keeps the centered crop position', () => {
    expect(clampCropPosition(1200, 800, 400, { x: 400, y: 200 })).toEqual({ x: 400, y: 200 });
  });

  it('clamps a crop beyond the top-left image edge', () => {
    expect(clampCropPosition(1200, 800, 400, { x: -50, y: -25 })).toEqual({ x: 0, y: 0 });
  });

  it('clamps a crop beyond the bottom-right image edge', () => {
    expect(clampCropPosition(1200, 800, 400, { x: 900, y: 500 })).toEqual({ x: 800, y: 400 });
  });
});
