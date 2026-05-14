import type { MappedSamlIdentity, RawSamlProfile } from '../saml/types.js';
import { mapSamlProfile, toZephrUpsertInput } from '../mappers/userMapper.js';
import { createZephrAuthenticatedSession } from '../zephr/sessions.js';
import { upsertZephrUser } from '../zephr/users.js';
import type { ZephrClient } from '../zephr/client.js';
import type { ZephrSession, ZephrSessionResult, ZephrUser } from '../zephr/types.js';

export interface SessionState {
  isAuthenticated: boolean;
  rawSamlProfile: Record<string, string | string[]>;
  samlIdentity: MappedSamlIdentity;
  zephrUser: ZephrUser;
  zephrSession: ZephrSession;
  zephrUpsert: {
    succeeded: boolean;
    operation: 'created' | 'updated';
  };
  zephrSessionSync: {
    succeeded: boolean;
    message: string;
  };
  loggedInAt: string;
}

export interface LoginCompletionResult {
  mappedIdentity: MappedSamlIdentity;
  zephrUser: ZephrUser;
  zephrSession: ZephrSessionResult;
  authState: SessionState;
}

export async function completeSamlLogin(params: {
  profile: RawSamlProfile;
  zephrClient: ZephrClient;
}): Promise<LoginCompletionResult> {
  const mappedIdentity = mapSamlProfile(params.profile);
  const zephrUpsert = await upsertZephrUser(params.zephrClient, toZephrUpsertInput(mappedIdentity));
  const zephrSession = await createZephrAuthenticatedSession(params.zephrClient, zephrUpsert.user);

  return {
    mappedIdentity,
    zephrUser: zephrUpsert.user,
    zephrSession,
    authState: {
      isAuthenticated: true,
      rawSamlProfile: mappedIdentity.rawAttributes,
      samlIdentity: mappedIdentity,
      zephrUser: zephrUpsert.user,
      zephrSession: zephrSession.session,
      zephrUpsert: {
        succeeded: true,
        operation: zephrUpsert.operation
      },
      zephrSessionSync: {
        succeeded: zephrSession.syncedWithCookie,
        message: zephrSession.message
      },
      loggedInAt: new Date().toISOString()
    }
  };
}

export function clearAuthState(): undefined {
  return undefined;
}
