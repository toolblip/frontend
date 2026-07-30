'use client';

import { useState, useRef } from 'react';

const TAG_NAMES: Record<number, string> = {
  0x010f: 'Make',
  0x0110: 'Model',
  0x0112: 'Orientation',
  0x0132: 'DateTime',
  0x9003: 'DateTimeOriginal',
  0x829a: 'ExposureTime',
  0x829d: 'FNumber',
  0x8827: 'ISO',
  0x920a: 'FocalLength',
  0x8825: 'GPS IFD',
  0x0131: 'Software',
  0xa002: 'PixelXDimension',
  0xa003: 'PixelYDimension',
};

interface ExifTag { name: string; value: string; }

function readExifTags(bytes: Uint8Array): ExifTag[] {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return [];

  let offset = 2;
  let app1Start = -1;
  let app1Length = 0;
  while (offset < bytes.length - 4) {
    if (bytes[offset] !== 0xff) break;
    const marker = bytes[offset + 1];
    if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
    const segLength = (bytes[offset + 2] << 8) | bytes[offset + 3];
    if (marker === 0xe1) {
      const sig = new TextDecoder('ascii').decode(bytes.slice(offset + 4, offset + 10));
      if (sig === 'Exif\0\0') { app1Start = offset + 4; app1Length = segLength - 2; }
    }
    if (marker === 0xda) break;
    offset += 2 + segLength;
  }
  if (app1Start === -1) return [];

  const tiffStart = app1Start + 6;
  if (tiffStart + 8 > bytes.length) return [];
  const little = bytes[tiffStart] === 0x49 && bytes[tiffStart + 1] === 0x49;
  const read16 = (o: number) => (little ? bytes[o] | (bytes[o + 1] << 8) : (bytes[o] << 8) | bytes[o + 1]);
  const read32 = (o: number) => (little
    ? (bytes[o] | (bytes[o + 1] << 8) | (bytes[o + 2] << 16) | (bytes[o + 3] * 0x1000000)) >>> 0
    : ((bytes[o] * 0x1000000) | (bytes[o + 1] << 16) | (bytes[o + 2] << 8) | bytes[o + 3]) >>> 0);

  const ifdOffset = read32(tiffStart + 4);
  const ifdStart = tiffStart + ifdOffset;
  if (ifdStart + 2 > bytes.length) return [];
  const entryCount = read16(ifdStart);

  const tags: ExifTag[] = [];
  for (let i = 0; i < entryCount; i++) {
    const entryOffset = ifdStart + 2 + i * 12;
    if (entryOffset + 12 > bytes.length) break;
    const tagId = read16(entryOffset);
    const type = read16(entryOffset + 2);
    const count = read32(entryOffset + 4);
    const valueOffsetField = entryOffset + 8;

    const name = TAG_NAMES[tagId];
    if (!name) continue;

    let value = '';
    try {
      if (type === 2) {
        const strLen = count;
        const dataOffset = strLen <= 4 ? valueOffsetField : tiffStart + read32(valueOffsetField);
        value = new TextDecoder('ascii').decode(bytes.slice(dataOffset, dataOffset + strLen)).replace(/\0+$/, '');
      } else if (type === 3) {
        value = String(count <= 2 ? read16(valueOffsetField) : read16(tiffStart + read32(valueOffsetField)));
      } else if (type === 4) {
        value = String(read32(valueOffsetField));
      } else if (type === 5 && count === 1) {
        const dataOffset = tiffStart + read32(valueOffsetField);
        const num = read32(dataOffset);
        const den = read32(dataOffset + 4);
        value = den !== 0 ? (num / den).toFixed(4).replace(/\.?0+$/, '') : String(num);
      } else {
        continue;
      }
    } catch {
      continue;
    }
    if (value) tags.push({ name, value });
  }
  return tags;
}

export default function ExifRemoverClient() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);
  const [tags, setTags] = useState<ExifTag[]>([]);
  const [fileName, setFileName] = useState('');
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setCleanedUrl(null);
    setTags([]);
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      setTags(readExifTags(bytes));
      setFileName(file.name);
      setMimeType(file.type === 'image/png' ? 'image/png' : 'image/jpeg');
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      const img = new Image();
      const loaded: string = await new Promise((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) { reject(new Error('Canvas not supported in this browser.')); return; }
          ctx.drawImage(img, 0, 0);
          const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          resolve(canvas.toDataURL(outType, 0.95));
        };
        img.onerror = () => reject(new Error('Could not load this image.'));
        img.src = url;
      });
      setCleanedUrl(loaded);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not process this image.');
    } finally {
      setProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => loadFile(e.target.files?.[0]);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const downloadCleaned = () => {
    if (!cleanedUrl) return;
    const ext = mimeType === 'image/png' ? 'png' : 'jpg';
    const a = document.createElement('a');
    a.href = cleanedUrl;
    a.download = `${(fileName.replace(/\.[^.]+$/, '') || 'image')}-clean.${ext}`;
    a.click();
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Upload Image</span>
      </div>
      <div style={{ padding: 20 }}>
        <div
          className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span style={{ fontSize: 28 }}>🛡️</span>
          <span className="tb-v2-dropzone-text">{processing ? 'Processing...' : 'Click or drag an image here'}</span>
          <span className="tb-v2-dropzone-hint">Processed entirely in your browser, never uploaded</span>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
      </div>

      {error && <div className="tb-v2-banner-err" style={{ margin: '0 20px 20px' }}>{error}</div>}

      {imageUrl && !processing && (
        <div style={{ padding: '0 20px 20px' }}>
          <div className="tb-v2-stats-grid" style={{ marginBottom: 16 }}>
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Metadata Tags Found</div>
              <div>{tags.length}</div>
            </div>
          </div>

          {tags.length > 0 ? (
            <div className="tb-v2-tool-pre" style={{ marginBottom: 16 }}>
              {tags.map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ color: 'var(--fg-2)' }}>{t.name}</span>
                  <span style={{ fontFamily: 'var(--f-mono)' }}>{t.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="tb-v2-banner" style={{ marginBottom: 16 }}>
              No readable EXIF tags were found in this file (it may already be metadata-free, or use a format this
              parser doesn't decode). Re-encoding below still strips any embedded metadata as a safety measure.
            </div>
          )}

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--fg-2)', marginBottom: 4 }}>Original</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Original" style={{ maxWidth: 200, maxHeight: 200, border: '1px solid var(--line)', borderRadius: 4 }} />
            </div>
            {cleanedUrl && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--fg-2)', marginBottom: 4 }}>Cleaned</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cleanedUrl} alt="Cleaned" style={{ maxWidth: 200, maxHeight: 200, border: '1px solid var(--line)', borderRadius: 4 }} />
              </div>
            )}
          </div>

          <button type="button" onClick={downloadCleaned} className="tb-v2-btn tb-v2-btn-primary" disabled={!cleanedUrl}>
            Download Metadata-Free Image
          </button>
        </div>
      )}

      {!imageUrl && !error && !processing && <p className="tb-v2-empty" style={{ margin: '0 20px 20px' }}>Upload an image to inspect and remove its metadata.</p>}
    </div>
  );
}
