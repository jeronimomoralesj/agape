// HMAC-signed session token for the admin dashboard.
// Uses Web Crypto so it runs both in Node API routes and Edge middleware.

const encoder = new TextEncoder();

// Edge runtime has no Buffer — use btoa-based base64url
async function hmacEdgeSafe(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  const bytes = new Uint8Array(sig);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export const ADMIN_COOKIE = 'agape_admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || 'agape-dev-secret-change-me';
}

export async function createSessionToken(): Promise<string> {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `admin.${expires}`;
  const signature = await hmacEdgeSafe(payload, getSecret());
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [role, expiresStr, signature] = parts;
  const expires = Number(expiresStr);
  if (role !== 'admin' || !Number.isFinite(expires) || expires < Date.now()) return false;
  const expected = await hmacEdgeSafe(`${role}.${expiresStr}`, getSecret());
  return signature === expected;
}
