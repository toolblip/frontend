'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import ToolExampleClearActions from './ToolExampleClearActions';

import { useState } from 'react';
import { randomFromAlphabet } from '@/lib/secureRandom';

const DIGITS = '0123456789';

export default function RandomPinGeneratorClient() {
  const [length, setLength] = useState(6);
  const [count, setCount] = useState(1);
  const [pins, setPins] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const n = Math.max(1, Math.min(50, Math.trunc(count)||1));
    const len = Math.max(1, Math.min(32, Math.trunc(length)||1));
    setPins(Array.from({ length: n }, () => randomFromAlphabet(DIGITS, len)));
    setCopied(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(pins.join('\n')).then(() => setCopied(true), () => setCopied(false));
  };

  return (<UtilityDesignLayout>
    <div onChangeCapture={() => { setPins([]); }} className="tb-v2-tool-card">
      <ToolExampleClearActions onExample={() => { setLength(6); setCount(3); setPins([]); }} onClear={() => { setPins([]); setCount(1); setLength(6); setCopied(false); }}/>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <label className="tb-v2-tool-label">
          PIN length
          <input aria-label="Length"
            type="number"
            className="tb-v2-input"
            value={length}
            min={1}
            max={32}
            onChange={(e) => setLength(Math.max(1, Math.min(32, Number(e.target.value) || 1)))}
          />
        </label>
        <label className="tb-v2-tool-label">
          How many
          <input aria-label="Count"
            type="number"
            className="tb-v2-input"
            value={count}
            min={1}
            max={50}
            onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
          />
        </label>
      </div>

      <button onClick={generate} className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg" style={{ marginTop: 12 }}>
        Generate
      </button>

      {pins.length > 0 && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 16 }}>
          <div className="flex justify-between items-center mb-2">
            <span className="tb-v2-tool-label">PINs ({pins.length})</span>
            <button onClick={copy} className="tb-v2-copy-btn">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 16, letterSpacing: 1 }}>
            {pins.join('\n')}
          </pre>
        </div>
      )}
    </div>
  </UtilityDesignLayout>
  );
}
