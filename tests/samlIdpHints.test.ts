import assert from 'node:assert/strict';
import { test } from 'node:test';
import { extractForwardedIdpLoginParams } from '../src/lib/auth/samlIdpHints.js';

test('extractForwardedIdpLoginParams forwards allowlisted keys', () => {
  assert.deepEqual(
    extractForwardedIdpLoginParams({
      login_hint: '  user@company.com ',
      domain_hint: 'consumers',
      hd: 'company.com',
      ignored: 'nope'
    }),
    {
      login_hint: 'user@company.com',
      domain_hint: 'consumers',
      hd: 'company.com'
    }
  );
});

test('extractForwardedIdpLoginParams takes first array entry', () => {
  assert.deepEqual(
    extractForwardedIdpLoginParams({
      login_hint: ['first@example.com', 'second@example.com']
    }),
    { login_hint: 'first@example.com' }
  );
});

test('extractForwardedIdpLoginParams trims empty values', () => {
  assert.deepEqual(
    extractForwardedIdpLoginParams({
      login_hint: '   ',
      domain_hint: undefined
    }),
    {}
  );
});

test('extractForwardedIdpLoginParams truncates long values', () => {
  const long = 'x'.repeat(400);
  const out = extractForwardedIdpLoginParams({ login_hint: long });
  assert.equal(out.login_hint?.length, 320);
});
