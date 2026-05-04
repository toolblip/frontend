'use client';

import { useState } from 'react';

interface ScanResult {
  port: number;
  status: 'open' | 'closed' | 'filtered';
  service?: string;
}

const commonPorts: Record<number, string> = {
  21: 'FTP',
  22: 'SSH',
  23: 'Telnet',
  25: 'SMTP',
  53: 'DNS',
  80: 'HTTP',
  110: 'POP3',
  143: 'IMAP',
  443: 'HTTPS',
  465: 'SMTPS',
  587: 'SMTP',
  993: 'IMAPS',
  995: 'POP3S',
  3306: 'MySQL',
  3389: 'RDP',
  5432: 'PostgreSQL',
  5900: 'VNC',
  6379: 'Redis',
  8080: 'HTTP-Alt',
  8443: 'HTTPS-Alt',
  27017: 'MongoDB',
};

export default function PortScannerClient() {
  const [host, setHost] = useState('localhost');
  const [ports, setPorts] = useState('1-1000');
  const [results, setResults] = useState<ScanResult[]>([]);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const parsePorts = (input: string): number[] => {
    const portList: number[] = [];
    const ranges = input.split(',');
    
    for (const range of ranges) {
      const trimmed = range.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(p => parseInt(p.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= 65535) portList.push(i);
          }
        }
      } else {
        const port = parseInt(trimmed);
        if (!isNaN(port) && port >= 1 && port <= 65535) {
          portList.push(port);
        }
      }
    }
    
    return [...new Set(portList)].sort((a, b) => a - b);
  };

  const scanPort = async (host: string, port: number): Promise<ScanResult> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);
    
    try {
      const response = await fetch(`/api/tools/port-scan?host=${host}&port=${port}`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      
      if (response.ok) {
        const data = await response.json();
        return { port, status: data.open ? 'open' : 'closed', service: commonPorts[port] };
      }
      return { port, status: 'closed', service: commonPorts[port] };
    } catch {
      clearTimeout(timeout);
      return { port, status: 'filtered', service: commonPorts[port] };
    }
  };

  const handleScan = async () => {
    setScanning(true);
    setResults([]);
    setProgress(0);
    
    const portList = parsePorts(ports);
    const results: ScanResult[] = [];
    
    // Scan in batches of 50
    const batchSize = 50;
    for (let i = 0; i < portList.length; i += batchSize) {
      const batch = portList.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(port => scanPort(host, port)));
      results.push(...batchResults);
      setProgress(Math.min(((i + batchSize) / portList.length) * 100, 100));
      setResults([...results].sort((a, b) => a.port - b.port));
    }
    
    setScanning(false);
    setProgress(100);
  };

  const openPorts = results.filter(r => r.status === 'open');
  const closedPorts = results.filter(r => r.status === 'closed');
  const filteredPorts = results.filter(r => r.status === 'filtered');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Host</label>
          <input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="localhost or IP address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Ports (e.g., 1-1000, 80, 443, 8080-8090)</label>
          <input
            type="text"
            value={ports}
            onChange={(e) => setPorts(e.target.value)}
            placeholder="1-1000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button
          onClick={handleScan}
          disabled={scanning}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {scanning ? 'Scanning...' : 'Start Scan'}
        </button>
      </div>

      {scanning && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex gap-4 text-sm">
            <span className="text-green-600">● {openPorts.length} Open</span>
            <span className="text-red-600">● {closedPorts.length} Closed</span>
            <span className="text-yellow-600">● {filteredPorts.length} Filtered</span>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Port</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Service</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.port} className={result.status === 'open' ? 'bg-green-50' : ''}>
                    <td className="px-4 py-2 text-sm">{result.port}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        result.status === 'open' ? 'bg-green-100 text-green-700' :
                        result.status === 'closed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {result.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">{result.service || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
