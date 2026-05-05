'use client';

import { useState } from 'react';

export default function FlipClient() {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<'horizontal' | 'vertical' | 'both'>('horizontal');

  const flipHorizontal = (text: string): string => {
    return text.split('').reverse().join('');
  };

  const flipVertical = (text: string): string => {
    return text.split('\n').reverse().join('\n');
  };

  const flipBoth = (text: string): string => {
    return text.split('\n').reverse().join('\n').split('').reverse().join('');
  };

  const getFlippedText = () => {
    if (!input) return '';
    switch (direction) {
      case 'horizontal': return flipHorizontal(input);
      case 'vertical': return flipVertical(input);
      case 'both': return flipBoth(input);
    }
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Flip Text</h2>
        <p className="tb-v2-card-description">Flip text horizontally, vertically, or both</p>
      </div>

      <div className="flex gap-3 mb-4">
        {(['horizontal', 'vertical', 'both'] as const).map((dir) => (
          <button
            key={dir}
            onClick={() => setDirection(dir)}
            className={`tb-v2-button-secondary flex-1 capitalize ${
              direction === dir ? 'tb-v2-button-primary' : ''
            }`}
          >
            {dir === 'horizontal' ? '← → Horizontal' : dir === 'vertical' ? '↑ ↓ Vertical' : '↔ ↕ Both'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="tb-v2-input w-full font-mono"
            rows={6}
            placeholder="Enter text to flip..."
          />
        </div>

        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Result</label>
          <div className="tb-v2-input w-full font-mono bg-gray-50 p-3 min-h-[150px] whitespace-pre-wrap break-all">
            {getFlippedText() || '—'}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        {input && (
          <p>Flipping {input.length} characters {direction !== 'both' ? direction : 'horizontally and vertically'}</p>
        )}
      </div>
    </div>
  );
}
