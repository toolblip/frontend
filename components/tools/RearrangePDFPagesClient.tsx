'use client';

import { useCallback, useRef, useState } from 'react';
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';
import { useSubscription } from '@/hooks/useSubscription';
import { checkFileSize } from '@/lib/tier-limits';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const isPdfFile = (file: File) =>
  file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

export default function RearrangePDFPagesClient() {
  const { tier } = useSubscription();
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [order, setOrder] = useState<number[]>([]);
  const [rotations, setRotations] = useState<number[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragIndexRef = useRef<number | null>(null);
  const loadVersionRef = useRef(0);

  const clearAll = () => {
    loadVersionRef.current += 1;
    setFile(null);
    setFileBytes(null);
    setPageCount(0);
    setOrder([]);
    setRotations([]);
    setStatus('idle');
    setMessage('');
    setResultBlob(null);
    setIsDragging(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const loadFile = useCallback(async (selected: File | undefined, requestId = ++loadVersionRef.current) => {
    if (!selected) return;
    setFile(null);
    setFileBytes(null);
    setPageCount(0);
    setOrder([]);
    setRotations([]);
    setResultBlob(null);
    setMessage('');
    setStatus('idle');
    if (!isPdfFile(selected)) {
      setStatus('error');
      setMessage('Please choose a PDF file.');
      return;
    }
    const sizeError = checkFileSize(selected, tier);
    if (sizeError) {
      setStatus('error');
      setMessage(sizeError);
      return;
    }
    setStatus('loading');
    try {
      const bytes = new Uint8Array(await selected.arrayBuffer());
      const pdfDoc = await PDFDocument.load(bytes);
      const pages = pdfDoc.getPages();
      if (pages.length === 0) throw new Error('The PDF has no pages.');
      if (requestId !== loadVersionRef.current) return;
      setFile(selected);
      setFileBytes(bytes);
      setPageCount(pages.length);
      setOrder(pages.map((_, index) => index));
      setRotations(pages.map((page) => ((page.getRotation().angle % 360) + 360) % 360));
      setStatus('idle');
    } catch {
      if (requestId === loadVersionRef.current) {
        setStatus('error');
        setMessage('Could not read this file as a valid PDF.');
      }
    }
  }, [tier]);

  const loadExample = useCallback(async () => {
    const requestId = ++loadVersionRef.current;
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      ['First page', 'Second page', 'Third page'].forEach((title, index) => {
        const page = doc.addPage([500, 320]);
        page.drawRectangle({ x: 0, y: 0, width: 500, height: 320, color: rgb(0.95, 0.97, 1) });
        page.drawText(title, { x: 60, y: 220, size: 28, font, color: rgb(0.1, 0.2, 0.45) });
        page.drawText(`Example page ${index + 1}`, { x: 60, y: 180, size: 16, font });
      });
      const bytes = await doc.save();
      if (requestId !== loadVersionRef.current) return;
      await loadFile(new File([bytes as BlobPart], 'rearrange-sample.pdf', { type: 'application/pdf' }), requestId);
    } catch {
      if (requestId === loadVersionRef.current) {
        setStatus('error');
        setMessage('Could not create the sample PDF.');
      }
    }
  }, [loadFile]);

  const invalidateResult = () => {
    setResultBlob(null);
    setMessage('');
    setStatus('idle');
  };

  const movePage = (displayIndex: number, direction: -1 | 1) => {
    if (status === 'processing') return;
    const target = displayIndex + direction;
    if (target < 0 || target >= order.length) return;
    invalidateResult();
    setOrder((previous) => {
      const next = [...previous];
      [next[displayIndex], next[target]] = [next[target], next[displayIndex]];
      return next;
    });
  };

  const rotatePage = (originalIndex: number) => {
    if (status === 'processing') return;
    invalidateResult();
    setRotations((previous) => {
      const next = [...previous];
      next[originalIndex] = (next[originalIndex] + 90) % 360;
      return next;
    });
  };

  const onItemDragStart = (displayIndex: number) => {
    if (status !== 'processing') dragIndexRef.current = displayIndex;
  };

  const onItemDrop = (displayIndex: number) => {
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    if (status === 'processing' || from === null || from === displayIndex) return;
    invalidateResult();
    setOrder((previous) => {
      const next = [...previous];
      const [moved] = next.splice(from, 1);
      next.splice(displayIndex, 0, moved);
      return next;
    });
  };

  const process = async () => {
    if (!fileBytes || order.length === 0 || status === 'processing') return;
    const requestId = ++loadVersionRef.current;
    setStatus('processing');
    setMessage('');
    try {
      const source = await PDFDocument.load(fileBytes);
      const output = await PDFDocument.create();
      const copiedPages = await output.copyPages(source, order);
      copiedPages.forEach((page, index) => {
        const originalIndex = order[index];
        page.setRotation(degrees(rotations[originalIndex] ?? 0));
        output.addPage(page);
      });
      const bytes = await output.save();
      if (requestId !== loadVersionRef.current) return;
      setResultBlob(new Blob([bytes as BlobPart], { type: 'application/pdf' }));
      setStatus('done');
      setMessage(`Saved ${order.length} page${order.length === 1 ? '' : 's'} in the selected order.`);
    } catch {
      if (requestId === loadVersionRef.current) {
        setStatus('error');
        setMessage('Could not process this PDF.');
      }
    }
  };

  const downloadResult = () => {
    if (!resultBlob || !file) return;
    const url = URL.createObjectURL(resultBlob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `rearranged-${file.name}`;
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
          canClear={Boolean(file || resultBlob || message)}
          exampleCount={1}
        />
      </div>
      <div style={{ padding: 20 }}>
        <div
          className="tb-v2-dropzone"
          onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            void loadFile(event.dataTransfer.files?.[0]);
          }}
          onClick={() => fileRef.current?.click()}
          style={isDragging ? { borderColor: 'var(--accent)' } : undefined}
        >
          <span style={{ fontSize: 28 }}>PDF</span>
          <span className="tb-v2-dropzone-text">{file?.name || 'Click or drag a PDF to reorder its pages'}</span>
          <span className="tb-v2-dropzone-hint">Pages are rearranged locally in your browser</span>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={(event) => void loadFile(event.target.files?.[0])}
            style={{ display: 'none' }}
          />
        </div>
        {status === 'loading' && <p className="tb-v2-empty">Reading PDF...</p>}
        {status === 'error' && <div className="tb-v2-banner tb-v2-banner-err" role="alert">{message}</div>}
      </div>

      {file && order.length > 0 && (
        <div style={{ padding: '0 20px 20px' }}>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">{file.name} - {pageCount} page{pageCount === 1 ? '' : 's'}</span>
          </div>
          <div className="tb-v2-option-group" style={{ marginTop: 12 }}>
            <span className="tb-v2-tool-label">Pages</span>
            <span className="tb-v2-empty">Drag a page, or use the arrows, to change order. Rotate adds 90 degrees.</span>
          </div>
          <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
            {order.map((originalIndex, displayIndex) => (
              <div
                key={originalIndex}
                draggable={status !== 'processing'}
                onDragStart={() => onItemDragStart(displayIndex)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => onItemDrop(displayIndex)}
                className="tb-v2-section"
                style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: 12, cursor: status === 'processing' ? 'default' : 'grab' }}
              >
                <span className="tb-v2-tool-label" style={{ minWidth: 70 }}>Position {displayIndex + 1}</span>
                <span style={{ flex: 1, minWidth: 130 }}>Original page {originalIndex + 1} - {rotations[originalIndex] ?? 0} deg</span>
                <button type="button" onClick={() => rotatePage(originalIndex)} disabled={status === 'processing'} className="tb-v2-btn-sm">Rotate</button>
                <button type="button" onClick={() => movePage(displayIndex, -1)} disabled={displayIndex === 0 || status === 'processing'} className="tb-v2-btn-sm">Up</button>
                <button type="button" onClick={() => movePage(displayIndex, 1)} disabled={displayIndex === order.length - 1 || status === 'processing'} className="tb-v2-btn-sm">Down</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => void process()} disabled={status === 'processing'} className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg" style={{ width: '100%', marginTop: 16 }}>
            {status === 'processing' ? 'Processing...' : 'Save Reordered PDF'}
          </button>
          {status === 'done' && resultBlob && (
            <div className="tb-v2-banner" style={{ marginTop: 12 }}>
              {message} <button type="button" onClick={downloadResult} className="tb-v2-btn-sm" style={{ marginLeft: 8 }}>Download PDF</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
