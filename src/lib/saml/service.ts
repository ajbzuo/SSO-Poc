import {
  Strategy as SamlStrategy,
  ValidateInResponseTo,
  type PassportSamlConfig,
  type Profile,
  type VerifiedCallback
} from '@node-saml/passport-saml';
import type { AppConfig } from '../../config.js';

export function createSamlStrategy(config: AppConfig) {
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

  return new SamlStrategy(strategyConfig, verify, verify);
}
