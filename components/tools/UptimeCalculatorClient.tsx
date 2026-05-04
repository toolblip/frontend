'use client';

import { useState, useMemo } from 'react';

interface UptimeResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

export default function UptimeCalculatorClient() {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState<'seconds' | 'minutes' | 'hours' | 'days'>('days');

  const result = useMemo<UptimeResult | null>(() => {
    const value = parseFloat(input);
    if (isNaN(value) || value < 0) return null;

    let totalSeconds: number;

    switch (inputType) {
      case 'seconds':
        totalSeconds = value;
        break;
      case 'minutes':
        totalSeconds = value * 60;
        break;
      case 'hours':
        totalSeconds = value * 3600;
        break;
      case 'days':
        totalSeconds = value * 86400;
        break;
      default:
        return null;
    }

    const years = Math.floor(totalSeconds / (365.25 * 86400));
    const remainingAfterYears = totalSeconds % (365.25 * 86400);
    const months = Math.floor(remainingAfterYears / (30.44 * 86400));
    const remainingAfterMonths = remainingAfterYears % (30.44 * 86400);
    const days = Math.floor(remainingAfterMonths / 86400);
    const remainingAfterDays = remainingAfterMonths % 86400;
    const hours = Math.floor(remainingAfterDays / 3600);
    const remainingAfterHours = remainingAfterDays % 3600;
    const minutes = Math.floor(remainingAfterHours / 60);
    const seconds = Math.floor(remainingAfterHours % 60);

    return {
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      totalDays: Math.floor(totalSeconds / 86400),
      totalHours: Math.floor(totalSeconds / 3600),
      totalMinutes: Math.floor(totalSeconds / 60),
      totalSeconds: Math.floor(totalSeconds),
    };
  }, [input, inputType]);

  const uptimePercentages = useMemo(() => {
    if (!result) return null;
    
    const minutePercent = ((result.minutes / 60) * 100).toFixed(1);
    const hourPercent = ((result.hours / 24) * 100).toFixed(1);
    const dayPercent = ((result.days / 30.44) * 100).toFixed(1);
    const monthPercent = ((result.months / 12) * 100).toFixed(1);
    
    return { minutePercent, hourPercent, dayPercent, monthPercent };
  }, [result]);

  const exampleDurations = [
    { label: '1 day', value: '1', type: 'days' as const },
    { label: '1 week', value: '7', type: 'days' as const },
    { label: '30 days', value: '30', type: 'days' as const },
    { label: '365 days', value: '365', type: 'days' as const },
    { label: '1 hour', value: '1', type: 'hours' as const },
    { label: '1000 hours', value: '1000', type: 'hours' as const },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Uptime Calculator</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Enter duration</label>
        <div className="flex gap-3">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            placeholder="Enter a number..."
            min="0"
          />
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value as 'seconds' | 'minutes' | 'hours' | 'days')}
            className="p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">Quick examples:</label>
        <div className="flex flex-wrap gap-2">
          {exampleDurations.map((ex) => (
            <button
              key={ex.label}
              onClick={() => { setInput(ex.value); setInputType(ex.type); }}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg mb-6">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {result.years > 0 && `${result.years}y `}
                {result.months > 0 && `${result.months}m `}
                {result.days > 0 && `${result.days}d `}
                {result.hours > 0 && `${result.hours}h `}
                {result.minutes > 0 && `${result.minutes}m `}
                {result.seconds > 0 && `${result.seconds}s`}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold">{result.totalDays.toLocaleString()}</div>
                <div className="text-gray-500">Total Days</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold">{result.totalHours.toLocaleString()}</div>
                <div className="text-gray-500">Total Hours</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold">{result.totalMinutes.toLocaleString()}</div>
                <div className="text-gray-500">Total Minutes</div>
              </div>
            </div>
          </div>

          {uptimePercentages && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">As percentages:</label>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                {result.totalSeconds >= 60 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Minutes of an hour:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${Math.min(100, parseFloat(uptimePercentages.minutePercent))}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono">{uptimePercentages.minutePercent}%</span>
                    </div>
                  </div>
                )}
                {result.totalSeconds >= 3600 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hours of a day:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${Math.min(100, parseFloat(uptimePercentages.hourPercent))}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono">{uptimePercentages.hourPercent}%</span>
                    </div>
                  </div>
                )}
                {result.totalSeconds >= 86400 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Days of a month:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500"
                          style={{ width: `${Math.min(100, parseFloat(uptimePercentages.dayPercent))}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono">{uptimePercentages.dayPercent}%</span>
                    </div>
                  </div>
                )}
                {result.totalSeconds >= 2592000 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Months of a year:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${Math.min(100, parseFloat(uptimePercentages.monthPercent))}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono">{uptimePercentages.monthPercent}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium mb-2">Common Uptime References:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• 99.9% uptime = ~8.7 hours downtime/year</li>
          <li>• 99.99% uptime = ~52 minutes downtime/year</li>
          <li>• 99.999% uptime = ~5 minutes downtime/year</li>
          <li>• 1 day = 86,400 seconds</li>
          <li>• 1 week = 604,800 seconds</li>
          <li>• 1 year = 31,536,000 seconds</li>
        </ul>
      </div>
    </div>
  );
}
