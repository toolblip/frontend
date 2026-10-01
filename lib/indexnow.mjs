export const INDEXNOW_HOST = 'toolblip.com';
export const INDEXNOW_KEY = 'toolblip-indexnow-key-2024';
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

export function buildIndexNowBody(urls) {
  const urlList = [...new Set(urls)].filter((url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' && parsed.hostname === INDEXNOW_HOST;
    } catch {
      return false;
    }
  });
  if (urlList.length === 0 || urlList.length > 10000) {
    throw new Error('IndexNow accepts 1 to 10000 https://toolblip.com URLs');
  }
  return {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
    urlList,
  };
}
