'use client';

import { useState } from 'react';

export default function ColorPaletteExtractorClient() {
  const [imageUrl, setImageUrl] = useState('');
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const extractColors = async (url: string) => {
    setLoading(true);
    setError('');
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
      setError('Could not load or process that image. Check the URL and make sure the server allows cross-origin image access.');
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const swatches = ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c'];
    swatches.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect((i % 3) * 80, Math.floor(i / 3) * 80, 80, 80);
    });
    const dataUrl = canvas.toDataURL();
    setImageUrl(dataUrl);
    extractColors(dataUrl);
  };

  const copy = (color: string) => {
    navigator.clipboard.writeText(color.toUpperCase()).catch(() => {});
    setCopied(color);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Palette Extractor</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div>
        <label className="tb-v2-tool-label" style={{marginBottom:8,display:'block'}}>Image URL</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={imageUrl}
            onChange={e => { setImageUrl(e.target.value); setError(''); }}
            placeholder="https://example.com/image.jpg"
            className="tb-v2-input flex-1"
          />
          <button
            type="button"
            onClick={() => extractColors(imageUrl)}
            disabled={!imageUrl || loading}
            className="tb-v2-btn tb-v2-btn-primary"
          >
            {loading ? 'Extracting...' : 'Extract'}
          </button>
        </div>
        {error && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{error}</p>}
      </div>

      {colors.length > 0 && (
        <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
          <div className="text-sm font-medium">Extracted Colors ({colors.length})</div>
          <div className="flex flex-wrap gap-3">
            {colors.map((color, i) => (
              <button key={i} type="button" onClick={() => copy(color)} className="text-center">
                <div
                  className="w-16 h-16 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: color }}
                  title="Click to copy"
                />
                <div className="text-xs font-mono mt-1">{copied === color ? 'Copied' : color.toUpperCase()}</div>
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500">Click any swatch to copy hex value</div>
        </div>
      )}

      {!loading && colors.length === 0 && !error && (
        <div className="tb-v2-empty">Enter an image URL and click Extract to pull colors, or click Load Example.</div>
      )}
    </div>
  );
}
