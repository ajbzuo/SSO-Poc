import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import passport from 'passport';
import type { AppConfig } from '../config.js';
import { clearAuthState, completeSamlLogin } from '../lib/auth/bridge.js';
import { extractForwardedIdpLoginParams } from '../lib/auth/samlIdpHints.js';
import { consumeRelayStateToken, createRelayStateToken, normalizeReturnTo } from '../lib/auth/relayState.js';
import { getMockSamlProfile } from '../lib/saml/service.js';
import type { RawSamlProfile } from '../lib/saml/types.js';
import { destroyZephrAuthenticatedSession } from '../lib/zephr/sessions.js';
import type { ZephrClient } from '../lib/zephr/client.js';

function setZephrCookie(res: Response, cookieName: string, cookieValue: string, secure: boolean) {
  res.cookie(cookieName, cookieValue, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/'
  });
}

function clearZephrCookie(res: Response, cookieName: string, secure: boolean) {
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/'
  });
}

export async function performMockLogin(config: AppConfig, zephrClient: ZephrClient, returnTo: unknown) {
  const result = await completeSamlLogin({ profile: getMockSamlProfile(config), zephrClient });

  return {
    authState: result.authState,
    zephrCookie: result.zephrSession.session,
    redirectTo: normalizeReturnTo(returnTo, config.defaultRedirectUrl)
  };
}

async function runMockLogin(req: Request, res: Response, next: NextFunction, config: AppConfig, zephrClient: ZephrClient) {
  try {
    const result = await performMockLogin(config, zephrClient, req.query.returnTo);
    req.session.auth = result.authState;
    setZephrCookie(res, result.zephrCookie.cookieName, result.zephrCookie.cookieValue, config.isProduction);
    res.redirect(result.redirectTo);
  } catch (error) {
    next(error);
  }
}

export function createAuthRouter(config: AppConfig, zephrClient: ZephrClient) {
  const router = Router();

  router.get('/auth/saml/login', async (req, res, next) => {
    if (config.saml.mode === 'mock') {
      return runMockLogin(req, res, next, config, zephrClient);
    }

    const returnTo = normalizeReturnTo(req.query.returnTo, config.defaultRedirectUrl);
    const { token, nextSession } = createRelayStateToken(req.session.relayState, returnTo);
    req.session.relayState = nextSession;

    const idpHints = extractForwardedIdpLoginParams(req.query);
    const additionalParams: Record<string, string> = { RelayState: token, ...idpHints };

    passport.authenticate('saml', {
      session: false,
      additionalParams
    } as any)(req, res, next);
  });

  router.post('/auth/saml/acs', (req, res, next) => {
    if (config.saml.mode === 'mock') {
      return res.status(400).json({ error: 'SAML_MODE=mock uses GET /auth/saml/login directly and does not expect ACS posts.' });
    }

    passport.authenticate('saml', { session: false }, async (error: unknown, profile: RawSamlProfile | false) => {
      try {
        if (error) {
          throw error;
        }

        if (!profile) {
          throw new Error('No SAML profile was returned by the IdP callback.');
        }

        const relayState = consumeRelayStateToken(req.session.relayState, req.body?.RelayState, config.defaultRedirectUrl);
        req.session.relayState = relayState.nextSession;

        const result = await completeSamlLogin({ profile, zephrClient });
        req.session.auth = result.authState;
        setZephrCookie(res, result.zephrSession.session.cookieName, result.zephrSession.session.cookieValue, config.isProduction);
        res.redirect(relayState.returnTo);
      } catch (acsError) {
        console.error('[auth][acs]', acsError);
        next(acsError);
      }
    })(req, res, next);
  });

  router.post('/auth/logout', async (req, res, next) => {
    try {
      const auth = req.session.auth;
      if (auth?.zephrSession?.sessionId) {
        try {
          await destroyZephrAuthenticatedSession(zephrClient, auth.zephrSession.sessionId);
        } catch (error) {
          console.error('[auth][logout][zephr]', error);
        }
        clearZephrCookie(res, auth.zephrSession.cookieName, config.isProduction);
      }

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
