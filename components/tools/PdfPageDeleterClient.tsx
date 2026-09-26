'use client';

import { useCallback, useRef, useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { useSubscription } from '@/hooks/useSubscription';
import { checkFileSize } from '@/lib/tier-limits';
import { readPdfToolFile, loadPdfForTools } from '@/lib/pdf-qa/pdf';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const isPdfFile = (file: File) => file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

type PageState = { index: number; selected: boolean; previewUrl: string | null };

async function renderPagePreview(bytes: Uint8Array, pageNumber: number, scale: number): Promise<string | null> {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/pdf-worker/pdf.worker.min.mjs`;
    const task = pdfjs.getDocument({ data: bytes.slice() });
    try {
      const doc = await task.promise;
      const page = await doc.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
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

export default function PdfPageDeleterClient() {
  const { tier } = useSubscription();
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [pages, setPages] = useState<PageState[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ message: string; blob?: Blob } | null>(null);
  const [previewPageIndex, setPreviewPageIndex] = useState<number | null>(null);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadVersionRef = useRef(0);
  const previewRequestRef = useRef(0);

  const revokePreviews = (items: PageState[]) => {
    items.forEach((page) => {
      if (page.previewUrl) URL.revokeObjectURL(page.previewUrl);
    });
  };

  const clearAll = () => {
    loadVersionRef.current += 1;
    revokePreviews(pages);
    setFile(null);
    setFileBytes(null);
    setPages([]);
    setLoading(false);
    setProcessing(false);
    setIsDragging(false);
    setError('');
    setResult(null);
    previewRequestRef.current += 1;
    setPreviewPageIndex(null);
    setPreviewUrl(null);
    setPreviewLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadFile = useCallback(async (selected: File | undefined, requestId = ++loadVersionRef.current) => {
    if (!selected) return;
    setFile(null);
    setFileBytes(null);
    setPages([]);
    setResult(null);
    setError('');
    setProcessing(false);
    if (!isPdfFile(selected)) {
      setLoading(false);
      setError('Please choose a PDF file.');
      return;
    }
    const sizeError = checkFileSize(selected, tier);
    if (sizeError) {
      setLoading(false);
      setError(sizeError);
      return;
    }
    setLoading(true);
    try {
      const bytes = new Uint8Array(await readPdfToolFile(selected));
      if (requestId !== loadVersionRef.current) return;
      const doc = await loadPdfForTools(bytes);
      const pageCount = doc.getPageCount();
      if (pageCount === 0) throw new Error('The PDF has no pages.');
      const nextPages: PageState[] = [];
      for (let index = 0; index < pageCount; index += 1) {
        if (requestId !== loadVersionRef.current) return;
        nextPages.push({ index, selected: false, previewUrl: await renderPagePreview(bytes, index + 1, 0.28) });
      }
      if (requestId !== loadVersionRef.current) {
        revokePreviews(nextPages);
        return;
      }
      revokePreviews(pages);
      setFile(selected);
      setFileBytes(bytes);
      setPages(nextPages);
    } catch {
      if (requestId === loadVersionRef.current) setError('Could not read this file as a valid PDF.');
    } finally {
      if (requestId === loadVersionRef.current) setLoading(false);
    }
  }, [pages, tier]);

  const loadExample = useCallback(async () => {
    const requestId = ++loadVersionRef.current;
    setLoading(true);
    setError('');
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      ['Keep this page', 'Remove this page', 'Keep this page', 'Remove this page'].forEach((label, index) => {
        const page = doc.addPage([500, 320]);
        page.drawRectangle({ x: 0, y: 0, width: 500, height: 320, color: index % 2 ? rgb(1, 0.95, 0.95) : rgb(0.95, 0.98, 0.95) });
        page.drawText(label, { x: 60, y: 190, size: 26, font, color: index % 2 ? rgb(0.65, 0.1, 0.1) : rgb(0.1, 0.4, 0.2) });
        page.drawText(`Example page ${index + 1}`, { x: 60, y: 150, size: 16, font });
      });
      if (requestId === loadVersionRef.current) {
        await loadFile(new File([await doc.save() as BlobPart], 'delete-pages-sample.pdf', { type: 'application/pdf' }), requestId);
      }
    } catch {
      if (requestId === loadVersionRef.current) {
        setLoading(false);
        setError('Could not create the sample PDF.');
      }
    }
  }, [loadFile]);

  const clearResult = () => {
    setResult(null);
    setError('');
  };

  const closePreview = () => {
    previewRequestRef.current += 1;
    setPreviewPageIndex(null);
    setPreviewUrl(null);
    setPreviewLoading(false);
  };

  const openPreview = async (index: number, zoom = 1) => {
    if (!fileBytes) return;
    const requestId = ++previewRequestRef.current;
    setPreviewPageIndex(index);
    setPreviewZoom(zoom);
    setPreviewUrl(null);
    setPreviewLoading(true);
    const nextPreview = await renderPagePreview(fileBytes, index + 1, zoom);
    if (requestId !== previewRequestRef.current) return;
    setPreviewUrl(nextPreview);
    setPreviewLoading(false);
  };

  const changePreviewZoom = (delta: number) => {
    if (previewPageIndex === null) return;
    const nextZoom = Math.min(2, Math.max(0.75, Number((previewZoom + delta).toFixed(2))));
    void openPreview(previewPageIndex, nextZoom);
  };

  const togglePage = (index: number) => {
    if (processing) return;
    clearResult();
    setPages((previous) => previous.map((page) => page.index === index ? { ...page, selected: !page.selected } : page));
  };

  const selectAll = () => {
    if (processing) return;
    clearResult();
    setPages((previous) => previous.map((page) => ({ ...page, selected: true })));
  };

  const deselectAll = () => {
    if (processing) return;
    clearResult();
    setPages((previous) => previous.map((page) => ({ ...page, selected: false })));
  };

  const deleteSelected = async () => {
    if (!fileBytes || !file || processing) return;
    const selectedCount = pages.filter((page) => page.selected).length;
    if (selectedCount === 0) {
      setError('Select at least one page to delete.');
      return;
    }
    if (selectedCount === pages.length) {
      setError('Keep at least one page in the PDF.');
      return;
    }
    const requestId = ++loadVersionRef.current;
    setProcessing(true);
    setError('');
    try {
      const source = await loadPdfForTools(fileBytes);
      const output = await PDFDocument.create();
      const pagesToKeep = pages.filter((page) => !page.selected).map((page) => page.index);
      const copiedPages = await output.copyPages(source, pagesToKeep);
      copiedPages.forEach((page) => output.addPage(page));
      const bytes = await output.save();
      if (requestId !== loadVersionRef.current) return;
      setResult({
        message: `Deleted ${selectedCount} page${selectedCount === 1 ? '' : 's'}. ${pagesToKeep.length} page${pagesToKeep.length === 1 ? '' : 's'} remain.`,
        blob: new Blob([bytes as BlobPart], { type: 'application/pdf' }),
      });
    } catch {
      if (requestId === loadVersionRef.current) setError('Could not process this PDF.');
    } finally {
      if (requestId === loadVersionRef.current) setProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result?.blob || !file) return;
    const url = URL.createObjectURL(result.blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.name.replace(/\.pdf$/i, '_edited.pdf');
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const selectedCount = pages.filter((page) => page.selected).length;

  return (
    <div className="tb-v2-tool-card" style={{ minWidth: 0, maxWidth: "100%", overflowWrap: "anywhere" }}>
      <p className="tb-v2-empty">PDF limits: 25 MB per file, 100 pages, 2000 points per page side.</p>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">PDF file</span>
        <ToolExampleClearActions
          onExample={() => void loadExample()}
          onClear={clearAll}
          canClear={Boolean(file || pages.length || result || error || loading)}
          exampleCount={1}
          exampleDisabled={loading || processing}
        />
      </div>

      {!file && (
        <div style={{ padding: 20 }}>
          <div
            className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
            onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => { event.preventDefault(); setIsDragging(false); void loadFile(event.dataTransfer.files?.[0]); }}
            onClick={() => fileInputRef.current?.click()}
          >
            <span style={{ fontSize: 28 }}>📄</span>
            <span className="tb-v2-dropzone-text">{loading ? 'Loading PDF...' : 'Click or drag a PDF here'}</span>
            <span className="tb-v2-dropzone-hint">Select the pages to remove, then download a new PDF</span>
            <input ref={fileInputRef} aria-label="PDF file" type="file" accept="application/pdf,.pdf" onChange={(event) => void loadFile(event.target.files?.[0])} style={{ display: 'none' }} />
          </div>
        </div>
      )}

      {loading && <div className="tb-v2-banner" role="status" style={{ margin: '0 20px 20px' }}>Preparing page previews in your browser...</div>}
      {error && <div className="tb-v2-banner tb-v2-banner-err" role="alert" style={{ margin: '0 20px 20px' }}>{error}</div>}

      {file && pages.length > 0 && (
        <div className="tb-v2-tool-output-body tb-pdf-delete-workspace">
          <div className="tb-pdf-delete-summary">
            <span className="tb-v2-tool-label">{pages.length} pages · {selectedCount} selected to delete</span>
            <button type="button" className="tb-v2-btn-sm" onClick={() => fileInputRef.current?.click()}>＋ Replace PDF</button>
            <input ref={fileInputRef} aria-label="PDF file" type="file" accept="application/pdf,.pdf" onChange={(event) => void loadFile(event.target.files?.[0])} style={{ display: 'none' }} />
          </div>
          <p className="tb-pdf-delete-instruction">Select one or more page cards to remove. Keep at least one page.</p>
          <div className="tb-pdf-delete-controls">
            <button type="button" className="tb-v2-btn-sm" onClick={selectAll} disabled={processing}>Select all</button>
            <button type="button" className="tb-v2-btn-sm" onClick={deselectAll} disabled={processing}>Deselect all</button>
          </div>
          <div className="tb-pdf-delete-grid">
            {pages.map((page) => (
              <div key={page.index} className={`tb-pdf-delete-card ${page.selected ? 'selected' : ''}`}>
                <button
                  type="button"
                  className="tb-pdf-delete-select"
                  onClick={() => togglePage(page.index)}
                  disabled={processing}
                  aria-pressed={page.selected}
                  aria-label={`Page ${page.index + 1}, ${page.selected ? 'selected for deletion' : 'kept'}`}
                >
                  <span className="tb-pdf-delete-order">{page.index + 1}</span>
                  <div className="tb-pdf-delete-thumbnail">
                    {page.previewUrl ? <img src={page.previewUrl} alt={`Preview of page ${page.index + 1}`} /> : <span aria-hidden="true">📄</span>}
                  </div>
                  <strong>Page {page.index + 1}</strong>
                  <small>{page.selected ? 'Selected for deletion' : 'Keep'}</small>
                </button>
                <button type="button" className="tb-v2-btn-sm tb-pdf-delete-preview-button" onClick={() => void openPreview(page.index)} disabled={processing}>Preview page</button>
              </div>
            ))}
          </div>
          <button type="button" className="tb-v2-btn tb-v2-btn-primary tb-pdf-delete-action" onClick={() => void deleteSelected()} disabled={selectedCount === 0 || selectedCount === pages.length || processing}>
            {processing ? 'Deleting...' : `Delete ${selectedCount} page${selectedCount === 1 ? '' : 's'}`}
          </button>
          {selectedCount === pages.length && <div className="tb-v2-banner tb-v2-banner-err" role="alert" style={{ marginTop: 12 }}>Keep at least one page. Deselect one page before deleting.</div>}
          {result?.blob && <div className="tb-v2-banner tb-pdf-delete-success" role="status">{result.message}<button type="button" className="tb-v2-btn-sm" onClick={downloadResult}>Download edited PDF</button></div>}
        </div>
      )}

      {previewPageIndex !== null && (
        <div className="tb-pdf-delete-preview-backdrop" role="presentation" onClick={closePreview}>
          <div className="tb-pdf-delete-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="tb-pdf-delete-preview-title" onClick={(event) => event.stopPropagation()}>
            <div className="tb-pdf-delete-preview-head">
              <strong id="tb-pdf-delete-preview-title">Preview page {previewPageIndex + 1}</strong>
              <div className="tb-pdf-delete-preview-controls">
                <button type="button" className="tb-v2-btn-sm" aria-label="Zoom out preview" onClick={() => changePreviewZoom(-0.25)} disabled={previewZoom <= 0.75 || previewLoading}>−</button>
                <span>{Math.round(previewZoom * 100)}%</span>
                <button type="button" className="tb-v2-btn-sm" aria-label="Zoom in preview" onClick={() => changePreviewZoom(0.25)} disabled={previewZoom >= 2 || previewLoading}>＋</button>
                <button type="button" className="tb-v2-btn-sm" onClick={closePreview}>Close</button>
              </div>
            </div>
            <div className="tb-pdf-delete-preview-viewport">
              {previewLoading && <span className="tb-v2-empty">Rendering preview...</span>}
              {previewUrl && <img className="tb-pdf-delete-preview-image" src={previewUrl} alt={`Large preview of page ${previewPageIndex + 1}`} />}
            </div>
          </div>
        </div>
      )}

      {!file && !loading && !error && <p className="tb-v2-empty">Upload a PDF or load the sample to select pages for deletion.</p>}
    </div>
  );
}
