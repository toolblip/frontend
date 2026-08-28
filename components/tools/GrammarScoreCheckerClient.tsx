'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

interface Issue {
  type: string;
  message: string;
  snippet: string;
  index: number;
  sentenceIndex: number;
  severity: 'error' | 'warning' | 'info';
}

const FILLER_WORDS = ['very', 'really', 'just', 'actually', 'basically'];
const IRREGULAR_PAST_PARTICIPLES = [
  'done', 'gone', 'seen', 'given', 'taken', 'made', 'written', 'known', 'shown',
  'broken', 'chosen', 'spoken', 'driven', 'eaten', 'fallen', 'forgotten', 'held',
  'kept', 'left', 'lost', 'meant', 'paid', 'sent', 'sold', 'told', 'won', 'built',
  'bought', 'brought', 'caught', 'found', 'thought', 'taught', 'stolen', 'begun',
];

const EXAMPLE_TEXT = `This is a  example sentence with a  double space. the sentence above does not start with a capital letter. This sentence is missing its ending punctuation The mistake the mistake was repeated here too.Also there is no space after that period. It was written by the team and the report was finished quickly before the very very tight deadline, and honestly this sentence just keeps going and going with clause after clause until it is really quite hard to actually follow what is basically being said here.`;

function splitSentences(text: string): { text: string; start: number; end: number }[] {
  const sentences: { text: string; start: number; end: number }[] = [];
  const regex = /[^.!?]+[.!?]*/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const raw = match[0];
    if (!raw.trim()) continue;
    const start = match.index;
    const end = match.index + raw.length;
    sentences.push({ text: raw, start, end });
  }
  return sentences;
}

