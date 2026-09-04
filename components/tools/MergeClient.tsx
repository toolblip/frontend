'use client';

import { useRef, useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';
import { useSubscription } from '@/hooks/useSubscription';
import { checkFileSize } from '@/lib/tier-limits';

type PdfFile = { file: File; doc: PDFDocument; previewUrl: string | null };
type Result = { success: boolean; message: string; blob?: Blob };

const isPdfFile = (file: File) => file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

async function renderThumbnail(file: File): Promise<string | null> {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/pdf-worker/pdf.worker.min.mjs`;
    const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
    try {
      const doc = await task.promise;
      const page = await doc.getPage(1);
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

export default function MergeClient() {
  const { tier } = useSubscription();
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadVersionRef = useRef(0);

  const loadFiles = async (selected: File[], replace = false, requestId = ++loadVersionRef.current) => {
    if (selected.length === 0) return;
    setLoading(true);
    setResult(null);
    const nextFiles: PdfFile[] = [];
    try {
      for (const file of selected) {
        if (!isPdfFile(file)) throw new Error(`${file.name}: please choose a PDF file.`);
        const sizeError = checkFileSize(file, tier);
        if (sizeError) throw new Error(`${file.name}: ${sizeError}`);
        const doc = await PDFDocument.load(await file.arrayBuffer());
        nextFiles.push({ file, doc, previewUrl: await renderThumbnail(file) });
      }
      if (requestId !== loadVersionRef.current) {
        nextFiles.forEach(entry => { if (entry.previewUrl) URL.revokeObjectURL(entry.previewUrl); });
        return;
      }
      setFiles(current => {
        if (replace) current.forEach(entry => { if (entry.previewUrl) URL.revokeObjectURL(entry.previewUrl); });
        return replace ? nextFiles : [...current, ...nextFiles];
      });
    } catch (error) {
      nextFiles.forEach(entry => { if (entry.previewUrl) URL.revokeObjectURL(entry.previewUrl); });
      if (requestId === loadVersionRef.current) setResult({ success: false, message: error instanceof Error ? error.message : 'Could not read the selected PDF files.' });
    } finally {
      if (requestId === loadVersionRef.current) setLoading(false);
    }
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    void loadFiles(Array.from(event.target.files || []));
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    void loadFiles(Array.from(event.dataTransfer.files || []));
  };

  const loadExample = async () => {
    const requestId = ++loadVersionRef.current;
    setLoading(true);
    setResult(null);
    try {
      const samples = await Promise.all(['First sample PDF', 'Second sample PDF'].map(async (title, index) => {
        const doc = await PDFDocument.create();
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const page = doc.addPage([612, 792]);
        page.drawText(title, { x: 60, y: 700, size: 24, font });
        page.drawText(`Page ${index + 1} is ready to merge.`, { x: 60, y: 660, size: 14, font, color: rgb(0.35, 0.35, 0.35) });
        return new File([await doc.save() as BlobPart], `sample-${index + 1}.pdf`, { type: 'application/pdf' });
      }));
      if (requestId === loadVersionRef.current) await loadFiles(samples, true, requestId);
    } catch (error) {
      if (requestId === loadVersionRef.current) {
        setResult({ success: false, message: error instanceof Error ? error.message : 'Could not create the sample PDFs.' });
        setLoading(false);
      }
    }
  };

  const clearAll = () => {
    ++loadVersionRef.current;
    files.forEach(entry => { if (entry.previewUrl) URL.revokeObjectURL(entry.previewUrl); });
    setFiles([]);
    setResult(null);
    setLoading(false);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(current => {
      const removed = current[index];
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return current.filter((_, fileIndex) => fileIndex !== index);
    });
    setResult(null);
  };

  const moveFile = (from: number, to: number) => {
    if (to < 0 || to >= files.length) return;
    const next = [...files];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setFiles(next);
    setResult(null);
  };

  const handleDropOnFile = (targetIndex: number) => {
    if (draggingIndex === null || draggingIndex === targetIndex) return;
    moveFile(draggingIndex, targetIndex);
    setDraggingIndex(null);
  };

  const mergePdfFiles = async () => {
    if (files.length < 2) {
      setResult({ success: false, message: 'Add at least 2 PDF files to merge.' });
      return;
    }
    setProcessing(true);
    setResult(null);
    try {
      const mergedDoc = await PDFDocument.create();
      for (const { doc } of files) {
        const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach(page => mergedDoc.addPage(page));
      }
      const pdfBytes = await mergedDoc.save();
      setResult({ success: true, message: `Merged ${files.length} PDFs into one document (${mergedDoc.getPageCount()} pages).`, blob: new Blob([pdfBytes as BlobPart], { type: 'application/pdf' }) });
    } catch (error) {
      setResult({ success: false, message: error instanceof Error ? error.message : 'Could not merge these PDF files.' });
    } finally {
      setProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result?.blob) return;
    const url = URL.createObjectURL(result.blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'merged.pdf';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">PDF files</span>
        <ToolExampleClearActions onExample={() => void loadExample()} onClear={clearAll} canClear={Boolean(files.length || result || loading)} exampleCount={1} exampleDisabled={loading || processing} />
      </div>

      {!files.length && (
        <div style={{ padding: 20 }}>
          <div className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`} onClick={() => fileInputRef.current?.click()} onDragOver={event => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}>
            <span style={{ fontSize: 28 }}>📄</span>
            <span className="tb-v2-dropzone-text">{loading ? 'Loading PDFs...' : 'Click or drag PDF files here'}</span>
            <span className="tb-v2-dropzone-hint">Choose two or more PDFs, then arrange them before merging</span>
            <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" multiple onChange={handleFilesChange} style={{ display: 'none' }} />
          </div>
        </div>
      )}

      {loading && <div className="tb-v2-banner" role="status" style={{ margin: '0 20px 20px' }}>Reading PDF files in your browser...</div>}
      {result && !result.success && <div className="tb-v2-banner tb-v2-banner-err" role="alert" style={{ margin: '0 20px 20px' }}>{result.message}</div>}

      {files.length > 0 && (
        <div className="tb-v2-tool-output-body tb-pdf-merge-workspace">
          <div className="tb-pdf-merge-summary">
            <span className="tb-v2-tool-label">{files.length} PDF{files.length === 1 ? '' : 's'} ready to merge</span>
            <button type="button" className="tb-v2-btn-sm" onClick={() => fileInputRef.current?.click()}>＋ Add files</button>
            <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" multiple onChange={handleFilesChange} style={{ display: 'none' }} />
          </div>
          <p className="tb-pdf-merge-instruction">Drag and drop the cards to set the merge order.</p>
          <div className="tb-pdf-merge-file-list">
            {files.map((entry, index) => (
              <div className={`tb-pdf-merge-file ${draggingIndex === index ? 'dragging' : ''}`} key={`${entry.file.name}-${index}`} draggable onDragStart={() => setDraggingIndex(index)} onDragOver={event => event.preventDefault()} onDrop={() => handleDropOnFile(index)} onDragEnd={() => setDraggingIndex(null)}>
                <span className="tb-pdf-merge-drag-handle" aria-hidden="true">⠿</span>
                <span className="tb-pdf-merge-order">{index + 1}</span>
                <div className="tb-pdf-merge-thumbnail">
                  {entry.previewUrl ? <img src={entry.previewUrl} alt={`Preview of ${entry.file.name}`} /> : <span aria-hidden="true">📄</span>}
                </div>
                <span className="tb-pdf-merge-file-info"><strong>{entry.file.name}</strong><small>{entry.doc.getPageCount()} page{entry.doc.getPageCount() === 1 ? '' : 's'} · {(entry.file.size / 1024).toFixed(1)} KB</small></span>
                <span className="tb-pdf-merge-file-actions">
                  <button type="button" className="tb-v2-btn-sm" aria-label={`Move ${entry.file.name} up`} disabled={index === 0} onClick={() => moveFile(index, index - 1)}>↑</button>
                  <button type="button" className="tb-v2-btn-sm" aria-label={`Move ${entry.file.name} down`} disabled={index === files.length - 1} onClick={() => moveFile(index, index + 1)}>↓</button>
                  <button type="button" className="tb-v2-btn-sm" aria-label={`Remove ${entry.file.name}`} onClick={() => removeFile(index)}>Remove</button>
                </span>
              </div>
            ))}
          </div>
          <button type="button" className="tb-v2-btn tb-v2-btn-primary tb-pdf-merge-action" onClick={() => void mergePdfFiles()} disabled={files.length < 2 || processing}>
            {processing ? 'Merging...' : 'Merge PDF'}
          </button>
          {result?.success && <div className="tb-v2-banner tb-pdf-merge-success" role="status">{result.message}<button type="button" className="tb-v2-btn-sm" onClick={downloadResult}>Download merged PDF</button></div>}
        </div>
      )}

      {!files.length && !result && !loading && <p className="tb-v2-empty">Upload PDFs or load the sample to begin.</p>}
    </div>
  );
}
