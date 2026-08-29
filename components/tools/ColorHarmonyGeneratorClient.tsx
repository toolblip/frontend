'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h / 360 + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h / 360) * 255);
  const b = Math.round(hue2rgb(p, q, h / 360 - 1 / 3) * 255);
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

const schemes: Record<string, number[]> = {
  complement: [0],
  triad: [0, 120, 240],
  analogous: [-30, 0, 30],
  split: [0, 150, 210],
  square: [0, 90, 180, 270],
};

const DEFAULT_HUE = 200;
const DEFAULT_SCHEME = 'analogous' as const;

export default function ColorHarmonyGeneratorClient() {
  const [hue, setHue] = useState(DEFAULT_HUE);
  const [scheme, setScheme] = useState<'complement' | 'triad' | 'analogous' | 'split' | 'square'>(DEFAULT_SCHEME);
  const [copied, setCopied] = useState(false);

  const colors = schemes[scheme].map((offset) => {
    const h = (hue + offset + 360) % 360;
    return [hslToHex(h, 70, 50), hslToHex(h, 60, 70), hslToHex(h, 60, 40)];
  });

  const allColors = colors.flat();
  const canClear = hue !== DEFAULT_HUE || scheme !== DEFAULT_SCHEME;

  const copyAll = () => {
    navigator.clipboard.writeText(allColors.join('\n')).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Color Harmony Generator</span>
        <ToolExampleClearActions
          onExample={() => {
            setHue(340);
            setScheme('triad');
          }}
          onClear={() => {
            setHue(DEFAULT_HUE);
            setScheme(DEFAULT_SCHEME);
          }}
          canClear={canClear}
        />
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' }}>
        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 8, display: 'block' }}>
            Base Hue: {hue}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={hue}
            onChange={(e) => setHue(+e.target.value)}
            className="tb-v2-range"
            style={{ width: '100%' }}
          />
          <div
            className="h-4 rounded mt-1"
            style={{
              background:
                'linear-gradient(to right, hsl(0,70%,50%), hsl(60,70%,50%), hsl(120,70%,50%), hsl(180,70%,50%), hsl(240,70%,50%), hsl(300,70%,50%), hsl(360,70%,50%))',
            }}
          />
        </div>

        <div className="tb-v2-mode-tabs" style={{ flexWrap: 'wrap' }}>
          {Object.keys(schemes).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScheme(s as typeof scheme)}
              className={`tb-v2-mode-tab ${scheme === s ? 'on' : ''}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {colors.map((group, i) => (
            <div key={i} className="flex gap-3">
              {group.map((c, j) => (
                <div key={j} className="flex-1 text-center">
                  <div className="h-20 rounded-lg mb-1 border" style={{ backgroundColor: c }} />
                  <span className="text-xs font-mono">{c.toUpperCase()}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={copyAll}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
          style={{ alignSelf: 'flex-start' }}
        >
          {copied ? 'Copied' : `Copy All (${allColors.length} colors)`}
        </button>
      </div>
    </div>
  );
}
