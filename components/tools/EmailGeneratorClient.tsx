'use client';

import { useState, useCallback } from 'react';

type EmailType = 'random' | 'firstname-lastname' | 'firstname.lastname' | 'firstname_lastname' | 'firstname123' | 'custom';

const domains = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'mail.com',
  'protonmail.com',
  'icloud.com',
  'aol.com',
];

const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Lisa', 'Daniel', 'Nancy',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
];

function randomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function EmailGeneratorClient() {
  const [emailType, setEmailType] = useState<EmailType>('random');
  const [customPattern, setCustomPattern] = useState('first.last');
  const [domain, setDomain] = useState('gmail.com');
  const [customDomain, setCustomDomain] = useState('');
  const [count, setCount] = useState(5);
  const [generatedEmails, setGeneratedEmails] = useState<string[]>([]);

  const generateEmails = useCallback(() => {
    const emails: string[] = [];
    const selectedDomain = domain === 'custom' ? customDomain : domain;
    
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase();
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase();
      const randomNum = Math.floor(Math.random() * 1000);
      
      let localPart: string;
      
      switch (emailType) {
        case 'random':
          localPart = randomString(8) + randomNum;
          break;
        case 'firstname-lastname':
          localPart = `${firstName}-${lastName}`;
          break;
        case 'firstname.lastname':
          localPart = `${firstName}.${lastName}`;
          break;
        case 'firstname_lastname':
          localPart = `${firstName}_${lastName}`;
          break;
        case 'firstname123':
          localPart = `${firstName}${randomNum}`;
          break;
        case 'custom':
          localPart = customPattern
            .replace(/firstname/gi, firstName)
            .replace(/lastname/gi, lastName)
            .replace(/first/gi, firstName.charAt(0))
            .replace(/last/gi, lastName.charAt(0))
            .replace(/[0-9]+/g, (match) => randomString(parseInt(match)));
          break;
        default:
          localPart = randomString(10);
      }
      
      emails.push(`${localPart}@${selectedDomain}`);
    }
    
    setGeneratedEmails(emails);
  }, [emailType, domain, customDomain, customPattern, count]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmails.join('\n'));
  };

  const patterns = [
    { value: 'firstname-lastname', label: 'firstname-lastname (john-smith)' },
    { value: 'firstname.lastname', label: 'firstname.lastname (john.smith)' },
    { value: 'firstname_lastname', label: 'firstname_lastname (john_smith)' },
    { value: 'firstname123', label: 'firstname + number (john123)' },
    { value: 'custom', label: 'Custom pattern' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email Format</label>
          <select
            value={emailType}
            onChange={(e) => setEmailType(e.target.value as EmailType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="random">Random (e.g., asdf1234)</option>
            {patterns.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        {emailType === 'custom' && (
          <div>
            <label className="block text-sm font-medium mb-2">Custom Pattern</label>
            <input
              type="text"
              value={customPattern}
              onChange={(e) => setCustomPattern(e.target.value)}
              placeholder="first.last"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use: firstname, lastname, first, last, or numbers
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Domain</label>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {domains.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
            <option value="custom">Custom domain...</option>
          </select>
        </div>

        {domain === 'custom' && (
          <div>
            <label className="block text-sm font-medium mb-2">Custom Domain</label>
            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Number of Emails</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <button
        onClick={generateEmails}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Generate Emails
      </button>

      {generatedEmails.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Generated Emails</h3>
            <button
              onClick={copyToClipboard}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Copy All
            </button>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {generatedEmails.map((email, i) => (
                <div key={i} className="flex gap-4 items-center p-2 bg-white rounded">
                  <span className="text-gray-400 text-sm w-6">{i + 1}.</span>
                  <span className="font-mono text-sm">{email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
