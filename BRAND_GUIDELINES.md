# AR Strategies Brand Guidelines

**Version:** 3.0.0
**Last Updated:** 2026-07-25
**Maintained by:** AR Strategies Design System

**Palette history:** v1.0.0 specified orange (`#ea580c`) as the brand
accent — never derived from the actual logo (pure monochrome: white to
silver to grey gradient hexagon, zero orange or red). It matched Strike
Den, a case-study client whose own logo is a red/black tiger mark, not
this agency's. v2.0.0 corrected the hue to midnight purple but kept it as
a Committed, then merely-desaturated, dominant color (headline text,
solid CTA fill) — still too loud for a monochrome logo, and two source-
of-truth files (`design-tokens.css` and `globals.css`) had drifted out of
sync with different purple values. v3.0.0 ("signal graphite") is the
correction: graphite and silver carry ~90% of visual weight, derived
directly from the logo; a muted cool-steel accent is reserved for small
interactive details only. A single, tightly-scoped violet trace is kept
as an explicit exception (Section 2, rule 7) at the user's request, never
as a general brand color. All values checked for WCAG AA contrast (see
Section 13) before being written down here.

---

## 1. Brand Identity

### Mission
AR Strategies is a **Perception & Attention Intelligence Studio** that engineers how businesses become impossible to ignore. We solve positioning, perception, messaging, and memorability problems — not traffic or content problems.

### Brand Promise
Advertising systems that convert. We audit, run, and scale campaigns for local businesses ready to dominate their market.

### Brand Voice
- **Commercially intelligent** — We speak the language of revenue and measurement
- **Psychologically aware** — We understand how people actually decide
- **Intentional & insightful** — Slightly contrarian, evidence-driven
- **Observational, not opinionated** — We show, don't preach
- **Operator-led** — Built by people who've run the playbook

---

## 2. Visual Identity

### Color Palette

Sourced from the actual AR Strategies logo: a monochrome white to silver to
grey gradient hexagon. Graphite and silver are the brand; the logo, not
the accent color, is the brightest visual brand object anywhere on the
site. Signal steel is reserved for small interactive details only.

#### Primary Colors
- **Graphite-black:** `#0b0e13` — Primary background (dark theme)
- **Off-white:** `#f1f4f6` — Primary text on dark
- **Signal Steel (Brand Accent):** `#91a7b8` — small interactive details only: icons, active states, focus rings, diagram lines, hover outlines (verified 4.5:1+ against both background and surface)

#### Secondary Colors
- **Steel Light:** `#aec1d0` — Hover/focus state
- **Steel Dark:** `#536b7c` — Subtle borders and glow source; background/gradient fills, not body text (fails text contrast)

#### Neutral Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Surface | `#12171e` | Cards, elevated surfaces |
| Surface Hover | `#191f27` | Hover state on surfaces |
| Bg Deepest | `#07090d` | Root background, OLED-safe |
| Text Secondary | `#b7c0c9` | Secondary text (dark theme) |
| Text Tertiary | `#8995a1` | Muted text, captions (dark theme) |
| Border | `#27313b` | Default card/section borders (graphite, not tinted) |

#### Status Colors
- **Success:** `#10b981` — Positive actions, confirmations (unchanged, semantic, not brand)
- **Error:** `#ef4444` — Errors, warnings (unchanged, semantic, not brand; never repurpose for brand accents)

#### Primary CTA
- **Silver fill:** `#e4e9ee`, **dark text:** `#0b0e13` — the brightest interactive surface on the page. Secondary buttons stay dark with a steel border instead.

### Color Usage Rules

1. Graphite and silver account for roughly 90% of visual weight. Signal steel is the exception, not the rule.
2. Signal steel appears only on focused/interactive details: small icons, active states, focus rings, diagram lines, hover card outlines. Never on body text, section headlines, or general borders.
3. Primary buttons use the silver CTA fill with dark text. Secondary buttons stay dark with steel borders.
4. Default card borders are graphite/steel (`#27313b`), never a colored gradient.
5. No purple in text, button fills, general borders, large background gradients, or ambient fields.
6. GlowCard (`app/components/ui/spotlight-card.tsx`) may show one extremely subtle cool-steel glow on hover: hue 205 to 210, saturation 18 to 28% (never 100%), low opacity, hover-only, no brightness amplification.
7. **Exception, kept at the user's explicit request:** GlowCard's outer glow (not the crisp border, not text, not buttons, not general borders, not page ambience) may carry a faint, static violet trace: `rgba(118, 107, 149, 0.12–0.18)`. It is not a brand color. If this exception is ever removed, delete the `[data-glow].is-glowing` box-shadow rule in `globals.css` and nothing else changes.

