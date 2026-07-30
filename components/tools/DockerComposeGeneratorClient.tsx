'use client';

import { useState, useMemo } from 'react';

type Template = 'node-postgres' | 'node-mysql' | 'node-redis' | 'wordpress-mysql' | 'nginx-static';

const TEMPLATE_LABELS: Record<Template, string> = {
  'node-postgres': 'Node.js + PostgreSQL',
  'node-mysql': 'Node.js + MySQL',
  'node-redis': 'Node.js + Redis',
  'wordpress-mysql': 'WordPress + MySQL',
  'nginx-static': 'Nginx (Static Site)',
};

const NEEDS_DB: Record<Template, boolean> = {
  'node-postgres': true,
  'node-mysql': true,
  'node-redis': false,
  'wordpress-mysql': true,
  'nginx-static': false,
};

const NEEDS_APP_PORT: Record<Template, boolean> = {
  'node-postgres': true,
  'node-mysql': true,
  'node-redis': true,
  'wordpress-mysql': false,
  'nginx-static': false,
};

function generateYaml(template: Template, opts: { serviceName: string; hostPort: string; appPort: string; dbName: string; dbUser: string; dbPassword: string }): string {
  const { serviceName, hostPort, appPort, dbName, dbUser, dbPassword } = opts;

  switch (template) {
    case 'node-postgres':
      return `version: '3.8'
services:
  ${serviceName}:
    build: .
    ports:
      - "${hostPort}:${appPort}"
    environment:
      - DATABASE_URL=postgres://${dbUser}:${dbPassword}@db:5432/${dbName}
    depends_on:
      - db
  db:
    image: postgres:16
    environment:
      - POSTGRES_USER=${dbUser}
      - POSTGRES_PASSWORD=${dbPassword}
      - POSTGRES_DB=${dbName}
    volumes:
      - db_data:/var/lib/postgresql/data
volumes:
  db_data:
`;
    case 'node-mysql':
      return `version: '3.8'
services:
  ${serviceName}:
    build: .
    ports:
      - "${hostPort}:${appPort}"
    environment:
      - DATABASE_URL=mysql://${dbUser}:${dbPassword}@db:3306/${dbName}
    depends_on:
      - db
  db:
    image: mysql:8
    environment:
      - MYSQL_DATABASE=${dbName}
      - MYSQL_USER=${dbUser}
      - MYSQL_PASSWORD=${dbPassword}
      - MYSQL_ROOT_PASSWORD=${dbPassword}
    volumes:
      - db_data:/var/lib/mysql
volumes:
  db_data:
`;
    case 'node-redis':
      return `version: '3.8'
services:
  ${serviceName}:
    build: .
    ports:
      - "${hostPort}:${appPort}"
    environment:
      - REDIS_URL=redis://cache:6379
    depends_on:
      - cache
  cache:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
volumes:
  redis_data:
`;
    case 'wordpress-mysql':
      return `version: '3.8'
services:
  wordpress:
    image: wordpress:latest
    ports:
      - "${hostPort}:80"
    environment:
      - WORDPRESS_DB_HOST=db
      - WORDPRESS_DB_USER=${dbUser}
      - WORDPRESS_DB_PASSWORD=${dbPassword}
      - WORDPRESS_DB_NAME=${dbName}
    volumes:
      - wp_content:/var/www/html
    depends_on:
      - db
  db:
    image: mysql:8
    environment:
      - MYSQL_DATABASE=${dbName}
      - MYSQL_USER=${dbUser}
      - MYSQL_PASSWORD=${dbPassword}
      - MYSQL_ROOT_PASSWORD=${dbPassword}
    volumes:
      - db_data:/var/lib/mysql
volumes:
  wp_content:
  db_data:
`;
    case 'nginx-static':
      return `version: '3.8'
services:
  web:
    image: nginx:alpine
    ports:
      - "${hostPort}:80"
    volumes:
      - ./html:/usr/share/nginx/html:ro
`;
  }
}

export default function DockerComposeGeneratorClient() {
  const [template, setTemplate] = useState<Template>('node-postgres');
  const [serviceName, setServiceName] = useState('app');
  const [hostPort, setHostPort] = useState('3000');
  const [appPort, setAppPort] = useState('3000');
  const [dbName, setDbName] = useState('appdb');
  const [dbUser, setDbUser] = useState('appuser');
  const [dbPassword, setDbPassword] = useState('changeme');
  const [copied, setCopied] = useState(false);

  const loadExample = () => {
    setTemplate('node-postgres');
    setServiceName('app');
    setHostPort('3000');
    setAppPort('3000');
    setDbName('appdb');
    setDbUser('appuser');
    setDbPassword('changeme');
  };

  const yaml = useMemo(
    () => generateYaml(template, { serviceName, hostPort, appPort, dbName, dbUser, dbPassword }),
    [template, serviceName, hostPort, appPort, dbName, dbUser, dbPassword]
  );

  const copy = () => {
    navigator.clipboard.writeText(yaml).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Template</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <div style={{ padding: 20 }} className="flex flex-col gap-4">
        <select value={template} onChange={e => setTemplate(e.target.value as Template)} className="tb-v2-input">
          {(Object.keys(TEMPLATE_LABELS) as Template[]).map(t => (
            <option key={t} value={t}>{TEMPLATE_LABELS[t]}</option>
          ))}
        </select>

        {template !== 'wordpress-mysql' && template !== 'nginx-static' && (
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label">Service Name</label>
            <input type="text" value={serviceName} onChange={e => setServiceName(e.target.value)} className="tb-v2-input" placeholder="app" />
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <div className="flex flex-col gap-1" style={{ flex: 1 }}>
            <label className="tb-v2-tool-label">Host Port</label>
            <input type="text" value={hostPort} onChange={e => setHostPort(e.target.value)} className="tb-v2-input" placeholder="3000" />
          </div>
          {NEEDS_APP_PORT[template] && (
            <div className="flex flex-col gap-1" style={{ flex: 1 }}>
              <label className="tb-v2-tool-label">Container Port</label>
              <input type="text" value={appPort} onChange={e => setAppPort(e.target.value)} className="tb-v2-input" placeholder="3000" />
            </div>
          )}
        </div>

        {NEEDS_DB[template] && (
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="flex flex-col gap-1" style={{ flex: 1 }}>
              <label className="tb-v2-tool-label">DB Name</label>
              <input type="text" value={dbName} onChange={e => setDbName(e.target.value)} className="tb-v2-input" />
            </div>
            <div className="flex flex-col gap-1" style={{ flex: 1 }}>
              <label className="tb-v2-tool-label">DB User</label>
              <input type="text" value={dbUser} onChange={e => setDbUser(e.target.value)} className="tb-v2-input" />
            </div>
            <div className="flex flex-col gap-1" style={{ flex: 1 }}>
              <label className="tb-v2-tool-label">DB Password</label>
              <input type="text" value={dbPassword} onChange={e => setDbPassword(e.target.value)} className="tb-v2-input" />
            </div>
          </div>
        )}
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">docker-compose.yml</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre className="tb-v2-tool-pre">{yaml}</pre>
      </div>
    </div>
  );
}
