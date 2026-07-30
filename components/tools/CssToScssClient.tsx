'use client';

import { useState, useMemo } from 'react';

const EXAMPLE = `:root {
  --primary: #7c3aed;
}

.card {
  padding: 16px;
  background: var(--primary);
}

.card .title {
  font-size: 20px;
  font-weight: bold;
}

.card .body {
  color: #444;
}

.nav a {
  color: blue;
  text-decoration: none;
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

function convertVars(text: string): string {
  let out = text;
  out = out.replace(/--([\w-]+)\s*:\s*([^;]+);/g, (_m, name, val) => `$${name}: ${val.trim()};`);
  out = out.replace(/var\(--([\w-]+)\)/g, (_m, name) => `$${name}`);
  return out;
}

function indent(text: string, spaces: number): string {
  const pad = ' '.repeat(spaces);
  return text
    .split('\n')
    .filter(l => l.trim())
    .map(l => pad + l.trim())
    .join('\n');
}

function cssToNestedScss(css: string): string {
  const rules = parseRules(css).map(r => ({ selector: r.selector, body: convertVars(r.body) }));

  const topLevel: Rule[] = [];
  const grouped = new Map<string, Rule[]>();

  for (const rule of rules) {
    const spaceIdx = rule.selector.indexOf(' ');
    if (spaceIdx === -1) {
      topLevel.push(rule);
    } else {
      const parent = rule.selector.slice(0, spaceIdx);
      const rest = rule.selector.slice(spaceIdx + 1).trim();
      if (!grouped.has(parent)) grouped.set(parent, []);
      grouped.get(parent)!.push({ selector: rest, body: rule.body });
    }
  }

  const output: string[] = [];
  const emittedParents = new Set<string>();

  for (const rule of topLevel) {
    const children = grouped.get(rule.selector);
    if (children && children.length > 0) {
      emittedParents.add(rule.selector);
      const parts = [rule.body, ...children.map(c => `${c.selector} {\n${indent(c.body, 2)}\n}`)].filter(Boolean);
      output.push(`${rule.selector} {\n${indent(parts.join('\n\n'), 2)}\n}`);
    } else {
      output.push(`${rule.selector} {\n${indent(rule.body, 2)}\n}`);
    }
  }

  for (const [parent, children] of grouped) {
    if (emittedParents.has(parent)) continue;
    const childBlocks = children.map(c => `${c.selector} {\n${indent(c.body, 2)}\n}`).join('\n\n');
    output.push(`${parent} {\n${indent(childBlocks, 2)}\n}`);
  }

  return output.join('\n\n');
}

export default function CssToScssClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => cssToNestedScss(input), [input]);

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
        <span className="tb-v2-tool-label">Nested SCSS Output</span>
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
