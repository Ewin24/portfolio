# essays-batch-1

Objective: essay-style writing with SVG figures in the blog (reference: templeton.host/writing), and the first five opinion essays as drafts for Edwin's review.
Branches: `feat/blog-figures` (figure support) -> `feat/essays-batch-1` (one commit per essay, each commit is a PR slice). Delivery: stacked local branches, Edwin pushes and opens PRs (cached choice, memory `portfolio-sdd-content-cycles`). Runner: `npm run build`, `npm run test:routes`.

## Specs

- S1: "me gustaria tener secciones del protfolio como lo siguiente https://templeton.host/writing/scarcity-inversion/, https://templeton.host/writing/, https://templeton.host/writing/how-to-be-freakishly-decisive/ alfo de ese tipo [...] tambien me gustaria que tengamos graficas de ese tipo"
- S2: "dale, luego quiero que tengamos como un agente que se dedique a generar esos articulos de valor con cosas interesantes respecto acomo evolucionar con AI, liderar, decidir, emprender, etc"
- S3: "que proponga los temas y yo reviso"
- S4: "todos, dale" (answer to "¿Con cuál tema arranco el primer borrador?" over the five proposals below). Each essay follows `skills/blog-essay-editor/SKILL.md` in full: no invented experience, every external claim sourced from a page read in the session, 1 to 3 figures, 1,200 to 1,800 words per language, `category: 'ensayo'`, never published by the agent.
  - E1 "El arreglo que funciona es la forma más cara de no decidir". Thesis: a workaround that makes the test pass becomes convention and hides the defect. Evidence: `src/blog/content/posts/getdate-vs-sysdatetime.ts`. Weak point: sometimes the workaround is the right call.
  - E2 "Con AI, el cuello de botella son tus pruebas, no tu código". Thesis: when writing code is cheap, the scarce thing is trusting what verifies it. Evidence: `src/blog/content/posts/inmemory-tests-lie-about-transactions.ts`. Source to verify: DORA 2024 report on AI adoption and delivery stability. Weak point: closest to the Templeton essay; the own angle is tests.
  - E3 "Antes de cambiar lo que heredaste, escribe lo que hace hoy". Thesis: characterizing before changing applies to inherited systems and teams alike. Evidence: `src/blog/content/posts/characterization-tests-before-refactor.ts`. Source to verify: Chesterton's fence (The Thing, 1929). Weak point: no evidence from Edwin about teams.
  - E4 "Ordena las hipótesis por lo que cuesta refutarlas, no por lo probables que parecen". Evidence: `src/blog/content/posts/asynclocal-does-not-flow-back.ts`. Source to verify: Howard (1966), information value theory. Weak point: generic advice unless tied to the concrete case.
  - E5 "Publica lo que mediste, no lo que sabes". Thesis: for an independent developer a measured case sells better than a skill list. Evidence: none about outcomes; Edwin must confirm whether the portfolio brought contacts or clients. Weak point: opinion only without that data.

## Tasks

- [x] T0 (S1, inline) Figure support in the article parser, styles, first figure, route check. Commit 3e40b63.
- [x] T1 (S4 E1, delegated: parallel units) `workaround-that-works.ts`, figures `workaround-*.svg`. Commit fbd86a3.
- [x] T2 (S4 E2, delegated: parallel units) `ai-bottleneck-is-your-tests.ts`, figures `ai-bottleneck-*.svg`. Commit b7f2286.
- [x] T3 (S4 E3, delegated: parallel units) `characterize-before-you-change.ts`, figures `characterize-*.svg`. Commit 1edc602.
- [x] T4 (S4 E4, delegated: parallel units) `hypotheses-by-cost-to-refute.ts`, figures `hypotheses-*.svg`. Commit e9aef56.
- [x] T5 (S4 E5, delegated: parallel units) `publish-what-you-measured.ts`, figures `publish-measured-*.svg`. Commit 8bdf8dc.
- [x] T6 (S4, inline) Register the five posts in `src/blog/content/posts.ts`, seam check (build, routes, figures at 375 px), one commit per essay. Registration lives in each essay commit.

Route evidence: T1-T5 are five independent units with disjoint files, each a bilingual essay of 2,400+ words with sources to read and figures to draw, launched together. `posts.ts` is shared, so the parent owns it.

## Log

- L1 (2026-11-17, user, verbatim): "me gustaria tener secciones del protfolio como lo siguiente https://templeton.host/writing/scarcity-inversion/, https://templeton.host/writing/, https://templeton.host/writing/how-to-be-freakishly-decisive/ alfo de ese tipo, dale una mirada y me dices que tan complejo seria, tambien me gustaria que tengamos graficas de ese tipo"
- L2 (2026-11-17, user, verbatim): "dale, luego quiero que tengamos como un agente que se dedique a generar esos articulos de valor con cosas interesantes respecto acomo evolucionar con AI, liderar, decidir, emprender, etc"
- L3 (2026-11-17, user, verbatim): "que proponga los temas y yo reviso"
- L4 (2026-11-17, user, verbatim): "todos, dale"
- L5 Finding: the reference site draws its charts as static hand-written SVG loaded with `<img>`; no chart library. Interactive widgets there are per-article React components and are out of scope here.
- L6 Forecast: about 900 authored lines (five post files near 150 lines each plus figures), over the 400-line budget. Applied the cached stacked-local-branches choice with one essay per commit instead of asking again (assumption).
- L7 Not in scope yet: the whole-portfolio surfaces (`public/llms.txt`, `public/llms-full.txt`, README) and a separate essay index view. They belong to publication, after Edwin reviews the drafts.
- L8 Writers returned (2026-11-17). Words ES/EN: E1 1623/1659, E2 1793/1745, E3 1754/1792, E4 1642/1668, E5 1677/1691. Sources opened in session: E1 c2.com/doc/oopsla92.html (Cunningham 1992); E2 the cloud.google.com blog summary of the DORA 2024 report and the dora.dev report page; E3 a GitHub gist transcription of Chesterton, The Thing, cross-checked with Wikiquote, and InfoQ for Feathers; E4 Wikipedia "Value of information" and the Crossref record of Howard 1966 (the paper itself could not be opened, so the essay attributes the definition to the Wikipedia entry); E5 none.
- L9 Open `[EDWIN: confirm]` markers, rendered literally in the drafts: E1 one (was the one-line fix applied later, and how long it took), E2 two (was the independent verifier an AI agent or a person; does he require a not-tested note from AI agents), E3 one (a real case of inheriting or leading an existing team), E5 one (has the portfolio brought contacts or clients, and how many). E4 none.
- L10 Parent corrections: E2 tags changed to Spanish (verificación, liderazgo); the "code verified" label in `ai-bottleneck-gap-*.svg` moved off the dashed line. The first attempt at per-essay commits left the five posts imported but not listed (tsc TS6133); those local commits were redone, each one type-checked alone.
- L11 Result: `npm run build` clean; `test:routes` 8/8; essay check (5 essays, ES and EN, at 375 and 1440 px): all figures decode, captions present, no raw image syntax, no horizontal overflow; all 7 internal links resolve to existing slugs; lint unchanged at 17 pre-existing problems. `gentle-ai review assess` against main: medium, `review_due` false (`under_budget`). All seven ES figures eyeballed at 1440 px and one at 375 px.
- L12 Not done: `public/llms.txt`, `public/llms-full.txt` and README surfaces; a separate essay index view; no push. The DORA chart puts three gains tied to a 25 % adoption increase next to two declines the summary states without that basis; the caption says so. Needs Edwin: resolve the L9 markers and review the stances the writers extrapolated.
