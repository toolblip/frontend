export const MAX_IMAGE_GEOMETRY_BYTES = 20 * 1024 * 1024;
export const MAX_IMAGE_GEOMETRY_SIDE = 8192;
export const MAX_IMAGE_GEOMETRY_PIXELS = 32_000_000;
export const MAX_GEOMETRY_JPEG_QUALITY = 85;
export const MIN_GEOMETRY_JPEG_QUALITY = 35;
export const GEOMETRY_JPEG_RETRY_STEP = 10;
export const ACCEPTED_IMAGE_GEOMETRY_TYPES = '.png,.jpg,.jpeg,.webp,.gif,.svg,image/png,image/jpeg,image/webp,image/gif,image/svg+xml';

export type GeometryOutputMime = 'image/png' | 'image/jpeg';
export type GeometryValidation =
  | { valid: true; width: number; height: number; error: '' }
  | { valid: false; width: 0; height: 0; error: string };
export type IntegerValidation =
  | { valid: true; value: number; error: '' }
  | { valid: false; value: 0; error: string };
export type GeometryRect = {
  canvasWidth: number;
  canvasHeight: number;
  drawX: number;
  drawY: number;
  drawWidth: number;
  drawHeight: number;
};
export type GeometryEncodeResult = {
  blob: Blob | null;
  actualQuality: number | null;
  qualityAutoReduced: boolean;
  failed: boolean;
  cancelled: boolean;
  mimeMismatch: boolean;
  error?: string;
};

export function normalizeGeometryMime(mimeType: string) {
  const normalized = mimeType.toLowerCase();
  return normalized === 'image/jpg' ? 'image/jpeg' : normalized;
}

export function parseGeometryInteger(value: string, label = 'Value'): IntegerValidation {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, value: 0, error: `${label} is required.` };
  if (!/^\d+$/.test(trimmed)) return { valid: false, value: 0, error: `${label} must be a whole number.` };
  const parsed = Number(trimmed);
  if (!Number.isSafeInteger(parsed) || parsed < 1) return { valid: false, value: 0, error: `${label} must be at least 1 pixel.` };
  return { valid: true, value: parsed, error: '' };
}

export function validateGeometryDimensions(rawWidth: number, rawHeight: number): GeometryValidation {
  if (!Number.isFinite(rawWidth) || !Number.isFinite(rawHeight)) {
    return { valid: false, width: 0, height: 0, error: 'Enter width and height before exporting.' };
  }
  if (!Number.isInteger(rawWidth) || !Number.isInteger(rawHeight)) {
    return { valid: false, width: 0, height: 0, error: 'Width and height must be whole pixels.' };
  }
  if (rawWidth < 1 || rawHeight < 1) {
    return { valid: false, width: 0, height: 0, error: 'Width and height must be at least 1 pixel.' };
  }
  if (rawWidth > MAX_IMAGE_GEOMETRY_SIDE || rawHeight > MAX_IMAGE_GEOMETRY_SIDE) {
    return { valid: false, width: 0, height: 0, error: `Use dimensions up to ${MAX_IMAGE_GEOMETRY_SIDE} px on each side.` };
  }
  if (rawWidth * rawHeight > MAX_IMAGE_GEOMETRY_PIXELS) {
    return { valid: false, width: 0, height: 0, error: 'Use a smaller output size, up to 32 megapixels.' };
  }
  return { valid: true, width: rawWidth, height: rawHeight, error: '' };
}

export function calculateCoverGeometry({
  sourceWidth,
  sourceHeight,
  targetWidth,
  targetHeight,
}: {
  sourceWidth: number;
  sourceHeight: number;
  targetWidth: number;
  targetHeight: number;
}): GeometryRect {
  const scale = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  return {
    canvasWidth: targetWidth,
    canvasHeight: targetHeight,
    drawX: (targetWidth - drawWidth) / 2,
    drawY: (targetHeight - drawHeight) / 2,
    drawWidth,
    drawHeight,
  };
}

export function calculateContainGeometry({
  sourceWidth,
  sourceHeight,
  targetWidth,
  targetHeight,
}: {
  sourceWidth: number;
  sourceHeight: number;
  targetWidth: number;
  targetHeight: number;
}): GeometryRect {
  const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  return {
    canvasWidth: targetWidth,
    canvasHeight: targetHeight,
    drawX: (targetWidth - drawWidth) / 2,
    drawY: (targetHeight - drawHeight) / 2,
    drawWidth,
    drawHeight,
  };
}

