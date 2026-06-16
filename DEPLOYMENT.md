# Deployment

This app now assumes the production-shaped flow:

- the website is hosted on Render or another Node host
- a Zephr wall on the site triggers enterprise SSO
- the app performs SP-initiated SAML login
- after ACS, the backend checks Zephr for an existing user and active grant
- only users who pass that check are treated as signed in on the site

## Render

Required environment variables:

- `APP_BASE_URL`
- `SESSION_SECRET`
- `SAML_ENTRY_POINT`
- `SAML_ISSUER`
- `SAML_CALLBACK_URL`
- `SAML_AUDIENCE` (optional if same as issuer)
- `SAML_IDP_ISSUER` (optional)
- `SAML_IDP_CERT`
- `SAML_PRIVATE_KEY` (optional)
- `SAML_PUBLIC_CERT` (optional)
- `ZEPHR_BASE_URL`
- `ZEPHR_ADMIN_ACCESS_KEY`
- `ZEPHR_ADMIN_SECRET_KEY`
- `ZEPHR_SITE_ID` (optional, but recommended)
- `ZEPHR_PUBLIC_BASE_URL` (optional; enables bundled `@zephr/browser`)
- `ZEPHR_BROWSER_DEBUG` (optional)
- `ZEPHR_FOREIGN_KEY_NAME` (optional, default `SAML_SUBJECT`)
- `ZEPHR_REQUIRED_GRANT_IDS` (optional)
- `ZEPHR_REQUIRED_PRODUCT_IDS` (optional)
- `ZEPHR_SESSION_COOKIE_DOMAIN` (optional)

## Smoke test

1. Deploy the app.
2. Confirm `/health` returns `ok`.
3. Open `/articles/inside-the-saml-zephr-longform-demo`.
4. Trigger SSO with `/auth/saml/login?returnTo=/articles/inside-the-saml-zephr-longform-demo`.
5. Verify:
   - the IdP round-trip succeeds
   - `/me` returns `isAuthenticated: true` only for Zephr users with a matching active grant
   - users without a grant land on `/auth/access-denied`

## CDN notes

If you use a third-party CDN in front of the app and still want Zephr browser functionality:

- proxy `/zephr*` on the same origin so `@zephr/browser` can reach feature and decision endpoints
- do not cache `/auth/saml/acs`
- do not cache `/auth/logout`
- forward cookies and query strings
- be careful caching article HTML while testing authenticated behavior
