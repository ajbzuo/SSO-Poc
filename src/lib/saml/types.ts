export type SamlAttributeValue = string | string[] | undefined;

export interface RawSamlProfile {
  issuer?: string;
  nameID?: string;
  nameIDFormat?: string;
  sessionIndex?: string;
  [key: string]: SamlAttributeValue;
}

export interface MappedSamlIdentity {
  externalId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  role?: string;
  groups: string[];
  b2bAccountId?: string;
  issuer?: string;
  nameId?: string;
  sessionIndex?: string;
  rawAttributes: Record<string, string | string[]>;
}
