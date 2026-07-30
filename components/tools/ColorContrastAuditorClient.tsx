'use client';

import { useState } from 'react';

interface ContrastResult {
  color: string;
  ratio: number;
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
}

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

function getLuminance(hex: string): number {
  const rgb = parseInt(hex.replace('#', ''), 16);
  const r = ((rgb >> 16) & 255) / 255;
  const g = ((rgb >> 8) & 255) / 255;
  const b = (rgb & 255) / 255;
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export default function ColorContrastAuditorClient() {
  const [fg, setFg] = useState('#000000');
  const [fgInput, setFgInput] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [bgInput, setBgInput] = useState('#ffffff');
  const [results, setResults] = useState<ContrastResult[]>([]);
  const [auditText, setAuditText] = useState('');
  const [audited, setAudited] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFgInput = (value: string) => {
    setFgInput(value);
    if (isValidHex(value)) setFg(value.startsWith('#') ? value : `#${value}`);
  };

  const handleBgInput = (value: string) => {
    setBgInput(value);
    if (isValidHex(value)) setBg(value.startsWith('#') ? value : `#${value}`);
  };

  const ratio = getContrastRatio(fg, bg);
  const aa = ratio >= 4.5;
  const aaa = ratio >= 7;
  const aaLarge = ratio >= 3;

  const loadExample = () => {
    setFg('#333333');
    setFgInput('#333333');
    setBg('#f5f5f5');
    setBgInput('#f5f5f5');
    setAuditText('#ff0000\n#00aa00\n#0000ff\n#888888');
    setResults([]);
    setAudited(false);
  };

  const auditColors = () => {
    const lines = auditText.split('\n').filter(l => l.trim());
    const parsed: ContrastResult[] = [];
    for (const line of lines) {
      const match = line.match(/^#?([a-f\d]{6}|[a-f\d]{3})$/i);
      if (match) {
        const hex = match[1].length === 3
          ? '#' + match[1].split('').map(c => c + c).join('')
          : '#' + match[1].toLowerCase();
        const r = getContrastRatio(hex, bg);
        parsed.push({
          color: hex,
          ratio: Math.round(r * 100) / 100,
          aa: r >= 4.5,
          aaa: r >= 7,
          aaLarge: r >= 3,
          aaaLarge: r >= 4.5,
        });
      }
    }
    setResults(parsed);
    setAudited(true);
  };

  const copyResults = () => {
    if (!results.length) return;
    const text = results.map(r =>
      `${r.color} (${r.ratio}:1) AA:${r.aa ? 'pass' : 'fail'} AAA:${r.aaa ? 'pass' : 'fail'}`
    ).join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Contrast Auditor</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Foreground Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={fg}
              onChange={(e) => { setFg(e.target.value); setFgInput(e.target.value); }}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={fgInput}
              onChange={(e) => handleFgInput(e.target.value)}
              className="tb-v2-input flex-1"
              style={{ fontFamily: 'var(--f-mono)' }}
              placeholder="#000000"
            />
          </div>
        </div>
        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Background Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bg}
              onChange={(e) => { setBg(e.target.value); setBgInput(e.target.value); }}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={bgInput}
              onChange={(e) => handleBgInput(e.target.value)}
              className="tb-v2-input flex-1"
              style={{ fontFamily: 'var(--f-mono)' }}
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      <div className="p-6 rounded border" style={{ backgroundColor: bg, color: fg }}>
        <p className="text-lg">Sample Text (WCAG 2.1 Contrast Check)</p>
        <p className="text-sm mt-1">Smaller text for body copy</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className={`p-3 rounded ${aa ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="text-2xl font-bold">{ratio.toFixed(2)}:1</div>
          <div className="text-sm">Contrast Ratio</div>
        </div>
        <div className={`p-3 rounded ${aa ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="text-2xl font-bold">{aa ? 'Pass' : 'Fail'}</div>
          <div className="text-sm">AA Normal</div>
        </div>
        <div className={`p-3 rounded ${aaa ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="text-2xl font-bold">{aaa ? 'Pass' : 'Fail'}</div>
          <div className="text-sm">AAA Normal</div>
        </div>
        <div className={`p-3 rounded ${aaLarge ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="text-2xl font-bold">{aaLarge ? 'Pass' : 'Fail'}</div>
          <div className="text-sm">AA Large</div>
        </div>
      </div>

      <div className="tb-v2-section">
        <h3 className="tb-v2-section-title">Batch Audit</h3>
        <p style={{ fontSize: 13, color: 'var(--tb-text-secondary)', marginBottom: 8 }}>
          Enter colors (one per line) to check against the background color above:
        </p>
        <textarea
          value={auditText}
          onChange={(e) => setAuditText(e.target.value)}
          className="tb-v2-tool-textarea"
          style={{ height: 128, fontFamily: 'var(--f-mono)', marginBottom: 12 }}
          placeholder={'#ff0000\n#00ff00\n#0000ff'}
        />
        <button type="button" onClick={auditColors} className="tb-v2-btn tb-v2-btn-primary" style={{ marginBottom: 16 }}>
          Audit Colors
        </button>

        {!audited ? (
          <p className="tb-v2-empty">Enter colors above, then audit to check them against the background color.</p>
        ) : results.length === 0 ? (
          <p className="tb-v2-empty">No valid hex colors found. Enter one 3- or 6-digit hex color per line.</p>
        ) : (
          <div>
            <div className="tb-v2-tool-output-head">
              <span className="tb-v2-tool-label">{results.length} colors audited</span>
              <button
                type="button"
                onClick={copyResults}
                className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="flex flex-col gap-2" style={{ marginTop: 8 }}>
              {results.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: r.color }} />
                    <span className="font-mono text-sm">{r.color}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className={r.aa ? 'text-green-600' : 'text-red-600'}>AA {r.aa ? 'pass' : 'fail'}</span>
                    <span className={r.aaa ? 'text-green-600' : 'text-red-600'}>AAA {r.aaa ? 'pass' : 'fail'}</span>
                    <span className="font-medium">{r.ratio}:1</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
