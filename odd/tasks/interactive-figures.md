# interactive-figures

Objective: replace the hand-drawn SVG files in blog articles with an in-house figure component that draws from a typed description, follows the theme, is interactive, and plays step by step like a presentation. Then write it up as a case study with real before/after measurements.
Branch: `feat/interactive-figures`, one commit per unit. Delivery: stacked local commits; push, PR and merge only when Edwin asks. Runner: `npm run build`, `npm run test:figures` (new), `npm run test:routes`, `npm run test:reading`, `npm run test:dark`, `npm run test:promo`, `npm run test:newspaper`, `npm run test:xp`, `npm run test:disclosures`.

## Specs

- S1: "me parece que deberias crear o buscar un \"plugin\" o funcionalidad que te permita hacer los diagramas - graficos, etc, de tal forma que sean mas interactivos (como los artifacts) que ya hace claude. de paso ese puede ser un caso de estudio, esto lo digo, porque de esa forma nos ahorramos los SVG y adicional obtenemos una mejor calidad en nuestro producto"
- S2: "dale con el componente propio, debe permitir animaciones como si fueran presentaciones asi como en claude" (answer to "¿Arranco con el componente propio, o prefieres que use una librería a pesar del peso?"). No new dependency: `motion`, `lucide-react` and React are already installed.
- S3 (the parent's design, derived from S1 and S2; assumptions where marked):
  - S3a Embedding. An article places a figure with the existing image syntax and a `figure/` path: `![alt](figure/<id> "Caption")`, alone in its paragraph. The id resolves to a typed description in `src/blog/figures/specs/`. One description serves Spanish and English: every visible string in it is `{ es, en }`. The alt and the caption stay in the article, per language. Static SVG figures (`blog/figures/*.svg`) keep working unchanged.
  - S3b Rendering. The article body stays one container with the same children and the same prose styles; the figure mounts inside the `<figure>` the parser emits. A missing or unknown id renders the alt text and the caption, never an error or an empty box.
  - S3c Theme. Figures use the design tokens, so they follow light, dark and XP. No hardcoded colours.
  - S3d Presentation. Every figure is a sequence of steps. It plays once when it scrolls into view, each step revealing its elements with a short animation, and offers play/pause, previous, next and restart, a step indicator, and a line of narration per step in the reader's language. With `prefers-reduced-motion` it shows the final state without motion and the controls still move between steps. Keyboard: the controls are buttons; left and right arrows step when the figure has focus.
  - S3e Data. A data mark shows its value on hover and on keyboard focus, and every data chart offers its numbers as a table. Identity never depends on colour alone.
  - S3f Small screens. At 375 px wide no text renders below 12 px and nothing overflows horizontally.
  - S3g Honesty rules carried over: a conceptual figure says so in its caption and shows no numeric scale; a data figure names its source in the caption.
- S4 Figure types, from the 21 figures that exist today: `bars` (4 figures), `flow` (4), `matrix` (2) in the first slice; `line`, `ladder`, `layers`, `compare`, `tracks` and the remaining 11 figures in the second.
- S5 Case study ("de paso ese puede ser un caso de estudio"): written last, from measurements taken on this branch against `main` (files and bytes removed, bundle size change, what changed in dark mode and on small screens). No number that was not measured.

## Tasks

- [ ] T1 (S3, S4 first slice, delegated: context backstop) Core: parser hook, registry, figure shell with the presentation controls, renderers `bars`, `flow`, `matrix`, the ten figures of those types migrated, their SVG files removed, `driver/figures.mjs`.
- [ ] T2 (S4 second slice, delegated: parallel units) Renderers `line`, `ladder`, `layers`, `compare`, `tracks` and the remaining eleven figures.
- [ ] T3 (all, inline) Seam check, visual pass in light, dark and XP at 375 and 1440 px, skill `blog-essay-editor` updated to the new figure rules, commits.
- [ ] T4 (S5, delegated or inline) Case study with measurements.

Route evidence: T1 is one unit (the mechanism and its first renderers cannot be split); it goes to a bounded writer because the parent session is very long. T2 depends on T1 and starts only after T1 is verified; its renderers have disjoint files (one file per renderer, one description file per article, both discovered with `import.meta.glob`, so no shared registry file).

## Log

- L1 (2026-11-17, user, verbatim): "me parece que deberias crear o buscar un \"plugin\" o funcionalidad que te permita hacer los diagramas - graficos, etc, de tal forma que sean mas interactivos (como los artifacts) que ya hace claude. de paso ese puede ser un caso de estudio, esto lo digo, porque de esa forma nos ahorramos los SVG y adicional obtenemos una mejor calidad en nuestro producto"
- L2 Found before proposing: 21 distinct figures in 40 SVG files (19 ES/EN pairs), 117,757 bytes; 17 are conceptual sketches and 4 are bar charts. Published sizes (bundlephobia, gzip): uPlot 21 kB, Chart.js 68 kB, React Flow 86 kB, Observable Plot 124 kB, Mermaid 155 kB, Recharts 173 kB. Chart libraries do not draw the sketches and diagram libraries are heavy and off-style, so the recommendation was an in-house component. Told Edwin that SVG is still what the browser draws (what goes away is hand-placed coordinates and duplicated files) and that Claude artifacts cannot be embedded in his site.
- L3 (2026-11-17, user, verbatim): "dale con el componente propio, debe permitir animaciones como si fueran presentaciones asi como en claude"
- L4 Decisions (assumptions, cheap to change): descriptions live in TypeScript, not in JSON inside the article, so they are type-checked; the article keeps the image syntax so alt and caption stay per language and the existing figure pipeline is reused; "like presentations" is read as stepwise reveal with narration and player controls, auto-played once on scroll.
