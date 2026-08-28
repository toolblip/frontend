'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

interface Issue {
  message: string;
  shortMessage: string;
  context: { text: string; offset: number; length: number };
  replacements: { value: string }[];
  rule: { id: string; description: string; category: { id: string; name: string } };
  offset: number;
  length: number;
}

const EXAMPLE_TEXT =
  "Their going to the store tomorrow, but there not sure if it's open. Me and him was hoping to buy some supplies for the party.";

function highlightContext(issue: Issue) {
  const { text, offset, length } = issue.context;
  const before = text.slice(0, offset);
  const mark = text.slice(offset, offset + length);
  const after = text.slice(offset + length);
  return { before, mark, after };
}

export default function GrammarCheckerV2Client() {
  const [text, setText] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState(false);

  const resetResults = () => {
    setChecked(false);
    setIssues([]);
    setError('');
  };

  const checkGrammar = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/grammar-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: 'en-US' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Grammar API unavailable');
      setIssues(data.matches || []);
      setChecked(true);
    } catch {
      setError('Could not reach grammar service. Try again in a moment.');
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFix = (issue: Issue) => {
    if (!issue.replacements.length) return;
    const fixed = text.slice(0, issue.offset) + issue.replacements[0].value + text.slice(issue.offset + issue.length);
    setText(fixed);
    setIssues((prev) => prev.filter((i) => i !== issue));
  };

  const groups = issues.reduce<Record<string, Issue[]>>((acc, issue) => {
    const name = issue.rule?.category?.name || 'Other';
    (acc[name] = acc[name] || []).push(issue);
    return acc;
  }, {});
  const categoryNames = Object.keys(groups).sort((a, b) => groups[b].length - groups[a].length);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter your text</span>
        <ToolExampleClearActions
          onExample={() => {
            setText(EXAMPLE_TEXT);
            resetResults();
          }}
          onClear={() => {
            setText('');
            resetResults();
          }}
          canClear={text.length > 0}
        />
      </div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          resetResults();
        }}
        placeholder="Type or paste your text here to check for grammar, spelling, and punctuation issues..."
        className="tb-v2-tool-textarea"
        rows={6}
      />

      <div className="tb-v2-toolbar">
        <button
          type="button"
          onClick={checkGrammar}
          disabled={loading || !text.trim()}
          className="tb-v2-btn tb-v2-btn-primary"
        >
          {loading ? 'Checking...' : 'Check Grammar'}
        </button>
      </div>

      {error && (
        <div className="tb-v2-tool-output-body">
          <p className="tb-v2-status tb-v2-status-err">{error}</p>
        </div>
      )}

      {checked && !error && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">
              {issues.length} issue{issues.length !== 1 ? 's' : ''} found
            </span>
          </div>
          <div className="tb-v2-tool-output-body">
            {issues.length === 0 ? (
              <div className="tb-v2-empty">No issues found. Your text looks good.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {categoryNames.map((category) => (
                  <div key={category}>
                    <div className="tb-v2-section-title" style={{ marginBottom: 8 }}>
                      {category} ({groups[category].length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {groups[category].map((issue, i) => {
                        const { before, mark, after } = highlightContext(issue);
                        return (
                          <div
                            key={i}
                            style={{
                              border: '1px solid var(--line)',
                              borderRadius: 'var(--radius-sm)',
                              padding: 12,
                              background: 'var(--surface)',
                            }}
                          >
                            <p style={{ fontSize: 13.5, color: 'var(--fg-0)', fontWeight: 600, margin: 0 }}>{issue.message}</p>
                            <p
                              style={{
                                fontFamily: 'var(--f-mono)',
                                fontSize: 12.5,
                                marginTop: 8,
                                color: 'var(--fg-2)',
                                background: 'var(--surface-2)',
                                padding: '8px 10px',
                                borderRadius: 6,
                                overflowWrap: 'anywhere',
                              }}
                            >
                              {before}
                              <mark style={{ background: 'var(--red-tint)', color: 'var(--red)', borderRadius: 3, padding: '0 2px' }}>
                                {mark}
                              </mark>
                              {after}
                            </p>
                            {issue.replacements.length > 0 && (
                              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>Fix:</span>
                                {issue.replacements.slice(0, 3).map((r, j) => (
                                  <button key={j} type="button" onClick={() => applyFix(issue)} className="tb-v2-copy-btn">
                                    {r.value || '(remove)'}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
