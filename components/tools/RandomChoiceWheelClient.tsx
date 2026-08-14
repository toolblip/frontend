'use client';

import { useEffect, useRef, useState } from 'react';

interface Choice {
  id: number;
  label: string;
  weight: number;
}

let nextId = 1;

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];

const SIZE = 320;
const RADIUS = SIZE / 2 - 8;

function drawWheel(canvas: HTMLCanvasElement, choices: Choice[], rotation: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  ctx.clearRect(0, 0, SIZE, SIZE);

  const total = choices.reduce((sum, c) => sum + Math.max(0, c.weight), 0) || 1;
  let angle = rotation;

  choices.forEach((c, i) => {
    const slice = (Math.max(0, c.weight) / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, RADIUS, angle, angle + slice);
    ctx.closePath();
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label along the wedge's bisector.
    const mid = angle + slice / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(mid);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.font = '600 13px -apple-system, sans-serif';
    const label = c.label.length > 14 ? c.label.slice(0, 13) + '…' : c.label;
    ctx.fillText(label, RADIUS - 12, 0);
    ctx.restore();

    angle += slice;
  });

  // Center hub
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = '#ddd';
  ctx.stroke();
}

// Weighted-random winner selection: pick a point in [0, total), find its slice.
function pickWeightedWinner(choices: Choice[]): number {
  const total = choices.reduce((sum, c) => sum + Math.max(0, c.weight), 0);
  if (total <= 0) return Math.floor(Math.random() * choices.length);
  let r = Math.random() * total;
  for (let i = 0; i < choices.length; i++) {
    r -= Math.max(0, choices[i].weight);
    if (r <= 0) return i;
  }
  return choices.length - 1;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function RandomChoiceWheelClient() {
  const [choices, setChoices] = useState<Choice[]>([
    { id: nextId++, label: 'Pizza', weight: 1 },
    { id: nextId++, label: 'Sushi', weight: 1 },
    { id: nextId++, label: 'Tacos', weight: 1 },
    { id: nextId++, label: 'Burgers', weight: 1 },
  ]);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Choice | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) drawWheel(canvas, choices, rotationRef.current);
  }, [choices]);

  useEffect(() => {
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const updateChoice = (id: number, field: 'label' | 'weight', value: string) => {
    setChoices(cs => cs.map(c => (c.id === id ? { ...c, [field]: field === 'weight' ? Math.max(0, parseFloat(value) || 0) : value } : c)));
  };

  const addChoice = () => {
    setChoices(cs => [...cs, { id: nextId++, label: `Option ${cs.length + 1}`, weight: 1 }]);
  };

  const removeChoice = (id: number) => {
    setChoices(cs => (cs.length > 2 ? cs.filter(c => c.id !== id) : cs));
  };

  const spin = () => {
    if (spinning || choices.length < 2) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setWinner(null);
    setSpinning(true);

    // 1. Decide the real winner via weighted-random selection first.
    const winnerIndex = pickWeightedWinner(choices);
    const total = choices.reduce((sum, c) => sum + Math.max(0, c.weight), 0) || 1;
    let angleBefore = 0;
    for (let i = 0; i < winnerIndex; i++) angleBefore += (Math.max(0, choices[i].weight) / total) * Math.PI * 2;
    const winnerSlice = (Math.max(0, choices[winnerIndex].weight) / total) * Math.PI * 2;
    const winnerMid = angleBefore + winnerSlice / 2;

    // 2. Compute a target rotation that lands the winner's wedge at the top pointer (angle = -PI/2),
    //    with several extra full spins for visual flair.
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const startRotation = rotationRef.current;
    // We want: (winnerMid + finalRotation) mod 2PI === -PI/2 (pointer position)
    const targetMod = (-Math.PI / 2 - winnerMid) % (Math.PI * 2);
    const normalizedTarget = ((targetMod % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const currentMod = ((startRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    let delta = normalizedTarget - currentMod;
    if (delta < 0) delta += Math.PI * 2;
    const finalRotation = startRotation + delta + extraSpins * Math.PI * 2;

    const duration = 4200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      rotationRef.current = startRotation + (finalRotation - startRotation) * eased;
      const c = canvasRef.current;
      if (c) drawWheel(c, choices, rotationRef.current);

      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setSpinning(false);
        setWinner(choices[winnerIndex]);
      }
    };

    animRef.current = requestAnimationFrame(tick);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Choices</span>
        <button type="button" onClick={addChoice} className="tb-v2-btn-sm">+ Add Choice</button>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {choices.map(c => (
          <div key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              value={c.label}
              onChange={e => updateChoice(c.id, 'label', e.target.value)}
              className="tb-v2-input"
              style={{ flex: 1 }}
              placeholder="Label"
            />
            <input
              type="number"
              min={0}
              step={0.1}
              value={c.weight}
              onChange={e => updateChoice(c.id, 'weight', e.target.value)}
              className="tb-v2-input"
              style={{ width: 90 }}
              title="Weight"
            />
            <button type="button" onClick={() => removeChoice(c.id)} disabled={choices.length <= 2} className="tb-v2-btn-sm">Remove</button>
          </div>
        ))}
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Wheel</span>
      </div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
          <div
            style={{
              position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
              borderTop: '16px solid var(--red)', zIndex: 1,
            }}
          />
          <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ borderRadius: '50%', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }} />
        </div>

        <button
          type="button"
          onClick={spin}
          disabled={spinning || choices.length < 2}
          className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
        >
          {spinning ? 'Spinning...' : 'Spin the Wheel'}
        </button>

        {winner && !spinning && (
          <div className="tb-v2-stat-pill" style={{ maxWidth: 300 }}>
            <div className="tb-v2-stat-pill-val" style={{ fontSize: 22 }}>{winner.label}</div>
            <div className="tb-v2-stat-pill-lbl">Winner</div>
          </div>
        )}
      </div>
    </div>
  );
}
