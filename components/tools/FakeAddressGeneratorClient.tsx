'use client';

import React, { useState, useEffect } from 'react';

const streetNames = [
  'Main', 'Oak', 'Maple', 'Cedar', 'Pine', 'Elm', 'Washington', 'Park', 'Lake', 'Hill',
  'River', 'Spring', 'Valley', 'Forest', 'Meadow', 'Sunset', 'Ocean', 'Mountain', 'Garden', 'Liberty',
  'Franklin', 'Jefferson', 'Lincoln', 'Madison', 'Jackson', 'Cherry', 'Walnut', 'Highland', 'Center', 'Church',
];

const streetSuffixes = [
  'Street', 'Avenue', 'Boulevard', 'Drive', 'Lane', 'Road', 'Way', 'Court', 'Place', 'Circle',
  'Terrace', 'Trail', 'Path', 'Run', 'Point', 'Crossing', 'Square', 'Loop',
];

const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
  'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco',
  'Indianapolis', 'Seattle', 'Denver', 'Boston', 'El Paso', 'Nashville', 'Portland', 'Las Vegas',
  'Detroit', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno',
  'Sacramento', 'Atlanta', 'Miami', 'Cleveland', 'Omaha', 'Minneapolis', 'New Orleans', 'Honolulu',
  'Arlington', 'Bakersfield', 'Tampa', 'Aurora', 'Anaheim', 'Santa Ana', 'Corpus Christi', 'Riverside',
  'St. Louis', 'Lexington', 'Pittsburgh', 'Stockton', 'Cincinnati', 'St. Paul', 'Toledo', 'Greensboro',
];

const states = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
];

const firstNames = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth',
  'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
  'Christopher', 'Lisa', 'Daniel', 'Nancy', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra',
  'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa', 'Timothy', 'Deborah',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface GeneratedAddress {
  firstName: string;
  lastName: string;
  streetNumber: string;
  streetName: string;
  unit: string;
  city: string;
  state: string;
  stateCode: string;
  zipCode: string;
  fullAddress: string;
  formattedAddress: string;
}

function generateAddress(): GeneratedAddress {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const streetNumber = randomNumber(100, 9999).toString();
  const streetName = `${randomElement(streetNames)} ${randomElement(streetSuffixes)}`;
  const hasUnit = Math.random() > 0.5;
  const unit = hasUnit ? `#${randomNumber(1, 999)}` : '';
  const city = randomElement(cities);
  const state = randomElement(states);
  const zipCode = `${randomNumber(10000, 99999)}`;

  const fullAddress = `${streetNumber} ${streetName}${unit ? `, ${unit}` : ''}, ${city}, ${state.code} ${zipCode}`;
  const formattedAddress = [
    `${firstName} ${lastName}`,
    `${streetNumber} ${streetName}${unit ? `, ${unit}` : ''}`,
    `${city}, ${state.code} ${zipCode}`,
  ].join('\n');

  return {
    firstName,
    lastName,
    streetNumber,
    streetName,
    unit,
    city,
    state: state.name,
    stateCode: state.code,
    zipCode,
    fullAddress,
    formattedAddress,
  };
}

