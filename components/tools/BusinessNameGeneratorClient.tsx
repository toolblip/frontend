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
    
    // Pattern: prefix + keyword variations
    prefixes.forEach(prefix => {
      results.push(`${prefix}${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`);
    });
    
    // Pattern: keyword + suffixes
    suffixes.forEach(suffix => {
      results.push(`${keyword.charAt(0).toUpperCase() + keyword.slice(1)}${suffix}`);
    });
    
    // Pattern: domain-style combinations
    domains.forEach(domain => {
      results.push(`${base}${domain}`);
      results.push(`${base}.${domain}`);
    });
    
    // Pattern: keyword combinations
    results.push(`Get${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`);
    results.push(`Try${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`);
    results.push(`My${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`);
    
    // Shuffle and limit
    setNames(results.sort(() => Math.random() - 0.5).slice(0, 20));
  };

  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(name).then(() => {
      setCopied(name);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter a keyword for your business</span>
      </div>
      <div className="tb-v2-input-group">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateNames()}
          placeholder="e.g., cloud, data, tech, shop"
          className="tb-v2-tool-input"
          aria-label="Business keyword"
        />
        <button
          type="button"
          onClick={generateNames}
          className="tb-v2-btn"
          disabled={!keyword.trim()}
        >
          Generate Names
        </button>
      </div>

      {names.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Generated Business Names</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div className="tb-v2-grid-2">
              {names.map((name, idx) => (
                <div key={idx} className="tb-v2-card">
                  <span className="tb-v2-card-text">{name}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(name)}
                    className="tb-v2-copy-btn"
                    aria-label={`Copy ${name}`}
                  >
                    {copied === name ? '✓' : 'Copy'}
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
