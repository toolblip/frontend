'use client';

import { useState, useEffect, useMemo } from 'react';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  nextBirthday: string;
  daysUntilBirthday: number;
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
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;

  // Next birthday
  const nextBirthdayYear = targetDate.getFullYear();
  let nextBirthday = new Date(nextBirthdayYear, birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday <= targetDate) {
    nextBirthday = new Date(nextBirthdayYear + 1, birthDate.getMonth(), birthDate.getDate());
  }
  const daysUntilBirthday = Math.floor((nextBirthday.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));

  const nextBirthdayStr = nextBirthday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return { years, months, days, totalDays, totalWeeks, totalHours, nextBirthday: nextBirthdayStr, daysUntilBirthday };
}

export default function AgeCalculatorClient() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

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

  const copy = () => {
    if (!result) return;
    const text = `Age: ${result.years} years, ${result.months} months, ${result.days} days
Total days: ${result.totalDays.toLocaleString()}
Total weeks: ${result.totalWeeks.toLocaleString()}
Total hours: ${result.totalHours.toLocaleString()}
Next birthday: ${result.nextBirthday} (${result.daysUntilBirthday} days away)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

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
        style={{ minHeight: 48, fontFamily: 'var(--f-mono)' }}
        aria-label="Birth date input"
      />

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {result && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Your Age</span>
            <button onClick={copy} className="tb-v2-copy-btn">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Main age display */}
          <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              {result.years}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400">years old</div>
          </div>

          {/* Detailed breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-500">{result.months}</div>
              <div className="text-xs text-gray-500">Months</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-500">{result.days}</div>
              <div className="text-xs text-gray-500">Days</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-500">{result.daysUntilBirthday}</div>
              <div className="text-xs text-gray-500">Days to B-Day</div>
            </div>
          </div>

          {/* Total stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-lg font-bold">{result.totalDays.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Total Days</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-lg font-bold">{result.totalWeeks.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Total Weeks</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-lg font-bold">{result.totalHours.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Total Hours</div>
            </div>
          </div>

          {/* Next birthday */}
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <div className="text-sm text-indigo-700 dark:text-indigo-300">
              🎂 Next birthday: <strong>{result.nextBirthday}</strong> ({result.daysUntilBirthday} days away)
            </div>
          </div>
        </>
      )}

      {!birthDate && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🎂</div>
          <p>Select your birth date to calculate your age</p>
        </div>
      )}
    </div>
  );
}
