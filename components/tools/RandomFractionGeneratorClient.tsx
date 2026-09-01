'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type GenerationMode = 'fraction' | 'decimal' | 'mixed';

interface Fraction {
  numerator: number;
  denominator: number;
}

interface Result {
  display: string;
  decimal: string | null;
}

const DEFAULT_COUNT = '5';
const DEFAULT_MIN = '0';
const DEFAULT_MAX = '1';

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function simplify(numerator: number, denominator: number): Fraction {
  const divisor = gcd(numerator, denominator);
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

function parseRangeValue(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const mixed = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const denominator = Number(mixed[3]);
    if (denominator === 0) return null;
    return Number(mixed[1]) + Number(mixed[2]) / denominator;
  }

  const fraction = trimmed.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (fraction) {
    const denominator = Number(fraction[2]);
    if (denominator === 0) return null;
    return Number(fraction[1]) / denominator;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatDecimal(value: number): string {
  return value.toFixed(6).replace(/\.?0+$/, '');
}

function formatFraction(fraction: Fraction): string {
  return `${fraction.numerator}/${fraction.denominator}`;
}

function formatMixed(fraction: Fraction): string {
  if (fraction.numerator === 0) return '0';
  if (fraction.numerator < fraction.denominator) return formatFraction(fraction);

  const whole = Math.floor(fraction.numerator / fraction.denominator);
  const remainder = fraction.numerator % fraction.denominator;
  return remainder === 0
    ? String(whole)
    : `${whole} ${remainder}/${fraction.denominator}`;
}

function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFractionInRange(min: number, max: number): Fraction {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const denominator = randomInteger(2, 100);
    const numeratorMin = Math.ceil(min * denominator);
    const numeratorMax = Math.floor(max * denominator);
    if (numeratorMin <= numeratorMax) {
      return simplify(randomInteger(numeratorMin, numeratorMax), denominator);
    }
  }

  for (let denominator = 2; denominator <= 1000; denominator += 1) {
    const numeratorMin = Math.ceil(min * denominator);
    const numeratorMax = Math.floor(max * denominator);
    if (numeratorMin <= numeratorMax) {
      return simplify(randomInteger(numeratorMin, numeratorMax), denominator);
    }
  }

  const target = min + Math.random() * (max - min);
  return simplify(Math.max(0, Math.round(target * 1000)), 1000);
}

function createResults(mode: GenerationMode, min: number, max: number, count: number): Result[] {
  return Array.from({ length: count }, () => {
    if (mode === 'decimal') {
      const value = Number((min + Math.random() * (max - min)).toFixed(4));
      return { display: formatDecimal(value), decimal: null };
    }

    const fraction = randomFractionInRange(min, max);
    return {
      display: mode === 'mixed' ? formatMixed(fraction) : formatFraction(fraction),
      decimal: formatDecimal(fraction.numerator / fraction.denominator),
    };
  });
}

export default function RandomFractionGeneratorClient() {
  const [mode, setMode] = useState<GenerationMode>('fraction');
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [minValue, setMinValue] = useState(DEFAULT_MIN);
  const [maxValue, setMaxValue] = useState(DEFAULT_MAX);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const parsedCount = Number(count);
    const min = parseRangeValue(minValue);
    const max = parseRangeValue(maxValue);

    if (!Number.isInteger(parsedCount) || parsedCount < 1 || parsedCount > 100) {
      setError('Enter a number of results from 1 to 100.');
      setResults([]);
      return;
    }
    if (min === null || max === null || min < 0 || max <= min) {
      setError('Enter a non-negative minimum and a larger maximum. Fractions like 1/2 are supported.');
      setResults([]);
      return;
    }

    setError('');
    setResults(createResults(mode, min, max, parsedCount));
  };

  const loadExample = () => {
    const exampleMode: GenerationMode = 'fraction';
    const exampleMin = '1/2';
    const exampleMax = '5/6';
    setMode(exampleMode);
    setCount('10');
    setMinValue(exampleMin);
    setMaxValue(exampleMax);
    setError('');
    setCopied(false);
    setResults(createResults(exampleMode, 0.5, 5 / 6, 10));
  };

  const clear = () => {
    setMode('fraction');
    setCount(DEFAULT_COUNT);
    setMinValue(DEFAULT_MIN);
    setMaxValue(DEFAULT_MAX);
    setResults([]);
    setError('');
    setCopied(false);
  };

  const copy = () => {
    if (results.length === 0) return;
    navigator.clipboard
      .writeText(results.map((result) => result.decimal === null ? result.display : `${result.display} = ${result.decimal}`).join('\n'))
      .catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const canClear = Boolean(
    results.length ||
      error ||
      mode !== 'fraction' ||
      count !== DEFAULT_COUNT ||
      minValue !== DEFAULT_MIN ||
      maxValue !== DEFAULT_MAX,
  );

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Random Fraction Generator</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clear}
          canClear={canClear}
        />
      </div>

      <div style={{ padding: 20 }}>
        <div className="tb-v2-mode-tabs" role="group" aria-label="Generation type">
          <button type="button" onClick={() => setMode('fraction')} className={`tb-v2-mode-tab ${mode === 'fraction' ? 'on' : ''}`} aria-pressed={mode === 'fraction'}>
            Fractions
          </button>
          <button type="button" onClick={() => setMode('decimal')} className={`tb-v2-mode-tab ${mode === 'decimal' ? 'on' : ''}`} aria-pressed={mode === 'decimal'}>
            Decimals
          </button>
          <button type="button" onClick={() => setMode('mixed')} className={`tb-v2-mode-tab ${mode === 'mixed' ? 'on' : ''}`} aria-pressed={mode === 'mixed'}>
            Mixed numbers
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginTop: 16 }}>
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="random-fraction-count">How many?</label>
            <input id="random-fraction-count" type="number" min="1" max="100" value={count} onChange={(event) => setCount(event.target.value)} className="tb-v2-input" aria-label="Number of results" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="random-fraction-min">Minimum</label>
            <input id="random-fraction-min" type="text" value={minValue} onChange={(event) => setMinValue(event.target.value)} className="tb-v2-input" placeholder="0 or 1/2" aria-label="Minimum value" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="random-fraction-max">Maximum</label>
            <input id="random-fraction-max" type="text" value={maxValue} onChange={(event) => setMaxValue(event.target.value)} className="tb-v2-input" placeholder="1 or 5/6" aria-label="Maximum value" />
          </div>
        </div>
        <p className="text-xs" style={{ color: 'var(--fg-2)', marginTop: 8 }}>
          Use decimals or fractions such as 1/2 and 5/6 for the range.
        </p>
        <button type="button" onClick={generate} className="tb-v2-btn tb-v2-btn-primary" style={{ marginTop: 16 }}>
          Generate
        </button>
        {error && <p className="tb-v2-error" role="alert" style={{ marginTop: 12 }}>{error}</p>}
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Generated values</span>
        <button type="button" onClick={copy} disabled={results.length === 0} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {results.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {results.map((result, index) => (
              <div key={`${result.display}-${index}`} style={{ display: 'flex', gap: 12, fontSize: 14, fontFamily: 'var(--f-mono)' }}>
                <span style={{ minWidth: 80 }}>{result.display}</span>
                {result.decimal !== null && (
                  <>
                    <span style={{ color: 'var(--fg-2)' }}>=</span>
                    <span>{result.decimal}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="tb-v2-empty">Choose a range or use Example to generate values.</p>
        )}
      </div>
    </div>
  );
}
