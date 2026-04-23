'use client';

import { useState, useRef } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { FileSizeError, UpgradeNotice } from '@/components/FileSizeGuard';

export default function ImageResizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintain, setMaintain] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tier } = useSubscription();
  const maxSizeMB = tier === 'free' ? 5 : tier === 'starter' ? 10 : tier === 'ultra' ? 100 : tier === 'max' ? 500 : 5;

  const isOversized = file != null && file.size / (1024 * 1024) > maxSizeMB;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
    img.src = url;
  };

  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url; a.download = `resized-${width}x${height}.png`; a.click();
    };
    img.src = preview;
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Select image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-600 file:text-white file:text-sm file:font-medium hover:file:bg-red-700 cursor-pointer"
        />
        <UpgradeNotice tier={tier} />
        <FileSizeError file={file} maxSizeMB={maxSizeMB} />
      </div>

      {preview && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => {
                  setWidth(Number(e.target.value));
                  if (maintain) {
                    const ratio = Number(e.target.value) / width;
                    setHeight(Math.round(height * ratio));
                  }
                }}
                min={1}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => {
                  setHeight(Number(e.target.value));
                  if (maintain) {
                    const ratio = Number(e.target.value) / height;
                    setWidth(Math.round(width * ratio));
                  }
                }}
                min={1}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={maintain}
              onChange={(e) => setMaintain(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-red-600 focus:ring-red-500"
            />
            Maintain aspect ratio
          </label>

          <div className="flex gap-3">
            <button
              onClick={resize}
              disabled={isOversized}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOversized ? 'File Too Large' : 'Resize & Download'}
            </button>
            <a href={preview} download className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors">
              Download Original
            </a>
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <p className="text-xs text-gray-500 dark:text-gray-400">Preview: {width} × {height}px</p>
        </>
      )}
    </div>
  );
}
