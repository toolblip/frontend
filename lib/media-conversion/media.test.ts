import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { imageKind, preflightImage, composeGif, dimensions, gifFrames, type GifPatch } from './image';
import { mediaContainer, pcmWav, pcmMp3 } from './audio';
import { parseSubtitles, validateRange } from './video';
const fixture = (name: string) => new Uint8Array(readFileSync(`public/samples/media-conversion/example.${name}`));
describe('binary formats and limits', () => {
  it('recognizes real fixture formats by bytes', () => {
    expect(imageKind(fixture('gif'))).toBe('gif'); expect(imageKind(fixture('heic'))).toBe('heic');
    expect(mediaContainer(fixture('mp4'))).toBe('mp4'); expect(mediaContainer(fixture('m4a'))).toBe('mp4'); expect(mediaContainer(fixture('aac'))).toBe('aac'); expect(mediaContainer(fixture('mkv'))).toBe('mkv');
    preflightImage(fixture('heic'), 'heic'); preflightImage(fixture('gif'), 'gif');
    expect(() => imageKind(new TextEncoder().encode('renamed file.png'))).toThrow();
  });
  it('rejects dimension and frame-memory bombs', () => {
    expect(() => dimensions(100000, 1)).toThrow(); expect(() => dimensions(5000, 5000)).toThrow();
    expect(() => composeGif(1000, 1000, Array.from({ length: 201 }) as GifPatch[])).toThrow();
    const bytes = new Uint8Array(24); bytes.set([137,80,78,71,13,10,26,10]); const v = new DataView(bytes.buffer); v.setUint32(16, 999999); v.setUint32(20, 2);
    expect(() => preflightImage(bytes, 'png')).toThrow();
  });
  it('encodes interleaved clipped signed 16-bit WAV with exact headers', () => {
    const buffer = pcmWav([new Float32Array([-1, 0, 1]), new Float32Array([0.5, -2, 2])], 44100); const v = new DataView(buffer);
    expect(mediaContainer(new Uint8Array(buffer))).toBe('wav'); expect(buffer.byteLength).toBe(56); expect(v.getUint32(4, true)).toBe(48);
    expect(v.getUint16(22, true)).toBe(2); expect(v.getUint32(24, true)).toBe(44100); expect(v.getUint32(28, true)).toBe(176400); expect(v.getUint32(40, true)).toBe(12);
    expect(Array.from({ length: 6 }, (_, i) => v.getInt16(44 + i * 2, true))).toEqual([-32768, 16384, 0, -32768, 32767, 32767]);
    expect(() => pcmWav([new Float32Array([NaN])], 44100)).toThrow();
  });
});
describe('GIF composition', () => {
  const frame = (left: number, rgba: number[], disposalType = 1): GifPatch => ({ dims: { left, top: 0, width: rgba.length / 4, height: 1 }, patch: new Uint8ClampedArray(rgba), disposalType, delay: 100 });
  const red = [255, 0, 0, 255], blue = [0, 0, 255, 255], clear = [0, 0, 0, 0];
  it('transparent pixels retain previous frame; preceding disposal 2 clears its rectangle', () => {
    const result = composeGif(2, 1, [frame(0, [...red, ...blue], 2), frame(1, red)]);
    expect([...new Uint8Array(result[1])]).toEqual([...clear, ...red]);
    const retained = composeGif(2, 1, [frame(0, [...red, ...blue]), frame(0, [...clear, ...red])]);
    expect([...new Uint8Array(retained[1])]).toEqual([...red, ...red]);
  });
  it('disposal 3 restores pixels from before the preceding frame', () => {
    const result = composeGif(2, 1, [frame(0, [...red, ...blue]), frame(0, blue, 3), frame(1, red)]);
    expect([...new Uint8Array(result[2])]).toEqual([...red, ...red]);
  });
  it('decodes the real animation and produces valid APNG frames', async () => {
    const bytes = fixture('gif'); const decoded = await gifFrames(bytes.buffer as ArrayBuffer);
    expect([decoded.width, decoded.height, decoded.frames.length]).toEqual([16, 12, 2]);
    // @ts-expect-error untyped dependency
    const UPNG = (await import('upng-js')).default;
    const apng = UPNG.encode(decoded.frames, 16, 12, 0, decoded.delays); const read = UPNG.decode(apng);
    expect(read.frames.length).toBe(2); expect(UPNG.toRGBA8(read).map((b: ArrayBuffer) => [...new Uint8Array(b)])).toEqual(decoded.frames.map(b => [...new Uint8Array(b)]));
  });
});
describe('subtitle and cut ranges', () => {
  it('parses SRT CRLF and short VTT time formats', () => {
    expect(parseSubtitles('1\r\n00:00:01,000 --> 00:00:02,500\r\nHello')).toEqual([{ start: 1, end: 2.5, text: 'Hello' }]);
    expect(parseSubtitles('WEBVTT\n\n00:01.000 --> 00:02.000 align:start\n<b>A</b>')).toEqual([{ start: 1, end: 2, text: 'A' }]);
  });
  it.each(['1\n00:00:02,000 --> 00:00:01,000\nBad', '1\n00:61:00,000 --> 01:02:00,000\nBad', 'garbage'])('rejects bad subtitles %s', s => expect(() => parseSubtitles(s)).toThrow());
  it('rejects invalid ranges instead of silently clamping', () => {
    validateRange(0, 2, 2); expect(() => validateRange(2, 1, 3)).toThrow(); expect(() => validateRange(0, 4, 3)).toThrow(); expect(() => validateRange(0, 61, 100)).toThrow();
  });
});

