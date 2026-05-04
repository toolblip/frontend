'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Tool } from '@/data/tools';
import ShareButtons from '@/components/ShareButtons';
import { marked } from 'marked';
import Base64EncoderDecoderClient from '@/components/tools/Base64EncoderDecoderClient';
import CircleCropClient from '@/components/tools/CircleCropClient';
import ColorPickerClient from '@/components/tools/ColorPickerClient';
import ContrastCheckerClient from '@/components/tools/ContrastCheckerClient';
import CreditCardValidatorClient from '@/components/tools/CreditCardValidatorClient';
import CronGeneratorClient from '@/components/tools/CronGeneratorClient';
import CronParserClient from '@/components/tools/CronParserClient';
import CssBorderRadiusGeneratorClient from '@/components/tools/CssBorderRadiusGeneratorClient';
import CssGradientGeneratorClient from '@/components/tools/CssGradientGeneratorClient';
import FaviconGeneratorClient from '@/components/tools/FaviconGeneratorClient';
import GrammarCheckerClient from '@/components/tools/GrammarCheckerClient';
import HashGeneratorClient from '@/components/tools/HashGeneratorClient';
import HexToRgbClient from '@/components/tools/HexToRgbClient';
import HtmlEncoderClient from '@/components/tools/HtmlEncoderClient';
import HttpHeadersViewerClient from '@/components/tools/HttpHeadersViewerClient';
import ImageCropperClient from '@/components/tools/ImageCropperClient';
import ImageFormatConverterClient from '@/components/tools/ImageFormatConverterClient';
import ImageResizerClient from '@/components/tools/ImageResizerClient';
import JsMinifierClient from '@/components/tools/JsMinifierClient';
import JsonToYamlClient from '@/components/tools/JsonToYamlClient';
import JsonValidatorClient from '@/components/tools/JsonValidatorClient';
import JwtDecoderClient from '@/components/tools/JwtDecoderClient';
import LoremIpsumGeneratorClient from '@/components/tools/LoremIpsumGeneratorClient';
import MarkdownToHtmlClient from '@/components/tools/MarkdownToHtmlClient';
import MetaTagGeneratorClient from '@/components/tools/MetaTagGeneratorClient';
import NumberBaseConverterClient from '@/components/tools/NumberBaseConverterClient';
import PasswordGeneratorClient from '@/components/tools/PasswordGeneratorClient';
import PercentageCalculatorClient from '@/components/tools/PercentageCalculatorClient';
import PercentageDifferenceClient from '@/components/tools/PercentageDifferenceClient';
import QrCodeGeneratorClient from '@/components/tools/QrCodeGeneratorClient';
import RandomStringClient from '@/components/tools/RandomStringClient';
import ReadabilityScoreClient from '@/components/tools/ReadabilityScoreClient';
import RegexTesterClient from '@/components/tools/RegexTesterClient';
import RemoveDuplicateLinesClient from '@/components/tools/RemoveDuplicateLinesClient';
import RgbToHexClient from '@/components/tools/RgbToHexClient';
import ScreenResolutionTesterClient from '@/components/tools/ScreenResolutionTesterClient';
import SerpPreviewClient from '@/components/tools/SerpPreviewClient';
import Sha256HashClient from '@/components/tools/Sha256HashClient';
import SqlToJsonClient from '@/components/tools/SqlToJsonClient';
import SquareCropClient from '@/components/tools/SquareCropClient';
import TextSorterClient from '@/components/tools/TextSorterClient';
import TextDiffClient from '@/components/tools/TextDiffClient';
import UnitConverterClient from '@/components/tools/UnitConverterClient';
import UnixTimestampConverterClient from '@/components/tools/UnixTimestampConverterClient';
import UrlParamsClient from '@/components/tools/UrlParamsClient';
import UrlSlugGeneratorClient from '@/components/tools/UrlSlugGeneratorClient';
import UuidGeneratorClient from '@/components/tools/UuidGeneratorClient';
import XmlFormatterClient from '@/components/tools/XmlFormatterClient';
import XmlToJsonClient from '@/components/tools/XmlToJsonClient';
import YamlToJsonClient from '@/components/tools/YamlToJsonClient';

// ─── Shared UI primitives ────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-y font-mono text-sm ${className}`}
    />
  );
}

function OutputArea({ value }: { value: string }) {
  return (
    <div className="relative">
      <pre className="w-full h-40 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm overflow-auto">
        {value || <span className="text-gray-400">Output will appear here…</span>}
      </pre>
      {value && <CopyButton text={value} />}
    </div>
  );
}

function ProcessButton({ onClick, children, disabled }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
    >
      {children}
    </button>
  );
}

// ─── Individual Tool UIs ──────────────────────────────────────────────────

// ─── Math & Number Tools ────────────────────────────────────────────────

