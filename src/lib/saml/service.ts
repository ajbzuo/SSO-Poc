import {
  Strategy as SamlStrategy,
  ValidateInResponseTo,
  type PassportSamlConfig,
  type Profile,
  type VerifiedCallback
} from '@node-saml/passport-saml';
import type { AppConfig } from '../../config.js';
import type { RawSamlProfile } from './types.js';

export function createSamlStrategy(config: AppConfig) {
  if (config.saml.mode !== 'real') {
    return null;
  }

  if (!config.saml.entryPoint || !config.saml.callbackUrl || !config.saml.idpCert) {
    throw new Error('Real SAML mode requires SAML_ENTRY_POINT, SAML_CALLBACK_URL, and SAML_IDP_CERT.');
  }

  const verify = (profile: Profile | null, done: VerifiedCallback) => {
    done(null, profile ? (profile as unknown as Record<string, unknown>) : undefined);
  };
  const strategyConfig: PassportSamlConfig = {
    callbackUrl: config.saml.callbackUrl,
    entryPoint: config.saml.entryPoint,
    issuer: config.saml.issuer,
    audience: config.saml.audience,
    idpCert: config.saml.idpCert,
    validateInResponseTo: ValidateInResponseTo.always,
    wantAssertionsSigned: true,
    wantAuthnResponseSigned: true,
    acceptedClockSkewMs: config.saml.acceptedClockSkewMs,
    forceAuthn: config.saml.forceAuthn,
    signatureAlgorithm: 'sha256',
    disableRequestedAuthnContext: true
  };

  if (config.saml.idpIssuer) {
    strategyConfig.idpIssuer = config.saml.idpIssuer;
  }

  if (config.saml.privateKey) {
    strategyConfig.privateKey = config.saml.privateKey;
  }

  if (config.saml.publicCert) {
    strategyConfig.publicCert = config.saml.publicCert;
  }

  return new SamlStrategy(
    strategyConfig,
    verify,
    verify
  );
}

export function getMockSamlProfile(config: AppConfig): RawSamlProfile {
  return {
    issuer: 'mock-saml-idp',
    nameID: config.saml.mockUser.nameId,
    sessionIndex: 'mock-session-index',
    email: config.saml.mockUser.email,
    givenName: config.saml.mockUser.givenName,
    surname: config.saml.mockUser.surname,
    company: config.saml.mockUser.company,
    role: config.saml.mockUser.role,
    groups: config.saml.mockUser.groups,
    account_id: config.saml.mockUser.accountId
  };
}
