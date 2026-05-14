import type { AppConfig } from '../config.js';
import type { SessionState } from '../lib/auth/bridge.js';
import type { DemoArticle } from '../lib/content/articles.js';
import { renderDocument } from './layout.js';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderJson(value: unknown) {
  return escapeHtml(JSON.stringify(value, null, 2));
}

function authPill(auth?: SessionState) {
  if (!auth?.isAuthenticated) {
    return '<span class="pill warn">Anonymous session</span>';
  }

  return '<span class="pill">Authenticated through SAML bridge</span>';
}

function logoutButton(auth?: SessionState) {
  if (!auth?.isAuthenticated) {
    return '';
  }

  return '<form method="post" action="/auth/logout"><button type="submit" class="button warn">Logout</button></form>';
}

export function renderHomePage(config: AppConfig, auth?: SessionState) {
  const body = `
    <section class="hero">
      <div class="eyebrow">Zephr IDM + Custom SAML Bridge</div>
      <h1>External SAML login, Zephr-managed walls, one downstream session.</h1>
      <p>This proof of concept keeps the authentication ceremony in your external IdP, then maps the user into Zephr IDM and mirrors a Zephr-authenticated session so the front end can continue to use Zephr JS and Zephr-configured walls.</p>
      ${authPill(auth)}
      <div class="actions">
        <a class="button" href="/auth/saml/login?returnTo=/protected">Start SAML login</a>
        <a class="button secondary" href="/articles">Browse demo articles</a>
        <a class="button secondary" href="/protected">Open protected page</a>
        <a class="button secondary" href="/setup-guide">Open setup guide</a>
        <a class="button secondary" href="/me">View /me JSON</a>
        ${logoutButton(auth)}
      </div>
    </section>

    <section class="grid two">
      <article class="card stack">
        <h2>Current auth status</h2>
        <p class="meta">This is the server-side session state that the bridge maintains after ACS or mock login.</p>
        <pre>${renderJson(auth ?? { isAuthenticated: false })}</pre>
      </article>
      <article class="card stack">
        <h2>Zephr sync checkpoint</h2>
        <p class="meta">The SAML bridge upserts a Zephr user and then creates a Zephr-authenticated session so the browser-side Zephr runtime can act on the same visitor.</p>
        <pre>${renderJson(
          auth
            ? {
                zephrUserId: auth.zephrUser.id,
                externalId: auth.zephrUser.externalId,
                upsertOperation: auth.zephrUpsert.operation,
                zephrCookieSync: auth.zephrSessionSync
              }
            : { message: 'No authenticated bridge session yet.' }
        )}</pre>
      </article>
    </section>

    <section class="grid two">
      <article class="card stack">
        <h2>Browser SDK state</h2>
        <p class="meta">If you provide the Zephr browser SDK URL from your Zephr delivery domain, these panels will behave like a CDN/browser-side implementation and try to read the current Zephr-side session, account, and profile.</p>
        <h3>SDK runtime</h3>
        <pre id="browser-sdk-status">Waiting for page load...</pre>
        <h3>Anonymous session</h3>
        <pre id="browser-anon-session">Waiting for optional BlaizeSDK.getAnonymousSession(...)</pre>
        <h3>Account</h3>
        <pre id="browser-account">Waiting for BlaizeSDK.getAccount(...)</pre>
        <h3>Profile</h3>
        <pre id="browser-profile">Waiting for BlaizeSDK.getProfile(...)</pre>
      </article>
      <article class="card stack">
        <h2>Wall target slots</h2>
        <p class="meta">These are stable placeholders you can target from Zephr admin. Keep the registration and login walls configured in Zephr, not hard-coded here.</p>
        <div class="wall-slot zephr-feature-slot" id="zephr-login-wall-slot">
          <strong>${escapeHtml(config.zephr.wallLabels.login)}</strong>
          <p>Target selector: <code>#zephr-login-wall-slot</code></p>
        </div>
        <div class="wall-slot zephr-feature-slot" id="zephr-registration-wall-slot">
          <strong>${escapeHtml(config.zephr.wallLabels.registration)}</strong>
          <p>Target selector: <code>#zephr-registration-wall-slot</code></p>
        </div>
      </article>
    </section>`;

  return renderDocument({
    title: 'Zephr SAML POC',
    body,
    appState: { auth },
    zephrBrowserSdkUrl: config.zephr.browserSdkUrl,
    zephrPublicBaseUrl: config.zephr.publicBaseUrl,
    createAnonymousSession: config.zephr.createAnonymousSession
  });
}

