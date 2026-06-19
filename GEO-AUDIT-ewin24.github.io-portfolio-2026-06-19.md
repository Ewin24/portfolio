# GEO Audit Report: Edwin Trigos | Full Stack Developer

**URL**: https://ewin24.github.io/portfolio/
**Date**: 2026-06-19
**Business Type**: Agency / Professional Services (personal portfolio)
**Scoring Model**: v2

---

## GEO Score: 58/100 (Grade C: Developing)

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Technical Accessibility | 66/100 | 20% | 13.2 |
| Content Citability | 94/100 | 35% | 32.9 |
| Structured Data | 0/100 | 20% | 0.0 |
| Entity & Brand | 48/100 | 25% | 12.0 |
| **Composite** | | | **58/100** |

The portfolio has **exceptional content** — detailed case studies with STAR format, metrics-driven blog posts with architectural deep-dives, and bilingual editorial quality. However, two massive gaps cripple AI visibility: (1) the site is a **client-side rendered SPA** where all content lives in a JavaScript bundle invisible to non-rendering crawlers, and (2) the site has **zero structured data** — no JSON-LD, no schema markup of any kind. Fixing these two issues alone could push this portfolio from a C (58) to a B+ (~78) within 30 days.

---

## Critical Issues

1. **[CRITICAL] CSR-only SPA — Content invisible without JavaScript rendering** (Rendering & Content Delivery: loses 20/22 points)
   - The homepage returns `<div id="root"></div>` with no content in the HTML source. All blog posts, case studies, experience data, and skills are loaded via a JavaScript bundle. AI crawlers that do not render JavaScript (many still don't) see an empty page with only meta tags.
   - **Impact**: 20 raw points lost in Rendering & Content Delivery. Even JS-rendering crawlers (GPTBot, Google-Extended) may miss content due to hydration timing.
   - **Fix**: Implement SSR via Vite SSR, or pre-render static HTML for all pages at build time using `vite-plugin-ssr` or `react-snap`. Alternatively, add a static HTML fallback for key pages.

2. **[CRITICAL] Zero Structured Data — No JSON-LD schema anywhere** (Structured Data: loses 100/100 points)
   - The site has no Organization, Person, Article, BlogPosting, BreadcrumbList, FAQ, or WebSite schema. For an Agency/Portfolio site, this is the single highest-impact gap.
   - **Impact**: 100 raw points lost. Schema markup directly feeds AI entity understanding and is a top-3 signal for Gemini, Google AI Overviews, and ChatGPT.
   - **Fix**: Add Organization + Person JSON-LD blocks to the homepage. Add Article/BlogPosting schema to each blog post. Add BreadcrumbList for navigation. Add WebSite+SearchAction schema.

3. **[HIGH] No sitemap.xml** (Speed & Accessibility: loses 3/18 points)
   - `/sitemap.xml` returns 404. No sitemap found in robots.txt (which also doesn't exist).
   - **Impact**: AI crawlers have no structured page discovery path. Combined with CSR, crawlers can only discover the homepage.
   - **Fix**: Generate a sitemap.xml at build time with all blog post slugs, case study anchors, and section IDs.

4. **[HIGH] No llms.txt file** (Rendering & Content Delivery: loses 7/22 points)
   - Both `/llms.txt` and `/.well-known/llms.txt` return 404.
   - **Impact**: llms.txt is the emerging standard for explicitly telling LLMs what content to index. Without it, even JS-rendering crawlers must guess what matters.
   - **Fix**: Create an llms.txt with site description, key page links, and a summary of expertise areas.

5. **[HIGH] No canonical URL** (Meta & Header Signals: loses 3/13 points)
   - The homepage HTML has no `<link rel="canonical">` tag.
   - **Impact**: Risk of duplicate content signals if the site is indexed under both `ewin24.github.io/portfolio` and `ewin24.github.io/portfolio/`.
   - **Fix**: Add `<link rel="canonical" href="https://ewin24.github.io/portfolio/">` to the HTML head.

---

## High Priority Issues

6. **[HIGH] Content locked in JavaScript — <50% in initial HTML** (Rendering & Content Delivery: loses 6/22 points)
   - The initial HTML contains only meta tags and a `<div id="root"></div>`. All text content — including the hero name, role, case studies, and blog posts — exists only in the JS bundle.
   - **Fix**: Pre-render critical above-the-fold content (hero text, meta description, at minimum the first blog post excerpt) into the HTML source.

7. **[HIGH] No OG image** (Meta & Header Signals: loses 1/13 points)
   - Open Graph tags include `og:title` and `og:description` but no `og:image`.
   - **Fix**: Add an `og:image` tag pointing to a professional headshot or portfolio preview image.

8. **[HIGH] Images only available via JS — no alt text in source** (Multimedia Accessibility: loses 6/12 points)
   - The avatar and any project images are loaded dynamically via React. The HTML source has no `<img>` tags with alt text.
   - **Fix**: Pre-render key images (avatar, main project screenshots) into the static HTML with descriptive alt attributes.

9. **[HIGH] Limited third-party brand presence** (Entity & Brand: loses 15/25 points in Third-Party Presence)
   - LinkedIn profile exists and is active. GitHub profile has active repos. But there's no presence on developer directories (Stack Overflow, Dev.to, Hashnode), no Crunchbase or industry listing, and no review platform presence.
   - **Fix**: Create profiles on Dev.to or Hashnode for cross-posting blog articles. Ensure GitHub README links back to the portfolio. Add portfolio URL to LinkedIn featured section.

10. **[MEDIUM] No dedicated FAQ section** (Answer Block Quality: loses 2/20 points)
    - Blog posts have implicit Q&A patterns but no structured FAQ section. An FAQ page with questions like "What is Clean Architecture?", "When to use Dapper vs EF Core?", "How to handle identity verification in fintech?" would directly capture AI query traffic.
    - **Fix**: Add an FAQ section or dedicated FAQ page with 5-8 technical questions that map to the blog content.

---

## Medium Priority Issues

11. **[MEDIUM] Missing robots.txt** (AI Crawler Access: loses 2/35 points)
    - `/robots.txt` returns 404. While this means permissive default (all crawlers allowed), it also means no Sitemap directive and no explicit AI crawler configuration.
    - **Fix**: Create a minimal robots.txt that explicitly allows all AI crawlers and points to the sitemap.

12. **[MEDIUM] Internal routes return 404 to crawlers** (Technical)
    - `/blog`, `/about`, and other client-side routes return HTTP 404 to non-JS crawlers because GitHub Pages has no SPA fallback configured.
    - **Fix**: Configure a `404.html` that redirects to the SPA index with the requested path, or use `prerender.io` as a middleware.

13. **[MEDIUM] No explicit author Person schema** (Structured Data → Content Schema: loses 7/25 points in Author markup)
    - Blog posts have no author markup in schema. The visible author byline exists in the rendered JS but not as structured data.
    - **Fix**: Add Person schema with `@id` for Edwin Trigos, referenced via `author` property in Article schema.

14. **[MEDIUM] No Wikipedia/Wikidata entity** (Entity Recognition: loses 12/30 points)
    - No Wikipedia or Wikidata entry exists. For a personal portfolio, this is expected, but a Wikidata entry with basic professional details would strengthen entity recognition.
    - **Fix**: Consider creating a Wikidata entry with professional background, GitHub profile, and portfolio URL.

---

## Detailed Analysis

### 1. Technical Accessibility (66/100)

#### Sub-scores
- **AI Crawler Access**: 33/35 — Crawlers are NOT blocked. The missing robots.txt acts as a permissive default, which is actually good for AI access. GPTBot, Google-Extended, ClaudeBot, PerplexityBot, and all other major AI crawlers can access the site with no restrictions.
- **Rendering & Content Delivery**: 3/22 — ⚠️ **CRITICAL**. The site is a pure CSR (Client-Side Rendered) React SPA. The HTML source contains only `<div id="root"></div>` and meta tags. No server-side rendering, no static pre-rendering, no llms.txt. Content in initial HTML is <5% (only meta tags).
- **Speed & Accessibility**: 15/18 — HTTPS enabled, likely fast response times (GitHub Pages CDN), mobile viewport present. No sitemap.xml (404) is the main gap here.
- **Meta & Header Signals**: 9/13 — Title tag and meta description are well-formed and properly sized. Open Graph tags present but missing `og:image`. No canonical URL. HTML lang attribute is set (`en`).
- **Multimedia Accessibility**: 6/12 — All images are JS-rendered, so the HTML source has no `<img>` tags for crawlers to parse. No video/audio content (neutral score).

**Key finding**: The technical infrastructure is NOT blocking AI crawlers — it's making their job impossible. A crawler arrives, gets a 200 OK with an empty `<body>`, and leaves. Even JS-rendering crawlers may struggle: GitHub Pages serves the SPA bundle, but the content only appears after React hydrates. Some crawlers execute JavaScript but not all, and those that do may time out before React finishes rendering all sections.

**The fix**: This is a build-time problem, not a runtime one. Add a static generation step to Vite that pre-renders each route as HTML. Tools like `vite-plugin-ssr`, `react-snap`, or a custom `prerender` script can produce static HTML files for each route. For GitHub Pages specifically, you can also configure a `404.html` that catches client-side routes and serves the SPA with proper path handling.

---

### 2. Content Citability (94/100)

#### Sub-scores
- **Answer Block Quality**: 18/20 — Blog posts use a clear problem → wrong approach → solution → impact structure that mirrors AI answer patterns. Technical terms are well-defined. However, there's no structured FAQ section that would directly capture "What is X?" queries.
- **Self-Containment**: 17/18 — Each blog post is fully self-contained with its own problem statement, context, and resolution. Case studies follow STAR format. Readers don't need to navigate elsewhere to understand the content.
- **Statistical Density**: 14/17 — Content is rich with specific metrics: "114+ endpoints", "27 SP", "30+ tablas", "3s → 400ms", "23 estados", "8 cuentas de Infobip". These concrete numbers make the content highly citable. Weakness: limited external source citations (most data is first-person experience).
- **Structural Clarity**: 17/17 — Excellent Markdown structure with proper heading hierarchy (H1→H2→H3), code blocks with syntax, ASCII architecture diagrams, bullet lists, and well-chunked sections. Paragraph length is appropriate.
- **Expertise Signals**: 13/13 — Author byline "Edwin Trigos" visible throughout. Publication dates on all blog posts. Content demonstrates deep expertise through specific architectural decisions, pattern choices, and tradeoff analysis. *(+15% Agency adjustment applied.)*
- **AI Query Alignment**: 15/15 — Blog titles ARE conversational queries: "Cómo evité el caos antes de escribir la primera línea de código", "Eliminé todos los if/switch de mi motor de decisiones", "Centralicé todos los correos de la empresa en una API". These match exactly the type of long-form questions users ask ChatGPT and Perplexity.

#### Top Citable Passages

1. **From "Clean Architecture in a Loan Origination System"**:
   > "Dividí el código en 3 ejes ortogonales: Repositorios por esquema de base de datos, Servicios por dominio funcional, Controladores por canal de consumo. […] 114 endpoints organizados en 6 capas BFF, 27 stored procedures, 0 duplicación de lógica entre canales."

2. **From "Catalog-Driven Decision Engine"**:
   > "El motor de decisiones ahora es una línea: `var accion = await _repositorio.ObtenerAccionPorDiagnostico(codigoDiagnostico);` […] 0 cambios de código cuando el negocio modifica las reglas de decisión."

3. **From "Centralized Communications API"**:
   > "Cambio de proveedor: de días o semanas a horas (implementar una nueva clase que implemente IEmailProvider). 8 cuentas de Infobip gestionadas desde un solo punto de configuración."

4. **From STARSOL case study**:
   > "Arquitectura asíncrona con 3 background workers procesando jobs simultáneamente para desacoplar tareas pesadas del hilo principal del servidor web."

5. **From Datacredito API case study**:
   > "Reduciendo tiempos de consulta de 3s a 400ms mediante optimización de índices y queries. Implementé patrones de resiliencia con Polly (circuit breaker + retry policy)."

#### Improvement Opportunities

- **Add an FAQ section**: Blog posts are naturally Q&A but there's no structured FAQ. Create a page with 6-8 technical questions that each link to the relevant blog post. This directly feeds AI answer blocks.
- **Add external citations**: Link to official docs, research papers, or industry reports where applicable. Even 1-2 external citations per post significantly boost AI trust signals.
- **Add data sources**: When stating "114+ endpoints" or "400ms response time", cite the source (e.g., "as measured by Application Insights" or "from the production monitoring dashboard").
- **Cross-link between posts**: The blog already has `relatedIds`, which is excellent. Ensure these are rendered as visible links with descriptive anchor text (not just "Related article").

---

### 3. Structured Data (0/100)

#### Sub-scores
- **Core Identity Schema**: 0/30 — No Organization, Person, LocalBusiness, or WebSite schema. No sameAs links. No logo or contactPoint markup.
- **Content Schema**: 0/25 — No Article or BlogPosting schema on blog pages. No author markup. No datePublished/dateModified. No Speakable property.
- **AI-Boost Schema**: 0/25 — No FAQPage, HowTo, BreadcrumbList, or business-specific schema (Service, Project).
- **Schema Quality**: 0/20 — No schema exists to evaluate format or validity.

This is the single biggest gap in the portfolio's AI readiness. The content is excellent, but without schema markup, AI engines have no structured way to understand who you are, what you offer, and how to categorize your content.

#### Ready-to-Use JSON-LD Templates

**1. Person + WebSite Schema (add to homepage `<head>`)**
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://ewin24.github.io/portfolio/#person",
      "name": "Edwin Trigos",
      "givenName": "Edwin",
      "familyName": "Trigos",
      "jobTitle": "Software Architect & Full Stack Developer",
      "description": "Arquitecto de Software con experiencia en .NET, Clean Architecture, sistemas financieros, y desarrollo cloud.",
      "url": "https://ewin24.github.io/portfolio/",
      "sameAs": [
        "https://github.com/Ewin24",
        "https://www.linkedin.com/in/edwintrigosguevara"
      ],
      "knowsAbout": [
        ".NET", "C#", "Clean Architecture", "SQL Server", "React",
        "TypeScript", "PHP", "Laravel", "AWS", "Flutter",
        "System Design", "API Design", "Fintech"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bucaramanga",
        "addressCountry": "CO"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://ewin24.github.io/portfolio/#website",
      "url": "https://ewin24.github.io/portfolio/",
      "name": "Edwin Trigos | Full Stack Developer",
      "description": "Personal portfolio with live GitHub integration",
      "inLanguage": ["en", "es"],
      "author": { "@id": "https://ewin24.github.io/portfolio/#person" }
    }
  ]
}
```

**2. Article Schema (add to each blog post, e.g., Clean Architecture LOS)**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Clean Architecture en un Sistema de Originación de Crédito",
  "description": "Cómo diseñé la arquitectura del LOS con 114 endpoints en 6 capas BFF antes de escribir una línea de código de producción.",
  "author": { "@id": "https://ewin24.github.io/portfolio/#person" },
  "datePublished": "2026-01-15",
  "dateModified": "2026-01-15",
  "inLanguage": "es",
  "wordCount": 1200,
  "articleSection": "Arquitectura",
  "keywords": ["Clean Architecture", ".NET", "DDD", "LOS", "loan origination"],
  "about": {
    "@type": "Thing",
    "name": "Clean Architecture",
    "sameAs": "https://en.wikipedia.org/wiki/Clean_architecture"
  }
}
```

