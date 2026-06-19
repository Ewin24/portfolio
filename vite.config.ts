import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { caseStudies } from './src/content/case-studies'
import { workExperience } from './src/content/experience'
import { education } from './src/content/education'
import { blogPosts } from './src/blog/content/posts'
import { testimonials } from './src/content/testimonials'

/**
 * Pre-render plugin: generates comprehensive static HTML and additional
 * JSON-LD schemas (Article per post, FAQPage, HowTo, CreativeWork) from
 * the project content and injects them into the build output.
 *
 * This closes the CSR-only gap for non-JS crawlers (and any
 * crawlers that inspect the HTML source before executing JS).
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function generatePreloadedContent(): string {
  const lines: string[] = []

  // Hero
  lines.push(
    `<h1>Edwin Trigos — Software Architect &amp; Full Stack Developer</h1>`,
  )
  lines.push(
    `<p>Software Architect and Full Stack Developer with 5+ years building production systems in .NET, Clean Architecture, fintech, and cloud infrastructure. Based in Bucaramanga, Colombia. Remote-ready.</p>`,
  )

  // About
  lines.push(`<h2>About</h2>`)
  lines.push(
    `<p>I design and build production-grade systems end-to-end: from clean architecture foundations to cloud deployment. My current focus is on financial systems (loan origination, credit bureaus, risk management) and B2B SaaS platforms. I write detailed case studies documenting the real architecture decisions, metrics, and tradeoffs from systems I've shipped.</p>`,
  )

  // Case Studies — full STAR format
  lines.push(`<h2>Production Case Studies</h2>`)
  caseStudies.forEach((cs) => {
    lines.push(
      `<article>`,
      `<h3>${escapeHtml(cs.title)}</h3>`,
      `<p><strong>Company</strong>: ${escapeHtml(cs.company)}. <strong>Period</strong>: ${escapeHtml(cs.period)}. <strong>Stack</strong>: ${cs.stack.map(escapeHtml).join(', ')}.</p>`,
      `<p><strong>Problem</strong>: ${escapeHtml(cs.problem)}</p>`,
      `<p><strong>Solution</strong>: ${escapeHtml(cs.solution)}</p>`,
      `<p><strong>Impact</strong>: ${escapeHtml(cs.impact)}</p>`,
      `</article>`,
    )
  })

  // Blog Articles — full excerpts
  lines.push(`<h2>Technical Blog</h2>`)
  blogPosts.forEach((post) => {
    lines.push(
      `<article itemscope itemtype="https://schema.org/Article">`,
      `<h3 itemprop="headline">${escapeHtml(post.title)}</h3>`,
      `<p><time itemprop="datePublished" datetime="${escapeHtml(post.date)}">${escapeHtml(post.date)}</time>.${post.category ? ` <strong>Category</strong>: <span itemprop="articleSection">${escapeHtml(post.category)}</span>.` : ''} <strong>Tags</strong>: ${post.tags.map(escapeHtml).join(', ')}.</p>`,
      `<p itemprop="description">${escapeHtml(post.excerpt)}</p>`,
      `</article>`,
    )
  })

  // Skills (compute unique technologies)
  const allTechs = new Set<string>([
    ...workExperience.flatMap((j) => j.stack),
    ...caseStudies.flatMap((p) => p.stack),
  ])
  lines.push(`<h2>Technologies (${allTechs.size} production-grade)</h2>`)
  lines.push(`<p>${Array.from(allTechs).map(escapeHtml).join(' · ')}</p>`)

  // Work Experience
  lines.push(`<h2>Work Experience</h2>`)
  workExperience.forEach((job) => {
    lines.push(
      `<article>`,
      `<h3>${escapeHtml(job.role)} — ${escapeHtml(job.company)}</h3>`,
      `<p><strong>Period</strong>: ${escapeHtml(job.period)}. <strong>Location</strong>: ${escapeHtml(job.location)}.${job.current ? ' <strong>Current</strong>.' : ''}</p>`,
      `<ul>`,
      ...job.achievements.map((a) => `<li>${escapeHtml(a)}</li>`),
      `</ul>`,
      `<p><strong>Stack</strong>: ${job.stack.map(escapeHtml).join(', ')}</p>`,
      `</article>`,
    )
  })

  // Education
  lines.push(`<h2>Education</h2>`)
  education.forEach((ed) => {
    lines.push(
      `<article>`,
      `<h3>${escapeHtml(ed.degree)} — ${escapeHtml(ed.institution)}</h3>`,
      `<p><strong>Period</strong>: ${escapeHtml(ed.period)}</p>`,
      ed.description !== undefined ? `<p>${escapeHtml(ed.description)}</p>` : '',
      `</article>`,
    )
  })

  // Testimonials
  lines.push(`<h2>Testimonials</h2>`)
  testimonials.forEach((t) => {
    lines.push(
      `<article>`,
      `<blockquote>${escapeHtml(t.text)}</blockquote>`,
      `<p>— ${escapeHtml(t.name)}, ${escapeHtml(t.role)} at ${escapeHtml(t.company)}</p>`,
      `</article>`,
    )
  })

  // Contact
  lines.push(`<h2>Contact</h2>`)
  lines.push(
    `<ul>`,
    `<li>Email: <a href="mailto:edwintrigos24@gmail.com">edwintrigos24@gmail.com</a></li>`,
    `<li>GitHub: <a href="https://github.com/Ewin24">github.com/Ewin24</a></li>`,
    `<li>LinkedIn: <a href="https://www.linkedin.com/in/edwintrigosguevara">linkedin.com/in/edwintrigosguevara</a></li>`,
    `<li>Location: Bucaramanga, Colombia (Remote)</li>`,
    `</ul>`,
  )

  lines.push(
    `<p><em>To see the full interactive portfolio, please enable JavaScript. Visit <a href="https://ewin24.github.io/portfolio/">ewin24.github.io/portfolio/</a>.</em></p>`,
  )

  return lines.join('\n')
}

/**
 * Generate Article schema for each blog post.
 * One JSON-LD <script> block per article, batched as a single injection.
 */
