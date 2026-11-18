# plain-language-and-fixes

Objective: rewrite the titles and the text of the essays in plain, human language, and fix the open technical items the agent can fix without a product decision.
Branch: `feat/plain-language-essays`. Delivery: local commits; push, PR and merge only when Edwin asks. Runner: `npm run build`, `npm run lint`, and the drivers `test:routes`, `test:figures`, `test:blogfront`, `test:readstate`, `test:stack`, `test:promo`, `test:reading`, `test:dark`, `test:newspaper`.

## Specs

- S1: "corrige lo que esté en tus manos del lado tecnico". Read as the open items reported at the end of the previous delivery (assumption):
  - S1a "La búsqueda no respeta el filtro \"No leídos\"."
  - S1b "Los enlaces del stack a casos de estudio llevan a la sección, no a un caso concreto."
  - S1c The `driver/readstate.mjs` check "(2) read, with stamp and date, in related articles" fails in some runs against the published site and never locally. Find the cause; fix the product if it is a defect, the driver if it is a timing assumption. If the cause cannot be established, say so.
  - Not in scope: "AI Discoverability" keeps no evidence and no status, because no case study, role or tag names it and nothing is invented.
- S2: "del lado del diseño, me gusta". No design change.
- S3: "en los articulos, me gustaria que pongamos titulos y contenido escrito en un lenguaje mas humanoy simple, veo que usas terminos y frases demasiado genericas cosas como \"Once rondas de revisión con AI no reemplazan diez minutos de un usuario\". hay opciones como Puedes pedirle once rondas de revisión a la IA, pero nada reemplaza diez minutos escuchando a un usuario de verdad o \"Por qué diez minutos de feedback real ganan frente a las iteraciones con IA\""
  - Scope (assumption): the 13 posts with `category: 'ensayo'` and the case study `interactive-figures-instead-of-svg`, in Spanish and English: title, excerpt, headings, body, and the wording of their figure descriptions. The older technical posts are not touched.
  - Constraints: slugs, ids, dates, tags, series data and figure ids do not change (addresses and stored read marks depend on them). Every fact, number, quote, link and code sample stays; nothing is invented. The voice rules are in `odd/tasks/plain-language-voice.md`.

## Tasks

- [x] T1 (S3, delegated: parallel units) review-rounds-are-not-a-user, the-harness-decides, tools-for-agents, context-is-a-budget
- [x] T2 (S3, delegated: parallel units) give-the-agent-something-that-fails, ai-proposes-transaction-decides, agent-memory-is-curation, ai-bottleneck-is-your-tests
- [x] T3 (S3, delegated: parallel units) your-next-reader-is-a-model, publish-what-you-measured, workaround-that-works
- [x] T4 (S3, delegated: parallel units) hypotheses-by-cost-to-refute, characterize-before-you-change, interactive-figures-instead-of-svg
- [x] T5 (S1, delegated: parallel units) search and unread filter, stack links to one case study, the unstable related-articles check
- [x] T6 (all, inline) seam: titles repeated in `posts.ts` comments, `public/llms.txt`, `public/llms-full.txt` and drivers; the essay skill gains the voice rules; full build and drivers; commits

Route evidence: five independent units with disjoint files, each several files and well over 100 changed lines, launched together.

## Log

- L1 (2026-11-18, user, verbatim): "corrige lo que esté en tus manos del lado tecnico, del lado del diseño, me gusta, pero en los articulos, me gustaria que pongamos titulos y contenido escrito en un lenguaje mas humanoy simple, veo que usas terminos y frases demasiado genericas cosas como \"Once rondas de revisión con AI no reemplazan diez minutos de un usuario\". hay opciones como Puedes pedirle once rondas de revisión a la IA, pero nada reemplaza diez minutos escuchando a un usuario de verdad o \"Por qué diez minutos de feedback real ganan frente a las iteraciones con IA\""
- L2 T1 to T4 returned: 14 posts rewritten in both languages (titles, excerpts, headings, bodies; figure wording where it used jargon), each within 12 % of its previous word count, no semicolons or em dashes left in the bodies. The case study on figures keeps its title. Decision by a writer, kept by the parent: the first essay's title says "usando el producto como un usuario de verdad" instead of Edwin's "escuchando a un usuario de verdad", because the essay itself says the only user was the author. Links between essays that quoted a sibling's old title were updated. Commit 7ee6f00.
- L3 T5 returned: search drops read articles while Unread is on (readstate driver gains two checks, RED 122/125 then 125/125); stack links land on one case study through `#case-<id>` anchors (stack driver RED 104/107 then 108/108; in XP it scrolls an open Projects window and does nothing when it is closed, as before). Commits 932091e and 1ec57ed.
- L4 S1c cause: related articles are scored by shared tags plus a recency boost in fractional days from `Date.now()`; a post with two shared tags dated ten days earlier tied exactly with essays with one shared tag, and the current millisecond decided the order, so the related cards changed between visits. It started on 2026-11-17 and also failed locally (2 of 5 runs). Fix by the parent: whole days. Commit 9dae8a1.
- L5 Seam on the final tree: build clean; routes 11/11, readstate 125/125, stack 108/108, blogfront 250/250, reading, figures (5 files), promo 28/28 and dist, dark 77/77, xp 100/100, disclosures 14/14 all pass; lint 15 problems, none new. Newspaper baselines re-cut; attribution: the essay titles and excerpts shown in the series showcase and the blog front changed. Visual check at 375 and 1440 px of the showcase, the blog front and one article: long titles wrap without overflow. Old titles replaced in `public/llms.txt` and `public/llms-full.txt`; the English summaries in `llms-full.txt` keep their earlier wording.
- L6 (2026-11-18, user, verbatim): "sube los cambios y publica"
