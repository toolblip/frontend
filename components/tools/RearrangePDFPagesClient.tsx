'use client';

import { useRef, useState } from 'react';
import { PDFDocument, degrees, StandardFonts, rgb } from 'pdf-lib';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

interface PageItem {
  originalIndex: number;
  rotation: number;
  previewUrl: string | null;
}

type Status = 'idle' | 'loading' | 'processing' | 'done' | 'error';

async function renderPageThumbnail(bytes: Uint8Array, pageNumber: number): Promise<string | null> {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/pdf-worker/pdf.worker.min.mjs`;
    const task = pdfjs.getDocument({ data: bytes.slice() });
    try {
      const doc = await task.promise;
      const page = await doc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 0.28 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext('2d');
      if (!context) return null;
      await page.render({ canvas, canvasContext: context, viewport }).promise;
      return canvas.toDataURL('image/png');
    } finally {
      await task.destroy();
    }
  } catch {
    return null;
  }
}

export default function RearrangePDFPagesClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const loadVersionRef = useRef(0);

  const revokePreviews = (items: PageItem[]) => items.forEach(item => { if (item.previewUrl) URL.revokeObjectURL(item.previewUrl); });

  const reset = () => {
    loadVersionRef.current += 1;
    revokePreviews(pages);
    setFile(null);
    setPages([]);
    setStatus('idle');
    setMessage('');
    setResultBlob(null);
    setIsDragging(false);
    setDraggingIndex(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleFile = async (selectedFile: File | undefined, requestId = ++loadVersionRef.current) => {
    if (!selectedFile) return;
    setStatus('loading');
    setMessage('');
    setResultBlob(null);
    if (selectedFile.type !== 'application/pdf' && !/\.pdf$/i.test(selectedFile.name)) {
      setStatus('error');
      setMessage('Please choose a PDF file.');
      return;
    }
    try {
      const bytes = new Uint8Array(await selectedFile.arrayBuffer());
      const pdfDoc = await PDFDocument.load(bytes);
      const pageCount = pdfDoc.getPageCount();
      const nextPages: PageItem[] = [];
      for (let index = 0; index < pageCount; index++) {
        nextPages.push({ originalIndex: index, rotation: ((pdfDoc.getPage(index).getRotation().angle % 360) + 360) % 360, previewUrl: await renderPageThumbnail(bytes, index + 1) });
      }
      if (requestId !== loadVersionRef.current) {
        revokePreviews(nextPages);
        return;
      }
      revokePreviews(pages);
      setFile(selectedFile);
      setPages(nextPages);
      setStatus('idle');
    } catch {
      if (requestId === loadVersionRef.current) {
        setStatus('error');
        setMessage('Could not read this PDF. Please choose a valid PDF file.');
      }
    }
  };

  const loadExample = async () => {
    const requestId = ++loadVersionRef.current;
    setStatus('loading');
    setMessage('');
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      ['Cover page', 'Project details', 'Next steps'].forEach((title, index) => {
        const page = doc.addPage([612, 792]);
        page.drawText(title, { x: 60, y: 700, size: 26, font, color: rgb(0.1, 0.2, 0.4) });
        page.drawText(`Sample page ${index + 1} — drag pages to change this order.`, { x: 60, y: 660, size: 13, font, color: rgb(0.35, 0.35, 0.35) });
      });
      if (requestId === loadVersionRef.current) await handleFile(new File([await doc.save() as BlobPart], 'rearrange-sample.pdf', { type: 'application/pdf' }), requestId);
    } catch {
      if (requestId === loadVersionRef.current) { setStatus('error'); setMessage('Could not create the sample PDF.'); }
    }
  };

  const movePage = (from: number, to: number) => {
    if (to < 0 || to >= pages.length) return;
    const next = [...pages];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setPages(next);
    setResultBlob(null);
    setStatus('idle');
  };

  const rotatePage = (index: number) => {
    setPages(current => current.map((page, pageIndex) => pageIndex === index ? { ...page, rotation: (page.rotation + 90) % 360 } : page));
    setResultBlob(null);
    setStatus('idle');
  };

  const process = async () => {
    if (!file || pages.length === 0) return;
    setStatus('processing');
    setMessage('');
    try {
      const source = await PDFDocument.load(await file.arrayBuffer());
      const output = await PDFDocument.create();
      const copiedPages = await output.copyPages(source, pages.map(page => page.originalIndex));
      copiedPages.forEach((page, index) => { page.setRotation(degrees(pages[index].rotation)); output.addPage(page); });
      setResultBlob(new Blob([await output.save() as BlobPart], { type: 'application/pdf' }));
      setStatus('done');
      setMessage(`Reordered ${pages.length} pages successfully.`);
    } catch {
      setStatus('error');
      setMessage('Could not process this PDF. Please try again.');
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
        <span className="tb-v2-tool-label">PDF file</span>
        <ToolExampleClearActions onExample={() => void loadExample()} onClear={reset} canClear={Boolean(file || pages.length || message)} exampleCount={1} exampleDisabled={status === 'loading' || status === 'processing'} />
      </div>

      {!file && (
        <div style={{ padding: 20 }}>
          <div className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`} onClick={() => fileRef.current?.click()} onDragOver={event => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={event => { event.preventDefault(); setIsDragging(false); void handleFile(event.dataTransfer.files?.[0]); }}>
            <span style={{ fontSize: 28 }}>📄</span>
            <span className="tb-v2-dropzone-text">{status === 'loading' ? 'Loading PDF...' : 'Click or drag a PDF here'}</span>
            <span className="tb-v2-dropzone-hint">Drag page cards to set the final order</span>
            <input ref={fileRef} type="file" accept="application/pdf,.pdf" onChange={event => void handleFile(event.target.files?.[0])} style={{ display: 'none' }} />
          </div>
        </div>
      )}

      {status === 'loading' && <div className="tb-v2-banner" role="status" style={{ margin: '0 20px 20px' }}>Preparing page previews in your browser...</div>}
      {status === 'error' && <div className="tb-v2-banner tb-v2-banner-err" role="alert" style={{ margin: '0 20px 20px' }}>{message}</div>}

      {file && pages.length > 0 && (
        <div className="tb-v2-tool-output-body tb-pdf-rearrange-workspace">
          <div className="tb-pdf-rearrange-summary">
            <span className="tb-v2-tool-label">{pages.length} page{pages.length === 1 ? '' : 's'} ready to arrange</span>
            <button type="button" className="tb-v2-btn-sm" onClick={() => fileRef.current?.click()}>＋ Replace PDF</button>
            <input ref={fileRef} type="file" accept="application/pdf,.pdf" onChange={event => void handleFile(event.target.files?.[0])} style={{ display: 'none' }} />
          </div>
          <p className="tb-pdf-rearrange-instruction">Drag and drop the page cards to reorder them. Rotate any page before saving.</p>
          <div className="tb-pdf-rearrange-grid">
            {pages.map((page, index) => (
              <div key={page.originalIndex} className={`tb-pdf-rearrange-card ${draggingIndex === index ? 'dragging' : ''}`} draggable onDragStart={() => setDraggingIndex(index)} onDragOver={event => event.preventDefault()} onDrop={() => { if (draggingIndex !== null) movePage(draggingIndex, index); setDraggingIndex(null); }} onDragEnd={() => setDraggingIndex(null)}>
                <span className="tb-pdf-rearrange-drag-handle" aria-hidden="true">⠿</span>
                <span className="tb-pdf-rearrange-order">{index + 1}</span>
                <div className="tb-pdf-rearrange-thumbnail" style={{ transform: `rotate(${page.rotation}deg)` }}>
                  {page.previewUrl ? <img src={page.previewUrl} alt={`Preview of page ${page.originalIndex + 1}`} /> : <span aria-hidden="true">📄</span>}
                </div>
                <strong>Page {page.originalIndex + 1}</strong>
                <small>{page.rotation}° rotation</small>
                <div className="tb-pdf-rearrange-card-actions">
                  <button type="button" className="tb-v2-btn-sm" onClick={() => rotatePage(index)}>↻ Rotate</button>
                  <button type="button" className="tb-v2-btn-sm" aria-label={`Move page ${page.originalIndex + 1} up`} disabled={index === 0} onClick={() => movePage(index, index - 1)}>↑</button>
                  <button type="button" className="tb-v2-btn-sm" aria-label={`Move page ${page.originalIndex + 1} down`} disabled={index === pages.length - 1} onClick={() => movePage(index, index + 1)}>↓</button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="tb-v2-btn tb-v2-btn-primary tb-pdf-rearrange-action" onClick={() => void process()} disabled={status === 'processing'}>{status === 'processing' ? 'Saving...' : 'Save reordered PDF'}</button>
          {status === 'done' && <div className="tb-v2-banner tb-pdf-rearrange-success" role="status">{message}<button type="button" className="tb-v2-btn-sm" onClick={downloadResult}>Download reordered PDF</button></div>}
        </div>
      )}

      {!file && status === 'idle' && <p className="tb-v2-empty">Upload a PDF or load the sample to arrange its pages.</p>}
    </div>
  );
}
