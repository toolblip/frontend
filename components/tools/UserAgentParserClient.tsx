'use client';
import DeveloperGeneralFrame from './DeveloperGeneralFrame';

import ToolExampleClearActions from './ToolExampleClearActions';
import { useState } from 'react';

export function parseUA(ua: string) {
 const browsers: [string,RegExp][] = [['Edge',/Edg(?:e|A|iOS)?\/([\d.]+)/],['Opera',/(?:OPR|Opera)\/([\d.]+)/],['Samsung Browser',/SamsungBrowser\/([\d.]+)/],['Firefox',/(?:Firefox|FxiOS)\/([\d.]+)/],['Chrome',/(?:Chrome|CriOS)\/([\d.]+)/],['Safari',/Version\/([\d.]+).*Safari/],['IE',/(?:MSIE |rv:)([\d.]+)/]];
 const found=browsers.find(([,re])=>re.test(ua));
 const os=/iPhone|iPad|iPod/.test(ua)?'iOS':/Android/.test(ua)?'Android':/CrOS/.test(ua)?'Chrome OS':/Windows/.test(ua)?'Windows':/Mac OS X/.test(ua)?'macOS':/Linux/.test(ua)?'Linux':'Unknown';
 const device=/iPad|Tablet/.test(ua)||(/Android/.test(ua)&&!/Mobile/.test(ua))?'Tablet':/iPhone|Mobile|iPod/.test(ua)?'Mobile':/TV/.test(ua)?'TV':'Desktop';
 return {browser:found?.[0]??'Unknown',version:found?.[1].exec(ua)?.[1]??'',os,device,isBot:/bot|crawl|spider|slurp/i.test(ua)};
}

export default function UserAgentParserClient() {
  const [ua, setUA] = useState('');
  const p = parseUA(ua);
  const load = (s: string) => setUA({ chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36', firefox: 'Mozilla/5.0 Mac Intel Mac OS X 10_15_7 Gecko/20100101 Firefox/121.0', safari: 'Mozilla/5.0 iPhone CPU iPhone OS 17_2 like Mac OS X AppleWebKit/605.1.15 Version/17.2 Mobile/15E148 Safari/604.1', bot: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', edge: 'Mozilla/5.0 Windows NT 10.0 Win64 AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36 Edg/120.0.2210.91' }[s] || '');

  return (
    <DeveloperGeneralFrame><div>
      <ToolExampleClearActions onExample={() => {load('edge');}} onClear={() => {setUA('');}} />
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">User-Agent String</span></div>
      <textarea aria-label="Ua" maxLength={100000} value={ua} onChange={e => setUA(e.target.value)} placeholder="Paste a User-Agent string..." className="tb-v2-tool-textarea" style={{ minHeight: 80, fontFamily: 'var(--f-mono)', fontSize: 12 }} />
      <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
        {(['chrome', 'firefox', 'safari', 'edge', 'bot'] as const).map(s => (
          <button key={s} type="button" onClick={() => load(s)} className="tb-v2-mode-tab" style={{ fontSize: 11 }}>{s}</button>
        ))}
      </div>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Parsed Result</span></div>
      <div className="tb-v2-tool-output-body">
        {ua ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
            {[['Browser', p.browser + (p.version ? ` ${p.version}` : '')], ['OS', p.os], ['Device', p.device], ['Bot?', p.isBot ? '✅ Yes' : '❌ No']].map(([label, val]) => (
              <div key={label} style={{ background: 'var(--tb-bg-secondary)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{val}</div>
              </div>
            ))}
          </div>
        ) : <div style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Paste a User-Agent string to parse it</div>}
      </div>
    </div></DeveloperGeneralFrame>
  );
}
