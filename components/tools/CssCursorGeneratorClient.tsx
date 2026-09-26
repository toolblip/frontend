'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import ToolExampleClearActions from './ToolExampleClearActions';

import { useState } from 'react';

const CURSORS = [
  'auto', 'default', 'pointer', 'text', 'wait', 'help', 'progress',
  'crosshair', 'move', 'grab', 'grabbing', 'not-allowed', 'zoom-in', 'zoom-out',
  'n-resize', 'e-resize', 'ns-resize', 'ew-resize', 'nesw-resize', 'nwse-resize', 'col-resize', 'row-resize',
  'cell', 'copy', 'alias', 'context-menu', 'none',
];

export default function CssCursorGeneratorClient() {
  const [cursor, setCursor] = useState('pointer');
  const [imageUrl, setImageUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const css = imageUrl.trim()
    ? `cursor: url(${JSON.stringify(imageUrl.trim())}), ${cursor};`
    : `cursor: ${cursor};`;

  const copy = () => {
    navigator.clipboard.writeText(css).then(() => setCopied(true), () => setCopied(false));
    setTimeout(() => setCopied(false), 1500);
  };

  return (<UtilityDesignLayout>
    <div className="flex flex-col gap-5">
      <ToolExampleClearActions onExample={() => { setCursor('crosshair'); setImageUrl(''); }} onClear={() => { setCursor('auto'); setImageUrl(''); setCopied(false); }}/>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Cursor Type</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {CURSORS.map(c => (
          <button
            key={c}
            type="button"
            onClick={() => setCursor(c)}
            className={`tb-v2-mode-tab ${cursor === c ? 'on' : ''}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <label className="tb-v2-tool-label">Custom Cursor Image URL (optional)</label>
        <input maxLength={100000} aria-label="Image Url"
          type="text"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          placeholder="https://example.com/cursor.png"
          className="tb-v2-input"
        />
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Live Preview (hover)</div>
        <div
          className="flex items-center justify-center bg-gray-100 rounded-xl text-sm text-gray-500"
          style={{ height: 160, cursor: imageUrl.trim() ? `url(${JSON.stringify(imageUrl.trim())}), ${cursor}` : cursor }}
        >
          Hover here to test the cursor
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">CSS Output</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{css}</pre>
      </div>
    </div>
  </UtilityDesignLayout>
  );
}
