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

export default function ContrastCheckerApiClient() {
  const [fg, setFg] = useState('#000000');
  const [fgInput, setFgInput] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [bgInput, setBgInput] = useState('#ffffff');
  const [fgError, setFgError] = useState(false);
  const [bgError, setBgError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ratio: number; aa: boolean; aaa: boolean } | null>(null);
  const [copied, setCopied] = useState(false);

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
    setFg('#000000'); setFgInput('#000000'); setFgError(false);
    setBg('#ffffff'); setBgInput('#ffffff'); setBgError(false);
    setResult(null);
  };

  const handleCheck = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const ratio = contrastRatio(fg, bg);
    setResult({ ratio, aa: ratio >= 4.5, aaa: ratio >= 7 });
    setLoading(false);
  };

  const jsonResponse = result
    ? JSON.stringify({ foreground: fg, background: bg, ratio: Number(result.ratio.toFixed(2)), aa: result.aa, aaa: result.aaa }, null, 2)
    : '';

  const handleCopy = () => {
    if (!jsonResponse) return;
    navigator.clipboard.writeText(jsonResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Contrast Checker API</span>
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
        <div style={{ backgroundColor: bg, color: fg, padding: '1rem', borderRadius: '8px', fontFamily: 'monospace' }}>
          API Response Preview
        </div>
        <button type="button" className="tb-v2-btn tb-v2-btn-primary" onClick={handleCheck} disabled={loading}>
          {loading ? 'Checking...' : 'Check via API'}
        </button>
        {result && (
          <div className="bg-gray-900 text-gray-100 rounded-xl p-4 flex flex-col gap-2">
            <pre className="text-xs font-mono whitespace-pre-wrap">{jsonResponse}</pre>
            <button type="button" onClick={handleCopy} className="tb-v2-btn-sm self-start">
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