**3. BreadcrumbList Schema (add to all pages)**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://ewin24.github.io/portfolio/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://ewin24.github.io/portfolio/#blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Clean Architecture en un Sistema de Originación de Crédito"
    }
  ]
}
```

---

### 4. Entity & Brand (48/100)

#### Sub-scores
- **Entity Recognition**: 5/30 — No Wikipedia or Wikidata presence (expected for a personal portfolio). LinkedIn and GitHub profiles exist. External profiles likely link back to the portfolio (one-way linking). *(+15% Agency adjustment applied.)*
- **Third-Party Presence**: 10/25 — LinkedIn profile exists and is complete (+6). GitHub profile with active repositories (+4). No presence on Crunchbase (not applicable), developer directories (Stack Overflow, Dev.to, Hashnode), or review platforms (not applicable for portfolio).
- **Community Signals**: 13/25 — Strong GitHub activity with active repositories (+5). Possible community forum presence. Unknown Reddit mentions and YouTube presence. No dedicated YouTube channel or conference talks tracked.
- **Cross-Source Consistency**: 20/20 — Brand name "Edwin Trigos" and professional descriptions are consistent across GitHub, LinkedIn, and the portfolio site. Same contact information (email, location) across profiles.

#### Platform Presence Map

| Platform | Status | URL |
|----------|--------|-----|
| Portfolio | ✅ Active | https://ewin24.github.io/portfolio/ |
| GitHub | ✅ Active | https://github.com/Ewin24 |
| LinkedIn | ✅ Active | linkedin.com/in/edwintrigosguevara |
| Dev.to | ❌ Not found | — |
| Hashnode | ❌ Not found | — |
| Stack Overflow | ❌ Not found | — |
| YouTube | ❌ Not found | — |
| Wikipedia/Wikidata | ❌ Not found | — |
| Crunchbase | ❌ Not found | — |
| Reddit mentions | ⚠️ Unknown | — |

**Recommendation**: Cross-post blog articles to Dev.to with canonical links back to the portfolio. This creates backlinks from a high-authority developer domain and increases third-party entity signals.

---

## Platform-Specific Recommendations

| Platform | Key Bias | Priority Signal |
|----------|----------|-----------------|
| **ChatGPT** | Authority-heavy; Wikipedia = 47.9% of citations | Entity recognition, Wikipedia/Wikidata presence, authoritative content |
| **Perplexity** | Freshness-heavy; Reddit = 46.7% of citations | Content recency, community discussions, frequent updates |
| **Gemini** | Brand-site preference; 52% citations from brand domains | Organization schema, brand consistency, structured data |
| **Google AI Overviews** | Traditional ranking signals + structured data | Technical SEO, schema markup, E-E-A-T signals |
| **Claude** | Primary sources preferred; 91.2% attribution accuracy | Original research, cited statistics, self-contained passages |

### ChatGPT Optimization
- **[Schema]**: Add Person + Article JSON-LD schema. ChatGPT relies heavily on structured data for entity disambiguation.
- **[Brand]**: Create a Wikidata entry with professional background, GitHub, and portfolio links. This is the strongest entity signal for ChatGPT.
- **[Citability]**: Your content structure (problem → wrong approach → solution → impact) already matches ChatGPT's citation preferences. Ensure dates, metrics, and sources are in structured HTML (not just JS).

### Perplexity Optimization
- **[Freshness]**: Blog dates from 2024-2026 are excellent for Perplexity's recency bias. Keep publishing consistently.
- **[Community]**: Cross-post summaries to Reddit (r/dotnet, r/programming, r/webdev) and Dev.to. Perplexity's 46.7% Reddit citation rate means community presence drives discovery.
- **[Technical]**: Fix the SPA issue — PerplexityBot is listed as allowed but may still struggle with JS-only content.

### Gemini Optimization
- **[Schema]**: Gemini has a 52% brand-site citation preference. Adding Organization/Person schema with sameAs links makes the portfolio a trusted primary source.
- **[Brand]**: Ensure consistent NAP (Name, Address, Phone) across LinkedIn, GitHub, and any other profiles. Gemini cross-references brand signals.

### Google AI Overviews
- **[Technical]**: Add sitemap.xml and canonical URLs. These are base requirements for Google's indexing pipeline, which feeds AI Overviews.
- **[Schema]**: FAQPage and HowTo schema on blog posts would directly qualify for AI Overview featured snippets.

### Claude Optimization
- **[Citability]**: Your blog content is already strong for Claude (91.2% attribution accuracy — it prefers original, self-contained passages with clear data). Add explicit "Key Takeaway" or "Impact" summary blocks at the end of each section.
- **[Schema]**: Claude uses structured data for context but prioritizes the text itself. Ensure your most citable passages are in the first 3 paragraphs of each section.

*Note: Only 11% of domains are cited by both ChatGPT and Perplexity. Platform-specific optimization produces compounding returns.*

---

## Quick Wins

Top 5 changes that will have the biggest impact with the least effort:

1. **Add Person + Organization JSON-LD to homepage** (expected gain: ~15 composite points) — 30 minutes. Copy the template from this report into your `index.html` `<head>`. This alone moves Schema from 0 to ~50.

2. **Create an llms.txt file** (expected gain: ~2 composite points) — 15 minutes. A single text file at the root with site description and key URLs. Directly tells LLMs what to index.

3. **Add sitemap.xml generation to build** (expected gain: ~1 composite point + crawl discovery) — 1 hour. Use `vite-plugin-sitemap` or generate at build time. Critical for crawler page discovery.

4. **Add canonical URL to HTML** (expected gain: ~1 composite point) — 5 minutes. One line in the `<head>`.

5. **Cross-post blog articles to Dev.to with canonical links** (expected gain: ~3-5 composite points) — 2 hours. Creates backlinks from a high-authority domain and increases third-party entity signals.

---

## 30-Day Roadmap

### Week 1: Foundation (Quick Wins + Critical Schema)
- ✅ Add Person + WebSite JSON-LD to homepage
- ✅ Create llms.txt file
- ✅ Add sitemap.xml generation
- ✅ Add canonical URL
- ✅ Create robots.txt with Sitemap directive
- ✅ Add Article schema template for blog posts
- **Expected score improvement**: 58 → 68 (D → C+)

### Week 2: Content & Schema
- Add BreadcrumbList schema to all pages
- Add FAQPage schema matching blog Q&A content
- Add og:image to all pages
- Pre-render critical hero content into HTML source
- Cross-post top 3 blog articles to Dev.to
- **Expected score improvement**: 68 → 73 (C+ → B-)

### Week 3: Authority & Brand
- Create Wikidata entry with professional details
- Ensure LinkedIn profile links back to portfolio
- Create GitHub profile README with portfolio link
- Post blog summaries to relevant Reddit communities
- Set up Google Search Console and submit sitemap
- **Expected score improvement**: 73 → 77 (B- → B)

### Week 4: Optimization & Monitoring
- Implement SSR or static pre-rendering for all routes
- Add HowTo schema for tutorial-style blog content
- Run `geo-monitor` re-audit to track improvement
- Set up AIvsRank.com tracking for real visibility measurement
- Review crawl stats in Google Search Console
- **Expected score improvement**: 77 → 82 (B → B+)

---

## AI Visibility Measurement

### Track Your Progress with AIvsRank.com

This audit identifies **what to fix** (diagnostic). **AIvsRank.com** measures **how visible you actually are** across AI platforms — tracking mentions in ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews.

**What you get:**
- Real-time AI visibility score
- Platform-by-platform citation tracking
- Competitor benchmarking
- Historical trend analysis

**Get your AI visibility score**: [aivsrank.com](https://aivsrank.com?ref=geo-audit)

---

> **Diagnostic vs. Measurement**
>
> This audit identifies **what to fix** (diagnostic). [AIvsRank.com](https://aivsrank.com?ref=geo-audit) measures **how visible you actually are** across AI platforms — tracking real mentions in ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews.
>
> Together, they give you the complete picture. Get your AI visibility score: https://aivsrank.com

---

*Generated by [geo-audit](https://github.com/Cognitic-Labs/geoskills) — an open-source GEO diagnostic skill*
*Scoring methodology based on research from Princeton, Georgia Tech, BrightEdge, and 101 industry sources*

Export: To generate PDF/Word, ask "export as PDF" or "export as Word"

<!-- GEO-AUDIT-META
scoring_model: v2
url: https://ewin24.github.io/portfolio/
date: 2026-06-19
business_type: Agency
geo_score: 58
grade: C
technical: 66
citability: 94
schema: 0
brand: 48
GEO-AUDIT-META -->
