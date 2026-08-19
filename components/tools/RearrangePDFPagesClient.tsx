'use client';

import { useState, useRef } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';

export default function RearrangePDFPagesClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [order, setOrder] = useState<number[]>([]);
  const [rotations, setRotations] = useState<number[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragIndexRef = useRef<number | null>(null);

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setOrder([]);
    setRotations([]);
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
      const pages = pdfDoc.getPages();
      setPageCount(pages.length);
      setOrder(pages.map((_, i) => i));
      setRotations(pages.map(p => ((p.getRotation().angle % 360) + 360) % 360));
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

  const moveUp = (displayIndex: number) => {
    if (displayIndex === 0) return;
    setOrder(prev => {
      const next = [...prev];
      [next[displayIndex - 1], next[displayIndex]] = [next[displayIndex], next[displayIndex - 1]];
      return next;
    });
  };

  const moveDown = (displayIndex: number) => {
    setOrder(prev => {
      if (displayIndex >= prev.length - 1) return prev;
      const next = [...prev];
      [next[displayIndex + 1], next[displayIndex]] = [next[displayIndex], next[displayIndex + 1]];
      return next;
    });
  };

  const rotatePage = (originalIndex: number) => {
    setRotations(prev => {
      const next = [...prev];
      next[originalIndex] = (next[originalIndex] + 90) % 360;
      return next;
    });
  };

  const onItemDragStart = (displayIndex: number) => {
    dragIndexRef.current = displayIndex;
  };

  const onItemDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onItemDrop = (displayIndex: number) => {
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    if (from === null || from === displayIndex) return;
    setOrder(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(displayIndex, 0, moved);
      return next;
    });
  };

  const process = async () => {
    if (!file || order.length === 0) return;
    setStatus('processing');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(srcDoc, order);
      copiedPages.forEach((page, i) => {
        const originalIndex = order[i];
        page.setRotation(degrees(rotations[originalIndex] ?? 0));
        newDoc.addPage(page);
      });
      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      setResultBlob(blob);
      setStatus('done');
      setMessage('Reorganized PDF ready to download!');
    } catch {
      setStatus('error');
      setMessage('Error processing PDF. Please try again.');
    }
  };

  const downloadResult = () => {
    if (!resultBlob || !file) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rearranged-${file.name}`;
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
          <div className="text-4xl mb-2">📄</div>
          <p className="text-gray-600 dark:text-gray-400">
            {isDragging ? 'Drop PDF here' : 'Click or drag a PDF to reorder its pages'}
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

      {status === 'loading' && <p className="text-sm text-gray-500 mt-2">Reading PDF…</p>}

      {file && order.length > 0 && (
        <div className="mt-4">
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Pages (drag, or use arrows, to reorder — click ⟳ to rotate)</span>
          </div>
          <div className="space-y-2 mt-2">
            {order.map((originalIndex, displayIndex) => (
              <div
                key={originalIndex}
                draggable
                onDragStart={() => onItemDragStart(displayIndex)}
                onDragOver={onItemDragOver}
                onDrop={() => onItemDrop(displayIndex)}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 cursor-move"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold text-sm shrink-0">
                  {originalIndex + 1}
                </span>
                <span className="text-sm text-gray-500 flex-1">
                  Original page {originalIndex + 1} · rotation {rotations[originalIndex] ?? 0}°
                </span>
                <button
                  type="button"
                  onClick={() => rotatePage(originalIndex)}
                  className="tb-v2-btn-sm"
                  title="Rotate 90°"
                >
                  ⟳ Rotate
                </button>
                <button
                  type="button"
                  onClick={() => moveUp(displayIndex)}
                  disabled={displayIndex === 0}
                  className="tb-v2-btn-sm disabled:opacity-30"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(displayIndex)}
                  disabled={displayIndex === order.length - 1}
                  className="tb-v2-btn-sm disabled:opacity-30"
                  title="Move down"
                >
                  ↓
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {file && order.length > 0 && (
        <button
          onClick={process}
          disabled={status === 'processing'}
          className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg w-full mt-4"
        >
          {status === 'processing' ? '⏳ Processing...' : '📄 Save Reordered PDF'}
        </button>
      )}

      {status === 'done' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl mt-4">
          <p className="text-sm text-green-600 dark:text-green-400 mb-2">✅ {message}</p>
          <button
            onClick={downloadResult}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Download Reordered PDF
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl mt-4">
          <p className="text-sm text-red-600 dark:text-red-400">❌ {message}</p>
        </div>
      )}
    </div>
  );
}
