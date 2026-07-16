'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';

interface MechanismData {
  id: string;
  name: string;
  fullTitle: string;
  subtitle: string;
  pillar: string;
  videoFile: string;
  whyWorks: string;
  examples: Array<{
    title: string;
    context: string;
    explanation: string;
    result: string;
  }>;
  howWeUseIt: string;
  relatedMechanisms: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

const mechanismsData: Record<string, MechanismData> = {
  'pattern-interruption': {
    id: 'pattern-interruption',
    name: 'Pattern Interruption',
    fullTitle: 'Pattern Interruption: The Psychology Behind Getting Noticed',
    subtitle: 'Understand how breaking expected patterns forces attention and makes your business impossible to ignore.',
    pillar: 'Attention',
    videoFile: '/videos/pattern-interruption.mp4',
    whyWorks: `Most businesses try to get noticed by being louder. They\'re wasting money.

Pattern interruption isn\'t about volume. It\'s about surprise. The human brain is wired to ignore repetition and notice anomalies. When your message breaks the pattern of what people expect, it forces attention.

Here\'s the neurological fact: Your brain processes ~11 million bits of information per second, but your conscious mind can only handle ~40 bits. Everything else gets filtered out automatically.

Pattern interruption exploits this filter. It hijacks the survival mechanism that says: "If something is different, it might be dangerous. Pay attention."

That\'s why unexpected headlines outperform expected ones by 2-3x, why color breaks in monochrome designs stop scrollers, and why contrarian claims get shared more than safe statements.`,
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
        explanation: 'Expected pattern: Blender ads show smooth operating, clean recipes, sleek kitchens. Blendtec asked: What if we blend things that shouldn\'t go in a blender? iPhones, golf balls, marbles, light bulbs. Pure curiosity interrupt.',
        result: 'Blendtec became known for durability through an absurdist, attention-grabbing series.',
      },
    ],
    howWeUseIt: `For Strike Den (MMA gym in DHA Karachi), all gyms use the same pattern:
- Generic Google Ads
- Stock photos of people lifting
- "Transform Your Body" messaging
- Call-to-action: "Join Today"

The pattern is predictable. Customers filter it out.

Here\'s what we did: We broke the pattern.

Instead of "Transform Your Body," we positioned them as "The place serious fighters trust."
We showed real athletes, real training footage, real intensity.
We talked about mindset, discipline, and mastery. Not just muscles.

That one pattern interrupt shifted their entire positioning.
#1 in SEO within 6 months. 2x membership growth.

Because we didn\'t try to be loud. We tried to be different. And different is what makes humans pay attention.`,
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
    subtitle: 'Discover how top-of-mind awareness works and why businesses that are remembered first get chosen first.',
    pillar: 'Memory',
    videoFile: '/videos/mental-availability.mp4',
    whyWorks: `People don\'t remember everything they see. They remember what\'s relevant, recent, and repeatedly reinforced.

This is mental availability. It's not about being everywhere. It's about being in the right place, at the right time, in the right context. Repeatedly.

When someone searches for what you do, they don\'t evaluate all options equally. They evaluate the options they remember first.

Research shows: 70% of purchase decisions are influenced by how available your business is in the customer's mind. Not by your ads, not by your website, not by how good you are.

Availability in memory.

The businesses that win are not the "best." They\'re the ones that are remembered first when someone needs them.

That\'s why local search rankings matter. That\'s why consistent messaging matters. That\'s why frequency matters.

Because being remembered isn\'t an accident. It\'s a system.`,
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
  'positioning': {
    id: 'positioning',
    name: 'Positioning',
    fullTitle: 'Positioning: The Psychology Behind Differentiation',
    subtitle: 'Learn how strategic positioning shapes perception and becomes the foundation for all business success.',
    pillar: 'Positioning',
    videoFile: '/videos/positioning.mp4',
    whyWorks: `Positioning isn\'t what you say. It\'s what people believe about you relative to alternatives.

When someone evaluates your business, they\'re not evaluating it in isolation. They\'re evaluating it against other options. Their decision isn\'t "Is this good?" It\'s "Is this better than the alternative?"

If you position yourself as "one of many," you lose on price.
If you position yourself as "different," you win on value.

The most powerful positioning isn\'t about being bigger, cheaper, or faster. It\'s about being perceived as different in a way that matters.

Apple isn\'t the fastest computer. They\'re positioned as the thoughtful alternative.
BMW isn\'t the cheapest car. They\'re positioned as the "driving machine."
Nike isn\'t the most comfortable shoe. They\'re positioned as for winners.

Positioning shapes perception. Perception drives choice. Choice drives revenue.

That's why positioning comes first. Everything else - your ads, your website, your sales pitch - amplifies your position. But if your position is weak, everything else is noise.`,
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
    subtitle: 'Understand how repeated exposure quietly converts recognition into trust, and why customers buy from names they have already seen.',
    pillar: 'Trust',
    videoFile: '/videos/familiarity-effect.mp4',
    whyWorks: `Ask a customer why they chose a business and they will give you rational answers: price, reviews, convenience. Watch what they actually do and a quieter force shows up. They pick the name they have seen before.

Psychologists call it the mere exposure effect, first documented by Robert Zajonc in the 1960s: people rate things they have encountered before as more likeable and more trustworthy than things they see for the first time, even when they don\'t consciously remember the encounters.

The mechanism underneath is processing fluency. A name the brain has processed before is processed faster the next time, and the brain misreads that ease as safety. Familiar equals safe. Unfamiliar equals risk. No argument is made, no claim is evaluated. The discount on perceived risk happens before thinking starts.

For a local business this is enormous, because most of your market is not buying today. They are walking past your signboard, scrolling past your posts, hearing your name from a friend. None of those moments produce a sale, and all of them produce the thing that decides the sale later.`,
    examples: [
      {
        title: 'Coca-Cola\'s "pointless" advertising',
        context: 'The most recognized brand on earth still spends billions on ads',
        explanation: 'Coke ads contain no information. No price, no features, no argument. They exist to keep the name familiar, because familiarity is the asset that makes Coke the default reach in the fridge aisle. The advertising is not persuasion. It is maintenance of mental risk-discount.',
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
    subtitle: 'Learn how the structure of your options decides whether people choose at all, and why fewer, clearer paths convert more.',
    pillar: 'Psychology',
    videoFile: '/videos/decision-architecture.mp4',
    whyWorks: `Every option you present is a comparison your buyer has to run. Two options is one comparison. Six options is fifteen. The brain does this math whether the buyer wants it to or not, and past a small number the cost of deciding outweighs the value of choosing.

When deciding gets expensive, people do not choose badly. They defer. "I\'ll think about it" is rarely a rejection of your offer. It is a rejection of the decision you asked them to make.

The most famous demonstration is the jam study by Sheena Iyengar and Mark Lepper. A supermarket tasting booth offered either 24 jams or 6. The bigger display attracted more browsers, but the smaller display sold to roughly ten times the share of them. More choice pulled attention and killed conversion.

This is decision architecture: the structure of options is itself a message. A page with one obvious next step tells the visitor you know what they need. A page with seven equal buttons tells them to figure it out themselves. They won\'t.`,
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

Our own site runs on the same rule. There is one ask here: the free audit. Everything else, the mechanisms, the field notes, the case study, exists to make that one decision feel safe and obvious. That is decision architecture doing its job.`,
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

export default function MechanismPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const mechanism = mechanismsData[id];

  if (!mechanism) {
    notFound();
  }

  return (
    <div className="site-shell min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <SiteHeader />
      {/* Breadcrumb */}
      <div className="border-b border-[var(--border)] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
            <Link href="/mechanisms" className="hover:text-brand transition-colors">
              Mechanisms
            </Link>
            <span>/</span>
            <span className="text-[var(--text-primary)]">{mechanism.name}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-[var(--border)] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-brand/20 text-brand rounded-full border border-brand/50">
              {mechanism.pillar} Pillar
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            {mechanism.fullTitle}
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            {mechanism.subtitle}
          </p>
        </div>
      </section>

      {/* Video Player */}
      <section className="border-b border-[var(--border)] px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full aspect-video bg-black rounded-lg border border-brand/30 overflow-hidden">
            <video
              controls
              autoPlay
              muted
              className="w-full h-full"
            >
              <source src={mechanism.videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="border-b border-[var(--border)] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Why This Works</h2>
          <div className="prose prose-invert max-w-[50ch]">
            {mechanism.whyWorks.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-[var(--text-secondary)] leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="border-b border-[var(--border)] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Real Examples</h2>
          <div className="space-y-8">
            {mechanism.examples.map((example, i) => (
              <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-2 text-brand">{example.title}</h3>
                <p className="text-[var(--text-tertiary)] text-sm mb-4">{example.context}</p>
                <p className="text-[var(--text-secondary)] mb-4">{example.explanation}</p>
                <p className="text-brand font-semibold">Result: {example.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Use It */}
      <section className="border-b border-[var(--border)] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">How AR Strategies Uses This</h2>
          <div className="prose prose-invert max-w-[50ch]">
            {mechanism.howWeUseIt.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-[var(--text-secondary)] leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Related Mechanisms */}
      <section className="border-b border-[var(--border)] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Related Mechanisms</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {mechanism.relatedMechanisms.map(related => (
              <Link key={related.id} href={`/mechanisms/${related.id}`}>
                <div className="bg-[var(--surface)] border border-[var(--border)] hover:border-brand hover:bg-white/[0.08] rounded-lg p-6 transition-all cursor-pointer h-full">
                  <h3 className="text-xl font-bold mb-2 text-brand">{related.name}</h3>
                  <p className="text-[var(--text-tertiary)] text-sm">{related.description}</p>
                  <div className="mt-4 text-brand font-semibold flex items-center gap-2">
                    <span>Learn More</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">See This in Action</h2>
          <p className="text-[var(--text-secondary)] mb-8 text-lg">
            Watch how we applied these mechanisms to achieve real results.
          </p>
          <Link
            href="/#strike-den"
            className="btn-primary inline-block px-8 py-4 rounded-full font-bold transition-colors"
          >
            View Case Study
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
