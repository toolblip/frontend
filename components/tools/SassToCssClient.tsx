'use client';

import { useState, useMemo } from 'react';
import { compileString } from 'sass';

const SAMPLE = `// Variables
$primary-color: #EF4444;
$border-radius: 0.75rem;
$font-stack: system-ui, sans-serif;

// Mixin for card styling
@mixin card($bg: white) {
  background: $bg;
  border-radius: $border-radius;
  padding: 1.5rem;
}

// Nested styles
.container {
  font-family: $font-stack;
  
  .header {
    color: $primary-color;
    
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    
    p {
      color: #6B7280;
    }
  }
  
  .card {
    @include card;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
}

// Function
@function pow($base, $exp) {
  $result: 1;
  @for $i from 1 through $exp {
    $result: $result * $base;
  }
  @return $result;
}

.sidebar {
  width: pow(2, 5) * 1px; // 32px
}
`;

export default function SassToCssClient() {
  const [input, setInput] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => {
    if (!input.trim()) return { result: '', error: '' };
    try {
      const output = compileString(input, {
        style: 'expanded',
        loadPaths: ['node_modules'],
      });
      return { result: output.css, error: '' };
    } catch (e) {
      return { result: '', error: (e as Error).message };
    }
  }, [input]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const orig = new TextEncoder().encode(input).length;
  const min = new TextEncoder().encode(result).length;

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">SCSS / SASS</span>
        {input && !error && (
          <span className="tb-v2-hash-stats">
            {orig.toLocaleString()} chars
          </span>
        )}
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="// Enter your SCSS or SASS here…"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="SCSS/SASS input"
        spellCheck={false}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">CSS Output</span>
        {result && !error && (
          <span className="tb-v2-hash-stats">{min.toLocaleString()} chars</span>
        )}
        <button
          type="button"
          onClick={copy}
          disabled={!result}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error" role="alert">
            {error}
          </p>
        ) : (
          <pre className="tb-v2-tool-pre">{result || '—'}</pre>
        )}
      </div>
    </div>
  );
}
