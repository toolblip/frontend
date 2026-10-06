'use client';

import { useState } from 'react';

export default function CopyToolLink() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  return (
    <span className="tb-v2-tool-share">
      <button
        type="button"
        className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        onClick={() => {
          const href = window.location.href;
          setError('');
          navigator.clipboard.writeText(href).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }).catch(() => {
            setError('Clipboard access failed. Copy the address bar instead.');
          });
        }}
      >
        {copied ? 'Link copied' : 'Copy link'}
      </button>
      {error ? <span role="alert">{error}</span> : null}
    </span>
  );
}
