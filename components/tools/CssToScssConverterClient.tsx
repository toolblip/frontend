'use client';

import { useEffect, useState } from 'react';

export default function CssToScssConverterClient() {
  const [input, setInput] = useState('body { color: #333; }\n.card { padding: 8px; }\n.card .title { font-weight: 700; }');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const indent = '  ';

    const formatDeclarations = (body: string, depth: number) =>
      body
        .split(';')
        .map(part => part.trim())
        .filter(Boolean)
        .filter(part => part.includes(':'))
        .map(part => {
          const [property, ...rest] = part.split(':');
          const value = rest.join(':').trim();
          return `${indent.repeat(depth + 1)}${property.trim()}: ${value};`;
        });

    const formatStandaloneRule = (selector: string, body: string, depth = 0) => {
      const declarations = formatDeclarations(body, depth);
      return `${indent.repeat(depth)}${selector.trim()} {${declarations.length ? `\n${declarations.join('\n')}\n` : '\n'}${indent.repeat(depth)}}`;
    };

    type Node = {
      selector: string;
      declarations: string[];
      children: Map<string, Node>;
    };

    const root: Node = { selector: '', declarations: [], children: new Map() };
    const standalone: string[] = [];
    const rules = Array.from(input.matchAll(/([^{}]+)\{([^{}]*)\}/g));

    for (const match of rules) {
      const selector = match[1].trim();
      const body = match[2].trim();

      if (
        !selector ||
        selector.includes(',') ||
        selector.includes('>') ||
        selector.includes('+') ||
        selector.includes('~') ||
        selector.startsWith('@')
      ) {
        standalone.push(formatStandaloneRule(selector, body));
        continue;
      }

      const parts = selector.split(/\s+/).filter(Boolean);
      let node = root;
      for (const part of parts) {
        if (!node.children.has(part)) {
          node.children.set(part, { selector: part, declarations: [], children: new Map() });
        }
        node = node.children.get(part)!;
      }
      node.declarations.push(...formatDeclarations(body, parts.length - 1));
    }

    const renderNode = (node: Node, depth: number): string => {
      const lines = [`${indent.repeat(depth)}${node.selector} {`];
      if (node.declarations.length) {
        lines.push(...node.declarations);
      }
      for (const child of node.children.values()) {
        if (node.declarations.length) {
          lines.push('');
        }
        lines.push(renderNode(child, depth + 1));
      }
      lines.push(`${indent.repeat(depth)}}`);
      return lines.join('\n');
    };

    const converted = [
      ...standalone,
      ...Array.from(root.children.values()).map(child => renderNode(child, 0)),
    ]
      .filter(Boolean)
      .join('\n\n');

    setOutput(converted || input.trim());
  };

  useEffect(() => {
    convert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const clear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSS Input</span>
        <button type="button" onClick={clear} className="tb-v2-mode-tab">Clear</button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="body {\n  color: #333;\n}\n\n.card {\n  padding: 8px;\n}\n\n.card .title {\n  font-weight: 700;\n}"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="CSS input"
      />

      <div className="tb-v2-tool-actions">
        <button type="button" onClick={convert} className="tb-v2-primary-btn">
          Convert to SCSS
        </button>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">SCSS Output</span>
        {output && (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <textarea
        value={output}
        readOnly
        placeholder="SCSS output will appear here..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="SCSS output"
      />
    </div>
  );
}
