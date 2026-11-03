import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

const hosts = [
  'saaslineup.com', 'domainrating.lol', 'indiestore.co', 'webprojectlist.com', 'bunny.directory',
  'braginpublic.com', 'smartees.tech', 'norohunt.com', 'launchfinds.com', 'startupfinds.com',
  'startupscrolls.com', 'apptooling.com', 'themicrosaasdir.com', 'launchstag.com',
  'bricklaun.ch', 'softwareontheweb.com', 'ontoplist.com', 'goodsaas.xyz', 'toolroots.com', 'indieascent.com',
  'launchboard.dev', 'amaze.directory', 'findgreatsites.com', 'listyourproject.com', 'golanz.com', 'devlanz.com',
  'shiplaun.ch', 'smolfind.com', 'smoltop.com', 'smolmaker.com', 'verifiedlaunches.com', 'trustedlaunches.com',
  'launchfeeds.com', 'findscove.com', 'thistools.app', 'zerorevenue.club', 'megalaun.ch', 'aitoolslist.tools',
  'thedevtoolslist.com', 'softwarecomoservicio.com',
  'best.serp.co', 'directory.getseoo.com', 'fwfw.app', 'getlaunchpod.com', 'inuidea.com', 'scrappystartups.com', 'swipetolaunch.com', 'toolpilot.ai', 'toolquix.com', 'wtai.cc', 'aicavo.com', 'backlinkdirs.com', 'bestaitool.app', 'boringcashcow.com', 'firmsrated.com', 'mydirs.com', 'peerbear.io', 'startupproject.org', 'tooltrim.com', 'vibetoyou.com', 'indiepocket.com', 'launchgp.io', 'launchrove.com', 'launchwall.online', 'makerpocket.com', 'superlaunchai.com', 'tooldirectory.dev', 'toolsnap.ai', 'saatlas.com', 'ufind.best',
  'dirpilot.com', 'saasearch.io', 'adsly.io', 'confettisaas.com', 'francesaas.fr', 'indieshowcase.io', 'producthot.com', 'productwill.com', 'sameproduct.com', 'shipdirs.com', 'shipnlaunch.com', 'smollaunchpad.com', 'smollist.com', 'smolstartup.com', 'startupog.com', 'theonestartup.com', 'tooluck.org',
  'aitoolsaver.com', 'launchbuck.com', 'meshkore.com', 'nextbigproduct.com', 'primadirectory.it', 'rankcert.com', 'showmebest.ai', 'startuplist.ing', 'submitstartup.io', 'tooltrove.net', 'unique-listing.com',
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
