import { randomUUID } from 'node:crypto';
import type { AppConfig } from '../../config.js';
import type { ZephrSessionResult, ZephrUser, ZephrUserUpsertInput } from './types.js';

export interface ZephrClient {
  readonly mode: 'mock' | 'real';
  findUserByExternalId(externalId: string): Promise<ZephrUser | null>;
  findUserByEmail(email: string): Promise<ZephrUser | null>;
  createUser(input: ZephrUserUpsertInput): Promise<ZephrUser>;
  updateUser(userId: string, input: Partial<ZephrUserUpsertInput>): Promise<ZephrUser>;
  createAuthenticatedSession(user: ZephrUser): Promise<ZephrSessionResult>;
  destroyAuthenticatedSession(sessionId: string): Promise<void>;
}

interface MockState {
  usersById: Map<string, ZephrUser>;
  sessionsById: Map<string, { userId: string; createdAt: string }>;
}

const mockState: MockState = {
  usersById: new Map(),
  sessionsById: new Map()
};

class MockZephrClient implements ZephrClient {
  readonly mode = 'mock' as const;

  async findUserByExternalId(externalId: string) {
    return [...mockState.usersById.values()].find((user) => user.externalId === externalId) ?? null;
  }

  async findUserByEmail(email: string) {
    return [...mockState.usersById.values()].find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  async createUser(input: ZephrUserUpsertInput) {
    const now = new Date().toISOString();
    const user: ZephrUser = {
      id: randomUUID(),
      externalId: input.externalId,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      customFields: input.customFields,
      createdAt: now,
      updatedAt: now
    };

    mockState.usersById.set(user.id, user);
    return user;
  }

  async updateUser(userId: string, input: Partial<ZephrUserUpsertInput>) {
    const existing = mockState.usersById.get(userId);
    if (!existing) {
      throw new Error(`Mock Zephr user not found: ${userId}`);
    }

    const updated: ZephrUser = {
      ...existing,
      email: input.email ?? existing.email,
      firstName: input.firstName ?? existing.firstName,
      lastName: input.lastName ?? existing.lastName,
      externalId: input.externalId ?? existing.externalId,
      customFields: {
        ...existing.customFields,
        ...input.customFields
      },
      updatedAt: new Date().toISOString()
    };

    mockState.usersById.set(userId, updated);
    return updated;
  }

  async createAuthenticatedSession(user: ZephrUser) {
    const sessionId = randomUUID();
    const createdAt = new Date().toISOString();

    mockState.sessionsById.set(sessionId, { userId: user.id, createdAt });

    return {
      session: {
        sessionId,
        cookieName: 'blaize_session',
        cookieValue: `mock-${sessionId}`,
        createdAt
      },
      syncedWithCookie: true,
      message: 'Mock Zephr session established and mirrored into a local blaize_session cookie.'
    };
  }

  async destroyAuthenticatedSession(sessionId: string) {
    mockState.sessionsById.delete(sessionId);
  }
}

class RealZephrClient implements ZephrClient {
  readonly mode = 'real' as const;

  constructor(private readonly config: AppConfig['zephr']) {}

  async findUserByExternalId(_externalId: string): Promise<ZephrUser | null> {
    await this.ensureConfigured();
    throw new Error('TODO: Wire Zephr Admin API lookup by external subject in src/lib/zephr/client.ts.');
  }

  async findUserByEmail(_email: string): Promise<ZephrUser | null> {
    await this.ensureConfigured();
    throw new Error('TODO: Wire Zephr Admin API lookup by email in src/lib/zephr/client.ts.');
  }

  async createUser(_input: ZephrUserUpsertInput): Promise<ZephrUser> {
    await this.ensureConfigured();
    throw new Error('TODO: Wire Zephr Admin API create user in src/lib/zephr/client.ts.');
  }

  async updateUser(_userId: string, _input: Partial<ZephrUserUpsertInput>): Promise<ZephrUser> {
    await this.ensureConfigured();
    throw new Error('TODO: Wire Zephr Admin API update user in src/lib/zephr/client.ts.');
  }

  async createAuthenticatedSession(_user: ZephrUser): Promise<ZephrSessionResult> {
    await this.ensureConfigured();
    throw new Error('TODO: Wire Zephr session creation or token exchange in src/lib/zephr/client.ts.');
  }

  async destroyAuthenticatedSession(_sessionId: string): Promise<void> {
    await this.ensureConfigured();
    throw new Error('TODO: Wire Zephr session destruction in src/lib/zephr/client.ts.');
  }

  private async ensureConfigured() {
    if (!this.config.baseUrl || !this.config.apiKey) {
      throw new Error('ZEPHR_BASE_URL and ZEPHR_API_KEY are required for real Zephr mode.');
    }
  }
}

export function createZephrClient(config: AppConfig['zephr']): ZephrClient {
  return config.mode === 'mock' ? new MockZephrClient() : new RealZephrClient(config);
}

export function resetMockZephrState() {
  mockState.usersById.clear();
  mockState.sessionsById.clear();
}
