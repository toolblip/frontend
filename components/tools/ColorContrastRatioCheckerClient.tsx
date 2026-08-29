'use client';

import { useEffect, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const DEFAULT_FG = '#000000';
const DEFAULT_BG = '#ffffff';
const EXAMPLE_FG = '#222222';
const EXAMPLE_BG = '#f5f5f5';

function getLuminance(hex: string): number {
  const rgb = parseInt(hex.replace('#', ''), 16);
  const r = ((rgb >> 16) & 255) / 255;
  const g = ((rgb >> 8) & 255) / 255;
  const b = (rgb & 255) / 255;
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

export default function ColorContrastRatioCheckerClient() {
  const [fg, setFg] = useState(DEFAULT_FG);
  const [fgInput, setFgInput] = useState(DEFAULT_FG);
  const [bg, setBg] = useState(DEFAULT_BG);
  const [bgInput, setBgInput] = useState(DEFAULT_BG);
  const [ratio, setRatio] = useState(21);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setRatio(Math.round(getContrastRatio(fg, bg) * 100) / 100);
  }, [fg, bg]);

  const handleFgInput = (value: string) => {
    setFgInput(value);
    if (isValidHex(value)) setFg(value.startsWith('#') ? value : `#${value}`);
  };

  const handleBgInput = (value: string) => {
    setBgInput(value);
    if (isValidHex(value)) setBg(value.startsWith('#') ? value : `#${value}`);
  };

  const setPair = (nextFg: string, nextBg: string) => {
    setFg(nextFg);
    setFgInput(nextFg);
    setBg(nextBg);
    setBgInput(nextBg);
  };

  const canClear =
    fg.toLowerCase() !== DEFAULT_FG || bg.toLowerCase() !== DEFAULT_BG;

  const copyRatio = () => {
    navigator.clipboard.writeText(`${ratio}:1`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Color Contrast Ratio Checker</span>
        <ToolExampleClearActions
          onExample={() => setPair(EXAMPLE_FG, EXAMPLE_BG)}
          onClear={() => setPair(DEFAULT_FG, DEFAULT_BG)}
          canClear={canClear}
        />
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>
              Foreground
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fg}
                onChange={(e) => {
                  setFg(e.target.value);
                  setFgInput(e.target.value);
                }}
                style={{
                  height: 40,
                  width: 48,
                  cursor: 'pointer',
                  borderRadius: 6,
                  border: '1px solid var(--tb-border)',
                }}
              />
              <input
                type="text"
                value={fgInput}
                onChange={(e) => handleFgInput(e.target.value)}
                className="tb-v2-input flex-1"
                style={{ fontFamily: 'var(--f-mono)' }}
              />
            </div>
          </div>
          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>
              Background
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bg}
                onChange={(e) => {
                  setBg(e.target.value);
                  setBgInput(e.target.value);
                }}
                style={{
                  height: 40,
                  width: 48,
                  cursor: 'pointer',
                  borderRadius: 6,
                  border: '1px solid var(--tb-border)',
                }}
              />
              <input
                type="text"
                value={bgInput}
                onChange={(e) => handleBgInput(e.target.value)}
                className="tb-v2-input flex-1"
                style={{ fontFamily: 'var(--f-mono)' }}
              />
            </div>
          </div>
        </div>

        <div
          className="p-8 rounded-lg text-center text-3xl font-bold"
          style={{ backgroundColor: bg, color: fg }}
        >
          Sample Text Preview
        </div>

        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{ratio}:1</div>
          <button type="button" onClick={copyRatio} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy ratio'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
          {(
            [
              { label: 'AA Normal Text', pass: ratio >= 4.5, req: '4.5:1' },
              { label: 'AA Large Text', pass: ratio >= 3, req: '3:1' },
              { label: 'AAA Normal Text', pass: ratio >= 7, req: '7:1' },
            ] as const
          ).map(({ label, pass, req }) => (
            <div
              key={label}
              className={`p-4 rounded border ${pass ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
            >
              <div className="text-xl font-bold">{pass ? 'PASS' : 'FAIL'}</div>
              <div className="text-sm">{label}</div>
              <div className="text-xs text-gray-500">Min: {req}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
