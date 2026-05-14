import { randomUUID } from 'node:crypto';

const RELAY_STATE_TTL_MS = 10 * 60 * 1000;

function isSafeRelativePath(candidate: string): boolean {
  if (!candidate.startsWith('/')) {
    return false;
  }

  return !candidate.startsWith('//');
}

export function normalizeReturnTo(candidate: unknown, fallback = '/'): string {
  if (typeof candidate !== 'string' || candidate.trim().length === 0) {
    return fallback;
  }

  if (!isSafeRelativePath(candidate)) {
    return fallback;
  }

  return candidate;
}

export function createRelayStateToken(
  session: Record<string, { returnTo: string; createdAt: number }> | undefined,
  returnTo: string
) {
  const token = randomUUID();
  const nextSession = session ?? {};
  nextSession[token] = { returnTo: normalizeReturnTo(returnTo), createdAt: Date.now() };

  for (const [key, value] of Object.entries(nextSession)) {
    if (Date.now() - value.createdAt > RELAY_STATE_TTL_MS) {
      delete nextSession[key];
    }
  }

  return { token, nextSession };
}

export function consumeRelayStateToken(
  session: Record<string, { returnTo: string; createdAt: number }> | undefined,
  token: unknown,
  fallback = '/'
) {
  if (!session || typeof token !== 'string') {
    return { returnTo: fallback, nextSession: session ?? {} };
  }

  const payload = session[token];
  delete session[token];

  if (!payload) {
    return { returnTo: fallback, nextSession: session };
  }

  if (Date.now() - payload.createdAt > RELAY_STATE_TTL_MS) {
    return { returnTo: fallback, nextSession: session };
  }

  return { returnTo: normalizeReturnTo(payload.returnTo, fallback), nextSession: session };
}
