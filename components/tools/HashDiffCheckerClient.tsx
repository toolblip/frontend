'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

type Mode = 'text' | 'hash';
type Algo = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

const ALGOS: Algo[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

async function computeHash(algo: Algo, input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface DiffInfo {
  match: boolean;
  sameLength: boolean;
  firstDiffIndex: number; // -1 when there is no differing index to report
}

function diffHashes(a: string, b: string, ignoreCase: boolean): DiffInfo {
  const na = ignoreCase ? a.toLowerCase() : a;
  const nb = ignoreCase ? b.toLowerCase() : b;
  const match = na === nb;
  const sameLength = na.length === nb.length;
  let firstDiffIndex = -1;
  if (!match && sameLength) {
    for (let i = 0; i < na.length; i++) {
      if (na[i] !== nb[i]) {
        firstDiffIndex = i;
        break;
      }
    }
  }
  return { match, sameLength, firstDiffIndex };
}

function CopyButton({ label, value, onCopy, copied }: { label: string; value: string; onCopy: () => void; copied: boolean }) {
  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={!value}
      className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
      aria-label={`Copy ${label}`}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export default function HashDiffCheckerClient() {
  const [mode, setMode] = useState<Mode>('text');
  const [algo, setAlgo] = useState<Algo>('SHA-256');
  const [ignoreCase, setIgnoreCase] = useState(true);

  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [computedA, setComputedA] = useState('');
  const [computedB, setComputedB] = useState('');

  const [hashInputA, setHashInputA] = useState('');
  const [hashInputB, setHashInputB] = useState('');

  const [copiedField, setCopiedField] = useState('');

  // Live-compute hashes for "Compare text" mode using the real Web Crypto API.
  useEffect(() => {
    if (mode !== 'text') return;
    let cancelled = false;
    if (!textA) {
      setComputedA('');
    } else {
      computeHash(algo, textA).then((h) => {
        if (!cancelled) setComputedA(h);
      });
    }
    if (!textB) {
      setComputedB('');
    } else {
      computeHash(algo, textB).then((h) => {
        if (!cancelled) setComputedB(h);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [mode, algo, textA, textB]);

  const hashA = mode === 'text' ? computedA : hashInputA.trim();
  const hashB = mode === 'text' ? computedB : hashInputB.trim();
  const bothPresent = hashA.length > 0 && hashB.length > 0;

  const diff = useMemo(() => diffHashes(hashA, hashB, ignoreCase), [hashA, hashB, ignoreCase]);

  const copy = useCallback((field: string, value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 1500);
  }, []);

  const loadExample = () => {
    if (mode === 'text') {
      setTextA('The quick brown fox jumps over the lazy dog');
      setTextB('The quick brown fox jumps over the lazy dog.');
    } else {
      setHashInputA('d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592');
      setHashInputB('d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e59');
    }
  };

  // Render a monospace, per-character diff view when both hashes are the same length.
  const renderDiffChars = (value: string, otherValue: string) => {
    const other = ignoreCase ? otherValue.toLowerCase() : otherValue;
    const cmp = ignoreCase ? value.toLowerCase() : value;
    return (
      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13, wordBreak: 'break-all' }}>
        {value.split('').map((ch, i) => {
          const isDiff = cmp[i] !== other[i];
          const isFirst = i === diff.firstDiffIndex;
          return (
            <span
              key={i}
              style={{
                background: isDiff ? 'var(--red-tint, #fee2e2)' : 'transparent',
                color: isDiff ? 'var(--red, #dc2626)' : 'inherit',
                outline: isFirst ? '1px solid var(--red, #dc2626)' : 'none',
                borderRadius: 2,
              }}
              title={isDiff ? `Differs at position ${i + 1}` : undefined}
            >
              {ch}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Hash Diff Checker</span>
        <div className="flex items-center gap-2">
          <div className="tb-v2-mode-tabs" role="tablist" aria-label="Comparison mode">
            <button
              role="tab"
              aria-selected={mode === 'text'}
              onClick={() => setMode('text')}
              className={`tb-v2-mode-tab ${mode === 'text' ? 'on' : ''}`}
            >
              Compare text
            </button>
            <button
              role="tab"
              aria-selected={mode === 'hash'}
              onClick={() => setMode('hash')}
              className={`tb-v2-mode-tab ${mode === 'hash' ? 'on' : ''}`}
            >
              Compare hashes directly
            </button>
          </div>
          <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
            Load Example
          </button>
        </div>
      </div>

      {mode === 'text' && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="tb-v2-tool-label" style={{ marginRight: 4 }}>
            Algorithm
          </span>
          {ALGOS.map((a) => (
            <button
              key={a}
              onClick={() => setAlgo(a)}
              className={`tb-v2-mode-tab ${algo === a ? 'on' : ''}`}
              style={{ fontSize: 12, padding: '4px 10px' }}
            >
              {a}
            </button>
          ))}
        </div>
      )}

      {mode === 'text' ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="tb-v2-tool-input-head">
              <span className="tb-v2-tool-label">Text A</span>
            </div>
            <textarea
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              placeholder="Enter first text/data..."
              className="tb-v2-tool-textarea"
              style={{ fontFamily: 'var(--f-mono)' }}
              aria-label="Text A"
            />
            <div className="tb-v2-tool-output-head">
              <span className="tb-v2-tool-label">{algo} of Text A</span>
              <CopyButton label="Hash A" value={computedA} copied={copiedField === 'a'} onCopy={() => copy('a', computedA)} />
            </div>
            <div className="tb-v2-tool-output-body">
              <code style={{ fontFamily: 'var(--f-mono)', fontSize: 13, wordBreak: 'break-all' }}>{computedA || ' - '}</code>
            </div>
          </div>
          <div>
            <div className="tb-v2-tool-input-head">
              <span className="tb-v2-tool-label">Text B</span>
            </div>
            <textarea
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              placeholder="Enter second text/data..."
              className="tb-v2-tool-textarea"
              style={{ fontFamily: 'var(--f-mono)' }}
              aria-label="Text B"
            />
            <div className="tb-v2-tool-output-head">
              <span className="tb-v2-tool-label">{algo} of Text B</span>
              <CopyButton label="Hash B" value={computedB} copied={copiedField === 'b'} onCopy={() => copy('b', computedB)} />
            </div>
            <div className="tb-v2-tool-output-body">
              <code style={{ fontFamily: 'var(--f-mono)', fontSize: 13, wordBreak: 'break-all' }}>{computedB || ' - '}</code>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <span className="tb-v2-tool-label">Hash A</span>
            <input
              type="text"
              value={hashInputA}
              onChange={(e) => setHashInputA(e.target.value)}
              placeholder="Paste first hash..."
              className="tb-v2-input"
              style={{ fontFamily: 'var(--f-mono)' }}
              spellCheck={false}
              aria-label="Hash A"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="tb-v2-tool-label">Hash B</span>
            <input
              type="text"
              value={hashInputB}
              onChange={(e) => setHashInputB(e.target.value)}
              placeholder="Paste second hash..."
              className="tb-v2-input"
              style={{ fontFamily: 'var(--f-mono)' }}
              spellCheck={false}
              aria-label="Hash B"
            />
          </div>
        </div>
      )}

      <label className="flex items-center gap-2" style={{ fontSize: 13, color: 'var(--fg-2)' }}>
        <input type="checkbox" checked={ignoreCase} onChange={(e) => setIgnoreCase(e.target.checked)} />
        Ignore case when comparing
      </label>

      {bothPresent && (
        <div
          className={diff.match ? '' : 'tb-v2-banner tb-v2-banner-err'}
          style={
            diff.match
              ? {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  background: 'var(--green-tint)',
                  color: 'var(--green)',
                  border: '1px solid color-mix(in srgb, var(--green) 25%, transparent)',
                }
              : undefined
          }
        >
          <strong>{diff.match ? 'MATCH' : 'NO MATCH'}</strong>
          <span>
            {diff.match
              ? 'The two hashes are identical.'
              : diff.sameLength
              ? `The hashes differ — same length (${hashA.length} chars), first difference at position ${diff.firstDiffIndex + 1}.`
              : `The hashes differ — different lengths (${hashA.length} vs ${hashB.length} chars).`}
          </span>
        </div>
      )}

      {bothPresent && !diff.match && diff.sameLength && (
        <div>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Per-character diff</span>
          </div>
          <div className="tb-v2-tool-output-body flex flex-col gap-2">
            {renderDiffChars(hashA, hashB)}
            {renderDiffChars(hashB, hashA)}
          </div>
        </div>
      )}
    </div>
  );
}
