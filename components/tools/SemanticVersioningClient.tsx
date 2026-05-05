'use client';

import { useState } from 'react';

interface VersionParts { major: string; minor: string; patch: string; prerelease: string; build: string; raw: string; }

function parseSemver(v: string): VersionParts {
  const m = v.match(/^(\d+)\.(\d+)\.(\d+)(?:-([\w.-]+))?(?:\+([\w.-]+))?$/);
  if (!m) return { major: '', minor: '', patch: '', prerelease: '', build: '', raw: v };
  return { major: m[1], minor: m[2], patch: m[3], prerelease: m[4] || '', build: m[5] || '', raw: v };
}

export default function SemanticVersioningClient() {
  const [input, setInput] = useState('');
  const parts = parseSemver(input.trim());

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Version String</span></div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="e.g. 1.2.3-beta+build.123" className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Extracted Parts</span></div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {input.trim() ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <tbody>
              {[
                { label: 'Major', value: parts.major || '—' },
                { label: 'Minor', value: parts.minor || '—' },
                { label: 'Patch', value: parts.patch || '—' },
                { label: 'Prerelease', value: parts.prerelease || '—' },
                { label: 'Build', value: parts.build || '—' },
              ].map(row => (
                <tr key={row.label} style={{ borderBottom: '1px solid var(--tb-border)' }}>
                  <td style={{ padding: '6px 0', color: 'var(--tb-text-secondary)', width: '40%' }}>{row.label}</td>
                  <td style={{ padding: '6px 0', fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <span style={{ color: 'var(--tb-text-muted)' }}>Enter a version string above</span>}
      </div>
    </div>
  );
}
