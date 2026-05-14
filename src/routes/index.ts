import { Router } from 'express';
import type { AppConfig } from '../config.js';
import { demoArticles, findDemoArticle } from '../lib/content/articles.js';
import { renderArticlePage, renderArticlesIndexPage, renderHomePage, renderProtectedPage, renderSetupGuidePage } from '../views/pages.js';

export function createIndexRouter(config: AppConfig) {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), samlMode: config.saml.mode, zephrMode: config.zephr.mode });
  });

  router.get('/', (req, res) => {
    res.type('html').send(renderHomePage(config, req.session.auth));
  });

  router.get('/protected', (req, res) => {
    res.type('html').send(renderProtectedPage(config, req.session.auth));
  });

  router.get('/articles', (req, res) => {
    res.type('html').send(renderArticlesIndexPage(config, demoArticles, req.session.auth));
  });

  router.get('/articles/:slug', (req, res) => {
    const article = findDemoArticle(req.params.slug);
    if (!article) {
      return res.status(404).type('html').send('<h1>Article not found</h1>');
    }

    res.type('html').send(renderArticlePage(config, article, req.session.auth));
  });

  router.get('/setup-guide', (_req, res) => {
    res.type('html').send(renderSetupGuidePage(config));
  });

  router.get('/me', (req, res) => {
    res.json({
      isAuthenticated: Boolean(req.session.auth?.isAuthenticated),
      auth: req.session.auth ?? null,
      modes: {
        saml: config.saml.mode,
        zephr: config.zephr.mode
      }
    });
  });

  return router;
}
