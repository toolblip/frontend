import { readFileSync } from 'fs';
import { join } from 'path';

export interface GSCCredentials {
  client_email: string;
  private_key: string;
}

let cached: GSCCredentials | null = null;

export async function getGSCCredentials(): Promise<GSCCredentials | null> {
  if (cached) return cached;

  try {
    // Try environment variable first
    const raw = process.env.GSC_SERVICE_ACCOUNT;
    if (raw) {
      const decoded = Buffer.from(raw, 'base64').toString('utf-8');
      cached = JSON.parse(decoded);
      return cached;
    }

    // Try .env file
    const envPath = join(process.cwd(), '.env');
    const envContent = readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GSC_SERVICE_ACCOUNT=(.+)/);
    if (match) {
      const decoded = Buffer.from(match[1].trim(), 'base64').toString('utf-8');
      cached = JSON.parse(decoded);
      return cached;
    }

    return null;
  } catch {
    return null;
  }
}
