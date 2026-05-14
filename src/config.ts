import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const modes = z.enum(['mock', 'real']);
const booleanFromEnv = z
  .string()
  .optional()
  .transform((value) => value === 'true');

const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  APP_BASE_URL: z.string().url().default('http://localhost:3000'),
  SESSION_SECRET: z.string().min(8).default('change-me'),
  DEFAULT_REDIRECT_URL: z.string().default('/'),
  SAML_MODE: modes.default('mock'),
  SAML_ENTRY_POINT: z.string().url().optional(),
  SAML_ISSUER: z.string().optional(),
  SAML_CALLBACK_URL: z.string().url().optional(),
  SAML_AUDIENCE: z.string().optional(),
  SAML_IDP_ISSUER: z.string().optional(),
  SAML_IDP_CERT: z.string().optional(),
  SAML_PRIVATE_KEY: z.string().optional(),
  SAML_PUBLIC_CERT: z.string().optional(),
  SAML_FORCE_AUTHN: booleanFromEnv,
  SAML_ACCEPTED_CLOCK_SKEW_MS: z.coerce.number().int().default(5000),
  SAML_MOCK_NAME_ID: z.string().default('00u123example'),
  SAML_MOCK_EMAIL: z.string().email().default('alex.demo@example.com'),
  SAML_MOCK_GIVEN_NAME: z.string().default('Alex'),
  SAML_MOCK_SURNAME: z.string().default('Demo'),
  SAML_MOCK_COMPANY: z.string().default('Example Media Group'),
  SAML_MOCK_ROLE: z.string().default('marketing-admin'),
  SAML_MOCK_GROUPS: z.string().default('marketing,subscribers'),
  SAML_MOCK_ACCOUNT_ID: z.string().default('acct-demo-123'),
  ZEPHR_MODE: modes.default('mock'),
  ZEPHR_BASE_URL: z.string().url().optional(),
  ZEPHR_API_KEY: z.string().optional(),
  ZEPHR_SITE_ID: z.string().optional(),
  ZEPHR_PUBLIC_BASE_URL: z.string().url().optional(),
  ZEPHR_BROWSER_SDK_URL: z.string().url().optional(),
  ZEPHR_CREATE_ANON_SESSION: booleanFromEnv,
  ZEPHR_LOGIN_WALL_LABEL: z.string().default('Login Wall'),
  ZEPHR_REGISTRATION_WALL_LABEL: z.string().default('Registration Wall'),
  ZEPHR_PROTECTED_WALL_LABEL: z.string().default('Protected Content Wall')
});

const parsed = baseSchema.superRefine((value, ctx) => {
  if (value.SAML_MODE === 'real') {
    for (const key of ['SAML_ENTRY_POINT', 'SAML_ISSUER', 'SAML_CALLBACK_URL', 'SAML_IDP_CERT'] as const) {
      if (!value[key]) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${key} is required when SAML_MODE=real`, path: [key] });
      }
    }
  }

  if (value.ZEPHR_MODE === 'real') {
    for (const key of ['ZEPHR_BASE_URL', 'ZEPHR_API_KEY'] as const) {
      if (!value[key]) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${key} is required when ZEPHR_MODE=real`, path: [key] });
      }
    }
  }
}).parse(process.env);

export type AppConfig = ReturnType<typeof getConfig>;

export function getConfig() {
  return {
    nodeEnv: parsed.NODE_ENV,
    isProduction: parsed.NODE_ENV === 'production',
    port: parsed.PORT,
    appBaseUrl: parsed.APP_BASE_URL,
    sessionSecret: parsed.SESSION_SECRET,
    defaultRedirectUrl: parsed.DEFAULT_REDIRECT_URL,
    saml: {
      mode: parsed.SAML_MODE,
      entryPoint: parsed.SAML_ENTRY_POINT,
      issuer: parsed.SAML_ISSUER ?? parsed.APP_BASE_URL,
      callbackUrl: parsed.SAML_CALLBACK_URL,
      audience: parsed.SAML_AUDIENCE ?? parsed.SAML_ISSUER ?? parsed.APP_BASE_URL,
      idpIssuer: parsed.SAML_IDP_ISSUER,
      idpCert: parsed.SAML_IDP_CERT,
      privateKey: parsed.SAML_PRIVATE_KEY,
      publicCert: parsed.SAML_PUBLIC_CERT,
      forceAuthn: parsed.SAML_FORCE_AUTHN,
      acceptedClockSkewMs: parsed.SAML_ACCEPTED_CLOCK_SKEW_MS,
      mockUser: {
        nameId: parsed.SAML_MOCK_NAME_ID,
        email: parsed.SAML_MOCK_EMAIL,
        givenName: parsed.SAML_MOCK_GIVEN_NAME,
        surname: parsed.SAML_MOCK_SURNAME,
        company: parsed.SAML_MOCK_COMPANY,
        role: parsed.SAML_MOCK_ROLE,
        groups: parsed.SAML_MOCK_GROUPS.split(',').map((value) => value.trim()).filter(Boolean),
        accountId: parsed.SAML_MOCK_ACCOUNT_ID
      }
    },
    zephr: {
      mode: parsed.ZEPHR_MODE,
      baseUrl: parsed.ZEPHR_BASE_URL,
      apiKey: parsed.ZEPHR_API_KEY,
      siteId: parsed.ZEPHR_SITE_ID,
      publicBaseUrl: parsed.ZEPHR_PUBLIC_BASE_URL,
      browserSdkUrl: parsed.ZEPHR_BROWSER_SDK_URL,
      createAnonymousSession: parsed.ZEPHR_CREATE_ANON_SESSION,
      wallLabels: {
        login: parsed.ZEPHR_LOGIN_WALL_LABEL,
        registration: parsed.ZEPHR_REGISTRATION_WALL_LABEL,
        protected: parsed.ZEPHR_PROTECTED_WALL_LABEL
      }
    }
  };
}

export const appConfig = getConfig();
