# Zephr SAML POC

A Node.js + TypeScript + Express proof of concept that matches the enterprise flow more closely:

- a Zephr-managed wall or modal on the website triggers sign-in
- the user is sent to an external SAML identity provider
- after the SAML ACS callback, the backend looks up the user in Zephr
- the backend checks whether that Zephr user has an active grant
- only then does the site unlock protected content

This keeps the responsibilities clean:

- **IdP**: authentication source of truth
- **Zephr**: downstream user and grant source of truth
- **App**: SAML bridge, Zephr lookup, and article unlock decision

## Routes

- `GET /health`
- `GET /auth/saml/login`
- `POST /auth/saml/acs`
- `GET /auth/access-denied`
- `POST /auth/logout`
- `GET /me`
- `GET /`
- `GET /protected`
- `GET /articles`
- `GET /articles/:slug`
- `GET /setup-guide`

## Project structure

```text
src/
  app.ts
  server.ts
  config.ts
  routes/
    auth.ts
    index.ts
  lib/
    auth/
      bridge.ts
      relayState.ts
      samlIdpHints.ts
    content/
      articles.ts
    mappers/
      userMapper.ts
    saml/
      service.ts
      types.ts
    zephr/
      client.ts
      sessions.ts
      types.ts
      users.ts
  views/
    layout.ts
    pages.ts
  middleware/
    errorHandler.ts
tests/
  helpers.ts
  relayState.test.ts
  samlAccessDecision.test.ts
  samlIdpHints.test.ts
  userMapper.test.ts
  zephrGrantAccess.test.ts
```

## Identity flow

```text
Anonymous visitor
  -> Zephr wall / modal on article page
  -> clicks "Sign in with SSO"
  -> /auth/saml/login
  -> external SAML IdP
  -> /auth/saml/acs
  -> map SAML subject + email
  -> look up Zephr user by foreign key, then by email
  -> list active Zephr grants
  -> if grant matches: unlock content
  -> else: send to alternate access page
```

## Run locally

1. Copy envs:

```bash
cp .env.example .env
```

2. Fill in the real SAML and Zephr values.

3. Install and start:

```bash
npm install
npm run dev
```

4. Open:

- `http://localhost:3000/`
- `http://localhost:3000/articles`
- `http://localhost:3000/articles/inside-the-saml-zephr-longform-demo`

## Required environment variables

```env
APP_BASE_URL=http://localhost:3000
SESSION_SECRET=change-me

SAML_ENTRY_POINT=https://your-idp.example.com/app/your-app-id/sso/saml
SAML_ISSUER=zephr-saml-poc-local
SAML_CALLBACK_URL=http://localhost:3000/auth/saml/acs
SAML_AUDIENCE=zephr-saml-poc-local
SAML_IDP_ISSUER=http://www.okta.com/exkexample
SAML_IDP_CERT="-----BEGIN CERTIFICATE-----\nYOUR_IDP_CERT\n-----END CERTIFICATE-----"

ZEPHR_BASE_URL=https://tenant.api.zephr.com
ZEPHR_ADMIN_ACCESS_KEY=replace-me
ZEPHR_ADMIN_SECRET_KEY=replace-me
```

Useful optional variables:

- `ZEPHR_SITE_ID`
- `ZEPHR_PUBLIC_BASE_URL`
- `ZEPHR_BROWSER_SDK_URL`
- `ZEPHR_CREATE_ANON_SESSION`
- `ZEPHR_FOREIGN_KEY_NAME`
- `ZEPHR_REQUIRED_GRANT_IDS`
- `ZEPHR_REQUIRED_PRODUCT_IDS`
- `ZEPHR_SESSION_COOKIE_DOMAIN`

## Zephr assumptions

This implementation now assumes:

- the user already exists in Zephr
- the user already has a grant in Zephr
- the app should **not** provision a new Zephr user during login
- the app should **not** grant access purely because SAML succeeded

The backend first tries to match by Zephr foreign key using `ZEPHR_FOREIGN_KEY_NAME`, then falls back to email.

## Zephr API usage

The app uses Zephr Admin API endpoints for:

- `GET /v3/users?foreign_key.{key}=...`
- `GET /v3/users?identifiers.email_address=...`
- `GET /v3/users/{userId}/grants?active=true`

The admin requests are HMAC-signed.

## What the app proves today

- real SP-initiated SAML login flow
- RelayState safety
- IdP login-hint forwarding on an allowlist basis
- Zephr user lookup by external subject or email
- Zephr active-grant enforcement before content unlock
- a site experience that still uses Zephr wall markers and browser/CDN targets

## Remaining tenant-specific seam

The app treats the SAML + Zephr grant check as the authoritative access decision for the site.

If your tenant also requires a separate Zephr browser-session mirroring step after ACS, wire that final cookie/session exchange into the Zephr integration layer. The current code calls this out explicitly rather than guessing a tenant contract.

## Render

A `render.yaml` is included. Set the real env vars in Render, then deploy.

## Tests

```bash
npm run build
npm test
```

## Risks / limitations

- Zephr browser-session mirroring can vary by tenant setup
- grant matching rules may need to be narrowed with explicit grant IDs or product IDs
- if your users are only matched by email today, adding the SAML subject as a Zephr foreign key will make the integration more durable over time
