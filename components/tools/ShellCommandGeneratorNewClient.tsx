"use client";
import { useState } from 'react';

const COMMANDS: Record<string, string[]> = {
  File: ['find . -name "*.txt" -exec grep -l "pattern" {} +', 'chmod 755 script.sh', 'ln -s /path/to/file link', 'tar -czvf archive.tar.gz ./folder'],
  Network: ['curl -I https://example.com', 'netstat -tuln', 'ssh user@host -p 22', 'wget --mirror --convert-links https://example.com'],
  Git: ['git log --oneline --graph --all', 'git rebase -i HEAD~5', 'git stash pop', 'git diff --stat main..feature'],
  Docker: ['docker exec -it container bash', 'docker system prune -af', 'docker logs -f container', 'docker stats --no-stream'],
  System: ['htop', 'df -h', 'free -m', 'du -sh * | sort -rh | head -10'],
};

export default function ShellCommandGeneratorNewClient() {
  const [category, setCategory] = useState('File');
  const [copied, setCopied] = useState(-1);

  const copy = (cmd: string, i: number) => {
    navigator.clipboard.writeText(cmd).catch(() => {});
    setCopied(i); setTimeout(() => setCopied(-1), 1500);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {Object.keys(COMMANDS).map(c => (
          <button key={c} onClick={() => setCategory(c)} className={`tb-v2-mode-tab ${category === c ? 'on' : ''}`}>{c}</button>
        ))}
      </div>
      {COMMANDS[category].map((cmd, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0.75rem', background: '#f9fafb', borderRadius: '6px', marginBottom: '0.5rem', border: '1px solid #e5e7eb' }}>
          <code style={{ fontFamily: 'monospace', fontSize: '0.875rem', flex: 1, marginRight: '0.5rem', wordBreak: 'break-all' }}>{cmd}</code>
          <button onClick={() => copy(cmd, i)} style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '0.25rem 0.5rem',
            background: copied === i ? '#dcfce7' : '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {copied === i ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      ))}
    </div>
  );
}
