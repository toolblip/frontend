'use client';

import { useState, useEffect, useCallback } from 'react';

export default function CountdownTimerClient() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const totalSeconds = remaining !== null ? remaining : (hours * 3600 + minutes * 60 + seconds);

  useEffect(() => {
    if (!isRunning || remaining === null) return;

    if (remaining <= 0) {
      setIsRunning(false);
      return;
    }

    const timer = setInterval(() => {
      setRemaining((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, remaining]);

  const start = useCallback(() => {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total <= 0) return;
    setRemaining(total);
    setIsRunning(true);
  }, [hours, minutes, seconds]);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setRemaining(null);
  }, []);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Countdown</span>
        {isRunning && <span style={{ color: 'var(--tb-accent)', fontSize: 12 }}>Running...</span>}
      </div>
      <div className="tb-v2-tool-output-body" style={{ textAlign: 'center', padding: 24 }}>
        <div style={{ fontSize: 56, fontWeight: 700, fontFamily: 'var(--f-mono)', color: 'var(--tb-accent)' }}>
          {formatTime(totalSeconds)}
        </div>
      </div>

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Set Duration</span>
      </div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, color: 'var(--tb-text-secondary)', display: 'block', marginBottom: 4 }}>Hours</label>
          <input
            type="number"
            min="0"
            max="99"
            value={hours}
            onChange={(e) => setHours(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))}
            disabled={isRunning}
            className="tb-v2-tool-textarea"
            style={{ textAlign: 'center' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, color: 'var(--tb-text-secondary)', display: 'block', marginBottom: 4 }}>Minutes</label>
          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            disabled={isRunning}
            className="tb-v2-tool-textarea"
            style={{ textAlign: 'center' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, color: 'var(--tb-text-secondary)', display: 'block', marginBottom: 4 }}>Seconds</label>
          <input
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            disabled={isRunning}
            className="tb-v2-tool-textarea"
            style={{ textAlign: 'center' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button
          type="button"
          onClick={isRunning ? stop : start}
          className="tb-v2-copy-btn"
          style={{ flex: 1, background: isRunning ? 'var(--tb-border)' : 'var(--tb-accent)', color: isRunning ? 'var(--tb-text)' : '#fff' }}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button type="button" onClick={reset} className="tb-v2-copy-btn" style={{ flex: 1 }}>
          Reset
        </button>
      </div>
    </div>
  );
}
