interface RenderDocumentOptions {
  title: string;
  body: string;
  appState: unknown;
  zephrBrowserSdkUrl?: string;
  zephrPublicBaseUrl?: string;
  createAnonymousSession?: boolean;
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
  const browserSdkScript = options.zephrBrowserSdkUrl
    ? `<script defer src="${escapeForHtml(options.zephrBrowserSdkUrl)}"></script>`
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
        --bg: linear-gradient(145deg, #f5f1e8 0%, #ffffff 45%, #eef4f1 100%);
        --panel: rgba(255, 255, 255, 0.9);
        --panel-border: rgba(20, 48, 34, 0.12);
        --text: #143022;
        --muted: #5f6d64;
        --accent: #175f48;
        --accent-soft: #dceee6;
        --warning: #a15b13;
        --danger: #9b2c2c;
        --shadow: 0 22px 60px rgba(20, 48, 34, 0.12);
        --radius: 22px;
      }

      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Georgia, 'Times New Roman', serif;
        background: var(--bg);
        color: var(--text);
      }
      a { color: var(--accent); }
      .shell {
        max-width: 1180px;
        margin: 0 auto;
        padding: 32px 20px 56px;
      }
      .hero {
        display: grid;
        gap: 18px;
        padding: 28px;
        border: 1px solid var(--panel-border);
        border-radius: calc(var(--radius) + 6px);
        background: rgba(255, 255, 255, 0.75);
        box-shadow: var(--shadow);
        backdrop-filter: blur(10px);
      }
      .eyebrow {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: var(--muted);
      }
      h1, h2, h3 {
        margin: 0;
        font-family: 'Avenir Next', 'Segoe UI', sans-serif;
      }
      h1 {
        font-size: clamp(2rem, 4vw, 3.6rem);
        line-height: 0.95;
        max-width: 14ch;
      }
      h2 {
        font-size: 1.35rem;
      }
      p {
        margin: 0;
        line-height: 1.6;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
      .button, button {
        border: 0;
        border-radius: 999px;
        padding: 12px 18px;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
        background: var(--accent);
        color: white;
        text-decoration: none;
      }
      .button.secondary {
        background: var(--accent-soft);
        color: var(--accent);
      }
      .button.warn {
        background: #f5e6cf;
        color: var(--warning);
      }
      .grid {
        display: grid;
        gap: 18px;
        margin-top: 24px;
      }
      @media (min-width: 900px) {
        .grid.two {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      .card {
        background: var(--panel);
        border: 1px solid var(--panel-border);
        border-radius: var(--radius);
        padding: 22px;
        box-shadow: var(--shadow);
      }
      .stack {
        display: grid;
        gap: 12px;
      }
      .pill {
        display: inline-flex;
        width: fit-content;
        padding: 6px 12px;
        border-radius: 999px;
        background: var(--accent-soft);
        color: var(--accent);
        font: 700 0.9rem 'Avenir Next', 'Segoe UI', sans-serif;
      }
      .pill.warn { background: #f5e6cf; color: var(--warning); }
      .pill.danger { background: #f7dede; color: var(--danger); }
      pre {
        margin: 0;
        padding: 16px;
        background: #16251d;
        color: #eff8f3;
        border-radius: 18px;
        overflow-x: auto;
        font-size: 0.88rem;
      }
      code { font-family: 'SFMono-Regular', Consolas, monospace; }
      ul, ol {
        margin: 0;
        padding-left: 20px;
        line-height: 1.7;
      }
      .wall-slot {
        min-height: 140px;
        border: 2px dashed rgba(23, 95, 72, 0.28);
        border-radius: 18px;
        padding: 18px;
        background: rgba(220, 238, 230, 0.35);
      }
      .meta {
        color: var(--muted);
        font-size: 0.95rem;
      }
      .footer-note {
        margin-top: 24px;
        color: var(--muted);
        font-size: 0.92rem;
      }
      .saml-hint-panel {
        margin-top: 18px;
        max-width: min(640px, 100%);
      }
      .saml-hint-panel .saml-hint-form {
        gap: 10px;
      }
      .saml-hint-input {
        padding: 10px 14px;
        border-radius: 12px;
        border: 1px solid var(--panel-border);
        font: inherit;
        max-width: 22rem;
        background: #fff;
        color: var(--text);
      }
    </style>
    ${browserSdkScript}
  </head>
  <body>
    <div class="shell">
      ${options.body}
      <p class="footer-note">Zephr public base URL: ${escapeForHtml(options.zephrPublicBaseUrl ?? 'not configured')} · Browser SDK: ${escapeForHtml(options.zephrBrowserSdkUrl ?? 'not configured')}</p>
    </div>
    <script>
      window.__APP_STATE__ = ${serializedState};
      window.__ZEPHR_PUBLIC_BASE_URL__ = ${JSON.stringify(options.zephrPublicBaseUrl ?? null)};
      window.__ZEPHR_CREATE_ANON_SESSION__ = ${JSON.stringify(options.createAnonymousSession ?? false)};

      function writeJson(id, value) {
        var el = document.getElementById(id);
        if (!el) return;
        el.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
      }

      function renderZephrBrowserState() {
        if (!window.BlaizeSDK) {
          writeJson('browser-sdk-status', { available: false, message: 'BlaizeSDK was not found. Add ZEPHR_BROWSER_SDK_URL when you are ready to load the Zephr CDN/browser runtime.' });
          return;
        }

        function readAccountState() {
          writeJson('browser-sdk-status', {
            available: true,
            message: 'BlaizeSDK loaded successfully for CDN/browser-side Zephr checks.',
            createAnonymousSession: Boolean(window.__ZEPHR_CREATE_ANON_SESSION__)
          });
          window.BlaizeSDK.getAccount(function(error, account) {
            writeJson('browser-account', error ? { error: String(error) } : account);
          });
          window.BlaizeSDK.getProfile(function(error, profile) {
            writeJson('browser-profile', error ? { error: String(error) } : profile);
          });
        }

        if (window.__ZEPHR_CREATE_ANON_SESSION__ && typeof window.BlaizeSDK.getAnonymousSession === 'function') {
          window.BlaizeSDK.getAnonymousSession(function(error, session) {
            writeJson('browser-anon-session', error ? { error: String(error) } : session);
            readAccountState();
          });
          return;
        }

        writeJson('browser-anon-session', { skipped: true, message: 'Anonymous session bootstrap not requested.' });
        readAccountState();
      }

      window.addEventListener('load', renderZephrBrowserState);
    </script>
  </body>
</html>`;
}
