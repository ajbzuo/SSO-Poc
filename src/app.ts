import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { appConfig, type AppConfig } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createAuthRouter } from './routes/auth.js';
import { createIndexRouter } from './routes/index.js';
import { createSamlStrategy } from './lib/saml/service.js';
import { createZephrClient, type ZephrClient } from './lib/zephr/client.js';

export interface AppDependencies {
  config: AppConfig;
  zephrClient: ZephrClient;
}

export function createApp(overrides?: Partial<AppDependencies>) {
  const config = overrides?.config ?? appConfig;
  const zephrClient = overrides?.zephrClient ?? createZephrClient(config.zephr);

  passport.use('saml', createSamlStrategy(config));

  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  const zephrBrowserDistPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    '../node_modules/@zephr/browser/dist'
  );
  app.use('/assets/zephr-browser', express.static(zephrBrowserDistPath));
  app.use(
    session({
      name: 'zephr_saml_poc',
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: config.isProduction,
        maxAge: 1000 * 60 * 60 * 4
      }
    })
  );
  app.use(passport.initialize());

  app.use(createAuthRouter(config, zephrClient));
  app.use(createIndexRouter(config));
  app.use(errorHandler);

  return app;
}
