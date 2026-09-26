
'use client';
import { useState } from 'react';
import SeoNetworkTextClient from './SeoNetworkTextClient';
import SeoNetworkPreviewClient from './SeoNetworkPreviewClient';
import { SeoSelect } from './SeoNetworkShared';
export default function OgTagDebuggerClient() {
  const [mode, setMode] = useState('inspect');
  return <div><SeoSelect label="Workflow" value={mode} onChange={setMode} options={[[ 'inspect', 'Inspect HTML' ], [ 'generate', 'Edit tags and preview' ]]} />{mode === 'inspect' ? <SeoNetworkTextClient kind="og-debug" /> : <SeoNetworkPreviewClient kind="og" />}</div>;
}
