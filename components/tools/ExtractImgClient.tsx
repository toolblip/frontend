'use client';

import { useState, useRef, useEffect } from 'react';
import { PDFDocument, PDFName, PDFDict, PDFArray, PDFRawStream, PDFRef, PDFNumber, PDFString, PDFHexString, decodePDFRawStream } from 'pdf-lib';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

let crcTable: number[] | null = null;
function getCrcTable(): number[] {
  if (crcTable) return crcTable;
  const table = new Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c >>> 0;
  }
  crcTable = table;
  return table;
}

function crc32(bytes: Uint8Array): number {
  const table = getCrcTable();
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) crc = table[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function buildZip(files: { name: string; data: Uint8Array }[]): Uint8Array {
  const localParts: Uint8Array[] = [];
  const centralRecords: { nameBytes: Uint8Array; crc: number; size: number; offset: number }[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = new TextEncoder().encode(file.name);
    const crc = crc32(file.data);
    const size = file.data.length;

    const local = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(local.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, size, true);
    view.setUint32(22, size, true);
    view.setUint16(26, nameBytes.length, true);
    view.setUint16(28, 0, true);
    local.set(nameBytes, 30);

    localParts.push(local, file.data);
    centralRecords.push({ nameBytes, crc, size, offset });
    offset += local.length + file.data.length;
  }

  const centralDirStart = offset;
  const centralParts: Uint8Array[] = [];
  for (const rec of centralRecords) {
    const central = new Uint8Array(46 + rec.nameBytes.length);
    const view = new DataView(central.buffer);
    view.setUint32(0, 0x02014b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 20, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint16(14, 0, true);
    view.setUint32(16, rec.crc, true);
    view.setUint32(20, rec.size, true);
    view.setUint32(24, rec.size, true);
    view.setUint16(28, rec.nameBytes.length, true);
    view.setUint16(30, 0, true);
    view.setUint16(32, 0, true);
    view.setUint16(34, 0, true);
    view.setUint16(36, 0, true);
    view.setUint32(38, 0, true);
    view.setUint32(42, rec.offset, true);
    central.set(rec.nameBytes, 46);
    centralParts.push(central);
    offset += central.length;
  }
  const centralDirSize = offset - centralDirStart;

  const eocd = new Uint8Array(22);
  const eview = new DataView(eocd.buffer);
  eview.setUint32(0, 0x06054b50, true);
  eview.setUint16(8, centralRecords.length, true);
  eview.setUint16(10, centralRecords.length, true);
  eview.setUint32(12, centralDirSize, true);
  eview.setUint32(16, centralDirStart, true);

  const result = new Uint8Array(offset + 22);
  let pos = 0;
  for (const part of [...localParts, ...centralParts, eocd]) { result.set(part, pos); pos += part.length; }
  return result;
}

interface ExtractedImage {
  name: string;
  pageNumber: number;
  width: number;
  height: number;
  previewUrl: string;
  data: Uint8Array;
  ext: 'jpg' | 'png';
}

function resolve(doc: PDFDocument, obj: unknown) {
  return obj instanceof PDFRef ? doc.context.lookup(obj) : obj;
}

async function rawToPng(rawBytes: Uint8Array, width: number, height: number, mode: 'gray' | 'rgb' | 'cmyk' | 'indexed', palette?: Uint8Array): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const imageData = ctx.createImageData(width, height);
  const out = imageData.data;
  const total = width * height;

  if (mode === 'rgb') {
    for (let i = 0, p = 0; i < total; i++, p += 3) {
      out[i * 4] = rawBytes[p] || 0; out[i * 4 + 1] = rawBytes[p + 1] || 0; out[i * 4 + 2] = rawBytes[p + 2] || 0; out[i * 4 + 3] = 255;
    }
  } else if (mode === 'gray') {
    for (let i = 0; i < total; i++) {
      const v = rawBytes[i] || 0;
      out[i * 4] = v; out[i * 4 + 1] = v; out[i * 4 + 2] = v; out[i * 4 + 3] = 255;
    }
  } else if (mode === 'cmyk') {
    for (let i = 0, p = 0; i < total; i++, p += 4) {
      const c = (rawBytes[p] || 0) / 255, m = (rawBytes[p + 1] || 0) / 255, y = (rawBytes[p + 2] || 0) / 255, k = (rawBytes[p + 3] || 0) / 255;
      out[i * 4] = 255 * (1 - c) * (1 - k);
      out[i * 4 + 1] = 255 * (1 - m) * (1 - k);
      out[i * 4 + 2] = 255 * (1 - y) * (1 - k);
      out[i * 4 + 3] = 255;
    }
  } else if (mode === 'indexed' && palette) {
    for (let i = 0; i < total; i++) {
      const idx = (rawBytes[i] || 0) * 3;
      out[i * 4] = palette[idx] || 0; out[i * 4 + 1] = palette[idx + 1] || 0; out[i * 4 + 2] = palette[idx + 2] || 0; out[i * 4 + 3] = 255;
    }
  } else {
    return null;
  }

  ctx.putImageData(imageData, 0, 0);
  return new Promise(resolve => canvas.toBlob(blob => resolve(blob), 'image/png'));
}

async function extractImages(bytes: Uint8Array): Promise<{ images: ExtractedImage[]; skipped: number }> {
  const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const images: ExtractedImage[] = [];
  const seen = new Set<string>();
  let skipped = 0;
  let counter = 0;

  const pages = pdfDoc.getPages();
  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    const resources = pages[pageIndex].node.Resources();
    if (!resources) continue;
    const xObjects = resources.lookup(PDFName.of('XObject'));
    if (!(xObjects instanceof PDFDict)) continue;

    for (const [, value] of xObjects.entries()) {
      if (!(value instanceof PDFRef)) continue;
      if (seen.has(value.tag)) continue;
      seen.add(value.tag);

      try {
        const xObject = pdfDoc.context.lookup(value);
        if (!(xObject instanceof PDFRawStream)) continue;
        const subtype = resolve(pdfDoc, xObject.dict.lookup(PDFName.of('Subtype')));
        if (subtype !== PDFName.of('Image')) continue;

        const widthObj = resolve(pdfDoc, xObject.dict.lookup(PDFName.of('Width')));
        const heightObj = resolve(pdfDoc, xObject.dict.lookup(PDFName.of('Height')));
        const width = widthObj instanceof PDFNumber ? widthObj.asNumber() : 0;
        const height = heightObj instanceof PDFNumber ? heightObj.asNumber() : 0;
        if (!width || !height) { skipped++; continue; }

        const filter = resolve(pdfDoc, xObject.dict.lookup(PDFName.of('Filter')));
        const isSingleDct = filter === PDFName.of('DCTDecode');

        counter++;
        if (isSingleDct) {
          const previewUrl = URL.createObjectURL(new Blob([xObject.contents as unknown as BlobPart], { type: 'image/jpeg' }));
          images.push({ name: `image-${counter}.jpg`, pageNumber: pageIndex + 1, width, height, previewUrl, data: xObject.contents, ext: 'jpg' });
          continue;
        }

        if (filter instanceof PDFArray) { skipped++; continue; }
        if (filter && filter !== PDFName.of('FlateDecode') && filter !== PDFName.of('LZWDecode') && filter !== PDFName.of('ASCII85Decode') && filter !== PDFName.of('ASCIIHexDecode') && filter !== PDFName.of('RunLengthDecode')) {
          skipped++; continue;
        }

        const bpcObj = resolve(pdfDoc, xObject.dict.lookup(PDFName.of('BitsPerComponent')));
        const bpc = bpcObj instanceof PDFNumber ? bpcObj.asNumber() : 8;
        if (bpc !== 8) { skipped++; continue; }

        const decoded = decodePDFRawStream(xObject).decode();
        const colorSpace = resolve(pdfDoc, xObject.dict.lookup(PDFName.of('ColorSpace')));

        let mode: 'gray' | 'rgb' | 'cmyk' | 'indexed' | null = null;
        let palette: Uint8Array | undefined;

        if (colorSpace === PDFName.of('DeviceGray')) mode = 'gray';
        else if (colorSpace === PDFName.of('DeviceRGB')) mode = 'rgb';
        else if (colorSpace === PDFName.of('DeviceCMYK')) mode = 'cmyk';
        else if (colorSpace instanceof PDFArray && colorSpace.size() >= 4) {
          const base = resolve(pdfDoc, colorSpace.get(0));
          const family = resolve(pdfDoc, colorSpace.get(1));
          const lookup = resolve(pdfDoc, colorSpace.get(3));
          if (base === PDFName.of('Indexed') && family === PDFName.of('DeviceRGB') && (lookup instanceof PDFString || lookup instanceof PDFHexString)) {
            mode = 'indexed';
            palette = lookup.asBytes ? lookup.asBytes() : undefined;
          }
        }

        if (!mode) { skipped++; continue; }
        const pngBlob = await rawToPng(decoded, width, height, mode, palette);
        if (!pngBlob) { skipped++; continue; }
        const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
        const previewUrl = URL.createObjectURL(pngBlob);
        images.push({ name: `image-${counter}.png`, pageNumber: pageIndex + 1, width, height, previewUrl, data: pngBytes, ext: 'png' });
      } catch {
        skipped++;
      }
    }
  }

  return { images, skipped };
}

