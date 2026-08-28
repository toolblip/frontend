'use client';

import { useMemo, useState } from 'react';
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
  "This is a really really great product and I think you should definitely buy it!! Its amazing and we was so happy with the results, honestly its just awesome!!!";

const FORMAL_WORDS = ['therefore', 'furthermore', 'consequently', 'moreover', 'regarding', 'shall', 'whom', 'thus', 'hence', 'nonetheless'];
const INFORMAL_WORDS = ['gonna', 'wanna', 'kinda', 'yeah', 'stuff', 'awesome', 'cool', 'totally', 'literally', 'lol', 'hey', 'ok', 'okay'];

function analyzeTone(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const sentences = trimmed.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length || 1;
  const sentenceCount = sentences.length || 1;
  const avgSentenceLength = wordCount / sentenceCount;

  const exclamations = (trimmed.match(/!/g) || []).length;
  const questions = (trimmed.match(/\?/g) || []).length;
  const punctDensity = (exclamations + questions) / sentenceCount;

  const cleanWords = words.map(w => w.toLowerCase().replace(/[^a-z']/g, ''));
  const formalHits = cleanWords.filter(w => FORMAL_WORDS.includes(w)).length;
  const informalHits = cleanWords.filter(w => INFORMAL_WORDS.includes(w)).length;

  let label = 'Neutral';
  let detail = 'Balanced sentence length and punctuation, no strong formality signals.';

  if (exclamations >= 2 || punctDensity > 0.4) {
    label = 'Enthusiastic / Excited';
    detail = 'Frequent exclamation marks suggest an energetic, emphatic tone.';
  } else if (informalHits > formalHits && informalHits > 0) {
    label = 'Casual / Informal';
    detail = 'Contains casual word choices typical of conversational writing.';
  } else if (formalHits > informalHits && formalHits > 0) {
    label = 'Formal';
    detail = 'Contains transition words and phrasing typical of formal writing.';
  } else if (avgSentenceLength > 22) {
    label = 'Dense / Academic';
    detail = 'Long average sentence length suggests dense, complex writing.';
  } else if (questions >= 2) {
    label = 'Inquisitive';
    detail = 'Frequent questions suggest an exploratory or conversational tone.';
  }

  return { label, detail, avgSentenceLength: Math.round(avgSentenceLength * 10) / 10, exclamations, questions };
}

type Filter = 'All' | 'Grammar' | 'Spelling' | 'Style' | 'Punctuation';

export default function GrammarCheckerProClient() {
  const [text, setText] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState(false);
  const [filter, setFilter] = useState<Filter>('All');

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
      setFilter('All');
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
    setIssues(prev => prev.filter(i => i !== issue));
  };

  const resetResults = () => {
    setChecked(false);
    setIssues([]);
    setError('');
    setFilter('All');
  };

  const categoryOf = (issue: Issue): Filter => {
    const name = (issue.rule?.category?.name || '').toLowerCase();
    if (name.includes('typo') || name.includes('spell')) return 'Spelling';
    if (name.includes('punct')) return 'Punctuation';
    if (name.includes('style')) return 'Style';
    return 'Grammar';
  };

  const counts = useMemo(() => {
    const base: Record<Filter, number> = { All: issues.length, Grammar: 0, Spelling: 0, Style: 0, Punctuation: 0 };
    issues.forEach(issue => {
      base[categoryOf(issue)]++;
    });
    return base;
  }, [issues]);

  const filteredIssues = filter === 'All' ? issues : issues.filter(i => categoryOf(i) === filter);

  const tone = useMemo(() => analyzeTone(text), [text]);

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
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text here to check grammar, spelling, style, and tone..."
        className="tb-v2-tool-textarea"
        rows={6}
      />

      {tone && (
        <div className="tb-v2-section">
          <div className="tb-v2-section-title">Tone (lightweight heuristic, not AI)</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <span className="tb-v2-status tb-v2-status-info">{tone.label}</span>
            <span style={{ fontSize: 12.5, color: 'var(--fg-2)' }}>{tone.detail}</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 6 }}>
            Avg sentence length: {tone.avgSentenceLength} words &middot; Exclamations: {tone.exclamations} &middot; Questions: {tone.questions}
          </div>
        </div>
      )}

      <div className="tb-v2-toolbar">
        <button
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
          <div className="tb-v2-tool-output-body" style={{ borderBottom: '1px solid var(--line)' }}>
            <div className="tb-v2-stats-grid" style={{ padding: 0, border: 0, background: 'transparent' }}>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{counts.All}</span>
                <span className="tb-v2-stat-pill-lbl">Total issues</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{counts.Grammar}</span>
                <span className="tb-v2-stat-pill-lbl">Grammar</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{counts.Spelling}</span>
                <span className="tb-v2-stat-pill-lbl">Spelling</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{counts.Style}</span>
                <span className="tb-v2-stat-pill-lbl">Style</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{counts.Punctuation}</span>
                <span className="tb-v2-stat-pill-lbl">Punctuation</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '12px 20px', borderBottom: '1px solid var(--line)' }}>
            {(['All', 'Grammar', 'Spelling', 'Style', 'Punctuation'] as Filter[]).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`tb-v2-toggle-pill ${filter === f ? 'on' : ''}`}
              >
                {f} ({counts[f]})
              </button>
            ))}
          </div>

          <div className="tb-v2-tool-output-body">
            {filteredIssues.length === 0 ? (
              <div className="tb-v2-empty">
                {issues.length === 0 ? 'No issues found. Your text looks good.' : 'No issues in this category.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filteredIssues.map((issue, i) => (
                  <div
                    key={i}
                    style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: 12, background: 'var(--surface)' }}
                  >
                    <p style={{ fontSize: 13.5, color: 'var(--fg-0)', fontWeight: 600, margin: 0 }}>{issue.message}</p>
                    <p style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 4 }}>{categoryOf(issue)}</p>
                    {issue.replacements.length > 0 && (
                      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>Fix:</span>
                        {issue.replacements.slice(0, 3).map((r, j) => (
                          <button
                            key={j}
                            type="button"
                            onClick={() => applyFix(issue)}
                            className="tb-v2-copy-btn"
                          >
                            {r.value || '(remove)'}
                          </button>
                        ))}
                      </div>
                    )}
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
