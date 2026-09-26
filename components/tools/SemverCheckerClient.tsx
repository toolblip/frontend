'use client';
import DeveloperGeneralFrame from './DeveloperGeneralFrame';

import ToolExampleClearActions from './ToolExampleClearActions';
import { compareSemver } from '@/lib/developer-general/semver';
import { useState, useMemo } from 'react';

export default function SemverCheckerClient() {
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  const result = useMemo(() => {
    if (!v1 && !v2) return null;
    try { const n = compareSemver(v1, v2); return {comparison: n > 0 ? 'Greater' : n < 0 ? 'Smaller' : 'Equal', reason: 'SemVer precedence; build metadata does not affect ordering.'}; }
    catch (e) {return {comparison:'Invalid',reason:(e as Error).message};}
  }, [v1,v2]);

  return (
    <DeveloperGeneralFrame><div>
      <ToolExampleClearActions onExample={() => {setV1('1.0.0-alpha.2');setV2('1.0.0-alpha.10');}} onClear={() => {setV1('');setV2('');}} />
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Versions</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8, alignItems: 'end', marginBottom: 12 }}>
        <input maxLength={8000} type="text" value={v1} onChange={(e) => setV1(e.target.value)} placeholder="1.2.3" className="tb-v2-tool-input" aria-label="Version 1" />
        <span style={{ paddingBottom: 10, fontSize: 18 }}>vs</span>
        <input maxLength={8000} type="text" value={v2} onChange={(e) => setV2(e.target.value)} placeholder="1.2.3" className="tb-v2-tool-input" aria-label="Version 2" />
      </div>


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
    </div></DeveloperGeneralFrame>
  );
}
