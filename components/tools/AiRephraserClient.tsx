'use client';

import { useState, useCallback } from 'react';

const SYNONYM_MAP: Record<string, string[]> = {
  'good': ['great', 'excellent', 'superb', 'wonderful', 'fantastic'],
  'bad': ['poor', 'terrible', 'awful', 'dreadful', 'horrible'],
  'big': ['large', 'huge', 'enormous', 'massive', 'gigantic'],
  'small': ['tiny', 'little', 'miniature', 'compact', 'petite'],
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
  'feel': ['sense', 'experience', 'perceive', 'undergo', 'detect'],
  'try': ['attempt', 'endeavor', 'strive', 'seek', 'essay'],
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
  'send': ['dispatch', 'transmit', 'forward', 'ship', 'convey'],
  'very': ['extremely', 'incredibly', 'highly', 'remarkably', 'particularly'],
  'just': ['simply', 'merely', 'only', 'plainly', 'but'],
  'really': ['truly', 'genuinely', 'certainly', 'indeed', 'absolutely'],
  'quickly': ['rapidly', 'swiftly', 'promptly', 'hastily', 'expeditiously'],
  'slowly': ['gradually', 'steadily', 'unhurriedly', 'leisurely', 'tardily'],
};

const EXAMPLE_TEXT = "I think this is a really good idea and it can help us make things work quickly. We just need to find a way to show the important parts.";

export default function AiRephraserClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [intensity, setIntensity] = useState<'light' | 'medium' | 'strong'>('medium');

  const loadExample = () => {
    setInput(EXAMPLE_TEXT);
    setOutput('');
  };

  const rephrase = useCallback(() => {
    if (!input.trim()) return;

    const words = input.split(/(\s+)/);
    const synonyms = SYNONYM_MAP;
    
    const result = words.map((word, idx) => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      const punctuation = word.match(/[^a-z]*$/)?.[0] || '';
      
      if (synonyms[cleanWord]) {
        const synonymList = synonyms[cleanWord];
        let synIdx = 0;
        
        if (intensity === 'light') {
          synIdx = Math.random() > 0.3 ? 0 : -1;
        } else if (intensity === 'medium') {
          synIdx = Math.floor(Math.random() * Math.min(2, synonymList.length));
        } else {
          synIdx = Math.floor(Math.random() * synonymList.length);
        }
        
        if (synIdx >= 0 && synIdx < synonymList.length) {
          const replacement = synonymList[synIdx];
          const capitalized = word[0] === word[0].toUpperCase();
          return (capitalized ? replacement[0].toUpperCase() + replacement.slice(1) : replacement) + punctuation;
        }
      }
      return word;
    }).join('');

    setOutput(result);
  }, [input, intensity]);

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to Rephrase</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => { setInput(e.target.value); setOutput(''); }}
        placeholder="Enter text you want to rephrase..."
        className="tb-v2-tool-textarea"
        rows={6}
        aria-label="Text input for rephrasing"
      />

      <div className="tb-v2-mode-tabs">
        {(['light', 'medium', 'strong'] as const).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setIntensity(level)}
            className={`tb-v2-mode-tab capitalize ${intensity === level ? 'on' : ''}`}
          >
            {level}
          </button>
        ))}
      </div>

      <button type="button" onClick={rephrase} disabled={!input.trim()} className="tb-v2-btn tb-v2-btn-primary">
        Rephrase Text
      </button>

      {!output && (
        <p className="tb-v2-empty">
          Enter text above and choose an intensity, then rephrase to swap common words for synonyms while keeping the meaning intact.
        </p>
      )}

      {output && (
        <div className="tb-v2-tool-output-body">
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Rephrased Output</span>
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="tb-v2-tool-pre">{output}</pre>
        </div>
      )}
    </div>
  );
}
