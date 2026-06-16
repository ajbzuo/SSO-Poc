interface RenderDocumentOptions {
  title: string;
  body: string;
  appState: unknown;
  zephrPublicBaseUrl?: string;
  zephrBrowserEnabled?: boolean;
  zephrBrowserDebug?: boolean;
}

function escapeForHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderDocument(options: RenderDocumentOptions) {
  const serializedState = JSON.stringify(options.appState, null, 2).replaceAll('<', '\\u003c');
  const browserSdkScript = options.zephrBrowserEnabled
    ? '<script defer src="/assets/zephr-browser/zephr-browser.umd.js"></script>'
    : '';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeForHtml(options.title)}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f3efe6;
        --paper: #fbf7ef;
        --panel: #fffdf8;
        --panel-strong: #f7f0e1;
        --border: rgba(55, 43, 24, 0.16);
        --border-strong: rgba(55, 43, 24, 0.32);
        --text: #20170d;
        --muted: #6f6559;
        --accent: #8a5a1f;
        --accent-dark: #5c3411;
        --ink: #111111;
        --success: #264a31;
        --warning: #8b5e23;
        --danger: #8b2d2d;
        --shadow: 0 20px 45px rgba(44, 31, 12, 0.08);
        --radius: 20px;
        --sans: "Avenir Next", "Gill Sans", "Segoe UI", sans-serif;
        --serif: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif;
        --mono: "SFMono-Regular", Consolas, monospace;
      }

      * { box-sizing: border-box; }
      html { background: linear-gradient(180deg, #e8decd 0%, var(--bg) 22%, #f7f2e9 100%); }
      body {
        margin: 0;
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(138, 90, 31, 0.08), transparent 24%),
          linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 12%),
          var(--bg);
        font-family: var(--serif);
      }
      a { color: inherit; text-decoration-color: rgba(138, 90, 31, 0.45); }
      img { max-width: 100%; }
      .shell {
        max-width: 1280px;
        margin: 0 auto;
        padding: 20px 16px 64px;
      }
      .site-frame {
        background: rgba(251, 247, 239, 0.92);
        border: 1px solid rgba(55, 43, 24, 0.08);
        border-radius: 28px;
        box-shadow: var(--shadow);
        overflow: hidden;
      }
      .market-tape {
        display: flex;
        gap: 18px;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 10px 24px;
        background: #16120d;
        color: #f4e9d6;
        font: 600 0.76rem var(--sans);
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .market-tape span strong { color: #fff7ea; }
      .masthead {
        padding: 26px 24px 20px;
        border-bottom: 1px solid var(--border);
        background:
          linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0.25)),
          var(--paper);
      }
      .masthead-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 18px;
      }
      .edition-note {
        font: 700 0.75rem var(--sans);
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--muted);
      }
      .brand-block {
        text-align: center;
        flex: 1;
      }
      .brand-mark {
        font-family: var(--sans);
        font-size: clamp(2.3rem, 4vw, 4.2rem);
        line-height: 0.9;
        font-weight: 800;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: var(--ink);
      }
      .brand-kicker {
        margin-top: 6px;
        font: 600 0.85rem var(--sans);
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--accent-dark);
      }
      .masthead-utility {
        display: flex;
        align-items: center;
        gap: 10px;
        justify-content: flex-end;
      }
      .nav-bar {
        display: flex;
        gap: 18px;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        border-top: 1px solid var(--border);
        padding-top: 14px;
        font: 700 0.82rem var(--sans);
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .nav-bar a {
        text-decoration: none;
        color: var(--ink);
      }
      .nav-bar a:hover { color: var(--accent-dark); }
      .content-shell {
        padding: 28px 24px 40px;
      }
      .hero {
        display: grid;
        gap: 20px;
        padding-bottom: 22px;
        border-bottom: 1px solid var(--border);
      }
      .eyebrow {
        display: inline-flex;
        width: fit-content;
        padding: 5px 10px;
        border: 1px solid rgba(138, 90, 31, 0.2);
        border-radius: 999px;
        background: rgba(138, 90, 31, 0.08);
        color: var(--accent-dark);
        font: 700 0.72rem var(--sans);
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }
      h1, h2, h3, h4 {
        margin: 0;
        color: var(--ink);
      }
      h1 {
        font-family: var(--serif);
        font-size: clamp(2.4rem, 4.7vw, 4.8rem);
        line-height: 0.94;
        letter-spacing: -0.03em;
        max-width: 16ch;
      }
      h2 {
        font-family: var(--serif);
        font-size: clamp(1.45rem, 2vw, 2.2rem);
        line-height: 1.05;
      }
      h3 {
        font-family: var(--sans);
        font-size: 1rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
      p {
        margin: 0;
        line-height: 1.72;
        font-size: 1.04rem;
      }
      .lead-copy {
        max-width: 70ch;
        font-size: 1.14rem;
        color: #312417;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
      }
      .button, button {
        border: 0;
        border-radius: 999px;
        padding: 12px 20px;
        font: 700 0.92rem var(--sans);
        letter-spacing: 0.04em;
        cursor: pointer;
        background: var(--ink);
        color: #fff9ee;
        text-decoration: none;
      }
      .button.secondary {
        background: transparent;
        color: var(--ink);
        border: 1px solid var(--border-strong);
      }
      .button.warn {
        background: #f6e6c8;
        color: var(--warning);
      }
      .button:hover, button:hover { filter: brightness(1.03); }
      .grid {
        display: grid;
        gap: 22px;
        margin-top: 26px;
      }
      .grid.two {
        grid-template-columns: 1.65fr minmax(280px, 0.95fr);
      }
      .grid.three {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .stack {
        display: grid;
        gap: 14px;
      }
      .card {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 22px;
        box-shadow: 0 8px 20px rgba(51, 33, 10, 0.04);
      }
      .card.subtle {
        background: linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.4));
      }
      .feature-grid {
        display: grid;
        gap: 22px;
        grid-template-columns: minmax(0, 1.6fr) minmax(260px, 0.85fr);
        align-items: start;
      }
      .lead-package {
        display: grid;
        gap: 16px;
      }
      .lead-visual {
        min-height: 260px;
        border-radius: 22px;
        border: 1px solid rgba(55, 43, 24, 0.12);
        background:
          linear-gradient(135deg, rgba(15, 24, 43, 0.92), rgba(21, 56, 90, 0.78)),
          radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1), transparent 25%);
        position: relative;
        overflow: hidden;
      }
      .lead-visual::before,
      .lead-visual::after {
        content: "";
        position: absolute;
        inset: auto;
        border-radius: 999px;
      }
      .lead-visual::before {
        width: 260px;
        height: 260px;
        right: -80px;
        top: -70px;
        background: rgba(241, 184, 93, 0.22);
      }
      .lead-visual::after {
        width: 420px;
        height: 2px;
        left: -40px;
        bottom: 70px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
        box-shadow:
          0 -34px 0 rgba(255,255,255,0.13),
          0 36px 0 rgba(255,255,255,0.09),
          0 72px 0 rgba(255,255,255,0.07);
        transform: rotate(-7deg);
      }
      .lead-visual-copy {
        position: absolute;
        left: 24px;
        right: 24px;
        bottom: 24px;
        color: #f8f0df;
        display: grid;
        gap: 10px;
      }
      .lead-visual-copy strong {
        font: 800 0.82rem var(--sans);
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }
      .lead-visual-copy p {
        font-size: 1rem;
        line-height: 1.55;
      }
      .side-rail {
        display: grid;
        gap: 18px;
      }
      .story-list {
        display: grid;
        gap: 14px;
      }
      .story-list article,
      .news-card {
        padding-bottom: 14px;
        border-bottom: 1px solid var(--border);
      }
      .story-list article:last-child,
      .news-card:last-child {
        padding-bottom: 0;
        border-bottom: 0;
      }
      .story-kicker {
        color: var(--accent-dark);
        font: 700 0.74rem var(--sans);
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }
      .story-meta,
      .meta {
        color: var(--muted);
        font: 600 0.88rem var(--sans);
      }
      .pill {
        display: inline-flex;
        width: fit-content;
        padding: 7px 12px;
        border-radius: 999px;
        background: #efe6d1;
        color: var(--accent-dark);
        font: 700 0.82rem var(--sans);
        letter-spacing: 0.05em;
      }
      .pill.warn { background: #f6e6c8; color: var(--warning); }
      .pill.danger { background: #f3d7d7; color: var(--danger); }
      .section-heading {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--border);
      }
      .section-heading p {
        color: var(--muted);
        font-size: 0.97rem;
      }
      .article-card {
        display: grid;
        gap: 14px;
        align-content: start;
      }
      .article-card h2 {
        font-size: 1.7rem;
      }
      .article-card p { font-size: 1rem; }
      .article-shell {
        display: grid;
        gap: 28px;
      }
      .article-layout {
        display: grid;
        grid-template-columns: minmax(0, 1.75fr) minmax(260px, 0.75fr);
        gap: 24px;
        align-items: start;
      }
      .article-body {
        display: grid;
        gap: 22px;
      }
      .article-body .card p,
      .article-copy p {
        font-size: 1.08rem;
        line-height: 1.9;
      }
      .article-copy {
        display: grid;
        gap: 18px;
      }
      .article-paywall-shell.is-empty {
        min-height: 0;
        padding: 0;
        border: 0;
        background: transparent;
        box-shadow: none;
      }
      .article-aside {
        position: sticky;
        top: 18px;
        display: grid;
        gap: 18px;
      }
      .quote-panel {
        padding: 18px;
        border-left: 4px solid var(--accent);
        background: var(--panel-strong);
        border-radius: 18px;
      }
      .quote-panel p {
        font-size: 1.02rem;
        line-height: 1.72;
      }
      .wall-slot {
        min-height: 160px;
        border: 2px dashed rgba(138, 90, 31, 0.34);
        border-radius: 20px;
        padding: 20px;
        background: linear-gradient(180deg, rgba(238, 224, 197, 0.5), rgba(255, 248, 235, 0.75));
      }
      .wall-slot strong {
        font-family: var(--sans);
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .market-panel {
        display: grid;
        gap: 12px;
      }
      .market-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--border);
        font: 700 0.9rem var(--sans);
      }
      .market-row:last-child { border-bottom: 0; padding-bottom: 0; }
      .market-row small { color: var(--muted); font-weight: 600; }
      pre {
        margin: 0;
        padding: 16px;
        background: #17120d;
        color: #f8efdd;
        border-radius: 18px;
        overflow-x: auto;
        font: 0.85rem/1.6 var(--mono);
      }
      code { font-family: var(--mono); }
      ul, ol {
        margin: 0;
        padding-left: 20px;
        line-height: 1.8;
      }
      .footer-note {
        margin-top: 24px;
        color: var(--muted);
        font: 600 0.82rem var(--sans);
        text-align: center;
      }
      .saml-hint-panel {
        max-width: min(680px, 100%);
      }
      .saml-hint-form {
        display: grid;
        gap: 10px;
      }
      .saml-hint-input {
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid var(--border-strong);
        font: inherit;
        max-width: 24rem;
        background: #fff;
        color: var(--text);
      }
      .muted-link {
        color: var(--muted);
        text-decoration: none;
      }

      @media (max-width: 980px) {
        .grid.two,
        .grid.three,
        .feature-grid,
        .article-layout {
          grid-template-columns: 1fr;
        }
        .article-aside { position: static; }
        .masthead-top {
          flex-direction: column;
          align-items: stretch;
        }
        .brand-block { text-align: left; }
        .masthead-utility { justify-content: flex-start; }
      }

      @media (max-width: 640px) {
        .shell { padding: 0 0 44px; }
        .site-frame {
          border-radius: 0;
          border-left: 0;
          border-right: 0;
        }
        .masthead,
        .content-shell { padding-left: 16px; padding-right: 16px; }
        .market-tape { padding-left: 16px; padding-right: 16px; }
        h1 { max-width: none; }
        .nav-bar { justify-content: flex-start; }
      }
    </style>
    ${browserSdkScript}
  </head>
  <body>
    <div class="shell">
      <div class="site-frame">
        <div class="market-tape">
          <span><strong>DXY</strong> steady as rates remain restrictive</span>
          <span><strong>Private Credit</strong> covenant scrutiny returning</span>
          <span><strong>Deal Flow</strong> sponsors waiting for cleaner exits</span>
        </div>
        <header class="masthead">
          <div class="masthead-top">
            <div>
              <div class="edition-note">European edition</div>
              <a class="muted-link" href="/setup-guide">SSO and paywall configuration notes</a>
            </div>
            <div class="brand-block">
              <div class="brand-mark">Ledger Chronicle</div>
              <div class="brand-kicker">Institutional finance, policy and capital markets</div>
            </div>
            <div class="masthead-utility">
              <a class="button secondary" href="/articles">Latest coverage</a>
            </div>
          </div>
          <nav class="nav-bar" aria-label="Primary">
            <a href="/">Front Page</a>
            <a href="/articles">Markets</a>
            <a href="/protected">Subscriber Briefing</a>
            <a href="/setup-guide">Operations</a>
          </nav>
        </header>
        <main class="content-shell">
          ${options.body}
          <p class="footer-note">Zephr CDN API: ${escapeForHtml(options.zephrPublicBaseUrl ?? 'not configured')} · Browser runtime: ${escapeForHtml(options.zephrBrowserEnabled ? '@zephr/browser (bundled)' : 'disabled')}</p>
        </main>
      </div>
    </div>
    <script>
      window.__APP_STATE__ = ${serializedState};
      window.__ZEPHR_PUBLIC_BASE_URL__ = ${JSON.stringify(options.zephrPublicBaseUrl ?? null)};
      window.__ZEPHR_BROWSER_DEBUG__ = ${JSON.stringify(options.zephrBrowserDebug ?? false)};

      function writeJson(id, value) {
        var el = document.getElementById(id);
        if (!el) return;
        el.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
      }

      function runZephrBrowser() {
        if (!window.__ZEPHR_PUBLIC_BASE_URL__) {
          writeJson('browser-sdk-status', {
            available: false,
            message: 'Set ZEPHR_PUBLIC_BASE_URL to enable the bundled @zephr/browser runtime.'
          });
          return;
        }

        if (!window.zephrBrowser || typeof window.zephrBrowser.run !== 'function') {
          writeJson('browser-sdk-status', {
            available: false,
            message: '@zephr/browser was not found. Confirm /assets/zephr-browser/zephr-browser.umd.js is being served.'
          });
          return;
        }

        window.zephrBrowser.run({
          cdnApi: window.__ZEPHR_PUBLIC_BASE_URL__,
          debug: Boolean(window.__ZEPHR_BROWSER_DEBUG__)
        }).catch(function(error) {
          writeJson('browser-sdk-status', {
            available: false,
            message: 'zephrBrowser.run() failed.',
            error: String(error)
          });
        });
      }

      window.addEventListener('zephr.browserDecisionsFinished', function() {
        writeJson('browser-sdk-status', {
          available: true,
          message: '@zephr/browser finished evaluating page features.',
          cdnApi: window.__ZEPHR_PUBLIC_BASE_URL__
        });
        writeJson('browser-access', window.Zephr && window.Zephr.accessDetails ? window.Zephr.accessDetails : { message: 'No Zephr access details were published for this page.' });
        writeJson('browser-outcomes', window.Zephr && window.Zephr.outcomes ? window.Zephr.outcomes : { message: 'No Zephr outcomes were published for this page.' });
      });

      window.addEventListener('load', runZephrBrowser);
    </script>
  </body>
</html>`;
}
