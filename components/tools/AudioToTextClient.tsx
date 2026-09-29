'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import { useEffect, useRef, useState } from 'react';
export default function AudioToTextClient() {
  const [transcript,setTranscript]=useState(''), [copied,setCopied]=useState(false);
  const [supported,setSupported]=useState(false), [listening,setListening]=useState(false), [error,setError]=useState('');
  const recognition=useRef<any>(null), active=useRef(false);
  const permissionRequest=useRef(0);
  const copyReset=useRef<ReturnType<typeof setTimeout>|null>(null);
  const [permission,setPermission]=useState<'idle'|'requesting'|'granted'|'denied'>('idle');
  useEffect(()=>{
    const Constructor=(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(Boolean(Constructor));
    return ()=>{ permissionRequest.current++; active.current=false; recognition.current?.abort(); if(copyReset.current)clearTimeout(copyReset.current); };
  },[]);
  const cancel=()=>{permissionRequest.current++; active.current=false; recognition.current?.abort(); recognition.current=null; setListening(false);};
  const clear=()=>{ cancel(); setTranscript(''); setCopied(false); setPermission('idle'); setError(''); };
  const stop=()=>{active.current=false;recognition.current?.stop();setListening(false);};
  const copyTranscript=async()=>{
    if(!transcript)return;
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      if(copyReset.current)clearTimeout(copyReset.current);
      copyReset.current=setTimeout(()=>setCopied(false),2000);
    } catch {setError('Clipboard unavailable. Select the transcript to copy.');}
  };
  const start=async()=>{
    cancel();
    const request=permissionRequest.current;
    setTranscript('');setCopied(false);setError('');setPermission('requesting');
    try {
      const Constructor=(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if(!Constructor) throw new Error('Speech recognition is not supported in this browser.');
      if(!navigator.mediaDevices?.getUserMedia) throw new Error('Microphone access is unavailable. Use a secure browser connection and check your device settings.');
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      // Recognition opens its own capture. Release this permission check at once,
      // including when Clear canceled the request while the prompt was open.
      stream.getTracks().forEach(track=>track.stop());
      if(request!==permissionRequest.current)return;
      setPermission('granted');
      const r=new Constructor(); recognition.current=r; active.current=true;
      r.continuous=true; r.interimResults=true; r.lang='en-US';
      r.onresult=(event:any)=>{
        if(!active.current || recognition.current!==r) return;
        // results is the whole session, not just the newest event.
        const parts=[];
        for(let i=0;i<event.results.length;i++) parts.push(event.results[i][0].transcript);
        setTranscript(parts.join(' ').slice(0,100000));setCopied(false);
      };
      r.onstart=()=>{ if(active.current && recognition.current===r) setListening(true); };
      r.onerror=(event:any)=>{ if(recognition.current===r && active.current) {
        if(event.error==='not-allowed'||event.error==='service-not-allowed'){setPermission('denied');setError('Allow microphone access in your browser site settings, then try again.');}
        else setError(`Speech recognition failed: ${event.error || 'unknown error'}. Check your browser speech service and try again.`);
        active.current=false; setListening(false);
      } };
      r.onend=()=>{ if(recognition.current===r) { active.current=false; setListening(false); } };
      r.start();
    } catch(e) {
      if(request!==permissionRequest.current)return;
      active.current=false;setListening(false);
      const name=e instanceof Error?e.name:'';
      if(['NotAllowedError','PermissionDeniedError','SecurityError'].includes(name)){
        setPermission('denied');setError('Allow microphone access in your browser site settings, then try again.');
      }else if(['NotFoundError','DevicesNotFoundError'].includes(name)){
        setPermission('idle');setError('No microphone was found. Connect one and try again.');
      }else{setPermission('idle');setError((e as Error).message||'Could not start the microphone. Try again.');}
    }
  };
  return <UtilityDesignLayout><div className="tb-v2-section" style={{display:'grid',gap:16,padding:20}}>
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}><h2 style={{fontSize:18,fontWeight:700,margin:0}}>Record speech</h2><button type="button" className="tb-v2-tool-text-action" onClick={clear}>Clear</button></div>
      <p style={{margin:'8px 0 0'}}>Microphone access is needed to transcribe speech. Your browser will ask when you start listening.</p>
    </div>
    {supported ? <button type="button" className="tb-v2-btn tb-v2-btn-primary" style={{justifySelf:'start'}} onClick={()=>permission==='requesting'?clear():listening?stop():void start()}>{permission==='requesting'?'Cancel request':listening?'Stop Listening':'Start Listening'}</button> : <p role="status">Speech recognition is not supported in this browser.</p>}
    {permission==='requesting'&&<p role="status" className="tb-v2-banner tb-v2-banner-info">Waiting for microphone permission…</p>}
    {permission==='granted'&&<p role="status" className="speech-permission-success">Microphone allowed. {listening?'Listening now.':'Ready to listen.'}</p>}
    {error && <p role="alert" className="tb-v2-banner tb-v2-banner-err">{error}</p>}
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:8}}>
        <p className="tb-v2-tool-label" style={{margin:0}}>Transcript</p>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {copied&&<span role="status" style={{fontSize:12,color:'var(--fg-2)'}}>Copied</span>}
          <button type="button" aria-label="Copy transcript" title="Copy transcript" className="tb-v2-copy-btn" disabled={!transcript} onClick={()=>void copyTranscript()} style={{padding:7}}>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
          </button>
        </div>
      </div>
      <pre aria-label="Transcript" className="tb-v2-tool-output-body" style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',minHeight:90,border:'1px solid var(--line)',borderRadius:8}}>{transcript}</pre>
    </div>
  </div><style>{`.speech-permission-success { padding:12px 16px; border:1px solid #86d6a1; border-radius:8px; background:#eaf8ef; color:#176236; font-size:13.5px; font-weight:600; } [data-theme="dark"] .speech-permission-success, .dark .speech-permission-success { background:#123323; border-color:#287b49; color:#a6efbf; }`}</style></UtilityDesignLayout>;
}
