'use client';
import DeveloperGeneralFrame from './DeveloperGeneralFrame';

import ToolExampleClearActions from './ToolExampleClearActions';
import { useEffect, useRef, useState } from 'react';

type Status = 'disconnected' | 'connecting' | 'connected' | 'error';
type LogType = 'sent' | 'received' | 'system' | 'error';

interface LogEntry {
  id: number;
  type: LogType;
  text: string;
  time: string;
}

const STATUS_LABELS: Record<Status, string> = {
  disconnected: 'Disconnected',
  connecting: 'Connecting…',
  connected: 'Connected',
  error: 'Error',
};

const STATUS_COLORS: Record<Status, string> = {
  disconnected: 'var(--fg-2)',
  connecting: '#d97706',
  connected: '#16a34a',
  error: '#dc2626',
};

const LOG_COLORS: Record<LogType, string> = {
  sent: '#2563eb',
  received: '#16a34a',
  system: 'var(--fg-2)',
  error: '#dc2626',
};

const LOG_PREFIX: Record<LogType, string> = {
  sent: '↑ sent',
  received: '↓ recv',
  system: '• system',
  error: '✕ error',
};

let nextLogId = 1;

export default function WebSocketTesterClient() {
  const [url, setUrl] = useState('wss://echo.websocket.org');
  const [status, setStatus] = useState<Status>('disconnected');
  const [message, setMessage] = useState('Hello from Toolblip!');
  const [log, setLog] = useState<LogEntry[]>([]);
  const timeoutRef=useRef<ReturnType<typeof setTimeout> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const appendLog = (type: LogType, text: string) => {
    setLog(cur => [...cur.slice(-199), { id: nextLogId++, type, text: text.slice(0, 50000), time: new Date().toLocaleTimeString() }]);
  };

  const connect = () => {
    if (!/^wss?:\/\//i.test(url)) {setStatus('error');appendLog('error','Enter a ws:// or wss:// URL');return;}
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('connecting');
    appendLog('system', `Connecting to ${url}...`);
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;
      if(timeoutRef.current)clearTimeout(timeoutRef.current);
      timeoutRef.current=setTimeout(()=>{if(wsRef.current===ws && ws.readyState!==WebSocket.OPEN){wsRef.current=null;ws.close();setStatus('error');appendLog('error','Connection timed out after 10 seconds');}},10000);
      ws.onopen = () => {
        if(wsRef.current !== ws)return;
        if(timeoutRef.current)clearTimeout(timeoutRef.current);
        setStatus('connected');
        appendLog('system', 'Connection established.');
      };
      ws.onmessage = (ev: MessageEvent) => {
        if(wsRef.current !== ws)return;
        appendLog('received', typeof ev.data === 'string' ? ev.data : '[binary data]');
      };
      ws.onerror = () => {
        if(wsRef.current !== ws)return;
        setStatus('error');
        appendLog('error', 'A WebSocket error occurred.');
      };
      ws.onclose = (ev: CloseEvent) => {
        if(wsRef.current !== ws)return;
        setStatus('disconnected');
        appendLog('system', `Connection closed${ev.code ? ` (code ${ev.code})` : ''}.`);
        wsRef.current = null;
      };
    } catch (e) {
      setStatus('error');
      appendLog('error', `Failed to open connection: ${(e as Error).message}`);
    }
  };

  const disconnect = () => {
    if(timeoutRef.current)clearTimeout(timeoutRef.current);
    const ws=wsRef.current;wsRef.current=null;ws?.close();setStatus('disconnected');
  };

  const send = () => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN || !message.trim()) return;
    if(message.length>50000){appendLog('error','Message limit: 50,000 characters');return;}
    try {ws.send(message);}catch(e){appendLog('error',(e as Error).message);return;}
    appendLog('sent', message);
    setMessage('');
  };

  useEffect(() => {
    return () => {
      if(timeoutRef.current)clearTimeout(timeoutRef.current);
      const ws=wsRef.current;wsRef.current=null;ws?.close();
    };
  }, []);

  const clearLog = () => setLog([]);

  return (
    <DeveloperGeneralFrame><div className="tb-v2-tool-card">
      <ToolExampleClearActions onExample={()=>{disconnect();setUrl('wss://echo.websocket.org');setMessage('Hello from Toolblip!');setLog([]);}} onClear={()=>{disconnect();setUrl('');setMessage('');setLog([]);}}/>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">WebSocket URL</span>
      </div>
      <div className="tb-v2-grid-2">
        <input aria-label="Url" maxLength={8000}
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="wss://echo.websocket.org"
          className="tb-v2-input"
          style={{ fontFamily: 'var(--f-mono)' }}
          disabled={status === 'connected' || status === 'connecting'}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={connect}
            disabled={status === 'connected' || status === 'connecting' || !url.trim()}
            className="tb-v2-btn tb-v2-btn-primary"
          >
            Connect
          </button>
          <button
            type="button"
            onClick={disconnect}
            disabled={status === 'disconnected'}
            className="tb-v2-btn"
          >
            Disconnect
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_COLORS[status], display: 'inline-block' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: STATUS_COLORS[status] }}>{STATUS_LABELS[status]}</span>
      </div>

      <div className="tb-v2-tool-input-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">Message</span>
      </div>
      <div className="tb-v2-grid-2">
        <textarea aria-label="Message" maxLength={100000}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type a message to send..."
          className="tb-v2-tool-textarea"
          style={{ fontFamily: 'var(--f-mono)', minHeight: 60 }}
        />
        <button
          type="button"
          onClick={send}
          disabled={status !== 'connected' || !message.trim()}
          className="tb-v2-btn tb-v2-btn-primary"
          style={{ alignSelf: 'flex-start' }}
        >
          Send
        </button>
      </div>

      <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">Message log</span>
        <button type="button" onClick={clearLog} disabled={log.length === 0} className="tb-v2-copy-btn">
          Clear log
        </button>
      </div>
      <div className="tb-v2-tool-output-body" style={{ maxHeight: 320, overflowY: 'auto', fontFamily: 'var(--f-mono)', fontSize: 12 }}>
        {log.length === 0 ? (
          <p className="tb-v2-empty">No activity yet. Connect and send a message to see the log.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {log.map(entry => (
              <div key={entry.id} style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--fg-2)', flexShrink: 0 }}>{entry.time}</span>
                <span style={{ color: LOG_COLORS[entry.type], flexShrink: 0 }}>{LOG_PREFIX[entry.type]}</span>
                <span style={{ wordBreak: 'break-word' }}>{entry.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div></DeveloperGeneralFrame>
  );
}
