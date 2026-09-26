'use client';
import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import ToolExampleClearActions from '../ToolExampleClearActions';
import { decodeAudio, pcmWav, pcmMp3 } from '@/lib/media-conversion/audio';
import { useMediaJob } from './useMediaJob';
import Result from './Result';
export default function AudioConverter({ mp3 = false, extract = false }: { mp3?: boolean; extract?: boolean }) {
  const slug = usePathname().split('/').pop() || '';
  const expected = extract ? undefined : slug.startsWith('aac') ? 'aac' : slug.startsWith('mkv') ? 'mkv' : 'mp4';
  const extension = expected === 'aac' ? 'aac' : expected === 'mkv' ? 'mkv' : slug.startsWith('m4a') ? 'm4a' : 'mp4';
  const [file, setFile] = useState<File | null>(null), [format, setFormat] = useState(mp3 ? 'mp3' : 'wav');
  const inputRef = useRef<HTMLInputElement>(null); const job = useMediaJob();
  const clear = () => { job.cancel(); setFile(null); if (inputRef.current) inputRef.current.value = ''; };
  const choose = (f: File) => { clear(); if (!f.size || f.size > 20 * 1024 * 1024) job.setError('Choose a nonempty file up to 20 MB.'); else setFile(f); };
  const example = () => { clear(); void job.run(async signal => { const r = await fetch(`/samples/media-conversion/example.${extension}`, { signal }); if (!r.ok) throw new Error('Example unavailable.'); const blob = await r.blob(); signal.throwIfAborted(); setFile(new File([blob], `example.${extension}`, { type: blob.type })); return null; }); };
  const convert = () => job.run(async signal => {
    if (!file) throw new Error('Choose a file.');
    const audio = await decodeAudio(file, signal, expected); signal.throwIfAborted();
    const channels = Array.from({ length: audio.numberOfChannels }, (_, c) => audio.getChannelData(c));
    if (format === 'mp3') {
      const blob = await pcmMp3(channels, audio.sampleRate, signal);
      return { blob, name: file.name.replace(/\.[^.]+$/, '') + '.mp3', detail: `${audio.duration.toFixed(3)} seconds · ${audio.sampleRate} Hz · ${audio.numberOfChannels} channel(s) · 128 kbps MP3`, preview: 'audio' };
    }
    const wav = pcmWav(Array.from({ length: audio.numberOfChannels }, (_, c) => audio.getChannelData(c)), audio.sampleRate);
    return { blob: new Blob([wav], { type: 'audio/wav' }), name: file.name.replace(/\.[^.]+$/, '') + '.wav', detail: `${audio.duration.toFixed(3)} seconds · ${audio.sampleRate} Hz · ${audio.numberOfChannels} channel(s) · 16-bit PCM`, preview: 'audio' };
  });
  return <div className="tb-v2-section" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 12, minWidth: 0, overflowWrap: 'anywhere' }}>
    <div className="tb-v2-tool-input-head" style={{ flexWrap: 'wrap', gap: 8 }}><span className="tb-v2-tool-label">{extract ? 'Extract audio to WAV' : 'Audio conversion'}</span><ToolExampleClearActions exampleDisabled={!job.ready} onExample={example} onClear={clear} /></div>
    <p>Maximum 20 MB and 120 decoded seconds. Browser decoders determine supported codecs; a valid container alone doesn't guarantee support. WAV export contains decoded PCM audio.</p>
    {mp3 && <p role="note">MP3 exports use the LAME encoder at 128 kbps, for mono or stereo audio. WAV is also available.</p>}
    <input ref={inputRef} type="file" aria-label="Media file" accept={extract ? 'video/*,audio/*' : `.${extension}`} style={{ maxWidth: '100%' }} onChange={e => { if (e.target.files?.[0]) choose(e.target.files[0]); }} />
    {file && <p>{file.name} · {file.size} bytes</p>}
    {mp3 && <label>Output format<select className="tb-v2-select" aria-label="Output format" value={format} onChange={e => { job.cancel(); setFormat(e.target.value); }}><option value="mp3">MP3 (128 kbps)</option><option value="wav">WAV (16-bit PCM)</option></select></label>}
    <button className="tb-v2-btn tb-v2-btn-primary" disabled={!file || job.busy} onClick={convert}>{job.busy ? 'Converting…' : 'Convert'}</button>
    {job.busy && <button className="tb-v2-btn" onClick={job.cancel}>Cancel</button>}
    {job.error && <p role="alert">{job.error}</p>}{job.result && <Result result={job.result} />}
  </div>;
}
