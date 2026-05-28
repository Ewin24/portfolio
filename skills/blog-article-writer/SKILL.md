---
name: blog-article-writer
description: "Trigger: write article, blog post, redactar, mejorar artículo, edit post, contenido blog. Write, edit, or improve bilingual technical blog articles in the portfolio style."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Activate when: writing a new blog post, editing an existing one, improving tone or structure. Do NOT activate for research-only or code-only tasks.

## Hard Rules

1. **Bilingual**: Write BOTH `content` (ES) and `contentEn` (EN). ES is source, EN is natural English (NOT translated-from-Spanish). Code snippets and metrics are BYTE-IDENTICAL in both versions.
2. **Style**: First person ("Diseñé", "Implementé", "Decidimos" / "I built", "I chose", "We decided"). Direct, analytical tone. Zero AI clichés — banned: "vertiginoso mundo", "revolucionario", "en conclusión", "cabe destacar", "vale la pena mencionar", "no solo... sino también", "en el dinámico panorama".
3. **Structure**: Problem → Wrong approach → Solution → Impact → Lessons (follow exact 5-section formula of existing posts).
4. **Snippets**: Max 10 lines each, 3-5 per article. C# or JSON. Must be REAL code patterns, not invented examples.
5. **Diagrams**: Include 1-2 ASCII architecture diagrams when describing system flow.
6. **Word budget**: 1,500–2,000 words per language (exclude code blocks).
7. **NDA**: Obfuscate metrics (ranges, not absolutes). No URLs, credentials, IPs, or real client data.

## Decision Gates

| Need | Action |
|------|--------|
| New article | Add new `BlogPost` to end of `blogPosts` array in `posts.ts` |
| Edit existing | Find by `id` and modify fields |
| Need research first | Delegate to `blog-content-researcher` skill |
| Code snippet | Must match actual project code pattern, file path noted |
| Architecture diagram | Use ASCII, not images. Show data flow or layer resolution |

## Execution Steps

1. Read `src/blog/types.ts` for BlogPost interface.
2. Read `src/blog/content/posts.ts` for existing articles (match style).
3. Read research output (from user or blog-content-researcher).
4. Write ES content: 5 sections following the formula.
5. Embed code snippets (max 10 lines) and ASCII diagrams.
6. Write EN content: natural English, same structure.
7. Assemble BlogPost metadata: id, slug, title/titleEn, date, tags, category, featured, excerpt/excerptEn, relatedIds.
8. Validate: word count (1,500-2,000 per language), AI cliché scan, NDA scan, snippet line count.
9. Run `npx tsc -b --noEmit` to verify build.

## Output Contract

```
## Article Summary

**id**: {slug}
**Title ES**: {title}
**Title EN**: {titleEn}
**Words**: ES {N} / EN {N}
**Snippets**: {N} (max lines: {N})
**Diagrams**: {N}

### Quality Gates
- [ ] ES 1,500-2,000 words
- [ ] EN 1,500-2,000 words
- [ ] Zero AI clichés
- [ ] NDA compliant
- [ ] Snippets ≤ 10 lines
- [ ] Build passes
```

## References

- `src/blog/types.ts` — BlogPost interface
- `src/blog/content/posts.ts` — existing articles (style reference + where to add)
- `src/blog/components/BlogArticle.tsx` — rendering (markdown via micromark)
- `src/blog/content/parser.ts` — micromark parser
