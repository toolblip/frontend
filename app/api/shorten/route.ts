import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'short-links.json');
const BASE62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += BASE62[Math.floor(Math.random() * BASE62.length)];
  }
  return code;
}

function loadLinks(): Record<string, string> {
  if (!existsSync(DATA_FILE)) return {};
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveLinks(links: Record<string, string>) {
  writeFileSync(DATA_FILE, JSON.stringify(links, null, 2));
}

// Build a reverse lookup: url -> code
function findExistingCode(links: Record<string, string>, url: string): string | null {
  for (const [code, mappedUrl] of Object.entries(links)) {
    if (mappedUrl === url) return code;
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const links = loadLinks();

    // Check if this URL already has a short code
    const existingCode = findExistingCode(links, url);
    if (existingCode) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://toolblip.com';
      return NextResponse.json({
        short_url: `${baseUrl}/s/${existingCode}`,
        code: existingCode,
      });
    }

    // Generate a unique code
    let code: string;
    let attempts = 0;
    do {
      code = generateCode();
      attempts++;
      if (attempts > 100) {
        return NextResponse.json({ error: 'Failed to generate unique code' }, { status: 500 });
      }
    } while (links[code]);

    links[code] = url;
    saveLinks(links);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://toolblip.com';
    return NextResponse.json({
      short_url: `${baseUrl}/s/${code}`,
      code,
    });
  } catch (err) {
    console.error('Shorten API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
