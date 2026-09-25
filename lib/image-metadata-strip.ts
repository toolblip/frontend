type SupportedImageMime = 'image/jpeg' | 'image/png';

const PNG_SIGNATURE = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const PNG_METADATA_CHUNKS = new Set(['eXIf', 'tEXt', 'zTXt', 'iTXt']);

export function stripImageMetadata(bytes: Uint8Array, mimeType: SupportedImageMime) {
  if (mimeType === 'image/jpeg') return stripJpegMetadata(bytes);
  return stripPngMetadata(bytes);
}

function stripJpegMetadata(bytes: Uint8Array) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    throw new Error('Malformed JPEG metadata: missing SOI marker.');
  }

  const parts: Uint8Array[] = [bytes.slice(0, 2)];
  let offset = 2;

  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      throw new Error('Malformed JPEG metadata: expected marker.');
    }

    const markerStart = offset;
    while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
    if (offset >= bytes.length) {
      throw new Error('Malformed JPEG metadata: truncated marker.');
    }

    const marker = bytes[offset];
    offset += 1;

    if (marker === 0x00) {
      throw new Error('Malformed JPEG metadata: unexpected stuffed byte outside entropy data.');
    }

    if (marker === 0xd9 || isStandaloneJpegMarker(marker)) {
      parts.push(bytes.slice(markerStart, offset));
      if (marker === 0xd9) {
        if (offset !== bytes.length) {
          throw new Error('Malformed JPEG metadata: trailing bytes after EOI.');
        }
        return concatBytes(parts);
      }
      continue;
    }

    if (offset + 2 > bytes.length) {
      throw new Error('Malformed JPEG metadata: truncated segment length.');
    }

    const segmentLength = readBe16(bytes, offset);
    if (segmentLength < 2 || offset + segmentLength > bytes.length) {
      throw new Error('Malformed JPEG metadata: segment length exceeds file bounds.');
    }

    const segmentEnd = offset + segmentLength;
    const shouldDrop = marker === 0xe1 || marker === 0xed || marker === 0xfe;
    if (!shouldDrop) parts.push(bytes.slice(markerStart, segmentEnd));

    offset = segmentEnd;
    if (marker === 0xda) {
      parts.push(bytes.slice(offset));
      return concatBytes(parts);
    }
  }

  throw new Error('Malformed JPEG metadata: missing image data.');
}

function stripPngMetadata(bytes: Uint8Array) {
  if (bytes.length < PNG_SIGNATURE.length || !startsWith(bytes, PNG_SIGNATURE)) {
    throw new Error('Malformed PNG metadata: missing PNG signature.');
  }

  const parts: Uint8Array[] = [bytes.slice(0, PNG_SIGNATURE.length)];
  let offset = PNG_SIGNATURE.length;
  let sawIend = false;

  while (offset < bytes.length) {
    if (offset + 12 > bytes.length) {
      throw new Error('Malformed PNG metadata: truncated chunk header.');
    }

    const length = readBe32(bytes, offset);
    const chunkEnd = offset + 12 + length;
    if (chunkEnd > bytes.length) {
      throw new Error('Malformed PNG metadata: chunk length exceeds file bounds.');
    }

    const type = ascii(bytes, offset + 4, offset + 8);
    if (!PNG_METADATA_CHUNKS.has(type)) {
      parts.push(bytes.slice(offset, chunkEnd));
    }

    offset = chunkEnd;
    if (type === 'IEND') {
      sawIend = true;
      break;
    }
  }

  if (!sawIend || offset !== bytes.length) {
    throw new Error('Malformed PNG metadata: invalid chunk stream.');
  }

  return concatBytes(parts);
}

function isStandaloneJpegMarker(marker: number) {
  return marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7);
}

function startsWith(bytes: Uint8Array, prefix: Uint8Array) {
  if (bytes.length < prefix.length) return false;
  for (let index = 0; index < prefix.length; index += 1) {
    if (bytes[index] !== prefix[index]) return false;
  }
  return true;
}

function ascii(bytes: Uint8Array, start: number, end: number) {
  let value = '';
  for (let offset = start; offset < end; offset += 1) value += String.fromCharCode(bytes[offset]);
  return value;
}

function readBe16(bytes: Uint8Array, offset: number) {
  return (bytes[offset] << 8) | bytes[offset + 1];
}

function readBe32(bytes: Uint8Array, offset: number) {
  return ((bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0;
}

function concatBytes(parts: Uint8Array[]) {
  const output = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}
