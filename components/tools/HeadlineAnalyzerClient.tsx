'use client';

import { useMemo, useState } from 'react';

// Curated marketing "power words" — terms studies on headline copywriting
// consistently flag as boosting click-through (urgency, exclusivity, ease).
const POWER_WORDS = [
  'free', 'proven', 'secret', 'secrets', 'ultimate', 'instantly', 'guaranteed',
  'guarantee', 'exclusive', 'easy', 'powerful', 'essential', 'effortless',
  'discover', 'unlock', 'boost', 'transform', 'transformative', 'revolutionary',
  'breakthrough', 'hack', 'hacks', 'trick', 'tricks', 'insider', 'bonus',
  'limited', 'urgent', 'save', 'win', 'winning', 'best', 'top', 'new', 'now',
  'today', 'quick', 'fast', 'simple', 'results',
];

// Curated "emotional words" — terms that signal strong sentiment/curiosity,
// a well-known driver of shares and clicks in headline copywriting guides.
const EMOTIONAL_WORDS = [
  'amazing', 'shocking', 'heartbreaking', 'incredible', 'terrifying',
  'devastating', 'inspiring', 'stunning', 'outrageous', 'unbelievable',
  'hilarious', 'adorable', 'tragic', 'thrilling', 'jaw-dropping',
  'mind-blowing', 'gut-wrenching', 'heartwarming', 'alarming', 'disturbing',
  'uplifting', 'exhilarating', 'horrifying', 'astonishing', 'remarkable',
  'unforgettable', 'breathtaking', 'controversial', 'scandalous', 'explosive',
  'dramatic', 'emotional', 'moving', 'touching', 'joyful', 'furious',
  'painful', 'epic', 'insane', 'crazy',
];

// Common stopwords excluded when computing SEO keyword density so the
// "top keyword" reflects a meaningful term rather than "the"/"and"/etc.
const STOPWORDS = new Set([
  'the', 'a', 'an', 'of', 'to', 'in', 'on', 'at', 'for', 'and', 'or', 'is',
  'are', 'how', 'why', 'what', 'your', 'you', 'this', 'that', 'with', 'from',
  'by', 'it', 'as', 'be', 'will', 'can', 'do', 'does', 'my', 'i', 'we',
]);

function cleanToken(token: string): string {
  return token.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, '');
}

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  const groups = w.match(/[aeiouy]+/g);
  let count = groups ? groups.length : 0;
  if (w.endsWith('e') && count > 1) count -= 1;
  return Math.max(count, 1);
}

const EXAMPLE_HEADLINE = '10 Proven Secrets to Instantly Boost Your Productivity Today';

function analyze(text: string) {
  const trimmed = text.trim();
  const rawWords = trimmed.length ? trimmed.split(/\s+/) : [];
  const wordCount = rawWords.length;
  const charCount = text.length;
  const cleanedWords = rawWords.map(cleanToken).filter(Boolean);

  const powerMatches = cleanedWords.filter(w => POWER_WORDS.includes(w));
  const emotionalMatches = cleanedWords.filter(w => EMOTIONAL_WORDS.includes(w));

  const hasNumber = /\d/.test(trimmed);
  const startsWithNumber = /^\d/.test(trimmed);

  const isHowTo = /^how\s+to\b/i.test(trimmed);
  const isQuestion =
    trimmed.endsWith('?') ||
    (!isHowTo && /^(who|what|when|where|why|which|is|are|can|will|should|do|does)\b/i.test(trimmed));

  // Reading ease: simplified Flesch Reading Ease formula fed by a
  // vowel-group syllable-counting heuristic (not a dictionary lookup).
  const sentenceCount = Math.max(trimmed.split(/[.!?]+/).map(s => s.trim()).filter(Boolean).length, trimmed ? 1 : 0);
  const totalSyllables = cleanedWords.reduce((sum, w) => sum + countSyllables(w), 0);
  const fleschRaw =
    wordCount > 0 && sentenceCount > 0
      ? 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (totalSyllables / wordCount)
      : 0;
  const readingEase = Math.max(0, Math.min(100, Math.round(fleschRaw)));
  const readingLabel = readingEase >= 70 ? 'Easy' : readingEase >= 50 ? 'Medium' : wordCount > 0 ? 'Difficult' : 'N/A';

  // SEO keyword density: most frequent non-stopword term and its share of
  // total words (display-only metric, not folded into the score below).
  const freq = new Map<string, number>();
  cleanedWords.forEach(w => {
    if (w.length > 2 && !STOPWORDS.has(w)) freq.set(w, (freq.get(w) || 0) + 1);
  });
  let topKeyword = '';
  let topKeywordCount = 0;
  freq.forEach((count, word) => {
    if (count > topKeywordCount) {
      topKeyword = word;
      topKeywordCount = count;
    }
  });
  const keywordDensity = wordCount > 0 && topKeywordCount > 0 ? Math.round((topKeywordCount / wordCount) * 1000) / 10 : 0;

  // --- Overall score (0-100): a transparent weighted blend of the signals
  // above. Weights are a simple, defensible split of "what copywriting
  // guides commonly cite" — not a claim of AI/ML scoring:
  //   30% ideal length (6-12 words is the commonly-cited headline sweet spot)
  //   25% power/emotional word usage (capped once a couple are present)
  //   15% contains a number (numbered/listicle headlines read as concrete)
  //   10% question or "how to" framing (creates a curiosity/utility hook)
  //   20% reading ease (simpler headlines scan faster)
  let lengthScore = 100;
  if (wordCount === 0) {
    lengthScore = 0;
  } else if (wordCount < 6) {
    lengthScore = Math.max(0, 100 - (6 - wordCount) * 15);
  } else if (wordCount > 12) {
    lengthScore = Math.max(0, 100 - (wordCount - 12) * 10);
  }

  const wordAppealScore = Math.min((powerMatches.length + emotionalMatches.length) * 25, 100);
  const numberScore = hasNumber ? 100 : 0;
  const formatScore = isQuestion || isHowTo ? 100 : 40;
  const readingScore = readingEase;

  const overallScore =
    wordCount === 0
      ? 0
      : Math.round(
          0.3 * lengthScore +
            0.25 * wordAppealScore +
            0.15 * numberScore +
            0.1 * formatScore +
            0.2 * readingScore
        );

  return {
    wordCount,
    charCount,
    powerMatches,
    emotionalMatches,
    hasNumber,
    startsWithNumber,
    isQuestion,
    isHowTo,
    readingEase,
    readingLabel,
    topKeyword,
    topKeywordCount,
    keywordDensity,
    overallScore,
    lengthScore: Math.round(lengthScore),
  };
}

