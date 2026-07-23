'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { track } from '@vercel/analytics';
import { useEffect, useRef, useState } from 'react';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { useTheme } from '../providers';

const Waves = dynamic(() => import('../components/ui/wave-background').then((m) => m.Waves), {
  ssr: false,
});

const mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } as const;

function SectionKicker({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="kicker-chip">
        <span className="kicker-n">{n}</span>
        <span className="kicker-sep" aria-hidden="true">/</span>
        <span>{label}</span>
      </span>
      <span className="kicker-line" style={{ transform: 'scaleX(1)' }} aria-hidden="true" />
    </div>
  );
}

const advantages = [
  {
    title: 'Buyers, not browsers',
    body: 'Someone searching for what you do is ready to book. The top results meet them at that exact moment, which is the cheapest attention your business will ever get.',
  },
  {
    title: 'No meter running',
    body: 'Ads stop the second you stop paying. A ranking you hold keeps sending calls without charging you per click, and every month builds on the last.',
  },
  {
    title: 'One business per market',
    body: 'We never work with your competitors. When you hold the spot, everything we build works for you and against them.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Send in your application',
    body: 'Tell us about your business in the form below. We read every application personally.',
  },
  {
    n: '02',
    title: 'Map the market on a call',
    body: 'If it looks like a fit, we walk your market together: where you rank today, where the calls are going, and what it takes to win.',
  },
  {
    n: '03',
    title: 'We build your visibility',
    body: 'Your profile, reviews, content, and site signals, tuned to your best-buying searches. Done for you while you run the business.',
  },
  {
    n: '04',
    title: 'You see every number',
    body: 'Rankings, leads, and cost per call in plain English every month. You stay because it works, not because you signed something.',
  },
];

const faqs = [
  {
    q: 'How is this different from running Google ads?',
    a: 'Ads rent attention: the calls stop the moment the budget does. Rankings earn it: once you hold the top spots for your best-buying searches, the calls keep coming without a per-click charge. We use ads where they make sense, but the goal is a position you own.',
  },
  {
    q: 'Will this work in my industry?',
    a: 'If your customers search for what you do, yes. Before we take you on, we check the real search demand in your market on the call, and if we do not think we can win it, we say so.',
  },
  {
    q: 'How long until I see results?',
    a: 'Most clients see movement within the first month. Competitive searches take longer to top, which is why we report rankings and calls monthly so you can watch it compound.',
  },
  {
    q: 'Am I locked into a contract?',
    a: 'No lock-in. You stay because it is working. We earn your business every month.',
  },
  {
    q: 'What does it cost?',
    a: 'It depends on your market and how competitive your searches are. We price it on the call, after we have seen what winning takes, so the number is real rather than a package off a shelf.',
  },
];

/* Stylized search results diagram: your business climbs from buried to top
   when toggled. Purely illustrative, labeled as such. */
const RANK_ROWS = [
  { name: 'Competitor one', you: false },
  { name: 'Competitor two', you: false },
  { name: 'Competitor three', you: false },
  { name: 'Your business', you: true },
  { name: 'Competitor four', you: false },
];

const BEFORE_SLOTS = [0, 1, 2, 3, 4];
const AFTER_SLOTS = [1, 2, 3, 0, 4];

const ROW_H = 72;
const ROW_GAP = 10;

