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
    title: 'How a gym in Islamabad became the city’s default choice',
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
          'Pattern interruption did the noticing: real training footage and fight-culture language in a category wallpapered with stock photography. Positioning did the differentiating: a clear answer to "why this gym" that no competitor could copy without admitting they were copying. Mental availability did the compounding: month over month of search visibility until "MMA gym Islamabad" and Strike Den became the same thought.',
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
