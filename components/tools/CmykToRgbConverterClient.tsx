'use client';

import { useState, useEffect } from 'react';

function cmykToRgb(c: number, m: number, y: number, k: number): { rgb: string; hex: string; r: number; g: number; b: number } {
  const r = Math.round(255 * (1 - c / 100) * (1 - k / 100));
  const g = Math.round(255 * (1 - m / 100) * (1 - k / 100));
  const b = Math.round(255 * (1 - y / 100) * (1 - k / 100));
  const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
  return { rgb: `rgb(${r}, ${g}, ${b})`, hex, r, g, b };
}

export default function CmykToRgbConverterClient() {
  const [c, setC] = useState(0);
  const [m, setM] = useState(50);
  const [y, setY] = useState(50);
  const [k, setK] = useState(20);
  const [result, setResult] = useState<ReturnType<typeof cmykToRgb> | null>(null);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    setResult(cmykToRgb(c, m, y, k));
  }, [c, m, y, k]);

  const copy = (format: string) => {
    if (!result) return;
    const values: Record<string, string> = { hex: result.hex, rgb: result.rgb, r: `R: ${result.r}`, g: `G: ${result.g}`, b: `B: ${result.b}` };
    navigator.clipboard.writeText(values[format]).catch(() => {});
    setCopied(format);
    setTimeout(() => setCopied(''), 1500);
  };

  const Slider = ({ label, value, setValue, color }: { label: string; value: number; setValue: (v: number) => void; color: string }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 12, fontFamily: 'var(--f-mono)' }}>{value}%</span>
      </div>
      <input type="range" min={0} max={100} value={value} onChange={(e) => setValue(parseInt(e.target.value))}
        style={{ width: '100%', accentColor: color }} />
    </div>
  );

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">CMYK Input</span></div>
          <div style={{ marginTop: 8 }}>
            <Slider label="Cyan (C)" value={c} setValue={setC} color="#00BCD4" />
            <Slider label="Magenta (M)" value={m} setValue={setM} color="#E91E63" />
            <Slider label="Yellow (Y)" value={y} setValue={setY} color="#FFEB3B" />
            <Slider label="Key/Black (K)" value={k} setValue={setK} color="#333333" />
          </div>
        </div>
        <div>
          <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Output</span></div>
          <div style={{ marginTop: 8 }}>
            {result && (
              <>
                <div style={{ width: '100%', height: 80, background: result.hex, borderRadius: 8, border: '1px solid var(--tb-border)' }} />
                <div style={{ marginTop: 12 }}>
                  <button type="button" onClick={() => copy('hex')} className={`tb-v2-copy-btn ${copied === 'hex' ? 'done' : ''}`} style={{ width: '100%', marginBottom: 6, fontSize: 12 }}>
                    {copied === 'hex' ? 'Copied!' : `HEX: ${result.hex}`}
                  </button>
                  <button type="button" onClick={() => copy('rgb')} className={`tb-v2-copy-btn ${copied === 'rgb' ? 'done' : ''}`} style={{ width: '100%', fontSize: 12 }}>
                    {copied === 'rgb' ? 'Copied!' : result.rgb}
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
