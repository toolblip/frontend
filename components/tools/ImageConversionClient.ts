export type SourceValidation =
  | { valid: true; detectedMimeType: string; error: '' }
  | { valid: false; detectedMimeType: string; error: string };

export type SizeAwareJpegEncodeResult = {
  blob: Blob | null;
  actualQuality: number | null;
  qualityAutoReduced: boolean;
  couldMakeSmaller: boolean;
  failed: boolean;
  cancelled: boolean;
  mimeMismatch: boolean;
  error?: string;
};

export type ExifTag = { name: string; value: string };

export type ExifMetadataReport = {
  sourceType: string;
  hasExif: boolean;
  hasXmp: boolean;
  hasIptc: boolean;
  hasGps: boolean;
  recognizedTagCount: number;
  tags: ExifTag[];
};

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const JPEG_MIN_QUALITY = 35;
const JPEG_RETRY_STEP = 10;
const EXIF_TAGS: Record<number, string> = {
  0x010f: 'Make',
  0x0110: 'Model',
  0x0112: 'Orientation',
  0x0131: 'Software',
  0x0132: 'DateTime',
  0x829a: 'ExposureTime',
  0x829d: 'FNumber',
  0x8827: 'ISO',
  0x9003: 'DateTimeOriginal',
  0x920a: 'FocalLength',
  0xa002: 'PixelXDimension',
  0xa003: 'PixelYDimension',
};

const TYPE_BYTES: Record<number, number> = {
  1: 1,
  2: 1,
  3: 2,
  4: 4,
  5: 8,
  7: 1,
  9: 4,
  10: 8,
};

export function normalizeImageMime(mimeType: string) {
  const normalized = mimeType.trim().toLowerCase();
  return normalized === 'image/jpg' ? 'image/jpeg' : normalized;
}

export function inferImageMimeFromName(fileName: string) {
  const extension = fileName.toLowerCase().split('.').pop() || '';
  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'gif') return 'image/gif';
  if (extension === 'svg') return 'image/svg+xml';
  return '';
}

export function detectImageMimeFromHeader(header: Uint8Array) {
  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) return 'image/jpeg';
  if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47 && header[4] === 0x0d && header[5] === 0x0a && header[6] === 0x1a && header[7] === 0x0a) return 'image/png';
  if (ascii(header, 0, 4) === 'RIFF' && ascii(header, 8, 4) === 'WEBP') return 'image/webp';
  if (ascii(header, 0, 3) === 'GIF') return 'image/gif';
  const text = new TextDecoder('utf-8', { fatal: false }).decode(header).trimStart().toLowerCase();
  if (text.startsWith('<svg') || text.includes('<svg')) return 'image/svg+xml';
  return '';
}

export function getPngToJpegSourceValidation({
  fileName,
  declaredMimeType,
  header,
  fileSize,
}: {
  fileName: string;
  declaredMimeType: string;
  header: Uint8Array;
  fileSize: number;
}): SourceValidation {
  if (fileSize > MAX_UPLOAD_BYTES) {
    return { valid: false, detectedMimeType: '', error: 'Choose a PNG up to 20 MiB.' };
  }

  const detectedMimeType = detectImageMimeFromHeader(header);
  const declared = normalizeImageMime(declaredMimeType);
  const named = inferImageMimeFromName(fileName);
  const knownType = declared.startsWith('image/') ? declared : named;

  if (!detectedMimeType) {
    return { valid: false, detectedMimeType: '', error: 'This does not look like a PNG image.' };
  }

  if (knownType && knownType !== detectedMimeType) {
    return {
      valid: false,
      detectedMimeType,
      error: `This file looks like ${labelMime(detectedMimeType)}, but its name or MIME type says ${labelMime(knownType)}.`,
    };
  }

  if (detectedMimeType !== 'image/png') {
    return { valid: false, detectedMimeType, error: 'Choose a real PNG file. This converter only creates JPEG from PNG input.' };
  }

  return { valid: true, detectedMimeType, error: '' };
}

