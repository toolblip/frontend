'use client';

import React, { useState } from 'react';

interface ContrastResult {
  color: string;
  ratio: number;
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
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

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export default function ColorContrastAuditorClient() {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [results, setResults] = useState<ContrastResult[]>([]);
  const [auditText, setAuditText] = useState('');

  const ratio = getContrastRatio(fg, bg);
  const aa = ratio >= 4.5;
  const aaa = ratio >= 7;
  const aaLarge = ratio >= 3;
  const aaaLarge = ratio >= 4.5;

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
  };

  const copyResults = () => {
    const text = results.map(r =>
      `${r.color} (${r.ratio}:1) AA:${r.aa ? '✓' : '✗'} AAA:${r.aaa ? '✓' : '✗'}`
    ).join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Color Contrast Auditor</h1>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Foreground Color</label>
          <div className="tb-v2-mode-tabs">
            <input
              type="color"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="flex-1 p-2 border rounded font-mono"
              placeholder="#000000"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Background Color</label>
          <div className="tb-v2-mode-tabs">
            <input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="flex-1 p-2 border rounded font-mono"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 p-6 rounded border" style={{ backgroundColor: bg, color: fg }}>
        <p className="text-lg">Sample Text (WCAG 2.1 Contrast Check)</p>
        <p className="text-sm mt-1">Smaller text for body copy</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
        <div className={`p-3 rounded ${aa ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="text-2xl font-bold">{ratio.toFixed(2)}:1</div>
          <div className="text-sm">Contrast Ratio</div>
        </div>
        <div className={`p-3 rounded ${aa ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="text-2xl font-bold">{aa ? '✓' : '✗'}</div>
          <div className="text-sm">AA Normal</div>
        </div>
        <div className={`p-3 rounded ${aaa ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="text-2xl font-bold">{aaa ? '✓' : '✗'}</div>
          <div className="text-sm">AAA Normal</div>
        </div>
        <div className={`p-3 rounded ${aaLarge ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="text-2xl font-bold">{aaLarge ? '✓' : '✗'}</div>
          <div className="text-sm">AA Large</div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-3">Batch Audit</h2>
        <p className="text-sm text-gray-600 mb-2">Enter colors (one per line) to check against background:</p>
        <textarea
          value={auditText}
          onChange={(e) => setAuditText(e.target.value)}
          className="w-full h-32 p-3 border rounded font-mono text-sm mb-3"
          placeholder="#ff0000&#10;#00ff00&#10;#0000ff"
        />
        <button onClick={auditColors} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4">
          Audit Colors
        </button>

        {results.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{results.length} colors audited</span>
              <button onClick={copyResults} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
                Copy
              </button>
            </div>
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: r.color }} />
                    <span className="font-mono text-sm">{r.color}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className={r.aa ? 'text-green-600' : 'text-red-600'}>AA {r.aa ? '✓' : '✗'}</span>
                    <span className={r.aaa ? 'text-green-600' : 'text-red-600'}>AAA {r.aaa ? '✓' : '✗'}</span>
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
