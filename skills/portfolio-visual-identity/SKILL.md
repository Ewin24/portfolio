---
name: portfolio-visual-identity
description: "Trigger: design, visual, estilo, look and feel, new component, layout, section, UI, theme. Apply the pixel-art newspaper design system to all new components."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Use when: adding new sections, cards, layouts, or UI elements. Do NOT activate for content-only or logic changes.

## Hard Rules

1. **ALL** sections MUST copy the section-header pattern from `Projects.tsx` lines 233–249 verbatim.
2. **ALL** interactive elements MUST use 75ms transition: shadow removed + translate on hover (press-effect).
3. **NEVER** use rounded corners, gradients, blur, or cyberpunk leftovers (`bg-surface-*`, `text-neon-*`, `grid-bg`, `blur-*`, `Loader2` spin animation). Hard edges only.
4. **Typography**: `font-headline` (Playfair Display, headings), `font-mono` (IBM Plex Mono, labels/buttons), `font-sans` (Space Grotesk, body).
5. **Shadows**: `shadow-pixel-sm` (2px), `shadow-pixel` (4px), `shadow-pixel-lg` (6px), `shadow-pixel-xl` (8px). No blur. Always paired with hover removal + translate.
6. **Animations**: `<FadeIn>` for scroll-triggered entrance (opacity + y). framer-motion `motion.div` for transitions (0.2–0.25s).
7. **Layout**: `max-w-7xl mx-auto` for full sections, `py-20 px-6` padding. Narrower sections: `max-w-5xl` or `max-w-4xl`.

## Palette (Tailwind classes only, NO hex overrides)

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-paper` / `text-paper` | #FAFAF5 | Background, card surfaces |
| `bg-paper-dark` | #F0EFE8 | Alternating bg, code blocks |
| `bg-ink` / `text-ink` | #1A1A1A | Primary text, buttons, borders |
| `text-ink-light` | #4A4A4A | Body text |
| `text-ink-muted` | #8A8A8A | Labels, metadata |
| `text-accent` / `bg-accent` | #C41E1E | Links, kickers, highlights |
| `border-ink` | #1A1A1A | Primary borders |
| `border-rule-light` | #D0CFC8 | Subtle dividers |

## Decision Gates

| Need | Use |
|------|-----|
| Section header | Copy pattern from `Projects.tsx` L233–249 verbatim |
| Card | `border-2 border-ink bg-paper shadow-pixel hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-75` |
| Button | `px-btn` (filled) or `px-btn px-btn-outline` (outline) |
| Tag | `skill-tag` class |
| Badge | `px-badge`, `px-badge-outline`, or `px-badge-accent` |
| Kicker (red label) | `<span className="kicker">{text}</span>` |
| Double-line separator | `<div className="border-t-4 border-ink mb-1" /><div className="border-t border-ink mb-4" />` |

## Output Contract

Return files created/modified. Call out any palette deviations. If touching `Loading.tsx`, confirm cyberpunk leftovers were replaced.

## References

- `src/index.css` — all design tokens and component classes
- `src/components/ui/FadeIn.tsx` — scroll animation wrapper
- `src/components/sections/Projects.tsx` — section header + card patterns
- `src/components/sections/About.tsx` — two-column newspaper grid
- `src/components/sections/Contact.tsx` — inverted header (ink bg + paper text)
