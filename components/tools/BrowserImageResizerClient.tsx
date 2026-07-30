'use client';

import { useState, useRef } from 'react';

export default function BrowserImageResizerClient({}: {}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lockRatio, setLockRatio] = useState(true);
  const [result, setResult] = useState('');
  const [ratio, setRatio] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFile = (f: File) => {
    setFile(f);
    setResult('');
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setWidth(String(img.width));
      setHeight(String(img.height));
      setRatio(img.width / img.height);
    };
    img.src = url;
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

  const handleWidth = (w: string) => {
    setWidth(w);
    if (lockRatio) setHeight(String(Math.round(Number(w) / ratio)));
  };

  const handleHeight = (h: string) => {
    setHeight(h);
    if (lockRatio) setWidth(String(Math.round(Number(h) * ratio)));
  };

  const resize = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = Number(width) || img.width;
      canvas.height = Number(height) || img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = preview;
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
          {isDragging ? 'Drop image here' : 'Click or drag an image to resize'}
        </p>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      {preview && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between">
          <img src={preview} alt="Preview" style={{ maxHeight: 80, borderRadius: 6 }} />
          <button type="button" onClick={() => { setFile(null); setPreview(''); setResult(''); }} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      )}

      {file && (
        <div>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Resize</span>
          </div>
          <div className="flex gap-2 items-center" style={{ marginTop: 8 }}>
            <div style={{ flex: 1 }}>
              <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Width</label>
              <input className="tb-v2-input" type="number" value={width} onChange={(e) => handleWidth(e.target.value)} />
            </div>
            <button
              type="button"
              onClick={() => setLockRatio(!lockRatio)}
              className="tb-v2-btn"
              style={{ marginTop: 20 }}
              aria-label={lockRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
            >
              {lockRatio ? '🔗' : '🔓'}
            </button>
            <div style={{ flex: 1 }}>
              <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Height</label>
              <input className="tb-v2-input" type="number" value={height} onChange={(e) => handleHeight(e.target.value)} />
            </div>
          </div>
          <button type="button" onClick={resize} className="tb-v2-btn tb-v2-btn-primary w-full" style={{ marginTop: 12 }}>
            Resize Image
          </button>
        </div>
      )}

      {!file && (
        <p className="tb-v2-empty">
          Drop an image above to resize it entirely in your browser, no upload required.
        </p>
      )}

      {result && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Result</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ textAlign: 'center' }}>
            <img src={result} alt="Resized" style={{ maxWidth: '100%', borderRadius: 8 }} />
            <a href={result} download="resized.png" className="tb-v2-btn tb-v2-btn-primary" style={{ marginTop: 12, display: 'inline-block' }}>
              Download
            </a>
          </div>
        </>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
