import { describe, it, expect } from 'vitest';
import { fitAspectCrop, isCommittedDrag } from '@/lib/image-crop';

describe('fitAspectCrop', () => {
  it('centers a 1:1 crop inside a landscape image', () => {
    expect(fitAspectCrop(800, 600, 1)).toEqual({ x: 100, y: 0, w: 600, h: 600 });
  });

  it('centers a 16:9 crop inside a 4:3 image', () => {
    expect(fitAspectCrop(800, 600, 16 / 9)).toEqual({ x: 0, y: 75, w: 800, h: 450 });
  });

  it('centers a portrait crop inside a landscape image', () => {
    expect(fitAspectCrop(800, 600, 2 / 3)).toEqual({ x: 200, y: 0, w: 400, h: 600 });
  });

  it('uses the full frame when the image already matches the ratio', () => {
    expect(fitAspectCrop(1920, 1080, 16 / 9)).toEqual({ x: 0, y: 0, w: 1920, h: 1080 });
  });

  it('returns an empty rect for invalid input', () => {
    expect(fitAspectCrop(0, 600, 1)).toEqual({ x: 0, y: 0, w: 0, h: 0 });
    expect(fitAspectCrop(800, 600, 0)).toEqual({ x: 0, y: 0, w: 0, h: 0 });
  });
});

describe('isCommittedDrag', () => {
  it('ignores tap-sized jitter in screen pixels', () => {
    expect(isCommittedDrag(3, 4)).toBe(false);
    expect(isCommittedDrag(0, 0)).toBe(false);
  });

  it('commits once movement reaches 8 screen pixels', () => {
    expect(isCommittedDrag(8, 0)).toBe(true);
    expect(isCommittedDrag(6, 6)).toBe(true);
  });
});
