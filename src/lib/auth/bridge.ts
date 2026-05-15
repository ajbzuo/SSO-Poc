import type { MappedSamlIdentity, RawSamlProfile } from '../saml/types.js';
import { mapSamlProfile } from '../mappers/userMapper.js';
import { authorizeZephrUser } from '../zephr/users.js';
import type { ZephrClient } from '../zephr/client.js';
import type { ZephrGrantEvaluation, ZephrUser } from '../zephr/types.js';

export interface SessionState {
  isAuthenticated: boolean;
  rawSamlProfile: Record<string, string | string[]>;
  samlIdentity: MappedSamlIdentity;
  zephrUser: ZephrUser;
  zephrGrantAccess: ZephrGrantEvaluation;
  matchedBy: 'external-id' | 'email';
  sessionSync: {
    succeeded: false;
    message: string;
  };
  loggedInAt: string;
}

export type LoginCompletionResult =
  | {
      status: 'granted';
      authState: SessionState;
      mappedIdentity: MappedSamlIdentity;
      zephrUser: ZephrUser;
      grants: ZephrGrantEvaluation;
    }
  | {
      status: 'missing-user' | 'missing-grant';
      mappedIdentity: MappedSamlIdentity;
      zephrUser: ZephrUser | null;
      grants: ZephrGrantEvaluation;
    };

export async function completeSamlLogin(params: {
  profile: RawSamlProfile;
  zephrClient: ZephrClient;
  requiredGrantIds: string[];
  requiredProductIds: string[];
}): Promise<LoginCompletionResult> {
  const mappedIdentity = mapSamlProfile(params.profile);
  const authorization = await authorizeZephrUser(params.zephrClient, mappedIdentity, {
    requiredGrantIds: params.requiredGrantIds,
    requiredProductIds: params.requiredProductIds
  });

  if (authorization.status !== 'granted') {
    return {
      status: authorization.status,
      mappedIdentity,
      zephrUser: authorization.user,
      grants: authorization.grants
    };
  }

  return {
    status: 'granted',
    mappedIdentity,
    zephrUser: authorization.user,
    grants: authorization.grants,
    authState: {
      isAuthenticated: true,
      rawSamlProfile: mappedIdentity.rawAttributes,
      samlIdentity: mappedIdentity,
      zephrUser: authorization.user,
      zephrGrantAccess: authorization.grants,
      matchedBy: authorization.matchedBy,
      sessionSync: {
        succeeded: false,
        message:
          'The app has verified the SAML identity and Zephr grant server-side. If your tenant requires a separate browser-session mirror into Zephr, wire that final cookie/session exchange in src/lib/zephr/client.ts.'
      },
      loggedInAt: new Date().toISOString()
    }
  };
}

export function clearAuthState(): undefined {
  return undefined;
}
