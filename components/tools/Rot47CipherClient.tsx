'use client';

import { useCallback, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_PLAIN = 'Hello, World!';

const ROT47_CHARS =
  '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

function rot47(text: string, encode: boolean): string {
  return text
    .split('')
    .map((char) => {
      const idx = ROT47_CHARS.indexOf(char);
      if (idx === -1) return char;
      const newIdx = encode ? (idx + 47) % 94 : (idx - 47 + 94) % 94;
      return ROT47_CHARS[newIdx];
    })
    .join('');
}

export default function Rot47CipherClient() {
  const [plain, setPlain] = useState('');
  const [encoded, setEncoded] = useState('');
  const [copiedPlain, setCopiedPlain] = useState(false);
  const [copiedEncoded, setCopiedEncoded] = useState(false);

  const applyPlain = useCallback((raw: string) => {
    setPlain(raw);
    setEncoded(raw ? rot47(raw, true) : '');
  }, []);

  const applyEncoded = useCallback((raw: string) => {
    setEncoded(raw);
    setPlain(raw ? rot47(raw, false) : '');
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
        <span className="tb-v2-tool-label">ROT47 Cipher</span>
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
            <span className="tb-v2-tool-label">ROT47 encoded</span>
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
            aria-label="ROT47 encoded input"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