function generateArticleSchemas(): string {
  const articles = blogPosts.map((post) => ({
    '@type': 'Article',
    '@id': `https://ewin24.github.io/portfolio/#article-${post.id}`,
    headline: post.title,
    description: post.excerpt,
    inLanguage: 'es',
    datePublished: `${post.date}T08:00:00-05:00`,
    dateModified: `${post.date}T08:00:00-05:00`,
    author: { '@id': 'https://ewin24.github.io/portfolio/#person' },
    publisher: { '@id': 'https://ewin24.github.io/portfolio/#person' },
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.readingTime * 200,
    mainEntityOfPage: `https://ewin24.github.io/portfolio/#/blog/article/${post.slug}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.blog-article h1', '.blog-article .excerpt', 'h1', 'h2'],
    },
  }))

  return `<script type="application/ld+json">
${JSON.stringify(articles, null, 2)}
</script>`
}

/**
 * Generate FAQPage schema with 6 Q&A pairs extracted from the
 * portfolio content (architecture decisions, fintech patterns, etc.).
 */
function generateFaqSchema(): string {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Qué es Clean Architecture y cómo se aplica en sistemas .NET?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Clean Architecture organiza el código en capas concéntricas con dependencias hacia adentro: Domain (entidades), Application (casos de uso), Infrastructure (persistencia, APIs externas), y Presentation (API, UI). En .NET se implementa con proyectos separados por capa, inyección de dependencias, y repositorios por dominio funcional — no por tabla. La regla clave: la capa de dominio no conoce nada externo. En el LOS de Fábricas de Crédito, esto se traduce en 114 endpoints en 6 capas BFF con cero duplicación de lógica entre canales.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuándo usar Dapper en lugar de Entity Framework Core?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Dapper es preferible cuando necesitás control total sobre el SQL, máximo rendimiento en consultas, o trabajás con stored procedures existentes. EF Core es mejor cuando necesitás change tracking, migraciones automáticas, y navegación de objetos. En sistemas financieros con queries complejas y procedimientos almacenados optimizados, Dapper ofrece mejor performance y menor overhead. En BAGUER: 200 stored procedures legacy, cero migraciones, cero N+1, cero sorpresas en producción — query times reducidas de 3s a 400ms con Dapper.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué es el patrón Strategy y cómo se usa en motores de decisión?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El patrón Strategy define una familia de algoritmos intercambiables. En motores de decisión, cada estrategia implementa una interfaz común (ej: IValidacionStrategy) con implementaciones concretas (BotValidacionStrategy, ManualValidacionStrategy). El motor resuelve la estrategia adecuada en runtime sin if/switch hardcodeados. Combinado con un catálogo en base de datos, permite modificar reglas de decisión sin tocar código. Implementado en SOVI: 10+ diagnósticos del bot con acciones configurables sin redeploy.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cómo manejar integraciones con APIs externas de forma resiliente en .NET?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tres patrones clave: (1) Polly para circuit breaker y retry policies con backoff exponencial; (2) Interfaz provider-agnostic (ej: IEmailProvider) para poder cambiar de proveedor sin modificar sistemas consumidores; (3) Logging estructurado con Serilog con tres pipelines separados: consola para runtime, archivo general para errores, archivo dedicado para trazabilidad de transacciones (Request/Response/Template). En la API de comunicaciones: cambio de Sendinblue a Infobip en horas, no días, gracias al desacople por interfaz.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué es un sistema BFF (Backend for Frontend) y cuándo usarlo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'BFF es un patrón donde cada canal de consumo (web, mobile, admin, tienda física) tiene su propia capa de API adaptada a sus necesidades específicas, pero todos comparten los mismos servicios de dominio. En el LOS implementado: 6 capas BFF (Admin, Core, Tienda, Web, Handoff, Util) inyectan los mismos servicios de dominio (EstudioService, TerceroService, OtpService, BiometriaService) — cero duplicación de lógica entre canales, solo cambia la forma del request. Cuando se agrega un nuevo canal, solo se crean controladores nuevos sin tocar servicios.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cómo diseñar una base de datos para un sistema de originación de crédito?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tres reglas: (1) Organizar en esquemas lógicos por responsabilidad: cfg (configuración), cat (catálogos), fab (fábrica/producción), aud (auditoría); (2) Usar stored procedures para operaciones transaccionales complejas — son el contrato entre la app y la BD; (3) Auditoría INSERT-ONLY — nunca updates ni deletes en tablas de auditoría, cada cambio es un nuevo registro. En el LOS QUAC: 4 esquemas, 30+ tablas, 27 stored procedures, 23 estados de ciclo de vida, trazabilidad completa desde solicitud hasta desembolso.',
        },
      },
    ],
  }

  return `<script type="application/ld+json">
${JSON.stringify(faq, null, 2)}
</script>`
}

/**
 * Generate HowTo schema for the most tutorial-like blog post
 * (the Clean Architecture one — highest impact for AI search).
 */
function generateHowToSchema(): string {
  const howto = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Cómo diseñar Clean Architecture en un sistema .NET con 6 capas BFF',
    description:
      'Paso a paso para organizar código .NET en capas con propósito único: repositorios por esquema, servicios por dominio, controladores por canal.',
    totalTime: 'PT2H',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0',
    },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Organizar la base de datos en esquemas lógicos',
        text: 'Dividir la BD en cfg (config), cat (catálogos), fab (factory/producción), aud (auditoría). Cada esquema tiene un propósito claro y una responsabilidad única.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Crear un repositorio por esquema, no por tabla',
        text: 'Anti-patrón: un repositorio por tabla. Patrón correcto: ICfgRepository, ICatRepository, IFabRepository, IAudRepository. La regla mental: si la tabla está en fab.EstudiosCredito, va en IFabRepository. No hay ambigüedad.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Definir servicios por dominio funcional',
        text: 'No usar una carpeta genérica Services/. En su lugar: EstudioService (apertura, riesgo, aprobación), TerceroService (datos del cliente), OtpService (validación), BiometriaService (verificación facial). Cada servicio contiene toda la lógica de su dominio.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Crear controladores por canal de consumo',
        text: 'Cada canal (Tienda BFF, Web, Handoff, Admin) tiene sus propios controladores, pero TODOS inyectan los mismos servicios de dominio. La diferencia está en la forma del request, no en la lógica de negocio.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Verificar con un test de canal nuevo',
        text: 'Cuando se requiera agregar un nuevo canal (ej: mobile), crear los controladores nuevos e inyectar los mismos servicios existentes. Resultado: cero cambios en servicios o repositorios. Si no se cumple esto, volver al paso 2.',
      },
    ],
  }

  return `<script type="application/ld+json">
${JSON.stringify(howto, null, 2)}
</script>`
}

/**
 * Generate CreativeWork schemas for case studies.
 */
function generateCaseStudySchemas(): string {
  const works = caseStudies.map((cs) => ({
    '@type': 'CreativeWork',
    '@id': `https://ewin24.github.io/portfolio/#case-${cs.id}`,
    name: cs.title,
    description: cs.impact,
    inLanguage: 'es',
    dateCreated: cs.period.split('–')[0].trim(),
    author: { '@id': 'https://ewin24.github.io/portfolio/#person' },
    keywords: cs.tags.join(', '),
    about: {
      '@type': 'Thing',
      name: cs.industry,
    },
    creativeWorkStatus: 'Published',
  }))

  return `<script type="application/ld+json">
${JSON.stringify(works, null, 2)}
</script>`
}

