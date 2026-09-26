'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { useSubscription } from '@/hooks/useSubscription';
import { checkFileSize } from '@/lib/tier-limits';
import { assertPdfFileSize, readPdfToolFile, loadPdfForTools } from '@/lib/pdf-qa/pdf';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Mode = 'draw' | 'type' | 'upload';
const PDF_PREVIEW_SCALE = 0.75;

const isPdfFile = (file: File) =>
  file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] ?? '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function renderPdfPage(bytes: Uint8Array, pageNumber: number): Promise<{ url: string; width: number; height: number } | null> {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/pdf-worker/pdf.worker.min.mjs`;
    const task = pdfjs.getDocument({ data: bytes.slice() });
    try {
      const doc = await task.promise;
      const page = await doc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: PDF_PREVIEW_SCALE });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext('2d');
      if (!context) return null;
      await page.render({ canvas, canvasContext: context, viewport }).promise;
      return { url: canvas.toDataURL('image/png'), width: viewport.width, height: viewport.height };
    } finally {
      await task.destroy();
    }
  } catch {
    return null;
  }
}

export default function SignPDFClient() {
  const { tier } = useSubscription();
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [mode, setMode] = useState<Mode>('draw');
  const [typedText, setTypedText] = useState('Your Name');
  const [uploadedDataUrl, setUploadedDataUrl] = useState('');
  const [uploadedMime, setUploadedMime] = useState<'image/png' | 'image/jpeg'>('image/png');
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
  const [sigWidth, setSigWidth] = useState(180);
  const [sigHeight, setSigHeight] = useState(70);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [pagePreview, setPagePreview] = useState<{ url: string; width: number; height: number } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const sigFileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typeCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const loadVersionRef = useRef(0);
  const signatureLoadVersionRef = useRef(0);
  const previewVersionRef = useRef(0);

  const invalidateResult = () => {
    loadVersionRef.current += 1;
    setResultBlob(null);
    setMessage('');
    setStatus('idle');
  };

  const reset = () => {
    loadVersionRef.current += 1;
    signatureLoadVersionRef.current += 1;
    previewVersionRef.current += 1;
    setFile(null);
    setFileBytes(null);
    setPageCount(0);
    setPageIndex(0);
    setStatus('idle');
    setMessage('');
    setResultBlob(null);
    setPagePreview(null);
    setPreviewLoading(false);
    setIsDragging(false);
    setUploadedDataUrl('');
    setUploadedMime('image/png');
    setHasDrawing(false);
    clearDrawCanvas(true);
    if (fileRef.current) fileRef.current.value = '';
    if (sigFileRef.current) sigFileRef.current.value = '';
  };

  const loadFile = useCallback(async (f: File | undefined, requestId?: number) => {
    if (!f || status === 'processing') return;
    const currentRequestId = requestId ?? ++loadVersionRef.current;
    if (currentRequestId !== loadVersionRef.current) return;
    setFile(null);
    setFileBytes(null);
    setPageCount(0);
    setResultBlob(null);
    setMessage('');
    if (!isPdfFile(f)) {
      setStatus('error');
      setMessage('Please choose a PDF file.');
      return;
    }
    const sizeError = checkFileSize(f, tier);
    if (sizeError) {
      setStatus('error');
      setMessage(sizeError);
      return;
    }
    setStatus('loading');
    try {
      const bytes = new Uint8Array(await readPdfToolFile(f));
      const pdfDoc = await loadPdfForTools(bytes);
      if (pdfDoc.getPageCount() === 0) throw new Error('The PDF has no pages.');
      if (currentRequestId !== loadVersionRef.current) return;
      setFile(f);
      setFileBytes(bytes);
      setPageCount(pdfDoc.getPageCount());
      setPageIndex(0);
      setStatus('idle');
    } catch {
      if (currentRequestId === loadVersionRef.current) {
        setStatus('error');
        setMessage('Could not read this file as a valid PDF.');
      }
    }
  }, [status, tier]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'processing') return;
    const f = e.target.files?.[0];
    void loadFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (status === 'processing') return;
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    void loadFile(f);
  };

  const loadExample = useCallback(async () => {
    if (status === 'processing') return;
    const requestId = ++loadVersionRef.current;
    setStatus('loading');
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      ['Signature sample', 'Second page'].forEach((title, index) => {
        const page = doc.addPage([500, 320]);
        page.drawRectangle({ x: 0, y: 0, width: 500, height: 320, color: rgb(0.97, 0.98, 1) });
        page.drawText(title, { x: 60, y: 220, size: 26, font, color: rgb(0.1, 0.2, 0.45) });
        page.drawText(`Example page ${index + 1}`, { x: 60, y: 180, size: 16, font });
      });
      const bytes = await doc.save();
      if (requestId !== loadVersionRef.current) return;
      setMode('type');
      setTypedText('Example Signer');
      await loadFile(new File([bytes as BlobPart], 'sign-sample.pdf', { type: 'application/pdf' }), requestId);
    } catch {
      if (requestId === loadVersionRef.current) {
        setStatus('error');
        setMessage('Could not create the sample PDF.');
      }
    }
  }, [loadFile, status]);

  // Draw-mode canvas handlers
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (status === 'processing') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    invalidateResult();
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const { x, y } = getCanvasPoint(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    if (status === 'processing') {
      drawingRef.current = false;
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasPoint(e);
    setHasDrawing(true);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#111827';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const onPointerUp = () => {
    drawingRef.current = false;
  };

  const clearDrawCanvas = (force = false) => {
    if (status === 'processing' && !force) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawing(false);
    invalidateResult();
  };

  // Keep the signature canvas transparent so the exported image has no white box.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Type-mode: render typed text onto its own canvas whenever it changes
  useEffect(() => {
    const canvas = typeCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111827';
    ctx.font = 'italic 42px "Brush Script MT", "Segoe Script", cursive';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedText || ' ', 16, canvas.height / 2, canvas.width - 32);
  }, [typedText, mode, file, pageCount]);

  useEffect(() => {
    if (!fileBytes || pageCount === 0) {
      previewVersionRef.current += 1;
      setPagePreview(null);
      setPreviewLoading(false);
      return;
    }
    const requestId = ++previewVersionRef.current;
    setPreviewLoading(true);
    void renderPdfPage(fileBytes, pageIndex + 1).then((preview) => {
      if (requestId !== previewVersionRef.current) return;
      setPagePreview(preview);
      setPreviewLoading(false);
    });
  }, [fileBytes, pageCount, pageIndex]);

  const handleSigFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'processing') return;
    const f = e.target.files?.[0];
    if (!f) return;
    const requestId = ++signatureLoadVersionRef.current;
    invalidateResult();
    setUploadedDataUrl('');
    try { assertPdfFileSize(f); } catch { setStatus('error'); setMessage('Signature image must be 25 MB or less.'); return; }
    if (f.type !== 'image/png' && f.type !== 'image/jpeg' && !/\.(png|jpe?g)$/i.test(f.name)) {
      setStatus('error');
      setMessage('Signature image must be PNG or JPG.');
      return;
    }
    setUploadedMime(f.type === 'image/png' || /\.png$/i.test(f.name) ? 'image/png' : 'image/jpeg');
    invalidateResult();
    setStatus('idle');
    setMessage('');
    const reader = new FileReader();
    reader.onload = () => {
      if (requestId === signatureLoadVersionRef.current) setUploadedDataUrl(reader.result as string);
    };
    reader.onerror = () => { if (requestId === signatureLoadVersionRef.current) { setStatus('error'); setMessage('Could not read the signature image.'); } };
    reader.readAsDataURL(f);
  };

  const getSignatureBytes = useCallback((): { bytes: Uint8Array; kind: 'png' | 'jpg' } | null => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawing) return null;
      return { bytes: dataUrlToBytes(canvas.toDataURL('image/png')), kind: 'png' };
    }
    if (mode === 'type') {
      const canvas = typeCanvasRef.current;
      if (!canvas) return null;
      return { bytes: dataUrlToBytes(canvas.toDataURL('image/png')), kind: 'png' };
    }
    if (mode === 'upload') {
      if (!uploadedDataUrl) return null;
      return { bytes: dataUrlToBytes(uploadedDataUrl), kind: uploadedMime === 'image/png' ? 'png' : 'jpg' };
    }
    return null;
  }, [hasDrawing, mode, uploadedDataUrl, uploadedMime]);

  const process = async () => {
    if (!fileBytes || status === 'processing') return;
    if (mode === 'type' && !typedText.trim()) {
      setStatus('error');
      setMessage('Type a name first.');
      return;
    }
    const sig = getSignatureBytes();
    if (!sig) {
      setStatus('error');
      setMessage('Please draw, type, or upload a signature first.');
      return;
    }
    const requestId = ++loadVersionRef.current;
    setStatus('processing');
    setMessage('');
    try {
      const pdfDoc = await loadPdfForTools(fileBytes);
      const page = pdfDoc.getPages()[pageIndex];
      if (!page) throw new Error('Invalid page');
      const image = sig.kind === 'png' ? await pdfDoc.embedPng(sig.bytes) : await pdfDoc.embedJpg(sig.bytes);
      if (image.width * image.height > 16000000) throw new Error('Signature image exceeds 16 million pixels.');
      const width = Math.max(1, Math.min(sigWidth, page.getWidth()));
      const height = Math.max(1, Math.min(sigHeight, page.getHeight()));
      const x = Math.max(0, Math.min(posX, page.getWidth() - width));
      const y = Math.max(0, Math.min(posY, page.getHeight() - height));
      page.drawImage(image, { x, y, width, height });
      const pdfBytes = await pdfDoc.save();
      if (requestId !== loadVersionRef.current) return;
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      setResultBlob(blob);
      setStatus('done');
      setMessage('Signed PDF ready to download!');
    } catch {
      if (requestId === loadVersionRef.current) {
        setStatus('error');
        setMessage('Error signing PDF. Please try again.');
      }
    }
  };

  const downloadResult = () => {
    if (!resultBlob || !file) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signed-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    reset();
    setMode('draw');
    setTypedText('Your Name');
    setUploadedDataUrl('');
    setPosX(50);
    setPosY(50);
    setSigWidth(180);
    setSigHeight(70);
    if (sigFileRef.current) sigFileRef.current.value = '';
  };

  const signaturePreviewUrl = mode === 'draw'
    ? (hasDrawing ? canvasRef.current?.toDataURL('image/png') : null)
    : mode === 'type'
      ? typeCanvasRef.current?.toDataURL('image/png')
      : uploadedDataUrl || null;

  const previewScale = PDF_PREVIEW_SCALE;
  const previewSignatureStyle = pagePreview && signaturePreviewUrl ? {
    left: `${posX * previewScale}px`,
    top: `${pagePreview.height - (posY + sigHeight) * previewScale}px`,
    width: `${sigWidth * previewScale}px`,
    height: `${sigHeight * previewScale}px`,
  } : undefined;

  return (
    <div className="tb-v2-tool-card" style={{ minWidth: 0, maxWidth: "100%", overflowWrap: "anywhere" }}>
      <p className="tb-v2-empty">PDF limits: 25 MB per file, 100 pages, 2000 points per page side.</p>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">PDF File</span>
        <ToolExampleClearActions
          onExample={() => void loadExample()}
          onClear={clearAll}
          canClear={Boolean(file || resultBlob || message || status === 'loading')}
          exampleDisabled={status === 'processing'}
          exampleCount={1}
        />
      </div>
      {!file && (
        <div
          onDragOver={(e) => { if (status !== 'processing') { e.preventDefault(); setIsDragging(true); } }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => { if (status !== 'processing') fileRef.current?.click(); }}
          aria-disabled={status === 'processing'}
          className={`tb-v2-dropzone ${
            isDragging
              ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
              : ''
          }`}
        >
          <div style={{ fontSize: 28 }}>PDF</div>
          <span className="tb-v2-dropzone-text">{isDragging ? 'Drop PDF here' : 'Click or drag a PDF to sign'}</span>
          <span className="tb-v2-dropzone-hint">Draw, type, or upload a visual signature locally</span>
        </div>
      )}

      <input ref={fileRef} aria-label="PDF file" type="file" accept="application/pdf,.pdf" onChange={handleFileChange} disabled={status === 'processing'} className="hidden" />

      {file && (
        <div className="tb-sign-file-chip">
          <div className="tb-sign-file-icon" aria-hidden="true">PDF</div>
          <div className="tb-sign-file-info">
            <strong>{file.name}</strong>
            <span>{pageCount} page{pageCount === 1 ? '' : 's'} ready to sign</span>
          </div>
          <button type="button" onClick={reset} className="tb-sign-file-remove" aria-label="Remove PDF">×</button>
        </div>
      )}

      {file && pageCount > 0 && (
        <div className="tb-sign-workspace">
          <div className="tb-sign-page-control">
            <label className="tb-v2-tool-label">Page to sign</label>
            <select
              aria-label="Page to sign"
              value={pageIndex}
              disabled={status === 'processing'}
              onChange={e => { if (status !== 'processing') { invalidateResult(); setPageIndex(Number(e.target.value)); } }}
              className="tb-v2-select"
            >
              {Array.from({ length: pageCount }, (_, i) => (
                <option key={i} value={i}>Page {i + 1}</option>
              ))}
            </select>
          </div>

          <div className="tb-sign-preview" aria-label={`Preview of page ${pageIndex + 1}`}>
            <div className="tb-sign-preview-head">
              <span className="tb-v2-tool-label">Page preview</span>
              <span className="tb-sign-preview-page">Page {pageIndex + 1} of {pageCount}</span>
            </div>
            <div className="tb-sign-preview-viewport">
              {previewLoading && <span className="tb-v2-empty">Rendering page preview...</span>}
              {pagePreview && (
                <div className="tb-sign-preview-page-surface" style={{ width: pagePreview.width, height: pagePreview.height }}>
                  <img src={pagePreview.url} alt={`Rendered preview of page ${pageIndex + 1}`} />
                  {signaturePreviewUrl && <img className="tb-sign-preview-signature" src={signaturePreviewUrl} alt="Signature placement preview" style={previewSignatureStyle} />}
                </div>
              )}
            </div>
            <p className="tb-sign-preview-hint">The signature overlay shows where it will be placed in the exported PDF.</p>
          </div>

          <div className="tb-sign-editor">
          <div className="tb-sign-mode-tabs" role="tablist" aria-label="Signature method">
            {(['draw', 'type', 'upload'] as Mode[]).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => { if (status !== 'processing') { invalidateResult(); setMode(m); } }}
                disabled={status === 'processing'}
                role="tab"
                aria-selected={mode === m}
                className={`tb-v2-btn-sm ${mode === m ? 'tb-v2-btn-primary' : ''}`}
              >
                {m === 'draw' ? 'Draw' : m === 'type' ? 'Type' : 'Upload'}
              </button>
            ))}
          </div>

          {mode === 'draw' && (
            <div className="tb-sign-mode-panel">
              <canvas
                ref={canvasRef}
                width={400}
                height={150}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
                onPointerCancel={onPointerUp}
                aria-disabled={status === 'processing'}
                className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white touch-none w-full max-w-[400px]"
              />
              <button type="button" onClick={() => clearDrawCanvas()} disabled={status === 'processing'} className="tb-v2-btn-sm mt-2">Clear</button>
            </div>
          )}

          {mode === 'type' && (
            <div className="tb-sign-mode-panel">
              <input
                type="text"
                value={typedText}
                maxLength={80}
                onChange={e => { if (status !== 'processing') { invalidateResult(); setTypedText(e.target.value); } }}
                disabled={status === 'processing'}
                aria-label="Signature name" placeholder="Type your name..."
                className="tb-v2-input"
              />
              <canvas
                ref={typeCanvasRef}
                width={400}
                height={100}
                className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white mt-2 w-full max-w-[400px]"
              />
            </div>
          )}

          {mode === 'upload' && (
            <div className="tb-sign-mode-panel">
              <button type="button" onClick={() => { if (status !== 'processing') sigFileRef.current?.click(); }} disabled={status === 'processing'} className="tb-v2-btn-sm">
                Choose signature image (PNG/JPG)
              </button>
              <input
                ref={sigFileRef}
                aria-label="Image file" type="file"
                accept="image/png,image/jpeg,.png,.jpg,.jpeg"
                onChange={handleSigFileChange}
                disabled={status === 'processing'}
                className="hidden"
              />
              {uploadedDataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={uploadedDataUrl} alt="Uploaded signature" className="mt-2 max-w-[300px] max-h-[120px] border border-gray-300 dark:border-gray-600 rounded-lg bg-white" />
              )}
            </div>
          )}

          <div className="tb-sign-position-grid">
            <div>
              <label className="tb-v2-tool-label">Position X (pt from left)</label>
              <input type="number" min={0} aria-label="Position X (pt from left)" value={posX} disabled={status === 'processing'} onChange={e => { if (status !== 'processing') { invalidateResult(); setPosX(Number(e.target.value) || 0); } }} className="tb-v2-input" />
            </div>
            <div>
              <label className="tb-v2-tool-label">Position Y (pt from bottom)</label>
              <input type="number" min={0} aria-label="Position Y (pt from bottom)" value={posY} disabled={status === 'processing'} onChange={e => { if (status !== 'processing') { invalidateResult(); setPosY(Number(e.target.value) || 0); } }} className="tb-v2-input" />
            </div>
            <div>
              <label className="tb-v2-tool-label">Width (pt)</label>
              <input type="number" min={1} aria-label="Width (pt)" value={sigWidth} disabled={status === 'processing'} onChange={e => { if (status !== 'processing') { invalidateResult(); setSigWidth(Number(e.target.value) || 1); } }} className="tb-v2-input" />
            </div>
            <div>
              <label className="tb-v2-tool-label">Height (pt)</label>
              <input type="number" min={1} aria-label="Height (pt)" value={sigHeight} disabled={status === 'processing'} onChange={e => { if (status !== 'processing') { invalidateResult(); setSigHeight(Number(e.target.value) || 1); } }} className="tb-v2-input" />
            </div>
          </div>

          <button
            type="button"
            onClick={process}
            disabled={status === 'processing'}
            className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg tb-sign-action"
          >
            {status === 'processing' ? '⏳ Signing...' : '✍️ Sign PDF'}
          </button>
          </div>
        </div>
      )}

      {status === 'done' && (
        <div className="tb-sign-result" role="status">
          <p>{message}</p>
          <button
            type="button"
            onClick={downloadResult}
            className="tb-v2-btn tb-v2-btn-primary"
          >
            Download signed PDF
          </button>
        </div>
      )}

      {status === 'error' && (
        <div role="alert" className="tb-sign-error">
          <p>{message}</p>
        </div>
      )}

      <p className="tb-sign-disclaimer">
        This tool places a visual signature image onto your PDF. It does not apply a cryptographic digital signature or legal e-signature certificate.
      </p>
    </div>
  );
}
