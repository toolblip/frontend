'use client';

import { useState, useCallback, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useSubscription } from '@/hooks/useSubscription';
import { checkFileSize } from '@/lib/tier-limits';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';
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
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; blob?: Blob } | null>(null);
  const baseInputRef = useRef<HTMLInputElement>(null);
  const insertInputRef = useRef<HTMLInputElement>(null);

  const clearAll = () => { setBaseFile(null); setInsertFile(null); setBaseBytes(null); setBasePageCount(0); setResult(null); setProcessing(false); setInsertMode('pdf'); setBlankCount(1); setPosition('end'); setCustomPosition(1); if (baseInputRef.current) baseInputRef.current.value = ''; if (insertInputRef.current) insertInputRef.current.value = ''; };

  const loadExample = useCallback(async () => {
    const base = await PDFDocument.create(); base.addPage([400, 300]); base.addPage([400, 300]);
    const insert = await PDFDocument.create(); insert.addPage([400, 300]);
    const b = await base.save(); const i = await insert.save();
    const baseFileValue = new File([b as BlobPart], 'sample-base.pdf', { type: 'application/pdf' });
    const insertFileValue = new File([i as BlobPart], 'sample-insert.pdf', { type: 'application/pdf' });
    setBaseFile(baseFileValue); setInsertFile(insertFileValue); setBaseBytes(b); setBasePageCount(2); setInsertMode('pdf'); setPosition('end'); setResult(null);
  }, []);

  const handleBaseFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      // Check file size against tier limit
      const sizeError = checkFileSize(selected, tier);
      if (sizeError) {
        setResult({ success: false, message: sizeError });
        return;
      }
      
      const bytes = new Uint8Array(await selected.arrayBuffer());
      setBaseFile(selected);
      setBaseBytes(bytes);
      setResult(null);
      
      try {
        const doc = await PDFDocument.load(bytes);
        setBasePageCount(doc.getPageCount());
      } catch (err: any) {
        setResult({
          success: false,
          message: `Error loading PDF: ${err.message}`,
        });
      }
    }
  }, [tier]);

  const handleInsertFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      const sizeError = checkFileSize(selected, tier);
      if (sizeError) { setResult({ success: false, message: sizeError }); return; }
      setInsertFile(selected);
      setResult(null);
    }
  }, [tier]);

  const handleDrop = useCallback(async (e: React.DragEvent, type: 'base' | 'insert') => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type === 'application/pdf') {
      // Check file size against tier limit
      const sizeError = checkFileSize(dropped, tier);
      if (sizeError) {
        setResult({ success: false, message: sizeError });
        return;
      }
      
      if (type === 'base') {
        setBaseFile(dropped);
        setResult(null);
        
        try {
          const bytes = new Uint8Array(await dropped.arrayBuffer());
          const doc = await PDFDocument.load(bytes);
          setBaseBytes(bytes); setBasePageCount(doc.getPageCount());
        } catch (err: any) {
          setResult({
            success: false,
            message: `Error loading PDF: ${err.message}`,
          });
        }
      } else {
        setInsertFile(dropped);
        setResult(null);
      }
    }
  }, [tier]);

  const addPages = async () => {
    if (!baseBytes || !baseFile || (insertMode === 'pdf' && !insertFile)) { setResult({ success: false, message: insertMode === 'pdf' ? 'Choose a base PDF and a PDF to insert.' : 'Choose a base PDF and the number of blank pages.' }); return; }
    
    setProcessing(true);
    try {
      const baseDoc = await PDFDocument.load(baseBytes);
      const insertDoc = insertMode === 'pdf' && insertFile ? await PDFDocument.load(await insertFile.arrayBuffer()) : null;
      const insertPageCount = insertDoc ? insertDoc.getPageCount() : blankCount;
      
      // Determine insertion index
      let insertIndex: number;
      if (position === 'beginning') {
        insertIndex = 0;
      } else if (position === 'end') {
        insertIndex = basePageCount;
      } else {
        insertIndex = Math.min(Math.max(0, customPosition - 1), basePageCount);
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
        message: `Added ${insertPageCount} page(s) to ${position === 'custom' ? `position ${customPosition}` : position}. Total pages: ${basePageCount + insertPageCount}`,
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
            </label>
        </div>
      </div>

      <div className="tb-v2-tool-input-head" style={{ marginTop: 12 }}><span className="tb-v2-tool-label">Page source</span><ToolExampleClearActions onExample={() => void loadExample()} onClear={clearAll} canClear={Boolean(baseFile || insertFile || result)} exampleCount={1} /></div>
      <div className="flex gap-3" style={{ marginTop: 8 }}>
        <button type="button" className={`tb-v2-mode-tab ${insertMode === 'pdf' ? 'on' : ''}`} onClick={() => setInsertMode('pdf')}>Pages from PDF</button>
        <button type="button" className={`tb-v2-mode-tab ${insertMode === 'blank' ? 'on' : ''}`} onClick={() => setInsertMode('blank')}>Blank pages</button>
      </div>
      {insertMode === 'blank' && <label className="text-sm">Blank pages <input aria-label="Number of blank pages" type="number" min={1} max={50} value={blankCount} onChange={e => setBlankCount(Math.max(1, Number(e.target.value) || 1))} className="w-20 p-2 border rounded" /></label>}

      {/* Position Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Insert Position</label>
        <div className="flex flex-wrap gap-3">
          <button
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
            <label className="text-sm">Insert at page:</label>
            <input
              type="number"
              min={1}
              max={basePageCount || 1}
              value={customPosition}
              onChange={(e) => setCustomPosition(parseInt(e.target.value) || 1)}
              className="w-20 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            />
            <span className="text-sm text-gray-500">
              (1 to {basePageCount || 1})
            </span>
          </div>
        )}
      </div>

      {/* Process Button */}
      <button
        onClick={addPages}
        disabled={!baseFile || (insertMode === 'pdf' && !insertFile) || processing}
        className="w-full py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : 'Add Pages'}
      </button>

      {/* Result */}
      {result && (
        <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <p className={result.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
            {result.message}
          </p>
          {result.success && (
            <button
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
