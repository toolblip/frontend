import { describe, expect, it } from 'vitest';
import {
  analyzeExifMetadata,
  encodePngToJpegWithSizeAwareness,
  getPngToJpegSourceValidation,
  hasPersonalMetadataSignature,
  verifyOutputSignature,
} from './ImageConversionClient';

const pngHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
const jpegHeader = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);

describe('getPngToJpegSourceValidation', () => {
  it('accepts PNG bytes even when the browser MIME is blank', () => {
    expect(getPngToJpegSourceValidation({
      fileName: 'upload.png',
      declaredMimeType: '',
      header: pngHeader,
      fileSize: 512,
    })).toMatchObject({ valid: true, detectedMimeType: 'image/png' });
  });

  it('rejects known MIME or extension mismatches instead of trusting the file name', () => {
    expect(getPngToJpegSourceValidation({
      fileName: 'fake.png',
      declaredMimeType: 'image/png',
      header: jpegHeader,
      fileSize: 512,
    })).toMatchObject({ valid: false });
  });
});

describe('verifyOutputSignature', () => {
  it('requires actual JPEG bytes for JPEG downloads', () => {
    expect(verifyOutputSignature(jpegHeader, 'image/jpeg')).toBe(true);
    expect(verifyOutputSignature(pngHeader, 'image/jpeg')).toBe(false);
  });
});

describe('encodePngToJpegWithSizeAwareness', () => {
  const blob = (size: number, type = 'image/jpeg') => new Blob([new Uint8Array(size)], { type });

  it('retries below the selected maximum and reports the real quality used', async () => {
    const qualities: Array<number | undefined> = [];

    const result = await encodePngToJpegWithSizeAwareness({
      originalBytes: 1_000,
      maxQuality: 85,
      encode: async (_mimeType, quality) => {
        qualities.push(quality);
        return quality === 0.85 ? blob(1_050) : blob(920);
      },
      isCancelled: () => false,
    });

    expect(qualities).toEqual([0.85, 0.75]);
    expect(result).toMatchObject({
      actualQuality: 75,
      qualityAutoReduced: true,
      couldMakeSmaller: true,
      failed: false,
    });
    expect(result.blob?.size).toBe(920);
  });

  it('keeps the smallest JPEG candidate and says when PNG compressed better', async () => {
    const result = await encodePngToJpegWithSizeAwareness({
      originalBytes: 1_000,
      maxQuality: 85,
      encode: async (_mimeType, quality) => {
        const q = Math.round((quality ?? 0) * 100);
        return blob(q === 65 ? 1_080 : 1_140);
      },
      isCancelled: () => false,
    });

    expect(result.blob?.size).toBe(1_080);
    expect(result.actualQuality).toBe(65);
    expect(result.qualityAutoReduced).toBe(true);
    expect(result.couldMakeSmaller).toBe(false);
  });

  it('fails when the browser does not return JPEG bytes', async () => {
    const result = await encodePngToJpegWithSizeAwareness({
      originalBytes: 1_000,
      maxQuality: 85,
      encode: async () => blob(900, 'image/png'),
      isCancelled: () => false,
    });

    expect(result).toMatchObject({ blob: null, failed: true, mimeMismatch: true });
  });
});

describe('analyzeExifMetadata', () => {
  it('bounds-checks malformed APP1/TIFF data and still reports metadata presence', () => {
    const malformed = new Uint8Array([
      0xff, 0xd8,
      0xff, 0xe1, 0x00, 0x12,
      0x45, 0x78, 0x69, 0x66, 0x00, 0x00,
      0x49, 0x49, 0x2a, 0x00,
      0xff, 0xff, 0xff, 0x7f,
      0xff, 0xd9,
    ]);

    expect(analyzeExifMetadata(malformed)).toMatchObject({
      hasExif: true,
      hasGps: false,
      recognizedTagCount: 0,
    });
  });

  it('walks linked EXIF and GPS IFD pointers without dumping GPS values', () => {
    const bytes = new Uint8Array(96);
    bytes.set([0xff, 0xd8, 0xff, 0xe1, 0x00, 0x5c, 0x45, 0x78, 0x69, 0x66, 0x00, 0x00], 0);
    const tiff = 12;
    bytes.set([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00], tiff);
    bytes.set([0x02, 0x00], tiff + 8);
    bytes.set([0x0f, 0x01, 0x02, 0x00, 0x08, 0x00, 0x00, 0x00, 0x3e, 0x00, 0x00, 0x00], tiff + 10);
    bytes.set([0x25, 0x88, 0x04, 0x00, 0x01, 0x00, 0x00, 0x00, 0x36, 0x00, 0x00, 0x00], tiff + 22);
    bytes.set([0x00, 0x00, 0x00, 0x00], tiff + 34);
    bytes.set([0x01, 0x00, 0x01, 0x00, 0x02, 0x00, 0x02, 0x00, 0x00, 0x00, 0x4e, 0x00, 0x00, 0x00], tiff + 54);
    bytes.set(new TextEncoder().encode('DemoCam\0'), tiff + 62);

    const result = analyzeExifMetadata(bytes);

    expect(result.hasExif).toBe(true);
    expect(result.hasGps).toBe(true);
    expect(result.tags).toContainEqual({ name: 'Make', value: 'DemoCam' });
    expect(result.tags.some((tag) => tag.name.includes('GPS') && tag.value !== 'Present')).toBe(false);
  });

  it('reads raw TIFF EXIF from bounded PNG eXIf chunks', () => {
    const bytes = makePng([
      chunk('IHDR', new Uint8Array(13)),
      chunk('eXIf', makeTiffWithMakeAndGps()),
      chunk('IDAT', new TextEncoder().encode('compressed bytes can mention Exif\0\0 without being metadata')),
      chunk('IEND', new Uint8Array()),
    ]);

    const result = analyzeExifMetadata(bytes);

    expect(result).toMatchObject({
      sourceType: 'image/png',
      hasExif: true,
      hasGps: true,
    });
    expect(result.tags).toContainEqual({ name: 'Make', value: 'DemoCam' });
  });

  it('reads raw TIFF EXIF and XMP chunks from bounded WebP RIFF chunks', () => {
    const bytes = makeWebp([
      webpChunk('VP8 ', new TextEncoder().encode('lossy payload mentions Exif\0\0 and xmpmeta but is pixels')),
      webpChunk('EXIF', makeTiffWithMakeAndGps()),
      webpChunk('XMP ', new TextEncoder().encode('<x:xmpmeta>metadata</x:xmpmeta>')),
    ]);

    const result = analyzeExifMetadata(bytes);

    expect(result).toMatchObject({
      sourceType: 'image/webp',
      hasExif: true,
      hasXmp: true,
      hasGps: true,
    });
    expect(result.tags).toContainEqual({ name: 'Make', value: 'DemoCam' });
  });

  it('stops at truncated PNG and WebP chunk boundaries', () => {
    const truncatedPng = concatBytes(
      new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      new Uint8Array([0x00, 0x00, 0x00, 0x40]),
      new TextEncoder().encode('eXIf'),
      makeTiffWithMakeAndGps().slice(0, 4),
    );
    const truncatedWebp = concatBytes(
      new TextEncoder().encode('RIFF'),
      le32(100),
      new TextEncoder().encode('WEBP'),
      new TextEncoder().encode('EXIF'),
      le32(80),
      makeTiffWithMakeAndGps().slice(0, 4),
    );

    expect(analyzeExifMetadata(truncatedPng)).toMatchObject({ hasExif: false, recognizedTagCount: 0 });
    expect(analyzeExifMetadata(truncatedWebp)).toMatchObject({ hasExif: false, recognizedTagCount: 0 });
  });
});

