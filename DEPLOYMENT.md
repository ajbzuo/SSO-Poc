# Deployment Guide

## Render deployment

This app is designed to run on Render as a Node web service.

### 1. Push the repo to GitHub or another Git remote

Render deploys from a Git repository. A `render.yaml` file is included so Render can detect a sensible default service definition.

### 2. Create the Render web service

Use the repository root as the Render service root.

The included Render config expects:

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Health check path: `/health`

### 3. Set production environment variables

At minimum, set these before testing anything real:

- `APP_BASE_URL`
- `SESSION_SECRET`
- `SAML_MODE`
- `ZEPHR_MODE`

For a first smoke test on Render, keep:

- `SAML_MODE=mock`
- `ZEPHR_MODE=mock`

That lets you verify the deployment, routes, cookies, and article wall placeholders before introducing real dependencies.

### 4. Smoke test the Render deployment

After deployment, verify:

- `GET /health`
- `GET /`
- `GET /articles`
- `GET /articles/inside-the-saml-zephr-longform-demo`
- `GET /me`
- `GET /auth/saml/login?returnTo=/articles/inside-the-saml-zephr-longform-demo`

If that works in mock mode, the deployment path is good.

### 5. Switch SAML to real mode

When you are ready for a real SAML IdP:

- set `SAML_MODE=real`
- set `APP_BASE_URL` to the public URL users will hit
- set `SAML_CALLBACK_URL` to `${APP_BASE_URL}/auth/saml/acs`
- configure the same ACS URL in the IdP
- set `SAML_ENTRY_POINT`, `SAML_ISSUER`, `SAML_AUDIENCE`, and `SAML_IDP_CERT`

Important: the public URL must be stable. If you later place a CDN in front of Render, the IdP callback URL should eventually be the CDN-facing hostname, not the internal Render hostname.

### 6. Put a CDN in front of Render

Once Render works by itself, place a CDN in front of it.

Requirements:

- forward cookies
- forward query strings
- allow POST requests to `/auth/saml/acs` and `/auth/logout`
- do not cache auth endpoints
- avoid serving gated article HTML from a cache that ignores session state

Recommended first approach:

- cache public assets aggressively
- bypass or minimize caching on article pages during auth testing
- keep auth routes completely uncached

### 7. Zephr browser/CDN testing

After the CDN is in front:

- point `APP_BASE_URL` at the CDN hostname
- update `SAML_CALLBACK_URL` to the CDN hostname
- load the Zephr browser runtime with `ZEPHR_BROWSER_SDK_URL`
- set `ZEPHR_PUBLIC_BASE_URL`
- optionally set `ZEPHR_CREATE_ANON_SESSION=true`
- target Zephr walls at:
  - `#zephr-login-wall-slot`
  - `#zephr-registration-wall-slot`
  - `#zephr-protected-wall-slot`
  - `#zephr-article-wall-slot`

### 8. Real Zephr IDM bridge work still required

Render deployment does not remove the need to implement the real methods in `src/lib/zephr/client.ts` for:

- user lookup
- user create/update
- Zephr session creation
- Zephr session destruction

Keep `ZEPHR_MODE=mock` until that real tenant contract is wired.
