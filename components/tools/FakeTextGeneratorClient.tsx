'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'ac', 'ante', 'arcu',
  'libero', 'rutrum', 'arcu', 'vitae', 'auctor', 'massa', 'turpis', 'magna',
  'sit', 'amet', 'praesent', 'vestibulum', 'massa', 'eget', 'ante', 'bibendum',
];

function generateText(wordCount: number): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
  }
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

export default function FakeTextGeneratorClient() {
  const [wordCount, setWordCount] = useState(50);
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = (n = wordCount) => {
    setText(generateText(n));
  };

  const copy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const wordCountOptions = [10, 25, 50, 100, 200, 500];

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Word Count</span>
        <ToolExampleClearActions
          onExample={() => {
            setWordCount(50);
            generate(50);
          }}
          onClear={() => setText('')}
          canClear={text.length > 0}
        />
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '12px 20px' }}>
        {wordCountOptions.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setWordCount(opt)}
            className={`tb-v2-mode-tab ${wordCount === opt ? 'on' : ''}`}
          >
            {opt}
          </button>
        ))}
        <input
          type="number"
          min="1"
          max="1000"
          value={wordCount}
          onChange={(e) => setWordCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
          className="tb-v2-tool-textarea"
          style={{ width: 80, minHeight: 36, textAlign: 'center' }}
        />
      </div>
      <div style={{ padding: '0 20px 16px' }}>
        <button type="button" onClick={() => generate()} className="tb-v2-primary-btn" style={{ width: '100%' }}>
          Generate Text
        </button>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Generated Text</span>
        {text && (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-body">
        {text ? (
          <p style={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{text}</p>
        ) : (
          <div className="tb-v2-empty">Click Examples or Generate to create text</div>
        )}
      </div>
    </div>
  );
}
