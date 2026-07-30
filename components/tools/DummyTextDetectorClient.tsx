'use client';

import { useState, useMemo } from 'react';

const EXAMPLE = `Welcome to Our Company

We provide top-quality consulting services to businesses of all sizes.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Contact us today to learn more about our pricing and packages.

[Your text here] - replace this paragraph with a real testimonial before publishing.

TODO: add the team bio section once photos are ready.`;

const LOREM_PHRASES = [
  'lorem ipsum dolor sit amet',
  'consectetur adipiscing elit',
  'sed do eiusmod tempor incididunt',
  'ut labore et dolore magna aliqua',
  'ut enim ad minim veniam',
  'quis nostrud exercitation ullamco laboris nisi',
  'aliquip ex ea commodo consequat',
  'duis aute irure dolor in reprehenderit',
  'voluptate velit esse cillum dolore',
  'excepteur sint occaecat cupidatat non proident',
  'sunt in culpa qui officia deserunt mollit anim id est laborum',
];

const PLACEHOLDER_PATTERNS: { label: string; pattern: RegExp }[] = [
  { label: 'Bracket placeholder', pattern: /\[[^\]]{2,60}\]/ },
  { label: 'Mustache placeholder', pattern: /\{\{[^}]{1,60}\}\}/ },
  { label: 'TODO marker', pattern: /\b(todo|fixme|tbd|wip)\b:?/i },
  { label: '"your text here" placeholder', pattern: /\byour (text|name|company|content|logo|image) (here|goes here)\b/i },
  { label: '"insert ... here" placeholder', pattern: /\binsert [a-z ]{0,30}here\b/i },
  { label: '"click here to edit" placeholder', pattern: /\bclick here to (edit|change|replace)\b/i },
  { label: 'Sample/placeholder text marker', pattern: /\b(sample text|placeholder text|dummy text)\b/i },
  { label: '"coming soon" placeholder', pattern: /\b(coming soon|under construction)\b/i },
];

interface ParagraphResult {
  text: string;
  flagged: boolean;
  reasons: string[];
}

function analyzeText(text: string): ParagraphResult[] {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(paragraph => {
      const lower = paragraph.toLowerCase();
      const reasons: string[] = [];

      const loremHits = LOREM_PHRASES.filter(phrase => lower.includes(phrase)).length;
      if (loremHits > 0) reasons.push(`Matches classic Lorem Ipsum text (${loremHits} known phrase${loremHits === 1 ? '' : 's'})`);

      for (const { label, pattern } of PLACEHOLDER_PATTERNS) {
        if (pattern.test(paragraph)) reasons.push(label);
      }

      return { text: paragraph, flagged: reasons.length > 0, reasons };
    });
}

export default function DummyTextDetectorClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => analyzeText(input), [input]);
  const flaggedCount = results.filter(r => r.flagged).length;
  const cleanedText = useMemo(
    () => results.filter(r => !r.flagged).map(r => r.text).join('\n\n'),
    [results]
  );

  const loadExample = () => setInput(EXAMPLE);

  const copy = () => {
    if (!cleanedText) return;
    navigator.clipboard.writeText(cleanedText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Document Text</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste your document text, separating paragraphs with a blank line..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 180 }}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Flagged Paragraphs ({flaggedCount})</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {results.length === 0 ? (
          <p className="tb-v2-empty">Paste text above to scan for lorem ipsum and placeholder content.</p>
        ) : flaggedCount === 0 ? (
          <p className="tb-v2-empty">No placeholder or lorem ipsum text detected.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {results.filter(r => r.flagged).map((r, i) => (
              <div key={i} className="tb-v2-tool-pre" style={{ padding: '10px 14px' }}>
                <div style={{ color: 'var(--red, #dc2626)', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{r.reasons.join(' &middot; ')}</div>
                <div>{r.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {flaggedCount > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Cleaned Text (flagged paragraphs removed)</span>
            <button type="button" onClick={copy} disabled={!cleanedText} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            {cleanedText ? (
              <pre className="tb-v2-tool-pre">{cleanedText}</pre>
            ) : (
              <p className="tb-v2-empty">Every paragraph was flagged, nothing remains after removal.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
