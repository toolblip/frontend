import Link from 'next/link';
import BrandMark from './BrandMark';
import ApiStatus from '@/components/ApiStatus';
import { tools } from '@/data/tools';

// Keep both tracks identical; only the original participates in keyboard navigation.
function DirectoryBadges({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="tb-v2-directory-group" aria-hidden={duplicate || undefined}>
      <a tabIndex={duplicate ? -1 : undefined} href="https://saascity.io" target="_blank" rel="noopener">
        <img src="https://saascity.io/badges/featured-dark.svg" alt="Featured on SaaSCity" width="150" height="54" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://launchigniter.com/product/toolblip?ref=badge-toolblip" target="_blank" rel="noopener noreferrer">
        <img src="https://launchigniter.com/api/badge/toolblip?theme=light" alt="Featured on LaunchIgniter" width="212" height="55" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://earlyhunt.com/project/toolblip" target="_blank" rel="noopener noreferrer">
        <img src="https://earlyhunt.com/badges/earlyhunt-badge-light.svg" alt="Featured on EarlyHunt" width="265" height="58" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://indiehunt.io/project/toolblip" target="_blank" rel="noopener noreferrer">
        <img src="https://indiehunt.io/badges/indiehunt-badge-light.svg" alt="Featured on IndieHunt" width="265" height="58" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://fazier.com/launches/toolblip.com" target="_blank" rel="noopener noreferrer">
        <img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=light" width="120" alt="Fazier badge" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://tinylaunch.com" target="_blank" rel="noopener">
        <img src="https://tinylaunch.com/tinylaunch_badge_launching_soon.svg" alt="TinyLaunch Badge" style={{ width: 202, height: 'auto' }} />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://neeed.directory/products/toolblip?utm_source=toolblip" target="_blank" rel="noopener">
        <img src="https://neeed.directory/badges/neeed-badge-light.svg" alt="Featured on neeed.directory" width="139" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://findly.tools/toolblip?utm_source=toolblip" target="_blank" rel="noopener noreferrer">
        <img src="https://findly.tools/badges/findly-tools-badge-light.svg" alt="Featured on Findly.tools" width="175" height="55" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://twelve.tools" target="_blank">
        <img src="https://twelve.tools/badge0-white.svg" alt="Featured on Twelve Tools" width="200" height="54" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.outdr.lol/card/startuptrusted.com" target="_blank" rel="noopener" className="inline-block transition-transform hover:scale-105">
        <img src="https://www.outdr.lol/badge/startuptrusted.com.svg?theme=light" alt="Domain Rating 54 on outdr.lol" width="168" height="40" loading="lazy" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.foundrlist.com/product/toolblip?utm_source=badge&utm_medium=embed" target="_blank" rel="noopener">
        <img src="https://www.foundrlist.com/api/badge/toolblip" alt="Featured on FoundrList" width="150" height="48" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://confettisaas.com/saas/toolblip-com?ref=badge" target="_blank" rel="noopener" aria-label="View Toolblip on ConfettiSaaS">
        <img src="https://confettisaas.com/badge-light.svg" width="250" height="54" alt="Toolblip on ConfettiSaaS" loading="lazy" style={{ display: 'block' }} />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://auraplusplus.com/projects/toolblip" target="_blank" rel="noopener" title="View this project on Aura++">
        <img src="https://auraplusplus.com/images/badges/featured-on-light.svg" alt="Featured on Aura++" width="265" height="58" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.superlaun.ch/products/3508" target="_blank" rel="noopener">
        <img src="https://www.superlaun.ch/badge.png" alt="Featured on Super Launch" width="300" height="300" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://tools.launchllama.co?utm_source=badge&utm_medium=referral" target="_blank" rel="noopener noreferrer">
        <img src="https://tools.launchllama.co/featured-badge.png?v=2" alt="Featured on Launch Llama Tools" width="200" height="52" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://smollaunch.com" target="_blank" rel="noopener">
        <img src="https://smollaunch.com/badges/featured.svg" alt="Toolblip — Featured on Smol Launch" loading="lazy" width="250" height="60" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://launchboosts.com/project/toolblip" target="_blank">
        <img src="https://launchboosts.com/badges/featured-dark.svg" alt="Featured on LaunchBoosts" width="180" height="54" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.launchvault.dev" target="_blank" title="Featured on LaunchVault">
        <img src="https://www.launchvault.dev/images/badges/launch-vault-badge.svg" alt="Featured on LaunchVault" style={{ width: 195, height: 'auto' }} />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.verifiedtools.info/tools/toolblip" target="_blank" rel="noopener noreferrer">
        <img src="https://www.verifiedtools.info/badge.svg" alt="Toolblip on Verified Tools — AI & SaaS tools directory" width="200" height="54" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} data-topaitools4u-badge="verified-listing" href="https://www.topaitools4u.site" target="_blank" rel="noopener" aria-label="Listed on TopAITools4U" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: '1px solid #d9d9d9', borderRadius: 12, background: '#ffffff', color: '#111111', fontFamily: 'Inter,Arial,sans-serif', textDecoration: 'none' }}>
        <img src="https://www.topaitools4u.site/logo.svg" alt="TopAITools4U" width="32" height="32" style={{ display: 'block', width: 32, height: 32, borderRadius: 9 }} />
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b7280' }}>Listed on</span>
          <span style={{ fontSize: 15, fontWeight: 700 }}>TopAITools4U</span>
        </span>
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://makerhunt.io/project/toolblip" target="_blank" rel="noopener" title="Featured on MakerHunt">
        <img src="https://makerhunt.io/badges/makerhunt-badge-light.svg" alt="Featured on MakerHunt" width="200" height="60" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.startup.sx/product/toolblip-ce96?verify=fcb6b0b5fa7ba124c837775a248d82a6" target="_blank" rel="noopener">
        <img src="https://www.startup.sx/badge.png" alt="Featured on Startup.sx" width="150" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://webspot.app" target="_blank" rel="noopener noreferrer">
        <img src="https://webspot.app/featured-light.svg" alt="Featured on Webspot" style={{ height: 54, width: 'auto' }} />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://uno.directory" target="_blank" rel="noopener">
        <img src="https://uno.directory/uno-directory.svg" alt="Listed on Uno Directory" width="120" height="30" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://sidehunt.io/project/toolblip" target="_blank" rel="noopener" title="View project on Sidehunt">
        <img src="https://sidehunt.io/badges/sidehunt-badge-light.svg" alt="Featured on Sidehunt" width="200" height="60" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://productfame.com" target="_blank" rel="noopener noreferrer">
        <img src="https://productfame.com/badges/featured-light.svg" alt="Featured on ProductFame" width="245" height="54" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://prolaunch.net" target="_blank" title="Pro Launch Featured Badge">
        <img src="https://prolaunch.net/images/badges/featured-light.svg" alt="Pro Launch Featured Badge" style={{ width: 240, height: 'auto' }} />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://nicklaunches.com/products/toolblip/?utm_source=toolblip.com&utm_medium=badge&utm_campaign=featured" target="_blank" rel="noopener">
        <img src="https://nicklaunches.com/badges/featured.png" alt="Toolblip on Nick Launches" width="244" height="56" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} target="_blank" href="https://aixcollection.com/ai/toolblip"><img src="https://aixcollection.com/assets/images/badge.png" alt="AI X Collection" height="54" loading="lazy" /></a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.nxgntools.com/tools/toolblip?utm_source=toolblip" target="_blank" rel="noopener" style={{ display: 'inline-block', width: 'auto' }}>
        <img src="https://www.nxgntools.com/api/embed/toolblip?type=LAUNCHING_SOON_ON" alt="Launching soon on NxGn Tools" style={{ height: '48px', width: 'auto' }} />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://liftoapp.com/product/toolblip" target="_blank" rel="noopener noreferrer"><img src="https://liftoapp.com/badges/featured-dark.svg" alt="Featured on Lifto" width="200" height="54" /></a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://versily.com/products/toolblip?utm_source=versily&utm_medium=badge&utm_campaign=featured" target="_blank" rel="noopener">
        <img src="https://amujqvxlqnrslaqiozkw.supabase.co/functions/v1/badge-svg?theme=dark&width=205&height=44&id=920b0a0f-2b65-46f6-b776-cc1b61026022" width="205" height="44" alt="Featured on Versily - Toolblip" loading="lazy" decoding="async" style={{ height: 'auto', aspectRatio: '205/44' }} />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.techtrendin.com/products/toolblip" target="_blank">
        <img src="https://www.techtrendin.com/badges/featured-light.png" alt="Featured on TechTrendin'" style={{ width: 'auto', height: '52px' }} />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.seewhatnewai.com" target="_blank">[backlink description]</a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://wired.business" target="_blank"><img src="https://wired.business/badge0-light.svg" alt="Featured on Wired Business" width="200" height="54" /></a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://sideprojects.net/projects/toolblip"><img src="https://sideprojects.net/projects/toolblip/badge.svg" alt="Launched on sideprojects.net" height="58" /></a>
      <a tabIndex={duplicate ? -1 : undefined} target="_blank" href="https://www.llmrelevance.com" aria-label="LLM Relevance - AI & SEO Tools for Small Business"><img src="https://www.llmrelevance.com/badges/llm-relevance-horizontal-light.svg" alt="LLM Relevance" height="44" /></a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.aitoolzdir.com" target="_blank">AI Toolz Dir</a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://sololaunches.com/startups/toolblip" target="_blank"><img src="https://sololaunches.com/api/badges/support?theme=light" alt="Toolblip on Solo Launches" width="250" height="54" /></a>
    </div>
  );
}

