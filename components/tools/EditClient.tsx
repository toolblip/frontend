'use client';

import { useEffect, useRef, useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

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

interface TextEditOverlay {
  id: number;
  kind: 'text-edit';
  sourceId: string;
  page: number;
  text: string;
  fontSize: number;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EraseOverlay {
  id: number;
  kind: 'erase';
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PdfTextItem {
  id: string;
  page: number;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
}

type Overlay = TextOverlay | ImageOverlay | TextEditOverlay | EraseOverlay;
type ActiveTool = 'text' | 'image' | 'erase' | null;

interface PendingImage {
  bytes: Uint8Array;
  format: 'png' | 'jpg';
  previewUrl: string;
}

function hexToRgb01(hex: string): [number, number, number] {
  const m = hex.replace('#', '');
  const r = parseInt(m.substring(0, 2), 16) / 255;
  const g = parseInt(m.substring(2, 4), 16) / 255;
  const b = parseInt(m.substring(4, 6), 16) / 255;
  return [r || 0, g || 0, b || 0];
}

function markerPercent(anchorX: AnchorX, anchorY: AnchorY, offsetX: number, offsetY: number, w: number, h: number) {
  const xPct = anchorX === 'left' ? (offsetX / w) * 100 : anchorX === 'right' ? 100 - (offsetX / w) * 100 : 50 + (offsetX / w) * 100;
  const yPct = anchorY === 'top' ? (offsetY / h) * 100 : anchorY === 'bottom' ? 100 - (offsetY / h) * 100 : 50 + (offsetY / h) * 100;
  return { xPct, yPct };
}

const isPdfFile = (file: File) => file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

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
  const [preview, setPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [previewViewportSize, setPreviewViewportSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [textItems, setTextItems] = useState<PdfTextItem[]>([]);
  const [selectedText, setSelectedText] = useState<PdfTextItem | null>(null);
  const [eraseStart, setEraseStart] = useState<{ x: number; y: number } | null>(null);
  const [eraseDraft, setEraseDraft] = useState<EraseOverlay | null>(null);

  const [draftText, setDraftText] = useState('New text');
  const [draftFontSize, setDraftFontSize] = useState(24);
  const [draftColor, setDraftColor] = useState('#111111');
  const [imageWidthPt, setImageWidthPt] = useState(150);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const previewViewportRef = useRef<HTMLDivElement>(null);
  const loadVersionRef = useRef(0);

  const resetDocument = () => {
    overlays.forEach(ov => { if (ov.kind === 'image') URL.revokeObjectURL(ov.previewUrl); });
    if (pendingImage) URL.revokeObjectURL(pendingImage.previewUrl);
    setFileBytes(null); setFileName(''); setPageSizes([]); setCurrentPage(1); setOverlays([]); setIsDragging(false); setError(''); setStatus('idle');
    setActiveTool(null); setPendingImage(null); setTextItems([]); setSelectedText(null); setEraseStart(null); setEraseDraft(null); setZoom(1);
  };

  const clearAll = () => {
    loadVersionRef.current += 1;
    resetDocument();
    setDraftText('New text'); setDraftFontSize(24); setDraftColor('#111111'); setImageWidthPt(150);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const loadPdf = async (bytes: Uint8Array, name: string, requestId = ++loadVersionRef.current) => {
    resetDocument();
    setError('');
    try {
      const doc = await PDFDocument.load(bytes);
      const sizes = doc.getPages().map(p => p.getSize());
      if (sizes.length === 0) throw new Error('The PDF has no pages.');
      if (requestId !== loadVersionRef.current) return;
      setFileBytes(bytes);
      setFileName(name);
      setPageSizes(sizes);
      setCurrentPage(1);
      setOverlays([]);
      setPreview(null);
      setPreviewFailed(false);
      setZoom(1);
      setStatus('idle');
    } catch {
      if (requestId === loadVersionRef.current) setError('Could not read this file as a PDF. Make sure it is a valid, unencrypted PDF.');
    }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const requestId = ++loadVersionRef.current;
    resetDocument();
    if (!isPdfFile(file)) {
      setError('Please choose a PDF file.');
      return;
    }
    try {
      const buffer = await file.arrayBuffer();
      if (requestId !== loadVersionRef.current) return;
      await loadPdf(new Uint8Array(buffer), file.name, requestId);
    } catch {
      if (requestId === loadVersionRef.current) setError('Could not read the selected PDF file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const loadExample = async () => {
    const requestId = ++loadVersionRef.current;
    const doc = await PDFDocument.create();
    const page = doc.addPage([612, 792]);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    page.drawText('Sample PDF Document', { x: 60, y: 720, size: 22, font });
    page.drawText('This is a placeholder page for practicing edits.', { x: 60, y: 690, size: 12, font, color: rgb(0.4, 0.4, 0.4) });
    const bytes = await doc.save();
    if (requestId === loadVersionRef.current) await loadPdf(bytes, 'sample.pdf', requestId);
  };

  const addTextOverlay = (x: number, y: number) => {
    if (!draftText.trim() || !fileBytes) return;
    setOverlays(o => [...o, {
      id: nextOverlayId++, kind: 'text', page: currentPage, text: draftText,
      fontSize: draftFontSize, color: draftColor, anchorX: 'left', anchorY: 'top', offsetX: x, offsetY: y,
    }]);
    setActiveTool(null);
    setStatus('idle');
  };

  const saveSelectedText = () => {
    if (!selectedText || !draftText.trim() || !fileBytes) return;
    setOverlays(current => [
      ...current.filter(ov => ov.kind !== 'text-edit' || ov.sourceId !== selectedText.id),
      {
        id: nextOverlayId++, kind: 'text-edit', sourceId: selectedText.id, page: currentPage,
        text: draftText.trim(), fontSize: draftFontSize, color: draftColor,
        x: selectedText.x, y: selectedText.y, width: selectedText.width, height: selectedText.height,
      },
    ]);
    setSelectedText(null);
    setActiveTool(null);
    setStatus('idle');
  };

  const removeSelectedText = () => {
    if (!selectedText || !fileBytes) return;
    setOverlays(current => [
      ...current.filter(ov => ov.kind !== 'text-edit' || ov.sourceId !== selectedText.id),
      { id: nextOverlayId++, kind: 'erase', page: currentPage, x: selectedText.x, y: selectedText.y, width: selectedText.width, height: selectedText.height },
    ]);
    setSelectedText(null);
    setActiveTool(null);
    setStatus('idle');
  };

  const handleImageFile = async (file: File | undefined) => {
    if (!file || !fileBytes) return;
    const requestId = loadVersionRef.current;
    const format = file.type === 'image/png' ? 'png' : (file.type === 'image/jpeg' ? 'jpg' : null);
    if (!format) { setError('Image overlays must be a PNG or JPG file.'); return; }
    const buffer = await file.arrayBuffer();
    if (requestId !== loadVersionRef.current || !fileBytes) return;
    const bytes = new Uint8Array(buffer);
    const previewUrl = URL.createObjectURL(file);
    if (pendingImage) URL.revokeObjectURL(pendingImage.previewUrl);
    setPendingImage({ bytes, format, previewUrl });
    setActiveTool('image');
    setStatus('idle');
  };

  const pageCoordinates = (element: HTMLDivElement, clientX: number, clientY: number) => {
    const rect = element.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(pageSize.width, ((clientX - rect.left) / rect.width) * pageSize.width)),
      y: Math.max(0, Math.min(pageSize.height, ((clientY - rect.top) / rect.height) * pageSize.height)),
    };
  };

  const selectTextItem = (item: PdfTextItem) => {
    setSelectedText(item);
    setDraftText(item.text);
    setDraftFontSize(Math.round(item.fontSize));
    setDraftColor('#111111');
    setActiveTool(null);
  };

  const handlePreviewClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!activeTool || activeTool === 'erase' || !fileBytes) return;
    const { x, y } = pageCoordinates(event.currentTarget, event.clientX, event.clientY);

    if (activeTool === 'text') {
      addTextOverlay(x, y);
      return;
    }

    if (pendingImage) {
      setOverlays(o => [...o, {
        id: nextOverlayId++, kind: 'image', page: currentPage, bytes: pendingImage.bytes, format: pendingImage.format,
        previewUrl: pendingImage.previewUrl, widthPt: imageWidthPt, anchorX: 'left', anchorY: 'top', offsetX: x, offsetY: y,
      }]);
      setPendingImage(null);
      setActiveTool(null);
      setStatus('idle');
    }
  };

  const handlePreviewPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activeTool !== 'erase' || !fileBytes) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setEraseStart(pageCoordinates(event.currentTarget, event.clientX, event.clientY));
    setEraseDraft(null);
  };

  const handlePreviewPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activeTool !== 'erase' || !eraseStart || !fileBytes) return;
    const end = pageCoordinates(event.currentTarget, event.clientX, event.clientY);
    setEraseDraft({
      id: 0, kind: 'erase', page: currentPage,
      x: Math.min(eraseStart.x, end.x), y: Math.min(eraseStart.y, end.y),
      width: Math.max(4, Math.abs(end.x - eraseStart.x)), height: Math.max(4, Math.abs(end.y - eraseStart.y)),
    });
  };

  const handlePreviewPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activeTool !== 'erase' || !eraseStart || !fileBytes) return;
    const end = pageCoordinates(event.currentTarget, event.clientX, event.clientY);
    const x = Math.min(eraseStart.x, end.x);
    const y = Math.min(eraseStart.y, end.y);
    const width = Math.max(4, Math.abs(end.x - eraseStart.x));
    const height = Math.max(4, Math.abs(end.y - eraseStart.y));
    setOverlays(current => [...current, { id: nextOverlayId++, kind: 'erase', page: currentPage, x, y, width, height }]);
    setEraseStart(null);
    setEraseDraft(null);
    setActiveTool(null);
    setStatus('idle');
  };

  const handlePreviewPointerCancel = () => {
    setEraseStart(null);
    setEraseDraft(null);
  };

  const removeOverlay = (id: number) => { setOverlays(o => { const removed = o.find(x => x.id === id); if (removed?.kind === 'image') URL.revokeObjectURL(removed.previewUrl); return o.filter(x => x.id !== id); }); setStatus('idle'); };

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

        if (ov.kind === 'erase' || ov.kind === 'text-edit') {
          page.drawRectangle({ x: ov.x - 1, y: height - ov.y - ov.height - 1, width: ov.width + 2, height: ov.height + 2, color: rgb(1, 1, 1) });
          if (ov.kind === 'text-edit') {
            const [r, g, b] = hexToRgb01(ov.color);
            page.drawText(ov.text, { x: ov.x, y: height - ov.y - ov.fontSize, size: ov.fontSize, font, color: rgb(r, g, b) });
          }
        } else if (ov.kind === 'text') {
          const textWidth = font.widthOfTextAtSize(ov.text, ov.fontSize);
          const x = ov.anchorX === 'left' ? ov.offsetX : ov.anchorX === 'right' ? width - ov.offsetX - textWidth : (width - textWidth) / 2 + ov.offsetX;
          const y = ov.anchorY === 'top' ? height - ov.offsetY - ov.fontSize : ov.anchorY === 'bottom' ? ov.offsetY : (height - ov.fontSize) / 2 - ov.offsetY;
          const [r, g, b] = hexToRgb01(ov.color);
          page.drawText(ov.text, { x, y, size: ov.fontSize, font, color: rgb(r, g, b) });
        } else {
          const img = ov.format === 'png' ? await doc.embedPng(ov.bytes) : await doc.embedJpg(ov.bytes);
          const scale = ov.widthPt / img.width;
          const drawWidth = ov.widthPt;
          const drawHeight = img.height * scale;
          const x = ov.anchorX === 'left' ? ov.offsetX : ov.anchorX === 'right' ? width - ov.offsetX - drawWidth : (width - drawWidth) / 2 + ov.offsetX;
          const y = ov.anchorY === 'top' ? height - ov.offsetY - drawHeight : ov.anchorY === 'bottom' ? ov.offsetY : (height - drawHeight) / 2 - ov.offsetY;
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
  const pageTextItems = textItems.filter(item => item.page === currentPage);

  useEffect(() => {
    if (!fileBytes) {
      setPreview(null);
      setPreviewLoading(false);
      setTextItems([]);
      return;
    }
    const requestId = loadVersionRef.current;
    let active = true;
    setPreviewLoading(true);
    setPreviewFailed(false);
    (async () => {
      try {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
        pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/pdf-worker/pdf.worker.min.mjs`;
        const task = pdfjs.getDocument({ data: fileBytes.slice() });
        try {
          const doc = await task.promise;
          const pdfPage = await doc.getPage(currentPage);
          const viewport = pdfPage.getViewport({ scale: 1.2 });
          const textViewport = pdfPage.getViewport({ scale: 1 });
          const textContent = await pdfPage.getTextContent();
          const items: PdfTextItem[] = textContent.items.flatMap((item, index) => {
            if (!('str' in item) || !item.str.trim()) return [];
            const transform = pdfjs.Util.transform(textViewport.transform, item.transform);
            const fontSize = Math.max(6, Math.hypot(transform[2], transform[3]));
            return [{
              id: `${currentPage}-${index}`,
              page: currentPage,
              text: item.str,
              x: Math.max(0, transform[4]),
              y: Math.max(0, transform[5] - fontSize),
              width: Math.max(4, item.width),
              height: fontSize,
              fontSize,
            }];
          });
          const canvas = window.document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Canvas unavailable.');
          await pdfPage.render({ canvas, canvasContext: context, viewport }).promise;
          if (active && requestId === loadVersionRef.current) {
            setPreview(canvas.toDataURL('image/png'));
            setTextItems(items);
          }
          await task.destroy();
        } catch (renderError) {
          try { await task.destroy(); } catch { /* ignore cleanup errors */ }
          throw renderError;
        }
      } catch {
        if (active && requestId === loadVersionRef.current) setPreviewFailed(true);
      } finally {
        if (active && requestId === loadVersionRef.current) setPreviewLoading(false);
      }
    })();
    return () => { active = false; };
  }, [fileBytes, currentPage]);

  useEffect(() => {
    const viewport = previewViewportRef.current;
    if (!viewport || !preview) {
      setPreviewViewportSize({ width: 0, height: 0 });
      return;
    }
    const updateSize = () => setPreviewViewportSize({ width: viewport.clientWidth, height: viewport.clientHeight });
    const observer = new ResizeObserver(updateSize);
    observer.observe(viewport);
    updateSize();
    return () => observer.disconnect();
  }, [preview, currentPage]);

  const pageScale = Math.min(
    1,
    previewViewportSize.width > 0 ? previewViewportSize.width / pageSize.width : 1,
    previewViewportSize.height > 0 ? previewViewportSize.height / pageSize.height : 1,
  );
  const displayPageSize = {
    width: Math.max(1, pageSize.width * pageScale * zoom),
    height: Math.max(1, pageSize.height * pageScale * zoom),
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">PDF File</span>
        <ToolExampleClearActions onExample={loadExample} onClear={clearAll} canClear={Boolean(fileBytes || overlays.length || error)} exampleCount={1} />
      </div>
      <div style={{ padding: 20 }}>
        {!fileBytes && (
          <div
            className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <span style={{ fontSize: 28 }}>📄</span>
            <span className="tb-v2-dropzone-text">Click or drag a PDF here</span>
          <span className="tb-v2-dropzone-hint">Select existing text, add content, or remove page areas directly in your browser</span>
            <input ref={fileInputRef} type="file" accept="application/pdf" onChange={(e) => handleFile(e.target.files?.[0])} style={{ display: 'none' }} />
          </div>
        )}
        {error && <div className="tb-v2-banner tb-v2-banner-err" style={{ marginTop: 12 }}>{error}</div>}
      </div>

      {fileBytes && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">{fileName} &middot; {pageSizes.length} page{pageSizes.length === 1 ? '' : 's'}</span>
          </div>
          <div className="tb-pdf-edit-workspace" style={{ padding: '0 20px 20px' }}>
            <div className="tb-pdf-edit-pager" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <button type="button" className="tb-v2-btn-sm" disabled={currentPage <= 1} onClick={() => { setSelectedText(null); setActiveTool(null); setCurrentPage(p => p - 1); }}>&larr; Prev</button>
              <span style={{ fontSize: 13 }}>Editing page {currentPage} of {pageSizes.length}</span>
              <button type="button" className="tb-v2-btn-sm" disabled={currentPage >= pageSizes.length} onClick={() => { setSelectedText(null); setActiveTool(null); setCurrentPage(p => p + 1); }}>Next &rarr;</button>
            </div>

            <div className="tb-pdf-edit-preview-section">
              <span className="tb-v2-tool-label">PDF canvas</span>
              <div ref={previewViewportRef} className="tb-pdf-edit-preview-viewport">
                <div
                  className="tb-pdf-edit-page"
                  role="button"
                  tabIndex={activeTool ? 0 : -1}
                  aria-label={activeTool === 'text' ? 'Click the PDF page to place text' : activeTool === 'image' ? 'Click the PDF page to place image' : 'PDF page preview'}
                  onClick={handlePreviewClick}
                  onPointerDown={handlePreviewPointerDown}
                  onPointerMove={handlePreviewPointerMove}
                  onPointerUp={handlePreviewPointerUp}
                  onPointerCancel={handlePreviewPointerCancel}
                  style={{ width: displayPageSize.width, height: displayPageSize.height }}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt={`Rendered page ${currentPage} of ${fileName}`}
                      data-testid="edit-preview-image"
                      draggable={false}
                    />
                  ) : (
                    <div className="tb-pdf-edit-preview-message">
                      {previewLoading ? 'Rendering page preview…' : 'Page preview unavailable.'}
                    </div>
                  )}
                  {pageTextItems.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      className={`tb-pdf-edit-text-target ${selectedText?.id === item.id ? 'selected' : ''} ${activeTool ? 'inactive' : ''}`}
                      aria-label={`Select PDF text: ${item.text}`}
                      onClick={(event) => { event.stopPropagation(); selectTextItem(item); }}
                      style={{ left: `${(item.x / pageSize.width) * 100}%`, top: `${(item.y / pageSize.height) * 100}%`, width: `${(item.width / pageSize.width) * 100}%`, height: `${(item.height / pageSize.height) * 100}%` }}
                    />
                  ))}
                  {pageOverlays.map(ov => {
                    if (ov.kind === 'erase') {
                      return <div key={ov.id} className="tb-pdf-edit-erase-overlay" style={{ left: `${(ov.x / pageSize.width) * 100}%`, top: `${(ov.y / pageSize.height) * 100}%`, width: `${(ov.width / pageSize.width) * 100}%`, height: `${(ov.height / pageSize.height) * 100}%` }} />;
                    }
                    if (ov.kind === 'text-edit') {
                      return <div key={ov.id} className="tb-pdf-edit-overlay-text tb-pdf-edit-replacement-text" title={ov.text} style={{ left: `${(ov.x / pageSize.width) * 100}%`, top: `${(ov.y / pageSize.height) * 100}%`, width: `${(ov.width / pageSize.width) * 100}%`, minHeight: `${(ov.height / pageSize.height) * 100}%`, color: ov.color, fontSize: `${Math.max(8, ov.fontSize * pageScale * zoom)}px` }}>{ov.text}</div>;
                    }
                    const { xPct, yPct } = markerPercent(ov.anchorX, ov.anchorY, ov.offsetX, ov.offsetY, pageSize.width, pageSize.height);
                    return ov.kind === 'text' ? (
                      <div key={ov.id} title={ov.text} className="tb-pdf-edit-overlay-text" style={{ left: `${xPct}%`, top: `${yPct}%`, color: ov.color, fontSize: `${Math.max(8, ov.fontSize * pageScale * zoom)}px` }}>{ov.text}</div>
                    ) : (
                      <img key={ov.id} src={ov.previewUrl} alt="Image overlay preview" title="Image overlay" className="tb-pdf-edit-overlay-image" style={{ left: `${xPct}%`, top: `${yPct}%`, width: `${Math.min(45, Math.max(8, (ov.widthPt / pageSize.width) * 100))}%` }} />
                    );
                  })}
                  {eraseDraft && <div className="tb-pdf-edit-erase-overlay draft" style={{ left: `${(eraseDraft.x / pageSize.width) * 100}%`, top: `${(eraseDraft.y / pageSize.height) * 100}%`, width: `${(eraseDraft.width / pageSize.width) * 100}%`, height: `${(eraseDraft.height / pageSize.height) * 100}%` }} />}
                </div>
                <div className="tb-pdf-edit-zoom-controls" aria-label="PDF zoom controls">
                  <button type="button" className="tb-v2-btn-sm" aria-label="Zoom out" onClick={() => setZoom(value => Math.max(0.5, value - 0.25))} disabled={zoom <= 0.5}>−</button>
                  <span aria-live="polite">{Math.round(zoom * 100)}%</span>
                  <button type="button" className="tb-v2-btn-sm" aria-label="Zoom in" onClick={() => setZoom(value => Math.min(2, value + 0.25))} disabled={zoom >= 2}>+</button>
                </div>
              </div>
              {previewFailed && <p className="tb-v2-empty" role="alert">The visual preview could not be rendered.</p>}
              <p className="tb-pdf-edit-preview-hint">Added text and images appear directly on the page.</p>
            </div>

            <div className="tb-pdf-edit-toolbar" aria-label="PDF editing tools">
              <button
                type="button"
                className={`tb-pdf-edit-tool-button ${activeTool === 'text' ? 'active' : ''}`}
                aria-pressed={activeTool === 'text'}
                onClick={() => { setSelectedText(null); setActiveTool(tool => tool === 'text' ? null : 'text'); }}
              >
                <span aria-hidden="true">T</span> Text
              </button>
              <button
                type="button"
                className={`tb-pdf-edit-tool-button ${activeTool === 'image' ? 'active' : ''}`}
                aria-pressed={activeTool === 'image'}
                onClick={() => { setSelectedText(null); imageInputRef.current?.click(); }}
              >
                <span aria-hidden="true">▧</span> Image
              </button>
              <button
                type="button"
                className={`tb-pdf-edit-tool-button ${activeTool === 'erase' ? 'active' : ''}`}
                aria-pressed={activeTool === 'erase'}
                onClick={() => { setSelectedText(null); setActiveTool(tool => tool === 'erase' ? null : 'erase'); }}
              >
                <span aria-hidden="true">⌫</span> Remove
              </button>
              <input ref={imageInputRef} type="file" accept="image/png,image/jpeg" onChange={e => handleImageFile(e.target.files?.[0])} style={{ display: 'none' }} />
              {selectedText && (
                <div className="tb-pdf-edit-context-tools">
                  <input aria-label="Selected PDF text" type="text" value={draftText} onChange={e => setDraftText(e.target.value)} className="tb-v2-input" />
                  <button type="button" className="tb-v2-btn-sm tb-v2-btn-primary" onClick={saveSelectedText}>Save text</button>
                  <button type="button" className="tb-v2-btn-sm" onClick={removeSelectedText}>Remove text</button>
                  <button type="button" className="tb-v2-btn-sm" onClick={() => setSelectedText(null)}>Cancel</button>
                </div>
              )}
              {!selectedText && activeTool === 'text' && (
                <div className="tb-pdf-edit-context-tools">
                  <input aria-label="Text to add" type="text" value={draftText} onChange={e => setDraftText(e.target.value)} className="tb-v2-input" placeholder="Type text" />
                  <label>Size <input aria-label="Text size" type="number" min={6} max={200} value={draftFontSize} onChange={e => setDraftFontSize(Number(e.target.value) || 24)} className="tb-v2-input" /></label>
                  <label className="tb-pdf-edit-color-label">Color <input aria-label="Text color" type="color" value={draftColor} onChange={e => setDraftColor(e.target.value)} /></label>
                </div>
              )}
              {activeTool === 'image' && pendingImage && (
                <div className="tb-pdf-edit-context-tools">
                  <span className="tb-pdf-edit-tool-hint">Click the page to place image</span>
                  <label>Width <input aria-label="Image width" type="number" min={10} max={600} value={imageWidthPt} onChange={e => setImageWidthPt(Number(e.target.value) || 150)} className="tb-v2-input" /></label>
                </div>
              )}
              {activeTool === 'text' && <span className="tb-pdf-edit-tool-hint">Click the page to place text</span>}
              {activeTool === 'erase' && <span className="tb-pdf-edit-tool-hint">Drag over text or an image to remove it</span>}
              {!activeTool && !selectedText && <span className="tb-pdf-edit-tool-hint">Click text on the page to edit it</span>}
            </div>

            {overlays.length > 0 && (
              <div className="tb-pdf-edit-overlays tb-v2-option-group" style={{ marginBottom: 16 }}>
                <label className="tb-v2-tool-label">Changes ({overlays.length})</label>
                {overlays.map(ov => (
                  <div key={ov.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 13 }}>
                    <span style={{ flex: 1 }}>
                      Page {ov.page} &middot; {ov.kind === 'text' ? `Added text: "${ov.text}"` : ov.kind === 'image' ? 'Added image' : ov.kind === 'text-edit' ? `Changed text to: "${ov.text}"` : 'Removed page content'}
                    </span>
                    <button type="button" onClick={() => removeOverlay(ov.id)} className="tb-v2-btn-sm">Remove</button>
                  </div>
                ))}
              </div>
            )}

            <button
              className="tb-pdf-edit-actions tb-v2-btn tb-v2-btn-primary"
              type="button"
              aria-label="Save and Download PDF"
              onClick={applyAndDownload}
              disabled={overlays.length === 0 || status === 'processing'}
              style={{ width: '100%' }}
            >
              {status === 'processing' ? 'Saving...' : 'Save & Download PDF'}
            </button>
            {status === 'done' && (
                <div className="tb-pdf-edit-status tb-v2-banner" style={{ marginTop: 12 }}>Edited PDF downloaded.</div>
            )}
          </div>
        </>
      )}

      {!fileBytes && (
        <p className="tb-v2-empty">Upload a PDF above, then select text or choose a tool to edit the document directly.</p>
      )}
    </div>
  );
}
