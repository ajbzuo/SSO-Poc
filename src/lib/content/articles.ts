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
  },
  {
    slug: 'european-banks-are-learning-to-love-deposit-beta-again',
    title: 'European banks are learning to love deposit beta again',
    dek: 'Margin management now depends less on headline rate moves and more on how quickly institutions can defend funding franchises without losing customers.',
    category: 'Banking',
    author: 'Oliver Saint',
    readTime: '6 min read',
    teaser: [
      'For years, deposit pricing looked like a footnote in bank earnings calls. Abundant liquidity, weak loan demand and compressed rates meant management teams could speak confidently about customer stickiness without being forced to prove how resilient it really was.',
      'That confidence is being tested now. Competition for cash is sharper, product teams are more alert to customer switching behaviour, and analysts are increasingly interested in the spread between the cost of funding and the pace at which deposit books are repriced.'
    ],
    premium: [
      'Banks that manage this transition well are treating deposit beta as a strategic variable rather than a passive market outcome. They are segmenting customers more carefully, using product architecture to retain primary relationships and investing in better real-time data about rate sensitivity across retail and commercial books.',
      'The institutions under the most pressure are those that assumed convenience alone would preserve margin. In the current environment, convenience still matters, but so do transparency, digital servicing quality and the ability to defend value without reaching automatically for the highest promotional rate on the shelf.'
    ]
  },
  {
    slug: 'brussels-is-testing-how-far-it-can-push-market-infrastructure-reform',
    title: 'Brussels is testing how far it can push market infrastructure reform',
    dek: 'Clearing policy, supervision and strategic autonomy are colliding again as policymakers revisit what they want European capital markets to look like.',
    category: 'Regulation',
    author: 'Clara Venn',
    readTime: '8 min read',
    teaser: [
      'European policymakers have spent years saying they want deeper capital markets, more strategic resilience and less dependence on systems they do not control. The challenge has never been rhetorical ambition. It has been choosing which pieces of market infrastructure can realistically be reshaped without damaging liquidity or fragmenting existing risk management frameworks.',
      'That debate is returning with more urgency. Clearing, post-trade policy and supervisory cooperation are once again on the table, and market participants are being forced to think about how much operational change they can absorb in pursuit of a more autonomous regional market structure.'
    ],
    premium: [
      'The core tension is familiar: reformers want resilience and local capability, while market users want continuity, scale and low-friction risk transfer. Any serious shift in clearing behaviour must persuade banks, asset managers and end users that resilience gains outweigh the operational and capital costs of moving business or duplicating infrastructure.',
      'That is why this phase of reform is likely to be judged not by the boldness of legislative language but by whether authorities can create incentives that change behaviour gradually enough to preserve confidence. Market structure rarely adapts well to symbolic policy alone.'
    ]
  },
  {
    slug: 'fund-managers-are-repricing-esg-promises-around-cash-flow-and-evidence',
    title: 'Fund managers are repricing ESG promises around cash flow and evidence',
    dek: 'The sustainability pitch is not disappearing, but institutional buyers are demanding harder links between thematic claims and portfolio outcomes.',
    category: 'Sustainable Finance',
    author: 'Harriet Ng',
    readTime: '7 min read',
    teaser: [
      'The most noticeable change in sustainable finance is not that managers talk less about climate, transition or stewardship. It is that they talk differently. Institutional investors still care about those themes, but they are asking more forcefully how sustainability narratives connect to pricing power, operational resilience and the shape of real cash flows.',
      'That has made generic marketing language less useful. Fundraising conversations now move quickly from broad principle to specific implementation: data quality, governance, downside scenarios and the mechanisms through which a sustainability angle is supposed to improve risk-adjusted returns.'
    ],
    premium: [
      'For managers, this is forcing a welcome discipline. Strategies that were built on deep sector work and credible engagement frameworks can still defend themselves. Strategies that relied too heavily on benchmark-relative labelling or vague transition stories are finding that allocators want more evidence before they commit long-duration capital.',
      'The result may be a healthier market. Sustainability investing is becoming harder to package lazily and easier to evaluate on operational merit. That does not reduce political noise around the theme, but it does improve the odds that capital is allocated on a clearer economic basis.'
    ]
  },
  {
    slug: 'foreign-exchange-desks-are-relearning-the-cost-of-complacency',
    title: 'Foreign-exchange desks are relearning the cost of complacency',
    dek: 'Corporate and institutional hedging programmes that looked routine in calmer markets are being stress-tested by policy divergence and sharper event risk.',
    category: 'Foreign Exchange',
    author: 'Sophie Laurent',
    readTime: '6 min read',
    teaser: [
      'FX volatility no longer needs a full-scale crisis to reappear. A combination of policy divergence, trade uncertainty and fragile positioning can create rapid repricing even when macro data looks only modestly surprising. That has made many treasury and portfolio hedging programmes feel thinner than they did on paper six months earlier.',
      'The issue is not that firms have forgotten to hedge. It is that some have not revisited whether their hedging cadence, governance and trigger thresholds still match the speed of the market they are operating in.'
    ],
    premium: [
      'The stronger desks are responding by tightening communication between treasury, macro strategy and business units with real currency exposure. They want faster escalation when positions drift, cleaner understanding of what is genuinely hedged economically, and a better sense of how market liquidity behaves around major event windows.',
      'That does not mean hedging more for its own sake. It means recognising that the cost of underreacting can be just as real as the cost of overpaying for protection, especially when boards and investors are less tolerant of “temporary” FX surprises bleeding into earnings quality.'
    ]
  },
  {
    slug: 'elite-law-firms-are-building-finance-advisory-muscle-inside-partnership-models',
    title: 'Elite law firms are building finance advisory muscle inside partnership models',
    dek: 'Clients want counsel that can navigate restructuring, capital raising and regulatory friction as one joined-up financing problem rather than three separate mandates.',
    category: 'Professional Services',
    author: 'James Hatherley',
    readTime: '7 min read',
    teaser: [
      'Large law firms have always sold judgement, but the content of that judgement is changing. Clients no longer want financing advice split neatly into legal execution, sponsor dialogue and regulatory interpretation if the commercial problem requires all three at once.',
      'That is pushing leading firms to build advisory depth around sectors, capital structures and balance-sheet events in ways that start to resemble strategic finance boutiques more than traditional siloed legal teams.'
    ],
    premium: [
      'The shift is especially visible in complex liability management, sponsor-backed refinancing and cross-border restructuring work. Clients want external advisers who understand documentation, yes, but also the capital market context in which documentation is being negotiated. That changes team shape, hiring priorities and even how firms think about partner economics.',
      'The winners are likely to be firms that can remain technically rigorous while speaking more fluently to boards, CFOs and investment committees. In effect, they are becoming more commercially literate without abandoning the precision that made them trusted in the first place.'
    ]
  },
  {
    slug: 'payments-groups-are-turning-fraud-control-into-a-revenue-discipline',
    title: 'Payments groups are turning fraud control into a revenue discipline',
    dek: 'The conversation has moved beyond loss prevention and toward what transaction trust does for conversion, client retention and scheme economics.',
    category: 'Payments',
    author: 'Ritika Sen',
    readTime: '5 min read',
    teaser: [
      'Fraud used to be discussed mostly as a defensive line item: an unfortunate but manageable cost of doing business at scale. That framing is too narrow now. In digital payments, the quality of fraud controls directly influences approval rates, merchant confidence and the willingness of clients to expand into new channels or geographies.',
      'As a result, payments companies are increasingly talking about trust architecture as part of growth rather than merely compliance.'
    ],
    premium: [
      'The firms that are ahead are the ones investing in adaptive controls that can reduce abuse without poisoning the customer experience. That requires close cooperation between risk, product and commercial teams, because every tighter control can also create friction at the point of purchase if it is deployed too bluntly.',
      'Done well, however, fraud management stops being a back-office insurance policy and becomes part of the commercial proposition. Merchants pay attention when a payments partner can both lower losses and improve conversion consistency across difficult cohorts.'
    ]
  },
  {
    slug: 'commercial-real-estate-credit-is-becoming-a-market-for-patient-specialists',
    title: 'Commercial real-estate credit is becoming a market for patient specialists',
    dek: 'Refinancing pressure has not vanished, but lenders with asset-level conviction are finding selective opportunities where broad market appetite remains weak.',
    category: 'Real Estate',
    author: 'Tomás Bell',
    readTime: '8 min read',
    teaser: [
      'Commercial real estate is still one of the easiest sectors to oversimplify. On the one hand sit the apocalyptic narratives of empty buildings and broken refinancing chains. On the other sit optimistic claims that falling activity has created a universal buyer’s market. Neither description is good enough for lenders trying to allocate risk today.',
      'What matters is asset specificity: location, tenancy quality, capital expenditure requirements and the sponsor’s capacity to manage through weaker liquidity windows.'
    ],
    premium: [
      'Specialist credit providers are increasingly comfortable stepping into situations that generalists avoid, but only when they can underwrite the property and the sponsor in detail. That means the spread opportunity is real, though it comes with a meaningful requirement for operational expertise and patience.',
      'The market therefore rewards selectivity rather than bravery. Capital is available for real-estate credit, but it is flowing to managers and lenders who can prove they understand the difference between temporary refinancing stress and structural impairment in the asset itself.'
    ]
  },
  {
    slug: 'sovereign-borrowers-are-rethinking-how-they-stage-hard-currency-issuance',
    title: 'Sovereign borrowers are rethinking how they stage hard-currency issuance',
    dek: 'Timing windows, order-book quality and policy narrative are being managed more carefully as treasury teams try to minimise execution risk.',
    category: 'Sovereign Debt',
    author: 'Elias Morgan',
    readTime: '6 min read',
    teaser: [
      'For sovereign issuers, the mechanics of borrowing can become political very quickly. A poorly timed transaction is not just a funding headache; it can become a public signal about market confidence, fiscal credibility or policy coherence.',
      'That is why many sovereign debt offices are refining how they prepare hard-currency issuance, with more emphasis on pre-sounding, investor education and the composition of the book rather than simply hitting the first apparently open market window.'
    ],
    premium: [
      'Execution quality now depends on narrative discipline as much as market access. Investors want clarity on funding needs, reform credibility and macro contingencies, especially when global rates remain restrictive and external risk appetite is uneven.',
      'The strongest issuers are those that treat issuance planning as part of a broader investor-relations strategy. They are not just placing bonds; they are managing the state’s reputation as a repeat borrower in a more skeptical market.'
    ]
  },
  {
    slug: 'hedge-fund-allocators-are-paying-again-for-drawdown-intelligence',
    title: 'Hedge-fund allocators are paying again for drawdown intelligence',
    dek: 'The appetite for differentiated managers is returning, but only where they can explain how they behave when volatility arrives in the wrong part of the market.',
    category: 'Hedge Funds',
    author: 'Rosa Ibáñez',
    readTime: '7 min read',
    teaser: [
      'After a period in which some allocators questioned whether expensive active risk still deserved its seat, hedge-fund selection is becoming more nuanced again. Investors are not simply rewarding past performance. They are looking for evidence that a manager understands the character of losses as much as the shape of gains.',
      'That focus on drawdown behaviour reflects a broader truth: diversification claims only matter if they survive awkward market conditions.'
    ],
    premium: [
      'Managers that can articulate their stress response with precision have a clear advantage. Allocators want to know what happens when liquidity evaporates, crowded themes unwind or macro correlations flip suddenly. The discussion is less about charisma and more about the internal operating model behind the risk book.',
      'This is good news for specialist firms with real process discipline. It is harder for managers to sell vague “uncorrelated alpha” language when investors now expect a much more grounded explanation of how the strategy earns its right to coexist with traditional assets.'
    ]
  },
  {
    slug: 'commodity-traders-are-rebuilding-working-capital-buffers-for-a-harder-cycle',
    title: 'Commodity traders are rebuilding working-capital buffers for a harder cycle',
    dek: 'Funding logistics, collateral calls and inventory discipline are back at the centre of strategy as margins normalise.',
    category: 'Commodities',
    author: 'Aaron Petrov',
    readTime: '6 min read',
    teaser: [
      'The years of extreme dislocation in commodity markets rewarded speed, optionality and access to balance sheet. But those same periods also reminded trading houses how quickly logistics, financing and collateral demands can overwhelm commercial conviction if internal funding discipline is weak.',
      'As volatility normalises, many firms are using the calmer period to rebuild working-capital buffers and rethink how aggressively they run inventory and counterparty exposures.'
    ],
    premium: [
      'This is less glamorous than directional trading, but it may prove more important over the next cycle. Firms that can fund logistics reliably, meet collateral calls without strategic panic and preserve flexibility around storage and transport will have more room to lean into dislocation when it reappears.',
      'In other words, resilience itself becomes part of competitive edge. The strongest traders are often not the ones forecasting perfectly, but the ones still able to act decisively after everyone else has used up their room for error.'
    ]
  },
  {
    slug: 'equity-capital-markets-teams-are-learning-to-love-boring-ipos',
    title: 'Equity capital markets teams are learning to love boring IPOs',
    dek: 'Steadier books, simpler stories and more realistic valuations are proving more durable than theatrical listings built on scarcity alone.',
    category: 'ECM',
    author: 'Phoebe Warren',
    readTime: '5 min read',
    teaser: [
      'The market does not lack companies that want to list. It lacks a universal appetite for storytelling that outruns evidence. That is why many ECM teams have become more accepting of what once might have seemed underwhelming transactions: simpler equity stories, less dramatic valuation ambitions and investor bases built on confidence rather than excitement.',
      'Boring, in this context, is often a compliment. It means the issuer can explain its cash generation, the book can be built with fewer heroic assumptions and the aftermarket does not depend entirely on scarcity theatre.'
    ],
    premium: [
      'For bankers, this creates a different kind of execution challenge. The work becomes less about manufacturing intensity and more about calibrating valuation, investor mix and disclosure discipline so the deal has room to trade like a public company rather than a short-lived event.',
      'For issuers, the message is equally practical: if you want stability after listing, you usually need to sacrifice some ambition before it. The most durable IPOs in this environment may be the ones that feel almost unfashionably straightforward at launch.'
    ]
  },
  {
    slug: 'restructuring-advisers-are-spending-more-time-on-liability-management-before-distress',
    title: 'Restructuring advisers are spending more time on liability management before distress becomes public',
    dek: 'The best mandates increasingly begin before the borrower is obviously broken, when optionality still exists and stakeholder management can change the outcome.',
    category: 'Restructuring',
    author: 'Victor Ames',
    readTime: '7 min read',
    teaser: [
      'Liability management used to sit in the market imagination somewhere between technical clean-up and emergency surgery. That view is outdated. Many of the most important mandates now begin earlier, when management teams still have strategic options and the core question is how to preserve them before refinancing stress hardens into a full credibility crisis.',
      'That earlier start is changing the adviser toolkit. Communication planning, lender mapping and covenant analysis are all happening sooner, often alongside broader capital structure reviews that would once have been considered too defensive for healthy companies.'
    ],
    premium: [
      'The benefit of moving earlier is not cosmetic. It gives borrowers more chance to shape negotiations instead of reacting to them. It also lets boards understand the trade-offs between maturity extension, asset sales, amend-and-extend discussions and more formal restructuring paths before time pressure narrows the field.',
      'Advisers that thrive in this environment are the ones comfortable blending technical credibility with a boardroom mindset. They are not just solving documents; they are helping companies navigate when, how and with whom to confront a worsening capital structure problem.'
    ]
  },
  {
    slug: 'wealth-platforms-are-repricing-advice-around-trust-not-just-scale',
    title: 'Wealth platforms are repricing advice around trust, not just scale',
    dek: 'In a market crowded with technology and low-cost distribution, the ability to hold client confidence through uncertainty is becoming easier to monetise.',
    category: 'Wealth Management',
    author: 'Isabelle Drew',
    readTime: '6 min read',
    teaser: [
      'Scale remains powerful in wealth management, but it no longer explains enough on its own. Clients can access low-cost portfolios and polished digital interfaces almost anywhere. What they still struggle to buy consistently is trusted judgement that holds up when markets, tax policy or family circumstances become genuinely uncertain.',
      'That gap is encouraging firms to rethink how they price advice, service models and relationship depth.'
    ],
    premium: [
      'The most sophisticated platforms are moving away from treating advice as a loss leader for product distribution. Instead, they are articulating the value of planning, behavioural support and complex execution more explicitly. That can support better margins, but only if the service really is differentiated in the moments clients feel most exposed.',
      'This is where trust becomes economic. If a firm can keep a client committed through volatility, intergenerational change or liquidity stress, it preserves not just assets but the long-term durability of the franchise. Advice stops being an accessory and becomes part of the balance sheet story.'
    ]
  },
  {
    slug: 'reinsurers-are-pushing-for-stricter-clarity-on-climate-exposed-risk',
    title: 'Reinsurers are pushing for stricter clarity on climate-exposed risk',
    dek: 'Pricing conversations are hardening as capital providers ask for better disclosure, better modelling and fewer assumptions disguised as resilience.',
    category: 'Insurance',
    author: 'Catherine Lowe',
    readTime: '6 min read',
    teaser: [
      'Climate-exposed underwriting has become a test of discipline across the insurance chain. Cedants, brokers and capital providers all understand the broad narrative, but translating that narrative into pricing, exclusions and risk appetite remains a moving target.',
      'Reinsurers in particular are demanding more precise disclosure because they are increasingly unwilling to absorb uncertainty that originates in poor data rather than genuine catastrophe risk.'
    ],
    premium: [
      'That pressure is having a healthy effect on the market. More rigorous modelling standards, clearer assumptions around accumulation and sharper product wording can reduce the temptation to treat climate exposure as either an abstract inevitability or a purely political talking point.',
      'But it also raises the bar for primary insurers. They need stronger data infrastructure and more consistent communication if they want access to external capital on acceptable terms. Ambiguity is becoming more expensive.'
    ]
  },
  {
    slug: 'the-battle-for-enterprise-data-budgets-is-moving-into-finance-workflows',
    title: 'The battle for enterprise data budgets is moving into finance workflows',
    dek: 'Vendors increasingly win not by selling dashboards alone, but by embedding themselves into underwriting, compliance and portfolio review processes.',
    category: 'Financial Technology',
    author: 'Rory Meltzer',
    readTime: '5 min read',
    teaser: [
      'Data platforms have spent years promising that better visibility leads naturally to better decisions. Buyers are now asking a harder question: where exactly does the data sit when decisions are actually being made? If the answer is “in a separate dashboard,” the product may be less defensible than the vendor hopes.',
      'That is why competition is shifting toward workflow depth. Finance teams want tools that influence underwriting, compliance, risk review and client reporting directly rather than simply describe them after the fact.'
    ],
    premium: [
      'This changes the economics of enterprise software. Vendors that become part of the operating rhythm of a team can survive price pressure more effectively because removing them becomes operationally painful rather than merely inconvenient.',
      'For buyers, however, the trade-off is clear. Workflow integration can improve consistency and control, but it also increases dependency. Procurement and architecture teams therefore care more about portability, governance and vendor durability than they did when analytics tools were easier to treat as optional overlays.'
    ]
  },
  {
    slug: 'pension-funds-are-becoming-more-explicit-about-what-liquidity-is-for',
    title: 'Pension funds are becoming more explicit about what liquidity is for',
    dek: 'Cash and liquid reserves are no longer discussed purely as drag. They are being framed as strategic tools that support governance and opportunity capture.',
    category: 'Pensions',
    author: 'Gwen Atwell',
    readTime: '6 min read',
    teaser: [
      'Institutional investors often talk about liquidity as a constraint, but that definition hides an important distinction. Liquidity is also a form of choice. In more complex portfolios, the ability to rebalance, meet collateral demands or fund new allocations without forcing sales can be one of the most valuable characteristics an institution possesses.',
      'Pension funds are beginning to speak about that more directly, especially after market episodes that exposed the difference between nominal and usable liquidity.'
    ],
    premium: [
      'This has implications for strategic asset allocation. Holding liquid reserves may reduce expected return in some scenarios, but it can improve governance quality, cut implementation stress and create room to act opportunistically when others are constrained. In effect, liquidity earns its keep by preserving institutional freedom.',
      'The best investment committees are therefore asking not only how much liquidity they hold, but what it is for. That question leads to more honest portfolio design than treating liquidity as a leftover bucket after all the “real” investment decisions have been made.'
    ]
  },
  {
    slug: 'venture-lenders-are-writing-tighter-terms-for-a-more-mature-startup-market',
    title: 'Venture lenders are writing tighter terms for a more mature startup market',
    dek: 'Founders still want flexibility, but lenders now expect clearer paths to revenue durability, governance discipline and downside protection.',
    category: 'Venture Debt',
    author: 'Noah Beltran',
    readTime: '6 min read',
    teaser: [
      'Venture debt has become less forgiving as the startup market itself has matured. Lenders are still willing to support growth businesses, but they are less interested in underwriting aspiration alone. They want clearer visibility on cash generation, governance and the conditions under which existing investors would continue to support the company.',
      'That does not mean the product is retreating. It means the documentation is catching up with a market that now demands more discipline from both founders and financiers.'
    ],
    premium: [
      'For founders, the practical implication is that venture debt now behaves more like a real financing relationship than a tactical top-up. Reporting standards, covenant expectations and board visibility can all be stricter than they were in the era of abundant risk capital.',
      'For lenders, that discipline is essential if the asset class is to remain credible through a broader cycle. The strongest platforms are distinguishing themselves less by speed alone and more by the quality of underwriting and portfolio management they can sustain when growth expectations reset.'
    ]
  },
  {
    slug: 'trade-finance-is-quietly-becoming-a-strategic-product-again',
    title: 'Trade finance is quietly becoming a strategic product again',
    dek: 'As supply chains fragment and working-capital pressure rises, banks and non-bank lenders are rediscovering the value of short-duration, information-rich exposures.',
    category: 'Trade Finance',
    author: 'Mina Qureshi',
    readTime: '5 min read',
    teaser: [
      'Trade finance rarely dominates headlines, but it often reveals where the real economy is under strain. As supply chains reconfigure and inventories become more strategic, the ability to finance goods in motion is becoming more commercially important than it looked during the era of frictionless global logistics.',
      'That is pulling senior attention back toward a product set once treated as mature and operational rather than strategic.'
    ],
    premium: [
      'Banks and specialist lenders like the asset class for a reason: it is short duration, operationally rich and often backed by information that gives lenders a more granular view of commercial behaviour than many larger-ticket credit products can provide.',
      'The challenge is execution. Trade finance only becomes strategically useful when documentation, technology and risk controls are strong enough to support scale without eroding the informational advantage that makes the product attractive in the first place.'
    ]
  },
  {
    slug: 'activist-investors-are-finding-more-leverage-in-capital-allocation-critiques',
    title: 'Activist investors are finding more leverage in capital-allocation critiques',
    dek: 'Operational activism still matters, but boards are proving more sensitive to arguments about balance-sheet discipline and the cost of strategic drift.',
    category: 'Shareholder Strategy',
    author: 'Eleanor Pike',
    readTime: '7 min read',
    teaser: [
      'Activist campaigns have always blended narrative and numbers, but the current market is giving special weight to the latter. Boards are more aware that capital-allocation mistakes can be punished quickly when financing conditions are tighter and investor patience for strategic sprawl is weaker.',
      'That is making balance-sheet arguments unusually potent inside activist playbooks.'
    ],
    premium: [
      'An activist does not need a grand operational manifesto if they can persuasively show that management is underusing cash, mispricing acquisitions or failing to impose return discipline on a mixed portfolio of assets. In a more demanding market, capital allocation itself can become the operational case.',
      'Boards know this, which is why many are trying to get ahead of the critique by clarifying hurdle rates, portfolio logic and disposition discipline before activists force the conversation in public.'
    ]
  },
  {
    slug: 'family-offices-are-becoming-more-institutional-without-wanting-to-look-like-it',
    title: 'Family offices are becoming more institutional without wanting to look like it',
    dek: 'Governance, staffing and manager oversight are hardening, even as many principals continue to prize flexibility and discretion over public-style process.',
    category: 'Family Capital',
    author: 'Sebastian Cole',
    readTime: '6 min read',
    teaser: [
      'Family offices often define themselves against the bureaucracy of larger institutions. Flexibility, speed and discretion are part of the appeal. Yet as portfolios grow more complex and intergenerational questions become sharper, many are quietly building the same kinds of governance structures they once treated as somebody else’s problem.',
      'The interesting part is not that they are becoming more institutional. It is that they are doing so selectively, trying to keep freedom while importing enough process to make that freedom durable.'
    ],
    premium: [
      'This can be seen in manager oversight, co-investment review and succession planning. Family offices are hiring deeper expertise, documenting decision rights more explicitly and demanding better reporting from external partners. None of that means they want to resemble pension funds. It means they want fewer hidden points of fragility.',
      'The best-run groups understand the trade-off clearly. Process is useful when it preserves judgment, not when it replaces it. That is why their operating models often look bespoke even when the underlying controls are becoming much more rigorous.'
    ]
  },
  {
    slug: 'infrastructure-investors-are-repricing-political-risk-after-the-cheap-capital-decade',
    title: 'Infrastructure investors are repricing political risk after the cheap-capital decade',
    dek: 'Assets once sold mainly on stability are being underwritten with a more explicit view of tariff pressure, elections and public patience.',
    category: 'Infrastructure',
    author: 'Helena Costa',
    readTime: '7 min read',
    teaser: [
      'Infrastructure investing long benefited from the assumption that essential assets carried a natural political moat. That assumption has not disappeared, but it has become more conditional. In a higher-rate, more polarized environment, tariff structures, concession terms and public tolerance for price adjustments all deserve closer scrutiny.',
      'Investors are therefore spending more time on political durability, not just engineering resilience.'
    ],
    premium: [
      'This repricing does not make infrastructure unattractive. It makes underwriting more honest. Stable cash flows remain valuable, but they are only as stable as the legal, regulatory and social frameworks that support them.',
      'Firms with deep local knowledge and stronger stakeholder mapping are likely to have an advantage. Political risk is easier to manage when it is treated as a core underwriting variable rather than an appendix to the investment memo.'
    ]
  },
  {
    slug: 'secondaries-buyers-are-getting-pickier-about-what-portfolio-liquidity-is-worth',
    title: 'Secondaries buyers are getting pickier about what portfolio liquidity is worth',
    dek: 'As more sellers come to market for strategic rather than distressed reasons, pricing discipline and asset-level selection are becoming more important.',
    category: 'Private Markets',
    author: 'Julian Marchetti',
    readTime: '6 min read',
    teaser: [
      'The growth of the secondaries market has made liquidity feel more available across private assets, but that does not mean every portfolio sale deserves the same valuation logic. Buyers are becoming more discriminating about why a seller is moving, what quality of assets sits underneath the process and how much future upside is already being priced into the package.',
      'That selectivity reflects maturity, not weakness. The secondaries market is large enough now that buyers can choose where they want to expend their underwriting energy.'
    ],
    premium: [
      'The strongest buyers are increasingly acting like portfolio surgeons rather than liquidity wholesalers. They want to understand asset quality, sponsor behaviour and the dynamics of the seller’s motivation before they decide whether a discount represents opportunity or a warning sign.',
      'That means pricing discipline should remain central even if activity rises. Liquidity in private markets is becoming more normalised, but it is not becoming frictionless.'
    ]
  }
];

export function findDemoArticle(slug: string) {
  return demoArticles.find((article) => article.slug === slug);
}
