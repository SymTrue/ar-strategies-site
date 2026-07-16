# Design System Notes

Reference for the utility class system already in `app/globals.css`. Reuse these,
do not duplicate them. Written after the design upgrade pass in
`docs/DESIGN-UPGRADE-PLAN.md`.

## Identity

- Display font: Anton (uppercase, `font-display`). Body: Manrope.
- Brand color: `--brand` (#f97316 dark / #ea580c light).
- Dark base: OLED-warm #0a0806, not pure black.
- Motif: dashed borders and mono-font kicker labels ("blueprint" language),
  not solid borders or sans-serif labels.
- Semantic text tokens: `--text-primary`, `--text-secondary`, `--text-tertiary`.
  Always use these for new text, never raw hex or raw Tailwind grays (the
  homepage's raw grays have light-mode remaps in `app/globals.css` lines ~187-200,
  which is legacy debt, not a pattern to copy).

## Utility classes

| Class | Purpose |
|---|---|
| `.kicker-chip` | Dashed-border pill, mono label, used for section eyebrows (`<span class="kicker-chip"><span class="kicker-n">01</span><span class="kicker-sep">/</span>Services</span>`) |
| `.kicker-n` | The numeric/id part inside a kicker-chip, colored `--brand` |
| `.kicker-sep` | The `/` separator inside a kicker-chip, dimmed |
| `.kicker-line` | Thin brand-gradient rule that draws in on scroll (`.kicker-root.in-view`) |
| `.glass-card` | Standard card surface: translucent background, hover/active states baked in |
| `.btn-primary` | Primary CTA button styling |
| `.section-premium` | Section background treatment (dotted texture via `::before`) |
| `.section-dashed` | Dashed top border between sections (`border-top: 1px dashed ... !important`) |
| `.brand-watermark` | Large faint brand mark, decorative background element |
| `.hero-display` | Hero heading clamp/scale |
| `.touch-target` | Minimum touch target sizing |
| `.timeline-track` / `.timeline-fill` | Scroll-driven progress track |

## Banned patterns

Gradient text (`background-clip: text`), colored side-stripe borders, identical
icon-card grids, 32px+ card radii, `border + large soft shadow` pairs, emoji as
icons, decorative stripe/grid backgrounds. Do not introduce a new font or palette;
extend the existing system only.

## Radix usage

`@radix-ui/react-accordion` is used for the homepage FAQ (`app/page.tsx`). It
replaced a hand-rolled `useState` accordion in the design upgrade pass: same
visual shell (`glass-card`, glow div, plus/cross rotate, `grid-template-rows`
collapse animation), now driven by Radix's `data-state` attribute instead of JS
state, which gets keyboard nav and ARIA semantics for free.

`@radix-ui/react-dialog`, `@radix-ui/react-form`, `@radix-ui/react-select`, and
`class-variance-authority` were installed but never imported anywhere in the
codebase and were removed from `package.json` in the system hygiene pass.
`@radix-ui/react-slot` was also removed for the same reason: nothing in the repo
uses `asChild`/`Slot` composition, despite an earlier assumption that adopting
the accordion would pull it into use.

## Height/collapse animations

Do not animate `height` directly (layout thrash). Use the `grid-template-rows`
trick: wrap content in a `grid` container that transitions
`grid-template-rows` between `0fr` and `1fr` (driven by a state class or
`data-[state=open]`), with an inner `overflow-hidden` div. Already used by the
FAQ accordion; reuse the same pattern for any future collapsible content.

## Canvas/WebGL budget

Homepage keeps exactly one `LiquidMetal` (WebGL) instance active at a time,
alongside the hero `NeuralNet` canvas. Six GL contexts on one page was the
pre-upgrade state; static `IconTile`/`glass-card` glyphs cover the same visual
role without the GPU cost. Check `grep -c "<LiquidMetal" app/page.tsx` before
adding a new instance.
