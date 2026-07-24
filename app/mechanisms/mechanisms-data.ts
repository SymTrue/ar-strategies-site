export interface MechanismExample {
  title: string;
  context: string;
  explanation: string;
  result: string;
}

export interface RelatedMechanism {
  id: string;
  name: string;
  description: string;
}

export interface MechanismData {
  id: string;
  name: string;
  fullTitle: string;
  subtitle: string;
  pillar: string;
  videoFile: string;
  whyWorks: string;
  /* Index into whyWorks.split('\n\n') marking where the "Why It Decides
     Purchases" subhead breaks the prose wall, right before the paragraph
     that turns from mechanism explanation into commercial consequence. */
  whyWorksSubheadIndex: number;
  examples: MechanismExample[];
  howWeUseIt: string;
  relatedMechanisms: RelatedMechanism[];
}

/* One sentence per mechanism for the "In One Sentence" takeaway callout
   that sits directly under the video on each detail page. */
export const mechanismTakeaways: Record<string, string> = {
  'pattern-interruption': 'Your brain tunes out the expected, so different beats louder.',
  'mental-availability': 'Customers choose whoever comes to mind first, not whoever is best.',
  positioning: "You're judged against the alternatives, so own one clear difference.",
  'familiarity-effect': 'Every time someone sees your name, it feels a little safer.',
  'decision-architecture': 'More options mean fewer people choose. Make one path obvious.',
};

/* SEO meta descriptions, hand-tuned separately from the on-page subtitle
   because a search snippet and an on-page hero blurb earn their words
   differently. Titles are NOT duplicated here: mechanismMeta below derives
   the title directly from mechanismsData, so a mechanism can never again
   ship with a missing or generic page title the way it did before this
   file existed. */
const metaDescriptions: Record<string, string> = {
  'pattern-interruption':
    'How breaking expected patterns forces attention and makes a business impossible to ignore.',
  'mental-availability':
    'Why the business remembered first gets chosen first, and how to build that recall on purpose.',
  positioning:
    'How strategic positioning shapes perception relative to every alternative a customer could pick instead.',
  'familiarity-effect':
    'How repeated exposure quietly converts recognition into trust, and why customers buy from names they have already seen.',
  'decision-architecture':
    'How the structure of your options decides whether people choose at all, and why fewer, clearer paths convert more.',
};

