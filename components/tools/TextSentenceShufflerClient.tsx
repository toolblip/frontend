'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Mode = 'paragraph' | 'whole';

const EXAMPLE_TEXT = `The sun rose over the quiet hills. Birds began to sing in the trees. A light breeze carried the scent of pine.

Down in the valley, the town was waking up. Shopkeepers opened their doors. Children ran toward the school gates.`;

function splitSentences(text: string): string[] {
  const matches = text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g);
  return matches ? matches.filter(s => s.trim().length > 0) : [];
}

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function shuffleText(text: string, mode: Mode): string {
  if (mode === 'whole') {
    const sentences = splitSentences(text);
    return fisherYatesShuffle(sentences).join('').trim();
  }

  const paragraphs = text.split(/\n\s*\n/);
  return paragraphs
    .map(paragraph => {
      const sentences = splitSentences(paragraph);
      if (sentences.length === 0) return paragraph;
      return fisherYatesShuffle(sentences).join('').trim();
    })
    .join('\n\n');
}

export default function TextSentenceShufflerClient() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<Mode>('paragraph');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const loadExample = () => {
    setText(EXAMPLE_TEXT);
    setOutput('');
  };

  const clearAll = () => {
    setText('');
    setOutput('');
    setCopied(false);
  };

  const reshuffle = () => {
    setOutput(shuffleText(text, mode));
  };

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter your text</span>
        <ToolExampleClearActions
          onExample={loadExample}
          onClear={clearAll}
          canClear={text.length > 0 || output.length > 0}
        />
      </div>
      <textarea
        value={text}
        onChange={e => {
          setText(e.target.value);
          setOutput('');
        }}
        placeholder="Paste text made of multiple sentences to shuffle..."
        className="tb-v2-tool-textarea"
        rows={8}
      />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '14px 20px', borderBottom: '1px solid var(--line)' }}>
        <button
          type="button"
          onClick={() => setMode('paragraph')}
          className={`tb-v2-toggle-pill ${mode === 'paragraph' ? 'on' : ''}`}
        >
          Within each paragraph
        </button>
        <button
          type="button"
          onClick={() => setMode('whole')}
          className={`tb-v2-toggle-pill ${mode === 'whole' ? 'on' : ''}`}
        >
          Across whole text
        </button>
      </div>

      <div className="tb-v2-toolbar">
        <button
          onClick={reshuffle}
          disabled={!text.trim()}
          className="tb-v2-btn tb-v2-btn-primary"
        >
          {output ? 'Reshuffle' : 'Shuffle'}
        </button>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Shuffled Output</span>
        <button type="button" onClick={copyOutput} disabled={!output} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!output ? (
          <div className="tb-v2-empty">Enter text and click Shuffle to randomize sentence order.</div>
        ) : (
          <textarea readOnly value={output} className="tb-v2-tool-textarea" style={{ minHeight: 140 }} rows={8} />
        )}
      </div>
    </div>
  );
}
