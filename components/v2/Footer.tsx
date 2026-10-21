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
        <DirectoryBadgeImage src="https://saascity.io/badges/featured-dark.svg" alt="Featured on SaaSCity" width="150" height="54" fallback="SaaSCity" />
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
        <DirectoryBadgeImage src="https://tinylaunch.com/tinylaunch_badge_launching_soon.svg" alt="TinyLaunch Badge" style={{ width: 202, height: 'auto' }} fallback="TinyLaunch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://neeed.directory/products/toolblip?utm_source=toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://neeed.directory/badges/neeed-badge-light.svg" alt="Featured on neeed.directory" width="139" fallback="neeed.directory" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://findly.tools/" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/findly-tools.svg" alt="Featured on Findly.tools" width="175" height="55" fallback="Findly.tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://twelve.tools/toolblip" target="_blank">
        <DirectoryBadgeImage src="https://twelve.tools/badge0-white.svg" alt="Featured on Twelve Tools" width="200" height="54" fallback="Twelve Tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.outdr.lol/card/toolblip.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://www.outdr.lol/badge/toolblip.com.svg?theme=light" alt="Domain Rating 7 on outdr.lol" width="168" height="40" fallback="outdr.lol" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.foundrlist.com/product/toolblip?utm_source=badge&utm_medium=embed" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://www.foundrlist.com/api/badge/toolblip" alt="Featured on FoundrList" width="150" height="48" fallback="FoundrList" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://confettisaas.com/saas/toolblip-com?ref=badge" target="_blank" rel="noopener" aria-label="View Toolblip on ConfettiSaaS">
        <DirectoryBadgeImage src="/directory-badges/confettisaas.svg" width="250" height="54" alt="Toolblip on ConfettiSaaS" style={{ display: 'block' }} fallback="ConfettiSaaS" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://auraplusplus.com/projects/toolblip" target="_blank" rel="noopener" title="View this project on Aura++">
        <DirectoryBadgeImage src="/directory-badges/aura.svg" alt="Featured on Aura++" width="265" height="58" fallback="Aura++" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.superlaun.ch/products/3508" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://www.superlaun.ch/badge.png" alt="Featured on Super Launch" width="300" height="300" fallback="Super Launch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://tools.launchllama.co/products/toolblip?utm_source=badge&utm_medium=referral" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://tools.launchllama.co/featured-badge.png?v=2" alt="Featured on Launch Llama Tools" width="200" height="52" fallback="Launch Llama Tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://smollaunch.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/smol-launch.svg" alt="Toolblip - Featured on Smol Launch" width="250" height="60" fallback="Smol Launch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchboosts.com/project/toolblip?utm_source=badge&utm_medium=embed" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://launchboosts.com/api/badge/toolblip" alt="Toolblip - Featured on LaunchBoosts" width="250" height="54" fallback="LaunchBoosts" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.launchvault.dev" target="_blank" title="Feature On Launch Vault">
        <DirectoryBadgeImage src="https://www.launchvault.dev/images/badges/launch-valut-badge.svg" alt="Feature On Launch Vault" style={{ width: 195, height: 'auto' }} fallback="LaunchVault" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.verifiedtools.info/tools/toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="/directory-badges/verified-tools.svg" alt="Toolblip on Verified Tools - AI & SaaS tools directory" width="200" height="54" fallback="Verified Tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} data-topaitools4u-badge="verified-listing" href="https://www.topaitools4u.site" target="_blank" rel="noopener" aria-label="Listed on TopAITools4U" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: '1px solid #d9d9d9', borderRadius: 12, background: '#ffffff', color: '#111111', fontFamily: 'Inter,Arial,sans-serif', textDecoration: 'none' }}>
        <DirectoryBadgeImage src="https://www.topaitools4u.site/logo.svg" alt="TopAITools4U" width="32" height="32" style={{ display: 'block', width: 32, height: 32, borderRadius: 9 }} fallback="" />
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b7280' }}>Listed on</span>
          <span style={{ fontSize: 15, fontWeight: 700 }}>TopAITools4U</span>
        </span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://makerhunt.io/" target="_blank" rel="noopener" title="Featured on MakerHunt">
        <DirectoryBadgeImage src="/directory-badges/makerhunt.svg" alt="Featured on MakerHunt" width="200" height="60" fallback="MakerHunt" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.startup.sx/product/toolblip-ce96?verify=fcb6b0b5fa7ba124c837775a248d82a6" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="/directory-badges/startup-sx.png" alt="Featured on Startup.sx" width="150" fallback="Startup.sx" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://startupfa.me/s/toolblip?utm_source=toolblip.com" target="_blank">
        <DirectoryBadgeImage src="https://startupfa.me/badges/featured-badge.webp" alt="Toolblip - Featured on Startup Fame" width="171" height="54" loading="eager" fallback="Startup Fame" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://webspot.app" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://webspot.app/featured-light.svg" alt="Featured on Webspot" style={{ height: 54, width: 'auto' }} fallback="Webspot" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://uno.directory/listings/tools/api-tools/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://uno.directory/uno-directory.svg" alt="Listed on Uno Directory" width="120" height="30" fallback="Uno Directory" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://sidehunt.io/project/toolblip" target="_blank" rel="noopener" title="View project on Sidehunt">
        <DirectoryBadgeImage src="https://sidehunt.io/badges/sidehunt-badge-light.svg" alt="Featured on Sidehunt" width="200" height="60" fallback="Sidehunt" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://productfame.com" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://productfame.com/badges/featured-light.svg" alt="Featured on ProductFame" width="245" height="54" fallback="ProductFame" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://prolaunch.net/projects/toolblip" target="_blank" title="Pro Launch Featured Badge">
        <DirectoryBadgeImage src="/directory-badges/pro-launch.svg" alt="Pro Launch Featured Badge" style={{ width: 240, height: 'auto' }} fallback="Pro Launch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://nicklaunches.com/products/toolblip/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://nicklaunches.com/badges/featured.png" alt="Toolblip on Nick Launches" width="244" height="56" fallback="Nick Launches" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aixcollection.com/" target="_blank">
        <DirectoryBadgeImage src="https://aixcollection.com/assets/images/badge.png" alt="AI X Collection" height="54" fallback="AI X Collection" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.nxgntools.com/tools/toolblip?utm_source=toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://www.nxgntools.com/api/embed/toolblip?type=LAUNCHING_SOON_ON" alt="Launching soon on NxGn Tools" style={{ height: 48, width: 'auto' }} fallback="NxGn Tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://liftoapp.com/" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://liftoapp.com/badges/featured-dark.svg" alt="Featured on Lifto" width="200" height="54" fallback="Lifto" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://versily.com/products/toolblip?utm_source=versily&utm_medium=badge&utm_campaign=featured" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://amujqvxlqnrslaqiozkw.supabase.co/functions/v1/badge-svg?theme=dark&width=205&height=44&id=920b0a0f-2b65-46f6-b776-cc1b61026022" alt="Featured on Versily - Toolblip" width="205" height="44" style={{ height: 'auto', aspectRatio: '205/44' }} decoding="async" fallback="Versily" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.techtrendin.com/products/toolblip" target="_blank">
        <DirectoryBadgeImage src="https://www.techtrendin.com/badges/featured-light.png" alt="Featured on TechTrendin'" style={{ width: 'auto', height: 52 }} fallback="TechTrendin'" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.seewhatnewai.com" target="_blank">[backlink description]</DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://wired.business/toolblip" target="_blank">
        <DirectoryBadgeImage src="https://wired.business/badge0-white.svg" alt="Featured on Wired Business" width="200" height="54" fallback="Wired Business" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://sideprojects.net/projects/toolblip">
        <DirectoryBadgeImage src="https://sideprojects.net/projects/toolblip/badge.svg" alt="Launched on sideprojects.net" height="58" fallback="sideprojects.net" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.llmrelevance.com" target="_blank" aria-label="LLM Relevance - AI & SEO Tools for Small Business">
        <DirectoryBadgeImage src="https://www.llmrelevance.com/badges/llm-relevance-horizontal-light.svg" alt="LLM Relevance" height="44" fallback="LLM Relevance" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.aitoolzdir.com" target="_blank">AI Toolz Dir</DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://sololaunches.com/startups/toolblip" target="_blank">
        <DirectoryBadgeImage src="https://sololaunches.com/api/badges/support?theme=light" alt="Toolblip on Solo Launches" width="250" height="54" fallback="Solo Launches" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchtory.com/projects/toolblip">Toolblip on Launchtory</DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://bowora.com/toolblip.com" target="_blank">
        <DirectoryBadgeImage src="/directory-badges/bowora.svg" alt="Featured on Bowora" width="170" height="50" fallback="Bowora" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://saaspa.ge/product/cmu8mzn8n0005gm0a1obn4e2g" target="_blank" rel="nofollow">
        <DirectoryBadgeImage src="https://saaspa.ge/api/embed/product/cmu8mzn8n0005gm0a1obn4e2g/badge.png?theme=orange" alt="Featured on Saaspa.ge" width="200" height="60" fallback="Featured on Saaspage.ge" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://turbo0.com/item/toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://img.turbo0.com/badge-listed-light.svg" alt="Featured on Turbo0" height="54" fallback="Featured on Turbo0" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://sumodir.com" target="_blank" rel="dofollow">
        <DirectoryBadgeImage src="https://sumodir.com/badge.png" alt="Featured on SumoDir" width="200" height="54" fallback="Featured on SumoDir" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://dang.ai" target="_blank" rel="dofollow noopener">
        <DirectoryBadgeImage src="https://assets.dang.ai/badges/dang-verified-dark.png" alt="Featured on Dang.ai" height="54" fallback="Featured on Dang.ai" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://web-review.com" target="_blank" rel="dofollow">
        <DirectoryBadgeImage src="https://web-review.com/badge.png" alt="Featured on Web Review" width="200" height="54" fallback="Featured on Web Review" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://navfolders.com" target="_blank">
        <DirectoryBadgeImage src="https://navfolders.com/badge/nav_dark.svg" alt="NavFolders" width="200" height="54" fallback="Featured on NavFolders" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://codehype.ai/product/toolblip?utm_source=codehype_badge" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://codehype.ai/badges/toolblip.svg?variant=find-us&v=20" alt="Featured on CodeHype" width="180" height="65" style={{ display: 'inline-block', border: 0, width: '100%', maxWidth: 180, height: 'auto', maxHeight: 65 }} decoding="async" loading="eager" fallback="Featured on CodeHype" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://saasgrow.app/saas/toolblip/badge" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://saasgrow.app/api/badge?type=featured&style=light" alt="Featured on SaaSGrow" loading="eager" fallback="SaaSGrow" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://huzzler.so/products/UI7339a8da/toolblip?utm_source=huzzler_product_website&utm_medium=badge&utm_campaign=free_listing" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://huzzler.so/assets/images/embeddable-badges/featured.png" alt="Huzzler Embed Badge" width="159" height="55" loading="eager" fallback="Huzzler" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aitooltrek.com">AI Tool Trek</DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aijet.cc/item/toolblip" target="_blank">
        <DirectoryBadgeImage src="https://aijet.cc/badge/badge_light.svg" alt="Featured on AI Jet" width="200" height="55" fallback="Featured on AI Jet" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aihustle.tools" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">aihustle.tools</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://gets.tools" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://gets.tools/badge/badge_dark.svg" alt="Featured on Gets.Tools" width="200" height="54" fallback="Featured on Gets.Tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchit.fast/tools/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://launchit.fast/img/launching.svg" alt="Featured on LaunchIt" fallback="Featured on LaunchIt" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://firstlook.tools" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://firstlook.tools/badge/badge_dark.svg" alt="Featured on First Look" width="200" height="54" fallback="Featured on First Look" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://mydentify.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://mydentify.com/badges/listed-on-mydentify.svg" alt="Listed on Mydentify" width="176" height="32" fallback="mydentify.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} data-publishyoursaas-badge="manual-submission" href="https://publishyoursaas.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://publishyoursaas.com/publishyoursaas-badge.svg" alt="Listed on PublishYourSaaS" width="240" height="60" fallback="Listed on PublishYourSaaS" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://similarlabs.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://similarlabs.com/similarlabs-embed-badge-light.svg" alt="Featured on SimilarLabs" fallback="Featured on SimilarLabs" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://spotstartups.com" target="_blank">
        <DirectoryBadgeImage src="https://spotstartups.com/assets/badges/spotstartups.com_badge_light.svg" alt="Featured on Spot Startups - A Free Product Hunt Alternative" width="175" height="55" fallback="Featured on Spot Startups - A Free Product Hunt Alternative" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.stork.ai/" rel="nofollow" title="Stork Verified - stork.ai AI tools directory">
        <DirectoryBadgeImage src="https://www.stork.ai/badge/verified-dark.svg" alt="Stork Verified - stork.ai AI tools directory" width="216" height="44" fallback="Stork Verified - stork.ai AI tools directory" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://thesaasdir.com/product/toolblip?ref=badge" rel="dofollow">
        <DirectoryBadgeImage src="https://thesaasdir.com/badge/toolblip.svg" alt="Featured on TheSaaSDir" width="160" height="44" fallback="Featured on TheSaaSDir" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://letslaunch.today/product/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://letslaunch.today/badge/toolblip.svg" alt="Toolblip on LetsLaunch" width="250" height="54" fallback="Toolblip on LetsLaunch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://toolrain.com/item/toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://toolrain.com/badges/badge-listed-light.svg" alt="Listed on ToolRain" style={{ height: 60, width: 'auto' }} fallback="Listed on ToolRain" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://ufind.best/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://ufind.best/badges/ufind-best-badge-light.svg" alt="Toolblip - Featured on ufind.best" width="139" height="44" fallback="Featured on ufind.best" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://useneedle.net/directory/toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://useneedle.net/badges/needle-directory.svg" alt="Listed on Needle Directory" height="44" fallback="https://useneedle.net/directory/toolblip" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://toolhunter.ai/ai-tool/toolblip?ref=badge" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://toolhunter.ai/badge/toolblip.svg?theme=light" alt="Featured on Toolhunter" width="200" height="50" fallback="Featured on Toolhunter" />
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
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchandloop.com/" target="_blank" rel="dofollow">
        <DirectoryBadgeImage src="https://www.launchandloop.com/api/badge/toolblip?theme=dark" alt="Toolblip on Launch & Loop" width="170" height="46" fallback="Toolblip on Launch and Loop" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://wallof.tools/dev-tools/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://wallof.tools/badge/toolwall-badge-light.svg" alt="Featured on Wall of Tools" width="188" height="56" fallback="Featured on Wall of Tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://stackledge.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://www.stackledge.com/badge?token=bdg_491aae0e9b8f91a371248d14df3586e3" alt="Featured on StackLedge" width="200" height="54" fallback="Featured on StackLedge" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://easylaunch.dev/dev-tools/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://easylaunch.dev/badge/easylaunch-badge-light.svg" alt="Featured on EasyLaunch" width="188" height="56" fallback="Featured on EasyLaunch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchkiwi.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://launchkiwi.com/badge-light.svg" alt="Featured on LaunchKiwi" width="200" height="54" fallback="Featured on LaunchKiwi" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://starthub.zip" title="starthub.zip">
        <span className="tb-v2-directory-text">starthub.zip</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://toolindex.net/tools/toolblip" target="_blank" rel="nofollow noopener">
        <DirectoryBadgeImage src="https://toolindex.net/badge/toolblip/medium.svg" alt="Featured on Tool Index" height="54" fallback="Listed on Tool Index" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.productlaunchify.com" target="_blank" rel="noopener noreferrer" title="Featured on Product Launchify" aria-label="Featured on Product Launchify">
        <DirectoryBadgeImage src="https://www.productlaunchify.com/images/badges/powered-by-light.svg" alt="Featured on Product Launchify" width="231" height="55" fallback="Featured on Product Launchify" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://shipgrowth.dev" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://storage.shipgrowth.dev/badge-light.png" alt="Featured on ShipGrowth" style={{ height: 64, width: 'auto' }} fallback="Featured on ShipGrowth" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://toolsclaw.com" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://toolsclaw.com/badge/toolsclaw.com-badge.svg" alt="Featured on ToolsClaw" width="200" height="54" fallback="Featured on ToolsClaw" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://toolcurio.com" target="_blank" rel="dofollow">
        <DirectoryBadgeImage src="https://toolcurio.com/badge-light.png" alt="Featured on Toolcurio" width="200" height="54" fallback="Featured on Toolcurio" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://dododirectory.com" target="_blank" rel="dofollow">
        <DirectoryBadgeImage src="https://dododirectory.com/badge-light.png" alt="Featured on DodoDirectory" width="200" height="54" fallback="Featured on DodoDirectory" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://saascubes.com" rel="noopener" title="Listed on SaaS Cubes">
        <DirectoryBadgeImage src="https://saascubes.com/images/badges/badge-dark.png" alt="Listed on SaaS Cubes" width="175" height="54" fallback="Listed on SaaS Cubes" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.thetoolpicker.com?ref=yourtool" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://img.shields.io/badge/Featured%20on-ToolPicker-2563eb?style=for-the-badge" alt="Featured on TheToolPicker" width="200" height="54" fallback="Featured on TheToolPicker" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://thedevtoolsdir.com/product/toolblip?ref=badge" rel="dofollow">
        <DirectoryBadgeImage src="https://thedevtoolsdir.com/badge/toolblip.svg" alt="Featured on TheDevToolsDir" width="182" height="46" fallback="Featured on TheDevToolsDir" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://easydofollow.dev/dev-tools/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://easydofollow.dev/badge/easydofollow-badge-light.svg" alt="Featured on EasyDoFollow" width="188" height="56" fallback="Featured on EasyDoFollow" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://marketingdb.live" target="_blank" rel="noopener noreferrer nofollow sponsored">
        <DirectoryBadgeImage src="https://marketingdb.live/badge.svg" alt="Launched on MarketingDB" width="190" height="44" fallback="Launched on MarketingDB" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.direct2app.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://www.direct2app.com/featured-light.svg" alt="Featured On Direct2App" style={{ height: 54, width: 'auto' }} fallback="Featured On Direct2App" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://hiaitools.com" title="The latest AI Tools Directory">
        <span className="tb-v2-directory-text">The latest AI Tools Diresctory</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://ai-findr.com/" title="AI Findr Tools Directory">
        <span className="tb-v2-directory-text">AI Findr Tools Diresctory</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://dofollow.tools" target="_blank">
        <DirectoryBadgeImage src="https://dofollow.tools/badge/badge_light.svg" alt="Featured on Dofollow.Tools" width="200" height="54" fallback="Featured on Dofollow.Tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aifinder.site" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://aifinder.site/light-badge.png" alt="Discover more AI tools at aifinder.site" style={{ width: 200, height: 'auto' }} fallback="Discover more AI tools at aifinder.site" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://allinai.tools" title="All The Best AI Tools">
        <span className="tb-v2-directory-text">All in AI Tools</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} data-launchpadly-badge="toolblip" data-launchpadly-badge-variant="listed-on" href="https://launchpadly.co/startup/toolblip?ref=badge" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://launchpadly.co/embed/badges/startup/toolblip.svg?variant=listed-on" alt="Launchpadly Startup Directory" width="260" height="48" style={{ display: 'block', border: 0 }} fallback="Launchpadly Startup Directory" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.direct-directory.com/">
        <span className="tb-v2-directory-text">Direct-Directory.com</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://startuptrusted.com?ref=toolblip.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://startuptrusted.com/api/badge?type=featured&style=light" alt="Toolblip on StartupTrusted" width="240" height="54" fallback="Toolblip on StartupTrusted" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://tools.cafe" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://tools.cafe/b/light.svg" alt="Listed on tools.cafe" width="220" height="54" fallback="Listed on tools.cafe" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://newwebdirectory.com/">
        <span className="tb-v2-directory-text">Newwebdirectory.com</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://in-sla.org/">
        <span className="tb-v2-directory-text">In-SLA Directory</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://backlinkhubs.com/?utm_source=badge&utm_medium=embed&utm_campaign=backlinkhubs" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://backlinkhubs.com/badge.svg?theme=light&label=Listed%20on%20Backlinkhubs" alt="Listed on Backlinkhubs" style={{ height: 48, width: 'auto' }} fallback="Listed on Backlinkhubs" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://21st.tools/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on 21st.tools</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://sellwithboost.com" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://sellwithboost.com/badge/listing.svg" alt="Listed on Sell With boost" style={{ height: 40, width: 'auto' }} fallback="Listed on Sell With boost" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://saas.fyi" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://saas.fyi/assets/brand/badge.svg" alt="Featured on SaaS.fyi" width="294" height="54" fallback="Featured on SaaS.fyi" />
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
        <DirectoryBadgeImage src="https://saasaur.com/assets/badges/featured-on-light.svg" alt="Featured on SaaSaur" width="200" height="60" fallback="Featured on SaaSaur" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://indexof.ai/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://indexof.ai/badge-light.svg" alt="Featured on IndexOf.AI" width="200" height="40" fallback="Featured on IndexOf.AI" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://curlship.com/l/3703" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://curlship.com/badge.svg" alt="Featured on CurlShip" height="54" fallback="Featured on Curlship" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://seektool.ai/" target="_blank" title="SeekTool.ai Tools Directory">
        <span className="tb-v2-directory-text">SeekTool.ai Tools Directory</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://lemonlaunch.dev/dev-tools/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://lemonlaunch.dev/badge/lemonlaunch-badge-light.svg" alt="Featured on LemonLaunch" width="188" height="56" fallback="LemonLaunch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://doforai.tools" target="_blank">
        <DirectoryBadgeImage src="https://doforai.tools/badge/feature-badge-white.webp" alt="Featured on doforai.tools" width="172" height="54" fallback="doforai.tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://theaitoolsdir.com/" rel="dofollow">
        <DirectoryBadgeImage src="https://theaitoolsdir.com/badge/toolblip.svg" alt="Featured on TheAIToolsDir" width="182" height="46" fallback="TheAIToolsDir" />
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
      <DirectoryBadgeLink duplicate={duplicate} href="https://aiblog.tools" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Find us on AIBlog.Tools</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://ailaunch.space/" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://ailaunch.space/assets/badges/featured.svg" alt="Featured on AILaunchSpace" width="225" height="61" style={{ display: 'block' }} fallback="AILaunchSpace" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aitoolfame.com/item/harun-r-rayhan" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://aitoolfame.com/badge-light.svg" alt="Featured on aitoolfame.com" style={{ height: 54, width: 'auto' }} fallback="aitoolfame.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.aitoolfinder.com/" target="_blank">
        <DirectoryBadgeImage src="https://www.aitoolfinder.com//function/badge-generator.php?type=0&theme=light&domain=www.aitoolfinder.com" alt="#1 Product on www.aitoolfinder.com" height="84" fallback="Featured on AI Tool Finder" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aitoolsmarketer.com/" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://aitoolsmarketer.com/badges/badge-dark.svg" alt="Listed on AI Tools for Marketers" width="153" height="44" fallback="AI Tools for Marketers" />
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
      <DirectoryBadgeLink duplicate={duplicate} data-newname-badge="toolblip" href="https://newname.ai/badge?ref=toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://newname.ai/badge/listed.svg" alt="Listed on NewName.ai" width="200" height="54" fallback="Featured on NewName" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://saasbison.com" target="_blank" rel="dofollow">
        <DirectoryBadgeImage src="https://saasbison.com/badge.png" alt="Featured on SaaSBison" width="200" height="54" fallback="SaaSBison" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://saasdb.net" rel="dofollow">
        <DirectoryBadgeImage src="https://saasdb.net/badge/featured-light.svg" alt="Featured on SaasDB" width="300" fallback="SaasDB" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://smolsaas.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on SmolSaaS</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://vantaige.io/?utm_source=badge&utm_medium=embed" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://img.shields.io/badge/Featured%20on-Vantaige-2563eb?style=for-the-badge" alt="Featured on Vantaige.io" width="360" height="120" fallback="Featured on Vantaige.io" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://yourhack.ai/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on yourhack.ai</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://listmaro.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on Listmaro</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://saaslineup.com/" rel="dofollow">
        <DirectoryBadgeImage src="https://saaslineup.com/badge/toolblip.svg" alt="Featured on SaaSLineup" width="182" height="46" fallback="SaaSLineup" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://domainrating.lol/tool/toolblip-com">
        <DirectoryBadgeImage src="https://domainrating.lol/badge.svg" alt="Listed on domainrating.lol" width="160" height="40" fallback="domainrating.lol" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://indiestore.co/product/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://indiestore.co/api/badge/toolblip?theme=light" alt="Featured on IndieStore" width="220" height="54" fallback="IndieStore" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.webprojectlist.com/toolblip/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://www.webprojectlist.com/static/backlink/webprojectlist_name_logo.6a3366e98900.webp" alt="WebProjectList Badge" width="200" height="40" fallback="WebProjectList" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://bunny.directory/product/toolblip">
        <DirectoryBadgeImage src="https://bunny.directory/product/toolblip/badge.svg?theme=light" alt="Toolblip badge" width="200" height="50" fallback="bunny.directory" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://braginpublic.com/?utm_source=badge&utm_medium=referral" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://braginpublic.com/badge?theme=light" alt="Featured on Brag in Public" width="208" height="54" fallback="Brag in Public" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://smartees.tech/t/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://smartees.tech/badge/smartees-listed-dark.svg" alt="Featured on Smartees" width="184" height="44" fallback="Smartees" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.norohunt.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://www.norohunt.com/images/norohunt-light.svg" alt="Featured on NoroHunt" width="185" height="48" fallback="NoroHunt" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchfinds.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on LaunchFinds</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://startupfinds.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on StartupFinds</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://startupscrolls.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on StartupScrolls</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://apptooling.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on AppTooling</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://themicrosaasdir.com/product/toolblip?ref=badge" rel="dofollow">
        <DirectoryBadgeImage src="https://themicrosaasdir.com/badge/toolblip.svg" alt="Featured on TheMicroSaaSDir" width="160" height="44" fallback="TheMicroSaaSDir" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://saasearch.io/product/toolblip?utm_source=badge&utm_medium=referral&utm_campaign=featured_badge&ref=saasearch" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://saasearch.io/api/badge/toolblip?theme=light" alt="Featured on SaaSearch" style={{ height: 48, width: 'auto' }} fallback="SaaSearch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchstag.com/p/tool-1792035055558" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://launchstag.com/badge-light.svg" alt="Featured on Launchstag" width="198" height="62" fallback="Launchstag" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://bricklaun.ch/dev-tools/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://bricklaun.ch/badge/brick-launch-badge-a-light.svg" alt="Featured on Brick Launch" width="140" height="54" fallback="Brick Launch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://softwareontheweb.com" rel="dofollow">
        <DirectoryBadgeImage src="https://softwareontheweb.com/images/badge.svg?v=1778596517" alt="Featured on Software on the Web" width="200" fallback="Software on the Web" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.ontoplist.com/web-development-companies/" target="_blank">
        <DirectoryBadgeImage src="https://www.ontoplist.com/images/ontoplist31.png?id=6ad0490fb5435" alt="Top Web Development Companies in the US - OnToplist.com" fallback="OnToplist" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://goodsaas.xyz/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://goodsaas.xyz/badge/toolblip.svg?theme=dark" alt="Toolblip on goodSaaS" fallback="goodSaaS" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://toolroots.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://toolroots.com/badge.svg" alt="Featured on ToolRoots" width="181" height="32" fallback="ToolRoots" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://indieascent.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://indieascent.com/badge/standard-light.svg" alt="Featured on IndieAscent" width="200" height="54" fallback="IndieAscent" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchboard.dev" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://launchboard.dev/featured.svg" alt="Featured on LaunchBoard" width="240" height="60" fallback="LaunchBoard" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://amaze.directory/" target="_blank" rel="noopener" title="Toolblip on amaze.directory">
        <DirectoryBadgeImage src="https://amaze.directory/badge/dark.svg" alt="Toolblip is listed on amaze.directory" width="181" height="46" fallback="Featured on Amaze Directory" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.findgreatsites.com" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on FindGreatSites</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.listyourproject.com" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on ListYourProject</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://golanz.com/projects/toolblip?utm_source=badge" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://golanz.com/golanz/images/badges/featured-on-light.svg" alt="Featured on golanz.com" style={{ height: 44, width: 'auto' }} fallback="golanz.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://devlanz.com/projects/toolblip?utm_source=badge" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://devlanz.com/devlanz/images/badges/featured-on-light.svg" alt="Featured on devlanz.com" style={{ height: 44, width: 'auto' }} fallback="devlanz.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://shiplaun.ch/projects/toolblip?utm_source=badge" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://shiplaun.ch/shiplaunch/images/badges/featured-on-light.svg" alt="Featured on shiplaun.ch" style={{ height: 44, width: 'auto' }} fallback="shiplaun.ch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://smolfind.com/projects/toolblip?utm_source=badge" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://smolfind.com/smolfind/images/badges/featured-on-light.svg" alt="Featured on smolfind.com" style={{ height: 44, width: 'auto' }} fallback="smolfind.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://smoltop.com/projects/toolblip?utm_source=badge" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://smoltop.com/smoltop/images/badges/featured-on-light.svg" alt="Featured on smoltop.com" style={{ height: 44, width: 'auto' }} fallback="smoltop.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://smolmaker.com/projects/toolblip?utm_source=badge" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://smolmaker.com/smolmaker/images/badges/featured-on-light.svg" alt="Featured on smolmaker.com" style={{ height: 44, width: 'auto' }} fallback="smolmaker.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://verifiedlaunches.com/projects/toolblip?utm_source=badge" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://verifiedlaunches.com/verifiedlaunches/images/badges/featured-on-light.svg" alt="Featured on verifiedlaunches.com" style={{ height: 44, width: 'auto' }} fallback="verifiedlaunches.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://trustedlaunches.com/projects/toolblip?utm_source=badge" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://trustedlaunches.com/trustedlaunches/images/badges/featured-on-light.svg" alt="Featured on trustedlaunches.com" style={{ height: 44, width: 'auto' }} fallback="trustedlaunches.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchfeeds.com/projects/toolblip?utm_source=badge" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://launchfeeds.com/launchfeeds/images/badges/featured-on-light.svg" alt="Featured on launchfeeds.com" style={{ height: 44, width: 'auto' }} fallback="launchfeeds.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://findscove.com/projects/toolblip?utm_source=badge" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://findscove.com/findscove/images/badges/featured-on-light.svg" alt="Featured on findscove.com" style={{ height: 44, width: 'auto' }} fallback="findscove.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://thistools.app" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on ThisTools</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://zerorevenue.club" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://zerorevenue.club/badges/zero-revenue-club.svg" alt="Listed on Zero Revenue Club" width="233" height="54" fallback="Zero Revenue Club" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://megalaun.ch/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://megalaun.ch/badges/featured/asset" alt="Featured on MegaLaunch" width="220" height="64" fallback="MegaLaunch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aitoolslist.tools" target="_blank" rel="dofollow">
        <DirectoryBadgeImage src="https://aitoolslist.tools/badges/aitoolslist-listed-light.svg" alt="Listed on AiToolsList.Tools" width="220" height="58" fallback="AiToolsList.Tools" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://thedevtoolslist.com/product/toolblip?ref=badge" rel="dofollow">
        <DirectoryBadgeImage src="https://thedevtoolslist.com/badge/toolblip.svg" alt="Featured on TheDevToolsList" width="160" height="44" fallback="TheDevToolsList" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://softwarecomoservicio.com">
        <DirectoryBadgeImage src="https://softwarecomoservicio.com/badge/badge-dark.svg" alt="Featured on Software Como Servicio" width="178" height="40" fallback="Software Como Servicio" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://best.serp.co/products/toolblip.com/" target="_blank" rel="noopener noreferrer" title="Featured on SERP Best">
        <DirectoryBadgeImage src="https://best.serp.co/badge/featured-on-serp.co-light.svg" alt="Featured on SERP Best" width="200" height="50" fallback="SERP Products" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://directory.getseoo.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://directory.getseoo.com/badges/getseoo-badge-dark.svg" alt="Featured on GetSEOO Directory" width="240" height="54" fallback="directory.getseoo.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://fwfw.app/" target="_blank">
        <DirectoryBadgeImage src="https://fwfw.app/badge-white.svg" alt="Featured on FWFW" width="250" height="54" fallback="FWFW" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://getlaunchpod.com/product/toolblip-ead5e1">
        <DirectoryBadgeImage src="https://getlaunchpod.com/badge/toolblip-ead5e1" alt="Toolblip on GetLaunchPod" fallback="GetLaunchPod" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://inuidea.com/hunt" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://inuidea.com/wp-content/uploads/Featured-on-Inuidea-Hunt-Badge.svg" alt="Featured on Inuidea Hunt" width="150" fallback="Inuidea Hunt" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://scrappystartups.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://scrappystartups.com/badge.svg?theme=blue" alt="Find us on Scrappy Startups" height="56" fallback="scrappystartups.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://swipetolaunch.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://swipetolaunch.com/api/badge/toolblip" alt="Featured on SwipeToLaunch" width="220" height="48" fallback="SwipeToLaunch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.toolpilot.ai/" target="_blank" rel="noopener noreferrer" title="ToolPilot.ai">
        <DirectoryBadgeImage src="https://www.toolpilot.ai/cdn/shop/files/f-w_690x151_crop_center.png" alt="Featured on ToolPilot.ai" width="220" height="48" fallback="ToolPilot" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://toolquix.com">
        <DirectoryBadgeImage src="https://toolquix.com/assets/badge-featured.svg" alt="Featured on Toolquix" width="240" height="54" fallback="toolquix.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://wtai.cc/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on WTAI Navigation</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aicavo.com/tools/toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://img.shields.io/badge/Featured%20on-aicavo.com-2563eb?style=for-the-badge" alt="AICavo badge" width="200" height="54" fallback="aicavo.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://backlinkdirs.com/item/toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://backlinkdirs.com/badges/badge-listed-dark.svg" alt="Listed on Backlink Dirs" fallback="backlinkdirs.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://bestaitool.app/" title="BestAITool AI Tools Directory">
        <span className="tb-v2-directory-text">BestAITool AI Tools Directory</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://boringcashcow.com" target="_blank">
        <DirectoryBadgeImage src="https://boringcashcow.com/img/badge/boringcashcow-badge-light.svg" alt="Toolblip - Featured on BoringCashCow" width="200" height="54" fallback="boringcashcow.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://firmsrated.com" target="_blank" rel="dofollow">
        <DirectoryBadgeImage src="https://firmsrated.com/badge.png" alt="Rated on FirmsRated" fallback="firmsrated.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://mydirs.com">
        <span className="tb-v2-directory-text">MyDirs</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://peerbear.io/p/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://peerbear.io/badge-light.svg" alt="Sniffed by PeerBear" width="198" height="62" fallback="PeerBear" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://startupproject.org/" target="_blank" rel="noopener noreferrer">
        <span className="tb-v2-directory-text">Startup Project</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://tooltrim.com/?utm_source=toolblip&amp;utm_medium=badge&amp;utm_campaign=tool_submission" target="_blank">
        <DirectoryBadgeImage src="https://tooltrim.com/tooltrim-badge.svg" alt="Discover ToolTrim via Toolblip" height="54" fallback="tooltrim.com" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://vibetoyou.com/s/toolblip/" target="_blank">
        <DirectoryBadgeImage src="https://vibetoyou.com/images/badge-light.svg" alt="Listed on VibeToYou" width="186" height="56" fallback="VibeToYou" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://indiepocket.com" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on IndiePocket</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchgp.io" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on LaunchGP</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchrove.com" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on LaunchRove</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchwall.online" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on launchwall.online</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://makerpocket.com" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on makerpocket.com</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://superlaunchai.com" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on SuperLaunchAI</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://tooldirectory.dev" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on tooldirectory.dev</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://toolsnap.ai" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on ToolSnap</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://saatlas.com/en/saas/toolblip/" title="Listed on Saatlas">
        <DirectoryBadgeImage src="https://saatlas.com/badge/toolblip.svg?lang=en" alt="Listed on Saatlas" width="260" height="42" fallback="Listed on Saatlas" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://www.aitoolsaver.com" target="_blank">
        <DirectoryBadgeImage src="https://www.aitoolsaver.com/images/badges/featured-on-aitoolsaver-badge-brand-wide.svg" alt="Featured on AiToolSaver" width="320" height="80" fallback="AiToolSaver" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchbuck.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on LaunchBuck</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://meshkore.com" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://meshkore.com/badge.svg" alt="Listed on MeshKore" width="190" height="32" fallback="MeshKore" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://nextbigproduct.com/product/toolblip" target="_blank" rel="noopener noreferrer">
        <DirectoryBadgeImage src="https://nextbigproduct.com/assets/badge/toolblip.svg?theme=light" alt="Featured on NextBigProduct" width="250" height="54" fallback="NextBigProduct" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://primadirectory.it/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://img.shields.io/badge/Featured%20on-Prima%20Directory-2563eb?style=for-the-badge" alt="Featured on Prima Directory" height="28" fallback="Prima Directory" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://rankcert.com/product/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://rankcert.com/badge/toolblip?style=card&theme=light" alt="Toolblip on RankCert" width="240" height="64" fallback="RankCert" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://showmebest.ai" target="_blank">
        <DirectoryBadgeImage src="https://showmebest.ai/badge/feature-badge-white.webp" alt="Featured on ShowMeBestAI" width="220" height="60" fallback="ShowMeBestAI" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://startuplist.ing/p/h7uo7f" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://img.shields.io/badge/Featured%20on-Startup%20Listing-2563eb?style=for-the-badge" alt="Featured on Startup Listing" height="28" fallback="Startup Listing" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://submitstartup.io/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on SubmitStartup</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://tooltrove.net/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://img.shields.io/badge/Featured%20on-ToolTrove-2563eb?style=for-the-badge" alt="Featured on ToolTrove" height="28" fallback="ToolTrove" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://unique-listing.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://img.shields.io/badge/Featured%20on-Unique%20Listing-2563eb?style=for-the-badge" alt="Featured on Unique Listing" height="28" fallback="Unique Listing" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://financesonline.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://financesonline.com/media/themes/fot/dist/img/svg/logo.svg" alt="Featured on FinancesOnline" height="54" fallback="Featured on FinancesOnline" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://infrabase.ai/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://infrabase.ai/badge/listed.svg" alt="Featured on Infrabase" height="54" fallback="Featured on Infrabase" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://buildvoyage.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://buildvoyage.com/images/featured_badge.png" alt="Featured on BuildVoyage" height="54" fallback="Featured on BuildVoyage" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aisotools.com/tool/toolblip" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on AISO Tools</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://findthatsoftware.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on FindThatSoftware</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aitoolindex.io/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on AI Tool Index</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://aiwizard.ai/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://www.aiwizard.ai/badges/featured-on-aiwizard-dark.svg" alt="Featured on AIWizard" height="54" fallback="Featured on AIWizard" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://strategic-flow-audit.replit.app/directory/toolblip-9835" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on ToolIndex</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://ideakiln.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://ideakiln.com/light.svg" alt="Featured on IdeaKiln" height="54" fallback="Featured on IdeaKiln" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://fridayhunt.com/projects/toolblip" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on FridayHunt</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://viberank.dev/apps/Toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://viberank.dev/badge?app=Toolblip&theme=dark" alt="Featured on VibeRank" height="54" fallback="Featured on VibeRank" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://startupeurope.net/startup?id=21325" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on Startup Europe</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://inventlist.com/sites/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://inventlist.com/sites/toolblip/badge/listed" alt="Featured on InventList" height="54" fallback="Featured on InventList" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://vibecodinglist.com/projects/toolblip" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on VibeCodingList</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://toollisted.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://www.toollisted.com/badges/toollisted-badge-light.png" alt="Featured on ToolListed" height="54" fallback="Featured on ToolListed" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://zplatform.ai/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://zplatform.ai/badges/zplatform-featured.png" alt="Featured on ZPlatform" height="54" fallback="Featured on ZPlatform" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://shipstry.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://shipstry.com/badges/featured.svg" alt="Featured on Shipstry" height="54" fallback="Featured on Shipstry" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://hicyou.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://hicyou.com/badge/featured-light.svg" alt="Featured on HiCyou" height="54" fallback="Featured on HiCyou" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://toolverified.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on ToolVerified</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://alphashot.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://alphashot.com/badge/toolblip.svg" alt="Featured on AlphaShot" height="54" fallback="Featured on AlphaShot" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://spacerrapps.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://spacerrapps.com/badge/toolblip.svg?v=3&theme=dark" alt="Featured on SpacerrApps" height="54" fallback="Featured on SpacerrApps" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://appstackbuilder.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://appstackbuilder.com/badge-light.svg" alt="Featured on App Stack Builder" height="54" fallback="Featured on App Stack Builder" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://worthtotry.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://worthtotry.com/badges/featured.png" alt="Featured on WorthToTry" height="54" fallback="Featured on WorthToTry" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://kdjingpai.com/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on Kdjingpai</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://peerpush.com/p/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://peerpush.com/p/toolblip/badge.png" alt="Featured on PeerPush" height="54" fallback="Featured on PeerPush" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://submitforbacklinks.com/product/toolblip" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on SubmitForBacklinks</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://nowfound.app/launch/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://nowfound.app/badge/toolblip.svg" alt="Featured on NowFound" height="54" fallback="Featured on NowFound" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://nologin.tools/tool/toolblip-com" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on NoLogin Tools</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://hiproducty.com" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on HiProducty</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://launchranked.com/products/toolblip" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://launchranked.com/badge/toolblip?theme=light" alt="Featured on LaunchRanked" height="54" fallback="Featured on LaunchRanked" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://truetier.app/" target="_blank" rel="noopener">
        <span className="tb-v2-directory-text">Featured on TrueTier</span>
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://doitlaunch.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://www.doitlaunch.com/badge.png" alt="Featured on DoItLaunch" height="54" fallback="Featured on DoItLaunch" />
      </DirectoryBadgeLink>
      <DirectoryBadgeLink duplicate={duplicate} href="https://huntstartup.com/" target="_blank" rel="noopener">
        <DirectoryBadgeImage src="https://huntstartup.com/badge-dark.svg" alt="Featured on Hunt Startup" height="54" fallback="Featured on Hunt Startup" />
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
              <li><Link href="/contact">Contact</Link></li>
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
