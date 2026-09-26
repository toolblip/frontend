'use client';
import DeveloperGeneralFrame from './DeveloperGeneralFrame';
import { useEffect, useRef, useState } from 'react';
import { transformJavaScript } from '@/lib/developer-general/esbuild-browser';
import ToolExampleClearActions from './ToolExampleClearActions';
export default function JsMinifierClient(){
 const [input,setInput]=useState(''),[output,setOutput]=useState(''),[error,setError]=useState(''),[loading,setLoading]=useState(false);const run=useRef(0);
 const reset=(value:string)=>{run.current++;setInput(value);setOutput('');setError('');setLoading(false);};
 useEffect(()=>()=>{run.current++;},[]);
 const minify=async()=>{const id=++run.current;setOutput('');setError('');setLoading(true);try{const code=await transformJavaScript(input,true);if(id===run.current)setOutput(code);}catch(e){if(id===run.current)setError((e as Error).message);}finally{if(id===run.current)setLoading(false);}};
 return <DeveloperGeneralFrame><div style={{minWidth:0}}><div className="tb-v2-tool-input-head"><span>JavaScript</span><ToolExampleClearActions onExample={()=>reset('function add(a, b) { return a + b; }')} onClear={()=>reset('')}/></div><textarea aria-label="JavaScript input" className="tb-v2-tool-textarea" maxLength={100000} value={input} onChange={e=>reset(e.target.value)}/><button className="tb-v2-btn" disabled={!input.trim()||loading} onClick={minify}>{loading?'Minifying…':'Minify'}</button>{error&&<p role="alert" className="tb-v2-error">{error}</p>}<div className="tb-v2-tool-output-head"><span>Minified JavaScript</span><button className="tb-v2-copy-btn" disabled={!output} onClick={()=>navigator.clipboard.writeText(output).catch(()=>setError('Clipboard unavailable'))}>Copy</button></div><pre className="tb-v2-tool-pre" style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{output}</pre>{output&&<p>{new TextEncoder().encode(input).length} input bytes; {new TextEncoder().encode(output).length} output bytes.</p>}</div></DeveloperGeneralFrame>;
}
