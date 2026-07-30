'use client';

import { useState } from 'react';

export default function ColorPaletteFromImageClient() {
  const [url, setUrl] = useState('');
  const [palette, setPalette] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const extract = async (imgUrl: string) => {
    if (!imgUrl) return;
    setLoading(true);
    setError('');
    try {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.src = imgUrl;
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      const m: Record<string, number> = {};
      for (let i = 0; i < d.length; i += 4) {
        const r = Math.round(d[i]/16)*16, g = Math.round(d[i+1]/16)*16, b = Math.round(d[i+2]/16)*16;
        const hex = '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
        m[hex] = (m[hex]||0)+1;
      }
      const top = Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([c])=>c);
      setPalette(top);
    } catch {
      setPalette([]);
      setError('Could not load or process that image. Check the URL and make sure the server allows cross-origin image access.');
    }
    finally { setLoading(false); }
  };

  const loadExample = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const swatches = ['#16a085', '#27ae60', '#2980b9', '#8e44ad', '#f39c12', '#d35400'];
    swatches.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect((i % 3) * 80, Math.floor(i / 3) * 80, 80, 80);
    });
    const dataUrl = canvas.toDataURL();
    setUrl(dataUrl);
    extract(dataUrl);
  };

  const copy = (color: string) => {
    navigator.clipboard.writeText(color.toUpperCase()).catch(() => {});
    setCopied(color);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Palette From Image</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={e => { setUrl(e.target.value); setError(''); }}
          placeholder="Image URL..."
          className="tb-v2-input flex-1"
        />
        <button
          type="button"
          onClick={() => extract(url)}
          disabled={!url || loading}
          className="tb-v2-btn tb-v2-btn-primary"
        >
          {loading ? 'Extracting...' : 'Extract'}
        </button>
      </div>
      {error && <p style={{ fontSize: 12, color: '#ef4444' }}>{error}</p>}

      {palette.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium">Palette</div>
          <div className="flex flex-wrap gap-3">
            {palette.map((c, i) => (
              <button key={i} type="button" onClick={() => copy(c)} className="text-center">
                <div className="w-14 h-14 rounded-lg border border-gray-200" style={{backgroundColor:c}}/>
                <div className="text-xs font-mono mt-1">{copied === c ? 'Copied' : c.toUpperCase()}</div>
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-400">Click swatch to copy</div>
        </div>
      ) : (
        !loading && !error && <div className="tb-v2-empty">Enter an image URL and click Extract, or click Load Example.</div>
      )}
    </div>
  );
}
