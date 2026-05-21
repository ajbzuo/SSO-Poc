import type { AppConfig } from '../config.js';
import type { SessionState } from '../lib/auth/bridge.js';
import { demoArticles, type DemoArticle } from '../lib/content/articles.js';
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
    return '<span class="pill warn">Metered reader · paywall eligible</span>';
  }

  return '<span class="pill">Subscriber session verified</span>';
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
    <div class="card stack saml-hint-panel subtle">
      <div class="story-kicker">Institutional access</div>
      <h3 style="margin:0;">Single sign-on for subscribed firms</h3>
      <p class="meta">Keep the entry point generic on the page while Zephr or your SSO broker decides the right client journey. If the visitor already has an active corporate session, the handoff can complete with little or no extra input.</p>
      <form method="get" action="/auth/saml/login" class="saml-hint-form">
        <input type="hidden" name="returnTo" value="${safeReturn}" />
        <label for="${fieldId}" class="meta" style="font-weight:700;">Work email (optional login hint)</label>
        <input id="${fieldId}" name="login_hint" type="email" autocomplete="username" inputmode="email" placeholder="reader@firm.com" class="saml-hint-input" />
        <div class="actions">
          <button type="submit" class="button">Sign in with institutional access</button>
        </div>
      </form>
      <p class="meta">Allowlisted hints such as <code>login_hint</code>, <code>domain_hint</code>, and <code>hd</code> are forwarded only when your IdP flow supports them.</p>
    </div>`;
}

function renderStoryCards(articles: DemoArticle[]) {
  return articles
    .map(
      (article) => `
        <article class="card article-card subtle">
          <div class="story-kicker">${escapeHtml(article.category)}</div>
          <h2>${escapeHtml(article.title)}</h2>
          <p>${escapeHtml(article.dek)}</p>
          <p class="story-meta">By ${escapeHtml(article.author)} · ${escapeHtml(article.readTime)}</p>
          <div class="actions">
            <a class="button" href="/articles/${encodeURIComponent(article.slug)}">Read feature</a>
          </div>
        </article>
      `
    )
    .join('');
}

export function renderHomePage(config: AppConfig, auth?: SessionState) {
  const lead = demoArticles[0] ?? {
    slug: 'articles',
    title: 'Front page loading',
    dek: 'The publication front page is ready for longform premium stories and Zephr paywalls.',
    category: 'Front page',
    author: 'Editorial Desk',
    readTime: '1 min read',
    teaser: [],
    premium: []
  };
  const secondary = demoArticles.slice(1, 4);

  const body = `
    <section class="hero">
      <div class="eyebrow">Front page · subscriber economics</div>
      <h1>A financial newsroom demo designed for long reads, client-specific access journeys and Zephr paywalls.</h1>
      <p class="lead-copy">Ledger Chronicle is a publication-style shell for demonstrating institutional access. Readers can browse public coverage, hit premium longform articles, and encounter Zephr-managed paywalls without the experience collapsing into a developer sandbox.</p>
      ${authPill(auth)}
      <div class="actions">
        <a class="button" href="/articles/${encodeURIComponent(lead.slug)}">Open lead investigation</a>
        <a class="button secondary" href="/articles">Browse all coverage</a>
        <a class="button secondary" href="/protected">Subscriber briefing demo</a>
        <a class="button secondary" href="/setup-guide">Integration guide</a>
        ${logoutButton(auth)}
      </div>
      ${samlLoginHintForm(`/articles/${lead.slug}`, 'front-page')}
    </section>

    <section class="grid">
      <div class="feature-grid">
        <article class="lead-package">
          <div class="lead-visual">
            <div class="lead-visual-copy">
              <strong>Lead investigation</strong>
              <p>Allocators are redrawing the line between public credit and bespoke financing, and the winners may be the platforms that can prove durability rather than just spread.</p>
            </div>
          </div>
          <div class="stack">
            <div class="story-kicker">${escapeHtml(lead.category)}</div>
            <h2>${escapeHtml(lead.title)}</h2>
            <p class="lead-copy">${escapeHtml(lead.dek)}</p>
            <p class="story-meta">By ${escapeHtml(lead.author)} · ${escapeHtml(lead.readTime)}</p>
            <div class="actions">
              <a class="button" href="/articles/${encodeURIComponent(lead.slug)}">Read the full report</a>
            </div>
          </div>
        </article>
        <aside class="side-rail">
          <section class="card stack market-panel">
            <div class="section-heading">
              <div>
                <div class="story-kicker">Market dashboard</div>
                <h3 style="margin-top:6px;">What readers are watching</h3>
              </div>
            </div>
            <div class="market-row"><span>Private credit fundraising</span><small>steady, but more selective diligence</small></div>
            <div class="market-row"><span>Sponsor exits</span><small>reopening slowly through bilateral processes</small></div>
            <div class="market-row"><span>Insurer allocations</span><small>tilting toward bespoke fixed income</small></div>
            <div class="market-row"><span>Treasury policy</span><small>liquidity management back at board level</small></div>
          </section>
          <section class="card stack">
            <div class="section-heading">
              <div>
                <div class="story-kicker">On the desk</div>
                <h3 style="margin-top:6px;">Secondary reads</h3>
              </div>
            </div>
            <div class="story-list">
              ${secondary
                .map(
                  (article) => `
                    <article>
                      <div class="story-kicker">${escapeHtml(article.category)}</div>
                      <h3 style="font-family:var(--serif);font-size:1.35rem;letter-spacing:-0.01em;text-transform:none;">${escapeHtml(article.title)}</h3>
                      <p class="story-meta">${escapeHtml(article.author)} · ${escapeHtml(article.readTime)}</p>
                      <a class="muted-link" href="/articles/${encodeURIComponent(article.slug)}">Open article</a>
                    </article>
                  `
                )
                .join('')}
            </div>
          </section>
        </aside>
      </div>
    </section>

    <section class="grid two">
      <section class="card stack">
        <div class="section-heading">
          <div>
            <div class="story-kicker">Premium logic</div>
            <h2>How the paywall flow behaves</h2>
          </div>
          <p>Preserve a realistic reading journey while leaving wall logic in Zephr.</p>
        </div>
        <p>The site intentionally behaves like a premium publication instead of a utilitarian proof of concept. Readers can absorb enough editorial context to understand the value of the story before they hit the premium section wrapped by the Zephr feature markers.</p>
        <pre>${renderJson(
          auth?.isAuthenticated
            ? {
                status: 'subscriber-session-present',
                zephrUserId: auth.zephrUser.id,
                matchedBy: auth.matchedBy,
                grantEvaluation: auth.zephrGrantAccess,
                sessionSync: auth.sessionSync
              }
            : {
                status: 'anonymous-reader',
                paywallStrategy: 'use Zephr-managed wall on article pages',
                route: '/auth/saml/login?returnTo=/articles/' + lead.slug
              }
        )}</pre>
      </section>
      <section class="card stack">
        <div class="section-heading">
          <div>
            <div class="story-kicker">Zephr surfaces</div>
            <h2>Reusable wall targets</h2>
          </div>
          <p>These slots stay stable while you redesign journeys in Zephr.</p>
        </div>
        <div class="wall-slot zephr-feature-slot" id="zephr-login-wall-slot">
          <strong>${escapeHtml(config.zephr.wallLabels.login)}</strong>
          <p>Target selector: <code>#zephr-login-wall-slot</code></p>
        </div>
        <div class="wall-slot zephr-feature-slot" id="zephr-registration-wall-slot">
          <strong>${escapeHtml(config.zephr.wallLabels.registration)}</strong>
          <p>Target selector: <code>#zephr-registration-wall-slot</code></p>
        </div>
      </section>
    </section>

    <section class="grid two">
      <section class="card stack">
        <div class="section-heading">
          <div>
            <div class="story-kicker">Browser runtime</div>
            <h2>Zephr browser-side session view</h2>
          </div>
          <p>Useful once the CDN or browser SDK is plugged in.</p>
        </div>
        <h3>SDK runtime</h3>
        <pre id="browser-sdk-status">Waiting for page load...</pre>
        <h3>Anonymous session</h3>
        <pre id="browser-anon-session">Waiting for optional BlaizeSDK.getAnonymousSession(...)</pre>
        <h3>Account</h3>
        <pre id="browser-account">Waiting for BlaizeSDK.getAccount(...)</pre>
        <h3>Profile</h3>
        <pre id="browser-profile">Waiting for BlaizeSDK.getProfile(...)</pre>
      </section>
      <section class="card stack">
        <div class="section-heading">
          <div>
            <div class="story-kicker">Newsroom intent</div>
            <h2>Why this redesign helps the demo</h2>
          </div>
          <p>Stakeholders can evaluate the whole audience journey, not just auth plumbing.</p>
        </div>
        <p>With long reads, sectional navigation and a stronger editorial tone, the paywall moment now sits inside a more believable premium product. That makes it easier to discuss conversion, reader trust and client-specific access patterns without first asking people to imagine a real website around the POC.</p>
      </section>
    </section>`;

  return renderDocument({
    title: 'Ledger Chronicle',
    body,
    appState: { auth },
    zephrBrowserSdkUrl: config.zephr.browserSdkUrl,
    zephrPublicBaseUrl: config.zephr.publicBaseUrl,
    createAnonymousSession: config.zephr.createAnonymousSession
  });
}

export function renderArticlesIndexPage(config: AppConfig, articles: DemoArticle[], auth?: SessionState) {
  const body = `
    <section class="hero">
      <div class="eyebrow">Markets · analysis · subscriber coverage</div>
      <h1>Premium financial reporting built to carry Zephr walls without breaking the reading flow.</h1>
      <p class="lead-copy">Every article below uses the same article template, the same paywallable premium section, and the same Zephr feature wrapper, so you can experiment with multiple journeys without rebuilding the page chrome each time.</p>
      ${authPill(auth)}
      <div class="actions">
        <a class="button secondary" href="/">Back to front page</a>
        ${logoutButton(auth)}
      </div>
    </section>

    <section class="grid three">
      ${renderStoryCards(articles)}
    </section>`;

  return renderDocument({
    title: 'Latest coverage',
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
  const articlePath = `/articles/${article.slug}`;
  const loginUrl = `/auth/saml/login?returnTo=${encodeURIComponent(articlePath)}`;

  const body = `
    <section class="hero">
      <div class="eyebrow">${escapeHtml(article.category)}</div>
      <h1>${escapeHtml(article.title)}</h1>
      <p class="lead-copy">${escapeHtml(article.dek)}</p>
      <p class="story-meta">By ${escapeHtml(article.author)} · ${escapeHtml(article.readTime)}</p>
      ${authPill(auth)}
      <div class="actions">
        <a class="button" href="${loginUrl}">${isAuthenticated ? 'Refresh subscriber session' : 'Sign in with institutional access'}</a>
        <a class="button secondary" href="/articles">Back to all coverage</a>
        ${logoutButton(auth)}
      </div>
    </section>

    <section class="article-shell">
      <div class="article-layout">
        <div class="article-body">
          <article class="card article-copy">
            <div class="section-heading">
              <div>
                <div class="story-kicker">Open access preview</div>
                <h2>Public introduction</h2>
              </div>
              <p>The article starts like a real premium newsroom feature.</p>
            </div>
            ${teaserMarkup}
          </article>

          <article class="card article-copy">
            <div class="section-heading">
              <div>
                <div class="story-kicker">Subscriber section</div>
                <h2>${isAuthenticated ? 'Full article unlocked' : 'Premium analysis continues beyond the wall'}</h2>
              </div>
              <p>${isAuthenticated ? 'The Zephr grant check has already passed for this session.' : 'This is the section to target with Zephr HTML/browser features.'}</p>
            </div>
            <!-- ZEPHR_FEATURE sso-regwall -->
            ${
              isAuthenticated
                ? `
                  <div class="wall-slot zephr-feature-slot" id="zephr-article-wall-slot">
                    <div>Your sites feature HTML here...</div>
                    ${premiumMarkup}
                  </div>
                `
                : `
                  <div class="wall-slot zephr-feature-slot" id="zephr-article-wall-slot">
                    <div>Your sites feature HTML here...</div>
                    <strong>Subscriber paywall slot</strong>
                    <p>Target selector: <code>#zephr-article-wall-slot</code></p>
                    <p class="meta">Use this slot for your Zephr paywall or registration wall. The SSO CTA can open <code>/auth/saml/login?returnTo=${escapeHtml(articlePath)}</code> in the same tab, a new tab, or a popup depending on the client journey you want to mimic.</p>
                  </div>
                `
            }
            <!-- ZEPHR_FEATURE_END sso-regwall -->
          </article>

          <article class="card stack">
            <div class="section-heading">
              <div>
                <div class="story-kicker">Verification panel</div>
                <h2>What the backend decided</h2>
              </div>
              <p>Helpful during demos and QA.</p>
            </div>
            <pre>${renderJson(
              isAuthenticated
                ? {
                    article: article.slug,
                    access: 'granted',
                    zephrUserId: auth?.zephrUser.id,
                    externalId: auth?.samlIdentity.externalId,
                    grantEvaluation: auth?.zephrGrantAccess,
                    matchedBy: auth?.matchedBy
                  }
                : {
                    article: article.slug,
                    access: 'teaser-only',
                    nextStep: 'Trigger Zephr wall or direct SSO start URL.'
                  }
            )}</pre>
          </article>
        </div>

        <aside class="article-aside">
          ${samlLoginHintForm(articlePath, `article-${article.slug}`)}
          <section class="card stack">
            <div class="story-kicker">Editor’s note</div>
            <div class="quote-panel">
              <p>These article pages are intentionally long enough to feel like premium finance journalism. That makes the wall placement credible and gives stakeholders something realistic to react to when discussing conversion and subscriber journeys.</p>
            </div>
          </section>
          <section class="card stack">
            <div class="story-kicker">More in ${escapeHtml(article.category)}</div>
            <div class="story-list">
              ${demoArticles
                .filter((candidate) => candidate.slug !== article.slug)
                .slice(0, 3)
                .map(
                  (candidate) => `
                    <article>
                      <h3 style="font-family:var(--serif);font-size:1.25rem;letter-spacing:-0.01em;text-transform:none;">${escapeHtml(candidate.title)}</h3>
                      <p class="story-meta">${escapeHtml(candidate.author)} · ${escapeHtml(candidate.readTime)}</p>
                      <a class="muted-link" href="/articles/${encodeURIComponent(candidate.slug)}">Open article</a>
                    </article>
                  `
                )
                .join('')}
            </div>
          </section>
        </aside>
      </div>
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
      <div class="eyebrow">Subscriber briefing</div>
      <h1>${auth?.isAuthenticated ? 'The institutional briefing is unlocked.' : 'This briefing remains subscriber-only until SSO and Zephr access checks pass.'}</h1>
      <p class="lead-copy">Use this route when you want a non-editorial premium destination as part of the same SSO and Zephr decisioning flow.</p>
      <div class="actions">
        <a class="button" href="/auth/saml/login?returnTo=/protected">${auth?.isAuthenticated ? 'Refresh SSO session' : 'Authenticate now'}</a>
        <a class="button secondary" href="/">Back to front page</a>
      </div>
      ${samlLoginHintForm('/protected', 'protected')}
    </section>

    <section class="grid two">
      <section class="card stack">
        <div class="section-heading">
          <div>
            <div class="story-kicker">Access state</div>
            <h2>Server-side decision</h2>
          </div>
          <p>Useful for testing non-article premium routes.</p>
        </div>
        <pre>${renderJson(
          auth?.isAuthenticated
            ? {
                result: 'allowed',
                zephrUserId: auth.zephrUser.id,
                grantEvaluation: auth.zephrGrantAccess,
                matchedBy: auth.matchedBy
              }
            : {
                result: 'denied',
                message: 'Authenticate through SSO and pass the Zephr grant check.'
              }
        )}</pre>
      </section>
      <section class="card stack">
        <div class="section-heading">
          <div>
            <div class="story-kicker">Protected wall slot</div>
            <h2>Attach alternate journeys here</h2>
          </div>
          <p>Ideal for subscriber briefings or research hubs.</p>
        </div>
        <div class="wall-slot zephr-feature-slot" id="zephr-protected-wall-slot">
          <strong>${escapeHtml(config.zephr.wallLabels.protected)}</strong>
          <p>Target selector: <code>#zephr-protected-wall-slot</code></p>
          <p class="meta">Use this target for a Zephr browser or HTML feature that contains the SSO CTA or your alternate access journey.</p>
        </div>
      </section>
    </section>`;

  return renderDocument({
    title: 'Subscriber briefing',
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
      <div class="eyebrow">Operations and implementation</div>
      <h1>How to wire the newsroom shell, the Zephr paywall, and the client-specific SSO handoff together.</h1>
      <p class="lead-copy">This guide stays inside the site so commercial, product and engineering stakeholders can review the operational model in the same environment as the demo experience.</p>
      <div class="actions">
        <a class="button secondary" href="/">Back to front page</a>
      </div>
    </section>

    <section class="grid two">
      <article class="card stack">
        <div class="section-heading">
          <div>
            <div class="story-kicker">App configuration</div>
            <h2>What the website needs</h2>
          </div>
        </div>
        <ol>
          <li>Copy <code>.env.example</code> to <code>.env</code>.</li>
          <li>Set <code>APP_BASE_URL</code> to the public site origin.</li>
          <li>Set <code>SAML_ENTRY_POINT</code>, <code>SAML_ISSUER</code>, <code>SAML_CALLBACK_URL</code>, and <code>SAML_IDP_CERT</code>.</li>
          <li>Set <code>ZEPHR_BASE_URL</code> to your Zephr admin API base URL, plus <code>ZEPHR_ADMIN_ACCESS_KEY</code> and <code>ZEPHR_ADMIN_SECRET_KEY</code>.</li>
          <li>Optionally set <code>ZEPHR_REQUIRED_GRANT_IDS</code> and/or <code>ZEPHR_REQUIRED_PRODUCT_IDS</code> if not every active grant should unlock this site.</li>
        </ol>
      </article>

      <article class="card stack">
        <div class="section-heading">
          <div>
            <div class="story-kicker">Enterprise SSO</div>
            <h2>What the IdP needs</h2>
          </div>
        </div>
        <ol>
          <li>Set the ACS / Reply URL to <code>${escapeHtml(config.saml.callbackUrl)}</code>.</li>
          <li>Set the SP Entity ID / Audience to <code>${escapeHtml(config.saml.issuer)}</code>.</li>
          <li>Prefer an immutable NameID because the app first tries to match the Zephr user by external subject.</li>
          <li>Expose email plus any useful profile fields such as <code>givenName</code>, <code>surname</code>, <code>company</code>, <code>role</code>, and <code>groups</code>.</li>
        </ol>
      </article>

      <article class="card stack">
        <div class="section-heading">
          <div>
            <div class="story-kicker">Zephr configuration</div>
            <h2>What the paywall needs</h2>
          </div>
        </div>
        <ol>
          <li>Ensure the user already exists in Zephr before SSO is attempted.</li>
          <li>Store the upstream SAML subject in a Zephr foreign key named <code>${escapeHtml(config.zephr.foreignKeyName)}</code> if you want the strongest match.</li>
          <li>Confirm the user has at least one active grant, or one of the required grant/product IDs if you configured filters.</li>
          <li>Keep the wall itself in Zephr and target the premium article slot wrapped by <code><!-- ZEPHR_FEATURE sso-regwall --></code>.</li>
        </ol>
      </article>

      <article class="card stack">
        <div class="section-heading">
          <div>
            <div class="story-kicker">CDN and browser runtime</div>
            <h2>What the front end needs</h2>
          </div>
        </div>
        <ol>
          <li>If you are using a third-party CDN, proxy all <code>/blaize*</code> and <code>/zephr*</code> requests on the same origin.</li>
          <li>Set <code>ZEPHR_BROWSER_SDK_URL</code> and <code>ZEPHR_PUBLIC_BASE_URL</code> if you want the page to interrogate the Zephr browser runtime.</li>
          <li>If your wall relies on an explicit anonymous session first, set <code>ZEPHR_CREATE_ANON_SESSION=true</code>.</li>
        </ol>
      </article>
    </section>`;

  return renderDocument({
    title: 'Integration guide',
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
