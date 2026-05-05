'use client';

import { useState } from 'react';

export default function BmiCalculatorClient() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBmi = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return;

    let result: number;
    if (unit === 'metric') {
      result = w / ((h / 100) * (h / 100));
    } else {
      result = (w / (h * h)) * 703;
    }
    setBmi(Math.round(result * 10) / 10);
  };

  const getCategory = (bmiValue: number): { label: string; color: string } => {
    if (bmiValue < 18.5) return { label: 'Underweight', color: '#3498db' };
    if (bmiValue < 25) return { label: 'Normal', color: '#27ae60' };
    if (bmiValue < 30) return { label: 'Overweight', color: '#f39c12' };
    return { label: 'Obese', color: '#e74c3c' };
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">BMI Calculator</span>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as 'metric' | 'imperial')}
          className="tb-v2-select"
        >
          <option value="metric">Metric (cm/kg)</option>
          <option value="imperial">Imperial (in/lb)</option>
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div>
          <label className="tb-v2-hint">Height ({unit === 'metric' ? 'cm' : 'in'})</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === 'metric' ? '175' : '69'}
            className="tb-v2-tool-input"
            aria-label="Height"
          />
        </div>
        <div>
          <label className="tb-v2-hint">Weight ({unit === 'metric' ? 'kg' : 'lb'})</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === 'metric' ? '70' : '154'}
            className="tb-v2-tool-input"
            aria-label="Weight"
          />
        </div>
      </div>
      <div style={{ margin: '0.75rem 0' }}>
        <button type="button" onClick={calculateBmi} className="tb-v2-btn tb-v2-btn-primary">
          Calculate BMI
        </button>
      </div>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
      </div>
      <div className="tb-v2-tool-output-body" style={{ textAlign: 'center' }}>
        {bmi !== null ? (
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: getCategory(bmi).color }}>
              {bmi}
            </div>
            <div style={{ fontSize: '1.25rem', color: getCategory(bmi).color, marginTop: '0.5rem' }}>
              {getCategory(bmi).label}
            </div>
            <div className="tb-v2-hint" style={{ marginTop: '1rem' }}>
              {unit === 'metric' ? 'Healthy range: 18.5 - 24.9' : 'Healthy range: 18.5 - 24.9'}
            </div>
          </div>
        ) : (
          <p className="tb-v2-hint">Enter your height and weight to calculate BMI</p>
        )}
      </div>
    </div>
  );
}
