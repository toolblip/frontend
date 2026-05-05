'use client';

import { useState } from 'react';

interface SynonymGroup {
  word: string;
  synonyms: string[];
}

const SYNONYMS: Record<string, string[]> = {
  'good': ['great', 'excellent', 'fine', 'positive', 'satisfying'],
  'bad': ['poor', 'negative', 'unfavorable', 'substandard', 'inferior'],
  'big': ['large', 'huge', 'enormous', 'massive', 'substantial'],
  'small': ['tiny', 'little', 'compact', 'minor', 'slight'],
  'important': ['significant', 'crucial', 'essential', 'vital', 'critical'],
  'think': ['believe', 'consider', 'suppose', 'reckon', 'assume'],
  'say': ['state', 'claim', 'assert', 'mention', 'note'],
  'make': ['create', 'produce', 'generate', 'build', 'construct'],
  'get': ['obtain', 'acquire', 'receive', 'attain', 'gain'],
  'take': ['grab', 'seize', 'capture', 'claim', 'procure'],
  'see': ['observe', 'witness', 'notice', 'perceive', 'view'],
  'know': ['understand', 'comprehend', 'recognize', 'grasp', 'realize'],
  'want': ['desire', 'wish', 'need', 'require', 'crave'],
  'use': ['utilize', 'apply', 'employ', 'exploit', 'harness'],
  'find': ['discover', 'locate', 'detect', 'uncover', 'identify'],
  'give': ['provide', 'offer', 'deliver', 'grant', 'bestow'],
  'tell': ['inform', 'notify', 'advise', 'report', 'explain'],
  'ask': ['inquire', 'question', 'query', 'probe', 'interrogate'],
  'work': ['function', 'operate', 'perform', 'act', 'run'],
  'seem': ['appear', 'look', 'feel', 'sound', 'emerge'],
  'feel': ['sense', 'experience', 'perceive', 'undergo', 'experience'],
  'try': ['attempt', 'endeavor', 'strive', 'seek', 'attempt'],
  'leave': ['depart', 'exit', 'go away', 'withdraw', 'abandon'],
  'call': ['contact', 'reach', 'telephone', 'ring', 'dial'],
  'keep': ['maintain', 'retain', 'hold', 'preserve', 'sustain'],
  'let': ['allow', 'permit', 'enable', 'authorize', 'grant'],
  'begin': ['start', 'commence', 'initiate', 'launch', 'embark'],
  'show': ['display', 'exhibit', 'demonstrate', 'present', 'reveal'],
  'hear': ['listen', 'attend', 'perceive', 'learn', 'discover'],
  'play': ['engage', 'participate', 'perform', 'act', 'amuse'],
  'run': ['operate', 'function', 'sprint', 'dash', 'rush'],
  'move': ['shift', 'transfer', 'relocate', 'adjust', 'proceed'],
  'live': ['reside', 'dwell', 'exist', 'survive', 'inhabit'],
  'believe': ['think', 'trust', 'consider', 'suppose', 'assume'],
  'hold': ['grasp', 'grip', 'clutch', 'contain', 'support'],
  'bring': ['carry', 'fetch', 'transport', 'deliver', 'convey'],
  'happen': ['occur', 'transpire', 'arise', 'emerge', 'result'],
  'write': ['compose', 'author', 'pen', 'draft', 'create'],
  'provide': ['give', 'supply', 'offer', 'furnish', 'deliver'],
  'sit': ['rest', 'settle', 'perch', 'remain', 'stay'],
  'stand': ['rise', 'erect', 'remain', 'stay', 'stop'],
  'lose': ['misplace', 'forfeit', 'fail', 'miss', 'decline'],
  'pay': ['remunerate', 'compensate', 'reimburse', 'settle', 'award'],
  'meet': ['encounter', 'gather', 'assemble', 'convene', 'join'],
  'include': ['contain', 'comprise', 'incorporate', 'involve', 'encompass'],
  'continue': ['proceed', 'persist', 'carry on', 'resume', 'maintain'],
  'set': ['establish', 'fix', 'place', 'arrange', 'determine'],
  'learn': ['discover', 'acquire', 'master', 'study', 'grasp'],
  'change': ['alter', 'modify', 'adjust', 'transform', 'shift'],
  'lead': ['guide', 'direct', 'govern', 'manage', 'influence'],
  'understand': ['comprehend', 'grasp', 'realize', 'recognize', 'appreciate'],
  'watch': ['observe', 'view', 'monitor', 'scrutinize', 'gaze'],
  'follow': ['pursue', 'track', 'trail', 'shadow', 'maintain'],
  'stop': ['halt', 'cease', 'pause', 'end', 'terminate'],
  'create': ['make', 'produce', 'generate', 'build', 'form'],
  'speak': ['talk', 'say', 'state', 'express', 'communicate'],
  'read': ['peruse', 'study', 'examine', 'scan', 'review'],
  'spend': ['expend', 'consume', 'use', 'invest', 'allocate'],
  'grow': ['develop', 'expand', 'increase', 'flourish', 'thrive'],
  'open': ['unseal', 'unfold', 'reveal', 'begin', 'commence'],
  'walk': ['stroll', 'stride', 'march', 'wander', 'amble'],
  'win': ['triumph', 'succeed', 'prevail', 'conquer', 'achieve'],
  'teach': ['instruct', 'educate', 'train', 'coach', 'mentor'],
  'offer': ['provide', 'give', 'propose', 'suggest', 'extend'],
  'remember': ['recall', 'recollect', 'retain', 'memorize', 'reflect'],
  'love': ['adore', 'cherish', 'treasure', 'appreciate', 'value'],
  'consider': ['think', 'believe', 'regard', 'contemplate', 'weigh'],
  'appear': ['seem', 'look', 'emerge', 'show', 'manifest'],
  'buy': ['purchase', 'acquire', 'obtain', 'procure', 'secure'],
  'wait': ['stay', 'remain', 'pause', 'expect', 'anticipate'],
  'serve': ['assist', 'help', 'aid', 'support', 'attend'],
  'die': ['pass away', 'expire', 'perish', 'expire', 'cease'],
  'send': ['dispatch', 'transmit', 'forward', 'ship', 'convey'],
};

