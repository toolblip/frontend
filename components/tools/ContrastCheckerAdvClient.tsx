'use client';

import { useState } from 'react';

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

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

function suggestionsFor(ratio: number, aa: boolean, aaa: boolean): string[] {
  if (aaa) return ['Great contrast!', 'Perfect for body text'];
  if (aa) return ['Passes AA, but not AAA', 'Consider darkening the foreground or lightening the background for AAA'];
  if (ratio >= 3) return ['Only passes for large text (18pt+ or 14pt bold)', 'Increase contrast for normal body text'];
  return ['Contrast is too low for WCAG', 'Try a darker foreground or lighter background'];
}

export default function ContrastCheckerAdvClient() {
  const [fg, setFg] = useState('#222222');
  const [fgInput, setFgInput] = useState('#222222');
  const [bg, setBg] = useState('#f0f0f0');
  const [bgInput, setBgInput] = useState('#f0f0f0');
  const [fgError, setFgError] = useState(false);
  const [bgError, setBgError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ratio: number; aa: boolean; aaa: boolean; suggestions: string[] } | null>(null);

  const handleFgInput = (value: string) => {
    setFgInput(value);
    if (isValidHex(value)) { setFg(value.startsWith('#') ? value : `#${value}`); setFgError(false); }
    else setFgError(true);
  };

  const handleBgInput = (value: string) => {
    setBgInput(value);
    if (isValidHex(value)) { setBg(value.startsWith('#') ? value : `#${value}`); setBgError(false); }
    else setBgError(true);
  };

  const loadExample = () => {
    setFg('#222222'); setFgInput('#222222'); setFgError(false);
    setBg('#f0f0f0'); setBgInput('#f0f0f0'); setBgError(false);
    setResult(null);
  };

  const handleCheck = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const ratio = contrastRatio(fg, bg);
    const aa = ratio >= 4.5;
    const aaa = ratio >= 7;
    setResult({ ratio, aa, aaa, suggestions: suggestionsFor(ratio, aa, aaa) });
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Contrast Checker Advanced</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Foreground</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={fg} onChange={e => { setFg(e.target.value); setFgInput(e.target.value.toUpperCase()); setFgError(false); }} className="w-12 h-10 rounded cursor-pointer border-0" />
            <input className="tb-v2-input" value={fgInput} onChange={e => handleFgInput(e.target.value)} />
          </div>
          {fgError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color.</p>}
        </div>
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Background</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={bg} onChange={e => { setBg(e.target.value); setBgInput(e.target.value.toUpperCase()); setBgError(false); }} className="w-12 h-10 rounded cursor-pointer border-0" />
            <input className="tb-v2-input" value={bgInput} onChange={e => handleBgInput(e.target.value)} />
          </div>
          {bgError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color.</p>}
        </div>
        <div style={{ backgroundColor: bg, color: fg, padding: '1.5rem', borderRadius: '12px' }}>
          <strong>Advanced Preview</strong><br/>The quick brown fox jumps over the lazy dog.
        </div>
        <button type="button" className="tb-v2-btn tb-v2-btn-primary" onClick={handleCheck} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Contrast'}
        </button>
        {result && (
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1">
            <p className="text-sm"><strong>Ratio:</strong> {result.ratio.toFixed(2)}:1</p>
            <p className="text-sm"><strong>WCAG AA:</strong> {result.aa ? 'Pass' : 'Fail'}</p>
            <p className="text-sm"><strong>WCAG AAA:</strong> {result.aaa ? 'Pass' : 'Fail'}</p>
            <ul className="text-sm list-disc pl-5 mt-1">{result.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}
