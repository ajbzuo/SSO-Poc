import test from 'node:test';
import assert from 'node:assert/strict';
import { mapSamlProfile, toZephrUpsertInput } from '../src/lib/mappers/userMapper.js';

test('mapSamlProfile prefers NameID over email for externalId and maps whitelisted attributes', () => {
  const profile = {
    nameID: 'persistent-subject-123',
    email: 'alex@example.com',
    givenName: 'Alex',
    surname: 'Demo',
    company: 'Example Media',
    groups: ['editors', 'subscribers'],
    account_id: 'acct-44'
  };

  const mapped = mapSamlProfile(profile);
  const upsert = toZephrUpsertInput(mapped);

  assert.equal(mapped.externalId, 'persistent-subject-123');
  assert.equal(mapped.email, 'alex@example.com');
  assert.equal(mapped.firstName, 'Alex');
  assert.equal(mapped.lastName, 'Demo');
  assert.deepEqual(mapped.groups, ['editors', 'subscribers']);
  assert.equal(upsert.customFields.b2bAccountId, 'acct-44');
});

test('mapSamlProfile accepts URI-based claims', () => {
  const mapped = mapSamlProfile({
    nameID: 'subject-xyz',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': 'uri@example.com',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname': 'Uri',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname': 'Claims'
  });

  assert.equal(mapped.email, 'uri@example.com');
  assert.equal(mapped.firstName, 'Uri');
  assert.equal(mapped.lastName, 'Claims');
});
