'use client';
import { copySecurityText, MAX_TEXT, MAX_BASE64_INPUT } from '@/lib/developer-security/primitives';
import DeveloperSecurityFrame, { useSecurityTask } from './DeveloperSecurityFrame';
import { encodeBase64 as base64Encode, decodeBase64 as base64Decode } from '@/lib/developer-security/primitives';

import { useState, useCallback, useEffect } from 'react';
import ToolContextControls from '@/components/tools/ToolContextControls';
import { useToolContext } from '@/components/tools/useToolContext';

type Mode = 'encode' | 'decode';

type Base64Context = { mode: Mode };

const EXAMPLES = [
  { label: 'Hello World', data: 'Hello, World!' },
  { label: 'JSON Object', data: '{"name": "John", "age": 30}' },
  { label: 'URL', data: 'https://toolblip.com/tools/base64-encoder-decoder' },
  { label: 'Email', data: 'user@example.com' },
];

export default function Base64EncoderDecoderClient() {
  const [clipboardError,setClipboardError]=useState('');
  const clipboardTask=useSecurityTask();
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const toolContext = useToolContext<Base64Context>('base64-encoder-decoder');

  const process = useCallback(() => {
    setError('');
    setOutput('');
    if (!input) return;
    try {
      setOutput(mode === 'encode' ? base64Encode(input) : base64Decode(input));
    } catch (e) {
      setError(mode === 'encode' ? 'Failed to encode.' : 'Invalid Base64 string - cannot decode.');
      setOutput('');
    }
  }, [input, mode]);

  useEffect(() => { process(); }, [process]);

  const copy = useCallback((text: string) => {
    const copyId=++clipboardTask.current;setClipboardError('');
    copySecurityText(text).then(()=>{if(copyId!==clipboardTask.current)return;setCopied(true);}).catch(()=>{if(copyId===clipboardTask.current)setClipboardError('Clipboard access failed. Select and copy the output manually.');});
    setTimeout(() => setCopied(false), 1500);
  }, []);

  const swap = useCallback(() => {
    setInput(output);
    setOutput('');
    setError('');
    setMode(mode === 'encode' ? 'decode' : 'encode');
  }, [output, mode]);

  const loadExample = (data: string) => {
    setInput(data);
    setOutput('');
    setError('');
    setShowExamples(false);
  };

  return (
    <DeveloperSecurityFrame onExample={()=>{clipboardTask.current++;setMode('encode');loadExample('é😀');}} onClear={()=>{clipboardTask.current++;setClipboardError('');setInput('');setOutput('');setError('');setCopied(false);setShowExamples(false);}}>
    {clipboardError&&<p role="alert" className="tb-v2-error">{clipboardError}</p>}
    <div>
      <ToolContextControls
        isPaid={toolContext.isPaid}
        hasSaved={toolContext.hasSaved}
        description="encoding mode"
        onSave={() => toolContext.save({ mode })}
        onClear={toolContext.clear}
      />

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
          >
            More examples
          </button>
          <div className="tb-v2-mode-tabs" role="tablist">
            {(['encode', 'decode'] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => { setMode(m); setOutput(''); setError(''); }}
                className={`tb-v2-mode-tab ${mode === m ? 'on' : ''}`}
              >
                {m === 'encode' ? 'Encode' : 'Decode'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showExamples && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Load an example:</div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => loadExample(ex.data)}
                className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <textarea aria-label="Input" maxLength={mode === 'encode' ? MAX_TEXT : MAX_BASE64_INPUT}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter text to Base64 encode...' : 'Enter Base64 string to decode...'}
        className="tb-v2-tool-textarea"
        rows={4}
      />

      <button
        onClick={process}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg w-full"
      >
        {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
      </button>

      {error && (
        <div role="alert" className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {output && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Output</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={swap}
                className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
              >
                ↕ Swap
              </button>
              <button
                onClick={() => copy(output)}
                className="tb-v2-copy-btn"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre break-all">{output}</pre>
          </div>
        </>
      )}

      {!input && !output && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🔐</div>
          <p>{mode === 'encode' ? 'Enter text to encode to Base64' : 'Enter Base64 string to decode'}</p>
        </div>
      )}
    </div>
    </DeveloperSecurityFrame>
  );
}
