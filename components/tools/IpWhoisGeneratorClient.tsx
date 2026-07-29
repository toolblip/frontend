'use client';

import { useState } from 'react';

interface WhoisData {
  ip: string;
  network: {
    cidr: string;
    name: string;
    handle: string;
    startAddress: string;
    endAddress: string;
  };
  registration: {
    date: string;
    updated: string;
    expires: string;
  };
  registrant: {
    name: string;
    org: string;
    country: string;
  };
  abuse: {
    email: string;
    phone: string;
  };
  raw: string;
}

// Simulated IP WHOIS data generator
function generateWhoisData(ip: string): WhoisData {
  const isPrivate = ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.16.');
  
  if (isPrivate) {
    return {
      ip,
      network: {
        cidr: 'Private Range',
        name: 'Private Network',
        handle: 'RFC1918',
        startAddress: ip,
        endAddress: ip,
      },
      registration: {
        date: 'N/A',
        updated: 'N/A',
        expires: 'N/A',
      },
      registrant: {
        name: 'Private Address',
        org: 'IANA Private Use',
        country: 'XX',
      },
      abuse: {
        email: 'N/A',
        phone: 'N/A',
      },
      raw: `%
% This is a private IP address
%
% No WHOIS data available for private IPs
% Reference: RFC 1918
`,
    };
  }

  // Generate realistic-looking fake data for demo purposes
  const orgs = ['Cloudflare Inc', 'Amazon AWS', 'Google LLC', 'Microsoft Corp', 'DigitalOcean LLC', 'Hetzner Online GmbH'];
  const org = orgs[Math.floor(Math.random() * orgs.length)];
  
  const countries = ['US', 'DE', 'GB', 'FR', 'NL', 'JP', 'SG', 'AU'];
  const country = countries[Math.floor(Math.random() * countries.length)];

  const startParts = ip.split('.').slice(0, 3);
  const startAddress = `${startParts.join('.')}.0`;
  const endAddress = `${startParts.join('.')}.255`;
  
  const date = new Date();
  date.setFullYear(date.getFullYear() - Math.floor(Math.random() * 10));
  const regDate = date.toISOString().split('T')[0];
  
  date.setFullYear(date.getFullYear() + 2 + Math.floor(Math.random() * 8));
  const expDate = date.toISOString().split('T')[0];
  
  date.setMonth(date.getMonth() - Math.floor(Math.random() * 12));
  const updDate = date.toISOString().split('T')[0];

  return {
    ip,
    network: {
      cidr: `${startAddress}/24`,
      name: `${org} Global`,
      handle: `NET-${Math.floor(Math.random() * 9000000 + 1000000)}`,
      startAddress,
      endAddress,
    },
    registration: {
      date: regDate,
      updated: updDate,
      expires: expDate,
    },
    registrant: {
      name: `${org} Administrative`,
      org: org,
      country: country,
    },
    abuse: {
      email: 'abuse@' + org.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '') + '.com',
      phone: '+1-555-' + Math.floor(Math.random() * 900 + 100) + '-' + Math.floor(Math.random() * 9000 + 1000),
    },
    raw: `#
# ARIN WHOIS data and services
#
# Query terms:
#   Domain:    ${ip}
#   IP:        ${ip}
#
# Data fetched: ${new Date().toISOString()}
#
# ARIN WHOIS data
#
NetRange:       ${startAddress} - ${endAddress}
CIDR:           ${startAddress}/24
NetName:        ${org.toUpperCase().replace(/\s+/g, '-')}-GB
NetHandle:      NET-${Math.floor(Math.random() * 9000000 + 1000000)}
Parent:         NET-${Math.floor(Math.random() * 9000000 + 1000000)}
NetType:        Direct Allocation
OriginAS:       AS${Math.floor(Math.random() * 90000 + 10000)}
Organization:   ${org} (${org.split(' ').map(w => w.slice(0,4).toUpperCase()).join('-')})
RegDate:        ${regDate}
Updated:        ${updDate}
Ref:            https://rdap.arin.net/registry/ip/${startAddress.replace(/\./g, '')}


OrgName:        ${org}
OrgId:          ${org.split(' ').map(w => w.slice(0,4).toUpperCase()).join('-')}
Country:        ${country}
State/Province: ${country === 'US' ? 'CA' : country}
City:           ${country === 'US' ? 'San Francisco' : country === 'DE' ? 'Frankfurt' : 'London'}
Address:        ${Math.floor(Math.random() * 9000 + 1000)} Main Street
PostalCode:     ${Math.floor(Math.random() * 90000 + 10000)}
RegDate:        ${regDate}
Updated:        ${updDate}

OrgAbuseHandle: ABUSE${Math.floor(Math.random() * 900000 + 100000)}
OrgAbuseName:   Abuse
OrgAbusePhone:  ${'abuse'.replace('abuse', '+1-555-' + Math.floor(Math.random() * 900 + 100) + '-' + Math.floor(Math.random() * 9000 + 1000))}
OrgAbuseEmail:  abuse@${org.toLowerCase().replace(/\s+/g, '')}.com
OrgAbuseRef:    https://rdap.arin.net/registry/entity/ABUSE${Math.floor(Math.random() * 900000 + 100000)}
#
# End of ARIN WHOIS results
#`,
  };
}

