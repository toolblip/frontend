'use client';

import { useState, useEffect } from 'react';

interface CmykColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export default function CmykToRgbToolClient() {
  const [cmyk, setCmyk] = useState<CmykColor>({ c: 0, m: 0, y: 0, k: 0 });
  const [rgb, setRgb] = useState<RgbColor>({ r: 0, g: 0, b: 0 });
  const [hex, setHex] = useState('#000000');
  const [hexInput, setHexInput] = useState('#000000');
  const [hexError, setHexError] = useState(false);
  const [mode, setMode] = useState<'cmyk-to-rgb' | 'rgb-to-cmyk'>('cmyk-to-rgb');
  const [history, setHistory] = useState<CmykColor[]>([]);
  const [copied, setCopied] = useState<'rgb' | 'cmyk' | 'hex' | ''>('');

  const cmykToRgb = (c: number, m: number, y: number, k: number): RgbColor => {
    const r = Math.round(255 * (1 - c / 100) * (1 - k / 100));
    const g = Math.round(255 * (1 - m / 100) * (1 - k / 100));
    const b = Math.round(255 * (1 - y / 100) * (1 - k / 100));
    return { r, g, b };
  };

  const rgbToCmyk = (r: number, g: number, b: number): CmykColor => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 100 };
    }

    const c = ((1 - rNorm - k) / (1 - k)) * 100;
    const m = ((1 - gNorm - k) / (1 - k)) * 100;
    const y = ((1 - bNorm - k) / (1 - k)) * 100;

    return {
      c: Math.round(c),
      m: Math.round(m),
      y: Math.round(y),
      k: Math.round(k * 100),
    };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
  };

  const hexToRgb = (value: string): RgbColor | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  useEffect(() => {
    if (mode === 'cmyk-to-rgb') {
      const result = cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
      setRgb(result);
      const newHex = rgbToHex(result.r, result.g, result.b);
      setHex(newHex);
      setHexInput(newHex);
    } else {
      const result = rgbToCmyk(rgb.r, rgb.g, rgb.b);
      setCmyk(result);
      const newHex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setHex(newHex);
      setHexInput(newHex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmyk, rgb, mode]);

  const handleHexChange = (value: string) => {
    setHexInput(value);
    const parsed = hexToRgb(value);
    if (parsed) {
      setHexError(false);
      setRgb(parsed);
      setMode('rgb-to-cmyk');
    } else {
      setHexError(true);
    }
  };

  const saveToHistory = () => {
    setHistory((prev) => [...prev.slice(-9), { ...cmyk }]);
  };

  const loadFromHistory = (item: CmykColor) => {
    setCmyk(item);
    setMode('cmyk-to-rgb');
  };

  const loadExample = () => {
    setMode('cmyk-to-rgb');
    setCmyk({ c: 82, m: 0, y: 34, k: 9 });
  };

  const copyToClipboard = (text: string, which: 'rgb' | 'cmyk' | 'hex') => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(which);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CMYK to RGB Color Tool</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-mode-tabs">
        <button type="button" onClick={() => setMode('cmyk-to-rgb')} className={`tb-v2-mode-tab ${mode === 'cmyk-to-rgb' ? 'on' : ''}`}>
          CMYK to RGB
        </button>
        <button type="button" onClick={() => setMode('rgb-to-cmyk')} className={`tb-v2-mode-tab ${mode === 'rgb-to-cmyk' ? 'on' : ''}`}>
          RGB to CMYK
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 20px' }}>
          <h3 className="tb-v2-section-title">CMYK Values</h3>

          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 4, display: 'block' }}>C: {cmyk.c}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={cmyk.c}
              onChange={(e) => { setCmyk({ ...cmyk, c: Number(e.target.value) }); setMode('cmyk-to-rgb'); }}
              className="tb-v2-range"
            />
          </div>

          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 4, display: 'block' }}>M: {cmyk.m}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={cmyk.m}
              onChange={(e) => { setCmyk({ ...cmyk, m: Number(e.target.value) }); setMode('cmyk-to-rgb'); }}
              className="tb-v2-range"
            />
          </div>

          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 4, display: 'block' }}>Y: {cmyk.y}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={cmyk.y}
              onChange={(e) => { setCmyk({ ...cmyk, y: Number(e.target.value) }); setMode('cmyk-to-rgb'); }}
              className="tb-v2-range"
            />
          </div>

          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 4, display: 'block' }}>K: {cmyk.k}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={cmyk.k}
              onChange={(e) => { setCmyk({ ...cmyk, k: Number(e.target.value) }); setMode('cmyk-to-rgb'); }}
              className="tb-v2-range"
            />
          </div>
        </div>

        <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 20px' }}>
          <h3 className="tb-v2-section-title">RGB Values</h3>

          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 4, display: 'block' }}>R: {rgb.r}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.r}
              onChange={(e) => { setRgb({ ...rgb, r: Number(e.target.value) }); setMode('rgb-to-cmyk'); }}
              className="tb-v2-range"
              style={{ accentColor: '#ff0000' }}
            />
          </div>

          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 4, display: 'block' }}>G: {rgb.g}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.g}
              onChange={(e) => { setRgb({ ...rgb, g: Number(e.target.value) }); setMode('rgb-to-cmyk'); }}
              className="tb-v2-range"
              style={{ accentColor: '#00ff00' }}
            />
          </div>

          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 4, display: 'block' }}>B: {rgb.b}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.b}
              onChange={(e) => { setRgb({ ...rgb, b: Number(e.target.value) }); setMode('rgb-to-cmyk'); }}
              className="tb-v2-range"
              style={{ accentColor: '#0000ff' }}
            />
          </div>
        </div>
      </div>

      <div className="tb-v2-section" style={{ padding: '16px 20px' }}>
        <div className="flex items-center gap-6">
          <div
            className="w-32 h-32 rounded border shrink-0"
            style={{ backgroundColor: hex }}
          />

          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                RGB({rgb.r}, {rgb.g}, {rgb.b})
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard(`RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                className={`tb-v2-copy-btn ${copied === 'rgb' ? 'done' : ''}`}
              >
                {copied === 'rgb' ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                CMYK({cmyk.c}, {cmyk.m}, {cmyk.y}, {cmyk.k})
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard(`CMYK(${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k})`, 'cmyk')}
                className={`tb-v2-copy-btn ${copied === 'cmyk' ? 'done' : ''}`}
              >
                {copied === 'cmyk' ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                className="tb-v2-input flex-1"
                style={{ fontFamily: 'var(--f-mono)' }}
                aria-label="Hex input"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(hex, 'hex')}
                className={`tb-v2-copy-btn ${copied === 'hex' ? 'done' : ''}`}
              >
                {copied === 'hex' ? 'Copied' : 'Copy'}
              </button>
            </div>
            {hexError && <span style={{ fontSize: 12, color: '#ef4444' }}>Enter a valid 6-digit hex color (e.g., #3366FF).</span>}
          </div>
        </div>
      </div>

      <button type="button" onClick={saveToHistory} className="tb-v2-btn tb-v2-btn-primary" style={{ alignSelf: 'flex-start' }}>
        Save to History
      </button>

      {history.length === 0 ? (
        <p className="tb-v2-empty">Save colors to build a quick-access history below.</p>
      ) : (
        <div>
          <h3 className="tb-v2-section-title" style={{ marginBottom: 8 }}>History</h3>
          <div className="tb-v2-mode-tabs" style={{ flexWrap: 'wrap' }}>
            {history.map((item, index) => {
              const result = cmykToRgb(item.c, item.m, item.y, item.k);
              const itemHex = rgbToHex(result.r, result.g, result.b);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => loadFromHistory(item)}
                  className="tb-v2-mode-tab flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: itemHex }}
                  />
                  <span className="text-sm">
                    C{item.c} M{item.m} Y{item.y} K{item.k}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
