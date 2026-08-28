'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const PUNCTUATION_EXAMPLE = 'This  is  messy . She waited here ! Then she left .';

export default function PunctuationFixerClient() {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState<'smart' | 'straight'>('smart');
  const [output, setOutput] = useState('');

  const process = (text = input) => {
    if (!text) { setOutput(''); return; }
    let result = text;

    if (style === 'smart') {
      result = result.replace(/\u0022/g, '\u201C').replace(/\u0022/g, '\u201D'); // straight " -> curly "
      result = result.replace(/\u0027/g, '\u2018').replace(/\u0027/g, '\u2019'); // straight ' -> curly '
    } else {
      result = result.replace(/\u201C|\u201D/g, '"').replace(/\u2018|\u2019/g, "'");
    }

    // Fix common issues
    result = result.replace(/([a-z])\s+([.!?,:;])/gi, '$1$2'); // space before punctuation
    result = result.replace(/\s+/g, ' ').trim(); // multiple spaces

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
