'use client';

import React, { useState, useRef } from 'react';

export default function ColorizePhotoClient() {
  const [original, setOriginal] = useState<string | null>(null);
  const [colorized, setColorized] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOriginal(url);
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
      // Simple colorization: shift toward warm tones
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i+1] + data[i+2]) / 3;
        data[i]     = Math.min(255, data[i] + Math.round(avg * 0.3));     // R boost
        data[i+1]   = Math.min(255, data[i+1] + Math.round(avg * 0.1));   // G boost
        data[i+2]   = Math.max(0, data[i+2] - Math.round(avg * 0.2));     // B reduce
      }
      ctx.putImageData(imageData, 0, 0);
      setColorized(canvas.toDataURL('image/png'));
      setLoading(false);
    };
    img.src = original;
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="colorize-upload" />
        <label htmlFor="colorize-upload" className="cursor-pointer">
          <div className="text-gray-500 mb-2">📷 Upload a black & white photo</div>
          <div className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</div>
        </label>
      </div>

      {original && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <button onClick={colorize} disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Colorizing...' : 'Colorize Photo'}
            </button>
          )}
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
