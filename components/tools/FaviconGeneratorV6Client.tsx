'use client';

import { useState } from 'react';

export default function FaviconGeneratorV6Client() {
  const [letter, setLetter] = useState('F');
  const [bg, setBg] = useState('#ec4899');
  const [style, setStyle] = useState<'circle' | 'square'>('circle');

  const generate = () => {
    const size = 48;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = bg;
    if (style === 'circle') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, size, size);
    }

    ctx.fillStyle = '#fff';
    ctx.font = `bold ${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter.toUpperCase(), size / 2, size / 2);

    const link = document.createElement('a');
    link.download = 'favicon-v6.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Favicon Generator V6</h2>
        <p className="tb-v2-card-description">Minimal favicon generator</p>
      </div>

      <div className="flex gap-6 mb-6">
        <div
          className={`w-20 h-20 flex items-center justify-center text-3xl font-bold text-white ${style === 'circle' ? 'rounded-full' : ''}`}
          style={{ backgroundColor: bg }}
        >
          {letter.toUpperCase()}
        </div>

        <div className="flex-1 space-y-3">
          <div className="tb-v2-form-group">
            <label className="tb-v2-label">Letter</label>
            <input
              type="text"
              value={letter}
              onChange={(e) => setLetter(e.target.value.substring(0, 1))}
              className="tb-v2-input"
            />
          </div>
          <div className="tb-v2-form-group">
            <label className="tb-v2-label">Background</label>
            <input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="tb-v2-input h-10 w-full cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(['circle', 'square'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={`tb-v2-button-secondary flex-1 capitalize ${style === s ? 'tb-v2-button-primary' : ''}`}
          >
            {s}
          </button>
        ))}
      </div>

      <button onClick={generate} className="tb-v2-button-primary w-full">
        Download
      </button>
    </div>
  );
}
</parameter>