export default function HeadlineAnalyzerClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => analyze(input), [input]);
  const hasInput = input.trim().length > 0;

  const loadExample = () => {
    setInput(EXAMPLE_HEADLINE);
    setCopied(false);
  };

  const summary = hasInput
    ? [
        `Headline: ${input.trim()}`,
        `Overall score: ${result.overallScore}/100`,
        `Words: ${result.wordCount} | Characters: ${result.charCount}`,
        `Power words (${result.powerMatches.length}): ${result.powerMatches.join(', ') || 'none'}`,
        `Emotional words (${result.emotionalMatches.length}): ${result.emotionalMatches.join(', ') || 'none'}`,
        `Contains number: ${result.hasNumber ? 'yes' : 'no'} | Starts with number: ${result.startsWithNumber ? 'yes' : 'no'}`,
        `Is question: ${result.isQuestion ? 'yes' : 'no'} | Is "how to": ${result.isHowTo ? 'yes' : 'no'}`,
        `Reading ease: ${result.readingEase}/100 (${result.readingLabel})`,
        `Top keyword: ${result.topKeyword ? `"${result.topKeyword}" (${result.topKeywordCount}x, ${result.keywordDensity}% density)` : 'none'}`,
      ].join('\n')
    : '';

  const copySummary = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Headline</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        className="tb-v2-tool-textarea"
        placeholder="Type or paste a headline to analyze..."
        rows={3}
      />

      {hasInput && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Analysis</span>
            <button type="button" onClick={copySummary} className="tb-v2-copy-btn">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 40, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>
                {result.overallScore}
              </span>
              <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>/ 100 overall score</span>
            </div>

            <div className="tb-v2-stats-grid" style={{ padding: 0, border: 0, background: 'transparent', marginBottom: 16 }}>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.wordCount}</span>
                <span className="tb-v2-stat-pill-lbl">Words</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.charCount}</span>
                <span className="tb-v2-stat-pill-lbl">Characters</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.powerMatches.length}</span>
                <span className="tb-v2-stat-pill-lbl">Power words</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.emotionalMatches.length}</span>
                <span className="tb-v2-stat-pill-lbl">Emotional words</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.readingEase}</span>
                <span className="tb-v2-stat-pill-lbl">Reading ease</span>
              </div>
            </div>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5, listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 6 }}>
                <span>Length ({result.wordCount} words, ideal 6-12)</span>
                <strong>{result.lengthScore}/100</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 6 }}>
                <span>Power words found</span>
                <strong>{result.powerMatches.length ? result.powerMatches.join(', ') : 'None'}</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 6 }}>
                <span>Emotional words found</span>
                <strong>{result.emotionalMatches.length ? result.emotionalMatches.join(', ') : 'None'}</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 6 }}>
                <span>Contains a number</span>
                <strong>{result.hasNumber ? 'Yes' : 'No'}</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 6 }}>
                <span>Starts with a number</span>
                <strong>{result.startsWithNumber ? 'Yes' : 'No'}</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 6 }}>
                <span>Phrased as a question</span>
                <strong>{result.isQuestion ? 'Yes' : 'No'}</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 6 }}>
                <span>"How to" headline</span>
                <strong>{result.isHowTo ? 'Yes' : 'No'}</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 6 }}>
                <span>Reading ease (Flesch-style)</span>
                <strong>{result.readingEase}/100 &middot; {result.readingLabel}</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Top SEO keyword</span>
                <strong>{result.topKeyword ? `"${result.topKeyword}" (${result.topKeywordCount}x, ${result.keywordDensity}%)` : 'None'}</strong>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
