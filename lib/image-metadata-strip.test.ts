import { describe, expect, it } from 'vitest';
import { stripImageMetadata } from './image-metadata-strip';

const textEncoder = new TextEncoder();

describe('stripImageMetadata', () => {
  it('removes JPEG EXIF, IPTC/Photoshop, XMP, and comments while preserving coding segments and entropy bytes', () => {
    const dqt = segment(0xdb, bytes(0, 1, 2, 3));
    const sof = segment(0xc0, bytes(8, 0, 1, 0, 1, 3));
    const entropy = bytes(0x11, 0xff, 0x00, 0x22, 0xff, 0xd9, 0x33);
    const jpeg = concatBytes(
      bytes(0xff, 0xd8),
      segment(0xe0, textEncoder.encode('JFIF\0kept')),
      segment(0xe1, textEncoder.encode('Exif\0\0removed')),
      segment(0xe1, textEncoder.encode('http://ns.adobe.com/xap/1.0/\0removed')),
      segment(0xe2, textEncoder.encode('ICC_PROFILE\0kept')),
      segment(0xed, textEncoder.encode('Photoshop 3.0 removed')),
      segment(0xfe, textEncoder.encode('comment removed')),
      dqt,
      sof,
      segment(0xda, bytes(0, 1, 2)),
      entropy,
    );

    const stripped = stripImageMetadata(jpeg, 'image/jpeg');

    expect(stripped).toEqual(concatBytes(
      bytes(0xff, 0xd8),
      segment(0xe0, textEncoder.encode('JFIF\0kept')),
      segment(0xe2, textEncoder.encode('ICC_PROFILE\0kept')),
      dqt,
      sof,
      segment(0xda, bytes(0, 1, 2)),
      entropy,
    ));
  });

  it('removes PNG eXIf and text metadata chunks while preserving IDAT bytes', () => {
    const ihdr = chunk('IHDR', bytes(0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0), bytes(1, 2, 3, 4));
    const phys = chunk('pHYs', bytes(0, 0, 0x0b, 0x13, 0, 0, 0x0b, 0x13, 1), bytes(5, 6, 7, 8));
    const idatPayload = textEncoder.encode('compressed pixel bytes mention Exif\0\0 and Photoshop 3.0');
    const idat = chunk('IDAT', idatPayload, bytes(9, 10, 11, 12));
    const iend = chunk('IEND', new Uint8Array(), bytes(13, 14, 15, 16));
    const png = concatBytes(
      pngSignature(),
      ihdr,
      chunk('eXIf', textEncoder.encode('removed exif'), bytes(21, 22, 23, 24)),
      chunk('tEXt', textEncoder.encode('Author\0removed'), bytes(25, 26, 27, 28)),
      chunk('zTXt', textEncoder.encode('Raw profile type exif removed'), bytes(29, 30, 31, 32)),
      chunk('iTXt', textEncoder.encode('XML:com.adobe.xmp removed'), bytes(33, 34, 35, 36)),
      phys,
      idat,
      iend,
    );

    const stripped = stripImageMetadata(png, 'image/png');

    expect(stripped).toEqual(concatBytes(pngSignature(), ihdr, phys, idat, iend));
    expect(findChunkData(stripped, 'IDAT')).toEqual(idatPayload);
  });

  it('rejects malformed JPEG segment bounds', () => {
    const malformed = concatBytes(bytes(0xff, 0xd8), bytes(0xff, 0xe1, 0x00, 0x20), textEncoder.encode('short'));

    expect(() => stripImageMetadata(malformed, 'image/jpeg')).toThrow(/Malformed JPEG metadata/);
  });

  it('rejects malformed PNG chunk bounds', () => {
    const malformed = concatBytes(pngSignature(), bytes(0x00, 0x00, 0x00, 0x20), textEncoder.encode('eXIf'), bytes(1, 2, 3));

    expect(() => stripImageMetadata(malformed, 'image/png')).toThrow(/Malformed PNG metadata/);
  });
});

function segment(marker: number, data: Uint8Array) {
  return concatBytes(bytes(0xff, marker), be16(data.length + 2), data);
}

function chunk(type: string, data: Uint8Array, crc: Uint8Array) {
  return concatBytes(be32(data.length), textEncoder.encode(type), data, crc);
}

function findChunkData(png: Uint8Array, type: string) {
  let offset = 8;
  while (offset + 12 <= png.length) {
    const length = readBe32(png, offset);
    const chunkType = new TextDecoder().decode(png.slice(offset + 4, offset + 8));
    if (chunkType === type) return png.slice(offset + 8, offset + 8 + length);
    offset += 12 + length;
  }
  return new Uint8Array();
}

function pngSignature() {
  return bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
}

function bytes(...values: number[]) {
  return new Uint8Array(values);
}

function be16(value: number) {
  return bytes((value >>> 8) & 0xff, value & 0xff);
}

function be32(value: number) {
  return bytes((value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff);
}

function readBe32(bytes: Uint8Array, offset: number) {
  return ((bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0;
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
