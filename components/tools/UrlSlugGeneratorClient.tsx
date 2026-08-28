'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Sep = '-' | '_' | '.';

const EXAMPLE = 'Hello World Example!';

function slugify(input: string, sep: Sep, lowercase: boolean, trim: boolean, limit: number): string {
  if (!input) return '';
  let s = input.replace(/<[^>]*>/g, '');
  // Normalize accents (NFD strip combining marks)
  s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  if (trim) s = s.trim();
  if (lowercase) s = s.toLowerCase();

  const allowed = sep === '.' ? 'a-zA-Z0-9.' : `a-zA-Z0-9${sep === '-' ? '\\-' : '_'}`;
  s = s.replace(new RegExp(`[^${allowed}\\s]`, 'g'), ' ');
  s = s.replace(/\s+/g, sep);

  const sepEsc = sep === '.' ? '\\.' : sep === '-' ? '\\-' : '_';
  s = s.replace(new RegExp(`${sepEsc}+`, 'g'), sep);
  s = s.replace(new RegExp(`^${sepEsc}|${sepEsc}$`, 'g'), '');

  if (limit > 0 && s.length > limit) {
    s = s.slice(0, limit).replace(new RegExp(`${sepEsc}$`), '');
  }
  return s;
}

export default function UrlSlugGeneratorClient() {
  const [input, setInput] = useState('');
  const [sep, setSep] = useState<Sep>('-');
  const [lowercase, setLowercase] = useState(true);
  const [trim, setTrim] = useState(true);
  const [limit, setLimit] = useState(0);
  const [copied, setCopied] = useState(false);

  const slug = useMemo(
    () => slugify(input, sep, lowercase, trim, limit),
    [input, sep, lowercase, trim, limit],
  );

  const copy = () => {
    if (!slug) return;
    navigator.clipboard.writeText(slug).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <div style={{ padding: '8px 20px 0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <div className="tb-v2-mode-tabs" role="group" aria-label="Separator">
          {(['-', '_', '.'] as Sep[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSep(s)}
              className={`tb-v2-mode-tab ${sep === s ? 'on' : ''}`}
              aria-pressed={sep === s}
              aria-label={`Use ${s === '-' ? 'hyphen' : s === '_' ? 'underscore' : 'dot'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste or type any text…"
        className="tb-v2-tool-textarea"
        aria-label="Text to slugify"
      />

      <div className="tb-v2-slug-controls">
        <button
          type="button"
          onClick={() => setLowercase((v) => !v)}
          className={`tb-v2-mode-tab ${lowercase ? 'on' : ''}`}
          aria-pressed={lowercase}
        >
          Lowercase
        </button>
        <button
          type="button"
          onClick={() => setTrim((v) => !v)}
          className={`tb-v2-mode-tab ${trim ? 'on' : ''}`}
          aria-pressed={trim}
        >
          Trim
        </button>
        <span className="tb-v2-slug-divider" aria-hidden="true" />
        <span className="tb-v2-tool-label" style={{ marginRight: 4 }}>
          Limit
        </span>
        {[0, 50, 60, 75].map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLimit(l)}
            className={`tb-v2-mode-tab ${limit === l ? 'on' : ''}`}
            aria-pressed={limit === l}
          >
            {l === 0 ? 'None' : l}
          </button>
        ))}
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Slug</span>
        <button
          type="button"
          onClick={copy}
          disabled={!slug}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!slug ? (
          <div className="tb-v2-empty">Paste text or load Examples to generate a slug</div>
        ) : (
          <>
            <pre className="tb-v2-tool-pre tb-v2-slug-out">{slug}</pre>
            <p className="tb-v2-hash-stats" style={{ marginTop: 8 }}>
              {slug.length} chars{limit > 0 ? ` / limit ${limit}` : ''}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
