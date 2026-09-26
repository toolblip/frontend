'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import ToolExampleClearActions from './ToolExampleClearActions';

import { useState, useMemo, useEffect } from 'react';
import { zonedInstant, zoneParts } from '@/lib/utility-design/core';

const timeZones = [
  { value: 'America/New_York', label: 'New York (EST/EDT)', offset: -5 },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)', offset: -6 },
  { value: 'America/Denver', label: 'Denver (MST/MDT)', offset: -7 },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', offset: -8 },
  { value: 'America/Anchorage', label: 'Anchorage (AKST/AKDT)', offset: -9 },
  { value: 'Pacific/Honolulu', label: 'Honolulu (HST)', offset: -10 },
  { value: 'Europe/London', label: 'London (GMT/BST)', offset: 0 },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: 1 },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', offset: 1 },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: 9 },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: 8 },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', offset: 8 },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: 4 },
  { value: 'Asia/Kolkata', label: 'Mumbai/Delhi (IST)', offset: 5.5 },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', offset: 10 },
  { value: 'Australia/Perth', label: 'Perth (AWST)', offset: 8 },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)', offset: 12 },
  { value: 'UTC', label: 'UTC', offset: 0 },
];

export default function TimeZoneConverterClient() {
  const [inputTime, setInputTime] = useState('12:00');
  const [inputDate, setInputDate] = useState('');
  const [fromZone, setFromZone] = useState('America/New_York');
  const [targetZones, setTargetZones] = useState<string[]>(['Europe/London', 'Asia/Tokyo']);
  const [localTimezone, setLocalTimezone] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setLocalTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const getLocalTimezone = () => {
    if (!localTimezone) return '...';
    return localTimezone;
  };

  const { convertedTimes, conversionError } = useMemo(() => {
    if (!inputTime || !inputDate) return { convertedTimes: [], conversionError: '' };
    try {
      const instant = zonedInstant(inputDate, inputTime, fromZone);
      return { convertedTimes: targetZones.map(zoneValue => {
        const zone = timeZones.find(z => z.value === zoneValue)!;
        const wall = zoneParts(instant, zoneValue);
        return { zone, time: wall.replace('T', ' '), dayIndicator: '' };
      }), conversionError: '' };
    } catch (e) { return { convertedTimes: [], conversionError: (e as Error).message }; }
  }, [inputTime, inputDate, fromZone, targetZones]);

  const toggleZone = (zoneValue: string) => {
    setTargetZones(prev => {
      if (prev.includes(zoneValue)) {
        return prev.filter(z => z !== zoneValue);
      } else {
        return [...prev, zoneValue];
      }
    });
  };

  const handleCopy = (time: string) => {
    navigator.clipboard.writeText(time);
  };

  return (<UtilityDesignLayout>
    <div className="" style={{padding:"20px"}}>
      <ToolExampleClearActions onExample={() => { setInputDate('2024-07-01'); setInputTime('12:00'); setFromZone('America/New_York'); setTargetZones(['Europe/London','Asia/Tokyo']); }} onClear={() => { setInputDate(''); setInputTime(''); setTargetZones([]); }}/>
      {isMounted ? (
      <>
      <h1 className="text-2xl font-bold mb-6">Time Zone Converter</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Time</label>
          <input aria-label="Input Time"
            type="time"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            className="tb-v2-input"
          />
        </div>
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Date</label>
          <input aria-label="Input Date"
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            className="tb-v2-input"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="tb-v2-tool-label" style={{marginBottom:8}}>From Timezone</label>
        <select aria-label="From Zone"
          value={fromZone}
          onChange={(e) => setFromZone(e.target.value)}
          className="tb-v2-input"
        >
          {timeZones.map(tz => (
            <option key={tz.value} value={tz.value}>{tz.label}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Your local timezone: {getLocalTimezone()}</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">Convert to:</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {timeZones.filter(tz => tz.value !== fromZone).map(tz => (
            <label
              key={tz.value}
              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${
                targetZones.includes(tz.value)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <input aria-label={tz.label}
                type="checkbox"
                checked={targetZones.includes(tz.value)}
                onChange={() => toggleZone(tz.value)}
                className="rounded"
              />
              <span className="text-sm">{tz.label}</span>
            </label>
          ))}
        </div>
      </div>

      {conversionError && <p role="alert">{conversionError}</p>}
      {convertedTimes.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Converted Times</label>
          <div className="space-y-3">
            {convertedTimes.map((result, i) => result && (
              <div
                key={i}
                className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}
              >
                <div>
                  <div className="font-medium">{result.zone.label}</div>

                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-mono font-bold">{result.time}</span>
                  {result.dayIndicator && (
                    <span className="text-sm text-blue-500">{result.dayIndicator}</span>
                  )}
                  <button
                    onClick={() => handleCopy(result.time)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}>
        <h3 className="font-medium mb-2">Tips:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Select multiple target timezones to compare</li>
          <li>• Add a date to see times across different days</li>
          <li>• Uses IANA daylight-saving rules. Ambiguous and nonexistent local times require another time.</li>
        </ul>
      </div>
      </>
      ) : <div className="" style={{padding:"20px"}}><span className="text-gray-400">Loading…</span></div>}
    </div>
  </UtilityDesignLayout>
  );
}
