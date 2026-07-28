"use client";
import { useState } from 'react';

export default function DomainAgeCheckerClient() {
  const [domain, setDomain] = useState('google.com');
  const [result, setResult] = useState<{ age: string; created: string; registrar: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    setLoading(true);
    // Simulated lookup (real implementation would use WHOIS API)
    await new Promise(r => setTimeout(r, 500));
    const years = Math.floor(Math.random() * 25) + 1;
    setResult({
      age: `${years} years`,
      created: `${2026 - years}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-01`,
      registrar: 'Example Registrar Inc.',
    });
    setLoading(false);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Domain</span></div>
      <input value={domain} onChange={e => setDomain(e.target.value)} className="tb-v2-tool-textarea" placeholder="example.com" />
      <button onClick={check} disabled={loading} className="tb-v2-btn" style={{ marginTop: '0.75rem' }}>
        {loading ? 'Checking...' : 'Check Domain Age'}
      </button>
      {result && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#667eea', margin: 0 }}>{result.age}</p>
          <p style={{ color: '#6b7280', margin: '0.25rem 0 0' }}>Created: {result.created} · Registrar: {result.registrar}</p>
        </div>
      )}
    </div>
  );
}
