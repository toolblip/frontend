import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import ShellCommandReferenceClient from '@/components/tools/ShellCommandReferenceClient';

// The app uses Next's automatic JSX runtime; Vitest's direct TSX imports use React.
beforeAll(() => vi.stubGlobal('React', React));
afterAll(() => vi.unstubAllGlobals());

describe('shell reference server markup', () => {
  it('protects SSH and Git examples from edge email rewriting before hydration', () => {
    const html = renderToStaticMarkup(React.createElement(ShellCommandReferenceClient));
    // Cloudflare documents these comments as the per-address obfuscation opt-out.
    expect(html).toContain('<!--email_off-->$ ssh deploy@server.com<!--/email_off-->');
    expect(html).toContain('<!--email_off-->$ git clone git@github.com:org/repo.git<!--/email_off-->');
  });

  it('keeps shell redirection as escaped text inside the protected examples', () => {
    const html = renderToStaticMarkup(React.createElement(ShellCommandReferenceClient));
    expect(html).toContain('<!--email_off-->$ tr &#39;a-z&#39; &#39;A-Z&#39; &lt; file.txt<!--/email_off-->');
    expect(html).not.toContain('< file.txt');
  });
});
