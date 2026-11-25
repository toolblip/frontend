'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';
import { toSmartQuotes, toStraightQuotes } from '@/lib/smart-quotes';
import { fixSpacing } from '@/lib/punctuation-spacing';

const PUNCTUATION_EXAMPLE = 'This  is  messy . She waited here ! Then she left .';

export default function PunctuationFixerClient() {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState<'smart' | 'straight'>('smart');
  const [output, setOutput] = useState('');

  const process = (text = input) => {
    if (!text) { setOutput(''); return; }
    let result = text;

    result = style === 'smart' ? toSmartQuotes(result) : toStraightQuotes(result);

    // Fix common issues
    result = fixSpacing(result);

    setOutput(result);
  };

  const loadExample = () => {
    setInput(PUNCTUATION_EXAMPLE);
    process(PUNCTUATION_EXAMPLE);
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div className="tb-v2-mode-tabs">
        <button onClick={() => setStyle('smart')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${style === 'smart' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>Smart Quotes</button>
        <button onClick={() => setStyle('straight')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${style === 'straight' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>Straight Quotes</button>
      </div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <ToolExampleClearActions
          onExample={loadExample}
          onClear={() => { setInput(''); setOutput(''); }}
          canClear={input.length > 0}
        />
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} rows={5} placeholder="Paste text with extra spaces or a gap before punctuation…" className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-y" />
      <button type="button" onClick={() => process()} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">Fix Punctuation</button>
      {output && <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"><pre className="text-sm whitespace-pre-wrap">{output}</pre></div>}
    </div>
  );
}
