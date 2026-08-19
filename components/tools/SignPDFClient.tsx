'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

type Mode = 'draw' | 'type' | 'upload';

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] ?? '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export default function SignPDFClient() {
  const [file, setFile] = useState<File | null>(null);
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
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const sigFileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typeCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setPageIndex(0);
    setStatus('idle');
    setMessage('');
    setResultBlob(null);
  };

  const handleFile = async (f: File) => {
    setFile(f);
    setStatus('loading');
    setMessage('');
    setResultBlob(null);
    try {
      const arrayBuffer = await f.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPageCount(pdfDoc.getPageCount());
      setPageIndex(0);
      setStatus('idle');
    } catch {
      setStatus('error');
      setMessage('Error reading PDF. Please ensure it is a valid PDF file.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === 'application/pdf') handleFile(f);
  };

  // Draw-mode canvas handlers
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawingRef.current = true;
    const { x, y } = getCanvasPoint(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasPoint(e);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#111827';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const onPointerUp = () => {
    drawingRef.current = false;
  };

  const clearDrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Initialize canvas backgrounds (white) so exported PNG isn't transparent-on-transparent
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Type-mode: render typed text onto its own canvas whenever it changes
  useEffect(() => {
    const canvas = typeCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111827';
    ctx.font = 'italic 42px "Brush Script MT", "Segoe Script", cursive';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedText || ' ', 16, canvas.height / 2);
  }, [typedText, mode]);

  const handleSigFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'image/png' && f.type !== 'image/jpeg') {
      setStatus('error');
      setMessage('Signature image must be PNG or JPG.');
      return;
    }
    setUploadedMime(f.type as 'image/png' | 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => setUploadedDataUrl(reader.result as string);
    reader.readAsDataURL(f);
  };

  const getSignatureBytes = useCallback((): { bytes: Uint8Array; kind: 'png' | 'jpg' } | null => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return null;
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
  }, [mode, uploadedDataUrl, uploadedMime]);

  const process = async () => {
    if (!file) return;
    const sig = getSignatureBytes();
    if (!sig) {
      setStatus('error');
      setMessage('Please draw, type, or upload a signature first.');
      return;
    }
    setStatus('processing');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const page = pdfDoc.getPages()[pageIndex];
      if (!page) throw new Error('Invalid page');
      const image = sig.kind === 'png' ? await pdfDoc.embedPng(sig.bytes) : await pdfDoc.embedJpg(sig.bytes);
      page.drawImage(image, { x: posX, y: posY, width: sigWidth, height: sigHeight });
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      setResultBlob(blob);
      setStatus('done');
      setMessage('Signed PDF ready to download!');
    } catch {
      setStatus('error');
      setMessage('Error signing PDF. Please try again.');
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

  return (
    <div>
      {!file && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
          }`}
        >
          <div className="text-4xl mb-2">✍️</div>
          <p className="text-gray-600 dark:text-gray-400">
            {isDragging ? 'Drop PDF here' : 'Click or drag a PDF to sign'}
          </p>
          <p className="text-xs text-gray-500 mt-1">PDF files only</p>
        </div>
      )}

      <input ref={fileRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />

      {file && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-500">{pageCount} page{pageCount === 1 ? '' : 's'}</p>
          </div>
          <button onClick={reset} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
      )}

      {file && pageCount > 0 && (
        <>
          <div className="mt-4">
            <label className="tb-v2-tool-label">Page to sign</label>
            <select
              value={pageIndex}
              onChange={e => setPageIndex(Number(e.target.value))}
              className="tb-v2-select"
            >
              {Array.from({ length: pageCount }, (_, i) => (
                <option key={i} value={i}>Page {i + 1}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex gap-2">
            {(['draw', 'type', 'upload'] as Mode[]).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`tb-v2-btn-sm ${mode === m ? 'tb-v2-btn-primary' : ''}`}
              >
                {m === 'draw' ? 'Draw' : m === 'type' ? 'Type' : 'Upload'}
              </button>
            ))}
          </div>

          {mode === 'draw' && (
            <div className="mt-3">
              <canvas
                ref={canvasRef}
                width={400}
                height={150}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
                className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white touch-none w-full max-w-[400px]"
              />
              <button type="button" onClick={clearDrawCanvas} className="tb-v2-btn-sm mt-2">Clear</button>
            </div>
          )}

          {mode === 'type' && (
            <div className="mt-3">
              <input
                type="text"
                value={typedText}
                onChange={e => setTypedText(e.target.value)}
                placeholder="Type your name..."
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
            <div className="mt-3">
              <button type="button" onClick={() => sigFileRef.current?.click()} className="tb-v2-btn-sm">
                Choose signature image (PNG/JPG)
              </button>
              <input
                ref={sigFileRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleSigFileChange}
                className="hidden"
              />
              {uploadedDataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={uploadedDataUrl} alt="Uploaded signature" className="mt-2 max-w-[300px] max-h-[120px] border border-gray-300 dark:border-gray-600 rounded-lg bg-white" />
              )}
            </div>
          )}

          <div className="tb-v2-grid-2 mt-4">
            <div>
              <label className="tb-v2-tool-label">Position X (pt from left)</label>
              <input type="number" value={posX} onChange={e => setPosX(Number(e.target.value))} className="tb-v2-input" />
            </div>
            <div>
              <label className="tb-v2-tool-label">Position Y (pt from bottom)</label>
              <input type="number" value={posY} onChange={e => setPosY(Number(e.target.value))} className="tb-v2-input" />
            </div>
            <div>
              <label className="tb-v2-tool-label">Width (pt)</label>
              <input type="number" value={sigWidth} onChange={e => setSigWidth(Number(e.target.value))} className="tb-v2-input" />
            </div>
            <div>
              <label className="tb-v2-tool-label">Height (pt)</label>
              <input type="number" value={sigHeight} onChange={e => setSigHeight(Number(e.target.value))} className="tb-v2-input" />
            </div>
          </div>

          <button
            onClick={process}
            disabled={status === 'processing'}
            className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg w-full mt-4"
          >
            {status === 'processing' ? '⏳ Signing...' : '✍️ Sign PDF'}
          </button>
        </>
      )}

      {status === 'done' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl mt-4">
          <p className="text-sm text-green-600 dark:text-green-400 mb-2">✅ {message}</p>
          <button
            onClick={downloadResult}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Download Signed PDF
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl mt-4">
          <p className="text-sm text-red-600 dark:text-red-400">❌ {message}</p>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4">
        This tool places a visual signature image onto your PDF. It does not apply a cryptographic digital signature or legal e-signature certificate.
      </p>
    </div>
  );
}
