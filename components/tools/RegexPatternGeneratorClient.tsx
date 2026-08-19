'use client';

import { Fragment, useMemo, useState } from 'react';

interface Preset {
  id: string;
  label: string;
  keywords: string[];
  pattern: string;
  flags: string;
  explanation: string;
  example: string;
}

const PRESETS: Preset[] = [
  { id: 'email', label: 'Email address', keywords: ['email', 'e-mail', 'mail', '@'], pattern: '^[\\w.+-]+@[\\w-]+\\.[A-Za-z]{2,}$', flags: '', explanation: 'Matches a standard email address: local part, @, domain name, and a 2+ letter TLD.', example: 'ada@example.com' },
  { id: 'url', label: 'URL', keywords: ['url', 'link', 'website', 'http'], pattern: '^(https?:\\/\\/)?([\\w-]+\\.)+[a-z]{2,}(:\\d+)?(\\/\\S*)?$', flags: 'i', explanation: 'Matches an http(s) URL with an optional protocol, domain, optional port, and optional path.', example: 'https://toolblip.com/tools' },
  { id: 'ipv4', label: 'IPv4 address', keywords: ['ip', 'ipv4', 'address'], pattern: '^((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)$', flags: '', explanation: 'Matches an IPv4 address, validating each octet is between 0 and 255.', example: '192.168.1.1' },
  { id: 'ipv6', label: 'IPv6 address (full form)', keywords: ['ip', 'ipv6', 'address'], pattern: '^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$', flags: '', explanation: 'Matches a full-form IPv6 address made of eight groups of 1-4 hex digits (does not handle "::" shorthand).', example: '2001:0db8:0000:0000:0000:ff00:0042:8329' },
  { id: 'us-phone', label: 'US phone number', keywords: ['phone', 'us', 'telephone'], pattern: '^\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$', flags: '', explanation: 'Matches common US phone number formats with optional parentheses, dashes, dots, or spaces.', example: '(415) 555-0132' },
  { id: 'intl-phone', label: 'International phone (E.164)', keywords: ['phone', 'international', 'e.164'], pattern: '^\\+[1-9]\\d{1,14}$', flags: '', explanation: 'Matches an E.164 international phone number: a leading + followed by 2-15 digits.', example: '+14155550132' },
  { id: 'hex-color', label: 'Hex color code', keywords: ['color', 'hex', 'css'], pattern: '^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$', flags: '', explanation: 'Matches a 3- or 6-digit hex color code with an optional leading #.', example: '#58D65D' },
  { id: 'us-zip', label: 'US ZIP code', keywords: ['zip', 'postal', 'us'], pattern: '^\\d{5}(-\\d{4})?$', flags: '', explanation: 'Matches a 5-digit US ZIP code with an optional 4-digit extension.', example: '94103-1234' },
  { id: 'date-iso', label: 'Date (ISO, YYYY-MM-DD)', keywords: ['date', 'iso'], pattern: '^\\d{4}-\\d{2}-\\d{2}$', flags: '', explanation: 'Matches an ISO 8601 calendar date in YYYY-MM-DD form.', example: '2026-08-14' },
  { id: 'date-us', label: 'Date (US, MM/DD/YYYY)', keywords: ['date', 'us'], pattern: '^(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/\\d{4}$', flags: '', explanation: 'Matches a US-style date in MM/DD/YYYY form, validating month and day ranges.', example: '08/14/2026' },
  { id: 'time-24h', label: 'Time (24-hour)', keywords: ['time', '24 hour', 'clock'], pattern: '^([01]\\d|2[0-3]):[0-5]\\d(:[0-5]\\d)?$', flags: '', explanation: 'Matches a 24-hour time in HH:MM or HH:MM:SS form.', example: '23:59:00' },
  { id: 'uuid', label: 'UUID', keywords: ['uuid', 'guid'], pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$', flags: '', explanation: 'Matches a standard 8-4-4-4-12 hyphenated UUID.', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
  { id: 'credit-card', label: 'Credit card number', keywords: ['credit card', 'card', 'payment'], pattern: '^\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}$', flags: '', explanation: 'Matches a 16-digit credit card number, optionally grouped by spaces or dashes.', example: '4111 1111 1111 1111' },
  { id: 'ip-port', label: 'IP:port', keywords: ['ip', 'port', 'socket'], pattern: '^((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d):\\d{1,5}$', flags: '', explanation: 'Matches an IPv4 address followed by a colon and a port number.', example: '127.0.0.1:8080' },
  { id: 'slug', label: 'URL slug', keywords: ['slug', 'url', 'seo'], pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', flags: '', explanation: 'Matches a lowercase, hyphen-separated URL slug with no leading/trailing/double hyphens.', example: 'regex-pattern-generator' },
  { id: 'username', label: 'Username', keywords: ['username', 'handle'], pattern: '^[a-zA-Z0-9_]{3,16}$', flags: '', explanation: 'Matches a username of 3-16 letters, digits, or underscores.', example: 'ada_lovelace1' },
  { id: 'strong-password', label: 'Strong password', keywords: ['password', 'strong'], pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$', flags: '', explanation: 'Requires at least 8 characters including a lowercase letter, an uppercase letter, a digit, and a symbol.', example: 'Tr0ub4dor&3' },
  { id: 'html-tag', label: 'HTML tag', keywords: ['html', 'tag', 'markup'], pattern: '<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>(.*?)<\\/\\1>', flags: '', explanation: 'Matches an opening and matching closing HTML tag, capturing the tag name and inner content.', example: '<strong>hello</strong>' },
  { id: 'md-link', label: 'Markdown link', keywords: ['markdown', 'link'], pattern: '\\[([^\\]]+)\\]\\(([^)]+)\\)', flags: '', explanation: 'Matches a Markdown link, capturing the link text and the URL.', example: '[Toolblip](https://toolblip.com)' },
  { id: 'hashtag', label: 'Hashtag', keywords: ['hashtag', 'social'], pattern: '#[A-Za-z0-9_]+', flags: '', explanation: 'Matches a hashtag: a # followed by letters, digits, or underscores.', example: 'Loving #regex today' },
  { id: 'mention', label: 'Mention (@username)', keywords: ['mention', 'social'], pattern: '@[A-Za-z0-9_]+', flags: '', explanation: 'Matches an @mention: an @ followed by letters, digits, or underscores.', example: 'Thanks @toolblip!' },
  { id: 'currency-usd', label: 'Currency (USD)', keywords: ['currency', 'usd', 'money', 'price'], pattern: '^\\$\\d{1,3}(,\\d{3})*(\\.\\d{2})?$', flags: '', explanation: 'Matches a US dollar amount with optional thousands separators and cents.', example: '$1,234.56' },
  { id: 'integer', label: 'Integer', keywords: ['integer', 'number', 'int'], pattern: '^-?\\d+$', flags: '', explanation: 'Matches a positive or negative whole number.', example: '-42' },
  { id: 'decimal', label: 'Decimal number', keywords: ['decimal', 'float', 'number'], pattern: '^-?\\d+\\.\\d+$', flags: '', explanation: 'Matches a positive or negative decimal number with at least one digit on each side of the dot.', example: '3.14' },
  { id: 'whitespace-trim', label: 'Leading/trailing whitespace', keywords: ['whitespace', 'trim', 'space'], pattern: '^\\s+|\\s+$', flags: 'g', explanation: 'Matches whitespace at the very start or end of a string — useful for trimming.', example: '   padded text   ' },
  { id: 'non-empty', label: 'Non-empty string', keywords: ['non-empty', 'required', 'not blank'], pattern: '^\\S+$', flags: '', explanation: 'Matches a string that has at least one non-whitespace character.', example: 'hello' },
];

interface Segment { text: string; hit: boolean }

function highlight(pattern: string, flags: string, sample: string): { segments: Segment[]; count: number; error: string } {
  if (!pattern || !sample) return { segments: [{ text: sample, hit: false }], count: 0, error: '' };
  let re: RegExp;
  try {
    const f = flags.includes('g') ? flags : flags + 'g';
    re = new RegExp(pattern, f);
  } catch (e) {
    return { segments: [{ text: sample, hit: false }], count: 0, error: (e as Error).message };
  }
  const segments: Segment[] = [];
  let last = 0;
  let count = 0;
  let m: RegExpExecArray | null;
  let safety = 0;
  while ((m = re.exec(sample)) !== null) {
    if (safety++ > 5000) break;
    if (m[0] === '' && re.lastIndex === m.index) { re.lastIndex++; continue; }
    if (m.index > last) segments.push({ text: sample.slice(last, m.index), hit: false });
    segments.push({ text: m[0], hit: true });
    last = m.index + m[0].length;
    count++;
  }
  if (last < sample.length) segments.push({ text: sample.slice(last), hit: false });
  if (segments.length === 0) segments.push({ text: sample, hit: false });
  return { segments, count, error: '' };
}

export default function RegexPatternGeneratorClient() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('email');
  const [testString, setTestString] = useState('ada@example.com\nnot an email');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return PRESETS;
    return PRESETS.filter(p => p.label.toLowerCase().includes(q) || p.id.includes(q) || p.keywords.some(k => k.includes(q)));
  }, [search]);

  const preset = useMemo(() => PRESETS.find(p => p.id === selectedId) ?? PRESETS[0], [selectedId]);
  const result = useMemo(() => highlight(preset.pattern, preset.flags, testString), [preset, testString]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Describe what you need</span>
      </div>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search or type a keyword, e.g. &quot;email&quot;, &quot;phone&quot;, &quot;date&quot;..."
        className="tb-v2-input"
        style={{ marginBottom: 10 }}
      />

      <div className="tb-v2-tool-output-body" style={{ maxHeight: 220, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <p className="tb-v2-empty">No presets match that search.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {filtered.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={`tb-v2-mode-tab ${selectedId === p.id ? 'on' : ''}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">Generated pattern</span>
        <button
          type="button"
          className="tb-v2-copy-btn"
          onClick={() => navigator.clipboard.writeText(preset.pattern).catch(() => {})}
        >
          Copy
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre className="tb-v2-tool-pre" style={{ fontFamily: 'var(--f-mono)' }}>
          /{preset.pattern}/{preset.flags}
        </pre>
        <p style={{ marginTop: 8, fontSize: 13, color: 'var(--fg-2)' }}>{preset.explanation}</p>
        <p style={{ marginTop: 4, fontSize: 12, color: 'var(--fg-2)' }}>Example match: <code>{preset.example}</code></p>
      </div>

      <div className="tb-v2-tool-input-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">Test string</span>
        <span className="tb-v2-hash-stats">{result.error ? ' - ' : `${result.count} match${result.count === 1 ? '' : 'es'}`}</span>
      </div>
      <textarea
        value={testString}
        onChange={e => setTestString(e.target.value)}
        placeholder="Paste text to test the pattern against..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
      />

      {result.error && (
        <p className="tb-v2-error" role="alert" style={{ marginTop: 8 }}>
          <strong>Invalid pattern:</strong> {result.error}
        </p>
      )}

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Highlighted matches</span>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre className="tb-v2-tool-pre tb-v2-rgx-hl">
          {result.segments.map((s, i) =>
            s.hit ? <mark key={i} className="tb-v2-rgx-mark">{s.text}</mark> : <Fragment key={i}>{s.text}</Fragment>,
          )}
          {!testString && ' - '}
        </pre>
      </div>
    </div>
  );
}
