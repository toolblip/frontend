'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE =
  'I need to make a decision soon, but first let me take a break and think about it. I want to do a good job and have confidence in my choice.';

const COMMON_COLLOCATIONS: Record<string, string[]> = {
  make: ['make a decision', 'make a mistake', 'make money', 'make progress', 'make sure', 'make a call', 'make an effort', 'make a plan'],
  take: ['take a break', 'take a look', 'take notes', 'take action', 'take responsibility', 'take advantage', 'take care', 'take place', 'take off', 'take on', 'take up', 'take it easy', 'take into account'],
  do: ['do a good job', 'do business', 'do research', 'do exercise', 'do the laundry', 'do homework', 'do the dishes', 'do your best'],
  have: ['have a look', 'have breakfast', 'have fun', 'have a problem', 'have a question', 'have dinner', 'have a meeting', 'have confidence'],
  get: ['get up', 'get older', 'get started', 'get better', 'get worse', 'get along', 'get together', 'get rid of'],
  break: ['break a leg', 'break the ice', 'break down', 'break up', 'break free', 'break through', 'break a record'],
  come: ['come true', 'come back', 'come forward', 'come home', 'come up with', 'come across', 'come along'],
  run: ['run a business', 'run out of', 'run into', 'run away', 'run late', 'run fast', 'run for office'],
  pay: ['pay attention', 'pay back', 'pay off', 'pay a visit', 'pay respect', 'pay dividends'],
  think: ['think twice', 'think about', 'think of', 'think big', 'think outside the box', 'think highly of'],
  tell: ['tell a story', 'tell the truth', 'tell time', 'tell apart', 'tell on someone'],
  find: ['find out', 'find a way', 'find fault', 'find relief', 'find balance', 'find fault with', 'find solace in'],
  give: ['give a call', 'give a try', 'give up', 'give in', 'give away', 'give back'],
  show: ['show up', 'show off', 'show around', 'show respect', 'show gratitude'],
  know: ['know by heart', 'know the truth', 'know best', 'know for sure'],
  go: ['go ahead', 'go away', 'go back', 'go through', 'go beyond', 'go along'],
  see: ['see to it', 'see off', 'see through', 'see eye to eye', 'see red'],
  use: ['use up', 'use out', 'make use of', 'put to use'],
};

export default function CollocationsCheckerClient() {
  const [text, setText] = useState('');
  const [results, setResults] = useState<Array<{ phrase: string; type: string; suggestion?: string }>>([]);
  const [checked, setChecked] = useState(false);
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setResults([]);
    setChecked(false);
    setCopied(false);
  };

  const checkCollocations = () => {
    const words = text.toLowerCase().split(/\s+/);
    const found: typeof results = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i].replace(/[^a-z]/g, '');
      const bigram = `${word} ${words[i + 1] || ''}`.replace(/[^a-z\s]/g, '').trim();
      const trigram = `${word} ${words[i + 1] || ''} ${words[i + 2] || ''}`.replace(/[^a-z\s]/g, '').trim();

      if (COMMON_COLLOCATIONS[word]) {
        const matches = COMMON_COLLOCATIONS[word].filter(
          (col) => col.includes(bigram) || col.includes(trigram)
        );
        if (matches.length > 0) {
          found.push({ phrase: matches[0], type: 'found' });
        } else if (bigram.length > 3) {
          const similar = COMMON_COLLOCATIONS[word].find((col) => {
            const similarity = col.split(' ').filter((w) => bigram.includes(w)).length;
            return similarity >= 1;
          });
          if (similar) {
            found.push({ phrase: bigram, type: 'maybe', suggestion: similar });
          }
        }
      }
    }

    setResults(found);
    setChecked(true);
  };

  const copyResults = () => {
    if (!results.length) return;
    const output = results
      .map((r) =>
        r.type === 'found'
          ? `check: ${r.phrase}`
          : `maybe: ${r.phrase}${r.suggestion ? ` (did you mean: ${r.suggestion})` : ''}`
      )
      .join('\n');
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter your text</span>
        <ToolExampleClearActions
          onExample={() => {
            setText(EXAMPLE);
            reset();
          }}
          onClear={() => {
            setText('');
            reset();
          }}
          canClear={text.length > 0 || results.length > 0}
        />
      </div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          reset();
        }}
        className="tb-v2-tool-textarea"
        rows={6}
        placeholder="Type or paste text to check for common collocations..."
      />

      <div className="tb-v2-toolbar">
        <button
          type="button"
          onClick={checkCollocations}
          disabled={!text.trim()}
          className="tb-v2-btn tb-v2-btn-primary"
        >
          Check Collocations
        </button>
      </div>

      {!checked && !text && (
        <div className="tb-v2-tool-output-body">
          <div className="tb-v2-empty">
            Paste text or load the example, then check to find natural word pairings like &quot;make a
            decision&quot; or &quot;take a break&quot;.
          </div>
        </div>
      )}

      {checked && results.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Found {results.length} collocations</span>
            <button
              type="button"
              onClick={copyResults}
              className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {results.map((r, i) => (
                <div
                  key={i}
                  style={{
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 12,
                    background: 'var(--surface)',
                  }}
                >
                  <span className={`tb-v2-status ${r.type === 'found' ? 'tb-v2-status-ok' : 'tb-v2-status-warn'}`}>
                    {r.type === 'found' ? 'Match' : 'Maybe'}
                  </span>
                  <p style={{ fontSize: 13.5, fontWeight: 600, margin: '8px 0 0', color: 'var(--fg-0)' }}>
                    {r.phrase}
                  </p>
                  {r.suggestion && (
                    <p style={{ fontSize: 12.5, color: 'var(--fg-2)', margin: '4px 0 0' }}>
                      Did you mean: <strong>{r.suggestion}</strong>?
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {checked && results.length === 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Result</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div className="tb-v2-empty">
              No common collocations detected. Try verbs like make, take, do, get, or have with nouns.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
