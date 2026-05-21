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
    slug: 'private-credit-insurers-and-the-new-balance-sheet-trade',
    title: 'Private credit, insurers, and the new balance-sheet trade reshaping institutional portfolios',
    dek: 'A longform look at why insurers, pension allocators and alternative lenders are building a more durable relationship around duration, yield and control.',
    category: 'Capital Markets',
    author: 'Mara Ellison',
    readTime: '11 min read',
    teaser: [
      'For most of the last decade, institutional investors could describe their fixed-income problem in a single phrase: there was never enough spread to satisfy the liability side of the house. Even when public credit markets were functioning smoothly, insurers and pension plans struggled to find assets that offered enough incremental return without forcing them into an uncomfortable level of liquidity risk or manager complexity.',
      'That equation has changed. Higher policy rates have improved the all-in return profile of many conventional assets, but they have also widened the conversation about what belongs on long-dated balance sheets. Private credit is no longer being discussed purely as a tactical yield enhancer. It is being assessed as a structural allocation that can sit between public corporates, structured credit and bespoke financing relationships.',
      'For insurers, the attraction is not only income. It is the ability to participate in deals that are underwritten with tighter information loops, stronger lender protections and more control over documentation than broadly syndicated markets usually allow. For sponsors and borrowers, the attraction is speed, certainty and a financing partner willing to tailor amortisation, covenant packages and reporting obligations around a real operating plan rather than a standard market template.'
    ],
    premium: [
      'What makes the current moment particularly interesting is that insurers are not approaching private credit as tourists. Many are building or deepening origination partnerships with specialist asset managers, and some are reshaping internal investment committees so private assets are evaluated within the same balance-sheet framework as public income books. The goal is not to chase novelty. It is to find predictable contractual cash flow with a margin for underwriting discipline.',
      'That changes the conversation with managers. A manager pitching to an insurance investor now needs to explain more than raw gross returns. They need to show how a portfolio behaves under stress, where recoveries are likely to come from, how documentation has evolved across vintages, and whether the underwriting team has enough sector depth to identify deteriorating credits before they become restructuring exercises. The best fundraises increasingly feel less like broad asset-class sales and more like detailed operating reviews.',
      'There is also a governance dimension. Insurance investors tend to be more sensitive than many endowments or family offices to the operational plumbing behind a private credit strategy. Valuation methodology, watchlist escalation, servicing capacity and workout resources all matter. In a lower-default environment those questions can seem procedural. In a more uncertain refinancing cycle they become central to whether the headline spread actually compensates for the embedded complexity in the asset.',
      'Borrowers, meanwhile, are discovering that private capital is not simply a substitute for syndicated finance. The most successful relationships are often the ones where the lender understands the sponsor timeline, the regulatory perimeter of the business and the likely exit routes before documents are even marked up. That can support more resilient capital structures, but it also means the lender has a much sharper view of where the real business risks sit. The negotiation is more bespoke, and therefore more exacting.',
      'The strategic question for allocators is whether this remains a cyclical window or becomes a permanent architecture shift. The case for permanence is strengthening. If insurers can consistently pair private credit with robust underwriting standards, transparent servicing and liability-aware portfolio construction, the asset class starts to look less like an opportunistic sleeve and more like a durable balance-sheet instrument. That would reshape competition for deals, fee economics for managers and the role of banks in the financing stack for years to come.'
    ]
  },
  {
    slug: 'boardrooms-prepare-for-a-slower-cleaner-ma-cycle',
    title: 'Boardrooms are preparing for a slower, cleaner M&A cycle where financing certainty matters more than bravado',
    dek: 'Chief financial officers are relearning how to price timing risk, antitrust friction and shareholder patience into every serious transaction conversation.',
    category: 'M&A',
    author: 'Daniel Hsu',
    readTime: '8 min read',
    teaser: [
      'The return of M&A has been forecast so often that many finance leaders have stopped treating market optimism as a signal in itself. What matters now is not whether deals can be announced, but whether they can survive scrutiny from boards, lenders and shareholders who have become more demanding about execution quality.',
      'That is why the current cycle feels different from the exuberant periods that preceded it. Buyers are still willing to pay for scale, distribution and scarce technology, but they are less willing to rely on heroic synergy assumptions or aggressive refinancing hopes. They want transactions that can be defended under multiple funding and macro scenarios, not just under the cleanest one.'
    ],
    premium: [
      'This caution is reshaping the internal sequence of a deal. Financing workstreams are starting earlier, diligence is being used to test downside resilience rather than just value creation, and boards are asking management teams to describe what happens if the market backdrop deteriorates mid-process. In practice, that means treasury, legal and strategy teams are spending more time together before formal announcements are made.',
      'The result is a market that may appear slower on the surface but is arguably healthier beneath it. Transactions that reach signing tend to be built on clearer assumptions, stronger lender engagement and a more explicit understanding of regulatory risk. That does not eliminate failed deals, but it reduces the number of transactions launched on wishful thinking alone.',
      'For advisers and lenders, the message is equally sharp. Their relevance increasingly depends on their ability to reduce uncertainty rather than simply maximise headline ambition. The advisers that win trusted roles are the ones who can tell a board not only how to get a deal done, but also when not to stretch for one.'
    ]
  },
  {
    slug: 'treasurers-are-rebuilding-liquidity-playbooks-after-the-easy-money-era',
    title: 'Corporate treasurers are rebuilding liquidity playbooks after the easy-money era',
    dek: 'The discipline returning to cash forecasting, revolver usage and short-term investment policy says as much about confidence as any earnings guidance update.',
    category: 'Treasury',
    author: 'Nina Farrow',
    readTime: '7 min read',
    teaser: [
      'Treasury departments spent years operating in an environment where excess cash earned very little and revolving facilities were often treated as contingent backstops rather than actively modelled tools. That mindset is fading. As rates, refinancing costs and cash-yield trade-offs have shifted, the treasury function has regained strategic prominence.',
      'The change is visible in small decisions as much as large ones. Forecasting cycles are tighter, intragroup funding assumptions are being challenged more frequently, and boards are asking sharper questions about where liquidity sits, how quickly it can move, and what hidden constraints might emerge under stress.'
    ],
    premium: [
      'This matters because liquidity management is no longer just a defensive exercise. The quality of a treasury operation now influences a company’s ability to act on acquisitions, absorb volatility in working capital and defend its cost of capital narrative with investors. Companies that understand their cash architecture in detail can move faster when opportunities appear, because they know which buffers are real and which are accounting conveniences.',
      'There is also a behavioural shift underway. Treasurers are reassessing the mix between operational cash, strategic reserves and return-seeking short-duration assets. The best teams are not maximising yield indiscriminately; they are calibrating liquidity according to operational cadence, regulatory exposure and the board’s tolerance for complexity. In that sense, the renewed focus on treasury discipline is as much about institutional confidence as it is about market mechanics.'
    ]
  },
  {
    slug: 'inside-the-chief-investment-officers-new-rate-regime-playbook',
    title: 'Inside the chief investment officer’s new-rate-regime playbook',
    dek: 'Higher nominal yields have not simplified portfolio construction. They have made the trade-offs between liquidity, convexity and underwriting quality much harder to ignore.',
    category: 'Asset Allocation',
    author: 'Leah Mercier',
    readTime: '9 min read',
    teaser: [
      'A higher-rate world was supposed to restore simplicity to institutional investing. In theory, allocators could rebuild income through conventional fixed income and reduce their dependence on illiquidity premia. In practice, the opposite has happened: higher yields have clarified just how many portfolio decisions were being masked by the old regime.',
      'Chief investment officers now have more income on offer, but they also have more decisions to make about term risk, liquidity needs and the role of active underwriting. The question is no longer simply whether private assets are worth the lock-up. It is whether each additional unit of complexity is still being paid for after public markets have repriced.'
    ],
    premium: [
      'That has made manager selection more analytical. Allocators are probing what precisely drives excess return, where underwriting edge resides, and how a strategy behaves if exit markets remain selective for longer than expected. The days when a broad promise of illiquidity premium was enough to justify a sleeve are receding. Investors want to know what work the capital is actually doing.',
      'At the same time, portfolio construction conversations are becoming more integrated across asset silos. Private credit, structured assets, liquid credit and hedging overlays are being discussed as interacting tools rather than isolated buckets. The winning playbook is less about choosing a single fashionable asset class and more about understanding the relative price of flexibility. In this regime, optionality has become one of the most expensive assets in the room.'
    ]
  }
];

export function findDemoArticle(slug: string) {
  return demoArticles.find((article) => article.slug === slug);
}
