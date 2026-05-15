import type { Request } from 'express';

const ALLOWED_KEYS = ['login_hint', 'domain_hint', 'hd'] as const;
const MAX_VALUE_LENGTH = 320;

function firstQueryString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      if (typeof entry === 'string') {
        const trimmed = entry.trim();
        if (trimmed.length > 0) {
          return trimmed;
        }
      }
    }
  }

  return undefined;
}

/**
 * Extracts a small allowlist of query parameters to forward to the IdP alongside the SAML request.
 * Microsoft Entra ID commonly honors `login_hint` on SAML SP-initiated sign-on URLs.
 * Google flows sometimes use `hd` (hosted domain) when routing Workspace users.
 */
export function extractForwardedIdpLoginParams(query: Request['query']): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key of ALLOWED_KEYS) {
    const raw = firstQueryString(query[key]);
    if (raw) {
      result[key] = raw.slice(0, MAX_VALUE_LENGTH);
    }
  }

  return result;
}
