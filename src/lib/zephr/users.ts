import type { MappedSamlIdentity } from '../saml/types.js';
import type { ZephrClient } from './client.js';
import type { ZephrGrant, ZephrGrantEvaluation, ZephrUser } from './types.js';

export interface ZephrAuthorizationSuccess {
  status: 'granted';
  user: ZephrUser;
  grants: ZephrGrantEvaluation;
  matchedBy: 'external-id' | 'email';
}

export interface ZephrAuthorizationFailure {
  status: 'missing-user' | 'missing-grant';
  user: ZephrUser | null;
  grants: ZephrGrantEvaluation;
  matchedBy: 'external-id' | 'email' | 'none';
}

export type ZephrAuthorizationResult = ZephrAuthorizationSuccess | ZephrAuthorizationFailure;

export async function authorizeZephrUser(
  client: ZephrClient,
  identity: MappedSamlIdentity,
  requirements: { requiredGrantIds: string[]; requiredProductIds: string[] }
): Promise<ZephrAuthorizationResult> {
  const userByExternalId = await client.findUserByExternalId(identity.externalId);
  if (userByExternalId) {
    const grants = evaluateGrants(await client.listActiveGrants(userByExternalId.id), requirements);
    return grants.hasAccess
      ? { status: 'granted', user: userByExternalId, grants, matchedBy: 'external-id' }
      : { status: 'missing-grant', user: userByExternalId, grants, matchedBy: 'external-id' };
  }

  const userByEmail = await client.findUserByEmail(identity.email);
  if (userByEmail) {
    const grants = evaluateGrants(await client.listActiveGrants(userByEmail.id), requirements);
    return grants.hasAccess
      ? { status: 'granted', user: userByEmail, grants, matchedBy: 'email' }
      : { status: 'missing-grant', user: userByEmail, grants, matchedBy: 'email' };
  }

  return {
    status: 'missing-user',
    user: null,
    grants: evaluateGrants([], requirements),
    matchedBy: 'none'
  };
}

export function evaluateGrants(
  grants: ZephrGrant[],
  requirements: { requiredGrantIds: string[]; requiredProductIds: string[] }
): ZephrGrantEvaluation {
  if (requirements.requiredGrantIds.length === 0 && requirements.requiredProductIds.length === 0) {
    return {
      hasAccess: grants.length > 0,
      activeGrants: grants,
      matchedGrant: grants[0] ?? null,
      evaluation: {
        requiredGrantIds: requirements.requiredGrantIds,
        requiredProductIds: requirements.requiredProductIds,
        matchedBy: grants.length > 0 ? 'any-active-grant' : 'none'
      }
    };
  }

  const matchedByGrantId = grants.find((grant) => requirements.requiredGrantIds.includes(grant.id));
  if (matchedByGrantId) {
    return {
      hasAccess: true,
      activeGrants: grants,
      matchedGrant: matchedByGrantId,
      evaluation: {
        requiredGrantIds: requirements.requiredGrantIds,
        requiredProductIds: requirements.requiredProductIds,
        matchedBy: 'grant-id'
      }
    };
  }

  const matchedByProductId = grants.find((grant) => grant.productId && requirements.requiredProductIds.includes(grant.productId));
  if (matchedByProductId) {
    return {
      hasAccess: true,
      activeGrants: grants,
      matchedGrant: matchedByProductId,
      evaluation: {
        requiredGrantIds: requirements.requiredGrantIds,
        requiredProductIds: requirements.requiredProductIds,
        matchedBy: 'product-id'
      }
    };
  }

  return {
    hasAccess: false,
    activeGrants: grants,
    matchedGrant: null,
    evaluation: {
      requiredGrantIds: requirements.requiredGrantIds,
      requiredProductIds: requirements.requiredProductIds,
      matchedBy: 'none'
    }
  };
}
