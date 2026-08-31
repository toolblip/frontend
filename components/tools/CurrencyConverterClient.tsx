'use client';

import { useState, useEffect } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.5 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.53 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rate: 0.88 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.12 },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', rate: 17.15 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 4.97 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', rate: 1328.5 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.34 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.82 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', rate: 10.62 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rate: 10.42 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', rate: 6.87 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.63 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 18.65 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 92.5 },
];

function formatNumber(num: number, decimals: number = 2): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function CurrencyConverterClient() {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<number>(0);
  const [allResults, setAllResults] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  const fromCurrencyData = currencies.find((c) => c.code === fromCurrency)!;
  const toCurrencyData = currencies.find((c) => c.code === toCurrency)!;

  useEffect(() => {
    const amountNum = parseFloat(amount) || 0;
    const fromRate = fromCurrencyData.rate;
    const toRate = toCurrencyData.rate;

    // Convert to USD first, then to target currency
    const usdAmount = amountNum / fromRate;
    const converted = usdAmount * toRate;
    setResult(converted);

    // Calculate all conversions
    const all: Record<string, number> = {};
    currencies.forEach((currency) => {
      all[currency.code] = usdAmount * currency.rate;
    });
    setAllResults(all);
  }, [amount, fromCurrency, toCurrency, fromCurrencyData, toCurrencyData]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const loadExample = () => {
    setAmount('100');
    setFromCurrency('USD');
    setToCurrency('EUR');
  };

  const clearAll = () => {
    setAmount('');
    setFromCurrency('USD');
    setToCurrency('EUR');
  };

  const popularPairs = [
    ['USD', 'EUR'],
    ['USD', 'GBP'],
    ['USD', 'JPY'],
    ['EUR', 'GBP'],
    ['GBP', 'JPY'],
    ['USD', 'CAD'],
  ];

  const copy = () => {
    navigator.clipboard.writeText(`${result.toFixed(4)} ${toCurrency}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Amount</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clearAll}
          canClear={amount.length > 0}
        />
      </div>
      <div style={{ padding: 20 }} className="flex flex-col gap-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="tb-v2-input text-xl font-mono"
          placeholder="Enter amount"
          min="0"
          step="0.01"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="tb-v2-input"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
            <div className="mt-1 text-sm text-gray-500">
              1 {fromCurrency} = {formatNumber(fromCurrencyData.rate / toCurrencyData.rate, 4)} {toCurrency}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="tb-v2-input"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
            <div className="mt-1 text-sm text-gray-500">
              1 {toCurrency} = {formatNumber(toCurrencyData.rate / fromCurrencyData.rate, 4)} {fromCurrency}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={swapCurrencies}
            className="tb-v2-btn tb-v2-btn-sm text-xl"
            title="Swap currencies"
          >
            ⇄
          </button>
        </div>

        <div className="tb-v2-tool-output-body" style={{ padding: 0 }}>
          <div className="tb-v2-tool-pre text-center" style={{ padding: '20px 16px' }}>
            <div className="text-sm text-gray-500 mb-1">
              {formatNumber(parseFloat(amount) || 0)} {fromCurrency} =
            </div>
            <div className="text-4xl font-bold mb-2" style={{ color: 'var(--red)' }}>
              {toCurrencyData.symbol}{formatNumber(result)}
            </div>
            <div className="text-lg text-gray-600 mb-3">
              {result.toFixed(4)} {toCurrency}
            </div>
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy result'}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="tb-v2-tool-label">Quick Convert</span>
          <div className="flex gap-2 flex-wrap">
            {popularPairs.map(([from, to]) => {
              const active = fromCurrency === from && toCurrency === to;
              return (
                <button
                  key={`${from}-${to}`}
                  type="button"
                  onClick={() => {
                    setFromCurrency(from);
                    setToCurrency(to);
                  }}
                  className={`tb-v2-btn tb-v2-btn-sm ${active ? 'tb-v2-btn-primary' : ''}`}
                >
                  {from}/{to}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="tb-v2-tool-label">All Conversions</span>
          <div className="tb-v2-tool-pre max-h-64 overflow-y-auto" style={{ padding: 0 }}>
            <table className="w-full text-sm">
              <thead className="sticky top-0" style={{ background: 'var(--surface-2)' }}>
                <tr className="border-b">
                  <th className="text-left p-2">Currency</th>
                  <th className="text-right p-2">Rate</th>
                  <th className="text-right p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {currencies.map((currency) => (
                  <tr key={currency.code} className="border-b">
                    <td className="p-2">
                      <span className="font-mono font-bold">{currency.code}</span>
                      <span className="text-gray-500 ml-2 text-xs">{currency.name}</span>
                    </td>
                    <td className="p-2 text-right font-mono">
                      {formatNumber(currency.rate / fromCurrencyData.rate, 4)}
                    </td>
                    <td className="p-2 text-right font-mono font-semibold">
                      {currency.symbol}{formatNumber(allResults[currency.code] || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="tb-v2-tool-label">Exchange Rates (Base: USD)</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {currencies.slice(0, 8).map((currency) => (
              <div key={currency.code} className="tb-v2-tool-pre p-2 text-center">
                <div className="text-xs text-gray-500">{currency.code}</div>
                <div className="font-mono font-semibold">{formatNumber(currency.rate, 2)}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Note: these are static example rates for demonstration purposes and may not reflect current market rates.
          </p>
        </div>
      </div>
    </div>
  );
}
