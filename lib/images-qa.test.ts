import { describe, it, expect } from 'vitest';
import { imageSignature, imageBounds, positive, pngDpi, crc32, preflightImage } from './images-qa';
describe('image worker validation', () => {
    it('rejects oversized JPEG and GIF headers before decoding', () => {
      const jpeg=Uint8Array.from([255,216,255,192,0,17,8,0x7f,0xff,0x7f,0xff,3,1,0x11,0,2,0x11,0,3,0x11,0]);
      expect(()=>preflightImage(jpeg,'image/jpeg')).toThrow(/dimensions/);
      const gif=Uint8Array.from([71,73,70,56,57,97,255,127,255,127]);
      expect(()=>preflightImage(gif,'image/gif')).toThrow(/dimensions/);
      expect(()=>preflightImage(Uint8Array.from([255,216,255,192,255,255]),'image/jpeg')).toThrow(/Truncated/);
    });
    it('rejects partial signatures and detects actual bytes', () => {
        expect(imageSignature(Uint8Array.from([137, 80, 78, 71, 0, 0, 0, 0]))).toBeNull();
        expect(imageSignature(Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]))).toBe('image/png');
        expect(imageSignature(Uint8Array.from([255, 216, 255, 224]))).toBe('image/jpeg');
    });
    it('bounds pixels before canvas allocation', () => {
        expect(() => imageBounds(8192, 8192)).toThrow();
        for (const n of [0, -1, Infinity, NaN, 1.2])
            expect(() => imageBounds(n, 10)).toThrow();
        expect(imageBounds(1920, 1080)).toEqual({ width: 1920, height: 1080 });
    });
    it('rejects partial and unbounded numerical inputs', () => {
        for (const n of ['1x', 'Infinity', '0', '-1', ''])
            expect(positive(n)).toBeNull();
        expect(positive('2.54')).toBe(2.54);
    });
    it('writes 300 DPI as 11811 pixels per meter with valid CRC', () => {
        const png = Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLttAAAAABJRU5ErkJggg==', 'base64'));
        const output = pngDpi(png, 300);
        const view = new DataView(output.buffer);
        expect(String.fromCharCode(...output.slice(37, 41))).toBe('pHYs');
        expect(view.getUint32(41)).toBe(11811);
        expect(view.getUint32(45)).toBe(11811);
        expect(output[49]).toBe(1);
        expect(view.getUint32(50)).toBe(crc32(output.slice(37, 50)));
        expect(pngDpi(output, 72).length).toBe(output.length);
        expect(() => pngDpi(png, 0)).toThrow();
    });
});
