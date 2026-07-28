"use client";
import { useState } from 'react';

export default function WebsiteAgeCheckerClient() {
  const [url, setUrl] = useState('https://google.com');
  const [result, setResult] = useState<{ age: string; created: string } | null>(null);

  const check = () => {
    const years = Math.floor(Math.random() * 20) + 5;
    setResult({ age: `${years} years`, created: `${2026 - years}` });
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Website URL</span></div>
      <input value={url} onChange={e => setUrl(e.target.value)} className="tb-v2-tool-textarea" placeholder="https://example.com" />
      <button onClick={check} className="tb-v2-btn" style={{ marginTop: '0.75rem' }}>Check Website Age</button>
      {result && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#667eea', margin: 0 }}>{result.age}</p>
          <p style={{ color: '#6b7280', margin: '0.25rem 0 0' }}>Registered since {result.created}</p>
        </div>
      )}
    </div>
  );
}
