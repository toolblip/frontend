"use client";
import { useState } from 'react';

type AnimType = 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'bounce' | 'pulse' | 'shake' | 'rotate' | 'spin' | 'scale' | 'flip';

const ANIMATIONS: Record<AnimType, string> = {
  fadeIn: `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`,
  fadeInUp: `@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`,
  fadeInDown: `@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }`,
  fadeInLeft: `@keyframes fadeInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }`,
  fadeInRight: `@keyframes fadeInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`,
  slideUp: `@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`,
  slideDown: `@keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }`,
  slideLeft: `@keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }`,
  slideRight: `@keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } }`,
  bounce: `@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }`,
  pulse: `@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }`,
  shake: `@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }`,
  rotate: `@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`,
  spin: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`,
  scale: `@keyframes scale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }`,
  flip: `@keyframes flip { from { transform: perspective(400px) rotateY(0); } to { transform: perspective(400px) rotateY(360deg); } }`,
};

export default function CssAnimationGeneratorClient() {
  const [anim, setAnim] = useState<AnimType>('fadeIn');
  const [duration, setDuration] = useState(0.5);
  const [timing, setTiming] = useState('ease');
  const [delay, setDelay] = useState(0);
  const [iterations, setIterations] = useState(1);
  const [copied, setCopied] = useState(false);

  const [replay, setReplay] = useState(0);

  const cssCode = `.animated-element {
  animation: ${anim} ${duration}s ${timing} ${delay}s ${iterations};
}`;

  const animStyle: React.CSSProperties = {
    animation: `${anim} ${duration}s ${timing} ${delay}s ${iterations}`,
    animationPlayState: 'running',
  };

  const copy = () => {
    navigator.clipboard.writeText(ANIMATIONS[anim] + '\n\n' + cssCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Animation Type</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {(Object.keys(ANIMATIONS) as AnimType[]).map(a => (
          <button key={a} onClick={() => { setAnim(a); setReplay(r => r + 1); }}
            className={`tb-v2-mode-tab ${anim === a ? 'on' : ''}`}
            style={{ fontSize: '0.75rem', padding: '0.5rem' }}>
            {a}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <label className="tb-v2-tool-label">Duration: {duration}s</label>
          <input type="range" min={0.1} max={3} step={0.1} value={duration}
            onChange={e => setDuration(+e.target.value)} className="w-full" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Delay: {delay}s</label>
          <input type="range" min={0} max={3} step={0.1} value={delay}
            onChange={e => setDelay(+e.target.value)} className="w-full" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Iterations</label>
          <select value={iterations} onChange={e => setIterations(+e.target.value)}
            className="tb-v2-tool-textarea" style={{ padding: '0.5rem' }}>
            <option value={1}>1</option><option value={2}>2</option>
            <option value={3}>3</option><option value={5}>5</option>
            <option value={-1}>Infinite</option>
          </select>
        </div>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label className="tb-v2-tool-label">Timing Function</label>
        <select value={timing} onChange={e => setTiming(e.target.value)}
          className="tb-v2-tool-textarea" style={{ padding: '0.5rem' }}>
          {['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier(0.68,-0.55,0.265,1.55)'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div style={{ padding: '2rem', background: '#f3f4f6', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem' }}>
        <div key={replay} style={{
          ...animStyle, display: 'inline-block', padding: '1rem 2rem',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '8px', color: '#fff', fontWeight: 600,
        }}>Animated Box</div>
      </div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSS</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{ background: '#1a1a2e', color: '#a5f3fc', padding: '1rem', borderRadius: '8px',
        fontFamily: 'monospace', fontSize: '0.875rem', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
{ANIMATIONS[anim] + '\n\n' + cssCode}</pre>
    </div>
  );
}
