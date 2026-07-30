'use client';

import { useState, useRef } from 'react';

export default function ChangeBgPhotoClient() {
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgType, setBgType] = useState<'color' | 'transparent' | 'blur'>('transparent');
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFile = (f: File) => {
    setFile(f);
    setImageUrl('');
    setProcessedImage(null);
    setError('');
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('image/')) loadFile(f);
  };

  const processImage = async () => {
    const src = file ? URL.createObjectURL(file) : imageUrl.trim();
    if (!src) return;

    setLoading(true);
    setError('');

    try {
      const img = new Image();
      if (!file) img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = src;
      });

      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (bgType === 'transparent') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      } else if (bgType === 'color') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      } else if (bgType === 'blur') {
        ctx.filter = 'blur(20px)';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';
        ctx.globalAlpha = 0.7;
        ctx.drawImage(img, 0, 0);
        ctx.globalAlpha = 1;
      }

      const dataUrl = canvas.toDataURL('image/png');
      setProcessedImage(dataUrl);
    } catch {
      setError(
        file
          ? 'Could not process this image.'
          : 'Could not load or process this image. Cross-origin images without CORS headers can fail here, try uploading the file directly instead.'
      );
    }

    setLoading(false);
  };

  const loadExample = () => {
    setImageUrl('https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500');
    setFile(null);
    setProcessedImage(null);
    setError('');
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.download = 'background-changed.png';
    link.href = processedImage;
    link.click();
  };

  const copyToClipboard = async () => {
    if (!processedImage) return;

    try {
      const response = await fetch(processedImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError('Failed to copy image to clipboard.');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Image</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
        }`}
      >
        <div className="text-3xl mb-2">🖼️</div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {isDragging ? 'Drop image here' : 'Click or drag an image, or paste a URL below'}
        </p>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      {file && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{file.name}</span>
          <button type="button" onClick={() => setFile(null)} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      )}

      <input
        type="url"
        value={imageUrl}
        onChange={(e) => { setImageUrl(e.target.value); setFile(null); }}
        placeholder="https://example.com/image.jpg"
        className="tb-v2-input"
        aria-label="Image URL"
      />

      <div>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">Background Type</span>
        </div>
        <div className="flex gap-2 flex-wrap" style={{ marginTop: 8 }}>
          <button
            type="button"
            onClick={() => setBgType('transparent')}
            className={`tb-v2-btn ${bgType === 'transparent' ? 'tb-v2-btn-primary' : ''}`}
          >
            Transparent
          </button>
          <button
            type="button"
            onClick={() => setBgType('color')}
            className={`tb-v2-btn ${bgType === 'color' ? 'tb-v2-btn-primary' : ''}`}
          >
            Solid Color
          </button>
          <button
            type="button"
            onClick={() => setBgType('blur')}
            className={`tb-v2-btn ${bgType === 'blur' ? 'tb-v2-btn-primary' : ''}`}
          >
            Blur Effect
          </button>
        </div>
      </div>

      {bgType === 'color' && (
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 dark:text-gray-400">Background Color</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            style={{ width: 40, height: 32, borderRadius: 6, border: '1px solid var(--tb-border)', cursor: 'pointer' }}
            aria-label="Background color"
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">{bgColor}</span>
        </div>
      )}

      <button
        type="button"
        onClick={processImage}
        disabled={loading || (!imageUrl.trim() && !file)}
        className="tb-v2-btn tb-v2-btn-primary"
      >
        {loading ? 'Processing...' : 'Change Background'}
      </button>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {!processedImage && !error && (
        <p className="tb-v2-empty">Upload an image or enter a URL, then choose a background option.</p>
      )}

      {processedImage && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Result</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ textAlign: 'center' }}>
            <img
              src={processedImage}
              alt="Processed"
              style={{ maxWidth: '100%', borderRadius: '0.5rem' }}
            />
            <div className="flex gap-2 flex-wrap justify-center" style={{ marginTop: 12 }}>
              <button type="button" onClick={downloadImage} className="tb-v2-btn tb-v2-btn-primary">
                Download Image
              </button>
              <button type="button" onClick={copyToClipboard} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
                {copied ? 'Copied' : 'Copy to Clipboard'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