export function validateCanvasDimensions(width: number, height: number) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
    return { valid: false, error: 'This image did not report usable pixel dimensions.' };
  }
  if (width > 8192 || height > 8192) {
    return { valid: false, error: 'Use an image up to 8192 pixels on each side.' };
  }
  if (width * height > 32_000_000) {
    return { valid: false, error: 'Use a smaller image, up to 32 megapixels.' };
  }
  return { valid: true, error: '' };
}

export function verifyOutputSignature(header: Uint8Array, mimeType: string) {
  const detected = detectImageMimeFromHeader(header);
  return detected === normalizeImageMime(mimeType);
}

export async function encodePngToJpegWithSizeAwareness({
  originalBytes,
  maxQuality,
  encode,
  isCancelled,
}: {
  originalBytes: number;
  maxQuality: number;
  encode: (mimeType: string, quality?: number) => Promise<Blob | null>;
  isCancelled: () => boolean;
}): Promise<SizeAwareJpegEncodeResult> {
  const requestedMimeType = 'image/jpeg';
  const maxCandidateQuality = Math.min(100, Math.max(JPEG_MIN_QUALITY, Math.round(maxQuality)));
  const candidates: number[] = [];
  for (let quality = maxCandidateQuality; quality > JPEG_MIN_QUALITY; quality -= JPEG_RETRY_STEP) {
    candidates.push(quality);
  }
  if (candidates[candidates.length - 1] !== JPEG_MIN_QUALITY) candidates.push(JPEG_MIN_QUALITY);

  let best: { blob: Blob; quality: number } | null = null;

  for (const candidateQuality of candidates) {
    if (isCancelled()) return cancelledResult();

    let blob: Blob | null;
    try {
      blob = await encode(requestedMimeType, candidateQuality / 100);
    } catch (err) {
      if (isCancelled()) return cancelledResult();
      return failedResult(err instanceof Error && err.message ? err.message : undefined);
    }

    if (isCancelled()) return cancelledResult();
    if (!blob) return failedResult();
    if (normalizeImageMime(blob.type) !== requestedMimeType) {
      return { blob: null, actualQuality: null, qualityAutoReduced: false, couldMakeSmaller: false, failed: true, cancelled: false, mimeMismatch: true };
    }

    if (!best || blob.size < best.blob.size) best = { blob, quality: candidateQuality };
    if (blob.size < originalBytes) break;
  }

  if (!best) return failedResult();

  return {
    blob: best.blob,
    actualQuality: best.quality,
    qualityAutoReduced: best.quality < maxCandidateQuality,
    couldMakeSmaller: best.blob.size < originalBytes,
    failed: false,
    cancelled: false,
    mimeMismatch: false,
  };
}

