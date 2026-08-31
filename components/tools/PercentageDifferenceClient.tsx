'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Mode = 'average' | 'directional';

interface DifferenceResult {
  difference: number;
  percentage: number;
  average: number;
  direction: string;
}

function parseFinite(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatNumber(value: number, maximumFractionDigits = 2): string {
  return value.toLocaleString('en-US', { maximumFractionDigits });
}

export default function PercentageDifferenceClient() {
  const [mode, setMode] = useState<Mode>('average');
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');

  const first = parseFinite(val1);
  const second = parseFinite(val2);

  const result = useMemo<DifferenceResult | null>(() => {
    if (first === null || second === null) return null;

    const difference = second - first;
    const average = (Math.abs(first) + Math.abs(second)) / 2;
    const percentage = mode === 'average'
      ? average === 0 ? 0 : (Math.abs(difference) / average) * 100
      : first === 0 ? 0 : (difference / Math.abs(first)) * 100;
    const direction = difference > 0
      ? 'Value 2 is higher'
      : difference < 0
        ? 'Value 2 is lower'
        : 'The values are equal';

    return { difference, percentage, average, direction };
  }, [first, mode, second]);

  const error = val1.trim() && val2.trim() && (first === null || second === null)
    ? 'Enter two valid numbers.'
    : mode === 'directional' && first === 0 && second !== null
      ? 'Directional change needs a non-zero Value 1.'
      : null;

  const loadExample = () => {
    setMode('average');
    setVal1('45');
    setVal2('52');
  };

  const clear = () => {
    setMode('average');
    setVal1('');
    setVal2('');
  };

  const canClear = Boolean(val1 || val2 || mode !== 'average');

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Percentage Difference</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clear}
          canClear={canClear}
        />
      </div>

      <div style={{ padding: 20 }}>
        <div className="tb-v2-mode-tabs" role="group" aria-label="Percentage comparison mode">
          <button
            type="button"
            onClick={() => setMode('average')}
            className={`tb-v2-mode-tab ${mode === 'average' ? 'on' : ''}`}
            aria-pressed={mode === 'average'}
          >
            Average-based difference
          </button>
          <button
            type="button"
            onClick={() => setMode('directional')}
            className={`tb-v2-mode-tab ${mode === 'directional' ? 'on' : ''}`}
            aria-pressed={mode === 'directional'}
          >
            Directional change
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 16 }}>
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="percentage-difference-value-1">Value 1</label>
            <input
              id="percentage-difference-value-1"
              type="number"
              value={val1}
              onChange={(event) => setVal1(event.target.value)}
              className="tb-v2-input"
              placeholder="45"
              aria-label="Value 1"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="percentage-difference-value-2">Value 2</label>
            <input
              id="percentage-difference-value-2"
              type="number"
              value={val2}
              onChange={(event) => setVal2(event.target.value)}
              className="tb-v2-input"
              placeholder="52"
              aria-label="Value 2"
            />
          </div>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error" role="alert">{error}</p>
        ) : result ? (
          <div className="flex flex-col gap-4">
            <div className="tb-v2-stats-grid" style={{ padding: 0, borderTop: 0, background: 'transparent' }}>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">
                  {mode === 'directional' && result.percentage > 0 ? '+' : ''}{formatNumber(result.percentage)}%
                </span>
                <span className="tb-v2-stat-pill-lbl">{mode === 'average' ? 'Difference' : 'Change'}</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{formatNumber(Math.abs(result.difference), 4)}</span>
                <span className="tb-v2-stat-pill-lbl">Absolute difference</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{formatNumber(result.average)}</span>
                <span className="tb-v2-stat-pill-lbl">Average baseline</span>
              </div>
            </div>
            <p className="text-sm" style={{ color: 'var(--fg-2)' }}>
              {mode === 'average'
                ? 'This symmetric result treats both values as peers.'
                : result.direction}
            </p>
          </div>
        ) : (
          <p className="tb-v2-empty">Enter two values or use Example to compare them.</p>
        )}
      </div>
    </div>
  );
}
