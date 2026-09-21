import Link from 'next/link';
import BrandMark from './BrandMark';
import ApiStatus from '@/components/ApiStatus';
import { tools } from '@/data/tools';

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
        <div className="tb-v2-footer-badge">
          <a href="https://saascity.io" target="_blank" rel="noopener">
            <img src="https://saascity.io/badges/featured-dark.svg" alt="Featured on SaaSCity" width="150" height="54" />
          </a>
          <a href="https://launchigniter.com/product/toolblip?ref=badge-toolblip" target="_blank" rel="noopener noreferrer">
            <img src="https://launchigniter.com/api/badge/toolblip?theme=light" alt="Featured on LaunchIgniter" width="212" height="55" />
          </a>
          <a href="https://earlyhunt.com/project/toolblip" target="_blank" rel="noopener noreferrer">
            <img src="https://earlyhunt.com/badges/earlyhunt-badge-light.svg" alt="Featured on EarlyHunt" width="265" height="58" />
          </a>
          <a href="https://indiehunt.io/project/toolblip" target="_blank" rel="noopener noreferrer">
            <img src="https://indiehunt.io/badges/indiehunt-badge-light.svg" alt="Featured on IndieHunt" width="265" height="58" />
          </a>
          <a href="https://fazier.com/launches/toolblip.com" target="_blank" rel="noopener noreferrer">
            <img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=light" width="120" alt="Fazier badge" />
          </a>
        </div>
        <div className="tb-v2-footer-meta">
          <span>© {year} Toolblip. Built to stay out of your way.</span>
          <ApiStatus />
        </div>
      </div>
    </footer>
  );
}
