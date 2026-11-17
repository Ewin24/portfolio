# Article figures

An article figure is drawn from a typed description, follows the theme, and plays
step by step like a slide with builds. This file is the contract for adding a
figure (a description) or a figure type (a renderer). Neither needs an edit to
any shared file: both folders are discovered with `import.meta.glob`.

```
src/blog/figures/
  types.ts          L, FigureBase, RendererProps, Renderer, FigureSet, reveal(), text()
  registry.ts       discovers renderers/ and specs/, resolves an id
  Figure.tsx        the shell: frame, player, narration, data table, fallback
  renderers/<type>.tsx   one file per figure type
  specs/<article>.ts     one file per article, descriptions keyed by figure id
src/styles/figures.css         the shell, the reveal kinds, and bars, flow, matrix
src/styles/figures-<batch>.css the styles of the renderers added later (line,
                               ladder, layers + segments, compare + tracks);
                               a new type gets its own file, imported from
                               src/index.css after figures.css
driver/figures*.mjs            the checks (npm run test:figures runs them all)
```

## Placing a figure in an article

The existing image syntax with a `figure/` path, alone in its paragraph, in both
language versions of the article:

```md
![Alt text in this language.](figure/<id> "Caption in this language.")
```

The alt text and the caption stay in the article, per language. The alt text is
also what the reader gets when the figure cannot draw (unknown id, a type with
no renderer, a step out of range, a renderer that throws). Any other image path
is still a plain image.

