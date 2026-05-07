'use client';

import { useState, useCallback } from 'react';

// ULID structure: timestamp (48 bits) | randomness (80 bits)
// Total: 128 bits (same as UUID)
// Sortable by creation time (like UUIDv1/v7) but uses randomness instead of MAC address
// Crockford's Base32 encoding (no I, L, O, U to avoid confusion)

const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const ENCODING_LEN = ENCODING.length;
const TIME_LEN = 10;
const RANDOM_LEN = 16;
const TOTAL_LEN = TIME_LEN + RANDOM_LEN;

function encodeTime(now: number): string {
  let t = now;
  let str = '';
  for (let i = TIME_LEN - 1; i >= 0; i--) {
    const mod = t % ENCODING_LEN;
    str = ENCODING[mod] + str;
    t = Math.floor(t / ENCODING_LEN);
  }
  return str;
}

function encodeRandom(): string {
  let str = '';
  for (let i = 0; i < RANDOM_LEN; i++) {
    str += ENCODING[Math.floor(Math.random() * ENCODING_LEN)];
  }
  return str;
}

function generateUlid(): string {
  const now = Date.now();
  const time = encodeTime(now);
  const random = encodeRandom();
  return time + random;
}

export default function UlidGeneratorClient() {
  const [ulids, setUlids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(true);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = useCallback(() => {
    const newUlids: string[] = [];
    for (let i = 0; i < count; i++) {
      let ulid = generateUlid();
      if (uppercase) ulid = ulid.toUpperCase();
      else ulid = ulid.toLowerCase();
      newUlids.push(ulid);
    }
    setUlids(newUlids);
  }, [count, uppercase]);

  const copyToClipboard = (ulid: string, index: number) => {
    navigator.clipboard.writeText(ulid).catch(() => {});
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(ulids.join('\n')).catch(() => {});
    setCopied(-1);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-2">Number of ULIDs</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="uppercase"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="uppercase" className="text-sm">UPPERCASE</label>
        </div>

        <button
          onClick={generate}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate ULID
        </button>
      </div>

      {ulids.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Generated ULIDs</h3>
            <button
              onClick={copyAll}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {copied === -1 ? 'Copied!' : 'Copy All'}
            </button>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap break-all">
              {ulids.map((ulid, i) => (
                <div key={i} className="flex gap-4 items-center group">
                  <span className="text-gray-500 select-none w-6">{i + 1}.</span>
                  <span className="flex-1">{ulid}</span>
                  <button
                    onClick={() => copyToClipboard(ulid, i)}
                    className="text-xs text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copied === i ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ))}
            </pre>
          </div>
        </div>
      )}

      <div className="bg-green-50 rounded-lg p-4 text-sm">
        <h4 className="font-medium text-green-900 mb-2">About ULID</h4>
        <ul className="list-disc list-inside text-green-800 space-y-1">
          <li>Universally Unique Lexicographically Sortable Identifier</li>
          <li>128-bit identifier compatible with UUID/GUID</li>
          <li>Sortable by creation time (like UUIDv1/v7) without exposing MAC address</li>
          <li>Uses Crockford's Base32 encoding (26 characters, no confusing chars)</li>
          <li>Monotonic within same millisecond (last char increments)</li>
        </ul>
      </div>
    </div>
  );
}