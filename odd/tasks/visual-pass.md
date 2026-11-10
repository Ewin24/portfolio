# visual-pass

Objective: visual audit of the portfolio with applied improvements, plus refreshed projects from Engram.
Branch: `feat/visual-pass`. Delivery: single PR (ask-on-risk). Runner: `npx tsc -b`, `npm run build`, `npm run test:xp`, `npm run test:newspaper`, `npm run test:routes`, `npm run cv`.

## Specs

- S1: "realiza nuevamente la auditoria en busqueda de mejoras visuales al portafolio, proponiendo cambios y mejoras"
- S2: "así mismo realiza las mejoras y ajustes con los proyectos que tenemos en engram para mostrarlos en la pagina"

Assumption (not a user requirement): published text follows `skills/business-data-protection/SKILL.md`; pre-existing lines that look like client identifiers are reported, not rewritten.

## Tasks

- [x] T1 (S1, inline) Case-study cards: metric strip, full text behind a native disclosure. Commit 1.
- [x] T2 (S1, inline) Experience: first four achievements visible, rest behind a disclosure. Commit 1.
- [x] T3 (S1, inline) About copy and pull quote, hero stats, skill tile caption, education layout, XP hero overlap, blog tag casing. Commit 1.
- [x] T4 (S2, inline after one read-only Engram explorer; trigger: more than 5 lookups across 12 Engram projects) Refresh case studies. Commit 2. No new case study added: the explorer found none finished enough.
- [x] T5 (S1, S2) Baselines re-cut, CV regenerated, llms/noscript surfaces in sync. Commit 2.

## Log

- L1 (2026-11-10, user, verbatim): "realiza nuevamente la auditoria en busqueda de mejoras visuales al portafolio, proponiendo cambios y mejoras, así mismo realiza las mejoras y ajustes con los proyectos que tenemos en engram para mostrarlos en la pagina"
- L2 Audit (screenshots at 1440 and 375, both themes): case-study section is 5,467 px tall on desktop and 12,699 px on mobile; problem/solution are cut to one or two lines with the remainder only in `sr-only`, while impact is an unbroken bold paragraph. Experience is 8,492 px on mobile (up to 9 bullets per role). About copy predates the recruiter pass (subtitle "Full Stack", claims microservices/cloud) and its pull quote repeats a body sentence. Hero third stat counts technologies (66). Every skill tile reads "3 hitos". Two education cards have an empty right column. XP at 375: the scroll arrow overlaps the stat labels. Blog tags split by casing (`dotnet` vs `.NET`).
- L3 Result: case-study section 5,467 → 4,037 px (desktop) and 12,699 → 8,843 px (mobile); experience 8,492 → 6,980 px (mobile). New `npm run test:disclosures` 14/14. `test:xp` 100/100, `test:routes` 6/6, `test:404` 7/7, `test:newspaper` 8/8 after re-cutting baselines (the first re-cut of en@768 was an outlier capture: 11,381 px off on two consecutive runs, 0 after a second re-cut, stable on two more runs). `tsc -b` and `build` clean; lint unchanged at 15 pre-existing errors.
- L4 Engram refresh (spot-checked by the parent): DevManager 862 API tests and 52/52 e2e (#2937), suite 66 → 862 (#2806, #2937, not spot-checked: #2806); ReaderSS 787 tests (#2640), coverage and bundle keep the date of their measurement; STARSOL upgrade phase 3 at 1,173 tests, 0 new failures, 0 deprecations (#2936) — worded as "no regressions against the baseline", never as a green suite; SOVI escalation of exhausted attempts to human support (#2858).
- L5 Needs the owner's decision (reported, not rewritten — pre-existing lines): (a) the SOVI and LOS entries publish schema-qualified table names and source type/member names, at least one confirmed real by #2858; (b) `apiquac-admin-ui` lists React/TypeScript while the observed web front of that system is Razor Pages; (c) `infobip-email-api` says the accounts are configured in a settings file in `solution` and encrypted in the database in `impact`; (d) no observation was found backing "3+ s to sub-second" (Datacredito), "v1.12.2" or "~36 commits in 3 days" (Harmony); (e) #2858 records one bot outcome decided in code, which sits against "no hardcoded if/switch" in the SOVI text; (f) SEO metadata in `index.html` and `vite.config.ts` still titles the page "Software Architect & Full Stack Developer".
- L6 Not done: new case studies (Laravel upgrade is in progress; the .NET 10 ERP and the legacy-database repository have no tests or measurable result). The eleventh card sits alone on the last desktop row.
