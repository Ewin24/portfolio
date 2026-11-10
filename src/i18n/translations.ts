import type { Language } from '../types'

export type TranslationKeys = {
  // Nav
  'nav.about': string
  'nav.projects': string
  'nav.skills': string
  'nav.experience': string
  'nav.education': string
  'nav.blog': string
  'nav.contact': string
  // Hero
  'hero.greeting': string
  'hero.role': string
  'hero.subtitle': string
  'hero.cta.projects': string
  'hero.cta.contact': string
  'hero.cta.cv': string
  'hero.availability': string
  'hero.stats.yearsExp': string
  'hero.stats.systems': string
  'hero.stats.stack': string
  // Projects
  'projects.title': string
  'projects.subtitle': string
  'projects.featured': string
  'projects.github': string
  'projects.viewAll': string
  'projects.viewRepo': string
  'projects.viewDemo': string
  'projects.nda': string
  'projects.problem': string
  'projects.solution': string
  'projects.impact': string
  'projects.architecture': string
  'projects.stack': string
  'projects.readMore': string
  'experience.more': string
  'about.quote': string
  // Skills
  'skills.title': string
  'skills.subtitle': string
  'skills.languages': string
  'skills.frameworks': string
  'skills.tools': string
  'skills.activity': string
  'skills.heading': string
  'skills.milestones': string
  'skills.detail': string
  // Tech milestones (content — translatable)
  'skills.dotnet.milestone1': string
  'skills.dotnet.milestone2': string
  'skills.dotnet.milestone3': string
  'skills.dotnet.reference': string
  'skills.php.milestone1': string
  'skills.php.milestone2': string
  'skills.php.milestone3': string
  'skills.php.reference': string
  'skills.sqlserver.milestone1': string
  'skills.sqlserver.milestone2': string
  'skills.sqlserver.milestone3': string
  'skills.sqlserver.reference': string
  'skills.react.milestone1': string
  'skills.react.milestone2': string
  'skills.react.milestone3': string
  'skills.react.reference': string
  'skills.typescript.milestone1': string
  'skills.typescript.milestone2': string
  'skills.typescript.milestone3': string
  'skills.typescript.reference': string
  'skills.aws.milestone1': string
  'skills.aws.milestone2': string
  'skills.aws.milestone3': string
  'skills.aws.reference': string
  'skills.flutter.milestone1': string
  'skills.flutter.milestone2': string
  'skills.flutter.milestone3': string
  'skills.flutter.reference': string
  'skills.cleanarch.milestone1': string
  'skills.cleanarch.milestone2': string
  'skills.cleanarch.milestone3': string
  'skills.cleanarch.reference': string
  'skills.docker.milestone1': string
  'skills.docker.milestone2': string
  'skills.docker.milestone3': string
  'skills.docker.reference': string
  'skills.ai.milestone1': string
  'skills.ai.milestone2': string
  'skills.ai.milestone3': string
  'skills.ai.reference': string
  'skills.cfworkers.milestone1': string
  'skills.cfworkers.milestone2': string
  'skills.cfworkers.milestone3': string
  'skills.cfworkers.reference': string
  'skills.indexeddb.milestone1': string
  'skills.indexeddb.milestone2': string
  'skills.indexeddb.milestone3': string
  'skills.indexeddb.reference': string
  'skills.playwright.milestone1': string
  'skills.playwright.milestone2': string
  'skills.playwright.milestone3': string
  'skills.playwright.reference': string
  'skills.vitest.milestone1': string
  'skills.vitest.milestone2': string
  'skills.vitest.milestone3': string
  'skills.vitest.reference': string
  'skills.geo.milestone1': string
  'skills.geo.milestone2': string
  'skills.geo.milestone3': string
  'skills.geo.reference': string
  // About
  'about.title': string
  'about.subtitle': string
  'about.description': string
  // Education
  'education.title': string
  'education.subtitle': string
  // Experience
  'experience.title': string
  'experience.subtitle': string
  'experience.stamp': string
  'experience.achievements': string
  'experience.employment.full-time': string
  'experience.employment.contract': string
  'experience.employment.open-source': string
  'experience.employment.bootcamp': string
  // Blog
  'blog.title': string
  'blog.subtitle': string
  'blog.empty': string
  'blog.filterAll': string
  'blog.filterByTag': string
  'blog.search': string
  'blog.noResults': string
  'blog.recommendations': string
  'blog.loadMore': string
  'blog.showAll': string
  'blog.backToList': string
  'blog.prevArticle': string
  'blog.nextArticle': string
  'blog.articles': string
  'blog.reading': string
  // Contact
  'contact.title': string
  'contact.subtitle': string
  'contact.github': string
  'contact.email': string
  'contact.linkedin': string
  'contact.location': string
  'contact.cta': string
  // Footer
  'footer.built': string
  'footer.activity': string
  // XP Help window (Slice 3)
  'window.help': string
  'help.shortcutsTitle': string
  'help.drag': string
  'help.dragDesc': string
  'help.resize': string
  'help.resizeDesc': string
  'help.shiftArrow': string
  'help.shiftArrowDesc': string
  'help.enter': string
  'help.enterDesc': string
  'help.esc': string
  'help.escDesc': string
  'help.return': string
  'startmenu.programs': string
  'startmenu.myComputer': string
}

