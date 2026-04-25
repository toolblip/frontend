'use client';

import { useState } from 'react';

const HISTORY_SIZE = 5;

function format(uuid: string, opts: { hyphens: boolean; uppercase: boolean }): string {
  let v = opts.hyphens ? uuid : uuid.replace(/-/g, '');
  if (opts.uppercase) v = v.toUpperCase();
  return v;
}

export default function UuidGeneratorClient() {
  const [history, setHistory] = useState<string[]>([crypto.randomUUID()]);
  const [hyphens, setHyphens] = useState(true);
  const [uppercase, setUppercase] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = () => {
    setHistory((prev) => [crypto.randomUUID(), ...prev].slice(0, HISTORY_SIZE));
  };

  const copy = (val: string, idx: number) => {
    navigator.clipboard.writeText(val).catch(() => {});
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyAll = () => {
    const all = history.map((u) => format(u, { hyphens, uppercase })).join('\n');
    navigator.clipboard.writeText(all).catch(() => {});
    setCopied(-1);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">UUID v4</span>
        <div className="tb-v2-mode-tabs" role="group" aria-label="UUID format">
          <button
            type="button"
            onClick={() => setHyphens((v) => !v)}
            className={`tb-v2-mode-tab ${hyphens ? 'on' : ''}`}
            aria-pressed={hyphens}
          >
            Hyphens
          </button>
          <button
            type="button"
            onClick={() => setUppercase((v) => !v)}
            className={`tb-v2-mode-tab ${uppercase ? 'on' : ''}`}
            aria-pressed={uppercase}
          >
            UPPER
          </button>
        </div>
      </div>

      <div className="tb-v2-tool-output-body">
        <button type="button" onClick={generate} className="tb-v2-uuid-gen-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-3-6.7" />
            <polyline points="21 4 21 10 15 10" />
          </svg>
          Generate new UUID
        </button>

        <div className="tb-v2-uuid-list" aria-live="polite">
          {history.map((uuid, i) => {
            const formatted = format(uuid, { hyphens, uppercase });
            return (
              <div key={uuid} className="tb-v2-uuid-row">
                <span className="tb-v2-uuid-num">{i === 0 ? 'Latest' : `#${i + 1}`}</span>
                <span className="tb-v2-uuid-val" title={formatted}>{formatted}</span>
                <button
                  type="button"
                  onClick={() => copy(formatted, i)}
                  className={`tb-v2-copy-btn ${copied === i ? 'done' : ''}`}
                  aria-label={`Copy UUID ${i + 1}`}
                >
                  {copied === i ? 'Copied' : 'Copy'}
                </button>
              </div>
            );
          })}
        </div>

        {history.length > 1 && (
          <div className="tb-v2-uuid-foot">
            <button
              type="button"
              onClick={copyAll}
              className={`tb-v2-copy-btn ${copied === -1 ? 'done' : ''}`}
            >
              {copied === -1 ? 'Copied' : `Copy all ${history.length}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
