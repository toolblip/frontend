'use client';

import { useState } from 'react';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      style={{
        position: 'absolute',
        top: 10,
        right: 12,
        background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.07)',
        border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.12)'}`,
        borderRadius: 6,
        padding: '3px 10px',
        fontSize: 11,
        fontFamily: 'var(--f-mono, monospace)',
        color: copied ? '#4ade80' : '#94a3b8',
        cursor: 'pointer',
        transition: 'background 0.15s, color 0.15s, border-color 0.15s',
        zIndex: 2,
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}
