import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import passport from 'passport';
import type { AppConfig } from '../config.js';
import { clearAuthState, completeSamlLogin } from '../lib/auth/bridge.js';
import { extractForwardedIdpLoginParams } from '../lib/auth/samlIdpHints.js';
import { consumeRelayStateToken, createRelayStateToken, normalizeReturnTo } from '../lib/auth/relayState.js';
import type { RawSamlProfile } from '../lib/saml/types.js';
import type { ZephrClient } from '../lib/zephr/client.js';

function clearZephrCookies(res: Response, config: AppConfig) {
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: config.isProduction,
    path: '/'
  };

  res.clearCookie('blaize_session', cookieOptions);
  res.clearCookie('zephr_sso', cookieOptions);

  if (config.zephr.sessionCookieDomain) {
    res.clearCookie('blaize_session', { ...cookieOptions, domain: config.zephr.sessionCookieDomain });
    res.clearCookie('zephr_sso', { ...cookieOptions, domain: config.zephr.sessionCookieDomain });
  }
}

function isPopupRequest(value: unknown): boolean {
  return value === '1' || value === 'true' || value === 'yes';
}

function originFromBaseUrl(baseUrl: string) {
  return new URL(baseUrl).origin;
}

function renderPopupBridgeResult(config: AppConfig, params: { success: boolean; redirectTo: string; reason?: string }) {
  const payload = JSON.stringify({
    type: 'zephr-sso-result',
    success: params.success,
    redirectTo: params.redirectTo,
    reason: params.reason ?? null
  });

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${params.success ? 'Sign-in complete' : 'Access check required'}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="font-family:system-ui,sans-serif;padding:24px;line-height:1.5;">
    <p>${params.success ? 'Sign-in complete. You can close this window.' : 'Your sign-in completed, but this account still needs a different site flow. You can close this window.'}</p>
    <p><a href="${params.redirectTo}">Continue</a></p>
    <script>
      (function () {
        var payload = ${payload};
        try {
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage(payload, ${JSON.stringify(originFromBaseUrl(config.appBaseUrl))});
            window.close();
            return;
          }
        } catch (error) {
          console.error(error);
        }
        window.location.replace(payload.redirectTo);
      })();
    </script>
  </body>
</html>`;
}

function renderDeniedPage(reason: string, returnTo: string) {
  const title = reason === 'missing-user' ? 'No matching Zephr user was found' : 'This Zephr account does not have an active grant';
  const message =
    reason === 'missing-user'
      ? 'Your organisation SSO login succeeded, but this email was not found in Zephr. Send the user to the alternate registration or account-linking journey from here.'
      : 'Your organisation SSO login succeeded, but the matching Zephr user does not currently have an active grant for this experience.';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="font-family:system-ui,sans-serif;max-width:760px;margin:0 auto;padding:48px 20px;line-height:1.6;">
    <p style="font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#5f6d64;">Enterprise SSO result</p>
    <h1 style="font-size:2.2rem;line-height:1.1;margin:0 0 12px;">${title}</h1>
    <p style="margin:0 0 20px;">${message}</p>
    <p style="margin:0 0 20px;">This is the branch where you would send the user to your alternate login, registration, subscription, or access-request page.</p>
    <p><a href="${returnTo}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#175f48;color:#fff;text-decoration:none;font-weight:700;">Return to article</a></p>
  </body>
</html>`;
}

export function createAuthRouter(config: AppConfig, zephrClient: ZephrClient) {
  const router = Router();

  router.get('/auth/saml/login', (req, res, next) => {
    const returnTo = normalizeReturnTo(req.query.returnTo, config.defaultRedirectUrl);
    const popup = isPopupRequest(req.query.popup);
    const { token, nextSession } = createRelayStateToken(req.session.relayState, returnTo, popup);
    req.session.relayState = nextSession;

    const idpHints = extractForwardedIdpLoginParams(req.query);
    const additionalParams: Record<string, string> = { RelayState: token, ...idpHints };

    passport.authenticate('saml', {
      session: false,
      additionalParams
    } as never)(req, res, next);
  });

  router.post('/auth/saml/acs', (req, res, next) => {
    passport.authenticate('saml', { session: false }, async (error: unknown, profile: Record<string, unknown> | false) => {
      try {
        if (error) {
          throw error;
        }

        if (!profile) {
          throw new Error('No SAML profile was returned by the IdP callback.');
        }

        const relayState = consumeRelayStateToken(req.session.relayState, req.body?.RelayState, config.defaultRedirectUrl);
        req.session.relayState = relayState.nextSession;

        const result = await completeSamlLogin({
          profile: profile as RawSamlProfile,
          zephrClient,
          requiredGrantIds: config.zephr.requiredGrantIds,
          requiredProductIds: config.zephr.requiredProductIds
        });

        if (result.status === 'granted') {
          req.session.auth = result.authState;
          if (relayState.popup) {
            return res.type('html').send(renderPopupBridgeResult(config, { success: true, redirectTo: relayState.returnTo }));
          }

          return res.redirect(relayState.returnTo);
        }

        req.session.auth = clearAuthState();
        const deniedUrl = `/auth/access-denied?reason=${encodeURIComponent(result.status)}&returnTo=${encodeURIComponent(relayState.returnTo)}`;
        if (relayState.popup) {
          return res.type('html').send(
            renderPopupBridgeResult(config, {
              success: false,
              redirectTo: deniedUrl,
              reason: result.status
            })
          );
        }

        return res.redirect(deniedUrl);
      } catch (acsError) {
        console.error('[auth][acs]', acsError);
        next(acsError);
      }
    })(req, res, next);
  });

  router.get('/auth/access-denied', (req, res) => {
    const reason = typeof req.query.reason === 'string' ? req.query.reason : 'missing-grant';
    const returnTo = normalizeReturnTo(req.query.returnTo, config.defaultRedirectUrl);
    res.type('html').send(renderDeniedPage(reason, returnTo));
  });

  router.post('/auth/logout', async (req, res, next) => {
    try {
      clearZephrCookies(res, config);
      req.session.auth = clearAuthState();
      req.session.relayState = {};
      req.session.destroy(() => {
        res.redirect('/');
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
