'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const SAMPLE = '/samples/tool-sample.png';

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      default:
        h = ((rn - gn) / d + 4) / 6;
        break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

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
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      const m: Record<string, number> = {};
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 128) continue;
        // Floor buckets stay ≤240 — Math.round(255/16)*16 === 256 breaks hex (3 digits).
        const r = Math.floor(d[i] / 16) * 16,
          g = Math.floor(d[i + 1] / 16) * 16,
          b = Math.floor(d[i + 2] / 16) * 16;
        const hex = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
        m[hex] = (m[hex] || 0) + 1;
      }
      const top = Object.entries(m)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([c]) => c);
      setPalette(top);
    } catch {
      setPalette([]);
      setError(
        'Could not load or process that image. Check the URL and make sure the server allows cross-origin image access.'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    setUrl(SAMPLE);
    extract(SAMPLE);
  };

  const clearAll = () => {
    setUrl('');
    setPalette([]);
    setError('');
  };

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setUrl(dataUrl);
      extract(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const copy = (color: string) => {
    navigator.clipboard.writeText(color.toUpperCase()).catch(() => {});
    setCopied(color);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Color Palette from Image</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clearAll}
          canClear={Boolean(url || palette.length)}
        />
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20 }}>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={url.startsWith('data:') ? '' : url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
            placeholder="Image URL…"
            className="tb-v2-input flex-1"
            style={{ minWidth: 180 }}
          />
          <label className="tb-v2-btn tb-v2-btn-ghost" style={{ cursor: 'pointer' }}>
            Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
          <button
            type="button"
            onClick={() => extract(url)}
            disabled={!url || loading}
            className="tb-v2-btn tb-v2-btn-primary"
          >
            {loading ? 'Extracting…' : 'Extract'}
          </button>
        </div>
        {url.startsWith('data:') && (
          <p style={{ fontSize: 12, color: 'var(--tb-text-secondary)', margin: 0 }}>Using uploaded / sample image</p>
        )}
        {error && <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{error}</p>}

        {palette.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="text-sm font-medium">5-color palette</div>
            <div className="flex flex-wrap gap-3">
              {palette.map((c, i) => {
                const rgb = hexToRgb(c);
                const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                return (
                  <button key={i} type="button" onClick={() => copy(c)} className="text-left">
                    <div className="w-14 h-14 rounded-lg border border-gray-200" style={{ backgroundColor: c }} />
                    <div className="text-xs font-mono mt-1">{copied === c ? 'Copied' : c.toUpperCase()}</div>
                    <div className="text-xs text-gray-500">
                      {rgb.r},{rgb.g},{rgb.b}
                    </div>
                    <div className="text-xs text-gray-500">
                      {hsl.h}° {hsl.s}% {hsl.l}%
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="tb-v2-empty">Enter an image URL, upload a file, or use Example.</div>
          )
        )}
      </div>
    </div>
  );
}
