'use client';

import { useMemo, useState } from 'react';
import { generateLorem, type LoremUnit } from '@/lib/lorem-ipsum';

const UNITS: { value: LoremUnit; label: string }[] = [
  { value: 'words', label: 'Words' },
  { value: 'sentences', label: 'Sentences' },
  { value: 'paragraphs', label: 'Paragraphs' },
];

export default function LoremIpsumGeneratorClient() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<LoremUnit>('paragraphs');
  const [startLorem, setStartLorem] = useState(true);
  const [cycle, setCycle] = useState(0);

  const output = useMemo(
    () => generateLorem(count, unit, startLorem, cycle),
    [count, unit, startLorem, cycle],
  );

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
  };

  return (
    <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' }}>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Count</span>
          <input
            id="lorem-count"
            type="number"
            value={count}
            min={1}
            max={100}
            aria-label="How many"
            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 1)))}
            className="w-16 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1.5 text-center text-sm text-gray-900 dark:text-white"
          />
        </label>
        <fieldset className="flex flex-wrap items-center gap-4 border-0 p-0 m-0">
          <legend className="float-left mr-3 text-sm font-medium text-gray-600 dark:text-gray-400">
            Type
          </legend>
          {UNITS.map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              <input
                type="radio"
                name="lorem-unit"
                value={value}
                checked={unit === value}
                onChange={() => setUnit(value)}
                className="accent-red-600"
              />
              {label}
            </label>
          ))}
        </fieldset>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={startLorem}
            onChange={(e) => setStartLorem(e.target.checked)}
            className="rounded"
          />
          Start with “Lorem ipsum…”
        </label>
      </div>
      <div>
        <button
          type="button"
          onClick={() => setCycle((value) => value + 1)}
          className="tb-v2-btn tb-v2-btn-primary"
        >
          Regenerate
        </button>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400" htmlFor="lorem-output">
            Output
          </label>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}
            className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
            style={{ color: 'var(--red)' }}
          >
            Copy output
          </button>
        </div>
        <textarea
          id="lorem-output"
          value={output}
          readOnly
          rows={12}
          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm leading-7 resize-y"
        />
      </div>
    </div>
  );
}
