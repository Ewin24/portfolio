import type { Language } from '../types'

type TranslationKeys = {
  // Nav
  'nav.about': string
  'nav.projects': string
  'nav.skills': string
  'nav.experience': string
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
  'projects.stack': string
  // Skills
  'skills.title': string
  'skills.subtitle': string
  'skills.languages': string
  'skills.frameworks': string
  'skills.tools': string
  'skills.activity': string
  // About
  'about.title': string
  'about.subtitle': string
  'about.description': string
  // Experience
  'experience.title': string
  'experience.subtitle': string
  'experience.current': string
  'experience.achievements': string
  // Contact
  'contact.title': string
  'contact.subtitle': string
  'contact.github': string
  'contact.email': string
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
    'projects.stack': 'Stack',

    // Skills
    'skills.title': 'Tech Stack',
    'skills.subtitle': 'Tecnologías con las que construyo sistemas en producción',
    'skills.languages': 'Lenguajes',
    'skills.frameworks': 'Frameworks & Librerías',
    'skills.tools': 'Infraestructura & Herramientas',
    'skills.activity': 'Uso por repositorios públicos',

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

    // Contact
    'contact.title': 'Contacto',
    'contact.subtitle': '¿Tienes un reto técnico que resolver?',
    'contact.github': 'Ver perfil en GitHub',
    'contact.email': 'Escribir email',
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
    'projects.stack': 'Stack',

    // Skills
    'skills.title': 'Tech Stack',
    'skills.subtitle': 'Technologies I use to build production systems',
    'skills.languages': 'Languages',
    'skills.frameworks': 'Frameworks & Libraries',
    'skills.tools': 'Infrastructure & Tools',
    'skills.activity': 'Usage by public repositories',

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

    // Contact
    'contact.title': 'Contact',
    'contact.subtitle': 'Have a technical challenge to solve?',
    'contact.github': 'View GitHub profile',
    'contact.email': 'Send email',
    'contact.cta': "Let's build something that matters",

    // Footer
    'footer.built': 'Built with',
    'footer.activity': 'Technical activity via GitHub API',
  },
}

export function t(key: keyof TranslationKeys, lang: Language): string {
  return translations[lang][key]
}
