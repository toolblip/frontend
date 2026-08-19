'use client';

import { useState, useMemo } from 'react';

const POS_STRONG = [
  'excellent', 'amazing', 'outstanding', 'wonderful', 'fantastic', 'superb', 'brilliant', 'perfect',
  'incredible', 'awesome', 'phenomenal', 'exceptional', 'magnificent', 'marvelous', 'terrific',
  'spectacular', 'flawless', 'exquisite', 'sensational', 'stellar', 'glorious', 'splendid',
  'delightful', 'ecstatic', 'thrilled', 'love', 'loved', 'adore', 'adored', 'best', 'greatest',
  'favorite', 'masterpiece', 'triumph', 'breathtaking', 'impeccable', 'unbeatable', 'unmatched',
  'extraordinary', 'joyful', 'euphoric', 'blissful', 'miracle', 'genius', 'triumphant', 'victorious',
  'heavenly', 'legendary', 'remarkable', 'inspiring',
];

const POS_MODERATE = [
  'good', 'great', 'nice', 'happy', 'pleased', 'glad', 'satisfied', 'positive', 'beneficial',
  'helpful', 'valuable', 'impressive', 'enjoyable', 'pleasant', 'comfortable', 'encouraging',
  'promising', 'effective', 'efficient', 'reliable', 'solid', 'strong', 'successful', 'winning',
  'improved', 'improving', 'better', 'superior', 'worthy', 'admirable', 'charming', 'graceful',
  'generous', 'kind', 'friendly', 'warm', 'supportive', 'motivating', 'refreshing', 'smooth',
  'elegant', 'robust', 'innovative', 'creative', 'talented', 'skilled', 'capable', 'confident',
  'brave', 'wise', 'fair', 'honest', 'genuine', 'authentic', 'grateful', 'thankful', 'proud',
  'optimistic', 'cheerful', 'lively', 'vibrant', 'energetic', 'passionate', 'dedicated', 'committed',
  'trustworthy', 'dependable', 'polished', 'professional', 'classy', 'stylish', 'gorgeous',
  'beautiful', 'lovely', 'attractive', 'appealing', 'tasty', 'delicious', 'yummy', 'fresh',
  'healthy', 'productive', 'fun', 'exciting', 'thrilling', 'memorable', 'accurate', 'affordable',
  'rewarding', 'flexible', 'welcoming',
];

const POS_MILD = [
  'okay', 'fine', 'decent', 'adequate', 'acceptable', 'sufficient', 'useful', 'interesting',
  'calm', 'relaxed', 'hopeful', 'curious', 'willing', 'open', 'gentle', 'mild', 'soft', 'simple',
  'easy', 'convenient', 'handy', 'neat', 'tidy', 'cool', 'new', 'modern', 'stable', 'steady',
  'quiet', 'peaceful', 'clear', 'bright', 'clean', 'affordable', 'reasonable', 'functional',
  'practical', 'suitable', 'fitting', 'balanced', 'smart', 'fast', 'quick', 'safe',
];

const NEG_STRONG = [
  'terrible', 'awful', 'horrible', 'atrocious', 'dreadful', 'appalling', 'abysmal', 'disgusting',
  'repulsive', 'vile', 'hideous', 'catastrophic', 'disastrous', 'horrific', 'nightmarish',
  'despicable', 'loathsome', 'detestable', 'hate', 'hated', 'hatred', 'worst', 'worthless',
  'useless', 'garbage', 'trash', 'pathetic', 'miserable', 'unbearable', 'excruciating',
  'devastating', 'tragic', 'horrendous', 'monstrous', 'evil', 'cruel', 'brutal', 'savage',
  'toxic', 'corrupt', 'fraudulent', 'scandalous', 'outrageous', 'disgraceful', 'shameful',
  'humiliating', 'heartbreaking', 'disastrously', 'vicious', 'abhorrent',
];

const NEG_MODERATE = [
  'bad', 'poor', 'disappointing', 'disappointed', 'sad', 'angry', 'upset', 'annoyed', 'frustrated',
  'frustrating', 'irritating', 'unpleasant', 'uncomfortable', 'negative', 'harmful', 'damaging',
  'broken', 'faulty', 'defective', 'flawed', 'weak', 'inferior', 'mediocre', 'subpar', 'unreliable',
  'inconsistent', 'unstable', 'messy', 'sloppy', 'careless', 'rude', 'hostile', 'aggressive',
  'arrogant', 'selfish', 'dishonest', 'deceptive', 'misleading', 'unfair', 'biased', 'boring',
  'dull', 'bland', 'stale', 'awkward', 'clumsy', 'confusing', 'complicated', 'difficult', 'hard',
  'slow', 'costly', 'expensive', 'wasteful', 'risky', 'dangerous', 'unsafe', 'insecure',
  'unhealthy', 'dirty', 'ugly', 'gross', 'stupid', 'foolish', 'lazy', 'incompetent',
  'unprofessional', 'embarrassing', 'regrettable', 'unfortunate', 'depressing', 'gloomy',
  'hopeless', 'helpless', 'crude', 'harsh',
];

const NEG_MILD = [
  'meh', 'lacking', 'limited', 'insufficient', 'questionable', 'dubious', 'uncertain', 'unclear',
  'vague', 'odd', 'strange', 'weird', 'off', 'stiff', 'tense', 'nervous', 'anxious', 'worried',
  'tired', 'exhausted', 'overwhelmed', 'cluttered', 'crowded', 'noisy', 'cramped', 'outdated',
  'obsolete', 'glitchy', 'buggy', 'laggy', 'clunky', 'shaky',
];

