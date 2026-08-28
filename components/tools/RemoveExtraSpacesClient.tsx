'use client';

import { useState, useMemo } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

function cleanText(text: string): string {
  let out = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  out = out.replace(/[ \t]+/g, ' ');
  out = out
    .split('\n')
    .map(line => line.replace(/[ \t]+$/, ''))
    .join('\n');
  out = out.replace(/\n{3,}/g, '\n\n');
  return out.trim();
}

export default function RemoveExtraSpacesClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => cleanText(input), [input]);

  const reduction = input.length - output.length;
  const reductionPct = input.length > 0 ? ((reduction / input.length) * 100).toFixed(1) : '0.0';

  const loadExample = () => {
    setInput('This   is  some\t\tmessy   text.\n\n\n\nIt has   extra spaces,    tabs,\nand   way too many blank lines.   \n\n\n\n\nClean it up!   ');
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input</span>
        <ToolExampleClearActions
          onExample={loadExample}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        className="tb-v2-tool-textarea"
        placeholder="Paste messy, copy-pasted text with extra spaces, tabs, or blank lines..."
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={6}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Cleaned Output</span>
        <button type="button" onClick={copyOutput} disabled={!input} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!input ? (
          <p className="tb-v2-empty">Paste text above to clean up extra spaces, tabs, and line breaks.</p>
        ) : (
          <>
            <textarea
              readOnly
              value={output}
              rows={8}
              className="tb-v2-input"
              style={{ fontFamily: 'var(--f-mono)', resize: 'vertical' }}
            />
            <div className="tb-v2-stats-grid" style={{ marginTop: 12 }}>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{input.length}</span>
                <span className="tb-v2-stat-pill-lbl">Before (chars)</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{output.length}</span>
                <span className="tb-v2-stat-pill-lbl">After (chars)</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{reduction}</span>
                <span className="tb-v2-stat-pill-lbl">Chars Removed</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{reductionPct}%</span>
                <span className="tb-v2-stat-pill-lbl">Reduction</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
