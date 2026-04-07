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
  'hero.stats.repos': string
  'hero.stats.followers': string
  'hero.stats.years': string
  // Projects
  'projects.title': string
  'projects.subtitle': string
  'projects.viewAll': string
  'projects.viewRepo': string
  'projects.viewDemo': string
  'projects.noDescription': string
  // Skills
  'skills.title': string
  'skills.subtitle': string
  'skills.languages': string
  'skills.frameworks': string
  'skills.tools': string
  // About
  'about.title': string
  'about.subtitle': string
  'about.description': string
  // Experience
  'experience.title': string
  'experience.subtitle': string
  // Contact
  'contact.title': string
  'contact.subtitle': string
  'contact.github': string
  'contact.email': string
  'contact.cta': string
  // Footer
  'footer.built': string
  'footer.powered': string
}

const translations: Record<Language, TranslationKeys> = {
  es: {
    'nav.about': 'Sobre mí',
    'nav.projects': 'Proyectos',
    'nav.skills': 'Habilidades',
    'nav.experience': 'Experiencia',
    'nav.contact': 'Contacto',
    'hero.greeting': 'Hola, soy',
    'hero.role': 'Desarrollador Full Stack',
    'hero.subtitle': 'Construyo experiencias digitales con código limpio y tecnología moderna. Apasionado por la innovación y el aprendizaje continuo.',
    'hero.cta.projects': 'Ver proyectos',
    'hero.cta.contact': 'Contactarme',
    'hero.stats.repos': 'Repositorios',
    'hero.stats.followers': 'Seguidores',
    'hero.stats.years': 'Años en GitHub',
    'projects.title': 'Proyectos',
    'projects.subtitle': 'Mis proyectos más recientes traídos directamente desde GitHub',
    'projects.viewAll': 'Ver todos en GitHub',
    'projects.viewRepo': 'Ver código',
    'projects.viewDemo': 'Demo',
    'projects.noDescription': 'Sin descripción disponible',
    'skills.title': 'Tech Stack',
    'skills.subtitle': 'Tecnologías y herramientas que uso en mi día a día, detectadas automáticamente desde mis repositorios',
    'skills.languages': 'Lenguajes',
    'skills.frameworks': 'Frameworks & Librerías',
    'skills.tools': 'Herramientas & Plataformas',
    'about.title': 'Sobre mí',
    'about.subtitle': 'Conóceme un poco más',
    'about.description': 'Desarrollador Full Stack apasionado por crear soluciones tecnológicas innovadoras. Con experiencia en múltiples lenguajes y frameworks, disfruto construir desde microservicios hasta interfaces de usuario modernas.',
    'experience.title': 'Trayectoria',
    'experience.subtitle': 'Mi recorrido en el mundo del desarrollo',
    'contact.title': 'Contacto',
    'contact.subtitle': '¿Tienes un proyecto en mente? ¡Hablemos!',
    'contact.github': 'Ver perfil en GitHub',
    'contact.email': 'Enviar email',
    'contact.cta': 'Construyamos algo juntos',
    'footer.built': 'Construido con',
    'footer.powered': 'Datos traídos automáticamente desde GitHub API',
  },
  en: {
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
    'nav.contact': 'Contact',
    'hero.greeting': "Hi, I'm",
    'hero.role': 'Full Stack Developer',
    'hero.subtitle': 'I build digital experiences with clean code and modern technology. Passionate about innovation and continuous learning.',
    'hero.cta.projects': 'View projects',
    'hero.cta.contact': 'Get in touch',
    'hero.stats.repos': 'Repositories',
    'hero.stats.followers': 'Followers',
    'hero.stats.years': 'Years on GitHub',
    'projects.title': 'Projects',
    'projects.subtitle': 'My latest projects pulled directly from GitHub',
    'projects.viewAll': 'View all on GitHub',
    'projects.viewRepo': 'View code',
    'projects.viewDemo': 'Demo',
    'projects.noDescription': 'No description available',
    'skills.title': 'Tech Stack',
    'skills.subtitle': 'Technologies and tools I use daily, auto-detected from my repositories',
    'skills.languages': 'Languages',
    'skills.frameworks': 'Frameworks & Libraries',
    'skills.tools': 'Tools & Platforms',
    'about.title': 'About me',
    'about.subtitle': 'Get to know me',
    'about.description': 'Full Stack Developer passionate about creating innovative tech solutions. With experience across multiple languages and frameworks, I enjoy building everything from microservices to modern user interfaces.',
    'experience.title': 'Experience',
    'experience.subtitle': 'My journey in the development world',
    'contact.title': 'Contact',
    'contact.subtitle': 'Have a project in mind? Let\'s talk!',
    'contact.github': 'View GitHub profile',
    'contact.email': 'Send email',
    'contact.cta': "Let's build something together",
    'footer.built': 'Built with',
    'footer.powered': 'Data pulled automatically from GitHub API',
  },
}

export function t(key: keyof TranslationKeys, lang: Language): string {
  return translations[lang][key]
}
