import Link from 'next/link';
import BrandMark from './BrandMark';
import DirectoryBadgeImage from './DirectoryBadgeImage';
import ApiStatus from '@/components/ApiStatus';
import { tools } from '@/data/tools';

function DirectoryBadgeLink({
  duplicate,
  href,
  target,
  rel,
  tabIndex,
  children,
  ...attributes
}: React.ComponentPropsWithoutRef<'a'> & { duplicate: boolean }) {
  return (
    <a {...attributes} href={href} target={target} rel={rel} tabIndex={duplicate ? -1 : tabIndex}>
      {children}
    </a>
  );
}

// Keep both tracks identical; only the original participates in keyboard navigation.
function DirectoryBadges({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="tb-v2-directory-group" aria-hidden={duplicate || undefined}>
      <DirectoryBadgeLink duplicate={duplicate} href="https://saascity.io" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/saascity.svg" alt="Featured on SaaSCity" width="150" height="54" fallback="SaaSCity" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchigniter.com/product/toolblip?ref=badge-toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/launchigniter.svg" alt="Featured on LaunchIgniter" width="212" height="55" fallback="LaunchIgniter" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://earlyhunt.com/project/toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/earlyhunt.svg" alt="Featured on EarlyHunt" width="265" height="58" fallback="EarlyHunt" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://indiehunt.io/project/toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/indiehunt.svg" alt="Featured on IndieHunt" width="265" height="58" fallback="IndieHunt" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://fazier.com/launches/toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/fazier-monthly.svg" width="255" height="54" alt="Fazier #5 Product of the Month" fallback="Fazier" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://tinylaunch.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/tinylaunch.svg" alt="TinyLaunch Badge" style={{ width: 202, height: 'auto' }} fallback="TinyLaunch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://neeed.directory/products/toolblip?utm_source=toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/neeed-directory.svg" alt="Featured on neeed.directory" width="139" fallback="neeed.directory" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://findly.tools/toolblip?utm_source=toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/findly-tools.svg" alt="Featured on Findly.tools" width="175" height="55" fallback="Findly.tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://twelve.tools" target="_blank">
        <DirectoryBadgeImage src="/directory-badges/twelve-tools.svg" alt="Featured on Twelve Tools" width="200" height="54" fallback="Twelve Tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.outdr.lol/card/startuptrusted.com" target="_blank" rel="noopener" className="inline-block transition-transform hover:scale-105">
        <span className="tb-v2-directory-text">outdr.lol</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.foundrlist.com/product/toolblip?utm_source=badge&utm_medium=embed" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/foundrlist.svg" alt="Featured on FoundrList" width="150" height="48" fallback="FoundrList" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://confettisaas.com/saas/toolblip-com?ref=badge" target="_blank" rel="noopener" aria-label="View Toolblip on ConfettiSaaS">
        <DirectoryBadgeImage src="/directory-badges/confettisaas.svg" width="250" height="54" alt="Toolblip on ConfettiSaaS" style={{ display: 'block' }} fallback="ConfettiSaaS" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://auraplusplus.com/projects/toolblip" target="_blank" rel="noopener" title="View this project on Aura++">
        <DirectoryBadgeImage src="/directory-badges/aura.svg" alt="Featured on Aura++" width="265" height="58" fallback="Aura++" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.superlaun.ch/products/3508" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/super-launch.png" alt="Featured on Super Launch" width="300" height="300" fallback="Super Launch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://tools.launchllama.co?utm_source=badge&utm_medium=referral" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/launch-llama-tools.png" alt="Featured on Launch Llama Tools" width="200" height="52" fallback="Launch Llama Tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://smollaunch.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/smol-launch.svg" alt="Toolblip — Featured on Smol Launch" width="250" height="60" fallback="Smol Launch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchboosts.com/project/toolblip" target="_blank">
        <DirectoryBadgeImage src="/directory-badges/launchboosts.svg" alt="Featured on LaunchBoosts" width="180" height="54" fallback="LaunchBoosts" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.launchvault.dev" target="_blank" title="Featured on LaunchVault">
        <span className="tb-v2-directory-text">LaunchVault</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.verifiedtools.info/tools/toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/verified-tools.svg" alt="Toolblip on Verified Tools — AI & SaaS tools directory" width="200" height="54" fallback="Verified Tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} data-topaitools4u-badge="verified-listing" href="https://www.topaitools4u.site" target="_blank" rel="noopener" aria-label="Listed on TopAITools4U" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: '1px solid #d9d9d9', borderRadius: 12, background: '#ffffff', color: '#111111', fontFamily: 'Inter,Arial,sans-serif', textDecoration: 'none' }}>
        <DirectoryBadgeImage src="/directory-badges/topaitools4u.svg" alt="TopAITools4U" width="32" height="32" style={{ display: 'block', width: 32, height: 32, borderRadius: 9 }} fallback="" />
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b7280' }}>Listed on</span>
          <span style={{ fontSize: 15, fontWeight: 700 }}>TopAITools4U</span>
        </span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://makerhunt.io/project/toolblip" target="_blank" rel="noopener" title="Featured on MakerHunt">
        <DirectoryBadgeImage src="/directory-badges/makerhunt.svg" alt="Featured on MakerHunt" width="200" height="60" fallback="MakerHunt" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.startup.sx/product/toolblip-ce96?verify=fcb6b0b5fa7ba124c837775a248d82a6" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/startup-sx.png" alt="Featured on Startup.sx" width="150" fallback="Startup.sx" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://startupfa.me/s/toolblip?utm_source=toolblip.com" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/startup-fame.webp" alt="Toolblip - Featured on Startup Fame" width="171" height="54" loading="eager" fallback="Startup Fame" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://webspot.app" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/webspot.svg" alt="Featured on Webspot" style={{ height: 54, width: 'auto' }} fallback="Webspot" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://uno.directory" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/uno-directory.svg" alt="Listed on Uno Directory" width="120" height="30" fallback="Uno Directory" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://sidehunt.io/project/toolblip" target="_blank" rel="noopener" title="View project on Sidehunt">
        <DirectoryBadgeImage src="/directory-badges/sidehunt.svg" alt="Featured on Sidehunt" width="200" height="60" fallback="Sidehunt" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://productfame.com" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/productfame.svg" alt="Featured on ProductFame" width="245" height="54" fallback="ProductFame" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://prolaunch.net" target="_blank" title="Pro Launch Featured Badge">
        <DirectoryBadgeImage src="/directory-badges/pro-launch.svg" alt="Pro Launch Featured Badge" style={{ width: 240, height: 'auto' }} fallback="Pro Launch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://nicklaunches.com/products/toolblip/?utm_source=toolblip.com&utm_medium=badge&utm_campaign=featured" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/nick-launches.png" alt="Toolblip on Nick Launches" width="244" height="56" fallback="Nick Launches" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} target="_blank" href="https://aixcollection.com/ai/toolblip"><DirectoryBadgeImage src="/directory-badges/ai-x-collection.png" alt="AI X Collection" height="54" fallback="AI X Collection" /></DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.nxgntools.com/tools/toolblip?utm_source=toolblip" target="_blank" rel="noopener" style={{ display: 'inline-block', width: 'auto' }}>
        <DirectoryBadgeImage src="/directory-badges/nxgn-tools.svg" alt="Launching soon on NxGn Tools" style={{ height: '48px', width: 'auto' }} fallback="NxGn Tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://liftoapp.com/product/toolblip" target="_blank" rel="noopener noreferrer"><DirectoryBadgeImage src="/directory-badges/lifto.svg" alt="Featured on Lifto" width="200" height="54" fallback="Lifto" /></DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://versily.com/products/toolblip?utm_source=versily&utm_medium=badge&utm_campaign=featured" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/versily.svg" width="205" height="44" alt="Featured on Versily - Toolblip" decoding="async" style={{ height: 'auto', aspectRatio: '205/44' }} fallback="Versily" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.techtrendin.com/products/toolblip" target="_blank">
        <DirectoryBadgeImage src="/directory-badges/techtrendin.png" alt="Featured on TechTrendin'" style={{ width: 'auto', height: '52px' }} fallback="TechTrendin'" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.seewhatnewai.com" target="_blank">[backlink description]</DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://wired.business" target="_blank"><DirectoryBadgeImage src="/directory-badges/wired-business.svg" alt="Featured on Wired Business" width="200" height="54" fallback="Wired Business" /></DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://sideprojects.net/projects/toolblip"><DirectoryBadgeImage src="/directory-badges/sideprojects-net.svg" alt="Launched on sideprojects.net" height="58" fallback="sideprojects.net" /></DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} target="_blank" href="https://www.llmrelevance.com" aria-label="LLM Relevance - AI & SEO Tools for Small Business"><DirectoryBadgeImage src="/directory-badges/llm-relevance.svg" alt="LLM Relevance" height="44" fallback="LLM Relevance" /></DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.aitoolzdir.com" target="_blank">AI Toolz Dir</DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://sololaunches.com/startups/toolblip" target="_blank"><DirectoryBadgeImage src="/directory-badges/solo-launches.svg" alt="Toolblip on Solo Launches" width="250" height="54" fallback="Solo Launches" /></DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchtory.com/projects/toolblip">Toolblip on Launchtory</DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://bowora.com/?via=0aoviedt" target="_blank">
        <DirectoryBadgeImage src="/directory-badges/bowora.svg" alt="Featured on Bowora" width="170" height="50" fallback="Bowora" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://saaspa.ge/product/cmu8mzn8n0005gm0a1obn4e2g" target="_blank" rel="nofollow">Featured on Saaspage.ge</DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://turbo0.com/item/toolblip" target="_blank" rel="noopener noreferrer">
        <span className="tb-v2-directory-text">Featured on Turbo0</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://sumodir.com" target="_blank" rel="dofollow">
        <DirectoryBadgeImage src="/directory-badges/sumodir.png" alt="Featured on SumoDir" width="200" height="54" fallback="Featured on SumoDir" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://dang.ai" target="_blank" rel="dofollow noopener">
        <span className="tb-v2-directory-text">Featured on Dang.ai</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://web-review.com" target="_blank" rel="dofollow">
        <DirectoryBadgeImage src="/directory-badges/web-review.png" alt="Featured on Web Review" width="200" height="54" fallback="Featured on Web Review" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://navfolders.com/" target="_blank" rel="noopener noreferrer">
        <span className="tb-v2-directory-text">Featured on NavFolders</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://codehype.ai/product/toolblip?utm_source=codehype_badge" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/codehype.svg" alt="Featured on CodeHype" width="180" height="65" decoding="async" loading="eager" style={{ height: 36, width: 'auto' }} fallback="Featured on CodeHype" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://saasgrow.app/saas/toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/saasgrow.svg" alt="Featured on SaaSGrow" width="240" height="54" loading="eager" fallback="SaaSGrow" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://huzzler.so/products/UI7339a8da/toolblip?utm_source=huzzler_product_website&utm_medium=badge&utm_campaign=free_listing" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/huzzler.png" alt="Huzzler Embed Badge" width="159" height="55" loading="eager" fallback="Huzzler" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aitooltrek.com">AI Tool Trek</DirectoryBadgeLink>
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
            <p>Free browser tools for developers and tinkerers. Most process input in your browser; accounts and some features use online services.</p>
          </div>
          <div>
            <h2>Tools</h2>
            <ul>
              <li><Link href="/tools?category=Developer">Developer</Link></li>
              <li><Link href="/tools?category=Text">Text</Link></li>
              <li><Link href="/tools/images">Image</Link></li>
              <li><Link href="/tools">All {toolCount} →</Link></li>
            </ul>
          </div>
          <div>
            <h2>Company</h2>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/products">Our Products</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/donate">Donate</Link></li>
            </ul>
          </div>
          <div>
            <h2>Resources</h2>
            <ul>
              <li><Link href="/api-docs">API Docs</Link></li>
              <li><Link href="/frontend-health">Status</Link></li>
              <li><Link href="/sponsors">Sponsors</Link></li>
              <li><a href="/sitemap.xml">Sitemap</a></li>
            </ul>
          </div>
          <div>
            <h2>Legal</h2>
            <ul>
              <li><Link href="/privacy">Privacy policy</Link></li>
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