### Glassmorphism Effects

Apply frosted glass effects to cards and elevated surfaces:

```css
backdrop-filter: blur(10px);
background: rgba(255, 255, 255, 0.05);
border: 1px solid rgba(255, 255, 255, 0.2);
```

---

## 3. Typography

### Font Family

| Role | Font | Fallback |
|------|------|----------|
| Headings/Display | **Anton** | Impact, sans-serif |
| Body Text | **Manrope** | -apple-system, BlinkMacSystemFont, Arial, sans-serif |
| Code/Monospace | Menlo, Monaco | monospace |

### Font Loading

Fonts are imported via Google Fonts in `app/layout.tsx` using `next/font`:

```typescript
import { Anton, Manrope } from 'next/font/google';

const anton = Anton({ subsets: ['latin'], variable: '--font-display' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });
```

### Typography Scale

| Level | Size | Usage | Example |
|-------|------|-------|---------|
| H1 | 60px (3.75rem) | Page titles, hero headlines | "Advertising that actually makes money" |
| H2 | 48px (3rem) | Section headlines | "Our proven process" |
| H3 | 36px (2.25rem) | Subsection titles | "Find the Leak" |
| H4 | 30px (1.875rem) | Card titles, emphasis | Service titles |
| Large | 24px (1.5rem) | Feature text | Larger body copy |
| Body | 16px (1rem) | Default body text | Paragraph copy |
| Small | 14px (0.875rem) | Secondary text, captions | "Ad Waste Checklist ($47 value)" |
| Tiny | 12px (0.75rem) | Fine print, labels | Metadata, timestamps |

### Line Height

- **Display (H1-H3):** 1.25 (tight) — Dramatic, compact headlines
- **Heading (H4+):** 1.375 (snug) — Readable but dense
- **Body:** 1.625 (relaxed) — Maximum readability
- **Caption:** 1.5 (normal) — Secondary information

### Font Weights

- **Bold:** 700 — Headings, emphasis
- **Semibold:** 600 — Button text, strong emphasis
- **Regular:** 400 — Body text, default
- **Thin/Light:** Not used (avoid weakening hierarchy)

### Letter Spacing

- **Headings (H1-H2):** -0.025em (tight) — Professional, dramatic
- **Display (H3+):** Normal (0) — Clear readability
- **Captions:** 0.05em (wide) — Labels, metadata

---

## 4. Spacing System

### Spacing Scale

All spacing uses an 8px base unit (4px increments):

| Token | Value | Usage |
|-------|-------|-------|
| Space-1 | 4px | Micro spacing |
| Space-2 | 8px | Tight gaps, icon spacing |
| Space-3 | 12px | Small spacing |
| Space-4 | 16px | Standard padding, gaps |
| Space-6 | 24px | Medium spacing |
| Space-8 | 32px | Large spacing, section separation |
| Space-12 | 48px | Very large spacing |
| Space-16 | 64px | Hero spacing, major sections |
| Space-24 | 96px | Full-screen spacing |

### Gap Sizes

- **Gap-XS:** 8px — Icon + text, tight groups
- **Gap-SM:** 12px — List items, cards in close proximity
- **Gap-MD:** 16px — Default gap between elements
- **Gap-LG:** 24px — Section spacing
- **Gap-XL:** 32px — Large element groups
- **Gap-2XL:** 48px — Major sections
- **Gap-3XL:** 64px — Page sections

### Padding Rules

- **Cards:** 32px (space-8) minimum
- **Sections:** 96px (space-24) vertical for desktop, 48px for mobile
- **Input fields:** 12px vertical (space-3), 16px horizontal (space-4)
- **Buttons:** 12px vertical (space-3), 24px horizontal (space-6)

---

## 5. Border Radius

The token values below were never wrong — what was missing was a usage rule, so
components drifted toward whatever radius looked right in the moment. `rounded-lg`
ended up the de facto default (43 uses) while the table below documented `rounded-2xl`
as the card standard (7 uses). This table replaces that stale guidance with what the
site actually does, plus the rule for when to reach for each size going forward.

### Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 2px (0.125rem) | Progress segments and tiny technical marks only |
| `rounded-md` | 6px (0.375rem) | Admin controls and compact inputs |
| `rounded-lg` | 8px (0.5rem) | **Default.** Panels, blog cards, form sections |
| `rounded-xl` | 12px (0.75rem) | Media frames and icon tiles |
| `rounded-2xl` | 16px (1rem) | Featured interactive cards and accordions — reserve for the one card on a page that should read as more prominent |
| `rounded-full` | 9999px | Buttons, pills, inputs, toggles |

