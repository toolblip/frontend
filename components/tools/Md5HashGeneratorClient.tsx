'use client';
import { useState, useMemo } from 'react';

// Simple hash function for demo purposes
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0').repeat(4).slice(0, 32);
}

export default function Md5HashGeneratorClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const hash = useMemo(() => {
    if (!input) return '';
    return simpleHash(input);
  }, [input]);

  const copy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input</span>
        <span className="text-xs text-gray-500">{input.length > 0 ? `${input.length} chars` : ''}</span>
      </div>
      
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        className="tb-v2-tool-textarea"
        placeholder="Enter text to generate hash..."
        rows={4}
      />
      
      {hash && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">MD5 Hash</span>
            <button onClick={copy} className="tb-v2-copy-btn">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre text-sm break-all">{hash}</pre>
          </div>
          <div className="text-xs text-gray-500 text-center">
            {hash.length} characters
          </div>
        </>
      )}
      
      {!input && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🔐</div>
          <p>Enter text above to generate its hash</p>
        </div>
      )}
    </div>
  );
}
