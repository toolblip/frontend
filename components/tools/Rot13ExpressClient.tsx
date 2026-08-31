'use client';

import { useCallback, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_PLAIN = 'Hello, World!';

function rot13(text: string): string {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
  });
}

export default function Rot13ExpressClient() {
  const [plain, setPlain] = useState('');
  const [encoded, setEncoded] = useState('');
  const [copiedPlain, setCopiedPlain] = useState(false);
  const [copiedEncoded, setCopiedEncoded] = useState(false);

  const applyPlain = useCallback((raw: string) => {
    setPlain(raw);
    setEncoded(raw ? rot13(raw) : '');
  }, []);

  const applyEncoded = useCallback((raw: string) => {
    setEncoded(raw);
    setPlain(raw ? rot13(raw) : '');
  }, []);

  const copy = (value: string, which: 'plain' | 'encoded') => {
    if (!value) return;
    navigator.clipboard.writeText(value).catch(() => {});
    if (which === 'plain') {
      setCopiedPlain(true);
      setTimeout(() => setCopiedPlain(false), 1500);
    } else {
      setCopiedEncoded(true);
      setTimeout(() => setCopiedEncoded(false), 1500);
    }
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">ROT13 Cipher</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => applyPlain(EXAMPLE_PLAIN)}
          onClear={() => {
            setPlain('');
            setEncoded('');
          }}
          canClear={Boolean(plain || encoded)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y divide-[var(--line)] md:divide-y-0 md:divide-x">
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 280 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Plain text</span>
            <button
              type="button"
              onClick={() => copy(plain, 'plain')}
              disabled={!plain}
              className={`tb-v2-copy-btn ${copiedPlain ? 'done' : ''}`}
            >
              {copiedPlain ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={plain}
            onChange={(e) => applyPlain(e.target.value)}
            placeholder={EXAMPLE_PLAIN}
            className="tb-v2-tool-textarea"
            style={{ flex: 1, minHeight: 220, border: 'none', borderRadius: 0, resize: 'vertical' }}
            aria-label="Plain text input"
            spellCheck={false}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 280 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">ROT13 encoded</span>
            <button
              type="button"
              onClick={() => copy(encoded, 'encoded')}
              disabled={!encoded}
              className={`tb-v2-copy-btn ${copiedEncoded ? 'done' : ''}`}
            >
              {copiedEncoded ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={encoded}
            onChange={(e) => applyEncoded(e.target.value)}
            placeholder="Encoded output appears here…"
            className="tb-v2-tool-textarea"
            style={{
              flex: 1,
              minHeight: 220,
              fontFamily: 'var(--f-mono)',
              border: 'none',
              borderRadius: 0,
              resize: 'vertical',
            }}
            aria-label="ROT13 encoded input"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