`rounded` (4px, bare) and `rounded-3xl` (24px) are defined in the token scale but not
currently used anywhere on the site — leave them that way rather than reaching for
them to solve a one-off spacing problem.

**This is a usage rule, not a migration mandate.** Don't sweep the codebase to
enforce it retroactively; apply it to new components and the next time an existing
one is touched for other reasons.

---

## 6. Shadows & Elevation

### Shadow System

| Level | Value | Usage |
|-------|-------|-------|
| None | none | Flat surfaces |
| Small | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Subtle hover states |
| Medium | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` | Cards, dropdowns |
| Large | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` | Modals, overlays |
| XLarge | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` | Full-page overlays |

### Shadow Tint

Always tint shadows to the background color. For dark backgrounds, use `rgba(0, 0, 0, 0.x)`.

---

## 7. Components

### Buttons

#### Primary Button
- **Background:** Silver (`#e4e9ee`, the `--cta-bg` token) — the brightest interactive surface on the page
- **Text:** Dark graphite (`#0b0e13`)
- **Padding:** 12px 24px (space-3 space-6)
- **Radius:** Fully rounded (pill)
- **Font Weight:** 600
- **Transition:** All 200ms
- **Hover:** brighter still (`--cta-bg-hover: #eff3f6`)
- **Active:** Scale 0.97

```jsx
<button className="bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-bg-hover)] active:scale-[0.97] px-6 py-3 rounded-full font-semibold transition">
  Schedule Free Audit
</button>
```

#### Secondary Button
- **Background:** Surface (`#12171e`), dark
- **Border:** 1px steel hairline
- **Text:** White
- **Same padding/radius as primary**

#### Ghost Button
- **Background:** Transparent
- **Border:** 1px Signal Steel
- **Text:** Signal Steel
- **Hover:** Surface background

### Cards

#### Default Card
- **Background:** Surface (`#12171e`) with glassmorphism
- **Border:** 1px graphite/steel (`#27313b`), never a colored gradient
- **Radius:** 16px (rounded-2xl)
- **Padding:** 32px (space-8)
- **Shadow:** Medium (box-shadow-md)
- **Glassmorphism:** `backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.05);`

### Inputs

#### Text Input
- **Background:** rgba(255, 255, 255, 0.1)
- **Border:** 1px rgba(255, 255, 255, 0.2)
- **Radius:** Fully rounded
- **Padding:** 12px 16px
- **Text:** White
- **Placeholder:** Text Tertiary
- **Focus Border:** Signal Steel

---

## 8. Animation & Motion

### Transitions

- **Fast:** 100ms — Button states, hover effects
- **Standard:** 200ms — UI state changes
- **Slow:** 300ms — Full-page transitions
- **Extra Slow:** 500ms — Ceremonial animations

### Easing Functions

- **Entrance:** `cubic-bezier(0.23, 1, 0.32, 1)` (ease-out) — Quick start, smooth landing
- **Exit:** `cubic-bezier(0.4, 0, 1, 1)` (ease-in) — Gentle departure
- **On-screen:** `cubic-bezier(0.77, 0, 0.175, 1)` (ease-in-out) — Natural acceleration/deceleration

### Animation Patterns

- **Scroll Reveals:** Fade in + Y-translate 24px on scroll
- **Button Press:** Scale 0.97 active state
- **Hover Effects:** Color change + 200ms transition
- **Component Entrance:** Staggered animation with 0.08-0.1s delays

---

## 9. Responsive Design

### Breakpoints

| Device | Width | Prefix |
|--------|-------|--------|
| Mobile | < 640px | (default) |
| Tablet | 640px+ | `sm:` |
| Desktop | 768px+ | `md:` |
| Large Desktop | 1024px+ | `lg:` |
| XL Desktop | 1280px+ | `xl:` |
| 2XL Desktop | 1536px+ | `2xl:` |

### Responsive Rules

- **Mobile:** Single column, full-width components, 16px padding
- **Tablet:** 2-column grid, 24px padding, stacked modals
- **Desktop:** 3+ column grid, 32px padding, side-by-side layouts
- **Typography:** Scale down 1-2 levels on mobile (H1 → H2, H2 → H3)
- **Spacing:** Reduce vertical spacing 20-30% on mobile

### Mobile Optimization

