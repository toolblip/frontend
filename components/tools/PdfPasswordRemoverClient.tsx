'use client';

import { useCallback, useRef, useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { useSubscription } from '@/hooks/useSubscription';
import { checkFileSize } from '@/lib/tier-limits';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const isPdfFile = (file: File) =>
  file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

async function flattenPdfWithPassword(bytes: Uint8Array, password: string): Promise<Uint8Array> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/pdf-worker/pdf.worker.min.mjs`;
  const loadingTask = pdfjs.getDocument({
    // PDF.js transfers its input buffer to the worker, so keep the source bytes reusable for retries.
    data: bytes.slice() as any,
    password: password || undefined,
  });
  try {
    const source = await loadingTask.promise;
    const output = await PDFDocument.create();
    for (let index = 1; index <= source.numPages; index += 1) {
      const sourcePage = await source.getPage(index);
      const viewport = sourcePage.getViewport({ scale: 1.5 });
      const pageSize = sourcePage.getViewport({ scale: 1 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not create a PDF canvas.');
      await sourcePage.render({ canvas: canvas, canvasContext: context, viewport }).promise;
      const png = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not render a PDF page.')), 'image/png');
      });
      const image = await output.embedPng(new Uint8Array(await png.arrayBuffer()));
      const page = output.addPage([pageSize.width, pageSize.height]);
      page.drawImage(image, { x: 0, y: 0, width: pageSize.width, height: pageSize.height });
      canvas.width = 0;
      canvas.height = 0;
    }
    return output.save();
  } finally {
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
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ message: string; blob?: Blob } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadVersionRef = useRef(0);

  const clearAll = () => {
    loadVersionRef.current += 1;
    setFile(null);
    setFileBytes(null);
    setPassword('');
    setLoading(false);
    setProcessing(false);
    setIsDragging(false);
    setError('');
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadFile = useCallback(async (selected: File | undefined, requestId = ++loadVersionRef.current) => {
    if (!selected) return;
    setFile(null);
    setFileBytes(null);
    setResult(null);
    setError('');
    setPassword('');
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
    let bytes: Uint8Array | null = null;
    try {
      const loadedBytes = new Uint8Array(await selected.arrayBuffer());
      bytes = loadedBytes;
      const doc = await PDFDocument.load(loadedBytes, { ignoreEncryption: true });
      if (doc.getPageCount() === 0) throw new Error('The PDF has no pages.');
      if (requestId !== loadVersionRef.current) return;
      setFile(selected);
      setFileBytes(loadedBytes);
    } catch {
      if (requestId === loadVersionRef.current) {
        const header = bytes ? new TextDecoder().decode(bytes.subarray(0, 5)) : '';
        if (bytes && header === '%PDF-') {
          // pdf-lib cannot inspect encrypted files, but PDF.js can try the password later.
          setFile(selected);
          setFileBytes(bytes);
        } else {
          setError('Could not read this file as a PDF. It may be encrypted or invalid.');
        }
      }
    } finally {
      if (requestId === loadVersionRef.current) setLoading(false);
    }
  }, [tier]);

  const loadExample = useCallback(async () => {
    const requestId = ++loadVersionRef.current;
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
      if (requestId === loadVersionRef.current) setError('Could not create the sample PDF.');
    }
  }, [loadFile]);

  const removePassword = async () => {
    if (!fileBytes || !file || processing) return;
    const requestId = ++loadVersionRef.current;
    setProcessing(true);
    setError('');
    setResult(null);
    try {
      let bytes: Uint8Array;
      let message: string;
      try {
        const doc = await PDFDocument.load(fileBytes);
        bytes = await doc.save();
        message = 'PDF re-saved without its existing permission metadata.';
      } catch {
        try {
          bytes = await flattenPdfWithPassword(fileBytes, password.trim());
          message = 'PDF unlocked and flattened into a new password-free PDF.';
        } catch {
          throw new Error(password.trim() ? 'The password was incorrect, or this PDF format is not supported.' : 'This PDF requires an opening password. Enter the correct password and try again.');
        }
      }
      if (requestId !== loadVersionRef.current) return;
      setResult({ message, blob: new Blob([bytes as BlobPart], { type: 'application/pdf' }) });
    } catch (caught) {
      if (requestId === loadVersionRef.current) setError(caught instanceof Error ? caught.message : 'Could not unlock this PDF.');
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
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">PDF File</span>
        <ToolExampleClearActions
          onExample={() => void loadExample()}
          onClear={clearAll}
          canClear={Boolean(file || result || error || password)}
          exampleCount={1}
        />
      </div>
      <div style={{ padding: 20 }}>
        <div
          className="tb-v2-dropzone"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            void loadFile(event.dataTransfer.files?.[0]);
          }}
          style={isDragging ? { borderColor: 'var(--accent)' } : undefined}
        >
          <span style={{ fontSize: 28 }}>PDF</span>
          <span className="tb-v2-dropzone-text">{file?.name || 'Click or drag a PDF to unlock'}</span>
          <span className="tb-v2-dropzone-hint">Processing stays in your browser</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={(event) => void loadFile(event.target.files?.[0])}
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
            onChange={(event) => { setPassword(event.target.value); setResult(null); setError(''); }}
            placeholder="Enter the current PDF password"
            className="tb-v2-input"
            style={{ marginTop: 8 }}
          />
          <button type="button" onClick={() => void removePassword()} disabled={processing} className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg" style={{ width: '100%', marginTop: 16 }}>
            {processing ? 'Processing...' : 'Unlock PDF'}
          </button>
          <div className="tb-v2-banner" style={{ marginTop: 12 }}>
            Use this only on a PDF you have permission to unlock. Opening-password files are flattened into page images so the output no longer needs a password.
          </div>
          {result?.blob && (
            <div className="tb-v2-banner" style={{ marginTop: 12 }}>
              {result.message} <button type="button" onClick={downloadResult} className="tb-v2-btn-sm" style={{ marginLeft: 8 }}>Download PDF</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
