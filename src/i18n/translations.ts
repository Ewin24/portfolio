import type { Language } from '../types'

type TranslationKeys = {
  // Nav
  'nav.about': string
  'nav.projects': string
  'nav.skills': string
  'nav.experience': string
  'nav.testimonials': string
  'nav.blog': string
  'nav.contact': string
  // Hero
  'hero.greeting': string
  'hero.role': string
  'hero.subtitle': string
  'hero.cta.projects': string
  'hero.cta.contact': string
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
  // About
  'about.title': string
  'about.subtitle': string
  'about.description': string
  // Experience
  'experience.title': string
  'experience.subtitle': string
  'experience.current': string
  'experience.achievements': string
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
  // Testimonials
  'testimonials.title': string
  'testimonials.subtitle': string
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
}

const translations: Record<Language, TranslationKeys> = {
  es: {
    // Nav
    'nav.about': 'Sobre mí',
    'nav.projects': 'Casos de Estudio',
    'nav.skills': 'Stack',
    'nav.experience': 'Experiencia',
    'nav.testimonials': 'Referencias',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',

    // Hero — Copy Senior, vende ingeniería no código
    'hero.greeting': 'Soluciones de',
    'hero.role': 'Ingeniería de Software',
    'hero.subtitle':
      'Diseño y construyo sistemas que resuelven problemas reales de negocio. Especializado en arquitecturas escalables, APIs de alto rendimiento e interfaces que los usuarios realmente disfrutan usar.',
    'hero.cta.projects': 'Ver Casos de Estudio',
    'hero.cta.contact': 'Hablemos',

    // Stats con valor real
    'hero.stats.yearsExp': 'Años de experiencia',
    'hero.stats.systems': 'Sistemas en producción',
    'hero.stats.stack': 'Tecnologías dominadas',

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
    'skills.dotnet.milestone3': 'APIs REST con patrones de resiliencia',
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
    'about.subtitle': 'Ingeniero de Software Full Stack',
    'about.description':
      'Construyo sistemas que escalan. Con años de experiencia en proyectos empresariales reales, me especializo en diseñar arquitecturas que resuelven cuellos de botella, integrar sistemas complejos y liderar la transición de soluciones legacy a tecnología moderna. Me importa el impacto de negocio, no solo el código.',

    // Experience
    'experience.title': 'Trayectoria',
    'experience.subtitle': 'Experiencia profesional con impacto medible',
    'experience.current': 'Actual',
    'experience.achievements': 'Logros clave',

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

    // Testimonials
    'testimonials.title': 'Referencias',
    'testimonials.subtitle': 'Lo que dicen quienes han trabajado conmigo',

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
  },

  en: {
    // Nav
    'nav.about': 'About',
    'nav.projects': 'Case Studies',
    'nav.skills': 'Stack',
    'nav.experience': 'Experience',
    'nav.testimonials': 'References',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',

    // Hero
    'hero.greeting': 'Software',
    'hero.role': 'Engineering Solutions',
    'hero.subtitle':
      'I design and build systems that solve real business problems. Specialized in scalable architectures, high-performance APIs, and interfaces users actually enjoy.',
    'hero.cta.projects': 'View Case Studies',
    'hero.cta.contact': "Let's Talk",

    // Stats
    'hero.stats.yearsExp': 'Years of experience',
    'hero.stats.systems': 'Production systems',
    'hero.stats.stack': 'Technologies mastered',

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
    'skills.dotnet.milestone3': 'REST APIs with resilience patterns',
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
    'about.subtitle': 'Full Stack Software Engineer',
    'about.description':
      'I build systems that scale. With years of experience in real enterprise projects, I specialize in designing architectures that solve bottlenecks, integrating complex systems, and leading legacy-to-modern transitions. I care about business impact, not just code.',

    // Experience
    'experience.title': 'Experience',
    'experience.subtitle': 'Professional track record with measurable impact',
    'experience.current': 'Current',
    'experience.achievements': 'Key achievements',

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

    // Testimonials
    'testimonials.title': 'References',
    'testimonials.subtitle': 'What people say about working with me',

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
  },
}

export function t(key: keyof TranslationKeys, lang: Language): string {
  return translations[lang][key]
}
