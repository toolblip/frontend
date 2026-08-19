'use client';

import { useMemo, useState } from 'react';

interface Token {
  text: string;
  desc: string;
}

const ESCAPE_MAP: Record<string, string> = {
  d: 'A digit (0-9)',
  D: 'A non-digit character',
  w: 'A word character (letter, digit, or underscore)',
  W: 'A non-word character',
  s: 'A whitespace character',
  S: 'A non-whitespace character',
  b: 'A word boundary',
  B: 'A position that is not a word boundary',
  n: 'A newline character',
  t: 'A tab character',
  r: 'A carriage return character',
  '0': 'A NUL character',
};

function describeQuantifierRange(inner: string): string {
  let m = /^(\d+)$/.exec(inner);
  if (m) return `Exactly ${m[1]} of the preceding token`;
  m = /^(\d+),$/.exec(inner);
  if (m) return `${m[1]} or more of the preceding token`;
  m = /^(\d+),(\d+)$/.exec(inner);
  if (m) return `Between ${m[1]} and ${m[2]} of the preceding token`;
  return 'A custom repetition count for the preceding token';
}

function tokenize(pattern: string): Token[] {
  const tokens: Token[] = [];
  const n = pattern.length;
  let i = 0;
  while (i < n) {
    const c = pattern[i];

    if (c === '^') { tokens.push({ text: '^', desc: 'Start of the string (or line, in multiline mode)' }); i++; continue; }
    if (c === '$') { tokens.push({ text: '$', desc: 'End of the string (or line, in multiline mode)' }); i++; continue; }
    if (c === '.') { tokens.push({ text: '.', desc: 'Any character except a line break' }); i++; continue; }

    if (c === '\\') {
      const next = pattern[i + 1];
      if (next && ESCAPE_MAP[next]) {
        tokens.push({ text: `\\${next}`, desc: ESCAPE_MAP[next] });
        i += 2;
        continue;
      }
      if (next) {
        tokens.push({ text: `\\${next}`, desc: `A literal "${next}" character (escaped)` });
        i += 2;
        continue;
      }
      tokens.push({ text: '\\', desc: 'A trailing backslash' });
      i++;
      continue;
    }

    if (c === '[') {
      let j = i + 1;
      let negate = false;
      if (pattern[j] === '^') { negate = true; j++; }
      const start = j;
      while (j < n && pattern[j] !== ']') j++;
      const content = pattern.slice(start, j);
      tokens.push({
        text: pattern.slice(i, Math.min(j + 1, n)),
        desc: `A character class ${negate ? 'excluding' : 'matching one of'}: ${content || '(empty)'}`,
      });
      i = j + 1;
      continue;
    }

    if (c === '(') {
      const rest = pattern.slice(i);
      if (rest.startsWith('(?:')) { tokens.push({ text: '(?:', desc: 'Start of a non-capturing group' }); i += 3; continue; }
      if (rest.startsWith('(?=')) { tokens.push({ text: '(?=', desc: 'Start of a positive lookahead' }); i += 3; continue; }
      if (rest.startsWith('(?!')) { tokens.push({ text: '(?!', desc: 'Start of a negative lookahead' }); i += 3; continue; }
      if (rest.startsWith('(?<=')) { tokens.push({ text: '(?<=', desc: 'Start of a positive lookbehind' }); i += 4; continue; }
      if (rest.startsWith('(?<!')) { tokens.push({ text: '(?<!', desc: 'Start of a negative lookbehind' }); i += 4; continue; }
      const named = /^\(\?<([A-Za-z_][A-Za-z0-9_]*)>/.exec(rest);
      if (named) { tokens.push({ text: named[0], desc: `Start of a named capturing group called "${named[1]}"` }); i += named[0].length; continue; }
      tokens.push({ text: '(', desc: 'Start of a capturing group' });
      i++;
      continue;
    }
    if (c === ')') { tokens.push({ text: ')', desc: 'End of the group' }); i++; continue; }
    if (c === '|') { tokens.push({ text: '|', desc: 'OR — matches the pattern on either side' }); i++; continue; }

    if (c === '*') { tokens.push({ text: '*', desc: 'Zero or more of the preceding token' }); i++; continue; }
    if (c === '+') { tokens.push({ text: '+', desc: 'One or more of the preceding token' }); i++; continue; }
    if (c === '?') { tokens.push({ text: '?', desc: 'Zero or one of the preceding token (optional), or makes the previous quantifier lazy' }); i++; continue; }

    if (c === '{') {
      let j = i + 1;
      while (j < n && pattern[j] !== '}') j++;
      if (j < n) {
        const inner = pattern.slice(i + 1, j);
        tokens.push({ text: pattern.slice(i, j + 1), desc: describeQuantifierRange(inner) });
        i = j + 1;
        continue;
      }
      tokens.push({ text: '{', desc: 'A literal "{" character' });
      i++;
      continue;
    }

    tokens.push({ text: c, desc: `A literal "${c}" character` });
    i++;
  }
  return tokens;
}

export default function RegexDescriptionGeneratorClient() {
  const [pattern, setPattern] = useState('^[\\w.+-]+@[\\w-]+\\.[A-Za-z]{2,}$');

  const tokens = useMemo(() => tokenize(pattern), [pattern]);

  const validity = useMemo(() => {
    if (!pattern) return { valid: false, message: 'Enter a regex pattern to get started.' };
    try {
      new RegExp(pattern);
      return { valid: true, message: 'This is a syntactically valid JavaScript regular expression.' };
    } catch (e) {
      return { valid: false, message: (e as Error).message };
    }
  }, [pattern]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Regex pattern</span>
      </div>
      <div className="tb-v2-rgx-pattern">
        <span className="tb-v2-rgx-slash">/</span>
        <input
          value={pattern}
          onChange={e => setPattern(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          className="tb-v2-rgx-input"
          aria-label="Regular expression pattern"
        />
        <span className="tb-v2-rgx-slash">/</span>
      </div>

      <p className={`tb-v2-banner ${validity.valid ? 'tb-v2-banner-ok' : 'tb-v2-banner-err'}`} style={{ marginTop: 12 }}>
        {validity.message}
      </p>

      <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">Plain-English breakdown</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {tokens.length === 0 ? (
          <p className="tb-v2-empty">Enter a pattern above to see a breakdown.</p>
        ) : (
          <ol className="tb-v2-rgx-list">
            {tokens.map((t, i) => (
              <li key={i} className="tb-v2-rgx-item">
                <code className="tb-v2-rgx-text">{t.text}</code>
                <span style={{ marginLeft: 8 }}>{t.desc}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
