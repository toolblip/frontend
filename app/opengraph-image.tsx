import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const alt = 'Toolblip - Free Online Developer Tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), 'public/logos/logo-transparent.png'));
  const screenshot = await readFile(join(process.cwd(), 'public/images/hero-bg-2.jpg'));

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', backgroundColor: '#1a1a1f' }}>
        {/* Subtle gradient accents */}
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '80%', background: 'radial-gradient(ellipse 60% 50%, rgba(217,48,48,0.18), transparent 70%)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '60%', background: 'radial-gradient(ellipse 50% 40%, rgba(62,24,50,0.5), transparent 70%)', display: 'flex' }} />

        {/* Top section: logo + name + domain */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '36px 0 24px', position: 'relative', zIndex: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${logoData.toString('base64')}`}
            alt="Toolblip"
            width={56}
            height={56}
            style={{ borderRadius: '12px' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1 }}>
              TOOLBLIP
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>
              toolblip.com
            </div>
          </div>
        </div>

        {/* Bottom section: screenshot */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          padding: '0 60px',
          flex: '1',
          alignItems: 'flex-end',
          paddingBottom: '24px',
        }}>
          <div style={{
            display: 'flex',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/jpeg;base64,${screenshot.toString('base64')}`}
              alt="Toolblip homepage"
              width={880}
              height={420}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
