'use client';

import { useState, useMemo } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = 'apple\nbanana\nelephant\nkeyboard';

function shuffleChars(chars: string[]): string[] {
  const arr = chars.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function scrambleWord(word: string): string {
  if (word.length < 2) return word;
  let result = word;
  for (let attempt = 0; attempt < 8; attempt++) {
    const candidate = shuffleChars(word.split('')).join('');
    result = candidate;
    if (candidate !== word) break;
  }
  return result;
}

function scrambleParagraph(text: string): string {
  return text.replace(/[A-Za-z]+/g, match => scrambleWord(match));
}

export default function WordScrambleGeneratorClient() {
  const [input, setInput] = useState('');
  const [wholeText, setWholeText] = useState(false);
  const [version, setVersion] = useState(0);

  const scrambled = useMemo(() => {
    if (!input.trim()) return '';
    if (wholeText) {
      return scrambleParagraph(input);
    }
    return input
      .split('\n')
      .map(line => (line.trim() ? scrambleParagraph(line) : line))
      .join('\n');
    // version is intentionally a dependency to force a fresh shuffle on "Re-scramble"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, wholeText, version]);

  const rescramble = () => setVersion((v) => v + 1);

  const copyAll = () => {
    navigator.clipboard.writeText(scrambled).catch(() => {});
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">{wholeText ? 'Text' : 'Words (one per line)'}</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        className="tb-v2-tool-textarea"
        placeholder={wholeText ? 'Paste a full sentence or paragraph...' : 'apple\nbanana\nelephant'}
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={6}
      />

      <div className="tb-v2-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <label className="tb-v2-checkbox-row">
          <input
            type="checkbox"
            checked={wholeText}
            onChange={e => setWholeText(e.target.checked)}
          />
          Scramble whole text (preserve word boundaries &amp; punctuation)
        </label>
        <button type="button" onClick={rescramble} disabled={!input.trim()} className="tb-v2-btn tb-v2-btn-sm">
          Re-scramble
        </button>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Scrambled Output</span>
        <button type="button" onClick={copyAll} disabled={!scrambled} className="tb-v2-copy-btn">
          Copy
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!scrambled ? (
          <p className="tb-v2-empty">Enter a word, word list, or paragraph to scramble.</p>
        ) : (
          <div className="tb-v2-tool-pre" style={{ maxHeight: 360 }}>
            {scrambled}
          </div>
        )}
      </div>
    </div>
  );
}
