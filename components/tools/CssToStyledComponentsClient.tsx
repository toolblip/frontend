'use client';

import { useState, useMemo } from 'react';

const EXAMPLE = `.card {
  padding: 16px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.primary-button {
  background: #7c3aed;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
}

nav {
  display: flex;
  gap: 12px;
}`;

interface Rule {
  selector: string;
  body: string;
}

function parseRules(css: string): Rule[] {
  const rules: Rule[] = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    rules.push({ selector: m[1].trim(), body: m[2].trim() });
  }
  return rules;
}

function selectorToComponentName(selector: string): string {
  const first = selector.split(/\s+/)[0].split(':')[0];
  const bare = first.replace(/^[.#]/, '');
  const words = bare.split(/[-_]+/).filter(Boolean);
  const name = words.map(w => w[0].toUpperCase() + w.slice(1)).join('');
  return name || 'StyledComponent';
}

function selectorToTag(selector: string): string {
  const first = selector.split(/\s+/)[0].split(':')[0];
  return /^[a-zA-Z][\w-]*$/.test(first) ? first : 'div';
}

function cssToStyledComponents(css: string): string {
  const rules = parseRules(css);
  return rules
    .map(r => {
      const tag = selectorToTag(r.selector);
      const name = selectorToComponentName(r.selector);
      const decls = r.body
        .split(';')
        .map(s => s.trim())
        .filter(Boolean)
        .map(decl => `  ${decl};`)
        .join('\n');
      return `const ${name} = styled.${tag}\`\n${decls}\n\`;`;
    })
    .join('\n\n');
}

export default function CssToStyledComponentsClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => cssToStyledComponents(input), [input]);

  const loadExample = () => setInput(EXAMPLE);

  const copy = () => {
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSS Input</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        spellCheck={false}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', minHeight: 200 }}
      />
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">styled-components Output</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{result || ' - '}</pre>
      </div>
    </div>
  );
}
