export type ImageKind = 'png' | 'jpeg' | 'webp' | 'gif' | 'svg' | 'heic';
export const IMAGE_BYTES = 10 * 1024 * 1024;
export function dimensions(width: number, height: number, maxPixels = 16_000_000) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 16384 || height > 16384 || width * height > maxPixels) throw new Error('Image exceeds the dimension limit (16 megapixels, 16,384 per side).');
}
export function imageKind(bytes: Uint8Array): ImageKind {
  const str = (a: number, b: number) => String.fromCharCode(...bytes.slice(a, b));
  if (bytes.length >= 24 && str(0, 8) === '\x89PNG\r\n\x1a\n') return 'png';
  if (bytes.length >= 4 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpeg';
  if (bytes.length >= 16 && str(0, 4) === 'RIFF' && str(8, 12) === 'WEBP') return 'webp';
  if (bytes.length >= 13 && /^GIF8[79]a$/.test(str(0, 6))) return 'gif';
  if (str(4, 8) === 'ftyp' && /heic|heix|hevc|hevx|mif1|msf1/.test(str(8, 64))) return 'heic';
  if (/^\s*(?:<\?xml[^>]*>\s*)?(?:<!--[\s\S]*?-->\s*)*<svg[\s>]/i.test(new TextDecoder().decode(bytes.slice(0, 4096)))) return 'svg';
  throw new Error('Unsupported or invalid image bytes. Use PNG, JPEG, WebP, GIF, SVG or HEIC.');
}
export function preflightImage(bytes: Uint8Array, kind: ImageKind) {
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (kind === 'png') dimensions(v.getUint32(16), v.getUint32(20));
  if (kind === 'gif') dimensions(v.getUint16(6, true), v.getUint16(8, true));
  if (kind === 'jpeg') {
    let p = 2;
    while (p + 4 <= bytes.length) {
      if (bytes[p++] !== 255) throw new Error('Invalid JPEG marker.');
      while (bytes[p] === 255) p++;
      const marker = bytes[p++];
      if (marker === 0xda || marker === 0xd9) break;
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      const length = v.getUint16(p);
      if (length < 2 || p + length > bytes.length) throw new Error('Truncated JPEG.');
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) { dimensions(v.getUint16(p + 5), v.getUint16(p + 3)); return; }
      p += length;
    }
    throw new Error('JPEG dimensions not found.');
  }
  if (kind === 'webp') {
    const tag = new TextDecoder().decode(bytes.slice(12, 16));
    if (tag === 'VP8X' && bytes.length >= 30) dimensions(1 + bytes[24] + bytes[25] * 256 + bytes[26] * 65536, 1 + bytes[27] + bytes[28] * 256 + bytes[29] * 65536);
    else if (tag === 'VP8L' && bytes.length >= 25) { const n = v.getUint32(21, true); dimensions((n & 0x3fff) + 1, ((n >>> 14) & 0x3fff) + 1); }
    else if (tag === 'VP8 ' && bytes.length >= 30) dimensions(v.getUint16(26, true) & 0x3fff, v.getUint16(28, true) & 0x3fff);
    else throw new Error('Unsupported WebP header.');
  }
  if (kind === 'heic') {
    // HEIF item spatial extents include derived/coded image dimensions. Reject unsafe extents before decoding.
    let found = false;
    for (let p = 4; p + 16 <= bytes.length; p++) if (bytes[p] === 105 && bytes[p + 1] === 115 && bytes[p + 2] === 112 && bytes[p + 3] === 101) {
      if (v.getUint32(p - 4) !== 20) continue;
      dimensions(v.getUint32(p + 8), v.getUint32(p + 12)); found = true;
    }
    if (!found) throw new Error('HEIC spatial dimensions are missing or unsupported.');
  }
}
export async function checkedImage(blob: Blob, signal: AbortSignal): Promise<HTMLImageElement> {
  signal.throwIfAborted();
  const url = URL.createObjectURL(blob), image = new Image();
  try {
    await new Promise<void>((resolve, reject) => {
      const finish = (err?: Error) => { clearTimeout(timer); signal.removeEventListener('abort', abort); image.onload = null; image.onerror = null; err ? reject(err) : resolve(); };
      const abort = () => { image.src = ''; finish(new Error('Image loading cancelled.')); };
      const timer = setTimeout(() => { image.src = ''; finish(new Error('Image decoding timed out.')); }, 20000);
      signal.addEventListener('abort', abort, { once: true });
      image.onload = () => finish(); image.onerror = () => finish(new Error('This image could not be decoded.'));
      image.src = url;
    });
    signal.throwIfAborted(); dimensions(image.naturalWidth, image.naturalHeight); return image;
  } finally { URL.revokeObjectURL(url); }
}
export async function canvasBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob> {
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, mime, quality));
  if (!blob || !blob.size || blob.type !== mime) throw new Error(`Your browser cannot encode ${mime}. No substitute file was created.`);
  const kind = imageKind(new Uint8Array(await blob.arrayBuffer()));
  if (`image/${kind}` !== mime) throw new Error('Encoded bytes do not match the requested format.');
  return blob;
}
export type GifPatch = { dims: { width: number; height: number; left: number; top: number }; patch: Uint8ClampedArray; disposalType: number; delay: number };
/** Transparent patch pixels retain the canvas. Disposal belongs to the preceding frame. */
export function composeGif(width: number, height: number, frames: GifPatch[], background = [0, 0, 0, 0]): ArrayBuffer[] {
  dimensions(width, height);
  if (!frames.length || frames.length > 200 || width * height * frames.length > 16_000_000) throw new Error('GIF exceeds 200 frames or 16 million total frame pixels.');
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let p = 0; p < pixels.length; p += 4) pixels.set(background, p);
  const results: ArrayBuffer[] = [];
  let previous: GifPatch | undefined, restore: Uint8ClampedArray | undefined;
  for (const frame of frames) {
    if (previous?.disposalType === 2) {
      const d = previous.dims;
      for (let y = d.top; y < d.top + d.height; y++) for (let x = d.left; x < d.left + d.width; x++) pixels.set(background, (y * width + x) * 4);
    } else if (previous?.disposalType === 3 && restore) pixels.set(restore);
    restore = frame.disposalType === 3 ? pixels.slice() : undefined;
    const d = frame.dims;
    if (d.left < 0 || d.top < 0 || d.left + d.width > width || d.top + d.height > height || frame.patch.length !== d.width * d.height * 4) throw new Error('Invalid GIF frame bounds.');
    for (let y = 0; y < d.height; y++) for (let x = 0; x < d.width; x++) {
      const p = (y * d.width + x) * 4;
      if (frame.patch[p + 3]) pixels.set(frame.patch.subarray(p, p + 4), ((y + d.top) * width + x + d.left) * 4);
    }
    results.push(pixels.slice().buffer); previous = frame;
  }
  return results;
}
export async function gifFrames(bytes: ArrayBuffer) {
  const { parseGIF, decompressFrames } = await import('gifuct-js');
  const gif = parseGIF(bytes), width = gif.lsd.width, height = gif.lsd.height;
  dimensions(width, height);
  const count = gif.frames.filter(f => 'image' in f).length;
  if (!count || count > 200 || width * height * count > 16_000_000) throw new Error('GIF exceeds 200 frames or 16 million total frame pixels.');
  for (const f of gif.frames) if ('image' in f) {
    const d = f.image.descriptor;
    if (!d.width || !d.height || d.left + d.width > width || d.top + d.height > height) throw new Error('Invalid GIF frame bounds.');
  }
  const frames = decompressFrames(gif, true);
  const first = frames[0]; const bg = gif.gct?.[gif.lsd.backgroundColorIndex];
  const background = first.transparentIndex !== undefined || !bg ? [0, 0, 0, 0] : [...bg, 255];
  return { width, height, frames: composeGif(width, height, frames, background), delays: frames.map(f => Math.max(10, f.delay || 100)) };
}
export async function sanitizeSvg(bytes: Uint8Array): Promise<Blob> {
  const doc = new DOMParser().parseFromString(new TextDecoder().decode(bytes), 'image/svg+xml');
  if (doc.querySelector('parsererror') || doc.documentElement.localName !== 'svg') throw new Error('Invalid SVG markup.');
  if (doc.doctype || doc.querySelector('script, foreignObject, image, use, style, animate, animateTransform, set')) throw new Error('Use a self-contained static SVG without scripts, stylesheets, embedded images or external references.');
  for (const el of Array.from(doc.querySelectorAll('*'))) for (const attr of Array.from(el.attributes)) {
    if (/^on/i.test(attr.name) || /href/i.test(attr.name) || /url\s*\(|@import/i.test(attr.value)) throw new Error('SVG external references and active content are unsupported.');
  }
  const root = doc.documentElement;
  const box = root.getAttribute('viewBox')?.trim().split(/[\s,]+/).map(Number);
  const size = (v: string | null) => v && /^\d+(?:\.\d+)?(?:px)?$/.test(v) ? Math.ceil(parseFloat(v)) : 0;
  const width = size(root.getAttribute('width')) || (box?.length === 4 ? Math.ceil(box[2]) : 0);
  const height = size(root.getAttribute('height')) || (box?.length === 4 ? Math.ceil(box[3]) : 0);
  dimensions(width, height); root.setAttribute('width', String(width)); root.setAttribute('height', String(height));
  return new Blob([new XMLSerializer().serializeToString(doc)], { type: 'image/svg+xml' });
}
