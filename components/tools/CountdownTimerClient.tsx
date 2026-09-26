'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import ToolExampleClearActions from './ToolExampleClearActions';

import { useState, useEffect, useCallback, useRef } from 'react';

export default function CountdownTimerClient() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const deadline = useRef(0);
  const totalSeconds = remaining !== null ? remaining : (hours * 3600 + minutes * 60 + seconds);

  useEffect(() => {
    if (!isRunning || remaining === null) return;

    if (remaining <= 0) {
      setIsRunning(false);
      return;
    }

    const timer = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setRemaining(left); if(left === 0) setIsRunning(false);
    }, 100);
    return () => clearInterval(timer);
  }, [isRunning]);
  const start = useCallback(() => {
    const total = remaining !== null && remaining > 0 ? remaining : hours * 3600 + minutes * 60 + seconds;
    if(total <= 0) return;
    deadline.current = Date.now() + total * 1000; setRemaining(total); setIsRunning(true);
  }, [hours, minutes, seconds, remaining]);

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

  return (<UtilityDesignLayout>
    <div>
      <ToolExampleClearActions onExample={() => { reset(); setHours(0); setMinutes(0); setSeconds(5); }} onClear={() => { reset(); setHours(0); setMinutes(0); setSeconds(0); }}/>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Countdown</span>
        {isRunning && <span style={{ color: 'var(--tb-accent)', fontSize: 12 }}>Running...</span>}
      </div>
      <div className="tb-v2-tool-output-body" style={{ textAlign: 'center', padding: 24 }}>
        <div style={{ fontSize: 'clamp(24px, 8vw, 56px)', fontWeight: 700, fontFamily: 'var(--f-mono)', color: 'var(--tb-accent)' }}>
          {formatTime(totalSeconds)}
        </div>
      </div>

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Set Duration</span>
      </div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, color: 'var(--tb-text-secondary)', display: 'block', marginBottom: 4 }}>Hours</label>
          <input aria-label="Hours"
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
          <input aria-label="Minutes"
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
          <input aria-label="Seconds"
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
  </UtilityDesignLayout>
  );
}
