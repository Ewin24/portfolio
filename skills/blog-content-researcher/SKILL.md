---
name: blog-content-researcher
description: "Trigger: new article, explorar, investigar, buscar proyecto, find topic, research, contenido. Explore Engram and codebase to find technical material for blog articles."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Activate when user wants to: start a new blog article, explore a project engram for material, find technical topics across project memory. Do NOT activate for writing, editing, or reviewing articles.

## Hard Rules

1. ALWAYS search Engram FIRST: `mem_search(query: <keywords>, project: "portfolio")` THEN widen to all projects if nothing found.
2. Cross-reference with `src/content/case-studies.ts` and `src/content/experience.ts` for documented projects.
3. If a project exists in Engram under a different project name (e.g. `Api_InfobipBaguerRest`), search there too.
4. Extract: tech stack, architecture patterns, business problems solved, hard metrics, team size, timeline.
5. Return a structured analysis identifying: what's blog-worthy, what's NDA-sensitive, and gaps to ask the user.

## Decision Gates

| Signal | Action |
|--------|--------|
| Project has NDA | Obfuscate metrics, use ranges, anonymize client names |
| Project found in Engram | Read exploration + proposal + design + apply for full context |
| Project NOT found | Ask user for raw data (problem, stack, role, impact, biggest challenge) |
| Previous blog post exists on similar topic | Note it and recommend relatedIds cross-link |

## Execution Steps

1. `mem_context()` for recent session context.
2. `mem_search(query: <topic>, limit: 20)` — search portfolio first, then all projects.
3. Read hits via `mem_get_observation(id)` for full content.
4. Check `src/blog/content/posts.ts` for existing coverage of similar topics.
5. Check `src/content/case-studies.ts` + `src/content/experience.ts` for documented projects.
6. Build structured analysis with: project overview, tech stack, architecture, metrics, NDA notes, recommended article angle.

## Output Contract

```markdown
## Research: {Topic}

**Project**: {project name}
**Source**: Engram `sdd/{...}` / case-studies / experience / user-provided

### Technical Profile
- Stack: {.NET 8, Dapper, SQL Server, ...}
- Architecture: {Clean Architecture 4 layers, ...}
- Patterns: {Repository, Strategy, ...}

### Blog-Worthy Angles
- {Angle 1}: {why it demonstrates seniority}
- {Angle 2}: {why it demonstrates business impact}

### Hard Metrics Available
- {metric}
- {metric}

### NDA Boundaries
- ✅ Can show: {concepts, patterns, abstractions}
- ❌ Must hide: {credentials, URLs, client names, exact metrics}

### Gaps (ask user)
- {what info is still missing}

### Recommended Article Type
{Architecture deep-dive / Problem-solution / Migration story / ...}
```

## References

- `src/blog/content/posts.ts` — existing articles for coverage check
- `src/content/case-studies.ts` — documented projects with STAR format
- `src/content/experience.ts` — work experience with tech stack
- Engram topic keys: `sdd/{project}/{artifact}` for SDD-documented projects
