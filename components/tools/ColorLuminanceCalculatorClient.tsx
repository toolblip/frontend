'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const DEFAULT_HEX = '#3498DB';
const EXAMPLE_HEX = '#F39C12';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

function luminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) =>
    c <= 10 ? c / 255 / 12.92 : Math.pow((c / 255 + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function wcagLevel(ratio: number): 'AAA' | 'AA' | 'Fail' {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'Fail';
}

function badgeClass(level: 'AAA' | 'AA' | 'Fail'): string {
  return level === 'AAA' ? 'tb-v2-cp-wcag-aaa' : level === 'AA' ? 'tb-v2-cp-wcag-aa' : 'tb-v2-cp-wcag-fail';
}

export default function ColorLuminanceCalculatorClient() {
  const [hex, setHex] = useState(DEFAULT_HEX);
  const [hexInput, setHexInput] = useState(DEFAULT_HEX);
  const [hexError, setHexError] = useState(false);

  const rgb = hexToRgb(hex) ?? { r: 52, g: 152, b: 219 };

  const lum = useMemo(() => luminance(rgb.r, rgb.g, rgb.b), [rgb.r, rgb.g, rgb.b]);
  const whiteRatio = useMemo(() => contrastRatio(lum, 1), [lum]);
  const blackRatio = useMemo(() => contrastRatio(lum, 0), [lum]);
  const whiteLevel = wcagLevel(whiteRatio);
  const blackLevel = wcagLevel(blackRatio);

  function setColorValue(val: string) {
    setHex(val);
    setHexInput(val.toUpperCase());
    setHexError(false);
  }

  function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    setColorValue(e.target.value);
  }

  function handleHexInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.trim();
    setHexInput(val);
    if (isValidHex(val)) {
      setHex(val.startsWith('#') ? val : `#${val}`);
      setHexError(false);
    } else {
      setHexError(true);
    }
  }

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Color Luminance Calculator</span>
        <ToolExampleClearActions
          onExample={() => setColorValue(EXAMPLE_HEX)}
          onClear={() => setColorValue(DEFAULT_HEX)}
          canClear={hex.toUpperCase() !== DEFAULT_HEX}
        />
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>
            Enter Color (HEX)
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={isValidHex(hex) ? (hex.startsWith('#') ? hex : `#${hex}`) : '#000000'}
              onChange={handleColorChange}
              className="cursor-pointer rounded border"
              style={{ width: 48, height: 40 }}
              aria-label="Pick a color"
            />
            <input
              type="text"
              value={hexInput}
              onChange={handleHexInputChange}
              onBlur={() => {
                if (!isValidHex(hexInput)) {
                  setHexInput(hex);
                  setHexError(false);
                }
              }}
              className="tb-v2-input flex-1 uppercase"
              style={{ fontFamily: 'var(--f-mono)' }}
              placeholder="#3498DB"
              maxLength={7}
              spellCheck={false}
            />
          </div>
          {hexError && (
            <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>
              Enter a valid 6-digit hex color (e.g., #3366FF).
            </p>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div
            className="w-24 h-24 rounded-xl shadow-lg border"
            style={{ backgroundColor: hex }}
            aria-label={`Color preview: ${hex}`}
          />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Relative Luminance</span>
              <span className="font-mono font-bold">{lum.toFixed(6)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Luminance %</span>
              <span className="font-mono font-bold">{(lum * 100).toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div>
          <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>
            Contrast Ratio
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="tb-v2-cp-wcag-card" style={{ width: 'auto' }}>
              <p className="tb-v2-cp-wcag-title">Contrast with white (#FFFFFF)</p>
              <div className="tb-v2-cp-wcag-row">
                <div className="tb-v2-cp-wcag-swatch" style={{ background: '#fff', color: hex }}>
                  Aa
                </div>
                <div className="tb-v2-cp-wcag-info">
                  <span className="font-mono font-bold">{whiteRatio.toFixed(2)}:1</span>
                  <span className={`tb-v2-cp-wcag-badge ${badgeClass(whiteLevel)}`}>{whiteLevel}</span>
                </div>
              </div>
            </div>

            <div className="tb-v2-cp-wcag-card" style={{ width: 'auto' }}>
              <p className="tb-v2-cp-wcag-title">Contrast with black (#000000)</p>
              <div className="tb-v2-cp-wcag-row">
                <div className="tb-v2-cp-wcag-swatch" style={{ background: '#000', color: hex }}>
                  Aa
                </div>
                <div className="tb-v2-cp-wcag-info">
                  <span className="font-mono font-bold">{blackRatio.toFixed(2)}:1</span>
                  <span className={`tb-v2-cp-wcag-badge ${badgeClass(blackLevel)}`}>{blackLevel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>
            Formula Used
          </div>
          <div className="text-sm" style={{ padding: 12, background: 'var(--surface-2, #f5f5f5)', borderRadius: 8 }}>
            <p className="font-mono mb-2">
              L = 0.2126 × R<sub>s</sub> + 0.7152 × G<sub>s</sub> + 0.0722 × B<sub>s</sub>
            </p>
            <p className="text-gray-600 text-xs" style={{ margin: 0 }}>
              Where R<sub>s</sub>, G<sub>s</sub>, B<sub>s</sub> are linearized sRGB channels. Contrast ratio =
              (L1 + 0.05) / (L2 + 0.05). WCAG AA ≥ 4.5:1, AAA ≥ 7:1.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