- **Min Touch Target:** 44px × 44px (buttons, interactive elements)
- **Safe Area:** 8px padding minimum from edges
- **Max Width:** 1400px max-w for content containers
- **Images:** Use `100%` max-width, natural aspect ratios

---

## 10. CSS Variables Reference

All design tokens are available as CSS variables in `/app/design-tokens.css`:

### Color Variables
```css
--color-accent: #91a7b8;
--bg-primary: #0b0e13;
--text-primary: #f1f4f6;
--text-accent: #91a7b8;
--border-primary: #27313b;
```

### Typography Variables
```css
--font-display: "Anton", sans-serif;
--font-body: "Manrope", sans-serif;
--text-6xl: 3.75rem;
--text-base: 1rem;
```

### Component Variables
```css
--button-primary-bg: #e4e9ee;
--card-bg: #12171e;
--input-focus-border: #91a7b8;
```

### Spacing Variables
```css
--space-4: 1rem;
--gap-lg: 1.5rem;
--rounded-2xl: 1rem;
```

---

## 11. Usage Examples

### Hero Section
- Graphite-black background with animated gradient
- Large H1 in Anton display font, plain off-white ink (no colored headline text)
- Silver rounded pill CTA button

### Card Component
- Surface background with glassmorphism
- 16px border radius
- 32px padding
- Medium shadow
- White text, signal steel used only for small icons/labels, not body copy

### Process Section
- Grid layout (1 col mobile, 2 col tablet, 4 col desktop)
- Cards with large H3 numbers in signal steel (a real sequence, so the color-coded number earns its place)
- Staggered scroll reveal animations
- 24px gaps between items

### Navigation
- Sticky top, dark background with blur
- White text, signal steel hover state
- Silver rounded pill CTA button
- Responsive mobile hamburger menu

---

## 12. Design System Files

### Location & Structure
```
arstrategies-site/
├── design-tokens.json          ← Source of truth (JSON)
├── app/
│   ├── design-tokens.css       ← CSS variables
│   ├── globals.css             ← Imports design-tokens.css
│   └── components/
│       ├── AnimatedSection.tsx  ← Scroll reveals
│       ├── GlassMorphCard.tsx   ← Glassmorphism component
│       └── ShaderGradientBg.tsx ← Animated background
└── BRAND_GUIDELINES.md         ← This file
```

### Importing Tokens

In any component:
```css
.my-component {
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: var(--space-8);
  border-radius: var(--rounded-2xl);
  font-family: var(--font-body);
}
```

---

## 13. Accessibility

### Color Contrast

- **AAA Level:** Text on backgrounds must have 7:1 contrast minimum
- **AA Level:** Minimum 4.5:1 for body text, 3:1 for large text
- **Test:** Use WCAG contrast checker before shipping

### Typography

- **Minimum Font Size:** 14px for body text (accessible on all devices)
- **Line Height:** Minimum 1.5 for readability
- **Max Line Length:** 65 characters for optimal reading

### Interactive Elements

- **Minimum Size:** 44px × 44px for touch targets
- **Focus States:** Always visible (border or outline)
- **ARIA Labels:** All buttons must have descriptive labels
- **Semantic HTML:** Use `<button>`, `<a>`, proper heading hierarchy

---

## 14. Best Practices

### DO ✅
- Use the 8px spacing scale consistently
- Always use CSS variables, never hardcode hex colors
- Maintain 1.5+ line height for body text
- Use Anton only for headings, Manrope for body
- Apply glassmorphism to elevated surfaces
- Test on mobile, tablet, desktop
- Animate entrance on scroll, not just hover
- Use Signal Steel sparingly, on interactive details only, for maximum impact
- Ensure color contrast meets WCAG AA minimum

### DON'T ❌
- Don't mix multiple accent colors
- Don't use sans-serif for headings (use Anton)
- Don't animate on every hover (too busy)
- Don't use drop shadows on drop shadows
- Don't round corners on everything
- Don't use text below 14px without strong reason
- Don't add padding without using spacing scale
- Don't hardcode colors (always use CSS variables)
- Don't forget mobile optimization
- Don't break the rhythm of the spacing system

---

## 15. Questions?

For updates to this document or design system questions, refer to:
- **Design Tokens:** `/app/design-tokens.css`
- **Component Examples:** `app/components/`
- **GitHub:** [ar-strategies-site](https://github.com/SymTrue/ar-strategies-site)
- **Live Site:** [arstrategists.com](https://arstrategists.com)

---

**Document Version:** 1.0.0  
**Last Updated:** July 11, 2026  
**Maintainer:** Claude Code / AR Strategies Design System
