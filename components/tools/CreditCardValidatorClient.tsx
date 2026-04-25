'use client';

import { useState } from 'react';

function luhn(card: string): boolean {
  const digits = card.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

function getCardType(card: string): string {
  const digits = card.replace(/\D/g, '');
  if (/^4/.test(digits)) return 'Visa';
  if (/^5[1-5]/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'Amex';
  if (/^6(?:011|5)/.test(digits)) return 'Discover';
  if (/^35/.test(digits)) return 'JCB';
  if (/^30[0-5]/.test(digits)) return 'Diners Club';
  return 'Unknown';
}

export default function CreditCardValidatorClient() {
  const [input, setInput] = useState('');

  const digits = input.replace(/\D/g, '');
  const isValid = digits.length >= 13 ? luhn(digits) : null;
  const cardType = digits.length >= 2 ? getCardType(digits) : '';

  const formatCard = (val: string) => {
    const d = val.replace(/\D/g, '');
    if (cardType === 'Amex') {
      return d.slice(0, 4) + (d.length > 4 ? ' ' + d.slice(4, 10) : '') + (d.length > 10 ? ' ' + d.slice(10, 15) : '');
    }
    return d.slice(0, 4) + (d.length > 4 ? ' ' + d.slice(4, 8) : '') + (d.length > 8 ? ' ' + d.slice(8, 12) : '') + (d.length > 12 ? ' ' + d.slice(12, 16) : '');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg-1)', display: 'block', marginBottom: 6 }}>
          Card Number
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(formatCard(e.target.value))}
          placeholder="1234 5678 9012 3456"
          maxLength={19 + 4}
          style={{
            width: '100%', padding: '10px 14px', fontSize: 16, fontFamily: 'var(--f-mono)', letterSpacing: 1,
            border: '1.5px solid', borderRadius: 9, background: 'var(--surface)',
            color: 'var(--fg-0)', outline: 'none', boxSizing: 'border-box',
            borderColor: isValid === true ? 'var(--green, #22c55e)' : isValid === false ? 'var(--red)' : 'var(--line)',
          }}
        />
      </div>

      {input && (
        <div style={{
          padding: '14px 16px', borderRadius: 10,
          background: isValid ? '#f0fdf4' : isValid === false ? '#fef2f2' : 'var(--surface-2)',
          border: '1px solid', borderColor: isValid ? '#22c55e44' : isValid === false ? 'var(--red)' + '44' : 'var(--line)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 20 }}>
            {isValid === true ? '✓' : isValid === false ? '✗' : '?'}
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: isValid ? '#166534' : isValid === false ? 'var(--red)' : 'var(--fg-1)' }}>
              {isValid === true ? 'Valid card number' : isValid === false ? 'Invalid card number' : 'Enter a card number'}
            </div>
            {cardType && (
              <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 2 }}>
                Detected: <strong>{cardType}</strong> · {digits.length} digits
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8, fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.6 }}>
        <strong>Uses Luhn algorithm</strong> — the same checksum used by payment processors worldwide.
        No data is sent anywhere. All validation happens locally in your browser.
      </div>
    </div>
  );
}
