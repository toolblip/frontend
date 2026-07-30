'use client';

import { useState, useMemo } from 'react';

interface AnimationDef {
  name: string;
  label: string;
  keyframes: string;
}

const ANIMATIONS: AnimationDef[] = [
  {
    name: 'fade-in',
    label: 'Fade In',
    keyframes: `0% { opacity: 0; }\n  100% { opacity: 1; }`,
  },
  {
    name: 'slide-in',
    label: 'Slide In',
    keyframes: `0% { transform: translateX(-40px); opacity: 0; }\n  100% { transform: translateX(0); opacity: 1; }`,
  },
  {
    name: 'bounce',
    label: 'Bounce',
    keyframes: `0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-20px); }`,
  },
  {
    name: 'spin',
    label: 'Spin',
    keyframes: `0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }`,
  },
  {
    name: 'pulse',
    label: 'Pulse',
    keyframes: `0%, 100% { transform: scale(1); opacity: 1; }\n  50% { transform: scale(1.1); opacity: 0.8; }`,
  },
  {
    name: 'shake',
    label: 'Shake',
    keyframes: `0%, 100% { transform: translateX(0); }\n  25% { transform: translateX(-8px); }\n  75% { transform: translateX(8px); }`,
  },
];

const TIMING_FUNCTIONS = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'];
const DIRECTIONS = ['normal', 'reverse', 'alternate', 'alternate-reverse'];

function buildCss(anim: AnimationDef, duration: number, timing: string, iterations: string, direction: string, delay: number): string {
  return `@keyframes ${anim.name} {\n  ${anim.keyframes}\n}\n\n.animate-${anim.name} {\n  animation: ${anim.name} ${duration}s ${timing} ${delay ? `${delay}s ` : ''}${iterations} ${direction};\n}`;
}

export default function CssAnimationGeneratorClient() {
  const [animName, setAnimName] = useState(ANIMATIONS[0].name);
  const [duration, setDuration] = useState(1);
  const [timing, setTiming] = useState('ease-in-out');
  const [infinite, setInfinite] = useState(true);
  const [direction, setDirection] = useState('normal');
  const [delay, setDelay] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const anim = ANIMATIONS.find(a => a.name === animName) ?? ANIMATIONS[0];
  const iterations = infinite ? 'infinite' : '1';
  const css = useMemo(
    () => buildCss(anim, duration, timing, iterations, direction, delay),
    [anim, duration, timing, iterations, direction, delay]
  );

  const replay = () => setReplayKey(k => k + 1);

  const copy = () => {
    navigator.clipboard.writeText(css).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Animation</span>
      </div>

      <div className="tb-v2-mode-tabs">
        {ANIMATIONS.map(a => (
          <button
            key={a.name}
            type="button"
            onClick={() => { setAnimName(a.name); replay(); }}
            className={`tb-v2-mode-tab ${animName === a.name ? 'on' : ''}`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="tb-v2-range-row">
        <label className="tb-v2-tool-label">Duration</label>
        <input
          type="range"
          min={0.1}
          max={5}
          step={0.1}
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
          className="tb-v2-range"
        />
        <span className="tb-v2-range-val">{duration.toFixed(1)}s</span>
      </div>

      <div className="tb-v2-range-row">
        <label className="tb-v2-tool-label">Delay</label>
        <input
          type="range"
          min={0}
          max={2}
          step={0.1}
          value={delay}
          onChange={e => setDelay(Number(e.target.value))}
          className="tb-v2-range"
        />
        <span className="tb-v2-range-val">{delay.toFixed(1)}s</span>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Timing Function</label>
          <select value={timing} onChange={e => setTiming(e.target.value)} className="tb-v2-input">
            {TIMING_FUNCTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Direction</label>
          <select value={direction} onChange={e => setDirection(e.target.value)} className="tb-v2-input">
            {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 self-end pb-2">
          <input type="checkbox" checked={infinite} onChange={e => setInfinite(e.target.checked)} />
          <span className="tb-v2-tool-label" style={{ margin: 0 }}>Loop infinitely</span>
        </label>
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Live Preview</div>
        <div className="flex items-center justify-center bg-gray-100 rounded-xl" style={{ height: 160 }}>
          <div
            key={replayKey}
            className="rounded-lg bg-red-500"
            style={{
              width: 60,
              height: 60,
              animation: `${anim.name} ${duration}s ${timing} ${delay}s ${iterations} ${direction}`,
            }}
          />
        </div>
        {!infinite && (
          <button type="button" onClick={replay} className="tb-v2-btn-sm" style={{ marginTop: 8 }}>
            Replay
          </button>
        )}
      </div>

      <style>{`@keyframes ${anim.name} { ${anim.keyframes} }`}</style>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">CSS Output</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{css}</pre>
      </div>
    </div>
  );
}
