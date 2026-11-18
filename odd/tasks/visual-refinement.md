# visual-refinement

Objective: refine the look of the portfolio from the Impeccable critique of 2026-11-18 (20/28), keeping the newspaper identity Edwin likes.
Branch: `feat/visual-refinement`. Delivery: local commits; push, PR and merge only when Edwin asks. Runner: `npm run build`, `npm run lint` (baseline 15 problems), drivers `test:routes`, `test:figures`, `test:blogfront`, `test:readstate`, `test:stack`, `test:promo`, `test:reading`, `test:dark`, `test:xp`, `test:disclosures`, `test:newspaper`.

## Specs

- S1: "ahora, usando las nuevas utilidades, revisa el portfolio y mejora su aspecto visual". The review is the critique saved at `.impeccable/critique/2026-11-18T14-16-02Z__src-app-tsx.md`; its five priority issues are the scope. Earlier, on the same day: "del lado del diseño, me gusta" — so this is refinement: the editorial newspaper identity, the palette, the fonts and the three themes stay.
- S2 Scope, Edwin's answer to "¿Cuánto quieres que arregle ahora?": "Los cinco (Recommended)" — "Aplico todos los arreglos, verifico en claro y oscuro a 375 y 1440 px, y lo dejo en una rama sin publicar."
- S3 Case studies, Edwin's answer: "Principal + fichas (Recommended)" — "Un caso principal grande, dos secundarios y el resto como fichas de una línea (título, rol, una cifra) que se abren al tocarlas."
  - From the critique: problem and solution are clamped mid-sentence; write "one outcome sentence per case instead of clamping". Constraint: the sentence uses only facts already in that case's content; no new claim, number or client detail.
  - Constraint: the anchors `#case-<id>` keep working (the stack section links to them) and a link to a brief opens it. The `stack` arrays in `src/content/case-studies.ts` are not edited.
- S4 Shadows, Edwin's answer: "Solo en lo principal (Recommended)" — "La sombra queda en el elemento destacado de cada sección y en botones; el resto se separa con filetes y columnas, como un periódico."
- S5 Small type and touch targets (critique P1): "12px floor for mono labels, 11px only for uppercase kickers, stat label beside the number, 44px hit areas on chips and \"Leer\"". Measured: about 226 text nodes at 10px (`.kicker` and 57 `text-[10px]` utilities in 13 files); 57 of 130 links and buttons in `main` under 40px tall at 375px.
- S6 Article line length (critique P2): paragraphs in `.blog-article-body` render 90-95 characters per line (the first one 138) although the rule says `max-width: 70ch`. Target 65-75 characters.
- S7 Evidence that undercuts itself (critique P2):
  - S7a "LLM / AI Agents" shows "Usado antes" while the hero speaks of review assisted by AI agents. Assumption: a second status "En uso hoy" for a technology that is not in the current role's stack but has an article of the blog dated within the last six months; "En producción hoy" keeps its rule.
  - S7b The "AI Discoverability" card shows no evidence. Assumption: its evidence is this site's own `llms.txt` (a file in `public/`), linked; nothing else is claimed.
  - S7c The stack map leaves about 450px blank inside its frame at 375px and empty rows at 1440px.
- Out of scope: the XP theme's look (it must keep working), the GitHub list, the contact ending, the blog masthead above articles.

## Tasks

- [x] T1 (S3, S4, S5 inside the case studies; delegated: parallel units) Case studies as lead, two secondaries and expandable briefs.
- [x] T2 (S7, S4, S5 inside the stack section; delegated: parallel units) Stack evidence and map frame.
- [x] T3 (S4, S5, S6 everywhere else; delegated: parallel units) Type floor, touch targets, article measure, shadows only on the lead item and controls.
- [x] T4 (all, inline) Seam: detector, drivers, visual pass in light and dark at 375 and 1440 px, baselines re-cut with attribution, commits.

Route evidence: three independent units with disjoint files, each several files and over 100 changed lines, launched together.

## Log

- L1 (2026-11-18, user, verbatim): "ahora, usando las nuevas utilidades, revisa el portfolio y mejora su aspecto visual"
- L2 Impeccable critique run with two isolated assessments (design review, detector). Score 20/28. Priority issues: case studies without hierarchy (P1), 10px type carrying the proof (P1), box-and-shadow on everything (P2), article lines of 90-95 characters (P2), evidence that undercuts itself (P2). Detector: 0 findings in source, about 300 on the rendered home; hard-offset-shadow is the deliberate identity.
- L3 (2026-11-18, user, answers to three questions): scope "Los cinco (Recommended)"; case studies "Principal + fichas (Recommended)"; shadows "Solo en lo principal (Recommended)".
- L4 T1 returned and was verified by the parent: lead `fabricas-credit-los`, secondaries `devmanager-ai-saas` and `datacredito-api` (by the existing `order`), eight briefs as native details that open by click, keyboard and `#case-<id>`. One outcome sentence per case composed from that case's own impact or solution text (`caseOutcomes` in src/content/case-studies.ts). Section height 8850 to 4169 px at 375 and 4044 to 2365 px at 1440. driver/disclosures.mjs RED 21/48, GREEN 48/48. Decisions by the writer: the "Destacado" kicker on the lead is gone; stack tags became one plain line; the three NDA marks became one line; the GitHub list got only the type and target fixes. Not done: a link to the hash already in the address does not reopen a brief the reader closed.
- L5 T2 returned and was verified by the parent: status rule in `statusOf` (current role, else a post within six months gives "En uso hoy", else past). Changed from "Usado antes" to "En uso hoy": LLM / AI Agents (11 posts), Playwright, IndexedDB and Cloudflare Workers (one post each; to be confirmed by Edwin). "AI Discoverability" links to this site's llms.txt. The map draws every row from step 1 and mutes the groups not reached, so the frame keeps one height; blank at step 1 was 986 px at 375, now under 48. driver/stack.mjs RED 105/123, GREEN 123/123. Parent: the sentence for the new status folded into `stack.rule` in src/i18n/translations.ts.
- L6 T3 returned and was verified by the parent: floor of 12 px (11 px uppercase kickers), 44 px hit areas, prose measure `36em` inside the article (cause of the long lines: `ch` is the width of the digit 0, which Space Grotesk draws about a third wider than its average letter), `.px-card-quiet` for everything that is not the lead of its section, the header marks the section in view. New driver/typography.mjs RED 4/16, GREEN 16/16.
- L7 Seam on the combined build: typography 16/16, disclosures 48/48, stack 123/123, routes 11/11, readstate 125/125, blogfront 250/250, reading 33/33, dark 77/77, xp 100/100, promo 28/28, figures 132, 81, 181, 76 and 96; lint 15 problems, none new. Impeccable detector on the rendered home: 301 findings before, 22 after (12 line-length, 8 hard-offset-shadow kept on purpose, 2 straggler). Newspaper baselines re-cut; attribution: the case studies are recomposed, the stack rows and map changed, shadows and small type changed across sections. The first comparison right after the re-cut failed once and the next two passed 8/8 with 0 differing pixels; cause not established.
- L8 Not done: the 12 remaining line-length findings on the home were not examined one by one; the parent's own full-section captures were unreliable (the fixed header and entrance animations show in element screenshots), so the visual pass rests on the writers' captures of each section in light and dark at 375 and 1440 plus the parent's look at the case studies at 1440; no native review ran.
