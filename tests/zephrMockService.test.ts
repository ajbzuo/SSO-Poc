import test from 'node:test';
import assert from 'node:assert/strict';
import { createZephrClient, resetMockZephrState } from '../src/lib/zephr/client.js';
import { upsertZephrUser } from '../src/lib/zephr/users.js';
import { createTestConfig } from './helpers.js';

test('mock Zephr service creates then updates users by external subject', async () => {
  resetMockZephrState();
  const client = createZephrClient(createTestConfig().zephr);

  const created = await upsertZephrUser(client, {
    externalId: 'sub-1',
    email: 'first@example.com',
    firstName: 'First',
    lastName: 'Pass',
    customFields: { role: 'member' }
  });

  const updated = await upsertZephrUser(client, {
    externalId: 'sub-1',
    email: 'first@example.com',
    firstName: 'Updated',
    lastName: 'Pass',
    customFields: { role: 'admin' }
  });

  assert.equal(created.operation, 'created');
  assert.equal(updated.operation, 'updated');
  assert.equal(updated.user.firstName, 'Updated');
  assert.equal(updated.user.customFields.role, 'admin');
});
