# blog-stack-evolution

Objective: make the reading state visible everywhere, give the blog an editorial front and series, and turn the technology stack section from a flat list into grouped, evidenced technologies.
Branch: `feat/blog-stack-evolution`, small commits (the native review accepts about 1,900 changed lines per candidate, so logic lands in commits well under that). Delivery: stacked local commits; push, PR and merge only when Edwin asks. Runner: `npm run build`, `npm run test:figures`, `npm run test:routes`, `npm run test:reading`, `npm run test:dark`, `npm run test:promo`, `npm run test:newspaper`, `npm run test:xp`, `npm run test:disclosures`, plus the new drivers named below.

## Specs

- S1: "quiero que propongas las mejoras visuales y evolutivas para el blog y para la seccion de stakc tecnologico, ya que las veo muy simples, en la seccion donde se ven los articulos no refleja si ya fue leido"
- S2: "si, arranca en auto con todo" (answer to the proposal below and to "¿Arranco con el estado de lectura, o prefieres ajustar o quitar algo de la lista antes?"). "en auto": decide without asking; record each decision in the log as an assumption.
- S3 Reading state (proposal 1, as presented to Edwin):
  - S3a "Marca visible: un sello \"LEÍDO\" en la esquina de la tarjeta (el mismo estilo del sello \"EN CURSO\" de Trayectoria) y el título atenuado."
  - S3b "La misma marca en todas partes: bloque de ensayos, relacionados y anterior/siguiente."
  - S3c "Filtro \"No leídos\" y un contador (\"Leíste 2 de 38\")."
  - S3d "Distinguir \"empezado\" de \"leído\": hoy un artículo cuenta como leído con solo abrirlo. Propongo marcarlo leído al llegar al final y ofrecer \"Continuar leyendo\" donde quedaste."
  - Constraint: marks already stored under `portfolio-read-posts` (legacy slug strings and `[slug, isoDate]` pairs) stay read exactly as they are; that key's format does not change. Progress of a started article lives under a new key.
- S4 Blog (proposal 2):
  - S4a "Portada editorial: un artículo principal grande y los demás en lista secundaria, como primera plana. Hoy son tarjetas iguales y de alturas disparejas."
  - S4b "Un solo blog con pestañas (Todos, Ensayos, Técnico). Hoy los ensayos aparecen bajo el título \"Blog Técnico\", también dentro del artículo."
  - S4c "Series: agrupar los ocho ensayos sobre AI como una serie con orden, progreso y \"siguiente de la serie\"."
  - S4d "Vista previa de la figura del artículo en su tarjeta, usando el componente nuevo." Assumption: only the lead article shows a figure preview (its first figure at its final state, without the player), so a list of cards does not mount dozens of figures.
  - S4e "Dentro del artículo: índice de secciones con avance y tiempo restante."
  - S4f "Corrección menor: en el bloque de ensayos hay un resumen que se corta a media línea."
  - Assumption: the home "Ensayos" block becomes the showcase of the series (S4c) instead of a second list of the same cards the blog shows.
- S5 Stack (proposal 3). Today: "15 tarjetas iguales en dos columnas, con un panel de tres viñetas y mucho espacio vacío."
  - S5a "Agrupar por área: backend, datos, frontend, nube, calidad y AI."
  - S5b "Evidencia por tecnología: en qué casos de estudio y artículos aparece, con enlaces. Sale de datos que ya están en el repositorio, sin inventar niveles."
  - S5c "Estado en vez de barras de habilidad: \"en producción hoy\", \"usado antes\", \"explorando\"." Constraint: a status is shown only when a rule over existing data decides it (for example the stack of the current role in `src/content/experience.ts`); where the data cannot decide, no status is shown. No invented level, year count or percentage.
  - S5d "Un mapa tecnología × proyecto, hecho con el componente de figuras."
  - Constraint: the `stack` arrays in `src/content/experience.ts` and `src/content/case-studies.ts` are not edited (the Hero technologies count derives from them). The XP theme shows this section inside a window and must keep working.

