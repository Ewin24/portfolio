Objective: 6 bilingual blog posts from the Engram harvest, plus the whole-portfolio surfaces they touch.
Branch: feat/blog-harvest (stacked on feat/recruiter-pass) · Delivery: stacked branch, one commit per article · Checks: `npx tsc -b`, `npm run build`, `npm run test:newspaper`, data-protection sweep.

## Specs

- S1 One post per harvested topic: AsyncLocal does not flow back; characterization tests before refactoring; GETDATE vs SYSDATETIME; Channel<T> background worker without a broker; InMemory tests lie about transactions; a redaction grep cannot see camelCased identifiers.
- S2 Each post follows `skills/blog-article-writer/SKILL.md` (ES + EN, 5 sections, snippets ≤10 lines, 1,500–2,000 words per language).
- S3 Each post passes `skills/business-data-protection/SKILL.md`: invented neutral identifiers only, no client names, no security findings.
- S4 Whole-portfolio rule: llms.txt, llms-full.txt and index.html dateModified reflect the new posts.

## Tasks

- [x] T1 S1-S3 asynclocal — delegated (parallel, 6 independent units)
- [x] T2 S1-S3 characterization tests — delegated
- [x] T3 S1-S3 getdate vs sysdatetime — delegated
- [x] T4 S1-S3 channel background worker — delegated
- [x] T5 S1-S3 inmemory vs transactions — delegated
- [x] T6 S1-S3 redaction grep — delegated
- [x] T7 S4 wire posts + surfaces + checks — inline (parent owns posts.ts)

## Log

- L1 (2026-11-10) "si, ya puedes escribir los temas del blog"
- L2 Route: Writer trigger (a) — 6 independent units of several minutes each; each writer owns one file under src/blog/content/posts/, parent owns posts.ts.
- L3 All 6 writers returned: tsc green, 1,535–1,669 words per language, snippets ≤10 lines, invented identifiers. Writer evidence gap: "38/38 SQL probes" absent from Engram → removed from the DevManager case study on feat/recruiter-pass (b8bc046, baselines re-cut there too).
- L4 Parent checks: forbidden-token sweep 0 hits; code-fence identifiers listed and reviewed (framework or invented only); all 6 articles render ES/EN with no raw fences, the table renders; sitemap 33 entries; XP 100/100; newspaper 8/8 after re-cut; lint error count not above baseline.
- L5 Found while testing: sitemap/JSON-LD/llms linked `#/blog/article/…` but the app only routes `#blog/article/…` (links opened the home page). RED observed, fixed by normalizing the hash in main.tsx + canonical URLs in generators; GREEN observed for both forms.
