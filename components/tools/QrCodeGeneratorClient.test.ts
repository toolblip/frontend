import { describe, expect, it } from 'vitest';
import { buildQrPayload, getQrRenderOptions } from './QrCodeGeneratorClient';

describe('buildQrPayload', () => {
  it('escapes Wi-Fi payload fields with standard QR escaping', () => {
    expect(buildQrPayload({
      type: 'wifi',
      text: '',
      ssid: 'Cafe;Net,One\\Two:Three"Four\'Five',
      wifiPassword: 'pa;ss,word\\ok:yes"now\'then',
      wifiSecurity: 'WPA',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
    })).toBe('WIFI:T:WPA;S:Cafe\\;Net\\,One\\\\Two\\:Three\\"Four\\\'Five;P:pa\\;ss\\,word\\\\ok\\:yes\\"now\\\'then;;');
  });

  it('validates Wi-Fi SSID with trim but preserves exact SSID bytes in the payload', () => {
    expect(buildQrPayload({
      type: 'wifi',
      text: '',
      ssid: '  Office Net  ',
      wifiPassword: '',
      wifiSecurity: 'nopass',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
    })).toBe('WIFI:T:nopass;S:  Office Net  ;;');
  });

  it('emits vCard 3.0 with escaped text, structured N, and CRLF line endings', () => {
    expect(buildQrPayload({
      type: 'vcard',
      text: '',
      ssid: '',
      wifiPassword: '',
      wifiSecurity: 'WPA',
      contactName: 'Ada, Lovelace',
      contactPhone: '+1;555\\0100',
      contactEmail: 'ada@example.com',
    })).toBe([
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Ada\\, Lovelace',
      'N:Lovelace;Ada\\,;;;',
      'TEL:+1\\;555\\\\0100',
      'EMAIL:ada@example.com',
      'END:VCARD',
    ].join('\r\n'));
  });
});

describe('getQrRenderOptions', () => {
  it('uses a four-module quiet zone for PNG and SVG renders', () => {
    expect(getQrRenderOptions(512)).toEqual({ width: 512, margin: 4 });
  });
});
