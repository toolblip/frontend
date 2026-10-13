import Link from 'next/link';
import BrandMark from './BrandMark';
import DirectoryBadgeImage from './DirectoryBadgeImage';
import PreferredSourceButton from './PreferredSourceButton';
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
      <DirectoryBadgeLink duplicate={duplicate} href="https://aijet.cc" target="_blank">
        <DirectoryBadgeImage src="/directory-badges/aijet.svg" alt="Featured on AI Jet" width="200" height="55" fallback="Featured on AI Jet" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aihustle.tools" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">aihustle.tools</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://gets.tools" target="_blank">
        <DirectoryBadgeImage src="/directory-badges/gets-tools.svg" alt="Featured on Gets.Tools" width="200" height="54" fallback="Featured on Gets.Tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchit.fast" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/launchit.svg" alt="Featured on LaunchIt" fallback="Featured on LaunchIt" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://firstlook.tools" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/firstlook.svg" alt="Featured on First Look" width="200" height="54" fallback="Featured on First Look" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://mydentify.com" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">mydentify.com</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://publishyoursaas.com" target="_blank" rel="noopener" data-publishyoursaas-badge="manual-submission">
        <DirectoryBadgeImage src="/directory-badges/publishyoursaas.svg" alt="Listed on PublishYourSaaS" width="240" height="60" fallback="Listed on PublishYourSaaS" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://similarlabs.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/similarlabs.svg" alt="Featured on SimilarLabs" fallback="Featured on SimilarLabs" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://spotstartups.com" target="_blank">
        <DirectoryBadgeImage src="/directory-badges/spotstartups.svg" alt="Featured on Spot Startups - A Free Product Hunt Alternative" width="175" height="55" fallback="Featured on Spot Startups - A Free Product Hunt Alternative" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.stork.ai/" rel="nofollow" title="Stork Verified — stork.ai AI tools directory">
        <DirectoryBadgeImage src="/directory-badges/stork-verified.svg" alt="Stork Verified — stork.ai AI tools directory" width="216" height="44" fallback="Stork Verified — stork.ai AI tools directory" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://thesaasdir.com/product/toolblip?ref=badge" rel="dofollow">
        <DirectoryBadgeImage src="/directory-badges/thesaasdir.svg" alt="Featured on TheSaaSDir" width="182" height="46" fallback="Featured on TheSaaSDir" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://letslaunch.today/product/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/letslaunch.svg" alt="Toolblip on LetsLaunch" width="250" height="54" fallback="Toolblip on LetsLaunch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://toolrain.com/item/toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/toolrain.svg" alt="Listed on ToolRain" style={{ height: 60, width: 'auto' }} fallback="Listed on ToolRain" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://ufind.best" target="_blank" rel="noopener">
        <svg xmlns="http://www.w3.org/2000/svg" width="140.8" height="40" viewBox="0 0 140.8 40">
          <rect width="140.8" height="40" fill="#000000" rx="8" />
          <g transform="translate(14, 11)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
            </svg>
          </g>
          <text x="40" y="15.2" fill="#ffffff" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="10" fontWeight="400">Featured on</text>
          <text x="40" y="30" fill="#ffffff" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="14" fontWeight="600">ufind.best</text>
        </svg>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://useneedle.net/directory/toolblip">
        <span className="tb-v2-directory-text">https://useneedle.net/directory/toolblip</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://toolhunter.ai/ai-tool/toolblip?ref=badge" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/toolhunter.svg" alt="Featured on Toolhunter" width="200" height="50" fallback="Featured on Toolhunter" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.deepbluedirectory.com/">
        <span className="tb-v2-directory-text">Deep Blue Directory.com</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.ecobluedirectory.com/">
        <span className="tb-v2-directory-text">Eco Blue Directory.com</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.alive2directory.com/">
        <span className="tb-v2-directory-text">Alive 2 Directory.com</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://hotools.com/" title="HoTools - Online Tools Directory">
        <span className="tb-v2-directory-text">HoTools</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://devtool.io" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/devtool.svg" alt="Listed on DevTool.io" width="168" height="36" fallback="Listed on DevTool.io" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.launchandloop.com/product/toolblip" target="_blank" rel="dofollow">
        <DirectoryBadgeImage src="/directory-badges/launch-and-loop.svg" alt="Toolblip on Launch and Loop" width="170" height="46" fallback="Toolblip on Launch and Loop" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://wallof.tools/dev-tools/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/wall-of-tools.svg" alt="Featured on Wall of Tools" width="188" height="56" fallback="Featured on Wall of Tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.stackledge.com/tools/toolblip?ref=badge&t=bdg_491aae0e9b8f91a371248d14df3586e3" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/stackledge.svg" alt="Featured on StackLedge" width="200" height="54" fallback="Featured on StackLedge" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://easylaunch.dev/dev-tools/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/easylaunch.svg" alt="Featured on EasyLaunch" width="188" height="56" fallback="Featured on EasyLaunch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchkiwi.com/p/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/launchkiwi.svg" alt="Featured on LaunchKiwi" width="198" height="62" fallback="Featured on LaunchKiwi" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://starthub.zip" title="starthub.zip">
        <span className="tb-v2-directory-text">starthub.zip</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://toolindex.net/?ref=listed" target="_blank" rel="nofollow noopener">
        <span className="tb-v2-directory-text">Listed on Tool Index</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.productlaunchify.com" target="_blank" rel="noopener noreferrer" title="Featured on Product Launchify" aria-label="Featured on Product Launchify">
        <DirectoryBadgeImage src="/directory-badges/product-launchify.svg" alt="Featured on Product Launchify" width="231" height="55" fallback="Featured on Product Launchify" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://shipgrowth.dev" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/shipgrowth.png" alt="Featured on ShipGrowth" width="213" height="64" fallback="Featured on ShipGrowth" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://toolsclaw.com" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/toolsclaw.svg" alt="Featured on ToolsClaw" width="200" height="54" fallback="Featured on ToolsClaw" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://toolcurio.com" target="_blank" rel="dofollow">
        <DirectoryBadgeImage src="/directory-badges/toolcurio.png" alt="Featured on Toolcurio" width="200" height="54" fallback="Featured on Toolcurio" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://dododirectory.com" target="_blank" rel="dofollow">
        <DirectoryBadgeImage src="/directory-badges/dododirectory.png" alt="Featured on DodoDirectory" width="200" height="54" fallback="Featured on DodoDirectory" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://saascubes.com" rel="noopener" title="Listed on SaaS Cubes">
        <DirectoryBadgeImage src="/directory-badges/saascubes.png" alt="Listed on SaaS Cubes" width="175" height="54" fallback="Listed on SaaS Cubes" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.thetoolpicker.com?ref=yourtool" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on TheToolPicker</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://thedevtoolsdir.com/product/toolblip?ref=badge" rel="dofollow">
        <DirectoryBadgeImage src="/directory-badges/thedevtoolsdir.svg" alt="Featured on TheDevToolsDir" width="182" height="46" fallback="Featured on TheDevToolsDir" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://easydofollow.dev/dev-tools/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/easydofollow.svg" alt="Featured on EasyDoFollow" width="188" height="56" fallback="Featured on EasyDoFollow" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://marketingdb.live" target="_blank" rel="noopener noreferrer nofollow sponsored">
        <DirectoryBadgeImage src="/directory-badges/marketingdb.svg" alt="Launched on MarketingDB" width="190" height="44" fallback="Launched on MarketingDB" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.direct2app.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/direct2app.svg" alt="Featured On Direct2App" width="200" height="54" fallback="Featured On Direct2App" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://hiaitools.com" title="The latest AI Tools Directory">
        <span className="tb-v2-directory-text">The latest AI Tools Diresctory</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://ai-findr.com/" title="AI Findr Tools Directory">
        <span className="tb-v2-directory-text">AI Findr Tools Diresctory</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://dofollow.tools" target="_blank">
        <DirectoryBadgeImage src="/directory-badges/dofollow-tools.svg" alt="Featured on Dofollow.Tools" width="200" height="54" fallback="Featured on Dofollow.Tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aifinder.site" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/aifinder.png" alt="Discover more AI tools at aifinder.site" width="200" height="70" fallback="Discover more AI tools at aifinder.site" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://allinai.tools" title="All The Best AI Tools">
        <span className="tb-v2-directory-text">All in AI Tools</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchpadly.co/startup/toolblip?ref=badge" target="_blank" rel="noopener noreferrer" data-launchpadly-badge="toolblip" data-launchpadly-badge-variant="listed-on">
        <DirectoryBadgeImage src="/directory-badges/launchpadly.svg" alt="Launchpadly Startup Directory" width="260" height="48" fallback="Launchpadly Startup Directory" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.direct-directory.com/">
        <span className="tb-v2-directory-text">Direct-Directory.com</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://startuptrusted.com?ref=toolblip.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/startuptrusted.svg" alt="Toolblip on StartupTrusted" width="240" height="54" fallback="Toolblip on StartupTrusted" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://tools.cafe" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/tools-cafe.svg" alt="Listed on tools.cafe" width="220" height="54" fallback="Listed on tools.cafe" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://newwebdirectory.com/">
        <span className="tb-v2-directory-text">Newwebdirectory.com</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://in-sla.org/">
        <span className="tb-v2-directory-text">In-SLA Directory</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://backlinkhubs.com/?utm_source=badge&utm_medium=embed&utm_campaign=backlinkhubs" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/backlinkhubs.svg" alt="Listed on Backlinkhubs" width="130" height="48" fallback="Listed on Backlinkhubs" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://21st.tools/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on 21st.tools</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://sellwithboost.com" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/sellwithboost.svg" alt="Listed on Sell With boost" width="140" height="40" fallback="Listed on Sell With boost" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://saas.fyi" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/saas-fyi.svg" alt="Featured on SaaS.fyi" width="294" height="54" fallback="Featured on SaaS.fyi" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://earlylaunch.co/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on EarlyLaunch</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://devhub.best/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on DevHub</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://listbulb.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on Listbulb</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://saasaur.com/project/toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/saasaur.svg" alt="Featured on SaaSaur" width="200" height="60" fallback="Featured on SaaSaur" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://indexof.ai/tool/toolblip?ref=toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/indexof-ai.svg" alt="Featured on IndexOf.AI" width="200" height="40" fallback="Featured on IndexOf.AI" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://curlship.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on Curlship</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://seektool.ai/" target="_blank" title="SeekTool.ai Tools Directory">
        <span className="tb-v2-directory-text">SeekTool.ai Tools Directory</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://lemonlaunch.dev/dev-tools/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/lemonlaunch.svg" alt="Featured on LemonLaunch" width="188" height="56" fallback="LemonLaunch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://doforai.tools" target="_blank">
        <DirectoryBadgeImage src="/directory-badges/doforai-tools.webp" alt="Featured on doforai.tools" width="172" height="54" fallback="doforai.tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://theaitoolsdir.com/product/toolblip?ref=badge" target="_blank" rel="dofollow">
        <DirectoryBadgeImage src="/directory-badges/theaitoolsdir.svg" alt="Featured on TheAIToolsDir" width="182" height="46" fallback="TheAIToolsDir" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://hiproducty.com" target="_blank" rel="noopener noreferrer">
        <span className="tb-v2-directory-text">Featured on Hiproducty</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://elf08.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">The Elf Directory</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://shareyourstartup.com/s/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/shareyourstartup.svg" alt="Featured on Share Your Startup" width="250" height="54" fallback="Share Your Startup" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://activdirectory.net/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on Activ Directory</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aibesttop.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on AI Best Top</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aiblog.tools" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Find us on AIBlog.Tools</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://ailaunch.space/" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/ailaunch.svg" alt="Featured on AILaunchSpace" width="225" height="61" fallback="AILaunchSpace" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aitoolfame.com/item/harun-r-rayhan" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/aitoolfame.svg" alt="Featured on aitoolfame.com" height="54" fallback="aitoolfame.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.aitoolfinder.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on AI Tool Finder</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aitoolsmarketer.com/" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/aitoolsmarketer.svg" alt="Listed on AI Tools for Marketers" width="153" height="44" fallback="AI Tools for Marketers" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aiwith.me/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on AI With Me</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://dailypings.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on DailyPings</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://homedirectory.biz/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on Home Directory</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://indie.deals/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on Indie.deals</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://indieshowcase.io" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/indieshowcase.svg" alt="Featured on Indie Showcase" width="200" height="54" fallback="Indie Showcase" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchnest.io/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on LaunchNest</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://listmysaas.xyz/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on List My SaaS</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://listpitch.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on ListPitch</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://namedirectory.com.ar/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on Name Directory</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://newname.ai/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on NewName</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://saasbison.com" target="_blank" rel="dofollow">
        <DirectoryBadgeImage src="/directory-badges/saasbison.png" alt="Featured on SaaSBison" width="200" height="54" fallback="SaaSBison" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://saasdb.net" target="_blank" rel="dofollow">
        <DirectoryBadgeImage src="/directory-badges/saasdb.svg" alt="Featured on SaasDB" width="200" height="60" fallback="SaasDB" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://smolsaas.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on SmolSaaS</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://vantaige.io/?utm_source=badge&utm_medium=embed" target="_blank" rel="noopener noreferrer">
        <span className="tb-v2-directory-text">Featured on Vantaige.io</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://yourhack.ai/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on yourhack.ai</span>
      </DirectoryBadgeLink>
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
            <PreferredSourceButton />
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
        <div className="tb-v2-footer-meta">
          <span>© {year} Toolblip. Built to stay out of your way.</span>
          <ApiStatus />
        </div>
      </div>
    </footer>
  );
}
