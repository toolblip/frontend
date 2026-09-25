import { describe, expect, it } from 'vitest';
import {
  COLLAGE_LAYOUTS,
  MAX_IMAGE_LAYOUT_OUTPUT_PIXELS,
  MAX_IMAGE_LAYOUT_OUTPUT_SIDE,
  calculateCollageLayout,
  calculateCombineLayout,
  getImageLayoutAggregateError,
  getImageLayoutCapacityError,
  getImageLayoutOutputError,
} from './image-layout';

const dims = (width: number, height: number) => ({ width, height });

describe('combine image layout geometry', () => {
  it('keeps horizontal images at original pixel size with centered vertical placement', () => {
    expect(calculateCombineLayout([dims(100, 60), dims(40, 120), dims(80, 80)], 'horizontal', 10)).toEqual({
      width: 240,
      height: 120,
      placements: [
        { x: 0, y: 30, width: 100, height: 60 },
        { x: 110, y: 0, width: 40, height: 120 },
        { x: 160, y: 20, width: 80, height: 80 },
      ],
    });
  });

  it('keeps vertical images at original pixel size with centered horizontal placement', () => {
    expect(calculateCombineLayout([dims(100, 60), dims(40, 120), dims(80, 80)], 'vertical', 0)).toEqual({
      width: 100,
      height: 260,
      placements: [
        { x: 0, y: 0, width: 100, height: 60 },
        { x: 30, y: 60, width: 40, height: 120 },
        { x: 10, y: 180, width: 80, height: 80 },
      ],
    });
  });

  it('uses true column widths and row heights for unequal grid images', () => {
    expect(calculateCombineLayout([
      dims(300, 40),
      dims(20, 200),
      dims(80, 90),
      dims(10, 10),
      dims(220, 70),
    ], 'grid', 10)).toEqual({
      width: 620,
      height: 280,
      placements: [
        { x: 0, y: 80, width: 300, height: 40 },
        { x: 410, y: 0, width: 20, height: 200 },
        { x: 540, y: 55, width: 80, height: 90 },
        { x: 145, y: 240, width: 10, height: 10 },
        { x: 310, y: 210, width: 220, height: 70 },
      ],
    });
  });

  it('handles seven grid images with max spacing without overlapping cells', () => {
    const result = calculateCombineLayout([
      dims(90, 40),
      dims(10, 100),
      dims(60, 60),
      dims(30, 140),
      dims(120, 20),
      dims(50, 80),
      dims(70, 70),
    ], 'grid', 30);

    expect(result.width).toBe(330);
    expect(result.height).toBe(370);
    expect(result.placements[4]).toEqual({ x: 120, y: 190, width: 120, height: 20 });
    expect(result.placements[6]).toEqual({ x: 10, y: 300, width: 70, height: 70 });
  });
});

describe('collage layout geometry', () => {
  it('exposes the eight supported collage layouts with 2x2 default available', () => {
    expect(Object.keys(COLLAGE_LAYOUTS)).toEqual(['2x1', '1x2', '2x2', '3x1', '1x3', '3x2', '2x3', '3x3']);
  });

  it('uses 300px cells, default-style spacing, and contain placement for missing slots', () => {
    expect(calculateCollageLayout([dims(600, 300), dims(100, 400)], '2x2', 10)).toEqual({
      width: 610,
      height: 610,
      capacity: 4,
      filledSlots: 2,
      placements: [
        { x: 0, y: 75, width: 300, height: 150 },
        { x: 422.5, y: 0, width: 75, height: 300 },
      ],
    });
  });

  it('reports output plans above side and pixel limits', () => {
    expect(getImageLayoutOutputError(MAX_IMAGE_LAYOUT_OUTPUT_SIDE + 1, 100)).toBe('Use an output up to 8192 px on each side.');
    expect(getImageLayoutOutputError(8000, Math.ceil(MAX_IMAGE_LAYOUT_OUTPUT_PIXELS / 8000) + 1)).toBe('Use a smaller output, up to 32 megapixels.');
  });

  it('reports capacity and aggregate decoded-pixel limits', () => {
    expect(getImageLayoutCapacityError(5, '2x2')).toContain('Choose a larger layout');
    expect(getImageLayoutAggregateError([
      dims(4000, 4000),
      dims(4000, 4000),
      dims(4000, 4000),
      dims(4000, 4000),
      dims(1, 1),
    ])).toBe('Use fewer or smaller images. The combined decoded source limit is 64 megapixels.');
  });
});
