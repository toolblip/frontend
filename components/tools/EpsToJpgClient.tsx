'use client';

import { useState, useRef, useEffect } from 'react';

interface EpsInfo {
  boundingBox: [number, number, number, number] | null;
  creator: string | null;
  title: string | null;
  creationDate: string | null;
  pages: string | null;
  languageLevel: string | null;
  previewFormat: 'WMF' | 'TIFF' | null;
  previewBytes: Uint8Array | null;
}

function readUint32LE(bytes: Uint8Array, offset: number): number {
  return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] * 0x1000000);
}

function parseEps(bytes: Uint8Array): EpsInfo {
  let psBytes = bytes;
  let previewFormat: 'WMF' | 'TIFF' | null = null;
  let previewBytes: Uint8Array | null = null;

  if (bytes.length >= 30 && bytes[0] === 0xc5 && bytes[1] === 0xd0 && bytes[2] === 0xd3 && bytes[3] === 0xc6) {
    const psStart = readUint32LE(bytes, 4);
    const psLength = readUint32LE(bytes, 8);
    const wmfStart = readUint32LE(bytes, 12);
    const wmfLength = readUint32LE(bytes, 16);
    const tiffStart = readUint32LE(bytes, 20);
    const tiffLength = readUint32LE(bytes, 24);
    psBytes = bytes.slice(psStart, psStart + psLength);
    if (tiffLength > 0) {
      previewFormat = 'TIFF';
      previewBytes = bytes.slice(tiffStart, tiffStart + tiffLength);
    } else if (wmfLength > 0) {
      previewFormat = 'WMF';
      previewBytes = bytes.slice(wmfStart, wmfStart + wmfLength);
    }
  }

  const text = new TextDecoder('latin1').decode(psBytes);
  const lines = text.split('\n').slice(0, 500);

  let boundingBox: [number, number, number, number] | null = null;
  let creator: string | null = null;
  let title: string | null = null;
  let creationDate: string | null = null;
  let pages: string | null = null;
  let languageLevel: string | null = null;

  for (const line of lines) {
    const bbMatch = line.match(/^%%(?:HiRes)?BoundingBox:\s*(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)/);
    if (bbMatch && !boundingBox) boundingBox = [parseFloat(bbMatch[1]), parseFloat(bbMatch[2]), parseFloat(bbMatch[3]), parseFloat(bbMatch[4])];
    const creatorMatch = line.match(/^%%Creator:\s*(.+)/);
    if (creatorMatch && !creator) creator = creatorMatch[1].trim();
    const titleMatch = line.match(/^%%Title:\s*(.+)/);
    if (titleMatch && !title) title = titleMatch[1].trim();
    const dateMatch = line.match(/^%%CreationDate:\s*(.+)/);
    if (dateMatch && !creationDate) creationDate = dateMatch[1].trim();
    const pagesMatch = line.match(/^%%Pages:\s*(.+)/);
    if (pagesMatch && !pages) pages = pagesMatch[1].trim();
    const levelMatch = line.match(/^%%LanguageLevel:\s*(.+)/);
    if (levelMatch && !languageLevel) languageLevel = levelMatch[1].trim();
    if (line.startsWith('%%EndComments')) break;
  }

  return { boundingBox, creator, title, creationDate, pages, languageLevel, previewFormat, previewBytes };
}

export default function EpsToJpgClient() {
  const [info, setInfo] = useState<EpsInfo | null>(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setInfo(null);
    if (!file.name.toLowerCase().endsWith('.eps')) {
      setError('Please choose a file with an .eps extension.');
      return;
    }
    const buffer = await file.arrayBuffer();
    const parsed = parseEps(new Uint8Array(buffer));
    if (!parsed.boundingBox) {
      setError('Could not find a %%BoundingBox in this file. It may not be a valid EPS document.');
      return;
    }
    setFileName(file.name);
    setInfo(parsed);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => loadFile(e.target.files?.[0]);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  useEffect(() => {
    if (!info?.boundingBox || !canvasRef.current) return;
    const [llx, lly, urx, ury] = info.boundingBox;
    const w = Math.max(1, urx - llx);
    const h = Math.max(1, ury - lly);
    const scale = Math.min(500 / w, 500 / h, 4);
    const canvas = canvasRef.current;
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
    ctx.fillStyle = '#3b82f6';
    ctx.font = '13px sans-serif';
    ctx.fillText(`${Math.round(w)} x ${Math.round(h)} pt`, 10, 20);
  }, [info]);

  const downloadJpg = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName.replace(/\.eps$/i, '') || 'bounding-box'}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/jpeg', 0.92);
  };

  const downloadPreview = () => {
    if (!info?.previewBytes) return;
    const blob = new Blob([info.previewBytes as unknown as BlobPart], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\.eps$/i, '') || 'preview'}.${info.previewFormat === 'TIFF' ? 'tif' : 'wmf'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Upload EPS File</span>
      </div>
      <div style={{ padding: 20 }}>
        <div
          className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span style={{ fontSize: 28 }}>🖼️</span>
          <span className="tb-v2-dropzone-text">Click or drag an .eps file here</span>
          <span className="tb-v2-dropzone-hint">Parsed entirely in your browser</span>
          <input ref={fileInputRef} type="file" accept=".eps" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
      </div>

      {error && <div className="tb-v2-banner-err" style={{ margin: '0 20px 20px' }}>{error}</div>}

      {info && (
        <div style={{ padding: '0 20px 20px' }}>
          <div className="tb-v2-banner" style={{ marginBottom: 16 }}>
            Browsers cannot interpret PostScript, so true rasterization of the artwork is not possible in-browser.
            Below is real metadata extracted from the file, plus a bounding-box-accurate reference image you can
            download as JPG. For full rasterization, use Ghostscript, Adobe Illustrator, or macOS Preview.
          </div>

          <div className="tb-v2-stats-grid" style={{ marginBottom: 16 }}>
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Bounding Box (pt)</div>
              <div style={{ fontFamily: 'var(--f-mono)' }}>{info.boundingBox!.join(', ')}</div>
            </div>
            {info.title && <div className="tb-v2-stat-pill"><div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Title</div><div>{info.title}</div></div>}
            {info.creator && <div className="tb-v2-stat-pill"><div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Creator</div><div>{info.creator}</div></div>}
            {info.creationDate && <div className="tb-v2-stat-pill"><div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Created</div><div>{info.creationDate}</div></div>}
            {info.pages && <div className="tb-v2-stat-pill"><div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Pages</div><div>{info.pages}</div></div>}
            {info.languageLevel && <div className="tb-v2-stat-pill"><div style={{ fontSize: 11, color: 'var(--fg-2)' }}>PS Level</div><div>{info.languageLevel}</div></div>}
          </div>

          <canvas ref={canvasRef} style={{ border: '1px solid var(--line)', maxWidth: '100%', background: '#fff' }} />

          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <button type="button" onClick={downloadJpg} className="tb-v2-btn tb-v2-btn-primary">Download Bounding-Box Preview as JPG</button>
            {info.previewBytes && (
              <button type="button" onClick={downloadPreview} className="tb-v2-btn-sm">
                Download Embedded {info.previewFormat} Preview
              </button>
            )}
          </div>
        </div>
      )}

      {!info && !error && <p className="tb-v2-empty" style={{ margin: '0 20px 20px' }}>Upload an EPS file to inspect it.</p>}
    </div>
  );
}
