'use client';

import { useState, useRef } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

type AnchorX = 'left' | 'center' | 'right';
type AnchorY = 'top' | 'middle' | 'bottom';

interface TextOverlay {
  id: number;
  kind: 'text';
  page: number;
  text: string;
  fontSize: number;
  color: string;
  anchorX: AnchorX;
  anchorY: AnchorY;
  offsetX: number;
  offsetY: number;
}

interface ImageOverlay {
  id: number;
  kind: 'image';
  page: number;
  bytes: Uint8Array;
  format: 'png' | 'jpg';
  previewUrl: string;
  widthPt: number;
  anchorX: AnchorX;
  anchorY: AnchorY;
  offsetX: number;
  offsetY: number;
}

type Overlay = TextOverlay | ImageOverlay;

function hexToRgb01(hex: string): [number, number, number] {
  const m = hex.replace('#', '');
  const r = parseInt(m.substring(0, 2), 16) / 255;
  const g = parseInt(m.substring(2, 4), 16) / 255;
  const b = parseInt(m.substring(4, 6), 16) / 255;
  return [r || 0, g || 0, b || 0];
}

function markerPercent(anchorX: AnchorX, anchorY: AnchorY, offsetX: number, offsetY: number, w: number, h: number) {
  const xPct = anchorX === 'left' ? (offsetX / w) * 100 : anchorX === 'right' ? 100 - (offsetX / w) * 100 : 50;
  const yPct = anchorY === 'top' ? (offsetY / h) * 100 : anchorY === 'bottom' ? 100 - (offsetY / h) * 100 : 50;
  return { xPct, yPct };
}

let nextOverlayId = 1;

