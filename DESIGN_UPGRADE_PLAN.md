# Design Upgrade Plan — arstrategies-site

Handoff document. Execute phases in order. Every code block is ready to use, but **read the target file section before each edit** — copy may have drifted.

---

## Ground rules (read first)

1. **Work only in `app/`.** Never stage or commit: `src/` (stray Remotion experiment), `package.json`, `package-lock.json`, `claude-seo`, or this plan file.
2. **`npm run build` FAILS with a pre-existing type error** in `src/remotion/components/AnimatedInfographic.tsx`. This is unrelated and expected — do not try to fix it. Verify your work with `npx eslint app/page.tsx app/globals.css` and the dev server instead.
3. **Dev server is already running** (launch config `arstrategies-site`, http://localhost:62682). Use the Browser pane preview tools. **Screenshots time out** (WebGL canvases hang the headless renderer) — verify via `get_page_text`, `read_page`, and `read_console_messages` instead. Console errors about `eval()` / CSP and "script tag while rendering" are pre-existing noise; ignore them.
4. **Tailwind v4 pitfall:** unlayered CSS in `globals.css` beats Tailwind utilities. Never add bare element selectors with box-model/typography properties (a previous `button { padding: … }` rule broke every CTA). New styles go in **classes**.
5. **Anton (`--font-display`) is loaded at weight 400 only.** Do not add `font-bold` to display text expecting a heavier cut.
6. **Accessibility is non-negotiable:** keep `.btn-primary` tokens for CTAs (AA contrast), keep focus rings, and every new animation must respect `prefers-reduced-motion` (a global reduce block already exists in `globals.css`; note where extra explicit handling is called out below).
7. **Light mode override hazard:** `[data-theme="light"] [class*="bg-white/"]` rewrites any `bg-white/*` utility. For new surfaces prefer `var(--surface)` / explicit tokens.
8. Commit per phase (3 commits), then `git push origin main` (credentials are cached; push from Bash works). Follow whatever co-author trailer your harness specifies.

**Orientation reads before starting:** `app/page.tsx` (whole file), `app/globals.css` (whole file), and locate the reveal helpers: `grep -rn "AnimatedSection\|useReveal\|useHeroIntro" app/` — read that file so you can mimic the existing in-view animation patterns.

---

## Phase 1 — Typography scale + editorial system

### 1.1 Fluid hero display type

Add to `globals.css` (near `.font-display`):

```css
.hero-display {
  font-size: clamp(3.25rem, 9vw, 8.5rem);
  line-height: 0.92;
  letter-spacing: 0.005em;
}
```

In `page.tsx`, on the hero `<h1>` replace `text-5xl md:text-6xl leading-[0.95]` with `hero-display` (keep `font-display uppercase mb-6 text-balance` and `data-intro`).

Note: the existing `@media (max-width: 640px) h1 { font-size: clamp(...) }` rule does NOT need changing — `.hero-display` (class specificity) beats the `h1` element selector.

### 1.2 Numbered section kickers

Add a component in `page.tsx` (near `IconTile`):

```tsx
function SectionKicker({ n, label }: { n: string; label: string }) {
  return (
    <div data-reveal className="flex items-center gap-3 mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
      <span className="h-px w-8 bg-brand" />
      <span className="text-brand tabular-nums">{n}</span>
      <span>{label}</span>
    </div>
  );
}
```

Insert directly above the `<h2>` of each section:
- `#services`: `<SectionKicker n="01" label="Services" />`
- `#process`: `<SectionKicker n="02" label="Process" />`
- `#why`: `<SectionKicker n="03" label="Why Us" />`
- `#faq`: `<SectionKicker n="04" label="FAQ" />`
- `#contact`: `<SectionKicker n="05" label="Free Audit" />` (this section is centered — add `justify-center` to the kicker's flex here).

### 1.3 Footer sign-off + watermark stacking fix

In the `<footer>` (has class `brand-watermark`), add as the FIRST child, and add `relative z-10` to the existing content wrapper div(s) so text paints above the watermark `::after`:

```jsx
<div className="max-w-7xl mx-auto relative z-10 mb-14">
  <p className="font-display uppercase leading-[0.95] text-[clamp(2.5rem,6vw,5rem)] text-balance">
    Stop being <span className="text-brand">ignored.</span>
  </p>
</div>
```

### 1.4 Brand selection color

Add to `globals.css`:

```css
::selection {
  background: var(--brand);
  color: #ffffff;
}
```

**Verify:** eslint clean → reload preview → `get_page_text` shows kickers + footer line → console has no NEW errors.

**Commit:** `Scale up display typography, add editorial kickers and footer sign-off`

---

## Phase 2 — Motion: marquee, process timeline, counters, FAQ

### 2.1 Hero pain-phrase marquee

`globals.css`:

```css
.marquee {
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent);
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marqueeScroll 30s linear infinite;
}

@keyframes marqueeScroll {
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
}
```

`page.tsx` — insert inside the hero section, after the "No credit card required…" fine-print `<p>`. Do **not** add `data-intro` unless you've confirmed how `useHeroIntro` selects elements:

```jsx
<div className="marquee mt-16" aria-hidden="true">
  <div className="marquee-track text-xs uppercase tracking-[0.25em] text-gray-500">
    {[0, 1].map((dup) => (
      <div key={dup} className="flex items-center gap-8 pr-8">
        {['Wasted spend', 'Dead clicks', 'Invisible ads', 'Vanity metrics', 'Guesswork budgets'].map((t) => (
          <span key={t} className="flex items-center gap-8 whitespace-nowrap">
            {t}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
        ))}
      </div>
    ))}
  </div>
</div>
```

### 2.2 Process timeline fill

Shared in-view hook in `page.tsx` (uses `classList`, avoiding the `react-hooks/set-state-in-effect` lint error — do not rewrite with setState):

```tsx
function useInViewClass<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in-view');
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
```

Add `useEffect, useRef` to the react import.

`globals.css`:

```css
.timeline-track {
  position: relative;
  height: 2px;
  margin-bottom: 2.5rem;
  border-radius: 999px;
  background: var(--border);
  overflow: hidden;
}

.timeline-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--brand-light), var(--brand), var(--brand-ember));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;
}

.timeline-track.in-view .timeline-fill {
  transform: scaleX(1);
}
```

In the `#process` section, between the `<h2>` and the steps grid:

```jsx
<div ref={timelineRef} className="timeline-track hidden lg:block" aria-hidden="true">
  <div className="timeline-fill" />
</div>
```

with `const timelineRef = useInViewClass<HTMLDivElement>();` in `Home`. Also add `tabular-nums` to the step-number class (`{step.n}`).

(The global reduced-motion block zeroes the transition — covered.)

### 2.3 Animated stat counters

Component in `page.tsx`. Note the `requestAnimationFrame(() => setVal(to))` wrapper in the reduced-motion branch — it exists to satisfy the `set-state-in-effect` lint rule; keep it:

```tsx
function CountUp({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          raf = requestAnimationFrame(() => setVal(to));
          return;
        }
        const t0 = performance.now();
        const dur = 900;
        const tick = (t: number) => {
          const p = Math.min((t - t0) / dur, 1);
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{val}{suffix}
    </span>
  );
}
```

In the stats cards (search for `$2K–$8K` and `30 days`):
- `$2K–$8K` → `<CountUp to={2} prefix="$" suffix="K" />–<CountUp to={8} prefix="$" suffix="K" />`
- `30 days` → `<CountUp to={30} /> days`

### 2.4 FAQ smooth expand

Read the FAQ accordion JSX first (search `openFaq`). Wrap each answer in the grid-rows technique and add a rotating plus indicator on the question button:

```jsx
<div className={`grid transition-[grid-template-rows] duration-300 ease-out ${openFaq === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
  <div className="overflow-hidden">
    {/* existing answer markup */}
  </div>
</div>
```

Indicator (inside the button, right-aligned):

```jsx
<span className={`text-brand text-xl leading-none transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`} aria-hidden="true">+</span>
```

Keep the existing `aria-expanded` attribute. If answers were conditionally rendered (`{openFaq === i && …}`), render them always now (the grid collapse hides them) — that's required for the animation.

**Verify:** eslint clean → reload → confirm marquee text appears once in `get_page_text` (it will show phrases), FAQ toggles via `computer` click on a question + `read_page` shows answer, no new console errors.

**Commit:** `Add hero marquee, process timeline fill, stat counters, and FAQ animation`

---

## Phase 3 — Surfaces: gradient card borders, light-mode art direction, scrollspy

### 3.1 Gradient borders on glass cards

Add tokens — in `:root`:

```css
  --card-border-gradient: linear-gradient(160deg, rgba(249, 115, 22, 0.45), rgba(255, 255, 255, 0.08) 45%, rgba(255, 255, 255, 0.03) 100%);
```

and in `[data-theme="light"]`:

```css
  --card-border-gradient: linear-gradient(160deg, rgba(194, 65, 12, 0.4), rgba(0, 0, 0, 0.08) 45%, rgba(0, 0, 0, 0.04) 100%);
```

Rework `.glass-card` (replace the `background` and `border` lines only; keep radius/blur/transition):

```css
.glass-card {
  border: 1px solid transparent;
  background:
    linear-gradient(var(--surface), var(--surface)) padding-box,
    var(--card-border-gradient) border-box;
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  background:
    linear-gradient(var(--surface-hover), var(--surface-hover)) padding-box,
    var(--card-border-gradient) border-box;
  /* keep existing hover box-shadow + translateY */
}
```

Delete the now-dead `border-color: var(--border-hover);` from the hover rule.

### 3.2 Light-mode sectional warmth

Light mode currently reads as a bleached dark mode. Give it "print" character — append to `globals.css`:

```css
[data-theme="light"] {
  --grain-opacity: 0.05;
}

[data-theme="light"] #process.section-premium {
  background:
    radial-gradient(ellipse 65% 34rem at 92% 20%, rgba(234, 88, 12, 0.12), transparent 70%),
    linear-gradient(180deg, #fff7ee 0%, #ffffff 60%);
}

[data-theme="light"] #why.section-premium {
  background:
    radial-gradient(ellipse 58% 34rem at 6% 50%, rgba(234, 88, 12, 0.1), transparent 72%),
    #ffffff;
}
```

(Note: `--grain-opacity` already exists in the light block — **edit the existing value** to `0.05` rather than adding a duplicate declaration.)

### 3.3 Nav scrollspy

Hook in `page.tsx`:

```tsx
function useScrollSpy(hrefs: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    hrefs.forEach((href) => {
      const el = document.getElementById(href.slice(1));
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return active;
}
```

In `Home`: `const activeSection = useScrollSpy(navLinks.map((l) => l.href));` — but note `navLinks` is defined inside the component; either hoist `navLinks` to module scope (it's static — preferred) or pass a static array.

Desktop nav link classes become:

```jsx
className={`transition-colors ${activeSection === link.href
  ? 'text-[var(--text-primary)] underline decoration-brand decoration-2 underline-offset-8'
  : 'hover:text-white'}`}
```

**Verify:** eslint clean → reload → toggle theme via the theme button (`read_page` → find "Switch to light mode" → click) and confirm no console errors in either theme → scroll-spy: `javascript_tool` `document.querySelector('#process').scrollIntoView()` then `read_page` the nav to check the active class applied.

**Commit:** `Add gradient card borders, light-mode art direction, and nav scrollspy`

Then: `git push origin main`.

---

## Explicitly OUT of scope

- Magnetic/cursor-follow button effects (cut for scope).
- Custom scrollbars.
- Any hero shader replacement (the masked-headline idea needs design review — skip).
- Customer results / testimonials (user has none yet).
- Anything in `src/`, Remotion, or package manifests.

## Final QA checklist

- [ ] `npx eslint app/page.tsx app/globals.css` → 0 errors
- [ ] Page renders in both themes, no new console errors (ignore pre-existing eval/CSP + script-tag warnings)
- [ ] Hero headline dramatically larger, no horizontal overflow at 375px (use `resize_window` preset mobile + `read_page`; screenshots will time out — don't use them)
- [ ] Marquee animates; frozen under reduced motion
- [ ] Counters animate once; show final values under reduced motion
- [ ] FAQ opens/closes smoothly; `aria-expanded` still correct
- [ ] All 4 CTAs still use `.btn-primary` (untouched)
- [ ] 3 commits pushed to `main`; `src/`, `package.json`, `package-lock.json`, `claude-seo`, and this file NOT committed
