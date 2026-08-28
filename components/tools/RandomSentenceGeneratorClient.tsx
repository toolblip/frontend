'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const subjects = ['The cat', 'A developer', 'The weather', 'This tool', 'An algorithm', 'The user', 'A function', 'The system'];
const verbs = ['generates', 'processes', 'validates', 'converts', 'calculates', 'analyzes', 'transforms', 'formats'];
const objects = ['data quickly', 'text efficiently', 'numbers accurately', 'code properly', 'JSON correctly', 'results instantly', 'input reliably', 'output perfectly'];
const adverbs = ['today', 'easily', 'smoothly', 'perfectly', 'efficiently', 'instantly', 'reliably', 'accurately'];

function generateSentence(): string {
  const patterns = [
    () =>
      `${subjects[Math.floor(Math.random() * subjects.length)]} ${verbs[Math.floor(Math.random() * verbs.length)]} ${objects[Math.floor(Math.random() * objects.length)]}.`,
    () =>
      `${subjects[Math.floor(Math.random() * subjects.length)]} ${adverbs[Math.floor(Math.random() * adverbs.length)]} ${verbs[Math.floor(Math.random() * verbs.length)]} ${objects[Math.floor(Math.random() * objects.length)]}.`,
    () =>
      `${verbs[Math.floor(Math.random() * verbs.length)]} ${objects[Math.floor(Math.random() * objects.length)]} ${adverbs[Math.floor(Math.random() * adverbs.length)]} with ${subjects[Math.floor(Math.random() * subjects.length)].toLowerCase()}.`,
  ];
  return patterns[Math.floor(Math.random() * patterns.length)]();
}

export default function RandomSentenceGeneratorClient() {
  const [count, setCount] = useState(5);
  const [sentences, setSentences] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = (n = count) => {
    const results = Array.from({ length: Math.min(Math.max(1, n), 50) }, () => generateSentence());
    setSentences(results);
  };

  const copy = () => {
    if (!sentences.length) return;
    navigator.clipboard.writeText(sentences.join(' ')).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Number of Sentences</span>
        <ToolExampleClearActions
          onExample={() => {
            setCount(5);
            generate(5);
          }}
          onClear={() => setSentences([])}
          canClear={sentences.length > 0}
        />
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 20px' }}>
        <input
          type="number"
          min="1"
          max="50"
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
          className="tb-v2-tool-textarea"
          style={{ width: 80, minHeight: 40, textAlign: 'center' }}
        />
        <button type="button" onClick={() => generate()} className="tb-v2-primary-btn" style={{ flex: 1 }}>
          Generate
        </button>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Generated Sentences</span>
        {sentences.length > 0 && (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy All'}
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-body">
        {sentences.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sentences.map((sentence, i) => (
              <div
                key={i}
                style={{
                  padding: '8px 12px',
                  background: 'var(--tb-bg-secondary)',
                  borderRadius: 6,
                  lineHeight: 1.5,
                }}
              >
                {sentence}
              </div>
            ))}
          </div>
        ) : (
          <div className="tb-v2-empty">Click Examples or Generate to create sentences</div>
        )}
      </div>
    </div>
  );
}