export default function GrammarScoreCheckerClient() {
  const [input, setInput] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState({
    words: 0,
    sentences: 0,
    avgSentenceLength: 0,
    score: 100,
  });
  const [copied, setCopied] = useState(false);

  const resetAnalysis = () => {
    setAnalyzed(false);
    setIssues([]);
  };

  const analyze = () => {
    const text = input;
    if (!text.trim()) {
      setIssues([]);
      setAnalyzed(false);
      return;
    }

    const foundIssues: Issue[] = [];
    const sentences = splitSentences(text);

    const wordMatches = text.match(/\b[A-Za-z']+\b/g) || [];
    const wordCount = wordMatches.length;
    const sentenceCount = sentences.length || 1;
    const avgSentenceLength = wordCount / sentenceCount;

    // Document-wide issues (position-based, not tied to a single sentence)

    // Double spaces
    const doubleSpaceRe = /  +/g;
    let m: RegExpExecArray | null;
    while ((m = doubleSpaceRe.exec(text)) !== null) {
      foundIssues.push({
        type: 'Double space',
        message: 'Extra space found between words',
        snippet: JSON.stringify(m[0]),
        index: m.index,
        sentenceIndex: -1,
        severity: 'warning',
      });
    }

    // Repeated consecutive words (case-insensitive), e.g. "the the"
    const repeatRe = /\b([A-Za-z']+)\s+\1\b/gi;
    while ((m = repeatRe.exec(text)) !== null) {
      foundIssues.push({
        type: 'Repeated word',
        message: `Word "${m[1]}" is repeated consecutively`,
        snippet: m[0],
        index: m.index,
        sentenceIndex: -1,
        severity: 'error',
      });
    }

    // Missing space after punctuation, e.g. "Hi.There"
    const missingSpaceRe = /[.,!?][A-Za-z]/g;
    while ((m = missingSpaceRe.exec(text)) !== null) {
      foundIssues.push({
        type: 'Missing space after punctuation',
        message: 'No space after punctuation mark',
        snippet: m[0],
        index: m.index,
        sentenceIndex: -1,
        severity: 'warning',
      });
    }

    // Filler word overuse (document-wide count)
    const fillerCounts: Record<string, { count: number; firstIndex: number }> = {};
    FILLER_WORDS.forEach((word) => {
      const re = new RegExp(`\\b${word}\\b`, 'gi');
      let count = 0;
      let firstIndex = -1;
      let fm: RegExpExecArray | null;
      while ((fm = re.exec(text)) !== null) {
        count++;
        if (firstIndex === -1) firstIndex = fm.index;
      }
      if (count > 0) fillerCounts[word] = { count, firstIndex };
    });
    Object.entries(fillerCounts).forEach(([word, { count, firstIndex }]) => {
      if (count > 3) {
        foundIssues.push({
          type: 'Filler word overuse',
          message: `"${word}" appears ${count} times — consider trimming filler words`,
          snippet: word,
          index: firstIndex,
          sentenceIndex: -1,
          severity: 'info',
        });
      }
    });

    // Sentence-level checks
    sentences.forEach((sentence, sIndex) => {
      const trimmed = sentence.text.trim();
      if (!trimmed) return;
      const leadingOffset = sentence.text.indexOf(trimmed);
      const trimmedStart = sentence.start + leadingOffset;

      // Sentence not starting with a capital letter
      const firstChar = trimmed.charAt(0);
      if (/[a-zA-Z]/.test(firstChar) && firstChar !== firstChar.toUpperCase()) {
        foundIssues.push({
          type: 'Lowercase start',
          message: 'Sentence does not start with a capital letter',
          snippet: trimmed.slice(0, 30) + (trimmed.length > 30 ? '…' : ''),
          index: trimmedStart,
          sentenceIndex: sIndex,
          severity: 'warning',
        });
      }

      // No ending punctuation
      if (!/[.!?]\s*$/.test(trimmed)) {
        foundIssues.push({
          type: 'Missing end punctuation',
          message: 'Sentence has no ending punctuation (. ! or ?)',
          snippet: trimmed.slice(-30),
          index: trimmedStart,
          sentenceIndex: sIndex,
          severity: 'warning',
        });
      }

      // Very long sentence
      const sentenceWords = trimmed.match(/\b[A-Za-z']+\b/g) || [];
      if (sentenceWords.length > 35) {
        foundIssues.push({
          type: 'Long sentence',
          message: `Sentence has ${sentenceWords.length} words — consider splitting this sentence`,
          snippet: trimmed.slice(0, 40) + '…',
          index: trimmedStart,
          sentenceIndex: sIndex,
          severity: 'info',
        });
      }

      // Passive voice heuristic
      const passiveRe = new RegExp(
        `\\b(was|were|is|are|been|being)\\s+(\\w+ed|${IRREGULAR_PAST_PARTICIPLES.join('|')})\\b`,
        'gi'
      );
      let pm: RegExpExecArray | null;
      while ((pm = passiveRe.exec(trimmed)) !== null) {
        foundIssues.push({
          type: 'Possible passive voice',
          message: `"${pm[0]}" may indicate passive voice`,
          snippet: pm[0],
          index: trimmedStart + pm.index,
          sentenceIndex: sIndex,
          severity: 'info',
        });
      }
    });

    // Sort by position for a readable, sentence-ordered list
    foundIssues.sort((a, b) => a.index - b.index);

    // Quality score: start at 100 and subtract a penalty proportional to
    // issue density (issues per word), scaled so ~1 issue per 5 words
    // drops the score by roughly 20 points. This is a simple, transparent
    // heuristic, not a statistically validated readability model.
    const density = wordCount > 0 ? foundIssues.length / wordCount : 0;
    const score = Math.max(0, Math.min(100, Math.round(100 - density * 100)));

    setStats({
      words: wordCount,
      sentences: sentences.length,
      avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
      score,
    });
    setIssues(foundIssues);
    setAnalyzed(true);
  };

  const copy = () => {
    const text = issues
      .map((i) => `[${i.type}] ${i.message} — "${i.snippet}"`)
      .join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const severityStatus: Record<Issue['severity'], string> = {
    error: 'tb-v2-status-err',
    warning: 'tb-v2-status-warn',
    info: 'tb-v2-status-info',
  };

  const formatSnippet = (issue: Issue) => {
    if (issue.type === 'Double space') return 'two consecutive spaces';
    return issue.snippet;
  };

  return (
    <div className="tb-v2-tool-card">
      <div
        className="tb-v2-banner tb-v2-banner-info"
        style={{ borderRadius: 0, borderLeft: 0, borderRight: 0, borderTop: 0 }}
      >
        Rule-based grammar and readability checks. Not AI-powered grammar correction.
      </div>

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter your text</span>
        <ToolExampleClearActions
          onExample={() => {
            setInput(EXAMPLE_TEXT);
            resetAnalysis();
          }}
          onClear={() => {
            setInput('');
            resetAnalysis();
          }}
          canClear={input.length > 0 || analyzed}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          resetAnalysis();
        }}
        placeholder="Paste or type your text to check structure, spacing, repetition, passive voice, and filler words..."
        className="tb-v2-tool-textarea"
        rows={6}
      />

      <div className="tb-v2-toolbar">
        <button type="button" onClick={analyze} className="tb-v2-btn tb-v2-btn-primary">
          Check Text
        </button>
      </div>

      {!analyzed && !input && (
        <div className="tb-v2-tool-output-body">
          <div className="tb-v2-empty">
            Paste text above, or load the example, to get a transparent 0–100 quality score and
            rule-based issue list.
          </div>
        </div>
      )}

      {analyzed && (
        <>
          <div className="tb-v2-stats-grid">
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{stats.words}</span>
              <span className="tb-v2-stat-pill-lbl">Words</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{stats.sentences}</span>
              <span className="tb-v2-stat-pill-lbl">Sentences</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{stats.avgSentenceLength}</span>
              <span className="tb-v2-stat-pill-lbl">Avg / sentence</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{stats.score}</span>
              <span className="tb-v2-stat-pill-lbl">Quality / 100</span>
            </div>
          </div>

          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">
              Issues{issues.length > 0 ? ` (${issues.length})` : ''}
            </span>
            {issues.length > 0 && (
              <button
                type="button"
                onClick={copy}
                className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
              >
                {copied ? 'Copied' : 'Copy All'}
              </button>
            )}
          </div>

          <div className="tb-v2-tool-output-body">
            {issues.length === 0 ? (
              <div className="tb-v2-empty">
                <span className="tb-v2-status tb-v2-status-ok">No issues found</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {issues.map((issue, index) => (
                  <div
                    key={index}
                    style={{
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius-sm)',
                      padding: 12,
                      background: 'var(--surface)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span className={`tb-v2-status ${severityStatus[issue.severity]}`}>
                        {issue.type}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13.5, color: 'var(--fg-0)', fontWeight: 600, margin: 0 }}>
                          {issue.message}
                          {issue.sentenceIndex >= 0 && ` (sentence ${issue.sentenceIndex + 1})`}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: 'var(--fg-3)',
                            marginTop: 6,
                            fontFamily: 'var(--f-mono)',
                            wordBreak: 'break-word',
                          }}
                        >
                          &ldquo;{formatSnippet(issue)}&rdquo; at position {issue.index}
                        </p>
                      </div>
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
