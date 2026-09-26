'use client';
import DeveloperGeneralFrame from './DeveloperGeneralFrame';
import { useEffect, useRef, useState } from 'react';
import ToolExampleClearActions from './ToolExampleClearActions';
import { httpUrl } from '@/lib/developer-general/network';
type Result={status:number;statusText:string;url:string;redirected:boolean;headers:Record<string,string>;ms:number};
export default function DeveloperGeneralHttpInspector({mode}:{mode:'status'|'headers'|'redirect'}){
 const [url,setUrl]=useState(''),[method,setMethod]=useState('GET'),[result,setResult]=useState<Result|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(false);
 const [history,setHistory]=useState<Result[]>([]);
 const pending=useRef<AbortController|null>(null);
 const cancel=()=>{pending.current?.abort();pending.current=null;setLoading(false);};
 const reset=(value:string)=>{cancel();setUrl(value);setResult(null);setError('');};
 useEffect(()=>()=>pending.current?.abort(),[]);
 const inspect=async()=>{
  cancel();setError('');setResult(null);let target:string;try{target=httpUrl(url);}catch(e){setError((e as Error).message);return;}
  const controller=new AbortController();pending.current=controller;setLoading(true);const timer=setTimeout(()=>controller.abort(),10000),start=performance.now();
  try{const response=await fetch(target,{method,signal:controller.signal,redirect:'follow',credentials:'omit',cache:'no-store'});
   if(response.type==='opaque'||response.status===0)throw new Error('The browser did not expose the response.');
   const data={status:response.status,statusText:response.statusText,url:response.url,redirected:response.redirected,headers:Object.fromEntries(response.headers.entries()),ms:Math.round(performance.now()-start)};
   await response.body?.cancel();if(pending.current===controller){setResult(data);setHistory(h=>[data,...h].slice(0,10));}
  }catch(e){if(pending.current===controller)setError(controller.signal.aborted?'Request timed out after 10 seconds.':`Request failed: ${(e as Error).message}. The server may not allow browser CORS requests.`);}
  finally{clearTimeout(timer);if(pending.current===controller){pending.current=null;setLoading(false);}}
 };
 return <DeveloperGeneralFrame><div style={{minWidth:0,overflowWrap:'anywhere'}}><div className="tb-v2-tool-input-head"><span>HTTP {mode}</span><ToolExampleClearActions onExample={()=>reset('https://httpbin.org/get')} onClear={()=>{reset('');setHistory([]);}}/></div>
 <label>URL<input aria-label="URL" maxLength={8000} className="tb-v2-input" value={url} onChange={e=>reset(e.target.value)}/></label><label>Method<select aria-label="Method" value={method} onChange={e=>{cancel();setMethod(e.target.value);setResult(null);setError('');}} className="tb-v2-input">{['GET','HEAD','OPTIONS','POST'].map(m=><option key={m}>{m}</option>)}</select></label>
 <button className="tb-v2-btn" onClick={inspect} disabled={loading}>{loading?'Checking…':'Inspect'}</button>{loading&&<button className="tb-v2-btn" onClick={()=>{cancel();setError('Request cancelled.');}}>Cancel</button>}
 <p>Only response data exposed by the browser is available. Cross-origin servers must allow CORS.{mode==='redirect'?' The browser exposes the final URL and whether a redirect occurred, but hides intermediate hops and their status codes.':''}</p>
 {error&&<p role="alert" className="tb-v2-error">{error}</p>}{result&&<div className="tb-v2-tool-output-body"><p data-testid="http-status">HTTP {result.status} {result.statusText}</p><p>Final URL: <code>{result.url}</code></p><p>Redirected: {result.redirected?'Yes':'No'}</p><p>Elapsed to response headers: {result.ms} ms</p><pre className="tb-v2-tool-pre" style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify(result.headers,null,2)}</pre></div>}{history.length>0&&<details><summary>Recent responses</summary>{history.map((item,i)=><button className="tb-v2-btn" key={i} onClick={()=>{cancel();setError('');setResult(item);setUrl(item.url);}}>{item.status} {item.url}</button>)}</details>}</div></DeveloperGeneralFrame>;
}
