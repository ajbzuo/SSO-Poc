import type { ZephrClient } from './client.js';
import type { ZephrSyncOutcome, ZephrUserUpsertInput } from './types.js';

export async function upsertZephrUser(client: ZephrClient, input: ZephrUserUpsertInput): Promise<ZephrSyncOutcome> {
  const existingByExternalId = await client.findUserByExternalId(input.externalId);
  if (existingByExternalId) {
    const user = await client.updateUser(existingByExternalId.id, {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      customFields: input.customFields
    });

    return { user, operation: 'updated' };
  }

  const existingByEmail = await client.findUserByEmail(input.email);
  if (existingByEmail) {
    const user = await client.updateUser(existingByEmail.id, {
      externalId: input.externalId,
      firstName: input.firstName,
      lastName: input.lastName,
      customFields: input.customFields
    });

    return { user, operation: 'updated' };
  }

  const user = await client.createUser(input);
  return { user, operation: 'created' };
}