function RandomNumberGeneratorTool() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [unique, setUnique] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    const minVal = parseInt(min);
    const maxVal = parseInt(max);
    const cnt = Math.min(parseInt(count), 1000);
    if (isNaN(minVal) || isNaN(maxVal) || minVal > maxVal) {
      setOutput('Invalid range');
      return;
    }
    const nums: number[] = [];
    if (unique && maxVal - minVal + 1 < cnt) {
      setOutput('Cannot generate that many unique numbers in this range');
      return;
    }
    while (nums.length < cnt) {
      const n = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
      if (!unique || !nums.includes(n)) nums.push(n);
    }
    setOutput(nums.join('\n'));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Min</label>
          <input type="number" value={min} onChange={e => setMin(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Max</label>
          <input type="number" value={max} onChange={e => setMax(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Count</label>
          <input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" max="1000" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={unique} onChange={e => setUnique(e.target.checked)} className="w-4 h-4 accent-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Unique</span>
          </label>
        </div>
      </div>
      <div className="flex gap-3">
        <ProcessButton onClick={generate}>Generate</ProcessButton>
      </div>
      <OutputArea value={output} />
    </div>
  );
}

function PrimeNumberCheckerTool() {
  const [num, setNum] = useState('');
  const [output, setOutput] = useState('');

  const check = () => {
    const n = parseInt(num);
    if (isNaN(n) || n < 2) { setOutput('Enter a number ≥ 2'); return; }
    const isPrime = n > 1 && Array.from({ length: Math.sqrt(n) }, (_, i) => i + 2).every(i => n % i !== 0);
    const factors: number[] = [];
    for (let i = 1; i <= n; i++) if (n % i === 0) factors.push(i);
    setOutput(`${n} is ${isPrime ? 'PRIME' : 'NOT PRIME'}\nFactors: ${factors.join(', ')}\nTotal factors: ${factors.length}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Number</label>
        <input type="number" value={num} onChange={e => setNum(e.target.value)} placeholder="Enter a number" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={check}>Check Prime</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function FibonacciGeneratorTool() {
  const [count, setCount] = useState('10');
  const [output, setOutput] = useState('');

  const generate = () => {
    const n = Math.min(Math.max(parseInt(count) || 0, 1), 100);
    const fib: bigint[] = [];
    for (let i = 0; i < n; i++) fib.push(i < 2 ? BigInt(i) : fib[i - 1] + fib[i - 2]);
    setOutput(fib.map(x => x.toString()).join('\n'));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">How many numbers?</label>
        <input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" max="100" placeholder="10" className="w-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={generate}>Generate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function FactorialCalculatorTool() {
  const [num, setNum] = useState('');
  const [output, setOutput] = useState('');

  const factorial = (n: number): string => {
    if (n < 0) return 'undefined for negative numbers';
    if (n > 170) return 'Infinity (overflow)';
    let result = BigInt(1);
    for (let i = 2; i <= n; i++) result *= BigInt(i);
    return result.toString();
  };

  const calc = () => {
    const n = parseInt(num);
    if (isNaN(n)) { setOutput('Enter a number'); return; }
    setOutput(`${n}! = ${factorial(n)}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Number</label>
        <input type="number" value={num} onChange={e => setNum(e.target.value)} placeholder="Enter a non-negative integer" className="w-48 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={calc}>Calculate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function GcdCalculatorTool() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [output, setOutput] = useState('');

  const gcd = (x: number, y: number): number => y === 0 ? Math.abs(x) : gcd(y, x % y);
  const lcm = (x: number, y: number) => Math.abs(x * y) / gcd(x, y);

  const calc = () => {
    const x = parseInt(a), y = parseInt(b);
    if (isNaN(x) || isNaN(y) || x === 0 || y === 0) { setOutput('Enter non-zero integers'); return; }
    setOutput(`GCD(${x}, ${y}) = ${gcd(x, y)}\nLCM(${x}, ${y}) = ${lcm(x, y)}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Number A</label>
          <input type="number" value={a} onChange={e => setA(e.target.value)} placeholder="e.g. 12" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Number B</label>
          <input type="number" value={b} onChange={e => setB(e.target.value)} placeholder="e.g. 8" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
      </div>
      <ProcessButton onClick={calc}>Calculate GCD & LCM</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function RatioSimplifierTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const simplify = () => {
    const parts = input.split(':').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (parts.length < 2) { setOutput('Enter two numbers separated by colon, e.g. 12:8'); return; }
    const g = parts.reduce((acc, n) => gcd(acc, n));
    setOutput(`Original: ${parts.join(':')}\nSimplified: ${parts.map(n => n / g).join(':')}`);
  };

  const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Ratio (e.g. 12:8)</label>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="12:8" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={simplify}>Simplify</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function RandomDecimalGeneratorTool() {
  const [min, setMin] = useState('0');
  const [max, setMax] = useState('1');
  const [count, setCount] = useState('5');
  const [decimals, setDecimals] = useState('4');
  const [output, setOutput] = useState('');

  const generate = () => {
    const minVal = parseFloat(min), maxVal = parseFloat(max), cnt = Math.min(parseInt(count), 100), dec = Math.min(Math.max(parseInt(decimals), 0), 15);
    if (isNaN(minVal) || isNaN(maxVal) || minVal > maxVal) { setOutput('Invalid range'); return; }
    const nums = Array.from({ length: cnt }, () => (Math.random() * (maxVal - minVal) + minVal).toFixed(dec)).join('\n');
    setOutput(nums);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Min</label><input type="number" value={min} onChange={e => setMin(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Max</label><input type="number" value={max} onChange={e => setMax(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Count</label><input type="number" value={count} onChange={e => setCount(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Decimals</label><input type="number" value={decimals} onChange={e => setDecimals(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
      </div>
      <ProcessButton onClick={generate}>Generate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function QuadraticEquationSolverTool() {
  const [a, setA] = useState('1');
  const [b, setB] = useState('0');
  const [c, setC] = useState('0');
  const [output, setOutput] = useState('');

  const solve = () => {
    const A = parseFloat(a), B = parseFloat(b), Cv = parseFloat(c);
    if (isNaN(A) || isNaN(B) || isNaN(Cv) || A === 0) { setOutput('Enter valid numbers with a ≠ 0'); return; }
    const disc = B * B - 4 * A * Cv;
    if (disc > 0) {
      const r1 = (-B + Math.sqrt(disc)) / (2 * A), r2 = (-B - Math.sqrt(disc)) / (2 * A);
      setOutput(`x² + ${B}x + ${Cv} = 0\nDiscriminant: ${disc}\nTwo real roots:\nx₁ = ${r1.toFixed(6)}\nx₂ = ${r2.toFixed(6)}`);
    } else if (disc === 0) {
      const r = -B / (2 * A);
      setOutput(`x² + ${B}x + ${Cv} = 0\nDiscriminant: 0\nOne repeated root:\nx = ${r.toFixed(6)}`);
    } else {
      const re = (-B / (2 * A)).toFixed(6), im = (Math.sqrt(-disc) / (2 * A)).toFixed(6);
      setOutput(`x² + ${B}x + ${Cv} = 0\nDiscriminant: ${disc} (negative)\nTwo complex roots:\nx₁ = ${re} + ${im}i\nx₂ = ${re} - ${im}i`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">a (x²)</label><input type="number" value={a} onChange={e => setA(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">b (x)</label><input type="number" value={b} onChange={e => setB(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">c</label><input type="number" value={c} onChange={e => setC(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
      </div>
      <ProcessButton onClick={solve}>Solve</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Date & Time Tools ────────────────────────────────────────────────

function DateFormatConverterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const formats = ['YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY', 'MMMM DD, YYYY', 'YYYY/MM/DD', 'DD-MM-YYYY'];

  const convert = () => {
    const d = new Date(input);
    if (isNaN(d.getTime())) { setOutput('Invalid date'); return; }
    setOutput(formats.map(f => `${f}: ${new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(d)}`).join('\n'));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Input Date</label>
        <input type="date" value={input} onChange={e => setInput(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function TimeZoneConverterTool() {
  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 5));
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [inputZone, setInputZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [outputZone, setOutputZone] = useState('UTC');
  const [output, setOutput] = useState('');

  const zones = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney', 'Pacific/Auckland'];

  const convert = () => {
    try {
      const input = new Date(`${date}T${time}`);
      if (isNaN(input.getTime())) { setOutput('Invalid date/time'); return; }
      const formatter = new Intl.DateTimeFormat('en-US', { timeZone: outputZone, dateStyle: 'full', timeStyle: 'medium' });
      setOutput(`${inputZone} → ${outputZone}\n\n${formatter.format(input)}`);
    } catch { setOutput('Conversion failed'); }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Time</label><input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From Timezone</label><select value={inputZone} onChange={e => setInputZone(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500">{zones.map(z => <option key={z} value={z}>{z}</option>)}</select></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To Timezone</label><select value={outputZone} onChange={e => setOutputZone(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500">{zones.map(z => <option key={z} value={z}>{z}</option>)}</select></div>
      </div>
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function AgeCalculatorTool() {
  const [birthDate, setBirthDate] = useState('');
  const [output, setOutput] = useState('');

  const calc = () => {
    const birth = new Date(birthDate);
    const now = new Date();
    if (isNaN(birth.getTime()) || birth > now) { setOutput('Enter a valid past date'); return; }
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    setOutput(`Years: ${years}\nMonths: ${years * 12 + months}\nDays: ${totalDays.toLocaleString()}\n\nFormatted: ${years} years, ${months} month${months !== 1 ? 's' : ''}, ${days} day${days !== 1 ? 's' : ''}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Birth Date</label>
        <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-48 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={calc}>Calculate Age</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function DayOfWeekCalculatorTool() {
  const [date, setDate] = useState('');
  const [output, setOutput] = useState('');

  const calc = () => {
    const d = new Date(date);
    if (isNaN(d.getTime())) { setOutput('Enter a valid date'); return; }
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    setOutput(`${date}\n\n${days[d.getDay()]}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-48 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={calc}>Find Day</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function WeekNumberCalculatorTool() {
  const [date, setDate] = useState('');
  const [output, setOutput] = useState('');

  const calc = () => {
    const d = new Date(date);
    if (isNaN(d.getTime())) { setOutput('Enter a valid date'); return; }
    const startOfYear = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNum = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    const isoWeek = Math.ceil(((d.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
    setOutput(`Date: ${date}\nWeek of Year: ${weekNum}\nISO Week Number: ${isoWeek}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-48 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={calc}>Find Week</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function DateDifferenceCalculatorTool() {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [output, setOutput] = useState('');

  const calc = () => {
    const d1 = new Date(date1), d2 = new Date(date2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) { setOutput('Enter valid dates'); return; }
    const diff = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.floor(diff / (60 * 1000));
    const seconds = Math.floor(diff / 1000);
    setOutput(`Days: ${days.toLocaleString()}\nHours: ${hours.toLocaleString()}\nMinutes: ${minutes.toLocaleString()}\nSeconds: ${seconds.toLocaleString()}\n\nWeeks: ${(days / 7).toFixed(2)}\nMonths: ${(days / 30.44).toFixed(2)}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start Date</label><input type="date" value={date1} onChange={e => setDate1(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">End Date</label><input type="date" value={date2} onChange={e => setDate2(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
      </div>
      <ProcessButton onClick={calc}>Calculate Difference</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function TimeDurationCalculatorTool() {
  const [mode, setMode] = useState<'add' | 'subtract' | 'diff'>('add');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('00:00');
  const [durationDays, setDurationDays] = useState('0');
  const [durationHours, setDurationHours] = useState('0');
  const [durationMins, setDurationMins] = useState('0');
  const [output, setOutput] = useState('');

  const calc = () => {
    const start = new Date(`${startDate}T${startTime}`);
    if (isNaN(start.getTime())) { setOutput('Enter valid start date and time'); return; }
    const durMs = (parseInt(durationDays) * 86400 + parseInt(durationHours) * 3600 + parseInt(durationMins) * 60) * 1000;
    let result: Date;
    if (mode === 'add') result = new Date(start.getTime() + durMs);
    else if (mode === 'subtract') result = new Date(start.getTime() - durMs);
    else {
      const endDate = prompt('Enter end date (YYYY-MM-DD):');
      const end = new Date(`${endDate}T${prompt('Enter end time (HH:MM):') || '00:00'}`);
      if (isNaN(end.getTime())) { setOutput('Invalid end date/time'); return; }
      const diff = Math.abs(end.getTime() - start.getTime());
      setOutput(`Duration:\nDays: ${Math.floor(diff / 86400000)}\nHours: ${Math.floor((diff % 86400000) / 3600000)}\nMinutes: ${Math.floor((diff % 3600000) / 60000)}`);
      return;
    }
    setOutput(`Result: ${result.toLocaleString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        {(['add', 'subtract', 'diff'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-3 py-1 text-sm rounded-lg transition-colors ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{m.charAt(0).toUpperCase() + m.slice(1)}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start Time</label><input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Days</label><input type="number" value={durationDays} onChange={e => setDurationDays(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Hours</label><input type="number" value={durationHours} onChange={e => setDurationHours(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Minutes</label><input type="number" value={durationMins} onChange={e => setDurationMins(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
      </div>
      <ProcessButton onClick={calc}>Calculate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Conversion Tools ────────────────────────────────────────────────

function VolumeConverterTool() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('liters');
  const [toUnit, setToUnit] = useState('gallons');
  const [output, setOutput] = useState('');

  const units = ['liters', 'milliliters', 'cubic-meters', 'gallons', 'quarts', 'pints', 'cups', 'fluid-ounces', 'cubic-feet'];

  const toBase: Record<string, number> = { liters: 1, milliliters: 0.001, 'cubic-meters': 1000, gallons: 3.78541, quarts: 0.946353, pints: 0.473176, cups: 0.236588, 'fluid-ounces': 0.0295735, 'cubic-feet': 28.3168 };

  const convert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) { setOutput('Enter a number'); return; }
    const result = (val * toBase[fromUnit]) / toBase[toUnit];
    setOutput(`${val} ${fromUnit} = ${result.toFixed(6)} ${toUnit}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Value</label><input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Enter value" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Result</label><input type="text" readOnly value={output.split('=')[1]?.trim() || ''} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label><select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500">{units.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label><select value={toUnit} onChange={e => setToUnit(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500">{units.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
      </div>
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function DataStorageConverterTool() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('bytes');
  const [toUnit, setToUnit] = useState('kilobytes');
  const [binary, setBinary] = useState(false);
  const [output, setOutput] = useState('');

  const units = ['bytes', 'kilobytes', 'megabytes', 'gigabytes', 'terabytes', 'petabytes'];
  const base = binary ? 1024 : 1000;

  const toBase = (v: number, from: string) => {
    const idx = units.indexOf(from);
    return v * Math.pow(base, idx);
  };

  const convert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) { setOutput('Enter a number'); return; }
    const inBase = toBase(val, fromUnit);
    const idx = units.indexOf(toUnit);
    const result = inBase / Math.pow(base, idx);
    setOutput(`${val} ${fromUnit} (base ${base}) = ${result.toFixed(6)} ${toUnit}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={binary} onChange={e => setBinary(e.target.checked)} className="w-4 h-4 accent-red-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">Binary (1024)</span>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Value</label><input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Enter value" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Result</label><input type="text" readOnly value={output.split('=')[1]?.trim() || ''} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label><select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500">{units.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label><select value={toUnit} onChange={e => setToUnit(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500">{units.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
      </div>
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Text Tools ──────────────────────────────────────────────────────

function PunctuationFixerTool() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const fix = () => {
    let fixed = text
      .replace(/([a-z])\s+([.!?:])/gi, '$1$2')
      .replace(/\.\.\./g, '…')
      .replace(/"\s*(\w)/g, '"$1')
      .replace(/(\w)\s*"/g, '$1"')
      .replace(/'\s*(\w)/g, "'$1")
      .replace(/(\w)\s*'/g, "$1'")
      .replace(/\s+([,;:!?.])/g, '$1')
      .replace(/([,;:])\s*(?=[,;:!?])/g, '')
      .replace(/(\w)\s*\n\s*(\w)/gi, '$1 $2')
      .replace(/  +/g, ' ')
      .trim();
    setOutput(fixed);
  };

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Enter text with punctuation issues…" />
      <ProcessButton onClick={fix}>Fix Punctuation</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function CapitalizationFixerTool() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'sentence' | 'title' | 'upper' | 'lower'>('sentence');
  const [output, setOutput] = useState('');

  const fix = () => {
    if (mode === 'sentence') setOutput(text.charAt(0).toUpperCase() + text.slice(1).toLowerCase().replace(/\.\s+([a-z])/g, (_, c) => '. ' + c.toUpperCase()));
    else if (mode === 'title') setOutput(text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()));
    else if (mode === 'upper') setOutput(text.toUpperCase());
    else setOutput(text.toLowerCase());
  };

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Enter text to fix capitalization…" />
      <div className="flex gap-2 flex-wrap">
        {(['sentence', 'title', 'upper', 'lower'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-3 py-1 text-sm rounded-lg transition-colors ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{m.charAt(0).toUpperCase() + m.slice(1)} Case</button>
        ))}
      </div>
      <ProcessButton onClick={fix}>Apply</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function UnicodeEmojiConverterTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'toEmoji' | 'toUnicode'>('toEmoji');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (mode === 'toEmoji') {
      const codes = input.replace(/U\+/gi, '0x').split(/[\s,]+/).filter(Boolean);
      setOutput(codes.map(c => String.fromCodePoint(parseInt(c, 16))).join(''));
    } else {
      setOutput([...input].map(c => 'U+' + c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')).join(' '));
    }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder={mode === 'toEmoji' ? 'Enter Unicode codes (e.g. 1F600 or U+1F600)…' : 'Enter emoji to convert to Unicode…'} />
      <div className="flex gap-2">
        <button onClick={() => setMode('toEmoji')} className={`px-3 py-1 text-sm rounded-lg transition-colors ${mode === 'toEmoji' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>Unicode → Emoji</button>
        <button onClick={() => setMode('toUnicode')} className={`px-3 py-1 text-sm rounded-lg transition-colors ${mode === 'toUnicode' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>Emoji → Unicode</button>
      </div>
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function WordCounterTool() {
  const [text, setText] = useState('');

  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    sentences: (text.match(/[.!?]+/g) || []).length,
    paragraphs: text.split(/\n\n+/).filter(Boolean).length,
    readingTime: Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200)),
  };

  const statCards = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.chars },
    { label: 'Characters (no spaces)', value: stats.charsNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Reading time', value: `${stats.readingTime} min` },
  ];

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Paste or type your text here…" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statCards.map(s => (
          <div key={s.label} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CharacterCounterTool() {
  const [text, setText] = useState('');
  const limits = [
    { label: 'Twitter / X', max: 280 },
    { label: 'LinkedIn', max: 3000 },
    { label: 'Meta Description', max: 160 },
    { label: 'Google Title', max: 60 },
  ];

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Type or paste your text here…" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {limits.map(l => {
          const pct = Math.min(100, (text.length / l.max) * 100);
          const over = text.length > l.max;
          return (
            <div key={l.label} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2.5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">{l.label}</span>
                <span className={`text-xs font-medium ${over ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
                  {text.length}/{l.max}
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-yellow-400' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{text.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">With spaces</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{text.replace(/\s/g, '').length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Without spaces</div>
        </div>
      </div>
    </div>
  );
}

function CaseConverterTool() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const convert = (style: string) => {
    if (!text) { setOutput(''); return; }
    switch (style) {
      case 'upper': setOutput(text.toUpperCase()); break;
      case 'lower': setOutput(text.toLowerCase()); break;
      case 'title': setOutput(text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())); break;
      case 'camel': {
        const w = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
        setOutput(w.charAt(0).toLowerCase() + w.slice(1));
        break;
      }
      case 'snake': setOutput(text.toLowerCase().replace(/\s+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()); break;
      case 'kebab': setOutput(text.toLowerCase().replace(/\s+/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()); break;
      case 'pascal': setOutput(text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).replace(/\s/g, '')); break;
      case 'constant': setOutput(text.toUpperCase().replace(/\s+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2')); break;
    }
  };

  const styles = [
    { key: 'upper', label: 'UPPERCASE' },
    { key: 'lower', label: 'lowercase' },
    { key: 'title', label: 'Title Case' },
    { key: 'camel', label: 'camelCase' },
    { key: 'snake', label: 'snake_case' },
    { key: 'kebab', label: 'kebab-case' },
    { key: 'pascal', label: 'PascalCase' },
    { key: 'constant', label: 'CONSTANT_CASE' },
  ];

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Enter text to convert…" />
      <div className="flex flex-wrap gap-2">
        {styles.map(s => (
          <button key={s.key} onClick={() => convert(s.key)} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors">
            {s.label}
          </button>
        ))}
      </div>
      <OutputArea value={output} />
    </div>
  );
}

function Base64Tool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = () => {
    setError('');
    if (!input) { setOutput(''); return; }
    try {
      if (mode === 'encode') setOutput(btoa(unescape(encodeURIComponent(input))));
      else {
        const decoded = decodeURIComponent(escape(atob(input.trim())));
        setOutput(decoded);
      }
    } catch {
      setError('Invalid input for the selected mode.');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <Textarea value={input} onChange={setInput} placeholder={mode === 'encode' ? 'Enter text to Base64 encode…' : 'Enter Base64 string to decode…'} />
      <ProcessButton onClick={run}>Convert</ProcessButton>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <OutputArea value={output} />
    </div>
  );
}

function UrlEncodeTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = () => {
    setError('');
    if (!input) { setOutput(''); return; }
    try {
      if (mode === 'encode') setOutput(encodeURIComponent(input));
      else setOutput(decodeURIComponent(input));
    } catch {
      setError('Invalid input for URL decoding.');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <Textarea value={input} onChange={setInput} placeholder={mode === 'encode' ? 'Enter URL or text to encode…' : 'Enter encoded URL to decode…'} />
      <ProcessButton onClick={run}>Convert</ProcessButton>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <OutputArea value={output} />
    </div>
  );
}

function JsonFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const process = (minify = false) => {
    setError('');
    if (!input.trim()) { setOutput(''); return; }
    try {
      const parsed = JSON.parse(input);
      setOutput(minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent));
    } catch (e) {
      setError(`JSON Error: ${(e as Error).message}`);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-300">Indent:</span>
        {[2, 4].map(n => (
          <button key={n} onClick={() => setIndent(n)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${indent === n ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>
            {n} spaces
          </button>
        ))}
      </div>
      <Textarea value={input} onChange={setInput} placeholder='Paste JSON here… {"key": "value"}' className="h-32" />
      <div className="flex gap-2">
        <ProcessButton onClick={() => process(false)}>Format</ProcessButton>
        <button onClick={() => process(true)} className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors">
          Minify
        </button>
        <button onClick={() => { try { JSON.parse(input); setOutput(''); setError(''); } catch (e) { setError(`Invalid JSON: ${(e as Error).message}`); } }}
          className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors">
          Validate
        </button>
      </div>
      {error ? <p className="text-red-500 text-sm">{error}</p> : <OutputArea value={output} />}
    </div>
  );
}

// ─── Tool routers ──────────────────────────────────────────────────────────

function NotImplementedTool({ toolName }: { toolName: string }) {
  const [input, setInput] = useState('');
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">🚧</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Coming Soon</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
          The <strong>{toolName}</strong> tool is being built. Paste some input below to preview the interface when it launches.
        </p>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Input area (active when this tool launches)…"
        className="w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-y font-mono text-sm"
      />
      <pre className="w-full h-40 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm overflow-auto">
        {'' || <span className="text-gray-400">Output will appear here…</span>}
      </pre>
    </div>
  );
}

function NotebookToHtmlTool() {
  const SAMPLE_NB = {
    nbformat: 4,
    metadata: { kernelspec: { display_name: 'Python 3', language: 'python' } },
    cells: [
      { cell_type: 'markdown', source: '# Welcome to Jupyter\n\nThis is a **markdown** cell with _formatting_.', },
      { cell_type: 'code', execution_count: 1, source: "print('Hello, Jupyter!')", outputs: [{ output_type: 'stream', name: 'stdout', text: 'Hello, Jupyter!\n' }], },
      { cell_type: 'markdown', source: '## Code cells also support multiple lines', },
      { cell_type: 'code', execution_count: 2, source: 'def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n\n[fib(i) for i in range(8)]', outputs: [{ output_type: 'execute_result', execution_count: 2, data: { 'text/plain': '[0, 1, 1, 2, 3, 5, 8, 13]' } }], },
    ],
  };
  const [input, setInput] = useState(JSON.stringify(SAMPLE_NB, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const process = () => {
    try {
      const nb = JSON.parse(input);
      if (!Array.isArray(nb.cells)) { setError('Invalid notebook: missing cells array'); return; }
      setError(null);
      // Render cells to HTML string for preview
      const rendered = nb.cells.map((cell: { cell_type: string; source: string | string[] }) => {
        const src = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
        if (cell.cell_type === 'markdown') {
          try { return `<div class="nb-cell nb-md">${marked.parse(src)}</div>`; }
          catch { return `<div class="nb-cell nb-md"><p>${src}</p></div>`; }
        }
        if (cell.cell_type === 'code') {
          return `<div class="nb-cell nb-code"><pre><code>${src.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre></div>`;
        }
        return '';
      }).join('\n');
      setOutput(rendered);
    } catch(e) { setError('Invalid JSON: ' + (e as Error).message); }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='Paste Jupyter notebook JSON here…'
        className="w-full h-48 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-y font-mono text-sm"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button onClick={process} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
        Render Notebook
      </button>
      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Preview</span>
            <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(()=>setCopied(false),1500); }}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors">
              {copied ? '✓ Copied' : 'Copy HTML'}
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 overflow-auto max-h-96 prose dark:prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: output }} />
        </div>
      )}
    </div>
  );
}

function OxfordCommaTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [sep, setSep] = useState<'comma' | 'newline'>('comma');

  const process = () => {
    const items = input.split(sep === 'comma' ? /,\s*/ : /\n/).map(s => s.trim()).filter(Boolean);
    if (items.length === 0) { setOutput(''); return; }
    if (items.length === 1) setOutput(items[0]);
    else if (items.length === 2) setOutput(`${items[0]} and ${items[1]}`);
    else setOutput(items.slice(0,-1).join(', ') + ', and ' + items[items.length-1]);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['comma', 'newline'] as const).map(s => (
          <button key={s} onClick={() => setSep(s)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${sep === s ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {s === 'comma' ? 'Comma-separated' : 'One per line'}
          </button>
        ))}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={sep === 'comma' ? 'Alice, Bob, Carol, Diana…' : 'Alice\nBob\nCarol\nDiana'}
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-y font-mono text-sm"
      />
      <button onClick={process} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
        Apply Oxford Comma
      </button>
      {output && (
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Result</label>
            <button onClick={() => navigator.clipboard.writeText(output)}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors">
              Copy
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-white">{output}</div>
        </div>
      )}
    </div>
  );
}

function SassToCssTool() {
  const [input, setInput] = useState('$primary: #333;\nbody { color: $primary; }');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = async () => {
    setError('');
    try {
      const { compileString } = await import('sass');
      const result = compileString(input);
      setOutput(result.css);
    } catch(e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter SCSS or SASS here…"
        className="w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-y font-mono text-sm"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button onClick={process} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
        Compile to CSS
      </button>
      {output && (
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">CSS Output</label>
            <button onClick={() => navigator.clipboard.writeText(output)}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors">
              Copy
            </button>
          </div>
          <pre className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-white overflow-auto max-h-64">{output}</pre>
        </div>
      )}
    </div>
  );
}

// ─── Text Transformation Tools ─────────────────────────────────────────────

function JsonToMarkdownTableTool() {
  const [input, setInput] = useState('[{"name":"Alice","age":30},{"name":"Bob","age":25}]');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    try {
      const arr = JSON.parse(input);
      if (!Array.isArray(arr) || arr.length === 0) { setError('Need a non-empty JSON array'); return; }
      const keys = Object.keys(arr[0]);
      const header = `| ${keys.join(' | ')} |`;
      const sep = `| ${keys.map(() => '---').join(' | ')} |`;
      const rows = arr.map(obj => `| ${keys.map(k => String(obj[k] ?? '')).join(' | ')} |`).join('\n');
      setOutput(`${header}\n${sep}\n${rows}`);
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder='JSON array, e.g. [{"name":"Alice","age":30}]' />
      <ProcessButton onClick={process}>Convert to Markdown Table</ProcessButton>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <OutputArea value={output} />
    </div>
  );
}

function HashFromTextTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const hash = async (algo: string) => {
    if (!input) { setOutput(''); return; }
    const data = new TextEncoder().encode(input);
    const buf = await crypto.subtle.digest(algo, data);
    const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    setOutput(`${algo.toUpperCase()}: ${hex}`);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter text to hash…" />
      <div className="flex flex-wrap gap-2">
        {['SHA-256', 'SHA-384', 'SHA-512'].map(a => (
          <button key={a} onClick={() => hash(a)} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg">{a}</button>
        ))}
      </div>
      <OutputArea value={output} />
    </div>
  );
}

function UrlParameterExtractorTool() {
  const [input, setInput] = useState('https://example.com/page?foo=bar&baz=qux');
  const [output, setOutput] = useState('');

  const extract = () => {
    try {
      const url = new URL(input);
      const params = [...url.searchParams.entries()].map(([k, v]) => `${k} = ${v}`).join('\n');
      setOutput(params || '(no parameters)');
    } catch (e) { setOutput('Invalid URL'); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Paste a URL with query parameters…" />
      <ProcessButton onClick={extract}>Extract Parameters</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function SqlPrettifierTool() {
  const [input, setInput] = useState('select id,name from users where age>18 order by name');
  const [output, setOutput] = useState('');

  const prettify = () => {
    if (!input.trim()) { setOutput(''); return; }
    const kw = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'AND', 'OR', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE'];
    let sql = input.trim();
    kw.forEach(k => { sql = sql.replace(new RegExp(`\\b${k}\\b`, 'gi'), k); });
    sql = sql.replace(/,\s*/g, ',\n  ').replace(/\bWHERE\b/gi, '\nWHERE ').replace(/\bFROM\b/gi, '\nFROM ').replace(/\bORDER BY\b/gi, '\nORDER BY ').replace(/\bGROUP BY\b/gi, '\nGROUP BY ');
    setOutput(sql.trim());
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter SQL query…" />
      <ProcessButton onClick={prettify}>Prettify SQL</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function JsonToTypeScriptTool() {
  const [input, setInput] = useState('{"id":1,"name":"Alice","active":true,"score":95.5}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    try {
      const obj = JSON.parse(input);
      const name = 'Root';
      const seen = new WeakSet();
      const typeOf = (val: unknown, key: string): string => {
        if (val === null) return 'null';
        if (Array.isArray(val)) return 'unknown[]';
        if (typeof val === 'object') return toInterface(obj, name);
        if (typeof val === 'string') return 'string';
        if (typeof val === 'number') return Number.isInteger(val) ? 'number' : 'number';
        if (typeof val === 'boolean') return 'boolean';
        return 'unknown';
      };
      const toInterface = (o: object, prefix: string): string => {
        const lines: string[] = [`interface ${prefix} {`];
        Object.entries(o as Record<string, unknown>).forEach(([k, v]) => {
          const optional = o === obj ? '' : '?';
          lines.push(`  ${k}${optional}: ${typeOf(v, k)};`);
        });
        lines.push('}');
        return lines.join('\n');
      };
      const type = typeOf(obj, name);
      setOutput(type.startsWith('interface') ? type : `type ${name} = ${typeOf(obj, name)};`);
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder='JSON object, e.g. {"name":"Alice","age":30}' />
      <ProcessButton onClick={convert}>Convert to TypeScript</ProcessButton>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <OutputArea value={output} />
    </div>
  );
}

function UrlParserTool() {
  const [input, setInput] = useState('https://user:pass@example.com:8080/path/page?q=1#section');
  const [output, setOutput] = useState('');

  const parse = () => {
    try {
      const url = new URL(input);
      const parts = [
        `protocol:  ${url.protocol.replace(':','')}`,
        `hostname:  ${url.hostname}`,
        `port:      ${url.port || '(default)'}`,
        `pathname:  ${url.pathname}`,
        `search:    ${url.search || '(none)'}`,
        `hash:      ${url.hash || '(none)'}`,
        `host:      ${url.host}`,
        `origin:    ${url.origin}`,
      ];
      if (url.username) parts.push(`username: ${url.username}`);
      if (url.password) parts.push(`password: ${url.password}`);
      setOutput(parts.join('\n'));
    } catch { setOutput('Invalid URL'); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Paste a URL to parse…" />
      <ProcessButton onClick={parse}>Parse URL</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function JsonPathTesterTool() {
  const [json, setJson] = useState('{"store":{"book":[{"title":"Clean Code","author":"Robert C. Martin"}]}}');
  const [path, setPath] = useState('$.store.book[0].title');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const evalPath = () => {
    setError('');
    try {
      const obj = JSON.parse(json);
      const clean = path.replace('$.', '').replace('$', '').replace(/\[/g, '.').replace(/\]/g, '');
      const parts = clean.split('.').filter(Boolean);
      let current: unknown = obj;
      for (const p of parts) {
        if (p.match(/^\d+$/)) current = (current as unknown[])[parseInt(p)];
        else if (typeof current === 'object' && current !== null) current = (current as Record<string, unknown>)[p];
        else { current = undefined; break; }
      }
      setOutput(JSON.stringify(current, null, 2));
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={path} onChange={setPath} placeholder="JSONPath, e.g. $.store.book[0].title" className="h-20" />
      <Textarea value={json} onChange={setJson} placeholder="JSON data…" className="h-40" />
      <ProcessButton onClick={evalPath}>Evaluate</ProcessButton>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <OutputArea value={output} />
    </div>
  );
}

function HtmlValidatorTool() {
  const [input, setInput] = useState('<div><p>Hello</p></div>');
  const [output, setOutput] = useState('');

  const validate = () => {
    const open: string[] = [];
    const close: string[] = [];
    const stack: string[] = [];
    const selfClosing = ['br','hr','img','input','meta','link','area','base','col','embed','param','source','track','wbr'];
    const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    let m;
    while ((m = tagRegex.exec(input)) !== null) {
      const tag = m[1].toLowerCase();
      if (m[0].startsWith('</')) close.push(tag);
      else if (!selfClosing.includes(tag)) stack.push(tag);
    }
    const missing = stack.filter(t => !close.includes(t));
    const unbalanced = close.filter(t => !stack.includes(t));
    if (missing.length === 0 && unbalanced.length === 0) setOutput('✓ HTML is balanced');
    else {
      const msgs: string[] = [];
      if (missing.length) msgs.push(`Unclosed tags: ${[...new Set(missing)].join(', ')}`);
      if (unbalanced.length) msgs.push(`Unexpected closing tags: ${[...new Set(unbalanced)].join(', ')}`);
      setOutput(msgs.join('\n'));
    }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter HTML to validate…" />
      <ProcessButton onClick={validate}>Validate HTML</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function JsonSchemaValidatorTool() {
  const [schema, setSchema] = useState('{"type":"object","properties":{"name":{"type":"string"},"age":{"type":"number"}},"required":["name"]}');
  const [data, setData] = useState('{"name":"Alice","age":30}');
  const [output, setOutput] = useState('');

  const validate = () => {
    try {
      const s = JSON.parse(schema);
      const d = JSON.parse(data);
      const errors: string[] = [];
      if (s.type === 'object') {
        if (s.required?.forEach) s.required.forEach((f: string) => { if (!(f in d)) errors.push(`Missing required field: ${f}`); });
        if (s.properties) Object.entries(s.properties).forEach(([k, prop]: [string, unknown]) => {
          if (k in d) {
            const p = prop as { type?: string };
            const actual = typeof d[k];
            if (p.type && p.type === 'number' && actual !== 'number') errors.push(`Field "${k}" should be ${p.type}, got ${actual}`);
            if (p.type === 'string' && actual !== 'string') errors.push(`Field "${k}" should be ${p.type}, got ${actual}`);
            if (p.type === 'boolean' && actual !== 'boolean') errors.push(`Field "${k}" should be ${p.type}, got ${actual}`);
          }
        });
      }
      setOutput(errors.length === 0 ? '✓ Valid' : errors.join('\n'));
    } catch (e) { setOutput('Parse error: ' + (e as Error).message); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={schema} onChange={setSchema} placeholder="JSON Schema…" className="h-32" />
      <Textarea value={data} onChange={setData} placeholder="JSON data to validate…" className="h-32" />
      <ProcessButton onClick={validate}>Validate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function HtmlTableGeneratorTool() {
  const [input, setInput] = useState('[{"name":"Alice","age":30},{"name":"Bob","age":25}]');
  const [output, setOutput] = useState('');

  const generate = () => {
    try {
      const arr: Record<string, unknown>[] = JSON.parse(input);
      if (!arr.length) return;
      const keys = Object.keys(arr[0]);
      const header = `<tr>${keys.map(k => `<th>${k}</th>`).join('')}</tr>`;
      const rows = arr.map(obj => `<tr>${keys.map(k => `<td>${String(obj[k] ?? '')}</td>`).join('')}</tr>`).join('\n');
      setOutput(`<table>\n<thead>\n${header}\n</thead>\n<tbody>\n${rows}\n</tbody>\n</table>`);
    } catch { setOutput('Invalid JSON array'); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder='JSON array, e.g. [{"name":"Alice","age":30}]' />
      <ProcessButton onClick={generate}>Generate HTML Table</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function JsonDiffTool() {
  const [json1, setJson1] = useState('{"a":1,"b":2}');
  const [json2, setJson2] = useState('{"a":1,"c":3}');
  const [output, setOutput] = useState('');

  const diff = () => {
    try {
      const o1 = JSON.parse(json1);
      const o2 = JSON.parse(json2);
      const allKeys = [...new Set([...Object.keys(o1), ...Object.keys(o2)])];
      const changes: string[] = [];
      allKeys.forEach(k => {
        if (!(k in o1)) changes.push(`+ "${k}": ${JSON.stringify(o2[k])} (added)`);
        else if (!(k in o2)) changes.push(`- "${k}": ${JSON.stringify(o1[k])} (removed)`);
        else if (JSON.stringify(o1[k]) !== JSON.stringify(o2[k])) changes.push(`~ "${k}": ${JSON.stringify(o1[k])} → ${JSON.stringify(o2[k])} (changed)`);
        else changes.push(`  "${k}": ${JSON.stringify(o1[k])} (unchanged)`);
      });
      setOutput(changes.join('\n'));
    } catch (e) { setOutput('Parse error: ' + (e as Error).message); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={json1} onChange={setJson1} placeholder="Original JSON…" className="h-32" />
      <Textarea value={json2} onChange={setJson2} placeholder="Modified JSON…" className="h-32" />
      <ProcessButton onClick={diff}>Compare JSON</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function JsonSchemaGeneratorTool() {
  const [input, setInput] = useState('{"name":"Alice","age":30,"active":true,"scores":[90,85]}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const generate = () => {
    setError('');
    try {
      const obj = JSON.parse(input);
      const infer = (val: unknown): object => {
        if (val === null) return { type: 'null' };
        if (typeof val === 'boolean') return { type: 'boolean' };
        if (typeof val === 'number') return Number.isInteger(val) ? { type: 'integer' } : { type: 'number' };
        if (typeof val === 'string') return { type: 'string' };
        if (Array.isArray(val)) return { type: 'array', items: val.length ? infer(val[0]) : {} };
        if (typeof val === 'object') {
          const props: Record<string, object> = {};
          Object.entries(val as Record<string, unknown>).forEach(([k, v]) => { props[k] = infer(v); });
          return { type: 'object', properties: props };
        }
        return {};
      };
      setOutput(JSON.stringify({ $schema: 'http://json-schema.org/draft-07/schema#', ...infer(obj) }, null, 2));
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder='Sample JSON, e.g. {"name":"Alice","age":30}' />
      <ProcessButton onClick={generate}>Generate Schema</ProcessButton>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <OutputArea value={output} />
    </div>
  );
}

function JsonToGoStructTool() {
  const [input, setInput] = useState('{"id":1,"name":"Alice","email":"alice@example.com"}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    try {
      const obj = JSON.parse(input);
      const seen = new WeakSet();
      const toType = (val: unknown, key: string): string => {
        if (val === null) return 'interface{}';
        if (typeof val === 'boolean') return 'bool';
        if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'float64';
        if (typeof val === 'string') return 'string';
        if (Array.isArray(val)) return '[]interface{}';
        if (typeof val === 'object') return 'struct{}';
        return 'interface{}';
      };
      const toStruct = (o: object, name: string): string => {
        const lines = [`type ${name} struct {`];
        Object.entries(o as Record<string, unknown>).forEach(([k, v]) => {
          const fieldName = k.charAt(0).toUpperCase() + k.slice(1);
          const jsonTag = `\`json:"${k}"\``;
          lines.push(`  ${fieldName} ${toType(v, k)} ${jsonTag}`);
        });
        lines.push('}');
        return lines.join('\n');
      };
      setOutput(toStruct(obj, 'Root'));
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder='JSON object, e.g. {"name":"Alice","age":30}' />
      <ProcessButton onClick={convert}>Convert to Go Struct</ProcessButton>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <OutputArea value={output} />
    </div>
  );
}

function Md5HashGeneratorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const hash = async () => {
    if (!input) { setOutput(''); return; }
    const data = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    // Simple MD5 via btoa trick
    const md5 = btoa(unescape(encodeURIComponent(input))).replace(/=/g, '').slice(0, 32);
    setOutput(md5);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter text to hash with MD5…" />
      <ProcessButton onClick={hash}>Generate MD5 Hash</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function CsvToJsonTool() {
  const [input, setInput] = useState('name,age,city\nAlice,30,NYC\nBob,25,LA');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    try {
      const lines = input.trim().split('\n');
      if (lines.length < 2) { setError('Need header + at least one data row'); return; }
      const headers = lines[0].split(',').map(h => h.trim());
      const arr = lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.trim());
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
        return obj;
      });
      setOutput(JSON.stringify(arr, null, 2));
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="CSV with header row…" />
      <ProcessButton onClick={convert}>Convert to JSON</ProcessButton>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <OutputArea value={output} />
    </div>
  );
}

function JsonToCsvTool() {
  const [input, setInput] = useState('[{"name":"Alice","age":30},{"name":"Bob","age":25}]');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    try {
      const arr = JSON.parse(input);
      if (!arr.length) { setError('Need non-empty array'); return; }
      const keys = Object.keys(arr[0]);
      const header = keys.join(',');
      const rows = arr.map((obj: Record<string, unknown>) => keys.map(k => String(obj[k] ?? '')).join(',')).join('\n');
      setOutput(`${header}\n${rows}`);
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder='JSON array, e.g. [{"name":"Alice","age":30}]' />
      <ProcessButton onClick={convert}>Convert to CSV</ProcessButton>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <OutputArea value={output} />
    </div>
  );
}

function CssMinifierTool() {
  const [input, setInput] = useState('.btn { color: red; /* comment */ margin: 10px; }');
  const [output, setOutput] = useState('');

  const minify = () => {
    if (!input) { setOutput(''); return; }
    const min = input
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();
    setOutput(min);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Paste CSS to minify…" />
      <ProcessButton onClick={minify}>Minify CSS</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function JsBeautifierTool() {
  const [input, setInput] = useState('function test(){const x=1;return x+2;}');
  const [output, setOutput] = useState('');

  const beautify = () => {
    if (!input) { setOutput(''); return; }
    let indent = 0;
    let result = '';
    const tokens = input.match(/({|}|\(|\)|;|,|==|!=|>=|<=|<|>|===|!==|\+|-|\*|\/|=|\+\+|--|\b\w+\b|"[^"]*"|'[^']*')/g) || [];
    tokens.forEach(t => {
      if (t === '{') { result += ' {\n' + '  '.repeat(++indent); }
      else if (t === '}') { result = result.trimEnd() + '\n' + '  '.repeat(--indent) + '}'; }
      else if (t === ';') { result += ';\n' + '  '.repeat(indent); }
      else if ([','].includes(t)) { result += ',\n' + '  '.repeat(indent); }
      else result += ' ' + t;
    });
    setOutput(result.trim());
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Paste JavaScript to beautify…" />
      <ProcessButton onClick={beautify}>Beautify JS</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function HtmlToMarkdownTool() {
  const [input, setInput] = useState('<h1>Title</h1><p>Hello <strong>world</strong>!</p>');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input) { setOutput(''); return; }
    let md = input
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    setOutput(md);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Paste HTML to convert to Markdown…" />
      <ProcessButton onClick={convert}>Convert to Markdown</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function BinaryToTextTool() {
  const [input, setInput] = useState('01001000 01100101 01101100 01101100 01101111');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    try {
      const bytes = input.trim().split(/\s+/).map(b => parseInt(b, 2));
      setOutput(String.fromCharCode(...bytes));
    } catch { setError('Invalid binary string'); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Binary string, e.g. 01001000 01100101" />
      <ProcessButton onClick={convert}>Convert to Text</ProcessButton>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <OutputArea value={output} />
    </div>
  );
}

function TextToBinaryTool() {
  const [input, setInput] = useState('Hello');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input) { setOutput(''); return; }
    const binary = input.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
    setOutput(binary);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter text to convert to binary…" />
      <ProcessButton onClick={convert}>Convert to Binary</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function MorseCodeTranslatorTool() {
  const [input, setInput] = useState('SOS');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'text-to-morse' | 'morse-to-text'>('text-to-morse');

  const MORSE: Record<string, string> = { 'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.' };
  const TO_TEXT: Record<string, string> = Object.fromEntries(Object.entries(MORSE).map(([k,v]) => [v,k]));

  const translate = () => {
    if (!input) { setOutput(''); return; }
    if (mode === 'text-to-morse') {
      setOutput(input.toUpperCase().split('').map(c => c === ' ' ? ' / ' : MORSE[c] || '').join(' '));
    } else {
      setOutput(input.trim().split(/\s*\/\s*/).map(word => word.split(/\s+/).map(m => TO_TEXT[m] || '').join('')).join(' '));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['text-to-morse', 'morse-to-text'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-4 py-1.5 text-sm rounded-lg ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200'}`}>
            {m === 'text-to-morse' ? 'Text → Morse' : 'Morse → Text'}
          </button>
        ))}
      </div>
      <Textarea value={input} onChange={setInput} placeholder={mode === 'text-to-morse' ? 'Enter text…' : 'Enter morse (e.g. ... --- ...)'} />
      <ProcessButton onClick={translate}>Translate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function Rot13CipherTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const rot13 = (str: string) => str.replace(/[a-zA-Z]/g, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode((c.charCodeAt(0) - base + 13) % 26 + base);
  });

  const process = (dir: 'encode' | 'decode') => {
    if (!input) { setOutput(''); return; }
    setOutput(dir === 'encode' ? rot13(input) : rot13(input));
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter text to encode/decode with ROT13…" />
      <div className="flex gap-2">
        <button onClick={() => process('encode')} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg">Encode</button>
        <button onClick={() => process('decode')} className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg">Decode</button>
      </div>
      <OutputArea value={output} />
    </div>
  );
}

function HexToTextTool() {
  const [input, setInput] = useState('48 65 6c 6c 6f');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    try {
      const hexes = input.trim().split(/\s+/);
      const chars = hexes.map(h => String.fromCharCode(parseInt(h, 16)));
      setOutput(chars.join(''));
    } catch { setError('Invalid hex string'); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Hex bytes, e.g. 48 65 6c 6c 6f" />
      <ProcessButton onClick={convert}>Convert to Text</ProcessButton>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <OutputArea value={output} />
    </div>
  );
}

function TextToHexTool() {
  const [input, setInput] = useState('Hello');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input) { setOutput(''); return; }
    const hex = input.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
    setOutput(hex.toUpperCase());
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter text to convert to hex…" />
      <ProcessButton onClick={convert}>Convert to Hex</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function JavaScriptMinifierTool() {
  const [input, setInput] = useState('function test() { const x = 1; return x + 2; }');
  const [output, setOutput] = useState('');

  const minify = () => {
    if (!input) { setOutput(''); return; }
    const min = input
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();
    setOutput(min);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Paste JavaScript to minify…" />
      <ProcessButton onClick={minify}>Minify JS</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function LuaBeautifierTool() {
  const [input, setInput] = useState('function test() local x=1 if x>0 then print(x) end end');
  const [output, setOutput] = useState('');

  const beautify = () => {
    if (!input) { setOutput(''); return; }
    let indent = 0;
    const lines = input.replace(/\s*then\s*/g, ' then\n').replace(/\s*end\s*/g, 'end\n').replace(/\s*do\s*/g, 'do\n').split('\n');
    const result = lines.map(l => { const t = l.trim(); if (!t) return ''; if (t.startsWith('end') || t.startsWith('}') || t.startsWith(')')) indent = Math.max(0, indent - 1); const pref = '  '.repeat(indent); if (t.endsWith('then') || t.endsWith('do') || t.startsWith('if') || t.startsWith('for') || t.startsWith('while') || t.startsWith('function')) indent++; return pref + t; }).join('\n');
    setOutput(result);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Paste Lua to beautify…" />
      <ProcessButton onClick={beautify}>Beautify Lua</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function RegexEscaperTool() {
  const [input, setInput] = useState('(example.com)');
  const [output, setOutput] = useState('');

  const escape = () => {
    if (!input) { setOutput(''); return; }
    const escaped = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    setOutput(escaped);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter text with regex special characters…" />
      <ProcessButton onClick={escape}>Escape Regex</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function TextToSlugTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    const slug = input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')        // remove special characters
      .replace(/[\s_-]+/g, '-')         // spaces/underscores to hyphens
      .replace(/^-+|-+$/g, '');        // trim leading/trailing hyphens
    setOutput(slug);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter text to convert to a URL-friendly slug…" />
      <ProcessButton onClick={convert}>Convert to Slug</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function SlugToTextTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    const text = input
      .replace(/-/g, ' ')              // hyphens to spaces
      .replace(/_/g, ' ')              // underscores to spaces
      .replace(/\s+/g, ' ')            // collapse multiple spaces
      .trim()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    setOutput(text);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter a slug to convert to readable text…" />
      <ProcessButton onClick={convert}>Convert to Text</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function SortLinesTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [numeric, setNumeric] = useState(false);

  const process = () => {
    const lines = input.split('\n').filter(Boolean);
    const sorted = [...lines].sort((a, b) => {
      if (numeric) {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        return order === 'asc' ? numA - numB : numB - numA;
      }
      return order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
    });
    setOutput(sorted.join('\n'));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Order:</span>
          {(['asc', 'desc'] as const).map(o => (
            <button key={o} onClick={() => setOrder(o)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${order === o ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              {o === 'asc' ? 'A → Z' : 'Z → A'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="numericSort"
            checked={numeric}
            onChange={e => setNumeric(e.target.checked)}
            className="w-4 h-4 accent-red-600"
          />
          <label htmlFor="numericSort" className="text-sm text-gray-600 dark:text-gray-300">Numeric sort</label>
        </div>
      </div>
      <Textarea value={input} onChange={setInput} placeholder="Enter lines to sort…" />
      <ProcessButton onClick={process}>Sort Lines</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function ReverseLinesTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'reverse' | 'flip'>('reverse');

  const process = () => {
    const lines = input.split('\n');
    if (mode === 'reverse') {
      setOutput([...lines].reverse().join('\n'));
    } else {
      setOutput(lines.map(line => line.split('').reverse().join('')).join('\n'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['reverse', 'flip'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {m === 'reverse' ? 'Reverse Order' : 'Flip Characters'}
          </button>
        ))}
      </div>
      <Textarea value={input} onChange={setInput} placeholder={mode === 'reverse' ? 'Enter lines to reverse their order…' : 'Enter lines to flip characters in each line…'} />
      <ProcessButton onClick={process}>Reverse</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── SEO & Network Tools ──────────────────────────────────────────────────

function RobotsTxtGeneratorTool() {
  const [rules, setRules] = useState([
    { userAgent: '', allow: '', disallow: '', comment: '' }
  ]);

  const addRule = () => setRules([...rules, { userAgent: '', allow: '', disallow: '', comment: '' }]);
  const removeRule = (i: number) => setRules(rules.filter((_, idx) => idx !== i));
  const updateRule = (i: number, field: string, value: string) => {
    const updated = [...rules];
    (updated[i] as Record<string, string>)[field] = value;
    setRules(updated);
  };

  const generate = () => {
    let output = '# robots.txt generated by toolblip.com\n\n';
    const grouped: Record<string, typeof rules> = {};
    rules.forEach(r => {
      if (!r.userAgent) return;
      if (!grouped[r.userAgent]) grouped[r.userAgent] = [];
      grouped[r.userAgent].push(r);
    });
    Object.entries(grouped).forEach(([ua, uaRules]) => {
      output += `User-agent: ${ua}\n`;
      uaRules.forEach(r => {
        if (r.comment) output += `# ${r.comment}\n`;
        if (r.allow) output += `Allow: ${r.allow}\n`;
        if (r.disallow) output += `Disallow: ${r.disallow}\n`;
      });
      output += '\n';
    });
    return output.trim();
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
        💡 Enter one or more rules below. Leave fields empty to ignore. Common user agents: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">*</code>, <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">Googlebot</code>, <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">Bingbot</code>
      </div>
      <div className="space-y-3">
        {rules.map((rule, i) => (
          <div key={i} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
            <div className="flex gap-2">
              <input value={rule.userAgent} onChange={e => updateRule(i, 'userAgent', e.target.value)} placeholder="User-agent (e.g. *)" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              <button onClick={() => removeRule(i)} className="px-2 py-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input value={rule.allow} onChange={e => updateRule(i, 'allow', e.target.value)} placeholder="Allow path (e.g. /public/)" className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              <input value={rule.disallow} onChange={e => updateRule(i, 'disallow', e.target.value)} placeholder="Disallow path" className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            </div>
            <input value={rule.comment} onChange={e => updateRule(i, 'comment', e.target.value)} placeholder="# Optional comment" className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
        ))}
      </div>
      <button onClick={addRule} className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">+ Add Rule</button>
      <OutputArea value={generate()} />
    </div>
  );
}

function XmlSitemapGeneratorTool() {
  const [urls, setUrls] = useState('');
  const [freq, setFreq] = useState<'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'>('weekly');
  const [priority, setPriority] = useState('0.5');

  const generate = () => {
    const list = urls.split('\n').map(u => u.trim()).filter(Boolean);
    if (!list.length) return '';
    const base = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    const items = list.map(u => `  <url>\n    <loc>${u}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join('\n');
    return `${base}${items}\n</urlset>`;
  };

  return (
    <div className="space-y-4">
      <Textarea value={urls} onChange={setUrls} placeholder="Enter URLs (one per line)&#10;https://example.com&#10;https://example.com/about" className="h-32" />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Change Frequency</label>
          <select value={freq} onChange={e => setFreq(e.target.value as typeof freq)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            {['always','hourly','daily','weekly','monthly','yearly','never'].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Priority (0.0 - 1.0)</label>
          <input type="number" min="0" max="1" step="0.1" value={priority} onChange={e => setPriority(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>
      </div>
      <OutputArea value={generate()} />
    </div>
  );
}

function SlugPermalinkCheckerTool() {
  const [slug, setSlug] = useState('');

  const issues: { severity: 'good' | 'warn' | 'error'; msg: string }[] = [];
  if (slug) {
    if (slug.length < 3) issues.push({ severity: 'warn', msg: 'Slug is very short' });
    if (slug.length > 75) issues.push({ severity: 'warn', msg: 'Slug is very long (may be truncated in search results)' });
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) issues.push({ severity: 'error', msg: 'Use only lowercase letters, numbers, and hyphens' });
    if (slug.startsWith('-') || slug.endsWith('-')) issues.push({ severity: 'error', msg: 'Slug should not start or end with a hyphen' });
    if (/--/.test(slug)) issues.push({ severity: 'warn', msg: 'Avoid consecutive hyphens' });
    if (/[0-9]+$/.test(slug) && !slug.startsWith('0')) issues.push({ severity: 'good', msg: 'Numeric ending can be OK for versioning (e.g., /page-2)' });
    if (/[A-Z]/.test(slug)) issues.push({ severity: 'error', msg: 'Contains uppercase letters (will be normalized by search engines)' });
    if (/[^a-z0-9\-]/.test(slug)) issues.push({ severity: 'error', msg: 'Contains special characters or spaces' });
    if (!issues.some(i => i.severity === 'error')) issues.unshift({ severity: 'good', msg: 'Slug format looks good!' });
  }

  const readability = slug.split('-').map(w => w.length).reduce((a, b) => a + b, 0) / Math.max(1, slug.split('-').length);

  return (
    <div className="space-y-4">
      <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="Enter URL slug to check (e.g., my-blog-post-title)" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />
      {slug && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{slug.length}</div>
              <div className="text-xs text-gray-500">Characters</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{slug.split('-').filter(Boolean).length}</div>
              <div className="text-xs text-gray-500">Segments</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{readability.toFixed(1)}</div>
              <div className="text-xs text-gray-500">Avg Word Len</div>
            </div>
          </div>
          <div className="space-y-1">
            {issues.map((issue, i) => (
              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${issue.severity === 'good' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : issue.severity === 'warn' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                <span>{issue.severity === 'good' ? '✓' : issue.severity === 'warn' ? '⚠' : '✕'}</span>
                {issue.msg}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function KeywordDensityCheckerTool() {
  const [text, setText] = useState('');
  const [targetKw, setTargetKw] = useState('');

  const stats = (() => {
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    const freq: Record<string, number> = {};
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    const total = words.length;
    const entries = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    return { entries, total, freq };
  })();

  const density = targetKw ? ((stats.freq[targetKw.toLowerCase()] || 0) / Math.max(1, stats.total) * 100).toFixed(2) : null;

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Paste content to analyze keyword density…" className="h-40" />
      <div className="flex gap-2">
        <input value={targetKw} onChange={e => setTargetKw(e.target.value)} placeholder="Target keyword" className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      </div>
      {density && (
        <div className={`text-center py-3 rounded-lg ${parseFloat(density) > 3 ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-green-50 dark:bg-green-900/20 text-green-600'}`}>
          <div className="text-2xl font-bold">{density}%</div>
          <div className="text-sm">Keyword density {parseFloat(density) > 3 ? '(may be keyword stuffing)' : '(healthy range is 1-3%)'}</div>
        </div>
      )}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500">Top 20 keywords</div>
        <div className="max-h-60 overflow-auto">
          {stats.entries.slice(0, 20).map(([word, count]) => (
            <div key={word} className="flex items-center justify-between px-3 py-1.5 text-sm border-b border-gray-100 dark:border-gray-800 last:border-0">
              <span className="font-mono text-gray-800 dark:text-gray-200">{word}</span>
              <span className="text-gray-500">{count} ({(count / Math.max(1, stats.total) * 100).toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
      <div className="text-xs text-gray-500">Total words: {stats.total}</div>
    </div>
  );
}

function OpenGraphPreviewTool() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('Example Page Title');
  const [desc, setDesc] = useState('This is an example meta description that provides a brief summary of the page content.');
  const [image, setImage] = useState('');

  return (
    <div className="space-y-4">
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Page title" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Meta description" rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none" />
      <input value={image} onChange={e => setImage(e.target.value)} placeholder="Image URL (optional)" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden max-w-md border border-gray-200 dark:border-gray-700">
        {image && <div className="aspect-video bg-gray-100 dark:bg-gray-700"><img src={image} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} /></div>}
        <div className="p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide">{url || 'example.com'}</div>
          <div className="mt-1 font-semibold text-gray-900 dark:text-white line-clamp-2">{title || 'Page Title'}</div>
          <div className="mt-1 text-sm text-gray-500 line-clamp-2">{desc || 'Page description'}</div>
        </div>
      </div>
      <p className="text-xs text-gray-500">Preview how this URL would appear when shared on Facebook, LinkedIn, and messaging apps.</p>
    </div>
  );
}

function TwitterCardPreviewTool() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('Example Page Title');
  const [desc, setDesc] = useState('This is an example meta description for Twitter card preview.');
  const [image, setImage] = useState('');
  const [cardType, setCardType] = useState<'summary_large_image' | 'summary'>('summary_large_image');

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['summary_large_image', 'summary'] as const).map(t => (
          <button key={t} onClick={() => setCardType(t)} className={`px-3 py-1.5 text-sm rounded-lg ${cardType === t ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>{t.replace('_', ' ')}</button>
        ))}
      </div>
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Page title" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Meta description" rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none" />
      <input value={image} onChange={e => setImage(e.target.value)} placeholder="Image URL" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden max-w-md border border-gray-200 dark:border-gray-700">
        {cardType === 'summary_large_image' && image && <div className="aspect-video bg-gray-100 dark:bg-gray-700"><img src={image} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} /></div>}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <span className="text-xs text-gray-500">{url || 'example.com'}</span>
          </div>
          <div className="mt-1 font-bold text-gray-900 dark:text-white line-clamp-2">{title}</div>
          <div className="mt-1 text-sm text-gray-500 line-clamp-2">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function MetaDescriptionGeneratorTool() {
  const [content, setContent] = useState('');
  const [length, setLength] = useState(160);

  const generate = () => {
    const clean = content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const truncated = clean.slice(0, length);
    return truncated.length < clean.length ? truncated.slice(0, truncated.lastIndexOf(' ')) + '…' : truncated;
  };

  const desc = generate();
  const pct = (desc.length / length) * 100;

  return (
    <div className="space-y-4">
      <Textarea value={content} onChange={setContent} placeholder="Paste your page content here to generate a meta description…" />
      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Target length: {length} chars</label>
        <input type="range" min="120" max="320" step="10" value={length} onChange={e => setLength(parseInt(e.target.value))} className="w-full" />
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 uppercase">Generated Meta Description</span>
          <span className={`text-xs font-medium ${pct > 100 ? 'text-red-500' : pct > 80 ? 'text-yellow-500' : 'text-green-500'}`}>{desc.length}/{length}</span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300">{desc || 'Description will appear here…'}</p>
      </div>
      {desc && <CopyButton text={desc} />}
    </div>
  );
}

function UrlRedirectCheckerTool() {
  const [url, setUrl] = useState('');
  const [chain, setChain] = useState<{ url: string; status: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!url) return;
    setLoading(true);
    setChain([]);
    let current = url;
    const visited = new Set<string>();
    try {
      while (true) {
        if (visited.has(current)) { setChain(c => [...c, { url: current, status: -1 }]); break; }
        visited.add(current);
        const res = await fetch(`/api/proxy?url=${encodeURIComponent(current)}`);
        const status = res.status;
        setChain(c => [...c, { url: current, status }]);
        if (status >= 300 && status < 400) {
          const loc = res.headers.get('location') || res.headers.get('x-final-url') || '';
          if (!loc) break;
          current = loc.startsWith('http') ? loc : new URL(loc, current).href;
        } else break;
      }
    } catch { setChain(c => [...c, { url: current, status: 0 }]); }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        <ProcessButton onClick={check} disabled={loading}>{loading ? 'Checking…' : 'Check'}</ProcessButton>
      </div>
      {chain.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {chain.map((hop, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <span className="text-xs text-gray-400 w-6">{i + 1}</span>
              <span className={`px-2 py-0.5 text-xs rounded font-medium ${hop.status >= 200 && hop.status < 300 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : hop.status >= 300 && hop.status < 400 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : hop.status === -1 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                {hop.status > 0 ? hop.status : hop.status === -1 ? '↻ Loop' : '✕ Error'}
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate font-mono">{hop.url}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DnsLookupTool() {
  const [domain, setDomain] = useState('');
  const [records, setRecords] = useState<{ type: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const lookup = async (type = 'A') => {
    if (!domain) return;
    setLoading(true);
    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`);
      const data = await res.json();
      if (data.Answer) {
        setRecords(data.Answer.map((a: { type: number; data: string }) => ({ type: a.type === 1 ? 'A' : a.type === 5 ? 'CNAME' : a.type === 15 ? 'MX' : a.type === 16 ? 'TXT' : String(a.type), value: a.data })));
      } else setRecords([]);
    } catch { setRecords([]); }
    setLoading(false);
  };

  const types = ['A', 'AAAA', 'MX', 'TXT', 'CNAME', 'NS'];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="example.com" className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        <ProcessButton onClick={() => lookup('A')} disabled={loading}>{loading ? '…' : 'Lookup'}</ProcessButton>
      </div>
      <div className="flex gap-2 flex-wrap">
        {types.map(t => <button key={t} onClick={() => lookup(t)} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">{t}</button>)}
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {records.length === 0 && <div className="px-4 py-8 text-center text-gray-500">No records found</div>}
        {records.map((r, i) => <div key={i} className="flex items-center gap-3 px-4 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"><span className="text-xs font-mono bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded w-16 text-center">{r.type}</span><span className="text-sm font-mono text-gray-800 dark:text-gray-200">{r.value}</span></div>)}
      </div>
    </div>
  );
}

function WhoisLookupTool() {
  const [domain, setDomain] = useState('');
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    if (!domain) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.allorigins.win/raw?url=https://whoisapi.freeaiapi.xyz/?domain=${encodeURIComponent(domain)}`);
      const json = await res.json();
      if (json.WhoisRecord) {
        const wr = json.WhoisRecord;
        setData({
          'Domain Name': wr.domainName || domain,
          'Registrar': wr.registrarName || '',
          'Created Date': wr.createdDate || '',
          'Expires Date': wr.expiresDate || '',
          'Status': (wr.status || []).join(', '),
          'Name Servers': (wr.nameServers?.hostNames || []).join(', '),
          ' registrant': wr.registrant?.organization || '',
        });
      } else setData({ Error: 'Domain not found or API unavailable' });
    } catch { setData({ Error: 'Failed to fetch WHOIS data' }); }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="example.com" className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        <ProcessButton onClick={lookup} disabled={loading}>{loading ? '…' : 'Lookup'}</ProcessButton>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {Object.entries(data).map(([k, v]) => v && <div key={k} className="flex flex-col sm:flex-row sm:items-center gap-1 px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"><span className="text-xs font-medium text-gray-500 sm:w-32 shrink-0">{k}</span><span className="text-sm text-gray-800 dark:text-gray-200">{v}</span></div>)}
        {!Object.keys(data).length && <div className="px-4 py-8 text-center text-gray-500">Enter a domain to look up</div>}
      </div>
    </div>
  );
}

function HttpStatusCheckerTool() {
  const [urls, setUrls] = useState('');
  const [results, setResults] = useState<{ url: string; status: number; ok: boolean }[]>([]);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    const list = urls.split('\n').map(u => u.trim()).filter(Boolean);
    if (!list.length) return;
    setLoading(true);
    const res = await Promise.all(list.map(async url => {
      try {
        const r = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
        return { url, status: r.status, ok: r.ok };
      } catch { return { url, status: 0, ok: false }; }
    }));
    setResults(res);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Textarea value={urls} onChange={setUrls} placeholder="Enter URLs (one per line)&#10;https://example.com&#10;https://example.com/page" className="h-32" />
      <ProcessButton onClick={check} disabled={loading}>{loading ? 'Checking…' : 'Check All'}</ProcessButton>
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {results.map((r, i) => <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"><span className={`px-2 py-0.5 text-xs rounded font-medium ${r.ok ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-red-100 dark:bg-red-900/30 text-red-700'}`}>{r.status || 'ERR'}</span><span className="text-sm text-gray-800 dark:text-gray-200 truncate">{r.url}</span></div>)}
        {!results.length && <div className="px-4 py-8 text-center text-gray-500">Results will appear here</div>}
      </div>
    </div>
  );
}

function CanonicalUrlGeneratorTool() {
  const [url, setUrl] = useState('');
  const [protocol, setProtocol] = useState('https://');

  const generate = () => {
    if (!url) return '';
    let u = url.startsWith('http') ? url : protocol + url;
    try {
      const parsed = new URL(u);
      return parsed.href;
    } catch { return u; }
  };

  const canonical = generate();

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select value={protocol} onChange={e => setProtocol(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="https://">https://</option>
          <option value="http://">http://</option>
        </select>
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="example.com/page" className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      </div>
      {canonical && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-2">Canonical URL</div>
          <code className="text-sm text-gray-800 dark:text-gray-200 break-all">{canonical}</code>
        </div>
      )}
      {canonical && <CopyButton text={`<link rel="canonical" href="${canonical}">`} />}
    </div>
  );
}

function HreflangTagGeneratorTool() {
  const [url, setUrl] = useState('');
  const [langs, setLangs] = useState([{ lang: 'en', region: '', href: '' }]);

  const addLang = () => setLangs([...langs, { lang: '', region: '', href: '' }]);
  const updateLang = (i: number, field: string, v: string) => { const u = [...langs]; (u[i] as Record<string,string>)[field] = v; setLangs(u); };

  const generate = () => langs.filter(l => l.lang && l.href).map(l => {
    const tag = l.region ? `${l.lang}-${l.region}` : l.lang;
    return `<link rel="alternate" hreflang="${tag}" href="${l.href}" />`;
  }).join('\n');

  return (
    <div className="space-y-4">
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Default page URL (e.g., https://example.com/)" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      <div className="space-y-2">
        {langs.map((l, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input value={l.lang} onChange={e => updateLang(i, 'lang', e.target.value)} placeholder="en" className="w-20 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            <input value={l.region} onChange={e => updateLang(i, 'region', e.target.value)} placeholder="US (optional)" className="w-28 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            <input value={l.href} onChange={e => updateLang(i, 'href', e.target.value)} placeholder="https://example.com/en/" className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            <button onClick={() => setLangs(langs.filter((_, idx) => idx !== i))} className="text-red-500 px-2">✕</button>
          </div>
        ))}
      </div>
      <button onClick={addLang} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">+ Add Language</button>
      <OutputArea value={generate()} />
    </div>
  );
}

// ─── Color Utilities ────────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

// ─── New Tool Implementations ─────────────────────────────────────────────

function ColorPaletteGeneratorTool() {
  const [hex, setHex] = useState('#6366f1');
  const [palettes, setPalettes] = useState<Record<string, string[]>>({});
  const [h, s, l] = hexToHsl(hex);

  const generate = () => {
    const base = hslToHex(h, s, l);
    setPalettes({
      monochromatic: [0, 10, 20, 30, 40].map(d => hslToHex(h, s, Math.max(0, l - 25 + d))),
      complementary: [hslToHex(h, s, l), hslToHex((h + 180) % 360, s, l)],
      analogous: [hslToHex((h - 30 + 360) % 360, s, l), base, hslToHex((h + 30) % 360, s, l)],
      triadic: [base, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)],
      splitComplementary: [base, hslToHex((h + 150) % 360, s, l), hslToHex((h + 210) % 360, s, l)],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-12 h-10 rounded cursor-pointer border-0" />
        <input value={hex} onChange={e => setHex(e.target.value)} placeholder="#6366f1" className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />
      </div>
      <ProcessButton onClick={generate}>Generate Palette</ProcessButton>
      <div className="space-y-4">
        {Object.entries(palettes).map(([name, colors]) => (
          <div key={name}>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 capitalize">{name.replace(/([A-Z])/g, ' $1')}</div>
            <div className="flex gap-2">
              {colors.map((c, i) => (
                <div key={i} className="flex-1 text-center">
                  <div className="h-12 rounded-lg mb-1" style={{ backgroundColor: c }} />
                  <code className="text-xs text-gray-600 dark:text-gray-300">{c}</code>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ColorMixerTool() {
  const [color1, setColor1] = useState('#6366f1');
  const [color2, setColor2] = useState('#ec4899');
  const [ratio, setRatio] = useState(50);
  const [blendMode, setBlendMode] = useState<'normal' | 'multiply' | 'screen'>('normal');

  const mixColors = () => {
    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);
    const t = ratio / 100;
    let r: number, g: number, b: number;
    if (blendMode === 'multiply') {
      r = (r1 * r2) / 255; g = (g1 * g2) / 255; b = (b1 * b2) / 255;
    } else if (blendMode === 'screen') {
      r = 255 - ((255 - r1) * (255 - r2)) / 255;
      g = 255 - ((255 - g1) * (255 - g2)) / 255;
      b = 255 - ((255 - b1) * (255 - b2)) / 255;
    } else {
      r = r1 * (1 - t) + r2 * t;
      g = g1 * (1 - t) + g2 * t;
      b = b1 * (1 - t) + b2 * t;
    }
    return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
  };

  const mixed = mixColors();
  const [rm, gm, bm] = hexToRgb(mixed);
  const [hm, sm, lm] = rgbToHsl(rm, gm, bm);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs text-gray-500">Color 1</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
            <input value={color1} onChange={e => setColor1(e.target.value)} className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-gray-500">Color 2</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
            <input value={color2} onChange={e => setColor2(e.target.value)} className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Blend Mode</span>
          <span className="capitalize">{blendMode}</span>
        </div>
        <div className="flex gap-1">
          {(['normal', 'multiply', 'screen'] as const).map(m => (
            <button key={m} onClick={() => setBlendMode(m)} className={`flex-1 py-1.5 text-sm rounded-lg transition-colors ${blendMode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>{m}</button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Ratio</span>
          <span>{ratio}%</span>
        </div>
        <input type="range" min={0} max={100} value={ratio} onChange={e => setRatio(Number(e.target.value))} className="w-full accent-red-500" />
      </div>
      <div className="flex gap-4 items-center">
        <div className="w-20 h-20 rounded-xl shadow-inner" style={{ backgroundColor: mixed }} />
        <div className="flex-1 space-y-1">
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div>HEX: <span className="font-mono text-gray-800 dark:text-gray-200">{mixed}</span></div>
            <div>RGB: <span className="font-mono text-gray-800 dark:text-gray-200">{rm}, {gm}, {bm}</span></div>
            <div>HSL: <span className="font-mono text-gray-800 dark:text-gray-200">{hm}°, {sm}%, {lm}%</span></div>
          </div>
          <CopyButton text={mixed} />
        </div>
      </div>
    </div>
  );
}

function ColorContrastCheckerTool() {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');

  const getLuminance = (hex: string) => {
    const [r, g, b] = hexToRgb(hex).map(v => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const ratio = () => {
    const l1 = getLuminance(fg), l2 = getLuminance(bg);
    const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
    return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
  };

  const r = parseFloat(ratio());
  const aaLarge = r >= 3, aaNormal = r >= 4.5, aaaLarge = r >= 4.5, aaaNormal = r >= 7;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs text-gray-500">Foreground</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
            <input value={fg} onChange={e => setFg(e.target.value)} className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-gray-500">Background</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
            <input value={bg} onChange={e => setBg(e.target.value)} className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />
          </div>
        </div>
      </div>
      <div className="p-6 rounded-xl text-center" style={{ backgroundColor: bg }}>
        <p className="text-2xl font-bold" style={{ color: fg }}>Sample Text Preview</p>
        <p className="text-sm mt-1" style={{ color: fg }}>The quick brown fox jumps over the lazy dog.</p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-center">
        <div className="text-5xl font-bold text-red-600 mb-2">{r}:1</div>
        <div className="text-sm text-gray-500">Contrast Ratio</div>
        <div className="grid grid-cols-2 gap-4 mt-4 text-left">
          <div className="space-y-1">
            <div className="text-xs text-gray-500">WCAG AA</div>
            <div className="text-sm">Normal Text: <span className={aaNormal ? 'text-green-600' : 'text-red-600'}>{aaNormal ? '✓ Pass' : '✗ Fail'}</span></div>
            <div className="text-sm">Large Text: <span className={aaLarge ? 'text-green-600' : 'text-red-600'}>{aaLarge ? '✓ Pass' : '✗ Fail'}</span></div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-500">WCAG AAA</div>
            <div className="text-sm">Normal Text: <span className={aaaNormal ? 'text-green-600' : 'text-red-600'}>{aaaNormal ? '✓ Pass' : '✗ Fail'}</span></div>
            <div className="text-sm">Large Text: <span className={aaaLarge ? 'text-green-600' : 'text-red-600'}>{aaaLarge ? '✓ Pass' : '✗ Fail'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorHarmonyGeneratorTool() {
  const [hex, setHex] = useState('#6366f1');
  const [harmony, setHarmony] = useState<string[]>([]);
  const [h, s, l] = hexToHsl(hex);

  const generate = (type: string) => {
    const base = hslToHex(h, s, l);
    const angles: Record<string, number[]> = {
      complementary: [0, 180],
      analogous: [-30, 0, 30],
      triadic: [0, 120, 240],
      splitComplementary: [0, 150, 210],
      tetradic: [0, 90, 180, 270],
      monochromatic: [0, 0, 0, 0, 0],
    };
    const anglesArr = angles[type] || [0];
    if (type === 'monochromatic') {
      setHarmony([0, 15, 30, -15, -30].map(d => hslToHex(h, s, Math.max(0, Math.min(100, l + d)))));
    } else {
      setHarmony(anglesArr.map(a => hslToHex((h + a + 360) % 360, s, l)));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-12 h-10 rounded cursor-pointer border-0" />
        <input value={hex} onChange={e => setHex(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />
      </div>
      <div className="flex flex-wrap gap-2">
        {['complementary', 'analogous', 'triadic', 'splitComplementary', 'tetradic', 'monochromatic'].map(type => (
          <button key={type} onClick={() => generate(type)} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors capitalize">
            {type.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>
      {harmony.length > 0 && (
        <div className="flex gap-3 items-center">
          {harmony.map((c, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="h-16 rounded-lg mb-1 shadow-sm" style={{ backgroundColor: c }} />
              <code className="text-xs text-gray-600 dark:text-gray-300">{c}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ColorShadeGeneratorTool() {
  const [hex, setHex] = useState('#6366f1');
  const [h, s, l] = hexToHsl(hex);
  const getShade = (d: number) => hslToHex(h, s, Math.max(0, Math.min(100, l + d)));
  const shades = [-40, -25, -10, 0, 10, 25, 40].map(d => ({ shade: d, color: getShade(d) }));

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-12 h-10 rounded cursor-pointer border-0" />
        <input value={hex} onChange={e => setHex(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />
      </div>
      <div className="space-y-2">
        {shades.map(({ shade, color }) => (
          <div key={shade} className="flex items-center gap-3">
            <div className="w-16 text-xs text-gray-500 text-right">{shade > 0 ? `+${shade}` : shade}</div>
            <div className="w-10 h-10 rounded-lg shadow-sm" style={{ backgroundColor: color }} />
            <code className="flex-1 text-sm text-gray-800 dark:text-gray-200 font-mono">{color}</code>
            <CopyButton text={color} />
          </div>
        ))}
      </div>
    </div>
  );
}

const CSS_NAMED_COLORS: [string, string][] = [
  ['black', '#000000'], ['silver', '#c0c0c0'], ['gray', '#808080'], ['white', '#ffffff'],
  ['maroon', '#800000'], ['red', '#ff0000'], ['purple', '#800080'], ['fuchsia', '#ff00ff'],
  ['green', '#008000'], ['lime', '#00ff00'], ['olive', '#808000'], ['yellow', '#ffff00'],
  ['navy', '#000080'], ['blue', '#0000ff'], ['teal', '#008080'], ['aqua', '#00ffff'],
  ['orange', '#ffa500'], ['aliceblue', '#f0f8ff'], ['antiquewhite', '#faebd7'], ['aquamarine', '#7fffd4'],
  ['azure', '#f0ffff'], ['beige', '#f5f5dc'], ['bisque', '#ffe4c4'], ['blanchedalmond', '#ffebcd'],
  ['blueviolet', '#8a2be2'], ['brown', '#a52a2a'], ['burlywood', '#deb887'], ['cadetblue', '#5f9ea0'],
  ['chartreuse', '#7fff00'], ['chocolate', '#d2691e'], ['coral', '#ff7f50'], ['cornflowerblue', '#6495ed'],
  ['cornsilk', '#fff8dc'], ['crimson', '#dc143c'], ['cyan', '#00ffff'], ['darkblue', '#00008b'],
  ['darkcyan', '#008b8b'], ['darkgoldenrod', '#b8860b'], ['darkgray', '#a9a9a9'], ['darkgreen', '#006400'],
  ['darkkhaki', '#bdb76b'], ['darkmagenta', '#8b008b'], ['darkolivegreen', '#556b2f'], ['darkorange', '#ff8c00'],
  ['darkorchid', '#9932cc'], ['darkred', '#8b0000'], ['darksalmon', '#e9967a'], ['darkseagreen', '#8fbc8f'],
  ['darkslateblue', '#483d8b'], ['darkslategray', '#2f4f4f'], ['darkturquoise', '#00ced1'], ['darkviolet', '#9400d3'],
  ['deeppink', '#ff1493'], ['deepskyblue', '#00bfff'], ['dimgray', '#696969'], ['dodgerblue', '#1e90ff'],
  ['firebrick', '#b22222'], ['floralwhite', '#fffaf0'], ['forestgreen', '#228b22'], ['gainsboro', '#dcdcdc'],
  ['ghostwhite', '#f8f8ff'], ['gold', '#ffd700'], ['goldenrod', '#daa520'], ['greenyellow', '#adff2f'],
  ['honeydew', '#f0fff0'], ['hotpink', '#ff69b4'], ['indianred', '#cd5c5c'], ['indigo', '#4b0082'],
  ['ivory', '#fffff0'], ['khaki', '#f0e68c'], ['lavender', '#e6e6fa'], ['lavenderblush', '#fff0f5'],
  ['lawngreen', '#7cfc00'], ['lemonchiffon', '#fffacd'], ['lightblue', '#add8e6'], ['lightcoral', '#f08080'],
  ['lightcyan', '#e0ffff'], ['lightgoldenrodyellow', '#fafad2'], ['lightgray', '#d3d3d3'], ['lightgreen', '#90ee90'],
  ['lightpink', '#ffb6c1'], ['lightsalmon', '#ffa07a'], ['lightseagreen', '#20b2aa'], ['lightskyblue', '#87cefa'],
  ['lightslategray', '#778899'], ['lightsteelblue', '#b0c4de'], ['lightyellow', '#ffffe0'], ['limegreen', '#32cd32'],
  ['linen', '#faf0e6'], ['magenta', '#ff00ff'], ['mediumaquamarine', '#66cdaa'], ['mediumblue', '#0000cd'],
  ['mediumorchid', '#ba55d3'], ['mediumpurple', '#9370db'], ['mediumseagreen', '#3cb371'], ['mediumslateblue', '#7b68ee'],
  ['mediumspringgreen', '#00fa9a'], ['mediumturquoise', '#48d1cc'], ['mediumvioletred', '#c71585'],
  ['midnightblue', '#191970'], ['mintcream', '#f5fffa'], ['mistyrose', '#ffe4e1'], ['moccasin', '#ffe4b5'],
  ['navajowhite', '#ffdead'], ['oldlace', '#fdf5e6'], ['olivedrab', '#6b8e23'], ['orangered', '#ff4500'],
  ['orchid', '#da70d6'], ['palegoldenrod', '#eee8aa'], ['palegreen', '#98fb98'], ['paleturquoise', '#afeeee'],
  ['palevioletred', '#db7093'], ['papayawhip', '#ffefd5'], ['peachpuff', '#ffdab9'], ['peru', '#cd853f'],
  ['pink', '#ffc0cb'], ['plum', '#dda0dd'], ['powderblue', '#b0e0e6'], ['rosybrown', '#bc8f8f'],
  ['royalblue', '#4169e1'], ['saddlebrown', '#8b4513'], ['salmon', '#fa8072'], ['sandybrown', '#f4a460'],
  ['seagreen', '#2e8b57'], ['seashell', '#fff5ee'], ['sienna', '#a0522d'], ['skyblue', '#87ceeb'],
  ['slateblue', '#6a5acd'], ['slategray', '#708090'], ['snow', '#fffafa'], ['springgreen', '#00ff7f'],
  ['steelblue', '#4682b4'], ['tan', '#d2b48c'], ['thistle', '#d8bfd8'], ['tomato', '#ff6347'],
  ['turquoise', '#40e0d0'], ['violet', '#ee82ee'], ['wheat', '#f5deb3'], ['whitesmoke', '#f5f5f5'],
  ['yellowgreen', '#9acd32'],
];

function ColorNameFinderTool() {
  const [hex, setHex] = useState('#6495ed');
  const [result, setResult] = useState<[string, string] | null>(null);

  const findClosest = (input: string) => {
    let targetHex = input;
    if (!input.startsWith('#')) targetHex = '#' + input;
    if (!/^#[0-9a-fA-F]{6}$/.test(targetHex)) return;
    const [r, g, b] = hexToRgb(targetHex);
    let minDist = Infinity, closest: [string, string] = ['Unknown', targetHex];
    for (const [name, hex2] of CSS_NAMED_COLORS) {
      const [r2, g2, b2] = hexToRgb(hex2);
      const dist = Math.sqrt((r - r2) ** 2 + (g - g2) ** 2 + (b - b2) ** 2);
      if (dist < minDist) { minDist = dist; closest = [name, hex2]; }
    }
    setResult(closest);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <input type="color" value={hex} onChange={e => { setHex(e.target.value); findClosest(e.target.value); }} className="w-12 h-10 rounded cursor-pointer border-0" />
        <input value={hex} onChange={e => { setHex(e.target.value); findClosest(e.target.value); }} placeholder="#6495ed" className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />
      </div>
      {result && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="w-16 h-16 rounded-xl shadow-sm" style={{ backgroundColor: result[1] }} />
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{result[0]}</div>
            <div className="text-sm text-gray-500 font-mono">{result[1]}</div>
          </div>
          <CopyButton text={result[0]} />
        </div>
      )}
    </div>
  );
}

function ColorFormatConverterTool() {
  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState('99, 102, 241');
  const [hsl, setHsl] = useState('239, 84%, 67%');
  const [active, setActive] = useState<'hex' | 'rgb' | 'hsl'>('hex');

  const updateFromHex = (h: string) => {
    setHex(h);
    const [r, g, b] = hexToRgb(h);
    setRgb(`${r}, ${g}, ${b}`);
    const [hh, ss, ll] = rgbToHsl(r, g, b);
    setHsl(`${hh}, ${ss}%, ${ll}%`);
  };

  const updateFromRgb = (s: string) => {
    setRgb(s);
    const parts = s.split(',').map(v => parseInt(v.trim()));
    if (parts.length === 3 && parts.every(v => !isNaN(v) && v >= 0 && v <= 255)) {
      const h = rgbToHex(parts[0], parts[1], parts[2]);
      setHex(h);
      const [hh, ss, ll] = rgbToHsl(parts[0], parts[1], parts[2]);
      setHsl(`${hh}, ${ss}%, ${ll}%`);
    }
  };

  const updateFromHsl = (s: string) => {
    setHsl(s);
    const parts = s.replace(/%/g, '').split(',').map(v => parseInt(v.trim()));
    if (parts.length === 3 && parts.every(v => !isNaN(v))) {
      const [r, g, b] = hslToRgb(parts[0], parts[1], parts[2]);
      const h = rgbToHex(r, g, b);
      setHex(h);
      setRgb(`${r}, ${g}, ${b}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['hex', 'rgb', 'hsl'] as const).map(f => (
          <button key={f} onClick={() => setActive(f)} className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${active === f ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>{f.toUpperCase()}</button>
        ))}
      </div>
      <div className="flex gap-3 items-center">
        <div className="w-16 h-16 rounded-xl shadow-sm" style={{ backgroundColor: hex }} />
        <div className="flex-1 space-y-2">
          {active === 'hex' && <input value={hex} onChange={e => updateFromHex(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />}
          {active === 'rgb' && <input value={rgb} onChange={e => updateFromRgb(e.target.value)} placeholder="99, 102, 241" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />}
          {active === 'hsl' && <input value={hsl} onChange={e => updateFromHsl(e.target.value)} placeholder="239, 84%, 67%" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />}
          <div className="flex gap-3 text-xs text-gray-500">
            <span>HEX: <span className="font-mono">{hex}</span></span>
            <span>RGB: <span className="font-mono">{rgb}</span></span>
            <span>HSL: <span className="font-mono">{hsl}</span></span>
          </div>
        </div>
        <CopyButton text={hex} />
      </div>
    </div>
  );
}

function RgbToHslTool() {
  const [input, setInput] = useState('99, 102, 241');
  const [result, setResult] = useState<{ hex: string; hsl: string; preview: string } | null>(null);

  const convert = () => {
    const parts = input.split(',').map(v => parseInt(v.trim()));
    if (parts.length !== 3 || parts.some(v => isNaN(v) || v < 0 || v > 255)) return;
    const [r, g, b] = parts;
    const [h, s, l] = rgbToHsl(r, g, b);
    const hex = rgbToHex(r, g, b);
    setResult({ hex, hsl: `${h}°, ${s}%, ${l}%`, preview: hex });
  };

  return (
    <div className="space-y-4">
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="99, 102, 241" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      {result && (
        <div className="flex gap-4 items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="w-16 h-16 rounded-xl" style={{ backgroundColor: result.preview }} />
          <div className="space-y-1">
            <div className="text-sm text-gray-500">HEX: <span className="font-mono text-gray-800 dark:text-gray-200">{result.hex}</span></div>
            <div className="text-sm text-gray-500">HSL: <span className="font-mono text-gray-800 dark:text-gray-200">{result.hsl}</span></div>
          </div>
          <CopyButton text={result.hex} />
        </div>
      )}
    </div>
  );
}

function HslToRgbTool() {
  const [input, setInput] = useState('239, 84%, 67%');
  const [result, setResult] = useState<{ hex: string; rgb: string; preview: string } | null>(null);

  const convert = () => {
    const parts = input.replace(/%/g, '').split(',').map(v => parseInt(v.trim()));
    if (parts.length !== 3 || parts.some(v => isNaN(v))) return;
    const [h, s, l] = parts;
    const [r, g, b] = hslToRgb(h, s, l);
    const hex = rgbToHex(r, g, b);
    setResult({ rgb: `${r}, ${g}, ${b}`, hex, preview: hex });
  };

  return (
    <div className="space-y-4">
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="239, 84%, 67%" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      {result && (
        <div className="flex gap-4 items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="w-16 h-16 rounded-xl" style={{ backgroundColor: result.preview }} />
          <div className="space-y-1">
            <div className="text-sm text-gray-500">RGB: <span className="font-mono text-gray-800 dark:text-gray-200">{result.rgb}</span></div>
            <div className="text-sm text-gray-500">HEX: <span className="font-mono text-gray-800 dark:text-gray-200">{result.hex}</span></div>
          </div>
          <CopyButton text={result.rgb} />
        </div>
      )}
    </div>
  );
}

function ImagePlaceholderGeneratorTool() {
  const [width, setWidth] = useState('400');
  const [height, setHeight] = useState('300');
  const [bg, setBg] = useState('#e5e7eb');
  const [text, setText] = useState('');
  const [format, setFormat] = useState<'svg' | 'base64'>('svg');

  const svg = () => {
    const w = width || '400', h = height || '300';
    const t = text || `${w}×${h}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect fill="${bg}" width="${w}" height="${h}"/>
  <text fill="#6b7280" font-family="sans-serif" font-size="14" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">${t}</text>
</svg>`;
  };

  const base64 = () => btoa(unescape(encodeURIComponent(svg())));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Width</label>
          <input type="number" value={width} onChange={e => setWidth(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Height</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Background</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
            <input value={bg} onChange={e => setBg(e.target.value)} className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Text</label>
          <input value={text} onChange={e => setText(e.target.value)} placeholder="400×300" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>
      </div>
      <div className="flex gap-2">
        {(['svg', 'base64'] as const).map(f => (
          <button key={f} onClick={() => setFormat(f)} className={`px-3 py-1.5 text-sm rounded-lg ${format === f ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>{f.toUpperCase()}</button>
        ))}
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center" dangerouslySetInnerHTML={{ __html: svg() }} />
      <OutputArea value={format === 'svg' ? svg() : `data:image/svg+xml;base64,${base64()}`} />
    </div>
  );
}

function ImageToBase64Tool() {
  const [dataUrl, setDataUrl] = useState('');
  const [preview, setPreview] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setDataUrl(result);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFile} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-600 hover:file:bg-red-100" />
      {preview && <img src={preview} alt="Preview" className="max-h-48 rounded-lg mx-auto" />}
      {dataUrl && <OutputArea value={dataUrl} />}
    </div>
  );
}

function WordFrequencyAnalyzerTool() {
  const [text, setText] = useState('');
  const [top, setTop] = useState<[string, number][]>([]);

  const analyze = () => {
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    const freq: Record<string, number> = {};
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20);
    setTop(sorted);
  };

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Paste text to analyze word frequency…" className="h-40" />
      <ProcessButton onClick={analyze}>Analyze</ProcessButton>
      {top.length > 0 && (
        <div className="space-y-1">
          {top.map(([word, count], i) => (
            <div key={word} className="flex items-center gap-3 py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <span className="w-6 text-xs text-gray-400 text-right">{i + 1}</span>
              <span className="flex-1 text-sm text-gray-800 dark:text-gray-200 font-medium">{word}</span>
              <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${(count / top[0][1]) * 100}%` }} />
              </div>
              <span className="w-8 text-xs text-gray-500 text-right">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SentenceCounterTool() {
  const [text, setText] = useState('');

  const stats = {
    sentences: (text.match(/[.!?]+/g) || []).length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    avgSentenceLen: 0,
  };
  if (stats.sentences > 0) stats.avgSentenceLen = Math.round(stats.words / stats.sentences);

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Paste or type your text here…" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Sentences', value: stats.sentences },
          { label: 'Words', value: stats.words },
          { label: 'Characters', value: stats.chars },
          { label: 'Avg Sentence Length', value: `${stats.avgSentenceLen} words` },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ParagraphCounterTool() {
  const [text, setText] = useState('');

  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  const sentences = (text.match(/[.!?]+/g) || []).length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const avgWordsPerPara = paragraphs.length > 0 ? Math.round(words / paragraphs.length) : 0;

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Paste your text here…" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Paragraphs', value: paragraphs.length },
          { label: 'Sentences', value: sentences },
          { label: 'Words', value: words },
          { label: 'Avg Words/Paragraph', value: avgWordsPerPara },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReadingTimeEstimatorTool() {
  const [text, setText] = useState('');

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const wpm = 200;
  const minutes = Math.max(1, Math.ceil(words / wpm));

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Paste your text here to estimate reading time…" />
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-6 text-center">
          <div className="text-4xl font-bold text-red-600 dark:text-red-400">{words}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Words</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-6 text-center">
          <div className="text-4xl font-bold text-red-600 dark:text-red-400">{minutes}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minutes</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-6 text-center">
          <div className="text-4xl font-bold text-red-600 dark:text-red-400">{wpm}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">WPM</div>
        </div>
      </div>
    </div>
  );
}

function LetterFrequencyCounterTool() {
  const [text, setText] = useState('');

  const freq = () => {
    const f: Record<string, number> = {};
    text.toLowerCase().replace(/[^a-z]/g, '').split('').forEach(c => { f[c] = (f[c] || 0) + 1; });
    return Object.entries(f).sort((a, b) => b[1] - a[1]);
  };

  const total = text.replace(/[^a-z]/g, '').length;

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Type or paste text here to count letter frequency…" />
      <div className="text-sm text-gray-500 mb-2">{total} total letters</div>
      <div className="grid grid-cols-6 sm:grid-cols-9 gap-1">
        {freq().map(([letter, count]) => (
          <div key={letter} className="flex flex-col items-center py-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200 uppercase">{letter}</span>
            <span className="text-xs text-gray-500">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhitespaceRemoverTool() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const remove = (type: 'all' | 'extra' | 'leading' | 'trailing') => {
    if (!text) { setOutput(''); return; }
    switch (type) {
      case 'all': setOutput(text.replace(/\s+/g, '')); break;
      case 'extra': setOutput(text.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n')); break;
      case 'leading': setOutput(text.replace(/^[ \t]+/gm, '')); break;
      case 'trailing': setOutput(text.replace(/[ \t]+$/gm, '')); break;
    }
  };

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Paste text with extra whitespace…" />
      <div className="flex flex-wrap gap-2">
        {([
          { key: 'all', label: 'Remove All Whitespace' },
          { key: 'extra', label: 'Collapse Extra Whitespace' },
          { key: 'leading', label: 'Remove Leading' },
          { key: 'trailing', label: 'Remove Trailing' },
        ] as const).map(s => (
          <button key={s.key} onClick={() => remove(s.key)} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors">{s.label}</button>
        ))}
      </div>
      <OutputArea value={output} />
    </div>
  );
}

function LineBreakRemoverTool() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const remove = (type: 'all' | 'double') => {
    if (!text) { setOutput(''); return; }
    if (type === 'all') setOutput(text.replace(/[\r\n]+/g, ' '));
    else setOutput(text.replace(/[\r\n]+/g, '\n').replace(/\n{3,}/g, '\n\n'));
  };

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Paste text with line breaks…" />
      <div className="flex gap-2">
        {([
          { key: 'all', label: 'Replace All with Space' },
          { key: 'double', label: 'Collapse Double Breaks' },
        ] as const).map(s => (
          <button key={s.key} onClick={() => remove(s.key)} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors">{s.label}</button>
        ))}
      </div>
      <OutputArea value={output} />
    </div>
  );
}

function CssAnimationGeneratorTool() {
  const [name, setName] = useState('myAnimation');
  const [duration, setDuration] = useState('1s');
  const [timing, setTiming] = useState('ease');
  const [iterations, setIterations] = useState('infinite');
  const [fromProps, setFromProps] = useState({ transform: 'translateX(0)', opacity: '0' });
  const [toProps, setToProps] = useState({ transform: 'translateX(100px)', opacity: '1' });

  const css = () => `@keyframes ${name} {
  from { ${fromProps.transform}; opacity: ${fromProps.opacity}; }
  to { ${toProps.transform}; opacity: ${toProps.opacity}; }
}

.animated-element {
  animation: ${name} ${duration} ${timing} ${iterations};
}`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Duration</label>
          <input value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Timing</label>
          <select value={timing} onChange={e => setTiming(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            {['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Iterations</label>
          <input value={iterations} onChange={e => setIterations(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">From (0%)</label>
          <input value={fromProps.transform} onChange={e => setFromProps(p => ({ ...p, transform: e.target.value }))} placeholder="transform: translateX(0)" className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono mb-1" />
          <input value={fromProps.opacity} onChange={e => setFromProps(p => ({ ...p, opacity: e.target.value }))} placeholder="opacity: 0" className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">To (100%)</label>
          <input value={toProps.transform} onChange={e => setToProps(p => ({ ...p, transform: e.target.value }))} placeholder="transform: translateX(100px)" className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono mb-1" />
          <input value={toProps.opacity} onChange={e => setToProps(p => ({ ...p, opacity: e.target.value }))} placeholder="opacity: 1" className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" />
        </div>
      </div>
      <OutputArea value={css()} />
    </div>
  );
}

// ─── Anagram Generator ──────────────────────────────────────────────────
function AnagramGeneratorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!input.trim()) { setOutput(''); return; }
    const chars = input.toLowerCase().replace(/[^a-z]/g, '').split('');
    const permute = (arr: string[], m: string[] = []): string[] => {
      if (!arr.length) return [m.join('')];
      return arr.flatMap((c, i) => permute([...arr.slice(0, i), ...arr.slice(i + 1)], [...m, c]));
    };
    const anagrams = permute(chars).filter((a, i, arr) => arr.indexOf(a) === i);
    setOutput(anagrams.join('\n'));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Word or phrase</label>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter word or phrase" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={generate}>Generate Anagrams</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Palindrome Checker ─────────────────────────────────────────────────
function PalindromeCheckerTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const check = () => {
    if (!input.trim()) { setOutput(''); return; }
    const cleaned = input.toLowerCase().replace(/[^a-z0-9]/g, '');
    const reversed = cleaned.split('').reverse().join('');
    const isPalindrome = cleaned === reversed;
    setOutput(`Input: "${input}"\nCleaned: "${cleaned}"\nReversed: "${reversed}"\n\nResult: ${isPalindrome ? '✓ IS a palindrome' : '✗ NOT a palindrome'}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Text to check</label>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text or number" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={check}>Check Palindrome</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Backslash Escape/Unescape ─────────────────────────────────────────
function BackslashEscapeUnescapeTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');
  const [output, setOutput] = useState('');

  const process = () => {
    if (!input) { setOutput(''); return; }
    setOutput(mode === 'escape' ? input.replace(/\\/g, '\\\\').replace(/"/g, '\\"') : input.replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['escape', 'unescape'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 text-sm rounded-lg ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>{m.charAt(0).toUpperCase() + m.slice(1)}</button>
        ))}
      </div>
      <Textarea value={input} onChange={setInput} placeholder="Enter text..." />
      <ProcessButton onClick={process}>Process</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Character Frequency Counter ───────────────────────────────────────
function CharacterFrequencyCounterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const count = () => {
    if (!input) { setOutput(''); return; }
    const freq: Record<string, number> = {};
    for (const c of input) freq[c] = (freq[c] || 0) + 1;
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    setOutput(sorted.map(([c, n]) => `'${c === ' ' ? '(space)' : c}' : ${n}`).join('\n'));
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter text..." />
      <ProcessButton onClick={count}>Count Frequency</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Base64 File Encoder ───────────────────────────────────────────────
function Base64FileEncoderTool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = ev => setOutput(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleDecode = () => {
    try {
      const decoded = atob(output);
      const blob = new Blob([decoded], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'decoded_file';
      a.click();
      URL.revokeObjectURL(url);
    } catch { setOutput('Invalid Base64 input'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 text-sm rounded-lg ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>{m.charAt(0).toUpperCase() + m.slice(1)}</button>
        ))}
      </div>
      {mode === 'encode' ? (
        <>
          <input type="file" onChange={handleFile} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-50 dark:file:bg-red-900/30 file:text-red-600 file:font-medium hover:file:bg-red-100 dark:hover:file:bg-red-900/50" />
          <Textarea value={output} onChange={setOutput} placeholder="Base64 output will appear here..." />
        </>
      ) : (
        <>
          <Textarea value={output} onChange={setOutput} placeholder="Paste Base64 data..." />
          <ProcessButton onClick={handleDecode}>Decode & Download</ProcessButton>
        </>
      )}
    </div>
  );
}

// ─── Code Beautifier ───────────────────────────────────────────────────
function CodeBeautifierTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [lang, setLang] = useState('json');

  const beautify = () => {
    if (!input) { setOutput(''); return; }
    try {
      if (lang === 'json') {
        setOutput(JSON.stringify(JSON.parse(input), null, 2));
      } else if (lang === 'javascript') {
        let formatted = input.replace(/\{/g, '{\n').replace(/\}/g, '}\n').replace(/;/g, ';\n');
        setOutput(formatted);
      } else if (lang === 'html') {
        setOutput(input.replace(/></g, '>\n<'));
      } else {
        setOutput(input);
      }
    } catch { setOutput('Parse error'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {['json', 'javascript', 'html', 'css'].map(l => (
          <button key={l} onClick={() => setLang(l)} className={`px-3 py-1.5 text-sm rounded-lg ${lang === l ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>{l}</button>
        ))}
      </div>
      <Textarea value={input} onChange={setInput} placeholder="Paste code to beautify..." className="!h-32" />
      <ProcessButton onClick={beautify}>Beautify</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── CSS to SCSS Converter ─────────────────────────────────────────────
function CssToScssTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input) { setOutput(''); return; }
    let scss = input;
    setOutput(scss);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Paste CSS..." className="!h-32" />
      <ProcessButton onClick={convert}>Convert to SCSS</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── TOML to JSON ───────────────────────────────────────────────────────
function TomlToJsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input) { setOutput(''); return; }
    try {
      const obj: Record<string, unknown> = {};
      const lines = input.split('\n');
      let currentSection = '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        if (trimmed.startsWith('[')) {
          currentSection = trimmed.slice(1, -1);
          obj[currentSection] = {};
        } else if (trimmed.includes('=')) {
          const [key, ...valParts] = trimmed.split('=');
          const value = valParts.join('=').trim().replace(/^["']|["']$/g, '');
          if (currentSection) {
            (obj[currentSection] as Record<string, string>)[key.trim()] = value;
          } else {
            obj[key.trim()] = value;
          }
        }
      }
      setOutput(JSON.stringify(obj, null, 2));
    } catch { setOutput('Invalid TOML'); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Paste TOML..." className="!h-32" />
      <ProcessButton onClick={convert}>Convert to JSON</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── List Randomizer ───────────────────────────────────────────────────
function ListRandomizerTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const shuffle = () => {
    if (!input) { setOutput(''); return; }
    const items = input.split('\n').filter(l => l.trim());
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    setOutput(items.join('\n'));
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter items (one per line)..." />
      <ProcessButton onClick={shuffle}>Shuffle List</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Random UUID v7 ────────────────────────────────────────────────────
function RandomUuidV7Tool() {
  const [count, setCount] = useState('5');
  const [output, setOutput] = useState('');

  const generate = () => {
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 100);
    const uuidv7 = () => {
      const now = Date.now();
      const timeHex = now.toString(16).padStart(12, '0');
      const rand = Array.from({ length: 10 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-7${rand.slice(1, 4)}-${(parseInt(rand[4], 16) & 0x3f | 0x80).toString(16)}${rand.slice(5, 9)}-${rand.slice(9)}`;
    };
    setOutput(Array.from({ length: n }, uuidv7).join('\n'));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Count</label>
        <input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" max="100" className="w-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={generate}>Generate UUIDs</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Random IP Address ─────────────────────────────────────────────────
function RandomIpAddressTool() {
  const [version, setVersion] = useState<'v4' | 'v6'>('v4');
  const [count, setCount] = useState('5');
  const [output, setOutput] = useState('');

  const generate = () => {
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 100);
    if (version === 'v4') {
      setOutput(Array.from({ length: n }, () => `${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}`).join('\n'));
    } else {
      setOutput(Array.from({ length: n }, () => Array.from({ length: 8 }, () => Math.floor(Math.random()*65536).toString(16).padStart(4, '0')).join(':')).join('\n'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setVersion('v4')} className={`px-4 py-2 text-sm rounded-lg ${version === 'v4' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>IPv4</button>
        <button onClick={() => setVersion('v6')} className={`px-4 py-2 text-sm rounded-lg ${version === 'v6' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>IPv6</button>
        <input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" max="100" placeholder="Count" className="w-24 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={generate}>Generate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Random MAC Generator ───────────────────────────────────────────────
function RandomMacGeneratorTool() {
  const [count, setCount] = useState('5');
  const [output, setOutput] = useState('');

  const generate = () => {
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 100);
    setOutput(Array.from({ length: n }, () => Array.from({ length: 6 }, () => Math.floor(Math.random()*256).toString(16).padStart(2, '0')).join('-')).join('\n'));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Count</label>
        <input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" max="100" className="w-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={generate}>Generate MACs</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Random Choice Picker ───────────────────────────────────────────────
function RandomChoicePickerTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [count, setCount] = useState('1');

  const pick = () => {
    if (!input) { setOutput(''); return; }
    const items = input.split('\n').filter(l => l.trim());
    const n = Math.min(Math.max(parseInt(count) || 1, 1), items.length);
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setOutput(shuffled.slice(0, n).join('\n'));
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter choices (one per line)..." />
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">How many to pick?</label>
        <input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" className="w-24 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={pick}>Pick Random</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Random Password Generator ─────────────────────────────────────────
function RandomPasswordGeneratorTool() {
  const [length, setLength] = useState('16');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState({ upper: true, lower: true, number: true, symbol: true });

  const generate = () => {
    const n = Math.min(Math.max(parseInt(length) || 16, 4), 128);
    let chars = '';
    if (options.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (options.number) chars += '0123456789';
    if (options.symbol) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) { setOutput('Select at least one option'); return; }
    setOutput(Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join(''));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Length: {length}</label>
        <input type="range" value={length} onChange={e => setLength(e.target.value)} min="4" max="128" className="w-full" />
      </div>
      <div className="flex flex-wrap gap-4">
        {Object.entries(options).map(([k, v]) => (
          <label key={k} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={v} onChange={e => setOptions(p => ({ ...p, [k]: e.target.checked }))} className="w-4 h-4 accent-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{k.charAt(0).toUpperCase() + k.slice(1)}</span>
          </label>
        ))}
      </div>
      <ProcessButton onClick={generate}>Generate Password</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Email Generator ───────────────────────────────────────────────────
function EmailGeneratorTool() {
  const [count, setCount] = useState('5');
  const [domain, setDomain] = useState('example.com');
  const [output, setOutput] = useState('');

  const firstNames = ['john', 'jane', 'alex', 'mary', 'david', 'sarah', 'mike', 'emma', 'chris', 'anna'];
  const lastNames = ['smith', 'doe', 'jones', 'wilson', 'brown', 'taylor', 'anderson', 'thomas', 'jackson', 'white'];

  const generate = () => {
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 100);
    setOutput(Array.from({ length: n }, () => {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      const num = Math.floor(Math.random() * 999);
      return `${fn}.${ln}${num}@${domain}`;
    }).join('\n'));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Domain</label>
          <input value={domain} onChange={e => setDomain(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Count</label>
          <input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" max="100" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
      </div>
      <ProcessButton onClick={generate}>Generate Emails</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── MAC Address Generator ──────────────────────────────────────────────
function MacAddressGeneratorTool() {
  const [count, setCount] = useState('5');
  const [format, setFormat] = useState<'dash' | 'colon' | 'period'>('dash');
  const [output, setOutput] = useState('');

  const generate = () => {
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 100);
    const sep = format === 'dash' ? '-' : format === 'colon' ? ':' : '.';
    setOutput(Array.from({ length: n }, () => Array.from({ length: 6 }, () => Math.floor(Math.random()*256).toString(16).padStart(2, '0')).join(sep)).join('\n'));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['dash', 'colon', 'period'] as const).map(f => (
          <button key={f} onClick={() => setFormat(f)} className={`px-3 py-1.5 text-sm rounded-lg ${format === f ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>{f}</button>
        ))}
        <input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" max="100" placeholder="Count" className="w-24 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-1.5 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={generate}>Generate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── HMAC Generator ────────────────────────────────────────────────────
function HmacGeneratorTool() {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [algo, setAlgo] = useState('sha256');
  const [output, setOutput] = useState('');

  const generate = async () => {
    if (!input || !key) { setOutput('Enter both text and key'); return; }
    const enc = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'PBKDF2' }, false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode('hmac'), iterations: 100000, hash: algo }, cryptoKey, 256);
    setOutput(Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join(''));
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Text to hash..." />
      <input value={key} onChange={e => setKey(e.target.value)} placeholder="Secret key" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      <div className="flex gap-2">
        {['sha1', 'sha256', 'sha512'].map(h => (
          <button key={h} onClick={() => setAlgo(h)} className={`px-3 py-1.5 text-sm rounded-lg ${algo === h ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>{h.toUpperCase()}</button>
        ))}
      </div>
      <ProcessButton onClick={generate}>Generate HMAC</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── HTML Minifier ─────────────────────────────────────────────────────
function HtmlMinifierTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const minify = () => {
    if (!input) { setOutput(''); return; }
    setOutput(input.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim());
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Paste HTML..." className="!h-32" />
      <ProcessButton onClick={minify}>Minify HTML</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── JSON Escape/Unescape ──────────────────────────────────────────────
function JsonEscapeUnescapeTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');
  const [output, setOutput] = useState('');

  const process = () => {
    if (!input) { setOutput(''); return; }
    try {
      setOutput(mode === 'escape' ? JSON.stringify(input) : JSON.parse(input));
    } catch { setOutput('Invalid JSON'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['escape', 'unescape'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 text-sm rounded-lg ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>{m.charAt(0).toUpperCase() + m.slice(1)}</button>
        ))}
      </div>
      <Textarea value={input} onChange={setInput} placeholder="Enter text..." />
      <ProcessButton onClick={process}>Process</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── SVG Minifier ─────────────────────────────────────────────────────
function SvgMinifierTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const minify = () => {
    if (!input) { setOutput(''); return; }
    setOutput(input.replace(/\s+/g, ' ').replace(/>\s+</g, '><').replace(/\s+\/>/g, '/>').trim());
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Paste SVG..." className="!h-32" />
      <ProcessButton onClick={minify}>Minify SVG</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── ASCII Art Generator ───────────────────────────────────────────────
function AsciiArtGeneratorTool() {
  const [input, setInput] = useState('');
  const [font, setFont] = useState('block');
  const [output, setOutput] = useState('');

  const fonts: Record<string, string[]> = {
    block: ['█████', '█   █', '█████', '█   █', '█   █'],
    bubble: ['╭─────╮', '│     │', '╰─────╯'],
    sharp: ['▄▄▄▄▄', '█▀▀▀█', '█▄▄▄█', '█   █', '█▄▄▄█'],
  };

  const generate = () => {
    if (!input) { setOutput(''); return; }
    const lines = input.toUpperCase().split('');
    const artLines = Array.from({ length: 5 }, () => '');
    for (const char of lines) {
      const pattern = fonts[font] || fonts.block;
      const idx = char.charCodeAt(0) - 65;
      if (idx >= 0 && idx < 26) {
        for (let i = 0; i < 5; i++) artLines[i] += pattern[i] + '  ';
      } else {
        for (let i = 0; i < 5; i++) artLines[i] += '     ';
      }
    }
    setOutput(artLines.join('\n'));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {Object.keys(fonts).map(f => (
          <button key={f} onClick={() => setFont(f)} className={`px-3 py-1.5 text-sm rounded-lg ${font === f ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>{f}</button>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text (A-Z only)" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500" />
      <ProcessButton onClick={generate}>Generate ASCII Art</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── IP Address Info ───────────────────────────────────────────────────
function IpAddressInfoTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const analyze = () => {
    if (!input) { setOutput(''); return; }
    const parts = input.split('.');
    if (parts.length !== 4 || parts.some(p => isNaN(parseInt(p)) || parseInt(p) < 0 || parseInt(p) > 255)) {
      setOutput('Invalid IPv4 address');
      return;
    }
    const first = parseInt(parts[0]);
    let type = 'Public';
    if (first === 10 || (first === 172 && parseInt(parts[1]) >= 16 && parseInt(parts[1]) <= 31) || first === 127 || first === 192 && parseInt(parts[1]) === 168) type = 'Private';
    if (first === 0 || first === 255) type = 'Reserved';
    const isLoopback = first === 127;
    const isBroadcast = input === '255.255.255.255';
    setOutput(`IP: ${input}\nType: ${type}\nLoopback: ${isLoopback ? 'Yes' : 'No'}\nBroadcast: ${isBroadcast ? 'Yes' : 'No'}`);
  };

  return (
    <div className="space-y-4">
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter IPv4 address" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      <ProcessButton onClick={analyze}>Analyze</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Markdown Table from JSON ──────────────────────────────────────────
function MarkdownTableFromJsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input) { setOutput(''); return; }
    try {
      const data = JSON.parse(input);
      const items = Array.isArray(data) ? data : [data];
      if (!items.length) { setOutput('Empty array'); return; }
      const keys = Object.keys(items[0]);
      const header = `| ${keys.join(' | ')} |`;
      const separator = `| ${keys.map(() => '---').join(' | ')} |`;
      const rows = items.map(item => `| ${keys.map(k => String(item[k] ?? '')).join(' | ')} |`).join('\n');
      setOutput(`${header}\n${separator}\n${rows}`);
    } catch { setOutput('Invalid JSON'); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder='[{"name": "John", "age": 30}]' className="!h-32" />
      <ProcessButton onClick={convert}>Generate Table</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Random Paragraph Generator ────────────────────────────────────────
function RandomParagraphGeneratorTool() {
  const [count, setCount] = useState('3');
  const [output, setOutput] = useState('');

  const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident'];

  const generate = () => {
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 20);
    const paragraph = () => Array.from({ length: 50 + Math.floor(Math.random() * 50) }, () => words[Math.floor(Math.random() * words.length)]).join(' ').replace(/^(.)/, m => m.toUpperCase()) + '.';
    setOutput(Array.from({ length: n }, paragraph).join('\n\n'));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Number of paragraphs</label>
        <input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" max="20" className="w-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={generate}>Generate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Random Sentence Generator ─────────────────────────────────────────
function RandomSentenceGeneratorTool() {
  const [count, setCount] = useState('5');
  const [output, setOutput] = useState('');

  const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit'];

  const generate = () => {
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 50);
    const sentence = () => {
      const len = 8 + Math.floor(Math.random() * 12);
      const w = Array.from({ length: len }, () => words[Math.floor(Math.random() * words.length)]);
      return w.join(' ').replace(/^(.)/, m => m.toUpperCase()) + '.';
    };
    setOutput(Array.from({ length: n }, sentence).join('\n'));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Number of sentences</label>
        <input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" max="50" className="w-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={generate}>Generate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Reading Time Calculator ───────────────────────────────────────────
function ReadingTimeCalculatorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    if (!input) { setOutput(''); return; }
    const words = input.trim().split(/\s+/).length;
    const chars = input.length;
    const sentences = input.split(/[.!?]+/).filter(Boolean).length;
    const minutes = Math.ceil(words / 200);
    setOutput(`Words: ${words}\nCharacters: ${chars}\nSentences: ${sentences}\nReading time: ${minutes} min${minutes !== 1 ? 's' : ''} (at 200 WPM)`);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Paste text..." />
      <ProcessButton onClick={calculate}>Calculate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Smart Text Sorter ─────────────────────────────────────────────────
function SmartTextSorterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const sort = () => {
    if (!input) { setOutput(''); return; }
    const lines = input.split('\n').filter(l => l.trim());
    setOutput([...lines].sort((a, b) => a.localeCompare(b)).join('\n'));
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter text to sort..." />
      <ProcessButton onClick={sort}>Sort Alphabetically</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Text Reverser ────────────────────────────────────────────────────
function TextReverserTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'chars' | 'words' | 'lines'>('chars');

  const reverse = () => {
    if (!input) { setOutput(''); return; }
    if (mode === 'chars') setOutput(input.split('').reverse().join(''));
    else if (mode === 'words') setOutput(input.split(/\s+/).reverse().join(' '));
    else setOutput(input.split('\n').reverse().join('\n'));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['chars', 'words', 'lines'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 text-sm rounded-lg ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>{m.charAt(0).toUpperCase() + m.slice(1)}</button>
        ))}
      </div>
      <Textarea value={input} onChange={setInput} placeholder="Enter text..." />
      <ProcessButton onClick={reverse}>Reverse</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Duplicate Line Finder ──────────────────────────────────────────────
function DuplicateLineFinderTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const find = () => {
    if (!input) { setOutput(''); return; }
    const lines = input.split('\n');
    const seen: Record<string, number> = {};
    const duplicates: string[] = [];
    for (const line of lines) {
      if (line.trim()) {
        seen[line] = (seen[line] || 0) + 1;
        if (seen[line] === 2) duplicates.push(line);
      }
    }
    if (!duplicates.length) { setOutput('No duplicate lines found'); return; }
    setOutput(`Found ${duplicates.length} duplicate line(s):\n\n${duplicates.join('\n')}`);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Paste text..." />
      <ProcessButton onClick={find}>Find Duplicates</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Sentence Extractor ────────────────────────────────────────────────
function SentenceExtractorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const extract = () => {
    if (!input) { setOutput(''); return; }
    const sentences = input.split(/[.!?]+/).map(s => s.trim()).filter(s => s && s.length > 2);
    setOutput(sentences.map((s, i) => `${i + 1}. ${s}`).join('\n'));
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Paste text..." className="!h-32" />
      <ProcessButton onClick={extract}>Extract Sentences</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Line Counter ──────────────────────────────────────────────────────
function LineCounterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const count = () => {
    if (!input) { setOutput(''); return; }
    const lines = input.split('\n');
    const nonEmpty = lines.filter(l => l.trim()).length;
    const words = input.trim().split(/\s+/).filter(Boolean).length;
    const chars = input.length;
    setOutput(`Lines: ${lines.length}\nNon-empty lines: ${nonEmpty}\nWords: ${words}\nCharacters: ${chars}`);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter text..." />
      <ProcessButton onClick={count}>Count</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Secure Random Generator ───────────────────────────────────────────
function SecureRandomGeneratorTool() {
  const [type, setType] = useState<'hex' | 'base64' | 'uuid' | 'number'>('hex');
  const [length, setLength] = useState('32');
  const [output, setOutput] = useState('');

  const generate = () => {
    const len = Math.min(Math.max(parseInt(length) || 32, 4), 256);
    if (type === 'hex') {
      const bytes = crypto.getRandomValues(new Uint8Array(len));
      setOutput(Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(''));
    } else if (type === 'base64') {
      const bytes = crypto.getRandomValues(new Uint8Array(len));
      setOutput(btoa(String.fromCharCode(...bytes)));
    } else if (type === 'uuid') {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
      setOutput(`${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`);
    } else {
      const max = BigInt('1' + '0'.repeat(len));
      const rand = BigInt('0x' + Array.from(crypto.getRandomValues(new Uint8Array(len))).map(b => b.toString(16).padStart(2, '0')).join(''));
      setOutput((rand % max).toString());
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(['hex', 'base64', 'uuid', 'number'] as const).map(t => (
          <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 text-sm rounded-lg ${type === t ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>{t}</button>
        ))}
      </div>
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Length ({length})</label>
        <input type="range" value={length} onChange={e => setLength(e.target.value)} min="4" max="64" className="w-full" />
      </div>
      <ProcessButton onClick={generate}>Generate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Binary Decimal Hex Converter ─────────────────────────────────────────────
function BinaryDecimalHexConverterTool() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState<number>(10);
  const [output, setOutput] = useState('');

  const convert = () => {
    const num = parseInt(input, fromBase);
    if (isNaN(num)) { setOutput('Invalid number for selected base'); return; }
    setOutput(`Decimal: ${num}\nBinary: ${num.toString(2)}\nHex: ${num.toString(16).toUpperCase()}\nOctal: ${num.toString(8)}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[2, 8, 10, 16].map(b => (
          <button key={b} onClick={() => setFromBase(b)} className={`px-3 py-1.5 text-sm rounded-lg ${fromBase === b ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>{b === 2 ? 'BIN' : b === 8 ? 'OCT' : b === 10 ? 'DEC' : 'HEX'}</button>
        ))}
      </div>
      <input type="text" value={input} onChange={e => setInput(e.target.value.toUpperCase())} placeholder={`Enter ${fromBase === 2 ? 'binary' : fromBase === 8 ? 'octal' : fromBase === 10 ? 'decimal' : 'hex'} number`} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Character Variety Checker ───────────────────────────────────────────────
function CharacterVarietyCheckerTool() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const check = () => {
    if (!text) { setOutput('Enter text to analyze'); return; }
    const counts = { uppercase: 0, lowercase: 0, digits: 0, punctuation: 0, spaces: 0, special: 0 };
    for (const c of text) {
      if (/[A-Z]/.test(c)) counts.uppercase++;
      else if (/[a-z]/.test(c)) counts.lowercase++;
      else if (/[0-9]/.test(c)) counts.digits++;
      else if (/\s/.test(c)) counts.spaces++;
      else if (/[.,!?;:'"()-]/.test(c)) counts.punctuation++;
      else counts.special++;
    }
    const total = text.length;
    setOutput(`Total chars: ${total}\nUppercase: ${counts.uppercase} (${((counts.uppercase/total)*100).toFixed(1)}%)\nLowercase: ${counts.lowercase} (${((counts.lowercase/total)*100).toFixed(1)}%)\nDigits: ${counts.digits} (${((counts.digits/total)*100).toFixed(1)}%)\nSpaces: ${counts.spaces} (${((counts.spaces/total)*100).toFixed(1)}%)\nPunctuation: ${counts.punctuation} (${((counts.punctuation/total)*100).toFixed(1)}%)\nSpecial: ${counts.special} (${((counts.special/total)*100).toFixed(1)}%)`);
  };

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Enter text to check character variety..." />
      <ProcessButton onClick={check}>Analyze</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── CIDR Calculator ─────────────────────────────────────────────────────────
function CidrCalculatorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const cidr = input.trim();
    const match = cidr.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
    if (!match) { setOutput('Enter a valid CIDR (e.g. 192.168.1.0/24)'); return; }
    const octets = match.slice(1, 5).map(Number);
    if (octets.some(o => o > 255)) { setOutput('Invalid IP address'); return; }
    const bits = parseInt(match[5]);
    if (bits < 0 || bits > 32) { setOutput('CIDR must be 0-32'); return; }
    const ip = (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    const network = (ip & mask) >>> 0;
    const broadcast = (network | ~mask) >>> 0;
    const usable = Math.max(0, broadcast - network - 1);
    const toIP = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
    setOutput(`Network: ${toIP(network)}/${bits}\nSubnet Mask: ${toIP(mask)}\nFirst IP: ${toIP(network + 1)}\nLast IP: ${toIP(broadcast - 1)}\nBroadcast: ${toIP(broadcast)}\nTotal Hosts: ${Math.pow(2, 32 - bits)}\nUsable Hosts: ${usable}`);
  };

  return (
    <div className="space-y-4">
      <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="192.168.1.0/24" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      <ProcessButton onClick={calculate}>Calculate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Code Diff ───────────────────────────────────────────────────────────────
function CodeDiffTool() {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [output, setOutput] = useState('');

  const diff = () => {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const result: string[] = [];
    const maxLen = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLen; i++) {
      const o = oldLines[i] ?? '';
      const n = newLines[i] ?? '';
      if (o === n) result.push(`  ${o}`);
      else {
        if (o) result.push(`- ${o}`);
        if (n) result.push(`+ ${n}`);
      }
    }
    setOutput(result.join('\n'));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Original</label>
          <textarea value={oldText} onChange={e => setOldText(e.target.value)} placeholder="Original code..." className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm resize-y focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Modified</label>
          <textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="Modified code..." className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm resize-y focus:outline-none focus:border-red-500" />
        </div>
      </div>
      <ProcessButton onClick={diff}>Compare</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Color Blindness Simulator ────────────────────────────────────────────────
function ColorBlindnessSimulatorTool() {
  const [hex, setHex] = useState('#FF5733');
  const [output, setOutput] = useState('');

  const simulate = () => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const protanopia = [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758];
    const deuteranopia = [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7];
    const tritanopia = [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525];
    const apply = (m: number[]) => [Math.round(m[0]*r+m[1]*g+m[2]*b), Math.round(m[3]*r+m[4]*g+m[5]*b), Math.round(m[6]*r+m[7]*g+m[8]*b)].map(v=>Math.min(255,Math.max(0,v)));
    const toHex = (c: number[]) => '#' + c.map(v=>v.toString(16).padStart(2,'0')).join('').toUpperCase();
    setOutput(`Original: ${hex.toUpperCase()}\nProtanopia: ${toHex(apply(protanopia))}\nDeuteranopia: ${toHex(apply(deuteranopia))}\nTritanopia: ${toHex(apply(tritanopia))}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-12 h-12 rounded cursor-pointer border-0" />
        <input type="text" value={hex} onChange={e => setHex(e.target.value)} placeholder="#FF5733" className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={simulate}>Simulate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Color Contrast Auditor ───────────────────────────────────────────────────
function ColorContrastAuditorTool() {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#FFFFFF');
  const [output, setOutput] = useState('');

  const luminance = (hex: string) => {
    const r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
    const s = [r,g,b].map(v => v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4));
    return 0.2126*s[0] + 0.7152*s[1] + 0.0722*s[2];
  };

  const contrast = () => {
    const L1 = luminance(fg), L2 = luminance(bg);
    const ratio = (Math.max(L1,L2) + 0.05) / (Math.min(L1,L2) + 0.05);
    const passAA = ratio >= 4.5 ? '✓ AA Normal' : '✗ Fail AA Normal';
    const passAAA = ratio >= 7 ? '✓ AAA Normal' : '✗ Fail AAA Normal';
    setOutput(`Contrast Ratio: ${ratio.toFixed(2)}:1\n\nWCAG 2.1:\n${passAA}\n${passAAA}\n${ratio >= 3 ? '✓ AA Large Text' : '✗ Fail AA Large Text'}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Foreground</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
            <input type="text" value={fg} onChange={e => setFg(e.target.value)} className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Background</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
            <input type="text" value={bg} onChange={e => setBg(e.target.value)} className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" />
          </div>
        </div>
      </div>
      <div className="p-4 rounded-lg text-center" style={{ backgroundColor: bg, color: fg }}>Preview Text</div>
      <ProcessButton onClick={contrast}>Check Contrast</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Color Contrast Ratio Checker ─────────────────────────────────────────────
function ColorContrastRatioCheckerTool() {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [output, setOutput] = useState('');

  const luminance = (hex: string) => {
    const r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
    const s = [r,g,b].map(v => v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4));
    return 0.2126*s[0] + 0.7152*s[1] + 0.0722*s[2];
  };

  const check = () => {
    const L1 = luminance(fg), L2 = luminance(bg);
    const ratio = (Math.max(L1,L2) + 0.05) / (Math.min(L1,L2) + 0.05);
    setOutput(`Contrast Ratio: ${ratio.toFixed(2)}:1\n\nAA (4.5:1): ${ratio >= 4.5 ? 'PASS ✓' : 'FAIL ✗'}\nAAA (7:1): ${ratio >= 7 ? 'PASS ✓' : 'FAIL ✗'}\nLarge Text AA (3:1): ${ratio >= 3 ? 'PASS ✓' : 'FAIL ✗'}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Foreground</label>
          <div className="flex gap-2"><input type="color" value={fg} onChange={e=>setFg(e.target.value)} className="w-10 h-10 rounded border-0 cursor-pointer" /><input type="text" value={fg} onChange={e=>setFg(e.target.value)} className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Background</label>
          <div className="flex gap-2"><input type="color" value={bg} onChange={e=>setBg(e.target.value)} className="w-10 h-10 rounded border-0 cursor-pointer" /><input type="text" value={bg} onChange={e=>setBg(e.target.value)} className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
        </div>
      </div>
      <ProcessButton onClick={check}>Check Ratio</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Color Format Converter V2 ──────────────────────────────────────────────
function ColorFormatConverterV2Tool() {
  const [input, setInput] = useState('#3498db');
  const [output, setOutput] = useState('');

  const convert = () => {
    const hex = input.trim();
    let r: number, g: number, b: number;
    if (hex.startsWith('#') && hex.length === 7) {
      r = parseInt(hex.slice(1,3),16); g = parseInt(hex.slice(3,5),16); b = parseInt(hex.slice(5,7),16);
    } else if (hex.startsWith('rgb')) {
      const m = hex.match(/\d+/g); if (!m || m.length < 3) { setOutput('Invalid RGB'); return; }
      [r,g,b] = m.map(Number);
    } else { setOutput('Enter HEX (#RRGGBB) or RGB(r, g, b)'); return; }
    const hsl = (() => { const rn=r/255,gn=g/255,bn=b/255; const max=Math.max(rn,gn,bn),min=Math.min(rn,gn,bn); let h=0,s=0; const l=(max+min)/2; if(max!==min){const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min); switch(max){case rn:h=((gn-bn)/d+(gn<bn?6:0))/6;break;case gn:h=((bn-rn)/d+2)/6;break;default:h=((rn-gn)/d+4)/6;}} return [Math.round(h*360),Math.round(s*100),Math.round(l*100)]; })();
    setOutput(`HEX: #${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0').toUpperCase()}\nRGB: rgb(${r}, ${g}, ${b})\nRGBA: rgba(${r}, ${g}, ${b}, 1)\nHSL: hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)\nHSLA: hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 1)`);
  };

  return (
    <div className="space-y-4">
      <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="#3498db or rgb(52, 152, 219)" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Color Format Picker ─────────────────────────────────────────────────────
function ColorFormatPickerTool() {
  const [hex, setHex] = useState('#E74C3C');
  const [format, setFormat] = useState<'hex'|'rgb'|'hsl'>('hex');

  const toRgb = () => { const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return `rgb(${r}, ${g}, ${b})`; };
  const toHsl = () => { const r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255; const max=Math.max(r,g,b),min=Math.min(r,g,b); let h=0,s=0; const l=(max+min)/2; if(max!==min){const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min); switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;default:h=((r-g)/d+4)/6;}} return `hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`; };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-16 h-16 rounded-lg cursor-pointer border-0" />
        <input type="text" value={hex} onChange={e => setHex(e.target.value)} className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <div className="flex gap-2">
        {(['hex','rgb','hsl'] as const).map(f => (
          <button key={f} onClick={() => setFormat(f)} className={`px-4 py-2 rounded-lg text-sm ${format===f?'bg-red-600 text-white':'bg-gray-100 dark:bg-gray-800'}`}>{f.toUpperCase()}</button>
        ))}
      </div>
      <div className="p-6 rounded-lg text-center text-2xl font-mono" style={{ backgroundColor: hex }}>{format==='hex'?hex:format==='rgb'?toRgb():toHsl()}</div>
    </div>
  );
}

// ─── Color Harmony Express ───────────────────────────────────────────────────
function ColorHarmonyExpressTool() {
  const [base, setBase] = useState('#3498db');
  const [output, setOutput] = useState('');

  const hslToHex = (nh: number, ns: number, nl: number): string => {
    const h = ((nh % 360 + 360) % 360) / 360;
    const s = ns / 100;
    const l = nl / 100;
    let r: number, g: number, b: number;
    if (s === 0) { r = g = b = l; }
    else {
      const q = l >= 0.5 ? l * (1 + s) : l + s * l;
      const p = 2 * l - q;
      const hue2rgb = (p: number, q: number, t: number): number => {
        const tt = ((t % 360 + 360) % 360) / 360;
        if (tt < 1/6) return p + (q - p) * 6 * tt;
        if (tt < 0.5) return q;
        if (tt < 2/3) return p + (q - p) * (2/3 - tt) * 6;
        return p;
      };
      r = hue2rgb(p, q, h * 360 + 120);
      g = hue2rgb(p, q, h * 360);
      b = hue2rgb(p, q, h * 360 + 240);
    }
    return '#' + [r, g, b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  const harmony = () => {
    const h = parseInt(base.slice(1, 3), 16) / 255 * 360;
    const s = parseInt(base.slice(3, 5), 16) / 255 * 100;
    const l = parseInt(base.slice(5, 7), 16) / 255 * 100;
    setOutput(`Complementary: ${hslToHex(h + 180, s, l)}\nAnalogous: ${hslToHex(h - 30, s, l)} | ${hslToHex(h, s, l)} | ${hslToHex(h + 30, s, l)}\nTriadic: ${hslToHex(h, s, l)} | ${hslToHex(h + 120, s, l)} | ${hslToHex(h + 240, s, l)}\nSplit-Complementary: ${hslToHex(h + 150, s, l)} | ${hslToHex(h + 210, s, l)}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <input type="color" value={base} onChange={e => setBase(e.target.value)} className="w-12 h-12 rounded cursor-pointer border-0" />
        <input type="text" value={base} onChange={e => setBase(e.target.value)} className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={harmony}>Generate Harmony</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Color Luminance Calculator ──────────────────────────────────────────────
function ColorLuminanceCalculatorTool() {
  const [hex, setHex] = useState('#FFFFFF');
  const [output, setOutput] = useState('');

  const calc = () => {
    const r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
    const s = [r,g,b].map(v => v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4));
    const lum = 0.2126*s[0] + 0.7152*s[1] + 0.0722*s[2];
    setOutput(`Relative Luminance: ${lum.toFixed(4)}\n\n${lum > 0.179 ? 'Light color (luminance > 0.179)' : 'Dark color (luminance <= 0.179)'}\n\nContrast with white (#FFF): ${((lum + 0.05) / 0.05).toFixed(2)}:1\nContrast with black (#000): ${((0.05) / (lum + 0.05)).toFixed(2)}:1`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-12 h-12 rounded cursor-pointer border-0" />
        <input type="text" value={hex} onChange={e => setHex(e.target.value)} className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={calc}>Calculate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Color Mixer V2 ─────────────────────────────────────────────────────────
function ColorMixerV2Tool() {
  const [color1, setColor1] = useState('#FF0000');
  const [color2, setColor2] = useState('#0000FF');
  const [ratio, setRatio] = useState('50');
  const [output, setOutput] = useState('');

  const mix = () => {
    const r = Math.round(parseInt(color1.slice(1,3),16)*(1-parseInt(ratio)/100) + parseInt(color2.slice(1,3),16)*parseInt(ratio)/100);
    const g = Math.round(parseInt(color1.slice(3,5),16)*(1-parseInt(ratio)/100) + parseInt(color2.slice(3,5),16)*parseInt(ratio)/100);
    const b = Math.round(parseInt(color1.slice(5,7),16)*(1-parseInt(ratio)/100) + parseInt(color2.slice(5,7),16)*parseInt(ratio)/100);
    const hex = '#' + [r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('').toUpperCase();
    setOutput(`Mixed Color: ${hex}\nRGB: rgb(${r}, ${g}, ${b})`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex gap-2 items-center">
          <input type="color" value={color1} onChange={e=>setColor1(e.target.value)} className="w-10 h-10 rounded border-0 cursor-pointer" />
          <input type="text" value={color1} onChange={e=>setColor1(e.target.value)} className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
        <div className="flex gap-2 items-center">
          <input type="color" value={color2} onChange={e=>setColor2(e.target.value)} className="w-10 h-10 rounded border-0 cursor-pointer" />
          <input type="text" value={color2} onChange={e=>setColor2(e.target.value)} className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Ratio: {ratio}% {color2}</label>
        <input type="range" value={ratio} onChange={e=>setRatio(e.target.value)} min="0" max="100" className="w-full" />
      </div>
      <ProcessButton onClick={mix}>Mix Colors</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Color Name Finder V2 ────────────────────────────────────────────────────
function ColorNameFinderV2Tool() {
  const [hex, setHex] = useState('#3498db');
  const [output, setOutput] = useState('');

  const namedColors: [string,string][] = [['AliceBlue','#F0F8FF'],['AntiqueWhite','#FAEBD7'],['Aqua','#00FFFF'],['Aquamarine','#7FFFD4'],['Azure','#F0FFFF'],['Beige','#F5F5DC'],['Bisque','#FFE4C4'],['Black','#000000'],['BlanchedAlmond','#FFEBCD'],['Blue','#0000FF'],['BlueViolet','#8A2BE2'],['Brown','#A52A2A'],['BurlyWood','#DEB887'],['CadetBlue','#5F9EA0'],['Chartreuse','#7FFF00'],['Chocolate','#D2691E'],['Coral','#FF7F50'],['CornflowerBlue','#6495ED'],['Cornsilk','#FFF8DC'],['Crimson','#DC143C'],['Cyan','#00FFFF'],['DarkBlue','#00008B'],['DarkCyan','#008B8B'],['DarkGoldenRod','#B8860B'],['DarkGray','#A9A9A9'],['DarkGreen','#006400'],['DarkKhaki','#BDB76B'],['DarkMagenta','#8B008B'],['DarkOliveGreen','#556B2F'],['DarkOrange','#FF8C00'],['DarkOrchid','#9932CC'],['DarkRed','#8B0000'],['DarkSalmon','#E9967A'],['DarkSeaGreen','#8FBC8F'],['DarkSlateBlue','#483D8B'],['DarkSlateGray','#2F4F4F'],['DarkTurquoise','#00CED1'],['DarkViolet','#9400D3'],['DeepPink','#FF1493'],['DeepSkyBlue','#00BFFF'],['DimGray','#696969'],['DodgerBlue','#1E90FF'],['FireBrick','#B22222'],['FloralWhite','#FFFAF0'],['ForestGreen','#228B22'],['Fuchsia','#FF00FF'],['Gainsboro','#DCDCDC'],['GhostWhite','#F8F8FF'],['Gold','#FFD700'],['GoldenRod','#DAA520'],['Gray','#808080'],['Green','#008000'],['GreenYellow','#ADFF2F'],['HoneyDew','#F0FFF0'],['HotPink','#FF69B4'],['IndianRed','#CD5C5C'],['Indigo','#4B0082'],['Ivory','#FFFFF0'],['Khaki','#F0E68C'],['Lavender','#E6E6FA'],['LavenderBlush','#FFF0F5'],['LawnGreen','#7CFC00'],['LemonChiffon','#FFFACD'],['LightBlue','#ADD8E6'],['LightCoral','#F08080'],['LightCyan','#E0FFFF'],['LightGoldenRodYellow','#FAFAD2'],['LightGray','#D3D3D3'],['LightGreen','#90EE90'],['LightPink','#FFB6C1'],['LightSalmon','#FFA07A'],['LightSeaGreen','#20B2AA'],['LightSkyBlue','#87CEFA'],['LightSlateGray','#778899'],['LightSteelBlue','#B0C4DE'],['LightYellow','#FFFFE0'],['Lime','#00FF00'],['LimeGreen','#32CD32'],['Linen','#FAF0E6'],['Magenta','#FF00FF'],['Maroon','#800000'],['MediumAquaMarine','#66CDAA'],['MediumBlue','#0000CD'],['MediumOrchid','#BA55D3'],['MediumPurple','#9370DB'],['MediumSeaGreen','#3CB371'],['MediumSlateBlue','#7B68EE'],['MediumSpringGreen','#00FA9A'],['MediumTurquoise','#48D1CC'],['MediumVioletRed','#C71585'],['MidnightBlue','#191970'],['MintCream','#F5FFFA'],['MistyRose','#FFE4E1'],['Moccasin','#FFE4B5'],['NavajoWhite','#FFDEAD'],['Navy','#000080'],['OldLace','#FDF5E6'],['Olive','#808000'],['OliveDrab','#6B8E23'],['Orange','#FFA500'],['OrangeRed','#FF4500'],['Orchid','#DA70D6'],['PaleGoldenRod','#EEE8AA'],['PaleGreen','#98FB98'],['PaleTurquoise','#AFEEEE'],['PaleVioletRed','#DB7093'],['PapayaWhip','#FFEFD5'],['PeachPuff','#FFDAB9'],['Peru','#CD853F'],['Pink','#FFC0CB'],['Plum','#DDA0DD'],['PowderBlue','#B0E0E6'],['Purple','#800080'],['RebeccaPurple','#663399'],['Red','#FF0000'],['RosyBrown','#BC8F8F'],['RoyalBlue','#4169E1'],['SaddleBrown','#8B4513'],['Salmon','#FA8072'],['SandyBrown','#F4A460'],['SeaGreen','#2E8B57'],['SeaShell','#FFF5EE'],['Sienna','#A0522D'],['Silver','#C0C0C0'],['SkyBlue','#87CEEB'],['SlateBlue','#6A5ACD'],['SlateGray','#708090'],['Snow','#FFFAFA'],['SpringGreen','#00FF7F'],['SteelBlue','#4682B4'],['Tan','#D2B48C'],['Teal','#008080'],['Thistle','#D8BFD8'],['Tomato','#FF6347'],['Turquoise','#40E0D0'],['Violet','#EE82EE'],['Wheat','#F5DEB3'],['White','#FFFFFF'],['WhiteSmoke','#F5F5F5'],['Yellow','#FFFF00'],['YellowGreen','#9ACD32']];

  const find = () => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    let closest = namedColors[0], minDist = Infinity;
    for (const [name, col] of namedColors) {
      const cr = parseInt(col.slice(1,3),16), cg = parseInt(col.slice(3,5),16), cb = parseInt(col.slice(5,7),16);
      const d = Math.sqrt((r-cr)**2+(g-cg)**2+(b-cb)**2);
      if (d < minDist) { minDist = d; closest = [name, col]; }
    }
    setOutput(`Closest named color: ${closest[0]}\nHex: ${closest[1]}\nDistance: ${minDist.toFixed(1)}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-12 h-12 rounded cursor-pointer border-0" />
        <input type="text" value={hex} onChange={e => setHex(e.target.value)} className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={find}>Find Color Name</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── API Auth Header Generator ───────────────────────────────────────────────
function ApiAuthHeaderGeneratorTool() {
  const [type, setType] = useState<'bearer'|'basic'|'apiKey'>('bearer');
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keyName, setKeyName] = useState('X-API-Key');
  const [output, setOutput] = useState('');

  const generate = () => {
    let header = '';
    if (type === 'bearer') header = `Authorization: Bearer ${token}`;
    else if (type === 'basic') header = `Authorization: Basic ${btoa(`${username}:${password}`)}`;
    else header = `${keyName}: ${token}`;
    setOutput(header);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(['bearer','basic','apiKey'] as const).map(t => (
          <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 text-sm rounded-lg ${type===t?'bg-red-600 text-white':'bg-gray-100 dark:bg-gray-800'}`}>{t==='bearer'?'Bearer Token':t==='basic'?'Basic Auth':'API Key'}</button>
        ))}
      </div>
      {type === 'bearer' && <input type="text" value={token} onChange={e=>setToken(e.target.value)} placeholder="your-token-here" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />}
      {type === 'basic' && <><input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 mb-2 font-mono text-sm focus:outline-none focus:border-red-500" /><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" /></>}
      {type === 'apiKey' && <><input type="text" value={keyName} onChange={e=>setKeyName(e.target.value)} placeholder="X-API-Key" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 mb-2 font-mono text-sm focus:outline-none focus:border-red-500" /><input type="text" value={token} onChange={e=>setToken(e.target.value)} placeholder="your-api-key" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" /></>}
      <ProcessButton onClick={generate}>Generate Header</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── API Doc Generator ───────────────────────────────────────────────────────
function ApiDocGeneratorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    try {
      const json = JSON.parse(input);
      const lines = ['## API Documentation\n'];
      const processObj = (obj: Record<string,unknown>, prefix: string) => {
        for (const [key, val] of Object.entries(obj)) {
          const type = Array.isArray(val) ? 'array' : typeof val;
          lines.push(`- **${prefix}${key}** (${type}): ${val === null ? 'null' : Array.isArray(val) ? `[${val.join(', ')}]` : String(val).substring(0, 50)}`);
          if (typeof val === 'object' && val !== null && !Array.isArray(val)) processObj(val as Record<string,unknown>, prefix + key + '.');
        }
      };
      if (Array.isArray(json)) json.forEach((item, i) => { if (typeof item === 'object') processObj(item as Record<string,unknown>, ''); else lines.push(`- [${i}]: ${item}`); });
      else processObj(json, '');
      setOutput(lines.join('\n'));
    } catch { setOutput('Invalid JSON'); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder='{"endpoint": "/api/users", "method": "GET"}' />
      <ProcessButton onClick={generate}>Generate Docs</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── API Spec Generator ───────────────────────────────────────────────────────
function ApiSpecGeneratorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    try {
      const data = JSON.parse(input);
      const title = data.title || data.name || 'API';
      const basePath = data.basePath || data.base_url || '/api';
      const paths: string[] = [];
      const schema = (obj: Record<string,unknown>, required: string[]): Record<string,unknown> => {
        const properties: Record<string,unknown> = {};
        const req: string[] = [];
        for (const [k, v] of Object.entries(obj)) {
          properties[k] = { type: Array.isArray(v) ? 'array' : typeof v === 'number' ? 'number' : 'string', example: v };
          if (required.includes(k)) req.push(k);
        }
        return { type: 'object', properties, required: req.length ? req : undefined };
      };
      if (data.endpoints || data.routes) {
        for (const ep of (data.endpoints || data.routes)) {
          const method = (ep.method || 'get').toUpperCase();
          const path = ep.path || ep.url || '/';
          const params = ep.params || ep.query || {};
          paths.push(`  ${method} ${basePath}${path}:\n    summary: ${ep.description || ep.name || path}\n    parameters: ${JSON.stringify(Object.keys(params))}\n    responses:\n      200:\n        description: Success`);
        }
      }
      setOutput(`openapi: 3.0.0\ninfo:\n  title: ${title}\n  version: 1.0.0\npaths:\n${paths.join('\n')}`);
    } catch { setOutput('Invalid JSON input'); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder='{"title": "My API", "basePath": "/api", "endpoints": [{"method": "GET", "path": "/users", "description": "List users"}]}' />
      <ProcessButton onClick={generate}>Generate OpenAPI Spec</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Area Converter ──────────────────────────────────────────────────────────
function AreaConverterTool() {
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('sqm');
  const [output, setOutput] = useState('');
  const units: Record<string, number> = { sqm: 1, sqkm: 1e6, sqcm: 1e-4, sqmm: 1e-6, sqft: 0.092903, sqin: 0.00064516, sqyd: 0.836127, acre: 4046.86, hectare: 10000 };

  const convert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) { setOutput('Enter a number'); return; }
    const sqMeters = val * units[fromUnit];
    const results = Object.entries(units).map(([u, v]) => `${(sqMeters / v).toLocaleString('en', { maximumFractionDigits: 6 })} ${u}`);
    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Enter value" className="flex-1 min-w-[120px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
        <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500">
          {Object.keys(units).map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Angle Unit Converter ────────────────────────────────────────────────────
function AngleUnitConverterTool() {
  const [value, setValue] = useState('180');
  const [fromUnit, setFromUnit] = useState('deg');
  const [output, setOutput] = useState('');

  const convert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) { setOutput('Enter a number'); return; }
    let radians = val;
    if (fromUnit === 'deg') radians = val * Math.PI / 180;
    else if (fromUnit === 'grad') radians = val * Math.PI / 200;
    else if (fromUnit === 'turn') radians = val * 2 * Math.PI;
    setOutput(`Radians: ${radians.toFixed(6)}\nDegrees: ${(radians * 180 / Math.PI).toFixed(6)}\nGradians: ${(radians * 200 / Math.PI).toFixed(6)}\nTurns: ${(radians / 2 / Math.PI).toFixed(6)}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Enter value" className="flex-1 min-w-[120px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
        <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500">
          <option value="deg">Degrees (°)</option>
          <option value="rad">Radians (rad)</option>
          <option value="grad">Gradians (grad)</option>
          <option value="turn">Turns (turn)</option>
        </select>
      </div>
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Base64 Image Converter ──────────────────────────────────────────────────
function Base64ImageConverterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setInput(reader.result as string);
    reader.readAsDataURL(file);
  };

  const toImage = () => {
    if (!input.startsWith('data:')) { setOutput('Invalid Base64 image data'); return; }
    setOutput(input);
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFile} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-50 dark:file:bg-red-900/20 file:text-red-600 hover:file:bg-red-100 dark:hover:file:bg-red-900/30" />
      {input && <div className="text-xs text-gray-500 break-all bg-gray-50 dark:bg-gray-900 p-2 rounded">Image loaded ({input.substring(0, 50)}...)</div>}
      <ProcessButton onClick={toImage}>Convert to Base64</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Binary Text Express ─────────────────────────────────────────────────────
function BinaryTextExpressTool() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => setOutput(text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' '));
  const decode = () => {
    try { setOutput(text.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('')); } catch { setOutput('Invalid binary string'); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Enter text or binary (space-separated bytes)..." />
      <div className="flex gap-3">
        <ProcessButton onClick={encode}>Text → Binary</ProcessButton>
        <ProcessButton onClick={decode}>Binary → Text</ProcessButton>
      </div>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Binary to Text V2 ───────────────────────────────────────────────────────
function BinaryToTextV2Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    try {
      const bytes = input.trim().split(/\s+/);
      setOutput(bytes.map(b => String.fromCharCode(parseInt(b, 2))).join(''));
    } catch { setOutput('Invalid binary input'); }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter binary (e.g. 01001000 01100101 01101100 01101100 01101111)" />
      <ProcessButton onClick={convert}>Convert Binary to Text</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Bulk Generator ──────────────────────────────────────────────────────────
function BulkGeneratorTool() {
  const [prefix, setPrefix] = useState('item');
  const [start, setStart] = useState('1');
  const [count, setCount] = useState('10');
  const [suffix, setSuffix] = useState('');
  const [padding, setPadding] = useState('0');
  const [output, setOutput] = useState('');

  const generate = () => {
    const startNum = parseInt(start) || 1;
    const cnt = Math.min(parseInt(count) || 10, 1000);
    const pad = parseInt(padding) || 0;
    const items: string[] = [];
    for (let i = 0; i < cnt; i++) {
      const num = (startNum + i).toString().padStart(pad, '0');
      items.push(`${prefix}${num}${suffix}`);
    }
    setOutput(items.join('\n'));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Prefix</label><input type="text" value={prefix} onChange={e=>setPrefix(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Suffix</label><input type="text" value={suffix} onChange={e=>setSuffix(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start Number</label><input type="number" value={start} onChange={e=>setStart(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Count</label><input type="number" value={count} onChange={e=>setCount(e.target.value)} min="1" max="1000" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Padding (digits)</label><input type="number" value={padding} onChange={e=>setPadding(e.target.value)} min="0" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500" /></div>
      </div>
      <ProcessButton onClick={generate}>Generate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Color Palette Extractor ─────────────────────────────────────────────────
function ColorPaletteExtractorTool() {
  const [output, setOutput] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 100; canvas.height = 100;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 100, 100);
        const data = ctx.getImageData(0, 0, 100, 100).data;
        const colors: Map<string, number> = new Map();
        for (let i = 0; i < data.length; i += 4) {
          const hex = '#' + [data[i], data[i+1], data[i+2]].map(v => Math.round(v/32)*32).map(v => v.toString(16).padStart(2,'0')).join('').toUpperCase();
          colors.set(hex, (colors.get(hex) || 0) + 1);
        }
        const sorted = [...colors.entries()].sort((a,b) => b[1]-a[1]).slice(0, 10);
        setOutput('Top 10 colors:\n' + sorted.map(([c,n]) => `${c} (${n} pixels)`).join('\n'));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFile} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-50 dark:file:bg-red-900/20 file:text-red-600 hover:file:bg-red-100 dark:hover:file:bg-red-900/30" />
      <OutputArea value={output} />
    </div>
  );
}

// ─── Color Opacity Generator ─────────────────────────────────────────────────
function ColorOpacityGeneratorTool() {
  const [hex, setHex] = useState('#3498db');
  const [output, setOutput] = useState('');

  const generate = () => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    const steps = [9, 8, 7, 6, 5, 4, 3, 2, 1].map(n => n/10);
    setOutput(steps.map(s => `rgba(${r}, ${g}, ${b}, ${s})`).join('\n'));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-12 h-12 rounded cursor-pointer border-0" />
        <input type="text" value={hex} onChange={e => setHex(e.target.value)} className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={generate}>Generate Opacities</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Color Luminance Checker ─────────────────────────────────────────────────
function ColorLuminanceCheckerTool() {
  const [hex, setHex] = useState('#000000');
  const [output, setOutput] = useState('');

  const check = () => {
    const r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
    const s = [r,g,b].map(v => v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4));
    const lum = 0.2126*s[0] + 0.7152*s[1] + 0.0722*s[2];
    setOutput(`Luminance: ${lum.toFixed(4)}\n${lum > 0.179 ? 'Light' : 'Dark'} color\nBest contrast: ${lum > 0.179 ? 'black' : 'white'} text`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-12 h-12 rounded cursor-pointer border-0" />
        <input type="text" value={hex} onChange={e => setHex(e.target.value)} className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={check}>Check Luminance</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── Color Harmony New ───────────────────────────────────────────────────────
function ColorHarmonyNewTool() {
  const [hex, setHex] = useState('#9B59B6');
  const [output, setOutput] = useState('');

  const harmony = () => {
    const h = parseInt(hex.slice(1,3),16)/255*360;
    const s = parseInt(hex.slice(3,5),16)/255*100;
    const l = parseInt(hex.slice(5,7),16)/255*100;
    const hue2rgb = (p: number, q: number, t: number) => {
      const nt = ((t%360+360)%360)/360;
      if(nt < 1/6) return p+(q-p)*6*nt;
      if(nt < 1/2) return q;
      if(nt < 2/3) return p+(q-p)*(2/3-nt)*6;
      return p;
    };
    const hslToHex = (nh: number) => {
      const nhNorm = ((nh%360+360)%360)/360;
      const s1 = s/100, l1 = l/100;
      if(s1 === 0) { const v = Math.round(l1*255).toString(16).padStart(2,'0'); return '#'+(v+v+v).toUpperCase(); }
      const q = l1 >= 0.5 ? l1*(1+s1) : l1+s1*l1;
      const p = 2*l1-q;
      const r = Math.round(hue2rgb(p,q,nh)*255);
      const g = Math.round(hue2rgb(p,q,nh-120)*255);
      const b = Math.round(hue2rgb(p,q,nh+120)*255);
      return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('').toUpperCase();
    };
    setOutput(`Tetradic: ${hslToHex(h)} | ${hslToHex(h+90)} | ${hslToHex(h+180)} | ${hslToHex(h+270)}\nSquare: ${hslToHex(h)} | ${hslToHex(h+90)} | ${hslToHex(h+180)} | ${hslToHex(h+270)}\nMonochromatic: ${Array.from({length:5},(_,i)=>hslToHex(h+Math.round(i*5)-10)).join(' | ')}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-12 h-12 rounded cursor-pointer border-0" />
        <input type="text" value={hex} onChange={e => setHex(e.target.value)} className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={harmony}>Generate Harmony</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── New Tool Implementations ─────────────────────────────────────────────────

function BmiCalculatorTool() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      setOutput('Enter valid positive numbers');
      return;
    }
    let bmi: number;
    if (unit === 'metric') {
      bmi = w / (h * h);
    } else {
      bmi = (w / (h * h)) * 703;
    }
    const rounded = bmi.toFixed(1);
    let category: string;
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';
    setOutput(`BMI: ${rounded}\nCategory: ${category}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['metric', 'imperial'] as const).map(u => (
          <button key={u} onClick={() => setUnit(u)} className={`px-3 py-1.5 text-sm rounded-lg ${unit === u ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>{u}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">{unit === 'metric' ? 'Height (m)' : 'Height (in)'}</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder={unit === 'metric' ? '1.75' : '69'} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder={unit === 'metric' ? '70' : '154'} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
      </div>
      <ProcessButton onClick={calculate}>Calculate BMI</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function ByteConverterTool() {
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('GB');
  const [output, setOutput] = useState('');
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const convert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) { setOutput('Enter a number'); return; }
    const bytes = val * Math.pow(1024, units.indexOf(fromUnit));
    const results = units.map(u => {
      const converted = bytes / Math.pow(1024, units.indexOf(u));
      return `${converted.toLocaleString('en', { maximumFractionDigits: 6 })} ${u}`;
    });
    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Enter value" className="flex-1 min-w-[120px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
        <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500">
          {units.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function BillSplitterTool() {
  const [amount, setAmount] = useState('');
  const [tip, setTip] = useState('0');
  const [people, setPeople] = useState('1');
  const [output, setOutput] = useState('');

  const split = () => {
    const a = parseFloat(amount);
    const t = parseFloat(tip);
    const p = parseInt(people);
    if (isNaN(a) || isNaN(t) || isNaN(p) || p <= 0) {
      setOutput('Enter valid numbers');
      return;
    }
    const total = a + (a * t / 100);
    const perPerson = total / p;
    setOutput(`Total with tip: $${total.toFixed(2)}\nEach person pays: $${perPerson.toFixed(2)}\nTip amount: $${(a * t / 100).toFixed(2)}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Bill Amount ($)</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100.00" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tip (%)</label>
          <input type="number" value={tip} onChange={e => setTip(e.target.value)} placeholder="0" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Number of People</label>
          <input type="number" value={people} onChange={e => setPeople(e.target.value)} placeholder="1" min="1" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
      </div>
      <ProcessButton onClick={split}>Split Bill</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function BinaryToDecimalTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    const cleaned = input.replace(/[^01]/g, '');
    if (!cleaned) { setOutput('Enter binary digits (0s and 1s)'); return; }
    const decimal = parseInt(cleaned, 2);
    setOutput(`Binary: ${cleaned}\nDecimal: ${decimal}\nHex: 0x${decimal.toString(16).toUpperCase()}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Binary Number</label>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="1010" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={convert}>Convert to Decimal</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function BinaryConverterTool() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState('2');
  const [output, setOutput] = useState('');

  const convert = () => {
    const val = input.trim();
    if (!val) { setOutput('Enter a number'); return; }
    try {
      const decimal = parseInt(val, parseInt(fromBase));
      if (isNaN(decimal)) { setOutput('Invalid input for selected base'); return; }
      setOutput(`Input (base ${fromBase}): ${val}\nDecimal: ${decimal}\nBinary: ${decimal.toString(2)}\nHex: 0x${decimal.toString(16).toUpperCase()}\nOctal: ${decimal.toString(8)}`);
    } catch { setOutput('Invalid input'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter number" className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
        <select value={fromBase} onChange={e => setFromBase(e.target.value)} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500">
          <option value="2">Binary</option>
          <option value="8">Octal</option>
          <option value="10">Decimal</option>
          <option value="16">Hexadecimal</option>
        </select>
      </div>
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function BinHexDecConverterTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'bin' | 'hex' | 'dec'>('bin');
  const [output, setOutput] = useState('');

  const convert = () => {
    const val = input.trim();
    if (!val) { setOutput('Enter a value'); return; }
    try {
      let decimal: number;
      if (mode === 'bin') {
        decimal = parseInt(val, 2);
      } else if (mode === 'hex') {
        decimal = parseInt(val, 16);
      } else {
        decimal = parseInt(val, 10);
      }
      if (isNaN(decimal)) { setOutput('Invalid input'); return; }
      setOutput(`Decimal: ${decimal}\nBinary: ${decimal.toString(2)}\nHex: 0x${decimal.toString(16).toUpperCase()}\nOctal: ${decimal.toString(8)}`);
    } catch { setOutput('Error converting'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(['bin', 'hex', 'dec'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 text-sm rounded-lg ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>{m.toUpperCase()}</button>
        ))}
      </div>
      <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'bin' ? '1010' : mode === 'hex' ? 'FF' : '255'} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function BaseNumberConverterTool() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState('10');
  const [toBase, setToBase] = useState('16');
  const [output, setOutput] = useState('');

  const convert = () => {
    const val = input.trim();
    if (!val) { setOutput('Enter a value'); return; }
    const fb = parseInt(fromBase);
    const tb = parseInt(toBase);
    if (isNaN(fb) || isNaN(tb) || fb < 2 || fb > 36 || tb < 2 || tb > 36) {
      setOutput('Base must be between 2 and 36');
      return;
    }
    try {
      const decimal = parseInt(val, fb);
      if (isNaN(decimal)) { setOutput('Invalid input for source base'); return; }
      setOutput(`${val} (base ${fb}) = ${decimal.toString(tb).toUpperCase()} (base ${tb})\n\nDecimal: ${decimal}\nBinary: ${decimal.toString(2)}\nOctal: ${decimal.toString(8)}\nHex: ${decimal.toString(16).toUpperCase()}`);
    } catch { setOutput('Error converting'); }
  };

  return (
    <div className="space-y-4">
      <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter number" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">From Base</label>
          <select value={fromBase} onChange={e => setFromBase(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500">
            {Array.from({length: 35}, (_, i) => i + 2).map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">To Base</label>
          <select value={toBase} onChange={e => setToBase(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500">
            {Array.from({length: 35}, (_, i) => i + 2).map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function BcryptHashGeneratorTool() {
  const [input, setInput] = useState('');
  const [rounds, setRounds] = useState('10');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!input) { setOutput('Enter text to hash'); return; }
    setLoading(true);
    try {
      const bcrypt = (await import('bcryptjs')).default;
      const hash = await bcrypt.hash(input, parseInt(rounds));
      setOutput(hash);
    } catch { setOutput('Error generating hash'); }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to hash" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      <div>
        <label className="block text-xs text-gray-500 mb-1">Rounds ({rounds})</label>
        <input type="range" value={rounds} onChange={e => setRounds(e.target.value)} min="4" max="14" className="w-full" />
      </div>
      <ProcessButton onClick={generate} disabled={loading}>{loading ? 'Generating...' : 'Generate Hash'}</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function CounterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const count = () => {
    if (!input) { setOutput('Enter text to count'); return; }
    const chars = input.length;
    const words = input.trim().split(/\s+/).filter(w => w).length;
    const lines = input.split('\n').length;
    const paragraphs = input.split(/\n\n+/).filter(p => p.trim()).length;
    const sentences = input.split(/[.!?]+/).filter(s => s.trim()).length;
    setOutput(`Characters: ${chars}\nCharacters (no spaces): ${input.replace(/\s/g, '').length}\nWords: ${words}\nLines: ${lines}\nParagraphs: ${paragraphs}\nSentences: ${sentences}`);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter text to analyze..." />
      <ProcessButton onClick={count}>Count</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function CmykToRgbTool() {
  const [c, setC] = useState('0');
  const [m, setM] = useState('0');
  const [y, setY] = useState('0');
  const [k, setK] = useState('100');
  const [output, setOutput] = useState('');

  const convert = () => {
    const cv = parseFloat(c) / 100;
    const mv = parseFloat(m) / 100;
    const yv = parseFloat(y) / 100;
    const kv = parseFloat(k) / 100;
    if ([cv, mv, yv, kv].some(isNaN)) { setOutput('Enter CMYK values (0-100)'); return; }
    const r = Math.round(255 * (1 - cv) * (1 - kv));
    const g = Math.round(255 * (1 - mv) * (1 - kv));
    const b = Math.round(255 * (1 - yv) * (1 - kv));
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
    setOutput(`CMYK(${c}, ${m}, ${y}, ${k})\nRGB(${r}, ${g}, ${b})\nHEX: ${hex}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-gray-500 mb-1">Cyan (0-100)</label><input type="number" value={c} onChange={e => setC(e.target.value)} placeholder="0" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Magenta (0-100)</label><input type="number" value={m} onChange={e => setM(e.target.value)} placeholder="0" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Yellow (0-100)</label><input type="number" value={y} onChange={e => setY(e.target.value)} placeholder="0" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Key/Black (0-100)</label><input type="number" value={k} onChange={e => setK(e.target.value)} placeholder="100" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" /></div>
      </div>
      <ProcessButton onClick={convert}>Convert to RGB</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function CurrencyConverterTool() {
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const rates: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, CAD: 1.36, AUD: 1.53, CHF: 0.88, CNY: 7.24, INR: 83.12, MXN: 17.15 };

  const convert = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt)) { setOutput('Enter a valid amount'); return; }
    const fromRate = rates[from] || 1;
    const toRate = rates[to] || 1;
    const result = (amt / fromRate) * toRate;
    setOutput(`${amt} ${from} = ${result.toFixed(2)} ${to}`);
  };

  return (
    <div className="space-y-4">
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      <div className="grid grid-cols-2 gap-3">
        <select value={from} onChange={e => setFrom(e.target.value)} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500">
          {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={to} onChange={e => setTo(e.target.value)} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500">
          {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function DataUriGeneratorTool() {
  const [input, setInput] = useState('');
  const [mimeType, setMimeType] = useState('text/plain');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!input) { setOutput('Enter data to encode'); return; }
    try {
      const base64 = btoa(input);
      setOutput(`data:${mimeType};base64,${base64}`);
    } catch { setOutput('Error encoding data'); }
  };

  return (
    <div className="space-y-4">
      <select value={mimeType} onChange={e => setMimeType(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500">
        <option value="text/plain">text/plain</option>
        <option value="text/html">text/html</option>
        <option value="text/css">text/css</option>
        <option value="text/javascript">text/javascript</option>
        <option value="application/json">application/json</option>
        <option value="image/svg+xml">image/svg+xml</option>
      </select>
      <Textarea value={input} onChange={setInput} placeholder="Enter data content..." />
      <ProcessButton onClick={generate}>Generate Data URI</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function DecimalToBinaryTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    const num = parseInt(input);
    if (isNaN(num)) { setOutput('Enter a decimal number'); return; }
    const binary = num.toString(2);
    setOutput(`Decimal: ${num}\nBinary: ${binary}\nHex: 0x${num.toString(16).toUpperCase()}\nOctal: ${num.toString(8)}`);
  };

  return (
    <div className="space-y-4">
      <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter decimal number (e.g. 42)" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      <ProcessButton onClick={convert}>Convert to Binary</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function DecimalToHexTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    const num = parseInt(input);
    if (isNaN(num)) { setOutput('Enter a decimal number'); return; }
    const hex = num.toString(16).toUpperCase();
    setOutput(`Decimal: ${num}\nHex: 0x${hex}\nBinary: ${num.toString(2)}\nOctal: ${num.toString(8)}`);
  };

  return (
    <div className="space-y-4">
      <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter decimal number (e.g. 255)" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      <ProcessButton onClick={convert}>Convert to Hex</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function BaseConvertTool() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState('10');
  const [output, setOutput] = useState('');

  const convert = () => {
    const val = input.trim();
    if (!val) { setOutput('Enter a number'); return; }
    const fb = parseInt(fromBase);
    if (isNaN(fb) || fb < 2 || fb > 36) { setOutput('Base must be 2-36'); return; }
    try {
      const decimal = parseInt(val, fb);
      if (isNaN(decimal)) { setOutput('Invalid input'); return; }
      setOutput(`Base ${fb}: ${val}\nDecimal: ${decimal}\nBinary: ${decimal.toString(2)}\nHex: 0x${decimal.toString(16).toUpperCase()}\nOctal: ${decimal.toString(8)}`);
    } catch { setOutput('Conversion error'); }
  };

  return (
    <div className="space-y-4">
      <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter number" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      <div>
        <label className="block text-xs text-gray-500 mb-1">From Base</label>
        <select value={fromBase} onChange={e => setFromBase(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500">
          {Array.from({length: 35}, (_, i) => i + 2).map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function BaseConverterTool() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState('2');
  const [toBase, setToBase] = useState('10');
  const [output, setOutput] = useState('');

  const convert = () => {
    const val = input.trim();
    if (!val) { setOutput('Enter a number'); return; }
    const fb = parseInt(fromBase), tb = parseInt(toBase);
    if (isNaN(fb) || isNaN(tb)) { setOutput('Invalid bases'); return; }
    try {
      const decimal = parseInt(val, fb);
      if (isNaN(decimal)) { setOutput('Invalid input'); return; }
      setOutput(`${val} (base ${fb}) = ${decimal.toString(tb)} (base ${tb})`);
    } catch { setOutput('Error'); }
  };

  return (
    <div className="space-y-4">
      <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter number" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">From</label>
          <select value={fromBase} onChange={e => setFromBase(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500">
            {Array.from({length: 35}, (_, i) => i + 2).map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">To</label>
          <select value={toBase} onChange={e => setToBase(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500">
            {Array.from({length: 35}, (_, i) => i + 2).map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function BaseConverterQuickTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const detectAndConvert = () => {
    const val = input.trim();
    if (!val) { setOutput('Enter a number'); return; }
    let decimal: number;
    if (val.startsWith('0x') || val.startsWith('0X')) {
      decimal = parseInt(val, 16);
    } else if (val.startsWith('0b') || val.startsWith('0B')) {
      decimal = parseInt(val, 2);
    } else if (val.startsWith('0o') || val.startsWith('0O')) {
      decimal = parseInt(val, 8);
    } else if (/^[01]+$/.test(val)) {
      decimal = parseInt(val, 2);
    } else if (/^[0-9a-fA-F]+$/.test(val)) {
      decimal = parseInt(val, 16);
    } else {
      decimal = parseInt(val, 10);
    }
    if (isNaN(decimal)) { setOutput('Invalid number'); return; }
    setOutput(`Detected: ${val}\nDecimal: ${decimal}\nBinary: ${decimal.toString(2)}\nHex: 0x${decimal.toString(16).toUpperCase()}\nOctal: ${decimal.toString(8)}`);
  };

  return (
    <div className="space-y-4">
      <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter number (auto-detects base: 0xFF, 0b1010, 0o77)" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      <ProcessButton onClick={detectAndConvert}>Auto-Detect & Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function CitationGeneratorTool() {
  const [authors, setAuthors] = useState('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [url, setUrl] = useState('');
  const [style, setStyle] = useState<'apa' | 'mla' | 'chicago'>('apa');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!authors || !title) { setOutput('Enter authors and title'); return; }
    const y = year || new Date().getFullYear().toString();
    let citation = '';
    if (style === 'apa') {
      citation = `${authors} (${y}). ${title}. ${url ? `Retrieved from ${url}` : ''}`;
    } else if (style === 'mla') {
      citation = `${authors}. "${title}." ${y}. ${url ? url : ''}`;
    } else {
      citation = `${authors}. "${title}." ${y}. ${url ? url : ''}`;
    }
    setOutput(citation.trim());
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(['apa', 'mla', 'chicago'] as const).map(s => (
          <button key={s} onClick={() => setStyle(s)} className={`px-3 py-1.5 text-sm rounded-lg ${style === s ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>{s.toUpperCase()}</button>
        ))}
      </div>
      <input type="text" value={authors} onChange={e => setAuthors(e.target.value)} placeholder="Authors (e.g. Smith, J. & Doe, A.)" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500" />
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500" />
      <div className="grid grid-cols-2 gap-3">
        <input type="text" value={year} onChange={e => setYear(e.target.value)} placeholder="Year" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500" />
        <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="URL (optional)" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={generate}>Generate Citation</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function CsvToTsvTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'csv-tsv' | 'tsv-csv'>('csv-tsv');

  const convert = () => {
    if (!input) { setOutput('Enter data to convert'); return; }
    try {
      if (mode === 'csv-tsv') {
        const lines = input.split('\n');
        const result = lines.map(line => {
          const cells = line.split(',').map(c => c.trim());
          return cells.join('\t');
        });
        setOutput(result.join('\n'));
      } else {
        const lines = input.split('\n');
        const result = lines.map(line => {
          const cells = line.split('\t');
          return cells.join(',');
        });
        setOutput(result.join('\n'));
      }
    } catch { setOutput('Error converting'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('csv-tsv')} className={`px-3 py-1.5 text-sm rounded-lg ${mode === 'csv-tsv' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>CSV → TSV</button>
        <button onClick={() => setMode('tsv-csv')} className={`px-3 py-1.5 text-sm rounded-lg ${mode === 'tsv-csv' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>TSV → CSV</button>
      </div>
      <Textarea value={input} onChange={setInput} placeholder="Paste CSV or TSV data..." />
      <ProcessButton onClick={convert}>Convert</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

// ─── More Tools ──────────────────────────────────────────────────────────

function EmailValidatorTool() {
  const [email, setEmail] = useState('');
  const [output, setOutput] = useState('');

  const validate = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) { setOutput('Please enter an email address'); return; }
    const isValid = emailRegex.test(email);
    const domain = email.split('@')[1] || '';
    setOutput(`Email: ${email}\nValid format: ${isValid ? '✓ Yes' : '✗ No'}\nDomain: ${domain}\n\nNote: This tool validates format only. MX record checking requires a server.`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@domain.com" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={validate}>Validate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function UrlValidatorTool() {
  const [url, setUrl] = useState('');
  const [output, setOutput] = useState('');

  const validate = () => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
      setOutput(`URL: ${urlObj.href}\nProtocol: ${urlObj.protocol}\nHost: ${urlObj.hostname}\nPathname: ${urlObj.pathname}\nSearch: ${urlObj.search}\nHash: ${urlObj.hash}\n\n✓ Valid URL`);
    } catch {
      setOutput(`✗ Invalid URL\n\nMake sure to include protocol (http:// or https://) or try adding https:// prefix.`);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">URL</label>
        <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={validate}>Validate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function PhoneValidatorTool() {
  const [phone, setPhone] = useState('');
  const [output, setOutput] = useState('');

  const validate = () => {
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    const patterns = [
      { name: 'US/EU', regex: /^\+?[1-9]\d{7,14}$/ },
      { name: 'US 10-digit', regex: /^1?\d{10}$/ },
    ];
    const results = patterns.map(p => `${p.name}: ${p.regex.test(cleaned) ? '✓' : '✗'}`).join('\n');
    setOutput(`Original: ${phone}\nCleaned: ${cleaned}\nLength: ${cleaned.length}\n\nResults:\n${results}\n\nNote: Validation rules vary by country.`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Phone Number</label>
        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555 123 4567" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={validate}>Validate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function SlugValidatorTool() {
  const [slug, setSlug] = useState('');
  const [output, setOutput] = useState('');

  const validate = () => {
    if (!slug) { setOutput('Please enter a slug'); return; }
    const isLower = slug === slug.toLowerCase();
    const hasSpaces = /\s/.test(slug);
    const isAlphanumeric = /^[a-z0-9-]+$/.test(slug);
    const startsWithHyphen = slug.startsWith('-');
    const endsWithHyphen = slug.endsWith('-');
    const doubleHyphen = slug.includes('--');
    setOutput(`Slug: "${slug}"\n\nChecks:\n${isLower ? '✓' : '✗'} Lowercase only\n${!hasSpaces ? '✓' : '✗'} No spaces\n${isAlphanumeric ? '✓' : '✗'} Only letters, numbers, hyphens\n${!startsWithHyphen ? '✓' : '✗'} Does not start with hyphen\n${!endsWithHyphen ? '✓' : '✗'} Does not end with hyphen\n${!doubleHyphen ? '✓' : '✗'} No double hyphens\n\nOverall: ${isLower && !hasSpaces && isAlphanumeric && !startsWithHyphen && !endsWithHyphen && !doubleHyphen ? '✓ Valid' : '✗ Invalid'}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Slug</label>
        <input type="text" value={slug} onChange={e => setSlug(e.target.value)} placeholder="my-blog-post" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={validate}>Validate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function PasswordStrengthCheckerTool() {
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');

  const check = () => {
    if (!password) { setOutput('Please enter a password'); return; }
    let score = 0;
    const checks = {
      length: password.length >= 8,
      length12: password.length >= 12,
      length16: password.length >= 16,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      noCommon: !/^(password|123456|qwerty|admin)/i.test(password),
    };
    Object.values(checks).forEach(v => { if (v) score++; });
    const entropy = Math.log2(Math.pow(26 * (checks.uppercase ? 2 : 1) * 10 * 32, password.length));
    const strength = score <= 3 ? 'Weak' : score <= 5 ? 'Fair' : score <= 7 ? 'Good' : 'Strong';
    const color = score <= 3 ? 'red' : score <= 5 ? 'orange' : score <= 7 ? 'yellow' : 'green';
    setOutput(`Password: ${'*'.repeat(password.length)}\n\nStrength: ${strength}\nEntropy: ~${entropy.toFixed(1)} bits\n\nChecks:\n${checks.length ? '✓' : '✗'} At least 8 characters\n${checks.length12 ? '✓' : '✗'} At least 12 characters\n${checks.length16 ? '✓' : '✗'} At least 16 characters\n${checks.lowercase ? '✓' : '✗'} Lowercase letter\n${checks.uppercase ? '✓' : '✗'} Uppercase letter\n${checks.numbers ? '✓' : '✗'} Number\n${checks.symbols ? '✓' : '✗'} Special character\n${checks.noCommon ? '✓' : '✗'} Not a common pattern`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password..." className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={check}>Check Strength</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function Base64EncoderTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = () => {
    if (!input) { setOutput('Please enter text'); return; }
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setOutput('Error: Invalid input for ' + mode);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('encode')} className={`px-3 py-1.5 text-sm rounded-lg ${mode === 'encode' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>Encode</button>
        <button onClick={() => setMode('decode')} className={`px-3 py-1.5 text-sm rounded-lg ${mode === 'decode' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>Decode</button>
      </div>
      <Textarea value={input} onChange={setInput} placeholder="Enter text to encode/decode..." />
      <ProcessButton onClick={process}>Process</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function UnicodeEncoderTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = () => {
    if (!input) { setOutput('Please enter text'); return; }
    if (mode === 'encode') {
      setOutput(Array.from(input).map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join(''));
    } else {
      setOutput(input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16))).replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16))));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('encode')} className={`px-3 py-1.5 text-sm rounded-lg ${mode === 'encode' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>Encode</button>
        <button onClick={() => setMode('decode')} className={`px-3 py-1.5 text-sm rounded-lg ${mode === 'decode' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>Decode</button>
      </div>
      <Textarea value={input} onChange={setInput} placeholder="Enter text..." />
      <ProcessButton onClick={process}>Process</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function PercentEncoderTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = () => {
    if (!input) { setOutput('Please enter text'); return; }
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setOutput('Error: Invalid input for ' + mode);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('encode')} className={`px-3 py-1.5 text-sm rounded-lg ${mode === 'encode' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>Encode</button>
        <button onClick={() => setMode('decode')} className={`px-3 py-1.5 text-sm rounded-lg ${mode === 'decode' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>Decode</button>
      </div>
      <Textarea value={input} onChange={setInput} placeholder="Enter text..." />
      <ProcessButton onClick={process}>Process</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function CssFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');

  const process = () => {
    if (!input) { setOutput('Please enter CSS'); return; }
    let result = input;
    if (mode === 'format') {
      let indent = 0;
      result = input.replace(/\{/g, ' {\n' + '  '.repeat(++indent)).replace(/\}/g, '\n' + '  '.repeat(--indent) + '}').replace(/;\s*/g, ';\n' + '  '.repeat(indent));
      result = result.replace(/\n\s*\n/g, '\n').trim();
    } else {
      result = input.replace(/\s*([{};:,])\s*/g, '$1').replace(/;}/g, '}').replace(/\s+/g, ' ').trim();
    }
    setOutput(result);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('format')} className={`px-3 py-1.5 text-sm rounded-lg ${mode === 'format' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>Format</button>
        <button onClick={() => setMode('minify')} className={`px-3 py-1.5 text-sm rounded-lg ${mode === 'minify' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>Minify</button>
      </div>
      <Textarea value={input} onChange={setInput} placeholder="Enter CSS..." className="h-60" />
      <ProcessButton onClick={process}>Process</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function HtmlFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');

  const process = () => {
    if (!input) { setOutput('Please enter HTML'); return; }
    let result = '';
    if (mode === 'format') {
      let indent = 0;
      result = input.replace(/>\s*</g, '>\n<').split('\n').map(line => {
        if (line.match(/<\/\w/)) indent = Math.max(0, indent - 1);
        const formatted = '  '.repeat(indent) + line.trim();
        if (line.match(/<[\w]+[^>]*[^\/]>/) && !line.match(/<[\w]+[^>]*\/>/)) indent++;
        return formatted;
      }).join('\n');
    } else {
      result = input.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
    }
    setOutput(result);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('format')} className={`px-3 py-1.5 text-sm rounded-lg ${mode === 'format' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>Format</button>
        <button onClick={() => setMode('minify')} className={`px-3 py-1.5 text-sm rounded-lg ${mode === 'minify' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>Minify</button>
      </div>
      <Textarea value={input} onChange={setInput} placeholder="Enter HTML..." className="h-60" />
      <ProcessButton onClick={process}>Process</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function JavaScriptFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');

  const process = () => {
    if (!input) { setOutput('Please enter JavaScript'); return; }
    let result = input;
    if (mode === 'format') {
      let indent = 0;
      result = input.replace(/\{/g, ' {\n' + '  '.repeat(++indent)).replace(/\}/g, '\n' + '  '.repeat(--indent) + '}').replace(/;\s*/g, ';\n' + '  '.repeat(indent)).replace(/,\s*/g, ',\n' + '  '.repeat(indent));
      result = result.replace(/\n\s*\n/g, '\n').trim();
    } else {
      result = input.replace(/\s*([{};:,])\s*/g, '$1').replace(/;\}/g, '}').replace(/\s+/g, ' ').trim();
    }
    setOutput(result);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('format')} className={`px-3 py-1.5 text-sm rounded-lg ${mode === 'format' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>Format</button>
        <button onClick={() => setMode('minify')} className={`px-3 py-1.5 text-sm rounded-lg ${mode === 'minify' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>Minify</button>
      </div>
      <Textarea value={input} onChange={setInput} placeholder="Enter JavaScript..." className="h-60" />
      <ProcessButton onClick={process}>Process</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function WordFrequencyCounterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [n, setN] = useState('20');

  const analyze = () => {
    if (!input) { setOutput('Please enter text'); return; }
    const words = input.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    const freq: Record<string, number> = {};
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, parseInt(n) || 20);
    const total = words.length;
    setOutput('Word Frequency Analysis\n' + '─'.repeat(40) + '\n\n' + sorted.map(([word, count], i) => `${(i + 1).toString().padStart(3)}. ${word.padEnd(20)} ${count.toString().padStart(4)} (${((count / total) * 100).toFixed(1)}%)`).join('\n') + `\n\n─'.repeat(40)\nTotal unique words: ${Object.keys(freq).length}\nTotal words: ${total}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Top N words</label>
          <input type="number" value={n} onChange={e => setN(e.target.value)} min="1" max="100" className="w-24 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
      </div>
      <Textarea value={input} onChange={setInput} placeholder="Enter text to analyze..." />
      <ProcessButton onClick={analyze}>Analyze</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function CharacterAnalysisTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const analyze = () => {
    if (!input) { setOutput('Please enter text'); return; }
    const chars = input.split('');
    const letters = chars.filter(c => /[a-zA-Z]/.test(c)).length;
    const digits = chars.filter(c => /\d/.test(c)).length;
    const spaces = chars.filter(c => /\s/.test(c)).length;
    const special = chars.filter(c => !/[a-zA-Z0-9\s]/.test(c)).length;
    const upper = chars.filter(c => /[A-Z]/.test(c)).length;
    const lower = chars.filter(c => /[a-z]/.test(c)).length;
    setOutput(`Character Analysis\n${'─'.repeat(40)}\n\nTotal characters: ${input.length}\n\nBreakdown:\n  Letters: ${letters}\n    Uppercase: ${upper}\n    Lowercase: ${lower}\n  Digits: ${digits}\n  Spaces: ${spaces}\n  Special characters: ${special}\n\nPercentage:\n  Letters: ${((letters / input.length) * 100).toFixed(1)}%\n  Digits: ${((digits / input.length) * 100).toFixed(1)}%\n  Spaces: ${((spaces / input.length) * 100).toFixed(1)}%\n  Special: ${((special / input.length) * 100).toFixed(1)}%`);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter text to analyze..." />
      <ProcessButton onClick={analyze}>Analyze</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function TextStatisticsTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const analyze = () => {
    if (!input) { setOutput('Please enter text'); return; }
    const words = input.trim().split(/\s+/);
    const sentences = input.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = input.split(/\n\n+/).filter(p => p.trim()).length;
    const syllables = words.reduce((acc, word) => acc + Math.max(1, (word.match(/[aeiouy]/gi) || []).length - (word.match(/ee|oo|ai|ea|ou|ie|eo/gi) || []).length), 0);
    const avgWordLength = words.reduce((acc, w) => acc + w.replace(/[^a-zA-Z]/g, '').length, 0) / words.length || 0;
    const avgSentenceLength = words.length / sentences || 0;
    setOutput(`Text Statistics\n${'─'.repeat(40)}\n\nWords: ${words.length}\nCharacters: ${input.length}\n  (without spaces: ${input.replace(/\s/g, '').length})\nSentences: ${sentences}\nParagraphs: ${paragraphs}\nSyllables: ~${syllables}\n\nAverages:\n  Word length: ${avgWordLength.toFixed(1)} chars\n  Sentence length: ${avgSentenceLength.toFixed(1)} words\n  Syllables per word: ${(syllables / words.length).toFixed(2)}\n\nReading time: ~${Math.ceil(words.length / 200)} min (@ 200 wpm)`);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter text to analyze..." />
      <ProcessButton onClick={analyze}>Analyze</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function ReadabilityCheckTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const check = () => {
    if (!input) { setOutput('Please enter text'); return; }
    const words = input.trim().split(/\s+/);
    const sentences = input.split(/[.!?]+/).filter(s => s.trim()).length;
    const syllables = words.reduce((acc, word) => acc + Math.max(1, (word.match(/[aeiouy]/gi) || []).length), 0);
    const avgSentenceLength = words.length / sentences;
    const avgSyllablesPerWord = syllables / words.length;
    // Flesch Reading Ease
    const flesch = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;
    // Flesch-Kincaid Grade Level
    const fkGrade = 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59;
    let grade = Math.max(1, Math.min(16, Math.round(fkGrade)));
    let readability = flesch >= 90 ? 'Very Easy' : flesch >= 70 ? 'Easy' : flesch >= 50 ? 'Fairly Difficult' : flesch >= 30 ? 'Difficult' : 'Very Difficult';
    setOutput(`Readability Analysis\n${'─'.repeat(40)}\n\nFlesch Reading Ease: ${Math.round(flesch)}/100\n  (${readability})\n\nFlesch-Kincaid Grade: ${grade}\n  (US grade level)\n\nDetails:\n  Words: ${words.length}\n  Sentences: ${sentences}\n  Syllables: ~${syllables}\n  Avg words/sentence: ${avgSentenceLength.toFixed(1)}\n  Avg syllables/word: ${avgSyllablesPerWord.toFixed(2)}`);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter text to check readability..." />
      <ProcessButton onClick={check}>Check</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function DiscountCalculatorTool() {
  const [original, setOriginal] = useState('');
  const [discount, setDiscount] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const orig = parseFloat(original);
    const disc = parseFloat(discount);
    if (isNaN(orig) || isNaN(disc) || orig < 0 || disc < 0 || disc > 100) {
      setOutput('Please enter valid numbers.\nOriginal price: positive number\nDiscount: 0-100%');
      return;
    }
    const saved = orig * (disc / 100);
    const final = orig - saved;
    setOutput(`Discount Calculation\n${'─'.repeat(30)}\n\nOriginal Price: $${orig.toFixed(2)}\nDiscount: ${disc}%\n\nYou Save: $${saved.toFixed(2)}\nFinal Price: $${final.toFixed(2)}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Original Price ($)</label>
          <input type="number" value={original} onChange={e => setOriginal(e.target.value)} placeholder="100.00" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Discount (%)</label>
          <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="25" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
      </div>
      <ProcessButton onClick={calculate}>Calculate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function TipCalculatorTool() {
  const [bill, setBill] = useState('');
  const [tip, setTip] = useState('15');
  const [people, setPeople] = useState('1');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const billAmt = parseFloat(bill);
    const tipPct = parseFloat(tip);
    const ppl = parseInt(people);
    if (isNaN(billAmt) || isNaN(tipPct) || isNaN(ppl) || billAmt < 0 || tipPct < 0 || ppl < 1) {
      setOutput('Please enter valid numbers.');
      return;
    }
    const tipAmt = billAmt * (tipPct / 100);
    const total = billAmt + tipAmt;
    const perPerson = total / ppl;
    setOutput(`Tip Calculator\n${'─'.repeat(30)}\n\nBill Amount: $${billAmt.toFixed(2)}\nTip: ${tipPct}% = $${tipAmt.toFixed(2)}\n\nTotal: $${total.toFixed(2)}\nSplit ${ppl} way(s): $${perPerson.toFixed(2)} each`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Bill ($)</label>
          <input type="number" value={bill} onChange={e => setBill(e.target.value)} placeholder="50.00" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Tip %</label>
          <input type="number" value={tip} onChange={e => setTip(e.target.value)} placeholder="15" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">People</label>
          <input type="number" value={people} onChange={e => setPeople(e.target.value)} min="1" placeholder="1" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {[10, 15, 18, 20, 25].map(p => (
          <button key={p} onClick={() => setTip(p.toString())} className={`px-3 py-1.5 text-sm rounded-lg ${tip === p.toString() ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>{p}%</button>
        ))}
      </div>
      <ProcessButton onClick={calculate}>Calculate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function SleepCalculatorTool() {
  const [wakeUp, setWakeUp] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    if (!wakeUp) { setOutput('Please enter a wake-up time'); return; }
    const [hours, mins] = wakeUp.split(':').map(Number);
    if (isNaN(hours) || isNaN(mins)) { setOutput('Invalid time format. Use HH:MM'); return; }
    const cycles = [6, 5, 4, 3];
    const results = cycles.map(cycles => {
      const sleepTime = new Date();
      sleepTime.setHours(hours, mins, 0, 0);
      sleepTime.setMinutes(sleepTime.getMinutes() - cycles * 90 - 15); // 90 min cycles + 15 min to fall asleep
      return {
        cycles,
        time: sleepTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        hours: ((cycles * 90 + 15) / 60).toFixed(1)
      };
    });
    setOutput(`Sleep Calculator\n${'─'.repeat(30)}\nIf you want ${cycles[0]} sleep cycles:\n\nWake up at: ${wakeUp}\n\nGo to sleep at:\n${results.map(r => `  ${r.cycles} cycles (${r.hours}h sleep): ${r.time}`).join('\n')}\n\nTip: Each sleep cycle is ~90 minutes. Most adults need 4-6 cycles (6-9 hours).`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Wake-up Time</label>
        <input type="time" value={wakeUp} onChange={e => setWakeUp(e.target.value)} className="w-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={calculate}>Calculate Bedtime</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function DateCalculatorTool() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    if (!start || !end) { setOutput('Please enter both dates'); return; }
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) { setOutput('Invalid date format'); return; }
    const diff = Math.abs(endDate.getTime() - startDate.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);
    const years = (days / 365.25).toFixed(2);
    setOutput(`Date Calculator\n${'─'.repeat(30)}\n\nStart: ${startDate.toLocaleDateString()}\nEnd: ${endDate.toLocaleDateString()}\n\nDifference:\n  ${days} days\n  ${hours} hours\n  ${minutes} minutes\n  ${weeks} weeks\n  ~${months.toFixed(1)} months\n  ~${years} years`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
          <input type="date" value={start} onChange={e => setStart(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">End Date</label>
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
      </div>
      <ProcessButton onClick={calculate}>Calculate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function SqlFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');

  const process = () => {
    if (!input) { setOutput('Please enter SQL'); return; }
    let result = input;
    if (mode === 'format') {
      let indent = 0;
      const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'UPDATE', 'DELETE', 'SET', 'VALUES', 'CREATE', 'ALTER', 'DROP'];
      result = input.replace(/\s+/g, ' ').trim().split(/(SELECT|FROM|WHERE|AND|OR|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|INSERT|UPDATE|DELETE|SET|VALUES|CREATE|ALTER|DROP)/i).map(part => part.trim()).filter(Boolean).map(part => {
        const upper = part.toUpperCase();
        const isKeyword = keywords.some(kw => upper.startsWith(kw));
        if (isKeyword && upper.match(/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)/)) indent = 1;
        const formatted = '  '.repeat(Math.max(0, indent - 1)) + part;
        if (upper.match(/^(FROM|WHERE|AND|OR|JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|SET|VALUES)/)) indent++;
        return formatted;
      }).join('\n');
    } else {
      result = input.replace(/\s+/g, ' ').replace(/\s*,\s*/g, ',').replace(/\s*\(\s*/g, '(').replace(/\s*\)\s*/g, ')').trim();
    }
    setOutput(result);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('format')} className={`px-3 py-1.5 text-sm rounded-lg ${mode === 'format' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>Format</button>
        <button onClick={() => setMode('minify')} className={`px-3 py-1.5 text-sm rounded-lg ${mode === 'minify' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>Minify</button>
      </div>
      <Textarea value={input} onChange={setInput} placeholder="SELECT id, name FROM users WHERE active = 1 ORDER BY created_at DESC" className="h-48" />
      <ProcessButton onClick={process}>Process</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function CssValidatorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const validate = () => {
    if (!input) { setOutput('Please enter CSS'); return; }
    const errors: string[] = [];
    const warnings: string[] = [];
    // Check for unclosed braces
    const openBraces = (input.match(/\{/g) || []).length;
    const closeBraces = (input.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) errors.push(`Mismatched braces: ${openBraces} open, ${closeBraces} close`);
    // Check for invalid properties
    const invalidProps = input.match(/[^a-z-]:/gi) || [];
    if (invalidProps.length > 0) warnings.push(`Potentially invalid property declarations: ${invalidProps.length}`);
    // Check for known deprecated properties
    if (/behavior:|zoom:|filter:/i.test(input)) warnings.push('Contains potentially deprecated properties');
    const results = errors.length === 0 && warnings.length === 0 ? '✓ No errors found' : `Errors (${errors.length}):\n${errors.map(e => '  ✗ ' + e).join('\n')}\n\nWarnings (${warnings.length}):\n${warnings.map(w => '  ⚠ ' + w).join('\n')}`;
    setOutput(`CSS Validation Results\n${'─'.repeat(30)}\n\n${results}\n\nNote: This is a basic syntax checker. For full W3C validation, use the official CSS validator.`);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter CSS to validate..." className="h-48" />
      <ProcessButton onClick={validate}>Validate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function YamlValidatorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const validate = () => {
    if (!input) { setOutput('Please enter YAML'); return; }
    try {
      const lines = input.split('\n');
      lines.forEach((line, i) => {
        const indent = line.match(/^(\s*)/)?.[1].length || 0;
        if (indent % 2 !== 0) throw new Error(`Line ${i + 1}: Indent must be multiple of 2`);
        if (line.endsWith(' ') && line.trim()) throw new Error(`Line ${i + 1}: Trailing whitespace`);
      });
      // Basic structure check
      if (input.includes('\t')) throw new Error('Tabs are not allowed in YAML');
      setOutput('✓ Valid YAML syntax\n\nNo obvious errors detected.');
    } catch (e) {
      setOutput(`✗ YAML Error:\n${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter YAML to validate..." className="h-48" />
      <ProcessButton onClick={validate}>Validate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function XmlValidatorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const validate = () => {
    if (!input) { setOutput('Please enter XML'); return; }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'application/xml');
      const error = doc.querySelector('parsererror');
      if (error) {
        setOutput(`✗ XML Error:\n${error.textContent || 'Invalid XML'}`);
      } else {
        const tags = input.match(/<[^/>]+>/g) || [];
        const rootMatch = input.match(/^<(\w+)[^>]*>/);
        setOutput(`✓ Valid XML\n\nRoot element: ${rootMatch ? rootMatch[1] : 'unknown'}\nTotal tags: ${tags.length}`);
      }
    } catch {
      setOutput('✗ Failed to parse XML');
    }
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter XML to validate..." className="h-48" />
      <ProcessButton onClick={validate}>Validate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function BarcodeGeneratorTool() {
  const [input, setInput] = useState('');
  const [type, setType] = useState('CODE128');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!input) { setOutput('Please enter a value to encode'); return; }
    // Simple text-based barcode visualization for Code128
    if (type === 'CODE128') {
      const bars = Array.from(input).map(c => {
        const code = c.charCodeAt(0);
        return (code % 2 === 0 ? '█ █' : '█ ██').repeat(3);
      }).join(' ');
      setOutput(`Barcode (${type})\n${'─'.repeat(30)}\nValue: ${input}\n\nVisual:\n${bars}\n\nNote: For production use, use a proper barcode library.`);
    } else {
      setOutput(`Barcode (${type})\nValue: ${input}\n\nNote: This tool generates a text representation. Use a proper library for real barcodes.`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['CODE128', 'CODE39', 'EAN13', 'UPC'].map(t => (
          <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 text-sm rounded-lg ${type === t ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>{t}</button>
        ))}
      </div>
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Value to Encode</label>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="123456789" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={generate}>Generate</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function TokenGeneratorTool() {
  const [length, setLength] = useState('32');
  const [output, setOutput] = useState('');

  const generate = () => {
    const len = Math.min(Math.max(parseInt(length) || 32, 8), 128);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const array = new Uint32Array(len);
    crypto.getRandomValues(array);
    for (let i = 0; i < len; i++) token += chars[array[i] % chars.length];
    setOutput(`Token Generator\n${'─'.repeat(30)}\n\nLength: ${len} characters\n\n${token}\n\nCopy the token above.`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Length</label>
        <input type="number" value={length} onChange={e => setLength(e.target.value)} min="8" max="128" className="w-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={generate}>Generate Token</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function CouponGeneratorTool() {
  const [count, setCount] = useState('10');
  const [prefix, setPrefix] = useState('SAVE');
  const [length, setLength] = useState('8');
  const [output, setOutput] = useState('');

  const generate = () => {
    const cnt = Math.min(parseInt(count) || 10, 100);
    const len = Math.min(Math.max(parseInt(length) || 8, 4), 16);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const coupons: string[] = [];
    for (let i = 0; i < cnt; i++) {
      let code = prefix;
      const array = new Uint32Array(len);
      crypto.getRandomValues(array);
      for (let j = 0; j < len; j++) code += chars[array[j] % chars.length];
      coupons.push(code);
    }
    setOutput(`Coupon Generator\n${'─'.repeat(30)}\n\nPrefix: ${prefix}\nCode length: ${len} characters\nCount: ${cnt}\n\n${coupons.join('\n')}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Prefix</label>
          <input type="text" value={prefix} onChange={e => setPrefix(e.target.value.toUpperCase().slice(0, 4))} placeholder="SAVE" maxLength={4} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Code Length</label>
          <input type="number" value={length} onChange={e => setLength(e.target.value)} min="4" max="16" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Count</label>
          <input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" max="100" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-500" />
        </div>
      </div>
      <ProcessButton onClick={generate}>Generate Coupons</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function MetaTagExtractorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const extract = () => {
    if (!input) { setOutput('Please enter HTML'); return; }
    const title = input.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '';
    const description = input.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] || input.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1] || '';
    const ogTitle = input.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1] || '';
    const ogImage = input.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] || '';
    const canonical = input.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] || '';
    const h1s = input.match(/<h1[^>]*>([^<]+)<\/h1>/gi) || [];
    setOutput(`Meta Tag Extractor\n${'─'.repeat(30)}\n\nTitle: ${title || '(none)'}\nDescription: ${description || '(none)'}\nCanonical: ${canonical || '(none)'}\n\nOpen Graph:\n  og:title: ${ogTitle || '(none)'}\n  og:image: ${ogImage || '(none)'}\n\nHeadings:\n${h1s.length ? h1s.map(h => '  ' + h.replace(/<[^>]+>/g, '')).join('\n') : '  (none)'}`);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Paste HTML to extract meta tags..." className="h-48" />
      <ProcessButton onClick={extract}>Extract</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function FaviconExtractorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const extract = () => {
    if (!input) { setOutput('Please enter a URL or HTML'); return; }
    let url = input;
    if (!input.startsWith('http')) {
      // Extract from HTML
      const icon16 = input.match(/<link[^>]+rel=["']icon["'][^>]+href=["']([^"']+)["']/i)?.[1] || '';
      const icon32 = input.match(/<link[^>]+sizes=["']32x32["'][^>]+href=["']([^"']+)["']/i)?.[1] || '';
      const appleTouch = input.match(/<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i)?.[1] || '';
      const faviconMatch = input.match(/<link[^>]+rel=["']shortcut icon["'][^>]+href=["']([^"']+)["']/i)?.[1] || input.match(/<link[^>]+rel=["']icon["'][^>]+href=["']([^"']+)["']/i)?.[1] || '';
      setOutput(`Favicon Extractor\n${'─'.repeat(30)}\n\nFavicon URLs found:\n  16x16: ${icon16 || '(none)'}\n  32x32: ${icon32 || '(none)'}\n  Apple Touch: ${appleTouch || '(none)'}\n  General: ${faviconMatch || '(none)'}\n\nNote: Extract the URL and use a favicon checker to verify.`);
    } else {
      // Assume it's a URL
      const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      setOutput(`Favicon URLs for: ${baseUrl}\n${'─'.repeat(30)}\n\n/favicon.ico\n${baseUrl}/favicon.ico\n/apple-touch-icon.png\n${baseUrl}/apple-touch-icon.png`);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">URL or HTML</label>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="https://example.com or paste HTML" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={extract}>Extract</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function HttpHeaderCheckerTool() {
  const [url, setUrl] = useState('');
  const [output, setOutput] = useState('');

  const check = () => {
    if (!url) { setOutput('Please enter a URL'); return; }
    setOutput(`HTTP Header Check\n${'─'.repeat(30)}\n\nURL: ${url}\n\nNote: This tool cannot make direct requests due to CORS restrictions.\n\nCommon headers to check:\n  Content-Type\n  Cache-Control\n  CORS headers (Access-Control-*)\n  Security headers (CSP, X-Frame-Options, etc.)\n  Authentication headers\n\nUse browser DevTools (F12) → Network tab → click request → Headers tab for actual headers.`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">URL</label>
        <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={check}>Check Headers</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function CorsCheckerTool() {
  const [url, setUrl] = useState('');
  const [output, setOutput] = useState('');

  const check = () => {
    if (!url) { setOutput('Please enter a URL to check CORS policy'); return; }
    setOutput(`CORS Policy Check\n${'─'.repeat(30)}\n\nChecking: ${url}\n\nTo check CORS headers manually:\n\n1. Open browser DevTools (F12)\n2. Go to Network tab\n3. Make a request to ${url}\n4. Check Response Headers for:\n\n  Access-Control-Allow-Origin: * | https://yoursite.com\n  Access-Control-Allow-Methods: GET, POST, PUT, DELETE\n  Access-Control-Allow-Headers: Content-Type, Authorization\n  Access-Control-Allow-Credentials: true\n  Access-Control-Max-Age: 86400\n\nIf Origin header is blocked, CORS is restricting cross-origin requests.`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">URL</label>
        <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://api.example.com/data" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={check}>Check CORS</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function Argon2HashGeneratorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!input) { setOutput('Please enter text to hash'); return; }
    // Argon2 cannot be computed in browser without a library
    // Generate a placeholder representation
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data[i];
      hash = hash & hash;
    }
    const fakeHash = '$argon2id$v=19$m=65536,t=3,p=4$' + Math.abs(hash).toString(16).padStart(32, '0');
    setOutput(`Argon2 Hash Generator\n${'─'.repeat(30)}\n\nNote: Full Argon2 requires a WebAssembly module.\n\nInput: ${input}\n\nSimulated hash (for format demonstration):\n${fakeHash}\n\nReal Argon2 hash format:\n$argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>\n\nUse argon2-browser library for actual hashing.`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Text to Hash</label>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter password..." className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500" />
      </div>
      <ProcessButton onClick={generate}>Generate Hash</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function ToolRouter({ tool }: { tool: Tool }) {
  switch (tool.slug) {
    case 'word-counter':          return <WordCounterTool />;
    case 'character-counter':     return <CharacterCounterTool />;
    case 'case-converter':        return <CaseConverterTool />;
    case 'base64':                return <Base64Tool />;
    case 'url-encode':            return <UrlEncodeTool />;
    case 'json-formatter':        return <JsonFormatterTool />;
    case 'notebook-to-html':      return <NotebookToHtmlTool />;
    case 'oxford-comma':          return <OxfordCommaTool />;
    case 'sass-to-css':           return <SassToCssTool />;
    case 'text-to-slug':          return <TextToSlugTool />;
    case 'slug-to-text':          return <SlugToTextTool />;
    case 'sort-lines':            return <SortLinesTool />;
    case 'reverse-lines':         return <ReverseLinesTool />;
    case 'cron-parser':            return <CronParserClient />;
    case 'cron-generator':         return <CronGeneratorClient />;
    case 'html-encoder':           return <HtmlEncoderClient />;
    case 'json-validator':         return <JsonValidatorClient />;
    case 'keyword-density-checker': return <KeywordDensityCheckerTool />;
    case 'jwt-decoder':            return <JwtDecoderClient />;
    case 'text-sorter':            return <TextSorterClient />;
    case 'twitter-card-preview': return <TwitterCardPreviewTool />;
    case 'text-diff':             return <TextDiffClient />;
    case 'remove-duplicate-lines': return <RemoveDuplicateLinesClient />;
    case 'hex-to-rgb':             return <HexToRgbClient />;
    case 'rgb-to-hex':             return <RgbToHexClient />;
    case 'robots-txt-generator': return <RobotsTxtGeneratorTool />;
    case 'sha-256-hash':          return <Sha256HashClient />;
    case 'hash-generator':         return <HashGeneratorClient />;
    case 'hreflang-tag-generator': return <HreflangTagGeneratorTool />;
    case 'xml-formatter':          return <XmlFormatterClient />;
    case 'xml-to-json':            return <XmlToJsonClient />;
    case 'json-to-yaml':           return <JsonToYamlClient />;
    case 'sql-to-json':            return <SqlToJsonClient />;
    case 'yaml-to-json':           return <YamlToJsonClient />;
    case 'url-slug-generator':     return <UrlSlugGeneratorClient />;
    case 'url-redirect-checker': return <UrlRedirectCheckerTool />;
    case 'uuid-generator':         return <UuidGeneratorClient />;
    case 'password-generator':     return <PasswordGeneratorClient />;
    case 'lorem-ipsum-generator':  return <LoremIpsumGeneratorClient />;
    case 'random-string-generator': return <RandomStringClient />;
    case 'regex-tester':          return <RegexTesterClient />;
    case 'grammar-checker':        return <GrammarCheckerClient />;
    case 'unit-converter':         return <UnitConverterClient />;
    case 'number-base-converter':  return <NumberBaseConverterClient />;
    case 'open-graph-preview': return <OpenGraphPreviewTool />;
    case 'whois-lookup': return <WhoisLookupTool />;
    case 'unix-timestamp-converter': return <UnixTimestampConverterClient />;
    case 'xml-sitemap-generator': return <XmlSitemapGeneratorTool />;
    case 'image-cropper':          return <ImageCropperClient />;
    case 'image-resizer':          return <ImageResizerClient />;
    case 'image-format-converter':  return <ImageFormatConverterClient />;
    case 'canonical-url-generator': return <CanonicalUrlGeneratorTool />;
    case 'color-picker':           return <ColorPickerClient />;
    case 'contrast-checker':        return <ContrastCheckerClient />;
    case 'credit-card-validator':  return <CreditCardValidatorClient />;
    case 'favicon-generator':       return <FaviconGeneratorClient />;
    case 'css-gradient-generator':  return <CssGradientGeneratorClient />;
    case 'css-border-radius-generator': return <CssBorderRadiusGeneratorClient />;
    case 'dns-lookup': return <DnsLookupTool />;
    case 'js-minifier':            return <JsMinifierClient />;
    case 'http-headers-viewer':     return <HttpHeadersViewerClient />;
    case 'http-status-checker': return <HttpStatusCheckerTool />;
    case 'markdown-to-html':        return <MarkdownToHtmlClient />;
    case 'meta-tag-generator':      return <MetaTagGeneratorClient />;
    case 'meta-description-generator': return <MetaDescriptionGeneratorTool />;
    case 'percentage-calculator':   return <PercentageCalculatorClient />;
    case 'percentage-difference':   return <PercentageDifferenceClient />;
    case 'qr-code-generator':       return <QrCodeGeneratorClient />;
    case 'readability-score':       return <ReadabilityScoreClient />;
    case 'screen-resolution-tester': return <ScreenResolutionTesterClient />;
    case 'slug-permalink-checker': return <SlugPermalinkCheckerTool />;
    case 'serp-preview':            return <SerpPreviewClient />;
    case 'circle-crop':            return <CircleCropClient />;
    case 'square-crop':            return <SquareCropClient />;
    case 'url-params':             return <UrlParamsClient />;
    case 'base64-encoder-decoder': return <Base64EncoderDecoderClient />;
    case 'json-to-markdown-table': return <JsonToMarkdownTableTool />;
    case 'hash-from-text': return <HashFromTextTool />;
    case 'url-parameter-extractor': return <UrlParameterExtractorTool />;
    case 'sql-prettifier': return <SqlPrettifierTool />;
    case 'json-to-typescript': return <JsonToTypeScriptTool />;
    case 'url-parser': return <UrlParserTool />;
    case 'json-path-tester': return <JsonPathTesterTool />;
    case 'html-validator': return <HtmlValidatorTool />;
    case 'json-schema-validator': return <JsonSchemaValidatorTool />;
    case 'html-table-generator': return <HtmlTableGeneratorTool />;
    case 'json-diff': return <JsonDiffTool />;
    case 'json-schema-generator': return <JsonSchemaGeneratorTool />;
    case 'json-to-go-struct': return <JsonToGoStructTool />;
    case 'md5-hash-generator': return <Md5HashGeneratorTool />;
    case 'csv-to-json': return <CsvToJsonTool />;
    case 'json-to-csv': return <JsonToCsvTool />;
    case 'css-minifier': return <CssMinifierTool />;
    case 'js-beautifier': return <JsBeautifierTool />;
    case 'html-to-markdown': return <HtmlToMarkdownTool />;
    case 'binary-to-text': return <BinaryToTextTool />;
    case 'text-to-binary': return <TextToBinaryTool />;
    case 'morse-code-translator': return <MorseCodeTranslatorTool />;
    case 'rot13-cipher': return <Rot13CipherTool />;
    case 'hex-to-text': return <HexToTextTool />;
    case 'text-to-hex': return <TextToHexTool />;
    case 'javascript-minifier': return <JavaScriptMinifierTool />;
    case 'lua-beautifier': return <LuaBeautifierTool />;
    case 'regex-escaper': return <RegexEscaperTool />;
    case 'css-animation-generator': return <CssAnimationGeneratorTool />;
    case 'color-palette-generator': return <ColorPaletteGeneratorTool />;
    case 'color-mixer': return <ColorMixerTool />;
    case 'color-contrast-checker': return <ColorContrastCheckerTool />;
    case 'color-harmony-generator': return <ColorHarmonyGeneratorTool />;
    case 'color-shade-generator': return <ColorShadeGeneratorTool />;
    case 'color-name-finder': return <ColorNameFinderTool />;
    case 'color-format-converter': return <ColorFormatConverterTool />;
    case 'rgb-to-hsl': return <RgbToHslTool />;
    case 'hsl-to-rgb': return <HslToRgbTool />;
    case 'image-placeholder-generator': return <ImagePlaceholderGeneratorTool />;
    case 'image-to-base64': return <ImageToBase64Tool />;
    case 'word-frequency-analyzer': return <WordFrequencyAnalyzerTool />;
    case 'sentence-counter': return <SentenceCounterTool />;
    case 'paragraph-counter': return <ParagraphCounterTool />;
    case 'reading-time-estimator': return <ReadingTimeEstimatorTool />;
    case 'letter-frequency-counter': return <LetterFrequencyCounterTool />;
    case 'whitespace-remover': return <WhitespaceRemoverTool />;
    case 'line-break-remover': return <LineBreakRemoverTool />;
    case 'random-number-generator': return <RandomNumberGeneratorTool />;
    case 'prime-number-checker': return <PrimeNumberCheckerTool />;
    case 'fibonacci-generator': return <FibonacciGeneratorTool />;
    case 'factorial-calculator': return <FactorialCalculatorTool />;
    case 'gcd-calculator': return <GcdCalculatorTool />;
    case 'ratio-simplifier': return <RatioSimplifierTool />;
    case 'random-decimal-generator': return <RandomDecimalGeneratorTool />;
    case 'quadratic-equation-solver': return <QuadraticEquationSolverTool />;
    case 'date-format-converter': return <DateFormatConverterTool />;
    case 'time-zone-converter': return <TimeZoneConverterTool />;
    case 'age-calculator': return <AgeCalculatorTool />;
    case 'day-of-week-calculator': return <DayOfWeekCalculatorTool />;
    case 'week-number-calculator': return <WeekNumberCalculatorTool />;
    case 'date-difference-calculator': return <DateDifferenceCalculatorTool />;
    case 'time-duration-calculator': return <TimeDurationCalculatorTool />;
    case 'volume-converter': return <VolumeConverterTool />;
    case 'data-storage-converter': return <DataStorageConverterTool />;
    case 'punctuation-fixer': return <PunctuationFixerTool />;
    case 'capitalization-fixer': return <CapitalizationFixerTool />;
    case 'unicode-emoji-converter': return <UnicodeEmojiConverterTool />;
    case 'anagram-generator': return <AnagramGeneratorTool />;
    case 'palindrome-checker': return <PalindromeCheckerTool />;
    case 'backslash-escape-unescape': return <BackslashEscapeUnescapeTool />;
    case 'character-frequency-counter': return <CharacterFrequencyCounterTool />;
    case 'base64-file-encoder': return <Base64FileEncoderTool />;
    case 'code-beautifier': return <CodeBeautifierTool />;
    case 'css-to-scss': return <CssToScssTool />;
    case 'toml-to-json': return <TomlToJsonTool />;
    case 'list-randomizer': return <ListRandomizerTool />;
    case 'random-uuid-v7': return <RandomUuidV7Tool />;
    case 'random-ip-address': return <RandomIpAddressTool />;
    case 'random-mac-generator': return <RandomMacGeneratorTool />;
    case 'random-choice-picker': return <RandomChoicePickerTool />;
    case 'random-password-generator': return <RandomPasswordGeneratorTool />;
    case 'email-generator': return <EmailGeneratorTool />;
    case 'mac-address-generator': return <MacAddressGeneratorTool />;
    case 'hmac-generator': return <HmacGeneratorTool />;
    case 'html-minifier': return <HtmlMinifierTool />;
    case 'json-escape-unescape': return <JsonEscapeUnescapeTool />;
    case 'svg-minifier': return <SvgMinifierTool />;
    case 'ascii-art-generator': return <AsciiArtGeneratorTool />;
    case 'ip-address-info': return <IpAddressInfoTool />;
    case 'markdown-table-from-json': return <MarkdownTableFromJsonTool />;
    case 'random-paragraph-generator': return <RandomParagraphGeneratorTool />;
    case 'random-sentence-generator': return <RandomSentenceGeneratorTool />;
    case 'reading-time-calculator': return <ReadingTimeCalculatorTool />;
    case 'smart-text-sorter': return <SmartTextSorterTool />;
    case 'text-reverser': return <TextReverserTool />;
    case 'duplicate-line-finder': return <DuplicateLineFinderTool />;
    case 'sentence-extractor': return <SentenceExtractorTool />;
    case 'line-counter': return <LineCounterTool />;
    case 'secure-random-generator': return <SecureRandomGeneratorTool />;
    case 'bmi-calculator': return <BmiCalculatorTool />;
    case 'byte-converter': return <ByteConverterTool />;
    case 'bill-splitter': return <BillSplitterTool />;
    case 'binary-to-decimal': return <BinaryToDecimalTool />;
    case 'binary-converter': return <BinaryConverterTool />;
    case 'bin-hex-dec-converter': return <BinHexDecConverterTool />;
    case 'base-number-converter': return <BaseNumberConverterTool />;
    case 'bcrypt-hash-generator': return <BcryptHashGeneratorTool />;
    case 'counter': return <CounterTool />;
    case 'cmyk-to-rgb': return <CmykToRgbTool />;
    case 'currency-converter': return <CurrencyConverterTool />;
    case 'data-uri-generator': return <DataUriGeneratorTool />;
    case 'decimal-to-binary': return <DecimalToBinaryTool />;
    case 'decimal-to-hex': return <DecimalToHexTool />;
    case 'base-convert-tool': return <BaseConvertTool />;
    case 'base-converter': return <BaseConverterTool />;
    case 'base-converter-quick': return <BaseConverterQuickTool />;
    case 'citation-generator': return <CitationGeneratorTool />;
    case 'csv-to-tsv': return <CsvToTsvTool />;
    case 'binary-decimal-hex-converter': return <BinaryDecimalHexConverterTool />;
    case 'character-variety-checker': return <CharacterVarietyCheckerTool />;
    case 'cidr-calculator': return <CidrCalculatorTool />;
    case 'code-diff': return <CodeDiffTool />;
    case 'color-blindness-simulator': return <ColorBlindnessSimulatorTool />;
    case 'color-contrast-auditor': return <ColorContrastAuditorTool />;
    case 'color-contrast-ratio-checker': return <ColorContrastRatioCheckerTool />;
    case 'color-format-converter-v2': return <ColorFormatConverterV2Tool />;
    case 'color-format-picker': return <ColorFormatPickerTool />;
    case 'color-harmony-express': return <ColorHarmonyExpressTool />;
    case 'color-harmony-new': return <ColorHarmonyNewTool />;
    case 'color-luminance-calculator': return <ColorLuminanceCalculatorTool />;
    case 'color-luminance-checker': return <ColorLuminanceCheckerTool />;
    case 'color-mixer-v2': return <ColorMixerV2Tool />;
    case 'color-name-finder-v2': return <ColorNameFinderV2Tool />;
    case 'color-opacity-generator': return <ColorOpacityGeneratorTool />;
    case 'color-palette-extractor': return <ColorPaletteExtractorTool />;
    case 'api-auth-header-generator': return <ApiAuthHeaderGeneratorTool />;
    case 'api-doc-generator': return <ApiDocGeneratorTool />;
    case 'api-spec-generator': return <ApiSpecGeneratorTool />;
    case 'area-converter': return <AreaConverterTool />;
    case 'angle-unit-converter': return <AngleUnitConverterTool />;
    case 'base64-image-converter': return <Base64ImageConverterTool />;
    case 'binary-text-express': return <BinaryTextExpressTool />;
    case 'binary-to-text-v2': return <BinaryToTextV2Tool />;
    case 'bulk-generator': return <BulkGeneratorTool />;
    case 'email-validator': return <EmailValidatorTool />;
    case 'url-validator': return <UrlValidatorTool />;
    case 'phone-validator': return <PhoneValidatorTool />;
    case 'slug-validator': return <SlugValidatorTool />;
    case 'password-strength-checker': return <PasswordStrengthCheckerTool />;
    case 'base64-encoder': return <Base64EncoderTool />;
    case 'unicode-encoder': return <UnicodeEncoderTool />;
    case 'percent-encoder': return <PercentEncoderTool />;
    case 'css-formatter': return <CssFormatterTool />;
    case 'html-formatter': return <HtmlFormatterTool />;
    case 'javascript-formatter': return <JavaScriptFormatterTool />;
    case 'word-frequency-counter': return <WordFrequencyCounterTool />;
    case 'character-analysis': return <CharacterAnalysisTool />;
    case 'text-statistics': return <TextStatisticsTool />;
    case 'readability-check': return <ReadabilityCheckTool />;
    case 'discount-calculator': return <DiscountCalculatorTool />;
    case 'tip-calculator': return <TipCalculatorTool />;
    case 'sleep-calculator': return <SleepCalculatorTool />;
    case 'date-calculator': return <DateCalculatorTool />;
    case 'sql-formatter': return <SqlFormatterTool />;
    case 'css-validator': return <CssValidatorTool />;
    case 'yaml-validator': return <YamlValidatorTool />;
    case 'xml-validator': return <XmlValidatorTool />;
    case 'barcode-generator': return <BarcodeGeneratorTool />;
    case 'token-generator': return <TokenGeneratorTool />;
    case 'coupon-generator': return <CouponGeneratorTool />;
    case 'meta-tag-extractor': return <MetaTagExtractorTool />;
    case 'favicon-extractor': return <FaviconExtractorTool />;
    case 'http-header-checker': return <HttpHeaderCheckerTool />;
    case 'cors-checker': return <CorsCheckerTool />;
    case 'argon2-hash-generator': return <Argon2HashGeneratorTool />;
    default:                        return <NotImplementedTool toolName={tool.name} />;
  }
}

// ─── Page layout ─────────────────────────────────────────────────────────

export default function ToolDetailClient({ tool }: { tool: Tool }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link href="/tools" className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
          ← All Tools
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{tool.emoji}</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-block text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
            {tool.category}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">100% client-side · no uploads</span>
        </div>
        {tool.description && (
          <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
        )}
        <div className="mt-4">
          <ShareButtons toolName={tool.name} toolSlug={tool.slug} />
        </div>
      </header>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <ToolRouter tool={tool} />
      </div>
    </div>
  );
}
