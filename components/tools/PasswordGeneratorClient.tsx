'use client';

import { useEffect, useState } from 'react';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.?/';
const AMBIGUOUS = /[O0Il1|`'"]/g;

type Options = {
  length: number;
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
};

function buildPool(opts: Options): string {
  let pool = '';
  if (opts.upper) pool += UPPER;
  if (opts.lower) pool += LOWER;
  if (opts.digits) pool += DIGITS;
  if (opts.symbols) pool += SYMBOLS;
  if (opts.excludeAmbiguous) pool = pool.replace(AMBIGUOUS, '');
  return pool;
}

function generatePassword(opts: Options): string {
  const pool = buildPool(opts);
  if (!pool) return '';
  const out = new Array<string>(opts.length);
  const rnd = new Uint32Array(opts.length);
  crypto.getRandomValues(rnd);
  for (let i = 0; i < opts.length; i++) {
    out[i] = pool[rnd[i] % pool.length];
  }
  return out.join('');
}

type Strength = { score: 0 | 1 | 2 | 3 | 4; label: string; cls: string };

function scoreStrength(pw: string, opts: Options): Strength {
  if (!pw) return { score: 0, label: ' - ', cls: '' };
  const poolSize = buildPool(opts).length || 1;
  const entropy = pw.length * Math.log2(poolSize);
  if (entropy < 36) return { score: 1, label: 'Weak', cls: 'weak' };
  if (entropy < 60) return { score: 2, label: 'Fair', cls: 'fair' };
  if (entropy < 100) return { score: 3, label: 'Strong', cls: 'strong' };
  return { score: 4, label: 'Very strong', cls: 'vstrong' };
}

export default function PasswordGeneratorClient() {
  const [opts, setOpts] = useState<Options>({
    length: 16,
    upper: true,
    lower: true,
    digits: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const regenerate = () => {
    setPassword(generatePassword(opts));
  };

  useEffect(() => {
    setPassword(generatePassword(opts));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts]);

  const copy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const strength = scoreStrength(password, opts);
  const noCharsets = !opts.upper && !opts.lower && !opts.digits && !opts.symbols;

  const toggle = (key: keyof Options) => {
    setOpts((o) => ({ ...o, [key]: !o[key] as never }));
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Password</span>
        <button
          type="button"
          onClick={copy}
          disabled={!password}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-pw-output">
        <code className="tb-v2-pw-value" aria-live="polite">
          {password || ' - '}
        </code>
        <button
          type="button"
          onClick={regenerate}
          className="tb-v2-pw-refresh"
          aria-label="Regenerate"
          disabled={noCharsets}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-3-6.7" />
            <polyline points="21 4 21 10 15 10" />
          </svg>
        </button>
      </div>

      <div className="tb-v2-pw-strength">
        <div className="tb-v2-pw-bar">
          <div className={`tb-v2-pw-bar-fill ${strength.cls}`} style={{ width: `${(strength.score / 4) * 100}%` }} />
        </div>
        <span className={`tb-v2-pw-strength-lbl ${strength.cls}`}>{strength.label}</span>
      </div>

      <div className="tb-v2-pw-controls">
        <div className="tb-v2-pw-length">
          <label htmlFor="pw-length" className="tb-v2-tool-label">Length: {opts.length}</label>
          <input
            id="pw-length"
            type="range"
            min={8}
            max={64}
            value={opts.length}
            onChange={(e) => setOpts((o) => ({ ...o, length: Number(e.target.value) }))}
            className="tb-v2-pw-slider"
          />
        </div>

        <div className="tb-v2-pw-toggles">
          {([
            ['upper', 'A–Z'],
            ['lower', 'a–z'],
            ['digits', '0–9'],
            ['symbols', '!@#$'],
            ['excludeAmbiguous', 'No look-alikes'],
          ] as [keyof Options, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`tb-v2-mode-tab ${opts[key] ? 'on' : ''}`}
              aria-pressed={!!opts[key]}
            >
              {label}
            </button>
          ))}
        </div>

        {noCharsets && (
          <p className="tb-v2-error" role="alert">Select at least one character set.</p>
        )}
      </div>
    </div>
  );
}
