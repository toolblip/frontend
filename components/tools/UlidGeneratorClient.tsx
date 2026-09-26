'use client';
import { copySecurityText } from '@/lib/developer-security/primitives';
import DeveloperSecurityFrame, { useSecurityTask } from './DeveloperSecurityFrame';

import { useState, useCallback, useEffect } from 'react';

import { ulid as generateUlid } from '@/lib/developer-security/primitives';

export default function UlidGeneratorClient() {
  const [clipboardError,setClipboardError]=useState('');
  const clipboardTask=useSecurityTask();
  const [ulids, setUlids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(true);
  const [copied, setCopied] = useState<number | null>(null);

  const [error,setError]=useState('');
  const generate = useCallback(() => {
    try {setError('');
    const newUlids: string[] = [];
    for (let i = 0; i < count; i++) {
      let ulid = generateUlid();
      if (uppercase) ulid = ulid.toUpperCase();
      else ulid = ulid.toLowerCase();
      newUlids.push(ulid);
    }
    setUlids(newUlids);
    }catch(e){setUlids([]);setError((e as Error).message);}
  }, [count, uppercase]);

  // Generate initial ULIDs in useEffect to avoid hydration mismatch
  useEffect(() => {
    generate();
  }, [generate]);

  const copyToClipboard = (ulid: string, index: number) => {
    const copyId=++clipboardTask.current;setClipboardError('');
    copySecurityText(ulid).then(()=>{if(copyId!==clipboardTask.current)return;setCopied(index);}).catch(()=>{if(copyId===clipboardTask.current)setClipboardError('Clipboard access failed. Select and copy the output manually.');});
    setTimeout(() => setCopied(null), 1500);
  };

  const copyAll = () => {
    const copyId=++clipboardTask.current;setClipboardError('');
    copySecurityText(ulids.join('\n')).then(()=>{if(copyId!==clipboardTask.current)return;setCopied(-1);}).catch(()=>{if(copyId===clipboardTask.current)setClipboardError('Clipboard access failed. Select and copy the output manually.');});
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <DeveloperSecurityFrame onExample={()=>{clipboardTask.current++;generate();}} onClear={()=>{clipboardTask.current++;setClipboardError('');setError('');setUlids([]);setCopied(null);}}>
    {clipboardError&&<p role="alert" className="tb-v2-error">{clipboardError}</p>}
    {error&&<p role="alert" className="tb-v2-error">{error}</p>}
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Number of ULIDs</label>
          <input aria-label="Count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input aria-label="Uppercase"
            type="checkbox"
            id="uppercase"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="uppercase" className="text-sm">UPPERCASE</label>
        </div>

        <button
          onClick={generate}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate ULID
        </button>
      </div>

      {ulids.length > 0 && (
        <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Generated ULIDs</h3>
            <button
              onClick={copyAll}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {copied === -1 ? 'Copied!' : 'Copy All'}
            </button>
          </div>

          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre">
              {ulids.map((ulid, i) => (
                <div key={i} className="flex gap-4 items-center group">
                  <span className="text-gray-500 select-none w-6">{i + 1}.</span>
                  <span className="flex-1">{ulid}</span>
                  <button
                    onClick={() => copyToClipboard(ulid, i)}
                    className="text-xs text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copied === i ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ))}
            </pre>
          </div>
        </div>
      )}

      <div className="tb-v2-banner tb-v2-banner-info">
        <h4 className="font-medium  mb-2">About ULID</h4>
        <ul className="list-disc list-inside  space-y-1">
          <li>Universally Unique Lexicographically Sortable Identifier</li>
          <li>128-bit identifier compatible with UUID/GUID</li>
          <li>Sortable by creation time (like UUIDv1/v7) without exposing MAC address</li>
          <li>Uses Crockford's Base32 encoding (26 characters, no confusing chars)</li>
          <li>Random within the same millisecond; timestamp sorting does not imply monotonic ordering</li>
        </ul>
      </div>
    </div>
    </DeveloperSecurityFrame>
  );
}
