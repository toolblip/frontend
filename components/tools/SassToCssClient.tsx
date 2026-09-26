'use client';
import { useEffect, useRef, useState } from 'react';
import { browserWorkerURLs } from '../../lib/generated/browser-worker-urls';
import ToolExampleClearActions from './ToolExampleClearActions';
import UtilityDesignLayout from './UtilityDesignLayout';
export default function SassToCssClient() {
  const [input,setInput]=useState(''),[output,setOutput]=useState(''),[error,setError]=useState(''),[loading,setLoading]=useState(false);
  const [syntax,setSyntax]=useState<'scss'|'indented'>('scss');
  const worker=useRef<Worker|null>(null),generation=useRef(0);
  const cancel=()=>{generation.current++;worker.current?.terminate();worker.current=null;setLoading(false);};
  const clear=()=>{cancel();setInput('');setOutput('');setError('');};
  useEffect(()=>()=>{worker.current?.terminate();},[]);
  const compile=()=>{
    cancel();setOutput('');setError('');if(!input.trim())return;
    if(input.length>10000){setError('Limit Sass to 10000 characters.');return;}
    const id=generation.current;setLoading(true);
    try {
      const w=new Worker(browserWorkerURLs.sass);worker.current=w;
      const timer=setTimeout(()=>{if(id===generation.current){w.terminate();setLoading(false);setError('Compilation exceeded 8 seconds. Simplify loops and retry.');}},8000);
      w.onmessage=e=>{clearTimeout(timer);w.terminate();if(id!==generation.current)return;setLoading(false);setOutput(e.data.output||'');setError(e.data.error||'');};
      w.onerror=()=>{clearTimeout(timer);w.terminate();if(id===generation.current){setLoading(false);setError('Sass compiler could not load in this browser.');}};
      w.postMessage({input,syntax});
    } catch(e){setLoading(false);setError((e as Error).message);}
  };
  return <UtilityDesignLayout><div style={{ padding: 16, display: 'grid', gap: 12 }}>
    <ToolExampleClearActions onExample={()=>{clear();setSyntax('scss');setInput('$color: red;\n.card { color: $color; }');}} onClear={clear}/>
    <label>Syntax<select aria-label="Syntax" className="tb-v2-input" value={syntax} onChange={e=>{cancel();setOutput('');setError('');setSyntax(e.target.value as typeof syntax);}}><option value="scss">SCSS</option><option value="indented">Indented Sass</option></select></label>
    <textarea aria-label="SASS/SCSS input" maxLength={10000} className="tb-v2-tool-textarea" value={input} onChange={e=>{cancel();setOutput('');setError('');setInput(e.target.value);}}/>
    <button style={{ justifySelf: 'start' }} className="tb-v2-btn tb-v2-btn-primary" disabled={loading||!input.trim()} onClick={compile}>Compile</button>
    {loading&&<p role="status">Compiling…</p>}{error&&<p role="alert">{error}</p>}
    <pre className="tb-v2-tool-output-body">{output||'-'}</pre>
    {output&&<button className="tb-v2-copy-btn" onClick={()=>navigator.clipboard.writeText(output).catch(()=>setError('Clipboard unavailable. Select the output to copy.'))}>Copy</button>}
  </div></UtilityDesignLayout>;
}
