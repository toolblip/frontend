'use client';

import { useState } from 'react';

interface Config { entry: string; output: string; mode: string; jsx: boolean; css: boolean; }

export default function WebpackConfigGeneratorClient() {
  const [config, setConfig] = useState<Config>({ entry: './src/index.js', output: 'dist', mode: 'production', jsx: true, css: true });

  const generate = () => {
    const lines = [
      `const path = require('path');`,
      ``,
      `module.exports = {`,
      `  mode: '${config.mode}',`,
      `  entry: '${config.entry}',`,
      `  output: {`,
      `    path: path.resolve(__dirname, '${config.output}'),`,
      `    filename: 'bundle.js',`,
      `  },`,
    ];
    if (config.jsx) lines.push(`  resolve: { extensions: ['.js', '.jsx'] },`);
    if (config.jsx) lines.push(`  module: { rules: [{ test: /\\.jsx?$/, exclude: /node_modules/, use: 'babel-loader' }] },`);
    if (config.css) lines.push(`  module: { rules: [{ test: /\\.css$/, use: ['style-loader', 'css-loader'] }] },`);
    lines.push(`};`);
    setConfig(prev => ({ ...prev }));
    return lines.join('\n');
  };

  const output = generate();

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Configuration</span></div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { label: 'Entry', key: 'entry', type: 'text' },
          { label: 'Output Dir', key: 'output', type: 'text' },
        ].map(field => (
          <label key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>{field.label}</span>
            <input
              type="text"
              value={String(config[field.key as keyof Config] ?? '')}
              onChange={e => setConfig({ ...config, [field.key]: e.target.value })}
              className="tb-v2-tool-textarea"
              style={{ fontFamily: 'var(--f-mono)', minHeight: 36, resize: 'none' }}
            />
          </label>
        ))}
        <div style={{ display: 'flex', gap: 16 }}>
          {(['production', 'development'] as const).map(m => (
            <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input type="radio" checked={config.mode === m} onChange={() => setConfig({ ...config, mode: m })} />
              <span style={{ fontSize: 13 }}>{m}</span>
            </label>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {[{ key: 'jsx', label: 'JSX Support' }, { key: 'css', label: 'CSS Support' }].map(opt => (
            <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input type="checkbox" checked={config[opt.key as keyof Config] as boolean} onChange={e => setConfig({ ...config, [opt.key]: e.target.checked })} />
              <span style={{ fontSize: 13 }}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">webpack.config.js</span></div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{output}</pre>
      </div>
    </div>
  );
}
