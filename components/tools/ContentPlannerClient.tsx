'use client';

import { useState } from 'react';

export default function ContentPlannerClient() {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState('');

  const handlePlan = async () => {
    if (!goal) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setPlan(`Content Plan for: ${goal}\n\nWeek 1: Foundation\n• Topic research\n• Outline creation\n\nWeek 2: Drafting\n• Write first version\n• Internal review\n\nWeek 3: Optimization\n• SEO improvements\n• Final edits`);
    setLoading(false);
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Content Planner</h2>
        <p className="tb-v2-card-desc">Plan and organize your content strategy</p>
      </div>
      <div className="tb-v2-card-body">
        <div className="tb-v2-form-group">
          <label>Content Goal</label>
          <input className="tb-v2-input" value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g., Blog series on healthy eating" />
        </div>
        <button className="tb-v2-btn-primary" onClick={handlePlan} disabled={!goal || loading}>
          {loading ? 'Planning...' : 'Generate Plan'}
        </button>
        {plan && <div className="tb-v2-result-box"><pre className="tb-v2-pre">{plan}</pre></div>}
      </div>
    </div>
  );
}
