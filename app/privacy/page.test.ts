// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import PrivacyPage from './page';

describe('privacy page', () => {
  it('says the account owner is kept in the Binary Labs customer list', () => {
    const html = renderToString(createElement(PrivacyPage)).replace(/<!-- -->/g, '');
    expect(html).toContain(
      'Binary Labs LLC keeps the account owner&#x27;s name, email, company, plan and sign-up source in its internal customer list to support you.',
    );
  });
});
