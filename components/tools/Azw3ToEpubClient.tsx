'use client';

import { useState, useRef } from 'react';

export default function Azw3ToEpubClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (selected: File) => {
    setFile(selected);
    setMessage('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.name.toLowerCase().endsWith('.azw3')) handleFile(dropped);
  };

  const handleConvert = () => {
    if (!file) return;
    setIsProcessing(true);
    setMessage('');

    // AZW3 to EPUB conversion requires server-side processing
    // Browser cannot read AZW3 format directly
    setTimeout(() => {
      setIsProcessing(false);
      setMessage('AZW3 to EPUB conversion requires server-side processing. This browser tool cannot read AZW3 files directly. Please use Calibre or a similar desktop application for conversion.');
    }, 500);
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-sm text-purple-800 dark:text-purple-200">
        <strong>ebook format conversion:</strong> AZW3 (Amazon Kindle) to EPUB conversion requires reading the DRM-free book content and re-formatting. This browser tool provides guidance only.
      </div>

      <div className="tb-v2-tool-label mb-2">AZW3 File</div>
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
        <div className="text-4xl mb-2">📖</div>
        <p className="text-gray-600 dark:text-gray-400">
          {isDragging ? 'Drop AZW3 file here' : 'Click or drag an AZW3 file to analyze'}
        </p>
        <p className="text-xs text-gray-500 mt-1">AZW3</p>
      </div>
      <input ref={fileRef} type="file" accept=".azw3,application/vnd.amazon.mobi8-ebook" onChange={handleFileChange} className="hidden" />
      {file && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button type="button" onClick={() => { setFile(null); setMessage(''); }} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      )}

      {file && (
        <button
          type="button"
          onClick={handleConvert}
          disabled={isProcessing}
          className="tb-v2-btn tb-v2-btn-primary w-full"
        >
          {isProcessing ? 'Processing...' : 'Analyze for Conversion'}
        </button>
      )}

      {!file && (
        <p className="tb-v2-empty">
          Upload an AZW3 file above for conversion guidance. This tool cannot read AZW3 content in-browser.
        </p>
      )}

      {message && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <p className="text-sm text-amber-800 dark:text-amber-200 whitespace-pre-line">{message}</p>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
        <p className="tb-v2-tool-label">Recommended Desktop Tools:</p>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
          <li><strong>Calibre</strong> - Free, open-source, supports AZW3 to EPUB</li>
          <li><strong>KindleUnpack</strong> - Extracts content from AZW3 files</li>
          <li><strong>Sigil</strong> - EPUB editor for manual corrections</li>
        </ul>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
        <strong>Note:</strong> AZW3 files from Amazon are DRM-protected. Only DRM-free AZW3 files can be converted.
      </div>
    </div>
  );
}
