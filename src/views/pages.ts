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

  return '<span class="pill">Authenticated through enterprise SAML</span>';
}

function logoutButton(auth?: SessionState) {
  if (!auth?.isAuthenticated) {
    return '';
  }

  return '<form method="post" action="/auth/logout"><button type="submit" class="button warn">Logout</button></form>';
}

function samlLoginHintForm(returnTo: string, formIdSuffix: string) {
  const safeReturn = escapeHtml(returnTo);
  const idSuffix = formIdSuffix.replace(/[^a-zA-Z0-9_-]/g, '-');
  const fieldId = `login-hint-${idSuffix}`;
  return `
    <div class="card stack saml-hint-panel">
      <h3 style="margin:0;font-size:1.05rem;font-family:'Avenir Next','Segoe UI',sans-serif;">Single Sign-On with your work account</h3>
      <p class="meta">The site sends the visitor to the enterprise SAML identity provider. If the visitor already has an active IdP session, sign-on can complete with little or no additional input.</p>
      <form method="get" action="/auth/saml/login" class="stack saml-hint-form">
        <input type="hidden" name="returnTo" value="${safeReturn}" />
        <label for="${fieldId}" class="meta" style="font-weight:700;">Work email (optional login hint)</label>
        <input id="${fieldId}" name="login_hint" type="email" autocomplete="username" inputmode="email" placeholder="you@company.com" class="saml-hint-input" />
        <div class="actions">
          <button type="submit" class="button">Sign in with SSO</button>
        </div>
      </form>
      <p class="meta">The app only forwards allowlisted IdP hints such as <code>login_hint</code>, <code>domain_hint</code>, and <code>hd</code>.</p>
    </div>`;
}

