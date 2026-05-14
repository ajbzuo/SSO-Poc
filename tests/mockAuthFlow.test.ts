import test from 'node:test';
import assert from 'node:assert/strict';
import { createZephrClient, resetMockZephrState } from '../src/lib/zephr/client.js';
import { performMockLogin } from '../src/routes/auth.js';
import { createTestConfig } from './helpers.js';

test('mock auth route helper establishes auth state and preserves the requested redirect', async () => {
  resetMockZephrState();
  const config = createTestConfig();
  const zephrClient = createZephrClient(config.zephr);

  const result = await performMockLogin(config, zephrClient, '/protected');

  assert.equal(result.redirectTo, '/protected');
  assert.equal(result.zephrCookie.cookieName, 'blaize_session');
  assert.equal(result.authState.isAuthenticated, true);
  assert.equal(result.authState.samlIdentity.email, 'test.user@example.com');
});
