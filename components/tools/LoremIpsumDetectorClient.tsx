'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

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

const EXAMPLE = `Product launch page (draft copy)

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
        <span className="tb-v2-tool-label">Document text</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="tb-v2-tool-textarea"
        placeholder="Paste text to check for placeholder lorem ipsum content..."
        style={{ minHeight: 180 }}
      />

      {result && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Result</span>
            <span style={{ fontSize: 12, color: 'var(--fg-2)' }}>{result.wordCount} words scanned</span>
          </div>
          <div className="tb-v2-tool-output-body">
            {result.isLoremIpsum ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="tb-v2-banner tb-v2-banner-warn">
                  <div>
                    <strong>Lorem ipsum detected</strong>
                    <p style={{ margin: '6px 0 0', fontWeight: 400 }}>
                      Found {result.matchedPhrases.length} matching phrase
                      {result.matchedPhrases.length === 1 ? '' : 's'} from the standard lorem ipsum text.
                    </p>
                  </div>
                </div>
                <div>
                  <div className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 10 }}>
                    Matched phrases
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {result.matchedPhrases.map((phrase) => (
                      <span
                        key={phrase}
                        style={{
                          fontFamily: 'var(--f-mono)',
                          fontSize: 12,
                          lineHeight: 1.4,
                          padding: '5px 10px',
                          borderRadius: 999,
                          background: 'var(--surface-2)',
                          border: '1px solid var(--line)',
                          color: 'var(--fg-1)',
                        }}
                      >
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: 16,
                  background: 'var(--surface-2)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--line)',
                  textAlign: 'center',
                }}
              >
                <span style={{ color: '#16a34a', fontWeight: 600 }}>No lorem ipsum detected</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
