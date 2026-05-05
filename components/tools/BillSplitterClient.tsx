'use client';

import { useState, useMemo } from 'react';

export default function BillSplitterClient() {
  const [billAmount, setBillAmount] = useState('');
  const [people, setPeople] = useState(2);
  const [tipPercent, setTipPercent] = useState(15);
  const [customTip, setCustomTip] = useState('');

  const tipAmount = useMemo(() => {
    const amount = parseFloat(billAmount) || 0;
    const tip = customTip ? parseFloat(customTip) : (amount * tipPercent / 100);
    return tip;
  }, [billAmount, tipPercent, customTip]);

  const totalAmount = useMemo(() => {
    return (parseFloat(billAmount) || 0) + tipAmount;
  }, [billAmount, tipAmount]);

  const perPerson = useMemo(() => {
    return people > 0 ? totalAmount / people : 0;
  }, [totalAmount, people]);

  const handleReset = () => {
    setBillAmount('');
    setPeople(2);
    setTipPercent(15);
    setCustomTip('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="tb-v2-tool-label mb-2">Bill Amount ($)</label>
          <input
            type="number"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="tb-v2-tool-input w-full"
          />
        </div>
        <div>
          <label className="tb-v2-tool-label mb-2">Number of People</label>
          <input
            type="number"
            value={people}
            onChange={(e) => setPeople(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            className="tb-v2-tool-input w-full"
          />
        </div>
      </div>

      <div>
        <label className="tb-v2-tool-label mb-2">Tip Percentage</label>
        <div className="flex gap-2 flex-wrap">
          {[10, 15, 18, 20, 25].map((tip) => (
            <button
              key={tip}
              type="button"
              onClick={() => { setTipPercent(tip); setCustomTip(''); }}
              className={`tb-v2-btn ${tipPercent === tip && !customTip ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
            >
              {tip}%
            </button>
          ))}
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={customTip}
              onChange={(e) => { setCustomTip(e.target.value); setTipPercent(0); }}
              placeholder="Custom"
              min="0"
              className="tb-v2-tool-input w-20"
            />
            <span className="text-gray-500 dark:text-gray-400">%</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Bill</span>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            ${(parseFloat(billAmount) || 0).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Tip ({customTip ? `${customTip}%` : `${tipPercent}%`})</span>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            ${tipAmount.toFixed(2)}
          </span>
        </div>
        <div className="border-t border-red-200 dark:border-red-700 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Total</span>
            <span className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Per Person ({people} {people === 1 ? 'person' : 'people'})</p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            ${perPerson.toFixed(2)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="tb-v2-btn tb-v2-btn-secondary w-full"
      >
        Reset
      </button>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-400">
        <strong>Tip Guide:</strong> 10-15% for adequate service, 15-20% for good service, 20%+ for excellent service. Adjust based on your experience!
      </div>
    </div>
  );
}