function RankShift() {
  const [after, setAfter] = useState(false);
  const interacted = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setAfter(true);
      return;
    }
    const id = setInterval(() => {
      if (!interacted.current) setAfter((v) => !v);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const slots = after ? AFTER_SLOTS : BEFORE_SLOTS;

  const choose = (value: boolean) => {
    interacted.current = true;
    setAfter(value);
  };

  return (
    <div className="border border-dashed border-[var(--border)] rounded-lg p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[11.5px] uppercase tracking-[0.16em] text-[var(--text-secondary)]" style={mono}>
          Fig. 01, Your search results page. Illustrative
        </p>
        <div className="flex rounded-full border border-[var(--border)] p-1" role="group" aria-label="Toggle before and after">
          <button
            type="button"
            onClick={() => choose(false)}
            aria-pressed={!after}
            className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.12em] transition-colors ${
              !after ? 'bg-brand text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            style={mono}
          >
            Before
          </button>
          <button
            type="button"
            onClick={() => choose(true)}
            aria-pressed={after}
            className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.12em] transition-colors ${
              after ? 'bg-brand text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            style={mono}
          >
            After
          </button>
        </div>
      </div>

      <div className="relative" style={{ height: RANK_ROWS.length * (ROW_H + ROW_GAP) - ROW_GAP }}>
        {RANK_ROWS.map((row, i) => {
          const slot = slots[i];
          return (
            <div
              key={row.name}
              className={`absolute left-0 right-0 flex items-center gap-4 rounded-lg border px-5 transition-transform duration-500 ease-out ${
                row.you
                  ? 'border-brand bg-brand/10'
                  : 'border-[var(--border)] bg-[var(--surface)]'
              }`}
              style={{ height: ROW_H, transform: `translateY(${slot * (ROW_H + ROW_GAP)}px)` }}
            >
              <span
                className={`tabular-nums text-sm w-6 shrink-0 ${row.you ? 'text-brand' : 'text-[var(--text-tertiary)]'}`}
                style={mono}
              >
                {slot + 1}
              </span>
              <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${row.you ? 'bg-brand' : 'bg-[var(--text-tertiary)] opacity-40'}`} aria-hidden="true" />
              <div className="min-w-0">
                <p className={`truncate font-semibold ${row.you ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                  {row.name}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] truncate">
                  {row.you && after ? 'Top result for your best-buying searches' : 'Local listing'}
                </p>
              </div>
              {row.you && (
                <span
                  className="ml-auto shrink-0 text-[11.5px] uppercase tracking-[0.16em] text-brand"
                  style={mono}
                >
                  {after ? 'Found first' : 'Invisible'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-[var(--text-tertiary)]">
        The listings above the fold get the calls. Moving from buried to first is the whole job.
      </p>
    </div>
  );
}

type FormState = 'idle' | 'sending' | 'done' | 'error';

function ApplicationForm() {
  const [state, setState] = useState<FormState>('idle');
  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    industry: '',
    spend: '',
    help: '',
  });
  const [honeypot, setHoneypot] = useState('');

  const set = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'application', website: honeypot, ...fields }),
      });
      if (res.ok) track('application_submitted');
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  };

  if (state === 'done') {
    return (
      <div className="border border-dashed border-[var(--border)] rounded-lg p-8 text-center">
        <p className="text-xl font-display uppercase mb-2">Application received.</p>
        <p className="text-[var(--text-secondary)]">
          We read every one personally. If it looks like a good fit, we will reach back out to
          schedule a call. Either way, you will hear from us.
        </p>
      </div>
    );
  }

  const inputClass =
    'w-full bg-transparent border border-[var(--border)] rounded-full px-5 py-3.5 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-brand focus:outline-none transition-colors';

  return (
    <form onSubmit={submit} className="space-y-4" aria-label="Application form">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="app-first" className="sr-only">First name</label>
          <input id="app-first" required value={fields.firstName} onChange={set('firstName')} placeholder="First name *" autoComplete="given-name" maxLength={100} className={inputClass} />
        </div>
        <div>
          <label htmlFor="app-last" className="sr-only">Last name</label>
          <input id="app-last" value={fields.lastName} onChange={set('lastName')} placeholder="Last name" autoComplete="family-name" maxLength={100} className={inputClass} />
        </div>
        <div>
          <label htmlFor="app-phone" className="sr-only">Phone number</label>
          <input id="app-phone" type="tel" value={fields.phone} onChange={set('phone')} placeholder="Phone number" autoComplete="tel" maxLength={40} className={inputClass} />
        </div>
        <div>
          <label htmlFor="app-email" className="sr-only">Email</label>
          <input id="app-email" type="email" required value={fields.email} onChange={set('email')} placeholder="Email *" autoComplete="email" maxLength={254} className={inputClass} />
        </div>
        <div>
          <label htmlFor="app-industry" className="sr-only">Which industry are you in?</label>
          <input id="app-industry" value={fields.industry} onChange={set('industry')} placeholder="Which industry are you in?" maxLength={120} className={inputClass} />
        </div>
        <div>
          <label htmlFor="app-spend" className="sr-only">Current marketing spend</label>
          <input id="app-spend" value={fields.spend} onChange={set('spend')} placeholder="Current marketing spend?" maxLength={120} className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor="app-help" className="sr-only">What do you need help with specifically?</label>
        <textarea
          id="app-help"
          required
          value={fields.help}
          onChange={set('help')}
          placeholder="What do you need help with specifically? *"
          rows={4}
          maxLength={2000}
          className="w-full bg-transparent border border-[var(--border)] rounded-lg px-5 py-4 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-brand focus:outline-none transition-colors resize-y"
        />
      </div>
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <button
          type="submit"
          disabled={state === 'sending'}
          className="btn-primary active:scale-[0.97] px-8 py-3.5 rounded-full font-semibold transition-colors disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
        >
          {state === 'sending' ? 'Sending…' : 'Submit Application'}
        </button>
        <p className="text-sm text-[var(--text-tertiary)]">No lock-in, no obligation. We reply either way.</p>
      </div>
      {state === 'error' && (
        <p className="text-sm text-red-400" role="alert">
          That didn&apos;t go through. Try again, or email{' '}
          <a href="mailto:hello@arstrategists.com" className="underline">hello@arstrategists.com</a>.
        </p>
      )}
    </form>
  );
}

export default function WorkWithUsPage() {
  const { theme } = useTheme();

  return (
    <div className="site-shell min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <SiteHeader />

      <main id="main-content">
      {/* Hero */}
      <section className="relative border-b border-dashed border-[var(--border)] px-4 sm:px-6 lg:px-8 py-24 md:py-32 overflow-hidden">
        <Waves strokeColor={theme === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(10,8,6,0.08)'} />
        <div className="hero-overlay absolute inset-0 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <SectionKicker n="00" label="Done For You" />
          <h1 className="font-display uppercase text-5xl md:text-7xl leading-[1.05] mb-6 max-w-3xl text-balance">
            Own the top of Google <span className="text-brand">in your market.</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl text-pretty mb-10">
            We take one business per market and make it the one its city finds first. Send in
            your application, and if we think we would be a good fit, we will reach back out
            and schedule a call with you.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <a
              href="#apply"
              className="btn-primary active:scale-[0.97] px-8 py-4 rounded-full font-bold transition-colors"
            >
              Send In Your Application
            </a>
            <Link
              href="/tools/three-second-test"
              className="text-sm text-[var(--text-secondary)] underline decoration-brand/60 underline-offset-4 hover:text-[var(--text-primary)] transition-colors"
            >
              Not ready? Run the free 3-second test
            </Link>
          </div>
        </div>
      </section>

      {/* Advantage */}
      <section className="border-b border-dashed border-[var(--border)] px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <SectionKicker n="01" label="The Advantage" />
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-12">
            Why the top spot beats renting ads
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {advantages.map((a) => (
              <div key={a.title} className="glass-card p-7 h-full">
                <h3 className="font-display uppercase text-xl mb-3 text-brand">{a.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="border-b border-dashed border-[var(--border)] px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <SectionKicker n="02" label="Before and After" />
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-12">
            What moving up looks like
          </h2>
          <RankShift />
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-dashed border-[var(--border)] px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <SectionKicker n="03" label="How It Works" />
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-12">
            Four steps, no mystery
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {steps.map((s) => (
              <div key={s.n} className="border border-dashed border-[var(--border)] rounded-lg p-7">
                <p className="text-[11.5px] uppercase tracking-[0.16em] text-brand mb-3" style={mono}>
                  Step {s.n}
                </p>
                <h3 className="font-display uppercase text-xl mb-3">{s.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-dashed border-[var(--border)] px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <SectionKicker n="04" label="FAQ" />
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-12">
            Straight answers
          </h2>
          <AccordionPrimitive.Root type="single" collapsible defaultValue={faqs[0]?.q} className="space-y-3">
            {faqs.map((faq) => (
              <AccordionPrimitive.Item key={faq.q} value={faq.q} className="group relative rounded-2xl overflow-hidden transition-colors duration-300">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand/30 to-transparent opacity-0 transition-opacity duration-300 blur-lg -z-10 group-hover:opacity-50 group-data-[state=open]:opacity-100" />
                <div className="glass-card">
                  <AccordionPrimitive.Header>
                    <AccordionPrimitive.Trigger className="w-full flex justify-between items-start gap-4 text-left px-6 py-5 transition-colors">
                      <span className="font-semibold text-base md:text-lg text-[var(--text-primary)]">{faq.q}</span>
                      <span className="text-brand text-xl leading-none transition-transform duration-300 shrink-0 mt-1 group-data-[state=open]:rotate-45" aria-hidden="true">+</span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionPrimitive.Content forceMount className="grid transition-[grid-template-rows] duration-300 ease-out data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <div className="px-6 pb-5 text-[var(--text-secondary)] leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </div>
                  </AccordionPrimitive.Content>
                </div>
              </AccordionPrimitive.Item>
            ))}
          </AccordionPrimitive.Root>
        </div>
      </section>

      {/* Application */}
      <section id="apply" className="px-4 sm:px-6 lg:px-8 py-20 md:py-28 section-premium">
        <div className="max-w-3xl mx-auto">
          <SectionKicker n="05" label="Apply" />
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-4">
            Send in your application
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-xl">
            If we think we would be a good fit, we will reach back out and schedule a call
            with you.
          </p>
          <ApplicationForm />
        </div>
      </section>

      </main>
      <SiteFooter />
    </div>
  );
}
