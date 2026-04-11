'use client';

import { useState } from 'react';
import Link from 'next/link';

export const toolMeta = {
  name: 'Percentage Calculator',
  description: 'Calculate percentages, percentage change, tips, and discounts instantly. 100% client-side — nothing leaves your browser.',
  category: 'math',
};

// ─── Shared primitives ────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (!isFinite(n)) return '—';
  const rounded = Math.round(n * 10000) / 10000;
  return rounded % 1 === 0
    ? rounded.toLocaleString()
    : parseFloat(rounded.toFixed(4)).toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function fmtPct(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return rounded % 1 === 0 ? rounded.toString() : parseFloat(rounded.toFixed(2)).toString();
}

function NumInput({
  label,
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-gray-500 text-sm select-none">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? '0'}
          className={`w-full bg-gray-800 border border-gray-700 rounded-lg py-2 text-gray-100 text-sm focus:outline-none focus:border-green-500 placeholder-gray-600 ${prefix ? 'pl-7 pr-3' : suffix ? 'pl-3 pr-7' : 'px-3'}`}
        />
        {suffix && (
          <span className="absolute right-3 text-gray-500 text-sm select-none">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function ResultBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg p-4 border ${highlight ? 'bg-green-900/20 border-green-700/50' : 'bg-gray-800 border-gray-700'}`}>
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-2xl font-bold ${highlight ? 'text-green-400' : 'text-gray-100'}`}>{value}</div>
    </div>
  );
}

// ─── Tab: Basic % (X% of Y) ───────────────────────────────────────────────────

function BasicCalc() {
  const [pct, setPct] = useState('');
  const [of, setOf] = useState('');

  const p = parseFloat(pct);
  const y = parseFloat(of);
  const result = pct !== '' && of !== '' && !isNaN(p) && !isNaN(y) ? (p / 100) * y : null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">What is X% of Y?</p>
      <div className="grid grid-cols-2 gap-4">
        <NumInput label="Percentage" value={pct} onChange={setPct} placeholder="e.g. 15" suffix="%" />
        <NumInput label="Of number" value={of} onChange={setOf} placeholder="e.g. 200" />
      </div>
      {result !== null && (
        <div className="space-y-3">
          <ResultBox label={`${pct}% of ${of} is`} value={fmt(result)} highlight />
          <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-400 font-mono">
            ({pct} ÷ 100) × {of} = <span className="text-green-400">{fmt(result)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Percentage Change ───────────────────────────────────────────────────

function ChangeCalc() {
  const [oldVal, setOldVal] = useState('');
  const [newVal, setNewVal] = useState('');

  const o = parseFloat(oldVal);
  const n = parseFloat(newVal);
  const canCalc = oldVal !== '' && newVal !== '' && !isNaN(o) && !isNaN(n) && o !== 0;
  const change = canCalc ? ((n - o) / Math.abs(o)) * 100 : null;
  const isIncrease = change !== null && change >= 0;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">How much did a value change, in percent?</p>
      <div className="grid grid-cols-2 gap-4">
        <NumInput label="Original value" value={oldVal} onChange={setOldVal} placeholder="e.g. 100" />
        <NumInput label="New value" value={newVal} onChange={setNewVal} placeholder="e.g. 150" />
      </div>
      {change !== null && (
        <div className="space-y-3">
          <ResultBox
            label={isIncrease ? 'Percentage increase' : 'Percentage decrease'}
            value={`${isIncrease ? '+' : ''}${fmtPct(change)}%`}
            highlight
          />
          <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-400 font-mono">
            ({newVal} − {oldVal}) ÷ |{oldVal}| × 100 = <span className="text-green-400">{fmtPct(change)}%</span>
          </div>
          {o !== 0 && (
            <div className="text-sm text-gray-500">
              {isIncrease
                ? `Value grew by ${fmtPct(Math.abs(change))}% from ${fmt(o)} to ${fmt(n)}`
                : `Value dropped by ${fmtPct(Math.abs(change))}% from ${fmt(o)} to ${fmt(n)}`}
            </div>
          )}
        </div>
      )}
      {oldVal !== '' && parseFloat(oldVal) === 0 && (
        <p className="text-sm text-red-400">Original value cannot be zero.</p>
      )}
    </div>
  );
}

// ─── Tab: Increase / Decrease ─────────────────────────────────────────────────

function AdjustCalc() {
  const [base, setBase] = useState('');
  const [pct, setPct] = useState('');
  const [mode, setMode] = useState<'increase' | 'decrease'>('increase');

  const b = parseFloat(base);
  const p = parseFloat(pct);
  const canCalc = base !== '' && pct !== '' && !isNaN(b) && !isNaN(p);
  const delta = canCalc ? (b * p) / 100 : null;
  const result = delta !== null ? (mode === 'increase' ? b + delta : b - delta) : null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Increase or decrease a number by a given percentage.</p>
      <div className="flex gap-2">
        {(['increase', 'decrease'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`text-sm px-4 py-1.5 rounded-full transition-colors capitalize ${
              mode === m
                ? 'bg-green-600 text-black font-medium'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumInput label="Base number" value={base} onChange={setBase} placeholder="e.g. 200" />
        <NumInput label="By percentage" value={pct} onChange={setPct} placeholder="e.g. 15" suffix="%" />
      </div>
      {result !== null && delta !== null && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ResultBox label={`${mode === 'increase' ? 'Increased' : 'Decreased'} value`} value={fmt(result)} highlight />
            <ResultBox label={mode === 'increase' ? 'Amount added' : 'Amount removed'} value={fmt(delta)} />
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-400 font-mono">
            {fmt(b)} {mode === 'increase' ? '+' : '−'} ({pct}% of {fmt(b)}) ={' '}
            <span className="text-green-400">{fmt(result)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Tip Calculator ──────────────────────────────────────────────────────

function TipCalc() {
  const [bill, setBill] = useState('');
  const [tipPct, setTipPct] = useState('18');
  const [people, setPeople] = useState('1');

  const b = parseFloat(bill);
  const t = parseFloat(tipPct);
  const n = Math.max(1, parseInt(people) || 1);

  const canCalc = bill !== '' && !isNaN(b) && !isNaN(t);
  const tipAmt = canCalc ? (b * t) / 100 : null;
  const total = tipAmt !== null ? b + tipAmt : null;
  const perPerson = total !== null ? total / n : null;

  const presets = ['10', '15', '18', '20', '25'];

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Split a bill and calculate the tip.</p>
      <NumInput label="Bill amount" value={bill} onChange={setBill} placeholder="e.g. 50.00" prefix="$" />
      <div>
        <label className="block text-sm text-gray-400 mb-2">Tip percentage</label>
        <div className="flex gap-2 flex-wrap mb-2">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setTipPct(p)}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                tipPct === p
                  ? 'bg-green-600 text-black font-medium'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {p}%
            </button>
          ))}
        </div>
        <input
          type="number"
          value={tipPct}
          onChange={(e) => setTipPct(e.target.value)}
          placeholder="Custom %"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-green-500 placeholder-gray-600"
        />
      </div>
      <NumInput label="Number of people" value={people} onChange={setPeople} placeholder="1" />
      {tipAmt !== null && total !== null && perPerson !== null && (
        <div className="grid grid-cols-3 gap-3">
          <ResultBox label="Tip amount" value={`$${fmt(tipAmt)}`} />
          <ResultBox label="Total bill" value={`$${fmt(total)}`} highlight />
          <ResultBox label={n > 1 ? `Per person (${n})` : 'Per person'} value={`$${fmt(perPerson)}`} />
        </div>
      )}
    </div>
  );
}

// ─── Tab: Discount Calculator ─────────────────────────────────────────────────

function DiscountCalc() {
  const [price, setPrice] = useState('');
  const [disc, setDisc] = useState('');

  const p = parseFloat(price);
  const d = parseFloat(disc);
  const canCalc = price !== '' && disc !== '' && !isNaN(p) && !isNaN(d);
  const savings = canCalc ? (p * d) / 100 : null;
  const finalPrice = savings !== null ? p - savings : null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">How much do you save with a discount?</p>
      <div className="grid grid-cols-2 gap-4">
        <NumInput label="Original price" value={price} onChange={setPrice} placeholder="e.g. 100.00" prefix="$" />
        <NumInput label="Discount" value={disc} onChange={setDisc} placeholder="e.g. 20" suffix="%" />
      </div>
      {savings !== null && finalPrice !== null && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ResultBox label="You save" value={`$${fmt(savings)}`} />
            <ResultBox label="You pay" value={`$${fmt(finalPrice)}`} highlight />
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-400">
            <span className="line-through text-gray-600">${fmt(p)}</span>
            <span className="mx-2 text-gray-600">→</span>
            <span className="text-green-400 font-medium">${fmt(finalPrice)}</span>
            <span className="ml-2 text-green-600 text-xs">({disc}% off)</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = 'basic' | 'change' | 'adjust' | 'tip' | 'discount';

const TABS: { id: Tab; label: string; desc: string }[] = [
  { id: 'basic',    label: 'X% of Y',         desc: 'Find a percentage of a number' },
  { id: 'change',   label: '% Change',         desc: 'Percentage change between two values' },
  { id: 'adjust',   label: 'Increase / Decrease', desc: 'Adjust a number by a percentage' },
  { id: 'tip',      label: 'Tip Calculator',   desc: 'Split a bill with tip' },
  { id: 'discount', label: 'Discount',         desc: 'Savings from a discount' },
];

export default function PercentageCalculatorPage() {
  const [tab, setTab] = useState<Tab>('basic');

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-gray-800 bg-gray-900/40">
        <div className="max-w-4xl mx-auto px-4 py-2 text-sm text-gray-500 flex gap-2">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-gray-300 transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-gray-300" aria-current="page">Percentage Calculator</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">%</span>
            <h1 className="text-2xl font-bold text-white">Percentage Calculator</h1>
          </div>
          <p className="text-gray-400">{toolMeta.description}</p>
          <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
            Math
          </span>
        </div>

        {/* Tool */}
        <section aria-label="Tool" className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          {/* Tab bar */}
          <div className="flex gap-2 flex-wrap mb-6 pb-5 border-b border-gray-800">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                title={t.desc}
                className={`text-sm px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                  tab === t.id
                    ? 'bg-green-600 text-black font-medium'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'basic'    && <BasicCalc />}
          {tab === 'change'   && <ChangeCalc />}
          {tab === 'adjust'   && <AdjustCalc />}
          {tab === 'tip'      && <TipCalc />}
          {tab === 'discount' && <DiscountCalc />}
        </section>

        <p className="text-xs text-gray-600 text-center">
          🔒 100% client-side — your data never leaves your browser
        </p>
      </div>
    </>
  );
}
