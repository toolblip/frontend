'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type SplitMode = 'equal' | 'custom';

interface Share {
  base: number;
  tax: number;
  tip: number;
  exact: number;
  amount: number;
}

function parseFinite(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export default function BillSplitterClient() {
  const [splitMode, setSplitMode] = useState<SplitMode>('equal');
  const [billAmount, setBillAmount] = useState('');
  const [people, setPeople] = useState('2');
  const [personAmounts, setPersonAmounts] = useState(['', '']);
  const [taxPercent, setTaxPercent] = useState('0');
  const [tipPercent, setTipPercent] = useState('15');
  const [roundUp, setRoundUp] = useState(false);
  const [copied, setCopied] = useState(false);

  const count = parseFinite(people);
  const tax = parseFinite(taxPercent);
  const tip = parseFinite(tipPercent);
  const validCount = count !== null && Number.isInteger(count) && count >= 1 && count <= 100;
  const customValues = validCount
    ? Array.from({ length: count }, (_, index) => parseFinite(personAmounts[index] ?? ''))
    : null;
  const customSubtotal = customValues && customValues.every((value): value is number => value !== null && value >= 0)
    ? customValues.reduce((sum, value) => sum + value, 0)
    : null;
  const equalSubtotal = parseFinite(billAmount);

  const hasInput = Boolean(
    billAmount ||
      personAmounts.some((amount) => amount) ||
      splitMode !== 'equal' ||
      people !== '2' ||
      taxPercent !== '0' ||
      tipPercent !== '15' ||
      roundUp,
  );

  const invalidInput = hasInput && (
    !validCount ||
    tax === null ||
    tax < 0 ||
    tax > 100 ||
    tip === null ||
    tip < 0 ||
    tip > 100 ||
    (splitMode === 'equal'
      ? equalSubtotal === null || equalSubtotal <= 0
      : customSubtotal === null || customSubtotal <= 0)
  );
  const hasValidSubtotal = splitMode === 'equal'
    ? equalSubtotal !== null && equalSubtotal > 0
    : customSubtotal !== null && customSubtotal > 0;

  const calculation = !invalidInput && hasValidSubtotal && validCount && tax !== null && tip !== null
    ? (() => {
        const bases = splitMode === 'equal'
          ? Array.from({ length: count }, () => (equalSubtotal ?? 0) / count)
          : (customValues ?? []).map((value) => value ?? 0);
        const shares: Share[] = bases.map((base) => {
          const taxAmount = base * (tax / 100);
          const tipAmount = base * (tip / 100);
          const exact = base + taxAmount + tipAmount;
          return {
            base,
            tax: taxAmount,
            tip: tipAmount,
            exact,
            amount: roundUp ? Math.ceil(Number(exact.toFixed(2))) : exact,
          };
        });
        return {
          subtotal: bases.reduce((sum, base) => sum + base, 0),
          tax: shares.reduce((sum, share) => sum + share.tax, 0),
          tip: shares.reduce((sum, share) => sum + share.tip, 0),
          exactTotal: shares.reduce((sum, share) => sum + share.exact, 0),
          total: shares.reduce((sum, share) => sum + share.amount, 0),
          shares,
        };
      })()
    : null;

  const setPeopleCount = (value: string) => {
    setPeople(value);
    const nextCount = Number(value);
    if (Number.isInteger(nextCount) && nextCount >= 1 && nextCount <= 100) {
      setPersonAmounts((current) => Array.from({ length: nextCount }, (_, index) => current[index] ?? ''));
    }
  };

  const updatePersonAmount = (index: number, value: string) => {
    setPersonAmounts((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const loadExample = () => {
    setSplitMode('custom');
    setBillAmount('');
    setPeople('2');
    setPersonAmounts(['32', '18']);
    setTaxPercent('8');
    setTipPercent('20');
    setRoundUp(false);
    setCopied(false);
  };

  const clear = () => {
    setSplitMode('equal');
    setBillAmount('');
    setPeople('2');
    setPersonAmounts(['', '']);
    setTaxPercent('0');
    setTipPercent('15');
    setRoundUp(false);
    setCopied(false);
  };

  const copySummary = () => {
    if (!calculation || count === null || tax === null || tip === null) return;
    const lines = [
      `Subtotal: ${formatCurrency(calculation.subtotal)}`,
      `Tax (${tax}%): ${formatCurrency(calculation.tax)}`,
      `Tip (${tip}%): ${formatCurrency(calculation.tip)}`,
      ...calculation.shares.map((share, index) => `Person ${index + 1}: ${formatCurrency(share.amount)}`),
      `Total: ${formatCurrency(calculation.total)}`,
    ];
    navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Bill Splitter</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clear}
          canClear={hasInput}
        />
      </div>

      <div style={{ padding: 20 }}>
        <div className="tb-v2-mode-tabs" role="group" aria-label="Bill split mode">
          <button type="button" onClick={() => setSplitMode('equal')} className={`tb-v2-mode-tab ${splitMode === 'equal' ? 'on' : ''}`} aria-pressed={splitMode === 'equal'}>
            Split equally
          </button>
          <button type="button" onClick={() => setSplitMode('custom')} className={`tb-v2-mode-tab ${splitMode === 'custom' ? 'on' : ''}`} aria-pressed={splitMode === 'custom'}>
            Enter each share
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 16 }}>
          {splitMode === 'equal' ? (
            <div className="flex flex-col gap-1">
              <label className="tb-v2-tool-label" htmlFor="bill-splitter-total">Bill subtotal</label>
              <input
                id="bill-splitter-total"
                type="number"
                min="0"
                step="0.01"
                value={billAmount}
                onChange={(event) => setBillAmount(event.target.value)}
                className="tb-v2-input"
                placeholder="100.00"
                aria-label="Bill subtotal"
              />
            </div>
          ) : (
            <div className="sm:col-span-2">
              <span className="tb-v2-tool-label">Pre-tax amount for each person</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginTop: 8 }}>
                {Array.from({ length: validCount ? count : 2 }, (_, index) => (
                  <div className="flex items-center gap-2" key={index}>
                    <label className="text-sm" htmlFor={`bill-splitter-person-${index + 1}`} style={{ minWidth: 62, color: 'var(--fg-2)' }}>Person {index + 1}</label>
                    <input
                      id={`bill-splitter-person-${index + 1}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={personAmounts[index] ?? ''}
                      onChange={(event) => updatePersonAmount(index, event.target.value)}
                      className="tb-v2-input"
                      placeholder="0.00"
                      aria-label={`Person ${index + 1} pre-tax amount`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="bill-splitter-people">Number of people</label>
            <input
              id="bill-splitter-people"
              type="number"
              min="1"
              max="100"
              step="1"
              value={people}
              onChange={(event) => setPeopleCount(event.target.value)}
              className="tb-v2-input"
              aria-label="Number of people"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="bill-splitter-tax">Sales tax</label>
            <div className="flex items-center gap-2">
              <input id="bill-splitter-tax" type="number" min="0" max="100" step="0.1" value={taxPercent} onChange={(event) => setTaxPercent(event.target.value)} className="tb-v2-input" placeholder="8" aria-label="Sales tax percentage" />
              <span className="text-sm" style={{ color: 'var(--fg-2)' }}>%</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="bill-splitter-tip">Tip</label>
            <div className="flex flex-wrap items-center gap-2">
              {[10, 15, 18, 20, 25].map((preset) => (
                <button type="button" key={preset} onClick={() => setTipPercent(String(preset))} className={`tb-v2-mode-tab ${tipPercent === String(preset) ? 'on' : ''}`}>
                  {preset}%
                </button>
              ))}
              <input id="bill-splitter-tip" type="number" min="0" max="100" step="0.5" value={tipPercent} onChange={(event) => setTipPercent(event.target.value)} className="tb-v2-input text-center" style={{ width: 82 }} aria-label="Tip percentage" />
              <span className="text-sm" style={{ color: 'var(--fg-2)' }}>%</span>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm" style={{ marginTop: 16, color: 'var(--fg-1)' }}>
          <input type="checkbox" checked={roundUp} onChange={(event) => setRoundUp(event.target.checked)} />
          Round each share up to the next whole dollar
        </label>
        <p className="text-xs" style={{ color: 'var(--fg-2)', marginTop: 6 }}>
          Tax and tip are calculated from each pre-tax amount.
        </p>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Split result</span>
        <button type="button" onClick={copySummary} disabled={!calculation} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {invalidInput ? (
          <p className="tb-v2-error" role="alert">Enter a positive subtotal or non-negative amounts for each person with a positive total, plus valid tax, tip, and people values.</p>
        ) : calculation && tax !== null && tip !== null ? (
          <div className="flex flex-col gap-4">
            <div className="tb-v2-stats-grid" style={{ padding: 0, borderTop: 0, background: 'transparent' }}>
              <div className="tb-v2-stat-pill"><span className="tb-v2-stat-pill-val">{formatCurrency(calculation.subtotal)}</span><span className="tb-v2-stat-pill-lbl">Subtotal</span></div>
              <div className="tb-v2-stat-pill"><span className="tb-v2-stat-pill-val">{formatCurrency(calculation.total)}</span><span className="tb-v2-stat-pill-lbl">{roundUp ? 'Collected total' : 'Total'}</span></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm" style={{ color: 'var(--fg-2)' }}><span>Tax ({tax}%)</span><span>{formatCurrency(calculation.tax)}</span></div>
              <div className="flex justify-between text-sm" style={{ color: 'var(--fg-2)' }}><span>Tip ({tip}%)</span><span>{formatCurrency(calculation.tip)}</span></div>
              <div className="tb-v2-tool-label" style={{ marginTop: 8 }}>Share breakdown</div>
              {calculation.shares.map((share, index) => (
                <div key={index} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm">
                  <span>Person {index + 1}</span>
                  <span style={{ color: 'var(--fg-2)' }}>{formatCurrency(share.base)} + {formatCurrency(share.tax + share.tip)}</span>
                  <strong>{formatCurrency(share.amount)}</strong>
                </div>
              ))}
            </div>
            {roundUp && <p className="text-xs" style={{ color: 'var(--fg-2)' }}>Exact total before rounding: {formatCurrency(calculation.exactTotal)}. The rounded shares collect {formatCurrency(calculation.total)}.</p>}
          </div>
        ) : (
          <p className="tb-v2-empty">Enter a subtotal or use Example to split the bill.</p>
        )}
      </div>
    </div>
  );
}
