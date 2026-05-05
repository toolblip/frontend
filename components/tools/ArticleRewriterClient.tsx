'use client';

import { useState } from 'react';

const SYNONYMS: Record<string, string[]> = {
  'good': ['great', 'excellent', 'superb', 'wonderful'],
  'bad': ['poor', 'terrible', 'awful', 'dreadful'],
  'big': ['large', 'huge', 'enormous', 'massive'],
  'small': ['tiny', 'little', 'compact', 'petite'],
  'important': ['significant', 'crucial', 'essential', 'vital'],
  'think': ['believe', 'consider', 'suppose', 'assume'],
  'say': ['state', 'claim', 'assert', 'mention'],
  'make': ['create', 'produce', 'generate', 'build'],
  'get': ['obtain', 'acquire', 'receive', 'attain'],
  'see': ['observe', 'witness', 'notice', 'perceive'],
  'know': ['understand', 'comprehend', 'recognize', 'grasp'],
  'want': ['desire', 'wish', 'need', 'require'],
  'use': ['utilize', 'apply', 'employ', 'exploit'],
  'find': ['discover', 'locate', 'detect', 'uncover'],
  'give': ['provide', 'offer', 'deliver', 'grant'],
  'tell': ['inform', 'notify', 'advise', 'explain'],
  'ask': ['inquire', 'question', 'query', 'probe'],
  'work': ['function', 'operate', 'perform', 'run'],
  'seem': ['appear', 'look', 'feel', 'sound'],
  'feel': ['sense', 'experience', 'perceive', 'undergo'],
  'try': ['attempt', 'endeavor', 'strive', 'seek'],
  'leave': ['depart', 'exit', 'withdraw', 'abandon'],
  'call': ['contact', 'reach', 'telephone', 'dial'],
  'keep': ['maintain', 'retain', 'hold', 'preserve'],
  'let': ['allow', 'permit', 'enable', 'authorize'],
  'begin': ['start', 'commence', 'initiate', 'launch'],
  'show': ['display', 'exhibit', 'demonstrate', 'reveal'],
  'hear': ['listen', 'attend', 'perceive', 'learn'],
  'run': ['operate', 'function', 'sprint', 'rush'],
  'move': ['shift', 'transfer', 'relocate', 'adjust'],
  'live': ['reside', 'dwell', 'exist', 'inhabit'],
  'believe': ['think', 'trust', 'consider', 'assume'],
  'hold': ['grasp', 'grip', 'clutch', 'contain'],
  'bring': ['carry', 'fetch', 'transport', 'deliver'],
  'happen': ['occur', 'transpire', 'arise', 'result'],
  'write': ['compose', 'author', 'pen', 'draft'],
  'provide': ['supply', 'offer', 'furnish', 'deliver'],
  'continue': ['proceed', 'persist', 'carry on', 'resume'],
  'set': ['establish', 'fix', 'place', 'arrange'],
  'learn': ['discover', 'acquire', 'master', 'study'],
  'change': ['alter', 'modify', 'adjust', 'transform'],
  'lead': ['guide', 'direct', 'govern', 'manage'],
  'understand': ['comprehend', 'grasp', 'realize', 'recognize'],
  'watch': ['observe', 'view', 'monitor', 'gaze'],
  'follow': ['pursue', 'track', 'trail', 'shadow'],
  'stop': ['halt', 'cease', 'pause', 'terminate'],
  'create': ['make', 'produce', 'generate', 'build'],
  'speak': ['talk', 'say', 'state', 'express'],
  'read': ['peruse', 'study', 'examine', 'review'],
  'spend': ['expend', 'consume', 'invest', 'allocate'],
  'grow': ['develop', 'expand', 'increase', 'thrive'],
  'open': ['unseal', 'unfold', 'reveal', 'begin'],
  'walk': ['stroll', 'stride', 'march', 'wander'],
  'win': ['triumph', 'succeed', 'prevail', 'achieve'],
  'teach': ['instruct', 'educate', 'train', 'coach'],
  'offer': ['propose', 'suggest', 'extend', 'provide'],
  'remember': ['recall', 'recollect', 'retain', 'memorize'],
  'love': ['adore', 'cherish', 'treasure', 'appreciate'],
  'consider': ['think', 'believe', 'regard', 'contemplate'],
  'appear': ['seem', 'look', 'emerge', 'show'],
  'buy': ['purchase', 'acquire', 'obtain', 'procure'],
  'wait': ['stay', 'remain', 'pause', 'expect'],
  'serve': ['assist', 'help', 'aid', 'support'],
  'send': ['dispatch', 'transmit', 'forward', 'ship'],
};

export default function ArticleRewriterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const rewrite = () => {
    if (!input.trim()) return;

    const words = input.split(/(\s+)/);
    let synonymIndex = 0;

    const result = words.map((word) => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      const punctuation = word.match(/[^a-z]*$/)?.[0] || '';
      const leadingPunct = word.match(/^[^a-z]*/)?.[0] || '';
      
      if (SYNONYMS[cleanWord]) {
        const synonymList = SYNONYMS[cleanWord];
        const idx = synonymIndex % synonymList.length;
        synonymIndex++;
        const replacement = synonymList[idx];
        
        const hasUppercase = word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase();
        const finalReplacement = hasUppercase 
          ? replacement[0].toUpperCase() + replacement.slice(1) 
          : replacement;
        
        return leadingPunct + finalReplacement + punctuation;
      }
      return word;
    }).join('');

    setOutput(result);
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Article Text to Rewrite</span>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your article or paragraph here..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 150 }}
        aria-label="Article input for rewriting"
      />

      <button type="button" onClick={rewrite} className="tb-v2-primary-btn" style={{ width: '100%', marginTop: 12, marginBottom: 12 }}>
        Rewrite Article
      </button>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Rewritten Output</span>
        {output && (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-body">
        <textarea
          value={output}
          readOnly
          className="tb-v2-tool-textarea"
          style={{ minHeight: 150 }}
          aria-label="Rewritten article output"
        />
      </div>
    </div>
  );
}
