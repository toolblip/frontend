'use client';

import { useState, useCallback } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const DEFAULT_HEX = '#EF4444';
const EXAMPLE_HEX = '#0EA5E9';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
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
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function luminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => c <= 10 ? c / 255 / 12.92 : Math.pow((c / 255 + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function wcagLevel(r: number, g: number, b: number): { bg: string; fg: string; level: string } {
  const L1 = luminance(r, g, b) + 0.05;
  const L2 = 1;
  const ratio = L1 > L2 ? L1 / L2 : L2 / L1;
  const bg = '#ffffff';
  const fg = ratio >= 7 ? '#18181b' : '#ffffff';
  const level = ratio >= 4.5 ? (ratio >= 7 ? 'AAA' : 'AA') : 'Fail';
  return { bg, fg, level };
}

export default function ColorPickerClient() {
  const [hex, setHex] = useState(DEFAULT_HEX);
  const [hexInput, setHexInput] = useState(DEFAULT_HEX);
  const [hexError, setHexError] = useState(false);
  const [copied, setCopied] = useState('');

  const rgb = hexToRgb(hex) ?? { r: 239, g: 68, b: 68 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const wcag = wcagLevel(rgb.r, rgb.g, rgb.b);

  const copy = useCallback((label: string, val: string) => {
    navigator.clipboard.writeText(val).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  }, []);

  function applyHex(val: string) {
    setHex(val);
    setHexInput(val);
    setHexError(false);
  }

  function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    applyHex(e.target.value);
  }

  function handleHexInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.trim();
    setHexInput(val);
    if (/^#?[a-f\d]{6}$/i.test(val)) {
      setHex(val.startsWith('#') ? val : '#' + val);
      setHexError(false);
    } else {
      setHexError(true);
    }
  }

  const formats = [
    { label: 'HEX', value: hex.toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'Hex 3', value: hex.length === 7 ? '#' + hex[1] + hex[3] + hex[5] : hex.toUpperCase() },
  ];

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Color Picker</span>
        <ToolExampleClearActions
          onExample={() => applyHex(EXAMPLE_HEX)}
          onClear={() => applyHex(DEFAULT_HEX)}
          canClear={hex.toUpperCase() !== DEFAULT_HEX.toUpperCase()}
        />
      </div>

      <div className="tb-v2-cp-root">
        <div className="tb-v2-cp-input-row">
          <div className="tb-v2-cp-swatch-wrap">
            <input
              type="color"
              value={hex}
              onChange={handleColorChange}
              className="tb-v2-cp-color-input"
              aria-label="Pick a color"
            />
          </div>
          <input
            type="text"
            value={hexInput}
            onChange={handleHexInputChange}
            onBlur={() => {
              if (!/^#?[a-f\d]{6}$/i.test(hexInput)) {
                setHexInput(hex);
                setHexError(false);
              }
            }}
            className="tb-v2-cp-hex-input"
            aria-label="HEX color value"
            maxLength={7}
            spellCheck={false}
          />
        </div>
        {hexError && (
          <p style={{ fontSize: 12, color: '#ef4444' }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>
        )}

        <div className="tb-v2-cp-grid">
          {formats.map(({ label, value }) => (
            <div key={label} className="tb-v2-cp-card">
              <span className="tb-v2-cp-card-label">{label}</span>
              <span className="tb-v2-cp-card-value">{value}</span>
              <button
                type="button"
                className="tb-v2-cp-copy"
                onClick={() => copy(label, value)}
                aria-label={`Copy ${label}`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {copied === label ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>

        <div className="tb-v2-cp-preview-section">
          <div className="tb-v2-cp-preview" style={{ background: hex }} aria-label={`Color preview: ${hex}`}>
            <span className="tb-v2-cp-preview-text" style={{ color: hsl.l < 55 ? '#ffffff' : '#18181b' }}>
              Aa
            </span>
          </div>
          <div className="tb-v2-cp-wcag-card">
            <p className="tb-v2-cp-wcag-title">Contrast with white</p>
            <div className="tb-v2-cp-wcag-row">
              <div className="tb-v2-cp-wcag-swatch" style={{ background: '#fff', color: '#18181b' }}>
                Aa
              </div>
              <div className="tb-v2-cp-wcag-info">
                <span
                  className={`tb-v2-cp-wcag-badge ${
                    wcag.level === 'AAA' ? 'tb-v2-cp-wcag-aaa' : wcag.level === 'AA' ? 'tb-v2-cp-wcag-aa' : 'tb-v2-cp-wcag-fail'
                  }`}
                >
                  {wcag.level}
                </span>
                <span className="tb-v2-cp-wcag-hint">
                  {wcag.level === 'AAA'
                    ? 'Excellent - ideal for all text sizes'
                    : wcag.level === 'AA'
                      ? 'Good - suitable for body text'
                      : 'Poor - not enough contrast for readable text'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
