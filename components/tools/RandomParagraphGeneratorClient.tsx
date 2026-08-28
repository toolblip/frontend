'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const sentenceTemplates = [
  'This {adj} approach helps {verb} {noun} effectively.',
  '{noun} is essential for {adj} {noun} development.',
  'Using {adj} {noun} can significantly improve {noun} results.',
  'The {adj} {noun} provides {noun} functionality for developers.',
  'Modern {noun} requires {adj} techniques and {adj} methodology.',
  'Implementing {adj} {noun} leads to better {noun} outcomes.',
  'Developers appreciate {adj} tools that simplify {noun} workflows.',
  'The {adj} framework supports {noun} development cycles.',
];

const adjectives = ['modern', 'efficient', 'powerful', 'flexible', 'reliable', 'scalable', 'robust', 'intuitive'];
const verbs = ['optimize', 'enhance', 'streamline', 'improve', 'accelerate', 'simplify', 'automate', 'transform'];
const nouns = ['workflow', 'productivity', 'code', 'system', 'process', 'platform', 'solution', 'infrastructure'];

function generateSentence(): string {
  let sentence = sentenceTemplates[Math.floor(Math.random() * sentenceTemplates.length)];
  sentence = sentence.replace('{adj}', adjectives[Math.floor(Math.random() * adjectives.length)]);
  sentence = sentence.replace('{verb}', verbs[Math.floor(Math.random() * verbs.length)]);
  sentence = sentence.replace('{noun}', nouns[Math.floor(Math.random() * nouns.length)]);
  return sentence;
}

function generateParagraph(sentenceCount: number): string {
  return Array.from({ length: sentenceCount }, generateSentence).join(' ');
}

export default function RandomParagraphGeneratorClient() {
  const [paragraphs, setParagraphs] = useState(3);
  const [sentencesPerParagraph, setSentencesPerParagraph] = useState(5);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = (paraCount = paragraphs, sentCount = sentencesPerParagraph) => {
    const output = Array.from({ length: paraCount }, () => generateParagraph(sentCount)).join('\n\n');
    setResult(output);
  };

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Configuration</span>
        <ToolExampleClearActions
          onExample={() => {
            setParagraphs(3);
            setSentencesPerParagraph(5);
            generate(3, 5);
          }}
          onClear={() => setResult('')}
          canClear={result.length > 0}
        />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          padding: '12px 20px',
        }}
      >
        <div>
          <label style={{ fontSize: 11, color: 'var(--tb-text-secondary)', display: 'block', marginBottom: 4 }}>
            Paragraphs
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={paragraphs}
            onChange={(e) => setParagraphs(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
            className="tb-v2-tool-textarea"
            style={{ minHeight: 40, textAlign: 'center' }}
          />
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--tb-text-secondary)', display: 'block', marginBottom: 4 }}>
            Sentences/Para
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={sentencesPerParagraph}
            onChange={(e) =>
              setSentencesPerParagraph(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))
            }
            className="tb-v2-tool-textarea"
            style={{ minHeight: 40, textAlign: 'center' }}
          />
        </div>
      </div>
      <div style={{ padding: '0 20px 16px' }}>
        <button type="button" onClick={() => generate()} className="tb-v2-primary-btn" style={{ width: '100%' }}>
          Generate Paragraphs
        </button>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Output</span>
        {result && (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-body">
        {result ? (
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
            {result.split('\n\n').map((para, i) => (
              <p key={i} style={{ marginBottom: 16 }}>
                {para}
              </p>
            ))}
          </div>
        ) : (
          <div className="tb-v2-empty">Click Examples or Generate to create paragraphs</div>
        )}
      </div>
    </div>
  );
}