Honesty rules, unchanged: a conceptual figure says so in its caption ("Esquema
conceptual, no datos medidos" / "Conceptual sketch, not measured data") and
shows no numeric scale; a data figure names its source in its caption.

## A description

One file per article in `specs/`, named like the article's post file. Its
default export is an object keyed by figure id. Ids are unique across the site;
a duplicate throws in development.

- `type` is the renderer's file name without the extension.
- `steps` holds one narration line per step, `{ es, en }`. Its length is the
  number of steps. A line only says what the figure and the article already say.
- Every element carries `step`, the 1-based step on which it appears. Elements
  of earlier steps stay; going back hides the later ones.
- Every visible string is `{ es, en }` (the type `L`). A plain string is
  allowed only where the renderer's type says `L | string`, for text that is
  the same in both languages (an identifier, a formatted number).
- Order the steps the way a presenter would: one bar or one group at a time;
  axes, then cells, the emphasised one last; path A, its loop, then path B.

```ts
// specs/context-is-a-budget.ts
import type { BarsFigure } from '../renderers/bars'
import type { FigureSet } from '../types'

const cache: BarsFigure = {
  type: 'bars',
  columns: [{ es: 'Uso', en: 'Use' }, { es: 'Múltiplo', en: 'Multiple' }],
  steps: [
    { es: 'La entrada normal es la referencia: 1× el precio base.', en: 'Normal input is the reference: 1× the base price.' },
    { es: 'Leer de la caché cuesta 0.1×.', en: 'Reading from the cache costs 0.1×.' },
  ],
  bars: [
    { label: { es: 'entrada normal', en: 'normal input' }, value: 1, display: '1×', step: 1 },
    { label: { es: 'lectura de caché', en: 'cache read' }, value: 0.1, display: '0.1×', tone: 'accent', step: 2 },
  ],
}

export default { 'context-budget-cache': cache } satisfies FigureSet
```

Typing each description with its renderer's type (`BarsFigure`) is what checks
it; `satisfies FigureSet` only checks the shape of the file.

## A renderer

One file `renderers/<type>.tsx`. It exports its description type (and any
helper types a description needs) and, as its **default export**, its
component, with what the shell needs attached as static members. Close the file
with `export default X satisfies Renderer<YourFigure>` so the contract is
type-checked:

```ts
type Renderer<D extends FigureBase> =
  ComponentType<RendererProps<D>> & {             // props: { figure: D, lang: 'es' | 'en', step: number }
    stepsUsed(figure: D): number[]                // the step of every element
    table?(figure: D, lang): { head: string[]; rows: string[][] }
  }
```

- **The component** draws the stage only. The frame, the narration line, the
  player, the keyboard handling, auto-play, reduced motion and the table belong
  to the shell; a renderer holds no state and never reads the theme. It is
  rendered with every element present on every step.
- **Steps.** Spread `reveal(element.step, step, kind)` on every element that
  belongs to a step. It sets `data-step`, `data-on` and `data-reveal`, and
  `figures.css` hides the element until its step and animates its entrance.
  Hidden elements keep their place, so stepping never moves the layout. Kinds:
  `box` (default: fade and slide), `label` (fade), `grow` (a bar, from its
  baseline: set `transform-origin` if that is not the left edge), `draw` (an
  element holding an SVG `<line pathLength={1}>` shaft and a `<path>` head),
  `wipe` (uncovered from the inset in the CSS variable `--wipe-from`). Set the
  CSS variable `--i` (0, 1, 2) on elements that share a step to make them enter
  one after another. Anything without `reveal` is always visible.
- **`stepsUsed`** returns the step of every element the description holds. The
  shell checks them against `steps.length`; one out of range and the figure
  falls back to its alt text instead of drawing with a part that never shows.
- **`table`** is for data charts only. Returning the chart's numbers is what
  adds the "data" toggle; the shell renders the table. A conceptual figure
  has no `table`.
- The component is the file's only value export; `stepsUsed` and `table` are
  assigned on it (`List.stepsUsed = …`), not exported. Exporting them, or
  exporting an object that wraps the component, trips
  `react-refresh/only-export-components`. Types can be exported freely.

### Layout and tokens

- HTML and CSS first (grid, flex, text that wraps). SVG only where geometry
  needs it: arrow shafts and heads, axes, curves. Never a fixed-width drawing
  scaled down.
- All styles go in `src/styles/figures.css`, under `.fig`, with class names
  prefixed `fig-<type>-` (the three first renderers share `fig-bar-`,
  `fig-node` and friends; reuse them where they fit).
- The stage is a size container named `fig`. Lay out narrow first and widen
  with `@container fig (min-width: …)`, not with media queries: a figure is as
  wide as the article column, not the window.
- At 375 px: no text below 12 px (0.75rem), no horizontal overflow, and a flow
  that does not fit sideways stacks, its arrows turned.
- Colours are tokens or `currentColor` only, never a hex value:
  `--color-paper`, `--color-paper-dark`, `--color-ink`, `--color-ink-light`,
  `--color-ink-muted`, `--color-rule`, `--color-rule-light`, `--color-accent`,
  `--color-accent-dark`, `--color-on-ink` (text on an ink surface). The dark
  theme and XP override them; a figure has no theme-specific rule.
- Hard edges: no rounded corners, gradients, blur or soft shadows. Fonts are
  `var(--font-mono)` for labels, `var(--font-sans)` for sentences,
  `var(--font-headline)` for nothing so far.
- Data marks carry their value as a direct label, in a text token, never in
  the series colour. Identity never rests on colour alone: label the mark.
  Bars are thin, anchored to a baseline, with a 2 px gap between adjacent fills.

### A minimal renderer

```tsx
// renderers/list.tsx
import { reveal, type FigureBase, type L, type Renderer, type RendererProps } from '../types'

export interface ListFigure extends FigureBase {
  type: 'list'
  items: { label: L; step: number }[]
}

function List({ figure, lang, step }: RendererProps<ListFigure>) {
  return (
    <div className="fig-list">
      {figure.items.map((item, i) => (
        <span key={i} className="fig-list-item" {...reveal(item.step, step)}>{item.label[lang]}</span>
      ))}
    </div>
  )
}

List.stepsUsed = (figure: ListFigure) => figure.items.map((item) => item.step)

// A data chart also assigns List.table = (figure: ListFigure, lang: Language) => ({ head, rows })

export default List satisfies Renderer<ListFigure>
```

Then add the `.fig-list` rules to `figures.css`, a description in `specs/`, the
figure's id to `ARTICLES` in `driver/figures.mjs`, and run the checks below.

## What the shell already does

Frame; play/pause, previous, next, restart, clickable step marks and the
"2 / 4" count; one auto-play the first time the figure is 30 % on screen, 2.4 s
per step, stopped by any interaction; left and right arrows while the figure or
a control has focus; the narration line (`aria-live="polite"`); the final state
at once under `prefers-reduced-motion`, with the controls still stepping; the
data table; the alt-text fallback.

## Limits of the three first renderers

- `bars`, `layout: 'split'`: parts are labelled in their own column, so a part
  much narrower than its label needs the wide layout rethought.
- `flow`, `rows`: a `loop` always leaves from the lane's last box.
- `flow`, `columns`: `aside` needs a single lane; `link` needs exactly two
  lanes and joins the last box of the first to the first box of the second;
  no `loop`.

## Checks

```
npx vite --port 4231 --strictPort
BASE_URL=http://localhost:4231/portfolio/ node driver/figures.mjs
npx tsc -b && npx eslint src/blog/figures
```
