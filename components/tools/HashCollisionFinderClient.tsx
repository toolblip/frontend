'use client';
import { useSecurityTask } from './DeveloperSecurityFrame';
import DeveloperSecurityFrame from './DeveloperSecurityFrame';

import { useRef, useState } from 'react';

type Algo = 'SHA-1' | 'SHA-256';

const SAFETY_LIMIT = 100_000;
const BATCH_SIZE = 150;
const RANDOM_STR_LEN = 10;
const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function randomString(len: number): string {
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  let out = '';
  for (let i = 0; i < len; i++) out += CHARS[arr[i] % CHARS.length];
  return out;
}

async function hashHex(algo: Algo, text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

interface CollisionResult {
  strA: string;
  strB: string;
  hashA: string;
  hashB: string;
  prefix: string;
}

function HashWithHighlight({ hash, prefixLen }: { hash: string; prefixLen: number }) {
  return (
    <code className="tb-v2-hash-val">
      <span style={{ background: 'color-mix(in srgb, #22c55e 30%, transparent)', borderRadius: 3 }}>
        {hash.slice(0, prefixLen)}
      </span>
      {hash.slice(prefixLen)}
    </code>
  );
}

export default function HashCollisionFinderClient() {
  const [algorithm, setAlgorithm] = useState<Algo>('SHA-256');
  const [prefixLen, setPrefixLen] = useState(4);
  const [running, setRunning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<CollisionResult | null>(null);
  const [capped, setCapped] = useState(false);

  const task=useSecurityTask();
  const [error,setError]=useState('');
  const stopSearch=()=>{task.current++;setRunning(false);};
  const resetSearch=()=>{stopSearch();setAttempts(0);setResult(null);setCapped(false);setError('');};
  const startSearch=async()=>{
    resetSearch();const id=task.current;setRunning(true);
    const seen=new Map<string,{str:string;hash:string}>();
    try{
      for(let n=1;n<=SAFETY_LIMIT;n++){
        if(id!==task.current)return;
        const str=randomString(RANDOM_STR_LEN),hash=await hashHex(algorithm,str);
        if(id!==task.current)return;
        const prefix=hash.slice(0,prefixLen),previous=seen.get(prefix);
        if(previous && previous.str!==str){setAttempts(n);setResult({strA:previous.str,strB:str,hashA:previous.hash,hashB:hash,prefix});return;}
        seen.set(prefix,{str,hash});
        if(n%BATCH_SIZE===0){setAttempts(n);await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));}
      }
      setCapped(true);
    }catch(e){if(id===task.current)setError((e as Error).message);}
    finally{if(id===task.current)setRunning(false);}
  };

  const bits = prefixLen * 4;

  return (
    <DeveloperSecurityFrame onExample={()=>{resetSearch();setPrefixLen(2);setAlgorithm('SHA-256');}} onClear={()=>{resetSearch();}}>
    <div>
      {error&&<p role="alert" className="tb-v2-error">{error}</p>}
      <div className="tb-v2-banner tb-v2-banner-info" style={{ marginBottom: 14, lineHeight: 1.5 }}>
        This birthday-paradox demonstration finds matching <strong>truncated hash prefixes</strong>.
        It does not search for full-length collisions or break SHA-256. SHA-1 and MD5 have known
        collision weaknesses and should not be used where collision resistance is required.
      </div>

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Settings</span>
      </div>

      <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 14 }}>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Algorithm
          </label>
          <select aria-label="Algorithm"
            value={algorithm}
            onChange={e => {resetSearch();setAlgorithm(e.target.value as Algo);}}
            disabled={running}
            className="tb-v2-input"
          >
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-1">SHA-1</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Prefix length: {prefixLen} hex chars ({bits} bits)
          </label>
          <select aria-label="Prefix length"
            value={prefixLen}
            onChange={e => {resetSearch();setPrefixLen(Number(e.target.value));}}
            disabled={running}
            className="tb-v2-input"
          >
            {[2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>{n} hex chars ({n * 4} bits)</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400" style={{ marginBottom: 14 }}>
        MD5 is not offered — the browser&apos;s Web Crypto API (<code>crypto.subtle.digest</code>) does
        not support it. Only algorithms it genuinely supports (SHA-1, SHA-256) are used here.
      </p>

      <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
        {!running ? (
          <button
            type="button"
            onClick={startSearch}
            className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
          >
            Find Collision
          </button>
        ) : (
          <button
            type="button"
            onClick={stopSearch}
            className="tb-v2-btn tb-v2-btn-lg"
          >
            Stop
          </button>
        )}
        {running && (
          <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="tb-v2-live-dot" />
            Searching… {attempts.toLocaleString()} attempts
          </span>
        )}
        {!running && attempts > 0 && !result && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {attempts.toLocaleString()} attempts so far
          </span>
        )}
      </div>

      {capped && !result && (
        <div className="tb-v2-banner tb-v2-banner-warn" style={{ marginBottom: 14 }}>
          No collision found after {SAFETY_LIMIT.toLocaleString()} attempts — try a shorter prefix
          length.
        </div>
      )}

      {result && (
        <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="tb-v2-tool-output-head" style={{ padding: 0, marginBottom: 4 }}>
            <span className="tb-v2-tool-label">
              Collision found after {attempts.toLocaleString()} attempts
              (matching {prefixLen}-hex-char / {bits}-bit prefix)
            </span>
          </div>

          <div className="tb-v2-hash-row">
            <span className="tb-v2-hash-algo">Input A</span>
            <code className="tb-v2-hash-val">{result.strA}</code>
          </div>
          <div className="tb-v2-hash-row">
            <span className="tb-v2-hash-algo">{algorithm}</span>
            <HashWithHighlight hash={result.hashA} prefixLen={prefixLen} />
          </div>

          <div className="tb-v2-hash-row">
            <span className="tb-v2-hash-algo">Input B</span>
            <code className="tb-v2-hash-val">{result.strB}</code>
          </div>
          <div className="tb-v2-hash-row">
            <span className="tb-v2-hash-algo">{algorithm}</span>
            <HashWithHighlight hash={result.hashB} prefixLen={prefixLen} />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400" style={{ marginTop: 4 }}>
            Two different inputs above share the same first {prefixLen} hex characters
            (highlighted) of their real {algorithm} hash. {result.hashA === result.hashB ? 'The full digests also match.' : 'Their full digests differ.'}
            That is the whole trick: it only gets easy because we only compare a truncated slice,
            not the full {algorithm === 'SHA-1' ? '160-bit' : '256-bit'} digest.
          </p>
        </div>
      )}
    </div>
    </DeveloperSecurityFrame>
  );
}
