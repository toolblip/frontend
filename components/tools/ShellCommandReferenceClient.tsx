'use client';

import { useMemo, useState } from 'react';

type Category = 'File Ops' | 'Text' | 'Process' | 'Network' | 'Git' | 'Archive' | 'Disk';

interface ShellCommand {
  command: string;
  syntax: string;
  description: string;
  example: string;
  category: Category;
}

const COMMANDS: ShellCommand[] = [
  { command: 'ls', syntax: 'ls [options] [path]', description: 'List directory contents.', example: 'ls -la /var/log', category: 'File Ops' },
  { command: 'cp', syntax: 'cp [options] src dest', description: 'Copy files or directories.', example: 'cp -r src/ backup/', category: 'File Ops' },
  { command: 'mv', syntax: 'mv src dest', description: 'Move or rename files and directories.', example: 'mv old.txt new.txt', category: 'File Ops' },
  { command: 'rm', syntax: 'rm [options] path', description: 'Remove files or directories.', example: 'rm -rf build/', category: 'File Ops' },
  { command: 'mkdir', syntax: 'mkdir [options] dir', description: 'Create a new directory.', example: 'mkdir -p a/b/c', category: 'File Ops' },
  { command: 'rmdir', syntax: 'rmdir dir', description: 'Remove an empty directory.', example: 'rmdir empty-folder', category: 'File Ops' },
  { command: 'find', syntax: 'find path -name pattern', description: 'Search for files matching criteria.', example: 'find . -name "*.log"', category: 'File Ops' },
  { command: 'grep', syntax: 'grep [options] pattern file', description: 'Search text using patterns.', example: 'grep -rn "TODO" src/', category: 'File Ops' },
  { command: 'chmod', syntax: 'chmod mode file', description: 'Change file permissions.', example: 'chmod 755 script.sh', category: 'File Ops' },
  { command: 'chown', syntax: 'chown user:group file', description: 'Change file owner and group.', example: 'chown www-data:www-data index.html', category: 'File Ops' },
  { command: 'touch', syntax: 'touch file', description: 'Create an empty file or update its timestamp.', example: 'touch notes.txt', category: 'File Ops' },
  { command: 'ln', syntax: 'ln [-s] target link', description: 'Create hard or symbolic links.', example: 'ln -s /opt/app/bin app', category: 'File Ops' },
  { command: 'pwd', syntax: 'pwd', description: 'Print the current working directory.', example: 'pwd', category: 'File Ops' },
  { command: 'cd', syntax: 'cd [path]', description: 'Change the current directory.', example: 'cd ~/projects', category: 'File Ops' },
  { command: 'stat', syntax: 'stat file', description: 'Display detailed file or filesystem status.', example: 'stat package.json', category: 'File Ops' },
  { command: 'file', syntax: 'file path', description: 'Determine file type.', example: 'file image.png', category: 'File Ops' },

  { command: 'cat', syntax: 'cat [file...]', description: 'Concatenate and print file contents.', example: 'cat access.log', category: 'Text' },
  { command: 'less', syntax: 'less file', description: 'View file contents one page at a time.', example: 'less large.log', category: 'Text' },
  { command: 'head', syntax: 'head [-n N] file', description: 'Print the first lines of a file.', example: 'head -n 20 data.csv', category: 'Text' },
  { command: 'tail', syntax: 'tail [-f] [-n N] file', description: 'Print the last lines of a file, optionally following updates.', example: 'tail -f app.log', category: 'Text' },
  { command: 'sed', syntax: 'sed s/old/new/ file', description: 'Stream editor for filtering and transforming text.', example: "sed -i 's/foo/bar/g' file.txt", category: 'Text' },
  { command: 'awk', syntax: "awk 'pattern {action}' file", description: 'Pattern-scanning and text-processing language.', example: "awk '{print $1}' access.log", category: 'Text' },
  { command: 'sort', syntax: 'sort [options] file', description: 'Sort lines of text.', example: 'sort -nr scores.txt', category: 'Text' },
  { command: 'uniq', syntax: 'uniq [options] file', description: 'Report or filter repeated lines (input should be sorted).', example: 'sort file.txt | uniq -c', category: 'Text' },
  { command: 'wc', syntax: 'wc [options] file', description: 'Count lines, words, and bytes.', example: 'wc -l file.txt', category: 'Text' },
  { command: 'cut', syntax: 'cut -d delim -f fields file', description: 'Extract sections from each line of a file.', example: "cut -d',' -f1,3 data.csv", category: 'Text' },
  { command: 'tr', syntax: 'tr set1 set2', description: 'Translate or delete characters.', example: "tr 'a-z' 'A-Z' < file.txt", category: 'Text' },
  { command: 'diff', syntax: 'diff file1 file2', description: 'Compare two files line by line.', example: 'diff old.txt new.txt', category: 'Text' },
  { command: 'xargs', syntax: 'cmd | xargs other-cmd', description: 'Build and execute commands from standard input.', example: 'find . -name "*.tmp" | xargs rm', category: 'Text' },

  { command: 'ps', syntax: 'ps [options]', description: 'Report a snapshot of current processes.', example: 'ps aux | grep node', category: 'Process' },
  { command: 'kill', syntax: 'kill [-signal] pid', description: 'Send a signal to a process (default: terminate).', example: 'kill -9 1234', category: 'Process' },
  { command: 'killall', syntax: 'killall name', description: 'Kill processes by name.', example: 'killall node', category: 'Process' },
  { command: 'top', syntax: 'top', description: 'Display real-time system and process statistics.', example: 'top', category: 'Process' },
  { command: 'htop', syntax: 'htop', description: 'Interactive process viewer (nicer than top).', example: 'htop', category: 'Process' },
  { command: 'jobs', syntax: 'jobs', description: 'List background jobs in the current shell.', example: 'jobs -l', category: 'Process' },
  { command: 'bg', syntax: 'bg [job]', description: 'Resume a suspended job in the background.', example: 'bg %1', category: 'Process' },
  { command: 'fg', syntax: 'fg [job]', description: 'Bring a background job to the foreground.', example: 'fg %1', category: 'Process' },
  { command: 'nohup', syntax: 'nohup cmd &', description: 'Run a command immune to hangups, even after logout.', example: 'nohup ./server.sh &', category: 'Process' },
  { command: 'nice', syntax: 'nice -n priority cmd', description: 'Run a command with adjusted scheduling priority.', example: 'nice -n 10 ./build.sh', category: 'Process' },

  { command: 'curl', syntax: 'curl [options] url', description: 'Transfer data to or from a server.', example: "curl -X POST -d '{}' https://api.example.com", category: 'Network' },
  { command: 'wget', syntax: 'wget [options] url', description: 'Download files from the web.', example: 'wget https://example.com/file.zip', category: 'Network' },
  { command: 'ssh', syntax: 'ssh user@host', description: 'Securely log into a remote machine.', example: 'ssh deploy@server.com', category: 'Network' },
  { command: 'scp', syntax: 'scp src user@host:dest', description: 'Securely copy files between hosts.', example: 'scp app.tar.gz user@host:/opt/app', category: 'Network' },
  { command: 'rsync', syntax: 'rsync [options] src dest', description: 'Efficiently sync files and directories.', example: 'rsync -avz src/ user@host:/dest/', category: 'Network' },
  { command: 'ping', syntax: 'ping host', description: 'Test network connectivity to a host.', example: 'ping toolblip.com', category: 'Network' },
  { command: 'dig', syntax: 'dig domain', description: 'Query DNS name servers.', example: 'dig toolblip.com', category: 'Network' },
  { command: 'nslookup', syntax: 'nslookup domain', description: 'Query DNS records for a domain.', example: 'nslookup toolblip.com', category: 'Network' },
  { command: 'netstat', syntax: 'netstat [options]', description: 'Display network connections and listening ports.', example: 'netstat -tulpn', category: 'Network' },
  { command: 'nc', syntax: 'nc host port', description: 'Netcat — read and write across network connections.', example: 'nc -zv host 443', category: 'Network' },

  { command: 'git init', syntax: 'git init', description: 'Create a new Git repository.', example: 'git init', category: 'Git' },
  { command: 'git clone', syntax: 'git clone url', description: 'Clone a repository into a new directory.', example: 'git clone git@github.com:org/repo.git', category: 'Git' },
  { command: 'git status', syntax: 'git status', description: 'Show the working tree status.', example: 'git status', category: 'Git' },
  { command: 'git add', syntax: 'git add file', description: 'Stage changes for the next commit.', example: 'git add .', category: 'Git' },
  { command: 'git commit', syntax: "git commit -m 'msg'", description: 'Record staged changes to the repository.', example: 'git commit -m "fix: handle null case"', category: 'Git' },
  { command: 'git push', syntax: 'git push [remote] [branch]', description: 'Upload local commits to a remote repository.', example: 'git push origin main', category: 'Git' },
  { command: 'git pull', syntax: 'git pull', description: 'Fetch and merge changes from a remote repository.', example: 'git pull origin main', category: 'Git' },
  { command: 'git branch', syntax: 'git branch [name]', description: 'List, create, or delete branches.', example: 'git branch feature/login', category: 'Git' },
  { command: 'git checkout', syntax: 'git checkout branch', description: 'Switch branches or restore files.', example: 'git checkout -b feature/login', category: 'Git' },
  { command: 'git merge', syntax: 'git merge branch', description: 'Merge another branch into the current one.', example: 'git merge feature/login', category: 'Git' },
  { command: 'git log', syntax: 'git log [options]', description: 'Show commit history.', example: 'git log --oneline -10', category: 'Git' },
  { command: 'git diff', syntax: 'git diff', description: 'Show changes between commits, branches, or the working tree.', example: 'git diff HEAD~1', category: 'Git' },

  { command: 'tar', syntax: 'tar -czf archive.tar.gz dir', description: 'Create or extract tar archives.', example: 'tar -xzf archive.tar.gz', category: 'Archive' },
  { command: 'zip', syntax: 'zip -r archive.zip dir', description: 'Package and compress files into a zip archive.', example: 'zip -r site.zip public/', category: 'Archive' },
  { command: 'unzip', syntax: 'unzip archive.zip', description: 'Extract files from a zip archive.', example: 'unzip site.zip -d public/', category: 'Archive' },
  { command: 'gzip', syntax: 'gzip file', description: 'Compress a file using gzip.', example: 'gzip access.log', category: 'Archive' },
  { command: 'gunzip', syntax: 'gunzip file.gz', description: 'Decompress a gzip-compressed file.', example: 'gunzip access.log.gz', category: 'Archive' },

  { command: 'df', syntax: 'df [options]', description: 'Report filesystem disk space usage.', example: 'df -h', category: 'Disk' },
  { command: 'du', syntax: 'du [options] path', description: 'Estimate file and directory space usage.', example: 'du -sh node_modules/', category: 'Disk' },
  { command: 'mount', syntax: 'mount device path', description: 'Mount a filesystem.', example: 'mount /dev/sdb1 /mnt/data', category: 'Disk' },
  { command: 'umount', syntax: 'umount path', description: 'Unmount a filesystem.', example: 'umount /mnt/data', category: 'Disk' },
  { command: 'lsblk', syntax: 'lsblk', description: 'List information about block devices.', example: 'lsblk', category: 'Disk' },
];

