'use client';

import { useState } from 'react';

export default function ContentPlannerClient() {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState('');
  const [copied, setCopied] = useState(false);

  const loadExample = () => {
    setGoal('Blog series on healthy eating');
    setPlan('');
  };

  const handlePlan = async () => {
    if (!goal) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setPlan(`Content Plan for: ${goal}\n\nWeek 1: Foundation\n- Topic research\n- Outline creation\n\nWeek 2: Drafting\n- Write first version\n- Internal review\n\nWeek 3: Optimization\n- SEO improvements\n- Final edits`);
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(plan).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Content Planner</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Content Goal</label>
          <input className="tb-v2-input" value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g., Blog series on healthy eating" />
        </div>
        <button type="button" className="tb-v2-btn tb-v2-btn-primary" onClick={handlePlan} disabled={!goal || loading}>
          {loading ? 'Planning...' : 'Generate Plan'}
        </button>
        {plan && (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Plan</span>
              <button type="button" onClick={copy} className="tb-v2-btn-sm">{copied ? 'Copied' : 'Copy'}</button>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-sm">{plan}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
