export interface DemoArticle {
  slug: string;
  title: string;
  dek: string;
  category: string;
  author: string;
  readTime: string;
  teaser: string[];
  premium: string[];
}

export const demoArticles: DemoArticle[] = [
  {
    slug: 'inside-the-saml-zephr-longform-demo',
    title: 'Inside the SAML to Zephr bridge: a longform walkthrough of identity, registration walls, and downstream sessions',
    dek: 'A feature-length demo article designed to feel like a premium publisher experience, with a public opening, a gated middle, and enough depth to test a realistic registration or login wall.',
    category: 'Longform',
    author: 'Platform Features Editor',
    readTime: '12 min read',
    teaser: [
      'The hardest part of explaining a hybrid identity architecture is that most demos are either too abstract or too technical. They show a login button, a JSON payload, and a success message, but they do not show how the experience feels on a real content page where the business actually cares about conversion.',
      'That gap matters. In media, B2B publishing, membership products, and corporate information portals, identity is not just about getting a green checkmark from an authentication library. It is about whether the person on the other side of the screen can move from anonymous browsing into a recognized, entitled relationship without friction or confusion.',
      'This longform article exists to make that visible. It starts like a public-facing feature story, gives an anonymous visitor enough value to understand what is behind the gate, and then creates a clean moment where a Zephr-managed wall can take over while the custom bridge does the trust-heavy work in the background.',
      'In a traditional consumer login flow, a site might own everything: the form, the password check, the session, and the access rules. But many organizations do not operate that way. They already have an enterprise identity provider for employees, partners, group customers, or managed accounts. That upstream identity provider is the source of truth for authentication, yet the site still wants Zephr to remain the source of truth for site-side access, walls, and entitlements.',
      'That is where the bridge pattern becomes useful. Instead of forcing Zephr to be the first system that authenticates the user, the bridge accepts a validated SAML response from the upstream identity provider, translates it into a Zephr-shaped user record, and then establishes the downstream session that the site and Zephr JS can understand.'
    ],
    premium: [
      'Once the bridge receives the assertion consumer service callback, it does not simply trust a bag of attributes and move on. It validates the SAML response according to the configured issuer, audience, timing rules, ACS destination, and response correlation settings. That validation step is what turns the upstream login ceremony into something the downstream site can rely on.',
      'After validation, the bridge extracts a stable subject. In this proof of concept, the preferred source is the SAML NameID or another immutable subject claim. Email is still captured and used, but it is treated as a weaker identifier because email can change over time while an immutable subject is meant to anchor the identity relationship.',
      'That distinction matters for just-in-time provisioning. If the same person appears later with an updated email address but the same immutable external subject, the bridge can still recognize them as the same downstream Zephr user. The result is a safer and more durable mapping model for account continuity, auditability, and entitlement lookups.',
      'The next step is the downstream Zephr decision. This implementation first looks for a matching Zephr user by immutable external subject and then falls back to email only when needed. That keeps the identity mapping stable while still giving the site a practical route to match pre-existing users who may not yet carry the subject as a foreign key.',
      'That separation is deliberate. One of the biggest problems in integration prototypes is that they bake uncertain vendor assumptions directly into route handlers or UI pages. This project keeps the SAML validation, the Zephr lookup, and the final access decision in distinct layers so the user journey can stay stable even while the tenant-specific Zephr contract evolves.',
      'Grant verification is the next piece that makes the experience feel coherent. If the external SAML login succeeds but the matching Zephr account has no active grant, the site should not pretend the user is entitled. It should instead send the user into the alternate access or onboarding path that the business expects.',
      'That is why the bridge does not stop at “the identity provider says yes.” It checks whether the user already exists in Zephr and whether one of the relevant grants is active. Only then does the reading experience unlock on the site.',
      'On the front end, the site remains intentionally CMS-agnostic. There is no assumption that you are using WordPress, Brightspot, or another specific publishing stack. The pages are simple server-rendered HTML, and the Zephr-specific behavior is modeled as stable target containers where Zephr-managed walls or browser features can be attached later through configuration rather than hard-coded form markup.',
      'That is why the article page is structured with a clear public opening and a dedicated gated container. The teaser gives enough narrative context to resemble a true editorial landing experience. The premium section then becomes the point where Zephr can intervene, either with a registration wall, a login wall, or another configured experience that matches your desired journey.',
      'In a real rollout, you would likely go further. You might inspect entitlements from the browser SDK, use a richer article taxonomy, attach different walls to different content types, or distinguish between known-but-not-entitled users and fully anonymous users. But the underlying principle would remain the same: the upstream IdP authenticates, the bridge translates and synchronizes, and Zephr continues to own the audience and access layer for the site.',
      'That is the reason a longform article is a better test bed than a standalone protected route. It lets you evaluate more than just security plumbing. You can see whether the wall appears in the right place, whether the visitor understands what they are unlocking, whether the return path lands them back on the original article, and whether the downstream session is visible to the rest of the site.',
      'If those pieces work together, then the proof of concept has done its job. It has shown not only that a SAML response can be validated, but that the validation can power a believable reading experience where Zephr remains the downstream identity and entitlement layer without owning the primary authentication step.'
    ]
  },
  {
    slug: 'saml-zephr-bridge-explainer',
    title: 'Why a SAML-to-Zephr bridge is useful for B2B media subscriptions',
    dek: 'A proof-of-concept editorial page that shows how upstream enterprise login can still feed a downstream Zephr user and entitlement model.',
    category: 'Identity',
    author: 'Editorial Demo Desk',
    readTime: '4 min read',
    teaser: [
      'Enterprise media teams often already have a primary identity provider for staff, partners, or corporate buyers. That is convenient for sign-in, but it does not automatically solve downstream audience management.',
      'If the site still relies on Zephr for user state, product access, or subscription journeys, the missing piece is the bridge that turns a SAML assertion into a Zephr-recognized user and session.'
    ],
    premium: [
      'In this demo, the SAML IdP remains the authentication authority while Zephr remains the entitlement and wall authority. After the assertion is validated, the bridge maps the upstream subject and attributes into a Zephr-shaped user profile.',
      'That pattern lets the front end keep using Zephr JS and Zephr-managed walls, while the custom server logic stays responsible for trust decisions, just-in-time provisioning, and session synchronization.'
    ]
  },
  {
    slug: 'registration-walls-on-article-pages',
    title: 'How to place a Zephr-managed registration wall on an article page',
    dek: 'A sample article page with a teaser, a premium section, and a dedicated selector that your Zephr admin configuration can target.',
    category: 'Product',
    author: 'Platform Strategy Team',
    readTime: '3 min read',
    teaser: [
      'For a believable demo, article pages should not immediately redirect away. They should show enough public context for anonymous users to understand what they would unlock by registering or logging in.',
      'That is why this proof of concept renders a teaser first, then exposes a stable wall container on the article page for Zephr to control.'
    ],
    premium: [
      'The selector on the demo page is designed to be durable: Zephr can target it with a browser feature, HTML feature, or a configured login or registration journey. The app itself does not hard-code the form.',
      'Once the user authenticates upstream and the bridge has created the downstream Zephr session, the same article URL can render the full body and any client-side Zephr JS checks can observe a signed-in visitor.'
    ]
  }
];

export function findDemoArticle(slug: string) {
  return demoArticles.find((article) => article.slug === slug);
}
