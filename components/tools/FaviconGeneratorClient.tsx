'use client';

import { useState, useRef } from 'react';

export default function FaviconGeneratorClient() {
  const [emoji, setEmoji] = useState('🔧');
  const [fg, setFg] = useState('#ffffff');
  const [bg, setBg] = useState('#16a34a');
  const [size, setSize] = useState(32);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadReady, setDownloadReady] = useState(false);

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = bg;
    ctx.beginPath();
    const r = size * 0.18;
    ctx.roundRect(0, 0, size, size, r);
    ctx.fill();

    ctx.fillStyle = fg;
    ctx.font = `${size * 0.55}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, size / 2, size / 2 + size * 0.02);

    setDownloadReady(true);
  };

  const download = (format: 'png' | 'ico' | 'svg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (format === 'svg') {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${size * 0.18}" fill="${bg}"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-size="${size * 0.55}" fill="${fg}">${emoji}</text></svg>`;
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `favicon.svg`; a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'ico') {
      const ico = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = ico; a.download = `favicon.ico`; a.click();
    } else {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url; a.download = `favicon-${size}.png`; a.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Emoji</label>
          <input
            type="text"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 text-2xl"
            maxLength={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Size (px)</label>
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            min={16} max={512}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Background</label>
          <input
            type="color"
            value={bg}
            onChange={(e) => setBg(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Foreground</label>
          <input
            type="color"
            value={fg}
            onChange={(e) => setFg(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </div>

      <button
        onClick={generate}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        Generate
      </button>

      <div className="flex items-center gap-6">
        <canvas ref={canvasRef} className="rounded-lg" style={{ display: downloadReady ? 'block' : 'none' }} />
        {downloadReady && (
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => download('png')} className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">PNG</button>
            <button onClick={() => download('ico')} className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">ICO</button>
            <button onClick={() => download('svg')} className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">SVG</button>
          </div>
        )}
      </div>
    </div>
  );
}
