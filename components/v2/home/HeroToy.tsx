'use client';

import { useState } from 'react';
import ToyWordCounter from './ToyWordCounter';
import ToyQR from './ToyQR';
import ToyColor from './ToyColor';

type Tab = 'words' | 'qr' | 'color';

export default function HeroToy() {
  const [tab, setTab] = useState<Tab>('words');

  return (
    <div className="tb-v2-toy">
      <div className="tb-v2-toy-head">
        <div className="tb-v2-toy-tabs" role="tablist" aria-label="Try a tool">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'words'}
            className={`tb-v2-toy-tab ${tab === 'words' ? 'on' : ''}`}
            onClick={() => setTab('words')}
          >
            Words
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'qr'}
            className={`tb-v2-toy-tab ${tab === 'qr' ? 'on' : ''}`}
            onClick={() => setTab('qr')}
          >
            QR code
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'color'}
            className={`tb-v2-toy-tab ${tab === 'color' ? 'on' : ''}`}
            onClick={() => setTab('color')}
          >
            Color
          </button>
        </div>
        <div className="tb-v2-toy-meta">
          <span className="tb-v2-live-dot" aria-hidden="true" />
          <span>Live · In-browser</span>
        </div>
      </div>
      <div className="tb-v2-toy-body">
        {tab === 'words' && <ToyWordCounter />}
        {tab === 'qr' && <ToyQR />}
        {tab === 'color' && <ToyColor />}
      </div>
    </div>
  );
}
