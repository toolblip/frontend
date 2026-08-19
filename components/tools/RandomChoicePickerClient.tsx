'use client';

import { useState } from 'react';

export default function RandomChoicePickerClient() {
  const [listText, setListText] = useState('Pizza\nSushi\nTacos\nBurgers\nSalad');
  const [removeOnPick, setRemoveOnPick] = useState(false);
  const [pickCount, setPickCount] = useState(1);
  const [picked, setPicked] = useState<string[]>([]);
  const [error, setError] = useState('');

  const choices = listText
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const pick = () => {
    setError('');
    if (choices.length === 0) {
      setError('Add at least one choice, one per line.');
      setPicked([]);
      return;
    }
    const n = Math.max(1, Math.min(pickCount, choices.length));
    // Fisher-Yates partial shuffle to draw n unique items without replacement
    const pool = [...choices];
    const result: string[] = [];
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * (pool.length - i)) + i;
      [pool[i], pool[idx]] = [pool[idx], pool[i]];
      result.push(pool[i]);
    }
    setPicked(result);

    if (removeOnPick) {
      const remaining = [...choices];
      // remove the picked items (first matching occurrence each)
      result.forEach(item => {
        const idx = remaining.indexOf(item);
        if (idx !== -1) remaining.splice(idx, 1);
      });
      setListText(remaining.join('\n'));
    }
  };

  const clearAll = () => {
    setListText('');
    setPicked([]);
    setError('');
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Choices (one per line)</span>
        <button type="button" onClick={clearAll} className="tb-v2-btn-sm">Clear</button>
      </div>
      <div style={{ padding: 20 }}>
        <textarea
          className="tb-v2-input"
          style={{ minHeight: 160, fontFamily: 'var(--f-mono)' }}
          value={listText}
          onChange={e => setListText(e.target.value)}
          placeholder="Enter one choice per line..."
        />

        <div className="tb-v2-grid-2" style={{ marginTop: 16 }}>
          <div>
            <span className="tb-v2-tool-label">Number to pick</span>
            <input
              type="number"
              min={1}
              max={Math.max(1, choices.length)}
              value={pickCount}
              onChange={e => setPickCount(parseInt(e.target.value, 10) || 1)}
              className="tb-v2-input"
            />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 22, fontSize: 13.5 }}>
            <input
              type="checkbox"
              checked={removeOnPick}
              onChange={e => setRemoveOnPick(e.target.checked)}
            />
            Remove picked item(s) from the list
          </label>
        </div>

        <button
          type="button"
          onClick={pick}
          disabled={choices.length === 0}
          className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
          style={{ marginTop: 16 }}
        >
          Pick {pickCount > 1 ? `${pickCount} Items` : 'One'}
        </button>
      </div>

      {error && <div className="tb-v2-error" style={{ margin: '0 20px 20px' }}>{error}</div>}

      {picked.length > 0 && (
        <div className="tb-v2-tool-output-body">
          <span className="tb-v2-tool-label">Result</span>
          <div className="tb-v2-stats-grid" style={{ marginTop: 8, background: 'transparent', border: 0, padding: 0 }}>
            {picked.map((p, i) => (
              <div key={i} className="tb-v2-stat-pill">
                <div className="tb-v2-stat-pill-val" style={{ fontSize: 16 }}>{p}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
