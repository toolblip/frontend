'use client';

import React, { useState } from 'react';

export default function ColorPaletteExtractorClient() {
  const [imageUrl, setImageUrl] = useState('');
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const extractColors = async (url: string) => {
    setLoading(true);
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colorMap: Record<string, number> = {};

      for (let i = 0; i < imageData.length; i += 4) {
        const r = Math.round(imageData[i] / 8) * 8;
        const g = Math.round(imageData[i+1] / 8) * 8;
        const b = Math.round(imageData[i+2] / 8) * 8;
        const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
        colorMap[hex] = (colorMap[hex] || 0) + 1;
      }

      const sorted = Object.entries(colorMap).sort((a, b) => b[1] - a[1]);
      setColors(sorted.slice(0, 12).map(([c]) => c));
    } catch {
      setColors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Image URL</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-3 border rounded-lg"
          />
          <button
            onClick={() => extractColors(imageUrl)}
            disabled={!imageUrl || loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Extracting...' : 'Extract'}
          </button>
        </div>
      </div>

      {colors.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm font-medium">Extracted Colors ({colors.length})</div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-16 h-16 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => navigator.clipboard.writeText(color)}
                  title="Click to copy"
                />
                <div className="text-xs font-mono mt-1">{color.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500">Click any swatch to copy hex value</div>
        </div>
      )}

      {!loading && colors.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-2">🎨</div>
          <div>Enter an image URL and click Extract to pull colors</div>
        </div>
      )}
    </div>
  );
}