/**
 * Generate ProfilePage + WebPage + ItemList wrappers for the homepage.
 * These give AI engines a clearer understanding of the page type and structure.
 */
function generatePageWrapperSchemas(): string {
  const profilePage = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': 'https://ewin24.github.io/portfolio/#profilepage',
    url: 'https://ewin24.github.io/portfolio/',
    name: 'Edwin Trigos — Software Architect & Full Stack Developer',
    description:
      'Personal portfolio featuring production case studies, technical blog, and professional experience.',
    inLanguage: ['en', 'es'],
    mainEntity: { '@id': 'https://ewin24.github.io/portfolio/#person' },
    about: { '@id': 'https://ewin24.github.io/portfolio/#person' },
    isPartOf: { '@id': 'https://ewin24.github.io/portfolio/#website' },
    dateModified: '2026-06-19',
  }

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://ewin24.github.io/portfolio/#webpage',
    url: 'https://ewin24.github.io/portfolio/',
    name: 'Edwin Trigos | Software Architect & Full Stack Developer',
    description:
      'Software Architect and Full Stack Developer specializing in .NET, Clean Architecture, and financial systems.',
    inLanguage: ['en', 'es'],
    isPartOf: { '@id': 'https://ewin24.github.io/portfolio/#website' },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://avatars.githubusercontent.com/Ewin24',
    },
    dateModified: '2026-06-19',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.hero h1', 'article h3'],
    },
  }

  const caseStudyList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Production Case Studies',
    description: 'Real systems shipped to production by Edwin Trigos.',
    numberOfItems: caseStudies.length,
    itemListElement: caseStudies.map((cs, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: cs.title,
      url: `https://ewin24.github.io/portfolio/#projects`,
      description: cs.impact,
    })),
  }

  const blogList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Technical Blog',
    description:
      'Bilingual technical blog on architecture decisions, design patterns, and production tradeoffs.',
    numberOfItems: blogPosts.length,
    itemListElement: blogPosts.map((post, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: post.title,
      url: `https://ewin24.github.io/portfolio/#/blog/article/${post.slug}`,
      description: post.excerpt,
    })),
  }

  return [
    `<script type="application/ld+json">\n${JSON.stringify(profilePage, null, 2)}\n</script>`,
    `<script type="application/ld+json">\n${JSON.stringify(webPage, null, 2)}\n</script>`,
    `<script type="application/ld+json">\n${JSON.stringify(caseStudyList, null, 2)}\n</script>`,
    `<script type="application/ld+json">\n${JSON.stringify(blogList, null, 2)}\n</script>`,
  ].join('\n')
}

