'use client';

import { useState, useRef, useCallback } from 'react';

export default function HeicToPngClient() {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((f: File) => {
    setError('');
    setOutput(null);
    const isHeic = /\.(heic|heif)$/i.test(f.name) || f.type === 'image/heic' || f.type === 'image/heif';
    if (!isHeic) {
      setError('Please upload a valid HEIC or HEIF file.');
      return;
    }
    if (f.size > 40 * 1024 * 1024) {
      setError('File too large. Maximum size is 40MB.');
      return;
    }
    setFile(f);
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setOutput(null);
    try {
      const heic2any = (await import('heic2any')).default;
      const result = await heic2any({ blob: file, toType: 'image/png' });
      const blob = Array.isArray(result) ? result[0] : result;
      const url = URL.createObjectURL(blob);
      setOutput(url);
    } catch (e) {
      setError('Conversion failed. This file may not be a valid HEIC/HEIF image, or your browser could not process it.');
    } finally {
      setLoading(false);
    }
  }, [file]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };

  return (
    <div className="tb-v2-tool-card">
      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${dragOver ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950' : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400'}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".heic,.heif,image/heic,image/heif"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
        />
        <div className="text-4xl mb-3">📁</div>
        <p className="font-medium text-gray-700 dark:text-gray-300">Drop your HEIC file here or click to browse</p>
        <p className="text-sm text-gray-500 mt-1">HEIC, HEIF · Max 40MB</p>
      </div>

      {file && (
        <div className="text-sm text-gray-500">Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)</div>
      )}

      {output && (
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">PNG Result</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={output} alt="Converted PNG" className="max-h-48 rounded-lg border border-gray-200 dark:border-gray-700" />
          </div>
        </div>
      )}

      {error && (
        <div className="tb-v2-banner tb-v2-banner-err">{error}</div>
      )}

      <div className="tb-v2-mode-tabs">
        <button
          onClick={convert}
          disabled={!file || loading}
          className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Converting...' : 'Convert to PNG'}
        </button>
        {output && (
          <a
            href={output}
            download="converted.png"
            className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            Download PNG
          </a>
        )}
      </div>
    </div>
  );
}
