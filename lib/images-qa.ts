/** Helpers owned only by the automatic images QA group. */
export function positive(value: string): number | null {
    const n = Number(value);
    return value.trim() && Number.isFinite(n) && n > 0 && n <= 1e9 ? n : null;
}
export function imageBounds(width: number, height: number) {
    if (![width, height].every(n => Number.isInteger(n) && n > 0 && n <= 8192) || width * height > 24000000)
        throw new Error('Use dimensions from 1 to 8192 pixels, at most 24 megapixels.');
    return { width, height };
}
export function imageSignature(b: Uint8Array): string | null {
    const ascii = (a: number, n: number) => String.fromCharCode(...b.slice(a, a + n));
    if ([137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => b[i] === v))
        return 'image/png';
    if (b[0] === 255 && b[1] === 216 && b[2] === 255)
        return 'image/jpeg';
    if (['GIF87a', 'GIF89a'].includes(ascii(0, 6)))
        return 'image/gif';
    if (ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP')
        return 'image/webp';
    if (ascii(0, 2) === 'BM' && b.length >= 30)
        return 'image/bmp';
    if (b.length >= 22 && b[0] === 0 && b[1] === 0 && b[2] === 1 && b[3] === 0)
        return 'image/x-icon';
    if (/^\s*(?:<\?xml[^>]*>\s*)?(?:<!--[^]*?-->\s*)?<svg[\s>]/i.test(new TextDecoder().decode(b.slice(0, 2048))))
        return 'image/svg+xml';
    return null;
}
/** Read cheap raster dimensions before handing bytes to the browser decoder. */
export function preflightImage(b: Uint8Array, mime: string) {
  const v=new DataView(b.buffer,b.byteOffset,b.byteLength);
  if(mime==='image/png'&&b.length>=24)imageBounds(v.getUint32(16),v.getUint32(20));
  if(mime==='image/gif'&&b.length>=10)imageBounds(v.getUint16(6,true),v.getUint16(8,true));
  if(mime==='image/bmp'&&b.length>=26)imageBounds(Math.abs(v.getInt32(18,true)),Math.abs(v.getInt32(22,true)));
  if(mime==='image/webp'&&b.length>=30){
    const kind=String.fromCharCode(...b.slice(12,16));
    if(kind==='VP8X')imageBounds(1+b[24]+b[25]*256+b[26]*65536,1+b[27]+b[28]*256+b[29]*65536);
    if(kind==='VP8 ')imageBounds(v.getUint16(26,true)&16383,v.getUint16(28,true)&16383);
    if(kind==='VP8L')imageBounds(1+(b[21]|((b[22]&63)<<8)),1+((b[22]>>6)|(b[23]<<2)|((b[24]&15)<<10)));
  }
  if(mime==='image/jpeg'){
    let offset=2;
    while(offset+4<=b.length){
      if(b[offset]!==255)break;
      const marker=b[offset+1];
      if(marker===0xda||marker===0xd9)break;
      if(marker===0xff||marker===0x00){offset++;continue;}
      if(marker===0xd8||marker===1||(marker>=0xd0&&marker<=0xd7)){offset+=2;continue;}
      const length=v.getUint16(offset+2);
      if(length<2||offset+length+2>b.length)throw Error('Truncated JPEG segment.');
      if(marker>=0xc0&&marker<=0xcf&&![0xc4,0xc8,0xcc].includes(marker)){
        if(length<8)throw Error('Truncated JPEG dimensions.');
        imageBounds(v.getUint16(offset+7),v.getUint16(offset+5));return;
      }
      offset+=length+2;
    }
  }
}
export function exampleFile(): File {
    const c = document.createElement('canvas');
    c.width = 320;
    c.height = 200;
    const x = c.getContext('2d')!;
    x.fillStyle = '#00ff00';
    x.fillRect(0, 0, 320, 200);
    x.fillStyle = '#e84444';
    x.fillRect(80, 50, 160, 100);
    x.clearRect(0, 0, 8, 8);
    const b = atob(c.toDataURL().split(',')[1]);
    return new File([Uint8Array.from(b, v => v.charCodeAt(0))], 'example.png', { type: 'image/png' });
}
export async function readImage(file: Blob) {
    if (!file.size || file.size > 20 * 1024 * 1024)
        throw new Error('Choose an image up to 20 MB.');
    const bytes = new Uint8Array(await file.arrayBuffer());
    const mime = imageSignature(bytes);
    if (!mime)
        throw new Error('Unsupported or invalid image bytes.');
    preflightImage(bytes,mime);
    const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
    const img = new Image();
    try {
        await new Promise<void>((resolve, reject) => { const t = setTimeout(() => { img.src = ''; reject(new Error('Image decoding timed out.')); }, 15000); img.onload = () => { clearTimeout(t); resolve(); }; img.onerror = () => { clearTimeout(t); reject(new Error('Could not decode this image.')); }; img.src = url; });
        imageBounds(img.naturalWidth, img.naturalHeight);
        return { img, mime, bytes };
    }
    finally {
        URL.revokeObjectURL(url);
    }
}
export function canvasBlob(canvas: HTMLCanvasElement, mime = 'image/png'): Promise<Blob> {
    return new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('Image export failed.')), mime, 0.92));
}
export function saveBlob(blob: Blob, name: string) { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
export function crc32(bytes: Uint8Array) { let c = 0xffffffff; for (const b of bytes) {
    c ^= b;
    for (let j = 0; j < 8; j++)
        c = (c >>> 1) ^ ((c & 1) ? 0xedb88320 : 0);
} return (c ^ 0xffffffff) >>> 0; }
export function pngDpi(bytes: Uint8Array, dpi: number) {
    if (imageSignature(bytes) !== 'image/png' || !Number.isFinite(dpi) || dpi < 1 || dpi > 10000)
        throw new Error('PNG DPI must be between 1 and 10000.');
    const chunk = new Uint8Array(21), v = new DataView(chunk.buffer);
    v.setUint32(0, 9);
    chunk.set([112, 72, 89, 115], 4);
    v.setUint32(8, Math.round(dpi / 0.0254));
    v.setUint32(12, Math.round(dpi / 0.0254));
    chunk[16] = 1;
    v.setUint32(17, crc32(chunk.slice(4, 17)));
    const parts = [bytes.slice(0, 8)];
    let p = 8;
    let inserted = false;
    while (p + 12 <= bytes.length) {
        const n = new DataView(bytes.buffer, bytes.byteOffset + p).getUint32(0);
        if (n > bytes.length - p - 12)
            throw new Error('Truncated PNG chunk.');
        const type = String.fromCharCode(...bytes.slice(p + 4, p + 8));
        if (type !== 'pHYs')
            parts.push(bytes.slice(p, p + n + 12));
        if (type === 'IHDR') {
            parts.push(chunk);
            inserted = true;
        }
        p += n + 12;
    }
    if (!inserted || p !== bytes.length)
        throw new Error('Malformed PNG.');
    const out = new Uint8Array(parts.reduce((n, b) => n + b.length, 0));
    let offset = 0;
    for (const part of parts) {
        out.set(part, offset);
        offset += part.length;
    }
    return out;
}
