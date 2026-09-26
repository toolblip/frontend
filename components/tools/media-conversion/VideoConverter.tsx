'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import ToolExampleClearActions from '../ToolExampleClearActions';
import { parseSubtitles, renderVideo, type CaptionStyle } from '@/lib/media-conversion/video';
import { mediaContainer } from '@/lib/media-conversion/audio';
import { useMediaJob } from './useMediaJob';
import Result from './Result';
export default function VideoConverter({ subtitles = false }: { subtitles?: boolean }) {
  const [file, setFile] = useState<File | null>(null), [url, setUrl] = useState(''), [duration, setDuration] = useState(0), [start, setStart] = useState('0'), [end, setEnd] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [text, setText] = useState(''), [style, setStyle] = useState<CaptionStyle>({ size: 24, color: '#ffffff', background: '#000000', effect: 'default' });
  const activeCaption = useMemo(() => { try { return text.trim() ? parseSubtitles(text).filter(c => currentTime >= c.start && currentTime < c.end).map(c => c.text).join('\n') : ''; } catch { return ''; } }, [text, currentTime]);
  const fileRef = useRef<HTMLInputElement>(null), subRef = useRef<HTMLInputElement>(null), videoRef = useRef<HTMLVideoElement>(null); const job = useMediaJob();
  useEffect(() => { if (!file) { setUrl(''); return; } const value = URL.createObjectURL(file); setUrl(value); return () => URL.revokeObjectURL(value); }, [file]);
  const clear = () => { job.cancel(); videoRef.current?.pause(); setFile(null); setDuration(0); setStart('0'); setEnd(''); setText(''); setCurrentTime(0); if (fileRef.current) fileRef.current.value = ''; if (subRef.current) subRef.current.value = ''; };
  const choose = (f: File) => { job.cancel(); videoRef.current?.pause(); setFile(null); setDuration(0); setStart('0'); setEnd(''); if (!f.size || f.size > 30 * 1024 * 1024) job.setError('Choose a nonempty video up to 30 MB.'); else setFile(f); };
  const example = () => { clear(); void job.run(async signal => { const r = await fetch('/samples/media-conversion/example.mp4', { signal }); if (!r.ok) throw new Error('Example unavailable.'); const blob = await r.blob(); signal.throwIfAborted(); setFile(new File([blob], 'example.mp4', { type: 'video/mp4' })); if (subtitles) setText('1\n00:00:00,000 --> 00:00:02,000\nExample caption'); return null; }); };
  const updateStyle = (value: Partial<CaptionStyle>) => { job.cancel(); setStyle(s => ({ ...s, ...value })); };
  const convert = () => job.run(async signal => {
    if (!file) throw new Error('Choose a video.');
    const kind = mediaContainer(new Uint8Array(await file.slice(0, 64).arrayBuffer()));
    if (kind !== 'mp4' && kind !== 'mkv') throw new Error('Choose a valid MP4, MOV with ftyp, WebM or MKV container.');
    if (!start.trim() || !end.trim()) throw new Error('Enter start and end seconds.');
    const cues = subtitles ? parseSubtitles(text) : [];
    if (subtitles && !cues.some(c => c.start < Number(end) && c.end > Number(start))) throw new Error('No subtitle cues overlap the selected range.');
    videoRef.current?.pause();
    const result = await renderVideo(file, Number(start), Number(end), cues, style, signal);
    return { blob: result.blob, name: subtitles ? 'subtitled.webm' : 'trimmed.webm', detail: `${result.width} × ${result.height} · requested range ${start}–${end} seconds · re-encoded WebM`, preview: 'video' };
  });
  return <div className="tb-v2-section" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 12, minWidth: 0 }}>
    <div className="tb-v2-tool-input-head" style={{ flexWrap: 'wrap', gap: 8 }}><span className="tb-v2-tool-label">{subtitles ? 'Burn subtitles into video' : 'Cut video'}</span><ToolExampleClearActions exampleDisabled={!job.ready} onExample={example} onClear={clear} /></div>
    <p>MP4/MOV, WebM or MKV if your browser can decode it. Maximum 30 MB, 120 source seconds, 2,073,600 pixels and 60 seconds per export. A browser-decodable audio track is required. Recording runs in real time; keep this tab visible. Output is re-encoded WebM with audio, not a lossless cut. Cuts have frame-level timing tolerance.</p>
    <input ref={fileRef} type="file" accept="video/*,.mkv" aria-label="Video file" style={{ maxWidth: '100%' }} onChange={e => { if (e.target.files?.[0]) choose(e.target.files[0]); }} />
    {url && <div style={{ position: 'relative' }}><video ref={videoRef} src={url} controls onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)} style={{ width: '100%' }} onLoadedMetadata={e => { const v = e.currentTarget; if (!Number.isFinite(v.duration) || !v.videoWidth || v.videoWidth * v.videoHeight > 2073600) { job.setError('Unsupported video duration or dimensions.'); setDuration(0); } else { setDuration(v.duration); setEnd(String(Math.min(v.duration, 60))); } }} onError={() => job.setError('This browser cannot decode the selected video.')} />{subtitles && activeCaption && <div aria-label="Caption preview" style={{ position: 'absolute', bottom: 48, left: 0, right: 0, pointerEvents: 'none', whiteSpace: 'pre-wrap', textAlign: 'center', color: style.color, background: style.background, fontSize: style.size, textShadow: style.effect === 'default' ? undefined : '1px 1px 2px #000' }}>{activeCaption}</div>}</div>}
    {duration > 0 && <p>Source duration: {duration.toFixed(3)} seconds</p>}
    <label>Start seconds<input className="tb-v2-input" aria-label="Start seconds" type="number" min={0} step={0.1} value={start} onChange={e => { job.cancel(); setStart(e.target.value); }} /></label>
    <label>End seconds<input className="tb-v2-input" aria-label="End seconds" type="number" min={0} step={0.1} value={end} onChange={e => { job.cancel(); setEnd(e.target.value); }} /></label>
    {subtitles && <>
      <input ref={subRef} type="file" accept=".srt,.vtt" aria-label="Subtitle file" style={{ maxWidth: '100%' }} onChange={e => { const f = e.target.files?.[0]; if (f) { job.cancel(); setText(''); void job.run(async signal => { if (f.size > 100000) throw new Error('Subtitles exceed 100 KB.'); const content = await f.text(); signal.throwIfAborted(); parseSubtitles(content); setText(content); return null; }); } }} />
      <textarea className="tb-v2-tool-textarea" aria-label="Subtitles" value={text} maxLength={100001} onChange={e => { job.cancel(); setText(e.target.value); }} />
      <label>Text color<input type="color" aria-label="Text color" value={style.color} onChange={e => updateStyle({ color: e.target.value })} /></label>
      <label>Caption background<input type="color" aria-label="Caption background" value={style.background} onChange={e => updateStyle({ background: e.target.value })} /></label>
      <label>Font size at 640px width<input type="range" min={16} max={48} aria-label="Font size" value={style.size} onChange={e => updateStyle({ size: Number(e.target.value) })} /></label>
      <label>Caption style<select aria-label="Caption style" className="tb-v2-select" value={style.effect} onChange={e => updateStyle({ effect: e.target.value as CaptionStyle['effect'] })}><option value="default">Default</option><option value="outline">Outline</option><option value="shadow">Shadow</option></select></label>
      <p>Export burns plain caption text into frames. VTT positioning and inline markup aren't preserved.</p>
    </>}
    <button className="tb-v2-btn tb-v2-btn-primary" disabled={!file || !duration || job.busy} onClick={convert}>{job.busy ? 'Recording…' : 'Convert'}</button>
    {job.busy && <button className="tb-v2-btn" onClick={job.cancel}>Cancel</button>}
    {job.error && <p role="alert">{job.error}</p>}{job.result && <Result result={job.result} />}
  </div>;
}
