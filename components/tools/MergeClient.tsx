'use client';

import { useState, useCallback, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useSubscription } from '@/hooks/useSubscription';
import { checkFileSize } from '@/lib/tier-limits';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

export default function MergeClient() {
  const { tier } = useSubscription();
  const [files, setFiles] = useState<{ file: File; doc: PDFDocument }[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; blob?: Blob } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearAll = () => { setFiles([]); setResult(null); setProcessing(false); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const loadExample = useCallback(async () => {
    const first = await PDFDocument.create(); first.addPage([400, 300]);
    const second = await PDFDocument.create(); second.addPage([400, 300]); second.addPage([400, 300]);
    const firstBytes = await first.save(); const secondBytes = await second.save();
    setFiles([
      { file: new File([firstBytes as BlobPart], 'sample-cover.pdf', { type: 'application/pdf' }), doc: await PDFDocument.load(firstBytes) },
      { file: new File([secondBytes as BlobPart], 'sample-pages.pdf', { type: 'application/pdf' }), doc: await PDFDocument.load(secondBytes) },
    ]); setResult(null);
  }, []);

  const handleFilesChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    const newFiles: { file: File; doc: PDFDocument }[] = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (file.type !== 'application/pdf') continue;
      
      // Check file size against tier limit
      const sizeError = checkFileSize(file, tier);
      if (sizeError) {
        setResult({ success: false, message: `${file.name}: ${sizeError}` });
        return;
      }
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        newFiles.push({ file, doc });
      } catch (err: any) {
        setResult({
          success: false,
          message: `Error loading ${file.name}: ${err.message}`,
        });
        return;
      }
    }
    
    setFiles(prev => [...prev, ...newFiles]);
    setResult(null);
  }, [tier]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles || droppedFiles.length === 0) return;
    
    const newFiles: { file: File; doc: PDFDocument }[] = [];
    
    for (let i = 0; i < droppedFiles.length; i++) {
      const file = droppedFiles[i];
      if (file.type !== 'application/pdf') continue;
      
      // Check file size against tier limit
      const sizeError = checkFileSize(file, tier);
      if (sizeError) {
        setResult({ success: false, message: `${file.name}: ${sizeError}` });
        return;
      }
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        newFiles.push({ file, doc });
      } catch (err: any) {
        setResult({
          success: false,
          message: `Error loading ${file.name}: ${err.message}`,
        });
        return;
      }
    }
    
    setFiles(prev => [...prev, ...newFiles]);
    setResult(null);
  }, [tier]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (from: number, to: number) => {
    if (to < 0 || to >= files.length) return;
    const newFiles = [...files];
    const [moved] = newFiles.splice(from, 1);
    newFiles.splice(to, 0, moved);
    setFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setResult({ success: false, message: 'Please add at least 2 PDF files to merge' });
      return;
    }
    
    setProcessing(true);
    try {
      const mergedDoc = await PDFDocument.create();
      
      for (const { doc } of files) {
        const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach(page => mergedDoc.addPage(page));
      }
      
      const pdfBytes = await mergedDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      
      setResult({
        success: true,
        message: `Merged ${files.length} PDFs into one document (${mergedDoc.getPageCount()} pages)`,
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
    a.download = 'merged.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tb-v2-tool-card">
      {/* File Upload */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors"
      >
        <input
          type="file"
          accept=".pdf"
          multiple
          ref={fileInputRef}
          onChange={handleFilesChange}
          className="hidden"
          id="pdf-upload"
        />
        <label htmlFor="pdf-upload" className="cursor-pointer">
          <div className="text-4xl mb-2">📄</div>
          <p className="text-sm text-gray-500 mt-1">
            Select 2 or more PDF files to merge
          </p>
        </label>
      </div>
      <div className="tb-v2-tool-input-head" style={{ marginTop: 12 }}><span className="tb-v2-tool-label">Merge order</span><ToolExampleClearActions onExample={() => void loadExample()} onClear={clearAll} canClear={Boolean(files.length || result)} exampleCount={1} /></div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            {files.length} file(s) to merge
          </h2>
          
          <div className="space-y-2">
            {files.map((f, index) => (
              <div
                key={index}
                className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="font-medium">{f.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {f.doc.getPageCount()} page(s) - {(f.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveFile(index, index - 1)}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveFile(index, index + 1)}
                    disabled={index === files.length - 1}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={mergePDFs}
            disabled={files.length < 2 || processing}
            className="w-full py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : `Merge ${files.length} PDFs`}
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
              Download Merged PDF
            </button>
          )}
        </div>
      )}
    </div>
  );
}
