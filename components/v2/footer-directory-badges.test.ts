import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

const hosts = [
  'saaslineup.com', 'domainrating.lol', 'indiestore.co', 'webprojectlist.com', 'bunny.directory',
  'braginpublic.com', 'smartees.tech', 'norohunt.com', 'launchfinds.com', 'startupfinds.com',
  'startupscrolls.com', 'apptooling.com', 'themicrosaasdir.com', 'saasearch.io', 'launchstag.com',
  'bricklaun.ch', 'softwareontheweb.com', 'ontoplist.com', 'goodsaas.xyz', 'toolroots.com', 'indieascent.com',
  'launchboard.dev', 'amaze.directory', 'findgreatsites.com', 'listyourproject.com', 'golanz.com', 'devlanz.com',
  'shiplaun.ch', 'smolfind.com', 'smoltop.com', 'smolmaker.com', 'verifiedlaunches.com', 'trustedlaunches.com',
  'launchfeeds.com', 'findscove.com', 'thistools.app', 'zerorevenue.club', 'megalaun.ch', 'aitoolslist.tools',
  'thedevtoolslist.com', 'softwarecomoservicio.com',
];

describe('footer directory badges', () => {
  it('lists each directory once per marquee track', () => {
    const html = renderToStaticMarkup(createElement(Footer));
    for (const host of hosts) {
      const links = html.match(new RegExp(`<a [^>]*href="https://(www\\.)?${host.replace('.', '\\.')}`, 'g')) ?? [];
      expect(links, host).toHaveLength(2); // original + aria-hidden copy
    }
  });
});
