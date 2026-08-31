'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Operator = 'add' | 'subtract' | 'multiply' | 'divide';

interface Fraction {
  num: number;
  den: number;
}

interface Calculation {
  result: Fraction;
  steps: string[];
}

const OPERATORS: Operator[] = ['add', 'subtract', 'multiply', 'divide'];

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function parseInteger(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

function simplify(numerator: number, denominator: number): Fraction {
  const sign = denominator < 0 ? -1 : 1;
  const num = numerator * sign;
  const den = Math.abs(denominator);
  if (num === 0) return { num: 0, den: 1 };
  const divisor = gcd(num, den);
  return { num: num / divisor, den: den / divisor };
}

function formatFraction(fraction: Fraction): string {
  return `${fraction.num}/${fraction.den}`;
}

function formatMixed(fraction: Fraction): string {
  if (fraction.num === 0) return '0';
  const sign = fraction.num < 0 ? '-' : '';
  const absoluteNumerator = Math.abs(fraction.num);
  if (absoluteNumerator < fraction.den) return formatFraction(fraction);

  const whole = Math.floor(absoluteNumerator / fraction.den);
  const remainder = absoluteNumerator % fraction.den;
  return remainder === 0
    ? `${sign}${whole}`
    : `${sign}${whole} ${remainder}/${fraction.den}`;
}

function formatDecimal(fraction: Fraction): string {
  return (fraction.num / fraction.den).toFixed(6).replace(/\.?0+$/, '');
}

function operatorSymbol(operator: Operator): string {
  return operator === 'add' ? '+' : operator === 'subtract' ? '-' : operator === 'multiply' ? '*' : '/';
}

function calculate(first: Fraction, second: Fraction, operator: Operator): Calculation | null {
  if (operator === 'divide' && second.num === 0) return null;

  const symbol = operatorSymbol(operator);
  const steps: string[] = [];
  let raw: Fraction;

  if (operator === 'add' || operator === 'subtract') {
    const commonDenominator = lcm(first.den, second.den);
    const firstNumerator = first.num * (commonDenominator / first.den);
    const secondNumerator = second.num * (commonDenominator / second.den);
    const rawNumerator = operator === 'add'
      ? firstNumerator + secondNumerator
      : firstNumerator - secondNumerator;
    raw = { num: rawNumerator, den: commonDenominator };
    steps.push(`Common denominator: ${commonDenominator}.`);
    steps.push(`${firstNumerator}/${commonDenominator} ${symbol} ${secondNumerator}/${commonDenominator} = ${formatFraction(raw)}.`);
  } else if (operator === 'multiply') {
    raw = { num: first.num * second.num, den: first.den * second.den };
    steps.push(`Multiply the numerators and denominators: ${first.num} * ${second.num} / (${first.den} * ${second.den}).`);
    steps.push(`Before simplifying: ${formatFraction(raw)}.`);
  } else {
    raw = { num: first.num * second.den, den: first.den * second.num };
    steps.push(`Multiply by the reciprocal: ${formatFraction(first)} * ${second.den}/${second.num}.`);
    steps.push(`Before simplifying: ${formatFraction(raw)}.`);
  }

  const result = simplify(raw.num, raw.den);
  if (result.num !== raw.num || result.den !== raw.den) {
    steps.push(`Simplify ${formatFraction(raw)} to ${formatFraction(result)}.`);
  }

  return { result, steps };
}

export default function FractionCalculatorClient() {
  const [num1, setNum1] = useState('');
  const [den1, setDen1] = useState('');
  const [num2, setNum2] = useState('');
  const [den2, setDen2] = useState('');
  const [operator, setOperator] = useState<Operator>('add');
  const [copied, setCopied] = useState(false);

  const firstNumerator = parseInteger(num1);
  const firstDenominator = parseInteger(den1);
  const secondNumerator = parseInteger(num2);
  const secondDenominator = parseInteger(den2);

  const error =
    (num1 || den1 || num2 || den2) &&
    (firstNumerator === null ||
      firstDenominator === null ||
      secondNumerator === null ||
      secondDenominator === null)
      ? 'Enter whole numbers for both fractions.'
      : firstDenominator === 0 || secondDenominator === 0
        ? 'Denominators cannot be zero.'
        : operator === 'divide' && secondNumerator === 0
          ? 'You cannot divide by zero.'
          : null;

  const calculation = useMemo(() => {
    if (
      firstNumerator === null ||
      firstDenominator === null ||
      secondNumerator === null ||
      secondDenominator === null ||
      firstDenominator === 0 ||
      secondDenominator === 0
    ) {
      return null;
    }

    return calculate(
      simplify(firstNumerator, firstDenominator),
      simplify(secondNumerator, secondDenominator),
      operator,
    );
  }, [firstDenominator, firstNumerator, operator, secondDenominator, secondNumerator]);

  const loadExample = () => {
    setNum1('1');
    setDen1('3');
    setNum2('1');
    setDen2('4');
    setOperator('add');
  };

  const clear = () => {
    setNum1('');
    setDen1('');
    setNum2('');
    setDen2('');
    setOperator('add');
    setCopied(false);
  };

  const copyResult = () => {
    if (!calculation) return;
    const { result } = calculation;
    navigator.clipboard
      .writeText(`${formatFraction(result)} (${formatDecimal(result)})`)
      .catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Fraction Calculator</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clear}
          canClear={Boolean(num1 || den1 || num2 || den2 || operator !== 'add')}
        />
      </div>

      <div style={{ padding: 20 }}>
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] gap-3 items-center">
          <div className="flex flex-col gap-2">
            <label className="tb-v2-tool-label" htmlFor="fraction-num-1">First fraction</label>
            <input
              id="fraction-num-1"
              type="number"
              step="1"
              value={num1}
              onChange={(event) => setNum1(event.target.value)}
              className="tb-v2-input text-center"
              placeholder="1"
              aria-label="First fraction numerator"
            />
            <div style={{ borderTop: '2px solid var(--line-2)' }} />
            <input
              type="number"
              step="1"
              value={den1}
              onChange={(event) => setDen1(event.target.value)}
              className="tb-v2-input text-center"
              placeholder="3"
              aria-label="First fraction denominator"
            />
          </div>

          <div className="tb-v2-mode-tabs sm:flex-col" role="group" aria-label="Fraction operation">
            {OPERATORS.map((op) => (
              <button
                type="button"
                key={op}
                onClick={() => setOperator(op)}
                className={`tb-v2-mode-tab ${operator === op ? 'on' : ''}`}
                aria-pressed={operator === op}
                aria-label={op}
              >
                {operatorSymbol(op)}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <label className="tb-v2-tool-label" htmlFor="fraction-num-2">Second fraction</label>
            <input
              id="fraction-num-2"
              type="number"
              step="1"
              value={num2}
              onChange={(event) => setNum2(event.target.value)}
              className="tb-v2-input text-center"
              placeholder="1"
              aria-label="Second fraction numerator"
            />
            <div style={{ borderTop: '2px solid var(--line-2)' }} />
            <input
              type="number"
              step="1"
              value={den2}
              onChange={(event) => setDen2(event.target.value)}
              className="tb-v2-input text-center"
              placeholder="4"
              aria-label="Second fraction denominator"
            />
          </div>

          <div className="text-2xl font-bold text-center" aria-hidden="true">=</div>

          <div className="flex flex-col gap-2" aria-label="Fraction result">
            <span className="tb-v2-tool-label">Result</span>
            <div className="tb-v2-input text-center" style={{ fontFamily: 'var(--f-mono)', minHeight: 44 }}>
              {calculation ? calculation.result.num : '-'}
            </div>
            <div style={{ borderTop: '2px solid var(--line-2)' }} />
            <div className="tb-v2-input text-center" style={{ fontFamily: 'var(--f-mono)', minHeight: 44 }}>
              {calculation ? calculation.result.den : '-'}
            </div>
          </div>
        </div>

        {error && <p className="tb-v2-error" role="alert" style={{ marginTop: 12 }}>{error}</p>}
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Solution</span>
        <button
          type="button"
          onClick={copyResult}
          disabled={!calculation}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {calculation ? (
          <div className="flex flex-col gap-4">
            <div className="tb-v2-stats-grid" style={{ padding: 0, borderTop: 0, background: 'transparent' }}>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{formatFraction(calculation.result)}</span>
                <span className="tb-v2-stat-pill-lbl">Simplified</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{formatDecimal(calculation.result)}</span>
                <span className="tb-v2-stat-pill-lbl">Decimal</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{formatMixed(calculation.result)}</span>
                <span className="tb-v2-stat-pill-lbl">Mixed number</span>
              </div>
            </div>
            <div>
              <span className="tb-v2-tool-label">Step by step</span>
              <ol style={{ marginTop: 8, paddingLeft: 20, color: 'var(--fg-1)', lineHeight: 1.7 }}>
                {calculation.steps.map((step, index) => <li key={index}>{step}</li>)}
              </ol>
            </div>
          </div>
        ) : (
          <p className="tb-v2-empty">Enter two fractions or use Example to solve one.</p>
        )}
      </div>
    </div>
  );
}
