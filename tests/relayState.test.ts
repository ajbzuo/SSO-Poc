import test from 'node:test';
import assert from 'node:assert/strict';
import { consumeRelayStateToken, createRelayStateToken, normalizeReturnTo } from '../src/lib/auth/relayState.js';

test('normalizeReturnTo rejects external redirects', () => {
  assert.equal(normalizeReturnTo('https://evil.example.com', '/fallback'), '/fallback');
  assert.equal(normalizeReturnTo('//evil.example.com', '/fallback'), '/fallback');
  assert.equal(normalizeReturnTo('/protected', '/fallback'), '/protected');
});

test('relay state token round-trips only safe relative paths', () => {
  const { token, nextSession } = createRelayStateToken(undefined, '/protected?via=saml');
  const result = consumeRelayStateToken(nextSession, token, '/');

  assert.equal(result.returnTo, '/protected?via=saml');
});