const translations: Record<Language, TranslationKeys> = {
  es: {
    // Nav
    'nav.about': 'Sobre mí',
    'nav.projects': 'Casos de Estudio',
    'nav.skills': 'Stack',
    'nav.experience': 'Experiencia',
    'nav.education': 'Formación',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',

    // Hero — Copy Senior, vende ingeniería no código
    'hero.greeting': 'Edición digital · Colombia',
    'hero.role': 'Líder Técnico · Desarrollador .NET',
    'hero.subtitle':
      'Dirijo el desarrollo del área de crédito de una fintech colombiana: originación de crédito, cálculo de cupos y riesgo crediticio, validación de identidad e integración con burós. .NET 8/10 con Clean Architecture, SQL Server con Dapper y stored procedures, APIs resilientes y entrega con TDD y revisión adversarial asistida por agentes de IA.',
    'hero.cta.projects': 'Ver Casos de Estudio',
    'hero.cta.contact': 'Hablemos',
    'hero.cta.cv': 'Descargar CV',
    'hero.availability': 'Abierto a roles remotos · Colombia (UTC−5) · Inglés B1',

    // Stats con valor real
    'hero.stats.yearsExp': 'Años de experiencia',
    'hero.stats.systems': 'Casos de estudio documentados',
    'hero.stats.stack': 'Pruebas en la API que lidero',

    // Projects
    'projects.title': 'Casos de Estudio',
    'projects.subtitle':
      'Problemas de negocio reales que he resuelto. Cada proyecto describe el contexto, la arquitectura y el impacto medible.',
    'projects.featured': 'Destacado',
    'projects.github': 'Actividad en GitHub',
    'projects.viewAll': 'Ver actividad completa',
    'projects.viewRepo': 'Ver código',
    'projects.viewDemo': 'Ver demo',
    'projects.nda': 'Código confidencial · Arquitectura de mi autoría',
    'projects.problem': 'El Problema',
    'projects.solution': 'La Solución',
    'projects.impact': 'Impacto',
    'projects.architecture': 'Arquitectura',
    'projects.stack': 'Stack',
    'projects.readMore': 'Leer el caso completo',

    // Skills
    'skills.title': 'Stack Tecnológico',
    'skills.subtitle': 'Tecnologías con las que construyo sistemas en producción',
    'skills.languages': 'Lenguajes',
    'skills.frameworks': 'Frameworks & Librerías',
    'skills.tools': 'Infraestructura & Herramientas',
    'skills.activity': 'Uso por repositorios públicos',
    'skills.heading': 'Logros Clave',
    'skills.milestones': 'Hitos',
    'skills.detail': 'Detalle técnico',
    'skills.dotnet.milestone1': 'Clean Architecture en sistemas de producción',
    'skills.dotnet.milestone2': 'Migración de .NET Framework a .NET Core',
    'skills.dotnet.milestone3': 'Pruebas de integración por la tubería de autorización real (TestServer)',
    'skills.dotnet.reference': 'Ver artículo: Clean Architecture en LOS',
    'skills.sqlserver.milestone1': 'DDL con 4 esquemas lógicos y 30+ tablas',
    'skills.sqlserver.milestone2': 'Optimización de consultas: 3s → 400ms',
    'skills.sqlserver.milestone3': 'Stored procedures y máquina de estados',
    'skills.sqlserver.reference': 'Ver artículo: Dapper sin Entity Framework',
    'skills.react.milestone1': 'Arquitectura de componentes con TypeScript',
    'skills.react.milestone2': 'Integración con APIs REST empresariales',
    'skills.react.milestone3': 'Tailwind CSS v4 + Design Systems',
    'skills.react.reference': 'Ver Casos de Estudio',
    'skills.typescript.milestone1': 'Tipado estricto en frontend de producción',
    'skills.typescript.milestone2': 'Type-safe APIs y contratos de datos',
    'skills.typescript.milestone3': 'Tooling moderno con Vite + React 19',
    'skills.typescript.reference': 'Ver Casos de Estudio',
    'skills.cleanarch.milestone1': 'Separación en capas con repositorios por esquema',
    'skills.cleanarch.milestone2': '6 BFF sin duplicación de lógica entre canales',
    'skills.cleanarch.milestone3': 'Inyección de dependencias + Strategy Pattern',
    'skills.cleanarch.reference': 'Ver artículo: Orquestación sin acoplamiento',
    'skills.docker.milestone1': 'Contenerización de APIs .NET',
    'skills.docker.milestone2': 'CI/CD con GitHub Actions',
    'skills.docker.milestone3': 'Despliegue en entornos productivos',
    'skills.docker.reference': 'Ver Casos de Estudio',
    'skills.ai.milestone1': 'Agente LLM con tool calling por permisos, streaming SSE y presupuesto de tokens por organización',
    'skills.ai.milestone2': 'Acciones de IA con aprobación humana: la confirmación es una transacción idempotente, no un botón',
    'skills.ai.milestone3': 'Entrega con agentes de IA: specs, verificadores independientes y PRs de menos de 400 líneas',
    'skills.ai.reference': 'Ver Casos de Estudio',
    'skills.cfworkers.milestone1': 'Relay de feeds en el borde con CORS y GET condicional',
    'skills.cfworkers.milestone2': 'Guarda SSRF reaplicada en cada salto de redirección',
    'skills.cfworkers.milestone3': 'Despliegue automatizado con GitHub Actions',
    'skills.cfworkers.reference': 'Ver Casos de Estudio',
    'skills.indexeddb.milestone1': 'Capa de datos offline para un lector RSS',
    'skills.indexeddb.milestone2': 'Marcas de tiempo por campo para leído y destacado',
    'skills.indexeddb.milestone3': 'Importación y exportación OPML',
    'skills.indexeddb.reference': 'Ver Casos de Estudio',
    'skills.playwright.milestone1': 'Drivers versionados que ejercitan la UI real',
    'skills.playwright.milestone2': 'Regresión visual contra líneas base con 0 píxeles de diferencia',
    'skills.playwright.milestone3': '98 verificaciones de comportamiento sobre el escritorio XP',
    'skills.playwright.reference': 'Ver Casos de Estudio',
    'skills.vitest.milestone1': '787 pruebas bajo una puerta de cobertura exigida del 70%',
    'skills.vitest.milestone2': 'Pruebas de extremo a extremo contra el almacén real',
    'skills.vitest.milestone3': 'Cobertura exigida en CI antes del despliegue',
    'skills.vitest.reference': 'Ver Casos de Estudio',
    'skills.geo.milestone1': 'JSON-LD: Person, WebSite, Article, CreativeWork, ItemList, FAQPage, HowTo, BreadcrumbList y Service',
    'skills.geo.milestone2': 'llms.txt y llms-full.txt para rastreadores de IA, con robots.txt y sitemap',
    'skills.geo.milestone3': 'Auditoría GEO automatizada de 58 a 83/100, 14 de 14 hallazgos resueltos',
    'skills.geo.reference': 'Ver Casos de Estudio',
    'skills.php.milestone1': 'Laravel con workers asíncronos y jobs',
    'skills.php.milestone2': 'SaaS B2B completo para sector solidario',
    'skills.php.milestone3': 'Procesamiento de archivos financieros en segundo plano',
    'skills.php.reference': 'Ver Casos de Estudio',
    'skills.aws.milestone1': 'Infraestructura cloud con alta disponibilidad',
    'skills.aws.milestone2': 'CI/CD en entornos multi-ambiente',
    'skills.aws.milestone3': 'Entornos de producción y staging',
    'skills.aws.reference': 'Ver Casos de Estudio',
    'skills.flutter.milestone1': 'Aplicación cliente con sincronización offline',
    'skills.flutter.milestone2': 'Conexión con API REST empresarial',
    'skills.flutter.milestone3': 'UI nativa multiplataforma',
    'skills.flutter.reference': 'Ver Casos de Estudio',

    // About
    'about.title': 'Sobre mí',
    'about.subtitle': 'Líder técnico · .NET, SQL Server y entrega verificable',
    'about.quote': 'Prefiero un sistema que falla en voz alta a uno que aprueba en silencio.',
    'about.description':
      'Lidero el área de crédito de una fintech colombiana de crédito de consumo: diseñé y construí su sistema de originación desde la base de datos hasta la API, y llevé esa API de 8 archivos de prueba a 3.009 pruebas automatizadas en unas diez semanas. En paralelo trabajo por contrato en una plataforma SaaS de gestión de riesgos para el sector solidario, y sigo desarrollando DevManager, el producto que nació como mi proyecto de grado. Trabajo con .NET y SQL Server, entrego en cambios pequeños y revisables, y trato cada cifra que publico como algo que otra persona debe poder comprobar.',

    // Education
    'education.title': 'Formación',
    'education.subtitle': 'Académica y bootcamps',

    // Experience
    'experience.title': 'Trayectoria',
    'experience.subtitle': 'Experiencia profesional con impacto medible',
    'experience.stamp': 'En curso',
    'experience.achievements': 'Logros clave',
    'experience.more': 'logros más',
    'experience.employment.full-time': 'Tiempo completo',
    'experience.employment.contract': 'Contrato',
    'experience.employment.open-source': 'Open source',
    'experience.employment.bootcamp': 'Bootcamp',

    // Blog
    'blog.title': 'Blog Técnico',
    'blog.subtitle': 'Arquitectura, patrones y decisiones de ingeniería explicadas',
    'blog.empty': 'Próximamente — escribiendo el primer artículo',
    'blog.filterAll': 'Todos los artículos',
    'blog.filterByTag': 'Filtrar por tema',
    'blog.search': 'Buscar...',
    'blog.noResults': 'Sin resultados',
    'blog.recommendations': 'Artículos relacionados',
    'blog.loadMore': 'Cargar más',
    'blog.showAll': 'Mostrar todo',
    'blog.backToList': 'Volver a artículos',
    'blog.prevArticle': 'Anterior',
    'blog.nextArticle': 'Siguiente',
    'blog.articles': 'Artículos',
    'blog.reading': 'Lectura',


    // Contact
    'contact.title': 'Contacto',
    'contact.subtitle': '¿Tienes un reto técnico que resolver?',
    'contact.github': 'Perfil en GitHub',
    'contact.email': 'Enviar correo',
    'contact.linkedin': 'Conectar en LinkedIn',
    'contact.location': 'Colombia (Remoto — Disponible para viajar)',
    'contact.cta': 'Construyamos algo que importe',

    // Footer
    'footer.built': 'Construido con',
    'footer.activity': 'Actividad técnica vía GitHub API',

    // XP Help window (Slice 3)
    'window.help': 'Ayuda',
    'help.shortcutsTitle': 'Atajos de teclado',
    'help.drag': 'Arrastrar',
    'help.dragDesc': 'Mantén la barra de título y arrastra para mover la ventana',
    'help.resize': 'Redimensionar',
    'help.resizeDesc': 'Arrastra cualquiera de los 8 bordes o esquinas',
    'help.shiftArrow': 'Mayús + Flechas',
    'help.shiftArrowDesc': 'Redimensionar ±8px con el teclado',
    'help.enter': 'Enter',
    'help.enterDesc': 'Enfocar o restaurar la ventana',
    'help.esc': 'Esc',
    'help.escDesc': 'Cerrar la ventana activa',
    'help.return': 'Volver al periódico',
    'startmenu.programs': 'Programas',
    'startmenu.myComputer': 'Mi PC',
  },

  en: {
    // Nav
    'nav.about': 'About',
    'nav.projects': 'Case Studies',
    'nav.skills': 'Stack',
    'nav.experience': 'Experience',
    'nav.education': 'Education',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',

    // Hero
    'hero.greeting': 'Digital edition · Colombia',
    'hero.role': 'Tech Lead · .NET Developer',
    'hero.subtitle':
      'I lead development of the credit area at a Colombian fintech: loan origination, credit-limit and credit-risk calculation, identity verification, and credit-bureau integrations. .NET 8/10 with Clean Architecture, SQL Server with Dapper and stored procedures, resilient APIs, and delivery through TDD and adversarial review assisted by AI agents.',
    'hero.cta.projects': 'View Case Studies',
    'hero.cta.contact': "Let's Talk",
    'hero.cta.cv': 'Download CV',
    'hero.availability': 'Open to remote roles · Colombia (UTC−5) · English B1',

    // Stats
    'hero.stats.yearsExp': 'Years of experience',
    'hero.stats.systems': 'Documented case studies',
    'hero.stats.stack': 'Tests on the API I lead',

    // Projects
    'projects.title': 'Case Studies',
    'projects.subtitle':
      'Real business problems I have solved. Each project describes the context, architecture, and measurable impact.',
    'projects.featured': 'Featured',
    'projects.github': 'GitHub Activity',
    'projects.viewAll': 'View full activity',
    'projects.viewRepo': 'View code',
    'projects.viewDemo': 'View demo',
    'projects.nda': 'Confidential code · Architecture of my own design',
    'projects.problem': 'The Problem',
    'projects.solution': 'The Solution',
    'projects.impact': 'Impact',
    'projects.architecture': 'Architecture',
    'projects.stack': 'Stack',
    'projects.readMore': 'Read the full case',

    // Skills
    'skills.title': 'Tech Stack',
    'skills.subtitle': 'Technologies I use to build production systems',
    'skills.languages': 'Languages',
    'skills.frameworks': 'Frameworks & Libraries',
    'skills.tools': 'Infrastructure & Tools',
    'skills.activity': 'Usage by public repositories',
    'skills.heading': 'Key Achievements',
    'skills.milestones': 'Milestones',
    'skills.detail': 'Technical Detail',
    'skills.dotnet.milestone1': 'Clean Architecture in production systems',
    'skills.dotnet.milestone2': 'Migration from .NET Framework to .NET Core',
    'skills.dotnet.milestone3': 'Integration tests through the real authorization pipeline (TestServer)',
    'skills.dotnet.reference': 'Read: Clean Architecture in LOS',
    'skills.sqlserver.milestone1': 'DDL with 4 logical schemas and 30+ tables',
    'skills.sqlserver.milestone2': 'Query optimization: 3s → 400ms',
    'skills.sqlserver.milestone3': 'Stored procedures and state machine',
    'skills.sqlserver.reference': 'Read: Dapper without EF Core',
    'skills.react.milestone1': 'Component architecture with TypeScript',
    'skills.react.milestone2': 'Enterprise REST API integration',
    'skills.react.milestone3': 'Tailwind CSS v4 + Design Systems',
    'skills.react.reference': 'View Case Studies',
    'skills.typescript.milestone1': 'Strict typing in production frontends',
    'skills.typescript.milestone2': 'Type-safe APIs and data contracts',
    'skills.typescript.milestone3': 'Modern tooling with Vite + React 19',
    'skills.typescript.reference': 'View Case Studies',
    'skills.cleanarch.milestone1': 'Layer separation with per-schema repositories',
    'skills.cleanarch.milestone2': '6 BFF layers without logic duplication',
    'skills.cleanarch.milestone3': 'Dependency injection + Strategy Pattern',
    'skills.cleanarch.reference': 'Read: Cross-system orchestration',
    'skills.docker.milestone1': 'Containerization of .NET APIs',
    'skills.docker.milestone2': 'CI/CD with GitHub Actions',
    'skills.docker.milestone3': 'Production environment deployment',
    'skills.docker.reference': 'View Case Studies',
    'skills.ai.milestone1': 'LLM agent with permission-aware tool calling, SSE streaming, and per-organization token budgets',
    'skills.ai.milestone2': 'Human-in-the-loop AI actions: confirmation is an idempotent transaction, not a button',
    'skills.ai.milestone3': 'Delivery with AI agents: specs, independent verifiers, and PRs under 400 lines',
    'skills.ai.reference': 'View Case Studies',
    'skills.cfworkers.milestone1': 'Edge feed relay with CORS and conditional GET',
    'skills.cfworkers.milestone2': 'SSRF guard re-applied on every redirect hop',
    'skills.cfworkers.milestone3': 'Automated deployment via GitHub Actions',
    'skills.cfworkers.reference': 'View Case Studies',
    'skills.indexeddb.milestone1': 'Offline data layer for an RSS reader',
    'skills.indexeddb.milestone2': 'Per-field change timestamps for read and starred state',
    'skills.indexeddb.milestone3': 'OPML import and export',
    'skills.indexeddb.reference': 'View Case Studies',
    'skills.playwright.milestone1': 'Committed drivers that exercise the real UI',
    'skills.playwright.milestone2': 'Visual regression against committed baselines at 0 differing pixels',
    'skills.playwright.milestone3': '98 behavior checks over the XP desktop',
    'skills.playwright.reference': 'View Case Studies',
    'skills.vitest.milestone1': '787 tests under an enforced 70% coverage gate',
    'skills.vitest.milestone2': 'End-to-end tests against the real store',
    'skills.vitest.milestone3': 'Coverage enforced in CI before deployment',
    'skills.vitest.reference': 'View Case Studies',
    'skills.geo.milestone1': 'JSON-LD: Person, WebSite, Article, CreativeWork, ItemList, FAQPage, HowTo, BreadcrumbList and Service',
    'skills.geo.milestone2': 'llms.txt and llms-full.txt for AI crawlers, plus robots.txt and a sitemap',
    'skills.geo.milestone3': 'Automated GEO audit from 58 to 83/100, 14 of 14 issues resolved',
    'skills.geo.reference': 'View Case Studies',
    'skills.php.milestone1': 'Laravel with async workers and jobs',
    'skills.php.milestone2': 'Complete B2B SaaS for solidarity sector',
    'skills.php.milestone3': 'Background processing of financial files',
    'skills.php.reference': 'View Case Studies',
    'skills.aws.milestone1': 'Cloud infrastructure with high availability',
    'skills.aws.milestone2': 'CI/CD across multi-environment setups',
    'skills.aws.milestone3': 'Production and staging environments',
    'skills.aws.reference': 'View Case Studies',
    'skills.flutter.milestone1': 'Client app with offline sync',
    'skills.flutter.milestone2': 'Enterprise REST API integration',
    'skills.flutter.milestone3': 'Native cross-platform UI',
    'skills.flutter.reference': 'View Case Studies',

    // About
    'about.title': 'About',
    'about.subtitle': 'Tech lead · .NET, SQL Server and verifiable delivery',
    'about.quote': 'I would rather have a system that fails out loud than one that approves in silence.',
    'about.description':
      'I lead the credit area of a Colombian consumer-credit fintech: I designed and built its loan origination system from the database up to the API, and took that API from 8 test files to 3,009 automated tests in about ten weeks. Alongside it I work on contract on a SaaS risk-management platform for the cooperative sector, and I keep building DevManager, the product that started as my degree project. I work with .NET and SQL Server, ship in small reviewable changes, and treat every figure I publish as something another person should be able to check.',

    // Education
    'education.title': 'Education',
    'education.subtitle': 'Academic background & bootcamps',

    // Experience
    'experience.title': 'Experience',
    'experience.subtitle': 'Professional track record with measurable impact',
    'experience.stamp': 'Current',
    'experience.achievements': 'Key achievements',
    'experience.more': 'more achievements',
    'experience.employment.full-time': 'Full-time',
    'experience.employment.contract': 'Contract',
    'experience.employment.open-source': 'Open source',
    'experience.employment.bootcamp': 'Bootcamp',

    // Blog
    'blog.title': 'Technical Blog',
    'blog.subtitle': 'Architecture, patterns, and engineering decisions explained',
    'blog.empty': 'Coming soon — writing the first article',
    'blog.filterAll': 'All articles',
    'blog.filterByTag': 'Filter by tag',
    'blog.search': 'Search...',
    'blog.noResults': 'No results',
    'blog.recommendations': 'Related posts',
    'blog.loadMore': 'Load more',
    'blog.showAll': 'Show all',
    'blog.backToList': 'Back to articles',
    'blog.prevArticle': 'Previous',
    'blog.nextArticle': 'Next',
    'blog.articles': 'Articles',
    'blog.reading': 'Reading',


    // Contact
    'contact.title': 'Contact',
    'contact.subtitle': 'Have a technical challenge to solve?',
    'contact.github': 'View GitHub profile',
    'contact.email': 'Send email',
    'contact.linkedin': 'Connect on LinkedIn',
    'contact.location': 'Colombia (Remote — Available for travel)',
    'contact.cta': "Let's build something that matters",

    // Footer
    'footer.built': 'Built with',
    'footer.activity': 'Technical activity via GitHub API',

    // XP Help window (Slice 3)
    'window.help': 'Help',
    'help.shortcutsTitle': 'Keyboard shortcuts',
    'help.drag': 'Drag',
    'help.dragDesc': 'Hold the title bar and drag to move the window',
    'help.resize': 'Resize',
    'help.resizeDesc': 'Drag any of the 8 edges or corners',
    'help.shiftArrow': 'Shift + Arrows',
    'help.shiftArrowDesc': 'Resize by ±8px with the keyboard',
    'help.enter': 'Enter',
    'help.enterDesc': 'Focus or restore the window',
    'help.esc': 'Esc',
    'help.escDesc': 'Close the active window',
    'help.return': 'Return to newspaper',
    'startmenu.programs': 'Programs',
    'startmenu.myComputer': 'My Computer',
  },
}

export function t(key: keyof TranslationKeys, lang: Language): string {
  return translations[lang][key]
}
