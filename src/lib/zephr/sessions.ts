import type { ZephrClient } from './client.js';

export async function destroyZephrAuthenticatedSession(client: ZephrClient, sessionId: string) {
  await client.destroyAuthenticatedSession(sessionId);
}