## Tasks

- [x] T1 (S3, delegated: parallel units and context backstop) Reading state everywhere. Driver `driver/readstate.mjs`.
- [x] T2 (S5, delegated: parallel units and context backstop) Stack section. Driver `driver/stack.mjs`.
- [ ] T3 (S4, delegated: context backstop; starts after T1 because both edit the blog list, the article and the essays block) Blog front, tabs, series, lead figure preview, article contents. Driver `driver/blogfront.mjs`.
- [ ] T4 (all, inline) Seam check, visual pass in light, dark and XP at 375 and 1440 px, existing drivers updated where the interface they test changed, baselines re-cut with attribution, commits.

Route evidence: T1 and T2 are independent behaviours with disjoint files, each several files and well over 100 lines, launched together; T3 depends on T1. The parent session is very long, so the context backstop applies to all three.

## Log

- L1 (2026-11-17, user, verbatim): "quiero que propongas las mejoras visuales y evolutivas para el blog y para la seccion de stakc tecnologico, ya que las veo muy simples, en la seccion donde se ven los articulos no refleja si ya fue leido"
- L2 Reproduced on the live site before proposing: after reading two articles, the home "Ensayos" block showed no read mark on the read essay (0 of 3 cards); the blog list did mark both, with a 10 px muted line inside a card otherwise identical to the others; related articles and previous/next showed nothing. Also seen: one essay excerpt in the essays block is cut mid-line; the stack section is 15 identical cards in two columns with a three-bullet panel.
- L3 (2026-11-17, user, verbatim): "si, arranca en auto con todo"
- L4 T1 returned and was verified by the parent: driver/readstate.mjs 123/123. An opened article is started and becomes read 1.5 s after the end of its body is reached; progress is the furthest point reached, under the new key portfolio-reading-progress ({slug: [fraction, isoDate]}, 50 entries, written at most every 400 ms); portfolio-read-posts is byte-identical for existing marks. One ReadMark component in the list, the essays block, related and previous/next. Unread toggle and counter in the filters; search results are not filtered by Unread (BlogSearch was outside the unit). Commits 6a56766 (code) and 5ce1fc6 (drivers).
- L5 T2 returned and was verified by the parent: driver/stack.mjs 105/105. Six areas, counts and links derived through an exact-match alias table in src/content/stack.ts, status by rule (a technology in the stack of a current role is in production today; one seen only in past roles or case studies is used before; AI Discoverability has no evidence and no status), map figure with a new grid renderer. Case-study links go to the section because the section cannot open one study. Decisions by the writer: .NET MAUI counts as .NET / C#, Dart as Flutter. Commits 2e673b2 and 8bd0979.
- L6 (2026-11-17, user, verbatim, while T3 was still being built): "sube los cambios y publica". Read as: publish what is finished now and the rest when it is verified (assumption). T1 and T2 were published from a separate worktree at the committed state, so the files T3 was writing stayed out.
- L7 Checks at the committed state of T1 and T2, in the separate worktree: build clean; readstate 123/123; stack 105/105; reading 33/33; routes 8/8; promo 28/28 and 23/23; dark 77/77; xp 100/100; disclosures 14/14; lint 15 problems (two fewer than before, none new). Two test fixes: driver/dark.mjs skips figure elements whose step has not been reached (opacity 0 on purpose); driver/readstate.mjs waits for the headline to change when going from one article to another, because on a loaded machine it moved on before the article had mounted. Newspaper baselines re-cut; attribution: the stack section is rebuilt and the blog filters gain the unread toggle and the counter. While T3 was running its own servers and tests on the same machine, one capture (en, 768 px) differed from a baseline cut seconds earlier by under 0.1 % in the hero text, with no visible difference; baselines are cut again when T3 lands.
