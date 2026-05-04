'use client';

import { useState, useCallback } from 'react';

export default function SemverCheckerClient() {
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  const [result, setResult] = useState<{ comparison: string; reason: string } | null>(null);

  const parseSemver = (v: string) => {
    const match = v.match(/^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?(?:\+([a-zA-Z0-9.-]+))?$/);
    if (!match) return null;
    return { major: parseInt(match[1]), minor: parseInt(match[2]), patch: parseInt(match[3]), pre: match[4] || '', build: match[5] || '' };
  };

  const compare = useCallback(() => {
    const a = parseSemver(v1);
    const b = parseSemver(v2);
    if (!a || !b) { setResult({ comparison: 'Invalid', reason: 'Both must be valid semver (e.g. 1.2.3)' }); return; }

    if (a.major !== b.major) {
      setResult({ comparison: a.major > b.major ? 'Greater' : 'Smaller', reason: `Major version differs: ${a.major} vs ${b.major}` });
    } else if (a.minor !== b.minor) {
      setResult({ comparison: a.minor > b.minor ? 'Greater' : 'Smaller', reason: `Minor version differs: ${a.minor} vs ${b.minor}` });
    } else if (a.patch !== b.patch) {
      setResult({ comparison: a.patch > b.patch ? 'Greater' : 'Smaller', reason: `Patch version differs: ${a.patch} vs ${b.patch}` });
    } else if (a.pre !== b.pre) {
      const cmp = a.pre && !b.pre ? 'Greater (has pre-release)' : !a.pre && b.pre ? 'Smaller (no pre-release)' : a.pre > b.pre ? 'Greater' : 'Smaller';
      setResult({ comparison: cmp, reason: `Pre-release differs: "${a.pre}" vs "${b.pre}"` });
    } else {
      setResult({ comparison: 'Equal', reason: 'Versions are identical' });
    }
  }, [v1, v2]);

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Versions</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8, alignItems: 'end', marginBottom: 12 }}>
        <input type="text" value={v1} onChange={(e) => setV1(e.target.value)} placeholder="1.2.3" className="tb-v2-tool-input" aria-label="Version 1" />
        <span style={{ paddingBottom: 10, fontSize: 18 }}>vs</span>
        <input type="text" value={v2} onChange={(e) => setV2(e.target.value)} placeholder="1.2.3" className="tb-v2-tool-input" aria-label="Version 2" />
      </div>
      <button type="button" onClick={compare} className="tb-v2-primary-btn" style={{ width: '100%', marginBottom: 12 }}>
        Compare
      </button>

      {result && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Result</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{v1} {result.comparison} {v2}</div>
            <div style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>{result.reason}</div>
          </div>
        </>
      )}
    </div>
  );
}