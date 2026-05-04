'use client';

import { useState } from 'react';

export default function CssToScssConverterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const css = input.trim();
    const lines = css.split('\n');
    let scss = '';
    let indentLevel = 0;
    const indent = '  ';

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith('/*') || trimmedLine.startsWith('//')) {
        if (trimmedLine.startsWith('/*') && !trimmedLine.includes('*/')) {
          scss += line + '\n';
          while (i < lines.length - 1 && !lines[i].includes('*/')) {
            i++;
            scss += lines[i] + '\n';
          }
        } else if (trimmedLine.startsWith('//')) {
          scss += line + '\n';
        } else {
          scss += line + '\n';
        }
        continue;
      }

      if (trimmedLine === '}') {
        indentLevel = Math.max(0, indentLevel - 1);
        scss += indent.repeat(indentLevel) + trimmedLine + '\n';
        continue;
      }

      const openBraces = (trimmedLine.match(/{/g) || []).length;
      const closeBraces = (trimmedLine.match(/}/g) || []).length;

      if (openBraces > 0 && trimmedLine.includes(':') && !trimmedLine.includes('{')) {
        const colonIndex = trimmedLine.indexOf(':');
        const property = trimmedLine.slice(0, colonIndex).trim();
        const value = trimmedLine.slice(colonIndex + 1).replace(/;$/, '').trim();
        scss += indent.repeat(indentLevel) + property + ': ' + value + ';' + '\n';
        indentLevel += openBraces - closeBraces;
        continue;
      }

      if (trimmedLine.includes('{')) {
        const selector = trimmedLine.replace(/\{.*$/, '').trim();
        if (selector) {
          scss += indent.repeat(indentLevel) + selector + ' {' + '\n';
          indentLevel++;
        }
      } else if (trimmedLine.includes(':') && !trimmedLine.includes('{')) {
        const colonIndex = trimmedLine.indexOf(':');
        const property = trimmedLine.slice(0, colonIndex).trim();
        const value = trimmedLine.slice(colonIndex + 1).replace(/;$/, '').trim();
        scss += indent.repeat(indentLevel) + property + ': ' + value + ';' + '\n';
      } else {
        scss += indent.repeat(indentLevel) + trimmedLine + '\n';
      }
    }

    setOutput(scss.trim());
  };

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
        placeholder=".container {&#10;  width: 100%;&#10;  margin: 0 auto;&#10;}&#10;&#10;.header {&#10;  background: #fff;&#10;  padding: 20px;&#10;}"
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