const LEXICON: Record<string, number> = {};
POS_STRONG.forEach(w => (LEXICON[w] = 3));
POS_MODERATE.forEach(w => (LEXICON[w] = 2));
POS_MILD.forEach(w => (LEXICON[w] = 1));
NEG_STRONG.forEach(w => (LEXICON[w] = -3));
NEG_MODERATE.forEach(w => (LEXICON[w] = -2));
NEG_MILD.forEach(w => (LEXICON[w] = -1));

const NEGATORS = new Set(['not', 'never', 'no', 'nor', 'cannot', "can't", "won't", "isn't", "aren't", "wasn't", "weren't", "doesn't", "don't", "didn't", "hasn't", "haven't", "hadn't", "shouldn't", "wouldn't", "couldn't"]);

interface Match {
  word: string;
  weight: number;
  negated: boolean;
}

function analyze(text: string) {
  const tokens = text
    .split(/\s+/)
    .map(t => t.trim())
    .filter(Boolean);

  const matches: Match[] = [];
  let negationWindow = 0;
  let totalScore = 0;

  for (const token of tokens) {
    const cleaned = token.toLowerCase().replace(/[^a-z']/g, '');
    const isNegator = NEGATORS.has(cleaned) || cleaned.endsWith("n't");

    if (isNegator) {
      negationWindow = 2;
      continue;
    }

    const lookupWord = cleaned.replace(/'/g, '');
    if (Object.prototype.hasOwnProperty.call(LEXICON, lookupWord)) {
      const baseWeight = LEXICON[lookupWord];
      const negated = negationWindow > 0;
      const weight = negated ? -baseWeight : baseWeight;
      matches.push({ word: lookupWord, weight, negated });
      totalScore += weight;
    }

    if (negationWindow > 0) negationWindow--;
  }

  const wordCount = tokens.length || 1;
  const normalized = totalScore / wordCount;

  let label: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (normalized > 0.04) label = 'positive';
  else if (normalized < -0.04) label = 'negative';

  return { matches, totalScore, normalized, wordCount: tokens.length, label };
}

export default function SentimentAnalyzerClient() {
  const [input, setInput] = useState('');

  const result = useMemo(() => analyze(input), [input]);

  const loadExample = () => {
    setInput("This product is absolutely amazing and the support team was incredibly helpful. However, the shipping was slow and the packaging was not great at all.");
  };

  const positiveMatches = result.matches.filter(m => m.weight > 0);
  const negativeMatches = result.matches.filter(m => m.weight < 0);

  const labelColor = result.label === 'positive' ? '#16a34a' : result.label === 'negative' ? '#dc2626' : 'var(--fg-2)';

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        className="tb-v2-tool-textarea"
        placeholder="Paste a review, comment, or any text to analyze its sentiment..."
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={6}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: labelColor, textTransform: 'capitalize' }}>
          {input.trim() ? result.label : '—'}
        </span>
      </div>
      <div className="tb-v2-tool-output-body">
        {!input.trim() ? (
          <p className="tb-v2-empty">Enter text to analyze its sentiment.</p>
        ) : (
          <>
            <div className="tb-v2-stats-grid">
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.totalScore > 0 ? '+' : ''}{result.totalScore}</span>
                <span className="tb-v2-stat-pill-lbl">Total Score</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.normalized.toFixed(3)}</span>
                <span className="tb-v2-stat-pill-lbl">Normalized</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{positiveMatches.length}</span>
                <span className="tb-v2-stat-pill-lbl">Positive Words</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{negativeMatches.length}</span>
                <span className="tb-v2-stat-pill-lbl">Negative Words</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.wordCount}</span>
                <span className="tb-v2-stat-pill-lbl">Total Words</span>
              </div>
            </div>

            <div className="tb-v2-grid-2" style={{ marginTop: 16 }}>
              <div>
                <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 8 }}>Positive Words Found</span>
                {positiveMatches.length === 0 ? (
                  <p style={{ fontSize: 13, color: 'var(--fg-3)' }}>None found.</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {positiveMatches.map((m, i) => (
                      <span key={i} style={{ fontSize: 12, background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: 6 }}>
                        {m.word} ({m.weight > 0 ? '+' : ''}{m.weight}){m.negated ? ' [negated]' : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 8 }}>Negative Words Found</span>
                {negativeMatches.length === 0 ? (
                  <p style={{ fontSize: 13, color: 'var(--fg-3)' }}>None found.</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {negativeMatches.map((m, i) => (
                      <span key={i} style={{ fontSize: 12, background: '#fee2e2', color: '#991b1b', padding: '3px 8px', borderRadius: 6 }}>
                        {m.word} ({m.weight}){m.negated ? ' [negated]' : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="tb-v2-section">
        <p style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.5 }}>
          <strong>How this works:</strong> This tool uses a lexicon-based approach — it scans your text for ~250 common
          positive and negative words with preset weights, applies basic negation handling (e.g. &quot;not good&quot; flips the
          score), and sums the result. It is not an AI model and won&apos;t catch sarcasm, context, or uncommon phrasing.
        </p>
      </div>
    </div>
  );
}
