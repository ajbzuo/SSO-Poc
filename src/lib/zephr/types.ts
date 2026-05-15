export interface ZephrCustomFields {
  company?: string;
  role?: string;
  groups?: string[];
  b2bAccountId?: string;
}

export interface ZephrUser {
  id: string;
  externalId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  customFields: ZephrCustomFields;
  createdAt?: string;
  updatedAt?: string;
}

export interface ZephrUserUpsertInput {
  externalId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  customFields: ZephrCustomFields;
}

export interface ZephrGrant {
  id: string;
  userId: string;
  entitlementType?: string;
  entitlementId?: string;
  productId?: string;
  expiryState?: string;
  startTime?: string;
  endTime?: string;
  createdAt?: string;
}

export interface ZephrGrantEvaluation {
  hasAccess: boolean;
  activeGrants: ZephrGrant[];
  matchedGrant: ZephrGrant | null;
  evaluation: {
    requiredGrantIds: string[];
    requiredProductIds: string[];
    matchedBy: 'any-active-grant' | 'grant-id' | 'product-id' | 'none';
  };
}
