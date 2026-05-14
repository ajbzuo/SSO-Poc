# Zephr SAML POC

A Node.js + TypeScript + Express proof of concept that demonstrates a custom SAML bridge in front of Zephr IDM.

This repo models the identity pattern you described:

- An external SAML IdP performs primary authentication.
- Custom bridge code handles SAML login initiation, ACS validation, attribute extraction, and user mapping.
- Zephr remains the downstream identity and entitlement layer.
- The front end stays CMS-agnostic and is intended to load the Zephr browser/CDN JavaScript layer plus Zephr-managed walls.
- Registration and login walls are configured in Zephr, not hard-coded in this app.

## What this app demonstrates

- `GET /auth/saml/login` to initiate SAML login
- `POST /auth/saml/acs` to receive and validate the SAML response
- JIT provisioning into Zephr through a dedicated Zephr client abstraction
- Zephr session creation and local cookie mirroring after successful SAML login
- Local logout through `POST /auth/logout`
- Demo pages for anonymous state, signed-in state, mapped user attributes, CDN/browser SDK state, and Zephr wall targets
- Demo article pages with teaser content and an article wall target
- A built-in local setup guide at `GET /setup-guide`
- Mock-first execution so the POC is runnable without a real IdP or Zephr tenant

## Folder structure

```text
zephr-saml-poc/
├── .env.example
├── package.json
├── README.md
├── tsconfig.json
├── src/
│   ├── app.ts
│   ├── config.ts
│   ├── server.ts
│   ├── middleware/
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   └── index.ts
│   ├── views/
│   │   ├── layout.ts
│   │   └── pages.ts
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── bridge.ts
│   │   │   └── relayState.ts
│   │   ├── mappers/
│   │   │   └── userMapper.ts
│   │   ├── saml/
│   │   │   ├── service.ts
│   │   │   └── types.ts
│   │   └── zephr/
│   │       ├── client.ts
│   │       ├── sessions.ts
│   │       ├── types.ts
│   │       └── users.ts
│   └── types/
│       └── express.d.ts
└── tests/
    ├── helpers.ts
    ├── mockAuthFlow.test.ts
    ├── relayState.test.ts
    ├── userMapper.test.ts
    └── zephrMockService.test.ts
```

## Identity flow

```text
Browser
  |
  | 1. GET /auth/saml/login
  v
Custom Express bridge ------------------------------+
  |                                                  |
  | 2. Redirect AuthnRequest to external SAML IdP    |
  v                                                  |
External SAML IdP                                    |
  |                                                  |
  | 3. POST SAMLResponse to /auth/saml/acs           |
  v                                                  |
Custom Express bridge                                |
  | 4. Validate signature, audience, issuer,         |
  |    ACS destination, time conditions, RelayState  |
  | 5. Map SAML attributes to Zephr user model       |
  | 6. Upsert Zephr user                             |
  | 7. Create Zephr-authenticated session            |
  | 8. Persist local app session + mirror cookie     |
  v                                                  |
Zephr IDM / Public APIs <----------------------------+
  |
  | 9. Front end uses Zephr JS + Zephr-configured walls
  v
CMS-agnostic site pages
```

## Routes

- `GET /health`
- `GET /auth/saml/login`
- `POST /auth/saml/acs`
- `POST /auth/logout`
- `GET /me`
- `GET /`
- `GET /protected`
- `GET /articles`
- `GET /articles/:slug`
- `GET /setup-guide`

## Local run

### 1. Create environment

```bash
cp .env.example .env
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run in mock mode first

Leave these defaults in `.env`:

```env
SAML_MODE=mock
ZEPHR_MODE=mock
```

Then start the app:

```bash
npm run dev
```

Open `http://localhost:3000` and click `Start SAML login`.

In mock mode the app will:

- synthesize a SAML profile
- map the user
- create or update a mock Zephr user
- create a mock `blaize_session`
- persist the local Express session

You can also open the article demo at `http://localhost:3000/articles` and test a more realistic wall flow on:

- `http://localhost:3000/articles/inside-the-saml-zephr-longform-demo`
- `http://localhost:3000/articles/saml-zephr-bridge-explainer`

## Mock mode vs real mode

### Fully working now

- Mock SAML login through `GET /auth/saml/login`
- RelayState normalization and token storage
- JIT user mapping and upsert logic
- Mock Zephr user store
- Mock Zephr session creation and destruction
- Home page, protected page, and setup guide
- Demo article index and article detail pages with teaser-vs-unlocked behavior
- Unit tests for the core logic and a practical mock auth route test

### Mocked intentionally

- Real Zephr tenant user lookup and CRUD
- Real Zephr session creation
- Real Zephr session destruction
- Real Zephr browser SDK asset delivery

### Ready for real wiring