export function calculateStretchGeometry({ targetWidth, targetHeight }: { targetWidth: number; targetHeight: number }): GeometryRect {
  return {
    canvasWidth: targetWidth,
    canvasHeight: targetHeight,
    drawX: 0,
    drawY: 0,
    drawWidth: targetWidth,
    drawHeight: targetHeight,
  };
}

export function calculateBorderGeometry({
  sourceWidth,
  sourceHeight,
  borderWidth,
}: {
  sourceWidth: number;
  sourceHeight: number;
  borderWidth: number;
}): GeometryRect {
  return {
    canvasWidth: sourceWidth + borderWidth * 2,
    canvasHeight: sourceHeight + borderWidth * 2,
    drawX: borderWidth,
    drawY: borderWidth,
    drawWidth: sourceWidth,
    drawHeight: sourceHeight,
  };
}

export function formatGeometryBytes(bytes: number) {
  if (bytes < 1024) return `${bytes.toLocaleString()} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function formatGeometryBytesExact(bytes: number) {
  return `${formatGeometryBytes(bytes)} (${bytes.toLocaleString()} bytes)`;
}

export function getGeometrySafeBaseName(fileName: string) {
  return (fileName.replace(/\.[^.]+$/, '').trim() || 'image')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'image';
}

export function getGeometryExtension(mimeType: GeometryOutputMime) {
  return mimeType === 'image/jpeg' ? 'jpg' : 'png';
}

export function getGeometryDownloadName(
  fileName: string,
  operation: string,
  mimeType: GeometryOutputMime,
  dimensions: { width: number; height: number },
) {
  return `${getGeometrySafeBaseName(fileName)}-${operation}-${dimensions.width}x${dimensions.height}.${getGeometryExtension(mimeType)}`;
}

export function getDefaultGeometryFormat(sourceMimeType: string): GeometryOutputMime {
  return normalizeGeometryMime(sourceMimeType) === 'image/jpeg' ? 'image/jpeg' : 'image/png';
}

export function getGeometryMimeLabel(mimeType: string) {
  const normalized = normalizeGeometryMime(mimeType);
  if (normalized === 'image/jpeg') return 'JPEG';
  if (normalized === 'image/png') return 'PNG';
  if (normalized === 'image/webp') return 'WebP';
  if (normalized === 'image/gif') return 'GIF';
  if (normalized === 'image/svg+xml') return 'SVG';
  return 'image';
}

export function getGeometrySourceNotes(mimeType: string) {
  if (mimeType === 'image/gif') return ['GIF is rasterized as a still frame. Animation is not kept.'];
  if (mimeType === 'image/svg+xml') return ['SVG is rasterized before export.'];
  return [];
}

export function inferGeometryMimeFromName(fileName: string) {
  const extension = fileName.toLowerCase().split('.').pop() || '';
  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'gif') return 'image/gif';
  if (extension === 'svg') return 'image/svg+xml';
  return '';
}

export async function detectGeometryMimeType(file: File) {
  const header = new Uint8Array(await file.slice(0, 512).arrayBuffer());
  return detectGeometryMimeFromHeader(header);
}

export function detectGeometryMimeFromHeader(header: Uint8Array) {
  const ascii = (start: number, end: number) => String.fromCharCode(...header.slice(start, end));
  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) return 'image/jpeg';
  if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47) return 'image/png';
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
  if (ascii(0, 3) === 'GIF') return 'image/gif';
  const text = new TextDecoder('utf-8', { fatal: false }).decode(header).trimStart().toLowerCase();
  if (text.startsWith('<svg') || text.includes('<svg')) return 'image/svg+xml';
  return '';
}

export function verifyGeometryOutputSignature(header: Uint8Array, mimeType: GeometryOutputMime) {
  return detectGeometryMimeFromHeader(header) === normalizeGeometryMime(mimeType);
}

export function getGeometryMimeMismatchError(file: File, detectedMimeType: string) {
  const declared = normalizeGeometryMime(file.type);
  const named = inferGeometryMimeFromName(file.name);
  const claimed = declared.startsWith('image/') ? declared : named;
  if (!detectedMimeType || !claimed) return '';
  if (claimed !== detectedMimeType) {
    return `This file looks like ${getGeometryMimeLabel(detectedMimeType)}, but its name or MIME type says ${getGeometryMimeLabel(claimed)}. Rename or export it correctly first.`;
  }
  return '';
}

export function validateGeometryFile(file: File, detectedMimeType: string) {
  if (file.size > MAX_IMAGE_GEOMETRY_BYTES) return 'Choose an image up to 20 MiB.';
  const claimed = normalizeGeometryMime(file.type).startsWith('image/') ? normalizeGeometryMime(file.type) : inferGeometryMimeFromName(file.name);
  if (claimed && !['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'].includes(claimed)) {
    return 'Choose a PNG, JPEG, WebP, GIF, or SVG image.';
  }
  if (!detectedMimeType) return 'This does not look like a supported image file.';
  return getGeometryMimeMismatchError(file, detectedMimeType);
}

export async function encodeGeometryBlobWithJpegRetry({
  originalBytes,
  requestedMimeType,
  maxQuality,
  allowRetryWhenLarger,
  encode,
  isCancelled,
}: {
  originalBytes: number;
  requestedMimeType: GeometryOutputMime;
  maxQuality: number;
  allowRetryWhenLarger: boolean;
  encode: (mimeType: GeometryOutputMime, quality?: number) => Promise<Blob | null>;
  isCancelled: () => boolean;
}): Promise<GeometryEncodeResult> {
  const maxCandidateQuality = Math.min(MAX_GEOMETRY_JPEG_QUALITY, Math.max(MIN_GEOMETRY_JPEG_QUALITY, Math.round(maxQuality)));
  const candidates: Array<number | null> = requestedMimeType === 'image/jpeg' ? [maxCandidateQuality] : [null];

  if (requestedMimeType === 'image/jpeg' && allowRetryWhenLarger) {
    for (let next = maxCandidateQuality - GEOMETRY_JPEG_RETRY_STEP; next > MIN_GEOMETRY_JPEG_QUALITY; next -= GEOMETRY_JPEG_RETRY_STEP) {
      candidates.push(next);
    }
    if (candidates[candidates.length - 1] !== MIN_GEOMETRY_JPEG_QUALITY) candidates.push(MIN_GEOMETRY_JPEG_QUALITY);
  }

  let best: { blob: Blob; quality: number | null } | null = null;

  for (const quality of candidates) {
    if (isCancelled()) return { blob: null, actualQuality: null, qualityAutoReduced: false, failed: false, cancelled: true, mimeMismatch: false };

    let blob: Blob | null;
    try {
      blob = await encode(requestedMimeType, quality == null ? undefined : quality / 100);
    } catch (err) {
      if (isCancelled()) return { blob: null, actualQuality: null, qualityAutoReduced: false, failed: false, cancelled: true, mimeMismatch: false };
      return { blob: null, actualQuality: null, qualityAutoReduced: false, failed: true, cancelled: false, mimeMismatch: false, error: err instanceof Error ? err.message : undefined };
    }

    if (isCancelled()) return { blob: null, actualQuality: null, qualityAutoReduced: false, failed: false, cancelled: true, mimeMismatch: false };
    if (!blob) return { blob: null, actualQuality: null, qualityAutoReduced: false, failed: true, cancelled: false, mimeMismatch: false };
    if (normalizeGeometryMime(blob.type || '') !== requestedMimeType) {
      return { blob: null, actualQuality: null, qualityAutoReduced: false, failed: true, cancelled: false, mimeMismatch: true };
    }

    if (!best || blob.size < best.blob.size) best = { blob, quality };
    if (requestedMimeType !== 'image/jpeg' || !allowRetryWhenLarger || blob.size < originalBytes) break;
  }

  if (!best) return { blob: null, actualQuality: null, qualityAutoReduced: false, failed: true, cancelled: false, mimeMismatch: false };
  return {
    blob: best.blob,
    actualQuality: best.quality,
    qualityAutoReduced: best.quality != null && best.quality < maxCandidateQuality,
    failed: false,
    cancelled: false,
    mimeMismatch: false,
  };
}
