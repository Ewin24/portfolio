import type { BlogPost } from '../blog/types'
import type { CaseStudy, WorkExperience } from '../types'
import { blogPosts } from '../blog/content/posts'
import { featuredCaseStudies } from './case-studies'
import { workExperience } from './experience'

/**
 * THE TECHNOLOGY STACK, AS THIS SITE'S OWN DATA SHOWS IT
 * ─────────────────────────────────────────────────────
 * Nothing here is a level, a year count or a percentage. A technology is
 * placed in one area and given the exact strings under which the rest of the
 * repository names it; everything the section shows (where it appears, how
 * often, whether it is in production today) is derived from those strings and
 * from three sources: the case studies, the roles and the blog posts.
 *
 * No React in this file: it can be read, imported and checked on its own.
 */

interface L {
  es: string
  en: string
}

export type AreaId = 'backend' | 'data' | 'frontend' | 'cloud' | 'quality' | 'ai'

export const AREAS: { id: AreaId; label: L }[] = [
  { id: 'backend', label: { es: 'Backend', en: 'Backend' } },
  { id: 'data', label: { es: 'Datos', en: 'Data' } },
  { id: 'frontend', label: { es: 'Frontend', en: 'Frontend' } },
  { id: 'cloud', label: { es: 'Nube y entrega', en: 'Cloud and delivery' } },
  { id: 'quality', label: { es: 'Calidad', en: 'Quality' } },
  { id: 'ai', label: { es: 'IA', en: 'AI' } },
]

export interface Technology {
  id: string
  name: string
  area: AreaId
  /** Exact entries of a `stack` array (case studies and roles) that mean this technology. */
  stack: string[]
  /** Exact blog tags that point to this technology. */
  tags: string[]
}

/**
 * The alias table. Matching is exact and case-sensitive: an entry counts only
 * if it is listed here, so every match can be reviewed by reading this table.
 * An empty list is a statement too: that source never names the technology.
 *
 * Blog categories are not aliased: the two that exist (`arquitectura`,
 * `ensayo`) name a kind of article, not a technology.
 */
export const TECHNOLOGIES: Technology[] = [
  {
    id: 'dotnet', name: '.NET / C#', area: 'backend',
    stack: ['.NET', '.NET 8', '.NET 8+', '.NET Core', '.NET Framework', '.NET MAUI', 'C#'],
    tags: ['.NET', 'C#', 'ASP.NET Core'],
  },
  { id: 'php', name: 'PHP / Laravel', area: 'backend', stack: ['PHP', 'Laravel'], tags: [] },
  { id: 'cleanarch', name: 'Clean Architecture', area: 'backend', stack: ['Clean Architecture'], tags: ['clean architecture'] },

  { id: 'sqlserver', name: 'SQL Server', area: 'data', stack: ['SQL Server'], tags: ['SQL Server', 'T-SQL'] },
  { id: 'indexeddb', name: 'IndexedDB', area: 'data', stack: ['IndexedDB'], tags: ['indexeddb'] },

  { id: 'react', name: 'React', area: 'frontend', stack: ['React', 'React 19'], tags: ['React', 'react'] },
  { id: 'typescript', name: 'TypeScript', area: 'frontend', stack: ['TypeScript'], tags: ['typescript'] },
  { id: 'flutter', name: 'Flutter', area: 'frontend', stack: ['Flutter', 'Flutter 3.44+', 'Dart'], tags: ['flutter'] },

  { id: 'aws', name: 'AWS', area: 'cloud', stack: ['AWS'], tags: [] },
  { id: 'docker', name: 'Docker', area: 'cloud', stack: ['Docker'], tags: [] },
  { id: 'cfworkers', name: 'Cloudflare Workers', area: 'cloud', stack: ['Cloudflare Workers'], tags: ['cloudflare-workers'] },

  { id: 'playwright', name: 'Playwright', area: 'quality', stack: ['Playwright'], tags: ['playwright'] },
  { id: 'vitest', name: 'Vitest', area: 'quality', stack: ['Vitest'], tags: [] },

  { id: 'ai', name: 'LLM / AI Agents', area: 'ai', stack: ['LLM tool calling'], tags: ['AI', 'agentes', 'agentes-ia'] },
  { id: 'geo', name: 'AI Discoverability', area: 'ai', stack: [], tags: [] },
]

export interface Evidence {
  cases: CaseStudy[]
  roles: WorkExperience[]
  posts: BlogPost[]
}

/** `current`: in production today. `past`: used before. `null`: the data does not decide. */
export type Status = 'current' | 'past' | null

const named = (aliases: string[], values: string[]) => values.some((value) => aliases.includes(value))

/** Whether a case study's or a role's `stack` names the technology. */
export const inStack = (tech: Technology, stack: string[]) => named(tech.stack, stack)

/** Where a technology appears, newest post first. */
export function evidenceOf(tech: Technology): Evidence {
  return {
    cases: featuredCaseStudies.filter((study) => inStack(tech, study.stack)),
    roles: workExperience.filter((role) => inStack(tech, role.stack)),
    posts: blogPosts
      .filter((post) => named(tech.tags, post.tags))
      .sort((a, b) => b.date.localeCompare(a.date)),
  }
}

/**
 * THE STATUS RULE
 * In the stack of a role marked `current` in `experience.ts`: in production
 * today. Only in past roles or in case studies: used before. In neither: no
 * status, because nothing in the data says which one it is.
 */
export function statusOf(evidence: Evidence): Status {
  if (evidence.roles.some((role) => role.current)) return 'current'
  if (evidence.roles.length > 0 || evidence.cases.length > 0) return 'past'
  return null
}

export interface StackEntry extends Technology, Evidence {
  status: Status
}

export interface StackArea extends Evidence {
  id: AreaId
  label: L
  technologies: StackEntry[]
}

const distinct = <T>(items: T[]) => [...new Set(items)]

/** The six areas with their technologies; an area's evidence is the union of its technologies', each item once. */
export const STACK: StackArea[] = AREAS.map((area) => {
  const technologies = TECHNOLOGIES.filter((tech) => tech.area === area.id).map((tech) => {
    const evidence = evidenceOf(tech)
    return { ...tech, ...evidence, status: statusOf(evidence) }
  })
  return {
    ...area,
    technologies,
    cases: distinct(technologies.flatMap((tech) => tech.cases)),
    roles: distinct(technologies.flatMap((tech) => tech.roles)),
    posts: distinct(technologies.flatMap((tech) => tech.posts)),
  }
})

/** The case studies in the order the map shows them. */
export const STACK_CASES: CaseStudy[] = featuredCaseStudies

/** A study's name short enough for a column or a list: its title up to the dash. */
export const shortTitle = (study: CaseStudy, lang: 'es' | 'en') =>
  (lang === 'es' ? study.title : study.titleEn).split(' — ')[0]
