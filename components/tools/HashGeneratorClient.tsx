'use client';
import { useEffect, useState } from 'react';
import { digest } from '@/lib/developer-security/primitives';
import DeveloperSecurityFrame, { useSecurityTask } from './DeveloperSecurityFrame';

export default function HashGeneratorClient({ fixedAlgorithm }: { fixedAlgorithm?: string } = {}) {
  const [input,setInput]=useState(''), [algo,setAlgo]=useState(fixedAlgorithm || 'SHA-256');
  const [output,setOutput]=useState(''), [error,setError]=useState(''), [busy,setBusy]=useState(false);
  const [uppercase,setUppercase]=useState(false), [active,setActive]=useState(false), [copied,setCopied]=useState(false);
  const task=useSecurityTask();
  useEffect(()=>{if(!fixedAlgorithm){const slug=window.location.pathname.split('/').pop();if(slug==='md5-hash-generator')setAlgo('MD5');if(slug==='sha1-hash-generator')setAlgo('SHA-1');}},[fixedAlgorithm]);
  useEffect(()=>{
    const id=++task.current;setOutput('');setError('');setCopied(false);
    if(!active){setBusy(false);return;}
    setBusy(true);digest(algo,input).then(h=>{if(id===task.current)setOutput(h);}).catch(e=>{if(id===task.current)setError(String(e.message));}).finally(()=>{if(id===task.current)setBusy(false);});
    return ()=>{task.current++;};
  },[input,algo,active,task]);
  const clear=()=>{task.current++;setInput('');setOutput('');setError('');setBusy(false);setActive(false);setCopied(false);};
  const result=uppercase?output.toUpperCase():output;
  return <DeveloperSecurityFrame onExample={()=>{setInput('abc');setActive(true);}} onClear={clear}>
    <label className="tb-v2-tool-label" htmlFor="security-hash-input">Input</label>
    <textarea id="security-hash-input" aria-label="Hash input" className="tb-v2-tool-textarea" value={input} maxLength={100000} onChange={e=>{setInput(e.target.value);setActive(true);}}/>
    {!fixedAlgorithm && <label>Algorithm<select aria-label="Algorithm" className="tb-v2-select" value={algo} onChange={e=>setAlgo(e.target.value)}>{['MD5','SHA-1','SHA-256','SHA-384','SHA-512'].map(a=><option key={a}>{a}</option>)}</select></label>}
    <button className="tb-v2-mode-tab" aria-pressed={uppercase} onClick={()=>setUppercase(!uppercase)}>UPPERCASE</button>
    <button className="tb-v2-btn tb-v2-btn-primary" onClick={()=>setActive(true)}>Generate Hash</button>
    <p className="tb-v2-hash-stats">UTF-8 input, including empty text. MD5 and SHA-1 are legacy checksums, unsuitable for collision-resistant security.</p>
    {busy && <p role="status">Computing…</p>}{error && <p role="alert" className="tb-v2-error">{error}</p>}
    <div className="tb-v2-tool-output-head">{algo} Hash<button className="tb-v2-copy-btn" disabled={!result||busy} onClick={async()=>{try{await navigator.clipboard.writeText(result);setCopied(true);}catch{setError('Clipboard access failed.');}}}>{copied?'Copied':'Copy'}</button></div>
    <div className="tb-v2-tool-output-body"><pre aria-label="Hash output">{result}</pre></div>
  </DeveloperSecurityFrame>;
}
