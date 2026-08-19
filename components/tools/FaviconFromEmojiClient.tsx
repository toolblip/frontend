'use client';

import { useState, useRef } from 'react';

const SIZES = [16, 32, 48, 64, 128, 180, 192, 512];

export default function FaviconFromEmojiClient() {
  const [emoji, setEmoji] = useState('😀');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [transparent, setTransparent] = useState(false);
  const [results, setResults] = useState<{ size: number; url: string }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = () => {
    if (!emoji.trim()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const out = SIZES.map(size => {
      canvas.width = size;
      canvas.height = size;
      ctx.clearRect(0, 0, size, size);
      if (!transparent) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
      }
      ctx.font = `${Math.round(size * 0.75)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, size / 2, size / 2 + size * 0.05);
      return { size, url: canvas.toDataURL('image/png') };
    });
    setResults(out);
  };

  const downloadOne = (size: number, url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `favicon-${size}x${size}.png`;
    a.click();
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-grid-2">
        <div>
          <span className="tb-v2-tool-label">Emoji</span>
          <input
            type="text"
            value={emoji}
            onChange={e => setEmoji(e.target.value)}
            maxLength={8}
            className="tb-v2-input"
            style={{ fontSize: 24 }}
            placeholder="Paste an emoji, e.g. 🚀"
          />
        </div>
        <div>
          <span className="tb-v2-tool-label">Background</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="color"
              value={bgColor}
              onChange={e => setBgColor(e.target.value)}
              disabled={transparent}
              className="tb-v2-input"
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
              <input
                type="checkbox"
                checked={transparent}
                onChange={e => setTransparent(e.target.checked)}
              />
              Transparent
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={generate}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
        disabled={!emoji.trim()}
      >
        Generate Favicon
      </button>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {results.length > 0 && (
        <div className="tb-v2-tool-output-body">
          <span className="tb-v2-tool-label">Download</span>
          <div className="tb-v2-stats-grid" style={{ marginTop: 8 }}>
            {results.map(r => (
              <button
                key={r.size}
                onClick={() => downloadOne(r.size, r.url)}
                className="tb-v2-stat-pill"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.url} alt={`${r.size}x${r.size} favicon`} width={32} height={32} />
                <span style={{ fontSize: 11 }}>{r.size}×{r.size}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
