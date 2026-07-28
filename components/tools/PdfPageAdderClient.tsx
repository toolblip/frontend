'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function PdfPageAdderClient() {
  const [baseFile, setBaseFile] = useState<File | null>(null);
  const [insertFile, setInsertFile] = useState<File | null>(null);
  const [position, setPosition] = useState<'beginning' | 'end' | 'custom'>('end');
  const [customPosition, setCustomPosition] = useState(1);
  const [baseDoc, setBaseDoc] = useState<PDFDocument | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; blob?: Blob } | null>(null);

  const handleBaseFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      setBaseFile(selected);
      setResult(null);
      
      try {
        const arrayBuffer = await selected.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        setBaseDoc(doc);
      } catch (err: any) {
        setResult({
          success: false,
          message: `Error loading PDF: ${err.message}`,
        });
      }
    }
  }, []);

  const handleInsertFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      setInsertFile(selected);
      setResult(null);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, type: 'base' | 'insert') => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type === 'application/pdf') {
      if (type === 'base') {
        setBaseFile(dropped);
        setResult(null);
        
        try {
          const arrayBuffer = await dropped.arrayBuffer();
          const doc = await PDFDocument.load(arrayBuffer);
          setBaseDoc(doc);
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
  }, []);

  const addPages = async () => {
    if (!baseDoc || !insertFile || !baseFile) return;
    
    setProcessing(true);
    try {
      const insertArrayBuffer = await insertFile.arrayBuffer();
      const insertDoc = await PDFDocument.load(insertArrayBuffer);
      
      const insertPageCount = insertDoc.getPageCount();
      const basePageCount = baseDoc.getPageCount();
      
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
      const pagesToInsert = await baseDoc.copyPages(insertDoc, insertDoc.getPageIndices());
      
      // Insert pages at position
      pagesToInsert.forEach((page, i) => {
        baseDoc.insertPage(insertIndex + i, page);
      });
      
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Add Pages to PDF</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Insert pages from one PDF into another. Works entirely in your browser.
      </p>

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
            onChange={handleBaseFileChange}
            className="hidden"
            id="base-pdf-upload"
          />
          <label htmlFor="base-pdf-upload" className="cursor-pointer">
            <div className="text-3xl mb-2">📄</div>
            <p className="text-gray-600 dark:text-gray-400">
              {baseFile ? baseFile.name : 'Drop base PDF here'}
            </p>
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
            onChange={handleInsertFileChange}
            className="hidden"
            id="insert-pdf-upload"
          />
          <label htmlFor="insert-pdf-upload" className="cursor-pointer">
            <div className="text-3xl mb-2">📄</div>
            <p className="text-gray-600 dark:text-gray-400">
              {insertFile ? insertFile.name : 'Drop PDF to insert here'}
            </p>
          </label>
        </div>
      </div>

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
              max={baseDoc?.getPageCount() || 1}
              value={customPosition}
              onChange={(e) => setCustomPosition(parseInt(e.target.value) || 1)}
              className="w-20 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            />
            <span className="text-sm text-gray-500">
              (1 to {baseDoc?.getPageCount() || 1})
            </span>
          </div>
        )}
      </div>

      {/* Process Button */}
      <button
        onClick={addPages}
        disabled={!baseFile || !insertFile || processing}
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