export default function ExtractImgClient() {
  const [images, setImages] = useState<ExtractedImage[]>([]);
  const [skipped, setSkipped] = useState(0);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setImages([]); setSkipped(0); setFileName(''); setError(''); setLoading(false); setLoaded(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => () => { images.forEach(img => URL.revokeObjectURL(img.previewUrl)); }, [images]);

  const loadExample = async () => {
    setError(''); setLoading(true);
    try {
      const canvas = document.createElement('canvas'); canvas.width = 120; canvas.height = 80;
      const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Could not create the sample image.');
      ctx.fillStyle = '#2563eb'; ctx.fillRect(0, 0, 120, 80); ctx.fillStyle = '#facc15'; ctx.fillRect(20, 20, 80, 40);
      const dataUrl = canvas.toDataURL('image/png'); const response = await fetch(dataUrl); const pngBytes = new Uint8Array(await response.arrayBuffer());
      const doc = await PDFDocument.create(); const page = doc.addPage([360, 240]); const image = await doc.embedPng(pngBytes); page.drawImage(image, { x: 120, y: 80, width: 120, height: 80 });
      await loadFile(new File([await doc.save() as BlobPart], 'extract-images-sample.pdf', { type: 'application/pdf' }));
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not create the sample PDF.'); setLoading(false); }
  };

  const loadFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setImages([]);
    setSkipped(0);
    setLoaded(false);
    if (!/\.pdf$/i.test(file.name)) {
      setError('Please choose a file with a .pdf extension.');
      return;
    }
    setLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const { images: found, skipped: skippedCount } = await extractImages(new Uint8Array(buffer));
      setFileName(file.name);
      setImages(found);
      setSkipped(skippedCount);
      setLoaded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read this PDF file.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => loadFile(e.target.files?.[0]);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const downloadOne = (img: ExtractedImage) => {
    const a = document.createElement('a');
    a.href = img.previewUrl;
    a.download = img.name;
    a.click();
  };

  const downloadZip = () => {
    const zipBytes = buildZip(images.map(img => ({ name: img.name, data: img.data })));
    const blob = new Blob([zipBytes as unknown as BlobPart], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(fileName.replace(/\.pdf$/i, '') || 'images')}-images.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ margin: '0 20px 12px' }}><span className="tb-v2-tool-label">PDF File</span><ToolExampleClearActions onExample={() => void loadExample()} onClear={clearAll} canClear={Boolean(images.length || loaded || error || fileName)} exampleCount={1} /></div>
      <div className="tb-v2-banner" style={{ margin: 20 }}>
        JPEG images embedded in the PDF are extracted directly. Other raster images (grayscale, RGB, CMYK, or
        indexed-color) are reconstructed as PNG. JPEG2000, CCITT fax, and other uncommon encodings can't be decoded
        by this tool and are skipped, not faked.
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <div
          className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span style={{ fontSize: 28 }}>📄</span>
          <span className="tb-v2-dropzone-text">{loading ? 'Extracting...' : 'Click or drag a PDF file here'}</span>
          <span className="tb-v2-dropzone-hint">Processed entirely in your browser</span>
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
      </div>

      {error && <div className="tb-v2-banner-err" style={{ margin: '0 20px 20px' }}>{error}</div>}

      {loaded && (
        <div style={{ padding: '0 20px 20px' }}>
          <div className="tb-v2-stats-grid" style={{ marginBottom: 16 }}>
            <div className="tb-v2-stat-pill"><div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Images Extracted</div><div>{images.length}</div></div>
            {skipped > 0 && <div className="tb-v2-stat-pill"><div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Skipped (unsupported)</div><div>{skipped}</div></div>}
          </div>

          {images.length > 0 && (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                {images.map((img, i) => (
                  <div key={i} style={{ width: 140, border: '1px solid var(--line)', borderRadius: 6, padding: 8 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.previewUrl} alt={img.name} style={{ width: '100%', height: 100, objectFit: 'contain', marginBottom: 6 }} />
                    <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Page {img.pageNumber} &middot; {img.width}x{img.height}</div>
                    <button type="button" onClick={() => downloadOne(img)} className="tb-v2-btn-sm" style={{ marginTop: 6, width: '100%' }}>Download</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={downloadZip} className="tb-v2-btn tb-v2-btn-primary">Download All as ZIP</button>
            </>
          )}

          {images.length === 0 && skipped === 0 && (
            <p className="tb-v2-empty">No embedded images were found in this PDF.</p>
          )}
        </div>
      )}

      {!loaded && !error && !loading && <p className="tb-v2-empty" style={{ margin: '0 20px 20px' }}>Upload a PDF file to extract its embedded images.</p>}
    </div>
  );
}
