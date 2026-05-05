'use client';

import { useState } from 'react';

export default function BusinessPlanGeneratorClient() {
  const [businessIdea, setBusinessIdea] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [budget, setBudget] = useState('medium');
  const [plan, setPlan] = useState<Record<string, string> | null>(null);

  const generatePlan = () => {
    if (!businessIdea.trim()) return;

    const idea = businessIdea.trim();
    const market = targetMarket.trim() || 'general consumers';
    const budgetLevel = budget;

    setPlan({
      'Executive Summary': `A ${idea.toLowerCase()} business targeting ${market.toLowerCase()}. This plan outlines key strategies for market entry, operations, and growth with a ${budgetLevel} budget allocation.`,
      
      'Company Description': `${idea} is a business dedicated to providing value to ${market.toLowerCase()} through innovative solutions. Our mission is to deliver exceptional quality while maintaining competitive pricing.`,
      
      'Market Analysis': `Target market includes ${market.toLowerCase()}. The industry shows strong demand for innovative solutions. Key competitors include established players, but opportunities exist for differentiation through superior service and unique offerings.`,
      
      'Organization & Management': `Small team focused on core operations. Key roles include leadership, product/service delivery, and customer relations. Organizational structure will scale with business growth.`,
      
      'Products/Services': `${idea} offers solutions tailored to ${market.toLowerCase()}. Key differentiators include quality assurance, customer-centric approach, and competitive pricing.`,
      
      'Marketing Strategy': `Digital presence optimization, targeted outreach to ${market.toLowerCase()}, partnerships with complementary businesses, and referral programs. Budget allocation: 30% digital marketing, 40% content creation, 30% promotions.`,
      
      'Funding Request': `For ${budgetLevel} budget level, we request: Seed funding for equipment/materials (40%), marketing and customer acquisition (35%), operational costs (25%).`,
      
      'Financial Projections': `Month 1-3: Establishment phase with moderate revenue. Month 4-6: Growth phase targeting 50% revenue increase. Month 7-12: Scale phase with expanded market reach and diversified income streams.`,
      
      'Risk Analysis': `Key risks include market competition, cash flow management, and customer acquisition costs. Mitigation strategies: diversify income sources, maintain operational efficiency, and build strong customer relationships.`,
    });
  };

  const copyAll = () => {
    if (!plan) return;
    const text = Object.entries(plan)
      .map(([section, content]) => `## ${section}\n\n${content}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Business Details</span>
      </div>
      
      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Business Idea *</label>
        <textarea
          value={businessIdea}
          onChange={(e) => setBusinessIdea(e.target.value)}
          placeholder="Describe your business idea..."
          className="tb-v2-tool-textarea"
          style={{ minHeight: '80px' }}
          aria-label="Business idea"
        />
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Target Market</label>
        <input
          type="text"
          value={targetMarket}
          onChange={(e) => setTargetMarket(e.target.value)}
          placeholder="e.g., small businesses, tech professionals"
          className="tb-v2-tool-input"
          aria-label="Target market"
        />
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Budget Level</label>
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="tb-v2-tool-select"
          aria-label="Budget level"
        >
          <option value="low">Low ($1,000 - $5,000)</option>
          <option value="medium">Medium ($5,000 - $25,000)</option>
          <option value="high">High ($25,000+)</option>
        </select>
      </div>

      <button
        type="button"
        onClick={generatePlan}
        className="tb-v2-btn"
        disabled={!businessIdea.trim()}
      >
        Generate Business Plan
      </button>

      {plan && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Generated Business Plan</span>
            <button type="button" onClick={copyAll} className="tb-v2-copy-btn">
              Copy All
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            {Object.entries(plan).map(([section, content]) => (
              <div key={section} className="tb-v2-section">
                <h3 className="tb-v2-section-title">{section}</h3>
                <p className="tb-v2-section-content">{content}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
