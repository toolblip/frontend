'use client';

import { useState, useCallback } from 'react';

// UUIDv7 structure: unix_ts_ms (48 bits) | ver (4 bits) | rand_a (12 bits) | var (2 bits) | rand_b (62 bits)
// Total: 128 bits

function getRandomValues(bits: number): Uint8Array {
  const bytes = Math.ceil(bits / 8);
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < bytes; i++) {
    arr[i] = Math.floor(Math.random() * 256);
  }
  return arr;
}

function hexFromBytes(bytes: Uint8Array, start: number, length: number): string {
  let hex = '';
  for (let i = 0; i < length; i++) {
    const byte = bytes[start + Math.floor(i / 2)] ?? 0;
    if (i % 2 === 0) {
      hex += ((byte >> 4) & 0x0f).toString(16);
    } else {
      hex += (byte & 0x0f).toString(16);
    }
  }
  return hex;
}

function generateUuidV7(): string {
  const timestamp = Date.now();
  
  // 48 bits for timestamp (unix_ts_ms)
  const tsHex = timestamp.toString(16).padStart(12, '0');
  
  // 80 bits of random data
  const rand = getRandomValues(80);
  
  // 4 bits version (7) + 12 bits random (rand_a)
  const verAndRandA = hexFromBytes(rand, 0, 4);
  const version = '7';
  const randA = verAndRandA[0] + verAndRandA.slice(1, 4); // 3 hex chars = 12 bits
  
  // 2 bits variant (10) + 62 bits random (rand_b) 
  // Variant bits must be 10 for standard UUID
  const varAndRandBPart = hexFromBytes(rand, 2, 4);
  const variantBits = '10';
  const randBPart1 = (parseInt(varAndRandBPart[0], 16) & 0x03 | 0x08).toString(16); // ensure variant
  const randB = randBPart1 + varAndRandBPart.slice(1, 4) + hexFromBytes(rand, 5, 8);
  
  const uuid = (
    tsHex.slice(0, 8) + '-' +
    tsHex.slice(8, 12) + '-' +
    version + randA + '-' +
    variantBits + randB.slice(0, 3) + '-' +
    randB.slice(3, 15)
  );
  
  return uuid;
}

export default function RandomUuidV7Client() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [includeBraces, setIncludeBraces] = useState(false);

  const generate = useCallback(() => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      let uuid = generateUuidV7();
      if (uppercase) uuid = uuid.toUpperCase();
      if (includeBraces) uuid = `{${uuid}}`;
      newUuids.push(uuid);
    }
    setUuids(newUuids);
  }, [count, uppercase, includeBraces]);

  const copyToClipboard = () => {
    const text = uuids.join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Number of UUIDs</label>
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="braces"
            checked={includeBraces}
            onChange={(e) => setIncludeBraces(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="braces" className="text-sm">Include Braces</label>
        </div>

        <button
          onClick={generate}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate
        </button>
      </div>

      {uuids.length > 0 && (
        <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Generated UUIDs</h3>
            <button
              onClick={copyToClipboard}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Copy All
            </button>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap break-all">
              {uuids.map((uuid, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-gray-500 select-none">{i + 1}.</span>
                  <span>{uuid}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      )}

      <div className="bg-blue-50 rounded-lg p-4 text-sm">
        <h4 className="font-medium text-blue-900 mb-2">About UUIDv7</h4>
        <ul className="list-disc list-inside text-blue-800 space-y-1">
          <li>Sortable by creation time (like UUIDv1 but without MAC address exposure)</li>
          <li>128-bit identifier with 48 bits of timestamp, 4 bits version, and 76 bits of randomness</li>
          <li>Lexicographically sortable when treated as strings</li>
          <li>No external dependencies required</li>
        </ul>
      </div>
    </div>
  );
}
