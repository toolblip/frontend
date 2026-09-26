import { PDFName, PDFNumber, PDFPage, concatTransformationMatrix, popGraphicsState, pushGraphicsState } from 'pdf-lib';

type Matrix = [number, number, number, number, number, number];

/** PDF.js's visible page: MediaBox intersect CropBox, then Rotate and UserUnit.
 * Coordinates are scale-1 viewport points. The drawing matrix uses a bottom-left
 * origin so PDF text and images remain upright; pointer coordinates use top-left.
 */
export function visiblePageGeometry(page: PDFPage) {
  const media = page.getMediaBox(); const crop = page.getCropBox();
  let left = Math.max(media.x, crop.x), bottom = Math.max(media.y, crop.y);
  let right = Math.min(media.x + media.width, crop.x + crop.width);
  let top = Math.min(media.y + media.height, crop.y + crop.height);
  // PDF.js falls back to MediaBox for an empty intersection.
  if (right <= left || top <= bottom) {
    left = media.x; bottom = media.y; right = left + media.width; top = bottom + media.height;
  }
  const value = page.node.lookup(PDFName.of('UserUnit'));
  const unit = value instanceof PDFNumber && value.asNumber() > 0 ? value.asNumber() : 1;
  const s = 1 / unit;
  const angle = page.getRotation().angle;
  const rotation = angle % 90 === 0 ? ((angle % 360) + 360) % 360 : 0;
  const matrix: Matrix = rotation === 90 ? [0, s, -s, 0, right, bottom]
    : rotation === 180 ? [-s, 0, 0, -s, right, top]
    : rotation === 270 ? [0, -s, s, 0, left, top]
    : [s, 0, 0, s, left, bottom];
  const sideways = rotation === 90 || rotation === 270;
  return { width: (sideways ? top - bottom : right - left) * unit,
    height: (sideways ? right - left : top - bottom) * unit, matrix };
}

export function viewportToPage(g: ReturnType<typeof visiblePageGeometry>, x: number, y: number) {
  const [a, b, c, d, e, f] = g.matrix;
  return { x: a * x + c * (g.height - y) + e, y: b * x + d * (g.height - y) + f };
}

/** Keep the transform scoped to new content; never rotate existing page content. */
export async function drawInVisiblePage(page: PDFPage, draw: (g: ReturnType<typeof visiblePageGeometry>) => void | Promise<void>) {
  const geometry = visiblePageGeometry(page);
  page.pushOperators(pushGraphicsState(), concatTransformationMatrix(...geometry.matrix));
  try { await draw(geometry); }
  finally { page.pushOperators(popGraphicsState()); }
}

/** Bounds and baseline of PDF.js text already transformed into viewport space. */
export function visibleTextGeometry(transform: number[], width: number, ascent = 1, descent = 0) {
  const [a, b, c, d, baselineX, baselineY] = transform;
  const fontSize = Math.hypot(c, d);
  const advance = Math.hypot(a, b) || 1;
  const dx = a / advance * width, dy = b / advance * width;
  const corners = [ascent, descent].flatMap(v => [
    [baselineX + c * v, baselineY + d * v],
    [baselineX + dx + c * v, baselineY + dy + d * v],
  ]);
  const x = Math.min(...corners.map(p => p[0])), y = Math.min(...corners.map(p => p[1]));
  return { x, y, width: Math.max(...corners.map(p => p[0])) - x,
    height: Math.max(...corners.map(p => p[1])) - y,
    fontSize, baselineX, baselineY, angle: Math.atan2(b, a) * 180 / Math.PI };
}
