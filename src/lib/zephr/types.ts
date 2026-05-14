export type ZephrMode = 'mock' | 'real';

export interface ZephrCustomFields {
  company?: string;
  role?: string;
  groups?: string[];
  b2bAccountId?: string;
}

export interface ZephrUser {
  id: string;
  externalId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  customFields: ZephrCustomFields;
  createdAt: string;
  updatedAt: string;
}

export interface ZephrUserUpsertInput {
  externalId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  customFields: ZephrCustomFields;
}

export interface ZephrSession {
  sessionId: string;
  cookieName: string;
  cookieValue: string;
  createdAt: string;
}

export interface ZephrSessionResult {
  session: ZephrSession;
  syncedWithCookie: boolean;
  message: string;
}

export interface ZephrSyncOutcome {
  user: ZephrUser;
  operation: 'created' | 'updated';
}
