Objective: make the portfolio convert recruiters (trust fixes + unpublished Engram material).
Branch: feat/recruiter-pass · Delivery: ask-on-risk, ~400-line slices · Checks: `npm run build`, `npm run lint`, `npm run test:newspaper`.

## Specs

- S1 Hero states role, seniority-free title "Líder Técnico · Desarrollador .NET", availability (remote, UTC−5), English "B1", and a Download CV CTA.
- S2 Each experience shows engagement type: BAGUER "tiempo completo", Espejos Glam "tiempo completo", STARSOL "contratos". Dates unchanged ("la escalera de tiempos ya está").
- S3 BAGUER current role reflects: "soy director de toda la parte de credito, (lo que ya viste de apiquac), encargado de valores de cupo, calculo de riesgo de credito, etc". "3s → 400ms" kept only there.
- S4 Testimonials removed: "por el momento son falsos, mejor quitarlo".
- S5 Client name anonymized wherever a case study is under NDA (business-data-protection).
- S6 LOS case study first; skills claims trimmed to what case studies prove.
- S7 DevManager case study: "fue mi proyecto de grado, lo cual es totalmente mio, luego se ha desarrollado como producto independiente". No prospect/competitor data.
- S8 Downloadable CV PDF (ES + EN).
- S9 New Engram metrics in LOS and STARSOL case studies (by role, no forbidden identifiers).

## Tasks

- [ ] T1 S1 hero — inline
- [ ] T2 S2,S3 experience — inline
- [ ] T3 S4 remove testimonials — inline
- [ ] T4 S5,S6 anonymize + order + skills — inline
- [ ] T5 S7,S9 DevManager + new metrics — inline
- [ ] T6 S8 CV PDF — inline

## Log

- L1 (2026-11-10) "con lo que hemos desarrollado, quiero que vuelvas a revisar engram y los proyectos y traigas todo lo que sea de valor en mi portfolio, si es necesario genera agentes especializados encargados de dar ese valor y auditar el portfolio, para que resulte de interes a reclutadores"
- L2 4 read-only agents harvested Engram + recruiter audit; summary in Engram `portfolio/recruiter-value-harvest`.
- L3 User answers: DevManager is own thesis → independent product; English B1; title "lider de desarrollo, lider tecnico o desarrollador .net"; BAGUER + Espejos Glam full-time, STARSOL contracts; director of credit area; testimonials fake → remove.
