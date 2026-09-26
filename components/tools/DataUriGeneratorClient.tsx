'use client';
import { copySecurityText } from '@/lib/developer-security/primitives';
import { encodeBase64 } from '@/lib/developer-security/primitives';
import { useSecurityTask } from './DeveloperSecurityFrame';
import DeveloperSecurityFrame from './DeveloperSecurityFrame';

import { useState, useRef } from 'react';

const EXAMPLE_TEXT = 'Hello, world!';

function textToDataUri(text: string, mime: string): string {
  const base64 = encodeBase64(text);
  return `data:${mime};base64,${base64}`;
}

export default function DataUriGeneratorClient() {
  const [clipboardError,setClipboardError]=useState('');
  const clipboardTask=useSecurityTask();
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [text, setText] = useState(EXAMPLE_TEXT);
  const [mime, setMime] = useState('text/plain');
  const [file, setFile] = useState<File | null>(null);
  const [fileDataUri, setFileDataUri] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const output = mode === 'text' ? (text ? textToDataUri(text, mime) : '') : fileDataUri;
  const task=useSecurityTask();
  const readerRef=useRef<FileReader|null>(null);
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const clearFile=()=>{task.current++;readerRef.current?.abort();setFile(null);setFileDataUri('');setError('');setLoading(false);if(fileInputRef.current)fileInputRef.current.value='';};

  const loadFile = (selected: File | undefined) => {
    clearFile();if(!selected)return;
    if(selected.size>2*1024*1024){setError('File exceeds the 2 MiB limit.');return;}
    const id=task.current;setFile(selected);setLoading(true);
    const reader=new FileReader();readerRef.current=reader;
    reader.onload=()=>{if(id===task.current){setFileDataUri(String(reader.result||''));setLoading(false);}};
    reader.onerror=()=>{if(id===task.current){setError('Could not read this file.');setLoading(false);setFileDataUri('');}};
    reader.readAsDataURL(selected);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => loadFile(e.target.files?.[0]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const loadExample = () => {
    setMode('text');
    setText(EXAMPLE_TEXT);
    setMime('text/plain');
  };

  const copy = () => {
    if (!output) return;
    const copyId=++clipboardTask.current;setClipboardError('');
    copySecurityText(output).then(()=>{if(copyId!==clipboardTask.current)return;setCopied(true);}).catch(()=>{if(copyId===clipboardTask.current)setClipboardError('Clipboard access failed. Select and copy the output manually.');});
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <DeveloperSecurityFrame onExample={()=>{clipboardTask.current++;clearFile();loadExample();}} onClear={()=>{clipboardTask.current++;setClipboardError('');clearFile();setText('');setCopied(false);}}>
    {clipboardError&&<p role="alert" className="tb-v2-error">{clipboardError}</p>}
    <div className="flex flex-col gap-4">{error&&<p role="alert" className="tb-v2-error">{error}</p>}{loading&&<p role="status">Reading file…</p>}
      <div className="tb-v2-mode-tabs">
        <button type="button" className={`tb-v2-mode-tab ${mode === 'text' ? 'on' : ''}`} onClick={() => setMode('text')}>Text</button>
        <button type="button" className={`tb-v2-mode-tab ${mode === 'file' ? 'on' : ''}`} onClick={() => setMode('file')}>File</button>
      </div>

      {mode === 'text' ? (
        <>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Text</span>

          </div>
          <textarea aria-label="Text" maxLength={100000}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter text to encode..."
            className="tb-v2-tool-textarea"
            style={{ minHeight: 100, fontFamily: 'var(--f-mono)', fontSize: 13 }}
          />
          <div className="flex flex-col gap-1" style={{ padding: '0 20px 20px' }}>
            <label className="tb-v2-tool-label">MIME Type</label>
            <select aria-label="MIME Type" value={mime} onChange={e => setMime(e.target.value)} className="tb-v2-input" style={{ maxWidth: 280 }}>
              <option value="text/plain">text/plain</option>
              <option value="text/html">text/html</option>
              <option value="text/css">text/css</option>
              <option value="application/javascript">application/javascript</option>
              <option value="application/json">application/json</option>
              <option value="image/svg+xml">image/svg+xml</option>
            </select>
          </div>
        </>
      ) : (
        <>
          <div
            className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <span style={{ fontSize: 28 }}>📎</span>
            <span className="tb-v2-dropzone-text">Click or drag any file here (up to 2 MiB)</span>
            <span className="tb-v2-dropzone-hint">Encoded entirely in your browser, nothing is uploaded</span>
            <input aria-label="File" ref={fileInputRef} type="file" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>
          {file && (
            <p className="text-sm" style={{ color: 'var(--fg-2)' }}>{file.name} &middot; {file.type || 'unknown type'} &middot; {(file.size / 1024).toFixed(1)} KB</p>
          )}
          {file?.type.startsWith('image/') && fileDataUri && (
            <img src={fileDataUri} alt="Preview" style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8, border: '1px solid var(--line)' }} />
          )}
        </>
      )}

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Data URI</span>
        <button type="button" onClick={copy} disabled={!output} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {output ? (
          <pre className="tb-v2-tool-pre">{output}</pre>
        ) : (
          <p className="tb-v2-empty">{mode === 'text' ? 'Enter text above to generate a data URI.' : 'Upload a file above to generate a data URI.'}</p>
        )}
      </div>
    </div>
    </DeveloperSecurityFrame>
  );
}
