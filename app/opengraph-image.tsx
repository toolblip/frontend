import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const alt = 'Toolblip - Free Online Developer Tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), 'public/logos/logo-transparent.png'));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1f',
          gap: '20px',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${logoData.toString('base64')}`}
          alt="Toolblip"
          width={160}
          height={160}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              fontSize: '52px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            TOOLBLIP
          </div>
          <div
            style={{
              fontSize: '20px',
              color: '#8b8b8f',
              letterSpacing: '0.04em',
            }}
          >
            Free Online Developer Tools
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
