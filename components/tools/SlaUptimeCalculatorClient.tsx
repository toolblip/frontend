'use client';
import { useState } from 'react';

export default function SlaUptimeCalculatorClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const process = () => {
    setOutput('Processed: ' + input);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Sla Uptime Calculator</h1>
      <p className="text-gray-600 dark:text-gray-400">Calculate allowable downtime from an SLA percentage for year, month, and day.</p>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        className="w-full h-32 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        placeholder="Enter input..."
      />
      <button
        onClick={process}
        className="w-full py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
      >
        Process
      </button>
      {output && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg whitespace-pre-wrap">
          {output}
        </div>
      )}
    </div>
  );
}