/**
 * Vite plugin: injects pre-rendered content + additional JSON-LD schemas.
 * - Replaces the <noscript> block with full static content
 * - Adds Article, FAQPage, HowTo, CreativeWork, ProfilePage, WebPage,
 *   ItemList, BreadcrumbList schemas to the <head>
 */
function preloadStaticContent(): import('vite').Plugin {
  return {
    name: 'preload-static-content',
    transformIndexHtml(html) {
      const content = generatePreloadedContent()
      const articleSchemas = generateArticleSchemas()
      const faqSchema = generateFaqSchema()
      const howtoSchema = generateHowToSchema()
      const caseStudySchemas = generateCaseStudySchemas()
      const pageWrappers = generatePageWrapperSchemas()

      const additionalSchemas =
        articleSchemas +
        '\n' +
        faqSchema +
        '\n' +
        howtoSchema +
        '\n' +
        caseStudySchemas +
        '\n' +
        pageWrappers

      // Replace the noscript content
      let result = html.replace(
        /<noscript>[\s\S]*?<\/noscript>/,
        `<noscript>\n<div style="max-width:900px;margin:0 auto;padding:2rem;font-family:system-ui,sans-serif;line-height:1.6;color:#1a1a1a;">\n${content}\n</div>\n</noscript>`,
      )

      // Inject additional schemas before </head>
      result = result.replace('</head>', `${additionalSchemas}\n</head>`)

      return result
    },
  }
}

export default defineConfig({
  base: '/portfolio/',
  plugins: [react(), tailwindcss(), preloadStaticContent()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