- Real SAML validation path through `@node-saml/passport-saml`
- Clear Zephr integration seam in `src/lib/zephr/client.ts`
- Wall target placeholders that can be bound from Zephr admin without changing the page structure
- Optional browser-side anonymous session bootstrap for CDN-style Zephr delivery

## SAML configuration notes

This repo uses `@node-saml/passport-saml` for the real SAML path.

Security-sensitive behavior included in the configuration:

- response signature validation
- `InResponseTo` validation
- audience validation
- issuer validation when configured
- timestamp and clock skew handling
- ACS callback URL checking through the SAML strategy
- RelayState tokenization to prevent open redirects
- HTTP-only cookies for both app session and mirrored Zephr cookie

## Example Okta SAML setup

Use these values for a first pass:

- Single sign-on URL: `http://localhost:3000/auth/saml/acs`
- Audience URI / SP Entity ID: `zephr-saml-poc-local`
- NameID format: persistent if possible
- Application username: email is fine if persistent NameID is unavailable

Recommended attribute statements:

- `email`
- `givenName`
- `surname`
- `company`
- `role`
- `groups`
- `account_id`

Then paste the resulting values into `.env`:

```env
SAML_MODE=real
SAML_ENTRY_POINT=https://your-okta-domain/app/.../sso/saml
SAML_ISSUER=zephr-saml-poc-local
SAML_CALLBACK_URL=http://localhost:3000/auth/saml/acs
SAML_AUDIENCE=zephr-saml-poc-local
SAML_IDP_ISSUER=http://www.okta.com/exkexample
SAML_IDP_CERT="-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"
```

If Okta requires signed AuthnRequests, also provide:

- `SAML_PRIVATE_KEY`
- `SAML_PUBLIC_CERT`

## Zephr integration notes

The app intentionally does **not** invent undocumented Zephr Admin API endpoints.

Instead it keeps the tenant-specific work isolated in `src/lib/zephr/client.ts` behind these methods:

- `findUserByExternalId`
- `findUserByEmail`
- `createUser`
- `updateUser`
- `createAuthenticatedSession`
- `destroyAuthenticatedSession`

That means the rest of the app is stable even while you decide how the real Zephr tenant should be called.

### Front-end Zephr CDN / browser expectations

The UI supports a Zephr browser runtime if you provide:

- `ZEPHR_PUBLIC_BASE_URL`
- `ZEPHR_BROWSER_SDK_URL`
- `ZEPHR_CREATE_ANON_SESSION=true` if your Zephr delivery setup requires an explicit anonymous session before wall evaluation

When the browser SDK is present the page will attempt:

- `BlaizeSDK.getAnonymousSession(...)` when configured
- `BlaizeSDK.getAccount(...)`
- `BlaizeSDK.getProfile(...)`

Wall target selectors exposed by the demo pages:

- `#zephr-login-wall-slot`
- `#zephr-registration-wall-slot`
- `#zephr-protected-wall-slot`
- `#zephr-article-wall-slot`

Use those selectors when you configure Zephr-managed login or registration walls in the Zephr admin UI.

## User mapping model

The mapping implemented in `src/lib/mappers/userMapper.ts` is:

- `NameID` or stable subject -> `externalId`
- `email` -> `email`
- `givenName` -> `firstName`
- `surname` -> `lastName`
- `company` / `org` -> `customFields.company`
- `role` / `group` -> `customFields.role` and `customFields.groups`
- `account_id` -> `customFields.b2bAccountId`

Preference order:

1. stable `NameID`
2. other stable subject claim
3. email only as fallback

## Example mock user data

```json
{
  "nameID": "00u123example",
  "email": "alex.demo@example.com",
  "givenName": "Alex",
  "surname": "Demo",
  "company": "Example Media Group",
  "role": "marketing-admin",
  "groups": ["marketing", "subscribers"],
  "account_id": "acct-demo-123"
}
```

## Testing

Once dependencies are installed:

```bash
npm test
```

Coverage targets included in this scaffold:

- user mapping
- RelayState validation logic
- mock Zephr service behavior
- practical mock auth route happy path

## Risks and limitations

- Real Zephr CRUD and session endpoints are intentionally left as TODOs because this POC avoids fabricating undocumented tenant APIs.
- Single Logout with the external IdP is not implemented. The current logout flow clears the local app session and the bridged Zephr session only.
- The browser SDK URL is tenant-specific and must be supplied by you.
- Real Zephr wall rendering depends on your tenant configuration and SDK asset availability.
- The mock path proves the bridge behavior, but not the exact Zephr tenant contract.

## What you need to supply next for a real tenant

- real SAML IdP values for `.env`
- the Zephr browser SDK asset URL
- the Zephr live/public base URL
- the exact approved Zephr tenant endpoints or SDK contract for user lookup, create, update, and session creation/destruction
- the Zephr admin configuration for the login and registration walls targeting the provided selectors

## Built-in setup guide

A detailed local guide is also available in the running app at:

- `GET /setup-guide`
