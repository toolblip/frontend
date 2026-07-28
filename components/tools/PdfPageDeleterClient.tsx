'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function PdfPageDeleterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pages, setPages] = useState<{ index: number; selected: boolean }[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; blob?: Blob } | null>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setResult(null);
      
      try {
        const arrayBuffer = await selected.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        setPdfDoc(doc);
        
        const pageCount = doc.getPageCount();
        setPages(Array.from({ length: pageCount }, (_, i) => ({ index: i, selected: false })));
      } catch (err: any) {
        setResult({
          success: false,
          message: `Error loading PDF: ${err.message}`,
        });
      }
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type === 'application/pdf') {
      setFile(dropped);
      setResult(null);
      
      try {
        const arrayBuffer = await dropped.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        setPdfDoc(doc);
        
        const pageCount = doc.getPageCount();
        setPages(Array.from({ length: pageCount }, (_, i) => ({ index: i, selected: false })));
      } catch (err: any) {
        setResult({
          success: false,
          message: `Error loading PDF: ${err.message}`,
        });
      }
    }
  }, []);

  const togglePage = (index: number) => {
    setPages(prev => prev.map(p => 
      p.index === index ? { ...p, selected: !p.selected } : p
    ));
  };

  const selectAll = () => {
    setPages(prev => prev.map(p => ({ ...p, selected: true })));
  };

  const deselectAll = () => {
    setPages(prev => prev.map(p => ({ ...p, selected: false })));
  };

  const deleteSelected = async () => {
    if (!pdfDoc || !file) return;
    
    const selectedCount = pages.filter(p => p.selected).length;
    if (selectedCount === 0) {
      setResult({ success: false, message: 'Please select pages to delete' });
      return;
    }
    
    if (selectedCount === pages.length) {
      setResult({ success: false, message: 'Cannot delete all pages' });
      return;
    }
    
    setProcessing(true);
    try {
      // Create new document without selected pages
      const newDoc = await PDFDocument.create();
      const pagesToKeep = pages.filter(p => !p.selected).map(p => p.index);
      
      const copiedPages = await newDoc.copyPages(pdfDoc, pagesToKeep);
      copiedPages.forEach(page => newDoc.addPage(page));
      
      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      
      setResult({
        success: true,
        message: `Deleted ${selectedCount} page(s). ${pagesToKeep.length} page(s) remaining.`,
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
    a.download = file?.name?.replace('.pdf', '_edited.pdf') || 'edited.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Delete PDF Pages</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Remove unwanted pages from your PDF. Works entirely in your browser.
      </p>

      {/* File Upload */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors"
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-upload"
        />
        <label htmlFor="pdf-upload" className="cursor-pointer">
          <div className="text-4xl mb-2">📄</div>
          <p className="text-gray-600 dark:text-gray-400">
            {file ? file.name : 'Drop a PDF here or click to upload'}
          </p>
        </label>
      </div>

      {/* Page Selection */}
      {pages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {pages.length} page(s) - {pages.filter(p => p.selected).length} selected for deletion
            </h2>
            <div className="space-x-2">
              <button onClick={selectAll} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded">
                Select All
              </button>
              <button onClick={deselectAll} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded">
                Deselect All
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {pages.map((page) => (
              <button
                key={page.index}
                onClick={() => togglePage(page.index)}
                className={`p-3 border-2 rounded-lg text-center transition-colors ${
                  page.selected
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-500'
                }`}
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="text-sm font-medium">Page {page.index + 1}</div>
                {page.selected && (
                  <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                    ☒ Delete
                  </div>
                )}
              </button>
            ))}
          </div>
          
          <button
            onClick={deleteSelected}
            disabled={pages.filter(p => p.selected).length === 0 || processing}
            className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : `Delete ${pages.filter(p => p.selected).length} Page(s)`}
          </button>
        </div>
      )}

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
              Download Edited PDF
            </button>
          )}
        </div>
      )}
    </div>
  );
}
