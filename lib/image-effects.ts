import {
  getGeometryMimeLabel, normalizeGeometryMime, validateGeometryDimensions,
  verifyGeometryOutputSignature, type GeometryOutputMime, type GeometryValidation,
} from './image-geometry';

export type ImageEffectKind = 'grayscale' | 'pixelate' | 'sharpen' | 'unblur';
export async function encodeEffectPreview(
  encode: () => Promise<Blob | null>,
  mimeType: GeometryOutputMime,
  isCancelled: () => boolean,
): Promise<Blob | null> {
  if (isCancelled()) return null;
  const label = getGeometryMimeLabel(mimeType);
  const blob = await encode();
  if (isCancelled()) return null;
  if (!blob || normalizeGeometryMime(blob.type) !== mimeType) {
    throw new Error(`Couldn’t encode this image as ${label}. Retry the preview or choose another image.`);
  }
  const header = new Uint8Array(await blob.slice(0, 16).arrayBuffer());
  if (isCancelled()) return null;
  if (!verifyGeometryOutputSignature(header, mimeType)) {
    throw new Error(`The browser returned invalid ${label} bytes. Retry the preview or choose another image.`);
  }
  return blob;
}

export function validateEffectDimensions(width: number, height: number): GeometryValidation {
  const validation = validateGeometryDimensions(width, height);
  if (!validation.valid) return validation;
  if (width * height > 16_000_000) {
    return { valid: false, width: 0, height: 0, error: 'Choose an image up to 16 megapixels.' };
  }
  return validation;
}

/** Always reads the original pixels. A null result means the operation was cancelled. */
export async function applyImageEffect(
  source: { data: Uint8ClampedArray; width: number; height: number },
  effect: { kind: ImageEffectKind; value: number },
  control: { isCancelled: () => boolean; yieldControl: () => Promise<void> } = {
    isCancelled: () => false,
    yieldControl: () => new Promise((resolve) => setTimeout(resolve, 0)),
  },
): Promise<Uint8ClampedArray | null> {
  const { data, width, height } = source;
  const validation = validateEffectDimensions(width, height);
  if (!validation.valid) throw new Error(validation.error);
  if (data.length !== width * height * 4) throw new Error('Invalid image pixels.');
  if (control.isCancelled()) return null;
  const out = new Uint8ClampedArray(data);
  const value = Number.isFinite(effect.value) ? effect.value : 0;
  const size = Math.max(1, Math.min(64, Math.round(value)));
  const amount = effect.kind === 'unblur' ? Math.max(0, Math.min(100, value)) / 50 : Math.max(0, Math.min(3, value));
  if ((effect.kind === 'pixelate' && size === 1) || ((effect.kind === 'sharpen' || effect.kind === 'unblur') && amount === 0)) return out;

  let worked = 0;
  const checkpoint = async () => {
    await control.yieldControl();
    worked = 0;
    return control.isCancelled();
  };

  if (effect.kind === 'pixelate') {
    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        const bottom = Math.min(height, y + size), right = Math.min(width, x + size);
        let r = 0, g = 0, b = 0, weight = 0;
        for (let by = y; by < bottom; by++) {
          for (let bx = x; bx < right; bx++) {
            const i = (by * width + bx) * 4, alpha = data[i + 3];
            r += data[i] * alpha; g += data[i + 1] * alpha; b += data[i + 2] * alpha; weight += alpha;
          }
        }
        if (weight > 0) {
          for (let by = y; by < bottom; by++) {
            for (let bx = x; bx < right; bx++) {
              const i = (by * width + bx) * 4;
              out[i] = r / weight; out[i + 1] = g / weight; out[i + 2] = b / weight;
            }
          }
        }
        worked += (bottom - y) * (right - x);
        if (worked >= 16_384 && await checkpoint()) return null;
      }
    }
  } else {
    const index = (x: number, y: number) => (Math.max(0, Math.min(height - 1, y)) * width + Math.max(0, Math.min(width - 1, x))) * 4;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        if (effect.kind === 'grayscale') {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          out[i] = gray; out[i + 1] = gray; out[i + 2] = gray;
        } else if (data[i + 3] !== 0) {
          if (effect.kind === 'sharpen') {
            const left = index(x - 1, y), right = index(x + 1, y), up = index(x, y - 1), down = index(x, y + 1);
            for (let c = 0; c < 3; c++) {
              const center = data[i + c];
              // Transparent neighbors contribute the center color, avoiding dark fringes.
              const detail = (center - data[left + c]) * data[left + 3] / 255
                + (center - data[right + c]) * data[right + 3] / 255
                + (center - data[up + c]) * data[up + 3] / 255
                + (center - data[down + c]) * data[down + 3] / 255;
              out[i + c] = center + amount * detail;
            }
          } else {
            let r = 0, g = 0, b = 0, weight = 0;
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const n = index(x + dx, y + dy), alpha = data[n + 3];
                r += data[n] * alpha; g += data[n + 1] * alpha; b += data[n + 2] * alpha; weight += alpha;
              }
            }
            out[i] = data[i] + amount * (data[i] - r / weight);
            out[i + 1] = data[i + 1] + amount * (data[i + 1] - g / weight);
            out[i + 2] = data[i + 2] + amount * (data[i + 2] - b / weight);
          }
        }
      }
      worked += width;
      if (worked >= 16_384 && await checkpoint()) return null;
    }
  }
  return control.isCancelled() ? null : out;
}