export default function IpWhoisGeneratorClient() {
  const [ip, setIp] = useState('');
  const [whoisData, setWhoisData] = useState<WhoisData | null>(null);
  const [loading, setLoading] = useState(false);

  const validateIP = (ip: string): boolean => {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    return parts.every(part => {
      const num = parseInt(part);
      return !isNaN(num) && num >= 0 && num <= 255;
    });
  };

  const lookup = () => {
    if (!ip.trim()) return;
    
    if (!validateIP(ip)) {
      alert('Please enter a valid IPv4 address');
      return;
    }

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setWhoisData(generateWhoisData(ip));
      setLoading(false);
    }, 500);
  };

  const generateRandom = () => {
    const randomIP = () => Math.floor(Math.random() * 255);
    setIp(`${Math.floor(Math.random() * 200) + 1}.${randomIP()}.${randomIP()}.${randomIP()}`);
  };

  const copyRaw = () => {
    if (whoisData) {
      navigator.clipboard.writeText(whoisData.raw);
    }
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="Enter IP address (e.g., 8.8.8.8)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={generateRandom}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Random
        </button>
        <button
          onClick={lookup}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {loading ? 'Looking up...' : 'Lookup'}
        </button>
      </div>

      {whoisData && (
        <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-900">{whoisData.ip}</h3>
            <p className="text-blue-700">{whoisData.network.name}</p>
          </div>

          <div className="tb-v2-grid-2">
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Network</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">CIDR:</dt>
                  <dd className="font-mono">{whoisData.network.cidr}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Start:</dt>
                  <dd className="font-mono">{whoisData.network.startAddress}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">End:</dt>
                  <dd className="font-mono">{whoisData.network.endAddress}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Handle:</dt>
                  <dd className="font-mono">{whoisData.network.handle}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Registration</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Registered:</dt>
                  <dd>{whoisData.registration.date}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Updated:</dt>
                  <dd>{whoisData.registration.updated}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Expires:</dt>
                  <dd>{whoisData.registration.expires}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Registrant</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Name:</dt>
                  <dd>{whoisData.registrant.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Organization:</dt>
                  <dd>{whoisData.registrant.org}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Country:</dt>
                  <dd>{whoisData.registrant.country}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Abuse Contact</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Email:</dt>
                  <dd className="font-mono text-sm">{whoisData.abuse.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Phone:</dt>
                  <dd className="font-mono">{whoisData.abuse.phone}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Raw WHOIS Data</h4>
              <button
                onClick={copyRaw}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Copy
              </button>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs font-mono">
              {whoisData.raw}
            </pre>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <strong>Note:</strong> This tool generates simulated WHOIS data for demonstration purposes. 
        For actual IP lookup, consider using a real WHOIS API service.
      </div>
    </div>
  );
}
