'use client';

import { useState } from 'react';

interface Service {
  name: string;
  image: string;
  ports: string;
  volumes: string;
  envVars: string;
}

export default function DockerComposeGeneratorClient() {
  const [services, setServices] = useState<Service[]>([
    { name: 'web', image: 'node:18-alpine', ports: '3000:3000', volumes: './src:/app/src', envVars: 'NODE_ENV=development' },
  ]);
  const [copied, setCopied] = useState(false);

  const addService = () => setServices([...services, { name: '', image: '', ports: '', volumes: '', envVars: '' }]);
  const removeService = (i: number) => setServices(services.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof Service, val: string) => setServices(services.map((s, idx) => idx === i ? { ...s, [key]: val } : s));

  const generateYaml = () => {
    const lines: string[] = ["version: '3.8'", 'services:'];
    services.filter(s => s.name).forEach(s => {
      lines.push('  ' + s.name + ':');
      lines.push('    image: ' + s.image);
      if (s.ports) {
        lines.push('    ports:');
        lines.push('      - "' + s.ports + '"');
      }
      if (s.volumes) {
        lines.push('    volumes:');
        lines.push('      - ' + s.volumes);
      }
      if (s.envVars) {
        lines.push('    environment:');
        s.envVars.split(',').forEach(e => {
          lines.push('      - ' + e.trim());
        });
      }
    });
    return lines.join('\n');
  };

  const yaml = generateYaml();

  const copy = () => {
    navigator.clipboard.writeText(yaml).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Docker Compose Generator</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Generate docker-compose.yml configuration for your services.
      </p>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Services</h2>
          <button
            onClick={addService}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            + Add Service
          </button>
        </div>

        {services.map((s, i) => (
          <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={s.name}
                onChange={(e) => update(i, 'name', e.target.value)}
                placeholder="Service name"
                className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                onClick={() => removeService(i)}
                className="ml-2 p-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              value={s.image}
              onChange={(e) => update(i, 'image', e.target.value)}
              placeholder="Image (e.g., node:18-alpine)"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={s.ports}
                onChange={(e) => update(i, 'ports', e.target.value)}
                placeholder="Ports (e.g., 3000:3000)"
                className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="text"
                value={s.volumes}
                onChange={(e) => update(i, 'volumes', e.target.value)}
                placeholder="Volumes (e.g., ./src:/app/src)"
                className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <input
              type="text"
              value={s.envVars}
              onChange={(e) => update(i, 'envVars', e.target.value)}
              placeholder="Environment vars (comma-separated)"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Generated YAML</h2>
          <button
            onClick={copy}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm">
          {yaml}
        </pre>
      </div>
    </div>
  );
}