describe('hasPersonalMetadataSignature', () => {
  it('detects supported container metadata without scanning compressed pixel bytes', () => {
    const png = makePng([
      chunk('IHDR', new Uint8Array(13)),
      chunk('tEXt', new TextEncoder().encode('XML:com.adobe.xmp\0<x:xmpmeta />')),
      chunk('IDAT', new TextEncoder().encode('pixel payload mentions Exif\0\0 and <x:xmpmeta> but is not metadata')),
      chunk('IEND', new Uint8Array()),
    ]);
    const webp = makeWebp([
      webpChunk('VP8 ', new TextEncoder().encode('pixel payload mentions Exif\0\0 and Photoshop 3.0')),
      webpChunk('EXIF', concatBytes(new TextEncoder().encode('Exif\0\0'), makeTiffWithMakeAndGps())),
    ]);
    const falsePositivePng = makePng([
      chunk('IHDR', new Uint8Array(13)),
      chunk('IDAT', new TextEncoder().encode('Exif\0\0 <x:xmpmeta> Photoshop 3.0')),
      chunk('IEND', new Uint8Array()),
    ]);
    const falsePositiveWebp = makeWebp([
      webpChunk('VP8 ', new TextEncoder().encode('Exif\0\0 <x:xmpmeta> Photoshop 3.0')),
    ]);

    expect(hasPersonalMetadataSignature(png)).toBe(true);
    expect(hasPersonalMetadataSignature(webp)).toBe(true);
    expect(hasPersonalMetadataSignature(falsePositivePng)).toBe(false);
    expect(hasPersonalMetadataSignature(falsePositiveWebp)).toBe(false);
  });
});

function makeTiffWithMakeAndGps() {
  const bytes = new Uint8Array(88);
  bytes.set([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00], 0);
  bytes.set([0x02, 0x00], 8);
  bytes.set([0x0f, 0x01, 0x02, 0x00, 0x08, 0x00, 0x00, 0x00, 0x3e, 0x00, 0x00, 0x00], 10);
  bytes.set([0x25, 0x88, 0x04, 0x00, 0x01, 0x00, 0x00, 0x00, 0x36, 0x00, 0x00, 0x00], 22);
  bytes.set([0x00, 0x00, 0x00, 0x00], 34);
  bytes.set([0x01, 0x00, 0x01, 0x00, 0x02, 0x00, 0x02, 0x00, 0x00, 0x00, 0x4e, 0x00, 0x00, 0x00], 54);
  bytes.set(new TextEncoder().encode('DemoCam\0'), 62);
  return bytes;
}

function makePng(chunks: Uint8Array[]) {
  return concatBytes(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), ...chunks);
}

function chunk(type: string, data: Uint8Array) {
  return concatBytes(be32(data.length), new TextEncoder().encode(type), data, new Uint8Array(4));
}

function makeWebp(chunks: Uint8Array[]) {
  const body = concatBytes(new TextEncoder().encode('WEBP'), ...chunks);
  return concatBytes(new TextEncoder().encode('RIFF'), le32(body.length), body);
}

function webpChunk(type: string, data: Uint8Array) {
  return concatBytes(new TextEncoder().encode(type), le32(data.length), data, data.length % 2 ? new Uint8Array([0]) : new Uint8Array());
}

function be32(value: number) {
  return new Uint8Array([(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff]);
}

function le32(value: number) {
  return new Uint8Array([value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff]);
}

function concatBytes(...parts: Uint8Array[]) {
  const bytes = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    bytes.set(part, offset);
    offset += part.length;
  }
  return bytes;
}
