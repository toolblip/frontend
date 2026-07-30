'use client';

import { useState, useMemo } from 'react';

interface CollocationRule {
  pattern: RegExp;
  wrong: string;
  correct: string;
  note: string;
}

const RULES: CollocationRule[] = [
  { pattern: /\bdo\s+a\s+mistake\b/gi, wrong: 'do a mistake', correct: 'make a mistake', note: 'Mistakes are "made", not "done".' },
  { pattern: /\bmake\s+(my|your|his|her|our|their)?\s*homework\b/gi, wrong: 'make homework', correct: 'do homework', note: 'Homework is "done".' },
  { pattern: /\bmake\s+a\s+photo\b/gi, wrong: 'make a photo', correct: 'take a photo', note: 'Photos are "taken".' },
  { pattern: /\bmake\s+a\s+shower\b/gi, wrong: 'make a shower', correct: 'take a shower', note: 'Showers are "taken".' },
  { pattern: /\bmake\s+sport\b/gi, wrong: 'make sport', correct: 'do sport / play sport', note: 'Sport is "done" or "played".' },
  { pattern: /\bdiscuss\s+about\b/gi, wrong: 'discuss about', correct: 'discuss', note: '"Discuss" already means "talk about"; no preposition needed.' },
  { pattern: /\bexplain\s+me\b/gi, wrong: 'explain me', correct: 'explain to me', note: '"Explain" needs "to" before an object.' },
  { pattern: /\bcongratulate\s+(?:him|her|them|me|us|\w+)\s+for\b/gi, wrong: 'congratulate ... for', correct: 'congratulate ... on', note: 'Use "congratulate on", not "for".' },
  { pattern: /\bmarried\s+with\b/gi, wrong: 'married with', correct: 'married to', note: 'Use "married to", not "with".' },
  { pattern: /\bdepends?\s+of\b/gi, wrong: 'depend of', correct: 'depend on', note: 'Use "depend on", not "of".' },
  { pattern: /\bdifferent\s+than\b/gi, wrong: 'different than', correct: 'different from', note: 'Use "different from" in formal writing.' },
  { pattern: /\binterested\s+for\b/gi, wrong: 'interested for', correct: 'interested in', note: 'Use "interested in", not "for".' },
  { pattern: /\bgood\s+in\b/gi, wrong: 'good in', correct: 'good at', note: 'Use "good at" for skills.' },
  { pattern: /\bafraid\s+from\b/gi, wrong: 'afraid from', correct: 'afraid of', note: 'Use "afraid of", not "from".' },
  { pattern: /\blisten\s+music\b/gi, wrong: 'listen music', correct: 'listen to music', note: '"Listen" needs "to" before an object.' },
  { pattern: /\blook\s+the\b/gi, wrong: 'look the', correct: 'look at the', note: '"Look" needs "at" before an object.' },
  { pattern: /\bwait\s+the\b/gi, wrong: 'wait the', correct: 'wait for the', note: '"Wait" needs "for" before an object.' },
  { pattern: /\barrived\s+to\b/gi, wrong: 'arrived to', correct: 'arrived at / arrived in', note: 'Use "arrive at" (a place) or "arrive in" (a city/country).' },
  { pattern: /\bsince\s+\d+\s+(years|months|days|weeks|minutes|hours)\b/gi, wrong: 'since [duration]', correct: 'for [duration]', note: 'Use "for" with a duration, "since" with a starting point.' },
  { pattern: /\ban\s+advices?\b/gi, wrong: 'an advice', correct: 'advice / a piece of advice', note: '"Advice" is uncountable; it has no plural or "a/an" form.' },
  { pattern: /\binformations\b/gi, wrong: 'informations', correct: 'information', note: '"Information" is uncountable and has no plural form.' },
  { pattern: /\bstrong\s+rain\b/gi, wrong: 'strong rain', correct: 'heavy rain', note: 'Rain is described as "heavy", not "strong".' },
  { pattern: /\bheavy\s+coffee\b/gi, wrong: 'heavy coffee', correct: 'strong coffee', note: 'Coffee is described as "strong", not "heavy".' },
  { pattern: /\bmake\s+a\s+question\b/gi, wrong: 'make a question', correct: 'ask a question', note: 'Questions are "asked".' },
  { pattern: /\bsay\s+me\b/gi, wrong: 'say me', correct: 'tell me', note: 'Use "tell me", not "say me".' },
];

interface Finding { rule: CollocationRule; count: number; sample: string; }

function analyze(text: string): Finding[] {
  const findings: Finding[] = [];
  for (const rule of RULES) {
    const matches = text.match(rule.pattern);
    if (matches && matches.length) {
      findings.push({ rule, count: matches.length, sample: matches[0] });
    }
  }
  return findings;
}

const EXAMPLE = "I did a mistake yesterday and I need to make my homework. She is married with a doctor and depends of her family. It's strong rain outside.";

export default function EnglishCollocationsCheckerClient() {
  const [input, setInput] = useState('');

  const findings = useMemo(() => analyze(input), [input]);

  const loadExample = () => setInput(EXAMPLE);

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to Check</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste a sentence or paragraph to check for common collocation errors..."
        rows={6}
        className="tb-v2-tool-textarea"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Collocation Issues</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {!input.trim() ? (
          <p className="tb-v2-empty">Enter text above to check for common word-pairing errors.</p>
        ) : findings.length === 0 ? (
          <div className="tb-v2-banner">No common collocation errors detected.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {findings.map((f, i) => (
              <div key={i} className="tb-v2-banner-err">
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13 }}>
                  "{f.sample}" ({f.count}x) &rarr; <strong>{f.rule.correct}</strong>
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 4 }}>{f.rule.note}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
