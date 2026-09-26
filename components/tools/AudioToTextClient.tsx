'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import { useEffect, useRef, useState } from 'react';
import ToolExampleClearActions from './ToolExampleClearActions';
export default function AudioToTextClient() {
  const [transcript,setTranscript]=useState(''), [manualText,setManualText]=useState('');
  const [supported,setSupported]=useState(false), [listening,setListening]=useState(false), [error,setError]=useState('');
  const recognition=useRef<any>(null), active=useRef(false);
  useEffect(()=>{
    const Constructor=(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(Boolean(Constructor));
    return ()=>{ active.current=false; recognition.current?.abort(); };
  },[]);
  const clear=()=>{ active.current=false; recognition.current?.abort(); recognition.current=null; setListening(false); setTranscript(''); setManualText(''); setError(''); };
  const start=()=>{
    clear();
    try {
      const Constructor=(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if(!Constructor) throw new Error('Speech recognition is not supported in this browser.');
      const r=new Constructor(); recognition.current=r; active.current=true;
      r.continuous=true; r.interimResults=true; r.lang='en-US';
      r.onresult=(event:any)=>{
        if(!active.current || recognition.current!==r) return;
        // results is the whole session, not just the newest event.
        const parts=[];
        for(let i=0;i<event.results.length;i++) parts.push(event.results[i][0].transcript);
        setTranscript(parts.join(' ').slice(0,100000));
      };
      r.onstart=()=>{ if(active.current && recognition.current===r) setListening(true); };
      r.onerror=(event:any)=>{ if(recognition.current===r && active.current) { setError(`Speech recognition failed: ${event.error || 'unknown error'}. Check microphone permission and service availability.`); active.current=false; setListening(false); } };
      r.onend=()=>{ if(recognition.current===r) { active.current=false; setListening(false); } };
      r.start();
    } catch(e) { active.current=false; setListening(false); setError((e as Error).message); }
  };
  return <UtilityDesignLayout><div className="tb-v2-section">
    <ToolExampleClearActions onExample={()=>{clear();setManualText('This is an example transcript, not microphone recognition.');}} onClear={clear}/>
    <p>Live transcription uses your browser’s speech service and microphone permission. Manual text is not a recognition test.</p>
    {supported ? <button className="tb-v2-btn" onClick={()=>listening?recognition.current?.stop():start()}>{listening?'Stop Listening':'Start Listening'}</button> : <p role="status">Speech recognition is not supported in this browser.</p>}
    {error && <p role="alert">{error}</p>}
    <label>Manual transcript<textarea aria-label="Manual transcript" className="tb-v2-tool-textarea" maxLength={100000} value={manualText} onChange={e=>setManualText(e.target.value)}/></label>
    <button className="tb-v2-btn" disabled={!manualText.trim()} onClick={()=>{active.current=false;recognition.current?.abort();setListening(false);setTranscript(manualText);}}>Use This Text</button>
    <pre aria-label="Transcript" className="tb-v2-tool-output-body" style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{transcript}</pre>
    {transcript && <button className="tb-v2-copy-btn" onClick={()=>navigator.clipboard.writeText(transcript).catch(()=>setError('Clipboard unavailable. Select the transcript to copy.'))}>Copy</button>}
  </div></UtilityDesignLayout>;
}
