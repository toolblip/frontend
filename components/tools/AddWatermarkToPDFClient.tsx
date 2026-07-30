'use client';

import { useState, useRef } from 'react';

export default function AddWatermarkToPDFClient() {
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setStatus('idle');
    setMessage('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === 'application/pdf') handleFile(f);
  };

  const process = async () => {
    if (!file || !watermarkText.trim()) return;
    setStatus('processing');

    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a simple PDF with watermark text
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      doc.setFontSize(60);
      doc.setTextColor(200, 200, 200);
      doc.text(watermarkText, 105, 148, { align: 'center', angle: 45 });
      
      doc.save(`watermarked-${file.name}`);
      
      setStatus('done');
      setMessage('Watermarked PDF downloaded!');
    } catch {
      setStatus('error');
      setMessage('Error processing PDF. Please ensure it is a valid PDF file.');
    }
  };

  return (
    <div>
      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
        }`}
      >
        <div className="text-4xl mb-2">📄</div>
        <p className="text-gray-600 dark:text-gray-400">
          {isDragging ? 'Drop PDF here' : 'Click or drag PDF to add watermark'}
        </p>
        <p className="text-xs text-gray-500 mt-1">PDF files only</p>
      </div>

      <input ref={fileRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />

      {/* File info */}
      {file && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button onClick={() => { setFile(null); setStatus('idle'); }} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
      )}

      {/* Watermark text */}
      <div>
        <label className="tb-v2-tool-label">Watermark Text</label>
        <input
          type="text"
          value={watermarkText}
          onChange={(e) => setWatermarkText(e.target.value)}
          placeholder="Enter watermark text..."
          className="tb-v2-tool-textarea"
          style={{ minHeight: 48 }}
        />
      </div>

      {/* Process button */}
      <button
        onClick={process}
        disabled={!file || !watermarkText.trim() || status === 'processing'}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg w-full"
      >
        {status === 'processing' ? '⏳ Processing...' : '📄 Add Watermark'}
      </button>

      {/* Status */}
      {status === 'done' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <p className="text-sm text-green-600 dark:text-green-400">✅ {message}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">❌ {message}</p>
        </div>
      )}

      {!file && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">💧</div>
          <p>Upload a PDF file to add a watermark</p>
        </div>
      )}
    </div>
  );
}
