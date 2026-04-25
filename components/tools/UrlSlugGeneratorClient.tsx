'use client';

import { useMemo, useState } from 'react';

type Sep = '-' | '_' | '.';

const EXAMPLES = [
  'Hello World Example!',
  '  Multiple   Spaces   Here  ',
  'Special!@#Characters$%^',
  'UPPERCASE Text Input',
  'Café au lait — résumé',
];

function slugify(input: string, sep: Sep, lowercase: boolean, trim: boolean, limit: number): string {
  if (!input) return '';
  let s = input.replace(/<[^>]*>/g, '');
  // Normalize accents (NFD strip combining marks)
  s = s.normalize('NFKD').replace(/[̀-ͯ]/g, '');
  if (trim) s = s.trim();
  if (lowercase) s = s.toLowerCase();

  const allowed = sep === '.' ? 'a-zA-Z0-9.' : `a-zA-Z0-9${sep === '-' ? '\\-' : '_'}`;
  // Replace anything not allowed (and not whitespace) with space, then collapse spaces to sep
  s = s.replace(new RegExp(`[^${allowed}\\s]`, 'g'), ' ');
  s = s.replace(/\s+/g, sep);

  // Collapse repeated separators
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
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
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
        <span className="tb-v2-tool-label" style={{ marginRight: 4 }}>Limit</span>
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
        <pre className="tb-v2-tool-pre tb-v2-slug-out">{slug || '—'}</pre>
        {slug && (
          <p className="tb-v2-hash-stats" style={{ marginTop: 8 }}>
            {slug.length} chars{limit > 0 ? ` / limit ${limit}` : ''}
          </p>
        )}
      </div>

      <div className="tb-v2-slug-examples">
        <span className="tb-v2-tool-label">Examples</span>
        <div>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setInput(ex)}
              className="tb-v2-mode-tab"
              title={ex}
            >
              {ex.length > 26 ? ex.slice(0, 26) + '…' : ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
