'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_BILL = '180';
const EXAMPLE_TIP = '20';
const EXAMPLE_PEOPLE = '5';

const TIP_PRESETS = [10, 15, 18, 20, 25];

function parseFinite(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export default function TipCalculatorClient() {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState('18');
  const [people, setPeople] = useState('1');
  const [copied, setCopied] = useState(false);

  const bill = parseFinite(billAmount);
  const tip = parseFinite(tipPercent);
  const count = parseFinite(people);

  const result = useMemo(() => {
    if (
      bill === null ||
      bill <= 0 ||
      tip === null ||
      tip < 0 ||
      tip > 100 ||
      count === null ||
      !Number.isInteger(count) ||
      count < 1
    ) {
      return null;
    }

    const tipAmount = bill * (tip / 100);
    const total = bill + tipAmount;
    return { tipAmount, total, perPerson: total / count };
  }, [bill, count, tip]);

  const hasAttemptedCalculation = Boolean(billAmount.trim() || tipPercent !== '18' || people !== '1');
  const hasInvalidInput = hasAttemptedCalculation && (
    bill === null ||
    bill <= 0 ||
    tip === null ||
    tip < 0 ||
    tip > 100 ||
    count === null ||
    !Number.isInteger(count) ||
    count < 1
  );

  const loadExample = () => {
    setBillAmount(EXAMPLE_BILL);
    setTipPercent(EXAMPLE_TIP);
    setPeople(EXAMPLE_PEOPLE);
  };

  const clear = () => {
    setBillAmount('');
    setTipPercent('18');
    setPeople('1');
    setCopied(false);
  };

  const adjustPeople = (delta: number) => {
    const current = count !== null && Number.isInteger(count) ? count : 1;
    setPeople(String(Math.max(1, Math.min(1000, current + delta))));
  };

  const copyResult = () => {
    if (!result || bill === null || tip === null || count === null) return;
    const text = [
      `Bill: ${formatCurrency(bill)}`,
      `Tip (${tip}%): ${formatCurrency(result.tipAmount)}`,
      `Total: ${formatCurrency(result.total)}`,
      `Per person (${count}): ${formatCurrency(result.perPerson)}`,
    ].join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Tip Calculator</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clear}
          canClear={Boolean(billAmount || tipPercent !== '18' || people !== '1')}
        />
      </div>

      <div className="flex flex-col gap-5" style={{ padding: 20 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="tip-bill-amount">Bill amount</label>
            <input
              id="tip-bill-amount"
              type="number"
              min="0"
              step="0.01"
              value={billAmount}
              onChange={(event) => setBillAmount(event.target.value)}
              className="tb-v2-input"
              placeholder="180.00"
              aria-label="Bill amount"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="tip-people">People</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustPeople(-1)}
                className="tb-v2-mode-tab"
                aria-label="Decrease number of people"
              >
                -
              </button>
              <input
                id="tip-people"
                type="number"
                min="1"
                step="1"
                value={people}
                onChange={(event) => setPeople(event.target.value)}
                className="tb-v2-input text-center"
                aria-label="Number of people"
              />
              <button
                type="button"
                onClick={() => adjustPeople(1)}
                className="tb-v2-mode-tab"
                aria-label="Increase number of people"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="tb-v2-tool-label" htmlFor="tip-percent">Tip percentage</label>
          <div className="flex flex-wrap items-center gap-2">
            {TIP_PRESETS.map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => setTipPercent(String(preset))}
                className={`tb-v2-mode-tab ${tipPercent === String(preset) ? 'on' : ''}`}
              >
                {preset}%
              </button>
            ))}
            <input
              id="tip-percent"
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={tipPercent}
              onChange={(event) => setTipPercent(event.target.value)}
              className="tb-v2-input text-center"
              style={{ width: 88 }}
              aria-label="Tip percentage"
            />
            <span className="text-sm" style={{ color: 'var(--fg-2)' }}>%</span>
          </div>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
        <button
          type="button"
          onClick={copyResult}
          disabled={!result}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {hasInvalidInput ? (
          <p className="tb-v2-error" role="alert">Enter a positive bill, a tip from 0 to 100, and at least one person.</p>
        ) : result && bill !== null && tip !== null && count !== null ? (
          <div className="tb-v2-stats-grid" style={{ padding: 0, borderTop: 0, background: 'transparent' }}>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{formatCurrency(result.tipAmount)}</span>
              <span className="tb-v2-stat-pill-lbl">Tip ({tip}%)</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{formatCurrency(result.total)}</span>
              <span className="tb-v2-stat-pill-lbl">Total</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{formatCurrency(result.perPerson)}</span>
              <span className="tb-v2-stat-pill-lbl">Each ({count})</span>
            </div>
          </div>
        ) : (
          <p className="tb-v2-empty">Enter a bill amount or use Example to calculate the split.</p>
        )}
      </div>
    </div>
  );
}
