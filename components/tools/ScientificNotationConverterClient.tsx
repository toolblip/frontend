'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Mode = 'toScientific' | 'toDecimal';

interface DecToSciResult {
  mantissa: number;
  exponent: number;
  scientific: string;
  steps: string[];
}

function decimalToScientific(n: number): DecToSciResult {
  const scientific = n.toExponential();
  const [mantissaStr, expStr] = scientific.split('e');
  const mantissa = Number(mantissaStr);
  const exponent = Number(expStr);

  const steps: string[] = [];
  const abs = Math.abs(n);
  steps.push(`Start with ${n}.`);
  if (n === 0) {
    steps.push('Zero is represented as 0 × 10^0.');
  } else if (abs >= 1) {
    steps.push(`Move the decimal point left until exactly one non-zero digit remains before it: ${mantissaStr}.`);
    steps.push(`Counting the places moved gives an exponent of +${exponent}.`);
  } else {
    steps.push(`Move the decimal point right until exactly one non-zero digit remains before it: ${mantissaStr}.`);
    steps.push(`Counting the places moved gives an exponent of ${exponent}.`);
  }
  steps.push(`Result: ${mantissaStr} × 10^${exponent}`);

  return { mantissa, exponent, scientific: `${mantissaStr} × 10^${exponent}`, steps };
}

interface SciToDecResult {
  mantissa: number;
  exponent: number;
  decimal: string;
  steps: string[];
}

function parseDecimal(input: string): number | null {
  const trimmed = input.trim();
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(trimmed)) return null;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

function parseScientific(input: string): { mantissa: number; exponent: number } | null {
  const trimmed = input.trim();

  // e/E notation: 1.23e5, -1.23E-5
  const eMatch = trimmed.match(/^([+-]?\d*\.?\d+)\s*[eE]\s*([+-]?\d+)$/);
  if (eMatch) {
    const mantissa = Number(eMatch[1]);
    const exponent = Number(eMatch[2]);
    return Number.isFinite(mantissa) && Number.isFinite(exponent) ? { mantissa, exponent } : null;
  }

  // × 10^ notation: 1.23 × 10^5, 1.23 x 10^-5, 1.23*10^5
  const timesMatch = trimmed.match(/^([+-]?\d*\.?\d+)\s*[×x*]\s*10\s*\^?\s*([+-]?\d+)$/i);
  if (timesMatch) {
    const mantissa = Number(timesMatch[1]);
    const exponent = Number(timesMatch[2]);
    return Number.isFinite(mantissa) && Number.isFinite(exponent) ? { mantissa, exponent } : null;
  }

  return null;
}

function formatDecimal(value: number): string {
  return value.toLocaleString('en-US', {
    maximumFractionDigits: 20,
    notation: 'standard',
    useGrouping: false,
  });
}

function scientificToDecimal(mantissa: number, exponent: number): SciToDecResult | null {
  const decimalValue = mantissa * Math.pow(10, exponent);
  if (!Number.isFinite(decimalValue)) return null;
  const steps: string[] = [
    `Start with ${mantissa} × 10^${exponent}.`,
    exponent >= 0
      ? `Move the decimal point right ${exponent} place(s).`
      : `Move the decimal point left ${Math.abs(exponent)} place(s).`,
    `Result: ${formatDecimal(decimalValue)}`,
  ];
  return { mantissa, exponent, decimal: formatDecimal(decimalValue), steps };
}

export default function ScientificNotationConverterClient() {
  const [mode, setMode] = useState<Mode>('toScientific');
  const [input, setInput] = useState('');

  const decResult = useMemo(() => {
    if (mode !== 'toScientific' || !input.trim()) return null;
    const n = parseDecimal(input);
    if (n === null) return null;
    return decimalToScientific(n);
  }, [mode, input]);

  const decError = mode === 'toScientific' && input.trim() && !decResult
    ? 'Enter a valid decimal number, e.g. 12345 or -0.00042'
    : null;

  const sciResult = useMemo(() => {
    if (mode !== 'toDecimal' || !input.trim()) return null;
    const parsed = parseScientific(input);
    if (!parsed) return null;
    return scientificToDecimal(parsed.mantissa, parsed.exponent);
  }, [mode, input]);

  const sciError = mode === 'toDecimal' && input.trim() && !sciResult
    ? 'Enter a value like 1.23e5, 1.23E-5, or 1.23 × 10^5'
    : null;

  const loadExample = () => setInput(mode === 'toScientific' ? '0.0000000000667' : '4.5 × 10^7');

  const clear = () => setInput('');

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Scientific Notation</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clear}
          canClear={Boolean(input.trim())}
        />
      </div>

      <div style={{ padding: '16px 20px 0' }}>
        <div className="tb-v2-mode-tabs" role="group" aria-label="Conversion mode">
          <button type="button" onClick={() => setMode('toScientific')} className={`tb-v2-mode-tab ${mode === 'toScientific' ? 'on' : ''}`} aria-pressed={mode === 'toScientific'}>Decimal to scientific</button>
          <button type="button" onClick={() => setMode('toDecimal')} className={`tb-v2-mode-tab ${mode === 'toDecimal' ? 'on' : ''}`} aria-pressed={mode === 'toDecimal'}>Scientific to decimal</button>
        </div>
      </div>
      <div style={{ padding: '12px 20px 20px' }}>
        <label className="tb-v2-tool-label" htmlFor="scientific-notation-input">
          {mode === 'toScientific' ? 'Decimal number' : 'Scientific notation'}
        </label>
        <input
          id="scientific-notation-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'toScientific' ? 'e.g. 12345 or -0.00042' : 'e.g. 1.23e5 or 1.23 × 10^5'}
          className="tb-v2-input"
          style={{ fontFamily: 'var(--f-mono)', marginTop: 6 }}
          aria-label={mode === 'toScientific' ? 'Decimal number' : 'Scientific notation'}
        />
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {mode === 'toScientific' ? (
          decError ? (
            <p className="tb-v2-error">{decError}</p>
          ) : !decResult ? (
            <p className="tb-v2-empty">Enter a decimal number above to convert it to scientific notation.</p>
          ) : (
            <div>
              <pre className="tb-v2-tool-pre">{decResult.scientific}</pre>
              <div style={{ marginTop: 12 }}>
                <span className="tb-v2-tool-label">Step by Step</span>
                <ol style={{ marginTop: 8, paddingLeft: 20, fontSize: 13.5, color: 'var(--fg-1)', lineHeight: 1.7 }}>
                  {decResult.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )
        ) : sciError ? (
          <p className="tb-v2-error">{sciError}</p>
        ) : !sciResult ? (
          <p className="tb-v2-empty">Enter a value in scientific notation above to convert it to decimal.</p>
        ) : (
          <div>
            <pre className="tb-v2-tool-pre">{sciResult.decimal}</pre>
            <div style={{ marginTop: 12 }}>
              <span className="tb-v2-tool-label">Step by Step</span>
              <ol style={{ marginTop: 8, paddingLeft: 20, fontSize: 13.5, color: 'var(--fg-1)', lineHeight: 1.7 }}>
                {sciResult.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
