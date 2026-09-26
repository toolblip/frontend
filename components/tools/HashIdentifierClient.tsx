'use client';
import DeveloperSecurityFrame from './DeveloperSecurityFrame';

import { useState } from 'react';

interface HashInfo {
  type: string;
  length: number;
  description: string;
}

export default function HashIdentifierClient() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<HashInfo | null>(null);

  const identify = (hash: string) => {
    const cleanHash = hash.trim();

    if (!cleanHash) {
      setResult(null);
      return;
    }

    const info: HashInfo = {
      type: 'Unknown',
      length: cleanHash.length,
      description: ''
    };

    const lengths:Record<number,string>={32:'MD5 / MD4 / NTLM or another 128-bit digest',40:'SHA-1 or another 160-bit digest',56:'SHA-224 / SHA-512/224',64:'SHA-256 / SHA3-256 or another 256-bit digest',96:'SHA-384 / SHA3-384',128:'SHA-512 / SHA3-512'};
    if(/^[a-f0-9]+$/i.test(cleanHash) && lengths[cleanHash.length]) {
      info.type=lengths[cleanHash.length];info.description='Possible formats based on hexadecimal length. The algorithm cannot be proven from a digest alone.';
    } else if(/^\$2[aby]\$(?:0[4-9]|[12][0-9]|3[01])\$[./A-Za-z0-9]{53}$/.test(cleanHash)) {
      info.type='Bcrypt';info.description='Recognized bcrypt format; this does not verify a password.';
    } else if(/^\$argon2(?:id|i|d)\$v=\d+\$m=\d+,t=\d+,p=\d+\$[A-Za-z0-9+/]+\$[A-Za-z0-9+/]+$/.test(cleanHash)) {
      info.type='Argon2';info.description='Recognized Argon2 PHC-style format.';
    } else if(/^\$pbkdf2[-$]/i.test(cleanHash)) {
      info.type='Possible PBKDF2';info.description='Prefix-based candidate; PBKDF2 storage formats vary.';
    } else { info.description='No recognized format. Check the input; arbitrary text is not necessarily a hash.'; }

    setResult(info);
  };

  return (
    <DeveloperSecurityFrame onExample={()=>{setInput('900150983cd24fb0d6963f7d28e17f72');identify('900150983cd24fb0d6963f7d28e17f72');}} onClear={()=>{setInput('');setResult(null);}}>
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="tb-v2-tool-label" style={{marginBottom:8}}>
          Hash Input
        </label>
        <input aria-label="Input" maxLength={100000}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            identify(e.target.value);
          }}
          placeholder="Enter hash to identify (e.g., 5f4dcc3b5aa765d61d8327deb882cf99)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      {result && (
        <div className="flex-1 space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="tb-v2-grid-2">
              <div>
                <span className="text-sm text-gray-600">Possible Type:</span>
                <p className="font-semibold text-lg">{result.type}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Hash Length:</span>
                <p className="font-semibold text-lg">{result.length} characters</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="tb-v2-tool-label" style={{marginBottom:8}}>Description</h3>
            <p className="text-sm text-gray-600">{result.description}</p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This tool provides educated guesses based on hash characteristics.
              For definitive identification, consult cryptographic documentation or use specialized tools.
            </p>
          </div>
        </div>
      )}

      {!result && input && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Enter a hash to identify its type</p>
        </div>
      )}
    </div>
    </DeveloperSecurityFrame>
  );
}
