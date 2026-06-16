import type { AppConfig } from '../src/config.js';

export function createTestConfig(overrides?: Partial<AppConfig>): AppConfig {
  return {
    nodeEnv: 'test',
    isProduction: false,
    port: 0,
    appBaseUrl: 'http://127.0.0.1:0',
    sessionSecret: 'test-session-secret',
    defaultRedirectUrl: '/',
    saml: {
      entryPoint: 'https://idp.example.com/sso',
      issuer: 'zephr-saml-poc-test',
      callbackUrl: 'http://127.0.0.1:0/auth/saml/acs',
      audience: 'zephr-saml-poc-test',
      idpIssuer: 'https://idp.example.com/issuer',
      idpCert: '-----BEGIN CERTIFICATE-----\nTEST\n-----END CERTIFICATE-----',
      privateKey: undefined,
      publicCert: undefined,
      forceAuthn: false,
      acceptedClockSkewMs: 5000
    },
    zephr: {
      adminBaseUrl: 'https://tenant.api.zephr.com',
      adminAccessKey: 'test-access-key',
      adminSecretKey: 'test-secret-key',
      siteId: 'test-site',
      publicBaseUrl: 'https://example.com',
      browserDebug: false,
      browserEnabled: true,
      foreignKeyName: 'SAML_SUBJECT',
      requiredGrantIds: [],
      requiredProductIds: [],
      sessionCookieDomain: undefined,
      wallLabels: {
        login: 'Login Wall',
        registration: 'Registration Wall',
        protected: 'Protected Wall'
      }
    },
    ...overrides
  };
}
