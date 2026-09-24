import Link from 'next/link';
import BrandMark from './BrandMark';
import DirectoryBadgeImage from './DirectoryBadgeImage';
import ApiStatus from '@/components/ApiStatus';
import { tools } from '@/data/tools';

// Keep both tracks identical; only the original participates in keyboard navigation.
function DirectoryBadges({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="tb-v2-directory-group" aria-hidden={duplicate || undefined}>
      <a tabIndex={duplicate ? -1 : undefined} href="https://saascity.io" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/saascity.svg" alt="Featured on SaaSCity" width="150" height="54" fallback="SaaSCity" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://launchigniter.com/product/toolblip?ref=badge-toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/launchigniter.svg" alt="Featured on LaunchIgniter" width="212" height="55" fallback="LaunchIgniter" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://earlyhunt.com/project/toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/earlyhunt.svg" alt="Featured on EarlyHunt" width="265" height="58" fallback="EarlyHunt" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://indiehunt.io/project/toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/indiehunt.svg" alt="Featured on IndieHunt" width="265" height="58" fallback="IndieHunt" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://fazier.com/launches/toolblip.com" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/fazier.svg" width="120" alt="Fazier badge" fallback="Fazier" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://tinylaunch.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/tinylaunch.svg" alt="TinyLaunch Badge" style={{ width: 202, height: 'auto' }} fallback="TinyLaunch" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://neeed.directory/products/toolblip?utm_source=toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/neeed-directory.svg" alt="Featured on neeed.directory" width="139" fallback="neeed.directory" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://findly.tools/toolblip?utm_source=toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/findly-tools.svg" alt="Featured on Findly.tools" width="175" height="55" fallback="Findly.tools" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://twelve.tools" target="_blank">
        <DirectoryBadgeImage src="/directory-badges/twelve-tools.svg" alt="Featured on Twelve Tools" width="200" height="54" fallback="Twelve Tools" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.outdr.lol/card/startuptrusted.com" target="_blank" rel="noopener" className="inline-block transition-transform hover:scale-105">
        <span className="tb-v2-directory-text">outdr.lol</span>
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.foundrlist.com/product/toolblip?utm_source=badge&utm_medium=embed" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/foundrlist.svg" alt="Featured on FoundrList" width="150" height="48" fallback="FoundrList" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://confettisaas.com/saas/toolblip-com?ref=badge" target="_blank" rel="noopener" aria-label="View Toolblip on ConfettiSaaS">
        <DirectoryBadgeImage src="/directory-badges/confettisaas.svg" width="250" height="54" alt="Toolblip on ConfettiSaaS" style={{ display: 'block' }} fallback="ConfettiSaaS" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://auraplusplus.com/projects/toolblip" target="_blank" rel="noopener" title="View this project on Aura++">
        <DirectoryBadgeImage src="/directory-badges/aura.svg" alt="Featured on Aura++" width="265" height="58" fallback="Aura++" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.superlaun.ch/products/3508" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/super-launch.png" alt="Featured on Super Launch" width="300" height="300" fallback="Super Launch" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://tools.launchllama.co?utm_source=badge&utm_medium=referral" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/launch-llama-tools.png" alt="Featured on Launch Llama Tools" width="200" height="52" fallback="Launch Llama Tools" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://smollaunch.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/smol-launch.svg" alt="Toolblip — Featured on Smol Launch" width="250" height="60" fallback="Smol Launch" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://launchboosts.com/project/toolblip" target="_blank">
        <DirectoryBadgeImage src="/directory-badges/launchboosts.svg" alt="Featured on LaunchBoosts" width="180" height="54" fallback="LaunchBoosts" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.launchvault.dev" target="_blank" title="Featured on LaunchVault">
        <span className="tb-v2-directory-text">LaunchVault</span>
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.verifiedtools.info/tools/toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/verified-tools.svg" alt="Toolblip on Verified Tools — AI & SaaS tools directory" width="200" height="54" fallback="Verified Tools" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} data-topaitools4u-badge="verified-listing" href="https://www.topaitools4u.site" target="_blank" rel="noopener" aria-label="Listed on TopAITools4U" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: '1px solid #d9d9d9', borderRadius: 12, background: '#ffffff', color: '#111111', fontFamily: 'Inter,Arial,sans-serif', textDecoration: 'none' }}>
        <DirectoryBadgeImage src="/directory-badges/topaitools4u.svg" alt="TopAITools4U" width="32" height="32" style={{ display: 'block', width: 32, height: 32, borderRadius: 9 }} fallback="" />
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b7280' }}>Listed on</span>
          <span style={{ fontSize: 15, fontWeight: 700 }}>TopAITools4U</span>
        </span>
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://makerhunt.io/project/toolblip" target="_blank" rel="noopener" title="Featured on MakerHunt">
        <DirectoryBadgeImage src="/directory-badges/makerhunt.svg" alt="Featured on MakerHunt" width="200" height="60" fallback="MakerHunt" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.startup.sx/product/toolblip-ce96?verify=fcb6b0b5fa7ba124c837775a248d82a6" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/startup-sx.png" alt="Featured on Startup.sx" width="150" fallback="Startup.sx" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://webspot.app" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/webspot.svg" alt="Featured on Webspot" style={{ height: 54, width: 'auto' }} fallback="Webspot" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://uno.directory" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/uno-directory.svg" alt="Listed on Uno Directory" width="120" height="30" fallback="Uno Directory" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://sidehunt.io/project/toolblip" target="_blank" rel="noopener" title="View project on Sidehunt">
        <DirectoryBadgeImage src="/directory-badges/sidehunt.svg" alt="Featured on Sidehunt" width="200" height="60" fallback="Sidehunt" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://productfame.com" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/productfame.svg" alt="Featured on ProductFame" width="245" height="54" fallback="ProductFame" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://prolaunch.net" target="_blank" title="Pro Launch Featured Badge">
        <DirectoryBadgeImage src="/directory-badges/pro-launch.svg" alt="Pro Launch Featured Badge" style={{ width: 240, height: 'auto' }} fallback="Pro Launch" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://nicklaunches.com/products/toolblip/?utm_source=toolblip.com&utm_medium=badge&utm_campaign=featured" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/nick-launches.png" alt="Toolblip on Nick Launches" width="244" height="56" fallback="Nick Launches" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} target="_blank" href="https://aixcollection.com/ai/toolblip"><DirectoryBadgeImage src="/directory-badges/ai-x-collection.png" alt="AI X Collection" height="54" fallback="AI X Collection" /></a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.nxgntools.com/tools/toolblip?utm_source=toolblip" target="_blank" rel="noopener" style={{ display: 'inline-block', width: 'auto' }}>
        <DirectoryBadgeImage src="/directory-badges/nxgn-tools.svg" alt="Launching soon on NxGn Tools" style={{ height: '48px', width: 'auto' }} fallback="NxGn Tools" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://liftoapp.com/product/toolblip" target="_blank" rel="noopener noreferrer"><DirectoryBadgeImage src="/directory-badges/lifto.svg" alt="Featured on Lifto" width="200" height="54" fallback="Lifto" /></a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://versily.com/products/toolblip?utm_source=versily&utm_medium=badge&utm_campaign=featured" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/versily.svg" width="205" height="44" alt="Featured on Versily - Toolblip" decoding="async" style={{ height: 'auto', aspectRatio: '205/44' }} fallback="Versily" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.techtrendin.com/products/toolblip" target="_blank">
        <DirectoryBadgeImage src="/directory-badges/techtrendin.png" alt="Featured on TechTrendin'" style={{ width: 'auto', height: '52px' }} fallback="TechTrendin'" />
      </a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.seewhatnewai.com" target="_blank">[backlink description]</a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://wired.business" target="_blank"><DirectoryBadgeImage src="/directory-badges/wired-business.svg" alt="Featured on Wired Business" width="200" height="54" fallback="Wired Business" /></a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://sideprojects.net/projects/toolblip"><DirectoryBadgeImage src="/directory-badges/sideprojects-net.svg" alt="Launched on sideprojects.net" height="58" fallback="sideprojects.net" /></a>
      <a tabIndex={duplicate ? -1 : undefined} target="_blank" href="https://www.llmrelevance.com" aria-label="LLM Relevance - AI & SEO Tools for Small Business"><DirectoryBadgeImage src="/directory-badges/llm-relevance.svg" alt="LLM Relevance" height="44" fallback="LLM Relevance" /></a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://www.aitoolzdir.com" target="_blank">AI Toolz Dir</a>
      <a tabIndex={duplicate ? -1 : undefined} href="https://sololaunches.com/startups/toolblip" target="_blank"><DirectoryBadgeImage src="/directory-badges/solo-launches.svg" alt="Toolblip on Solo Launches" width="250" height="54" fallback="Solo Launches" /></a>
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
