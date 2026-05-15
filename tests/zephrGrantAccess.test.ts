import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateGrants } from '../src/lib/zephr/users.js';

test('evaluateGrants allows any active grant when no filters are configured', () => {
  const result = evaluateGrants(
    [{ id: 'grant-1', userId: 'user-1', productId: 'product-1' }],
    { requiredGrantIds: [], requiredProductIds: [] }
  );

  assert.equal(result.hasAccess, true);
  assert.equal(result.evaluation.matchedBy, 'any-active-grant');
});

test('evaluateGrants matches explicit grant ids first', () => {
  const result = evaluateGrants(
    [
      { id: 'grant-1', userId: 'user-1', productId: 'product-1' },
      { id: 'grant-2', userId: 'user-1', productId: 'product-2' }
    ],
    { requiredGrantIds: ['grant-2'], requiredProductIds: [] }
  );

  assert.equal(result.hasAccess, true);
  assert.equal(result.matchedGrant?.id, 'grant-2');
  assert.equal(result.evaluation.matchedBy, 'grant-id');
});

test('evaluateGrants falls back to product id matching', () => {
  const result = evaluateGrants(
    [{ id: 'grant-1', userId: 'user-1', productId: 'product-locked' }],
    { requiredGrantIds: [], requiredProductIds: ['product-locked'] }
  );

  assert.equal(result.hasAccess, true);
  assert.equal(result.evaluation.matchedBy, 'product-id');
});

test('evaluateGrants denies access when nothing matches', () => {
  const result = evaluateGrants(
    [{ id: 'grant-1', userId: 'user-1', productId: 'product-1' }],
    { requiredGrantIds: ['grant-9'], requiredProductIds: ['product-9'] }
  );

  assert.equal(result.hasAccess, false);
  assert.equal(result.matchedGrant, null);
  assert.equal(result.evaluation.matchedBy, 'none');
});
