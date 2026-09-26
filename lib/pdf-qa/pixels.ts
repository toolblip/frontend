export function rgbaPixels(raw: Uint8Array, width: number, height: number, mode: 'gray' | 'rgb' | 'cmyk' | 'indexed', palette?: Uint8Array, alpha?: Uint8Array) {
  const count = width * height;
  if (![width, height].every(n => Number.isInteger(n) && n > 0) || count > 16000000) throw new Error('Image exceeds 16 million pixels.');
  const channels = mode === 'rgb' ? 3 : mode === 'cmyk' ? 4 : 1;
  if (raw.length !== count * channels || (alpha && alpha.length !== count)) throw new Error('Unsupported or truncated image samples.');
  const out = new Uint8ClampedArray(count * 4);
  for (let i = 0; i < count; i++) {
    const p = i * channels;
    if (mode === 'rgb') out.set(raw.subarray(p, p + 3), i * 4);
    else if (mode === 'gray') out.fill(raw[i], i * 4, i * 4 + 3);
    else if (mode === 'indexed') {
      const index = raw[i] * 3;
      if (!palette || index + 2 >= palette.length) throw new Error('Invalid image palette.');
      out.set(palette.subarray(index, index + 3), i * 4);
    } else {
      for (let c = 0; c < 3; c++) out[i * 4 + c] = 255 * (1 - raw[p + c] / 255) * (1 - raw[p + 3] / 255);
    }
    out[i * 4 + 3] = alpha?.[i] ?? 255;
  }
  return out;
}
