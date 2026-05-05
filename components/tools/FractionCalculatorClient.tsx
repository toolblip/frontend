'use client';

import { useState } from 'react';

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function simplify(numerator: number, denominator: number): { num: number; den: number } {
  if (denominator === 0) return { num: numerator, den: 1 };
  const g = gcd(numerator, denominator);
  return { num: numerator / g, den: denominator / g };
}

export default function FractionCalculatorClient() {
  const [num1, setNum1] = useState('1');
  const [den1, setDen1] = useState('4');
  const [num2, setNum2] = useState('1');
  const [den2, setDen2] = useState('2');
  const [operator, setOperator] = useState<'add' | 'subtract' | 'multiply' | 'divide'>('add');

  const n1 = parseInt(num1) || 0;
  const d1 = parseInt(den1) || 1;
  const n2 = parseInt(num2) || 0;
  const d2 = parseInt(den2) || 1;

  let resultNum = 0;
  let resultDen = 1;

  switch (operator) {
    case 'add':
      resultNum = n1 * d2 + n2 * d1;
      resultDen = d1 * d2;
      break;
    case 'subtract':
      resultNum = n1 * d2 - n2 * d1;
      resultDen = d1 * d2;
      break;
    case 'multiply':
      resultNum = n1 * n2;
      resultDen = d1 * d2;
      break;
    case 'divide':
      resultNum = n1 * d2;
      resultDen = d2 ? d1 * n2 : 1;
      break;
  }

  const simplified = simplify(resultNum, resultDen);
  const decimal = resultDen !== 0 ? (resultNum / resultDen).toFixed(6) : 'undefined';

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Fraction Calculator</h2>
        <p className="tb-v2-card-description">Add, subtract, multiply, or divide fractions</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              className="tb-v2-input w-full text-center"
              placeholder="Num"
            />
            <div className="border-b-2 border-gray-400 my-1" />
            <input
              type="number"
              value={den1}
              onChange={(e) => setDen1(e.target.value)}
              className="tb-v2-input w-full text-center"
              placeholder="Den"
            />
          </div>

          <div className="flex flex-col gap-2">
            {(['add', 'subtract', 'multiply', 'divide'] as const).map((op) => (
              <button
                key={op}
                onClick={() => setOperator(op)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  operator === op
                    ? 'tb-v2-button-primary'
                    : 'tb-v2-button-secondary'
                }`}
              >
                {op === 'add' ? '+' : op === 'subtract' ? '−' : op === 'multiply' ? '×' : '÷'}
              </button>
            ))}
          </div>

          <div className="flex-1">
            <input
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              className="tb-v2-input w-full text-center"
              placeholder="Num"
            />
            <div className="border-b-2 border-gray-400 my-1" />
            <input
              type="number"
              value={den2}
              onChange={(e) => setDen2(e.target.value)}
              className="tb-v2-input w-full text-center"
              placeholder="Den"
            />
          </div>

          <div className="text-3xl font-bold">=</div>

          <div className="flex-1">
            <div className="tb-v2-input w-full text-center bg-gray-50 py-2">
              <span className="text-2xl font-bold">{simplified.num}</span>
            </div>
            <div className="border-b-2 border-gray-400 my-1" />
            <div className="tb-v2-input w-full text-center bg-gray-50 py-2">
              <span className="text-2xl font-bold">{simplified.den}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tb-v2-card p-4 bg-gray-50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-500 mb-1">Decimal</div>
            <div className="font-mono text-lg">{decimal}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Mixed Number</div>
            <div className="font-mono text-lg">
              {Math.abs(simplified.num) >= Math.abs(simplified.den)
                ? `${Math.floor(simplified.num / simplified.den)} ${Math.abs(simplified.num % simplified.den)}/${Math.abs(simplified.den)}`
                : `${simplified.num}/${simplified.den}`}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        <p>
          {n1}/{d1} {operator} {n2}/{d2} = {simplified.num}/{simplified.den}
        </p>
      </div>
    </div>
  );
}
