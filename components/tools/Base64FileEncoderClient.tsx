'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import { useEffect, useRef, useState } from 'react';
import ToolExampleClearActions from './ToolExampleClearActions';
import { saveBlob } from '@/lib/utility-design/core';
export default function Base64FileEncoderClient() {
  const [mode, setMode] = useState<'encode'|'decode'>('encode');
  const [input, setInput] = useState(''), [output, setOutput] = useState(''), [error, setError] = useState('');
  const [busy, setBusy] = useState(false), [decoded, setDecoded] = useState<Blob|null>(null);
  const generation = useRef(0), reader = useRef<FileReader|null>(null), fileRef = useRef<HTMLInputElement>(null);
  const clear = () => { generation.current++; reader.current?.abort(); setInput(''); setOutput(''); setError(''); setBusy(false); setDecoded(null); if(fileRef.current) fileRef.current.value=''; };
  useEffect(() => () => { generation.current++; reader.current?.abort(); }, []);
  const encode = (file: File) => {
    clear(); if(file.size > 10 * 1024 * 1024) { setError('Maximum file size is 10 MiB.'); return; }
    const id = generation.current, r = new FileReader(); reader.current = r; setBusy(true);
    const timer = setTimeout(() => { if(id === generation.current) { r.abort(); setBusy(false); setError('File read timed out.'); } }, 15000);
    r.onload = () => { if(id === generation.current) { setOutput(String(r.result).split(',')[1]); setBusy(false); } };
    r.onerror = () => { if(id === generation.current) { setError('Could not read file.'); setBusy(false); } };
    r.onloadend = () => clearTimeout(timer); r.readAsDataURL(file);
  };
  const decode = (raw: string) => {
    setInput(raw); setDecoded(null); setOutput(''); setError(''); if(!raw.trim()) return;
    try {
      if(raw.length > 14 * 1024 * 1024) throw new Error('Maximum encoded text size is 14 MiB.');
      const data = raw.replace(/^data:[^,]*;base64,/, '').replace(/\s/g, '');
      if(!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(data)) throw new Error('Enter valid padded Base64.');
      const bytes = Uint8Array.from(atob(data), c => c.charCodeAt(0));
      const blob = new Blob([bytes], {type:'application/octet-stream'}); setDecoded(blob); setOutput(`Decoded ${bytes.length} bytes`);
    } catch(e) { setError((e as Error).message); }
  };
  return <UtilityDesignLayout><div className="tb-v2-section">
    <ToolExampleClearActions onExample={() => { clear(); if(mode === 'encode') encode(new File(['Hello, world!\n'], 'hello.txt')); else decode('SGVsbG8sIHdvcmxkIQo='); }} onClear={clear}/>
    <div className="tb-v2-mode-tabs">{(['encode','decode'] as const).map(m => <button key={m} className={`tb-v2-mode-tab ${mode===m?'on':''}`} onClick={() => { clear(); setMode(m); }}>{m === 'encode'?'Encode':'Decode'}</button>)}</div>
    {mode==='encode' ? <label>File (up to 10 MiB)<input ref={fileRef} aria-label="File" type="file" onChange={e => { const f=e.target.files?.[0]; if(f) encode(f); }}/></label> : <label>Base64 input<textarea aria-label="Base64 input" maxLength={14*1024*1024} className="tb-v2-tool-textarea" value={input} onChange={e=>decode(e.target.value)}/></label>}
    {busy && <p role="status">Reading file…</p>}{error && <p role="alert">{error}</p>}
    {output && <><pre className="tb-v2-tool-output-body" style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{output}</pre>{decoded ? <button className="tb-v2-btn" onClick={()=>saveBlob(decoded,'decoded-file.bin')}>Download decoded file</button> : <button className="tb-v2-btn" onClick={()=>navigator.clipboard.writeText(output).catch(()=>setError('Clipboard unavailable. Select and copy the output.'))}>Copy Base64</button>}</>}
  </div></UtilityDesignLayout>;
}
