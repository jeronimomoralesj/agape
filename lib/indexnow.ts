import { SITE_URL, absoluteUrl } from './seo';

/**
 * IndexNow: instant indexing pings for Bing, DuckDuckGo, Yahoo, Seznam, Yandex.
 * (Google does not use IndexNow — it discovers via sitemap.xml instead.)
 *
 * Setup: set INDEXNOW_KEY to any random 32+ char hex string. The key is
 * served at /indexnow.txt automatically. No-op when the env var is missing.
 */
export async function pingIndexNow(paths: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (!key || !process.env.NEXT_PUBLIC_SITE_URL) return;

  try {
    // Hard 3s cap — an indexing ping must never slow down the admin
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      signal: AbortSignal.timeout(3000),
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key,
        keyLocation: `${SITE_URL}/indexnow.txt`,
        urlList: paths.map((p) => absoluteUrl(p)),
      }),
    });
  } catch (error) {
    // Indexing pings must never break a mutation
    console.error('IndexNow ping falló', error);
  }
}
