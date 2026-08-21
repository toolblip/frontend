'use client';

import { useCallback, useRef, useState } from 'react';
import { analyse, convertLine, extractDomain } from '@/lib/punycode';
import EmojiPicker from './EmojiPicker';

// A hand-picked subset of lib/emoji-data.ts's full list, shown inline in
// the example panel so the common case doesn't need the search modal.
const QUICK_EMOJI = ['😀', '❤️', '🔥', '⭐', '🚀', '🐱', '🍕', '🌈', '🎉', '💡', '▲', '✓'];

// Deliberately distinct from the worked examples in data/tool-content.ts
// (münchen.de, россия.рф, 🇧🇪.ws, হারুন.বাংলা) so the quick-load chips here
// don't just repeat what's already shown in the "See more" section below.
const EXAMPLES = [
  'schön.de',
  '日本語.jp',
  '▲.to',
  'пример.рф',
  'হারুন.bd',
  'yuki@日本語.jp',
  'https://schön.de/straße',
];

// Pre-converted once at module scope so both panes' chip rows stay in sync.
const EXAMPLES_ASCII = EXAMPLES.map((seed) => {
  try {
    return convertLine(seed, 'toASCII');
  } catch {
    return seed;
  }
});

interface ConvertResult {
  text: string;
  errors: string[];
}

function convertLines(text: string, direction: 'toASCII' | 'toUnicode'): ConvertResult {
  const errors: string[] = [];
  const lines = text.split('\n').map((line, i) => {
    try {
      return convertLine(line, direction);
    } catch (err) {
      errors.push(`Line ${i + 1}: ${err instanceof Error ? err.message : String(err)}`);
      return '';
    }
  });
  return { text: lines.join('\n'), errors };
}

function collectWarnings(unicodeText: string): string[] {
  return unicodeText.split('\n').flatMap((line) => (line ? analyse(extractDomain(line)) : []));
}

