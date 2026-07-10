# AR Strategies Brand Guidelines

**Version:** 1.0.0  
**Last Updated:** 2026-07-11  
**Maintained by:** AR Strategies Design System

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

#### Primary Colors
- **Black:** `#000000` — Primary background, main text on light
- **White:** `#FFFFFF` — Primary text on dark, light backgrounds
- **Orange (Brand Accent):** `#ea580c` — CTAs, highlights, emphasis

#### Secondary Colors
- **Orange Dark:** `#d97757` — Hover states, darker accents
- **Orange Light:** `#f5a962` — Light accents, hover backgrounds

#### Neutral Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Gray 900 | `#111111` | Near-black, dark surfaces |
| Gray 800 | `#1a1a1a` | Dark backgrounds |
| Gray 700 | `#2d2d2d` | Borders, dividers |
| Gray 600 | `#4a4a4a` | Medium gray, secondary elements |
| Gray 500 | `#666666` | Light gray text |
| Gray 400 | `#999999` | Lighter gray, muted text |
| Gray 300 | `#b3b3b3` | Very light gray |
| Gray 200 | `#e6e6e6` | Almost white |

#### Status Colors
- **Success:** `#10b981` — Positive actions, confirmations
- **Error:** `#ef4444` — Errors, warnings

### Color Usage Rules

1. **Background:** Black (`#000000`) is the primary background
2. **Text on Dark:** White (`#FFFFFF`) for primary, Gray 400+ for secondary
3. **Accents:** Orange (`#ea580c`) for CTAs, highlights, and brand moments
4. **Borders:** Gray 700 for subtle borders, Orange for emphasis
5. **Hover States:** Use Orange Light (`#f5a962`) or Gray 800

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

### Radius Scale

| Size | Value | Usage |
|------|-------|-------|
| None | 0 | Sharp edges |
| Small | 2px (0.125rem) | Minimal rounding |
| Medium | 4-6px | Subtle curves |
| Large | 8px (0.5rem) | Standard radius |
| XLarge | 12px (0.75rem) | Cards, popovers |
| 2XL | 16px (1rem) | Larger containers |
| 3XL | 24px (1.5rem) | Major components |
| Full | 9999px | Pills, fully rounded |

### Rules

- **Buttons:** Fully rounded (pill shape)
- **Cards:** 16px radius (rounded-2xl)
- **Inputs:** Fully rounded (pill shape)
- **Icons:** No rounding (0px)
- **Images:** 12px radius (rounded-xl) when contained

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
- **Background:** Orange (`#ea580c`)
- **Text:** White (`#FFFFFF`)
- **Padding:** 12px 24px (space-3 space-6)
- **Radius:** Fully rounded (pill)
- **Font Weight:** 600
- **Transition:** All 200ms
- **Hover:** Orange Light (`#f5a962`)
- **Active:** Scale 0.97, Orange Dark (`#d97757`)

```jsx
<button className="bg-brand hover:bg-orange-700 active:scale-[0.97] px-6 py-3 rounded-full font-semibold transition">
  Schedule Free Audit
</button>
```

#### Secondary Button
- **Background:** Gray 800 (`#1a1a1a`)
- **Border:** 1px Gray 600
- **Text:** White
- **Same padding/radius as primary**

#### Ghost Button
- **Background:** Transparent
- **Border:** 1px Orange
- **Text:** Orange
- **Hover:** Gray 800 background

### Cards

#### Default Card
- **Background:** Gray 900 (`#111111`) with glassmorphism
- **Border:** 1px Gray 700
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
- **Placeholder:** Gray 500
- **Focus Border:** Orange

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
--color-orange: #ea580c;
--bg-primary: #000000;
--text-primary: #ffffff;
--text-accent: #ea580c;
--border-primary: #2d2d2d;
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
--button-primary-bg: #ea580c;
--card-bg: #111111;
--input-focus-border: #ea580c;
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
- Black background with animated gradient
- Large H1 in Anton display font
- Orange accent text
- Rounded pill buttons

### Card Component
- Gray 900 background with glassmorphism
- 16px border radius
- 32px padding
- Medium shadow
- White text, Orange accents

### Process Section
- Grid layout (1 col mobile, 2 col tablet, 4 col desktop)
- Cards with large H3 numbers in Orange
- Staggered scroll reveal animations
- 24px gaps between items

### Navigation
- Sticky top, dark background with blur
- White text, Orange hover state
- Orange rounded pill CTA button
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
- Use Orange sparingly for maximum impact
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
