'use client';

import { useState } from 'react';

const FONTS = [
  { name: 'Caveat', family: 'Caveat, cursive', preview: 'Aa Bb Cc' },
  { name: 'Dancing Script', family: '"Dancing Script", cursive', preview: 'Aa Bb Cc' },
  { name: 'Patrick Hand', family: '"Patrick Hand", cursive', preview: 'Aa Bb Cc' },
  { name: 'Kalam', family: 'Kalam, cursive', preview: 'Aa Bb Cc' },
  { name: 'Indie Flower', family: '"Indie Flower", cursive', preview: 'Aa Bb Cc' },
];

const SIZES = [16, 20, 24, 28, 32, 40, 48];

export default function TextToHandwritingClient() {
  const [input, setInput] = useState('');
  const [font, setFont] = useState(FONTS[0].family);
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState('#1a1a2e');
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <span className="text-xs text-gray-500">{input.length > 0 ? `${input.length} chars` : ''}</span>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="tb-v2-tool-textarea"
        placeholder="Type or paste text to convert to handwriting..."
        rows={4}
      />

      {/* Font selector */}
      <div className="space-y-3">
        <label className="tb-v2-tool-label">Handwriting Style</label>
        <div className="flex flex-wrap gap-2">
          {FONTS.map((f) => (
            <button
              key={f.name}
              onClick={() => setFont(f.family)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                font === f.family
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
              style={{ fontFamily: f.family }}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Size & Color */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[150px]">
          <label className="tb-v2-tool-label">Size: {fontSize}px</label>
          <input
            type="range"
            min={12}
            max={64}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="tb-v2-tool-label">Color</label>
          <div className="flex gap-2">
            {['#1a1a2e', '#2d3436', '#6c5ce7', '#0984e3', '#d63031', '#00b894'].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 ${
                  color === c ? 'border-gray-400 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      {input && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Preview</span>
            <button onClick={copy} className="tb-v2-copy-btn">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
            <div
              style={{
                fontFamily: font,
                fontSize: `${fontSize}px`,
                color: color,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {input}
            </div>
          </div>
        </>
      )}

      {!input && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">✍️</div>
          <p>Type or paste text above to see handwriting preview</p>
        </div>
      )}
    </div>
  );
}
