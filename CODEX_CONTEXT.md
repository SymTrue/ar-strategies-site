# AR Strategies Site — Codex Handoff Context

> Compact state snapshot for cheap upgrade analysis. Written 2026-07-11.
> Goal for reviewer: propose high-leverage upgrades (perf, conversion, code quality). Do NOT re-explore the whole tree — this doc is the map.

## What this is
Marketing landing page for **AR Strategies**, a paid-ads agency (audit → manage → scale). Single-page site + one API route for lead capture. Deployed on Vercel at `www.arstrategists.com` (note: domain spelled "arstrategi**st**s", brand is "AR Strategi**es**"). Operates **outside the USA** (relevant for schema `areaServed: "US"` — currently wrong, see Known Issues).

## Stack
- **Next.js 16.2.10** (App Router, Turbopack, RSC). ⚠️ This is a real, newer Next than training data — APIs differ. Guides live in `node_modules/next/dist/docs/`.
- **React 19.2.4**, **TypeScript 5** (strict), **Tailwind CSS v4** (`@import "tailwindcss"`, `@theme inline`, OKLCH-free — plain hex tokens).
- **Neon Postgres** via `@vercel/postgres` (raw SQL, no ORM).
- **Resend** for transactional email (2 emails per lead: owner notify + lead confirm).
- Animation: **GSAP + ScrollTrigger** AND **Framer Motion** (both present — dedupe candidate).
- WebGL shaders: **@paper-design/shaders-react** (LiquidMetal) + hand-rolled WebGL2 (AnimatedGradient).

## File map (app/ + lib/)
```
app/
  layout.tsx            # metadata, JSON-LD, fonts (Anton display / Manrope body)
  page.tsx              # ENTIRE landing page, 493 lines, 'use client'
  globals.css           # tailwind import + brand tokens (--brand #ea580c)
  design-tokens.css     # 3-layer tokens (primitive→semantic), color-orange etc.
  api/lead/route.ts     # POST lead: rate-limit → honeypot → DB save → 2x Resend
  showcase/page.tsx     # /showcase demo of the two WebGL components
  robots.ts, sitemap.ts # SEO
  components/
    useReveal.ts               # GSAP scroll-reveal hooks (useReveal, useHeroIntro)
    AnimatedSection.tsx        # Framer Motion reveal wrapper (redundant w/ useReveal)
    ShaderGradientBg.tsx       # ⚠️ DEAD — replaced by AnimatedGradient, still in repo
    GlassMorphCard.tsx         # ⚠️ imported in page.tsx:7 but UNUSED (dead import)
    ui/
      animated-gradient.tsx                     # WebGL2 gradient, 5 presets + custom
      animated-gradient-utils/webgl-error-boundary.tsx
      animated-gradient-demo.tsx
      liquid-metal.tsx                          # re-export of @paper-design LiquidMetal
      liquid-metal-demo.tsx                     # full control-panel demo
lib/
  db.ts        # saveLead(email) + updateLeadStatus(id,status), @vercel/postgres
  utils.ts     # cn() = clsx + tailwind-merge
migrations/001_create_leads_table.sql           # leads table (id, email UNIQUE, source, status, timestamps)
```

## Page structure (app/page.tsx, single file)
Nav (sticky) → Hero (AnimatedGradient bg + email form) → Services (3, divided list) → Process (4 steps) → Why Us (3 cards, LiquidMetal on hover) → Statement → FAQ (accordion, `openFaq` state) → Social Proof (3 metric cards) → Final CTA `#contact` (email form) → Footer.
- Two identical lead forms via `useLeadForm()` hook: `hero` and `cta`. Honeypot = hidden `website` field, checked client-side before fetch AND server-side in route.ts.
- CTA label: "Get My Free Audit". Both forms POST `/api/lead`.

## API: POST /api/lead (app/api/lead/route.ts)
1. In-memory `Map` rate limit: 5 req/IP/hour (⚠️ resets on cold start / not multi-instance safe — Upstash Redis is the upgrade).
2. Honeypot: if `website` non-empty → return 200 fake-success, skip processing.
3. Email regex validate.
4. `saveLead(email)` → DB row (status 'new'), ON CONFLICT bumps updated_at.
5. Resend #1 owner notify (to `LEAD_NOTIFY_EMAIL`, reply-to lead). On fail → status 'notification_failed'.
6. Resend #2 lead confirmation. Then status 'confirmed'.
- Env needed: `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`, `POSTGRES_*` (Vercel), sender `leads@arstrategists.com` (verified domain).

## Brand / design tokens
- Colors: bg `#000000`, brand orange `#ea580c` (dark `#d97757`, light `#f5a962`), text `#ffffff`.
- Fonts: Anton (`--font-display`, all-caps headings), Manrope (`--font-sans`). Via `next/font/google`.
- Aesthetic: black bg, orange accent, big uppercase display type, glassmorphism cards, WebGL motion. 3:4 social-post visual language referenced in dot-grid texture.

## Recent work (last 8 commits, newest first)
1. `38b0415` Fix 9 audit issues + dep cleanup (removed three/prisma/shadcn-ui/shadergradient/liquid-glass-js, ~66 pkgs)
2. `563d987` Integrate AnimatedGradient(hero) + LiquidMetal(cards) + /showcase
3. `9a13642` Add LiquidMetal component
4. `5eb86a9` Add AnimatedGradient component
5. `23e0d22` Liquid-glass design pass
6. `b4996ed` shadcn/ui setup (partly reverted)
7. `d03ed18` DB lead storage + spam protection
8. `11fbd21` SEO infra (Analytics, robots, sitemap, JSON-LD)

## Known issues / deferred (audit findings NOT yet fixed)
Fixed already: contact CTA restored, honeypot wired, CTA copy, FAQ animation, footer contrast, JSON-LD telephone removed + un-exported, dead-dep purge.
**Still open — good upgrade targets:**
- **#1 Metrics are fake** ("50+ audits", "$2K–$8K waste", "30 days"). User confirmed placeholder, will replace later. Also "Ad Waste Checklist ($47 value)".
- **#5 Zero proof-of-work** — no testimonials/case studies/founder bio. Weakest trust lever.
- **#6 Section order** — social proof sits after FAQ; move proof higher.
- **#8 Dual animation libs** — GSAP + Framer Motion both do scroll-reveal (~60-70KB dup). Consolidate to one.
- **Dead code** — `ShaderGradientBg.tsx` (orphaned), `GlassMorphCard` (unused import at page.tsx:7).
- **Schema `areaServed: "US"`** is wrong — company operates outside USA.
- **Rate limiter** is in-memory (not durable / not multi-instance). 
- **page.tsx is 493 lines, one file** — content arrays + all sections inline. Componentization candidate.
- **WebGL perf** — screenshot renderer repeatedly timed out on this page; heavy `backdrop-blur` + `blur-xl` + 2 live WebGL canvases. Needs real-device profiling; consider reduced-motion / lazy-mount below fold.
- **#13** FAQ schema for AI citability (Google retired FAQ rich results May 2026, still helps LLM cite).
- **#14** verify `og-cover.png` shows current branding.

## Build / run
- `npm run build` → passes clean (TS + 9 static routes). `npm run dev` (Turbopack).
- No test suite. No CI config in-repo beyond Vercel default.

## Ask for Codex
Prioritize by ROI: (a) conversion (proof, section order, real metrics slots), (b) perf (animation-lib dedupe, WebGL lazy-mount, blur cost), (c) code health (split page.tsx, delete dead code, durable rate limit). Flag anything Next-16/React-19-specific that could modernize the data/render path (e.g. server actions for the lead form instead of client fetch).