export function renderArticlesIndexPage(config: AppConfig, articles: DemoArticle[], auth?: SessionState) {
  const articleCards = articles
    .map(
      (article) => `
        <article class="card stack">
          <div class="eyebrow">${escapeHtml(article.category)}</div>
          <h2>${escapeHtml(article.title)}</h2>
          <p>${escapeHtml(article.dek)}</p>
          <p class="meta">By ${escapeHtml(article.author)} · ${escapeHtml(article.readTime)}</p>
          <div class="actions">
            <a class="button" href="/articles/${encodeURIComponent(article.slug)}">Open article</a>
          </div>
        </article>
      `
    )
    .join('');

  const body = `
    <section class="hero">
      <div class="eyebrow">Demo website</div>
      <h1>Sample articles you can protect with a Zephr-managed wall.</h1>
      <p>This page turns the proof of concept into a more realistic content demo. Anonymous users can browse article summaries, then hit article pages with teaser copy and a stable wall target for Zephr.</p>
      ${authPill(auth)}
      <div class="actions">
        <a class="button secondary" href="/">Back home</a>
        ${logoutButton(auth)}
      </div>
    </section>

    <section class="grid two">
      ${articleCards}
    </section>`;

  return renderDocument({
    title: 'Demo articles',
    body,
    appState: { auth, articles: articles.map(({ slug, title }) => ({ slug, title })) },
    zephrBrowserSdkUrl: config.zephr.browserSdkUrl,
    zephrPublicBaseUrl: config.zephr.publicBaseUrl,
    createAnonymousSession: config.zephr.createAnonymousSession
  });
}

export function renderArticlePage(config: AppConfig, article: DemoArticle, auth?: SessionState) {
  const isAuthenticated = Boolean(auth?.isAuthenticated);
  const teaserMarkup = article.teaser.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
  const premiumMarkup = article.premium.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
  const loginUrl = `/auth/saml/login?returnTo=${encodeURIComponent(`/articles/${article.slug}`)}`;

  const body = `
    <section class="hero">
      <div class="eyebrow">${escapeHtml(article.category)}</div>
      <h1>${escapeHtml(article.title)}</h1>
      <p>${escapeHtml(article.dek)}</p>
      <p class="meta">By ${escapeHtml(article.author)} · ${escapeHtml(article.readTime)}</p>
      ${authPill(auth)}
      <div class="actions">
        <a class="button" href="${loginUrl}">${isAuthenticated ? 'Refresh sign-in state' : 'Login to continue reading'}</a>
        <a class="button secondary" href="/articles">More articles</a>
        ${logoutButton(auth)}
      </div>
    </section>

    <section class="grid two">
      <article class="card stack">
        <h2>Public teaser</h2>
        ${teaserMarkup}
      </article>
      <article class="card stack">
        <h2>${isAuthenticated ? 'Full article unlocked' : 'Premium section'}</h2>
        ${
          isAuthenticated
            ? premiumMarkup
            : `
              <p>This premium section is intentionally hidden until the visitor is authenticated through the bridge or a Zephr-managed wall completes the journey.</p>
              <!-- ZEPHR_FEATURE sso-regwall -->
              <div class="wall-slot zephr-feature-slot" id="zephr-article-wall-slot">
                <strong>Article registration or login wall</strong>
                <p>Target selector: <code>#zephr-article-wall-slot</code></p>
                <p class="meta">Attach a Zephr-managed registration wall or login wall here. The app gives you the placeholder; Zephr owns the actual journey.</p>
              </div>
              <!-- ZEPHR_FEATURE_END sso-regwall -->
            `
        }
      </article>
    </section>

    <section class="grid">
      <article class="card stack">
        <h2>What this proves</h2>
        <pre>${renderJson(
          isAuthenticated
            ? {
                article: article.slug,
                result: 'full-content-visible',
                zephrUserId: auth?.zephrUser.id,
                externalId: auth?.samlIdentity.externalId
              }
            : {
                article: article.slug,
                result: 'teaser-only',
                recommendation: 'Attach a Zephr wall to #zephr-article-wall-slot or use the SAML login button.'
              }
        )}</pre>
      </article>
    </section>`;

  return renderDocument({
    title: article.title,
    body,
    appState: { auth, article: { slug: article.slug, title: article.title } },
    zephrBrowserSdkUrl: config.zephr.browserSdkUrl,
    zephrPublicBaseUrl: config.zephr.publicBaseUrl,
    createAnonymousSession: config.zephr.createAnonymousSession
  });
}

