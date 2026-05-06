// ─── GitHub API Types ──────────────────────────────────────────────────────
export interface GitHubUser {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  public_repos: number
  followers: number
  following: number
  location: string | null
  blog: string
  company: string | null
  twitter_username: string | null
  created_at: string
  html_url: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  topics: string[]
  created_at: string
  updated_at: string
  pushed_at: string
  fork: boolean
  size: number
}

export interface GitHubLanguages {
  [language: string]: number
}

export type Language = 'es' | 'en'

export interface Section {
  id: string
  labelEs: string
  labelEn: string
}

// ─── Content Types (Hybrid Model) ──────────────────────────────────────────

/**
 * CaseStudy — Proyecto curado con formato STAR (Situation, Task, Action, Result).
 * Usado para proyectos principales, incluidos los privados/NDA.
 * El código fuente es OPCIONAL. El contexto y el impacto son OBLIGATORIOS.
 */
export interface CaseStudy {
  id: string
  slug: string

  /** Mostrar este proyecto destacado al tope de la sección */
  featured: boolean

  title: string
  titleEn: string

  /**
   * Nombre de la empresa/cliente. Si companyAnon=true, se muestra
   * como "Cliente Confidencial" o "Confidential Client"
   */
  company: string
  companyAnon?: boolean
  industry?: string

  /** Ej: "2023 – 2024" o "Feb 2022 – Presente" */
  period: string

  role: string
  roleEn: string

  /** EL PROBLEMA que resolviste (desde la perspectiva de negocio) */
  problem: string
  problemEn: string

  /** TU SOLUCIÓN y la arquitectura/decisiones tomadas */
  solution: string
  solutionEn: string

  /**
   * EL IMPACTO medible. Usa métricas reales.
   * Ej: "Reducción del 40% en tiempo de carga" no "Mejoré el rendimiento"
   */
  impact: string
  impactEn: string

  /** Stack de tecnologías utilizado */
  stack: string[]

  /** URL a diagrama de arquitectura (Excalidraw, draw.io, imagen) */
  architectureDiagram?: string

  /** Solo si el repo es público */
  githubUrl?: string
  demoUrl?: string

  /**
   * Si true: se muestra el disclaimer
   * "Código no disponible por políticas de confidencialidad.
   * Arquitectura y diseño de mi autoría."
   */
  hasNDA: boolean

  /** Tags para filtrado futuro */
  tags: string[]

  /** Orden de prioridad en el listado (menor = primero) */
  order: number
}

/**
 * WorkExperience — Historial laboral real.
 * Reemplaza la timeline de "repos por año" que viene del GitHub API.
 */
export interface WorkExperience {
  id: string
  company: string
  companyUrl?: string
  /** Logo URL o path local en /public */
  logo?: string

  role: string
  roleEn: string

  /** Ej: "Mar 2021 – Presente" */
  period: string
  current: boolean

  location: string
  locationEn?: string

  /**
   * Logros en formato STAR con métricas.
   * ❌ "Desarrollé APIs REST"
   * ✅ "Diseñé e implementé una API REST que redujo la latencia en 60%"
   */
  achievements: string[]
  achievementsEn: string[]

  stack: string[]

  /** Orden cronológico (mayor = más reciente) */
  order: number
}

/**
 * BlogPost — Para la sección futura de "Publicaciones Técnicas"
 * Puede venir de Dev.to/Hashnode API o ser manual.
 */
export interface BlogPost {
  id: string
  title: string
  url: string
  publishedAt: string
  readingTimeMin: number
  tags: string[]
  /** Si viene de API externa (Dev.to, Hashnode) */
  source: 'devto' | 'hashnode' | 'manual'
}
