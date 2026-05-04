'use client';

import { useState, useEffect } from 'react';

interface HSL { h: number; s: number; l: number; }

function rgbaToHsl(r: number, g: number, b: number, a: number = 1): { hex: string; hsl: HSL; rgba: string } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  const hex = '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
  return {
    hex,
    hsl: { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) },
    rgba: a < 1 ? `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})` : `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
  };
}

export default function RgbaToHslConverterClient() {
  const [r, setR] = useState(100);
  const [g, setG] = useState(150);
  const [b, setB] = useState(200);
  const [a, setA] = useState(1);
  const [result, setResult] = useState<ReturnType<typeof rgbaToHsl> | null>(null);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    setResult(rgbaToHsl(r, g, b, a));
  }, [r, g, b, a]);

  const copy = (format: string) => {
    if (!result) return;
    const values: Record<string, string> = {
      hex: result.hex,
      hsl: `hsl(${result.hsl.h}, ${result.hsl.s}%, ${result.hsl.l}%)`,
      rgba: result.rgba
    };
    navigator.clipboard.writeText(values[format]).catch(() => {});
    setCopied(format);
    setTimeout(() => setCopied(''), 1500);
  };

  const Slider = ({ label, value, setValue, max = 255 }: { label: string; value: number; setValue: (v: number) => void; max?: number }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 12, fontFamily: 'var(--f-mono)' }}>{value}</span>
      </div>
      <input type="range" min={0} max={max} step={max === 1 ? 0.01 : 1} value={value} onChange={(e) => setValue(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--tb-accent)' }} />
    </div>
  );

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">RGBA Input</span></div>
          <div style={{ marginTop: 8 }}>
            <Slider label="Red" value={r} setValue={setR} />
            <Slider label="Green" value={g} setValue={setG} />
            <Slider label="Blue" value={b} setValue={setB} />
            <Slider label="Alpha" value={a} setValue={setA} max={1} />
          </div>
        </div>
        <div>
          <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Preview</span></div>
          <div style={{ marginTop: 8 }}>
            {result && (
              <>
                <div style={{ width: '100%', height: 80, background: result.rgba, borderRadius: 8, border: '1px solid var(--tb-border)' }} />
                <div style={{ marginTop: 12 }}>
                  <button type="button" onClick={() => copy('hex')} className={`tb-v2-copy-btn ${copied === 'hex' ? 'done' : ''}`} style={{ width: '100%', marginBottom: 6, fontSize: 12 }}>
                    {copied === 'hex' ? 'Copied!' : `HEX: ${result.hex}`}
                  </button>
                  <button type="button" onClick={() => copy('hsl')} className={`tb-v2-copy-btn ${copied === 'hsl' ? 'done' : ''}`} style={{ width: '100%', marginBottom: 6, fontSize: 12 }}>
                    {copied === 'hsl' ? 'Copied!' : `HSL: ${result.hsl.h}°, ${result.hsl.s}%, ${result.hsl.l}%`}
                  </button>
                  <button type="button" onClick={() => copy('rgba')} className={`tb-v2-copy-btn ${copied === 'rgba' ? 'done' : ''}`} style={{ width: '100%', fontSize: 12 }}>
                    {copied === 'rgba' ? 'Copied!' : `RGBA: ${result.rgba}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
