'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Rgba = { r: number; g: number; b: number; a: number };

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
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
  const hh = h / 360;
  return {
    r: Math.round(hue2rgb(p, q, hh + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hh) * 255),
    b: Math.round(hue2rgb(p, q, hh - 1 / 3) * 255),
  };
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

function hsvToRgb(h: number, s: number, v: number) {
  h = ((h % 360) + 360) % 360 / 360;
  s = clamp(s, 0, 100) / 100;
  v = clamp(v, 0, 100) / 100;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0;
  let g = 0;
  let b = 0;
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    default:
      r = v;
      g = p;
      b = q;
      break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToCmyk(r: number, g: number, b: number) {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rr - k) / (1 - k)) * 100),
    m: Math.round(((1 - gg - k) / (1 - k)) * 100),
    y: Math.round(((1 - bb - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function cmykToRgb(c: number, m: number, y: number, k: number) {
  c /= 100;
  m /= 100;
  y /= 100;
  k /= 100;
  return {
    r: Math.round(255 * (1 - c) * (1 - k)),
    g: Math.round(255 * (1 - m) * (1 - k)),
    b: Math.round(255 * (1 - y) * (1 - k)),
  };
}

function aToByte(a: number) {
  return Math.round(clamp(a, 0, 1) * 255);
}

function formatHex(c: Rgba) {
  return `#${[c.r, c.g, c.b]
    .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0'))
    .join('')}`;
}

function formatHex8(c: Rgba) {
  return `${formatHex(c)}${aToByte(c.a).toString(16).padStart(2, '0')}`;
}

function parseColor(input: string): Rgba | null {
  const raw = input.trim().toLowerCase();
  if (!raw) return null;

  const hex = raw.match(/^#?([a-f0-9]{3}|[a-f0-9]{6}|[a-f0-9]{8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const hasAlpha = h.length === 8;
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: hasAlpha ? parseInt(h.slice(6, 8), 16) / 255 : 1,
    };
  }

  const rgba = raw.match(/^rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/);
  if (rgba) {
    return {
      r: clamp(+rgba[1], 0, 255),
      g: clamp(+rgba[2], 0, 255),
      b: clamp(+rgba[3], 0, 255),
      a: rgba[4] !== undefined ? clamp(+rgba[4], 0, 1) : 1,
    };
  }

  const hsla = raw.match(/^hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?(?:\s*,\s*([\d.]+))?\s*\)$/);
  if (hsla) {
    const rgb = hslToRgb(+hsla[1], +hsla[2], +hsla[3]);
    return { ...rgb, a: hsla[4] !== undefined ? clamp(+hsla[4], 0, 1) : 1 };
  }

  const hsv = raw.match(/^hsva?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?(?:\s*,\s*([\d.]+))?\s*\)$/);
  if (hsv) {
    const rgb = hsvToRgb(+hsv[1], +hsv[2], +hsv[3]);
    return { ...rgb, a: hsv[4] !== undefined ? clamp(+hsv[4], 0, 1) : 1 };
  }

  const cmyk = raw.match(/^cmyk\s*\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*\)$/);
  if (cmyk) {
    return { ...cmykToRgb(+cmyk[1], +cmyk[2], +cmyk[3], +cmyk[4]), a: 1 };
  }

  return null;
}

const EXAMPLE = 'rgba(52, 152, 219, 0.85)';

export default function ColorFormatConverterV2Client() {
  const [input, setInput] = useState('#3498db');
  const [alpha, setAlpha] = useState(1);
  const [copied, setCopied] = useState('');

  const parsed = useMemo(() => parseColor(input), [input]);
  const color: Rgba | null = parsed
    ? { ...parsed, a: input.toLowerCase().includes('a(') || /#[a-f0-9]{8}$/i.test(input.trim()) ? parsed.a : alpha }
    : null;

  const formats = useMemo(() => {
    if (!color) return [];
    const hsl = rgbToHsl(color.r, color.g, color.b);
    const hsv = rgbToHsv(color.r, color.g, color.b);
    const cmyk = rgbToCmyk(color.r, color.g, color.b);
    const a = Number(color.a.toFixed(2));
    return [
      { label: 'HEX', value: formatHex(color).toUpperCase() },
      { label: 'HEX8', value: formatHex8(color).toUpperCase() },
      { label: 'RGB', value: `rgb(${color.r}, ${color.g}, ${color.b})` },
      { label: 'RGBA', value: `rgba(${color.r}, ${color.g}, ${color.b}, ${a})` },
      { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
      { label: 'HSLA', value: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a})` },
      { label: 'HSV', value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
      { label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
    ];
  }, [color]);

  const swatchHex = color ? formatHex(color) : '#000000';
  const pickerValue = /^#[0-9a-fA-F]{6}$/.test(swatchHex) ? swatchHex : '#3498db';

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  const onPicker = (hex: string) => {
    setInput(hex);
    setAlpha(1);
  };

  const onAlpha = (value: number) => {
    setAlpha(value);
    if (!parsed) return;
    const next = { ...parsed, a: value };
    setInput(`rgba(${next.r}, ${next.g}, ${next.b}, ${Number(value.toFixed(2))})`);
  };

  return (
    <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' }}>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color</span>
        <ToolExampleClearActions
          onExample={() => {
            setInput(EXAMPLE);
            setAlpha(0.85);
          }}
          onClear={() => {
            setInput('');
            setAlpha(1);
          }}
          canClear={Boolean(input)}
        />
      </div>

      <p style={{ fontSize: 13, color: 'var(--tb-text-secondary)', margin: 0 }}>
        Paste HEX, RGB, RGBA, HSL, HSLA, HSV, or CMYK. Pick a color or adjust alpha. All formats update live.
      </p>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          type="color"
          value={pickerValue}
          onChange={(e) => onPicker(e.target.value)}
          aria-label="Pick color"
          style={{ width: 44, height: 44, borderRadius: 8, border: '1px solid var(--tb-border)', cursor: 'pointer', padding: 0 }}
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="tb-v2-input"
          style={{ fontFamily: 'var(--f-mono)', flex: 1 }}
          placeholder="#3498db or rgba(52, 152, 219, 0.85)"
          spellCheck={false}
        />
      </div>

      <div>
        <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>
          Alpha ({Number(alpha.toFixed(2))})
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={alpha}
          onChange={(e) => onAlpha(+e.target.value)}
          className="tb-v2-range"
          style={{ width: '100%' }}
        />
      </div>

      {color ? (
        <>
          <div
            className="w-full h-24 rounded-lg border flex items-center justify-center text-lg font-mono font-semibold"
            style={{
              backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
              color: color.r * 0.299 + color.g * 0.587 + color.b * 0.114 > 150 ? '#111' : '#fff',
            }}
          >
            {formatHex(color).toUpperCase()}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {formats.map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--tb-border)',
                  background: 'var(--tb-bg-elevated, transparent)',
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)' }}>{label}</div>
                  <div className="font-mono" style={{ fontSize: 14 }}>
                    {value}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copy(label, value)}
                  className={`tb-v2-copy-btn ${copied === label ? 'done' : ''}`}
                >
                  {copied === label ? 'Copied' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : input ? (
        <p className="tb-v2-empty">Could not parse color. Try #ff0000, rgb(255,0,0), hsl(0,100%,50%), or cmyk(0%,100%,100%,0%).</p>
      ) : (
        <p className="tb-v2-empty">Enter or pick a color to see HEX, RGB, RGBA, HSL, HSLA, HSV, and CMYK.</p>
      )}
    </div>
  );
}
