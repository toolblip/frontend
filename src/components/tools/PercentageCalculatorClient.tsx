'use client';

import { useState, useMemo } from 'react';

type Mode = 'basic' | 'change' | 'tip';

interface BasicResult {
  part: number;
  whole: number;
  percent: number;
}

interface ChangeResult {
  oldVal: number;
  newVal: number;
  diff: number;
  pctChange: number;
}

interface TipResult {
  tip: number;
  total: number;
  perPerson: number;
}

export default function PercentageCalculatorClient() {
  const [mode, setMode] = useState<Mode>('basic');

  // Basic mode
  const [basicPart, setBasicPart] = useState('');
  const [basicWhole, setBasicWhole] = useState('');

  // Change mode
  const [changeOld, setChangeOld] = useState('');
  const [changeNew, setChangeNew] = useState('');

  // Tip mode
  const [billAmount, setBillAmount] = useState('');
  const [tipPct, setTipPct] = useState(15);
  const [numPeople, setNumPeople] = useState(1);

  const basic = useMemo((): BasicResult | null => {
    const p = parseFloat(basicPart);
    const w = parseFloat(basicWhole);
    if (isNaN(p) || isNaN(w) || w === 0) return null;
    return { part: p, whole: w, percent: (p / w) * 100 };
  }, [basicPart, basicWhole]);

  const change = useMemo((): ChangeResult | null => {
    const o = parseFloat(changeOld);
    const n = parseFloat(changeNew);
    if (isNaN(o) || isNaN(n) || o === 0) return null;
    const diff = n - o;
    return { oldVal: o, newVal: n, diff, pctChange: (diff / o) * 100 };
  }, [changeOld, changeNew]);

  const tip = useMemo((): TipResult | null => {
    const b = parseFloat(billAmount);
    if (isNaN(b) || b <= 0 || tipPct <= 0 || numPeople <= 0) return null;
    const tipAmt = b * (tipPct / 100);
    const total = b + tipAmt;
    return { tip: tipAmt, total, perPerson: total / numPeople };
  }, [billAmount, tipPct, numPeople]);

  const presets = [5, 10, 15, 18, 20, 25];

  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div className="flex gap-2 border-b border-gray-700 pb-4">
        {([['basic', 'Basic %'], ['change', 'Change'], ['tip', 'Tip']] as [Mode, string][]).map(([m, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
              mode === m
                ? 'bg-green-600 text-black font-medium'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Basic % ─────────────────────────────────── */}
      {mode === 'basic' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
                Part (value)
              </label>
              <input
                type="number"
                value={basicPart}
                onChange={e => setBasicPart(e.target.value)}
                placeholder="e.g. 25"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-100 text-lg focus:outline-none focus:border-green-500 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
                Whole (total)
              </label>
              <input
                type="number"
                value={basicWhole}
                onChange={e => setBasicWhole(e.target.value)}
                placeholder="e.g. 200"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-100 text-lg focus:outline-none focus:border-green-500 placeholder-gray-600"
              />
            </div>
          </div>

          {basic && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-400 mb-1">
                  {basic.percent.toFixed(2)}%
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {basic.part.toLocaleString()} is {basic.percent.toFixed(2)}% of {basic.whole.toLocaleString()}
                </p>
              </div>
              <div className="mt-5 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, basic.percent)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {!basic && (basicPart || basicWhole) && (
            <p className="text-center text-gray-500 text-sm">Enter both values to calculate.</p>
          )}
        </div>
      )}

      {/* ── % Change ─────────────────────────────────── */}
      {mode === 'change' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
                Old Value
              </label>
              <input
                type="number"
                value={changeOld}
                onChange={e => setChangeOld(e.target.value)}
                placeholder="e.g. 50"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-100 text-lg focus:outline-none focus:border-green-500 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
                New Value
              </label>
              <input
                type="number"
                value={changeNew}
                onChange={e => setChangeNew(e.target.value)}
                placeholder="e.g. 65"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-100 text-lg focus:outline-none focus:border-green-500 placeholder-gray-600"
              />
            </div>
          </div>

          {change && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className={`text-2xl font-bold ${change.diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {change.diff >= 0 ? '+' : ''}{change.diff.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Difference</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${change.pctChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {change.pctChange >= 0 ? '+' : ''}{change.pctChange.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">% Change</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-200">
                    {change.newVal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">New Value</div>
                </div>
              </div>
            </div>
          )}

          {!change && (changeOld || changeNew) && (
            <p className="text-center text-gray-500 text-sm">Enter both values to calculate.</p>
          )}
        </div>
      )}

      {/* ── Tip Calculator ────────────────────────────── */}
      {mode === 'tip' && (
        <div className="space-y-5">
          {/* Bill amount */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
              Bill Amount ($)
            </label>
            <input
              type="number"
              value={billAmount}
              onChange={e => setBillAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-100 text-lg focus:outline-none focus:border-green-500 placeholder-gray-600"
            />
          </div>

          {/* Tip % presets */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
              Tip Percentage
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {presets.map(p => (
                <button
                  key={p}
                  onClick={() => setTipPct(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    tipPct === p
                      ? 'bg-green-600 text-black'
                      : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                  }`}
                >
                  {p}%
                </button>
              ))}
              <input
                type="number"
                min={1}
                max={100}
                value={tipPct}
                onChange={e => setTipPct(Math.max(1, Math.min(100, Number(e.target.value))))}
                className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-center text-gray-100 focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          {/* Number of people */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
              Split Between
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setNumPeople(n => Math.max(1, n - 1))}
                className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors text-xl flex items-center justify-center"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={numPeople}
                onChange={e => setNumPeople(Math.max(1, Number(e.target.value)))}
                className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-center text-gray-100 focus:outline-none focus:border-green-500"
              />
              <button
                onClick={() => setNumPeople(n => n + 1)}
                className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors text-xl flex items-center justify-center"
              >
                +
              </button>
              <span className="text-gray-500 text-sm">people</span>
            </div>
          </div>

          {tip && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    ${tip.tip.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Tip</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-200">
                    ${tip.total.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    ${tip.perPerson.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Per Person</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
