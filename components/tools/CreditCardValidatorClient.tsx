'use client';

import { useState } from 'react';

const TYPES = [
  { name: 'Visa', pattern: /^4[0-9]{12}(?:[0-9]{3})?$/ },
  { name: 'Mastercard', pattern: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/ },
  { name: 'American Express', pattern: /^3[47][0-9]{13}$/ },
  { name: 'Discover', pattern: /^6(?:011|5[0-9]{2})[0-9]{12}$/ },
  { name: 'JCB', pattern: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/ },
];

function luhn(card: string): boolean {
  const d = card.replace(/\D/g, '');
  if (d.length < 13 || d.length > 19) return false;
  let s = 0, even = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = parseInt(d[i]);
    if (even) { n *= 2; if (n > 9) n -= 9; }
    s += n; even = !even;
  }
  return s % 10 === 0;
}

export default function CreditCardValidatorClient() {
  const [num, setNum] = useState('');
  const clean = num.replace(/\D/g, '');
  const pass = luhn(clean);
  const validLen = clean.length >= 13 && clean.length <= 19;
  const ok = pass && validLen;
  const cType = clean.length >= 13 ? TYPES.find(t => t.pattern.test(clean)) : null;
  const fmt = clean.replace(/(\d{4})(?=\d)/g, '$1 ');

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Card Number</span></div>
      <input type="text" value={fmt} onChange={e => setNum(e.target.value.replace(/\D/g, '').slice(0, 19))} placeholder="1234 5678 9012 3456" className="tb-v2-tool-textarea" style={{ width: '100%', minHeight: 44, resize: 'none', fontFamily: 'var(--f-mono)', letterSpacing: 2 }} maxLength={23} />
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Validation Result</span></div>
      <div className="tb-v2-tool-output-body">
        {!num.trim() ? <div style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter a card number to validate</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: ok ? '#10b98120' : '#ef444420', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{ok ? '✅' : '❌'}</div>
              <div>
                <div style={{ fontWeight: 600, color: ok ? '#10b981' : '#ef4444', fontSize: 15 }}>{ok ? 'Valid card (Luhn pass)' : !validLen ? 'Invalid length' : 'Invalid card number'}</div>
                <div style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>Luhn algorithm check · {clean.length}/19 digits</div>
              </div>
            </div>
            {cType && <div style={{ background: 'var(--tb-bg-secondary)', borderRadius: 8, padding: '10px 12px' }}><div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>Card Type</div><div style={{ fontSize: 16, fontWeight: 600 }}>{cType.name}</div></div>}
            {!cType && clean.length >= 6 && <div style={{ color: 'var(--tb-text-secondary)', fontSize: 13 }}>Card type could not be determined</div>}
          </div>
        )}
      </div>
    </div>
  );
}
