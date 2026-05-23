'use client';

import { useState } from 'react';

export default function PalindromeCheckerClient() {
  const [text, setText] = useState('');

  const result = (() => {
    if (!text.trim()) return null;
    const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    const reversed = cleaned.split('').reverse().join('');
    return { isPalindrome: cleaned === reversed, cleaned, reversed };
  })();

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Input</span></div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter text or a number to check..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 80 }}
      />
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Result</span></div>
      <div className="tb-v2-tool-output-body">
        {result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: result.isPalindrome ? '#10b98120' : '#ef444420',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28
              }}>{result.isPalindrome ? '✅' : '❌'}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: result.isPalindrome ? '#10b981' : '#ef4444' }}>
                  {result.isPalindrome ? 'Palindrome!' : 'Not a Palindrome'}
                </div>
                <div style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>
                  &quot;{text}&quot; {result.isPalindrome ? 'reads the same' : 'does not read'} forwards and backwards
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ background: 'var(--tb-bg-secondary)', borderRadius: 8, padding: '8px 12px' }}>
                <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', textTransform: 'uppercase' }}>Cleaned</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13 }}>{result.cleaned || ' - '}</div>
              </div>
              <div style={{ background: 'var(--tb-bg-secondary)', borderRadius: 8, padding: '8px 12px' }}>
                <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', textTransform: 'uppercase' }}>Reversed</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13 }}>{result.reversed || ' - '}</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter text to check if it&apos;s a palindrome</div>
        )}
      </div>
    </div>
  );
}
