import type { BlogPost } from '../types'

type L = { es: string; en: string }

export interface Series {
  /** The value posts carry in `series`. */
  id: string
  name: L
  description: L
}

/**
 * The series the blog presents as such. A post whose `series` is not listed
 * here is shown as a plain post. Order inside a series is `seriesOrder`.
 */
export const SERIES: Series[] = [
  {
    id: 'Working with AI',
    name: { es: 'Trabajar con AI', en: 'Working with AI' },
    description: {
      es: 'Ocho ensayos sobre programar con agentes, en orden: del arnés que rodea al modelo a escribir para un lector que también es un modelo.',
      en: 'Eight essays on programming with agents, in order: from the harness around the model to writing for a reader that is also a model.',
    },
  },
  {
    id: 'OSS Maintenance',
    name: { es: 'Mantenimiento OSS', en: 'OSS Maintenance' },
    description: {
      es: 'Lo que implica heredar y modernizar un proyecto Flutter de código abierto que nadie mantenía.',
      en: 'What it takes to inherit and modernize an open-source Flutter project nobody was maintaining.',
    },
  },
]

/** The series the home page showcases. */
export const SHOWCASED_SERIES = SERIES[0]

/** The parts of a series, in reading order. */
export function seriesParts(series: Series, posts: BlogPost[]): BlogPost[] {
  return posts
    .filter((p) => p.series === series.id)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0))
}

/** The series a post belongs to, its parts and the post's place among them; null for a plain post. */
export function seriesOf(post: BlogPost, posts: BlogPost[]) {
  const series = SERIES.find((s) => s.id === post.series)
  if (!series) return null
  const parts = seriesParts(series, posts)
  return { series, parts, index: parts.findIndex((p) => p.id === post.id) }
}

/** "Parte 3 de 8 · Trabajar con AI" */
export function partLabel(index: number, total: number, series: Series, lang: 'es' | 'en'): string {
  return `${lang === 'es' ? 'Parte' : 'Part'} ${index + 1} ${lang === 'es' ? 'de' : 'of'} ${total} · ${series.name[lang]}`
}

/** "Leíste 2 de 8"; with nothing read it says so, as the blog's own counter does. */
export function progressLabel(read: number, total: number, lang: 'es' | 'en'): string {
  if (read === 0) {
    return lang === 'es' ? `Aún no has leído ninguna de las ${total} partes` : `You have not read any of the ${total} parts yet`
  }
  return lang === 'es' ? `Leíste ${read} de ${total}` : `You have read ${read} of ${total}`
}
