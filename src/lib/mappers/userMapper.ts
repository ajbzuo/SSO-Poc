import type { MappedSamlIdentity, RawSamlProfile } from '../saml/types.js';
import type { ZephrUserUpsertInput } from '../zephr/types.js';

const attributeMap = {
  email: [
    'email',
    'mail',
    'email_address',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
    'urn:oid:0.9.2342.19200300.100.1.3'
  ],
  givenName: [
    'givenName',
    'firstName',
    'first_name',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
    'urn:oid:2.5.4.42'
  ],
  surname: [
    'surname',
    'sn',
    'lastName',
    'last_name',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
    'urn:oid:2.5.4.4'
  ],
  company: [
    'company',
    'org',
    'organization',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/companyname',
    'urn:oid:2.5.4.10'
  ],
  role: ['role', 'roles', 'group', 'groups', 'memberOf'],
  accountId: ['account_id', 'accountId', 'b2bAccountId', 'customerId'],
  subject: ['sub', 'subject', 'immutableId', 'persistentId']
} as const;

function toArray(value: string | string[] | undefined): string[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value)
    ? value.map((entry) => entry.trim()).filter(Boolean)
    : value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
}

function pickFirst(profile: RawSamlProfile, keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const values = toArray(profile[key]);
    if (values[0]) {
      return values[0];
    }
  }

  return undefined;
}

function pickMany(profile: RawSamlProfile, keys: readonly string[]): string[] {
  const combined = new Set<string>();

  for (const key of keys) {
    for (const value of toArray(profile[key])) {
      combined.add(value);
    }
  }

  return [...combined];
}

function collectRawAttributes(profile: RawSamlProfile): Record<string, string | string[]> {
  return Object.entries(profile).reduce<Record<string, string | string[]>>((result, [key, value]) => {
    if (!value || ['issuer', 'nameID', 'nameIDFormat', 'sessionIndex'].includes(key)) {
      return result;
    }

    result[key] = value;
    return result;
  }, {});
}

export function mapSamlProfile(profile: RawSamlProfile): MappedSamlIdentity {
  const email = pickFirst(profile, attributeMap.email);
  const externalId = profile.nameID ?? pickFirst(profile, attributeMap.subject) ?? email;

  if (!externalId) {
    throw new Error('SAML response did not include a stable external subject or email address.');
  }

  if (!email) {
    throw new Error('SAML response did not include a trusted email attribute.');
  }

  return {
    externalId,
    email,
    firstName: pickFirst(profile, attributeMap.givenName),
    lastName: pickFirst(profile, attributeMap.surname),
    company: pickFirst(profile, attributeMap.company),
    role: pickFirst(profile, attributeMap.role),
    groups: pickMany(profile, ['groups', 'group', 'memberOf']),
    b2bAccountId: pickFirst(profile, attributeMap.accountId),
    issuer: typeof profile.issuer === 'string' ? profile.issuer : undefined,
    nameId: profile.nameID,
    sessionIndex: profile.sessionIndex,
    rawAttributes: collectRawAttributes(profile)
  };
}

export function toZephrUpsertInput(identity: MappedSamlIdentity): ZephrUserUpsertInput {
  return {
    externalId: identity.externalId,
    email: identity.email,
    firstName: identity.firstName,
    lastName: identity.lastName,
    customFields: {
      company: identity.company,
      role: identity.role,
      groups: identity.groups,
      b2bAccountId: identity.b2bAccountId
    }
  };
}
