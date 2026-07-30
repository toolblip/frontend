'use client';

import { useState } from 'react';

export default function CmykToRgbClient() {
  const [cyan, setCyan] = useState('');
  const [magenta, setMagenta] = useState('');
  const [yellow, setYellow] = useState('');
  const [key, setKey] = useState('');
  const [rgbResult, setRgbResult] = useState<{ r: number; g: number; b: number } | null>(null);
  const [hexResult, setHexResult] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<'rgb' | 'hex' | ''>('');

  const convertToRgb = () => {
    const c = parseFloat(cyan) / 100;
    const m = parseFloat(magenta) / 100;
    const y = parseFloat(yellow) / 100;
    const k = parseFloat(key) / 100;

    if (isNaN(c) || isNaN(m) || isNaN(y) || isNaN(k)) {
      setRgbResult(null);
      setHexResult(null);
      setError('Enter a value from 0-100 for each of C, M, Y, and K.');
      return;
    }

    setError('');
    const r = Math.round(255 * (1 - c) * (1 - k));
    const g = Math.round(255 * (1 - m) * (1 - k));
    const b = Math.round(255 * (1 - y) * (1 - k));

    setRgbResult({ r, g, b });
    setHexResult(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase());
  };

  const loadExample = () => {
    setCyan('62');
    setMagenta('0');
    setYellow('34');
    setKey('9');
    setRgbResult(null);
    setHexResult(null);
    setError('');
  };

  const copyToClipboard = (text: string, which: 'rgb' | 'hex') => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(which);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CMYK Values</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' }}>
        <div className="tb-v2-grid-2">
          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>
              Cyan (C) <span className="text-gray-500">0-100%</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={cyan}
              onChange={(e) => setCyan(e.target.value)}
              className="tb-v2-input"
              placeholder="0"
            />
          </div>

          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>
              Magenta (M) <span className="text-gray-500">0-100%</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={magenta}
              onChange={(e) => setMagenta(e.target.value)}
              className="tb-v2-input"
              placeholder="0"
            />
          </div>

          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>
              Yellow (Y) <span className="text-gray-500">0-100%</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={yellow}
              onChange={(e) => setYellow(e.target.value)}
              className="tb-v2-input"
              placeholder="0"
            />
          </div>

          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>
              Key/Black (K) <span className="text-gray-500">0-100%</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="tb-v2-input"
              placeholder="0"
            />
          </div>
        </div>

        <button type="button" onClick={convertToRgb} className="tb-v2-btn tb-v2-btn-primary">
          Convert to RGB
        </button>
        {error && <span style={{ fontSize: 13, color: '#ef4444' }}>{error}</span>}
      </div>

      {!rgbResult && !error && (
        <p className="tb-v2-empty">Enter CMYK percentages above and convert to see the RGB and HEX equivalent.</p>
      )}

      {rgbResult && (
        <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="tb-v2-grid-2">
            <div>
              <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>RGB Values</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-white dark:bg-gray-800 rounded border">
                  rgb({rgbResult.r}, {rgbResult.g}, {rgbResult.b})
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`rgb(${rgbResult.r}, ${rgbResult.g}, ${rgbResult.b})`, 'rgb')}
                  className={`tb-v2-copy-btn ${copied === 'rgb' ? 'done' : ''}`}
                >
                  {copied === 'rgb' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div>
              <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>HEX Value</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-white dark:bg-gray-800 rounded border">
                  {hexResult}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(hexResult || '', 'hex')}
                  className={`tb-v2-copy-btn ${copied === 'hex' ? 'done' : ''}`}
                >
                  {copied === 'hex' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="tb-v2-tool-label">Preview:</label>
            <div
              className="w-16 h-16 rounded border"
              style={{ backgroundColor: hexResult || undefined }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
