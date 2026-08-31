'use client';

import { useCallback, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_TEXT = 'SOS';
const EXAMPLE_MORSE = '... --- ...';

const MORSE_CODE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
  I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
  Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.',
  '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', $: '...-..-', '@': '.--.-.',
};

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
);

function textToMorse(text: string): string {
  if (!text) return '';
  return text
    .toUpperCase()
    .split('')
    .map((c) => (c === ' ' ? ' ' : MORSE_CODE[c] ?? ''))
    .join(' ')
    .replace(/ +/g, ' ')
    .trim();
}

function morseToText(morse: string): { text: string; error: string } {
  const trimmed = morse.trim();
  if (!trimmed) return { text: '', error: '' };
  if (!/^[.\-\s/]+$/.test(trimmed)) {
    return { text: '', error: 'Morse uses dots, dashes, and spaces only' };
  }
  const words = trimmed.split(/\s{2,}/);
  const text = words
    .map((word) =>
      word
        .split(' ')
        .map((token) => REVERSE_MORSE[token] ?? '')
        .join('')
    )
    .join(' ');
  return { text, error: '' };
}

export default function MorseCodeTranslatorClient() {
  const [text, setText] = useState('');
  const [morse, setMorse] = useState('');
  const [morseError, setMorseError] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [copiedMorse, setCopiedMorse] = useState(false);

  const applyText = useCallback((raw: string) => {
    setText(raw);
    if (!raw) {
      setMorse('');
      setMorseError('');
      return;
    }
    setMorse(textToMorse(raw));
    setMorseError('');
  }, []);

  const applyMorse = useCallback((raw: string) => {
    setMorse(raw);
    if (!raw.trim()) {
      setText('');
      setMorseError('');
      return;
    }
    const { text: converted, error } = morseToText(raw);
    if (error) {
      setMorseError(error);
      return;
    }
    setText(converted);
    setMorseError('');
  }, []);

  const copy = (value: string, which: 'text' | 'morse') => {
    if (!value) return;
    navigator.clipboard.writeText(value).catch(() => {});
    if (which === 'text') {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 1500);
    } else {
      setCopiedMorse(true);
      setTimeout(() => setCopiedMorse(false), 1500);
    }
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Morse Code Translator</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => applyText(EXAMPLE_TEXT)}
          onClear={() => {
            setText('');
            setMorse('');
            setMorseError('');
          }}
          canClear={Boolean(text || morse)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y divide-[var(--line)] md:divide-y-0 md:divide-x">
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 280 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Text</span>
            <button
              type="button"
              onClick={() => copy(text, 'text')}
              disabled={!text}
              className={`tb-v2-copy-btn ${copiedText ? 'done' : ''}`}
            >
              {copiedText ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => applyText(e.target.value)}
            placeholder={EXAMPLE_TEXT}
            className="tb-v2-tool-textarea"
            style={{ flex: 1, minHeight: 220, border: 'none', borderRadius: 0, resize: 'vertical' }}
            aria-label="Text input"
            spellCheck={false}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 280 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Morse code</span>
            <button
              type="button"
              onClick={() => copy(morse, 'morse')}
              disabled={!morse}
              className={`tb-v2-copy-btn ${copiedMorse ? 'done' : ''}`}
            >
              {copiedMorse ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={morse}
            onChange={(e) => applyMorse(e.target.value)}
            placeholder={EXAMPLE_MORSE}
            className="tb-v2-tool-textarea"
            style={{
              flex: 1,
              minHeight: 220,
              fontFamily: 'var(--f-mono)',
              letterSpacing: 2,
              border: 'none',
              borderRadius: 0,
              resize: 'vertical',
            }}
            aria-label="Morse code input"
            spellCheck={false}
          />
          {morseError ? (
            <p className="tb-v2-error" role="alert" style={{ margin: '0 16px 12px' }}>
              {morseError}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
