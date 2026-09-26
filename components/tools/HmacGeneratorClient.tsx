'use client';
import {useEffect,useState} from 'react';
import {bytesBase64,hex} from '@/lib/developer-security/primitives';
import DeveloperSecurityFrame,{useSecurityTask} from './DeveloperSecurityFrame';
export default function HmacGeneratorClient(){
 const [secret,setSecret]=useState(''),[message,setMessage]=useState(''),[algorithm,setAlgorithm]=useState('SHA-256'),[format,setFormat]=useState('hex');
 const [result,setResult]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);const task=useSecurityTask();
 useEffect(()=>{const id=++task.current;setResult('');setError('');setBusy(false);if(!secret)return;setBusy(true);
 (async()=>{try{const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:algorithm},false,['sign']);const b=new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(message)));if(id===task.current)setResult(format==='hex'?hex(b):bytesBase64(b));}catch(e){if(id===task.current)setError((e as Error).message);}finally{if(id===task.current)setBusy(false);}})();return()=>{task.current++;};},[secret,message,algorithm,format,task]);
 return <DeveloperSecurityFrame onExample={()=>{setSecret('key');setMessage('The quick brown fox jumps over the lazy dog');}} onClear={()=>{task.current++;setSecret('');setMessage('');setResult('');setError('');setBusy(false);}}>
 <label>Secret Key<input aria-label="Secret Key" className="tb-v2-input" value={secret} maxLength={100000} onChange={e=>setSecret(e.target.value)}/></label>
 <label>Message<textarea aria-label="Message" className="tb-v2-tool-textarea" value={message} maxLength={100000} onChange={e=>setMessage(e.target.value)}/></label>
 <label>Hash Algorithm<select aria-label="Hash Algorithm" className="tb-v2-select" value={algorithm} onChange={e=>setAlgorithm(e.target.value)}>{['SHA-1','SHA-256','SHA-384','SHA-512'].map(a=><option key={a}>{a}</option>)}</select></label>
 <label>Output Format<select aria-label="Output Format" className="tb-v2-select" value={format} onChange={e=>setFormat(e.target.value)}><option value="hex">Hexadecimal</option><option value="base64">Base64</option></select></label>
 {busy&&<p role="status">Computing…</p>}{error&&<p role="alert" className="tb-v2-error">{error}</p>}
 <div className="tb-v2-tool-output-body"><pre aria-label="HMAC output">{result}</pre><button className="tb-v2-copy-btn" disabled={!result||busy} onClick={async()=>{try{await navigator.clipboard.writeText(result);}catch{setError('Clipboard access failed.');}}}>Copy</button></div>
 <p>Messages use UTF-8, including empty messages. Enter a nonempty shared secret. HMAC authenticates possession of that secret.</p>
 </DeveloperSecurityFrame>;
}