export function renderProtectedPage(config: AppConfig, auth?: SessionState) {
  const body = `
    <section class="hero">
      <div class="eyebrow">Protected page demo</div>
      <h1>${auth?.isAuthenticated ? 'Protected content is available.' : 'Anonymous visitors stop here.'}</h1>
      <p>${
        auth?.isAuthenticated
          ? 'The server-side bridge session is active, the mapped Zephr user exists, and the page can now behave like a signed-in Zephr-backed experience.'
          : 'This page intentionally renders an anonymous-state version first so you can attach a Zephr-managed login or registration wall without hard-coding the form in this app.'
      }</p>
      <div class="actions">
        <a class="button" href="/auth/saml/login?returnTo=/protected">${auth?.isAuthenticated ? 'Re-run SAML login' : 'Authenticate now'}</a>
        <a class="button secondary" href="/">Back home</a>
      </div>
    </section>

    <section class="grid two">
      <article class="card stack">
        <h2>Server-side decision</h2>
        <pre>${renderJson(
          auth?.isAuthenticated
            ? {
                result: 'allowed',
                message: 'Protected content rendered.',
                zephrUserId: auth.zephrUser.id,
                externalId: auth.samlIdentity.externalId
              }
            : {
                result: 'denied',
                message: 'Authenticate through the bridge or attach a Zephr wall to the slot on this page.'
              }
        )}</pre>
      </article>
      <article class="card stack">
        <h2>Zephr wall target</h2>
        <div class="wall-slot zephr-feature-slot" id="zephr-protected-wall-slot">
          <strong>${escapeHtml(config.zephr.wallLabels.protected)}</strong>
          <p>Target selector: <code>#zephr-protected-wall-slot</code></p>
          <p class="meta">Use this target for a Zephr browser or HTML feature that contains your configured login or registration journey.</p>
        </div>
      </article>
    </section>

    <section class="grid">
      <article class="card stack">
        <h2>Mapped identity</h2>
        <pre>${renderJson(auth?.samlIdentity ?? { message: 'No SAML identity mapped yet.' })}</pre>
      </article>
    </section>`;

  return renderDocument({
    title: 'Protected page',
    body,
    appState: { auth },
    zephrBrowserSdkUrl: config.zephr.browserSdkUrl,
    zephrPublicBaseUrl: config.zephr.publicBaseUrl,
    createAnonymousSession: config.zephr.createAnonymousSession
  });
}

