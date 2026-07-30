'use client';

import { useState, useRef } from 'react';

export default function BlurBackgroundClient() {
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [blurAmount, setBlurAmount] = useState(10);
  const [processedUrl, setProcessedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (selected: File) => {
    setFile(selected);
    setImageUrl('');
    setProcessedUrl('');
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type.startsWith('image/')) handleFile(dropped);
  };

  const applyBlur = () => {
    const src = file ? URL.createObjectURL(file) : imageUrl;
    if (!src) return;
    setLoading(true);
    setError('');

    const img = new Image();
    if (!file) img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) { setLoading(false); return; }

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { setLoading(false); return; }

      ctx.filter = `blur(${blurAmount}px)`;
      ctx.drawImage(img, 0, 0);
      try {
        setProcessedUrl(canvas.toDataURL());
      } catch {
        setError('This image cannot be read due to cross-origin restrictions. Try uploading the file directly instead of using a URL.');
      }
      setLoading(false);
      if (file) URL.revokeObjectURL(src);
    };
    img.onerror = () => {
      setLoading(false);
      setError('Failed to load image. Check the URL or try uploading the file directly.');
    };
    img.src = src;
  };

  const downloadImage = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.download = 'blurred-image.png';
    link.href = processedUrl;
    link.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Image</span>
      </div>
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
        <div className="text-4xl mb-2">🖼️</div>
        <p className="text-gray-600 dark:text-gray-400">
          {isDragging ? 'Drop image here' : 'Click or drag an image to blur'}
        </p>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {file && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">{file.name}</p>
          <button type="button" onClick={() => { setFile(null); setProcessedUrl(''); }} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      )}

      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Or paste an image URL</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => { setImageUrl(e.target.value); setFile(null); setProcessedUrl(''); }}
          placeholder="https://example.com/image.jpg"
          className="tb-v2-input"
          aria-label="Image URL"
        />
      </div>

      <div>
        <label className="text-sm text-gray-500 dark:text-gray-400">
          Blur Amount: {blurAmount}px
          <input
            type="range"
            min="0"
            max="50"
            value={blurAmount}
            onChange={(e) => setBlurAmount(Number(e.target.value))}
            className="tb-v2-range"
            style={{ marginLeft: '1rem', width: '200px' }}
          />
        </label>
      </div>

      <button type="button" onClick={applyBlur} className="tb-v2-btn tb-v2-btn-primary" disabled={loading || (!file && !imageUrl.trim())}>
        {loading ? 'Processing...' : 'Apply Blur'}
      </button>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!processedUrl && !error && (
        <p className="tb-v2-empty">
          Upload an image or paste a URL, adjust the blur amount, and preview the blurred result here.
        </p>
      )}

      {processedUrl && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Result</span>
            <button type="button" onClick={downloadImage} className="tb-v2-copy-btn">
              Download
            </button>
          </div>
          <div className="tb-v2-tool-output-body" style={{ textAlign: 'center' }}>
            <img src={processedUrl} alt="Blurred" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '0.5rem' }} />
          </div>
        </>
      )}
    </div>
  );
}
