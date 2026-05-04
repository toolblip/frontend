'use client';

import { useState } from 'react';

type DataType = 'name' | 'email' | 'address' | 'phone' | 'company' | 'date' | 'number' | 'uuid';

export default function FakeDataGeneratorClient() {
  const [dataType, setDataType] = useState<DataType>('name');
  const [count, setCount] = useState(10);
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState<'json' | 'csv' | 'text'>('json');

  const generators: Record<DataType, () => string> = {
    name: () => {
      const firstNames = ['James', 'Emma', 'Oliver', 'Sophia', 'William', 'Ava', 'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Charlotte', 'Alexander', 'Amelia', 'Michael', 'Harper'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore'];
      return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    },
    email: () => {
      const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.com'];
      const name = generators.name().toLowerCase().replace(' ', '.');
      return `${name}${Math.floor(Math.random() * 100)}@${domains[Math.floor(Math.random() * domains.length)]}`;
    },
    address: () => {
      const streets = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm St', 'Washington Blvd', 'Lake View Dr'];
      const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
      const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA'];
      const zip = Math.floor(10000 + Math.random() * 90000);
      return `${Math.floor(Math.random() * 9999) + 1} ${streets[Math.floor(Math.random() * streets.length)]}, ${cities[Math.floor(Math.random() * cities.length)]}, ${states[Math.floor(Math.random() * states.length)]} ${zip}`;
    },
    phone: () => {
      const area = Math.floor(200 + Math.random() * 800);
      const first = Math.floor(200 + Math.random() * 800);
      const second = Math.floor(1000 + Math.random() * 9000);
      return `(${area}) ${first}-${second}`;
    },
    company: () => {
      const prefixes = ['Tech', 'Global', 'United', 'Premier', 'Alpha', 'Omega', 'Nova', 'Apex', 'Summit', 'Pinnacle'];
      const suffixes = ['Solutions', 'Systems', 'Industries', 'Corp', 'Inc', 'Group', 'Labs', 'Ventures', 'Partners', 'Services'];
      return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    },
    date: () => {
      const start = new Date(2020, 0, 1).getTime();
      const end = new Date(2025, 11, 31).getTime();
      const date = new Date(start + Math.random() * (end - start));
      return date.toISOString().split('T')[0];
    },
    number: () => String(Math.floor(Math.random() * 10000)),
    uuid: () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  };

  const generate = () => {
    const items = Array.from({ length: count }, () => generators[dataType]());
    
    if (format === 'json') {
      const json = count === 1 ? `"${dataType}": "${items[0]}"` : JSON.stringify(items, null, 2);
      setOutput(json);
    } else if (format === 'csv') {
      setOutput(items.join('\n'));
    } else {
      setOutput(items.join('\n'));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Type
          </label>
          <select
            value={dataType}
            onChange={(e) => setDataType(e.target.value as DataType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Full Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
            <option value="phone">Phone</option>
            <option value="company">Company</option>
            <option value="date">Date</option>
            <option value="number">Number</option>
            <option value="uuid">UUID</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Count
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Output Format
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={format === 'json'}
              onChange={() => setFormat('json')}
              className="w-4 h-4"
            />
            <span className="text-sm">JSON</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={format === 'csv'}
              onChange={() => setFormat('csv')}
              className="w-4 h-4"
            />
            <span className="text-sm">CSV</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={format === 'text'}
              onChange={() => setFormat('text')}
              className="w-4 h-4"
            />
            <span className="text-sm">Plain Text</span>
          </label>
        </div>
      </div>

      <button
        onClick={generate}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Generate {count > 1 ? `${count} Items` : '1 Item'}
      </button>

      {output && (
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Generated Data
            </label>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Copy to Clipboard
            </button>
          </div>
          <pre className="w-full h-64 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md overflow-auto font-mono text-sm">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
