'use client';

import { useCallback, useRef, useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { useSubscription } from '@/hooks/useSubscription';
import { checkFileSize } from '@/lib/tier-limits';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const isPdfFile = (file: File) =>
  file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

type PageState = { index: number; selected: boolean };

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadVersionRef = useRef(0);

  const clearAll = () => {
    loadVersionRef.current += 1;
    setFile(null);
    setFileBytes(null);
    setPages([]);
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
    setPages([]);
    setResult(null);
    setError('');
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
      const bytes = new Uint8Array(await selected.arrayBuffer());
      const doc = await PDFDocument.load(bytes);
      const pageCount = doc.getPageCount();
      if (pageCount === 0) throw new Error('The PDF has no pages.');
      if (requestId !== loadVersionRef.current) return;
      setFile(selected);
      setFileBytes(bytes);
      setPages(Array.from({ length: pageCount }, (_, index) => ({ index, selected: false })));
    } catch {
      if (requestId === loadVersionRef.current) setError('Could not read this file as a valid PDF.');
    } finally {
      if (requestId === loadVersionRef.current) setLoading(false);
    }
  }, [tier]);

  const loadExample = useCallback(async () => {
    const requestId = ++loadVersionRef.current;
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      ['Keep this page', 'Remove this page', 'Keep this page', 'Remove this page'].forEach((label, index) => {
        const page = doc.addPage([500, 320]);
        page.drawRectangle({ x: 0, y: 0, width: 500, height: 320, color: index % 2 ? rgb(1, 0.95, 0.95) : rgb(0.95, 0.98, 0.95) });
        page.drawText(label, { x: 60, y: 190, size: 26, font, color: index % 2 ? rgb(0.65, 0.1, 0.1) : rgb(0.1, 0.4, 0.2) });
        page.drawText(`Example page ${index + 1}`, { x: 60, y: 150, size: 16, font });
      });
      const bytes = await doc.save();
      if (requestId !== loadVersionRef.current) return;
      await loadFile(new File([bytes as BlobPart], 'delete-pages-sample.pdf', { type: 'application/pdf' }), requestId);
    } catch {
      if (requestId === loadVersionRef.current) setError('Could not create the sample PDF.');
    }
  }, [loadFile]);

  const clearResult = () => {
    setResult(null);
    setError('');
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
      const source = await PDFDocument.load(fileBytes);
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
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">PDF File</span>
        <ToolExampleClearActions
          onExample={() => void loadExample()}
          onClear={clearAll}
          canClear={Boolean(file || pages.length || result || error)}
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
          onClick={() => fileInputRef.current?.click()}
          style={isDragging ? { borderColor: 'var(--accent)' } : undefined}
        >
          <span style={{ fontSize: 28 }}>PDF</span>
          <span className="tb-v2-dropzone-text">{file?.name || 'Click or drag a PDF to remove pages'}</span>
          <span className="tb-v2-dropzone-hint">Select pages locally, then download a new PDF</span>
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

      {file && pages.length > 0 && (
        <div style={{ padding: '0 20px 20px' }}>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">{file.name} - {pages.length} pages, {selectedCount} selected</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
            <button type="button" onClick={selectAll} disabled={processing} className="tb-v2-btn-sm">Select All</button>
            <button type="button" onClick={deselectAll} disabled={processing} className="tb-v2-btn-sm">Deselect All</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10, marginTop: 12 }}>
            {pages.map((page) => (
              <button
                key={page.index}
                type="button"
                onClick={() => togglePage(page.index)}
                disabled={processing}
                aria-pressed={page.selected}
                aria-label={`Page ${page.index + 1}, ${page.selected ? 'selected for deletion' : 'kept'}`}
                className="tb-v2-section"
                style={{ padding: 14, textAlign: 'center', border: `2px solid ${page.selected ? 'var(--danger, #dc2626)' : 'var(--border)'}`, background: page.selected ? 'rgba(220, 38, 38, 0.08)' : undefined }}
              >
                <div style={{ fontSize: 28 }}>PDF</div>
                <div>Page {page.index + 1}</div>
                <div className="tb-v2-empty">{page.selected ? 'Selected' : 'Keep'}</div>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => void deleteSelected()} disabled={selectedCount === 0 || selectedCount === pages.length || processing} className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg" style={{ width: '100%', marginTop: 16 }}>
            {processing ? 'Processing...' : `Delete ${selectedCount} Page${selectedCount === 1 ? '' : 's'}`}
          </button>
          {selectedCount === pages.length && (
            <div className="tb-v2-banner tb-v2-banner-err" role="alert" style={{ marginTop: 12 }}>
              Keep at least one page. Deselect one page before deleting.
            </div>
          )}
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