export default function Footer() {
  const toolCount = tools.length;
  const year = new Date().getFullYear();

  return (
    <footer className="tb-v2-footer">
      <div className="tb-v2-container">
        <div className="tb-v2-footer-grid">
          <div className="tb-v2-footer-brand">
            <div className="tb-v2-brand" style={{ fontSize: 18 }}>
              <BrandMark size={28} />
              <span>Toolblip</span>
            </div>
            <p>Quick, private, well-made tools for developers and tinkerers. No signup, no surveillance, just utility.</p>
          </div>
          <div>
            <h4>Tools</h4>
            <ul>
              <li><Link href="/tools?category=Developer">Developer</Link></li>
              <li><Link href="/tools?category=Text">Text</Link></li>
              <li><Link href="/tools/images">Image</Link></li>
              <li><Link href="/tools">All {toolCount} →</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/donate">Donate</Link></li>
            </ul>
          </div>
          <div>
            <h4>Resources</h4>
            <ul>
              <li><Link href="/api-docs">API Docs</Link></li>
              <li><Link href="/frontend-health">Status</Link></li>
              <li><Link href="/sponsors">Sponsors</Link></li>
              <li><a href="/sitemap.xml">Sitemap</a></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div
          className="tb-v2-footer-badge"
          role="region"
          aria-label="Directory listings (scroll to explore)"
          tabIndex={0}
        >
          <div className="tb-v2-directory-track">
            <DirectoryBadges />
            <DirectoryBadges duplicate />
          </div>
        </div>
        <div className="tb-v2-footer-meta">
          <span>© {year} Toolblip. Built to stay out of your way.</span>
          <ApiStatus />
        </div>
      </div>
    </footer>
  );
}
