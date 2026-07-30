'use client';

import { useState, useMemo } from 'react';

const EXAMPLES = ['HELLO', 'WORLD', 'TOOL', 'CODE', '2026'];

const CHAR_MAP: Record<string, string[]> = {
  'A': ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  'B': ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  'C': ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  'D': ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  'E': ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  'F': ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  'G': ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  'H': ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  'I': ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  'J': ['00111', '00001', '00001', '00001', '00001', '10001', '01110'],
  'K': ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  'L': ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  'M': ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  'N': ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  'O': ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  'P': ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  'Q': ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  'R': ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  'S': ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  'T': ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  'U': ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  'V': ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  'W': ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  'X': ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  'Y': ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  'Z': ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  '0': ['01110', '10011', '10101', '11001', '10001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '11111'],
  '2': ['01110', '10001', '00001', '00110', '01000', '10000', '11111'],
  '3': ['01110', '10001', '00001', '00110', '00001', '10001', '01110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '10000', '11110', '00001', '10001', '01110'],
  '6': ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
};

function textToAsciiArt(text: string): string {
  const lines = ['', '', '', '', '', '', ''];
  for (const char of text.toUpperCase()) {
    const charLines = CHAR_MAP[char] || CHAR_MAP[' '];
    for (let i = 0; i < 7; i++) {
      lines[i] += charLines[i] + ' ';
    }
  }
  return lines.map(line => line.split('').map(c => c === '1' ? '█' : ' ').join('')).join('\n');
}

export default function AsciiArtGeneratorClient() {
  const [input, setInput] = useState('HELLO');
  const [copied, setCopied] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const output = useMemo(() => input ? textToAsciiArt(input) : '', [input]);

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const loadExample = (word: string) => {
    setInput(word);
    setShowExamples(false);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <button
          type="button"
          onClick={() => setShowExamples(!showExamples)}
          className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
        >
          📋 Examples
        </button>
      </div>

      {showExamples && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Try a word:</div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => loadExample(word)}
                className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-mono"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value.toUpperCase())}
        placeholder="Enter text to convert..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 48, fontFamily: 'var(--f-mono)', textTransform: 'uppercase' }}
        maxLength={20}
      />
      <p className="text-xs text-gray-500 mt-1">Max 20 characters. A-Z, 0-9 only.</p>

      {output && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">ASCII Art</span>
            <button onClick={copy} className="tb-v2-copy-btn">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body overflow-x-auto bg-black rounded-xl p-4">
            <pre className="font-mono text-xs leading-tight text-green-400">{output}</pre>
          </div>
        </>
      )}

      {!input && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🎨</div>
          <p>Enter text above to generate ASCII art</p>
        </div>
      )}
    </div>
  );
}
