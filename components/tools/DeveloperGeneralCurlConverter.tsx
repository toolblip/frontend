'use client';
import DeveloperGeneralFrame from './DeveloperGeneralFrame';
import { useMemo, useState } from 'react';
import { convertCurl } from '@/lib/developer-general/curl';
import ToolExampleClearActions from './ToolExampleClearActions';
const EXAMPLE = `curl 'https://example.com/users' -H 'Content-Type: application/json' --data-raw '{"name":"Ada","active":true}'`;
export default function DeveloperGeneralCurlConverter({ language }: { language: 'python' | 'javascript' }) {
 const [input, setInput] = useState(''); const [copyError, setCopyError] = useState('');
 const result = useMemo(() => { try {return {output:convertCurl(input, language), error:''};} catch(e) {return {output:'',error:(e as Error).message};} }, [input,language]);
 return <DeveloperGeneralFrame><div style={{minWidth:0}}><div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">cURL command</span><ToolExampleClearActions onExample={() => {setInput(EXAMPLE);setCopyError('');}} onClear={() => {setInput('');setCopyError('');}} /></div>
 <textarea aria-label="cURL command" maxLength={100000} value={input} onChange={e=>{setInput(e.target.value);setCopyError('');}} className="tb-v2-tool-textarea" />
 <p>Supports URL, request method, headers and inline data. Unsupported options produce an error. No request is sent.</p>
 {(result.error || copyError) && <p role="alert" className="tb-v2-error">{result.error || copyError}</p>}
 <div className="tb-v2-tool-output-head"><span>{language === 'python' ? 'Python requests' : 'JavaScript fetch'}</span><button className="tb-v2-copy-btn" disabled={!result.output} onClick={()=>navigator.clipboard.writeText(result.output).catch(()=>setCopyError('Clipboard unavailable'))}>Copy</button></div>
 <pre className="tb-v2-tool-pre" style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{result.output}</pre></div></DeveloperGeneralFrame>;
}