export function renderHomePage(config: AppConfig, auth?: SessionState) {
  const body = `
    <section class="hero">
      <div class="eyebrow">Zephr wall + enterprise SAML</div>
      <h1>Authenticate at the IdP, then verify Zephr access before unlocking the site.</h1>
      <p>This implementation assumes the external SAML identity provider is the source of truth for authentication, while Zephr remains the downstream source of truth for the user record and grants.</p>
      ${authPill(auth)}
      <div class="actions">
        <a class="button" href="/auth/saml/login?returnTo=/protected">Start SSO sign-in</a>
        <a class="button secondary" href="/articles">Browse demo articles</a>
        <a class="button secondary" href="/protected">Open protected page</a>
        <a class="button secondary" href="/setup-guide">Open setup guide</a>
        <a class="button secondary" href="/me">View /me JSON</a>
        ${logoutButton(auth)}
      </div>
      ${samlLoginHintForm('/protected', 'home')}
    </section>

    <section class="grid two">
      <article class="card stack">
        <h2>Current auth status</h2>
        <p class="meta">This is the server-side state after the ACS callback has validated the assertion and checked the Zephr user and grant.</p>
        <pre>${renderJson(auth ?? { isAuthenticated: false })}</pre>
      </article>
      <article class="card stack">
        <h2>Access checkpoint</h2>
        <p class="meta">The bridge only allows access when the authenticated SAML user already exists in Zephr and has at least one matching active grant.</p>
        <pre>${renderJson(
          auth
            ? {
                zephrUserId: auth.zephrUser.id,
                matchedBy: auth.matchedBy,
                grantEvaluation: auth.zephrGrantAccess,
                sessionSync: auth.sessionSync
              }
            : { message: 'No authenticated SSO session yet.' }
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
        <p class="meta">Keep login and registration experiences configured in Zephr. The app only gives them stable target slots and an SSO endpoint to open.</p>
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
      <p>Anonymous visitors can browse article summaries first, then hit article pages with teaser copy and a stable feature target for the Zephr CDN wall.</p>
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
        <a class="button" href="${loginUrl}">${isAuthenticated ? 'Re-run SSO sign-in' : 'Sign in with SSO to continue'}</a>
        <a class="button secondary" href="/articles">More articles</a>
        ${logoutButton(auth)}
      </div>
      ${samlLoginHintForm(`/articles/${article.slug}`, `article-${article.slug}`)}
    </section>

    <section class="grid two">
      <article class="card stack">
        <h2>Public teaser</h2>
        ${teaserMarkup}
      </article>
      <article class="card stack">
        <h2>${isAuthenticated ? 'Full article unlocked' : 'Premium section'}</h2>
        <!-- ZEPHR_FEATURE sso-regwall -->
        ${
          isAuthenticated
            ? `
              <div class="wall-slot zephr-feature-slot" id="zephr-article-wall-slot">
                ${premiumMarkup}
              </div>
            `
            : `
              <p>This premium section stays locked until the visitor completes enterprise SSO and the matching Zephr user is confirmed to have an active grant.</p>
              <div class="wall-slot zephr-feature-slot" id="zephr-article-wall-slot">
                <strong>Article SSO wall</strong>
                <p>Target selector: <code>#zephr-article-wall-slot</code></p>
                <p class="meta">Your Zephr wall can open <code>/auth/saml/login?returnTo=/articles/${escapeHtml(article.slug)}</code> in a popup or new tab, just like the client flow.</p>
              </div>
            `
        }
        <!-- ZEPHR_FEATURE_END sso-regwall -->
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
                externalId: auth?.samlIdentity.externalId,
                grantEvaluation: auth?.zephrGrantAccess
              }
            : {
                article: article.slug,
                result: 'teaser-only',
                recommendation: 'Use the Zephr wall to trigger enterprise SSO and let the backend verify the Zephr grant.'
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
          ? 'The SAML assertion was accepted and the matching Zephr user passed the active-grant check.'
          : 'This page intentionally renders the anonymous-state version first so you can attach a Zephr-managed wall or send the user to enterprise SSO from the UI.'
      }</p>
      <div class="actions">
        <a class="button" href="/auth/saml/login?returnTo=/protected">${auth?.isAuthenticated ? 'Re-run SSO sign-in' : 'Authenticate now'}</a>
        <a class="button secondary" href="/">Back home</a>
      </div>
      ${samlLoginHintForm('/protected', 'protected')}
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
                grantEvaluation: auth.zephrGrantAccess,
                matchedBy: auth.matchedBy
              }
            : {
                result: 'denied',
                message: 'Authenticate through SSO and pass the Zephr grant check.'
              }
        )}</pre>
      </article>
      <article class="card stack">
        <h2>Zephr wall target</h2>
        <div class="wall-slot zephr-feature-slot" id="zephr-protected-wall-slot">
          <strong>${escapeHtml(config.zephr.wallLabels.protected)}</strong>
          <p>Target selector: <code>#zephr-protected-wall-slot</code></p>
          <p class="meta">Use this target for a Zephr browser or HTML feature that contains the SSO CTA or your alternate access journey.</p>
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
      <h1>Exact end-to-end steps for enterprise SAML + Zephr grant verification.</h1>
      <p>This guide is intentionally local to the app so you can stand up the production-shaped flow without bouncing between external notes.</p>
      <div class="actions">
        <a class="button secondary" href="/">Back home</a>
      </div>
    </section>

    <section class="grid">
      <article class="card stack">
        <h2>1. Configure the app</h2>
        <ol>
          <li>Copy <code>.env.example</code> to <code>.env</code>.</li>
          <li>Set <code>APP_BASE_URL</code> to the public site origin.</li>
          <li>Set <code>SAML_ENTRY_POINT</code>, <code>SAML_ISSUER</code>, <code>SAML_CALLBACK_URL</code>, and <code>SAML_IDP_CERT</code>.</li>
          <li>Set <code>ZEPHR_BASE_URL</code> to your Zephr admin API base URL, plus <code>ZEPHR_ADMIN_ACCESS_KEY</code> and <code>ZEPHR_ADMIN_SECRET_KEY</code>.</li>
          <li>Optionally set <code>ZEPHR_REQUIRED_GRANT_IDS</code> and/or <code>ZEPHR_REQUIRED_PRODUCT_IDS</code> if not every active grant should unlock this site.</li>
          <li>Run <code>npm run dev</code> locally or deploy the app behind your CDN.</li>
        </ol>
      </article>

      <article class="card stack">
        <h2>2. Configure the enterprise SAML app</h2>
        <ol>
          <li>Set the ACS / Reply URL to <code>${escapeHtml(config.saml.callbackUrl)}</code>.</li>
          <li>Set the SP Entity ID / Audience to <code>${escapeHtml(config.saml.issuer)}</code>.</li>
          <li>Prefer an immutable NameID because the app first tries to match the Zephr user by external subject.</li>
          <li>Expose email plus any useful profile fields such as <code>givenName</code>, <code>surname</code>, <code>company</code>, <code>role</code>, and <code>groups</code>.</li>
          <li>If the client IdP supports login hints, the app forwards <code>login_hint</code>, <code>domain_hint</code>, and <code>hd</code>.</li>
        </ol>
      </article>

      <article class="card stack">
        <h2>3. Configure Zephr</h2>
        <ol>
          <li>Ensure the user already exists in Zephr before SSO is attempted.</li>
          <li>Store the upstream SAML subject in a Zephr foreign key named <code>${escapeHtml(config.zephr.foreignKeyName)}</code> if you want the strongest match.</li>
          <li>Confirm the user has at least one active grant, or one of the required grant/product IDs if you configured filters.</li>
          <li>Keep the wall itself in Zephr and target the article slot wrapped by <code><!-- ZEPHR_FEATURE sso-regwall --></code>.</li>
        </ol>
      </article>

      <article class="card stack">
        <h2>4. CDN/browser integration</h2>
        <ol>
          <li>If you are using a third-party CDN, proxy all <code>/blaize*</code> and <code>/zephr*</code> requests on the same origin.</li>
          <li>Set <code>ZEPHR_BROWSER_SDK_URL</code> and <code>ZEPHR_PUBLIC_BASE_URL</code> if you want the page to interrogate the Zephr browser runtime.</li>
          <li>If your wall relies on an explicit anonymous session first, set <code>ZEPHR_CREATE_ANON_SESSION=true</code>.</li>
        </ol>
      </article>

      <article class="card stack">
        <h2>5. End-to-end test</h2>
        <ol>
          <li>Open a demo article anonymously and confirm the Zephr wall appears.</li>
          <li>Trigger SSO from the wall or via <code>/auth/saml/login?returnTo=/articles/inside-the-saml-zephr-longform-demo</code>.</li>
          <li>Let the IdP authenticate the user.</li>
          <li>After ACS, confirm <code>/me</code> shows <code>isAuthenticated: true</code> only when the matching Zephr user has an active grant.</li>
          <li>If the user exists but lacks a grant, confirm they are sent to the alternate access page instead of silently failing.</li>
        </ol>
      </article>
    </section>`;

  return renderDocument({
    title: 'Setup guide',
    body,
    appState: {
      requiredGrantIds: config.zephr.requiredGrantIds,
      requiredProductIds: config.zephr.requiredProductIds,
      foreignKeyName: config.zephr.foreignKeyName
    },
    zephrBrowserSdkUrl: config.zephr.browserSdkUrl,
    zephrPublicBaseUrl: config.zephr.publicBaseUrl
  });
}
