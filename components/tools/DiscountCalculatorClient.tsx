'use client';

import { useState } from 'react';

export default function DiscountCalculatorClient() {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [taxPercent, setTaxPercent] = useState('0');

  const price = parseFloat(originalPrice) || 0;
  const discount = parseFloat(discountPercent) || 0;
  const tax = parseFloat(taxPercent) || 0;

  const discountAmount = price * (discount / 100);
  const priceAfterDiscount = price - discountAmount;
  const taxAmount = priceAfterDiscount * (tax / 100);
  const finalPrice = priceAfterDiscount + taxAmount;
  const totalSavings = discountAmount;

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Discount Calculator</h2>
        <p className="tb-v2-card-description">Calculate savings and final prices after discounts</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Original Price ($)</label>
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

        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Discount Percentage (%)</label>
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

        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Sales Tax (%, optional)</label>
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

      <div className="tb-v2-card p-6 bg-gray-50">
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
