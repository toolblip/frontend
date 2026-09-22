import { describe, expect, it, vi } from 'vitest';
import { clampCropSelection, drawEditor, getEffectiveCropSelection, resizeCropSelection } from './CircleCropClient';

describe('clampCropSelection', () => {
  it('keeps the centered crop position', () => {
    expect(clampCropSelection(1200, 800, { x: 400, y: 200, size: 400 })).toEqual({ x: 400, y: 200, size: 400 });
  });

  it('clamps a crop beyond the top-left image edge', () => {
    expect(clampCropSelection(1200, 800, { x: -50, y: -25, size: 400 })).toEqual({ x: 0, y: 0, size: 400 });
  });

  it('clamps a crop beyond the bottom-right image edge', () => {
    expect(clampCropSelection(1200, 800, { x: 900, y: 500, size: 400 })).toEqual({ x: 800, y: 400, size: 400 });
  });

  it('clamps crop size to the source image while preserving the selection center', () => {
    expect(resizeCropSelection(1200, 800, { x: 400, y: 200, size: 400 }, 600)).toEqual({ x: 300, y: 100, size: 600 });
    expect(resizeCropSelection(1200, 800, { x: 400, y: 200, size: 400 }, 1000)).toEqual({ x: 200, y: 0, size: 800 });
  });

  it('uses the selected frame center with a zoom-adjusted effective crop size', () => {
    expect(getEffectiveCropSelection(1200, 800, { x: 400, y: 200, size: 400 }, 2)).toEqual({ x: 500, y: 300, size: 200 });
  });

  it('keeps the effective zoomed crop inside the source image', () => {
    expect(getEffectiveCropSelection(1200, 800, { x: 0, y: 0, size: 400 }, 3)).toEqual({ x: 133.33333333333331, y: 133.33333333333331, size: 133.33333333333334 });
  });

  it('normalizes an out-of-bounds frame before calculating the effective crop', () => {
    expect(getEffectiveCropSelection(1200, 800, { x: -200, y: -100, size: 1000 }, 1)).toEqual({ x: 0, y: 0, size: 800 });
  });
});

describe('drawEditor', () => {
  it('preserves the source image inside the crop window after dimming the outside', () => {
    const drawImage = vi.fn();
    const context = {
      clearRect: vi.fn(),
      drawImage,
      save: vi.fn(),
      restore: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      clip: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      fillStyle: '',
      globalCompositeOperation: 'source-over',
      strokeStyle: '',
      lineWidth: 0,
    } as unknown as CanvasRenderingContext2D;
    const canvas = {
      width: 0,
      height: 0,
      getContext: () => context,
    } as unknown as HTMLCanvasElement;
    const image = { width: 800, height: 600 } as HTMLImageElement;

    drawEditor(canvas, image, { x: 100, y: 0, size: 400 });

    expect(drawImage).toHaveBeenCalledTimes(2);
  });
});
