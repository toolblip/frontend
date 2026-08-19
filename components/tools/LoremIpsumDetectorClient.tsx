'use client';

import { useMemo, useState } from 'react';

// The ~65 words that appear, in some order, in every variant of the
// standard "Lorem ipsum dolor sit amet..." filler text traced back to
// Cicero's De Finibus. Real prose can contain one or two of these words
// by coincidence, so this flags on density (a minimum share of a text's
// words matching this list), not on any single hit.
const LOREM_WORDS = new Set([
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
  'accusamus', 'iusto', 'odio', 'dignissimos', 'ducimus', 'blanditiis',
]);

interface DetectionResult {
  wordCount: number;
  matchCount: number;
  density: number;
  isLoremIpsum: boolean;
  matchedWords: string[];
}

function detect(text: string): DetectionResult {
  const words = text.toLowerCase().match(/[a-z]+/g) ?? [];
  const matched = words.filter((w) => LOREM_WORDS.has(w));
  const wordCount = words.length;
  const matchCount = matched.length;
  const density = wordCount > 0 ? matchCount / wordCount : 0;
  // Real English prose rarely exceeds a couple percent overlap with this
  // list by chance; genuine lorem ipsum text runs 40%+.
  const isLoremIpsum = wordCount >= 5 && density >= 0.2;
  return { wordCount, matchCount, density, isLoremIpsum, matchedWords: [...new Set(matched)] };
}

export default function LoremIpsumDetectorClient() {
  const [input, setInput] = useState('');
  const result = useMemo(() => (input.trim() ? detect(input) : null), [input]);

  return (
    <div className="tb-v2-tool-card">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="tb-v2-input"
        placeholder="Paste text to check for placeholder lorem ipsum content..."
        rows={8}
      />
      {result && (
        <div className="space-y-3" style={{ marginTop: 16 }}>
          <div
            className="tb-v2-tool-card"
            style={{
              background: result.isLoremIpsum ? '#fef2f2' : '#f0fdf4',
              border: `1px solid ${result.isLoremIpsum ? '#fecaca' : '#bbf7d0'}`,
            }}
          >
            <strong>{result.isLoremIpsum ? '⚠️ Lorem ipsum detected' : '✅ No lorem ipsum detected'}</strong>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
              {result.matchCount} of {result.wordCount} words ({Math.round(result.density * 100)}%) match common
              lorem ipsum vocabulary.
            </p>
          </div>
          {result.matchedWords.length > 0 && (
            <div style={{ fontSize: 13, color: '#6b7280' }}>
              Matched words: {result.matchedWords.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
