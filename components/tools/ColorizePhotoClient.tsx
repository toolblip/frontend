'use client';

import React, { useState, useRef } from 'react';

export default function ColorizePhotoClient() {
  const [original, setOriginal] = useState<string | null>(null);
  const [colorized, setColorized] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setOriginal(url);
    setColorized(null);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    loadFile(file);
  };

  const loadExample = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 300, 200);
    gradient.addColorStop(0, '#1a1a1a');
    gradient.addColorStop(0.5, '#888888');
    gradient.addColorStop(1, '#e5e5e5');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 300, 200);
    ctx.fillStyle = '#444444';
    ctx.beginPath();
    ctx.arc(150, 100, 50, 0, Math.PI * 2);
    ctx.fill();
    setOriginal(canvas.toDataURL('image/png'));
    setColorized(null);
  };

  const colorize = () => {
    if (!original || !canvasRef.current) return;
    setLoading(true);
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i+1] + data[i+2]) / 3;
        data[i]     = Math.min(255, data[i] + Math.round(avg * 0.3));
        data[i+1]   = Math.min(255, data[i+1] + Math.round(avg * 0.1));
        data[i+2]   = Math.max(0, data[i+2] - Math.round(avg * 0.2));
      }
      ctx.putImageData(imageData, 0, 0);
      setColorized(canvas.toDataURL('image/png'));
      setLoading(false);
    };
    img.src = original;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Colorize Photo</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
        <div
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200'}`}
        >
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="colorize-upload" />
          <label htmlFor="colorize-upload" className="cursor-pointer">
            <div className="text-gray-500 mb-2">Drop a black & white photo here, or click to upload</div>
            <div className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</div>
          </label>
        </div>

        {original ? (
          <>
            <div className="tb-v2-grid-2">
              <div>
                <div className="text-xs text-gray-500 mb-1">Original (B&W)</div>
                <img src={original} alt="Original" className="w-full rounded-xl" />
              </div>
              {colorized && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Colorized</div>
                  <img src={colorized} alt="Colorized" className="w-full rounded-xl" />
                </div>
              )}
            </div>
            {!colorized && (
              <button type="button" onClick={colorize} disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50">
                {loading ? 'Colorizing...' : 'Colorize Photo'}
              </button>
            )}
          </>
        ) : (
          <div className="tb-v2-empty">Upload a photo to colorize it</div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
