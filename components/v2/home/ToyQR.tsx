'use client';

import { useMemo, useState } from 'react';
import { IconDown } from '@/components/v2/icons';

const N = 25;
const CELL = 6;

export default function ToyQR() {
  const [url, setUrl] = useState('https://toolblip.com');

  const matrix = useMemo(() => {
    let h = 5381;
    for (let i = 0; i < url.length; i++) {
      h = ((h << 5) + h + url.charCodeAt(i)) | 0;
    }
    const rng = () => {
      h = (h * 1664525 + 1013904223) | 0;
      return ((h >>> 0) % 1000) / 1000;
    };
    const m: number[][] = Array.from({ length: N }, () => Array(N).fill(0));

    const finder = (r: number, c: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          const on =
            i === 0 || i === 6 || j === 0 || j === 6 ||
            (i >= 2 && i <= 4 && j >= 2 && j <= 4);
          m[r + i][c + j] = on ? 1 : 0;
        }
      }
    };
    finder(0, 0);
    finder(0, N - 7);
    finder(N - 7, 0);

    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const inFinder =
          (r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8);
        if (!inFinder) m[r][c] = rng() > 0.5 ? 1 : 0;
      }
    }
    for (let i = 8; i < N - 8; i++) {
      m[6][i] = i % 2 === 0 ? 1 : 0;
      m[i][6] = i % 2 === 0 ? 1 : 0;
    }
    return m;
  }, [url]);

  return (
    <div className="tb-v2-toy-qr-pane">
      <div className="tb-v2-toy-qr-form">
        <label>URL or Text</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          spellCheck={false}
        />
        <label style={{ marginTop: 6 }}>Size</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {['Small', 'Medium', 'Large'].map((s) => (
            <button
              key={s}
              type="button"
              className="tb-v2-btn tb-v2-btn-sm"
              style={{ flex: 1 }}
            >
              {s}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <button type="button" className="tb-v2-btn tb-v2-btn-sm" style={{ flex: 1 }}>
            <IconDown style={{ width: 13, height: 13 }} /> PNG
          </button>
          <button type="button" className="tb-v2-btn tb-v2-btn-sm" style={{ flex: 1 }}>
            <IconDown style={{ width: 13, height: 13 }} /> SVG
          </button>
        </div>
      </div>
      <div className="tb-v2-toy-qr-preview">
        <svg
          viewBox={`0 0 ${N * CELL} ${N * CELL}`}
          width="100%"
          height="100%"
          aria-label="Sample QR code preview"
        >
          {matrix.flatMap((row, r) =>
            row.map((v, c) =>
              v ? (
                <rect
                  key={`${r}-${c}`}
                  x={c * CELL}
                  y={r * CELL}
                  width={CELL}
                  height={CELL}
                  fill="#18181b"
                  rx="0.5"
                />
              ) : null,
            ),
          )}
        </svg>
      </div>
    </div>
  );
}