export function formatImageBytes(bytes: number) {
  if (bytes < 1024) return `${bytes.toLocaleString()} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB (${bytes.toLocaleString()} bytes)`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB (${bytes.toLocaleString()} bytes)`;
}

export function getSizeChangeLabel(originalBytes: number, outputBytes: number) {
  const delta = outputBytes - originalBytes;
  if (delta === 0) return 'Same size';
  const percent = originalBytes > 0 ? Math.abs(delta / originalBytes * 100) : 0;
  return delta < 0 ? `${percent.toFixed(1)}% smaller` : `${percent.toFixed(1)}% larger`;
}

export function safeImageBaseName(fileName: string) {
  return (fileName.replace(/\.[^.]+$/, '').trim() || 'image').replace(/[^\w.-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'image';
}

export function analyzeExifMetadata(bytes: Uint8Array, sourceType = detectImageMimeFromHeader(bytes)): ExifMetadataReport {
  const metadata = collectContainerMetadata(bytes, sourceType);
  const tags: ExifTag[] = [];
  let hasGps = false;

  for (const tiff of metadata.exifTiffs) {
    const parsed = parseTiffExif(tiff);
    hasGps = hasGps || parsed.hasGps;
    tags.push(...parsed.tags);
  }

  const deduped = dedupeTags(tags);
  return {
    sourceType: sourceType || 'unknown',
    hasExif: metadata.hasExif,
    hasXmp: metadata.hasXmp,
    hasIptc: metadata.hasIptc,
    hasGps,
    recognizedTagCount: deduped.length,
    tags: deduped,
  };
}

export function hasPersonalMetadataSignature(bytes: Uint8Array) {
  const metadata = collectContainerMetadata(bytes, detectImageMimeFromHeader(bytes));
  return metadata.hasExif || metadata.hasXmp || metadata.hasIptc;
}

function failedResult(error?: string): SizeAwareJpegEncodeResult {
  return {
    blob: null,
    actualQuality: null,
    qualityAutoReduced: false,
    couldMakeSmaller: false,
    failed: true,
    cancelled: false,
    mimeMismatch: false,
    ...(error ? { error } : {}),
  };
}

function cancelledResult(): SizeAwareJpegEncodeResult {
  return {
    blob: null,
    actualQuality: null,
    qualityAutoReduced: false,
    couldMakeSmaller: false,
    failed: false,
    cancelled: true,
    mimeMismatch: false,
  };
}

function labelMime(mimeType: string) {
  if (mimeType === 'image/jpeg') return 'JPEG';
  if (mimeType === 'image/png') return 'PNG';
  if (mimeType === 'image/webp') return 'WebP';
  if (mimeType === 'image/gif') return 'GIF';
  if (mimeType === 'image/svg+xml') return 'SVG';
  return mimeType.replace('image/', '').toUpperCase();
}

function ascii(bytes: Uint8Array, start: number, length: number) {
  if (start + length > bytes.length) return '';
  return String.fromCharCode(...bytes.slice(start, start + length));
}

type ContainerMetadata = {
  hasExif: boolean;
  hasXmp: boolean;
  hasIptc: boolean;
  exifTiffs: Uint8Array[];
};

function collectContainerMetadata(bytes: Uint8Array, sourceType: string): ContainerMetadata {
  if (sourceType === 'image/jpeg') return collectJpegMetadata(bytes);
  if (sourceType === 'image/png') return collectPngMetadata(bytes);
  if (sourceType === 'image/webp') return collectWebpMetadata(bytes);
  return emptyMetadata();
}

function emptyMetadata(): ContainerMetadata {
  return { hasExif: false, hasXmp: false, hasIptc: false, exifTiffs: [] };
}

function collectJpegMetadata(bytes: Uint8Array) {
  const metadata = emptyMetadata();
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return metadata;

  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) break;
    const marker = bytes[offset + 1];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker >= 0xd0 && marker <= 0xd7) {
      offset += 2;
      continue;
    }
    const segmentLength = (bytes[offset + 2] << 8) | bytes[offset + 3];
    if (segmentLength < 2 || offset + 2 + segmentLength > bytes.length) break;
    const dataStart = offset + 4;
    const dataEnd = offset + 2 + segmentLength;
    if (marker === 0xe1 && dataEnd - dataStart >= 6 && ascii(bytes, dataStart, 6) === 'Exif\0\0') {
      metadata.hasExif = true;
      metadata.exifTiffs.push(bytes.slice(dataStart + 6, dataEnd));
    } else if (marker === 0xe1 && hasXmpSignature(bytes.slice(dataStart, dataEnd))) {
      metadata.hasXmp = true;
    } else if (marker === 0xed && hasIptcSignature(bytes.slice(dataStart, dataEnd))) {
      metadata.hasIptc = true;
    }
    offset = dataEnd;
  }

  return metadata;
}

function collectPngMetadata(bytes: Uint8Array) {
  const metadata = emptyMetadata();
  if (!isPng(bytes)) return metadata;

  let offset = 8;
  while (offset + 12 <= bytes.length) {
    const length = readUint32Be(bytes, offset);
    const type = ascii(bytes, offset + 4, 4);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const chunkEnd = dataEnd + 4;
    if (!Number.isSafeInteger(chunkEnd) || dataEnd > bytes.length || chunkEnd > bytes.length) break;

    const data = bytes.slice(dataStart, dataEnd);
    if (type === 'eXIf') {
      metadata.hasExif = true;
      metadata.exifTiffs.push(stripOptionalExifHeader(data));
    } else if ((type === 'tEXt' || type === 'iTXt' || type === 'zTXt') && hasPngXmpText(data)) {
      metadata.hasXmp = true;
    }

    offset = chunkEnd;
  }

  return metadata;
}

function collectWebpMetadata(bytes: Uint8Array) {
  const metadata = emptyMetadata();
  if (bytes.length < 12 || ascii(bytes, 0, 4) !== 'RIFF' || ascii(bytes, 8, 4) !== 'WEBP') return metadata;

  const riffPayloadLength = readUint32Le(bytes, 4);
  const riffEnd = Math.min(bytes.length, 8 + riffPayloadLength);
  let offset = 12;
  while (offset + 8 <= riffEnd) {
    const type = ascii(bytes, offset, 4);
    const length = readUint32Le(bytes, offset + 4);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const nextOffset = dataEnd + (length % 2);
    if (!Number.isSafeInteger(nextOffset) || dataEnd > riffEnd || nextOffset > bytes.length) break;

    const data = bytes.slice(dataStart, dataEnd);
    if (type === 'EXIF') {
      metadata.hasExif = true;
      metadata.exifTiffs.push(stripOptionalExifHeader(data));
    } else if (type === 'XMP ') {
      metadata.hasXmp = true;
    }

    offset = nextOffset;
  }

  return metadata;
}

function isPng(bytes: Uint8Array) {
  return bytes.length >= 8
    && bytes[0] === 0x89
    && bytes[1] === 0x50
    && bytes[2] === 0x4e
    && bytes[3] === 0x47
    && bytes[4] === 0x0d
    && bytes[5] === 0x0a
    && bytes[6] === 0x1a
    && bytes[7] === 0x0a;
}

function readUint32Be(bytes: Uint8Array, offset: number) {
  return ((bytes[offset] * 0x1000000) + (bytes[offset + 1] << 16) + (bytes[offset + 2] << 8) + bytes[offset + 3]) >>> 0;
}

function readUint32Le(bytes: Uint8Array, offset: number) {
  return (bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] * 0x1000000)) >>> 0;
}

function stripOptionalExifHeader(data: Uint8Array) {
  return data.length >= 6 && ascii(data, 0, 6) === 'Exif\0\0' ? data.slice(6) : data;
}

function hasPngXmpText(data: Uint8Array) {
  const text = decodeMetadataText(data);
  return text.includes('XML:com.adobe.xmp') || hasXmpText(text);
}

function hasXmpSignature(data: Uint8Array) {
  return hasXmpText(decodeMetadataText(data));
}

function hasXmpText(text: string) {
  return text.includes('http://ns.adobe.com/xap/1.0/') || text.includes('<x:xmpmeta') || text.includes('xmpmeta');
}

function hasIptcSignature(data: Uint8Array) {
  const text = decodeMetadataText(data);
  return text.includes('Photoshop 3.0') || text.includes('8BIM') || text.includes('http://ns.adobe.com/photoshop/1.0/');
}

function decodeMetadataText(bytes: Uint8Array) {
  return new TextDecoder('latin1', { fatal: false }).decode(bytes);
}

function parseTiffExif(tiff: Uint8Array) {
  const tags: ExifTag[] = [];
  if (tiff.length < 8) return { tags, hasGps: false };
  const little = tiff[0] === 0x49 && tiff[1] === 0x49;
  const big = tiff[0] === 0x4d && tiff[1] === 0x4d;
  if (!little && !big) return { tags, hasGps: false };

  const read16 = (offset: number) => {
    if (offset + 2 > tiff.length) return null;
    return little ? tiff[offset] | (tiff[offset + 1] << 8) : (tiff[offset] << 8) | tiff[offset + 1];
  };
  const read32 = (offset: number) => {
    if (offset + 4 > tiff.length) return null;
    return little
      ? (tiff[offset] | (tiff[offset + 1] << 8) | (tiff[offset + 2] << 16) | (tiff[offset + 3] * 0x1000000)) >>> 0
      : ((tiff[offset] * 0x1000000) | (tiff[offset + 1] << 16) | (tiff[offset + 2] << 8) | tiff[offset + 3]) >>> 0;
  };

  if (read16(2) !== 0x2a) return { tags, hasGps: false };
  const firstIfd = read32(4);
  if (firstIfd == null) return { tags, hasGps: false };

  const visited = new Set<number>();
  let hasGps = false;

  const valueSlice = (entryOffset: number, type: number, count: number) => {
    const unit = TYPE_BYTES[type];
    if (!unit || count > 1_000_000) return null;
    const byteLength = unit * count;
    if (!Number.isSafeInteger(byteLength)) return null;
    const inlineStart = entryOffset + 8;
    if (byteLength <= 4) return tiff.slice(inlineStart, inlineStart + byteLength);
    const dataOffset = read32(inlineStart);
    if (dataOffset == null || dataOffset + byteLength > tiff.length) return null;
    return tiff.slice(dataOffset, dataOffset + byteLength);
  };

  const parseValue = (entryOffset: number, type: number, count: number) => {
    const data = valueSlice(entryOffset, type, count);
    if (!data) return '';
    if (type === 2) return new TextDecoder('ascii', { fatal: false }).decode(data).replace(/\0+$/, '').trim();
    if (type === 3 && data.length >= 2) return String(little ? data[0] | (data[1] << 8) : (data[0] << 8) | data[1]);
    if (type === 4 && data.length >= 4) return String(little ? (data[0] | (data[1] << 8) | (data[2] << 16) | (data[3] * 0x1000000)) >>> 0 : ((data[0] * 0x1000000) | (data[1] << 16) | (data[2] << 8) | data[3]) >>> 0);
    if (type === 5 && data.length >= 8) {
      const num = little ? (data[0] | (data[1] << 8) | (data[2] << 16) | (data[3] * 0x1000000)) >>> 0 : ((data[0] * 0x1000000) | (data[1] << 16) | (data[2] << 8) | data[3]) >>> 0;
      const den = little ? (data[4] | (data[5] << 8) | (data[6] << 16) | (data[7] * 0x1000000)) >>> 0 : ((data[4] * 0x1000000) | (data[5] << 16) | (data[6] << 8) | data[7]) >>> 0;
      return den ? (num / den).toFixed(4).replace(/\.?0+$/, '') : '';
    }
    return '';
  };

  const walkIfd = (ifdOffset: number, depth: number) => {
    if (depth > 4 || visited.size > 24 || visited.has(ifdOffset)) return;
    visited.add(ifdOffset);
    if (ifdOffset + 2 > tiff.length) return;
    const entryCount = read16(ifdOffset);
    if (entryCount == null || entryCount > 512) return;
    const entriesStart = ifdOffset + 2;
    const entriesEnd = entriesStart + entryCount * 12;
    if (entriesEnd + 4 > tiff.length) return;

    for (let index = 0; index < entryCount; index += 1) {
      const entryOffset = entriesStart + index * 12;
      const tagId = read16(entryOffset);
      const type = read16(entryOffset + 2);
      const count = read32(entryOffset + 4);
      if (tagId == null || type == null || count == null) continue;

      if (tagId === 0x8769 || tagId === 0x8825) {
        const pointer = read32(entryOffset + 8);
        if (tagId === 0x8825) hasGps = true;
        if (pointer != null && pointer < tiff.length) walkIfd(pointer, depth + 1);
        continue;
      }

      if (tagId >= 0x0000 && tagId <= 0x001f && depth > 0) {
        hasGps = true;
        continue;
      }

      const name = EXIF_TAGS[tagId];
      if (!name) continue;
      const value = parseValue(entryOffset, type, count);
      if (value) tags.push({ name, value });
    }

    const nextIfdOffset = read32(entriesEnd);
    if (nextIfdOffset) walkIfd(nextIfdOffset, depth + 1);
  };

  walkIfd(firstIfd, 0);
  if (hasGps) tags.push({ name: 'GPS', value: 'Present' });
  return { tags, hasGps };
}

function dedupeTags(tags: ExifTag[]) {
  const seen = new Set<string>();
  return tags.filter((tag) => {
    const key = `${tag.name}:${tag.value}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
