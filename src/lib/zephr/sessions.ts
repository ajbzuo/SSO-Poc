import type { ZephrClient } from './client.js';
import type { ZephrSessionResult, ZephrUser } from './types.js';

export async function createZephrAuthenticatedSession(client: ZephrClient, user: ZephrUser): Promise<ZephrSessionResult> {
  return client.createAuthenticatedSession(user);
}

export async function destroyZephrAuthenticatedSession(client: ZephrClient, sessionId: string) {
  await client.destroyAuthenticatedSession(sessionId);
}