export const mechanismsData: Record<string, MechanismData> = {
  'pattern-interruption': {
    id: 'pattern-interruption',
    name: 'Pattern Interruption',
    fullTitle: 'Pattern Interruption: The Psychology Behind Getting Noticed',
    subtitle: 'How breaking the pattern people expect forces them to notice you, and makes your business impossible to ignore.',
    pillar: 'Attention',
    videoFile: '/videos/pattern-interruption.mp4',
    whyWorks: `Most businesses try to get noticed by being louder. That's a waste of money.

Getting noticed isn't about volume. It's about surprise. Your brain is built to tune out anything repetitive and snap to attention when something breaks the pattern. So when your message isn't what people expect, they can't help but look.

The numbers behind it: your brain takes in about 11 million pieces of information every second, but you can only consciously handle about 40. Everything else gets filtered out before you even notice it.

Breaking the pattern slips past that filter. It trips the old survival instinct that says: that's different, it might matter, pay attention.

That's why a surprising headline beats a safe one, why a splash of color stops the scroll, and why a bold claim gets shared while a careful one gets ignored.`,
    whyWorksSubheadIndex: 4,
    examples: [
      {
        title: 'Dollar Shave Club vs. Gillette',
        context: 'Direct-to-consumer razor company entering a market dominated by Gillette',
        explanation: 'Expected pattern: Razors = premium, aspirational, sleek ads with models. Dollar Shave Club broke the pattern entirely. Founder on camera in a bathroom, speaking casually, making jokes. "Our blades are f***ing great." Gillette\'s ads had become invisible noise. This broke the pattern so aggressively people couldn\'t look away.',
        result: 'Went from zero to $100M/year in 4 years.',
      },
      {
        title: 'Apple\'s "Think Different" Campaign',
        context: '1997: Apple was dying, IBM dominated, Microsoft was winning',
        explanation: 'Expected pattern: Tech ads were technical, feature-focused, boring. Apple showed images of Einstein, MLK, Gandhi. Cultural icons. No product. Pure possibility. It broke every rule of tech advertising.',
        result: 'Revived Apple brand perception and became one of the most iconic campaigns ever.',
      },
      {
        title: 'Blendtec "Will It Blend?" Videos',
        context: 'Blending competition was saturated with identical products',
        explanation: 'Expected pattern: Blender ads show smooth blending, clean recipes, sleek kitchens. Blendtec asked: What if we blend things that should never go in a blender? iPhones, golf balls, marbles, light bulbs. You can\'t look away.',
        result: 'Blendtec became known for durability through an absurdist, attention-grabbing series.',
      },
    ],
    howWeUseIt: `For Strike Den (MMA gym in DHA Karachi), all gyms use the same pattern:
- Generic Google Ads
- Stock photos of people lifting
- "Transform Your Body" messaging
- Call-to-action: "Join Today"

The pattern is predictable. Customers filter it out.

Here's what we did: We broke the pattern.

Instead of "Transform Your Body," we positioned them as "The place serious fighters trust."
We showed real athletes, real training footage, real intensity.
We talked about mindset, discipline, and mastery. Not just muscles.

That one move changed how the whole market saw them.
#1 on Google within 6 months. Double the members.

We didn't try to be loud. We tried to be different. And different is what makes people pay attention.`,
    relatedMechanisms: [
      {
        id: 'mental-availability',
        name: 'Mental Availability',
        description: 'Why they remember you AFTER the pattern interruption',
      },
      {
        id: 'positioning',
        name: 'Positioning',
        description: 'How to frame your message for maximum impact',
      },
    ],
  },
  'mental-availability': {
    id: 'mental-availability',
    name: 'Mental Availability',
    fullTitle: 'Mental Availability: The Psychology Behind Being Remembered',
    subtitle: 'How being the first business people think of turns into being the one they choose.',
    pillar: 'Memory',
    videoFile: '/videos/mental-availability.mp4',
    whyWorks: `People don't remember everything they see. They remember what's useful, recent, and repeated.

That's mental availability. It's not about being everywhere. It's about showing up in the right place, at the right moment, again and again.

When someone searches for what you do, they don't weigh every option evenly. They start with the ones they already remember.

Watch how people actually buy and it's hard to miss: being remembered wins more sales than ads, websites, or even being the best. Not because those don't matter, but because you never get considered if you don't come to mind.

The businesses that win usually aren't the best ones. They're the ones people think of first when the need shows up.

That's why ranking on local search matters. Why saying the same thing consistently matters. Why showing up often matters.

Being remembered isn't luck. It's something you build on purpose.`,
    whyWorksSubheadIndex: 4,
    examples: [
      {
        title: 'Coke vs. Pepsi',
        context: 'Two nearly identical beverages in terms of taste',
        explanation: 'Coca-Cola isn\'t better. But when you think "cola," Coke comes to mind first. That\'s mental availability. They\'ve spent decades ensuring they\'re the first thought, not the second.',
        result: 'Coke owns the category through availability, not superiority.',
      },
      {
        title: 'Local Plumber Ranking #1 on Google',
        context: 'Customer needs a plumber at 2 AM on Sunday',
        explanation: 'They search "plumber near me." The first 3 results are what\'s mentally available to them. They don\'t research 10 options. They call the first one.',
        result: 'That #1 ranking directly correlates to calls and revenue.',
      },
    ],
    howWeUseIt: `Mental availability is why we focus on SEO rankings, not just traffic.

When someone needs what your business offers, you need to be the first thing they remember. For local businesses, that means:
- Ranking #1-3 on Google (highest availability in search context)
- Consistent messaging (reinforces memory)
- Appearing multiple times in their journey (homepage → services → case study → contact)

For Strike Den: Being mentally available to serious fighters searching "MMA gym DHA Karachi" meant investing in SEO, content, and positioning. Not just ads. Result: They became the default choice.

We build mental availability intentionally. Every touchpoint reinforces it.`,
    relatedMechanisms: [
      {
        id: 'pattern-interruption',
        name: 'Pattern Interruption',
        description: 'How to get noticed in the first place',
      },
      {
        id: 'positioning',
        name: 'Positioning',
        description: 'How to be remembered for the right reason',
      },
    ],
  },
  positioning: {
    id: 'positioning',
    name: 'Positioning',
    fullTitle: 'Positioning: The Psychology Behind Differentiation',
    subtitle: 'How the way people place you against the competition decides whether they pick you.',
    pillar: 'Positioning',
    videoFile: '/videos/positioning.mp4',
    whyWorks: `Positioning isn't what you say about yourself. It's what people believe about you compared to the alternatives.

Nobody judges your business on its own. They judge it against the other options. The question in their head isn't "Is this good?" It's "Is this better than the next one?"

Come across as one of many, and you lose on price.
Come across as clearly different, and you win on value.

The strongest positioning isn't about being bigger, cheaper, or faster. It's about being seen as different in a way people actually care about.

Apple isn't the fastest computer. It's the one for people who care about design.
BMW isn't the cheapest car. It's the one that's fun to drive.
Nike isn't the comfiest shoe. It's the one for people who want to win.

How people see you drives what they choose. What they choose drives your revenue.

That's why positioning comes first. Your ads, your website, your pitch all just amplify your position. If the position is weak, louder only spreads the weakness.`,
    whyWorksSubheadIndex: 6,
    examples: [
      {
        title: 'Tesla vs. Traditional Automakers',
        context: 'Tesla entered a market with 100-year-old incumbents',
        explanation: 'Tesla didn\'t position as "electric car company." They positioned as "the future of transportation." Traditional automakers are positioned as "car companies that happen to make electric cars." Totally different positioning, completely different perception.',
        result: 'Tesla owns the future narrative. Everyone else plays catch-up.',
      },
      {
        title: 'Strike Den Positioning',
        context: 'MMA gym in a city with 20+ fitness centers',
        explanation: 'Generic positioning: "State-of-the-art gym with professional trainers." Strike Den\'s positioning: "The place serious fighters trust." Same business, completely different positioning. One competes on features. One competes on identity and belonging.',
        result: '#1 in local search. Premium pricing power. Loyal community.',
      },
    ],
    howWeUseIt: `We start every project by discovering positioning.

Before websites, ads, or content, we ask: "What should this business be known for?"

Not "What should we say?" but "What should they be perceived as?"

For local businesses, positioning often comes down to: "Who do they serve best, and why?"

Strike Den could have positioned as:
- "Cheapest gym in the city" (loses on features)
- "Most equipment" (loses on differentiation)
- "For serious fighters" (wins on belonging + identity)

We chose the third. Everything flows from that positioning:
- The messaging reflects it
- The case studies reflect it
- The type of customer attracted reflects it
- The pricing power reflects it

Positioning shapes everything. Get it right, and the rest becomes easy. Get it wrong, and you fight an uphill battle.`,
    relatedMechanisms: [
      {
        id: 'pattern-interruption',
        name: 'Pattern Interruption',
        description: 'How to break through the noise and establish your position',
      },
      {
        id: 'mental-availability',
        name: 'Mental Availability',
        description: 'How to make your position stick in memory',
      },
    ],
  },
  'familiarity-effect': {
    id: 'familiarity-effect',
    name: 'Familiarity Effect',
    fullTitle: 'The Familiarity Effect: The Psychology Behind Being Trusted',
    subtitle: "Why customers trust the names they've seen before, and how showing up again and again builds that trust.",
    pillar: 'Trust',
    videoFile: '/videos/familiarity-effect.mp4',
    whyWorks: `Ask a customer why they chose a business and you'll hear sensible reasons: price, reviews, convenience. Watch what they actually do and something quieter is at work. They pick the name they've seen before.

Psychologists have a name for it: the mere exposure effect. Study after study since the 1960s shows the same thing. People trust and like what's familiar more than what's new, even when they don't remember ever seeing it.

Here's why. A name your brain has seen before is easier to take in the next time, and your brain reads that ease as safety. Familiar feels safe. New feels risky. No argument, no weighing of facts. The trust is handed out before any thinking starts.

For a local business, this is everything, because most of your market isn't buying today. They're passing your sign, scrolling past your posts, hearing your name from a friend. None of it makes a sale that day. All of it decides who they trust when the day comes.`,
    whyWorksSubheadIndex: 3,
    examples: [
      {
        title: 'Coca-Cola\'s "pointless" advertising',
        context: 'The most recognized brand on earth still spends billions on ads',
        explanation: "Coke ads contain no information. No price, no features, no argument. They aren't there to convince you of anything. They're there to keep the name familiar, so Coke stays the one your hand reaches for without thinking.",
        result: 'Coke stays the default choice in a category with functionally identical products.',
      },
      {
        title: 'The signboard dentist',
        context: 'A dental clinic on a road you drive daily',
        explanation: 'You have never read the sign deliberately. But after two years of passing it, the name is in you. The day a tooth aches, that clinic feels safer than the higher-rated one you have never heard of. Nothing was communicated. Exposure did all the work.',
        result: 'The familiar clinic gets the call over objectively better options.',
      },
      {
        title: 'Why retargeting works',
        context: 'Ads that follow you after you visit a website',
        explanation: 'Retargeting is often explained as reminding people to finish a purchase. Its stronger effect is repetition: each impression is another exposure, and each exposure lowers the perceived risk of the brand. The click usually comes late, after the familiarity has accumulated.',
        result: 'Conversion happens on the sixth exposure but was built by the first five.',
      },
    ],
    howWeUseIt: `Familiarity compounds only if the exposures connect, and they only connect if the business looks and sounds the same everywhere.

That is why the first thing we fix is consistency: one visual identity, one tone, one message across search, maps, social, and the storefront. Five different-looking touchpoints produce five weak first exposures. Five consistent ones produce one strong fifth exposure.

For Strike Den, that meant the same fight-culture look and language in every post, every ad, every search result. A person who saw a reel in March, a signboard in May, and a search result in July was meeting the same gym three times, not three gyms once.

Then we widen the surface area. Search rankings, maps presence, review responses, weekly content: each is an exposure channel that runs without a media budget. The goal is simple to state and slow to build: by the time the need appears, your name should already feel like the safe choice.`,
    relatedMechanisms: [
      {
        id: 'mental-availability',
        name: 'Mental Availability',
        description: 'Familiarity\'s twin: being recalled first when the need appears',
      },
      {
        id: 'pattern-interruption',
        name: 'Pattern Interruption',
        description: 'How to earn the first exposure in a feed built to filter you out',
      },
    ],
  },
  'decision-architecture': {
    id: 'decision-architecture',
    name: 'Decision Architecture',
    fullTitle: 'Decision Architecture: The Psychology Behind Getting Chosen',
    subtitle: 'How the way you lay out choices decides whether people pick at all, and why fewer, clearer options win.',
    pillar: 'Psychology',
    videoFile: '/videos/decision-architecture.mp4',
    whyWorks: `Every option you put in front of a buyer is one more comparison they have to run. Two options, one comparison. Six options, fifteen. Their brain does that math whether they want it to or not, and past a handful, deciding gets so tiring it isn't worth the effort.

When choosing gets hard, people don't choose badly. They put it off. "I'll think about it" usually isn't a no to your offer. It's a no to the hard decision you just handed them.

The classic proof is the jam study by researchers Sheena Iyengar and Mark Lepper. A store set out either 24 jams or 6 to taste. The big display drew a bigger crowd, but the small one sold about ten times as well. More choice pulled people in, then killed the sale.

That's decision architecture: the way you lay out the options is itself a message. One clear next step tells a visitor you know what they need. Seven equal buttons tell them to figure it out alone. They won't. They'll leave.`,
    whyWorksSubheadIndex: 3,
    examples: [
      {
        title: 'The jam study',
        context: 'Iyengar and Lepper\'s field experiment in a California supermarket',
        explanation: 'Shoppers who stopped at the 24-jam booth engaged more but overwhelmingly walked away without buying. Shoppers at the 6-jam booth bought at roughly ten times the rate. The product was identical. Only the architecture of the choice changed.',
        result: 'The canonical evidence that more options can mean fewer buyers.',
      },
      {
        title: 'Apple\'s product line under Jobs',
        context: '1997: Apple sold dozens of overlapping computer models',
        explanation: 'Jobs cut the line to a two-by-two grid: consumer or pro, desktop or portable. Customers no longer had to study a catalog to know which Mac was theirs. The answer became obvious in seconds, and the sales conversation changed from comparison to confirmation.',
        result: 'One of the clearest product-line simplifications in business history preceded the turnaround.',
      },
      {
        title: 'The shrinking menu',
        context: 'Restaurants that cut their menu and saw orders speed up',
        explanation: 'Long menus feel generous and read as noise. Shorter menus order faster, reduce the anxiety of choosing wrong, and let a kitchen be excellent at fewer things. The same logic applies to a services page: every service you list dilutes the one you most want to sell.',
        result: 'Less deciding, faster ordering, higher confidence in the choice made.',
      },
    ],
    howWeUseIt: `We audit local business websites for decision cost before anything else, because it is the cheapest conversion fix that exists.

The pattern is always the same: six navigation items competing with four buttons competing with three offers, all above the fold. The owner sees completeness. The visitor sees homework.

The fix is architectural, not cosmetic. One primary action per page. One recommended option wherever options exist. Secondary paths demoted to quiet links instead of competing buttons. If a pricing table is needed, three tiers at most, with one visibly marked as the default choice.

Our own site runs on the same rule. There is one ask here: apply to work with us. Everything else, the mechanisms, the field notes, the case study, exists to make that one decision feel safe and obvious. That is decision architecture doing its job.`,
    relatedMechanisms: [
      {
        id: 'positioning',
        name: 'Positioning',
        description: 'Clarity about what you are makes the choice architecture work',
      },
      {
        id: 'familiarity-effect',
        name: 'Familiarity Effect',
        description: 'Familiar names feel safer to choose when deciding gets hard',
      },
    ],
  },
};

/* Derived, never hand-duplicated: title always matches mechanismsData, so a
   mechanism can never again ship with a missing or fallback page title. */
export const mechanismMeta: Record<string, { title: string; description: string }> = Object.fromEntries(
  Object.entries(mechanismsData).map(([id, data]) => [
    id,
    { title: data.name, description: metaDescriptions[id] ?? data.subtitle },
  ]),
);