describe('browser image lifecycle and encoder failure boundaries', () => {
  it('rejects canvas MIME fallback instead of downloading PNG as WebP', async () => {
    const { canvasBlob } = await import('./image');
    const canvas = { toBlob: (callback: (blob: Blob) => void) => callback(new Blob(['PNG fallback'], { type: 'image/png' })) } as unknown as HTMLCanvasElement;
    await expect(canvasBlob(canvas, 'image/webp', 0.8)).rejects.toThrow('cannot encode');
  });
  it('releases temporary URLs on decode errors and cancellation', async () => {
    const { vi } = await import('vitest'); const { checkedImage } = await import('./image');
    const revoke = vi.spyOn(URL, 'revokeObjectURL');
    class FakeImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(value: string) { if (value) queueMicrotask(() => this.onerror?.()); }
    }
    vi.stubGlobal('Image', FakeImage);
    try {
      await expect(checkedImage(new Blob(['broken']), new AbortController().signal)).rejects.toThrow('could not be decoded');
      expect(revoke).toHaveBeenCalledTimes(1);
      class PendingImage { onload = null; onerror = null; src = ''; }
      vi.stubGlobal('Image', PendingImage);
      const controller = new AbortController(); const pending = checkedImage(new Blob(['pending']), controller.signal); controller.abort();
      await expect(pending).rejects.toThrow('cancelled'); expect(revoke).toHaveBeenCalledTimes(2);
    } finally { vi.unstubAllGlobals(); revoke.mockRestore(); }
  });
});


describe('MP3 encoding', () => {
  it('encodes mono PCM into MPEG audio frames and honors cancellation', async () => {
    const samples = Float32Array.from({ length: 44100 }, (_, i) => 0.5 * Math.sin(2 * Math.PI * 440 * i / 44100));
    const blob = await pcmMp3([samples], 44100, new AbortController().signal);
    const bytes = new Uint8Array(await blob.arrayBuffer());
    expect(blob.type).toBe('audio/mpeg'); expect(bytes.length).toBeGreaterThan(10000);
    expect(bytes[0]).toBe(255); expect(bytes[1] & 224).toBe(224);
    const abort = new AbortController(); abort.abort();
    await expect(pcmMp3([samples], 44100, abort.signal)).rejects.toThrow();
    await expect(pcmMp3([new Float32Array([NaN])], 44100, new AbortController().signal)).rejects.toThrow();
  });
});
