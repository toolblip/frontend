import { describe, expect, it, vi } from 'vitest';
import { clampCropPosition, drawEditor } from './CircleCropClient';

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

    drawEditor(canvas, image, { x: 100, y: 0 });

    expect(drawImage).toHaveBeenCalledTimes(2);
  });
});
