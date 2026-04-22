'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { FileSizeError, UpgradeNotice } from '@/components/FileSizeGuard';

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';

interface ConversionResult {
  url: string;
  size: number;
  ext: string;
}

const FORMAT_OPTIONS: { value: OutputFormat; label: string; ext: string }[] = [
  { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
  { value: 'image/avif', label: 'AVIF', ext: 'avif' },
];

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function sizeDiff(before: number, after: number): string {
  const pct = Math.round((1 - after / before) * 100);
  if (pct > 0) return `${pct}% smaller`;
  if (pct < 0) return `${Math.abs(pct)}% larger`;
  return 'same size';
}

export default function ImageFormatConverterClient() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceObjectUrl, setSourceObjectUrl] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/webp');
  const [quality, setQuality] = useState(85);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevResultUrl = useRef<string | null>(null);
  const { tier } = useSubscription();
  const maxSizeMB = tier === 'free' ? 5 : tier === 'starter' ? 10 : tier === 'ultra' ? 100 : tier === 'max' ? 500 : 5;

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (sourceObjectUrl) URL.revokeObjectURL(sourceObjectUrl);
      if (prevResultUrl.current) URL.revokeObjectURL(prevResultUrl.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isOversized = sourceFile != null && sourceFile.size / (1024 * 1024) > maxSizeMB;
  const handleFile = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Unsupported format. Please upload a JPEG, PNG, WebP, AVIF, or GIF image.');
      return;
    }
    setError(null);
    setResult(null);
    setSourceFile(file);
    if (sourceObjectUrl) URL.revokeObjectURL(sourceObjectUrl);
    setSourceObjectUrl(URL.createObjectURL(file));
  }, [sourceObjectUrl]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so same file can be re-selected
    e.target.value = '';
  }, [handleFile]);

  const convert = useCallback(async () => {
    if (!sourceFile || !sourceObjectUrl) return;

    setConverting(true);
    setError(null);

    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image.'));
        img.src = sourceObjectUrl;
      });

      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not available.');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available.');
      ctx.drawImage(img, 0, 0);

      // PNG is lossless — quality param is ignored
      const qualityValue = outputFormat === 'image/png' ? undefined : quality / 100;

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Conversion failed. This format may not be supported by your browser.'));
          },
          outputFormat,
          qualityValue,
        );
      });

      if (prevResultUrl.current) URL.revokeObjectURL(prevResultUrl.current);
      const url = URL.createObjectURL(blob);
      prevResultUrl.current = url;

      const ext = FORMAT_OPTIONS.find((f) => f.value === outputFormat)?.ext ?? 'bin';
      setResult({ url, size: blob.size, ext });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setConverting(false);
    }
  }, [sourceFile, sourceObjectUrl, outputFormat, quality]);

  const download = useCallback(() => {
    if (!result || !sourceFile) return;
    const a = document.createElement('a');
    a.href = result.url;
    const base = sourceFile.name.replace(/\.[^.]+$/, '');
    a.download = `${base}.${result.ext}`;
    a.click();
  }, [result, sourceFile]);

  const reset = useCallback(() => {
    if (sourceObjectUrl) URL.revokeObjectURL(sourceObjectUrl);
    if (prevResultUrl.current) URL.revokeObjectURL(prevResultUrl.current);
    prevResultUrl.current = null;
    setSourceFile(null);
    setSourceObjectUrl(null);
    setResult(null);
    setError(null);
  }, [sourceObjectUrl]);

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload image"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors select-none ${
          isDragging
            ? 'border-green-500 bg-green-900/10'
            : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          onChange={handleInputChange}
        />
        <div className="text-4xl mb-3 pointer-events-none">🖼️</div>
        <p className="text-gray-300 font-medium pointer-events-none">
          {isDragging ? 'Drop image here' : 'Drop an image here or click to upload'}
        </p>
        <p className="text-gray-500 text-sm mt-1 pointer-events-none">JPEG · PNG · WebP · AVIF · GIF</p>
        <FileSizeError file={sourceFile} maxSizeMB={maxSizeMB} />
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {sourceFile && sourceObjectUrl && (
        <>
          {/* Source file info */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Source Image</p>
              <p className="text-gray-200 text-sm font-mono break-all">{sourceFile.name}</p>
              <p className="text-gray-400 text-sm mt-0.5">
                {formatBytes(sourceFile.size)} &middot; {sourceFile.type}
              </p>
            </div>
            <button
              onClick={reset}
              className="text-gray-500 hover:text-gray-300 transition-colors text-sm shrink-0 mt-0.5"
              aria-label="Remove image"
            >
              ✕ Remove
            </button>
          </div>

          {/* Conversion settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Output format */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Output Format</p>
              <div className="flex flex-wrap gap-2">
                {FORMAT_OPTIONS.map((fmt) => (
                  <button
                    key={fmt.value}
                    onClick={() => setOutputFormat(fmt.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      outputFormat === fmt.value
                        ? 'bg-green-600 hover:bg-green-500 text-black'
                        : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality slider (hidden for PNG — lossless) */}
            <div className={outputFormat === 'image/png' ? 'opacity-30 pointer-events-none' : ''}>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
                Quality&ensp;<span className="text-green-400 font-semibold">
                  {outputFormat === 'image/png' ? 'N/A (lossless)' : quality}
                </span>
              </p>
              <input
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                disabled={outputFormat === 'image/png'}
                className="w-full accent-green-500"
                aria-label="Quality"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>1 · smallest</span>
                <span>100 · best</span>
              </div>
            </div>
          </div>

          {/* Convert button */}
          <button
            onClick={convert}
            disabled={converting || isOversized}
            title={isOversized ? 'File size exceeds your plan limit' : ''}
            className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-lg transition-colors"
          >
            {isOversized ? 'File Too Large' : converting ? 'Converting…' : 'Convert Image'}
          </button>

          <UpgradeNotice tier={tier} />

          {/* Before / After preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">Before</p>
              <div className="bg-gray-900 rounded-lg flex items-center justify-center h-48 overflow-hidden">
                {/* checkerboard bg via inline pattern for transparent PNGs */}
                <img
                  src={sourceObjectUrl}
                  alt="Original"
                  className="max-h-48 max-w-full object-contain rounded"
                />
              </div>
              <p className="text-gray-400 text-sm mt-3">{formatBytes(sourceFile.size)}</p>
              <p className="text-gray-500 text-xs mt-0.5">{sourceFile.type}</p>
            </div>

            {/* After */}
            <div
              className={`border rounded-xl p-4 transition-colors ${
                result
                  ? 'bg-gray-800 border-green-700/50'
                  : 'bg-gray-900 border-gray-700 opacity-50'
              }`}
            >
              <p className={`text-xs uppercase tracking-wide font-medium mb-3 ${result ? 'text-green-500' : 'text-gray-500'}`}>
                After
              </p>
              <div className="bg-gray-900 rounded-lg flex items-center justify-center h-48 overflow-hidden">
                {result ? (
                  <img
                    src={result.url}
                    alt="Converted"
                    className="max-h-48 max-w-full object-contain rounded"
                  />
                ) : (
                  <span className="text-gray-600 text-sm">Preview will appear here</span>
                )}
              </div>
              {result ? (
                <>
                  <p className="text-green-400 text-sm mt-3">{formatBytes(result.size)}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {sizeDiff(sourceFile.size, result.size)} &middot; {result.ext.toUpperCase()}
                  </p>
                </>
              ) : (
                <p className="text-gray-600 text-sm mt-3">—</p>
              )}
            </div>
          </div>

          {/* Download */}
          {result && (
            <button
              onClick={download}
              className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Download {result.ext.toUpperCase()}
            </button>
          )}
        </>
      )}

      {/* Hidden canvas used for pixel-based conversion */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}
