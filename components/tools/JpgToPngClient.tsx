'use client';

import { useState, useRef, useCallback } from 'react';

export default function JpgToPngClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((f: File) => {
    setError('');
    setOutput(null);
    if (!f.type.match(/image\/(jpeg|png|webp|gif|bmp)/)) {
      setError('Please upload a valid image file (JPG, PNG, WebP, GIF, BMP).');
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('File too large. Maximum size is 20MB.');
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(f);
  }, []);

  const convert = useCallback(async () => {
    if (!preview) return;
    setLoading(true);
    setError('');
    try {
      const img = new Image();
      img.src = preview;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');
      ctx.drawImage(img, 0, 0);
      const png = canvas.toDataURL('image/png');
      setOutput(png);
    } catch (e) {
      setError('Conversion failed. Please try a different image.');
    } finally {
      setLoading(false);
    }
  }, [preview]);

  const download = () => {
    if (!output) return;
    const a = document.createElement('a');
    a.href = output;
    a.download = file ? file.name.replace(/\.[^.]+$/, '.png') : 'converted.png';
    a.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">JPG to PNG Converter</h1>

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
          accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
        />
        <div className="text-4xl mb-3">📁</div>
        <p className="font-medium text-gray-700 dark:text-gray-300">Drop your image here or click to browse</p>
        <p className="text-sm text-gray-500 mt-1">JPG, PNG, WebP, GIF, BMP · Max 20MB</p>
      </div>

      {file && (
        <div className="text-sm text-gray-500">Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)</div>
      )}

      {preview && (
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Original</p>
            <img src={preview} alt="Original" className="max-h-48 rounded-lg border border-gray-200 dark:border-gray-700" />
          </div>
          {output && (
            <div>
              <p className="text-xs text-gray-500 mb-1 font-medium">PNG Output</p>
              <img src={output} alt="PNG" className="max-h-48 rounded-lg border border-gray-200 dark:border-gray-700" />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">{error}</div>
      )}

      <div className="flex gap-3">
        <button
          onClick={convert}
          disabled={!preview || loading}
          className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Converting...' : 'Convert to PNG'}
        </button>
        {output && (
          <button
            onClick={download}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Download PNG
          </button>
        )}
      </div>
    </div>
  );
}
