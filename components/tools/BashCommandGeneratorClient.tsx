'use client';

import { useState } from 'react';

interface Cmd { label: string; template: string; args?: string[]; }

const COMMANDS: Cmd[] = [
  { label: 'List Files', template: 'ls -la {path}', args: ['path'] },
  { label: 'Find File', template: 'find {path} -name "{pattern}"', args: ['path', 'pattern'] },
  { label: 'Kill Process', template: 'kill -9 {pid}', args: ['pid'] },
  { label: 'Git Status', template: 'git status' },
  { label: 'Git Log', template: 'git log --oneline -{n}', args: ['n'] },
  { label: 'Docker PS', template: 'docker ps' },
  { label: 'Docker Logs', template: 'docker logs -f {container}', args: ['container'] },
  { label: 'NPM Install', template: 'npm install {package}', args: ['package'] },
  { label: 'Git Diff', template: 'git diff {file}', args: ['file'] },
  { label: 'Grep', template: 'grep -rn "{pattern}" {path}', args: ['pattern', 'path'] },
  { label: 'Tar Archive', template: 'tar -czvf {output}.tar.gz {path}', args: ['output', 'path'] },
  { label: 'Curl Headers', template: 'curl -I {url}', args: ['url'] },
];

export default function BashCommandGeneratorClient() {
  const [selected, setSelected] = useState<Cmd | null>(null);
  const [args, setArgs] = useState<Record<string, string>>({});

  const generate = () => {
    if (!selected) return '';
    let cmd = selected.template;
    (selected.args || []).forEach(a => { cmd = cmd.replace(`{${a}}`, args[a] || ''); });
    return cmd;
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Select Command</span></div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {COMMANDS.map((cmd, i) => (
          <button key={i} onClick={() => { setSelected(cmd); setArgs({}); }} className={`tb-v2-mode-tab ${selected?.label === cmd.label ? 'on' : ''}`} style={{ fontSize: 11, padding: '4px 8px' }}>
            {cmd.label}
          </button>
        ))}
      </div>
      {selected?.args && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {selected.args.map(arg => (
            <label key={arg} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>{arg}</span>
              <input
                type="text"
                value={args[arg] || ''}
                onChange={e => setArgs({ ...args, [arg]: e.target.value })}
                className="tb-v2-tool-textarea"
                style={{ width: 180, minHeight: 32, resize: 'none', fontFamily: 'var(--f-mono)' }}
                placeholder={arg}
              />
            </label>
          ))}
        </div>
      )}
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Generated Command</span></div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13, background: 'var(--tb-bg-secondary)', padding: 12, borderRadius: 8 }}>{generate() || ' - '}</pre>
      </div>
    </div>
  );
}
