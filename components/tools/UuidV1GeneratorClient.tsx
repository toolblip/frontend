'use client';

import { useState, useCallback } from 'react';

// UUID v1 structure: time_low (32 bits) | time_mid (16 bits) | time_hi_and_version (16 bits) | clock_seq (16 bits) | node (48 bits)
// Total: 128 bits
// UUIDv1 contains timestamp and MAC address (or random node ID)

function getRandomValues(bytes: number): Uint8Array {
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < bytes; i++) {
    arr[i] = Math.floor(Math.random() * 256);
  }
  return arr;
}

function generateUuidV1(): string {
  // Get current timestamp in 100-nanosecond intervals since UUID epoch (Oct 15, 1582)
  const uuidEpoch = Date.UTC(1582, 9, 15, 0, 0, 0, 0);
  const now = Date.now();
  const timestamp = (now - uuidEpoch) * 10000; // Convert to 100-nanosecond intervals

  // Generate random node ID (48 bits) - using random for privacy (not MAC address)
  const nodeId = getRandomValues(6);
  
  // Generate random clock sequence (14 bits)
  const clockSeq = getRandomValues(2);
  const clockSeqHiAndReserved = (clockSeq[0] & 0x3f) | 0x80; // Variant bits
  const clockSeqLow = clockSeq[1];

  // Convert timestamp to parts
  const timeLow = (timestamp & 0xffffffff) >>> 0;
  const timeMid = (timestamp >> 32) & 0xffff;
  const timeHiAndVersion = ((timestamp >> 48) & 0x0fff) | 0x1000; // Version 1

  // Format as hex strings
  const timeLowHex = timeLow.toString(16).padStart(8, '0');
  const timeMidHex = timeMid.toString(16).padStart(4, '0');
  const timeHiAndVersionHex = timeHiAndVersion.toString(16).padStart(4, '0');
  const clockSeqHex = (clockSeqHiAndReserved << 8 | clockSeqLow).toString(16).padStart(4, '0');
  const nodeHex = Array.from(nodeId).map(b => b.toString(16).padStart(2, '0')).join('');

  return `${timeLowHex}-${timeMidHex}-${timeHiAndVersionHex}-${clockSeqHex}-${nodeHex}`;
}

export default function UuidV1GeneratorClient() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [includeBraces, setIncludeBraces] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = useCallback(() => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      let uuid = generateUuidV1();
      if (uppercase) uuid = uuid.toUpperCase();
      if (includeBraces) uuid = `{${uuid}}`;
      newUuids.push(uuid);
    }
    setUuids(newUuids);
  }, [count, uppercase, includeBraces]);

  const copyToClipboard = (uuid: string, index: number) => {
    navigator.clipboard.writeText(uuid).catch(() => {});
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n')).catch(() => {});
    setCopied(-1);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-2">Number of UUIDs</label>
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
          Generate UUID v1
        </button>
      </div>

      {uuids.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Generated UUIDs</h3>
            <button
              onClick={copyAll}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {copied === -1 ? 'Copied!' : 'Copy All'}
            </button>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap break-all">
              {uuids.map((uuid, i) => (
                <div key={i} className="flex gap-4 items-center group">
                  <span className="text-gray-500 select-none w-6">{i + 1}.</span>
                  <span className="flex-1">{uuid}</span>
                  <button
                    onClick={() => copyToClipboard(uuid, i)}
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

      <div className="bg-blue-50 rounded-lg p-4 text-sm">
        <h4 className="font-medium text-blue-900 mb-2">About UUIDv1</h4>
        <ul className="list-disc list-inside text-blue-800 space-y-1">
          <li>Contains timestamp and machine identifier (MAC address or random node)</li>
          <li>Sortable by creation time - useful for time-ordered data</li>
          <li>128-bit identifier with 48 bits of node ID</li>
          <li>May expose machine MAC address (privacy concern - consider UUIDv7 for privacy-friendly alternative)</li>
        </ul>
      </div>
    </div>
  );
}