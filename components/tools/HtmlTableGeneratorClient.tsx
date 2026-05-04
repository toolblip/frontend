'use client';

import { useState } from 'react';

export default function HtmlTableGeneratorClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [headers, setHeaders] = useState('Name,Age,City');
  const [bordered, setBordered] = useState(false);
  const [striped, setStriped] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateTable = () => {
    if (!input.trim() && !headers.trim()) {
      setOutput('');
      return;
    }

    const headerList = headers.split(',').map(h => h.trim()).filter(Boolean);
    const rows = input.split('\n').filter(row => row.trim());
    
    let html = '<table>\n';
    
    if (headerList.length > 0) {
      html += '  <thead>\n    <tr>\n';
      headerList.forEach(h => {
        html += `      <th>${escapeHtml(h)}</th>\n`;
      });
      html += '    </tr>\n  </thead>\n';
    }
    
    html += '  <tbody>\n';
    rows.forEach((row, rowIndex) => {
      const cells = row.split(',').map(c => c.trim());
      const rowClass = striped && rowIndex % 2 === 1 ? ' class="striped"' : '';
      html += `    <tr${rowClass}>\n`;
      headerList.forEach((_, colIndex) => {
        const cell = cells[colIndex] || '';
        html += `      <td>${escapeHtml(cell)}</td>\n`;
      });
      html += '    </tr>\n';
    });
    html += '  </tbody>\n</table>';

    if (bordered) {
      html = html.replace('<table>', '<table border="1" cellpadding="5" cellspacing="0">');
    }

    setOutput(html);
  };

  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const previewTable = (): { __html: string } | undefined => {
    if (!output) return undefined;
    return { __html: output };
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSV Data</span>
        <span className="tb-v2-hash-stats">One row per line, comma-separated</span>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="John,30,New York&#10;Jane,25,Los Angeles&#10;Bob,35,Chicago"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="CSV input"
      />

      <div className="tb-v2-tool-input-head" style={{ marginTop: '12px' }}>
        <span className="tb-v2-tool-label">Headers</span>
      </div>
      <input
        type="text"
        value={headers}
        onChange={(e) => setHeaders(e.target.value)}
        placeholder="Name,Age,City"
        className="tb-v2-tool-input"
        aria-label="Table headers"
      />

      <div className="tb-v2-tool-options">
        <label className="tb-v2-checkbox-label">
          <input
            type="checkbox"
            checked={bordered}
            onChange={(e) => setBordered(e.target.checked)}
          />
          Bordered
        </label>
        <label className="tb-v2-checkbox-label">
          <input
            type="checkbox"
            checked={striped}
            onChange={(e) => setStriped(e.target.checked)}
          />
          Striped rows
        </label>
      </div>

      <div className="tb-v2-tool-actions">
        <button type="button" onClick={generateTable} className="tb-v2-primary-btn">
          Generate Table
        </button>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">HTML Output</span>
        {output && (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <textarea
        value={output}
        readOnly
        placeholder="HTML table code will appear here..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="HTML output"
      />

      {output && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Preview</span>
          </div>
          <div
            className="tb-v2-tool-output-body"
            style={{ overflowX: 'auto', padding: '16px', border: '1px solid var(--tb-border)', borderRadius: '8px' }}
            dangerouslySetInnerHTML={previewTable()}
          />
        </>
      )}
    </div>
  );
}
