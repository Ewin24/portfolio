import { FadeIn } from '../../components/ui/FadeIn'
import { useTranslation } from '../../hooks/useTranslation'

export type EmptyContext = 'filters' | 'search' | 'none'

interface Props {
  context: EmptyContext
  searchQuery?: string
}

/**
 * Contextual empty state for blog views.
 * - filters: no posts match the active filters
 * - search: no results for the search query
 * - none: no posts exist at all
 *
 * Fixes bug #9 — no empty state for filters.
 */
export function EmptyState({ context, searchQuery = '' }: Props) {
  const { lang } = useTranslation()

  const labels: Record<EmptyContext, { title: string; description: string }> = {
    filters: {
      title: lang === 'es' ? 'Sin resultados' : 'No results',
      description:
        lang === 'es'
          ? 'No hay artículos que coincidan con los filtros seleccionados. Probá ajustando los criterios.'
          : 'No posts match your current filters. Try adjusting your criteria.',
    },
    search: {
      title:
        lang === 'es'
          ? `Sin resultados para "${searchQuery}"`
          : `No results for "${searchQuery}"`,
      description:
        lang === 'es'
          ? 'No encontramos artículos con ese término. Probá con otras palabras.'
          : "We couldn't find posts matching that term. Try different keywords.",
    },
    none: {
      title: lang === 'es' ? 'Próximamente' : 'Coming soon',
      description:
        lang === 'es'
          ? 'Todavía no hay artículos publicados. Volvé pronto.'
          : 'No articles published yet. Check back soon.',
    },
  }

  const { title, description } = labels[context]

  return (
    <FadeIn>
      <div className="border-2 border-ink bg-paper-dark p-8 md:p-12 text-center">
        <div className="max-w-md mx-auto">
          <h3 className="font-headline text-xl md:text-2xl font-bold text-ink mb-3">
            {title}
          </h3>
          <p className="font-sans text-sm text-ink-light leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </FadeIn>
  )
}
