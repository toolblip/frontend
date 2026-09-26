'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { useSubscription } from '@/hooks/useSubscription';
import { checkFileSize } from '@/lib/tier-limits';
import { assertPdfDocument, readPdfToolFile, unlockPdfBytes } from '@/lib/pdf-qa/pdf';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const isPdfFile = (file: File) =>
  file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

async function flattenPdfWithPassword(bytes: Uint8Array, password: string, signal: AbortSignal): Promise<Uint8Array> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/pdf-worker/pdf.worker.min.mjs`;
  const loadingTask = pdfjs.getDocument({
    // PDF.js transfers its input buffer to the worker, so keep the source bytes reusable for retries.
    data: bytes.slice() as any,
    password: password || undefined,
  });
  const cancel = () => { void loadingTask.destroy(); };
  signal.addEventListener('abort', cancel, { once: true });
  let timedOut = false;
  const timeout = window.setTimeout(() => { timedOut = true; cancel(); }, 30000);
  try {
    signal.throwIfAborted();
    const source = await loadingTask.promise;
    if (source.numPages < 1 || source.numPages > 100) throw new Error('Choose a PDF with 1 to 100 pages.');
    const output = await PDFDocument.create();
    for (let index = 1; index <= source.numPages; index += 1) {
      signal.throwIfAborted();
      const sourcePage = await source.getPage(index);
      const viewport = sourcePage.getViewport({ scale: 1.5 });
      const pageSize = sourcePage.getViewport({ scale: 1 });
      if (pageSize.width > 2000 || pageSize.height > 2000) throw new Error('PDF page dimensions exceed 2000 points.');
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not create a PDF canvas.');
      await sourcePage.render({ canvas: canvas, canvasContext: context, viewport, intent: 'print' }).promise;
      const png = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not render a PDF page.')), 'image/png');
      });
      signal.throwIfAborted();
      if (timedOut) throw new Error('PDF rendering timed out.');
      const image = await output.embedPng(new Uint8Array(await png.arrayBuffer()));
      const page = output.addPage([pageSize.width, pageSize.height]);
      page.drawImage(image, { x: 0, y: 0, width: pageSize.width, height: pageSize.height });
      canvas.width = 0;
      canvas.height = 0;
    }
    return output.save();
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener('abort', cancel);
    await loadingTask.destroy();
  }
}

export default function PdfPasswordRemoverClient() {
  const { tier } = useSubscription();
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [permissionConfirmed, setPermissionConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ message: string; blob?: Blob } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadVersionRef = useRef(0);
  const isProcessing = processing;
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => { abortRef.current?.abort(); ++loadVersionRef.current; }, []);

  const invalidateResult = () => {
    loadVersionRef.current += 1;
    setResult(null);
    setError('');
    setProcessing(false);
  };

  const clearAll = () => {
    abortRef.current?.abort();
    loadVersionRef.current += 1;
    setFile(null);
    setFileBytes(null);
    setPassword('');
    setLoading(false);
    setProcessing(false);
    setIsDragging(false);
    setPermissionConfirmed(false);
    setError('');
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadFile = useCallback(async (selected: File | undefined, requestId?: number) => {
    if (!selected || processing) return;
    const currentRequestId = requestId ?? ++loadVersionRef.current;
    if (currentRequestId !== loadVersionRef.current) return;
    setFile(null);
    setFileBytes(null);
    setResult(null);
    setError('');
    setPassword('');
    setPermissionConfirmed(false);
    setLoading(false);
    setProcessing(false);
    if (!isPdfFile(selected)) {
      setError('Please choose a PDF file.');
      return;
    }
    const sizeError = checkFileSize(selected, tier);
    if (sizeError) {
      setError(sizeError);
      return;
    }
    setLoading(true);

    try {
      const loadedBytes = new Uint8Array(await readPdfToolFile(selected));
      const doc = assertPdfDocument(await PDFDocument.load(loadedBytes, { ignoreEncryption: true }));
      if (doc.getPageCount() === 0) throw new Error('The PDF has no pages.');
      if (currentRequestId !== loadVersionRef.current) return;
      setFile(selected);
      setFileBytes(loadedBytes);
    } catch (caught) {
      if (currentRequestId === loadVersionRef.current) setError(caught instanceof Error ? caught.message : 'Could not read this PDF.');
    } finally {
      if (currentRequestId === loadVersionRef.current) setLoading(false);
    }
  }, [processing, tier]);

  const loadExample = useCallback(async () => {
    if (processing) return;
    const requestId = ++loadVersionRef.current;
    setLoading(true);
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      ['Accessible sample PDF', 'Second sample page'].forEach((title, index) => {
        const page = doc.addPage([500, 320]);
        page.drawRectangle({ x: 0, y: 0, width: 500, height: 320, color: rgb(0.96, 0.98, 1) });
        page.drawText(title, { x: 60, y: 220, size: 24, font, color: rgb(0.1, 0.2, 0.45) });
        page.drawText(`Example page ${index + 1}`, { x: 60, y: 180, size: 16, font });
      });
      const bytes = await doc.save();
      if (requestId !== loadVersionRef.current) return;
      await loadFile(new File([bytes as BlobPart], 'unlock-sample.pdf', { type: 'application/pdf' }), requestId);
    } catch {
      if (requestId === loadVersionRef.current) { setLoading(false); setError('Could not create the sample PDF.'); }
    }
  }, [loadFile, processing]);

  const removePassword = async () => {
    if (!fileBytes || !file || processing) return;
    if (!permissionConfirmed) {
      setError('Please confirm that you own this PDF or have permission to unlock it.');
      return;
    }
    const requestId = ++loadVersionRef.current;
    setProcessing(true);
    setError('');
    setResult(null);
    try {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const { bytes, flattened } = await unlockPdfBytes(fileBytes, password, (source, secret) =>
        flattenPdfWithPassword(source, secret, controller.signal));
      const message = flattened
        ? 'PDF unlocked and flattened into a new password-free PDF.'
        : 'This PDF was already password-free. A new copy is ready.';
      if (requestId !== loadVersionRef.current) return;
      setResult({ message, blob: new Blob([bytes as BlobPart], { type: 'application/pdf' }) });
    } catch (caught) {
      if (requestId === loadVersionRef.current) setError('Could not unlock this PDF. Check the opening password and try again. The file may also exceed the 100-page or 2000-point page limits.');
    } finally {
      if (requestId === loadVersionRef.current) setProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result?.blob || !file) return;
    const url = URL.createObjectURL(result.blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.name.replace(/\.pdf$/i, '_unlocked.pdf');
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tb-v2-tool-card" style={{ minWidth: 0, maxWidth: "100%", overflowWrap: "anywhere" }}>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">PDF File</span>
        <ToolExampleClearActions
          onExample={() => void loadExample()}
          onClear={clearAll}
          canClear={Boolean(file || result || error || password || loading || processing)}
          exampleDisabled={isProcessing}
          exampleCount={1}
        />
      </div>
      <div style={{ padding: 20 }}>
        <div
          className="tb-v2-dropzone"
          onClick={() => { if (!isProcessing) fileInputRef.current?.click(); }}
          onDragOver={(event) => { if (!isProcessing) event.preventDefault(); }}
          onDragEnter={() => { if (!isProcessing) setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            if (isProcessing) return;
            setIsDragging(false);
            void loadFile(event.dataTransfer.files?.[0]);
          }}
          aria-disabled={isProcessing}
          style={isDragging ? { borderColor: 'var(--accent)' } : undefined}
        >
          <span style={{ fontSize: 28 }}>PDF</span>
          <span className="tb-v2-dropzone-text">{file?.name || 'Click or drag a PDF to unlock'}</span>
          <span className="tb-v2-dropzone-hint">Processing stays in your browser</span>
          <input
            ref={fileInputRef}
            aria-label="PDF file" type="file"
            accept="application/pdf,.pdf"
            onChange={(event) => void loadFile(event.target.files?.[0])}
            disabled={isProcessing}
            style={{ display: 'none' }}
          />
        </div>
        {loading && <p className="tb-v2-empty">Reading PDF...</p>}
        {error && <div className="tb-v2-banner tb-v2-banner-err" role="alert">{error}</div>}
      </div>
      {file && (
        <div style={{ padding: '0 20px 20px' }}>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">{file.name}</span>
          </div>
          <label className="tb-v2-tool-label" htmlFor="unlock-password" style={{ display: 'block', marginTop: 14 }}>
            Password (only needed if the PDF asks for one)
          </label>
          <input
            id="unlock-password"
            type="password"
            value={password}
            onChange={(event) => { if (!isProcessing) { invalidateResult(); setPassword(event.target.value); } }}
            disabled={isProcessing}
            placeholder="Enter the current PDF password"
            className="tb-v2-input"
            style={{ marginTop: 8 }}
          />
          <div className="tb-pdf-unlock-consent">
            <label className="tb-pdf-unlock-consent-label" htmlFor="unlock-permission-confirmed">
              <input
                id="unlock-permission-confirmed"
                type="checkbox"
                checked={permissionConfirmed}
                disabled={isProcessing}
                onChange={(event) => {
                  if (!isProcessing) {
                    invalidateResult();
                    setPermissionConfirmed(event.target.checked);
                  }
                }}
              />
              <span>I confirm that I own this PDF or have permission from its owner to unlock it.</span>
            </label>
            <p id="unlock-permission-help">You are responsible for using the unlocked file lawfully.</p>
          </div>
          <button type="button" onClick={() => void removePassword()} disabled={processing || !permissionConfirmed} aria-describedby="unlock-permission-help" className="tb-v2-btn tb-v2-btn-primary tb-pdf-unlock-action" style={{ width: '100%', marginTop: 16 }}>
            {processing ? 'Processing...' : 'Unlock PDF'}
          </button>
          <div className="tb-v2-banner" style={{ marginTop: 12 }}>
            Use this only on a PDF you have permission to unlock. Encrypted files are flattened into page images. Text selection, links, forms and digital signatures are not preserved. Limits: 25 MB, 100 pages, 2000 points per page side.
          </div>
          {result?.blob && (
            <div className="tb-v2-banner tb-pdf-unlock-result" style={{ marginTop: 12 }}>
              <span>{result.message}</span>
              <button type="button" onClick={downloadResult} className="tb-v2-btn tb-v2-btn-sm tb-pdf-unlock-download">Download PDF</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
