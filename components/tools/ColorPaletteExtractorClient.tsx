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
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colorMap: Record<string, number> = {};

      for (let i = 0; i < imageData.length; i += 4) {
        if (imageData[i + 3] < 128) continue;
        const r = Math.round(imageData[i] / 8) * 8;
        const g = Math.round(imageData[i + 1] / 8) * 8;
        const b = Math.round(imageData[i + 2] / 8) * 8;
        const hex = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
        colorMap[hex] = (colorMap[hex] || 0) + 1;
      }

      const sorted = Object.entries(colorMap).sort((a, b) => b[1] - a[1]);
      setColors(sorted.slice(0, 12).map(([c]) => c));
    } catch {
      setColors([]);
      setError(
        'Could not load or process that image. Check the URL and make sure the server allows cross-origin image access.'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    setImageUrl(SAMPLE);
    extractColors(SAMPLE);
  };

  const clearAll = () => {
    setImageUrl('');
    setColors([]);
    setError('');
  };

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImageUrl(dataUrl);
      extractColors(dataUrl);
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
        <span className="tb-v2-tool-label">Color Palette Extractor</span>
        <ToolExampleClearActions
          onExample={loadExample}
          onClear={clearAll}
          canClear={Boolean(imageUrl || colors.length)}
        />
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20 }}>
        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 8, display: 'block' }}>
            Image URL or upload
          </label>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              value={imageUrl.startsWith('data:') ? '' : imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setError('');
              }}
              placeholder="https://example.com/image.jpg"
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
              onClick={() => extractColors(imageUrl)}
              disabled={!imageUrl || loading}
              className="tb-v2-btn tb-v2-btn-primary"
            >
              {loading ? 'Extracting…' : 'Extract'}
            </button>
          </div>
          {error && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{error}</p>}
        </div>

        {colors.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-3">Extracted colors ({colors.length})</div>
            <div className="flex flex-wrap gap-3">
              {colors.map((color, i) => {
                const rgb = hexToRgb(color);
                const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                return (
                  <button key={i} type="button" onClick={() => copy(color)} className="text-left">
                    <div
                      className="w-16 h-16 rounded-lg border border-gray-200 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <div className="text-xs font-mono mt-1">
                      {copied === color ? 'Copied' : color.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {rgb.r}, {rgb.g}, {rgb.b}
                    </div>
                    <div className="text-xs text-gray-500">
                      {hsl.h}°, {hsl.s}%, {hsl.l}%
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!loading && colors.length === 0 && !error && (
          <div className="tb-v2-empty">Enter an image URL, upload a file, or use Examples.</div>
        )}
      </div>
    </div>
  );
}
