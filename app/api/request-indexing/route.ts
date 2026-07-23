import { NextRequest, NextResponse } from 'next/server';
import { getGSCCredentials } from '@/lib/gsc';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    if (!parsedUrl.hostname.includes('toolblip.com')) {
      return NextResponse.json({ error: 'Only toolblip.com URLs can be indexed' }, { status: 400 });
    }

    const creds = await getGSCCredentials();
    if (!creds) {
      return NextResponse.json({ error: 'GSC credentials not configured' }, { status: 500 });
    }

    // Get access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: await createJWT(creds),
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.json({ error: 'Failed to authenticate with GSC' }, { status: 500 });
    }

    const { access_token } = await tokenRes.json();

    // Request indexing via URL Inspection API
    const inspectRes = await fetch(
      'https://searchconsole.googleapis.com/webmasters/v3/urlInspection/index:inspect',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inspectionUrl: url,
          siteUrl: 'sc-domain:toolblip.com',
        }),
      }
    );

    const inspectData = await inspectRes.json();

    return NextResponse.json({
      success: true,
      url,
      result: inspectData.inspectionResult?.indexStatusResult || {},
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}

async function createJWT(creds: { client_email: string; private_key: string }): Promise<string> {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: creds.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encode = (obj: object) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const unsignedJwt = `${encode(header)}.${encode(payload)}`;

  const encoder = new TextEncoder();
  const keyData = creds.private_key.replace(/-----BEGIN PRIVATE KEY-----/, '').replace(/-----END PRIVATE KEY-----/, '').replace(/\s/g, '');
  const binaryDer = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey('pkcs8', binaryDer, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, encoder.encode(unsignedJwt));

  return `${unsignedJwt}.${btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}`;
}
