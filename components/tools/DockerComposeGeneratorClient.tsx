'use client';
import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';
import { encodeDatabaseCredential, quoteYaml, validatePort, validateServiceName } from '@/lib/network-tools';

type Template = 'full-stack' | 'node-postgres' | 'node-mysql' | 'node-redis' | 'wordpress-mysql' | 'nginx-static';
const LABELS: Record<Template, string> = { 'full-stack': 'App + PostgreSQL + Redis', 'node-postgres': 'Node.js + PostgreSQL', 'node-mysql': 'Node.js + MySQL', 'node-redis': 'Node.js + Redis', 'wordpress-mysql': 'WordPress + MySQL', 'nginx-static': 'Nginx (Static Site)' };
const defaults = { template: 'full-stack' as Template, serviceName: 'app', hostPort: '3000', appPort: '3000', dbName: 'appdb', dbUser: 'appuser', dbPassword: 'changeme' };
type Options = Omit<typeof defaults, 'template'>;
function generateYaml(template: Template, o: Options): string {
  const s = quoteYaml(o.serviceName), db = quoteYaml(o.dbName), user = quoteYaml(o.dbUser), pass = quoteYaml(o.dbPassword);
  const dbUrl = `postgres://${encodeDatabaseCredential(o.dbUser)}:${encodeDatabaseCredential(o.dbPassword)}@db:5432/${o.dbName}`;
  const app = `  ${s}:\n    build: .\n    ports:\n      - "${o.hostPort}:${o.appPort}"\n    environment:\n      - DATABASE_URL=${quoteYaml(dbUrl)}\n`;
  const dbService = `  db:\n    image: postgres:16\n    environment:\n      - POSTGRES_USER=${user}\n      - POSTGRES_PASSWORD=${pass}\n      - POSTGRES_DB=${db}\n    volumes:\n      - db_data:/var/lib/postgresql/data\n`;
  if (template === 'full-stack') return `version: '3.8'\nservices:\n${app}    depends_on:\n      - db\n      - cache\n  cache:\n    image: redis:7-alpine\n${dbService}volumes:\n  db_data:\n  redis_data:\n`;
  if (template === 'node-postgres') return `version: '3.8'\nservices:\n${app}    depends_on:\n      - db\n${dbService}volumes:\n  db_data:\n`;
  if (template === 'node-mysql') return `version: '3.8'\nservices:\n${app.replace(/postgres:\/\//g, 'mysql://').replace(/5432/g, '3306')}    depends_on:\n      - db\n${dbService.replace('postgres:16', 'mysql:8').replace(/POSTGRES/g, 'MYSQL').replace('/var/lib/postgresql/data', '/var/lib/mysql').replace(/postgres:\/\//g, 'mysql://').replace(/5432/g, '3306')}volumes:\n  db_data:\n`;
  if (template === 'node-redis') return `version: '3.8'\nservices:\n  ${s}:\n    build: .\n    ports:\n      - "${o.hostPort}:${o.appPort}"\n    environment:\n      - REDIS_URL=redis://cache:6379\n  cache:\n    image: redis:7-alpine\n`;
  if (template === 'wordpress-mysql') return `version: '3.8'\nservices:\n  wordpress:\n    image: wordpress:latest\n    ports:\n      - "${o.hostPort}:80"\n    environment:\n      - WORDPRESS_DB_USER=${user}\n      - WORDPRESS_DB_PASSWORD=${pass}\n      - WORDPRESS_DB_NAME=${db}\n  db:\n    image: mysql:8\n`;
  return `version: '3.8'\nservices:\n  web:\n    image: nginx:alpine\n    ports:\n      - "${o.hostPort}:80"\n`;
}
export default function DockerComposeGeneratorClient() {
  const [state, setState] = useState(defaults); const [copied, setCopied] = useState(false);
  const update = (key: keyof typeof defaults, value: string) => setState(s => ({ ...s, [key]: value }));
  const valid = validateServiceName(state.serviceName) && validatePort(state.hostPort) && validatePort(state.appPort);
  const yaml = useMemo(() => valid ? generateYaml(state.template, state) : '# Enter a valid service name and ports to generate Compose YAML.', [state, valid]);
  const clear = () => { setState({ ...defaults }); setCopied(false); }; const copy = () => { if (!valid) return; navigator.clipboard.writeText(yaml).catch(() => {}); setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
  return <div><div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Template</span><ToolExampleClearActions exampleCount={1} onExample={() => { setState(defaults); setCopied(false); }} onClear={clear} canClear /></div><div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}><select value={state.template} onChange={e => update('template', e.target.value)} className="tb-v2-input">{Object.entries(LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>{state.template !== 'nginx-static' && state.template !== 'wordpress-mysql' && <input value={state.serviceName} onChange={e => update('serviceName', e.target.value)} className="tb-v2-input" placeholder="Service name (app)" aria-label="Service name" />}<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}><input value={state.hostPort} onChange={e => update('hostPort', e.target.value)} className="tb-v2-input" placeholder="Host port" aria-label="Host port" style={{ flex: 1 }} /><input value={state.appPort} onChange={e => update('appPort', e.target.value)} className="tb-v2-input" placeholder="Container port" aria-label="Container port" style={{ flex: 1 }} /></div>{!valid && <div style={{ color: '#ef4444', fontSize: 13 }}>Use a valid service name and ports from 1 to 65535.</div>}<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>{(['dbName', 'dbUser', 'dbPassword'] as const).map(key => <input key={key} value={state[key]} onChange={e => update(key, e.target.value)} className="tb-v2-input" placeholder={key} aria-label={key} style={{ flex: '1 1 180px' }} />)}</div></div><div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">docker-compose.yml</span><button type="button" onClick={copy} disabled={!valid} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>{copied ? 'Copied' : 'Copy'}</button></div><div className="tb-v2-tool-output-body"><pre className="tb-v2-tool-pre">{yaml}</pre></div></div>;
}
