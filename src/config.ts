import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const booleanFromEnv = z
  .string()
  .optional()
  .transform((value) => value === 'true');

const csvFromEnv = z
  .string()
  .optional()
  .transform((value) =>
    value
      ? value
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean)
      : []
  );

const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  APP_BASE_URL: z.string().url().default('http://localhost:3000'),
  SESSION_SECRET: z.string().min(8).default('change-me'),
  DEFAULT_REDIRECT_URL: z.string().default('/'),
  SAML_ENTRY_POINT: z.string().url(),
  SAML_ISSUER: z.string().min(1),
  SAML_CALLBACK_URL: z.string().url(),
  SAML_AUDIENCE: z.string().optional(),
  SAML_IDP_ISSUER: z.string().optional(),
  SAML_IDP_CERT: z.string().min(1),
  SAML_PRIVATE_KEY: z.string().optional(),
  SAML_PUBLIC_CERT: z.string().optional(),
  SAML_FORCE_AUTHN: booleanFromEnv,
  SAML_ACCEPTED_CLOCK_SKEW_MS: z.coerce.number().int().default(5000),
  ZEPHR_BASE_URL: z.string().url(),
  ZEPHR_ADMIN_ACCESS_KEY: z.string().min(1),
  ZEPHR_ADMIN_SECRET_KEY: z.string().min(1),
  ZEPHR_SITE_ID: z.string().optional(),
  ZEPHR_PUBLIC_BASE_URL: z.string().url().optional(),
  ZEPHR_BROWSER_SDK_URL: z.string().url().optional(),
  ZEPHR_CREATE_ANON_SESSION: booleanFromEnv,
  ZEPHR_FOREIGN_KEY_NAME: z.string().default('SAML_SUBJECT'),
  ZEPHR_REQUIRED_GRANT_IDS: csvFromEnv,
  ZEPHR_REQUIRED_PRODUCT_IDS: csvFromEnv,
  ZEPHR_SESSION_COOKIE_DOMAIN: z.string().optional(),
  ZEPHR_LOGIN_WALL_LABEL: z.string().default('Login Wall'),
  ZEPHR_REGISTRATION_WALL_LABEL: z.string().default('Registration Wall'),
  ZEPHR_PROTECTED_WALL_LABEL: z.string().default('Protected Content Wall')
});

const parsed = baseSchema.parse(process.env);

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
      entryPoint: parsed.SAML_ENTRY_POINT,
      issuer: parsed.SAML_ISSUER,
      callbackUrl: parsed.SAML_CALLBACK_URL,
      audience: parsed.SAML_AUDIENCE ?? parsed.SAML_ISSUER,
      idpIssuer: parsed.SAML_IDP_ISSUER,
      idpCert: parsed.SAML_IDP_CERT,
      privateKey: parsed.SAML_PRIVATE_KEY,
      publicCert: parsed.SAML_PUBLIC_CERT,
      forceAuthn: parsed.SAML_FORCE_AUTHN,
      acceptedClockSkewMs: parsed.SAML_ACCEPTED_CLOCK_SKEW_MS
    },
    zephr: {
      adminBaseUrl: parsed.ZEPHR_BASE_URL,
      adminAccessKey: parsed.ZEPHR_ADMIN_ACCESS_KEY,
      adminSecretKey: parsed.ZEPHR_ADMIN_SECRET_KEY,
      siteId: parsed.ZEPHR_SITE_ID,
      publicBaseUrl: parsed.ZEPHR_PUBLIC_BASE_URL,
      browserSdkUrl: parsed.ZEPHR_BROWSER_SDK_URL,
      createAnonymousSession: parsed.ZEPHR_CREATE_ANON_SESSION,
      foreignKeyName: parsed.ZEPHR_FOREIGN_KEY_NAME,
      requiredGrantIds: parsed.ZEPHR_REQUIRED_GRANT_IDS,
      requiredProductIds: parsed.ZEPHR_REQUIRED_PRODUCT_IDS,
      sessionCookieDomain: parsed.ZEPHR_SESSION_COOKIE_DOMAIN,
      wallLabels: {
        login: parsed.ZEPHR_LOGIN_WALL_LABEL,
        registration: parsed.ZEPHR_REGISTRATION_WALL_LABEL,
        protected: parsed.ZEPHR_PROTECTED_WALL_LABEL
      }
    }
  };
}

export const appConfig = getConfig();
