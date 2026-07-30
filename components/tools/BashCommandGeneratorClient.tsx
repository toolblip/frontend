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
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!selected) return '';
    let cmd = selected.template;
    (selected.args || []).forEach(a => { cmd = cmd.replace(`{${a}}`, args[a] || ''); });
    return cmd;
  };

  const command = generate();

  const copy = () => {
    if (!command) return;
    navigator.clipboard.writeText(command).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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

      {!selected && (
        <p className="tb-v2-empty" style={{ marginTop: 16 }}>
          Pick a command above to build a ready-to-run bash snippet with your own arguments filled in.
        </p>
      )}

      {selected && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Generated Command</span>
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre">{command}</pre>
          </div>
        </>
      )}
    </div>
  );
}
