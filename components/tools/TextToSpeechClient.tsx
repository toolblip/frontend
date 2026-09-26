'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import ToolExampleClearActions from './ToolExampleClearActions';

import { useState, useEffect, useRef } from 'react';

export default function TextToSpeechClient() {
  const generation = useRef(0);
  const [error, setError] = useState('');
  const [supported, setSupported] = useState(false);
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  const loadVoices = () => {
    const availableVoices = window.speechSynthesis.getVoices();
    setVoices(availableVoices);
    if (availableVoices.length > 0 && !selectedVoice) {
      const english = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
      setSelectedVoice(english?.name || '');
    }
  };

  useEffect(() => {
    setIsMounted(true);
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;
    setSupported(true); loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => { generation.current++; window.speechSynthesis.cancel(); window.speechSynthesis.removeEventListener('voiceschanged', loadVoices); };
  }, []);

  const speak = () => {
    if (!text.trim() || !supported) return;
    const id = ++generation.current; setError('');
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => { if (id === generation.current) setIsSpeaking(true); };
    utterance.onend = () => { if (id === generation.current) setIsSpeaking(false); };
    utterance.onerror = (event) => { if (id === generation.current) { setIsSpeaking(false); setError(`Speech failed: ${event.error}`); } };

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    generation.current++; window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  if (!isMounted) {
    return (
      <div>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">Text to Convert</span>
        </div>
        <textarea maxLength={100000}
          placeholder="Enter text to convert to speech..."
          className="tb-v2-tool-textarea"
          style={{ minHeight: 120 }}
          disabled
          aria-label="Text input for speech synthesis"
        />
      </div>
    );
  }

  return (<UtilityDesignLayout>
    <div onChangeCapture={() => {stop();setError('');}}>
      <ToolExampleClearActions onExample={() => { stop(); setText('Hello. This is an example of browser speech synthesis.'); setError(''); }} onClear={() => { stop(); setText(''); setError(''); }}/>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to Convert</span>
      </div>
      {!supported && <p role="status">Speech synthesis is not supported in this browser.</p>}
      {supported && voices.length === 0 && <p role="status">No voices are currently available. Playback depends on your browser and operating system.</p>}
      {error && <p role="alert">{error}</p>}
      <textarea maxLength={100000}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to speech..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120 }}
        aria-label="Text input for speech synthesis"
      />

      <div className="tb-v2-tool-input-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">Voice Settings</span>
      </div>
      <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: 'var(--tb-text-secondary)', display: 'block', marginBottom: 4 }}>Voice</label>
          <select aria-label="Selected Voice"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="tb-v2-tool-textarea"
            style={{ width: '100%' }}
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--tb-text-secondary)', display: 'block', marginBottom: 4 }}>Speed: {rate}x</label>
            <input aria-label="Rate" type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--tb-text-secondary)', display: 'block', marginBottom: 4 }}>Pitch: {pitch}x</label>
            <input aria-label="Pitch" type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button type="button" disabled={!supported || !text.trim()} onClick={isSpeaking ? stop : speak} className="tb-v2-copy-btn" style={{ flex: 1, background: isSpeaking ? '#ef4444' : 'var(--tb-accent)', color: '#fff' }}>
          {isSpeaking ? '⏹ Stop' : '▶ Speak'}
        </button>

      </div>
    </div>
  </UtilityDesignLayout>
  );
}