export default function PunycodeEncoderClient() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  // Errors from converting the RIGHT pane's input, rendered under the LEFT pane (the destination).
  const [leftErrors, setLeftErrors] = useState<string[]>([]);
  // Errors from converting the LEFT pane's input, rendered under the RIGHT pane (the destination).
  const [rightErrors, setRightErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [copiedLeft, setCopiedLeft] = useState(false);
  const [copiedRight, setCopiedRight] = useState(false);
  const [showExamplesLeft, setShowExamplesLeft] = useState(false);
  const [showExamplesRight, setShowExamplesRight] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const leftTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Editing the left (Unicode) pane: derive the right (Punycode) pane from it.
  const applyLeft = useCallback((text: string) => {
    setLeft(text);
    const { text: converted, errors } = convertLines(text, 'toASCII');
    setRight(converted);
    setRightErrors(errors);
    setLeftErrors([]);
    setWarnings(collectWarnings(text));
  }, []);

  // Editing the right (Punycode) pane: derive the left (Unicode) pane from it.
  const applyRight = useCallback((text: string) => {
    setRight(text);
    const { text: converted, errors } = convertLines(text, 'toUnicode');
    setLeft(converted);
    setLeftErrors(errors);
    setRightErrors([]);
    setWarnings(collectWarnings(converted));
  }, []);

  const pasteLeft = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      applyLeft(text);
    } catch {
      // clipboard read denied/unsupported — do nothing
    }
  }, [applyLeft]);

  const pasteRight = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      applyRight(text);
    } catch {
      // clipboard read denied/unsupported — do nothing
    }
  }, [applyRight]);

  const copyLeft = useCallback(() => {
    navigator.clipboard.writeText(left).catch(() => {});
    setCopiedLeft(true);
    setTimeout(() => setCopiedLeft(false), 1500);
  }, [left]);

  const copyRight = useCallback(() => {
    navigator.clipboard.writeText(right).catch(() => {});
    setCopiedRight(true);
    setTimeout(() => setCopiedRight(false), 1500);
  }, [right]);

  const clearAll = useCallback(() => {
    setLeft('');
    setRight('');
    setLeftErrors([]);
    setRightErrors([]);
    setWarnings([]);
  }, []);

  const loadExampleLeft = (seed: string) => {
    applyLeft(seed);
    setShowExamplesLeft(false);
  };

  // Inserts at the textarea's current cursor position rather than replacing
  // the whole field, since the point is building a domain out of characters
  // that aren't on a keyboard - not swapping in a full canned example.
  const insertEmoji = (char: string) => {
    const el = leftTextareaRef.current;
    const start = el?.selectionStart ?? left.length;
    const end = el?.selectionEnd ?? left.length;
    const next = left.slice(0, start) + char + left.slice(end);
    applyLeft(next);
    const cursor = start + char.length;
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(cursor, cursor);
    });
  };

  const loadExampleRight = (seed: string) => {
    applyRight(seed);
    setShowExamplesRight(false);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y divide-[var(--line)] md:divide-y-0 md:divide-x">
        <div>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Unicode / IDN</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button type="button" onClick={pasteLeft} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm">
                Paste
              </button>
              <button
                type="button"
                onClick={() => setShowExamplesLeft(!showExamplesLeft)}
                className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
              >
                Example
              </button>
              <button type="button" onClick={clearAll} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm">
                Clear
              </button>
              <button type="button" onClick={copyLeft} className="tb-v2-copy-btn">
                {copiedLeft ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {showExamplesLeft && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 border border-gray-200 dark:border-gray-700">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Load an example:</div>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((seed) => (
                  <button
                    key={seed}
                    type="button"
                    onClick={() => loadExampleLeft(seed)}
                    className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors tb-idn-text"
                  >
                    {seed}
                  </button>
                ))}
              </div>

              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-3 mb-2">
                Insert an emoji or symbol (no keyboard needed):
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {QUICK_EMOJI.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => insertEmoji(char)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    {char}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(true)}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  Show full list…
                </button>
              </div>
            </div>
          )}

          <textarea
            ref={leftTextareaRef}
            className="tb-v2-tool-textarea tb-idn-text"
            placeholder="Enter Unicode/IDN domains, one per line..."
            value={left}
            onChange={(e) => applyLeft(e.target.value)}
            rows={8}
          />

          {leftErrors.map((err, i) => (
            <p key={i} className="tb-v2-error">
              {err}
            </p>
          ))}

          {warnings.length > 0 && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              {warnings.map((w, i) => (
                <p key={i} className="text-sm text-amber-700 dark:text-amber-400 tb-idn-text">
                  {w}
                </p>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Punycode / ASCII</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button type="button" onClick={pasteRight} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm">
                Paste
              </button>
              <button
                type="button"
                onClick={() => setShowExamplesRight(!showExamplesRight)}
                className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
              >
                Example
              </button>
              <button type="button" onClick={clearAll} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm">
                Clear
              </button>
              <button type="button" onClick={copyRight} className="tb-v2-copy-btn">
                {copiedRight ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {showExamplesRight && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 border border-gray-200 dark:border-gray-700">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Load an example:</div>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES_ASCII.map((seed, i) => (
                  <button
                    key={EXAMPLES[i]}
                    type="button"
                    onClick={() => loadExampleRight(seed)}
                    className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    {seed}
                  </button>
                ))}
              </div>
            </div>
          )}

          <textarea
            className="tb-v2-tool-textarea tb-idn-text"
            placeholder="Enter Punycode/ASCII domains, one per line..."
            value={right}
            onChange={(e) => applyRight(e.target.value)}
            rows={8}
          />

          {/*
            Hidden mirror of the right pane's text so ToolWrapper's Ctrl/Cmd+Shift+C
            shortcut (which queries `.tb-v2-tool-output-body pre`) keeps working.
            The visible textarea above is the editable surface; this node exists
            purely as a copy target and is not meant to be seen or announced.
          */}
          <div className="tb-v2-tool-output-body" hidden aria-hidden="true">
            <pre className="tb-v2-tool-pre">{right}</pre>
          </div>

          {rightErrors.map((err, i) => (
            <p key={i} className="tb-v2-error">
              {err}
            </p>
          ))}
        </div>
      </div>

      {showEmojiPicker && (
        <EmojiPicker
          onSelect={insertEmoji}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
}
