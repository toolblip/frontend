'use client';

import { useState } from 'react';

const JARGON: Record<string, string> = {
  utilize: 'use',
  utilizes: 'uses',
  utilized: 'used',
  facilitate: 'help',
  facilitates: 'helps',
  approximately: 'about',
  subsequently: 'later',
  commence: 'start',
  commenced: 'started',
  terminate: 'end',
  terminated: 'ended',
  endeavor: 'try',
  ascertain: 'find out',
  sufficient: 'enough',
  additional: 'more',
  obtain: 'get',
  obtained: 'got',
  purchase: 'buy',
  purchased: 'bought',
  require: 'need',
  requires: 'needs',
  required: 'needed',
  demonstrate: 'show',
  demonstrates: 'shows',
  initial: 'first',
  numerous: 'many',
  assist: 'help',
  assists: 'helps',
  indicate: 'show',
  indicates: 'shows',
  component: 'part',
  methodology: 'method',
  optimal: 'best',
  leverage: 'use',
  leveraging: 'using',
  implement: 'carry out',
  implemented: 'carried out',
  considerable: 'large',
  regarding: 'about',
  pertaining: 'about',
  prior: 'before',
  cognizant: 'aware',
  aforementioned: 'mentioned',
};

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  const groups = w.match(/[aeiouy]+/g);
  let count = groups ? groups.length : 1;
  if (w.endsWith('e') && !w.endsWith('le') && count > 1) count -= 1;
  return Math.max(1, count);
}

interface Analysis {
  wordCount: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  complexWords: string[];
  simplified: string;
  replacements: { from: string; to: string }[];
}

function analyze(text: string): Analysis {
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const words = text.match(/[A-Za-z']+/g) || [];
  const wordCount = words.length;
  const sentenceCount = Math.max(1, sentences.length);
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);

  const fleschReadingEase = wordCount > 0
    ? 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (totalSyllables / wordCount)
    : 0;
  const fleschKincaidGrade = wordCount > 0
    ? 0.39 * (wordCount / sentenceCount) + 11.8 * (totalSyllables / wordCount) - 15.59
    : 0;

  const complexWords = Array.from(new Set(
    words.filter(w => countSyllables(w) >= 4).map(w => w.toLowerCase())
  ));

  const replacements: { from: string; to: string }[] = [];
  const simplified = text.replace(/[A-Za-z']+/g, (match) => {
    const lower = match.toLowerCase();
    const simple = JARGON[lower];
    if (!simple) return match;
    replacements.push({ from: match, to: simple });
    if (match[0] === match[0].toUpperCase()) {
      return simple[0].toUpperCase() + simple.slice(1);
    }
    return simple;
  });

  return {
    wordCount,
    sentenceCount,
    avgWordsPerSentence: wordCount / sentenceCount,
    fleschReadingEase,
    fleschKincaidGrade,
    complexWords,
    simplified,
    replacements,
  };
}

function gradeLabel(grade: number): string {
  if (grade <= 5) return 'Elementary school';
  if (grade <= 8) return 'Middle school';
  if (grade <= 12) return 'High school';
  if (grade <= 16) return 'College';
  return 'Graduate level';
}

const EXAMPLE = 'Prior to implementation, it is imperative that the organization ascertain whether the proposed methodology will facilitate the requisite outcomes. Subsequently, additional resources may be required to obtain optimal results.';

export default function ExplainLikeFiveClient() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Analysis | null>(null);
  const [copied, setCopied] = useState(false);

  const runAnalysis = () => {
    if (!input.trim()) { setResult(null); return; }
    setResult(analyze(input));
    setCopied(false);
  };

  const loadExample = () => {
    setInput(EXAMPLE);
    setResult(null);
  };

  const copySimplified = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.simplified);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-banner" style={{ margin: 20 }}>
        Writing a genuine "explain like I'm five" rewrite needs an AI language model, which isn't available here.
        Instead, this tool gives you real readability scores and swaps common jargon words for plainer ones, so you
        can see exactly what's making your text hard to read.
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <textarea
          className="tb-v2-tool-textarea"
          rows={6}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste a paragraph to analyze..."
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="button" onClick={runAnalysis} className="tb-v2-btn tb-v2-btn-primary" disabled={!input.trim()}>
            Analyze
          </button>
          <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
        </div>
      </div>

      {result && (
        <div style={{ padding: '0 20px 20px' }}>
          <div className="tb-v2-stats-grid" style={{ marginBottom: 16 }}>
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Flesch Reading Ease</div>
              <div>{result.fleschReadingEase.toFixed(1)}</div>
            </div>
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Grade Level</div>
              <div>{Math.max(0, result.fleschKincaidGrade).toFixed(1)} ({gradeLabel(result.fleschKincaidGrade)})</div>
            </div>
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Avg Words / Sentence</div>
              <div>{result.avgWordsPerSentence.toFixed(1)}</div>
            </div>
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Complex Words</div>
              <div>{result.complexWords.length}</div>
            </div>
          </div>

          {result.complexWords.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <span className="tb-v2-tool-label">Complex Words (4+ syllables)</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {result.complexWords.map((w, i) => <span key={i} className="tb-v2-chip">{w}</span>)}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="tb-v2-tool-label">Simplified Draft (word substitutions only)</span>
            <button type="button" onClick={copySimplified} className="tb-v2-btn-sm">{copied ? 'Copied' : 'Copy'}</button>
          </div>
          <div className="tb-v2-tool-pre">{result.simplified}</div>
          {result.replacements.length === 0 && (
            <p style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 6 }}>No jargon words from our built-in list were found to replace.</p>
          )}
        </div>
      )}

      {!result && <p className="tb-v2-empty" style={{ margin: '0 20px 20px' }}>Enter some text and click Analyze to see readability scores.</p>}
    </div>
  );
}
