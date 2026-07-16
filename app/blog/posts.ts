export interface PostSection {
  heading?: string;
  paragraphs: string[];
}

export interface Post {
  slug: string;
  title: string;
  standfirst: string;
  category: string;
  pillar: string;
  date: string;
  dateLabel: string;
  readTime: string;
  relatedMechanism?: { id: string; name: string };
  sections: PostSection[];
}

export const posts: Post[] = [
  {
    slug: 'google-business-profile-real-homepage',
    title: 'Your Google Business Profile is your real homepage. Most owners have never opened it.',
    standfirst:
      'For a local business, more customers see your Google profile than your website. Twenty minutes of fixes there outperform most ad budgets. Here is the exact checklist we use.',
    category: 'Playbook',
    pillar: 'Memory',
    date: '2026-07-16',
    dateLabel: 'Jul 16, 2026',
    readTime: '5 min',
    relatedMechanism: { id: 'mental-availability', name: 'Mental Availability' },
    sections: [
      {
        paragraphs: [
          'When someone searches for a dentist, a gym, or an electrician near them, Google shows three local profiles before it shows a single website. Most customers never scroll past them. They compare the three cards, pick one, and call. Your website, the thing you paid for and worry about, was never in the running.',
          'This means the highest-leverage marketing surface you own is one most owners have logged into twice: once to claim it, once to fix the phone number. Everything below takes about twenty minutes and costs nothing.',
        ],
      },
      {
        heading: 'The twenty-minute checklist',
        paragraphs: [
          'Category first. Your primary category is the strongest ranking signal you control, and it must be the most specific one that fits. "Gym" loses to "MMA gym" for every fight-training search in the city. Add every secondary category that honestly applies, and no category that does not.',
          'Photos second. Profiles with real, recent photos get dramatically more calls and direction requests than profiles with a logo and a stock image. Upload the interior, the exterior, the team, the work itself. A customer choosing between three cards picks the one where they can already see themselves inside.',
          'Then the boring fields, because customers notice when they are wrong: hours including holidays, services listed individually with prices where you can, and a description whose first sentence says what you do and for whom, not how long you have proudly served the community.',
          'Finally, seed the Q&A section yourself. Write the ten questions people call to ask, and answer them. Parking, pricing, walk-ins, timings for women, whatever your phone rings about. You are allowed to do this, almost nobody does, and it reads as service rather than marketing.',
        ],
      },
      {
        heading: 'The weekly five minutes',
        paragraphs: [
          'Once the profile is fixed, it needs a pulse. One post a week, one new photo a week, and a reply to every review within two days. Review replies are not for the reviewer. They are read by the next hundred strangers deciding whether you seem like a business that pays attention.',
          'What not to do: never stuff keywords into your business name, and never buy reviews. Both are pattern-detectable, both risk suspension, and a suspended profile is the local equivalent of your shop disappearing from the street.',
        ],
      },
      {
        heading: 'Why this outperforms ads',
        paragraphs: [
          'An ad interrupts someone who was not looking. Your profile meets someone at the exact moment the need exists, which is the cheapest attention you will ever get. Most local categories are decided by whoever shows up complete, recent, and answered at that moment.',
          'If you want a second pair of eyes on yours, the three-second test is free and there is no pitch. Just arstrategies.com.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-ask-for-reviews',
    title: 'Most businesses beg for reviews. The ones with five hundred ask differently.',
    standfirst:
      'Review count is the strongest trust signal a local business controls, and almost everyone asks at the wrong moment with the wrong words. The fix is timing, not persistence.',
    category: 'Playbook',
    pillar: 'Trust',
    date: '2026-07-15',
    dateLabel: 'Jul 15, 2026',
    readTime: '4 min',
    sections: [
      {
        paragraphs: [
          'Before a stranger calls you, they read what other strangers said about you. Not your copy, not your offers. Reviews are the only part of your marketing written by someone with nothing to gain, which is exactly why customers weight them more than everything you say about yourself combined.',
          'Most owners know this and still have forty reviews after five years, because they ask at the worst possible moment: the invoice. At payment time the customer is focused on what they spent. The window you want is the moment they are focused on what they got.',
        ],
      },
      {
        heading: 'Ask at the peak, not the exit',
        paragraphs: [
          'People remember experiences by their best moment and their last moment. Ask at the peak. For a gym, that is the session where a member hits something they could not do a month ago. For a clinic, the follow-up where the problem is visibly gone. For trades, the walkthrough when the finished work is revealed. For a restaurant, the moment they praise the dish unprompted.',
          'The signal is simple: they said something nice out loud. That sentence is a review that has not been written down yet. Your only job is to catch it within a few seconds. "That genuinely helps us. Would you put that in a Google review? It decides whether people find us." Then send the direct review link immediately, while the feeling is alive. One tap, not a scavenger hunt.',
        ],
      },
      {
        heading: 'Reply to every single one',
        paragraphs: [
          'A review you never answered is a customer you ignored in public. Reply to all of them, briefly and specifically. For negative ones, one calm paragraph beats a defensive essay: acknowledge the specific issue, say what changed, and offer to fix it directly. Prospects reading it are not judging the complaint. They are judging how you handle being wrong.',
          'What never to do: never buy reviews, never trade discounts for them, and never batch-ask fifty customers in one week. Platforms flag velocity spikes, and readers can smell a wall of same-day five-stars. Slow and steady is not just safer, it looks more true, because it is.',
        ],
      },
      {
        heading: 'The compounding part',
        paragraphs: [
          'Reviews are the rare marketing asset that never expires and never stops working. Every one you earn this month is still selling for you in three years. A business that catches two peaks a week has a hundred new reviews a year, and at that point the review count itself becomes the reason people choose you.',
          'If you want to know how your trust signals read to a stranger, the three-second test is free and there is no pitch. Just arstrategies.com.',
        ],
      },
    ],
  },
  {
    slug: 'the-three-second-test',
    title: 'The three-second test: what strangers decide about your business before you say a word',
    standfirst:
      'Customers give a search result, a profile, a homepage, and a storefront about three seconds each. You can run the same test on your own business tonight, for free. Here is how.',
    category: 'Playbook',
    pillar: 'Attention',
    date: '2026-07-14',
    dateLabel: 'Jul 14, 2026',
    readTime: '4 min',
    relatedMechanism: { id: 'positioning', name: 'Positioning' },
    sections: [
      {
        paragraphs: [
          'Nobody studies a local business. They glance at it. In roughly three seconds a stranger decides whether your search result is worth clicking, your profile worth reading, your storefront worth entering. The decision is made before a single sentence of your carefully written copy is read.',
          'The problem is that you cannot see your own business freshly. You know what you do, so everything about it looks obvious to you. This is the curse of knowledge, and it is why confident owners are routinely invisible to the exact people they are trying to reach.',
        ],
      },
      {
        heading: 'How to run the test',
        paragraphs: [
          'Find someone who does not know your business. Not your staff, not your spouse. Show them one surface for three seconds, then take it away and ask three questions. What do they sell? Who is it for? Why would you pick them over the one next door?',
          'Two blank answers out of three is a fail, and most businesses fail. Not because the answers are wrong, but because the surface never offered them. "Quality you can trust" answers none of the three questions. "Open till midnight, walk-ins welcome" answers two.',
        ],
      },
      {
        heading: 'Run it on all four surfaces',
        paragraphs: [
          'The search snippet: does the title say what you do and where, or just your name? The Google profile: do the first photo and first review line tell your story, or could they belong to any business in the category? The homepage above the fold: is there one sentence a stranger could repeat back? The storefront or signage: from across the street, does it say what happens inside?',
          'Score each surface separately, because customers meet them separately. A business is usually strong on the surface the owner looks at daily and blank on the ones customers actually meet first.',
        ],
      },
      {
        heading: 'Fixing a failed surface',
        paragraphs: [
          'One message per surface, and make it specific. Name the customer, name the outcome, drop the welcome-everyone language. Specifics beat adjectives every time: "ladies-only hours from 10 to 2" outsells "a comfortable environment for everyone" because it can be remembered, repeated, and acted on.',
          'This is the same test we run first for every client. If you want a stranger’s three seconds on your business, the test is free and there is no pitch. Just arstrategies.com.',
        ],
      },
    ],
  },
  {
    slug: 'people-buy-what-they-remember',
    title: 'People don’t buy the best option. They buy the option they remember.',
    standfirst:
      'Most local businesses compete on quality and lose on memory. The winner in your category is rarely the best operator. It is the one that comes to mind first.',
    category: 'Editorial',
    pillar: 'Memory',
    date: '2026-07-05',
    dateLabel: 'Jul 05, 2026',
    readTime: '4 min',
    relatedMechanism: { id: 'mental-availability', name: 'Mental Availability' },
    sections: [
      {
        paragraphs: [
          'Ask any business owner why customers should choose them and you will hear the same answer: because we are better. Better service, better prices, better work. It is almost always true, and it almost never matters.',
          'The uncomfortable fact about local markets is that customers do not run evaluations. Nobody builds a spreadsheet before picking a dentist. They search once, recognize a name, and call. The decision is over in under a minute, and it was decided by memory, not merit.',
        ],
      },
      {
        heading: 'The shortlist is the whole game',
        paragraphs: [
          'Marketing researchers call it the evoked set: the two or three names that surface in a customer’s mind when a need appears. If you are in that set, you compete. If you are not, your quality is invisible. The best plumber in the city loses to the third-best plumber who ranks first on Google and whose name the customer has seen four times this month.',
          'This is why we treat search rankings as a memory channel, not a technical one. Being found first is being remembered first at the exact moment the need exists. The #1 result does not win because people trust Google. It wins because it is the only name most people ever meet.',
        ],
      },
      {
        heading: 'What this means for your business',
        paragraphs: [
          'Stop asking "how do we prove we are the best?" and start asking "what would make someone remember us next Tuesday?" Distinctive positioning, a consistent visual identity, and top-of-search presence compound into the same asset: availability in memory.',
          'Quality keeps customers. Memory gets them. Most businesses invest 100% in the first and wonder why the phone is quiet.',
        ],
      },
    ],
  },
  {
    slug: 'your-ads-are-being-filtered',
    title: 'Your ads aren’t being rejected. They’re being filtered.',
    standfirst:
      'Customers never saw your ad and decided against you. Their brain deleted it before the decision could happen. That is a fixable problem, and volume is not the fix.',
    category: 'Editorial',
    pillar: 'Attention',
    date: '2026-06-21',
    dateLabel: 'Jun 21, 2026',
    readTime: '3 min',
    relatedMechanism: { id: 'pattern-interruption', name: 'Pattern Interruption' },
    sections: [
      {
        paragraphs: [
          'When an ad does not perform, the instinct is to turn it up: more budget, more frequency, brighter creative. This assumes the audience saw the ad and was not convinced. In our audits, that is rarely what happened. The ad was never consciously seen at all.',
          'The brain processes millions of bits per second and admits a tiny fraction to attention. Everything that looks like what it expected gets handled by the filter, not the mind. A gym ad that looks like every gym ad is not weak. It is invisible.',
        ],
      },
      {
        heading: 'Different beats louder',
        paragraphs: [
          'The filter keys on patterns. Same stock photos, same claims, same layout: pattern matched, deleted. What survives is anomaly. An unexpected claim, a visual that does not belong to the category, a headline that starts an unfinished thought.',
          'This is not a creativity contest. It is a simple audit question: what does every competitor in your category look like, and where exactly do you look identical? That overlap is the part of your budget being spent on invisible impressions.',
        ],
      },
      {
        heading: 'The test we run',
        paragraphs: [
          'Place your ad next to three competitors with the logos removed. If a stranger cannot tell which one is yours in five seconds, the market cannot either. Distinctiveness is measurable, and it is the cheapest performance upgrade most local businesses will ever make.',
        ],
      },
    ],
  },
  {
    slug: 'strike-den-default-choice',
    title: 'How a gym in DHA Karachi became the city’s default choice',
    standfirst:
      'Strike Den had no profile, no followers, and a market full of louder competitors. Six months later it was the #1 result for its best-buying searches. Here is the mechanism-level breakdown.',
    category: 'Case Study',
    pillar: 'Positioning',
    date: '2026-06-02',
    dateLabel: 'Jun 02, 2026',
    readTime: '5 min',
    relatedMechanism: { id: 'positioning', name: 'Positioning' },
    sections: [
      {
        paragraphs: [
          'Every gym in the market said the same things: best equipment, certified trainers, transform your body. When everyone claims the same position, the customer hears nothing and defaults to whoever appears first. Strike Den appeared nowhere.',
          'The work started with positioning, not promotion. Instead of competing as another fitness option, Strike Den was positioned as the place serious fighters trust. That sentence excluded most of the market on purpose. Positioning that welcomes everyone is remembered by no one.',
        ],
      },
      {
        heading: 'The mechanism stack',
        paragraphs: [
          'Pattern interruption did the noticing: real training footage and fight-culture language in a category wallpapered with stock photography. Positioning did the differentiating: a clear answer to "why this gym" that no competitor could copy without admitting they were copying. Mental availability did the compounding: month over month of search visibility until "MMA gym DHA Karachi" and Strike Den became the same thought.',
          'None of these mechanisms is exotic. The advantage came from running them in the right order. Attention without positioning is a spike. Positioning without availability is a secret.',
        ],
      },
      {
        heading: 'The results',
        paragraphs: [
          'Six months from zero profile to the #1 organic position for the searches that actually produce members. Revenue crossed 1M PKR in the first year of the engagement, from a starting point of breaking even. Membership roughly doubled.',
          'The owner, Sikander Ali Shah, put it more simply: the gym stopped chasing members and started receiving them. That is what the top of a search result feels like from the inside.',
        ],
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
