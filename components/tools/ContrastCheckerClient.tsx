'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const DEFAULT_FG = '#000000';
const DEFAULT_BG = '#ffffff';
const EXAMPLE_FG = '#1a73e8';
const EXAMPLE_BG = '#ffffff';

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
}

function wcagLevel(ratio: number): { level: string; color: string; desc: string } {
  if (ratio >= 7) return { level: 'AAA', color: 'text-red-600 dark:text-red-400', desc: 'Excellent contrast for all text sizes' };
  if (ratio >= 4.5) return { level: 'AA', color: 'text-red-600 dark:text-red-400', desc: 'Good contrast for normal text' };
  if (ratio >= 3) return { level: 'AA Large', color: 'text-yellow-600 dark:text-yellow-400', desc: 'Acceptable for large text (18pt+)' };
  return { level: 'Fail', color: 'text-red-600 dark:text-red-400', desc: 'Insufficient contrast' };
}

export default function ContrastCheckerClient({ title = 'Contrast Checker' }: { title?: string }) {
  const [fg, setFg] = useState(DEFAULT_FG);
  const [bg, setBg] = useState(DEFAULT_BG);

  const fgRgb = parseHex(fg);
  const bgRgb = parseHex(bg);

  const ratio =
    fgRgb && bgRgb ? getContrastRatio(getLuminance(...fgRgb), getLuminance(...bgRgb)) : null;

  const result = ratio !== null ? wcagLevel(ratio) : null;
  const canClear = fg.toLowerCase() !== DEFAULT_FG || bg.toLowerCase() !== DEFAULT_BG;

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">{title}</span>
        <ToolExampleClearActions
          onExample={() => {
            setFg(EXAMPLE_FG);
            setBg(EXAMPLE_BG);
          }}
          onClear={() => {
            setFg(DEFAULT_FG);
            setBg(DEFAULT_BG);
          }}
          canClear={canClear}
        />
      </div>
      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' }}>
        <div className="tb-v2-grid-2">
          {[
            { label: 'Foreground (text)', value: fg, onChange: setFg, example: '#000000' },
            { label: 'Background', value: bg, onChange: setBg, example: '#ffffff' },
          ].map(({ label, value, onChange, example }) => (
            <div key={label}>
              <label className="tb-v2-tool-label" style={{ marginBottom: 6 }}>
                {label}
              </label>
              <div className="tb-v2-mode-tabs">
                <input
                  type="color"
                  value={/^#[a-f\d]{6}$/i.test(value) ? value : example}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <input
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={example}
                  className="tb-v2-select"
                />
              </div>
            </div>
          ))}
        </div>

        {ratio !== null && result && (
          <>
            <div
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center gap-2"
              style={{ backgroundColor: bg }}
            >
              <span className="text-2xl font-bold" style={{ color: fg }}>
                Sample Text
              </span>
              <span className="text-base" style={{ color: fg }}>
                The quick brown fox jumps over the lazy dog.
              </span>
            </div>
            <div className="tb-v2-grid-2">
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Contrast Ratio</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{ratio.toFixed(2)}:1</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">WCAG Level</div>
                <div className={`text-3xl font-bold ${result.color}`}>{result.level}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{result.desc}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