const CATEGORY_ORDER: Category[] = ['File Ops', 'Text', 'Process', 'Network', 'Git', 'Archive', 'Disk'];

export default function ShellCommandReferenceClient() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return COMMANDS.filter(c => {
      if (category !== 'All' && c.category !== category) return false;
      if (!q) return true;
      return (
        c.command.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.syntax.toLowerCase().includes(q)
      );
    });
  }, [search, category]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Search commands</span>
      </div>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="e.g. grep, copy files, kill process..."
        className="tb-v2-input"
        style={{ marginBottom: 10 }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        <button type="button" onClick={() => setCategory('All')} className={`tb-v2-mode-tab ${category === 'All' ? 'on' : ''}`}>All</button>
        {CATEGORY_ORDER.map(c => (
          <button key={c} type="button" onClick={() => setCategory(c)} className={`tb-v2-mode-tab ${category === c ? 'on' : ''}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{filtered.length} command{filtered.length === 1 ? '' : 's'}</span>
      </div>
      <div className="tb-v2-tool-output-body" style={{ maxHeight: 500, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <p className="tb-v2-empty">No commands match that search.</p>
        ) : (
          filtered.map(c => (
            <div key={`${c.category}-${c.command}`} style={{ borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <code style={{ fontFamily: 'var(--f-mono)', fontWeight: 700 }}>{c.command}</code>
                <span style={{ fontSize: 11, color: 'var(--fg-2)' }}>{c.category}</span>
              </div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--fg-2)', marginTop: 2 }}>{c.syntax}</div>
              <p style={{ fontSize: 13, marginTop: 4 }}>{c.description}</p>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, marginTop: 4, background: 'var(--bg-2, rgba(0,0,0,0.04))', padding: '4px 8px', borderRadius: 6 }}>
                $ {c.example}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
