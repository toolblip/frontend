'use client';
import DeveloperSecurityFrame from './DeveloperSecurityFrame';
import { luhn } from '@/lib/developer-security/primitives';

import { useState } from 'react';

const TYPES = [
  { name: 'Visa', pattern: /^4(?:[0-9]{12}|[0-9]{15}|[0-9]{18})$/ },
  { name: 'Mastercard', pattern: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/ },
  { name: 'American Express', pattern: /^3[47][0-9]{13}$/ },
  { name: 'Discover', pattern: /^6(?:011|5[0-9]{2})[0-9]{12}$/ },
  { name: 'JCB', pattern: /^35(?:2[89]|[3-8][0-9])[0-9]{12,15}$/ },
];

export default function CreditCardValidatorClient() {
  const [num, setNum] = useState('');
  const clean = num.replace(/\D/g, '');
  const pass = luhn(num);
  const validLen = clean.length >= 13 && clean.length <= 19;
  const ok = pass && validLen;
  const cType = clean.length >= 13 ? TYPES.find(t => t.pattern.test(clean)) : null;
  const fmt = clean.replace(/(\d{4})(?=\d)/g, '$1 ');

  const loadExample = () => setNum('4111111111111111');

  return (
    <DeveloperSecurityFrame onExample={()=>{loadExample();}} onClear={()=>{setNum('');}}>
    <div>
      <p className="tb-v2-hash-stats">Checks syntax and checksum only, not whether a card is issued, active, or funded.</p>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Card Number</span>

      </div>
      <input aria-label="Card number" type="text" value={num} onChange={e => setNum(e.target.value)} placeholder="1234 5678 9012 3456" className="tb-v2-tool-textarea" style={{ width: '100%', minHeight: 44, resize: 'none', fontFamily: 'var(--f-mono)', letterSpacing: 2 }} maxLength={23} />
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Validation Result</span></div>
      <div className="tb-v2-tool-output-body">
        {!num.trim() ? <div style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter a card number to validate</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: ok ? '#10b98120' : '#ef444420', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{ok ? '✅' : '❌'}</div>
              <div>
                <div style={{ fontWeight: 600, color: ok ? '#10b981' : '#ef4444', fontSize: 15 }}>{ok ? 'Checksum valid (Luhn pass)' : !validLen ? 'Invalid length' : 'Invalid card number'}</div>
                <div style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>Luhn algorithm check · {clean.length}/19 digits</div>
              </div>
            </div>
            {cType && <div style={{ background: 'var(--tb-bg-secondary)', borderRadius: 8, padding: '10px 12px' }}><div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>Possible Card Type</div><div style={{ fontSize: 16, fontWeight: 600 }}>{cType.name}</div></div>}
            {!cType && clean.length >= 6 && <div style={{ color: 'var(--tb-text-secondary)', fontSize: 13 }}>Card type could not be determined</div>}
          </div>
        )}
      </div>
    </div>
    </DeveloperSecurityFrame>
  );
}
