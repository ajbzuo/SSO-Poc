import assert from 'node:assert/strict';
import test from 'node:test';
import { completeSamlLogin } from '../src/lib/auth/bridge.js';
import type { ZephrClient } from '../src/lib/zephr/client.js';

function createStubClient(overrides?: Partial<ZephrClient>): ZephrClient {
  return {
    async findUserByExternalId() {
      return null;
    },
    async findUserByEmail() {
      return null;
    },
    async listActiveGrants() {
      return [];
    },
    async destroyAuthenticatedSession() {
      return;
    },
    ...overrides
  };
}

const profile = {
  nameID: 'subject-123',
  email: 'user@example.com',
  givenName: 'User',
  surname: 'Example'
};

test('completeSamlLogin grants access when Zephr user exists with a matching grant', async () => {
  const result = await completeSamlLogin({
    profile,
    zephrClient: createStubClient({
      async findUserByExternalId() {
        return {
          id: 'user-1',
          email: 'user@example.com',
          externalId: 'subject-123',
          firstName: 'User',
          lastName: 'Example',
          customFields: {}
        };
      },
      async listActiveGrants() {
        return [{ id: 'grant-1', userId: 'user-1', productId: 'product-1' }];
      }
    }),
    requiredGrantIds: [],
    requiredProductIds: []
  });

  assert.equal(result.status, 'granted');
  if (result.status === 'granted') {
    assert.equal(result.authState.isAuthenticated, true);
    assert.equal(result.authState.matchedBy, 'external-id');
    assert.equal(result.authState.zephrGrantAccess.hasAccess, true);
  }
});

test('completeSamlLogin returns missing-user when Zephr user does not exist', async () => {
  const result = await completeSamlLogin({
    profile,
    zephrClient: createStubClient(),
    requiredGrantIds: [],
    requiredProductIds: []
  });

  assert.equal(result.status, 'missing-user');
});

test('completeSamlLogin returns missing-grant when Zephr user exists without access', async () => {
  const result = await completeSamlLogin({
    profile,
    zephrClient: createStubClient({
      async findUserByEmail() {
        return {
          id: 'user-2',
          email: 'user@example.com',
          externalId: undefined,
          firstName: 'User',
          lastName: 'Example',
          customFields: {}
        };
      }
    }),
    requiredGrantIds: ['grant-locked'],
    requiredProductIds: []
  });

  assert.equal(result.status, 'missing-grant');
  if (result.status === 'missing-grant') {
    assert.equal(result.grants.hasAccess, false);
  }
});
