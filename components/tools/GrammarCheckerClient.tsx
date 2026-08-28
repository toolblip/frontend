'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

interface Issue {
  message: string;
  shortMessage: string;
  context: { text: string; offset: number; length: number };
  replacements: { value: string }[];
  rule: { id: string; description: string };
  type: { name: string };
  offset: number;
  length: number;
}

const EXAMPLE_TEXT =
  "Their going to the store tomorrow, but there not sure if it's open. Me and him was hoping to buy some supplies for the party.";

export default function GrammarCheckerClient() {
  const [text, setText] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetResults = () => {
    setIssues([]);
    setError('');
  };

  const checkGrammar = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `text=${encodeURIComponent(text)}&language=en-US`,
      });
      if (!res.ok) throw new Error('Grammar API unavailable');
      const data = await res.json();
      setIssues(data.matches || []);
    } catch {
      setError('Could not reach grammar service. Check your connection.');
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

  return (
    <div>
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
        placeholder="Type or paste your text here to check for grammar and spelling errors..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 150 }}
      />

      <div style={{ marginTop: 12 }}>
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
        <div className="tb-v2-tool-output-body" style={{ marginTop: 12 }}>
          <p className="tb-v2-status tb-v2-status-err">{error}</p>
        </div>
      )}

      {issues.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">
              {issues.length} issue{issues.length !== 1 ? 's' : ''} found
            </span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {issues.map((issue, i) => (
              <div
                key={i}
                style={{ border: '1px solid var(--line)', borderRadius: 8, padding: 12, background: 'var(--tb-bg-secondary)' }}
              >
                <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{issue.message}</p>
                <p style={{ fontSize: 12, color: 'var(--tb-text-secondary)', marginTop: 4 }}>{issue.rule.description}</p>
                {issue.replacements.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--tb-text-secondary)' }}>Fix:</span>
                    {issue.replacements.slice(0, 3).map((r, j) => (
                      <button key={j} type="button" onClick={() => applyFix(issue)} className="tb-v2-copy-btn">
                        {r.value}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && !error && issues.length === 0 && text.trim().length > 0 && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 12 }}>
          <span style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>No issues found yet. Click Check Grammar to analyze.</span>
        </div>
      )}
    </div>
  );
}
