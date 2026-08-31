'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Mode = 'percentage' | 'change' | 'discount' | 'tip' | 'markup';

interface BasicResult {
  part: number;
  whole: number;
  percentage: number;
}

interface ChangeResult {
  oldValue: number;
  newValue: number;
  difference: number;
  percentage: number;
}

interface DiscountResult {
  price: number;
  percentage: number;
  savings: number;
  finalPrice: number;
}

interface TipResult {
  bill: number;
  percentage: number;
  people: number;
  tip: number;
  total: number;
  perPerson: number;
}

interface MarkupResult {
  cost: number;
  percentage: number;
  markup: number;
  sellingPrice: number;
}

const MODES: { value: Mode; label: string }[] = [
  { value: 'percentage', label: 'Percent of' },
  { value: 'change', label: 'Change' },
  { value: 'discount', label: 'Discount' },
  { value: 'tip', label: 'Tip' },
  { value: 'markup', label: 'Markup' },
];

const TIP_PRESETS = [10, 15, 18, 20, 25];

function parseFinite(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatNumber(value: number, maximumFractionDigits = 2): string {
  return value.toLocaleString('en-US', { maximumFractionDigits });
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export default function PercentageCalculatorClient() {
  const [mode, setMode] = useState<Mode>('percentage');

  const [part, setPart] = useState('');
  const [whole, setWhole] = useState('');
  const [oldValue, setOldValue] = useState('');
  const [newValue, setNewValue] = useState('');
  const [price, setPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState('18');
  const [tipPeople, setTipPeople] = useState('1');
  const [cost, setCost] = useState('');
  const [markupPercent, setMarkupPercent] = useState('');
  const [copied, setCopied] = useState(false);

  const basicResult = useMemo<BasicResult | null>(() => {
    const partValue = parseFinite(part);
    const wholeValue = parseFinite(whole);
    if (partValue === null || wholeValue === null || wholeValue === 0) return null;
    return { part: partValue, whole: wholeValue, percentage: (partValue / wholeValue) * 100 };
  }, [part, whole]);

  const changeResult = useMemo<ChangeResult | null>(() => {
    const oldNumber = parseFinite(oldValue);
    const newNumber = parseFinite(newValue);
    if (oldNumber === null || newNumber === null || oldNumber === 0) return null;
    const difference = newNumber - oldNumber;
    return { oldValue: oldNumber, newValue: newNumber, difference, percentage: (difference / oldNumber) * 100 };
  }, [newValue, oldValue]);

  const discountResult = useMemo<DiscountResult | null>(() => {
    const priceValue = parseFinite(price);
    const percentage = parseFinite(discountPercent);
    if (priceValue === null || priceValue <= 0 || percentage === null || percentage < 0 || percentage > 100) return null;
    const savings = priceValue * (percentage / 100);
    return { price: priceValue, percentage, savings, finalPrice: priceValue - savings };
  }, [discountPercent, price]);

  const tipResult = useMemo<TipResult | null>(() => {
    const billValue = parseFinite(bill);
    const percentage = parseFinite(tipPercent);
    const people = parseFinite(tipPeople);
    if (
      billValue === null ||
      billValue <= 0 ||
      percentage === null ||
      percentage < 0 ||
      percentage > 100 ||
      people === null ||
      !Number.isInteger(people) ||
      people < 1
    ) return null;
    const tip = billValue * (percentage / 100);
    const total = billValue + tip;
    return { bill: billValue, percentage, people, tip, total, perPerson: total / people };
  }, [bill, tipPeople, tipPercent]);

  const markupResult = useMemo<MarkupResult | null>(() => {
    const costValue = parseFinite(cost);
    const percentage = parseFinite(markupPercent);
    if (costValue === null || costValue <= 0 || percentage === null || percentage < 0) return null;
    const markup = costValue * (percentage / 100);
    return { cost: costValue, percentage, markup, sellingPrice: costValue + markup };
  }, [cost, markupPercent]);

  const invalidInput =
    mode === 'percentage'
      ? Boolean((part.trim() || whole.trim()) && (!basicResult || parseFinite(whole) === 0))
      : mode === 'change'
        ? Boolean((oldValue.trim() || newValue.trim()) && (!changeResult || parseFinite(oldValue) === 0))
          : mode === 'discount'
            ? Boolean((price.trim() || discountPercent.trim()) && !discountResult)
          : mode === 'tip'
            ? Boolean((bill.trim() || tipPercent !== '18' || tipPeople !== '1') && !tipResult)
            : Boolean((cost.trim() || markupPercent.trim()) && !markupResult);

  const clear = () => {
    setMode('percentage');
    setPart('');
    setWhole('');
    setOldValue('');
    setNewValue('');
    setPrice('');
    setDiscountPercent('');
    setBill('');
    setTipPercent('18');
    setTipPeople('1');
    setCost('');
    setMarkupPercent('');
    setCopied(false);
  };

  const loadExample = () => {
    switch (mode) {
      case 'percentage':
        setPart('15');
        setWhole('80');
        break;
      case 'change':
        setOldValue('50');
        setNewValue('65');
        break;
      case 'discount':
        setPrice('129.99');
        setDiscountPercent('25');
        break;
      case 'tip':
        setBill('64');
        setTipPercent('18');
        setTipPeople('1');
        break;
      case 'markup':
        setCost('80');
        setMarkupPercent('30');
        break;
    }
  };

  const hasInput = Boolean(
    part || whole || oldValue || newValue || price || discountPercent || bill || cost || markupPercent ||
      tipPercent !== '18' || tipPeople !== '1' || mode !== 'percentage',
  );

  const currentResult =
    mode === 'percentage'
      ? basicResult
      : mode === 'change'
        ? changeResult
        : mode === 'discount'
          ? discountResult
          : mode === 'tip'
            ? tipResult
            : markupResult;

  const copyResult = () => {
    let text = '';
    if (mode === 'percentage' && basicResult) {
      text = `${formatNumber(basicResult.part)} is ${formatNumber(basicResult.percentage)}% of ${formatNumber(basicResult.whole)}`;
    } else if (mode === 'change' && changeResult) {
      text = `${formatNumber(changeResult.percentage)}% change (${formatNumber(changeResult.oldValue)} to ${formatNumber(changeResult.newValue)})`;
    } else if (mode === 'discount' && discountResult) {
      text = `Save ${formatCurrency(discountResult.savings)}; final price ${formatCurrency(discountResult.finalPrice)}`;
    } else if (mode === 'tip' && tipResult) {
      text = `Tip ${formatCurrency(tipResult.tip)}; total ${formatCurrency(tipResult.total)}; each ${formatCurrency(tipResult.perPerson)}`;
    } else if (mode === 'markup' && markupResult) {
      text = `Markup ${formatCurrency(markupResult.markup)}; selling price ${formatCurrency(markupResult.sellingPrice)}`;
    }
    if (!text) return;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Percentage Calculator</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clear}
          canClear={hasInput}
        />
      </div>

      <div style={{ padding: '16px 20px 0' }}>
        <div className="tb-v2-mode-tabs" role="group" aria-label="Percentage calculation type">
          {MODES.map((item) => (
            <button
              type="button"
              key={item.value}
              onClick={() => setMode(item.value)}
              className={`tb-v2-mode-tab ${mode === item.value ? 'on' : ''}`}
              aria-pressed={mode === item.value}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'percentage' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ padding: '16px 20px 20px' }}>
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="percentage-part">Part</label>
            <input id="percentage-part" type="number" value={part} onChange={(event) => setPart(event.target.value)} className="tb-v2-input" placeholder="15" aria-label="Part value" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="percentage-whole">Whole</label>
            <input id="percentage-whole" type="number" value={whole} onChange={(event) => setWhole(event.target.value)} className="tb-v2-input" placeholder="80" aria-label="Whole value" />
          </div>
        </div>
      )}

      {mode === 'change' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ padding: '16px 20px 20px' }}>
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="percentage-old">Old value</label>
            <input id="percentage-old" type="number" value={oldValue} onChange={(event) => setOldValue(event.target.value)} className="tb-v2-input" placeholder="50" aria-label="Old value" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="percentage-new">New value</label>
            <input id="percentage-new" type="number" value={newValue} onChange={(event) => setNewValue(event.target.value)} className="tb-v2-input" placeholder="65" aria-label="New value" />
          </div>
        </div>
      )}

      {mode === 'discount' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ padding: '16px 20px 20px' }}>
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="percentage-price">Original price</label>
            <input id="percentage-price" type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} className="tb-v2-input" placeholder="129.99" aria-label="Original price" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="percentage-discount">Discount percentage</label>
            <input id="percentage-discount" type="number" min="0" max="100" step="0.1" value={discountPercent} onChange={(event) => setDiscountPercent(event.target.value)} className="tb-v2-input" placeholder="25" aria-label="Discount percentage" />
          </div>
        </div>
      )}

      {mode === 'tip' && (
        <div className="flex flex-col gap-5" style={{ padding: '16px 20px 20px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="tb-v2-tool-label" htmlFor="percentage-bill">Bill amount</label>
              <input id="percentage-bill" type="number" min="0" step="0.01" value={bill} onChange={(event) => setBill(event.target.value)} className="tb-v2-input" placeholder="64.00" aria-label="Bill amount" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="tb-v2-tool-label" htmlFor="percentage-tip-people">People</label>
              <input id="percentage-tip-people" type="number" min="1" step="1" value={tipPeople} onChange={(event) => setTipPeople(event.target.value)} className="tb-v2-input" placeholder="1" aria-label="Number of people" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="tb-v2-tool-label" htmlFor="percentage-tip">Tip percentage</label>
            <div className="flex flex-wrap items-center gap-2">
              {TIP_PRESETS.map((preset) => (
                <button type="button" key={preset} onClick={() => setTipPercent(String(preset))} className={`tb-v2-mode-tab ${tipPercent === String(preset) ? 'on' : ''}`}>
                  {preset}%
                </button>
              ))}
              <input id="percentage-tip" type="number" min="0" max="100" step="0.5" value={tipPercent} onChange={(event) => setTipPercent(event.target.value)} className="tb-v2-input text-center" style={{ width: 88 }} aria-label="Tip percentage" />
              <span className="text-sm" style={{ color: 'var(--fg-2)' }}>%</span>
            </div>
          </div>
        </div>
      )}

      {mode === 'markup' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ padding: '16px 20px 20px' }}>
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="percentage-cost">Cost</label>
            <input id="percentage-cost" type="number" min="0" step="0.01" value={cost} onChange={(event) => setCost(event.target.value)} className="tb-v2-input" placeholder="80.00" aria-label="Cost" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label" htmlFor="percentage-markup">Markup percentage</label>
            <input id="percentage-markup" type="number" min="0" step="0.1" value={markupPercent} onChange={(event) => setMarkupPercent(event.target.value)} className="tb-v2-input" placeholder="30" aria-label="Markup percentage" />
          </div>
        </div>
      )}

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
        <button
          type="button"
          onClick={copyResult}
          disabled={!currentResult}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {invalidInput ? (
          <p className="tb-v2-error" role="alert">
            {mode === 'percentage'
              ? 'Enter a part and a non-zero whole.'
              : mode === 'change'
                ? 'Enter an old value and a new value; the old value cannot be zero.'
                : mode === 'discount'
                  ? 'Enter a positive price and a discount from 0 to 100.'
                  : mode === 'tip'
                    ? 'Enter a positive bill, a tip from 0 to 100, and at least one person.'
                    : 'Enter a positive cost and a non-negative markup.'}
          </p>
        ) : mode === 'percentage' && basicResult ? (
          <div className="flex flex-col gap-4">
            <div className="tb-v2-stats-grid" style={{ padding: 0, borderTop: 0, background: 'transparent' }}>
              <div className="tb-v2-stat-pill"><span className="tb-v2-stat-pill-val">{formatNumber(basicResult.percentage)}%</span><span className="tb-v2-stat-pill-lbl">Percentage</span></div>
            </div>
            <p className="text-sm" style={{ color: 'var(--fg-2)' }}>
              Formula: {formatNumber(basicResult.part)} / {formatNumber(basicResult.whole)} x 100 = {formatNumber(basicResult.percentage)}%
            </p>
            <div style={{ height: 8, borderRadius: 999, background: 'var(--surface-3)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, basicResult.percentage))}%`, background: 'var(--red)', borderRadius: 999 }} />
            </div>
          </div>
        ) : mode === 'change' && changeResult ? (
          <div className="flex flex-col gap-4">
            <div className="tb-v2-stats-grid" style={{ padding: 0, borderTop: 0, background: 'transparent' }}>
              <div className="tb-v2-stat-pill"><span className="tb-v2-stat-pill-val">{changeResult.percentage >= 0 ? '+' : ''}{formatNumber(changeResult.percentage)}%</span><span className="tb-v2-stat-pill-lbl">Change</span></div>
              <div className="tb-v2-stat-pill"><span className="tb-v2-stat-pill-val">{changeResult.difference >= 0 ? '+' : ''}{formatNumber(changeResult.difference)}</span><span className="tb-v2-stat-pill-lbl">Difference</span></div>
            </div>
            <p className="text-sm" style={{ color: 'var(--fg-2)' }}>Formula: ({formatNumber(changeResult.newValue)} - {formatNumber(changeResult.oldValue)}) / {formatNumber(changeResult.oldValue)} x 100</p>
          </div>
        ) : mode === 'discount' && discountResult ? (
          <div className="tb-v2-stats-grid" style={{ padding: 0, borderTop: 0, background: 'transparent' }}>
            <div className="tb-v2-stat-pill"><span className="tb-v2-stat-pill-val">{formatCurrency(discountResult.savings)}</span><span className="tb-v2-stat-pill-lbl">You save</span></div>
            <div className="tb-v2-stat-pill"><span className="tb-v2-stat-pill-val">{formatCurrency(discountResult.finalPrice)}</span><span className="tb-v2-stat-pill-lbl">Final price</span></div>
          </div>
        ) : mode === 'tip' && tipResult ? (
          <div className="tb-v2-stats-grid" style={{ padding: 0, borderTop: 0, background: 'transparent' }}>
            <div className="tb-v2-stat-pill"><span className="tb-v2-stat-pill-val">{formatCurrency(tipResult.tip)}</span><span className="tb-v2-stat-pill-lbl">Tip</span></div>
            <div className="tb-v2-stat-pill"><span className="tb-v2-stat-pill-val">{formatCurrency(tipResult.total)}</span><span className="tb-v2-stat-pill-lbl">Total</span></div>
            <div className="tb-v2-stat-pill"><span className="tb-v2-stat-pill-val">{formatCurrency(tipResult.perPerson)}</span><span className="tb-v2-stat-pill-lbl">Each ({tipResult.people})</span></div>
          </div>
        ) : mode === 'markup' && markupResult ? (
          <div className="tb-v2-stats-grid" style={{ padding: 0, borderTop: 0, background: 'transparent' }}>
            <div className="tb-v2-stat-pill"><span className="tb-v2-stat-pill-val">{formatCurrency(markupResult.markup)}</span><span className="tb-v2-stat-pill-lbl">Markup</span></div>
            <div className="tb-v2-stat-pill"><span className="tb-v2-stat-pill-val">{formatCurrency(markupResult.sellingPrice)}</span><span className="tb-v2-stat-pill-lbl">Selling price</span></div>
          </div>
        ) : (
          <p className="tb-v2-empty">Enter values or use Example to calculate.</p>
        )}
      </div>
    </div>
  );
}
