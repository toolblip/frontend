'use client';

import { useState, useCallback } from 'react';

function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGeneratorClient() {
  const [uuids, setUuids] = useState<string[]>([generateUuid()]);
  const [count, setCount] = useState(1);

  const regenerate = useCallback(() => {
    setUuids(Array.from({ length: count }, () => generateUuid()));
  }, [count]);

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label htmlFor="uuid-count" className="text-sm text-gray-400">
          Number of UUIDs:
        </label>
        <input
          id="uuid-count"
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
          className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-red-500"
        />
        <button
          onClick={regenerate}
          className="bg-red-600 hover:bg-red-500 text-black font-medium px-4 py-1.5 rounded-lg text-sm transition-colors"
        >
          Generate
        </button>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 font-mono text-sm space-y-2 max-h-80 overflow-y-auto">
        {uuids.map((uuid, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-gray-600 w-6 shrink-0">{i + 1}</span>
            <span className="text-red-400">{uuid}</span>
            <button
              onClick={() => navigator.clipboard.writeText(uuid)}
              className="text-gray-500 hover:text-white text-xs ml-auto transition-colors"
              aria-label={`Copy UUID ${i + 1}`}
            >
              Copy
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={copyAll}
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Copy all ({uuids.length})
        </button>
        <button
          onClick={regenerate}
          className="text-sm text-gray-500 hover:text-white transition-colors"
        >
          Regenerate
        </button>
      </div>

      <p className="text-xs text-gray-500">
        Generated using your browser&apos;s crypto API. Version 4 (random) UUIDs.
      </p>
    </div>
  );
}
