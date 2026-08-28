import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

const LT_ENDPOINT = 'https://api.languagetool.org/v2/check';
const MAX_CHARS = 20_000;

function isToolblipRequest(request: NextRequest): boolean {
  const origin = request.headers.get('origin') || '';
  const referer = request.headers.get('referer') || '';
  const host = request.headers.get('host') || '';
  return (
    origin.includes('toolblip.com') ||
    referer.includes('toolblip.com') ||
    host.startsWith('localhost') ||
    host.startsWith('127.0.0.1')
  );
}

export async function POST(request: NextRequest) {
  if (!isToolblipRequest(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: { text?: string; language?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const text = typeof body.text === 'string' ? body.text : '';
  if (!text.trim()) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }
  if (text.length > MAX_CHARS) {
    return NextResponse.json(
      { error: `Text is too long (max ${MAX_CHARS.toLocaleString()} characters)` },
      { status: 400 }
    );
  }

  const language = typeof body.language === 'string' && body.language ? body.language : 'en-US';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    const res = await fetch(LT_ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `text=${encodeURIComponent(text)}&language=${encodeURIComponent(language)}`,
    });

    clearTimeout(timeout);

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Grammar service unavailable', detail: data },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.name === 'AbortError'
          ? 'Grammar service timed out'
          : error.message
        : 'Grammar service unavailable';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
