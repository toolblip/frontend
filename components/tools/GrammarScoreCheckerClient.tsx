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

  const severityColors: Record<Issue['severity'], string> = {
    error: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  };

  return (
    <div className="tb-v2-tool-card">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Rule-based grammar and readability checks. Not AI-powered grammar correction.
      </p>

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
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
        placeholder="Paste or type your text here..."
        className="tb-v2-input"
        rows={10}
      />

      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={analyze}
          className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
        >
          Check Text
        </button>
      </div>

      {!analyzed && !input && (
        <p className="tb-v2-empty">
          Paste text above, or load the example, to check sentence structure, spacing,
          repeated words, passive voice, filler-word overuse, and get a transparent
          0-100 quality score.
        </p>
      )}

      {analyzed && (
        <div className="tb-v2-tool-output-body">
          <div className="flex justify-between items-center mb-3">
            <span className="tb-v2-tool-label">Results</span>
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Words</div>
              <div className="text-lg font-semibold">{stats.words}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Sentences</div>
              <div className="text-lg font-semibold">{stats.sentences}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Avg words/sentence</div>
              <div className="text-lg font-semibold">{stats.avgSentenceLength}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Quality score</div>
              <div className="text-lg font-semibold">{stats.score}/100</div>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Issues Found: {issues.length}
          </div>

          {issues.length === 0 ? (
            <p className="text-green-700 dark:text-green-300 text-center py-4">
              No issues found by the rule-based checks above.
            </p>
          ) : (
            <div className="space-y-2">
              {issues.map((issue, index) => (
                <div key={index} className="tb-v2-result-card">
                  <div className="flex items-start gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium shrink-0 ${severityColors[issue.severity]}`}
                    >
                      {issue.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {issue.message}
                        {issue.sentenceIndex >= 0 && ` (sentence ${issue.sentenceIndex + 1})`}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono truncate">
                        "{issue.snippet}" at position {issue.index}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
