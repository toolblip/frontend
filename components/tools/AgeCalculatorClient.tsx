'use client';

import { useState, useEffect } from 'react';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

function calculateAge(birthDate: Date, targetDate: Date): AgeResult {
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor((targetDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));

  return { years, months, days, totalDays };
}

export default function AgeCalculatorClient() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!birthDate) {
      setResult(null);
      setError('');
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();

    if (isNaN(birth.getTime())) {
      setError('Please enter a valid date');
      setResult(null);
      return;
    }

    if (birth > today) {
      setError('Birth date cannot be in the future');
      setResult(null);
      return;
    }

    setError('');
    setResult(calculateAge(birth, today));
  }, [birthDate]);

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Birth Date</span>
      </div>
      <input
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="Birth date input"
      />

      {error && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 12 }}>
          <span style={{ color: 'var(--tb-accent)', fontSize: 14 }}>{error}</span>
        </div>
      )}

      {result && (
        <div className="tb-v2-tool-output-head" style={{ marginTop: 12 }}>
          <span className="tb-v2-tool-label">Your Age</span>
        </div>
      )}
      <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
        {result && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--tb-accent)' }}>{result.years}</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Years</div>
            </div>
            <div style={{ padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--tb-accent)' }}>{result.months}</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Months</div>
            </div>
            <div style={{ padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--tb-accent)' }}>{result.days}</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Days</div>
            </div>
            <div style={{ padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--tb-accent)' }}>{result.totalDays.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Total Days</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