interface Replacement {
  original: string;
  replacement: string;
  index: number;
}

export default function ParaphrasingClient() {
  const [text, setText] = useState('');
  const [highlightedWords, setHighlightedWords] = useState<string[]>([]);
  const [replacements, setReplacements] = useState<Replacement[]>([]);

  const analyzeText = () => {
    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    const uniqueWords = [...new Set(words)];
    const foundWords: string[] = [];
    
    for (const word of uniqueWords) {
      if (SYNONYMS[word]) {
        foundWords.push(word);
      }
    }
    
    setHighlightedWords(foundWords);
    setReplacements([]);
  };

  const handleWordClick = (word: string) => {
    const existing = replacements.find(r => r.original === word);
    if (existing) {
      setReplacements(replacements.filter(r => r.original !== word));
    } else {
      setReplacements([...replacements, { 
        original: word, 
        replacement: SYNONYMS[word][0],
        index: highlightedWords.indexOf(word)
      }]);
    }
  };

  const handleSynonymSelect = (original: string, synonym: string) => {
    setReplacements(replacements.map(r => 
      r.original === original ? { ...r, replacement: synonym } : r
    ));
  };

  const applyReplacements = () => {
    let newText = text;
    for (const rep of replacements) {
      const regex = new RegExp(`\\b${rep.original}\\b`, 'gi');
      newText = newText.replace(regex, rep.replacement);
    }
    setText(newText);
    setHighlightedWords([]);
    setReplacements([]);
  };

  const clear = () => {
    setText('');
    setHighlightedWords([]);
    setReplacements([]);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to Paraphrase</span>
      </div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setHighlightedWords([]);
          setReplacements([]);
        }}
        placeholder="Enter text and click 'Find Alternatives' to see synonym suggestions..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 150 }}
        aria-label="Text input for paraphrasing"
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button type="button" onClick={analyzeText} className="tb-v2-copy-btn" style={{ flex: 1 }}>
          Find Alternatives
        </button>
        <button type="button" onClick={clear} className="tb-v2-copy-btn" style={{ flex: 1 }}>
          Clear
        </button>
      </div>

      {highlightedWords.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Click words to select alternatives</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {highlightedWords.map((word) => {
                const isSelected = replacements.some(r => r.original === word);
                return (
                  <button
                    key={word}
                    type="button"
                    onClick={() => handleWordClick(word)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 16,
                      fontSize: 13,
                      cursor: 'pointer',
                      background: isSelected ? 'var(--tb-accent)' : 'var(--tb-bg-secondary)',
                      color: isSelected ? 'white' : 'var(--tb-text-primary)',
                      border: 'none',
                      fontWeight: 500,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            {replacements.length > 0 && (
              <div style={{ borderTop: '1px solid var(--tb-bg-secondary)', paddingTop: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Select synonyms:</div>
                {replacements.map((rep) => (
                  <div key={rep.original} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 12, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: '#ef4444' }}>{rep.original}</span>
                      {' → '}
                      <span style={{ fontWeight: 600, color: '#22c55e' }}>{rep.replacement}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {SYNONYMS[rep.original].map((syn) => (
                        <button
                          key={syn}
                          type="button"
                          onClick={() => handleSynonymSelect(rep.original, syn)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 11,
                            cursor: 'pointer',
                            background: syn === rep.replacement ? '#22c55e' : 'var(--tb-bg-primary)',
                            color: syn === rep.replacement ? 'white' : 'var(--tb-text-secondary)',
                            border: 'none'
                          }}
                        >
                          {syn}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={applyReplacements}
                  className="tb-v2-copy-btn"
                  style={{ marginTop: 8, width: '100%' }}
                >
                  Apply Changes
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {text.length > 0 && highlightedWords.length === 0 && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
          <span style={{ color: 'var(--tb-text-secondary)' }}>Click "Find Alternatives" to detect words with synonyms</span>
        </div>
      )}

      {text.length === 0 && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
          <span style={{ color: 'var(--tb-text-secondary)' }}>Enter text to paraphrase</span>
        </div>
      )}
    </div>
  );
}
