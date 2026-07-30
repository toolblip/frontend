'use client';

import { useState } from 'react';

const EXAMPLE_PRICE = '129.99';
const EXAMPLE_DISCOUNT = '25';
const EXAMPLE_TAX = '8.5';

export default function DiscountCalculatorClient() {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [taxPercent, setTaxPercent] = useState('0');
  const [copied, setCopied] = useState(false);

  const price = parseFloat(originalPrice) || 0;
  const discount = parseFloat(discountPercent) || 0;
  const tax = parseFloat(taxPercent) || 0;

  const discountAmount = price * (discount / 100);
  const priceAfterDiscount = price - discountAmount;
  const taxAmount = priceAfterDiscount * (tax / 100);
  const finalPrice = priceAfterDiscount + taxAmount;
  const totalSavings = discountAmount;

  const loadExample = () => {
    setOriginalPrice(EXAMPLE_PRICE);
    setDiscountPercent(EXAMPLE_DISCOUNT);
    setTaxPercent(EXAMPLE_TAX);
  };

  const copy = () => {
    if (!(price > 0)) return;
    navigator.clipboard.writeText(`$${finalPrice.toFixed(2)}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Discount Details</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>

      <div className="space-y-4 mb-6" style={{ padding: 20 }}>
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Original Price ($)</label>
          <input
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="tb-v2-input w-full"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Discount Percentage (%)</label>
          <input
            type="number"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            className="tb-v2-input w-full"
            placeholder="0"
            min="0"
            max="100"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Sales Tax (%, optional)</label>
          <input
            type="number"
            value={taxPercent}
            onChange={(e) => setTaxPercent(e.target.value)}
            className="tb-v2-input w-full"
            placeholder="0"
            min="0"
          />
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
        <button type="button" onClick={copy} disabled={!(price > 0)} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Original Price</span>
            <span className="font-medium">${price.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({discountPercent}%)</span>
              <span className="font-medium">-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          {tax > 0 && (
            <div className="flex justify-between text-amber-600">
              <span>Tax ({taxPercent}%)</span>
              <span className="font-medium">+${taxAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-3 flex justify-between">
            <span className="font-semibold">Final Price</span>
            <span className="font-bold text-xl">${finalPrice.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Total Savings</span>
              <span>${totalSavings.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {price > 0 && discount > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            You save ${totalSavings.toFixed(2)} ({discountPercent}% off)
          </p>
        </div>
      )}
    </div>
  );
}
