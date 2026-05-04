'use client';

import { useState } from 'react';

const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
  'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
  'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--',
  'X': '-..-', 'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.',
  '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
};

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(Object.entries(MORSE_CODE).map(([k, v]) => [v, k]));

export default function MorseCodeTranslatorClient() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'toMorse' | 'fromMorse'>('toMorse');

  const result = (() => {
    if (!text.trim()) return '';
    if (mode === 'toMorse') {
      return text.toUpperCase().split('').map(c => MORSE_CODE[c] || (c === ' ' ? ' ' : '')).join(' ');
    } else {
      return text.trim().split(/\s{2,}/).map(word => word.split(' ').map(m => REVERSE_MORSE[m] || '').join('')).join(' ');
    }
  })();

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input</span>
        <div className="tb-v2-mode-tabs" role="group">
          <button type="button" onClick={() => setMode('toMorse')} className={`tb-v2-mode-tab ${mode === 'toMorse' ? 'on' : ''}`}>Text → Morse</button>
          <button type="button" onClick={() => setMode('fromMorse')} className={`tb-v2-mode-tab ${mode === 'fromMorse' ? 'on' : ''}`}>Morse → Text</button>
        </div>
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={mode === 'toMorse' ? 'Type text to convert to Morse code...' : 'Paste Morse code (use spaces between dots/dashes, double space between words)...'}
        className="tb-v2-tool-textarea"
        style={{ minHeight: 100, fontFamily: mode === 'toMorse' ? 'var(--f-mono)' : undefined }}
      />
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Output</span>
        {result && <button type="button" onClick={copy} className="tb-v2-copy-btn">Copy</button>}
      </div>
      <div className="tb-v2-tool-output-body">
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 18, letterSpacing: 2, color: 'var(--tb-accent)', wordBreak: 'break-all' }}>
          {result || '—'}
        </div>
      </div>
    </div>
  );
}