export default function EditClient() {
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState('');
  const [pageSizes, setPageSizes] = useState<{ width: number; height: number }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');

  const [draftText, setDraftText] = useState('New text');
  const [draftFontSize, setDraftFontSize] = useState(24);
  const [draftColor, setDraftColor] = useState('#111111');
  const [anchorX, setAnchorX] = useState<AnchorX>('left');
  const [anchorY, setAnchorY] = useState<AnchorY>('top');
  const [offsetX, setOffsetX] = useState(40);
  const [offsetY, setOffsetY] = useState(40);
  const [imageWidthPt, setImageWidthPt] = useState(150);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const loadPdf = async (bytes: Uint8Array, name: string) => {
    setError('');
    try {
      const doc = await PDFDocument.load(bytes);
      const sizes = doc.getPages().map(p => p.getSize());
      setFileBytes(bytes);
      setFileName(name);
      setPageSizes(sizes);
      setCurrentPage(1);
      setOverlays([]);
      setStatus('idle');
    } catch {
      setError('Could not read this file as a PDF. Make sure it is a valid, unencrypted PDF.');
    }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const buffer = await file.arrayBuffer();
    await loadPdf(new Uint8Array(buffer), file.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const loadExample = async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([612, 792]);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    page.drawText('Sample PDF Document', { x: 60, y: 720, size: 22, font });
    page.drawText('This is a placeholder page for practicing edits.', { x: 60, y: 690, size: 12, font, color: rgb(0.4, 0.4, 0.4) });
    const bytes = await doc.save();
    await loadPdf(bytes, 'sample.pdf');
  };

  const addTextOverlay = () => {
    if (!draftText.trim() || !fileBytes) return;
    setOverlays(o => [...o, {
      id: nextOverlayId++, kind: 'text', page: currentPage, text: draftText,
      fontSize: draftFontSize, color: draftColor, anchorX, anchorY, offsetX, offsetY,
    }]);
  };

  const handleImageFile = async (file: File | undefined) => {
    if (!file || !fileBytes) return;
    const format = file.type === 'image/png' ? 'png' : (file.type === 'image/jpeg' ? 'jpg' : null);
    if (!format) { setError('Image overlays must be a PNG or JPG file.'); return; }
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const previewUrl = URL.createObjectURL(file);
    setOverlays(o => [...o, {
      id: nextOverlayId++, kind: 'image', page: currentPage, bytes, format, previewUrl,
      widthPt: imageWidthPt, anchorX, anchorY, offsetX, offsetY,
    }]);
  };

  const removeOverlay = (id: number) => setOverlays(o => o.filter(x => x.id !== id));

  const applyAndDownload = async () => {
    if (!fileBytes) return;
    setStatus('processing');
    setError('');
    try {
      const doc = await PDFDocument.load(fileBytes);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();

      for (const ov of overlays) {
        const page = pages[ov.page - 1];
        if (!page) continue;
        const { width, height } = page.getSize();

        if (ov.kind === 'text') {
          const textWidth = font.widthOfTextAtSize(ov.text, ov.fontSize);
          const x = ov.anchorX === 'left' ? ov.offsetX : ov.anchorX === 'right' ? width - ov.offsetX - textWidth : (width - textWidth) / 2;
          const y = ov.anchorY === 'top' ? height - ov.offsetY - ov.fontSize : ov.anchorY === 'bottom' ? ov.offsetY : (height - ov.fontSize) / 2;
          const [r, g, b] = hexToRgb01(ov.color);
          page.drawText(ov.text, { x, y, size: ov.fontSize, font, color: rgb(r, g, b) });
        } else {
          const img = ov.format === 'png' ? await doc.embedPng(ov.bytes) : await doc.embedJpg(ov.bytes);
          const scale = ov.widthPt / img.width;
          const drawWidth = ov.widthPt;
          const drawHeight = img.height * scale;
          const x = ov.anchorX === 'left' ? ov.offsetX : ov.anchorX === 'right' ? width - ov.offsetX - drawWidth : (width - drawWidth) / 2;
          const y = ov.anchorY === 'top' ? height - ov.offsetY - drawHeight : ov.anchorY === 'bottom' ? ov.offsetY : (height - drawHeight) / 2;
          page.drawImage(img, { x, y, width: drawWidth, height: drawHeight });
        }
      }

      const outBytes = await doc.save();
      const blob = new Blob([outBytes as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName ? `edited-${fileName}` : 'edited.pdf';
      a.click();
      URL.revokeObjectURL(url);
      setStatus('done');
    } catch {
      setError('Something went wrong applying your edits. Try a different image or reload the PDF.');
      setStatus('idle');
    }
  };

  const pageSize = pageSizes[currentPage - 1] || { width: 612, height: 792 };
  const pageOverlays = overlays.filter(o => o.page === currentPage);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">PDF File</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <div style={{ padding: 20 }}>
        <div
          className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span style={{ fontSize: 28 }}>📄</span>
          <span className="tb-v2-dropzone-text">Click or drag a PDF here</span>
          <span className="tb-v2-dropzone-hint">Text and image overlays are baked into your actual PDF, entirely in your browser</span>
          <input ref={fileInputRef} type="file" accept="application/pdf" onChange={(e) => handleFile(e.target.files?.[0])} style={{ display: 'none' }} />
        </div>
        {error && <div className="tb-v2-banner tb-v2-banner-err" style={{ marginTop: 12 }}>{error}</div>}
      </div>

      {fileBytes && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">{fileName} &middot; {pageSizes.length} page{pageSizes.length === 1 ? '' : 's'}</span>
          </div>
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <button type="button" className="tb-v2-btn-sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>&larr; Prev</button>
              <span style={{ fontSize: 13 }}>Editing page {currentPage} of {pageSizes.length}</span>
              <button type="button" className="tb-v2-btn-sm" disabled={currentPage >= pageSizes.length} onClick={() => setCurrentPage(p => p + 1)}>Next &rarr;</button>
            </div>

            <div style={{
              position: 'relative', width: '100%', maxWidth: 320,
              aspectRatio: `${pageSize.width} / ${pageSize.height}`,
              background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 8, marginBottom: 16,
            }}>
              {pageOverlays.map(ov => {
                const { xPct, yPct } = markerPercent(ov.anchorX, ov.anchorY, ov.offsetX, ov.offsetY, pageSize.width, pageSize.height);
                return (
                  <div
                    key={ov.id}
                    title={ov.kind === 'text' ? ov.text : 'Image overlay'}
                    style={{
                      position: 'absolute', left: `${xPct}%`, top: `${yPct}%`, transform: 'translate(-50%, -50%)',
                      width: 10, height: 10, borderRadius: '50%', background: 'var(--red, #dc2626)',
                      border: '2px solid var(--surface-1, #fff)',
                    }}
                  />
                );
              })}
            </div>
            <p style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: -10, marginBottom: 16 }}>
              Position preview only, dots mark where each overlay will land &middot; page content itself is not shown here
            </p>

            <div className="tb-v2-option-group" style={{ marginBottom: 16 }}>
              <label className="tb-v2-tool-label">Add Text</label>
              <input type="text" value={draftText} onChange={e => setDraftText(e.target.value)} className="tb-v2-input" placeholder="Text to add" style={{ marginBottom: 8 }} />
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <label style={{ fontSize: 12 }}>Size <input type="number" min={6} max={200} value={draftFontSize} onChange={e => setDraftFontSize(Number(e.target.value) || 24)} className="tb-v2-input" style={{ width: 70 }} /></label>
                <label style={{ fontSize: 12 }}>Color <input type="color" value={draftColor} onChange={e => setDraftColor(e.target.value)} style={{ verticalAlign: 'middle' }} /></label>
              </div>
              <button type="button" onClick={addTextOverlay} className="tb-v2-btn tb-v2-btn-primary" style={{ marginTop: 10 }}>Add Text Overlay</button>
            </div>

            <div className="tb-v2-option-group" style={{ marginBottom: 16 }}>
              <label className="tb-v2-tool-label">Add Image</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 12 }}>Width (pt) <input type="number" min={10} max={600} value={imageWidthPt} onChange={e => setImageWidthPt(Number(e.target.value) || 150)} className="tb-v2-input" style={{ width: 80 }} /></label>
                <button type="button" onClick={() => imageInputRef.current?.click()} className="tb-v2-btn-sm">Choose Image&hellip;</button>
                <input ref={imageInputRef} type="file" accept="image/png,image/jpeg" onChange={e => handleImageFile(e.target.files?.[0])} style={{ display: 'none' }} />
              </div>
            </div>

            <div className="tb-v2-option-group" style={{ marginBottom: 16 }}>
              <label className="tb-v2-tool-label">Anchor Position (applies to next overlay added)</label>
              <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                {(['left', 'center', 'right'] as AnchorX[]).map(a => (
                  <button key={a} type="button" onClick={() => setAnchorX(a)} className={`tb-v2-mode-tab ${anchorX === a ? 'on' : ''}`}>{a}</button>
                ))}
                {(['top', 'middle', 'bottom'] as AnchorY[]).map(a => (
                  <button key={a} type="button" onClick={() => setAnchorY(a)} className={`tb-v2-mode-tab ${anchorY === a ? 'on' : ''}`}>{a}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <label style={{ fontSize: 12 }}>Offset X (pt) <input type="number" value={offsetX} onChange={e => setOffsetX(Number(e.target.value) || 0)} className="tb-v2-input" style={{ width: 70 }} /></label>
                <label style={{ fontSize: 12 }}>Offset Y (pt) <input type="number" value={offsetY} onChange={e => setOffsetY(Number(e.target.value) || 0)} className="tb-v2-input" style={{ width: 70 }} /></label>
              </div>
            </div>

            {overlays.length > 0 && (
              <div className="tb-v2-option-group" style={{ marginBottom: 16 }}>
                <label className="tb-v2-tool-label">Overlays ({overlays.length})</label>
                {overlays.map(ov => (
                  <div key={ov.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 13 }}>
                    <span style={{ flex: 1 }}>
                      Page {ov.page} &middot; {ov.kind === 'text' ? `"${ov.text}"` : 'Image'} &middot; {ov.anchorX}/{ov.anchorY}
                    </span>
                    <button type="button" onClick={() => removeOverlay(ov.id)} className="tb-v2-btn-sm">Remove</button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={applyAndDownload}
              disabled={overlays.length === 0 || status === 'processing'}
              className="tb-v2-btn tb-v2-btn-primary"
              style={{ width: '100%' }}
            >
              {status === 'processing' ? 'Applying edits...' : 'Apply Edits & Download PDF'}
            </button>
            {status === 'done' && (
              <div className="tb-v2-banner" style={{ marginTop: 12 }}>Edited PDF downloaded.</div>
            )}
          </div>
        </>
      )}

      {!fileBytes && (
        <p className="tb-v2-empty">Upload a PDF above, then add text or image overlays and download the edited file.</p>
      )}
    </div>
  );
}
