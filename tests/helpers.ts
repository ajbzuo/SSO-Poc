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
      mode: 'mock',
      entryPoint: undefined,
      issuer: 'zephr-saml-poc-test',
      callbackUrl: 'http://127.0.0.1:0/auth/saml/acs',
      audience: 'zephr-saml-poc-test',
      idpIssuer: undefined,
      idpCert: undefined,
      privateKey: undefined,
      publicCert: undefined,
      forceAuthn: false,
      acceptedClockSkewMs: 5000,
      mockUser: {
        nameId: '00u-test-user',
        email: 'test.user@example.com',
        givenName: 'Test',
        surname: 'User',
        company: 'Example Co',
        role: 'subscriber',
        groups: ['subscribers'],
        accountId: 'acct-test'
      }
    },
    zephr: {
      mode: 'mock',
      baseUrl: undefined,
      apiKey: undefined,
      siteId: undefined,
      publicBaseUrl: undefined,
      browserSdkUrl: undefined,
      createAnonymousSession: false,
      wallLabels: {
        login: 'Login Wall',
        registration: 'Registration Wall',
        protected: 'Protected Wall'
      }
    },
    ...overrides
  };
}
