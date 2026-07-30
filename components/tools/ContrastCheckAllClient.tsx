'use client';

import { useState } from 'react';

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  return { r: parseInt(h.substring(0, 2), 16), g: parseInt(h.substring(2, 4), 16), b: parseInt(h.substring(4, 6), 16) };
}

function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(hex1: string, hex2: string) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export default function ContrastCheckAllClient() {
  const [colors, setColors] = useState(['#000000', '#ffffff', '#ff0000', '#00ff00']);
  const [results, setResults] = useState<Array<{ fg: string; bg: string; ratio: number; pass: boolean }>>([]);

  const loadExample = () => {
    setColors(['#111827', '#f9fafb', '#2563eb', '#fbbf24']);
    setResults([]);
  };

  const handleCheck = () => {
    const r = [];
    for (let i = 0; i < colors.length - 1; i++) {
      const ratio = contrastRatio(colors[i], colors[i + 1]);
      r.push({ fg: colors[i], bg: colors[i + 1], ratio, pass: ratio >= 4.5 });
    }
    setResults(r);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Contrast Check All</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
        <div className="flex gap-3 flex-wrap">
          {colors.map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <input type="color" value={c} onChange={e => { const n = [...colors]; n[i] = e.target.value; setColors(n); setResults([]); }} className="w-10 h-10 rounded cursor-pointer border-0" />
              <span className="text-xs text-gray-500 font-mono">{c}</span>
            </div>
          ))}
        </div>
        <button type="button" className="tb-v2-btn tb-v2-btn-primary" onClick={handleCheck}>
          Check All Pairs
        </button>
        {results.length > 0 && (
          <div className="flex flex-col gap-2">
            {results.map((r, i) => (
              <div key={i} className="rounded-xl p-3 flex justify-between items-center" style={{ backgroundColor: r.bg, color: r.fg }}>
                <strong>{r.fg} / {r.bg}</strong>
                <span>{r.ratio.toFixed(2)}:1 {r.pass ? 'PASS' : 'FAIL'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