export function renderSetupGuidePage(config: AppConfig) {
  const body = `
    <section class="hero">
      <div class="eyebrow">Local setup guide</div>
      <h1>Exact end-to-end steps for mock mode first, then real SAML and real Zephr.</h1>
      <p>This guide is intentionally local to the app so you can stand up the POC without bouncing between product docs. The app is mock-first, then real-mode-ready at the integration seams.</p>
      <div class="actions">
        <a class="button secondary" href="/">Back home</a>
      </div>
    </section>

    <section class="grid">
      <article class="card stack">
        <h2>1. Start in full local demo mode</h2>
        <ol>
          <li>Copy <code>.env.example</code> to <code>.env</code>.</li>
          <li>Leave <code>SAML_MODE=mock</code> and <code>ZEPHR_MODE=mock</code>.</li>
          <li>Set <code>APP_BASE_URL</code> and <code>SAML_CALLBACK_URL</code> to the same local origin, usually <code>http://localhost:3000</code>.</li>
          <li>Install dependencies, then run <code>npm run dev</code>.</li>
          <li>Open <code>/</code>, click <code>Start SAML login</code>, and confirm the home page shows a mapped user plus a mock <code>blaize_session</code> cookie sync message.</li>
        </ol>
      </article>

      <article class="card stack">
        <h2>2. Configure a test SAML provider in Okta</h2>
        <ol>
          <li>Create a new SAML 2.0 application in Okta.</li>
          <li>Set the Single sign-on URL to <code>${escapeHtml(config.appBaseUrl)}/auth/saml/acs</code>.</li>
          <li>Set the Audience URI / SP Entity ID to <code>${escapeHtml(config.saml.issuer)}</code>.</li>
          <li>Prefer a persistent or otherwise immutable NameID format, because this app maps NameID to <code>externalId</code>.</li>
          <li>Add attribute statements for <code>email</code>, <code>givenName</code>, <code>surname</code>, <code>company</code>, <code>role</code>, optional <code>groups</code>, and optional <code>account_id</code>.</li>
          <li>Download or copy the IdP signing certificate in PEM form and paste it into <code>SAML_IDP_CERT</code>.</li>
          <li>Copy the Okta SSO URL into <code>SAML_ENTRY_POINT</code> and the Okta issuer into <code>SAML_IDP_ISSUER</code>.</li>
        </ol>
      </article>

      <article class="card stack">
        <h2>3. Switch the app from mock SAML to real SAML</h2>
        <ol>
          <li>Change <code>SAML_MODE=real</code>.</li>
          <li>Confirm <code>SAML_ENTRY_POINT</code>, <code>SAML_ISSUER</code>, <code>SAML_CALLBACK_URL</code>, and <code>SAML_IDP_CERT</code> are set.</li>
          <li>If your IdP requires signed AuthnRequests, add <code>SAML_PRIVATE_KEY</code> and <code>SAML_PUBLIC_CERT</code>.</li>
          <li>Keep <code>SAML_ACCEPTED_CLOCK_SKEW_MS</code> small and use the default audience/issuer pairing unless your IdP needs a different audience string.</li>
          <li>Restart the app and trigger <code>/auth/saml/login</code>. The ACS route will validate signature, audience, issuer, response timing, ACS destination, and <code>InResponseTo</code> through the SAML library configuration.</li>
        </ol>
      </article>

      <article class="card stack">
        <h2>4. Configure Zephr JS and wall targets</h2>
        <ol>
          <li>Set <code>ZEPHR_PUBLIC_BASE_URL</code> to your Zephr live domain.</li>
          <li>Set <code>ZEPHR_BROWSER_SDK_URL</code> to the Zephr browser script served from your delivery/CDN setup.</li>
          <li>Use the browser SDK on the front end. This page expects a global <code>BlaizeSDK</code> object and will call <code>getAccount</code> and <code>getProfile</code> when present.</li>
          <li>If your Zephr delivery setup needs an explicit anonymous session bootstrap before walls can evaluate, set <code>ZEPHR_CREATE_ANON_SESSION=true</code> so the page calls <code>BlaizeSDK.getAnonymousSession(...)</code> first.</li>
          <li>Create Zephr-managed login and registration journeys in Zephr admin.</li>
          <li>Target those journeys or browser/html features at the selectors <code>#zephr-login-wall-slot</code>, <code>#zephr-registration-wall-slot</code>, and <code>#zephr-protected-wall-slot</code>.</li>
          <li>Do not build the forms into this app; keep the forms and wall behavior inside Zephr so the front end stays CMS-agnostic.</li>
        </ol>
      </article>

      <article class="card stack">
        <h2>5. Wire the Zephr tenant integration</h2>
        <ol>
          <li>Decide whether your Zephr tenant will be updated through the Admin API, server-side SDK, or another approved integration surface.</li>
          <li>Implement the TODO methods in <code>src/lib/zephr/client.ts</code> for <code>findUserByExternalId</code>, <code>findUserByEmail</code>, <code>createUser</code>, <code>updateUser</code>, <code>createAuthenticatedSession</code>, and <code>destroyAuthenticatedSession</code>.</li>
          <li>Keep the current mapping model: NameID to <code>externalId</code>, email to <code>email</code>, givenName to <code>firstName</code>, surname to <code>lastName</code>, company/org to <code>company</code>, role/group to <code>role</code> or <code>groups</code>, and account id to <code>b2bAccountId</code>.</li>
          <li>Only update safe profile fields during upsert. The mock implementation already models that pattern.</li>
          <li>Once the tenant API calls are ready, change <code>ZEPHR_MODE=real</code>.</li>
        </ol>
      </article>

      <article class="card stack">
        <h2>6. Test login, logout, and protected-page access</h2>
        <ol>
          <li>Anonymous state: load <code>/</code> and <code>/protected</code>, verify the server session is anonymous and the wall slots render.</li>
          <li>Login state: use <code>/auth/saml/login</code>. After ACS, confirm <code>/me</code> shows <code>isAuthenticated: true</code>, a mapped user, a Zephr upsert outcome, and a Zephr session object.</li>
          <li>Browser SDK state: if the Zephr browser SDK is configured, verify the account/profile panels stop returning errors.</li>
          <li>Protected page: revisit <code>/protected</code> and confirm it renders the signed-in content panel.</li>
          <li>Logout: submit the <code>/auth/logout</code> form and verify both the app session and <code>blaize_session</code> cookie are cleared locally.</li>
        </ol>
      </article>

      <article class="card stack">
        <h2>7. Switch from mock mode to real mode cleanly</h2>
        <ol>
          <li>First switch <code>SAML_MODE</code> from <code>mock</code> to <code>real</code> so ACS validation becomes real.</li>
          <li>Then switch <code>ZEPHR_MODE</code> from <code>mock</code> to <code>real</code> only after you have implemented the real tenant methods.</li>
          <li>Keep the wall slots and the front-end page structure unchanged; the whole point of the POC is that the Zephr-managed experience stays in Zephr while the bridge logic stays in the app.</li>
        </ol>
      </article>
    </section>`;

  return renderDocument({
    title: 'Setup guide',
    body,
    appState: { mode: { saml: config.saml.mode, zephr: config.zephr.mode } },
    zephrBrowserSdkUrl: config.zephr.browserSdkUrl,
    zephrPublicBaseUrl: config.zephr.publicBaseUrl
  });
}