export default function FakeAddressGeneratorClient() {
  const [address, setAddress] = useState<GeneratedAddress | null>(null);
  const [count, setCount] = useState(1);
  const [allAddresses, setAllAddresses] = useState<GeneratedAddress[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setAddress(generateAddress());
    setMounted(true);
  }, []);

  const generate = () => {
    const newAddresses = Array.from({ length: count }, () => generateAddress());
    setAddress(newAddresses[0]);
    setAllAddresses(newAddresses);
  };

  const generateMultiple = () => {
    generate();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!mounted) {
    return (
      <div className="tb-v2-card">
        <div className="tb-v2-card-header">
          <h2 className="tb-v2-card-title">Fake Address Generator</h2>
          <p className="tb-v2-card-description">
            Generate realistic fake USA addresses for testing and development
          </p>
        </div>
        <div className="tb-v2-card p-6 mb-6 text-center text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Fake Address Generator</h2>
        <p className="tb-v2-card-description">
          Generate realistic fake USA addresses for testing and development
        </p>
      </div>

      <div className="tb-v2-form-group">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="tb-v2-label">Number of Addresses</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              className="tb-v2-input w-24"
            />
          </div>
          <button
            onClick={generateMultiple}
            className="tb-v2-button tb-v2-button-primary flex-1 md:flex-none"
          >
            Generate Address{count > 1 ? 'es' : ''}
          </button>
        </div>
      </div>

      <div className="tb-v2-card p-6 mb-6">
        {address ? (
          <>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Full Address</p>
                <p className="font-medium">{address.fullAddress}</p>
              </div>
              <button
                onClick={() => copyToClipboard(address.fullAddress)}
                className="tb-v2-button tb-v2-button-secondary text-sm"
              >
                Copy
              </button>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="tb-v2-grid-2">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium">{address.firstName} {address.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Street Address</p>
                  <p className="font-medium">
                    {address.streetNumber} {address.streetName}
                    {address.unit && `, ${address.unit}`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">City</p>
                  <p className="font-medium">{address.city}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">State</p>
                  <p className="font-medium">{address.state} ({address.stateCode})</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">ZIP Code</p>
                  <p className="font-medium">{address.zipCode}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-xs text-gray-500 mb-1">Formatted</p>
              <pre className="text-sm bg-gray-50 p-3 rounded font-mono whitespace-pre-wrap">
                {address.formattedAddress}
              </pre>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center py-4">Click "Generate Address" to create an address</p>
        )}
      </div>

      {allAddresses.length > 1 && (
        <div className="tb-v2-form-group">
          <div className="flex justify-between items-center mb-2">
            <div className="tb-v2-label mb-0">All Generated Addresses ({allAddresses.length})</div>
            <button
              onClick={() => setShowAll(!showAll)}
              className="tb-v2-button tb-v2-button-secondary text-sm"
            >
              {showAll ? 'Hide' : 'Show'} All
            </button>
          </div>
          {showAll && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allAddresses.map((addr, index) => (
                <div key={index} className="tb-v2-card p-3 flex justify-between items-center">
                  <span className="text-sm">{addr.fullAddress}</span>
                  <button
                    onClick={() => copyToClipboard(addr.fullAddress)}
                    className="tb-v2-button tb-v2-button-secondary text-xs py-1 px-2"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Export All</div>
        <div className="tb-v2-mode-tabs">
          <button
            onClick={() => copyToClipboard(allAddresses.map((a) => a.fullAddress).join('\n'))}
            className="tb-v2-button tb-v2-button-secondary flex-1"
          >
            Copy All as Text
          </button>
          <button
            onClick={() => copyToClipboard(JSON.stringify(allAddresses, null, 2))}
            className="tb-v2-button tb-v2-button-secondary flex-1"
          >
            Copy All as JSON
          </button>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Address Components</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <div className="tb-v2-card p-2 text-center">
            <div className="text-xs text-gray-500">First Name</div>
            <div className="font-mono text-sm">{address?.firstName || ' - '}</div>
          </div>
          <div className="tb-v2-card p-2 text-center">
            <div className="text-xs text-gray-500">Last Name</div>
            <div className="font-mono text-sm">{address?.lastName || ' - '}</div>
          </div>
          <div className="tb-v2-card p-2 text-center">
            <div className="text-xs text-gray-500">Street #</div>
            <div className="font-mono text-sm">{address?.streetNumber || ' - '}</div>
          </div>
          <div className="tb-v2-card p-2 text-center">
            <div className="text-xs text-gray-500">Unit</div>
            <div className="font-mono text-sm">{address?.unit || 'None'}</div>
          </div>
          <div className="tb-v2-card p-2 text-center">
            <div className="text-xs text-gray-500">ZIP</div>
            <div className="font-mono text-sm">{address?.zipCode || ' - '}</div>
          </div>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Statistics</div>
        <div className="tb-v2-card p-4 text-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{states.length}</div>
              <div className="text-xs text-gray-500">States</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{cities.length}</div>
              <div className="text-xs text-gray-500">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{streetNames.length * streetSuffixes.length}</div>
              <div className="text-xs text-gray-500">Street Combos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{firstNames.length * lastNames.length}</div>
              <div className="text-xs text-gray-500">Name Combos</div>
            </div>
          </div>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Disclaimer</div>
        <div className="tb-v2-card p-4 text-sm text-gray-600">
          <p>
            These addresses are randomly generated and do not represent actual locations.
            They are intended for testing, development, and prototyping purposes only.
            Do not use these addresses for any real-world purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
