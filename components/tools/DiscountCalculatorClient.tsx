'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_PRICE = '100';
const EXAMPLE_FIRST_DISCOUNT = '30';
const EXAMPLE_SECOND_DISCOUNT = '10';
const EXAMPLE_TAX = '0';

function parseFinite(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export default function DiscountCalculatorClient() {
  const [originalPrice, setOriginalPrice] = useState('');
  const [firstDiscount, setFirstDiscount] = useState('');
  const [secondDiscount, setSecondDiscount] = useState('');
  const [taxPercent, setTaxPercent] = useState('0');
  const [copied, setCopied] = useState(false);

  const price = parseFinite(originalPrice);
  const first = parseFinite(firstDiscount);
  const second = secondDiscount.trim() ? parseFinite(secondDiscount) : 0;
  const tax = parseFinite(taxPercent);

  const hasInput = Boolean(originalPrice || firstDiscount || secondDiscount || taxPercent !== '0');
  const invalidInput = hasInput && (
    price === null ||
    price <= 0 ||
    first === null ||
    first < 0 ||
    first > 100 ||
    second === null ||
    second < 0 ||
    second > 100 ||
    tax === null ||
    tax < 0
  );

  const result = !invalidInput && price !== null && first !== null && second !== null && tax !== null
    ? (() => {
        const afterFirstDiscount = price * (1 - first / 100);
        const afterDiscounts = afterFirstDiscount * (1 - second / 100);
        const savings = price - afterDiscounts;
        const taxAmount = afterDiscounts * (tax / 100);
        return {
          afterFirstDiscount,
          afterDiscounts,
          savings,
          combinedDiscount: (savings / price) * 100,
          taxAmount,
          finalPrice: afterDiscounts + taxAmount,
        };
      })()
    : null;

  const loadExample = () => {
    setOriginalPrice(EXAMPLE_PRICE);
    setFirstDiscount(EXAMPLE_FIRST_DISCOUNT);
    setSecondDiscount(EXAMPLE_SECOND_DISCOUNT);
    setTaxPercent(EXAMPLE_TAX);
    setCopied(false);
  };

  const clear = () => {
    setOriginalPrice('');
    setFirstDiscount('');
    setSecondDiscount('');
    setTaxPercent('0');
    setCopied(false);
  };

  const copy = () => {
    if (!result || price === null || first === null || second === null || tax === null) return;
    const lines = [
      `Original price: ${formatCurrency(price)}`,
      `After ${first}% discount: ${formatCurrency(result.afterFirstDiscount)}`,
      ...(second > 0 ? [`After an additional ${second}% discount: ${formatCurrency(result.afterDiscounts)}`] : []),
      `Total savings: ${formatCurrency(result.savings)} (${result.combinedDiscount.toFixed(2)}%)`,
      ...(tax > 0 ? [`Tax (${tax}%): ${formatCurrency(result.taxAmount)}`] : []),
      `Final price: ${formatCurrency(result.finalPrice)}`,
    ];
    navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Discount Calculator</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clear}
          canClear={hasInput}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ padding: 20 }}>
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label" htmlFor="discount-original-price">Original price</label>
          <input
            id="discount-original-price"
            type="number"
            min="0"
            step="0.01"
            value={originalPrice}
            onChange={(event) => setOriginalPrice(event.target.value)}
            className="tb-v2-input"
            placeholder="100.00"
            aria-label="Original price"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label" htmlFor="discount-first-percent">First discount</label>
          <div className="flex items-center gap-2">
            <input
              id="discount-first-percent"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={firstDiscount}
              onChange={(event) => setFirstDiscount(event.target.value)}
              className="tb-v2-input"
              placeholder="30"
              aria-label="First discount percentage"
            />
            <span className="text-sm" style={{ color: 'var(--fg-2)' }}>%</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label" htmlFor="discount-second-percent">Additional discount <span style={{ color: 'var(--fg-2)', fontWeight: 400 }}>(optional)</span></label>
          <div className="flex items-center gap-2">
            <input
              id="discount-second-percent"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={secondDiscount}
              onChange={(event) => setSecondDiscount(event.target.value)}
              className="tb-v2-input"
              placeholder="10"
              aria-label="Additional discount percentage"
            />
            <span className="text-sm" style={{ color: 'var(--fg-2)' }}>%</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label" htmlFor="discount-tax">Sales tax <span style={{ color: 'var(--fg-2)', fontWeight: 400 }}>(optional)</span></label>
          <div className="flex items-center gap-2">
            <input
              id="discount-tax"
              type="number"
              min="0"
              step="0.1"
              value={taxPercent}
              onChange={(event) => setTaxPercent(event.target.value)}
              className="tb-v2-input"
              placeholder="0"
              aria-label="Sales tax percentage"
            />
            <span className="text-sm" style={{ color: 'var(--fg-2)' }}>%</span>
          </div>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
        <button type="button" onClick={copy} disabled={!result} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {invalidInput ? (
          <p className="tb-v2-error" role="alert">Enter a positive price, a first discount from 0 to 100, and valid optional percentages.</p>
        ) : result && price !== null && first !== null && second !== null && tax !== null ? (
          <div className="flex flex-col gap-4">
            <div className="tb-v2-stats-grid" style={{ padding: 0, borderTop: 0, background: 'transparent' }}>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{formatCurrency(result.afterDiscounts)}</span>
                <span className="tb-v2-stat-pill-lbl">After discounts</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{formatCurrency(result.savings)}</span>
                <span className="tb-v2-stat-pill-lbl">Total savings</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{formatCurrency(result.finalPrice)}</span>
                <span className="tb-v2-stat-pill-lbl">Final price</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm" style={{ color: 'var(--fg-2)' }}>
              <div className="flex justify-between"><span>Original price</span><span>{formatCurrency(price)}</span></div>
              <div className="flex justify-between"><span>After {first}% off</span><span>{formatCurrency(result.afterFirstDiscount)}</span></div>
              {second > 0 && <div className="flex justify-between"><span>After an additional {second}% off</span><span>{formatCurrency(result.afterDiscounts)}</span></div>}
              <div className="flex justify-between"><span>Combined discount</span><span>{result.combinedDiscount.toFixed(2)}%</span></div>
              {tax > 0 && <div className="flex justify-between"><span>Sales tax ({tax}%)</span><span>+{formatCurrency(result.taxAmount)}</span></div>}
            </div>
          </div>
        ) : (
          <p className="tb-v2-empty">Enter a price or use Example to calculate the discount.</p>
        )}
      </div>
    </div>
  );
}
