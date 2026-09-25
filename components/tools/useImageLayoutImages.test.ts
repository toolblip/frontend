import { describe, expect, it, vi } from 'vitest';
import {
  canvasToVerifiedPngResult,
  getAcceptedImageLayoutFiles,
} from './useImageLayoutImages';

describe('getAcceptedImageLayoutFiles', () => {
  it('keeps ordered good files and rejects over-cap files before object URLs are needed', () => {
    const files = Array.from({ length: 4 }, (_, index) => (
      new File([new Uint8Array(10)], `image-${index + 1}.png`, { type: 'image/png' })
    ));

    const result = getAcceptedImageLayoutFiles({
      files,
      existingCount: 1,
      existingBytes: 10,
      maxImages: 3,
    });

    expect(result.files.map((file) => file.name)).toEqual(['image-1.png', 'image-2.png']);
    expect(result.errors).toEqual([
      'image-3.png: Remove an image before adding more. This tool accepts up to 3 images.',
      'image-4.png: Remove an image before adding more. This tool accepts up to 3 images.',
    ]);
  });

  it('reports byte-cap failures while retaining later files that still fit', () => {
    const small = new File([new Uint8Array(10)], 'small.png', { type: 'image/png' });
    const huge = new File([new Uint8Array(61 * 1024 * 1024)], 'huge.png', { type: 'image/png' });
    const later = new File([new Uint8Array(10)], 'later.png', { type: 'image/png' });

    const result = getAcceptedImageLayoutFiles({
      files: [small, huge, later],
      existingCount: 0,
      existingBytes: 0,
      maxImages: 3,
    });

    expect(result.files.map((file) => file.name)).toEqual(['small.png', 'later.png']);
    expect(result.errors).toEqual([
      'huge.png: Choose an image up to 20 MiB.',
    ]);
  });
});

describe('canvasToVerifiedPngResult', () => {
  it('rejects PNG-signature bytes when the encoded Blob MIME is not PNG', async () => {
    const canvas = {
      width: 12,
      height: 8,
      toBlob: vi.fn((callback: BlobCallback) => {
        callback(new Blob([
          new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        ], { type: 'image/jpeg' }));
      }),
    } as unknown as HTMLCanvasElement;

    await expect(canvasToVerifiedPngResult(canvas, 'bad.png')).rejects.toThrow('valid PNG bytes');
  });
});
