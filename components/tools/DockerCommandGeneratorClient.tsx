'use client';

import { useState } from 'react';

type CommandType = 'run' | 'build' | 'exec' | 'ps' | 'images' | 'pull' | 'push' | 'logs' | 'stop' | 'rm' | 'rmi';

export default function DockerCommandGeneratorClient() {
  const [commandType, setCommandType] = useState<CommandType>('run');
  const [image, setImage] = useState('nginx:latest');
  const [containerName, setContainerName] = useState('my-container');
  const [port, setPort] = useState('8080:80');
  const [envVars, setEnvVars] = useState('PORT=3000');
  const [volumes, setVolumes] = useState('/data:/data');
  const [network, setNetwork] = useState('bridge');
  const [detach, setDetach] = useState(true);
  const [rm, setRm] = useState(false);
  const [it, setIt] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateCommand = () => {
    let cmd = 'docker';

    switch (commandType) {
      case 'run':
        cmd += ' run';
        if (detach) cmd += ' -d';
        if (rm) cmd += ' --rm';
        if (it) cmd += ' -it';
        if (containerName) cmd += ` --name ${containerName}`;
        if (port) cmd += ` -p ${port}`;
        if (envVars) {
          envVars.split('\n').forEach(env => {
            if (env.trim()) cmd += ` -e "${env.trim()}"`;
          });
        }
        if (volumes) {
          volumes.split('\n').forEach(vol => {
            if (vol.trim()) cmd += ` -v "${vol.trim()}"`;
          });
        }
        if (network !== 'bridge') cmd += ` --network ${network}`;
        cmd += ` ${image}`;
        break;

      case 'build':
        cmd = `docker build -t ${image} .`;
        break;

      case 'exec':
        cmd = `docker exec -it ${containerName || '<container>'} /bin/sh`;
        break;

      case 'ps':
        cmd = 'docker ps';
        break;

      case 'images':
        cmd = 'docker images';
        break;

      case 'pull':
        cmd = `docker pull ${image}`;
        break;

      case 'push':
        cmd = `docker push ${image}`;
        break;

      case 'logs':
        cmd = `docker logs -f ${containerName || '<container>'}`;
        break;

      case 'stop':
        cmd = `docker stop ${containerName || '<container>'}`;
        break;

      case 'rm':
        cmd = `docker rm ${containerName || '<container>'}`;
        break;

      case 'rmi':
        cmd = `docker rmi ${image}`;
        break;

      default:
        cmd = 'docker <command>';
    }

    return cmd;
  };

  const copy = () => {
    navigator.clipboard.writeText(generateCommand()).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="tb-v2-tool-label">Command</label>
        <select
          value={commandType}
          onChange={(e) => setCommandType(e.target.value as CommandType)}
          className="tb-v2-input"
        >
          <option value="run">docker run</option>
          <option value="build">docker build</option>
          <option value="exec">docker exec</option>
          <option value="ps">docker ps</option>
          <option value="images">docker images</option>
          <option value="pull">docker pull</option>
          <option value="push">docker push</option>
          <option value="logs">docker logs</option>
          <option value="stop">docker stop</option>
          <option value="rm">docker rm</option>
          <option value="rmi">docker rmi</option>
        </select>
      </div>

      {(commandType === 'run' || commandType === 'build' || commandType === 'pull' || commandType === 'push' || commandType === 'rmi') && (
        <div>
          <label className="tb-v2-tool-label">Image</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="nginx:latest"
            className="tb-v2-input"
          />
        </div>
      )}

      {commandType === 'run' && (
        <>
          <div>
            <label className="tb-v2-tool-label">Container Name</label>
            <input
              type="text"
              value={containerName}
              onChange={(e) => setContainerName(e.target.value)}
              placeholder="my-container"
              className="tb-v2-input"
            />
          </div>

          <div>
            <label className="tb-v2-tool-label">Port Mapping (-p)</label>
            <input
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="8080:80"
              className="tb-v2-input"
            />
          </div>

          <div>
            <label className="tb-v2-tool-label">Environment Variables (-e)</label>
            <textarea
              value={envVars}
              onChange={(e) => setEnvVars(e.target.value)}
              placeholder="PORT=3000&#10;NODE_ENV=production"
              className="tb-v2-tool-textarea"
              rows={2}
            />
          </div>

          <div>
            <label className="tb-v2-tool-label">Volumes (-v)</label>
            <textarea
              value={volumes}
              onChange={(e) => setVolumes(e.target.value)}
              placeholder="/data:/data"
              className="tb-v2-tool-textarea"
              rows={2}
            />
          </div>

          <div>
            <label className="tb-v2-tool-label">Network</label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="tb-v2-input"
            >
              <option value="bridge">bridge</option>
              <option value="host">host</option>
              <option value="none">none</option>
              <option value="custom">custom</option>
            </select>
          </div>

          <div className="tb-v2-option-group">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={detach}
                onChange={(e) => setDetach(e.target.checked)}
                className="tb-v2-checkbox"
              />
              <span className="text-sm">Detached (-d)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rm}
                onChange={(e) => setRm(e.target.checked)}
                className="tb-v2-checkbox"
              />
              <span className="text-sm">Auto-remove (--rm)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={it}
                onChange={(e) => setIt(e.target.checked)}
                className="tb-v2-checkbox"
              />
              <span className="text-sm">Interactive (-it)</span>
            </label>
          </div>
        </>
      )}

      {(commandType === 'exec' || commandType === 'logs' || commandType === 'stop' || commandType === 'rm') && (
        <div>
          <label className="tb-v2-tool-label">Container Name / ID</label>
          <input
            type="text"
            value={containerName}
            onChange={(e) => setContainerName(e.target.value)}
            placeholder="my-container"
            className="tb-v2-input"
          />
        </div>
      )}

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Command</span>
        <button
          type="button"
          onClick={copy}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre className="tb-v2-tool-pre whitespace-pre-wrap">{generateCommand()}</pre>
      </div>
    </div>
  );
}
