'use client';

import { useState, useMemo } from 'react';

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

  const getLocalTimezone = () => {
    const offset = new Date().getTimezoneOffset();
    const hours = Math.abs(Math.floor(offset / 60));
    const minutes = offset % 60;
    const sign = offset <= 0 ? '+' : '-';
    return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const convertedTimes = useMemo(() => {
    if (!inputTime) return [];

    const [hours, minutes] = inputTime.split(':').map(Number);
    const date = inputDate ? new Date(inputDate) : new Date();
    date.setHours(hours, minutes, 0, 0);

    return targetZones.map(zoneValue => {
      const targetZone = timeZones.find(tz => tz.value === zoneValue);
      const sourceZone = timeZones.find(tz => tz.value === fromZone);

      if (!targetZone || !sourceZone) return null;

      const sourceOffset = sourceZone.offset;
      const targetOffset = targetZone.offset;
      const diff = targetOffset - sourceOffset;

      const targetDate = new Date(date.getTime() + diff * 60 * 60 * 1000);
      
      const targetHours = targetDate.getUTCHours();
      const targetMinutes = targetDate.getUTCMinutes();
      const timeStr = `${targetHours.toString().padStart(2, '0')}:${targetMinutes.toString().padStart(2, '0')}`;
      
      const isNextDay = targetDate.getDate() !== date.getDate();
      const isPrevDay = targetDate.getTime() < date.getTime() - 23 * 60 * 60 * 1000;

      return {
        zone: targetZone,
        time: timeStr,
        dayIndicator: isNextDay ? '+1 day' : isPrevDay ? '-1 day' : '',
      };
    }).filter(Boolean);
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Time Zone Converter</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Time</label>
          <input
            type="time"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Date (optional)</label>
          <input
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">From Timezone</label>
        <select
          value={fromZone}
          onChange={(e) => setFromZone(e.target.value)}
          className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
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
              <input
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

      {convertedTimes.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Converted Times</label>
          <div className="space-y-3">
            {convertedTimes.map((result, i) => result && (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <div className="font-medium">{result.zone.label}</div>
                  <div className="text-xs text-gray-500">UTC{result.zone.offset >= 0 ? '+' : ''}{result.zone.offset}</div>
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

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium mb-2">Tips:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Select multiple target timezones to compare</li>
          <li>• Add a date to see times across different days</li>
          <li>• DST (Daylight Saving Time) transitions are not automatically handled</li>
        </ul>
      </div>
    </div>
  );
}
