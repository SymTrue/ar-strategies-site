# Design Visibility & Comprehension Upgrade Plan

Handoff document. Written by Fable 5 on 2026-07-16 after auditing the design library,
tokens, and every major surface. Executor: a smaller model (Sonnet). Follow it in
order; every item names its file, its exact change, and its acceptance check.

---

## 0. Execution rules (read first)

1. **Working directory:** `E:\AR STRATEGIES\arstrategies-site` (its own git repo, branch `main`).
2. **Never use em dashes** in any output: not in copy, not in titles, not in code
   comments. Use commas, colons, periods. This is a standing owner rule.
3. **Identity preservation wins.** The brand system is committed: Anton display
   (uppercase), Manrope body, orange brand ramp (`--brand` #f97316 dark / #ea580c light),
   OLED-warm dark base (#0a0806), dashed borders + mono kicker labels ("blueprint"
   language). Do NOT introduce new fonts, new palettes, or the pink/Calistoga
   design-system suggestion that any tool emits. Extend the existing system only.
4. **Banned patterns** (from the design system rules): gradient text
   (`background-clip: text`), colored side-stripe borders, identical icon-card grids,
   32px+ card radii, `border + large soft shadow` pairs, emoji as icons, decorative
   stripe/grid backgrounds. If an edit tempts you toward one of these, restructure.
5. **Both themes always.** Every visual change must be checked in dark AND light mode
   (`data-theme` attribute, toggle in header). Raw Tailwind grays on the homepage have
   light-mode remaps in `app/globals.css` (lines ~187-200); token colors are already
   AA-compliant in both themes. New text must use semantic tokens
   (`--text-primary/secondary/tertiary`), never raw hex.
6. **Build gate:** after each workstream, run `npx next build` from the site root.
   It must exit 0 before you commit.
7. **Verification protocol for canvases:** screenshots time out in the preview
   browser and `document.visibilityState` is `"hidden"` there, which suspends
   `requestAnimationFrame`. Do NOT trust screenshots. Verify canvas rendering via
   pixel readback in `javascript_tool`:
   ```js
   const el = document.querySelector('canvas');
   const d = el.getContext('2d').getImageData(0,0,el.width,el.height).data;
   let nt = 0; for (let i=3;i<d.length;i+=4) if (d[i]>10) nt++;
   nt; // must be > 0 after the fix, 0 = blank canvas
   ```
   Dev server: launch config `ar-strats-site` in `E:\STRIKE DEN\B-STRIKE DEN\.claude\launch.json`.
8. **Commits:** one commit per workstream (A, B, C, D), message prefix
   `design:`. Do not push. Do not touch `claude-seo/`, `graphify-out/`, `app/admin/`.
9. **Out of scope** (tracked elsewhere, do not do here): BlogPosting schema,
   areaServed/Karachi case-study contradiction, NAP/phone number, second case study,
   Resend email work, any video re-rendering in `video-production/`.

---

## 1. Current-state inventory (verified 2026-07-16)

**Design library reality check:**
- 21st.dev account: no team registry. 4 bookmarks (Wave Background #1823, Gradient
  Shimmer #16788, magic dust shader #17217, Interactive Folder Gallery #16368).
  Component code retrieval is PAID: do not call `get_component`. Section 6 gives a
  from-scratch spec for the only one worth using.
- In-repo library: `app/components/ui/` holds `liquid-metal.tsx` (WebGL,
  used SIX times in `app/page.tsx`: lines ~682, 821, 904, 927, 950),
  `animated-gradient.tsx` (used only on `/showcase`), `theme-toggle.tsx`.
- Radix (`react-accordion`, `dialog`, `form`, `select`, `slot`) and
  class-variance-authority are installed but imported NOWHERE. The FAQ accordion is
  hand-rolled `useState` in `app/page.tsx`.
- CSS utility system in `app/globals.css`: `kicker-chip/kicker-n/kicker-sep/kicker-line`
  (line ~618), `glass-card`, `btn-primary`, `section-premium`, `brand-watermark`,
  `hero-display`, `touch-target`, `timeline-track`. Reuse these, do not duplicate.

**Known-good:** token contrast (dark tertiary ~7.6:1, light tertiary ~4.9:1), 17px
body at 1.65 line-height, `text-wrap: pretty`, light-mode gray remaps, reduced-motion
support in `useReveal`, `DiagnosticNet` paints synchronously (commit `c0246fd`).

**Known-weak (this plan):** 10px mono labels (15 instances), six WebGL canvases on one
page, `NeuralNet` still RAF-dependent, mechanism detail pages use an older visual
language and prose walls, videos have no posters or captions, FAQ lacks keyboard/ARIA
semantics, two unverifiable statistics in mechanism copy, one hustle-culture tagline.

---

## 2. Workstream A: Legibility and attention budget (P1)

### A1. Mono-label floor: 10px to 11.5px
The blueprint mono labels are the signature of the subpages but sit below the 12px
readability floor at 0.2em+ tracking. Change every `text-[10px]` whose content is
load-bearing (section labels, readout headers, pass/fail counts) to `text-[11.5px]`
and reduce tracking from `tracking-[0.25em]`/`tracking-[0.2em]` to `tracking-[0.16em]`.

Files and counts (grep `text-\[10px\]`): `app/blog/page.tsx` (2),
`app/blog/[slug]/page.tsx` (3), `app/mechanisms/page.tsx` (4),
`app/tools/three-second-test/page.tsx` (6). Purely decorative instances (the network
diagram legend `● Live ○ In production`) may stay at 10px.

On the test tool specifically, the per-surface status chip (`PASS · 2/3`,
`0/3 answered`) is functional feedback: bump it to `text-xs` (12px) and change its
unanswered-state color from `--text-tertiary` to `--text-secondary`.

**Accept:** no functional label below 11.5px on those four surfaces; visual rhythm
still reads as the same blueprint system in both themes.

### A2. Fix NeuralNet blank-canvas bug (mirror commit c0246fd)
`app/components/NeuralNet.tsx` paints only inside its RAF loop, so the homepage hero
is a blank void for any visitor whose tab is backgrounded at load (and in preview
embeds). Apply the exact pattern already shipped in
`app/components/DiagnosticNet.tsx` (see commit `c0246fd`):
- extract the frame-painting body so it can be called directly;
- call it once synchronously after setup (one static frame is enough; the drift
  animation can stay RAF-driven);
- add a `visibilitychange` listener that repaints once (and lets the RAF loop resume)
  when the document becomes visible;
- repaint after any resize that resets `canvas.width/height`.

**Accept:** pixel readback (rule 7) on `/` returns nonTransparent > 0 while
`visibilityState === "hidden"`. Reduced-motion path unchanged.

### A3. Attention budget: at most 2 WebGL canvases on the homepage
Six `LiquidMetal` instances compete with the hero NeuralNet, the content, and each
other, and cost six GL contexts. Keep exactly one instance as a focal accent (the
one inside the `#contact` section; if none is in `#contact`, keep the first
instance and move on). Replace the other five with the existing static `IconTile`
component (already in `app/page.tsx`, ~line 256) or a plain `glass-card` glyph,
matching whatever text/icon each instance currently wraps.

**Accept:** `grep -c "<LiquidMetal" app/page.tsx` returns 1; homepage still builds;
the five replaced spots render a static branded tile in both themes.

### A4. Prose measure on mechanism detail pages
`app/mechanisms/[id]/page.tsx` renders `whyWorks` and `howWeUseIt` paragraphs inside
`max-w-4xl` (~100+ chars per line at 17px). Wrap the paragraph containers (not the
section shell) in `max-w-[68ch]`.

**Accept:** longest body line on `/mechanisms/positioning` is 60-75 characters.

---

## 3. Workstream B: Comprehension structure (P1/P2)

### B1. Mechanism detail pages: unify language, break the prose walls
These pages predate the blueprint system and it shows (solid borders, `bg-brand/20`
pill, plain `text-5xl font-bold` headings). This is the largest single
consistency win on the site.

1. **Extract shared data.** Create `app/mechanisms/mechanisms-data.ts` exporting the
   `mechanismsData` record currently hardcoded inside `[id]/page.tsx`, plus a
   `mechanismMeta` map (title + description) consumed by `[id]/layout.tsx` (which
   currently duplicates titles; this duplication already caused one shipped bug).
   `page.tsx` stays `'use client'` and imports the data; `layout.tsx` (server)
   imports only the meta.
2. **Restyle the header** to the blueprint system: replace the pillar pill with a
   `kicker-chip` (`<span className="kicker-chip"><span className="kicker-n">{pillar}</span>...`),
   set the h1 to `font-display uppercase` with the site's clamp scale, and switch
   section dividers from solid `border-[var(--border)]` to the dashed treatment used
   on `/mechanisms`.
3. **Add a takeaway callout** directly under the video: one sentence per mechanism in
   a dashed-border box with mono label `IN ONE SENTENCE`. Use exactly:
   - pattern-interruption: "The brain deletes the expected, so different beats louder."
   - mental-availability: "Customers choose whoever comes to mind first, not whoever is best."
   - positioning: "You are chosen relative to alternatives, so own one clear difference."
   - familiarity-effect: "Every exposure lowers the risk a buyer assigns to your name."
   - decision-architecture: "More options create fewer choosers; make one path obvious."
4. **Break the walls:** inside `whyWorks`, insert an `h3` (font-display, ~text-2xl,
   uppercase) before the final third of each page's text. Suggested subheads:
   "The mechanism" before the explanatory core and "Why it decides purchases" before
   the commercial part. Keep all body text unchanged except the C2 copy fixes below.

**Accept:** `/mechanisms/familiarity-effect` and `/mechanisms/pattern-interruption`
visually match the hub page's language; `layout.tsx` has no local title map;
build passes; titles/descriptions unchanged in page source.

### B2. Video posters and captions (biggest comprehension + a11y win)
The five explainer videos autoplay muted with no poster and no captions, so their
voice-over content is invisible to deaf users, sound-off viewers, and search engines.

1. **Posters:** for each id in {pattern-interruption, mental-availability,
   positioning, familiarity-effect, decision-architecture}, extract the mechanism
   scene frame with ffmpeg into `public/videos/posters/{id}.jpg`:
   ```bash
   ffmpeg -y -ss <T> -i public/videos/<id>.mp4 -frames:v 1 -q:v 3 public/videos/posters/<id>.jpg
   ```
   with T = 10 (PI), 10 (MA), 12 (POS), 10 (FE), 10 (DA). Eyeball each jpg (Read the
   file); it must show the mechanism diagram, not a text-only or near-black frame;
   nudge T ±2s if needed. Add `poster="/videos/posters/{id}.jpg"` and
   `preload="metadata"` to the `<video>` in `[id]/page.tsx`.
2. **Captions:** create `public/videos/captions/{id}.vtt` and add inside the video:
   `<track kind="captions" srcLang="en" label="English" default src="/videos/captions/{id}.vtt" />`.
   Cue text below is the whisper-verified voice-over, and cue windows are the scene
   boundaries (frames at 30fps, converted to mm:ss.mmm). Split each beat's sentences
   evenly across its window (2 cues per beat is fine); exact sub-timing is not
   critical because each window is generous.

   **pattern-interruption.vtt** (windows 0.00-3.33 / 3.33-15.93 / 15.93-28.13 / 28.13-32.07 / 32.07-41.57):
   - Hook: "You're not being ignored. You're being filtered."
   - Mechanism: "It filters anything that matches a known pattern. That's how it survives an infinite feed. Pattern interruption is the deliberate break, the half second something looks different enough to earn a second glance."
   - Value: "Look at your last five posts. Same layout. Same tone. Same colors. The brain already learned to skip them before reading a word. Break one pattern on purpose."
   - Takeaway: "If it looks like everything else, it gets seen like nothing."
   - Close: "Perception and attention intelligence. If you want a second look at yours, the audit is free and there's no pitch. Just arstrategies.com."

   **mental-availability.vtt** (0.00-4.73 / 4.73-16.20 / 16.20-28.90 / 28.90-33.17 / 33.17-43.77):
   - "Your competitor isn't better than you. They're just more available."
   - "Mental availability is who comes to mind first, not who's best. Memory is real estate. Whoever occupies the space first wins, before quality is ever compared."
   - "Think about the last time you needed a service and only one name came to mind. That wasn't loyalty. That was mental availability. Build it before you ever have to compete on price."
   - "Being good isn't a strategy. Being remembered is."
   - "Perception and attention intelligence. If you want to know whether you're the name that comes to mind, the audit is free. No pitch. Just arstrategies.com."

   **positioning.vtt** (0.00-4.17 / 4.17-19.13 / 19.13-32.33 / 32.33-36.17 / 36.17-46.33):
   - "You don't have a traffic problem. You have a positioning problem."
   - "Markets reward the obvious choice. Positioning is the space you occupy in someone's mind, relative to every alternative they could pick instead. When that space is unclear, more traffic just means more people confirming they don't know what you do."
   - "Before spending another dollar on ads, ask one question. If a stranger saw your page for three seconds, could they say what you do and why it's different? More traffic multiplies the confusion. Clarity fixes it."
   - "Clarity earns attention. Confusion just rents it."
   - "Perception and attention intelligence. If you want a clear read on where you stand, the audit is free. No pitch. Just arstrategies.com."

   **familiarity-effect.vtt** (0.00-3.93 / 3.93-16.20 / 16.20-26.00 / 26.00-30.13 / 30.13-40.87):
   - "You trust brands you've never bought from. Here's why."
   - "The brain mistakes recognition for safety. Every exposure leaves a trace. Every trace lowers the risk a buyer assigns to your name. Psychologists call it the mere exposure effect."
   - "Name a brand you'd never question. Now count how many times you saw it before you ever bought. Familiarity did the selling long before the product could."
   - "Trust isn't earned in one impression. It's accumulated."
   - "Perception and attention intelligence. If you want to know how familiar your brand actually is, the audit is free. No pitch. Just arstrategies.com."

   **decision-architecture.vtt** (0.00-4.80 / 4.80-16.33 / 16.33-26.27 / 26.27-30.93 / 30.93-41.33):
   - "Your pricing page has six options. That's why nobody picks one."
   - "Every option is a comparison the buyer has to run. Past a few, deciding costs more than choosing is worth. And when deciding gets expensive, not choosing feels safe."
   - "Count the decisions on your homepage. Every button, every plan, every maybe. Cut until one path is obvious. Confidence follows clarity."
   - "A confused buyer doesn't choose wrong. They just don't choose."
   - "Perception and attention intelligence. If you want to see where buyers stall on your page, the audit is free. No pitch. Just arstrategies.com."

3. **VideoObject schema**, now that its required fields exist. In `[id]/layout.tsx`
   (server component), inject per-page JSON-LD with `name` (mechanism title),
   `description` (meta description), `thumbnailUrl` (poster URL, absolute),
   `uploadDate: "2026-07-16"`, `contentUrl` (absolute mp4 URL), and `duration`
   (ISO8601: PT42S PI, PT44S MA, PT46S POS, PT41S FE, PT41S DA).

**Accept:** every mechanism page shows a poster before play, captions toggle on and
render matching the audio, `curl /mechanisms/pattern-interruption` HTML contains
`VideoObject`, build passes.

### B3. FAQ accordion: adopt the installed Radix primitive
Replace the hand-rolled `useState` accordion in `app/page.tsx` (`faqs.map` section,
`openFaq` state) with `@radix-ui/react-accordion` (`type="single" collapsible`).
Preserve the existing visual shell exactly: `glass-card`, the hover glow div, the
plus/cross indicator (rotate it via `data-state=open` styling instead of JS). This
gives keyboard navigation, correct `aria-expanded`/`aria-controls`, and focus
management for free, and finally justifies the dependency.

**Accept:** FAQ operates with arrow keys + Enter/Space; screen-reader semantics
present in DOM (`role`, `aria-expanded`); visuals indistinguishable from before in
both themes; the FAQPage JSON-LD block in `page.tsx` is untouched.

### B4. Homepage comprehension beats
Two small additions, no restructuring:
1. Under the `#services` h2 ("The work we do. So you stop doing it.") add one
   standfirst line, `text-[var(--text-secondary)] max-w-xl`:
   "Three services, one outcome: your phone rings and you can see why."
2. In the hero, under the secondary "3-second test" link, nothing new. Instead give
   the primary email form an explicit no-risk microcopy line beneath it,
   `text-sm text-[var(--text-tertiary)]`:
   "Free audit within 24 hours. No call required, no lock-in."
   (Replaces nothing; add only if no similar line already renders near the form.)

**Accept:** both lines present, no layout shift on 375px, no em dashes.

---

## 4. Workstream C: Copy fixes (copy-editing sweeps, exact strings)

Apply exactly; these came from Prove It / voice sweeps of the live copy.

| # | File / location | Current | Replace with |
|---|---|---|---|
| C1 | `app/page.tsx` footer via `app/components/SiteFooter.tsx`, bottom bar | `Dominate your market.` | `Be the name your city remembers.` (hustle-culture tone violates brand voice) |
| C2a | `app/mechanisms/[id]/page.tsx`, pattern-interruption `whyWorks` | `That's why unexpected headlines outperform expected ones by 2-3x, why color breaks...` | `That's why unexpected headlines outperform expected ones, why color breaks in monochrome designs stop scrollers, and why contrarian claims get shared more than safe statements.` (drop the unverifiable 2-3x) |
| C2b | same file, mental-availability `whyWorks` | `Research shows: 70% of purchase decisions are influenced by how available your business is in the customer's mind. Not by your ads, not by your website, not by how good you are.` | `Watch real buying decisions and the pattern is hard to miss: availability in memory decides more purchases than ads, websites, or even quality. Not because those don't matter, but because they never get considered if you aren't recalled.` (drop the fabricated 70%) |
| C3 | `app/page.tsx` hero paragraph | (44-word two-sentence block) | Keep sentence 1. Tighten sentence 2 to: `Done for you, so the phone rings while you run the business.` if not already identical. |
| C4 | flag only, do NOT change | Hero: `In 2026, we audited 50+ local businesses...` and blog masthead `auditing 50+ local businesses` | Leave as-is but note in the commit body: "50+ audits claim retained; owner to confirm accuracy." |

**Accept:** `grep -rn "Dominate your market\|by 2-3x\|70% of purchase"` in `app/`
returns nothing; no em dashes introduced (`grep -rn "—" app --include="*.tsx"` shows
no NEW hits versus the pre-workstream baseline).

---

## 5. Workstream D: System hygiene (P3, optional if time allows)

1. **Dead dependency decision:** after B3, `@radix-ui/react-accordion` and
   `@radix-ui/react-slot` are used. If `dialog`, `form`, `select`,
   `class-variance-authority` remain unimported (`grep -rn` to confirm), remove them
   from `package.json` in this workstream's commit. If any is now used, keep it.
2. **`/showcase` page:** it is publicly crawlable, absent from the sitemap, and uses
   `animated-gradient` nowhere else referenced. Do not delete. Add
   `robots: { index: false, follow: false }` metadata to `app/showcase/page.tsx`
   (it is an internal demo surface).
3. **Document the system:** append a short section to this file (or create
   `docs/DESIGN-SYSTEM-NOTES.md`) listing the utility classes inventory from
   section 1 so future sessions stop rediscovering it.

---

## 6. Optional enhancement (only if A-D are done and budget remains)

**Hero keyword shimmer, built from scratch.** Inspired by the bookmarked 21st.dev
"Gradient Shimmer" (do NOT fetch its paid code). Spec: on the hero h1's
`finds first` span, add a Web Animations API sweep of a background gradient
(`--brand-light` to `--brand` to `--brand-light`, background-clipped to text is
BANNED, so instead animate a soft `text-shadow`/`filter: brightness()` pulse OR an
underline gradient sweep on a pseudo-element; choose the underline sweep). Constant
~6s period, pauses when off-screen (`IntersectionObserver`) and under
`prefers-reduced-motion` renders a static brand-colored underline. One element only.
If it reads as noise next to the NeuralNet, delete it; the hero already has motion.

---

## 7. Final QA checklist (run once, before the last commit)

- [ ] `npx next build` exits 0.
- [ ] `grep -rn "—" app --include="*.tsx" --include="*.ts"` shows no new instances.
- [ ] Homepage: exactly 1 LiquidMetal; hero canvas passes pixel readback while hidden.
- [ ] `/mechanisms/decision-architecture`: poster visible, captions render, kicker-chip
      header, VideoObject in page source.
- [ ] FAQ fully keyboard-operable; `aria-expanded` toggles in DOM.
- [ ] 375px viewport: no horizontal scroll on `/`, `/mechanisms/positioning`,
      `/tools/three-second-test`.
- [ ] Light theme spot-check of every touched surface.
- [ ] Reduced motion: hero and test tool still render full content statically.
- [ ] Commits: `design: legibility + attention budget (A)`,
      `design: comprehension structure, posters, captions (B)`,
      `design: copy fixes from editing sweeps (C)`, `design: system hygiene (D)`.
