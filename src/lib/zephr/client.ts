import { createHash, randomUUID } from 'node:crypto';
import type { AppConfig } from '../../config.js';
import type { ZephrGrant, ZephrUser } from './types.js';

export interface ZephrClient {
  findUserByExternalId(externalId: string): Promise<ZephrUser | null>;
  findUserByEmail(email: string): Promise<ZephrUser | null>;
  listActiveGrants(userId: string): Promise<ZephrGrant[]>;
  destroyAuthenticatedSession(sessionId: string): Promise<void>;
}

interface ZephrListUsersResponse {
  results?: Array<Record<string, unknown>>;
}

interface ZephrListGrantsResponse {
  results?: Array<Record<string, unknown>>;
}

class RealZephrClient implements ZephrClient {
  constructor(private readonly config: AppConfig['zephr']) {}

  async findUserByExternalId(externalId: string): Promise<ZephrUser | null> {
    const query = new URLSearchParams([[`foreign_key.${this.config.foreignKeyName}`, externalId]]);
    const response = await this.request<ZephrListUsersResponse>('GET', '/v3/users', query);
    return mapUser(response.results?.[0] ?? null, this.config.foreignKeyName);
  }

  async findUserByEmail(email: string): Promise<ZephrUser | null> {
    const query = new URLSearchParams([['identifiers.email_address', email]]);
    const response = await this.request<ZephrListUsersResponse>('GET', '/v3/users', query);
    return mapUser(response.results?.[0] ?? null, this.config.foreignKeyName);
  }

  async listActiveGrants(userId: string): Promise<ZephrGrant[]> {
    const query = new URLSearchParams([['active', 'true']]);
    const response = await this.request<ZephrListGrantsResponse>('GET', `/v3/users/${encodeURIComponent(userId)}/grants`, query);
    return (response.results ?? []).map(mapGrant).filter((grant): grant is ZephrGrant => Boolean(grant));
  }

  async destroyAuthenticatedSession(sessionId: string): Promise<void> {
    if (!this.config.siteId) {
      return;
    }

    await this.request('DELETE', `/v4/sessions/${encodeURIComponent(this.config.siteId)}/${encodeURIComponent(sessionId)}`);
  }

  private async request<T>(method: 'GET' | 'DELETE', path: string, query?: URLSearchParams): Promise<T> {
    const queryString = query?.toString() ?? '';
    const timestamp = Date.now().toString();
    const nonce = randomUUID();
    const body = '';
    const digest = createHash('sha256')
      .update(this.config.adminSecretKey)
      .update(body)
      .update(path)
      .update(queryString)
      .update(method)
      .update(timestamp)
      .update(nonce)
      .digest('hex');

    const authorization = `ZEPHR-HMAC-SHA256 ${this.config.adminAccessKey}:${timestamp}:${nonce}:${digest}`;
    const url = new URL(path, this.config.adminBaseUrl);
    if (queryString) {
      url.search = queryString;
    }

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: authorization,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Zephr admin request failed (${method} ${path}): ${response.status} ${response.statusText} ${text}`.trim());
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null;
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function stringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value.filter((entry): entry is string => typeof entry === 'string' && entry.length > 0);
  return items.length > 0 ? items : undefined;
}

function mapUser(raw: Record<string, unknown> | null, foreignKeyName: string): ZephrUser | null {
  if (!raw) {
    return null;
  }

  const identifiers = asRecord(raw.identifiers);
  const attributes = asRecord(raw.attributes);
  const foreignKeysRaw = raw.foreign_keys;
  let externalId: string | undefined;

  if (Array.isArray(foreignKeysRaw)) {
    for (const entry of foreignKeysRaw) {
      const keyRecord = asRecord(entry);
      if (!keyRecord) {
        continue;
      }

      const system = stringValue(keyRecord.system) ?? stringValue(keyRecord.foreign_system) ?? stringValue(keyRecord.key);
      const value = stringValue(keyRecord.value) ?? stringValue(keyRecord.foreign_id);
      if (system === foreignKeyName && value) {
        externalId = value;
        break;
      }
    }
  }

  return {
    id: stringValue(raw.user_id) ?? stringValue(raw.id) ?? '',
    externalId,
    email: stringValue(identifiers?.email_address) ?? stringValue(attributes?.email_address) ?? '',
    firstName: stringValue(attributes?.first_name),
    lastName: stringValue(attributes?.surname) ?? stringValue(attributes?.last_name),
    customFields: {
      company: stringValue(attributes?.company) ?? stringValue(attributes?.org),
      role: stringValue(attributes?.role),
      groups: stringArray(attributes?.groups),
      b2bAccountId: stringValue(attributes?.b2bAccountId) ?? stringValue(attributes?.account_id)
    },
    createdAt: stringValue(raw.created_at),
    updatedAt: stringValue(raw.updated_at)
  };
}

function mapGrant(raw: Record<string, unknown> | null): ZephrGrant | null {
  if (!raw) {
    return null;
  }

  const id = stringValue(raw.grant_id) ?? stringValue(raw.id);
  const userId = stringValue(raw.user_id);
  if (!id || !userId) {
    return null;
  }

  return {
    id,
    userId,
    entitlementType: stringValue(raw.entitlement_type),
    entitlementId: stringValue(raw.entitlement_id),
    productId: stringValue(raw.product_id),
    expiryState: stringValue(raw.expiry_state),
    startTime: stringValue(raw.startTime),
    endTime: stringValue(raw.endTime),
    createdAt: stringValue(raw.created_at)
  };
}

export function createZephrClient(config: AppConfig['zephr']): ZephrClient {
  return new RealZephrClient(config);
}
