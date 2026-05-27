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
  'skills.react.milestone1': string
  'skills.react.milestone2': string
  'skills.react.milestone3': string
  'skills.react.reference': string
  'skills.nodejs.milestone1': string
  'skills.nodejs.milestone2': string
  'skills.nodejs.milestone3': string
  'skills.nodejs.reference': string
  'skills.typescript.milestone1': string
  'skills.typescript.milestone2': string
  'skills.typescript.milestone3': string
  'skills.typescript.reference': string
  'skills.postgresql.milestone1': string
  'skills.postgresql.milestone2': string
  'skills.postgresql.milestone3': string
  'skills.postgresql.reference': string
  'skills.docker.milestone1': string
  'skills.docker.milestone2': string
  'skills.docker.milestone3': string
  'skills.docker.reference': string
  'skills.python.milestone1': string
  'skills.python.milestone2': string
  'skills.python.milestone3': string
  'skills.python.reference': string
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
    'skills.react.milestone1': 'Dominio de Arquitectura de Componentes',
    'skills.react.milestone2': 'Optimización de Rendimiento',
    'skills.react.milestone3': 'Patrones de Manejo de Estado',
    'skills.react.reference': 'Ver Proyectos del Portafolio',
    'skills.nodejs.milestone1': 'Diseño de APIs RESTful',
    'skills.nodejs.milestone2': 'Patrones Async / Await',
    'skills.nodejs.milestone3': 'Escalabilidad de Backend',
    'skills.nodejs.reference': 'Explorar Trabajo Backend',
    'skills.typescript.milestone1': 'Dominio del Sistema de Tipos',
    'skills.typescript.milestone2': 'Patrones Avanzados con Genéricos',
    'skills.typescript.milestone3': 'Configuración de Herramientas',
    'skills.typescript.reference': 'Ver Proyectos TypeScript',
    'skills.postgresql.milestone1': 'Optimización de Consultas',
    'skills.postgresql.milestone2': 'Diseño de Esquemas',
    'skills.postgresql.milestone3': 'Ajuste de Rendimiento',
    'skills.postgresql.reference': 'Ver Proyectos de Datos',
    'skills.docker.milestone1': 'Orquestación de Contenedores',
    'skills.docker.milestone2': 'Automatización de Despliegues',
    'skills.docker.milestone3': 'Integración CI / CD',
    'skills.docker.reference': 'Soluciones de Despliegue',
    'skills.python.milestone1': 'Ciencia de Datos & ML',
    'skills.python.milestone2': 'Automatización de Scripts',
    'skills.python.milestone3': 'Administración de Sistemas',
    'skills.python.reference': 'Explorar Trabajo en Python',

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
    'skills.react.milestone1': 'Component Architecture Mastery',
    'skills.react.milestone2': 'Performance Optimization',
    'skills.react.milestone3': 'State Management Patterns',
    'skills.react.reference': 'View Portfolio Projects',
    'skills.nodejs.milestone1': 'RESTful API Design',
    'skills.nodejs.milestone2': 'Async / Await Patterns',
    'skills.nodejs.milestone3': 'Backend Scalability',
    'skills.nodejs.reference': 'Explore Backend Work',
    'skills.typescript.milestone1': 'Type System Mastery',
    'skills.typescript.milestone2': 'Advanced Generic Patterns',
    'skills.typescript.milestone3': 'Tooling Configuration',
    'skills.typescript.reference': 'See TS Projects',
    'skills.postgresql.milestone1': 'Query Optimization',
    'skills.postgresql.milestone2': 'Schema Design',
    'skills.postgresql.milestone3': 'Performance Tuning',
    'skills.postgresql.reference': 'View Data Projects',
    'skills.docker.milestone1': 'Container Orchestration',
    'skills.docker.milestone2': 'Deployment Automation',
    'skills.docker.milestone3': 'CI / CD Integration',
    'skills.docker.reference': 'Deployment Solutions',
    'skills.python.milestone1': 'Data Science & ML',
    'skills.python.milestone2': 'Script Automation',
    'skills.python.milestone3': 'System Administration',
    'skills.python.reference': 'Explore Python Work',

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
