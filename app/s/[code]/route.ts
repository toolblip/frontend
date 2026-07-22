import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'short-links.json');

function loadLinks(): Record<string, string> {
  if (!existsSync(DATA_FILE)) return {};
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const links = loadLinks();
  const targetUrl = links[code];

  if (!targetUrl) {
    return NextResponse.json({ error: 'Short link not found' }, { status: 404 });
  }

  return NextResponse.redirect(targetUrl, 302);
}
