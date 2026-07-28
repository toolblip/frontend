'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function SplitClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [splitMode, setSplitMode] = useState<'ranges' | 'every'>('ranges');
  const [ranges, setRanges] = useState('1-3,4-5');
  const [everyN, setEveryN] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; files?: { name: string; blob: Blob }[] } | null>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setResult(null);
      
      try {
        const arrayBuffer = await selected.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        setPdfDoc(doc);
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
      } catch (err: any) {
        setResult({
          success: false,
          message: `Error loading PDF: ${err.message}`,
        });
      }
    }
  }, []);

  const parseRanges = (rangeStr: string, totalPages: number): number[][] => {
    const ranges: number[][] = [];
    const parts = rangeStr.split(',').map(s => s.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= totalPages && start <= end) {
          const pages: number[] = [];
          for (let i = start; i <= end; i++) {
            pages.push(i - 1); // Convert to 0-indexed
          }
          ranges.push(pages);
        }
      } else {
        const page = parseInt(part);
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
          ranges.push([page - 1]);
        }
      }
    }
    
    return ranges;
  };

  const splitPDF = async () => {
    if (!pdfDoc || !file) return;
    
    setProcessing(true);
    try {
      const totalPages = pdfDoc.getPageCount();
      const outputFiles: { name: string; blob: Blob }[] = [];
      
      if (splitMode === 'ranges') {
        const parsedRanges = parseRanges(ranges, totalPages);
        
        if (parsedRanges.length === 0) {
          setResult({
            success: false,
            message: 'Invalid page ranges. Use format like "1-3,4-5" or "1,3,5"',
          });
          return;
        }
        
        for (let i = 0; i < parsedRanges.length; i++) {
          const newDoc = await PDFDocument.create();
          const copiedPages = await newDoc.copyPages(pdfDoc, parsedRanges[i]);
          copiedPages.forEach(page => newDoc.addPage(page));
          
          const pdfBytes = await newDoc.save();
          const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
          outputFiles.push({
            name: `${file.name.replace('.pdf', '')}_part${i + 1}.pdf`,
            blob,
          });
        }
      } else {
        // Split every N pages
        const chunkSize = Math.max(1, everyN);
        for (let i = 0; i < totalPages; i += chunkSize) {
          const newDoc = await PDFDocument.create();
          const pageIndices: number[] = [];
          
          for (let j = i; j < Math.min(i + chunkSize, totalPages); j++) {
            pageIndices.push(j);
          }
          
          const copiedPages = await newDoc.copyPages(pdfDoc, pageIndices);
          copiedPages.forEach(page => newDoc.addPage(page));
          
          const pdfBytes = await newDoc.save();
          const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
          outputFiles.push({
            name: `${file.name.replace('.pdf', '')}_part${Math.floor(i / chunkSize) + 1}.pdf`,
            blob,
          });
        }
      }
      
      setResult({
        success: true,
        message: `Split into ${outputFiles.length} file(s)`,
        files: outputFiles,
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

  const downloadFile = (file: { name: string; blob: Blob }) => {
    const url = URL.createObjectURL(file.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    if (!result?.files) return;
    result.files.forEach(f => downloadFile(f));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Split PDF</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Split a PDF into separate files by page ranges or fixed intervals. Works entirely in your browser.
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
          {file && pdfDoc && (
            <p className="text-sm text-gray-500 mt-1">
              {pdfDoc.getPageCount()} page(s) - {(file.size / 1024).toFixed(1)} KB
            </p>
          )}
        </label>
      </div>

      {/* Split Mode */}
      {pdfDoc && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={() => setSplitMode('ranges')}
              className={`px-4 py-2 rounded-lg ${
                splitMode === 'ranges'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              Page Ranges
            </button>
            <button
              onClick={() => setSplitMode('every')}
              className={`px-4 py-2 rounded-lg ${
                splitMode === 'every'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              Every N Pages
            </button>
          </div>

          {splitMode === 'ranges' ? (
            <div>
              <label className="block text-sm font-medium mb-2">
                Page Ranges (e.g., 1-3,4-5,7)
              </label>
              <input
                type="text"
                value={ranges}
                onChange={(e) => setRanges(e.target.value)}
                placeholder="1-3,4-5,7"
                className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-mono"
              />
              <p className="text-sm text-gray-500 mt-1">
                Total pages: {pdfDoc.getPageCount()}
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">
                Split every N pages
              </label>
              <input
                type="number"
                min={1}
                max={pdfDoc.getPageCount()}
                value={everyN}
                onChange={(e) => setEveryN(parseInt(e.target.value) || 1)}
                className="w-32 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
              <p className="text-sm text-gray-500 mt-1">
                Will create {Math.ceil(pdfDoc.getPageCount() / everyN)} file(s)
              </p>
            </div>
          )}

          <button
            onClick={splitPDF}
            disabled={processing}
            className="w-full py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : 'Split PDF'}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <p className={result.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
            {result.message}
          </p>
          {result.success && result.files && (
            <div className="mt-3 space-y-2">
              <button
                onClick={downloadAll}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Download All ({result.files.length} files)
              </button>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {result.files.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => downloadFile(f)}
                    className="p-2 bg-white dark:bg-gray-800 border rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    📄 {f.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
