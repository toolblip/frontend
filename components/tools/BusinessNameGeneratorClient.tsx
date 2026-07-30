'use client';

import { useState } from 'react';

const suffixes = ['Hub', 'Labs', 'Works', 'ify', 'smart', 'ai', 'pro', 'ly', 'co', 'io'];
const prefixes = ['Nova', 'Apex', 'Flux', 'Byte', 'Data', 'Cloud', 'Next', 'Smart', 'Easy', 'Quick'];
const domains = ['tech', 'app', 'soft', 'sys', 'net', 'web', 'go', 'up', 'flow', 'sync'];

export default function BusinessNameGeneratorClient() {
  const [keyword, setKeyword] = useState('');
  const [names, setNames] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const generateNames = () => {
    if (!keyword.trim()) return;

    const base = keyword.trim().toLowerCase();
    const results: string[] = [];

    prefixes.forEach(prefix => {
      results.push(`${prefix}${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`);
    });

    suffixes.forEach(suffix => {
      results.push(`${keyword.charAt(0).toUpperCase() + keyword.slice(1)}${suffix}`);
    });

    domains.forEach(domain => {
      results.push(`${base}${domain}`);
      results.push(`${base}.${domain}`);
    });

    results.push(`Get${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`);
    results.push(`Try${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`);
    results.push(`My${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`);

    setNames(results.sort(() => Math.random() - 0.5).slice(0, 20));
  };

  const loadExample = () => {
    setKeyword('cloud');
    setNames([]);
  };

  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(name).then(() => {
      setCopied(name);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {});
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Business keyword</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateNames()}
          placeholder="e.g., cloud, data, tech, shop"
          className="tb-v2-input"
          style={{ flex: 1 }}
          aria-label="Business keyword"
        />
        <button
          type="button"
          onClick={generateNames}
          className="tb-v2-btn tb-v2-btn-primary"
          disabled={!keyword.trim()}
        >
          Generate Names
        </button>
      </div>

      {names.length === 0 && (
        <p className="tb-v2-empty">
          Enter a keyword to generate business name ideas with prefixes, suffixes, and domain-style combos.
        </p>
      )}

      {names.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Generated Business Names ({names.length})</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div className="tb-v2-grid-2">
              {names.map((name, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{name}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(name)}
                    className={`tb-v2-copy-btn ${copied === name ? 'done' : ''}`}
                    aria-label={`Copy ${name}`}
                  >
                    {copied === name ? 'Copied' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
