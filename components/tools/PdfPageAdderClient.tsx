'use client';

import { useState, useCallback, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useSubscription } from '@/hooks/useSubscription';
import { checkFileSize } from '@/lib/tier-limits';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const isPdfFile = (file: File) =>
  file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

export default function PdfPageAdderClient() {
  const { tier } = useSubscription();
  const [baseFile, setBaseFile] = useState<File | null>(null);
  const [insertFile, setInsertFile] = useState<File | null>(null);
  const [baseBytes, setBaseBytes] = useState<Uint8Array | null>(null);
  const [insertMode, setInsertMode] = useState<'pdf' | 'blank'>('pdf');
  const [blankCount, setBlankCount] = useState(1);
  const [position, setPosition] = useState<'beginning' | 'end' | 'custom'>('end');
  const [customPosition, setCustomPosition] = useState(1);
  const [basePageCount, setBasePageCount] = useState(0);
  const [baseLoading, setBaseLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; blob?: Blob } | null>(null);
  const baseInputRef = useRef<HTMLInputElement>(null);
  const insertInputRef = useRef<HTMLInputElement>(null);
  const baseLoadVersionRef = useRef(0);
  const insertLoadVersionRef = useRef(0);

  const clearAll = () => { baseLoadVersionRef.current += 1; insertLoadVersionRef.current += 1; setBaseFile(null); setInsertFile(null); setBaseBytes(null); setBasePageCount(0); setResult(null); setProcessing(false); setBaseLoading(false); setInsertMode('pdf'); setBlankCount(1); setPosition('end'); setCustomPosition(1); if (baseInputRef.current) baseInputRef.current.value = ''; if (insertInputRef.current) insertInputRef.current.value = ''; };

  const loadExample = useCallback(async () => {
    const baseRequestId = ++baseLoadVersionRef.current;
    const insertRequestId = ++insertLoadVersionRef.current;
    const base = await PDFDocument.create(); base.addPage([400, 300]); base.addPage([400, 300]);
    const insert = await PDFDocument.create(); insert.addPage([400, 300]);
    const b = await base.save(); const i = await insert.save();
    if (baseRequestId !== baseLoadVersionRef.current || insertRequestId !== insertLoadVersionRef.current) return;
    const baseFileValue = new File([b as BlobPart], 'sample-base.pdf', { type: 'application/pdf' });
    const insertFileValue = new File([i as BlobPart], 'sample-insert.pdf', { type: 'application/pdf' });
    setBaseFile(baseFileValue); setInsertFile(insertFileValue); setBaseBytes(b); setBasePageCount(2); setBaseLoading(false); setInsertMode('pdf'); setPosition('end'); setCustomPosition(1); setResult(null);
  }, []);

  const loadBaseFile = useCallback(async (selected: File | undefined) => {
    if (!selected) return;
    const requestId = ++baseLoadVersionRef.current;
    setBaseFile(null);
    setBaseBytes(null);
    setBasePageCount(0);
    if (!isPdfFile(selected)) {
      setBaseLoading(false);
      setResult({ success: false, message: 'Please choose a base PDF file.' });
      return;
    }
    const sizeError = checkFileSize(selected, tier);
    if (sizeError) {
      setBaseLoading(false);
      setResult({ success: false, message: sizeError });
      return;
    }
    setResult(null);
    setBaseLoading(true);
    try {
      const bytes = new Uint8Array(await selected.arrayBuffer());
      const doc = await PDFDocument.load(bytes);
      if (doc.getPageCount() === 0) throw new Error('The PDF has no pages.');
      if (requestId !== baseLoadVersionRef.current) return;
      setBaseFile(selected);
      setBaseBytes(bytes);
      setBasePageCount(doc.getPageCount());
      setCustomPosition(1);
    } catch (err: any) {
      if (requestId !== baseLoadVersionRef.current) return;
      setResult({ success: false, message: `Error loading base PDF: ${err.message}` });
    } finally {
      if (requestId === baseLoadVersionRef.current) setBaseLoading(false);
    }
  }, [tier]);

  const loadInsertFile = useCallback(async (selected: File | undefined) => {
    if (!selected) return;
    const requestId = ++insertLoadVersionRef.current;
    setInsertFile(null);
    if (!isPdfFile(selected)) {
      setResult({ success: false, message: 'Please choose a PDF to insert.' });
      return;
    }
    const sizeError = checkFileSize(selected, tier);
    if (sizeError) {
      setResult({ success: false, message: sizeError });
      return;
    }
    setResult(null);
    try {
      const doc = await PDFDocument.load(await selected.arrayBuffer());
      if (doc.getPageCount() === 0) throw new Error('The PDF has no pages.');
      if (requestId !== insertLoadVersionRef.current) return;
      setInsertFile(selected);
    } catch (err: any) {
      if (requestId !== insertLoadVersionRef.current) return;
      setResult({ success: false, message: `Error loading insert PDF: ${err.message}` });
    }
  }, [tier]);

  const handleBaseFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    void loadBaseFile(e.target.files?.[0]);
  }, [loadBaseFile]);

  const handleInsertFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    void loadInsertFile(e.target.files?.[0]);
  }, [loadInsertFile]);

  const handleDrop = useCallback(async (e: React.DragEvent, type: 'base' | 'insert') => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (type === 'base') await loadBaseFile(dropped);
    else await loadInsertFile(dropped);
  }, [loadBaseFile, loadInsertFile]);

  const addPages = async () => {
    if (!baseBytes || !baseFile || basePageCount === 0 || (insertMode === 'pdf' && !insertFile)) { setResult({ success: false, message: insertMode === 'pdf' ? 'Choose a valid base PDF and a PDF to insert.' : 'Choose a valid base PDF and the number of blank pages.' }); return; }
    
    setProcessing(true);
    try {
      const baseDoc = await PDFDocument.load(baseBytes);
      const insertDoc = insertMode === 'pdf' && insertFile ? await PDFDocument.load(await insertFile.arrayBuffer()) : null;
      const insertPageCount = insertDoc ? insertDoc.getPageCount() : blankCount;
      const originalPageCount = baseDoc.getPageCount();
      
      // Determine insertion index
      let insertIndex: number;
      if (position === 'beginning') {
        insertIndex = 0;
      } else if (position === 'end') {
        insertIndex = originalPageCount;
      } else {
        insertIndex = Math.min(Math.max(0, customPosition - 1), originalPageCount);
      }
      
      // Copy pages from insert document
      if (insertDoc) {
        const pagesToInsert = await baseDoc.copyPages(insertDoc, insertDoc.getPageIndices());
        pagesToInsert.forEach((page, i) => baseDoc.insertPage(insertIndex + i, page));
      } else {
        for (let i = 0; i < blankCount; i++) baseDoc.insertPage(insertIndex + i, [612, 792]);
      }
      
      const pdfBytes = await baseDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      
      setResult({
        success: true,
        message: `Added ${insertPageCount} page(s) to ${position === 'custom' ? `position ${Math.min(Math.max(1, customPosition), originalPageCount + 1)}` : position}. Total pages: ${originalPageCount + insertPageCount}`,
        blob,
      });
    } catch (err: any) {
      setResult({
        success: false,
        message: `Error: ${err.message}`,
      });
    } finally {
      setProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result?.blob) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = baseFile?.name?.replace('.pdf', '_merged.pdf') || 'merged.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tb-v2-tool-card">
      {/* Base PDF Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Base PDF (pages will be added to this)</label>
        <div
          onDrop={(e) => handleDrop(e, 'base')}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors"
        >
          <input
            type="file"
            accept=".pdf"
            ref={baseInputRef}
            onChange={handleBaseFileChange}
            className="hidden"
            id="base-pdf-upload"
          />
            <label htmlFor="base-pdf-upload" className="cursor-pointer">
             <div className="text-3xl mb-2">📄</div>
              <div>{baseFile?.name || 'Choose a base PDF'}</div>
            </label>
        </div>
      </div>

      {/* Insert PDF Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">PDF to Insert (pages to add)</label>
        <div
          onDrop={(e) => handleDrop(e, 'insert')}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors"
        >
          <input
            type="file"
            accept=".pdf"
            ref={insertInputRef}
            onChange={handleInsertFileChange}
            className="hidden"
            id="insert-pdf-upload"
          />
            <label htmlFor="insert-pdf-upload" className="cursor-pointer">
             <div className="text-3xl mb-2">📄</div>
              <div>{insertFile?.name || 'Choose a PDF to insert'}</div>
            </label>
        </div>
      </div>

      <div className="tb-v2-tool-input-head" style={{ marginTop: 12 }}><span className="tb-v2-tool-label">Page source</span><ToolExampleClearActions onExample={() => void loadExample()} onClear={clearAll} canClear={Boolean(baseFile || insertFile || result)} exampleCount={1} /></div>
      <div className="flex gap-3" style={{ marginTop: 8 }}>
        <button type="button" className={`tb-v2-mode-tab ${insertMode === 'pdf' ? 'on' : ''}`} onClick={() => setInsertMode('pdf')}>Pages from PDF</button>
        <button type="button" className={`tb-v2-mode-tab ${insertMode === 'blank' ? 'on' : ''}`} onClick={() => setInsertMode('blank')}>Blank pages</button>
      </div>
      {insertMode === 'blank' && <label className="text-sm">Blank pages <input aria-label="Number of blank pages" type="number" min={1} max={50} value={blankCount} onChange={e => setBlankCount(Math.min(50, Math.max(1, Number(e.target.value) || 1)))} className="w-20 p-2 border rounded" /></label>}

      {/* Position Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Insert Position</label>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setPosition('beginning')}
            className={`px-4 py-2 rounded-lg ${
              position === 'beginning'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            Beginning
          </button>
          <button
            type="button"
            onClick={() => setPosition('end')}
            className={`px-4 py-2 rounded-lg ${
              position === 'end'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            End
          </button>
          <button
            type="button"
            onClick={() => setPosition('custom')}
            className={`px-4 py-2 rounded-lg ${
              position === 'custom'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            Custom Position
          </button>
        </div>
        
        {position === 'custom' && (
          <div className="flex items-center gap-3">
            <label className="text-sm">Insert before page:</label>
            <input
              type="number"
              min={1}
              max={(basePageCount || 0) + 1}
              value={customPosition}
              onChange={(e) => setCustomPosition(Math.min((basePageCount || 0) + 1, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-20 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            />
            <span className="text-sm text-gray-500">
              (1 to {(basePageCount || 0) + 1}; use the last position to append)
            </span>
          </div>
        )}
      </div>

      {/* Process Button */}
      <button
        type="button"
        onClick={addPages}
        disabled={!baseBytes || baseLoading || (insertMode === 'pdf' && !insertFile) || processing}
        className="w-full py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {baseLoading ? 'Loading base PDF...' : processing ? 'Processing...' : 'Add Pages'}
      </button>

      {/* Result */}
      {result && (
        <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <p className={result.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
            {result.message}
          </p>
          {result.success && (
            <button
              type="button"
              onClick={downloadResult}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Download Merged PDF
            </button>
          )}
        </div>
      )}
    </div>
  );
}
