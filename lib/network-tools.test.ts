import { describe, expect, it } from 'vitest';
import { calculateCidr, calculateIpRange, parseIPv4, quoteYaml, validatePort, validateServiceName } from '@/lib/network-tools';

describe('network tool helpers', () => {
  it('strictly parses IPv4 and rejects malformed octets', () => {
    expect(parseIPv4('192.168.1.1')).toBe(3232235777);
    expect(parseIPv4('1..2.3')).toBeNull();
    expect(parseIPv4('1.2.3.4x')).toBeNull();
    expect(parseIPv4('01.2.3.4')).toBeNull();
  });

  it('calculates CIDR boundaries and special host counts', () => {
    expect(calculateCidr('192.168.1.9/24')).toMatchObject({ network: '192.168.1.0', broadcast: '192.168.1.255', totalAddresses: 256, usableHosts: 254 });
    expect(calculateCidr('10.0.0.0/31')).toMatchObject({ totalAddresses: 2, usableHosts: 2, firstHost: '10.0.0.0', lastHost: '10.0.0.1' });
    expect(calculateCidr('10.0.0.1/32')).toMatchObject({ totalAddresses: 1, usableHosts: 1, firstHost: '10.0.0.1', lastHost: '10.0.0.1' });
    expect(calculateCidr('10.0.0.1/24x')).toBeNull();
  });

  it('calculates an inclusive range and its smallest enclosing CIDR', () => {
    expect(calculateIpRange('192.168.1.10', '192.168.1.20')).toMatchObject({ count: 11, network: '192.168.1.0', broadcast: '192.168.1.31', prefix: 27 });
    expect(calculateIpRange('10.0.0.20', '10.0.0.10')).toBeNull();
  });

  it('validates compose identifiers and quotes YAML scalars', () => {
    expect(validateServiceName('api_1')).toBe(true);
    expect(validateServiceName('api: bad')).toBe(false);
    expect(validatePort('3000')).toBe(true);
    expect(validatePort('70000')).toBe(false);
    expect(quoteYaml('pa:ss\nword')).toBe('"pa:ss\\nword"');
  });
});
