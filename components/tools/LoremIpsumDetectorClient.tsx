'use client';

import { useMemo, useState } from 'react';

// The standard "Lorem ipsum dolor sit amet..." filler text, traced back to
// Cicero's De Finibus. Matching individual words against this list is what
// the first version of this tool did, and it's unreliable both ways:
// ordinary English sentences contain enough of the short function words
// ("in", "at", "id", "do", "non", "et", "ut", "ex") to false-positive, and
// short genuine lorem ipsum snippets don't hit a density threshold to
// false-negative. Matching adjacent-word pairs (bigrams) from the actual
// canonical text fixes both: "lorem ipsum", "dolor sit", "sit amet" etc.
// essentially never occur in real prose by chance, and even a 2-3 word
// lorem ipsum snippet contains at least one of them.
const CANONICAL_LOREM_IPSUM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const EXAMPLE = `Product launch page — draft copy

The hero headline and pricing table are final.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Features section reviewed by marketing. Ready to publish.`;

function toWords(text: string): string[] {
  return text.toLowerCase().match(/[a-z]+/g) ?? [];
}

function toBigrams(words: string[]): Set<string> {
  const bigrams = new Set<string>();
  for (let i = 0; i < words.length - 1; i++) bigrams.add(`${words[i]} ${words[i + 1]}`);
  return bigrams;
}

const LOREM_BIGRAMS = toBigrams(toWords(CANONICAL_LOREM_IPSUM));

interface DetectionResult {
  wordCount: number;
  matchedPhrases: string[];
  isLoremIpsum: boolean;
}

function detect(text: string): DetectionResult {
  const words = toWords(text);
  const inputBigrams = toBigrams(words);
  const matchedPhrases = [...inputBigrams].filter((b) => LOREM_BIGRAMS.has(b));
  return { wordCount: words.length, matchedPhrases, isLoremIpsum: matchedPhrases.length > 0 };
}

export default function LoremIpsumDetectorClient() {
  const [input, setInput] = useState('');
  const result = useMemo(() => (input.trim() ? detect(input) : null), [input]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to scan</span>
        <button type="button" onClick={() => setInput(EXAMPLE)} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>
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
              background: result.isLoremIpsum ? 'var(--red-tint)' : 'var(--green-tint)',
              border: `1px solid ${result.isLoremIpsum ? 'var(--red)' : 'var(--green)'}`,
            }}
          >
            <strong>{result.isLoremIpsum ? '⚠️ Lorem ipsum detected' : '✅ No lorem ipsum detected'}</strong>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--fg-1)' }}>
              {result.isLoremIpsum
                ? `Found ${result.matchedPhrases.length} phrase${result.matchedPhrases.length === 1 ? '' : 's'} from the standard lorem ipsum text among ${result.wordCount} words.`
                : `No lorem ipsum phrases found among ${result.wordCount} words.`}
            </p>
          </div>
          {result.matchedPhrases.length > 0 && (
            <div style={{ fontSize: 13, color: 'var(--fg-1)' }}>
              Matched phrases: {result.matchedPhrases.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
