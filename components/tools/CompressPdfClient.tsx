'use client';

import React, { useState } from 'react';

export default function CompressPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState('');

  const loadFile = (f: File) => {
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file.');
      return;
    }
    setFile(f);
    setOriginalSize(f.size);
    setResult(null);
    setCompressedSize(0);
    setError('');
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) loadFile(f);
  };

  const compress = async () => {
    if (!file) return;
    setCompressing(true);
    setError('');
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const compressed = await doc.save({ useObjectStreams: true });
      setResult(compressed);
      setCompressedSize(compressed.byteLength);
    } catch {
      setError('Could not compress this PDF. It may be encrypted or corrupted.');
    }
    setCompressing(false);
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const blob = new Blob([result as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `compressed-${file.name}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const savings = originalSize > 0 && compressedSize > 0
    ? Math.round((1 - compressedSize / originalSize) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Compress PDF</span>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
        <div
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200'}`}
        >
          <input type="file" accept="application/pdf,.pdf" onChange={handleUpload} className="hidden" id="compress-pdf-upload" />
          <label htmlFor="compress-pdf-upload" className="cursor-pointer">
            <div className="text-4xl mb-2">📄</div>
            <div className="text-gray-500 mb-1">{file ? file.name : 'Drop a PDF here, or click to upload'}</div>
            <div className="text-xs text-gray-400">{file ? formatBytes(originalSize) : '.pdf format'}</div>
          </label>
        </div>

        {error && <p style={{ fontSize: 13, color: '#ef4444' }}>{error}</p>}

        {file && (
          <button type="button" onClick={compress} disabled={compressing}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50">
            {compressing ? 'Compressing PDF...' : 'Compress PDF'}
          </button>
        )}

        {result && (
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Original</span>
              <span className="font-medium">{formatBytes(originalSize)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Compressed</span>
              <span className="font-medium">{formatBytes(compressedSize)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Savings</span>
              <span className={`font-bold ${savings > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                {savings > 0 ? `-${savings}%` : 'No reduction'}
              </span>
            </div>
            <button type="button" onClick={handleDownload} className="tb-v2-btn mt-2">
              Download Compressed PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
