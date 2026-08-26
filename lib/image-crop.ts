export type CropRect = { x: number; y: number; w: number; h: number };

/** Largest centered rectangle with `ratio` (width / height) that fits in the image. */
export function fitAspectCrop(imgW: number, imgH: number, ratio: number): CropRect {
  if (imgW <= 0 || imgH <= 0 || ratio <= 0 || !Number.isFinite(ratio)) {
    return { x: 0, y: 0, w: 0, h: 0 };
  }

  let w: number;
  let h: number;
  if (imgW / imgH > ratio) {
    h = imgH;
    w = h * ratio;
  } else {
    w = imgW;
    h = w / ratio;
  }

  return {
    x: Math.round((imgW - w) / 2),
    y: Math.round((imgH - h) / 2),
    w: Math.round(w),
    h: Math.round(h),
  };
}
