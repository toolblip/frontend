'use client';

import { Fragment, useMemo, useState } from 'react';

interface MatchInfo {
  index: number;
  match: string;
  groups: (string | undefined)[];
  named: Record<string, string>;
}

interface Result {
  matches: MatchInfo[];
  error: string;
  segments: { text: string; hit: boolean }[];
}

const FLAG_CHARS = ['g', 'i', 'm', 's', 'u', 'y'] as const;
type Flag = typeof FLAG_CHARS[number];

const FLAG_LABEL: Record<Flag, string> = {
  g: 'global',
  i: 'ignore case',
  m: 'multiline',
  s: 'dotall',
  u: 'unicode',
  y: 'sticky',
};

function compute(pattern: string, flags: string, sample: string): Result {
  if (!pattern || !sample) return { matches: [], error: '', segments: [{ text: sample, hit: false }] };
  let re: RegExp;
  try {
    const f = flags.includes('g') ? flags : flags + 'g';
    re = new RegExp(pattern, f);
  } catch (e) {
    return { matches: [], error: (e as Error).message, segments: [{ text: sample, hit: false }] };
  }
  const matches: MatchInfo[] = [];
  const segments: { text: string; hit: boolean }[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let safety = 0;
  while ((m = re.exec(sample)) !== null) {
    if (safety++ > 5000) break;
    if (m[0] === '' && re.lastIndex === m.index) {
      re.lastIndex++;
      continue;
    }
    const idx = m.index;
    if (idx > last) segments.push({ text: sample.slice(last, idx), hit: false });
    segments.push({ text: m[0], hit: true });
    last = idx + m[0].length;
    matches.push({
      index: idx,
      match: m[0],
      groups: m.slice(1),
      named: m.groups ? { ...m.groups } : {},
    });
  }
  if (last < sample.length) segments.push({ text: sample.slice(last), hit: false });
  if (segments.length === 0) segments.push({ text: sample, hit: false });
  return { matches, error: '', segments };
}

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState('\\b\\w+@\\w+\\.\\w+\\b');
  const [flags, setFlags] = useState<Set<Flag>>(new Set(['g']));
  const [sample, setSample] = useState(
    'Email Ada at ada@example.com or Grace at grace@toolblip.com to confirm.\nNo match: just plain text on this line.',
  );

  const flagStr = useMemo(() => Array.from(flags).join(''), [flags]);
  const result = useMemo(() => compute(pattern, flagStr, sample), [pattern, flagStr, sample]);

  const toggleFlag = (f: Flag) => {
    setFlags((cur) => {
      const next = new Set(cur);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Pattern</span>
        <span className="tb-v2-hash-stats">
          {result.error ? ' - ' : `${result.matches.length} match${result.matches.length === 1 ? '' : 'es'}`}
        </span>
      </div>
      <div className="tb-v2-rgx-pattern">
        <span className="tb-v2-rgx-slash">/</span>
        <input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          className="tb-v2-rgx-input"
          aria-label="Regular expression pattern"
        />
        <span className="tb-v2-rgx-slash">/</span>
        <span className="tb-v2-rgx-flagstr">{flagStr || ' - '}</span>
      </div>

      <div className="tb-v2-rgx-flags" role="group" aria-label="Regex flags">
        {FLAG_CHARS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => toggleFlag(f)}
            className={`tb-v2-mode-tab ${flags.has(f) ? 'on' : ''}`}
            title={FLAG_LABEL[f]}
            aria-pressed={flags.has(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {result.error && (
        <p className="tb-v2-error" role="alert" style={{ marginTop: 12 }}>
          <strong>Invalid pattern:</strong> {result.error}
        </p>
      )}

      <div className="tb-v2-tool-input-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">Test string</span>
      </div>
      <textarea
        value={sample}
        onChange={(e) => setSample(e.target.value)}
        placeholder="Paste text to test the pattern against…"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="Test string"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Highlighted</span>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre className="tb-v2-tool-pre tb-v2-rgx-hl">
          {result.segments.map((s, i) =>
            s.hit ? <mark key={i} className="tb-v2-rgx-mark">{s.text}</mark> : <Fragment key={i}>{s.text}</Fragment>,
          )}
          {!sample && ' - '}
        </pre>
      </div>

      {result.matches.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Matches</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <ol className="tb-v2-rgx-list">
              {result.matches.slice(0, 100).map((m, i) => (
                <li key={i} className="tb-v2-rgx-item">
                  <span className="tb-v2-rgx-idx">@{m.index}</span>
                  <code className="tb-v2-rgx-text">{m.match}</code>
                  {m.groups.length > 0 && (
                    <div className="tb-v2-rgx-groups">
                      {m.groups.map((g, gi) => (
                        <span key={gi} className="tb-v2-rgx-group">
                          <span className="tb-v2-rgx-glabel">${gi + 1}</span>
                          <code>{g ?? '∅'}</code>
                        </span>
                      ))}
                      {Object.entries(m.named).map(([k, v]) => (
                        <span key={k} className="tb-v2-rgx-group">
                          <span className="tb-v2-rgx-glabel">{k}</span>
                          <code>{v}</code>
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
              {result.matches.length > 100 && (
                <li className="tb-v2-rgx-item">
                  <span className="tb-v2-hash-stats">…and {result.matches.length - 100} more.</span>
                </li>
              )}
            </ol>
          </div>
        </>
      )}
    </div>
  );
}
