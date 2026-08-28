'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

function countSentences(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return Math.max(1, sentences.length);
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

function countCharacters(text: string): number {
  return text.length;
}

function countCharactersNoSpaces(text: string): number {
  return text.replace(/\s/g, '').length;
}

function countParagraphs(text: string): number {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  return Math.max(paragraphs.length, text.trim() ? 1 : 0);
}

function countUniqueWords(text: string): number {
  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  const uniqueWords = new Set(words);
  return uniqueWords.size;
}

const EXAMPLE =
  'The quick brown fox jumps over the lazy dog. How many sentences are in this sample? Count them here!';

export default function SentenceCounterClient() {
  const [text, setText] = useState('');

  const sentences = countSentences(text);
  const words = countWords(text);
  const characters = countCharacters(text);
  const charactersNoSpaces = countCharactersNoSpaces(text);
  const paragraphs = countParagraphs(text);
  const uniqueWords = countUniqueWords(text);
  const avgWordLength = words > 0 ? (charactersNoSpaces / words).toFixed(1) : '0';
  const avgSentenceLength = sentences > 0 ? (words / sentences).toFixed(1) : '0';

  const clear = () => {
    setText('');
  };

  const stats = [
    { label: 'Sentences', value: sentences, icon: '📝' },
    { label: 'Words', value: words, icon: '📖' },
    { label: 'Characters', value: characters, icon: '🔤' },
    { label: 'No Spaces', value: charactersNoSpaces, icon: '📊' },
    { label: 'Paragraphs', value: paragraphs, icon: '📄' },
    { label: 'Unique Words', value: uniqueWords, icon: '✨' },
    { label: 'Avg Word Length', value: avgWordLength, icon: '📏' },
    { label: 'Avg Sentence Length', value: avgSentenceLength, icon: '📐' },
  ];

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to Analyze</span>
        <ToolExampleClearActions
          onExample={() => setText(EXAMPLE)}
          onClear={clear}
          canClear={text.length > 0}
        />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text to count sentences, words, and characters..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 150 }}
        aria-label="Text input for sentence counting"
      />


      {text.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Statistics</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {stats.map((stat, i) => (
                <div key={i} style={{ 
                  padding: 12, 
                  background: 'var(--tb-bg-secondary)', 
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}>
                  <span style={{ fontSize: 18 }}>{stat.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)' }}>{stat.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--tb-accent)' }}>
                      {stat.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {text.length === 0 && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
          <span style={{ color: 'var(--tb-text-secondary)' }}>Enter text to see statistics</span>
        </div>
      )}
    </div>
  );
}
