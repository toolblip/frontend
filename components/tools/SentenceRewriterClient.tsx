'use client';

import { useState } from 'react';

interface RewriteOption {
  text: string;
  type: string;
}

function simplifySentence(sentence: string): string {
  // Convert complex structures to simpler forms
  let simplified = sentence;
  
  // Remove filler phrases
  const fillers = [
    /\bfor the purpose of\b/gi, 'to',
    /\bin order to\b/gi, 'to',
    /\bdue to the fact that\b/gi, 'because',
    /\bin the event that\b/gi, 'if',
    /\bat this point in time\b/gi, 'now',
    /\bin spite of the fact that\b/gi, 'although',
    /\bwith the exception of\b/gi, 'except',
    /\bin close proximity to\b/gi, 'near',
    /\bon a daily basis\b/gi, 'daily',
    /\bhas the ability to\b/gi, 'can',
    /\bmake use of\b/gi, 'use',
    /\bprior to\b/gi, 'before',
    /\bsubsequent to\b/gi, 'after',
    /\bin regard to\b/gi, 'about',
    /\bwith respect to\b/gi, 'about',
    /\bin terms of\b/gi, 'for',
    /\bin connection with\b/gi, 'about',
    /\bis able to\b/gi, 'can',
    /\bhas to\b/gi, 'must',
  ];
  
  for (let i = 0; i < fillers.length; i += 2) {
    simplified = simplified.replace(fillers[i] as RegExp, fillers[i + 1] as string);
  }
  
  return simplified.trim();
}

function expandSentence(sentence: string): string {
  // Add some elaboration
  let expanded = sentence;
  
  // Simple expansions
  expanded = expanded.replace(/\bneed to\b/gi, 'have a need to');
  expanded = expanded.replace(/\bwant to\b/gi, 'would like to');
  expanded = expanded.replace(/\btried to\b/gi, 'made an attempt to');
  expanded = expanded.replace(/\bgoing to\b/gi, 'planning to');
  expanded = expanded.replace(/\bhas to\b/gi, 'is required to');
  expanded = expanded.replace(/\bhelps to\b/gi, 'serves to help');
  expanded = expanded.replace(/\bstarted to\b/gi, 'began to');
  expanded = expanded.replace(/\bstopped to\b/gi, 'ceased activities in order to');
  
  return expanded.trim();
}

function makeActive(sentence: string): string {
  // Try to convert passive to active voice
  let active = sentence;
  
  // Common passive patterns to active
  const passivePatterns = [
    { from: /\bwas written by\b/gi, to: 'wrote' },
    { from: /\bwas done by\b/gi, to: 'did' },
    { from: /\bwas made by\b/gi, to: 'made' },
    { from: /\bwas created by\b/gi, to: 'created' },
    { from: /\bwas built by\b/gi, to: 'built' },
    { from: /\bwas seen by\b/gi, to: 'saw' },
    { from: /\bwas known by\b/gi, to: 'knew' },
    { from: /\bwas loved by\b/gi, to: 'loved' },
    { from: /\bwas hated by\b/gi, to: 'hated' },
    { from: /\bwas used by\b/gi, to: 'used' },
  ];
  
  for (const pattern of passivePatterns) {
    active = active.replace(pattern.from, pattern.to);
  }
  
  return active.trim();
}

function reorderSentence(sentence: string): string {
  // Simple reordering: move leading adverbs
  let reordered = sentence;
  
  // Move leading adverbs to the end
  const leadingAdverbs = /^(However,|Therefore,|Moreover,|Furthermore,|Nevertheless,|Thus,|Hence,|Meanwhile,)/i;
  const match = reordered.match(leadingAdverbs);
  
  if (match) {
    reordered = reordered.replace(leadingAdverbs, '').trim();
    reordered = reordered + ' ' + match[0];
  }
  
  return reordered.trim();
}

function splitSentence(sentence: string): string[] {
  // Split complex sentences at conjunctions
  const conjunctions = /\b(and|but|or|because|although|however|therefore|moreover|furthermore)\b/gi;
  const parts = sentence.split(conjunctions);
  
  return parts
    .map(p => p.trim())
    .filter(p => p.length > 10)
    .slice(0, 3);
}

function combineSentences(sentences: string[]): string {
  if (sentences.length < 2) return sentences[0] || '';
  
  // Simple combination
  return sentences.slice(0, 2).join(' and ').replace(/\band\b,?\s*and\b/gi, 'and');
}

export default function SentenceRewriterClient() {
  const [text, setText] = useState('');
  const [rewriteOptions, setRewriteOptions] = useState<RewriteOption[]>([]);
  const [selectedRewrite, setSelectedRewrite] = useState<string>('');

  const rewrite = () => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return;
    
    const options: RewriteOption[] = [];
    
    // Get first sentence for rewriting (or combine if only one)
    const mainSentence = sentences.length === 1 ? sentences[0] : combineSentences(sentences);
    
    options.push({ text: simplifySentence(mainSentence), type: 'Simplified' });
    options.push({ text: expandSentence(mainSentence), type: 'Expanded' });
    options.push({ text: makeActive(mainSentence), type: 'Active Voice' });
    options.push({ text: reorderSentence(mainSentence), type: 'Reordered' });
    
    if (sentences.length > 1) {
      const split = splitSentence(mainSentence);
      if (split.length > 1) {
        options.push({ text: split[0], type: 'Split #1' });
      }
    }
    
    setRewriteOptions(options);
    setSelectedRewrite(options[0]?.text || '');
  };

  const clear = () => {
    setText('');
    setRewriteOptions([]);
    setSelectedRewrite('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedRewrite);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Sentence to Rewrite</span>
      </div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setRewriteOptions([]);
          setSelectedRewrite('');
        }}
        placeholder="Enter a sentence to rewrite with different structures..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 100 }}
        aria-label="Text input for sentence rewriting"
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button type="button" onClick={rewrite} className="tb-v2-copy-btn" style={{ flex: 1 }}>
          Rewrite
        </button>
        <button type="button" onClick={clear} className="tb-v2-copy-btn" style={{ flex: 1 }}>
          Clear
        </button>
      </div>

      {rewriteOptions.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Rewrite Options</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rewriteOptions.map((option, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedRewrite(option.text)}
                  style={{
                    padding: 12,
                    background: selectedRewrite === option.text ? 'var(--tb-accent)' : 'var(--tb-bg-secondary)',
                    color: selectedRewrite === option.text ? 'white' : 'var(--tb-text-primary)',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: 13,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.8, marginBottom: 4 }}>
                    {option.type}
                  </div>
                  <div>{option.text}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {selectedRewrite && (
        <div style={{ marginTop: 12 }}>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Selected Result</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ 
              padding: 16, 
              background: 'var(--tb-bg-secondary)', 
              borderRadius: 8,
              marginBottom: 12
            }}>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>{selectedRewrite}</div>
            </div>
            <button
              type="button"
              onClick={copyToClipboard}
              className="tb-v2-copy-btn"
              style={{ width: '100%' }}
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}

      {text.length === 0 && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
          <span style={{ color: 'var(--tb-text-secondary)' }}>Enter a sentence to rewrite</span>
        </div>
      )}
    </div>
  );
}
