'use client';

import { useState, useRef, useEffect } from 'react';

import ToolExampleClearActions from './ToolExampleClearActions';
import { readImage, exampleFile } from '@/lib/images-qa';

interface ColorInfo {
  bitDepth: string;
  colorType: string;
}

interface ImageDetails {
  format: string;
  mime: string;
  browserMime: string;
  width: number;
  height: number;
  sizeBytes: number;
  color?: ColorInfo;
}

function parseColorInfo(bytes: Uint8Array, format: string): ColorInfo | undefined {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  if (format === 'PNG' && bytes.length >= 26) {
    const bitDepth = bytes[24];
    const colorType = bytes[25];
    const colorTypeMap: Record<number, string> = {
      0: 'Grayscale', 2: 'RGB (Truecolor)', 3: 'Indexed / Palette', 4: 'Grayscale + Alpha', 6: 'RGBA (Truecolor + Alpha)',
    };
    return { bitDepth: `${bitDepth}-bit per channel`, colorType: colorTypeMap[colorType] || `Type ${colorType}` };
  }

  if (format === 'JPEG') {
    let offset = 2;
    while (offset + 4 <= bytes.length) {
      if (bytes[offset] !== 0xff) { offset++; continue; }
      const marker = bytes[offset + 1];
      if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
        offset += 2;
        continue;
      }
      const length = view.getUint16(offset + 2, false);
      const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isSof && offset + 4 + 6 <= bytes.length) {
        const precision = bytes[offset + 4];
        const numComponents = bytes[offset + 4 + 5];
        const colorTypeMap: Record<number, string> = { 1: 'Grayscale', 3: 'YCbCr (Color)', 4: 'CMYK' };
        return { bitDepth: `${precision}-bit per channel`, colorType: colorTypeMap[numComponents] || `${numComponents} channels` };
      }
      offset += 2 + length;
    }
    return undefined;
  }

  if (format === 'GIF' && bytes.length >= 11) {
    const packed = bytes[10];
    const hasGct = (packed & 0x80) !== 0;
    const colorResBits = ((packed >> 4) & 0x07) + 1;
    const gctBits = (packed & 0x07) + 1;
    const paletteSize = hasGct ? Math.pow(2, gctBits) : 0;
    return {
      bitDepth: `${colorResBits}-bit color resolution`,
      colorType: hasGct ? `Indexed palette (${paletteSize} colors)` : 'No global color table',
    };
  }

  if (format === 'BMP' && bytes.length >= 30) {
    const bitCount = view.getUint16(28, true);
    const colorTypeMap: Record<number, string> = {
      1: 'Monochrome (2 colors)', 4: '16 colors (indexed)', 8: '256 colors (indexed)',
      16: 'High color', 24: 'True color', 32: 'True color + Alpha',
    };
    return { bitDepth: `${bitCount}-bit`, colorType: colorTypeMap[bitCount] || `${bitCount}-bit` };
  }

  return undefined;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export default function DetectClient() {
  const [preview, setPreview] = useState('');
  const [details, setDetails] = useState<ImageDetails | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const request = useRef(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => () => { request.current++; }, []);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  const clear = () => { request.current++; setPreview(''); setDetails(null); setError(''); setLoading(false); if(fileInputRef.current) fileInputRef.current.value=''; };
  const loadFile = async (file: File | undefined) => {
    if (!file) return;
    clear(); const id = request.current; setLoading(true);
    try {
      const { img, mime, bytes } = await readImage(file);
      if(id !== request.current) return;
      const format = mime === 'image/jpeg' ? 'JPEG' : mime.split('/')[1].toUpperCase();
      setPreview(URL.createObjectURL(new Blob([bytes], {type:mime})));
      setDetails({format, mime, browserMime:file.type || 'unknown', width:img.naturalWidth, height:img.naturalHeight, sizeBytes:file.size, color:parseColorInfo(bytes,format)});
    } catch(e) { if(id === request.current) setError(e instanceof Error ? e.message : 'Could not read image.'); }
    finally { if(id === request.current) setLoading(false); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => loadFile(e.target.files?.[0]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="tb-v2-tool-card"><style jsx>{`input,textarea,select {max-width:100%;min-width:0} .tb-v2-tool-card {min-width:0;max-width:100%;overflow-wrap:anywhere} .tb-v2-tool-input-head {flex-wrap:wrap;gap:8px} .tb-v2-range-row {flex-wrap:wrap} .tb-v2-range {min-width:0;flex:1}`}</style>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Upload Image</span><ToolExampleClearActions onExample={() => loadFile(exampleFile())} onClear={clear} />
      </div>
      <div style={{ padding: 20 }}>
        <div
          className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span style={{ fontSize: 28 }}>🖼️</span>
          <span className="tb-v2-dropzone-text">Click or drag any image file here</span>
          <span className="tb-v2-dropzone-hint">Format is detected from file bytes, entirely in your browser</span>
          <input aria-label="Upload image" ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
        {loading && <p role="status">Reading image…</p>}
        {error && <div role="alert" className="tb-v2-banner tb-v2-banner-err" style={{ marginTop: 12 }}>{error}</div>}
        {preview && (
          <div style={{ marginTop: 12, maxHeight: 220, overflow: 'auto', borderRadius: 8, border: '1px solid var(--line)' }}>
            <img src={preview} alt="Uploaded" style={{ width: '100%', display: 'block' }} />
          </div>
        )}
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Detected Format</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {!details ? (
          <p className="tb-v2-empty">Upload an image above to detect its true format, dimensions, and color depth.</p>
        ) : (
          <div className="tb-v2-stats-grid">
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{details.format}</span>
              <span className="tb-v2-stat-pill-lbl">Format</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val" style={{ fontSize: 15 }}>{details.width} &times; {details.height}</span>
              <span className="tb-v2-stat-pill-lbl">Dimensions (px)</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val" style={{ fontSize: 15 }}>{formatBytes(details.sizeBytes)}</span>
              <span className="tb-v2-stat-pill-lbl">File Size</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val" style={{ fontSize: 13 }}>{details.mime}</span>
              <span className="tb-v2-stat-pill-lbl">Detected MIME</span>
            </div>
            {details.color && (
              <>
                <div className="tb-v2-stat-pill">
                  <span className="tb-v2-stat-pill-val" style={{ fontSize: 14 }}>{details.color.bitDepth}</span>
                  <span className="tb-v2-stat-pill-lbl">Bit Depth</span>
                </div>
                <div className="tb-v2-stat-pill">
                  <span className="tb-v2-stat-pill-val" style={{ fontSize: 13 }}>{details.color.colorType}</span>
                  <span className="tb-v2-stat-pill-lbl">Color Type</span>
                </div>
              </>
            )}
            {details.browserMime !== details.mime && (
              <div className="tb-v2-stat-pill" style={{ gridColumn: '1 / -1' }}>
                <span className="tb-v2-stat-pill-val" style={{ fontSize: 13, color: 'var(--red, #dc2626)' }}>Browser reports &ldquo;{details.browserMime}&rdquo;, file signature says &ldquo;{details.mime}&rdquo;</span>
                <span className="tb-v2-stat-pill-lbl">Mismatch Warning</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
